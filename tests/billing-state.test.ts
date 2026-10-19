/**
 * Testes do ESTADO CANÔNICO DE FATURAMENTO (missão §3, §9 e §12).
 *
 * Estes testes existem porque o bug original ("Renovação: desligada" com
 * assinatura viva) era um bug de DERIVAÇÃO: o painel decidia por conta própria.
 * Aqui travamos as regras que fazem "Renovação: Ativada" só aparecer quando a
 * Stripe confirma renovação futura programada.
 *
 * Rodar: npm test
 */

import test, { describe } from 'node:test';
import assert from 'node:assert/strict';

import {
    resolveBillingState,
    toSubscriptionStatus,
    extractInvoiceSubscriptionId,
    extractChargeInvoiceId,
    extractInvoicePaymentIntentId,
    toStripeIdString,
    type BillingState,
} from '../lib/billing-state.ts';

const FUTURO = '2099-11-19T02:47:55.000Z';

describe('toSubscriptionStatus — cancel_at_period_end tem prioridade', () => {
    test('active sem cancelamento vira ACTIVE', () => {
        assert.equal(toSubscriptionStatus({ stripeStatus: 'active' }), 'ACTIVE');
    });

    test('active COM cancel_at_period_end vira CANCEL_SCHEDULED (não ACTIVE)', () => {
        // Este é exatamente o caso que fazia o painel mentir.
        assert.equal(
            toSubscriptionStatus({ stripeStatus: 'active', cancelAtPeriodEnd: true }),
            'CANCEL_SCHEDULED'
        );
    });

    test('cada status da Stripe tem tradução', () => {
        const casos: Array<[string, string]> = [
            ['trialing', 'TRIALING'],
            ['past_due', 'PAST_DUE'],
            ['unpaid', 'UNPAID'],
            ['paused', 'PAUSED'],
            ['canceled', 'CANCELED'],
            ['incomplete', 'INCOMPLETE'],
            ['incomplete_expired', 'INCOMPLETE_EXPIRED'],
        ];
        for (const [stripe, esperado] of casos) {
            assert.equal(toSubscriptionStatus({ stripeStatus: stripe }), esperado, stripe);
        }
    });

    test('reembolso vence qualquer status de assinatura', () => {
        assert.equal(
            toSubscriptionStatus({ stripeStatus: 'active', refunded: true }),
            'REFUNDED'
        );
    });

    test('status desconhecido não vira estado inventado', () => {
        assert.equal(toSubscriptionStatus({ stripeStatus: 'algo_novo' }), 'UNKNOWN');
        assert.equal(toSubscriptionStatus({ stripeStatus: null }), 'UNKNOWN');
    });
});

describe('resolveBillingState — renovação ATIVADA só com confirmação real', () => {
    const ativa = {
        subscriptionStatus: 'ACTIVE',
        hasSubscription: true,
        paymentStatus: 'approved',
        cancelAtPeriodEnd: false,
        nextBillingAt: FUTURO,
    };

    test('assinatura ativa + data futura => renovação ativada', () => {
        const r = resolveBillingState(ativa);
        assert.equal(r.state, 'ACTIVE_RENEWING');
        assert.equal(r.renewalEnabled, true);
        assert.equal(r.canCancelRenewal, true);
        assert.equal(r.canResumeRenewal, false);
    });

    test('ACTIVE sem data futura NÃO é renovação ativada', () => {
        // A Stripe pode dizer ACTIVE e ainda assim não ter nada programado:
        // nesse caso dizer "Ativada" seria mentira.
        const r = resolveBillingState({ ...ativa, nextBillingAt: null });
        assert.equal(r.renewalEnabled, false);
        assert.equal(r.state, 'ACTIVE_RENEWING');
        // O direito de desligar a renovação NÃO depende do espelho local estar
        // completo: quem sabe se há cobrança futura é a Stripe.
        assert.equal(r.canCancelRenewal, true);
    });

    test('ACTIVE sem data futura NÃO afirma que há cobrança programada', () => {
        // Contradição proibida: o hint diz "próxima cobrança programada" enquanto
        // renewalEnabled=false. Uma das duas afirmações tem de ceder.
        const r = resolveBillingState({ ...ativa, nextBillingAt: null });
        assert.doesNotMatch(r.hint, /próxima cobrança está programada/);
        assert.match(r.hint, /Sincronizar Agora/);
    });

    test('ACTIVE com data futura afirma a cobrança programada', () => {
        assert.match(resolveBillingState(ativa).hint, /próxima cobrança está programada/);
    });

    test('cancelamento agendado => desligada, com acesso preservado', () => {
        const r = resolveBillingState({
            ...ativa,
            subscriptionStatus: 'CANCEL_SCHEDULED',
            cancelAtPeriodEnd: true,
            nextBillingAt: null,
        });
        assert.equal(r.state, 'CANCEL_SCHEDULED');
        assert.equal(r.renewalEnabled, false);
        assert.equal(r.canResumeRenewal, true);
        assert.equal(r.canCancelRenewal, false);
    });

    test('assinatura encerrada não oferece cancelamento (botão enganoso)', () => {
        const r = resolveBillingState({
            ...ativa,
            subscriptionStatus: 'CANCELED',
            nextBillingAt: null,
        });
        assert.equal(r.state, 'ENDED');
        assert.equal(r.renewalEnabled, false);
        assert.equal(r.canCancelRenewal, false);
        assert.equal(r.canResumeRenewal, false);
    });

    test('reembolso não oferece cancelamento nem reembolso em duplicidade', () => {
        const r = resolveBillingState({
            ...ativa,
            subscriptionStatus: 'REFUNDED',
            paymentStatus: 'refunded',
        });
        assert.equal(r.state, 'REFUNDED');
        assert.equal(r.canRequestRefund, false);
        assert.equal(r.renewalEnabled, false);
    });
});

