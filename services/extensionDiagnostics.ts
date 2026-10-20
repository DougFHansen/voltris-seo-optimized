/**
 * DIAGNÓSTICOS DA EXTENSÃO VOLTRIS SHIELD — NÚCLEO DO SERVIDOR.
 *
 * A extensão do navegador relata as **próprias falhas** para a VOLTRIS, e a
 * VOLTRIS avisa o grupo privado do Telegram. Este arquivo é o que decide o
 * que é aceito, o que é agrupado e o que é enviado.
 *
 * O QUE NUNCA ENTRA NESTE ARQUIVO
 * -------------------------------
 *  - O token do bot. Ele vem do AMBIENTE, e este arquivo não tem como
 *    saber o valor: `TELEGRAM_EXTENSION_BOT_TOKEN`.
 *  - O chat_id do grupo. `TELEGRAM_EXTENSION_CHAT_ID`.
 *  - Qualquer credencial de usuário.
 *
 * A EXTENSÃO É UM CLIENTE NÃO CONFIÁVEL
 * --------------------------------------
 * Qualquer pessoa pode ler o código da extensão e reproduzir as requisições.
 * Isso é um FATO, e a resposta não é fingir que há um segredo: a defesa é
 * o esquema estrito, o limite de tamanho, a rejeição de campos
 * desconhecidos, o limite por origem e o interruptor global. Nenhum desses
 * mecanismos é apresentado como autenticação.
 *
 * O CUSTO
 * -------
 * Cada requisição aqui é uma invocação serverless na conta de quem
 * publica o site. Por isso o que sai é agrupado, o que entra é limitado,
 * e o que é recusado sai o mais cedo possível: uma recusa cara é ainda
 * uma invocação cara.
 */

/** O esquema aceito. Um campo fora daqui é um pedido de rejeição. */
export const EXTENSION_DIAGNOSTIC_FIELDS = Object.freeze([
    'schemaVersion',
    'source',
    'severity',
    'component',
    'errorCode',
    'event',
    'extensionVersion',
    'browser',
    'browserMajorVersion',
    'timestamp',
    'message',
    'occurrences',
    'diagnostics',
    'testEvent',
]);

/** As chaves aceitas dentro de `diagnostics`. */
export const EXTENSION_DIAGNOSTIC_KEYS = Object.freeze([
    'result',
    'reason',
    'action',
    'module',
    'category',
    'level',
    'durationMs',
    'ruleCount',
    'notInstalled',
    'droppedForQuota',
    'truncatedCategories',
    'rejectedProtectedHost',
    'compiledCount',
    'expected',
    'code',
    'httpStatus',
    'attempt',
    'backend',
    'fallback',
    'writeFailures',
    'lostRecords',
]);

/**
 * Os códigos que a extensão pode marcar como CRITICAL.
 *
 * Um cliente pode mandar `severity: "CRITICAL"` com qualquer código. Sem
 * esta lista, bastaria um `curl` para inundar o grupo com alertas críticos
 * falsos — e um grupo onde os alertas críticos são falsos deixa de ser
 * lido, o que é pior do que não ter alertas.
 */
export const EXTENSION_CRITICAL_CODES = Object.freeze([
    'VEX-BLOCKING-INSTALL-RULES',
    'VEX-BLOCKING-RULES-UPDATE',
    'VEX-WORKER-BOOT',
    'VEX-STORAGE-WRITE',
]);

export const EXTENSION_SEVERITIES = Object.freeze(['WARNING', 'ERROR', 'CRITICAL']);

/** O payload máximo aceito. */
export const EXTENSION_MAX_PAYLOAD_BYTES = 32 * 1024;

/** O tempo máximo da mensagem. */
export const EXTENSION_MAX_MESSAGE_LENGTH = 500;

/** A versão do esquema que este backend aceita. */
export const EXTENSION_SCHEMA_VERSION = 1;

export const EXTENSION_SOURCE = 'voltris-shield-extension';

/** Quantos eventos uma requisição pode trazer. */
export const EXTENSION_MAX_EVENTS_PER_REQUEST = 20;

