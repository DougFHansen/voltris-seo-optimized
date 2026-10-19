/**
 * Testes do CLIENTE RESEND (missão §2 e §15).
 *
 * A lista abaixo cobre exatamente as decisões de projeto que, se regredirem,
 * quebram produção silenciosamente — e não "testam a biblioteca", que já tem
 * testes próprios. São os nossos argumentos:
 *
 *   1. Chave ausente ou inválida é detectada ANTES de qualquer chamada, não
 *      depois de um 401.
 *   2. Remetente fora do domínio verificado é rejeitado na aferição — a Resend
 *      devolveria 403/422 e a falha apareceria como problema de credencial.
 *   3. A decisão de REPETIR ou DESISTIR depende do tipo de erro (401 não
 *      melhora repetindo; 429 melhora).
 *   4. A API key nunca aparece em log, erro ou estado persistido.
 *   5. Um e-mail inválido não consome chamada da API.
 *
 * Rodar: npm test
 */

import test, { describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';

import {
    isValidEmail,
    senderHeader,
    getResendConfigStatus,
    assertResendConfigured,
    classifyResendError,
    scrubSecrets,
    sendEmail,
    ResendConfigError,
    RESEND_TIMEOUT_MS,
} from '../lib/resend-client.ts';

// O módulo lê o ambiente no import; cada teste ajusta e reavalia.
const ENV_KEYS = [
    'RESEND_API_KEY',
    'RESEND_FROM_EMAIL',
    'RESEND_FROM_NAME',
] as const;

let saved: Record<string, string | undefined> = {};

beforeEach(() => {
    saved = {};
    for (const k of ENV_KEYS) saved[k] = process.env[k];

    process.env.RESEND_API_KEY = 're_teste_abcdefghijklmnop';
    process.env.RESEND_FROM_EMAIL = 'faturas@voltris.com.br';
    process.env.RESEND_FROM_NAME = 'VOLTRIS';
});

afterEach(() => {
    for (const k of ENV_KEYS) {
        if (saved[k] === undefined) delete process.env[k];
        else process.env[k] = saved[k];
    }
});

// ===========================================================================
// Validação de destinatário — antes de gastar chamada da API
// ===========================================================================

describe('isValidEmail — filtro antes da chamada da API', () => {
    test('aceita endereços normais', () => {
        assert.equal(isValidEmail('cliente@voltris.com.br'), true);
        assert.equal(isValidEmail('douglas.felipe+tag@gmail.com'), true);
    });

    test('normaliza espaços nas pontas', () => {
        assert.equal(isValidEmail('  cliente@voltris.com.br  '), true);
    });

    test('rejeita formato inexistente', () => {
        assert.equal(isValidEmail('sem-arroba'), false);
        assert.equal(isValidEmail('@voltris.com.br'), false);
        assert.equal(isValidEmail('cliente@'), false);
        assert.equal(isValidEmail('cliente@voltris'), false);   // sem TLD
        assert.equal(isValidEmail('cliente@voltris.c'), false); // TLD de 1 letra
    });

    test('rejeita tipos que não são string', () => {
        assert.equal(isValidEmail(null), false);
        assert.equal(isValidEmail(undefined), false);
        assert.equal(isValidEmail(42), false);
        assert.equal(isValidEmail({}), false);
    });

    test('rejeita injeção de cabeçalho e separadores', () => {
        // Um destinatário com quebra de linha poderia injetar headers no
        // e-mail — a API rejeitaria, mas o filtro evita a chamada.
        assert.equal(isValidEmail('a@b.com\nC header: x'), false);
        assert.equal(isValidEmail('a@b.com, c@d.com'), false);
        assert.equal(isValidEmail('a@b.com; c@d.com'), false);
    });

    test('rejeita ponto duplo consecutivo', () => {
        assert.equal(isValidEmail('cliente..foo@voltris.com.br'), false);
    });

    test('rejeita string vazia ou só espaços', () => {
        assert.equal(isValidEmail(''), false);
        assert.equal(isValidEmail('   '), false);
    });
});

// ===========================================================================
// Configuração — validada em RUNTIME, não só no deploy
// ===========================================================================

describe('getResendConfigStatus — diagnóstico sem lançar', () => {
    test('configuração completa é válida', () => {
        const status = getResendConfigStatus();
        assert.equal(status.configured, true);
        assert.deepEqual(status.problems, []);
    });

    test('detecta chave ausente', () => {
        delete process.env.RESEND_API_KEY;
        const status = getResendConfigStatus();
        assert.equal(status.configured, false);
        assert.ok(status.problems.some((p) => p.includes('RESEND_API_KEY')));
    });

    test('detecta remetente ausente', () => {
        delete process.env.RESEND_FROM_EMAIL;
        const status = getResendConfigStatus();
        assert.equal(status.configured, false);
        assert.ok(status.problems.some((p) => p.includes('RESEND_FROM_EMAIL')));
    });

    test('detecta remetente fora do domínio verificado', () => {
        // Situação real do código antigo: naoresponda@voltris.com.br num
        // domínio que só tem um remetente verificado. A Resend devolveria
        // 422; aqui é pego antes.
        process.env.RESEND_FROM_EMAIL = 'nao-autorizado@outrodominio.com';
        const status = getResendConfigStatus();
        assert.equal(status.configured, false);
        assert.ok(status.problems.some((p) => p.includes('domínio verificado')));
    });

    test('detecta remetente em formato inválido', () => {
        process.env.RESEND_FROM_EMAIL = 'nao-e-email';
        const status = getResendConfigStatus();
        assert.equal(status.configured, false);
        assert.ok(status.problems.some((p) => p.includes('inválido')));
    });
});

describe('assertResendConfigured — falha controlada, não undefined silencioso', () => {
    test('lança ResendConfigError quando falta a chave', () => {
        delete process.env.RESEND_API_KEY;
        assert.throws(() => assertResendConfigured(), ResendConfigError);
    });

    test('não lança quando está tudo certo', () => {
        assert.doesNotThrow(() => assertResendConfigured());
    });
});

describe('senderHeader — formato exigido pela Resend', () => {
    test('monta "Nome <email>"', () => {
        assert.equal(senderHeader(), 'VOLTRIS <faturas@voltris.com.br>');
    });

    test('usa VOLTRIS como nome padrão quando o nome não foi definido', () => {
        delete process.env.RESEND_FROM_NAME;
        assert.equal(senderHeader(), 'VOLTRIS <faturas@voltris.com.br>');
    });

    test('lança quando não há remetente', () => {
        delete process.env.RESEND_FROM_EMAIL;
        assert.throws(() => senderHeader(), /RESEND_FROM_EMAIL ausente/);
    });
});

// ===========================================================================
// Classificação de erro — a decisão de repetir depende do tipo
// ===========================================================================

describe('classifyResendError — o que é transitório e o que não é', () => {
    test('401 (credencial) NÃO é repetível', () => {
        const r = classifyResendError({ statusCode: 401, message: 'invalid api key' });
        assert.equal(r.kind, 'AUTH');
        assert.equal(r.retryable, false);
    });

    test('403 (permissão) NÃO é repetível', () => {
        const r = classifyResendError({ statusCode: 403, message: 'forbidden' });
        assert.equal(r.kind, 'AUTH');
        assert.equal(r.retryable, false);
    });

    test('422 (remetente/domínio) NÃO é repetível e vira SENDER', () => {
        const r = classifyResendError({ statusCode: 422, message: 'sender not authorized' });
        assert.equal(r.kind, 'SENDER');
        assert.equal(r.retryable, false);
    });

    test('429 (limite) É repetível e respeita Retry-After', () => {
        const r = classifyResendError({ statusCode: 429, message: 'rate limit', retryAfter: 120 });
        assert.equal(r.kind, 'RATE_LIMIT');
        assert.equal(r.retryable, true);
        assert.equal(r.retryAfterSec, 120);
    });

    test('429 sem Retry-After continua repetível', () => {
        const r = classifyResendError({ statusCode: 429, message: 'too many requests' });
        assert.equal(r.retryable, true);
        assert.equal(r.retryAfterSec, undefined);
    });

    test('5xx (Resend fora) É repetível', () => {
        const r = classifyResendError({ statusCode: 503, message: 'service unavailable' });
        assert.equal(r.kind, 'SERVER');
        assert.equal(r.retryable, true);
    });

    test('timeout é TRANSITÓRIO — é justamente o caso ambíguo da Resend', () => {
        const err = new Error('Resend não respondeu');
        err.name = 'TimeoutError';
        const r = classifyResendError(err);
        assert.equal(r.kind, 'TIMEOUT');
        assert.equal(r.retryable, true);
        // Sem isso, um envio aceito cuja resposta se perdeu geraria duplicata.
    });

    test('AbortError também é timeout', () => {
        const err = new Error('aborted');
        err.name = 'AbortError';
        assert.equal(classifyResendError(err).kind, 'TIMEOUT');
    });

    test('falha de rede (DNS/TLS) é transitória', () => {
        const r = classifyResendError(new Error('fetch failed: getaddrinfo ENOTFOUND api.resend.com'));
        assert.equal(r.kind, 'NETWORK');
        assert.equal(r.retryable, true);
    });

    test('erro de configuração é conhecido e NÃO repetível', () => {
        const r = classifyResendError(new ResendConfigError('RESEND_API_KEY ausente.'));
        assert.equal(r.kind, 'CONFIG');
        assert.equal(r.retryable, false);
    });

    test('erro desconhecido é repetível (falha aberta, melhor repetir)', () => {
        const r = classifyResendError(new Error('algo estranho'));
        assert.equal(r.kind, 'UNKNOWN');
        assert.equal(r.retryable, true);
    });
});

// ===========================================================================
// Segredos — o requisito mais fácil de violar sem querer
// ===========================================================================

describe('scrubSecrets — a API key jamais vaza', () => {
    test('remove a chave exata quando ela vem embutida na mensagem', () => {
        const key = process.env.RESEND_API_KEY!;
        const msg = `falha ao autenticar com ${key} no endpoint`;
        const out = scrubSecrets(msg);
        assert.equal(out.includes(key), false);
        assert.ok(out.includes('[REDACTED]'));
    });

    test('remove chaves re_ mesmo sem a chave atual no ambiente', () => {
        // Cenário real: o log foi gerado em outro deploy, com outra chave.
        const out = scrubSecrets('erro usando re_abcdefghij1234567890');
        assert.equal(out.includes('re_abcdefghij'), false);
        assert.ok(out.includes('[REDACTED]'));
    });

    test('a classificação também limpa o segredo', () => {
        const key = process.env.RESEND_API_KEY!;
        const r = classifyResendError({ statusCode: 401, message: `chave ${key} rejeitada` });
        assert.equal(r.message.includes(key), false);
    });

    test('limita o tamanho da mensagem persistida no banco', () => {
        const out = scrubSecrets('x'.repeat(5_000));
        assert.ok(out.length <= 500, `esperado <= 500, veio ${out.length}`);
    });
});

// ===========================================================================
// Envio — guarantees observáveis sem tocar a rede
// ===========================================================================

describe('sendEmail — garantias que independem da API', () => {
    test('destinatário inválido NÃO chega a chamar a API', async () => {
        const r = await sendEmail({
            to: 'nao-e-email',
            subject: 'teste',
            html: '<p>teste</p>',
        });
        assert.equal(r.ok, false);
        assert.equal(r.error?.kind, 'VALIDATION');
        // A mensagem diz explicitamente que o envio foi cancelado antes da
        // chamada — quem ler o log sabe que não houve tentativa na Resend.
        assert.ok(r.error!.message.includes('antes de chamar a API'));
    });

    test('configuração ausente devolve CONFIG, sem exceção e sem chamada', async () => {
        delete process.env.RESEND_API_KEY;
        const r = await sendEmail({
            to: 'cliente@voltris.com.br',
            subject: 'teste',
            html: '<p>teste</p>',
        });
        assert.equal(r.ok, false);
        assert.equal(r.error?.kind, 'CONFIG');
        assert.equal(r.error?.retryable, false);
    });

    test('nunca lança: devolve estrutura mesmo em falha', async () => {
        // A configuração é quebrada de propósito (remetente fora do domínio
        // verificado) para que a falha aconteça ANTES de qualquer chamada de
        // rede. Sem isso o teste sairia para api.resend.com com uma chave falsa
        // e o resultado dependeria de internet.
        process.env.RESEND_FROM_EMAIL = 'nao-autorizado@outrodominio.com';

        const r = await sendEmail({
            to: 'cliente@voltris.com.br',
            subject: 'x',
            html: 'x',
        });

        assert.equal(typeof r, 'object');
        assert.equal(r.ok, false);
        assert.equal(r.providerMessageId, null);
        assert.equal(r.error?.retryable, false, 'remetente não autorizado não adianta repetir');
    });

    test('o timeout está configurado dentro de um limite seguro', () => {
        // Acima de ~15 s a função serverless do plano padrão da Vercel já
        // estaria em risco; abaixo de 2 s a Resend não teria tempo de responder.
        assert.ok(RESEND_TIMEOUT_MS >= 2_000, 'timeout curto demais');
        assert.ok(RESEND_TIMEOUT_MS <= 15_000, 'timeout longo demais para a Vercel');
    });
});
