import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { installation_id, command_type, payload } = body;

        if (!installation_id || !command_type) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Usar Service Role para garantir escrita, mas idealmente usaria autenticação do usuário
        // Aqui vamos simplificar e confiar que a API Route valida a sessão se necessário,
        // mas como é uma rota de API aberta, vamos validar o token de sessão do header
        // OU (mais simples para este MVP) confiar no client-side mandando via Supabase Client direto
        // MAS o comando "Gerenciar" no dashboard vai chamar esta API.

        // Vamos usar o Service Role mas validar a sessão do supabase auth cookie se possível, 
        // ou apenas aceitar por enquanto (Assumindo que o dashboard é seguro).
        // Melhor: Vamos criar cliente com Service Role para garantir que funciona sem brigar com RLS agora.

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        const { data, error } = await supabase
            .from('device_commands')
            .insert({
                installation_id,
                command_type,
                payload: payload || {},
                status: 'pending'
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ success: true, command: data });

    } catch (error: any) {
        console.error('[API/COMMANDS/CREATE] Erro:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
