import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireCapability } from '@/lib/admin-auth';
import { createAdminClient } from '@/utils/supabase/admin';
import { resendOutboxEmail, getOutboxStats } from '@/lib/email-outbox';
import { getResendConfigStatus } from '@/lib/resend-client';
import {
    startOperation,
    getOrCreateCorrelationId,
    logSuccess,
    logWarn,
    logError,
    maskEmail,
    jsonWithCorrelation,
    errorWithCorrelation,
    type OperationContext,
} from '@/lib/voltris-log';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET/POST /api/admin/emails — HISTÓRICO DE E-MAIL TRANSACIONAL (missão §13).
 *
 * Por que uma API e não o cliente Supabase direto (como nas outras abas admin):
 * a tabela `email_outbox` tem RLS ligado SEM policy para `authenticated` (ver
 * migration). O motivo é objetivo: ela guarda o corpo HTML do e-mail, o
 * endereço do destinatário e a fatura em base64. Se o admin lesse direto do
 * navegador, qualquer usuário autenticado com um JWT válido — ou seja, QUALQUER
 * cliente com conta — leria o histórico de e-mail dos outros. A API exige
 * `profiles.is_admin` no servidor antes de tocar na tabela.
 *
 * O que esta rota NÃO faz:
 *   - devolve `attachment_content` (a fatura em base64 não é Needed para ler o
 *     histórico e inflaria a resposta em ~1 MB por linha);
 *   - permite editar e-mail já enviado — o registro é a evidência do que saiu;
 *   - permite escolher destinatário no reenvio — só reenvia para quem原本 era.
 */

// ---------------------------------------------------------------------------
// GET — listagem + saúde da fila
// ---------------------------------------------------------------------------

const ListQuery = z.object({
    status: z.enum(['all', 'pending', 'processing', 'sent', 'failed', 'canceled'])
        .optional().default('all'),
    template: z.string().trim().max(60).optional(),
    /** busca por destinatário, chave de idempotência ou id. */
    q: z.string().trim().max(120).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional().default(25),
    offset: z.coerce.number().int().min(0).optional().default(0),
});

export async function GET(req: NextRequest) {
    const correlationId = getOrCreateCorrelationId(req);
    const ctx = startOperation('ADMIN_EMAILS', correlationId);

    const guard = await requireCapability('emails.read');
    if (guard.response) return guard.response;

    const parsed = ListQuery.safeParse(Object.fromEntries(req.nextUrl.searchParams));
    if (!parsed.success) {
        return errorWithCorrelation(ctx, 400, 'INVALID_QUERY', 'Filtros inválidos.', {
            expose: true,
            details: { issues: parsed.error.issues.map((i) => i.message) },
        });
    }

    const { status, template, q, limit, offset } = parsed.data;
    const admin = createAdminClient();

    try {
        let query = admin
            .from('email_outbox')
            .select(
                'id, template_type, idempotency_key, recipient_email, user_id, payment_id, license_key, subscription_id, subject, attachment_name, attachment_size, status, provider_message_id, attempts, available_at, last_error, last_error_kind, sent_at, delivery_status, delivery_flag, created_at, updated_at',
                { count: 'exact' }
            )
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (status !== 'all') query = query.eq('status', status);
        if (template) query = query.eq('template_type', template);

        // `q` busca por três campos com OR explícito. Um `.or()` sem filtro de
        // status junto continua restrito às linhas de e-mail — nunca vaza outra
        // tabela — mas manter o filtro aplicado ANTES do `.or()` garante que a
        // paginação não "pule" linhas que não casam.
        if (q) {
            const safe = q.replace(/[,()%]/g, ' ').trim();
            if (safe) {
                query = query.or(
                    `recipient_email.ilike.%${safe}%,idempotency_key.ilike.%${safe}%,subject.ilike.%${safe}%`
                );
            }
        }

        const { data, error: queryErr, count } = await query;

        if (queryErr) {
            logError(ctx, 'falha ao consultar historico de e-mail', { error: queryErr.message });
            return errorWithCorrelation(ctx, 500, 'QUERY_FAILED', 'Falha ao consultar o histórico de e-mail.');
        }

        const rows = (data ?? []) as Array<Record<string, unknown>>;

        // Máscara applied no SERVIDOR: nem um admin vê o e-mail completo por
        // padrão. O identificador do cliente continua presente para o suporte
        // cruzar com o pedido, sem expor o endereço a quem não precisa dele.
        const items = rows.map((r) => ({
            ...r,
            recipient_email: maskEmail(String(r.recipient_email ?? '')),
        }));

        const stats = await getOutboxStats(admin);
        const config = getResendConfigStatus();

        logSuccess(ctx, 'historico de e-mail consultado', {
            total: count ?? 0, status_filter: status,
        });

        return jsonWithCorrelation(ctx, {
            items,
            pagination: {
                total: count ?? 0,
                limit,
                offset,
                hasMore: offset + rows.length < (count ?? 0),
            },
            stats,
            maxAttempts: 5,
            config,
        });
    } catch (e: any) {
        logError(ctx, 'erro inesperado ao listar e-mails', { error: String(e?.message ?? e).slice(0, 200) });
        return errorWithCorrelation(ctx, 500, 'UNEXPECTED', 'Erro interno.');
    }
}

// ---------------------------------------------------------------------------
// POST — reenvio manual AUDITADO (missão §11 requisito 11 e §13)
// ---------------------------------------------------------------------------

const ActionBody = z.object({
    outboxId: z.string().uuid('Identificador inválido.'),
});

export async function POST(req: NextRequest) {
    const correlationId = getOrCreateCorrelationId(req);
    const ctx: OperationContext = startOperation('ADMIN_EMAILS', correlationId);

    const guard = await requireCapability('emails.resend');
    if (guard.response) return guard.response;
    const adminUserId = guard.actor!.userId;

    let body: unknown;
    try {
        body = await req.json();
    } catch {
        return errorWithCorrelation(ctx, 400, 'INVALID_JSON', 'Corpo da requisição inválido.');
    }

    const parsed = ActionBody.safeParse(body);
    if (!parsed.success) {
        return errorWithCorrelation(ctx, 400, 'INVALID_BODY', 'Dados inválidos.', {
            expose: true,
            details: { issues: parsed.error.issues.map((i) => i.message) },
        });
    }

    try {
        const outcome = await resendOutboxEmail(parsed.data.outboxId, adminUserId);

        if (!outcome.ok) {
            logWarn(ctx, 'reenvio manual recusado', { outbox_id: parsed.data.outboxId, reason: outcome.error });
            return NextResponse.json(
                { error: outcome.error, correlation_id: ctx.correlationId },
                { status: 409, headers: { 'x-correlation-id': ctx.correlationId } }
            );
        }

        logSuccess(ctx, 'reenvio manual solicitado', {
            outbox_id: parsed.data.outboxId,
            admin: adminUserId,
        });

        return jsonWithCorrelation(ctx, {
            ok: true,
            message: 'Reenvio enfileirado. Use "Processar fila agora" para processar imediatamente.',
        });
    } catch (e: any) {
        logError(ctx, 'erro ao enfileirar reenvio', { error: String(e?.message ?? e).slice(0, 200) });
        return errorWithCorrelation(ctx, 500, 'RESEND_FAILED', 'Não foi possível enfileirar o reenvio.');
    }
}
