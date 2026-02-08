'use client';

import { useState } from 'react';
import AdminLiveMonitor from '@/components/admin/AdminLiveMonitor';
import AdminTelemetryLogs from '@/components/admin/AdminTelemetryLogs';
import AdminSaaSMetrics from '@/components/admin/AdminSaaSMetrics';
import { Activity, LayoutDashboard, Terminal } from 'lucide-react';

type SubTab = 'live' | 'metrics' | 'logs';

export default function AdminOptimizerTab() {
    const [subTab, setSubTab] = useState<SubTab>('live');

    return (
        <div className="space-y-6">
            {/* Professional Sub-navigation */}
            <div className="flex items-center gap-1 p-1 bg-stone-900/80 border border-stone-800 rounded-xl w-fit">
                <button
                    onClick={() => setSubTab('live')}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${subTab === 'live'
                            ? 'bg-stone-800 text-white shadow-sm'
                            : 'text-stone-500 hover:text-stone-300'
                        }`}
                >
                    <Activity className={`h-4 w-4 ${subTab === 'live' ? 'text-indigo-400' : ''}`} />
                    Dispositivos Ao Vivo
                </button>
                <button
                    onClick={() => setSubTab('metrics')}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${subTab === 'metrics'
                            ? 'bg-stone-800 text-white shadow-sm'
                            : 'text-stone-500 hover:text-stone-300'
                        }`}
                >
                    <LayoutDashboard className={`h-4 w-4 ${subTab === 'metrics' ? 'text-emerald-400' : ''}`} />
                    Métricas SaaS
                </button>
                <button
                    onClick={() => setSubTab('logs')}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${subTab === 'logs'
                            ? 'bg-stone-800 text-white shadow-sm'
                            : 'text-stone-500 hover:text-stone-300'
                        }`}
                >
                    <Terminal className={`h-4 w-4 ${subTab === 'logs' ? 'text-blue-400' : ''}`} />
                    Logs de Telemetria
                </button>
            </div>

            {/* Content Rendering */}
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                {subTab === 'live' && (
                    <div className="bg-[#121218] rounded-3xl p-6 border border-white/5">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-white mb-2">Monitoramento de Sessões</h2>
                            <p className="text-slate-400 text-sm">Acompanhamento em tempo real de usuários ativos e performance.</p>
                        </div>
                        <AdminLiveMonitor />
                    </div>
                )}

                {subTab === 'metrics' && (
                    <AdminSaaSMetrics />
                )}

                {subTab === 'logs' && (
                    <AdminTelemetryLogs />
                )}
            </div>
        </div>
    );
}
