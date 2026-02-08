import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Admin API to fetch global realtime stats
// Protected by Admin Middleware (assumed existing)
export async function GET(req: NextRequest) {
    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // 1. Get Active Sessions (Online Now) with detailed info
        const { data: activeSessions, error } = await supabase
            .from('sessions')
            .select(`
                id, device_id, status, started_at, last_heartbeat_at, app_version,
                device:devices (
                    machine_id, 
                    hostname, 
                    os_version,
                    company:companies (name, plan_type),
                    profile:device_profiles (*)
                )
            `)
            .in('status', ['active', 'idle'])
            .order('last_heartbeat_at', { ascending: false });

        if (error) throw error;

        // 2. Calculate Stats
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

        // Count total sessions starting today
        const { count: todayCount } = await supabase
            .from('sessions')
            .select('id', { count: 'exact', head: true })
            .gte('started_at', startOfDay);

        // Unique active companies
        const activeCompanyIds = new Set(
            activeSessions
                ?.map(s => (s.device as any)?.company?.name)
                .filter(Boolean)
        );

        // Mock peak (real implementation would query metrics table)
        const peakConcurrent = Math.max(activeSessions?.length || 0, 0);

        return NextResponse.json({
            sessions: activeSessions || [],
            stats: {
                active_now: activeSessions?.length || 0,
                idle_now: activeSessions?.filter(s => s.status === 'idle').length || 0,
                total_sessions_today: todayCount || 0,
                active_companies: activeCompanyIds.size,
                peak_concurrent_24h: peakConcurrent
            }
        });

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
