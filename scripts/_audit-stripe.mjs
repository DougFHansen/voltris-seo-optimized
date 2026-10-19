/**
 * Script de AUDITORIA STRIPE (somente leitura) — produtos, preços, assinaturas,
 * webhooks e estado real. NÃO cria nem altera nada.
 */
import { readFileSync } from 'node:fs';
import Stripe from 'stripe';

function loadEnv() {
  for (const f of ['.env.local', '.env']) {
    try {
      const raw = readFileSync(f, 'utf8');
      for (const line of raw.split(/\r?\n/)) {
        const m = /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/.exec(line);
        if (!m) continue;
        let v = m[2].trim();
        if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
        if (!process.env[m[1]]) process.env[m[1]] = v;
      }
    } catch {}
  }
}
loadEnv();

const key = process.env.STRIPE_SECRET_KEY;
if (!key) { console.error('STRIPE_SECRET_KEY ausente'); process.exit(1); }

const stripe = new Stripe(key, { apiVersion: '2025-02-24.acacia' });

const out = {};
const safe = (k) => k ? `${k.slice(0, 8)}…${k.slice(-4)} (${k.startsWith('sk_live') ? 'LIVE' : k.startsWith('sk_test') ? 'TEST' : '?'})` : null;

out.key = safe(key);
out.webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  ? `presente (${process.env.STRIPE_WEBHOOK_SECRET.slice(0, 8)}…, len=${process.env.STRIPE_WEBHOOK_SECRET.length})`
  : 'AUSENTE';
out.publishable = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? `presente (${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.slice(0, 10)}…)`
  : 'AUSENTE';

out.account = await stripe.accounts.retrieve().then(a => ({ id: a.id, business_profile: a.business_profile?.name, country: a.country, charges_enabled: a.charges_enabled, payouts_enabled: a.payouts_enabled }));

out.products = (await stripe.products.list({ limit: 100, active: undefined })).data.map(p => ({
  id: p.id, name: p.name, active: p.active, created: new Date(p.created * 1000).toISOString(),
  metadata: p.metadata,
}));

out.prices = (await stripe.prices.list({ limit: 100 })).data.map(p => ({
  id: p.id, product: typeof p.product === 'string' ? p.product : p.product.id,
  currency: p.currency, unit_amount: p.unit_amount, recurring: p.recurring ?? null,
  active: p.active, nickname: p.nickname, lookup_key: p.lookup_key,
  created: new Date(p.created * 1000).toISOString(),
}));

const subs = await stripe.subscriptions.list({ limit: 100, status: 'all', expand: ['data.default_payment_method', 'data.customer'] });
out.subscriptions = subs.data.map(s => ({
  id: s.id, customer: typeof s.customer === 'string' ? s.customer : s.customer?.id,
  customer_email: (typeof s.customer === 'object' && s.customer?.email) || null,
  status: s.status, cancel_at_period_end: s.cancel_at_period_end, canceled_at: s.canceled_at,
  current_period_start: new Date(s.current_period_start * 1000).toISOString(),
  current_period_end: new Date(s.current_period_end * 1000).toISOString(),
  created: new Date(s.created * 1000).toISOString(),
  items: s.items.data.map(i => ({ price: i.price.id, recurring: i.price.recurring, quantity: i.quantity })),
  metadata: s.metadata,
  default_payment_method: s.default_payment_method ? (typeof s.default_payment_method === 'string' ? s.default_payment_method : s.default_payment_method.id) : null,
}));

const invs = await stripe.invoices.list({ limit: 20 });
out.recentInvoices = invs.data.map(i => ({
  id: i.id, number: i.number, customer: typeof i.customer === 'string' ? i.customer : i.customer?.id,
  status: i.status, paid: i.paid, amount_paid: i.amount_paid, currency: i.currency,
  subscription: i.subscription ?? null, payment_intent: i.payment_intent ?? null,
  created: new Date(i.created * 1000).toISOString(),
  invoice_pdf: i.invoice_pdf ?? null,
}));

const sessions = await stripe.checkout.sessions.list({ limit: 30 });
out.recentCheckoutSessions = sessions.data.map(s => ({
  id: s.id, mode: s.mode, status: s.status, payment_status: s.payment_status,
  customer: typeof s.customer === 'string' ? s.customer : s.customer?.id,
  customer_email: s.customer_email, subscription: s.subscription ?? null,
  payment_intent: s.payment_intent ?? null,
  amount_total: s.amount_total, currency: s.currency,
  created: new Date(s.created * 1000).toISOString(),
  metadata: s.metadata,
}));

out.webhookEndpoints = (await stripe.webhookEndpoints.list({ limit: 20 })).data.map(w => ({
  id: w.id, url: w.url, enabled_events: w.enabled_events, api_version: w.api_version,
  status: w.status, description: w.description,
}));

console.log(JSON.stringify(out, null, 2));