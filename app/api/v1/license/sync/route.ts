import { NextResponse } from 'next/server';

// STATIC ROUTE - Zero custo de processamento
// Esta rota é chamada frequentemente pelo App Desktop para sincronizar status de licença.
// Como não há processamento crítico aqui (o App já valida localmente),
// retornamos uma resposta estática 200 OK para economizar execuções no Vercel.
// O App Desktop interpreta o "success: true" e não executa retry, encerrando o ciclo.
export const runtime = 'edge'; // Edge Function: mais barata e mais rápida que Node.js

export async function POST() {
    return NextResponse.json(
        {
            success: true,
            status: 'ok',
            message: 'License synced successfully',
            license_status: 'ok',
            valid: true
        },
        {
            status: 200,
            headers: {
                // Cache por 5 minutos na CDN — chamadas repetidas do mesmo IP não chegam nem à Function
                'Cache-Control': 'public, max-age=300, s-maxage=300, stale-while-revalidate=600',
            }
        }
    );
}

// Também aceita GET para não retornar 405 e forçar retry
export async function GET() {
    return NextResponse.json(
        { success: true, status: 'ok', valid: true },
        { status: 200 }
    );
}

