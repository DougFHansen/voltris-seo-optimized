import axios from 'axios';
import { PagBankCheckoutRequest, PagBankCheckoutResponse } from '@/types/pagbank';

const PAGBANK_ENV = process.env.PAGBANK_ENV || 'sandbox';
const BASE_URL = PAGBANK_ENV === 'production'
    ? 'https://api.pagseguro.com'
    : 'https://sandbox.api.pagseguro.com';

const SUBSCRIPTIONS_URL = PAGBANK_ENV === 'production'
    ? 'https://api.assinaturas.pagseguro.com'
    : 'https://sandbox.api.assinaturas.pagseguro.com';

const TOKEN = process.env.PAGBANK_TOKEN;

if (!TOKEN) {
    console.warn('⚠️ PAGBANK_TOKEN não está definido nas variáveis de ambiente.');
}

export const pagBankClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Voltris/1.0 (Integration; next.js; app-router)'
    },
    timeout: 30000, // 30 segundos
});

export async function createPlan(data: any): Promise<any> {
    try {
        const response = await axios.post(`${SUBSCRIPTIONS_URL}/plans`, data, {
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
                'Content-Type': 'application/json',
                'User-Agent': 'Voltris/1.0'
            }
        });
        return response.data;
    } catch (error: any) {
        console.error('PagBank Plan Error:', JSON.stringify(error.response?.data || error.message, null, 2));
        throw error;
    }
}

export async function createPaymentLink(data: any): Promise<any> {
    try {
        console.log('[PAGBANK] Criando link de pagamento (fallback v3)');
        const response = await pagBankClient.post('/payment-links', data);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            console.error('PagBank Link Error:', JSON.stringify(error.response.data, null, 2));
            throw new Error(`PagBank Link Error: ${JSON.stringify(error.response.data)}`);
        }
        throw error;
    }
}

export async function createCheckout(data: PagBankCheckoutRequest): Promise<PagBankCheckoutResponse> {
    try {
        const response = await pagBankClient.post<PagBankCheckoutResponse>('/checkouts', data, {
            headers: { 'x-api-version': '4.0' } // Checkout v4 exige este header
        });
        return response.data;
    } catch (error: unknown) {
        // Melhor tratamento de erro para debug
        const err = error as any;
        if (err.response) {
            console.error('PagBank API Error:', JSON.stringify(err.response.data, null, 2));
            throw new Error(`PagBank Error: ${JSON.stringify(err.response.data)}`);
        }
        throw error;
    }
}

export function getPaymentLink(response: PagBankCheckoutResponse): string | undefined {
    const payLink = response.links.find(link => link.rel === 'PAY');
    return payLink?.href;
}
