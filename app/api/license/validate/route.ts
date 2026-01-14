import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const maxDuration = 10;

/**
 * Endpoint para validação de licenças do aplicativo desktop
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const licenseKey = body.license_key || body.key;
    
    if (!licenseKey) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'license_key é obrigatória' 
        }, 
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Servidor não configurado' 
        }, 
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Buscar licença no banco
    const { data: license, error } = await supabase
      .from('licenses')
      .select('*')
      .eq('license_key', licenseKey)
      .single();

    if (error || !license) {
      return NextResponse.json({
        success: false,
        error: 'Licença não encontrada ou inválida',
        code: 'LICENSE_NOT_FOUND'
      });
    }

    // Verificar se a licença expirou
    const expiresAt = new Date(license.expires_at);
    const now = new Date();
    
    if (now > expiresAt) {
      return NextResponse.json({
        success: false,
        error: 'Licença expirada',
        code: 'LICENSE_EXPIRED'
      });
    }

    // Retornar dados da licença
    return NextResponse.json({
      success: true,
      license: {
        license_key: license.license_key,
        license_type: license.license_type,
        max_devices: license.max_devices,
        is_active: license.is_active,
        expires_at: license.expires_at,
        created_at: license.created_at,
        customer_email: license.customer_email
      }
    });

  } catch (error: any) {
    console.error('License validation error:', error);
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    }, { status: 500 });
  }
}

/**
 * Endpoint GET para testes rápidos
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const licenseKey = searchParams.get('key');
  
  if (!licenseKey) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Parâmetro "key" é obrigatório' 
      }, 
      { status: 400 }
    );
  }

  // Simular validação para chave de teste
  if (licenseKey === 'VOLTRIS-LIC-TESTE-20260113-ABC123DEF456') {
    return NextResponse.json({
      success: true,
      license: {
        license_key: licenseKey,
        license_type: 'pro',
        max_devices: 3,
        is_active: true,
        expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
        customer_email: 'teste@voltris.com.br'
      }
    });
  }

  return NextResponse.json({
    success: false,
    error: 'Licença não encontrada',
    code: 'LICENSE_NOT_FOUND'
  });
}