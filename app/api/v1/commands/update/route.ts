import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { command_id, status, result_data } = body;

        if (!command_id || !status) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        const { error } = await supabase
            .from('device_commands')
            .update({
                status: status, // 'completed' ou 'failed'
                result_data: result_data,
                executed_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .eq('id', command_id);

        if (error) throw error;

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('[API/COMMANDS/UPDATE] Erro:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
