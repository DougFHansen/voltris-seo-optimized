import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const maxDuration = 30;

/**
 * API de Ativação de Licença - Voltris Optimizer
 * 
 * Endpoint usado pelo aplicativo desktop para ativar/registrar um dispositivo
 * POST /api/v1/license/activate
 * 
 * Body: {
 *   licenseKey: string,
 *   deviceId: string,
 *   machineName: string,
 *   osVersion: string,
 *   processorCount: number,
 *   version: string (opcional),
 *   platform: string (opcional)
 * }
 */
export async function POST(request: NextRequest) {
  const requestId = `activate-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  
  console.log(`[LICENSE ACTIVATE] ========== ATIVAÇÃO ${requestId} ==========`);
  
  try {
    // Parse body
    const body = await request.json();
    const {
      licenseKey,
      deviceId,
      machineName,
      osVersion,
      processorCount,
      version,
      platform,
    } = body;
    
    console.log(`[LICENSE ACTIVATE] Dados recebidos:`, {
      licenseKey: licenseKey ? `${licenseKey.substring(0, 20)}...` : 'ausente',
      deviceId: deviceId ? `${deviceId.substring(0, 16)}...` : 'ausente',
      machineName,
      osVersion,
      processorCount,
      version,
      platform,
    });
    
    // Validações
    if (!licenseKey) {
      return NextResponse.json(
        {
          success: false,
          errorMessage: 'Chave de licença é obrigatória',
          errorCode: 'MISSING_LICENSE_KEY',
        },
        { status: 400 }
      );
    }
    
    if (!deviceId) {
      return NextResponse.json(
        {
          success: false,
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
      console.error('[LICENSE ACTIVATE] Credenciais Supabase não configuradas');
      return NextResponse.json(
        {
          success: false,
          errorMessage: 'Erro de configuração do servidor',
          errorCode: 'SERVER_CONFIG_ERROR',
        },
        { status: 500 }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Buscar licença no banco
    console.log(`[LICENSE ACTIVATE] Buscando licença no banco...`);
    
    const { data: license, error: licenseError } = await supabase
      .from('licenses')
      .select('*')
      .eq('license_key', licenseKey)
      .single();
    
    if (licenseError || !license) {
      console.log(`[LICENSE ACTIVATE] Licença não encontrada:`, licenseError);
      return NextResponse.json({
        success: false,
        errorMessage: 'Licença não encontrada',
        errorCode: 'LICENSE_NOT_FOUND',
      });
    }
    
    console.log(`[LICENSE ACTIVATE] Licença encontrada:`, {
      id: license.id,
      type: license.license_type,
      isActive: license.is_active,
      expiresAt: license.expires_at,
      maxDevices: license.max_devices,
      devicesInUse: license.devices_in_use,
    });
    
    // Verificar se licença está ativa
    if (!license.is_active) {
      console.log(`[LICENSE ACTIVATE] Licença inativa`);
      return NextResponse.json({
        success: false,
        errorMessage: 'Licença desativada',
        errorCode: 'LICENSE_INACTIVE',
      });
    }
    
    // Verificar expiração
    if (license.expires_at) {
      const expiryDate = new Date(license.expires_at);
      const now = new Date();
      
      if (expiryDate < now) {
        console.log(`[LICENSE ACTIVATE] Licença expirada em ${expiryDate.toISOString()}`);
        return NextResponse.json({
          success: false,
          errorMessage: 'Licença expirada',
          errorCode: 'LICENSE_EXPIRED',
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
    
    if (existingDevice) {
      // Dispositivo já registrado, apenas atualizar last_used_at
      console.log(`[LICENSE ACTIVATE] Dispositivo já registrado, atualizando...`);
      
      await supabase
        .from('license_devices')
        .update({
          last_used_at: new Date().toISOString(),
          machine_name: machineName,
          os_version: osVersion,
          processor_count: processorCount,
        })
        .eq('id', existingDevice.id);
      
      return NextResponse.json({
        success: true,
        message: 'Dispositivo já ativado anteriormente',
        type: license.license_type,
        maxDevices: license.max_devices,
        devicesInUse: license.devices_in_use,
        expiresAt: license.expires_at,
      });
    }
    
    // Verificar se há slots disponíveis (exceto Enterprise que é ilimitado)
    if (license.license_type !== 'enterprise' && license.devices_in_use >= license.max_devices) {
      console.log(`[LICENSE ACTIVATE] Limite de dispositivos atingido`);
      return NextResponse.json({
        success: false,
        errorMessage: `Limite de dispositivos atingido (${license.max_devices})`,
        errorCode: 'DEVICE_LIMIT_REACHED',
        maxDevices: license.max_devices,
        devicesInUse: license.devices_in_use,
      });
    }
    
    // Registrar novo dispositivo
    console.log(`[LICENSE ACTIVATE] Registrando novo dispositivo...`);
    
    const { error: insertError } = await supabase
      .from('license_devices')
      .insert({
        license_id: license.id,
        device_id: deviceId,
        device_name: machineName || `Device ${deviceId.substring(0, 8)}`,
        machine_name: machineName,
        os_version: osVersion,
        processor_count: processorCount,
        activated_at: new Date().toISOString(),
        last_used_at: new Date().toISOString(),
      });
    
    if (insertError) {
      console.error(`[LICENSE ACTIVATE] Erro ao registrar dispositivo:`, insertError);
      return NextResponse.json(
        {
          success: false,
          errorMessage: 'Erro ao registrar dispositivo',
          errorCode: 'DEVICE_REGISTRATION_ERROR',
          details: insertError.message,
        },
        { status: 500 }
      );
    }
    
    // Atualizar contador de dispositivos
    const newDevicesCount = license.devices_in_use + 1;
    
    await supabase
      .from('licenses')
      .update({ devices_in_use: newDevicesCount })
      .eq('id', license.id);
    
    console.log(`[LICENSE ACTIVATE] Dispositivo ativado com sucesso! Dispositivos em uso: ${newDevicesCount}/${license.max_devices}`);
    
    return NextResponse.json({
      success: true,
      message: 'Dispositivo ativado com sucesso',
      type: license.license_type,
      maxDevices: license.max_devices,
      devicesInUse: newDevicesCount,
      expiresAt: license.expires_at,
    });
    
  } catch (error: any) {
    console.error(`[LICENSE ACTIVATE] Erro:`, error);
    return NextResponse.json(
      {
        success: false,
        errorMessage: 'Erro ao ativar dispositivo',
        errorCode: 'ACTIVATION_ERROR',
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
    endpoint: 'license activation',
    timestamp: new Date().toISOString(),
  });
}
