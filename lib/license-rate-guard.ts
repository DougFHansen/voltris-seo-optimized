/**
 * Rate limit das rotas de licença (missão §9).
 *
 * Por que um guard próprio: o checkRateLimit de lib/telemetry-security.ts é
 * genérico de telemetria (100 eventos/min no tier FREE) — folgado demais para
 * endpoints que aceitam chaves de licença, onde 100/min por IP permite força
 * bruta de catálogo. Aqui cada rota tem o orçamento do seu próprio uso legítimo.
 *
 * Formato do bucket: janela fixa de 60 s, contagem em memória do processo.
 *
 * LIMITAÇÃO HONESTA (documentada de propósito): em serverless cada instância
 * conta sozinha, então o teto real é ~N_instâncias × limite. Isto barulha força
 * bruta óbvio e bugs de loop do app; para garantia distribuída o próximo passo
 * é mover a contagem para um backend compartilhado (Redis/UPS) ou um RPC no
 * Supabase com tabela de janelas — a assinatura desta função já devolve
 * `remaining`/`retryAfterSec`, que é tudo que a camada de transporte precisa.
 *
 * Nada aqui registra a chave inteira: o identificador usa apenas os últimos 8
 * caracteres, e o IP é o primeiro do x-forwarded-for.
 */

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export type LicenseGuardScope =
    /** ativação por chave — uso humano: 1 tentativa ocasional */
    | 'activate'
    /** revalidação periódica do app (timer de 2 min por dispositivo) */
    | 'validate'
    /** desvincular dispositivo */
    | 'deactivate'
    /** sincronização de estado */
    | 'sync'
    /** leitura de dados da licença */
    | 'info'
    /** painel (lista as licenças da sessão) */
    | 'me';

interface Budget {
    /** eventos permitidos por janela para (escopo + identidade) */
    perIdentity: number;
    /** eventos permitidos por janela para o IP (teto global por origem) */
    perIp: number;
}

const BUDGETS: Record<LicenseGuardScope, Budget> = {
    activate: { perIdentity: 8, perIp: 30 },
    validate: { perIdentity: 40, perIp: 150 },
    deactivate: { perIdentity: 10, perIp: 40 },
    sync: { perIdentity: 30, perIp: 120 },
    info: { perIdentity: 40, perIp: 150 },
    me: { perIdentity: 60, perIp: 200 },
};

const WINDOW_MS = 60_000;
const MAX_KEYS = 20_000;

interface Bucket {
    count: number;
    resetAt: number;
}

const store = new Map<string, Bucket>();

function take(key: string, limit: number, now: number): { count: number; resetAt: number; allowed: boolean } {
    let entry = store.get(key);
    if (!entry || now >= entry.resetAt) {
        entry = { count: 0, resetAt: now + WINDOW_MS };
        store.set(key, entry);
        pruneIfNeeded(now);
    }
    const allowed = entry.count < limit;
    if (allowed) entry.count += 1;
    return { count: entry.count, resetAt: entry.resetAt, allowed };
}

/** Evita crescimento sem teto em processos longos (dev/`next start`). */
function pruneIfNeeded(now: number) {
    if (store.size <= MAX_KEYS) return;
    for (const [k, v] of store) {
        if (v.resetAt <= now) store.delete(k);
    }
}

export function clientIp(req: NextRequest): string {
    return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
        || req.headers.get('x-real-ip')
        || 'local';
}

/**
 * Identidade estável e não sensível: últimos 8 chars da chave/instalação.
 * (Os 8 finais não permitem reconstruir a chave, mas separam os clientes.)
 */
export function guardIdentity(...candidates: (string | null | undefined)[]): string {
    for (const c of candidates) {
        const v = (c ?? '').trim();
        if (v.length >= 4) return v.slice(-8);
    }
    return 'anon';
}

export interface GuardResult {
    allowed: boolean;
    scope: LicenseGuardScope;
    /** usado apenas em log/diagnóstico; não contém segredo. */
    key: string;
    remaining: number;
    retryAfterSec: number;
}

export function licenseRateGuard(
    scope: LicenseGuardScope,
    req: NextRequest,
    identity?: string | null
): GuardResult {
    const now = Date.now();
    const ip = clientIp(req);
    const budget = BUDGETS[scope];

    const idRes = take(`lic:${scope}:id:${identity || 'anon'}`, budget.perIdentity, now);
    const ipRes = take(`lic:${scope}:ip:${ip}`, budget.perIp, now);

    const allowed = idRes.allowed && ipRes.allowed;
    const retryAt = Math.max(idRes.resetAt, ipRes.resetAt);

    return {
        allowed,
        scope,
        key: `${scope}/${identity || 'anon'}/*ip*/`,
        remaining: Math.max(0, Math.min(budget.perIdentity - idRes.count, budget.perIp - ipRes.count)),
        retryAfterSec: Math.max(1, Math.ceil((retryAt - now) / 1000)),
    };
}

/**
 * Resposta 429 padronizada (Retry-After real, sem expor o orçamento interno).
 * `errorWithCorrelation` não é usado aqui para evitar import circular e para
 * garantir que o header Retry-After chegue ao app desktop.
 */
export function rateLimitedResponse(guard: GuardResult, correlationId: string): NextResponse {
    return NextResponse.json(
        {
            error: 'Muitas requisições para esta operação. Tente novamente em instantes.',
            code: 'RATE_LIMITED',
            correlation_id: correlationId,
        },
        {
            status: 429,
            headers: {
                'x-correlation-id': correlationId,
                'retry-after': String(guard.retryAfterSec),
                'x-ratelimit-remaining': String(Math.max(0, guard.remaining)),
            },
        }
    );
}
