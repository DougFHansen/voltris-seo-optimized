import { NextRequest, NextResponse } from 'next/server';
import type Stripe from 'stripe';
import type { SupabaseClient } from '@supabase/supabase-js';
import { stripe } from '@/lib/stripe';
import { createAdminClient } from '@/utils/supabase/admin';
import {
    extractInvoicePaymentIntentId,
    extractInvoiceSubscriptionId,
    toStripeIdString,
    toSubscriptionStatus,
} from '@/lib/billing-state';
import { STRIPE_SUPPORTED_EVENTS } from '@/lib/stripe-events';
import { readSubscriptionSnapshot, syncSubscriptionRow, writePaymentFacts } from '@/lib/stripe-sync';
import {
    notifyPurchaseConfirmed,
    notifySubscriptionRenewed,
    notifyPaymentFailed,
    notifyRenewalCanceled,
    notifyRefund,
} from '@/lib/email-notifier';
import {
    startOperation,
    logWarn,
    logError,
    logInfo,
    logSuccess,
    logSupabaseError,
    maskEmail,
    type OperationContext,
} from '@/lib/voltris-log';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

/**
 * Eventos que este webhook realmente processa.
 *
 * Exposto de propósito: a lista precisa ser conferível contra o painel da
 * Stripe (missão §12 exige "configurações Stripe que precisam ser conferidas")
 * e contra o checklist de entrega. `default` NÃO é tratado como sucesso: um
 * evento fora desta lista é registrado e ignorado explicitamente.
 */
const SUPPORTED_EVENTS = STRIPE_SUPPORTED_EVENTS;

/**
 * Webhook Stripe — missao secoes 3/4/7/10.
 *
 * Garantias implementadas:
 *  - assinatura criptografica validada (senao 400);
 *  - IDEMPOTENCIA PERSISTENTE por event.id via public.stripe_event_log
 *    (duplicado -> 200 sem reprocessar; 'error' -> permite o retry da Stripe);
 *  - licenca so emite com payment_status='paid' (prova de liquidacao);
 *  - renovacao usa o period end AUTORITATIVO da invoice (nunca now()+intervalo);
 *  - `subscriptions.next_billing_at` / `cancel_at_period_end` passam a ser o
 *    espelho real da Stripe (CAUSA RAIZ do "Renovação: desligada");
 *  - falha de processamento -> status 'error' no log + HTTP 500 (Stripe reenvia);
 *    nunca 200 falso quando a emissao falhou;
 *  - invoice.payment_failed NAO revoga (respeita periodo ja pago);
 *    customer.subscription.deleted revoga;
 *  - logs estruturados correlacionaveis: correlationId = event.id.
 */
export async function POST(req: NextRequest) {
    const payload = await req.text();
    const sig = req.headers.get('stripe-signature');

    if (!sig || !WEBHOOK_SECRET) {
        return NextResponse.json({ error: 'Missing signature or secret' }, { status: 400 });
    }

    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(payload, sig, WEBHOOK_SECRET);
    } catch (err: any) {
        console.error(`⚠️ Webhook signature verification failed: ${err.message}`);
        return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
    }

    const supabase = createAdminClient();

    // ---- Idempotencia persistente por event.id ----
    const claim = await claimEvent(supabase, event.id, event.type);
    if (claim === 'duplicate') {
        return NextResponse.json({ received: true, duplicate: true });
    }

    const ctx = startOperation('STRIPE_WEBHOOK', event.id);

    try {
        await processEvent(supabase, event, ctx);
        await finishEvent(supabase, event.id, 'done');
    } catch (err: any) {
        logError(ctx, 'processamento falhou — aguardando retry da Stripe', { error: err?.message });
        await finishEvent(supabase, event.id, 'error', { error: String(err?.message ?? err).slice(0, 400) });
        return NextResponse.json({ error: 'PROCESSING_FAILED' }, { status: 500 });
    }

    return NextResponse.json({ received: true });
}

// ============================================================================
// Claim/finish do log de eventos
// ============================================================================

async function claimEvent(supabase: SupabaseClient, eventId: string, eventType: string): Promise<'claim' | 'duplicate'> {
    const { error } = await supabase.from('stripe_event_log').insert({
        event_id: eventId,
        event_type: eventType,
        status: 'processing',
    });

    if (!error) return 'claim';

    // 23505 = unique violation (evento ja conhecido)
    if (error.code === '23505' || /duplicate key/i.test(error.message)) {
        const { data } = await supabase
            .from('stripe_event_log')
            .select('status')
            .eq('event_id', eventId)
            .maybeSingle();

        if (data?.status === 'error') {
            // retry legitimo da Stripe apos falha nossa: reprocessa
            await supabase.from('stripe_event_log')
                .update({ status: 'processing', updated_at: new Date().toISOString() })
                .eq('event_id', eventId);
            return 'claim';
        }
        return 'duplicate';
    }

    // Sem o log nao ha como garantir idempotencia — falha recuperavel.
    throw new Error(`stripe_event_log indisponivel: ${error.message}`);
}

