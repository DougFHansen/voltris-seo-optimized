import { NextRequest, NextResponse } from 'next/server';
import { normalizeUrl } from '@/lib/url-normalizer';

// URLs que NÃO devem ser enviadas ao IndexNow
const BLOCKED_PATTERNS = [
  '/dashboard/',
  '/api/',
  '/admin/',
  '/restricted-area-admin/',
  '/auth/',
  '/private/',
  '/debug/',
  '/debug-commands',
  '/debug-link',
  '/test-commands',
  '/blog/',
  '/processo/',
  '/perfil',
  '/reset-password',
  '/cluster-conteudo',
  '/integracao-servicos',
  '/reembolso-cancelamento',
  '/pix-limitacao',
  '/indexnow-test',
];

function shouldIndexUrl(url: string): boolean {
  // Verificar se URL corresponde a algum padrão bloqueado
  for (const pattern of BLOCKED_PATTERNS) {
    if (url.includes(pattern)) {
      return false;
    }
  }
  
  // Verificar se é URL válida do domínio (apenas www.voltris.com.br)
  try {
    const urlObj = new URL(url);
    return urlObj.hostname === 'www.voltris.com.br';
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { urlList } = body;

    if (!urlList || !Array.isArray(urlList)) {
      return NextResponse.json({ error: 'Invalid URL list' }, { status: 400 });
    }

    // Normalizar URLs para www.voltris.com.br
    const normalizedUrls = urlList.map(normalizeUrl);
    
    // Aplicar filtro de qualidade
    const filteredUrls = normalizedUrls.filter(shouldIndexUrl);

    if (filteredUrls.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'No valid URLs to submit after filtering',
        filtered: 0,
        total: urlList.length
      }, { status: 400 });
    }

    // Limitar a 50 URLs por requisição (controle de frequência)
    const urlsToSubmit = filteredUrls.slice(0, 50);

    const apiKey = '48b7f52550194833a697771746200259';
    const host = 'www.voltris.com.br';
    const keyLocation = `https://${host}/${apiKey}.txt`;

    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        host,
        key: apiKey,
        keyLocation,
        urlList: urlsToSubmit,
      }),
    });

    if (response.ok) {
      return NextResponse.json({ 
        success: true, 
        message: 'Submitted to IndexNow',
        submitted: urlsToSubmit.length,
        filtered: filteredUrls.length,
        total: urlList.length
      });
    } else {
      const errorText = await response.text();
      return NextResponse.json({ error: 'IndexNow submission failed', details: errorText }, { status: response.status });
    }
  } catch (error) {
    console.error('IndexNow Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
