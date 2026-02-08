'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

interface FeatureCost {
    feature_name: string;
    total_cost_usd: number;
    revenue_generated_usd: number;
    margin_usd: number;
    roi_percentage: number;
    total_users: number;
    cost_per_user: number;
}

interface CostSummary {
    total_cost: number;
    total_revenue: number;
    total_margin: number;
    avg_roi: number;
    top_cost_features: { feature: string; cost: number }[];
    top_revenue_features: { feature: string; revenue: number }[];
}

export default function AdminCostIntelligence() {
    const [loading, setLoading] = useState(true);
    const [featureCosts, setFeatureCosts] = useState<FeatureCost[]>([]);
    const [summary, setSummary] = useState<CostSummary | null>(null);

    useEffect(() => {
        fetchCostAnalysis();
    }, []);

    const fetchCostAnalysis = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/intelligence/cost-analysis', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    analysis_type: 'all',
                }),
            });

            const data = await res.json();
            if (data.success) {
                setFeatureCosts(data.results.feature_costs || []);
                setSummary(data.results.summary || null);
            }
        } catch (error) {
            console.error('Failed to fetch cost analysis:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                    <p className="text-gray-500">Analyzing costs...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold">💰 Cost Intelligence</h2>
                    <p className="text-gray-500 mt-1">Feature-level cost tracking and ROI analysis</p>
                </div>
                <button
                    onClick={fetchCostAnalysis}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                    Refresh Analysis
                </button>
            </div>

            {/* Summary Cards */}
            {summary && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Total Cost</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">
                                ${summary.total_cost.toFixed(2)}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                ${summary.total_revenue.toFixed(2)}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Total Margin</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className={`text-2xl font-bold ${summary.total_margin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                ${summary.total_margin.toFixed(2)}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Average ROI</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className={`text-2xl font-bold ${summary.avg_roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {summary.avg_roi.toFixed(1)}%
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Feature Costs */}
            <Card>
                <CardHeader>
                    <CardTitle>💸 Cost by Feature</CardTitle>
                    <CardDescription>Detailed cost breakdown and ROI per feature</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {featureCosts.length === 0 ? (
                            <p className="text-center text-gray-500 py-8">No cost data available</p>
                        ) : (
                            featureCosts.map((feature) => (
                                <div
                                    key={feature.feature_name}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                            <h4 className="font-semibold">{feature.feature_name}</h4>
                                            <ROIBadge roi={feature.roi_percentage} />
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-sm">
                                            <div>
                                                <span className="text-gray-500">Cost:</span>{' '}
                                                <span className="font-medium text-red-600">
                                                    ${feature.total_cost_usd.toFixed(4)}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Revenue:</span>{' '}
                                                <span className="font-medium text-green-600">
                                                    ${feature.revenue_generated_usd.toFixed(2)}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Margin:</span>{' '}
                                                <span className={`font-medium ${feature.margin_usd >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    ${feature.margin_usd.toFixed(2)}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Cost/User:</span>{' '}
                                                <span className="font-medium">
                                                    ${feature.cost_per_user.toFixed(6)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        {feature.margin_usd >= 0 ? (
                                            <TrendingUp className="w-6 h-6 text-green-500" />
                                        ) : (
                                            <TrendingDown className="w-6 h-6 text-red-500" />
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Top Cost Features */}
            {summary && summary.top_cost_features.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-red-500" />
                                Top Cost Features
                            </CardTitle>
                            <CardDescription>Features with highest infrastructure costs</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {summary.top_cost_features.map((feature, idx) => (
                                    <div key={idx} className="flex justify-between items-center p-2 bg-red-50 rounded">
                                        <span className="font-medium">{feature.feature}</span>
                                        <span className="text-red-600 font-semibold">${feature.cost.toFixed(4)}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-green-500" />
                                Top Revenue Features
                            </CardTitle>
                            <CardDescription>Features generating most revenue</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {summary.top_revenue_features.map((feature, idx) => (
                                    <div key={idx} className="flex justify-between items-center p-2 bg-green-50 rounded">
                                        <span className="font-medium">{feature.feature}</span>
                                        <span className="text-green-600 font-semibold">${feature.revenue.toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Insights */}
            <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                    <CardTitle className="text-blue-900">💡 Cost Intelligence Insights</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2 text-sm text-blue-800">
                        {summary && summary.avg_roi < 0 && (
                            <li className="flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <span>
                                    <strong>Warning:</strong> Average ROI is negative. Consider optimizing high-cost, low-revenue features.
                                </span>
                            </li>
                        )}
                        {featureCosts.filter(f => f.margin_usd < 0).length > 0 && (
                            <li className="flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <span>
                                    <strong>{featureCosts.filter(f => f.margin_usd < 0).length} features</strong> are operating at a loss.
                                </span>
                            </li>
                        )}
                        <li className="flex items-start gap-2">
                            <TrendingUp className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>
                                Monitor cost per user metrics to identify scaling inefficiencies.
                            </span>
                        </li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}

function ROIBadge({ roi }: { roi: number }) {
    const getColor = () => {
        if (roi >= 100) return 'bg-green-100 text-green-800';
        if (roi >= 50) return 'bg-lime-100 text-lime-800';
        if (roi >= 0) return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    };

    return (
        <Badge className={getColor()}>
            ROI: {roi.toFixed(0)}%
        </Badge>
    );
}
