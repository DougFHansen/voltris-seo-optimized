"use client";

import React from 'react';
import CorporateHeader from '@/components/CorporateHeader';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { CheckCircle2, ChevronRight, Zap, Shield, Briefcase } from 'lucide-react';
import Link from 'next/link';

const PLANS = [
  {
    name: "Essencial",
    price: "R$ 499",
    period: "/mês",
    desc: "Ideal para pequenas empresas com até 5 máquinas que precisam de suporte rápido.",
    features: ["Atendimento via WhatsApp", "Suporte AnyDesk Ilimitado", "Backup em Nuvem (100GB)", "Limpeza & Otimização Trimestral"],
    cta: "Contratar Essencial",
    popular: false
  },
  {
    name: "Business Pro",
    price: "R$ 999",
    period: "/mês",
    desc: "Suporte completo para empresas de médio porte com gestão de rede e servidores.",
    features: ["SLA de 15 minutos", "Gestão de Firewall & Rede", "Backup em Nuvem (500GB)", "Monitoramento de Servidores", "Consultoria de Segurança"],
    cta: "Contratar Business Pro",
    popular: true
  },
  {
    name: "Enterprise",
    price: "Sob Consulta",
    period: "",
    desc: "Solução sob medida para grandes infraestruturas com suporte dedicado 24/7.",
    features: ["Gestor de Conta Dedicado", "Infraestrutura Híbrida", "Auditoria de Segurança Trimestral", "Adequação LGPD Completa", "SLA Crítico Garantido"],
    cta: "Falar com Consultor",
    popular: false
  }
];

export default function CorporatePlansClient() {
  return (
    <div className="bg-[#020205] text-white min-h-screen font-sans selection:bg-blue-500/30 relative">
      <div className="fixed inset-0 noise-bg pointer-events-none opacity-[0.03] z-[100]"></div>
      <CorporateHeader />
      
      {/* Header */}
      <section className="pt-40 pb-20 border-b border-white/5 relative overflow-hidden">
        {/* Background Radial Glows - Exact Home Replication */}
        <div className="absolute top-[-10%] left-[-10%] w-[1000px] h-[1000px] rounded-full bg-[#31A8FF]/10 blur-[180px] pointer-events-none z-0" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[1000px] h-[1000px] rounded-full bg-[#8B31FF]/10 blur-[180px] pointer-events-none z-0" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[800px] rounded-full bg-[#FF4B6B]/5 blur-[200px] pointer-events-none z-0" />
        
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Investimento em <span className="text-blue-500">Continuidade.</span></h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed font-light">
            Planos de suporte técnico gerenciado com valores fixos para que sua empresa tenha previsibilidade e máxima performance.
          </p>
        </div>
      </section>

      {/* Plans Grid */}
      <section className="py-32 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {PLANS.map((plan, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className={`p-10 rounded-[3rem] border transition-all flex flex-col ${
                plan.popular 
                ? 'bg-blue-600/10 border-blue-500 shadow-[0_0_50px_rgba(59,130,246,0.1)]' 
                : 'bg-white/[0.02] border-white/10 hover:border-white/20'
              }`}
            >
              {plan.popular && (
                <div className="px-4 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full w-fit mb-6">Recomendado</div>
              )}
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-black">{plan.price}</span>
                <span className="text-slate-500 text-sm">{plan.period}</span>
              </div>
              <p className="text-slate-400 text-sm mb-10 leading-relaxed min-h-[3rem]">{plan.desc}</p>
              <ul className="space-y-4 mb-12 flex-1">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-3 text-xs font-bold text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-blue-500" /> {f}
                  </li>
                ))}
              </ul>
              <a 
                href={`https://wa.me/5511996716235?text=Olá! Gostaria de saber mais sobre o plano ${plan.name} para minha empresa.`}
                className={`w-full py-5 rounded-2xl font-black text-center transition-all uppercase tracking-widest text-xs ${
                  plan.popular 
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-900/30' 
                  : 'bg-white text-slate-900 hover:bg-slate-100'
                }`}
              >
                {plan.cta}
              </a>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
