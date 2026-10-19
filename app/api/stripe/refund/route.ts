import { NextRequest } from 'next/server';
import type Stripe from 'stripe';
import { z } from 'zod';
import { stripe } from '@/lib/stripe';
import { createAdminClient } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';
import { evaluateRefund } from '@/lib/billing-policy';
import { extractChargeInvoiceId, extractInvoiceSubscriptionId, toStripeIdString } from '@/lib/billing-state';
import { readSubscriptionSnapshot, syncSubscriptionRow } from '@/lib/stripe-sync';
import { notifyRefund } from '@/lib/email-notifier';
import { licenseRateGuard, rateLimitedResponse } from '@/lib/license-rate-guard';
import {
    startOperation,
    getOrCreateCorrelationId,
    logSuccess,
    logWarn,
    logError,
    logSupabaseError,
    maskEmail,
    jsonWithCorrelation,
    errorWithCorrelation,
    type OperationContext,
} from '@/lib/voltris-log';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/stripe/refund — REEMBOLSO REAL (missão §8).
 *
 * O que estava quebrado na versão anterior (e o que a missão proíbe):
 *
 *  1. `stripe.charges.list()` + `find(succeeded && !refunded)` escolhia uma
 *     cobrança QUALQUER — não necessariamente a do plano que o cliente está
 *     olhando no painel. Um cliente com duas compras podia ser reembolsado na
 *     transação errada ("Evitar reembolsar uma cobrança diferente da
 *     selecionada").
 *  2. `if (latestCharge.invoice)` — o campo `charge.invoice` foi REMOVIDO da
 *     API da Stripe (2025-03+). Com a API atual esse teste é sempre falso, ou
 *     seja: a assinatura NUNCA era cancelada junto com o reembolso. O cliente
 *     recebia o dinheiro de volta e continuava sendo cobrado.
 *  3. Revogava por e-mail: `.eq('email', user.email)` em `licenses` — mas a
 *     coluna real é `customer_email` (0 linhas afetadas) — e em
 *     `subscriptions`/`payments` sem filtro de plano. Um reembolso derrubava
 *     TODOS os planos do cliente, inclusive os que continuavam pagos.
 *  4. Não havia idempotência: dois cliques = duas chamadas de refund.
 *  5. Não registrava refund id, status nem trilha — impossível saber depois
 *     se o dinheiro saiu.
 *
 * O que esta versão faz:
 *  - identifica a COBRANÇA pedida (por `payment_id` da sessão) e valida a posse;
 *  - aplica a política publicada (7 dias corridos) com `lib/billing-policy`;
 *  - dentro do prazo: reembolso REAL na API da Stripe, com chave de
 *    idempotência e confirmação lida de volta;
 *  - fora do prazo: registra a solicitação para análise e diz isso na tela —
 *    nunca afirma que o dinheiro foi devolvido;
 *  - encerra a recorrência correspondente (quando existe) com a operação certa;
 *  - revoga SOMENTE a licença daquela compra/assinatura.
 */
const BodySchema = z.object({
    /** `payment_id` da cobrança mostrada no painel (uuid). */
    payment_id: z.string().uuid().optional(),
    /** Alternativa: escolher a compra mais recente elegível. */
    scope: z.enum(['latest', 'initial']).default('latest'),
    /** Confirmação explícita do cliente no modal. */
    confirm: z.literal(true),
    /** Justificativa opcional do cliente (vai para a análise manual). */
    reason: z.string().trim().max(1000).optional(),
});

interface PaymentRow {
    id: string;
    reference_id: string | null;
    status: string | null;
    amount: number | null;
    currency: string | null;
    plan_type: string | null;
    billing_period: string | null;
    user_id: string | null;
    email: string | null;
    stripe_id: string | null;
    stripe_charge_id: string | null;
    stripe_invoice_id: string | null;
    stripe_customer_id: string | null;
    stripe_subscription_id: string | null;
    stripe_refund_id: string | null;
    invoice_kind: string | null;
    paid_at: string | null;
    created_at: string | null;
}

/** Descobre o `cus_`/`ch_` da cobrança a partir do que o banco já gravou. */
async function resolveCharge(payment: PaymentRow): Promise<{ charge: Stripe.Charge | null; chargeId: string | null; source: string }> {
    if (payment.stripe_charge_id) {
        try {
            return { charge: await stripe.charges.retrieve(payment.stripe_charge_id), chargeId: payment.stripe_charge_id, source: 'payments.stripe_charge_id' };
        } catch { /* cai para o PaymentIntent */ }
    }

    const paymentIntentId = payment.stripe_id?.startsWith('pi_') ? payment.stripe_id : null;
    if (paymentIntentId) {
        const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
        const chargeId = toStripeIdString(pi.latest_charge);
        if (chargeId) {
            try {
                return { charge: await stripe.charges.retrieve(chargeId), chargeId, source: 'payment_intent.latest_charge' };
            } catch { /* sem charge legivel */ }
        }
        return { charge: null, chargeId: null, source: 'payment_intent_sem_charge' };
    }

    const sessionId = payment.stripe_id?.startsWith('cs_') ? payment.stripe_id : null;
    if (sessionId) {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        const piId = toStripeIdString(session.payment_intent);
        if (piId) {
            const pi = await stripe.paymentIntents.retrieve(piId);
            const chargeId = toStripeIdString(pi.latest_charge);
            if (chargeId) {
                return { charge: await stripe.charges.retrieve(chargeId), chargeId, source: 'checkout_session' };
            }
        }
    }

    return { charge: null, chargeId: null, source: 'nao_resolvido' };
}

export async function POST(req: NextRequest) {
    const correlationId = getOrCreateCorrelationId(req);
    const ctx = startOperation('STRIPE_REFUND', correlationId);

    try {
        // ---------------- 1. Sessão ----------------
        const supabase = await createClient();
        const { data: sessionData, error: authError } = await supabase.auth.getUser();
        const user = sessionData?.user ?? null;

        if (authError || !user) {
            return errorWithCorrelation(ctx, 401, 'UNAUTHORIZED', 'Não autorizado');
        }
        ctx.userId = user.id;

        const guard = licenseRateGuard('sync', req, user.id);
        if (!guard.allowed) {
            logWarn(ctx, 'REFUND_RATE_LIMIT', { retryAfterSec: guard.retryAfterSec });
            return rateLimitedResponse(guard, correlationId);
        }

        // ---------------- 2. Entrada ----------------
        const parsed = BodySchema.safeParse(await req.json().catch(() => ({})));
        if (!parsed.success) {
            return errorWithCorrelation(
                ctx, 400, 'INVALID_INPUT',
                'Confirmação do reembolso não recebida.'
            );
        }
        // `confirm` é validado pelo schema (`z.literal(true)`): sem ele a
        // requisição é rejeitada com 400. Destruturamos para deixar claro que
        // ele é uma pré-condição, não um dado usado adiante.
        const { payment_id: paymentId, scope, confirm: _confirmed, reason } = parsed.data;
        void _confirmed;

        const admin = createAdminClient();

        // ---------------- 3. Localizar a cobrança do USUÁRIO ----------------
        const columns = 'id,reference_id,status,amount,currency,plan_type,billing_period,user_id,email,stripe_id,stripe_charge_id,stripe_invoice_id,stripe_customer_id,stripe_subscription_id,stripe_refund_id,invoice_kind,paid_at,created_at';

        let payment: PaymentRow | null = null;

        if (paymentId) {
            // IDOR: filtra por user_id DA SESSÃO. Um payment_id de outro cliente
            // simplesmente não existe no conjunto — e o erro não confirma nada.
            const { data, error } = await admin
                .from('payments').select(columns)
                .eq('id', paymentId).eq('user_id', user.id)
                .maybeSingle();
            if (error) {
                logSupabaseError(ctx, 'buscar pagamento alvo', error);
                return errorWithCorrelation(ctx, 500, 'DB_READ_FAILED', 'Não foi possível consultar a cobrança.');
            }
            payment = data as PaymentRow | null;
        } else {
            let q = admin.from('payments').select(columns)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(20);
            if (scope === 'initial') q = q.eq('invoice_kind', 'purchase');
            const { data, error } = await q;
            if (error) {
                logSupabaseError(ctx, 'buscar pagamentos do usuario', error);
                return errorWithCorrelation(ctx, 500, 'DB_READ_FAILED', 'Não foi possível consultar suas compras.');
            }
            payment = ((data ?? []) as PaymentRow[])
                .find((p) => !['refunded', 'charged_back', 'chargeback'].includes((p.status ?? '').toLowerCase()))
                ?? ((data ?? []) as PaymentRow[])[0]
                ?? null;
        }

        if (!payment) {
            return jsonWithCorrelation(ctx, {
                ok: false,
                code: 'PAYMENT_NOT_FOUND',
                message: 'Não encontramos uma compra sua para reembolsar.',
            }, 404);
        }

        // ---------------- 4. Solicitação já aberta? ----------------
        const { data: openRequest } = await admin.from('refund_requests')
            .select('id, status, created_at')
            .eq('payment_id', payment.id)
            .in('status', ['requested', 'processing'])
            .maybeSingle();

        // ---------------- 5. Política publicada ----------------
        const evaluation = evaluateRefund({
            purchasedAt: payment.paid_at ?? payment.created_at,
            paymentStatus: payment.status,
            refundId: payment.stripe_refund_id,
            openRequestId: openRequest?.id ?? null,
            amount: typeof payment.amount === 'number' ? Number(payment.amount) : null,
        });

        if (evaluation.outcome === 'ALREADY_REFUNDED') {
            return jsonWithCorrelation(ctx, {
                ok: false, code: 'ALREADY_REFUNDED', outcome: evaluation.outcome,
                message: evaluation.message, basis: evaluation.basis,
            }, 409);
        }
        if (evaluation.outcome === 'ALREADY_REQUESTED') {
            return jsonWithCorrelation(ctx, {
                ok: false, code: 'ALREADY_REQUESTED', outcome: evaluation.outcome,
                message: evaluation.message, basis: evaluation.basis,
            }, 409);
        }
        if (evaluation.outcome === 'NOT_A_PAID_PURCHASE') {
            return jsonWithCorrelation(ctx, {
                ok: false, code: 'NOT_A_PAID_PURCHASE', outcome: evaluation.outcome,
                message: evaluation.message, basis: evaluation.basis,
            }, 409);
        }

        // ---------------- 6. Localizar a cobrança na Stripe ----------------
        const { charge, chargeId } = await resolveCharge(payment);

        if (!charge || !chargeId) {
            // Sem identificador de cobrança não há como devolver dinheiro com
            // segurança: registra a solicitação para a equipe, sem prometer nada.
            const request = await registerRequest({
                ctx, admin, payment, userId: user.id, amount: Number(payment.amount ?? 0),
                source: 'manual', evaluation, reason,
                outcomeMessage: 'Cobrança não localizada no processador automaticamente — revisão manual necessária.',
            });
            void notifyRefund({
                stage: 'requested',
                paymentId: payment.id,
                userId: user.id,
                customerEmail: payment.email,
                customerName: null,
                planType: payment.plan_type,
                amount: Number(payment.amount ?? 0),
                currency: (payment.currency ?? 'BRL').toUpperCase(),
                refundId: null,
                requestedAt: new Date().toISOString(),
                manualReview: true,
                supabase: admin,
                ctx,
            });

            return jsonWithCorrelation(ctx, {
                ok: true,
                status: 'requested',
                outcome: 'MANUAL_REVIEW',
                requestId: request.id,
                message: 'Registramos sua solicitação de reembolso. Nossa equipe vai revisar e entrará em contato.',
                basis: evaluation.basis,
            }, 202);
        }

        if (charge.refunded === true) {
            return jsonWithCorrelation(ctx, {
                ok: false, code: 'ALREADY_REFUNDED', outcome: 'ALREADY_REFUNDED',
                message: 'Esta cobrança já foi reembolsada integralmente.',
            }, 409);
        }

        // ---------------- 7. Fora do prazo automático -> análise ----------------
        if (!evaluation.eligible) {
            const request = await registerRequest({
                ctx, admin, payment, userId: user.id, amount: Number(payment.amount ?? 0),
                source: 'manual', evaluation, reason, stripeChargeId: chargeId,
                outcomeMessage: evaluation.message,
            });
            logSuccess(ctx, 'solicitacao de reembolso registrada para analise', {
                payment: payment.id, charge: chargeId, outcome: evaluation.outcome,
            });

            // E-mail "solicitação em análise" (FASE 9). O texto NÃO promete
            // devolução: diz explicitamente que a análise está em curso.
            void notifyRefund({
                stage: 'requested',
                paymentId: payment.id,
                userId: user.id,
                customerEmail: payment.email,
                customerName: null,
                planType: payment.plan_type,
                amount: Number(payment.amount ?? 0),
                currency: (payment.currency ?? 'BRL').toUpperCase(),
                refundId: null,
                requestedAt: new Date().toISOString(),
                manualReview: true,
                supabase: admin,
                ctx,
            });
            return jsonWithCorrelation(ctx, {
                ok: true,
                status: 'requested',
                outcome: 'MANUAL_REVIEW',
                requestId: request.id,
                message: evaluation.message,
                basis: evaluation.basis,
            }, 202);
        }

        // ---------------- 8. Reembolso REAL ----------------
        // Chave de idempotência determinística: o mesmo clique nunca gera duas
        // devoluções, mesmo com retry/redeploy no meio do caminho.
        const idempotencyKey = `voltris-refund-${payment.id}`;

        const refund = await stripe.refunds.create(
            {
                charge: chargeId,
                reason: 'requested_by_customer',
                metadata: {
                    payment_id: payment.id,
                    user_id: user.id,
                    subscription_id: payment.stripe_subscription_id ?? '',
                    origin: 'voltris.com.br/dashboard',
                },
            },
            { idempotencyKey }
        );

        // Confirmação REAL: só afirmamos o que a Stripe devolveu.
        const refundConfirmed = refund.status === 'succeeded' || refund.status === 'pending';

        if (!refundConfirmed) {
            logError(ctx, 'reembolso nao confirmado pela Stripe', { refund: refund.id, status: refund.status });
            return errorWithCorrelation(
                ctx, 502, 'REFUND_NOT_CONFIRMED',
                'O processador de pagamentos não confirmou o reembolso. Nada foi devolvido ainda.'
            );
        }

        // ---------------- 9. Espelho no banco ----------------
        const fullyRefunded = refund.status === 'succeeded' && charge.amount_refunded + refund.amount >= charge.amount;

        await admin.from('payments').update({
            status: fullyRefunded ? 'refunded' : 'partially_refunded',
            stripe_refund_id: refund.id,
            stripe_charge_id: chargeId,
            refunded_amount: ((charge.amount_refunded ?? 0) + refund.amount) / 100,
            refunded_at: refund.status === 'succeeded' ? new Date(refund.created * 1000).toISOString() : null,
            updated_at: new Date().toISOString(),
        }).eq('id', payment.id);

        await admin.from('refund_requests')
            .select('id')
            .eq('payment_id', payment.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle()
            .then(async ({ data: existing }) => {
                const patch = {
                    status: refund.status === 'succeeded' ? 'succeeded' : 'processing',
                    stripe_charge_id: chargeId,
                    stripe_refund_id: refund.id,
                    amount: refund.amount / 100,
                    resolved_at: refund.status === 'succeeded' ? new Date().toISOString() : null,
                    updated_at: new Date().toISOString(),
                };
                if (existing?.id) {
                    await admin.from('refund_requests').update(patch).eq('id', existing.id);
                } else {
                    await admin.from('refund_requests').insert({
                        ...patch,
                        payment_id: payment.id,
                        user_id: user.id,
                        subscription_id: payment.stripe_subscription_id ?? null,
                        currency: (refund.currency ?? 'brl').toUpperCase(),
                        source: 'automatic',
                        customer_message: reason ?? null,
                        outcome_message: evaluation.message,
                        policy_basis: evaluation.basis,
                    });
                }
            });

        // ---------------- 10. Encerrar a recorrência ----------------
        // MISSÃO §8: "Não assuma que reembolsar uma cobrança cancela
        // automaticamente a assinatura Stripe." São duas operações, e as duas
        // são feitas aqui — com a API certa para cada caso.
        let subscriptionEnded = false;
        const invoiceId = extractChargeInvoiceId(charge);

        if (payment.stripe_subscription_id) {
            try {
                const sub = await stripe.subscriptions.retrieve(payment.stripe_subscription_id);
                if (sub.status !== 'canceled') {
                    // Reembolso integral encerra a contratação: cancelamento
                    // imediato é o que impede a próxima cobrança indevida.
                    await stripe.subscriptions.cancel(
                        sub.id,
                        { invoice_now: false, prorate: false },
                        { idempotencyKey: `voltris-refund-cancel-${sub.id}` }
                    );
                    const snapshot = readSubscriptionSnapshot({ ...sub, status: 'canceled', canceled_at: Math.floor(Date.now() / 1000) });
                    await syncSubscriptionRow({ supabase: admin, snapshot, fallback: { userId: user.id, email: payment.email } });
                    subscriptionEnded = true;
                }
            } catch (err: any) {
                // Nunca esconder: o dinheiro já voltou; a recorrência pode
                // precisar de ação manual. Isso fica registrado e visível.
                logError(ctx, 'reembolso OK mas cancelamento da assinatura falhou', {
                    sub: payment.stripe_subscription_id, error: String(err?.message ?? err).slice(0, 140),
                });
            }
        } else if (invoiceId) {
            const invoice = await stripe.invoices.retrieve(invoiceId);
            const subId = extractInvoiceSubscriptionId(invoice);
            if (subId) {
                try {
                    const sub = await stripe.subscriptions.retrieve(subId);
                    if (sub.status !== 'canceled') {
                        await stripe.subscriptions.cancel(
                            sub.id,
                            { invoice_now: false, prorate: false },
                            { idempotencyKey: `voltris-refund-cancel-${sub.id}` }
                        );
                        const snapshot = readSubscriptionSnapshot({ ...sub, status: 'canceled', canceled_at: Math.floor(Date.now() / 1000) });
                        await syncSubscriptionRow({ supabase: admin, snapshot, fallback: { userId: user.id, email: payment.email } });
                        subscriptionEnded = true;
                    }
                } catch (err: any) {
                    logError(ctx, 'cancelamento via invoice falhou', { sub: subId, error: String(err?.message ?? err).slice(0, 140) });
                }
            }
        }

        // ---------------- 11. Acesso (escopo restrito) ----------------
        // Reembolso de uma RENOVAÇÃO preserva os períodos que continuam pagos:
        // a licença NÃO é revogada nesse caso. Reembolso da compra inicial
        // encerra a contratação e aí sim a licença é revogada.
        const isInitialCharge = (payment.invoice_kind ?? 'purchase') === 'purchase';

        // Fim do acesso já contratado — é o que o e-mail de reembolso deve
        // informar, em vez de prometer corte imediato.
        let accessUntil: string | null = null;
        if (payment.user_id) {
            const { data: lic } = await admin
                .from('licenses')
                .select('expires_at')
                .eq('user_id', payment.user_id)
                .eq('plan_type', (payment.plan_type ?? '').toLowerCase())
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle();
            accessUntil = (lic as { expires_at?: string | null } | null)?.expires_at ?? null;
        }

        if (fullyRefunded && isInitialCharge && payment.user_id) {
            await admin.from('licenses').update({
                revoked: true,
                notes: `Reembolso confirmado (charge ${chargeId}, refund ${refund.id}) em ${new Date().toISOString()}`,
            })
                .eq('user_id', payment.user_id)
                .eq('plan_type', (payment.plan_type ?? '').toLowerCase());
        }

        await admin.from('audit_logs').insert({
            event_type: 'REFUND_PROCESSED',
            metadata: {
                payment_id: payment.id,
                charge: chargeId,
                refund: refund.id,
                amount: refund.amount / 100,
                currency: refund.currency,
                stripe_status: refund.status,
                subscription_ended: subscriptionEnded,
                initial_charge: isInitialCharge,
                basis: evaluation.basis,
                at: new Date().toISOString(),
            },
        });

        logSuccess(ctx, 'reembolso processado', {
            payment: payment.id, charge: chargeId, refund: refund.id,
            status: refund.status, amount: refund.amount / 100,
            subscription_ended: subscriptionEnded, user: maskEmail(user.email),
        });

        // E-mail do ESTADO REAL da operação (FASE 9): "processing" quando a
        // Stripe aceitou mas o crédito ainda não ocorreu; "confirmed" só quando
        // o refund.status é 'succeeded'. Nunca "confirmado" por ter clicado.
        void notifyRefund({
            stage: refund.status === 'succeeded' ? 'confirmed' : 'processing',
            paymentId: payment.id,
            userId: user.id,
            customerEmail: payment.email,
            customerName: null,
            planType: payment.plan_type,
            amount: refund.amount / 100,
            currency: (refund.currency ?? 'brl').toUpperCase(),
            refundId: refund.id,
            requestedAt: new Date().toISOString(),
            resolvedAt: refund.status === 'succeeded' ? new Date().toISOString() : null,
            accessUntil: accessUntil,
            supabase: admin,
            ctx,
        });

        return jsonWithCorrelation(ctx, {
            ok: true,
            status: refund.status === 'succeeded' ? 'succeeded' : 'processing',
            outcome: refund.status === 'succeeded' ? 'REFUNDED' : 'REFUND_PROCESSING',
            refundId: refund.id,
            amount: refund.amount / 100,
            currency: (refund.currency ?? 'brl').toUpperCase(),
            subscriptionEnded,
            accessRevoked: fullyRefunded && isInitialCharge,
            basis: evaluation.basis,
            message: refund.status === 'succeeded'
                ? (isInitialCharge
                    ? 'Reembolso confirmado. O acesso correspondente foi encerrado.'
                    : 'Reembolso desta renovação confirmado. Os períodos que continuam pagos seguem válidos.')
                : 'Reembolso solicitado e em processamento. O banco emissor pode levar até 10 dias úteis para estornar.',
        });
    } catch (error: any) {
        logError(ctx, 'reembolso falhou', { error: error?.message });
        return errorWithCorrelation(ctx, 500, 'REFUND_FAILED', 'Erro ao processar a solicitação de reembolso.');
    }
}

/** Registra (ou atualiza) a solicitação manual de reembolso. */
async function registerRequest(params: {
    ctx: OperationContext;
    admin: ReturnType<typeof createAdminClient>;
    payment: PaymentRow;
    userId: string;
    amount: number;
    source: 'automatic' | 'manual';
    evaluation: ReturnType<typeof evaluateRefund>;
    reason?: string;
    stripeChargeId?: string | null;
    outcomeMessage?: string;
}) {
    const { ctx, admin, payment, userId, amount, source, evaluation, reason, stripeChargeId, outcomeMessage } = params;

    // `refund_requests` tem índices únicos PARCIAIS (só=status abertos), então
    // `upsert(onConflict: payment_id)` não é aceito pelo PostgREST. Fazemos o
    // upsert manual: procura a linha existente e decide.
    const { data: existing } = await admin
        .from('refund_requests')
        .select('id')
        .eq('payment_id', payment.id)
        .in('status', ['requested', 'processing', 'succeeded'])
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    const payload = {
        payment_id: payment.id,
        user_id: userId,
        subscription_id: payment.stripe_subscription_id ?? null,
        stripe_charge_id: stripeChargeId ?? payment.stripe_charge_id ?? null,
        amount,
        currency: (payment.currency ?? 'BRL').toUpperCase(),
        status: 'requested',
        source,
        customer_message: reason ?? null,
        outcome_message: outcomeMessage ?? evaluation.message,
        policy_basis: evaluation.basis,
        updated_at: new Date().toISOString(),
    };

    if (existing?.id) {
        const { data: updated, error } = await admin
            .from('refund_requests')
            .update(payload)
            .eq('id', existing.id)
            .select('id')
            .single();
        if (error) {
            logSupabaseError(ctx, 'atualizar solicitacao de reembolso', error);
            throw new Error(`REFUND_REQUEST_WRITE_FAILED: ${error.message}`);
        }
        return updated as { id: string };
    }

    const { data, error } = await admin.from('refund_requests').insert(payload).select('id').single();
    if (error) {
        logSupabaseError(ctx, 'registrar solicitacao', error);
        throw new Error(`REFUND_REQUEST_WRITE_FAILED: ${error.message}`);
    }

    return data as { id: string };
}