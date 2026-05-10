import React from 'react';
import Link from 'next/link';
import { Zap, ArrowRight, Clock } from 'lucide-react';

interface QuickSolutionBoxProps {
  quickSolution: string;
  category: string;
  guideTitle: string;
}

export function QuickSolutionBox({ quickSolution, category, guideTitle }: QuickSolutionBoxProps) {
  return (
    <div className="my-8 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border border-blue-200 rounded-2xl p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/50 blur-3xl rounded-full"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Solução Rápida</h3>
            <p className="text-xs text-gray-500">Tempo: 30 segundos</p>
          </div>
        </div>
        
        <p className="text-gray-700 leading-relaxed mb-4">
          {quickSolution}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/voltrisoptimizer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:scale-105 transition shadow-md"
          >
            <Zap className="w-4 h-4" />
            Solução Automática
          </Link>
          <Link
            href="#guide-content"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-50 transition border border-gray-200"
          >
            <ArrowRight className="w-4 h-4" />
            Ler Guia Completa
          </Link>
        </div>
      </div>
    </div>
  );
}
