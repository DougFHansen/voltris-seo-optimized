'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { FiMonitor, FiAlertTriangle, FiCpu, FiTrendingUp } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function CompaniesPage() {
    const [loading, setLoading] = useState(true);
    const [company, setCompany] = useState<any>(null);
    const [stats, setStats] = useState({ devices: 0, alerts: 0, avgHealth: 100 });
    const [recentAlerts, setRecentAlerts] = useState<any[]>([]);
    const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
    const [buyQuantity, setBuyQuantity] = useState(5);
    const supabase = createClient();

    useEffect(() => {
        async function loadData() {
            // 1. Get User
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // 2. Get Company (Join via company_users)
            const { data: link } = await supabase
                .from('company_users')
                .select('*, companies(*)')
                .eq('user_id', user.id)
                .single();

            if (link && link.companies) {
                setCompany(link.companies);

                // 3. Get Stats
                const { count: devCount } = await supabase
                    .from('devices')
                    .select('*', { count: 'exact', head: true })
                    .eq('company_id', link.companies.id);

                const { count: alertCount } = await supabase
                    .from('device_alerts')
                    .select('*', { count: 'exact', head: true })
                    .eq('company_id', link.companies.id)
                    .eq('is_resolved', false);

                setStats({
                    devices: devCount || 0,
                    alerts: alertCount || 0,
                    avgHealth: 98, // Mock calculation for now
                });

                // 4. Get Recent Alerts
                const { data: alerts } = await supabase
                    .from('device_alerts')
                    .select('*, devices(hostname)')
                    .eq('company_id', link.companies.id)
                    .eq('is_resolved', false)
                    .order('created_at', { ascending: false })
                    .limit(5);

                setRecentAlerts(alerts || []);
            }
            setLoading(false);
        }
        loadData();
    }, []);

    const handleCreateCompany = async () => {
        const name = window.prompt("Qual o nome da sua empresa/organização?");
        if (!name) return;

        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                toast.error("Você precisa estar logado.");
                return;
            }

            // USO DE RPC (Stored Procedure) para evitar bloqueio de RLS
            const { error } = await supabase.rpc('create_new_organization', {
                org_name: name
            });

            if (error) throw error;

            toast.success("Organização criada com sucesso!");
            window.location.reload();

        } catch (err: any) {
            toast.error("Erro ao criar organização: " + err.message);
            setLoading(false);
        }
    };

    const handleBuyLicenses = async () => {
        if (!company) return;
        try {
            const toastId = toast.loading("Processando pagamento...");

            // Simular delay de API de pagamento
            await new Promise(r => setTimeout(r, 1500));

            // Atualizar no banco
            const newMax = (company.max_devices || 0) + buyQuantity;

            const { error } = await supabase
                .from('companies')
                .update({ max_devices: newMax, plan_type: 'pro' })
                .eq('id', company.id);

            if (error) throw error;

            toast.dismiss(toastId);
            toast.success(`${buyQuantity} Licenças adicionadas com sucesso!`);
            setIsBuyModalOpen(false);
            window.location.reload();

        } catch (err: any) {
            toast.error("Falha na compra: " + err.message);
        }
    };

    const handleOptimizeAll = async () => {
        if (!company) return;
        if (!confirm("Isso enviará um comando de otimização para TODOS os PCs. Continuar?")) return;

        try {
            const toastId = toast.loading("Enviando comandos...");

            // 1. Get all devices
            const { data: devices } = await supabase
                .from('devices')
                .select('id')
                .eq('company_id', company.id);

            if (!devices?.length) {
                toast.error("Nenhum dispositivo encontrado.");
                return;
            }

            // 2. Insert commands for each
            const { data: { user } } = await supabase.auth.getUser();
            const commands = devices.map(d => ({
                device_id: d.id,
                company_id: company.id,
                command_type: 'OPTIMIZE_RAM',
                status: 'pending',
                create_user_id: user?.id
            }));

            const { error } = await supabase.from('remote_commands').insert(commands);
            if (error) throw error;

            toast.dismiss(toastId);
            toast.success(`${devices.length} PCs receberam a ordem de otimização.`);

        } catch (err: any) {
            toast.error("Erro ao enviar comandos: " + err.message);
        }
    };

    if (loading) return <div className="text-white p-10">Carregando dados corporativos...</div>;

    if (!company) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
                    <FiMonitor className="w-8 h-8 text-slate-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Nenhuma Empresa Vinculada</h2>
                <p className="text-slate-400 max-w-md mb-8">
                    Sua conta não está associada a nenhuma organização empresarial. Entre em contato com seu administrador.
                </p>
                <button
                    onClick={handleCreateCompany}
                    className="bg-[#31A8FF] text-black font-bold px-6 py-3 rounded-xl hover:bg-[#31A8FF]/90 transition"
                >
                    Criar Nova Organização
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8 relative">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">{company.name}</h1>
                    <p className="text-slate-400">
                        Painel Corporativo • {company.plan_type.toUpperCase()} •
                        <span className="text-[#00FF94] ml-2">{stats.devices} / {company.max_devices} Licenças em Uso</span>
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link href="/dashboard/companies/devices" className="bg-white/5 border border-white/10 text-white px-5 py-2.5 rounded-xl hover:bg-white/10 transition flex items-center gap-2">
                        <FiMonitor /> Gerenciar PCs
                    </Link>
                    <button
                        onClick={() => setIsBuyModalOpen(true)}
                        className="bg-[#8B31FF] text-white px-5 py-2.5 rounded-xl hover:bg-[#8B31FF]/90 transition shadow-[0_0_20px_#8B31FF55]"
                    >
                        + Adicionar Licenças
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard
                    title="Total de PCs"
                    value={stats.devices.toString()}
                    icon={FiMonitor}
                    color="#31A8FF"
                    subtext={`${company.max_devices - stats.devices} licenças livres`}
                />
                <StatCard
                    title="Alertas Ativos"
                    value={stats.alerts.toString()}
                    icon={FiAlertTriangle}
                    color="#FF4B6B"
                    subtext="Requer atenção"
                    alert={stats.alerts > 0}
                />
                <StatCard
                    title="Saúde da Frota"
                    value={`${stats.avgHealth}%`}
                    icon={FiTrendingUp}
                    color="#00FF94"
                    subtext="Performance global"
                />
                <StatCard
                    title="CPU Média"
                    value="12%"
                    icon={FiCpu}
                    color="#8B31FF"
                    subtext="Consumo estável"
                />
            </div>

            {/* Main Content Areas */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Alerts List */}
                <div className="lg:col-span-2 bg-[#121218]/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6">
                    <h3 className="text-lg font-bold text-white mb-6">Alertas Recentes</h3>
                    {recentAlerts.length === 0 ? (
                        <div className="text-center py-10 text-slate-500">
                            <FiTrendingUp className="w-10 h-10 mx-auto mb-3 opacity-20" />
                            <p>Tudo certo! Nenhum alerta não resolvido.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {recentAlerts.map(alert => (
                                <AlertItem
                                    key={alert.id}
                                    device={alert.devices?.hostname || "Unknown PC"}
                                    msg={alert.message}
                                    time={new Date(alert.created_at).toLocaleTimeString()}
                                    level={alert.level.toLowerCase()}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="bg-[#121218]/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6">
                    <h3 className="text-lg font-bold text-white mb-6">Ações Rápidas</h3>
                    <div className="space-y-3">
                        <button
                            onClick={handleOptimizeAll}
                            className="w-full text-left p-4 bg-white/5 rounded-xl hover:bg-white/10 transition flex items-center gap-3 text-slate-300 hover:text-white group"
                        >
                            <div className="w-8 h-8 rounded-lg bg-[#31A8FF]/20 flex items-center justify-center text-[#31A8FF] group-hover:scale-110 transition">⚡</div>
                            <span>Otimizar Todas as Máquinas</span>
                        </button>
                        <button className="w-full text-left p-4 bg-white/5 rounded-xl hover:bg-white/10 transition flex items-center gap-3 text-slate-300 hover:text-white group">
                            <div className="w-8 h-8 rounded-lg bg-[#00FF94]/20 flex items-center justify-center text-[#00FF94] group-hover:scale-110 transition">📄</div>
                            <span>Gerar Relatório Mensal</span>
                        </button>
                        <Link href="/dashboard/companies/devices" className="w-full text-left p-4 bg-white/5 rounded-xl hover:bg-white/10 transition flex items-center gap-3 text-slate-300 hover:text-white group">
                            <div className="w-8 h-8 rounded-lg bg-[#FF4B6B]/20 flex items-center justify-center text-[#FF4B6B] group-hover:scale-110 transition">🔒</div>
                            <span>Gerenciar Bloqueios</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* BUY LICENSES MODAL */}
            {isBuyModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-[#121218] border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#8B31FF] to-[#31A8FF]"></div>
                        <h2 className="text-2xl font-bold text-white mb-2">Adicionar Licenças</h2>
                        <p className="text-slate-400 mb-6">Expanda sua frota de máquinas gerenciadas.</p>

                        <div className="mb-8">
                            <label className="text-sm text-slate-400 mb-2 block">Quantidade</label>
                            <div className="flex gap-4">
                                {[5, 10, 50, 100].map(qty => (
                                    <button
                                        key={qty}
                                        onClick={() => setBuyQuantity(qty)}
                                        className={`flex-1 py-3 rounded-xl border font-medium transition ${buyQuantity === qty ? 'bg-[#8B31FF] border-[#8B31FF] text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
                                    >
                                        +{qty}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl mb-6">
                            <span className="text-slate-300">Total a pagar</span>
                            <span className="text-xl font-bold text-white">R$ {(buyQuantity * 29.90).toFixed(2)}<span className="text-xs text-slate-500 font-normal">/mês</span></span>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsBuyModalOpen(false)}
                                className="flex-1 py-3 rounded-xl bg-white/5 text-slate-300 hover:bg-white/10 transition"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleBuyLicenses}
                                className="flex-1 py-3 rounded-xl bg-[#8B31FF] text-white font-bold hover:bg-[#8B31FF]/90 transition shadow-lg shadow-[#8B31FF]/20"
                            >
                                Confirmar e Ativar
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}

function StatCard({ title, value, icon: Icon, color, subtext, alert = false }: any) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className={`bg-[#121218]/50 backdrop-blur-xl border ${alert ? 'border-[#FF4B6B]/50' : 'border-white/5'} rounded-3xl p-6 relative overflow-hidden`}
        >
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-xl bg-white/5 text-white">
                        <Icon className="w-6 h-6" style={{ color }} />
                    </div>
                    {alert && <span className="w-3 h-3 rounded-full bg-[#FF4B6B] animate-pulse" />}
                </div>
                <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
                <p className="text-slate-400 text-sm font-medium mb-4">{title}</p>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="w-full h-[1px] bg-white/10"></span>
                    <span className="whitespace-nowrap">{subtext}</span>
                </div>
            </div>
            {/* Glow Effect */}
            <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-[50px] opacity-20" style={{ background: color }}></div>
        </motion.div>
    )
}

function AlertItem({ device, msg, time, level = 'warning' }: any) {
    const color = level === 'critical' ? 'text-[#FF4B6B]' : 'text-[#FFD02B]';
    const bg = level === 'critical' ? 'bg-[#FF4B6B]/10' : 'bg-[#FFD02B]/10';

    return (
        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${bg} ${color}`}>
                <FiAlertTriangle />
            </div>
            <div className="flex-1 min-w-0">
                <h4 className="text-white font-medium truncate">{msg}</h4>
                <p className="text-xs text-slate-400">Em: <span className="text-slate-300">{device}</span></p>
            </div>
            <span className="text-xs text-slate-500 whitespace-nowrap">{time}</span>
        </div>
    )
}
