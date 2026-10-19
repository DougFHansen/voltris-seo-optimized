import { NextRequest } from 'next/server';
import { createClient as createServerClient } from '@/utils/supabase/server';
import {
    startOperation,
    getOrCreateCorrelationId,
    logWarn,
    logSuccess,
    logSupabaseError,
    jsonWithCorrelation,
    errorWithCorrelation,
    maskEmail,
} from '@/lib/voltris-log';
import {
    getServiceClient,
    isLicenseActive,
    isLicenseExpired,
    licenseDisplayName,
    countLicenseDevices,
    licenseIsOwnedBy,
    resolveLicenseState,
    billingPeriodLabel,
    type LicenseRow,
} from '@/lib/license-schema';
import { resolveBillingState } from '@/lib/billing-state';
import { isInvoicable } from '@/lib/invoice-data';
import { selectWithOptionalColumns } from '@/lib/supabase-schema-compat';
import { licenseRateGuard, rateLimitedResponse } from '@/lib/license-rate-guard';

export const runtime = 'nodejs';

/** Linhas minimas usadas do schema real (verificado no banco vivo). */
interface PaymentRow {
    id: string;
    status: string | null;
    stripe_subscription_id: string | null;
    plan_type: string | null;
    billing_period: string | null;
    amount: number | null;
    created_at: string | null;
    reference_id?: string | null;
    // Campos novos (podem não existir antes da migration — ver fallback abaixo)
    invoice_kind?: string | null;
    stripe_invoice_id?: string | null;
    stripe_refund_id?: string | null;
    paid_at?: string | null;
    currency?: string | null;
    refunded_amount?: number | null;
    updated_at?: string | null;
}

interface SubscriptionRow {
    pagbank_subscription_id: string | null;
    status: string | null;
    plan_type: string | null;
    billing_period: string | null;
    next_billing_at: string | null;
    canceled_at: string | null;
    // Campos novos
    cancel_at_period_end?: boolean | null;
    ended_at?: string | null;
    payment_method_last4?: string | null;
}

/**
 * GET /api/v1/license/me
 *
 * Licencas do usuario autenticado. Requer sessao (cookie OU Bearer token).
 *
 * O filtro e feito no SERVIDOR com service_role, usando o user_id da sessao
 * como autoridade — o e-mail só entra como fallback para linhas legadas sem
 * `licenses.user_id`, e mesmo assim passando por `licenseIsOwnedBy`.
 *
 * Além das licenças, a rota devolve os FATOS DE FATURAMENTO e de FATURA de
 * cada uma (missão §3 e §5): situação da assinatura, se a renovação está
 * realmente ativa e se existe documento PDF baixável. É o que permite ao painel
 * mostrar "Renovação: Ativada" apenas quando a Stripe confirma, e habilitar o
 * botão de fatura apenas quando existe cobrança confirmada.
 */
