import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';

export async function POST(req: NextRequest) {
    const requestId = `confirm-${Date.now()}`;
    console.log(`\n===== [CONFIRM-LICENSE ${requestId}] =====`);

    try {
        const body = await req.json();
        const { reference_id, user_id, email } = body;

        console.log(`[CONFIRM-LICENSE ${requestId}] Payload:`, { reference_id, user_id, email });

        if (!reference_id) {
            return NextResponse.json({ error: 'reference_id obrigatório' }, { status: 400 });
        }

        const supabase = createAdminClient();

        // 1. Buscar pagamento pelo reference_id
        const { data: payment, error: payErr } = await supabase
            .from('payments')
            .select('*')
            .eq('reference_id', reference_id)
            .maybeSingle();

        console.log(`[CONFIRM-LICENSE ${requestId}] Payment:`, payment ? `id=${payment.id} status=${payment.status} plan=${payment.plan_type}` : 'NÃO ENCONTRADO', payErr?.message);

        if (payErr || !payment) {
            // Pagamento não existe — criar agora com os dados disponíveis
            if (!email) {
                return NextResponse.json({ error: 'Pagamento não encontrado e email não informado' }, { status: 404 });
            }

            console.log(`[CONFIRM-LICENSE ${requestId}] Criando payment no banco...`);
            const { data: created, error: createErr } = await supabase
                .from('payments')
                .insert({
                    reference_id,
                    user_id: user_id || null,
                    email,
                    amount: 1.00,
                    status: 'approved',
                    plan_type: 'standard',
                    customer_name: 'Cliente Voltris',
                })
                .select()
                .single();

            if (createErr || !created) {
                console.error(`[CONFIRM-LICENSE ${requestId}] Erro ao criar payment:`, createErr);
                return NextResponse.json({ error: 'Falha ao criar registro de pagamento', details: createErr?.message }, { status: 500 });
            }

            return await gerarLicenca(supabase, created, requestId);
        }

        // 2. Atualizar status para approved se necessário
        if (payment.status !== 'approved' && payment.status !== 'paid') {
            await supabase
                .from('payments')
                .update({ status: 'approved', updated_at: new Date().toISOString() })
                .eq('id', payment.id);
            payment.status = 'approved';
            console.log(`[CONFIRM-LICENSE ${requestId}] Status atualizado para approved`);
        }

        // 3. Verificar se licença já existe
        const { data: existing } = await supabase
            .from('licenses')
            .select('*')
            .eq('payment_id', payment.id)
            .maybeSingle();

        if (existing) {
            console.log(`[CONFIRM-LICENSE ${requestId}] Licença já existe: ${existing.license_key}`);
            return NextResponse.json({ license: existing, already_existed: true });
        }

        // 4. Gerar licença
        return await gerarLicenca(supabase, payment, requestId);

    } catch (error: any) {
        console.error(`[CONFIRM-LICENSE ${requestId}] ERRO FATAL:`, error);
        return NextResponse.json({ error: 'Erro interno', details: error.message }, { status: 500 });
    }
}

async function gerarLicenca(supabase: any, payment: any, requestId: string) {
    console.log(`[CONFIRM-LICENSE ${requestId}] Gerando licença para email=${payment.email} plan=${payment.plan_type}`);

    try {
        const crypto = await import('crypto');
        const SECRET_KEY = 'VOLTRIS_SECRET_LICENSE_KEY_2025';
        const planType = (payment.plan_type || 'standard').toLowerCase();

        const planConfig: Record<string, { code: string; maxDevices: number; daysValid: number }> = {
            trial:      { code: 'TRI', maxDevices: 1,    daysValid: 15 },
            standard:   { code: 'STA', maxDevices: 1,    daysValid: 365 },
            pro:        { code: 'PRO', maxDevices: 3,    daysValid: 365 },
            enterprise: { code: 'ENT', maxDevices: 9999, daysValid: 36500 },
        };

        const config = planConfig[planType] ?? planConfig['standard'];
        const clientId = String(Math.floor(Math.random() * 900000) + 100000);

        const validUntil = new Date();
        validUntil.setDate(validUntil.getDate() + config.daysValid);
        const validUntilStr = validUntil.toISOString().split('T')[0]; // YYYY-MM-DD
        const keyDateStr = validUntilStr.replace(/-/g, '');           // YYYYMMDD

        // JSON exatamente igual ao C# LicenseGenerator
        const jsonContent = `{"id":"${clientId}","validUntil":"${validUntilStr}","plan":"${planType}","maxDevices":${config.maxDevices}}`;
        const hash = crypto.createHash('sha256').update(jsonContent + SECRET_KEY, 'utf8').digest('hex').toUpperCase();
        const signature = hash.substring(0, 16);
        const licenseKey = `VOLTRIS-${config.code}-${clientId}-${keyDateStr}-${signature}`;

        console.log(`[CONFIRM-LICENSE ${requestId}] Chave gerada: ${licenseKey}`);

        const { data: inserted, error: insertErr } = await supabase
            .from('licenses')
            .insert({
                payment_id: payment.id,
                user_id: payment.user_id || null,
                email: payment.email,
                client_id: clientId,
                license_key: licenseKey,
                license_type: planType,
                max_devices: config.maxDevices,
                devices_in_use: 0,
                is_active: true,
                expires_at: validUntil.toISOString(),
            })
            .select()
            .single();

        if (insertErr || !inserted) {
            console.error(`[CONFIRM-LICENSE ${requestId}] Erro ao inserir licença:`, insertErr);
            return NextResponse.json({ error: 'Falha ao salvar licença no banco', details: insertErr?.message }, { status: 500 });
        }

        console.log(`[CONFIRM-LICENSE ${requestId}] ✅ Licença salva com sucesso: ${inserted.license_key}`);

        // Enviar email (não bloqueante)
        try {
            const { sendLicenseEmail } = await import('@/services/emailService');
            await sendLicenseEmail({
                email: payment.email,
                licenseKey: inserted.license_key,
                licenseType: inserted.license_type,
                maxDevices: inserted.max_devices,
                expiresAt: inserted.expires_at,
                amountPaid: Number(payment.amount),
                fullName: payment.customer_name || undefined,
            });
        } catch (emailErr) {
            console.warn(`[CONFIRM-LICENSE ${requestId}] Email não enviado (não bloqueante):`, emailErr);
        }

        return NextResponse.json({ license: inserted, generated_now: true });

    } catch (err: any) {
        console.error(`[CONFIRM-LICENSE ${requestId}] Erro ao gerar licença:`, err);
        return NextResponse.json({ error: 'Erro ao gerar licença', details: err.message }, { status: 500 });
    }
}
