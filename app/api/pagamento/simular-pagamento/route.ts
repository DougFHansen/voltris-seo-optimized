import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const maxDuration = 30;

/**
 * API para SIMULAR pagamento aprovado - APENAS PARA DESENVOLVIMENTO
 * 
 * POST /api/pagamento/simular-pagamento
 * 
 * Body: {
 *   plan: 'pro',
 *   email: 'teste@voltris.com.br',
 *   fullName: 'Usuário Teste',
 *   simulateApproved: true (opcional, padrão true)
 * }
 * 
 * ⚠️ USO EXCLUSIVO PARA DESENVOLVIMENTO E TESTES
 */
export async function POST(request: Request) {
  const requestId = `sim-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  
  console.log(`[SIMULAÇÃO ${requestId}] ========== INICIANDO SIMULAÇÃO ==========`);
  
  try {
    const body = await request.json();
    const { plan, email, fullName, simulateApproved = true } = body;
    
    console.log(`[SIMULAÇÃO ${requestId}] Parâmetros:`, { plan, email, fullName, simulateApproved });
    
    // Validar parâmetros obrigatórios
    if (!plan || !email) {
      return NextResponse.json(
        { 
          error: 'Parâmetros obrigatórios faltando',
          message: 'plan e email são obrigatórios'
        },
        { status: 400 }
      );
    }
    
    // Validar plano
    const validPlans = ['trial', 'standard', 'pro', 'enterprise'];
    if (!validPlans.includes(plan)) {
      return NextResponse.json(
        { 
          error: 'Plano inválido',
          message: `Planos válidos: ${validPlans.join(', ')}`
        },
        { status: 400 }
      );
    }
    
    // Conectar ao Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error(`[SIMULAÇÃO ${requestId}] Supabase não configurado`);
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta' },
        { status: 500 }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // 1. Criar pagamento simulado
    console.log(`[SIMULAÇÃO ${requestId}] Criando pagamento simulado...`);
    
    const preferenceId = `SIMULADO-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const paymentId = `PAY-SIM-${Date.now()}`;
    
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        preference_id: preferenceId,
        payment_id: paymentId,
        email: email,
        license_type: plan,
        amount: plan === 'trial' ? 0.01 : plan === 'standard' ? 29.90 : plan === 'pro' ? 59.90 : 149.90,
        currency: 'BRL',
        status: simulateApproved ? 'approved' : 'pending',
        processed_at: simulateApproved ? new Date().toISOString() : null,
        mercado_pago_data: {
          simulated: true,
          simulation_timestamp: new Date().toISOString(),
          environment: 'development'
        }
      })
      .select()
      .single();
    
    if (paymentError) {
      console.error(`[SIMULAÇÃO ${requestId}] Erro ao criar pagamento:`, paymentError);
      throw paymentError;
    }
    
    console.log(`[SIMULAÇÃO ${requestId}] Pagamento criado:`, payment.id);
    
    // 2. Se simular pagamento aprovado, gerar licença imediatamente
    let licenseData = null;
    
    if (simulateApproved) {
      console.log(`[SIMULAÇÃO ${requestId}] Gerando licença automaticamente...`);
      
      // Determinar limite de dispositivos
      let maxDevices = 1;
      switch (plan) {
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
      const expiresAt = new Date();
      if (plan === 'trial') {
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 dias
      } else if (plan === 'standard' || plan === 'pro') {
        expiresAt.setFullYear(expiresAt.getFullYear() + 1); // 1 ano
      } else {
        expiresAt.setFullYear(expiresAt.getFullYear() + 10); // 10 anos (vitalício)
      }
      
      // Gerar chave de licença
      const clientId = email.split('@')[0].toUpperCase().substring(0, 8) + 
                      Date.now().toString(36).toUpperCase().substring(0, 4);
      const formattedDate = expiresAt.toISOString().split('T')[0].replace(/-/g, '');
      const randomSuffix = Math.random().toString(36).toUpperCase().substring(2, 10);
      const licenseKey = `VOLTRIS-LIC-${clientId}-${formattedDate}-${randomSuffix}`;
      
      // Criar licença
      const { data: license, error: licenseError } = await supabase
        .from('licenses')
        .insert({
          license_key: licenseKey,
          payment_id: payment.id,
          email: email,
          license_type: plan,
          max_devices: maxDevices,
          expires_at: expiresAt.toISOString(),
          is_active: true,
          activated_at: new Date().toISOString(),
        })
        .select()
        .single();
      
      if (licenseError) {
        console.error(`[SIMULAÇÃO ${requestId}] Erro ao criar licença:`, licenseError);
        throw licenseError;
      }
      
      console.log(`[SIMULAÇÃO ${requestId}] Licença gerada:`, license.license_key);
      
      licenseData = {
        license_key: license.license_key,
        license_type: license.license_type,
        max_devices: license.max_devices,
        expires_at: license.expires_at,
        is_active: license.is_active,
      };
    }
    
    // 3. Retornar resultado
    console.log(`[SIMULAÇÃO ${requestId}] ========== SIMULAÇÃO CONCLUÍDA ==========`);
    
    return NextResponse.json({
      success: true,
      simulated: true,
      environment: 'development',
      payment: {
        id: payment.id,
        preference_id: payment.preference_id,
        payment_id: payment.payment_id,
        email: payment.email,
        license_type: payment.license_type,
        amount: payment.amount,
        status: payment.status,
        processed_at: payment.processed_at,
      },
      license: licenseData,
      message: simulateApproved 
        ? 'Pagamento SIMULADO aprovado e licença gerada com sucesso!' 
        : 'Pagamento SIMULADO criado como pending. Use /sucesso para verificar status.',
      urls: {
        success: `/api/redirect-sucesso?preference_id=${preferenceId}&status=approved&payment_id=${paymentId}`,
        check_license: `/api/license/get?preference_id=${preferenceId}`
      }
    });
    
  } catch (error: any) {
    console.error(`[SIMULAÇÃO ${requestId}] Erro:`, error);
    return NextResponse.json(
      { 
        error: 'Falha na simulação',
        details: error.message,
        environment: 'development'
      },
      { status: 500 }
    );
  }
}