export async function GET(request: NextRequest) {
    const correlationId = getOrCreateCorrelationId(request);
    const ctx = startOperation('LICENSE_ME', correlationId);

    const supabase = await createServerClient();
    const { data: sessionData, error: authError } = await supabase.auth.getUser();
    const user = sessionData?.user ?? null;

    if (authError || !user) {
        return errorWithCorrelation(ctx, 401, 'UNAUTHORIZED', 'Nao autorizado');
    }
    ctx.userId = user.id;

    // Rate limit (missão §9): o painel faz polling limitado de pagamento pendente
    // (1 a cada 15 s). O teto abaixo cobre esse polling e corta abuso.
    const guard = licenseRateGuard('me', request, user.id);
    if (!guard.allowed) {
        logWarn(ctx, 'LICENSE_RATE_LIMIT: consultas ao painel demais', {
            scope: guard.scope, id: guard.key, retryAfterSec: guard.retryAfterSec,
        });
        return rateLimitedResponse(guard, correlationId);
    }

    const admin = getServiceClient();

    // Duas consultas determinísticas em vez de um `.or()`:
    // o PostgREST exige aspas em valores de filtro que contenham caracteres
    // especiais (o "@" do e-mail), e o supabase-js não as aplica. Filtrar por
    // user_id primeiro e cair para o e-mail só quando necessário é previsível.
    const byUser = await admin
        .from('licenses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (byUser.error) {
        logSupabaseError(ctx, 'buscar licencas por user_id', byUser.error);
        return errorWithCorrelation(ctx, 500, 'DB_READ_FAILED', 'Erro ao buscar licencas');
    }

    let candidates = (byUser.data ?? []) as LicenseRow[];

    if (candidates.length === 0 && user.email) {
        const byEmail = await admin
            .from('licenses')
            .select('*')
            .eq('customer_email', user.email)
            .order('created_at', { ascending: false });

        if (byEmail.error) {
            logSupabaseError(ctx, 'buscar licencas por email', byEmail.error);
            return errorWithCorrelation(ctx, 500, 'DB_READ_FAILED', 'Erro ao buscar licencas');
        }

        candidates = (byEmail.data ?? []) as LicenseRow[];
    }

    const session = { id: user.id, email: user.email ?? null };
    const owned = candidates.filter((l) => licenseIsOwnedBy(l, session));

    // ----------------------------------------------------------------------------
    // Estado canonico (missao secao 6): a licenca so pode ser classificada com o
    // pagamento e a assinatura que a sustentam. Nada aqui e derivado no navegador.
    // ----------------------------------------------------------------------------
    const paymentIds = Array.from(new Set(
        owned.map((l) => l.payment_id ?? null).filter((v): v is string => !!v)
    ));

    // Colunas novas entram como "opcionais": se a migration ainda não rodou, a
    // rota continua funcionando com o que existe (sem regressão de deploy).
    const [paymentsRes, subsRes] = await Promise.all([
        paymentIds.length
            ? selectWithOptionalColumns<PaymentRow>(
                admin,
                'payments',
                ['id', 'status', 'stripe_subscription_id', 'plan_type', 'billing_period', 'amount', 'created_at', 'reference_id'],
                ['invoice_kind', 'stripe_invoice_id', 'stripe_refund_id', 'paid_at', 'currency', 'refunded_amount', 'updated_at'],
                // Sem este filtro o fallback buscaria a tabela INTEIRA.
                (q) => q.in('id', paymentIds)
            ).then((r) => ({ data: r.rows, error: null as { message: string } | null }))
            : Promise.resolve({ data: [] as PaymentRow[], error: null }),
        selectWithOptionalColumns<SubscriptionRow>(
            admin,
            'subscriptions',
            ['pagbank_subscription_id', 'status', 'plan_type', 'billing_period', 'next_billing_at', 'canceled_at', 'user_id', 'email'],
            ['cancel_at_period_end', 'ended_at', 'payment_method_last4'],
            (q) => q.eq('user_id', user.id)
        ).then((r) => ({ data: r.rows, error: null as { message: string } | null })),
    ]);

    const { data: pendingRows, error: pendingErr } = await admin
        .from('payments')
        .select('id,status,plan_type,billing_period,amount,created_at,reference_id')
        .eq('user_id', user.id)
        .in('status', ['pending', 'processing', 'open', 'unpaid'])
        .order('created_at', { ascending: false })
        .limit(10);

    // ------------------------------------------------------------------
    // ESTADO DO REEMBOLSO PEDIDO PELO CLIENTE
    //
    // O botão "Solicitar Reembolso" precisa refletir a REALIDADE: solicitado,
    // em processamento, aplicado ou recusado. Sem isto, o cliente clicava de
    // novo em pedidos ja feitos e achava que nada acontecia.
    // ------------------------------------------------------------------
    let refundState: 'none' | 'requested' | 'processing' | 'applied' | 'rejected' = 'none';
    let refundMessage: string | null = null;
    let refundUpdatedAt: string | null = null;
    try {
        const { data: rr } = await admin
            .from('refund_requests')
            .select('status, outcome_message, created_at, updated_at, resolved_at')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1);
        const r = (rr ?? [])[0];
        if (r) {
            const st = String(r.status ?? '').toLowerCase();
            if (st === 'requested') refundState = 'requested';
            else if (st === 'processing') refundState = 'processing';
            else if (st === 'succeeded') refundState = 'applied';
            else if (st === 'rejected' || st === 'failed') refundState = 'rejected';
            refundMessage = r.outcome_message ?? null;
            refundUpdatedAt = r.updated_at ?? r.resolved_at ?? r.created_at ?? null;
        }
    } catch (e: any) {
        // Tabela ausente em bases antigas: segue sem o estado extra.
        logWarn(ctx, 'estado de reembolso indisponivel', { error: String(e?.message ?? e).slice(0, 120) });
    }

    if (paymentsRes.error) logSupabaseError(ctx, 'buscar pagamentos das licencas', paymentsRes.error);
    if (subsRes.error) logSupabaseError(ctx, 'buscar assinaturas do usuario', subsRes.error);
    if (pendingErr) logSupabaseError(ctx, 'buscar compras pendentes', pendingErr);

    const payments = new Map<string, PaymentRow>(
        (paymentsRes.data ?? []).map((p) => [String(p.id), p])
    );
    const subscriptions = (subsRes.data ?? []).filter(
        (s): s is SubscriptionRow & { pagbank_subscription_id: string } =>
            !!s && !!s.pagbank_subscription_id
    );

    const formatted = await Promise.all(
        owned.map(async (license) => {
            const devicesInUse = await countLicenseDevices(license.license_key);
            const payment = license.payment_id ? payments.get(String(license.payment_id)) : undefined;

            // Vinculo assinatura<->licenca: primeiro pelo id Stripe do pagamento
            // (preciso), depois por plano (compatibilidade com linhas antigas em
            // que payment_id esta NULL — as 7 linhas legadas do banco vivo).
            const subscription =
                (payment?.stripe_subscription_id
                    ? subscriptions.find((s) => s.pagbank_subscription_id === payment.stripe_subscription_id)
                    : undefined) ??
                subscriptions.find((s) => (s.plan_type ?? '') === (license.plan_type ?? '')) ??
                undefined;

            const resolved = resolveLicenseState({
                revoked: license.revoked,
                expires_at: license.expires_at,
                payment_status: payment?.status ?? null,
                subscription_status: subscription?.status ?? null,
            });

            // Situação do FATURAMENTO (diferente do estado da licença): aqui mora
            // "a Stripe ainda vai cobrar?" e "existe documento para baixar?".
            const billing = resolveBillingState({
                subscriptionStatus: subscription?.status ?? null,
                hasSubscription: !!subscription,
                paymentStatus: payment?.status ?? null,
                cancelAtPeriodEnd: subscription?.cancel_at_period_end ?? null,
                nextBillingAt: subscription?.next_billing_at ?? null,
            });

            const invoiceAvailable = !!payment && isInvoicable(payment.status);

            return {
                license_key: license.license_key,
                type: license.plan_type ?? 'standard',
                displayName: licenseDisplayName(license),
                // Mantidos por compatibilidade com quem ja consome a rota.
                isActive: isLicenseActive(license),
                isExpired: isLicenseExpired(license),
                // Fonte de verdade do painel:
                state: resolved.state,
                stateLabel: resolved.label,
                hasAccess: resolved.hasAccess,
                expiringSoon: resolved.expiringSoon,
                daysLeft: resolved.daysLeft,
                revoked: license.revoked === true,
                expiresAt: license.expires_at,
                activatedAt: license.activated_at,
                billingPeriod: license.billing_period ?? null,
                billingPeriodLabel: billingPeriodLabel(license.billing_period),
                maxDevices: license.max_devices ?? 1,
                devicesInUse,
                paymentStatus: payment?.status ?? null,
                paymentId: payment?.id ?? null,
                subscriptionStatus: subscription?.status ?? null,
                subscriptionId: subscription?.pagbank_subscription_id ?? null,
                nextBillingAt: subscription?.next_billing_at ?? null,
                canceledAt: subscription?.canceled_at ?? null,
                endsAt: subscription?.ended_at ?? null,
                paymentMethodLast4: subscription?.payment_method_last4 ?? null,

                // Bloco novo: fatos de faturamento e de fatura (missão §3/§5).
                billingState: billing.state,
                billingLabel: billing.label,
                renewalEnabled: billing.renewalEnabled,
                billingHint: billing.hint,
                canCancelRenewal: billing.canCancelRenewal,
                canResumeRenewal: billing.canResumeRenewal,
                canRequestRefund: billing.canRequestRefund,
    refundState,
    refundMessage,
    refundUpdatedAt,
                invoice: {
                    available: invoiceAvailable,
                    paymentId: payment?.id ?? null,
                    stripeInvoiceId: payment?.stripe_invoice_id ?? null,
                    kind: payment?.invoice_kind ?? null,
                    amount: payment?.amount ?? null,
                    currency: payment?.currency ?? 'BRL',
                    paidAt: payment?.paid_at ?? payment?.created_at ?? null,
                    refunded: typeof payment?.refunded_amount === 'number'
                        ? payment.refunded_amount > 0
                        : false,
                    unavailableReason: invoiceAvailable
                        ? null
                        : 'Fatura indisponível: aguardando confirmação do pagamento.',
                },
            };
        })
    );

    const licensedPaymentIds = new Set(paymentIds.map(String));
    const pendingPurchases = ((pendingRows ?? []) as PaymentRow[])
        // uma compra pendente ja emitida (linhas legadas) nao e "pendente" no painel
        .filter((p) => !licensedPaymentIds.has(String(p.id)))
        .map((p) => ({
            payment_id: p.id,
            status: p.status,
            type: p.plan_type ?? null,
            billingPeriod: p.billing_period ?? null,
            billingPeriodLabel: billingPeriodLabel(p.billing_period),
            amount: p.amount ?? null,
            createdAt: p.created_at,
            referenceId: p.reference_id ?? null,
        }));

    logSuccess(ctx, 'licencas do usuario', {
        count: formatted.length,
        pendentes: pendingPurchases.length,
        assinaturas: subscriptions.length,
        user: maskEmail(user.email),
    });

    return jsonWithCorrelation(ctx, {
        user: {
            id: user.id,
            email: user.email,
            name: user.user_metadata?.full_name || 'Usuario Voltris',
        },
        licenses: formatted,
        pendingPurchases,
        // O dashboard usa isto para decidir se faz polling LIMITADO (secao 6).
        hasPending: pendingPurchases.length > 0 || formatted.some((l) => l.state === 'PAGAMENTO_PENDENTE'),
        // Fatos de assinatura no nível da conta (para o card "Gestão de
        // Licenças & Faturamento", que não pertence a uma licença específica).
        billing: buildAccountBilling(subscriptions, formatted, { state: refundState, message: refundMessage, updatedAt: refundUpdatedAt }),
        server_time: new Date().toISOString(),
    });
}

