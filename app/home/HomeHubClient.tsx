"use client";

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { 
  Laptop, 
  ShieldCheck, 
  Clock, 
  HelpCircle, 
  CheckCircle2, 
  ArrowRight,
  MessageSquare,
  Wrench,
  Smartphone,
  HardDrive
} from 'lucide-react';

const HOME_SERVICES = [
  {
    title: "Formatação Remota Segura",
    desc: "Seu PC novo de novo. Instalamos o Windows, drivers e programas essenciais sem você sair de casa.",
    icon: <Laptop className="w-8 h-8" />,
    price: "R$ 100,00"
  },
  {
    title: "Limpeza & Otimização",
    desc: "Removemos arquivos inúteis, vírus e lentidões que travam o seu dia a dia.",
    icon: <Wrench className="w-8 h-8" />,
    price: "R$ 150,00"
  },
  {
    title: "Suporte a Impressoras & Wi-Fi",
    desc: "Resolvemos problemas de conexão, instalação de periféricos e redes domésticas.",
    icon: <Smartphone className="w-8 h-8" />,
    price: "Sob consulta"
  }
];

export default function HomeHubClient() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!mounted) return;

    const handleAnchorScroll = () => {
      const hash = window.location.hash;
      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          const headerHeight = 80;
          const elementPosition = (element as HTMLElement).offsetTop - headerHeight;
          window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
          });
        }
      }
    };

    handleAnchorScroll();
    window.addEventListener('hashchange', handleAnchorScroll);
    return () => window.removeEventListener('hashchange', handleAnchorScroll);
  }, [mounted]);

  if (!mounted) return null;
  return (
    <div className="bg-[#020205] text-white min-h-screen font-sans selection:bg-emerald-500/30 relative">
      <div className="fixed inset-0 noise-bg pointer-events-none opacity-[0.03] z-[100]"></div>
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden min-h-screen flex items-center border-b border-white/5">
        {/* Background Radial Glows - Exact Home Replication */}
        <div className="absolute top-[-10%] left-[-10%] w-[1000px] h-[1000px] rounded-full bg-[#31A8FF]/10 blur-[180px] pointer-events-none z-0" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[1000px] h-[1000px] rounded-full bg-[#8B31FF]/10 blur-[180px] pointer-events-none z-0" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[800px] rounded-full bg-[#FF4B6B]/5 blur-[200px] pointer-events-none z-0" />
        
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold mb-8"
          >
            <ShieldCheck className="w-4 h-4" /> Suporte Técnico Residencial de Confiança
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black mb-8 tracking-tighter text-white"
          >
            Seu computador <br />
            <span className="text-emerald-500">sem dor de cabeça.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto font-medium leading-relaxed"
          >
            Atendimento especializado 100% remoto via AnyDesk ou TeamViewer. 
            Resolvemos lentidão, vírus e problemas técnicos na sua tela, com rapidez e segurança total.
          </motion.p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://wa.me/5511996716235?text=Olá! Preciso de ajuda com meu computador pessoal."
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-5 h-5" /> Chamar no WhatsApp
            </a>
            <a 
              href="#servicos"
              className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 transition-all flex items-center justify-center"
            >
              Ver Preços e Serviços
            </a>
          </div>
        </div>
      </section>

      {/* Trust Elements */}
      <section className="py-16 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
           {[
             { i: <Clock />, t: "Atendimento Rápido", d: "Resolvemos a maioria dos problemas em menos de 1 hora." },
             { i: <ShieldCheck />, t: "100% Seguro", d: "Você acompanha todo o processo na sua tela." },
             { i: <HelpCircle />, t: "Suporte Amigável", d: "Explicamos tudo de forma simples, sem 'techês'." }
           ].map((t, i) => (
             <div key={i} className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 mb-6 shadow-sm">
                  {t.i}
                </div>
                <h3 className="text-lg font-bold mb-2">{t.t}</h3>
                <p className="text-slate-500 text-sm">{t.d}</p>
             </div>
           ))}
        </div>
      </section>

      {/* Services Grid */}
      <section id="servicos" className="py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">O que fazemos por você</h2>
            <p className="text-slate-500 max-w-xl mx-auto font-light">Temos a solução exata para deixar seu equipamento pronto para o uso diário, estudo ou lazer.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOME_SERVICES.map((svc, i) => (
              <div key={i} className="p-10 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/30 hover:shadow-2xl transition-all group">
                <div className="mb-8 p-4 rounded-2xl bg-emerald-500/10 text-emerald-400 inline-block group-hover:bg-emerald-500 group-hover:text-white transition-all">
                  {svc.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{svc.title}</h3>
                <p className="text-slate-500 text-sm mb-8 leading-relaxed">{svc.desc}</p>
                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                   <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">A partir de</span>
                   <span className="text-xl font-bold text-emerald-400">{svc.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Home */}
      <section className="py-32 px-4 bg-[#050508] text-white overflow-hidden relative border-y border-white/5">
         <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20 items-center">
            <div className="flex-1">
               <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight">Dúvidas Frequentes</h2>
               <div className="space-y-6">
                  {[
                    { q: "Como funciona o acesso remoto?", a: "Usamos softwares seguros como AnyDesk ou RustDesk. Você nos gera uma senha temporária e pode ver tudo o que estamos fazendo no seu PC em tempo real." },
                    { q: "E se o problema não for resolvido?", a: "Trabalhamos com garantia de satisfação. Se não conseguirmos resolver o problema técnico, você não paga nada." },
                    { q: "Meus arquivos estão seguros?", a: "Sim. Nossos procedimentos seguem normas de privacidade e nunca acessamos seus arquivos pessoais sem sua autorização explícita." }
                  ].map((f, i) => (
                    <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10">
                       <h4 className="text-lg font-bold mb-2 text-emerald-400">{f.q}</h4>
                       <p className="text-slate-400 text-sm leading-relaxed">{f.a}</p>
                    </div>
                  ))}
               </div>
            </div>
            <div className="flex-1 relative">
               <div className="p-12 rounded-[3rem] bg-emerald-600 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
                  <div className="relative z-10">
                    <HardDrive className="w-20 h-20 text-white/50 mx-auto mb-8" />
                    <h3 className="text-3xl font-bold mb-6">Precisa de um orçamento personalizado?</h3>
                    <p className="text-emerald-100 mb-10 font-medium">Explique seu problema para um técnico e receba o valor na hora via WhatsApp.</p>
                    <a 
                      href="https://wa.me/5511996716235"
                      className="px-10 py-5 bg-white text-emerald-600 font-bold rounded-2xl shadow-xl transition-all hover:scale-105 block"
                    >
                      Falar com Técnico Agora
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
