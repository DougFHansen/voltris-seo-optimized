/**
 * Dublê de `next/server` para os testes.
 *
 * POR QUE ISTO EXISTE
 * -------------------
 * `lib/voltris-log.ts` importa `NextResponse` para montar as respostas das
 * rotas. Sob o `node --test`, esse import tenta carregar o runtime do Next.js
 * (que exige o ambiente de um servidor) e falha antes de qualquer asserção.
 *
 * Nossos testes de e-mail exercitam LÓGICA — backoff, idempotência, transições
 * de estado — e não precisam de HTTP. Trazer o runtime inteiro do Next para
 * testar isso seria lento e frágil.
 *
 * Este dublê devolve um objeto com o mesmo formato (`json()` → objeto com
 * `status`, `headers`, corpo) para que o código de log funcione igual, sem
 * tocar em rede nem no framework.
 *
 * IMPORTANTE: isto só é usado pelo `scripts/register-alias.mjs`, que é o
 * carregador de teste. O bundle da aplicação continua importando o `next/server`
 * real — este arquivo nunca entra nele.
 */

class FakeNextResponse {
    constructor(body, init = {}) {
        this._body = body;
        this.status = init.status ?? 200;
        this.headers = new Map(Object.entries(init.headers ?? {}));
    }

    static json(body, init = {}) {
        return new FakeNextResponse(body, init);
    }

    /** Permite `await response.json()` sem travar o teste. */
    async json() {
        return this._body;
    }

    get ok() {
        return this.status >= 200 && this.status < 300;
    }
}

export const NextResponse = FakeNextResponse;
export const NextRequest = class NextRequest {};
export default { NextResponse, NextRequest };
