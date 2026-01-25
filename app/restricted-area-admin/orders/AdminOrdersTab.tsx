import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@/utils/supabase/client';
import { FiSearch, FiFilter, FiEye, FiEdit, FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import type { Order } from '@/types/order';

interface OrderWithUser extends Order {
  profiles?: {
    full_name: string;
    email: string;
  };
  cancelled_by?: 'client' | 'admin';
}

const PAGE_SIZE = 10;

export default function AdminOrdersTab() {
  const [orders, setOrders] = useState<OrderWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<OrderWithUser | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const supabase = createClient();
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setOrders([]);
    setPage(1);
    setHasMore(true);
  }, [filter, searchTerm]);

  useEffect(() => {
    fetchOrders(1, true);
    // eslint-disable-next-line
  }, [filter, searchTerm]);

  useEffect(() => {
    if (page > 1) fetchOrders(page);
    // eslint-disable-next-line
  }, [page]);

  const addLog = (msg: string) => {
    setLogs((prev) => [msg, ...prev.slice(0, 19)]); // máximo 20 logs
  };

  const fetchOrders = async (pageToFetch = 1, reset = false) => {
    try {
      if (pageToFetch === 1) setLoading(true);
      else setLoadingMore(true);
      const from = (pageToFetch - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      let query = supabase
        .from('orders')
        .select(`*, cancelled_by, profiles:user_id (full_name, email)`)
        .order('created_at', { ascending: false })
        .range(from, to);
      if (filter !== 'all') query = query.eq('status', filter);
      if (searchTerm) { }
      const { data, error } = await query;
      if (error) throw error;
      let newOrders = data || [];
      if (searchTerm) {
        newOrders = newOrders.filter(order =>
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      if (reset || pageToFetch === 1) setOrders(newOrders);
      else setOrders(prev => {
        const existingIds = new Set(prev.map(o => o.id));
        return [...prev, ...newOrders.filter(o => !existingIds.has(o.id))];
      });
      setHasMore(newOrders.length === PAGE_SIZE);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      addLog('Erro ao buscar pedidos: ' + errorMsg);
      toast.error('Erro ao carregar pedidos');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Infinite scroll observer
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore && !loadingMore && !loading) {
      setPage(prev => prev + 1);
    }
  }, [hasMore, loadingMore, loading]);

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
    const observer = new window.IntersectionObserver(handleObserver, option);
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [handleObserver]);

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    try {
      let updateObj: any = { status: newStatus };
      if (newStatus === 'cancelled') {
        updateObj.cancelled_by = 'admin';
      }
      const { error } = await supabase
        .from('orders')
        .update(updateObj)
        .eq('id', orderId);
      if (error) throw error;
      addLog(`Status do pedido ${orderId} atualizado para '${newStatus}'.`);
      toast.success('Status do pedido atualizado com sucesso!');
      // Atualiza o status localmente, sem recarregar toda a lista
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, ...updateObj } : order
        )
      );
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      addLog('Erro ao atualizar status: ' + errorMsg);
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status do pedido');
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === 'all' || order.status === filter;
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <FiCheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <FiClock className="w-4 h-4 text-yellow-500" />;
      case 'processing':
        return <FiClock className="w-4 h-4 text-blue-500" />;
      case 'cancelled':
        return <FiXCircle className="w-4 h-4 text-red-500" />;
      default:
        return <FiClock className="w-4 h-4 text-gray-500" />;
    }
  };

  // Função para exibir texto de status de cancelamento detalhado
  const getStatusText = (status: string, cancelled_by?: string) => {
    if (status === 'cancelled') {
      if (cancelled_by === 'client') return 'Pedido Cancelado Pelo Cliente';
      if (cancelled_by === 'admin') return 'Cancelado pelo Administrador';
      return 'Cancelado';
    }
    switch (status) {
      case 'completed':
        return 'Concluído';
      case 'pending':
        return 'Pendente';
      case 'processing':
        return 'Em Processamento';
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

  // Listener Realtime para pedidos (admin)
  useEffect(() => {
    let channel: any;
    let isMounted = true;
    async function setupRealtime() {
      channel = supabase.channel('orders-admin-realtime')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'orders',
          },
          async (payload) => {
            console.log('[Admin Realtime] Evento recebido:', payload);
            const changedOrder = payload.new as OrderWithUser;
            if (!changedOrder) return;
            // Função para buscar o pedido completo (com join em profiles)
            const fetchFullOrder = async (orderId: string) => {
              const { data, error } = await supabase
                .from('orders')
                .select('*, cancelled_by, profiles:user_id (full_name, email)')
                .eq('id', orderId)
                .single();
              if (!error && data) return data;
              return null;
            };
            if (payload.eventType === 'UPDATE') {
              const fullOrder = await fetchFullOrder(changedOrder.id);
              if (fullOrder) {
                setOrders(prevOrders => {
                  const updated = prevOrders.map(order =>
                    order.id === fullOrder.id ? { ...order, ...fullOrder } : order
                  );
                  return updated;
                });
              }
            } else if (payload.eventType === 'INSERT') {
              // Tocar som de alerta para novos pedidos
              try {
                const audio = new Audio('/alert.mp3');
                audio.volume = 0.8;
                audio.play().catch(e => console.warn('Erro ao tocar som:', e));
                toast.success('💰 Novo pedido recebido!', {
                  style: {
                    background: '#1E1E1E',
                    color: '#fff',
                    border: '1px solid #8B31FF'
                  }
                });
              } catch (e) {
                console.error('Erro no audio:', e);
              }

              const fullOrder = await fetchFullOrder(changedOrder.id);
              if (fullOrder) {
                setOrders(prevOrders => {
                  if (prevOrders.some(order => order.id === fullOrder.id)) return prevOrders;
                  return [fullOrder, ...prevOrders];
                });
              }
            } else if (payload.eventType === 'DELETE') {
              setOrders(prevOrders => prevOrders.filter(order => order.id !== payload.old.id));
            }
          }
        )
        .subscribe((status) => {
          console.log('[Admin Realtime] Canal subscribe status:', status);
        });
    }
    setupRealtime();
    return () => {
      isMounted = false;
      if (channel) supabase.removeChannel(channel);
      console.log('[Admin Realtime] Canal removido');
    };
  }, []);

  if (loading && page === 1) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-12 h-12 border-4 border-[#FF4B6B] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Painel de logs administrativos */}
      <div className="bg-[#1E1E1E]/80 border border-[#8B31FF]/20 rounded-xl p-4 mb-2 max-h-48 overflow-y-auto text-xs text-gray-300">
        <div className="font-bold text-[#8B31FF] mb-1">Logs do Painel</div>
        {logs.length === 0 ? (
          <div className="text-gray-500">Nenhuma ação registrada.</div>
        ) : (
          <ul className="space-y-1">
            {logs.map((log, i) => (
              <li key={i}>{log}</li>
            ))}
          </ul>
        )}
      </div>

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
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-transparent bg-clip-text leading-tight">
                Gerenciar Pedidos
              </h1>
            </div>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed">Visualize e gerencie todos os pedidos dos clientes</p>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Total: {orders.length} pedidos</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filtros e busca otimizados */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar por ID, nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-[#1E1E1E]/40 backdrop-blur-xl border border-gray-800/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#8B31FF] transition-colors duration-300 text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <FiFilter className="text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-[#1E1E1E]/40 backdrop-blur-xl border border-gray-800/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8B31FF] transition-colors duration-300 text-sm min-w-[140px]"
          >
            <option value="all">Todos os Status</option>
            <option value="pending">Pendentes</option>
            <option value="processing">Em Processamento</option>
            <option value="completed">Concluídos</option>
            <option value="cancelled">Cancelados</option>
          </select>
        </div>
      </div>

      {/* Lista de pedidos - layout fluido */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#FF4B6B] to-[#8B31FF] rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Nenhum pedido encontrado</h3>
            <p className="text-gray-400">Não há pedidos que correspondam aos filtros aplicados.</p>
          </motion.div>
        ) : (
          <div className="grid gap-4">
            {filteredOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-gradient-to-br from-[#1E1E1E]/60 to-[#171313]/60 backdrop-blur-xl rounded-xl border border-gray-800/30 p-6 hover:border-[#8B31FF]/30 transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                      <span className="text-xs font-mono text-gray-400 bg-gray-800/50 px-2 py-1 rounded">
                        #{order.id.slice(0, 8)}...
                      </span>
                      <span className={`inline-flex flex-row items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span>{getStatusText(order.status, order.cancelled_by)}</span>
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 text-sm">Cliente:</span>
                          <span className="text-white font-medium">
                            {order.profiles?.full_name || 'Nome não informado'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 text-sm">Email:</span>
                          <span className="text-white font-medium">
                            {order.profiles?.email || 'Email não informado'}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 text-sm">Serviço:</span>
                          <span className="text-white font-medium">{order.service_name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 text-sm">Valor:</span>
                          <span className="text-white font-medium">
                            R$ {order.total ? order.total.toFixed(2) : '0.00'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm">Data:</span>
                        <span className="text-white font-medium">
                          {new Date(order.created_at).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowOrderModal(true);
                      }}
                      className="flex items-center gap-2 px-3 py-2 bg-[#31A8FF]/10 hover:bg-[#31A8FF]/20 text-[#31A8FF] rounded-lg transition-colors duration-300 text-sm"
                    >
                      <FiEye className="w-4 h-4" />
                      Ver Detalhes
                    </button>

                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                      className="px-3 py-2 bg-[#1E1E1E]/40 backdrop-blur-xl border border-gray-800/30 rounded-lg text-white focus:outline-none focus:border-[#8B31FF] transition-colors duration-300 text-sm"
                    >
                      <option value="pending">Pendente</option>
                      <option value="processing">Em Processamento</option>
                      <option value="completed">Concluído</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            ))}
            {/* Loader para infinite scroll */}
            {hasMore && (
              <div ref={loaderRef} className="flex justify-center py-6">
                <div className="w-8 h-8 border-4 border-[#8B31FF] border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de detalhes do pedido */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gradient-to-br from-[#1E1E1E] to-[#171313] rounded-2xl border border-gray-800/50 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-bold text-white">Detalhes do Pedido</h2>
              <button
                onClick={() => setShowOrderModal(false)}
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-400 text-sm">ID do Pedido</span>
                  <p className="text-white font-mono">{selectedOrder.id}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Status</span>
                  <span className={`inline-flex flex-row items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ml-3 ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusIcon(selectedOrder.status)}
                    <span>{getStatusText(selectedOrder.status, selectedOrder.cancelled_by)}</span>
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Cliente</span>
                  <p className="text-white">{selectedOrder.profiles?.full_name || 'Nome não informado'}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Email</span>
                  <p className="text-white">{selectedOrder.profiles?.email || 'Email não informado'}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Serviço</span>
                  <p className="text-white">{selectedOrder.service_name}</p>
                  {selectedOrder.items && selectedOrder.items[0]?.service_description && (
                    <>
                      <span className="text-gray-400 text-sm mt-4 block">Detalhes do Plano</span>
                      <p className="text-white">{selectedOrder.items[0].service_description}</p>
                    </>
                  )}
                  <span className="text-gray-400 text-sm mt-4 block">Valor</span>
                  <p className="text-white">R$ {selectedOrder.total ? selectedOrder.total.toFixed(2) : '0.00'}</p>
                  <span className="text-gray-400 text-sm mt-4 block">Última Atualização</span>
                  <p className="text-white">
                    {new Date(selectedOrder.updated_at).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                {/* Data de Criação à direita */}
                <div>
                  <span className="text-gray-400 text-sm">Data de Criação</span>
                  <p className="text-white">
                    {new Date(selectedOrder.created_at).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              {selectedOrder.notes && (
                <div>
                  <span className="text-gray-400 text-sm">Informações Adicionais</span>
                  <p className="text-white mt-1 whitespace-pre-line">{selectedOrder.notes}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
} 