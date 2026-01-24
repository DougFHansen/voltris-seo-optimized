'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/app/hooks/useAuth';
import { motion } from 'framer-motion';
import { User, Phone, MapPin, CheckCircle, Loader2, AlertCircle, ArrowRight } from 'lucide-react';

export default function ProfilePage() {
  const { user, profile, loading, refreshAuth } = useAuth();
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    cep: ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (!loading) {
      if (profile) {
        // Verifica se o perfil JÁ está completo
        const isComplete =
          profile.phone &&
          profile.address &&
          profile.city &&
          profile.state &&
          profile.cep;

        if (isComplete) {
          // Se estiver completo, verifica se não estamos forçando a edição
          const params = new URLSearchParams(window.location.search);
          if (!params.get('force')) {
            router.replace('/dashboard');
            return;
          }
        }

        setForm({
          full_name: profile.full_name || '',
          phone: profile.phone || '',
          address: profile.address || '',
          city: profile.city || '',
          state: profile.state || '',
          cep: profile.cep || ''
        });
      }
      setIsChecking(false);
    }
  }, [profile, loading, router]);

  // Máscaras
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else {
      return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    }
  };

  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{5})(\d{0,3})/, '$1-$2');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, phone: formatPhone(e.target.value) });
  };

  const handleCEPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, cep: formatCEP(e.target.value) });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    // Validação
    if (!form.phone || form.phone.length < 14) {
      setError('Telefone inválido.');
      setSaving(false);
      return;
    }
    if (!form.cep || form.cep.length < 9) {
      setError('CEP inválido.');
      setSaving(false);
      return;
    }
    if (!form.address || !form.city || !form.state) {
      setError('Preencha todos os campos de endereço.');
      setSaving(false);
      return;
    }

    try {
      if (!user) throw new Error('Usuário não autenticado');

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: form.full_name,
          phone: form.phone,
          address: form.address,
          city: form.city,
          state: form.state,
          cep: form.cep
        })
        .eq('id', user.id);

      if (error) throw error;

      await refreshAuth();
      router.replace('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar.');
    } finally {
      setSaving(false);
    }
  };

  if (loading || isChecking) {
    return (
      <div className="min-h-screen bg-[#050510] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#31A8FF] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050510] relative flex items-center justify-center overflow-hidden py-12 px-4 font-sans">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#31A8FF]/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#8B31FF]/10 rounded-full blur-[120px]"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl relative z-10"
      >
        <div className="bg-[#0A0A0F]/80 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
          {/* Header Line */}
          <div className="h-1 w-full bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF]"></div>

          <div className="p-8 md:p-12">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#1A1A22] border border-white/5 mb-6 shadow-lg shadow-[#8B31FF]/10">
                <User className="w-8 h-8 text-[#8B31FF]" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Bem-vindo à VOLTRIS</h1>
              <p className="text-slate-400 text-lg">Para continuar, precisamos completar seu perfil.</p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Dados Pessoais</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-slate-300">Nome Completo</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-[#31A8FF] transition-colors" />
                      <input
                        type="text"
                        name="full_name"
                        value={form.full_name}
                        onChange={handleChange}
                        className="w-full bg-[#121218] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-[#31A8FF] transition-all placeholder:text-slate-600"
                        placeholder="Seu nome"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-slate-300">WhatsApp / Celular</label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-[#31A8FF] transition-colors" />
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handlePhoneChange}
                        className="w-full bg-[#121218] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-[#31A8FF] transition-all placeholder:text-slate-600"
                        placeholder="(00) 00000-0000"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Endereço</h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-1/3 space-y-2">
                      <label className="text-sm text-slate-300">CEP</label>
                      <input
                        type="text"
                        name="cep"
                        value={form.cep}
                        onChange={handleCEPChange}
                        className="w-full bg-[#121218] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#31A8FF] transition-all placeholder:text-slate-600"
                        placeholder="00000-000"
                      />
                    </div>
                    <div className="w-2/3 space-y-2">
                      <label className="text-sm text-slate-300">Cidade</label>
                      <input
                        type="text"
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        className="w-full bg-[#121218] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#31A8FF] transition-all"
                        placeholder="Sua cidade"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-3/4 space-y-2">
                      <label className="text-sm text-slate-300">Endereço Completo</label>
                      <div className="relative group">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-[#31A8FF] transition-colors" />
                        <input
                          type="text"
                          name="address"
                          value={form.address}
                          onChange={handleChange}
                          className="w-full bg-[#121218] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-[#31A8FF] transition-all placeholder:text-slate-600"
                          placeholder="Rua, Número, Bairro"
                        />
                      </div>
                    </div>
                    <div className="w-1/4 space-y-2">
                      <label className="text-sm text-slate-300">UF</label>
                      <input
                        type="text"
                        name="state"
                        value={form.state}
                        onChange={e => setForm({ ...form, state: e.target.value.toUpperCase() })}
                        maxLength={2}
                        className="w-full bg-[#121218] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#31A8FF] transition-all text-center"
                        placeholder="SP"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 flex items-center justify-end gap-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-8 py-4 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-white font-bold rounded-xl hover:brightness-110 transition-all shadow-lg shadow-[#8B31FF]/20 flex items-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                  <span>{saving ? 'Salvando...' : 'Concluir Cadastro'}</span>
                  {!saving && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                </button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
