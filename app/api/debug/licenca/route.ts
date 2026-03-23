import { NextResponse } from 'next/server';

/**
 * ROTA DE DIAGNÓSTICO DESATIVADA POR SEGURANÇA
 * Esta rota foi removida pois expunha dados sensíveis sem autenticação.
 */
export async function GET() {
    return NextResponse.json({ error: 'Not Found' }, { status: 404 });
}
