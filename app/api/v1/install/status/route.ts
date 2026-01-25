import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const installation_id = searchParams.get('installation_id');

        if (!installation_id) {
            return NextResponse.json({ error: 'Missing installation_id' }, { status: 400 });
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseServiceKey) {
            return NextResponse.json({ error: 'Database configuration missing' }, { status: 500 });
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Buscar a instalação e o perfil associado
        const { data: installation, error } = await supabase
            .from('installations')
            .select(`
                user_id,
                profiles:user_id (
                    email
                )
            `)
            .eq('id', installation_id)
            .single();

        if (error || !installation) {
            return NextResponse.json({ is_linked: false, email: null });
        }

        // @ts-ignore - Handle joined data
        const email = installation.profiles?.email;

        return NextResponse.json({
            is_linked: !!installation.user_id,
            email: email || null
        });
    } catch (error: any) {
        console.error('[STATUS] error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