export interface ExtensionDiagnosticEvent {
    schemaVersion: number;
    source: string;
    severity: 'WARNING' | 'ERROR' | 'CRITICAL';
    component: string;
    errorCode: string;
    event: string;
    extensionVersion: string;
    browser: string;
    browserMajorVersion: string;
    timestamp: string;
    message: string;
    occurrences: number;
    diagnostics?: Record<string, string | number | boolean>;
    testEvent?: boolean;
    /**
     * A severidade pedida foi REBAIXADA.
     *
     * Isto é interno do servidor: nunca volta para a extensão, e nunca é
     * gravado. Existe para que o rebaixamento seja VISÍVEL NO GRUPO — um
     * `curl` que inventa uma severidade crítica produz uma mensagem que
     * parece uma falha real, e alguém lendo o grupo precisa saber que
     * aquilo foi rebaixado em vez de aceito.
     */
    severityDowngraded?: boolean;
}

export type ValidationResult =
    | { ok: true; event: ExtensionDiagnosticEvent }
    | { ok: false; problems: string[] };

/**
 * A validação de UM evento.
 *
 * Devolve o evento ACEITO, ou uma lista de motivos de rejeição. A
 * distinção importa: um payload inválido é um pedido de ataque ou um
 * cliente desatualizado, e os dois merecem respostas diferentes.
 */
export function validateExtensionDiagnostic(raw: unknown): ValidationResult {
    const problems: string[] = [];

    if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
        return { ok: false, problems: ['payload is not an object'] };
    }

    const payload = raw as Record<string, unknown>;

    for (const key of Object.keys(payload)) {
        if (!EXTENSION_DIAGNOSTIC_FIELDS.includes(key)) problems.push(`unknown field: ${key}`);
    }

    if (payload.schemaVersion !== EXTENSION_SCHEMA_VERSION) {
        problems.push(`unsupported schemaVersion: ${String(payload.schemaVersion)}`);
    }
    if (payload.source !== EXTENSION_SOURCE) problems.push(`unexpected source: ${String(payload.source)}`);
    if (!EXTENSION_SEVERITIES.includes(payload.severity as string)) {
        problems.push(`invalid severity: ${String(payload.severity)}`);
    }

    for (const key of ['component', 'errorCode', 'event', 'extensionVersion', 'browser', 'browserMajorVersion', 'timestamp', 'message']) {
        const value = payload[key];
        if (typeof value !== 'string' || value.length === 0) problems.push(`missing or empty field: ${key}`);
    }
    if (typeof payload.message === 'string' && payload.message.length > EXTENSION_MAX_MESSAGE_LENGTH) {
        problems.push(`message exceeds ${EXTENSION_MAX_MESSAGE_LENGTH} characters`);
    }
    if (typeof payload.occurrences !== 'number' || !Number.isInteger(payload.occurrences) || payload.occurrences < 1) {
        problems.push('occurrences must be a positive integer');
    }
    if (payload.timestamp !== undefined && Number.isNaN(Date.parse(payload.timestamp as string))) {
        problems.push('timestamp is not an ISO timestamp');
    }
    if (payload.testEvent !== undefined && payload.testEvent !== true) {
        problems.push('testEvent must be true when present');
    }

    if (payload.diagnostics !== undefined) {
        if (typeof payload.diagnostics !== 'object' || payload.diagnostics === null || Array.isArray(payload.diagnostics)) {
            problems.push('diagnostics must be an object');
        } else {
            for (const key of Object.keys(payload.diagnostics as Record<string, unknown>)) {
                if (!EXTENSION_DIAGNOSTIC_KEYS.includes(key)) problems.push(`unknown diagnostic field: ${key}`);
            }
        }
    }

    if (problems.length > 0) return { ok: false, problems };

    // A CRITICAL tem de ter um código conhecido. Um cliente que inventa um
    // código não consegue fabricar um alerta crítico.
    let severity = payload.severity as ExtensionDiagnosticEvent['severity'];
    let severityDowngraded = false;
    if (severity === 'CRITICAL' && !EXTENSION_CRITICAL_CODES.includes(payload.errorCode as string)) {
        severity = 'ERROR';
        severityDowngraded = true;
    }

    return {
        ok: true,
        event: {
            schemaVersion: payload.schemaVersion as number,
            source: payload.source as string,
            severity,
            component: payload.component as string,
            errorCode: payload.errorCode as string,
            event: payload.event as string,
            extensionVersion: payload.extensionVersion as string,
            browser: payload.browser as string,
            browserMajorVersion: payload.browserMajorVersion as string,
            timestamp: payload.timestamp as string,
            message: payload.message as string,
            occurrences: payload.occurrences as number,
            ...(payload.diagnostics ? { diagnostics: payload.diagnostics as Record<string, string | number | boolean> } : {}),
            ...(payload.testEvent === true ? { testEvent: true } : {}),
            ...(severityDowngraded ? { severityDowngraded: true } : {}),
        },
    };
}

