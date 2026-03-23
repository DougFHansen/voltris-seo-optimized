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

        console.log(`[CHECKOUT ${requestId}] 🛒 Iniciando processamento para ${customer.email} (${license_type})`);

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

        // 2. LÓGICA DE ASSINATURA vs VENDA ÚNICA
        const isRecurring = license_type === 'standard' || license_type === 'pro';

        if (isRecurring) {
            console.log(`[CHECKOUT ${requestId}] 🔄 Criando ASSINATURA RECORRENTE`);
            
            // a) Tentar obter ou criar o PLANO no PagBank
        const { planId, error: planError } = await ensurePlan(license_type, totalAmount, supabase, baseUrl, webhookToken);
            
        if (!planId) {
            throw new Error(`Falha ao criar plano no PagBank: ${planError || 'Erro desconhecido'}`);
        }

        // b) Criar LINK DE PAGAMENTO DE ASSINATURA (Hosted Page)
        // IMPORTANTE: PagBank não permite "items" e "subscription" simultâneos.
        const payload = {
            name: `Assinatura - ${license_type.toUpperCase()}`,
            description: `Acesso Mensal - ${license_type.toUpperCase()}`,
            reference_id: referenceId,
            payment_methods: [{ type: 'CREDIT_CARD' as const }],
            subscription: {
                plan: { id: planId }
            },
            customer: {
                name: customer.name || 'Cliente Voltris',
                email: customer.email
            },
            notification_urls: [`${baseUrl}/api/webhook/pagbank?auth=${webhookToken}`],
            redirect_url: `${baseUrl}/dashboard?checkout_success=true&ref=${referenceId}`
        };

        try {
            const linkRes = await createPaymentLink(payload);
            const checkoutUrl = linkRes.links?.find((l: any) => l.rel === 'PAY')?.href;

            if (!checkoutUrl) throw new Error('O PagBank retornou sucesso mas não forneceu o link de pagamento (PAY)');

            return NextResponse.json({ success: true, checkout_url: checkoutUrl, reference_id: referenceId });
        } catch (err: any) {
            const pgError = err.response?.data || err.message;
            throw new Error(`PagBank recusou criação do link: ${JSON.stringify(pgError)}`);
        }

    } else {
        // ... (resto do código de venda única)
        console.log(`[CHECKOUT ${requestId}] 💳 Criando VENDA ÚNICA (ENTERPRISE/VITALÍCIO)`);
        
        const checkoutData = {
            reference_id: referenceId,
            customer: { name: customer.name || 'Cliente Voltris' as string, email: customer.email as string },
            items: items.map((item: any) => ({
                reference_id: item.id || 'item-1',
                name: item.name,
                quantity: item.quantity || 1,
                unit_amount: Math.round(Number(item.price) * 100)
            })),
            payment_methods: [
                { type: 'CREDIT_CARD' as const }, 
                { type: 'PIX' as const }, 
                { type: 'BOLETO' as const }
            ],
            notification_urls: [`${baseUrl}/api/webhook/pagbank?auth=${webhookToken}`],
            redirect_url: `${baseUrl}/dashboard?checkout_success=true&ref=${referenceId}`,
        };

        const checkoutResponse = await createCheckout(checkoutData);
        const paymentUrl = getPaymentLink(checkoutResponse);

        return NextResponse.json({ success: true, checkout_url: paymentUrl, reference_id: referenceId });
    }

} catch (error: any) {
    console.error(`[CHECKOUT ${requestId}] 💥 Falha Crítica:`, error.message);
    return NextResponse.json({ 
        error: error.message, 
        details: error.message 
    }, { status: 500 });
}
}

/** 
* Garante que o plano mensal existe no PagBank para o tipo de licença 
*/
async function ensurePlan(type: string, amount: number, supabase: any, baseUrl: string, webhookToken: string | undefined): Promise<{ planId: string | null, error?: string }> {
try {
    const { data: existing, error: dbError } = await supabase.from('pagbank_plans').select('pagbank_plan_id').eq('plan_type', type).maybeSingle();
    
    if (dbError) throw new Error(`Banco de dados: ${dbError.message}`);
    if (existing) return { planId: existing.pagbank_plan_id };

    console.log(`[PLAN] Criando novo plano no PagBank: ${type}`);
    const planPayload = {
        reference_id: `VOLTRIS-PLAN-${type.toUpperCase()}`,
        name: `Voltris Optimizer - ${type.toUpperCase()} Mensal`,
        interval: { unit: 'MONTH', length: 1 },
        amount: { value: Math.round(amount * 100), currency: 'BRL' },
        payment_methods: ['CREDIT_CARD'],
        notification_urls: [`${baseUrl}/api/webhook/pagbank?auth=${webhookToken}`]
    };

    const plan = await createPlan(planPayload);
    
    if (!plan?.id) {
        throw new Error('Resposta do PagBank não contém ID do plano');
    }

    const { error: insertError } = await supabase.from('pagbank_plans').insert({
        plan_type: type,
        pagbank_plan_id: plan.id,
        name: planPayload.name,
        amount_cents: planPayload.amount.value
    });

    if (insertError) {
        console.warn('[PLAN SUPABASE ERROR] Erro ao salvar plano localmente:', insertError.message);
        // Retornamos o ID mesmo se falhar em salvar, para não travar o checkout agora
    }

    return { planId: plan.id };
} catch (e: any) {
    const errorMsg = e.response?.data ? JSON.stringify(e.response.data) : e.message;
    console.error('[PLAN CREATE ERROR]', errorMsg);
    return { planId: null, error: errorMsg };
}
}
