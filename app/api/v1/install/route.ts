import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { installation_id, user_id, app_version, hardware } = body;

        console.log('[API/INSTALL] Recebida requisição de registro');
        console.log('[API/INSTALL] installation_id:', installation_id);
        console.log('[API/INSTALL] user_id:', user_id);
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

        console.log('[API/INSTALL] Fazendo upsert da instalação (resiliente)...');
        
        // Mapeamento resiliente: tenta ler o padrão novo, depois fallbacks de chaves que o app antigo envia
        const cpuName = hardware?.cpu_name || hardware?.cpu || hardware?.processor;
        const gpuName = hardware?.gpu_name || hardware?.gpu || hardware?.graphics;
        const ramTotal = hardware?.ram_gb_total || hardware?.ram || hardware?.memory;
        const pcName = hardware?.pc_name || hardware?.hostname || hardware?.pc;

        const upsertData: any = {
            id: installation_id.trim(),
            pc_name: pcName,
            app_version: app_version,
            cpu_name: cpuName,
            ram_gb_total: ramTotal,
            gpu_name: gpuName,
            disk_type: hardware?.disk_type || hardware?.disk_main_type || hardware?.disk,
            os_name: hardware?.os_name || hardware?.os,
            os_build: hardware?.os_build || hardware?.build,
            windows_edition: hardware?.windows_edition || hardware?.edition,
            architecture: hardware?.architecture,
            last_heartbeat: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        // Só incluir user_id se ele vier na requisição, para não sobrescrever com null se já estiver vinculado
        if (user_id) {
            upsertData.user_id = user_id;
        }

        const { error } = await supabase
            .from('installations')
            .upsert(upsertData, { onConflict: 'id' });

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