/**
 * A validação de um LOTE.
 *
 * A extensão manda os eventos agrupados: uma chamada de rede custa o
 * mesmo para dez eventos do que para um, e a chamada é a parte cara. Um
 * lote com um evento ruim é REJEITADO INTEIRO: partly-accepted é
 * difícil de explicar e impossível de aggregating.
 */
export function validateExtensionDiagnosticBatch(raw: unknown): ValidationResult[] {
    const list = Array.isArray(raw) ? raw : [raw];
    if (list.length === 0) return [{ ok: false, problems: ['empty batch'] }];
    if (list.length > EXTENSION_MAX_EVENTS_PER_REQUEST) {
        return [{ ok: false, problems: [`batch exceeds ${EXTENSION_MAX_EVENTS_PER_REQUEST} events`] }];
    }
    return list.map((item) => validateExtensionDiagnostic(item));
}

/**
 * O LIMITE POR ORIGEM.
 *
 * Uma janela deslizante simples, com contagem por endereço. É o que impede
 * que uma extensão com defeito — ou um script copiando o pedido — encha o
 * grupo. Não é autenticação, e não pretende ser: é um limite de volume.
 *
 * NOTA DE CUSTO: o limite vive na MEMÓRIA da instância, e cada instância
 * tem a sua. Ele contém a repetición vinda de um endereço; ele NÃO
 * contém a repetição vinda de mil endereços. Para isso existe o limite
 * global, no banco.
 */
export class ExtensionRateLimiter {
    private readonly limit: number;
    private readonly windowMs: number;
    private readonly buckets = new Map<string, number[]>();

    constructor(limit = 10, windowMs = 60_000) {
        this.limit = limit;
        this.windowMs = windowMs;
    }

    take(key: string, now = Date.now()): { allowed: boolean; remaining: number; retryAfterSeconds: number } {
        const live = (this.buckets.get(key) ?? []).filter((at) => now - at < this.windowMs);
        if (live.length >= this.limit) {
            this.buckets.set(key, live);
            const oldest = live[0] ?? now;
            return {
                allowed: false,
                remaining: 0,
                retryAfterSeconds: Math.max(1, Math.ceil((this.windowMs - (now - oldest)) / 1000)),
            };
        }
        live.push(now);
        this.buckets.set(key, live);
        return { allowed: true, remaining: this.limit - live.length, retryAfterSeconds: 0 };
    }

    /** Esquece as origens que ficaram em silêncio. */
    sweep(now = Date.now()): void {
        for (const [key, bucket] of this.buckets) {
            const live = bucket.filter((at) => now - at < this.windowMs);
            if (live.length === 0) this.buckets.delete(key);
            else this.buckets.set(key, live);
        }
    }
}

/**
 * O AGRUPADOR.
 *
 * A assinatura é a mesma que a extensão usa: componente + código de erro +
 * versão. O backend agrupa DE NOVO, porque a extensão é um cliente não
 * confiável e o agrupamento do lado do servidor é o que realmente protege
 * o grupo.
 */
export class ExtensionAggregator {
    private readonly windowMs: number;
    private readonly groups = new Map<string, { firstSeenAt: number; lastSeenAt: number; count: number; sample: ExtensionDiagnosticEvent }>();

