import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const maxDuration = 10;

/**
 * API de DEBUG para verificar se a licença foi gerada
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const paymentId = searchParams.get('payment_id');
  
  if (!paymentId) {
    return NextResponse.json({ error: 'payment_id required' }, { status: 400 });
  }
  
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Buscar pagamento
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('payment_id', paymentId)
      .single();
    
    if (paymentError) {
      return NextResponse.json({
        payment_found: false,
        error: paymentError.message,
      });
    }
    
    // Buscar licença
    const { data: license, error: licenseError } = await supabase
      .from('licenses')
      .select('*')
      .eq('payment_id', payment.id)
      .single();
    
    return NextResponse.json({
      payment_found: true,
      payment: {
        id: payment.id,
        payment_id: payment.payment_id,
        status: payment.status,
        processed_at: payment.processed_at,
        email: payment.email,
        license_type: payment.license_type,
      },
      license_found: !!license,
      license: license ? {
        id: license.id,
        license_key: license.license_key,
        license_type: license.license_type,
        expires_at: license.expires_at,
        max_devices: license.max_devices,
        is_active: license.is_active,
      } : null,
      license_error: licenseError?.message,
    });
    
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
    }, { status: 500 });
  }
}
