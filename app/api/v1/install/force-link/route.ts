import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
    try {
        const { installation_id, user_id } = await request.json();

        console.log('[FORCE-LINK] Recebida requisição de vinculação forçada');
        console.log('[FORCE-LINK] installation_id:', installation_id);
        console.log('[FORCE-LINK] user_id:', user_id);

        if (!installation_id || !user_id) {
            return NextResponse.json({ error: 'Missing installation_id or user_id' }, { status: 400 });
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseServiceKey) {
            return NextResponse.json({ error: 'Database configuration missing' }, { status: 500 });
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Primeiro, verificar se a instalação existe
        const { data: existing } = await supabase
            .from('installations')
            .select('*')
            .eq('id', installation_id)
            .maybeSingle();

        if (existing) {
            console.log('[FORCE-LINK] Instalação já existe, atualizando user_id');
            // Se existe, apenas atualizar o user_id
            const { error } = await supabase
                .from('installations')
                .update({
                    user_id: user_id,
                    updated_at: new Date().toISOString()
                })
                .eq('id', installation_id);

            if (error) {
                console.error('[FORCE-LINK] Erro ao atualizar:', error);
                throw error;
            }
        } else {
            console.log('[FORCE-LINK] Instalação não existe, criando nova');
            // Se não existe, criar nova instalação
            const { error } = await supabase
                .from('installations')
                .insert({
                    id: installation_id,
                    user_id: user_id,
                    app_version: '1.0.0',
                    last_heartbeat: new Date().toISOString(),
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                });

            if (error) {
                console.error('[FORCE-LINK] Erro ao criar:', error);
                throw error;
            }
        }

        // Verificar se funcionou
        const { data: verification } = await supabase
            .from('installations')
            .select('*')
            .eq('id', installation_id)
            .single();

        console.log('[FORCE-LINK] Verificação:', verification);
        console.log('[FORCE-LINK] Vinculação forçada realizada com sucesso!');

        return NextResponse.json({
            success: true,
            created: !existing,
            installation: verification
        });
    } catch (error: any) {
        console.error('[FORCE-LINK] Erro geral:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
