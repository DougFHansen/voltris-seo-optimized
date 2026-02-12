import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const installation_id = searchParams.get('installation_id');

        console.log('[API/STATUS] Verificando status de vinculação');
        console.log('[API/STATUS] installation_id:', installation_id);

        if (!installation_id) {
            console.error('[API/STATUS] installation_id faltando');
            return NextResponse.json({ error: 'Missing installation_id' }, { status: 400 });
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseServiceKey) {
            console.error('[API/STATUS] Configuração do banco faltando');
            return NextResponse.json({ error: 'Database configuration missing' }, { status: 500 });
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        console.log('[API/STATUS] Consultando instalação...');
        const { data: installation, error } = await supabase
            .from('installations')
            .select(`
                id,
                user_id,
                updated_at
            `)
            .eq('id', installation_id)
            .single();

        if (error) {
            console.error('[API/STATUS] Erro na consulta:', error);
            return NextResponse.json({ 
                linked: null, 
                user_email: null,
                error: 'Installation not found' 
            }, { status: 404 });
        }

        console.log('[API/STATUS] Instalação encontrada:', installation);

        // Verificar se está vinculado (tem user_id)
        const isLinked = installation && installation.user_id ? true : false;
        let userEmail = null;

        if (isLinked && installation.user_id) {
            // Buscar email do usuário na tabela auth.users via admin API
            try {
                const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(installation.user_id);
                
                if (!userError && user) {
                    userEmail = user.email;
                    console.log('[API/STATUS] Email encontrado via auth.users:', userEmail);
                } else {
                    console.error('[API/STATUS] Erro ao buscar usuário:', userError);
                    
                    // Fallback: tentar buscar na tabela profiles
                    const { data: profile, error: profileError } = await supabase
                        .from('profiles')
                        .select('email')
                        .eq('id', installation.user_id)
                        .single();
                    
                    if (!profileError && profile) {
                        userEmail = profile.email;
                        console.log('[API/STATUS] Email encontrado via profiles:', userEmail);
                    } else {
                        console.error('[API/STATUS] Erro ao buscar perfil:', profileError);
                    }
                }
            } catch (profileErr) {
                console.error('[API/STATUS] Erro ao buscar email:', profileErr);
            }
        }

        console.log('[API/STATUS] Status final:', { linked: isLinked, email: userEmail });

        return NextResponse.json({
            linked: isLinked ? installation.user_id : null, // Retorna o user_id se vinculado, null se não
            user_email: userEmail,
            installation_id: installation_id,
            last_updated: installation.updated_at
        });
    } catch (error: any) {
        console.error('[API/STATUS] Erro geral:', error);
        return NextResponse.json({ 
            linked: null,
            user_email: null, 
            error: error.message 
        }, { status: 500 });
    }
}