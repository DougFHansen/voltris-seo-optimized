import { NextRequest, NextResponse } from 'next/server';
import { createCheckout, getPaymentLink } from '@/lib/pagbank-client';
import { PagBankCheckoutRequest } from '@/types/pagbank';

// Schema de validação simples (zod seria ideal, mas vou fazer manual para reduzir deps extras aqui)
function validateBody(body: any) {
    if (!body.items || body.items.length === 0) return 'Itens são obrigatórios';
    if (!body.customer) return 'Dados do cliente são obrigatórios';
    if (!body.customer.tax_id) return 'CPF/CNPJ do cliente é obrigatório';
    return null;
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // 1. Validação Básica
        const error = validateBody(body);
        if (error) {
            return NextResponse.json({ error }, { status: 400 });
        }

        // 2. Construir Payload para o PagBank
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

        // Referência única do pedido (ideal: gerar UUID ou pegar do DB)
        const referenceId = body.reference_id || `ORDER-${Date.now()}`;

        const checkoutData: PagBankCheckoutRequest = {
            reference_id: referenceId,
            customer: {
                name: body.customer.name,
                email: body.customer.email,
                tax_id: body.customer.tax_id.replace(/\D/g, ''), // Remove formatação
                phones: [
                    {
                        country: "55",
                        area: body.customer.phone_area || "11", // Ideal vir do front
                        number: body.customer.phone_number || "999999999",
                        type: "MOBILE"
                    }
                ]
            },
            items: body.items.map((item: any) => ({
                reference_id: item.id,
                name: item.name,
                quantity: item.quantity || 1,
                unit_amount: Math.round(item.price * 100) // Converte R$ para centavos
            })),
            notification_urls: [
                `${baseUrl}/api/webhook/pagbank`
            ],
            redirect_url: `${baseUrl}/dashboard?checkout_success=true&ref=${referenceId}`,
            payment_methods: [
                { type: "CREDIT_CARD" },
                { type: "PIX" },
                { type: "BOLETO" }
            ]
        };

        // 3. Chamar PagBank (Server-to-Server)
        console.log('🔄 Criando Checkout PagBank:', referenceId);
        const checkoutResponse = await createCheckout(checkoutData);

        // 4. Extrair Link de Pagamento
        const paymentUrl = getPaymentLink(checkoutResponse);

        if (!paymentUrl) {
            throw new Error('Link de pagamento não retornado pelo PagBank');
        }

        // 5. Retornar URL para o Front-end
        return NextResponse.json({
            success: true,
            checkout_url: paymentUrl,
            order_id: checkoutResponse.id,
            reference_id: referenceId
        });

    } catch (error: any) {
        console.error('❌ Erro no Checkout:', error.message);
        return NextResponse.json(
            { error: 'Falha ao criar pagamento', details: error.message },
            { status: 500 }
        );
    }
}
