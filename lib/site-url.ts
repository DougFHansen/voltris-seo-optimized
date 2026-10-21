/**
 * URL BASE DO SITE — uma fonte só, e sem depender de `.env` ambíguo.
 *
 * ---------------------------------------------------------------------------
 * O PROBLEMA REAL (achado na auditoria do checkout do Stripe)
 * ---------------------------------------------------------------------------
 *
 * A `success_url` da Stripe é montada com `NEXT_PUBLIC_BASE_URL`. No ambiente
 * que de fato gerava essa URL, a variável valia `http://voltris.com.br`
 * (confirmado no e-mail de compra gravado em `email_outbox`:
 * `http://voltris.com.br/dashboard?tab=licenses`).
 *
 * Três consequências, todas reais:
 *
 *   1. `http://` — o cliente sai do Stripe e entra no site em TEXTO CRU antes
 *      do 308 para https. O cookie de sessão (`Secure`) não viaja nesse
 *      salto, e o navegador mostra aviso de "Não seguro".
 *   2. Sem `www` — mais um 308 (voltris.com.br -> www.voltris.com.br). Cada
 *      salto de host é uma chance de a sessão não acompanhar.
 *   3. Em DESENVOLVIMENTO o checkout voltava para o site de PRODUÇÃO, não
 *      para o `localhost:3000` — quem compra no teste nunca vê o painel local.
 *
 * ---------------------------------------------------------------------------
 * AS TRÊS GARANTIAS DESTA MÓDULO
 * ---------------------------------------------------------------------------
 *
 *   1. `https` é imposto fora de localhost. Não existe mais caminho em claro.
 *   2. Barra final e caminho sobrando são removidos
 *      (`https://site.com//dashboard` -> `https://site.com`).
 *   3. Quando a requisição PROVA que está vindo do próprio site, a origem da
 *      requisição vence a variável de ambiente. Assim:
 *        - checkout em `localhost:3000`  -> volta para `localhost:3000`;
 *        - checkout em `https://www.voltris.com.br` -> volta para `https://www.voltris.com.br`;
 *      mesmo com a variável de ambiente errada.
 *
 * ---------------------------------------------------------------------------
 * SEGURANÇA
 * ---------------------------------------------------------------------------
 *
 * A origem da requisição só é aceita quando o domínio bate com o domínio
 * configurado (ou quando é localhost em desenvolvimento). Um `Origin` falso
 * (host header injection / CSRF) NÃO redireciona o cliente para um site do
 * atacante: no máximo ele cai no valor configurado.
 */

/** Domínio canônico do site. Usado só quando nada mais pode ser deduzido. */
export const SITE_URL_PADRAO = 'https://www.voltris.com.br';

/** Hosts de desenvolvimento: aceitos em claro e com porta. */
const HOSTS_LOCAIS = new Set(['localhost', '127.0.0.1', '::1', '0.0.0.0']);

/**
 * Domínio "de raiz" para comparar duas URLs do mesmo site.
 * `www.voltris.com.br` e `voltris.com.br` são o mesmo site.
 */
export function baseDomain(hostname: string): string {
    return String(hostname || '').trim().toLowerCase().replace(/\.$/, '').replace(/^www\./, '');
}

export function isHostLocal(hostname: string): boolean {
    const h = String(hostname || '').trim().toLowerCase().replace(/^\[|\]$/g, '');
    return HOSTS_LOCAIS.has(h);
}

/**
 * Normaliza uma URL base de site:
 *   - exige http/https;
 *   - força `https` fora de localhost;
 *   - remove caminho, query, fragmento e barra final;
 *   - devolve o padrão quando a entrada não serve.
 */
export function normalizeBaseUrl(raw: string | null | undefined, fallback: string = SITE_URL_PADRAO): string {
    const entrada = String(raw ?? '').trim();
    if (!entrada) return fallback;

    let url: URL;
    try {
        url = new URL(entrada);
    } catch {
        return fallback;
    }

    if (url.protocol !== 'http:' && url.protocol !== 'https:') return fallback;
    if (!url.hostname) return fallback;

    const local = isHostLocal(url.hostname);
    const protocolo = local ? url.protocol : 'https:';
    const porta = url.port ? `:${url.port}` : '';
    return `${protocolo}//${url.hostname.toLowerCase()}${porta}`;
}