async function finishEvent(supabase: SupabaseClient, eventId: string, status: 'done' | 'error', detail?: Record<string, unknown>) {
    const { error } = await supabase.from('stripe_event_log')
        .update({ status, detail: detail ?? null, updated_at: new Date().toISOString() })
        .eq('event_id', eventId);
    if (error) console.error('[STRIPE WEBHOOK] Falha ao fechar event log:', error.message);
}

// ============================================================================
// Roteamento de eventos
//
// Cada evento tem UMA responsabilidade definida (missão §4: "Não processe todos
// indistintamente"). Eventos fora da lista são registrados como não críticos.
// ============================================================================

async function processEvent(supabase: SupabaseClient, event: Stripe.Event, ctx: OperationContext) {
    switch (event.type) {
        case 'checkout.session.completed':
        case 'checkout.session.async_payment_succeeded': {
            await handleCheckoutSettled(supabase, event.data.object as Stripe.Checkout.Session, ctx);
            break;
        }

        case 'checkout.session.async_payment_failed': {
            const session = event.data.object as Stripe.Checkout.Session;
            const ref = session.metadata?.reference_id;
            if (ref) {
                const { error } = await supabase.from('payments')
                    .update({ status: 'failed', stripe_id: session.payment_intent ? String(session.payment_intent) : null })
                    .eq('reference_id', ref);
                if (error) logSupabaseError(ctx, 'marcar pagamento como falho', error);
            }
            logWarn(ctx, 'checkout com pagamento asynco falhou', { ref, session: session.id });
            break;
        }

        case 'invoice.paid': {
            await handleInvoicePaid(supabase, event.data.object as Stripe.Invoice, ctx);
            break;
        }

        case 'invoice.payment_failed': {
            await handleInvoicePaymentFailed(supabase, event.data.object as Stripe.Invoice, ctx);
            break;
        }

        case 'customer.subscription.created':
        case 'customer.subscription.updated': {
            await handleSubscriptionUpsert(supabase, event.data.object as Stripe.Subscription, ctx);
            break;
        }

        case 'customer.subscription.deleted': {
            await handleSubscriptionDeleted(supabase, event.data.object as Stripe.Subscription, ctx);
            break;
        }

        case 'charge.refunded': {
            await handleChargeRefunded(supabase, event.data.object as Stripe.Charge, ctx);
            break;
        }

        case 'refund.updated': {
            await handleRefundUpdated(supabase, event.data.object as Stripe.Refund, ctx);
            break;
        }

        default:
            logInfo(ctx, 'evento ignorado (fora da lista suportada)', { type: event.type });
    }
}

// ============================================================================
// Emissao na primeira compra / servicos
// ============================================================================

