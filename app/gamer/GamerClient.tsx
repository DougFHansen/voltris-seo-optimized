"use client";

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Target, 
  Cpu, 
  Gamepad2, 
  Activity, 
  ArrowRight,
  ShieldAlert,
  Flame,
  Award,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

const GAMER_SERVICES = [
  {
    title: "Otimização DNA Gaming",
    desc: "Nossa otimização proprietária que ajusta kernel, registros e serviços para latência zero.",
    icon: <Target className="w-8 h-8" />,
    features: ["+20% a 40% de FPS", "Input Lag Reduzido", "Zero Stuttering"]
  },
  {
    title: "Tuning de Latência de Rede",
    desc: "Ajustes profundos nos protocolos de rede do Windows para o menor ping possível.",
    icon: <Zap className="w-8 h-8" />,
    features: ["Redução de Jitter", "Priorização de Pacotes", "Estabilidade de Conexão"]
  },
  {
    title: "Overclock Seguro (RAM/CPU)",
    desc: "Extraia o máximo do seu hardware com estabilidade garantida e monitoramento técnico.",
    icon: <Cpu className="w-8 h-8" />,
    features: ["Ajuste de Timings de RAM", "Undervolt de GPU", "Monitoramento de Térmicas"]
  }
];

export default function GamerClient() {
  return (
    <div className="bg-[#020205] text-white min-h-screen font-sans selection:bg-purple-500/30 relative">
      <div className="fixed inset-0 noise-bg pointer-events-none opacity-[0.03] z-[100]"></div>
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden min-h-screen flex items-center">
        {/* Background Radial Glows - Exact Home Replication */}
        <div className="absolute top-[-10%] left-[-10%] w-[1000px] h-[1000px] rounded-full bg-[#31A8FF]/10 blur-[180px] pointer-events-none z-0" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[1000px] h-[1000px] rounded-full bg-[#8B31FF]/10 blur-[180px] pointer-events-none z-0" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[800px] rounded-full bg-[#FF4B6B]/5 blur-[200px] pointer-events-none z-0" />
        
        <div className="max-w-7xl mx-auto px-4 relative z-10 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-black uppercase tracking-widest mb-8"
              >
                <Flame className="w-4 h-4 animate-pulse" /> Performance Gamer de Elite
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-6xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter"
              >
                DOMINE O <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500">SERVIDOR.</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl text-slate-400 mb-10 max-w-xl font-medium leading-relaxed"
              >
                Não deixe o Windows segurar seu hardware. Otimização profissional 100% remota 
                via AnyDesk para quem busca cada milissegundo de vantagem competitiva.
              </motion.p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                <a 
                  href="https://wa.me/5511996716235?text=Olá! Quero otimizar meu PC para ganhar FPS e reduzir input lag."
                  className="px-10 py-5 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-black rounded-2xl transition-all hover:scale-105 shadow-lg shadow-purple-900/50 flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
                >
                  <Zap className="w-5 h-5" /> Iniciar Otimização
                </a>
                <Link 
                  href="/voltrisoptimizer"
                  className="px-10 py-5 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl border border-white/10 transition-all flex items-center justify-center uppercase tracking-widest text-sm"
                >
                  Download Optimizer
                </Link>
              </div>
            </div>
            <div className="flex-1 relative">
               <div className="relative p-2 rounded-[3rem] bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                  <div className="bg-[#020205] rounded-[2.8rem] p-10 border border-white/5 relative overflow-hidden">
                     <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                     <div className="relative z-10 space-y-8">
                        <div className="flex items-center justify-between">
                           <div className="text-purple-400 font-black text-xs tracking-widest uppercase">Sistema Otimizado</div>
                           <Activity className="w-6 h-6 text-purple-500 animate-pulse" />
                        </div>
                        <div className="space-y-4">
                           <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                              <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} transition={{ duration: 2 }} className="h-full bg-purple-500"></motion.div>
                           </div>
                           <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                               <span>Latência de Kernel</span>
                               <span className="text-purple-400">-65%</span>
                           </div>
                        </div>
                        <div className="space-y-4">
                           <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                              <motion.div initial={{ width: 0 }} animate={{ width: '92%' }} transition={{ duration: 2, delay: 0.5 }} className="h-full bg-blue-500"></motion.div>
                           </div>
                           <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                               <span>Estabilidade de FPS</span>
                               <span className="text-blue-400">+40%</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-around gap-8">
           {[
             { l: "FPS Ganho", v: "20-40%" },
             { l: "Input Lag", v: "-5ms" },
             { l: "PCs Tunados", v: "8.5k+" },
             { l: "Duração", v: "60 min" }
           ].map((s, i) => (
             <div key={i} className="text-center">
               <div className="text-3xl font-black text-white mb-1">{s.v}</div>
               <div className="text-[10px] font-black text-purple-400 uppercase tracking-widest">{s.l}</div>
             </div>
           ))}
        </div>
      </section>

      {/* Services */}
      <section className="py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter">ENGENHARIA PARA <span className="text-purple-500">VENCER.</span></h2>
            <p className="text-slate-400 max-w-2xl mx-auto font-medium">Cada configuração é feita manualmente por especialistas em eSports para o seu hardware específico.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {GAMER_SERVICES.map((svc, i) => (
              <div key={i} className="group p-10 rounded-[2.5rem] bg-gradient-to-b from-white/[0.03] to-transparent border border-white/10 hover:border-purple-500/30 transition-all">
                <div className="mb-8 p-4 rounded-2xl bg-purple-600/10 text-purple-400 inline-block group-hover:bg-purple-600 group-hover:text-white transition-all">
                  {svc.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{svc.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-8">{svc.desc}</p>
                <ul className="space-y-3">
                  {svc.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-xs font-bold text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Games Supported */}
      <section className="py-24 bg-white/[0.02]">
         <div className="max-w-7xl mx-auto px-4 text-center">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] mb-12">Performance Otimizada Para</h3>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 grayscale opacity-40">
               {["VALORANT", "CS2", "FORTNITE", "WARZONE", "LOL", "GTA V"].map(g => (
                 <span key={g} className="text-2xl font-black italic tracking-tighter">{g}</span>
               ))}
            </div>
         </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-4">
        <div className="max-w-5xl mx-auto rounded-[4rem] bg-gradient-to-br from-purple-600 to-blue-700 p-12 md:p-20 text-center relative overflow-hidden">
           <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
           <div className="relative z-10">
              <Award className="w-16 h-16 text-white/50 mx-auto mb-8" />
              <h2 className="text-4xl md:text-7xl font-black mb-8 leading-[0.9]">PRONTO PARA O <br/> PRÓXIMO NÍVEL?</h2>
              <p className="text-white/80 text-xl mb-12 max-w-xl mx-auto font-medium">Não jogue com desvantagem. Agende sua otimização agora e sinta a diferença no primeiro round.</p>
              <a 
                href="https://wa.me/5511996716235"
                className="px-12 py-6 bg-white text-purple-600 font-black text-xl rounded-2xl transition-all hover:scale-105 shadow-2xl flex items-center justify-center gap-3 w-fit mx-auto"
              >
                Falar com Especialista <ArrowRight />
              </a>
           </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
