/**
 * NÚCLEO DE SINCRONIZAÇÃO STRIPE -> SUPABASE (missão §3, §4, §7 e §10).
 *
 * Um único lugar que sabe ler a Stripe e escrever o espelho local. Existe
 * porque o bug original era estrutural: o webhook, o "Sincronizar Agora" e a
 * reconciliação admin escreviam em campos diferentes, então nenhum dos três
 * preenchia `next_billing_at` — que é exatamente a coluna que o painel lê para
 * dizer "Renovação: Ativada".
 *
 * Invariantes garantidas aqui:
 *  - NUNCA escreve um estado financeiro sem ter lido o objeto na Stripe;
 *  - `cancel_at_period_end = true` na Stripe NUNCA é sobrescrito por um sync
 *    local (missão §7: "não sobrescrever um cancelamento confirmado");
 *  - todo erro de escrita é lançado — nada de "200 falso";
 *  - a assinatura só é gravada quando a Stripe confirma que ela existe.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type Stripe from 'stripe';
import {
    toSubscriptionStatus,
    toStripeIdString,
    type SubscriptionStatus,
} from '@/lib/billing-state';

/** Subconjunto da assinatura que este módulo precisa (evita acoplar ao SDK). */
export type StripeSubscriptionLike = Stripe.Subscription | Record<string, any>;

export interface SubscriptionSnapshot {
    stripeSubscriptionId: string;
    stripeCustomerId: string | null;
    status: SubscriptionStatus;
    /** true quando a Stripe ainda vai cobrar de novo. */
    cancelAtPeriodEnd: boolean;
    /** Epoch (s) do fim do período ATUAL — base do next_billing_at. */
    currentPeriodEnd: string | null;
    currentPeriodStart: string | null;
    /** Epoch (s) de cancelamento imediato, quando houver. */
    canceledAt: string | null;
    canceledReason: string | null;
    /** true quando cancel_at_period_end está ligado E ainda não terminou. */
    endsAtPeriodEnd: boolean;
    priceId: string | null;
    interval: 'month' | 'year' | null;
    latestInvoiceId: string | null;
    paymentMethodBrand: string | null;
    paymentMethodLast4: string | null;
}

function isoFromEpoch(value: unknown): string | null {
    if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) return null;
    return new Date(value * 1000).toISOString();
}

/**
 * Lê a assinatura da Stripe e devolve o espelho normalizado.
 *
 * Tolera as duas formas de período da API moderna (`current_period_end` no
 * topo ou dentro de `items.data[0].current_period_end`), porque a versão do
 * cliente usada pelo projeto e a do painel divergem entre si.
 */
export function readSubscriptionSnapshot(sub: StripeSubscriptionLike): SubscriptionSnapshot {
    const s = sub as Record<string, any>;

    const periodEndEpoch: number | null =
        typeof s.current_period_end === 'number'
            ? s.current_period_end
            : (s.items?.data?.[0]?.current_period_end ?? null);
    const periodStartEpoch: number | null =
        typeof s.current_period_start === 'number'
            ? s.current_period_start
            : (s.items?.data?.[0]?.current_period_start ?? null);

    const cancelAtPeriodEnd = s.cancel_at_period_end === true;
    const status = toSubscriptionStatus({
        stripeStatus: typeof s.status === 'string' ? s.status : null,
        cancelAtPeriodEnd,
    });

    const price = s.items?.data?.[0]?.price ?? s.default_price ?? null;
    const recurring = price?.recurring ?? null;
    const interval: 'month' | 'year' | null =
        recurring?.interval === 'month' || recurring?.interval === 'year' ? recurring.interval : null;

    const pm = s.default_payment_method;

    return {
        stripeSubscriptionId: String(s.id),
        stripeCustomerId: toStripeIdString(s.customer),
        status,
        cancelAtPeriodEnd,
        currentPeriodEnd: isoFromEpoch(periodEndEpoch),
        currentPeriodStart: isoFromEpoch(periodStartEpoch),
        canceledAt: isoFromEpoch(s.canceled_at),
        canceledReason: typeof s.canceled_reason === 'string' ? s.canceled_reason : null,
        // "cancelamento agendado" = vai cobrar agora, mas NÃO na próxima virada.
        endsAtPeriodEnd: cancelAtPeriodEnd && status !== 'CANCELED',
        priceId: typeof price === 'string' ? price : (price?.id ?? null),
        interval,
        latestInvoiceId: toStripeIdString(s.latest_invoice),
        paymentMethodBrand:
            pm && typeof pm === 'object' ? (pm.card?.brand ?? null) : null,
        paymentMethodLast4:
            pm && typeof pm === 'object' ? (pm.card?.last4 ?? null) : null,
    };
}

