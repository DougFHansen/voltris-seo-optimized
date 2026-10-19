import { NextRequest } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createAdminClient } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';
import { readSubscriptionSnapshot, syncSubscriptionRow, writePaymentFacts } from '@/lib/stripe-sync';
import { resolveBillingState, toStripeIdString } from '@/lib/billing-state';
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
 * POST /api/stripe/sync — "Sincronizar Agora" (missão §9).
 *
 * O botão antigo chamava `fetchData()` do próprio navegador, ou seja, apenas
 * relia o Supabase. Se o webhook tivesse atrasado (ou o evento nunca tivesse
 * chegado), a tela continuava mostrando o estado velho e o usuário concluía que
 * a Stripe estava errada.
 *
 * Esta rota consulta a Stripe DIRETO, para as assinaturas e cobranças DO
 * USUÁRIO da sessão, e reconcilia o espelho local. Regras:
 *  - nunca aceita `subscription_id`/`payment_id` de fora para ler dado alheio
 *    (o filtro é sempre `.eq('user_id', user.id)` — proteção contra IDOR);
 *  - limite de frequência: 6 chamadas por minuto por usuário (o guard 'sync');
 *  - sucesso só é devolvido quando TODAS as assinaturas foram reconciliadas;
 *  - nenhuma cobrança pendente é "aprovada" aqui — aprovação exige prova de
 *    pagamento, e isso é responsabilidade do webhook e da rota admin.
 */
export async function POST(req: NextRequest) {
    const correlationId = getOrCreateCorrelationId(req);
    const ctx = startOperation('STRIPE_SYNC', correlationId);

    try {
        const supabase = await createClient();
        const { data: sessionData, error: authError } = await supabase.auth.getUser();
        const user = sessionData?.user ?? null;

        if (authError || !user) {
            return errorWithCorrelation(ctx, 401, 'UNAUTHORIZED', 'Não autorizado');
        }
        ctx.userId = user.id;

        const guard = licenseRateGuard('sync', req, user.id);
        if (!guard.allowed) {
            logWarn(ctx, 'SYNC_RATE_LIMIT', { retryAfterSec: guard.retryAfterSec });
            return rateLimitedResponse(guard, correlationId);
        }

        const admin = createAdminClient();

        const { data: owned, error: ownedErr } = await admin
            .from('subscriptions')
            .select('pagbank_subscription_id,status,plan_type,billing_period,user_id,email,next_billing_at,cancel_at_period_end')
            .eq('user_id', user.id)
            .not('pagbank_subscription_id', 'is', null)
            .limit(25);

        if (ownedErr) {
            logSupabaseError(ctx, 'buscar assinaturas do usuario', ownedErr);
            return errorWithCorrelation(ctx, 500, 'DB_READ_FAILED', 'Não foi possível consultar sua assinatura.');
        }

        const rows = owned ?? [];
        const results: Array<Record<string, unknown>> = [];
        const problems: string[] = [];

        for (const row of rows) {
            const subId = row.pagbank_subscription_id as string;
            try {
                const stripeSub = await stripe.subscriptions.retrieve(subId);
                const snapshot = readSubscriptionSnapshot(stripeSub);
                const sync = await syncSubscriptionRow({
                    supabase: admin,
                    snapshot,
                    fallback: {
                        userId: user.id,
                        email: row.email,
                        planType: row.plan_type,
                        billingPeriod: snapshot.interval ?? row.billing_period,
                    },
                });

                const state = resolveBillingState({
                    subscriptionStatus: sync.status,
                    hasSubscription: true,
                    cancelAtPeriodEnd: snapshot.cancelAtPeriodEnd,
                    nextBillingAt: snapshot.cancelAtPeriodEnd ? null : snapshot.currentPeriodEnd,
                });

                // Reconcilia a COBRANCA mais recente: se a Stripe já pagou algo
                // que o webhook ainda não registrou, o espelho da compra é
                // corrigido aqui — sem inventar status.
                await reconcileLatestPaidInvoice(admin, subId);

                results.push({
                    subscriptionId: subId,
                    state: state.state,
                    stateLabel: state.label,
                    renewalEnabled: state.renewalEnabled,
                    nextBillingAt: snapshot.cancelAtPeriodEnd ? null : snapshot.currentPeriodEnd,
                    accessUntil: snapshot.currentPeriodEnd,
                    cancelAtPeriodEnd: snapshot.cancelAtPeriodEnd,
                    changed: sync.changes.length > 0,
                    changes: sync.changes,
                });
            } catch (err: any) {
                problems.push(`${subId}: ${String(err?.message ?? err).slice(0, 120)}`);
                logWarn(ctx, 'assinatura nao reconciliada', {
                    sub: subId, error: String(err?.message ?? err).slice(0, 140),
                });
            }
        }

        if (problems.length > 0 && results.length === 0) {
            return errorWithCorrelation(
                ctx, 502, 'STRIPE_UNAVAILABLE',
                'O processador de pagamentos não respondeu. Tente novamente em instantes.'
            );
        }

        logSuccess(ctx, 'sincronizacao concluida', {
            user: maskEmail(user.email),
            assinaturas: results.length,
            alteradas: results.filter((r) => r.changed).length,
            problemas: problems.length,
        });

        return jsonWithCorrelation(ctx, {
            ok: problems.length === 0,
            syncedAt: new Date().toISOString(),
            subscriptions: results,
            problems,
            message: problems.length === 0
                ? (results.length === 0
                    ? 'Nenhuma assinatura recorrente encontrada para sincronizar.'
                    : `Sincronização concluída: ${results.length} assinatura(s) conferida(s) com a Stripe.`)
                : 'Sincronização parcial: uma ou mais assinaturas não puderam ser conferidas agora.',
        });
    } catch (error: any) {
        logError(ctx, 'sincronizacao falhou', { error: error?.message });
        return errorWithCorrelation(ctx, 500, 'SYNC_FAILED', 'Erro ao sincronizar com o processador de pagamentos.');
    }
}