async function handleCheckoutSettled(supabase: SupabaseClient, session: Stripe.Checkout.Session, ctx: OperationContext) {
    const referenceId = session.metadata?.reference_id;
    const email = session.customer_email || session.metadata?.customer_email;
    const licenseType = session.metadata?.license_type;
    const userId = session.metadata?.user_id;
    const billingPeriod = session.metadata?.billing_period || 'month';
    const subscriptionId = toStripeIdString(session.subscription);
    const customerId = toStripeIdString(session.customer);
    const type = session.metadata?.type || 'license';

    ctx.userId = userId || undefined;
    logSuccess(ctx, 'checkout liquidado', { ref: referenceId, tipo: type, payment_status: session.payment_status, user: maskEmail(email) });

    // Gate de liquidacao: so emite/aprova com pagamento confirmado.
    if (session.payment_status !== 'paid') {
        logWarn(ctx, 'sessao concluida sem payment_status=paid; nada emitido', { session: session.id, status: session.payment_status });
        return;
    }

    // Resposta 3 (API nova): a assinatura e o objeto mais confiável para saber
    // o periodo realmente pago. Sem isso, `renew_at_period_end` era adivinhado.
    let snapshot = null;
    if (subscriptionId) {
        try {
            const sub = await stripe.subscriptions.retrieve(subscriptionId);
            snapshot = readSubscriptionSnapshot(sub);
        } catch (err: any) {
            logWarn(ctx, 'assinatura ainda indisponivel na Stripe; seguindo com o periodo da sessao', {
                sub: subscriptionId, error: String(err?.message ?? err).slice(0, 120),
            });
        }
    }

    const { data: payRow, error: payLookupError } = await supabase
        .from('payments')
        .select('id, status, plan_type, user_id, email, amount')
        .eq('reference_id', referenceId)
        .maybeSingle();

    if (payLookupError) logSupabaseError(ctx, 'buscar pagamento por reference_id', payLookupError);

    let paymentId: string | null = payRow?.id ?? null;

    if (!paymentId) {
        const { data: created, error: createErr } = await supabase
            .from('payments')
            .insert({
                reference_id: referenceId,
                provider: 'stripe',
                stripe_id: session.payment_intent ? String(session.payment_intent) : session.id,
                stripe_customer_id: customerId,
                stripe_subscription_id: subscriptionId,
                user_id: userId || null,
                email,
                plan_type: licenseType,
                billing_period: type === 'license' ? billingPeriod : null,
                amount: (session.amount_total ?? 0) / 100,
                currency: (session.currency ?? 'brl').toUpperCase(),
                status: 'pending',
                invoice_kind: type === 'license' ? 'purchase' : 'service',
                paid_at: new Date().toISOString(),
                period_start: snapshot?.currentPeriodStart ?? null,
                period_end: snapshot?.currentPeriodEnd ?? null,
            })
            .select('id')
            .single();

        if (createErr || !created) {
            logSupabaseError(ctx, 'registrar pagamento da sessao', createErr);
            throw new Error('PAYMENT_REGISTRATION_FAILED');
        }
        paymentId = created.id;
    } else if (customerId || subscriptionId) {
        // Preenche o que faltava na linha que o checkout já tinha criado.
        const { error: linkErr } = await supabase
            .from('payments')
            .update({
                stripe_customer_id: customerId ?? undefined,
                stripe_subscription_id: subscriptionId ?? undefined,
            })
            .eq('id', paymentId);
        if (linkErr) logSupabaseError(ctx, 'vincular customer/assinatura no pagamento', linkErr);
    }

    // Espelho da assinatura: é daqui que o painel tira "Renovação: Ativada".
    if (subscriptionId && snapshot) {
        const result = await syncSubscriptionRow({
            supabase,
            snapshot,
            fallback: {
                referenceId: referenceId ?? null,
                userId: userId || null,
                email: email ?? null,
                planType: licenseType ?? null,
                billingPeriod: snapshot.interval ?? billingPeriod,
                paymentId,
            },
        });
        logSuccess(ctx, 'assinatura registrada no checkout', {
            sub: subscriptionId, status: result.status,
            next_billing_at: snapshot.currentPeriodEnd,
            cancel_at_period_end: snapshot.cancelAtPeriodEnd,
        });
    }

    if (type !== 'license') {
        // Servico: sem licenca; aprova o pagamento (liquidacao ja confirmada).
        const { error } = await supabase.from('payments')
            .update({ status: 'approved' })
            .eq('id', paymentId);
        if (error) logSupabaseError(ctx, 'aprovar pagamento de servico', error);
        logSuccess(ctx, 'servico aprovado', { ref: referenceId });
        return;
    }

    // Validade = período REALMENTE pago (Stripe > cálculo local).
    const validUntilDate = snapshot?.currentPeriodEnd
        ? snapshot.currentPeriodEnd.slice(0, 10)
        : null;

    const { data, error } = await supabase.rpc('generate_complete_license_v3', {
        p_payment_id: paymentId,
        p_user_id: userId || null,
        p_email: email,
        p_plan_type: licenseType,
        p_billing_period: billingPeriod,
        p_stripe_session_id: session.payment_intent ? String(session.payment_intent) : session.id,
        p_valid_until: validUntilDate,
    });

    if (error) {
        logError(ctx, 'RPC de emissao retornou erro explicito', { error: error.message });
        throw new Error(`LICENSE_ISSUE_FAILED: ${error.message}`);
    }

    const issuedKey = (data as { license_key?: string; already_issued?: boolean } | null)?.license_key ?? null;
    if (!issuedKey) {
        logError(ctx, 'RPC respondeu sem license_key', { data });
        throw new Error('LICENSE_ISSUE_MALFORMED');
    }

    if (!paymentId) {
        // Impossível chegar aqui (o insert acima lança), mas a checagem evita
        // escrever fatos financeiros em uma linha de pagamento indefinida.
        logError(ctx, 'payment_id indefinido apos liquidacao', { ref: referenceId });
        throw new Error('PAYMENT_ID_UNDEFINED');
    }

    await writePaymentFacts(supabase, {
        paymentId,
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        amount: (session.amount_total ?? 0) / 100,
        currency: session.currency ?? 'brl',
        periodStart: snapshot?.currentPeriodStart ?? null,
        periodEnd: snapshot?.currentPeriodEnd ?? null,
        invoiceKind: 'purchase',
    });

    logSuccess(ctx, (data as { already_issued?: boolean }).already_issued
        ? 'licenca ja existia (idempotente por payment_id)'
        : 'licenca emitida', { key: issuedKey.slice(0, 12) + '…', plan: licenseType, period: billingPeriod });

    // =========================================================================
    // E-MAIL DE COMPRA (FASE 4)
    //
    // Só chega aqui com `payment_status === 'paid'` (gate lá no topo desta
    // função) e DEPOIS da licença emitida. A chave `purchase:<payment_id>`
    // garante UM e-mail por compra mesmo que a Stripe reenvie o webhook.
    //
    // `void` + função que nunca lança: e-mail falhando NÃO desfaz a compra nem
    // a licença — a intenção fica na fila e o worker tenta de novo.
    // =========================================================================
    void notifyPurchaseConfirmed({
        paymentId,
        userId: userId || null,
        customerName: null,
        supabase,
        ctx,
    });
}

// ============================================================================
// Renovacao recorrente (periodo autoritativo da Stripe)
// ============================================================================

