import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const raw_id = searchParams.get('installation_id');
        const installation_id = raw_id?.trim();

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

        console.log(`[API/STATUS] Consultando ID: ${installation_id}`);
        const { data: installation, error } = await supabase
            .from('installations')
            .select(`
                id,
                user_id,
                updated_at,
                last_heartbeat
            `)
            .eq('id', installation_id)
            .single();

        if (error) {
            console.warn(`[API/STATUS] ID não encontrado no banco [404]: ${installation_id}`);
            return NextResponse.json({ 
                linked: null, 
                user_email: null,
                error: 'Installation not found' 
            }, { status: 404 });
        }

        // Verificar se está vinculado (tem user_id)
        const isLinked = installation && installation.user_id ? true : false;
        let userEmail = null;

        if (isLinked) {
            console.log(`[API/STATUS] ID ${installation_id} está vinculado ao usuário ${installation.user_id}`);
            // Buscar email do usuário na tabela auth.users via admin API
            try {
                const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(installation.user_id!);
                
                if (!userError && user) {
                    userEmail = user.email;
                } else {
                    // Fallback para profiles se o admin API falhar ou não tiver email lá
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('email')
                        .eq('id', installation.user_id!)
                        .single();
                    userEmail = profile?.email;
                }
            } catch (authErr) {
                console.error('[API/STATUS] Erro ao buscar email do usuário:', authErr);
            }
        } else {
            console.log(`[API/STATUS] ID ${installation_id} existe mas ainda não está vinculado.`);
        }

        return NextResponse.json({
            linked: isLinked ? (installation.user_id as string) : null, 
            is_linked: isLinked,
            user_id: isLinked ? installation.user_id : null,
            user_email: userEmail,
            installation_id: installation_id,
            last_updated: installation.updated_at
        });
    } catch (error: any) {
        console.error('[API/STATUS] Erro inesperado:', error);
        return NextResponse.json({ linked: null, error: error.message }, { status: 500 });
    }
}