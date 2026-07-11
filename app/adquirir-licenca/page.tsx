"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, MessageSquare, CheckCircle2, Lock, Cpu, Server, ChevronDown, Rocket, Crown, Star, HelpCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';
import { toast } from 'react-hot-toast';
import { notifyPageView, notifyPurchaseAttempt } from '@/utils/notifications';

function AdquirirLicencaContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, loading: authLoading } = useAuth();
    const [isProcessing, setIsProcessing] = useState<string | null>(null);
    const [billingCycle, setBillingCycle] = useState<'month' | 'year'>('month');

    const installationId = searchParams.get('installation_id');
    const planFromUrl = searchParams.get('plan');
    const [hasAttemptedAutoPurchase, setHasAttemptedAutoPurchase] = useState(false);

    useEffect(() => {
        if (!authLoading && user && planFromUrl && !hasAttemptedAutoPurchase && !isProcessing) {
            setHasAttemptedAutoPurchase(true);
            handlePurchase(planFromUrl, (searchParams.get('period') as 'month' | 'year') || 'month');
        }
    }, [authLoading, user, planFromUrl, hasAttemptedAutoPurchase, isProcessing]);

    // Notificar acesso à página de licenças
    useEffect(() => {
        notifyPageView("Página de Licenças (Exterior)");
    }, []);

    const scrollToPurchase = () => {
        const purchaseSection = document.getElementById('purchase-section');
        if (purchaseSection) {
            purchaseSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handlePurchase = async (planType: string, period: 'month' | 'year' = billingCycle) => {
        if (authLoading) return;

        if (!user) {
            toast.error("Você precisa estar logado para continuar.");
            const redirectPath = `/adquirir-licenca?plan=${planType}&period=${period}${installationId ? `&installation_id=${installationId}` : ''}`;
            router.push(`/login?redirect=${encodeURIComponent(redirectPath)}`);
            return;
        }

        setIsProcessing(planType);

        // Notify purchase attempt on Telegram
        notifyPurchaseAttempt(planType, period);

        try {
            toast.loading("Iniciando checkout seguro com Stripe...");

            const response = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    license_type: planType,
                    billing_period: period,
                    user_id: user.id || null,
                    customer_email: user.email,
                    customer_name: user?.user_metadata?.full_name || 'Voltris User',
                }),
            });

            const data = await response.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error(data.error || 'Erro ao criar sessão Stripe');
            }
        } catch (error: any) {
            console.error('Stripe checkout error:', error);
            toast.error(`Checkout falhou: ${error.message}`);
        } finally {
            setIsProcessing(null);
            toast.dismiss();
        }
    };

    const prices = {
        month: { standard: '4.99', pro: '15.00', enterprise: '299.90' },
        year: { standard: '29.90', pro: '59.90', enterprise: '1,099.90' }
    };

    return (
        <main className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-[#31A8FF]/30 relative pb-20">
            {/* Global Ambient Background Effects */}
            <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E')] opacity-10 brightness-100 contrast-150 mix-blend-overlay pointer-events-none z-50"></div>

            {/* Background Gradients */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-blue-200/30 blur-[120px] rounded-full animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[800px] h-[800px] bg-purple-200/30 blur-[120px] rounded-full animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* HERO Section */}
            <section className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto"
                >
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-gray-200 backdrop-blur-md mb-8 shadow-sm"
                    >
                        <Lock className="w-3 h-3 text-blue-600" />
                        <span className="text-[10px] sm:text-xs font-bold text-gray-600 tracking-widest uppercase">Pagamento Seguro & Ativação Imediata</span>
                    </motion.div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-8 leading-[1.1] text-gray-900">
                        DOMINE SEU PC COM <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B]">
                            PODER TOTAL
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-12 font-light leading-relaxed">
                        Escolha o plano ideal para seus jogos ou produtividade. Ativação automática e suporte especializado em até 24h.
                    </p>

                    <motion.button
                        onClick={scrollToPurchase}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="group inline-flex items-center gap-3 px-10 py-5 bg-white text-black font-black text-lg rounded-full transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-200"
                    >
                        VER PLANOS
                        <ChevronDown className="w-5 h-5 animate-bounce" />
                    </motion.button>
                </motion.div>
            </section>

            {/* PLANS SECTION */}
            <section id="purchase-section" className="relative z-10 py-20 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    
                    {/* Billing Cycle Toggle */}
                    <div className="flex flex-col items-center mb-16">
                        <div className="bg-white border border-gray-200 p-1.5 rounded-2xl flex items-center gap-1 backdrop-blur-xl relative shadow-sm">
                            <button
                                onClick={() => setBillingCycle('month')}
                                className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 relative z-10 ${billingCycle === 'month' ? 'text-black' : 'text-gray-600 hover:text-gray-900'}`}
                            >
                                Mensal
                            </button>
                            <button
                                onClick={() => setBillingCycle('year')}
                                className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 relative z-10 ${billingCycle === 'year' ? 'text-black' : 'text-gray-600 hover:text-gray-900'}`}
                            >
                                Anual
                            </button>
                            
                            <motion.div
                                animate={{ x: billingCycle === 'month' ? 0 : '100.5%' }}
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                className="absolute top-1.5 left-1.5 bottom-1.5 w-[calc(50%-6px)] bg-blue-600 rounded-xl z-0 shadow-md"
                            />
                        </div>
                        {billingCycle === 'year' && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4 px-3 py-1 bg-emerald-100 border border-emerald-200 rounded-full text-[10px] font-black tracking-widest text-emerald-700 uppercase"
                            >
                                Economize até 40% nos planos anuais
                            </motion.div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">

                        {/* Standard Plan */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-white backdrop-blur-xl border border-gray-200 rounded-[2.5rem] p-8 md:p-10 flex flex-col justify-between hover:border-blue-300 transition-all duration-500 group shadow-md hover:shadow-lg"
                        >
                            <div>
                                <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center mb-6 border border-blue-200 text-blue-600">
                                    <Star className="w-7 h-7" />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tighter">Standard</h3>
                                <p className="text-gray-500 text-sm mb-6">Essencial para um único PC.</p>

                                <div className="mb-8 overflow-hidden h-14">
                                    <motion.div
                                        key={billingCycle}
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        className="flex items-baseline gap-1"
                                    >
                                        <span className="text-4xl font-black text-gray-900">R$ {prices[billingCycle].standard}</span>
                                        <span className="text-gray-500 text-lg font-medium">/{billingCycle === 'month' ? 'mês' : 'ano'}</span>
                                    </motion.div>
                                </div>

                                <div className="space-y-4 mb-10">
                                    <ul className="space-y-3">
                                        <li className="flex items-center gap-3 text-sm text-gray-600">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                                            <span>1 Dispositivo</span>
                                        </li>
                                    </ul>

                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-gray-100"></div>
                                        </div>
                                        <div className="relative flex justify-start">
                                            <span className="bg-white pr-2 text-[9px] font-black tracking-[0.15em] text-gray-400 uppercase">Incluso</span>
                                        </div>
                                    </div>

                                    <ul className="space-y-2.5">
                                        <li className="flex items-center gap-3 text-sm text-gray-600 transition-all duration-200 hover:translate-x-0.5">
                                            <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                                            <span>Todas as funções liberadas</span>
                                        </li>
                                        <li className="flex items-center gap-3 text-sm text-gray-600 transition-all duration-200 hover:translate-x-0.5">
                                            <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                                            <span>Otimizações Máximas</span>
                                        </li>
                                        <li className="flex items-center gap-3 text-sm text-gray-600 transition-all duration-200 hover:translate-x-0.5">
                                            <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                                            <span>Suporte Premium</span>
                                        </li>
                                        <li className="flex items-center gap-3 text-sm text-gray-600 transition-all duration-200 hover:translate-x-0.5">
                                            <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                                            <span>Atualizações Constantes</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <button
                                onClick={() => handlePurchase('standard')}
                                disabled={isProcessing !== null}
                                className="w-full py-4 bg-gray-100 border border-gray-200 text-gray-900 font-bold rounded-2xl hover:bg-white hover:border-gray-300 transition-all duration-300 disabled:opacity-50"
                            >
                                {isProcessing === 'standard' ? 'Processando...' : 'Assinar Agora'}
                            </button>
                        </motion.div>

                        {/* PRO Plan (Best Value) */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white backdrop-blur-2xl border-2 border-purple-600 rounded-[2.5rem] p-8 md:p-10 flex flex-col justify-between relative shadow-[0_0_50px_rgba(139,49,255,0.15)] transform scale-105 z-20 group"
                        >
                            <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-6 py-1 bg-gradient-to-r from-[#8B31FF] to-[#31A8FF] rounded-full text-[10px] font-black tracking-widest text-white uppercase shadow-lg">
                                MAIS VENDIDO
                            </div>

                            <div>
                                <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center mb-6 border border-purple-200 text-purple-600">
                                    <Rocket className="w-8 h-8" />
                                </div>
                                <h3 className="text-3xl font-black text-gray-900 mb-2 uppercase tracking-tighter">Pro</h3>
                                <p className="text-gray-600 text-sm mb-6 font-medium">A escolha dos entusiastas.</p>

                                <div className="mb-8 overflow-hidden h-14">
                                    <motion.div
                                        key={billingCycle}
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        className="flex items-baseline gap-1"
                                    >
                                        <span className="text-5xl font-black text-gray-900">R$ {prices[billingCycle].pro}</span>
                                        <span className="text-purple-600 text-xl font-black">/{billingCycle === 'month' ? 'mês' : 'ano'}</span>
                                    </motion.div>
                                </div>

                                <div className="space-y-4 mb-10">
                                    <ul className="space-y-3">
                                        <li className="flex items-center gap-3 text-sm text-gray-900 font-medium">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                                            <span>3 Dispositivos</span>
                                        </li>
                                        <li className="flex items-center gap-3 text-sm text-gray-900 font-medium">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                                            <span>Limpeza Profunda</span>
                                        </li>
                                    </ul>

                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-gray-200"></div>
                                        </div>
                                        <div className="relative flex justify-start">
                                            <span className="bg-white pr-2 text-[9px] font-black tracking-[0.15em] text-gray-500 uppercase">Incluso</span>
                                        </div>
                                    </div>

                                    <ul className="space-y-2.5">
                                        <li className="flex items-center gap-3 text-sm text-gray-900 font-medium transition-all duration-200 hover:translate-x-0.5">
                                            <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                                            <span>Todas as funções liberadas</span>
                                        </li>
                                        <li className="flex items-center gap-3 text-sm text-gray-900 font-medium transition-all duration-200 hover:translate-x-0.5">
                                            <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                                            <span>Otimizações Máximas</span>
                                        </li>
                                        <li className="flex items-center gap-3 text-sm text-gray-900 font-medium transition-all duration-200 hover:translate-x-0.5">
                                            <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                                            <span>Suporte Premium</span>
                                        </li>
                                        <li className="flex items-center gap-3 text-sm text-gray-900 font-medium transition-all duration-200 hover:translate-x-0.5">
                                            <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                                            <span>Atualizações Constantes</span>
                                        </li>
                                        <li className="flex items-center gap-3 text-sm text-gray-900 font-medium transition-all duration-200 hover:translate-x-0.5">
                                            <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                                            <span>IA Inteligente</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <button
                                onClick={() => handlePurchase('pro')}
                                disabled={isProcessing !== null}
                                className="w-full py-5 bg-gradient-to-r from-[#8B31FF] to-[#31A8FF] text-white font-black text-xl rounded-2xl hover:brightness-125 hover:scale-[1.02] transition-all duration-300 shadow-[0_10px_30px_rgba(139,49,255,0.4)] disabled:opacity-50"
                            >
                                {isProcessing === 'pro' ? 'Processando...' : 'Assinar Agora'}
                            </button>
                        </motion.div>

                        {/* Enterprise Plan */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-white backdrop-blur-xl border border-gray-200 rounded-[2.5rem] p-8 md:p-10 flex flex-col justify-between hover:border-pink-300 transition-all duration-500 group shadow-md hover:shadow-lg"
                        >
                            <div>
                                <div className="w-14 h-14 rounded-2xl bg-pink-100 flex items-center justify-center mb-6 border border-pink-200 text-pink-600">
                                    <Crown className="w-7 h-7" />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tighter">Enterprise</h3>
                                <p className="text-gray-500 text-sm mb-6">Para empresas.</p>

                                <div className="mb-8 overflow-hidden h-14">
                                    <motion.div
                                        key={billingCycle}
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        className="flex items-baseline gap-1"
                                    >
                                        <span className="text-4xl font-black text-gray-900">R$ {prices[billingCycle].enterprise}</span>
                                        <span className="text-pink-600 text-lg font-bold">/{billingCycle === 'month' ? 'mês' : 'ano'}</span>
                                    </motion.div>
                                </div>

                                <div className="space-y-4 mb-10">
                                    <ul className="space-y-3">
                                        <li className="flex items-center gap-3 text-sm text-gray-600 font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B6B] to-[#FFD700]">
                                            <CheckCircle2 className="w-5 h-5 text-[#FF4B6B] shrink-0" />
                                            <span>Dispositivos Ilimitados</span>
                                        </li>
                                        <li className="flex items-center gap-3 text-sm text-gray-600">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                                            <span>API de Integração</span>
                                        </li>
                                    </ul>

                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-gray-100"></div>
                                        </div>
                                        <div className="relative flex justify-start">
                                            <span className="bg-white pr-2 text-[9px] font-black tracking-[0.15em] text-gray-400 uppercase">Incluso</span>
                                        </div>
                                    </div>

                                    <ul className="space-y-2.5">
                                        <li className="flex items-center gap-3 text-sm text-gray-600 transition-all duration-200 hover:translate-x-0.5">
                                            <CheckCircle2 className="w-4 h-4 text-pink-400 shrink-0" />
                                            <span>Todas as funções liberadas</span>
                                        </li>
                                        <li className="flex items-center gap-3 text-sm text-gray-600 transition-all duration-200 hover:translate-x-0.5">
                                            <CheckCircle2 className="w-4 h-4 text-pink-400 shrink-0" />
                                            <span>Otimizações Máximas</span>
                                        </li>
                                        <li className="flex items-center gap-3 text-sm text-gray-600 transition-all duration-200 hover:translate-x-0.5">
                                            <CheckCircle2 className="w-4 h-4 text-pink-400 shrink-0" />
                                            <span>Suporte Premium</span>
                                        </li>
                                        <li className="flex items-center gap-3 text-sm text-gray-600 transition-all duration-200 hover:translate-x-0.5">
                                            <CheckCircle2 className="w-4 h-4 text-pink-400 shrink-0" />
                                            <span>Atualizações Constantes</span>
                                        </li>
                                        <li className="flex items-center gap-3 text-sm text-gray-600 transition-all duration-200 hover:translate-x-0.5">
                                            <CheckCircle2 className="w-4 h-4 text-pink-400 shrink-0" />
                                            <span>IA Inteligente</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <button
                                onClick={() => handlePurchase('enterprise')}
                                disabled={isProcessing !== null}
                                className="w-full py-4 bg-gray-100 border border-gray-200 text-gray-900 font-bold rounded-2xl hover:border-pink-300 hover:text-pink-600 transition-all duration-300 disabled:opacity-50"
                            >
                                {isProcessing === 'enterprise' ? 'Processando...' : 'Assinar Agora'}
                            </button>
                        </motion.div>

                    </div>

                    {/* --- RISK REVERSAL: GARANTIA BLINDADA --- */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-32 p-10 md:p-16 rounded-[3rem] bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100/30 blur-[80px] rounded-full -mr-20 -mt-20"></div>
                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12 text-left">
                            <div className="w-32 h-32 md:w-48 md:h-48 shrink-0 bg-white rounded-full shadow-inner border border-emerald-100 flex items-center justify-center p-4">
                                <img src="https://cdn-icons-png.flaticon.com/512/3513/3513233.png" alt="Selo de Garantia 7 Dias" className="w-full h-full object-contain opacity-80" />
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter uppercase italic">
                                    Risco Zero. <span className="text-emerald-600">Satisfação ou seu Dinheiro de Volta.</span>
                                </h2>
                                <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">
                                    Estamos tão confiantes no poder do <strong className="text-gray-900">Voltris Optimizer</strong> que oferecemos uma garantia incondicional de 7 dias. Se você não notar um aumento de FPS ou seu PC continuar lento, basta solicitar o reembolso. <strong className="text-gray-900">Sem perguntas, sem burocracia.</strong>
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* --- CONVERSION FAQ: QUEBRA DE OBJEÇÕES --- */}
                    <div className="mt-32 text-left max-w-4xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Perguntas sobre a Assinatura</h2>
                            <p className="text-gray-500">Tudo o que você precisa saber para assinar com tranquilidade.</p>
                        </div>
                        <div className="space-y-6">
                            {[
                                { q: "Como recebo minha licença?", a: "Imediatamente após a confirmação do pagamento, você receberá sua chave de ativação por e-mail e também poderá visualizá-la no seu painel de usuário no site." },
                                { q: "Posso cancelar quando quiser?", a: "Sim. A assinatura não possui fidelidade. Você pode cancelar a renovação automática a qualquer momento com apenas um clique nas configurações da sua conta." },
                                { q: "A licença funciona em mais de um PC?", a: "Depende do plano escolhido. O plano Standard é para 1 PC, o Pro para 3 PCs e o Enterprise é ilimitado para sua empresa." },
                                { q: "Quais são as formas de pagamento?", a: "Aceitamos Cartão de Crédito (em até 12x), Pix e Boleto Bancário. Pagamentos via Pix e Cartão liberam a licença na hora." }
                            ].map((faq, i) => (
                                <div key={i} className="p-8 bg-white border border-gray-100 rounded-3xl hover:shadow-lg transition-all">
                                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-3">
                                        <HelpCircle className="w-5 h-5 text-blue-500" /> {faq.q}
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* --- LIVE PROOF TICKET --- */}
                    <div className="mt-24 inline-flex items-center gap-3 px-6 py-3 bg-white border border-gray-200 rounded-full shadow-sm animate-bounce">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                        <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">
                            <strong className="text-gray-900">1.240+</strong> Licenças ativadas nos últimos 30 dias
                        </span>
                    </div>

                    {/* Trust Badges */}
                    <div className="mt-24 pt-12 border-t border-gray-200 grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { icon: ShieldCheck, label: 'Garantia Incondicional', color: '#10b981' },
                            { icon: Lock, label: 'SSL 256-bit Secure Checkout', color: '#3b82f6' },
                            { icon: MessageSquare, label: 'Suporte Humanizado via WhatsApp', color: '#8b5cf6' },
                            { icon: Zap, label: 'Entrega Digital Imediata', color: '#f59e0b' }
                        ].map((badge, i) => (
                            <div key={i} className="flex flex-col items-center text-center gap-3">
                                <badge.icon style={{ color: badge.color }} className="w-6 h-6 opacity-60" />
                                <span className="text-[10px] uppercase tracking-widest font-black text-gray-600">{badge.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}

export default function AdquirirLicencaPage() {
    return (
        <>
            <Header />
            <h1 className="sr-only">Adquirir Licença Voltris Optimizer</h1>
            <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
                <AdquirirLicencaContent />
            </Suspense>
            <Footer />
        </>
    );
}
