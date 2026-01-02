import { MercadoPagoConfig, Preference } from 'mercadopago';
import { createClient } from '@/utils/supabase/server';

export const runtime = 'nodejs';
export const maxDuration = 30;

/**
 * API para criar preferência de pagamento no Mercado Pago
 * 
 * [MERCADO PAGO DEBUG] Esta API:
 * 1. Recebe plan e email via query params
 * 2. Valida o MP_ACCESS_TOKEN (deve estar em env)
 * 3. Cria preferência no Mercado Pago
 * 4. Retorna init_point e sandbox_init_point
 * 
 * PONTOS DE FALHA POSSÍVEIS:
 * - Token ausente ou inválido
 * - Token de produção quando deveria ser teste
 * - Payload inválido (campos obrigatórios)
 * - API Mercado Pago fora do ar
 * - Timeout na requisição
 * - Erro de rede
 * 
 * Query params:
 * - plan: tipo de licença (trial, pro, premium) - default: pro
 * - email: email do comprador (opcional, mas recomendado)
 */
export async function GET(request) {
  const startTime = Date.now();
  const requestId = `req-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  
  console.log(`[MERCADO PAGO DEBUG] ========== INÍCIO REQUISIÇÃO ${requestId} ==========`);
  
  try {
    // Verifica se o token está configurado
    const accessToken = process.env.MP_ACCESS_TOKEN;
    if (!accessToken) {
      console.error(`[MERCADO PAGO DEBUG] ERRO CRÍTICO: MP_ACCESS_TOKEN não configurado`);
      return new Response(JSON.stringify({ 
        error: 'MP_ACCESS_TOKEN not configured',
        message: 'Token de acesso do Mercado Pago não está configurado. Configure a variável MP_ACCESS_TOKEN no Vercel.'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
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

    // Obter parâmetros da query
    const { searchParams } = new URL(request.url);
    const plan = searchParams.get('plan') || 'pro';
    const email = searchParams.get('email') || '';
    
    console.log(`[MERCADO PAGO DEBUG] Parâmetros da requisição:`, {
      plan,
      email: email || 'não informado',
      url: request.url,
    });
    
    // Validar plano
    const validPlans = ['trial', 'pro', 'premium'];
    if (!validPlans.includes(plan)) {
      console.error(`[MERCADO PAGO DEBUG] Plano inválido: ${plan}`);
      return new Response(JSON.stringify({ 
        error: 'Invalid plan',
        message: `Plano inválido. Use: ${validPlans.join(', ')}`
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    
    // Validar email se fornecido
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      console.error(`[MERCADO PAGO DEBUG] Email inválido: ${email}`);
      return new Response(JSON.stringify({ 
        error: 'Invalid email',
        message: 'Formato de email inválido'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    
    // ⚠️ Validate test user for sandbox environment
    if (email) {
      // Check if email looks like a test user
      const isTestUserEmail = email.includes('test@') || email.includes('testuser');
      if (!isTestUserEmail) {
        console.warn(`[MERCADO PAGO DEBUG] ⚠️ ATENÇÃO: Email fornecido (${email}) não parece ser uma conta de teste`);
        console.warn(`[MERCADO PAGO DEBUG] Para pagamentos de teste, use contas de teste criadas no painel do Mercado Pago`);
        console.warn(`[MERCADO PAGO DEBUG] Mais info: https://www.mercadopago.com.br/developers/pt/docs/testing`);
      } else {
        console.log(`[MERCADO PAGO DEBUG] ✅ Email parece ser de test user`);
      }
    }
    
    console.log(`[MERCADO PAGO DEBUG] Validações OK`);
    
    // Configurar preços e tipos de licença
    const planConfig = {
      trial: { price: 0, title: 'Licença Voltris - Trial', months: 0 },
      pro: { price: 49.90, title: 'Licença Voltris - Pro', months: 1 },
      premium: { price: 99.90, title: 'Licença Voltris - Premium', months: 3 },
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
    
    // Criar registro de pagamento no banco ANTES de criar a preferência
    const { createClient: createSupabaseClient } = await import('@supabase/supabase-js');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    console.log(`[MERCADO PAGO DEBUG] Supabase configurado:`, {
      url: supabaseUrl ? 'presente' : 'AUSENTE',
      serviceKey: supabaseServiceKey ? 'presente' : 'AUSENTE',
    });
    
    const supabase = supabaseServiceKey 
      ? createSupabaseClient(supabaseUrl, supabaseServiceKey)
      : await createClient();
    
    let paymentRecord = null;
    
    try {
      console.log(`[MERCADO PAGO DEBUG] Criando registro de pagamento no banco...`);
      
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .insert({
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
    
    // URL do webhook (Mercado Pago notificará aqui quando houver mudanças)
    const webhookUrl = `${dominio}/api/webhook/mercadopago`;
    
    console.log(`[MERCADO PAGO DEBUG] Webhook URL configurada:`, webhookUrl);
    
    // Determine payer email with proper defaults
    let payerEmail = email || 'test@testuser.com';
    
    // If using production token but in test mode, force test email
    if (isAppUsrToken && !email) {
      payerEmail = 'test@testuser.com';
      console.warn(`[MERCADO PAGO DEBUG] ⚠️ Token de produção sem email - usando email de teste padrão`);
    }
    
    // Construir corpo da preferência
    const preferenceBody = {
      items: [
        {
          title: selectedPlan.title,
          quantity: 1,
          currency_id: 'BRL',
          unit_price: selectedPlan.price,
        }
      ],
      back_urls: {
        success: `${dominio}/sucesso`,
        failure: `${dominio}/falha`,
        pending: `${dominio}/falha`
      },
      auto_return: 'approved', // Automatically return to success URL when payment is approved
      notification_url: webhookUrl, // ✅ CRITICAL: Send webhook URL to Mercado Pago
      statement_descriptor: 'VOLTRIS',
      payer: {
        email: payerEmail,
      },
      external_reference: `voltris-${plan}-${Date.now()}`, // Unique reference for tracking
      payment_methods: {
        excluded_payment_types: [
          { id: 'account_money' }, // Remove saldo Mercado Pago - Força checkout como convidado
        ],
        installments: 12, // ✅ CRITICAL: Permite parcelamento até 12x
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

    // Atualizar registro com preference_id
    if (paymentRecord && response.id) {
      try {
        console.log(`[MERCADO PAGO DEBUG] Atualizando registro com preference_id...`);
        
        await supabase
          .from('payments')
          .update({ preference_id: response.id })
          .eq('id', paymentRecord.id);
        
        console.log(`[MERCADO PAGO DEBUG] Registro atualizado com sucesso`);
      } catch (updateError) {
        console.error('[MERCADO PAGO DEBUG] Erro ao atualizar preference_id:', updateError);
      }
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

    return new Response(JSON.stringify(frontendResponse), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    
    console.error(`[MERCADO PAGO DEBUG] ========== ERRO GERAL (${duration}ms) ==========`);
    console.error(`[MERCADO PAGO DEBUG] Mensagem:`, error.message);
    console.error(`[MERCADO PAGO DEBUG] Status:`, error.status || error.statusCode || 'não disponível');
    console.error(`[MERCADO PAGO DEBUG] Causa:`, error.cause || 'não disponível');
    console.error(`[MERCADO PAGO DEBUG] Stack:`, error.stack);
    console.error(`[MERCADO PAGO DEBUG] Erro completo:`, JSON.stringify(error, Object.getOwnPropertyNames(error), 2));

    return new Response(JSON.stringify({ 
      error: 'Failed to create payment preference', 
      details: error.message,
      request_id: requestId,
      debug: {
        cause: error.cause?.toString(),
        status: error.status,
        statusCode: error.statusCode,
      },
      stack: error.stack
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}