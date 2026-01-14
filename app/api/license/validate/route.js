import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const licenseKey = searchParams.get('key');
  
  if (!licenseKey) {
    return NextResponse.json(
      { error: 'Chave de licença não fornecida' },
      { status: 400 }
    );
  }

  // Para testes, retornar licença válida
  if (licenseKey === 'VOLTRIS-LIC-TESTE-20260113-ABC123DEF456') {
    return NextResponse.json({
      valid: true,
      license: {
        key: licenseKey,
        type: 'pro',
        maxDevices: 3,
        email: 'teste@voltris.com.br',
        activatedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
      }
    });
  }

  return NextResponse.json(
    { 
      valid: false, 
      error: 'Licença não encontrada ou inválida',
      code: 'LICENSE_NOT_FOUND'
    },
    { status: 404 }
  );
}

export async function POST(request: Request) {
  const body = await request.json();
  const licenseKey = body.key || body.license_key;
  
  if (!licenseKey) {
    return NextResponse.json(
      { error: 'Chave de licença não fornecida' },
      { status: 400 }
    );
  }

  // Para testes, retornar licença válida
  if (licenseKey === 'VOLTRIS-LIC-TESTE-20260113-ABC123DEF456') {
    return NextResponse.json({
      valid: true,
      license: {
        key: licenseKey,
        type: 'pro',
        maxDevices: 3,
        email: 'teste@voltris.com.br',
        activatedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
      }
    });
  }

  return NextResponse.json(
    { 
      valid: false, 
      error: 'Licença não encontrada ou inválida',
      code: 'LICENSE_NOT_FOUND'
    },
    { status: 404 }
  );
}