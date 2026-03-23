import { NextResponse } from 'next/server';

/**
 * ROTA DE TESTE DESATIVADA POR SEGURANÇA
 * Esta rota foi removida pois permitia geração de licenças sem autenticação.
 */
export async function GET() {
    return NextResponse.json({ error: 'Not Found' }, { status: 404 });
}
