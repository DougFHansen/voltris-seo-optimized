import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
    try {
        const { installation_id, license_key, license_status, license_expires_at } = await request.json();

        if (!installation_id) {
            return NextResponse.json({ error: 'Missing installation_id' }, { status: 400 });
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseServiceKey) {
            return NextResponse.json({ error: 'Database configuration missing' }, { status: 500 });
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        const { error } = await supabase
            .from('installations')
            .update({
                license_key: license_key,
                license_status: license_status,
                license_expires_at: license_expires_at,
                updated_at: new Date().toISOString()
            })
            .eq('id', installation_id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('[LICENSE-SYNC] error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
