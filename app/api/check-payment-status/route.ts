import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';

export const runtime = 'nodejs';
export const maxDuration = 10;

/**
 * Endpoint para verificar o status real de um pagamento no Mercado Pago
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('payment_id');
    
    console.log('[CHECK PAYMENT STATUS] Verificando status do pagamento:', paymentId);
    
    if (!paymentId) {
      return NextResponse.json({ 
        error: 'Payment ID is required' 
      }, { status: 400 });
    }
    
    // Buscar dados do pagamento no Mercado Pago
    const accessToken = process.env.MP_ACCESS_TOKEN;
    if (!accessToken) {
      throw new Error('MP_ACCESS_TOKEN not configured');
    }
    
    const client = new MercadoPagoConfig({ accessToken });
    const paymentApi = new Payment(client);
    
    try {
      const paymentData = await paymentApi.get({ id: paymentId });
      
      console.log('[CHECK PAYMENT STATUS] Dados do pagamento:', {
        id: paymentData.id,
        status: paymentData.status,
        status_detail: paymentData.status_detail,
        payment_method: paymentData.payment_method?.type
      });
      
      // Se o pagamento foi aprovado, atualizar no banco
      if (paymentData.status === 'approved') {
        const supabase = await createClient();
        
        // Buscar pagamento no banco
        const { data: existingPayment, error: fetchError } = await supabase
          .from('payments')
          .select('*')
          .eq('payment_id', paymentId)
          .single();
          
        if (existingPayment && !fetchError) {
          // Atualizar status no banco
          const { error: updateError } = await supabase
            .from('payments')
            .update({
              status: 'approved',
              processed_at: new Date().toISOString(),
              mercado_pago_data: paymentData,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingPayment.id);
            
          if (updateError) {
            console.error('[CHECK PAYMENT STATUS] Erro ao atualizar pagamento:', updateError);
          } else {
            console.log('[CHECK PAYMENT STATUS] Pagamento atualizado com sucesso no banco');
            
            // Gerar licença se ainda não existir
            const { data: existingLicense } = await supabase
              .from('licenses')
              .select('*')
              .eq('payment_id', existingPayment.id)
              .single();
              
            if (!existingLicense) {
              console.log('[CHECK PAYMENT STATUS] Gerando licença...');
              
              const licenseKey = `VOLTRIS-LIC-${Date.now().toString(36).toUpperCase().substring(0, 16)}`;
              
              const { data: license, error: licenseError } = await supabase
                .from('licenses')
                .insert({
                  license_key: licenseKey,
                  payment_id: existingPayment.id,
                  email: existingPayment.email,
                  license_type: existingPayment.license_type || 'pro',
                  max_devices: 3,
                  expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
                  is_active: true,
                  activated_at: new Date().toISOString(),
                })
                .select()
                .single();
                
              if (licenseError) {
                console.error('[CHECK PAYMENT STATUS] Erro ao criar licença:', licenseError);
              } else {
                console.log('[CHECK PAYMENT STATUS] Licença gerada com sucesso:', license.id);
              }
            }
          }
        }
      }
      
      return NextResponse.json({
        success: true,
        payment_id: paymentData.id,
        status: paymentData.status,
        status_detail: paymentData.status_detail,
        payment_method: paymentData.payment_method?.type
      });
      
    } catch (mpError: any) {
      console.error('[CHECK PAYMENT STATUS] Erro ao buscar pagamento no Mercado Pago:', mpError.message);
      return NextResponse.json({ 
        error: 'Failed to fetch payment data',
        message: mpError.message
      }, { status: 500 });
    }
    
  } catch (error: any) {
    console.error('[CHECK PAYMENT STATUS] Erro geral:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error.message
    }, { status: 500 });
  }
}