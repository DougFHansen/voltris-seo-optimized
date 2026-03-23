'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiZap, FiZapOff, FiActivity, FiCpu, 
  FiTarget, FiShield, FiTrendingUp, FiCheckCircle,
  FiTerminal, FiAlertCircle
} from 'react-icons/fi';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'react-hot-toast';
import { useDashboard } from '@/app/context/DashboardContext';

export default function GamerPage() {
    const { transparencyMode } = useDashboard();
    const [loading, setLoading] = useState(false);
    const [gamerModeActive, setGamerModeActive] = useState(false);
    const [machineId, setMachineId] = useState<string | null>(null);
    const [lastHeartbeat, setLastHeartbeat] = useState<string | null>(null);
    const supabase = useMemo(() => createClient(), []);

    useEffect(() => {
        loadStatus();
    }, []);

    const loadStatus = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            const { data: installation } = await supabase
                .from('installations')
                .select('machine_id, gamer_mode_active, last_heartbeat')
                .eq('user_id', user.id)
                .single();

            if (installation) {
                setMachineId(installation.machine_id);
                setGamerModeActive(installation.gamer_mode_active || false);
                setLastHeartbeat(installation.last_heartbeat);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const toggleGamerMode = async () => {
        if (!machineId) {
            toast.error('Nenhum node detectado');
            return;
        }

        setLoading(true);
        const newStatus = !gamerModeActive;
        try {
            const { error } = await supabase
                .from('installations')
                .update({ gamer_mode_active: newStatus })
                .eq('machine_id', machineId);

            if (error) throw error;
            setGamerModeActive(newStatus);
            toast.success(newStatus ? 'Gamer Protocol: ACTIVE' : 'Gamer Protocol: DISABLED', {
              icon: newStatus ? '🔥' : '❄️',
              style: { background: 'rgba(10, 10, 15, 0.9)', color: '#fff', border: '1px solid rgba(49, 168, 255, 0.2)' }
            });
        } catch (error) {
            toast.error('Protocol Failure');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-10">
            
            {/* Header */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-8 bg-gradient-to-b from-[#FF4B6B] to-[#FF9B31] rounded-full"></div>
                    <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Gamer <span className="text-[#FF4B6B] not-italic">Protocol</span></h2>
                </div>
                <p className="text-white/40 font-bold text-xs uppercase tracking-[0.2em] pl-5 font-mono">Neural overclocking and latency suppression</p>
            </div>

            {/* Neural Switch Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`group relative p-12 rounded-[4rem] border transition-all duration-700 overflow-hidden ${transparencyMode ? 'voltris-glass' : 'bg-[#0A0A10] border-white/5 shadow-3xl'}`}
            >
               {/* Background Effects */}
               <div className={`absolute -right-40 -top-40 w-[600px] h-[600px] ${gamerModeActive ? 'bg-[#FF4B6B]/10' : 'bg-[#31A8FF]/5'} blur-[150px] rounded-full transition-all duration-1000`}></div>
               
               <div className="relative z-10 flex flex-col xl:flex-row items-center justify-between gap-12">
                  <div className="flex items-center gap-10">
                     <div className="relative">
                        <div className={`w-40 h-40 rounded-[3rem] p-[2px] transition-all duration-700 shadow-2xl ${gamerModeActive ? 'bg-gradient-to-br from-[#FF4B6B] to-[#FF9B31] rotate-3' : 'bg-white/5 grayscale'}`}>
                           <div className="w-full h-full rounded-[2.85rem] bg-[#0A0A10] flex items-center justify-center">
                              {gamerModeActive ? <FiZap className="w-16 h-16 text-[#FF4B6B] animate-pulse" /> : <FiZapOff className="w-16 h-16 text-white/10" />}
                           </div>
                        </div>
                        {gamerModeActive && (
                           <div className="absolute inset-0 rounded-[3rem] blur-3xl opacity-40 bg-[#FF4B6B] animate-pulse"></div>
                        )}
                     </div>

                     <div className="space-y-3">
                        <div className="flex items-center gap-4">
                           <span className={`text-4xl font-black italic uppercase tracking-tighter ${gamerModeActive ? 'text-white' : 'text-white/20'}`}>
                              {gamerModeActive ? 'Ultra Active' : 'Protocol Inactive'}
                           </span>
                           <div className={`px-4 py-1 rounded-full border ${gamerModeActive ? 'bg-[#00FF88]/10 border-[#00FF88]/20 text-[#00FF88]' : 'bg-white/5 border-white/10 text-white/20'}`}>
                              <span className="text-[10px] font-black uppercase tracking-widest">{gamerModeActive ? 'Max Performance' : 'Idle'}</span>
                           </div>
                        </div>
                        <p className="text-white/40 font-bold text-xs uppercase tracking-widest leading-relaxed max-w-md">
                           {gamerModeActive 
                             ? 'System is currently prioritizing thread pool and GPU shaders. Background entropy minimized.' 
                             : 'Activate to re-route system resources to the primary visual processing core.'}
                        </p>
                     </div>
                  </div>

                  <button 
                    onClick={toggleGamerMode} 
                    disabled={loading || !machineId}
                    className={`relative group px-12 py-6 rounded-3xl font-black uppercase italic text-xs tracking-[0.3em] shadow-2xl transition-all hover:scale-[1.05] active:scale-95 disabled:opacity-30
                      ${gamerModeActive 
                        ? 'bg-gradient-to-r from-red-600 to-red-400 text-white' 
                        : 'bg-white text-black'
                      }
                    `}
                  >
                    {loading ? 'Transmitting...' : gamerModeActive ? 'DISENGAGE PROTOCOL' : 'INITIALIZE OVERCLOCK'}
                  </button>
               </div>
            </motion.div>

            {/* Sub-system Telemetry */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                 { label: 'CPU Priority', icon: FiCpu, status: gamerModeActive ? 'High Thread' : 'Balanced', color: 'text-[#31A8FF]' },
                 { label: 'Latency Map', icon: FiTrendingUp, status: gamerModeActive ? 'Sub-Atomic' : 'Standard', color: 'text-[#FF4B6B]' },
                 { label: 'Entropy Control', icon: FiActivity, status: gamerModeActive ? 'Zero Level' : 'Nominal', color: 'text-[#00FF88]' },
               ].map((mod, i) => (
                 <motion.div
                   key={i}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.1 }}
                   className={`p-10 rounded-[3.5rem] border transition-all duration-500 overflow-hidden relative group ${transparencyMode ? 'voltris-glass' : 'bg-[#12121A] border-white/5 shadow-2xl'}`}
                 >
                    <div className="relative z-10 flex flex-col gap-6 items-center text-center">
                       <div className={`p-5 rounded-2xl bg-white/5 border border-white/5 group-hover:bg-white/10 group-hover:scale-110 transition-all ${mod.color}`}>
                          <mod.icon className="w-8 h-8" />
                       </div>
                       <div className="space-y-1">
                          <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] font-mono">{mod.label}</h4>
                          <span className="text-2xl font-black text-white uppercase italic tracking-tighter">{mod.status}</span>
                       </div>
                    </div>
                    {/* Interior Progress Bar Decor */}
                    <div className={`absolute bottom-0 left-0 h-1 bg-current opacity-20 transition-all duration-1000 ${mod.color}`} style={{ width: gamerModeActive ? '100%' : '30%' }}></div>
                 </motion.div>
               ))}
            </div>

            {/* Tactical Briefing */}
            {!machineId && (
               <div className="p-8 rounded-3xl bg-amber-500/5 border border-amber-500/10 flex items-center gap-6">
                  <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-500 shadow-lg shadow-amber-500/10">
                    <FiAlertCircle className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-black text-white uppercase italic tracking-tighter">No Linked Node Detected</p>
                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Connect your PC to the Voltris Neural Network to enable remote protocol switching.</p>
                  </div>
               </div>
            )}

        </div>
    );
}