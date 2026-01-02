import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const maxDuration = 30;

/**
 * API de Validação de Licença - Voltris Optimizer
 * 
 * Endpoint usado pelo aplicativo desktop para validar licenças online
 * POST /api/v1/license/validate
 * 
 * Body: {
 *   licenseKey: string,
 *   deviceId: string,
 *   version: string (opcional),
 *   platform: string (opcional),
 *   machineName: string (opcional)
 * }
 */
export async function POST(request: NextRequest) {
  const requestId = `validate-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  
  console.log(`[LICENSE VALIDATE] ========== VALIDAÇÃO ${requestId} ==========`);
  
  try {
    // Parse body
    const body = await request.json();
    const { licenseKey, deviceId, version, platform, machineName } = body;
    
    console.log(`[LICENSE VALIDATE] Dados recebidos:`, {
      licenseKey: licenseKey ? `${licenseKey.substring(0, 20)}...` : 'ausente',
      deviceId: deviceId ? `${deviceId.substring(0, 16)}...` : 'ausente',
      version,
      platform,
      machineName,
    });
    
    // Validações
    if (!licenseKey) {
      return NextResponse.json(
        {
          valid: false,
          errorMessage: 'Chave de licença é obrigatória',
          errorCode: 'MISSING_LICENSE_KEY',
        },
        { status: 400 }
      );
    }
    
    if (!deviceId) {
      return NextResponse.json(
        {
          valid: false,
          errorMessage: 'ID do dispositivo é obrigatório',
          errorCode: 'MISSING_DEVICE_ID',
        },
        { status: 400 }
      );
    }
    
    // Conectar ao Supabase com service role
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('[LICENSE VALIDATE] Credenciais Supabase não configuradas');
      return NextResponse.json(
        {
          valid: false,
          errorMessage: 'Erro de configuração do servidor',
          errorCode: 'SERVER_CONFIG_ERROR',
        },
        { status: 500 }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Buscar licença no banco
    console.log(`[LICENSE VALIDATE] Buscando licença no banco...`);
    
    const { data: license, error: licenseError } = await supabase
      .from('licenses')
      .select('*')
      .eq('license_key', licenseKey)
      .single();
    
    if (licenseError || !license) {
      console.log(`[LICENSE VALIDATE] Licença não encontrada:`, licenseError);
      return NextResponse.json({
        valid: false,
        errorMessage: 'Licença não encontrada',
        errorCode: 'LICENSE_NOT_FOUND',
      });
    }
    
    console.log(`[LICENSE VALIDATE] Licença encontrada:`, {
      id: license.id,
      type: license.license_type,
      isActive: license.is_active,
      expiresAt: license.expires_at,
      maxDevices: license.max_devices,
      devicesInUse: license.devices_in_use,
    });
    
    // Verificar se licença está ativa
    if (!license.is_active) {
      console.log(`[LICENSE VALIDATE] Licença inativa`);
      return NextResponse.json({
        valid: false,
        errorMessage: 'Licença desativada',
        errorCode: 'LICENSE_INACTIVE',
        type: license.license_type,
        expiresAt: license.expires_at,
      });
    }
    
    // Verificar expiração
    if (license.expires_at) {
      const expiryDate = new Date(license.expires_at);
      const now = new Date();
      
      if (expiryDate < now) {
        console.log(`[LICENSE VALIDATE] Licença expirada em ${expiryDate.toISOString()}`);
        return NextResponse.json({
          valid: false,
          errorMessage: 'Licença expirada',
          errorCode: 'LICENSE_EXPIRED',
          type: license.license_type,
          expiresAt: license.expires_at,
        });
      }
    }
    
    // Verificar se dispositivo já está registrado
    const { data: existingDevice } = await supabase
      .from('license_devices')
      .select('*')
      .eq('license_id', license.id)
      .eq('device_id', deviceId)
      .single();
    
    const deviceRegistered = !!existingDevice;
    
    console.log(`[LICENSE VALIDATE] Dispositivo ${deviceId} ${deviceRegistered ? 'JÁ registrado' : 'NÃO registrado'}`);
    
    // Atualizar last_used_at se dispositivo já estiver registrado
    if (deviceRegistered) {
      await supabase
        .from('license_devices')
        .update({ last_used_at: new Date().toISOString() })
        .eq('id', existingDevice.id);
      
      console.log(`[LICENSE VALIDATE] Atualizado last_used_at do dispositivo`);
    }
    
    // Retornar resposta de sucesso
    console.log(`[LICENSE VALIDATE] Validação bem-sucedida`);
    
    return NextResponse.json({
      valid: true,
      type: license.license_type,
      maxDevices: license.max_devices,
      devicesInUse: license.devices_in_use,
      expiresAt: license.expires_at,
      deviceRegistered,
      message: 'Licença válida',
    });
    
  } catch (error: any) {
    console.error(`[LICENSE VALIDATE] Erro:`, error);
    return NextResponse.json(
      {
        valid: false,
        errorMessage: 'Erro ao validar licença',
        errorCode: 'VALIDATION_ERROR',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// GET para health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: 'license validation',
    timestamp: new Date().toISOString(),
  });
}
