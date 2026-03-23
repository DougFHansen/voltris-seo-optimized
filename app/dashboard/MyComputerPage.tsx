'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/utils/supabase/client';
import { 
  FiMonitor, FiCpu, FiHardDrive, FiActivity, FiZap, 
  FiPower, FiRefreshCw, FiAlertCircle, FiCheck, FiX, 
  FiShield, FiDownload, FiHash, FiUser, FiInfo, FiTrash2,
  FiTerminal, FiSettings, FiPlus
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { useDashboard } from '@/app/context/DashboardContext';
import Link from 'next/link';

interface DeviceData {
  id: string;
  pc_name: string;
  os: string;
  cpu: string;
  gpu: string;
  ram: string;
  installation_date: string;
  last_active: string;
  last_heartbeat: string;
  is_online: boolean;
  is_optimized: boolean;
  is_licensed: boolean;
  license_key: string;
}

// Action Button Component for Remote Commands
const RemoteAction = ({ icon: Icon, label, color, onClick, loading }: any) => (
  <motion.button
    whileHover={{ scale: 1.05, y: -2 }}
    whileTap={{ scale: 0.95 }}
    disabled={loading}
    onClick={onClick}
    className={`
      flex flex-col items-center justify-center gap-3 p-4 rounded-3xl border transition-all duration-300 group
      ${color === 'blue' ? 'bg-[#31A8FF]/10 border-[#31A8FF]/20 text-[#31A8FF] hover:bg-[#31A8FF] hover:text-white' : ''}
      ${color === 'red' ? 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white' : ''}
      ${color === 'amber' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500 hover:text-white' : ''}
      ${color === 'emerald' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white' : ''}
      ${loading ? 'opacity-50 cursor-not-allowed' : ''}
    `}
  >
    <div className="p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:border-transparent transition-colors">
      <Icon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
    </div>
    <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
  </motion.button>
);

export default function MyComputerPage({ userId }: { userId: string }) {
  const { transparencyMode } = useDashboard();
  const [devices, setDevices] = useState<DeviceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [commandLoading, setCommandLoading] = useState<string | null>(null);
  const [showUnlinkModal, setShowUnlinkModal] = useState<string | null>(null);
  const supabase = useMemo(() => createClient(), []);

  const fetchDevices = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('installations')
        .select('*')
        .eq('user_id', userId)
        .order('last_heartbeat', { ascending: false });

      if (error) throw error;
      
      // Calculate online status based on heartbeat (e.g., last 5 minutes)
      const now = new Date();
      const processedData = (data || []).map(device => {
        const lastHeartbeat = new Date(device.last_heartbeat || device.last_active);
        const diffMinutes = (now.getTime() - lastHeartbeat.getTime()) / (1000 * 60);
        return {
          ...device,
          is_online: diffMinutes < 5
        };
      });

      setDevices(processedData);
    } catch (error) {
      console.error('Error fetching devices:', error);
    } finally {
      setLoading(false);
    }
  }, [userId, supabase]);

  useEffect(() => {
    fetchDevices();
    const interval = setInterval(fetchDevices, 30000);
    
    // Real-time updates
    const channel = supabase
      .channel('public:installations')
      .on('postgres_changes', { event: '*', table: 'installations', filter: `user_id=eq.${userId}` }, fetchDevices)
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [fetchDevices, supabase, userId]);

  const handleRemoteCommand = async (deviceId: string, command: string) => {
    setCommandLoading(`${deviceId}-${command}`);
    
    try {
      const { error } = await supabase.from('commands').insert({
        installation_id: deviceId,
        command_type: command,
        status: 'pending'
      });

      if (error) throw error;

      toast.success(`Comando '${command.toUpperCase()}' enviado!`, {
        icon: '🛰️',
        style: { 
          background: 'rgba(10, 10, 15, 0.9)', 
          color: '#fff', 
          border: '1px solid rgba(49, 168, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          borderRadius: '1rem'
        }
      });
    } catch (err) {
      toast.error('Falha ao enviar comando');
    } finally {
      setCommandLoading(null);
    }
  };

  const handleUnlink = async (id: string) => {
    const loadingId = toast.loading('Desvinculando hardware...');
    try {
      const response = await fetch('/api/v1/install/unlink', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ installation_id: id })
      });
      
      if (!response.ok) throw new Error();
      
      toast.success('Dispositivo removido.', { id: loadingId, icon: '🗑️' });
      fetchDevices();
      setShowUnlinkModal(null);
    } catch (error) {
      toast.error('Falha ao desvincular.', { id: loadingId });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-6">
        <div className="relative">
          <div className="w-16 h-16 border-t-4 border-r-4 border-[#31A8FF] rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-b-4 border-l-4 border-[#8B31FF] rounded-full animate-spin-reverse opacity-50"></div>
        </div>
        <p className="text-white/30 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Estabelecendo Uplink Seguro...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-gradient-to-b from-[#31A8FF] to-[#8B31FF] rounded-full"></div>
            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Gerenciador de <span className="text-[#31A8FF] not-italic">Instâncias</span></h2>
          </div>
          <p className="text-white/40 font-bold text-xs uppercase tracking-widest pl-5 font-mono">Telemetria e controle de hardware em tempo real</p>
        </div>

        <Link href="/voltrisoptimizer" className="flex items-center gap-3 px-8 py-4 voltris-glass border border-[#31A8FF]/20 rounded-2xl text-[#31A8FF] hover:bg-[#31A8FF] hover:text-white transition-all group shadow-2xl">
          <FiDownload className="w-5 h-5 group-hover:animate-bounce" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">DOWNLOAD OPTIMIZER</span>
        </Link>
      </div>

      {devices.length === 0 ? (
        <div className={`p-24 rounded-[4rem] border border-white/5 text-center flex flex-col items-center gap-8 ${transparencyMode ? 'voltris-glass' : 'bg-[#12121A]'}`}>
           <div className="relative">
             <FiMonitor className="w-20 h-20 text-white/5" />
             <FiPlus className="absolute -top-2 -right-2 w-10 h-10 text-[#31A8FF] animate-pulse" />
           </div>
           <div className="space-y-3">
             <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Nenhum Nó Ativo Detectado</h3>
             <p className="text-white/30 font-bold text-xs uppercase tracking-[0.2em] max-w-sm mx-auto leading-relaxed">Inicialize o Voltris Optimizer em seu computador pessoal para estabelecer um link de gerenciamento.</p>
           </div>
           <Link href="/voltrisoptimizer" className="mt-4 px-10 py-5 bg-white text-black font-black uppercase italic tracking-widest rounded-2xl hover:scale-110 active:scale-95 transition-all shadow-3xl text-xs">
              Obter Pacote de Implantação
           </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-10">
          {devices.map((device) => (
            <motion.div
              key={device.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className={`group relative rounded-[3.5rem] border overflow-hidden transition-all duration-700
                ${transparencyMode ? 'voltris-glass' : 'bg-[#12121A] border-white/5 shadow-[0_50px_100px_rgba(0,0,0,0.4)]'}
                hover:border-[#31A8FF]/40
              `}
            >
              {/* Device Status Glow Backdrop */}
              <div className={`absolute -right-40 -top-40 w-[600px] h-[600px] ${device.is_online ? 'bg-[#00FF88]/5' : 'bg-white/5'} blur-[150px] rounded-full transition-all duration-1000 group-hover:opacity-100 opacity-60`}></div>

              <div className="relative z-10 flex flex-col xl:flex-row">
                
                {/* Visual Identity / Host Info */}
                <div className="p-10 xl:w-96 flex flex-col items-center justify-center text-center border-b xl:border-b-0 xl:border-r border-white/5 xl:bg-white/[0.02]">
                  <div className="relative mb-8">
                    <div className={`w-40 h-40 rounded-[3rem] flex items-center justify-center text-white relative transition-all duration-700 group-hover:rotate-3 group-hover:scale-110 ${device.is_online ? 'bg-gradient-to-br from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B]' : 'bg-white/5 grayscale opacity-30'}`}>
                       <FiMonitor className="w-16 h-16 relative z-10" />
                       {device.is_online && <div className="absolute inset-0 rounded-[3rem] blur-2xl opacity-60 bg-gradient-to-br from-[#31A8FF] to-[#FF4B6B] animate-pulse"></div>}
                       <div className="absolute inset-2 border border-white/20 rounded-[2.5rem] opacity-30"></div>
                    </div>
                    <div className={`absolute -bottom-2 -right-2 w-12 h-12 rounded-2xl border-4 ${transparencyMode ? 'border-[#0F0F1A]' : 'border-[#12121A]'} flex items-center justify-center z-20 shadow-2xl ${device.is_online ? 'bg-[#00FF88] shadow-[#00FF88]/30' : 'bg-slate-700'}`}>
                       {device.is_online ? <FiZap className="w-6 h-6 text-black" /> : <FiPower className="w-6 h-6 text-white" />}
                    </div>
                  </div>
                  
                  <div className="space-y-1 w-full">
                    <h3 className="text-3xl font-black text-white uppercase italic tracking-widest truncate px-4">{device.pc_name}</h3>
                    <div className="flex flex-col gap-2 pt-2">
                      <div className={`mx-auto px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] inline-flex items-center gap-2 border ${device.is_online ? 'text-[#00FF88] border-[#00FF88]/20 bg-[#00FF88]/5' : 'text-slate-500 border-white/5 bg-white/5'}`}>
                        <div className={`w-2 h-2 rounded-full ${device.is_online ? 'bg-[#00FF88] animate-pulse' : 'bg-slate-500'}`}></div>
                        {device.is_online ? 'Conexão Ativa' : 'Link Perdido'}
                      </div>
                      <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest font-mono">Telemetry: {new Date(device.last_heartbeat || device.last_active).toLocaleString()}</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => setShowUnlinkModal(device.id)}
                    className="mt-10 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/5 border border-red-500/10 text-[10px] font-black uppercase tracking-widest text-red-500/40 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/30 transition-all active:scale-95"
                  >
                    <FiTrash2 className="w-3.5 h-3.5" />
                    Encerrar Conexão
                  </button>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col">
                  
                  {/* Real-time Status Ribbons */}
                  <div className="grid grid-cols-2 md:grid-cols-4 border-b border-white/5 bg-black/20">
                    {[
                      { label: 'Rede', value: device.is_online ? 'Criptografada' : 'Espera', icon: FiActivity, color: device.is_online ? 'text-[#31A8FF]' : 'text-slate-500' },
                      { label: 'Optimizer', value: device.is_optimized ? 'Ativo' : 'Espera', icon: FiZap, color: device.is_optimized ? 'text-[#8B31FF]' : 'text-slate-500' },
                      { label: 'Proteção', value: 'Escudo Ativo', icon: FiShield, color: 'text-emerald-400' },
                      { label: 'Protocolo', value: device.is_licensed ? 'Acesso Total' : 'Restrito', icon: FiCheck, color: device.is_licensed ? 'text-[#31A8FF]' : 'text-red-400' },
                    ].map((stat, i) => (
                      <div key={i} className="p-7 border-r border-white/5 flex flex-col gap-2 group/stat relative overflow-hidden">
                        <div className="absolute inset-0 bg-white/0 group-hover/stat:bg-white/[0.02] transition-all"></div>
                        <div className="flex items-center justify-between text-white/20 relative z-10">
                          <span className="text-[9px] font-black uppercase tracking-[0.2em]">{stat.label}</span>
                          <stat.icon className="w-5 h-5 opacity-40 group-hover/stat:scale-125 group-hover/stat:rotate-12 transition-all duration-500" />
                        </div>
                        <span className={`text-[11px] font-black uppercase italic tracking-[0.1em] relative z-10 ${stat.color}`}>{stat.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Hardware Specification Architecture */}
                  <div className="flex-1 p-10 grid grid-cols-1 md:grid-cols-2 gap-10 bg-white/[0.01]">
                    
                    {/* CPU & RAM Architecture */}
                    <div className="space-y-8">
                       <div className="flex items-start gap-6 p-6 rounded-[2.5rem] bg-white/[0.03] border border-white/5 hover:border-[#31A8FF]/30 transition-all group/hw">
                          <div className="p-4 rounded-2xl bg-[#31A8FF]/10 text-[#31A8FF] shadow-[0_0_20px_rgba(49,168,255,0.1)] group-hover/hw:scale-110 transition-transform"><FiCpu className="w-8 h-8" /></div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1.5">Módulo do Processador Primário</span>
                            <span className="text-sm font-black text-white uppercase italic tracking-tight truncate leading-tight">{device.cpu || 'Processador Não Detectado'}</span>
                          </div>
                       </div>
                       <div className="flex items-start gap-6 p-6 rounded-[2.5rem] bg-white/[0.03] border border-white/5 hover:border-[#8B31FF]/30 transition-all group/hw">
                          <div className="p-4 rounded-2xl bg-[#8B31FF]/10 text-[#8B31FF] shadow-[0_0_20px_rgba(139,49,255,0.1)] group-hover/hw:scale-110 transition-transform"><FiActivity className="w-8 h-8" /></div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1.5">Alocação Dinâmica de Memória</span>
                            <span className="text-sm font-black text-white uppercase italic tracking-tight leading-tight">{device.ram || 'Memória Não Encontrada'}</span>
                          </div>
                       </div>
                    </div>

                    {/* GPU & OS Architecture */}
                    <div className="space-y-8">
                       <div className="flex items-start gap-6 p-6 rounded-[2.5rem] bg-white/[0.03] border border-white/5 hover:border-[#FF4B6B]/30 transition-all group/hw">
                          <div className="p-4 rounded-2xl bg-[#FF4B6B]/10 text-[#FF4B6B] shadow-[0_0_20px_rgba(255,75,107,0.1)] group-hover/hw:scale-110 transition-transform"><FiMonitor className="w-8 h-8" /></div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1.5">Unidade de Computação Visual</span>
                            <span className="text-sm font-black text-white uppercase italic tracking-tight leading-tight truncate">{device.gpu || 'Gráficos Acelerados por Hardware'}</span>
                          </div>
                       </div>
                       <div className="flex items-start gap-6 p-6 rounded-[2.5rem] bg-white/[0.03] border border-white/5 hover:border-emerald-400/30 transition-all group/hw">
                          <div className="p-4 rounded-2xl bg-emerald-400/10 text-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.1)] group-hover/hw:scale-110 transition-transform"><FiHardDrive className="w-8 h-8" /></div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1.5">Kernel do Sistema Operacional</span>
                            <span className="text-sm font-black text-white uppercase italic tracking-tight leading-tight">{device.os || 'Windows Master Build'}</span>
                          </div>
                       </div>
                    </div>

                  </div>

                  {/* Remote Command Terminal (Uplink Controls) */}
                  <div className="p-10 border-t border-white/5 bg-black/10 grid grid-cols-2 md:grid-cols-5 gap-5">
                    <RemoteAction 
                      icon={FiZap} label="Otimizar" color="blue" 
                      onClick={() => handleRemoteCommand(device.id, 'optimize')}
                      loading={commandLoading === `${device.id}-optimize`}
                    />
                    <RemoteAction 
                      icon={FiTerminal} label="Preparar PC" color="emerald" 
                      onClick={() => handleRemoteCommand(device.id, 'prepare')}
                      loading={commandLoading === `${device.id}-prepare`}
                    />
                    <RemoteAction 
                      icon={FiRefreshCw} label="Reiniciar Link" color="amber" 
                      onClick={() => handleRemoteCommand(device.id, 'restart')}
                      loading={commandLoading === `${device.id}-restart`}
                    />
                    <RemoteAction 
                      icon={FiPower} label="Desligar" color="red" 
                      onClick={() => handleRemoteCommand(device.id, 'shutdown')}
                      loading={commandLoading === `${device.id}-shutdown`}
                    />
                    <RemoteAction 
                      icon={FiShield} label="Modo Gamer" color="blue" 
                      onClick={() => handleRemoteCommand(device.id, 'gamer')}
                      loading={commandLoading === `${device.id}-gamer`}
                    />
                  </div>

                </div>
              </div>
              
              {/* Bottom Progress Bar Decor */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#31A8FF]/30 to-transparent"></div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Advanced Confirmation Overlay */}
      <AnimatePresence>
        {showUnlinkModal && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setShowUnlinkModal(null)} />
            <motion.div 
              initial={{ scale: 0.9, y: 30, rotateX: 20 }} 
              animate={{ scale: 1, y: 0, rotateX: 0 }} 
              exit={{ scale: 0.9, y: 30, rotateX: 20 }} 
              className={`relative w-full max-w-lg p-12 rounded-[4rem] border border-white/10 shadow-[0_0_100px_rgba(239,68,68,0.2)] flex flex-col items-center text-center ${transparencyMode ? 'voltris-glass' : 'bg-[#0A0A10]'}`}
            >
               <div className="w-24 h-24 rounded-[2.5rem] bg-red-500/10 flex items-center justify-center text-red-500 mb-8 border border-red-500/20 shadow-inner">
                 <FiAlertCircle className="w-12 h-12" />
               </div>
               <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-4">Terminação de <span className="text-red-500">Comando</span></h3>
               <p className="text-white/40 font-bold text-xs uppercase tracking-[0.2em] leading-relaxed mb-12 max-w-sm">Você está removendo este nó da rede neural Voltris. Todos os privilégios de otimização remota serão revogados instantaneamente.</p>
               <div className="flex w-full gap-5">
                  <button onClick={() => setShowUnlinkModal(null)} className="flex-1 py-5 rounded-3xl bg-white/5 border border-white/10 text-white font-black uppercase text-[10px] tracking-[0.2em] hover:bg-white/10 transition-all active:scale-95">Abortar Missão</button>
                  <button onClick={() => handleUnlink(showUnlinkModal)} className="flex-1 py-5 rounded-3xl bg-red-500 text-white font-black uppercase text-[10px] tracking-[0.2em] shadow-[0_20px_40px_rgba(239,68,68,0.3)] hover:scale-105 active:scale-95 transition-all">Executar Desvinculação</button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
