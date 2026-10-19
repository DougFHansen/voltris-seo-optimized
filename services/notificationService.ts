import { createClient } from '@supabase/supabase-js';
import webpush from 'web-push';
import { chavePublicaVapid } from '@/lib/vapid-keys';
import {
    NotificationKind,
    NotificationType,
    tipoParaGravacao,
} from '@/lib/notification-kinds';

// Configuração do cliente Supabase com Service Role para acesso irrestrito (backend)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('CRITICAL: Supabase keys missing in NotificationService');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Configuração Web Push (VAPID)
const vapidPrivate = process.env.VAPID_PRIVATE_KEY;
const pushConfigurado = !!vapidPrivate;

if (pushConfigurado) {
    webpush.setVapidDetails('mailto:admin@voltris.com', chavePublicaVapid(), vapidPrivate!);
} else {
    console.warn(
        '[NotificationService] VAPID_PRIVATE_KEY nao configurada: o Web Push (aviso com o site fechado) fica indisponivel. As notificacoes in-app continuam funcionando.'
    );
}

/** tipos novos do enum só existem depois de `notificacaocorrigida.sql` */
export interface NotificationCapabilities {
    /** As colunas action_url/data/audience existem. */
    richColumns: boolean;
    /** O enum aceita os tipos novos (license/service/refund). */
    richTypes: boolean;
    /** Web Push (VAPID) configurado no ambiente. */
    push: boolean;
}

let capsPromise: Promise<NotificationCapabilities> | null = null;

/**
 * Detecta, UMA vez, o que o banco real suporta.
 *
 * O sistema precisa funcionar ANTES e DEPOIS de `notificacaocorrigida.sql`
 * ser aplicado. Sem colunas novas, a notificação continua sendo gravada (com
 * o tipo base) — só perde o link de navegação e o tipo refinado.
 */
export function capabilitiesDoBanco(): Promise<NotificationCapabilities> {
    if (!capsPromise) {
        capsPromise = (async (): Promise<NotificationCapabilities> => {
            let richColumns = false;
            let richTypes = false;
            try {
                const { error } = await supabase
                    .from('notifications')
                    .select('id, action_url, data, audience')
                    .limit(1);
                richColumns = !error;
                if (richColumns) {
                    // Testa se o enum aceita 'license'.
                    //
                    // Dois erros possíveis e MUITO diferentes:
                    //  - 22P02 "invalid input value for enum": o valor NÃO
                    //    existe -> resposta definitiva, e vale cachear.
                    //  - 55P04 "unsafe use of new value": o valor existe mas
                    //    ainda não foi commitado (quem está aplicando o SQL
                    //    está no meio da transação) -> resposta TEMPORÁRIA,
                    //    NÃO pode ser cacheada, senão o sistema ficaria
                    //    achando para sempre que o tipo novo não existe.
                    const { error: erroTipo } = await supabase
                        .from('notifications')
                        .select('id')
                        .eq('type' as never, 'license' as never)
                        .limit(1);
                    if (!erroTipo) {
                        richTypes = true;
                    } else {
                        const msg = String(erroTipo.message ?? '');
                        const codigo = String((erroTipo as { code?: string }).code ?? '');
                        const definitivo = codigo === '22P02' || /invalid input value for enum/i.test(msg);
                        if (!definitivo) {
                            // Erro transitório: não cacheia, tenta de novo depois.
                            capsPromise = null;
                            console.warn(
                                '[NotificationService] tipos do enum ainda não disponíveis (provável transação em andamento):',
                                msg.slice(0, 120)
                            );
                        }
                    }
                }
            } catch (e) {
                console.error('[NotificationService] falha ao detectar capacidades do banco:', e);
                capsPromise = null;
            }
            const caps: NotificationCapabilities = {
                richColumns,
                richTypes,
                push: pushConfigurado,
            };
            console.log(
                `[NotificationService] capacidades: colunas=${caps.richColumns} tipos=${caps.richTypes} push=${caps.push}`
            );
            return caps;
        })();
    }
    return capsPromise;
}

/** Zera o cache de capacidades (usado em testes e após aplicar o SQL). */
export function resetarCapacidades(): void {
    capsPromise = null;
}

export interface TriggerNotificationOptions {
    recipients: string[];
    kind: NotificationKind;
    title: string;
    message: string;
    sound?: 'ping' | 'chime' | 'tone';
    data?: Record<string, unknown>;
    actionUrl?: string;
    /** 'user' (padrão) ou 'admin' (notificação de operação). */
    audience?: 'user' | 'admin';
}

/** Som padrão por tipo de negócio — compra/licença "toca" diferente de ticket. */
const SOM_PADRAO: Record<NotificationKind, 'ping' | 'chime' | 'tone'> = {
    purchase: 'chime',
    license: 'chime',
    service: 'chime',
    ticket: 'ping',
    ticket_reply: 'ping',
    refund: 'tone',
    subscription: 'chime',
    payment_failed: 'tone',
    newsletter: 'ping',
    profile: 'ping',
    system: 'ping',
};

