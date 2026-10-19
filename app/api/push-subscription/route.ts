import { NextRequest, NextResponse } from 'next/server';
import { colunasPush, somenteColunas } from '@/lib/push-schema';
import { createClient } from '@/utils/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

// Configuração do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createSupabaseClient(supabaseUrl, supabaseServiceKey);

export interface PushSubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export interface PushSubscriptionRequest {
  subscription: PushSubscriptionData;
  userId: string;
  browserInfo: {
    userAgent: string;
    platform: string;
    deviceType: 'desktop' | 'mobile' | 'tablet';
    browserFingerprint: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    // SEGURANÇA: exigir sessão — o user_id é derivado da sessão autenticada,
    // nunca do corpo da requisição (impede cadastrar inscrição em nome de outro usuário).
    const supabaseSession = await createClient();
    const { data: { user } } = await supabaseSession.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Login required' },
        { status: 401 }
      );
    }
    const userId = user.id;

    const { subscription, browserInfo }: PushSubscriptionRequest = await request.json();
    
    console.log('📱 Nova inscrição push recebida:', {
      userId,
      endpoint: subscription.endpoint,
      platform: browserInfo.platform,
      deviceType: browserInfo.deviceType
    });
    
    // Validar dados obrigatórios
    if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
      return NextResponse.json(
        { success: false, message: 'Dados de inscrição inválidos' },
        { status: 400 }
      );
    }
    
    if (!browserInfo?.browserFingerprint) {
      return NextResponse.json(
        { success: false, message: 'Informações do navegador inválidas' },
        { status: 400 }
      );
    }
    
    // Verificar se já existe uma inscrição para este usuário neste navegador
    // Schema real detectado: a tabela de producao pode ser a versao ANTIGA
    // (sem is_active/browser_fingerprint). Usar so as colunas que existem.
    const cols = await colunasPush();
    const colsLeitura = ['id', 'endpoint'].filter((c) => cols.has(c)).join(', ') || 'id';
    let queryExistente = supabase
        .from('push_subscriptions')
        .select(colsLeitura)
        .eq('user_id', userId);
    if (cols.has('browser_fingerprint') && browserInfo?.browserFingerprint) {
        queryExistente = queryExistente.eq('browser_fingerprint', browserInfo.browserFingerprint);
    }
    const { data: existentes, error: checkError } = await queryExistente.limit(1);
    const existingSubscription: any = (existentes ?? [])[0] ?? null;
    
    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('❌ Erro ao verificar inscrição existente:', checkError);
      return NextResponse.json(
        { success: false, message: 'Erro ao verificar inscrição existente' },
        { status: 500 }
      );
    }
    
    let result;
    
    if (existingSubscription) {
      // Atualizar inscrição existente
      console.log('🔄 Atualizando inscrição existente:', existingSubscription.id);
      
      const { data: updatedSubscription, error: updateError } = await supabase
        .from('push_subscriptions')
            .update(somenteColunas(cols, {
                endpoint: subscription.endpoint,
                p256dh: subscription.keys.p256dh,
                auth: subscription.keys.auth,
                user_agent: browserInfo.userAgent,
                platform: browserInfo.platform,
                device_type: browserInfo.deviceType,
                browser_fingerprint: browserInfo.browserFingerprint,
                is_active: true,
            }))
            .eq('id', existingSubscription.id)
        .eq('user_id', userId)
        .select()
        .single();
      
      if (updateError) {
        console.error('❌ Erro ao atualizar inscrição:', updateError);
        return NextResponse.json(
          { success: false, message: 'Erro ao atualizar inscrição' },
          { status: 500 }
        );
      }
      
      result = updatedSubscription;
      console.log('✅ Inscrição atualizada com sucesso');
      
    } else {
      // Criar nova inscrição
      console.log('🆕 Criando nova inscrição para usuário:', userId);
      
      const { data: newSubscription, error: insertError } = await supabase
        .from('push_subscriptions')
        .insert(somenteColunas(cols, {
            user_id: userId,
            endpoint: subscription.endpoint,
            p256dh: subscription.keys.p256dh,
            auth: subscription.keys.auth,
            user_agent: browserInfo.userAgent,
            platform: browserInfo.platform,
            device_type: browserInfo.deviceType,
            browser_fingerprint: browserInfo.browserFingerprint,
            is_active: true,
        }))
        .select()
        .single();
      
      if (insertError) {
        console.error('❌ Erro ao criar inscrição:', insertError);
        return NextResponse.json(
          { success: false, message: 'Erro ao criar inscrição' },
          { status: 500 }
        );
      }
      
      result = newSubscription;
      console.log('✅ Nova inscrição criada com sucesso');
    }
    
    // Retornar sucesso com detalhes da inscrição
    return NextResponse.json({
      success: true,
      message: existingSubscription ? 'Inscrição atualizada com sucesso' : 'Nova inscrição criada com sucesso',
      subscription: {
        id: result.id,
        endpoint: result.endpoint,
        // A tabela pode ser a versao ANTIGA (sem estas colunas): o que nao
        // existe e reportado de forma explicita, sem quebrar a resposta.
        platform: cols.has('platform') ? result.platform : null,
        deviceType: cols.has('device_type') ? result.device_type : null,
        isActive: cols.has('is_active') ? result.is_active : true,
        createdAt: result.created_at
      }
    });
    
  } catch (error) {
    console.error('❌ Erro interno ao processar inscrição push:', error);
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // SEGURANÇA: exigir sessão — o user_id é derivado da sessão autenticada
    const supabaseSession = await createClient();
    const { data: { user } } = await supabaseSession.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Login required' },
        { status: 401 }
      );
    }
    const userId = user.id;

    const { searchParams } = new URL(request.url);
    const browserFingerprint = searchParams.get('browserFingerprint');
    
    const cols = await colunasPush();
    let query = supabase
      .from('push_subscriptions')
      .select('*')
      .eq('user_id', userId)

    if (browserFingerprint) {
        if (cols.has('browser_fingerprint') && browserFingerprint) {
            query = query.eq('browser_fingerprint', browserFingerprint);
        }
    }
    
    const { data: subscriptions, error } = await query;
    
    if (error) {
      console.error('❌ Erro ao buscar inscrições:', error);
      return NextResponse.json(
        { success: false, message: 'Erro ao buscar inscrições' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      subscriptions: subscriptions || [],
      count: subscriptions?.length || 0
    });
    
  } catch (error) {
    console.error('❌ Erro interno ao buscar inscrições:', error);
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // SEGURANÇA: exigir sessão — o user_id é derivado da sessão autenticada
    const supabaseSession = await createClient();
    const { data: { user } } = await supabaseSession.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Login required' },
        { status: 401 }
      );
    }
    const userId = user.id;

    const { subscriptionId } = await request.json();
    
    if (!subscriptionId) {
      return NextResponse.json(
        { success: false, message: 'subscriptionId é obrigatório' },
        { status: 400 }
      );
    }
    
    // Verificar se a inscrição pertence ao usuário
    const { data: subscription, error: checkError } = await supabase
      .from('push_subscriptions')
      .select('id, user_id')
      .eq('id', subscriptionId)
      .single();
    
    if (checkError || !subscription) {
      return NextResponse.json(
        { success: false, message: 'Inscrição não encontrada' },
        { status: 404 }
      );
    }
    
    if (subscription.user_id !== userId) {
      return NextResponse.json(
        { success: false, message: 'Acesso negado' },
        { status: 403 }
      );
    }
    
    // Marcar como inativa em vez de deletar (soft delete).
    //
    // Se a tabela de producao for a versao ANTIGA (sem `is_active`), a
    // desativacao nao existe: nesse caso a inscricao e REMOVIDA de verdade —
    // do contrario o navegador continuaria recebendo avisos apos o
    // "Desativar".
    const colsDelete = await colunasPush();
    if (colsDelete.has('is_active')) {
        const { error: updateError } = await supabase
            .from('push_subscriptions')
            .update({
                is_active: false,
                updated_at: new Date().toISOString()
            })
            .eq('id', subscriptionId);

        if (updateError) {
            console.error('❌ Erro ao desativar inscrição:', updateError);
            return NextResponse.json(
                { success: false, message: 'Erro ao desativar inscrição' },
                { status: 500 }
            );
        }
        console.log('✅ Inscrição desativada com sucesso:', subscriptionId);
    } else {
        const { error: deleteError } = await supabase
            .from('push_subscriptions')
            .delete()
            .eq('id', subscriptionId);
        if (deleteError) {
            console.error('❌ Erro ao remover inscrição:', deleteError);
            return NextResponse.json(
                { success: false, message: 'Erro ao remover inscrição' },
                { status: 500 }
            );
        }
        console.log('✅ Inscrição removida (tabela sem is_active):', subscriptionId);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Inscrição desativada com sucesso'
    });
    
  } catch (error) {
    console.error('❌ Erro interno ao desativar inscrição:', error);
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // SEGURANÇA: exigir sessão — o user_id é derivado da sessão autenticada
    const supabaseSession = await createClient();
    const { data: { user } } = await supabaseSession.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Login required' },
        { status: 401 }
      );
    }
    const userId = user.id;

    const { subscriptionId, isActive } = await request.json();
    
    if (!subscriptionId || typeof isActive !== 'boolean') {
      return NextResponse.json(
        { success: false, message: 'Dados inválidos para atualização' },
        { status: 400 }
      );
    }
    
    // Verificar se a inscrição pertence ao usuário
    const { data: subscription, error: checkError } = await supabase
      .from('push_subscriptions')
      .select('id, user_id')
      .eq('id', subscriptionId)
      .single();
    
    if (checkError || !subscription) {
      return NextResponse.json(
        { success: false, message: 'Inscrição não encontrada' },
        { status: 404 }
      );
    }
    
    if (subscription.user_id !== userId) {
      return NextResponse.json(
        { success: false, message: 'Acesso negado' },
        { status: 403 }
      );
    }
    
    // Atualizar status da inscrição.
    //
    // Se a tabela for a versão ANTIGA (sem `is_active`), não existe status:
    // "ativar" é um no-op e "desativar" remove a inscrição (senão o navegador
    // continuaria recebendo avisos).
    const colsToggle = await colunasPush();
    let updateError: { message: string } | null = null;

    if (colsToggle.has('is_active')) {
        const r = await supabase
            .from('push_subscriptions')
            .update({
                is_active: isActive,
                updated_at: new Date().toISOString()
            })
            .eq('id', subscriptionId);
        updateError = r.error as { message: string } | null;
    } else if (!isActive) {
        const r = await supabase
            .from('push_subscriptions')
            .delete()
            .eq('id', subscriptionId);
        updateError = r.error as { message: string } | null;
    }
    
    if (updateError) {
      console.error('❌ Erro ao atualizar inscrição:', updateError);
      return NextResponse.json(
        { success: false, message: 'Erro ao atualizar inscrição' },
        { status: 500 }
      );
    }
    
    console.log('✅ Status da inscrição atualizado:', subscriptionId, 'isActive:', isActive);
    
    return NextResponse.json({
      success: true,
      message: 'Status da inscrição atualizado com sucesso',
      isActive
    });
    
  } catch (error) {
    console.error('❌ Erro interno ao atualizar inscrição:', error);
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}