import axios from 'axios';

/**
 * PagSeguro Legacy Client (V2)
 * 
 * Esta API é mais estável contra bloqueios de Firewall/WAF
 * pois é usada por milhões de integrações legadas.
 */

const PAGBANK_ENV = process.env.PAGBANK_ENV || 'sandbox';
const BASE_URL = PAGBANK_ENV === 'production'
    ? 'https://ws.pagseguro.uol.com.br/v2/checkout'
    : 'https://ws.sandbox.pagseguro.uol.com.br/v2/checkout';

const REDIRECT_URL = PAGBANK_ENV === 'production'
    ? 'https://pagseguro.uol.com.br/v2/checkout/payment.html'
    : 'https://sandbox.pagseguro.uol.com.br/v2/checkout/payment.html';

const EMAIL = 'douglasfelipebecker@gmail.com';
const TOKEN = process.env.PAGBANK_TOKEN;

/**
 * Cria um código de checkout usando a API V2 (Legada)
 * Retorna a URL de redirecionamento final.
 */
export async function createLegacyCheckout(data: any): Promise<string> {
    try {
        console.log(`[PAGSEGURO V2] Iniciando checkout para ${data.customer_email}`);

        // Converter o payload JSON para x-www-form-urlencoded (formato da v2)
        const params = new URLSearchParams();
        params.append('email', EMAIL);
        params.append('token', TOKEN || '');
        params.append('currency', 'BRL');
        params.append('reference', data.reference_id);
        
        // Itens
        data.items.forEach((item: any, index: number) => {
            const i = index + 1;
            params.append(`itemId${i}`, item.reference_id || `item${i}`);
            params.append(`itemDescription${i}`, item.name);
            params.append(`itemAmount${i}`, (item.unit_amount / 100).toFixed(2));
            params.append(`itemQuantity${i}`, item.quantity.toString());
        });

        // Cliente
        params.append('senderName', data.customer_name || 'Cliente Voltris');
        params.append('senderEmail', data.customer_email);
        
        // URLs
        params.append('redirectURL', data.redirect_url);
        params.append('notificationURL', data.notification_url);

        const response = await axios.post(BASE_URL, params.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=ISO-8859-1',
                // User agent genérico para evitar WAF
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        // A API V2 responde em XML. Vamos extrair o <code> usando Regex simples
        const match = response.data.match(/<code>(.*?)<\/code>/);
        if (match && match[1]) {
            const code = match[1];
            console.log(`[PAGSEGURO V2] Código gerado: ${code}`);
            return `${REDIRECT_URL}?code=${code}`;
        }

        throw new Error(`Resposta inválida do PagSeguro: ${response.data}`);

    } catch (error: any) {
        if (error.response) {
            console.error('[PAGSEGURO V2 ERROR]', error.response.data);
            throw new Error(`Erro PagSeguro V2: ${error.response.status}`);
        }
        throw error;
    }
}

// Helpers para compatibilidade
export function getPaymentLink(code: string): string {
    return code; // Na v2 a função já retorna a URL completa
}
