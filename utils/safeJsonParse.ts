/**
 * Utilitário para fazer parse seguro de JSON
 * Verifica se a resposta é realmente JSON antes de tentar fazer o parse
 */

export const safeJsonParse = async (response: Response): Promise<any> => {
  try {
    // Verificar se a resposta é OK
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Verificar o content-type
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      // Se não for JSON, tentar ler como texto para debug
      const text = await response.text();
      // Primeiros 200 caracteres para debug
      // (pode logar ou tratar aqui se necessário)
      throw new Error(`Resposta não é JSON. Content-Type: ${contentType}`);
    }

    // Tentar fazer parse do JSON
    return await response.json();
  } catch (error) {
    throw error;
  }
};

/**
 * Função para fazer fetch com parse seguro de JSON
 */
export const fetchWithSafeJson = async (
  url: string, 
  options: RequestInit = {}
): Promise<any> => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    return await safeJsonParse(response);
  } catch (error) {
    
    throw error;
  }
};

/**
 * Função para verificar se uma string é JSON válido
 */
export const isValidJson = (str: string): boolean => {
  try {
    JSON.parse(str);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Função para fazer parse seguro de string JSON
 */
export const safeParseJsonString = (str: string, fallback: unknown = null): unknown => {
  try {
    if (!str || typeof str !== 'string') {
      return fallback;
    }
    // Verificar se começa com HTML
    if (str.trim().startsWith('<!DOCTYPE') || str.trim().startsWith('<html')) {
      return fallback;
    }
    return JSON.parse(str);
  } catch (error) {
    return fallback;
  }
}; 