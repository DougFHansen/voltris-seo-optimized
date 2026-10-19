/**
 * COMPLETUDE DO PERFIL — etapa obrigatória das contas sociais.
 *
 * O que este conjunto trava:
 *  - quais campos formam um perfil completo (a MESMA lista do cadastro);
 *  - que conta social incompleta é obrigada a completar;
 *  - que conta de e-mail e administrador NÃO são bloqueados (uma trava
 *    dessas transformaria a etapa em punição e deixaria a equipe presa);
 *  - que a página /perfil grava `login` e `neighborhood` (os dois campos
 *    que o trigger quebrado nunca gravou) e valida com as MESMAS regras do
 *    cadastro.
 */

import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
    camposFaltantes,
    rotulosFaltantes,
    perfilCompleto,
    ehContaSocial,
    precisaComplementar,
    separarEndereco,
} from '../lib/profile-completeness.ts';

const COMPLETO = {
    login: 'cliente.teste',
    full_name: 'Cliente Teste',
    phone: '(11) 99999-9999',
    address: 'Rua A, 10',
    neighborhood: 'Centro',
    city: 'São Paulo',
    state: 'SP',
    cep: '01001-000',
    is_admin: false,
};

const SOCIAL = { app_metadata: { provider: 'google', providers: ['email', 'google'] } };
const EMAIL = { app_metadata: { provider: 'email', providers: ['email'] } };

describe('campos obrigatórios do perfil', () => {
    test('perfil vazio está com todos os campos faltando', () => {
        assert.equal(camposFaltantes({}).length, 8);
        assert.equal(camposFaltantes(null).length, 8);
    });

    test('perfil completo não falta nada', () => {
        assert.deepEqual(camposFaltantes(COMPLETO), []);
        assert.equal(perfilCompleto(COMPLETO), true);
    });

    test('espaço em branco conta como campo faltando', () => {
        assert.deepEqual(camposFaltantes({ ...COMPLETO, login: '   ' }), ['login']);
        assert.deepEqual(camposFaltantes({ ...COMPLETO, neighborhood: '' }), ['neighborhood']);
    });

    test('login e bairro fazem parte da lista', () => {
        const faltando = camposFaltantes({ ...COMPLETO, login: null, neighborhood: null });
        assert.ok(faltando.includes('login'));
        assert.ok(faltando.includes('neighborhood'));
    });

    test('os rótulos são legíveis', () => {
        assert.deepEqual(rotulosFaltantes({ ...COMPLETO, phone: null }), ['WhatsApp']);
    });
});

describe('conta social', () => {
    test('google é social; e-mail puro não é', () => {
        assert.equal(ehContaSocial(SOCIAL), true);
        assert.equal(ehContaSocial(EMAIL), false);
        assert.equal(ehContaSocial({ app_metadata: {} }), false);
        assert.equal(ehContaSocial(null), false);
    });
});

describe('quem precisa completar', () => {
    test('conta social incompleta precisa completar', () => {
        assert.equal(precisaComplementar(SOCIAL, { ...COMPLETO, phone: null }), true);
        assert.equal(precisaComplementar(SOCIAL, {}), true);
    });

    test('conta social completa não precisa', () => {
        assert.equal(precisaComplementar(SOCIAL, COMPLETO), false);
    });

    test('conta de e-mail não é exigida retroativamente', () => {
        assert.equal(precisaComplementar(EMAIL, {}), false);
    });

    test('administrador não fica preso no formulário', () => {
        assert.equal(precisaComplementar(SOCIAL, { ...COMPLETO, phone: null, is_admin: true }), false);
    });

    test('sem usuário logado, nada é exigido', () => {
        assert.equal(precisaComplementar(null, {}), false);
    });
});

describe('separar endereço herdado', () => {
    test('"av vaticano, 66" vira rua e número', () => {
        assert.deepEqual(separarEndereco('av vaticano, 66'), { street: 'av vaticano', number: '66' });
    });

    test('endereço sem número mantém o texto e deixa o número vazio', () => {
        const r = separarEndereco('Rua, Número, Bairro');
        assert.equal(r.number, '');
        assert.ok(r.street.length > 0);
    });

    test('endereço vazio', () => {
        assert.deepEqual(separarEndereco(null), { street: '', number: '' });
    });
});

describe('contrato com a tela', () => {
    const perfil = readFileSync('app/perfil/page.tsx', 'utf8');
    const guard = readFileSync('components/AuthGuard.tsx', 'utf8');
    const callback = readFileSync('app/auth/callback/route.ts', 'utf8');

    test('a página /perfil usa as regras do cadastro', () => {
        assert.match(perfil, /validateLoginValue\(form\.login\)/);
        assert.match(perfil, /validateSignupStep2\(\{ fullName: form\.full_name, phone: form\.phone \}\)/);
        assert.match(perfil, /validateSignupStep3\(\{/);
    });

    test('a página /perfil grava login e bairro', () => {
        assert.match(perfil, /login: form\.login\.trim\(\)/);
        assert.match(perfil, /neighborhood: form\.neighborhood\.trim\(\)/);
    });

    test('a página /perfil detecta gravação silenciosa', () => {
        assert.match(perfil, /\.select\('id'\)\s*\.maybeSingle\(\)/);
        assert.match(perfil, /if \(!salvo\)/);
    });

    test('a página /perfil consulta a disponibilidade do usuário e do WhatsApp', () => {
        assert.match(perfil, /\/api\/v1\/auth\/check-availability/);
        assert.match(perfil, /\/api\/v1\/auth\/validate-cep/);
    });

    test('o AuthGuard leva a conta social incompleta para /perfil', () => {
        assert.match(guard, /precisaComplementar\(user, profile\)/);
        assert.match(guard, /\/perfil\?force=1&redirect=/);
        assert.match(guard, /pathname !== '\/perfil'/);
    });

    test('o callback do OAuth usa a mesma regra', () => {
        assert.match(callback, /precisaComplementar\(data\.user, profile\)/);
        assert.match(callback, /\/perfil\?force=1&completar=1&google=1&redirect=/);
    });
});
