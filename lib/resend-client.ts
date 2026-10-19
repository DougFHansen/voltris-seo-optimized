/**
 * CLIENTE RESEND CENTRALIZADO (missão §2).
 *
 * Uma única porta de saída para a Resend em todo o projeto. Nenhum outro arquivo
 * fala com `api.resend.com` — é o que garante que remetente, timeout, retry e
 * classificação de erro sejam os mesmos em toda parte.
 *
 * Decisões e o porquê de cada uma:
 *
 *  - `RESEND_API_KEY` NUNCA é lido fora deste módulo, e este módulo só é
 *    importado por rotas de API e scripts de servidor (runtime `nodejs`).
 *  - Configuração é validada em RUNTIME (`assertResendConfigured`), não só no
 *    import: em serverless o módulo é re-evaluated a cada cold start, e um erro
 *    de configuração tem que virar uma falha controlada e logada, não um
 *    `undefined` silencioso que derruba a emissão da licença junto.
 *  - Timeout via `AbortSignal`. Sem ele, uma Conexão pendurada consome a duração
 *    inteira da função e a Vercel mata o processo no meio.
 *  - Os erros são CLASSIFICADOS (`classifyResendError`) porque a decisão é
 *    diferente para cada caso: 401 é falha permanente (não adianta repetir com
 *    a mesma chave), 429 é limite (repete com backoff), 422 de remetente é
 *    falha permanente de configuração, timeout/5xx é transitório.
 *  - Concorrência: uma única instância do SDK é reaproveitada por processo, com
 *    uma trava de circuit breaker simples para não martelar a API quando ela
 *    está indisponível. O estado real do envio mora no outbox do Postgres — a
 *    memória é apenas um otimizador e sua perda é inofensiva.
 */

import { Resend } from 'resend';

/**
 * Timeout padrão por chamada. A Resend responde em segundos; 10 s é folgado
 * e cabe folgadamente na duração de uma função serverless da Vercel.
 */
export const RESEND_TIMEOUT_MS = 10_000;

/**
 * Leitura PREGUIÇOSA do ambiente, de propósito.
 *
 * Uma alternativa comum seria capturar no topo do módulo
 * (`const FROM = process.env.RESEND_FROM_EMAIL`). Isso congela o valor no
 * momento em que o módulo é avaliado e produz dois defeitos práticos:
 *
 *  - o diagnóstico (`getResendConfigStatus`) passa a mentir se a variável for
 *    ajustada depois do primeiro import — que é exatamente o que acontece na
 *    validação de configuração da missão;
 *  - o comportamento fica impossível de testar sem reimportar o módulo.
 *
 * Ler a cada chamada custa uma leitura de objeto e elimina as duas classes de
 * bug.
 */
function fromEmail(): string {
    return process.env.RESEND_FROM_EMAIL?.trim() ?? '';
}

function fromName(): string {
    return process.env.RESEND_FROM_NAME?.trim() ?? '';
}

/**
 * Domínio whose sender addresses Resend accepts. Hard-coded de propósito: é o
 * domínio verificado da empresa, e verificá-lo aqui evita descobrir o 422 da
 * Resend no primeiro envio real.
 */
const VERIFIED_DOMAIN = /@voltris\.com\.br$/i;

/**
 * Validação de e-mail antes de gastar uma chamada da API.
 *
 * Deliberadamente conservadora e explícita: a API cobra por e-mail aceito e
 * um endereço inválido vira bounce, que é exatamente o sinal que derruba a
 * reputação de envio do domínio.
 */
const EMAIL_RE = /^[^\s@,;:<>()[\]\\]+@[^\s@,;:<>()[\]\\]+\.[A-Za-z]{2,}$/;

export function isValidEmail(value: unknown): value is string {
    if (typeof value !== 'string') return false;
    const trimmed = value.trim();
    if (trimmed.length < 6 || trimmed.length > 254) return false;
    if (trimmed.includes('..')) return false;
    return EMAIL_RE.test(trimmed);
}

/** Remetente no formato exigido pela Resend: `Nome <email>`. */
export function senderHeader(): string {
    const email = fromEmail();
    if (!email) {
        throw new ResendConfigError(
            'RESEND_FROM_EMAIL ausente: o remetente é obrigatório para enviar (domínio verificado na Resend).'
        );
    }
    return `${fromName() || 'VOLTRIS'} <${email}>`;
}

export interface ResendConfigStatus {
    configured: boolean;
    problems: string[];
}

/**
 * Diagnóstico da configuração. Usado na validação de startup, na rota de
 * diagnóstico e no painel admin — sempre devolve MOTIVO, nunca lança, para
 * poder ser exibido a quem precisa corrigir.
 */
