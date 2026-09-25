import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
    try {
        console.log('[API/LINK] ========== POST /api/v1/install/link ==========');

        let bodyData: any;
        try {
            bodyData = await request.json();
        } catch {
            return NextResponse.json({ error: 'JSON inválido no corpo da requisição.' }, { status: 400 });
        }

        const { installation_id, user_id } = bodyData ?? {};
        console.log('[API/LINK] installation_id:', installation_id, '| user_id:', user_id);

        if (!installation_id || !user_id) {
            return NextResponse.json({ error: 'Parâmetros ausentes: installation_id e user_id são obrigatórios.' }, { status: 400 });
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
            console.error('[API/LINK] ❌ Variáveis de ambiente faltando');
            return NextResponse.json({ error: 'Configuração do servidor incompleta.' }, { status: 500 });
        }

        // Verificar sessão do usuário via cookies
        const serverSupabase = createServerClient(supabaseUrl, supabaseAnonKey, {
            cookies: {
                get: (name: string) => request.cookies.get(name)?.value,
                set: (_name: string, _value: string, _options: CookieOptions) => {},
                remove: (_name: string, _options: CookieOptions) => {},
            },
        });

        const { data: { user }, error: authError } = await serverSupabase.auth.getUser();

        if (authError) {
            console.error('[API/LINK] ❌ Erro de autenticação:', authError.message);
            return NextResponse.json({ error: 'Erro ao verificar sessão: ' + authError.message }, { status: 401 });
        }

        if (!user) {
            console.error('[API/LINK] ❌ Usuário não autenticado');
            return NextResponse.json({ error: 'Sessão expirada. Faça login novamente.' }, { status: 401 });
        }

        console.log('[API/LINK] ✅ Usuário autenticado:', user.id, user.email);

        // Validação de segurança: user_id do body deve bater com o da sessão
        if (user.id.toLowerCase() !== user_id.toLowerCase()) {
            console.error(`[API/LINK] ❌ ALERTA: sessão=${user.id} ≠ payload=${user_id}`);
            return NextResponse.json({ error: 'Violação de integridade. Acesso negado.' }, { status: 403 });
        }

        const normalizedInstallationId = installation_id.trim().toLowerCase();
        const normalizedUserId = user.id.toLowerCase();

        // Usar service role para forçar vinculação
        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
            auth: { autoRefreshToken: false, persistSession: false }
        });

        console.log('[API/LINK] Fazendo upsert installation_id:', normalizedInstallationId, '→ user_id:', normalizedUserId);

        const { error: upsertError } = await supabaseAdmin
            .from('installations')
            .upsert({
                id: normalizedInstallationId,
                user_id: normalizedUserId,
                updated_at: new Date().toISOString(),
                last_heartbeat: new Date().toISOString()
            }, { onConflict: 'id' });

        if (upsertError) {
            console.error('[API/LINK] ❌ Erro no upsert:', {
                message: upsertError.message,
                code: upsertError.code,
                details: upsertError.details,
                hint: upsertError.hint
            });
            return NextResponse.json({
                error: 'Erro ao vincular dispositivo no banco de dados.',
                details: upsertError.message,
                code: upsertError.code
            }, { status: 500 });
        }

        console.log(`[API/LINK] ✅ Vinculado com sucesso: ${user.email}`);

        return NextResponse.json({
            success: true,
            message: 'Dispositivo vinculado com sucesso.',
            email: user.email,
            user_id: user.id,
            linked_at: new Date().toISOString()
        });

    } catch (error: any) {
        console.error('[API/LINK] ❌❌❌ ERRO CRÍTICO:', error?.message, error?.stack);
        return NextResponse.json({
            error: 'Erro interno ao processar vinculação.',
            details: error?.message
        }, { status: 500 });
    }
}
