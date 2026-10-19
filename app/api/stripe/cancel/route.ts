import { NextRequest } from 'next/server';
import type Stripe from 'stripe';
import { z } from 'zod';
import { stripe } from '@/lib/stripe';
import { createAdminClient } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';
import { readSubscriptionSnapshot, syncSubscriptionRow } from '@/lib/stripe-sync';
import { resolveBillingState, toStripeIdString } from '@/lib/billing-state';
import { notifyRenewalCanceled } from '@/lib/email-notifier';
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
} from '@/lib/voltris-log';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/stripe/cancel — CANCELAR/REATIVAR A RENOVAÇÃO (missão §7).
 *
 * O que mudou em relação à versão anterior (que NÃO cancelava de verdade):
 *
 *  1. Localizava a assinatura por `profiles.stripe_customer_id` — COLUNA QUE
 *     NÃO EXISTE no schema real (profiles tem id, login, email, full_name,
 *     phone, address, city, neighborhood, state, cep, is_admin, role,
 *     is_blocked, is_deleted, created_at, updated_at). A consulta falhava e o
 *     código caía no fallback "lista customers por e-mail" — isto é, prova de
 *     propriedade por E-MAIL, exatamente o que a missão proíbe.
 *     Agora a assinatura vem de `subscriptions.user_id` (UUID da sessão).
 *  2. Listava com `status: 'active'` e `limit: 1`: pegava uma assinatura
 *     qualquer e ignorava trial/past_due/unpaid.
 *  3. Não confirmava nada: respondia `{success:true}` logo após o update, sem
 *     reler a Stripe. Se a Stripe recusasse, a tela dizia "cancelado".
 *  4. Não gravava o cancelamento local, então uma sincronização posterior
 *     sobrescrevia e o painel voltava a dizer que a renovação estava ativa.
 *  5. Não existia reativação.
 */
const BodySchema = z.object({
    /** `cancel` desliga a renovação; `resume` religa. */
    action: z.enum(['cancel', 'resume']).default('cancel'),
    /**
     * stripe_subscription_id ALVO. Opcional porque a UI manda só a ação.
     * Quando presente, a posse é verificada contra o user_id da sessão —
     * nunca contra o id enviado (missão §11: proteção contra IDOR).
     */
    subscription_id: z.string().regex(/^sub_[A-Za-z0-9_]+$/).optional(),
    /** Frase opcional registrada na trilha de auditoria. */
    reason: z.string().trim().max(500).optional(),
});

