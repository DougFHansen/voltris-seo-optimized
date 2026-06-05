import { GuideMetadata } from './guides';

export interface FunnelStep {
  title: string;
  description: string;
  href: string;
  reason: string;
}

/**
 * Algoritmo de Funnel Progression (Server-side, leve)
 * 
 * Estratégia:
 * 1. Identificar nível atual (Iniciante → Intermediário → Avançado)
 * 2. Recomendar próximo passo natural
 * 3. Considerar categoria e intenção
 * 4. Máximo 1 recomendação por guia
 */
export function getNextFunnelStep(currentGuide: GuideMetadata, allGuides: GuideMetadata[]): FunnelStep | null {
  const categoryGuides = allGuides.filter(g => g.category === currentGuide.category);
  
  // Se não há guias na mesma categoria, não recomendar
  if (categoryGuides.length === 0) {
    return null;
  }
  
  // Mapear dificuldade para pontuação
  const difficultyScore: Record<string, number> = {
    'Iniciante': 1,
    'Intermediário': 2,
    'Avançado': 3
  };
  
  const currentScore = difficultyScore[currentGuide.difficulty] || 2;
  
  // Buscar guias de nível imediatamente superior na mesma categoria
  const nextLevelGuides = categoryGuides.filter(
    g => g.id !== currentGuide.id && (difficultyScore[g.difficulty] || 2) === currentScore + 1
  );
  
  // Se há guias de nível superior, recomendar o mais relevante
  if (nextLevelGuides.length > 0) {
    const nextGuide = nextLevelGuides[0];
    return {
      title: nextGuide.title,
      description: nextGuide.description,
      href: `/guias/${nextGuide.id}`,
      reason: `Próximo passo: ${getProgressionReason(currentGuide.difficulty, nextGuide.difficulty)}`
    };
  }
  
  // Se não há nível superior, recomendar guia de comparação comercial (MOFU/BOFU)
  const comparisonGuides = allGuides.filter(
    g => g.category === 'otimizacao' && g.title.toLowerCase().includes('comparação')
  );
  
  if (comparisonGuides.length > 0 && currentScore >= 2) {
    const comparisonGuide = comparisonGuides[0];
    return {
      title: comparisonGuide.title,
      description: comparisonGuide.description,
      href: `/guias/${comparisonGuide.id}`,
      reason: 'Agora que você domina o básico, compare soluções'
    };
  }
  
  // Fallback: não recomendar nada se não há progressão natural
  return null;
}

/**
 * Gera texto de razão para progressão
 */
function getProgressionReason(from: string, to: string): string {
  const reasons: Record<string, Record<string, string>> = {
    'Iniciante': {
      'Intermediário': 'Agora que você entende o básico, aprofunde-se'
    },
    'Intermediário': {
      'Avançado': 'Você está pronto para técnicas avançadas'
    }
  };
  
  return reasons[from]?.[to] || 'Continue aprendendo';
}
