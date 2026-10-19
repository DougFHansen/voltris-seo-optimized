/**
 * CADASTRO — TODOS OS CAMPOS SÃO OBRIGATÓRIOS.
 *
 * O pedido era explícito: "se não colocar, não deve prosseguir com o cadastro".
 * Antes, `neighborhood` (bairro) passava direto e o CEP manual era impossível.
 * Estes testes exercitam as regras puras que a tela usa nos três passos.
 *
 * O último bloco é um contrato estático: garante que a tela realmente chama as
 * regras (e não só as importa), que o modal mostra os campos que antes ficavam
 * escondidos e que a correção do trigger está no admin.sql.
 */

import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
    validateSignupStep1,
    validateSignupStep2,
    validateSignupStep3,
    validateBrazilianPhone,
    isValidEmail,
} from '../lib/signup-rules.ts';

const passo1 = {
    login: 'cliente.teste',
    email: 'cliente@example.com',
    password: 'SenhaForte1!',
    passwordStrength: 4,
};

const passo2 = {
    fullName: 'Cliente Teste',
    phone: '(11) 99999-9999',
};

const passo3 = {
    cep: '01001-000',
    street: 'Praça da Sé',
    number: '1',
    neighborhood: 'Sé',
    city: 'São Paulo',
    state: 'SP',
    cepValid: true,
    manualAddress: false,
};

describe('passo 1 — usuário, e-mail e senha', () => {
    test('cadastro completo passa', () => {
        assert.equal(validateSignupStep1(passo1), null);
    });

    test('usuário vazio não passa', () => {
        assert.match(validateSignupStep1({ ...passo1, login: '   ' }) ?? '', /Usuário/);
    });

    test('usuário com espaço não passa', () => {
        assert.match(validateSignupStep1({ ...passo1, login: 'cliente teste' }) ?? '', /sem espaços/);
    });

    test('usuário curto não passa', () => {
        assert.match(validateSignupStep1({ ...passo1, login: 'ab' }) ?? '', /3 e 30/);
    });

    test('e-mail vazio ou inválido não passa', () => {
        assert.match(validateSignupStep1({ ...passo1, email: '' }) ?? '', /E-mail/);
        assert.match(validateSignupStep1({ ...passo1, email: 'sem-arroba' }) ?? '', /Formato de e-mail/);
    });

    test('senha fraca não passa', () => {
        assert.match(validateSignupStep1({ ...passo1, password: '1234567' }) ?? '', /8 caracteres/);
        assert.match(validateSignupStep1({ ...passo1, passwordStrength: 1 }) ?? '', /fraca/);
    });
});

describe('passo 2 — nome completo e WhatsApp', () => {
    test('cadastro completo passa', () => {
        assert.equal(validateSignupStep2(passo2), null);
    });

    test('nome vazio não passa', () => {
        assert.match(validateSignupStep2({ ...passo2, fullName: '  ' }) ?? '', /Nome Completo/);
    });

    test('telefone vazio não passa', () => {
        assert.match(validateSignupStep2({ ...passo2, phone: '' }) ?? '', /WhatsApp/);
    });

    test('telefone com DDD inexistente não passa', () => {
        assert.equal(validateBrazilianPhone('(00) 99999-9999'), false);
        assert.match(validateSignupStep2({ ...passo2, phone: '(00) 99999-9999' }) ?? '', /inválido/);
    });
});

describe('passo 3 — endereço completo', () => {
    test('endereço completo passa', () => {
        assert.equal(validateSignupStep3(passo3), null);
    });

    test('CEP sem 8 dígitos não passa', () => {
        assert.match(validateSignupStep3({ ...passo3, cep: '1234' }) ?? '', /8 dígitos/);
    });

    test('CEP não confirmado pelo ViaCEP não passa sem opção manual', () => {
        assert.match(
            validateSignupStep3({ ...passo3, cepValid: false }) ?? '',
            /digite o endereço manualmente/
        );
    });

    test('endereço digitado manualmente passa (corrige o botão "Corrigir CEP")', () => {
        assert.equal(
            validateSignupStep3({ ...passo3, cepValid: false, manualAddress: true }),
            null
        );
    });

    test('bairro é obrigatório', () => {
        assert.match(validateSignupStep3({ ...passo3, neighborhood: '' }) ?? '', /Bairro/);
    });

    test('rua, número, cidade e UF são obrigatórios', () => {
        assert.match(validateSignupStep3({ ...passo3, street: '' }) ?? '', /Rua/);
        assert.match(validateSignupStep3({ ...passo3, number: '' }) ?? '', /Número/);
        assert.match(validateSignupStep3({ ...passo3, city: '' }) ?? '', /Cidade/);
        assert.match(validateSignupStep3({ ...passo3, state: 'S' }) ?? '', /UF/);
    });
});

describe('utilitários', () => {
    test('e-mail válido', () => {
        assert.equal(isValidEmail('a@b.co'), true);
        assert.equal(isValidEmail('a@b'), false);
    });

    test('celular brasileiro válido', () => {
        assert.equal(validateBrazilianPhone('(31) 99812-7122'), true);
        assert.equal(validateBrazilianPhone('(31) 8812-7122'), false);
    });
});

describe('contrato da tela, do modal e do admin.sql', () => {
    const tela = readFileSync('app/login/page.tsx', 'utf8');
    const modal = readFileSync('app/restricted-area-admin/clients/AdminClientsTab.tsx', 'utf8');
    const sql = readFileSync('admin.sql', 'utf8');

    test('a tela revalida os três passos antes de criar a conta', () => {
        assert.match(tela, /validateSignupStep1\(\{ login, email, password, passwordStrength \}\)/);
        assert.match(tela, /validateSignupStep2\(\{ fullName, phone \}\)/);
        assert.match(tela, /validateSignupStep3\(\{/);
    });

    test('a tela grava login e bairro no perfil logo após criar a conta', () => {
        assert.match(tela, /login: login\.trim\(\)/);
        assert.match(tela, /neighborhood: neighborhood\.trim\(\)/);
        assert.match(tela, /\.from\('profiles'\)[\s\S]{0,120}\.update\(dadosPerfil\)/);
    });

    test('o modal mostra endereço, bairro e CEP (antes nem eram renderizados)', () => {
        assert.match(modal, /label="Endereço"/);
        assert.match(modal, /label="Bairro"/);
        assert.match(modal, /label="CEP"/);
        assert.match(modal, /label="Login"/);
        assert.match(modal, /label="Telefone"/);
    });

    test('o admin.sql recria handle_new_user com todos os campos', () => {
        const bloco = /CREATE OR REPLACE FUNCTION public\.handle_new_user\(\)([\s\S]*?)END;\s*\$\$;/.exec(sql)?.[1] ?? '';
        assert.ok(bloco.length > 200, 'não achei a função handle_new_user no admin.sql');
        for (const campo of [
            'login', 'email', 'full_name', 'phone', 'address',
            'city', 'neighborhood', 'state', 'cep',
        ]) {
            assert.match(bloco, new RegExp(`\\b${campo}\\b`), `admin.sql não grava ${campo}`);
        }
        assert.match(bloco, /NEW\.raw_user_meta_data->>'neighborhood'/);
        assert.match(bloco, /ON CONFLICT \(id\) DO NOTHING/);
    });
});
