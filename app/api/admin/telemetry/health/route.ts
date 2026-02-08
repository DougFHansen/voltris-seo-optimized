/**
 * GET /api/admin/telemetry/health
 * Fetch telemetry health metrics
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const supabase = await createClient();

        const { data: metrics, error } = await supabase
            .from('telemetry_health_metrics')
            .select('*')
            .order('metric_timestamp', { ascending: false })
            .limit(10);

        if (error) throw error;

        return NextResponse.json({
            success: true,
            metrics,
        });
    } catch (error: any) {
        console.error('[Admin] Health metrics error:', error);
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
