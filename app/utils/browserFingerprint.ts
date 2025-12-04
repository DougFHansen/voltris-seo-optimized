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
