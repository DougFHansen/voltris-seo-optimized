/**
 * Testes da POLÍTICA DE REEMBOLSO (missão §8 e §12).
 *
 * A política publicada em /reembolso-cancelamento é a mesma que estas funções
 * implementam. Se a regra mudar no texto, os testes precisam mudar juntos — é
 * isso que impede o código e a política pública divergirem.
 *
 * Rodar: npm test
 */

import test, { describe } from 'node:test';
import assert from 'node:assert/strict';

import {
    evaluateRefund,
    refundDeadline,
    toEpochMs,
    REFUND_WINDOW_DAYS,
} from '../lib/billing-policy.ts';

/** Relógio fixo: nenhum teste depende do "hoje" real. */
const NOW = Date.parse('2026-10-15T12:00:00.000Z');
const DIA = 86_400_000;

describe('toEpochMs — normaliza ISO, epoch em segundos e em ms', () => {
    test('ISO', () => {
        assert.equal(toEpochMs('2026-10-15T12:00:00.000Z'), NOW);
    });

    test('epoch em segundos (Stripe)', () => {
        assert.equal(toEpochMs(1_791_118_800), 1_791_118_800_000);
    });

    test('epoch em milissegundos', () => {
        assert.equal(toEpochMs(1_791_118_800_000), 1_791_118_800_000);
    });

    test('Date', () => {
        assert.equal(toEpochMs(new Date(NOW)), NOW);
    });

    test('invalidos viram null (nunca Number(NaN) propagando)', () => {
        assert.equal(toEpochMs(null), null);
        assert.equal(toEpochMs(undefined), null);
        assert.equal(toEpochMs(''), null);
        assert.equal(toEpochMs('data-invalida'), null);
    });
});

describe('refundDeadline — 7 dias corridos cheios', () => {
    test('o prazo fecha 1 ms antes do 8º dia', () => {
        const inicio = NOW;
        const fim = refundDeadline(inicio);
        assert.equal(fim, inicio + REFUND_WINDOW_DAYS * DIA - 1);
    });

    test('o cliente tem 7 dias INTEIROS (o dia da compra conta como dia 0)', () => {
        const inicio = NOW;
        // 6 dias e 23h59:59.999 depois ainda está dentro do prazo.
        assert.ok(NOW + (7 * DIA) - 2 <= refundDeadline(inicio));
    });
});

describe('evaluateRefund — dentro da janela (reembolso automático)', () => {
    test('mesmo dia da compra é elegível', () => {
        const r = evaluateRefund({
            purchasedAt: NOW, paymentStatus: 'approved', amount: 15, now: NOW,
        });
        assert.equal(r.outcome, 'AUTO_ELIGIBLE');
        assert.equal(r.eligible, true);
        assert.equal(r.needsReview, false);
        assert.equal(r.daysElapsed, 0);
        assert.match(r.message, /7 dias corridos/);
    });

    test('6 dias depois ainda é elegível', () => {
        const r = evaluateRefund({
            purchasedAt: NOW - 6 * DIA, paymentStatus: 'approved', now: NOW,
        });
        assert.equal(r.eligible, true);
        assert.equal(r.daysRemaining, 1);
    });

    test('o ÚLTIMO instante do 7º dia ainda é elegível (limite inclusivo)', () => {
        const compra = NOW;
        const limite = refundDeadline(compra);
        assert.equal(evaluateRefund({ purchasedAt: compra, paymentStatus: 'approved', now: limite }).eligible, true);
    });

    test('1 ms depois do limite já não é elegível', () => {
        const compra = NOW;
        const limite = refundDeadline(compra);
        const r = evaluateRefund({ purchasedAt: compra, paymentStatus: 'approved', now: limite + 1 });
        assert.equal(r.eligible, false);
        assert.equal(r.outcome, 'REQUIRES_REVIEW');
    });

    test('o valor em BRL aparece na mensagem', () => {
        const r = evaluateRefund({ purchasedAt: NOW, paymentStatus: 'approved', amount: 4.99, now: NOW });
        // toLocaleString pode usar espaço não separável; comparamos sem ele.
        assert.ok(r.message.replace(/\s/g, '').includes('R$4,99'), r.message);
    });
});

describe('evaluateRefund — fora da janela vai para análise, nunca automático', () => {
    test('8 dias depois pede análise', () => {
        const r = evaluateRefund({
            purchasedAt: NOW - 8 * DIA, paymentStatus: 'approved', now: NOW,
        });
        assert.equal(r.eligible, false);
        assert.equal(r.needsReview, true);
        assert.equal(r.outcome, 'REQUIRES_REVIEW');
        assert.ok(r.message.includes('análise'), r.message);
    });

    test('a base legal citada é o art. 49 do CDC', () => {
        const r = evaluateRefund({ purchasedAt: NOW - 10 * DIA, paymentStatus: 'approved', now: NOW });
        assert.match(r.basis, /art\. 49/);
        assert.match(r.basis, /C[oó]digo de Defesa do Consumidor/);
    });
});

