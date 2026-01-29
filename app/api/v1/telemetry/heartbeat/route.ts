import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const heartbeatSchema = z.object({
    machine_id: z.string(), // Deve ser o mesmo GUID enviado em /devices/register
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

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !serviceRoleKey) {
            console.error('[API/TELEMETRY/HEARTBEAT] Missing Supabase configuration');
            return NextResponse.json({ error: 'Database configuration missing' }, { status: 500 });
        }

        const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

        // 1. Garantir que a instalação existe
        const { data: installation, error: installationError } = await supabaseAdmin
            .from('installations')
            .select('id')
            .eq('id', machine_id)
            .single();

        if (installationError || !installation) {
            console.error('[API/TELEMETRY/HEARTBEAT] Installation not found for machine_id:', machine_id, installationError);
            return NextResponse.json({ error: 'Installation not found' }, { status: 404 });
        }

        // 2. Registrar heartbeat bruto para gráficos
        await supabaseAdmin.from('installation_heartbeats').insert({
            installation_id: installation.id,
            is_optimized: status === 'OK' ? true : null, // Heurística simples; pode ser refinada
        });

        // 3. Atualizar status básico da instalação
        await supabaseAdmin
            .from('installations')
            .update({
                last_heartbeat: new Date().toISOString(),
                is_optimized: status === 'OK' ? true : false,
            })
            .eq('id', installation.id);

        // 4. (Opcional) No futuro: mapear active_alerts -> installation_events
        if (active_alerts && active_alerts.length > 0) {
            console.log('[API/TELEMETRY/HEARTBEAT] Active alerts received:', active_alerts.length);
            // Poderíamos inserir em installation_events aqui.
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('[API/TELEMETRY/HEARTBEAT] Heartbeat Error:', err);
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}