/**
 * Confere as faturas mais recentes da assinatura e completa os fatos delas
 * quando o webhook ainda não o fez (invoice_id, charge, período, valor pago).
 *
 * O que esta função NÃO faz, de propósito:
 *  - não cria cobrança que não existe no banco. Emitir linha nova (e renovar a
 *    licença) é responsabilidade do webhook e da rota admin de reconciliação,
 *    onde existe o gate de prova e a emissão canônica de licença;
 *  - não muda `payments.status`. O status só muda por evento da Stripe.
 * Aqui o ganho é o espelho ficar completo para a fatura PDF e para o painel.
 */
async function reconcileLatestPaidInvoice(
    admin: ReturnType<typeof createAdminClient>,
    subscriptionId: string
): Promise<void> {
    const invoices = await stripe.invoices.list({ subscription: subscriptionId, limit: 3 });
    // A versão do cliente instalado tipa `Invoice` sem `paid`/`payment_intent`
    // (mudaram de local entre versões da API). O helper centraliza a leitura.
    for (const raw of invoices.data) {
        const inv = raw as unknown as Record<string, any>;
        if (inv.status !== 'paid' || inv.paid !== true) continue;

        const piRaw = inv.payment_intent;
        const piId = typeof piRaw === 'string' ? piRaw : (piRaw?.id ?? null);
        const periodStartEpoch = inv.lines?.data?.[0]?.period?.start ?? null;
        const periodEndEpoch = inv.lines?.data?.[0]?.period?.end ?? null;

        const filters = [
            piId ? `stripe_id.eq.${piId}` : '',
            inv.id ? `stripe_invoice_id.eq.${inv.id}` : '',
        ].filter(Boolean);
        if (filters.length === 0) return;

        const { data: existing } = await admin
            .from('payments')
            .select('id, stripe_invoice_id')
            .or(filters.join(','))
            .limit(1)
            .maybeSingle();

        if (existing?.id) {
            await writePaymentFacts(admin, {
                paymentId: existing.id,
                stripeInvoiceId: inv.id ?? null,
                stripeSubscriptionId: subscriptionId,
                stripeCustomerId: toStripeIdString(inv.customer),
                amount: (inv.amount_paid ?? 0) / 100,
                currency: inv.currency ?? 'brl',
                paidAt: inv.status_transitions?.paid_at ?? null,
                periodStart: periodStartEpoch ? new Date(periodStartEpoch * 1000).toISOString() : null,
                periodEnd: periodEndEpoch ? new Date(periodEndEpoch * 1000).toISOString() : null,
                invoiceKind: 'renewal',
            });
        }
        return;
    }
}