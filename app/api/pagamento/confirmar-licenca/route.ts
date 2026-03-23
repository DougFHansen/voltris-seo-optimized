import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: NextRequest) {
    const requestId = `confirm-${Date.now()}`;

    try {
        // SEGURANÇA: Exigir usuário autenticado
        const supabaseUser = await createClient();
        const { data: { user }, error: authError } = await supabaseUser.auth.getUser();

        if (authError || !user) {
            console.error(`[CONFIRM-LICENSE ${requestId}] Auth falhou:`, authError?.message);
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { reference_id } = body;

        console.log(`[CONFIRM-LICENSE ${requestId}] user=${user.id} email=${user.email} ref=${reference_id}`);

        if (!reference_id || typeof reference_id !== 'string' || reference_id.length > 150) {
            return NextResponse.json({ error: 'reference_id inválido' }, { status: 400 });
        }

        // Validar formato — aceitar VOLTRIS- seguido de qualquer caractere alfanumérico, hífen ou underscore
        if (!/^VOLTRIS-[A-Za-z0-9_-]+$/.test(reference_id)) {
            console.error(`[CONFIRM-LICENSE ${requestId}] Formato inválido: ${reference_id}`);
            return NextResponse.json({ error: 'reference_id com formato inválido' }, { status: 400 });
        }

        const supabase = createAdminClient();

        // 1. Buscar pagamento pelo reference_id
        const { data: payment, error: payErr } = await supabase
            .from('payments')
            .select('*')
            .eq('reference_id', reference_id)
            .maybeSingle();

        console.log(`[CONFIRM-LICENSE ${requestId}] Payment:`, payment ? `id=${payment.id} status=${payment.status} plan=${payment.plan_type} email=${payment.email}` : 'NÃO ENCONTRADO', payErr?.message);

        if (payErr || !payment) {
            return NextResponse.json({ error: 'Pagamento não encontrado', reference_id }, { status: 404 });
        }

        // SEGURANÇA: Verificar que o pagamento pertence ao usuário logado
        const paymentEmail = payment.email?.toLowerCase().trim();
        const userEmail = user.email?.toLowerCase().trim();
        const paymentUserId = payment.user_id;

        const isOwner = paymentUserId === user.id || paymentEmail === userEmail;
        if (!isOwner) {
            console.warn(`[CONFIRM-LICENSE ${requestId}] Acesso negado: user=${user.id}(${userEmail}) payment_user=${paymentUserId}(${paymentEmail})`);
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // 2. Verificar se licença já existe (idempotência — verificar ANTES de atualizar status)
        const { data: existing } = await supabase
            .from('licenses')
            .select('*')
            .eq('payment_id', payment.id)
            .maybeSingle();

        if (existing) {
            console.log(`[CONFIRM-LICENSE ${requestId}] Licença já existe: ${existing.license_key}`);
            return NextResponse.json({ license: existing, already_existed: true });
        }

        // 3. Atualizar status para approved (fallback para sandbox onde webhook não dispara)
        if (payment.status !== 'approved' && payment.status !== 'paid') {
            const { error: updateErr } = await supabase
                .from('payments')
                .update({ status: 'approved', updated_at: new Date().toISOString() })
                .eq('id', payment.id);

            if (updateErr) {
                console.error(`[CONFIRM-LICENSE ${requestId}] Erro ao atualizar status:`, updateErr);
            } else {
                console.log(`[CONFIRM-LICENSE ${requestId}] Status atualizado para approved`);
                payment.status = 'approved';
            }
        }

        // 4. Gerar licença
        return await gerarLicenca(supabase, payment, requestId);

    } catch (error: any) {
        console.error(`[CONFIRM-LICENSE ${requestId}] ERRO FATAL:`, error);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}

async function gerarLicenca(supabase: any, payment: any, requestId: string) {
    try {
        const crypto = await import('crypto');
        const SECRET_KEY = process.env.LICENSE_SECRET_KEY || 'VOLTRIS_SECRET_LICENSE_KEY_2025';
        const planType = (payment.plan_type || 'standard').toLowerCase();

        console.log(`[CONFIRM-LICENSE ${requestId}] Gerando licença: plan=${planType} email=${payment.email}`);

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
        const validUntilStr = validUntil.toISOString().split('T')[0];
        const keyDateStr = validUntilStr.replace(/-/g, '');

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
            return NextResponse.json({ error: 'Falha ao salvar licença', details: insertErr?.message }, { status: 500 });
        }

        console.log(`[CONFIRM-LICENSE ${requestId}] ✅ Licença salva: ${inserted.license_key}`);

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
            console.warn(`[CONFIRM-LICENSE ${requestId}] Email não enviado:`, emailErr);
        }

        return NextResponse.json({ license: inserted, generated_now: true });

    } catch (err: any) {
        console.error(`[CONFIRM-LICENSE ${requestId}] Erro ao gerar licença:`, err);
        return NextResponse.json({ error: 'Erro ao gerar licença', details: err.message }, { status: 500 });
    }
}
