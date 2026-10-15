/**
 * READ-ONLY: simula a consulta da rota /api/v1/license/me (service_role, filtro
 * por user_id entao customer_email) para provar que a licença Pro do cliente
 * aparece no "Minhas Licenças" apos a correcao do DashboardClient.
 */
const fs = require('fs');
const path = require('path');

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

const USER_ID = '38a58d09-20aa-40ac-b92a-4519b0cdc086';

(async () => {
    const env = { ...loadEnv('.env'), ...loadEnv('.env.local') };
    const { createClient } = require('@supabase/supabase-js');
    const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

    const { data: byUser, error: e1 } = await sb.from('licenses').select('*').eq('user_id', USER_ID).order('created_at', { ascending: false });
    if (e1) { console.error('ERRO', e1.message); return; }

    const mask = (k) => (k ? k.slice(0, 22) + '…' : String(k));
    console.log(`licencas por user_id=${USER_ID.slice(0, 8)}… -> ${byUser.length}`);
    for (const l of byUser) {
        const ativa = !l.revoked && new Date(l.expires_at) > new Date();
        const { count: devCount } = await sb.from('license_devices').select('id', { count: 'exact', head: true }).eq('license_key', l.license_key);
        console.log([
            '  key=' + mask(l.license_key),
            'plan=' + l.plan_type,
            'period=' + l.billing_period,
            'max=' + l.max_devices,
            'devices=' + (devCount ?? 0),
            'expires=' + l.expires_at,
            'revoked=' + l.revoked,
            'isActive=' + ativa,
            'payment_id=' + (l.payment_id ? l.payment_id.slice(0, 8) + '…' : l.payment_id),
            'display=' + l.license_display_name,
        ].join(' | '));
    }

    // Confirmar tambem o vinculo do pagamento alvo (sem alterar nada)
    const { data: pay } = await sb.from('payments').select('id,status,plan_type,billing_period,user_id,email').eq('id', '53429770-12bd-41e7-bf67-12ea5ddbca32').maybeSingle();
    console.log('pagamento alvo:', pay ? JSON.stringify({ ...pay, email: pay.email && pay.email.slice(0, 3) + '***' }) : 'nao encontrado');
})();
