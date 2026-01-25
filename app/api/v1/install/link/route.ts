import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
    try {
        const { installation_id, user_id } = await request.json();

        if (!installation_id || !user_id) {
            return NextResponse.json({ error: 'Missing installation_id or user_id' }, { status: 400 });
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
                user_id: user_id,
                updated_at: new Date().toISOString()
            })
            .eq('id', installation_id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('[LINK] error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
