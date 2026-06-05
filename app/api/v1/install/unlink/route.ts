import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { installation_id } = body;

        if (!installation_id) {
            return NextResponse.json({ error: 'Missing installation_id' }, { status: 400 });
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Desvincular: update user_id = null
        const { error } = await supabase
            .from('installations')
            .update({
                user_id: null,
                updated_at: new Date().toISOString()
            })
            .eq('id', installation_id);

        if (error) throw error;

        // Limpar comandos pendentes desta instalação
        await supabase
            .from('device_commands')
            .delete()
            .eq('installation_id', installation_id)
            .eq('status', 'pending');

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('[API/UNLINK] Erro:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
