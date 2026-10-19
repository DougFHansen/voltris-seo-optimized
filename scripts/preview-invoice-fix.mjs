/**
 * Gera a fatura do caso REAL que originou os defeitos, com dados FICTICIOS,
 * para conferência visual das correções.
 *
 *   node --import ./scripts/register-alias.mjs scripts/preview-invoice-fix.mjs
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { buildInvoiceData } from '../lib/invoice-data.ts';
import { generateInvoicePdf } from '../lib/invoice-pdf.ts';

const OUT = 'C:/Temp/voltris/pdf-preview';

// Mesmo formato do pagamento real observado, com identificadores inventados.
const row = {
    id: '1e0f9938-ada6-4233-b69b-bac9f03eea5a',
    reference_id: 'st_EXEMPLO0001',
    user_id: 'f47776b9-c00c-4272-b139-fae4206560e8',
    customer_name: 'Cliente de Demonstracao',
    customer_name_snapshot: null,
    email: 'cliente.exemplo@exemplo.com',
    amount: 4.99,
    plan_type: 'standard',
    status: 'approved',
    provider: 'stripe',
    stripe_id: 'cs_live_EXEMPLO0000000000000000000000000000000000',
    stripe_customer_id: null,
    stripe_charge_id: null,
    stripe_invoice_id: null,
    stripe_subscription_id: null,
    stripe_refund_id: null,
    refunded_amount: null,
    refunded_at: null,
    invoice_kind: 'purchase',
    created_at: '2026-10-19T02:46:37.388673+00:00',
    updated_at: '2026-10-19T02:47:56.500718+00:00',
    paid_at: null,
    period_start: null,
    period_end: null,
    billing_period: 'month',
    currency: 'BRL',
};

const license = {
    license_key: 'VOLTRIS-STA-EXEMPLO-20261119-DEMO00000000',
    plan_type: 'standard',
    max_devices: 1,
    created_at: '2026-10-19T02:47:56.500718+00:00',
    activated_at: null,
    expires_at: '2026-11-19T00:00:00+00:00',
    revoked: false,
    user_id: 'f47776b9-c00c-4272-b139-fae4206560e8',
    devicesInUse: 0,
    client_id: '797344',
};

mkdirSync(OUT, { recursive: true });

const casos = [
    ['A-avulsa-sem-periodo', { row, license }, 'deve dizer "compra avulsa", "—" no periodo e trazer ID do cliente'],
    ['B-com-assinatura', {
        row: { ...row, stripe_subscription_id: 'sub_EXEMPLO0000000001', period_start: '2026-10-19T02:47:55.000Z', period_end: '2026-11-19T02:47:55.000Z' },
        license,
    }, 'deve dizer "assinatura recorrente" e trazer o periodo completo'],
];

for (const [nome, opts, nota] of casos) {
    const data = buildInvoiceData(opts);
    const pdf = await generateInvoicePdf(data);
    writeFileSync(`${OUT}/${nome}.pdf`, pdf.bytes);
    console.log(`${nome}.pdf  ${pdf.bytes.length} bytes`);
    console.log(`  billingLabel : ${data.billingLabel}`);
    console.log(`  clientId     : ${data.clientId}`);
    console.log(`  periodo      : ${data.periodStart ?? '-'} .. ${data.periodEnd ?? '-'}`);
    console.log(`  pagamento    : ${data.stripePaymentId}`);
    console.log(`  ${nota}`);
    console.log('');
}
console.log('OK ->', OUT);
