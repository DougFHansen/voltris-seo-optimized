'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiFilter, FiXCircle, FiClock, FiCheckCircle, FiAlertCircle, FiEye } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import type { Order } from '@/types/order';
import { createClient } from '@/utils/supabase/client';

interface OrderDetails {
  order: Order;
  service?: any;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        setUserId(user.id);
        const { data, error: ordersError } = await supabase
          .from('orders')
          .select('id, user_id, service_id, created_at, updated_at, status, total, final_price, service_name, service_description, plan_type, notes, scheduling_type, appointment_datetime, items, payment_status, payment_method')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        if (ordersError) throw ordersError;
        setOrders(data || []);
      } catch (err) {
        console.error('Erro ao carregar pedidos:', err);
        setError('Não foi possível carregar seus pedidos.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [supabase.auth]);

  // Realtime listener para pedidos do usuário
  useEffect(() => {
    let channel: any;
    let isMounted = true;
    async function setupRealtime() {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('[Realtime] Usuário autenticado:', user);
      if (!user) return;
      setUserId(user.id);
      channel = supabase.channel('orders-realtime')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'orders',
            // filter removido
          },
          async (payload) => {
            console.log('[Realtime] Evento recebido:', payload);
            const changedOrder = payload.new as Order;
            if (!changedOrder) {
              console.log('[Realtime] Payload sem new:', payload);
              return;
            }
            if (changedOrder.user_id !== user.id) {
              console.log('[Realtime] user_id diferente:', changedOrder.user_id, user.id);
              return;
            }
            if (payload.eventType === 'UPDATE') {
              let found = false;
              setOrders(prevOrders => {
                const updated = prevOrders.map(order => {
                  if (order.id === changedOrder.id) {
                    found = true;
                    console.log('[Realtime] Atualizando pedido existente:', changedOrder.id, changedOrder.status);
                    return { ...order, ...changedOrder };
                  }
                  return order;
                });
                return updated;
              });
              setTimeout(async () => {
                if (!found && isMounted) {
                  console.log('[Realtime] Pedido não estava no estado, refazendo fetch.');
                  const { data, error } = await supabase
                    .from('orders')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });
                  if (!error && data) setOrders(data);
                }
              }, 500);
            } else if (payload.eventType === 'INSERT') {
              setOrders(prevOrders => {
                if (prevOrders.some(order => order.id === changedOrder.id)) return prevOrders;
                console.log('[Realtime] Novo pedido inserido:', changedOrder.id);
                return [changedOrder, ...prevOrders];
              });
            } else if (payload.eventType === 'DELETE') {
              setOrders(prevOrders => prevOrders.filter(order => order.id !== payload.old.id));
              console.log('[Realtime] Pedido deletado:', payload.old.id);
            }
          }
        )
        .subscribe((status) => {
          console.log('[Realtime] Canal subscribe status:', status);
        });
    }
    setupRealtime();
    return () => {
      isMounted = false;
      if (channel) supabase.removeChannel(channel);
      console.log('[Realtime] Canal removido');
    };
  }, []);

  // Teste mínimo de canal Realtime para depuração
  useEffect(() => {
    const supabaseTest = createClient();
    const channelTest = supabaseTest.channel('test-realtime')
      .on('broadcast', { event: 'test' }, (payload) => {
        console.log('[Teste] Broadcast recebido:', payload);
      })
      .subscribe((status) => {
        console.log('[Teste] Canal subscribe status:', status);
      });
    return () => {
      supabaseTest.removeChannel(channelTest);
      console.log('[Teste] Canal removido');
    };
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === 'all' || order.status === filter;
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (order.items && order.items[0]?.service_name && 
                          order.items[0].service_name.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const handleViewOrderDetails = async (order: Order) => {
    setSelectedOrder({ order });
    setShowOrderModal(true);
  };

  // Função para cancelar pedido
  const handleCancelOrder = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'cancelled', cancelled_by: 'client' })
        .eq('id', orderId);
      if (error) throw error;
      // Atualiza localmente para resposta rápida
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: 'cancelled', cancelled_by: 'client' } : order
        )
      );
    } catch (err) {
      alert('Erro ao cancelar pedido. Tente novamente.');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <FiCheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <FiClock className="w-4 h-4 text-yellow-500" />;
      case 'processing':
        return <FiClock className="w-4 h-4 text-blue-500" />;
      case 'cancelled':
        return <FiAlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <FiClock className="w-4 h-4 text-gray-500" />;
    }
  };

  // Ajustar getStatusText para sempre exibir 'Cancelado' para o usuário
  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Concluído';
      case 'pending':
        return 'Pendente';
      case 'processing':
        return 'Em Processamento';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Desconhecido';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'processing':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'cancelled':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] w-full">
        <div className="w-12 h-12 border-4 border-[#FF4B6B] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 w-full">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-4">
          <FiXCircle className="w-8 h-8 text-red-500" />
        </div>
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
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
                <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-transparent bg-clip-text break-words">
                Meus Pedidos
              </h1>
            </div>
            <p className="text-base md:text-lg text-gray-300 break-words">Gerencie e acompanhe todos os seus pedidos</p>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Total: {orders.length} pedidos</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters and Search - Mobile Premium */}
      <div className="flex flex-col gap-4 w-full">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar pedido por ID ou serviço..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-[#1E1E1E]/40 backdrop-blur-xl border border-gray-800/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#8B31FF] transition-colors duration-300 min-h-[52px]"
          />
        </div>
        <div className="flex items-center gap-2 w-full">
          <FiFilter className="text-gray-400 flex-shrink-0" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="flex-1 bg-[#1E1E1E]/40 backdrop-blur-xl border border-gray-800/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8B31FF] transition-colors duration-300 min-h-[52px]"
          >
            <option value="all">Todos os Status</option>
            <option value="pending">Pendentes</option>
            <option value="processing">Em Processamento</option>
            <option value="completed">Concluídos</option>
            <option value="cancelled">Cancelados</option>
          </select>
        </div>
      </div>

      {/* Orders List - Mobile Premium Cards */}
      <div className="space-y-4 w-full">
        {filteredOrders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 w-full"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-500/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <p className="text-gray-400 text-lg">Nenhum pedido encontrado</p>
            <p className="text-gray-500 text-sm mt-2">
              {searchTerm || filter !== 'all' 
                ? 'Tente ajustar os filtros de busca' 
                : 'Faça seu primeiro pedido para começar'
              }
            </p>
          </motion.div>
        ) : (
          filteredOrders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-[#1E1E1E]/40 backdrop-blur-xl p-5 rounded-2xl border border-gray-800/30 hover:border-[#8B31FF]/30 transition-all duration-300 w-full"
            >
              {/* Header do Card */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-white break-words">Pedido #{order.id}</h3>
                <span className={`inline-flex flex-row items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border flex-shrink-0 ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <span>{getStatusText(order.status)}</span>
                </span>
              </div>

              {/* Informações do Pedido */}
              <div className="space-y-3 mb-4">
                <p className="text-sm text-gray-400">
                  {new Date(order.created_at).toLocaleDateString('pt-BR')} às{' '}
                  {new Date(order.created_at).toLocaleTimeString('pt-BR')}
                </p>
                {order.items && order.items[0]?.service_name && (
                  <p className="text-white font-medium text-base break-words">{order.items[0].service_name}</p>
                )}
                {order.items && order.items[0]?.service_description && (
                  <p className="text-gray-300 text-sm break-words">{order.items[0].service_description}</p>
                )}
                {order.items && order.items[0]?.plan_type && (
                  <span className="inline-block px-3 py-1 bg-[#8B31FF]/10 text-[#8B31FF] text-sm rounded-full border border-[#8B31FF]/30">
                    Plano {order.items[0].plan_type.charAt(0).toUpperCase() + order.items[0].plan_type.slice(1)}
                  </span>
                )}
              </div>

              {/* Valor e Ações */}
              <div className="flex flex-col gap-3 pt-4 border-t border-gray-800/30">
                <div className="flex items-center justify-between">
                  <span className="text-[#8B31FF] font-bold text-lg">
                    R$ {order.total?.toFixed(2) || '0,00'}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewOrderDetails(order)}
                      className={`inline-flex flex-row items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border flex-shrink-0 bg-[#8B31FF]/10 text-[#8B31FF] border-[#8B31FF]/30 hover:bg-[#8B31FF]/20 transition-colors duration-300 min-h-[36px] h-[36px]`}
                      style={{ height: '36px' }}
                    >
                      <FiEye className="w-4 h-4" />
                      <span>Ver Detalhes</span>
                    </button>
                    {/* Botão WhatsApp */}
                    <a
                      href={`https://wa.me/5511996716235?text=${encodeURIComponent(
                        `Olá! Gostaria de finalizar meu pedido #${order.id} pelo WhatsApp. Por favor, envie as instruções para concluir a compra. Obrigado!`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex flex-row items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border flex-shrink-0 bg-green-500/10 text-green-600 border-green-500/30 hover:bg-green-500/20 transition-colors duration-300 min-h-[36px] h-[36px]"
                      style={{ height: '36px' }}
                    >
                      <FaWhatsapp className="w-4 h-4" />
                      <span>Finalizar Pelo WhatsApp</span>
                    </a>
                  </div>
                </div>
                {/* Botão Cancelar Pedido */}
                {order.status !== 'cancelled' && order.status !== 'completed' && order.status !== 'processing' && (
                  <button
                    onClick={() => handleCancelOrder(order.id)}
                    className="flex items-center gap-2 px-4 py-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-colors duration-300 min-h-[44px] font-semibold"
                  >
                    Cancelar Pedido
                  </button>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Order Details Modal - Mobile Premium */}
      <AnimatePresence>
        {showOrderModal && selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowOrderModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#1E1E1E] rounded-2xl p-5 md:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-800/30"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-white break-words">Detalhes do Pedido</h2>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="text-gray-400 hover:text-white transition-colors duration-300 min-h-[44px] min-w-[44px] flex items-center justify-center flex-shrink-0"
                >
                  <FiXCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Order Info */}
                <div className="bg-[#171313] rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Informações do Pedido</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-400 text-sm">ID do Pedido</p>
                      <p className="text-white font-medium break-all">#{selectedOrder.order.id}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Data de Criação</p>
                      <p className="text-white font-medium">
                        {new Date(selectedOrder.order.created_at).toLocaleDateString('pt-BR')} às{' '}
                        {new Date(selectedOrder.order.created_at).toLocaleTimeString('pt-BR')}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Status</p>
                      <div className="inline-flex flex-row items-center gap-2">
                        {getStatusIcon(selectedOrder.order.status)}
                        <span className="text-white font-medium">
                          {getStatusText(selectedOrder.order.status)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Valor Total</p>
                      <p className="text-[#8B31FF] font-bold text-lg">
                        R$ {selectedOrder.order.total?.toFixed(2) || '0,00'}
                      </p>
                    </div>
                    <div>
                      {/* Atendimento: Agendado para ... ou Agora */}
                      <p className="text-gray-400 text-sm">Atendimento</p>
                      {selectedOrder.order.scheduling_type === 'scheduled' && selectedOrder.order.appointment_datetime ? (
                        <p className="text-white font-medium">
                          Agendado para {new Date(selectedOrder.order.appointment_datetime).toLocaleDateString('pt-BR')} às {new Date(selectedOrder.order.appointment_datetime).toLocaleTimeString('pt-BR')}
                        </p>
                      ) : (
                        <p className="text-white font-medium">Agora</p>
                      )}
                    </div>
                  
                  </div>
                </div>

                {/* Service Info */}
                {selectedOrder.order.items && selectedOrder.order.items[0] && (
                  <div className="bg-[#171313] rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-white mb-4">Detalhes do Serviço</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-gray-400 text-sm">Nome do Serviço</p>
                        <p className="text-white font-medium break-words">{selectedOrder.order.service_name || selectedOrder.order.items[0].service_name}</p>
                      </div>
                      {selectedOrder.order.items[0].service_description && (
                        <div>
                          <p className="text-gray-400 text-sm">Descrição</p>
                          <p className="text-white break-words">{selectedOrder.order.items[0].service_description}</p>
                        </div>
                      )}
                      {selectedOrder.order.items[0].plan_type && (
                        <div>
                          <p className="text-gray-400 text-sm">Tipo de Plano</p>
                          <p className="text-white font-medium capitalize">{selectedOrder.order.items[0].plan_type}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {selectedOrder.order.notes && (
                  <div className="bg-[#171313] rounded-xl p-4 mt-4">
                    <h3 className="text-lg font-semibold text-white mb-4">Informações Adicionais</h3>
                    <p className="text-gray-300 whitespace-pre-line">{selectedOrder.order.notes}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