    constructor(windowMs = 60 * 60_000) {
        this.windowMs = windowMs;
    }

    take(
        event: ExtensionDiagnosticEvent,
        now = Date.now()
    ): { action: 'send' | 'aggregate' | 'summary'; count: number; event: ExtensionDiagnosticEvent } {
        const signature = `${event.component}|${event.errorCode}|${event.extensionVersion}`;
        const existing = this.groups.get(signature);

        if (!existing) {
            this.groups.set(signature, { firstSeenAt: now, lastSeenAt: now, count: 1, sample: event });
            return { action: 'send', count: 1, event };
        }

        existing.lastSeenAt = now;
        existing.count += 1;

        if (now - existing.firstSeenAt >= this.windowMs) {
            // A janela fechou: o que saiu agora é o RESUMO do que aconteceu nela.
            this.groups.set(signature, { firstSeenAt: now, lastSeenAt: now, count: 1, sample: event });
            return { action: 'summary', count: existing.count, event: { ...event, occurrences: existing.count } };
        }

        return { action: 'aggregate', count: existing.count, event };
    }
}

/**
 * A FORMATAÇÃO DA MENSAGEM.
 *
 * O texto é HTML do Telegram, e por isso o conteúdo é ESCAPADO. Um campo
 * `message` que trouxesse `<b>` do usuário viraria marcação — e a marcação
 * de outra pessoa dentro do alerta de uma terceira.
 */
