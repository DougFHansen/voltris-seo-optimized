/**
 * TELEFONE DUPLICADO — a trava que NÃO existia.
 *
 * Defeito medido em produção (2026-10-19): o endpoint de disponibilidade
 * comparava o telefone por TEXTO:
 *
 *     or=(phone.eq.37998127122, phone.ilike.*37998127122*)
 *
 * e o banco guarda o telefone FORMATADO ("(37) 99812-7122"). O hífen quebra
 * a sequência de dígitos, nenhuma linha era devolvida e a trava nunca
 * disparou — havia 3 contas com o mesmo WhatsApp no banco.
 *
 * Estes testes travam a correção: normalização, padrão de busca que casa com
 * a formatação, exclusão da própria conta e falha FECHADA do endpoint.
 */

import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
    digitos,
    normalizarTelefone,
    mesmoTelefone,
    padroesDeBusca,
    padraoCasaCom,
} from '../lib/phone-dup.ts';

describe('normalização de telefone', () => {
    test('só dígitos', () => {
        assert.equal(digitos('(37) 99812-7122'), '37998127122');
        assert.equal(digitos(null), '');
    });

    test('formatos diferentes do mesmo número viram o mesmo valor', () => {
        const esperado = '37998127122';
        for (const v of [
            '(37) 99812-7122',
            '37998127122',
            '37 99812 7122',
            '+55 37 99812-7122',
            '037998127122',
        ]) {
            assert.equal(normalizarTelefone(v), esperado, `falhou para ${v}`);
        }
    });

    test('DDI 55 é removido', () => {
        assert.equal(normalizarTelefone('5511996716235'), '11996716235');
        assert.equal(normalizarTelefone('+55 (11) 99671-6235'), '11996716235');
    });

    test('telefone em branco não vira número', () => {
        assert.equal(normalizarTelefone(''), '');
        assert.equal(normalizarTelefone(null), '');
    });
});

describe('mesmo telefone', () => {
    test('compara ignorando formatação', () => {
        assert.equal(mesmoTelefone('(11) 99671-6235', '11996716235'), true);
        assert.equal(mesmoTelefone('(37) 99812-7122', '11996716235'), false);
    });

    test('número vazio nunca é "mesmo" que outro', () => {
        assert.equal(mesmoTelefone('', '11996716235'), false);
        assert.equal(mesmoTelefone(null, null), false);
    });
});

describe('padrão de busca (o que conserta o bug do hífen)', () => {
    test('o filtro antigo por dígitos NÃO casa com o telefone formatado', () => {
        // A prova do defeito: é exatamente o filtro que estava no endpoint.
        const antigo = 'phone.ilike.*37998127122*';
        assert.equal(
            padraoCasaCom(antigo, '(37) 99812-7122'),
            false,
            'se este teste falhar, o defeito do hífen deixou de existir'
        );
    });

    test('o padrão novo casa com o telefone formatado', () => {
        const padroes = padroesDeBusca('(37) 99812-7122');
        const casa = padroes.some((p) => padraoCasaCom(p, '(37) 99812-7122'));
        assert.ok(casa, 'nenhum padrão gerado casa com o telefone formatado');
    });

    test('o padrão com curinga casa também com o formato só com dígitos', () => {
        const padroes = padroesDeBusca('11996716235');
        assert.ok(padroes.some((p) => padraoCasaCom(p, '(11) 99671-6235')));
        assert.ok(padroes.some((p) => padraoCasaCom(p, '11996716235')));
    });

    test('um número diferente não é puxado como candidato', () => {
        const padroes = padroesDeBusca('11999999999');
        assert.equal(padroes.some((p) => padraoCasaCom(p, '(11) 99671-6235')), false);
    });
});

describe('contrato com o endpoint e a tela', () => {
    const endpoint = readFileSync('app/api/v1/auth/check-availability/route.ts', 'utf8');
    const loginPage = readFileSync('app/login/page.tsx', 'utf8');
    const perfil = readFileSync('app/perfil/page.tsx', 'utf8');

    test('o endpoint compara o telefone normalizado', () => {
        assert.match(endpoint, /mesmoTelefone\(r\.phone, phone\)/);
        assert.ok(
            !/phone\.ilike\.%\$\{cleanPhone\}%/.test(endpoint),
            'o filtro antigo por dígitos continua no endpoint'
        );
    });

    test('o endpoint descobre o usuário pelo TOKEN (nunca pelo corpo)', () => {
        assert.match(endpoint, /resolverUsuarioDaRequisicao/);
        assert.match(endpoint, /authorization/i);
        assert.match(endpoint, /auth\.getUser\(token\)/);
    });

    test('o endpoint falha FECHADO quando não consegue verificar', () => {
        assert.match(endpoint, /status: 503/);
        assert.match(endpoint, /available: false, error: 'Não foi possível verificar/);
    });

    test('o endpoint NÃO usa getUserByEmail (método inexistente no SDK 2.50)', () => {
        // Comentários são removidos: o arquivo DOCUMENTA o defeito, mas não
        // pode CHAMAR o método.
        const semComentarios = endpoint
            .replace(/\/\*[\s\S]*?\*\//g, '')
            .split('\n')
            .map((l) => l.replace(/\/\/.*$/, ''))
            .join('\n');
        assert.ok(
            !/getUserByEmail/.test(semComentarios),
            'getUserByEmail não existe no @supabase/supabase-js 2.50: a chamada estourava e o endpoint devolvia "disponível" para tudo'
        );
        assert.match(endpoint, /listUsers/);
    });

    test('o endpoint confere o e-mail também no Authentication', () => {
        assert.match(endpoint, /donoDoEmailNoAuth/);
        assert.match(endpoint, /if \(dono && dono !== excludeId\) conflicts\.push\('e-mail'\)/);
    });

    test('o cadastro revalida e-mail, usuário e WhatsApp antes de criar a conta', () => {
        assert.match(loginPage, /\/api\/v1\/auth\/check-availability/);
        assert.match(loginPage, /email: email\.trim\(\),\s*\n\s*login: login\.trim\(\),\s*\n\s*phone: phone\.trim\(\)/);
        assert.ok(
            !/phone\.ilike\.%\$\{cleanPhone\}%/.test(loginPage),
            'a consulta direta quebrada continua no cadastro'
        );
    });

    test('a tela de perfil manda o token para não conflitar consigo mesma', () => {
        assert.match(perfil, /Authorization: `Bearer \$\{token\}`/);
        assert.match(perfil, /supabase\.auth\.getSession\(\)/);
    });
});
