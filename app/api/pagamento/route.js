import { MercadoPagoConfig, Preference } from 'mercadopago';
import { createClient } from '@/utils/supabase/server';

export const runtime = 'nodejs';
export const maxDuration = 30;

/**
 * API para criar preferência de pagamento no Mercado Pago
 * 
 * Suporta GET (legacy) e POST (novo)
 * 
 * POST Body: {
 *   plan: string (trial|pro|premium|enterprise),
 *   email: string (obrigatório),
 *   fullName: string (obrigatório),
 *   phone: string (opcional)
 * }
 * 
 * Query params (GET):
 * - plan: tipo de licença (trial, pro, premium, enterprise) - default: pro
 * - email: email do comprador (opcional, mas recomendado)
 */

async function handlePaymentRequest(plan, email, fullName = '', phone = '') {
  const startTime = Date.now();
  const requestId = `req-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  
  console.log(`[MERCADO PAGO DEBUG] ========== INÍCIO REQUISIÇÃO ${requestId} ==========`);
  
  try {
    // Verifica se o token está configurado
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN_PROD || process.env.MP_ACCESS_TOKEN;
    if (!accessToken) {
      console.error(`[MERCADO PAGO DEBUG] ERRO CRÍTICO: Token não configurado`);
      throw new Error('Token de acesso do Mercado Pago não está configurado');
    }

    // Log detalhado do token
    const tokenPrefix = accessToken.substring(0, 20);
    const isAppUsrToken = accessToken.startsWith('APP_USR-');
    
    console.log(`[MERCADO PAGO DEBUG] ========== VALIDAÇÃO DE TOKEN ==========`);
    console.log(`[MERCADO PAGO DEBUG] Token configurado:`, {
      prefix: tokenPrefix,
      length: accessToken.length,
      isAppUsrToken,
      valid: isAppUsrToken,
    });
    
    if (!isAppUsrToken) {
      console.error(`[MERCADO PAGO DEBUG] ❌ TOKEN INVÁLIDO`);
      console.error(`[MERCADO PAGO DEBUG] Token deve começar com APP_USR-`);
      console.error(`[MERCADO PAGO DEBUG] Obtenha o token em: https://www.mercadopago.com.br/developers/panel/credentials`);
    } else {
      console.log(`[MERCADO PAGO DEBUG] ✅ Token APP_USR- detectado - Token válido`);
      console.log(`[MERCADO PAGO DEBUG] 💡 IMPORTANTE: Este mesmo token funciona para:`);
      console.log(`[MERCADO PAGO DEBUG]    - Sandbox (usando test users e cartões de teste)`);
      console.log(`[MERCADO PAGO DEBUG]    - Produção (usando usuários e cartões reais)`);
      console.log(`[MERCADO PAGO DEBUG]    - O ambiente é determinado pelos test users, não pelo token`);
    }

    console.log(`[MERCADO PAGO DEBUG] Parâmetros da requisição:`, {
      plan,
      email: email || 'não informado',
      fullName: fullName || 'não informado',
      phone: phone || 'não informado',
    });
    
    // Validar plano
    const validPlans = ['trial', 'standard', 'pro', 'enterprise']; // Alinhado com LicenseModels.cs
    if (!validPlans.includes(plan)) {
      console.error(`[MERCADO PAGO DEBUG] Plano inválido: ${plan}`);
      throw new Error(`Plano inválido. Use: ${validPlans.join(', ')}`);
    }
    
    // Validar email se fornecido
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      console.error(`[MERCADO PAGO DEBUG] Email inválido: ${email}`);
      throw new Error('Formato de email inválido');
    }
    
    console.log(`[MERCADO PAGO DEBUG] Validações OK`);
    
    // Configurar preços e tipos de licença (ALINHADO COM LicenseModels.cs)
    // Fonte da verdade: APLICATIVO VOLTRIS/Services/License/LicenseModels.cs
    // ⚠️ PREÇOS ALTERADOS PARA R$ 1,00 (TESTES) - VOLTAR VALORES ORIGINAIS APÓS VALIDAÇÃO
    // NOTA: Mercado Pago bloqueia PIX abaixo de R$ 0,50 em produção
    // ÚLTIMA ATUALIZAÇÃO: 06/01/2026 04:00 - FORÇANDO REBUILD
    const planConfig = {
      trial: { price: 1.00, title: 'Licença Voltris - Trial (7 dias)', months: 0, devices: 1 }, // TESTE: Original 0.01
      standard: { price: 1.00, title: 'Licença Voltris - Standard (1 ano)', months: 12, devices: 1 }, // TESTE: Original 29.90
      pro: { price: 1.00, title: 'Licença Voltris - Pro (1 ano)', months: 12, devices: 3 }, // TESTE: Original 59.90
      enterprise: { price: 1.00, title: 'Licença Voltris - Enterprise (Vitalício)', months: 0, devices: 9999 }, // TESTE: Original 149.90
    };
    
    const selectedPlan = planConfig[plan];
    
    console.log(`[MERCADO PAGO DEBUG] Configurando cliente Mercado Pago...`);
    const client = new MercadoPagoConfig({
      accessToken: accessToken,
    });

    const preference = new Preference(client);
    console.log(`[MERCADO PAGO DEBUG] Cliente Mercado Pago configurado com sucesso`);
    
    // Domínio do site (pode ser variável de ambiente)
    let dominio = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.voltris.com.br';
    dominio = dominio.replace(/\/$/, '');
    
    if (dominio.includes('voltris.com.br') && !dominio.includes('www.')) {
      dominio = dominio.replace('voltris.com.br', 'www.voltris.com.br');
    }
    
    console.log(`[MERCADO PAGO DEBUG] Domínio configurado:`, dominio);
    
    // Primeiro criar a preferência no Mercado Pago para obter o preference_id
    console.log(`[MERCADO PAGO DEBUG] Criando preferência no Mercado Pago primeiro...`);
    
    // URL do webhook (Mercado Pago notificará aqui quando houver mudanças)
    const webhookUrl = `${dominio}/api/webhook/mercadopago`;
    
    console.log(`[MERCADO PAGO DEBUG] Webhook URL configurada:`, webhookUrl);
    
    // Payer email: usar o fornecido ou email genérico REAL (não teste)
    const payerEmail = email || 'pagamento@voltris.com.br';
    
    // Mapear categoria baseada no plano
    const itemCategories = {
      trial: 'computing',
      standard: 'computing',
      pro: 'computing',
      enterprise: 'computing'
    };
    
    // Mapear IDs dos itens
    const itemIds = {
      trial: 'VOLTRIS-TRIAL-001',
      standard: 'VOLTRIS-STANDARD-001',
      pro: 'VOLTRIS-PRO-001',
      enterprise: 'VOLTRIS-ENTERPRISE-001'
    };
    
    // Separar primeiro nome e sobrenome
    let firstName = '';
    let lastName = '';
    if (fullName) {
      const nameParts = fullName.trim().split(' ');
      firstName = nameParts[0] || '';
      lastName = nameParts.slice(1).join(' ') || nameParts[0] || '';
    }
    
    console.log(`[MERCADO PAGO DEBUG] Payer email configurado:`, payerEmail);
    
    // Construir corpo da preferência
    const preferenceBody = {
      items: [
        {
          id: itemIds[plan],  // ✅ OBRIGATÓRIO para qualidade
          title: selectedPlan.title,  // ✅ Já tinha
          description: `Licença ${plan} do Voltris Optimizer - Otimizador de PC para gamers com ${selectedPlan.devices} dispositivo(s)`,  // ✅ NOVO
          category_id: itemCategories[plan],  // ✅ NOVO
          quantity: 1,
          currency_id: 'BRL',
          unit_price: selectedPlan.price,
        }
      ],
      back_urls: {
        success: `${dominio}/sucesso`,
        failure: `${dominio}/falha`,
        pending: `${dominio}/sucesso`  // PIX retorna como pending!
      },
      auto_return: 'all',  // Redirecionar automaticamente para approved, pending e in_process
      notification_url: webhookUrl,
      statement_descriptor: 'VOLTRIS',
      payer: {
        email: payerEmail,  // ✅ OBRIGATÓRIO
        ...(firstName && {
          name: firstName,  // ✅ RECOMENDADO - first_name
          surname: lastName || firstName,  // ✅ RECOMENDADO - last_name
        }),
        ...(phone && {
          phone: {
            area_code: phone.replace(/\D/g, '').substring(0, 2),
            number: phone.replace(/\D/g, '').substring(2),
          },
        }),
      },
      external_reference: `voltris-${plan}-${Date.now()}`,
      payment_methods: {
        installments: 12,
        default_installments: 1,
      },
    };

    console.log(`[MERCADO PAGO DEBUG] ========== PAYLOAD PARA MERCADO PAGO ==========`);
    console.log(`[MERCADO PAGO DEBUG] Payload:`, JSON.stringify(preferenceBody, null, 2));
    console.log(`[MERCADO PAGO DEBUG] Detalhes:`, {
      plan,
      price: selectedPlan.price,
      email: payerEmail,
      dominio,
      back_url_success: `${dominio}/sucesso`,
      webhook_url: webhookUrl,
      auto_return: 'approved',
    });
    
    // ⚠️ CRITICAL VALIDATION BEFORE SENDING
    console.log(`[MERCADO PAGO DEBUG] ========== VALIDAÇÃO PRÉ-ENVIO ==========`);
    const validationChecks = {
      token_valido: isAppUsrToken ? '✅ SIM (APP_USR-)' : '❌ NÃO',
      webhook_url_presente: !!webhookUrl ? '✅ SIM' : '❌ NÃO',
      auto_return_configurado: !!preferenceBody.auto_return ? '✅ SIM' : '❌ NÃO',
      notification_url_presente: !!preferenceBody.notification_url ? '✅ SIM' : '❌ NÃO',
      preco_valido: selectedPlan.price >= 0 ? '✅ SIM' : '❌ NÃO',
      email_valido: !!payerEmail ? '✅ SIM' : '❌ NÃO',
    };
    console.log(`[MERCADO PAGO DEBUG] Checklist de validação:`, validationChecks);

    let response;
    try {
      console.log(`[MERCADO PAGO DEBUG] Enviando requisição para API Mercado Pago...`);
      
      response = await preference.create({
        body: preferenceBody
      });
      
      console.log(`[MERCADO PAGO DEBUG] ========== RESPOSTA MERCADO PAGO ==========`);
      console.log(`[MERCADO PAGO DEBUG] Preferência criada com sucesso!`);
      console.log(`[MERCADO PAGO DEBUG] Dados principais:`, {
        preference_id: response.id,
        init_point: response.init_point,
        sandbox_init_point: response.sandbox_init_point,
        test_mode: response.test_mode,
        status: response.status,
        site_id: response.site_id,
        operation_type: response.operation_type,
      });
      
      console.log(`[MERCADO PAGO DEBUG] URLs geradas:`, {
        production_url: response.init_point || 'não disponível',
        sandbox_url: response.sandbox_init_point || 'não disponível',
        usar_sandbox: !!response.sandbox_init_point,
      });
      
      console.log(`[MERCADO PAGO DEBUG] Resposta COMPLETA do Mercado Pago:`);
      console.log(JSON.stringify(response, null, 2));
      
    } catch (mpError) {
      console.error(`[MERCADO PAGO DEBUG] ========== ERRO AO CRIAR PREFERÊNCIA ==========`);
      console.error(`[MERCADO PAGO DEBUG] Erro geral:`, mpError.message);
      console.error(`[MERCADO PAGO DEBUG] Status HTTP:`, mpError.status || mpError.statusCode || 'não disponível');
      
      if (mpError.cause) {
        console.error(`[MERCADO PAGO DEBUG] Causa raiz:`, mpError.cause);
      }
      
      // Tentar extrair mais detalhes do erro
      if (mpError.response) {
        console.error(`[MERCADO PAGO DEBUG] Response data:`, JSON.stringify(mpError.response.data, null, 2));
      }
      
      if (mpError.apiResponse) {
        console.error(`[MERCADO PAGO DEBUG] API Response:`, JSON.stringify(mpError.apiResponse, null, 2));
      }
      
      console.error(`[MERCADO PAGO DEBUG] Stack trace:`, mpError.stack);
      console.error(`[MERCADO PAGO DEBUG] Objeto de erro completo:`, JSON.stringify(mpError, null, 2));
      
      throw mpError;
    }

    // Agora criar o registro no banco com o preference_id
    let paymentRecord = null;
    
    try {
      console.log(`[MERCADO PAGO DEBUG] Criando registro de pagamento no banco com preference_id...`);
      
      const { createClient: createSupabaseClient } = await import('@supabase/supabase-js');
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      
      const supabase = supabaseServiceKey 
        ? createSupabaseClient(supabaseUrl, supabaseServiceKey)
        : await createClient();
      
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .insert({
          preference_id: response.id,
          email: email || 'unknown@example.com',
          license_type: plan,
          amount: selectedPlan.price,
          currency: 'BRL',
          status: 'pending',
        })
        .select()
        .single();
      
      if (paymentError) {
        console.error('[MERCADO PAGO DEBUG] Erro ao criar registro no banco:', paymentError);
      } else {
        paymentRecord = payment;
        console.log('[MERCADO PAGO DEBUG] Registro criado no banco:', payment.id);
      }
    } catch (dbError) {
      console.error('[MERCADO PAGO DEBUG] Erro ao acessar banco:', dbError);
    }

    const duration = Date.now() - startTime;
    
    console.log(`[MERCADO PAGO DEBUG] ========== RESPOSTA PARA FRONTEND ==========`);
    
    const frontendResponse = { 
      init_point: response.init_point,
      sandbox_init_point: response.sandbox_init_point,
      preference_id: response.id,
      payment_id: paymentRecord?.id || null,
      test_mode: response.test_mode,
      debug: {
        request_id: requestId,
        duration_ms: duration,
        token_valid: isAppUsrToken,
      }
    };
    
    console.log(`[MERCADO PAGO DEBUG] Dados retornados:`, JSON.stringify(frontendResponse, null, 2));
    console.log(`[MERCADO PAGO DEBUG] ========== FIM REQUISIÇÃO ${requestId} (${duration}ms) ==========`);

    return frontendResponse;
  } catch (error) {
    const duration = Date.now() - startTime;
    
    console.error(`[MERCADO PAGO DEBUG] ========== ERRO GERAL (${duration}ms) ==========`);
    console.error(`[MERCADO PAGO DEBUG] Mensagem:`, error.message);
    console.error(`[MERCADO PAGO DEBUG] Status:`, error.status || error.statusCode || 'não disponível');
    console.error(`[MERCADO PAGO DEBUG] Causa:`, error.cause || 'não disponível');
    console.error(`[MERCADO PAGO DEBUG] Stack:`, error.stack);

    throw error;
  }
}

// GET handler (legacy support)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const plan = searchParams.get('plan') || 'pro';
    const email = searchParams.get('email') || '';
    
    const result = await handlePaymentRequest(plan, email);
    
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Failed to create payment preference', 
      details: error.message,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// POST handler (new, with fullName and phone support)
export async function POST(request) {
  try {
    const body = await request.json();
    const { plan, email, fullName, phone } = body;
    
    if (!plan || !email) {
      return new Response(JSON.stringify({ 
        error: 'Missing required fields',
        message: 'plan e email são obrigatórios',
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    const result = await handlePaymentRequest(plan, email, fullName, phone);
    
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Failed to create payment preference', 
      details: error.message,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}