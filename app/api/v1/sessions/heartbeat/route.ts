import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const heartbeatSchema = z.object({
    session_id: z.string().uuid(),
    machine_id: z.string().uuid(),
    status: z.enum(['active', 'idle']).optional(),
    health_score: z.number().min(0).max(100).optional(),
    event: z.object({
        event_type: z.string(),
        feature_name: z.string().optional(),
        action_name: z.string().optional(),
        metadata: z.record(z.any()).optional(),
    }).optional(),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const result = heartbeatSchema.safeParse(body);

        if (!result.success) {
            console.error('[API/SESSIONS/HEARTBEAT] Validation error:', result.error);
            return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
        }

        const { session_id, machine_id, status, health_score, event } = result.data;

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !serviceRoleKey) {
            return NextResponse.json({ error: 'Database configuration missing' }, { status: 500 });
        }

        const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

        // 1. Verify session exists
        const { data: session, error: sessionError } = await supabaseAdmin
            .from('sessions')
            .select('id, device_id')
            .eq('id', session_id)
            .single();

        if (sessionError || !session) {
            console.error('[API/SESSIONS/HEARTBEAT] Session not found:', session_id);
            return NextResponse.json({ error: 'Session not found' }, { status: 404 });
        }

        // 2. Update session heartbeat
        const updateData: any = {
            last_heartbeat_at: new Date().toISOString(),
        };

        if (status) {
            updateData.status = status;
        }

        if (health_score !== undefined) {
            updateData.health_score = health_score;
        }

        await supabaseAdmin
            .from('sessions')
            .update(updateData)
            .eq('id', session_id);

        // 3. Log event if provided
        if (event) {
            await supabaseAdmin
                .from('telemetry_events')
                .insert({
                    session_id,
                    event_type: event.event_type,
                    feature_name: event.feature_name || 'System',
                    action_name: event.action_name || 'Heartbeat',
                    metadata: event.metadata || {},
                });
        }

        // 4. Update installation last_heartbeat for backward compatibility
        const { data: device } = await supabaseAdmin
            .from('devices')
            .select('machine_id')
            .eq('id', session.device_id)
            .single();

        if (device) {
            await supabaseAdmin
                .from('installations')
                .update({ last_heartbeat: new Date().toISOString() })
                .eq('id', device.machine_id);
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error('[API/SESSIONS/HEARTBEAT] Error:', err);
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}
