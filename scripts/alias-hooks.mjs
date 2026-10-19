/**
 * Hook de resolução que traduz o alias `@/` do tsconfig para uso direto pelo
 * Node (scripts de auditoria, preview e testes). Não faz parte do bundle da
 * aplicação.
 */
import { existsSync } from 'node:fs';
import { dirname, resolve as resolvePath } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = resolvePath(dirname(fileURLToPath(import.meta.url)), '..');
const PREFIX = '@/';

/**
 * Substituições aplicadas APENAS neste carregador (nunca no bundle).
 *
 * `next/server` e `next/headers` carregam o runtime do Next.js, que exige um
 * servidor de verdade e falha no `node --test`. Como os testes verificam
 * lógica pura (permissões, redação de segredo, período, máscara, SQL) e não
 * HTTP nem cookie, basta um dublê com o mesmo formato de retorno.
 * Ver `scripts/stubs/`.
 */
const STUBS = new Map([
    ['next/server', resolvePath(ROOT, 'scripts/stubs/next-server.mjs')],
    ['next/headers', resolvePath(ROOT, 'scripts/stubs/next-headers.mjs')],
]);

export async function resolve(specifier, context, nextResolve) {
    const stub = STUBS.get(specifier);
    if (stub && existsSync(stub)) {
        return { url: pathToFileURL(stub).href, shortCircuit: true, format: undefined };
    }

    if (specifier.startsWith(PREFIX)) {
        const target = resolvePath(ROOT, specifier.slice(PREFIX.length));
        const candidates = [
            target,
            `${target}.ts`,
            `${target}.tsx`,
            `${target}.mjs`,
            `${target}.js`,
            resolvePath(target, 'index.ts'),
        ];
        for (const candidate of candidates) {
            if (existsSync(candidate)) {
                return { url: pathToFileURL(candidate).href, shortCircuit: true, format: undefined };
            }
        }
    }

    // Extensões implícitas para imports relativos dentro do projeto.
    if ((specifier.startsWith('./') || specifier.startsWith('../')) && context.parentURL) {
        const base = resolvePath(dirname(fileURLToPath(context.parentURL)), specifier);
        for (const candidate of [base, `${base}.ts`, `${base}.tsx`, resolvePath(base, 'index.ts')]) {
            if (existsSync(candidate)) {
                return { url: pathToFileURL(candidate).href, shortCircuit: true, format: undefined };
            }
        }
    }

    return nextResolve(specifier, context);
}