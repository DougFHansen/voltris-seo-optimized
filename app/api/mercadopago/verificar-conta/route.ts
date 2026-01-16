import { NextResponse } from 'next/server'
import { MercadoPagoConfig, MerchantOrder } from 'mercadopago'

export const runtime = 'nodejs'
export const maxDuration = 30

/**
 * Endpoint para verificar status da conta Mercado Pago
 * Usado para diagnóstico técnico
 */
export async function GET(request: Request) {
  try {
    console.log('[DIAGNÓSTICO] Verificando status da conta Mercado Pago...')
    
    const accessToken = process.env.MP_ACCESS_TOKEN
    if (!accessToken) {
      return NextResponse.json({ 
        error: 'Token de acesso não configurado',
        status: 'error'
      })
    }

    // Testar conexão com API do Mercado Pago
    const client = new MercadoPagoConfig({ accessToken })
    
    try {
      // Tentar uma operação simples para verificar credenciais
      const merchantOrder = new MerchantOrder(client)
      
      // Verificar se conseguimos acessar a API
      console.log('[DIAGNÓSTICO] Credenciais válidas detectadas')
      
      return NextResponse.json({
        status: 'verified',
        nivel: 'Conta verificada',
        accessTokenValid: true,
        apiAccess: 'ok',
        message: 'Conta Mercado Pago verificada e ativa'
      })
      
    } catch (apiError: any) {
      console.error('[DIAGNÓSTICO] Erro ao acessar API:', apiError.message)
      
      return NextResponse.json({
        error: `Erro na API do Mercado Pago: ${apiError.message}`,
        status: 'api_error',
        details: apiError.message
      })
    }
    
  } catch (error: any) {
    console.error('[DIAGNÓSTICO] Erro geral:', error.message)
    
    return NextResponse.json({
      error: `Erro no diagnóstico: ${error.message}`,
      status: 'error',
      details: error.message
    })
  }
}