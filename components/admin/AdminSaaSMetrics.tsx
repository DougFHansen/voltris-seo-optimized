'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Activity,
    Zap,
    Heart,
    BarChart3,
    ShieldCheck,
    AlertTriangle,
    Server,
    Cpu,
    MousePointer2
} from 'lucide-react';

interface SaaSStats {
    health_average: number;
    total_exceptions_24h: number;
    optimizations_completed: number;
    avg_ram_freed_mb: number;
    popular_features: { name: string; count: number }[];
    health_distribution: { label: string; count: number; color: string }[];
}

export default function AdminSaaSMetrics() {
    const [stats, setStats] = useState<SaaSStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/admin/telemetry/stats');
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        } catch (error) {
            console.error('Failed to fetch stats', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map(i => (
                <Card key={i} className="border-stone-800 bg-stone-900/50 animate-pulse h-32"></Card>
            ))}
        </div>;
    }

    return (
        <div className="space-y-6">
            {/* Top Metrics Row */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-stone-800 bg-stone-900/40">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-stone-400">Score de Saúde Global</CardTitle>
                        <Heart className="h-4 w-4 text-emerald-500 fill-emerald-500/20" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{stats?.health_average || 0}%</div>
                        <p className="text-[10px] text-stone-500 mt-1">Média ponderada de todos os dispositivos ativos</p>
                    </CardContent>
                </Card>

                <Card className="border-stone-800 bg-stone-900/40">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-stone-400">Exceções (24h)</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{stats?.total_exceptions_24h || 0}</div>
                        <p className="text-[10px] text-stone-500 mt-1">Falhas reportadas pelo agente C#</p>
                    </CardContent>
                </Card>

                <Card className="border-stone-800 bg-stone-900/40">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-stone-400">Otimizações Efetuadas</CardTitle>
                        <Zap className="h-4 w-4 text-yellow-500 fill-yellow-500/20" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{stats?.optimizations_completed || 0}</div>
                        <p className="text-[10px] text-stone-500 mt-1">Total acumulado de ações aplicadas</p>
                    </CardContent>
                </Card>

                <Card className="border-stone-800 bg-stone-900/40">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-stone-400">Eficiência de RAM</CardTitle>
                        <BarChart3 className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{stats?.avg_ram_freed_mb || 0} MB</div>
                        <p className="text-[10px] text-stone-500 mt-1">Média de memória liberada por sessão</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Health Distribution */}
                <Card className="border-stone-800 bg-stone-950/40">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-emerald-500" />
                            Distribuição de Saúde (Fleet)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats?.health_distribution.map((item) => (
                                <div key={item.label} className="space-y-1.5">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-stone-400 font-medium">{item.label}</span>
                                        <span className="text-stone-300">{item.count} máquinas</span>
                                    </div>
                                    <div className="h-2 w-full bg-stone-800 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${item.color} transition-all duration-1000`}
                                            style={{ width: `${(item.count / (stats.health_distribution.reduce((a, b) => a + b.count, 0) || 1)) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Popular Features */}
                <Card className="border-stone-800 bg-stone-950/40">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <MousePointer2 className="h-5 w-5 text-purple-500" />
                            Funcionalidades Mais Usadas
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {stats?.popular_features.map((feature, i) => (
                                <div key={feature.name} className="flex items-center justify-between p-2 rounded-lg bg-stone-900/50 border border-stone-800/50">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-mono text-stone-600 w-4">0{i + 1}</span>
                                        <span className="text-sm text-stone-300 font-medium">{feature.name}</span>
                                    </div>
                                    <Badge variant="secondary" className="bg-stone-800 text-stone-400">
                                        {feature.count}x
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
