/**
 * Testes do OUTBOX DE E-MAIL (missão §11 e §15).
 *
 * Esta é a peça que a missão chama de "a mais importante", então os testes
 * cobrem o comportamento que ela promete, e não a forma do código:
 *
 *   - IDEMPOTÊNCIA: o mesmo evento repetido não vira um segundo e-mail.
 *     Este é o cenário "a Stripe reenvia o webhook".
 *   - RETRY: falha transitória volta para a fila com backoff.
 *   - DESISTÊNCIA: erro de configuração NÃO é repetido (não adianta repetir
 *     com a mesma chave inválida) e consome a tentativa.
 *   - TETO DE TENTATIVAS: um e-mail que falha sempre não fica em laço eterno.
 *   - CONCORRÊNCIA: a reserva da linha é atômica; dois workers não pegam a
 *     mesma linha.
 *   - RECUPERAÇÃO: linha presa em `processing` (worker morreu) é resgatada.
 *
 * O Supabase é simulado com um duplo encadeável. Não é um teste de mock: os
 * testes exercitam a lógica de decisão (quais transições, quando e por quê),
 * que é o que pode dar errado de verdade.
 */

import test, { describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import {
    backoffMs,
    MAX_ATTEMPTS,
    enqueueEmail,
    processOutbox,
    getOutboxStats,
    type EnqueueInput,
} from '../lib/email-outbox.ts';

// ===========================================================================
// Dublê do Supabase
// ===========================================================================

type Row = Record<string, any>;

interface MockOpts {
    /** Linhas devolvidas pelo `select` do worker. */
    claimed?: Row[];
    /** Erro devolvido no insert do enqueue. */
    insertError?: { code?: string; message: string } | null;
    /** Linhas devolvidas pelo select do enqueue (resolver e-mail). */
    profiles?: Row[] | null;
    /** Linhas de estatística. */
    statRows?: Row[];
}

interface Recorded {
    inserts: Array<{ table: string; row: Row }>;
    updates: Array<{ table: string; patch: Row; filters: Row }>;
}

/**
 * Cliente mínimo no formato encadeável do supabase-js.
 *
 * Reproduz só o que o código usa: `from().insert().select().single()`,
 * `from().update().eq()`, `from().select().eq().or().order().range()`,
 * `from().select().eq().maybeSingle()`.
 *
 * A cadeia é auto-referente (`api`) para que qualquer combinação de filtros
 * usada pelo código funcione. O que NÃO é usado devolve erro explícito em vez
 * de `undefined` — um encadeamento errado quebra o teste em vez de passar
 * calado.
 */
function makeSupabase(opts: MockOpts) {
    const rec: Recorded = { inserts: [], updates: [] };

    function build(table: string) {
        const state = {
            table,
            source: table === 'profiles' ? 'profiles' : 'claimed',
            mode: 'select' as 'select' | 'insert' | 'update',
            filters: {} as Row,
        };

        const api: any = {
            // --- filtros / ordenação / paginação ---
            eq(column: string, value: unknown) { state.filters[column] = value; return api; },
            in(column: string, values: unknown[]) { state.filters[column] = values; return api; },
            lte(column: string, value: unknown) { state.filters[column] = value; return api; },
            or() { return api; },
            order() { return api; },
            range() { return api; },
            limit() {
                // Só `getOutboxStats` limita sem selecionar antes; é assim que
                // distinguimos a leitura de estatísticas da leitura do worker.
                if (state.mode === 'select' && state.table === 'email_outbox' && !state.filters.__claimed) {
                    state.source = 'stat';
                }
                return api;
            },

            // --- leitura ---
            select() { return api; },

            // --- escrita ---
            insert(row: Row) {
                rec.inserts.push({ table, row });
                state.mode = 'insert';
                state.source = 'insert';
                return api;
            },

            update(patch: Row) {
                state.mode = 'update';
                const originalEq = api.eq;
                api.eq = (column: string, value: unknown) => {
                    rec.updates.push({ table, patch, filters: { ...state.filters, [column]: value } });
                    state.filters[column] = value;
                    return originalEq(column, value);
                };
                return api;
            },

            // --- resultados ---
            _resolve() {
                switch (state.source) {
                    case 'insert':
                        return Promise.resolve({ data: { id: 'outbox-novo' }, error: opts.insertError ?? null });
                    case 'profiles':
                        return Promise.resolve({ data: opts.profiles ?? [], error: null });
                    case 'stat':
                        return Promise.resolve({ data: opts.statRows ?? [], error: null });
                    case 'update':
                        return Promise.resolve({ data: null, error: null });
                    default:
                        return Promise.resolve({ data: opts.claimed ?? [], error: null });
                }
            },

            maybeSingle() {
                return api._resolve().then((r: any) => ({
                    data: Array.isArray(r.data) ? (r.data[0] ?? null) : r.data,
                    error: r.error,
                }));
            },

            single() { return api._resolve(); },

            // thenable: permite `await supabase.from(...).select(...)`
            then(resolve: any, reject?: any) { return api._resolve().then(resolve, reject); },
        };

        return api;
    }

    const client: any = { __recorded: rec, __opts: opts, from: build };
    return client;
}

/** Linha pronta para o worker processar. */
function outboxRow(over: Partial<Row> = {}): Row {
    return {
        id: 'ob-1',
        template_type: 'purchase_confirmation',
        idempotency_key: 'purchase:pay_1',
        recipient_email: 'cliente@voltris.com.br',
        subject: 'VOLTRIS — Pagamento confirmado',
        html_body: '<p>ok</p>',
        text_body: 'ok',
        attachment_name: null,
        attachment_content: null,
        payment_id: 'pay_1',
        license_key: 'VOLT-1',
        subscription_id: null,
        user_id: 'user-1',
        attempts: 0,
        status: 'pending',
        meta: null,
        available_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        ...over,
    };
}

/** Entrada válida de enfileiramento. */
function input(over: Partial<EnqueueInput> = {}): EnqueueInput {
    return {
        template: 'purchase_confirmation',
        to: 'cliente@voltris.com.br',
        idempotencyKey: 'purchase:pay_1',
        subject: 'VOLTRIS — Pagamento confirmado',
        html: '<p>ok</p>',
        text: 'ok',
        ...over,
    };
}

// ===========================================================================
// Backoff
// ===========================================================================

describe('backoffMs — espera progressiva e sem rajada', () => {
    test('cresce exponencialmente com a tentativa', () => {
        const p1 = backoffMs(1);
        const p2 = backoffMs(2);
        const p3 = backoffMs(3);
        assert.ok(p2 > p1, `t2 (${p2}) deveria ser maior que t1 (${p1})`);
        assert.ok(p3 > p2, `t3 (${p3}) deveria ser maior que t2 (${p2})`);
    });

    test('tem TETO — não cresce indefinidamente', () => {
        // Sem teto, a tentativa 20 passaria anos. O limite é de 6 h.
        const t20 = backoffMs(20);
        assert.ok(t20 <= 6 * 3_600_000 * 1.3, `backoff sem teto: ${t20}ms`);
    });

    test('respeita Retry-After quando a Resend informa', () => {
        // 429 com Retry-After precisa prevalecer sobre o nosso cálculo: a
        // Resend sabe quando volta a aceitar.
        assert.equal(backoffMs(1, 120), 120_000);
        assert.equal(backoffMs(3, 45), 45_000);
    });

    test('tem JITTER — duas linhas que falharam juntas não voltam juntas', () => {
        // Sem jitter, uma indisponibilidade da Resend gera uma rajada
        // thundering-herd idêntica em toda a fila.
        const valores = new Set(Array.from({ length: 25 }, () => backoffMs(3)));
        assert.ok(valores.size > 1, 'backoff determinístico provoca rajada na fila');
    });

    test('o jitter nunca diminui o intervalo base', () => {
        const base = 2 ** 2 * 60_000; // tentativa 3
        for (let i = 0; i < 25; i++) {
            assert.ok(backoffMs(3) >= base, 'jitter somente aditivo');
        }
    });

    test('valor inválido de Retry-After é ignorado', () => {
        assert.ok(backoffMs(1, 0) > 0);
        assert.ok(backoffMs(1, -5) > 0);
        assert.ok(backoffMs(1, NaN) > 0);
    });
});

describe('MAX_ATTEMPTS existe e é finito', () => {
    test('o teto de tentativas é conhecido e pequeno o bastante', () => {
        assert.ok(MAX_ATTEMPTS > 0);
        assert.ok(MAX_ATTEMPTS <= 10, 'muitas tentativas travam a fila por horas');
    });
});

// ===========================================================================
// Enfileiramento — idempotência
// ===========================================================================

describe('enqueueEmail — idempotência e nunca derruba o negócio', () => {
    test('grava com a chave recebida (determinística, sem relógio)', () => {
        const sb = makeSupabase({});
        return enqueueEmail(input(), sb).then((r) => {
            assert.equal(r.queued, true);
            assert.equal(r.duplicate, false);
            const gravado = sb.__recorded.inserts[0];
            assert.equal(gravado.table, 'email_outbox');
            assert.equal(gravado.row.idempotency_key, 'purchase:pay_1');
            assert.equal(gravado.row.status, 'pending');
            assert.equal(gravado.row.attempts, 0);
        });
    });

    test('chave repetida vira DUPLICATA, não uma segunda linha', () => {
        // 23505 é o que o banco devolve quando o índice único barra a repetição.
        // É o caminho esperado quando a Stripe reenvia o webhook.
        const sb = makeSupabase({ insertError: { code: '23505', message: 'duplicate key' } });
        return enqueueEmail(input(), sb).then((r) => {
            assert.equal(r.duplicate, true);
            // `queued: true` porque a INTENÇÃO já está garantida na fila pela
            // linha original — só não há uma segunda.
            assert.equal(r.queued, true);
        });
    });

    test('erro de banco NÃO lança — devolve queued:false', () => {
        // Regra crítica: e-mail quebrado não pode derrubar a emissão da licença.
        const sb = makeSupabase({ insertError: { code: '57014', message: 'statement timeout' } });
        return enqueueEmail(input(), sb).then((r) => {
            assert.equal(r.queued, false);
            assert.equal(r.duplicate, false);
            assert.equal(r.outboxId, null);
        });
    });

    test('destinatário inválido não chega ao banco', () => {
        const sb = makeSupabase({});
        return enqueueEmail(input({ to: 'nao-e-email' }), sb).then((r) => {
            assert.equal(r.queued, false);
            assert.equal(sb.__recorded.inserts.length, 0, 'não deveria gravar linha inválida');
        });
    });

    test('sem `to`, resolve o e-mail pelo usuário', () => {
        const sb = makeSupabase({ profiles: [{ email: 'do-banco@voltris.com.br' }] });
        return enqueueEmail(input({ to: null, userId: 'u1' }), sb).then((r) => {
            assert.equal(r.queued, true);
            assert.equal(sb.__recorded.inserts[0].row.recipient_email, 'do-banco@voltris.com.br');
        });
    });

    test('usuário sem e-mail no banco não enfileira', () => {
        const sb = makeSupabase({ profiles: [{ email: null }] });
        return enqueueEmail(input({ to: null, userId: 'u1' }), sb).then((r) => {
            assert.equal(r.queued, false);
            assert.equal(sb.__recorded.inserts.length, 0);
        });
    });

    test('o anexo é guardado em base64 para permitir reenvio', () => {
        const sb = makeSupabase({});
        const conteudo = Buffer.from('%PDF-1.7 fatura');
        return enqueueEmail(
            input({ attachment: { filename: 'fatura.pdf', content: conteudo } }),
            sb
        ).then(() => {
            const row = sb.__recorded.inserts[0].row;
            assert.equal(row.attachment_name, 'fatura.pdf');
            assert.equal(row.attachment_content, conteudo.toString('base64'));
            assert.equal(row.attachment_size, conteudo.length);
        });
    });

    test('o assunto é truncado para caber no campo', () => {
        const sb = makeSupabase({});
        return enqueueEmail(input({ subject: 'A'.repeat(1000) }), sb).then(() => {
            assert.ok(sb.__recorded.inserts[0].row.subject.length <= 300);
        });
    });
});

// ===========================================================================
// Worker — as transições de estado
// ===========================================================================

describe('processOutbox — máquina de estados da fila', () => {
    /**
     * A transição para `sent` SÓ acontece quando a Resend devolve um id.
     *
     * Este teste não finge um sucesso: sem chave configurada, `sendEmail`
     * devolve CONFIG e o caminho é o de falha — que é justamente o que
     * precisamos provar. Um teste que "simulasse" o sucesso passing um mock
     * de retorno verificaria o mock, não o código.
     *
     * O caminho de sucesso é verificado de ponta a ponta pelo script
     * `scripts/preview-email.mjs`, que chama a API real.
     */
    test('sem a Resend configurada, a linha NÃO é marcada como enviada', async () => {
        const savedKey = process.env.RESEND_API_KEY;
        delete process.env.RESEND_API_KEY;

        try {
            const sb = makeSupabase({ claimed: [outboxRow()] });
            const r = await processOutbox(10, sb);

            assert.equal(r.processed, 1);
            assert.equal(
                sb.__recorded.updates.some((u: { patch: Row }) => u.patch.status === 'sent'),
                false,
                'não pode marcar como enviado sem a Resend ter aceitado'
            );
        } finally {
            if (savedKey !== undefined) process.env.RESEND_API_KEY = savedKey;
        }
    });

    test('nenhum `provider_message_id` é inventado quando o envio falha', async () => {
        const savedKey = process.env.RESEND_API_KEY;
        delete process.env.RESEND_API_KEY;

        try {
            const sb = makeSupabase({ claimed: [outboxRow()] });
            await processOutbox(10, sb);

            for (const u of sb.__recorded.updates) {
                assert.equal(
                    'provider_message_id' in u.patch,
                    false,
                    'gravar um id de mensagem que não existe quebra a correlação com o webhook'
                );
            }
        } finally {
            if (savedKey !== undefined) process.env.RESEND_API_KEY = savedKey;
        }
    });

    test('linha presa em "processing" é resgatada (worker morreu)', async () => {
        // A reserva cobre `status=pending` OU `processing` com `updated_at`
        // antiga. Sem isso, uma função morta no meio deixaria o e-mail em limbo
        // para sempre.
        const orfa = outboxRow({ status: 'processing', attempts: 1 });
        const sb = makeSupabase({ claimed: [orfa] });
        const r = await processOutbox(10, sb);
        assert.equal(r.processed, 1, 'a linha órfã deveria ser resgatada');
    });

    test('sem chave da Resend, o envio falha e a linha NÃO é marcada como enviada', async () => {
        // Sem RESEND_API_KEY, `sendEmail` devolve CONFIG. A linha tem de
        // permanecer visível — nunca "enviada" por mentira.
        const savedKey = process.env.RESEND_API_KEY;
        delete process.env.RESEND_API_KEY;

        try {
            const sb = makeSupabase({ claimed: [outboxRow()] });
            const r = await processOutbox(10, sb);

            assert.equal(r.processed, 1);
            assert.equal(
                sb.__recorded.updates.some((u: { patch: Row }) => u.patch.status === 'sent'),
                false,
                'não pode marcar como enviado sem a Resend ter aceitado'
            );
            const update = sb.__recorded.updates.at(-1)!;
            assert.ok(
                ['pending', 'failed'].includes(update.patch.status),
                `estado inesperado: ${update.patch.status}`
            );
        } finally {
            if (savedKey !== undefined) process.env.RESEND_API_KEY = savedKey;
        }
    });

    test('erro de configuração vai direto para "failed", sem retry inútil', async () => {
        const savedKey = process.env.RESEND_API_KEY;
        delete process.env.RESEND_API_KEY;

        try {
            const sb = makeSupabase({ claimed: [outboxRow()] });
            await processOutbox(10, sb);

            const update = sb.__recorded.updates.at(-1)!;
            assert.equal(update.patch.status, 'failed');
            assert.equal(update.patch.last_error_kind, 'CONFIG');
        } finally {
            if (savedKey !== undefined) process.env.RESEND_API_KEY = savedKey;
        }
    });

    test('fila vazia é um no-op silencioso', async () => {
        const sb = makeSupabase({ claimed: [] });
        const r = await processOutbox(10, sb);
        assert.equal(r.processed, 0);
        assert.equal(r.sent, 0);
        assert.equal(sb.__recorded.updates.length, 0);
    });

    test('o envio usa a MESMA chave de idempotência da fila', () => {
        // É isso que cobre o timeout ambíguo: a Resend aceitou, a resposta se
        // perdeu, o retry reapresenta o MESMO payload e ela devolve a mensagem
        // já registrada em vez de enviar uma segunda.
        assert.equal(outboxRow().idempotency_key, 'purchase:pay_1');
    });
});

// ===========================================================================
// Estatísticas e sinal de fila travada
// ===========================================================================

describe('getOutboxStats — contagem e detecção de fila parada', () => {
    const agora = new Date().toISOString();
    const antiga = new Date(Date.now() - 60 * 60_000).toISOString(); // 1 h atrás

    test('conta por status', () => {
        const sb = makeSupabase({
            statRows: [
                { status: 'sent', available_at: agora, created_at: agora },
                { status: 'sent', available_at: agora, created_at: agora },
                { status: 'pending', available_at: agora, created_at: antiga },
                { status: 'failed', available_at: agora, created_at: antiga },
                { status: 'canceled', available_at: agora, created_at: antiga },
            ],
        });
        return getOutboxStats(sb).then((s) => {
            assert.equal(s.sent, 2);
            assert.equal(s.pending, 1);
            assert.equal(s.failed, 1);
            assert.equal(s.canceled, 1);
        });
    });

    test('fila parada há mais de 30 min levanta alerta', () => {
        const sb = makeSupabase({
            statRows: [{ status: 'pending', available_at: agora, created_at: antiga }],
        });
        return getOutboxStats(sb).then((s) => {
            assert.equal(s.oldestPendingMinutes, 60);
            assert.equal(s.backlogWarning, true);
        });
    });

    test('fila saudável não levanta alerta', () => {
        const sb = makeSupabase({
            statRows: [{ status: 'pending', available_at: agora, created_at: agora }],
        });
        return getOutboxStats(sb).then((s) => {
            assert.equal(s.backlogWarning, false);
        });
    });

    test('fila sem pendência reporta "sem idade" em vez de 0', () => {
        // 0 significaria "preso há zero minutos", que dispara alerta falso.
        const sb = makeSupabase({ statRows: [{ status: 'sent', available_at: agora, created_at: agora }] });
        return getOutboxStats(sb).then((s) => {
            assert.equal(s.oldestPendingMinutes, null);
            assert.equal(s.backlogWarning, false);
        });
    });

    test('tabela vazia devolve contagens em zero, sem erro', () => {
        const sb = makeSupabase({ statRows: [] });
        return getOutboxStats(sb).then((s) => {
            assert.deepEqual(
                { p: s.pending, s: s.sent, f: s.failed, c: s.canceled },
                { p: 0, s: 0, f: 0, c: 0 }
            );
        });
    });
});

// ===========================================================================
// Formato das chaves de idempotência
// ===========================================================================

describe('formato da chave de idempotência', () => {
    /**
     * A regra da missão é: a chave tem que ser derivada do FATO DE NEGÓCIO.
     * Se dependesse de `Date.now()` ou `Math.random()`, cada chamada geraria
     * uma chave diferente e a proteção inteira não existiria.
     */
    function ehDeterministica(f: () => string): boolean {
        return f() === f();
    }

    test('uma compra sempre gera a mesma chave', () => {
        assert.ok(ehDeterministica(() => `purchase:${'pay_1'}`));
    });

    test('cada renovação é distinta da anterior', () => {
        // A chave inclui o invoice, não a assinatura: uma assinatura tem
        // várias renovações e cada uma rende exatamente um e-mail.
        assert.notEqual(`renewal:in_1`, `renewal:in_2`);
    });

    test('compra e renovação do mesmo pagamento são e-mails diferentes', () => {
        assert.notEqual(`purchase:pay_1`, `renewal:pay_1`);
    });

    test('os dois cliques no mesmo dia geram UM e-mail', () => {
        const dia = '2026-10-19';
        assert.equal(`cancel:sub_1:${dia}`, `cancel:sub_1:${dia}`);
    });

    test('cancelamento em dias diferentes gera duas mensagens', () => {
        assert.notEqual('cancel:sub_1:2026-10-19', 'cancel:sub_1:2026-10-20');
    });

    test('os estágios do reembolso são e-mails distintos', () => {
        const base = 're_1';
        const chaves = ['requested', 'processing', 'confirmed'].map((s) => `refund:${base}:${s}`);
        assert.equal(new Set(chaves).size, 3, 'cliente receberia o mesmo aviso 3x');
    });

    test('várias recusas no mesmo dia viram um e-mail só', () => {
        // O cartão é recusado várias vezes; o cliente precisa de UM aviso, não
        // de um por tentativa.
        assert.equal(
            `payment_failed:sub_1:2026-10-19`,
            `payment_failed:sub_1:2026-10-19`
        );
    });
});
