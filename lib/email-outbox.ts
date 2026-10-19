/**
 * TRANSACTIONAL EMAIL OUTBOX (missão §11).
 *
 * É esta a peça que faz "enviar e-mail" ser confiável. O ponto de partida é a
 * regra que a missão esgrada em letras garrafais:
 *
 *   "A emissão da licença e a confirmação do pagamento NÃO podem depender de a
 *    Resend estar disponível."
 *
 * Então o desenho é TRANSACIONAL-OUTBOX, e não "enviar direto no webhook":
 *
 *   1. O webhook confirma o pagamento e emite a licença (caminho já testado).
 *   2. No MESMO passo, grava a intenção de e-mail na tabela `email_outbox`.
 *      Se a gravação falhar, a compra continua válida — só o aviso se atrasa.
 *   3. O worker pega as linhas pendentes, chama a Resend e grava o resultado.
 *   4. Se a Resend falhar, a linha volta para `pending` com backoff, até um
 *      teto de tentativas; depois vai para `failed` e vira visível no admin.
 *
 * Por que não dá para usar só o Stripe ou só a Vercel:
 *   - chamar a Resend direto do webhook mistura "confirmar o dinheiro" com
 *     "avisar o cliente". Se a Resend estiver fora, o cliente paga e não
 *     recebe nada, ou pior, o webhook dá 500 e a Stripe reenvia o evento;
 *   - um array em memória morre no fim da função serverless, então todo
 *     estado de fila tem de morar no Postgres.
 *
 * Idempotência — o ponto mais delicado:
 *   - `idempotency_key` tem índice ÚNICO no banco. Um segundo `checkout.session.completed`
 *     do mesmo evento cai em conflito de índice e vira no-op. Isso resolve o
 *     cenário "Stripe reenvia o webhook" sem depender de lógica de aplicação;
 *   - a RESEND também recebe a mesma `idempotency_key` como header. Cobre o
 *     caso em que a Resend aceita a mensagem e a resposta se perde no caminho
 *     de volta (a missão pede explicitamente para não ignorar essa ambiguidade);
 *   - a troca do worker para uma linha é feita com `UPDATE ... WHERE status='pending'`
 *     devolvendo as linhas: se zero, outro worker já pegou. Sem `SELECT` seguido
 *     de `UPDATE`, dois workers<V concurrently> mandariam o mesmo e-mail.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import { createAdminClient } from '@/utils/supabase/admin';
import { sendEmail, isValidEmail, type ClassifiedResendError } from '@/lib/resend-client';
import {
    logSuccess,
    logWarn,
    logError,
    logInfo,
    maskEmail,
    type OperationContext,
} from '@/lib/voltris-log';

// ============================================================================
// TIPOS
// ============================================================================

export type EmailTemplateType =
    | 'purchase_confirmation'
    | 'subscription_renewed'
    | 'renewal_canceled'
    | 'refund_requested'
    | 'refund_processing'
    | 'refund_confirmed'
    | 'refund_failed'
    | 'payment_failed';

export type EmailOutboxStatus =
    /** Aguardando envio (primeira tentativa ou retry programado). */
    | 'pending'
    /** Reservado por um worker — evita envio concorrente. */
    | 'processing'
    /** A Resend ACEITOU a mensagem. NÃO significa entregue na caixa. */
    | 'sent'
    /** Rejeitado definitivamente (credencial, remetente, payload). */
    | 'failed'
    /** Cancelado de propósito (ex.: compra reclassificada). */
    | 'canceled';

