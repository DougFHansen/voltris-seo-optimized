'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { FiMonitor, FiCpu, FiHardDrive, FiActivity, FiSearch, FiRefreshCw, FiLock, FiTrash2, FiZap } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function DevicesPage() {
    const [loading, setLoading] = useState(true);
    const [devices, setDevices] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const supabase = createClient();

    useEffect(() => {
        fetchDevices();
    }, []);

    const fetchDevices = async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            // Simple join to get company ID then devices
            // Ideally use RLS, but for client-side we first find the company
            const { data: link } = await supabase.from('company_users').select('company_id').eq('user_id', user.id).single();
            if (link) {
                const { data } = await supabase
                    .from('devices')
                    .select('*')
                    .eq('company_id', link.company_id)
                    .order('last_heartbeat', { ascending: false });
                setDevices(data || []);
            }
        }
        setLoading(false);
    };

    const sendCommand = async (deviceId: string, type: string) => {
        // 1. Get User/Company (Context)
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // 2. Fetch company_id (cached or refetched)
        const { data: link } = await supabase.from('company_users').select('company_id').eq('user_id', user.id).single();
        if (!link) return;

        // 3. Insert Command
        const { error } = await supabase.from('remote_commands').insert({
            device_id: deviceId,
            company_id: link.company_id,
            command_type: type,
            status: 'pending',
            create_user_id: user.id
        });

        if (error) {
            toast.error("Falha ao enviar comando");
        } else {
            toast.success(`Comando ${type} enviado!`);
        }
    };

    const handleLock = (device: any) => {
        if (confirm(`Bloquear licença de ${device.hostname}?`)) {
            sendCommand(device.id, 'REMOTE_LOCK');
            // Update local state optimistic (or refetch)
        }
    };

    const filteredDevices = devices.filter(d =>
        d.hostname?.toLowerCase().includes(search.toLowerCase()) ||
        d.machine_id?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Dispositivos Gerenciados</h1>
                    <p className="text-slate-400">Gerencie sua frota de computadores remotamente</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Buscar PC..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full bg-[#121218] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#31A8FF]"
                        />
                    </div>
                    <button onClick={fetchDevices} className="bg-white/5 p-3 rounded-xl text-white hover:bg-white/10 transition">
                        <FiRefreshCw className={loading ? "animate-spin" : ""} />
                    </button>
                </div>
            </div>

            <div className="grid gap-4">
                <AnimatePresence>
                    {loading ? (
                        // Skeleton
                        [1, 2, 3].map(i => <div key={i} className="h-24 bg-white/5 rounded-2xl animate-pulse" />)
                    ) : filteredDevices.length === 0 ? (
                        <div className="text-center py-20 text-slate-500">
                            <FiMonitor className="w-12 h-12 mx-auto mb-4 opacity-20" />
                            <p>Nenhum dispositivo encontrado.</p>
                        </div>
                    ) : (
                        filteredDevices.map(device => (
                            <DeviceCard key={device.id} device={device} onCommand={sendCommand} onLock={handleLock} />
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function DeviceCard({ device, onCommand, onLock }: any) {
    const isOnline = device.last_heartbeat && (new Date().getTime() - new Date(device.last_heartbeat).getTime()) < 1000 * 60 * 15; // 15 min threshold

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#121218]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5 flex flex-col md:flex-row items-center gap-6 group hover:border-white/10 transition-colors"
        >
            {/* Icon / Status */}
            <div className="relative">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${isOnline ? 'bg-[#31A8FF]/10 text-[#31A8FF]' : 'bg-slate-800/50 text-slate-500'}`}>
                    <FiMonitor />
                </div>
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#121218] ${isOnline ? 'bg-[#00FF94]' : 'bg-slate-500'}`} />
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left min-w-0 w-full">
                <h3 className="text-lg font-bold text-white truncate">{device.hostname || "PC Desconhecido"}</h3>
                <p className="text-xs text-slate-500 font-mono mb-2">{device.machine_id}</p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><FiCpu /> {device.cpu_model?.split(' ')[0] || 'CPU'}</span>
                    <span className="flex items-center gap-1"><FiActivity /> {device.ram_total_gb} GB RAM</span>
                    <span className="flex items-center gap-1"><FiHardDrive /> {device.os_version}</span>
                </div>
            </div>

            {/* Metrics (Mini) */}
            <div className="hidden lg:flex gap-4 px-4 border-l border-white/5">
                <div className="text-center w-16">
                    <div className="text-lg font-bold text-white">12%</div>
                    <div className="text-[10px] text-slate-500 uppercase">CPU</div>
                </div>
                <div className="text-center w-16">
                    <div className="text-lg font-bold text-white">45%</div>
                    <div className="text-[10px] text-slate-500 uppercase">RAM</div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 w-full md:w-auto mt-4 md:mt-0">
                <button
                    onClick={() => onCommand(device.id, 'OPTIMIZE_RAM')}
                    title="Otimizar RAM"
                    className="flex-1 md:flex-none p-3 rounded-xl bg-[#31A8FF]/10 text-[#31A8FF] hover:bg-[#31A8FF] hover:text-white transition-all font-medium flex justify-center items-center gap-2"
                >
                    <FiZap /> <span className="md:hidden">Otimizar</span>
                </button>
                <button
                    onClick={() => onLock(device)}
                    title="Bloquear Acesso"
                    className="p-3 rounded-xl bg-[#FF4B6B]/10 text-[#FF4B6B] hover:bg-[#FF4B6B] hover:text-white transition-all"
                >
                    <FiLock />
                </button>
                <button
                    title="Remover"
                    className="p-3 rounded-xl bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-all"
                >
                    <FiTrash2 />
                </button>
            </div>
        </motion.div>
    )
}
