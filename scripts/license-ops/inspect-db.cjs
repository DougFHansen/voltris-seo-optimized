/**
 * Inspecao READ-ONLY do estado de licencas/pagamentos no Supabase (via PostgREST, service_role).
 * Uso: node scripts/license-ops/inspect-db.cjs
 * Nao imprime segredos; e-mails e chaves sao mascarados.
 */
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

function loadEnv(file) {
    const p = path.join(__dirname, '..', '..', file);
    if (!fs.existsSync(p)) return {};
    const out = {};
    for (const line of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
        const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
        if (m) out[m[1]] = m[2].replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');
    }
    return out;
}
const env = { ...loadEnv('.env'), ...loadEnv('.env.local') };
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) { console.error('Faltam NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY'); process.exit(1); }

const sb = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });

const maskEmail = (e) => !e ? String(e) : e.length > 6 ? e[0] + '*'.repeat(Math.min(8, e.length - 2)) + e[e.length - 1] : '***';
const maskKey = (k) => !k ? String(k) : k.slice(0, 15) + '•'.repeat(Math.max(0, k.length - 15));
const short = (u) => !u ? String(u) : String(u).slice(0, 8) + '…';

(async () => {
    console.log('== 1. public.licenses: TODAS as linhas (revela colunas reais) ==');
    const lic = await sb.from('licenses').select('*').order('created_at', { ascending: true });
    if (lic.error) console.log('ERRO:', lic.error.code, lic.error.message);
    else {
        console.log('total =', (lic.data || []).length);
        if (lic.data.length) console.log('colunas =', Object.keys(lic.data[0]).sort().join(', '));
        for (const l of lic.data) {
            console.log(JSON.stringify({
                key: maskKey(l.license_key), plan: l.plan_type, max: l.max_devices,
                expires: l.expires_at, billing: l.billing_period, revoked: l.revoked,
                email: maskEmail(l.customer_email ?? l.email), user_id: short(l.user_id),
                client_id: l.client_id, payment_id: l.payment_id ? short(l.payment_id) : l.payment_id,
                created: l.created_at, disp: l.license_display_name,
            }));
        }
    }

    console.log('\n== 2. Pagamento alvo 53429770-12bd-41e7-bf67-12ea5ddbca32 ==');
    const pay = await sb.from('payments').select('*').eq('id', '53429770-12bd-41e7-bf67-12ea5ddbca32').maybeSingle();
    if (pay.error) console.log('ERRO:', pay.error.code, pay.error.message);
    else if (!pay.data) console.log('NAO ENCONTRADO');
    else {
        const p = pay.data;
        console.log(JSON.stringify({
            id: short(p.id), reference_id: p.reference_id, pagbank_id: p.pagbank_id,
            amount: String(p.amount), status: p.status, plan_type: p.plan_type,
            email: maskEmail(p.email), user_id: short(p.user_id),
            created: p.created_at, updated: p.updated_at,
            colunas: Object.keys(p).sort().join(', '),
        }));
    }

    console.log('\n== 3. Pagamentos pendentes/nao-licenca (evitar tocar — misses 14) ==');
    const pays = await sb.from('payments').select('id,reference_id,status,plan_type,amount,created_at').order('created_at', { ascending: false }).limit(30);
    if (pays.error) console.log('ERRO:', pays.error.message);
    else for (const p of pays.data) console.log(JSON.stringify({ ...p, id: short(p.id) }));

    console.log('\n== 4. Profile do dono (38a58d09-20aa-40ac-b92a-4519b0cdc086) ==');
    const prof = await sb.from('profiles').select('id,email').eq('id', '38a58d09-20aa-40ac-b92a-4519b0cdc086').maybeSingle();
    console.log(prof.error ? `ERRO: ${prof.error.message}` : JSON.stringify({ id: short(prof.data?.id), email: maskEmail(prof.data?.email) }));

    console.log('\n== 5. audit_logs recentes (LICENSE_GEN_ERROR e afins) ==');
    const aud = await sb.from('audit_logs').select('event_type,created_at,metadata')
        .in('event_type', ['LICENSE_GEN_ERROR', 'LICENSE_NOT_IN_DB', 'LICENSE_ACTIVATED', 'REPAIR_INSTALLATIONS_AFTER'])
        .order('created_at', { ascending: false }).limit(10);
    if (aud.error) console.log('ERRO (tabela pode nao existir):', aud.error.code, aud.error.message);
    else for (const a of aud.data) console.log(JSON.stringify({ ev: a.event_type, at: a.created_at, meta_keys: a.metadata ? Object.keys(a.metadata) : null, err: a.metadata?.error ? String(a.metadata.error).slice(0, 120) : undefined }));

    console.log('\n== 6. subscriptions do usuario/email-alvo ==');
    const subs = await sb.from('subscriptions').select('*').eq('user_id', '38a58d09-20aa-40ac-b92a-4519b0cdc086');
    if (subs.error) console.log('ERRO:', subs.error.code, subs.error.message);
    else for (const s of subs.data) console.log(JSON.stringify({ id: short(s.id), status: s.status, plan: s.plan_type, billing: s.billing_period, pagbank_sub: s.pagbank_subscription_id ? short(s.pagbank_subscription_id) : null, ref: s.reference_id, email: maskEmail(s.email), cols: Object.keys(s).length }));

    console.log('\n== 7. license_devices das licencas existentes ==');
    const dev = await sb.from('license_devices').select('license_key,device_id,activated_at');
    console.log(dev.error ? `ERRO: ${dev.error.message}` : `total devices = ${(dev.data || []).length}`);

    console.log('\n== 8. instalacoes do usuario-alvo ==');
    const inst = await sb.from('installations').select('id,license_status,license_key,last_seen_at').eq('user_id', '38a58d09-20aa-40ac-b92a-4519b0cdc086');
    if (inst.error) console.log('ERRO:', inst.error.message);
    else for (const i of inst.data) console.log(JSON.stringify({ id: short(i.id), status: i.license_status, key: maskKey(i.license_key), seen: i.last_seen_at }));
})();
