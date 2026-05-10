import { GuideMetadata } from './guides';

export interface LinkScore {
  guide: GuideMetadata;
  score: number;
  reason: string;
}

/**
 * Algoritmo de Internal Linking Inteligente (Server-side)
 * 
 * Estratégia de ponderação:
 * 1. Mesma categoria (peso: 3.0) - FORTALECE SILO SEO
 * 2. Entidades semânticas (peso: 2.5 por entidade) - ENTITY SEO
 * 3. Palavras-chave complementares (peso: 2.0) - INTENÇÃO COMPLEMENTAR
 * 4. Funnel progressivo (peso: 1.5) - TOFU → MOFU → BOFU
 * 5. Cross-category relevante (peso: 1.0) - TOPICAL MAP
 * 6. Atualização recente (peso: 0.5) - FRESHNESS
 * 
 * @param currentGuide - Guia atual
 * @param allGuides - Todas as guias disponíveis
 * @param maxLinks - Máximo de links a retornar (padrão: 8)
 * @returns Array de guias relacionadas ordenadas por score
 */
export function calculateInternalLinks(
  currentGuide: GuideMetadata,
  allGuides: GuideMetadata[],
  maxLinks = 8
): LinkScore[] {
  const scores: LinkScore[] = [];
  
  allGuides.forEach(guide => {
    if (guide.id === currentGuide.id) return;
    
    let score = 0;
    const reasons: string[] = [];
    
    // 1. MESMA CATEGORIA (peso: 3.0) - FORTALECE SILO SEO
    if (guide.category === currentGuide.category) {
      score += 3.0;
      reasons.push('same-category');
    }
    
    // 2. ENTIDADES SEMÂNTICAS (peso: 2.5 por entidade) - ENTITY SEO
    const currentEntities = extractEntities(currentGuide.title + ' ' + currentGuide.description);
    const guideEntities = extractEntities(guide.title + ' ' + guide.description);
    const entityOverlap = currentEntities.filter(e => guideEntities.includes(e)).length;
    if (entityOverlap > 0) {
      score += (entityOverlap * 2.5);
      reasons.push(`semantic-entities:${entityOverlap}`);
    }
    
    // 3. PALAVRAS-CHAVE COMPLEMENTARES (peso: 2.0) - INTENÇÃO COMPLEMENTAR
    const keywordOverlap = currentGuide.keywords.some(k => 
      guide.keywords.some(gk => k.includes(k.split(' ')[0])) &&
      !k.includes(guide.title.split(' ')[0])
    );
    if (keywordOverlap) {
      score += 2.0;
      reasons.push('complementary-keywords');
    }
    
    // 4. FUNNEL PROGRESSIVO (peso: 1.5) - TOFU → MOFU → BOFU
    const currentDifficulty = getDifficultyScore(currentGuide.difficulty);
    const guideDifficulty = getDifficultyScore(guide.difficulty);
    if (Math.abs(currentDifficulty - guideDifficulty) === 1) {
      score += 1.5;
      reasons.push('funnel-progression');
    }
    
    // 5. CROSS-CATEGORY RELEVANTE (peso: 1.0) - TOPICAL MAP
    const relevantCrossCategories = getRelevantCrossCategories(currentGuide.category);
    if (relevantCrossCategories.includes(guide.category)) {
      score += 1.0;
      reasons.push('cross-category-relevant');
    }
    
    if (score > 0) {
      scores.push({
        guide,
        score,
        reason: reasons.join(',')
      });
    }
  });
  
  // Ordenar por score e limitar
  return scores
    .sort((a, b) => b.score - a.score)
    .slice(0, maxLinks);
}

/**
 * Extrai entidades de texto (jogos, tecnologias, hardware, software, OS)
 */
function extractEntities(text: string): string[] {
  const lowerText = text.toLowerCase();
  
  const entities = [
    // Jogos
    'valorant', 'cs2', 'csgo', 'gta', 'gta v', 'minecraft', 'roblox', 'fortnite',
    'league of legends', 'lol', 'warzone', 'elden ring', 'cyberpunk',
    // Tecnologias
    'directx', 'vulkan', 'opengl', 'nvidia', 'amd', 'intel', 'radeon', 'geforce',
    'rtx', 'gtx', 'dlss', 'freesync', 'g-sync', 'steam', 'epic games',
    // Windows
    'windows 11', 'windows 10', 'uefi', 'gpt', 'bios', 'tpm', 'secure boot',
    'registry', 'group policy', 'powershell', 'cmd', 'services',
    // Hardware
    'cpu', 'gpu', 'ram', 'ssd', 'hdd', 'motherboard', 'psu', 'monitor',
    'mouse', 'keyboard', 'headset'
  ];
  
  return entities.filter(e => lowerText.includes(e));
}

/**
 * Score de dificuldade para funnel progression
 */
function getDifficultyScore(difficulty: string): number {
  switch (difficulty) {
    case 'Iniciante': return 1;
    case 'Intermediário': return 2;
    case 'Avançado': return 3;
    default: return 2;
  }
}

/**
 * Categorias cross-relevantes (topical map)
 */
function getRelevantCrossCategories(category: string): string[] {
  const crossMap: Record<string, string[]> = {
    'otimizacao': ['games-fix', 'hardware', 'windows-geral'],
    'games-fix': ['otimizacao', 'windows-erros', 'hardware'],
    'windows-erros': ['otimizacao', 'rede-seguranca', 'software'],
    'hardware': ['otimizacao', 'games-fix', 'perifericos'],
    'rede-seguranca': ['windows-erros', 'software', 'windows-geral']
  };
  
  return crossMap[category] || [];
}

/**
 * Identifica guias pilares (mais autoridade)
 * Guias pilares são:
 * - Mais longas (mais conteúdo)
 * - Mais links externos (mais autoridade)
 * - Mais tráfego estimado (mais popular)
 */
export function identifyPillarGuides(allGuides: GuideMetadata[]): GuideMetadata[] {
  const scored = allGuides.map(guide => {
    let score = 0;
    
    // Título longo indica conteúdo abrangente
    if (guide.title.length > 60) score += 2;
    if (guide.title.length > 80) score += 3;
    
    // Dificuldade Intermediário/Avançado indica conteúdo técnico
    if (guide.difficulty === 'Intermediário') score += 2;
    if (guide.difficulty === 'Avançado') score += 3;
    
    // Categorias principais
    const mainCategories = ['otimizacao', 'windows-erros', 'games-fix', 'hardware'];
    if (mainCategories.includes(guide.category)) score += 2;
    
    return { guide, score };
  });
  
  // Top 20% são pilares
  const pillarCount = Math.ceil(allGuides.length * 0.2);
  
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, pillarCount)
    .map(item => item.guide);
}
