/**
 * PagBank Client — via Cloudflare Worker Proxy
 *
 * O Vercel (AWS us-east-1) é bloqueado pelo Cloudflare do PagBank.
 * Solução: todas as chamadas passam pelo Worker da Cloudflare,
 * que roda em edge brasileiro e não é bloqueado.
 *
 * Worker URL: configurada em PAGBANK_PROXY_URL no Vercel.
 */

import { PagBankCheckoutRequest, PagBankCheckoutResponse } from '@/types/pagbank';

const PROXY_URL = process.env.PAGBANK_PROXY_URL; // ex: https://voltris-pagbank-proxy.SEU-USER.workers.dev
const PROXY_SECRET = process.env.PAGBANK_PROXY_SECRET;

if (!PROXY_URL) {
  console.warn('⚠️ PAGBANK_PROXY_URL não definida — chamadas ao PagBank vão falhar.');
}

/**
 * Faz uma chamada POST ao PagBank via proxy Worker.
 */
async function callPagBankViaProxy(endpoint: string, payload: any): Promise<any> {
  if (!PROXY_URL) {
    throw new Error('PAGBANK_PROXY_URL não configurada. Configure o Cloudflare Worker primeiro.');
  }

  const res = await fetch(PROXY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-proxy-secret': PROXY_SECRET || '',
    },
    body: JSON.stringify({ endpoint, payload }),
  });

  const text = await res.text();

  if (!res.ok) {
    let errData: any = {};
    try { errData = JSON.parse(text); } catch { errData = { raw: text }; }
    console.error(`[PAGBANK PROXY] Erro ${res.status}:`, errData);
    throw new Error(`PagBank Error (${res.status}): ${errData.error || text.substring(0, 200)}`);
  }

  return JSON.parse(text);
}

export async function createPaymentLink(data: any): Promise<any> {
  console.log('[PAGBANK] Criando payment link via proxy');
  return callPagBankViaProxy('/payment-links', data);
}

export async function createCheckout(data: PagBankCheckoutRequest): Promise<PagBankCheckoutResponse> {
  console.log('[PAGBANK] Criando checkout via proxy');
  return callPagBankViaProxy('/checkouts', data);
}

export async function createPlan(data: any): Promise<any> {
  console.log('[PAGBANK] Criando plano via proxy');
  return callPagBankViaProxy('/plans', data);
}

export function getPaymentLink(response: PagBankCheckoutResponse): string | undefined {
  const payLink = response.links?.find((link: any) => link.rel === 'PAY');
  return payLink?.href;
}
