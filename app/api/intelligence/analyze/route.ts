/**
 * VOLTRIS ENTERPRISE TELEMETRY PLATFORM
 * Product Intelligence Engine API
 * 
 * AI-powered analysis of feature usage, UX friction, bugs, and user journeys
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface FeatureUsageMetric {
    feature_name: string;
    total_users: number;
    active_users: number;
    total_events: number;
    success_rate: number;
    avg_duration_ms: number;
    abandonment_rate: number;
    friction_score: number;
    trend: 'growing' | 'stable' | 'declining';
}

interface FrictionPoint {
    feature_name: string;
    friction_type: string;
    severity: string;
    affected_users: number;
    occurrence_count: number;
    avg_impact_score: number;
}

interface BugPattern {
    pattern_signature: string;
    feature_name: string;
    error_type: string;
    error_frequency: number;
    affected_devices: number;
    correlation_with_deploy: boolean;
    deploy_version?: string;
    priority: string;
}

/**
 * POST /api/intelligence/analyze
 * Run Product Intelligence analysis
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { period_start, period_end, analysis_types } = body;

        const supabase = await createClient();

        const results: any = {
            analysis_period: {
                start: period_start || new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                end: period_end || new Date().toISOString(),
            },
            timestamp: new Date().toISOString(),
        };

        // Run requested analyses
        if (!analysis_types || analysis_types.includes('feature_usage')) {
            results.feature_usage = await analyzeFeatureUsage(supabase, results.analysis_period);
        }

        if (!analysis_types || analysis_types.includes('ux_friction')) {
            results.ux_friction = await detectUXFriction(supabase, results.analysis_period);
        }

        if (!analysis_types || analysis_types.includes('bug_patterns')) {
            results.bug_patterns = await detectBugPatterns(supabase, results.analysis_period);
        }

        if (!analysis_types || analysis_types.includes('user_journeys')) {
            results.user_journeys = await analyzeUserJourneys(supabase, results.analysis_period);
        }

        return NextResponse.json({
            success: true,
            results,
        });
    } catch (error: any) {
        console.error('[Product Intelligence] Error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'ANALYSIS_FAILED',
                message: error.message,
            },
            { status: 500 }
        );
    }
}

/**
 * Analyze feature usage patterns
 */
async function analyzeFeatureUsage(supabase: any, period: any): Promise<FeatureUsageMetric[]> {
    try {
        // Query telemetry events grouped by feature
        const { data: events, error } = await supabase
            .from('telemetry_events')
            .select('feature_name, success, duration_ms, device_id, session_id')
            .gte('timestamp', period.start)
            .lte('timestamp', period.end);

        if (error) throw error;

        // Group by feature
        const featureMap = new Map<string, any>();

        events.forEach((event: any) => {
            if (!featureMap.has(event.feature_name)) {
                featureMap.set(event.feature_name, {
                    feature_name: event.feature_name,
                    total_events: 0,
                    success_count: 0,
                    total_duration: 0,
                    unique_devices: new Set(),
                    unique_sessions: new Set(),
                });
            }

            const feature = featureMap.get(event.feature_name);
            feature.total_events++;
            if (event.success) feature.success_count++;
            feature.total_duration += event.duration_ms || 0;
            feature.unique_devices.add(event.device_id);
            feature.unique_sessions.add(event.session_id);
        });

        // Convert to metrics
        const metrics: FeatureUsageMetric[] = [];
        featureMap.forEach((feature) => {
            const success_rate = feature.total_events > 0
                ? (feature.success_count / feature.total_events) * 100
                : 0;

            const avg_duration_ms = feature.total_events > 0
                ? feature.total_duration / feature.total_events
                : 0;

            // Calculate friction score (0-100, lower is better)
            const friction_score = calculateFrictionScore(success_rate, avg_duration_ms);

            // Calculate abandonment rate (simplified)
            const abandonment_rate = (100 - success_rate) * 0.5; // Placeholder logic

            metrics.push({
                feature_name: feature.feature_name,
                total_users: feature.unique_devices.size,
                active_users: feature.unique_devices.size,
                total_events: feature.total_events,
                success_rate: parseFloat(success_rate.toFixed(2)),
                avg_duration_ms: Math.round(avg_duration_ms),
                abandonment_rate: parseFloat(abandonment_rate.toFixed(2)),
                friction_score: parseFloat(friction_score.toFixed(2)),
                trend: determineTrend(feature.total_events), // Simplified
            });
        });

        // Store intelligence in database
        for (const metric of metrics) {
            await supabase.from('feature_usage_intelligence').upsert({
                feature_name: metric.feature_name,
                period_start: period.start,
                period_end: period.end,
                total_users: metric.total_users,
                active_users: metric.active_users,
                total_events: metric.total_events,
                success_rate: metric.success_rate,
                avg_duration_ms: metric.avg_duration_ms,
                abandonment_rate: metric.abandonment_rate,
                friction_score: metric.friction_score,
                insights: generateInsights(metric),
                recommendations: generateRecommendations(metric),
            });
        }

        return metrics.sort((a, b) => b.total_events - a.total_events);
    } catch (error) {
        console.error('[Product Intelligence] Feature usage analysis error:', error);
        return [];
    }
}

