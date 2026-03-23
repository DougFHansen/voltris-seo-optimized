import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export const runtime = 'nodejs';

/**
 * Cria test users (vendedor e comprador) no Mercado Pago
 * Necessário para testar pagamentos no sandbox — APENAS ADMIN
 */
export async function POST(request: Request) {
  // SEGURANÇA: Apenas admins podem criar test users
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
  if (!profile?.is_admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const debugId = `create-users-${Date.now()}`;

  try {
    const accessToken = process.env.MP_ACCESS_TOKEN;

    if (!accessToken) {
      return NextResponse.json({ error: 'MP_ACCESS_TOKEN não configurado' }, { status: 500 });
    }

    // Criar test user VENDEDOR
    const sellerResponse = await fetch('https://api.mercadopago.com/users/test_user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        site_id: 'MLB', // Brasil
      }),
    });

    if (!sellerResponse.ok) {
      const errorData = await sellerResponse.text();
      console.error(`[CREATE TEST USERS] Erro ao criar vendedor:`, errorData);
      throw new Error(`Erro ao criar vendedor: ${sellerResponse.status} - ${errorData}`);
    }

    const seller = await sellerResponse.json();
    console.log(`[CREATE TEST USERS] Vendedor criado:`, {
      id: seller.id,
      email: seller.email,
      nickname: seller.nickname,
    });

    // Criar test user COMPRADOR
    console.log(`[CREATE TEST USERS] Criando COMPRADOR...`);
    const buyerResponse = await fetch('https://api.mercadopago.com/users/test_user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        site_id: 'MLB', // Brasil
      }),
    });

    if (!buyerResponse.ok) {
      const errorData = await buyerResponse.text();
      console.error(`[CREATE TEST USERS] Erro ao criar comprador:`, errorData);
      throw new Error(`Erro ao criar comprador: ${buyerResponse.status} - ${errorData}`);
    }

    const buyer = await buyerResponse.json();
    console.log(`[CREATE TEST USERS] Comprador criado:`, {
      id: buyer.id,
      email: buyer.email,
      nickname: buyer.nickname,
    });

    const result = {
      success: true,
      debug_id: debugId,
      timestamp: new Date().toISOString(),
      
      vendedor: {
        id: seller.id,
        email: seller.email,
        password: seller.password,
        nickname: seller.nickname,
        site_status: seller.site_status,
        verification_code_formula: `Últimos 6 dígitos do ID: ${seller.id.toString().slice(-6)}`,
      },
      
      comprador: {
        id: buyer.id,
        email: buyer.email,
        password: buyer.password,
        nickname: buyer.nickname,
        site_status: buyer.site_status,
        verification_code_formula: `Últimos 6 dígitos do ID: ${buyer.id.toString().slice(-6)}`,
      },
      
      instrucoes: {
        passo_1: '✅ SALVE estas credenciais em local seguro!',
        passo_2: 'Use o VENDEDOR apenas para receber pagamentos (já configurado com seu token)',
        passo_3: 'Use o COMPRADOR para fazer login no checkout e pagar',
        passo_4: 'Código de verificação = últimos 6 dígitos do ID do usuário',
        passo_5: 'Não tente pagar usando o mesmo usuário vendedor!',
      },
      
      teste_agora: {
        url_teste: 'https://www.voltris.com.br/teste-cartao-mp',
        usar_comprador: {
          email: buyer.email,
          password: buyer.password,
          verification_code: buyer.id.toString().slice(-6),
        },
      },
    };

    console.log(`[CREATE TEST USERS] ========== SUCESSO ${debugId} ==========`);
    console.log(JSON.stringify(result, null, 2));

    return NextResponse.json(result, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (error: any) {
    console.error(`[CREATE TEST USERS] ========== ERRO ${debugId} ==========`);
    console.error(`[CREATE TEST USERS] Mensagem:`, error.message);
    console.error(`[CREATE TEST USERS] Stack:`, error.stack);
    
    return NextResponse.json({
      success: false,
      debug_id: debugId,
      error: error.message,
      stack: error.stack,
    }, {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
