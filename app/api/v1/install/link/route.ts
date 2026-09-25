import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
    try {
        console.log('[API/LINK] ========== INICIANDO POST /api/v1/install/link ==========');
        console.log('[API/LINK] Timestamp:', new Date().toISOString());
        console.log('[API/LINK] Headers:', Object.fromEntries(request.headers.entries()));
        
        let bodyData;
        try {
            bodyData = await request.json();
            console.log('[API/LINK] Body recebido:', bodyData);
        } catch (e) {
            console.error('[API/LINK] Erro ao parsear JSON:', e);
            throw new Error('JSON inválido no corpo da requisição');
        }

        const { installation_id, user_id } = bodyData;
        console.log('[API/LINK] installation_id:', installation_id);
        console.log('[API/LINK] user_id:', user_id);

        if (!installation_id || !user_id) {
            console.error('[API/LINK] Parâmetros faltando - installation_id ou user_id undefined');
            return NextResponse.json({ error: 'Parâmetros de identificação ausentes.' }, { status: 400 });
        }

        // --- VALIDAÇÃO DE SEGURANÇA "ANTI-HACKER" ---
        console.log('[API/LINK] Verificando variáveis de ambiente...');
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl) console.error('[API/LINK] ❌ NEXT_PUBLIC_SUPABASE_URL não definida');
        if (!supabaseAnonKey) console.error('[API/LINK] ❌ NEXT_PUBLIC_SUPABASE_ANON_KEY não definida');
        if (!supabaseServiceKey) console.error('[API/LINK] ❌ SUPABASE_SERVICE_ROLE_KEY não definida');

        const serverSupabase = createServerClient(
            supabaseUrl!,
            supabaseAnonKey!,
            {
                cookies: {
                    get: (name: string) => request.cookies.get(name)?.value,
                    set: (name: string, value: string, options: CookieOptions) => {},
                    remove: (name: string, options: CookieOptions) => {},
                },
            }
        );

        console.log('[API/LINK] Tentando obter usuário da sessão...');
        const { data: { user }, error: authError } = await serverSupabase.auth.getUser();

        if (authError) {
            console.error('[API/LINK] ❌ Erro ao obter usuário:', authError.message);
            return NextResponse.json({ error: 'Erro ao verificar sessão: ' + authError.message }, { status: 401 });
        }

        if (!user) {
            console.error('[API/LINK] ❌ Usuário não autenticado (user é null)');
            return NextResponse.json({ error: 'Sessão expirada ou inválida. Por favor, faça login novamente.' }, { status: 401 });
        }

        console.log('[API/LINK] ✅ Usuário autenticado:', user.id, user.email);

        if (user.id !== user_id) {
            console.error(`[API/LINK] ❌ ALERTA DE SEGURANÇA: Sessão (${user.id}) ≠ Payload (${user_id})`);
            return NextResponse.json({ error: 'Violação de integridade detectada. Acesso negado.' }, { status: 403 });
        }

        console.log('[API/LINK] ✅ Validação de segurança passou');

        // Normalizar UUIDs para lowercase
        const normalizedInstallationId = installation_id.toLowerCase();
        const normalizedUserId = user_id.toLowerCase();

        console.log('[API/LINK] UUIDs normalizados:', {
            normalizedInstallationId,
            normalizedUserId
        });

        // Se passou, usar o SERVICE ROLE para forçar a vinculação no banco
        const supabaseAdmin = createClient(supabaseUrl!, supabaseServiceKey!);

        console.log('[API/LINK] Tentando fazer UPSERT na tabela installations...');
        const { error } = await supabaseAdmin
            .from('installations')
            .upsert({
                id: normalizedInstallationId,
                user_id: normalizedUserId,
                updated_at: new Date().toISOString(),
                last_heartbeat: new Date().toISOString()
            }, { onConflict: 'id' });

        if (error) {
            console.error('[API/LINK] ❌ Erro no banco de dados:', {
                message: error.message,
                code: error.code,
                details: error.details,
                hint: error.hint
            });
            throw error;
        }

        console.log(`[API/LINK] ✅ Vinculação realizada com sucesso para ${user.email}`);
        const response = {
            success: true,
            message: 'Dispositivo vinculado com total segurança.',
            email: user.email,
            user_id: user.id,
            linked_at: new Date().toISOString()
        };
        
        console.log('[API/LINK] ✅ Response a enviar:', response);
        return NextResponse.json(response);
        
    } catch (error: any) {
        console.error('[API/LINK] ❌❌❌ ERRO CRÍTICO NA RAIZ:', {
            message: error.message,
            stack: error.stack,
            name: error.name,
            code: error.code
        });
        return NextResponse.json({ 
            error: 'Erro interno no processamento do link.',
            details: error.message 
        }, { status: 500 });
    }
}
