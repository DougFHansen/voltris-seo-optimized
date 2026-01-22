'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdSenseBanner from '@/components/AdSenseBanner';
import { motion } from 'framer-motion';

interface GuideCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  guides: Guide[];
  color: string;
}

interface Guide {
  slug: string;
  title: string;
  description: string;
  difficulty: string;
  time: string;
  isNew?: boolean;
}

export default function GuiasClient() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Todas as categorias e guias
  const guideCategories: GuideCategory[] = [
    {
      id: 'windows',
      title: 'Windows & Sistema',
      description: 'Tutoriais completos sobre Windows, formatação, otimização e manutenção do sistema',
      icon: '🖥️',
      color: '#31A8FF',
      guides: [
        {
          slug: 'formatacao-windows',
          title: 'Como Formatar Windows (Passo a Passo 2026)',
          description: 'Guia definitivo para formatar seu computador Windows 10 ou 11 de forma segura, com backup e instalação limpa.',
          difficulty: 'Intermediário',
          time: '60-120 min',
          isNew: true
        },
        {
          slug: 'otimizacao-performance',
          title: 'Otimização de Performance do Windows',
          description: 'Técnicas avançadas para deixar seu Windows mais rápido e responsivo.',
          difficulty: 'Avançado',
          time: '45-90 min'
        },
        {
          slug: 'recuperacao-sistema',
          title: 'Recuperação do Sistema Windows',
          description: 'Como restaurar seu sistema usando pontos de restauração e backups.',
          difficulty: 'Iniciante',
          time: '30-60 min'
        }
      ]
    },
    {
      id: 'seguranca',
      title: 'Segurança Digital',
      description: 'Proteja seu computador contra vírus, malware e ameaças cibernéticas',
      icon: '🔒',
      color: '#FF4B6B',
      guides: [
        {
          slug: 'remocao-virus-malware',
          title: 'Remoção de Vírus e Malware',
          description: 'Técnicas profissionais para eliminar vírus, trojans e software malicioso do seu sistema.',
          difficulty: 'Intermediário',
          time: '30-60 min'
        },
        {
          slug: 'seguranca-digital',
          title: 'Segurança Digital Completa',
          description: 'Configurações essenciais de segurança para proteger seus dados e privacidade.',
          difficulty: 'Iniciante',
          time: '45-90 min'
        },
        {
          slug: 'protecao-ransomware',
          title: 'Proteção contra Ransomware',
          description: 'Como prevenir e se recuperar de ataques de ransomware.',
          difficulty: 'Avançado',
          time: '60-120 min'
        }
      ]
    },
    {
      id: 'hardware',
      title: 'Hardware & Componentes',
      description: 'Montagem, upgrade e diagnóstico de componentes de hardware',
      icon: '⚙️',
      color: '#8B31FF',
      guides: [
        {
          slug: 'montagem-pc',
          title: 'Montagem de PC Completo',
          description: 'Guia passo a passo para montar seu próprio computador do zero.',
          difficulty: 'Intermediário',
          time: '120-180 min'
        },
        {
          slug: 'upgrade-memoria-ram',
          title: 'Upgrade de Memória RAM',
          description: 'Como identificar, comprar e instalar memória RAM compatível.',
          difficulty: 'Iniciante',
          time: '30-45 min'
        },
        {
          slug: 'substituicao-ssd',
          title: 'Substituição de SSD/HDD',
          description: 'Transferência de sistema e dados para novo armazenamento.',
          difficulty: 'Intermediário',
          time: '60-90 min'
        }
      ]
    },
    {
      id: 'rede',
      title: 'Rede & Internet',
      description: 'Configuração de redes, Wi-Fi, roteadores e solução de problemas de conexão',
      icon: '🌐',
      color: '#31FF8B',
      guides: [
        {
          slug: 'configuracao-roteador-wifi',
          title: 'Configuração de Roteador Wi-Fi',
          description: 'Como configurar seu roteador para melhor desempenho e segurança.',
          difficulty: 'Iniciante',
          time: '45-60 min'
        },
        {
          slug: 'teste-velocidade-internet',
          title: 'Teste de Velocidade da Internet',
          description: 'Como medir e otimizar a velocidade da sua conexão.',
          difficulty: 'Iniciante',
          time: '15-30 min'
        },
        {
          slug: 'rede-domestica',
          title: 'Montagem de Rede Doméstica',
          description: 'Criação de rede local para compartilhamento de arquivos e impressoras.',
          difficulty: 'Intermediário',
          time: '60-90 min'
        }
      ]
    }
  ];

  // Filtrar guias baseado na pesquisa e categoria
  const filteredGuides = guideCategories
    .filter(category => selectedCategory === 'all' || category.id === selectedCategory)
    .map(category => ({
      ...category,
      guides: category.guides.filter(guide =>
        guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guide.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }))
    .filter(category => category.guides.length > 0);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-[#0A0A0F] via-[#121218] to-[#0A0A0F] pt-24">
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF4B6B]/10 via-[#8B31FF]/10 to-[#31A8FF]/10"></div>
          <div className="relative max-w-6xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold text-white mb-6"
            >
              Guias e Tutoriais <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF]">Técnicos</span>
            </motion.h1>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
              Aprenda a formatar, otimizar, remover vírus e resolver problemas no seu PC com nossos guias detalhados escritos por especialistas.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar guias técnicos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-4 bg-[#1c1c1e] border border-[#31A8FF]/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#31A8FF] focus:border-transparent text-lg"
                />
                <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-[#31A8FF] text-white'
                    : 'bg-[#1c1c1e] text-gray-400 hover:text-white hover:bg-[#1c1c1e]/80'
                }`}
              >
                Todos
              </button>
              {guideCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                    selectedCategory === category.id
                      ? 'bg-[#31A8FF] text-white'
                      : 'bg-[#1c1c1e] text-gray-400 hover:text-white hover:bg-[#1c1c1e]/80'
                  }`}
                >
                  <span>{category.icon}</span>
                  {category.title}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Guides Grid */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            {filteredGuides.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-white mb-2">Nenhum guia encontrado</h3>
                <p className="text-gray-400 mb-8">Tente ajustar sua busca ou selecionar outra categoria</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                  className="px-6 py-3 bg-[#31A8FF] text-white font-bold rounded-xl hover:bg-[#2b93df] transition-colors"
                >
                  Limpar Filtros
                </button>
              </div>
            ) : (
              filteredGuides.map((category, categoryIndex) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                  className="mb-16"
                >
                  <div className="flex items-center gap-4 mb-8">
                    <span className="text-3xl">{category.icon}</span>
                    <div>
                      <h2 className="text-3xl font-bold text-white">{category.title}</h2>
                      <p className="text-gray-400">{category.description}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {category.guides.map((guide, guideIndex) => (
                      <motion.div
                        key={guide.slug}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: categoryIndex * 0.1 + guideIndex * 0.05 }}
                        whileHover={{ y: -5 }}
                        className="bg-gradient-to-br from-[#1c1c1e] to-[#2a2a2e] rounded-2xl border border-[#31A8FF]/20 hover:border-[#FF4B6B]/30 transition-all duration-300 overflow-hidden"
                      >
                        <Link href={`/guias/${guide.slug}`} className="block h-full">
                          <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <h3 className="text-xl font-bold text-white group-hover:text-[#31A8FF] transition-colors">
                                {guide.title}
                              </h3>
                              {guide.isNew && (
                                <span className="bg-[#FF4B6B] text-white text-xs font-bold px-2 py-1 rounded-full">
                                  NOVO
                                </span>
                              )}
                            </div>
                            
                            <p className="text-gray-400 text-sm mb-6 line-clamp-3">
                              {guide.description}
                            </p>
                            
                            <div className="flex flex-wrap gap-2 mb-4">
                              <span className="bg-[#171313] text-gray-300 text-xs px-3 py-1 rounded-full">
                                {guide.difficulty}
                              </span>
                              <span className="bg-[#171313] text-gray-300 text-xs px-3 py-1 rounded-full">
                                {guide.time}
                              </span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-[#31A8FF] text-sm font-medium group-hover:text-[#FF4B6B] transition-colors">
                                Ler guia completo →
                              </span>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-[#121218]">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Precisa de Ajuda Profissional?</h2>
            <p className="text-gray-400 mb-8">
              Nossa equipe especializada está pronta para ajudar com qualquer problema técnico.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/todos-os-servicos"
                className="px-8 py-4 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300 text-center"
              >
                Ver Serviços Especializados
              </Link>
              <Link
                href="https://wa.me/5511996716235?text=Olá!%20Preciso%20de%20ajuda%20técnica."
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 border-2 border-[#31A8FF] text-[#31A8FF] font-bold rounded-xl hover:bg-[#31A8FF] hover:text-white transition-all duration-300 text-center"
              >
                Falar com Especialista
              </Link>
            </div>
          </div>
        </section>
      </main>
      <AdSenseBanner />
      <Footer />
    </>
  );
}