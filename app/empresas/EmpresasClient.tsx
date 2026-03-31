'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ShieldCheck, Cpu, HardDrive, Lock, Users, Clock, Globe, Zap, CheckCircle2, Building2 } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

export default function EmpresasClient() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#050510] font-sans selection:bg-[#8B31FF]/30 overflow-hidden">
        
        {/* HERO SECTION B2B */}
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-24 pb-12 px-4">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none z-0"></div>
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#8B31FF]/10 blur-[150px] rounded-full mix-blend-screen pointer-events-none z-0"></div>
          
          <div className="max-w-5xl mx-auto text-center relative z-10 w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8"
            >
              <Building2 className="w-4 h-4 text-[#8B31FF]" />
              <span className="text-xs font-bold text-white tracking-widest uppercase">VOLTRIS CORPORATE</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight leading-tight"
            >
              Gestão Avançada de TI <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B31FF] to-[#31A8FF]">para sua Empresa</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-12 font-light"
            >
              Maximize a produtividade, reduza o tempo de inatividade (SLA 99.9%) e garanta conformidade com a LGPD através do suporte remoto proativo da VOLTRIS.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <a
                href="https://wa.me/5511996716235?text=Ol%C3%A1%20VOLTRIS,%20gostaria%20de%20falar%20sobre%20suporte%20de%20TI%20para%20minha%20empresa!"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2"
              >
                Falar com Especialista B2B
              </a>
              <Link
                href="/voltrisoptimizer"
                className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/20 text-white font-bold rounded-xl hover:bg-white/5 transition-all flex items-center justify-center gap-2"
              >
                Conhecer SaaS (Otimizador)
              </Link>
            </motion.div>
          </div>
        </section>

        {/* BENEFÍCIOS SECTION */}
        <AnimatedSection direction="up" delay={0.2}>
          <section className="py-24 px-4 bg-[#0A0A0F] border-t border-b border-white/5 relative z-10">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Por que a VOLTRIS é o Parceiro Ideal?</h2>
                <p className="text-slate-400 max-w-2xl mx-auto">Não somos apenas "técnicos", aplicamos engenharia de software para garantir que sua equipe nunca pare de produzir por causa de computadores lentos ou falhas de sistema.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#12121A] p-8 rounded-3xl border border-white/5 hover:border-[#8B31FF]/40 transition-all group">
                  <div className="w-14 h-14 rounded-2xl bg-[#8B31FF]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Zap className="w-7 h-7 text-[#8B31FF]" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Produtividade Máxima</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Otimizamos toda frota de computadores para garantir que sistemas pesados como ERPs e AutoCAD rodem com fluidez.
                  </p>
                </div>

                <div className="bg-[#12121A] p-8 rounded-3xl border border-white/5 hover:border-[#31A8FF]/40 transition-all group">
                  <div className="w-14 h-14 rounded-2xl bg-[#31A8FF]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Lock className="w-7 h-7 text-[#31A8FF]" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Segurança e LGPD</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Políticas de acesso, criptografia, backups programados e bloqueio de malwares (Ransomware) integrados ao serviço.
                  </p>
                </div>

                <div className="bg-[#12121A] p-8 rounded-3xl border border-white/5 hover:border-[#FF4B6B]/40 transition-all group">
                  <div className="w-14 h-14 rounded-2xl bg-[#FF4B6B]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Clock className="w-7 h-7 text-[#FF4B6B]" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">SLA Expresso Remoto</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Resolva paradas da equipe através de acesso remoto criptografado em minutos, reduzindo o custo hora-inativa.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </AnimatedSection>

        {/* SAAS SOLUTION HIGHLIGHT */}
        <AnimatedSection direction="up" delay={0.1}>
          <section className="py-24 px-4 bg-gradient-to-b from-[#050510] to-[#0A0A0F] relative">
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1 lg:pr-12">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                  Gestão Centralizada via <span className="text-[#8B31FF]">Painel Web SaaS</span>
                </h2>
                <p className="text-slate-400 text-lg leading-relaxed mb-8">
                  Diferente do suporte clássico, a Voltris oferece o software <strong className="text-white">Optimizer Dashboard</strong>. Acompanhe a saúde, temperatura e estabilidade de cada computador da sua empresa de um único painel via web.
                </p>
                
                <ul className="space-y-4 mb-8">
                  {['Inventário de Hardware Remoto', 'Otimização com 1 clique para todos os funcionários', 'Bloqueio de sites nocivos em massa', 'Logs de auditoria e estabilidade do Windows'].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-[#00FF94] shrink-0" />
                      <span className="text-slate-300 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex-1 w-full bg-[#12121A] rounded-2xl p-6 border border-[#8B31FF]/20 shadow-[0_0_50px_rgba(139,49,255,0.1)]">
                 <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center pb-4 border-b border-white/5">
                        <div className="flex items-center gap-2">
                           <Globe className="w-5 h-5 text-[#8B31FF]" />
                           <span className="text-white font-bold">Voltris Central (Frota de PCs)</span>
                        </div>
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">24/24 Online</span>
                    </div>
                    {['Marketing - PC01', 'Diretoria - Note 2', 'Recepcão - Desk'].map((pc, index) => (
                       <div key={index} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                           <div className="flex items-center gap-3">
                               <Cpu className="w-4 h-4 text-slate-400" />
                               <span className="text-slate-300 text-sm">{pc}</span>
                           </div>
                           <button className="text-xs text-[#31A8FF] bg-[#31A8FF]/10 px-3 py-1.5 rounded hover:bg-[#31A8FF]/20">Otimizar</button>
                       </div>
                    ))}
                 </div>
              </div>
            </div>
          </section>
        </AnimatedSection>

      </main>
      <Footer />
    </>
  );
}
