import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';

/**
 * ROTA DE DIAGNÓSTICO — REMOVER APÓS RESOLVER O PROBLEMA
 * Acesse: /api/debug/licenca?ref=VOLTRIS-XXXXX
 */
export async function GET(req: NextRequest) {
    const ref = req.nextUrl.searchParams.get('ref');
    const email = req.nextUrl.searchParams.get('email');

    const supabase = createAdminClient();
    const result: any = {
        env: {
            supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL,
            has_service_key: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        },
        payments: null,
        licenses: null,
        rpc_test: null,
        errors: []
    };

    // Testar conexão listando payments
    const { data: payments, error: pErr } = await supabase
        .from('payments')
        .select('id, reference_id, email, status, plan_type, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

    result.payments = { data: payments, error: pErr?.message };

    // Buscar por ref específico
    if (ref) {
        const { data: p, error: pe } = await supabase
            .from('payments')
            .select('*')
            .eq('reference_id', ref)
            .maybeSingle();
        result.payment_by_ref = { data: p, error: pe?.message };
    }

    // Listar licenças
    const licQuery = supabase
        .from('licenses')
        .select('id, email, license_key, license_type, is_active, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

    const { data: lics, error: lErr } = await licQuery;
    result.licenses = { data: lics, error: lErr?.message };

    if (email) {
        const { data: userLics, error: ulErr } = await supabase
            .from('licenses')
            .select('*')
            .eq('email', email);
        result.licenses_by_email = { data: userLics, error: ulErr?.message };
    }

    // Testar se a função RPC existe
    const { data: rpcTest, error: rpcErr } = await supabase
        .rpc('generate_voltris_signature', { p_content: 'teste' });
    result.rpc_test = { data: rpcTest, error: rpcErr?.message };

    return NextResponse.json(result, { status: 200 });
}
