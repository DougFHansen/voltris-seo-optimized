import React from 'react';
import { Lightbulb } from 'lucide-react';

/**
 * SectionSummary - Componente para AEO/GEO Micro-Sumários
 * 
 * Propósito: Adicionar micro-sumário em seções para chunk extraction
 * 
 * Formato ideal:
 * - Resposta curta (1-2 frases)
 * - Definição objetiva
 * - Contexto independente
 * 
 * Exemplo:
 * "Habilitar XMP melhora desempenho da RAM ao ativar a frequência correta definida pelo fabricante."
 * 
 * Uso: Renderizado automaticamente pelo GuideTemplateServer quando ContentSection.summary está presente
 */
export function SectionSummary({ summary }: { summary: string }) {
    return (
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <div>
                    <p className="text-sm font-semibold text-amber-800 mb-1">Resumo Rápido</p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                        {summary}
                    </p>
                </div>
            </div>
        </div>
    );
}
