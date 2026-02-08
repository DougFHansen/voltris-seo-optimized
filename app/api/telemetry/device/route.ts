import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Endpoint para registrar/atualizar Perfil de Hardware
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            device_id,
            cpu_model,
            gpu_model,
            ram_total_gb,
            disk_type,
            os_version,
            windows_build,
            is_64bit,
            is_admin,
            screen_resolution
        } = body;

        if (!device_id) {
            return NextResponse.json({ error: 'Missing device_id' }, { status: 400 });
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Upsert device profile
        const { error } = await supabase
            .from('device_profiles')
            .upsert({
                device_id,
                cpu_model,
                gpu_model,
                ram_total_gb,
                disk_type,
                os_version,
                windows_build,
                is_64bit,
                is_admin,
                screen_resolution,
                updated_at: new Date().toISOString()
            }, { onConflict: 'device_id' });

        if (error) {
            console.error('Check your supabase schema for device_profiles table', error);
            throw error;
        }

        return NextResponse.json({ success: true });

    } catch (err: any) {
        console.error('Telemetry Device Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