async function handleInvoicePaid(supabase: SupabaseClient, invoiceRaw: Stripe.Invoice, ctx: OperationContext) {
    // stripe@20 / API 2025-xx: subscription/payment_intent moram em `parent` ou
    // no topo dependendo da versao do evento; any controlado aqui e documentado.
    const invoice = invoiceRaw as any;
    const subId = extractInvoiceSubscriptionId(invoice);
    if (!subId) {
        // invoice sem assinatura: checkout unico ja tratado pelo session.completed
        logInfo(ctx, 'invoice.paid sem subscription — ignorado', { invoice: invoice.id });
        return;
    }

    const { data: known, error: knownErr } = await supabase.from('subscriptions')
        .select('id, reference_id, plan_type, billing_period, user_id, email')
        .eq('pagbank_subscription_id', subId)
        .maybeSingle();
    if (knownErr) logSupabaseError(ctx, 'buscar assinatura', knownErr);

    if (!known) {
        // A assinatura pode ter chegado depois deste evento (ordem invertida).
        // Em vez de descartar a COBRANCA (que ja foi paga de verdade), caimos no
        // caminho de primeira cobranca: e este mesmo `invoice.paid` que emite a
        // licença quando ainda nao existe nenhuma.
        //
        // A distincao compra-inicial vs renovacao continua sendo feita pela
        // CHAVE DE IDEMPOTENCIA (`purchase:<payment>` vs `renewal:<invoice>`) e
        // pelo `invoice_kind` — nunca por suposicao sobre a ordem dos eventos.
        logWarn(ctx, 'invoice.paid para assinatura ainda nao registrada — tratando como primeira cobranca', {
            sub: subId, invoice: invoice.id,
        });
        await handleFirstSubscriptionCharge(supabase, invoice, subId, ctx);
        return;
    }

    const line = invoice.lines?.data?.[0];
    const periodEnd: string | null = line?.period?.end
        ? new Date(line.period.end * 1000).toISOString()
        : null;
    const periodStart: string | null = line?.period?.start
        ? new Date(line.period.start * 1000).toISOString()
        : null;

    const paymentIntentId = extractInvoicePaymentIntentId(invoice);
    const chargeId = toStripeIdString(
        invoice.charge ?? line?.charge ?? invoice.payment_settings ?? null
    );
    const customerId = toStripeIdString(invoice.customer);

    // Payment row da renovacao (dedupe por payment_intent) para trilha + vinculo.
    let renewalPaymentId: string | null = null;

    if (paymentIntentId) {
        const { data: existing } = await supabase.from('payments')
            .select('id').eq('stripe_id', paymentIntentId).maybeSingle();
        renewalPaymentId = existing?.id ?? null;
    }

    if (!renewalPaymentId) {
        const referenceId = `renew_${invoice.number ?? invoice.id}`;
        const { data: created, error: createErr } = await supabase
            .from('payments')
            .insert({
                reference_id: referenceId,
                provider: 'stripe',
                stripe_id: paymentIntentId,
                stripe_invoice_id: invoice.id ?? null,
                stripe_charge_id: chargeId,
                stripe_subscription_id: subId,
                stripe_customer_id: customerId,
                user_id: known.user_id,
                email: invoice.customer_email || known.email,
                plan_type: known.plan_type,
                billing_period: known.billing_period,
                amount: (invoice.amount_paid ?? 0) / 100,
                currency: (invoice.currency ?? 'brl').toUpperCase(),
                status: 'approved',
                invoice_kind: 'renewal',
                paid_at: invoice.status_transitions?.paid_at
                    ? new Date(invoice.status_transitions.paid_at * 1000).toISOString()
                    : new Date().toISOString(),
                period_start: periodStart,
                period_end: periodEnd,
            })
            .select('id')
            .single();
        if (createErr) {
            logSupabaseError(ctx, 'registrar payment da renovacao', createErr);
            throw new Error(`RENEW_PAYMENT_WRITE_FAILED: ${createErr.message}`);
        }
        renewalPaymentId = created.id;
    }

    // =========================================================================
    // RENOVAÇÃO — sempre pela RPC canônica.
    //
    // A RPC `renew_subscription_license` já contém as garantias que a missão
    // exige (GREATEST contra evento fora de ordem, mesma chave em vez de
    // licença duplicada, emissão idempotente por payment_id quando ainda não
    // existe licença). Reescrever isso em TypeScript duplicaria a regra e criaria
    // dois lugares onde ela pode divergir — então aqui só orquestramos.
    // =========================================================================
    if (renewalPaymentId && periodEnd) {
        const { data, error } = await supabase.rpc('renew_subscription_license', {
            p_subscription_pagbank_id: subId,
            p_payment_id: renewalPaymentId,
            p_period_start: periodStart,
            p_period_end: periodEnd,
            p_stripe_invoice_id: invoice.id,
        });

        if (error) {
            logError(ctx, 'RPC de renovacao retornou erro explicito', { error: error.message, sub: subId });
            throw new Error(`RENEW_FAILED: ${error.message}`);
        }

        logSuccess(ctx, 'renovacao processada', {
            action: (data as { action?: string })?.action,
            key: ((data as { license_key?: string })?.license_key ?? '').slice(0, 12) + '…',
            expires_at: (data as { expires_at?: string })?.expires_at,
            invoice: invoice.id,
        });
    } else {
        logWarn(ctx, 'invoice.paid sem payment_id ou sem period.end — renovacao nao aplicada', {
            invoice: invoice.id, sub: subId, payment: renewalPaymentId, periodEnd,
        });
    }

    // Espelho da assinatura DEPOIS da renovação: assim o status final vem da
    // Stripe (fonte autoritativa), e não de um UPDATE fixo da própria RPC.
    // É daqui que nasce o `next_billing_at` da próxima cobrança.
    try {
        const sub = await stripe.subscriptions.retrieve(subId);
        const snapshot = readSubscriptionSnapshot(sub);
        await syncSubscriptionRow({ supabase, snapshot, fallback: { paymentId: renewalPaymentId } });
        logSuccess(ctx, 'assinatura espelhada apos renovacao', {
            sub: subId,
            next_billing_at: snapshot.cancelAtPeriodEnd ? null : snapshot.currentPeriodEnd,
            cancel_at_period_end: snapshot.cancelAtPeriodEnd,
        });
    } catch (err: any) {
        logWarn(ctx, 'nao foi possivel espelhar a assinatura na renovacao', {
            sub: subId, error: String(err?.message ?? err).slice(0, 120),
        });
    }

    // =========================================================================
    // E-MAIL DE RENOVAÇÃO (FASE 7)
    //
    // Só chega aqui com `invoice.paid`, ou seja, cobrança REALMENTE aprovada.
    // A renovação NUNCA é tratada como compra inicial: template, assunto e chave
    // de idempotência (`renewal:<invoice>`) são próprios.
    //
    // `void` + função que nunca lança: se o e-mail falhar, a renovação já está
    // aplicada e o cliente continua com acesso. O aviso fica na fila.
    // =========================================================================
    if (renewalPaymentId && known.user_id) {
        let renewalEnabled = true;
        let nextBillingAt: string | null = null;
        try {
            const subNow = await stripe.subscriptions.retrieve(subId);
            const snapNow = readSubscriptionSnapshot(subNow);
            renewalEnabled = !snapNow.cancelAtPeriodEnd;
            nextBillingAt = snapNow.cancelAtPeriodEnd ? null : snapNow.currentPeriodEnd;
        } catch { /* usa o padrão: renovação ativa */ }

        void notifySubscriptionRenewed({
            paymentId: renewalPaymentId,
            userId: known.user_id,
            customerName: null,
            renewalEnabled,
            nextBillingAt,
            supabase,
            ctx,
        });
    }
}