export async function POST(req: NextRequest) {
    const correlationId = getOrCreateCorrelationId(req);
    const ctx = startOperation('STRIPE_CANCEL', correlationId);

    try {
        // ---------------- 1. Sessão ----------------
        const supabase = await createClient();
        const { data: sessionData, error: authError } = await supabase.auth.getUser();
        const user = sessionData?.user ?? null;

        if (authError || !user) {
            return errorWithCorrelation(ctx, 401, 'UNAUTHORIZED', 'Não autorizado');
        }
        ctx.userId = user.id;

        // ---------------- 2. Rate limit ----------------
        const guard = licenseRateGuard('sync', req, user.id);
        if (!guard.allowed) {
            logWarn(ctx, 'CANCEL_RATE_LIMIT', { retryAfterSec: guard.retryAfterSec });
            return rateLimitedResponse(guard, correlationId);
        }

        // ---------------- 3. Entrada validada ----------------
        const parsed = BodySchema.safeParse(await req.json().catch(() => ({})));
        if (!parsed.success) {
            return errorWithCorrelation(ctx, 400, 'INVALID_INPUT', 'Requisição inválida.');
        }
        const { action, subscription_id: targetId, reason } = parsed.data;

        const admin = createAdminClient();

        // ---------------- 4. Qual assinatura? ----------------
        // Autoridade: linhas de `subscriptions` do próprio usuário (UUID da
        // sessão). O id enviado pelo frontend NUNCA éauthority — no máximo
        // desempata entre assinaturas que já são do usuário.
        const { data: ownedRows, error: subErr } = await admin
            .from('subscriptions')
            .select('id,pagbank_subscription_id,status,plan_type,billing_period,user_id,email,next_billing_at,cancel_at_period_end,stripe_customer_id')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(25);

        if (subErr) {
            logSupabaseError(ctx, 'buscar assinaturas do usuario', subErr);
            return errorWithCorrelation(ctx, 500, 'DB_READ_FAILED', 'Não foi possível consultar sua assinatura.');
        }

        const owned = (ownedRows ?? []).filter(
            (r): r is NonNullable<typeof r> => !!r && !!r.pagbank_subscription_id
        );

        if (owned.length === 0) {
            return jsonWithCorrelation(
                ctx,
                {
                    ok: false,
                    code: 'NO_SUBSCRIPTION',
                    message: 'Não encontramos assinatura recorrente na sua conta. Compras avulsas não têm renovação a cancelar.',
                },
                404,
            );
        }

        // Se o alvo não é uma das assinaturas DO USUÁRIO, é IDOR — 404 sem
        // revelar se aquele id existe em outra conta.
        if (targetId && !owned.some((c) => c.pagbank_subscription_id === targetId)) {
            logWarn(ctx, 'tentativa de cancelar assinatura de terceiro', {
                requested: targetId, user: maskEmail(user.email),
            });
            return errorWithCorrelation(
                ctx, 404, 'SUBSCRIPTION_NOT_FOUND',
                'A assinatura indicada não pertence a esta conta.'
            );
        }

        const local = targetId
            ? owned.find((c) => c.pagbank_subscription_id === targetId)!
            : owned[0];

        const localState = resolveBillingState({
            subscriptionStatus: local.status,
            hasSubscription: true,
            cancelAtPeriodEnd: local.cancel_at_period_end ?? false,
            nextBillingAt: local.next_billing_at,
        });

        // Situações em que NÃO existe a operação pedida: responder com o
        // estado real em vez de fingir sucesso.
        const terminalStates = ['ENDED', 'REFUNDED', 'NONE'];
        if (terminalStates.includes(localState.state)) {
            return jsonWithCorrelation(ctx, {
                ok: false,
                code: 'NOT_CANCELLABLE',
                state: localState.state,
                message: 'Esta assinatura já foi encerrada. Não há renovação a cancelar.',
            }, 409);
        }

        // Já está no estado desejado -> idempotente, sem chamar a Stripe.
        if (action === 'cancel' && localState.state === 'CANCEL_SCHEDULED') {
            return jsonWithCorrelation(ctx, {
                ok: true,
                alreadyApplied: true,
                state: localState.state,
                renewalEnabled: false,
                accessUntil: local.next_billing_at ?? null,
                message: 'A renovação automática já estava desligada.',
            }, 200);
        }
        if (action === 'resume' && !localState.canResumeRenewal) {
            return jsonWithCorrelation(ctx, {
                ok: false,
                code: 'NOT_RESUMABLE',
                state: localState.state,
                message: 'Esta assinatura não tem cancelamento agendado para reativar.',
            }, 409);
        }

        // ---------------- 6. Autoridade: a Stripe ----------------
        let stripeSub: Stripe.Subscription;
        try {
            stripeSub = await stripe.subscriptions.retrieve(local.pagbank_subscription_id);
        } catch (err: any) {
            logError(ctx, 'assinatura nao encontrada na Stripe', {
                sub: local.pagbank_subscription_id,
                error: String(err?.message ?? err).slice(0, 140),
            });
            return errorWithCorrelation(
                ctx, 404, 'STRIPE_SUBSCRIPTION_NOT_FOUND',
                'Não localizamos esta assinatura no processador de pagamentos.'
            );
        }

        // Defesa em profundidade contra IDOR: quando o espelho local já conhece o
        // `cus_` da assinatura, ele TEM de bater com o da Stripe. Se divergirem,
        // alguma das pontas está apontando para outra pessoa e a operação para.
        // Linhas legadas sem `cus_` gravado não são bloqueadas aqui — a posse já
        // está provada por `subscriptions.user_id` + `pagbank_subscription_id`.
        const stripeCustomerId = toStripeIdString(stripeSub.customer);
        if (local.stripe_customer_id && stripeCustomerId && local.stripe_customer_id !== stripeCustomerId) {
            logWarn(ctx, 'customer da assinatura diverge do espelho local — operacao bloqueada', {
                sub: local.pagbank_subscription_id,
                user: maskEmail(user.email),
            });
            return errorWithCorrelation(
                ctx, 403, 'OWNERSHIP_MISMATCH',
                'Não foi possível confirmar que esta assinatura pertence à sua conta.'
            );
        }

        const snapshotBefore = readSubscriptionSnapshot(stripeSub);

        if (action === 'resume' && (stripeSub.status === 'canceled' || stripeSub.canceled_at)) {
            return jsonWithCorrelation(ctx, {
                ok: false,
                code: 'SUBSCRIPTION_TERMINATED',
                message: 'A assinatura já foi encerrada na Stripe e não pode ser reativada. Adquira um novo plano.',
            }, 409);
        }

        // ---------------- 7. Operação real ----------------
        const updated = await stripe.subscriptions.update(
            local.pagbank_subscription_id,
            action === 'cancel'
                ? {
                    cancel_at_period_end: true,
                    // `cancellation_details` só existe em API nova; quando não
                    // existe, o motivo fica na trilha local (audit) e na Stripe
                    // aparece como `cancellation_requested` por padrão.
                    ...(process.env.STRIPE_API_SUPPORTS_CANCELLATION_DETAILS === '1'
                        ? { cancellation_details: { comment: reason ?? 'Cancelamento solicitado pelo cliente no painel VOLTRIS' } }
                        : {}),
                }
                : { cancel_at_period_end: false }
        );

        // Confirmação REAL: a resposta da Stripe precisa refletir a mudança.
        const confirmed = updated.cancel_at_period_end === (action === 'cancel');
        if (!confirmed) {
            logError(ctx, 'Stripe nao confirmou a alteracao', {
                sub: updated.id, expected: action === 'cancel',
            });
            return errorWithCorrelation(
                ctx, 502, 'STRIPE_NOT_CONFIRMED',
                'O processador de pagamentos não confirmou a alteração. Nada foi alterado.'
            );
        }

        // ---------------- 8. Espelho local ----------------
        const snapshotAfter = readSubscriptionSnapshot(updated);
        await syncSubscriptionRow({
            supabase: admin,
            snapshot: snapshotAfter,
            fallback: {
                referenceId: local.pagbank_subscription_id,
                userId: user.id,
                email: local.email,
                planType: local.plan_type,
                billingPeriod: snapshotAfter.interval ?? local.billing_period,
            },
        });

        // Trilha de auditoria (sem PII desnecessária, sem segredo).
        await admin.from('audit_logs').insert({
            event_type: action === 'cancel' ? 'STRIPE_RENEWAL_CANCELED' : 'STRIPE_RENEWAL_RESUMED',
            metadata: {
                subscription_id: local.pagbank_subscription_id,
                user_id: user.id,
                access_until: snapshotAfter.currentPeriodEnd,
                previous_status: snapshotBefore.status,
                new_status: snapshotAfter.status,
                reason: reason ?? null,
                at: new Date().toISOString(),
            },
        });

        const accessUntil = snapshotAfter.currentPeriodEnd;

        logSuccess(ctx, action === 'cancel' ? 'renovacao cancelada (fim do periodo)' : 'renovacao reativada', {
            sub: local.pagbank_subscription_id,
            user: maskEmail(user.email),
            access_until: accessUntil,
            cancel_at_period_end: snapshotAfter.cancelAtPeriodEnd,
            next_billing_at: snapshotAfter.cancelAtPeriodEnd ? null : accessUntil,
        });

        const fresh = resolveBillingState({
            subscriptionStatus: snapshotAfter.status,
            hasSubscription: true,
            cancelAtPeriodEnd: snapshotAfter.cancelAtPeriodEnd,
            nextBillingAt: snapshotAfter.cancelAtPeriodEnd ? null : accessUntil,
        });

        // =========================================================================
        // E-MAIL (FASE 8)
        //
        // Só entra aqui DEPOIS de `confirmed` — a Stripe devolveu
        // `cancel_at_period_end` exatamente como pedimos. Este é o requisito
        // "não envie esse e-mail se a operação de cancelamento falhou".
        //
        // Reativação NÃO gera e-mail: o cliente acabou de desligar a renovação,
        // avisá-lo de volta que religamos seria confuso.
        // =========================================================================
        if (action === 'cancel' && local.email) {
            void notifyRenewalCanceled({
                subscriptionId: local.pagbank_subscription_id,
                userId: user.id,
                customerEmail: local.email,
                customerName: null,
                planType: local.plan_type,
                accessUntil,
                renewalOnly: snapshotAfter.status !== 'CANCELED',
                canResume: snapshotAfter.status !== 'CANCELED',
                supabase: admin,
                ctx,
            });
        }

        return jsonWithCorrelation(ctx, {
            ok: true,
            state: fresh.state,
            stateLabel: fresh.label,
            renewalEnabled: fresh.renewalEnabled,
            accessUntil,
            nextBillingAt: snapshotAfter.cancelAtPeriodEnd ? null : accessUntil,
            message: action === 'cancel'
                ? 'Renovação automática desligada. Você continua com acesso até o fim do período já pago.'
                : 'Renovação automática reativada.',
        });
    } catch (error: any) {
        logError(ctx, 'cancelamento falhou', { error: error?.message });
        return errorWithCorrelation(ctx, 500, 'CANCEL_FAILED', 'Erro ao processar o cancelamento.');
    }
}