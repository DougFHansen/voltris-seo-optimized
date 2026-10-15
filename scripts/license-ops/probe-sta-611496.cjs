/** Probe READ-ONLY para a chave STA-611496 (unica que nao bate nem canonico nem HMAC-B). */
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
const fix24 = fs.readFileSync(path.join(__dirname, '..', '..', 'supabase', 'migrations', '20260219000001_fix_function_search_path_security.sql'), 'utf8');
const SEC25 = hardening.match(/current_setting\('app\.license_secret', true\),\s*\r?\n\s*'([^']+)'/)[1];
const SEC24 = fix24.match(/v_secret_key TEXT := '([^']+)'/)[1];

const sha = (s) => crypto.createHash('sha256').update(Buffer.from(s, 'utf8')).digest('hex').toUpperCase();
const hmac = (m, k) => crypto.createHmac('sha256', Buffer.from(k, 'utf8')).update(Buffer.from(m, 'utf8')).digest('hex').toUpperCase();

(async () => {
    const env = { ...loadEnv('.env'), ...loadEnv('.env.local') };
    const { createClient } = require('@supabase/supabase-js');
    const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
    const { data: rows } = await sb.from('licenses').select('license_key, max_devices, created_at').like('license_key', 'VOLTRIS-STA-611496%');
    const key = rows[0].license_key.toUpperCase();
    const [, code, id, ymd, sig] = key.split('-');
    const vu = `${ymd.slice(0, 4)}-${ymd.slice(4, 6)}-${ymd.slice(6, 8)}`;
    console.log('alvo:', key.slice(0, 22) + '… sig=' + sig.slice(0, 4) + '****');

    const payloads = [
        `{"id":"${id}","validUntil":"${vu}","plan":"standard","maxDevices":1}`,
        `{"id":"${id}","validUntil":"${vu}","plan":"standard","maxDevices": 1}`,
        `{"id":"${id}","validUntil":"${vu}","plan":"Mensal"}`,
        `{"id":"${id}","validUntil":"${vu}","plan":"Anual"}`,
        `${id}|${vu}|standard`,
    ];
    const secrets = [SEC25, SEC24];
    const algos = [
        ['digest', (p, s) => sha(p + s).slice(0, 16)],
        ['hmac', (p, s) => hmac(p + s, s).slice(0, 16)],
        ['hmac-sem-sufixo', (p, s) => hmac(p, s).slice(0, 16)],
        ['digest-hash8x3', (p, s) => { const h = sha(p + s); return h.slice(0, 8) + '-' + h.slice(8, 16) + '-' + h.slice(16, 24); }],
    ];
    let hit = null;
    for (const [i, p] of payloads.entries())
        for (const [j, s] of secrets.entries())
            for (const [name, f] of algos)
                if (f(p, s) === sig) hit = { payloadIdx: i, secretIdx: j, algo: name };
    console.log('RESULTADO:', hit ? JSON.stringify(hit) : 'nenhum dos candidatos conhecidos');
})();
