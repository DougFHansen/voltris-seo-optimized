import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic'; // IMPORTANTE para evitar cache no Vercel

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const installationId = searchParams.get('installation_id');

        if (!installationId) {
            return NextResponse.json({ error: 'Missing installation_id' }, { status: 400 });
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Buscar comandos pendentes
        const { data: commands, error } = await supabase
            .from('device_commands')
            .select('*')
            .eq('installation_id', installationId)
            .eq('status', 'pending')
            .order('created_at', { ascending: true }); // Executar na ordem FIFO

        if (error) throw error;

        // Opcional: Marcar como 'fetched' ou 'processing' aqui para evitar execução dupla
        // Se houver comandos, vamos marcá-los como 'processing' imediatamente
        if (commands && commands.length > 0) {
            const commandIds = commands.map(c => c.id);
            await supabase
                .from('device_commands')
                .update({ status: 'processing', updated_at: new Date().toISOString() })
                .in('id', commandIds);
        }

        return NextResponse.json({
            commands: commands || [],
            count: commands?.length || 0
        });

    } catch (error: any) {
        console.error('[API/COMMANDS/PENDING] Erro:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
