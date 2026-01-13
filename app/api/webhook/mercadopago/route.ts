import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';

export const runtime = 'nodejs';
export const maxDuration = 30;

// Permitir todos os métodos HTTP para testes
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

/**
 * Handler para OPTIONS - CORS preflight
 */
export async function OPTIONS(request: Request) {
  console.log('[WEBHOOK] OPTIONS request received');
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Signature, X-Request-Id',
      'Allow': 'GET, POST, PUT, DELETE, OPTIONS'
    },
  });
}

/**
 * Handler para GET - Verificação e testes
 */
export async function GET(request: Request) {
  console.log('[WEBHOOK] GET request received - Health check');
  return NextResponse.json({ 
    status: 'ok', 
    message: 'Webhook endpoint is active and accepting requests',
    methods_supported: ['GET', 'POST'],
    timestamp: new Date().toISOString()
  }, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    }
  });
}

/**
 * Handler principal para POST - Webhook do Mercado Pago
 */
export async function POST(request: Request) {
  const webhookId = `webhook-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  
  console.log(`[WEBHOOK] POST request received - Webhook ID: ${webhookId}`);
  
  try {
    // Parse do body
    let body;
    try {
      body = await request.json();
      console.log(`[WEBHOOK] Body parsed successfully:`, JSON.stringify(body, null, 2));
    } catch (parseError) {
      console.error(`[WEBHOOK] Error parsing request body:`, parseError);
      return NextResponse.json({ 
        error: 'Invalid JSON body',
        webhook_id: webhookId 
      }, { 
        status: 400,
        headers: { 'Access-Control-Allow-Origin': '*' }
      });
    }
    
    // Headers para debug
    const headers = Object.fromEntries(request.headers.entries());
    console.log(`[WEBHOOK] Headers received:`, {
      'content-type': headers['content-type'],
      'x-signature': headers['x-signature'] ? 'present' : 'absent',
      'x-request-id': headers['x-request-id'] || 'absent',
      'user-agent': headers['user-agent']
    });
    
    // Verificar se é notificação de teste
    const dataId = body.data?.id;
    const isTest = dataId === '123456' || body.live_mode === false;
    
    if (isTest) {
      console.log(`[WEBHOOK] Test notification detected - responding with success`);
      return NextResponse.json({ 
        received: true,
        message: 'Test notification processed successfully',
        test: true,
        webhook_id: webhookId
      }, {
        status: 200,
        headers: { 'Access-Control-Allow-Origin': '*' }
      });
    }
    
    // Processar notificação real
    console.log(`[WEBHOOK] Processing real notification - Type: ${body.type}, ID: ${dataId}`);
    
    if (body.type === 'payment' && dataId) {
      console.log(`[WEBHOOK] Payment notification received for ID: ${dataId}`);
      
      // Buscar dados do pagamento no Mercado Pago
      try {
        const accessToken = process.env.MP_ACCESS_TOKEN;
        if (!accessToken) {
          throw new Error('MP_ACCESS_TOKEN not configured');
        }
        
        const client = new MercadoPagoConfig({ accessToken });
        const paymentApi = new Payment(client);
        
        console.log(`[WEBHOOK] Fetching payment data from Mercado Pago...`);
        const paymentData = await paymentApi.get({ id: dataId });
        
        console.log(`[WEBHOOK] Payment data received:`, {
          id: paymentData.id,
          status: paymentData.status,
          status_detail: paymentData.status_detail,
          payment_method: paymentData.payment_method?.type,
          transaction_amount: paymentData.transaction_amount
        });
        
        // Atualizar banco de dados
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        
        if (supabaseUrl && supabaseAnonKey) {
          const { createClient: createSupabaseClient } = await import('@supabase/supabase-js');
          const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);
          
          // Buscar pagamento no banco
          const { data: existingPayment, error: fetchError } = await supabase
            .from('payments')
            .select('*')
            .eq('payment_id', dataId)
            .single();
          
          if (existingPayment && !fetchError) {
            console.log(`[WEBHOOK] Found existing payment in database:`, existingPayment.id);
            
            // Mapear status
            let paymentStatus = 'pending';
            if (paymentData.status === 'approved') {
              paymentStatus = 'approved';
            } else if (paymentData.status === 'rejected') {
              paymentStatus = 'rejected';
            } else if (paymentData.status === 'cancelled') {
              paymentStatus = 'cancelled';
            }
            
            // Atualizar pagamento
            const updateData: any = {
              status: paymentStatus,
              mercado_pago_data: paymentData,
              updated_at: new Date().toISOString()
            };
            
            if (paymentData.status === 'approved' && !existingPayment.processed_at) {
              updateData.processed_at = new Date().toISOString();
            }
            
            const { error: updateError } = await supabase
              .from('payments')
              .update(updateData)
              .eq('id', existingPayment.id);
            
            if (updateError) {
              console.error(`[WEBHOOK] Error updating payment:`, updateError);
            } else {
              console.log(`[WEBHOOK] Payment updated successfully in database`);
              
              // Se foi aprovado, gerar licença
              if (paymentData.status === 'approved' && !existingPayment.processed_at) {
                console.log(`[WEBHOOK] Generating license for approved payment...`);
                
                // Importar função de geração de licença (simplificada)
                try {
                  // Gerar licença básica
                  const licenseKey = `VOLTRIS-LIC-${Date.now().toString(36).toUpperCase().substring(0, 16)}`;
                  
                  const { data: license, error: licenseError } = await supabase
                    .from('licenses')
                    .insert({
                      license_key: licenseKey,
                      payment_id: existingPayment.id,
                      email: existingPayment.email,
                      license_type: existingPayment.license_type || 'pro',
                      max_devices: 3,
                      expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 ano
                      is_active: true,
                      activated_at: new Date().toISOString(),
                    })
                    .select()
                    .single();
                  
                  if (licenseError) {
                    console.error(`[WEBHOOK] Error creating license:`, licenseError);
                  } else {
                    console.log(`[WEBHOOK] License generated successfully:`, license.id);
                  }
                } catch (licenseError) {
                  console.error(`[WEBHOOK] Error in license generation:`, licenseError);
                }
              }
            }
          }
        }
        
        return NextResponse.json({ 
          received: true,
          processed: true,
          payment_id: dataId,
          payment_status: paymentData.status,
          webhook_id: webhookId,
          message: 'Payment notification processed successfully'
        }, {
          status: 200,
          headers: { 'Access-Control-Allow-Origin': '*' }
        });
        
      } catch (mpError: any) {
        console.error(`[WEBHOOK] Error fetching payment from Mercado Pago:`, mpError.message);
        return NextResponse.json({ 
          received: true,
          error: 'Failed to fetch payment data',
          message: mpError.message,
          webhook_id: webhookId
        }, {
          status: 200, // Mesmo com erro, retornar 200 para o Mercado Pago não reenviar
          headers: { 'Access-Control-Allow-Origin': '*' }
        });
      }
    }
    
    // Notificação de outro tipo
    console.log(`[WEBHOOK] Notification type not processed: ${body.type}`);
    return NextResponse.json({ 
      received: true,
      message: `Notification type '${body.type}' received but not processed`,
      webhook_id: webhookId
    }, {
      status: 200,
      headers: { 'Access-Control-Allow-Origin': '*' }
    });
    
  } catch (error: any) {
    console.error(`[WEBHOOK] Fatal error processing webhook:`, {
      message: error.message,
      stack: error.stack
    });
    
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error.message,
      webhook_id: webhookId
    }, { 
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*' }
    });
  }
}

/**
 * Handler para PUT - fallback adicional
 */
export async function PUT(request: Request) {
  console.log('[WEBHOOK] PUT request received - forwarding to POST handler');
  return POST(request);
}

/**
 * Handler para DELETE - para testes completos
 */
export async function DELETE(request: Request) {
  console.log('[WEBHOOK] DELETE request received - test endpoint');
  return NextResponse.json({ 
    message: 'DELETE method supported for testing',
    timestamp: new Date().toISOString()
  }, {
    status: 200,
    headers: { 'Access-Control-Allow-Origin': '*' }
  });
}