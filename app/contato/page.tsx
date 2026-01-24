'use client';

import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, MessageCircle, HelpCircle, CheckCircle, ArrowRight } from 'lucide-react';

export default function ContatoPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#050510] font-sans selection:bg-[#31A8FF]/30">

        {/* --- FULL SCREEN HERO --- */}
        <section className="min-h-[100dvh] flex flex-col items-center justify-center relative px-4 overflow-hidden border-b border-white/5">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
          <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#31A8FF]/10 blur-[150px] rounded-full mix-blend-screen pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-[#FF4B6B]/10 blur-[150px] rounded-full mix-blend-screen pointer-events-none"></div>

          <div className="relative max-w-5xl mx-auto text-center z-10 flex-grow flex flex-col items-center justify-center">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 text-xs font-medium text-slate-400"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Atendimento Online Agora</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight leading-tight"
            >
              Vamos <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#31A8FF] to-[#8B31FF]">Conversar?</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed font-light"
            >
              Dúvidas sobre otimização? Precisa de suporte técnico? Nossa equipe especializada está pronta para resolver seu problema agora mesmo.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <a
                href="https://wa.me/5511996716235?text=Olá!%20Vim%20pelo%20site%20e%20preciso%20de%20ajuda."
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-[#25D366]/20 flex items-center justify-center gap-3"
              >
                <MessageCircle className="w-5 h-5" />
                Chamar no WhatsApp
              </a>
              <Link
                href="/faq"
                className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-3 backdrop-blur-sm"
              >
                <HelpCircle className="w-5 h-5 text-slate-400" />
                Perguntas Frequentes
              </Link>
            </motion.div>

          </div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1, repeat: Infinity, repeatType: "reverse" }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer text-slate-500 hover:text-white transition-colors z-20"
            onClick={() => {
              const nextSection = document.getElementById('contact-channels');
              if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            <span className="text-xs uppercase tracking-widest font-medium">SCROLL</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-[#31A8FF] to-transparent"></div>
          </motion.div>
        </section>

        {/* --- CONTACT CHANNELS --- */}
        <section id="contact-channels" className="py-24 px-4 relative z-10 bg-[#050510]">
          <div className="max-w-7xl mx-auto">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
              {/* WhatsApp Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group bg-[#0A0A0F] border border-[#31A8FF]/20 p-8 rounded-3xl relative overflow-hidden hover:border-[#31A8FF]/50 transition-all duration-300"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#31A8FF]/10 blur-[60px] rounded-full group-hover:bg-[#31A8FF]/20 transition-colors"></div>
                <div className="w-14 h-14 bg-[#31A8FF]/10 rounded-2xl flex items-center justify-center mb-6 text-[#31A8FF]">
                  <MessageCircle className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">WhatsApp</h3>
                <p className="text-slate-400 mb-6 line-clamp-2">Resposta ultra-rápida. O canal favorito dos nossos clientes.</p>
                <a href="https://wa.me/5511996716235" className="text-[#31A8FF] font-bold flex items-center gap-2 group-hover:gap-4 transition-all">
                  Iniciar Conversa <ArrowRight className="w-4 h-4" />
                </a>
              </motion.div>

              {/* Email Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="group bg-[#0A0A0F] border border-[#8B31FF]/20 p-8 rounded-3xl relative overflow-hidden hover:border-[#8B31FF]/50 transition-all duration-300"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#8B31FF]/10 blur-[60px] rounded-full group-hover:bg-[#8B31FF]/20 transition-colors"></div>
                <div className="w-14 h-14 bg-[#8B31FF]/10 rounded-2xl flex items-center justify-center mb-6 text-[#8B31FF]">
                  <Mail className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">E-mail</h3>
                <p className="text-slate-400 mb-6 line-clamp-2">Para orçamentos detalhados ou parcerias comerciais.</p>
                <a href="mailto:contato@voltris.com.br" className="text-[#8B31FF] font-bold flex items-center gap-2 group-hover:gap-4 transition-all">
                  contato@voltris.com.br <ArrowRight className="w-4 h-4" />
                </a>
              </motion.div>

              {/* FAQ Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="group bg-[#0A0A0F] border border-[#FF4B6B]/20 p-8 rounded-3xl relative overflow-hidden hover:border-[#FF4B6B]/50 transition-all duration-300"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF4B6B]/10 blur-[60px] rounded-full group-hover:bg-[#FF4B6B]/20 transition-colors"></div>
                <div className="w-14 h-14 bg-[#FF4B6B]/10 rounded-2xl flex items-center justify-center mb-6 text-[#FF4B6B]">
                  <HelpCircle className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Central de Ajuda</h3>
                <p className="text-slate-400 mb-6 line-clamp-2">Tire suas dúvidas instantaneamente com nossa base de conhecimento.</p>
                <Link href="/faq" className="text-[#FF4B6B] font-bold flex items-center gap-2 group-hover:gap-4 transition-all">
                  Acessar FAQ <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>

            {/* Info & Map Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

              {/* Info List */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-[#0A0A0F] border border-white/5 rounded-3xl p-8 md:p-12"
              >
                <h2 className="text-3xl font-bold text-white mb-8">Informações Corporativas</h2>

                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <Clock className="w-6 h-6 text-[#31A8FF] mt-1 shrink-0" />
                    <div>
                      <h4 className="text-white font-bold mb-1">Horário de Atendimento</h4>
                      <p className="text-slate-400">Segunda a Sexta: 07:00 - 19:30</p>
                      <p className="text-slate-400">Sábado: 08:30 - 19:30</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 text-[#FF4B6B] mt-1 shrink-0" />
                    <div>
                      <h4 className="text-white font-bold mb-1">Localização</h4>
                      <p className="text-slate-400">São Paulo, SP</p>
                      <p className="text-slate-500 text-sm mt-1">Atendimento 100% Remoto para todo o Brasil</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-[#8B31FF]/20 flex items-center justify-center mt-1 shrink-0 text-[#8B31FF] font-bold text-xs">V</div>
                    <div>
                      <h4 className="text-white font-bold mb-1">Dados da Empresa</h4>
                      <p className="text-slate-400">VOLTRIS OTIMIZACAO LTDA</p>
                      <p className="text-slate-500 text-sm font-mono mt-1">CNPJ: 47.241.737/0001-60</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Additional Trust Indicators */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex flex-col justify-center space-y-6"
              >
                <h2 className="text-3xl font-bold text-white mb-4">Por que nos escolher?</h2>

                {[
                  "Especialistas Certificados em Windows e Hardware",
                  "Garantia de Satisfação ou Reembolso",
                  "Acesso Remoto Seguro (AnyDesk/TeamViewer)",
                  "Mais de 5.000 Clientes Atendidos"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4 bg-[#0A0A0F] border border-white/5 p-4 rounded-xl">
                    <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0" />
                    <span className="text-white font-medium">{item}</span>
                  </div>
                ))}

                <div className="pt-8">
                  <p className="text-slate-500 text-sm">
                    Precisa de urgência? Ligue para nós: <br />
                    <a href="tel:+5511996716235" className="text-white font-bold text-xl hover:text-[#31A8FF] transition-colors">(11) 99671-6235</a>
                  </p>
                </div>
              </motion.div>

            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
