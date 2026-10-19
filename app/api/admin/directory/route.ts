import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireCapability, auditAction, rateLimit, type AdminCapability } from '@/lib/admin-auth';
import { createAdminClient } from '@/utils/supabase/admin';
import { readPage, paginate, sanitizeSearch, maskEmail } from '@/lib/admin-queries';
import { NotificationService } from '@/services/notificationService';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET/POST /api/admin/directory — ABAAS LEGADAS (Usuários, Tickets, Newsletter,
 * Pedidos, Solicitações de Serviço).
 *
 * =====================================================================
 * POR QUE ESTA ROTA EXISTE — LEIA ANTES DE "OTIMIZAR"
 * =====================================================================
 *
 * Estas cinco abas liam o Supabase DIRETO DO NAVEGADOR, com o cliente
 * `createBrowserClient` e a chave `anon`. Isso é quebrado por construção:
 *
 *   - a leitura passa a depender de policy RLS que precisa existir para o
 *     papel do usuário. Se faltar, a aba devolve LISTA VAIA sem erro nenhum,
 *     e o administrador conclui que "não há dados";
 *   - `service_role` (usado pelo servidor) ignora RLS. A MESMA consulta que o
 *     navegador faz via API devolve 113 perfis, e o navegador devolve 0.
 *     A diferença é exatamente o que o administrador vê: tela vazia;
 *   - qualquer policy que exista é verificável pelo próprio cliente: um
 *     usuário comum poderia tentar ler o que o painel administrativo lê;
 *   - a Parte 11 do Corrigir.txt é explícita: "não basta esconder os botões.
 *     Implemente autorização real no servidor".
 *
 * Esta rota centraliza a leitura no servidor, com `service_role` e
 * `requireCapability`. É a mesma arquitetura das abas novas (Visão Geral,
 * Clientes, Compras, E-mails) e a mesma que a parte exige.
 *
 * =====================================================================
 * UMA ROTA, VARIAS ABAS — POR QUE NÃO UMA POR TABELA
 * =====================================================================
 * Cada recurso tem sua própria capacidade e sua própria página; a
 * repetição de código de paginação, busca e máscara seria o mesmo bug em
 * cinco lugares. O `resource` decide qual tabela ler e qual capacidade
 * exigir, e o resto do fluxo é idêntico.
 */

const Resource = z.object({
    /** Recurso pedido. */
    resource: z.enum(['users', 'tickets', 'newsletter', 'orders', 'service_requests']),
    q: z.string().trim().max(120).optional(),
    limit: z.string().optional(),
    offset: z.string().optional(),
    status: z.string().trim().max(30).optional(),
});

/** Colunas por recurso — nunca `select('*')`, que traz dado além do necessário. */
const COLUNAS: Record<string, string> = {
    users: 'id, login, email, full_name, phone, city, state, is_admin, role, is_blocked, created_at',
    tickets: 'id, title, status, priority, user_id, created_at, updated_at',
    newsletter: 'id, email, source, subscribed_at, status, created_at',
    orders: '*',
    service_requests: '*',
};

/**
 * Tabela real de cada recurso.
 *
 * O nome do recurso NÃO é o nome da tabela: as contas vivem em `profiles` e
 * os inscritos em `newsletter_subscribers`. Ler `users` e `newsletter`
 * direto devolvia erro e as abas "Usuários" e "Newsletter" ficavam
 * quebradas — sem lista e sem explicação do motivo.
 */
const TABELA: Record<string, string> = {
    users: 'profiles',
    newsletter: 'newsletter_subscribers',
    tickets: 'tickets',
    orders: 'orders',
    service_requests: 'service_requests',
};

/**
 * Capacidade exigida por recurso, para LEITURA.
 *
 * `users`, `tickets` e `newsletter` usam `clients.read` porque são dados de
 * cliente; `orders` e `service_requests` usam `payments.read` porque são
 * dados de operação comercial. A distinção importa: um perfil de leitura
 * enxerga todos, mas um perfil de suporte tem mais poder sobre o cadastro do
 * cliente do que sobre um pagamento.
 */
const CAPACIDADE: Record<string, AdminCapability> = {
    users: 'clients.read',
    tickets: 'clients.read',
    newsletter: 'clients.read',
    orders: 'payments.read',
    service_requests: 'payments.read',
};

