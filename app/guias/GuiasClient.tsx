'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Clock,
  ArrowRight,
  Search,
} from 'lucide-react';
import { GuideMetadata } from '@/lib/guides';
import { CATEGORY_CONFIG } from './GuiasServer';
import { useSearch } from './SearchContext';

interface GuiasClientProps {
  initialGuides: GuideMetadata[];
}

export default function GuiasClient({ initialGuides }: GuiasClientProps) {
  const { searchTerm } = useSearch();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const isSearching = searchTerm.length >= 2;
  const effectivelySelectedCategory = isSearching ? 'all' : selectedCategory;

  const filteredCategories = CATEGORY_CONFIG.map(config => {
    const categoryGuides = initialGuides.filter(g => g.category === config.id);
    const searchLower = searchTerm.toLowerCase();
    const matchedGuides = categoryGuides.filter(guide =>
      searchLower === '' ||
      (guide.title && guide.title.toLowerCase().includes(searchLower)) ||
      (guide.description && guide.description.toLowerCase().includes(searchLower)) ||
      (guide.slug && guide.slug.toLowerCase().includes(searchLower))
    );

    return {
      ...config,
      guides: matchedGuides
    };
  }).filter(category =>
    (effectivelySelectedCategory === 'all' || category.id === effectivelySelectedCategory) &&
    category.guides.length > 0
  );

  const totalResults = filteredCategories.reduce((acc, cat) => acc + cat.guides.length, 0);

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
      {/* Category Filter - renderizado diretamente no JSX */}
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
        {CATEGORY_CONFIG.map((category) => {
          const categoryGuides = initialGuides.filter(g => g.category === category.id);
          const searchLower = searchTerm.toLowerCase();
          const matchedGuides = categoryGuides.filter(guide =>
            searchLower === '' ||
            (guide.title && guide.title.toLowerCase().includes(searchLower)) ||
            (guide.description && guide.description.toLowerCase().includes(searchLower)) ||
            (guide.slug && guide.slug.toLowerCase().includes(searchLower))
          );

          if (matchedGuides.length === 0) return null;

          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 border-2 flex items-center gap-2 ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-lg shadow-blue-500/30 scale-105'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400 hover:shadow-md'
              }`}
            >
              <category.icon className="w-5 h-5" />
              {category.title}
              <span className="ml-1 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                {matchedGuides.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Lista de Guias - renderizada diretamente no JSX */}
      <div id="content-section">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <Search className="w-16 h-16 text-gray-700 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Nenhum guia encontrado</h3>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">Não encontramos guias compatíveis com sua busca. Tente palavras-chaves diferentes.</p>
            <button
              onClick={() => {
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
    </>
  );
}