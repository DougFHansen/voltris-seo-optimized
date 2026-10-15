/**
 * GET|POST /api/admin/reconcile — missão §10 (reconciliação dos pendentes).
 *
 * Regras invioláveis:
 *  - somente admin (profiles.is_admin) — mesma convenção de /api/admin/deploys;
 *  - DRY-RUN POR PADRÃO: nada é escrito sem { apply: true, confirm: "RECONCILE-APPLY" };
 *  - a AUTORIDADE é a Stripe: "pagou" vem de payment_status / subscription da
 *    sessão, nunca de suposição do banco local nem do navegador;
 *  - SEM PROVA NÃO HÁ ESCRITA: pagamento sem match na Stripe vira NEEDS_MANUAL,
 *    nunca "não pago" (perder acesso de quem pagou é pior que um pendente a mais);
 *  - a licença é emitida pela RPC canônica generate_complete_license_v3, que é
 *    idempotente por payment_id (advisory lock) — rodar duas vezes não duplica;
 *  - período/renovação usam o interval e o current_period_end REAIS da assinatura;
 *  - logs mascarados (e-mail mascarado, nenhuma chave completa, nenhum segredo);
 *  - se algum passo do apply falhar, a resposta é 500 com o relatório no corpo
 *    (sem 200 falso).
 */

