/**
 * Configuração centralizada do Mercado Pago
 * Gerencia ambientes, tokens e modos de teste
 */

// Ambiente atual (sandbox ou production)
const ENVIRONMENT = process.env.MERCADOPAGO_ENV || 'sandbox';

// Modo de teste em produção (R$ 1,00)
const IS_PROD_TEST = process.env.PROD_TEST === 'true';

/**
 * Seleciona token correto baseado no ambiente
 */
function getAccessToken() {
  if (ENVIRONMENT === 'production') {
    const token = process.env.MERCADOPAGO_ACCESS_TOKEN_PROD;
    
    if (!token) {
      throw new Error('🔴 CRÍTICO: Token de produção não configurado no Vercel');
    }
    
    console.log('🔐 [MP CONFIG] Usando token de PRODUÇÃO');
    return token;
  }
  
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN_SANDBOX;
  
  if (!token) {
    throw new Error('🔴 CRÍTICO: Token de sandbox não configurado no Vercel');
  }
  
  console.log('🔐 [MP CONFIG] Usando token de SANDBOX');
  return token;
}

/**
 * Retorna configuração do produto baseado no ambiente e modo
 */
function getProductConfig(plan) {
  const planConfig = {
    trial: { price: 0.01, title: 'Licença Voltris - Trial', months: 0 },
    pro: { price: 49.90, title: 'Licença Voltris - Pro', months: 1 },
    premium: { price: 99.90, title: 'Licença Voltris - Premium', months: 3 },
  };
  
  const config = planConfig[plan] || planConfig.pro;
  
  // Se PROD_TEST ativo, forçar R$ 1,00
  if (IS_PROD_TEST && ENVIRONMENT === 'production') {
    console.log('🧪 [MP CONFIG] MODO PROD_TEST ATIVO - Valor alterado para R$ 1,00');
    
    return {
      price: 1.00,
      title: '⚠️ TESTE INTERNO - NÃO COBRAR CLIENTE',
      months: 0,
      description: 'Teste de integração - Valor simbólico R$ 1,00',
    };
  }
  
  return {
    ...config,
    description: `Licença ${plan} - ${config.months} ${config.months === 1 ? 'mês' : 'meses'}`,
  };
}

/**
 * Retorna external_reference único
 */
function getExternalReference(plan) {
  const timestamp = Date.now();
  const prefix = IS_PROD_TEST ? 'PROD_TEST' : 'voltris';
  const env = ENVIRONMENT === 'production' ? 'PROD' : 'SANDBOX';
  
  return `${prefix}-${env}-${plan}-${timestamp}`;
}

/**
 * Configuração de payment_methods
 * Remove saldo em conta para forçar checkout sem login
 */
function getPaymentMethodsConfig() {
  const config = {
    installments: 12,
    default_installments: 1,
  };
  
  // Forçar checkout SEM login (sem saldo em conta)
  if (ENVIRONMENT === 'production' || IS_PROD_TEST) {
    console.log('🚫 [MP CONFIG] Removendo saldo em conta - Forçando checkout sem login');
    
    config.excluded_payment_types = [
      { id: 'account_money' }, // Remove saldo Mercado Pago
    ];
  }
  
  return config;
}

/**
 * Seleciona init_point correto baseado no ambiente
 */
function getInitPoint(response) {
  if (ENVIRONMENT === 'sandbox') {
    console.log('🔗 [MP CONFIG] Usando SANDBOX init_point');
    return response.sandbox_init_point || response.init_point;
  }
  
  console.log('🔗 [MP CONFIG] Usando PRODUCTION init_point');
  return response.init_point;
}

/**
 * Logs de segurança e auditoria
 */
function logTransactionDetails(plan, config, externalRef) {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 [MP CONFIG] DETALHES DA TRANSAÇÃO');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`🌍 Ambiente: ${ENVIRONMENT.toUpperCase()}`);
  console.log(`🧪 Modo Teste: ${IS_PROD_TEST ? 'ATIVO (R$ 1,00)' : 'INATIVO'}`);
  console.log(`📦 Plano: ${plan}`);
  console.log(`💰 Valor: R$ ${config.price.toFixed(2)}`);
  console.log(`🏷️  Título: ${config.title}`);
  console.log(`🔖 Reference: ${externalRef}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

/**
 * Validações de segurança
 */
function validateSecurity() {
  // Impedir token de produção em sandbox
  if (ENVIRONMENT === 'sandbox' && process.env.MERCADOPAGO_ACCESS_TOKEN_PROD) {
    const prodToken = process.env.MERCADOPAGO_ACCESS_TOKEN_PROD;
    const sandboxToken = process.env.MERCADOPAGO_ACCESS_TOKEN_SANDBOX;
    
    if (prodToken === sandboxToken) {
      throw new Error('🔴 CRÍTICO: Mesmo token configurado para sandbox e produção');
    }
  }
  
  // Alertar se PROD_TEST ativo em produção
  if (IS_PROD_TEST && ENVIRONMENT === 'production') {
    console.warn('⚠️  [MP CONFIG] ATENÇÃO: PROD_TEST ATIVO EM PRODUÇÃO');
    console.warn('⚠️  Apenas transações de R$ 1,00 serão criadas');
    console.warn('⚠️  Desative antes de liberar para usuários finais');
  }
  
  console.log('✅ [MP CONFIG] Validações de segurança OK');
}

module.exports = {
  ENVIRONMENT,
  IS_PROD_TEST,
  getAccessToken,
  getProductConfig,
  getExternalReference,
  getPaymentMethodsConfig,
  getInitPoint,
  logTransactionDetails,
  validateSecurity,
};
