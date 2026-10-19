import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { chavePublicaDoServidor, chavePrivadaDoServidor } from '@/lib/vapid-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * ESTADO REAL DO WEB PUSH no servidor.
 *
 * O cliente precisa saber se o push está realmente pronto — não basta o
 * navegador ter permissão. Se a chave privada VAPID não estiver no ambiente
 * do servidor, o aviso com o site fechado NÃO VAI FUNCIONAR, e o painel
 * precisa dizer isso (em vez de fingir que está ativado).
 *
 * A chave privada NUNCA sai daqui: só dizemos se ela existe.
 */
export async function GET(req: NextRequest) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const auth = req.headers.get('authorization');
    const token = auth?.toLowerCase().startsWith('bearer ') ? auth.slice(7).trim() : null;

    let autenticado = false;
    if (token) {
        const { data } = await supabase.auth.getUser(token);
        autenticado = !!data?.user?.id;
    }

    const privado = chavePrivadaDoServidor();
    const disponivel = !!privado;

    return NextResponse.json({
        autenticado,
        chavePublica: chavePublicaDoServidor(),
        privadoConfigurado: disponivel,
        disponivel,
        motivo: disponivel
            ? null
            : 'O servidor não conseguiu obter um par VAPID. O aviso com o site fechado fica indisponível até isso ser resolvido.',
    });
}
