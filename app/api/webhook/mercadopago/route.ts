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
 * 1. Atualiza o status do pagamento
 * 2. Gera a licença automaticamente quando o pagamento é aprovado
 * 3. Envia email com a licença (opcional)
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // Obter dados do webhook
    const body = await request.json();
    console.log('[Webhook MP] Recebido:', JSON.stringify(body, null, 2));
    
    // Verificar tipo de notificação
    const type = body.type; // payment, merchant_order, etc.
    const dataId = body.data?.id; // ID do pagamento ou preferência
    
    if (type === 'payment' && dataId) {
      // Buscar informações do pagamento no Mercado Pago
      const accessToken = process.env.MP_ACCESS_TOKEN;
      if (!accessToken) {
        console.error('[Webhook MP] MP_ACCESS_TOKEN não configurado');
        return NextResponse.json({ error: 'MP_ACCESS_TOKEN not configured' }, { status: 500 });
      }
      
      const client = new MercadoPagoConfig({ accessToken });
      const payment = new Payment(client);
      
      try {
        const paymentData = await payment.get({ id: dataId });
        console.log('[Webhook MP] Dados do pagamento:', JSON.stringify(paymentData, null, 2));
        
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
        
        // Mapear status do Mercado Pago para nosso enum
        let paymentStatus: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'refunded' | 'charged_back' = 'pending';
        if (status === 'approved') paymentStatus = 'approved';
        else if (status === 'rejected') paymentStatus = 'rejected';
        else if (status === 'cancelled') paymentStatus = 'cancelled';
        else if (status === 'refunded') paymentStatus = 'refunded';
        else if (status === 'charged_back') paymentStatus = 'charged_back';
        
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
            console.error('[Webhook MP] Erro ao atualizar pagamento:', updateError);
          } else {
            console.log('[Webhook MP] Pagamento atualizado:', existingPayment.id);
          }
          
          // Se o pagamento foi aprovado e ainda não gerou licença, gerar agora
          if (status === 'approved' && !existingPayment.processed_at) {
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
            console.error('[Webhook MP] Erro ao criar pagamento:', createError);
          } else if (status === 'approved' && newPayment) {
            console.log('[Webhook MP] Novo pagamento criado e aprovado:', newPayment.id);
            await generateLicenseForPayment(supabase, newPayment.id, paymentData);
          }
        }
        
        return NextResponse.json({ received: true, processed: true });
      } catch (mpError: any) {
        console.error('[Webhook MP] Erro ao buscar pagamento no MP:', mpError);
        return NextResponse.json({ error: mpError.message }, { status: 500 });
      }
    }
    
    // Se não for um tipo que processamos, apenas confirmar recebimento
    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('[Webhook MP] Erro geral:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
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
    } else {
      console.log('[Webhook MP] Licença gerada com sucesso:', license.id, licenseKey);
      
      // TODO: Enviar email com a licença (implementar serviço de email)
      // await sendLicenseEmail(payment.email, licenseKey);
    }
  } catch (error: any) {
    console.error('[Webhook MP] Erro ao gerar licença:', error);
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

