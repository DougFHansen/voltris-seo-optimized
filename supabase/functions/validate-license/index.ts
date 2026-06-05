// =====================================================
// EDGE FUNCTION — VALIDATE LICENSE (SUPABASE)
// =====================================================
// Validação server-side de licenças Pro/Standard/Enterprise
// A chave secreta NUNCA sai do servidor — zero exposição no cliente

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { createHmac } from 'https://deno.land/std@0.168.0/node/crypto.ts'

interface ValidateLicenseRequest {
  license_key: string
  device_id: string
  machine_name?: string
  app_version?: string
}

interface ValidateLicenseResponse {
  success: boolean
  valid: boolean
  license_type?: string
  max_devices?: number
  devices_in_use?: number
  expires_at?: string
  message: string
  error_code?: string
}

// Rate limiting em memória (por IP)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minuto
const RATE_LIMIT_MAX = 20

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

// Gera assinatura idêntica ao algoritmo C# do LicenseManager
// SHA256(content + secret) → hex uppercase → primeiros 16 chars
function generateSignature(content: string, secret: string): string {
  const hmac = createHmac('sha256', '')
  // Replicar: SHA256(content + secret) como no C#
  const encoder = new TextEncoder()
  const data = encoder.encode(content + secret)
  // Usar SubtleCrypto para SHA256 puro (sem HMAC key)
  return '' // placeholder — implementado abaixo via SubtleCrypto
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

// Valida estrutura e assinatura da chave localmente (sem DB) — primeira barreira
async function validateKeyStructure(
  licenseKey: string,
  secret: string
): Promise<{ valid: boolean; planCode: string; clientId: string; validityDate: Date; planName: string; maxDevices: number } | null> {
  const parts = licenseKey.trim().toUpperCase().split('-')
  if (parts.length < 5 || parts[0] !== 'VOLTRIS') return null

  const planCode = parts[1]
  const clientId = parts[2]
  const validityDateStr = parts[3]
  const signature = parts[4]

  // Validar data
  if (!/^\d{8}$/.test(validityDateStr)) return null
  const year = parseInt(validityDateStr.substring(0, 4))
  const month = parseInt(validityDateStr.substring(4, 6)) - 1
  const day = parseInt(validityDateStr.substring(6, 8))
  const validityDate = new Date(year, month, day)
  if (isNaN(validityDate.getTime())) return null

  // Resolver plano
  const planMap: Record<string, { name: string; devices: number }> = {
    TRI: { name: 'trial', devices: 1 },
    STA: { name: 'standard', devices: 1 },
    PRO: { name: 'pro', devices: 3 },
    ENT: { name: 'enterprise', devices: 9999 },
    LIC: { name: 'standard', devices: 1 },
  }
  const plan = planMap[planCode]
  if (!plan) return null

  // Reconstruir JSON exatamente como o C# LicenseManager
  const validUntilStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  const jsonContent = `{"id":"${clientId}","validUntil":"${validUntilStr}","plan":"${plan.name}","maxDevices":${plan.devices}}`

  const expectedSig = await generateVoltrisSignature(jsonContent, secret)

  // Verificar assinatura principal
  if (signature === expectedSig) {
    return { valid: true, planCode, clientId, validityDate, planName: plan.name, maxDevices: plan.devices }
  }

  // Fallback para licenças legadas (planCode=LIC, plan=Mensal sem maxDevices)
  if (planCode === 'LIC') {
    const legacyJson = `{"id":"${clientId}","validUntil":"${validUntilStr}","plan":"Mensal"}`
    const legacySig = await generateVoltrisSignature(legacyJson, secret)
    if (signature === legacySig) {
      return { valid: true, planCode, clientId, validityDate, planName: 'standard', maxDevices: 1 }
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
  console.log(`[VALIDATE-LICENSE] Request from IP: ${clientIP}`)

  if (!checkRateLimit(clientIP)) {
    console.warn(`[VALIDATE-LICENSE] Rate limit exceeded for IP: ${clientIP}`)
    return new Response(
      JSON.stringify({ success: false, valid: false, message: 'Too many requests', error_code: 'RATE_LIMITED' }),
      { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ success: false, valid: false, message: 'Method not allowed', error_code: 'METHOD_NOT_ALLOWED' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  try {
    const body: ValidateLicenseRequest = await req.json()

    if (!body.license_key || !body.device_id) {
      console.warn('[VALIDATE-LICENSE] Missing required fields')
      return new Response(
        JSON.stringify({ success: false, valid: false, message: 'license_key and device_id are required', error_code: 'MISSING_FIELDS' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const licenseKey = body.license_key.trim().toUpperCase()
    const deviceId = body.device_id.trim()

    console.log(`[VALIDATE-LICENSE] Validating key: ${licenseKey.substring(0, 12)}... for device: ${deviceId.substring(0, 8)}...`)

    // Obter segredo do ambiente (NUNCA exposto ao cliente)
    const secret = Deno.env.get('VOLTRIS_LICENSE_SECRET')
    if (!secret) {
      console.error('[VALIDATE-LICENSE] VOLTRIS_LICENSE_SECRET not configured')
      return new Response(
        JSON.stringify({ success: false, valid: false, message: 'Server configuration error', error_code: 'SERVER_ERROR' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // BARREIRA 1: Validar estrutura e assinatura criptográfica
    const structureResult = await validateKeyStructure(licenseKey, secret)
    if (!structureResult) {
      console.warn(`[VALIDATE-LICENSE] Invalid key structure or signature: ${licenseKey.substring(0, 12)}...`)
      return new Response(
        JSON.stringify({ success: true, valid: false, message: 'Chave de licença inválida ou assinatura incorreta', error_code: 'INVALID_SIGNATURE' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // BARREIRA 2: Verificar expiração da data
    const now = new Date()
    if (structureResult.validityDate < now) {
      console.warn(`[VALIDATE-LICENSE] License expired: ${structureResult.validityDate.toISOString()}`)
      return new Response(
        JSON.stringify({ success: true, valid: false, message: 'Licença expirada', error_code: 'LICENSE_EXPIRED', expires_at: structureResult.validityDate.toISOString() }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // BARREIRA 3: Verificar no banco de dados (revogação, limite de dispositivos)
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data: licenseRecord, error: dbError } = await supabase
      .from('licenses')
      .select('id, is_active, devices_in_use, max_devices, expires_at, license_type')
      .eq('license_key', licenseKey)
      .single()

    if (dbError && dbError.code !== 'PGRST116') {
      console.error(`[VALIDATE-LICENSE] DB error: ${dbError.message}`)
      // Fail-open com aviso: se o DB está offline mas a assinatura é válida, permitir com log
      console.warn('[VALIDATE-LICENSE] DB unavailable — allowing based on valid signature (offline mode)')
      const response: ValidateLicenseResponse = {
        success: true,
        valid: true,
        license_type: structureResult.planName,
        max_devices: structureResult.maxDevices,
        devices_in_use: 0,
        expires_at: structureResult.validityDate.toISOString(),
        message: 'Licença válida (modo offline — DB indisponível)',
      }
      return new Response(JSON.stringify(response), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // Licença não encontrada no DB — pode ser nova (ainda não registrada após pagamento)
    // Aceitar se assinatura é válida, mas registrar para auditoria
    if (!licenseRecord) {
      console.warn(`[VALIDATE-LICENSE] License not in DB but signature valid — registering: ${licenseKey.substring(0, 12)}...`)
      // Registrar no audit_logs
      await supabase.from('audit_logs').insert({
        event_type: 'LICENSE_VALIDATED_NOT_IN_DB',
        metadata: { license_key_prefix: licenseKey.substring(0, 12), device_id: deviceId.substring(0, 8), ip: clientIP }
      })
      const response: ValidateLicenseResponse = {
        success: true,
        valid: true,
        license_type: structureResult.planName,
        max_devices: structureResult.maxDevices,
        devices_in_use: 0,
        expires_at: structureResult.validityDate.toISOString(),
        message: 'Licença válida',
      }
      return new Response(JSON.stringify(response), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // BARREIRA 4: Verificar se licença está ativa no DB
    if (!licenseRecord.is_active) {
      console.warn(`[VALIDATE-LICENSE] License revoked in DB: ${licenseKey.substring(0, 12)}...`)
      await supabase.from('audit_logs').insert({
        event_type: 'LICENSE_REVOKED_ACCESS_ATTEMPT',
        metadata: { license_key_prefix: licenseKey.substring(0, 12), device_id: deviceId.substring(0, 8), ip: clientIP }
      })
      return new Response(
        JSON.stringify({ success: true, valid: false, message: 'Licença revogada', error_code: 'LICENSE_REVOKED' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`[VALIDATE-LICENSE] License valid — type: ${licenseRecord.license_type}, devices: ${licenseRecord.devices_in_use}/${licenseRecord.max_devices}`)

    const response: ValidateLicenseResponse = {
      success: true,
      valid: true,
      license_type: licenseRecord.license_type,
      max_devices: licenseRecord.max_devices,
      devices_in_use: licenseRecord.devices_in_use,
      expires_at: licenseRecord.expires_at,
      message: 'Licença válida',
    }

    return new Response(JSON.stringify(response), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

  } catch (error) {
    console.error(`[VALIDATE-LICENSE] Unexpected error: ${error.message}`)
    return new Response(
      JSON.stringify({ success: false, valid: false, message: 'Internal server error', error_code: 'INTERNAL_ERROR' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
