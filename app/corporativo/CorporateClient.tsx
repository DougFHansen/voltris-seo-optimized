"use client";

import React from 'react';
import CorporateHeader from '@/components/CorporateHeader';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Clock, 
  BarChart3, 
  Users, 
  Cpu, 
  Network, 
  HardDrive, 
  Smartphone,
  Briefcase,
  Stethoscope,
  Scale,
  ShoppingCart,
  CheckCircle2,
  ChevronRight,
  MessageSquare,
  Lock
} from 'lucide-react';
import Link from 'next/link';

const SERVICES = [
  {
    title: "Suporte Técnico Gerenciado (MSP)",
    desc: "Monitoramento proativo e suporte ilimitado para sua equipe focar no que importa.",
    icon: <Users className="w-8 h-8" />,
    features: ["Atendimento Imediato", "Resolução Remota", "Gestão de Ativos"]
  },
  {
    title: "Segurança & Conformidade (LGPD)",
    desc: "Blindagem de dados e adequação total às normas vigentes de proteção à privacidade.",
    icon: <ShieldCheck className="w-8 h-8" />,
    features: ["Firewall Avançado", "Antivírus Enterprise", "Consultoria LGPD"]
  },
  {
    title: "Infraestrutura de Redes",
    desc: "Configuração de roteadores, Wi-Fi corporativo e cabeamento estruturado de alta velocidade.",
    icon: <Network className="w-8 h-8" />,
    features: ["Wi-Fi de Alta Densidade", "VPN Segura", "Otimização de Link"]
  },
  {
    title: "Backup & Recuperação (DR)",
    desc: "Seus dados protegidos contra ransomware e falhas críticas com redundância em nuvem.",
    features: ["Monitoramento de Servidores", "Gestão de Backups", "SLA Prioritário"]
  },
  {
    title: "Cibersegurança & LGPD",
    desc: "Blindagem de dados e adequação às normas de segurança para proteção total da empresa.",
    icon: <Lock className="w-8 h-8" />,
    features: ["Firewall & VPN", "Antivírus Enterprise", "Auditoria de Dados"]
  }
];

const SECTORS = [
  { name: "Clínicas & Saúde", icon: <Stethoscope />, desc: "Proteção de prontuários e estabilidade para sistemas de gestão médica." },
  { name: "Direito & Advocacia", icon: <Scale />, desc: "Segurança máxima para documentos sigilosos e acesso remoto a tribunais." },
  { name: "Escritórios & PMEs", icon: <Briefcase />, desc: "Produtividade total para equipes administrativas e financeiras." },
  { name: "Varejo & E-commerce", icon: <ShoppingCart />, desc: "Zero downtime para suas vendas e integração de sistemas de estoque." }
];

