'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import PaymentStatusBadge from '../PaymentStatusBadge';

interface Order {
  id: string;
  created_at: string;
  status: string;
  payment_status?: string;
  final_price: number;
  items: any[];
  service_name?: string;
  pagseguro_code?: string;
  notes?: string;
  scheduling_type?: string;
  appointment_datetime?: string;
  cancelled_by?: string;
}

export default function OrdersTab() {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Order[];
    }
  });

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === 'date') {
      return sortOrder === 'desc' 
        ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        : new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    }
    if (sortBy === 'total') {
      return sortOrder === 'desc' ? b.final_price - a.final_price : a.final_price - b.final_price;
    }
    return 0;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-500';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'processing':
        return 'bg-blue-500/10 text-blue-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-center gap-4"
      >
        <div className="w-full">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-center">
            Meus Pedidos
          </h1>
          <p className="text-gray-400 mt-1 text-center">Gerencie e acompanhe seus pedidos</p>
        </div>

        <div className="flex flex-wrap gap-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-[#1E1E1E] border border-gray-800/50 rounded-lg px-4 py-2 text-gray-300 focus:outline-none focus:border-[#8B31FF]"
          >
            <option value="all">Todos os Status</option>
            <option value="completed">Concluídos</option>
            <option value="pending">Pendentes</option>
            <option value="processing">Em Processamento</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#1E1E1E] border border-gray-800/50 rounded-lg px-4 py-2 text-gray-300 focus:outline-none focus:border-[#8B31FF]"
          >
            <option value="date">Data</option>
            <option value="total">Valor</option>
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="bg-[#1E1E1E] border border-gray-800/50 rounded-lg px-4 py-2 text-gray-300 hover:bg-[#8B31FF]/10 transition-colors"
          >
            {sortOrder === 'desc' ? '↓' : '↑'}
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-[#1E1E1E] rounded-xl border border-gray-800/50 shadow-lg shadow-black/20 overflow-hidden"
      >
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-6 text-center text-gray-400">Carregando pedidos...</div>
          ) : sortedOrders.length === 0 ? (
            <div className="p-6 text-center text-gray-400">Nenhum pedido encontrado</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-800/50">
              <thead className="bg-[#171313]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status Pedido
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Pagamento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Itens
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {sortedOrders.map((order) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-[#171313]/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {order.id.slice(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}> 
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <PaymentStatusBadge 
                        status={order.payment_status || 'pending'} 
                        className="text-xs"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <p className="text-white">
                        {order.scheduling_type === 'schedule' && order.appointment_datetime
                          ? `Agendado para: ${new Date(order.appointment_datetime).toLocaleDateString('pt-BR')} ${new Date(order.appointment_datetime).toLocaleTimeString('pt-BR')}`
                          : 'Atendimento Agora'}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      R$ {order.final_price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {order.items.length} itens
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <button
                        onClick={() => { setSelectedOrder(order); setShowOrderModal(true); }}
                        className="px-3 py-1 bg-[#8B31FF]/10 text-[#8B31FF] rounded hover:bg-[#8B31FF]/20 transition-colors text-xs flex items-center gap-2"
                        title="Ver Detalhes"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        Ver Detalhes
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>

      {/* Modal de detalhes do pedido */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-[#1E1E1E] rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-800/30"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-white">Detalhes do Pedido</h2>
              <button
                onClick={() => setShowOrderModal(false)}
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-400 text-sm">ID do Pedido</span>
                  <p className="text-white font-mono">{selectedOrder.id}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Status</span>
                  <span className={`inline-flex flex-row items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(selectedOrder.status)}`}>{selectedOrder.status}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Serviço</span>
                  <p className="text-white">{selectedOrder.service_name || (selectedOrder.items[0]?.service_name ?? 'Não informado')}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Valor</span>
                  <p className="text-white">R$ {selectedOrder.final_price?.toFixed(2) ?? '0,00'}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Data de Criação</span>
                  <p className="text-white">{new Date(selectedOrder.created_at).toLocaleDateString('pt-BR')} {new Date(selectedOrder.created_at).toLocaleTimeString('pt-BR')}</p>
                </div>
                {selectedOrder.scheduling_type === 'schedule' && selectedOrder.appointment_datetime && (
                  <div>
                    <span className="text-gray-400 text-sm">Agendamento</span>
                    <p className="text-white">{new Date(selectedOrder.appointment_datetime).toLocaleDateString('pt-BR')} {new Date(selectedOrder.appointment_datetime).toLocaleTimeString('pt-BR')}</p>
                  </div>
                )}
                {selectedOrder.pagseguro_code && (
                  <div>
                    <span className="text-gray-400 text-sm">Código PagSeguro</span>
                    <p className="text-white font-mono">{selectedOrder.pagseguro_code}</p>
                  </div>
                )}
              </div>
              <div>
                <span className="text-gray-400 text-sm">Itens do Pedido</span>
                <div className="bg-[#171313] p-4 rounded-xl mt-2 space-y-3">
                  {selectedOrder.items?.map((item: any, idx: number) => (
                    <div key={idx} className="border-b border-gray-800/30 pb-3 last:border-b-0">
                      <p className="text-white font-medium">{item.service_name}</p>
                      {item.service_description && <p className="text-gray-400 text-sm">{item.service_description}</p>}
                      {item.plan_type && <span className="inline-block px-3 py-1 bg-[#8B31FF]/10 text-[#8B31FF] text-sm rounded-full border border-[#8B31FF]/30">Plano {item.plan_type}</span>}
                      {item.notes && (
                        <div className="mt-2">
                          <span className="text-gray-400 text-xs">Observações:</span>
                          <p className="text-gray-300 text-sm whitespace-pre-line">{item.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
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