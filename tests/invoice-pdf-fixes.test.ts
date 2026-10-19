/**
 * Testes das CORREÇÕES DA FATURA (achados da análise do PDF real).
 *
 * Cada teste deste arquivo existe porque um defeito REAL foi observado em uma
 * fatura gerada com dados de produção. Não são testes de "cobertura": cada um
 * fixa o comportamento que estava errado.
 *
 * Os quatro defeitos:
 *   1. O documento dizia "Mensal — assinatura recorrente" e, na linha seguinte,
 *      "— (compra avulsa)". As duas afirmações no mesmo papel.
 *   2. Um ID da Stripe de 72 caracteres quebrava a linha em quatro partes e a
 *      última colidia com a linha seguinte, deixando o bloco ilegível.
 *   3. `licenses.client_id` existia no banco e nunca era impresso; a linha
 *      "ID do cliente" confundia identificador interno com CPF/CNPJ.
 *   4. "Período pago: — a 18/11/2026" — um travessão parecendo data, quando não
 *      há `period_start` registrado.
 *
 * Rodar: npm test
 */

import test, { describe } from 'node:test';
import assert from 'node:assert/strict';

import {
    buildInvoiceData,
    type PaymentInvoiceRow,
    type LicenseFacts,
} from '../lib/invoice-data.ts';
import { generateInvoicePdf, shortenRef } from '../lib/invoice-pdf.ts';

// ---------------------------------------------------------------------------
// Reprodução do caso real: Douglas Felipe Becker, R$ 4,99, compra avulsa
// ---------------------------------------------------------------------------

const PAGAMENTO_AVULSO: PaymentInvoiceRow = {
    id: '1e0f9938-ada6-4233-b69b-bac9f03eea5a',
    reference_id: 'st_1792377997027',
    user_id: 'f47776b9-c00c-4272-b139-fae4206560e8',
    customer_name: 'Douglas Felipe Becker',
    customer_name_snapshot: null,
    email: 'douglasfelipebecker@gmail.com',
    amount: 4.99,
    plan_type: 'standard',
    status: 'approved',
    provider: 'stripe',
    // Valor REAL encontrado no banco: um ID de CLIENTE da Stripe gravado no
    // campo stripe_id. É o que produzia o bloco ilegível na fatura.
    stripe_id: 'cs_live_a1QVeYYjLaGsopJpNvAsn0HMpS6XXhADXPVhErqOCRogS6UUG84lxPugeX',
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
    payment_method: null,
};

