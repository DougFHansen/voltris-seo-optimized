import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

/**
 * API para recuperar pagamento diretamente do Mercado Pago
 * útil quando o pagamento não foi salvo no banco local
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const preferenceId = searchParams.get('preference_id');
    
    if (!preferenceId) {
      return NextResponse.json({ 
        error: 'preference_id é necessário' 
      }, { status: 400 });
    }
    
    console.log('[RECUPERAR PAGAMENTO] Buscando preference_id:', preferenceId);
    
    // Configurar cliente Mercado Pago
    const accessToken = process.env.MP_ACCESS_TOKEN;
    if (!accessToken) {
      return NextResponse.json({ 
        error: 'MP_ACCESS_TOKEN não configurado' 
      }, { status: 500 });
    }
    
    const client = new MercadoPagoConfig({ accessToken });
    const preference = new Preference(client);
    
    try {
      // Buscar preferência no Mercado Pago
      const preferenceData: any = await preference.get({ id: preferenceId });
      
      console.log('[RECUPERAR PAGAMENTO] Preferência encontrada:', {
        id: preferenceData.id,
        init_point: preferenceData.init_point,
        items: preferenceData.items,
        back_urls: preferenceData.back_urls
      });
      
      // Verificar se tem payment_id associado
      let paymentInfo = null;
      if (preferenceData.id) {
        try {
          // Tentar buscar pagamentos associados a esta preferência
          paymentInfo = {
            message: 'Preferência encontrada mas pagamento precisa ser confirmado',
            preference_id: preferenceData.id,
            status: preferenceData.status || 'unknown',
            items: preferenceData.items
          };
        } catch (paymentError) {
          console.log('[RECUPERAR PAGAMENTO] Não foi possível buscar pagamento associado');
        }
      }
      
      return NextResponse.json({
        success: true,
        preference: {
          id: preferenceData.id,
          status: preferenceData.status || 'unknown',
          items: preferenceData.items,
          init_point: preferenceData.init_point,
          date_created: preferenceData.date_created
        },
        payment: paymentInfo,
        message: 'Preferência recuperada com sucesso do Mercado Pago'
      });
      
    } catch (mpError: any) {
      console.error('[RECUPERAR PAGAMENTO] Erro ao buscar no Mercado Pago:', mpError.message);
      return NextResponse.json({
        success: false,
        error: 'Não foi possível encontrar a preferência no Mercado Pago',
        message: mpError.message,
        preference_id: preferenceId
      }, { status: 404 });
    }
    
  } catch (error: any) {
    console.error('[RECUPERAR PAGAMENTO] Erro geral:', error);
    return NextResponse.json({
      error: error.message
    }, { status: 500 });
  }
}

/**
 * POST para criar manualmente um registro de pagamento no banco
 * baseado em uma preferência existente
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { preference_id, email, license_type = 'pro' } = body;
    
    if (!preference_id) {
      return NextResponse.json({ 
        error: 'preference_id é necessário' 
      }, { status: 400 });
    }
    
    console.log('[CRIAR PAGAMENTO MANUAL] Criando pagamento para preference_id:', preference_id);
    
    // Conectar ao Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ 
        error: 'Configuração do Supabase incompleta' 
      }, { status: 500 });
    }
    
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Criar registro de pagamento
    const { data: payment, error } = await supabase
      .from('payments')
      .insert({
        preference_id: preference_id,
        email: email || 'cliente@exemplo.com',
        license_type: license_type,
        amount: 1.00, // Valor padrão para testes
        currency: 'BRL',
        status: 'pending',
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error('[CRIAR PAGAMENTO MANUAL] Erro ao criar pagamento:', error);
      return NextResponse.json({
        error: 'Falha ao criar registro de pagamento',
        details: error
      }, { status: 500 });
    }
    
    console.log('[CRIAR PAGAMENTO MANUAL] Pagamento criado com sucesso:', payment.id);
    
    return NextResponse.json({
      success: true,
      payment: payment,
      message: 'Pagamento registrado com sucesso no banco'
    });
    
  } catch (error: any) {
    console.error('[CRIAR PAGAMENTO MANUAL] Erro geral:', error);
    return NextResponse.json({
      error: error.message
    }, { status: 500 });
  }
}