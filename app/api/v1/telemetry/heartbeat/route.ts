import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
    try {
        const { installation_id, is_optimized } = await request.json();

        if (!installation_id) {
            return NextResponse.json({ error: 'Missing installation_id' }, { status: 400 });
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseServiceKey) {
            return NextResponse.json({ error: 'Database configuration missing' }, { status: 500 });
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Update heartbeat and optimization status
        const updateData: any = {
            last_heartbeat: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        if (is_optimized !== undefined) {
            updateData.is_optimized = is_optimized;
            if (is_optimized) {
                updateData.last_optimized_at = new Date().toISOString();
            }
        }

        const { error } = await supabase
            .from('installations')
            .update(updateData)
            .eq('id', installation_id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('[HEARTBEAT] error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