/**
 * Lê a URL base do ambiente, em ordem de autoridade:
 *   1. `VOLTRIS_SITE`         — a URL canônica do site (documentada no .env.example);
 *   2. `NEXT_PUBLIC_SITE_URL` — a URL usada pelo portal de cobrança;
 *   3. `NEXT_PUBLIC_BASE_URL` — a que a Stripe recebia;
 *   4. o padrão do código.
 */
export function configuredSiteUrl(env: Partial<NodeJS.ProcessEnv> = process.env): string {
    return normalizeBaseUrl(
        env.VOLTRIS_SITE || env.NEXT_PUBLIC_SITE_URL || env.NEXT_PUBLIC_BASE_URL || null,
        SITE_URL_PADRAO,
    );
}

/**
 * Extrai a origem de uma requisição (a URL do site que o browser está
 * usando). Prioridade: `Origin` -> `Referer` -> `Host` + `X-Forwarded-Proto`.
 */
export function requestOriginOf(headers: {
    get(name: string): string | null | undefined;
}): string | null {
    const origem = headers.get('origin');
    if (origem) {
        const normalizada = normalizeBaseUrl(origem, '');
        if (normalizada) return normalizada;
    }

    const referer = headers.get('referer');
    if (referer) {
        try {
            const normalizada = normalizeBaseUrl(new URL(referer).origin, '');
            if (normalizada) return normalizada;
        } catch {
            /* referer inválido: segue para o Host */
        }
    }

    const host = headers.get('host');
    if (host) {
        const proto = (headers.get('x-forwarded-proto') || '').split(',')[0].trim() || 'https';
        const normalizada = normalizeBaseUrl(`${proto}://${host}`, '');
        if (normalizada) return normalizada;
    }

    return null;
}

/**
 * A origem da requisição é confiável?
 *
 *  - localhost: aceito em desenvolvimento (e também quando o próprio site
 *    configurado é localhost);
 *  - qualquer outro host: só quando compartilha o domínio com o site
 *    configurado. `https://evil.com` numa requisição forjada NÃO passa.
 */
export function isTrustedOrigin(
    origin: string | null | undefined,
    configured: string,
    isProduction: boolean,
): boolean {
    if (!origin) return false;

    let host: string;
    try {
        host = new URL(origin).hostname;
    } catch {
        return false;
    }
    if (!host) return false;

    // Host que é um IP literal não é um site: fora de localhost é rejeitado.
    if (!isHostLocal(host) && /^\d{1,3}(\.\d{1,3}){3}$/.test(host)) return false;

    if (isHostLocal(host)) {
        const configuradoEhLocal = isHostLocal(new URL(configured).hostname);
        return configuradoEhLocal || !isProduction;
    }

    let hostConfigurado: string;
    try {
        hostConfigurado = new URL(configured).hostname;
    } catch {
        return false;
    }

    return baseDomain(host) === baseDomain(hostConfigurado);
}

export interface ResolveSiteUrlInput {
    /** Valor lido do ambiente (sem normalizar). */
    configured?: string | null;
    /** Origem da requisição atual (se houver). */
    requestOrigin?: string | null;
    /** `true` em produção (build). */
    isProduction?: boolean;
    /** Sobrescreve a fonte do valor configurado (útil em teste). */
    env?: Partial<NodeJS.ProcessEnv>;
}

/**
 * Resolve a URL base do site para montar links de retorno (Stripe, e-mails).
 *
 * Retorna SEM barra final, sempre `https` fora de localhost, e com a origem
 * real da requisição quando ela é comprovadamente do mesmo site.
 */
export function resolveSiteUrl(input: ResolveSiteUrlInput = {}): string {
    const env = input.env ?? process.env;
    const isProduction = input.isProduction ?? env.NODE_ENV === 'production';

    const configuradoBruto =
        input.configured ?? env.VOLTRIS_SITE ?? env.NEXT_PUBLIC_SITE_URL ?? env.NEXT_PUBLIC_BASE_URL ?? null;
    const configurado = normalizeBaseUrl(configuradoBruto, SITE_URL_PADRAO);

    const origem = input.requestOrigin ? normalizeBaseUrl(input.requestOrigin, '') : null;
    if (origem && isTrustedOrigin(origem, configurado, isProduction)) return origem;

    return configurado;
}
