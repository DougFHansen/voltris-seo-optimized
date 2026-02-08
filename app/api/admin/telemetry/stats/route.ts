import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const supabase = await createClient();

        // 1. Fetch Health Stats
        const { data: healthEvents } = await supabase
            .from('telemetry_events')
            .select('metadata')
            .eq('event_type', 'SYSTEM_HEALTH')
            .order('timestamp', { ascending: false })
            .limit(100);

        const scores = healthEvents?.map((e: any) => e.metadata?.health_score || 0) || [];
        const avgHealth = scores.length > 0 ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length) : 0;

        // 2. Fetch Exception Stats
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        const { count: exceptionsCount } = await supabase
            .from('telemetry_events')
            .select('*', { count: 'exact', head: true })
            .eq('event_type', 'EXCEPTION')
            .gte('timestamp', yesterday);

        // 3. Popular Features
        const { data: featureEvents } = await supabase
            .from('telemetry_events')
            .select('feature_name')
            .not('event_type', 'eq', 'SYSTEM_HEALTH')
            .not('event_type', 'eq', 'PAGE_VIEW')
            .limit(1000);

        const featureCounts = featureEvents?.reduce((acc: any, curr) => {
            acc[curr.feature_name] = (acc[curr.feature_name] || 0) + 1;
            return acc;
        }, {});

        const popularFeatures = Object.entries(featureCounts || {})
            .map(([name, count]: [string, any]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        // 4. Health Distribution
        const distribution = [
            { label: 'Excelente (90-100)', count: scores.filter((s: number) => s >= 90).length, color: 'bg-emerald-500' },
            { label: 'Bom (70-89)', count: scores.filter((s: number) => s >= 70 && s < 90).length, color: 'bg-blue-500' },
            { label: 'Atenção (50-69)', count: scores.filter((s: number) => s >= 50 && s < 70).length, color: 'bg-yellow-500' },
            { label: 'Crítico (< 50)', count: scores.filter((s: number) => s < 50).length, color: 'bg-red-500' },
        ];

        return NextResponse.json({
            health_average: avgHealth,
            total_exceptions_24h: exceptionsCount || 0,
            optimizations_completed: featureEvents?.length || 0, // Simplified metric
            avg_ram_freed_mb: 256, // Placeholder or calculate from metadata if available
            popular_features: popularFeatures,
            health_distribution: distribution
        });
    } catch (error) {
        console.error('Stats API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
