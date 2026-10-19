/**
 * O DESIGN DA FATURA (trava de regressão visual).
 *
 * O documento comercial foi redesenhado para ser IDÊNTICO ao PDF do
 * aplicativo desktop (a referência que o operador entregou). Este teste
 * trava a GEOMETRIA do resultado: posições, cores, faixas e fontes.
 *
 * Sem ele, qualquer "ajuste rápido" no gerador entregaria um documento com
 * cara diferente do aprovado — e o cliente receberia um papel que não é o da
 * VOLTRIS.
 */

import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import zlib from 'node:zlib';
import { PDFDocument } from 'pdf-lib';
import { buildInvoiceData, type PaymentInvoiceRow, type LicenseFacts } from '../lib/invoice-data.ts';
import { generateInvoicePdf } from '../lib/invoice-pdf.ts';

const PAGAMENTO: PaymentInvoiceRow = {
    id: '543665ab-fb3d-4794-9c96-7dcd25deefc1',
    reference_id: 'st_1792253655757',
    user_id: '32879ff8-0ef7-4c95-a5d4-dfa7b9081f5e',
    customer_name: 'Álvaro Araújo',
    customer_name_snapshot: null,
    email: 'alvaroaraujodxd@gmail.com',
    amount: 15,
    plan_type: 'pro',
    status: 'approved',
    provider: 'stripe',
    stripe_id: null,
    stripe_customer_id: null,
    stripe_charge_id: null,
    stripe_invoice_id: null,
    stripe_subscription_id: 'sub_1URaGnJpNL78U7iCK7dlMVAe',
    stripe_refund_id: null,
    refunded_amount: null,
    refunded_at: null,
    invoice_kind: 'purchase',
    created_at: '2026-10-17T16:15:41.000Z',
    updated_at: '2026-10-19T13:27:52.000Z',
    paid_at: '2026-10-17T16:15:41.000Z',
    period_start: '2026-10-17T16:15:41.000Z',
    period_end: '2026-11-17T16:15:41.000Z',
    billing_period: 'month',
    currency: 'BRL',
    payment_method: null,
};

const LICENCA: LicenseFacts = {
    license_key: 'VOLTRIS-PRO-257682-20261117-21E5A428FFBF67C4',
    plan_type: 'pro',
    max_devices: 3,
    created_at: '2026-10-17T16:17:00.000Z',
    activated_at: '2026-10-17T16:17:00.000Z',
    expires_at: '2026-11-17T00:00:00+00:00',
    revoked: false,
    user_id: '32879ff8-0ef7-4c95-a5d4-dfa7b9081f5e',
    devicesInUse: 0,
    client_id: '257682',
};

