/**
 * Testes do ESTADO CANÔNICO da licença (missão §6 e §11).
 *
 * Cobrem a máquina de estados servidor→painel: os 6 estados exigidos, as
 * prioridades entre eles e as duas regras que o usuário pagou para não ser
 * enganado: cancelamento agendado NÃO é corte imediato, pagamento pendente
 * NÃO libera acesso.
 *
 * Rodar: npm test  (node:test nativo do Node 22+; sem dependências novas)
 */

import test, { describe } from 'node:test';
import assert from 'node:assert/strict';

import {
    resolveLicenseState,
    isLicenseActive,
    isLicenseExpired,
    billingPeriodLabel,
    licenseDisplayName,
    licenseIsOwnedBy,
} from '../lib/license-schema.ts';

/** Timestamp fixo: nenhum teste depende do relógio real. */
const NOW = Date.parse('2026-10-15T12:00:00.000Z');

const inDays = (days: number) => new Date(NOW + days * 86_400_000).toISOString();
const FUTURE = inDays(20);
const PAST = inDays(-5);

const ALL_STATES = [
    'ATIVA',
    'PAGAMENTO_PENDENTE',
    'FALHA_NO_PAGAMENTO',
    'CANCELAMENTO_AGENDADO',
    'EXPIRADA',
    'REVOGADA',
] as const;

describe('resolveLicenseState — os 6 estados exigidos existem', () => {
    test('cada um dos 6 estados é alcançável', () => {
        const reachable = new Set<string>();

        reachable.add(resolveLicenseState({ expires_at: FUTURE, payment_status: 'approved', subscription_status: 'ACTIVE', now: NOW }).state);
        reachable.add(resolveLicenseState({ expires_at: FUTURE, payment_status: 'pending', now: NOW }).state);
        reachable.add(resolveLicenseState({ expires_at: FUTURE, payment_status: 'failed', subscription_status: 'ACTIVE', now: NOW }).state);
        reachable.add(resolveLicenseState({ expires_at: FUTURE, payment_status: 'approved', subscription_status: 'CANCEL_SCHEDULED', now: NOW }).state);
        reachable.add(resolveLicenseState({ expires_at: PAST, payment_status: 'approved', subscription_status: 'ACTIVE', now: NOW }).state);
        reachable.add(resolveLicenseState({ revoked: true, expires_at: FUTURE, payment_status: 'approved', subscription_status: 'ACTIVE', now: NOW }).state);

        assert.deepEqual([...reachable].sort(), [...ALL_STATES].sort());
    });

    test('cada estado tem rótulo em português não vazio', () => {
        const cases = [
            { expires_at: FUTURE, payment_status: 'approved', subscription_status: 'ACTIVE' },
            { expires_at: FUTURE, payment_status: 'pending' },
            { expires_at: FUTURE, payment_status: 'failed', subscription_status: 'ACTIVE' },
            { expires_at: FUTURE, payment_status: 'approved', subscription_status: 'CANCEL_SCHEDULED' },
            { expires_at: PAST, payment_status: 'approved', subscription_status: 'ACTIVE' },
            { revoked: true, expires_at: FUTURE, payment_status: 'approved' },
        ];
        for (const c of cases) {
            const r = resolveLicenseState({ ...c, now: NOW });
            assert.ok(r.label && r.label.length > 2, `rótulo ausente para ${r.state}`);
            assert.match(r.label, /^[A-Za-zÀ-ÿ]/, `rótulo deveria ser legível: ${r.label}`);
        }
    });
});

describe('resolveLicenseState — ATIVA', () => {
    test('assinatura ativa + período pago em diante → acesso liberado', () => {
        const r = resolveLicenseState({ expires_at: FUTURE, payment_status: 'approved', subscription_status: 'ACTIVE', now: NOW });
        assert.equal(r.state, 'ATIVA');
        assert.equal(r.hasAccess, true);
        assert.equal(r.label, 'Ativa');
    });

    test('pagamento único (sem assinatura) com expiração futura → ATIVA', () => {
        const r = resolveLicenseState({ expires_at: FUTURE, payment_status: 'approved', now: NOW });
        assert.equal(r.state, 'ATIVA');
        assert.equal(r.hasAccess, true);
    });

    test('payment_status ausente (linha legada) com expiração futura → ATIVA', () => {
        const r = resolveLicenseState({ expires_at: FUTURE, now: NOW });
        assert.equal(r.state, 'ATIVA');
        assert.equal(r.hasAccess, true);
    });
});

