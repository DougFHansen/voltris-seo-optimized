import type { Metadata } from "next";
import React from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FiBarChart2, FiUser, FiMail, FiPhone, FiMessageSquare, FiClock, FiCheckCircle, FiAward, FiGlobe, FiShield, FiTrendingUp } from 'react-icons/fi';

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
            
            <div className="text-center">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
                <h3 className="text-2xl font-bold text-white mb-6">Solicite seu Orçamento Personalizado</h3>
                <p className="text-gray-400 mb-8">
                  Entre em contato conosco através dos canais abaixo para receber um orçamento personalizado:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gray-700/50 rounded-lg p-6 border border-gray-600">
                    <FiMail className="text-purple-400 text-2xl mb-3 mx-auto" />
                    <h4 className="text-white font-semibold mb-2">Email</h4>
                    <p className="text-gray-400">orcamento@voltris.com.br</p>
                  </div>
                  
                  <div className="bg-gray-700/50 rounded-lg p-6 border border-gray-600">
                    <FiPhone className="text-blue-400 text-2xl mb-3 mx-auto" />
                    <h4 className="text-white font-semibold mb-2">WhatsApp</h4>
                    <p className="text-gray-400">+55 11 99671-6235</p>
                  </div>
                </div>
                
                <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <FiTrendingUp className="text-purple-400" />
                    Condições Especiais para Expatriados
                  </h4>
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
              </div>
            </div>
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
              <div
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-purple-500/30 transition-all duration-300"
              >
                <div className="mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                <p className="text-gray-400 leading-relaxed">{benefit.description}</p>
              </div>
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