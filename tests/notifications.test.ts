/**
 * SISTEMA DE NOTIFICAÇÕES — o que precisa continuar verdade.
 *
 * O que estava quebrado (medido em 2026-10-19) e o que estes testes impedem
 * que volte:
 *
 *  - a tabela nunca foi publicada no Realtime (o sino só atualizava ao
 *    recarregar a página);
 *  - não havia policy de UPDATE/DELETE (marcar como lida mentia: o estado
 *    mudava na tela, não no banco);
 *  - as triggers de status gravavam em colunas inexistentes (nenhuma
 *    notificação chegava ao cliente quando o admin respondia um ticket);
 *  - nenhuma compra, renovação, falha de pagamento ou reembolso gerava
 *    notificação in-app — só e-mail.
 *
 * Além disso, o requisito mais importante: **um usuário só enxerga as
 * próprias notificações**. O isolamento é feito no SERVIDOR, com o
 * `user_id` da sessão — nunca com um id vindo do corpo da requisição.
 */

import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
    tipoParaGravacao,
    ehVisivelParaCliente,
    KIND_TO_TYPE,
} from '../lib/notification-kinds.ts';

const rotaUsuario = readFileSync('app/api/notifications/route.ts', 'utf8');
const rotaAdmin = readFileSync('app/api/admin/notifications/route.ts', 'utf8');
const servico = readFileSync('services/notificationService.ts', 'utf8');
const sql = readFileSync('SQLCOMPLETO.sql', 'utf8');
const contexto = readFileSync('components/notifications/NotificationContext.tsx', 'utf8');
const painel = readFileSync('app/restricted-area-admin/page.tsx', 'utf8');
const webhook = readFileSync('app/api/webhook/stripe/route.ts', 'utf8');
const pedidos = readFileSync('app/api/orders/route.ts', 'utf8');
const tickets = readFileSync('app/api/tickets/route.ts', 'utf8');
const reembolso = readFileSync('app/api/stripe/refund/route.ts', 'utf8');
const diretorio = readFileSync('app/api/admin/directory/route.ts', 'utf8');

describe('mapeamento de tipos (o app funciona antes e depois do SQL)', () => {
    test('sem os tipos novos, usa o tipo base que o enum já aceita', () => {
        assert.equal(tipoParaGravacao('license', false), 'order');
        assert.equal(tipoParaGravacao('service', false), 'order');
        assert.equal(tipoParaGravacao('refund', false), 'system');
        assert.equal(tipoParaGravacao('ticket_reply', false), 'ticket');
    });

    test('com os tipos novos, usa o tipo refinado', () => {
        assert.equal(tipoParaGravacao('license', true), 'license');
        assert.equal(tipoParaGravacao('service', true), 'service');
        assert.equal(tipoParaGravacao('refund', true), 'refund');
    });

    test('todo tipo de negócio tem mapeamento', () => {
        for (const kind of Object.keys(KIND_TO_TYPE)) {
            assert.ok(tipoParaGravacao(kind as any, true));
            assert.ok(tipoParaGravacao(kind as any, false));
        }
    });

    test('newsletter e comentário não são do cliente', () => {
        assert.equal(ehVisivelParaCliente('newsletter'), false);
        assert.equal(ehVisivelParaCliente('comment'), false);
        assert.equal(ehVisivelParaCliente('order'), true);
        assert.equal(ehVisivelParaCliente('license'), true);
    });
});

