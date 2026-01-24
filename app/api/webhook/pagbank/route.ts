import { NextRequest, NextResponse } from 'next/server';
import { PagBankWebhookEvent } from '@/types/pagbank';

// Handler para receber notificações do PagSeguro (Webhook)
export async function POST(req: NextRequest) {
    try {
        const event: PagBankWebhookEvent = await req.json();

        // 1. Validação de Segurança (Opcional: Verificar IP de origem ou assinatura se disponível)
        // O PagBank v4 envia token no header 'x-authenticity-token' se configurado no painel?
        // Por padrão, devemos confiar no ID e consultar a API para confirmar status "Callback Confirmation".
        // AQUI SIMPLIFICAMOS para demonstração.

        const { id, reference_id, status } = event.data;
        console.log(`🔔 Webhook PagBank Recebido: [${event.notification_type}] Pedido #${reference_id} -> Status: ${status}`);

        // 2. Atualizar Banco de Dados
        // Exemplo:
        // await supabase.from('orders').update({ status: mapStatus(status), transaction_id: id }).eq('reference_id', reference_id);

        if (status === 'PAID') {
            console.log(`✅ Pagamento Confirmado! Liberar acesso para: ${reference_id}`);
            // TODO: Chamar função de liberação de licença/serviço
        } else if (status === 'CANCELED') {
            console.log(`❌ Pagamento Cancelado: ${reference_id}`);
        }

        return NextResponse.json({ received: true }, { status: 200 });

    } catch (error: any) {
        console.error('Webhook Error:', error.message);
        return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
    }
}

// O PagSeguro pode enviar um HEAD ou GET para validar a URL
export async function GET() {
    return NextResponse.json({ status: 'Webhook Active' });
}
