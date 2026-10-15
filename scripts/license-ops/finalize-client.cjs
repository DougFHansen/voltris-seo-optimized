/**
 * Ajuste final (gate Stripe ATENDIDO em 2026-10-15 com dados reais do painel):
 *   - payments 53429770… -> status 'approved' + provas Stripe (pi/cus/sub)
 *   - licenses VOLTRIS-PRO-804836… -> expires_at = fim do periodo pago
 * Antes de escrever, tenta o current_period_end EXATO via Stripe API; se a
 * chave local nao enxergar o objeto live, usa o carimbo do painel
 * (pago 15/10/2026 11:37:10 -03 = 14:37:10 UTC; mensal => +1 mes).
 * Depois reverifica a assinatura canonica da chave (a data YYYY-MM-DD nao muda,
 * entao a chave continua identica e valida).
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function loadEnv(file) {
    const p = path.join(__dirname, '..', '..', file);
    if (!fs.existsSync(p)) return {};
    const out = {};
    for (const line of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
        const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
        if (m) out[m[1]] = m[2].replace(/^"(.*)"$/, '$1');
    }
    return out;
}

const PAYMENT_ID = '53429770-12bd-41e7-bf67-12ea5ddbca32';
const LICENSE_KEY_PREFIX = 'VOLTRIS-PRO-804836';
const SUB_ID = 'sub_1UQpljJpNL78U7iCh6ZAbGl5';
const PI_ID = 'pi_3UQpljJpNL78U7iC1ifRQRdX';
const CUS_ID = 'cus_VRjEZtT4ON6UlL';
const PAID_AT_UTC = '2026-11-15T14:37:10Z'; // fallback: 15/10 14:37:10 UTC + 1 mes

(async () => {
    const env = { ...loadEnv('.env'), ...loadEnv('.env.local') };

    // 1) Determinar o fim de periodo
    let periodEnd = PAID_AT_UTC;
    let source = 'fallback (painel Stripe: pago 15/10 11:37:10 -03 + 1 mes)';
    try {
        const Stripe = require('stripe');
        const stripe = new Stripe(env.STRIPE_SECRET_KEY);
        const sub = await stripe.subscriptions.retrieve(SUB_ID);
        const end = new Date(sub.current_period_end * 1000).toISOString();
        if (sub.id === SUB_ID) { periodEnd = end; source = 'Stripe API current_period_end'; }
    } catch (e) {
        console.log('Stripe API local indisponivel p/ este objeto live:', e.message.slice(0, 80));
    }
    console.log('periodo final escolhido:', periodEnd, '->', source);

    // 2) Aplicar no banco
    const { createClient } = require('@supabase/supabase-js');
    const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

    const { data: payUp, error: e1 } = await sb.from('payments')
        .update({
            status: 'approved',
            stripe_id: PI_ID,
            stripe_customer_id: CUS_ID,
            stripe_subscription_id: SUB_ID,
        })
        .eq('id', PAYMENT_ID)
        .select('id,status,stripe_id,stripe_customer_id,stripe_subscription_id');
    if (e1) { console.error('ERRO payments:', e1.message); return; }
    console.log('payments atualizado:', JSON.stringify(payUp && payUp[0] && { ...payUp[0], stripe_id: payUp[0].stripe_id && 'pi_***', stripe_customer_id: 'cus_***', stripe_subscription_id: 'sub_***' }));

    const { data: licUp, error: e2 } = await sb.from('licenses')
        .update({ expires_at: periodEnd })
        .like('license_key', LICENSE_KEY_PREFIX + '%')
        .select('license_key, expires_at, plan_type, billing_period, revoked');
    if (e2) { console.error('ERRO licenses:', e2.message); return; }
    console.log('licenses atualizado:', JSON.stringify(licUp && licUp[0] && { key: licUp[0].license_key.slice(0, 22) + '…', expires_at: licUp[0].expires_at, plan: licUp[0].plan_type, revoked: licUp[0].revoked }));

    // 3) Reverificar assinatura canonica da chave (nao deve mudar: mesmo dia)
    const hardening = fs.readFileSync(path.join(__dirname, '..', '..', 'supabase', 'migrations', '20260818000000_security_hardening.sql'), 'utf8');
    const SECRET = hardening.match(/current_setting\('app\.license_secret', true\),\s*\r?\n\s*'([^']+)'/)[1];
    const r = licUp[0];
    const [, code, id, ymd, sig] = r.license_key.toUpperCase().split('-');
    const vu = `${ymd.slice(0, 4)}-${ymd.slice(4, 6)}-${ymd.slice(6, 8)}`;
    const json = `{"id":"${id}","validUntil":"${vu}","plan":"pro","maxDevices":3}`;
    const expect = crypto.createHash('sha256').update(Buffer.from(json + SECRET, 'utf8')).digest('hex').toUpperCase().slice(0, 16);
    console.log('assinatura canonica apos ajuste:', expect === sig ? 'OK (inalterada)' : 'DIVIRGIU?!');

    // 4) Estado final do ponto de vista do cliente
    const { data: final } = await sb.from('licenses').select('license_key, plan_type, expires_at, revoked, user_id').eq('payment_id', PAYMENT_ID);
    console.log('licenca(s) do pagamento alvo:', final && final.length, final && final.map(l => ({ key: l.license_key.slice(0, 22) + '…', ativa: !l.revoked && new Date(l.expires_at) > new Date() })));
})();