export interface SyncSubscriptionInput {
    supabase: SupabaseClient;
    snapshot: SubscriptionSnapshot;
    /**
     * Metadados vindos da NOSSA origem (checkout, sessão ou linha de payments).
     * Só preenchem campos vazios: nunca sobrescrevem dado já gravado pela
     * Stripe, exceto explicitamente indicado.
     */
    fallback?: {
        referenceId?: string | null;
        userId?: string | null;
        email?: string | null;
        planType?: string | null;
        billingPeriod?: string | null;
        paymentId?: string | null;
    };
}

export interface SyncSubscriptionResult {
    subscriptionId: string | null;
    created: boolean;
    /** Estado gravado em `subscriptions.status`. */
    status: SubscriptionStatus;
    /** O que mudou em relação ao que estava no banco (para log/diagnóstico). */
    changes: string[];
}

function nowIso(): string {
    return new Date().toISOString();
}

/**
 * Grava (ou atualiza) a assinatura no Supabase refletindo o estado da Stripe.
 *
 * Regras de escrita:
 *  - `next_billing_at` recebe SEMPRE o fim do período atual quando a assinatura
 *    ainda vai cobrar. É o dado que faltava e que faz o painel parar de dizer
 *    "Renovação: desligada" com assinatura viva;
 *  - se `cancel_at_period_end` está ligado, `next_billing_at` vira NULL
 *    (não existe próxima cobrança) e `canceled_at` passa a ser o instante em
 *    que o cancelamento foi pedido — que é informação útil e verdadeira;
 *  - `canceled_at` da Stripe NUNCA é apagado por um sync local.
 */
export async function syncSubscriptionRow(
    input: SyncSubscriptionInput
): Promise<SyncSubscriptionResult> {
    const { supabase, snapshot, fallback } = input;
    const now = nowIso();
    const changes: string[] = [];

    const { data: existing, error: readErr } = await supabase
        .from('subscriptions')
        .select('id,reference_id,user_id,email,plan_type,billing_period,status,next_billing_at,canceled_at,cancel_at_period_end,stripe_customer_id,payment_id')
        .eq('pagbank_subscription_id', snapshot.stripeSubscriptionId)
        .maybeSingle();

    if (readErr) throw new Error(`SUBSCRIPTION_READ_FAILED: ${readErr.message}`);

    // next_billing_at só existe quando a Stripe realmente programmed nova cobrança.
    const nextBillingAt = snapshot.cancelAtPeriodEnd ? null : snapshot.currentPeriodEnd;
    const canceledAt = snapshot.canceledAt
        ?? (snapshot.cancelAtPeriodEnd ? now : null);

    const patch: Record<string, unknown> = {
        status: snapshot.status,
        cancel_at_period_end: snapshot.cancelAtPeriodEnd,
        next_billing_at: nextBillingAt,
        canceled_reason: snapshot.canceledReason,
        ended_at: snapshot.status === 'CANCELED' ? (snapshot.currentPeriodEnd ?? now) : null,
        stripe_customer_id: snapshot.stripeCustomerId,
        stripe_price_id: snapshot.priceId,
        latest_invoice_id: snapshot.latestInvoiceId,
        updated_at: now,
    };

    if (snapshot.paymentMethodBrand) patch.payment_method_brand = snapshot.paymentMethodBrand;
    if (snapshot.paymentMethodLast4) patch.payment_method_last4 = snapshot.paymentMethodLast4;

    // Cancelamento confirmado na Stripe não pode ser apagado por sincronização.
    if (canceledAt) patch.canceled_at = canceledAt;
    else if (existing?.canceled_at) patch.canceled_at = existing.canceled_at;

    // Metadados: só preenchem o que está vazio; dado real da Stripe manda.
    if (!existing) {
        patch.pagbank_subscription_id = snapshot.stripeSubscriptionId;
        // `reference_id` = o id da própria assinatura (`sub_...`). Antes era
        // `sub_${id}`, que produzia `sub_sub_1UT0...` e quebrava o
        // casamento por referência entre `subscriptions` e `payments`.
        patch.reference_id = fallback?.referenceId ?? snapshot.stripeSubscriptionId;
        patch.user_id = fallback?.userId ?? null;
        patch.email = fallback?.email ?? null;
        patch.plan_type = fallback?.planType ?? null;
        patch.billing_period = snapshot.interval ?? fallback?.billingPeriod ?? null;
        if (fallback?.paymentId) patch.payment_id = fallback.paymentId;
    } else {
        if (existing.plan_type == null && fallback?.planType) patch.plan_type = fallback.planType;
        if (existing.user_id == null && fallback?.userId) patch.user_id = fallback.userId;
        if (existing.email == null && fallback?.email) patch.email = fallback.email;
        if (existing.billing_period == null && snapshot.interval) patch.billing_period = snapshot.interval;
        if (existing.payment_id == null && fallback?.paymentId) patch.payment_id = fallback.paymentId;

        if (existing.status !== snapshot.status) changes.push(`status:${existing.status}->${snapshot.status}`);
        if ((existing.next_billing_at ?? null) !== nextBillingAt) changes.push('next_billing_at');
        if ((existing.cancel_at_period_end ?? false) !== snapshot.cancelAtPeriodEnd) changes.push('cancel_at_period_end');
        if ((existing.stripe_customer_id ?? null) !== snapshot.stripeCustomerId) changes.push('stripe_customer_id');
    }

    const { error: writeErr } = await supabase
        .from('subscriptions')
        .upsert(patch, { onConflict: 'pagbank_subscription_id' });

    if (writeErr) throw new Error(`SUBSCRIPTION_WRITE_FAILED: ${writeErr.message}`);

    // Propaga o cus_ para as cobranças daquela assinatura (histórico/fatura).
    if (snapshot.stripeCustomerId) {
        const { error: payErr } = await supabase
            .from('payments')
            .update({ stripe_customer_id: snapshot.stripeCustomerId })
            .eq('stripe_subscription_id', snapshot.stripeSubscriptionId)
            .is('stripe_customer_id', null);
        if (payErr) throw new Error(`PAYMENT_CUSTOMER_LINK_FAILED: ${payErr.message}`);
    }

    return {
        subscriptionId: snapshot.stripeSubscriptionId,
        created: !existing,
        status: snapshot.status,
        changes,
    };
}

