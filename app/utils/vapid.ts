// Utilitários para chaves VAPID
export const VAPID_KEYS = {
  // Chave pública VAPID válida (gerada com web-push)
  PUBLIC_KEY: 'BK4sNuzXs5c-gbWfD52SSWS3ft4kj8Q6BNYKwC2nc9_tsgki3CYnVKsXLTLcFmvpWYP-m9HvGnZAQwTJnRTH4sI',
  
  // Chave privada VAPID (não expor no cliente - use apenas no servidor)
  PRIVATE_KEY: '44N8AIXidbAylJT6ACgDm2J5vMfNdnu-b2aho9eSUZY'
};

// Função para converter chave VAPID base64 para Uint8Array
export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  
  return outputArray;
}

// Função para obter chave VAPID válida
export function getVapidPublicKey(): Uint8Array {
  try {
    return urlBase64ToUint8Array(VAPID_KEYS.PUBLIC_KEY);
  } catch (error) {
    console.error('❌ Erro ao converter chave VAPID:', error);
    throw new Error('Chave VAPID inválida');
  }
}

// Função para validar se a chave VAPID é válida
export function isValidVapidKey(key: string): boolean {
  try {
    const uint8Array = urlBase64ToUint8Array(key);
    return uint8Array.length > 0;
  } catch {
    return false;
  }
}
