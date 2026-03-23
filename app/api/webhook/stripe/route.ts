import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createAdminClient } from '@/utils/supabase/admin';

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
    const payload = await req.text();
    const sig = req.headers.get('stripe-signature')!;

    let event;

    try {
        event = stripe.webhooks.constructEvent(payload, sig, WEBHOOK_SECRET!);
    } catch (err: any) {
        console.error(`⚠️ Webhook error: ${err.message}`);
        return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Eventos principais que nos interessam
    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object;
            const referenceId = session.metadata?.reference_id;
            const email = session.customer_email || session.metadata?.customer_email;
            const licenseType = session.metadata?.license_type;
            const userId = session.metadata?.user_id;

            console.log(`[STRIPE WEBHOOK] Checkout completado para ${email} (Ref: ${referenceId})`);

            // Atualiza status do pagamento no Supabase
            await supabase.from('payments')
                .update({ status: 'approved', pagbank_id: session.id }) // pagbank_id ainda usado como campo genérico ID transação
                .eq('reference_id', referenceId);

            // Chama o RPC para gerar a licença
            const { data, error } = await supabase.rpc('generate_complete_license_v3', {
                p_payment_id: null, // Opcional se for link direto
                p_user_id: userId,
                p_email: email,
                p_plan_type: licenseType
            });

            if (error) console.error('[STRIPE WEBHOOK] Erro ao gerar licença:', error);
            else console.log('[STRIPE WEBHOOK] ✅ Licença gerada com sucesso.');

            break;
        }

        case 'invoice.paid': {
            // Útil para renovações de assinatura automática
            const invoice = event.data.object;
            console.log(`[STRIPE WEBHOOK] Fatura paga para ${invoice.customer_email}`);
            // Aqui você dispararia a renovação de licença ou verificação
            break;
        }

        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
}
