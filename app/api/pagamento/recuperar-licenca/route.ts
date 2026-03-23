import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';

/**
 * Recupera licença para pagamentos que foram aprovados mas não geraram licença.
 * Busca pelo email do usuário logado — sem precisar de reference_id.
 */
export async function POST(req: NextRequest) {
    const requestId = `recover-${Date.now()}`;

    try {
        // Autenticação obrigatória
        const supabaseUser = await createClient();
        const { data: { user }, error: authError } = await supabaseUser.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const supabase = createAdminClient();
        const userEmail = user.email!.toLowerCase().trim();

        console.log(`[RECOVER ${requestId}] Buscando pagamentos órfãos para: ${userEmail}`);

        // 1. Buscar todos os pagamentos do email (por email OU user_id)
        const { data: payments, error: payErr } = await supabase
            .from('payments')
            .select('*')
            .or(`email.eq.${userEmail},user_id.eq.${user.id}`)
            .order('created_at', { ascending: false });

        if (payErr || !payments?.length) {
            console.log(`[RECOVER ${requestId}] Nenhum pagamento encontrado`);
            return NextResponse.json({ found: false, message: 'Nenhum pagamento encontrado para este email.' });
        }

        console.log(`[RECOVER ${requestId}] ${payments.length} pagamento(s) encontrado(s)`);

        // 2. Para cada pagamento, verificar se já tem licença
        const results: any[] = [];

        for (const payment of payments) {
            const { data: existingLicense } = await supabase
                .from('licenses')
                .select('id, license_key, license_type, is_active')
                .eq('payment_id', payment.id)
                .maybeSingle();

            if (existingLicense) {
                // Licença já existe — retornar como encontrada
                results.push({ payment_id: payment.id, status: 'already_exists', license: existingLicense });
                continue;
            }

            // Pagamento sem licença — gerar agora
            console.log(`[RECOVER ${requestId}] Pagamento órfão: id=${payment.id} plan=${payment.plan_type} status=${payment.status}`);

            // Forçar status approved se necessário
            if (payment.status !== 'approved' && payment.status !== 'paid') {
                await supabase
                    .from('payments')
                    .update({ status: 'approved', updated_at: new Date().toISOString() })
                    .eq('id', payment.id);
                payment.status = 'approved';
            }

            const license = await gerarLicenca(supabase, payment, user.id, requestId);
            if (license) {
                results.push({ payment_id: payment.id, status: 'generated', license });
            } else {
                results.push({ payment_id: payment.id, status: 'error' });
            }
        }

        const generated = results.filter(r => r.status === 'generated');
        const existing = results.filter(r => r.status === 'already_exists');

        return NextResponse.json({
            found: true,
            total_payments: payments.length,
            generated: generated.length,
            already_existed: existing.length,
            licenses: [...generated, ...existing].map(r => r.license).filter(Boolean),
        });

    } catch (error: any) {
        console.error(`[RECOVER ${requestId}] ERRO FATAL:`, error);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}

async function gerarLicenca(supabase: any, payment: any, userId: string, requestId: string) {
    try {
        const crypto = await import('crypto');
        const SECRET_KEY = process.env.LICENSE_SECRET_KEY || 'VOLTRIS_SECRET_LICENSE_KEY_2025';
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
        const validUntilStr = validUntil.toISOString().split('T')[0];
        const keyDateStr = validUntilStr.replace(/-/g, '');

        const jsonContent = `{"id":"${clientId}","validUntil":"${validUntilStr}","plan":"${planType}","maxDevices":${config.maxDevices}}`;
        const hash = crypto.createHash('sha256').update(jsonContent + SECRET_KEY, 'utf8').digest('hex').toUpperCase();
        const licenseKey = `VOLTRIS-${config.code}-${clientId}-${keyDateStr}-${hash.substring(0, 16)}`;

        const { data: inserted, error: insertErr } = await supabase
            .from('licenses')
            .insert({
                payment_id: payment.id,
                user_id: payment.user_id || userId,
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

        if (insertErr) {
            console.error(`[RECOVER ${requestId}] Erro ao inserir:`, insertErr.message);
            return null;
        }

        console.log(`[RECOVER ${requestId}] ✅ Licença gerada: ${licenseKey}`);

        // Email não bloqueante
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
        } catch { /* não bloquear */ }

        return inserted;
    } catch (err: any) {
        console.error(`[RECOVER ${requestId}] Erro:`, err.message);
        return null;
    }
}
