import { NextRequest, NextResponse } from 'next/server';
import { requireCapability, auditAction } from '@/lib/admin-auth';
import { createAdminClient } from '@/utils/supabase/admin';
import { maskEmail } from '@/lib/admin-queries';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * DETALHE DE UM CHAMADO (ticket) — com a conversa inteira.
 *
 * A aba de Tickets do painel mostrava SÓ a lista. Não havia como abrir o
 * chamado nem ler a mensagem do cliente: o operador via o assunto e nada mais.
 *
 * Aqui o operador abre o chamado e recebe:
 *   - o ticket (assunto, status, prioridade, quando);
 *   - TODAS as mensagens, em ordem cronológica;
 *   - quem é o cliente (nome, e-mail mascarado, telefone, login).
 */
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const { actor, response } = await requireCapability('clients.read');
    if (response) return response;

    const id = params?.id;
    if (!id || !/^[0-9a-f-]{16,40}$/i.test(id)) {
        return NextResponse.json({ error: 'Chamado inválido.' }, { status: 400 });
    }

    const db = createAdminClient();

    try {
        const { data: ticket, error } = await db
            .from('tickets')
            .select('id, title, status, priority, user_id, created_at, updated_at')
            .eq('id', id)
            .maybeSingle();

        if (error) {
            console.error('[api/admin/tickets] erro ao buscar o chamado:', error);
            return NextResponse.json(
                { error: 'Não foi possível carregar o chamado.', code: 'DB_READ_FAILED' },
                { status: 500 }
            );
        }
        if (!ticket) {
            return NextResponse.json(
                { error: 'Chamado não encontrado.', code: 'NOT_FOUND' },
                { status: 404 }
            );
        }

        const [mensagensRes, perfilRes] = await Promise.all([
            db
                .from('ticket_messages')
                .select('id, ticket_id, content, user_id, created_at')
                .eq('ticket_id', id)
                .order('created_at', { ascending: true }),
            ticket.user_id
                ? db
                    .from('profiles')
                    .select('id, full_name, email, phone, login, city, state')
                    .eq('id', ticket.user_id)
                    .maybeSingle()
                : Promise.resolve({ data: null as any }),
        ]);

        const perfil = perfilRes?.data ?? null;

        await auditAction(actor!, {
            resource: 'tickets',
            resourceId: id,
            action: 'TICKET_VIEWED',
            outcome: 'OK',
        });

        return NextResponse.json({
            ticket,
            mensagens: mensagensRes?.data ?? [],
            cliente: perfil
                ? {
                    id: perfil.id,
                    nome: perfil.full_name ?? null,
                    email: perfil.email ? maskEmail(perfil.email) : null,
                    telefone: perfil.phone ?? null,
                    login: perfil.login ?? null,
                    cidade: perfil.city ?? null,
                    uf: perfil.state ?? null,
                }
                : null,
        });
    } catch (err: any) {
        console.error('[api/admin/tickets] exceção:', err);
        return NextResponse.json(
            { error: 'Não foi possível carregar o chamado.', code: 'UNKNOWN' },
            { status: 500 }
        );
    }
}
