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
      <main className="min-h-screen bg-gray-50 font-sans selection:bg-blue-100">

        {/* --- FULL SCREEN HERO --- */}
        <section className="min-h-[100dvh] flex flex-col items-center justify-center relative px-4 overflow-hidden border-b border-gray-200">
          {/* Background Effects */}
          <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-100/30 blur-[150px] rounded-full pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-purple-100/30 blur-[150px] rounded-full pointer-events-none"></div>

          <div className="relative max-w-5xl mx-auto text-center z-10 flex-grow flex flex-col items-center justify-center">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-blue-200 shadow-sm mb-8 text-xs font-medium text-gray-600"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Serviço Online Agora</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-black text-gray-900 mb-8 tracking-tight leading-tight"
            >
              Vamos <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Conversar?</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed"
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
                href="https://wa.me/5511996716235?text=Olá!%20Encontrei%20vocês%20pelo%20site%20e%20preciso%20de%20ajuda."
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-[#25D366]/20 flex items-center justify-center gap-3"
              >
                <MessageCircle className="w-5 h-5" />
                Chamar no WhatsApp
              </a>
              <Link
                href="/faq"
                className="px-8 py-4 bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 font-bold rounded-xl transition-all flex items-center justify-center gap-3 shadow-sm"
              >
                <HelpCircle className="w-5 h-5 text-gray-500" />
                Perguntas Frequentes
              </Link>
            </motion.div>

          </div>


          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1, repeat: Infinity, repeatType: "reverse" }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer text-gray-400 hover:text-gray-900 transition-colors z-20"
            onClick={() => {
              const nextSection = document.getElementById('contact-channels');
              if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            <span className="text-xs uppercase tracking-widest font-medium">ROLE</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-blue-600 to-transparent"></div>
          </motion.div>
        </section>

        {/* --- CONTACT CHANNELS --- */}
        <section id="contact-channels" className="py-24 px-4 relative z-10 bg-gray-100">
          <div className="max-w-7xl mx-auto">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
              {/* WhatsApp Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group bg-white border border-blue-200 p-8 rounded-2xl relative overflow-hidden hover:border-blue-300 transition-all duration-300 shadow-sm"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/50 blur-[60px] rounded-full group-hover:bg-blue-100/70 transition-colors"></div>
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
                  <MessageCircle className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">WhatsApp</h3>
                <p className="text-gray-600 mb-6 line-clamp-2">Resposta ultra rápida. O canal favorito dos nossos clientes.</p>
                <a href="https://wa.me/5511996716235" className="text-blue-600 font-bold flex items-center gap-2 group-hover:gap-4 transition-all">
                  Iniciar Conversa <ArrowRight className="w-4 h-4" />
                </a>
              </motion.div>

              {/* Email Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="group bg-white border border-purple-200 p-8 rounded-2xl relative overflow-hidden hover:border-purple-300 transition-all duration-300 shadow-sm"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100/50 blur-[60px] rounded-full group-hover:bg-purple-100/70 transition-colors"></div>
                <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 text-purple-600">
                  <Mail className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">E-mail</h3>
                <p className="text-gray-600 mb-6 line-clamp-2">Para orçamentos detalhados ou parcerias comerciais.</p>
                <a href="mailto:contato@voltrisoptimizer.com" className="text-purple-600 font-bold flex items-center gap-2 group-hover:gap-4 transition-all">
                  contato@voltrisoptimizer.com <ArrowRight className="w-4 h-4" />
                </a>
              </motion.div>

              {/* FAQ Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="group bg-white border border-pink-200 p-8 rounded-2xl relative overflow-hidden hover:border-pink-300 transition-all duration-300 shadow-sm"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-pink-100/50 blur-[60px] rounded-full group-hover:bg-pink-100/70 transition-colors"></div>
                <div className="w-14 h-14 bg-pink-100 rounded-2xl flex items-center justify-center mb-6 text-pink-600">
                  <HelpCircle className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Central de Ajuda</h3>
                <p className="text-gray-600 mb-6 line-clamp-2">Obtenha respostas instantâneas às suas perguntas com nossa base de conhecimento.</p>
                <Link href="/faq" className="text-pink-600 font-bold flex items-center gap-2 group-hover:gap-4 transition-all">
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
                className="bg-white border border-gray-200 rounded-2xl p-8 md:p-12 shadow-sm"
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Informações Corporativas</h2>

                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <Clock className="w-6 h-6 text-blue-600 mt-1 shrink-0" />
                    <div>
                      <h4 className="text-gray-900 font-bold mb-1">Horário de Atendimento</h4>
                      <p className="text-gray-600">Segunda a Sexta: 07:00 - 19:30</p>
                      <p className="text-gray-600">Sábado: 08:30 - 19:30</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 text-pink-600 mt-1 shrink-0" />
                    <div>
                      <h4 className="text-gray-900 font-bold mb-1">Localização</h4>
                      <p className="text-gray-600">São Paulo, SP</p>
                      <p className="text-gray-500 text-sm mt-1">Serviço 100% remoto em todo o Brasil</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center mt-1 shrink-0 text-purple-600 font-bold text-xs">V</div>
                    <div>
                      <h4 className="text-gray-900 font-bold mb-1">Dados da Empresa</h4>
                      <p className="text-gray-600">VOLTRIS OTIMIZACAO LTDA</p>
                      <p className="text-gray-500 text-sm font-mono mt-1">CNPJ: 47.241.737/0001-60</p>
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
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Por Que Escolher a Voltris?</h2>

                {[
                  "Especialistas Certificados em Windows e Hardware",
                  "Garantia de Satisfação ou Reembolso",
                  "Acesso Remoto Seguro (AnyDesk/TeamViewer)",
                  "Mais de 5.000 Clientes Atendidos"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4 bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                    <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
                    <span className="text-gray-900 font-medium">{item}</span>
                  </div>
                ))}

                <div className="pt-8">
                  <p className="text-gray-500 text-sm">
                    Precisa de urgência? Ligue para nós: <br />
                    <a href="tel:+5511996716235" className="text-gray-900 font-bold text-xl hover:text-blue-600 transition-colors">(11) 99671-6235</a>
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
