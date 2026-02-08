/**
 * VOLTRIS ENTERPRISE TELEMETRY PLATFORM
 * Cost Intelligence Service API
 * 
 * Tracks costs per feature, per client, and calculates ROI
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Cost constants (customize based on actual infrastructure costs)
const COSTS = {
    // Per event processing cost (USD)
    EVENT_PROCESSING: 0.000001,

    // Storage cost per GB per month (USD)
    STORAGE_PER_GB: 0.02,

    // Bandwidth cost per GB (USD)
    BANDWIDTH_PER_GB: 0.09,

    // AI API costs (USD)
    AI_COST_PER_REQUEST: 0.002,
    AI_COST_PER_1K_TOKENS: 0.0015,
};

// Revenue constants (based on plans)
const REVENUE = {
    free: 0,
    trial: 0,
    standard: 9.99,
    pro: 29.99,
    enterprise: 99.99,
};

/**
 * POST /api/intelligence/cost-analysis
 * Analyze costs and calculate ROI
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { period_start, period_end, analysis_type } = body;

        const supabase = createClient();

        const period = {
            start: period_start || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            end: period_end || new Date().toISOString(),
        };

        let results: any = {
            analysis_period: period,
            timestamp: new Date().toISOString(),
        };

        switch (analysis_type) {
            case 'feature':
                results.feature_costs = await analyzeFeatureCosts(supabase, period);
                break;
            case 'client':
                results.client_costs = await analyzeClientCosts(supabase, period);
                break;
            case 'all':
            default:
                results.feature_costs = await analyzeFeatureCosts(supabase, period);
                results.client_costs = await analyzeClientCosts(supabase, period);
                results.summary = await generateCostSummary(supabase, period);
                break;
        }

        return NextResponse.json({
            success: true,
            results,
        });
    } catch (error: any) {
        console.error('[Cost Intelligence] Error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'COST_ANALYSIS_FAILED',
                message: error.message,
            },
            { status: 500 }
        );
    }
}

/**
 * Analyze costs per feature
 */
async function analyzeFeatureCosts(supabase: any, period: any) {
    try {
        // Get all events grouped by feature
        const { data: events, error } = await supabase
            .from('telemetry_events')
            .select('feature_name, duration_ms, metadata, device_id')
            .gte('timestamp', period.start)
            .lte('timestamp', period.end);

        if (error) throw error;

        const featureMap = new Map<string, any>();

        // Group by feature
        events.forEach((event: any) => {
            if (!featureMap.has(event.feature_name)) {
                featureMap.set(event.feature_name, {
                    feature_name: event.feature_name,
                    total_events: 0,
                    unique_users: new Set(),
                    total_duration_ms: 0,
                    ai_requests: 0,
                });
            }

            const feature = featureMap.get(event.feature_name);
            feature.total_events++;
            feature.unique_users.add(event.device_id);
            feature.total_duration_ms += event.duration_ms || 0;

            // Check if this event used AI (from metadata)
            if (event.metadata && event.metadata.used_ai) {
                feature.ai_requests++;
            }
        });

        // Calculate costs for each feature
        const featureCosts = [];
        for (const [featureName, feature] of featureMap) {
            // Compute cost
            const compute_cost = feature.total_events * COSTS.EVENT_PROCESSING;

            // Storage cost (estimate based on events)
            const storage_gb = (feature.total_events * 0.001) / 1024; // ~1KB per event
            const storage_cost = storage_gb * COSTS.STORAGE_PER_GB;

            // Bandwidth cost (estimate)
            const bandwidth_gb = (feature.total_events * 0.002) / 1024; // ~2KB per event
            const bandwidth_cost = bandwidth_gb * COSTS.BANDWIDTH_PER_GB;

            // AI cost
            const ai_cost = feature.ai_requests * COSTS.AI_COST_PER_REQUEST;

            const total_cost = compute_cost + storage_cost + bandwidth_cost + ai_cost;

            // Calculate revenue (estimate based on users and their plans)
            const revenue = await estimateFeatureRevenue(
                supabase,
                featureName,
                feature.unique_users.size,
                period
            );

            const margin = revenue - total_cost;
            const roi = total_cost > 0 ? ((revenue - total_cost) / total_cost) * 100 : 0;

            const costData = {
                feature_name: featureName,
                period_start: period.start,
                period_end: period.end,
                compute_cost_usd: parseFloat(compute_cost.toFixed(4)),
                storage_cost_usd: parseFloat(storage_cost.toFixed(4)),
                bandwidth_cost_usd: parseFloat(bandwidth_cost.toFixed(4)),
                ai_api_cost_usd: parseFloat(ai_cost.toFixed(4)),
                total_cost_usd: parseFloat(total_cost.toFixed(4)),
                total_users: feature.unique_users.size,
                total_events: feature.total_events,
                ai_requests_count: feature.ai_requests,
                revenue_generated_usd: parseFloat(revenue.toFixed(2)),
                margin_usd: parseFloat(margin.toFixed(2)),
                roi_percentage: parseFloat(roi.toFixed(2)),
                cost_per_user: feature.unique_users.size > 0
                    ? parseFloat((total_cost / feature.unique_users.size).toFixed(6))
                    : 0,
                cost_per_event: feature.total_events > 0
                    ? parseFloat((total_cost / feature.total_events).toFixed(8))
                    : 0,
            };

            featureCosts.push(costData);

            // Store in database
            await supabase.from('feature_cost_tracking').upsert(costData, {
                onConflict: 'feature_name,period_start,period_end',
            });
        }

        return featureCosts.sort((a, b) => b.total_cost_usd - a.total_cost_usd);
    } catch (error) {
        console.error('[Cost Intelligence] Feature cost analysis error:', error);
        return [];
    }
}

