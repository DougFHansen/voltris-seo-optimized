import { stripe } from '@/lib/stripe';
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        // 1. Buscar a assinatura ativa do usuário
        // No Stripe, buscamos as assinaturas do cliente
        const { data: profile } = await supabase
            .from('profiles')
            .select('stripe_customer_id')
            .eq('id', user.id)
            .single();

        let customerId = profile?.stripe_customer_id;

        if (!customerId) {
            // Tenta buscar o cliente na Stripe pelo email como fallback inteligente
            const customers = await stripe.customers.list({ email: user.email!, limit: 1 });
            if (customers.data.length > 0) {
                customerId = customers.data[0].id;
                // Salva o ID no perfil para acessos futuros
                await supabase.from('profiles').update({ stripe_customer_id: customerId }).eq('id', user.id);
            }
        }

        if (!customerId) {
            return NextResponse.json({ error: 'Nenhuma assinatura encontrada para este usuário.' }, { status: 404 });
        }

        const subscriptions = await stripe.subscriptions.list({
            customer: customerId,
            status: 'active',
            limit: 1
        });

        if (subscriptions.data.length === 0) {
            return NextResponse.json({ error: 'Você não possui assinaturas ativas para cancelar.' }, { status: 404 });
        }

        const subscriptionId = subscriptions.data[0].id;

        // 2. Cancelar a assinatura (neste caso, cancela ao final do período para o usuário não perder o acesso que já pagou)
        await stripe.subscriptions.update(subscriptionId, {
            cancel_at_period_end: true,
        });

        return NextResponse.json({ success: true, message: 'Cancelamento agendado com sucesso.' });
    } catch (error: any) {
        console.error('[STRIPE CANCEL ERROR]', error.message);
        return NextResponse.json({ error: 'Erro ao processar o cancelamento.' }, { status: 500 });
    }
}