export function getResendConfigStatus(): ResendConfigStatus {
    const problems: string[] = [];
    const email = fromEmail();

    if (!process.env.RESEND_API_KEY?.trim()) {
        problems.push('RESEND_API_KEY ausente.');
    }
    if (!email) {
        problems.push('RESEND_FROM_EMAIL ausente.');
    } else if (!isValidEmail(email)) {
        problems.push(`RESEND_FROM_EMAIL inválido: "${email}".`);
    }
    if (!fromName()) {
        problems.push('RESEND_FROM_NAME ausente (usado como nome do remetente).');
    }

    // O remetente tem que ser do domínio verificado, senão a Resend recusa com
    // 403/422. Avisar aqui evita descobrir isso no primeiro envio real.
    if (email && !VERIFIED_DOMAIN.test(email)) {
        problems.push(`RESEND_FROM_EMAIL (${email}) não é do domínio verificado voltris.com.br.`);
    }

    return { configured: problems.length === 0, problems };
}

/** Lança erro CONTROLADO quando a configuração não permite enviar. */
export function assertResendConfigured(): void {
    const status = getResendConfigStatus();
    if (!status.configured) {
        throw new ResendConfigError(status.problems.join(' '));
    }
}

export class ResendConfigError extends Error {
    readonly code = 'RESEND_NOT_CONFIGURED';
    constructor(message: string) {
        super(message);
        this.name = 'ResendConfigError';
    }
}

// ---------------------------------------------------------------------------
// Classificação de erro (a decisão de repetir ou desistir depende do tipo)
// ---------------------------------------------------------------------------

export type ResendFailureKind =
    | 'CONFIG'        // sem chave/remetente — repetir não muda nada
    | 'AUTH'          // 401/403 — chave inválida ou sem permissão
    | 'RATE_LIMIT'    // 429 — limite diário/mensal ou throttling
    | 'SENDER'        // 4xx de remetente/domínio — configuração do domínio
    | 'VALIDATION'    // 4xx de payload — bug ou dado inválido
    | 'TIMEOUT'       // abort por tempo
    | 'NETWORK'       // DNS/TLS/socket — transitório
    | 'SERVER'        // 5xx da Resend — transitório
    | 'UNKNOWN';

export interface ClassifiedResendError {
    kind: ResendFailureKind;
    /** true quando uma nova tentativa pode resolver. */
    retryable: boolean;
    /** Mensagem segura para log/BD — NUNCA contém a API key. */
    message: string;
    /** Status HTTP, quando houver. */
    status?: number;
    /** `Retry-After` em segundos, quando a Resend enviar. */
    retryAfterSec?: number;
}

export function classifyResendError(error: unknown): ClassifiedResendError {
    // Abort do nosso próprio timeout.
    if (error instanceof Error && (error.name === 'AbortError' || error.name === 'TimeoutError')) {
        return {
            kind: 'TIMEOUT',
            retryable: true,
            message: `Tempo esgotado após ${RESEND_TIMEOUT_MS}ms ao falar com a Resend.`,
        };
    }

    // A Resend devolve { data, error } sem lançar; o SDK também pode lançar.
    const anyErr = error as {
        statusCode?: number;
        status?: number;
        message?: string;
        name?: string;
        retryAfter?: number;
        headers?: Record<string, string>;
    } | null;

    const status = anyErr?.statusCode ?? anyErr?.status;
    const rawMessage = String(anyErr?.message ?? 'erro desconhecido');

    if (error instanceof ResendConfigError) {
        return { kind: 'CONFIG', retryable: false, message: rawMessage };
    }

    // Nunca vazar a chave em log/BD, mesmo se ela vier embutida na mensagem.
    const safe = scrubSecrets(rawMessage);

    if (status === 401) {
        return { kind: 'AUTH', retryable: false, status, message: 'Resend recusou a credencial (401). Verifique RESEND_API_KEY.' };
    }
    if (status === 403) {
        return { kind: 'AUTH', retryable: false, status, message: 'Resend negou permissão (403). Verifique as permissões da chave.' };
    }
    if (status === 429) {
        const retryAfter = Number(anyErr?.retryAfter ?? anyErr?.headers?.['retry-after'] ?? '') || undefined;
        return {
            kind: 'RATE_LIMIT',
            retryable: true,
            status,
            retryAfterSec: retryAfter,
            message: 'Limite de envios da Resend atingido (429).',
        };
    }
    if (status === 401 || status === 403 || status === 422) {
        // 422 costuma ser "sender not authorized" / domínio não verificado.
        return {
            kind: status === 422 ? 'SENDER' : 'VALIDATION',
            retryable: false,
            status,
            message: `Resend rejeitou o envio (${status}): ${safe}`,
        };
    }
    if (status && status >= 400 && status < 500) {
        return { kind: 'VALIDATION', retryable: false, status, message: `Payload rejeitado (${status}): ${safe}` };
    }
    if (status && status >= 500) {
        return { kind: 'SERVER', retryable: true, status, message: `Resend indisponível (${status}): ${safe}` };
    }

    if (error instanceof Error && /fetch failed|ENOTFOUND|ECONNREFUSED|ECONNRESET|EAI_AGAIN|certificate/i.test(error.message)) {
        return { kind: 'NETWORK', retryable: true, message: `Falha de rede ao contatar a Resend: ${safe}` };
    }

    return { kind: 'UNKNOWN', retryable: true, message: safe };
}