/**
 * Analyze costs per client/device
 */
async function analyzeClientCosts(supabase: any, period: any) {
    try {
        // Get all devices with their companies
        const { data: devices, error } = await supabase
            .from('devices')
            .select('id, machine_id, company_id, companies(id, email, plan)');

        if (error) throw error;

        const clientCosts = [];

        for (const device of devices.slice(0, 100)) { // Limit for performance
            // Get events for this device
            const { data: events } = await supabase
                .from('telemetry_events')
                .select('feature_name, duration_ms, metadata')
                .eq('device_id', device.id)
                .gte('timestamp', period.start)
                .lte('timestamp', period.end);

            if (!events || events.length === 0) continue;

            // Calculate costs
            const total_events = events.length;
            const ai_requests = events.filter((e: any) => e.metadata?.used_ai).length;

            const compute_cost = total_events * COSTS.EVENT_PROCESSING;
            const storage_cost = (total_events * 0.001 / 1024) * COSTS.STORAGE_PER_GB;
            const bandwidth_cost = (total_events * 0.002 / 1024) * COSTS.BANDWIDTH_PER_GB;
            const ai_cost = ai_requests * COSTS.AI_COST_PER_REQUEST;

            const total_cost = compute_cost + storage_cost + bandwidth_cost + ai_cost;

            // Calculate revenue
            const plan = device.companies?.plan || 'free';
            const revenue = REVENUE[plan as keyof typeof REVENUE] || 0;

            const margin = revenue - total_cost;
            const profitability_score = revenue > 0 ? (margin / revenue) * 100 : -100;

            // Feature breakdown
            const featureBreakdown: any = {};
            const usageBreakdown: any = {};
            events.forEach((e: any) => {
                if (!featureBreakdown[e.feature_name]) {
                    featureBreakdown[e.feature_name] = 0;
                    usageBreakdown[e.feature_name] = 0;
                }
                featureBreakdown[e.feature_name] += COSTS.EVENT_PROCESSING;
                usageBreakdown[e.feature_name]++;
            });

            const costData = {
                company_id: device.company_id,
                device_id: device.id,
                period_month: new Date(period.start).toISOString().substring(0, 7) + '-01',
                total_cost_usd: parseFloat(total_cost.toFixed(4)),
                revenue_usd: parseFloat(revenue.toFixed(2)),
                margin_usd: parseFloat(margin.toFixed(2)),
                feature_breakdown: featureBreakdown,
                usage_breakdown: usageBreakdown,
                profitability_score: parseFloat(profitability_score.toFixed(2)),
            };

            clientCosts.push(costData);

            // Store in database
            await supabase.from('client_cost_analysis').upsert(costData, {
                onConflict: 'device_id,period_month',
            });
        }

        return clientCosts.sort((a, b) => b.total_cost_usd - a.total_cost_usd);
    } catch (error) {
        console.error('[Cost Intelligence] Client cost analysis error:', error);
        return [];
    }
}

