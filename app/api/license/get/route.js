import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const maxDuration = 30;

/**
 * API para obter licença gerada
 * 
 * GET /api/license/get?preference_id=...&payment_id=...&email=...
 * 
 * Retorna a licença associada a um pagamento, se existir
 */
export async function GET(request) {
  const requestId = `license-get-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  
  console.log(`[LICENSE GET ${requestId}] ========== INICIANDO ==========`);

  try {
    const { searchParams } = new URL(request.url);
    
    const preferenceId = searchParams.get('preference_id');
    const paymentId = searchParams.get('payment_id');
    const email = searchParams.get('email');
    
    console.log(`[LICENSE GET ${requestId}] Parâmetros recebidos:`, {
      preference_id: preferenceId || 'ausente',
      payment_id: paymentId || 'ausente',
      email: email || 'ausente',
    });
    
    // Validar parâmetros
    if (!preferenceId && !paymentId && !email) {
      console.error(`[LICENSE GET ${requestId}] Nenhum parâmetro fornecido`);
      return NextResponse.json(
        { error: 'preference_id, payment_id ou email é obrigatório' },
        { status: 400 }
      );
    }
    
    // Conectar ao Supabase com service role (para bypass RLS)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error(`[LICENSE GET ${requestId}] Supabase não configurado`);
      return NextResponse.json(
        { error: 'Erro de configuração do servidor' },
        { status: 500 }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Buscar pagamento
    console.log(`[LICENSE GET ${requestId}] Buscando pagamento...`);
    
    let paymentQuery = supabase
      .from('payments')
      .select(`
        id,
        preference_id,
        payment_id,
        email,
        license_type,
        amount,
        currency,
        status,
        processed_at,
        created_at
      `);
    
    // Prioridade de busca: preferenceId > paymentId > email
    // Se tiver preferenceId, usar ele (mais confiável)
    if (preferenceId) {
      paymentQuery = paymentQuery.eq('preference_id', preferenceId);
    } 
    // Se não tiver preferenceId mas tiver paymentId, usar payment_id da tabela
    else if (paymentId) {
      paymentQuery = paymentQuery.eq('payment_id', paymentId);
    } 
    // Se nenhum dos dois, buscar por email
    else if (email) {
      paymentQuery = paymentQuery
        .eq('email', email)
        .order('created_at', { ascending: false })
        .limit(1);
    }
    
    const { data: payment, error: paymentError } = await paymentQuery.single();
    
    if (paymentError || !payment) {
      console.log(`[LICENSE GET ${requestId}] Pagamento não encontrado`);
      return NextResponse.json(
        { 
          error: 'Pagamento não encontrado',
          payment_found: false,
        },
        { status: 404 }
      );
    }
    
    console.log(`[LICENSE GET ${requestId}] Pagamento encontrado:`, {
      id: payment.id,
      status: payment.status,
      email: payment.email,
      processed_at: payment.processed_at,
    });
    
    // Buscar licença associada ao pagamento
    console.log(`[LICENSE GET ${requestId}] Buscando licença...`);
    
    const { data: license, error: licenseError } = await supabase
      .from('licenses')
      .select(`
        id,
        license_key,
        license_type,
        max_devices,
        devices_in_use,
        expires_at,
        is_active,
        activated_at,
        created_at
      `)
      .eq('payment_id', payment.id)
      .single();
    
    // Se encontrou licença, retornar
    if (license && !licenseError) {
      console.log(`[LICENSE GET ${requestId}] ✅ Licença encontrada:`, license.license_key.substring(0, 20) + '...');
      
      return NextResponse.json({
        success: true,
        payment: {
          id: payment.id,
          preference_id: payment.preference_id,
          payment_id: payment.payment_id,
          email: payment.email,
          license_type: payment.license_type,
          amount: payment.amount,
          currency: payment.currency,
          status: payment.status,
          processed_at: payment.processed_at,
          created_at: payment.created_at,
        },
        license: {
          id: license.id,
          license_key: license.license_key,
          license_type: license.license_type,
          max_devices: license.max_devices,
          devices_in_use: license.devices_in_use,
          expires_at: license.expires_at,
          is_active: license.is_active,
          activated_at: license.activated_at,
          created_at: license.created_at,
        },
      });
    }
    
    // Se não encontrou licença mas pagamento foi aprovado, licença ainda está sendo gerada
    if (payment.status === 'approved' && payment.processed_at) {
      console.log(`[LICENSE GET ${requestId}] Pagamento aprovado mas licença ainda sendo gerada`);
      
      return NextResponse.json({
        success: false,
        payment: {
          id: payment.id,
          status: payment.status,
          email: payment.email,
          processed_at: payment.processed_at,
        },
        license: null,
        message: 'Pagamento aprovado. Sua licença está sendo gerada. Aguarde alguns segundos e tente novamente.',
        retry_after: 5, // segundos para tentar novamente
      });
    }
    
    // Se pagamento não foi aprovado
    console.log(`[LICENSE GET ${requestId}] Pagamento não aprovado:`, payment.status);
    
    return NextResponse.json({
      success: false,
      payment: {
        id: payment.id,
        status: payment.status,
        email: payment.email,
      },
      license: null,
      message: `Pagamento está com status "${payment.status}". Aguarde a aprovação para gerar sua licença.`,
    });
    
  } catch (error) {
    console.error(`[LICENSE GET ${requestId}] Erro fatal:`, {
      message: error.message,
      stack: error.stack,
    });
    
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: error.message,
      },
      { status: 500 }
    );
  }
}