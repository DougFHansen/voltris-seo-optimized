import { NextResponse } from 'next/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { MercadoPagoConfig, Payment } from 'mercadopago';

export const runtime = 'nodejs';
export const maxDuration = 30;

/**
 * API para processar pagamento quando usuário retorna da página de sucesso do MP
 * Usado quando webhook não foi chamado automaticamente
 */
export async function POST(request: Request) {
  const processingId = `processing-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  
  console.log(`[PAGAMENTO RETORNO] ========== PROCESSANDO RETORNO ${processingId} ==========`);
  
  try {
    const body = await request.json();
    const {
      payment_id,
      collection_id,
      preference_id,
      status,
    } = body;

    const paymentId = payment_id || collection_id;

    console.log(`[PAGAMENTO RETORNO] Dados recebidos:`, {
      payment_id: paymentId,
      preference_id,
      status,
    });

    if (!paymentId) {
      return NextResponse.json(
        { error: 'payment_id ou collection_id é obrigatório' },
        { status: 400 }
      );
    }

    // Conectar ao Supabase com service role
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('[PAGAMENTO RETORNO] Credenciais Supabase não configuradas');
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta' },
        { status: 500 }
      );
    }

    const supabase = createSupabaseClient(supabaseUrl, supabaseServiceKey);

    // Buscar dados completos do pagamento no Mercado Pago
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN_PROD || process.env.MP_ACCESS_TOKEN;
    if (!accessToken) {
      console.error('[PAGAMENTO RETORNO] Token Mercado Pago não configurado');
      return NextResponse.json(
        { error: 'Token Mercado Pago não configurado' },
        { status: 500 }
      );
    }

    console.log(`[PAGAMENTO RETORNO] Buscando dados do pagamento no Mercado Pago...`);

    const client = new MercadoPagoConfig({ accessToken });
    const payment = new Payment(client);

    const paymentData = await payment.get({ id: paymentId });

    console.log(`[PAGAMENTO RETORNO] Dados do pagamento:`, {
      id: paymentData.id,
      status: paymentData.status,
      preference_id: (paymentData as any).preference_id,
      amount: paymentData.transaction_amount,
    });

    // Buscar ou criar pagamento no banco
    const mpPreferenceId = (paymentData as any).preference_id;
    
    const { data: existingPayment } = await supabase
      .from('payments')
      .select('*')
      .or(`preference_id.eq.${mpPreferenceId},payment_id.eq.${paymentId}`)
      .single();

    let paymentRecord;

    if (existingPayment) {
      console.log(`[PAGAMENTO RETORNO] Pagamento existente encontrado: ${existingPayment.id}`);
      
      // Atualizar pagamento existente
      const { data: updated } = await supabase
        .from('payments')
        .update({
          payment_id: paymentId.toString(),
          status: paymentData.status === 'approved' ? 'approved' : 'pending',
          mercado_pago_data: paymentData,
          processed_at: paymentData.status === 'approved' ? new Date().toISOString() : null,
        })
        .eq('id', existingPayment.id)
        .select()
        .single();

      paymentRecord = updated;
      console.log(`[PAGAMENTO RETORNO] Pagamento atualizado`);
    } else {
      console.log(`[PAGAMENTO RETORNO] Criando novo registro de pagamento...`);
      
      // Criar novo pagamento
      const { data: created } = await supabase
        .from('payments')
        .insert({
          preference_id: mpPreferenceId,
          payment_id: paymentId.toString(),
          email: paymentData.payer?.email || 'unknown@example.com',
          license_type: 'premium', // Determinar baseado no valor
          amount: paymentData.transaction_amount || 0,
          currency: paymentData.currency_id || 'BRL',
          status: paymentData.status === 'approved' ? 'approved' : 'pending',
          mercado_pago_data: paymentData,
          processed_at: paymentData.status === 'approved' ? new Date().toISOString() : null,
        })
        .select()
        .single();

      paymentRecord = created;
      console.log(`[PAGAMENTO RETORNO] Novo pagamento criado: ${paymentRecord?.id}`);
    }

    // Se aprovado, gerar licença
    if (paymentData.status === 'approved' && paymentRecord) {
      console.log(`[PAGAMENTO RETORNO] Pagamento aprovado, verificando licença...`);
      
      // Verificar se já existe licença
      const { data: existingLicense } = await supabase
        .from('licenses')
        .select('*')
        .eq('payment_id', paymentRecord.id)
        .single();

      if (existingLicense) {
        console.log(`[PAGAMENTO RETORNO] Licença já existe: ${existingLicense.id}`);
        
        return NextResponse.json({
          success: true,
          payment: paymentRecord,
          license: existingLicense,
          message: 'Pagamento já processado anteriormente',
        });
      }

      // Gerar nova licença
      console.log(`[PAGAMENTO RETORNO] Gerando nova licença...`);
      
      // Determinar tipo e dispositivos baseado no valor
      let licenseType: 'trial' | 'pro' | 'premium' | 'enterprise' = 'pro';
      let maxDevices = 1;
      
      const amount = paymentRecord.amount || 0;
      if (amount >= 149) {
        licenseType = 'enterprise';
        maxDevices = 9999;
      } else if (amount >= 99) {
        licenseType = 'premium';
        maxDevices = 3;
      } else if (amount >= 49) {
        licenseType = 'pro';
        maxDevices = 1;
      } else if (amount < 1) {
        licenseType = 'trial';
        maxDevices = 1;
      }
      
      // Calcular data de expiração usando função do banco
      const { data: expiryResult } = await supabase
        .rpc('calculate_expiry_date', {
          p_plan_code: licenseType,
          p_start_date: new Date().toISOString()
        });
      
      const expiresAt = expiryResult ? new Date(expiryResult) : (() => {
        const date = new Date();
        if (licenseType === 'trial') date.setDate(date.getDate() + 7);
        else if (licenseType === 'pro') date.setMonth(date.getMonth() + 1);
        else if (licenseType === 'premium') date.setMonth(date.getMonth() + 3);
        else if (licenseType === 'enterprise') date.setMonth(date.getMonth() + 6);
        return date;
      })();

      const clientId = (paymentRecord.email.split('@')[0].toUpperCase().substring(0, 8) + 
                       Date.now().toString(36).toUpperCase().substring(0, 4));

      // Tentar gerar chave via função do banco
      const { data: licenseKeyResult } = await supabase
        .rpc('generate_license_key', {
          p_client_id: clientId,
          p_valid_until: expiresAt.toISOString().split('T')[0],
          p_plan: licenseType
        });

      const licenseKey = licenseKeyResult || 
        `VOLTRIS-LIC-${clientId}-${expiresAt.toISOString().split('T')[0].replace(/-/g, '')}-${Date.now().toString(36).toUpperCase().substring(0, 16)}`;

      const { data: license, error: licenseError } = await supabase
        .from('licenses')
        .insert({
          license_key: licenseKey,
          payment_id: paymentRecord.id,
          email: paymentRecord.email,
          license_type: licenseType,
          max_devices: maxDevices,
          expires_at: expiresAt.toISOString(),
          is_active: true,
          activated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (licenseError) {
        console.error('[PAGAMENTO RETORNO] Erro ao gerar licença:', licenseError);
        throw licenseError;
      }

      console.log(`[PAGAMENTO RETORNO] Licença gerada com sucesso: ${license.id}`);

      return NextResponse.json({
        success: true,
        payment: paymentRecord,
        license,
        message: 'Pagamento processado e licença gerada',
      });
    }

    return NextResponse.json({
      success: true,
      payment: paymentRecord,
      message: 'Pagamento processado (aguardando aprovação)',
    });

  } catch (error: any) {
    console.error(`[PAGAMENTO RETORNO] Erro:`, error);
    return NextResponse.json(
      {
        error: 'Erro ao processar pagamento',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
