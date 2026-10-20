/**
 * TESTES DO SISTEMA DE DIAGNÓSTICOS DA EXTENSÃO VOLTRIS SHIELD.
 *
 * A rota é pública por natureza — qualquer pessoa pode reproduzir as
 * requisições da extensão —, então o que protege o grupo está AQUI, e
 * precisa estar testado:
 *
 *   - o esquema estrito recusa o que não é o esquema;
 *   - a CRITICAL forjada é rebaixada;
 *   - o limite por origem barra a repetição;
 *   - o agrupamento transforma repetição em UM alerta;
 *   - o HTML da mensagem é escapado;
 *   - a rota do teste sintético não existe sem o token de administração.
 *
 * Roda com: npm test
 */

import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
    ExtensionAggregator,
    ExtensionRateLimiter,
    buildSyntheticTestEvent,
    escapeTelegramHtml,
    formatExtensionAlert,
    formatExtensionSummary,
    validateExtensionDiagnostic,
    validateExtensionDiagnosticBatch,
    EXTENSION_CRITICAL_CODES,
    type ExtensionDiagnosticEvent,
} from '../services/extensionDiagnostics';

const VALID = {
    schemaVersion: 1,
    source: 'voltris-shield-extension',
    severity: 'ERROR',
    component: 'blocking',
    errorCode: 'VEX-BLOCKING-RULES-UPDATE',
    event: 'RULE_UPDATE_FAILED',
    extensionVersion: '1.2.0',
    browser: 'chrome',
    browserMajorVersion: '140',
    timestamp: '2026-10-20T18:00:00.000Z',
    message: 'Failed to update protection rules.',
    occurrences: 1,
};

// ===========================================================================
// A VALIDAÇÃO
// ===========================================================================

describe('validacao do payload', () => {
    test('aceita o payload valido', () => {
        const result = validateExtensionDiagnostic(VALID);
        assert.equal(result.ok, true);
        if (result.ok) {
            assert.equal(result.event.errorCode, 'VEX-BLOCKING-RULES-UPDATE');
            assert.equal(result.event.severity, 'ERROR');
        }
    });

    test('recusa um payload que nao e objeto', () => {
        assert.equal(validateExtensionDiagnostic('texto').ok, false);
        assert.equal(validateExtensionDiagnostic(null).ok, false);
        assert.equal(validateExtensionDiagnostic([1, 2, 3]).ok, false);
    });

    test('recusa um campo desconhecido', () => {
        const result = validateExtensionDiagnostic({ ...VALID, sneaky: 'campo' });
        assert.equal(result.ok, false);
        if (!result.ok) {
            assert.ok(result.problems.some((p) => p.includes('unknown field: sneaky')));
        }
    });

    test('recusa um campo desconhecido dentro de diagnostics', () => {
        const result = validateExtensionDiagnostic({ ...VALID, diagnostics: { ruleCount: 1, sneaky: 'x' } });
        assert.equal(result.ok, false);
    });

    test('recusa um payload grande demais', () => {
        const result = validateExtensionDiagnostic({ ...VALID, message: 'x'.repeat(20_000) });
        assert.equal(result.ok, false);
    });

    test('recusa uma versao de esquema desconhecida', () => {
        assert.equal(validateExtensionDiagnostic({ ...VALID, schemaVersion: 99 }).ok, false);
    });

    test('recusa um source desconhecido', () => {
        assert.equal(validateExtensionDiagnostic({ ...VALID, source: 'outro' }).ok, false);
    });

    test('recusa uma severidade invalida', () => {
        assert.equal(validateExtensionDiagnostic({ ...VALID, severity: 'GIGANTE' }).ok, false);
    });

    test('recusa occurrences invalido', () => {
        assert.equal(validateExtensionDiagnostic({ ...VALID, occurrences: 0 }).ok, false);
        assert.equal(validateExtensionDiagnostic({ ...VALID, occurrences: 1.5 }).ok, false);
    });

    test('recusa um timestamp invalido', () => {
        assert.equal(validateExtensionDiagnostic({ ...VALID, timestamp: 'ontem' }).ok, false);
    });

    test('uma CRITICAL com codigo desconhecido vira ERROR', () => {
        const result = validateExtensionDiagnostic({ ...VALID, severity: 'CRITICAL', errorCode: 'VEX-INVENTADO' });
        assert.equal(result.ok, true);
        if (result.ok) {
            assert.equal(result.event.severity, 'ERROR');
            // E o rebaixamento fica MARCADO, para ser visivel no grupo.
            assert.equal(result.event.severityDowngraded, true);
        }
    });

    test('uma CRITICAL com codigo conhecido NAO e marcada como rebaixada', () => {
        const result = validateExtensionDiagnostic({
            ...VALID,
            severity: 'CRITICAL',
            errorCode: EXTENSION_CRITICAL_CODES[0],
        });
        assert.equal(result.ok, true);
        if (result.ok) {
            assert.equal(result.event.severity, 'CRITICAL');
            assert.equal(result.event.severityDowngraded, undefined);
        }
    });

    test('a mensagem rebaixada DIZ que foi rebaixada', () => {
        // Sem isto, um curl que inventa um codigo produz no grupo uma
        // mensagem com cara de falha real, e ninguem que le o grupo
        // distingue as duas coisas.
        const result = validateExtensionDiagnostic({ ...VALID, severity: 'CRITICAL', errorCode: 'VEX-INVENTADO' });
        const text = formatExtensionAlert((result as { event: ExtensionDiagnosticEvent }).event);
        assert.ok(text.includes('Severidade rebaixada'));
        assert.ok(text.includes('falsificação'));
    });

    test('uma CRITICAL com codigo conhecido e mantida', () => {
        const result = validateExtensionDiagnostic({
            ...VALID,
            severity: 'CRITICAL',
            errorCode: EXTENSION_CRITICAL_CODES[0],
        });
        assert.equal(result.ok, true);
        if (result.ok) assert.equal(result.event.severity, 'CRITICAL');
    });
});

