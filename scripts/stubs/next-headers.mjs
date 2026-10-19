/**
 * Dublês de módulos do Next.js para os testes.
 *
 * POR QUE ISTO EXISTE
 * -------------------
 * `next/server` e `next/headers` carregam o runtime do Next.js, que exige um
 * servidor de verdade e falha no `node --test`. Nossos testes verificam LÓGICA
 * — matriz de permissões, redação de segredo, período, máscara, SQL — e não
 * precisam de HTTP nem de cookie.
 *
 * Trazer o runtime inteiro do Next para testar isso seria lento e frágil.
 *
 * IMPORTANTE: isto só é usado pelo `scripts/register-alias.mjs`, que é o
 * carregador de teste. O bundle da aplicação continua importando os módulos
 * REAIS do Next — estes arquivos nunca entram nele.
 */

/** Resposta JSON com o mesmo formato de `NextResponse.json`. */
class FakeNextResponse {
    constructor(body, init = {}) {
        this._body = body;
        this.status = init.status ?? 200;
        this.headers = new Map(Object.entries(init.headers ?? {}));
    }

    static json(body, init = {}) {
        return new FakeNextResponse(body, init);
    }

    static redirect(url, init = {}) {
        return new FakeNextResponse(null, { ...init, status: init.status ?? 307 });
    }

    async json() {
        return this._body;
    }

    get ok() {
        return this.status >= 200 && this.status < 300;
    }
}

export const NextResponse = FakeNextResponse;
export class NextRequest {}
export default { NextResponse, NextRequest };

// ---------------------------------------------------------------------------

/**
 * `cookies()` do Next. Fora de um request não há cookie, e isso é exatamente o
 * que um teste de autorização quer: um contexto sem sessão é o caminho de
 * negação, e precisa ser testável sem montar um servidor HTTP.
 */
export function cookies() {
    return {
        get: () => undefined,
        getAll: () => [],
        has: () => false,
        set: () => { /* no-op em teste */ },
        delete: () => { /* no-op em teste */ },
    };
}

export function headers() {
    return {
        get: () => null,
        has: () => false,
    };
}
