import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/utils/supabase/server';
import webpush from 'web-push';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// VAPID keys devem estar em variáveis de ambiente, nunca hardcoded
const VAPID_PUBLIC = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY!;

if (VAPID_PUBLIC && VAPID_PRIVATE) {
    webpush.setVapidDetails('mailto:admin@voltris.com', VAPID_PUBLIC, VAPID_PRIVATE);
}

export interface NotificationRequest {
    title: string;
    body: string;
    tag?: string;
    data?: Record<string, unknown>;
    type?: 'ticket' | 'order' | 'system' | 'profile' | 'newsletter' | 'comment';
    userId?: string;
    sound?: string;
    icon?: string;
    badge?: string;
    actions?: Array<{ action: string; title: string; icon?: string }>;
    requireInteraction?: boolean;
}

export async function POST(request: NextRequest) {
    // SEGURANÇA: Exigir autenticação de admin
    const supabaseAuth = await createServerClient();
    const { data: { user } } = await supabaseAuth.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

    if (!profile?.is_admin) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (!VAPID_PUBLIC || !VAPID_PRIVATE) {
        return NextResponse.json({ error: 'Push notifications not configured' }, { status: 503 });
    }

    try {
        const notification: NotificationRequest = await request.json();

        if (!notification.title || !notification.body) {
            return NextResponse.json({ error: 'Título e corpo são obrigatórios' }, { status: 400 });
        }

        // Sanitizar inputs
        const safeTitle = String(notification.title).substring(0, 100);
        const safeBody = String(notification.body).substring(0, 500);

        let query = supabase.from('push_subscriptions').select('*').eq('is_active', true);
        if (notification.userId) {
            // Validar UUID
            if (!/^[0-9a-f-]{36}$/i.test(notification.userId)) {
                return NextResponse.json({ error: 'userId inválido' }, { status: 400 });
            }
            query = query.eq('user_id', notification.userId);
        }

        const { data: subscriptions, error: fetchError } = await query;

        if (fetchError) {
            return NextResponse.json({ error: 'Erro ao buscar inscrições' }, { status: 500 });
        }

        if (!subscriptions || subscriptions.length === 0) {
            return NextResponse.json({ success: true, sent: 0, total: 0 });
        }

        const payload = JSON.stringify({
            title: safeTitle,
            body: safeBody,
            tag: notification.tag || 'voltris-notification',
            data: notification.data || {},
            type: notification.type || 'general',
            icon: '/logo-v2.webp',
            badge: '/logo-v2.webp',
            requireInteraction: notification.requireInteraction || false,
            sound: notification.sound || 'ping',
        });

        const sendPromises = subscriptions.map(async (subscription: any) => {
            try {
                await webpush.sendNotification(
                    { endpoint: subscription.endpoint, keys: { p256dh: subscription.p256dh, auth: subscription.auth } },
                    payload
                );
                await supabase.from('push_subscriptions').update({ last_used: new Date().toISOString() }).eq('id', subscription.id);
                return { success: true };
            } catch (error: any) {
                if (error?.statusCode === 410) {
                    await supabase.from('push_subscriptions').update({ is_active: false }).eq('id', subscription.id);
                }
                return { success: false };
            }
        });

        const results = await Promise.allSettled(sendPromises);
        const successful = results.filter(r => r.status === 'fulfilled' && (r as any).value.success).length;

        return NextResponse.json({ success: true, sent: successful, total: subscriptions.length });
    } catch (error) {
        console.error('[send-notification] Erro:', error);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    // SEGURANÇA: Exigir autenticação de admin
    const supabaseAuth = await createServerClient();
    const { data: { user } } = await supabaseAuth.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
    if (!profile?.is_admin) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        let query = supabase.from('push_subscriptions').select('device_type, platform, is_active, created_at');
        if (userId) {
            if (!/^[0-9a-f-]{36}$/i.test(userId)) {
                return NextResponse.json({ error: 'userId inválido' }, { status: 400 });
            }
            query = query.eq('user_id', userId);
        }

        const { data: subscriptions, error } = await query;
        if (error) return NextResponse.json({ error: 'Erro ao buscar dados' }, { status: 500 });

        const stats = {
            total: subscriptions?.length || 0,
            active: subscriptions?.filter((s: any) => s.is_active).length || 0,
        };

        return NextResponse.json({ success: true, stats });
    } catch {
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}
