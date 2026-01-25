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

        console.log('[DEBUG] Buscando instalação:', installation_id);

        // Buscar a instalação usando service role (ignora RLS)
        const { data, error } = await supabase
            .from('installations')
            .select('*')
            .eq('id', installation_id)
            .single();

        console.log('[DEBUG] Resultado:', { data, error });

        if (error) {
            return NextResponse.json({
                error: error.message,
                details: error
            }, { status: 500 });
        }

        return NextResponse.json({
            installation: data,
            message: data ? 'Instalação encontrada' : 'Instalação não encontrada'
        });
    } catch (error: any) {
        console.error('[DEBUG] Erro:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
