import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const supabase = await createClient();

        // Fetch last 100 events joined with device info
        const { data: logs, error } = await supabase
            .from('telemetry_events')
            .select(`
                id,
                event_type,
                feature_name,
                action_name,
                success,
                timestamp,
                machine_id,
                metadata,
                device:devices(hostname)
            `)
            .order('timestamp', { ascending: false })
            .limit(100);

        if (error) throw error;

        const formattedLogs = logs.map((log: any) => ({
            ...log,
            hostname: log.device?.hostname || 'Unknown'
        }));

        return NextResponse.json({ logs: formattedLogs });
    } catch (error) {
        console.error('Logs API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
