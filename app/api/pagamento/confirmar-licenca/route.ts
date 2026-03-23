import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';

export async function POST(req: NextRequest) {
    const requestId = `confirm-${Date.now()}`;
    console.log(`\n========== [CONFIRM-LICENSE ${requestId}] INÍCIO ==========`);

    try {
        const body = await req.json();
        const { reference_id, user_id, email } = body;

        console.log(`[CONFIRM-LICENSE ${requestId}] Recebido:`, { reference_id, user_id, email });

        if (!reference_id && !user_id && !email) {
            return NextResponse.json({ error: 'Informe reference_id, user_id ou email' }, { status: 400 });
        }

        const supabase = createAdminClient();

        // Verificar conexão com Supabase
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
        console.log(`[CONFIRM-LICENSE ${requestId}] Supabase URL: ${supabaseUrl} | Service Key presente: ${hasServiceKey}`);

        // 1. Buscar pagamento pelo reference_id
        let payment: any = null;

        if (reference_id) {
            console.log(`[CONFIRM-LICENSE ${requestId}] Buscando pagamento por reference_id: ${reference_id}`);
            const { data, error } = await supabase
                .from('payments')
                .select('*')
                .eq('reference_id', reference_id)
                .maybeSingle();

            console.log(`[CONFIRM-LICENSE ${requestId}] Resultado busca payments:`, { data, error });

            if (error) {
                console.error(`[CONFIRM-LICENSE ${requestId}] ERRO ao buscar payment:`, error);
                // Tentar criar o pagamento se não existir
            }

            if (data) {
                payment = data;
                // Atualizar status para approved se ainda estiver pending
                if (payment.status !== 'approved' && payment.status !== 'paid') {
                    const { error: updateErr } = await supabase
                        .from('payments')
                        .update({ status: 'approved', updated_at: new Date().toISOString() })
                        .eq('id', payment.id);
                    if (updateErr) {
                        console.error(`[CONFIRM-LICENSE ${requestId}] Erro ao atualizar status:`, updateErr);
                    } else {
                        payment.status = 'approved';
                        console.log(`[CONFIRM-LICENSE ${requestId}] Status atualizado para approved`);
                    }
                }
            } else {
                // Pagamento não encontrado — pode ser que o checkout não salvou no banco
                // Criar o registro agora com os dados disponíveis
                console.log(`[CONFIRM-LICENSE ${requestId}] Pagamento NÃO encontrado. Criando registro...`);

                if (email) {
                    const { data: created, error: createErr } = await supabase
                        .from('payments')
                        .insert({
                            reference_id,
                            user_id: user_id || null,
                            email,
                            amount: 1.00,
                            status: 'approved',
                            plan_type: extractPlanFromRef(reference_id),
                            customer_name: 'Cliente Voltris',
                        })
                        .select()
                        .single();

                    if (createErr) {
                        console.error(`[CONFIRM-LICENSE ${requestId}] Erro ao criar payment:`, createErr);
                        return NextResponse.json({
                            error: 'Pagamento não encontrado e não foi possível criar',
                            details: createErr.message,
                            debug: { reference_id, email }
                        }, { status: 404 });
                    }
                    payment = created;
                    console.log(`[CONFIRM-LICENSE ${requestId}] Payment criado:`, payment.id);
                } else {
                    return NextResponse.json({
                        error: 'Pagamento não encontrado no banco de dados',
                        debug: { reference_id, tip: 'O checkout pode ter falhado ao salvar no banco' }
                    }, { status: 404 });
                }
            }
        }

        if (!payment) {
            return NextResponse.json({ error: 'Pagamento não encontrado', license: null });
        }

        console.log(`[CONFIRM-LICENSE ${requestId}] Payment encontrado: id=${payment.id} | status=${payment.status} | plan=${payment.plan_type} | email=${payment.email}`);

        // 2. Verificar se licença já existe
        const { data: existingLicense, error: licCheckErr } = await supabase
            .from('licenses')
            .select('*')
            .eq('payment_id', payment.id)
            .maybeSingle();

        console.log(`[CONFIRM-LICENSE ${requestId}] Licença existente:`, { existingLicense, licCheckErr });

        if (existingLicense) {
            console.log(`[CONFIRM-LICENSE ${requestId}] ✅ Licença já existe: ${existingLicense.license_key}`);
            return NextResponse.json({ license: existingLicense, already_existed: true });
        }

        // 3. Tentar RPC primeiro
        console.log(`[CONFIRM-LICENSE ${requestId}] Tentando RPC generate_complete_license_v3...`);
        const { data: rpcData, error: rpcError } = await supabase
            .rpc('generate_complete_license_v3', {
                p_payment_id: payment.id,
                p_user_id: payment.user_id || null,
                p_email: payment.email,
                p_plan_type: payment.plan_type || 'standard'
            });

        console.log(`[CONFIRM-LICENSE ${requestId}] RPC resultado:`, { rpcData, rpcError });

        if (!rpcError && rpcData) {
            // Buscar licença recém-criada pela RPC
            const { data: newLic } = await supabase
                .from('licenses')
                .select('*')
                .eq('payment_id', payment.id)
                .maybeSingle();

            if (newLic) {
                console.log(`[CONFIRM-LICENSE ${requestId}] ✅ Licença gerada via RPC: ${newLic.license_key}`);
                sendEmailSafe(payment, newLic);
                return NextResponse.json({ license: newLic, generated_now: true, method: 'rpc' });
            }
        }

        // 4. Fallback Node.js — gera a licença diretamente
        console.log(`[CONFIRM-LICENSE ${requestId}] RPC falhou (${rpcError?.message}). Usando fallback Node.js...`);
        const license = await generateLicenseNode(supabase, payment, requestId);

        if (!license) {
            return NextResponse.json({
                error: 'Falha ao gerar licença',
                details: rpcError?.message,
                debug: { payment_id: payment.id, plan: payment.plan_type }
            }, { status: 500 });
        }

        console.log(`[CONFIRM-LICENSE ${requestId}] ✅ Licença gerada via Node.js: ${license.license_key}`);
        sendEmailSafe(payment, license);
        return NextResponse.json({ license, generated_now: true, method: 'nodejs' });

    } catch (error: any) {
        console.error(`[CONFIRM-LICENSE ${requestId}] ERRO FATAL:`, error);
        return NextResponse.json({ error: 'Erro interno', details: error.message }, { status: 500 });
    }
}

