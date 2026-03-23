import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';

/**
 * Reprocessa um pagamento pendente e gera a licença.
 * Usado quando o webhook não disparou (sandbox) ou o usuário voltou sem o ref na URL.
 * SEGURANÇA: Só processa pagamentos do próprio usuário logado.
 */
export async function POST(req: NextRequest) {
    const requestId = `reprocess-${Date.now()}`;

    try {
        const supabaseUser = await createClient();
        const { data: { user }, error: authError } = await supabaseUser.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const supabase = createAdminClient();

        // Buscar todos os pagamentos pendentes do usuário (por email)
        const { data: payments, error: payErr } = await supabase
            .from('payments')
            .select('*')
            .eq('email', user.email)
            .in('status', ['pending', 'approved'])
            .order('created_at', { ascending: false })
            .limit(10);

        if (payErr || !payments || payments.length === 0) {
            return NextResponse.json({ message: 'Nenhum pagamento pendente encontrado', licenses: [] });
        }

        const results = [];

        for (const payment of payments) {
            // Verificar se já tem licença
            const { data: existing } = await supabase
                .from('licenses')
                .select('id, license_key, license_type, is_active')
                .eq('payment_id', payment.id)
                .maybeSingle();

            if (existing) {
                results.push({ payment_id: payment.id, status: 'already_exists', license: existing });
                continue;
            }

            // Gerar licença
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

            // Atualizar status do pagamento
            await supabase.from('payments').update({ status: 'approved', updated_at: new Date().toISOString() }).eq('id', payment.id);

            const { data: inserted, error: insertErr } = await supabase
                .from('licenses')
                .insert({
                    payment_id: payment.id,
                    user_id: payment.user_id || user.id,
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
                console.error(`[REPROCESS ${requestId}] Erro ao inserir licença:`, insertErr);
                results.push({ payment_id: payment.id, status: 'error', error: insertErr.message });
            } else {
                console.log(`[REPROCESS ${requestId}] ✅ Licença gerada: ${licenseKey}`);
                results.push({ payment_id: payment.id, status: 'generated', license: inserted });
            }
        }

        const generated = results.filter(r => r.status === 'generated');
        return NextResponse.json({
            success: true,
            processed: results.length,
            generated: generated.length,
            results,
        });

    } catch (error: any) {
        console.error(`[REPROCESS] Erro:`, error);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}
