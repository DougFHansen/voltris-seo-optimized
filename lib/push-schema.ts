import { createClient } from '@supabase/supabase-js';

/**
 * SCHEMA REAL DE `push_subscriptions`.
 *
 * A tabela foi criada em producao com um schema ANTIGO (id, user_id, endpoint,
 * p256dh, auth, created_at, updated_at). A migration que adiciona
 * `is_active`, `browser_fingerprint`, `user_agent`, `platform`, `device_type` e
 * `last_used` nunca foi aplicada no banco de producao -- e o codigo do
 * endpoint usava `is_active`, o que produzia:
 *
 *     column push_subscriptions.is_active does not exist  (Postgres 42703)
 *
 * e deixava o "Ativar notificacoes" com 500 -- o push nunca era gravado.
 *
 * Aqui o codigo DESCUBRE as colunas existentes (uma unica consulta, em cache) e
 * usa so o que existe. A correcao definitiva (as colunas completas) esta no
 * `notificacaocorrigida.sql`, que o operador aplica.
 */

const db = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

let cache: Set<string> | null = null;
let cacheEm = 0;
const TTL = 60_000;

/** Colunas que existem hoje na tabela. */
export async function colunasPush(): Promise<Set<string>> {
    if (cache && Date.now() - cacheEm < TTL) return cache;
    const colunas = new Set<string>();
    try {
        // Uma consulta que devolve um erro se a coluna nao existir: usamos
        // `select=*` e lemos as chaves do primeiro registro; se a tabela estiver
        // vazia, caimos no metodo por probing das colunas conhecidas.
        const { data, error } = await db
            .from('push_subscriptions')
            .select('*')
            .limit(1);
        if (!error) {
            if (data && data.length) {
                for (const k of Object.keys(data[0] as Record<string, unknown>)) colunas.add(k);
            } else {
                // Tabela vazia: testa as colunas conhecidas uma a uma.
                for (const c of COLUNAS_CONHECIDAS) {
                    const r = await db.from('push_subscriptions').select(c).limit(1);
                    if (!r.error) colunas.add(c);
                }
            }
        }
    } catch {
        // Fallback conservador: assume o schema antigo (o minimo que existe).
        for (const c of ['id', 'user_id', 'endpoint', 'p256dh', 'auth', 'created_at', 'updated_at']) {
            colunas.add(c);
        }
    }
    cache = colunas;
    cacheEm = Date.now();
    return colunas;
}

export const COLUNAS_CONHECIDAS = [
    'id', 'user_id', 'endpoint', 'p256dh', 'auth',
    'is_active', 'browser_fingerprint', 'user_agent', 'platform',
    'device_type', 'last_used', 'created_at', 'updated_at',
];

/** Monta um objeto apenas com as colunas que existem. */
export function somenteColunas<T extends Record<string, unknown>>(
    colunas: Set<string>,
    dados: T
): Partial<T> {
    const saida: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(dados)) {
        if (colunas.has(k)) saida[k] = v;
    }
    return saida as Partial<T>;
}

/** Zera o cache (usado em teste). */
export function resetarSchemaPush(): void {
    cache = null;
    cacheEm = 0;
}
