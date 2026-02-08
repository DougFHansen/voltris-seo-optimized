/**
 * VOLTRIS ENTERPRISE TELEMETRY PLATFORM
 * Deploy Correlation Service API
 * 
 * Correlates bugs, performance, and feature usage with specific deploys
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/deploy/register
 * Register a new deploy
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            deploy_version,
            git_commit_hash,
            git_branch,
            deployed_by,
            release_notes,
            feature_flags_snapshot,
            environment,
            build_number,
        } = body;

        if (!deploy_version) {
            return NextResponse.json(
                { success: false, error: 'MISSING_DEPLOY_VERSION' },
                { status: 400 }
            );
        }

        const supabase = await createClient();

        // Register deploy
        const { data: deploy, error } = await supabase
            .from('deploy_registry')
            .insert({
                deploy_version,
                git_commit_hash,
                git_branch: git_branch || 'main',
                deployed_by: deployed_by || 'system',
                release_notes,
                feature_flags_snapshot,
                environment: environment || 'production',
                build_number,
                deployed_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (error) {
            if (error.code === '23505') {
                // Already exists
                return NextResponse.json(
                    {
                        success: false,
                        error: 'DEPLOY_ALREADY_REGISTERED',
                        message: `Deploy version ${deploy_version} already exists`,
                    },
                    { status: 409 }
                );
            }
            throw error;
        }

        return NextResponse.json({
            success: true,
            deploy,
            message: 'Deploy registered successfully',
        });
    } catch (error: any) {
        console.error('[Deploy] Registration error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'REGISTRATION_FAILED',
                message: error.message,
            },
            { status: 500 }
        );
    }
}

/**
 * GET /api/deploy/correlation
 * Analyze deploy impact and correlations
 */
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const deployVersion = searchParams.get('version');
        const analysisHours = parseInt(searchParams.get('hours') || '24');

        if (!deployVersion) {
            return NextResponse.json(
                { success: false, error: 'MISSING_DEPLOY_VERSION' },
                { status: 400 }
            );
        }

        const supabase = await createClient();

        // Get deploy info
        const { data: deploy, error: deployError } = await supabase
            .from('deploy_registry')
            .select('*')
            .eq('deploy_version', deployVersion)
            .single();

        if (deployError || !deploy) {
            return NextResponse.json(
                { success: false, error: 'DEPLOY_NOT_FOUND' },
                { status: 404 }
            );
        }

        // Define analysis windows
        const deployTime = new Date(deploy.deployed_at);
        const beforeStart = new Date(deployTime.getTime() - analysisHours * 60 * 60 * 1000);
        const beforeEnd = deployTime;
        const afterStart = deployTime;
        const afterEnd = new Date(deployTime.getTime() + analysisHours * 60 * 60 * 1000);

        // Run correlation analysis
        const correlation = await analyzeDeployImpact(
            supabase,
            deployVersion,
            { start: beforeStart, end: beforeEnd },
            { start: afterStart, end: afterEnd }
        );

        return NextResponse.json({
            success: true,
            deploy,
            correlation,
            analysis_windows: {
                before: { start: beforeStart, end: beforeEnd },
                after: { start: afterStart, end: afterEnd },
            },
        });
    } catch (error: any) {
        console.error('[Deploy] Correlation error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'CORRELATION_FAILED',
                message: error.message,
            },
            { status: 500 }
        );
    }
}

/**
 * Analyze deploy impact
 */
async function analyzeDeployImpact(
    supabase: any,
    deployVersion: string,
    beforeWindow: any,
    afterWindow: any
) {
    try {
        // Get metrics before and after deploy
        const metricsBefore = await getWindowMetrics(supabase, beforeWindow);
        const metricsAfter = await getWindowMetrics(supabase, afterWindow);

        // Calculate changes
        const performance_change = calculatePercentChange(
            metricsBefore.avg_duration_ms,
            metricsAfter.avg_duration_ms
        );

        const crash_rate_change = calculatePercentChange(
            metricsBefore.crash_rate,
            metricsAfter.crash_rate
        );

        const error_rate_change = calculatePercentChange(
            metricsBefore.error_rate,
            metricsAfter.error_rate
        );

        // Detect new bugs
        const newBugs = await detectNewBugs(supabase, beforeWindow, afterWindow);

        // Calculate health score (0-100, higher is better)
        const health_score = calculateDeployHealthScore({
            performance_change,
            crash_rate_change,
            error_rate_change,
            new_bugs_count: newBugs.length,
        });

        const rollback_recommended = health_score < 50;

        const correlation = {
            deploy_version: deployVersion,
            analysis_start: afterWindow.start,
            analysis_end: afterWindow.end,

            // Performance Impact
            avg_performance_change_pct: performance_change,
            p95_latency_change_ms: metricsAfter.p95_latency_ms - metricsBefore.p95_latency_ms,

            // Stability
            crash_rate_before: metricsBefore.crash_rate,
            crash_rate_after: metricsAfter.crash_rate,
            crash_rate_change_pct: crash_rate_change,
            error_rate_before: metricsBefore.error_rate,
            error_rate_after: metricsAfter.error_rate,
            error_rate_change_pct: error_rate_change,

            // Bugs
            new_bugs_count: newBugs.length,
            new_bug_patterns: newBugs.map((b: any) => b.pattern_signature),
            resolved_bugs_count: 0, // TODO: Implement

            // User Impact
            affected_users: metricsAfter.unique_users,
            user_satisfaction_score: calculateSatisfactionScore(metricsAfter),

            // Feature Usage
            feature_adoption_change: await analyzeFeatureAdoption(supabase, beforeWindow, afterWindow),

            // Overall Health
            deploy_health_score: health_score,
            rollback_recommended,
        };

        // Store correlation metrics
        await supabase.from('deploy_correlation_metrics').upsert(correlation, {
            onConflict: 'deploy_version,analysis_start,analysis_end',
        });

        return correlation;
    } catch (error) {
        console.error('[Deploy] Impact analysis error:', error);
        throw error;
    }
}

