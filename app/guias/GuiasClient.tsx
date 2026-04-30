'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import {
  Monitor,
  Shield,
  Cpu,
  Clock,
  ArrowRight,
  Search,
  BookOpen,
  Zap,
  LayoutGrid,
  Headphones,
  Gamepad,
  AlertTriangle,
  Brain
} from 'lucide-react';
import { GuideMetadata } from '@/lib/guides';

// Configuração das Categorias (Visual apenas)
const CATEGORY_CONFIG = [
  {
    id: 'inteligencia-artificial',
    title: 'IA & Desenvolvimento (2026)',
    description: 'AI Agents, LLMs Locais, RAG e Vibe Coding',
    icon: Brain,
    color: '#8B31FF'
  },
  {
    id: 'otimizacao',
    title: 'Otimização & FPS',
    description: 'Aumente o desempenho em jogos competitivos',
    icon: Zap,
    color: '#FFB800'
  },
  {
    id: 'games-fix',
    title: 'Correção de Jogos',
    description: 'Resolva bugs em GTA V, Minecraft, Roblox e mais',
    icon: Gamepad,
    color: '#FF4B6B'
  },
  {
    id: 'windows-erros',
    title: 'Erros do Windows',
    description: 'Solução para telas azuis, DLLs e crashes',
    icon: AlertTriangle,
    color: '#E11D48'
  },
  {
    id: 'hardware',
    title: 'Hardware & Montagem',
    description: 'Escolha peças e monte seu PC',
    icon: Cpu,
    color: '#8B31FF'
  },
  {
    id: 'perifericos',
    title: 'Periféricos & Setup',
    description: 'Monitores, mouses e organização',
    icon: Headphones,
    color: '#31A8FF'
  },
  {
    id: 'software',
    title: 'Software & Utils',
    description: 'Ferramentas essenciais e Windows',
    icon: LayoutGrid,
    color: '#31FF8B'
  },
  {
    id: 'rede-seguranca',
    title: 'Rede & Segurança',
    description: 'Proteção, Wi-Fi e VPN',
    icon: Shield,
    color: '#8B31FF'
  },
  {
    id: 'windows-geral',
    title: 'Windows & Sistema',
    icon: Monitor,
    color: '#31A8FF'
  },
  {
    id: 'emulacao',
    title: 'Emulação & Retrô',
    description: 'Yuzu, Cemu, PS2 e Clássicos',
    icon: Gamepad,
    color: '#FFB800'
  },
  {
    id: 'linux',
    title: 'Linux & Steam Deck',
    description: 'SteamOS, Proton e Bazzite',
    icon: Monitor,
    color: '#FF4B6B'
  }
];

interface GuiasClientProps {
  initialGuides: GuideMetadata[];
}