// Extrai o tipo de plano do reference_id (ex: VOLTRIS-1774229678802-OGJ1GK)
// Como não temos o plano no ref, usa 'standard' como padrão
function extractPlanFromRef(_ref: string): string {
    return 'standard';
}

async function generateLicenseNode(supabase: any, payment: any, requestId: string) {
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
        const clientId = String(Math.floor(Math.random() * 900000) + 100000);

        const validUntil = new Date();
        validUntil.setDate(validUntil.getDate() + config.daysValid);
        const validUntilStr = validUntil.toISOString().split('T')[0];
        const keyDateStr = validUntilStr.replace(/-/g, '');

        const jsonContent = `{"id":"${clientId}","validUntil":"${validUntilStr}","plan":"${planType}","maxDevices":${config.maxDevices}}`;
        const hash = crypto.createHash('sha256').update(jsonContent + SECRET_KEY, 'utf8').digest('hex').toUpperCase();
        const signature = hash.substring(0, 16);
        const licenseKey = `VOLTRIS-${config.code}-${clientId}-${keyDateStr}-${signature}`;

        console.log(`[CONFIRM-LICENSE ${requestId}] Inserindo licença no banco: ${licenseKey}`);

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
                devices_in_use: 0,
                is_active: true,
                expires_at: validUntil.toISOString(),
            })
            .select()
            .single();

        if (insertError) {
            console.error(`[CONFIRM-LICENSE ${requestId}] Erro ao inserir licença:`, insertError);
            return null;
        }

        return inserted;
    } catch (err: any) {
        console.error(`[CONFIRM-LICENSE ${requestId}] Erro no fallback Node.js:`, err.message);
        return null;
    }
}

async function sendEmailSafe(payment: any, license: any) {
    try {
        const { sendLicenseEmail } = await import('@/services/emailService');
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
        console.warn('Email não enviado (não bloqueante):', e);
    }
}
