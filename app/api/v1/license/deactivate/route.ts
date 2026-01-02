import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const maxDuration = 30;

/**
 * API de Desativação de Dispositivo - Voltris Optimizer
 * 
 * Endpoint usado pelo aplicativo desktop para desativar/liberar um dispositivo
 * POST /api/v1/license/deactivate
 * 
 * Body: {
 *   licenseKey: string,
 *   deviceId: string
 * }
 */
export async function POST(request: NextRequest) {
  const requestId = `deactivate-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  
  console.log(`[LICENSE DEACTIVATE] ========== DESATIVAÇÃO ${requestId} ==========`);
  
  try {
    // Parse body
    const body = await request.json();
    const { licenseKey, deviceId } = body;
    
    console.log(`[LICENSE DEACTIVATE] Dados recebidos:`, {
      licenseKey: licenseKey ? `${licenseKey.substring(0, 20)}...` : 'ausente',
      deviceId: deviceId ? `${deviceId.substring(0, 16)}...` : 'ausente',
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
      console.error('[LICENSE DEACTIVATE] Credenciais Supabase não configuradas');
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
    console.log(`[LICENSE DEACTIVATE] Buscando licença no banco...`);
    
    const { data: license, error: licenseError } = await supabase
      .from('licenses')
      .select('*')
      .eq('license_key', licenseKey)
      .single();
    
    if (licenseError || !license) {
      console.log(`[LICENSE DEACTIVATE] Licença não encontrada:`, licenseError);
      return NextResponse.json({
        success: false,
        errorMessage: 'Licença não encontrada',
        errorCode: 'LICENSE_NOT_FOUND',
      });
    }
    
    console.log(`[LICENSE DEACTIVATE] Licença encontrada:`, {
      id: license.id,
      type: license.license_type,
      devicesInUse: license.devices_in_use,
    });
    
    // Buscar dispositivo
    const { data: device, error: deviceError } = await supabase
      .from('license_devices')
      .select('*')
      .eq('license_id', license.id)
      .eq('device_id', deviceId)
      .single();
    
    if (deviceError || !device) {
      console.log(`[LICENSE DEACTIVATE] Dispositivo não encontrado`);
      return NextResponse.json({
        success: false,
        errorMessage: 'Dispositivo não está registrado nesta licença',
        errorCode: 'DEVICE_NOT_FOUND',
      });
    }
    
    console.log(`[LICENSE DEACTIVATE] Dispositivo encontrado, removendo...`);
    
    // Remover dispositivo
    const { error: deleteError } = await supabase
      .from('license_devices')
      .delete()
      .eq('id', device.id);
    
    if (deleteError) {
      console.error(`[LICENSE DEACTIVATE] Erro ao remover dispositivo:`, deleteError);
      return NextResponse.json(
        {
          success: false,
          errorMessage: 'Erro ao desativar dispositivo',
          errorCode: 'DEACTIVATION_ERROR',
          details: deleteError.message,
        },
        { status: 500 }
      );
    }
    
    // Atualizar contador de dispositivos
    const newDevicesCount = Math.max(0, license.devices_in_use - 1);
    
    await supabase
      .from('licenses')
      .update({ devices_in_use: newDevicesCount })
      .eq('id', license.id);
    
    console.log(`[LICENSE DEACTIVATE] Dispositivo desativado! Dispositivos em uso: ${newDevicesCount}/${license.max_devices}`);
    
    return NextResponse.json({
      success: true,
      message: 'Dispositivo desativado com sucesso',
      devicesInUse: newDevicesCount,
      maxDevices: license.max_devices,
    });
    
  } catch (error: any) {
    console.error(`[LICENSE DEACTIVATE] Erro:`, error);
    return NextResponse.json(
      {
        success: false,
        errorMessage: 'Erro ao desativar dispositivo',
        errorCode: 'DEACTIVATION_ERROR',
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
    endpoint: 'license deactivation',
    timestamp: new Date().toISOString(),
  });
}
