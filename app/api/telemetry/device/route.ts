import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Endpoint para registrar/atualizar Perfil de Hardware
// Endpoint para registrar/atualizar Perfil de Hardware
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            device_id: machine_id, // Renomeando para evitar confusão (o app envia o ID da máquina físico)
            cpu_model,
            gpu_model,
            ram_total_gb,
            disk_type,
            os_version,
            windows_build,
            is_64bit,
            is_admin,
            screen_resolution,
            hostname
        } = body;

        if (!machine_id) {
            return NextResponse.json({ error: 'Missing device_id (machine_id)' }, { status: 400 });
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // 1. Resolver o UUID real do dispositivo baseado no machine_id
        let { data: device, error: devError } = await supabase
            .from('devices')
            .select('id')
            .eq('machine_id', machine_id)
            .single();

        // Se não existir, criar automaticamente (Auto-Discovery)
        if (!device) {
            const { data: newDevice, error: createError } = await supabase
                .from('devices')
                .insert({
                    machine_id: machine_id,
                    hostname: hostname || 'Unknown',
                    status: 'online',
                    app_version: '1.0.0' // Default fallback
                })
                .select('id')
                .single();

            if (createError || !newDevice) {
                console.error('Failed to auto-create device:', createError);
                return NextResponse.json({ error: 'Device registration failed' }, { status: 500 });
            }
            device = newDevice;
        }

        const real_uuid = device.id;

        // 2. Upsert device profile usando o UUID correto
        const { error } = await supabase
            .from('device_profiles')
            .upsert({
                device_id: real_uuid, // UUID foreign key
                cpu_model,
                gpu_model,
                ram_total_gb,
                disk_type,
                os_version,
                windows_build,
                is_64bit,
                is_admin,
                screen_resolution,
                updated_at: new Date().toISOString()
            }, { onConflict: 'device_id' });

        if (error) {
            console.error('Check your supabase schema for device_profiles table', error);
            throw error;
        }

        // 3. Update Hostname/Status in devices table
        if (hostname) {
            await supabase
                .from('devices')
                .update({
                    hostname: hostname,
                    last_heartbeat: new Date().toISOString()
                })
                .eq('id', real_uuid);
        }

        return NextResponse.json({ success: true, uuid: real_uuid });

    } catch (err: any) {
        console.error('Telemetry Device Error:', err);
        // Retornar code 200 pra nao crashar o client, mas logar erro
        return NextResponse.json({ success: false, error: err.message }, { status: 200 });
    }
}
