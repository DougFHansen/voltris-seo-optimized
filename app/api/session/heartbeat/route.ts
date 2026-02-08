import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { session_id, event_type, machine_id } = body;

        if (!session_id || !machine_id) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // 1. Update Session Heartbeat
        const now = new Date();

        // Use RPC or direct update to calculate duration
        // Simplified approach: Update last_heartbeat and verify status
        const { data: session, error } = await supabase
            .from('sessions')
            .update({
                last_heartbeat_at: now.toISOString(),
                // If event is heatbeat, logic implies still active
                // We calculate duration dynamically in queries or on end
            })
            .eq('id', session_id)
            .select('started_at')
            .single();

        if (error) {
            // If session not found, maybe tell client to restart session?
            return NextResponse.json({ error: 'Session not found' }, { status: 404 });
        }

        // 2. Update Device Heartbeat (Legacy compatibility)
        await supabase
            .from('devices')
            .update({
                last_heartbeat: now.toISOString(),
                status: 'online'
            })
            .eq('machine_id', machine_id);

        // 3. Update existing duration just in case
        if (session) {
            const startTime = new Date(session.started_at).getTime();
            const duration = Math.floor((now.getTime() - startTime) / 1000);

            await supabase
                .from('sessions')
                .update({ duration_seconds: duration })
                .eq('id', session_id);
        }

        return NextResponse.json({ success: true });

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
