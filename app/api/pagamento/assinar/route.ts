import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';
import axios from 'axios';

/**
 * API DE ASSINATURA RECORRENTE — PAGBANK
 *
 * Fluxo:
 * 1. Recebe plano + dados do cliente + token do cartão (criptografado pelo PagBank.js)
 * 2. Garante que o plano existe no PagBank (cria se necessário)
 * 3. Cria a assinatura vinculando o cliente ao plano
 * 4. Salva no banco (payments + subscriptions)
 * 5. Gera a licença imediatamente (a renovação é tratada pelo webhook)
 */

const PAGBANK_ENV = process.env.PAGBANK_ENV || 'sandbox';
const BASE_URL = PAGBANK_ENV === 'production'
    ? 'https://api.pagseguro.com'
    : 'https://sandbox.api.pagseguro.com';
const TOKEN = process.env.PAGBANK_TOKEN!;

const pagbank = axios.create({
    baseURL: BASE_URL,
    headers: {
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
        'x-api-version': '4.0',
    },
    timeout: 30000,
});

// IDs dos planos no PagBank (criados uma vez e reutilizados)
// Após criar os planos pela primeira vez, salve os IDs aqui ou no banco
const PLAN_CONFIG: Record<string, {
    name: string;
    amountCents: number;
    intervalUnit: 'MONTH' | 'YEAR';
    intervalLength: number;
    maxDevices: number;
    daysValid: number;
    planCode: string;
}> = {
    standard: {
        name: 'Voltris Optimizer — Standard',
        amountCents: 9900,   // R$ 99,00/mês
        intervalUnit: 'MONTH',
        intervalLength: 1,
        maxDevices: 1,
        daysValid: 31,
        planCode: 'STA',
    },
    pro: {
        name: 'Voltris Optimizer — Pro Gamer',
        amountCents: 19900,  // R$ 199,00/mês
        intervalUnit: 'MONTH',
        intervalLength: 1,
        maxDevices: 3,
        daysValid: 31,
        planCode: 'PRO',
    },
    enterprise: {
        name: 'Voltris Optimizer — Enterprise',
        amountCents: 49900,  // R$ 499,00 único (vitalício — não recorrente)
        intervalUnit: 'MONTH',
        intervalLength: 1,
        maxDevices: 9999,
        daysValid: 36500,
        planCode: 'ENT',
    },
};