export default function CorporateClient() {
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
    <div className="bg-[#020205] text-white min-h-screen font-sans selection:bg-blue-500/30 relative">
      <div className="fixed inset-0 noise-bg pointer-events-none opacity-[0.03] z-[100]"></div>
      <CorporateHeader />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden border-b border-white/5 min-h-screen flex items-center">
        {/* Background Radial Glows - Exact Home Replication */}
        <div className="absolute top-[-10%] left-[-10%] w-[1000px] h-[1000px] rounded-full bg-[#31A8FF]/10 blur-[180px] pointer-events-none z-0" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[1000px] h-[1000px] rounded-full bg-[#8B31FF]/10 blur-[180px] pointer-events-none z-0" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[800px] rounded-full bg-[#FF4B6B]/5 blur-[200px] pointer-events-none z-0" />
        
        <div className="max-w-7xl mx-auto px-4 relative z-10 w-full">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-8"
            >
              <CheckCircle2 className="w-4 h-4" /> Soluções de TI Enterprise para PMEs
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]"
            >
              A Continuidade do seu <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 italic">Negócio em Primeiro Lugar.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed"
            >
              Suporte especializado 100% remoto, segurança cibernética e gestão de infraestrutura 
              via AnyDesk e TeamViewer. Transformamos TI em vantagem competitiva com agilidade total.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <a 
                href="https://wa.me/5511996716235?text=Olá! Gostaria de falar sobre suporte técnico para minha empresa."
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
              >
                Solicitar Consultoria Gratuita <ChevronRight className="w-5 h-5" />
              </a>
              <Link 
                href="/corporativo/planos"
                className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 transition-all flex items-center justify-center"
              >
                Conhecer Nossos Planos
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Stats Bar */}
      <section className="py-12 border-b border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Empresas Atendidas", val: "+1.500" },
              { label: "SLA de Atendimento", val: "15 min" },
              { label: "Satisfação (CSAT)", val: "99.8%" },
              { label: "Disponibilidade (Uptime)", val: "99.9%" }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.val}</div>
                <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Services Grid */}
      <section id="servicos" className="py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Gestão de TI 360°</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Uma infraestrutura sólida é a base de qualquer empresa de sucesso. Oferecemos suporte completo para que você não precise se preocupar com tecnologia.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {SERVICES.map((svc, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="p-10 rounded-[2rem] bg-gradient-to-b from-white/[0.05] to-transparent border border-white/[0.08] hover:border-blue-500/30 transition-all group"
              >
                <div className="mb-8 p-4 rounded-2xl bg-blue-600/10 text-blue-400 inline-block group-hover:bg-blue-600 group-hover:text-white transition-all">
                  {svc.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{svc.title}</h3>
                <p className="text-slate-400 mb-8 leading-relaxed">{svc.desc}</p>
                <ul className="space-y-3">
                  {svc.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sectors / Segments */}
      <section id="segmentos" className="py-32 px-4 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Soluções por Segmento</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Entendemos as dores específicas do seu mercado. Nossa consultoria entrega o que sua operação realmente precisa.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SECTORS.map((v, i) => (
              <div key={i} className="p-8 rounded-3xl bg-[#0A0F1C] border border-white/10 hover:border-blue-500/50 transition-all text-center">
                <div className="mb-6 mx-auto w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                  {v.icon}
                </div>
                <h4 className="text-xl font-bold mb-3">{v.name}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits / Case for Outsourcing */}
      <section className="py-32 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
             <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full"></div>
             <div className="relative p-1 rounded-3xl bg-gradient-to-br from-white/10 to-transparent">
               <div className="bg-[#0A0F1C] rounded-[calc(1.5rem-1px)] p-12 overflow-hidden relative">
                 <div className="space-y-6">
                   {[
                     { t: "Estabilidade Operacional", d: "Seu time focado no faturamento, não em problemas de computador." },
                     { t: "Redução de Custos", d: "Equipe técnica de elite por uma fração do custo de um funcionário interno." },
                     { t: "Segurança de Ativos", d: "Gestão profissional de backups e proteção contra sequestro de dados." }
                   ].map((b, i) => (
                     <div key={i} className="flex gap-6">
                       <div className="w-12 h-12 shrink-0 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                         <BarChart3 className="w-6 h-6" />
                       </div>
                       <div>
                         <h5 className="text-lg font-bold mb-1 text-white">{b.t}</h5>
                         <p className="text-sm text-slate-500">{b.d}</p>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
             </div>
          </div>
          <div>
            <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight">Sua empresa merece um <span className="text-blue-500">Suporte de Elite.</span></h2>
            <p className="text-lg text-slate-400 mb-10 leading-relaxed font-light">
              Não deixe a tecnologia ser o gargalo do seu crescimento. Com a Voltris Corporativo, 
              você tem a tranquilidade de saber que sua infraestrutura está em mãos de especialistas.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-slate-300">
                <CheckCircle2 className="w-6 h-6 text-blue-500" /> Atendimento via WhatsApp com humanos (Sem robôs)
              </div>
              <div className="flex items-center gap-4 text-slate-300">
                <CheckCircle2 className="w-6 h-6 text-blue-500" /> Relatórios mensais de saúde de infraestrutura
              </div>
              <div className="flex items-center gap-4 text-slate-300">
                <CheckCircle2 className="w-6 h-6 text-blue-500" /> Visitas técnicas 100% remotas e preventivas
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final B2B CTA */}
      <section id="local" className="py-32 px-4">
        <div className="max-w-5xl mx-auto rounded-[3rem] bg-gradient-to-b from-blue-600 to-blue-800 p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-blue-900/50">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-8">Vamos Otimizar o seu Negócio?</h2>
            <p className="text-blue-100 text-lg mb-12 max-w-2xl mx-auto font-medium">
              Agende uma conversa estratégica com um consultor e descubra como podemos blindar e acelerar sua empresa.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a 
                href="https://wa.me/5511996716235?text=Olá! Gostaria de agendar uma consultoria técnica para minha empresa."
                className="px-10 py-5 bg-white text-blue-600 font-black text-xl rounded-2xl transition-all hover:scale-105 flex items-center justify-center gap-3 shadow-xl"
              >
                <MessageSquare className="w-6 h-6" /> Chamar no WhatsApp
              </a>
            </div>
            <p className="mt-8 text-blue-200 text-sm font-bold uppercase tracking-widest">Atendimento disponível em todo o Brasil</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