/**
 * Get metrics for a time window
 */
async function getWindowMetrics(supabase: any, window: any) {
    const { data: events, error } = await supabase
        .from('telemetry_events')
        .select('success, duration_ms, device_id, event_type')
        .gte('timestamp', window.start.toISOString())
        .lte('timestamp', window.end.toISOString());

    if (error) throw error;

    const total = events.length;
    const failures = events.filter((e: any) => !e.success).length;
    const crashes = events.filter((e: any) => e.event_type === 'EXCEPTION').length;

    return {
        total_events: total,
        unique_users: new Set(events.map((e: any) => e.device_id)).size,
        error_rate: total > 0 ? (failures / total) * 100 : 0,
        crash_rate: total > 0 ? (crashes / total) * 100 : 0,
        avg_duration_ms: total > 0
            ? events.reduce((sum: number, e: any) => sum + (e.duration_ms || 0), 0) / total
            : 0,
        p95_latency_ms: calculateP95(events.map((e: any) => e.duration_ms || 0)),
    };
}

/**
 * Detect new bugs introduced after deploy
 */
async function detectNewBugs(supabase: any, beforeWindow: any, afterWindow: any) {
    try {
        // Get error signatures before
        const { data: errorsBefore } = await supabase
            .from('telemetry_events')
            .select('error_code, feature_name')
            .eq('success', false)
            .not('error_code', 'is', null)
            .gte('timestamp', beforeWindow.start.toISOString())
            .lte('timestamp', beforeWindow.end.toISOString());

        const signaturesBefore = new Set(
            (errorsBefore || []).map((e: any) => `${e.feature_name}:${e.error_code}`)
        );

        // Get error signatures after
        const { data: errorsAfter } = await supabase
            .from('telemetry_events')
            .select('error_code, feature_name')
            .eq('success', false)
            .not('error_code', 'is', null)
            .gte('timestamp', afterWindow.start.toISOString())
            .lte('timestamp', afterWindow.end.toISOString());

        const signaturesAfter = new Map<string, number>();
        (errorsAfter || []).forEach((e: any) => {
            const sig = `${e.feature_name}:${e.error_code}`;
            signaturesAfter.set(sig, (signaturesAfter.get(sig) || 0) + 1);
        });

        // Find new signatures
        const newBugs: Array<{ pattern_signature: string; feature_name: string; error_type: string; frequency: number }> = [];
        signaturesAfter.forEach((count, signature) => {
            if (!signaturesBefore.has(signature)) {
                const [feature, error] = signature.split(':');
                newBugs.push({
                    pattern_signature: signature,
                    feature_name: feature,
                    error_type: error,
                    frequency: count,
                });
            }
        });

        return newBugs;
    } catch (error) {
        console.error('[Deploy] New bug detection error:', error);
        return [];
    }
}

/**
 * Analyze feature adoption changes
 */
async function analyzeFeatureAdoption(supabase: any, beforeWindow: any, afterWindow: any) {
    try {
        const getFeatureUsage = async (window: any) => {
            const { data: events } = await supabase
                .from('telemetry_events')
                .select('feature_name, device_id')
                .gte('timestamp', window.start.toISOString())
                .lte('timestamp', window.end.toISOString());

            const featureMap = new Map<string, Set<string>>();
            (events || []).forEach((e: any) => {
                if (!featureMap.has(e.feature_name)) {
                    featureMap.set(e.feature_name, new Set());
                }
                featureMap.get(e.feature_name)!.add(e.device_id);
            });

            return featureMap;
        };

        const usageBefore = await getFeatureUsage(beforeWindow);
        const usageAfter = await getFeatureUsage(afterWindow);

        const changes: any = {};
        usageAfter.forEach((users, feature) => {
            const usersBefore = usageBefore.get(feature)?.size || 0;
            const usersAfter = users.size;
            const change = calculatePercentChange(usersBefore, usersAfter);
            changes[feature] = {
                users_before: usersBefore,
                users_after: usersAfter,
                change_pct: change,
            };
        });

        return changes;
    } catch (error) {
        console.error('[Deploy] Feature adoption analysis error:', error);
        return {};
    }
}

// Helper functions
function calculatePercentChange(before: number, after: number): number {
    if (before === 0) return after > 0 ? 100 : 0;
    return parseFloat((((after - before) / before) * 100).toFixed(2));
}

function calculateP95(values: number[]): number {
    if (values.length === 0) return 0;
    const sorted = values.sort((a, b) => a - b);
    const index = Math.floor(sorted.length * 0.95);
    return sorted[index] || 0;
}

function calculateDeployHealthScore(metrics: any): number {
    let score = 100;

    // Performance degradation
    if (metrics.performance_change > 10) score -= 20;
    else if (metrics.performance_change > 5) score -= 10;

    // Error rate increase
    if (metrics.error_rate_change > 20) score -= 30;
    else if (metrics.error_rate_change > 10) score -= 15;

    // Crash rate increase
    if (metrics.crash_rate_change > 10) score -= 40;
    else if (metrics.crash_rate_change > 5) score -= 20;

    // New bugs
    score -= Math.min(metrics.new_bugs_count * 5, 30);

    return Math.max(score, 0);
}

function calculateSatisfactionScore(metrics: any): number {
    const successFactor = (100 - metrics.error_rate) / 100;
    const performanceFactor = metrics.avg_duration_ms < 1000 ? 1 : 0.8;
    return parseFloat((successFactor * performanceFactor * 5).toFixed(2)); // 0-5 scale
}