export interface EnqueueInput {
    template: EmailTemplateType;
    /** E-mail do destinatário. Se ausente, é resolvido pelo userId. */
    to?: string | null;
    userId?: string | null;
    paymentId?: string | null;
    licenseKey?: string | null;
    subscriptionId?: string | null;
    /**
     * CHAVE DE IDEMPOTÊNCIA DO EVENTO LÓGICO.
     *
     * Regra de ouro: deve ser determinística a partir do fato de negócio, nunca
     * de `Date.now()` ou `Math.random()`. Exemplos:
     *   `purchase:<payment_id>`            → um e-mail por compra
     *   `renewal:<stripe_invoice_id>`      → um e-mail por cobrança recorrente
     *   `cancel:<subscription_id>:<data>`  → um e-mail por cancelamento
     */
    idempotencyKey: string;
    /** Dados já renderizados; evita re-renderizar e divergir do que foi enviado. */
    subject: string;
    html: string;
    text: string;
    /** PDF em bytes, anexado. */
    attachment?: { filename: string; content: Buffer } | null;
    /** Contexto para o admin (não contém PII além do necessário). */
    meta?: Record<string, unknown>;
}

export interface EnqueueResult {
    queued: boolean;
    /** true quando já existia uma linha com a mesma chave (evento repetido). */
    duplicate: boolean;
    outboxId: string | null;
}

// ============================================================================
// FILA
// ============================================================================

/**
 * Grava a intenção de envio. NUNCA lança por falha de e-mail: uma exceção aqui
 * derrubaria a emissão da licença junto, que é exatamente o que a missão proíbe.
 * No máximo registra o erro e devolve `queued: false`.
 */
export async function enqueueEmail(
    input: EnqueueInput,
    supabase: SupabaseClient = createAdminClient(),
    ctx?: OperationContext
): Promise<EnqueueResult> {
    try {
        let recipient = (input.to ?? '').trim();

        // Sem destinatário no payload: resolve pelo usuário. A e-mail é do
        // cliente e vem da sessão/banco, nunca do corpo de uma requisição.
        if (!recipient && input.userId) {
            const { data } = await supabase
                .from('profiles')
                .select('email')
                .eq('id', input.userId)
                .maybeSingle();
            recipient = (data?.email ?? '').trim();
        }

        if (!isValidEmail(recipient)) {
            logWarn(ctx ?? fallbackCtx('EMAIL_ENQUEUE'), 'destinatario invalido — nada enfileirado', {
                userId: input.userId ?? null,
                template: input.template,
            });
            return { queued: false, duplicate: false, outboxId: null };
        }

        const { data, error } = await supabase
            .from('email_outbox')
            .insert({
                template_type: input.template,
                idempotency_key: input.idempotencyKey,
                recipient_email: recipient,
                user_id: input.userId ?? null,
                payment_id: input.paymentId ?? null,
                license_key: input.licenseKey ?? null,
                subscription_id: input.subscriptionId ?? null,
                subject: input.subject.slice(0, 300),
                html_body: input.html,
                text_body: input.text,
                attachment_name: input.attachment?.filename ?? null,
                attachment_content: input.attachment
                    ? Buffer.from(input.attachment.content).toString('base64')
                    : null,
                attachment_size: input.attachment?.content.length ?? null,
                status: 'pending',
                attempts: 0,
                meta: input.meta ?? null,
                available_at: new Date().toISOString(),
            })
            .select('id')
            .single();

        if (error) {
            // 23505 = já existe linha com esta chave. É o caminho ESPERADO quando
            // a Stripe reenvia um webhook: o e-mail já foi (ou será) enviado.
            if (error.code === '23505' || /duplicate key/i.test(error.message)) {
                logInfo(ctx ?? fallbackCtx('EMAIL_ENQUEUE'), 'evento repetido — outbox ja possui a chave', {
                    key: input.idempotencyKey,
                    template: input.template,
                });
                return { queued: true, duplicate: true, outboxId: null };
            }

            logError(ctx ?? fallbackCtx('EMAIL_ENQUEUE'), 'falha ao gravar no outbox', {
                error: error.message,
                template: input.template,
                key: input.idempotencyKey,
            });
            return { queued: false, duplicate: false, outboxId: null };
        }

        logSuccess(ctx ?? fallbackCtx('EMAIL_ENQUEUE'), 'email enfileirado', {
            template: input.template,
            to: maskEmail(recipient),
            key: input.idempotencyKey,
        });

        return { queued: true, duplicate: false, outboxId: (data as { id: string }).id };
    } catch (err: any) {
        // Última linha de defesa: o e-mail NUNCA derruba o fluxo comercial.
        logError(ctx ?? fallbackCtx('EMAIL_ENQUEUE'), 'excecao ao enfileirar email', {
            error: String(err?.message ?? err).slice(0, 200),
            template: input.template,
        });
        return { queued: false, duplicate: false, outboxId: null };
    }
}

