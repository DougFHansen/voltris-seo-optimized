import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireCapability } from '@/lib/admin-auth';
import { createAdminClient } from '@/utils/supabase/admin';
import { maskEmail, readPage, paginate, sanitizeSearch } from '@/lib/admin-queries';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/clients — GESTÃO DE CLIENTES (PARTE 3).
 *
 * Decisões que valem explicar:
 *
 * 1. PAGINAÇÃO NO SERVIDOR, sempre. A PARTE 18 proíbe carregar a base no
 *    navegador, e `profiles` cresce com cada cadastro.
 *
 * 2. E-MAIL MASCARADO no payload. O administrador precisa distinguir
 *    homônimos; o domínio já faz isso. O local do e-mail é dado pessoal e não
 *    aparece em lista — só na página do cliente, onde há justificativa.
 *
 * 3. BUSCA POR CHAVE DE LICENÇA é feita no servidor, com prefixo. A chave
 *    completa nunca sai da tabela `licenses` nesta rota.
 *
 * 4. NADA é unido por e-mail. A PARTE 3 é explícita: "não unir contas
 *    diferentes somente porque possuem o mesmo endereço de e-mail". Por isso
 *    as contagens de compras/licenças vêm de `user_id`, nunca de `email`.
 */

const Query = z.object({
    q: z.string().trim().max(120).optional(),
    /** Filtra por cliente COM ou SEM compra confirmada. */
    purchased: z.enum(['all', 'with', 'without']).optional().default('all'),
    limit: z.string().optional(),
    offset: z.string().optional(),
    sort: z.enum(['recent', 'name', 'purchases']).optional().default('recent'),
});

export async function GET(req: NextRequest) {
    // BUG CORRIGIDO: a ficha do cliente estava exportada apenas como PUT,
    // enquanto o painel a pedia com `fetch(url)` — que é GET. O GET caía na
    // LISTAGEM, devolvia { items, total } com status 200 e o cliente chamava
    // `setData(json)`. O componente `Resumo` então lia `json.profile.login` em
    // um objeto sem `profile` e lançava TypeError: era isso que derrubava a
    // página inteira ao clicar em "Abrir".
    //
    // Leitura agora é GET de verdade (e PUT continua aceito para não quebrar
    // nenhum chamador antigo).
    if (req.nextUrl.searchParams.has('detail')) {
        return detail(req);
    }

    const { response } = await requireCapability('clients.read');
    if (response) return response;

    const parsed = Query.safeParse(Object.fromEntries(req.nextUrl.searchParams));
    if (!parsed.success) {
        return NextResponse.json({ error: 'Filtros inválidos.', code: 'INVALID_QUERY' }, { status: 400 });
    }

    const { limit, offset } = readPage(req.nextUrl.searchParams);
    const term = parsed.data.q ? sanitizeSearch(parsed.data.q) : '';
    const db = createAdminClient();

    try {
        let query = db
            .from('profiles')
            .select('id, login, email, full_name, phone, city, state, is_admin, is_blocked, is_deleted, created_at', {
                count: 'exact',
            })
            .eq('is_deleted', false)
            .order(parsed.data.sort === 'name' ? 'full_name' : 'created_at', {
                ascending: parsed.data.sort === 'name',
                nullsFirst: false,
            })
            .range(offset, offset + limit - 1);

        if (term) {
            // ILIKE em nome, e-mail e login. O termo já foi higienizado.
            const like = `%${term}%`;
            query = query.or(`full_name.ilike.${like},email.ilike.${like},login.ilike.${like}`);
        }

        const { data, error, count: total } = await query;

        if (error) {
            return NextResponse.json(
                { error: 'Falha ao consultar clientes.', code: 'QUERY_FAILED', detail: error.message },
                { status: 500 }
            );
        }

        const rows = data ?? [];

        // Contagens de compra por cliente: UMA consulta agregada, não uma por
        // linha. Isto é o N+1 que a PARTE 18 proíbe.
        const ids = rows.map((r: any) => r.id).filter(Boolean);
        let purchaseCount = new Map<string, number>();
        let licenseCount = new Map<string, number>();

        if (ids.length > 0) {
            const [payRes, licRes] = await Promise.all([
                db.from('payments')
                    .select('user_id')
                    .in('user_id', ids)
                    .in('status', ['approved', 'paid', 'succeeded']),
                db.from('licenses').select('user_id').in('user_id', ids),
            ]);

            for (const r of (payRes.data ?? []) as any[]) {
                purchaseCount.set(r.user_id, (purchaseCount.get(r.user_id) ?? 0) + 1);
            }
            for (const r of (licRes.data ?? []) as any[]) {
                licenseCount.set(r.user_id, (licenseCount.get(r.user_id) ?? 0) + 1);
            }
        }

        let items = rows.map((r: any) => ({
            id: r.id,
            login: r.login ?? null,
            emailMasked: maskEmail(r.email),
            // Nome para o operador reconhecer o cliente na lista.
            // `??` não basta: há perfis com `full_name` vazio (string ''), e a
            // lista ficava com a célula em branco. `||` cai para o login.
            fullName: (r.full_name ?? '').trim() || r.login || '—',
            phone: r.phone ?? null,
            city: r.city ?? null,
            state: r.state ?? null,
            isAdmin: r.is_admin === true,
            isBlocked: r.is_blocked === true,
            createdAt: r.created_at,
            purchases: purchaseCount.get(r.id) ?? 0,
            licenses: licenseCount.get(r.id) ?? 0,
        }));

        if (parsed.data.purchased === 'with') items = items.filter((i) => i.purchases > 0);
        if (parsed.data.purchased === 'without') items = items.filter((i) => i.purchases === 0);

        if (parsed.data.sort === 'purchases') {
            items.sort((a, b) => b.purchases - a.purchases);
        }

        return NextResponse.json(paginate(items, total ?? items.length, limit, offset));
    } catch (err: any) {
        return NextResponse.json(
            { error: 'Erro inesperado ao listar clientes.', code: 'UNEXPECTED' },
            { status: 500 }
        );
    }
}

