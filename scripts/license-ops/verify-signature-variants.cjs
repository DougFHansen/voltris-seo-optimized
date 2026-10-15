/**
 * READ-ONLY: confirma qual algoritmo gerou as 8 chaves existentes.
 * Candidato CANONICO (sobrecarga A / C# / generate_voltris_signature):
 *   SIG = upper(hex(sha256(payload + segredo)))[0..16]
 * Candidato LEGADO-B (sobrecarga text,7 args):
 *   SIG = upper(hex(hmac_sha256(chave=segredo, msg=payload + segredo)))[0..16]
 * Segredo lido do proprio repo (fallback oficial) e NUNCA impresso.
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
const hardening = fs.readFileSync(path.join(__dirname, '..', '..', 'supabase', 'migrations', '20260818000000_security_hardening.sql'), 'utf8');
const SECRET = hardening.match(/current_setting\('app\.license_secret', true\),\s*\r?\n\s*'([^']+)'/)[1];

const sigCanonico = (json) => crypto.createHash('sha256').update(Buffer.from(json + SECRET, 'utf8')).digest('hex').toUpperCase().slice(0, 16);
const sigHmacB = (json) => crypto.createHmac('sha256', Buffer.from(SECRET, 'utf8')).update(Buffer.from(json + SECRET, 'utf8')).digest('hex').toUpperCase().slice(0, 16);

const PLAN_BY_CODE = { TRI: 'trial', STA: 'standard', PRO: 'pro', ENT: 'enterprise', TRL: 'trial', LIF: 'lifetime' };

(async () => {
    const env = { ...loadEnv('.env'), ...loadEnv('.env.local') };
    const { createClient } = require('@supabase/supabase-js');
    const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
    const { data: rows } = await sb.from('licenses').select('license_key, plan_type, max_devices, notes').order('created_at');
    for (const r of rows) {
        const parts = r.license_key.toUpperCase().split('-');
        const [, code, id, ymd, sig] = parts;
        const vu = `${ymd.slice(0, 4)}-${ymd.slice(4, 6)}-${ymd.slice(6, 8)}`;
        const plan = PLAN_BY_CODE[code] || r.plan_type;
        const json = `{"id":"${id}","validUntil":"${vu}","plan":"${plan}","maxDevices":${r.max_devices}}`;
        const mCanon = sigCanonico(json) === sig;
        const mHmac = sigHmacB(json) === sig;
        const notesTemPag = /payment_id: [0-9a-f-]{36}/i.test(r.notes || '');
        console.log(`${r.license_key.slice(0, 22)}… canonico=${mCanon ? 'SIM' : 'nao'} hmacB=${mHmac ? 'SIM' : 'nao'} notes_com_payment_id=${notesTemPag}`);
    }
})();
