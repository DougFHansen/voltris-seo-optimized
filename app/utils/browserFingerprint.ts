/**
 * Utilitário para gerar fingerprint único do navegador
 * Sistema profissional para identificação de dispositivos e gerenciamento de notificações PWA
 */

export interface BrowserInfo {
  userAgent: string;
  platform: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  language: string;
  timezone: string;
  screenResolution: string;
  colorDepth: number;
  hardwareConcurrency: number;
  maxTouchPoints: number;
  cookieEnabled: boolean;
  doNotTrack: string | null;
}

/**
 * Detecta o tipo de dispositivo baseado no user agent e características
 */
export function detectDeviceType(): 'desktop' | 'mobile' | 'tablet' {
  const userAgent = navigator.userAgent.toLowerCase();
  
  // Detectar tablet primeiro (mais específico)
  if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
    return 'tablet';
  }
  
  // Detectar mobile
  if (/mobile|android|iphone|ipod|blackberry|opera mini|windows phone/i.test(userAgent)) {
    return 'mobile';
  }
  
  // Padrão é desktop
  return 'desktop';
}

/**
 * Detecta a plataforma do sistema operacional
 */
export function detectPlatform(): string {
  const userAgent = navigator.userAgent;
  const platform = navigator.platform;
  
  if (/Windows/i.test(userAgent)) return 'Windows';
  if (/Mac/i.test(userAgent)) return 'macOS';
  if (/Linux/i.test(userAgent)) return 'Linux';
  if (/Android/i.test(userAgent)) return 'Android';
  if (/iPhone|iPad|iPod/i.test(userAgent)) return 'iOS';
  if (/Chrome OS/i.test(userAgent)) return 'Chrome OS';
  
  return platform || 'Unknown';
}

/**
 * Coleta informações detalhadas do navegador
 */
export function collectBrowserInfo(): BrowserInfo {
  return {
    userAgent: navigator.userAgent,
    platform: detectPlatform(),
    deviceType: detectDeviceType(),
    language: navigator.language || 'en-US',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    screenResolution: `${screen.width}x${screen.height}`,
    colorDepth: screen.colorDepth,
    hardwareConcurrency: navigator.hardwareConcurrency || 0,
    maxTouchPoints: navigator.maxTouchPoints || 0,
    cookieEnabled: navigator.cookieEnabled,
    doNotTrack: navigator.doNotTrack
  };
}

/**
 * Gera um fingerprint único baseado nas características do navegador
 * Usa uma combinação de características estáveis para identificação
 */
