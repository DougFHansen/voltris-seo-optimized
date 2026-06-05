"use client";

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { 
  Globe, 
  MessageSquare, 
  ShieldCheck, 
  Clock, 
  Zap, 
  CheckCircle2, 
  ChevronRight,
  Euro,
  CreditCard
} from 'lucide-react';
import Link from 'next/link';

export default function PortugalExpatPage() {
  return (
    <div className="bg-[#020205] text-white min-h-screen font-sans selection:bg-purple-500/30 relative">
      <div className="fixed inset-0 noise-bg pointer-events-none opacity-[0.03] z-[100]"></div>
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden min-h-screen flex items-center">
        {/* Background Radial Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[1000px] h-[1000px] rounded-full bg-[#31A8FF]/10 blur-[180px] pointer-events-none z-0" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[1000px] h-[1000px] rounded-full bg-[#8B31FF]/10 blur-[180px] pointer-events-none z-0" />
        
        <div className="max-w-7xl mx-auto px-4 relative z-10 w-full">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold mb-8 uppercase tracking-widest"
            >
              <Globe className="w-4 h-4" /> Suporte Técnico para Brasileiros em Portugal
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter"
            >
              Seu PC lento em <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Lisboa ou Porto?</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto font-medium leading-relaxed"
            >
              Resolva qualquer problema técnico 100% remoto, em português e com pagamento facilitado. 
              Sem precisar carregar seu computador até uma loja local ou lidar com termos técnicos em outro idioma.
            </motion.p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://wa.me/5511996716235?text=Olá! Moro em Portugal e preciso de suporte técnico para meu computador."
                className="px-8 py-5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-3 text-lg"
              >
                <MessageSquare className="w-6 h-6" /> Iniciar Suporte Agora
              </a>
              <Link 
                href="/exterior/servicos"
                className="px-8 py-5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/10 transition-all flex items-center justify-center"
              >
                Ver Serviços & Preços
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Expat Specific Benefits */}
      <section className="py-24 px-4 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="p-8 rounded-[2.5rem] bg-[#0A0A15] border border-white/10 text-center">
              <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 mx-auto mb-6">
                <Euro className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">Pagamento via Wise ou PIX</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Pague em Euros ou Reais. Aceitamos transferências locais para sua maior comodidade e economia.</p>
            </div>
            <div className="p-8 rounded-[2.5rem] bg-[#0A0A15] border border-white/10 text-center">
              <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 mx-auto mb-6">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">Ajustado ao seu Horário</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Atendemos no fuso horário de Portugal (GMT/BST). Não espere o horário comercial do Brasil para ser atendido.</p>
            </div>
            <div className="p-8 rounded-[2.5rem] bg-[#0A0A15] border border-white/10 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 mx-auto mb-6">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">Confiança Brasileira</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Entendemos exatamente o que você precisa. Suporte sem barreiras linguísticas ou culturais.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Common Problems for Expats */}
      <section className="py-32 px-4">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20 items-center">
          <div className="flex-1">
            <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter leading-tight">
              Problemas com sites do Brasil? <br />
              <span className="text-blue-500 text-3xl md:text-5xl font-bold italic">Nós resolvemos.</span>
            </h2>
            <div className="space-y-6">
              {[
                "Dificuldade em acessar bancos ou sites brasileiros do exterior",
                "Configuração de VPN para conteúdos restritos",
                "Lentidão severa em notebooks e computadores de trabalho",
                "Remoção de vírus e malwares sem formatar a máquina",
                "Otimização de rede para reuniões via Zoom/Teams sem travamentos"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-4 text-slate-300 font-medium">
                  <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0" />
                  {text}
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1">
             <div className="relative p-1 rounded-[3rem] bg-gradient-to-br from-blue-500/30 to-purple-500/30">
                <div className="bg-[#050508] rounded-[2.8rem] p-12 border border-white/5">
                   <h3 className="text-2xl font-bold mb-6">Solicite um Diagnóstico</h3>
                   <p className="text-slate-400 mb-8">Conte-nos o que está acontecendo e um especialista entrará em contato via WhatsApp para uma análise inicial.</p>
                   <a 
                    href="https://wa.me/5511996716235"
                    className="w-full py-5 bg-white text-blue-600 font-black rounded-2xl text-center hover:scale-[1.02] transition-all block text-lg shadow-xl"
                   >
                    Chamar no WhatsApp
                   </a>
                </div>
             </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