export async function POST(req: NextRequest) {
    const requestId = `assinar-${Date.now()}`;

    try {
        const body = await req.json();
        const { plan_type, user_id, customer, card_encrypted, card_holder_name } = body;

        // Validações
        if (!plan_type || !PLAN_CONFIG[plan_type]) {
            return NextResponse.json({ error: 'Plano inválido' }, { status: 400 });
        }
        if (!customer?.email || !customer?.tax_id) {
            return NextResponse.json({ error: 'Email e CPF são obrigatórios para assinatura' }, { status: 400 });
        }
        if (!card_encrypted) {
            return NextResponse.json({ error: 'Dados do cartão são obrigatórios' }, { status: 400 });
        }

        const config = PLAN_CONFIG[plan_type];
        const supabase = createAdminClient();
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://voltris.com.br';
        const webhookToken = process.env.PAGBANK_WEBHOOK_AUTH_TOKEN;

        // 1. Garantir que o plano existe no PagBank
        const planId = await ensurePlanExists(plan_type, config, baseUrl, webhookToken);
        if (!planId) {
            return NextResponse.json({ error: 'Falha ao criar/obter plano no PagBank' }, { status: 500 });
        }

        // 2. Sanitizar CPF
        const cleanTaxId = customer.tax_id.replace(/\D/g, '');
        if (cleanTaxId.length !== 11 && cleanTaxId.length !== 14) {
            return NextResponse.json({ error: 'CPF/CNPJ inválido' }, { status: 400 });
        }

        const referenceId = `VOLTRIS-SUB-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;

        // 3. Criar assinatura no PagBank
        const subscriptionPayload = {
            reference_id: referenceId,
            plan: { id: planId },
            customer: {
                name: (customer.name || 'Cliente Voltris').substring(0, 60),
                email: customer.email,
                tax_id: cleanTaxId,
            },
            payment_method: {
                type: 'CREDIT_CARD',
                card: {
                    encrypted: card_encrypted,
                    holder: { name: card_holder_name || customer.name || 'TITULAR' },
                    store: true,
                },
            },
        };

        let subscriptionResponse: any;
        try {
            const res = await pagbank.post('/subscriptions', subscriptionPayload);
            subscriptionResponse = res.data;
        } catch (err: any) {
            console.error(`[ASSINAR ${requestId}] Erro PagBank:`, err.response?.data || err.message);
            return NextResponse.json(
                { error: 'Falha ao criar assinatura', details: err.response?.data },
                { status: 502 }
            );
        }

        console.log(`[ASSINAR ${requestId}] Assinatura criada: ${subscriptionResponse.id} | Status: ${subscriptionResponse.status}`);

        // 4. Salvar pagamento no banco
        const { data: payment } = await supabase
            .from('payments')
            .insert({
                reference_id: referenceId,
                user_id: user_id || null,
                email: customer.email,
                customer_name: customer.name || 'Cliente Voltris',
                customer_tax_id: cleanTaxId,
                plan_type,
                amount: config.amountCents / 100,
                status: subscriptionResponse.status === 'ACTIVE' ? 'approved' : 'pending',
                pagbank_id: subscriptionResponse.id,
            })
            .select()
            .single();

        // 5. Salvar assinatura no banco
        if (payment) {
            await supabase.from('subscriptions').upsert({
                reference_id: referenceId,
                pagbank_subscription_id: subscriptionResponse.id,
                user_id: user_id || null,
                email: customer.email,
                plan_type,
                status: subscriptionResponse.status,
                payment_id: payment.id,
                next_billing_at: getNextBillingDate(),
            }, { onConflict: 'pagbank_subscription_id' });
        }

        // 6. Se assinatura já está ATIVA, gerar licença imediatamente
        if (subscriptionResponse.status === 'ACTIVE' && payment) {
            await generateLicense(supabase, payment, plan_type, requestId);
        }

        return NextResponse.json({
            success: true,
            subscription_id: subscriptionResponse.id,
            status: subscriptionResponse.status,
            reference_id: referenceId,
        });

    } catch (error: any) {
        console.error(`[ASSINAR ${requestId}] Erro fatal:`, error.message);
        return NextResponse.json({ error: 'Erro interno', details: error.message }, { status: 500 });
    }
}

/** Garante que o plano existe no PagBank, criando se necessário */
async function ensurePlanExists(
    planType: string,
    config: typeof PLAN_CONFIG[string],
    baseUrl: string,
    webhookToken: string | undefined
): Promise<string | null> {
    const supabase = createAdminClient();

    // Verificar se já temos o plan_id salvo no banco
    const { data: existing } = await supabase
        .from('pagbank_plans')
        .select('pagbank_plan_id')
        .eq('plan_type', planType)
        .single();

    if (existing?.pagbank_plan_id) {
        return existing.pagbank_plan_id;
    }

    // Criar plano no PagBank
    try {
        const planPayload = {
            reference_id: `VOLTRIS-PLAN-${planType.toUpperCase()}`,
            name: config.name,
            interval: {
                unit: config.intervalUnit,
                length: config.intervalLength,
            },
            amount: {
                value: config.amountCents,
                currency: 'BRL',
            },
            payment_method: { type: 'CREDIT_CARD' },
            notification_urls: [
                `${baseUrl}/api/webhook/pagbank?auth=${webhookToken}`,
            ],
        };

        const res = await pagbank.post('/plans', planPayload);
        const planId = res.data.id;

        // Salvar no banco para reutilizar
        await supabase.from('pagbank_plans').upsert({
            plan_type: planType,
            pagbank_plan_id: planId,
            name: config.name,
            amount_cents: config.amountCents,
        }, { onConflict: 'plan_type' });

        console.log(`[PLAN] Plano criado no PagBank: ${planId} para ${planType}`);
        return planId;
    } catch (err: any) {
        console.error('[PLAN] Erro ao criar plano:', err.response?.data || err.message);
        return null;
    }
}

function getNextBillingDate(): string {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    return d.toISOString();
}

async function generateLicense(supabase: any, payment: any, planType: string, requestId: string) {
    try {
        const { error } = await supabase.rpc('generate_complete_license_v3', {
            p_payment_id: payment.id,
            p_user_id: payment.user_id || null,
            p_email: payment.email,
            p_plan_type: planType,
        });

        if (error) {
            console.error(`[ASSINAR ${requestId}] Erro RPC licença:`, error);
            // Fallback Node.js
            await generateLicenseNodeFallback(supabase, payment, planType);
        }
    } catch (e) {
        console.error(`[ASSINAR ${requestId}] Erro ao gerar licença:`, e);
    }
}

async function generateLicenseNodeFallback(supabase: any, payment: any, planType: string) {
    const crypto = await import('crypto');
    const SECRET = process.env.LICENSE_SECRET_KEY || 'VOLTRIS_SECRET_LICENSE_KEY_2025';
    const planConfig: Record<string, { code: string; maxDevices: number; daysValid: number }> = {
        standard:   { code: 'STA', maxDevices: 1,    daysValid: 31 },
        pro:        { code: 'PRO', maxDevices: 3,    daysValid: 31 },
        enterprise: { code: 'ENT', maxDevices: 9999, daysValid: 36500 },
    };
    const cfg = planConfig[planType] || planConfig['standard'];
    const clientId = String(Math.floor(Math.random() * 900000) + 100000);
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + cfg.daysValid);
    const validStr = validUntil.toISOString().split('T')[0];
    const keyDate = validStr.replace(/-/g, '');
    const json = `{"id":"${clientId}","validUntil":"${validStr}","plan":"${planType}","maxDevices":${cfg.maxDevices}}`;
    const hash = crypto.createHash('sha256').update(json + SECRET, 'utf8').digest('hex').toUpperCase().substring(0, 16);
    const licenseKey = `VOLTRIS-${cfg.code}-${clientId}-${keyDate}-${hash}`;

    await supabase.from('licenses').insert({
        payment_id: payment.id,
        user_id: payment.user_id || null,
        email: payment.email,
        client_id: clientId,
        license_key: licenseKey,
        license_type: planType,
        max_devices: cfg.maxDevices,
        is_active: true,
        expires_at: validUntil.toISOString(),
    });
}
