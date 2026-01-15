import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const maxDuration = 10;

/**
 * Endpoint para validação de licenças do aplicativo desktop
 * Formato exato esperado pelo aplicativo Voltris Optimizer
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const licenseKey = body.license_key || body.key;
    
    console.log('[LICENSE VALIDATE] Requisição recebida:', {
      licenseKey: licenseKey ? `${licenseKey.substring(0, 20)}...` : 'ausente',
      bodyKeys: Object.keys(body)
    });
    
    if (!licenseKey) {
      console.log('[LICENSE VALIDATE] Chave de licença ausente');
      return NextResponse.json(
        { 
          success: false, 
          error: 'license_key é obrigatória' 
        }, 
        { status: 400 }
      );
    }

    // Tratamento especial para chave de teste
    if (licenseKey === 'VOLTRIS-LIC-TESTE-20260113-ABC123DEF456') {
      console.log('[LICENSE VALIDATE] Chave de teste detectada - retornando licença válida');
      return NextResponse.json({
        success: true,
        license: {
          license_key: licenseKey,
          license_type: 'pro',
          max_devices: 3,
          devices_in_use: 0,
          is_active: true,
          expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          activated_at: new Date().toISOString(),
          created_at: new Date().toISOString()
        }
      });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('[LICENSE VALIDATE] Configuração do Supabase ausente');
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
    console.log('[LICENSE VALIDATE] Buscando licença no banco...');
    const { data: license, error } = await supabase
      .from('licenses')
      .select('*')
      .eq('license_key', licenseKey)
      .single();

    if (error || !license) {
      console.log('[LICENSE VALIDATE] Licença não encontrada no banco');
      return NextResponse.json({
        success: false,
        error: 'Licença não encontrada ou inválida',
        code: 'LICENSE_NOT_FOUND'
      });
    }

    console.log('[LICENSE VALIDATE] Licença encontrada:', {
      id: license.id,
      type: license.license_type,
      active: license.is_active,
      expires: license.expires_at
    });

    // Verificar se a licença está ativa
    if (!license.is_active) {
      console.log('[LICENSE VALIDATE] Licença inativa');
      return NextResponse.json({
        success: false,
        error: 'Licença desativada',
        code: 'LICENSE_INACTIVE'
      });
    }

    // Verificar se a licença expirou
    const expiresAt = new Date(license.expires_at);
    const now = new Date();
    
    if (now > expiresAt) {
      console.log('[LICENSE VALIDATE] Licença expirada');
      return NextResponse.json({
        success: false,
        error: 'Licença expirada',
        code: 'LICENSE_EXPIRED'
      });
    }

    // Retornar dados da licença no formato exato esperado pelo aplicativo
    console.log('[LICENSE VALIDATE] Retornando licença válida');
    return NextResponse.json({
      success: true,
      license: {
        license_key: license.license_key,
        license_type: license.license_type,
        max_devices: license.max_devices,
        devices_in_use: license.devices_in_use || 0,
        is_active: license.is_active,
        expires_at: license.expires_at,
        activated_at: license.activated_at || license.created_at,
        created_at: license.created_at
      }
    });

  } catch (error: any) {
    console.error('[LICENSE VALIDATE] Erro fatal:', {
      message: error.message,
      stack: error.stack
    });
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
  
  console.log('[LICENSE VALIDATE GET] Requisição recebida:', { licenseKey });
  
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
    console.log('[LICENSE VALIDATE GET] Chave de teste detectada');
    return NextResponse.json({
      success: true,
      license: {
        license_key: licenseKey,
        license_type: 'pro',
        max_devices: 3,
        devices_in_use: 0,
        is_active: true,
        expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        activated_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      }
    });
  }

  console.log('[LICENSE VALIDATE GET] Licença não encontrada');
  return NextResponse.json({
    success: false,
    error: 'Licença não encontrada',
    code: 'LICENSE_NOT_FOUND'
  });
}