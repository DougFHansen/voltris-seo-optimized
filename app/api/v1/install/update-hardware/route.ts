import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { installation_id, hardware } = body;

        console.log('[API/UPDATE-HARDWARE] Recebida requisição de atualização');
        console.log('[API/UPDATE-HARDWARE] installation_id:', installation_id);
        console.log('[API/UPDATE-HARDWARE] hardware:', hardware);

        if (!installation_id) {
            console.error('[API/UPDATE-HARDWARE] installation_id faltando');
            return NextResponse.json({ error: 'Missing installation_id' }, { status: 400 });
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseServiceKey) {
            console.error('[API/UPDATE-HARDWARE] Configuração do banco faltando');
            return NextResponse.json({ error: 'Database configuration missing' }, { status: 500 });
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        console.log('[API/UPDATE-HARDWARE] Atualizando hardware info...');
        
        // Atualizar apenas campos de hardware
        const { error } = await supabase
            .from('installations')
            .update({
                cpu_name: hardware?.cpu_name,
                ram_gb_total: hardware?.ram_gb_total,
                gpu_name: hardware?.gpu_name,
                disk_type: hardware?.disk_type,
                os_name: hardware?.os_name,
                os_build: hardware?.os_build,
                windows_edition: hardware?.windows_edition,
                architecture: hardware?.architecture,
                updated_at: new Date().toISOString()
            })
            .eq('id', installation_id);

        if (error) {
            console.error('[API/UPDATE-HARDWARE] Erro ao atualizar:', error);
            throw error;
        }

        console.log('[API/UPDATE-HARDWARE] Hardware atualizado com sucesso!');
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('[API/UPDATE-HARDWARE] Erro geral:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
