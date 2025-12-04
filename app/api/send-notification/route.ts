import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import webpush from 'web-push';

// Configuração do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Configurar VAPID keys
webpush.setVapidDetails(
  'mailto:admin@voltris.com', // Email do administrador
  'BK4sNuzXs5c-gbWfD52SSWS3ft4kj8Q6BNYKwC2nc9_tsgki3CYnVKsXLTLcFmvpWYP-m9HvGnZAQwTJnRTH4sI', // Chave pública
  '44N8AIXidbAylJT6ACgDm2J5vMfNdnu-b2aho9eSUZY' // Chave privada
);

export interface NotificationRequest {
  title: string;
  body: string;
  tag?: string;
  data?: Record<string, any>;
  type?: 'ticket' | 'order' | 'system' | 'profile' | 'newsletter' | 'comment';
  userId?: string; // Se especificado, envia apenas para este usuário
  sound?: string;
  icon?: string;
  badge?: string;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
  requireInteraction?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const notification: NotificationRequest = await request.json();
    
    console.log('📱 Enviando notificação push:', { 
      title: notification.title, 
      body: notification.body, 
      type: notification.type,
      userId: notification.userId 
    });
    
    // Validar dados obrigatórios
    if (!notification.title || !notification.body) {
      return NextResponse.json(
        { success: false, message: 'Título e corpo da notificação são obrigatórios' },
        { status: 400 }
      );
    }
    
    // Buscar inscrições push ativas
    let query = supabase
      .from('push_subscriptions')
      .select('*')
      .eq('is_active', true);
    
    // Se um usuário específico foi especificado, filtrar por ele
    if (notification.userId) {
      query = query.eq('user_id', notification.userId);
    }
    
    const { data: subscriptions, error: fetchError } = await query;
    
    if (fetchError) {
      console.error('❌ Erro ao buscar inscrições push:', fetchError);
      return NextResponse.json(
        { success: false, message: 'Erro ao buscar inscrições push' },
        { status: 500 }
      );
    }
    
    // Se não houver inscrições, retornar sucesso
    if (!subscriptions || subscriptions.length === 0) {
      console.log('⚠️ Nenhuma inscrição push ativa encontrada');
      return NextResponse.json({ 
        success: true, 
        message: 'Notificação processada (sem inscrições ativas)',
        sent: 0,
        total: 0
      });
    }
    
    console.log(`📤 Enviando notificação para ${subscriptions.length} dispositivo(s)`);
    
    // Preparar payload da notificação
    const payload = JSON.stringify({
      title: notification.title,
      body: notification.body,
      tag: notification.tag || 'voltris-notification',
      data: notification.data || {},
      type: notification.type || 'general',
      icon: notification.icon || '/logo-v2.webp',
      badge: notification.badge || '/logo-v2.webp',
      actions: notification.actions || [
        {
          action: 'view',
          title: 'Ver mais',
          icon: '/logo-v2.webp'
        },
        {
          action: 'close',
          title: 'Fechar',
          icon: '/logo-v2.webp'
        }
      ],
      requireInteraction: notification.requireInteraction || false,
      sound: notification.sound || 'ping'
    });
    
    // Enviar notificação para todas as inscrições
    const sendPromises = subscriptions.map(async (subscription) => {
      try {
        const pushSubscription = {
          endpoint: subscription.endpoint,
          keys: {
            p256dh: subscription.p256dh,
            auth: subscription.auth
          }
        };
        
        await webpush.sendNotification(pushSubscription, payload);
        
        // Atualizar timestamp de uso
        await supabase
          .from('push_subscriptions')
          .update({ last_used: new Date().toISOString() })
          .eq('id', subscription.id);
        
        console.log('✅ Notificação enviada para:', subscription.endpoint);
        return { 
          success: true, 
          endpoint: subscription.endpoint,
          deviceType: subscription.device_type,
          platform: subscription.platform
        };
      } catch (error) {
        console.error('❌ Erro ao enviar para:', subscription.endpoint, error);
        
        // Se a inscrição falhou, marcar como inativa
        if (error instanceof Error && error.message.includes('410')) {
          await supabase
            .from('push_subscriptions')
            .update({ is_active: false })
            .eq('id', subscription.id);
          console.log('🔄 Inscrição marcada como inativa:', subscription.id);
        }
        
        return { 
          success: false, 
          endpoint: subscription.endpoint, 
          error: error instanceof Error ? error.message : 'Erro desconhecido' 
        };
      }
    });
    
    const results = await Promise.allSettled(sendPromises);
    const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
    const failed = results.length - successful;
    
    // Log detalhado dos resultados
    console.log(`📊 Resultado do envio: ${successful} sucessos, ${failed} falhas`);
    
    // Processar resultados para estatísticas
    const deviceStats = results
      .filter(r => r.status === 'fulfilled' && r.value.success)
      .map(r => (r as PromiseFulfilledResult<any>).value)
      .reduce((acc, result) => {
        const deviceType = result.deviceType || 'unknown';
        acc[deviceType] = (acc[deviceType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
    
    return NextResponse.json({
      success: true,
      message: `Notificação enviada com sucesso`,
      sent: successful,
      failed: failed,
      total: subscriptions.length,
      deviceStats,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Erro interno ao enviar notificação:', error);
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
    
    // Buscar estatísticas de inscrições push
    let query = supabase
      .from('push_subscriptions')
      .select('device_type, platform, is_active, created_at');
    
    if (userId) {
      query = query.eq('user_id', userId);
    }
    
    const { data: subscriptions, error } = await query;
    
    if (error) {
      console.error('❌ Erro ao buscar estatísticas:', error);
      return NextResponse.json(
        { success: false, message: 'Erro ao buscar estatísticas' },
        { status: 500 }
      );
    }
    
    // Processar estatísticas
    const stats = {
      total: subscriptions?.length || 0,
      active: subscriptions?.filter(s => s.is_active).length || 0,
      inactive: subscriptions?.filter(s => !s.is_active).length || 0,
      byDeviceType: {} as Record<string, number>,
      byPlatform: {} as Record<string, number>
    };
    
    subscriptions?.forEach(sub => {
      // Contar por tipo de dispositivo
      const deviceType = sub.device_type || 'unknown';
      stats.byDeviceType[deviceType] = (stats.byDeviceType[deviceType] || 0) + 1;
      
      // Contar por plataforma
      const platform = sub.platform || 'unknown';
      stats.byPlatform[platform] = (stats.byPlatform[platform] || 0) + 1;
    });
    
    return NextResponse.json({
      success: true,
      stats,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Erro interno ao buscar estatísticas:', error);
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
