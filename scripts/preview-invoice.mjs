/**
 * Gera PDFs de amostra para conferência visual (A4). NAO toca em Stripe nem
 * no banco: usa apenas fixtures LOCAIS e FICTICIAS.
 *
 * Uso: node --import ./scripts/register-alias.mjs scripts/preview-invoice.mjs
 *
 * ---------------------------------------------------------------------------
 * DADOS FICTICIOS — LEIA ANTES DE EDITAR
 * ---------------------------------------------------------------------------
 * Todos os identificadores deste arquivo sao INVENTADOS. NAO copie para ca
 * valores vindos de consulta ao banco ou a API da Stripe: `user_id`, chave de
 * licenca e IDs `pi_`/`in_`/`sub_`/`re_` de producao pertencem a um
 * cliente real, e publicar isso em um repositorio expoe a pessoa mesmo sem
 * haver credencial envolvido.
 *
 * A sanitizacao nao afeta o que este script verifica: o layout do PDF depende
 * dos TIPOS de dado e dos valores de demonstracao, nao do ID.
 * ---------------------------------------------------------------------------
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

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

const { generateInvoicePdf } = await import('../lib/invoice-pdf.ts');
const { buildInvoiceData } = await import('../lib/invoice-data.ts');

const basePayment = {
  id: '11111111-2222-3333-4444-555555555555',
  reference_id: 'st_EXEMPLO0001',
  user_id: '99999999-8888-7777-6666-555555555555',
  email: 'cliente.exemplo@exemplo.com',
  customer_name: 'Cliente de Demonstracao',
  customer_name_snapshot: 'Cliente de Demonstracao',
  plan_type: 'pro',
  billing_period: 'month',
  amount: 15,
  currency: 'BRL',
  status: 'approved',
  provider: 'stripe',
  invoice_kind: 'purchase',
  stripe_id: 'pi_EXEMPLO000000000000000001',
  stripe_charge_id: 'ch_EXEMPLO00000000000000001',
  stripe_invoice_id: 'in_EXEMPLO00000000000000001',
  stripe_subscription_id: 'sub_EXEMPLO00000000000001',
  stripe_refund_id: null,
  refunded_amount: null,
  refunded_at: null,
  paid_at: '2026-10-19T02:47:55.000Z',
  period_start: '2026-10-19T02:47:55.000Z',
  period_end: '2026-11-19T02:47:55.000Z',
  created_at: '2026-10-19T02:46:37.388Z',
};

const license = {
  license_key: 'VOLTRIS-PRO-EXEMPLO-20261115-DEMO00000000',
  plan_type: 'pro',
  max_devices: 3,
  created_at: '2026-10-19T02:47:55.000Z',
  activated_at: '2026-10-15T15:23:12.189Z',
  expires_at: '2026-11-19T00:00:00.000Z',
  revoked: false,
  user_id: basePayment.user_id,
  devicesInUse: 2,
};

const outDir = 'C:/Temp/voltris/pdf-preview';
mkdirSync(outDir, { recursive: true });

// 1) Compra inicial
const purchase = await generateInvoicePdf(
  buildInvoiceData({ row: basePayment, license, customerDocument: '***.456.789-**' })
);
writeFileSync(`${outDir}/1-compra-inicial.pdf`, purchase.bytes);
console.log('1-compra-inicial.pdf', purchase.bytes.length, purchase.fileName);

// 2) Renovacao mensal
const renewal = await generateInvoicePdf(
  buildInvoiceData({
    row: { ...basePayment, id: 'aaaaaaaa-1111-2222-3333-444444444444', reference_id: 'renew_in_EXEMPLO', invoice_kind: 'renewal', amount: 15, paid_at: '2026-11-19T02:48:00.000Z', period_start: '2026-11-19T02:47:55.000Z', period_end: '2026-12-19T02:47:55.000Z', created_at: '2026-11-19T02:48:01.000Z' },
    license: { ...license, expires_at: '2026-12-19T00:00:00.000Z' },
  })
);
writeFileSync(`${outDir}/2-renovacao-mensal.pdf`, renewal.bytes);
console.log('2-renovacao-mensal.pdf', renewal.bytes.length, renewal.fileName);

// 3) Reembolso
const refunded = await generateInvoicePdf(
  buildInvoiceData({
    row: { ...basePayment, status: 'refunded', invoice_kind: 'purchase', stripe_refund_id: 're_EXEMPLO0000000000000001', refunded_amount: 15, refunded_at: '2026-10-21T10:00:00.000Z' },
    license: { ...license, revoked: true },
    legalNote: 'Reembolso integral PROCESSADO em 21/10/2026 conforme art. 49 do Codigo de Defesa do Consumidor (7 dias corridos). O encerramento da contratacao e o cancelamento da recorrencia foram executados no processador de pagamentos.',
  })
);
writeFileSync(`${outDir}/3-reembolso.pdf`, refunded.bytes);
console.log('3-reembolso.pdf', refunded.bytes.length, refunded.fileName);

// 4) Compra historica incompleta (sem dados de periodo/assinatura)
const legacy = await generateInvoicePdf(
  buildInvoiceData({
    row: {
      ...basePayment,
      id: 'bbbbbbbb-1111-2222-3333-444444444444',
      reference_id: 'stripe_EXEMPLO_0002',
      plan_type: 'standard',
      billing_period: null,
      amount: 4.99,
      status: 'approved',
      invoice_kind: null,
      stripe_id: null,
      stripe_charge_id: null,
      stripe_invoice_id: null,
      stripe_subscription_id: null,
      paid_at: null,
      period_start: null,
      period_end: null,
      created_at: '2026-03-23T08:57:12.290Z',
    },
    license: null,
  })
);
writeFileSync(`${outDir}/4-compra-historica.pdf`, legacy.bytes);
console.log('4-compra-historica.pdf', legacy.bytes.length, legacy.fileName);

console.log('OK ->', outDir);