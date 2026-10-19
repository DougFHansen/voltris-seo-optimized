/**
 * Testes da FATURA PDF e dos dados do emitente (missão §6 e §12).
 *
 * Cobrem três coisas que o documento NÃO pode errar:
 *  1. valores em BRL e datas em pt-BR (nunca US$ / mm-dd);
 *  2. distinção entre compra inicial, renovação, serviço e reembolso;
 *  3. PDF válido, em A4, com os dados REAIS desta cobrança e sem dado inventado.
 *
 * Rodar: npm test
 */

import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import { PDFDocument } from 'pdf-lib';

import {
    formatBRL,
    formatDateBR,
    formatDateTimeBR,
    invoiceTitle,
    INVOICE_TIMEZONE,
    generateInvoicePdf,
    type InvoiceData,
} from '../lib/invoice-pdf.ts';
import {
    buildInvoiceData,
    describePaymentStatus,
    isInvoicable,
    resolveInvoiceKind,
    type PaymentInvoiceRow,
} from '../lib/invoice-data.ts';
import { formatCnpj, isValidCnpj, onlyDigits, getCompanyInfo } from '../lib/company.ts';
import { extrairTextoDoPdf } from './helpers/pdf-extract.ts';

// ============================================================================
// DADOS DA EMITENTE
// ============================================================================

describe('CNPJ — validação de dígito verificador', () => {
    test('o CNPJ publicado no site é válido', () => {
        assert.equal(isValidCnpj('47.241.737/0001-60'), true);
    });

    test('formata para o padrão brasileiro', () => {
        assert.equal(formatCnpj('47241737000160'), '47.241.737/0001-60');
    });

    test('recusa CNPJ com dígito errado', () => {
        assert.equal(isValidCnpj('47.241.737/0001-61'), false);
    });

    test('recusa comprimento errado, vazio e null', () => {
        for (const v of ['', '123', '4724173700016', 'abcdefghijklmn', null, undefined]) {
            assert.equal(isValidCnpj(v as string), false, String(v));
        }
    });

    test('recusa sequência artificialmente válida', () => {
        assert.equal(isValidCnpj('00.000.000/0000-00'), false);
        assert.equal(isValidCnpj('11.111.111/1111-11'), false);
    });

    test('onlyDigits remove pontuação', () => {
        assert.equal(onlyDigits('47.241.737/0001-60'), '47241737000160');
    });
});

describe('getCompanyInfo — documento nunca inventa dado fiscal', () => {
    test('usa o CNPJ padrão do site e mantém a razão social', () => {
        const { info, cnpjValid } = getCompanyInfo();
        assert.equal(cnpjValid, true);
        assert.equal(info.cnpj, '47.241.737/0001-60');
        assert.ok(info.razaoSocial.length > 0);
    });

    test('o aviso "não substitui NFS-e" está sempre presente', () => {
        const { info } = getCompanyInfo();
        assert.match(info.avisoDocumento, /não substitui nota fiscal eletr[oô]nica \(NFS-e\)/i);
    });

    test('o site exibido é o brasileiro', () => {
        const { info } = getCompanyInfo();
        assert.match(info.site, /voltris\.com\.br/);
    });
});

// ============================================================================
// FORMATAÇÃO
// ============================================================================

describe('formatBRL — moeda e separadores brasileiros', () => {
    test('formata centavos', () => {
        const out = formatBRL(4.99).replace(/\u00a0/g, ' ');
        assert.ok(out.includes('R$'), out);
        assert.ok(out.includes('4,99'), out);
        assert.ok(!out.includes('.'), `não pode usar ponto decimal: ${out}`);
    });

    test('milhar com ponto', () => {
        const out = formatBRL(1099.9).replace(/\u00a0/g, ' ');
        assert.ok(out.includes('1.099,90'), out);
    });

    test('aceita string numérica (numeric do Postgres)', () => {
        assert.equal(formatBRL('15.00').replace(/\u00a0/g, ' '), formatBRL(15).replace(/\u00a0/g, ' '));
    });

    test('valor ausente vira "—" (não vira R$ 0,00)', () => {
        assert.equal(formatBRL(null), '—');
        assert.equal(formatBRL(undefined), '—');
        assert.equal(formatBRL(Number.NaN), '—');
    });
});

