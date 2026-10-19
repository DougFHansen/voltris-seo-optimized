/**
 * Compatibilidade de schema para migrações em "rolling deploy".
 *
 * A Vercel sobe o código antes (ou depois) da migration do Supabase. Se o
 * código novo exigir uma coluna que ainda não existe, o `select` falha INTEIRO
 * e o painel inteiro quebra — regressão que a missão proíbe ("sem regressões").
 *
 * Esta função faz o select com colunas novas e, se o PostgREST recusar, refaz
 * só com as colunas garantidas. O chamador recebe os campos opcionais como
 * `undefined` (que a interface trata como "informação não registrada"), nunca
 * um erro.
 */

import type { SupabaseClient } from '@supabase/supabase-js';

export interface OptionalSelectResult<T> {
    rows: T[];
    /** true quando as colunas opcionais existiam de fato. */
    hasOptionalColumns: boolean;
}

/**
 * Aplica os MESMOS filtros nas duas tentativas. `apply` recebe a query já
 * filtrada e devolve a query pronta — obrigatório para que o fallback nunca
 * relaxe um filtro de segurança (tipo `user_id`).
 */
export type QueryFilter = (query: any) => any;

export async function selectWithOptionalColumns<T = Record<string, unknown>>(
    supabase: SupabaseClient,
    table: string,
    baseColumns: string[],
    optionalColumns: string[],
    apply?: QueryFilter
): Promise<OptionalSelectResult<T>> {
    if (optionalColumns.length > 0) {
        let q = supabase.from(table).select([...baseColumns, ...optionalColumns].join(','));
        if (apply) q = apply(q);
        const { data, error } = await q;

        if (!error) {
            return { rows: (data ?? []) as T[], hasOptionalColumns: true };
        }
    }

    let fallback = supabase.from(table).select(baseColumns.join(','));
    if (apply) fallback = apply(fallback);
    const { data, error } = await fallback;
    if (error) throw error;

    return { rows: (data ?? []) as T[], hasOptionalColumns: false };
}