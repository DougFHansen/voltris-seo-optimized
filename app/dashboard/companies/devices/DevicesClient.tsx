'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { createClient } from '@/utils/supabase/client';
import { 
  FiMonitor, FiCpu, FiHardDrive, FiActivity, 
  FiSearch, FiRefreshCw, FiLock, FiTrash2, FiZap,
  FiTerminal, FiShield, FiTrendingUp, FiCheckCircle, FiX
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useDashboard } from '@/app/context/DashboardContext';

export default function DevicesClient() {
    const { transparencyMode } = useDashboard();
    const [loading, setLoading] = useState(true);
    const [devices, setDevices] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const supabase = useMemo(() => createClient(), []);

    useEffect(() => {
        fetchDevices();
    }, []);

    const fetchDevices = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
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
        } catch (error) {
            console.error('Error fetching devices:', error);
        } finally {
            setLoading(false);
        }
    };

    const sendCommand = async (deviceId: string, type: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: link } = await supabase.from('company_users').select('company_id').eq('user_id', user.id).single();
        if (!link) return;

        const { error } = await supabase.from('remote_commands').insert({
            device_id: deviceId,
            company_id: link.company_id,
            command_type: type,
            status: 'pending',
            create_user_id: user.id
        });

        if (error) {
            toast.error("Erro de Protocolo: Falha na Transmissão");
        } else {
            toast.success(`Transmitindo ${type}...`, {
                icon: '🛰️',
                style: { background: 'rgba(10, 10, 15, 0.9)', color: '#fff', border: '1px solid rgba(49, 168, 255, 0.2)' }
            });
        }
    };

    const handleLock = (device: any) => {
        if (confirm(`Bloquear licença de ${device.hostname}?`)) {
            sendCommand(device.id, 'REMOTE_LOCK');
        }
    };

    const filteredDevices = devices.filter(d =>
        d.hostname?.toLowerCase().includes(search.toLowerCase()) ||
        d.machine_id?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                <div className="space-y-2">
                   <div className="flex items-center gap-3">
                     <div className="w-2 h-8 bg-gradient-to-b from-[#31A8FF] to-[#8B31FF] rounded-full"></div>
                     <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Nós <span className="text-[#31A8FF] not-italic">Gerenciados</span></h2>
                   </div>
                   <p className="text-white/40 font-bold text-xs uppercase tracking-[0.2em] pl-5 font-mono">Telemetria da frota e administração remota</p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative group flex-1 md:flex-none">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-[#31A8FF] transition-colors" />
                        <input
                            type="text"
                            placeholder="BUSCAR ID DO NÓ..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full md:w-64 pl-11 pr-6 py-4 rounded-2xl bg-[#0A0A10]/50 border border-white/5 text-white/40 group-hover:text-white font-black uppercase text-[10px] tracking-widest focus:outline-none focus:border-[#31A8FF] transition-all placeholder:text-white/5"
                        />
                    </div>
                    <button 
                      onClick={fetchDevices} 
                      className={`p-4 rounded-2xl bg-white/5 text-white hover:bg-white/10 transition-all border border-white/5 ${loading ? 'opacity-50' : ''}`}
                    >
                        <FiRefreshCw className={loading ? "animate-spin" : "w-5 h-5"} />
                    </button>
                </div>
            </div>

            {/* Device Stream */}
            <div className="grid grid-cols-1 gap-6">
                <AnimatePresence mode="popLayout">
                    {loading ? (
                        [1, 2, 3].map(i => (
                          <div key={i} className={`h-32 rounded-[2.5rem] border border-white/5 animate-pulse ${transparencyMode ? 'voltris-glass' : 'bg-[#0A0A10]'}`} />
                        ))
                    ) : filteredDevices.length === 0 ? (
                        <div className={`py-40 flex flex-col items-center justify-center text-center gap-10 rounded-[4rem] border border-white/5 ${transparencyMode ? 'voltris-glass' : 'bg-[#0A0A10]'}`}>
                            <FiMonitor className="w-20 h-20 text-white/5" />
                            <div className="space-y-4">
                              <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Nenhum Nó Ativo</h3>
                              <p className="text-white/20 font-bold text-[10px] uppercase tracking-[0.3em] max-w-sm">A busca não retornou IDs de gerenciamento associados a este link de empresa.</p>
                            </div>
                        </div>
                    ) : (
                        filteredDevices.map(device => (
                            <DeviceCard key={device.id} device={device} onCommand={sendCommand} onLock={handleLock} transparencyMode={transparencyMode} />
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function DeviceCard({ device, onCommand, onLock, transparencyMode }: any) {
    const isOnline = device.last_heartbeat && (new Date().getTime() - new Date(device.last_heartbeat).getTime()) < 1000 * 60 * 15; 

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`group p-8 rounded-[3rem] border transition-all duration-500 overflow-hidden relative flex flex-col xl:flex-row items-center gap-10
              ${transparencyMode ? 'voltris-glass' : 'bg-[#12121A] border-white/5 shadow-2xl'} 
              hover:border-[#31A8FF]/40
            `}
        >
            {/* Status Nucleus */}
            <div className="relative shrink-0">
                <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center text-3xl transition-transform group-hover:scale-110 group-hover:rotate-3 shadow-lg 
                  ${isOnline ? 'bg-[#31A8FF]/10 text-[#31A8FF] border border-[#31A8FF]/20 shadow-[#31A8FF]/5' : 'bg-slate-800/20 text-white/10 border border-white/5'}`}>
                    <FiMonitor />
                </div>
                {isOnline && (
                  <div className="absolute -inset-2 bg-[#31A8FF]/20 blur-xl rounded-full animate-pulse-slow"></div>
                )}
                <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 ${transparencyMode ? 'border-[#0a0a12]' : 'border-[#12121A]'} ${isOnline ? 'bg-[#00FF88] shadow-[0_0_10px_#00FF88]' : 'bg-slate-600'}`} />
            </div>

            {/* Information Hub */}
            <div className="flex-1 text-center xl:text-left min-w-0 w-full space-y-4">
                <div className="space-y-1">
                   <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter truncate leading-none">{device.hostname || "NÓ NÃO IDENTIFICADO"}</h3>
                   <div className="flex items-center justify-center xl:justify-start gap-4">
                      <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] font-mono">HASH: <span className="text-[#31A8FF]">{device.machine_id?.slice(0, 16)}</span></span>
                      <div className={`px-3 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${isOnline ? 'bg-[#00FF88]/10 text-[#00FF88] border-[#00FF88]/20' : 'bg-white/5 text-white/20 border-white/10'}`}>
                         {isOnline ? 'Link Ativo' : 'Dormitante'}
                      </div>
                   </div>
                </div>

                <div className="flex flex-wrap items-center justify-center xl:justify-start gap-6 pt-2">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5 text-[10px] font-black text-white/60 uppercase tracking-widest">
                       <FiCpu className="text-[#31A8FF] w-4 h-4" />
                       <span>{device.cpu_model?.split(' ')[0] || 'CPU'}</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5 text-[10px] font-black text-white/60 uppercase tracking-widest">
                       <FiActivity className="text-[#8B31FF] w-4 h-4" />
                       <span>{device.ram_total_gb}GB RAM</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5 text-[10px] font-black text-white/60 uppercase tracking-widest">
                       <FiShield className="text-[#FF4B6B] w-4 h-4" />
                       <span>{device.os_version?.slice(0, 12)}</span>
                    </div>
                </div>
            </div>

            {/* Tactical Sensors (Mockup) */}
            <div className="hidden 2xl:flex gap-10 px-10 border-x border-white/5">
                <div className="space-y-2 text-center w-20">
                    <div className="text-2xl font-black text-white italic leading-none">12%</div>
                    <div className="text-[9px] font-black text-[#31A8FF] uppercase tracking-widest">Carga</div>
                </div>
                <div className="space-y-2 text-center w-20">
                    <div className="text-2xl font-black text-white italic leading-none">45%</div>
                    <div className="text-[9px] font-black text-[#8B31FF] uppercase tracking-widest">Uso</div>
                </div>
            </div>

            {/* Remote Command Terminal */}
            <div className="flex items-center gap-4 w-full xl:w-auto mt-4 xl:mt-0">
                <button
                    onClick={() => onCommand(device.id, 'OPTIMIZE_RAM')}
                    className="flex-1 xl:flex-none px-6 py-4 rounded-2xl bg-white text-black font-black uppercase italic tracking-widest text-[10px] hover:scale-105 transition-all shadow-3xl flex items-center justify-center gap-3"
                >
                    <FiZap className="w-4 h-4" />
                    <span>Otimizar Nó</span>
                </button>
                <button
                    onClick={() => onLock(device)}
                    title="Bloquear Transmissão"
                    className="p-4 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/5 flex items-center justify-center"
                >
                    <FiLock className="w-5 h-5" />
                </button>
                <button
                    title="Terminar Uplink"
                    className="p-4 rounded-2xl bg-white/5 text-white/20 border border-white/5 hover:bg-white/10 hover:text-white transition-all flex items-center justify-center"
                >
                    <FiTrash2 className="w-5 h-5" />
                </button>
            </div>
            
            {/* Heartbeat Pulse */}
            <div className="absolute right-10 top-6 flex items-center gap-2">
               <span className="text-[8px] font-black text-white/10 uppercase tracking-[0.2em] font-mono">Último Pulso </span>
               <span className="text-[9px] font-bold text-white/30 font-mono italic">{new Date(device.last_heartbeat).toLocaleTimeString()}</span>
            </div>
        </motion.div>
    )
}
