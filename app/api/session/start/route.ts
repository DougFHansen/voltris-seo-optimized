import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { machine_id, app_version } = body;

        if (!machine_id) {
            return NextResponse.json({ error: 'Missing machine_id' }, { status: 400 });
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // 1. Resolve Device ID
        // Upsert device first to ensure it exists for free users too
        const { data: existingDevice } = await supabase
            .from('devices')
            .select('id')
            .eq('machine_id', machine_id)
            .single();

        let deviceId = existingDevice?.id;

        if (!deviceId) {
            // Auto-register free user device if not exists
            const { data: newDevice } = await supabase
                .from('devices')
                .insert({
                    machine_id: machine_id,
                    hostname: 'Unknown', // Ideally client sends this
                    status: 'online',
                    app_version: app_version
                })
                .select()
                .single();

            deviceId = newDevice?.id;
        }

        if (!deviceId) {
            return NextResponse.json({ error: 'Device registration failed' }, { status: 500 });
        }

        // 2. Close any lingering active sessions for this device (cleanup)
        await supabase
            .from('sessions')
            .update({
                status: 'timeout',
                ended_at: new Date().toISOString()
            })
            .eq('device_id', deviceId)
            .eq('status', 'active');

        // 3. Create New Session
        const { data: session, error } = await supabase
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

        if (error) throw error;

        // 4. Log Event
        await supabase.from('session_events').insert({
            session_id: session.id,
            device_id: deviceId,
            event_type: 'APP_OPEN',
            metadata: { app_version }
        });

        // 5. Update Device Status
        await supabase
            .from('devices')
            .update({
                status: 'online',
                last_heartbeat: new Date().toISOString(),
                app_version: app_version
            })
            .eq('id', deviceId);

        return NextResponse.json({
            success: true,
            session_id: session.id
        });

    } catch (err: any) {
        console.error('Session Start Error:', err);
        return NextResponse.json({ error: err.message || 'Server Error' }, { status: 500 });
    }
}
