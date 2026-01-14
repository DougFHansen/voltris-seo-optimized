import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const licenseKey = searchParams.get('key');
    
    if (!licenseKey) {
      return NextResponse.json(
        { error: 'Chave de licença não fornecida' },
        { status: 400 }
      );
    }

    console.log('[VALIDATE LICENSE] Validando licença:', licenseKey);

    // Buscar licença no banco
    const { data: license, error } = await supabase
      .from('licenses')
      .select(`
        license_key,
        license_type,
        max_devices,
        is_active,
        activated_at,
        expires_at,
        email,
        payment:payments(email, license_type)
      `)
      .eq('license_key', licenseKey)
      .single();

    if (error || !license) {
      console.log('[VALIDATE LICENSE] Licença não encontrada:', licenseKey);
      return NextResponse.json(
        { 
          valid: false, 
          error: 'Licença não encontrada ou inválida',
          code: 'LICENSE_NOT_FOUND'
        },
        { status: 404 }
      );
    }

    // Verificar se está ativa
    if (!license.is_active) {
      console.log('[VALIDATE LICENSE] Licença inativa:', licenseKey);
      return NextResponse.json(
        { 
          valid: false, 
          error: 'Licença inativa',
          code: 'LICENSE_INACTIVE'
        },
        { status: 403 }
      );
    }

    // Verificar expiração
    const now = new Date();
    const expiresAt = new Date(license.expires_at);
    if (now > expiresAt) {
      console.log('[VALIDATE LICENSE] Licença expirada:', licenseKey);
      return NextResponse.json(
        { 
          valid: false, 
          error: 'Licença expirada',
          code: 'LICENSE_EXPIRED'
        },
        { status: 403 }
      );
    }

    console.log('[VALIDATE LICENSE] Licença válida:', licenseKey);
    
    // Retornar dados da licença
    return NextResponse.json({
      valid: true,
      license: {
        key: license.license_key,
        type: license.license_type,
        maxDevices: license.max_devices,
        email: license.email,
        activatedAt: license.activated_at,
        expiresAt: license.expires_at
      }
    });

  } catch (error: any) {
    console.error('[VALIDATE LICENSE] Erro:', error);
    return NextResponse.json(
      { 
        valid: false, 
        error: 'Erro interno do servidor',
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}

// Também aceitar POST para compatibilidade
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const licenseKey = body.key || body.license_key;
    
    if (!licenseKey) {
      return NextResponse.json(
        { error: 'Chave de licença não fornecida' },
        { status: 400 }
      );
    }

    // Mesma lógica do GET
    const { data: license, error } = await supabase
      .from('licenses')
      .select(`
        license_key,
        license_type,
        max_devices,
        is_active,
        activated_at,
        expires_at,
        email
      `)
      .eq('license_key', licenseKey)
      .single();

    if (error || !license) {
      return NextResponse.json(
        { 
          valid: false, 
          error: 'Licença não encontrada ou inválida',
          code: 'LICENSE_NOT_FOUND'
        },
        { status: 404 }
      );
    }

    if (!license.is_active) {
      return NextResponse.json(
        { 
          valid: false, 
          error: 'Licença inativa',
          code: 'LICENSE_INACTIVE'
        },
        { status: 403 }
      );
    }

    const now = new Date();
    const expiresAt = new Date(license.expires_at);
    if (now > expiresAt) {
      return NextResponse.json(
        { 
          valid: false, 
          error: 'Licença expirada',
          code: 'LICENSE_EXPIRED'
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      valid: true,
      license: {
        key: license.license_key,
        type: license.license_type,
        maxDevices: license.max_devices,
        email: license.email,
        activatedAt: license.activated_at,
        expiresAt: license.expires_at
      }
    });

  } catch (error: any) {
    console.error('[VALIDATE LICENSE POST] Erro:', error);
    return NextResponse.json(
      { 
        valid: false, 
        error: 'Erro interno do servidor',
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}