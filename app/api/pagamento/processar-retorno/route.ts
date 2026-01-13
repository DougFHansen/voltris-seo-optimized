import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';

export const runtime = 'nodejs';
export const maxDuration = 30;

/**
 * API para processar retorno do Mercado Pago SINCRONAMENTE
 * 
 * Esta API é chamada quando o cliente volta do Mercado Pago para /sucesso
 * Ela busca o pagamento diretamente na API do Mercado Pago e processa imediatamente
 * Não espera o webhook!
 */
export async function POST(request: Request) {
  const requestId = `retorno-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  
  console.log(`[RETORNO MP ${requestId}] ========== PROCESSANDO RETORNO ==========`);
  
  try {
    const body = await request.json();
    const { payment_id, collection_id, preference_id, status } = body;
    
    console.log(`[RETORNO MP ${requestId}] Parâmetros recebidos:`, {
      payment_id,
      collection_id,
      preference_id,
      status,
    });
    
    const actualPaymentId = payment_id || collection_id;
    
    if (!actualPaymentId) {
      console.error(`[RETORNO MP ${requestId}] payment_id ou collection_id ausente`);
      return NextResponse.json(
        { error: 'payment_id ou collection_id é obrigatório' },
        { status: 400 }
      );
    }
    
    // Buscar pagamento no Mercado Pago
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN_PROD || process.env.MP_ACCESS_TOKEN;
    if (!accessToken) {
      console.error(`[RETORNO MP ${requestId}] Token Mercado Pago não configurado`);
      return NextResponse.json(
        { error: 'Configuração inválida do servidor' },
        { status: 500 }
      );
    }
    
    console.log(`[RETORNO MP ${requestId}] Buscando pagamento ${actualPaymentId} no Mercado Pago...`);
    
    const client = new MercadoPagoConfig({ accessToken });
    const paymentAPI = new Payment(client);
    
    const paymentData = await paymentAPI.get({ id: actualPaymentId });
    
    console.log(`[RETORNO MP ${requestId}] Pagamento encontrado:`, {
      id: paymentData.id,
      status: paymentData.status,
      preference_id: (paymentData as any).preference_id,
      amount: paymentData.transaction_amount,
    });
    
    // Conectar ao Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    let supabase;
    if (supabaseServiceKey) {
      const { createClient: createSupabaseClient } = await import('@supabase/supabase-js');
      supabase = createSupabaseClient(supabaseUrl!, supabaseServiceKey);
    } else {
      const { createClient } = await import('@/utils/supabase/server');
      supabase = await createClient();
    }
    
    const mpPreferenceId = (paymentData as any).preference_id;
    const mpPaymentId = paymentData.id?.toString();
    const mpStatus = paymentData.status;
    
    // Buscar ou criar pagamento no banco
    let { data: existingPayment } = await supabase
      .from('payments')
      .select('*')
      .or(`preference_id.eq.${mpPreferenceId},payment_id.eq.${mpPaymentId}`)
      .single();
    
    console.log(`[RETORNO MP ${requestId}] Pagamento no banco:`, existingPayment ? 'Encontrado' : 'Não encontrado');
    
    // Mapear status
    let paymentStatus: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'refunded' | 'charged_back' = 'pending';
    
    if (mpStatus === 'approved' || mpStatus === 'authorized') {
      paymentStatus = 'approved';
    } else if (mpStatus === 'rejected') {
      paymentStatus = 'rejected';
    } else if (mpStatus === 'cancelled') {
      paymentStatus = 'cancelled';
    } else if (mpStatus === 'refunded') {
      paymentStatus = 'refunded';
    } else if (mpStatus === 'charged_back') {
      paymentStatus = 'charged_back';
    }
    
    let dbPayment = existingPayment;
    
    if (!existingPayment) {
      // Criar pagamento no banco
      console.log(`[RETORNO MP ${requestId}] Criando pagamento no banco...`);
      
      const email = paymentData.payer?.email || 'unknown@example.com';
      
      const { data: newPayment, error: createError } = await supabase
        .from('payments')
        .insert({
          preference_id: mpPreferenceId,
          payment_id: mpPaymentId,
          email: email,
          license_type: 'pro', // Default, será ajustado
          amount: paymentData.transaction_amount || 0,
          currency: paymentData.currency_id || 'BRL',
          status: paymentStatus,
          mercado_pago_data: paymentData,
          processed_at: paymentStatus === 'approved' ? new Date().toISOString() : null,
        })
        .select()
        .single();
      
      if (createError) {
        console.error(`[RETORNO MP ${requestId}] Erro ao criar pagamento:`, createError);
        throw createError;
      }
      
      dbPayment = newPayment;
      console.log(`[RETORNO MP ${requestId}] Pagamento criado:`, dbPayment?.id);
    } else {
      // Atualizar pagamento existente
      console.log(`[RETORNO MP ${requestId}] Atualizando pagamento ${existingPayment.id}...`);
      
      const { error: updateError } = await supabase
        .from('payments')
        .update({
          payment_id: mpPaymentId,
          status: paymentStatus,
          mercado_pago_data: paymentData,
          processed_at: paymentStatus === 'approved' && !existingPayment.processed_at 
            ? new Date().toISOString() 
            : existingPayment.processed_at,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingPayment.id);
      
      if (updateError) {
        console.error(`[RETORNO MP ${requestId}] Erro ao atualizar pagamento:`, updateError);
      } else {
        console.log(`[RETORNO MP ${requestId}] Pagamento atualizado`);
      }
      
      // Recarregar dados atualizados
      const { data: updatedPayment } = await supabase
        .from('payments')
        .select('*')
        .eq('id', existingPayment.id)
        .single();
      
      dbPayment = updatedPayment || existingPayment;
    }
    
    // Se pagamento foi aprovado, gerar licença
    if (paymentStatus === 'approved' && dbPayment) {
      console.log(`[RETORNO MP ${requestId}] Verificando licença existente...`);
      
      // Verificar se já existe licença
      const { data: existingLicense } = await supabase
        .from('licenses')
        .select('*')
        .eq('payment_id', dbPayment.id)
        .single();
      
      if (existingLicense) {
        console.log(`[RETORNO MP ${requestId}] Licença já existe:`, existingLicense.id);
        
        return NextResponse.json({
          success: true,
          payment: {
            id: dbPayment.id,
            status: dbPayment.status,
          },
          license: {
            license_key: existingLicense.license_key,
            license_type: existingLicense.license_type,
            expires_at: existingLicense.expires_at,
            max_devices: existingLicense.max_devices,
          },
        });
      }
      
      // Gerar licença
      console.log(`[RETORNO MP ${requestId}] Gerando licença...`);
      
      const licenseType = dbPayment.license_type || 'pro';
      let maxDevices = 1;
      
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
          maxDevices = 9999;
          break;
      }
      
      // Calcular data de expiração
      const { data: expiryResult } = await supabase
        .rpc('calculate_expiry_date', {
          p_plan_code: licenseType,
          p_start_date: new Date().toISOString()
        });
      
      let expiresAt: Date;
      
      if (expiryResult) {
        expiresAt = new Date(expiryResult);
      } else {
        // Fallback
        expiresAt = new Date();
        if (licenseType === 'trial') {
          expiresAt.setDate(expiresAt.getDate() + 7);
        } else if (licenseType === 'standard' || licenseType === 'pro') {
          expiresAt.setFullYear(expiresAt.getFullYear() + 1);
        } else if (licenseType === 'enterprise') {
          expiresAt.setFullYear(expiresAt.getFullYear() + 99);
        }
      }
      
      // Gerar ID do cliente
      const clientId = dbPayment.email.split('@')[0].toUpperCase().substring(0, 8) + 
                       Date.now().toString(36).toUpperCase().substring(0, 4);
      
      // Gerar chave de licença
      const { data: licenseKeyResult } = await supabase
        .rpc('generate_license_key', {
          p_client_id: clientId,
          p_valid_until: expiresAt.toISOString().split('T')[0],
          p_plan: licenseType
        });
      
      let licenseKey: string;
      
      if (licenseKeyResult) {
        licenseKey = licenseKeyResult as string;
      } else {
        // Fallback
        const formattedDate = expiresAt.toISOString().split('T')[0].replace(/-/g, '');
        const randomSuffix = Date.now().toString(36).toUpperCase().substring(0, 16);
        licenseKey = `VOLTRIS-LIC-${clientId}-${formattedDate}-${randomSuffix}`;
      }
      
      // Criar licença
      const { data: license, error: licenseError } = await supabase
        .from('licenses')
        .insert({
          license_key: licenseKey,
          payment_id: dbPayment.id,
          email: dbPayment.email,
          license_type: licenseType,
          max_devices: maxDevices,
          expires_at: expiresAt.toISOString(),
          is_active: true,
          activated_at: new Date().toISOString(),
        })
        .select()
        .single();
      
      if (licenseError) {
        console.error(`[RETORNO MP ${requestId}] Erro ao criar licença:`, licenseError);
        throw licenseError;
      }
      
      console.log(`[RETORNO MP ${requestId}] Licença gerada com sucesso:`, license.id);
      
      // Enviar email com a licença
      try {
        const { sendLicenseEmail } = await import('@/services/emailService');
        
        await sendLicenseEmail({
          email: dbPayment.email,
          licenseKey: license.license_key,
          licenseType: license.license_type,
          maxDevices: license.max_devices,
          expiresAt: license.expires_at,
          amountPaid: dbPayment.amount || 0,
          fullName: dbPayment.full_name || '',
        });
        
        console.log(`[RETORNO MP ${requestId}] Email de licença enviado com sucesso`);
      } catch (emailError) {
        console.error(`[RETORNO MP ${requestId}] Erro ao enviar email:`, emailError);
        // Não falhar o processo por causa do email
      }
      
      return NextResponse.json({
        success: true,
        payment: {
          id: dbPayment.id,
          status: dbPayment.status,
        },
        license: {
          license_key: license.license_key,
          license_type: license.license_type,
          expires_at: license.expires_at,
          max_devices: license.max_devices,
        },
      });
    }
    
    // Se não foi aprovado, retornar status
    return NextResponse.json({
      success: false,
      payment: {
        id: dbPayment?.id,
        status: paymentStatus,
      },
      message: 'Pagamento ainda não foi aprovado',
    });
    
  } catch (error: any) {
    console.error(`[RETORNO MP ${requestId}] Erro:`, {
      message: error.message,
      stack: error.stack,
    });
    
    return NextResponse.json(
      { error: error.message || 'Erro ao processar retorno' },
      { status: 500 }
    );
  }
}
