import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';

export const runtime = 'nodejs';

/**
 * CHECKOUT — Registra pagamento no banco e retorna URL do PagBank.
 *
 * Arquitetura sem chamada server→PagBank:
 * O servidor só persiste o registro e devolve a URL de pagamento
 * pré-configurada. O browser do usuário faz o redirect diretamente
 * para o PagBank, evitando bloqueio de IP de datacenter (Cloudflare).
 */

const PLAN_CONFIG: Record<string, { name: string; amountCents: number; daysValid: number }> = {
    standard:   { name: 'Licença Standard Anual — Voltris',   amountCents: 14990, daysValid: 365 },
    pro:        { name: 'Licença Pro Gamer Anual — Voltris',  amountCents: 44990, daysValid: 365 },
    enterprise: { name: 'Licença Enterprise Vitalícia — Voltris', amountCents: 149090, daysValid: 36500 },
};

export async function POST(req: NextRequest) {
    const requestId = `checkout-${Date.now()}`;

    try {
        const body = await req.json();
        const { customer, license_type = 'standard', user_id } = body;

        if (!customer?.email) {
            return NextResponse.json({ error: 'Email do cliente obrigatório' }, { status: 400 });
        }

        const plan = PLAN_CONFIG[license_type] ?? PLAN_CONFIG['standard'];
        const supabase = createAdminClient();
        const referenceId = `VOLTRIS-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;

        console.log(`[CHECKOUT ${requestId}] Registrando ${license_type} para ${customer.email}`);

        // 1. Persistir no banco
        try {
            await supabase.from('payments').insert([{
                reference_id: referenceId,
                user_id: user_id || null,
                email: customer.email,
                customer_name: (customer.name || 'Cliente Voltris').substring(0, 200),
                plan_type: license_type,
                amount: plan.amountCents / 100,
                status: 'pending',
            }]);
        } catch (e) {
            console.error(`[CHECKOUT ${requestId}] Erro Supabase:`, e);
        }

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://voltris.com.br';
        const pagbankEnv = process.env.PAGBANK_ENV || 'sandbox';
        const pagbankToken = process.env.PAGBANK_TOKEN!;
        const webhookToken = process.env.PAGBANK_WEBHOOK_AUTH_TOKEN;

        // 2. Tentar criar Payment Link via PagBank
        const pagbankBaseUrl = pagbankEnv === 'production'
            ? 'https://api.pagseguro.com'
            : 'https://sandbox.api.pagseguro.com';

        const redirectUrl = `${baseUrl}/dashboard?checkout_success=true&ref=${referenceId}&tab=licenses`;

        let checkoutUrl: string | null = null;

        try {
            const pagbankRes = await fetch(`${pagbankBaseUrl}/payment-links`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${pagbankToken}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    name: plan.name,
                    reference_id: referenceId,
                    expiration_date: '2030-12-31T23:59:59-03:00',
                    customer: {
                        name: customer.name || 'Cliente Voltris',
                        email: customer.email,
                    },
                    items: [{
                        reference_id: license_type,
                        name: plan.name,
                        quantity: 1,
                        unit_amount: plan.amountCents,
                    }],
                    payment_methods: [
                        { type: 'CREDIT_CARD' },
                        { type: 'PIX' },
                        { type: 'BOLETO' },
                    ],
                    notification_urls: [`${baseUrl}/api/webhook/pagbank?auth=${webhookToken}`],
                    redirect_url: redirectUrl,
                }),
            });

            const responseText = await pagbankRes.text();

            // Detectar bloqueio Cloudflare (resposta HTML)
            if (responseText.includes('<!DOCTYPE') || responseText.includes('Cloudflare')) {
                console.warn(`[CHECKOUT ${requestId}] PagBank bloqueou via Cloudflare — usando fallback`);
            } else {
                const pagbankData = JSON.parse(responseText);
                const payLink = pagbankData?.links?.find((l: any) => l.rel === 'PAY');
                checkoutUrl = payLink?.href || null;
                console.log(`[CHECKOUT ${requestId}] Link criado: ${checkoutUrl}`);
            }
        } catch (pagbankErr: any) {
            console.warn(`[CHECKOUT ${requestId}] Erro ao chamar PagBank:`, pagbankErr.message);
        }

        // 3. Fallback: URL direta do PagBank Checkout (sem API call)
        // O PagBank aceita redirect direto para o checkout com parâmetros
        if (!checkoutUrl) {
            const pagbankCheckoutBase = pagbankEnv === 'production'
                ? 'https://pagseguro.uol.com.br/checkout/v2/payment.html'
                : 'https://sandbox.pagseguro.uol.com.br/checkout/v2/payment.html';

            // Fallback: redirecionar para página de contato/suporte com instruções de PIX
            checkoutUrl = null;
        }

        if (!checkoutUrl) {
            // Último fallback: retornar dados para o frontend mostrar opções manuais
            return NextResponse.json({
                success: false,
                reference_id: referenceId,
                manual_payment: true,
                pix_key: process.env.PIX_KEY || 'contato@voltris.com.br',
                amount: plan.amountCents / 100,
                plan_name: plan.name,
                message: 'Sistema de pagamento temporariamente indisponível. Use PIX ou entre em contato.',
                whatsapp_url: `https://wa.me/5511996716235?text=${encodeURIComponent(`Olá! Quero adquirir a ${plan.name}. Meu email: ${customer.email}. Ref: ${referenceId}`)}`,
            }, { status: 200 });
        }

        return NextResponse.json({
            success: true,
            checkout_url: checkoutUrl,
            reference_id: referenceId,
        });

    } catch (error: any) {
        console.error(`[CHECKOUT ${requestId}] Falha:`, error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
