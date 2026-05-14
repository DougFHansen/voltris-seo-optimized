"use client";

import React from 'react';
import CorporateHeader from '@/components/CorporateHeader';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  MapPin, 
  ChevronRight, 
  Phone, 
  CheckCircle2, 
  BarChart3, 
  Users, 
  Server,
  Zap
} from 'lucide-react';

interface LocalCorporateClientProps {
    locationName: string;
    stateAbbr: string;
    regionalContext: {
        neighborhoods: string[];
        localFact?: string;
    };
}

export default function LocalCorporateClient({ locationName, stateAbbr, regionalContext }: LocalCorporateClientProps) {
    return (
        <div className="bg-[#020205] text-white min-h-screen font-sans selection:bg-blue-500/30 relative">
            <div className="fixed inset-0 noise-bg pointer-events-none opacity-[0.03] z-[100]"></div>
            <CorporateHeader />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden border-b border-white/5">
                <div className="absolute top-[-10%] left-[-10%] w-[1000px] h-[1000px] rounded-full bg-blue-600/10 blur-[180px] pointer-events-none z-0" />
                <div className="max-w-7xl mx-auto px-4 relative z-10 text-center lg:text-left grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-widest mb-8">
                            <MapPin className="w-4 h-4" /> Suporte TI Empresarial em {locationName}
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
                            Consultoria de TI para <br/>
                            <span className="text-blue-500 italic">Empresas em {locationName}.</span>
                        </h1>
                        <p className="text-xl text-slate-400 mb-10 max-w-xl font-light leading-relaxed">
                            Atendimento especializado em infraestrutura, segurança e suporte gerenciado (MSP) para negócios de <strong>{locationName}</strong> e região.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <a 
                                href="https://wa.me/5511996716235?text=Olá! Preciso de suporte técnico remoto para minha empresa em ${locationName}."
                                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
                            >
                                Falar com Especialista para {locationName} <ChevronRight className="w-5 h-5" />
                            </a>
                            <Link 
                                href="/corporativo/servicos"
                                className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 transition-all flex items-center justify-center"
                            >
                                Ver Todas as Soluções
                            </Link>
                        </div>
                    </motion.div>
                    <div className="relative hidden lg:block">
                        <div className="absolute inset-0 bg-blue-600/10 blur-[100px] rounded-full"></div>
                        <div className="relative p-8 rounded-[3rem] border border-white/10 bg-white/5 backdrop-blur-2xl">
                             <div className="flex items-center gap-3 mb-8">
                                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                                <span className="text-xs text-slate-500 font-mono">monitoring_{locationName.toLowerCase()}.log</span>
                             </div>
                             <div className="space-y-4 font-mono text-sm text-slate-400">
                                <div>&gt; Checking infrastructure nodes in {locationName}...</div>
                                <div>&gt; Regional SLA: <span className="text-emerald-500">15 min response confirmed.</span></div>
                                <div>&gt; Security Protocol: <span className="text-blue-500">LGPD Compliance verified.</span></div>
                                <div>&gt; Status: <span className="text-white">VOLTRIS B2B ACTIVE.</span></div>
                             </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Regional Relevance */}
            <section className="py-24 px-4 bg-white/[0.02] border-y border-white/5">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-bold mb-8 tracking-tight">Presença Estratégica em <span className="text-blue-500">{locationName}</span></h2>
                        <p className="text-slate-400 text-lg leading-relaxed mb-8">
                            Atendemos empresas em bairros como {regionalContext.neighborhoods.slice(0, 5).join(', ')} e toda a região de {locationName} através de <strong>suporte técnico 100% remoto via AnyDesk ou TeamViewer</strong>.
                            Nossa infraestrutura permite uma resposta imediata em minutos, eliminando a espera por deslocamentos físicos e garantindo a continuidade do seu negócio.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {[
                                { t: "Suporte 24/7", d: "Sempre ativos para {locationName}." },
                                { t: "Faturamento PJ", d: "Emissão de NF-e e boletos." },
                                { t: "Time Certificado", d: "Especialistas Microsoft e Cisco." },
                                { t: "Backup Local", d: "Redundância geográfica de dados." }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 p-5 rounded-2xl bg-[#0A0F1C] border border-white/5">
                                    <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0" />
                                    <div>
                                        <h4 className="text-white font-bold text-sm mb-1">{item.t.replace('{locationName}', locationName)}</h4>
                                        <p className="text-slate-500 text-xs">{item.d.replace('{locationName}', locationName)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                           { i: <Users />, n: "Suporte Remoto" },
                           { i: <Server />, n: "Gestão de Servidores" },
                           { i: <BarChart3 />, n: "Produtividade" },
                           { i: <Zap />, n: "Resposta Rápida" }
                        ].map((box, i) => (
                            <div key={i} className="p-8 rounded-[2rem] bg-white/5 border border-white/10 text-center flex flex-col items-center justify-center gap-4 group hover:bg-blue-600/10 transition-all">
                                <div className="text-blue-500 group-hover:scale-110 transition-transform">{box.i}</div>
                                <div className="text-sm font-bold">{box.n}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* B2B Services Shortcut */}
            <section className="py-24 px-4 text-center">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-bold mb-12 tracking-tight">O que Resolvemos Agora em {locationName}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16">
                        {[
                            "Formatação em Lote",
                            "Redes & Wi-Fi",
                            "Backup & LGPD",
                            "Limpeza Técnica",
                            "Upgrade de Frotas",
                            "Configuração de Home Office"
                        ].map((s, i) => (
                            <div key={i} className="py-4 px-6 rounded-xl bg-white/5 border border-white/5 text-slate-300 font-medium text-sm">
                                {s}
                            </div>
                        ))}
                    </div>
                    <a 
                        href="https://wa.me/5511996716235"
                        className="inline-flex items-center gap-4 text-xl font-bold text-blue-500 hover:text-blue-400 transition-colors"
                    >
                        Solicitar Orçamento B2B Local <ChevronRight />
                    </a>
                </div>
            </section>

            <Footer />
        </div>
    );
}
