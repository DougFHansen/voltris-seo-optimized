import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { mesmoTelefone, normalizarTelefone, padroesDeBusca, valorPostgREST } from '@/lib/phone-dup';

// Chave administrativa usada apenas no servidor para checagens do sistema.
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Janela de 60s por IP. O teto é folgado para uso humano real (uma checagem por
// campo ao cadastrar) e derruba varredura automatizada de bases de contas.
const WINDOW_MS = 60_000;
const MAX_PER_IP = 25;
const attempts = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const e = attempts.get(ip);
    if (!e || now >= e.resetAt) {
        attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
        return false;
    }
    e.count += 1;
    if (e.count > MAX_PER_IP) return true;
    attempts.set(ip, e);
    return false;
}

/**
 * Resolve a conta logada (se houver) pelo token da requisição.
 *
 * Serve para NÃO acusar o próprio usuário de conflito quando ele está
 * completando o perfil — a própria conta é, claro, a dona daquele login e
 * daquele WhatsApp.
 *
 * A exclusão NUNCA vem do corpo da requisição: se o cliente pudesse mandar um
 * id alheio, bastaria mandar o id da vítima para registrar um WhatsApp
 * duplicado. O id vem do token, que é verificável.
 */
async function resolverUsuarioDaRequisicao(req: Request): Promise<string | null> {
    const header = req.headers.get('authorization');
    if (!header || !header.toLowerCase().startsWith('bearer ')) return null;
    const token = header.slice(7).trim();
    if (!token) return null;
    try {
        const { data, error } = await supabaseAdmin.auth.getUser(token);
        if (error || !data?.user?.id) return null;
        return data.user.id;
    } catch {
        return null;
    }
}

/**
 * O e-mail já existe no Authentication (auth.users)?
 *
 * O código anterior usava `auth.admin.getUserByEmail(...)` — método que
 * NÃO EXISTE no @supabase/supabase-js 2.50. A chamada estourava um TypeError
 * e caía no `catch`, que devolvia `available: true`. Ou seja: a checagem de
 * e-mail (e, junto com ela, a de usuário) NUNCA funcionou — o endpoint
 * respondia "disponível" para tudo.
 *
 * Hoje a verificação é feita em duas camadas:
 *  1. `profiles.email` (consulta exata e barata, espelha o e-mail real);
 *  2. `auth.users`, varrendo as páginas do admin com limite e cache curto.
 *
 * A garantia dura continua sendo do banco: o Auth tem e-mail único. A
 * checagem aqui é a camada AMIGÁVEL, para o usuário saber antes de tentar.
 */
const AUTH_CACHE_TTL = 60_000;
const MAX_PAGINAS_AUTH = 10;
const PAGINA_AUTH = 1000;
let cacheAuth: { porEmail: Map<string, string>; expires: number } | null = null;

/** Devolve o id do dono do e-mail no Auth, ou null se não achar (ou falhar). */
async function donoDoEmailNoAuth(email: string): Promise<string | null> {
    const alvo = String(email).trim().toLowerCase();
    if (!alvo) return null;

    if (!cacheAuth || cacheAuth.expires < Date.now()) {
        const map = new Map<string, string>();
        try {
            for (let page = 1; page <= MAX_PAGINAS_AUTH; page++) {
                const { data, error } = await supabaseAdmin.auth.admin.listUsers({
                    page,
                    perPage: PAGINA_AUTH,
                });
                if (error || !data?.users?.length) break;
                for (const u of data.users) {
                    if (u.email) map.set(u.email.toLowerCase(), u.id);
                }
                if (data.users.length < PAGINA_AUTH) break;
            }
            cacheAuth = { porEmail: map, expires: Date.now() + AUTH_CACHE_TTL };
        } catch {
            // Se a varredura falhar, seguimos só com a checagem em profiles.
            return null;
        }
    }
    return cacheAuth.porEmail.get(alvo) ?? null;
}

