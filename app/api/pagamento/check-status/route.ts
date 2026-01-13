import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';

/**
 * API para verificar status do pagamento manualmente
 * Útil quando webhooks não estão funcionando
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { preference_id, payment_id } = body;
    
    console.log('[CHECK STATUS] Verificando status manualmente:', { preference_id, payment_id });
    
    if (!preference_id && !payment_id) {
      return NextResponse.json({ 
        error: 'preference_id ou payment_id são necessários' 
      }, { status: 400 });
    }
    
    // Buscar pagamento no banco de dados
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ 
        error: 'Configuração do Supabase incompleta' 
      }, { status: 500 });
    }
    
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Buscar pagamento no banco
    let paymentQuery = supabase
      .from('payments')
      .select('*')
      .limit(1);
    
    // Prioridade de busca: preference_id > payment_id
    if (preference_id) {
      paymentQuery = paymentQuery.eq('preference_id', preference_id);
    } else if (payment_id) {
      paymentQuery = paymentQuery.eq('payment_id', payment_id);
    }
    
    const { data: payment, error: dbError } = await paymentQuery.single();
    
    if (dbError) {
      console.log('[CHECK STATUS] Pagamento não encontrado no banco:', dbError);
      return NextResponse.json({ 
        success: false,
        error: 'Pagamento não encontrado no banco de dados'
      });
    }
    
    console.log('[CHECK STATUS] Pagamento encontrado no banco:', {
      id: payment.id,
      status: payment.status,
      payment_id: payment.payment_id,
      processed_at: payment.processed_at
    });
    
    // Se já está aprovado e processado, retornar imediatamente
    if (payment.status === 'approved' && payment.processed_at) {
      return NextResponse.json({
        success: true,
        payment_approved: true,
        payment_status: 'approved',
        message: 'Pagamento já aprovado e processado'
      });
    }
    
    // Se tem payment_id, verificar status no Mercado Pago
    if (payment.payment_id) {
      try {
        const accessToken = process.env.MP_ACCESS_TOKEN;
        if (!accessToken) {
          throw new Error('Token Mercado Pago não configurado');
        }
        
        const client = new MercadoPagoConfig({ accessToken });
        const mpPayment = new Payment(client);
        
        console.log('[CHECK STATUS] Buscando status no Mercado Pago para payment_id:', payment.payment_id);
        
        const paymentData = await mpPayment.get({ id: payment.payment_id });
        
        console.log('[CHECK STATUS] Status do Mercado Pago:', {
          id: paymentData.id,
          status: paymentData.status,
          status_detail: paymentData.status_detail
        });
        
        // Mapear status
        let mappedStatus: string;
        if (paymentData.status === 'approved' || paymentData.status === 'authorized') {
          mappedStatus = 'approved';
        } else if (paymentData.status === 'rejected') {
          mappedStatus = 'rejected';
        } else if (paymentData.status === 'cancelled') {
          mappedStatus = 'cancelled';
        } else if (paymentData.status === 'pending' || paymentData.status === 'in_process') {
          mappedStatus = 'pending';
        } else {
          mappedStatus = paymentData.status;
        }
        
        // Se o pagamento foi aprovado no Mercado Pago mas ainda não está processado no banco
        if ((paymentData.status === 'approved' || paymentData.status === 'authorized') && !payment.processed_at) {
          console.log('[CHECK STATUS] Pagamento aprovado no MP mas não processado no banco. Atualizando...');
          
          // Atualizar banco de dados
          const { error: updateError } = await supabase
            .from('payments')
            .update({
              status: 'approved',
              processed_at: new Date().toISOString(),
              mercado_pago_data: paymentData,
              updated_at: new Date().toISOString()
            })
            .eq('id', payment.id);
          
          if (updateError) {
            console.error('[CHECK STATUS] Erro ao atualizar pagamento:', updateError);
          } else {
            console.log('[CHECK STATUS] Pagamento atualizado com sucesso no banco');
            
            // Gerar licença se ainda não existir
            const { data: existingLicense } = await supabase
              .from('licenses')
              .select('*')
              .eq('payment_id', payment.id)
              .single();
            
            if (!existingLicense) {
              console.log('[CHECK STATUS] Gerando licença...');
              
              // Importar função de geração de licença
              const module = await import('./../../../webhook/mercadopago/route');
              const { generateLicenseForPayment } = module;
              
              try {
                await generateLicenseForPayment(supabase, payment.id, paymentData);
                console.log('[CHECK STATUS] Licença gerada com sucesso');
              } catch (licenseError) {
                console.error('[CHECK STATUS] Erro ao gerar licença:', licenseError);
              }
            }
          }
          
          return NextResponse.json({
            success: true,
            payment_approved: true,
            payment_status: 'approved',
            message: 'Pagamento aprovado e licença gerada'
          });
        }
        
        return NextResponse.json({
          success: true,
          payment_approved: mappedStatus === 'approved',
          payment_status: mappedStatus,
          message: `Status atual: ${mappedStatus}`
        });
        
      } catch (mpError: any) {
        console.error('[CHECK STATUS] Erro ao verificar no Mercado Pago:', mpError.message);
        return NextResponse.json({
          success: false,
          error: 'Erro ao verificar status no Mercado Pago: ' + mpError.message
        }, { status: 500 });
      }
    }
    
    // Se chegou aqui, o pagamento existe mas ainda não tem payment_id
    return NextResponse.json({
      success: true,
      payment_approved: false,
      payment_status: payment.status || 'pending',
      message: 'Pagamento registrado mas ainda aguardando confirmação'
    });
    
  } catch (error: any) {
    console.error('[CHECK STATUS] Erro geral:', error);
    return NextResponse.json({
      error: error.message
    }, { status: 500 });
  }
}