export function escapeTelegramHtml(value: unknown): string {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

const BROWSER_LABEL: Record<string, string> = {
    chrome: 'Google Chrome',
    edge: 'Microsoft Edge',
    other: 'Navegador',
};

/** A mensagem de um erro. */
export function formatExtensionAlert(event: ExtensionDiagnosticEvent): string {
    const browser = BROWSER_LABEL[event.browser] ?? 'Navegador';
    const title = event.severity === 'CRITICAL' ? '🔴 VOLTRIS SHIELD — CRITICAL' : '🚨 VOLTRIS SHIELD — ERROR';
    const when = new Date(event.timestamp);
    const stamp = Number.isNaN(when.getTime())
        ? 'UTC'
        : when.toISOString().replace('T', ' ').replace(/\.\d+Z$/, ' UTC');

    const lines = [
        `<b>${title}</b>`,
        '',
        '📦 Produto: VOLTRIS Browser Extension',
        `🧩 Componente: ${escapeTelegramHtml(event.component)}`,
        `⚠️ Código: ${escapeTelegramHtml(event.errorCode)}`,
        `📌 Evento: ${escapeTelegramHtml(event.event)}`,
        '',
        '📝 Descrição:',
        escapeTelegramHtml(event.message),
        '',
        `🌐 Navegador: ${escapeTelegramHtml(browser)}`,
        `🔖 Versão da extensão: ${escapeTelegramHtml(event.extensionVersion)}`,
        '',
        `🕒 Data/Hora: ${escapeTelegramHtml(stamp)}`,
        `🔁 Ocorrências agrupadas: ${event.occurrences}`,
    ];

    if (event.severity === 'CRITICAL') {
        lines.push('', '🛡️ <b>Impacto:</b>', 'Uma funcionalidade essencial está indisponível.');
        lines.push('', '🔧 <b>Ação recomendada:</b>', 'Investigar inicialização e permissões.');
    }

    if (event.severityDowngraded === true) {
        /*
         * O REBAIXAMENTO, VISÍVEL NO GRUPO.
         *
         * Uma severidade crítica com um código que o servidor não conhece
         * é rebaixada para ERROR — porque um `curl` que inventa um código
         * não pode fabricar um alerta crítico. Mas a mensagem rebaixada
         * ainda chega ao grupo com cara de falha real, e quem lê o grupo
         * precisa saber que aquilo foi recusado em vez de aceito.
         *
         * A linha fica NO CORPO da mensagem, e não numa nota: uma nota
         * pode ser lida por cima.
         */
        lines.push(
            '',
            '⚠️ <b>Severidade rebaixada:</b> o remetente pediu CRITICAL com um código que este servidor não reconhece. A mensagem foi rebaixada para ERROR.',
            '   <i>Se você não reconhece este código, é uma falsificação — a extensão publicada só usa códigos desta lista.</i>'
        );
    }

    if (event.diagnostics && Object.keys(event.diagnostics).length > 0) {
        lines.push('', '🛡️ <b>Diagnóstico sanitizado</b>');
        for (const [key, value] of Object.entries(event.diagnostics)) {
            lines.push(`• ${escapeTelegramHtml(key)}: ${escapeTelegramHtml(value)}`);
        }
    }

    if (event.testEvent === true) {
        // O teste é MARCADO, para nunca ser confundido com um incidente real.
        lines.push('', '🧪 <i>Evento de teste controlado — não é um incidente real.</i>');
    }

    return lines.join('\n');
}

/** A mensagem de um resumo do período. */
export function formatExtensionSummary(periodMinutes: number, counts: Record<string, number>, total: number, avoided: number): string {
    const lines = [
        '<b>📊 VOLTRIS SHIELD — ERROR SUMMARY</b>',
        '',
        `Período: últimos ${periodMinutes} minutos`,
        '',
    ];
    for (const [event, count] of Object.entries(counts)) {
        lines.push(`${escapeTelegramHtml(event)}: ${count} ocorrência${count === 1 ? '' : 's'}`);
    }
    lines.push('', `Total: ${total} ocorrência${total === 1 ? '' : 's'}`);
    lines.push(`Alertas individuais evitados: ${avoided}`);
    return lines.join('\n');
}

/**
 * O EVENTO DE TESTE CONTROLADO.
 *
 * O enunciado exige uma forma restrita de provar que o caminho inteiro
 * funciona: um evento marcado como teste, que passa pelo mesmo coletor, é
 * validado, chega ao grupo e NÃO é registrado como incidente real.
 */
export function buildSyntheticTestEvent(extensionVersion = '0.0.0-test'): ExtensionDiagnosticEvent {
    return {
        schemaVersion: EXTENSION_SCHEMA_VERSION,
        source: EXTENSION_SOURCE,
        severity: 'ERROR',
        component: 'diagnostics',
        errorCode: 'VEX-DIAGNOSTICS-TEST',
        event: 'DIAGNOSTICS_TEST_EVENT',
        extensionVersion,
        browser: 'chrome',
        browserMajorVersion: '0',
        timestamp: new Date().toISOString(),
        message: 'VOLTRIS SHIELD — TEST EVENT',
        occurrences: 1,
        testEvent: true,
    };
}

/**
 * Envia o evento de teste ao grupo.
 *
 * O token e o chat_id vêm do AMBIENTE, e de mais lugar nenhum. A função
 * não os recebe por parâmetro: assim é impossível que um chamador passe o
 * token por engano, e o único lugar de onde ele sai é a variável de
 * ambiente.
 */
export async function sendSyntheticTestToTelegram(options?: {
    token?: string;
    chatId?: string;
    fetchImpl?: typeof fetch;
}): Promise<{ ok: boolean; error?: string; messageId?: number }> {
    const token = (options?.token ?? process.env.TELEGRAM_EXTENSION_BOT_TOKEN ?? '').replace(/['"]/g, '').trim();
    const chatId = (options?.chatId ?? process.env.TELEGRAM_EXTENSION_CHAT_ID ?? '').replace(/['"]/g, '').trim();

    if (!token || !chatId) return { ok: false, error: 'telegram_not_configured' };

    // A importacao e dinamica para nao puxar o cliente do Telegram em
    // qualquer importacao deste modulo: o nucleo e testavel sem rede.
    const { TelegramService } = await import('./telegramService');
    const event = buildSyntheticTestEvent();
    const result = await TelegramService.sendMessageTo(formatExtensionAlert(event), {
        token,
        chatId,
        fetchImpl: options?.fetchImpl,
    });
    if (!result.ok) return { ok: false, error: result.error };
    return { ok: true, messageId: result.messageId };
}
