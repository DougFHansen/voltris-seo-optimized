'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import TicketList from '@/components/tickets/TicketList';
import { FiPackage, FiClock, FiCheckCircle } from 'react-icons/fi';
import type { Order } from '@/types/order';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/app/hooks/useAuth';
import AuthGuard from '@/components/AuthGuard';
import PushNotificationSetup from '../components/PushNotificationSetup';

export default function DashboardPage() {
  const { user, profile, loading, refreshAuth } = useAuth();
  const [currentTime, setCurrentTime] = useState<string>('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const pathname = usePathname();
  const supabase = createClient();

  // Bloquear acesso ao dashboard se cadastro incompleto
  useEffect(() => {
    if (profile) {
      const missingFields =
        !profile.phone ||
        !profile.address ||
        !profile.city ||
        !profile.state ||
        !profile.cep;
      if (missingFields) {
        console.log('[Dashboard] Cadastro incompleto, redirecionando para /profile?completar=1');
        window.location.replace('/profile?completar=1');
        return;
      }
    }
  }, [profile]);

  // Bloquear acesso se não estiver autenticado
  useEffect(() => {
    if (!loading && !user) {
      console.log('[Dashboard] Usuário não autenticado, redirecionando para /login');
      window.location.replace('/login');
      return;
    }
  }, [user, loading]);

  // Função otimizada para buscar dados
  const fetchData = useCallback(async (showLoading = true) => {
      if (!user) return;
      
      try {
      if (showLoading) setIsLoading(true);
        
      // Get orders com timeout
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Timeout ao carregar pedidos')), 10000);
      });

      const ordersPromise = supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
      const { data: ordersData, error: ordersError } = await Promise.race([
        ordersPromise,
        timeoutPromise
      ]);
      
      if (ordersError) {
        toast.error('Erro ao carregar pedidos');
        setOrders([]);
        return;
      }
        setOrders(ordersData || []);
        
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      if (showLoading) {
        toast.error('Erro ao carregar dados do dashboard');
      }
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, [user?.id]); // Apenas user.id como dependência

  // Fetch orders data - apenas quando user.id mudar
  useEffect(() => {
    if (user?.id) {
      fetchData();
    }
  }, [user?.id, fetchData]);

  // Update time (static)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      }));
    };

    updateTime();
  }, []);

  // Check for pending orders
  useEffect(() => {
    const checkPendingOrder = async () => {
      if (!user) return;
      
      const pendingOrderData = sessionStorage.getItem('pendingOrderData');
      const urlParams = new URLSearchParams(window.location.search);
      
      if (pendingOrderData && urlParams.get('pendingOrder') === 'true') {
        try {
          const orderData = JSON.parse(pendingOrderData);
          console.log('Processando pedido pendente:', orderData);
          
          // Get access token for API call
          const { data: { session } } = await supabase.auth.getSession();
          const accessToken = session?.access_token;
          
          console.log('orderData.total:', orderData.total);
          console.log('orderData.final_price:', orderData.final_price);
          const valor = Number(orderData.total || orderData.final_price);
          console.log('Valor calculado no dashboard:', valor);
          const apiOrderData = {
            service_name: orderData.service_name || 'Serviço',
            service_description: orderData.service_description || '',
            final_price: valor > 0 ? valor : 1,
            plan_type: orderData.plan_type || (orderData.service_name ? orderData.service_name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') : 'basico'),
            total: valor > 0 ? valor : 1,
            items: [
              {
                service_name: orderData.service_name || 'Serviço',
                service_description: orderData.service_description || '',
                price: valor > 0 ? valor : 1
              }
            ]
          };
          console.log('Pedido enviado para API:', apiOrderData);

          const headers = {
            'Content-Type': 'application/json',
            ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}),
          };

          // API call com timeout
          const timeoutPromise = new Promise<never>((_, reject) => {
            setTimeout(() => reject(new Error('Timeout ao criar pedido')), 15000);
          });

          const apiPromise = fetch('/api/orders', {
            method: 'POST',
            headers,
            body: JSON.stringify(apiOrderData),
          });

          const response = await Promise.race([apiPromise, timeoutPromise]);
          
          let apiErrorText = '';
          if (!response.ok) {
            try {
              const errorJson = await response.json();
              apiErrorText = JSON.stringify(errorJson);
            } catch (e) {
              apiErrorText = await response.text();
            }
            console.error('Erro detalhado da API /api/orders:', apiErrorText);
          }
          
          if (response.ok) {
            // Limpar dados pendentes
            sessionStorage.removeItem('pendingOrderData');
            
            // Mostrar mensagem de sucesso
            toast.success('Pedido criado com sucesso!');
            setShowOrderSuccess(true);
            
            // Recarregar pedidos
            await fetchData(false);
            
            // Limpar parâmetro da URL
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.delete('pendingOrder');
            window.history.replaceState({}, '', newUrl.toString());
            
            // Esconder notificação após 5 segundos
            setTimeout(() => {
              setShowOrderSuccess(false);
            }, 5000);
          } else {
            throw new Error('Erro ao criar pedido');
          }
        } catch (error) {
          console.error('Erro ao processar pedido pendente:', error);
          toast.error('Erro ao processar pedido pendente');
        }
      }
    };

    checkPendingOrder();
  }, [user, fetchData]);

  // Removido auto-refresh automático - apenas atualização manual

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const completedOrders = orders.filter(order => order.status === 'completed').length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] w-full">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#FF4B6B] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-400">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="space-y-6 md:space-y-8 w-full max-w-full">
        {/* Welcome Section - Mobile Premium */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden bg-gradient-to-br from-[#1E1E1E]/90 to-[#171313]/90 backdrop-blur-xl p-5 md:p-8 rounded-2xl border border-gray-800/30 w-full"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF4B6B]/5 via-[#8B31FF]/5 to-[#31A8FF]/5"></div>
          <div className="relative z-10">
            <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
              <div className="space-y-3">
                <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-transparent bg-clip-text break-words">
                  Bem-vindo de volta, {user?.email?.split('@')[0]}!
                </h1>
                <p className="text-base md:text-lg text-gray-300 break-words">
                  Gerencie seus pedidos, tickets de suporte e configurações da conta
                </p>
                <p className="text-sm md:text-base text-gray-400">
                  {currentTime}
                </p>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Online</span>
                </div>
                {isRefreshing && (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-[#FF4B6B] border-t-transparent rounded-full animate-spin"></div>
                    <span>Atualizando...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards - Mobile Premium Layout */}
        <div className="flex flex-col gap-4 md:grid md:grid-cols-3 md:gap-6 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-[#1E1E1E]/40 backdrop-blur-xl p-5 md:p-6 rounded-2xl border border-gray-800/30 hover:border-[#8B31FF]/30 transition-all duration-300 flex items-center gap-4 w-full"
          >
            <div className="bg-gradient-to-br from-[#FF4B6B] to-[#8B31FF] rounded-xl p-3 min-w-[52px] min-h-[52px] flex items-center justify-center flex-shrink-0">
              <FiPackage className="w-6 h-6 md:w-7 md:h-7 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-base md:text-lg font-medium text-gray-400">Total de Pedidos</p>
              <p className="text-xl md:text-2xl font-bold text-white">{totalOrders}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-[#1E1E1E]/40 backdrop-blur-xl p-5 md:p-6 rounded-2xl border border-gray-800/30 hover:border-[#8B31FF]/30 transition-all duration-300 flex items-center gap-4 w-full"
          >
            <div className="bg-gradient-to-br from-[#FF4B6B] to-[#8B31FF] rounded-xl p-3 min-w-[52px] min-h-[52px] flex items-center justify-center flex-shrink-0">
              <FiClock className="w-6 h-6 md:w-7 md:h-7 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-base md:text-lg font-medium text-gray-400">Pedidos Pendentes</p>
              <p className="text-xl md:text-2xl font-bold text-white">{pendingOrders}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-[#1E1E1E]/40 backdrop-blur-xl p-5 md:p-6 rounded-2xl border border-gray-800/30 hover:border-[#8B31FF]/30 transition-all duration-300 flex items-center gap-4 w-full"
          >
            <div className="bg-gradient-to-br from-[#FF4B6B] to-[#8B31FF] rounded-xl p-3 min-w-[52px] min-h-[52px] flex items-center justify-center flex-shrink-0">
              <FiCheckCircle className="w-6 h-6 md:w-7 md:h-7 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-base md:text-lg font-medium text-gray-400">Pedidos Concluídos</p>
              <p className="text-xl md:text-2xl font-bold text-white">{completedOrders}</p>
            </div>
          </motion.div>
        </div>

        {/* Recent Orders - Mobile Premium */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-[#1E1E1E]/40 backdrop-blur-xl p-5 md:p-6 rounded-2xl border border-gray-800/30 w-full"
        >
          <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-white">Pedidos Recentes</h2>
            <button
              onClick={() => {
                setIsRefreshing(true);
                fetchData(false).finally(() => setIsRefreshing(false));
              }}
              disabled={isRefreshing}
              className="flex items-center justify-center gap-2 px-5 py-3 text-base bg-[#8B31FF] text-white rounded-xl hover:bg-[#8B31FF]/80 transition-colors disabled:opacity-50 min-h-[52px] w-full md:w-auto"
            >
              {isRefreshing ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              )}
              Atualizar
            </button>
          </div>
          
          {/* Orders List - Mobile Premium Cards */}
          <div className="flex flex-col gap-4 w-full">
            {orders.slice(0, 5).map((order) => {
              const item: any = order.items?.[0] || {};
              return (
                <div
                  key={order.id}
                  className="flex flex-col gap-4 p-5 bg-[#1E1E1E]/60 rounded-2xl border border-gray-800/30 hover:border-[#8B31FF]/30 transition-all duration-300 w-full"
                >
                  {/* Header do Card */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-semibold text-white break-words">Pedido #{order.id.slice(0, 8)}</p>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium flex-shrink-0 ${
                        order.status === 'completed' ? 'bg-green-500/10 text-green-400 border border-green-500/30' :
                        order.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30' :
                        order.status === 'processing' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' :
                        'bg-red-500/10 text-red-400 border border-red-500/30'
                      }`}>
                        {order.status === 'completed' ? 'Concluído' :
                         order.status === 'pending' ? 'Pendente' :
                         order.status === 'processing' ? 'Em Processamento' :
                         'Cancelado'}
                      </span>
                    </div>
                    <p className="text-base text-gray-400">
                      {new Date(order.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>

                  {/* Detalhes do Serviço */}
                  {item.service_name && (
                    <div className="space-y-2">
                      <p className="text-base text-gray-300 font-medium break-words">{item.service_name}</p>
                      <div className="text-sm text-gray-400 space-y-1">
                        <p>Atendimento: {item.scheduling_type === 'schedule' ? 'Agendado' : 'Agora'}</p>
                        {item.scheduling_type === 'schedule' && item.appointment_datetime && (
                          <p>Data: {new Date(item.appointment_datetime).toLocaleString('pt-BR')}</p>
                        )}
                        {item.additional_info && (
                          <p className="break-words">Info: {item.additional_info}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Valor e Ações */}
                  <div className="flex flex-col gap-3 pt-2 border-t border-gray-800/30">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-white">R$ {order.total.toFixed(2)}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <a
                        href="https://wa.me/5511996716235"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-base font-medium bg-green-600/10 text-green-400 border border-green-600/30 hover:bg-green-600/20 transition-colors min-h-[52px] w-full"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.72 11.06a5.5 5.5 0 10-9.94 4.38l-1.28 4.69a1 1 0 001.22 1.22l4.69-1.28a5.5 5.5 0 005.31-8.99z" />
                        </svg>
                        Atendimento Pelo WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
            {orders.length === 0 && (
              <div className="text-center py-8 w-full">
                <p className="text-gray-400 text-base mb-4">Nenhum pedido encontrado</p>
                <Link 
                  href="/servicos" 
                  className="inline-block px-6 py-3 bg-[#8B31FF] text-white rounded-xl hover:bg-[#8B31FF]/80 transition-colors min-h-[52px] text-base font-medium"
                >
                  Fazer Primeiro Pedido
                </Link>
              </div>
            )}
          </div>
        </motion.div>

        {/* Notificação de Pedido Criado com Sucesso */}
        {showOrderSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50 bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl shadow-lg border border-green-400 max-w-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">Pedido Criado!</p>
                <p className="text-sm opacity-90 break-words">Seu pedido foi criado com sucesso e está visível em "Meus Pedidos".</p>
              </div>
              <button
                onClick={() => setShowOrderSuccess(false)}
                className="ml-4 text-white/70 hover:text-white flex-shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Configuração de Notificações Push */}
      <div className="mt-8">
        <PushNotificationSetup />
      </div>
    </AuthGuard>
  );
}