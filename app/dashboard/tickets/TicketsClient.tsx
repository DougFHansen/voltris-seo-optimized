'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/app/hooks/useAuth';
import { 
  FiPlus, FiMessageSquare, FiClock, FiCheckCircle, 
  FiAlertCircle, FiX, FiSend, FiInbox, FiFilter,
  FiTerminal, FiActivity, FiArrowRight, FiShield
} from 'react-icons/fi';
import { useDashboard } from '@/app/context/DashboardContext';

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
  const { transparencyMode } = useDashboard();
  const { user } = useAuth();
  const supabase = useMemo(() => createClient(), []);
  const [filter, setFilter] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newTicket, setNewTicket] = useState({ title: '', description: '', priority: 'medium' as const });
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [replyText, setReplyText] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);

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

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedTicket) return;
      const { data } = await supabase.from('ticket_messages').select('*').eq('ticket_id', selectedTicket.id).order('created_at', { ascending: true });
      setMessages(data || []);
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
      toast.success('Ticket de suporte aberto!', {
        icon: '🎫',
        style: { background: 'rgba(10, 10, 15, 0.9)', color: '#fff', border: '1px solid rgba(49, 168, 255, 0.2)' }
      });
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedTicket || !user) return;
    setIsSendingReply(true);
    try {
      const { error } = await supabase.from('ticket_messages').insert({
        ticket_id: selectedTicket.id,
        content: replyText,
        user_id: user.id
      });
      if (error) throw error;
      setReplyText('');
      const { data } = await supabase.from('ticket_messages').select('*').eq('ticket_id', selectedTicket.id).order('created_at', { ascending: true });
      setMessages(data || []);
    } catch (error) {
       toast.error('Falha ao enviar mensagem');
    } finally {
       setIsSendingReply(false);
    }
  };

  const statusConfig = (status: string) => {
    switch (status) {
      case 'Aberto': return { color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20', icon: FiClock };
      case 'Em Análise': return { color: 'text-[#31A8FF]', bg: 'bg-[#31A8FF]/10', border: 'border-[#31A8FF]/20', icon: FiActivity };
      case 'Resolvido': return { color: 'text-[#00FF88]', bg: 'bg-[#00FF88]/10', border: 'border-[#00FF88]/20', icon: FiCheckCircle };
      case 'Finalizado': return { color: 'text-slate-400', bg: 'bg-slate-400/10', border: 'border-slate-400/10', icon: FiShield };
      default: return { color: 'text-slate-400', bg: 'bg-slate-400/10', border: 'border-slate-400/10', icon: FiInbox };
    }
  };

  const filteredTickets = tickets.filter(t => filter === 'all' || t.status === filter);

  return (
    <div className="flex flex-col gap-10">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
        <div className="space-y-2">
           <div className="flex items-center gap-3">
             <div className="w-2 h-8 bg-gradient-to-b from-[#8B31FF] to-[#31A8FF] rounded-full"></div>
             <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Command <span className="text-[#8B31FF] not-italic">Support</span></h2>
           </div>
           <p className="text-white/40 font-bold text-xs uppercase tracking-[0.2em] pl-5 font-mono">Neural interface for technical assistance</p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
           <div className="relative group flex-1 md:flex-none">
              <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-[#8B31FF] transition-colors" />
              <select 
                value={filter} 
                onChange={e => setFilter(e.target.value)}
                className="w-full md:w-56 pl-11 pr-6 py-4 rounded-2xl bg-[#0A0A10]/50 border border-white/5 text-white/40 group-hover:text-white font-black uppercase text-[10px] tracking-widest focus:outline-none focus:border-[#8B31FF] transition-all appearance-none cursor-pointer"
              >
                <option value="all">ALL FREQUENCIES</option>
                <option value="Aberto">OPEN NODES</option>
                <option value="Em Análise">UNDER REVIEW</option>
                <option value="Resolvido">RESOLVED</option>
              </select>
           </div>
           <button 
             onClick={() => setShowCreateForm(true)}
             className="flex items-center gap-3 px-8 py-4 bg-white text-black font-black uppercase italic tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-3xl text-xs whitespace-nowrap"
           >
              <FiPlus className="w-4 h-4" />
              Open Sublink
           </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-6 opacity-30">
          <div className="w-16 h-16 border-t-4 border-r-4 border-[#8B31FF] rounded-full animate-spin"></div>
          <p className="font-black uppercase tracking-[0.3em] text-[10px]">Scanning Uplinks...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredTickets.length > 0 ? (
              filteredTickets.map((ticket, i) => {
                const config = statusConfig(ticket.status);
                const Icon = config.icon;
                return (
                  <motion.div
                    key={ticket.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ y: -5 }}
                    onClick={() => { setSelectedTicket(ticket); setShowTicketModal(true); }}
                    className={`group p-8 rounded-[3rem] border transition-all duration-500 cursor-pointer overflow-hidden ${transparencyMode ? 'voltris-glass' : 'bg-[#12121A] border-white/5 shadow-2xl'} hover:border-[#8B31FF]/40`}
                  >
                    <div className="relative z-10 flex flex-col h-full gap-6">
                       <div className="flex justify-between items-start">
                          <div className={`p-4 rounded-2xl ${config.bg} ${config.border} ${config.color} shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                             <Icon className="w-6 h-6" />
                          </div>
                          <div className="flex flex-col items-end">
                             <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">Priority</span>
                             <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border border-white/5 ${ticket.priority === 'high' ? 'text-red-400 bg-red-400/5' : ticket.priority === 'medium' ? 'text-amber-400 bg-amber-400/5' : 'text-emerald-400 bg-emerald-400/5'}`}>
                                {ticket.priority.toUpperCase()}
                             </span>
                          </div>
                       </div>

                       <div className="space-y-2">
                         <h3 className="text-xl font-black text-white uppercase italic tracking-tighter truncate leading-none">{ticket.title}</h3>
                         <p className="text-white/30 text-xs font-bold line-clamp-2 leading-relaxed uppercase tracking-wider">{ticket.description}</p>
                       </div>

                       <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                          <div className="flex flex-col">
                             <span className="text-[9px] font-black text-white/10 uppercase tracking-widest">ID Hash</span>
                             <span className="text-[10px] font-black text-[#8B31FF] uppercase font-mono tracking-widest">#{ticket.id.slice(0, 6)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-white/20 group-hover:text-white transition-colors">
                             <span className="text-[10px] font-black uppercase tracking-widest italic">Review Transmission</span>
                             <FiArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                          </div>
                       </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className={`col-span-full p-24 rounded-[4rem] text-center border border-white/5 flex flex-col items-center gap-8 ${transparencyMode ? 'voltris-glass' : 'bg-[#0A0A10]'}`}>
                 <FiInbox className="w-20 h-20 text-white/5" />
                 <div className="space-y-2">
                    <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">No Active Uplinks</h3>
                    <p className="text-white/20 font-bold text-xs uppercase tracking-[0.2em]">You have no technical support frequency active at the moment.</p>
                 </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Modern Ticket Creation Modal */}
      <AnimatePresence>
        {showCreateForm && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setShowCreateForm(false)} />
            <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }} className={`relative w-full max-w-2xl p-12 rounded-[4rem] border border-white/10 shadow-3xl ${transparencyMode ? 'voltris-glass' : 'bg-[#0A0A10]'}`}>
               <button onClick={() => setShowCreateForm(false)} className="absolute top-10 right-10 p-3 rounded-2xl bg-white/5 text-white/40 hover:text-white transition-all"><FiX size={24} /></button>
               
               <div className="flex items-center gap-6 mb-12">
                 <div className="w-20 h-20 rounded-[2rem] bg-[#8B31FF]/10 border border-[#8B31FF]/20 flex items-center justify-center text-[#8B31FF] shadow-lg shadow-[#8B31FF]/10">
                   <FiTerminal className="w-10 h-10" />
                 </div>
                 <div className="space-y-1">
                   <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter">New <span className="text-[#8B31FF] not-italic">Sublink</span></h3>
                   <p className="text-white/20 text-[10px] font-bold uppercase tracking-[0.3em]">Establish interface with Voltris Tech</p>
                 </div>
               </div>

               <form onSubmit={handleCreateTicket} className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-[#8B31FF] uppercase tracking-[0.3em] font-mono">Transmission Subject</label>
                      <input 
                        type="text" required 
                        value={newTicket.title} onChange={e => setNewTicket({...newTicket, title: e.target.value})}
                        className="w-full p-6 rounded-3xl bg-black/60 border border-white/5 text-white focus:border-[#8B31FF] outline-none transition-all placeholder:text-white/5" 
                        placeholder="Define problem space..."
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-[#8B31FF] uppercase tracking-[0.3em] font-mono">Priority Protocol</label>
                      <select 
                        value={newTicket.priority} onChange={e => setNewTicket({...newTicket, priority: e.target.value as any})}
                        className="w-full p-6 rounded-3xl bg-black/60 border border-white/5 text-white/40 focus:text-white focus:border-[#8B31FF] outline-none transition-all appearance-none uppercase font-black text-[10px] tracking-widest cursor-pointer"
                      >
                         <option value="low">Standard Priority</option>
                         <option value="medium">Medium Priority</option>
                         <option value="high">Urgent Response Required</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-[#8B31FF] uppercase tracking-[0.3em] font-mono">Data Payload (Description)</label>
                    <textarea 
                      required rows={6}
                      value={newTicket.description} onChange={e => setNewTicket({...newTicket, description: e.target.value})}
                      className="w-full p-6 rounded-3xl bg-black/60 border border-white/5 text-white focus:border-[#8B31FF] outline-none transition-all placeholder:text-white/5 resize-none" 
                      placeholder="Identify specific hardware or software failure markers..."
                    />
                  </div>
                  <button 
                    type="submit" disabled={isCreating}
                    className="w-full py-6 rounded-3xl bg-gradient-to-r from-[#8B31FF] to-[#31A8FF] text-white font-black uppercase italic text-xs tracking-[0.3em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                  >
                    {isCreating ? 'Transmitting Data...' : 'Broadcast Sublink Request'}
                  </button>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Details/Chat Uplink Modal */}
      <AnimatePresence>
        {showTicketModal && selectedTicket && (
          <div className="fixed inset-0 z-[350] flex items-center justify-center p-6 pb-0 md:pb-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/98 backdrop-blur-2xl" onClick={() => setShowTicketModal(false)} />
            <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} onClick={e => e.stopPropagation()} className={`relative w-full max-w-4xl h-full md:h-[90vh] flex flex-col overflow-hidden rounded-t-[3rem] md:rounded-[4rem] border border-white/10 ${transparencyMode ? 'voltris-glass' : 'bg-[#0A0A12]'}`}>
               
               {/* Modal Navigation Header */}
               <div className="px-10 py-8 bg-black/40 border-b border-white/5 flex justify-between items-center">
                  <div className="flex items-center gap-6">
                    <div className={`p-4 rounded-2xl ${statusConfig(selectedTicket.status).bg} ${statusConfig(selectedTicket.status).color} border ${statusConfig(selectedTicket.status).border}`}>
                       {React.createElement(statusConfig(selectedTicket.status).icon, { className: 'w-6 h-6' })}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xl font-black text-white uppercase italic tracking-tighter truncate max-w-[200px] md:max-w-md">{selectedTicket.title}</h4>
                      <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Transmission Channel: <span className="text-[#8B31FF]">#{selectedTicket.id.slice(0, 12)}</span></p>
                    </div>
                  </div>
                  <button onClick={() => setShowTicketModal(false)} className="p-3 bg-white/5 text-white/20 hover:text-white rounded-2xl transition-all"><FiX size={24} /></button>
               </div>

               {/* Communications Stream */}
               <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar-modern">
                  {messages.map((msg, i) => {
                    const isMe = msg.user_id === user?.id;
                    return (
                      <motion.div 
                        initial={{ opacity: 0, x: isMe ? 20 : -20 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        key={i} 
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                         <div className={`group relative p-6 rounded-[2.5rem] max-w-[85%] md:max-w-[70%] border transition-all duration-300 ${isMe ? 'bg-[#8B31FF]/10 border-[#8B31FF]/20 text-white rounded-tr-none' : 'bg-white/5 border-white/10 text-white/80 rounded-tl-none'}`}>
                            <p className="text-sm font-bold leading-relaxed whitespace-pre-wrap uppercase tracking-wide italic">{msg.content}</p>
                            <div className={`absolute top-0 ${isMe ? '-right-1' : '-left-1'} w-3 h-3 bg-inherit border-inherit rotate-45`}></div>
                         </div>
                         <span className="mt-3 px-2 text-[8px] font-black text-white/20 uppercase tracking-[0.3em] font-mono">
                            {isMe ? 'TRANSMITTER' : 'RESONANCE CORE'} • {new Date(msg.created_at).toLocaleTimeString()}
                         </span>
                      </motion.div>
                    );
                  })}
               </div>

               {/* Broadcast Input Station */}
               <div className="p-8 bg-black/60 border-t border-white/10">
                  <div className="relative group">
                     <textarea 
                        rows={1}
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                        placeholder="Inject resonance sequence (Your reply)..."
                        className="w-full bg-white/5 border border-white/5 rounded-3xl pl-8 pr-24 py-6 text-white text-sm font-bold focus:border-[#8B31FF] focus:bg-white/[0.08] outline-none transition-all placeholder:text-white/10 resize-none"
                     />
                     <button 
                       onClick={handleSendReply}
                       disabled={!replyText.trim() || isSendingReply}
                       className="absolute right-3 top-3 bottom-3 px-6 bg-[#8B31FF] text-white rounded-2xl font-black uppercase italic text-[10px] tracking-widest flex items-center gap-3 transition-all hover:scale-105 active:scale-95 disabled:grayscale disabled:opacity-30"
                     >
                        {isSendingReply ? 'Syncing...' : (
                          <>
                            <span className="hidden md:block">Transmit</span>
                            <FiSend className="w-4 h-4" />
                          </>
                        )}
                     </button>
                  </div>
                  <p className="mt-4 text-center text-[9px] font-black text-white/10 uppercase tracking-[0.2em] font-mono">Neural interface secured by Voltris Protocol v.4.0</p>
               </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}