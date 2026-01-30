import { NextRequest, NextResponse } from 'next/server';

const INDEXNOW_KEY = 'b3ea85422343fbf303fc4e7243937093';
const KEY_LOCATION = 'https://voltris.com.br/b3ea85422343fbf303fc4e7243937093.txt';
const HOST = 'voltris.com.br';
const BING_INDEXNOW_URL = 'https://www.bing.com/indexnow';
const YANDEX_INDEXNOW_URL = 'https://yandex.com/indexnow';

/**
 * POST /api/indexnow
 * Envia URLs para IndexNow (Bing, Yandex e outros).
 * Body opcional: { "urlList": ["https://voltris.com.br/...", ...] }
 * Se urlList não for enviado, envia a homepage e sitemap para notificar atualização.
 */
export async function POST(request: NextRequest) {
  try {
    let urlList: string[] = [];
    const body = await request.json().catch(() => ({}));
    if (Array.isArray(body.urlList) && body.urlList.length > 0) {
      urlList = body.urlList.filter(
        (u: string) => typeof u === 'string' && (u === 'https://voltris.com.br' || u.startsWith('https://voltris.com.br/'))
      );
    }
    if (urlList.length === 0) {
      urlList = [
        'https://voltris.com.br',
        'https://voltris.com.br/sitemap.xml',
      ];
    }
    if (urlList.length > 10000) {
      return NextResponse.json(
        { error: 'Máximo 10.000 URLs por requisição' },
        { status: 400 }
      );
    }

    const payload = {
      host: HOST,
      key: INDEXNOW_KEY,
      keyLocation: KEY_LOCATION,
      urlList,
    };

    const [bingRes, yandexRes] = await Promise.allSettled([
      fetch(BING_INDEXNOW_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(payload),
      }),
      fetch(YANDEX_INDEXNOW_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(payload),
      }),
    ]);

    const bingOk = bingRes.status === 'fulfilled' && (bingRes.value.status === 200 || bingRes.value.status === 202);
    const yandexOk = yandexRes.status === 'fulfilled' && (yandexRes.value.status === 200 || yandexRes.value.status === 202);

    return NextResponse.json({
      success: bingOk || yandexOk,
      submitted: urlList.length,
      bing: bingOk ? 'ok' : (bingRes.status === 'rejected' ? 'error' : (bingRes as PromiseFulfilledResult<Response>).value?.status),
      yandex: yandexOk ? 'ok' : (yandexRes.status === 'rejected' ? 'error' : (yandexRes as PromiseFulfilledResult<Response>).value?.status),
    });
  } catch (e) {
    return NextResponse.json({ error: 'Erro ao enviar IndexNow', details: String(e) }, { status: 500 });
  }
}
