/**
 * Função utilitária para normalizar URLs para https://www.voltris.com.br
 * Garante consistência em todo o projeto para SEO e IndexNow
 */

const CANONICAL_HOST = 'https://www.voltris.com.br';

export function normalizeUrl(url: string): string {
  try {
    // Se a URL já começar com o host canônico, retorna como está
    if (url.startsWith(CANONICAL_HOST)) {
      return url;
    }

    const urlObj = new URL(url);
    
    // Forçar HTTPS
    urlObj.protocol = 'https';
    
    // Forçar www.voltris.com.br
    urlObj.hostname = 'www.voltris.com.br';
    
    // Remover trailing slash
    const pathname = urlObj.pathname.replace(/\/$/, '') || '/';
    urlObj.pathname = pathname;
    
    return urlObj.toString();
  } catch (error) {
    // Se falhar ao parsear, assume que é um path relativo
    if (url.startsWith('/')) {
      return `${CANONICAL_HOST}${url}`;
    }
    return `${CANONICAL_HOST}/${url}`;
  }
}

export function getCanonicalUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const pathWithoutTrailingSlash = cleanPath.replace(/\/$/, '') || '/';
  return `${CANONICAL_HOST}${pathWithoutTrailingSlash}`;
}
