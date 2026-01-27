import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const heartbeatSchema = z.object({
    machine_id: z.string(),
    status: z.string(),
    metrics: z.object({
        cpu_usage: z.number().optional(),
        ram_usage_percent: z.number().optional(),
        disk_usage_percent: z.number().optional(),
        last_boot_time_seconds: z.number().optional(),
    }),
    active_alerts: z.array(z.object({
        type: z.string(),
        level: z.string(),
        message: z.string(),
        timestamp: z.string().optional(),
    })).optional(),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const result = heartbeatSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
        }

        const { machine_id, status, metrics, active_alerts } = result.data;

        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // 1. Get Device ID
        const { data: device } = await supabaseAdmin
            .from('devices')
            .select('id, company_id')
            .eq('machine_id', machine_id)
            .single();

        if (!device) {
            return NextResponse.json({ error: 'Device not found' }, { status: 404 });
        }

        // 2. Insert Telemetry
        await supabaseAdmin.from('telemetry_logs').insert({
            device_id: device.id,
            company_id: device.company_id,
            cpu_usage: metrics.cpu_usage,
            ram_usage_percent: metrics.ram_usage_percent,
            disk_usage_percent: metrics.disk_usage_percent,
            boot_time_seconds: metrics.last_boot_time_seconds,
        });

        // 3. Update Device Status
        await supabaseAdmin
            .from('devices')
            .update({
                status: 'online', // Implicitly online if sending heartbeat
                last_heartbeat: new Date().toISOString(),
                // Check if we should update 'status' column based on alerts (e.g. 'critical')
                // For now, let's keep 'status' as connection status and use dashboard for health
            })
            .eq('id', device.id);

        // 4. Handle Alerts
        if (active_alerts && active_alerts.length > 0) {
            const alertsToInsert = active_alerts.map(alert => ({
                device_id: device.id,
                company_id: device.company_id,
                type: alert.type,
                level: alert.level,
                message: alert.message,
                created_at: alert.timestamp || new Date().toISOString(),
            }));

            await supabaseAdmin.from('device_alerts').insert(alertsToInsert);
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('Heartbeat Error:', err);
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}
