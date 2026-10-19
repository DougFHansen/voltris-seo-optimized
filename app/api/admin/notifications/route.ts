import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { requireCapability, auditAction } from '@/lib/admin-auth';
import { readPage, paginate, sanitizeSearch, maskEmail } from '@/lib/admin-queries';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * NOTIFICAÇÕES — VISÃO COMPLETA DO ADMIN.
 *
 * O admin precisa ver TODO o movimento do negócio em um lugar só: compras,
 * pedidos/serviços, tickets e reembolsos — com o cliente, o valor e o
 * horário. É aqui que a notificação vira OPERACIONAL, e não só um sino.
 *
 * O cliente (usuário comum) nunca chega aqui: `requireCapability` exige
 * perfil de administração e a query é feita com `service_role`.
 */

const db = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/** Linha de notificação como o painel consome. */
interface NotificacaoAdmin {
    id: string;
    user_id: string;
    title: string;
    message: string;
    type: string;
    read: boolean;
    sound: string | null;
    created_at: string;
    action_url?: string | null;
    data?: Record<string, unknown> | null;
    audience?: string | null;
}

const Query = z.object({
    q: z.string().trim().max(120).optional(),
    limit: z.string().optional(),
    offset: z.string().optional(),
    type: z.string().trim().max(30).optional(),
    read: z.enum(['1', '0']).optional(),
    audience: z.enum(['user', 'admin']).optional(),
    scope: z.enum(['all', 'operacao', 'admin']).optional(),
});

export async function GET(req: NextRequest) {
    const { actor, response } = await requireCapability('notifications.read');
    if (response) return response;

    const parsed = Query.safeParse(Object.fromEntries(req.nextUrl.searchParams));
    if (!parsed.success) {
        return NextResponse.json(
            { error: 'Parâmetros inválidos.', code: 'INVALID_QUERY' },
            { status: 400 }
        );
    }

    const { limit, offset } = readPage(req.nextUrl.searchParams);
    const q = parsed.data.q ? sanitizeSearch(parsed.data.q) : null;

    try {
        // As colunas novas (action_url/data/audience) só existem depois de
        // `notificacaocorrigida.sql`. A detecção evita 500 antes da aplicação.
        const { error: erroColunas } = await db
            .from('notifications')
            .select('id, action_url, data, audience')
            .limit(1);
        const colunas = erroColunas
            ? 'id, user_id, title, message, type, read, sound, created_at'
            : 'id, user_id, title, message, type, read, sound, created_at, action_url, data, audience';

        let query = db
            .from('notifications')
            .select(colunas, { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (parsed.data.type) query = query.eq('type', parsed.data.type);
        if (parsed.data.read === '1') query = query.eq('read', true);
        if (parsed.data.read === '0') query = query.eq('read', false);
        // Filtro de público só faz sentido depois do SQL (coluna `audience`).
        if (parsed.data.audience && colunas.includes('audience')) {
            query = query.eq('audience', parsed.data.audience);
        }
        if (q) {
            query = query.or(
                `title.ilike.%${q}%,message.ilike.%${q}%,data->>kind.ilike.%${q}%`
            );
        }

        const { data, error, count } = await query;
        if (error) {
            console.error('[api/admin/notifications] erro ao listar:', error);
            return NextResponse.json(
                { error: 'Não foi possível carregar as notificações.', code: 'DB_READ_FAILED' },
                { status: 500 }
            );
        }

        const rows = (data ?? []) as unknown as NotificacaoAdmin[];
        const userIds = [...new Set(rows.map((r) => r.user_id).filter(Boolean))] as string[];

        // Quem recebeu: nome + e-mail MASCARADO (política do painel).
        let perfis: Record<string, { nome: string | null; email: string | null; admin: boolean }> = {};
        if (userIds.length > 0) {
            const { data: ps } = await db
                .from('profiles')
                .select('id, full_name, email, is_admin')
                .in('id', userIds);
            perfis = Object.fromEntries(
                (ps ?? []).map((p) => [
                    p.id,
                    {
                        nome: p.full_name ?? null,
                        email: p.email ? maskEmail(p.email) : null,
                        admin: !!p.is_admin,
                    },
                ])
            );
        }

        const itens = rows.map((r) => ({
            ...r,
            destinatario: perfis[r.user_id] ?? { nome: null, email: null, admin: false },
        }));

        // Contadores por tipo (com os mesmos filtros) para o topo da aba.
        // `audience` só existe depois de `notificacaocorrigida.sql` — pedir
        // uma coluna inexistente faria a consulta INTEIRA falhar e o resumo
        // viria zerado (o painel diria "0 notificações" com 11 no banco).
        const temAudience = colunas.includes('audience');
        const { data: todas, error: erroResumo } = await db
            .from('notifications')
            .select(temAudience ? 'type, read, audience' : 'type, read');
        if (erroResumo) {
            console.error('[api/admin/notifications] erro no resumo:', erroResumo);
        }
        const lista = (todas ?? []) as unknown as { type: string; read: boolean; audience: string | null }[];
        const contagem = lista.reduce<Record<string, number>>((acc, n) => {
            acc[n.type] = (acc[n.type] ?? 0) + 1;
            return acc;
        }, {});
        const naoLidas = lista.filter((n) => !n.read).length;

        await auditAction(actor!, {
            resource: 'notifications',
            resourceId: null,
            action: 'NOTIFICATIONS_VIEWED',
            outcome: 'OK',
            after: { total: count ?? 0, filters: parsed.data },
        });

        return NextResponse.json({
            ...paginate(itens, count ?? 0, limit, offset),
            resumo: { porTipo: contagem, naoLidas, total: lista.length },
        });
    } catch (err: any) {
        await auditAction(actor!, {
            resource: 'notifications',
            resourceId: null,
            action: 'NOTIFICATIONS_VIEWED',
            outcome: 'FAILED',
            reason: String(err?.message ?? err).slice(0, 200),
        });
        console.error('[api/admin/notifications] exceção:', err);
        return NextResponse.json(
            { error: 'Não foi possível carregar as notificações.', code: 'UNKNOWN' },
            { status: 500 }
        );
    }
}

/** Marca uma notificação como lida (admin). */
export async function PATCH(req: NextRequest) {
    const { actor, response } = await requireCapability('notifications.write');
    if (response) return response;

    let body: { id?: string; read?: boolean } = {};
    try {
        body = await req.json();
    } catch {
        body = {};
    }

    if (!body.id) {
        return NextResponse.json(
            { error: 'Informe o id da notificação.', code: 'INVALID_BODY' },
            { status: 400 }
        );
    }

    try {
        const read = body.read !== false;
        const { data, error } = await db
            .from('notifications')
            .update({
                read,
                read_at: read ? new Date().toISOString() : null,
                updated_at: new Date().toISOString(),
            })
            .eq('id', body.id)
            .select('id, read')
            .maybeSingle();

        if (error) {
            console.error('[api/admin/notifications] erro ao marcar:', error);
            return NextResponse.json(
                { error: 'Não foi possível atualizar a notificação.', code: 'DB_WRITE_FAILED' },
                { status: 500 }
            );
        }

        await auditAction(actor!, {
            resource: 'notifications',
            resourceId: body.id,
            action: 'NOTIFICATION_UPDATED',
            outcome: 'OK',
            after: { read },
        });

        return NextResponse.json({ ok: true, notification: data });
    } catch (err: any) {
        console.error('[api/admin/notifications] exceção:', err);
        return NextResponse.json(
            { error: 'Não foi possível atualizar a notificação.', code: 'UNKNOWN' },
            { status: 500 }
        );
    }
}