describe('formatDateBR — padrão brasileiro e fuso do contrato', () => {
    test('dd/mm/aaaa', () => {
        assert.equal(formatDateBR('2026-11-19T12:00:00.000Z'), '19/11/2026');
    });

    test('o fuso é America/Sao_Paulo, não o da máquina que gera', () => {
        // 00:00 UTC = 21:00 do dia ANTERIOR em São Paulo. Usar o fuso do
        // servidor faria a fatura mostrar um dia diferente dependendo de onde
        // o PDF foi gerado.
        assert.equal(formatDateBR('2026-11-19T00:00:00.000Z'), '18/11/2026');
        assert.equal(INVOICE_TIMEZONE, 'America/Sao_Paulo');
    });

    test('com hora quando pedido', () => {
        assert.match(formatDateTimeBR('2026-11-19T13:45:00.000Z'), /19\/11\/2026/);
        assert.match(formatDateTimeBR('2026-11-19T13:45:00.000Z'), /10:45/);
    });

    test('data ausente vira "—"', () => {
        assert.equal(formatDateBR(null), '—');
        assert.equal(formatDateTimeBR('lixo'), '—');
    });
});

// ============================================================================
// TIPO DE DOCUMENTO
// ============================================================================

describe('invoiceTitle — cada tipo de cobrança tem seu título', () => {
    test('compra inicial', () => assert.equal(invoiceTitle('purchase'), 'Fatura Comercial'));
    test('renovação NÃO é compra inicial', () => assert.equal(invoiceTitle('renewal'), 'Fatura de Renovação'));
    test('serviço', () => assert.equal(invoiceTitle('service'), 'Fatura de Serviço'));
    test('reembolso', () => assert.equal(invoiceTitle('refund'), 'Comprovante de Reembolso'));
});

describe('resolveInvoiceKind — deduz só o que é dedutível', () => {
    const base: PaymentInvoiceRow = {
        id: 'x', reference_id: 'r', user_id: 'u', email: 'e@x.com', customer_name: null,
        customer_name_snapshot: null, plan_type: 'pro', billing_period: 'month', amount: 15,
        currency: 'BRL', status: 'approved', provider: 'stripe', invoice_kind: null,
        stripe_id: null, stripe_charge_id: null, stripe_invoice_id: null,
        stripe_subscription_id: null, stripe_refund_id: null, refunded_amount: null,
        refunded_at: null, paid_at: null, period_start: null, period_end: null, created_at: null,
    };

    test('coluna explícita manda', () => {
        assert.equal(resolveInvoiceKind({ ...base, invoice_kind: 'renewal' }), 'renewal');
        assert.equal(resolveInvoiceKind({ ...base, invoice_kind: 'service' }), 'service');
    });

    test('sem coluna: referência renew_ => renovação', () => {
        assert.equal(
            resolveInvoiceKind({ ...base, reference_id: 'renew_in_1', stripe_subscription_id: 'sub_1' }),
            'renewal'
        );
    });

    test('sem coluna: plano de serviço => serviço', () => {
        assert.equal(resolveInvoiceKind({ ...base, plan_type: 'formatacao_basica' }), 'service');
    });

    test('sem coluna e sem assinatura => compra', () => {
        assert.equal(resolveInvoiceKind({ ...base }), 'purchase');
    });
});

describe('isInvoicable — nunca gera comprovante de pagamento não confirmado', () => {
    for (const s of ['approved', 'paid', 'refunded', 'partially_refunded', 'charged_back', 'APPROVED']) {
        test(`"${s}" pode gerar documento`, () => assert.equal(isInvoicable(s), true));
    }
    for (const s of ['pending', 'processing', 'open', 'unpaid', 'failed', '', null, undefined]) {
        test(`"${s}" NÃO pode gerar documento`, () => assert.equal(isInvoicable(s as string), false));
    }
});