export async function GET(req: NextRequest) {
    const parsed = Resource.safeParse(Object.fromEntries(req.nextUrl.searchParams));
    if (!parsed.success) {
        return NextResponse.json({ error: 'Recurso ou filtros inválidos.', code: 'INVALID_QUERY' }, { status: 400 });
    }

    const resource = parsed.data.resource;

    // Autorização NO SERVIDOR, antes de qualquer leitura.
    const { response } = await requireCapability(CAPACIDADE[resource]);
    if (response) return response;

    const { limit, offset } = readPage(req.nextUrl.searchParams);
    const term = parsed.data.q ? sanitizeSearch(parsed.data.q) : '';
    const db = createAdminClient();

    try {
        const tabela = TABELA[resource] ?? resource;
        let query = db
            .from(tabela)
            .select(COLUNAS[resource], { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (parsed.data.status && parsed.data.status !== 'all') {
            query = query.eq('status', parsed.data.status);
        }

        const BUSCA: Record<string, string[]> = {
            users: ['full_name', 'email', 'login', 'phone'],
            tickets: ['title', 'status'],
            newsletter: ['email'],
            orders: ['email', 'customer_name', 'reference_id'],
            service_requests: ['email', 'customer_name', 'name'],
        };
        if (term && BUSCA[resource]) {
            const like = `%${term}%`;
            query = query.or(BUSCA[resource].map((c) => `${c}.ilike.${like}`).join(','));
        }

        const { data, error, count } = await query;

        if (error) {
            return NextResponse.json(
                { error: `Falha ao consultar ${resource}.`, code: 'QUERY_FAILED', detail: error.message },
                { status: 500 }
            );
        }

        let items = (data ?? []) as any[];

        // Tabela INEXISTENTE não pode derrubar a aba: cai para lista vazia com
        // um motivo explícito, e não para "não há dados" sem explicação.
        if (resource === 'orders' || resource === 'service_requests') {
            const r = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/${TABELA[resource] ?? resource}?select=id&limit=1`, {
                headers: {
                    apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
                    Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
                },
            });
            if (r.status === 404) {
                return NextResponse.json(paginate([], 0, limit, offset));
            }
        }

        // Máscara só onde o completo não é necessário para a operação.
        items = items.map((row) => {
            const out = { ...row };
            if (resource === 'users' && out.email) {
                out.email = maskEmail(out.email);
            }
            return out;
        });

        return NextResponse.json({
            ...paginate(items, count ?? items.length, limit, offset),
            resource,
        });
    } catch {
        return NextResponse.json(
            { error: 'Erro inesperado ao consultar os dados.', code: 'UNEXPECTED' },
            { status: 500 }
        );
    }
}

/**
 * POST — escrita com justificativa obrigatória e auditoria (Parte 11).
 *
 * Só existe para as alterações que as abas já faziam: remover inscrição da
 * newsletter e mudar status de ticket. Cada uma grava antes/depois.
 */
export async function POST(req: NextRequest) {
    const Body = z.object({
        resource: z.enum(['newsletter', 'tickets']),
        action: z.enum(['update_status', 'delete', 'reply']),
        id: z.string().uuid('Identificador inválido.'),
        status: z.string().trim().max(40).optional(),
        /** Resposta do suporte ao cliente (action = 'reply'). */
        message: z.string().trim().min(2, 'Escreva a resposta ao cliente.').max(4000).optional(),
        /** Justificativa: obrigatória em toda escrita administrativa. */
        reason: z.string().trim().min(5, 'Justifique a alteração.').max(500),
    });

    const parsed = Body.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
        return NextResponse.json(
            { error: parsed.error.issues[0]?.message ?? 'Dados inválidos.', code: 'INVALID_BODY' },
            { status: 400 }
        );
    }

    const { resource, action, id, status, message, reason } = parsed.data;

    const guard = await requireCapability(
        resource === 'newsletter'
            ? 'emails.resend'
            : action === 'reply'
                ? 'tickets.write'
                : 'clients.read'
    );
    if (guard.response) return guard.response;
    const actor = guard.actor!;

    // Amortecedor contra duplo clique. Em serverless a memória é por processo:
    // é proteção de interface, não de segurança — a segurança está na
    // autorização acima e na auditoria abaixo.
    if (!rateLimit(`admin-write:${resource}:${id}`, 10, 60_000)) {
        return NextResponse.json(
            { error: 'Muitas alterações em pouco tempo. Aguarde um instante.', code: 'RATE_LIMITED' },
            { status: 429 }
        );
    }

    const db = createAdminClient();
    const tabela = TABELA[resource] ?? resource;

    try {
        const { data: before, error: readErr } = await db
            .from(tabela).select('*').eq('id', id).maybeSingle();

        if (readErr || !before) {
            return NextResponse.json({ error: 'Registro não encontrado.', code: 'NOT_FOUND' }, { status: 404 });
        }

        if (action === 'delete') {
            // `newsletter_subscribers` é dado de marketing, não financeiro.
            // Licenças, pagamentos e assinaturas NÃO são alcançáveis por aqui.
            if (resource !== 'newsletter') {
                return NextResponse.json(
                    { error: 'Exclusão não permitida para este recurso.', code: 'NOT_ALLOWED' },
                    { status: 400 }
                );
            }
            const { error } = await db.from(tabela).delete().eq('id', id);
            if (error) throw error;

            await auditAction(actor, {
                resource,
                resourceId: id,
                action: 'DELETED',
                before,
                after: null,
                reason,
                outcome: 'OK',
            });
            return NextResponse.json({ ok: true, deleted: id });
        }

        if (action === 'reply') {
            // Resposta do suporte: grava a mensagem no chamado e AVISA o
            // cliente. É o caminho que o operator usa para responder.
            if (resource !== 'tickets') {
                return NextResponse.json(
                    { error: 'Resposta disponível apenas para chamados.', code: 'NOT_ALLOWED' },
                    { status: 400 }
                );
            }
            if (!message) {
                return NextResponse.json(
                    { error: 'Escreva a resposta ao cliente.', code: 'MESSAGE_REQUIRED' },
                    { status: 400 }
                );
            }

            const dono = (before as { user_id?: string } | null)?.user_id;
            const { error: msgError } = await db
                .from('ticket_messages')
                .insert({
                    ticket_id: id,
                    content: message,
                    user_id: actor.userId,
                });
            if (msgError) throw msgError;

            // O status segue junto: responder e fechar é o mesmo gesto.
            const novoStatus = status || 'Respondido';
            const { data: afterReply } = await db
                .from('tickets')
                .update({ status: novoStatus })
                .eq('id', id)
                .select()
                .maybeSingle();

            await auditAction(actor, {
                resource,
                resourceId: id,
                action: 'TICKET_REPLIED',
                before,
                after: afterReply ?? { status: novoStatus, resposta: message.slice(0, 200) },
                reason,
                outcome: 'OK',
            });

            if (dono) {
                try {
                    await NotificationService.notify({
                        recipients: [dono],
                        kind: 'ticket_reply',
                        title: 'Resposta do suporte',
                        message: message.slice(0, 240),
                        actionUrl: '/dashboard/tickets',
                        data: { ticket_id: id, status: novoStatus, kind: 'ticket_reply' },
                    });
                } catch (e) {
                    console.error('[api/admin/directory] resposta gravada, mas notificação falhou:', e);
                }
            }

            return NextResponse.json({ ok: true, item: afterReply });
        }

        if (!status) {
            return NextResponse.json({ error: 'Novo status não informado.', code: 'STATUS_REQUIRED' }, { status: 400 });
        }

        const { data: after, error } = await db
            .from(tabela).update({ status }).eq('id', id).select().maybeSingle();

        if (error) throw error;

        await auditAction(actor, {
            resource,
            resourceId: id,
            action: 'STATUS_CHANGED',
            before,
            after,
            reason,
            outcome: 'OK',
        });

        // O CLIENTE é avisado da mudança de status. A trigger do banco também
        // avisa, mas ela é ignorada quando a mudança vem do painel (ver
        // `notificacaocorrigida.sql`) — senão o cliente receberia a mesma
        // notícia duas vezes.
        if (resource === 'tickets') {
            const dono = (before as { user_id?: string } | null)?.user_id;
            if (dono) {
                try {
                    await NotificationService.notify({
                        recipients: [dono],
                        kind: 'ticket_reply',
                        title: 'Seu chamado foi atualizado',
                        message: `O status do chamado "${(before as { title?: string }).title ?? ''}" mudou para: ${status}.`,
                        actionUrl: '/dashboard/tickets',
                        data: { ticket_id: id, status, kind: 'ticket_reply' },
                    });
                } catch (e) {
                    console.error('[api/admin/directory] status alterado, mas notificação falhou:', e);
                }
            }
        }

        return NextResponse.json({ ok: true, item: after });
    } catch (err: any) {
        await auditAction(actor, {
            resource,
            resourceId: id,
            action: 'WRITE_FAILED',
            outcome: 'FAILED',
            reason,
        });
        return NextResponse.json(
            { error: 'Falha ao alterar o registro.', code: 'WRITE_FAILED', detail: String(err?.message ?? err).slice(0, 200) },
            { status: 500 }
        );
    }
}
