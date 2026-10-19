/**
 * AUTORIZAÇÃO E AUDITORIA DO PAINEL ADMINISTRATIVO (PARTE 11 do Corrigir.txt).
 *
 * "Não basta esconder os botões administrativos do público" — a verificação é
 * SEMPRE no servidor, e este módulo é o único lugar onde ela acontece.
 *
 * -------------------------------------------------------------------------
 * POR QUE EXISTE E NÃO BASTAVA O `requireAdmin`
 * -------------------------------------------------------------------------
 * `utils/supabase/requireAdmin.ts` responde a uma pergunta binária: é admin?
 * A Parte 11 pede quatro perfis com poderes diferentes. Sem separação, um
 * administrador de suporte que só deveria consultar clients teria o mesmo
 * poder de quem executa reembolso — e o único jeito de limitar seria esconder
 * botão, que é exatamente o que a parte proíbe.
 *
 * -------------------------------------------------------------------------
 * COMPATIBILIDADE — POR QUE UM ADMIN EXISTENTE NÃO PERDE ACESSO
 * -------------------------------------------------------------------------
 * `profiles` já tem `is_admin` e `role`. Nos dados de produção, os admins
 * atuais têm `is_admin = true` e `role` NULL. Se eu exigisse um papel
 * preenchido, TODO o painel quebraria no primeiro deploy.
 *
 * Regra adotada: `is_admin = true` SEM papel explícito = `superadmin`. O
 * sistema continua funcionando hoje e os papéis finos passam a valer à
 * medida que forem atribuídos. Nenhum admin existente perde acesso.
 *
 * -------------------------------------------------------------------------
 * POR QUE `is_admin` NÃO VEM DO FRONTEND
 * -------------------------------------------------------------------------
 * A coluna é lida com `service_role` direto do banco e comparada com a
 * sessão do servidor. Não existe caminho em que dado editável no navegador
 * altere o próprio papel — o frontend nunca decide, ele só desenha.
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';
import type { SupabaseClient } from '@supabase/supabase-js';

// ===========================================================================
// PAPÉIS
// ===========================================================================

export type AdminRole = 'superadmin' | 'financeiro' | 'suporte' | 'leitura';

/**
 * O que cada papel pode fazer.
 *
 * A separação segue o princípio do menor privilégio e a distinção que a
 * operação real exige:
 *
 *  - `leitura`   vê tudo, não muda nada. Serve para auditoria e contabilidade.
 *  - `suporte`   atende cliente: consulta, reemite licença, desvincula
 *                dispositivo. NÃO mexe em dinheiro.
 *  - `financeiro` cobra, estorna, concilia. NÃO revoga licença.
 *  - `superadmin` faz tudo, incluindo editar estes próprio papéis.
 *
 * Repare que "emitir reembolso" e "revogar licença" estão em papeles
 * diferentes de propósito: são ações que mexem no direito do cliente e
 * precisam de responsabilidades separadas.
 */
export const ADMIN_CAPABILITIES = {
    'clients.read':      ['superadmin', 'financeiro', 'suporte', 'leitura'],
    'licenses.read':     ['superadmin', 'financeiro', 'suporte', 'leitura'],
    'licenses.write':    ['superadmin', 'suporte'],
    'payments.read':     ['superadmin', 'financeiro', 'suporte', 'leitura'],
    'payments.write':    ['superadmin', 'financeiro'],
    'subscriptions.read':['superadmin', 'financeiro', 'suporte', 'leitura'],
    'subscriptions.write':['superadmin', 'financeiro'],
    'devices.read':      ['superadmin', 'financeiro', 'suporte', 'leitura'],
    'devices.write':     ['superadmin', 'suporte'],
    'invoices.read':     ['superadmin', 'financeiro', 'suporte', 'leitura'],
    'invoices.resend':   ['superadmin', 'financeiro', 'suporte'],
    'emails.read':       ['superadmin', 'financeiro', 'suporte', 'leitura'],
    'emails.resend':     ['superadmin', 'suporte'],
    'refunds.write':     ['superadmin', 'financeiro'],
    'reconcile.apply':   ['superadmin', 'financeiro'],
    'roles.write':       ['superadmin'],
    'overview.read':     ['superadmin', 'financeiro', 'suporte', 'leitura'],
} as const satisfies Record<string, readonly AdminRole[]>;

export type AdminCapability = keyof typeof ADMIN_CAPABILITIES;

export interface AdminActor {
    userId: string;
    email: string | null;
    role: AdminRole;
    /** Perfil legado (sem `role` preenchido) — tratado como superadmin. */
    legacyAdmin: boolean;
}

// ===========================================================================
// GUARDA
// ===========================================================================

export type GuardResult =
    | { actor: AdminActor; response: null }
    | { actor: null; response: NextResponse };

function deny(status: number, code: string, message: string): GuardResult {
    return {
        actor: null,
        response: NextResponse.json({ error: message, code }, { status }),
    };
}

/**
 * Resolve o papel de um usuário a partir do banco.
 *
 * Lê `profiles` com service_role: o papel é decisão de servidor, nunca um
 * dado que o navegador possa influenciar. `is_blocked` e `is_deleted` negam
 * acesso mesmo para admin — uma conta desativada que ainda tem `is_admin`
 * não pode operar.
 */
export async function resolveAdminActor(userId: string): Promise<AdminActor | null> {
    const admin = createAdminClient();

    const { data: profile } = await admin
        .from('profiles')
        .select('email, is_admin, role, is_blocked, is_deleted')
        .eq('id', userId)
        .maybeSingle();

    if (!profile) return null;
    if (profile.is_blocked === true || profile.is_deleted === true) return null;
    if (profile.is_admin !== true) return null;

    const raw = (profile.role ?? '').toString().trim().toLowerCase();
    const known = (['superadmin', 'financeiro', 'suporte', 'leitura'] as const)
        .includes(raw as AdminRole);

    return {
        userId,
        email: profile.email ?? null,
        // Admin legado sem papel = superadmin. Ver a nota de compatibilidade.
        role: known ? (raw as AdminRole) : 'superadmin',
        legacyAdmin: !known,
    };
}

