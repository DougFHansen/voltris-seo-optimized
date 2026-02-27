import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const sessionStartSchema = z.object({
    machine_id: z.string().uuid(),
    hostname: z.string(),
    app_version: z.string(),
    hardware: z.object({
        cpu_model: z.string(),
        gpu_model: z.string().optional(),
        ram_total_gb: z.number(),
        disk_type: z.string().optional(),
        os_version: z.string(),
        windows_build: z.string().optional(),
        windows_edition: z.string().optional(),
        architecture: z.string().optional(),
    }),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const result = sessionStartSchema.safeParse(body);

        if (!result.success) {
            console.error('[API/SESSIONS/START] Validation error:', result.error);
            return NextResponse.json({ error: 'Invalid payload', details: result.error }, { status: 400 });
        }

        const { machine_id, hostname, app_version, hardware } = result.data;

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !serviceRoleKey) {
            console.error('[API/SESSIONS/START] Missing Supabase configuration');
            return NextResponse.json({ error: 'Database configuration missing' }, { status: 500 });
        }

        const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

        // 1. Ensure device exists
        let device;
        const { data: existingDevice } = await supabaseAdmin
            .from('devices')
            .select('id')
            .eq('machine_id', machine_id)
            .single();

        if (existingDevice) {
            device = existingDevice;
            // Update hostname and app_version if changed
            await supabaseAdmin
                .from('devices')
                .update({
                    hostname,
                    app_version,
                    last_heartbeat_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
                .eq('id', existingDevice.id);
        } else {
            // Create new device
            const { data: newDevice, error: deviceError } = await supabaseAdmin
                .from('devices')
                .insert({
                    machine_id,
                    hostname,
                    app_version,
                    os_version: hardware.os_version,
                    architecture: hardware.architecture || 'x64',
                    last_heartbeat_at: new Date().toISOString(),
                })
                .select('id')
                .single();

            if (deviceError) {
                console.error('[API/SESSIONS/START] Error creating device:', deviceError);
                return NextResponse.json({ error: 'Failed to create device' }, { status: 500 });
            }

            device = newDevice;
        }

        // 2. Upsert device profile
        await supabaseAdmin
            .from('device_profiles')
            .upsert({
                device_id: device.id,
                cpu_model: hardware.cpu_model,
                gpu_model: hardware.gpu_model || 'Unknown GPU',
                ram_total_gb: hardware.ram_total_gb,
                disk_type: hardware.disk_type || 'HDD',
                os_version: hardware.os_version,
                windows_build: hardware.windows_build,
                windows_edition: hardware.windows_edition,
                updated_at: new Date().toISOString(),
            }, {
                onConflict: 'device_id'
            });

        // 3. Close any existing active/idle sessions for this device
        await supabaseAdmin
            .from('sessions')
            .update({
                status: 'closed',
                ended_at: new Date().toISOString(),
            })
            .eq('device_id', device.id)
            .in('status', ['active', 'idle']);

        // 4. Create new session
        const { data: newSession, error: sessionError } = await supabaseAdmin
            .from('sessions')
            .insert({
                device_id: device.id,
                status: 'active',
                app_version,
                health_score: 100,
                started_at: new Date().toISOString(),
                last_heartbeat_at: new Date().toISOString(),
            })
            .select('id')
            .single();

        if (sessionError) {
            console.error('[API/SESSIONS/START] Error creating session:', sessionError);
            return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
        }

        // 5. Log session start event
        await supabaseAdmin
            .from('telemetry_events')
            .insert({
                session_id: newSession.id,
                device_id: device.id, // VITAL: Adicionar device_id para JOIN no painel Admin
                event_type: 'APP_START',
                feature_name: 'System',
                action_name: 'Application Started',
                metadata: {
                    app_version,
                    hostname,
                    os_version: hardware.os_version,
                },
            });

        console.log('[API/SESSIONS/START] Session created successfully:', newSession.id);

        return NextResponse.json({
            success: true,
            session_id: newSession.id,
            device_id: device.id,
        });
    } catch (err: any) {
        console.error('[API/SESSIONS/START] Error:', err);
        return NextResponse.json({ error: 'Server Error', details: err.message }, { status: 500 });
    }
}
