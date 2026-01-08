"use client";
import React from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from 'react';
import { FiPhone, FiMail, FiMessageSquare, FiGlobe, FiClock, FiMapPin, FiUsers, FiSend } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function InternationalContact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country: '',
    phone: '',
    service: '',
    message: ''
  });

  const countries = [
    'Estados Unidos',
    'Canadá',
    'Reino Unido',
    'Alemanha',
    'França',
    'Espanha',
    'Itália',
    'Holanda',
    'Bélgica',
    'Suíça',
    'Áustria',
    'Portugal',
    'Japão',
    'Austrália',
    'Nova Zelândia',
    'Outro país'
  ];

  const services = [
    'Suporte Técnico Remoto',
    'Criação de Sites',
    'Migração de Dados',
    'Configuração de Redes',
    'Suporte Cloud',
    'Consultoria de TI',
    'Outro serviço'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Format message for WhatsApp
    const message = `*NOVO CONTATO - VOLTRIS EXTERIOR*

` +
      `*Nome:* ${formData.name}
` +
      `*Email:* ${formData.email}
` +
      `*País:* ${formData.country}
` +
      `*Telefone/WhatsApp:* ${formData.phone || 'Não informado'}
` +
      `*Serviço de Interesse:* ${formData.service || 'Não especificado'}

` +
      `*Mensagem:*
${formData.message || 'Sem mensagem'}

` +
      `*Enviado em:* ${new Date().toLocaleString('pt-BR')}`;
    
    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/5511996716235?text=${encodedMessage}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      country: '',
      phone: '',
      service: '',
      message: ''
    });
    
    // Show success message (you can implement a toast notification here)
    alert('Mensagem enviada com sucesso! Você será redirecionado para o WhatsApp.');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#171313] via-[#171313] to-[#171313] header-spacing">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-3 bg-purple-900/30 backdrop-blur-sm rounded-full px-6 py-3 mb-6 border border-purple-500/30">
                <FiGlobe className="text-purple-400 text-xl" />
                <span className="text-purple-300 font-medium">Contato Internacional</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Fale Conosco <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">de Qualquer Lugar do Mundo</span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Estamos aqui para ajudar brasileiros que moram no exterior. 
                Nossa equipe fala português e entende as particularidades 
                de quem vive fora do Brasil.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FiClock className="text-purple-400 text-xl" />
                  <div>
                    <h3 className="text-white font-semibold">Atendimento 24/7</h3>
                    <p className="text-gray-400">Horários flexíveis conforme seu fuso</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <FiUsers className="text-blue-400 text-xl" />
                  <div>
                    <h3 className="text-white font-semibold">Equipe Bilíngue</h3>
                    <p className="text-gray-400">Profissionais fluentes em português</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <FiGlobe className="text-green-400 text-xl" />
                  <div>
                    <h3 className="text-white font-semibold">Presença Global</h3>
                    <p className="text-gray-400">Atendemos em mais de 30 países</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700"
            >
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                Envie sua Mensagem
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-gray-300 mb-2 font-medium">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="Seu nome completo"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-gray-300 mb-2 font-medium">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="seu@email.com"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="country" className="block text-gray-300 mb-2 font-medium">
                      País onde reside *
                    </label>
                    <select
                      id="country"
                      name="country"
                      required
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    >
                      <option value="">Selecione seu país</option>
                      {countries.map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-gray-300 mb-2 font-medium">
                    WhatsApp/Telefone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="+55 11 99999-9999"
                  />
                </div>
                
                <div>
                  <label htmlFor="service" className="block text-gray-300 mb-2 font-medium">
                    Serviço de Interesse
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
                    <option value="">Selecione um serviço</option>
                    {services.map(service => (
                      <option key={service} value={service}>{service}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-gray-300 mb-2 font-medium">
                    Descreva sua necessidade
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                    placeholder="Conte-nos sobre o que você precisa de ajuda..."
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 text-lg"
                >
                  <FiSend className="text-xl" />
                  Enviar Mensagem
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Outras Formas de <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Entrar em Contato</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Estamos disponíveis por diversos canais para sua conveniência
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700 text-center hover:border-purple-500/30 transition-all duration-300"
            >
              <FiPhone className="text-4xl text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Telefone/WhatsApp</h3>
              <p className="text-gray-400 mb-4">
                Atendimento direto com nossa equipe
              </p>
              <div className="text-purple-300 font-medium">
                +55 11 99671-6235
              </div>
              <p className="text-sm text-gray-500 mt-2">
                WhatsApp disponível 24/7
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700 text-center hover:border-blue-500/30 transition-all duration-300"
            >
              <FiMail className="text-4xl text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Email</h3>
              <p className="text-gray-400 mb-4">
                Para orçamentos e solicitações formais
              </p>
              <div className="text-blue-300 font-medium">
                contato@voltris.com.br
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Resposta em até 2 horas
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700 text-center hover:border-green-500/30 transition-all duration-300"
            >
              <FiMessageSquare className="text-4xl text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Chat Online</h3>
              <p className="text-gray-400 mb-4">
                Suporte imediato através do chat
              </p>
              <Link 
                href="#" 
                className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-all duration-300"
              >
                Iniciar Chat
              </Link>
              <p className="text-sm text-gray-500 mt-3">
                Disponível 24/7
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Countries We Serve */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Presente em</span> Mais de 30 Países
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Atendemos brasileiros espalhados pelo mundo inteiro
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              '🇺🇸 EUA', '🇨🇦 Canadá', '🇬🇧 Reino Unido', '🇩🇪 Alemanha',
              '🇫🇷 França', '🇪🇸 Espanha', '🇮🇹 Itália', '🇳🇱 Holanda',
              '🇧🇪 Bélgica', '🇨🇭 Suíça', '🇦🇹 Áustria', '🇵🇹 Portugal',
              '🇯🇵 Japão', '🇦🇺 Austrália', '🇳🇿 Nova Zelândia', '🇦🇷 Argentina',
              '🇨🇱 Chile', '🇺🇾 Uruguai', '🇲🇽 México', '🇨🇴 Colômbia',
              '🇵🇪 Peru', '🇻🇪 Venezuela', '🇪🇨 Equador', '🇧🇴 Bolívia',
              '🇵🇾 Paraguai', '🇨🇷 Costa Rica', '🇵🇦 Panamá', '🇬🇹 Guatemala',
              '🇭🇳 Honduras', '🇸🇻 El Salvador', '🇳🇮 Nicarágua', '🇧🇿 Belize'
            ].map((country, index) => (
              <motion.div
                key={country}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-4 text-center border border-gray-700 hover:border-purple-500/30 transition-all duration-300"
              >
                <div className="text-2xl mb-2">{country.split(' ')[0]}</div>
                <div className="text-sm text-gray-300">{country.split(' ')[1]}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}