// ============================================================================
// WORKER
// ============================================================================

export const MAX_ATTEMPTS = 5;

/**
 * Backoff exponencial COM JITTER.
 *
 * O jitter não é enfeite: sem ele, N linhas que falharam juntas (p.ex. durante
 * uma indisponibilidade da Resend) voltam para a fila no mesmo instante e
 * repetem a rajada — o oposto do que se quer.
 */
export function backoffMs(attempt: number, retryAfterSec?: number): number {
    if (retryAfterSec && retryAfterSec > 0) return retryAfterSec * 1000;
    const base = Math.min(2 ** (attempt - 1) * 60_000, 6 * 60 * 60_000); // máx. 6 h
    const jitter = Math.floor(base * 0.3 * Math.random());
    return base + jitter;
}

export interface ProcessResult {
    processed: number;
    sent: number;
    failed: number;
    retried: number;
    skipped: number;
}

interface OutboxRow {
    id: string;
    template_type: string;
    idempotency_key: string;
    recipient_email: string;
    subject: string;
    html_body: string;
    text_body: string | null;
    attachment_name: string | null;
    attachment_content: string | null;
    payment_id: string | null;
    license_key: string | null;
    subscription_id: string | null;
    user_id: string | null;
    attempts: number;
    status: string;
    meta: Record<string, unknown> | null;
    available_at: string | null;
    created_at: string;
}

/**
 * Processa a fila. Seguro para chamar em paralelo: a reserva da linha é
 * atômica no banco.
 *
 * @param limit teto de linhas por passagem (protege o tempo da função serverless)
 */
