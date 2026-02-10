import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { machine_id, app_version, hostname } = body;

        if (!machine_id) {
            return NextResponse.json({ error: 'Missing machine_id' }, { status: 400 });
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // 1. Resolve Device with Duplicate Protection (Merge Logic)
        // Buscamos todos os dispositivos com esse machine_id para evitar duplicatas no dashboard
        const { data: existingDevices } = await supabase
            .from('devices')
            .select('id, hostname')
            .eq('machine_id', machine_id);

        let deviceId: string;

        if (existingDevices && existingDevices.length > 0) {
            // Se houver mais de um, usamos o primeiro e poderíamos marcar os outros como obsoletos
            deviceId = existingDevices[0].id;

            // Atualizar o registro principal com o hostname real e status online
            await supabase
                .from('devices')
                .update({
                    hostname: hostname || existingDevices[0].hostname || 'Voltris-Node',
                    status: 'online',
                    last_heartbeat: new Date().toISOString(),
                    app_version: app_version
                })
                .eq('id', deviceId);

            // Limpeza de Sessões Antigas para TODOS os IDs vinculados a esse machine_id
            const allDeviceIds = existingDevices.map(d => d.id);
            await supabase
                .from('sessions')
                .update({ status: 'timeout', ended_at: new Date().toISOString() })
                .in('device_id', allDeviceIds)
                .in('status', ['active', 'idle']);
        } else {
            // Criar novo dispositivo se não existir
            const { data: newDevice, error: createError } = await supabase
                .from('devices')
                .insert({
                    machine_id: machine_id,
                    hostname: hostname || 'Voltris-Node',
                    status: 'online',
                    last_heartbeat: new Date().toISOString(),
                    app_version: app_version
                })
                .select('id')
                .single();

            if (createError) throw createError;
            deviceId = newDevice.id;
        }

        // 2. Iniciar Nova Sessão Limpa
        const { data: session, error: sessionError } = await supabase
            .from('sessions')
            .insert({
                device_id: deviceId,
                app_version: app_version,
                started_at: new Date().toISOString(),
                last_heartbeat_at: new Date().toISOString(),
                status: 'active'
            })
            .select()
            .single();

        if (sessionError) throw sessionError;

        // 3. Registrar Evento de Abertura
        await supabase.from('session_events').insert({
            session_id: session.id,
            device_id: deviceId,
            event_type: 'APP_OPEN',
            metadata: { hostname: hostname, app_version }
        });

        return NextResponse.json({
            success: true,
            session_id: session.id,
            deviceId: deviceId
        });

    } catch (err: any) {
        console.error('[SESSION_START] Critical Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
