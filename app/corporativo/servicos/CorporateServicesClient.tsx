"use client";

import React from 'react';
import CorporateHeader from '@/components/CorporateHeader';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Clock, 
  RotateCcw, 
  Network, 
  CheckCircle2,
  ChevronRight,
  MonitorSmartphone,
  ShieldAlert,
  Zap
} from 'lucide-react';
import Link from 'next/link';

const CORPORATE_SERVICES_DETAILED = [
  {
    title: "Suporte Técnico Mensal",
    desc: "Atendimento ilimitado via AnyDesk/TeamViewer para sua equipe. Resolução de problemas em tempo real.",
    icon: <MonitorSmartphone className="w-12 h-12" />,
    details: ["Tempo de resposta < 15min", "Suporte Windows/Office", "Instalação de Softwares"]
  },
  {
    title: "Segurança de Dados & LGPD",
    desc: "Implementação de políticas de segurança, backup em nuvem e adequação à lei de proteção de dados.",
    icon: <ShieldCheck className="w-12 h-12" />,
    details: ["Backup Automatizado", "Proteção Ransomware", "Treinamento de Equipe"]
  },
  {
    title: "Infraestrutura & Redes",
    desc: "Gestão de servidores, Wi-Fi corporativo, VPNs seguras e otimização de conectividade.",
    icon: <Network className="w-12 h-12" />,
    details: ["Configuração de VPN", "Gestão de Wi-Fi", "Monitoramento 24/7"]
  }
];

export default function CorporateServicesClient() {
  return (
    <div className="bg-[#020205] text-white min-h-screen font-sans selection:bg-blue-500/30 relative">
      <div className="fixed inset-0 noise-bg pointer-events-none opacity-[0.03] z-[100]"></div>
      <CorporateHeader />
      
      {/* Header Section */}
      <section className="pt-40 pb-20 border-b border-white/5 relative overflow-hidden">
        {/* Background Radial Glows - Exact Home Replication */}
        <div className="absolute top-[-10%] left-[-10%] w-[1000px] h-[1000px] rounded-full bg-[#31A8FF]/10 blur-[180px] pointer-events-none z-0" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[1000px] h-[1000px] rounded-full bg-[#8B31FF]/10 blur-[180px] pointer-events-none z-0" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[800px] rounded-full bg-[#FF4B6B]/5 blur-[200px] pointer-events-none z-0" />
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Serviços de TI <br/><span className="text-blue-500">Nível Enterprise.</span></h1>
          <p className="text-slate-400 max-w-2xl text-lg leading-relaxed font-light">
            Soluções modulares projetadas para garantir que sua empresa nunca pare por problemas técnicos. 
            Suporte especializado com foco em continuidade operacional.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {CORPORATE_SERVICES_DETAILED.map((svc, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/10 hover:border-blue-500/50 transition-all group"
            >
              <div className="mb-8 text-blue-500 group-hover:scale-110 transition-transform duration-500">
                {svc.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4">{svc.title}</h3>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">{svc.desc}</p>
              <ul className="space-y-3 mb-10">
                {svc.details.map((d, j) => (
                  <li key={j} className="flex items-center gap-3 text-xs font-bold text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-blue-500" /> {d}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Plans Link CTA */}
      <section className="py-32 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-8">Precisa de Suporte Recorrente?</h2>
          <p className="text-slate-400 text-lg mb-12">Oferecemos planos mensais personalizados de acordo com o número de máquinas e complexidade da sua rede.</p>
          <Link 
            href="/corporativo/planos"
            className="px-10 py-5 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3 w-fit mx-auto shadow-xl shadow-blue-900/40"
          >
            Consultar Planos Mensais <ChevronRight />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