import { NextRequest, NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';
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

const PENDING_STATUSES = ['pending', 'processing', 'open', 'unpaid', 'criado', 'novo'];

/** Pagamento mais velho que ainda merece espera antes de ser marcado como não pago. */
const GRACE_DAYS = 3;

type ReconcileAction =
    | 'EMIT_LICENSE'
    | 'APPROVE_PAYMENT'
    | 'LINK_SUBSCRIPTION'
    | 'ALREADY_ISSUED'
    | 'WAIT_STRIPE'
    | 'MARK_UNPAID'
    | 'NEEDS_MANUAL';

interface PendingRow {
    id: string;
    reference_id: string | null;
    status: string | null;
    provider: string | null;
    stripe_id: string | null;
    plan_type: string | null;
    billing_period: string | null;
    amount: number | null;
    user_id: string | null;
    email: string | null;
    created_at: string | null;
}

interface ReportRow {
    payment_id: string;
    reference_id: string | null;
    created_at: string | null;
    age_days: number | null;
    plan_type: string | null;
    billing_period: string | null;
    amount: number | null;
    db_status: string | null;
    is_license: boolean;
    stripe: {
        found: boolean;
        source: 'checkout_metadata' | 'checkout_id' | 'checkout_email' | 'payment_intent' | 'none';
        session_id?: string;
        payment_status?: string;
        subscription_id?: string | null;
        pi_status?: string;
    };
    action: ReconcileAction;
    reason: string;
    /** O que a rotina faz (apply) ou faria (dry-run). */
    effect: string;
    applied?: boolean;
    error?: string;
}

export async function GET(req: NextRequest) {
    return run(req, false);
}

export async function POST(req: NextRequest) {
    const body = await req.json().catch(() => ({} as Record<string, unknown>));
    const apply = body.apply === true;
    const confirm = String(body.confirm ?? '');
    if (apply && confirm !== 'RECONCILE-APPLY') {
        // Trava acidental: exigir frase literal, não basta um boolean.
        const ctx = startOperation('ADMIN_RECONCILE', getOrCreateCorrelationId(req));
        return errorWithCorrelation(ctx, 400, 'CONFIRM_REQUIRED',
            'Para aplicar, envie { apply: true, confirm: "RECONCILE-APPLY" }. Sem isso a rota é dry-run.');
    }
    return run(req, apply, Array.isArray(body.refs) ? body.refs.map(String) : undefined);
}

async function run(req: NextRequest, apply: boolean, onlyRefs?: string[]) {
    const correlationId = getOrCreateCorrelationId(req);
    const ctx = startOperation('ADMIN_RECONCILE', correlationId);

    try {
        // ---------------- 1. Gate de admin ----------------
        const supabase = await createClient();
        const { data: sessionData, error: authError } = await supabase.auth.getUser();
        const user = sessionData?.user ?? null;
        if (authError || !user) return errorWithCorrelation(ctx, 401, 'UNAUTHORIZED', 'Não autorizado');

        const { data: profile, error: profileErr } = await supabase
            .from('profiles').select('is_admin').eq('id', user.id).maybeSingle();
        if (profileErr) logSupabaseError(ctx, 'ler perfil do admin', profileErr);
        if (!profile?.is_admin) {
            logWarn(ctx, 'reconciliação tentada por não-admin', { user: maskEmail(user.email) });
            return errorWithCorrelation(ctx, 403, 'FORBIDDEN', 'Apenas administradores');
        }

        ctx.userId = user.id;
        const admin = createAdminClient();

        // ---------------- 2. Pagamentos pendentes ----------------
        let pendingQuery = admin.from('payments')
            .select('id,reference_id,status,provider,stripe_id,plan_type,billing_period,amount,user_id,email,created_at')
            .in('status', PENDING_STATUSES)
            .order('created_at', { ascending: false })
            .limit(200);

        if (onlyRefs?.length) pendingQuery = pendingQuery.in('reference_id', onlyRefs);

        const { data: pending, error: pendingErr } = await pendingQuery;
        if (pendingErr) {
            logSupabaseError(ctx, 'listar pagamentos pendentes', pendingErr);
            return errorWithCorrelation(ctx, 500, 'DB_READ_FAILED', 'Falha ao listar pagamentos');
        }

        const rows = (pending ?? []) as unknown as PendingRow[];
        const stripeRows = rows.filter((r) => (r.provider ?? 'stripe') === 'stripe');

        // ---------------- 3. Licenças já emitidas (evita dupla emissão) ----------------
        const paidIds = rows.map((r) => r.id);
        const licensedPaymentIds = new Set<string>();
        if (paidIds.length) {
            const { data: issued, error: issuedErr } = await admin.from('licenses')
                .select('payment_id').in('payment_id', paidIds);
            if (issuedErr) logSupabaseError(ctx, 'verificar licenças emitidas', issuedErr);
            for (const l of (issued ?? [] as { payment_id: string | null }[])) {
                if (l.payment_id) licensedPaymentIds.add(String(l.payment_id));
            }
        }

        // ---------------- 4. Verdade da Stripe ----------------
        const oldestEpoch = oldestCreatedAt(rows);
        const sessions = await loadCheckoutSessions(oldestEpoch);
        const subCache = new Map<string, Stripe.Subscription | null>();

        const report: ReportRow[] = [];
        for (const p of rows) {
            report.push(await classify(ctx, p, sessions, subCache, licensedPaymentIds));
        }

        // ---------------- 5. Apply ----------------
        const errors: string[] = [];
        if (apply) {
            for (const row of report) {
                if (row.action === 'ALREADY_ISSUED' || row.action === 'WAIT_STRIPE' || row.action === 'NEEDS_MANUAL') continue;
                const source = stripeRows.find((r) => r.id === row.payment_id);
                try {
                    await execute(ctx, admin, row, source ?? null, subCache);
                    row.applied = true;
                } catch (err: any) {
                    row.applied = false;
                    row.error = String(err?.message ?? err).slice(0, 300);
                    errors.push(`${row.payment_id}:${row.action}:${row.error}`);
                    logError(ctx, 'apply da reconciliação falhou', {
                        payment: row.payment_id, action: row.action, error: row.error,
                    });
                }
            }
        }

        const summary = report.reduce<Record<string, number>>((acc, r) => {
            acc[r.action] = (acc[r.action] ?? 0) + 1;
            return acc;
        }, {});

        logSuccess(ctx, apply ? 'reconciliação aplicada' : 'reconciliação (dry-run)', {
            pendentes: report.length, summary, admin: maskEmail(user.email),
        });

        const payload = {
            mode: apply ? ('apply' as const) : ('dry_run' as const),
            total_pending: report.length,
            summary,
            report,
        };

        if (apply && errors.length) {
            // Missão §4: nunca 200 falso quando parte do trabalho não aconteceu.
            const res = jsonWithCorrelation(ctx, { ...payload, failed: errors.length }, 500);
            return res;
        }
        return jsonWithCorrelation(ctx, payload);
    } catch (error: any) {
        logError(ctx, 'reconciliação abortada', { error: error?.message });
        return errorWithCorrelation(ctx, 500, 'RECONCILE_FAILED', 'Erro na reconciliação');
    }
}

// ============================================================================
// Listagem das sessões de checkout do período (cache por metadata.reference_id)
// ============================================================================

interface SessionIndex {
    byRef: Map<string, Stripe.Checkout.Session>;
    byId: Map<string, Stripe.Checkout.Session>;
    /**
     * Junção de ÚLTIMO RECURSO. Medido no banco vivo (2026-10-15): os 34
     * pendentes têm payments.stripe_id = NULL e reference_id interno (st_/sv_/
     * stripe_), e só 1 sessão de checkout carrega metadata.reference_id. Ou
     * seja: nem a referência nem o id amarram; sobra o e-mail do cliente.
     * Só vale quando há EXATAMENTE UMA sessão para o e-mail (senão seria
     * atribuir pagamento de um cliente a outro).
     */
    byEmail: Map<string, Stripe.Checkout.Session[]>;
}

async function loadCheckoutSessions(sinceEpoch: number): Promise<SessionIndex> {
    const byRef = new Map<string, Stripe.Checkout.Session>();
    const byId = new Map<string, Stripe.Checkout.Session>();
    const byEmail = new Map<string, Stripe.Checkout.Session[]>();

    let cursor: string | undefined;
    for (let page = 0; page < 20; page++) {
        const list = await stripe.checkout.sessions.list({
            limit: 100,
            created: { gte: sinceEpoch },
            ...(cursor ? { starting_after: cursor } : {}),
        } as Stripe.Checkout.SessionListParams);

        for (const s of list.data) {
            byId.set(s.id, s);
            const ref = (s.metadata as Record<string, string> | undefined)?.reference_id;
            if (ref) byRef.set(String(ref), s);
            const email = String(s.customer_details?.email ?? s.customer_email ?? '').toLowerCase().trim();
            if (email) {
                const bucket = byEmail.get(email);
                if (bucket) bucket.push(s); else byEmail.set(email, [s]);
            }
        }
        if (!list.has_more) break;
        cursor = list.data[list.data.length - 1]?.id;
        if (!cursor) break;
    }

    return { byRef, byId, byEmail };
}

function oldestCreatedAt(rows: PendingRow[]): number {
    let min = Infinity;
    for (const r of rows) {
        const t = r.created_at ? new Date(r.created_at).getTime() : NaN;
        if (!Number.isNaN(t)) min = Math.min(min, t);
    }
    if (!Number.isFinite(min)) min = Date.now() - 120 * 86_400_000;
    // Margem: a sessão pode ter sido criada antes do registro no banco.
    return Math.floor((min - 7 * 86_400_000) / 1000);
}

// ============================================================================
// Classificação (não escreve nada)
// ============================================================================

async function classify(
    ctx: OperationContext,
    p: PendingRow,
    sessions: SessionIndex,
    subCache: Map<string, Stripe.Subscription | null>,
    licensedPaymentIds: Set<string>
): Promise<ReportRow> {
    const createdMs = p.created_at ? new Date(p.created_at).getTime() : null;
    const ageDays = createdMs ? Math.floor((Date.now() - createdMs) / 86_400_000) : null;
    const isLicense = ['standard', 'pro', 'enterprise', 'trial'].includes(String(p.plan_type ?? '').toLowerCase());

    const base: ReportRow = {
        payment_id: p.id,
        reference_id: p.reference_id,
        created_at: p.created_at,
        age_days: ageDays,
        plan_type: p.plan_type,
        billing_period: p.billing_period,
        amount: p.amount,
        db_status: p.status,
        is_license: isLicense,
        stripe: { found: false, source: 'none' },
        action: 'NEEDS_MANUAL',
        reason: '',
        effect: '',
    };

    // Provedor antigo/não Stripe: nada automatizável.
    if ((p.provider ?? 'stripe') !== 'stripe') {
        base.reason = `provider="${p.provider ?? 'null'}" fora do fluxo Stripe`;
        base.effect = 'nenhum (exige checagem manual no provedor)';
        return base;
    }

    let session: Stripe.Checkout.Session | undefined = p.reference_id
        ? sessions.byRef.get(p.reference_id) : undefined;
    let sessionSource: 'checkout_metadata' | 'checkout_id' | 'checkout_email' = 'checkout_metadata';

    if (!session && p.stripe_id?.startsWith('cs_')) {
        session = sessions.byId.get(p.stripe_id) ?? await retrieveSession(ctx, p.stripe_id);
        if (session) sessionSource = 'checkout_id';
    }

    let emailAmbiguous = false;
    if (!session) {
        const email = String(p.email ?? '').toLowerCase().trim();
        if (email) {
            const matches = sessions.byEmail.get(email) ?? [];
            if (matches.length === 1) {
                session = matches[0];
                sessionSource = 'checkout_email';
            } else if (matches.length > 1) {
                // Várias sessões para o mesmo e-mail: não há como saber qual
                // delas é este payment_id. Automatizar aqui seria chute.
                emailAmbiguous = true;
            }
        }
    }

    if (session) {
        const subId = typeof session.subscription === 'string' ? session.subscription : null;
        base.stripe = {
            found: true,
            source: sessionSource,
            session_id: session.id,
            payment_status: session.payment_status,
            subscription_id: subId,
        };
    } else if (p.stripe_id?.startsWith('pi_')) {
        // Fallback: pagamento avulso registrado por PaymentIntent (serviços legados).
        try {
            const pi = await stripe.paymentIntents.retrieve(p.stripe_id);
            base.stripe = {
                found: true,
                source: 'payment_intent',
                payment_status: pi.status,
                pi_status: pi.status,
            };
        } catch (err: any) {
            base.stripe = { found: false, source: 'none' };
            base.reason = `PaymentIntent ${p.stripe_id} não localizado na Stripe: ${String(err?.message ?? err).slice(0, 80)}`;
            base.effect = 'nenhum (verificar manualmente)';
            return base;
        }
    }

    const settled =
        base.stripe.source === 'payment_intent'
            ? base.stripe.pi_status === 'succeeded'
            : base.stripe.payment_status === 'paid';

    if (!base.stripe.found) {
        // SEM PROVA NÃO SE ESCREVE NADA (missão §10/§13): "não achar a Stripe"
        // não significa "não pago" — os 34 pendentes reais deste banco têm
        // stripe_id NULL e referência interna, então a ausência de match é
        // limitação de registro legado, não evidência de inadimplência.
        base.reason = emailAmbiguous
            ? 'múltiplas sessões da Stripe para o mesmo e-mail — não é possível atribuir este pagamento a uma delas'
            : 'nenhum checkout correspondente localizado na Stripe (sem stripe_id e sem match de referência/e-mail)';
        base.action = 'NEEDS_MANUAL';
        base.effect = emailAmbiguous
            ? 'nenhum (revisão humana: comparar sessões do e-mail com o valor/data do pedido)'
            : 'nenhum (revisão humana; NÃO marcar como não pago sem prova)';
        return base;
    }

    if (!settled) {
        if (ageDays !== null && ageDays > GRACE_DAYS) {
            base.reason = `Stripe reporta payment_status="${base.stripe.payment_status}" após ${ageDays} dias`;
            base.action = 'MARK_UNPAID';
            base.effect = 'payments.status -> "failed"';
        } else {
            base.reason = `Stripe reporta payment_status="${base.stripe.payment_status}"`;
            base.action = 'WAIT_STRIPE';
            base.effect = 'nenhum';
        }
        return base;
    }

    // Pagamento confirmado: é licença ou serviço?
    if (!isLicense) {
        base.action = 'APPROVE_PAYMENT';
        base.reason = 'serviço liquidado na Stripe; pagamento ainda "pending" no banco';
        base.effect = 'payments.status -> "approved"';
        return base;
    }

    if (licensedPaymentIds.has(p.id)) {
        base.action = licensedPaymentIds.has(p.id) && base.stripe.subscription_id ? 'LINK_SUBSCRIPTION' : 'ALREADY_ISSUED';
        base.reason = 'licença já existe para este payment_id (emissão idempotente)';
        base.effect = base.action === 'LINK_SUBSCRIPTION'
            ? 'apenas vincula/atualiza a linha de subscriptions (status ACTIVE + next_billing_at da Stripe)'
            : 'nenhum';
        if (base.action === 'ALREADY_ISSUED') return base;
    } else {
        base.action = 'EMIT_LICENSE';
        base.reason = 'pagamento liquidado sem licença emitida';
        base.effect = 'payments.status -> "approved" + RPC generate_complete_license_v3 (idempotente) + subscription registrada';
    }

    // Garante que o período usado vem da assinatura real, não do banco.
    if (base.stripe.subscription_id) {
        await getSubscription(ctx, subCache, base.stripe.subscription_id);
    }

    return base;
}

async function retrieveSession(ctx: OperationContext, id: string): Promise<Stripe.Checkout.Session | undefined> {
    try {
        return await stripe.checkout.sessions.retrieve(id);
    } catch (err: any) {
        logWarn(ctx, 'sessão informada em payments.stripe_id não existe na Stripe', {
            session: id, error: String(err?.message ?? err).slice(0, 80),
        });
        return undefined;
    }
}

async function getSubscription(
    ctx: OperationContext,
    cache: Map<string, Stripe.Subscription | null>,
    id: string
): Promise<Stripe.Subscription | null> {
    if (cache.has(id)) return cache.get(id) ?? null;
    try {
        const sub = await stripe.subscriptions.retrieve(id);
        cache.set(id, sub);
        return sub;
    } catch (err: any) {
        logWarn(ctx, 'não foi possível ler a assinatura na Stripe', {
            sub: id, error: String(err?.message ?? err).slice(0, 80),
        });
        cache.set(id, null);
        return null;
    }
}

// ============================================================================
// Execução (só com apply=true)
// ============================================================================

async function execute(
    ctx: OperationContext,
    admin: ReturnType<typeof createAdminClient>,
    row: ReportRow,
    payment: PendingRow | null,
    subCache: Map<string, Stripe.Subscription | null>
) {
    if (!payment) throw new Error('linha do pagamento não encontrada');

    if (row.action === 'MARK_UNPAID') {
        const { error } = await admin.from('payments')
            .update({ status: 'failed', updated_at: new Date().toISOString() })
            .eq('id', payment.id);
        if (error) { logSupabaseError(ctx, 'marcar pagamento como não pago', error); throw new Error(error.message); }
        return;
    }

    if (row.action === 'APPROVE_PAYMENT') {
        const { error } = await admin.from('payments')
            .update({ status: 'approved', stripe_id: payment.stripe_id ?? row.stripe.session_id ?? null, updated_at: new Date().toISOString() })
            .eq('id', payment.id);
        if (error) { logSupabaseError(ctx, 'aprovar pagamento de serviço', error); throw new Error(error.message); }
        return;
    }

    if (row.action === 'EMIT_LICENSE' || row.action === 'LINK_SUBSCRIPTION') {
        const sessionId = row.stripe.session_id ?? null;
        const subscriptionId = row.stripe.subscription_id ?? null;

        // Período e renovação: AUTORITATIVOS da Stripe (missão §7).
        let interval = (payment.billing_period ?? 'month') as 'month' | 'year';
        let nextBillingAt: string | null = null;
        if (subscriptionId) {
            const sub = await getSubscription(ctx, subCache, subscriptionId);
            const price = sub?.items?.data?.[0]?.price;
            const rec = price?.recurring?.interval;
            if (rec === 'year' || rec === 'month') interval = rec;
            const rawPeriod = (sub as unknown as { current_period_end?: number | { end?: number } } | null);
            const epoch = typeof rawPeriod?.current_period_end === 'number'
                ? rawPeriod.current_period_end
                : (rawPeriod?.current_period_end as { end?: number } | undefined)?.end;
            if (epoch) nextBillingAt = new Date(epoch * 1000).toISOString();
        }

        if (subscriptionId) {
            const { error: subErr } = await admin.from('subscriptions').upsert({
                reference_id: payment.reference_id,
                pagbank_subscription_id: subscriptionId,
                user_id: payment.user_id ?? null,
                email: payment.email,
                plan_type: payment.plan_type,
                billing_period: interval,
                status: 'ACTIVE',
                next_billing_at: nextBillingAt,
                updated_at: new Date().toISOString(),
            }, { onConflict: 'pagbank_subscription_id' });
            if (subErr) logSupabaseError(ctx, 'vincular assinatura na reconciliação', subErr);
        }

        if (row.action === 'LINK_SUBSCRIPTION') {
            // licença já emitida: só vinculação/acerto de status
            const { error } = await admin.from('payments')
                .update({ status: 'approved', stripe_id: payment.stripe_id ?? sessionId, updated_at: new Date().toISOString() })
                .eq('id', payment.id);
            if (error) { logSupabaseError(ctx, 'aprovar pagamento já emitido', error); throw new Error(error.message); }
            return;
        }

        const rpcRes = await admin.rpc('generate_complete_license_v3', {
            p_payment_id: payment.id,
            p_user_id: payment.user_id ?? null,
            p_email: payment.email,
            p_plan_type: payment.plan_type,
            p_billing_period: interval,
            p_stripe_session_id: sessionId,
        });
        if (rpcRes.error) {
            logError(ctx, 'RPC de emissão falhou na reconciliação', { error: rpcRes.error.message });
            throw new Error(`LICENSE_ISSUE_FAILED: ${rpcRes.error.message}`);
        }
        const issued = (rpcRes.data ?? null) as { license_key?: string; already_issued?: boolean } | null;
        if (!issued?.license_key) throw new Error('LICENSE_ISSUE_MALFORMED');

        logSuccess(ctx, 'licença emitida pela reconciliação', {
            payment: payment.id,
            key: `${issued.license_key.slice(0, 12)}…`,
            plan: payment.plan_type,
            period: interval,
            already: issued.already_issued === true,
        });
    }
}
