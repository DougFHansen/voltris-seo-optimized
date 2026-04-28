import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { urlList } = body;

    if (!urlList || !Array.isArray(urlList)) {
      return NextResponse.json({ error: 'Invalid URL list' }, { status: 400 });
    }

    const apiKey = 'dc9bd7eedab94ddca8eb96ea792838d4';
    const host = 'voltris.com.br';
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
        urlList,
      }),
    });

    if (response.ok) {
      return NextResponse.json({ success: true, message: 'Submitted to IndexNow' });
    } else {
      const errorText = await response.text();
      return NextResponse.json({ error: 'IndexNow submission failed', details: errorText }, { status: response.status });
    }
  } catch (error) {
    console.error('IndexNow Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