/** Conteúdo da página (stream decodificado), para inspecionar a geometria. */
async function conteudoDaPagina(bytes: Uint8Array): Promise<string> {
    // Re-serializa sem object streams para que o stream da página seja legível.
    const doc = await PDFDocument.load(bytes, { updateMetadata: false });
    const plain = Buffer.from(await doc.save({ useObjectStreams: false }));
    const txt = plain.toString('latin1');

    const objs = new Map<number, string>();
    for (const m of txt.matchAll(/(\d+)\s+0\s+obj([\s\S]*?)endobj/g)) objs.set(Number(m[1]), m[2]);

    for (const [, body] of objs) {
        if (!/\/Type\s*\/Page\b/.test(body)) continue;
        const cm = /\/Contents\s*(?:\[\s*)?(\d+)\s+0\s+R/.exec(body);
        if (!cm) continue;
        const num = Number(cm[1]);
        const objStart = txt.indexOf(`${num} 0 obj`);
        const si = txt.indexOf('stream', objStart);
        const dict = txt.slice(objStart, si);
        const len = Number(/\/Length\s+(\d+)/.exec(dict)![1]);
        let s = si + 6;
        if (plain[s] === 13) s++;
        if (plain[s] === 10) s++;
        const raw = plain.subarray(s, s + len);
        try {
            return zlib.inflateSync(raw).toString('latin1');
        } catch {
            return raw.toString('latin1');
        }
    }
    throw new Error('não encontrei o stream da página');
}

describe('a fatura tem o mesmo desenho do documento de referência', () => {
    test('gera PDF válido com A4', async () => {
        const data = buildInvoiceData({ row: PAGAMENTO, license: LICENCA });
        const out = await generateInvoicePdf(data);
        assert.ok(out.bytes.length > 5000, `PDF muito pequeno: ${out.bytes.length}`);
        const doc = await PDFDocument.load(out.bytes);
        const page = doc.getPage(0);
        assert.equal(Math.round(page.getWidth()), 595);
        assert.equal(Math.round(page.getHeight()), 842);
    });

    test('o nome do arquivo segue o padrão do aplicativo desktop', async () => {
        const data = buildInvoiceData({ row: PAGAMENTO, license: LICENCA });
        const out = await generateInvoicePdf(data);
        assert.equal(out.fileName, 'Fatura_VOLTRIS_PRO_Alvaro_Araujo.pdf');
    });

    test('as fontes do original estão embutidas (Lato + DejaVu Sans Mono)', async () => {
        const data = buildInvoiceData({ row: PAGAMENTO, license: LICENCA });
        const out = await generateInvoicePdf(data);
        // Re-serializa sem object streams para o nome das fontes ficar legível.
        const doc = await PDFDocument.load(out.bytes, { updateMetadata: false });
        const raw = Buffer.from(await doc.save({ useObjectStreams: false })).toString('latin1');
        assert.match(raw, /Lato/);
        assert.match(raw, /DejaVuSansMono/);
    });

    test('a faixa escura do cabeçalho e a de acento estão no lugar', async () => {
        const data = buildInvoiceData({ row: PAGAMENTO, license: LICENCA });
        const out = await generateInvoicePdf(data);
        const c = await conteudoDaPagina(out.bytes);
        // cabeçalho #111327 (0.066667 0.07451 0.152941) e faixa #161A34
        assert.match(c, /0\.066667 0\.07451 0\.152941 rg/);
        assert.match(c, /0\.086275 0\.101961 0\.203922 rg/);
        // o pdf-lib desenha retângulos como caminhos (m/l/h/f) com translação
        assert.match(c, /1 0 0 1 0 632 cm/);   // banda do cabeçalho
        assert.match(c, /49 764 m/);            // canto da marca VOLTRIS
    });

    test('as cores da marca do documento original estão presentes', async () => {
        const data = buildInvoiceData({ row: PAGAMENTO, license: LICENCA });
        const out = await generateInvoicePdf(data);
        const c = await conteudoDaPagina(out.bytes);
        // #9C47DB (título de seção), #1768D8 (rótulo CLIENTE), #7741C7 (total),
        // #F5F6FC (cartão do detalhamento), #F2ECFA (cartão do total),
        // #A6F9D4 (texto do selo de pagamento), #6A4FA6 (assinatura do rodapé).
        for (const cor of [
            '0.611765 0.278431 0.858824',
            '0.090196 0.407843 0.847059',
            '0.466667 0.254902 0.780392',
            '0.960784 0.964706 0.988235',
            '0.94902 0.92549 0.980392',
            '0.65098 0.976471 0.831373',
            '0.415686 0.309804 0.65098',
        ]) {
            assert.ok(c.includes(cor), `cor ausente no documento: ${cor}`);
        }
    });

    test('os textos ficam nas mesmas coordenadas do original', async () => {
        const data = buildInvoiceData({ row: PAGAMENTO, license: LICENCA });
        const out = await generateInvoicePdf(data);
        const c = await conteudoDaPagina(out.bytes);
        const posicoes = [
            '1 0 0 1 89 786 Tm',   // VOLTRIS
            '1 0 0 1 44 721 Tm',   // FATURA COMERCIAL
            '1 0 0 1 73 660 Tm',   // PAGAMENTO CONFIRMADO
            '1 0 0 1 44 606 Tm',   // DADOS DA FATURA
            '1 0 0 1 61 537 Tm',   // VOLTRIS OTIMIZACAO LTDA
            '1 0 0 1 318 537 Tm',  // nome do cliente
            '1 0 0 1 44 406 Tm',   // DETALHAMENTO DA COMPRA
            '1 0 0 1 53 346 Tm',   // produto
            '1 0 0 1 56 279 Tm',   // TOTAL PAGO
            '1 0 0 1 44 241 Tm',   // IDENTIFICAÇÃO DA COMPRA
            '1 0 0 1 60 162 Tm',   // CHAVE DE ATIVAÇÃO
            '1 0 0 1 60 138 Tm',   // chave de ativação
            '1 0 0 1 60 113 Tm',   // "Ative no VOLTRIS OPTIMIZER..."
        ];
        for (const p of posicoes) {
            assert.ok(c.includes(p), `posição ausente no documento: ${p}`);
        }
    });

    test('o cartão da chave de ativação e o total são desenhados', async () => {
        const data = buildInvoiceData({ row: PAGAMENTO, license: LICENCA });
        const out = await generateInvoicePdf(data);
        const c = await conteudoDaPagina(out.bytes);
        assert.match(c, /51 94 m/);    // cartão da chave de ativação
        assert.match(c, /51 266 m/);  // cartão do total
        assert.match(c, /51 439 m/);  // cartão do bloco emitente/cliente
        assert.match(c, /51 651 m/);  // pílula de status
    });

    test('CADA CARTÃO É DESENHADO ANTES DO SEU TEXTO (senão ele COBRE o texto)', async () => {
        // Este foi um defeito REAL: o cartão do bloco EMITENTE/CLIENTE era
        // desenhado depois dos textos e os cobria — o documento saía com um
        // cartão vazio e sem os dados do emitente e do cliente.
        const data = buildInvoiceData({ row: PAGAMENTO, license: LICENCA });
        const out = await generateInvoicePdf(data);
        const c = await conteudoDaPagina(out.bytes);

        const pares: [string, string][] = [
            ['51 439 m', '1 0 0 1 61 561 Tm'],   // cartão -> "EMITENTE"
            ['51 439 m', '1 0 0 1 318 537 Tm'],  // cartão -> nome do cliente
            ['51 266 m', '1 0 0 1 56 279 Tm'],   // cartão do total -> "TOTAL PAGO"
            ['51 94 m', '1 0 0 1 60 162 Tm'],    // cartão da chave -> "CHAVE DE ATIVAÇÃO"
            ['51 651 m', '1 0 0 1 73 660 Tm'],   // pílula -> "PAGAMENTO CONFIRMADO"
        ];
        for (const [cartao, textoBloco] of pares) {
            const iCartao = c.indexOf(cartao);
            const iTexto = c.indexOf(textoBloco);
            assert.ok(iCartao !== -1, `cartão não encontrado: ${cartao}`);
            assert.ok(iTexto !== -1, `texto não encontrado: ${textoBloco}`);
            assert.ok(
                iCartao < iTexto,
                `o cartão (${cartao}) é desenhado DEPOIS do texto (${textoBloco}) e o cobre`
            );
        }
    });
});
