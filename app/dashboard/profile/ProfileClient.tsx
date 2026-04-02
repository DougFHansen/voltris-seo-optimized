'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, 
  FiEdit3, FiSave, FiX, FiShield, FiLock, 
  FiCpu, FiCheckCircle, FiActivity
} from 'react-icons/fi';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/app/hooks/useAuth';
import AuthGuard from '@/components/AuthGuard';
import { useDashboard } from '@/app/context/DashboardContext';

interface Profile {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  cep?: string;
  created_at: string;
  updated_at: string;
}

export default function ProfileClient() {
  const { transparencyMode } = useDashboard();
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    cep: ''
  });
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setProfile(data);
        setFormData({
          full_name: data.full_name || '',
          phone: data.phone || '',
          address: data.address || '',
          city: data.city || '',
          state: data.state || '',
          cep: data.cep || ''
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user, supabase]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...formData,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast.success('Perfil atualizado!', {
        icon: '✅',
        style: { background: 'rgba(10, 10, 15, 0.9)', color: '#fff', border: '1px solid rgba(49, 168, 255, 0.2)' }
      });
      setIsEditing(false);
      
      const { data: updatedData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setProfile(updatedData);
    } catch (error) {
      toast.error('Erro ao salvar perfil');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-6">
        <div className="w-16 h-16 border-t-4 border-r-4 border-[#8B31FF] rounded-full animate-spin"></div>
        <p className="text-white/30 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Sincronizando Identidade do Usuário...</p>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="flex flex-col gap-10">
        
        {/* Profile Identity Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative p-10 rounded-[3.5rem] border overflow-hidden ${transparencyMode ? 'voltris-glass' : 'bg-[#0A0A10] border-white/5 shadow-3xl'}`}
        >
          <div className="absolute -right-20 -top-20 w-[600px] h-[600px] bg-[#8B31FF]/5 blur-[150px] rounded-full"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center md:items-start text-center md:text-left">
             <div className="relative group">
                <div className="w-40 h-40 rounded-[3rem] bg-gradient-to-br from-[#8B31FF] via-[#31A8FF] to-[#FF4B6B] p-[2px] shadow-2xl transition-transform duration-500 group-hover:scale-105">
                   <div className="w-full h-full rounded-[2.85rem] bg-[#0A0A10] flex items-center justify-center overflow-hidden">
                      <FiUser className="w-16 h-16 text-white/20 group-hover:text-white group-hover:scale-110 transition-all duration-500" />
                   </div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-2xl bg-[#00FF88] flex items-center justify-center shadow-lg border-4 border-[#0A0A10]">
                   <FiCheckCircle className="w-6 h-6 text-black" />
                </div>
             </div>

             <div className="flex-1 space-y-4">
                <div className="space-y-1">
                   <div className="flex items-center gap-3 justify-center md:justify-start">
                      <h1 className="text-2xl font-black text-white uppercase tracking-tighter">{profile?.full_name || 'Agente de Otimização'}</h1>
                   </div>
                   <p className="text-white/40 font-bold text-xs uppercase tracking-widest">{user?.email}</p>
                </div>

                <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-2">
                   <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5">
                      <FiCpu className="w-4 h-4 text-[#31A8FF]" />
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">ID: {user?.id.slice(0, 8).toUpperCase()}</span>
                   </div>
                   <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5">
                      <FiActivity className="w-4 h-4 text-[#00FF88]" />
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">Status: Ativo</span>
                   </div>
                </div>
             </div>

             {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-8 py-4 bg-white text-black font-black uppercase italic tracking-widest rounded-2xl hover:scale-105 transition-all shadow-3xl text-sm"
                >
                  Editar Perfil
                </button>
             )}
          </div>
        </motion.div>

        {/* Form Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* Detailed Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`p-10 rounded-[3.5rem] border ${transparencyMode ? 'voltris-glass' : 'bg-[#12121A] border-white/5'}`}
          >
            <div className="flex items-center gap-4 mb-10">
               <div className="p-3 bg-[#31A8FF]/10 text-[#31A8FF] rounded-2xl">
                 <FiUser className="w-6 h-6" />
               </div>
               <h3 className="text-xl font-black text-white italic uppercase tracking-tighter leading-none">Dados <span className="text-[#31A8FF]">Pessoais</span></h3>
            </div>

            <div className="space-y-8">
               <div className="space-y-3">
                 <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] font-mono">E-mail de Autenticação</label>
                 <div className="p-5 rounded-2xl bg-black/40 border border-white/5 text-white/40 italic font-bold">
                    {user?.email}
                 </div>
               </div>

               <div className="space-y-3">
                 <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] font-mono">Nome Operacional</label>
                 {isEditing ? (
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="w-full p-5 rounded-2xl bg-black/60 border border-[#31A8FF]/20 text-white focus:border-[#31A8FF] outline-none transition-all placeholder:text-white/10"
                      placeholder="Identificação do Agente"
                    />
                 ) : (
                    <div className="p-5 rounded-2xl bg-white/5 border border-white/5 text-white font-bold">
                      {profile?.full_name || 'Pendente'}
                    </div>
                 )}
               </div>

               <div className="space-y-3">
                 <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] font-mono">Linha de Contato Segura</label>
                 {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-5 rounded-2xl bg-black/60 border border-[#31A8FF]/20 text-white focus:border-[#31A8FF] outline-none transition-all placeholder:text-white/10"
                      placeholder="+55 (00) 00000-0000"
                    />
                 ) : (
                    <div className="p-5 rounded-2xl bg-white/5 border border-white/5 text-white font-bold">
                      {profile?.phone || 'Pendente'}
                    </div>
                 )}
               </div>
            </div>
          </motion.div>

          {/* Secure Location Link */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`p-10 rounded-[3.5rem] border ${transparencyMode ? 'voltris-glass' : 'bg-[#12121A] border-white/5'}`}
          >
            <div className="flex items-center gap-4 mb-10">
               <div className="p-3 bg-[#8B31FF]/10 text-[#8B31FF] rounded-2xl">
                 <FiMapPin className="w-6 h-6" />
               </div>
               <h3 className="text-xl font-black text-white italic uppercase tracking-tighter leading-none">Link <span className="text-[#8B31FF]">Geográfico</span></h3>
            </div>

            <div className="space-y-8">
               <div className="space-y-3">
                 <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] font-mono">Endereço Base</label>
                 {isEditing ? (
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full p-5 rounded-2xl bg-black/60 border border-[#8B31FF]/20 text-white focus:border-[#8B31FF] outline-none transition-all placeholder:text-white/10"
                      placeholder="Vila, Logradouro, Número"
                    />
                 ) : (
                    <div className="p-5 rounded-2xl bg-white/5 border border-white/5 text-white font-bold">
                      {profile?.address || 'Pendente'}
                    </div>
                 )}
               </div>

               <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-3">
                   <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] font-mono">Cidade / Distrito</label>
                   {isEditing ? (
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full p-5 rounded-2xl bg-black/60 border border-[#8B31FF]/20 text-white focus:border-[#8B31FF] outline-none transition-all placeholder:text-white/10"
                      />
                   ) : (
                      <div className="p-5 rounded-2xl bg-white/5 border border-white/5 text-white font-bold">
                        {profile?.city || 'PD'}
                      </div>
                   )}
                 </div>
                 <div className="space-y-3">
                   <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] font-mono">Código do Estado</label>
                   {isEditing ? (
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full p-5 rounded-2xl bg-black/60 border border-[#8B31FF]/20 text-white focus:border-[#8B31FF] outline-none transition-all placeholder:text-white/10"
                      />
                   ) : (
                      <div className="p-5 rounded-2xl bg-white/5 border border-white/5 text-white font-bold">
                        {profile?.state || 'PD'}
                      </div>
                   )}
                 </div>
               </div>

               <div className="space-y-3">
                 <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] font-mono">Código CEP do Sistema</label>
                 {isEditing ? (
                    <input
                      type="text"
                      value={formData.cep}
                      onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
                      className="w-full p-5 rounded-2xl bg-black/60 border border-[#8B31FF]/20 text-white focus:border-[#8B31FF] outline-none transition-all placeholder:text-white/10"
                    />
                 ) : (
                    <div className="p-5 rounded-2xl bg-white/5 border border-white/5 text-white font-bold">
                      {profile?.cep || 'Pendente'}
                    </div>
                 )}
               </div>
            </div>
          </motion.div>
        </div>

        {/* Footer Actions */}
        <AnimatePresence>
          {isEditing && (
             <motion.div 
               initial={{ opacity: 0, y: 50 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: 50 }}
               className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[150] w-[90%] max-w-2xl"
             >
                <div className="bg-[#0A0A10]/90 backdrop-blur-2xl border border-white/10 p-6 rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.8)] flex items-center justify-between gap-6">
                   <div className="flex flex-col">
                      <span className="text-xs font-black text-white italic uppercase tracking-tighter">Modo de Edição</span>
                      <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest leading-none">Você possui alterações não salvas</span>
                   </div>
                   <div className="flex gap-4">
                      <button 
                        onClick={() => { setIsEditing(false); }} 
                        className="px-6 py-3 rounded-xl bg-white/5 text-white/60 font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all"
                      >
                        Abortar Alterações
                      </button>
                      <button 
                        onClick={handleSave} 
                        disabled={saving}
                        className="px-8 py-3 rounded-xl bg-[#00FF88] text-black font-black uppercase text-[10px] tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#00FF88]/20 disabled:grayscale"
                      >
                        {saving ? 'Salvando Sistema...' : 'Sincronizar Identidade'}
                      </button>
                   </div>
                </div>
             </motion.div>
          )}
        </AnimatePresence>

      </div>
    </AuthGuard>
  );
}