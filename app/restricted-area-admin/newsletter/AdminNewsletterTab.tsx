import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@/utils/supabase/client';
import { FiSearch, FiFilter, FiMail, FiTrash2, FiDownload, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import ConfirmModal from '@/components/ConfirmModal';

interface NewsletterSubscriber {
  id: string;
  email: string;
  source: 'site' | 'blog';
  subscribed_at: string;
  status: 'active' | 'inactive';
  created_at: string;
}

export default function AdminNewsletterTab() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setSubscribers(data || []);
    } catch (error) {
      console.error('Erro ao buscar inscritos:', error);
      toast.error('Erro ao carregar inscritos na newsletter');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (subscriberId: string, newStatus: 'active' | 'inactive') => {
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .update({ status: newStatus })
        .eq('id', subscriberId);
      
      if (error) throw error;
      toast.success('Status do inscrito atualizado com sucesso!');
      fetchSubscribers();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status do inscrito');
    }
  };

  const handleDeleteSubscriber = async (subscriberId: string) => {
    setConfirmMessage('Tem certeza que deseja remover este inscrito?');
    setConfirmAction(() => async () => {
      try {
        const { error } = await supabase
          .from('newsletter_subscribers')
          .delete()
          .eq('id', subscriberId);
        if (error) throw error;
        toast.success('Inscrito removido com sucesso!');
        fetchSubscribers();
      } catch (error) {
        console.error('Erro ao remover inscrito:', error);
        toast.error('Erro ao remover inscrito');
      }
      setShowConfirm(false);
    });
    setShowConfirm(true);
  };

  const handleBulkDelete = async () => {
    if (selectedSubscribers.length === 0) {
      toast.error('Selecione pelo menos um inscrito para remover');
      return;
    }
    setConfirmMessage(`Tem certeza que deseja remover ${selectedSubscribers.length} inscrito(s)?`);
    setConfirmAction(() => async () => {
      try {
        const { error } = await supabase
          .from('newsletter_subscribers')
          .delete()
          .in('id', selectedSubscribers);
        if (error) throw error;
        toast.success(`${selectedSubscribers.length} inscrito(s) removido(s) com sucesso!`);
        setSelectedSubscribers([]);
        fetchSubscribers();
      } catch (error) {
        console.error('Erro ao remover inscritos:', error);
        toast.error('Erro ao remover inscritos');
      }
      setShowConfirm(false);
    });
    setShowConfirm(true);
  };

  const handleSelectAll = () => {
    if (selectedSubscribers.length === filteredSubscribers.length) {
      setSelectedSubscribers([]);
    } else {
      setSelectedSubscribers(filteredSubscribers.map(s => s.id));
    }
  };

  const handleSelectSubscriber = (subscriberId: string) => {
    setSelectedSubscribers(prev => 
      prev.includes(subscriberId) 
        ? prev.filter(id => id !== subscriberId)
        : [...prev, subscriberId]
    );
  };

  const exportToCSV = () => {
    const headers = ['Email', 'Fonte', 'Status', 'Data de Inscrição'];
    const csvContent = [
      headers.join(','),
      ...filteredSubscribers.map(s => [
        s.email,
        s.source === 'site' ? 'Site' : 'Blog',
        s.status === 'active' ? 'Ativo' : 'Inativo',
        new Date(s.subscribed_at).toLocaleDateString('pt-BR')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `newsletter_subscribers_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredSubscribers = subscribers.filter(subscriber => {
    const matchesFilter = filter === 'all' || subscriber.status === filter || subscriber.source === filter;
    const matchesSearch = subscriber.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusIcon = (status: string) => {
    return status === 'active' 
      ? <FiCheckCircle className="w-4 h-4 text-green-500" />
      : <FiXCircle className="w-4 h-4 text-red-500" />;
  };

  const getStatusColor = (status: string) => {
    return status === 'active'
      ? 'bg-green-500/10 text-green-400 border-green-500/30'
      : 'bg-red-500/10 text-red-400 border-red-500/30';
  };

  const getSourceColor = (source: string) => {
    return source === 'site'
      ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
      : 'bg-purple-500/10 text-purple-400 border-purple-500/30';
  };

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
                <FiMail className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-transparent bg-clip-text leading-tight">
                Gerenciar Newsletter
              </h1>
            </div>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed">Gerencie inscritos e envie newsletters</p>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Total: {subscribers.length} inscritos</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar por email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#1E1E1E]/40 backdrop-blur-xl border border-gray-800/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#8B31FF] transition-colors duration-300"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-[#1E1E1E]/40 backdrop-blur-xl border border-gray-800/30 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#8B31FF] transition-colors duration-300"
          >
            <option value="all">Todos</option>
            <option value="active">Ativos</option>
            <option value="inactive">Inativos</option>
            <option value="site">Site</option>
            <option value="blog">Blog</option>
          </select>
        </div>
        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#31A8FF] to-[#8B31FF] text-white rounded-xl hover:opacity-90 transition-opacity duration-300"
        >
          <FiDownload className="w-4 h-4" />
          Exportar CSV
        </button>
      </div>

      {/* Bulk Actions */}
      {selectedSubscribers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1E1E1E]/40 backdrop-blur-xl p-4 rounded-xl border border-[#8B31FF]/30"
        >
          <div className="flex items-center justify-between">
            <span className="text-white">
              {selectedSubscribers.length} inscrito(s) selecionado(s)
            </span>
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300"
            >
              <FiTrash2 className="w-4 h-4" />
              Remover Selecionados
            </button>
          </div>
        </motion.div>
      )}

      {/* Subscribers List */}
      <div className="bg-[#1E1E1E]/40 backdrop-blur-xl rounded-2xl border border-gray-800/30 overflow-hidden">
        <div className="p-4 border-b border-gray-800/30">
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              checked={selectedSubscribers.length === filteredSubscribers.length && filteredSubscribers.length > 0}
              onChange={handleSelectAll}
              className="w-4 h-4 text-[#8B31FF] bg-gray-800 border-gray-600 rounded focus:ring-[#8B31FF] focus:ring-2"
            />
            <span className="text-gray-300 font-medium">Selecionar Todos</span>
          </div>
        </div>
        
        {filteredSubscribers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-500/10 flex items-center justify-center">
              <FiMail className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-400 text-lg">Nenhum inscrito encontrado</p>
          </motion.div>
        ) : (
          filteredSubscribers.map((subscriber) => (
            <motion.div
              key={subscriber.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 border-b border-gray-800/30 last:border-b-0 hover:bg-[#171313]/30 transition-colors duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <input
                    type="checkbox"
                    checked={selectedSubscribers.includes(subscriber.id)}
                    onChange={() => handleSelectSubscriber(subscriber.id)}
                    className="w-4 h-4 text-[#8B31FF] bg-gray-800 border-gray-600 rounded focus:ring-[#8B31FF] focus:ring-2"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="text-white font-medium">{subscriber.email}</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(subscriber.status)}`}>
                        {getStatusIcon(subscriber.status)}
                        <span className="ml-1">{subscriber.status === 'active' ? 'Ativo' : 'Inativo'}</span>
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSourceColor(subscriber.source)}`}>
                        {subscriber.source === 'site' ? 'Site' : 'Blog'}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">
                      Inscrito em: {new Date(subscriber.subscribed_at).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={subscriber.status}
                    onChange={(e) => handleStatusChange(subscriber.id, e.target.value as 'active' | 'inactive')}
                    className="bg-[#1E1E1E]/60 border border-gray-800/30 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:border-[#8B31FF] transition-colors duration-300"
                  >
                    <option value="active">Ativo</option>
                    <option value="inactive">Inativo</option>
                  </select>
                  <button
                    onClick={() => handleDeleteSubscriber(subscriber.id)}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-300"
                    title="Remover inscrito"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Modal de confirmação moderno */}
      <ConfirmModal
        open={showConfirm}
        message={confirmMessage}
        confirmText="Remover"
        cancelText="Cancelar"
        onConfirm={() => { if (confirmAction) confirmAction(); }}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
} 