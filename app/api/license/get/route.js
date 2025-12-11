import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 30;

/**
 * API para buscar licença por preference_id ou payment_id
 * 
 * Query params:
 * - preference_id: ID da preferência do Mercado Pago
 * - payment_id: ID do pagamento (nosso UUID)
 * - email: Email do comprador (opcional)
 */
export async function GET(request) {
  try {
    console.log('[License API] Requisição recebida:', request.url);
    
    // Usar service_role key se disponível
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    let supabase;
    if (supabaseServiceKey) {
      const { createClient: createSupabaseClient } = await import('@supabase/supabase-js');
      supabase = createSupabaseClient(supabaseUrl, supabaseServiceKey);
    } else {
      const { createClient } = await import('@/utils/supabase/server');
      supabase = await createClient();
    }
    
    const { searchParams } = new URL(request.url);
    
    const preferenceId = searchParams.get('preference_id');
    const paymentId = searchParams.get('payment_id');
    const email = searchParams.get('email');
    
    if (!preferenceId && !paymentId && !email) {
      return NextResponse.json(
        { error: 'preference_id, payment_id ou email é obrigatório' },
        { status: 400 }
      );
    }
    
    // Buscar pagamento
    let paymentQuery = supabase
      .from('payments')
      .select('*');
    
    if (paymentId) {
      paymentQuery = paymentQuery.eq('id', paymentId);
    } else if (preferenceId) {
      paymentQuery = paymentQuery.eq('preference_id', preferenceId);
    } else if (email) {
      paymentQuery = paymentQuery.eq('email', email).order('created_at', { ascending: false }).limit(1);
    }
    
    const { data: payment, error: paymentError } = await paymentQuery.single();
    
    if (paymentError || !payment) {
      return NextResponse.json(
        { error: 'Pagamento não encontrado' },
        { status: 404 }
      );
    }
    
    // Buscar licença associada ao pagamento
    const { data: license, error: licenseError } = await supabase
      .from('licenses')
      .select('*')
      .eq('payment_id', payment.id)
      .single();
    
    if (licenseError || !license) {
      // Se o pagamento foi aprovado mas ainda não tem licença, retornar status de processamento
      if (payment.status === 'approved') {
        return NextResponse.json({
          payment: {
            id: payment.id,
            status: payment.status,
            amount: payment.amount,
            email: payment.email,
          },
          license: null,
          message: 'Pagamento aprovado. Licença está sendo gerada. Aguarde alguns instantes e recarregue a página.',
        });
      }
      
      return NextResponse.json(
        { error: 'Licença não encontrada para este pagamento' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      payment: {
        id: payment.id,
        status: payment.status,
        amount: payment.amount,
        email: payment.email,
      },
      license: {
        license_key: license.license_key,
        license_type: license.license_type,
        expires_at: license.expires_at,
        max_devices: license.max_devices,
        devices_in_use: license.devices_in_use,
        is_active: license.is_active,
      },
    });
  } catch (error) {
    console.error('[License API] Erro:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao buscar licença' },
      { status: 500 }
    );
  }
}






