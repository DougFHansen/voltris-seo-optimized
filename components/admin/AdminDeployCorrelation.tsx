'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GitBranch, AlertTriangle, TrendingUp, TrendingDown, CheckCircle2, XCircle } from 'lucide-react';

interface Deploy {
    deploy_version: string;
    git_commit_hash: string;
    deployed_at: string;
    environment: string;
}

interface DeployCorrelation {
    deploy_version: string;
    avg_performance_change_pct: number;
    crash_rate_change_pct: number;
    error_rate_change_pct: number;
    new_bugs_count: number;
    deploy_health_score: number;
    rollback_recommended: boolean;
    affected_users: number;
}

export default function AdminDeployCorrelation() {
    const [loading, setLoading] = useState(true);
    const [deploys, setDeploys] = useState<Deploy[]>([]);
    const [selectedDeploy, setSelectedDeploy] = useState<string | null>(null);
    const [correlation, setCorrelation] = useState<DeployCorrelation | null>(null);

    useEffect(() => {
        fetchDeploys();
    }, []);

    const fetchDeploys = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/admin/deploys');
            const data = await res.json();

            if (data.success) {
                setDeploys(data.deploys || []);
                if (data.deploys && data.deploys.length > 0) {
                    setSelectedDeploy(data.deploys[0].deploy_version);
                    fetchCorrelation(data.deploys[0].deploy_version);
                }
            }
        } catch (error) {
            console.error('Failed to fetch deploys:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCorrelation = async (version: string) => {
        try {
            const res = await fetch(`/api/deploy?version=${version}&hours=24`);
            const data = await res.json();

            if (data.success) {
                setCorrelation(data.correlation);
            }
        } catch (error) {
            console.error('Failed to fetch correlation:', error);
        }
    };

    const handleDeployChange = (version: string) => {
        setSelectedDeploy(version);
        fetchCorrelation(version);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading deploy correlation...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold">🛰 Deploy Correlation</h2>
                    <p className="text-gray-500 mt-1">Analyze deploy impact on performance, bugs, and stability</p>
                </div>
                <button
                    onClick={fetchDeploys}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                    Refresh
                </button>
            </div>

            {/* Deploy Selector */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <GitBranch className="w-5 h-5" />
                        Select Deploy
                    </CardTitle>
                    <CardDescription>Choose a deploy to analyze its impact</CardDescription>
                </CardHeader>
                <CardContent>
                    <select
                        className="w-full p-2 border rounded-lg"
                        value={selectedDeploy || ''}
                        onChange={(e) => handleDeployChange(e.target.value)}
                    >
                        {deploys.map((deploy) => (
                            <option key={deploy.deploy_version} value={deploy.deploy_version}>
                                {deploy.deploy_version} - {new Date(deploy.deployed_at).toLocaleString()} ({deploy.environment})
                            </option>
                        ))}
                    </select>
                </CardContent>
            </Card>

            {/* Health Score */}
            {correlation && (
                <>
                    <Card className={correlation.deploy_health_score >= 70 ? 'bg-green-50 border-green-200' : correlation.deploy_health_score >= 50 ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'}>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>Deploy Health Score</span>
                                <span className={`text-4xl font-bold ${correlation.deploy_health_score >= 70 ? 'text-green-600' : correlation.deploy_health_score >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                                    {correlation.deploy_health_score.toFixed(0)}/100
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {correlation.rollback_recommended ? (
                                <div className="flex items-center gap-2 p-4 bg-red-100 border border-red-300 rounded-lg">
                                    <AlertTriangle className="w-6 h-6 text-red-600" />
                                    <div>
                                        <p className="font-semibold text-red-900">⚠️ Rollback Recommended</p>
                                        <p className="text-sm text-red-700">This deploy has significant negative impact.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 p-4 bg-green-100 border border-green-300 rounded-lg">
                                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                                    <div>
                                        <p className="font-semibold text-green-900">✅ Deploy is Healthy</p>
                                        <p className="text-sm text-green-700">No significant issues detected.</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Impact Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <ImpactCard
                            title="Performance Impact"
                            value={correlation.avg_performance_change_pct}
                            suffix="%"
                            icon={correlation.avg_performance_change_pct <= 0 ? <TrendingUp className="w-5 h-5 text-green-500" /> : <TrendingDown className="w-5 h-5 text-red-500" />}
                        />
                        <ImpactCard
                            title="Error Rate Change"
                            value={correlation.error_rate_change_pct}
                            suffix="%"
                            icon={correlation.error_rate_change_pct <= 0 ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
                        />
                        <ImpactCard
                            title="Crash Rate Change"
                            value={correlation.crash_rate_change_pct}
                            suffix="%"
                            icon={correlation.crash_rate_change_pct <= 0 ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
                        />
                    </div>

                    {/* Bug Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>🐛 Bug Detection</CardTitle>
                            <CardDescription>New bugs introduced by this deploy</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-red-50 rounded-lg">
                                    <p className="text-sm text-gray-600">New Bugs</p>
                                    <p className="text-3xl font-bold text-red-600">{correlation.new_bugs_count}</p>
                                </div>
                                <div className="p-4 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-gray-600">Affected Users</p>
                                    <p className="text-3xl font-bold text-blue-600">{correlation.affected_users}</p>
                                </div>
                            </div>

                            {correlation.new_bugs_count > 0 && (
                                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <p className="font-semibold text-yellow-900">⚠️ {correlation.new_bugs_count} new bug pattern(s) detected</p>
                                    <p className="text-sm text-yellow-700 mt-1">Review detected bug patterns in Product Intelligence tab.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recommendations */}
                    <Card className="bg-indigo-50 border-indigo-200">
                        <CardHeader>
                            <CardTitle className="text-indigo-900">💡 Recommendations</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm text-indigo-800">
                                {correlation.rollback_recommended && (
                                    <li className="flex items-start gap-2">
                                        <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                        <span>
                                            <strong>Critical:</strong> Consider rolling back this deploy immediately.
                                        </span>
                                    </li>
                                )}
                                {correlation.new_bugs_count > 0 && (
                                    <li className="flex items-start gap-2">
                                        <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                        <span>
                                            <strong>Action Required:</strong> Investigate and fix new bug patterns.
                                        </span>
                                    </li>
                                )}
                                {correlation.error_rate_change_pct > 10 && (
                                    <li className="flex items-start gap-2">
                                        <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                        <span>
                                            <strong>Error Spike:</strong> Error rate increased by {correlation.error_rate_change_pct.toFixed(1)}%.
                                        </span>
                                    </li>
                                )}
                                {correlation.deploy_health_score >= 80 && (
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-600" />
                                        <span>
                                            <strong>Excellent:</strong> Deploy is performing well. Continue monitoring.
                                        </span>
                                    </li>
                                )}
                            </ul>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}

function ImpactCard({ title, value, suffix, icon }: { title: string; value: number; suffix: string; icon: React.ReactNode }) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 flex items-center justify-between">
                    {title}
                    {icon}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className={`text-2xl font-bold ${value <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {value > 0 ? '+' : ''}{value.toFixed(1)}{suffix}
                </div>
            </CardContent>
        </Card>
    );
}
