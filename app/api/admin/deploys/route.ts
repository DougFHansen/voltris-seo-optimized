/**
 * GET /api/admin/deploys
 * Fetch all deploys for admin dashboard
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { requireCapability } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    // Gate pelo helper único, no servidor. A checagem inline de
    // `profiles.is_admin` que existia aqui duplicava a regra de autorização
    // em uma segunda implementação — e era a única rota do painel que não
    // respeitava `is_blocked`/`is_deleted`, ou seja, um admin desativado
    // continuava vendo o registro de deploys.
    const guard = await requireCapability('roles.write');
    if (guard.response) return guard.response;

    try {
        const supabase = await createClient();

        const { data: deploys, error } = await supabase
            .from('deploy_registry')
            .select('*')
            .order('deployed_at', { ascending: false })
            .limit(50);

        if (error) throw error;

        return NextResponse.json({
            success: true,
            deploys,
        });
    } catch (error: any) {
        console.error('[Admin] Deploys fetch error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'FETCH_FAILED',
                message: error.message,
            },
            { status: 500 }
        );
    }
}
