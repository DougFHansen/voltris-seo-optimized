'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { motion } from 'framer-motion';
import { FiPlus, FiTrash2, FiShoppingCart } from 'react-icons/fi';

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
    const [services, setServices] = useState<Service[]>([]);
    const [selectedServices, setSelectedServices] = useState<OrderItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

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
            setError('Erro ao carregar serviços');
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
    };

    const removeService = (serviceId: string) => {
        setSelectedServices(prev => prev.filter(item => item.service_id !== serviceId));
    };

    const updateQuantity = (serviceId: string, quantity: number) => {
        if (quantity < 1) return;

        setSelectedServices(prev => prev.map(item =>
            item.service_id === serviceId
                ? { ...item, quantity }
                : item
        ));
    };

    const calculateTotal = () => {
        return selectedServices.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Usuário não autenticado');

            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items: selectedServices,
                    total: calculateTotal()
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao criar pedido');
            }

            router.push('/dashboard/orders');
        } catch (error) {
            console.error('Error creating order:', error);
            setError(error instanceof Error ? error.message : 'Erro ao criar pedido');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="w-12 h-12 border-4 border-[#FF4B6B] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF]">
                    Novo Pedido
                </h1>
                <p className="text-gray-400 mt-1">Selecione os serviços desejados</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Lista de Serviços */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-[#1E1E1E] rounded-xl border border-gray-800/50 p-6 shadow-lg shadow-black/20"
                >
                    <h2 className="text-xl font-semibold text-white mb-4">Serviços Disponíveis</h2>
                    <div className="space-y-4">
                        {services.map((service) => (
                            <div
                                key={service.id}
                                className="bg-[#171313] rounded-lg p-4 border border-gray-800/50 hover:border-[#8B31FF]/50 transition-all duration-300"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-white font-medium">{service.name}</h3>
                                        <p className="text-gray-400 text-sm mt-1">{service.description}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[#FF4B6B] font-semibold">R$ {service.price.toFixed(2)}</p>
                                        <button
                                            onClick={() => addService(service)}
                                            className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-[#FF4B6B] to-[#8B31FF] text-white text-sm rounded-lg hover:opacity-90 transition-opacity"
                                        >
                                            <FiPlus className="w-4 h-4" />
                                            Adicionar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Carrinho */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-[#1E1E1E] rounded-xl border border-gray-800/50 p-6 shadow-lg shadow-black/20"
                >
                    <h2 className="text-xl font-semibold text-white mb-4">Carrinho</h2>

                    {selectedServices.length === 0 ? (
                        <div className="text-center py-8">
                            <FiShoppingCart className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400">Seu carrinho está vazio</p>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-4">
                                {selectedServices.map((item) => {
                                    const service = services.find(s => s.id === item.service_id);
                                    if (!service) return null;

                                    return (
                                        <div
                                            key={item.service_id}
                                            className="bg-[#171313] rounded-lg p-4 border border-gray-800/50"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-white font-medium">{service.name}</h3>
                                                    <p className="text-[#FF4B6B] font-semibold mt-1">
                                                        R$ {item.price.toFixed(2)}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => updateQuantity(item.service_id, item.quantity - 1)}
                                                        className="w-8 h-8 flex items-center justify-center bg-gray-800/50 text-white rounded-lg hover:bg-gray-800 transition-colors"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="text-white w-8 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.service_id, item.quantity + 1)}
                                                        className="w-8 h-8 flex items-center justify-center bg-gray-800/50 text-white rounded-lg hover:bg-gray-800 transition-colors"
                                                    >
                                                        +
                                                    </button>
                                                    <button
                                                        onClick={() => removeService(item.service_id)}
                                                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                                    >
                                                        <FiTrash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="mt-2 text-right">
                                                <p className="text-gray-400 text-sm">
                                                    Subtotal: R$ {(item.price * item.quantity).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-800/50">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-gray-400">Total:</span>
                                    <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B6B] to-[#8B31FF]">
                                        R$ {calculateTotal().toFixed(2)}
                                    </span>
                                </div>

                                {error && (
                                    <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
                                        {error}
                                    </div>
                                )}

                                <button
                                    onClick={handleSubmit}
                                    disabled={submitting || selectedServices.length === 0}
                                    className="w-full bg-gradient-to-r from-[#FF4B6B] to-[#8B31FF] text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting ? 'Processando...' : 'Finalizar Pedido'}
                                </button>
                            </div>
                        </>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