/**
 * Detect UX friction points
 */
async function detectUXFriction(supabase: any, period: any): Promise<FrictionPoint[]> {
    try {
        const { data: events, error } = await supabase
            .from('telemetry_events')
            .select('feature_name, action_name, success, duration_ms, device_id')
            .gte('timestamp', period.start)
            .lte('timestamp', period.end);

        if (error) throw error;

        const frictionPoints: FrictionPoint[] = [];
        const actionMap = new Map<string, any>();

        // Group by feature + action
        events.forEach((event: any) => {
            const key = `${event.feature_name}:${event.action_name}`;
            if (!actionMap.has(key)) {
                actionMap.set(key, {
                    feature_name: event.feature_name,
                    action_name: event.action_name,
                    total: 0,
                    failures: 0,
                    slow_count: 0,
                    total_duration: 0,
                    affected_devices: new Set(),
                });
            }

            const action = actionMap.get(key);
            action.total++;
            if (!event.success) action.failures++;
            if (event.duration_ms > 5000) action.slow_count++; // > 5s is "slow"
            action.total_duration += event.duration_ms || 0;
            action.affected_devices.add(event.device_id);
        });

        // Detect friction
        actionMap.forEach((action, key) => {
            const error_rate = (action.failures / action.total) * 100;
            const slow_rate = (action.slow_count / action.total) * 100;
            const avg_duration = action.total_duration / action.total;

            // High error rate (>20%)
            if (error_rate > 20) {
                frictionPoints.push({
                    feature_name: action.feature_name,
                    friction_type: 'high_error_rate',
                    severity: error_rate > 50 ? 'critical' : error_rate > 30 ? 'high' : 'medium',
                    affected_users: action.affected_devices.size,
                    occurrence_count: action.failures,
                    avg_impact_score: error_rate,
                });
            }

            // Slow performance (>50% of actions are slow)
            if (slow_rate > 50) {
                frictionPoints.push({
                    feature_name: action.feature_name,
                    friction_type: 'slow_performance',
                    severity: avg_duration > 10000 ? 'high' : 'medium',
                    affected_users: action.affected_devices.size,
                    occurrence_count: action.slow_count,
                    avg_impact_score: slow_rate,
                });
            }
        });

        // Store friction points
        for (const friction of frictionPoints) {
            await supabase.from('ux_friction_points').insert({
                feature_name: friction.feature_name,
                friction_type: friction.friction_type,
                severity: friction.severity,
                affected_users: friction.affected_users,
                occurrence_count: friction.occurrence_count,
                avg_impact_score: friction.avg_impact_score,
                action_sequence: [friction.feature_name],
            });
        }

        return frictionPoints.sort((a, b) => b.avg_impact_score - a.avg_impact_score);
    } catch (error) {
        console.error('[Product Intelligence] UX friction detection error:', error);
        return [];
    }
}

/**
 * Detect bug patterns
 */
async function detectBugPatterns(supabase: any, period: any): Promise<BugPattern[]> {
    try {
        const { data: errors, error } = await supabase
            .from('telemetry_events')
            .select('feature_name, error_code, metadata, device_id, timestamp')
            .eq('success', false)
            .not('error_code', 'is', null)
            .gte('timestamp', period.start)
            .lte('timestamp', period.end);

        if (error) throw error;

        const patternMap = new Map<string, any>();

        // Group errors by signature
        errors.forEach((event: any) => {
            const signature = `${event.feature_name}:${event.error_code}`;
            if (!patternMap.has(signature)) {
                patternMap.set(signature, {
                    pattern_signature: signature,
                    feature_name: event.feature_name,
                    error_type: event.error_code,
                    frequency: 0,
                    affected_devices: new Set(),
                    first_seen: event.timestamp,
                    last_seen: event.timestamp,
                });
            }

            const pattern = patternMap.get(signature);
            pattern.frequency++;
            pattern.affected_devices.add(event.device_id);
            if (new Date(event.timestamp) < new Date(pattern.first_seen)) {
                pattern.first_seen = event.timestamp;
            }
            if (new Date(event.timestamp) > new Date(pattern.last_seen)) {
                pattern.last_seen = event.timestamp;
            }
        });

        // Convert to bug patterns
        const bugPatterns: BugPattern[] = [];
        patternMap.forEach((pattern) => {
            if (pattern.frequency >= 5) { // Only report if occurred 5+ times
                const priority = pattern.frequency > 100 ? 'critical'
                    : pattern.frequency > 50 ? 'high'
                        : pattern.frequency > 20 ? 'medium'
                            : 'low';

                bugPatterns.push({
                    pattern_signature: pattern.pattern_signature,
                    feature_name: pattern.feature_name,
                    error_type: pattern.error_type,
                    error_frequency: pattern.frequency,
                    affected_devices: pattern.affected_devices.size,
                    correlation_with_deploy: false, // TODO: Check against deploy_registry
                    priority,
                });
            }
        });

        // Store bug patterns
        for (const bug of bugPatterns) {
            await supabase.from('detected_bug_patterns').upsert(
                {
                    pattern_signature: bug.pattern_signature,
                    feature_name: bug.feature_name,
                    error_type: bug.error_type,
                    error_frequency: bug.error_frequency,
                    affected_devices: bug.affected_devices,
                    first_seen: period.start,
                    last_seen: period.end,
                    status: 'open',
                    priority: bug.priority,
                },
                { onConflict: 'pattern_signature' }
            );
        }

        return bugPatterns.sort((a, b) => b.error_frequency - a.error_frequency);
    } catch (error) {
        console.error('[Product Intelligence] Bug pattern detection error:', error);
        return [];
    }
}

