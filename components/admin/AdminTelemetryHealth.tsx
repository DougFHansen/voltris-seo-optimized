'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, AlertTriangle, CheckCircle2, XCircle, Clock } from 'lucide-react';

interface HealthMetric {
    metric_timestamp: string;
    events_received: number;
    events_validated: number;
    events_rejected: number;
    events_stored: number;
    rejection_reasons: Record<string, number>;
    avg_ingestion_latency_ms: number;
    gateway_status: string;
    database_status: string;
}

export default function AdminTelemetryHealth() {
    const [loading, setLoading] = useState(true);
    const [metrics, setMetrics] = useState<HealthMetric[]>([]);
    const [latestMetric, setLatestMetric] = useState<HealthMetric | null>(null);

    useEffect(() => {
        fetchHealthMetrics();
        const interval = setInterval(fetchHealthMetrics, 30000); // Refresh every 30s
        return () => clearInterval(interval);
    }, []);

    const fetchHealthMetrics = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/admin/telemetry/health');
            const data = await res.json();

            if (data.success) {
                setMetrics(data.metrics || []);
                if (data.metrics && data.metrics.length > 0) {
                    setLatestMetric(data.metrics[0]);
                }
            }
        } catch (error) {
            console.error('Failed to fetch health metrics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !latestMetric) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading health metrics...</p>
                </div>
            </div>
        );
    }

    const validationRate = latestMetric
        ? (latestMetric.events_validated / latestMetric.events_received) * 100
        : 0;

    const rejectionRate = latestMetric
        ? (latestMetric.events_rejected / latestMetric.events_received) * 100
        : 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold">🧬 Telemetry Health</h2>
                    <p className="text-gray-500 mt-1">System health monitoring and data quality metrics</p>
                </div>
                <button
                    onClick={fetchHealthMetrics}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                    Refresh
                </button>
            </div>

            {/* Status Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Gateway Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <StatusBadge status={latestMetric?.gateway_status || 'unknown'} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Database Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <StatusBadge status={latestMetric?.database_status || 'unknown'} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Validation Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${validationRate >= 95 ? 'text-green-600' : validationRate >= 80 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {validationRate.toFixed(1)}%
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Avg Latency</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">
                            {latestMetric?.avg_ingestion_latency_ms || 0}ms
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Current Health */}
            {latestMetric && (
                <Card>
                    <CardHeader>
                        <CardTitle>📊 Current Health Snapshot</CardTitle>
                        <CardDescription>
                            Last updated: {new Date(latestMetric.metric_timestamp).toLocaleString()}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <MetricCard
                                label="Events Received"
                                value={latestMetric.events_received}
                                icon={<Activity className="w-5 h-5 text-blue-500" />}
                            />
                            <MetricCard
                                label="Events Validated"
                                value={latestMetric.events_validated}
                                icon={<CheckCircle2 className="w-5 h-5 text-green-500" />}
                            />
                            <MetricCard
                                label="Events Rejected"
                                value={latestMetric.events_rejected}
                                icon={<XCircle className="w-5 h-5 text-red-500" />}
                            />
                            <MetricCard
                                label="Events Stored"
                                value={latestMetric.events_stored}
                                icon={<CheckCircle2 className="w-5 h-5 text-green-500" />}
                            />
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Rejection Reasons */}
            {latestMetric && latestMetric.rejection_reasons && Object.keys(latestMetric.rejection_reasons).length > 0 && (
                <Card className="border-yellow-200 bg-yellow-50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-yellow-900">
                            <AlertTriangle className="w-5 h-5" />
                            Rejection Reasons
                        </CardTitle>
                        <CardDescription className="text-yellow-700">
                            Events rejected by validation
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {Object.entries(latestMetric.rejection_reasons).map(([reason, count]) => (
                                <div
                                    key={reason}
                                    className="flex justify-between items-center p-3 bg-white rounded-lg"
                                >
                                    <span className="font-medium text-gray-900">{reason}</span>
                                    <Badge variant="destructive">{count} events</Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Health Insights */}
            <Card className="bg-purple-50 border-purple-200">
                <CardHeader>
                    <CardTitle className="text-purple-900">💡 Health Insights</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2 text-sm text-purple-800">
                        {validationRate < 95 && (
                            <li className="flex items-start gap-2">
                                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <span>
                                    <strong>Warning:</strong> Validation rate below 95%. Check event schemas for mismatches.
                                </span>
                            </li>
                        )}
                        {latestMetric && latestMetric.avg_ingestion_latency_ms > 200 && (
                            <li className="flex items-start gap-2">
                                <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <span>
                                    <strong>Performance:</strong> Ingestion latency above 200ms. Consider scaling gateway.
                                </span>
                            </li>
                        )}
                        {latestMetric && rejectionRate > 10 && (
                            <li className="flex items-start gap-2">
                                <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <span>
                                    <strong>Data Quality:</strong> High rejection rate ({rejectionRate.toFixed(1)}%). Review client event generation.
                                </span>
                            </li>
                        )}
                        {validationRate >= 95 && latestMetric && latestMetric.avg_ingestion_latency_ms <= 200 && rejectionRate <= 10 && (
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-600" />
                                <span>
                                    <strong>All systems operational!</strong> Telemetry is healthy.
                                </span>
                            </li>
                        )}
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const config = {
        healthy: { color: 'bg-green-100 text-green-800', icon: <CheckCircle2 className="w-4 h-4" />, text: 'Healthy' },
        degraded: { color: 'bg-yellow-100 text-yellow-800', icon: <AlertTriangle className="w-4 h-4" />, text: 'Degraded' },
        down: { color: 'bg-red-100 text-red-800', icon: <XCircle className="w-4 h-4" />, text: 'Down' },
        unknown: { color: 'bg-gray-100 text-gray-800', icon: <Activity className="w-4 h-4" />, text: 'Unknown' },
    };

    const { color, icon, text } = config[status as keyof typeof config] || config.unknown;

    return (
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${color}`}>
            {icon}
            <span className="font-semibold">{text}</span>
        </div>
    );
}

function MetricCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
    return (
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            {icon}
            <div>
                <p className="text-xs text-gray-500">{label}</p>
                <p className="text-xl font-bold">{value.toLocaleString()}</p>
            </div>
        </div>
    );
}
