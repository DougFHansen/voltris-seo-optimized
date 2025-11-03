'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/app/hooks/useAuth';

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'Aberto' | 'Em Análise' | 'Resolvido' | 'Finalizado';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
}

export default function TicketsTab() {
  const { user } = useAuth();
  console.log('[DEBUG] Usuário logado:', user);
  const [filter, setFilter] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newTicket, setNewTicket] = useState<{
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
  }>({
    title: '',
    description: '',
    priority: 'medium'
  });
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedTicket) return;
      setLoadingMessages(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from('ticket_messages')
        .select('*')
        .eq('ticket_id', selectedTicket.id)
        .order('created_at', { ascending: true });
      if (!error && data) setMessages(data);
      setLoadingMessages(false);
    };
    if (selectedTicket && showTicketModal) fetchMessages();
  }, [selectedTicket, showTicketModal]);

  const supabase = createClient();

  // Primeiro o useQuery
  const { data: tickets = [], isLoading, refetch } = useQuery({
    queryKey: ['tickets', user?.id],
    queryFn: async () => {
      console.log('[ReactQuery] Buscando tickets do usuário...');
      if (!user) return [];
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  // Depois o useEffect do realtime
  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    let channel: any;

    async function setupRealtime() {
      channel = supabase.channel('tickets-realtime')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'tickets',
          },
          (payload) => {
            console.log('[Realtime] Evento recebido:', payload);
            refetch();
          }
        )
        .subscribe();
    }
    setupRealtime();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [user, refetch]);

  const filteredTickets = tickets.filter(ticket => {
    if (filter === 'all') return true;
    return ticket.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aberto':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'Em Análise':
        return 'bg-blue-500/10 text-blue-500';
      case 'Resolvido':
        return 'bg-green-500/10 text-green-500';
      case 'Finalizado':
        return 'bg-gray-500/10 text-gray-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/10 text-red-500';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'low':
        return 'bg-green-500/10 text-green-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  // Função para traduzir prioridade
  const traduzirPrioridade = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return priority;
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Usuário autenticado:', user);
      console.log('user_id enviado:', user!.id);
      if (!user) throw new Error('Usuário não autenticado');

      const priorityValue = ['low', 'medium', 'high'].includes(newTicket.priority) ? newTicket.priority : 'medium';
      const ticketData = {
        title: newTicket.title,
        status: 'Aberto' as const,
        user_id: user!.id,
        priority: priorityValue
      };

      // Criar o ticket
      const { data: ticket, error: ticketError } = await supabase
        .from('tickets')
        .insert([ticketData])
        .select()
        .single();

      if (ticketError) {
        console.error('Erro detalhado do Supabase:', ticketError);
        throw new Error(ticketError.message || 'Erro ao criar ticket');
      }

      // Adicionar a descrição como primeira mensagem
      const { error: messageError } = await supabase
        .from('ticket_messages')
        .insert({
          ticket_id: ticket.id,
          content: newTicket.description,
          user_id: user!.id
        });

      if (messageError) {
        console.error('Erro ao adicionar mensagem:', messageError);
        throw new Error(messageError.message || 'Erro ao adicionar mensagem inicial');
      }

      setNewTicket({
        title: '',
        description: '',
        priority: 'medium'
      });
      setShowCreateForm(false);
      refetch();
      toast.success('Ticket criado com sucesso!');
    } catch (error: any) {
      console.error('Erro ao criar ticket:', error);
      toast.error(error.message || 'Erro ao criar ticket');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF]">
            Meus Tickets
          </h1>
          <p className="text-gray-400 mt-1">Gerencie seus tickets de suporte</p>
        </div>
        <div className="flex gap-2 items-center">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-[#1E1E1E] border border-gray-800/50 rounded-lg px-4 py-2 text-gray-300 focus:outline-none focus:border-[#8B31FF]"
          >
            <option value="all">Todos os Status</option>
            <option value="Aberto">Abertos</option>
            <option value="Em Análise">Em Análise</option>
            <option value="Resolvido">Resolvidos</option>
            <option value="Finalizado">Finalizados</option>
          </select>
          <button
            onClick={() => {
              setShowCreateForm(true);
              setIsCreating(false);
            }}
            className="px-4 py-2 bg-gradient-to-r from-[#FF4B6B] to-[#8B31FF] text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Novo Ticket
          </button>
        </div>
      </motion.div>

      {showCreateForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[#1E1E1E] rounded-xl border border-gray-800/50 shadow-lg shadow-black/20 overflow-hidden"
        >
          <div className="p-6">
            <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B6B] to-[#8B31FF] mb-4">
              Criar Novo Ticket
            </h2>
            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Título
                </label>
                <input
                  type="text"
                  value={newTicket.title}
                  onChange={(e) => setNewTicket(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-[#171313] border border-gray-800/50 rounded-lg px-4 py-2 text-gray-300 focus:outline-none focus:border-[#8B31FF]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Descrição
                </label>
                <textarea
                  value={newTicket.description}
                  onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-[#171313] border border-gray-800/50 rounded-lg px-4 py-2 text-gray-300 focus:outline-none focus:border-[#8B31FF] h-32"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Prioridade
                </label>
                <select
                  value={newTicket.priority}
                  onChange={(e) => setNewTicket(prev => ({ ...prev, priority: e.target.value as 'low' | 'medium' | 'high' }))}
                  className="w-full bg-[#171313] border border-gray-800/50 rounded-lg px-4 py-2 text-gray-300 focus:outline-none focus:border-[#8B31FF]"
                >
                  <option value="low">Baixa</option>
                  <option value="medium">Média</option>
                  <option value="high">Alta</option>
                </select>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setIsCreating(false);
                  }}
                  className="px-4 py-2 border border-gray-800/50 text-gray-300 rounded-lg hover:bg-[#8B31FF]/10 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-4 py-2 bg-gradient-to-r from-[#FF4B6B] to-[#8B31FF] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isCreating ? 'Criando...' : 'Criar Ticket'}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-[#1E1E1E] rounded-xl border border-gray-800/50 shadow-lg shadow-black/20 overflow-hidden"
      >
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-6 text-center text-gray-400">Carregando tickets...</div>
          ) : filteredTickets.length === 0 ? (
            <div className="p-6 text-center text-gray-400">Nenhum ticket encontrado</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-800/50">
              <thead className="bg-[#171313]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Título
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Prioridade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {filteredTickets.map((ticket) => (
                  <motion.tr
                    key={ticket.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-[#171313]/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {ticket.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap ${getPriorityColor(ticket.priority)}`}>
                      {traduzirPrioridade(ticket.priority)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {new Date(ticket.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        className="px-3 py-1 bg-gradient-to-r from-[#31A8FF] to-[#8B31FF] text-white rounded-lg text-xs font-bold hover:scale-105 transition"
                        onClick={() => { setSelectedTicket(ticket); setShowTicketModal(true); }}
                      >
                        Detalhes
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>

      {showTicketModal && selectedTicket && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gradient-to-br from-[#1E1E1E] to-[#171313] rounded-2xl border border-gray-800/50 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-bold text-white">Detalhes do Ticket</h2>
              <button
                onClick={() => setShowTicketModal(false)}
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <span className="text-gray-400 text-sm">Título</span>
                <p className="text-white font-semibold">{selectedTicket.title}</p>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Descrição</span>
                <p className="text-white">{selectedTicket.description || 'Sem descrição'}</p>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Status</span>
                <p className="text-white">{selectedTicket.status}</p>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Prioridade</span>
                <p className="text-white">{traduzirPrioridade(selectedTicket.priority)}</p>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Data de Criação</span>
                <p className="text-white">{new Date(selectedTicket.created_at).toLocaleString('pt-BR')}</p>
              </div>
              <div>
                <span className="text-gray-400 text-sm font-bold">Mensagens do Ticket</span>
                <div className="bg-[#181818] rounded-lg p-4 mt-2 max-h-60 overflow-y-auto space-y-3 border border-gray-800/30">
                  {loadingMessages ? (
                    <p className="text-gray-500 text-sm">Carregando mensagens...</p>
                  ) : messages.length === 0 ? (
                    <p className="text-gray-500 text-sm">Nenhuma mensagem ainda.</p>
                  ) : (
                    messages.map(msg => (
                      <div key={msg.id} className="flex flex-col gap-1">
                        <span className="text-xs text-gray-400">{msg.created_at ? new Date(msg.created_at).toLocaleString('pt-BR') : ''}</span>
                        <span className="text-white text-sm">{msg.content}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}