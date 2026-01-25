import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
    try {
        const { installation_id, user_id } = await request.json();

        console.log('[API/LINK] Recebida requisição de vinculação');
        console.log('[API/LINK] installation_id:', installation_id);
        console.log('[API/LINK] user_id:', user_id);

        if (!installation_id || !user_id) {
            console.error('[API/LINK] Parâmetros faltando');
            return NextResponse.json({ error: 'Missing installation_id or user_id' }, { status: 400 });
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseServiceKey) {
            console.error('[API/LINK] Configuração do banco faltando');
            return NextResponse.json({ error: 'Database configuration missing' }, { status: 500 });
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        console.log('[API/LINK] Atualizando instalação no banco...');
        const { error } = await supabase
            .from('installations')
            .update({
                user_id: user_id,
                updated_at: new Date().toISOString()
            })
            .eq('id', installation_id);

        if (error) {
            console.error('[API/LINK] Erro ao atualizar:', error);
            throw error;
        }

        console.log('[API/LINK] Vinculação realizada com sucesso!');
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('[API/LINK] Erro geral:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
