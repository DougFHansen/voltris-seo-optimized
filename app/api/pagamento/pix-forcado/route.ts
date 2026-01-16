import { NextResponse } from 'next/server'
import { MercadoPagoConfig, Preference } from 'mercadopago'

export const runtime = 'nodejs'
export const maxDuration = 30

/**
 * Endpoint PIX com configuração máxima para forçar aceitação
 * Estratégia: Permitir tudo exceto métodos explicitamente problemáticos
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, fullName, valor = 1.00 } = body
    
    console.log(`[PIX FORÇADO] Iniciando teste PIX FORÇADO para ${email}`)

    if (!email || !fullName) {
      return NextResponse.json({ 
        error: 'Email e nome completo são obrigatórios' 
      }, { status: 400 })
    }

    const accessToken = process.env.MP_ACCESS_TOKEN
    if (!accessToken) {
      return NextResponse.json({ 
        error: 'Token de acesso não configurado' 
      }, { status: 500 })
    }

    const client = new MercadoPagoConfig({ accessToken })
    const preference = new Preference(client)

    let dominio = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.voltris.com.br'
    dominio = dominio.replace(/\/$/, '')

    // CONFIGURAÇÃO MÁXIMA PARA PIX - Minimal exclusão
    const preferenceBody = {
      items: [
        {
          id: 'VOLTRIS-PIX-FORCADO-001',
          title: 'Licença PIX Voltris - Teste Forçado',
          description: 'Pagamento via PIX forçado - Teste técnico',
          category_id: 'computing',
          quantity: 1,
          currency_id: 'BRL',
          unit_price: valor,
        }
      ],
      back_urls: {
        success: `${dominio}/sucesso`,
        failure: `${dominio}/falha`,
        pending: `${dominio}/sucesso-pending`
      },
      auto_return: 'approved',
      notification_url: `${dominio}/api/webhook/mercadopago`,
      statement_descriptor: 'VOLTRIS PIX',
      payer: {
        email: email,
        name: fullName.split(' ')[0] || 'Cliente',
        surname: fullName.split(' ').slice(1).join(' ') || 'PIX'
      },
      external_reference: `pix-forcado-${Date.now()}`,
      
      // ESTRATÉGIA: Máximo de métodos disponíveis, mínimo de exclusões
      payment_methods: {
        // Excluir apenas o que é realmente problemático
        excluded_payment_types: [
          { id: 'ticket' },    // Boletos - problemáticos
          { id: 'atm' }        // Caixas eletrônicos - raramente usados
        ],
        // NÃO EXCLUIR PIX!!!
        // NÃO EXCLUIR CRÉDITO!!!
        // NÃO EXCLUIR DÉBITO!!!
        
        // Configurações PIX-friendly
        installments: 1,           // PIX é à vista
        default_installments: 1,   // Forçar 1 parcela
        
        // Permitir todos os binários/bancos para PIX
        // Mercado Pago decide automaticamente
      },
    }

    console.log('[PIX FORÇADO] Payload sendo enviado:')
    console.log(JSON.stringify({
      ...preferenceBody,
      items: preferenceBody.items,
      payment_methods: preferenceBody.payment_methods
    }, null, 2))

    const response = await preference.create({ body: preferenceBody })
    
    console.log('[PIX FORÇADO] SUCESSO - Preferência criada!')
    console.log('[PIX FORÇADO] init_point:', response.init_point?.substring(0, 100) + '...')
    console.log('[PIX FORÇADO] preference_id:', response.id)

    return NextResponse.json({
      init_point: response.init_point,
      preference_id: response.id,
      message: 'Preferência PIX FORÇADA criada com sucesso - vá para o checkout!'
    })

  } catch (error: any) {
    console.error('[PIX FORÇADO] ERRO FATAL:', error)
    
    // Log detalhado do erro
    if (error.cause) {
      console.error('[PIX FORÇADO] CAUSA RAIZ:', error.cause)
    }
    
    if (error.response?.data) {
      console.error('[PIX FORÇADO] RESPONSE DATA:', JSON.stringify(error.response.data, null, 2))
    }
    
    return NextResponse.json({
      error: `Erro crítico ao forçar PIX: ${error.message}`,
      details: {
        message: error.message,
        status: error.status || error.statusCode,
        cause: error.cause || 'não especificado'
      }
    }, { status: 500 })
  }
}