export function can(actor: AdminActor, capability: AdminCapability): boolean {
    return (ADMIN_CAPABILITIES[capability] as readonly AdminRole[]).includes(actor.role);
}

/**
 * Guarda de rota: autentica, resolve o papel e exige a capacidade pedida.
 *
 * A ORDEM das checagens é deliberada — autenticação, depois bloqueio, depois
 * papel. Um usuário não logado recebe 401 mesmo tendo papel; um admin
 * bloqueado recebe 403. Confundir os dois códigos faz o painel mostrar
 * "faça login" para quem está logado e foi bloqueado.
 */
export async function requireCapability(capability: AdminCapability): Promise<GuardResult> {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) return deny(401, 'UNAUTHENTICATED', 'Faça login novamente.');

    const actor = await resolveAdminActor(user.id);
    if (!actor) {
        return deny(403, 'FORBIDDEN', 'Seu perfil não tem acesso ao painel administrativo.');
    }

    if (!can(actor, capability)) {
        return deny(
            403,
            'INSUFFICIENT_ROLE',
            `Seu perfil (${actor.role}) não pode executar esta ação.`
        );
    }

    return { actor, response: null };
}

/** Atalho booleano, para quem só quer um if. */
export async function hasCapability(capability: AdminCapability): Promise<boolean> {
    const { actor, response } = await requireCapability(capability);
    return response === null && actor !== null;
}

// ===========================================================================
// AUDITORIA
// ===========================================================================

export interface AuditInput {
    /** O que foi mexido: `licenses`, `payments`, ... */
    resource: string;
    /** Identificador do recurso afetado. */
    resourceId: string | null;
    /** Ação: `LICENSE_SUSPENDED`, `REFUND_EXECUTED`, ... */
    action: string;
    /** Estado anterior — serializado. */
    before?: unknown;
    /** Estado posterior — serializado. */
    after?: unknown;
    /** Motivo informado pelo administrador. Obrigatório nas ações destrutivas. */
    reason?: string | null;
    /** Resultado: `OK`, `DENIED`, `FAILED`. */
    outcome: 'OK' | 'DENIED' | 'FAILED';
    /** Correlaciona a ação com o log da aplicação. */
    correlationId?: string | null;
}

/**
 * Remove segredos antes de gravar.
 *
 * `audit_logs.metadata` é consultado por gente e pode ser lido em relatório.
 * Um campo `token` ou `password` que escapa para lá vira vazamento com prazo
 * longo, porque auditoria se guarda para sempre.
 */
const REDACT_KEYS = /^(password|senha|token|access_token|refresh_token|api[_-]?key|secret|authorization|otp|code)$/i;

export function scrubForAudit(value: unknown, depth = 0): unknown {
    if (depth > 6) return '[profundo]';
    if (Array.isArray(value)) return value.slice(0, 50).map((v) => scrubForAudit(v, depth + 1));
    if (value && typeof value === 'object') {
        const out: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
            out[k] = REDACT_KEYS.test(k) ? '[REDACTED]' : scrubForAudit(v, depth + 1);
        }
        return out;
    }
    return value;
}

/**
 * Grava a trilha de auditoria.
 *
 * NUNCA lança. Uma falha de auditoria não pode derrubar a ação que já foi
 * concluída no provedor — mas o erro precisa aparecer no log da aplicação,
 * senão a lacuna passa silenciosa.
 */
export async function auditAction(
    actor: AdminActor | null,
    input: AuditInput,
    supabase?: SupabaseClient
): Promise<void> {
    const db = supabase ?? createAdminClient();
    try {
        await db.from('audit_logs').insert({
            event_type: `ADMIN_${input.action}`,
            metadata: scrubForAudit({
                admin_id: actor?.userId ?? null,
                admin_email: actor?.email ?? null,
                admin_role: actor?.role ?? null,
                resource: input.resource,
                resource_id: input.resourceId,
                reason: input.reason ?? null,
                outcome: input.outcome,
                before: input.before ?? null,
                after: input.after ?? null,
                correlation_id: input.correlationId ?? null,
                at: new Date().toISOString(),
            }),
            created_at: new Date().toISOString(),
        });
    } catch (err: any) {
        console.error('[ADMIN AUDIT] falha ao gravar trilha:', String(err?.message ?? err).slice(0, 200));
    }
}

// ===========================================================================
// RATE LIMITING
// ===========================================================================

/**
 * Rate limit em memória por processo, para operações sensíveis.
 *
 * LIMITES CONHECIDOS E DECLARADOS: em serverless a memória morre a cada cold
 * start, então isto é um amortecedor contra erro de duplo clique e laço
 * acidental — NÃO é proteção contra abuso distribuído. Quem precisa disso de
 * verdade (reembolso) valida o estado na Stripe antes de agir, e é essa
 * validação que impede o efeito financeiro. Deixar isso explícito evita a
 * falsa sensação de que o limite protege.
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
    const now = Date.now();
    const b = buckets.get(key);

    if (!b || b.resetAt <= now) {
        buckets.set(key, { count: 1, resetAt: now + windowMs });
        return true;
    }
    if (b.count >= limit) return false;
    b.count += 1;

    // Limpa entradas vencidas para o mapa não crescer sem fim.
    if (buckets.size > 5000) {
        for (const [k, v] of buckets) if (v.resetAt <= now) buckets.delete(k);
    }
    return true;
}
