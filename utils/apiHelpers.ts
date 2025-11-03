/**
 * Utilitários para chamadas de API com parse seguro de JSON
 */

import { safeJsonParse, fetchWithSafeJson } from './safeJsonParse';

/**
 * Função para fazer fetch com tratamento de erro robusto
 */
export const safeFetch = async (
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
 * Função para fazer POST com dados JSON
 */
export const safePost = async (
  url: string, 
  data: unknown, 
  options: RequestInit = {}
): Promise<any> => {
  return safeFetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    ...options,
  });
};

/**
 * Função para fazer GET
 */
export const safeGet = async (
  url: string, 
  options: RequestInit = {}
): Promise<any> => {
  return safeFetch(url, {
    method: 'GET',
    ...options,
  });
};

/**
 * Função para fazer PUT com dados JSON
 */
export const safePut = async (
  url: string, 
  data: unknown, 
  options: RequestInit = {}
): Promise<any> => {
  return safeFetch(url, {
    method: 'PUT',
    body: JSON.stringify(data),
    ...options,
  });
};

/**
 * Função para fazer DELETE
 */
export const safeDelete = async (
  url: string, 
  options: RequestInit = {}
): Promise<any> => {
  return safeFetch(url, {
    method: 'DELETE',
    ...options,
  });
}; 