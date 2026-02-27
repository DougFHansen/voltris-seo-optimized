'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdSenseBanner from '@/components/AdSenseBanner';
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
      case 'Iniciante': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'Intermediário': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'Avançado': return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#050510] font-sans selection:bg-[#31A8FF]/30">

        {/* --- HERO SECTION --- */}
        <section className="min-h-screen flex flex-col items-center justify-center relative px-4 overflow-hidden border-b border-white/5 pt-20">
          <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none z-50"></div>
          <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#31A8FF]/10 blur-[150px] rounded-full mix-blend-screen pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-[#8B31FF]/10 blur-[150px] rounded-full mix-blend-screen pointer-events-none"></div>

          <div className="relative max-w-5xl mx-auto text-center z-10 flex-grow flex flex-col items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 text-xs font-medium text-slate-400"
            >
              <BookOpen className="w-3 h-3 text-[#31A8FF]" />
              <span>Base de Conhecimento v2.0</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight"
            >
              Guias Técnicos Especializados
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed font-light"
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
                <div className="absolute -inset-1 bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] rounded-2xl opacity-20 group-hover:opacity-40 blur transition duration-500"></div>
                <div className="relative bg-[#0A0A0F] rounded-2xl">
                  <input
                    type="text"
                    placeholder="Pesquise por erro, jogo ou componente..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleSearchKeyPress}
                    className="w-full px-6 py-5 bg-transparent border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-[#31A8FF]/50 text-lg transition-all"
                  />
                  <Search className="absolute right-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-slate-500 group-hover:text-[#31A8FF] transition-colors" />
                </div>
              </div>

              {/* Feedback Imediato da Busca */}
              {isSearching && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 flex items-center justify-center gap-4 text-sm"
                >
                  <span className="text-slate-400">
                    Encontramos <span className="text-white font-bold">{totalResults}</span> {totalResults === 1 ? 'guia' : 'guias'} para sua busca.
                  </span>
                  <button
                    onClick={() => document.getElementById('content-section')?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-[#31A8FF] font-black hover:underline flex items-center gap-1"
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
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer text-slate-500 hover:text-white transition-colors"
          >
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-[#31A8FF] to-transparent"></div>
          </motion.div>
        </section>

        {/* --- CONTENT SECTION --- */}
        <section id="content-section" className="py-12 px-4 bg-[#050510] relative z-10">
          <div className="max-w-7xl mx-auto">

            {/* Category Filter Cards */}
            <div className={`flex flex-wrap justify-center gap-3 mb-16 transition-all duration-500 ${isSearching ? 'opacity-30 pointer-events-none grayscale blur-[2px]' : 'opacity-100'}`}>
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all border ${selectedCategory === 'all'
                  ? 'bg-white text-black border-white hover:bg-slate-200'
                  : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:border-white/10 hover:text-white'
                  }`}
              >
                Todos
              </button>
              {CATEGORY_CONFIG.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 border ${selectedCategory === category.id
                    ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                    : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:border-white/10 hover:text-white'
                    }`}
                >
                  <category.icon className={`w-4 h-4 ${selectedCategory === category.id ? 'text-black' : ''}`} />
                  {category.title}
                </button>
              ))}
            </div>

            {filteredCategories.length === 0 ? (
              <div className="text-center py-24 bg-white/5 rounded-3xl border border-white/5">
                <Search className="w-16 h-16 text-slate-600 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-white mb-2">Nenhum guia encontrado</h3>
                <p className="text-slate-400 mb-8 max-w-sm mx-auto">Não encontramos guias compatíveis com sua busca. Tente palavras-chaves diferentes.</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                  className="px-8 py-3 bg-[#31A8FF] text-white font-bold rounded-xl hover:bg-[#2b93df] transition-all hover:shadow-[0_0_30px_rgba(49,168,255,0.3)]"
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
                    <div className="flex items-center gap-4 mb-10 border-b border-white/5 pb-6">
                      <div className={`p-3 rounded-xl bg-gradient-to-br from-white/5 to-white/0 border border-white/5`}>
                        <category.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{category.title}</h2>
                        <p className="text-slate-500 text-sm mt-1">{category.description}</p>
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
                            <div className="h-full bg-[#0A0A0F] hover:bg-[#0F0F16] rounded-2xl border border-white/5 hover:border-[#31A8FF]/30 p-8 transition-all duration-300 relative overflow-hidden flex flex-col">

                              {/* Subtle Glow Effect on Hover */}
                              <div className="absolute top-0 right-0 w-32 h-32 bg-[#31A8FF]/5 rounded-full blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                              <div className="flex justify-between items-start mb-6 relative z-10">
                                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getDifficultyColor(guide.difficulty)}`}>
                                  {guide.difficulty}
                                </div>
                              </div>

                              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#31A8FF] transition-colors leading-tight relative z-10">
                                {guide.title}
                              </h3>

                              <p className="text-slate-400 text-sm mb-8 leading-relaxed line-clamp-2 flex-grow relative z-10">
                                {guide.description}
                              </p>

                              <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto relative z-10">
                                <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                                  <Clock className="w-4 h-4" />
                                  {guide.time}
                                </div>
                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#31A8FF] group-hover:text-white transition-all text-slate-500">
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
        <section className="py-24 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#050510] to-[#0A0A0F]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#31A8FF]/5 blur-[120px] rounded-full pointer-events-none"></div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">Precisa de Ajuda Profissional?</h2>
            <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Tentou resolver e não conseguiu? Nossos especialistas podem acessar seu PC remotamente e corrigir o problema para você.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Link
                href="/todos-os-servicos"
                className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:scale-105"
              >
                Ver Serviços Especializados
              </Link>
              <Link
                href="https://wa.me/5511996716235?text=Olá!%20Li%20os%20guias%20mas%20preciso%20de%20ajuda%20especializada."
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-white/5 text-white border border-white/10 font-bold rounded-xl hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2 backdrop-blur-md"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Falar com Especialista
              </Link>
            </div>
          </div>
        </section>
      </main>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-center text-xs text-slate-600 mb-2 uppercase tracking-wider">Publicidade</p>
        <AdSenseBanner />
      </div>
      <Footer />
    </>
  );
}