import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const maxDuration = 30;

/**
 * API de Informações da Licença - Voltris Optimizer
 * 
 * Endpoint usado para obter informações detalhadas da licença
 * GET /api/v1/license/info?key=VOLTRIS-LIC-...
 * 
 * Query params:
 * - key: Chave da licença
 */
export async function GET(request: NextRequest) {
  const requestId = `info-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  
  console.log(`[LICENSE INFO] ========== CONSULTA ${requestId} ==========`);
  
  try {
    // Parse query params
    const { searchParams } = new URL(request.url);
    const licenseKey = searchParams.get('key');
    
    console.log(`[LICENSE INFO] Chave recebida:`, licenseKey ? `${licenseKey.substring(0, 20)}...` : 'ausente');
    
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
    
    // Conectar ao Supabase com service role
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('[LICENSE INFO] Credenciais Supabase não configuradas');
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
    console.log(`[LICENSE INFO] Buscando licença no banco...`);
    
    const { data: license, error: licenseError } = await supabase
      .from('licenses')
      .select('*')
      .eq('license_key', licenseKey)
      .single();
    
    if (licenseError || !license) {
      console.log(`[LICENSE INFO] Licença não encontrada:`, licenseError);
      return NextResponse.json({
        valid: false,
        errorMessage: 'Licença não encontrada',
        errorCode: 'LICENSE_NOT_FOUND',
      });
    }
    
    // Buscar dispositivos registrados
    const { data: devices } = await supabase
      .from('license_devices')
      .select('device_id, device_name, machine_name, activated_at, last_used_at')
      .eq('license_id', license.id)
      .order('activated_at', { ascending: false });
    
    const registeredDevices = devices?.map(d => ({
      deviceId: d.device_id,
      deviceName: d.device_name || d.machine_name,
      machineName: d.machine_name,
      activatedAt: d.activated_at,
      lastUsedAt: d.last_used_at,
    })) || [];
    
    console.log(`[LICENSE INFO] Licença encontrada com ${registeredDevices.length} dispositivos`);
    
    // Verificar se está ativa
    const isActive = license.is_active;
    let isExpired = false;
    
    if (license.expires_at) {
      const expiryDate = new Date(license.expires_at);
      const now = new Date();
      isExpired = expiryDate < now;
    }
    
    const valid = isActive && !isExpired;
    
    return NextResponse.json({
      valid,
      type: license.license_type,
      maxDevices: license.max_devices,
      devicesInUse: license.devices_in_use,
      expiresAt: license.expires_at,
      activatedAt: license.activated_at,
      customerEmail: license.email,
      registeredDevices,
      isActive,
      isExpired,
    });
    
  } catch (error: any) {
    console.error(`[LICENSE INFO] Erro:`, error);
    return NextResponse.json(
      {
        valid: false,
        errorMessage: 'Erro ao consultar licença',
        errorCode: 'INFO_ERROR',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
