import { NextRequest, NextResponse } from 'next/server';
import { createCheckout, getPaymentLink } from '@/lib/pagbank-client';
import { PagBankCheckoutRequest } from '@/types/pagbank';
import { createAdminClient } from '@/utils/supabase/admin';

/**
 * API DE CHECKOUT PAGBANK (PRODUÇÃO)
 * 
 * Este endpoint cria o registro no banco de dados ANTES de enviar ao PagBank
 * e processa a criação do checkout para redirecionamento.
 */

export async function POST(req: NextRequest) {
    const requestId = `checkout-${Date.now()}`;

    try {
        const body = await req.json();
        const { items, customer, license_type = 'pro', user_id } = body;

        // 1. VALIDAÇÃO DE INPUT
        if (!items || items.length === 0) return NextResponse.json({ error: 'Itens obrigatórios' }, { status: 400 });
        if (!customer || !customer.email) return NextResponse.json({ error: 'Email obrigatório' }, { status: 400 });

        // 2. SANITIZAÇÃO DE CPF (TAX_ID) - REQUISITO 4
        let cleanTaxId = '';
        if (customer.tax_id) {
            cleanTaxId = customer.tax_id.replace(/\D/g, '');
            if (cleanTaxId.length !== 11 && cleanTaxId.length !== 14) {
                return NextResponse.json({ error: 'CPF/CNPJ inválido' }, { status: 400 });
            }
        }

        const supabase = createAdminClient();
        const referenceId = `VOLTRIS-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;

        // Calcular total
        const totalAmount = items.reduce((acc: number, item: any) => acc + (Number(item.price || 0) * (item.quantity || 1)), 0);

        console.log(`[CHECKOUT ${requestId}] 🔍 Preparando inserção no Supabase para ${customer.email}`);

        // 3. PERSISTÊNCIA ANTERIOR (REQUISITO 2)
        // Tentamos salvar, mas se falhar não travamos o pagamento do cliente (Fail-soft)
        try {
            const { error: dbError } = await supabase
                .from('payments')
                .insert([{
                    reference_id: referenceId,
                    user_id: user_id || null,
                    email: customer.email,
                    customer_name: (customer.name || 'Cliente Voltris').substring(0, 200),
                    customer_tax_id: cleanTaxId || null,
                    plan_type: license_type || 'pro',
                    amount: totalAmount,
                    status: 'pending'
                }]);

            if (dbError) {
                console.error(`[CHECKOUT ${requestId}] ⚠️ Erro não bloqueante Supabase:`, dbError);
            }
        } catch (e) {
            console.error(`[CHECKOUT ${requestId}] ⚠️ Falha na conexão Supabase:`, e);
        }

        // 4. CONSTRUÇÃO DO PAYLOAD PAGBANK
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://voltris.com.br';
        const webhookToken = process.env.PAGBANK_WEBHOOK_AUTH_TOKEN;

        // Limpar telefone (Remover tudo que não é dígito)
        const cleanPhone = (customer.phone || '').replace(/\D/g, '');
        const phoneArea = cleanPhone.substring(0, 2);
        const phoneNumber = cleanPhone.substring(2);

        const customerPayload: any = {
            name: (customer.name || 'Comprador de Testes').substring(0, 60),
            email: customer.email,
        };

        // FORÇA BRUTA: Se for sandbox, nunca envia tax_id para não travar o teste
        if (process.env.PAGBANK_ENV === 'sandbox') {
            console.log(`[CHECKOUT ${requestId}] 🛠️ Sandbox Mode: Removendo tax_id para evitar erro.`);
            // tax_id removido
        } else if (cleanTaxId && (cleanTaxId.length === 11 || cleanTaxId.length === 14)) {
            customerPayload.tax_id = cleanTaxId;
        }

        // Só adicionar fone se tiver o formato mínimo (DDD + 8 ou 9 dígitos)
        if (phoneArea && phoneNumber.length >= 8) {
            customerPayload.phones = [{
                type: 'MOBILE',
                country: '55',
                area: phoneArea,
                number: phoneNumber
            }];
        }

        const checkoutData: PagBankCheckoutRequest = {
            reference_id: referenceId,
            customer: customerPayload,
            items: items.map((item: any) => ({
                reference_id: item.id || 'item-1',
                name: item.name,
                quantity: item.quantity || 1,
                unit_amount: Math.round(Number(item.price) * 100) // Garante centavos e evita decimais
            })),
            notification_urls: [
                `${baseUrl}/api/webhook/pagbank?auth=${webhookToken}`
            ],
            redirect_url: `${baseUrl}/dashboard?checkout_success=true&ref=${referenceId}`,
        };

        console.log(`[CHECKOUT ${requestId}] 🔄 Criando Checkout no PagBank...`);
        const checkoutResponse = await createCheckout(checkoutData);
        const paymentUrl = getPaymentLink(checkoutResponse);

        if (!paymentUrl) {
            throw new Error('Link de pagamento não retornado pelo PagBank');
        }

        return NextResponse.json({
            success: true,
            checkout_url: paymentUrl,
            reference_id: referenceId
        });

    } catch (error: any) {
        console.error(`[CHECKOUT ${requestId}] 💥 Erro:`, error.message);
        return NextResponse.json(
            { error: 'Falha ao processar checkout', details: error.message },
            { status: 500 }
        );
    }
}