export async function processOutbox(
    limit = 10,
    supabase: SupabaseClient = createAdminClient(),
    ctx?: OperationContext
): Promise<ProcessResult> {
    const opCtx = ctx ?? fallbackCtx('EMAIL_WORKER');
    const result: ProcessResult = { processed: 0, sent: 0, failed: 0, retried: 0, skipped: 0 };

    // 1. Reserva atômica: só o worker que conseguir marcar `processing` envia.
    //    `.in('status', ['pending','processing'])` + `available_at <= now` cobre
    //    tanto a fila nova quanto a recuperação de linhas presas em processing
    //    por um worker que morreu (FASE 11, requisito 8).
    const { data: claimed, error: claimErr } = await supabase
        .from('email_outbox')
        .update({ status: 'processing', updated_at: new Date().toISOString() })
        .in('status', ['pending', 'processing'])
        .lte('available_at', new Date().toISOString())
        // Linhas em 'processing' há mais de 5 min são consideradas órfãs.
        .or(`status.eq.pending,updated_at.lt.${new Date(Date.now() - 5 * 60_000).toISOString()}`)
        .order('available_at', { ascending: true })
        .limit(limit)
        .select('*');

    if (claimErr) {
        logError(opCtx, 'nao foi possivel reservar linhas do outbox', { error: claimErr.message });
        return result;
    }

    const rows = (claimed ?? []) as OutboxRow[];

    for (const row of rows) {
        result.processed += 1;
        try {
            const attempts = (row.attempts ?? 0) + 1;

            const send = await sendEmail({
                to: row.recipient_email,
                subject: row.subject,
                html: row.html_body,
                ...(row.text_body ? { text: row.text_body } : {}),
                ...(row.attachment_name && row.attachment_content
                    ? {
                        attachments: [{
                            filename: row.attachment_name,
                            content: Buffer.from(row.attachment_content, 'base64'),
                        }],
                    }
                    : {}),
                // Mesma chave da fila: cobre o timeout em que a Resend aceita e
                // a resposta se perde.
                idempotencyKey: row.idempotency_key,
                tags: [
                    { name: 'template', value: row.template_type },
                    ...(row.payment_id ? [{ name: 'payment', value: row.payment_id }] : []),
                ],
            });

            if (send.ok) {
                await supabase.from('email_outbox').update({
                    status: 'sent',
                    provider_message_id: send.providerMessageId,
                    sent_at: new Date().toISOString(),
                    attempts,
                    last_error: null,
                    updated_at: new Date().toISOString(),
                }).eq('id', row.id);
                result.sent += 1;
                logSuccess(opCtx, 'email aceito pela Resend', {
                    template: row.template_type,
                    to: maskEmail(row.recipient_email),
                    provider_id: send.providerMessageId,
                });
                continue;
            }

            const err: ClassifiedResendError | undefined = send.error;
            const exhausted = attempts >= MAX_ATTEMPTS;

            if (!err?.retryable || exhausted) {
                await supabase.from('email_outbox').update({
                    status: 'failed',
                    attempts,
                    last_error: (err?.message ?? 'erro desconhecido').slice(0, 500),
                    last_error_kind: err?.kind ?? 'UNKNOWN',
                    updated_at: new Date().toISOString(),
                }).eq('id', row.id);
                result.failed += 1;
                logError(opCtx, 'email falhou definitivamente', {
                    template: row.template_type,
                    to: maskEmail(row.recipient_email),
                    kind: err?.kind,
                    attempts,
                });
                continue;
            }

            const wait = backoffMs(attempts, err?.retryAfterSec);
            await supabase.from('email_outbox').update({
                status: 'pending',
                attempts,
                last_error: (err?.message ?? 'erro desconhecido').slice(0, 500),
                last_error_kind: err?.kind ?? 'UNKNOWN',
                available_at: new Date(Date.now() + wait).toISOString(),
                updated_at: new Date().toISOString(),
            }).eq('id', row.id);
            result.retried += 1;
            logWarn(opCtx, 'email falhou de forma transitoria — reagendado', {
                template: row.template_type,
                kind: err?.kind,
                attempts,
                retry_in_ms: wait,
            });
        } catch (err: any) {
            // Um erro aqui é um bug nosso, não da Resend. A linha volta para a
            // fila em vez de ficar presa em 'processing' para sempre.
            result.skipped += 1;
            logError(opCtx, 'erro ao processar linha do outbox', {
                outbox_id: row.id,
                error: String(err?.message ?? err).slice(0, 200),
            });
            await supabase.from('email_outbox').update({
                status: 'pending',
                last_error: String(err?.message ?? err).slice(0, 500),
                available_at: new Date(Date.now() + 60_000).toISOString(),
                updated_at: new Date().toISOString(),
            }).eq('id', row.id);
        }
    }

    return result;
}

/**
 * Reenvio manual e AUDITADO (FASE 11, requisito 11 / §13).
 *
 * Não reutiliza a `idempotency_key` original de propósito: se usasse a mesma,
 * a Resend recusaria como duplicata e o "reenvio" não enviaria nada. A chave
 * nova é `{original}.resend:{timestamp}`, o que deixa rastreável qual linha foi
 * reenviada por quem.
 */
