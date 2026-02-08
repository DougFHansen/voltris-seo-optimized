import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Endpoint para receber BATCH de eventos de telemetria
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { events, session_id, device_id: machine_id } = body;

        if (!Array.isArray(events) || events.length === 0) {
            return NextResponse.json({ success: true, message: 'No events to process' });
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // 1. Resolver UUID
        const { data: device } = await supabase
            .from('devices')
            .select('id')
            .eq('machine_id', machine_id)
            .single();

        // Se não achar o device, podemos tentar usar o session_id ou ignorar (logar erro)
        // Mas por segurança, se não achou, não inserimos ou usamos null se permitido
        if (!device) {
            console.warn(`[Telemetry] Device not found for machine_id: ${machine_id}. Skipping batch.`);
            return NextResponse.json({ success: false, error: 'Device not found' });
        }

        const real_device_id = device.id;

        // Preparar eventos para inserção em lote
        const formattedEvents = events.map((e: any) => ({
            session_id: session_id, // Pode vir no body principal ou em cada evento
            device_id: real_device_id,
            event_type: e.event_type,
            feature_name: e.feature_name,
            action_name: e.action_name,
            duration_ms: e.duration_ms,
            success: e.success,
            error_code: e.error_code,
            metadata: e.metadata, // JSON extra
            created_at: e.timestamp || new Date().toISOString()
        }));

        const { error } = await supabase
            .from('telemetry_events')
            .insert(formattedEvents);

        if (error) throw error;

        return NextResponse.json({ success: true, count: events.length });

    } catch (err: any) {
        console.error('Telemetry Events Batch Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
