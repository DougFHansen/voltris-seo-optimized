import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import ConfirmModal from '@/components/ConfirmModal';
import { FiTrash2, FiUserX, FiUserCheck, FiUserPlus, FiUsers } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

interface UserProfile {
  id: string;
  login: string | null;
  full_name: string | null;
  phone: string | null;
  city: string | null;
  neighborhood: string | null;
  state: string | null;
  cep: string | null;
  created_at: string;
  is_blocked: boolean;
  is_deleted: boolean;
  email?: string | null;
}

const AdminUsersTab: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.from('profiles').select('*');
    if (!error && data) {
      setUsers(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleBlockToggle = async (user: UserProfile) => {
    setActionLoading(user.id);
    const supabase = createClient();
    await supabase.from('profiles').update({ is_blocked: !user.is_blocked }).eq('id', user.id);
    await fetchUsers();
    setActionLoading(null);
  };

  const handleDeleteToggle = (user: UserProfile) => {
    setConfirmMessage(user.is_deleted ? 'Tem certeza que deseja restaurar este usuário?' : 'Tem certeza que deseja excluir este usuário?');
    setConfirmAction(() => async () => {
      setActionLoading(user.id);
      const supabase = createClient();
      const { error } = await supabase.from('profiles').update({ is_deleted: !user.is_deleted }).eq('id', user.id);
      if (error) {
        toast.error('Erro ao atualizar usuário: ' + error.message);
        console.error('Erro ao atualizar usuário:', error);
        setActionLoading(null);
        return;
      }
      await fetchUsers();
      setActionLoading(null);
      setShowConfirm(false);
      toast.success(user.is_deleted ? 'Usuário restaurado com sucesso!' : 'Usuário excluído com sucesso!');
    });
    setShowConfirm(true);
  };

  const displayedUsers = users.filter(user => !user.is_deleted);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-12 h-12 border-4 border-[#FF4B6B] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header otimizado */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative bg-gradient-to-br from-[#1E1E1E]/90 to-[#171313]/90 backdrop-blur-xl p-6 rounded-2xl border border-gray-800/30"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-3">
              <div className="bg-gradient-to-br from-[#FF4B6B] to-[#8B31FF] rounded-xl p-3 shadow-lg">
                <FiUsers className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-transparent bg-clip-text leading-tight">
                Gerenciar Usuários
              </h1>
            </div>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed">Visualize e gerencie todos os usuários cadastrados</p>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Total: {displayedUsers.length} usuários</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabela de usuários - layout fluido */}
      <div className="bg-gradient-to-br from-[#1E1E1E]/60 to-[#171313]/60 backdrop-blur-xl rounded-xl border border-gray-800/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="text-left bg-[#1E1E1E]/80">
                <th className="px-6 py-4 text-sm font-semibold text-gray-300">Login</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-300">Nome Completo</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-300">E-mail</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-300">Telefone</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-300">Cidade</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-300">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-300">Ações</th>
              </tr>
            </thead>
            <tbody>
              {displayedUsers.map((user) => {
                const formattedDate = new Date(user.created_at).toLocaleDateString('pt-BR');
                return (
                  <tr key={user.id} className="border-b border-gray-800/30 hover:bg-[#282828]/50 transition-colors duration-300">
                    <td className="px-6 py-4 text-sm text-white">{user.login || '-'}</td>
                    <td className="px-6 py-4 text-sm text-white">{user.full_name || '-'}</td>
                    <td className="px-6 py-4 text-sm text-white">{user.email || '-'}</td>
                    <td className="px-6 py-4 text-sm text-white">{user.phone || '-'}</td>
                    <td className="px-6 py-4 text-sm text-white">{user.city || '-'}</td>
                    <td className="px-6 py-4">
                      {user.is_deleted ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/30">
                          Excluído
                        </span>
                      ) : user.is_blocked ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/30">
                          Bloqueado
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/30">
                          Ativo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors duration-300 ${
                            user.is_blocked 
                              ? 'bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30' 
                              : 'bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                          }`}
                          onClick={() => handleBlockToggle(user)}
                          disabled={actionLoading === user.id}
                        >
                          {user.is_blocked ? <FiUserCheck size={16} /> : <FiUserX size={16} />}
                          {user.is_blocked ? 'Desbloquear' : 'Bloquear'}
                        </button>
                        <button
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors duration-300 ${
                            user.is_deleted 
                              ? 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                              : 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}
                          onClick={() => handleDeleteToggle(user)}
                          disabled={actionLoading === user.id}
                        >
                          {user.is_deleted ? <FiUserPlus size={16} /> : <FiTrash2 size={16} />}
                          {user.is_deleted ? 'Restaurar' : 'Excluir'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        open={showConfirm}
        message={confirmMessage}
        confirmText="Confirmar"
        cancelText="Cancelar"
        onConfirm={() => { if (confirmAction) confirmAction(); }}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
};

export default AdminUsersTab; 