describe('evaluateRefund — idempotência (nada de reembolso duplicado)', () => {
    const casos: Array<[string, string]> = [
        ['refunded', 'ALREADY_REFUNDED'],
        ['charged_back', 'ALREADY_REFUNDED'],
        ['chargeback', 'ALREADY_REFUNDED'],
        ['estornado', 'ALREADY_REFUNDED'],
        ['partially_refunded', 'ALREADY_REFUNDED'],
    ];

    for (const [status, esperado] of casos) {
        test(`status "${status}" não pode ser reembolsado de novo`, () => {
            const r = evaluateRefund({ purchasedAt: NOW, paymentStatus: status, now: NOW });
            assert.equal(r.outcome, esperado);
            assert.equal(r.eligible, false);
        });
    }

    test('refund_id já gravado bloqueia, mesmo com status aprovado', () => {
        const r = evaluateRefund({
            purchasedAt: NOW, paymentStatus: 'approved', refundId: 're_123', now: NOW,
        });
        assert.equal(r.outcome, 'ALREADY_REFUNDED');
    });

    test('solicitação manual em aberto bloqueia (não abre a segunda via)', () => {
        const r = evaluateRefund({
            purchasedAt: NOW, paymentStatus: 'approved', openRequestId: 'uuid-1', now: NOW,
        });
        assert.equal(r.outcome, 'ALREADY_REQUESTED');
        assert.equal(r.eligible, false);
    });
});

describe('evaluateRefund — o que NÃO é compra paga', () => {
    test('pendente não é reembolsável', () => {
        const r = evaluateRefund({ purchasedAt: NOW, paymentStatus: 'pending', now: NOW });
        assert.equal(r.outcome, 'NOT_A_PAID_PURCHASE');
        assert.equal(r.eligible, false);
    });

    for (const status of ['failed', 'canceled', 'cancelled', 'declined', 'expired']) {
        test(`"${status}" nunca teve dinheiro para devolver`, () => {
            const r = evaluateRefund({ purchasedAt: NOW, paymentStatus: status, now: NOW });
            assert.equal(r.outcome, 'NOT_A_PAID_PURCHASE');
        });
    }

    test('sem data de compra NÃO se automatiza decisão financeira', () => {
        const r = evaluateRefund({ purchasedAt: null, paymentStatus: 'approved', now: NOW });
        assert.equal(r.outcome, 'MISSING_DATA');
        assert.equal(r.eligible, false);
        assert.equal(r.needsReview, true);
    });
});

describe('evaluateRefund — sinônimos de status aprovado', () => {
    for (const status of ['approved', 'paid', 'succeeded', 'complete', 'completed', 'APPROVED', ' approved ']) {
        test(`"${status}" é compra paga e entra na regra dos 7 dias`, () => {
            const r = evaluateRefund({ purchasedAt: NOW, paymentStatus: status, now: NOW });
            assert.equal(r.outcome, 'AUTO_ELIGIBLE', status);
        });
    }
});

describe('evaluateRefund — regras contra "sucesso falso"', () => {
    test('nenhum resultado afirma reembolso quando não houve', () => {
        const cenarios = [
            { purchasedAt: NOW, paymentStatus: 'pending' },
            { purchasedAt: NOW, paymentStatus: 'failed' },
            { purchasedAt: NOW - 30 * DIA, paymentStatus: 'approved' },
            { purchasedAt: NOW, paymentStatus: 'refunded' },
            { purchasedAt: null, paymentStatus: 'approved' },
        ];
        for (const c of cenarios) {
            const r = evaluateRefund({ ...c, now: NOW });
            assert.equal(r.eligible, false, JSON.stringify(c));
            assert.ok(r.message.length > 0);
            assert.ok(r.basis.length > 0);
        }
    });

    test('a base legal aparece em TODOS os resultados', () => {
        const cenarios = [
            { purchasedAt: NOW, paymentStatus: 'approved' },
            { purchasedAt: NOW - 30 * DIA, paymentStatus: 'approved' },
            { purchasedAt: NOW, paymentStatus: 'pending' },
            { purchasedAt: NOW, paymentStatus: 'refunded' },
            { purchasedAt: null, paymentStatus: 'approved' },
        ];
        for (const c of cenarios) {
            assert.ok(evaluateRefund({ ...c, now: NOW }).basis.length > 10);
        }
    });
});