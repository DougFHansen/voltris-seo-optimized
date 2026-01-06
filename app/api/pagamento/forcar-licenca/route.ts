import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const maxDuration = 30;

/**
 * API de EMERGÊNCIA para forçar criação de licença
 * Usar quando tudo mais falhar
 */
export async function POST(request: Request) {
  try {
    const { payment_id } = await request.json();
    
    if (!payment_id) {
      return NextResponse.json({ error: 'payment_id required' }, { status: 400 });
    }
    
    console.log(`[FORÇA LICENÇA] Processando payment_id: ${payment_id}`);
    
    // 1. Buscar dados do pagamento no Mercado Pago
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN_PROD || process.env.MP_ACCESS_TOKEN;
    if (!accessToken) {
      return NextResponse.json({ error: 'Token not configured' }, { status: 500 });
    }
    
    const mpClient = new MercadoPagoConfig({ accessToken });
    const paymentAPI = new Payment(mpClient);
    const paymentData = await paymentAPI.get({ id: payment_id });
    
    console.log(`[FORÇA LICENÇA] Pagamento MP:`, {
      id: paymentData.id,
      status: paymentData.status,
      amount: paymentData.transaction_amount,
      email: paymentData.payer?.email,
    });
    
    if (paymentData.status !== 'approved') {
      return NextResponse.json({
        error: 'Payment not approved',
        status: paymentData.status,
      }, { status: 400 });
    }
    
    // 2. Conectar ao Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // 3. Criar ou atualizar pagamento no banco
    const preferenceId = (paymentData as any).preference_id;
    const email = paymentData.payer?.email || 'pagamento@voltris.com.br';
    
    // Tentar buscar primeiro
    const { data: existing } = await supabase
      .from('payments')
      .select('*')
      .eq('payment_id', payment_id)
      .single();
    
    let dbPayment;
    
    if (existing) {
      console.log(`[FORÇA LICENÇA] Pagamento já existe:`, existing.id);
      dbPayment = existing;
    } else {
      // Criar novo
      console.log(`[FORÇA LICENÇA] Criando novo pagamento...`);
      
      const { data: newPayment, error: createError } = await supabase
        .from('payments')
        .insert({
          preference_id: preferenceId,
          payment_id: payment_id,
          email: email,
          license_type: 'enterprise', // PIX de R$ 1,00 vamos considerar enterprise
          amount: paymentData.transaction_amount || 1.0,
          currency: 'BRL',
          status: 'approved',
          mercado_pago_data: paymentData,
          processed_at: new Date().toISOString(),
        })
        .select()
        .single();
      
      if (createError) {
        console.error(`[FORÇA LICENÇA] Erro ao criar:`, createError);
        return NextResponse.json({ error: createError.message }, { status: 500 });
      }
      
      dbPayment = newPayment;
      console.log(`[FORÇA LICENÇA] Pagamento criado:`, dbPayment.id);
    }
    
    // 4. Verificar se já tem licença
    const { data: existingLicense } = await supabase
      .from('licenses')
      .select('*')
      .eq('payment_id', dbPayment.id)
      .single();
    
    if (existingLicense) {
      console.log(`[FORÇA LICENÇA] Licença já existe:`, existingLicense.license_key);
      return NextResponse.json({
        success: true,
        already_exists: true,
        license: {
          license_key: existingLicense.license_key,
          license_type: existingLicense.license_type,
          expires_at: existingLicense.expires_at,
          max_devices: existingLicense.max_devices,
        },
      });
    }
    
    // 5. Gerar licença
    console.log(`[FORÇA LICENÇA] Gerando licença...`);
    
    const licenseKey = generateLicenseKey();
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 100); // Vitalício (100 anos)
    
    const { data: newLicense, error: licenseError } = await supabase
      .from('licenses')
      .insert({
        license_key: licenseKey,
        license_type: 'enterprise',
        email: email,
        payment_id: dbPayment.id,
        expires_at: expiresAt.toISOString(),
        max_devices: 9999,
        is_active: true,
      })
      .select()
      .single();
    
    if (licenseError) {
      console.error(`[FORÇA LICENÇA] Erro ao criar licença:`, licenseError);
      return NextResponse.json({ error: licenseError.message }, { status: 500 });
    }
    
    console.log(`[FORÇA LICENÇA] ✅ Licença gerada:`, newLicense.license_key);
    
    return NextResponse.json({
      success: true,
      payment: {
        id: dbPayment.id,
        payment_id: dbPayment.payment_id,
        status: dbPayment.status,
      },
      license: {
        license_key: newLicense.license_key,
        license_type: newLicense.license_type,
        expires_at: newLicense.expires_at,
        max_devices: newLicense.max_devices,
      },
    });
    
  } catch (error: any) {
    console.error(`[FORÇA LICENÇA] Erro:`, error);
    return NextResponse.json({
      error: error.message,
      details: error.cause || error.response?.data,
    }, { status: 500 });
  }
}

function generateLicenseKey(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const parts = [];
  
  for (let i = 0; i < 4; i++) {
    let part = '';
    for (let j = 0; j < 4; j++) {
      part += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    parts.push(part);
  }
  
  return parts.join('-');
}
