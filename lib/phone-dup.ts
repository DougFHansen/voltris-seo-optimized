/**
 * TELEFONE DUPLICADO — comparação que funciona de verdade.
 *
 * O defeito real (medido em produção, 2026-10-19):
 *
 *   O endpoint de disponibilidade comparava assim:
 *       or=(phone.eq.37998127122, phone.ilike.*37998127122*)
 *
 *   E o telefone gravado no banco é FORMATADO: "(37) 99812-7122".
 *   - `eq.37998127122` não bate com "(37) 99812-7122"  -> 0 linhas
 *   - `ilike.*37998127122*` também não bate: o hífen entre "99812" e
 *     "7122" quebra a sequência de dígitos               -> 0 linhas
 *
 *   Resultado: a trava de WhatsApp duplicado NUNCA disparou. No banco havia
 *   3 contas com o mesmo número (11996716235).
 *
 * A correção aqui normaliza o número (só dígitos, sem DDI 55, sem zeros à
 * esquerda) e compara de forma exata. Quando o SQL não consegue casar por
 * texto, a busca traz CANDIDATOS por padrão de dígitos e a comparação final
 * é feita em memória, dígito a dígito.
 */

/** Só dígitos. */
export function digitos(v: string | null | undefined): string {
    return String(v ?? '').replace(/\D/g, '');
}

/**
 * Número canônico para comparação.
 *
 * - "(37) 99812-7122"  -> "37998127122"
 * - "37998127122"      -> "37998127122"
 * - "+55 37 99812-7122"-> "37998127122"
 * - "037998127122"     -> "37998127122"
 * - "11996716235"      -> "11996716235"
 */
export function normalizarTelefone(v: string | null | undefined): string {
    let n = digitos(v);
    if (!n) return '';

    if (n.length > 11) {
        // DDI do Brasil (55) antes do DDD.
        if (n.startsWith('55') && n.length >= 12) n = n.slice(2);
        // Sobrou sobra: fica com os 11 dígitos finais (formato BR).
        if (n.length > 11) n = n.slice(-11);
    }
    return n;
}

/** Mesmo número, ignorando formatação, DDI e zeros à esquerda. */
export function mesmoTelefone(a: string | null | undefined, b: string | null | undefined): boolean {
    const na = normalizarTelefone(a);
    const nb = normalizarTelefone(b);
    return !!na && !!nb && na === nb;
}

/** Valor pronto para um filtro PostgREST, com aspas quando precisa. */
export function valorPostgREST(v: string): string {
    if (/^[A-Za-z0-9._-]+$/.test(v)) return v;
    return `"${v.replace(/"/g, '\\"')}"`;
}

/**
 * Filtros PostgREST que trazem CANDIDATOS de telefone, em qualquer
 * formatação, para o número informado.
 *
 * O padrão com `*` entre os dígitos é o que permite casar com o hífen:
 * "99812712" vira `*9*9*8*1*2*7*1*2*` e casa com "(37) 99812-7122".
 * O padrão é um SUPERCONJUNTO: a decisão final é sempre a comparação
 * exata em `mesmoTelefone`.
 */
export function padroesDeBusca(v: string | null | undefined): string[] {
    const bruto = String(v ?? '').trim();
    const n = normalizarTelefone(v);
    const padroes = new Set<string>();

    if (bruto) padroes.add(`phone.eq.${valorPostgREST(bruto)}`);
    if (n) {
        padroes.add(`phone.eq.${valorPostgREST(n)}`);
        padroes.add(`phone.ilike.*${n}*`);
        const cauda = n.slice(-8);
        if (cauda.length >= 4) {
            padroes.add(`phone.ilike.*${cauda.split('').join('*')}*`);
        }
    }
    return [...padroes];
}

/**
 * O padrão gerado casa com o número gravado em qualquer formatação?
 * (usado nos testes como prova de que o padrão funciona)
 */
export function padraoCasaCom(padrao: string, valor: string): boolean {
    const alvo = String(valor ?? '').trim();

    const ilike = /^phone\.ilike\.(.*)$/.exec(padrao);
    if (ilike) {
        // No ILIKE o `*` casa com qualquer sequência (inclusive vazia) e o
        // padrão NÃO é ancorado nas pontas — por isso os `.*` das bordas.
        const re = new RegExp('^' + ilike[1].split('*').map(escapeRegex).join('.*') + '$');
        return re.test(alvo);
    }

    const eq = /^phone\.eq\.(.*)$/.exec(padrao);
    if (!eq) return false;
    return eq[1].replace(/^"|"$/g, '') === alvo;
}

function escapeRegex(s: string): string {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
