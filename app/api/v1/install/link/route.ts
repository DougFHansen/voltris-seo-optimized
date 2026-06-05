import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
    try {
        const { installation_id, user_id } = await request.json();

        console.log('[API/LINK] Recebida requisição de vinculação segura');

        if (!installation_id || !user_id) {
            return NextResponse.json({ error: 'Parâmetros de identificação ausentes.' }, { status: 400 });
        }

        // --- VALIDAÇÃO DE SEGURANÇA "ANTI-HACKER" ---
        // Verificar se o user_id enviado corresponde ao usuário autenticado na sessão (via cookies)
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

        let response = NextResponse.next();
        const serverSupabase = createServerClient(
            supabaseUrl,
            supabaseAnonKey,
            {
                cookies: {
                    get: (name: string) => request.cookies.get(name)?.value,
                    set: (name: string, value: string, options: CookieOptions) => {},
                    remove: (name: string, options: CookieOptions) => {},
                },
            }
        );

        const { data: { user }, error: authError } = await serverSupabase.auth.getUser();

        if (authError || !user) {
            console.error('[API/LINK] Tentativa de vinculação sem sessão ativa.');
            return NextResponse.json({ error: 'Sessão expirada ou inválida. Por favor, faça login novamente.' }, { status: 401 });
        }

        if (user.id !== user_id) {
            console.error(`[API/LINK] ALERTA DE SEGURANÇA: Sessão (${user.id}) não condiz com Payload (${user_id})`);
            return NextResponse.json({ error: 'Violação de integridade detectada. Acesso negado.' }, { status: 403 });
        }

        // --- FIM DA VALIDAÇÃO ---

        // Se passou, usar o SERVICE ROLE para forçar a vinculação no banco
        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

        const { error } = await supabaseAdmin
            .from('installations')
            .upsert({
                id: installation_id,
                user_id: user_id,
                updated_at: new Date().toISOString(),
                last_heartbeat: new Date().toISOString()
            }, { onConflict: 'id' });

        if (error) {
            console.error('[API/LINK] Erro no banco de dados:', error);
            throw error;
        }

        console.log(`[API/LINK] Vinculação realizada para ${user.email} con sucesso.`);
        return NextResponse.json({
            success: true,
            message: 'Dispositivo vinculado com total segurança.'
        });
        
    } catch (error: any) {
        console.error('[API/LINK] Erro crítico:', error);
        return NextResponse.json({ error: 'Erro interno no processamento do link.' }, { status: 500 });
    }
}
