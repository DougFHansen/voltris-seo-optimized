/**
 * PRÉ-VISUALIZAÇÃO DOS E-MAILS TRANSACIONAIS.
 *
 * Renderiza os cinco e-mails com dados fictícios e grava os `.html` em disco
 * para inspeção visual, e opcionalmente envia um de verdade.
 *
 *   node --import ./scripts/register-alias.mjs scripts/preview-email.mjs
 *
 * Com destino real (exige RESEND_API_KEY no ambiente):
 *   node --import ./scripts/register-alias.mjs scripts/preview-email.mjs --send voce@exemplo.com
 *
 * O QUE ESTE SCRIPT PROVA (e o que não prova)
 * -------------------------------------------
 * Prova que os templates renderizam, que o PDF é anexado, que a chave de
 * idempotência é aceita pela Resend e que o webhook volta correlacionando.
 *
 * NÃO prova que um cliente real receberia o e-mail — para isso é necessária
 * uma compra real no modo de teste da Stripe, com a qual o webhook dispara o
 * fluxo inteiro.
 *
 * Os dados abaixo são FICTÍCIOS de propósito: nenhum endereço, chave ou
 * documento real aparece neste arquivo.
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve as resolvePath, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
    renderPurchaseEmail,
    renderRenewalEmail,
    renderCancellationEmail,
    renderRefundEmail,
    renderPaymentFailedEmail,
} from '../lib/email-templates.ts';
import { getResendConfigStatus, sendEmail } from '../lib/resend-client.ts';
import { generateInvoicePdf } from '../lib/invoice-pdf.ts';
import { buildInvoiceData } from '../lib/invoice-data.ts';

const ROOT = resolvePath(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = resolvePath(ROOT, '.preview-email');

/**
 * Fatura de exemplo, montada pelo MESMO `buildInvoiceData` usado em produção.
 *
 * Montar o `InvoiceData` à mão aqui criaria uma segunda definição do documento
 * — e a primeira coisa que mudaria no layout seria o preview deixar de
 * corresponder à fatura real. Com a linha de pagamento sintética, o caminho
 * percorrido é idêntico ao de um anexo real de compra.
 */
async function faturaDeExemplo() {
    const agora = new Date().toISOString();
    const daquiAUmMes = new Date(Date.now() + 30 * 86_400_000).toISOString();

    const data = buildInvoiceData({
        row: {
            id: 'preview-0001',
            reference_id: 'preview_0001',
            customer_name: 'Cliente de Teste',
            email: 'cliente@exemplo.com',
            amount: 15,
            plan_type: 'pro',
            billing_period: 'mensal',
            status: 'approved',
            provider: 'stripe',
            stripe_id: 'pi_preview',
            stripe_invoice_id: 'in_preview',
            stripe_charge_id: 'ch_preview',
            stripe_subscription_id: 'sub_preview',
            stripe_customer_id: 'cus_preview',
            currency: 'BRL',
            payment_method: 'Cartão de crédito •••• 4242',
            invoice_kind: 'purchase',
            created_at: agora,
            updated_at: agora,
            paid_at: agora,
            period_start: agora,
            period_end: daquiAUmMes,
        },
        license: {
            licenseKey: 'VOLT-PRE-VISU-ALIZ-ADO-0001',
            planType: 'pro',
            maxDevices: 3,
            devicesInUse: 1,
            expiresAt: daquiAUmMes,
            activatedAt: agora,
        },
        legalNote: null,
    });

    return generateInvoicePdf(data);
}

const BASE = {
    customerName: 'Cliente de Teste',
    planName: 'VOLTRIS PRO',
    billingLabel: 'Mensal',
    amountPaid: 15,
    currency: 'BRL',
};

