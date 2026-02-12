import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { command_id, status, result_data } = body;

        if (!command_id || !status) {
            return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
        }

        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { error } = await supabaseAdmin
            .from('device_commands')
            .update({
                status: status,
                result_data: result_data,
                executed_at: new Date().toISOString(),
            })
            .eq('id', command_id);

        if (error) {
            console.error('[API/COMMANDS/UPDATE] Error:', error);
            return NextResponse.json({ error: 'Update failed' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('[API/COMMANDS/UPDATE] Server Error:', err);
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}
