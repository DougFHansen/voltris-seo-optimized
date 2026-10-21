/**
 * REDIRETIONAMENTO INTERNO SEGURO.
 *
 * O parâmetro `redirect` viaja na URL (login, perfil, AuthGuard). Sem filtro,
 * `?redirect=https://exemplo-malicioso` vira uma saída do site — o cliente
 * entra no login e sai em outro lugar. Isto aqui aceita SOMENTE caminhos
 * internos do próprio site.
 *
 * Regras:
 *   - precisa começar com `/`;
 *   - `//` e `/\` são rejeitados (URL relativa ao protocolo = open redirect);
 *   - nada de `http://`, `https://`, `javascript:` etc.;
 *   - caminho + query + hash internos são preservados intactos.
 */
export function safeInternalRedirect(
    target: string | null | undefined,
    fallback: string = '/dashboard',
): string {
    const bruto = String(target ?? '').trim();
    if (!bruto) return fallback;

    // Precisa ser caminho interno.
    if (!bruto.startsWith('/')) return fallback;
    // "//host" e "/\host" são URL relativa ao protocolo.
    if (bruto.startsWith('//') || bruto.startsWith('/\\')) return fallback;
    // "/\evil.com" — barra invertida é normalizada pelo browser como barra.
    if (/^\/[\\/]/.test(bruto)) return fallback;

    return bruto;
}

/**
 * Junta um caminho interno com uma query string já existente.
 * Usado para devolver o cliente ao ponto exato de onde ele saiu.
 */
export function withQuery(pathname: string, query: string | null | undefined): string {
    const q = String(query ?? '').trim();
    if (!q) return pathname;
    return `${pathname}?${q.replace(/^\?/, '')}`;
}
