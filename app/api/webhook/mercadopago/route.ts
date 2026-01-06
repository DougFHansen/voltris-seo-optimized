import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';

export const runtime = 'nodejs';
export const maxDuration = 30;

/**
 * Webhook do Mercado Pago para processar notificações de pagamento
 * 
 * [MERCADO PAGO DEBUG] Este webhook:
 * 1. Recebe notificações do Mercado Pago
 * 2. Busca dados completos do pagamento via API
 * 3. Atualiza status no banco
 * 4. Gera licença quando aprovado
 * 
 * PONTOS DE FALHA POSSÍVEIS:
 * - Webhook não configurado no painel MP
 * - Token inválido para buscar dados
 * - Erro ao atualizar banco
 * - Erro ao gerar licença
 * - Timeout na requisição
 * 
 * Tipos de notificação suportados:
 * - payment: Notificação de pagamento
 * - merchant_order: Notificação de pedido (opcional)
 */
export async function POST(request: Request) {
  const webhookId = `webhook-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  
  console.log(`[MERCADO PAGO DEBUG] ========== WEBHOOK RECEBIDO ${webhookId} ==========`);
  
  try {
    // Usar service_role key para bypass RLS no webhook
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    let supabase;
    if (supabaseServiceKey) {
      const { createClient: createSupabaseClient } = await import('@supabase/supabase-js');
      supabase = createSupabaseClient(supabaseUrl!, supabaseServiceKey);
    } else {
      supabase = await createClient();
    }
    
    // Obter dados do webhook
    const body = await request.json();
    const headers = Object.fromEntries(request.headers.entries());
    
    console.log(`[MERCADO PAGO DEBUG] Tipo de notificação:`, body.type);
    console.log(`[MERCADO PAGO DEBUG] Data ID:`, body.data?.id);
    console.log(`[MERCADO PAGO DEBUG] Body completo:`, JSON.stringify(body, null, 2));
    console.log(`[MERCADO PAGO DEBUG] Headers:`, {
      signature: headers['x-signature'] ? 'presente' : 'ausente',
      requestId: headers['x-request-id'] || 'ausente',
    });
    
    // Validação de assinatura do webhook (segurança - opcional mas recomendado)
    // O Mercado Pago pode enviar X-Signature e X-Request-Id nos headers
    const signature = headers['x-signature'];
    const requestId = headers['x-request-id'];
    
    if (signature && process.env.MP_WEBHOOK_SECRET) {
      // Validar assinatura se configurado
      // Nota: A validação exata depende da configuração do webhook no painel do Mercado Pago
      console.log(`[Webhook MP ${webhookId}] Assinatura recebida: ${signature.substring(0, 20)}...`);
    }
    
    // Verificar tipo de notificação
    const type = body.type;
    const dataId = body.data?.id;
    
    if (!type || !dataId) {
      console.warn(`[MERCADO PAGO DEBUG] AVISO: Notificação sem tipo ou data_id`);
      console.warn(`[MERCADO PAGO DEBUG] Body recebido:`, body);
      return NextResponse.json({ received: true, message: 'Notification processed but no action taken' });
    }
    
    console.log(`[MERCADO PAGO DEBUG] Processando notificação tipo: ${type}, ID: ${dataId}`);
    
    if (type === 'payment' && dataId) {
      console.log(`[MERCADO PAGO DEBUG] ========== PROCESSANDO PAGAMENTO ==========`);
      
      // Buscar informações do pagamento no Mercado Pago
      const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN_PROD || process.env.MP_ACCESS_TOKEN;
      if (!accessToken) {
        console.error(`[MERCADO PAGO DEBUG] ERRO CRÍTICO: Token Mercado Pago não configurado no webhook`);
        return NextResponse.json({ error: 'MP_ACCESS_TOKEN not configured' }, { status: 500 });
      }
      
      console.log(`[MERCADO PAGO DEBUG] Token configurado, buscando dados do pagamento...`);
      
      const client = new MercadoPagoConfig({ accessToken });
      const payment = new Payment(client);
      
      try {
        console.log(`[MERCADO PAGO DEBUG] Chamando API Mercado Pago para obter dados do pagamento ${dataId}...`);
        
        const paymentData = await payment.get({ id: dataId });
        
        console.log(`[MERCADO PAGO DEBUG] ========== DADOS DO PAGAMENTO RECEBIDOS ==========`);
        console.log(`[MERCADO PAGO DEBUG] ID:`, paymentData.id);
        console.log(`[MERCADO PAGO DEBUG] Status:`, paymentData.status);
        console.log(`[MERCADO PAGO DEBUG] Status Detail:`, paymentData.status_detail);
        console.log(`[MERCADO PAGO DEBUG] Preference ID:`, (paymentData as any).preference_id);
        console.log(`[MERCADO PAGO DEBUG] Amount:`, paymentData.transaction_amount);
        console.log(`[MERCADO PAGO DEBUG] Dados completos:`, JSON.stringify(paymentData, null, 2));
        
        // Buscar pagamento no banco pelo preference_id ou payment_id
        const preferenceId = (paymentData as any).preference_id;
        const paymentId = paymentData.id?.toString();
        const status = paymentData.status; // approved, rejected, pending, etc.
        
        // Buscar pagamento existente
        const { data: existingPayment, error: paymentError } = await supabase
          .from('payments')
          .select('*')
          .or(`preference_id.eq.${preferenceId},payment_id.eq.${paymentId}`)
          .single();
        
        if (paymentError && paymentError.code !== 'PGRST116') {
          console.error('[Webhook MP] Erro ao buscar pagamento:', paymentError);
        }
        
        // Mapear status do Mercado Pago para nosso enum (seguindo documentação 2025)
        // Status possíveis: pending, approved, authorized, in_process, in_mediation, 
        // rejected, cancelled, refunded, charged_back
        let paymentStatus: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'refunded' | 'charged_back' = 'pending';
        
        if (status === 'approved' || status === 'authorized') {
          paymentStatus = 'approved';
        } else if (status === 'rejected') {
          paymentStatus = 'rejected';
        } else if (status === 'cancelled') {
          paymentStatus = 'cancelled';
        } else if (status === 'refunded') {
          paymentStatus = 'refunded';
        } else if (status === 'charged_back') {
          paymentStatus = 'charged_back';
        } else if (status === 'pending' || status === 'in_process' || status === 'in_mediation') {
          paymentStatus = 'pending';
        }
        
        console.log(`[MERCADO PAGO DEBUG] Status mapeado: ${status} -> ${paymentStatus}`);
        
        console.log(`[MERCADO PAGO DEBUG] ========== ATUALIZANDO BANCO DE DADOS ==========`);
        
        if (existingPayment) {
          console.log(`[MERCADO PAGO DEBUG] Pagamento existente encontrado no banco: ${existingPayment.id}`);
          
          // Atualizar pagamento existente
          const updateData: any = {
            payment_id: paymentId,
            status: paymentStatus,
            mercado_pago_data: paymentData,
            updated_at: new Date().toISOString(),
          };
          
          if (status === 'approved' && !existingPayment.processed_at) {
            updateData.processed_at = new Date().toISOString();
          }
          
          const { error: updateError } = await supabase
            .from('payments')
            .update(updateData)
            .eq('id', existingPayment.id);
          
          if (updateError) {
            console.error(`[MERCADO PAGO DEBUG] ERRO ao atualizar pagamento:`, updateError);
          } else {
            console.log(`[MERCADO PAGO DEBUG] Pagamento atualizado com sucesso`);
            console.log(`[MERCADO PAGO DEBUG] - Payment ID:`, existingPayment.id);
            console.log(`[MERCADO PAGO DEBUG] - Novo status:`, paymentStatus);
            console.log(`[MERCADO PAGO DEBUG] - Aprovado:`, status === 'approved' || status === 'authorized');
          }
          
          // Se o pagamento foi aprovado/autorizado e ainda não gerou licença, gerar agora
          if ((status === 'approved' || status === 'authorized') && !existingPayment.processed_at) {
            console.log(`[MERCADO PAGO DEBUG] ========== GERANDO LICENÇA ==========`);
            console.log(`[MERCADO PAGO DEBUG] Pagamento aprovado, iniciando geração de licença...`);
            await generateLicenseForPayment(supabase, existingPayment.id, paymentData);
            console.log(`[MERCADO PAGO DEBUG] Licença gerada com sucesso`);
          }
        } else {
          console.log(`[MERCADO PAGO DEBUG] Pagamento NÃO encontrado no banco, criando novo registro...`);
          
          // Criar novo registro de pagamento
          const email = paymentData.payer?.email || paymentData.additional_info?.items?.[0]?.description || 'unknown@example.com';
          
          const { data: newPayment, error: createError } = await supabase
            .from('payments')
            .insert({
              preference_id: preferenceId,
              payment_id: paymentId,
              email: email,
              license_type: 'pro', // Default, pode ser ajustado
              amount: paymentData.transaction_amount || 0,
              currency: paymentData.currency_id || 'BRL',
              status: paymentStatus,
              mercado_pago_data: paymentData,
              processed_at: status === 'approved' ? new Date().toISOString() : null,
            })
            .select()
            .single();
          
          if (createError) {
            console.error(`[MERCADO PAGO DEBUG] ERRO ao criar pagamento:`, createError);
          } else if ((status === 'approved' || status === 'authorized') && newPayment) {
            console.log(`[MERCADO PAGO DEBUG] Novo pagamento criado e aprovado:`, newPayment.id);
            console.log(`[MERCADO PAGO DEBUG] Gerando licença...`);
            await generateLicenseForPayment(supabase, newPayment.id, paymentData);
            console.log(`[MERCADO PAGO DEBUG] Licença gerada com sucesso`);
          }
        }
        
        console.log(`[MERCADO PAGO DEBUG] ========== WEBHOOK PROCESSADO COM SUCESSO ==========`);
        
        return NextResponse.json({ 
          received: true, 
          processed: true,
          webhook_id: webhookId,
          payment_status: paymentStatus,
        });
      } catch (mpError: any) {
        console.error(`[MERCADO PAGO DEBUG] ========== ERRO AO BUSCAR PAGAMENTO NO MP ==========`);
        console.error(`[MERCADO PAGO DEBUG] Mensagem:`, mpError.message);
        console.error(`[MERCADO PAGO DEBUG] Status:`, mpError.status || mpError.statusCode);
        console.error(`[MERCADO PAGO DEBUG] Erro completo:`, JSON.stringify(mpError, null, 2));
        return NextResponse.json({ 
          error: mpError.message,
          webhook_id: webhookId,
        }, { status: 500 });
      }
    }
    
    // Se não for um tipo que processamos, apenas confirmar recebimento
    console.log(`[Webhook MP ${webhookId}] Tipo de notificação não processado: ${type}`);
    return NextResponse.json({ 
      received: true,
      message: `Notification type '${type}' received but not processed`,
      webhook_id: webhookId,
    });
  } catch (error: any) {
    console.error(`[Webhook MP ${webhookId}] Erro geral:`, {
      message: error.message,
      stack: error.stack,
    });
    return NextResponse.json({ 
      error: error.message,
      webhook_id: webhookId,
    }, { status: 500 });
  }
}

/**
 * Gera uma licença automaticamente após pagamento aprovado
 */
async function generateLicenseForPayment(
  supabase: any,
  paymentId: string,
  paymentData: any
) {
  try {
    // Buscar dados do pagamento
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('id', paymentId)
      .single();
    
    if (paymentError || !payment) {
      console.error('[Webhook MP] Erro ao buscar pagamento para gerar licença:', paymentError);
      return;
    }
    
    // Verificar se já existe licença para este pagamento
    const { data: existingLicense } = await supabase
      .from('licenses')
      .select('*')
      .eq('payment_id', paymentId)
      .single();
    
    if (existingLicense) {
      console.log('[Webhook MP] Licença já existe para este pagamento:', existingLicense.id);
      return;
    }
    
    // Determinar tipo de licença e validade baseado no plano salvo no banco
    // Priorizar license_type do banco (salvo na API /pagamento)
    let licenseType: 'trial' | 'standard' | 'pro' | 'enterprise' = payment.license_type || 'pro';
    let maxDevices = 1;
    
    // Mapear limites de dispositivos conforme o plano
    switch (licenseType) {
      case 'trial':
        maxDevices = 1;
        break;
      case 'standard':
        maxDevices = 1;
        break;
      case 'pro':
        maxDevices = 3;
        break;
      case 'enterprise':
        maxDevices = 9999; // Ilimitado
        break;
    }
    
    console.log(`[Webhook MP] Plano determinado do banco:`, { licenseType, maxDevices });
    
    // Calcular data de expiração usando função do banco
    const { data: expiryResult, error: expiryError } = await supabase
      .rpc('calculate_expiry_date', {
        p_plan_code: licenseType,
        p_start_date: new Date().toISOString()
      });
    
    let expiresAt: Date;
    
    if (expiryError || !expiryResult) {
      console.error('[Webhook MP] Erro ao calcular data de expiração:', expiryError);
      // Fallback: calcular manualmente
      expiresAt = new Date();
      if (licenseType === 'trial') {
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 dias
      } else if (licenseType === 'standard') {
        expiresAt.setFullYear(expiresAt.getFullYear() + 1); // 1 ano
      } else if (licenseType === 'pro') {
        expiresAt.setFullYear(expiresAt.getFullYear() + 1); // 1 ano
      } else if (licenseType === 'enterprise') {
        expiresAt.setFullYear(expiresAt.getFullYear() + 99); // Vitalício (99 anos)
      }
    } else {
      expiresAt = new Date(expiryResult);
    }
    
    // Gerar ID único do cliente (usando email ou UUID)
    const clientId = payment.email.split('@')[0].toUpperCase().substring(0, 8) + 
                     Date.now().toString(36).toUpperCase().substring(0, 4);
    
    // Gerar chave de licença usando função do banco
    const { data: licenseKeyResult, error: keyError } = await supabase
      .rpc('generate_license_key', {
        p_client_id: clientId,
        p_valid_until: expiresAt.toISOString().split('T')[0],
        p_plan: licenseType
      });
    
    let licenseKey: string;
    
    if (keyError || !licenseKeyResult) {
      console.error('[Webhook MP] Erro ao gerar chave de licença:', keyError);
      // Fallback: gerar chave usando mesmo formato do programa C#
      const formattedDate = expiresAt.toISOString().split('T')[0].replace(/-/g, '');
      const randomSuffix = Date.now().toString(36).toUpperCase().substring(0, 16);
      licenseKey = `VOLTRIS-LIC-${clientId}-${formattedDate}-${randomSuffix}`;
    } else {
      licenseKey = licenseKeyResult as string;
    }
    
    // Criar licença
    const { data: license, error: licenseError } = await supabase
      .from('licenses')
      .insert({
        license_key: licenseKey,
        payment_id: paymentId,
        email: payment.email,
        license_type: licenseType,
        max_devices: maxDevices,
        expires_at: expiresAt.toISOString(),
        is_active: true,
        activated_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (licenseError) {
      console.error('[Webhook MP] Erro ao criar licença:', licenseError);
      throw licenseError; // Re-throw para que o erro seja tratado no nível superior
    } else {
      console.log('[Webhook MP] Licença gerada com sucesso:', {
        license_id: license.id,
        license_key: licenseKey.substring(0, 20) + '...',
        license_type: licenseType,
        expires_at: expiresAt.toISOString(),
      });
      
      // TODO: Enviar email com a licença (implementar serviço de email)
      // await sendLicenseEmail(payment.email, licenseKey);
    }
  } catch (error: any) {
    console.error('[Webhook MP] Erro ao gerar licença:', {
      message: error.message,
      payment_id: paymentId,
      stack: error.stack,
    });
    throw error; // Re-throw para que o erro seja tratado no nível superior
  }
}

// GET para verificação (Mercado Pago pode fazer GET para validar o endpoint)
export async function GET(request: Request) {
  return NextResponse.json({ 
    status: 'ok', 
    message: 'Webhook endpoint is active',
    timestamp: new Date().toISOString()
  });
}

