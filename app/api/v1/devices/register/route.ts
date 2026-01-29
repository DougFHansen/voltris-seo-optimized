import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Schema Validation
const registerSchema = z.object({
    identity: z.object({
        machine_id: z.string(), // GUID gerado pelo app desktop (Installation ID)
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

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !serviceRoleKey) {
            console.error('[API/DEVICES/REGISTER] Missing Supabase configuration');
            return NextResponse.json({ error: 'Database configuration missing' }, { status: 500 });
        }

        // Initialize Admin Client (Bypass RLS for Installation Registration)
        const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

        // Mapear para o modelo moderno baseado em \"installations\"
        const payload: any = {
            id: identity.machine_id,          // installations.id = GUID do app
            app_version: app_version ?? null,
            cpu_name: identity.cpu_model ?? null,
            ram_gb_total: identity.ram_total_gb ?? null,
            os_build: identity.os_version ?? null,
            // Campos adicionais podem ser mapeados aqui no futuro (disk_main_type, os_name, architecture, etc.)
            updated_at: new Date().toISOString(),
        };

        const { data, error } = await supabaseAdmin
            .from('installations')
            .upsert(payload, { onConflict: 'id' })
            .select('id')
            .single();

        if (error) {
            console.error('[API/DEVICES/REGISTER] Error registering installation:', error);
            return NextResponse.json({ error: 'Database error', details: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, installation_id: data.id });
    } catch (err) {
        console.error('[API/DEVICES/REGISTER] Register API Error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
