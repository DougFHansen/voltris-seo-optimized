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
  
  // Estados de Paginação
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const fetchUsers = async () => {
    setLoading(true);
    const supabase = createClient();
    
    // Buscar com contagem e range para paginação
    const { data, error, count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(page * pageSize, (page + 1) * pageSize - 1);

    if (!error && data) {
      setUsers(data);
      if (count !== null) setTotalCount(count);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleBlockToggle = async (user: UserProfile) => {
    setActionLoading(user.id);
    const supabase = createClient();
    await supabase.from('profiles').update({ is_blocked: !user.is_blocked, updated_at: new Date().toISOString() }).eq('id', user.id);
    await fetchUsers();
    setActionLoading(null);
  };

  const handleDeleteToggle = (user: UserProfile) => {
    setConfirmMessage(user.is_deleted ? 'Tem certeza que deseja restaurar este usuário?' : 'Tem certeza que deseja excluir este usuário?');
    setConfirmAction(() => async () => {
      setActionLoading(user.id);
      const supabase = createClient();
      const { error } = await supabase.from('profiles').update({ 
        is_deleted: !user.is_deleted,
        updated_at: new Date().toISOString()
      }).eq('id', user.id);
      
      if (error) {
        toast.error('Erro ao atualizar usuário: ' + error.message);
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

  const displayedUsers = users; // Removido filtro manual para respeitar paginação do server

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-12 h-12 border-4 border-[#FF4B6B] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
          <div className="flex flex-col items-end gap-2 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Total no sistema: {totalCount} usuários</span>
            </div>
            <div className="text-xs text-gray-500 italic">Página {page + 1} de {Math.ceil(totalCount / pageSize)}</div>
          </div>
        </div>
      </motion.div>

      <div className="bg-gradient-to-br from-[#1E1E1E]/60 to-[#171313]/60 backdrop-blur-xl rounded-xl border border-gray-800/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="text-left bg-[#1E1E1E]/80">
                <th className="px-6 py-4 text-sm font-semibold text-gray-300">Login</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-300">Nome Completo</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-300">E-mail</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-300">Cidade/UF</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-300">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-300">Ações</th>
              </tr>
            </thead>
            <tbody>
              {displayedUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-800/30 hover:bg-[#282828]/50 transition-colors duration-300">
                  <td className="px-6 py-4 text-sm text-white">{user.login || '-'}</td>
                  <td className="px-6 py-4 text-sm text-white font-medium">{user.full_name || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{user.email || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{user.city ? `${user.city}/${user.state}` : '-'}</td>
                  <td className="px-6 py-4">
                    {user.is_deleted ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] uppercase font-bold bg-gray-500/10 text-gray-400 border border-gray-500/20">
                        Removido
                      </span>
                    ) : user.is_blocked ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] uppercase font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                        Bloqueado
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] uppercase font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                        Ativo
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        title={user.is_blocked ? 'Desbloquear' : 'Bloquear'}
                        className={`p-2 rounded-lg transition-all ${
                          user.is_blocked 
                            ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20' 
                            : 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20'
                        }`}
                        onClick={() => handleBlockToggle(user)}
                        disabled={actionLoading === user.id}
                      >
                        {user.is_blocked ? <FiUserCheck size={18} /> : <FiUserX size={18} />}
                      </button>
                      <button
                        title={user.is_deleted ? 'Restaurar' : 'Excluir'}
                        className={`p-2 rounded-lg transition-all ${
                          user.is_deleted 
                            ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20' 
                            : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                        }`}
                        onClick={() => handleDeleteToggle(user)}
                        disabled={actionLoading === user.id}
                      >
                        {user.is_deleted ? <FiUserPlus size={18} /> : <FiTrash2 size={18} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Controles de Paginação */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#1E1E1E]/40 border-t border-gray-800/30">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0 || loading}
            className="px-4 py-2 text-sm font-medium text-gray-400 bg-gray-800/50 rounded-lg disabled:opacity-50 hover:bg-gray-800 transition-colors"
          >
            Anterior
          </button>
          <div className="flex gap-2">
            {[...Array(Math.ceil(totalCount / pageSize))].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                  page === i ? 'bg-[#FF4B6B] text-white shadow-lg shadow-[#FF4B6B]/20' : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'
                }`}
              >
                {i + 1}
              </button>
            )).slice(Math.max(0, page - 2), Math.min(Math.ceil(totalCount / pageSize), page + 3))}
          </div>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={(page + 1) * pageSize >= totalCount || loading}
            className="px-4 py-2 text-sm font-medium text-gray-400 bg-gray-800/50 rounded-lg disabled:opacity-50 hover:bg-gray-800 transition-colors"
          >
            Próxima
          </button>
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