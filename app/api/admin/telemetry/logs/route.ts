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
                created_at,
                duration_ms,
                error_code,
                metadata,
                device_id,
                session_id,
                device:devices(machine_id, hostname, status)
            `)
            .order('created_at', { ascending: false })
            .limit(100);

        if (error) throw error;

        console.log('[Telemetry Logs API] Raw logs count:', logs?.length || 0);
        console.log('[Telemetry Logs API] First log sample:', logs?.[0]);

        const formattedLogs = logs?.map((log: any) => ({
            id: log.id,
            timestamp: log.created_at,
            event_type: log.event_type,
            feature_name: log.feature_name,
            action_name: log.action_name,
            success: log.success,
            duration_ms: log.duration_ms,
            error_code: log.error_code,
            metadata: log.metadata,
            device_id: log.device_id,
            session_id: log.session_id,
            machine_id: log.device?.machine_id || 'Unknown',
            hostname: log.device?.hostname || 'Unknown',
            status: log.device?.status || 'offline'
        })) || [];

        console.log('[Telemetry Logs API] Formatted logs count:', formattedLogs.length);
        console.log('[Telemetry Logs API] First formatted log:', formattedLogs[0]);

        return NextResponse.json({ logs: formattedLogs });

    } catch (error) {
        console.error('Logs API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
