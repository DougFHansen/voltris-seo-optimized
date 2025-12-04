// Configuração centralizada do Google AdSense
export const ADSENSE_CONFIG = {
  // ID do publicador
  PUBLISHER_ID: 'ca-pub-9217408182316735',
  
  // Slots de anúncios
  AD_SLOTS: {
    BANNER: '3007424757',
    SIDEBAR: '3007424758', // Se você tiver outros slots
    IN_ARTICLE: '3007424759', // Se você tiver outros slots
  },
  
  // Configurações padrão
  DEFAULT_CONFIG: {
    format: 'auto',
    fullWidthResponsive: true,
    adTest: process.env.NODE_ENV === 'development' ? 'on' : 'off',
  },
  
  // Domínios permitidos pelo CSP
  ALLOWED_DOMAINS: [
    'pagead2.googlesyndication.com',
    'googleads.g.doubleclick.net',
    'tpc.googlesyndication.com',
    'securepubads.g.doubleclick.net',
    'fundingchoicesmessages.google.com',
    'ep1.adtrafficquality.google',
    'ep2.adtrafficquality.google',
    'www.google.com',
    'www.youtube.com',
    'www.googletagmanager.com',
  ],
  
  // Configurações de teste
  TESTING: {
    ENABLED: process.env.NODE_ENV === 'development',
    TIMEOUT: 5000, // 5 segundos para carregar anúncios de teste
  },
  
  // Configurações de fallback
  FALLBACK: {
    ENABLED: true,
    MIN_HEIGHT: 90,
    PLACEHOLDER_TEXT: 'Carregando anúncio...',
    ERROR_TEXT: 'Anúncio não disponível',
  },
};

// Função para verificar se o AdSense está disponível
export const isAdSenseAvailable = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!window.adsbygoogle && Array.isArray(window.adsbygoogle);
};

// Função para verificar se estamos em um ambiente de produção
export const isProduction = (): boolean => {
  return process.env.NODE_ENV === 'production';
};

// Função para verificar se o domínio está aprovado
export const isDomainApproved = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const currentDomain = window.location.hostname;
  const isLocalhost = currentDomain === 'localhost' || currentDomain === '127.0.0.1';
  const isVercel = currentDomain.includes('vercel.app');
  
  // Em desenvolvimento, sempre retorna false
  if (isLocalhost) return false;
  
  // Em produção, verifica se não é um domínio temporário
  if (isProduction() && isVercel) return false;
  
  return true;
};

// Função para carregar um anúncio
export const loadAdSenseAd = (slot: string, config: any = {}): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!isAdSenseAvailable()) {
      reject(new Error('AdSense não está disponível'));
      return;
    }
    
    if (!isDomainApproved()) {
      reject(new Error('Domínio não está aprovado para AdSense'));
      return;
    }
    
    try {
      const adConfig = {
        ...ADSENSE_CONFIG.DEFAULT_CONFIG,
        ...config,
      };
      
      (window.adsbygoogle = window.adsbygoogle || []).push(adConfig);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};