describe('resolveBillingState — todos os estados exigidos são alcançáveis', () => {
    const base = { hasSubscription: true, nextBillingAt: FUTURO, cancelAtPeriodEnd: false };

    const casos: Array<[string, BillingState]> = [
        ['assinatura ativa renovável', resolveBillingState({ ...base, subscriptionStatus: 'ACTIVE', paymentStatus: 'approved' }).state],
        ['cancelamento agendado', resolveBillingState({ ...base, subscriptionStatus: 'CANCEL_SCHEDULED', cancelAtPeriodEnd: true, nextBillingAt: null }).state],
        ['assinatura encerrada', resolveBillingState({ ...base, subscriptionStatus: 'CANCELED', nextBillingAt: null }).state],
        ['pagamento pendente', resolveBillingState({ hasSubscription: false, paymentStatus: 'pending' }).state],
        ['cobrança falhou', resolveBillingState({ ...base, subscriptionStatus: 'PAST_DUE' }).state],
        ['cobrança em aberto', resolveBillingState({ ...base, subscriptionStatus: 'UNPAID' }).state],
        ['cadastro incompleto', resolveBillingState({ ...base, subscriptionStatus: 'INCOMPLETE' }).state],
        ['período de teste', resolveBillingState({ ...base, subscriptionStatus: 'TRIALING' }).state],
        ['assinatura pausada', resolveBillingState({ ...base, subscriptionStatus: 'PAUSED' }).state],
        ['assinatura reembolsada', resolveBillingState({ ...base, subscriptionStatus: 'REFUNDED' }).state],
        ['compra avulsa', resolveBillingState({ hasSubscription: false, paymentStatus: 'approved' }).state],
    ];

    test('cada cenário produz o estado esperado', () => {
        const esperados: BillingState[] = [
            'ACTIVE_RENEWING',
            'CANCEL_SCHEDULED',
            'ENDED',
            'PAYMENT_PENDING',
            'PAYMENT_FAILED',
            'UNPAID',
            'INCOMPLETE',
            'TRIALING',
            'PAUSED',
            'REFUNDED',
            'ONE_TIME',
        ];
        casos.forEach(([nome, obtained], i) => {
            assert.equal(obtained, esperados[i], `${nome} deveria ser ${esperados[i]}`);
        });
    });

    test('todo estado tem rótulo em português e dica não vazia', () => {
        for (const [, estado] of casos) {
            const r = resolveBillingState({
                subscriptionStatus: estado === 'ONE_TIME' ? null : estado,
                hasSubscription: estado !== 'ONE_TIME' && estado !== 'PAYMENT_PENDING',
                paymentStatus: estado === 'ONE_TIME' ? 'approved' : 'pending',
                nextBillingAt: FUTURO,
                cancelAtPeriodEnd: estado === 'CANCEL_SCHEDULED',
            });
            assert.ok(r.label.length > 2, `rótulo ausente para ${estado}`);
            assert.ok(r.hint.length > 10, `dica ausente/curta para ${estado}`);
        }
    });
});

describe('resolveBillingState — compra avulsa nunca mostra renovação', () => {
    test('sem assinatura + pago => ONE_TIME com renovação desligada', () => {
        const r = resolveBillingState({ hasSubscription: false, paymentStatus: 'approved' });
        assert.equal(r.state, 'ONE_TIME');
        assert.equal(r.renewalEnabled, false);
        assert.equal(r.hasSubscription, false);
    });

    test('sem assinatura + pendente => PAGAMENTO_PENDING', () => {
        const r = resolveBillingState({ hasSubscription: false, paymentStatus: 'pending' });
        assert.equal(r.state, 'PAYMENT_PENDING');
        assert.equal(r.renewalEnabled, false);
    });
});