describe('resolveLicenseState — REVOGADA vence tudo', () => {
    test('revoked=true com expiração futura e pagamento aprovado ainda revoga', () => {
        const r = resolveLicenseState({ revoked: true, expires_at: FUTURE, payment_status: 'approved', subscription_status: 'ACTIVE', now: NOW });
        assert.equal(r.state, 'REVOGADA');
        assert.equal(r.hasAccess, false);
    });

    test('estorno do pagamento revoga (não existe "período já pago")', () => {
        for (const status of ['refunded', 'charged_back', 'chargeback', 'estornado']) {
            const r = resolveLicenseState({ expires_at: FUTURE, payment_status: status, subscription_status: 'ACTIVE', now: NOW });
            assert.equal(r.state, 'REVOGADA', `status ${status} deveria revogar`);
            assert.equal(r.hasAccess, false);
        }
    });

    test('revoked=false explícito não revoga', () => {
        const r = resolveLicenseState({ revoked: false, expires_at: FUTURE, payment_status: 'approved', now: NOW });
        assert.equal(r.state, 'ATIVA');
    });
});

describe('resolveLicenseState — PAGAMENTO_PENDENTE não libera acesso', () => {
    test('pending sem assinatura → pendente e SEM acesso', () => {
        const r = resolveLicenseState({ expires_at: FUTURE, payment_status: 'pending', now: NOW });
        assert.equal(r.state, 'PAGAMENTO_PENDENTE');
        assert.equal(r.hasAccess, false);
    });

    test('cada sinônimo de pendente é tratado como pendente', () => {
        for (const status of ['pending', 'processing', 'open', 'requires_payment_method', 'unpaid', 'criado', 'novo']) {
            const r = resolveLicenseState({ expires_at: FUTURE, payment_status: status, now: NOW });
            assert.equal(r.state, 'PAGAMENTO_PENDENTE', `${status} deveria ser pendente`);
            assert.equal(r.hasAccess, false, `${status} não pode liberar acesso`);
        }
    });

    test('pendente COM assinatura registrada continua sem acesso futuro', () => {
        const r = resolveLicenseState({ expires_at: FUTURE, payment_status: 'pending', subscription_status: 'ACTIVE', now: NOW });
        assert.equal(r.state, 'PAGAMENTO_PENDENTE');
        assert.equal(r.hasAccess, false);
    });

    test('revogação vence pagamento pendente', () => {
        const r = resolveLicenseState({ revoked: true, expires_at: FUTURE, payment_status: 'pending', now: NOW });
        assert.equal(r.state, 'REVOGADA');
    });
});

describe('resolveLicenseState — EXPIRADA', () => {
    test('período pago vencido → expirada sem acesso', () => {
        const r = resolveLicenseState({ expires_at: PAST, payment_status: 'approved', subscription_status: 'ACTIVE', now: NOW });
        assert.equal(r.state, 'EXPIRADA');
        assert.equal(r.hasAccess, false);
    });

    test('exatamente agora conta como expirada (limite <= now)', () => {
        const r = resolveLicenseState({ expires_at: new Date(NOW).toISOString(), payment_status: 'approved', now: NOW });
        assert.equal(r.state, 'EXPIRADA');
    });

    test('vencimento vence falha de cobrança (não existe período pago inexistente)', () => {
        const r = resolveLicenseState({ expires_at: PAST, payment_status: 'failed', subscription_status: 'PAST_DUE', now: NOW });
        assert.equal(r.state, 'EXPIRADA');
        assert.equal(r.hasAccess, false);
    });

    test('vencimento vence cancelamento agendado', () => {
        const r = resolveLicenseState({ expires_at: PAST, payment_status: 'approved', subscription_status: 'CANCEL_SCHEDULED', now: NOW });
        assert.equal(r.state, 'EXPIRADA');
    });

    test('assinatura CANCELED com data presente → expirada (cortada na data)', () => {
        const r = resolveLicenseState({ expires_at: FUTURE, payment_status: 'approved', subscription_status: 'CANCELED', now: NOW });
        assert.equal(r.state, 'EXPIRADA');
        assert.equal(r.hasAccess, false);
    });

    test('data de expiração ilegável é tratada como sem vencimento (legado vitalício)', () => {
        const r = resolveLicenseState({ expires_at: 'data-invalida', payment_status: 'approved', now: NOW });
        assert.equal(r.state, 'ATIVA');
        assert.equal(r.daysLeft, null);
    });
});