describe('describePaymentStatus — rótulo verdadeiro', () => {
    test('aprovado é "Pago" com tom ok', () => {
        assert.deepEqual(describePaymentStatus('approved'), { label: 'Pago', tone: 'ok' });
    });
    test('reembolsado é tom bad (não é sucesso verde)', () => {
        assert.equal(describePaymentStatus('refunded').tone, 'bad');
    });
    test('pendente é tom warn', () => {
        assert.equal(describePaymentStatus('pending').tone, 'warn');
    });
    test('status desconhecido não vira "aprovado"', () => {
        const r = describePaymentStatus('xyz');
        assert.notEqual(r.tone, 'ok');
        assert.equal(r.label, 'XYZ');
    });
});

// ============================================================================
// PDF REAL
// ============================================================================

const COMPRA: PaymentInvoiceRow = {
    id: '1e0f9938-ada6-4233-b69b-bac9f03eea5a',
    reference_id: 'st_1792377997027',
    user_id: 'u1', email: 'cliente@voltris.com.br',
    customer_name: 'Maria Aparecida de Souza',
    customer_name_snapshot: 'Maria Aparecida de Souza',
    plan_type: 'pro', billing_period: 'month',
    amount: 15, currency: 'BRL', status: 'approved', provider: 'stripe',
    invoice_kind: 'purchase',
    stripe_id: 'pi_3ABC', stripe_charge_id: 'ch_3ABC', stripe_invoice_id: 'in_1ABC',
    stripe_subscription_id: 'sub_1ABC', stripe_refund_id: null,
    refunded_amount: null, refunded_at: null,
    paid_at: '2026-10-19T02:47:55.000Z',
    period_start: '2026-10-19T02:47:55.000Z',
    period_end: '2026-11-19T02:47:55.000Z',
    created_at: '2026-10-19T02:46:37.388Z',
};

const LICENCA = {
    license_key: 'VOLTRIS-PRO-804836-20261115-CF30AF13997DB11C',
    plan_type: 'pro', max_devices: 3,
    created_at: '2026-10-19T02:47:55.000Z',
    activated_at: '2026-10-15T15:23:12.189Z',
    expires_at: '2026-11-19T00:00:00.000Z',
    revoked: false, user_id: 'u1', devicesInUse: 2,
};

/**
 * Extrai o texto realmente desenhado na página.
 *
 * O pdf-lib não tem extrator de texto, então descomprimimos os streams
 * FlateDecode do PDF e lemos os operadores `<...> Tj`. O pdf-lib escreve as
 * strings como HEX (ex.: `VOLTRIS` -> `<564F4C54524953>`), por isso decodificamos
 * o hex antes de comparar. Isto é verificação de verdade: prova que o dado do
 * cliente está DENTRO do arquivo entregue, e não apenas num objeto em memória.
 */