/**
 * PRIMEIRA COBRANÇA de uma assinatura (assinatura criada fora do nosso checkout,
 * ou com o evento chegando antes do `checkout.session.completed`).
 *
 * O que ela FAZ, e o que ela NÃO faz:
 *   - cria a linha de pagamento com `invoice_kind='purchase'` e os fatos da
 *     cobrança (valor, período, invoice/charge da Stripe);
 *   - emite a licença pela RPC canônica, que é idempotente por `payment_id`;
 *   - espelha a assinatura (o `next_billing_at` nasce aqui quando o
 *     `checkout.session.completed` não chegou);
 *   - envia o e-mail de COMPRA (não de renovação) com a fatura anexada.
 *
 * O que ela NÃO faz, deliberadamente:
 *   - não Deduz plano/preço: usa o que a Stripe diz, e a RPC valida;
 *   - não marca nada como pago por suposição — só entra por `invoice.paid`.
 */
async function handleFirstSubscriptionCharge(
    supabase: SupabaseClient,
    invoiceRaw: Stripe.Invoice,
    subId: string,
    ctx: OperationContext
) {
    const invoice = invoiceRaw as any;

    const periodStart: string | null = invoice.lines?.data?.[0]?.period?.start
        ? new Date(invoice.lines.data[0].period.start * 1000).toISOString()
        : null;
    const periodEnd: string | null = invoice.lines?.data?.[0]?.period?.end
        ? new Date(invoice.lines.data[0].period.end * 1000).toISOString()
        : null;

    const paymentIntentId = extractInvoicePaymentIntentId(invoice);
    const customerId = toStripeIdString(invoice.customer);
    const email = invoice.customer_email ?? null;
    const amount = (invoice.amount_paid ?? 0) / 100;

    // 1. pagamento (idempotente por PaymentIntent)
    let paymentId: string | null = null;
    if (paymentIntentId) {
        const { data: existing } = await supabase
            .from('payments').select('id').eq('stripe_id', paymentIntentId).maybeSingle();
        paymentId = existing?.id ?? null;
    }
    if (!paymentId) {
        const { data: created, error: createErr } = await supabase.from('payments').insert({
            reference_id: `renew_${invoice.number ?? invoice.id}`,
            provider: 'stripe',
            stripe_id: paymentIntentId,
            stripe_invoice_id: invoice.id ?? null,
            stripe_subscription_id: subId,
            stripe_customer_id: customerId,
            user_id: null,
            email,
            plan_type: null,
            billing_period: null,
            amount,
            currency: (invoice.currency ?? 'brl').toUpperCase(),
            status: 'approved',
            invoice_kind: 'purchase',
            paid_at: new Date().toISOString(),
            period_start: periodStart,
            period_end: periodEnd,
        }).select('id').single();

        if (createErr || !created) {
            logError(ctx, 'nao foi possivel registrar a primeira cobranca', {
                invoice: invoice.id, error: createErr?.message,
            });
            return;   // sem pagamento, sem licenca e sem e-mail
        }
        paymentId = created.id;
    }

    // 2. espelho da assinatura (nasce o next_billing_at)
    let userId: string | null = null;
    try {
        const sub = await stripe.subscriptions.retrieve(subId);
        const snapshot = readSubscriptionSnapshot(sub);
        const meta = (sub.metadata ?? {}) as Record<string, string | undefined>;
        const sync = await syncSubscriptionRow({
            supabase,
            snapshot,
            fallback: {
                userId: meta.user_id ?? null,
                email: meta.customer_email ?? meta.email ?? email,
                planType: meta.license_type ?? null,
                billingPeriod: meta.billing_period ?? snapshot.interval,
                paymentId,
            },
        });
        userId = meta.user_id ?? null;

        if (!userId) {
            const { data: subRow } = await supabase.from('subscriptions')
                .select('user_id').eq('pagbank_subscription_id', subId).maybeSingle();
            userId = subRow?.user_id ?? null;
        }

        logSuccess(ctx, 'primeira cobranca espelhada', {
            sub: subId, status: sync.status, created: sync.created,
            next_billing_at: snapshot.currentPeriodEnd,
        });
    } catch (err: any) {
        logWarn(ctx, 'nao foi possivel espelhar a assinatura na primeira cobranca', {
            sub: subId, error: String(err?.message ?? err).slice(0, 140),
        });
    }

    // 3. licenca (idempotente por payment_id) — pode nao ter user_id ainda
    if (paymentId && periodEnd) {
        const { data: issued, error: rpcErr } = await supabase.rpc('renew_subscription_license', {
            p_subscription_pagbank_id: subId,
            p_payment_id: paymentId,
            p_period_start: periodStart,
            p_period_end: periodEnd,
            p_stripe_invoice_id: invoice.id,
        });

        if (rpcErr) {
            logError(ctx, 'RPC de emissao falhou na primeira cobranca', {
                error: rpcErr.message, sub: subId,
            });
            return;   // sem licenca, sem e-mail de "licenca disponivel"
        }

        logSuccess(ctx, 'licenca emitida na primeira cobranca', {
            action: (issued as { action?: string } | null)?.action,
            invoice: invoice.id,
        });
    }

    // 4. e-mail de COMPRA (chave `purchase:`) — nunca de renovacao
    if (paymentId && userId) {
        void notifyPurchaseConfirmed({
            paymentId,
            userId,
            customerName: null,
            supabase,
            ctx,
        });
    } else {
        logWarn(ctx, 'sem usuario vinculado — e-mail de compra nao enfileirado', {
            payment: paymentId, sub: subId,
        });
    }
}

