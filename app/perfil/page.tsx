'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { useAuth } from '@/app/hooks/useAuth';

export default function ProfilePage() {
  const { user, profile, loading, refreshAuth } = useAuth();
  const [showCompleteProfile, setShowCompleteProfile] = useState(false);
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    address: '', // novo campo
    city: '',
    state: '',
    cep: ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        address: profile.address || '', // novo campo
        city: profile.city || '',
        state: profile.state || '',
        cep: profile.cep || ''
      });
      const missingFields =
        !profile.phone ||
        !profile.address || // novo campo obrigatório
        !profile.city ||
        !profile.state ||
        !profile.cep;
      setShowCompleteProfile(missingFields);
    }
  }, [profile]);

  // Verificar se veio do Google e forçar completar cadastro
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const isGoogleLogin = params.get('google') === '1';
      const needsCompletion = params.get('completar') === '1';
      
      if (isGoogleLogin || needsCompletion) {
        setShowCompleteProfile(true);
      }
    }
  }, []);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-[#171313] pt-24 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF4B6B]"></div>
        </div>
        <Footer />
      </>
    );
  }

  // Máscara para telefone
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else {
      return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    }
  };

  // Máscara para CEP
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
    // Validação forte
    const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
    const cepRegex = /^\d{5}-\d{3}$/;
    if (!form.phone || !phoneRegex.test(form.phone)) {
      setError('Por favor, insira um telefone válido no formato (00) 00000-0000 ou (00) 0000-0000.');
      setSaving(false);
      return;
    }
    if (!form.cep || !cepRegex.test(form.cep)) {
      setError('Por favor, insira um CEP válido no formato 00000-000.');
      setSaving(false);
      return;
    }
    if (!form.address || form.address.length < 5) {
      setError('Por favor, insira um endereço válido (mínimo 5 caracteres).');
      setSaving(false);
      return;
    }
    if (!form.city || !form.state) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      setSaving(false);
      return;
    }
    try {
      if (!user) {
        setError('Usuário não autenticado');
        setSaving(false);
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: form.full_name,
          phone: form.phone,
          address: form.address, // novo campo
          city: form.city,
          state: form.state,
          cep: form.cep
        })
        .eq('id', user.id);
      if (error) {
        setError('Erro ao salvar perfil: ' + error.message);
        setSaving(false);
        return;
      }
      await refreshAuth();
      router.replace('/dashboard');
    } catch (err: any) {
      setError('Erro inesperado ao salvar perfil.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#171313] pt-24 flex flex-col items-center justify-center">
        <div className="container mx-auto px-4 flex flex-col items-center justify-center min-h-[60vh]">
          <div className="max-w-4xl mx-auto w-full flex flex-col items-center justify-center">
            {showCompleteProfile && (
              <div className="mb-6 p-4 rounded-lg bg-yellow-900/80 border-l-4 border-yellow-400 text-yellow-200 font-semibold shadow">
                Por favor, complete seu cadastro preenchendo todos os campos obrigatórios abaixo para acessar todos os recursos do site.
              </div>
            )}
            {error && (
              <div className="mb-4 p-3 rounded bg-red-900/80 border-l-4 border-red-400 text-red-200 font-semibold shadow">
                {error}
              </div>
            )}
            <form onSubmit={handleSave} className="bg-[#171313] rounded-lg shadow-lg p-6 border border-[#8B31FF]/10">
              <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF]">
                Informações Pessoais
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="block text-gray-400 text-sm mb-1">Nome Completo</span>
                  <input
                    type="text"
                    name="full_name"
                    className="bg-[#23232b] rounded-lg px-4 py-3 text-white w-full"
                    value={form.full_name}
                    onChange={handleChange}
                    autoComplete="name"
                  />
                </div>
                <div>
                  <span className="block text-gray-400 text-sm mb-1">Telefone</span>
                  <input
                    type="text"
                    name="phone"
                    className="bg-[#23232b] rounded-lg px-4 py-3 text-white w-full"
                    value={form.phone}
                    onChange={handlePhoneChange}
                    autoComplete="tel"
                  />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-[#8B31FF] mb-2 mt-4">Endereço</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <span className="block text-gray-400 text-sm mb-1">Endereço</span>
                  <input
                    type="text"
                    name="address"
                    className="bg-[#23232b] rounded-lg px-4 py-3 text-white w-full"
                    value={form.address}
                    onChange={handleChange}
                    autoComplete="street-address"
                    required
                  />
                </div>
                <div>
                  <span className="block text-gray-400 text-sm mb-1">Cidade</span>
                  <input
                    type="text"
                    name="city"
                    className="bg-[#23232b] rounded-lg px-4 py-3 text-white w-full"
                    value={form.city}
                    onChange={handleChange}
                    autoComplete="address-level2"
                    required
                  />
                </div>
                <div>
                  <span className="block text-gray-400 text-sm mb-1">Estado</span>
                  <input
                    type="text"
                    name="state"
                    className="bg-[#23232b] rounded-lg px-4 py-3 text-white w-full"
                    value={form.state}
                    onChange={handleChange}
                    autoComplete="address-level1"
                    maxLength={2}
                    placeholder="SP"
                    required
                  />
                </div>
                <div>
                  <span className="block text-gray-400 text-sm mb-1">CEP</span>
                  <input
                    type="text"
                    name="cep"
                    className="bg-[#23232b] rounded-lg px-4 py-3 text-white w-full"
                    value={form.cep}
                    onChange={handleCEPChange}
                    autoComplete="postal-code"
                    placeholder="00000-000"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  className="px-8 py-3 rounded-lg bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-white font-bold text-lg shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-60"
                  disabled={saving}
                >
                  {saving ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
} 
