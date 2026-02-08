import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { session_id, machine_id } = body;

        if (!session_id) {
            return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const now = new Date();

        // 1. Get Session Start Time
        const { data: session } = await supabase
            .from('sessions')
            .select('started_at, device_id')
            .eq('id', session_id)
            .single();

        if (session) {
            const duration = Math.floor((now.getTime() - new Date(session.started_at).getTime()) / 1000);

            // 2. Close Session
            await supabase
                .from('sessions')
                .update({
                    status: 'completed',
                    ended_at: now.toISOString(),
                    duration_seconds: duration
                })
                .eq('id', session_id);

            // 3. Log Event
            await supabase.from('session_events').insert({
                session_id: session_id,
                device_id: session.device_id,
                event_type: 'APP_CLOSE',
                metadata: { duration }
            });

            // 4. Update Device Status (Offline)
            await supabase
                .from('devices')
                .update({ status: 'offline' })
                .eq('id', session.device_id);
        }

        return NextResponse.json({ success: true });

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