// ============================================================================
// Cobranca recorrente recusada: NAO revoga o periodo ja pago
// ============================================================================

async function handleInvoicePaymentFailed(supabase: SupabaseClient, invoiceRaw: Stripe.Invoice, ctx: OperationContext) {
    const invoice = invoiceRaw as any;
    const subId = extractInvoiceSubscriptionId(invoice);

    if (subId) {
        const { error } = await supabase.from('subscriptions')
            .update({
                status: toSubscriptionStatus({ stripeStatus: 'past_due' }),
                updated_at: new Date().toISOString(),
            })
            .eq('pagbank_subscription_id', subId);
        if (error) logSupabaseError(ctx, 'marcar assinatura PAST_DUE', error);
    }

    const paymentIntentId = extractInvoicePaymentIntentId(invoice);
    if (paymentIntentId) {
        const { error } = await supabase.from('payments')
            .update({ status: 'failed', updated_at: new Date().toISOString() })
            .eq('stripe_id', paymentIntentId);
        if (error) logSupabaseError(ctx, 'marcar pagamento da renovacao como falho', error);
    }

    logWarn(ctx, 'cobranca recorrente falhou (acesso mantido ate fim do periodo pago)', {
        invoice: invoice.id, sub: subId, attempts: invoice.attempt_count,
    });

    // =========================================================================
    // E-MAIL DE FALHA (FASE 10)
    //
    // Aqui NUNCA se manda e-mail de sucesso — é o caminho do fracasso. O texto
    // diz que o acesso continua até o fim do período pago e NUNCA promete
    // revogação, e não pede dados de cartão (o link vai para o painel).
    // =========================================================================
    if (subId) {
        try {
            const { data: subRow } = await supabase
                .from('subscriptions')
                .select('user_id, email, plan_type, canceled_at, ended_at')
                .eq('pagbank_subscription_id', subId)
                .maybeSingle();

            if (subRow?.user_id) {
                // Fim do acesso = o que a Stripe chamar de fim do período, ou o
                // que o espelho local já conhece. Sem inventar data.
                const accessUntil = subRow.ended_at ?? subRow.canceled_at ?? null;

                void notifyPaymentFailed({
                    subscriptionId: subId,
                    userId: subRow.user_id,
                    customerEmail: subRow.email,
                    customerName: null,
                    planType: subRow.plan_type,
                    amount: Number(invoice.amount_due ?? 0) / 100,
                    currency: (invoice.currency ?? 'brl').toUpperCase(),
                    attemptedAt: new Date().toISOString(),
                    accessUntil,
                    supabase,
                    ctx,
                });
            }
        } catch (err: any) {
            logWarn(ctx, 'falha ao preparar e-mail de pagamento recusado', {
                sub: subId, error: String(err?.message ?? err).slice(0, 160),
            });
        }
    }
}

