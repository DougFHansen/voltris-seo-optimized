import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { NotificationService } from '@/services/notificationService';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * CHAMADOS DE SUPORTE (TICKETS) — criação e resposta.
 *
 * Por que uma rota de servidor: para notificar o admin é preciso gravar em
 * `notifications` com `service_role` (a policy de INSERT é só do servidor
 * agora). Se a criação continuasse happening direto do navegador, o admin
 * nunca ficaria sabendo do chamado.
 */

const db = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function usuarioDaSessao(req: NextRequest): Promise<string | null> {
    const auth = req.headers.get('authorization');
    if (!auth?.toLowerCase().startsWith('bearer ')) return null;
    const token = auth.slice(7).trim();
    if (!token) return null;
    const { data, error } = await db.auth.getUser(token);
    if (error || !data?.user?.id) return null;
    return data.user.id;
}

export async function POST(req: NextRequest) {
    const userId = await usuarioDaSessao(req);
    if (!userId) {
        return NextResponse.json(
            { error: 'Sessão inválida. Faça login novamente.', code: 'UNAUTHENTICATED' },
            { status: 401 }
        );
    }

    let body: {
        action?: 'create' | 'reply';
        title?: string;
        description?: string;
        priority?: string;
        ticketId?: string;
        reply?: string;
    } = {};
    try {
        body = await req.json();
    } catch {
        body = {};
    }

    try {
        /* ------------------------------------------------ novo chamado */
        if (!body.action || body.action === 'create') {
            const title = String(body.title ?? '').trim();
            const description = String(body.description ?? '').trim();
            const priority = ['low', 'medium', 'high'].includes(String(body.priority))
                ? String(body.priority)
                : 'medium';

            if (title.length < 3) {
                return NextResponse.json(
                    { error: 'Descreva o assunto do chamado (mínimo 3 letras).', code: 'INVALID_BODY' },
                    { status: 400 }
                );
            }
            if (description.length < 5) {
                return NextResponse.json(
                    { error: 'Descreva o problema com mais detalhes.', code: 'INVALID_BODY' },
                    { status: 400 }
                );
            }

            const { data: ticket, error: ticketError } = await db
                .from('tickets')
                .insert({
                    title,
                    status: 'Aberto',
                    user_id: userId,
                    priority,
                })
                .select('id, title, status, priority')
                .single();

            if (ticketError) {
                console.error('[api/tickets] erro ao criar chamado:', ticketError);
                return NextResponse.json(
                    { error: 'Não foi possível abrir o chamado.', code: 'DB_WRITE_FAILED' },
                    { status: 500 }
                );
            }

            await db.from('ticket_messages').insert({
                ticket_id: ticket.id,
                content: description,
                user_id: userId,
            });

            const { data: profile } = await db
                .from('profiles')
                .select('full_name, email')
                .eq('id', userId)
                .maybeSingle();
            const nome = profile?.full_name || profile?.email || 'Cliente';

            // Cliente: confirmação de que o chamado entrou na fila.
            // Admin: alerta de novo chamado (com o nome e o assunto).
            try {
                await NotificationService.notify({
                    recipients: [userId],
                    kind: 'ticket',
                    title: 'Chamado aberto com sucesso',
                    message: `Recebemos o seu chamado "${title}". Nossa equipe responde por aqui.`,
                    actionUrl: '/dashboard/tickets',
                    data: { ticket_id: ticket.id, title, priority },
                });
                await NotificationService.notifyAdmins({
                    kind: 'ticket',
                    title: 'Novo chamado de suporte',
                    message: `${nome} abriu o chamado "${title}" (prioridade ${priority}).`,
                    actionUrl: '/restricted-area-admin?tab=tickets',
                    data: { ticket_id: ticket.id, title, priority, user_id: userId },
                });
            } catch (e) {
                // O chamado JÁ foi criado: a notificação é efeito colateral.
                console.error('[api/tickets] chamado criado, mas notificação falhou:', e);
            }

            return NextResponse.json({ ok: true, ticket });
        }

        /* ------------------------------------------------- resposta */
        if (body.action === 'reply') {
            const ticketId = String(body.ticketId ?? '');
            const reply = String(body.reply ?? '').trim();
            if (!ticketId || reply.length < 1) {
                return NextResponse.json(
                    { error: 'Mensagem vazia.', code: 'INVALID_BODY' },
                    { status: 400 }
                );
            }

            // Só responde em chamado que é SEU.
            const { data: ticket } = await db
                .from('tickets')
                .select('id, title, user_id')
                .eq('id', ticketId)
                .maybeSingle();

            if (!ticket || ticket.user_id !== userId) {
                return NextResponse.json(
                    { error: 'Chamado não encontrado.', code: 'NOT_FOUND' },
                    { status: 404 }
                );
            }

            const { error: msgError } = await db
                .from('ticket_messages')
                .insert({ ticket_id: ticketId, content: reply, user_id: userId });
            if (msgError) {
                return NextResponse.json(
                    { error: 'Não foi possível enviar a mensagem.', code: 'DB_WRITE_FAILED' },
                    { status: 500 }
                );
            }

            try {
                await NotificationService.notifyAdmins({
                    kind: 'ticket',
                    title: 'Nova mensagem em chamado',
                    message: `O cliente respondeu o chamado "${ticket.title}".`,
                    actionUrl: '/restricted-area-admin?tab=tickets',
                    data: { ticket_id: ticketId, user_id: userId },
                });
            } catch (e) {
                console.error('[api/tickets] resposta enviada, mas notificação falhou:', e);
            }

            return NextResponse.json({ ok: true });
        }

        return NextResponse.json(
            { error: 'Ação desconhecida.', code: 'INVALID_BODY' },
            { status: 400 }
        );
    } catch (e: any) {
        console.error('[api/tickets] exceção:', e);
        return NextResponse.json(
            { error: 'Erro interno ao processar o chamado.', code: 'UNKNOWN' },
            { status: 500 }
        );
    }
}
