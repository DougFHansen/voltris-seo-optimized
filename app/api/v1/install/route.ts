import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { installation_id, app_version, hardware } = body;

        console.log('[API/INSTALL] Recebida requisição de registro');
        console.log('[API/INSTALL] installation_id:', installation_id);
        console.log('[API/INSTALL] app_version:', app_version);
        console.log('[API/INSTALL] hardware:', hardware);

        if (!installation_id) {
            console.error('[API/INSTALL] installation_id faltando');
            return NextResponse.json({ error: 'Missing installation_id' }, { status: 400 });
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseServiceKey) {
            console.error('[API/INSTALL] Configuração do banco faltando');
            return NextResponse.json({ error: 'Database configuration missing' }, { status: 500 });
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        console.log('[API/INSTALL] Fazendo upsert da instalação...');
        // Upsert installation record
        const { error } = await supabase
            .from('installations')
            .upsert({
                id: installation_id,
                app_version: app_version,
                cpu_name: hardware?.cpu_name,
                ram_gb_total: hardware?.ram_gb_total,
                gpu_name: hardware?.gpu_name,
                disk_type: hardware?.disk_type || hardware?.disk_main_type, // Suportar ambos os nomes
                os_name: hardware?.os_name,
                os_build: hardware?.os_build,
                windows_edition: hardware?.windows_edition,
                architecture: hardware?.architecture,
                last_heartbeat: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }, { onConflict: 'id' });

        if (error) {
            console.error('[API/INSTALL] Erro ao fazer upsert:', error);
            throw error;
        }

        console.log('[API/INSTALL] Instalação registrada com sucesso!');
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('[API/INSTALL] Erro geral:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