const LICENCA: LicenseFacts = {
    license_key: 'VOLTRIS-STA-797344-20261119-803256B5C7860A8A',
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

const COM_ASSINATURA: PaymentInvoiceRow = {
    ...PAGAMENTO_AVULSO,
    stripe_subscription_id: 'sub_1UQpljJpNL78U7iCh6ZAbGl5',
    period_start: '2026-10-19T02:47:55.000Z',
    period_end: '2026-11-19T02:47:55.000Z',
};

// ===========================================================================
// 1. Contradição "recorrente" x "compra avulsa"
// ===========================================================================

describe('modalidade de cobrança não pode contradizer a linha da assinatura', () => {
    test('compra avulsa com período mensal NÃO é chamada de recorrente', () => {
        // Este é o defeito original: billing_period='month' e nenhuma
        // assinatura produziam "Mensal — assinatura recorrente".
        const d = buildInvoiceData({ row: PAGAMENTO_AVULSO, license: LICENCA });
        assert.equal(d.billingLabel, 'Mensal — compra avulsa');
        assert.equal(d.stripeSubscriptionId, null);
    });

    test('com assinatura real, é recorrente', () => {
        const d = buildInvoiceData({ row: COM_ASSINATURA, license: LICENCA });
        assert.equal(d.billingLabel, 'Mensal — assinatura recorrente');
        assert.equal(d.stripeSubscriptionId, 'sub_1UQpljJpNL78U7iCh6ZAbGl5');
    });

    test('anual avulso também não vira recorrente', () => {
        const d = buildInvoiceData({
            row: { ...PAGAMENTO_AVULSO, billing_period: 'year' },
            license: LICENCA,
        });
        assert.equal(d.billingLabel, 'Anual — compra avulsa');
    });

    test('serviço continua "Pagamento único", com ou sem assinatura', () => {
        const d = buildInvoiceData({
            row: { ...PAGAMENTO_AVULSO, invoice_kind: 'service', plan_type: 'otimizacao_basica' },
            license: null,
        });
        assert.equal(d.billingLabel, 'Pagamento único');
    });

    test('as duas linhas do documento passam a concordar', () => {
        // A propriedade que importa: o que diz a modalidade tem de ser
        // compatível com o que diz a assinatura.
        for (const row of [PAGAMENTO_AVULSO, COM_ASSINATURA]) {
            const d = buildInvoiceData({ row, license: LICENCA });
            const afirmaRecorrencia = d.billingLabel.includes('recorrente');
            const temAssinatura = d.stripeSubscriptionId !== null;
            assert.equal(afirmaRecorrencia, temAssinatura);
        }
    });
});

// ===========================================================================
// 2. ID longo quebrando o layout
// ===========================================================================

describe('shortenRef — identificadores longos não quebram a coluna', () => {
    test('o ID de 72 caracteres observed vira uma linha só', () => {
        const curto = shortenRef(PAGAMENTO_AVULSO.stripe_id!);
        assert.ok(curto.length < 25, `ainda longo demais: ${curto}`);
        assert.ok(curto.includes('…'), 'sem marcador de truncamento');
    });

    test('preserva o início e o fim, que é o que localiza a transação', () => {
        const id = 'cs_live_a1QVeYYjLaGsopJpNvAsn0HMpS6XXhADXPVhErqOCRogS6UUG84lxPugeX';
        const curto = shortenRef(id);
        assert.ok(curto.startsWith('cs_live_'), 'perdeu o prefixo');
        assert.ok(curto.endsWith('PugeX'), 'perdeu o sufixo');
    });

    test('nenhum identificador da fatura passa de 25 caracteres', () => {
        // A largura da coluna é o critério real: com ~122px de rótulo, um
        // valor de 25 caracteres ainda cabe em uma linha.
        const d = buildInvoiceData({ row: COM_ASSINATURA, license: LICENCA });
        const ids = [
            shortenRef(d.purchaseId),
            shortenRef(d.stripePaymentId),
            shortenRef(d.stripeSubscriptionId),
        ];
        for (const id of ids) {
            assert.ok(id.length <= 25, `linha quebrada: ${id} (${id.length})`);
        }
    });

    test('IDs curtos passam intactos', () => {
        assert.equal(shortenRef('pay_12345'), 'pay_12345');
        assert.equal(shortenRef('in_1UQplj'), 'in_1UQplj');
    });

    test('valores vazios viram travessão, nunca "null" ou "undefined"', () => {
        assert.equal(shortenRef(null), '—');
        assert.equal(shortenRef(undefined), '—');
        assert.equal(shortenRef(''), '—');
        assert.equal(shortenRef('   '), '—');
    });

    test('é idempotente: encurtar duas vezes não muda mais nada', () => {
        const uma = shortenRef(PAGAMENTO_AVULSO.stripe_id!);
        assert.equal(shortenRef(uma), uma);
    });
});

// ===========================================================================
// 3. client_id existe e nunca era impresso
// ===========================================================================

describe('ID do cliente vem de client_id, não do documento fiscal', () => {
    test('carrega o identificador interno da licença', () => {
        const d = buildInvoiceData({ row: PAGAMENTO_AVULSO, license: LICENCA });
        assert.equal(d.clientId, '797344');
    });

    test('não confunde com CPF/CNPJ', () => {
        const d = buildInvoiceData({
            row: PAGAMENTO_AVULSO,
            license: LICENCA,
            customerDocument: '123.456.789-00',
        });
        // As duas informações coexistem sem se sobrescrever.
        assert.equal(d.clientId, '797344');
        assert.equal(d.customerDocument, '123.456.789-00');
    });

    test('sem licença, não inventa identificador', () => {
        const d = buildInvoiceData({ row: PAGAMENTO_AVULSO, license: null });
        assert.equal(d.clientId, null);
    });

    test('client_id vazio ou nulo vira null, não string vazia', () => {
        for (const v of [null, '', '   ', undefined]) {
            const d = buildInvoiceData({
                row: PAGAMENTO_AVULSO,
                license: { ...LICENCA, client_id: v as never },
            });
            assert.equal(d.clientId, null, `client_id ${JSON.stringify(v)} deveria virar null`);
        }
    });

    test('aceita client_id numérico (o banco devolve como texto, mas pode variar)', () => {
        const d = buildInvoiceData({
            row: PAGAMENTO_AVULSO,
            license: { ...LICENCA, client_id: 797344 },
        });
        assert.equal(d.clientId, '797344');
    });
});

// ===========================================================================
// 4. "Período pago" meio inventado
// ===========================================================================

describe('período pago só é afirmado quando existe', () => {
    test('sem período, NÃO herda a validade da licença', () => {
        // Defeito original: imprimia "— a 18/11/2026", com um travessão
        // parecendo data de início.
        const d = buildInvoiceData({ row: PAGAMENTO_AVULSO, license: LICENCA });
        assert.equal(d.periodStart, null);
        assert.equal(d.periodEnd, null);
    });

    test('a validade continua disponível no bloco da licença', () => {
        // Perder o período não pode custar a vigência ao cliente.
        const d = buildInvoiceData({ row: PAGAMENTO_AVULSO, license: LICENCA });
        assert.equal(d.licenseExpiresAt, '2026-11-19T00:00:00+00:00');
    });

    test('com início e fim, o período é usado integralmente', () => {
        const d = buildInvoiceData({ row: COM_ASSINATURA, license: LICENCA });
        assert.equal(d.periodStart, '2026-10-19T02:47:55.000Z');
        assert.equal(d.periodEnd, '2026-11-19T02:47:55.000Z');
    });

    test('só o fim registrado, sem início, também não vira intervalo', () => {
        const d = buildInvoiceData({
            row: { ...PAGAMENTO_AVULSO, period_end: '2026-11-19T02:47:55.000Z' },
            license: LICENCA,
        });
        assert.equal(d.periodStart, null);
        assert.equal(d.periodEnd, '2026-11-19T02:47:55.000Z');
    });
});

// ===========================================================================
// Regressão: o PDF ainda gera
// ===========================================================================

describe('o PDF continua sendo gerado depois das correções', () => {
    test('caso avulsa gera PDF válido', async () => {
        const d = buildInvoiceData({ row: PAGAMENTO_AVULSO, license: LICENCA });
        const pdf = await generateInvoicePdf(d);
        assert.ok(pdf.bytes.length > 2000);
        assert.equal(String.fromCharCode(...pdf.bytes.slice(0, 5)), '%PDF-');
        assert.ok(pdf.fileName.endsWith('.pdf'));
    });

    test('caso com assinatura gera PDF válido', async () => {
        const d = buildInvoiceData({ row: COM_ASSINATURA, license: LICENCA });
        const pdf = await generateInvoicePdf(d);
        assert.ok(pdf.bytes.length > 2000);
        assert.equal(String.fromCharCode(...pdf.bytes.slice(0, 5)), '%PDF-');
    });

    test('sem nenhuma licença o documento ainda é emitido', async () => {
        // O cliente tem direito ao comprovante da cobrança mesmo que a
        // emissão da licença tenha falhado.
        const d = buildInvoiceData({ row: PAGAMENTO_AVULSO, license: null });
        const pdf = await generateInvoicePdf(d);
        assert.ok(pdf.bytes.length > 2000);
    });
});