/**
 * Estimate revenue generated by a feature
 */
async function estimateFeatureRevenue(
    supabase: any,
    featureName: string,
    userCount: number,
    period: any
): Promise<number> {
    try {
        // Get average plan distribution
        const { data: companies } = await supabase
            .from('companies')
            .select('plan');

        if (!companies || companies.length === 0) return 0;

        // Calculate weighted average revenue
        const planCounts = companies.reduce((acc: any, c: any) => {
            acc[c.plan] = (acc[c.plan] || 0) + 1;
            return acc;
        }, {});

        const totalCompanies = companies.length;
        let avgRevenue = 0;

        Object.keys(planCounts).forEach((plan) => {
            const weight = planCounts[plan] / totalCompanies;
            avgRevenue += (REVENUE[plan as keyof typeof REVENUE] || 0) * weight;
        });

        // Allocate proportionally by usage
        const revenuePerUser = avgRevenue / 100; // Assume 100 features
        return revenuePerUser * userCount;
    } catch (error) {
        return 0;
    }
}

/**
 * Generate cost summary
 */
async function generateCostSummary(supabase: any, period: any) {
    try {
        const { data: costs } = await supabase
            .from('feature_cost_tracking')
            .select('*')
            .gte('period_start', period.start)
            .lte('period_end', period.end);

        if (!costs || costs.length === 0) {
            return {
                total_cost: 0,
                total_revenue: 0,
                total_margin: 0,
                avg_roi: 0,
            };
        }

        const total_cost = costs.reduce((sum: number, c: any) => sum + parseFloat(c.total_cost_usd || 0), 0);
        const total_revenue = costs.reduce((sum: number, c: any) => sum + parseFloat(c.revenue_generated_usd || 0), 0);
        const total_margin = total_revenue - total_cost;
        const avg_roi = total_cost > 0 ? ((total_revenue - total_cost) / total_cost) * 100 : 0;

        return {
            total_cost: parseFloat(total_cost.toFixed(2)),
            total_revenue: parseFloat(total_revenue.toFixed(2)),
            total_margin: parseFloat(total_margin.toFixed(2)),
            avg_roi: parseFloat(avg_roi.toFixed(2)),
            top_cost_features: costs
                .sort((a: any, b: any) => b.total_cost_usd - a.total_cost_usd)
                .slice(0, 5)
                .map((c: any) => ({
                    feature: c.feature_name,
                    cost: c.total_cost_usd,
                })),
            top_revenue_features: costs
                .sort((a: any, b: any) => b.revenue_generated_usd - a.revenue_generated_usd)
                .slice(0, 5)
                .map((c: any) => ({
                    feature: c.feature_name,
                    revenue: c.revenue_generated_usd,
                })),
        };
    } catch (error) {
        console.error('[Cost Intelligence] Summary generation error:', error);
        return null;
    }
}

/**
 * GET /api/intelligence/cost-analysis
 * Get existing cost analysis data
 */
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type') || 'feature';
        const limit = parseInt(searchParams.get('limit') || '50');

        const supabase = createClient();

        let data;
        if (type === 'feature') {
            const { data: costs } = await supabase
                .from('feature_cost_tracking')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(limit);
            data = costs;
        } else if (type === 'client') {
            const { data: costs } = await supabase
                .from('client_cost_analysis')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(limit);
            data = costs;
        }

        return NextResponse.json({
            success: true,
            data,
        });
    } catch (error: any) {
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