describe('resolveBillingState — botão de reembolso', () => {
    test('compra aprovada com assinatura ativa pode solicitar reembolso', () => {
        const r = resolveBillingState({
            subscriptionStatus: 'ACTIVE', hasSubscription: true,
            paymentStatus: 'approved', nextBillingAt: FUTURO,
        });
        assert.equal(r.canRequestRefund, true);
    });

    test('assinatura encerrada ou reembolsada não pode pedir de novo', () => {
        assert.equal(
            resolveBillingState({ subscriptionStatus: 'CANCELED', hasSubscription: true, paymentStatus: 'approved' }).canRequestRefund,
            false
        );
        assert.equal(
            resolveBillingState({ subscriptionStatus: 'REFUNDED', hasSubscription: true, paymentStatus: 'refunded' }).canRequestRefund,
            false
        );
    });
});

// ============================================================================
// Leitura tolerante dos payloads da Stripe (api 2025+)
// ============================================================================

describe('extractInvoiceSubscriptionId — as duas formas do payload', () => {
    test('formato antigo: subscription no topo', () => {
        assert.equal(
            extractInvoiceSubscriptionId({ id: 'in_1', subscription: 'sub_ABC' }),
            'sub_ABC'
        );
    });

    test('formato novo: parent.subscription_details.subscription', () => {
        assert.equal(
            extractInvoiceSubscriptionId({
                id: 'in_1',
                subscription: null,
                parent: { type: 'subscription_details', subscription_details: { subscription: 'sub_NEW' } },
            }),
            'sub_NEW'
        );
    });

    test('formato novo: objeto expandido em vez de string', () => {
        assert.equal(
            extractInvoiceSubscriptionId({ subscription: { id: 'sub_OBJ' } }),
            'sub_OBJ'
        );
    });

    test('formato novo: id vindo da linha da invoice', () => {
        assert.equal(
            extractInvoiceSubscriptionId({
                id: 'in_1',
                lines: { data: [{ parent: { subscription_item_details: { subscription: 'sub_LINE' } } }] },
            }),
            'sub_LINE'
        );
    });

    test('invoice sem assinatura devolve null (não inventa)', () => {
        assert.equal(extractInvoiceSubscriptionId({ id: 'in_1', subscription: null }), null);
        assert.equal(extractInvoiceSubscriptionId(null), null);
        assert.equal(extractInvoiceSubscriptionId({}), null);
    });
});

describe('extractChargeInvoiceId — charge.invoice foi removido da API', () => {
    test('usa invoice_id (campo canônico atual)', () => {
        assert.equal(extractChargeInvoiceId({ id: 'ch_1', invoice_id: 'in_1' }), 'in_1');
    });

    test('ainda aceita charge.invoice em payloads antigos', () => {
        assert.equal(extractChargeInvoiceId({ id: 'ch_1', invoice: 'in_OLD' }), 'in_OLD');
    });

    test('aceita invoice expandida como objeto', () => {
        assert.equal(extractChargeInvoiceId({ invoice: { id: 'in_OBJ' } }), 'in_OBJ');
    });

    test('charge sem fatura devolve null', () => {
        assert.equal(extractChargeInvoiceId({ id: 'ch_1' }), null);
        assert.equal(extractChargeInvoiceId(null), null);
    });
});

describe('extractInvoicePaymentIntentId — do topo ou de parent.charge_details', () => {
    test('formato antigo', () => {
        assert.equal(extractInvoicePaymentIntentId({ payment_intent: 'pi_1' }), 'pi_1');
    });

    test('formato novo via parent.charge_details', () => {
        assert.equal(
            extractInvoicePaymentIntentId({
                parent: { charge_details: { charges: { data: [{ payment_intent: 'pi_NEW' }] } } },
            }),
            'pi_NEW'
        );
    });

    test('sem payment intent devolve null', () => {
        assert.equal(extractInvoicePaymentIntentId({ id: 'in_1' }), null);
    });
});

describe('toStripeIdString — normaliza string e objeto', () => {
    test('string passa direto', () => {
        assert.equal(toStripeIdString('sub_1'), 'sub_1');
    });

    test('objeto usa .id', () => {
        assert.equal(toStripeIdString({ id: 'sub_2' }), 'sub_2');
    });

    test('vazio e null viram null (coluna nullable, sem string "undefined")', () => {
        assert.equal(toStripeIdString(''), null);
        assert.equal(toStripeIdString('   '), null);
        assert.equal(toStripeIdString(null), null);
        assert.equal(toStripeIdString({}), null);
    });
});