/**
 * Analyze user journeys
 */
async function analyzeUserJourneys(supabase: any, period: any) {
    try {
        // Get all sessions in period
        const { data: sessions, error } = await supabase
            .from('sessions')
            .select('id, device_id, started_at, ended_at, status')
            .gte('started_at', period.start)
            .lte('started_at', period.end);

        if (error) throw error;

        const journeys = [];

        for (const session of sessions.slice(0, 100)) { // Limit to 100 for performance
            // Get events for this session
            const { data: events } = await supabase
                .from('telemetry_events')
                .select('event_type, feature_name, action_name, timestamp, success, duration_ms')
                .eq('session_id', session.id)
                .order('timestamp', { ascending: true });

            if (events && events.length > 0) {
                const journey = {
                    session_id: session.id,
                    device_id: session.device_id,
                    journey_start: session.started_at,
                    journey_end: session.ended_at,
                    duration_seconds: session.ended_at
                        ? Math.floor((new Date(session.ended_at).getTime() - new Date(session.started_at).getTime()) / 1000)
                        : null,
                    event_sequence: events,
                    page_sequence: [...new Set(events.map((e: any) => e.action_name))],
                    feature_sequence: [...new Set(events.map((e: any) => e.feature_name))],
                    total_events: events.length,
                    error_count: events.filter((e: any) => !e.success).length,
                    success_rate: (events.filter((e: any) => e.success).length / events.length) * 100,
                    completed: session.status === 'ended',
                    journey_type: classifyJourneyType(events),
                };

                journeys.push(journey);

                // Store journey
                await supabase.from('user_journeys').insert({
                    session_id: journey.session_id,
                    device_id: journey.device_id,
                    journey_start: journey.journey_start,
                    journey_end: journey.journey_end,
                    duration_seconds: journey.duration_seconds,
                    event_sequence: journey.event_sequence,
                    page_sequence: journey.page_sequence,
                    feature_sequence: journey.feature_sequence,
                    total_events: journey.total_events,
                    error_count: journey.error_count,
                    success_rate: journey.success_rate,
                    completed: journey.completed,
                    journey_type: journey.journey_type,
                });
            }
        }

        return {
            total_journeys: journeys.length,
            avg_journey_duration: journeys.reduce((sum, j) => sum + (j.duration_seconds || 0), 0) / journeys.length,
            completion_rate: (journeys.filter(j => j.completed).length / journeys.length) * 100,
        };
    } catch (error) {
        console.error('[Product Intelligence] User journey analysis error:', error);
        return null;
    }
}

// Helper functions
function calculateFrictionScore(success_rate: number, avg_duration_ms: number): number {
    const failure_factor = (100 - success_rate) * 0.7;
    const duration_factor = Math.min((avg_duration_ms / 10000) * 30, 30); // Max 30 points for duration
    return Math.min(failure_factor + duration_factor, 100);
}

function determineTrend(total_events: number): 'growing' | 'stable' | 'declining' {
    // Simplified - would need historical comparison
    return total_events > 100 ? 'growing' : total_events > 20 ? 'stable' : 'declining';
}

function generateInsights(metric: FeatureUsageMetric): any {
    const insights = [];
    if (metric.success_rate < 80) {
        insights.push({ type: 'warning', message: 'Success rate is below 80%' });
    }
    if (metric.friction_score > 50) {
        insights.push({ type: 'critical', message: 'High friction detected' });
    }
    if (metric.total_users < 10) {
        insights.push({ type: 'info', message: 'Low user adoption' });
    }
    return insights;
}

function generateRecommendations(metric: FeatureUsageMetric): any {
    const recommendations = [];
    if (metric.success_rate < 80) {
        recommendations.push('Investigate common error patterns');
    }
    if (metric.avg_duration_ms > 5000) {
        recommendations.push('Optimize performance');
    }
    if (metric.total_users < 10) {
        recommendations.push('Improve feature discoverability');
    }
    return recommendations;
}

function classifyJourneyType(events: any[]): string {
    const features = events.map(e => e.feature_name);
    if (features.includes('Cleanup')) return 'cleanup';
    if (features.includes('Gamer')) return 'optimization';
    if (features.includes('System')) return 'troubleshooting';
    return 'general';
}
