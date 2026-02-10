import axios from 'axios';
import { PagBankCheckoutRequest, PagBankCheckoutResponse } from '@/types/pagbank';

const PAGBANK_ENV = process.env.PAGBANK_ENV || 'sandbox';
const BASE_URL = PAGBANK_ENV === 'production'
    ? 'https://api.pagseguro.com'
    : 'https://sandbox.api.pagseguro.com';

const TOKEN = process.env.PAGBANK_TOKEN;

if (!TOKEN) {
    console.warn('⚠️ PAGBANK_TOKEN não está definido nas variáveis de ambiente.');
}

export const pagBankClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
        'x-api-version': '4.0',
    },
    timeout: 30000, // 30 segundos
});

export async function createCheckout(data: PagBankCheckoutRequest): Promise<PagBankCheckoutResponse> {
    try {
        const response = await pagBankClient.post<PagBankCheckoutResponse>('/checkouts', data);
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
