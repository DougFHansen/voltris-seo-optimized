import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { sendLicenseEmail } from '@/services/emailService';

/**
 * API DE FALLBACK PARA GERAÇÃO DE LICENÇA
 *
 * Chamada pelo dashboard quando o usuário retorna após pagamento aprovado.
 * Garante que a licença seja gerada mesmo que o webhook do PagBank não tenha
 * sido processado ainda (latência, falha de rede, etc).
 *
 * Fluxo:
 * 1. Recebe reference_id ou user_id/email
 * 2. Busca o pagamento aprovado no banco
 * 3. Verifica se já existe licença para esse pagamento
 * 4. Se não existir, gera via RPC generate_complete_license_v3
 * 5. Retorna a licença gerada ou já existente
 */
export async function POST(req: NextRequest) {
    const requestId = `confirm-license-${Date.now()}`;

    try {
        const body = await req.json();
        const { reference_id, user_id, email } = body;

        if (!reference_id && !user_id && !email) {
            return NextResponse.json({ error: 'Informe reference_id, user_id ou email' }, { status: 400 });
        }

        const supabase = createAdminClient();

        // 1. Buscar pagamento aprovado
        let paymentQuery = supabase
            .from('payments')
            .select('*')
            .in('status', ['approved', 'paid', 'PAID'])
            .order('created_at', { ascending: false })
            .limit(1);

        if (reference_id) {
            paymentQuery = paymentQuery.eq('reference_id', reference_id);
        } else if (user_id) {
            paymentQuery = paymentQuery.eq('user_id', user_id);
        } else if (email) {
            paymentQuery = paymentQuery.eq('email', email);
        }

        const { data: payments, error: paymentError } = await paymentQuery;

        if (paymentError || !payments || payments.length === 0) {
            console.log(`[CONFIRM-LICENSE ${requestId}] Nenhum pagamento aprovado encontrado`);
            return NextResponse.json({ license: null, message: 'Nenhum pagamento aprovado encontrado' });
        }

        const payment = payments[0];
        console.log(`[CONFIRM-LICENSE ${requestId}] Pagamento encontrado: ${payment.reference_id} | Status: ${payment.status}`);

        // 2. Verificar se licença já existe para esse pagamento
        const { data: existingLicense } = await supabase
            .from('licenses')
            .select('*')
            .eq('payment_id', payment.id)
            .single();

        if (existingLicense) {
            console.log(`[CONFIRM-LICENSE ${requestId}] Licença já existe: ${existingLicense.license_key}`);
            return NextResponse.json({ license: existingLicense, already_existed: true });
        }

        // 3. Licença não existe — gerar agora via RPC
        console.log(`[CONFIRM-LICENSE ${requestId}] Gerando licença para ${payment.email} | Plano: ${payment.plan_type}`);

        const { data: licenseData, error: licenseError } = await supabase
            .rpc('generate_complete_license_v3', {
                p_payment_id: payment.id,
                p_user_id: payment.user_id || null,
                p_email: payment.email,
                p_plan_type: payment.plan_type
            });

        if (licenseError || !licenseData) {
            console.error(`[CONFIRM-LICENSE ${requestId}] Erro na RPC:`, licenseError);

            // Fallback: gerar licença diretamente no Node.js com o mesmo algoritmo do C#
            const generatedLicense = await generateLicenseDirectly(supabase, payment, requestId);
            if (!generatedLicense) {
                return NextResponse.json({ error: 'Falha ao gerar licença', details: licenseError?.message }, { status: 500 });
            }

            await sendLicenseEmailSafe(payment, generatedLicense);
            return NextResponse.json({ license: generatedLicense, generated_now: true });
        }

        // 4. Buscar licença recém-gerada
        const { data: newLicense } = await supabase
            .from('licenses')
            .select('*')
            .eq('payment_id', payment.id)
            .single();

        if (newLicense) {
            await sendLicenseEmailSafe(payment, newLicense);
        }

        console.log(`[CONFIRM-LICENSE ${requestId}] ✅ Licença gerada com sucesso`);
        return NextResponse.json({ license: newLicense, generated_now: true });

    } catch (error: any) {
        console.error(`[CONFIRM-LICENSE ${requestId}] Erro fatal:`, error.message);
        return NextResponse.json({ error: 'Erro interno', details: error.message }, { status: 500 });
    }
}

/**
 * Fallback: gera a licença diretamente em Node.js usando o mesmo algoritmo do C#
 * Usado quando a RPC do Supabase falha (ex: função não existe no banco)
 */
async function generateLicenseDirectly(supabase: any, payment: any, requestId: string) {
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

        const config = planConfig[planType] || planConfig['standard'];

        // Gerar client_id de 6 dígitos
        const clientId = String(Math.floor(Math.random() * 900000) + 100000);

        // Calcular data de validade
        const validUntil = new Date();
        validUntil.setDate(validUntil.getDate() + config.daysValid);
        const validUntilStr = validUntil.toISOString().split('T')[0]; // YYYY-MM-DD
        const keyDateStr = validUntilStr.replace(/-/g, '');            // YYYYMMDD

        // Montar JSON exatamente como o C#
        const jsonContent = `{"id":"${clientId}","validUntil":"${validUntilStr}","plan":"${planType}","maxDevices":${config.maxDevices}}`;

        // SHA256(content + secret) -> hex uppercase -> primeiros 16 chars
        const combined = jsonContent + SECRET_KEY;
        const hash = crypto.createHash('sha256').update(combined, 'utf8').digest('hex').toUpperCase();
        const signature = hash.substring(0, 16);

        // Montar chave final: VOLTRIS-PRO-123456-20251231-HASH16
        const licenseKey = `VOLTRIS-${config.code}-${clientId}-${keyDateStr}-${signature}`;

        console.log(`[CONFIRM-LICENSE ${requestId}] Licença gerada via Node.js: ${licenseKey}`);

        // Salvar no banco
        const { data: inserted, error: insertError } = await supabase
            .from('licenses')
            .insert({
                payment_id: payment.id,
                user_id: payment.user_id || null,
                email: payment.email,
                client_id: clientId,
                license_key: licenseKey,
                license_type: planType,
                max_devices: config.maxDevices,
                is_active: true,
                expires_at: validUntil.toISOString(),
            })
            .select()
            .single();

        if (insertError) {
            console.error(`[CONFIRM-LICENSE ${requestId}] Erro ao salvar licença:`, insertError);
            return null;
        }

        return inserted;
    } catch (err: any) {
        console.error(`[CONFIRM-LICENSE ${requestId}] Erro no fallback:`, err.message);
        return null;
    }
}

async function sendLicenseEmailSafe(payment: any, license: any) {
    try {
        await sendLicenseEmail({
            email: payment.email,
            licenseKey: license.license_key,
            licenseType: license.license_type,
            maxDevices: license.max_devices,
            expiresAt: license.expires_at,
            amountPaid: Number(payment.amount),
            fullName: payment.customer_name || undefined
        });
    } catch (e) {
        console.warn('Falha ao enviar email de licença (não bloqueante):', e);
    }
}
