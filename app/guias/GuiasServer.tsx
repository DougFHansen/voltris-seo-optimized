import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  Monitor,
  Shield,
  Cpu,
  ArrowRight,
  BookOpen,
  Zap,
  LayoutGrid,
  Headphones,
  Gamepad,
  AlertTriangle,
  Brain
} from 'lucide-react';
import { GuideMetadata } from '@/lib/guides';
import SearchBar from './SearchBar';
import GuiasClient from './GuiasClient';
import { SearchProvider } from './SearchContext';

// Configuração das Categorias (dados estáticos - podem ser server-side)
export const CATEGORY_CONFIG = [
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

interface GuiasServerProps {
  initialGuides: GuideMetadata[];
}

export default function GuiasServer({ initialGuides }: GuiasServerProps) {
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
      <SearchProvider>
        <Header />
      <main className="w-full min-h-screen bg-gray-50 font-sans selection:bg-blue-100">

        {/* --- HERO SECTION (SERVER-SIDE) --- */}
        <section className="min-h-screen flex flex-col justify-center relative overflow-hidden border-b border-gray-200">
          <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-100/30 blur-[150px] rounded-full pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-purple-100/30 blur-[150px] rounded-full pointer-events-none"></div>

          <div className="relative w-full text-center z-10 flex-grow flex flex-col items-center justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-blue-200 shadow-sm mb-8 text-xs font-medium text-gray-600">
              <BookOpen className="w-3 h-3 text-blue-600" />
              <span>Base de Conhecimento v2.0</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
              Guias Técnicos Especializados
            </h1>

            <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed">
              Acervo atualizado diariamente com soluções para Windows, Jogos, Hardware e Redes.
            </p>

            {/* Search Bar renderizado diretamente no Hero section */}
            <SearchBar />
          </div>

          {/* Scroll Down Indicator (Server-side, será substituído por animação client-side) */}
          <div id="scroll-indicator-placeholder" className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer text-gray-700 hover:text-gray-900 transition-colors">
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-blue-600 to-transparent"></div>
          </div>
        </section>

        {/* --- CONTENT SECTION (SERVER-SIDE) --- */}
        <section id="content-section" className="py-12 px-4 bg-gray-100 relative z-10">
          <div className="max-w-7xl mx-auto">
            {/* GuiasClient renderiza category filter e lista de guias (sem search bar) */}
            <GuiasClient initialGuides={initialGuides} />
          </div>
        </section>

        {/* --- CTA SECTION (SERVER-SIDE) --- */}
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
      </SearchProvider>
    </>
  );
}