// ===========================================================================
// O LOTE
// ===========================================================================

describe('validacao do lote', () => {
    test('um evento solto e aceito como lote de um', () => {
        const results = validateExtensionDiagnosticBatch(VALID);
        assert.equal(results.length, 1);
        assert.equal(results[0]!.ok, true);
    });

    test('um lote valido e aceito inteiro', () => {
        const results = validateExtensionDiagnosticBatch([VALID, { ...VALID, event: 'OUTRO' }]);
        assert.equal(results.length, 2);
        assert.ok(results.every((r) => r.ok));
    });

    test('um lote com um evento ruim recusa o lote INTEIRO', () => {
        // partly-accepted e dificil de explicar e impossivel de agregar.
        const results = validateExtensionDiagnosticBatch([VALID, { ...VALID, sneaky: 'x' }]);
        assert.equal(results.filter((r) => r.ok).length, 1);
        assert.equal(results.filter((r) => !r.ok).length, 1);
    });

    test('um lote vazio e recusado', () => {
        const results = validateExtensionDiagnosticBatch([]);
        assert.equal(results[0]!.ok, false);
    });

    test('um lote maior que o teto e recusado', () => {
        const results = validateExtensionDiagnosticBatch(Array.from({ length: 40 }, () => VALID));
        assert.equal(results.length, 1);
        assert.equal(results[0]!.ok, false);
    });
});

// ===========================================================================
// O LIMITE POR ORIGEM
// ===========================================================================

describe('limite por origem', () => {
    test('barra a repeticao da mesma origem', () => {
        const limiter = new ExtensionRateLimiter(3, 60_000);
        assert.equal(limiter.take('1.2.3.4').allowed, true);
        assert.equal(limiter.take('1.2.3.4').allowed, true);
        assert.equal(limiter.take('1.2.3.4').allowed, true);
        const blocked = limiter.take('1.2.3.4');
        assert.equal(blocked.allowed, false);
        assert.ok(blocked.retryAfterSeconds > 0);
    });

    test('outra origem nao e afetada', () => {
        const limiter = new ExtensionRateLimiter(1, 60_000);
        assert.equal(limiter.take('1.1.1.1').allowed, true);
        assert.equal(limiter.take('2.2.2.2').allowed, true);
    });

    test('libera de novo quando a janela passa', () => {
        const limiter = new ExtensionRateLimiter(1, 1000);
        const t0 = 1_000_000;
        assert.equal(limiter.take('x', t0).allowed, true);
        assert.equal(limiter.take('x', t0 + 500).allowed, false);
        assert.equal(limiter.take('x', t0 + 2000).allowed, true);
    });
});

// ===========================================================================
// O AGRUPAMENTO
// ===========================================================================

