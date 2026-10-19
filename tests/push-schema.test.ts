/**
 * SCHEMA REAL DE `push_subscriptions` (regressão do erro 42703).
 *
 * O que estava quebrado: o BANCO DE PRODUÇÃO tem a versão ANTIGA da tabela
 * `push_subscriptions` (id, user_id, endpoint, p256dh, auth, created_at,
 * updated_at). A migration com `is_active`, `browser_fingerprint`,
 * `user_agent`, `platform`, `device_type` e `last_used` nunca foi aplicada.
 *
 * O código gravava `is_active: true` direto e filtrava por `.eq('is_active',
 * true)`, então o Postgres respondia:
 *
 *     column push_subscriptions.is_active does not exist   (42703)
 *
 * → HTTP 500 em `/api/push-subscription` → o botão "Ativar notificações"
 * nunca concluía e o aviso com o site fechado nunca era gravado.
 *
 * Estes testes travam a regra: o código NUNCA pode gravar ou filtrar uma
 * coluna que talvez não exista — ele tem que detectar o schema antes.
 */

import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const schema = readFileSync('lib/push-schema.ts', 'utf8');
const rota = readFileSync('app/api/push-subscription/route.ts', 'utf8');
const servico = readFileSync('services/notificationService.ts', 'utf8');
const sql = readFileSync('notificacaocorrigida.sql', 'utf8');

/** Colunas que a versão antiga da tabela NÃO tem. */
const COLUNAS_NOVAS = [
    'is_active',
    'browser_fingerprint',
    'user_agent',
    'platform',
    'device_type',
    'last_used',
];

/**
 * Garante que TODO uso de `is_active` (filtro ou gravacao) esteja protegido
 * por `cols.has('is_active')` ou por `somenteColunas(...)` — ou seja, o
 * codigo so usa a coluna quando ela realmente existe.
 */
function assertUsosProtegidos(codigo: string, rotulo: string): void {
    // Comentarios nao executam: eles sao removidos antes da varredura.
    const semComentarios = codigo
        .replace(/\/\*[\s\S]*?\*\//g, ' ')
        .replace(/\/\/[^\n]*/g, ' ')
        // O proprio guard (`cols.has('is_active')`) e substituido: ele ja e
        // a prova de que a coluna existe.
        .replace(/\.has\('is_active'\)/g, ' HAS_IS_ACTIVE_GUARD ')
        // Textos entre aspas (mensagens de log) nao sao uso de coluna.
        .replace(/'[^'\n]*'/g, "''")
        .replace(/"[^"\n]*"/g, '""')
        .replace(/`[^`]*`/g, '``');
    const padrao = /is_active/g;
    let m: RegExpExecArray | null;
    while ((m = padrao.exec(semComentarios)) !== null) {
        const antes = semComentarios.slice(Math.max(0, m.index - 900), m.index);
        const depois = semComentarios.slice(m.index, m.index + 60);
        const protegido =
            /HAS_IS_ACTIVE_GUARD/.test(antes) ||
            /somenteColunas\(/.test(antes) ||
            /HAS_IS_ACTIVE_GUARD/.test(depois) ||
            /somenteColunas\(/.test(depois);
        assert.ok(
            protegido,
            `${rotulo}: uso de is_active sem protecao -> ...${(antes + depois).slice(-110).replace(/\s+/g, ' ')}`
        );
    }
}

describe('adaptacao ao schema real de push_subscriptions', () => {    test('existe o detector de colunas', () => {
        assert.ok(schema.length > 0, 'lib/push-schema.ts nao pode estar vazio');
        assert.match(schema, /export\s+(async\s+)?function\s+colunasPush/);
        assert.match(schema, /export\s+function\s+somenteColunas/);
    });

    test('a deteccao consulta a tabela e guarda em cache', () => {
        assert.match(schema, /from\('push_subscriptions'\)/);
        assert.match(schema, /cache/i);
        assert.match(schema, /TTL/);
    });

    test('a rota usa somente as colunas existentes (nada de is_active solto)', () => {
        assertUsosProtegidos(rota, 'rota');
    });

    test('o servico de envio tambem e adaptativo', () => {
        assertUsosProtegidos(servico, 'servico');
        assert.match(servico, /colunasPush/);
        assert.match(servico, /cols\.has\('is_active'\)/);
    });

    test('quando nao existe is_active, a inscricao e removida (nao fica ativa)', () => {
        // Sem a coluna de status nao ha como "desativar": a linha precisa
        // sair, senao o navegador continua recebendo avisos.
        assert.match(rota, /colsDelete\.has\('is_active'\)/);
        assert.match(rota, /\.from\('push_subscriptions'\)\s*\.delete\(\)/);
        assert.match(servico, /\.from\('push_subscriptions'\)\s*\.delete\(\)/);
    });

    test('o SQL definitivo existe e e idempotente', () => {
        assert.match(sql, /ALTER TABLE public\.push_subscriptions/);
        for (const c of COLUNAS_NOVAS) {
            assert.match(
                sql,
                new RegExp(`ADD COLUMN IF NOT EXISTS\\s+${c}\\b`),
                `falta a coluna ${c} no SQL`
            );
        }
        assert.match(sql, /ADD COLUMN IF NOT EXISTS/);
    });

    test('nenhuma tabela nova e criada: a correcao e so de colunas', () => {
        assert.ok(
            !/CREATE TABLE[^;]*push_subscriptions/i.test(sql),
            'nao deve criar a tabela de novo (ela ja existe)'
        );
    });
});