/**
 * Serviço centralizado de notificações (in-app + Web Push).
 *
 * Regra de ouro: gravar a notificação NUNCA derruba o fluxo de negócio que a
 * originou. A exceção é quando a notificação É o objetivo (ex.: o admin
 * precisa saber do ticket novo) — aí o erro sobe e quem chamou decide.
 */
export const NotificationService = {
    /**
     * Dispara uma notificação completa (DB + Realtime + Push).
     * @param options Opções da notificação
     */
    async notify(options: TriggerNotificationOptions) {
        const recipients = (options.recipients ?? []).filter(Boolean);
        if (recipients.length === 0) return [];

        const caps = await capabilitiesDoBanco();
        const type = tipoParaGravacao(options.kind, caps.richTypes);
        const sound = options.sound ?? SOM_PADRAO[options.kind] ?? 'ping';
        const now = new Date().toISOString();

        const base = {
            user_id: null as unknown as string,
            title: options.title,
            message: options.message,
            type,
            read: false,
            sound,
            created_at: now,
        };

        const data = {
            ...(options.data ?? {}),
            kind: options.kind,
        };

        const rows = recipients.map((userId) => ({
            ...base,
            user_id: userId,
            ...(caps.richColumns
                ? {
                    action_url: options.actionUrl ?? null,
                    data,
                    audience: options.audience ?? 'user',
                    updated_at: now,
                }
                : {}),
        }));

        const { data: insertedData, error: dbError } = await supabase
            .from('notifications')
            .insert(rows)
            .select();

        if (dbError) {
            console.error('❌ Erro crítico ao persistir notificação:', dbError);
            throw new Error(`Falha ao persistir notificação: ${dbError.message}`);
        }

        // Web Push é efeito colateral: nunca derruba o fluxo.
        this.sendWebPush(options).catch((err) => {
            console.error('❌ Erro no envio de Web Push (background):', err);
        });

        return insertedData ?? [];
    },

    /**
     * Notifica os administradores ativos.
     *
     * `is_blocked`/`is_deleted` são respeitados: um admin bloqueado não deve
     * receber alerta de operação.
     */
    async notifyAdmins(options: Omit<TriggerNotificationOptions, 'recipients'>) {
        const { data: admins, error } = await supabase
            .from('profiles')
            .select('id')
            .eq('is_admin', true);

        if (error || !admins) {
            console.error('Erro ao buscar admins:', error);
            return [];
        }

        const ativos = admins.filter(
            (a) => (a as unknown as { is_blocked?: boolean }).is_blocked !== true
        );
        const ids = ativos.map((a) => a.id);
        if (ids.length === 0) return [];

        return this.notify({
            ...options,
            recipients: ids,
            audience: options.audience ?? 'admin',
        });
    },

    /**
     * Envio de Web Push (VAPID) para as inscrições ativas dos destinatários.
     */
    async sendWebPush(options: TriggerNotificationOptions) {
        if (!pushConfigurado) {
            // Sem VAPID não há Web Push — o in-app + Realtime continuam
            // funcionando. Não é erro, é ausência de configuração.
            return { enviados: 0, motivo: 'VAPID não configurado' };
        }

        const recipients = (options.recipients ?? []).filter(Boolean);
        if (recipients.length === 0) return { enviados: 0 };

        const { data: subscriptions, error: subError } = await supabase
            .from('push_subscriptions')
            .select('*')
            .in('user_id', recipients)
            .eq('is_active', true);

        if (subError) {
            console.error('Erro ao buscar inscrições push:', subError);
            return { enviados: 0 };
        }

        if (!subscriptions || subscriptions.length === 0) {
            return { enviados: 0, motivo: 'sem inscrições ativas' };
        }

        const payload = JSON.stringify({
            title: options.title,
            body: options.message,
            icon: '/logo-v2.webp',
            badge: '/logo.png',
            tag: `voltris-${options.kind}`,
            data: {
                url: options.actionUrl || '/',
                kind: options.kind,
                ...(options.data ?? {}),
            },
        });

        const results = await Promise.allSettled(
            subscriptions.map(async (sub) => {
                try {
                    await webpush.sendNotification(
                        {
                            endpoint: sub.endpoint,
                            keys: { p256dh: sub.p256dh, auth: sub.auth },
                        },
                        payload
                    );
                    await supabase
                        .from('push_subscriptions')
                        .update({ last_used: new Date().toISOString() })
                        .eq('id', sub.id);
                } catch (err: any) {
                    if (err?.statusCode === 410) {
                        console.warn(`⚠️ Inscrição expirada (410) para usuário ${sub.user_id}. Desativando...`);
                        await supabase
                            .from('push_subscriptions')
                            .update({ is_active: false })
                            .eq('id', sub.id);
                    } else {
                        throw err;
                    }
                }
            })
        );

        const enviados = results.filter((r) => r.status === 'fulfilled').length;
        console.log(`📊 Pushes enviados: ${enviados}/${subscriptions.length}`);
        return { enviados, total: subscriptions.length };
    },
};

export type { NotificationKind, NotificationType };
