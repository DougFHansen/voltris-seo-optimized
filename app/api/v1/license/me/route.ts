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
}

interface SubscriptionRow {
    pagbank_subscription_id: string | null;
    status: string | null;
    plan_type: string | null;
    billing_period: string | null;
    next_billing_at: string | null;
    canceled_at: string | null;
}

/**
 * GET /api/v1/license/me
 *
 * Licencas do usuario autenticado. Requer sessao (cookie OU Bearer token).
 *
 * O filtro e feito no SERVIDOR com service_role, usando o email da sessao como
 * criterio adicional. A RLS de licenses ja restringe o acesso direto do
 * navegador; aqui o service_role e seguro porque o userId vem da sessao.
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

    const [paymentsRes, subsRes, pendingRes] = await Promise.all([
        paymentIds.length
            ? admin.from('payments')
                .select('id,status,stripe_subscription_id,plan_type,billing_period,amount,created_at')
                .in('id', paymentIds)
            : Promise.resolve({ data: [] as PaymentRow[], error: null }),
        admin.from('subscriptions')
            .select('pagbank_subscription_id,status,plan_type,billing_period,next_billing_at,canceled_at,user_id,email')
            .eq('user_id', user.id),
        admin.from('payments')
            .select('id,status,plan_type,billing_period,amount,created_at,reference_id')
            .eq('user_id', user.id)
            .in('status', ['pending', 'processing', 'open', 'unpaid'])
            .order('created_at', { ascending: false })
            .limit(10),
    ]);

    if (paymentsRes.error) logSupabaseError(ctx, 'buscar pagamentos das licencas', paymentsRes.error);
    if (subsRes.error) logSupabaseError(ctx, 'buscar assinaturas do usuario', subsRes.error);
    if (pendingRes.error) logSupabaseError(ctx, 'buscar compras pendentes', pendingRes.error);

    const payments = new Map<string, PaymentRow>(
        ((paymentsRes.data ?? []) as PaymentRow[]).map((p) => [String(p.id), p])
    );
    const subscriptions = ((subsRes.data ?? []) as SubscriptionRow[]);

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
                subscriptionStatus: subscription?.status ?? null,
                nextBillingAt: subscription?.next_billing_at ?? null,
                canceledAt: subscription?.canceled_at ?? null,
            };
        })
    );

    const licensedPaymentIds = new Set(paymentIds.map(String));
    const pendingPurchases = ((pendingRes.data ?? []) as PaymentRow[])
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
        server_time: new Date().toISOString(),
    });
}
