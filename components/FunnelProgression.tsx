import React from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';
import { getNextFunnelStep } from '@/lib/funnelProgression';
import { GuideMetadata } from '@/lib/guides';

interface FunnelProgressionProps {
  currentGuide: GuideMetadata;
  allGuides: GuideMetadata[];
}

export function FunnelProgression({ currentGuide, allGuides }: FunnelProgressionProps) {
  const nextStep = getNextFunnelStep(currentGuide, allGuides);
  
  if (!nextStep) {
    return null;
  }
  
  return (
    <div className="my-8 bg-gradient-to-r from-slate-50 to-blue-50 border border-slate-200 rounded-2xl p-6">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center shrink-0 mt-1">
          <BookOpen className="w-5 h-5 text-blue-600" />
        </div>
        <div className="flex-1">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">
            {nextStep.reason}
          </p>
          <Link
            href={nextStep.href}
            className="group block"
          >
            <h4 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
              {nextStep.title}
            </h4>
            <p className="text-sm text-slate-600 line-clamp-2 mb-3">
              {nextStep.description}
            </p>
            <span className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 group-hover:gap-2 transition-all">
              Continuar aprendendo <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