describe('resolveLicenseState — CANCELAMENTO_AGENDADO mantém acesso', () => {
    test('cancelamento agendado com período pago em diante → acesso preserved', () => {
        const r = resolveLicenseState({ expires_at: FUTURE, payment_status: 'approved', subscription_status: 'CANCEL_SCHEDULED', now: NOW });
        assert.equal(r.state, 'CANCELAMENTO_AGENDADO');
        assert.equal(r.hasAccess, true);
        assert.equal(r.label, 'Cancelamento agendado');
    });

    test('cancelamento agendado não é confundido com revogação', () => {
        const r = resolveLicenseState({ expires_at: FUTURE, payment_status: 'approved', subscription_status: 'CANCEL_SCHEDULED', now: NOW });
        assert.notEqual(r.state, 'REVOGADA');
        assert.notEqual(r.state, 'EXPIRADA');
    });
});

describe('resolveLicenseState — FALHA_NO_PAGAMENTO respeita o período pago', () => {
    test('cobrança recorrente falhou, período pago em diante → acesso mantido', () => {
        const r = resolveLicenseState({ expires_at: FUTURE, payment_status: 'failed', subscription_status: 'ACTIVE', now: NOW });
        assert.equal(r.state, 'FALHA_NO_PAGAMENTO');
        assert.equal(r.hasAccess, true);
    });

    test('PAST_DUE → falha no pagamento com acesso mantido', () => {
        const r = resolveLicenseState({ expires_at: FUTURE, payment_status: 'approved', subscription_status: 'PAST_DUE', now: NOW });
        assert.equal(r.state, 'FALHA_NO_PAGAMENTO');
        assert.equal(r.hasAccess, true);
    });

    test('cada sinônimo de falha cai em FALHA_NO_PAGAMENTO', () => {
        for (const status of ['failed', 'past_due', 'payment_failed', 'canceled', 'cancelled', 'declined']) {
            const r = resolveLicenseState({ expires_at: FUTURE, payment_status: status, subscription_status: 'ACTIVE', now: NOW });
            assert.equal(r.state, 'FALHA_NO_PAGAMENTO', `${status} deveria ser falha`);
            assert.equal(r.hasAccess, true, `${status} não pode cortar o período já pago`);
        }
    });

    test('estorno não é tratado como falha (é revogação)', () => {
        const r = resolveLicenseState({ expires_at: FUTURE, payment_status: 'refunded', subscription_status: 'ACTIVE', now: NOW });
        assert.equal(r.state, 'REVOGADA');
    });
});

describe('resolveLicenseState — expiringSoon e daysLeft', () => {
    test('7 dias ou menos avisa renovação', () => {
        const r = resolveLicenseState({ expires_at: inDays(7), payment_status: 'approved', subscription_status: 'ACTIVE', now: NOW });
        assert.equal(r.expiringSoon, true);
        assert.equal(r.daysLeft, 7);
    });

    test('8 dias não incomoda o cliente', () => {
        const r = resolveLicenseState({ expires_at: inDays(8), payment_status: 'approved', subscription_status: 'ACTIVE', now: NOW });
        assert.equal(r.expiringSoon, false);
        assert.equal(r.daysLeft, 8);
    });

    test('sem acesso não existe aviso de vencimento', () => {
        const r = resolveLicenseState({ expires_at: inDays(2), payment_status: 'pending', now: NOW });
        assert.equal(r.expiringSoon, false);
    });

    test('expirado devolve daysLeft negativo (painel pode mostrar "há X dias")', () => {
        const r = resolveLicenseState({ expires_at: PAST, payment_status: 'approved', now: NOW });
        assert.equal(r.daysLeft, -5);
    });

    test('licença sem data de expiração devolve daysLeft null', () => {
        const r = resolveLicenseState({ payment_status: 'approved', now: NOW });
        assert.equal(r.daysLeft, null);
        assert.equal(r.expiringSoon, false);
    });

    test('meio dia restante arredonda para 1 (não mostra "faltam 0 dias")', () => {
        const r = resolveLicenseState({ expires_at: new Date(NOW + 43_200_000).toISOString(), payment_status: 'approved', now: NOW });
        assert.equal(r.daysLeft, 1);
    });
});

describe('resolveLicenseState — tolerância de caixa/espaços', () => {
    test('status com espaços e caixa diferente funcionam igual', () => {
        const a = resolveLicenseState({ expires_at: FUTURE, payment_status: 'APPROVED', subscription_status: 'active', now: NOW });
        const b = resolveLicenseState({ expires_at: FUTURE, payment_status: ' approved ', subscription_status: 'Active', now: NOW });
        assert.equal(a.state, 'ATIVA');
        assert.deepEqual(a, b);
    });
});