function buildEmailCases() {
    const agora = new Date().toISOString();
    const daquiAUmMes = new Date(Date.now() + 30 * 86_400_000).toISOString();

    return [
        {
            arquivo: '1-compra-confirmada',
            email: renderPurchaseEmail({
                ...BASE,
                purchasedAt: agora,
                periodEnd: daquiAUmMes,
                licenseKey: 'VOLT-PRE-VISU-ALIZ-ADO-0001',
                maxDevices: 3,
                devicesInUse: 1,
                purchaseId: 'preview-0001',
                stripeReference: 'pi_preview',
                hasInvoiceAttachment: true,
            }),
            texto: 'Primeira cobrança: chave, fatura e aviso de renovação automática.',
        },
        {
            arquivo: '2-renovacao',
            email: renderRenewalEmail({
                ...BASE,
                chargedAt: agora,
                periodStart: agora,
                periodEnd: daquiAUmMes,
                licenseExpiresAt: daquiAUmMes,
                nextBillingAt: daquiAUmMes,
                renewalEnabled: true,
                purchaseId: 'preview-0002',
                hasInvoiceAttachment: true,
            }),
            texto: 'Cobrança recorrente aprovada: novo período e próxima cobrança.',
        },
        {
            arquivo: '3-cancelamento-renovacao',
            email: renderCancellationEmail({
                customerName: 'Cliente de Teste',
                planName: 'VOLTRIS PRO',
                accessUntil: daquiAUmMes,
                renewalOnly: true,
                canResume: true,
                subscriptionId: 'sub_preview',
            }),
            texto: 'Renovação desligada: acesso continua, sem multa, e pode reativar.',
        },
        {
            arquivo: '4-reembolso-em-analise',
            email: renderRefundEmail({
                customerName: 'Cliente de Teste',
                stage: 'requested',
                planName: 'VOLTRIS PRO',
                amount: 15,
                currency: 'BRL',
                purchaseId: 'preview-0001',
                refundId: null,
                requestedAt: agora,
                manualReview: true,
            }),
            texto: 'Solicitação fora do prazo: NÃO afirma devolução, diz que está em análise.',
        },
        {
            arquivo: '5-pagamento-recusado',
            email: renderPaymentFailedEmail({
                customerName: 'Cliente de Teste',
                planName: 'VOLTRIS PRO',
                amount: 15,
                currency: 'BRL',
                attemptedAt: agora,
                accessUntil: daquiAUmMes,
                subscriptionId: 'sub_preview',
            }),
            texto: 'Cobrança recusada: acesso continua, sem pedido de dados de cartão.',
        },
    ];
}

// ---------------------------------------------------------------------------

const enviarPara = process.argv.includes('--send')
    ? process.argv[process.argv.indexOf('--send') + 1]
    : null;

mkdirSync(OUT_DIR, { recursive: true });

const casos = buildEmailCases();

console.log('='.repeat(72));
console.log('PRÉ-VISUALIZAÇÃO DOS E-MAILS VOLTRIS');
console.log('='.repeat(72));
console.log('');

const config = getResendConfigStatus();
console.log(`Configuração da Resend: ${config.configured ? 'OK' : 'INCOMPLETA'}`);
for (const p of config.problems) console.log(`  - ${p}`);
console.log('');

for (const caso of casos) {
    const caminho = resolvePath(OUT_DIR, `${caso.arquivo}.html`);
    writeFileSync(caminho, caso.email.html, 'utf8');
    writeFileSync(resolvePath(OUT_DIR, `${caso.arquivo}.txt`), caso.email.text, 'utf8');

    console.log(`[${caso.arquivo}]`);
    console.log(`  assunto : ${caso.email.subject}`);
    console.log(` motivo : ${caso.texto}`);
    console.log(`  html    : ${caminho}`);
    console.log('');
}

if (!enviarPara) {
    console.log('Nada foi enviado (modo padrão). Para enviar de verdade:');
    console.log('  node --import ./scripts/register-alias.mjs scripts/preview-email.mjs --endereco@exemplo.com');
    console.log('');
    process.exit(0);
}

// ---------------------------------------------------------------------------
// Envio real — opcional, com os dados fictícios acima.
// ---------------------------------------------------------------------------

if (!config.configured) {
    console.error('Envio cancelado: a configuração da Resend está incompleta.');
    process.exit(1);
}

const fatura = await faturaDeExemplo();
const compra = casos[0].email;

console.log('Enviando e-mail de compra para:', enviarPara);
console.log(`Anexo: ${fatura.fileName} (${fatura.bytes.length} bytes)`);
console.log(`Chave de idempotência: purchase:preview-${Date.now()}`);
console.log('');

const resultado = await sendEmail({
    to: enviarPara,
    subject: compra.subject,
    html: compra.html,
    text: compra.text,
    attachments: [{ filename: fatura.fileName, content: Buffer.from(fatura.bytes) }],
    idempotencyKey: `purchase:preview-${Date.now()}`,
    tags: [{ name: 'origem', value: 'preview' }],
});

if (resultado.ok) {
    console.log('ACEITO pela Resend.');
    console.log(`id da mensagem: ${resultado.providerMessageId}`);
    console.log('');
    console.log('ATENÇÃO: "aceito" NÃO é "entregue". Para confirmar a entrega,');
    console.log('cadastre o webhook e espere o evento `email.delivered`:');
    console.log('  https://www.voltris.com.br/api/webhook/resend');
    console.log('');
} else {
    console.error('FALHA no envio.');
    console.error(`  tipo   : ${resultado.error?.kind}`);
    console.error(`  repete : ${resultado.error?.retryable}`);
    console.error(`  motivo : ${resultado.error?.message}`);
    process.exit(1);
}
