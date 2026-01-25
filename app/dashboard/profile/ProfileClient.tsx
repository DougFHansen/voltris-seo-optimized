'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiEdit3, FiSave, FiX } from 'react-icons/fi';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/app/hooks/useAuth';
import AuthGuard from '@/components/AuthGuard';

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
  const { user, refreshAuth } = useAuth();
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
  const supabase = createClient();

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

        console.log('Perfil carregado:', data);
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
        console.error('Erro ao carregar perfil:', error);
        toast.error('Erro ao carregar dados do perfil');
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

      toast.success('Perfil atualizado com sucesso!');
      setIsEditing(false);

      // Refresh profile data
      const { data: updatedData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      console.log('Perfil atualizado:', updatedData);
      setProfile(updatedData);
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      toast.error('Erro ao salvar perfil');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        address: profile.address || '',
        city: profile.city || '',
        state: profile.state || '',
        cep: profile.cep || ''
      });
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] w-full">
        <div className="w-12 h-12 border-4 border-[#FF4B6B] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="space-y-6 w-full max-w-full overflow-hidden">
        {/* Header - Mobile Premium */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden bg-gradient-to-br from-[#1E1E1E]/90 to-[#171313]/90 backdrop-blur-xl p-5 md:p-6 rounded-2xl border border-gray-800/30 w-full"
        >
          <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-[#FF4B6B] to-[#8B31FF] rounded-xl p-3 shadow-lg">
                  <FiUser className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-transparent bg-clip-text break-words">
                  Meu Perfil
                </h1>
              </div>
              <p className="text-base md:text-lg text-gray-300 break-words">Gerencie suas informações pessoais</p>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Ativo</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Profile Form - Mobile Premium */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-[#1E1E1E]/40 backdrop-blur-xl p-5 md:p-6 rounded-2xl border border-gray-800/30 w-full"
        >
          <div className="flex flex-col gap-6 w-full">
            {/* Email Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FiMail className="w-5 h-5 text-[#8B31FF] flex-shrink-0" />
                <h2 className="text-lg font-semibold text-white">Email</h2>
              </div>
              <div className="bg-[#171313] rounded-xl p-4">
                <p className="text-gray-400 text-sm">Email da Conta</p>
                <p className="text-white font-medium break-all">{user?.email}</p>
                <p className="text-gray-500 text-xs mt-1">O email não pode ser alterado</p>
              </div>
            </div>

            {/* Personal Information */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FiUser className="w-5 h-5 text-[#8B31FF] flex-shrink-0" />
                  <h2 className="text-lg font-semibold text-white">Informações Pessoais</h2>
                </div>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#8B31FF]/10 text-[#8B31FF] rounded-xl hover:bg-[#8B31FF]/20 transition-colors duration-300 min-h-[44px]"
                  >
                    <FiEdit3 className="w-4 h-4" />
                    Editar
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-2 px-4 py-2 bg-[#8B31FF] text-white rounded-xl hover:bg-[#8B31FF]/80 transition-colors duration-300 disabled:opacity-50 min-h-[44px]"
                    >
                      {saving ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <FiSave className="w-4 h-4" />
                      )}
                      Salvar
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-600/10 text-gray-400 rounded-xl hover:bg-gray-600/20 transition-colors duration-300 min-h-[44px]"
                    >
                      <FiX className="w-4 h-4" />
                      Cancelar
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Nome Completo</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="w-full px-4 py-3 bg-[#171313] border border-gray-800/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#8B31FF] transition-colors duration-300 min-h-[52px]"
                      placeholder="Digite seu nome completo"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-[#171313] rounded-xl">
                      <p className="text-white break-words">{profile?.full_name || 'Não informado'}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Telefone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-[#171313] border border-gray-800/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#8B31FF] transition-colors duration-300 min-h-[52px]"
                      placeholder="(11) 99999-9999"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-[#171313] rounded-xl">
                      <p className="text-white break-words">{profile?.phone || 'Não informado'}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FiMapPin className="w-5 h-5 text-[#8B31FF] flex-shrink-0" />
                <h2 className="text-lg font-semibold text-white">Endereço</h2>
              </div>

              <div className="space-y-4 w-full">
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Endereço</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-4 py-3 bg-[#171313] border border-gray-800/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#8B31FF] transition-colors duration-300 min-h-[52px]"
                      placeholder="Rua, número, complemento"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-[#171313] rounded-xl">
                      <p className="text-white break-words">{profile?.address || 'Não informado'}</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Cidade</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-4 py-3 bg-[#171313] border border-gray-800/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#8B31FF] transition-colors duration-300 min-h-[52px]"
                        placeholder="São Paulo"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-[#171313] rounded-xl">
                        <p className="text-white break-words">{profile?.city || 'Não informado'}</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Estado</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full px-4 py-3 bg-[#171313] border border-gray-800/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#8B31FF] transition-colors duration-300 min-h-[52px]"
                        placeholder="SP"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-[#171313] rounded-xl">
                        <p className="text-white break-words">{profile?.state || 'Não informado'}</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">CEP</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.cep}
                        onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
                        className="w-full px-4 py-3 bg-[#171313] border border-gray-800/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#8B31FF] transition-colors duration-300 min-h-[52px]"
                        placeholder="00000-000"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-[#171313] rounded-xl">
                        <p className="text-white break-words">{profile?.cep && profile.cep.trim() !== '' ? profile.cep : 'Não informado'}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FiCalendar className="w-5 h-5 text-[#8B31FF] flex-shrink-0" />
                <h2 className="text-lg font-semibold text-white">Informações da Conta</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <div className="bg-[#171313] rounded-xl p-4">
                  <p className="text-gray-400 text-sm">Data de Criação</p>
                  <p className="text-white font-medium">
                    {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('pt-BR') : 'N/A'}
                  </p>
                </div>

                <div className="bg-[#171313] rounded-xl p-4">
                  <p className="text-gray-400 text-sm">Última Atualização</p>
                  <p className="text-white font-medium">
                    {profile?.updated_at ? new Date(profile.updated_at).toLocaleDateString('pt-BR') : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AuthGuard>
  );
} 