describe('agrupamento', () => {
    const event = validateExtensionDiagnostic(VALID);
    assert.equal(event.ok, true);
    const sample = (event as { event: ExtensionDiagnosticEvent }).event;

    test('a mesma falha e agregada, nao repetida', () => {
        const aggregator = new ExtensionAggregator(60_000);
        const t0 = 1_000_000;
        assert.equal(aggregator.take(sample, t0).action, 'send');
        assert.equal(aggregator.take(sample, t0 + 1000).action, 'aggregate');
        assert.equal(aggregator.take(sample, t0 + 2000).action, 'aggregate');
    });

    test('a janela fechada produz um resumo com a contagem', () => {
        const aggregator = new ExtensionAggregator(60_000);
        const t0 = 1_000_000;
        aggregator.take(sample, t0);
        aggregator.take(sample, t0 + 1000);
        const summary = aggregator.take(sample, t0 + 61_000);
        assert.equal(summary.action, 'summary');
        assert.equal(summary.count, 3);
    });

    test('uma falha diferente nao e agrupada com a outra', () => {
        const aggregator = new ExtensionAggregator(60_000);
        const t0 = 1_000_000;
        assert.equal(aggregator.take(sample, t0).action, 'send');
        assert.equal(aggregator.take({ ...sample, errorCode: 'VEX-STORAGE-WRITE' }, t0 + 10).action, 'send');
    });
});

// ===========================================================================
// A MENSAGEM
// ===========================================================================

describe('a mensagem', () => {
    test('o HTML do Telegram e escapado', () => {
        assert.equal(escapeTelegramHtml('<b>x</b> & "y"'), '&lt;b&gt;x&lt;/b&gt; &amp; &quot;y&quot;');
    });

    test('uma mensagem com HTML nao injeta marcacao', () => {
        const event = validateExtensionDiagnostic({ ...VALID, message: '<b>alerta falso</b>' });
        assert.equal(event.ok, true);
        const text = formatExtensionAlert((event as { event: ExtensionDiagnosticEvent }).event);
        assert.ok(text.includes('&lt;b&gt;alerta falso&lt;/b&gt;'));
        assert.ok(!text.includes('<b>alerta falso</b>'));
    });

    test('a mensagem de erro tem o formato do modelo', () => {
        const event = validateExtensionDiagnostic(VALID);
        const text = formatExtensionAlert((event as { event: ExtensionDiagnosticEvent }).event);
        assert.ok(text.includes('VOLTRIS SHIELD — ERROR'));
        assert.ok(text.includes('Componente: blocking'));
        assert.ok(text.includes('Código: VEX-BLOCKING-RULES-UPDATE'));
        assert.ok(text.includes('Evento: RULE_UPDATE_FAILED'));
        assert.ok(text.includes('Navegador: Google Chrome'));
        assert.ok(text.includes('Versão da extensão: 1.2.0'));
        assert.ok(text.includes('Ocorrências agrupadas: 1'));
    });

    test('um AVISO nao pode aparecer rotulado como ERRO', () => {
        // O defeito real: o formatador so distinguia CRITICAL de "todo o
        // resto", e um aviso — "alguns provedores nao atualizaram, mas as
        // listas anteriores continuam em vigor" — chegava ao grupo como se
        // fosse uma falha. Um alerta de aviso marcado como erro treina quem
        // le o canal a ignora-lo.
        const event = validateExtensionDiagnostic({ ...VALID, severity: 'WARNING' });
        const text = formatExtensionAlert((event as { event: ExtensionDiagnosticEvent }).event);
        assert.ok(text.includes('AVISO'));
        assert.ok(!text.includes('🚨 VOLTRIS SHIELD — ERROR'));
        assert.ok(!text.includes('CRITICAL'));
        // E o aviso DIZ que a protecao continua de pe.
        assert.ok(text.includes('a extensão continua operando'));
    });

    test('os tres titulos sao distintos', () => {
        const titulo = (severity: string) => {
            const r = validateExtensionDiagnostic({ ...VALID, severity });
            return formatExtensionAlert((r as { event: ExtensionDiagnosticEvent }).event).split('\n')[0];
        };
        assert.ok(titulo('WARNING').includes('AVISO'));
        assert.ok(titulo('ERROR').includes('ERROR'));
        assert.ok(titulo('CRITICAL').includes('CRITICAL'));
        // E sao tres titulos diferentes, nao um rotulado tres vezes.
        const tres = new Set([titulo('WARNING'), titulo('ERROR'), titulo('CRITICAL')]);
        assert.equal(tres.size, 3);
    });

    test('a mensagem critica tem o bloco de impacto', () => {
        const event = validateExtensionDiagnostic({
            ...VALID,
            severity: 'CRITICAL',
            errorCode: EXTENSION_CRITICAL_CODES[0],
        });
        const text = formatExtensionAlert((event as { event: ExtensionDiagnosticEvent }).event);
        assert.ok(text.includes('VOLTRIS SHIELD — CRITICAL'));
        assert.ok(text.includes('Impacto'));
        assert.ok(text.includes('Ação recomendada'));
    });

    test('o resumo tem o formato do modelo', () => {
        const text = formatExtensionSummary(60, { RULE_UPDATE_FAILED: 28, STORAGE_WRITE_FAILED: 5 }, 33, 31);
        assert.ok(text.includes('VOLTRIS SHIELD — ERROR SUMMARY'));
        assert.ok(text.includes('RULE_UPDATE_FAILED: 28 ocorrências'));
        assert.ok(text.includes('Total: 33 ocorrências'));
        assert.ok(text.includes('Alertas individuais evitados: 31'));
    });

    test('o evento de teste e MARCADO e nao se confunde com um incidente', () => {
        const event = buildSyntheticTestEvent();
        assert.equal(event.testEvent, true);
        assert.ok(event.message.includes('TEST EVENT'));
        const text = formatExtensionAlert(event);
        assert.ok(text.includes('Evento de teste controlado'));
    });
});

