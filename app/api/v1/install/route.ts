import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { installation_id, app_version, hardware } = body;

        if (!installation_id) {
            return NextResponse.json({ error: 'Missing installation_id' }, { status: 400 });
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseServiceKey) {
            return NextResponse.json({ error: 'Database configuration missing' }, { status: 500 });
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Upsert installation record
        const { error } = await supabase
            .from('installations')
            .upsert({
                id: installation_id,
                app_version: app_version,
                cpu_name: hardware?.cpu_name,
                ram_gb_total: hardware?.ram_gb_total,
                disk_main_type: hardware?.disk_main_type,
                os_name: hardware?.os_name,
                os_build: hardware?.os_build,
                architecture: hardware?.architecture,
                last_heartbeat: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }, { onConflict: 'id' });

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('[INSTALL] error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
