/**
 * Busca READ-ONLY ampla na Stripe pela sessao/assinatura do pagamento alvo.
 * Compara por reference_id (metadata), e-mail e user_id. Nada mascara alem do necessario.
 */
const fs = require('fs');
const path = require('path');

function loadEnv(file) {
    const p = path.join(__dirname, '..', '..', file);
    if (!fs.existsSync(p)) return {};
    const out = {};
    for (const line of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
        const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
        if (m) out[m[1]] = m[2].replace(/^"(.*)"$/, '$1');
    }
    return out;
}
const env = { ...loadEnv('.env'), ...loadEnv('.env.local') };
const Stripe = require('stripe');
const stripe = Stripe(env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

const PAYMENT_ID = '53429770-12bd-41e7-bf67-12ea5ddbca32';
const USER_ID = '38a58d09-20aa-40ac-b92a-4519b0cdc086';
const maskEmail = (e) => !e ? 'null' : e[0] + '***@' + (String(e).split('@')[1] || '');

(async () => {
    const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
    const { data: pay } = await sb.from('payments').select('*').eq('id', PAYMENT_ID).single();
    const email = String(pay.email || '').toLowerCase();
    const ref = pay.reference_id;
    console.log('alvo: ref=' + ref + ' email=' + maskEmail(email) + ' user_id=' + (pay.user_id === USER_ID ? 'MATCH' : pay.user_id));

    // 1) Assinaturas (todos os status, paginado ate 300)
    let subs = [], page, hasMore = true, starting_after;
    do {
        const opts = { status: 'all', limit: 100 };
        if (starting_after) opts.starting_after = starting_after;
        page = await stripe.subscriptions.list(opts);
        subs = subs.concat(page.data);
        hasMore = page.has_more;
        if (page.data.length) starting_after = page.data[page.data.length - 1].id;
    } while (hasMore && subs.length < 300);
    console.log('subscriptions vistoriadas:', subs.length);
    const subHits = subs.filter(s => s.metadata?.reference_id === ref || String(s.metadata?.user_id || '') === USER_ID)
        .map(s => ({
            id: s.id, status: s.status, ref: s.metadata?.reference_id, uid: s.metadata?.user_id ? s.metadata.user_id.slice(0, 8) + '…' : null,
            plan_meta: s.metadata?.license_type, interval: s.items?.data?.[0]?.price?.recurring?.interval,
            amount: s.items?.data?.[0]?.price?.unit_amount, email: maskEmail(s.email),
            period_start: s.current_period_start ? new Date(s.current_period_start * 1000).toISOString() : null,
            period_end: s.current_period_end ? new Date(s.current_period_end * 1000).toISOString() : null,
            created: new Date(s.created * 1000).toISOString(),
        }));
    console.log('SUB HITS (por metadata):', JSON.stringify(subHits, null, 1));

    // 2) Sessions de checkout por metadata (paginado ate 300)
    let sess = [], sPage, sMore = true, sAfter;
    do {
        const opts = { limit: 100 };
        if (sAfter) opts.starting_after = sAfter;
        sPage = await stripe.checkout.sessions.list(opts);
        sess = sess.concat(sPage.data);
        sMore = sPage.has_more;
        if (sPage.data.length) sAfter = sPage.data[sPage.data.length - 1].id;
    } while (sMore && sess.length < 300);
    console.log('checkout sessions vistoriadas:', sess.length);
    const sessHits = sess.filter(x => x.metadata?.reference_id === ref || String(x.customer_email || '').toLowerCase() === email)
        .map(x => ({
            id: x.id, payment_status: x.payment_status, mode: x.mode, ref: x.metadata?.reference_id,
            uid: x.metadata?.user_id ? x.metadata.user_id.slice(0, 8) + '…' : null,
            license_type: x.metadata?.license_type, billing: x.metadata?.billing_period,
            subscription: x.subscription, email: maskEmail(x.customer_email), amount_total: x.amount_total,
            created: new Date(x.created * 1000).toISOString(),
        }));
    console.log('SESSION HITS:', JSON.stringify(sessHits, null, 1));

    // 3) Customer + invoices por email
    const custPage = await stripe.customers.list({ limit: 100 });
    const custHits = custPage.data.filter(c => String(c.email || '').toLowerCase() === email);
    console.log('CUSTOMER HITS:', JSON.stringify(custHits.map(c => ({ id: c.id, created: new Date(c.created * 1000).toISOString() }))));
    for (const c of custHits.slice(0, 3)) {
        const inv = await stripe.invoices.list({ customer: c.id, limit: 10 });
        console.log('INVOICES p/ customer ' + c.id.slice(0, 12) + ':', JSON.stringify(inv.data.map(i => ({
            id: i.id, status: i.status, subscription: i.subscription, amount_paid: i.amount_paid,
            period_end: i.lines?.data?.[0]?.period?.end ? new Date(i.lines.data[0].period.end * 1000).toISOString() : (i.billing_reason || null),
            created: new Date(i.created * 1000).toISOString(),
        }))));
    }
})().catch(e => console.log('ERRO', e.type || '', String(e.message).slice(0, 160)));
