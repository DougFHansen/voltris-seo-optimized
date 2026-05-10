import React from 'react';
import { Brain, CheckCircle, Lightbulb } from 'lucide-react';
import { ContentSection } from './GuideTemplateServer';
import { extractShortDefinition, extractKeyPoints, extractSteps } from '@/lib/snippetHelper';

interface ScannableBlocksProps {
  sections: ContentSection[];
  title: string;
  description: string;
}

export function ScannableBlocks({ sections, title, description }: ScannableBlocksProps) {
  const shortDefinition = extractShortDefinition(sections, description);
  const keyPoints = extractKeyPoints(sections);
  const steps = extractSteps(sections);
  
  return (
    <aside className="hidden lg:block sticky top-24 w-72">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h4 className="font-bold mb-4 text-sm uppercase tracking-wide text-gray-500">
          Neste Guia
        </h4>
        
        {/* Definition Block */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-700 leading-relaxed">
            {shortDefinition}
          </p>
        </div>
        
        {/* Key Points */}
        {keyPoints.length > 0 && (
          <div className="mb-6">
            <h5 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              Pontos Principais
            </h5>
            <ul className="space-y-2">
              {keyPoints.slice(0, 3).map((point, idx) => (
                <li key={idx} className="text-xs text-gray-600 flex items-start gap-2">
                  <CheckCircle className="w-3 h-3 text-emerald-600 flex-shrink-0 mt-0.5" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Quick Steps */}
        {steps.length > 0 && (
          <div>
            <h5 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-500" />
              Passos Rápidos
            </h5>
            <ol className="space-y-2">
              {steps.slice(0, 5).map((step, idx) => (
                <li key={idx} className="text-xs text-gray-600 flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                    {idx + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </aside>
  );
}
