import { stripe } from '@/lib/stripe';
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST() {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        // 1. Buscar o customer_id do Stripe no banco de dados (profiles ou subscriptions)
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('stripe_customer_id')
            .eq('id', user.id)
            .single();

        if (error || !profile?.stripe_customer_id) {
            // Se não tiver customer_id, tentamos buscar pelo email no Stripe
            const customers = await stripe.customers.list({ email: user.email!, limit: 1 });
            if (customers.data.length === 0) {
                return NextResponse.json({ error: 'Nenhuma assinatura ativa encontrada no Stripe.' }, { status: 404 });
            }
            
            // Atualiza o perfil com o ID encontrado para futuras consultas
            await supabase.from('profiles').update({ stripe_customer_id: customers.data[0].id }).eq('id', user.id);
            profile.stripe_customer_id = customers.data[0].id;
        }

        // 2. Criar a sessão do Billing Portal
        const session = await stripe.billingPortal.sessions.create({
            customer: profile.stripe_customer_id,
            return_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.voltris.com.br'}/dashboard`,
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error('[STRIPE PORTAL ERROR]', error.message);
        return NextResponse.json({ error: 'Erro ao conectar com o financeiro.' }, { status: 500 });
    }
}
