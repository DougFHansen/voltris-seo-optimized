import { ContentSection } from '@/components/GuideTemplateServer';

/**
 * Extrai definição curta do conteúdo para featured snippets e AI Overviews
 * Google AI Overviews e Featured Snippets priorizam definições curtas nos primeiros 50-100 caracteres
 */
export function extractShortDefinition(sections: ContentSection[], description: string): string {
  // Encontrar a primeira seção com definição
  for (const section of sections) {
    const text = section.content.replace(/<[^>]*>/g, '').trim();
    // Primeira frase, max 150 caracteres
    const firstSentence = text.split('.')[0].substring(0, 150);
    if (firstSentence.length > 20) {
      return firstSentence + (text.includes('.') ? '.' : '...');
    }
  }
  
  // Fallback: usar description
  return description.substring(0, 150) + '...';
}

/**
 * Extrai key points do conteúdo para blocos escaneáveis
 */
export function extractKeyPoints(sections: ContentSection[]): string[] {
  const points: string[] = [];
  
  sections.forEach(section => {
    // Extrair listas
    const listItems = section.content.match(/<li[^>]*>(.*?)<\/li>/gis);
    if (listItems) {
      listItems.forEach(item => {
        const text = item.replace(/<[^>]*>/g, '').trim();
        if (text.length < 100 && text.length > 10) {
          points.push(text);
        }
      });
    }
  });
  
  return points.slice(0, 5); // Máximo 5 pontos
}

/**
 * Extrai passos do conteúdo para blocos escaneáveis
 */
export function extractSteps(sections: ContentSection[]): string[] {
  const steps: string[] = [];
  
  sections.forEach(section => {
    // Extrair ordered lists (passos)
    const orderedItems = section.content.match(/<li[^>]*>(.*?)<\/li>/gis);
    if (orderedItems) {
      orderedItems.forEach(item => {
        const text = item.replace(/<[^>]*>/g, '').trim();
        if (text.length < 80 && text.length > 10) {
          steps.push(text);
        }
      });
    }
  });
  
  return steps.slice(0, 5); // Máximo 5 passos
}
