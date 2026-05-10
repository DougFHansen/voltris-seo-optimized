import React from 'react';
import Link from 'next/link';
import { ArrowRight, Clock, Award } from 'lucide-react';
import { GuideMetadata } from '@/lib/guides';
import { calculateInternalLinks } from '@/lib/guideInternalLinking';

interface InternalLinksProps {
  currentGuide: GuideMetadata;
  allGuides: GuideMetadata[];
  type?: 'related' | 'problems' | 'solutions';
  maxLinks?: number;
}

export function InternalLinks({ currentGuide, allGuides, type = 'related', maxLinks = 5 }: InternalLinksProps) {
  let links = calculateInternalLinks(currentGuide, allGuides, maxLinks);
  
  // Filtrar por tipo específico
  if (type === 'problems') {
    links = links.filter(item => 
      item.guide.category === 'windows-erros' || 
      item.guide.title.toLowerCase().includes('erro') ||
      item.guide.title.toLowerCase().includes('problema')
    );
  }
  
  if (type === 'solutions') {
    links = links.filter(item => 
      item.guide.category === 'otimizacao' ||
      item.guide.category === 'games-fix'
    );
  }
  
  const titles = {
    related: 'Leia Também',
    problems: 'Problemas Relacionados',
    solutions: 'Soluções Relacionadas'
  };
  
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Iniciante': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'Intermediário': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'Avançado': return 'text-rose-600 bg-rose-50 border-rose-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };
  
  if (links.length === 0) return null;
  
  return (
    <section className="mt-12 bg-gray-100 rounded-2xl p-8">
      <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
        {titles[type]}
      </h3>
      <div className="space-y-4">
        {links.map((item, idx) => (
          <Link 
            key={item.guide.id} 
            href={`/guias/${item.guide.id}`}
            className="block bg-white p-4 rounded-xl hover:shadow-lg transition group"
          >
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">
                {idx + 1}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition mb-2">
                  {item.guide.title}
                </h4>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {item.guide.description}
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className={`px-2 py-1 rounded-full border ${getDifficultyColor(item.guide.difficulty)}`}>
                    {item.guide.difficulty}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.guide.time}
                  </span>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition flex-shrink-0 mt-1" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
