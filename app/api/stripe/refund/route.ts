import { stripe } from '@/lib/stripe';
import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        const supabaseAdmin = createAdminClient();

        // 1. Buscar o customer_id
        const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('stripe_customer_id')
            .eq('id', user.id)
            .single();

        let customerId = profile?.stripe_customer_id;

        if (!customerId) {
            const customers = await stripe.customers.list({ email: user.email!, limit: 1 });
            if (customers.data.length > 0) {
                customerId = customers.data[0].id;
                await supabaseAdmin.from('profiles').update({ stripe_customer_id: customerId }).eq('id', user.id);
            }
        }

        if (!customerId) {
            return NextResponse.json({ error: 'Nenhum histórico de compras encontrado na Stripe.' }, { status: 404 });
        }

        // 2. Buscar a última cobrança (charge) com sucesso
        const charges = await stripe.charges.list({
            customer: customerId,
            limit: 10
        });

        const latestCharge = charges.data.find(c => c.status === 'succeeded' && !c.refunded);

        if (!latestCharge) {
            return NextResponse.json({ error: 'Nenhuma cobrança válida encontrada para reembolso.' }, { status: 404 });
        }

        // 3. Verificar o prazo de 7 dias de garantia
        const createdDate = new Date(latestCharge.created * 1000);
        const now = new Date();
        const diffDays = (now.getTime() - createdDate.getTime()) / (1000 * 3600 * 24);

        if (diffDays > 7) {
            return NextResponse.json({ error: 'O prazo de garantia de 7 dias expirou para esta compra.' }, { status: 400 });
        }

        // 4. Executar o Reembolso na Stripe
        await stripe.refunds.create({
            charge: latestCharge.id,
            reason: 'requested_by_customer'
        });

        // 5. Se estiver atrelado a uma assinatura, cancelar a assinatura Imediatamente
        if (latestCharge.invoice) {
            const invoice = await stripe.invoices.retrieve(latestCharge.invoice as string);
            if (invoice.subscription) {
                // Cancela na hora
                await stripe.subscriptions.cancel(invoice.subscription as string);
            }
        }

        // 6. Desativar acessos no Supabase
        await supabaseAdmin.from('licenses')
            .update({ is_active: false })
            .eq('email', user.email!);

        await supabaseAdmin.from('subscriptions')
            .update({ status: 'CANCELED', updated_at: new Date().toISOString() })
            .eq('email', user.email!);

        // Atualizar status do pagamento
        await supabaseAdmin.from('payments')
            .update({ status: 'refunded' })
            .eq('email', user.email!);

        return NextResponse.json({ success: true, message: 'Reembolso processado com sucesso. Acesso bloqueado.' });

    } catch (error: any) {
        console.error('[STRIPE REFUND ERROR]', error.message);
        return NextResponse.json({ error: error.message || 'Erro ao processar o reembolso.' }, { status: 500 });
    }
}
