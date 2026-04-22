// =====================================================
// EDGE FUNCTION — ACTIVATE LICENSE (SUPABASE)
// =====================================================
// Registra um dispositivo em uma licença Pro/Standard/Enterprise
// Controla limite de dispositivos server-side

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface ActivateLicenseRequest {
  license_key: string
  device_id: string
  machine_name?: string
  os_version?: string
  app_version?: string
}

interface ActivateLicenseResponse {
  success: boolean
  message: string
  license_type?: string
  max_devices?: number
  devices_in_use?: number
  expires_at?: string
  error_code?: string
}

const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000
const RATE_LIMIT_MAX = 10

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(ip)
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return true
  }
  if (record.count >= RATE_LIMIT_MAX) return false
  record.count++
  return true
}

async function computeSHA256Hex(input: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(input)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase()
}

async function generateVoltrisSignature(content: string, secret: string): Promise<string> {
  const hash = await computeSHA256Hex(content + secret)
  return hash.substring(0, 16)
}

async function validateKeyStructure(
  licenseKey: string,
  secret: string
): Promise<{ planCode: string; clientId: string; validityDate: Date; planName: string; maxDevices: number } | null> {
  const parts = licenseKey.trim().toUpperCase().split('-')
  if (parts.length < 5 || parts[0] !== 'VOLTRIS') return null

  const planCode = parts[1]
  const clientId = parts[2]
  const validityDateStr = parts[3]
  const signature = parts[4]

  if (!/^\d{8}$/.test(validityDateStr)) return null
  const year = parseInt(validityDateStr.substring(0, 4))
  const month = parseInt(validityDateStr.substring(4, 6)) - 1
  const day = parseInt(validityDateStr.substring(6, 8))
  const validityDate = new Date(year, month, day)
  if (isNaN(validityDate.getTime())) return null

  const planMap: Record<string, { name: string; devices: number }> = {
    TRI: { name: 'trial', devices: 1 },
    STA: { name: 'standard', devices: 1 },
    PRO: { name: 'pro', devices: 3 },
    ENT: { name: 'enterprise', devices: 9999 },
    LIC: { name: 'standard', devices: 1 },
  }
  const plan = planMap[planCode]
  if (!plan) return null

  const validUntilStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  const jsonContent = `{"id":"${clientId}","validUntil":"${validUntilStr}","plan":"${plan.name}","maxDevices":${plan.devices}}`
  const expectedSig = await generateVoltrisSignature(jsonContent, secret)

  if (signature === expectedSig) {
    return { planCode, clientId, validityDate, planName: plan.name, maxDevices: plan.devices }
  }

  if (planCode === 'LIC') {
    const legacyJson = `{"id":"${clientId}","validUntil":"${validUntilStr}","plan":"Mensal"}`
    const legacySig = await generateVoltrisSignature(legacyJson, secret)
    if (signature === legacySig) {
      return { planCode, clientId, validityDate, planName: 'standard', maxDevices: 1 }
    }
  }

  return null
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const clientIP = (req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown').split(',')[0].trim()
  console.log(`[ACTIVATE-LICENSE] Request from IP: ${clientIP}`)

  if (!checkRateLimit(clientIP)) {
    console.warn(`[ACTIVATE-LICENSE] Rate limit exceeded for IP: ${clientIP}`)
    return new Response(
      JSON.stringify({ success: false, message: 'Too many requests', error_code: 'RATE_LIMITED' }),
      { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ success: false, message: 'Method not allowed', error_code: 'METHOD_NOT_ALLOWED' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  try {
    const body: ActivateLicenseRequest = await req.json()

    if (!body.license_key || !body.device_id) {
      return new Response(
        JSON.stringify({ success: false, message: 'license_key and device_id are required', error_code: 'MISSING_FIELDS' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const licenseKey = body.license_key.trim().toUpperCase()
    const deviceId = body.device_id.trim()

    console.log(`[ACTIVATE-LICENSE] Activating key: ${licenseKey.substring(0, 12)}... device: ${deviceId.substring(0, 8)}...`)

    const secret = Deno.env.get('VOLTRIS_LICENSE_SECRET')
    if (!secret) {
      console.error('[ACTIVATE-LICENSE] VOLTRIS_LICENSE_SECRET not configured')
      return new Response(
        JSON.stringify({ success: false, message: 'Server configuration error', error_code: 'SERVER_ERROR' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validar estrutura e assinatura
    const structureResult = await validateKeyStructure(licenseKey, secret)
    if (!structureResult) {
      console.warn(`[ACTIVATE-LICENSE] Invalid key structure: ${licenseKey.substring(0, 12)}...`)
      return new Response(
        JSON.stringify({ success: false, message: 'Chave de licença inválida', error_code: 'INVALID_KEY' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verificar expiração
    if (structureResult.validityDate < new Date()) {
      return new Response(
        JSON.stringify({ success: false, message: 'Licença expirada', error_code: 'LICENSE_EXPIRED' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Buscar licença no DB
    const { data: licenseRecord, error: dbError } = await supabase
      .from('licenses')
      .select('id, is_active, devices_in_use, max_devices, expires_at, license_type, last_device_id')
      .eq('license_key', licenseKey)
      .single()

    if (dbError && dbError.code !== 'PGRST116') {
      console.error(`[ACTIVATE-LICENSE] DB error: ${dbError.message}`)
      return new Response(
        JSON.stringify({ success: false, message: 'Erro de banco de dados', error_code: 'DB_ERROR' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!licenseRecord) {
      // Licença válida mas não no DB — registrar e ativar
      console.warn(`[ACTIVATE-LICENSE] License not in DB — auto-registering: ${licenseKey.substring(0, 12)}...`)
      await supabase.from('audit_logs').insert({
        event_type: 'LICENSE_AUTO_REGISTERED',
        metadata: { license_key_prefix: licenseKey.substring(0, 12), device_id: deviceId.substring(0, 8), ip: clientIP }
      })
      const response: ActivateLicenseResponse = {
        success: true,
        message: 'Licença ativada com sucesso',
        license_type: structureResult.planName,
        max_devices: structureResult.maxDevices,
        devices_in_use: 1,
        expires_at: structureResult.validityDate.toISOString(),
      }
      return new Response(JSON.stringify(response), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    if (!licenseRecord.is_active) {
      console.warn(`[ACTIVATE-LICENSE] License revoked: ${licenseKey.substring(0, 12)}...`)
      return new Response(
        JSON.stringify({ success: false, message: 'Licença revogada', error_code: 'LICENSE_REVOKED' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verificar se este device já está registrado (reativação)
    const isReactivation = licenseRecord.last_device_id === deviceId
    const currentDevices = licenseRecord.devices_in_use ?? 0

    if (!isReactivation && currentDevices >= licenseRecord.max_devices) {
      console.warn(`[ACTIVATE-LICENSE] Device limit reached: ${currentDevices}/${licenseRecord.max_devices}`)
      return new Response(
        JSON.stringify({
          success: false,
          message: `Limite de dispositivos atingido (${currentDevices}/${licenseRecord.max_devices})`,
          error_code: 'DEVICE_LIMIT_REACHED',
          max_devices: licenseRecord.max_devices,
          devices_in_use: currentDevices,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Atualizar registro de dispositivo
    const newDevicesInUse = isReactivation ? currentDevices : currentDevices + 1
    const { error: updateError } = await supabase
      .from('licenses')
      .update({
        last_device_id: deviceId,
        devices_in_use: newDevicesInUse,
        activated_at: new Date().toISOString(),
      })
      .eq('id', licenseRecord.id)

    if (updateError) {
      console.error(`[ACTIVATE-LICENSE] Update error: ${updateError.message}`)
    }

    // Audit log
    await supabase.from('audit_logs').insert({
      event_type: isReactivation ? 'LICENSE_REACTIVATED' : 'LICENSE_ACTIVATED',
      metadata: {
        license_key_prefix: licenseKey.substring(0, 12),
        device_id: deviceId.substring(0, 8),
        machine_name: body.machine_name ?? 'unknown',
        ip: clientIP,
        devices_in_use: newDevicesInUse,
        max_devices: licenseRecord.max_devices,
      }
    })

    console.log(`[ACTIVATE-LICENSE] Activation successful — devices: ${newDevicesInUse}/${licenseRecord.max_devices}`)

    const response: ActivateLicenseResponse = {
      success: true,
      message: isReactivation ? 'Dispositivo reativado com sucesso' : 'Licença ativada com sucesso',
      license_type: licenseRecord.license_type,
      max_devices: licenseRecord.max_devices,
      devices_in_use: newDevicesInUse,
      expires_at: licenseRecord.expires_at,
    }

    return new Response(JSON.stringify(response), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

  } catch (error) {
    console.error(`[ACTIVATE-LICENSE] Unexpected error: ${error.message}`)
    return new Response(
      JSON.stringify({ success: false, message: 'Internal server error', error_code: 'INTERNAL_ERROR' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