/**
 * Grava os fatos de uma COBRANCA confirmada (usado por checkout e invoice.paid).
 *
 * Por que colunas separadas e não `stripe_id`: o `stripe_id` guarda o
 * PaymentIntent (compatibilidade com as rotas antigas), mas invoice/charge são
 * identificadores diferentes e necessários para (a) emitir a fatura da
 * COBRANCA certa e (b) não reembolsar duas vezes a mesma transação.
 */
export interface PaymentFacts {
    paymentId: string;
    stripeCustomerId?: string | null;
    stripeSubscriptionId?: string | null;
    stripeInvoiceId?: string | null;
    stripeChargeId?: string | null;
    /** Valor LIQUIDADO em reais (o que a Stripe diz que recebeu). */
    amount?: number | null;
    currency?: string | null;
    /** Epoch (s) da liquidação. */
    paidAt?: number | null;
    periodStart?: string | null;
    periodEnd?: string | null;
    invoiceKind?: 'purchase' | 'renewal' | 'service' | null;
    customerName?: string | null;
}

export async function writePaymentFacts(
    supabase: SupabaseClient,
    facts: PaymentFacts
): Promise<void> {
    const patch: Record<string, unknown> = { updated_at: nowIso() };

    if (facts.stripeCustomerId) patch.stripe_customer_id = facts.stripeCustomerId;
    if (facts.stripeSubscriptionId) patch.stripe_subscription_id = facts.stripeSubscriptionId;
    if (facts.stripeInvoiceId) patch.stripe_invoice_id = facts.stripeInvoiceId;
    if (facts.stripeChargeId) patch.stripe_charge_id = facts.stripeChargeId;
    if (typeof facts.amount === 'number' && Number.isFinite(facts.amount)) patch.amount = facts.amount;
    if (facts.currency) patch.currency = facts.currency.toUpperCase();
    if (facts.paidAt) patch.paid_at = isoFromEpoch(facts.paidAt);
    if (facts.periodStart) patch.period_start = facts.periodStart;
    if (facts.periodEnd) patch.period_end = facts.periodEnd;
    if (facts.invoiceKind) patch.invoice_kind = facts.invoiceKind;
    if (facts.customerName) patch.customer_name_snapshot = facts.customerName;

    const { error } = await supabase.from('payments').update(patch).eq('id', facts.paymentId);
    if (error) throw new Error(`PAYMENT_FACTS_WRITE_FAILED: ${error.message}`);
}