export async function resendOutboxEmail(
    outboxId: string,
    adminUserId: string
): Promise<{ ok: boolean; error?: string }> {
    const ctx = fallbackCtx('EMAIL_RESEND');
    const supabase = createAdminClient();

    const { data: row, error } = await supabase
        .from('email_outbox')
        .select('*')
        .eq('id', outboxId)
        .maybeSingle();

    if (error || !row) {
        return { ok: false, error: 'Registro não encontrado.' };
    }

    const r = row as OutboxRow;

    // Reenvio só faz sentido para linha que falhou ou ainda está pendente.
    if (r.status === 'sent') {
        return { ok: false, error: 'Este e-mail já foi aceito pela Resend. Reenviar criaria duplicidade.' };
    }

    const newKey = `${r.idempotency_key}.resend:${Date.now()}`;

    const result = await enqueueEmail(
        {
            template: r.template_type as EmailTemplateType,
            to: r.recipient_email,
            idempotencyKey: newKey,
            subject: r.subject,
            html: r.html_body,
            text: r.text_body ?? '',
            paymentId: null,
            attachment: r.attachment_name && r.attachment_content
                ? { filename: r.attachment_name, content: Buffer.from(r.attachment_content, 'base64') }
                : null,
            meta: {
                manual_resend: true,
                original_outbox_id: outboxId,
                requested_by: adminUserId,
            },
        },
        supabase,
        ctx
    );

    if (!result.queued) {
        return { ok: false, error: 'Não foi possível enfileirar o reenvio.' };
    }

    // Marca a original como "reenviada", sem apagar o histórico dela.
    await supabase.from('email_outbox').update({
        status: 'canceled',
        last_error: 'Reenviado manualmente por administrador.',
        meta: { ...(r.meta ?? {}), manual_resend: true },
        updated_at: new Date().toISOString(),
    }).eq('id', outboxId);

    await supabase.from('audit_logs').insert({
        event_type: 'EMAIL_MANUAL_RESEND',
        metadata: {
            outbox_id: outboxId,
            template: r.template_type,
            admin_user_id: adminUserId,
            at: new Date().toISOString(),
        },
    });

    logSuccess(ctx, 'reenvio manual enfileirado', { outbox_id: outboxId, admin: adminUserId });
    return { ok: true };
}

// ============================================================================
// DIAGNÓSTICO
// ============================================================================

export interface OutboxStats {
    pending: number;
    processing: number;
    sent: number;
    failed: number;
    canceled: number;
    /** Idade da linha pendente mais antiga, em minutos. */
    oldestPendingMinutes: number | null;
    /** Sinal de fila travada: pendente há muito tempo. */
    backlogWarning: boolean;
}

/** Acima disso, a fila não é "atrasada", está PRESA. */
const BACKLOG_WARNING_MINUTES = 30;

/** Resumo para o admin e para a rota de diagnóstico. */
export async function getOutboxStats(supabase: SupabaseClient = createAdminClient()): Promise<OutboxStats> {
    const { data } = await supabase.from('email_outbox').select('status, available_at, created_at').limit(5000);
    const rows = (data ?? []) as Array<{ status: string; available_at: string; created_at: string }>;

    const stats: OutboxStats = {
        pending: 0, processing: 0, sent: 0, failed: 0, canceled: 0,
        oldestPendingMinutes: null,
        backlogWarning: false,
    };

    let oldest: number | null = null;
    for (const r of rows) {
        if (r.status === 'pending') {
            stats.pending += 1;
            const t = new Date(r.created_at).getTime();
            if (Number.isFinite(t) && (oldest === null || t < oldest)) oldest = t;
        } else if (r.status === 'processing') stats.processing += 1;
        else if (r.status === 'sent') stats.sent += 1;
        else if (r.status === 'failed') stats.failed += 1;
        else if (r.status === 'canceled') stats.canceled += 1;
    }

    stats.oldestPendingMinutes =
        oldest === null ? null : Math.floor((Date.now() - oldest) / 60_000);

    stats.backlogWarning =
        stats.oldestPendingMinutes !== null && stats.oldestPendingMinutes >= BACKLOG_WARNING_MINUTES;

    return stats;
}

/** Ctx descartável para quando o chamador não tem um (uso pontual). */
function fallbackCtx(operation: 'EMAIL_ENQUEUE' | 'EMAIL_WORKER' | 'EMAIL_RESEND'): OperationContext {
    return {
        correlationId: `${operation}-${Date.now().toString(36)}`,
        operation,
        startedAt: Date.now(),
        meta: {},
    };
}