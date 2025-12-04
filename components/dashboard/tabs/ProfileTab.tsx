'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/app/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { toast } from 'react-hot-toast';

interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  created_at: string;
}

export default function ProfileTab() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip_code: ''
  });

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setProfile(profile);
        setFormData({
          full_name: profile?.full_name || '',
          phone: profile?.phone || '',
          address: profile?.address || '',
          city: profile?.city || '',
          state: profile?.state || '',
          zip_code: profile?.zip_code || ''
        });
      }
      setIsLoading(false);
    };
    getUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', user?.id);

      if (error) throw error;

      setProfile({ ...profile, ...formData } as Profile);
      setIsEditing(false);
      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar perfil');
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B31FF]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF]">
            Meu Perfil
          </h1>
          <p className="text-gray-400 mt-1">Gerencie suas informações pessoais</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 bg-[#8B31FF] text-white rounded-lg hover:bg-[#7B21FF] transition-colors"
        >
          {isEditing ? 'Cancelar' : 'Editar Perfil'}
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-[#1E1E1E] rounded-xl border border-gray-800/50 shadow-lg shadow-black/20 overflow-hidden"
      >
        <div className="p-6">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full bg-[#171313] border border-gray-800/50 rounded-lg px-4 py-2 text-gray-300 focus:outline-none focus:border-[#8B31FF]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-[#171313] border border-gray-800/50 rounded-lg px-4 py-2 text-gray-300 focus:outline-none focus:border-[#8B31FF]"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Endereço
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full bg-[#171313] border border-gray-800/50 rounded-lg px-4 py-2 text-gray-300 focus:outline-none focus:border-[#8B31FF]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Cidade
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full bg-[#171313] border border-gray-800/50 rounded-lg px-4 py-2 text-gray-300 focus:outline-none focus:border-[#8B31FF]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Estado
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full bg-[#171313] border border-gray-800/50 rounded-lg px-4 py-2 text-gray-300 focus:outline-none focus:border-[#8B31FF]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    CEP
                  </label>
                  <input
                    type="text"
                    name="zip_code"
                    value={formData.zip_code}
                    onChange={handleChange}
                    className="w-full bg-[#171313] border border-gray-800/50 rounded-lg px-4 py-2 text-gray-300 focus:outline-none focus:border-[#8B31FF]"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 bg-gradient-to-r from-[#FF4B6B] to-[#8B31FF] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Nome Completo</h3>
                <p className="text-gray-300">{profile?.full_name || 'Não informado'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Email</h3>
                <p className="text-gray-300">{user?.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Telefone</h3>
                <p className="text-gray-300">{profile?.phone || 'Não informado'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Endereço</h3>
                <p className="text-gray-300">{profile?.address || 'Não informado'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Cidade</h3>
                <p className="text-gray-300">{profile?.city || 'Não informado'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Estado</h3>
                <p className="text-gray-300">{profile?.state || 'Não informado'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">CEP</h3>
                <p className="text-gray-300">{profile?.zip_code || 'Não informado'}</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}