// ============================================================================
// Sincronizacao de estado da assinatura
// ============================================================================

async function handleSubscriptionUpsert(supabase: SupabaseClient, sub: Stripe.Subscription, ctx: OperationContext) {
    const snapshot = readSubscriptionSnapshot(sub);

    // Metadados da NOSSA origem: preservam o vínculo com user_id/plano mesmo
    // quando o `subscriptions.created` chega antes do `checkout.session.completed`.
    const meta = (sub.metadata ?? {}) as Record<string, string | undefined>;

    const result = await syncSubscriptionRow({
        supabase,
        snapshot,
        fallback: {
            referenceId: meta.reference_id ?? null,
            userId: meta.user_id ?? null,
            email: meta.customer_email ?? meta.email ?? null,
            planType: meta.license_type ?? null,
            billingPeriod: meta.billing_period ?? null,
        },
    });

    logSuccess(ctx, result.created ? 'assinatura criada' : 'assinatura sincronizada', {
        sub: snapshot.stripeSubscriptionId,
        stripe_status: sub.status,
        local_status: result.status,
        next_billing_at: snapshot.cancelAtPeriodEnd ? null : snapshot.currentPeriodEnd,
        cancel_at_period_end: snapshot.cancelAtPeriodEnd,
        changes: result.changes,
    });
}

async function handleSubscriptionDeleted(supabase: SupabaseClient, sub: Stripe.Subscription, ctx: OperationContext) {
    await revokeForSubscription(supabase, sub.id, ctx, sub.canceled_at ?? null);
}

// ============================================================================
// Reembolso: espelho do que a Stripe devolveu
// ============================================================================

