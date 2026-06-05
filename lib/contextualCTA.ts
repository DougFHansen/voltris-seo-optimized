export interface CategoryCTA {
  title: string;
  description: string;
  benefit: string;
  urgency: string;
  primaryAction: string;
  primaryActionUrl: string;
  secondaryAction: string;
  secondaryActionUrl: string;
}

export const CATEGORY_CTA_MAP: Record<string, CategoryCTA> = {
  'otimizacao': {
    title: 'Aumente FPS Automaticamente',
    description: 'O Voltris Optimizer aplica todas as otimizações deste guia em segundos.',
    benefit: '+50% FPS médio em jogos competitivos',
    urgency: 'Baixe agora e jogue sem lag hoje',
    primaryAction: 'Baixar Voltris Optimizer',
    primaryActionUrl: '/voltrisoptimizer',
    secondaryAction: 'Ver Comparação Manual vs Automático',
    secondaryActionUrl: '/comparacoes/otimizacao-manual-vs-automatica'
  },
  'games-fix': {
    title: 'Corrija Bugs de Jogos',
    description: 'O Voltris Optimizer otimiza DirectX, drivers e configurações de jogos.',
    benefit: 'Jogos sem crashes e mais estáveis',
    urgency: 'Volte a jogar agora',
    primaryAction: 'Baixar Voltris Optimizer',
    primaryActionUrl: '/voltrisoptimizer',
    secondaryAction: 'Ver Jogos Compatíveis',
    secondaryActionUrl: '/guias/games-fix'
  },
  'windows-erros': {
    title: 'Corrija Erros Automaticamente',
    description: 'O Voltris Optimizer detecta e corrige erros do Windows automaticamente.',
    benefit: '90% dos erros corrigidos em 30 segundos',
    urgency: 'Não deixe seu PC travando',
    primaryAction: 'Baixar Voltris Optimizer',
    primaryActionUrl: '/voltrisoptimizer',
    secondaryAction: 'Ver Como Funciona',
    secondaryActionUrl: '/voltrisoptimizer'
  },
  'hardware': {
    title: 'Otimize Seu Hardware',
    description: 'O Voltris Optimizer ajusta configurações de CPU, GPU e RAM.',
    benefit: 'Hardware trabalhando no máximo',
    urgency: 'Extraia todo o potencial do seu PC',
    primaryAction: 'Baixar Voltris Optimizer',
    primaryActionUrl: '/voltrisoptimizer',
    secondaryAction: 'Ver Requisitos',
    secondaryActionUrl: '/voltrisoptimizer'
  },
  'rede-seguranca': {
    title: 'Proteja Seu PC',
    description: 'O Voltris Optimizer otimiza configurações de segurança e rede.',
    benefit: 'PC protegido e rede mais rápida',
    urgency: 'Não deixe seu PC vulnerável',
    primaryAction: 'Baixar Voltris Optimizer',
    primaryActionUrl: '/voltrisoptimizer',
    secondaryAction: 'Ver Recursos de Segurança',
    secondaryActionUrl: '/voltrisoptimizer'
  },
  'windows-geral': {
    title: 'Otimize Seu Windows',
    description: 'O Voltris Optimizer otimiza seu PC para programação sem lentidão, travamentos ou interrupções.',
    benefit: 'Windows mais rápido e estável',
    urgency: 'Baixe agora e veja a diferença',
    primaryAction: 'Baixar Voltris Optimizer',
    primaryActionUrl: '/voltrisoptimizer',
    secondaryAction: 'Ver Todas as Funcionalidades',
    secondaryActionUrl: '/voltrisoptimizer'
  },
  'perifericos': {
    title: 'Otimize Seus Periféricos',
    description: 'O Voltris Optimizer ajusta configurações de mouse, teclado e monitor.',
    benefit: 'Periféricos trabalhando no máximo',
    urgency: 'Extraia todo o potencial do seu setup',
    primaryAction: 'Baixar Voltris Optimizer',
    primaryActionUrl: '/voltrisoptimizer',
    secondaryAction: 'Ver Guias de Periféricos',
    secondaryActionUrl: '/guias/perifericos'
  },
  'software': {
    title: 'Otimize Seus Programas',
    description: 'O Voltris Optimizer ajusta configurações de software e utilitários.',
    benefit: 'Programas mais rápidos e estáveis',
    urgency: 'Otimize seu PC agora',
    primaryAction: 'Baixar Voltris Optimizer',
    primaryActionUrl: '/voltrisoptimizer',
    secondaryAction: 'Ver Guias de Software',
    secondaryActionUrl: '/guias/software'
  },
  'emulacao': {
    title: 'Otimize Emuladores',
    description: 'O Voltris Optimizer ajusta configurações de emuladores de jogos.',
    benefit: 'Emuladores mais rápidos e estáveis',
    urgency: 'Jogue clássicos sem lag',
    primaryAction: 'Baixar Voltris Optimizer',
    primaryActionUrl: '/voltrisoptimizer',
    secondaryAction: 'Ver Guias de Emulação',
    secondaryActionUrl: '/guias/emulacao'
  },
  'linux': {
    title: 'Otimize Linux e Steam Deck',
    description: 'O Voltris Optimizer ajusta configurações de Linux e Proton.',
    benefit: 'Jogos Linux mais rápidos',
    urgency: 'Otimize seu Steam Deck',
    primaryAction: 'Baixar Voltris Optimizer',
    primaryActionUrl: '/voltrisoptimizer',
    secondaryAction: 'Ver Guias de Linux',
    secondaryActionUrl: '/guias/linux'
  },
  'inteligencia-artificial': {
    title: 'Otimize para IA Local',
    description: 'O Voltris Optimizer ajusta configurações para LLMs e AI Agents.',
    benefit: 'IA local mais rápida',
    urgency: 'Otimize seu PC para IA',
    primaryAction: 'Baixar Voltris Optimizer',
    primaryActionUrl: '/voltrisoptimizer',
    secondaryAction: 'Ver Guias de IA',
    secondaryActionUrl: '/guias/inteligencia-artificial'
  },
  'default': {
    title: 'Otimize Seu PC Automaticamente',
    description: 'O Voltris Optimizer otimiza seu PC para programação sem lentidão, travamentos ou interrupções.',
    benefit: 'PC mais rápido e estável',
    urgency: 'Baixe agora e veja a diferença',
    primaryAction: 'Baixar Voltris Optimizer',
    primaryActionUrl: '/voltrisoptimizer',
    secondaryAction: 'Saiba Mais',
    secondaryActionUrl: '/voltrisoptimizer'
  }
};

export function getContextualCTA(category: string): CategoryCTA {
  return CATEGORY_CTA_MAP[category] || CATEGORY_CTA_MAP['default'];
}
