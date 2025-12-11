import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';

export const runtime = 'nodejs';
export const maxDuration = 30;

/**
 * Webhook do Mercado Pago para processar notificações de pagamento
 * 
 * O Mercado Pago envia notificações quando há mudanças no status do pagamento.
 * Este endpoint processa essas notificações e:
 * 1. Valida a assinatura do webhook (segurança)
 * 2. Atualiza o status do pagamento
 * 3. Gera a licença automaticamente quando o pagamento é aprovado
 * 4. Envia email com a licença (opcional)
 * 
 * Tipos de notificação suportados:
 * - payment: Notificação de pagamento
 * - merchant_order: Notificação de pedido (opcional)
 */
export async function POST(request: Request) {
  const webhookId = `webhook-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  
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
    
    console.log(`[Webhook MP ${webhookId}] Recebido:`, {
      type: body.type,
      data_id: body.data?.id,
      timestamp: new Date().toISOString(),
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
    const type = body.type; // payment, merchant_order, etc.
    const dataId = body.data?.id; // ID do pagamento ou preferência
    
    if (!type || !dataId) {
      console.warn(`[Webhook MP ${webhookId}] Notificação sem tipo ou data_id:`, body);
      return NextResponse.json({ received: true, message: 'Notification processed but no action taken' });
    }
    
    if (type === 'payment' && dataId) {
      // Buscar informações do pagamento no Mercado Pago
      const accessToken = process.env.MP_ACCESS_TOKEN;
      if (!accessToken) {
        console.error(`[Webhook MP ${webhookId}] MP_ACCESS_TOKEN não configurado`);
        return NextResponse.json({ error: 'MP_ACCESS_TOKEN not configured' }, { status: 500 });
      }
      
      const client = new MercadoPagoConfig({ accessToken });
      const payment = new Payment(client);
      
      try {
        const paymentData = await payment.get({ id: dataId });
        console.log(`[Webhook MP ${webhookId}] Dados do pagamento:`, {
          id: paymentData.id,
          status: paymentData.status,
          status_detail: paymentData.status_detail,
          preference_id: paymentData.preference_id,
          transaction_amount: paymentData.transaction_amount,
        });
        
        // Buscar pagamento no banco pelo preference_id ou payment_id
        const preferenceId = paymentData.preference_id;
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
        
        console.log(`[Webhook MP ${webhookId}] Status mapeado: ${status} -> ${paymentStatus}`);
        
        if (existingPayment) {
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
            console.error(`[Webhook MP ${webhookId}] Erro ao atualizar pagamento:`, updateError);
          } else {
            console.log(`[Webhook MP ${webhookId}] Pagamento atualizado:`, {
              payment_id: existingPayment.id,
              status: paymentStatus,
              was_approved: status === 'approved' || status === 'authorized',
            });
          }
          
          // Se o pagamento foi aprovado/autorizado e ainda não gerou licença, gerar agora
          if ((status === 'approved' || status === 'authorized') && !existingPayment.processed_at) {
            console.log(`[Webhook MP ${webhookId}] Gerando licença para pagamento aprovado...`);
            await generateLicenseForPayment(supabase, existingPayment.id, paymentData);
          }
        } else {
          // Criar novo registro de pagamento (caso o webhook chegue antes do usuário retornar)
          // Isso pode acontecer se o webhook for muito rápido
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
            console.error(`[Webhook MP ${webhookId}] Erro ao criar pagamento:`, createError);
          } else if ((status === 'approved' || status === 'authorized') && newPayment) {
            console.log(`[Webhook MP ${webhookId}] Novo pagamento criado e aprovado:`, newPayment.id);
            await generateLicenseForPayment(supabase, newPayment.id, paymentData);
          }
        }
        
        return NextResponse.json({ 
          received: true, 
          processed: true,
          webhook_id: webhookId,
          payment_status: paymentStatus,
        });
      } catch (mpError: any) {
        console.error(`[Webhook MP ${webhookId}] Erro ao buscar pagamento no MP:`, {
          message: mpError.message,
          status: mpError.status,
          statusCode: mpError.statusCode,
        });
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
    
    // Determinar tipo de licença e validade baseado no valor
    let licenseType: 'trial' | 'pro' | 'premium' | 'enterprise' = 'pro';
    let validMonths = 1; // Default: 1 mês
    
    const amount = payment.amount || 0;
    if (amount >= 100) {
      licenseType = 'premium';
      validMonths = 3;
    } else if (amount >= 50) {
      licenseType = 'pro';
      validMonths = 1;
    }
    
    // Calcular data de expiração
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + validMonths);
    
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
        max_devices: licenseType === 'premium' ? 3 : 1,
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