/**
 * O telefone informado já pertence a alguma conta?
 *
 * A comparação é feita sobre o número NORMALIZADO (só dígitos), porque o
 * banco guarda o telefone formatado ("(37) 99812-7122") e o filtro por
 * texto com dígitos nunca casava. Ver `lib/phone-dup.ts`.
 */
async function telefoneEmUso(phone: string, excludeId: string | null): Promise<boolean> {
    const alvo = normalizarTelefone(phone);
    if (!alvo) return false;

    // Caminho exato quando a coluna `phone_normalized` existe (admin.sql).
    // Não substitui o caminho textual: contas antigas podem estar com a
    // coluna vazia até o backfill revisado, e elas ainda contam.
    try {
        const { data, error } = await supabaseAdmin
            .from('profiles')
            .select('id, phone_normalized')
            .eq('phone_normalized', alvo);
        if (!error && Array.isArray(data)) {
            if (data.some((r) => r.id !== excludeId)) return true;
        }
    } catch {
        // Coluna inexistente: segue para o caminho textual.
    }

    // Caminho textual: traz CANDIDATOS por padrão e compara dígito a dígito.
    const padroes = padroesDeBusca(phone);
    if (padroes.length === 0) return false;

    const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('id, phone')
        .or(padroes.join(','));
    if (error) throw error;

    return (data ?? []).some((r) => r.id !== excludeId && mesmoTelefone(r.phone, phone));
}

export async function POST(req: Request) {
    try {
        const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
            || req.headers.get('x-real-ip')
            || 'local';
        if (isRateLimited(ip)) {
            return NextResponse.json(
                { available: false, error: 'Muitas tentativas em sequência. Aguarde um instante e tente novamente.' },
                { status: 429, headers: { 'retry-after': '60' } }
            );
        }

        const { email, login, phone } = await req.json();
        const conflicts: string[] = [];
        const excludeId = await resolverUsuarioDaRequisicao(req);

        // 1. Check Login (Username)
        if (login) {
            const { data } = await supabaseAdmin
                .from('profiles')
                .select('id')
                .eq('login', login);
            if ((data ?? []).some((r) => r.id !== excludeId)) conflicts.push('usuário');
        }

        // 2. Check Email
        if (email) {
            const alvo = String(email).trim();
            const { data } = await supabaseAdmin
                .from('profiles')
                .select('id, email')
                .or(`email.eq.${valorPostgREST(alvo)},email.eq.${valorPostgREST(alvo.toLowerCase())}`);
            if ((data ?? []).some((r) => r.id !== excludeId)) conflicts.push('e-mail');

            // Segunda camada: o e-mail no Authentication (auth.users).
            if (!conflicts.includes('e-mail')) {
                const dono = await donoDoEmailNoAuth(email);
                // A lista de e-mails vem de uma varredura em cache: um e-mail
                // recém-criado pode não aparecer nela. A garantia dura continua
                // sendo o UNIQUE do Auth, que rejeita o cadastro de qualquer
                // forma.
                if (dono && dono !== excludeId) conflicts.push('e-mail');
            }
        }

        // 3. Check Phone (WhatsApp) — comparação por número normalizado
        if (phone) {
            if (await telefoneEmUso(phone, excludeId)) conflicts.push('WhatsApp');
        }

        if (conflicts.length > 0) {
            const msg = `O seguinte já está em uso: ${conflicts.join(', ')}.`;
            return NextResponse.json({ available: false, error: msg });
        }

        return NextResponse.json({ available: true });

    } catch (error) {
        // FALHA FECHADA. Antes devolvia `available: true` no erro — ou seja,
        // "não consegui verificar" virava "pode cadastrar". Como o WhatsApp
        // duplicado não tem restrição no banco, essa falha aberta permitia
        // duplicatas sem ninguém perceber.
        console.error('[AVAILABILITY CHECK ERROR]', error);
        return NextResponse.json(
            { available: false, error: 'Não foi possível verificar a disponibilidade agora. Tente novamente em instantes.' },
            { status: 503 }
        );
    }
}
