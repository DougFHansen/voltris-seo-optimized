'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShield, FiLock, FiSmartphone, FiCheckCircle, FiAlertTriangle, FiTrash2, FiKey } from 'react-icons/fi';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'react-hot-toast';
import { useDashboard } from '@/app/context/DashboardContext';

export default function SecurityPage() {
  const supabase = createClient();
  const { transparencyMode } = useDashboard();
  
  const [factors, setFactors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollData, setEnrollData] = useState<any>(null);
  const [verifyCode, setVerifyCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const fetchFactors = async () => {
    try {
      const { data, error } = await supabase.auth.mfa.listFactors();
      if (error) throw error;
      setFactors(data.all || []);
    } catch (err) {
      console.error('Error fetching factors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFactors();
  }, []);

  const onEnroll = async () => {
    setIsEnrolling(true);
    try {
      // 1. Limpeza de fatores não verificados para evitar erro de "friendly name already exists"
      const { data: existingFactors } = await supabase.auth.mfa.listFactors();
      if (existingFactors?.all) {
        const unverified = existingFactors.all.filter(f => f.status === 'unverified');
        for (const f of unverified) {
          await supabase.auth.mfa.unenroll({ factorId: f.id });
        }
      }

      // 2. Iniciar novo enrollment
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        issuer: 'Voltris',
        friendlyName: 'Dispositivo Principal'
      });
      if (error) throw error;
      setEnrollData(data);
    } catch (err: any) {
      toast.error('Erro ao iniciar ativação: ' + err.message);
      setIsEnrolling(false);
    }
  };

  const onVerify = async () => {
    if (verifyCode.length < 6) return;
    setIsVerifying(true);
    try {
      const { data, error } = await supabase.auth.mfa.challengeAndVerify({
        factorId: enrollData.id,
        code: verifyCode
      });
      if (error) throw error;
      
      toast.success('Google Authenticator ativado com sucesso!');
      setIsEnrolling(false);
      setEnrollData(null);
      setVerifyCode('');
      fetchFactors();
    } catch (err: any) {
      toast.error('Código inválido ou expirado.');
    } finally {
      setIsVerifying(false);
    }
  };

  const onUnenroll = async (factorId: string) => {
    if (!confirm('Tem certeza que deseja desativar a proteção 2FA? Sua conta ficará menos segura.')) return;
    try {
      const { error } = await supabase.auth.mfa.unenroll({ factorId });
      if (error) throw error;
      toast.success('Proteção 2FA desativada.');
      fetchFactors();
    } catch (err: any) {
      toast.error('Erro ao desativar: ' + err.message);
    }
  };

  if (loading) return null;

  const activeFactor = factors.find(f => f.status === 'verified');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className={`p-8 sm:p-10 rounded-[2.5rem] border overflow-hidden relative group ${transparencyMode ? 'voltris-glass' : 'bg-[#12121A] border-white/5'}`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#31A8FF]/5 blur-[80px] -mr-32 -mt-32"></div>
        
        <div className="relative z-10 space-y-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white relative shadow-2xl ${activeFactor ? 'bg-emerald-500' : 'bg-[#31A8FF]'}`}>
              <FiShield className="w-8 h-8" />
              <div className={`absolute inset-0 blur-lg opacity-40 ${activeFactor ? 'bg-emerald-500' : 'bg-[#31A8FF]'}`}></div>
            </div>
            <div className="text-center sm:text-left flex-1">
              <h2 className="text-2xl sm:text-3xl font-black text-white italic uppercase tracking-tighter">Central de Segurança</h2>
              <p className="text-white/40 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] mt-1">Multi-Factor Authentication (MFA)</p>
            </div>
            
            {activeFactor && (
              <div className="px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                <span className="text-[10px] font-black uppercase tracking-widest">Proteção Ativa</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                <FiLock className="text-[#31A8FF]" /> Por que ativar o 2FA?
              </h3>
              <ul className="space-y-3">
                {[
                  'Proteção contra roubo de senhas',
                  'Acesso exclusivo via seu dispositivo móvel',
                  'Segurança nível Stripe e Google Authenticator',
                  'Bloqueia hackers mesmo com a sua senha'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/50 text-[11px] font-medium">
                    <FiCheckCircle className="text-emerald-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className={`p-6 rounded-[2rem] border ${activeFactor ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-white/5 border-white/10'} flex flex-col justify-center items-center gap-6 text-center`}>
              {activeFactor ? (
                <>
                  <FiSmartphone className="w-12 h-12 text-emerald-400" />
                  <div>
                    <h4 className="text-white font-black uppercase text-sm italic">Google Authenticator Ativo</h4>
                    <p className="text-white/40 text-[10px] mt-1">Seu login está protegido por biometria de autenticação.</p>
                  </div>
                  <button 
                    onClick={() => onUnenroll(activeFactor.id)}
                    className="text-red-400/50 hover:text-red-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all"
                  >
                    <FiTrash2 /> Desativar Proteção
                  </button>
                </>
              ) : (
                <>
                  <FiAlertTriangle className="w-12 h-12 text-amber-400" />
                  <div>
                    <h4 className="text-white font-black uppercase text-sm italic">Conta Vulnerável</h4>
                    <p className="text-white/40 text-[10px] mt-1">Recomendamos ativar o Google Authenticator agora.</p>
                  </div>
                  {!isEnrolling && (
                    <button 
                      onClick={onEnroll}
                      className="w-full py-4 bg-white text-black font-black uppercase italic text-xs rounded-xl shadow-xl hover:scale-105 transition-all"
                    >
                      Configurar 2FA
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          <AnimatePresence>
            {isEnrolling && enrollData && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-black/40 rounded-[2rem] p-8 sm:p-10 border border-[#31A8FF]/30 space-y-8"
              >
                <div className="flex flex-col lg:flex-row items-center gap-10">
                  <div className="bg-white p-4 rounded-3xl shadow-[0_0_50px_rgba(255,255,255,0.1)] w-48 h-48 flex items-center justify-center overflow-hidden">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(enrollData.totp.uri)}`}
                      alt="MFA QR Code"
                      className="w-full h-full"
                    />
                  </div>
                  
                  <div className="space-y-6 flex-1 text-center lg:text-left">
                    <h4 className="text-xl font-black text-white italic uppercase tracking-tighter">Escaneie o QR Code</h4>
                    <p className="text-white/40 text-xs font-medium leading-relaxed">
                      1. Abra o <span className="text-white">Google Authenticator</span> no seu celular.<br />
                      2. Clique no "+" e escolha "Ler código QR".<br />
                      3. Após escanear, digite o código de 6 dígitos abaixo.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="bg-[#121218] border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3 w-full sm:w-48 focus-within:border-[#31A8FF] transition-all">
                        <FiKey className="text-slate-500" />
                        <input 
                          type="text" 
                          placeholder="000 000" 
                          maxLength={6}
                          value={verifyCode}
                          onChange={e => setVerifyCode(e.target.value.replace(/\D/g, ''))}
                          className="bg-transparent w-full text-white text-base font-black tracking-[0.5em] outline-none placeholder:tracking-normal placeholder:text-slate-600"
                        />
                      </div>
                      <button 
                        onClick={onVerify}
                        disabled={verifyCode.length < 6 || isVerifying}
                        className="w-full sm:w-auto px-10 py-4 bg-[#31A8FF] text-white font-black uppercase italic text-xs rounded-xl shadow-blue-500/20 disabled:opacity-50"
                      >
                        {isVerifying ? 'Verificando...' : 'Confirmar'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5">
                  <button onClick={() => setIsEnrolling(false)} className="text-white/20 hover:text-white/40 text-[10px] font-black uppercase tracking-widest transition-all">
                    Cancelar Ativação
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}
