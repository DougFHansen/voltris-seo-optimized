import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';

export const runtime = 'nodejs';
export const maxDuration = 30;

/**
 * API de fallback para geração de licenças quando webhook falha
 * 
 * Esta API verifica o status do pagamento diretamente no Mercado Pago
 * e gera a licença caso tenha sido aprovado mas não processado pelo webhook
 */

export async function POST(request: Request) {
  const fallbackId = `fallback-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  
  console.log(`[LICENSE FALLBACK ${fallbackId}] ========== INICIANDO PROCESSO DE FALLBACK ==========`);

  try {
    const body = await request.json();
    const { payment_id, preference_id, email } = body;
    
    console.log(`[LICENSE FALLBACK ${fallbackId}] Parâmetros recebidos:`, {
      payment_id,
      preference_id,
      email
    });
    
    // Validar parâmetros obrigatórios
    if (!payment_id && !preference_id) {
      return NextResponse.json({
        error: 'payment_id ou preference_id é obrigatório',
        fallback_id: fallbackId
      }, { status: 400 });
    }
    
    // Configurar Mercado Pago
    const accessToken = process.env.MP_ACCESS_TOKEN;
    if (!accessToken) {
      throw new Error('MP_ACCESS_TOKEN not configured');
    }
    
    const client = new MercadoPagoConfig({ accessToken });
    const paymentApi = new Payment(client);
    
    // Buscar pagamento no Mercado Pago
    let paymentData: any = null;
    
    if (payment_id) {
      console.log(`[LICENSE FALLBACK ${fallbackId}] Buscando pagamento por payment_id: ${payment_id}`);
      paymentData = await paymentApi.get({ id: payment_id });
    } else if (preference_id) {
      // Para preference_id, precisamos buscar através de search (menos eficiente)
      console.log(`[LICENSE FALLBACK ${fallbackId}] Buscando pagamento por preference_id: ${preference_id}`);
      // Esta parte requer implementação adicional
      return NextResponse.json({
        error: 'Busca por preference_id não implementada neste fallback',
        fallback_id: fallbackId
      }, { status: 501 });
    }
    
    console.log(`[LICENSE FALLBACK ${fallbackId}] Status do pagamento:`, {
      id: paymentData.id,
      status: paymentData.status,
      status_detail: paymentData.status_detail,
      transaction_amount: paymentData.transaction_amount
    });
    
    // Verificar se pagamento foi aprovado
    if (paymentData.status !== 'approved') {
      return NextResponse.json({
        success: false,
        payment_status: paymentData.status,
        message: 'Pagamento não está aprovado',
        fallback_id: fallbackId
      });
    }
    
    // Conectar ao Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase configuration missing');
    }
    
    const { createClient: createSupabaseClient } = await import('@supabase/supabase-js');
    const supabase = createSupabaseClient(supabaseUrl, supabaseServiceKey);
    
    // Buscar pagamento no banco
    console.log(`[LICENSE FALLBACK ${fallbackId}] Buscando registro no banco...`);
    const { data: existingPayment, error: fetchError } = await supabase
      .from('payments')
      .select('*')
      .eq('payment_id', paymentData.id)
      .single();
    
    if (fetchError) {
      console.error(`[LICENSE FALLBACK ${fallbackId}] Erro ao buscar pagamento:`, fetchError);
      throw new Error(`Database error: ${fetchError.message}`);
    }
    
    if (!existingPayment) {
      console.log(`[LICENSE FALLBACK ${fallbackId}] Criando novo registro de pagamento...`);
      
      // Criar pagamento no banco
      const { data: newPayment, error: createError } = await supabase
        .from('payments')
        .insert({
          payment_id: paymentData.id,
          preference_id: (paymentData as any).preference_id,
          email: email || paymentData.payer?.email || 'unknown@example.com',
          license_type: 'pro',
          amount: paymentData.transaction_amount,
          currency: 'BRL',
          status: 'approved',
          mercado_pago_data: paymentData,
          processed_at: new Date().toISOString(),
        })
        .select()
        .single();
      
      if (createError) {
        console.error(`[LICENSE FALLBACK ${fallbackId}] Erro ao criar pagamento:`, createError);
        throw new Error(`Failed to create payment record: ${createError.message}`);
      }
      
      console.log(`[LICENSE FALLBACK ${fallbackId}] Pagamento criado:`, newPayment.id);
      
      // Gerar licença
      const licenseResult = await generateLicense(supabase, newPayment, paymentData, fallbackId);
      
      return NextResponse.json({
        success: true,
        created: true,
        payment: {
          id: newPayment.id,
          payment_id: newPayment.payment_id,
          status: newPayment.status
        },
        license: licenseResult,
        message: 'Pagamento e licença criados com sucesso via fallback',
        fallback_id: fallbackId
      });
    }
    
    // Verificar se pagamento já foi processado
    if (existingPayment.processed_at) {
      console.log(`[LICENSE FALLBACK ${fallbackId}] Pagamento já processado anteriormente`);
      
      // Verificar se licença existe
      const { data: existingLicense } = await supabase
        .from('licenses')
        .select('*')
        .eq('payment_id', existingPayment.id)
        .single();
      
      if (existingLicense) {
        return NextResponse.json({
          success: true,
          already_processed: true,
          payment: {
            id: existingPayment.id,
            payment_id: existingPayment.payment_id,
            status: existingPayment.status,
            processed_at: existingPayment.processed_at
          },
          license: {
            license_key: existingLicense.license_key,
            license_type: existingLicense.license_type,
            expires_at: existingLicense.expires_at,
            max_devices: existingLicense.max_devices
          },
          message: 'Pagamento e licença já existem',
          fallback_id: fallbackId
        });
      }
    }
    
    // Atualizar pagamento existente
    console.log(`[LICENSE FALLBACK ${fallbackId}] Atualizando pagamento existente...`);
    
    const { error: updateError } = await supabase
      .from('payments')
      .update({
        status: 'approved',
        mercado_pago_data: paymentData,
        processed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', existingPayment.id);
    
    if (updateError) {
      console.error(`[LICENSE FALLBACK ${fallbackId}] Erro ao atualizar pagamento:`, updateError);
      throw new Error(`Failed to update payment: ${updateError.message}`);
    }
    
    // Gerar licença
    const licenseResult = await generateLicense(supabase, existingPayment, paymentData, fallbackId);
    
    return NextResponse.json({
      success: true,
      updated: true,
      payment: {
        id: existingPayment.id,
        payment_id: existingPayment.payment_id,
        status: 'approved',
        processed_at: new Date().toISOString()
      },
      license: licenseResult,
      message: 'Pagamento atualizado e licença gerada via fallback',
      fallback_id: fallbackId
    });
    
  } catch (error: any) {
    console.error(`[LICENSE FALLBACK ${fallbackId}] Erro fatal:`, {
      message: error.message,
      stack: error.stack
    });
    
    return NextResponse.json({
      success: false,
      error: error.message,
      fallback_id: fallbackId
    }, { status: 500 });
  }
}

/**
 * Função auxiliar para gerar licenças de forma robusta
 */
async function generateLicense(
  supabase: any,
  payment: any,
  paymentData: any,
  fallbackId: string
): Promise<any> {
  try {
    console.log(`[LICENSE FALLBACK ${fallbackId}] Gerando licença para pagamento ${payment.id}...`);
    
    // Determinar tipo de licença baseado no valor pago
    let licenseType = 'pro';
    let maxDevices = 3;
    let expiresInYears = 1;
    
    // Lógica de determinação de plano baseada no valor
    const amount = paymentData.transaction_amount;
    if (amount >= 149) {
      licenseType = 'enterprise';
      maxDevices = 9999;
      expiresInYears = 100;
    } else if (amount >= 59) {
      licenseType = 'pro';
      maxDevices = 3;
      expiresInYears = 1;
    } else if (amount >= 29) {
      licenseType = 'standard';
      maxDevices = 1;
      expiresInYears = 1;
    } else if (amount < 10) {
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
      console.error(`[LICENSE FALLBACK ${fallbackId}] Erro ao criar licença:`, licenseError);
      throw new Error(`License creation failed: ${licenseError.message}`);
    }
    
    console.log(`[LICENSE FALLBACK ${fallbackId}] ✅ Licença gerada com sucesso:`, {
      license_id: license.id,
      license_key: licenseKey,
      license_type: licenseType,
      max_devices: maxDevices,
      expires_at: expiresAt.toISOString()
    });
    
    return {
      license_key: licenseKey,
      license_type: licenseType,
      max_devices: maxDevices,
      expires_at: expiresAt.toISOString(),
      created_at: new Date().toISOString()
    };
    
  } catch (licenseError: any) {
    console.error(`[LICENSE FALLBACK ${fallbackId}] Erro fatal na geração de licença:`, licenseError);
    throw licenseError;
  }
}