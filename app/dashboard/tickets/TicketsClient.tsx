'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/app/hooks/useAuth';
import { FiPlus, FiMessageSquare, FiClock, FiCheckCircle, FiAlertCircle, FiX, FiSend, FiInbox } from 'react-icons/fi';

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'Aberto' | 'Em Análise' | 'Resolvido' | 'Finalizado';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
}

export default function TicketsClient() {
  const { user } = useAuth();
  const supabase = createClient();
  const [filter, setFilter] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newTicket, setNewTicket] = useState({ title: '', description: '', priority: 'medium' as const });
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Queries e Realtime
  const { data: tickets = [], refetch, isLoading } = useQuery({
    queryKey: ['tickets', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase.from('tickets').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      if (error) throw error;
      return data as Ticket[];
    },
    enabled: !!user
  });

  useEffect(() => {
    if (!user) return;
    const channel = supabase.channel('tickets-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tickets' }, () => refetch())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, refetch, supabase]);

  // Carregar mensagens quando abrir modal
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedTicket) return;
      setLoadingMessages(true);
      const { data } = await supabase.from('ticket_messages').select('*').eq('ticket_id', selectedTicket.id).order('created_at', { ascending: true });
      setMessages(data || []);
      setLoadingMessages(false);
    };
    if (selectedTicket && showTicketModal) fetchMessages();
  }, [selectedTicket, showTicketModal, supabase]);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      if (!user) throw new Error('Usuário não autenticado');

      const { data: ticket, error } = await supabase.from('tickets').insert([{
        title: newTicket.title, status: 'Aberto', user_id: user.id, priority: newTicket.priority
      }]).select().single();

      if (error) throw error;

      await supabase.from('ticket_messages').insert({ ticket_id: ticket.id, content: newTicket.description, user_id: user.id });

      setNewTicket({ title: '', description: '', priority: 'medium' });
      setShowCreateForm(false);
      refetch();
      toast.success('Ticket criado!');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsCreating(false);
    }
  };

  const statusConfig = (status: string) => {
    switch (status) {
      case 'Aberto': return { color: 'yellow', icon: FiClock };
      case 'Em Análise': return { color: 'blue', icon: FiClock };
      case 'Resolvido': return { color: 'green', icon: FiCheckCircle };
      case 'Finalizado': return { color: 'gray', icon: FiCheckCircle };
      default: return { color: 'gray', icon: FiClock };
    }
  };

  const priorityLabel = (p: string) => ({ low: 'Baixa', medium: 'Média', high: 'Alta' }[p] || p);
  const priorityColor = (p: string) => ({ low: 'text-green-400', medium: 'text-yellow-400', high: 'text-red-400' }[p] || 'text-gray-400');

  const filteredTickets = tickets.filter(t => filter === 'all' || t.status === filter);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Suporte Técnico</h1>
          <p className="text-slate-400">Abra chamados e acompanhe suas solicitações.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <select
            value={filter} onChange={e => setFilter(e.target.value)}
            className="bg-[#121218] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#8B31FF] flex-1 md:w-48 appearance-none cursor-pointer"
          >
            <option value="all">Todos os Tickets</option>
            <option value="Aberto">Abertos</option>
            <option value="Em Análise">Em Análise</option>
            <option value="Resolvido">Resolvidos</option>
          </select>
          <button onClick={() => setShowCreateForm(true)} className="flex items-center gap-2 px-6 py-2.5 bg-[#8B31FF] hover:bg-[#7A20EE] text-white rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(139,49,255,0.2)] whitespace-nowrap">
            <FiPlus /> Novo Ticket
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredTickets.length > 0 ? filteredTickets.map((ticket, i) => {
            const { color, icon: Icon } = statusConfig(ticket.status);
            return (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => { setSelectedTicket(ticket); setShowTicketModal(true); }}
                className="bg-[#121218]/60 backdrop-blur-md border border-white/5 rounded-2xl p-6 hover:border-[#8B31FF]/30 transition-all cursor-pointer group hover:-translate-y-1"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-xl bg-${color}-500/10 text-${color}-400 border border-${color}-500/20`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded bg-white/5 border border-white/10 ${priorityColor(ticket.priority)}`}>
                    {priorityLabel(ticket.priority)}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{ticket.title}</h3>
                <p className="text-slate-400 text-sm line-clamp-2 mb-4 h-10">{ticket.description}</p>

                <div className="flex justify-between items-center text-xs text-slate-500 border-t border-white/5 pt-4">
                  <span>#{ticket.id.slice(0, 6)}</span>
                  <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                </div>
              </motion.div>
            );
          }) : (
            <div className="col-span-full py-20 text-center opacity-50 flex flex-col items-center">
              <FiInbox className="w-16 h-16 text-slate-600 mb-4" />
              <p className="text-xl text-white font-bold">Nenhum ticket encontrado</p>
              <p className="text-slate-400">Use o botão acima para abrir um chamado.</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-[#121218] border border-white/10 rounded-3xl p-8 max-w-lg w-full relative">
              <button onClick={() => setShowCreateForm(false)} className="absolute top-6 right-6 text-slate-400 hover:text-white"><FiX size={24} /></button>
              <h2 className="text-2xl font-bold text-white mb-6">Novo Ticket</h2>
              <form onSubmit={handleCreateTicket} className="space-y-4">
                <div>
                  <label className="text-sm text-slate-400 mb-1 block">Assunto</label>
                  <input type="text" value={newTicket.title} onChange={e => setNewTicket({ ...newTicket, title: e.target.value })} className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#8B31FF] outline-none" required />
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-1 block">Prioridade</label>
                  <select value={newTicket.priority} onChange={e => setNewTicket({ ...newTicket, priority: e.target.value as any })} className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#8B31FF] outline-none appearance-none">
                    <option value="low">Baixa</option>
                    <option value="medium">Média</option>
                    <option value="high">Alta</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-1 block">Descrição</label>
                  <textarea value={newTicket.description} onChange={e => setNewTicket({ ...newTicket, description: e.target.value })} rows={4} className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#8B31FF] outline-none resize-none" required />
                </div>
                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setShowCreateForm(false)} className="px-5 py-2.5 rounded-xl border border-white/10 text-white hover:bg-white/5">Cancelar</button>
                  <button type="submit" disabled={isCreating} className="px-6 py-2.5 rounded-xl bg-[#8B31FF] text-white font-bold hover:bg-[#7A20EE] disabled:opacity-50">{isCreating ? 'Enviando...' : 'Criar Chamado'}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Details/Chat Modal */}
      <AnimatePresence>
        {showTicketModal && selectedTicket && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={() => setShowTicketModal(false)}>
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} onClick={e => e.stopPropagation()} className="bg-[#121218] border border-white/10 rounded-3xl w-full max-w-3xl h-[80vh] flex flex-col overflow-hidden relative">
              {/* Header */}
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#1A1A22]">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">{selectedTicket.title}</h2>
                  <p className="text-sm text-slate-400 flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${{ 'Aberto': 'bg-yellow-500', 'Em Análise': 'bg-blue-500', 'Resolvido': 'bg-green-500' }[selectedTicket.status] || 'bg-gray-500'}`}></span>
                    {selectedTicket.status} • #{selectedTicket.id.slice(0, 8)}
                  </p>
                </div>
                <button onClick={() => setShowTicketModal(false)} className="p-2 hover:bg-white/5 rounded-full"><FiX className="text-white" size={24} /></button>
              </div>

              {/* Chat Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[#0A0A0F]">
                {loadingMessages ? (
                  <div className="flex justify-center"><div className="w-8 h-8 border-2 border-[#8B31FF] border-t-transparent rounded-full animate-spin"></div></div>
                ) : messages.length > 0 ? (
                  messages.map((msg) => {
                    const isMe = msg.user_id === user?.id; // Assumindo que user_id da mensagem é de quem enviou
                    // Se for suporte, user_id seria diferente. Mas a lógica original salvava com user_id do criador para a descrição inicial.
                    // Em um sistema real, suporte teria ID diferente.
                    // Vou assumir que user_id == user.id é 'Eu'.
                    return (
                      <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        <div className={`p-4 rounded-2xl max-w-[80%] ${isMe ? 'bg-[#8B31FF]/20 text-white rounded-tr-none border border-[#8B31FF]/30' : 'bg-[#1E1E24] text-slate-200 rounded-tl-none border border-white/5'}`}>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        </div>
                        <span className="text-[10px] text-slate-600 mt-2 px-1">{new Date(msg.created_at).toLocaleString()}</span>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-center text-slate-500">Sem mensagens.</p>
                )}
              </div>

              {/* Input Area (Mockup for now, as DB structure for replies wasn't fully detailed in previous files) */}
              <div className="p-4 bg-[#1A1A22] border-t border-white/5">
                <div className="relative">
                  <input type="text" placeholder="Digite sua resposta... (Funcionalidade em breve)" disabled className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl pl-4 pr-12 py-3.5 text-white focus:border-[#8B31FF] outline-none disabled:opacity-50 disabled:cursor-not-allowed" />
                  <button disabled className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#8B31FF] rounded-lg text-white disabled:opacity-50"><FiSend className="w-4 h-4" /></button>
                </div>
                <p className="text-[10px] text-center text-slate-600 mt-2">Para suporte imediato, contate via WhatsApp.</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}