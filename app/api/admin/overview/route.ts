import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireCapability, auditAction } from '@/lib/admin-auth';
import { createAdminClient } from '@/utils/supabase/admin';
import {
    computeOverview,
    computeMrr,
    resolvePeriod,
    type PeriodPreset,
} from '@/lib/admin-queries';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/overview — INDICADORES GLOBAIS (PARTE 2).
 *
 * Todos os números vêm de contagem no banco. Nenhum é estimado, arredondado
 * para "parecer bonito" ou preenchido com valor de exemplo: quando o dado não
 * pode ser calculado com honestidade, ele vem `null` e a lista `unavailable`
 * diz o motivo. A missão é explícita: "criar gráficos e relatórios somente
 * quando houver dados reais".
 *
 * A distinção entre receita RECEBIDA e prevista é respeitada: a receita bruta
 * conta apenas pagamentos CONFIRMADOS no período. Um `pending` não entra.
 */

const Query = z.object({
    period: z.enum(['today', '7d', '30d', 'month', 'prev_month', 'year', 'custom'])
        .optional().default('30d'),
    from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

export async function GET(req: NextRequest) {
    // Autorização no SERVIDOR. Esconder o botão não protege nada.
    const { actor, response } = await requireCapability('overview.read');
    if (response) return response;

    const parsed = Query.safeParse(Object.fromEntries(req.nextUrl.searchParams));
    if (!parsed.success) {
        return NextResponse.json(
            { error: 'Período inválido.', code: 'INVALID_QUERY' },
            { status: 400 }
        );
    }

    const range = resolvePeriod(
        parsed.data.period as PeriodPreset,
        { from: parsed.data.from ?? null, to: parsed.data.to ?? null }
    );

    const db = createAdminClient();

    try {
        const [metrics, mrr] = await Promise.all([
            computeOverview(db, range),
            computeMrr(db),
        ]);

        // Uma tabela que falta (email_outbox antes da migration) NÃO pode
        // derrubar o painel. Os campos vêm 0 e `unavailable` explica.
        await auditAction(actor, {
            resource: 'overview',
            resourceId: null,
            action: 'OVERVIEW_VIEWED',
            outcome: 'OK',
            after: { period: parsed.data.period, unavailable: metrics.unavailable },
        });

        return NextResponse.json({
            range,
            period: parsed.data.period,
            metrics,
            mrr,
            generatedAt: new Date().toISOString(),
        });
    } catch (err: any) {
        await auditAction(actor, {
            resource: 'overview',
            resourceId: null,
            action: 'OVERVIEW_VIEWED',
            outcome: 'FAILED',
            reason: String(err?.message ?? err).slice(0, 200),
        });
        return NextResponse.json(
            { error: 'Falha ao calcular os indicadores.', code: 'OVERVIEW_FAILED' },
            { status: 500 }
        );
    }
}
