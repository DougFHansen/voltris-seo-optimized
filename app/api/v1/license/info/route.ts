import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getOptionalSessionUser, licenseOwnershipErrorIfAuthenticated } from '@/utils/supabase/ownership';

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

    // SEGURANÇA: só o dono da licença (via sessão) recebe dados sensíveis
    // (email do cliente e lista de dispositivos). O app desktop, que consulta
    // sem sessão, continua recebendo os dados públicos da própria licença.
    const sessionUser = await getOptionalSessionUser();
    const ownershipError = await licenseOwnershipErrorIfAuthenticated(license, sessionUser);

    const ownsLicense = !ownershipError;
    const registeredDevices = [];
    let customerEmail: string | null = null;

    if (ownsLicense) {
      // Buscar dispositivos registrados
      const { data: devices } = await supabase
        .from('license_devices')
        .select('device_id, device_name, machine_name, activated_at, last_used_at')
        .eq('license_id', license.id)
        .order('activated_at', { ascending: false });

      for (const d of devices || []) {
        registeredDevices.push({
          deviceId: d.device_id,
          deviceName: d.device_name || d.machine_name,
          machineName: d.machine_name,
          activatedAt: d.activated_at,
          lastUsedAt: d.last_used_at,
        });
      }

      customerEmail = license.email || null;
    }

    console.log(`[LICENSE INFO] Licença encontrada com ${registeredDevices.length} dispositivos (dono: ${ownsLicense})`);
    
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
      customerEmail,
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
