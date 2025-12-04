import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

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
    const { subscription, userId, browserInfo }: PushSubscriptionRequest = await request.json();
    
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
    
    if (!userId || !browserInfo?.browserFingerprint) {
      return NextResponse.json(
        { success: false, message: 'Informações do navegador inválidas' },
        { status: 400 }
      );
    }
    
    // Verificar se já existe uma inscrição para este usuário neste navegador
    const { data: existingSubscription, error: checkError } = await supabase
      .from('push_subscriptions')
      .select('id, is_active, endpoint')
      .eq('user_id', userId)
      .eq('browser_fingerprint', browserInfo.browserFingerprint)
      .single();
    
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
        .update({
          endpoint: subscription.endpoint,
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
          user_agent: browserInfo.userAgent,
          platform: browserInfo.platform,
          device_type: browserInfo.deviceType,
          is_active: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingSubscription.id)
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
        .insert({
          user_id: userId,
          endpoint: subscription.endpoint,
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
          user_agent: browserInfo.userAgent,
          platform: browserInfo.platform,
          device_type: browserInfo.deviceType,
          browser_fingerprint: browserInfo.browserFingerprint,
          is_active: true
        })
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
        platform: result.platform,
        deviceType: result.device_type,
        isActive: result.is_active,
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
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const browserFingerprint = searchParams.get('browserFingerprint');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'userId é obrigatório' },
        { status: 400 }
      );
    }
    
    let query = supabase
      .from('push_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true);
    
    if (browserFingerprint) {
      query = query.eq('browser_fingerprint', browserFingerprint);
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
    const { subscriptionId, userId, browserFingerprint } = await request.json();
    
    if (!subscriptionId || !userId) {
      return NextResponse.json(
        { success: false, message: 'subscriptionId e userId são obrigatórios' },
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
    
    // Marcar como inativa em vez de deletar (soft delete)
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
    const { subscriptionId, userId, isActive } = await request.json();
    
    if (!subscriptionId || !userId || typeof isActive !== 'boolean') {
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
    
    // Atualizar status da inscrição
    const { error: updateError } = await supabase
      .from('push_subscriptions')
      .update({
        is_active: isActive,
        updated_at: new Date().toISOString()
      })
      .eq('id', subscriptionId);
    
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
