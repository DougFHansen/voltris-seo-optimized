/**
 * GET /api/admin/deploys
 * Fetch all deploys for admin dashboard
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
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
