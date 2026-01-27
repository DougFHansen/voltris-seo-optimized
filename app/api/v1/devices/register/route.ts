import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Schema Validation
const registerSchema = z.object({
    identity: z.object({
        machine_id: z.string(),
        hostname: z.string().optional(),
        os_version: z.string().optional(),
        cpu_model: z.string().optional(),
        ram_total_gb: z.number().optional(),
        disk_serial: z.string().optional(),
        mac_address: z.string().optional(),
    }),
    app_version: z.string().optional(),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const result = registerSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: 'Invalid payload', details: result.error }, { status: 400 });
        }

        const { identity, app_version } = result.data;

        // Initialize Admin Client (Bypass RLS for Device Registration)
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Upsert Device
        const { data, error } = await supabaseAdmin
            .from('devices')
            .upsert(
                {
                    machine_id: identity.machine_id,
                    hostname: identity.hostname,
                    os_version: identity.os_version,
                    cpu_model: identity.cpu_model,
                    ram_total_gb: identity.ram_total_gb,
                    disk_serial: identity.disk_serial,
                    mac_address: identity.mac_address,
                    app_version: app_version,
                    updated_at: new Date().toISOString(),
                    // Note: company_id is NOT set here. Must be linked later or via Token if implemented.
                },
                { onConflict: 'machine_id' }
            )
            .select()
            .single();

        if (error) {
            console.error('Error registering device:', error);
            return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

        return NextResponse.json({ success: true, device_id: data.id });
    } catch (err) {
        console.error('Register API Error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