/**
 * GET /api/admin/clients?detail=<uuid> — VISÃO COMPLETA DE UM CLIENTE (PARTE 3).
 *
 * Todas as seções vêm vinculadas pelo `user_id` do cliente selecionado. Nada é
 * unido por e-mail: duas contas com o mesmo endereço continuam separadas, que
 * é a regra explícita da parte.
 */
export async function PUT(req: NextRequest) {
    return detail(req);
}

async function detail(req: NextRequest) {
    const { response } = await requireCapability('clients.read');
    if (response) return response;

    const id = req.nextUrl.searchParams.get('detail');
    if (!id || !/^[0-9a-f-]{36}$/i.test(id)) {
        return NextResponse.json({ error: 'Identificador inválido.', code: 'INVALID_ID' }, { status: 400 });
    }

    const db = createAdminClient();

    try {
        const { data: profile } = await db
            .from('profiles')
            .select('id, login, email, full_name, phone, address, city, neighborhood, state, cep, is_admin, is_blocked, created_at')
            .eq('id', id).maybeSingle();

        if (!profile) {
            return NextResponse.json({ error: 'Cliente não encontrado.', code: 'NOT_FOUND' }, { status: 404 });
        }

        // Os pedidos são carregados ANTES dos dispositivos porque os
        // dispositivos sao ligados ao cliente pela CHAVE DA LICENÇA, e não por
        // `user_id`.
        //
        // BUG CORRIGIDO AQUI: a versão anterior fazia
        //     .from('license_devices').eq('user_id', id)
        // e a tabela `license_devices` NÃO TEM a coluna `user_id` — colunas
        // reais: id, license_key, device_id, machine_name, os_version,
        // app_version, activated_at, last_seen_at, device_name, last_used_at,
        // processor_count. O PostgREST devolvia
        //     42703 - column license_devices.user_id does not exist
        // o `Promise.all` rejeitava e a ficha do cliente retornava 500. Era por
        // isso que clicar em "Abrir" não trazia nada.
        const payments = await db
            .from('payments')
            .select('id, reference_id, plan_type, amount, currency, status, invoice_kind, created_at, paid_at, stripe_invoice_id, stripe_subscription_id')
            .eq('user_id', id)
            .order('created_at', { ascending: false })
            .limit(50);

        const licenses = await db
            .from('licenses')
            .select('license_key, plan_type, max_devices, created_at, activated_at, expires_at, revoked, client_id')
            .eq('user_id', id)
            .order('created_at', { ascending: false })
            .limit(50);

        const licenseRows = (licenses.data ?? []) as Array<{ license_key?: string | null }>;
        const keys = licenseRows.map((l) => l.license_key).filter((k): k is string => !!k);

        // Sem licença não há chave para consultar — e aí a lista é legitimamente
        // vazia, não um erro.
        const devices = keys.length > 0
            ? await db
                .from('license_devices')
                .select('id, license_key, device_id, machine_name, device_name, os_version, app_version, activated_at, last_seen_at')
                .in('license_key', keys)
                .order('activated_at', { ascending: false })
                .limit(100)
            : { data: [] as any[], error: null };

        const [subscriptions, audit] = await Promise.all([
            db.from('subscriptions')
                .select('id, plan_type, status, billing_period, cancel_at_period_end, next_billing_at, pagbank_subscription_id')
                .eq('user_id', id)
                .limit(50),
            db.from('admin_audit_log')
                .select('id, action, resource, resource_id, outcome, created_at')
                .eq('admin_id', id)
                .order('created_at', { ascending: false })
                .limit(20),
        ]);

        // As faturas são as mesmas compras confirmadas: a fatura É derivada do
        // pagamento, não uma entidade separada (PARTE 9).
        const invoices = (payments.data ?? []).filter((p: any) =>
            ['approved', 'paid', 'succeeded', 'refunded', 'partially_refunded'].includes(String(p.status).toLowerCase())
        );

        // Uma seção que falhou não pode derrubar as outras. O administrador
        // precisa ver o que existe, com o aviso do que não veio.
        const falhas: string[] = [];
        if (payments.error) falhas.push('compras');
        if (licenses.error) falhas.push('licenças');
        if (devices.error) falhas.push('dispositivos');
        if (subscriptions.error) falhas.push('assinaturas');

        return NextResponse.json({
            profile: {
                ...profile,
                // E-mail completo só aqui: a página do cliente tem
                // justificativa operacional, a lista não.
                email: profile.email,
            },
            purchases: payments.data ?? [],
            licenses: licenses.data ?? [],
            subscriptions: subscriptions.data ?? [],
            devices: devices.data ?? [],
            invoices,
            adminHistory: audit.data ?? [],
            ...(falhas.length > 0 ? { secoesComFalha: falhas } : {}),
        });
    } catch (err: any) {
        return NextResponse.json({ error: 'Erro ao carregar o cliente.', code: 'UNEXPECTED' }, { status: 500 });
    }
}
