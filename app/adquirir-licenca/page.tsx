"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, MessageSquare, CheckCircle2, Lock, Cpu, Server, ChevronDown, Rocket, Crown, Star } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';
import { toast } from 'react-hot-toast';

function AdquirirLicencaContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, loading: authLoading } = useAuth();
    const [isProcessing, setIsProcessing] = useState<string | null>(null);
    const [showCpfModal, setShowCpfModal] = useState<string | null>(null); // planType sendo comprado
    const [cpf, setCpf] = useState('');
    const [cpfError, setCpfError] = useState('');

    const installationId = searchParams.get('installation_id');
    const planFromUrl = searchParams.get('plan');
    const [hasAttemptedAutoPurchase, setHasAttemptedAutoPurchase] = useState(false);

    useEffect(() => {
        if (!authLoading && user && planFromUrl && !hasAttemptedAutoPurchase && !isProcessing) {
            setHasAttemptedAutoPurchase(true);
            handlePurchase(planFromUrl);
        }
    }, [authLoading, user, planFromUrl, hasAttemptedAutoPurchase, isProcessing]);

    const scrollToPurchase = () => {
        const purchaseSection = document.getElementById('purchase-section');
        if (purchaseSection) {
            purchaseSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const formatCpf = (v: string) => {
        const n = v.replace(/\D/g, '').substring(0, 11);
        return n.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    };

    const handlePurchase = async (planType: string) => {
        if (authLoading) return;

        if (!user) {
            toast.error("Você precisa estar logado para continuar.");
            const redirectPath = `/adquirir-licenca?plan=${planType}${installationId ? `&installation_id=${installationId}` : ''}`;
            router.push(`/login?redirect=${encodeURIComponent(redirectPath)}`);
            return;
        }

        setIsProcessing(planType);

        try {
            const planData: any = {
                standard: { id: 'std_annual', name: 'Licença Standard Anual', price: 1.00 },
                pro: { id: 'pro_annual', name: 'Licença Pro Anual', price: 1.00 },
                enterprise: { id: 'ent_annual', name: 'Licença Enterprise Anual', price: 1.00 }
            };

            const selectedPlan = planData[planType];

            const response = await fetch('/api/pagamento/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: [{
                        id: selectedPlan.id,
                        name: selectedPlan.name,
                        price: selectedPlan.price,
                        quantity: 1
                    }],
                    customer: {
                        name: user.user_metadata?.full_name || '',
                        email: user.email,
                        phone: user.user_metadata?.phone || '',
                    },
                    license_type: planType,
                    user_id: user.id
                })
            });

            const data = await response.json();

            if (data.checkout_url) {
                window.location.href = data.checkout_url;
            } else {
                throw new Error(data.error || 'Erro ao criar checkout');
            }
        } catch (error: any) {
            console.error('Erro no checkout:', error);
            toast.error(`Erro ao processar: ${error.message}`);
        } finally {
            setIsProcessing(null);
        }
    };

    return (
        <main className="min-h-screen bg-[#050510] text-slate-200 font-sans selection:bg-[#31A8FF]/30 relative pb-20">

            {/* Global Ambient Background Effects */}
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none z-50"></div>

            {/* Background Gradients */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-[#31A8FF]/10 blur-[120px] rounded-full mix-blend-screen animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[800px] h-[800px] bg-[#8B31FF]/10 blur-[120px] rounded-full mix-blend-screen animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
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
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8"
                    >
                        <Lock className="w-3 h-3 text-[#31A8FF]" />
                        <span className="text-[10px] sm:text-xs font-bold text-white/70 tracking-widest uppercase">Pagamento Seguro & Ativação Imediata</span>
                    </motion.div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-8 leading-[1.1] text-white drop-shadow-2xl">
                        DOMINE SEU PC COM <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B]">
                            PODER TOTAL
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-12 font-light leading-relaxed">
                        Escolha o plano ideal para sua gameplay ou produtividade. Ativação automática e suporte especializado em até 24h.
                    </p>

                    <motion.button
                        onClick={scrollToPurchase}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="group inline-flex items-center gap-3 px-10 py-5 bg-white text-black font-black text-lg rounded-full transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                    >
                        VER PLANOS
                        <ChevronDown className="w-5 h-5 animate-bounce" />
                    </motion.button>
                </motion.div>
            </section>

            {/* PLANS SECTION */}
            <section id="purchase-section" className="relative z-10 py-20 px-4">
                <div className="max-w-7xl mx-auto">

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                        {/* Standard Plan */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-[#0A0A0E]/60 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 flex flex-col justify-between hover:border-[#31A8FF]/30 transition-all duration-500 group"
                        >
                            <div>
                                <div className="w-14 h-14 rounded-2xl bg-[#31A8FF]/10 flex items-center justify-center mb-6 border border-[#31A8FF]/20 text-[#31A8FF]">
                                    <Star className="w-7 h-7" />
                                </div>
                                <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">Standard</h3>
                                <p className="text-slate-500 text-sm mb-6">Essencial para um único PC.</p>

                                <div className="mb-8">
                                    <span className="text-4xl font-black text-white">R$ 149,90</span>
                                    <span className="text-slate-500 text-lg font-medium">/ano</span>
                                </div>

                                <ul className="space-y-4 mb-10">
                                    <li className="flex items-center gap-3 text-sm text-slate-300">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                                        <span>✓ 1 Dispositivo ativado</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-slate-300 opacity-50">
                                        <CheckCircle2 className="w-5 h-5 text-slate-600 shrink-0" />
                                        <span className="line-through">Ativação em 3 computadores</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-slate-300">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                                        <span>Otimização Windows Pro</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-slate-300">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                                        <span>Suporte via Ticket / Email</span>
                                    </li>
                                </ul>
                            </div>

                            <button
                                onClick={() => handlePurchase('standard')}
                                disabled={isProcessing !== null}
                                className="w-full py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-50"
                            >
                                {isProcessing === 'standard' ? 'Processando...' : 'Assinar Agora'}
                            </button>
                        </motion.div>

                        {/* PRO Plan (Best Value) */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-[#0A0A0E]/80 backdrop-blur-2xl border-2 border-[#8B31FF] rounded-[2.5rem] p-8 md:p-10 flex flex-col justify-between relative shadow-[0_0_50px_rgba(139,49,255,0.2)] transform scale-105 z-20 group"
                        >
                            <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-6 py-1 bg-gradient-to-r from-[#8B31FF] to-[#31A8FF] rounded-full text-[10px] font-black tracking-widest text-white uppercase shadow-lg">
                                MAIS VENDIDO
                            </div>

                            <div>
                                <div className="w-16 h-16 rounded-2xl bg-[#8B31FF]/10 flex items-center justify-center mb-6 border border-[#8B31FF]/20 text-[#8B31FF]">
                                    <Rocket className="w-8 h-8" />
                                </div>
                                <h3 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">Pro Gamer</h3>
                                <p className="text-slate-400 text-sm mb-6 font-medium">A escolha para entusiastas.</p>

                                <div className="mb-8">
                                    <span className="text-5xl font-black text-white">R$ 449,90</span>
                                    <span className="text-[#8B31FF] text-xl font-black">/ano</span>
                                </div>

                                <ul className="space-y-4 mb-10">
                                    <li className="flex items-center gap-3 text-sm text-white font-medium">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                                        <span>3 Dispositivos simultâneos</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-white font-medium">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                                        <span>Otimização Ultra-Low Latency</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-white font-medium">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                                        <span>Suporte Prioritário VIP</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-white font-medium">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                                        <span>Limpeza Profunda Automática</span>
                                    </li>
                                </ul>
                            </div>

                            <button
                                onClick={() => handlePurchase('pro')}
                                disabled={isProcessing !== null}
                                className="w-full py-5 bg-gradient-to-r from-[#8B31FF] to-[#31A8FF] text-white font-black text-xl rounded-2xl hover:brightness-125 hover:scale-[1.02] transition-all duration-300 shadow-[0_10px_30px_rgba(139,49,255,0.4)] disabled:opacity-50"
                            >
                                {isProcessing === 'pro' ? 'Processando...' : 'Obter Pro Gamer'}
                            </button>
                        </motion.div>

                        {/* Enterprise Plan */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-[#0A0A0E]/60 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 flex flex-col justify-between hover:border-[#FF4B6B]/30 transition-all duration-500 group"
                        >
                            <div>
                                <div className="w-14 h-14 rounded-2xl bg-[#FF4B6B]/10 flex items-center justify-center mb-6 border border-[#FF4B6B]/20 text-[#FF4B6B]">
                                    <Crown className="w-7 h-7" />
                                </div>
                                <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">Enterprise</h3>
                                <p className="text-slate-500 text-sm mb-6">Para lan houses e empresas.</p>

                                <div className="mb-8">
                                    <span className="text-4xl font-black text-white">R$ 1490,90</span>
                                    <span className="text-[#FF4B6B] text-lg font-bold">/ano</span>
                                </div>

                                <ul className="space-y-4 mb-10">
                                    <li className="flex items-center gap-3 text-sm text-slate-300 font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B6B] to-[#FFD700]">
                                        <CheckCircle2 className="w-5 h-5 text-[#FF4B6B] shrink-0" />
                                        <span>Dispositivos ILIMITADOS</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-slate-300">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                                        <span>Acesso a todas as APIs</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-slate-300">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                                        <span>Suporte 24/7 WhatsApp VIP</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-slate-300">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                                        <span>Sem mensalidades ocultas</span>
                                    </li>
                                </ul>
                            </div>

                            <button
                                onClick={() => handlePurchase('enterprise')}
                                disabled={isProcessing !== null}
                                className="w-full py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:border-[#FF4B6B] hover:text-[#FF4B6B] transition-all duration-300 disabled:opacity-50"
                            >
                                {isProcessing === 'enterprise' ? 'Processando...' : 'Obter Vitalício'}
                            </button>
                        </motion.div>

                    </div>

                    {/* Trust Badges */}
                    <div className="mt-24 pt-12 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { icon: ShieldCheck, label: 'Garantia de 7 dias', color: '#10b981' },
                            { icon: Lock, label: 'Checkout Seguro', color: '#3b82f6' },
                            { icon: MessageSquare, label: 'Suporte Humanizado', color: '#8b5cf6' },
                            { icon: Zap, label: 'Ativação Instantânea', color: '#f59e0b' }
                        ].map((badge, i) => (
                            <div key={i} className="flex flex-col items-center text-center gap-3">
                                <badge.icon style={{ color: badge.color }} className="w-6 h-6 opacity-60" />
                                <span className="text-[10px] uppercase tracking-widest font-black text-slate-500">{badge.label}</span>
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
            <Suspense fallback={<div className="min-h-screen bg-[#050510]" />}>
                <AdquirirLicencaContent />
            </Suspense>
            <Footer />
        </>
    );
}