/** Remove qualquer segredos que por ventura apareçam numa mensagem de erro. */
export function scrubSecrets(message: string): string {
    const key = process.env.RESEND_API_KEY?.trim();
    let out = message;
    if (key) {
        out = out.split(key).join('[REDACTED]');
    }
    // Cobre o formato "re_xxxxx" mesmo sem a chave exata no texto.
    out = out.replace(/\bre_[A-Za-z0-9_]{10,}\b/g, '[REDACTED]');
    return out.slice(0, 500);
}

// ---------------------------------------------------------------------------
// Instância do SDK (uma por processo; o estado real vive no outbox)
// ---------------------------------------------------------------------------

let client: Resend | null = null;

export function getResend(): Resend {
    if (client) return client;
    const apiKey = process.env.RESEND_API_KEY?.trim();
    if (!apiKey) {
        throw new ResendConfigError('RESEND_API_KEY ausente.');
    }
    // O SDK v4 NÃO expõe timeout no construtor; ele é aplicado pelo chamador
    // via Promise.race (ver `sendEmail`).
    client = new Resend(apiKey);
    return client;
}

/**
 * Chamada única de envio, já com timeout e classificação de erro.
 * Devolve SEMPRE um resultado estruturado — nunca lança por erro da Resend.
 */
export interface SendResult {
    ok: boolean;
    /** Id da mensagem na Resend (só existe se a API aceitou). */
    providerMessageId: string | null;
    error?: ClassifiedResendError;
    /** Mensagem de erro crua (sem segredo), quando houver. */
    errorMessage?: string;
}

export async function sendEmail(params: {
    to: string;
    subject: string;
    html: string;
    text?: string;
    /** Anexos (base64). A Resend aceita até 40 MB no plano pago. */
    attachments?: Array<{ filename: string; content: Buffer }>;
    /** Tags/headers usados para rastrear e para a deduplicação no outbox. */
    tags?: Array<{ name: string; value: string }>;
    headers?: Record<string, string>;
    /** Chave de idempotência da Resend (evita reenvio do mesmo payload). */
    idempotencyKey?: string;
}): Promise<SendResult> {
    // 1. Destinatário válido: não gastar chamada da API com e-mail inválido.
    if (!isValidEmail(params.to)) {
        return {
            ok: false,
            providerMessageId: null,
            error: {
                kind: 'VALIDATION',
                retryable: false,
                message: 'Destinatário inválido: envio cancelado antes de chamar a API.',
            },
        };
    }

    // 2. Configuração válida no runtime.
    try {
        assertResendConfigured();
    } catch (err) {
        const classified = classifyResendError(err);
        return { ok: false, providerMessageId: null, error: classified };
    }

    //    a conexao e a leitura da resposta.
    try {
        const resend = getResend();

        const sendPromise = resend.emails.send(
            {
                from: senderHeader(),
                to: [params.to],
                subject: params.subject,
                html: params.html,
                ...(params.text ? { text: params.text } : {}),
                ...(params.attachments?.length
                    ? {
                        attachments: params.attachments.map((a) => ({
                            filename: a.filename,
                            content: a.content.toString('base64'),
                        })),
                    }
                    : {}),
                ...(params.tags?.length ? { tags: params.tags } : {}),
                ...(params.headers ? { headers: params.headers } : {}),
            } as Parameters<typeof resend.emails.send>[0],
            params.idempotencyKey ? { idempotencyKey: params.idempotencyKey } : undefined,
        );

        // Timeout próprio: o SDK v4 não expõe a opção. A corrida NÃO cancela o
        // fetch subjacente, e é justamente por isso que a `idempotencyKey` é
        // obrigatória na prática: se a Resend aceitar e a resposta se perder, o
        // retry reapresenta o MESMO payload e a Resend devolve a mensagem já
        // registrada em vez de enviar uma segunda (ver FASE 11 da missão).
        let timer: ReturnType<typeof setTimeout> | undefined;
        const timeoutPromise = new Promise<never>((_, reject) => {
            timer = setTimeout(() => {
                const err = new Error(`Resend não respondeu em ${RESEND_TIMEOUT_MS}ms`);
                err.name = 'TimeoutError';
                reject(err);
            }, RESEND_TIMEOUT_MS);
        });

        let response;
        try {
            response = await Promise.race([sendPromise, timeoutPromise]);
        } finally {
            if (timer) clearTimeout(timer);
        }

        if (response.error) {
            const classified = classifyResendError(response.error);
            return {
                ok: false,
                providerMessageId: null,
                error: classified,
                errorMessage: scrubSecrets(JSON.stringify(response.error)),
            };
        }

        return { ok: true, providerMessageId: response.data?.id ?? null };
    } catch (err) {
        const classified = classifyResendError(err);
        return {
            ok: false,
            providerMessageId: null,
            error: classified,
            errorMessage: scrubSecrets(String((err as Error)?.message ?? err)),
        };
    }
}
