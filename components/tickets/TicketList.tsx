'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'react-hot-toast';

interface Profile {
  email: string;
  full_name: string;
  is_admin?: boolean;
}

interface TicketMessage {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles?: Profile;
}

interface Ticket {
  id: string;
  title: string;
  status: 'Aberto' | 'Em Análise' | 'Resolvido' | 'Finalizado';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  user_id: string;
  profiles?: Profile;
  messages?: TicketMessage[];
}

interface TicketListProps {
  tickets: Ticket[];
  isAdmin?: boolean;
  onTicketClick?: (ticketId: string) => void;
  onStatusChange?: (ticketId: string, newStatus: Ticket['status']) => void;
  onRefresh?: () => void;
}

export default function TicketList({
  tickets,
  isAdmin = false,
  onStatusChange,
  onRefresh
}: TicketListProps) {
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [localMessages, setLocalMessages] = useState<Record<string, TicketMessage[]>>({});

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    fetchUser();
  }, []);

  // Atualizar mensagens locais quando os tickets mudarem
  useEffect(() => {
    const newLocalMessages: Record<string, TicketMessage[]> = {};
    tickets.forEach(ticket => {
      if (ticket.messages) {
        newLocalMessages[ticket.id] = ticket.messages;
      }
    });
    setLocalMessages(newLocalMessages);
  }, [tickets]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [localMessages, expandedTicket]);

  const handleStatusChange = async (ticketId: string, newStatus: Ticket['status']) => {
    if (!onStatusChange) return;

    try {
      await onStatusChange(ticketId, newStatus);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status do ticket');
    }
  };

  const handleSendMessage = async (ticketId: string) => {
    if (!newMessage.trim() || !userId) {
      console.log('Mensagem vazia ou usuário não autenticado');
      return;
    }

    try {
      setIsSubmitting(true);
      console.log('Iniciando envio de mensagem...');

      const supabase = createClient();
      // Primeiro, inserir a mensagem
      const { data: insertData, error: insertError } = await supabase
        .from('ticket_messages')
        .insert({
          ticket_id: ticketId,
          content: newMessage.trim(),
          user_id: userId
        })
        .select()
        .single();

      if (insertError) {
        console.error('Erro ao inserir mensagem:', insertError);
        throw new Error(`Erro ao inserir mensagem: ${insertError.message}`);
      }

      if (!insertData) {
        throw new Error('Nenhum dado retornado após inserção');
      }

      console.log('Mensagem inserida com sucesso:', insertData);

      // Buscar o perfil do usuário
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Erro ao buscar perfil:', profileError);
        throw new Error(`Erro ao buscar perfil: ${profileError.message}`);
      }

      // Criar objeto de mensagem com perfil
      const newMessageWithProfile = {
        ...insertData,
        profiles: profileData
      };

      console.log('Mensagem com perfil:', newMessageWithProfile);

      // Atualizar mensagens locais imediatamente
      setLocalMessages(prev => ({
        ...prev,
        [ticketId]: [...(prev[ticketId] || []), newMessageWithProfile]
      }));

      setNewMessage('');
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 1500);

      // Atualizar a lista completa de tickets em segundo plano
      if (onRefresh) {
        console.log('Atualizando lista de tickets...');
        onRefresh();
      }
    } catch (error: unknown) {
      const err = error as any;
      console.error('Erro detalhado ao enviar mensagem:', {
        error: err,
        message: err?.message,
        details: err?.details,
        hint: err?.hint,
        code: err?.code
      });
      toast.error(err?.message || 'Erro ao enviar mensagem. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: Ticket['status']) => {
    switch (status) {
      case 'Aberto':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'Em Análise':
        return 'bg-blue-500/20 text-blue-500';
      case 'Resolvido':
        return 'bg-green-500/20 text-green-500';
      case 'Finalizado':
        return 'bg-gray-500/20 text-gray-500';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  };

  const getPriorityColor = (priority: Ticket['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-500';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'low':
        return 'bg-green-500/20 text-green-500';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  };

  // Função utilitária para saber se o ticket foi respondido pelo admin
  const isTicketRespondido = (ticket: Ticket) => {
    if (!ticket.messages || ticket.messages.length === 0) return false;
    const lastMessage = ticket.messages[ticket.messages.length - 1];
    // Considera respondido se o perfil da última mensagem for admin
    return lastMessage.profiles && lastMessage.profiles.is_admin === true;
  };

  // Função utilitária para pegar iniciais do nome
  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Função utilitária para data/hora inteligente
  const formatSmartDate = (date: Date) => {
    const now = new Date();
    const msgDate = new Date(date);
    const isToday = now.toDateString() === msgDate.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = yesterday.toDateString() === msgDate.toDateString();
    if (isToday) return `Hoje às ${msgDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    if (isYesterday) return `Ontem às ${msgDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    return `${msgDate.toLocaleDateString('pt-BR')} às ${msgDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  };

  // Função utilitária para saber se o usuário pode enviar mensagem
  const canUserSendMessage = (ticket: Ticket, userId: string | null) => {
    if (!userId) return false;

    // Se o ticket estiver resolvido, ninguém pode enviar mensagem
    if (ticket.status === 'Resolvido' || ticket.status === 'Finalizado') {
      return false;
    }

    // Se não houver mensagens, o usuário pode enviar a primeira mensagem
    if (!ticket.messages || ticket.messages.length === 0) {
      return true;
    }

    const lastMessage = ticket.messages[ticket.messages.length - 1];

    // Se a última mensagem for do admin, o usuário pode responder
    if (lastMessage.profiles?.is_admin) {
      return true;
    }

    // Se a última mensagem for do próprio usuário, ele não pode enviar outra até o admin responder
    if (lastMessage.user_id === userId) {
      return false;
    }

    return false;
  };

  if (!tickets.length) {
    return (
      <div className="text-center py-8 text-gray-400">
        Nenhum ticket encontrado
      </div>
    );
  }

  return (
    <>
      {/* Modal de sucesso ao enviar mensagem */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-[#1E1E1E] border border-[#FF4B6B]/40 rounded-2xl shadow-2xl px-8 py-6 flex flex-col items-center animate-fadeIn">
            <div className="mb-3">
              <svg className="w-14 h-14 text-[#FF4B6B] animate-pulse" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="#FF4B6B" strokeWidth="2" fill="#FF4B6B22" />
                <path stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M8 12l2.5 2.5L16 9" />
              </svg>
            </div>
            <div className="text-lg font-semibold text-white mb-1">Mensagem enviada!</div>
            <div className="text-sm text-gray-300">Sua mensagem foi enviada com sucesso.</div>
          </div>
        </div>
      )}
      <div className="space-y-4">
        {tickets.map((ticket) => {
          const ticketMessages = localMessages[ticket.id] || ticket.messages || [];
          // Separador de dias
          let lastMsgDay: string | null = null;
          return (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#1E1E1E] rounded-xl border border-gray-800/50 shadow-lg shadow-black/20 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <h3 className="text-lg font-semibold text-white">{ticket.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority === 'high' ? 'Alta' :
                        ticket.priority === 'medium' ? 'Média' : 'Baixa'}
                    </span>
                    {isTicketRespondido(ticket) && (
                      <span className="ml-2 px-2 py-1 rounded-full text-xs bg-green-600/20 text-green-400 border border-green-600/30">Respondido</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {isAdmin && (
                      <select
                        value={ticket.status}
                        onChange={(e) => handleStatusChange(ticket.id, e.target.value as Ticket['status'])}
                        className="bg-gray-800 text-white rounded-lg px-3 py-1 text-sm border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FF4B6B]"
                      >
                        <option value="Aberto">Aberto</option>
                        <option value="Em Análise">Em Análise</option>
                        <option value="Resolvido">Resolvido</option>
                        <option value="Finalizado">Finalizado</option>
                      </select>
                    )}
                    <button
                      onClick={() => setExpandedTicket(expandedTicket === ticket.id ? null : ticket.id)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {expandedTicket === ticket.id ? '▼' : '▶'}
                    </button>
                  </div>
                </div>

                <div className="text-sm text-gray-400 mb-4">
                  <p>Criado em: {format(new Date(ticket.created_at), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}</p>
                  {isAdmin && ticket.profiles && (
                    <p>Usuário: {ticket.profiles.full_name || ticket.profiles.email}</p>
                  )}
                </div>

                {expandedTicket === ticket.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 space-y-4"
                  >
                    <div className="border-t border-gray-800 pt-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-3">Mensagens</h4>
                      <div className="space-y-3">
                        {ticketMessages.map((message) => {
                          const isSentByMe = userId && message.user_id === userId;
                          const senderName = message.profiles?.full_name || message.profiles?.email || 'Usuário';
                          const initials = getInitials(message.profiles?.full_name);
                          const msgDate = new Date(message.created_at);
                          const msgDay = msgDate.toDateString();
                          const showDaySeparator = lastMsgDay !== msgDay;
                          lastMsgDay = msgDay;
                          return (
                            <div key={message.id}>
                              {showDaySeparator && (
                                <div className="flex justify-center my-2">
                                  <span className="px-3 py-1 rounded-full text-xs bg-gray-700/60 text-gray-200 border border-gray-600/30">
                                    {formatSmartDate(msgDate).split(' às ')[0]}
                                  </span>
                                </div>
                              )}
                              <div className={`flex ${isSentByMe ? 'justify-end' : 'justify-start'} items-end`}>
                                {!isSentByMe && (
                                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#FF4B6B]/80 to-[#8B31FF]/80 flex items-center justify-center text-white font-bold mr-2">
                                    {initials}
                                  </div>
                                )}
                                <div
                                  className={`relative rounded-2xl p-3 max-w-[80%] break-words shadow-md border transition-all duration-200
                                    ${isSentByMe
                                      ? 'bg-[#FF4B6B] text-white border-[#FF4B6B]/40 rounded-br-sm'
                                      : 'bg-gray-800/80 text-white border-gray-700/40 rounded-bl-sm'}
                                  `}
                                  aria-label={isSentByMe ? 'Mensagem enviada' : 'Mensagem recebida'}
                                >
                                  <div className="flex justify-between items-start mb-1">
                                    <span className="text-xs font-semibold text-gray-200">
                                      {senderName}
                                    </span>
                                    <span className="text-xs text-gray-400 ml-2">
                                      {formatSmartDate(msgDate)}
                                    </span>
                                  </div>
                                  <p className="text-sm text-white">{message.content}</p>
                                  {/* Seta do balão */}
                                  <span className={`absolute bottom-0 ${isSentByMe ? 'right-[-8px]' : 'left-[-8px]'} w-4 h-4 overflow-hidden`}>
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <polygon points={isSentByMe ? '0,16 16,16 16,0' : '16,16 0,16 0,0'} fill={isSentByMe ? '#FF4B6B' : '#23272f'} />
                                    </svg>
                                  </span>
                                </div>
                                {isSentByMe && (
                                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#FF4B6B]/80 to-[#8B31FF]/80 flex items-center justify-center text-white font-bold ml-2">
                                    {initials}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                        <div ref={messagesEndRef} />
                      </div>
                    </div>
                    {/* Input expansível e acessível */}
                    {(isAdmin || (userId && canUserSendMessage(ticket, userId))) ? (
                      <form
                        className="flex space-x-2 mt-2"
                        onSubmit={e => { e.preventDefault(); handleSendMessage(ticket.id); }}
                        aria-label="Enviar mensagem"
                      >
                        <textarea
                          value={newMessage}
                          onChange={e => setNewMessage(e.target.value)}
                          placeholder="Digite sua dúvida ou mensagem..."
                          className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 text-sm border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FF4B6B] resize-none"
                          rows={1}
                          aria-label="Campo de mensagem"
                          style={{ overflow: 'hidden' }}
                          onInput={e => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = target.scrollHeight + 'px';
                          }}
                        />
                        <button
                          type="submit"
                          disabled={isSubmitting || !newMessage.trim()}
                          className="bg-[#FF4B6B] text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-[#FF4B6B]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Enviar mensagem"
                        >
                          {isSubmitting && (
                            <svg className="animate-spin h-4 w-4 mr-1 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                          )}
                          Enviar
                        </button>
                      </form>
                    ) : (
                      <div className="mt-2 p-3 bg-gray-800/50 rounded-lg text-sm text-gray-400">
                        {ticket.status === 'Resolvido' || ticket.status === 'Finalizado' ? (
                          'Este ticket foi marcado como resolvido. Não é possível enviar mais mensagens.'
                        ) : (
                          'Aguarde a resposta do administrador para enviar uma nova mensagem.'
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}