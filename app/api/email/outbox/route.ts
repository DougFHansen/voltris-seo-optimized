import { NextRequest } from 'next/server';
import { processOutbox, getOutboxStats, MAX_ATTEMPTS } from '@/lib/email-outbox';
import { getResendConfigStatus } from '@/lib/resend-client';
import {
    startOperation,
    getOrCreateCorrelationId,
    logSuccess,
    logWarn,
    logError,
    jsonWithCorrelation,
    errorWithCorrelation,
} from '@/lib/voltris-log';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/email/outbox — WORKER DA FILA DE E-MAIL (missão §11).
 *
 * Esta rota é o que garante a entrega quando o webhook não conseguiu enviar
 * na hora (Resend fora, timeout, cold start). Ela existe porque em serverless
 * não há processo longo: o "agendamento" é a própria coluna `available_at` no
 * Postgres, e alguém precisa passar de tempos em tempos para consumir a fila.
 *
 * DOIS MODOS, ambos legítimos:
 *
 *  1. CRON DA VERCEL (recomendado). Sem autenticação por token de usuário —
 *     opção DENTRO do próprio código, que é o que a Vercel oferece. Sem
 *     proteção contra chamadas externas, a rota é inofensiva: ela apenas lê e
 *     envia itens que JÁ estão na fila (nenhum usuário consegue injetar
 *     destinatário), e o rate limit limita o abuso.
 *
 *  2. CHAMADA MANUAL AUTORIZADA, com `x-cron-secret` igual a
 *     `EMAIL_CRON_SECRET`. Útil para depurar e para environments sem cron.
 *
 * O que a rota NÃO faz: aceitar destinatário, template ou conteúdo pela
 * rede. Isso é o que mantém uma chamada externa de incapable de virar um
 * mecanismo de spam.
 */

/**
 * Segredo da chamada de cron.
 *
 * `CRON_SECRET` é o NOME QUE A VERCEL USA: ao declarar um cron em
 * `vercel.json`, a Vercel injeta `Authorization: Bearer <CRON_SECRET>` usando
 * esta variável do projeto. `EMAIL_CRON_SECRET` continua aceito como alias
 * para quem já tinha configurado, mas o nome canônico é `CRON_SECRET` — é o
 * que a plataforma lê e envia.
 */
const CRON_SECRET = process.env.CRON_SECRET?.trim() || process.env.EMAIL_CRON_SECRET?.trim();

/** Corpo opcional: teto de linhas nesta passagem. */
function readLimit(req: NextRequest): number {
    const raw = req.nextUrl.searchParams.get('limit');
    const n = Number(raw);
    if (!Number.isFinite(n) || n <= 0) return 10;
    // Teto duro: uma função serverless não deve passar horas na fila.
    return Math.min(Math.floor(n), 50);
}

/**
 * Libera a chamada de cron da Vercel.
 *
 * Mecanismo CORRETO, conforme a documentação da Vercel: ao declarar um cron
 * em `vercel.json`, a Vercel injeta `Authorization: Bearer <CRON_SECRET>`,
 * usando a variável de ambiente `CRON_SECRET` do projeto. É esse header que
 * distingue a invocação legítima de uma chamada qualquer da internet.
 *
 * A primeira versão deste arquivo confiava em `process.env.VERCEL_CRON` e num
 * header `x-vercel-cron`. Nenhum dos dois existe: o primeiro nunca é definido
 * pela Vercel e o segundo não é enviado. Na prática a rota ficava fechada
 * para o cron E para o operador — o worker só rodava por `drainQueue` dentro
 * do webhook. Lido `CRON_SECRET`, a comparação é a única fonte de verdade.
 *
 * O header `x-cron-secret` continua aceito para uso manual do operador.
 */
function cronAllowed(req: NextRequest): boolean {
    const secret = CRON_SECRET || process.env.CRON_SECRET?.trim();

    if (secret) {
        const bearer = req.headers.get('authorization');
        if (bearer === `Bearer ${secret}`) return true;
        if (req.headers.get('x-cron-secret') === secret) return true;
    }

    // Sem CRON_SECRET configurado, a rota permanece fechada. Aceitar chamadas
    // sem autenticação transformaria o worker em um endpoint público que envia
    // e-mail — exatamente o que a rota precisa não ser.
    return false;
}

export async function POST(req: NextRequest) {
    const correlationId = getOrCreateCorrelationId(req);
    const ctx = startOperation('EMAIL_WORKER', correlationId);

    if (!cronAllowed(req)) {
        return errorWithCorrelation(
            ctx, 401, 'UNAUTHORIZED',
            'Configure o cron da Vercel ou envie o header x-cron-secret.'
        );
    }

    try {
        const config = getResendConfigStatus();
        if (!config.configured) {
            // Não adianta consumir a fila com a configuração quebrada: cada
            // linha bateria em 'failed' por erro de configuração e gastaria
            // tentativas. A fila fica intacta para quando o problema for
            // corrigido.
            logError(ctx, 'configuracao da Resend invalida — fila nao consumida', {
                problems: config.problems,
            });
            return errorWithCorrelation(
                ctx, 503, 'RESEND_NOT_CONFIGURED',
                'Configuração de e-mail ausente ou inválida.',
                { details: { problems: config.problems } }
            );
        }

        const limit = readLimit(req);
        const result = await processOutbox(limit);

        logSuccess(ctx, 'fila processada', { ...(result as unknown as Record<string, unknown>), limit });

        return jsonWithCorrelation(ctx, {
            ok: true,
            ...result,
            maxAttempts: MAX_ATTEMPTS,
            stats: await getOutboxStats(),
        });
    } catch (error: any) {
        logError(ctx, 'worker falhou', { error: String(error?.message ?? error).slice(0, 200) });
        return errorWithCorrelation(ctx, 500, 'WORKER_FAILED', 'Falha ao processar a fila de e-mail.');
    }
}

/**
 * GET /api/email/outbox — diagnóstico da fila.
 *
 * Sem `x-cron-secret` exige um ADMIN autenticado; com o segredo, a rota de
 * cron pode checar saúde sem sessão.
 */
export async function GET(req: NextRequest) {
    const correlationId = getOrCreateCorrelationId(req);
    const ctx = startOperation('EMAIL_WORKER', correlationId);

    const segredoInformado =
        req.headers.get('x-cron-secret') === CRON_SECRET ||
        req.headers.get('authorization') === `Bearer ${CRON_SECRET}`;
    if (!segredoInformado) {
        const { requireAdmin } = await import('@/utils/supabase/requireAdmin');
        const { error } = await requireAdmin();
        if (error) return error;
    }

    try {
        const stats = await getOutboxStats();

        if (stats.backlogWarning) {
            logWarn(ctx, 'fila de e-mail com atraso', {
                oldest_pending_minutes: stats.oldestPendingMinutes,
                pending: stats.pending,
            });
        }

        return jsonWithCorrelation(ctx, {
            stats,
            maxAttempts: MAX_ATTEMPTS,
            config: getResendConfigStatus(),
        });
    } catch (error: any) {
        logError(ctx, 'diagnostico da fila falhou', { error: String(error?.message ?? error).slice(0, 200) });
        return errorWithCorrelation(ctx, 500, 'OUTBOX_STATS_FAILED', 'Falha ao consultar a fila.');
    }
}