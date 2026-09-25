import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
    try {
        let body: any;
        try {
            body = await request.json();
        } catch {
            return NextResponse.json({ error: 'JSON inválido no corpo da requisição.' }, { status: 400 });
        }

        const { installation_id, app_version, hardware } = body ?? {};

        console.log('[API/INSTALL] Registrando instalação:', installation_id);

        if (!installation_id) {
            return NextResponse.json({ error: 'Missing installation_id' }, { status: 400 });
        }

        // Validar formato UUID
        if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(installation_id.trim())) {
            console.error('[API/INSTALL] UUID inválido:', installation_id);
            return NextResponse.json({ error: 'Formato de installation_id inválido.' }, { status: 400 });
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseServiceKey) {
            return NextResponse.json({ error: 'Configuração do servidor incompleta.' }, { status: 500 });
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey, {
            auth: { autoRefreshToken: false, persistSession: false }
        });

        // Mapear campos — suporta nomes antigos e novos enviados pelo desktop
        const cpuName   = hardware?.cpu_name   ?? hardware?.cpu        ?? hardware?.processor  ?? null;
        const gpuName   = hardware?.gpu_name   ?? hardware?.gpu        ?? hardware?.graphics   ?? null;
        const ramTotal  = hardware?.ram_gb_total?? hardware?.ram        ?? hardware?.memory     ?? null;
        const pcName    = hardware?.pc_name    ?? hardware?.hostname   ?? hardware?.pc         ?? null;
        const diskType  = hardware?.disk_type  ?? hardware?.disk       ?? null;
        const diskMainType = hardware?.disk_main_type ?? hardware?.disk_type ?? hardware?.disk ?? null;
        const osName    = hardware?.os_name    ?? hardware?.os         ?? null;
        const osBuild   = hardware?.os_build   ?? hardware?.build      ?? null;
        const winEdition= hardware?.windows_edition ?? hardware?.edition ?? null;
        const arch      = hardware?.architecture ?? null;

        // Apenas colunas que EXISTEM na tabela installations
        const upsertData: Record<string, any> = {
            id:               installation_id.trim().toLowerCase(),
            app_version:      app_version ?? null,
            pc_name:          pcName,
            cpu_name:         cpuName,
            gpu_name:         gpuName,
            ram_gb_total:     ramTotal !== null ? Number(ramTotal) : null,
            disk_type:        diskType,
            disk_main_type:   diskMainType,
            os_name:          osName,
            os_build:         osBuild,
            windows_edition:  winEdition,
            architecture:     arch,
            last_heartbeat:   new Date().toISOString(),
            updated_at:       new Date().toISOString(),
        };

        // Remover chaves com valor null para não sobrescrever dados existentes desnecessariamente
        Object.keys(upsertData).forEach(k => {
            if (upsertData[k] === null && k !== 'id') {
                delete upsertData[k];
            }
        });
        // id e timestamps sempre presentes
        upsertData.id = installation_id.trim().toLowerCase();
        upsertData.last_heartbeat = new Date().toISOString();
        upsertData.updated_at = new Date().toISOString();

        console.log('[API/INSTALL] Upsert payload:', JSON.stringify(upsertData));

        const { error } = await supabase
            .from('installations')
            .upsert(upsertData, { onConflict: 'id' });

        if (error) {
            console.error('[API/INSTALL] ❌ Erro no upsert:', {
                message: error.message,
                code: error.code,
                details: error.details,
                hint: error.hint
            });
            return NextResponse.json({ error: error.message, code: error.code }, { status: 500 });
        }

        console.log('[API/INSTALL] ✅ Instalação registrada:', installation_id);
        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('[API/INSTALL] ❌❌ ERRO CRÍTICO:', error?.message);
        return NextResponse.json({ error: error?.message || 'Erro interno.' }, { status: 500 });
    }
}
