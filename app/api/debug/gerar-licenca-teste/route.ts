import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';

/**
 * ROTA DE TESTE DIRETO — REMOVER APÓS CONFIRMAR QUE FUNCIONA
 * Acesse: POST /api/debug/gerar-licenca-teste
 * Body: { "reference_id": "VOLTRIS-...", "email": "..." }
 */
export async function GET(req: NextRequest) {
    const ref = req.nextUrl.searchParams.get('ref');
    const email = req.nextUrl.searchParams.get('email');

    if (!ref || !email) {
        return NextResponse.json({ error: 'Informe ?ref=...&email=...' });
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/pagamento/confirmar-licenca`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference_id: ref, email }),
    });

    const data = await res.json();
    return NextResponse.json({ status: res.status, result: data });
}
