'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

interface FeatureMetric {
    feature_name: string;
    total_users: number;
    total_events: number;
    success_rate: number;
    friction_score: number;
    trend: 'growing' | 'stable' | 'declining';
}

interface FrictionPoint {
    feature_name: string;
    friction_type: string;
    severity: string;
    affected_users: number;
    occurrence_count: number;
}

interface BugPattern {
    pattern_signature: string;
    feature_name: string;
    error_frequency: number;
    priority: string;
}

export default function AdminProductIntelligence() {
    const [loading, setLoading] = useState(true);
    const [featureUsage, setFeatureUsage] = useState<FeatureMetric[]>([]);
    const [frictionPoints, setFrictionPoints] = useState<FrictionPoint[]>([]);
    const [bugPatterns, setBugPatterns] = useState<BugPattern[]>([]);

    useEffect(() => {
        fetchIntelligence();
    }, []);

    const fetchIntelligence = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/intelligence/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    analysis_types: ['feature_usage', 'ux_friction', 'bug_patterns'],
                }),
            });

            const data = await res.json();
            if (data.success) {
                setFeatureUsage(data.results.feature_usage || []);
                setFrictionPoints(data.results.ux_friction || []);
                setBugPatterns(data.results.bug_patterns || []);
            }
        } catch (error) {
            console.error('Failed to fetch intelligence:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-500">Analyzing product intelligence...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold">🧠 Product Intelligence</h2>
                    <p className="text-gray-500 mt-1">AI-powered insights into feature usage, UX friction, and bugs</p>
                </div>
                <button
                    onClick={fetchIntelligence}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Refresh Analysis
                </button>
            </div>

            {/* Feature Usage */}
            <Card>
                <CardHeader>
                    <CardTitle>📊 Feature Usage Analysis</CardTitle>
                    <CardDescription>Most and least used features with trends</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {featureUsage.slice(0, 10).map((feature) => (
                            <div
                                key={feature.feature_name}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <h4 className="font-semibold">{feature.feature_name}</h4>
                                        {feature.trend === 'growing' && (
                                            <TrendingUp className="w-4 h-4 text-green-500" />
                                        )}
                                        {feature.trend === 'declining' && (
                                            <TrendingDown className="w-4 h-4 text-red-500" />
                                        )}
                                    </div>
                                    <div className="flex gap-4 mt-2 text-sm text-gray-600">
                                        <span>{feature.total_users} users</span>
                                        <span>{feature.total_events} events</span>
                                        <span>{feature.success_rate.toFixed(1)}% success rate</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <FrictionScoreBadge score={feature.friction_score} />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* UX Friction Points */}
            <Card>
                <CardHeader>
                    <CardTitle>⚠️ UX Friction Detection</CardTitle>
                    <CardDescription>Detected usability issues and pain points</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {frictionPoints.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-green-500" />
                                <p>No significant friction detected! 🎉</p>
                            </div>
                        ) : (
                            frictionPoints.map((friction, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <AlertTriangle className="w-5 h-5 text-red-500" />
                                            <h4 className="font-semibold">{friction.feature_name}</h4>
                                            <SeverityBadge severity={friction.severity} />
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">{friction.friction_type}</p>
                                        <div className="flex gap-4 mt-2 text-sm text-gray-600">
                                            <span>{friction.affected_users} users affected</span>
                                            <span>{friction.occurrence_count} occurrences</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Bug Patterns */}
            <Card>
                <CardHeader>
                    <CardTitle>🐛 Bug Pattern Detection</CardTitle>
                    <CardDescription>AI-detected bug patterns requiring attention</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {bugPatterns.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-green-500" />
                                <p>No bug patterns detected! 🎉</p>
                            </div>
                        ) : (
                            bugPatterns.map((bug, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <XCircle className="w-5 h-5 text-yellow-600" />
                                            <h4 className="font-semibold">{bug.feature_name}</h4>
                                            <PriorityBadge priority={bug.priority} />
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1 font-mono text-xs">
                                            {bug.pattern_signature}
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">{bug.error_frequency} occurrences</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function FrictionScoreBadge({ score }: { score: number }) {
    const getColor = () => {
        if (score < 20) return 'bg-green-100 text-green-800';
        if (score < 40) return 'bg-yellow-100 text-yellow-800';
        if (score < 60) return 'bg-orange-100 text-orange-800';
        return 'bg-red-100 text-red-800';
    };

    return (
        <Badge className={getColor()}>
            Friction: {score.toFixed(0)}
        </Badge>
    );
}

function SeverityBadge({ severity }: { severity: string }) {
    const colors = {
        low: 'bg-blue-100 text-blue-800',
        medium: 'bg-yellow-100 text-yellow-800',
        high: 'bg-orange-100 text-orange-800',
        critical: 'bg-red-100 text-red-800',
    };

    return (
        <Badge className={colors[severity as keyof typeof colors] || colors.medium}>
            {severity.toUpperCase()}
        </Badge>
    );
}

function PriorityBadge({ priority }: { priority: string }) {
    const colors = {
        low: 'bg-gray-100 text-gray-800',
        medium: 'bg-yellow-100 text-yellow-800',
        high: 'bg-orange-100 text-orange-800',
        critical: 'bg-red-100 text-red-800',
    };

    return (
        <Badge className={colors[priority as keyof typeof colors] || colors.medium}>
            P{priority === 'critical' ? '0' : priority === 'high' ? '1' : priority === 'medium' ? '2' : '3'}
        </Badge>
    );
}