describe('isLicenseActive / isLicenseExpired', () => {
    test('revogada fica inativa mesmo com expiração futura', () => {
        assert.equal(isLicenseActive({ revoked: true, expires_at: FUTURE }), false);
    });

    test('sem expires_at é tratado como sem vencimento', () => {
        assert.equal(isLicenseActive({ revoked: false, expires_at: null }), true);
        assert.equal(isLicenseExpired({ expires_at: null }), false);
    });

    test('vencida → inativa e expirada', () => {
        assert.equal(isLicenseActive({ revoked: false, expires_at: PAST }), false);
        assert.equal(isLicenseExpired({ expires_at: PAST }), true);
    });

    test('compara por timestamp absoluto (fuso horário não engana)', () => {
        const comOffset = new Date(Date.now() + 3_600_000).toISOString().replace('Z', '-03:00');
        assert.equal(isLicenseExpired({ expires_at: comOffset }), false);
    });
});

describe('billingPeriodLabel', () => {
    test('variações de anual', () => {
        for (const p of ['year', 'anual', 'annual', 'Y', ' year ']) {
            assert.equal(billingPeriodLabel(p), 'Anual', `${p} deveria ser Anual`);
        }
    });

    test('variações de mensal', () => {
        for (const p of ['month', 'mensal', 'monthly', 'm']) {
            assert.equal(billingPeriodLabel(p), 'Mensal', `${p} deveria ser Mensal`);
        }
    });

    test('ausente cai em Mensal (default conservador do produto)', () => {
        assert.equal(billingPeriodLabel(null), 'Mensal');
        assert.equal(billingPeriodLabel(undefined), 'Mensal');
        assert.equal(billingPeriodLabel(''), 'Mensal');
    });

    test('período desconhecido não é disfarçado de mensal', () => {
        assert.equal(billingPeriodLabel('week'), 'WEEK');
    });
});

describe('licenseDisplayName', () => {
    test('nome vindo do banco tem prioridade', () => {
        assert.equal(licenseDisplayName({ plan_type: 'pro', license_display_name: 'VOLTRIS PRO GAMER' }), 'VOLTRIS PRO GAMER');
    });

    test('mapeia cada plano', () => {
        assert.equal(licenseDisplayName({ plan_type: 'trial', license_display_name: null }), 'Trial');
        assert.equal(licenseDisplayName({ plan_type: 'standard', license_display_name: null }), 'VOLTRIS STANDARD');
        assert.equal(licenseDisplayName({ plan_type: 'Pro', license_display_name: null }), 'VOLTRIS PRO');
        assert.equal(licenseDisplayName({ plan_type: 'enterprise', license_display_name: null }), 'VOLTRIS ENTERPRISE');
    });

    test('plano em branco vira STANDARD em vez de quebrar o painel', () => {
        assert.equal(licenseDisplayName({ plan_type: null, license_display_name: null }), 'STANDARD');
    });
});

describe('licenseIsOwnedBy — propriedade da licença', () => {
    const session = { id: 'aaaa1111-2222-3333-4444-555566667777', email: 'cliente@exemplo.com' };

    test('user_id igual é dono', () => {
        assert.equal(licenseIsOwnedBy({ user_id: session.id, customer_email: null, email: null }, session), true);
    });

    test('user_id diferente NÃO é dono mesmo com o mesmo e-mail (UUID vence)', () => {
        assert.equal(licenseIsOwnedBy({ user_id: 'outro-uuid', customer_email: session.email, email: session.email }, session), false);
    });

    test('linha legada sem user_id é vinculada pelo e-mail (caixa indiferente)', () => {
        assert.equal(licenseIsOwnedBy({ user_id: null, customer_email: 'Cliente@Exemplo.COM', email: null }, session), true);
        assert.equal(licenseIsOwnedBy({ user_id: null, customer_email: null, email: 'cliente@exemplo.com' }, session), true);
    });

    test('sem sessão não é dono de nada', () => {
        assert.equal(licenseIsOwnedBy({ user_id: session.id, customer_email: null, email: null }, null), false);
    });

    test('licença órfã (sem dono) não é de ninguém', () => {
        assert.equal(licenseIsOwnedBy({ user_id: null, customer_email: null, email: null }, session), false);
    });
});
