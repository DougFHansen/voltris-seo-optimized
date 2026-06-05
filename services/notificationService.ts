import { createClient } from '@supabase/supabase-js';
import webpush from 'web-push';

// Configuração do cliente Supabase com Service Role para acesso irrestrito (backend)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('CRITICAL: Supabase keys missing in NotificationService');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Configuração Web Push (VAPID)
if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
    webpush.setVapidDetails(
        'mailto:admin@voltris.com',
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY
    );
}

export type NotificationType = 'ticket' | 'order' | 'system' | 'profile' | 'newsletter' | 'comment' | 'ticket_status';

export interface TriggerNotificationOptions {
    recipients: string[]; // Array de user_ids
    title: string;
    message: string;
    type: NotificationType;
    sound?: 'ping' | 'chime' | 'tone';
    data?: Record<string, any>; // Metadados extras (link, id do pedido, etc)
    actionUrl?: string; // URL para redirecionamento ao clicar (push)
}

/**
 * Serviço centralizado de notificações Enterprise
 * Garante consistência entre DB, Realtime e Push
 */
export const NotificationService = {

    /**
     * Dispara uma notificação completa (DB + Realtime + Push)
     * @param options Opções da notificação
     */
    async notify(options: TriggerNotificationOptions) {
        console.log(`🔔 NotificationService: Disparando notificação [${options.type}] para ${options.recipients.length} usuários`);

        // 1. Persistir no Banco de Dados (Fonte da Verdade)
        // Isso acionará automaticamente o Supabase Realtime para quem estiver ouvindo a tabela 'notifications'
        const notificationsToInsert = options.recipients.map(userId => ({
            user_id: userId,
            title: options.title,
            message: options.message,
            type: options.type,
            read: false,
            sound: options.sound || 'ping',
            created_at: new Date().toISOString()
            // Note: A tabela atual não tem coluna 'data' JSONB, então metadados extras de negócio
            // não são salvos na tabela notifications nesta versão do schema.
            // O frontend deve derivar navegação com base no 'type' ou mensagens padrão,
            // ou devemos alterar o schema. Por segurança, mantemos compatibilidade com schema atual.
        }));

        const { data: insertedData, error: dbError } = await supabase
            .from('notifications')
            .insert(notificationsToInsert)
            .select();

        if (dbError) {
            console.error('❌ Erro crítico ao persistir notificação:', dbError);
            // Em sistema enterprise, poderíamos jogar numa fila de retry (Dead Letter Queue)
            // Aqui, lançamos erro para o caller tratar (abortar transação se necessário)
            throw new Error(`Falha ao persistir notificação: ${dbError.message}`);
        }

        // 2. Disparar Web Push (Async / Fire-and-Forget)
        // Não bloqueamos o retorno da função pelo push, pois é um efeito colateral
        this.sendWebPush(options).catch(err => {
            console.error('❌ Erro no envio de Web Push (background):', err);
        });

        console.log('✅ Notificações persistidas e enviadas para fila de push.');
        return insertedData;
    },

    /**
     * Método interno para gerenciar envio de Push Notifications
     */
    async sendWebPush(options: TriggerNotificationOptions) {
        // Buscar inscrições ativas apenas dos destinatários
        const { data: subscriptions, error: subError } = await supabase
            .from('push_subscriptions')
            .select('*')
            .in('user_id', options.recipients)
            .eq('is_active', true);

        if (subError) {
            console.error('Erro ao buscar inscrições push:', subError);
            return;
        }

        if (!subscriptions || subscriptions.length === 0) {
            console.log('ℹ️ Nenhuma subscrição push ativa encontrada para os destinatários.');
            return;
        }

        const payload = JSON.stringify({
            title: options.title,
            body: options.message,
            icon: '/logo-v2.webp', // Ícone padrão
            tag: `voltris-${options.type}-${Date.now()}`,
            data: {
                url: options.actionUrl || '/',
                ...options.data
            }
        });

        console.log(`📤 Enviando ${subscriptions.length} pushes...`);

        const results = await Promise.allSettled(subscriptions.map(async sub => {
            try {
                await webpush.sendNotification({
                    endpoint: sub.endpoint,
                    keys: {
                        p256dh: sub.p256dh,
                        auth: sub.auth
                    }
                }, payload);

                // Opcional: Atualizar last_used
                await supabase
                    .from('push_subscriptions')
                    .update({ last_used: new Date().toISOString() })
                    .eq('id', sub.id);

            } catch (err: any) {
                // Tratar erro 410 (Gone) -> Remover/Inativar inscrição
                if (err.statusCode === 410) {
                    console.warn(`⚠️ Inscrição expirada (410) para usuário ${sub.user_id}. Desativando...`);
                    await supabase
                        .from('push_subscriptions')
                        .update({ is_active: false })
                        .eq('id', sub.id);
                } else {
                    throw err;
                }
            }
        }));

        const successCount = results.filter(r => r.status === 'fulfilled').length;
        console.log(`📊 Pushes enviados: ${successCount}/${subscriptions.length}`);
    },

    /**
     * Helper para notificar Admins
     */
    async notifyAdmins(options: Omit<TriggerNotificationOptions, 'recipients'>) {
        // Buscar IDs de todos os admins
        const { data: admins, error } = await supabase
            .from('profiles')
            .select('id')
            .eq('is_admin', true);

        if (error || !admins) {
            console.error('Erro ao buscar admins:', error);
            return;
        }

        const adminIds = admins.map(a => a.id);
        if (adminIds.length === 0) return;

        return this.notify({
            ...options,
            recipients: adminIds
        });
    }
};