describe('isolamento: o usuário só vê as próprias notificações', () => {
    test('a rota do usuário filtra pelo user_id da SESSÃO', () => {
        assert.match(rotaUsuario, /usuarioDaSessao/);
        assert.match(rotaUsuario, /\.eq\('user_id', userId\)/);
    });

    test('o corpo da requisição NÃO escolhe o dono da notificação', () => {
        // Se aparecer `user_id` vindo do body, o isolamento quebra.
        const corpo = /await req\.json\(\)/.exec(rotaUsuario)?.[0] ?? '';
        assert.ok(corpo.length > 0);
        const blocoBody = rotaUsuario.slice(rotaUsuario.indexOf('await req.json()'), rotaUsuario.indexOf('await req.json()') + 400);
        assert.ok(
            !/user_id\s*[:=]\s*body/.test(blocoBody),
            'o user_id não pode vir do corpo da requisição'
        );
    });

    test('a marcação de lida também é escopada no usuário', () => {
        const trecho = rotaUsuario.slice(rotaUsuario.indexOf('export async function PATCH'));
        assert.match(trecho, /\.eq\('user_id', userId\)/);
    });

    test('a limpeza também é escopada no usuário', () => {
        const trecho = rotaUsuario.slice(rotaUsuario.indexOf('export async function DELETE'));
        assert.match(trecho, /\.eq\('user_id', userId\)/);
    });

    test('o cliente consome a API do servidor, não a tabela direto', () => {
        assert.match(contexto, /fetch\('\/api\/notifications/);
        assert.ok(
            !/from\('notifications'\)\s*\.select/.test(contexto),
            'o cliente não deve ler a tabela direto (RLS não garante o filtro)'
        );
    });
});

describe('autorização do painel', () => {
    test('a rota admin exige capacidade e audita', () => {
        assert.match(rotaAdmin, /requireCapability\('notifications\.read'\)/);
        assert.match(rotaAdmin, /auditAction/);
    });

    test('a escrita exige tickets.write / notifications.write', () => {
        assert.match(rotaAdmin, /requireCapability\('notifications\.write'\)/);
        assert.match(diretorio, /'tickets\.write'/);
    });

    test('a aba de notificações existe no painel', () => {
        assert.match(painel, /value: 'notifications'/);
        assert.match(painel, /AdminNotificationsTab/);
    });
});

describe('SQL de correção (aplicar no Supabase)', () => {
    test('policy de UPDATE e DELETE do próprio usuário', () => {
        assert.match(sql, /Users can update their own notifications/);
        assert.match(sql, /Users can delete their own notifications/);
    });

    test('INSERT fica só com service_role (não dá para forjar aviso)', () => {
        assert.match(sql, /service role only inserts notifications/);
        assert.match(sql, /DROP POLICY IF EXISTS "Users can insert their own notifications"/);
    });

    test('notifications entra na publicação do Realtime', () => {
        assert.match(sql, /ALTER PUBLICATION supabase_realtime ADD TABLE public\.notifications/);
        assert.match(sql, /pg_publication_tables/);
    });

    test('os tipos novos do enum', () => {
        for (const t of ['license', 'service', 'refund']) {
            assert.match(sql, new RegExp(`ADD VALUE IF NOT EXISTS '${t}'`));
        }
    });

    test('as triggers corrigidas não usam coluna nem enum inexistente', () => {
        assert.ok(!/body,/.test(sql), 'a coluna body não existe na tabela');
        assert.ok(!/insert into notifications \(user_id, type, title, body/.test(sql.toLowerCase()));
        assert.match(sql, /notify_ticket_status_change/);
        assert.match(sql, /notify_order_status_change/);
    });

    test('as triggers não duplicam a notificação do painel', () => {
        assert.match(sql, /caller_role = 'service_role'/);
    });

    test('índices de leitura do sino', () => {
        assert.match(sql, /idx_notifications_user_created/);
        assert.match(sql, /idx_notifications_user_unread/);
    });
});

describe('os eventos do negócio geram notificação', () => {
    test('compra/licença: cliente e admin', () => {
        assert.match(webhook, /kind: 'license'/);
        assert.match(webhook, /kind: 'purchase'/);
        assert.match(webhook, /notifyAdmins/);
    });

    test('renovação e pagamento recusado', () => {
        assert.match(webhook, /kind: 'subscription'/);
        assert.match(webhook, /kind: 'payment_failed'/);
    });

    test('pedido de serviço: cliente e admin', () => {
        assert.match(pedidos, /kind: 'service'/);
        assert.match(pedidos, /notifyAdmins/);
    });

    test('ticket: abertura avisa o admin, resposta avisa o cliente', () => {
        assert.match(tickets, /kind: 'ticket'/);
        assert.match(tickets, /notifyAdmins/);
        assert.match(diretorio, /kind: 'ticket_reply'/);
    });

    test('reembolso: as três etapas', () => {
        assert.match(reembolso, /notificarReembolso/);
        assert.match(reembolso, /stage: 'requested'/);
        assert.match(reembolso, /'confirmed' : 'processing'/);
    });
});

describe('o serviço grava e nunca derruba o fluxo', () => {
    test('detecta as capacidades do banco em runtime', () => {
        assert.match(servico, /capabilitiesDoBanco/);
        assert.match(servico, /action_url, data, audience/);
    });

    test('envia push só quando há VAPID configurado', () => {
        assert.match(servico, /pushConfigurado/);
        assert.match(servico, /VAPID não configurado/);
    });

    test('admin bloqueado não recebe alerta de operação', () => {
        assert.match(servico, /is_blocked/);
    });
});

describe('painel com a mesma cara do dashboard', () => {
    test('a sidebar usa o sistema de menu do dashboard (.vtab)', () => {
        assert.match(painel, /className=\{`vtab/);
        assert.match(painel, /vtab__ico/);
        assert.match(painel, /--vtab-color/);
    });

    test('usa os ícones coloridos do VOLTRIS (VoltrisIcon)', () => {
        assert.match(painel, /from '@\/components\/dashboard\/VoltrisIcon'/);
        assert.match(painel, /icon: 'bell'/);
    });

    test('fundo e cartões iguais aos do dashboard', () => {
        assert.match(painel, /bg-\[#0a0a0f\]/);
        assert.match(painel, /bg-\[#12121A\]/);
        assert.match(painel, /radial-gradient/);
    });
});
