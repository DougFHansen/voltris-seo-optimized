// Utilitários para chaves VAPID
// SEGURANÇA: A chave pública VAPID é segura para expor no cliente (é pública por design).
// A chave PRIVADA NUNCA deve estar aqui — ela fica apenas em VAPID_PRIVATE_KEY no servidor.
export const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';

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

// Função para obter chave VAPID pública como Uint8Array
export function getVapidPublicKey(): Uint8Array {
  if (!VAPID_PUBLIC_KEY) {
    throw new Error('NEXT_PUBLIC_VAPID_PUBLIC_KEY não configurada');
  }
  try {
    return urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
  } catch (error) {
    console.error('Erro ao converter chave VAPID:', error);
    throw new Error('Chave VAPID inválida');
  }
}

export function isValidVapidKey(key: string): boolean {
  try {
    const uint8Array = urlBase64ToUint8Array(key);
    return uint8Array.length > 0;
  } catch {
    return false;
  }
}
