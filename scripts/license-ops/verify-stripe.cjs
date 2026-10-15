/**
 * Verificacao READ-ONLY: correspondencia Stripe x registro Supabase do pagamento alvo.
 * Nao emite nada. IDs tecnicos (cs_/sub_) sao identificadores, nao segredos; PII mascarada.
 */
const fs = require('fs');
const path = require('path');

function loadEnv(file) {
    const p = path.join(__dirname, '..', '..', file);
    if (!fs.existsSync(p)) return {};
    const out = {};
    for (const line of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
        const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
        if (m) out[m[1]] = m[2].replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');
    }
    return out;
}
const env = { ...loadEnv('.env'), ...loadEnv('.env.local') };
const Stripe = require('stripe');
const stripe = Stripe(env.STRIPE_SECRET_KEY);

const PAYMENT_ID = '53429770-12bd-41e7-bf67-12ea5ddbca32';
const USER_ID = '38a58d09-20aa-40ac-b92a-4519b0cdc086';
const maskEmail = (e) => !e ? String(e) : e[0] + '***@' + (e.split('@')[1] || '');

(async () => {
    const { createClient } = require('@supabase/supabase-js');
    const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

    const { data: pay } = await sb.from('payments').select('*').eq('id', PAYMENT_ID).single();
    console.log('== Supabase payment ==');
    console.log(JSON.stringify({
        reference_id: pay.reference_id, status: pay.status, plan_type: pay.plan_type,
        amount: String(pay.amount), email: maskEmail(pay.email), user_id: pay.user_id === USER_ID ? USER_ID.slice(0, 8) + '…(MATCH)' : 'DIVERGENTE!',
        provider: pay.provider, stripe_id: pay.stripe_id, stripe_customer_id: pay.stripe_customer_id,
        stripe_subscription_id: pay.stripe_subscription_id, billing_period: pay.billing_period,
    }));

    // Tenta localizar na Stripe por qualquer identificador tecnico conhecido
    const candidates = [pay.stripe_id, pay.stripe_subscription_id, pay.stripe_customer_id].filter(Boolean);
    let session = null, subscription = null, invoiceObj = null;

    // 1) sessao de checkout
    try {
        if (pay.stripe_id && String(pay.stripe_id).startsWith('cs_')) session = await stripe.checkout.sessions.retrieve(pay.stripe_id);
        if (!session) {
            const list = await stripe.checkout.sessions.list({ limit: 10 });
            session = list.data.find(s => s.metadata?.reference_id === pay.reference_id) || null;
        }
    } catch (e) { console.log('checkout lookup falhou:', e.type || '', String(e.message).slice(0, 100)); }

    // 2) assinatura
    try {
        if (pay.stripe_subscription_id) subscription = await stripe.subscriptions.retrieve(pay.stripe_subscription_id);
        if (!subscription && session?.subscription) subscription = await stripe.subscriptions.retrieve(session.subscription);
        if (!subscription) {
            const list = await stripe.subscriptions.list({ limit: 20 });
            subscription = list.data.find(s => s.metadata?.reference_id === pay.reference_id) || null;
        }
    } catch (e) { console.log('subscription lookup falhou:', e.type || '', String(e.message).slice(0, 100)); }

    console.log('\n== Stripe session ==');
    if (session) {
        console.log(JSON.stringify({
            id: session.id, payment_status: session.payment_status, mode: session.mode,
            customer_email: maskEmail(session.customer_email),
            meta_reference_id: session.metadata?.reference_id, meta_user_id: session.metadata?.user_id,
            meta_license_type: session.metadata?.license_type, meta_billing_period: session.metadata?.billing_period,
            subscription: session.subscription, amount_total: session.amount_total,
        }));
    } else console.log('SESSAO NAO ENCONTRADA pelos meios atuais');

    console.log('\n== Stripe subscription ==');
    if (subscription) {
        console.log(JSON.stringify({
            id: subscription.id, status: subscription.status, plan: subscription.items?.data?.[0]?.price?.recurring?.interval,
            current_period_start: subscription.current_period_start ? new Date(subscription.current_period_start * 1000).toISOString() : (subscription.items?.data?.[0]?.current_period_start ? new Date(subscription.items.data[0].current_period_start * 1000).toISOString() : null),
            current_period_end: subscription.current_period_end ? new Date(subscription.current_period_end * 1000).toISOString() : (subscription.items?.data?.[0]?.current_period_end ? new Date(subscription.items.data[0].current_period_end * 1000).toISOString() : null),
            customer_email_ref: maskEmail(subscription.email || ''), amount: subscription.items?.data?.[0]?.price?.unit_amount,
        }));
    } else console.log('ASSINATURA NAO ENCONTRADA');

    console.log('\n== Correspondencia ==');
    const ok = {};
    ok.user_id = session ? String(session.metadata?.user_id || '') === USER_ID : (pay.user_id === USER_ID);
    ok.reference_id = session ? session.metadata?.reference_id === pay.reference_id : null;
    ok.email = session ? String(session.customer_email || '').toLowerCase() === String(pay.email || '').toLowerCase() : null;
    ok.plan = subscription ? (String(subscription.items?.data?.[0]?.price?.lookup_key || '') + '/' + String(subscription.metadata?.license_type || '')).includes('pro') || String(subscription.metadata?.license_type || '') === 'pro' : null;
    ok.pago = session ? session.payment_status === 'paid' : (subscription ? ['active', 'trialing'].includes(subscription.status) : null);
    console.log(JSON.stringify(ok));
})();