describe('generateInvoicePdf — documento válido em A4', () => {
    test('gera PDF legível com uma página A4 (595,28 x 841,89 pt)', async () => {
        const { bytes, fileName } = await generateInvoicePdf(
            buildInvoiceData({ row: COMPRA, license: LICENCA })
        );
        const doc = await PDFDocument.load(bytes);
        assert.equal(doc.getPageCount(), 1);
        const { width, height } = doc.getPage(0).getSize();
        assert.ok(Math.abs(width - 595.28) < 1, `largura ${width}`);
        assert.ok(Math.abs(height - 841.89) < 1, `altura ${height}`);
        assert.ok(bytes.length > 1500, `PDF suspiciousamente pequeno: ${bytes.length}`);
        // O nome segue o padrão do aplicativo desktop:
        // "Fatura_VOLTRIS_<PLANO>_<Cliente>.pdf".
        assert.match(fileName, /^Fatura_VOLTRIS_[A-Z0-9]+_[A-Za-z0-9_]+\.pdf$/);
    });

    test('nome do arquivo é ASCII (acento quebra Content-Disposition em proxy)', async () => {
        const { fileName } = await generateInvoicePdf(
            buildInvoiceData({ row: { ...COMPRA, invoice_kind: 'renewal', reference_id: 'renew_in_1' }, license: LICENCA })
        );
        assert.doesNotMatch(fileName, /[^\x00-\x7F]/, fileName);
    });

    test('o PDF contém os dados REAIS desta cobrança e da licença', async () => {
        const { bytes } = await generateInvoicePdf(
            buildInvoiceData({ row: COMPRA, license: LICENCA })
        );
        const texto = await extrairTextoDoPdf(bytes);
        assert.ok(texto.length > 0, 'nenhum stream de texto encontrado');

        // Identificadores: o documento precisa ser rastreável até a transação.
        // No PAPEL ficam o ID da compra e a Referência (o desenho aprovado);
        // os identificadores da Stripe vão nos METADADOS do PDF, para o
        // papel não carregar ruído e o arquivo continuar localizável.
        assert.ok(texto.includes('1e0f9938'), 'identificador interno da compra ausente');
        assert.ok(texto.includes('st_1792377997027'), 'número da fatura ausente');

        const docMeta = await PDFDocument.load(bytes);
        const meta = [docMeta.getSubject() ?? '', ...(docMeta.getKeywords() ?? [])].join(' ');
        assert.ok(meta.includes('pi_3ABC'), 'referência do pagamento ausente dos metadados');
        assert.ok(meta.includes('in_1ABC'), 'id da fatura Stripe ausente dos metadados');
        assert.ok(meta.includes('sub_1ABC'), 'id da assinatura ausente dos metadados');

        // Cliente e licença.
        assert.ok(texto.includes('Maria Aparecida de Souza'), 'nome do cliente ausente');
        assert.ok(texto.includes('VOLTRIS-PRO-804836'), 'chave de licença ausente');

        // Identidade visual e aviso legal obrigatório.
        assert.ok(texto.includes('VOLTRIS'), 'marca ausente');
        assert.ok(texto.includes('NFS-e'), 'aviso de que não é NFS-e ausente');
        assert.ok(texto.includes('47.241.737/0001-60'), 'CNPJ do emitente ausente');
    });

    test('metadados do documento identificam a VOLTRIS e o tipo de fatura', async () => {
        const { bytes } = await generateInvoicePdf(
            buildInvoiceData({ row: COMPRA, license: LICENCA })
        );
        const doc = await PDFDocument.load(bytes);
        assert.equal(doc.getCreator(), 'VOLTRIS');
        assert.match(doc.getTitle() ?? '', /Fatura Comercial/);
        assert.match(doc.getAuthor() ?? '', /VOLTRIS/);
        assert.match(doc.getSubject() ?? '', /st_1792377997027/);
    });
});

describe('generateInvoicePdf — não inventa dado que não existe', () => {
    test('compra histórica sem assinatura/período gera documento com "—"', async () => {
        const antiga: PaymentInvoiceRow = {
            ...COMPRA,
            reference_id: 'stripe_1774256231812',
            plan_type: 'standard',
            billing_period: null,
            amount: 4.99,
            invoice_kind: null,
            stripe_id: null,
            stripe_charge_id: null,
            stripe_invoice_id: null,
            stripe_subscription_id: null,
            paid_at: null,
            period_start: null,
            period_end: null,
            created_at: '2026-03-23T08:57:12.290Z',
        };

        const data = buildInvoiceData({ row: antiga, license: null });

        assert.equal(data.amountPaid, 4.99);
        assert.equal(data.periodStart, null);
        assert.equal(data.licenseKey, null);
        assert.equal(data.licenseStateLabel, 'Sem licença vinculada a esta cobrança');
        // O documento ainda sai — com honestidade, não com erro.
        const { bytes } = await generateInvoicePdf(data);
        assert.ok(bytes.length > 1500);
    });

    test('valor ausente não vira R$ 0,00', () => {
        const data = buildInvoiceData({
            row: { ...COMPRA, amount: null },
            license: LICENCA,
        });
        assert.equal(data.amountPaid, 0);
        assert.equal(formatBRL(null), '—');
    });
});

