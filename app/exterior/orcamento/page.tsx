import type { Metadata } from "next";
import React, { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FiBarChart2, FiUser, FiMail, FiPhone, FiMessageSquare, FiClock, FiCheckCircle, FiAward, FiGlobe, FiShield, FiTrendingUp } from 'react-icons/fi';
import { motion } from 'framer-motion';

// SEO Metadata otimizado para orçamento internacional
export const metadata: Metadata = {
  title: "Solicitar Orçamento Personalizado para Brasileiros no Exterior | VOLTRIS",
  description: "Obtenha um orçamento personalizado para serviços de TI internacionais. Atendimento especializado em português para brasileiros expatriados. Formatação remota, otimização de PC, suporte técnico e muito mais.",
  keywords: [
    "orçamento para brasileiros no exterior",
    "serviços de ti internacional orçamento",
    "formatação remota orçamento grátis",
    "otimização de pc para expatriados preço",
    "suporte técnico internacional orçamento",
    "empresa de tecnologia brasil exterior",
    "serviços de informática para expatriados",
    "orçamento personalizado ti internacional",
    "preços serviços ti para brasileiros fora",
    "consulta técnica remota grátis"
  ],
  authors: [{ name: "VOLTRIS" }],
  creator: "VOLTRIS",
  publisher: "VOLTRIS",
  metadataBase: new URL('https://voltris.com.br/exterior'),
  alternates: {
    canonical: '/exterior/orcamento',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://voltris.com.br/exterior/orcamento',
    siteName: 'VOLTRIS Exterior',
    title: 'Solicitar Orçamento Personalizado para Brasileiros no Exterior',
    description: 'Orçamento gratuito e personalizado para serviços de TI internacionais. Atendimento especializado em português para expatriados brasileiros.',
    images: [
      {
        url: '/images/orcamento-exterior-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Solicitar Orçamento para Brasileiros no Exterior - VOLTRIS',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Orçamento Personalizado para Brasileiros no Exterior',
    description: 'Obtenha um orçamento gratuito para serviços de TI internacionais com atendimento em português.',
    images: ['/images/orcamento-exterior-twitter.jpg'],
    creator: '@voltris',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function OrcamentoExteriorPage() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    pais: '',
    servico: '',
    descricao: '',
    nivelUrgencia: 'normal'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simular envio do formulário
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form após 5 segundos
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        pais: '',
        servico: '',
        descricao: '',
        nivelUrgencia: 'normal'
      });
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#171313] via-[#171313] to-[#171313] header-spacing">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 bg-purple-900/30 backdrop-blur-sm rounded-full px-6 py-3 mb-6 border border-purple-500/30">
            <FiBarChart2 className="text-purple-400 text-xl" />
            <span className="text-purple-300 font-medium">Orçamento Personalizado</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Orçamento <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Gratuito e Personalizado</span> para Brasileiros no Exterior
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
            Receba um orçamento detalhado e personalizado para os serviços de TI que você precisa. 
            Nossa equipe especializada em atendimento para expatriados brasileiros analisará suas necessidades 
            e fornecerá uma proposta completa com preços competitivos e condições especiais para clientes internacionais.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <FiAward className="text-purple-400 text-3xl mb-4 mx-auto" />
              <h3 className="text-white font-semibold mb-2">Sem Compromisso</h3>
              <p className="text-gray-400 text-sm">Orçamento gratuito e sem obrigatoriedade de contratação</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <FiClock className="text-blue-400 text-3xl mb-4 mx-auto" />
              <h3 className="text-white font-semibold mb-2">Resposta Rápida</h3>
              <p className="text-gray-400 text-sm">Retorno em até 24 horas úteis com proposta detalhada</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <FiShield className="text-green-400 text-3xl mb-4 mx-auto" />
              <h3 className="text-white font-semibold mb-2">Garantia</h3>
              <p className="text-gray-400 text-sm">Validade de 30 dias com condições especiais para expatriados</p>
            </div>
          </div>
        </div>
      </section>

      {/* Formulário Principal */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Solicite seu Orçamento Personalizado
            </h2>
            
            {isSubmitted ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-6">
                  <FiCheckCircle className="text-4xl text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Orçamento Solicitado com Sucesso!</h3>
                <p className="text-gray-400 mb-6">
                  Recebemos sua solicitação e nossa equipe entrará em contato em até 24 horas úteis 
                  com um orçamento personalizado para suas necessidades.
                </p>
                <Link 
                  href="/exterior"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300"
                >
                  <FiGlobe className="text-lg" />
                  Voltar para Home
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="nome" className="block text-sm font-medium text-gray-300 mb-2">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      id="nome"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                      placeholder="Seu nome completo"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                      placeholder="seu.email@exemplo.com"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="telefone" className="block text-sm font-medium text-gray-300 mb-2">
                      Telefone/WhatsApp *
                    </label>
                    <input
                      type="tel"
                      id="telefone"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                      placeholder="+55 (11) 99999-9999"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="pais" className="block text-sm font-medium text-gray-300 mb-2">
                      País de Residência *
                    </label>
                    <select
                      id="pais"
                      name="pais"
                      value={formData.pais}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    >
                      <option value="">Selecione seu país</option>
                      <option value="estados-unidos">Estados Unidos</option>
                      <option value="portugal">Portugal</option>
                      <option value="espanha">Espanha</option>
                      <option value="canada">Canadá</option>
                      <option value="alemanha">Alemanha</option>
                      <option value="italia">Itália</option>
                      <option value="franca">França</option>
                      <option value="reino-unido">Reino Unido</option>
                      <option value="australia">Austrália</option>
                      <option value="outro">Outro país</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="servico" className="block text-sm font-medium text-gray-300 mb-2">
                    Serviço Desejado *
                  </label>
                  <select
                    id="servico"
                    name="servico"
                    value={formData.servico}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="">Selecione o serviço</option>
                    <option value="formatacao">Formatação Remota Internacional</option>
                    <option value="otimizacao">Otimização de PC para Performance</option>
                    <option value="suporte-tecnico">Suporte Técnico Online Especializado</option>
                    <option value="configuracao-sistema">Configuração de Sistema para Trabalho e Games</option>
                    <option value="seguranca">Configuração de Segurança e VPN</option>
                    <option value="cloud">Suporte a Serviços em Nuvem</option>
                    <option value="consultoria">Consultoria de TI Internacional</option>
                    <option value="multiplos">Múltiplos Serviços</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="nivelUrgencia" className="block text-sm font-medium text-gray-300 mb-2">
                    Nível de Urgência
                  </label>
                  <select
                    id="nivelUrgencia"
                    name="nivelUrgencia"
                    value={formData.nivelUrgencia}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="baixa">Baixa - Prazo maior</option>
                    <option value="normal">Normal - Prazo padrão</option>
                    <option value="urgente">Urgente - Necessário rápido</option>
                    <option value="critico">Crítico - Problema imediato</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="descricao" className="block text-sm font-medium text-gray-300 mb-2">
                    Descreva suas necessidades (opcional)
                  </label>
                  <textarea
                    id="descricao"
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleChange}
                    rows={4}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 resize-none"
                    placeholder="Conte-nos mais detalhes sobre o que você precisa, problemas específicos, equipamentos envolvidos, etc..."
                  ></textarea>
                </div>
                
                <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <FiTrendingUp className="text-purple-400" />
                    Condições Especiais para Expatriados
                  </h3>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>Desconto especial de 15% para primeiros serviços</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>Suporte prioritário em horários convenientes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>Pagamento em EUR/USD com condições flexíveis</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>Garantia estendida de 60 dias</span>
                    </li>
                  </ul>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 text-lg disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      Processando...
                    </>
                  ) : (
                    <>
                      <FiBarChart2 className="text-xl" />
                      Solicitar Orçamento Grátis
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Benefícios do Orçamento */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">
            Por que Solicitar um Orçamento com a VOLTRIS?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <FiAward className="text-4xl text-purple-400" />,
                title: "Transparência Total",
                description: "Detalhamento completo de todos os serviços, preços e condições antes de qualquer compromisso"
              },
              {
                icon: <FiShield className="text-4xl text-blue-400" />,
                title: "Segurança Garantida",
                description: "Propostas com garantia escrita e proteção de dados conforme legislações internacionais"
              },
              {
                icon: <FiClock className="text-4xl text-green-400" />,
                title: "Resposta Imediata",
                description: "Análise e retorno em até 24 horas úteis com proposta personalizada"
              },
              {
                icon: <FiUser className="text-4xl text-yellow-400" />,
                title: "Atendimento Personalizado",
                description: "Profissionais especializados em necessidades de brasileiros expatriados"
              },
              {
                icon: <FiGlobe className="text-4xl text-red-400" />,
                title: "Flexibilidade Internacional",
                description: "Pagamento em moedas internacionais e adaptação às particularidades de cada país"
              },
              {
                icon: <FiTrendingUp className="text-4xl text-indigo-400" />,
                title: "Condições Especiais",
                description: "Descontos e benefícios exclusivos para clientes internacionais"
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-purple-500/30 transition-all duration-300"
              >
                <div className="mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                <p className="text-gray-400 leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-900/30 to-blue-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Pronto para Obter seu Orçamento Personalizado?
          </h2>
          <p className="text-gray-300 text-xl mb-8 leading-relaxed">
            Nossa equipe especializada está pronta para analisar suas necessidades e fornecer 
            uma proposta completa e competitiva, adaptada especificamente para sua situação 
            como brasileiro expatriado.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link 
              href="/exterior/contato" 
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 text-lg"
            >
              <FiPhone className="text-xl" />
              Contato Direto
            </Link>
            
            <Link 
              href="/exterior/servicos" 
              className="border-2 border-purple-500 text-purple-300 hover:bg-purple-500 hover:text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 flex items-center gap-3 text-lg"
            >
              <FiBarChart2 className="text-xl" />
              Ver Todos Serviços
            </Link>
          </div>
          
          <div className="text-gray-400">
            <p className="flex items-center justify-center gap-2">
              <FiMail className="text-purple-400" />
              orcamento@voltris.com.br
            </p>
            <p className="mt-2">
              Atendimento especializado em português • Resposta em até 24 horas
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}