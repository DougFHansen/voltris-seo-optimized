import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Endpoint para registrar/atualizar Perfil de Hardware
// Endpoint para registrar/atualizar Perfil de Hardware
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            device_id: machine_id, // Identificador físico único (GUID do App)
            cpu_model,
            gpu_model,
            ram_total_gb,
            disk_type,
            os_version,
            windows_build,
            is_64bit,
            is_admin,
            screen_resolution,
            hostname,
            app_version
        } = body;

        if (!machine_id) {
            return NextResponse.json({ error: 'Missing device_id' }, { status: 400 });
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // 1. Resolve Device with Duplicate Protection
        const { data: existingDevices } = await supabase
            .from('devices')
            .select('id, hostname')
            .eq('machine_id', machine_id);

        let deviceInternalId: string;

        if (existingDevices && existingDevices.length > 0) {
            deviceInternalId = existingDevices[0].id;

            // Atualizar hostname e status do dispositivo principal
            await supabase
                .from('devices')
                .update({
                    hostname: hostname || existingDevices[0].hostname || 'Voltris-Node',
                    status: 'online',
                    last_heartbeat: new Date().toISOString(),
                    app_version: app_version || '1.0.0'
                })
                .eq('id', deviceInternalId);
        } else {
            // Criar se não existir
            const { data: newDevice, error: createError } = await supabase
                .from('devices')
                .insert({
                    machine_id: machine_id,
                    hostname: hostname || 'Voltris-Node',
                    status: 'online',
                    last_heartbeat: new Date().toISOString(),
                    app_version: app_version || '1.0.0'
                })
                .select('id')
                .single();

            if (createError) throw createError;
            deviceInternalId = newDevice.id;
        }

        // 2. Upsert Device Profile (Hardware Details)
        const { error: profileError } = await supabase
            .from('device_profiles')
            .upsert({
                device_id: deviceInternalId,
                cpu_model: cpu_model || 'Unknown',
                gpu_model: gpu_model || 'Unknown',
                ram_total_gb: ram_total_gb || 0,
                disk_type: disk_type || 'Unknown',
                os_version: os_version || 'Windows',
                windows_build: windows_build || 'Unknown',
                is_64bit: is_64bit ?? true,
                is_admin: is_admin ?? false,
                screen_resolution: screen_resolution || 'Unknown',
                updated_at: new Date().toISOString()
            }, { onConflict: 'device_id' });

        if (profileError) {
            console.error('[TELEMETRY] Failed to upsert device profile:', profileError);
        }

        return NextResponse.json({
            success: true,
            id: deviceInternalId,
            status: 'synchronized'
        });

    } catch (err: any) {
        console.error('[TELEMETRY] Internal Error:', err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
