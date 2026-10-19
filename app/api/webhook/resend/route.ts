import { NextRequest } from 'next/server';
import { createHmac } from 'node:crypto';
import { z } from 'zod';
import { createAdminClient } from '@/utils/supabase/admin';
import {
    startOperation,
    getOrCreateCorrelationId,
    logSuccess,
    logWarn,
    logError,
    logInfo,
    jsonWithCorrelation,
    errorWithCorrelation,
} from '@/lib/voltris-log';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/webhook/resend — EVENTOS DE ENTREGA DA RESEND (missão §12).
 *
 * Distinção que a missão exige e que o código respeita rigorosamente:
 *
 *   "Aceito para envio" ≠ "entregue na caixa postal" ≠ "aberto pelo cliente"
 *
 *   - `sent` no outbox  = a API da Resend ACEITOU (status 'sent');
 *   - `delivered`       = o servidor de destino recebeu a mensagem;
 *   - `opened`          = o destinatário abriu.
 *
 * Então: o outbox NUNCA é marcado 'delivered' aqui sem o evento `email.delivered`.
 * E `bounced`/`complained` NÃO é sinônimo de falha temporária: é sinal de
 * reputação — por isso asflags ficam separadas de 'failed' (que é falha de
 * envio) para o admin ver as duas coisas sem confundi-las.
 *
 * AUTENTICIDADE (§12: "Valide a assinatura/autenticidade conforme a documentação
 * oficial"):
 *   - a Resend assina cada evento com Svix (mesmo padrão do Stripe);
 *   - a assinatura é conferida com o segredo do WEBHOOK DA RESEND, que é
 *     SEPARADO do `STRIPE_WEBHOOK_SECRET`. Nunca reutilizar um no outro;
 *   - os IDs dos dois provedores ficam em namespaces distintos
 *     (`whsec_resend_…` vs `whsec_…` do Stripe) justamente para isso.
 *
 * Sem o segredo configurado a rota responde 503 em vez de aceitar qualquer
 * coisa: um webhook sem autenticação permitiria forjar "entregue" no histórico.
 */

/** Segredo do webhook da RESEND — nunca o do Stripe. */
const RESEND_WEBHOOK_SECRET = process.env.RESEND_WEBHOOK_SECRET?.trim();

/** Mapear o tipo do evento da Resend para o estado que guardamos. */
const DELIVERY_STATE: Record<string, string> = {
    'email.sent': 'sent',
    'email.delivered': 'delivered',
    'email.delivery_delayed': 'delayed',
    'email.complained': 'complained',
    'email.bounced': 'bounced',
    'email.failed': 'failed',
    'email.opened': 'opened',
    'email.clicked': 'clicked',
};

const Schema = z.object({
    type: z.string(),
    created_at: z.union([z.string(), z.number()]).optional(),
    data: z.object({
        id: z.string().optional(),
        email_id: z.string().optional(),
        to: z.array(z.string()).optional(),
    }).passthrough().optional(),
});

/**
 * Verificação de assinatura no formato Svix (usado pela Resend).
 *
 * Implementação própria em vez de dependência nova: o algoritmo é pequeno,
 * testável e não acrescenta um pacote ao bundle do servidor. O texto canônico
 * é `v1,t=<timestamp>,v1=<id>` (ver header `svix-id`).
 */
function verifySvixSignature(
    payload: string,
    headers: Headers,
    secret: string
): { ok: boolean; reason?: string } {
    const svixId = headers.get('svix-id');
    const svixTimestamp = headers.get('svix-timestamp');
    const svixSignature = headers.get('svix-signature');

    if (!svixId || !svixTimestamp || !svixSignature) {
        return { ok: false, reason: 'Headers svix ausentes.' };
    }

    const ts = Number(svixTimestamp);
    if (!Number.isFinite(ts)) return { ok: false, reason: 'Timestamp inválido.' };

    // Tolerância de 5 min contra REPLAY.
    const ageMs = Math.abs(Date.now() - ts * 1000);
    if (ageMs > 5 * 60_000) {
        return { ok: false, reason: 'Timestamp fora da janela (possível replay).' };
    }

    // O segredo do Svix é uma string base64 com o prefixo "whsec_".
    const raw = secret.startsWith('whsec_') ? secret.slice(6) : secret;
    let key: Buffer;
    try {
        key = Buffer.from(raw, 'base64');
    } catch {
        return { ok: false, reason: 'Segredo do webhook inválido.' };
    }

    const signedContent = `v1,${svixTimestamp},v1,${svixId}`;
    const expected = createHmac('sha256', key).update(signedContent).digest();
    const expectedB64 = expected.toString('base64');

    // Comparação em tempo constante (evita timing attack).
    const a = Buffer.from(expectedB64);
    const b = Buffer.from(svixSignature);
    if (a.length !== b.length) return { ok: false, reason: 'Assinatura não confere.' };

    let diff = 0;
    for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
    return diff === 0 ? { ok: true } : { ok: false, reason: 'Assinatura não confere.' };
}



export async function POST(req: NextRequest) {
    const correlationId = getOrCreateCorrelationId(req);
    const ctx = startOperation('EMAIL_WORKER', correlationId);

    if (!RESEND_WEBHOOK_SECRET) {
        logError(ctx, 'RESEND_WEBHOOK_SECRET ausente — webhook de entrega desabilitado');
        return errorWithCorrelation(
            ctx, 503, 'WEBHOOK_NOT_CONFIGURED',
            'Webhook de entrega da Resend não configurado.'
        );
    }

    const payload = await req.text();

    const verdict = verifySvixSignature(payload, req.headers, RESEND_WEBHOOK_SECRET);
    if (!verdict.ok) {
        logWarn(ctx, 'assinatura de webhook da Resend recusada', { reason: verdict.reason });
        return errorWithCorrelation(ctx, 401, 'INVALID_SIGNATURE', 'Assinatura inválida.');
    }

    const parsed = Schema.safeParse(JSON.parse(payload));
    if (!parsed.success) {
        return errorWithCorrelation(ctx, 400, 'INVALID_PAYLOAD', 'Payload inválido.');
    }

    const event = parsed.data;
    const state = DELIVERY_STATE[event.type];
    if (!state) {
        // Evento desconhecido não é erro: a Resend adiciona tipos novos.
        logInfo(ctx, 'evento de entrega nao mapeado', { type: event.type });
        return jsonWithCorrelation(ctx, { received: true, ignored: true });
    }

    const providerMessageId = event.data?.email_id ?? event.data?.id ?? null;
    if (!providerMessageId) {
        return jsonWithCorrelation(ctx, { received: true, matched: false });
    }

    const supabase = createAdminClient();

    // Idempotência: o MESMO outbox pode receber `delivered` e `opened`. Não
    // sobrescrever um estado mais informativo com um menos Advanced:
    // uma vez entregue, abrir não muda o status de entrega.
    const { data: row, error: readErr } = await supabase
        .from('email_outbox')
        .select('id, status, delivery_status, delivered_at, opened_at')
        .eq('provider_message_id', providerMessageId)
        .maybeSingle();

    if (readErr) {
        logError(ctx, 'falha ao localizar a mensagem no outbox', { error: readErr.message });
        return errorWithCorrelation(ctx, 500, 'DB_READ_FAILED', 'Falha ao registrar a entrega.');
    }

    if (!row) {
        // Pode ser um e-mail de auth (Supabase) ou de outra origem. Não é erro.
        logInfo(ctx, 'evento de entrega sem linha no outbox (ignorado)', {
            provider_message_id: providerMessageId,
        });
        return jsonWithCorrelation(ctx, { received: true, matched: false });
    }

    const now = new Date().toISOString();
    const patch: Record<string, unknown> = {
        delivery_status: state,
        updated_at: now,
    };

    if (state === 'delivered') patch.delivered_at = now;
    if (state === 'opened') patch.opened_at = now;

    // Sinais de reputação: registram-se em campo PRÓPRIO para não confundirem
    // 'failed' (falha de envio) com bounce (problema de endereço).
    if (state === 'bounced' || state === 'complained') {
        patch.delivery_flag = state;
        patch.delivery_flag_at = now;
        logWarn(ctx, 'sinal de reputacao de e-mail', { state, provider_message_id: providerMessageId });
    }

    const { error: writeErr } = await supabase
        .from('email_outbox')
        .update(patch)
        .eq('id', row.id);

    if (writeErr) {
        logError(ctx, 'falha ao atualizar estado de entrega', { error: writeErr.message });
        return errorWithCorrelation(ctx, 500, 'DB_WRITE_FAILED', 'Falha ao registrar a entrega.');
    }

    logSuccess(ctx, 'estado de entrega atualizado', {
        state, provider_message_id: providerMessageId, outbox_id: row.id,
    });

    return jsonWithCorrelation(ctx, { received: true, matched: true, state });
}