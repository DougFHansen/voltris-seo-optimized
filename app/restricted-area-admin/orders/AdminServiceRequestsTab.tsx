'use client';

import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { createClient } from '@/utils/supabase/client';

interface ServiceRequest {
  id: string;
  created_at: string;
  status: string;
  requested_services: unknown[];
  scheduling_type: string;
  requested_datetime?: string;
  admin_notes?: string;
  final_price: number;
  order_id?: string;
  profiles?: {
    full_name: string;
    email: string;
  };
}

export default function AdminServiceRequestsTab() {
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const supabase = createClient();

  useEffect(() => {
    const fetchServiceRequests = async () => {
      try {
        const { data, error } = await supabase
          .from('service_requests')
          .select(`
            *,
            profiles:user_id (
              full_name,
              email
            )
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setServiceRequests(data || []);
      } catch (err) {
        
      } finally {
        setLoading(false);
      }
    };

    fetchServiceRequests();
  }, [supabase]);

  const filteredServiceRequests = serviceRequests.filter(request => {
    if (filter === 'all') return true;
    return request.status === filter;
  });

  const sortedServiceRequests = [...filteredServiceRequests].sort((a, b) => {
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
      case 'scheduled':
        return 'bg-blue-500/10 text-blue-500';
      case 'cancelled':
        return 'bg-red-500/10 text-red-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Concluído';
      case 'pending':
        return 'Pendente';
      case 'scheduled':
        return 'Agendado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Desconhecido';
    }
  };

  const updateServiceRequestStatus = async (requestId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('service_requests')
        .update({ status: newStatus })
        .eq('id', requestId);

      if (error) throw error;

      // Atualizar a lista local
      setServiceRequests(serviceRequests.map(request => 
        request.id === requestId ? { ...request, status: newStatus } : request
      ));
    } catch (err) {
      
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
            Solicitações Técnicas
          </h1>
          <p className="text-gray-400 mt-1 text-center">Gerencie detalhes técnicos dos serviços</p>
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
            <option value="scheduled">Agendados</option>
            <option value="cancelled">Cancelados</option>
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
          {loading ? (
            <div className="p-6 text-center text-gray-400">Carregando solicitações...</div>
          ) : sortedServiceRequests.length === 0 ? (
            <div className="p-6 text-center text-gray-400">Nenhuma solicitação encontrada</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-800/50">
              <thead className="bg-[#171313]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Agendamento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Serviços
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {sortedServiceRequests.map((request) => (
                  <motion.tr
                    key={request.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-[#171313]/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      #{request.id.slice(0, 8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <div>
                        <div className="font-medium">{request.profiles?.full_name || 'N/A'}</div>
                        <div className="text-gray-400">{request.profiles?.email || 'N/A'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {getStatusText(request.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <div>
                        <div className="font-medium">
                          {request.scheduling_type === 'now' ? 'Imediato' : 'Agendado'}
                        </div>
                        {request.requested_datetime && (
                          <div className="text-xs text-gray-400">
                            {new Date(request.requested_datetime).toLocaleDateString('pt-BR')}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {new Date(request.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      R$ {request.final_price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      <div className="space-y-1">
                        <div className="text-xs text-gray-400">
                          {request.requested_services?.length || 0} serviço(s)
                        </div>
                        {request.requested_services?.slice(0, 2).map((service: unknown, index: number) => (
                          <div key={index} className="text-xs text-gray-400">
                            • {service.service_name || 'Serviço'}
                          </div>
                        ))}
                        {request.requested_services?.length > 2 && (
                          <div className="text-xs text-gray-400">
                            +{request.requested_services.length - 2} mais
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <div className="flex gap-2">
                        <select
                          value={request.status}
                          onChange={(e) => updateServiceRequestStatus(request.id, e.target.value)}
                          className="bg-[#171313] border border-gray-700 rounded px-2 py-1 text-xs text-gray-300"
                        >
                          <option value="pending">Pendente</option>
                          <option value="scheduled">Agendado</option>
                          <option value="completed">Concluído</option>
                          <option value="cancelled">Cancelado</option>
                        </select>
                        <button className="text-[#8B31FF] hover:text-[#8B31FF]/80 transition-colors text-xs">
                          Ver detalhes
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>
    </div>
  );
} 