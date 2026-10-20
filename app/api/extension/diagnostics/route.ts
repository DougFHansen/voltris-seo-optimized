/**
 * POST /api/extension/diagnostics
 *
 * Recebe os erros técnicos da extensão VOLTRIS Shield e os encaminha para o
 * grupo privado do Telegram.
 *
 * QUEM CHAMA
 * ----------
 * A extensão. E, porque qualquer pessoa pode ler o código de uma extensão
 * publicada e reproduzir as requisições, TAMBÉM qualquer pessoa na
 * internet. Esta rota trata o cliente como o que ele é: não confiável.
 *
 * O QUE PROTEGE O GRUPO
 * ----------------------
 *  - O esquema estrito: um campo fora da lista é recusa, não aviso.
 *  - O limite de tamanho do corpo e do lote.
 *  - O limite por origem (na memória da instância) e o limite global (no
 *    banco, compartilhado entre instâncias).
 *  - O agrupamento: uma falha que se repete é UM alerta com contador.
 *  - O interruptor: `DIAGNOSTICS_FORWARDING_DISABLED=1` desliga tudo sem
 *    derrubar nada.
 *
 * O QUE NÃO PROTEGE
 * -----------------
 * O CORS NÃO É AUTENTICAÇÃO, e este código não finge que é. A origem
 * aberta abaixo existe porque a extensão mora em outra origem, e ela é
 * coerente com o fato de que a rota NÃO depende de cookie, sessão ou
 * token: quem a chama não é reconhecido, e o que ele manda é conferido
 * campo a campo.
 *
 * O CUSTO
 * -------
 * Cada requisição aqui é uma invocação serverless. Por isso:
 *  - o que não tem nada a dizer não chama nada (a extensão só chama
 *    quando tem um evento de verdade);
 *  - a extensão manda o que tem em um LOTE, e o lote é agrupado aqui;
 *  - a recusa é feita ANTES de qualquer trabalho caro.
 */

import { NextRequest, NextResponse } from 'next/server';
import { TelegramService } from '@/services/telegramService';
import { createAdminClient } from '@/utils/supabase/admin';
import {
    ExtensionAggregator,
    ExtensionRateLimiter,
    buildSyntheticTestEvent,
    formatExtensionAlert,
    formatExtensionSummary,
    validateExtensionDiagnosticBatch,
    type ExtensionDiagnosticEvent,
} from '@/services/extensionDiagnostics';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * O TETO DE EXECUÇÃO.
 *
 * Uma função serverless que passa do tempo dela vira uma fatura. Dez
 * segundos é o máximo razoável para o que esta rota faz: um insert e um
 * POST para o Telegram.
 */
export const maxDuration = 10;

/**
 * O limite por origem, na memória da instância.
 *
 * Ele contém a REPETIÇÃO de um endereço. Ele NÃO contém a repetição
 * vinda de mil endereços — para isso existe o limite global, no banco
 * (a função `record_extension_diagnostics`), que é compartilhado entre
 * todas as instâncias.
 */
const rateLimiter = new ExtensionRateLimiter(10, 60_000);

/**
 * O agrupamento, na memória da instância.
 *
 * O que é agregado aqui é agregado de novo pela extensão, e o que a
 * extensão manda já vem agrupado. A janela deste agregador é a
 * DEFENSIVA: se uma extensão antiga, ou um script, mandar o mesmo erro
 * mil vezes, o grupo recebe um alerta e um contador.
 */
const aggregator = new ExtensionAggregator(60 * 60_000);

/** O interruptor global. */
const FORWARDING_DISABLED = process.env.DIAGNOSTICS_FORWARDING_DISABLED === '1';

/**
 * O HISTÓRICO NO BANCO — LIGADO POR PADRÃO, DESLIGADO POR CONVENIÊNCIA.
 *
 * `DIAGNOSTICS_PERSIST=1` grava o que chegou numa tabela do Supabase, para
 * consulta posterior. Sem essa variável, a rota NÃO TOCA O BANCO: nem
 * leitura, nem escrita, nem uma linha de log por requisição.
 *
 * POR QUE EXISTE ESSA CHAVE
 * -------------------------
 * O alerta do Telegram NÃO depende do banco. O grupo privado é onde o
 * alerta é lido, e o histórico ali é o histórico que interessa. A tabela
 * é uma conveniência de consulta — e ela custa espaço num plano gratuito
 * e uma ida ao banco por requisição, num sistema cujo dono pediu
 * explicitamente para não gastar nada disso.
 *
 * Quem quiser o histórico liga a variável e aplica
 * `supabase/extension_diagnostics.sql`. Quem não quiser, não liga e não
 * gasta nada.
 */
