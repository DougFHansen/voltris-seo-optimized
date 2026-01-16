import { NextResponse } from 'next/server'
import { MercadoPagoConfig, Preference } from 'mercadopago'

export const runtime = 'nodejs'
export const maxDuration = 30

/**
 * Endpoint específico para testes PIX
 * Configuração otimizada para método PIX
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, fullName, metodo, valor } = body
    
    console.log(`[PIX ESPECÍFICO] Iniciando teste PIX para ${email}`)

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

    // Configuração específica para PIX
    const client = new MercadoPagoConfig({ accessToken })
    const preference = new Preference(client)

    // Domínio do site
    let dominio = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.voltris.com.br'
    dominio = dominio.replace(/\/$/, '')

    // Configuração otimizada para PIX
    const preferenceBody = {
      items: [
        {
          id: 'VOLTRIS-PIX-TESTE-001',
          title: 'Teste PIX Voltris Optimizer',
          description: 'Pagamento de teste específico para método PIX',
          category_id: 'computing',
          quantity: 1,
          currency_id: 'BRL',
          unit_price: valor || 1.00,
        }
      ],
      back_urls: {
        success: `${dominio}/sucesso`,
        failure: `${dominio}/falha`,
        pending: `${dominio}/sucesso-pending`
      },
      auto_return: 'approved',
      notification_url: `${dominio}/api/webhook/mercadopago`,
      statement_descriptor: 'VOLTRIS PIX TESTE',
      payer: {
        email: email,
        name: fullName.split(' ')[0],
        surname: fullName.split(' ').slice(1).join(' ') || 'Teste'
      },
      external_reference: `pix-teste-${Date.now()}`,
      // Configuração específica para PIX
      payment_methods: {
        excluded_payment_types: [
          { id: 'ticket' },
          { id: 'atm' },
          { id: 'debit_card' }  // Excluir débito online
        ],
        // Não excluir PIX - manter como disponível
        installments: 1,
        default_installments: 1,
      },
    }

    console.log('[PIX ESPECÍFICO] Criando preferência com configuração PIX otimizada...')
    
    const response = await preference.create({ body: preferenceBody })
    
    console.log('[PIX ESPECÍFICO] Preferência criada com sucesso!')
    console.log('[PIX ESPECÍFICO] Métodos disponíveis:', response.payment_methods)

    return NextResponse.json({
      init_point: response.init_point,
      preference_id: response.id,
      message: 'Preferência PIX criada com sucesso'
    })

  } catch (error: any) {
    console.error('[PIX ESPECÍFICO] Erro:', error.message)
    
    return NextResponse.json({
      error: `Erro ao criar preferência PIX: ${error.message}`,
      details: error.message
    }, { status: 500 })
  }
}