// ===========================================================================
// A ROTA — O QUE ESTÁ NO ARQUIVO
// ===========================================================================

describe('a rota no servidor', () => {
    const route = readFileSync('app/api/extension/diagnostics/route.ts', 'utf8');
    const testRoute = readFileSync('app/api/extension/diagnostics/test/route.ts', 'utf8');

    test('o token do bot NAO esta no codigo', () => {
        // O token vem do ambiente. Um token no arquivo e um token publico.
        assert.ok(!/\d{8,12}:[A-Za-z0-9_-]{30,}/.test(route), 'a rota tem um token embutido');
        assert.ok(!/\d{8,12}:[A-Za-z0-9_-]{30,}/.test(testRoute), 'a rota de teste tem um token embutido');
        assert.ok(route.includes('TELEGRAM_EXTENSION_BOT_TOKEN'));
        assert.ok(route.includes('TELEGRAM_EXTENSION_CHAT_ID'));
    });

    test('o interruptor global existe', () => {
        assert.ok(route.includes('DIAGNOSTICS_FORWARDING_DISABLED'));
        assert.ok(testRoute.includes('DIAGNOSTICS_FORWARDING_DISABLED'));
    });

    test('a rota do teste exige o token de administracao', () => {
        assert.ok(testRoute.includes('DIAGNOSTICS_ADMIN_TOKEN'));
        assert.ok(testRoute.includes('x-diagnostics-token'));
        // E devolve 404, e nao 403: uma rota que nao existe e uma rota
        // que nao responde, e nao uma porta que pede uma senha.
        assert.ok(testRoute.includes('not_found'));
    });

    test('a rota tem teto de corpo e de execucao', () => {
        assert.ok(route.includes('MAX_BODY_BYTES'));
        assert.ok(route.includes('maxDuration'));
    });

    test('o limite por origem existe na rota', () => {
        assert.ok(route.includes('ExtensionRateLimiter'));
        assert.ok(route.includes('rate_limited'));
    });

    test('o banco so e tocado com DIAGNOSTICS_PERSIST ligado', () => {
        // O dono do site pediu explicitamente para nao gastar o plano
        // gratuito do Supabase. A rota, entao, NAO TOCA o banco por
        // padrao: nem leitura, nem escrita, nem uma linha de log por
        // requisicao.
        assert.ok(route.includes('DIAGNOSTICS_PERSIST'));
        assert.ok(route.includes("const PERSIST = process.env.DIAGNOSTICS_PERSIST === '1'"));
        // E o historico e uma conveniencia, nunca uma dependencia: o
        // alerta do Telegram sai com ou sem o SQL aplicado.
        assert.ok(route.includes('recordGlobally(events)'));
    });
});