/** Consolida o estado de faturamento da conta para o card de gestão. */
function buildAccountBilling(
    subscriptions: Array<SubscriptionRow & { pagbank_subscription_id: string }>,
    licenses: Array<Record<string, unknown>>,
    refund: { state: string; message: string | null; updatedAt: string | null } = {
        state: 'none', message: null, updatedAt: null,
    }
) {
    // A assinatura mais relevante é a que ainda está associada a uma licença com
    // acesso; na ausência, a mais recente registrada.
    const primary =
        subscriptions.find((s) =>
            licenses.some((l) => l.subscriptionId === s.pagbank_subscription_id && l.hasAccess)
        ) ?? subscriptions[0] ?? null;

    const state = resolveBillingState({
        subscriptionStatus: primary?.status ?? null,
        hasSubscription: !!primary,
        paymentStatus: null,
        cancelAtPeriodEnd: primary?.cancel_at_period_end ?? null,
        nextBillingAt: primary?.next_billing_at ?? null,
    });

    return {
        hasSubscription: !!primary,
        subscriptionId: primary?.pagbank_subscription_id ?? null,
        subscriptionStatus: primary?.status ?? null,
        cancelAtPeriodEnd: primary?.cancel_at_period_end ?? null,
        nextBillingAt: primary?.next_billing_at ?? null,
        endsAt: primary?.ended_at ?? null,
        state: state.state,
        stateLabel: state.label,
        renewalEnabled: state.renewalEnabled,
        hint: state.hint,
        canCancelRenewal: state.canCancelRenewal,
        canResumeRenewal: state.canResumeRenewal,
        canRequestRefund: state.canRequestRefund,
        // Estado REAL do reembolso pedido pelo cliente: o botão precisa
        // contar a história (solicitado -> em processamento -> aplicado).
        refundState: refund.state,
        refundMessage: refund.message,
        refundUpdatedAt: refund.updatedAt,
        totalSubscriptions: subscriptions.length,
    };
}