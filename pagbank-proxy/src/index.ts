/**
 * VOLTRIS — PagBank Proxy Worker
 * Roda no edge da Cloudflare com IPs brasileiros.
 * Recebe requisições do Vercel e as repassa ao PagBank,
 * evitando o bloqueio de IP de datacenter AWS.
 */

export interface Env {
  PAGBANK_TOKEN: string;       // Token do PagBank (secret no CF dashboard)
  PROXY_SECRET: string;        // Segredo compartilhado com o Vercel
  PAGBANK_ENV: string;         // "sandbox" | "production"
}

const PAGBANK_URLS: Record<string, string> = {
  production: 'https://api.pagseguro.com',
  sandbox:    'https://sandbox.api.pagseguro.com',
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Só aceita POST
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    // Verificar segredo para evitar uso indevido do proxy
    const proxySecret = request.headers.get('x-proxy-secret');
    if (!proxySecret || proxySecret !== env.PROXY_SECRET) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Ler body da requisição
    let body: any;
    try {
      body = await request.json();
    } catch {
      return new Response('Invalid JSON', { status: 400 });
    }

    // Extrair endpoint alvo (ex: "/payment-links", "/checkouts")
    const { endpoint, payload } = body;
    if (!endpoint || !payload) {
      return new Response('Missing endpoint or payload', { status: 400 });
    }

    const baseUrl = PAGBANK_URLS[env.PAGBANK_ENV] ?? PAGBANK_URLS['sandbox'];
    const targetUrl = `${baseUrl}${endpoint}`;

    // Repassar ao PagBank
    try {
      const pagbankRes = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.PAGBANK_TOKEN}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          // Disfarçando o Worker como um navegador real para evitar bloqueio WAF do PagBank
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Referer': 'https://voltris.com.br/',
          'Origin': 'https://voltris.com.br'
        },
        body: JSON.stringify(payload),
      });

      const responseText = await pagbankRes.text();

      // Detectar bloqueio Cloudflare (resposta HTML inesperada)
      if (responseText.includes('<!DOCTYPE') || responseText.includes('Cloudflare')) {
        console.error('[PROXY] PagBank retornou HTML — possível bloqueio');
        return new Response(
          JSON.stringify({ error: 'PagBank bloqueou a requisição', raw: responseText.substring(0, 200) }),
          { status: 502, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Repassar resposta original do PagBank
      return new Response(responseText, {
        status: pagbankRes.status,
        headers: { 'Content-Type': 'application/json' },
      });

    } catch (err: any) {
      console.error('[PROXY] Erro ao chamar PagBank:', err.message);
      return new Response(
        JSON.stringify({ error: 'Proxy error', message: err.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  },
};
