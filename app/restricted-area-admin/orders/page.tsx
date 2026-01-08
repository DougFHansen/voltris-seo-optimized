'use client';

import { useState, useEffect } from 'react';
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
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<OrderWithUser | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      // Buscar todos os pedidos com informações do usuário
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          profiles:user_id (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      toast.error('Erro ao carregar pedidos');
    } finally {
      setLoading(false);
    }
  };

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
      
      toast.success('Status do pedido atualizado com sucesso!');
      fetchOrders();
    } catch (error) {
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

  // Substituir getStatusText para aceitar cancelled_by
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-[#FF4B6B] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden bg-gradient-to-br from-[#1E1E1E]/90 to-[#171313]/90 backdrop-blur-xl p-6 rounded-2xl border border-gray-800/30"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <div className="bg-gradient-to-br from-[#FF4B6B] to-[#8B31FF] rounded-xl p-3 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-transparent bg-clip-text">
                Gerenciar Pedidos
              </h1>
            </div>
            <p className="text-gray-300 text-lg">Visualize e gerencie todos os pedidos dos clientes</p>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Total: {orders.length} pedidos</span>
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
            placeholder="Buscar por ID, nome ou email do cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#1E1E1E]/40 backdrop-blur-xl border border-gray-800/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#8B31FF] transition-colors duration-300"
          />
        </div>
        <div className="flex items-center gap-2">
          <FiFilter className="text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-[#1E1E1E]/40 backdrop-blur-xl border border-gray-800/30 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#8B31FF] transition-colors duration-300"
          >
            <option value="all">Todos os Status</option>
            <option value="pending">Pendentes</option>
            <option value="processing">Em Processamento</option>
            <option value="completed">Concluídos</option>
            <option value="cancelled">Cancelados</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-500/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <p className="text-gray-400 text-lg">Nenhum pedido encontrado</p>
          </motion.div>
        ) : (
          filteredOrders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#1E1E1E]/40 backdrop-blur-xl p-6 rounded-2xl border border-gray-800/30 hover:border-[#8B31FF]/30 transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm text-gray-400">#{order.id.slice(0, 8)}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1">{getStatusText(order.status, order.cancelled_by)}</span>
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-white font-medium">
                      {order.profiles?.full_name || 'Nome não informado'}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {order.profiles?.email || 'Email não informado'}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {new Date(order.created_at).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-white font-bold text-lg">
                      R$ {order.total.toFixed(2)}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {order.items?.length || 0} item(s)
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowOrderModal(true);
                      }}
                      className="p-2 text-gray-400 hover:text-white hover:bg-[#8B31FF]/20 rounded-lg transition-all duration-300"
                      title="Ver detalhes"
                    >
                      <FiEye className="w-4 h-4" />
                    </button>
                    
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                      className="bg-[#1E1E1E]/60 border border-gray-800/30 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:border-[#8B31FF] transition-colors duration-300"
                    >
                      <option value="pending">Pendente</option>
                      <option value="processing">Em Processamento</option>
                      <option value="completed">Concluído</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1E1E1E] rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-white">Detalhes do Pedido</h2>
              <button
                onClick={() => setShowOrderModal(false)}
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                <FiXCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Informações do Cliente</h3>
                <div className="bg-[#171313] p-4 rounded-xl">
                  <p className="text-gray-300"><span className="text-gray-400">Nome:</span> {selectedOrder.profiles?.full_name || 'Não informado'}</p>
                  <p className="text-gray-300"><span className="text-gray-400">Email:</span> {selectedOrder.profiles?.email || 'Não informado'}</p>
                  <p className="text-gray-300"><span className="text-gray-400">ID do Pedido:</span> {selectedOrder.id}</p>
                  <p className="text-gray-300"><span className="text-gray-400">Data:</span> {new Date(selectedOrder.created_at).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Itens do Pedido</h3>
                <div className="bg-[#171313] p-4 rounded-xl space-y-3">
                  {selectedOrder.items?.map((item: any, index: number) => (
                    <div key={index} className="border-b border-gray-800/30 pb-3 last:border-b-0">
                      <p className="text-white font-medium">{item.service_name}</p>
                      <p className="text-gray-400 text-sm">{item.service_description}</p>
                      <p className="text-[#8B31FF] font-semibold">R$ {item.price?.toFixed(2) || '0.00'}</p>
                    </div>
                  ))}
                </div>
              </div>
              {selectedOrder.notes && (
                <div className="bg-[#171313] p-4 rounded-xl mt-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Informações Adicionais</h3>
                  <p className="text-gray-300 whitespace-pre-line">{selectedOrder.notes}</p>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t border-gray-800/30">
                <div>
                  <p className="text-gray-400">Total do Pedido</p>
                  <p className="text-2xl font-bold text-white">R$ {selectedOrder.total.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusIcon(selectedOrder.status)}
                    <span className="ml-2">{getStatusText(selectedOrder.status, selectedOrder.cancelled_by)}</span>
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
} 
