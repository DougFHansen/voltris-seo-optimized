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

        // 2. Fetch Last Event for each Active Session
        // Note: Doing this properly via SQL join would be better, but Supabase JS doesn't support lateral joins easily.
        // For < 100 active sessions, a second query is fine.
        let sessionsWithActivity = activeSessions || [];

        if (activeSessions && activeSessions.length > 0) {
            const sessionIds = activeSessions.map(s => s.id);

            // Fetch the very last event for these sessions
            // We can't easily "group by session and take 1" in one simple query without RPC
            // So we'll fetch recent events and filter in memory (acceptable for dashboard scale)
            const { data: recentEvents } = await supabase
                .from('telemetry_events')
                .select('session_id, event_type, feature_name, action_name, created_at, metadata')
                .in('session_id', sessionIds)
                .order('created_at', { ascending: false })
                .limit(activeSessions.length * 8); // Heuristic limit

            // Map latest event to session
            sessionsWithActivity = activeSessions.map(session => {
                const latestEvent = recentEvents?.find(e => e.session_id === session.id);
                // Search specifically for System Health to get the latest score even if not the absolute latest event
                const healthEvent = recentEvents?.find(e => e.session_id === session.id && e.event_type === 'SYSTEM_HEALTH');

                return {
                    ...session,
                    last_activity: latestEvent ? {
                        type: latestEvent.event_type,
                        name: `${latestEvent.feature_name || ''} - ${latestEvent.action_name || ''}`,
                        time: latestEvent.created_at,
                        metadata: latestEvent.metadata
                    } : null,
                    health_score: healthEvent?.metadata?.health_score || null
                };
            });
        }

        // 3. Stats Calculation (existing code)
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
            sessions: sessionsWithActivity,
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
