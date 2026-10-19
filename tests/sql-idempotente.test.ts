/**
 * SQL DO BANCO: O ARQUIVO PRECISA PODER RODAR VÁRIAS VEZES.
 *
 * O que aconteceu: a segunda execução de `notificacaocorrigida.sql` quebrou
 * com
 *
 *     ERROR: 42710: policy "service role only inserts notifications"
 *             for table "notifications" already exists
 *
 * Como o editor do Supabase roda cada comando em autocommit, o erro ABORTA o
 * resto do arquivo — inclusive a seção 7, que cria as colunas de
 * `push_subscriptions` (sem elas o push quebra com 42703).
 *
 * O Postgres não tem "CREATE POLICY IF NOT EXISTS" nem "CREATE TRIGGER IF
 * NOT EXISTS": a forma correta é `DROP ... IF EXISTS` antes do `CREATE`.
 * Este teste trava essa regra em todo o arquivo.
 */

import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const sql = readFileSync('notificacaocorrigida.sql', 'utf8');

/** Remove comentários para não ler nome de policy dentro de texto. */
function semComentarios(): string {
    return sql
        .replace(/\/\*[\s\S]*?\*\//g, ' ')
        .replace(/--[^\n]*/g, ' ');
}

describe('notificacaocorrigida.sql pode rodar quantas vezes quiser', () => {
    test('toda CREATE POLICY tem um DROP POLICY IF EXISTS da mesma policy antes', () => {
        const codigo = semComentarios();
        const padrao = /CREATE\s+POLICY\s+"([^"]+)"/gi;
        const drops = [...codigo.matchAll(/DROP\s+POLICY\s+IF\s+EXISTS\s+"([^"]+)"/gi)]
            .map((m) => ({ nome: m[1], pos: m.index! }));

        let m: RegExpExecArray | null;
        while ((m = padrao.exec(codigo)) !== null) {
            const nome = m[1];
            const drop = drops.find((d) => d.nome === nome && d.pos < m!.index!);
            assert.ok(
                drop,
                `a policy "${nome}" e criada sem um DROP POLICY IF EXISTS antes (42710 na segunda execucao)`
            );
        }
    });

    test('toda CREATE TRIGGER tem um DROP TRIGGER IF EXISTS antes', () => {
        const codigo = semComentarios();
        const triggers = [...codigo.matchAll(/CREATE\s+TRIGGER\s+([A-Za-z0-9_]+)/gi)];
        const drops = [...codigo.matchAll(/DROP\s+TRIGGER\s+IF\s+EXISTS\s+([A-Za-z0-9_]+)/gi)]
            .map((m) => ({ nome: m[1], pos: m.index! }));

        assert.ok(triggers.length > 0, 'o arquivo deve criar triggers');
        for (const t of triggers) {
            const drop = drops.find((d) => d.nome === t[1] && d.pos < t.index!);
            assert.ok(
                drop,
                `a trigger "${t[1]}" e criada sem um DROP TRIGGER IF EXISTS antes (42710 na segunda execucao)`
            );
        }
    });

    test('colunas, indices e tipos sao idempotentes', () => {
        const codigo = semComentarios();
        assert.ok(!/ADD COLUMN\s+(?!IF NOT EXISTS)/i.test(codigo), 'ADD COLUMN sem IF NOT EXISTS');
        assert.ok(!/CREATE INDEX\s+(?!IF NOT EXISTS)/i.test(codigo), 'CREATE INDEX sem IF NOT EXISTS');
        assert.ok(
            !/ADD VALUE\s+(?!IF NOT EXISTS)/i.test(codigo),
            'ALTER TYPE ... ADD VALUE sem IF NOT EXISTS'
        );
    });

    test('a secao 7 (push_subscriptions) continua no arquivo', () => {
        assert.match(sql, /ALTER TABLE public\.push_subscriptions/);
        for (const c of ['is_active', 'browser_fingerprint', 'last_used']) {
            assert.match(
                sql,
                new RegExp(`ADD COLUMN IF NOT EXISTS\\s+${c}\\b`),
                `faltou a coluna ${c}`
            );
        }
    });
});