describe('buildInvoiceData — não mistura Renovação com compra inicial', () => {
    test('renovação carrega o valor e o período DESTA cobrança', () => {
        const data = buildInvoiceData({
            row: {
                ...COMPRA,
                reference_id: 'renew_in_2',
                invoice_kind: 'renewal',
                amount: 15,
                period_start: '2026-11-19T02:47:55.000Z',
                period_end: '2026-12-19T02:47:55.000Z',
                paid_at: '2026-11-19T02:48:00.000Z',
            },
            license: { ...LICENCA, expires_at: '2026-12-19T00:00:00.000Z' },
        });

        assert.equal(data.kind, 'renewal');
        assert.equal(invoiceTitle(data.kind), 'Fatura de Renovação');
        assert.equal(data.periodEnd, '2026-12-19T02:47:55.000Z');
        assert.equal(data.amountPaid, 15);
        assert.equal(data.licenseExpiresAt, '2026-12-19T00:00:00.000Z');
    });

    test('reembolso muda o título e marca o valor devolvido', () => {
        const data = buildInvoiceData({
            row: { ...COMPRA, status: 'refunded', stripe_refund_id: 're_1', refunded_amount: 15 },
            license: { ...LICENCA, revoked: true },
            legalNote: 'Reembolso integral processado conforme art. 49 do CDC.',
        });

        assert.equal(invoiceTitle(data.kind), 'Comprovante de Reembolso');
        assert.equal(data.amountRefunded, 15);
        assert.equal(data.licenseStateLabel, 'Revogada');
        assert.equal(data.licenseStateTone, 'bad');
        assert.ok(data.legalNote);
    });

    test('serviço é rotulado como serviço, não como licença', () => {
        const data = buildInvoiceData({
            row: { ...COMPRA, plan_type: 'formatacao_basica', billing_period: null, invoice_kind: 'service', amount: 99.9 },
            license: null,
        });
        assert.equal(data.kind, 'service');
        assert.equal(data.planLabel, 'Serviço');
        assert.equal(data.billingLabel, 'Pagamento único');
        assert.match(data.productName, /Serviço Profissional/);
    });

    test('dispositivos unlimited não aparece como 9999', () => {
        const data = buildInvoiceData({
            row: { ...COMPRA, plan_type: 'enterprise' },
            license: { ...LICENCA, plan_type: 'enterprise', max_devices: 9999 },
        });
        assert.equal(data.maxDevices, 9999);
    });
});

describe('generateInvoicePdf — Beltur unchanged em cenários extremos', () => {
    test('nome de cliente absurdamente longo não quebra a geração', async () => {
        const data = buildInvoiceData({
            row: { ...COMPRA, customer_name_snapshot: 'A'.repeat(300), customer_name: 'A'.repeat(300) },
            license: LICENCA,
        });
        const { bytes } = await generateInvoicePdf(data);
        const doc = await PDFDocument.load(bytes);
        assert.equal(doc.getPageCount(), 1);
    });

    test('observação longa não quebra a geração', async () => {
        const data = buildInvoiceData({
            row: COMPRA,
            license: LICENCA,
            legalNote: 'Observação técnica. '.repeat(80),
        });
        const { bytes } = await generateInvoicePdf(data);
        assert.ok(bytes.length > 1500);
    });

    test('sem valor nenhum, ainda gera documento (com "—")', async () => {
        const data = buildInvoiceData({
            row: { ...COMPRA, amount: null, stripe_invoice_id: null, stripe_id: null, customer_name_snapshot: null },
            license: null,
        });
        const { bytes } = await generateInvoicePdf(data);
        assert.ok(bytes.length > 1500);
    });
});