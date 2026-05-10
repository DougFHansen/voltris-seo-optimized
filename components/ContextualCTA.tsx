import React from 'react';
import Link from 'next/link';
import { Zap, Download, ArrowRight, CheckCircle } from 'lucide-react';
import OptimizerMockup from './OptimizerMockup';
import { getContextualCTA, CategoryCTA } from '@/lib/contextualCTA';

interface ContextualCTAProps {
  category: string;
  guideTitle: string;
  position?: 'top' | 'middle' | 'final';
}

export default function ContextualCTA({ category, guideTitle, position = 'middle' }: ContextualCTAProps) {
  const cta = getContextualCTA(category);
  
  // Personalizar descrição com título da guia
  const personalizedDescription = cta.description.replace('este guia', `"${guideTitle}"`);
  
  return (
    <section className={`my-12 relative group ${position === 'top' ? 'my-8' : position === 'final' ? 'my-16' : 'my-12'}`}>
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl opacity-30 group-hover:opacity-60 blur-xl transition duration-500"></div>
      <div className="relative bg-white/95 backdrop-blur-3xl border border-gray-200 rounded-[2.5rem] p-8 md:p-12 flex flex-col xl:flex-row items-center gap-12 shadow-xl">
        <div className="flex-1 space-y-6 z-10 text-center xl:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-[10px] font-black uppercase tracking-[0.2em]">
            <Zap className="w-3 h-3 fill-current" /> Otimização Recomendada
          </div>
          
          <h3 className="text-xl md:text-2xl font-black text-gray-900 leading-tight uppercase italic tracking-tight">
            {cta.title}
          </h3>
          
          <p className="text-gray-600 text-lg leading-relaxed font-bold">
            {personalizedDescription}
          </p>
          
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span>{cta.benefit}</span>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center xl:justify-start">
            <Link
              href={cta.primaryActionUrl}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold uppercase italic tracking-wider rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
            >
              <span>{cta.primaryAction}</span>
              <Download className="w-4 h-4 group-hover:animate-bounce" />
            </Link>
            
            <Link
              href={cta.secondaryActionUrl}
              className="px-6 py-3 bg-white text-gray-900 border border-gray-200 font-bold uppercase italic tracking-wider rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
            >
              <span>{cta.secondaryAction}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
        
        <div className="w-full xl:w-[450px] shrink-0">
          <OptimizerMockup />
        </div>
      </div>
    </section>
  );
}
