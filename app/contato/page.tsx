'use client';

import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdSenseBanner from '../components/AdSenseBanner';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ContatoPage() {
  return (
    <>
      <Header />
      <main className="bg-[#171313] min-h-screen pt-24">
        {/* Hero Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-transparent bg-clip-text">
                Entre em Contato
              </h1>
              <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
                Estamos prontos para ajudar você. Entre em contato conosco através dos canais abaixo ou use o formulário para enviar sua mensagem.
              </p>
            </motion.div>
          </div>
        </section>

        <AdSenseBanner />

        {/* Contact Information */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {/* Phone */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 rounded-2xl border border-[#FF4B6B]/20 shadow-lg hover:border-[#FF4B6B]/40 transition-all duration-300 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#FF4B6B]/20 to-[#8B31FF]/20 flex items-center justify-center">
                  <i className="fas fa-phone text-2xl text-[#FF4B6B]"></i>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Telefone</h3>
                <p className="text-gray-400 mb-4">Ligue ou envie mensagem</p>
                <a
                  href="tel:+5511996716235"
                  className="text-[#FF4B6B] hover:text-[#FF4B6B]/80 transition-colors font-semibold"
                >
                  (11) 99671-6235
                </a>
              </motion.div>

              {/* WhatsApp */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 rounded-2xl border border-[#31A8FF]/20 shadow-lg hover:border-[#31A8FF]/40 transition-all duration-300 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#31A8FF]/20 to-[#8B31FF]/20 flex items-center justify-center">
                  <i className="fab fa-whatsapp text-2xl text-[#31A8FF]"></i>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">WhatsApp</h3>
                <p className="text-gray-400 mb-4">Conversa rápida</p>
                <a
                  href="https://wa.me/5511996716235?text=Olá!%20Gostaria%20de%20falar%20sobre%20os%20serviços%20da%20VOLTRIS."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#31A8FF] hover:text-[#31A8FF]/80 transition-colors font-semibold"
                >
                  Enviar Mensagem
                </a>
              </motion.div>

              {/* Email */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 rounded-2xl border border-[#8B31FF]/20 shadow-lg hover:border-[#8B31FF]/40 transition-all duration-300 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#8B31FF]/20 to-[#FF4B6B]/20 flex items-center justify-center">
                  <i className="fas fa-envelope text-2xl text-[#8B31FF]"></i>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">E-mail</h3>
                <p className="text-gray-400 mb-4">Envie sua mensagem</p>
                <a
                  href="mailto:contato@voltris.com.br"
                  className="text-[#8B31FF] hover:text-[#8B31FF]/80 transition-colors font-semibold break-all"
                >
                  contato@voltris.com.br
                </a>
              </motion.div>

              {/* Location */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-6 rounded-2xl border border-[#FF4B6B]/20 shadow-lg hover:border-[#FF4B6B]/40 transition-all duration-300 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#FF4B6B]/20 to-[#31A8FF]/20 flex items-center justify-center">
                  <i className="fas fa-map-marker-alt text-2xl text-[#FF4B6B]"></i>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Localização</h3>
                <p className="text-gray-400 mb-4">Nossa base</p>
                <p className="text-gray-300 font-semibold">
                  São Paulo, SP<br />Brasil
                </p>
              </motion.div>
            </div>

            {/* Additional Information */}
            <div className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-8 rounded-2xl border border-[#8B31FF]/20 shadow-lg">
              <h2 className="text-3xl font-bold text-white mb-6 text-center">Horários de Atendimento</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-white mb-2">Segunda a Sexta</h3>
                  <p className="text-gray-300">07:00 - 19:30</p>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-white mb-2">Sábado</h3>
                  <p className="text-gray-300">08:30 - 19:30</p>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-white mb-2">Domingo</h3>
                  <p className="text-gray-300">Fechado</p>
                </div>
              </div>
            </div>

            {/* Important Information */}
            <div className="mt-8 bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] p-8 rounded-2xl border border-[#31A8FF]/20 shadow-lg">
              <h2 className="text-2xl font-bold text-white mb-4">Informações Importantes</h2>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <i className="fas fa-check-circle text-[#31A8FF] mt-1"></i>
                  <span>Atendimento 100% remoto - não precisamos ir até sua casa ou escritório</span>
                </li>
                <li className="flex items-start gap-3">
                  <i className="fas fa-check-circle text-[#31A8FF] mt-1"></i>
                  <span>Suporte disponível em todo o Brasil</span>
                </li>
                <li className="flex items-start gap-3">
                  <i className="fas fa-check-circle text-[#31A8FF] mt-1"></i>
                  <span>Resposta rápida via WhatsApp durante horário comercial</span>
                </li>
                <li className="flex items-start gap-3">
                  <i className="fas fa-check-circle text-[#31A8FF] mt-1"></i>
                  <span>E-mails respondidos em até 24 horas</span>
                </li>
                <li className="flex items-start gap-3">
                  <i className="fas fa-check-circle text-[#31A8FF] mt-1"></i>
                  <span>CNPJ: 47.241.737/0001-60</span>
                </li>
              </ul>
            </div>

            {/* FAQ Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-400 mb-4">
                Antes de entrar em contato, verifique nossa página de perguntas frequentes
              </p>
              <Link
                href="/faq"
                className="inline-block px-6 py-3 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300"
              >
                Ver Perguntas Frequentes
              </Link>
            </div>
          </div>
        </section>

        <AdSenseBanner />
      </main>
      <Footer />
    </>
  );
}

