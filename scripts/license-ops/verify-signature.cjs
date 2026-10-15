/**
 * Verificacao READ-ONLY do formato de assinatura CANONICO das chaves existentes.
 * Algoritmo (idêntico ao C# LicenseGenerator e ao generate_voltris_signature do DB):
 *   SIG16 = upper(hex(SHA-256( utf8(JSON + segredo) )))[0..16]
 *   JSON  = {"id":"<client_id>","validUntil":"<YYYY-MM-DD>","plan":"<plan>","maxDevices":<n>}
 * O segredo e lido do fallback oficial (migration de hardening) e NUNCA impresso.
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

// Segredo: mesma fonte que o app desktop e o DB usam como fallback (arquivo do proprio repo).
const hardening = fs.readFileSync(path.join(__dirname, '..', '..', 'supabase', 'migrations', '20260818000000_security_hardening.sql'), 'utf8');
const secretMatch = hardening.match(/current_setting\('app\.license_secret', true\),\s*\r?\n\s*'([^']+)'/);
if (!secretMatch) { console.error('fallback de segredo nao localizado no hardening'); process.exit(1); }
const SECRET = secretMatch[1];

function sigFor(json) {
    return crypto.createHash('sha256').update(Buffer.from(json + SECRET, 'utf8')).digest('hex').toUpperCase().slice(0, 16);
}

const PLAN_BY_CODE = { TRI: ['trial', 1], STA: ['standard', 1], PRO: ['pro', 3], ENT: ['enterprise', 9999] };

(async () => {
    const env = { ...loadEnv('.env'), ...loadEnv('.env.local') };
    const { createClient } = require('@supabase/supabase-js');
    const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
    const { data: rows, error } = await sb.from('licenses').select('license_key, client_id, plan_type, max_devices, expires_at').order('created_at');
    if (error) { console.error('ERRO lendo licenses:', error.message); process.exit(1); }

    let ok = 0, bad = 0;
    for (const r of rows) {
        const parts = r.license_key.toUpperCase().split('-');
        if (parts.length !== 5 || parts[0] !== 'VOLTRIS') { console.log('FORMATO estranho:', r.license_key.slice(0, 15) + '…'); bad++; continue; }
        const [, code, idFromKey, ymd, sigFromKey] = parts;
        const [y, m, d] = [ymd.slice(0, 4), ymd.slice(4, 6), ymd.slice(6, 8)];
        const validUntil = `${y}-${m}-${d}`;
        const clientId = r.client_id || idFromKey;
        const [planName, devCanonical] = PLAN_BY_CODE[code] || [r.plan_type, r.max_devices];
        // candidato canonico: plan/maxDevices do proprio schema de plano
        const json = `{"id":"${clientId}","validUntil":"${validUntil}","plan":"${planName}","maxDevices":${r.max_devices ?? devCanonical}}`;
        const expect = sigFor(json);
        const match = expect === sigFromKey.toUpperCase();
        console.log(`${match ? 'OK  ' : 'FAIL'} ${r.license_key.slice(0, 22)}… plan=${r.plan_type} max=${r.max_devices} validade_key=${validUntil} expires_db=${(r.expires_at || '').slice(0, 10)}${match ? '' : ' | json_tentado=' + json}`);
        match ? ok++ : bad++;
    }
    console.log(`\nresumo: ${ok} OK, ${bad} FAIL de ${rows.length}`);
    console.log('DATA de hoje (UTC):', new Date().toISOString());
})();
