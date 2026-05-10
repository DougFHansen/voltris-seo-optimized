import React from 'react';
import { Target, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface AISummaryBlockProps {
    directAnswer: string;
    estimatedTime?: string;
    successRate?: string;
    nextStep?: string;
    category?: string;
}

/**
 * AI Summary Block - Answer-First Component para AEO/GEO
 * 
 * Este componente fornece uma resposta direta citável por IAs no topo da página.
 * Estrutura otimizada para:
 * - AI Overviews (Google)
 * - Bing Copilot
 * - Perplexity
 * - ChatGPT Search
 * 
 * Formato: Resposta direta + contexto + próximo passo
 */
export function AISummaryBlock({
    directAnswer,
    estimatedTime = '10-15 min',
    successRate = '90%',
    nextStep,
    category = 'default'
}: AISummaryBlockProps) {
    return (
        <section className="py-8 px-4 bg-gradient-to-r from-blue-50 via-white to-purple-50 border-b border-blue-200" aria-label="Resumo Executivo">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white border-2 border-blue-300 rounded-2xl p-6 md:p-8 shadow-lg relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/50 blur-3xl rounded-full pointer-events-none"></div>
                    
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-md">
                            <Target className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Resumo Executivo</h2>
                            <p className="text-sm text-gray-500">Resposta direta para IA e leitores</p>
                        </div>
                    </div>

                    {/* Direct Answer - AI Citation Ready */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
                        <p className="text-gray-800 font-medium leading-relaxed text-base">
                            <span className="text-blue-600 font-bold mr-2">✓</span>
                            {directAnswer}
                        </p>
                    </div>

                    {/* Meta Information */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3 border border-gray-200">
                            <Clock className="w-5 h-5 text-blue-600" />
                            <div>
                                <p className="text-xs text-gray-500">Tempo Estimado</p>
                                <p className="text-sm font-bold text-gray-900">{estimatedTime}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3 border border-gray-200">
                            <CheckCircle className="w-5 h-5 text-emerald-600" />
                            <div>
                                <p className="text-xs text-gray-500">Taxa de Sucesso</p>
                                <p className="text-sm font-bold text-gray-900">{successRate}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3 border border-gray-200">
                            <AlertCircle className="w-5 h-5 text-purple-600" />
                            <div>
                                <p className="text-xs text-gray-500">Dificuldade</p>
                                <p className="text-sm font-bold text-gray-900">{category === 'games-fix' ? 'Intermediário' : 'Média'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Next Step */}
                    {nextStep && (
                        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-4">
                            <p className="text-sm text-gray-700">
                                <span className="font-bold text-purple-700">Próximo Passo:</span> {nextStep}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
