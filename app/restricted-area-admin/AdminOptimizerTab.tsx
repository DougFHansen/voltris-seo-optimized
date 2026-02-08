'use client';

import AdminLiveMonitor from '@/components/admin/AdminLiveMonitor';

export default function AdminOptimizerTab() {
    return (
        <div className="space-y-8">
            <div className="bg-[#121218] rounded-3xl p-6 border border-white/5">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">Monitoramento de Sessões e Performance</h2>
                    <p className="text-slate-400">Acompanhamento em tempo real de usuários ativos e performance do Voltris Optimizer.</p>
                </div>

                {/* Novo Monitor LIVE */}
                <AdminLiveMonitor />
            </div>
        </div>
    );
}
