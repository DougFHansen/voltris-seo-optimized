import { NextRequest, NextResponse } from 'next/server';
import { createCheckout, getPaymentLink } from '@/lib/pagbank-client';
import { PagBankCheckoutRequest } from '@/types/pagbank';

// Schema de validação simples
function validateBody(body: any) {
    if (!body.items || body.items.length === 0) return 'Itens são obrigatórios';
    // Removemos a obrigatoriedade estrita de tax_id para testes, deixando o Checkout pedir se precisar
    if (!body.customer || !body.customer.email) return 'Email do cliente é obrigatório';
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

        const referenceId = body.reference_id || `ORDER-${Date.now()}`;

        // Montagem do Customer simplificada para evitar erro de TAX_ID no Sandbox
        // Se quisermos enviar, precisamos garantir que é 100% válido.
        // Para este teste, enviaremos apenas Nome e Email.
        const customerPayload: any = {
            name: body.customer.name,
            email: body.customer.email,
        };

        // Se o tax_id for enviado e parecer válido (11 ou 14 digitos), tentamos incluir.
        // Caso contrário, omitimos para que o PagBank peça na tela ou aceite sem.
        if (body.customer.tax_id) {
            const cleanTaxId = body.customer.tax_id.replace(/\D/g, '');
            if (cleanTaxId.length === 11 || cleanTaxId.length === 14) {
                // customerPayload.tax_id = cleanTaxId; // COMENTADO: Forçando envio SEM tax_id para teste
            }
        }

        const checkoutData: PagBankCheckoutRequest = {
            reference_id: referenceId,
            customer: customerPayload,
            items: body.items.map((item: any) => ({
                reference_id: item.id,
                name: item.name,
                quantity: item.quantity || 1,
                unit_amount: Math.round(item.price * 100)
            })),
            notification_urls: [
                `${baseUrl}/api/webhook/pagbank`
            ],
            redirect_url: `${baseUrl}/dashboard?checkout_success=true&ref=${referenceId}`,
            // Removidos métodos específicos para deixar o PagBank decidir o default ou todos habilitados
        };

        console.log('🔄 Criando Checkout PagBank:', JSON.stringify(checkoutData, null, 2));

        const checkoutResponse = await createCheckout(checkoutData);

        const paymentUrl = getPaymentLink(checkoutResponse);

        if (!paymentUrl) {
            console.error('Resposta sem link:', checkoutResponse);
            throw new Error('Link de pagamento não retornado: ' + JSON.stringify(checkoutResponse));
        }

        return NextResponse.json({
            success: true,
            checkout_url: paymentUrl,
            order_id: checkoutResponse.id,
            reference_id: referenceId
        });

    } catch (error: any) {
        console.error('❌ Erro no Checkout:', error.message);
        // Tenta pegar mensagem detalhada do PagBank se disponível
        const details = error.response?.data || error.message;
        return NextResponse.json(
            { error: 'Falha ao criar pagamento', details },
            { status: 500 }
        );
    }
}
