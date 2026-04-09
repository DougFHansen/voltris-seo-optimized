import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const apiKey = '48b7f52550194833a697771746200259';
    const host = 'voltris.com.br';
    const keyLocation = `https://${host}/${apiKey}.txt`;

    // Test URLs para submissão
    const testUrls = [
      'https://voltris.com.br/',
      'https://voltris.com.br/guias/ssd-vs-hdd-guia',
      'https://voltris.com.br/voltrisoptimizer'
    ];

    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'User-Agent': 'Voltris-IndexNow-Test/1.0'
      },
      body: JSON.stringify({
        host,
        key: apiKey,
        keyLocation,
        urlList: testUrls,
      }),
    });

    const responseText = await response.text();
    
    return NextResponse.json({
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      response: responseText,
      apiKey: apiKey,
      keyLocation: keyLocation,
      testUrls: testUrls
    });

  } catch (error) {
    console.error('IndexNow Test Error:', error);
    return NextResponse.json({ 
      error: 'Test failed', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
