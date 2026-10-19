import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * NOTIFICAÇÕES DO PRÓPRIO USUÁRIO.
 *
 * Tudo aqui é escopado pelo `user_id` da sessão: o usuário SÓ enxerga as
 * próprias notificações. A lista, a marcação de lida e a limpeza são feitas
 * com `service_role` no servidor, com o filtro `user_id = <uid da sessão>`
 * — assim o comportamento não depende de policy de RLS e não existe caminho
 * para um usuário enxergar a notificação de outro.
 *
 * Por que servidor e não o cliente direto (Supabase/PostgREST)?
 *   1. A policy de UPDATE não existia → "marcar como lida" mentia para o
 *      usuário (o estado mudava na tela, não no banco).
 *   2. A policy de INSERT deixava o cliente forjar notificação para si.
 *   3. O Realtime depende de a tabela estar na publicação (ver
 *      `notificacaocorrigida.sql`).
 */

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function usuarioDaSessao(req: NextRequest): Promise<string | null> {
    const auth = req.headers.get('authorization');
    if (!auth?.toLowerCase().startsWith('bearer ')) return null;
    const token = auth.slice(7).trim();
    if (!token) return null;
    const { data, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !data?.user?.id) return null;
    return data.user.id;
}

/** Colunas pedidas — as novas só existem após `notificacaocorrigida.sql`. */
async function colunasDisponiveis(): Promise<string> {
    const { error } = await supabaseAdmin
        .from('notifications')
        .select('id, action_url, data, audience')
        .limit(1);
    return error
        ? 'id, user_id, title, message, type, read, sound, created_at'
        : 'id, user_id, title, message, type, read, sound, created_at, action_url, data, audience';
}

/**
 * `read_at`/`updated_at` só existem depois do SQL. Sem isso, o UPDATE falhava
 * com 42703 e "marcar como lida" NÃO persistia — exatamente o defeito que
 * o SQL veio consertar, mas que não pode depender dele para funcionar.
 */
let temColunasDeLeitura: boolean | null = null;
async function colunasDeLeituraExiste(): Promise<boolean> {
    if (temColunasDeLeitura === null) {
        const { error } = await supabaseAdmin
            .from('notifications')
            .select('id, read_at, updated_at')
            .limit(1);
        temColunasDeLeitura = !error;
    }
    return temColunasDeLeitura;
}

export async function GET(req: NextRequest) {
    const userId = await usuarioDaSessao(req);
    if (!userId) {
        return NextResponse.json(
            { error: 'Sessão inválida. Faça login novamente.', code: 'UNAUTHENTICATED' },
            { status: 401 }
        );
    }

    const sp = req.nextUrl.searchParams;
    const limit = Math.min(Number(sp.get('limit') ?? 30) || 30, 100);
    const offset = Math.max(Number(sp.get('offset') ?? 0) || 0, 0);
    const unreadOnly = sp.get('unread') === '1';

    try {
        const colunas = await colunasDisponiveis();

        let query = supabaseAdmin
            .from('notifications')
            .select(colunas, { count: 'exact' })
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (unreadOnly) query = query.eq('read', false);

        const { data, error, count } = await query;
        if (error) {
            console.error('[api/notifications] erro ao listar:', error);
            return NextResponse.json(
                { error: 'Não foi possível carregar suas notificações.', code: 'DB_READ_FAILED' },
                { status: 500 }
            );
        }

        // Contagem de não lidas do MESMO usuário (nunca de outro).
        const { count: naoLidas } = await supabaseAdmin
            .from('notifications')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('read', false);

        return NextResponse.json({
            notifications: data ?? [],
            total: count ?? 0,
            unreadCount: naoLidas ?? 0,
            limit,
            offset,
        });
    } catch (e: any) {
        console.error('[api/notifications] exceção:', e);
        return NextResponse.json(
            { error: 'Não foi possível carregar suas notificações.', code: 'UNKNOWN' },
            { status: 500 }
        );
    }
}

/**
 * Marca como lida: uma notificação (`ids`) ou todas.
 * O `user_id` da sessão entra no filtro — o corpo NÃO escolhe o dono.
 */
export async function PATCH(req: NextRequest) {
    const userId = await usuarioDaSessao(req);
    if (!userId) {
        return NextResponse.json(
            { error: 'Sessão inválida. Faça login novamente.', code: 'UNAUTHENTICATED' },
            { status: 401 }
        );
    }

    let body: { ids?: string[]; all?: boolean } = {};
    try {
        body = await req.json();
    } catch {
        body = {};
    }

    try {
        const patch: Record<string, unknown> = { read: true };
        if (await colunasDeLeituraExiste()) {
            patch.read_at = new Date().toISOString();
            patch.updated_at = new Date().toISOString();
        }

        let query = supabaseAdmin
            .from('notifications')
            .update(patch)
            .eq('user_id', userId);

        if (!body.all) {
            const ids = Array.isArray(body.ids) ? body.ids.filter(Boolean) : [];
            if (ids.length === 0) {
                return NextResponse.json(
                    { error: 'Informe os ids das notificações ou use { all: true }.', code: 'INVALID_BODY' },
                    { status: 400 }
                );
            }
            query = query.in('id', ids);
        } else {
            query = query.eq('read', false);
        }

        const { data, error } = await query.select('id');
        if (error) {
            console.error('[api/notifications] erro ao marcar como lida:', error);
            return NextResponse.json(
                { error: 'Não foi possível marcar as notificações como lidas.', code: 'DB_WRITE_FAILED' },
                { status: 500 }
            );
        }

        return NextResponse.json({ ok: true, updated: (data ?? []).length });
    } catch (e: any) {
        console.error('[api/notifications] exceção ao marcar como lida:', e);
        return NextResponse.json(
            { error: 'Não foi possível marcar as notificações como lidas.', code: 'UNKNOWN' },
            { status: 500 }
        );
    }
}

/** Limpa as notificações do próprio usuário. */
export async function DELETE(req: NextRequest) {
    const userId = await usuarioDaSessao(req);
    if (!userId) {
        return NextResponse.json(
            { error: 'Sessão inválida. Faça login novamente.', code: 'UNAUTHENTICATED' },
            { status: 401 }
        );
    }

    try {
        const { error, count } = await supabaseAdmin
            .from('notifications')
            .delete({ count: 'exact' })
            .eq('user_id', userId);

        if (error) {
            console.error('[api/notifications] erro ao limpar:', error);
            return NextResponse.json(
                { error: 'Não foi possível limpar as notificações.', code: 'DB_WRITE_FAILED' },
                { status: 500 }
            );
        }

        return NextResponse.json({ ok: true, removed: count ?? 0 });
    } catch (e: any) {
        console.error('[api/notifications] exceção ao limpar:', e);
        return NextResponse.json(
            { error: 'Não foi possível limpar as notificações.', code: 'UNKNOWN' },
            { status: 500 }
        );
    }
}
