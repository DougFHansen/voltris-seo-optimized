"use client";

import React from 'react';
import CorporateHeader from '@/components/CorporateHeader';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Quote, CheckCircle2, ChevronRight, Briefcase, Stethoscope, Scale, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

const CASES = [
  {
    client: "MedCenter Prime",
    segment: "Saúde",
    icon: <Stethoscope />,
    problem: "Lentidão constante nos sistemas de prontuário e quedas frequentes de internet.",
    solution: "Otimização profunda de rede, gestão de Wi-Fi e monitoramento proativo de servidores.",
    result: "Sistemas 40% mais rápidos e zero quedas registradas nos últimos 6 meses."
  },
  {
    client: "Hansen Advogados",
    segment: "Direito",
    icon: <Scale />,
    problem: "Vulnerabilidade em dados de clientes e falta de backup seguro.",
    solution: "Implementação de criptografia ponta-a-ponta e sistema de Disaster Recovery em nuvem.",
    result: "100% de adequação à LGPD e recuperação total de arquivos em menos de 1 hora em testes."
  }
];

export default function CasesClient() {
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
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-8"
          >
            Prova Social & Resultados B2B
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Cases de <span className="text-blue-500">Sucesso.</span></h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed font-light">
            Conheça histórias reais de empresas que transformaram sua tecnologia com a Voltris.
          </p>
        </div>
      </section>

      {/* Cases Grid */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto space-y-12">
          {CASES.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-12 rounded-[3rem] bg-white/[0.02] border border-white/5 flex flex-col lg:flex-row gap-12 items-center"
            >
              <div className="w-24 h-24 shrink-0 rounded-3xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                {React.cloneElement(item.icon as React.ReactElement, { className: "w-10 h-10" })}
              </div>
              <div className="flex-1">
                <div className="text-blue-500 text-xs font-black uppercase tracking-widest mb-2">{item.segment}</div>
                <h3 className="text-3xl font-bold mb-6">{item.client}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Desafio</div>
                    <p className="text-slate-400 text-sm leading-relaxed">{item.problem}</p>
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 mb-2">Solução Voltris</div>
                    <p className="text-slate-300 text-sm leading-relaxed">{item.solution}</p>
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 mb-2">Resultado</div>
                    <p className="text-white text-sm font-medium leading-relaxed">{item.result}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
