'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash2, FiShoppingCart, FiPackage, FiCheck, FiArrowRight, FiInfo } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { useDashboard } from '@/app/context/DashboardContext';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
}

interface OrderItem {
  service_id: string;
  quantity: number;
  price: number;
}

export default function NewOrderClient() {
  const { transparencyMode } = useDashboard();
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('name');

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Erro ao carregar serviços');
    } finally {
      setLoading(false);
    }
  };

  const addService = (service: Service) => {
    const existingItem = selectedServices.find(item => item.service_id === service.id);

    if (existingItem) {
      setSelectedServices(prev => prev.map(item =>
        item.service_id === service.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setSelectedServices(prev => [...prev, {
        service_id: service.id,
        quantity: 1,
        price: service.price
      }]);
    }
    toast.success(`${service.name} adicionado`, { 
      icon: '🛒',
      style: { background: 'rgba(10, 10, 15, 0.9)', color: '#fff', border: '1px solid rgba(49, 168, 255, 0.2)' }
    });
  };

  const removeService = (serviceId: string) => {
    setSelectedServices(prev => prev.filter(item => item.service_id !== serviceId));
  };

  const updateQuantity = (serviceId: string, quantity: number) => {
    if (quantity < 1) return;
    setSelectedServices(prev => prev.map(item =>
      item.service_id === serviceId ? { ...item, quantity } : item
    ));
  };

  const calculateTotal = () => {
    return selectedServices.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: selectedServices,
          total: calculateTotal()
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro ao criar pedido');

      toast.success('Pedido criado com sucesso!');
      router.push('/dashboard/orders');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-6">
        <div className="w-16 h-16 border-t-4 border-r-4 border-[#31A8FF] rounded-full animate-spin"></div>
        <p className="text-white/30 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Catalogando Serviços...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-gradient-to-b from-[#FF4B6B] to-[#8B31FF] rounded-full"></div>
          <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">New <span className="text-[#FF4B6B] not-italic">Order</span></h2>
        </div>
        <p className="text-white/40 font-bold text-xs uppercase tracking-widest pl-5 font-mono">Select infrastructure modules for deployment</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
        
        {/* Services Market */}
        <div className="xl:col-span-7 flex flex-col gap-6">
          <h3 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
            <FiPackage className="text-[#31A8FF]" /> Available Modules
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`group relative p-8 rounded-[3rem] border transition-all duration-500 overflow-hidden ${transparencyMode ? 'voltris-glass' : 'bg-[#12121A] border-white/5 shadow-2xl'} hover:border-[#FF4B6B]/40`}
              >
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br from-[#FF4B6B]/10 to-transparent blur-[60px] rounded-full"></div>
                
                <div className="relative z-10 space-y-6">
                   <div className="flex justify-between items-start">
                      <div className="p-4 rounded-2xl bg-[#FF4B6B]/10 border border-[#FF4B6B]/20 text-[#FF4B6B]">
                        <FiPackage className="w-6 h-6" />
                      </div>
                      <span className="text-xl font-black text-white italic">R$ {service.price.toFixed(2)}</span>
                   </div>
                   
                   <div>
                     <h4 className="text-xl font-black text-white uppercase italic tracking-tighter leading-none mb-2">{service.name}</h4>
                     <p className="text-white/40 text-xs font-bold leading-relaxed">{service.description}</p>
                   </div>

                   <button
                    onClick={() => addService(service)}
                    className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-white text-black font-black uppercase italic text-[10px] tracking-widest transition-all hover:scale-[1.02] active:scale-95 shadow-2xl"
                   >
                     <FiPlus className="w-4 h-4" />
                     Add to Deployment
                   </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tactical Cart / Checkout */}
        <div className="xl:col-span-5 sticky top-28 flex flex-col gap-6">
          <h3 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
            <FiShoppingCart className="text-[#FF4B6B]" /> Deployment Manifest
          </h3>

          <div className={`p-8 rounded-[3.5rem] border ${transparencyMode ? 'voltris-glass' : 'bg-[#0A0A10] border-white/5 shadow-3xl'}`}>
            <AnimatePresence mode="popLayout">
              {selectedServices.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-20 flex flex-col items-center text-center gap-6"
                >
                  <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-white/10">
                    <FiShoppingCart className="w-10 h-10" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-white font-black uppercase italic tracking-tighter">Manifest Empty</p>
                    <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest">Awaiting module selection</p>
                  </div>
                </motion.div>
              ) : (
                <div className="space-y-6">
                  {selectedServices.map((item) => {
                    const service = services.find(s => s.id === item.service_id);
                    if (!service) return null;
                    return (
                      <motion.div
                        key={item.service_id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="p-5 rounded-3xl bg-white/5 border border-white/5 flex items-center gap-4 group"
                      >
                        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/20 group-hover:text-white transition-colors">
                           <FiPackage className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="text-xs font-black text-white uppercase italic tracking-tighter truncate">{service.name}</h5>
                          <p className="text-[10px] font-bold text-[#FF4B6B] uppercase tracking-widest">R$ {item.price.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-3">
                           <div className="flex items-center gap-2 p-1 bg-black/40 rounded-xl border border-white/10">
                              <button onClick={() => updateQuantity(item.service_id, item.quantity - 1)} className="w-7 h-7 rounded-lg hover:bg-white/10 text-white transition-all">-</button>
                              <span className="w-5 text-center text-xs font-black text-white">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.service_id, item.quantity + 1)} className="w-7 h-7 rounded-lg hover:bg-white/10 text-white transition-all">+</button>
                           </div>
                           <button onClick={() => removeService(item.service_id)} className="p-2.5 text-red-500/40 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
                             <FiTrash2 className="w-4 h-4" />
                           </button>
                        </div>
                      </motion.div>
                    );
                  })}

                  <div className="pt-8 border-t border-white/5 space-y-8">
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Total Investment</span>
                       <span className="text-3xl font-black text-white italic tracking-tighter">R$ {calculateTotal().toFixed(2)}</span>
                    </div>

                    <div className="p-5 rounded-2xl bg-emerald-400/5 border border-emerald-400/20 flex gap-4">
                       <FiInfo className="text-emerald-400 w-5 h-5 shrink-0" />
                       <p className="text-[10px] font-bold text-emerald-400/60 leading-relaxed uppercase tracking-widest">Sua licença será gerada e enviada instantaneamente após a confirmação do pagamento.</p>
                    </div>

                    <button
                      onClick={handleSubmit}
                      disabled={submitting || selectedServices.length === 0}
                      className="w-full relative group"
                    >
                       <div className="absolute inset-0 bg-gradient-to-r from-[#FF4B6B] to-[#8B31FF] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                       <div className="relative flex items-center justify-center gap-4 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-white py-6 rounded-[2rem] font-black uppercase italic text-xs tracking-[0.2em] shadow-2xl transition-all hover:scale-[1.02] active:scale-95 disabled:grayscale disabled:opacity-50">
                          {submitting ? (
                            <FiRefreshCw className="w-5 h-5 animate-spin" />
                          ) : (
                            <>
                              <span>Initialize Procurement</span>
                              <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                          )}
                       </div>
                    </button>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}
