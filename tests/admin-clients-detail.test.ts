/**
 * REGRESSÃO DO CRASH AO ABRIR A FICHA DO CLIENTE.
 *
 * O caso real: `GET /api/admin/clients?detail=<uuid>` devolvia a LISTAGEM
 * (`{ items, total }`) porque a ficha estava exportada apenas como `PUT`.
 * O painel chamava com `fetch()` — GET — recebia 200, guardava o corpo e o
 * componente `Resumo` lia `d.profile.login` em um objeto sem `profile`.
 * Resultado: TypeError no render e a página inteira caía com
 * "Application error: a client-side exception has occurred".
 *
 * Este teste chama o handler de verdade. O banco é um dublê em memória e a
 * autorização é concedida pelo mock — o que está sob teste é o ROTEAMENTO
 * (GET + ?detail= precisa devolver a ficha, não a lista) e o formato do corpo.
 */

import { describe, test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const ID = '11111111-1111-4111-8111-111111111111';

const PROFILE = {
    id: ID,
    login: 'cliente.teste',
    email: 'cliente.teste@example.com',
    full_name: 'Cliente Teste',
    phone: null,
    address: null,
    city: 'São Paulo',
    neighborhood: null,
    state: 'SP',
    cep: null,
    is_admin: false,
    is_blocked: false,
    created_at: '2026-01-01T00:00:00.000Z',
};

const PAYMENT = {
    id: 'pay-1',
    reference_id: 'st_123',
    plan_type: 'pro',
    amount: 15,
    currency: 'BRL',
    status: 'approved',
    invoice_kind: 'purchase',
    created_at: '2026-02-01T00:00:00.000Z',
    paid_at: '2026-02-01T00:00:00.000Z',
    stripe_invoice_id: null,
    stripe_subscription_id: null,
};

const LICENSE = {
    license_key: 'VOLTRIS-PRO-TESTE',
    plan_type: 'pro',
    max_devices: 1,
    created_at: '2026-02-01T00:00:00.000Z',
    activated_at: null,
    expires_at: '2026-03-01T00:00:00.000Z',
    revoked: false,
    client_id: 'CLI-1',
};

const TABLES: Record<string, any[]> = {
    profiles: [PROFILE],
    payments: [PAYMENT],
    licenses: [LICENSE],
    license_devices: [],
    subscriptions: [],
    admin_audit_log: [],
};

function chain(table: string) {
    const data = TABLES[table] ?? [];
    const q: any = {
        select: () => q,
        eq: () => q,
        in: () => q,
        or: () => q,
        order: () => q,
        limit: () => q,
        range: () => q,
        maybeSingle: async () => ({
            data: table === 'profiles' ? PROFILE : null,
            error: null,
        }),
        then: (resolve: any, reject: any) =>
            Promise.resolve({ data, error: null }).then(resolve, reject),
    };
    return q;
}

// Os mocks precisam existir ANTES do import do módulo sob teste.
// `as any`: o runtime do Node 24 usa `exports`, mas os tipos instalados ainda
// declaram só o antigo `namedExports`.
mock.module('@/lib/admin-auth', {
    exports: {
        requireCapability: async () => ({ response: null, actor: { id: 'admin-teste', role: 'superadmin' } }),
    },
} as any);

mock.module('@/utils/supabase/admin', {
    exports: {
        createAdminClient: () => ({ from: (table: string) => chain(table) }),
    },
} as any);

const { GET, PUT } = await import('@/app/api/admin/clients/route');

function req(url: string) {
    return { nextUrl: new URL(url) } as any;
}

describe('GET /api/admin/clients?detail= devolve a FICHA, não a listagem', () => {
    test('o corpo tem profile e NÃO tem items', async () => {
        const res: any = await GET(req(`https://x/api/admin/clients?detail=${ID}`));
        const body = await res.json();

        assert.equal(res.status, 200);
        assert.ok(body.profile, 'sem profile, o drawer quebra em d.profile.login');
        assert.equal(body.profile.id, ID);
        assert.equal(
            Object.prototype.hasOwnProperty.call(body, 'items'),
            false,
            'devolveu a listagem: foi exatamente isso que derrubou a página'
        );
    });

    test('as seções são sempre arrays (o render chama .length nelas)', async () => {
        const res: any = await GET(req(`https://x/api/admin/clients?detail=${ID}`));
        const body = await res.json();

        for (const chave of ['purchases', 'licenses', 'subscriptions', 'devices', 'invoices', 'adminHistory']) {
            assert.ok(Array.isArray(body[chave]), `${chave} não é array`);
        }
        assert.equal(body.purchases[0].status, 'approved');
        assert.equal(body.licenses[0].license_key, 'VOLTRIS-PRO-TESTE');
    });

    test('a listagem continua funcionando quando NÃO há detail', async () => {
        const res: any = await GET(req('https://x/api/admin/clients?limit=3'));
        const body = await res.json();

        assert.equal(res.status, 200);
        assert.ok(Array.isArray(body.items));
        assert.equal(body.profile, undefined);
    });

    test('PUT mantém compatibilidade com chamadores antigos', async () => {
        const res: any = await PUT(req(`https://x/api/admin/clients?detail=${ID}`));
        const body = await res.json();
        assert.equal(res.status, 200);
        assert.equal(body.profile.id, ID);
    });

    test('detail inválido não vira listagem silenciosa', async () => {
        const res: any = await GET(req('https://x/api/admin/clients?detail=abc'));
        assert.equal(res.status, 400);
    });
});

describe('o drawer não entrega ao render um corpo sem profile', () => {
    const src = readFileSync('app/restricted-area-admin/clients/AdminClientsTab.tsx', 'utf8');

    test('valida o contrato antes de setData', () => {
        assert.ok(
            /!json\.profile/.test(src),
            'sem validação, qualquer resposta 200 em formato diferente derruba a página'
        );
        assert.ok(
            /Array\.isArray\(json\.purchases\)/.test(src),
            'as listas precisam ser normalizadas antes do render'
        );
    });

    test('mostra o erro na ficha em vez de tela em branco', () => {
        assert.ok(/role="alert"/.test(src), 'erro da ficha precisa ser anunciado');
        assert.ok(/setErro/.test(src), 'não há estado de erro na ficha');
    });
});
