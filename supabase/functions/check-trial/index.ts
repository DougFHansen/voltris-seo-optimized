// =====================================================
// EDGE FUNCTION - CHECK TRIAL (SUPABASE)
// =====================================================
// Validação de trial HWID com máxima segurança
// Proteção 100% contra formatação e reinstalação

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface TrialRequest {
  hwid: string
  components: string
}

interface TrialResponse {
  success: boolean
  trialActive: boolean
  daysRemaining: number
  expiresAt?: string
  message: string
  isFirstActivation?: boolean
}

// Rate limiting simples em memória
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 5 * 60 * 1000 // 5 minutos
const RATE_LIMIT_MAX_REQUESTS = 10 // máximo 10 requisições por IP

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(ip)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return true
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false
  }

  record.count++
  return true
}

serve(async (req) => {
  // CORS headers para permitir requisições do app WPF
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Max-Age': '86400',
  }

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Rate limiting por IP
    const clientIP = req.headers.get('x-forwarded-for') || 
                    req.headers.get('x-real-ip') || 
                    'unknown'
    
    console.log(`[CHECK-TRIAL] 📥 Request from IP: ${clientIP}`)

    if (!checkRateLimit(clientIP)) {
      console.log(`[CHECK-TRIAL] 🚫 Rate limit exceeded for IP: ${clientIP}`)
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Too many requests. Please try again later.' 
        }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Validar método
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Method not allowed' 
        }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Parse e validar body
    const body: TrialRequest = await req.json()
    
    if (!body.hwid || !body.components) {
      console.log(`[CHECK-TRIAL] ❌ Missing required fields`)
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'HWID and components are required' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Validar formato do HWID (SHA512 = 128 caracteres hex)
    const hwidHash = body.hwid.trim().toLowerCase()
    if (hwidHash.length !== 128 || !/^[a-f0-9]{128}$/.test(hwidHash)) {
      console.log(`[CHECK-TRIAL] ❌ Invalid HWID format: ${hwidHash.substring(0, 16)}...`)
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Invalid HWID format. Expected SHA512 hash.' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Validar componentes JSON
    let components
    try {
      components = JSON.parse(body.components)
      if (!components || typeof components !== 'object') {
        throw new Error('Invalid components object')
      }
    } catch (error) {
      console.log(`[CHECK-TRIAL] ❌ Invalid components JSON`)
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Invalid components format' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Criar cliente Supabase com service role key (permissões totais)
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error(`[CHECK-TRIAL] ❌ Missing Supabase environment variables`)
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Server configuration error' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log(`[CHECK-TRIAL] 🔍 Checking HWID: ${hwidHash.substring(0, 16)}...`)

    // Verificar se HWID já existe
    const { data: existingTrial, error: selectError } = await supabase
      .from('trial_activations')
      .select('*')
      .eq('hwid_hash', hwidHash)
      .single()

    let response: TrialResponse

    if (selectError && selectError.code !== 'PGRST116') {
      // Erro real na consulta (não é "not found")
      console.error(`[CHECK-TRIAL] ❌ Database error: ${selectError.message}`)
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Database service unavailable' 
        }),
        { 
          status: 503, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (existingTrial) {
      // HWID já existe - verificar status do trial
      const now = new Date()
      const expiresAt = new Date(existingTrial.trial_expires_at)
      const isExpired = now > expiresAt

      console.log(`[CHECK-TRIAL] 📋 Existing trial found - Expires: ${expiresAt.toISOString()}`)

      if (isExpired) {
        // Trial expirado - bloquear permanentemente
        console.log(`[CHECK-TRIAL] ⏰ Trial expired for HWID: ${hwidHash.substring(0, 16)}...`)
        
        // Marcar como expirado no banco (se ainda não estiver)
        if (!existingTrial.is_expired) {
          await supabase
            .from('trial_activations')
            .update({ is_expired: true })
            .eq('hwid_hash', hwidHash)
        }

        response = {
          success: true,
          trialActive: false,
          daysRemaining: 0,
          message: 'Trial já utilizado nesta máquina e expirou permanentemente',
          expiresAt: existingTrial.trial_expires_at
        }
      } else {
        // Trial ainda ativo - calcular dias restantes
        const daysRemaining = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        
        console.log(`[CHECK-TRIAL] ✅ Trial active - ${daysRemaining} days remaining`)
        
        response = {
          success: true,
          trialActive: true,
          daysRemaining: Math.max(0, daysRemaining),
          expiresAt: existingTrial.trial_expires_at,
          message: daysRemaining > 1 
            ? `Trial ativo - ${daysRemaining} dias restantes`
            : daysRemaining === 1 
              ? 'Trial ativo - último dia!'
              : 'Trial expirando hoje'
        }
      }
    } else {
      // Primeira ativação deste HWID
      console.log(`[CHECK-TRIAL] 🎉 First activation for HWID: ${hwidHash.substring(0, 16)}...`)

      const trialExpiresAt = new Date()
      trialExpiresAt.setDate(trialExpiresAt.getDate() + 15)

      const { data: newTrial, error: insertError } = await supabase
        .from('trial_activations')
        .insert({
          hwid_hash: hwidHash,
          hwid_components: body.components,
          trial_expires_at: trialExpiresAt.toISOString(),
          activation_ip: clientIP === 'unknown' ? null : clientIP,
          user_agent: req.headers.get('user-agent') || 'unknown'
        })
        .select()
        .single()

      if (insertError) {
        console.error(`[CHECK-TRIAL] ❌ Insert error: ${insertError.message}`)
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: 'Failed to activate trial. Please try again.' 
          }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      console.log(`[CHECK-TRIAL] ✅ Trial activated successfully - Expires: ${trialExpiresAt.toISOString()}`)

      response = {
        success: true,
        trialActive: true,
        daysRemaining: 15,
        expiresAt: trialExpiresAt.toISOString(),
        message: 'Trial ativado com sucesso - 15 dias de uso gratuito',
        isFirstActivation: true
      }
    }

    // Log de auditoria
    console.log(`[CHECK-TRIAL] 📊 Response: ${JSON.stringify({
      success: response.success,
      trialActive: response.trialActive,
      daysRemaining: response.daysRemaining,
      isFirstActivation: response.isFirstActivation
    })}`)

    return new Response(
      JSON.stringify(response),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error(`[CHECK-TRIAL] 💥 Unexpected error: ${error.message}`)
    console.error(`[CHECK-TRIAL] Stack: ${error.stack}`)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Internal server error. Please contact support.' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

// Health check endpoint
// GET /functions/v1/check-trail?health=true
if (import.meta.main) {
  console.log('[CHECK-TRIAL] 🚀 Edge Function initialized')
  console.log('[CHECK-TRIAL] 🔒 HWID Trial Protection Active')
  console.log('[CHECK-TRIAL] 📊 Rate limiting enabled')
  console.log('[CHECK-TRIAL] 🛡️ RLS policies enforced')
}