export function generateBrowserFingerprint(): string {
  const info = collectBrowserInfo();
  
  // Características mais estáveis para fingerprint
  const stableFeatures = [
    info.platform,
    info.deviceType,
    info.screenResolution,
    info.colorDepth,
    info.hardwareConcurrency,
    info.maxTouchPoints,
    info.cookieEnabled
  ].join('|');
  
  // Gerar hash simples (em produção, usar crypto.subtle.digest)
  let hash = 0;
  for (let i = 0; i < stableFeatures.length; i++) {
    const char = stableFeatures.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(36) + Date.now().toString(36);
}

/**
 * Gera fingerprint mais robusto usando Web Crypto API (quando disponível)
 */
export async function generateSecureBrowserFingerprint(): Promise<string> {
  try {
    if ('crypto' in window && 'subtle' in crypto) {
      const info = collectBrowserInfo();
      const stableFeatures = [
        info.platform,
        info.deviceType,
        info.screenResolution,
        info.colorDepth,
        info.hardwareConcurrency,
        info.maxTouchPoints,
        info.cookieEnabled
      ].join('|');
      
      const encoder = new TextEncoder();
      const data = encoder.encode(stableFeatures);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      return hashHex.substring(0, 16); // Retorna apenas os primeiros 16 caracteres
    }
  } catch (error) {
    console.warn('Web Crypto API não disponível, usando fallback:', error);
  }
  
  // Fallback para navegadores mais antigos
  return generateBrowserFingerprint();
}

/**
 * Verifica se o fingerprint é válido
 */
export function isValidFingerprint(fingerprint: string): boolean {
  return typeof fingerprint === 'string' && 
         fingerprint.length >= 8 && 
         fingerprint.length <= 64;
}

/**
 * Gera um ID único para sessão (mais volátil que fingerprint)
 */
export function generateSessionId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

/**
 * Verifica se o navegador suporta notificações push
 */
export function supportsPushNotifications(): boolean {
  return 'serviceWorker' in navigator && 
         'PushManager' in window && 
         'Notification' in window;
}

/**
 * Verifica se o navegador suporta PWA
 */
export function supportsPWA(): boolean {
  return 'serviceWorker' in navigator && 
         'PushManager' in window && 
         'Notification' in window &&
         'beforeinstallprompt' in window;
}

/**
 * Obtém informações de compatibilidade do navegador
 */
export function getBrowserCompatibility(): {
  pushNotifications: boolean;
  pwa: boolean;
  serviceWorker: boolean;
  webPush: boolean;
} {
  return {
    pushNotifications: 'Notification' in window,
    pwa: supportsPWA(),
    serviceWorker: 'serviceWorker' in navigator,
    webPush: 'PushManager' in window
  };
}

/**
 * Extrai informações detalhadas do navegador para notificações
 */
export function getBrowserNotificationInfo(): {
  browser: string;
  version: string;
  engine: string;
  os: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  language: string;
  timezone: string;
  screenResolution: string;
  platform: string;
  isMobile: boolean;
  isBot: boolean;
} {
  const userAgent = navigator.userAgent;
  
  // Detecção de navegador
  let browser = 'Unknown';
  let version = 'Unknown';
  let engine = 'Unknown';
  
  // Chrome/Chromium
  if (/Chrome/.test(userAgent) && !/Chromium|Edge|OPR|Opera/.test(userAgent)) {
    browser = 'Chrome';
    const match = userAgent.match(/Chrome\/(\d+)/);
    version = match ? match[1] : 'Unknown';
    engine = 'Blink';
  }
  // Firefox
  else if (/Firefox/.test(userAgent)) {
    browser = 'Firefox';
    const match = userAgent.match(/Firefox\/(\d+)/);
    version = match ? match[1] : 'Unknown';
    engine = 'Gecko';
  }
  // Safari
  else if (/Safari/.test(userAgent) && !/Chrome|Chromium|Edge|OPR|Opera/.test(userAgent)) {
    browser = 'Safari';
    const match = userAgent.match(/Version\/(\d+)/);
    version = match ? match[1] : 'Unknown';
    engine = 'WebKit';
  }
  // Edge
  else if (/Edge/.test(userAgent)) {
    browser = 'Edge';
    const match = userAgent.match(/Edge\/(\d+)/);
    version = match ? match[1] : 'Unknown';
    engine = 'Blink';
  }
  // Opera
  else if (/OPR|Opera/.test(userAgent)) {
    browser = 'Opera';
    const match = userAgent.match(/(?:OPR|Opera)\/(\d+)/);
    version = match ? match[1] : 'Unknown';
    engine = 'Blink';
  }
  
  // Detecção de sistema operacional
  let os = 'Unknown';
  if (/Windows/.test(userAgent)) {
    if (/Windows NT 10/.test(userAgent)) os = 'Windows 10/11';
    else if (/Windows NT 6\.3/.test(userAgent)) os = 'Windows 8.1';
    else if (/Windows NT 6\.2/.test(userAgent)) os = 'Windows 8';
    else if (/Windows NT 6\.1/.test(userAgent)) os = 'Windows 7';
    else os = 'Windows';
  } else if (/Mac OS X/.test(userAgent)) {
    os = 'macOS';
  } else if (/Linux/.test(userAgent)) {
    os = 'Linux';
  } else if (/Android/.test(userAgent)) {
    os = 'Android';
  } else if (/iOS|iPhone|iPad|iPod/.test(userAgent)) {
    os = 'iOS';
  }
  
  // Detecção de bots
  const botPatterns = [
    /googlebot/i, /bingbot/i, /slurp/i, /duckduckbot/i,
    /baiduspider/i, /yandexbot/i, /facebookexternalhit/i,
    /twitterbot/i, /rogerbot/i, /linkedinbot/i, /embedly/i,
    /quora link preview/i, /showyoubot/i, /outbrain/i,
    /pinterest\/0\.1/i, /developers\.google\.com\/\+\/web\/snippet/i
  ];
  
  const isBot = botPatterns.some(pattern => pattern.test(userAgent));
  
  return {
    browser,
    version,
    engine,
    os,
    deviceType: detectDeviceType(),
    language: navigator.language || 'en-US',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    screenResolution: `${screen.width}x${screen.height}`,
    platform: detectPlatform(),
    isMobile: /mobile|android|iphone|ipod|blackberry|opera mini|windows phone/i.test(userAgent),
    isBot
  };
}
