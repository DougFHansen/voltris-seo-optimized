import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { session_id, event_type, metadata } = body;

        if (!session_id || !event_type) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // 1. Retrieve session to get device_id
        const { data: session } = await supabase
            .from('sessions')
            .select('device_id, status')
            .eq('id', session_id)
            .single();

        if (!session) {
            return NextResponse.json({ error: 'Session not found' }, { status: 404 });
        }

        // 2. Insert Event
        await supabase.from('session_events').insert({
            session_id: session_id,
            device_id: session.device_id,
            event_type: event_type,
            metadata: metadata || {}
        });

        // 3. If IDLE or ACTIVE, update session status
        if (event_type === 'IDLE_START' && session.status === 'active') {
            await supabase.from('sessions').update({ status: 'idle' }).eq('id', session_id);
            // Update device status too if strictly realtime
            await supabase.from('devices').update({ status: 'idle' }).eq('id', session.device_id);
        }
        else if (event_type === 'ACTIVITY_RESUME' && session.status === 'idle') {
            await supabase.from('sessions').update({ status: 'active' }).eq('id', session_id);
            await supabase.from('devices').update({ status: 'online' }).eq('id', session.device_id);
        }

        return NextResponse.json({ success: true });

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
