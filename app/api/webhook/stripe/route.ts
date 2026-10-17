import { NextRequest, NextResponse } from 'next/server';
    import type Stripe from 'stripe';
import type { SupabaseClient } from '@supabase/supabase-js';
import { stripe } from '@/lib/stripe';
import { createAdminClient } from '@/utils/supabase/admin';
import {
    startOperation,
    logWarn,
    logError,
    logSuccess,
    logSupabaseError,
    maskEmail,
    type OperationContext,
} from '@/lib/voltris-log';

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
    
/**
 * Webhook Stripe — missao secoes 4/7/12.
 *
 * Garantias implementadas:
 *  - assinatura criptografica validada (senao 400);
 *  - IDEMPOTENCIA PERSISTENTE por event.id via public.stripe_event_log
 *    (duplicado -> 200 sem reprocessar; 'error' -> permite o retry da Stripe);
 *  - licenca so emite com payment_status='paid' (prova de liquidacao);
 *  - renovacao usa o period end AUTORITATIVO da invoice (nunca now()+intervalo);
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
            const invoice = event.data.object as any;
            const subId = invoice.subscription as string | null;
            // Sem revogacao: o periodo ja pago continua valido ate expires_at.
            if (subId) {
                const { error } = await supabase.from('subscriptions')
                    .update({ status: 'PAST_DUE', updated_at: new Date().toISOString() })
                    .eq('pagbank_subscription_id', subId);
                if (error) logSupabaseError(ctx, 'marcar assinatura PAST_DUE', error);
            }
            logWarn(ctx, 'cobranca recorrente falhou (acesso mantido ate fim do periodo pago)', {
                invoice: invoice.id, sub: subId, attempts: invoice.attempt_count,
            });
            break;
        }

        case 'customer.subscription.created':
        case 'customer.subscription.updated': {
            const sub = event.data.object as any;
            await syncSubscription(supabase, sub, ctx);
            break;
        }

        case 'customer.subscription.deleted': {
            const sub = event.data.object as any;
            await revokeForSubscription(supabase, sub.id, ctx);
            break;
        }

        default:
            logSuccess(ctx, 'evento ignorado (nao critico)', { type: event.type });
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
    const subscriptionId = session.subscription as string | null;
    const type = session.metadata?.type || 'license';

    ctx.userId = userId || undefined;
    logSuccess(ctx, 'checkout liquidado', { ref: referenceId, tipo: type, payment_status: session.payment_status, user: maskEmail(email) });

    // Gate de liquidacao: so emite/aprova com pagamento confirmado.
    if (session.payment_status !== 'paid') {
        logWarn(ctx, 'sessao concluida sem payment_status=paid; nada emitido', { session: session.id, status: session.payment_status });
        return;
    }

    const { data: payRow, error: payLookupError } = await supabase
        .from('payments')
        .select('id, status, plan_type, user_id, email')
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
                status: 'pending',
                user_id: userId || null,
                email,
                plan_type: licenseType,
                billing_period: type === 'license' ? billingPeriod : null,
                amount: (session.amount_total ?? 0) / 100,
            })
            .select('id')
            .single();

        if (createErr || !created) {
            logSupabaseError(ctx, 'registrar pagamento da sessao', createErr);
            throw new Error('PAYMENT_REGISTRATION_FAILED');
        }
        paymentId = created.id;
    }

    if (subscriptionId) {
        const { error: subErr } = await supabase.from('subscriptions').upsert({
            reference_id: referenceId,
            pagbank_subscription_id: subscriptionId,
            user_id: userId || null,
            email,
            plan_type: licenseType,
            billing_period: billingPeriod,
            status: 'ACTIVE',
        }, { onConflict: 'pagbank_subscription_id' });
        if (subErr) logSupabaseError(ctx, 'registrar assinatura', subErr);
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

    const { data, error } = await supabase.rpc('generate_complete_license_v3', {
        p_payment_id: paymentId,
        p_user_id: userId || null,
        p_email: email,
        p_plan_type: licenseType,
        p_billing_period: billingPeriod,
        p_stripe_session_id: session.payment_intent ? String(session.payment_intent) : session.id,
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

    logSuccess(ctx, (data as { already_issued?: boolean }).already_issued
        ? 'licenca ja existia (idempotente por payment_id)'
        : 'licenca emitida', { key: issuedKey.slice(0, 12) + '…', plan: licenseType, period: billingPeriod });
}

// ============================================================================
// Renovacao recorrente (periodo autoritativo da Stripe)
// ============================================================================

async function handleInvoicePaid(supabase: SupabaseClient, invoiceRaw: Stripe.Invoice, ctx: OperationContext) {
    // stripe@20 / API 2025-xx: subscription/payment_intent moram em `parent` ou
    // no topo dependendo da versao do evento; any controlado aqui e documentado.
    const invoice = invoiceRaw as any;
    const subId = invoice.subscription as string | null;
    if (!subId) {
        // invoice sem assinatura: checkout unico ja tratado pelo session.completed
        logSuccess(ctx, 'invoice.paid sem subscription — ignorado', { invoice: invoice.id });
        return;
    }

    const { data: known, error: knownErr } = await supabase.from('subscriptions')
        .select('reference_id, plan_type, billing_period, user_id, email')
        .eq('pagbank_subscription_id', subId)
        .maybeSingle();
    if (knownErr) logSupabaseError(ctx, 'buscar assinatura', knownErr);

    if (!known) {
        // Alerta (sec.12): pagamento confirmado sem assinatura conhecida no banco.
        logError(ctx, 'ALERTA: invoice.paid para assinatura desconhecida', { sub: subId, invoice: invoice.id });
        return;
    }

    const line = invoice.lines?.data?.[0];
    const periodEnd: string | null = line?.period?.end
        ? new Date(line.period.end * 1000).toISOString()
        : null;
    const periodStart: string | null = line?.period?.start
        ? new Date(line.period.start * 1000).toISOString()
        : null;

    // Payment row da renovacao (dedupe por payment_intent) para trilha + vinculo.
    const paymentIntentId = invoice.payment_intent ? String(invoice.payment_intent) : null;
    let renewalPaymentId: string | null = null;

    if (paymentIntentId) {
        const { data: existing } = await supabase.from('payments')
            .select('id').eq('stripe_id', paymentIntentId).maybeSingle();
        renewalPaymentId = existing?.id ?? null;
    }

    if (!renewalPaymentId) {
        const { data: created, error: createErr } = await supabase.from('payments')
            .insert({
                reference_id: `renew_${invoice.number ?? subId}_${Date.now()}`,
                provider: 'stripe',
                stripe_id: paymentIntentId,
                stripe_subscription_id: subId,
                stripe_customer_id: typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id ?? null,
                user_id: known.user_id,
                email: invoice.customer_email || known.email,
                plan_type: known.plan_type,
                billing_period: known.billing_period,
                amount: (invoice.amount_paid ?? 0) / 100,
                status: 'approved',
            })
            .select('id')
            .single();
        if (createErr) logSupabaseError(ctx, 'registrar payment da renovacao', createErr);
        else renewalPaymentId = created.id;
    }

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
}

// ============================================================================
// Sincronizacao de estado da assinatura (sem revogacao antecipada)
// ============================================================================

async function syncSubscription(supabase: SupabaseClient, sub: any, ctx: OperationContext) {
    const map: Record<string, string> = {
        active: sub.cancel_at_period_end ? 'CANCEL_SCHEDULED' : 'ACTIVE',
        trialing: 'TRIALING',
        past_due: 'PAST_DUE',
        unpaid: 'UNPAID',
        canceled: 'CANCELED',
        incomplete: 'PENDING',
        incomplete_expired: 'CANCELED',
        paused: 'PAUSED',
    };
    const status = map[sub.status] ?? 'UNKNOWN';

    const { data: existing } = await supabase.from('subscriptions')
        .select('reference_id, plan_type, billing_period, user_id, email')
        .eq('pagbank_subscription_id', sub.id)
        .maybeSingle();

    if (!existing) {
        // assinatura criada fora do nosso checkout (ex.: portal): registra minima
        await supabase.from('subscriptions').upsert({
            reference_id: sub.metadata?.reference_id ?? sub.id,
            pagbank_subscription_id: sub.id,
            user_id: sub.metadata?.user_id ?? null,
            email: sub.customer_email ?? null,
            plan_type: sub.metadata?.license_type ?? null,
            billing_period: sub.metadata?.billing_period ?? null,
            status,
        }, { onConflict: 'pagbank_subscription_id' });
    } else {
        const { error } = await supabase.from('subscriptions')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('pagbank_subscription_id', sub.id);
        if (error) logSupabaseError(ctx, 'sincronizar status da assinatura', error);
    }

    logSuccess(ctx, 'assinatura sincronizada', { sub: sub.id, stripe_status: sub.status, local_status: status });
}

// ============================================================================
// Revogacao (somente quando a assinatura REALMENTE termina)
// ============================================================================

async function revokeForSubscription(supabase: SupabaseClient, subId: string, ctx: OperationContext) {
    logWarn(ctx, 'assinatura encerrada — revogando licencas do plano', { sub: subId });

    const { data: sub } = await supabase.from('subscriptions')
        .update({ status: 'CANCELED', updated_at: new Date().toISOString() })
        .eq('pagbank_subscription_id', subId)
        .select()
        .maybeSingle();

    if (!sub) return;

    const patch = { revoked: true, notes: 'Cancelada via Stripe (assinatura encerrada)' };

    const byUser = sub.user_id
        ? await supabase.from('licenses').update(patch)
              .eq('plan_type', sub.plan_type).eq('user_id', sub.user_id).select('license_key')
        : { data: null, error: null };

    if (byUser.error) {
        logSupabaseError(ctx, 'revogar por user_id', byUser.error);
        throw new Error(`REVOKE_FAILED: ${byUser.error.message}`);
    }

    if (!byUser.data || byUser.data.length === 0) {
        const byEmail = await supabase.from('licenses').update(patch)
            .eq('plan_type', sub.plan_type).eq('customer_email', sub.email).select('license_key');
        if (byEmail.error) {
            logSupabaseError(ctx, 'revogar por e-mail', byEmail.error);
            throw new Error(`REVOKE_FAILED: ${byEmail.error.message}`);
        }
        logSuccess(ctx, 'revogacoes por e-mail', { count: byEmail.data?.length ?? 0 });
    } else {
        logSuccess(ctx, 'revogacoes por user_id', { count: byUser.data.length });
    }
}
