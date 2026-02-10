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

        // 1. Resolve Device (Thread-Safe Upsert)
        // Isso garante que o dispositivo exista e seu hostname esteja atualizado
        const { data: device, error: devError } = await supabase
            .from('devices')
            .upsert({
                machine_id: machine_id,
                hostname: hostname || 'Unknown-Node',
                status: 'online',
                last_heartbeat: new Date().toISOString(),
                app_version: app_version
            }, { onConflict: 'machine_id' })
            .select('id')
            .single();

        if (devError || !device) {
            console.error('[SESSION] Failed to resolve device:', devError);
            return NextResponse.json({ error: 'Device sync failed' }, { status: 500 });
        }

        const deviceId = device.id;

        // 2. Lingering Session Cleanup
        // Encerramos sessões que ficaram "penduradas" para não poluir o dashboard
        await supabase
            .from('sessions')
            .update({
                status: 'timeout',
                ended_at: new Date().toISOString()
            })
            .eq('device_id', deviceId)
            .in('status', ['active', 'idle']);

        // 3. Create Fresh Session
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

        if (sessionError || !session) {
            console.error('[SESSION] Failed to create session:', sessionError);
            return NextResponse.json({ error: 'Session creation failed' }, { status: 500 });
        }

        // 4. Log APP_OPEN Event
        await supabase.from('session_events').insert({
            session_id: session.id,
            device_id: deviceId,
            event_type: 'APP_OPEN',
            metadata: {
                app_version,
                hostname: hostname || 'Unknown',
                source: 'desktop_app'
            }
        });

        return NextResponse.json({
            success: true,
            session_id: session.id,
            deviceId: deviceId
        });

    } catch (err: any) {
        console.error('[SESSION] Global Error:', err);
        return NextResponse.json({ error: err.message || 'Server Error' }, { status: 500 });
    }
}