export default function GuiasClient({ initialGuides }: GuiasClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Determina se estamos em modo de busca (termo > 2 caracteres)
  const isSearching = searchTerm.length >= 2;

  // Se estiver buscando, ignora o filtro de categoria para mostrar todos os resultados relevantes
  const effectivelySelectedCategory = isSearching ? 'all' : selectedCategory;


  // Merge os guias recebidos com a configuração de categorias
  const filteredCategories = CATEGORY_CONFIG.map(config => {
    // Filtra os guias que pertencem a esta categoria
    const categoryGuides = initialGuides.filter(g => g.category === config.id);

    // Aplica o filtro de busca se houver
    const matchedGuides = categoryGuides.filter(guide =>
      searchTerm === '' ||
      guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return {
      ...config,
      guides: matchedGuides
    };
  }).filter(category =>
    // Mostra a categoria se:
    // 1. Ela foi selecionada (ou todas) - usamos effectivelySelectedCategory aqui
    // 2. E ela tem guias após o filtro de busca
    (effectivelySelectedCategory === 'all' || category.id === effectivelySelectedCategory) &&
    category.guides.length > 0
  );

  const totalResults = filteredCategories.reduce((acc, cat) => acc + cat.guides.length, 0);

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && totalResults > 0) {
      const contentSection = document.getElementById('content-section');
      if (contentSection) {
        contentSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Iniciante': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'Intermediário': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'Avançado': return 'text-rose-600 bg-rose-50 border-rose-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 font-sans selection:bg-blue-100">

        {/* --- HERO SECTION --- */}
        <section className="min-h-screen flex flex-col items-center justify-center relative px-4 overflow-hidden border-b border-gray-200 pt-20">
          <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-100/30 blur-[150px] rounded-full pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-purple-100/30 blur-[150px] rounded-full pointer-events-none"></div>

          <div className="relative max-w-5xl mx-auto text-center z-10 flex-grow flex flex-col items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-blue-200 shadow-sm mb-8 text-xs font-medium text-gray-600"
            >
              <BookOpen className="w-3 h-3 text-blue-600" />
              <span>Base de Conhecimento v2.0</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight"
            >
              Guias Técnicos Especializados
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              Acervo atualizado diariamente com soluções para Windows, Jogos, Hardware e Redes.
            </motion.p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="w-full max-w-2xl mx-auto"
            >
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl opacity-20 group-hover:opacity-40 blur transition duration-500"></div>
                <div className="relative bg-white rounded-2xl shadow-sm">
                  <input
                    type="text"
                    placeholder="Pesquise por erro, jogo ou componente..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleSearchKeyPress}
                    className="w-full px-6 py-5 bg-transparent border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 text-lg transition-all"
                  />
                  <Search className="absolute right-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
              </div>

              {/* Feedback Imediato da Busca */}
              {isSearching && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 flex items-center justify-center gap-4 text-sm"
                >
                  <span className="text-gray-500">
                    Encontramos <span className="text-gray-900 font-bold">{totalResults}</span> {totalResults === 1 ? 'guia' : 'guias'} para sua busca.
                  </span>
                  <button
                    onClick={() => document.getElementById('content-section')?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-blue-600 font-black hover:underline flex items-center gap-1"
                  >
                    Ver resultados <ArrowRight className="w-3 h-3" />
                  </button>
                </motion.div>
              )}

            </motion.div>
          </div>

          {/* Scroll Down Indicator */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1, repeat: Infinity, repeatType: "reverse" }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer text-gray-400 hover:text-gray-900 transition-colors"
          >
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-blue-600 to-transparent"></div>
          </motion.div>
        </section>

        {/* --- CONTENT SECTION --- */}
        <section id="content-section" className="py-12 px-4 bg-gray-100 relative z-10">
          <div className="max-w-7xl mx-auto">

            {/* Category Filter Cards */}
            <div className={`flex flex-wrap justify-center gap-3 mb-16 transition-all duration-500 ${isSearching ? 'opacity-30 pointer-events-none grayscale blur-[2px]' : 'opacity-100'}`}>
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all border ${selectedCategory === 'all'
                  ? 'bg-white text-gray-900 border-gray-200 hover:bg-gray-50'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-900'
                  }`}
              >
                Todos
              </button>
              {CATEGORY_CONFIG.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 border ${selectedCategory === category.id
                    ? 'bg-white text-gray-900 border-gray-200 shadow-sm'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                  <category.icon className={`w-4 h-4 ${selectedCategory === category.id ? 'text-gray-900' : ''}`} />
                  {category.title}
                </button>
              ))}
            </div>

            {filteredCategories.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-2xl border border-gray-200 shadow-sm">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Nenhum guia encontrado</h3>
                <p className="text-gray-500 mb-8 max-w-sm mx-auto">Não encontramos guias compatíveis com sua busca. Tente palavras-chaves diferentes.</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                  className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-sm"
                >
                  Limpar Filtros
                </button>
              </div>
            ) : (
              <div className="space-y-24">
                {filteredCategories.map((category) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="flex items-center gap-4 mb-10 border-b border-gray-200 pb-6">
                      <div className={`p-3 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200`}>
                        <category.icon className="w-6 h-6 text-gray-700" />
                      </div>
                      <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">{category.title}</h2>
                        <p className="text-gray-500 text-sm mt-1">{category.description}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {category.guides.map((guide) => (
                        <motion.div
                          key={guide.id}
                          whileHover={{ y: -5 }}
                          className="group relative h-full"
                        >
                          <Link href={`/guias/${guide.id}`} className="block h-full relative z-20 focus:outline-none">
                            <div className="h-full bg-white hover:bg-gray-50 rounded-2xl border border-gray-200 hover:border-blue-300 p-8 transition-all duration-300 relative overflow-hidden flex flex-col shadow-sm">

                              {/* Subtle Glow Effect on Hover */}
                              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/50 rounded-full blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                              <div className="flex justify-between items-start mb-6 relative z-10">
                                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getDifficultyColor(guide.difficulty)}`}>
                                  {guide.difficulty}
                                </div>
                              </div>

                              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight relative z-10">
                                {guide.title}
                              </h3>

                              <p className="text-gray-600 text-sm mb-8 leading-relaxed line-clamp-2 flex-grow relative z-10">
                                {guide.description}
                              </p>

                              <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-auto relative z-10">
                                <div className="flex items-center gap-2 text-gray-500 text-xs font-medium">
                                  <Clock className="w-4 h-4" />
                                  {guide.time}
                                </div>
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all text-gray-500">
                                  <ArrowRight className="w-4 h-4" />
                                </div>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* --- CTA SECTION --- */}
        <section className="py-24 px-4 relative overflow-hidden bg-white">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-100/30 blur-[120px] rounded-full pointer-events-none"></div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">Precisa de Ajuda Profissional?</h2>
            <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed">
              Tentou resolver e não conseguiu? Nossos especialistas podem acessar seu PC remotamente e corrigir o problema para você.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Link
                href="/todos-os-servicos"
                className="px-8 py-4 bg-white text-gray-900 border border-gray-200 font-bold rounded-xl hover:bg-gray-50 transition-all shadow-sm hover:scale-105"
              >
                Ver Serviços Especializados
              </Link>
              <Link
                href="https://wa.me/5511996716235?text=Olá!%20Li%20os%20guias%20mas%20preciso%20de%20ajuda%20especializada."
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Falar com Especialista
              </Link>
            </div>
          </div>
        </section>
      </main>
      <div className="max-w-4xl mx-auto px-4 py-8">
      </div>
      <Footer />
    </>
  );
}