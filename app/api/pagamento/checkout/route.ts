import { NextRequest, NextResponse } from 'next/server';
import { createCheckout, getPaymentLink, createPlan, createPaymentLink } from '@/lib/pagbank-client';
import { createAdminClient } from '@/utils/supabase/admin';

/**
 * API DE CHECKOUT & ASSINATURA (HÍBRIDA)
 * 
 * Agora focada em automação total:
 * 1. Enterprise -> Checkout único (Vitalício)
 * 2. Standard/Pro -> Checkout de Assinatura (Mensal Recorrente)
 */

export async function POST(req: NextRequest) {
    const requestId = `checkout-${Date.now()}`;

    try {
        const body = await req.json();
        const { items, customer, license_type = 'pro', user_id } = body;

        if (!items || items.length === 0) return NextResponse.json({ error: 'Itens obrigatórios' }, { status: 400 });

        const supabase = createAdminClient();
        const referenceId = `VOLTRIS-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;
        const totalAmount = items.reduce((acc: number, item: any) => acc + (Number(item.price || 0) * (item.quantity || 1)), 0);

        console.log(`[CHECKOUT ${requestId}] 🛒 Criando Venda Única (Anual) para ${customer.email} (${license_type})`);

        // 1. PERSISTÊNCIA INICIAL NO BANCO
        try {
            await supabase.from('payments').insert([{
                reference_id: referenceId,
                user_id: user_id || null,
                email: customer.email,
                customer_name: (customer.name || 'Cliente Voltris').substring(0, 200),
                plan_type: license_type,
                amount: totalAmount,
                status: 'pending'
            }]);
        } catch (e) {
            console.error(`[CHECKOUT ${requestId}] ⚠️ Erro Supabase (não-bloqueante):`, e);
        }

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://voltris.com.br';
        const webhookToken = process.env.PAGBANK_WEBHOOK_AUTH_TOKEN;

        // 2. USO DE PAYMENT LINK (V3) - SEM EXIGÊNCIA DE ALLOWLIST V4
        const paymentLinkData = {
            name: `Licença ${license_type.toUpperCase()} - Voltris`,
            reference_id: referenceId,
            expiration_date: "2030-12-31T23:59:59-03:00",
            customer: { 
                name: customer.name || 'Cliente Voltris', 
                email: customer.email 
            },
            items: items.map((item: any) => ({
                reference_id: item.id || 'item-1',
                name: item.name,
                quantity: item.quantity || 1,
                unit_amount: Math.round(Number(item.price) * 100)
            })),
            payment_methods: [
                { type: 'CREDIT_CARD' }, 
                { type: 'PIX' }, 
                { type: 'BOLETO' }
            ],
            notification_urls: [`${baseUrl}/api/webhook/pagbank?auth=${webhookToken}`],
            redirect_url: `${baseUrl}/dashboard?checkout_success=true&ref=${referenceId}`,
        };

        const checkoutResponse = await createPaymentLink(paymentLinkData);
        const paymentUrl = getPaymentLink(checkoutResponse);

        if (!paymentUrl) {
            console.error(`[CHECKOUT] Falha Link response:`, checkoutResponse);
            throw new Error('Não foi possível gerar o link de pagamento do PagBank.');
        }

        return NextResponse.json({ success: true, checkout_url: paymentUrl, reference_id: referenceId });

    } catch (error: any) {
        console.error(`[CHECKOUT ${requestId}] 💥 Falha Crítica:`, error.message);
        return NextResponse.json({ 
            error: `Erro ao processar: ${error.message}`, 
            details: error.message 
        }, { status: 500 });
    }
}
