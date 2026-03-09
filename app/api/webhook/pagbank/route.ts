import { NextRequest, NextResponse } from 'next/server';
import { PagBankWebhookEvent } from '@/types/pagbank';
import { createAdminClient } from '@/utils/supabase/admin';
import { sendLicenseEmail } from '@/services/emailService';

/**
 * WEBHOOK SEGURO PAGBANK V4
 * 
 * Este endpoint recebe notificações de mudança de status do PagBank
 * e processa a liberação de licenças e persistência no DB.
 */

export async function POST(req: NextRequest) {
    const requestId = `webhook-pagbank-${Date.now()}`;
    const searchParams = req.nextUrl.searchParams;
    const authToken = searchParams.get('auth');

    // 1. VALIDAÇÃO DE SEGURANÇA (OBRIGATÓRIO)
    const expectedToken = process.env.PAGBANK_WEBHOOK_AUTH_TOKEN;

    if (!authToken || !expectedToken || authToken !== expectedToken) {
        console.error(`[PAGBANK WEBHOOK ${requestId}] 🛑 ACESSO NEGADO: Token inválido ou ausente.`);
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const event: PagBankWebhookEvent = await req.json();

        // Logs de auditoria (Conformidade)
        console.log(`[PAGBANK WEBHOOK ${requestId}] 🔔 Evento Recebido: ${event.description}`);

        if (!event.data || !event.data.reference_id) {
            console.error(`[PAGBANK WEBHOOK ${requestId}] ❌ Payload inválido:`, JSON.stringify(event));
            return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
        }

        const { id: pagbankId, reference_id: referenceId, status } = event.data;
        console.log(`[PAGBANK WEBHOOK ${requestId}] 📄 Ref: ${referenceId} | Status: ${status} | ID: ${pagbankId}`);

        const supabase = createAdminClient();

        // 2. BUSCAR PAGAMENTO NO DB (IDEMPOTÊNCIA)
        const { data: payment, error: fetchError } = await supabase
            .from('payments')
            .select('*')
            .eq('preference_id', referenceId)
            .single();

        if (fetchError || !payment) {
            console.error(`[PAGBANK WEBHOOK ${requestId}] ❌ Pedido não encontrado no banco: ${referenceId}`);
            // Retornamos 200 para o PagBank parar de tentar, mas logamos o erro
            return NextResponse.json({ error: 'Order not found', referenceId }, { status: 200 });
        }

        // Se já estiver pago, evitar re-processamento
        if (payment.status === 'approved' || payment.status === 'paid') {
            console.log(`[PAGBANK WEBHOOK ${requestId}] ℹ️ Pedido já processado anteriormente: ${referenceId}`);
            return NextResponse.json({ success: true, already_processed: true });
        }

        // 3. ATUALIZAR STATUS NO BANCO
        const mapStatus: Record<string, string> = {
            'PAID': 'approved',
            'AUTHORIZED': 'approved',
            'WAITING': 'pending',
            'CANCELED': 'cancelled',
            'DECLINED': 'rejected'
        };

        const newInternalStatus = mapStatus[status] || 'pending';

        const { error: updateError } = await supabase
            .from('payments')
            .update({
                status: newInternalStatus,
                payment_id: pagbankId,
                processed_at: status === 'PAID' ? new Date().toISOString() : null,
                mercado_pago_data: { ...payment.mercado_pago_data, pagbank_event: event } // Reutilizando coluna para dados gerais
            })
            .eq('id', payment.id);

        if (updateError) {
            throw new Error(`Erro ao atualizar status do pagamento: ${updateError.message}`);
        }

        // 4. LIBERAÇÃO DE LICENÇA (SÓ SE FOR PAGO)
        if (status === 'PAID') {
            console.log(`[PAGBANK WEBHOOK ${requestId}] 🔑 Iniciando geração de licença para ${payment.email}`);

            // Chamar RPC ou Função SQL para gerar licença
            // Usaremos a função calculate_expiry_date definida no SQL
            const { data: licenseData, error: licenseError } = await supabase
                .rpc('generate_complete_license_v2', {
                    p_payment_id: payment.id,
                    p_email: payment.email,
                    p_license_type: payment.license_type
                });

            if (licenseError) {
                console.error(`[PAGBANK WEBHOOK ${requestId}] ❌ Erro ao gerar licença RPC:`, licenseError);
                // Salvar falha no log para intervenção manual
                await supabase.from('audit_logs').insert({
                    event: 'license_generation_failed',
                    details: { payment_id: payment.id, error: licenseError },
                    severity: 'critical'
                });
            } else {
                console.log(`[PAGBANK WEBHOOK ${requestId}] ✅ Licença gerada com sucesso.`);

                // 5. ENVIAR EMAIL DE ENTREGA
                // Buscamos a licença recém gerada para ter todos os campos
                const { data: license } = await supabase
                    .from('licenses')
                    .select('*')
                    .eq('payment_id', payment.id)
                    .single();

                if (license) {
                    await sendLicenseEmail({
                        email: payment.email,
                        licenseKey: license.license_key,
                        licenseType: license.license_type,
                        maxDevices: license.max_devices,
                        expiresAt: license.expires_at,
                        amountPaid: Number(payment.amount),
                        fullName: payment.full_name || undefined
                    });
                }
            }
        }

        return NextResponse.json({ success: true }, { status: 200 });

    } catch (error: any) {
        console.error(`[PAGBANK WEBHOOK ${requestId}] 💥 Erro Fatal:`, error.message);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({ status: 'Webhook PagBank Ativo e Protegido' });
}
