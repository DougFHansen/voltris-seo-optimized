"use client";

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, MessageSquare, CheckCircle2, Lock, Cpu, Server, ChevronDown } from 'lucide-react';

export default function AdquirirLicencaPage() {

    // Smooth scroll para a seção de compra
    const scrollToPurchase = () => {
        const purchaseSection = document.getElementById('purchase-section');
        if (purchaseSection) {
            purchaseSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <>
            <Header />
            <main className="min-h-screen bg-[#050510] text-slate-200 font-sans selection:bg-[#31A8FF]/30 relative overflow-hidden">

                {/* Background Effects */}
                <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none z-0"></div>
                <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-[#31A8FF]/10 blur-[120px] rounded-full mix-blend-screen animate-pulse-slow pointer-events-none"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[800px] h-[800px] bg-[#8B31FF]/10 blur-[120px] rounded-full mix-blend-screen animate-pulse-slow pointer-events-none" style={{ animationDelay: '2s' }}></div>

                {/* HERO Full Screen */}
                <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl mx-auto text-center"
                    >
                        {/* Tagline */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8"
                        >
                            <Lock className="w-3 h-3 text-[#31A8FF]" />
                            <span className="text-[10px] sm:text-xs font-bold text-white/70 tracking-widest uppercase">Pagamento Seguro & Ativação Imediata</span>
                        </motion.div>

                        {/* Huge Headline */}
                        <h1 className="text-4xl md:text-6xl lg:text-8xl font-black tracking-tighter mb-8 leading-[1.1] md:leading-[0.9] text-white drop-shadow-2xl">
                            ADQUIRA SUA <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B]">
                                LICENÇA PROFISSIONAL
                            </span>
                        </h1>

                        <p className="text-lg md:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 font-light leading-relaxed">
                            Ative a versão completa do Voltris Optimizer e tenha acesso a todos os recursos avançados, atualizações contínuas e suporte técnico especializado.
                        </p>

                        {/* Botão de Scroll CTA */}
                        <motion.button
                            onClick={scrollToPurchase}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="group inline-flex items-center gap-3 px-10 py-5 bg-white text-black font-black text-lg rounded-full transition-all duration-300"
                        >
                            ADQUIRIR LICENÇA
                            <ChevronDown className="w-5 h-5 animate-bounce" />
                        </motion.button>

                    </motion.div>

                    {/* Scroll Indicator */}
                    {/* Scroll Indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 1 }}
                        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500"
                    >
                        <div className="w-[1px] h-12 bg-gradient-to-b from-slate-500 to-transparent"></div>
                    </motion.div>
                </section>

                {/* PURCHASE SECTION (Destino do Scroll) */}
                <section id="purchase-section" className="relative z-10 py-32 px-4 bg-[#050510]">
                    <div className="max-w-4xl mx-auto">

                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Atendimento Comercial</h2>
                            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                                Nossa equipe está disponível para realizar a ativação da licença de forma rápida e segura.
                            </p>
                        </div>

                        {/* Card Principal de Conversão */}
                        <div className="bg-[#0A0A0E]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden group">

                            {/* Glow Effect on Hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[#31A8FF]/5 to-[#8B31FF]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                                {/* Lado Esquerdo: Benefícios */}
                                <div className="text-left space-y-8">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        <Zap className="w-5 h-5 text-[#FFD700]" />
                                        O que está incluído:
                                    </h3>
                                    <ul className="space-y-4">
                                        <li className="flex items-start gap-3 text-sm text-slate-300">
                                            <CheckCircle2 className="w-4 h-4 text-[#31A8FF] mt-0.5 shrink-0" />
                                            <span>Licença profissional com chave de ativação exclusiva</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-sm text-slate-300">
                                            <CheckCircle2 className="w-4 h-4 text-[#31A8FF] mt-0.5 shrink-0" />
                                            <span>Acesso completo a todos os módulos do sistema</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-sm text-slate-300">
                                            <CheckCircle2 className="w-4 h-4 text-[#31A8FF] mt-0.5 shrink-0" />
                                            <span>Atualizações contínuas e melhorias de performance</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-sm text-slate-300">
                                            <CheckCircle2 className="w-4 h-4 text-[#31A8FF] mt-0.5 shrink-0" />
                                            <span>Suporte técnico prioritário</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-sm text-slate-300">
                                            <CheckCircle2 className="w-4 h-4 text-[#31A8FF] mt-0.5 shrink-0" />
                                            <span>Política de reembolso de 7 dias</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* Lado Direito: CTA */}
                                <div className="flex flex-col space-y-6 bg-white/[0.03] p-8 rounded-2xl border border-white/5 h-full justify-between">
                                    <div className="space-y-4">
                                        <div className="text-sm font-bold text-white uppercase tracking-widest mb-2 border-b border-white/10 pb-2">
                                            Processo de compra
                                        </div>
                                        <p className="text-sm text-slate-400 leading-relaxed">
                                            No momento, o checkout automático está em fase final de implementação.
                                            Para garantir segurança e ativação imediata, o processo é realizado
                                            diretamente com nossa equipe comercial.
                                        </p>
                                    </div>

                                    <a
                                        href="https://wa.me/5511996716235?text=Olá,%20gostaria%20de%20adquirir%20uma%20licença%20profissional%20do%20Voltris%20Optimizer.%20Poderiam%20me%20ajudar?"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-lg rounded-xl transition-all duration-300 shadow-[0_4px_20px_rgba(37,211,102,0.3)] hover:shadow-[0_4px_30px_rgba(37,211,102,0.5)] transform hover:-translate-y-1"
                                    >
                                        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                                        Falar com Vendas
                                    </a>

                                    <p className="text-[11px] text-emerald-400 text-center font-medium">
                                        A licença é liberada imediatamente após a confirmação do pagamento.
                                    </p>
                                </div>
                            </div>

                            {/* Trust Footer do Card */}
                            <div className="mt-12 pt-8 border-t border-white/5 flex flex-wrap justify-center items-center gap-6">
                                <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400 font-medium">
                                    <span className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-emerald-500" /> Pagamento seguro</span>
                                    <span className="flex items-center gap-2"><MessageSquare className="w-5 h-5 text-[#31A8FF]" /> Atendimento humano</span>
                                    <span className="flex items-center gap-2"><Cpu className="w-5 h-5 text-[#FF4B6B]" /> Software verificado</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>
                <Footer />
            </main>
        </>
    );
}
