/**
 * READ-ONLY: sonda o RPC novo com entradas INVALIDAS de proposito.
 * As validacoes do novo corpo RAISE-iam antes de qualquer INSERT/UPDATE,
 * entao nada e escrito. Prova 3 coisas:
 *   1) a chamada nomeada de 5+ args do webhook resolve para a funcao NOVA
 *      (sem erro de ambiguidade do PostgREST);
 *   2) erros viram excecoes explicitas (nao mais NULL silencioso);
 *   3) grants de service_role estao ativos (caminho do webhook).
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

(async () => {
    const env = { ...loadEnv('.env'), ...loadEnv('.env.local') };
    const { createClient } = require('@supabase/supabase-js');
    const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

    // Sonda 1: payment_id nulo -> esperado PAYMENT_ID_REQUIRED
    const r1 = await sb.rpc('generate_complete_license_v3', {
        p_payment_id: null,
        p_user_id: null,
        p_email: 'probe-invalido@invalido.test',
        p_plan_type: 'pro',
        p_billing_period: 'month',
        p_stripe_session_id: null,
    });
    console.log('SONDA1 (payment_id nulo):', JSON.stringify({ data: r1.data, error: r1.error && r1.error.message }));

    // Sonda 2: UUID inexistente -> esperado PAYMENT_NOT_FOUND (nada escrito)
    const r2 = await sb.rpc('generate_complete_license_v3', {
        p_payment_id: '00000000-0000-4000-8000-000000000000',
        p_user_id: null,
        p_email: 'probe-invalido@invalido.test',
        p_plan_type: 'pro',
        p_billing_period: 'month',
        p_stripe_session_id: null,
    });
    console.log('SONDA2 (uuid inexistente):', JSON.stringify({ data: r2.data, error: r2.error && r2.error.message }));

    // Conferencia: o pagamento alvo nao foi tocado
    const { data: pay } = await sb.from('payments').select('id,status').eq('id', '53429770-12bd-41e7-bf67-12ea5ddbca32').maybeSingle();
    console.log('STATUS DO PAGAMENTO ALVO (deve continuar pending):', pay && pay.status);

    // Conferencia: contagem de licencas (devem continuar 8)
    const { count } = await sb.from('licenses').select('license_key', { count: 'exact', head: true });
    console.log('TOTAL DE LICENCAS (deve continuar 8):', count);
})();