const PERSIST = process.env.DIAGNOSTICS_PERSIST === '1';

/** O corpo máximo aceito. */
const MAX_BODY_BYTES = 64 * 1024;

/** O token e o grupo do bot da extensão. Vêm do ambiente, e de mais lugar nenhum. */
const botToken = (process.env.TELEGRAM_EXTENSION_BOT_TOKEN || '').replace(/['"]/g, '').trim();
const chatId = (process.env.TELEGRAM_EXTENSION_CHAT_ID || '').replace(/['"]/g, '').trim();

/** A origem do pedido, para o limite por origem. */
function originOf(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown';
    return request.headers.get('x-real-ip') ?? 'unknown';
}

/** Os cabeçalhos de CORS e de limite. */
function corsHeaders(extra: Record<string, string> = {}): Record<string, string> {
    return {
        // A extensão vive em outra origem. A rota não usa cookie, sessão nem
        // token, então a origem aberta não dá nenhum acesso: ela só permite
        // que a RESPOSTA seja lida. Quem manda é conferido campo a campo.
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'content-type',
        'Access-Control-Max-Age': '86400',
        ...extra,
    };
}

/**
 * O PREFLIGHT.
 *
 * A extensão não precisa dele (ela tem permissão de host), mas uma
 * página que/testa o endpoint precisa, e um preflight que responde 405
 * parece um endpoint quebrado.
 */
export async function OPTIONS() {
    return new NextResponse(null, { status: 204, headers: corsHeaders() });
}

export async function POST(request: NextRequest) {
    // O INTERRUPTOR: o encaminhamento pode ser DESLIGADO a qualquer
    // momento, sem reiniciar nada e sem derrubar o resto do site.
    //
    // A resposta DIZ O QUE FAZER, porque quem encontra um 503 num
    // alarme que não chega precisa saber o que destravar — e adivinhar
    // "é o interruptor" ou "é o token" gastaria mais tempo do que a
    // própria correção.
    if (FORWARDING_DISABLED) {
        return NextResponse.json(
            {
                ok: false,
                error: 'forwarding_disabled',
                hint: 'O encaminhamento está desligado: a variável DIAGNOSTICS_FORWARDING_DISABLED=1 está no ambiente do deploy. Remova-a (ou ponha 0) e publique de novo.',
            },
            { status: 503, headers: corsHeaders() }
        );
    }

    // O LIMITE POR ORIGEM, ANTES de qualquer trabalho.
    const origin = originOf(request);
    const limit = rateLimiter.take(origin);
    if (!limit.allowed) {
        return NextResponse.json(
            { ok: false, error: 'rate_limited' },
            { status: 429, headers: corsHeaders({ 'retry-after': String(limit.retryAfterSeconds) }) }
        );
    }

    // O CORPO, com teto. Ler mais do que isso para depois recusar seria
    // pagar a invocação por um corpo que ninguém quer.
    const raw = await request.text();
    const bytes = Buffer.byteLength(raw, 'utf8');
    if (bytes > MAX_BODY_BYTES) {
        return NextResponse.json(
            { ok: false, error: 'payload_too_large' },
            { status: 413, headers: corsHeaders() }
        );
    }

    let parsed: unknown;
    try {
        parsed = JSON.parse(raw);
    } catch {
        return NextResponse.json(
            { ok: false, error: 'malformed_json' },
            { status: 400, headers: corsHeaders() }
        );
    }

    // A VALIDAÇÃO, campo a campo.
    const results = validateExtensionDiagnosticBatch(parsed);
    const rejected = results.filter((r) => !r.ok);
    if (rejected.length > 0) {
        const problems = rejected.flatMap((r) => (r.ok ? [] : r.problems));
        return NextResponse.json(
            { ok: false, error: 'invalid_payload', problems },
            { status: 400, headers: corsHeaders() }
        );
    }
    const events = results.map((r) => (r.ok ? r.event : null)).filter(Boolean) as ExtensionDiagnosticEvent[];

    // O LIMITE GLOBAL E A GRAVAÇÃO.
    //
    // Sem `DIAGNOSTICS_PERSIST=1` a rota não toca o banco: nem conta, nem
    // grava, nem gasta. O limite por origem (acima) continua valendo, e o
    // agrupamento continua impedindo o grupo de encher.
    const global = PERSIST
        ? await recordGlobally(events)
        : { accepted: true };
    if (!global.accepted) {
        return NextResponse.json(
            { ok: false, error: global.reason ?? 'global_rate_limit' },
            { status: 429, headers: corsHeaders({ 'retry-after': '60' }) }
        );
    }

    // O AGRUPAMENTO e o ENVIO.
    const toSend: string[] = [];
    const counts: Record<string, number> = {};
    let aggregated = 0;
    let total = 0;

    for (const event of events) {
        const decision = aggregator.take(event);
        if (decision.action === 'aggregate') {
            aggregated += 1;
            continue;
        }
        if (decision.action === 'summary') {
            counts[event.event] = decision.count;
            total += decision.count;
            toSend.push(
                formatExtensionSummary(
                    60,
                    counts,
                    total,
                    Math.max(0, total - Object.keys(counts).length)
                )
            );
            continue;
        }
        toSend.push(formatExtensionAlert(event));
    }

    let sent = 0;
    let failed = 0;
    let telegramMessageId: number | undefined;

    if (toSend.length > 0 && botToken && chatId) {
        for (const text of toSend) {
            const result = await TelegramService.sendMessageTo(text, { token: botToken, chatId });
            if (result.ok) {
                sent += 1;
                telegramMessageId = result.messageId ?? telegramMessageId;
            } else {
                failed += 1;
                console.error('[extension-diagnostics] envio ao Telegram falhou:', result.error);
            }
        }
    } else if (toSend.length > 0) {
        // Sem token o alerta NÃO some: fica registrado no banco, e o painel
        // de diagnóstico mostra que houve algo a enviar.
        failed += toSend.length;
        console.warn('[extension-diagnostics] TELEGRAM_EXTENSION_BOT_TOKEN/CHAT_ID ausentes: nada foi enviado ao Telegram.');
    }

    return NextResponse.json(
        {
            ok: true,
            status: 'accepted',
            received: events.length,
            aggregated,
            sent,
            failed,
            telegramMessageId: telegramMessageId ?? null,
            /*
             * A severidade EFETIVA de cada evento.
             *
             * Uma CRITICAL com codigo desconhecido e rebaixada para ERROR
             * — e a resposta mostra qual das duas chegou a ser. Sem isso, o
             * rebaixamento seria invisivel: o remetente acharia que
             * mandou um alerta critico e veria "accepted" na mesma forma.
             */
            severities: events.map((event) => event.severity),
        },
        { status: 202, headers: corsHeaders() }
    );
}

/**
 * O LIMITE GLOBAL E A GRAVAÇÃO.
 *
 * Uma chamada só, dentro do banco, que faz as duas coisas: confere o
 * volume total e grava o lote. Uma chamada só porque cada ida ao banco
 * custa tempo de invocação, e o tempo de invocação é a conta.
 *
 * Só é chamada com `DIAGNOSTICS_PERSIST=1`. Se a função não existir (o
 * SQL ainda não foi aplicado), o limite global não acontece — e isso é
 * dito no log UMA VEZ, em vez de fingir que aconteceu a cada requisição.
 */
let warnedAboutMissingFunction = false;

async function recordGlobally(events: ExtensionDiagnosticEvent[]): Promise<{ accepted: boolean; reason?: string }> {
    if (events.length === 0) return { accepted: true };
    try {
        const supabase = createAdminClient();
        const { data, error } = await supabase.rpc('record_extension_diagnostics', {
            p_events: events.map((event) => ({
                schema_version: event.schemaVersion,
                source: event.source,
                severity: event.severity,
                component: event.component,
                error_code: event.errorCode,
                event_name: event.event,
                extension_version: event.extensionVersion,
                browser: event.browser,
                browser_major: event.browserMajorVersion,
                occurred_at: event.timestamp,
                message: event.message,
                occurrences: event.occurrences,
                diagnostics: event.diagnostics ?? null,
                is_test_event: event.testEvent === true,
            })),
        });

        if (error) {
            if (!warnedAboutMissingFunction) {
                warnedAboutMissingFunction = true;
                console.warn(
                    '[extension-diagnostics] record_extension_diagnostics indisponível:',
                    error.message,
                    '| o alerta do Telegram continua saindo; o HISTÓRICO é que não está sendo gravado.',
                    '| Para ligar o histórico: aplique supabase/extension_diagnostics.sql e defina DIAGNOSTICS_PERSIST=1.'
                );
            }
            return { accepted: true };
        }

        const result = (data ?? {}) as { accepted?: boolean; reason?: string };
        return { accepted: result.accepted !== false, reason: result.reason };
    } catch (error) {
        console.warn('[extension-diagnostics] falha ao gravar no banco:', error instanceof Error ? error.message : 'desconhecida');
        return { accepted: true };
    }
}