async function handleChargeRefunded(supabase: SupabaseClient, charge: Stripe.Charge, ctx: OperationContext) {
    const paymentIntentId = toStripeIdString(charge.payment_intent);
    const fullyRefunded = charge.refunded === true;
    const refundId = toStripeIdString(charge.refunds?.data?.[0]?.id ?? null);

    // Espelho financeiro: OBRIGATÓRIO. Sem isto o banco continuaria dizendo
    // "approved" para um dinheiro que já voltou.
    const { error } = await supabase.from('payments')
        .update({
            status: fullyRefunded ? 'refunded' : 'partially_refunded',
            stripe_charge_id: charge.id,
            stripe_refund_id: refundId,
            refunded_amount: (charge.amount_refunded ?? 0) / 100,
            refunded_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
        .eq('stripe_id', paymentIntentId);
    if (error) logSupabaseError(ctx, 'espelhar charge reembolsado', error);

    // Livro de solicitações: COMPLEMENTAR. Se a migration ainda não foi
    // aplicada, o log registra e o webhook NÃO entra em loop de retry — o
    // espelho financeiro acima já está correto.
    const { error: reqErr } = await supabase.from('refund_requests')
        .update({
            status: fullyRefunded ? 'succeeded' : 'processing',
            stripe_refund_id: refundId,
            resolved_at: fullyRefunded ? new Date().toISOString() : null,
            updated_at: new Date().toISOString(),
        })
        .eq('stripe_charge_id', charge.id)
        .in('status', ['requested', 'processing']);
    if (reqErr) {
        logWarn(ctx, 'refund_requests indisponivel (migration aplicada?) — espelho financeiro ja gravado', {
            charge: charge.id, error: reqErr.message,
        });
    }

    // Reembolso integral encerra a contratação: a licença correspondente perde o
    // acesso. O recorte é pela ASSINATURA desta cobrança — nunca "todas as
    // licenças do cliente" (o código antigo revogava por e-mail, o que
    // derrubava planos que continuavam pagos).
    const { data: affected } = await supabase.from('payments')
        .select('id, user_id, email, stripe_subscription_id, plan_type')
        .eq('stripe_id', paymentIntentId)
        .maybeSingle();

    if (fullyRefunded) {

        if (affected?.stripe_subscription_id) {
            const { error: subErr } = await supabase.from('subscriptions')
                .update({ status: 'REFUNDED', cancel_at_period_end: false, updated_at: new Date().toISOString() })
                .eq('pagbank_subscription_id', affected.stripe_subscription_id);
            if (subErr) logSupabaseError(ctx, 'marcar assinatura reembolsada', subErr);
        }

        if (affected?.user_id) {
            const { error: licErr } = await supabase.from('licenses')
                .update({
                    revoked: true,
                    notes: `Reembolso confirmado (charge ${charge.id}) em ${new Date().toISOString()}`,
                })
                .eq('user_id', affected.user_id)
                .eq('plan_type', (affected.plan_type ?? '').toLowerCase());
            if (licErr) logSupabaseError(ctx, 'revogar licenca por reembolso integral', licErr);
        }
    }

    // =========================================================================
    // E-MAIL DE REEMBOLSO CONFIRMADO (FASE 9)
    //
    // Este é o ÚNICO lugar onde se confirma reembolso: a Stripe devolveu o
    // evento, então o estado é real. A solicitação e o "em processamento"
    // saem da rota de reembolso (que conhece a decisão da política).
    // =========================================================================
    if (fullyRefunded && affected?.user_id) {
        void notifyRefund({
            stage: 'confirmed',
            paymentId: affected.id ?? null,
            userId: affected.user_id,
            customerEmail: affected.email,
            customerName: null,
            planType: affected.plan_type,
            amount: (charge.amount_refunded ?? 0) / 100,
            currency: (charge.currency ?? 'brl').toUpperCase(),
            refundId,
            requestedAt: null,
            resolvedAt: new Date().toISOString(),
            accessUntil: null,
            supabase,
            ctx,
        });
    }

    logSuccess(ctx, fullyRefunded ? 'carga reembolsada integralmente' : 'estorno parcial', {
        charge: charge.id, payment_intent: paymentIntentId, refund: refundId,
    });
}

async function handleRefundUpdated(supabase: SupabaseClient, refund: Stripe.Refund, ctx: OperationContext) {
    const map: Record<string, string> = {
        pending: 'processing',
        succeeded: 'succeeded',
        failed: 'failed',
        canceled: 'canceled',
        requires_action: 'processing',
    };
    const status: string = map[String(refund.status)] ?? 'processing';
    const chargeId = toStripeIdString(refund.charge);
    const resolvedAt = ['succeeded', 'failed', 'canceled'].includes(status) ? new Date().toISOString() : null;

    const patch: Record<string, unknown> = {
        status,
        stripe_refund_id: refund.id,
        resolved_at: resolvedAt,
        updated_at: new Date().toISOString(),
    };
    if (chargeId) patch.stripe_charge_id = chargeId;

    const { error } = await supabase.from('refund_requests')
        .update(patch)
        .eq('stripe_refund_id', refund.id);
    if (error) {
        logWarn(ctx, 'refund_requests indisponivel ou sem correspondencia', {
            refund: refund.id, error: error.message,
        });
    }

    // A cobrança também reflete o estado real do reembolso.
    if (chargeId) {
        const { error: payErr } = await supabase.from('payments')
            .update({
                status: status === 'succeeded' ? 'refunded' : undefined,
                stripe_refund_id: refund.id,
                refunded_at: status === 'succeeded' ? new Date().toISOString() : undefined,
                updated_at: new Date().toISOString(),
            })
            .eq('stripe_charge_id', chargeId);
        if (payErr) logSupabaseError(ctx, 'espelhar refund.updated em payments', payErr);
    }

    logSuccess(ctx, 'refund atualizado', { refund: refund.id, status: refund.status, charge: chargeId });
}

// ============================================================================
// Revogacao (somente quando a assinatura REALMENTE termina)
// ============================================================================

async function revokeForSubscription(
    supabase: SupabaseClient,
    subId: string,
    ctx: OperationContext,
    canceledAtEpoch?: number | null
) {
    logWarn(ctx, 'assinatura encerrada — revogando licencas do plano', { sub: subId });

    const endedAt = canceledAtEpoch
        ? new Date(canceledAtEpoch * 1000).toISOString()
        : new Date().toISOString();

    const { data: sub, error: subErr } = await supabase.from('subscriptions')
        .update({
            status: 'CANCELED',
            cancel_at_period_end: false,
            ended_at: endedAt,
            canceled_at: canceledAtEpoch ? endedAt : undefined,
            updated_at: new Date().toISOString(),
        })
        .eq('pagbank_subscription_id', subId)
        .select()
        .maybeSingle();
    if (subErr) logSupabaseError(ctx, 'marcar assinatura cancelada', subErr);

    if (!sub) return;

    const patch = { revoked: true, notes: 'Cancelada via Stripe (assinatura encerrada)' };

    // Prioriza user_id. O fallback por e-mail só roda quando NÃO há user_id
    // na assinatura (linhas legadas) — nunca "por conveniência".
    if (sub.user_id) {
        const { data, error } = await supabase.from('licenses').update(patch)
            .eq('plan_type', sub.plan_type).eq('user_id', sub.user_id).select('license_key');
        if (error) {
            logSupabaseError(ctx, 'revogar por user_id', error);
            throw new Error(`REVOKE_FAILED: ${error.message}`);
        }
        logSuccess(ctx, 'revogacoes por user_id', { count: data?.length ?? 0 });
        return;
    }

    const { data, error } = await supabase.from('licenses').update(patch)
        .eq('plan_type', sub.plan_type).eq('customer_email', sub.email).select('license_key');
    if (error) {
        logSupabaseError(ctx, 'revogar por e-mail', error);
        throw new Error(`REVOKE_FAILED: ${error.message}`);
    }
    logSuccess(ctx, 'revogacoes por e-mail (assinatura legada sem user_id)', { count: data?.length ?? 0 });
}