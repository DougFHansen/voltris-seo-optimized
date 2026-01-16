import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';

export const runtime = 'nodejs';
export const maxDuration = 30;

// Constantes para configuração
const WEBHOOK_TIMEOUT = 25000; // 25 segundos
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY_BASE = 1000; // 1 segundo

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
 * Implementação profissional com retry mechanism e tratamento robusto de erros
 */
export async function POST(request: Request) {
  const webhookId = `webhook-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  const startTime = Date.now();
  
  console.log(`[WEBHOOK] ========== INICIANDO PROCESSAMENTO ${webhookId} ==========`);

  try {
    // Validar content-type
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error(`[WEBHOOK] Invalid content-type: ${contentType}`);
      return NextResponse.json({ 
        error: 'Content-Type must be application/json',
        webhook_id: webhookId 
      }, { 
        status: 400,
        headers: { 'Access-Control-Allow-Origin': '*' }
      });
    }
    
    // Parse do body com timeout
    let body: any;
    try {
      const buffer = await request.arrayBuffer();
      const text = new TextDecoder().decode(buffer);
      body = JSON.parse(text);
      
      console.log(`[WEBHOOK] Body parsed successfully (${text.length} chars)`);
      console.log(`[WEBHOOK] Notification details:`, {
        type: body.type,
        data_id: body.data?.id,
        live_mode: body.live_mode,
        action: body.action
      });
    } catch (parseError: any) {
      console.error(`[WEBHOOK] Error parsing request body:`, parseError.message);
      return NextResponse.json({ 
        error: 'Invalid JSON body',
        webhook_id: webhookId 
      }, { 
        status: 400,
        headers: { 'Access-Control-Allow-Origin': '*' }
      });
    }

    // Validar dados obrigatórios
    if (!body.type || !body.data?.id) {
      console.error(`[WEBHOOK] Missing required fields: type=${body.type}, data.id=${body.data?.id}`);
      return NextResponse.json({ 
        error: 'Missing required fields: type and data.id are mandatory',
        webhook_id: webhookId 
      }, { 
        status: 400,
        headers: { 'Access-Control-Allow-Origin': '*' }
      });
    }

    // Verificar se é notificação de teste
    const dataId = body.data.id;
    const isTest = dataId === '123456' || body.live_mode === false;
    
    if (isTest) {
      console.log(`[WEBHOOK] Test notification detected - responding with success`);
      return NextResponse.json({ 
        received: true,
        message: 'Test notification processed successfully',
        test: true,
        webhook_id: webhookId,
        processed_at: new Date().toISOString()
      }, {
        status: 200,
        headers: { 'Access-Control-Allow-Origin': '*' }
      });
    }
    
    // Processar notificação real
    console.log(`[WEBHOOK] Processing real notification - Type: ${body.type}, ID: ${dataId}`);
    
    if (body.type === 'payment' && dataId) {
      console.log(`[WEBHOOK] Payment notification received for ID: ${dataId}`);
      
      // Buscar dados do pagamento no Mercado Pago com retry mechanism
      let paymentData: any = null;
      let retryCount = 0;
      
      while (retryCount < MAX_RETRY_ATTEMPTS && !paymentData) {
        try {
          const accessToken = process.env.MP_ACCESS_TOKEN;
          if (!accessToken) {
            throw new Error('MP_ACCESS_TOKEN not configured');
          }
          
          const client = new MercadoPagoConfig({ accessToken });
          const paymentApi = new Payment(client);
          
          console.log(`[WEBHOOK] Attempt ${retryCount + 1}/${MAX_RETRY_ATTEMPTS}: Fetching payment data from Mercado Pago...`);
          paymentData = await paymentApi.get({ id: dataId });
          
          console.log(`[WEBHOOK] Payment data fetched successfully on attempt ${retryCount + 1}`);
          
        } catch (mpError: any) {
          retryCount++;
          console.error(`[WEBHOOK] Attempt ${retryCount} failed:`, mpError.message);
          
          if (retryCount < MAX_RETRY_ATTEMPTS) {
            const delay = RETRY_DELAY_BASE * Math.pow(2, retryCount - 1); // Exponential backoff
            console.log(`[WEBHOOK] Waiting ${delay}ms before retry...`);
            await new Promise(resolve => setTimeout(resolve, delay));
          } else {
            console.error(`[WEBHOOK] All retry attempts failed`);
            throw mpError;
          }
        }
      }
      
      if (!paymentData) {
        throw new Error('Failed to fetch payment data after all retries');
      }
      
      console.log(`[WEBHOOK] Payment data received:`, {
        id: paymentData.id,
        status: paymentData.status,
        status_detail: paymentData.status_detail,
        payment_method: paymentData.payment_method?.type,
        transaction_amount: paymentData.transaction_amount,
        email: paymentData.payer?.email
      });

      // Atualizar banco de dados com tratamento de erros profissional
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (supabaseUrl && supabaseAnonKey) {
        const { createClient: createSupabaseClient } = await import('@supabase/supabase-js');
        const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);
        
        // Buscar pagamento no banco
        console.log(`[WEBHOOK] Searching for payment record in database...`);
        const { data: existingPayment, error: fetchError } = await supabase
          .from('payments')
          .select('*')
          .eq('payment_id', dataId)
          .single();
        
        if (fetchError) {
          console.error(`[WEBHOOK] Database fetch error:`, fetchError);
        }
        
        if (!existingPayment) {
          console.warn(`[WEBHOOK] Payment record not found in database for payment_id: ${dataId}`);
          console.log(`[WEBHOOK] Creating new payment record...`);
          
          // Criar registro de pagamento se não existir
          const { data: newPayment, error: createError } = await supabase
            .from('payments')
            .insert({
              payment_id: dataId,
              preference_id: (paymentData as any).preference_id,
              email: paymentData.payer?.email || 'unknown@example.com',
              license_type: 'pro',
              amount: paymentData.transaction_amount,
              currency: 'BRL',
              status: paymentData.status,
              mercado_pago_data: paymentData,
              processed_at: paymentData.status === 'approved' ? new Date().toISOString() : null,
            })
            .select()
            .single();
          
          if (createError) {
            console.error(`[WEBHOOK] Error creating payment record:`, createError);
          } else {
            console.log(`[WEBHOOK] New payment record created:`, newPayment.id);
            
            // Se foi aprovado, gerar licença imediatamente
            if (paymentData.status === 'approved') {
              await generateLicense(supabase, newPayment, paymentData, webhookId);
            }
          }
        } else {
          console.log(`[WEBHOOK] Found existing payment in database:`, existingPayment.id);
          
          // Mapear status de forma mais precisa
          let paymentStatus = 'pending';
          switch (paymentData.status) {
            case 'approved':
            case 'authorized':
              paymentStatus = 'approved';
              break;
            case 'rejected':
              paymentStatus = 'rejected';
              break;
            case 'cancelled':
              paymentStatus = 'cancelled';
              break;
            case 'refunded':
              paymentStatus = 'refunded';
              break;
            case 'charged_back':
              paymentStatus = 'charged_back';
              break;
            default:
              paymentStatus = 'pending';
          }
          
          // Atualizar pagamento
          const updateData: any = {
            status: paymentStatus,
            mercado_pago_data: paymentData,
            updated_at: new Date().toISOString()
          };
          
          // Marcar como processado apenas se for a primeira vez
          const shouldMarkProcessed = paymentData.status === 'approved' && !existingPayment.processed_at;
          if (shouldMarkProcessed) {
            updateData.processed_at = new Date().toISOString();
          }
          
          console.log(`[WEBHOOK] Updating payment record with status: ${paymentStatus}`);
          const { error: updateError } = await supabase
            .from('payments')
            .update(updateData)
            .eq('id', existingPayment.id);
          
          if (updateError) {
            console.error(`[WEBHOOK] Error updating payment:`, updateError);
          } else {
            console.log(`[WEBHOOK] Payment updated successfully in database`);
            
            // Se foi aprovado e ainda não processado, gerar licença
            if (shouldMarkProcessed) {
              console.log(`[WEBHOOK] Payment approved for first time - generating license...`);
              await generateLicense(supabase, existingPayment, paymentData, webhookId);
            }
          }
        }
      }
      
      const processingTime = Date.now() - startTime;
      
      return NextResponse.json({ 
        received: true,
        processed: true,
        payment_id: dataId,
        payment_status: paymentData.status,
        webhook_id: webhookId,
        processing_time_ms: processingTime,
        message: 'Payment notification processed successfully',
        processed_at: new Date().toISOString()
      }, {
        status: 200,
        headers: { 'Access-Control-Allow-Origin': '*' }
      });
    }
    
    // Notificação de outro tipo
    console.log(`[WEBHOOK] Notification type not processed: ${body.type}`);
    return NextResponse.json({ 
      received: true,
      message: `Notification type '${body.type}' received but not processed`,
      webhook_id: webhookId,
      processed_at: new Date().toISOString()
    }, {
      status: 200,
      headers: { 'Access-Control-Allow-Origin': '*' }
    });
    
  } catch (processingError: any) {
    const processingTime = Date.now() - startTime;
    console.error(`[WEBHOOK] Fatal error processing payment notification:`, {
      message: processingError.message,
      stack: processingError.stack,
      processing_time_ms: processingTime
    });
    
    // Mesmo com erro grave, retornar 200 para o Mercado Pago não reenviar continuamente
    return NextResponse.json({ 
      received: true,
      processed: false,
      error: 'Processing failed',
      message: processingError.message,
      webhook_id: webhookId,
      processing_time_ms: processingTime,
      processed_at: new Date().toISOString()
    }, {
      status: 200,
      headers: { 'Access-Control-Allow-Origin': '*' }
    });
    
  } catch (error: any) {
    const processingTime = Date.now() - startTime;
    console.error(`[WEBHOOK] Fatal error processing webhook:`, {
      message: error.message,
      stack: error.stack,
      processing_time_ms: processingTime
    });
    
    // Mesmo para erros fatais, retornar 200 para evitar reenvios infinitos
    return NextResponse.json({ 
      received: true,
      processed: false,
      error: 'Internal server error',
      message: error.message,
      webhook_id: webhookId,
      processing_time_ms: processingTime,
      processed_at: new Date().toISOString()
    }, { 
      status: 200,
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

/**
 * Função auxiliar para gerar licenças de forma robusta
 */
async function generateLicense(
  supabase: any,
  payment: any,
  paymentData: any,
  webhookId: string
): Promise<void> {
  try {
    console.log(`[WEBHOOK] Generating license for payment ${payment.id}...`);
    
    // Determinar tipo de licença baseado no valor pago
    let licenseType = 'pro';
    let maxDevices = 3;
    let expiresInYears = 1;
    
    // Lógica de determinação de plano baseada no valor
    if (paymentData.transaction_amount >= 149) {
      licenseType = 'enterprise';
      maxDevices = 9999;
      expiresInYears = 100;
    } else if (paymentData.transaction_amount >= 59) {
      licenseType = 'pro';
      maxDevices = 3;
      expiresInYears = 1;
    } else if (paymentData.transaction_amount >= 29) {
      licenseType = 'standard';
      maxDevices = 1;
      expiresInYears = 1;
    } else if (paymentData.transaction_amount < 10) {
      licenseType = 'trial';
      maxDevices = 1;
      expiresInYears = 0.02; // ~1 semana
    }
    
    // Gerar chave de licença única
    const licenseKey = `VOLTRIS-LIC-${Date.now().toString(36).toUpperCase().substring(0, 16)}`;
    
    // Calcular data de expiração
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + expiresInYears);
    
    // Criar licença no banco
    const { data: license, error: licenseError } = await supabase
      .from('licenses')
      .insert({
        license_key: licenseKey,
        payment_id: payment.id,
        email: payment.email,
        license_type: licenseType,
        max_devices: maxDevices,
        devices_in_use: 0,
        expires_at: expiresAt.toISOString(),
        is_active: true,
        activated_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (licenseError) {
      console.error(`[WEBHOOK] Error creating license:`, licenseError);
      throw new Error(`License creation failed: ${licenseError.message}`);
    }
    
    console.log(`[WEBHOOK] ✅ License generated successfully:`, {
      license_id: license.id,
      license_key: licenseKey,
      license_type: licenseType,
      max_devices: maxDevices,
      expires_at: expiresAt.toISOString()
    });
    
  } catch (licenseError: any) {
    console.error(`[WEBHOOK] Fatal error in license generation:`, licenseError);
    throw licenseError;
  }
}