export interface ComparisonRow {
  metric: string;
  manual: string;
  optimizer: string;
}

export interface ComparisonData {
  title: string;
  description: string;
  rows: ComparisonRow[];
}

export const COMPARISON_DATA_BY_CATEGORY: Record<string, ComparisonData> = {
  'otimizacao': {
    title: 'Otimização Manual vs Voltris Optimizer',
    description: 'Comparação detalhada entre fazer otimizações manualmente e usar o Voltris Optimizer',
    rows: [
      { metric: 'Tempo', manual: '2-3 horas', optimizer: '30 segundos' },
      { metric: 'Risco de erro', manual: 'Alto', optimizer: 'Zero' },
      { metric: 'Performance', manual: '+10%', optimizer: '+50%' },
      { metric: 'FPS médio', manual: '+15', optimizer: '+60' },
      { metric: 'Conhecimento técnico', manual: 'Necessário', optimizer: 'Não necessário' },
      { metric: 'Atualizações', manual: 'Manual', optimizer: 'Automática' }
    ]
  },
  'windows-erros': {
    title: 'Correção Manual vs Voltris Optimizer',
    description: 'Comparação entre corrigir erros do Windows manualmente e usar o Voltris Optimizer',
    rows: [
      { metric: 'Tempo', manual: '1-2 horas', optimizer: '30 segundos' },
      { metric: 'Erros corrigidos', manual: '50%', optimizer: '90%' },
      { metric: 'Risco de piorar', manual: 'Médio', optimizer: 'Zero' },
      { metric: 'Reinícios necessários', manual: '5-10', optimizer: '1' },
      { metric: 'Conhecimento técnico', manual: 'Avançado', optimizer: 'Não necessário' }
    ]
  },
  'games-fix': {
    title: 'Correção Manual de Jogos vs Voltris Optimizer',
    description: 'Comparação entre corrigir bugs de jogos manualmente e usar o Voltris Optimizer',
    rows: [
      { metric: 'Tempo', manual: '1-2 horas', optimizer: '30 segundos' },
      { metric: 'Jogos corrigidos', manual: '1-2', optimizer: '50+' },
      { metric: 'Crashes reduzidos', manual: '20%', optimizer: '80%' },
      { metric: 'Configuração manual', manual: 'Complexa', optimizer: 'Automática' },
      { metric: 'Atualização', manual: 'Manual', optimizer: 'Automática' }
    ]
  },
  'hardware': {
    title: 'Configuração Manual vs Voltris Optimizer',
    description: 'Comparação entre configurar hardware manualmente e usar o Voltris Optimizer',
    rows: [
      { metric: 'Tempo', manual: '1-2 horas', optimizer: '30 segundos' },
      { metric: 'Drivers atualizados', manual: 'Manual', optimizer: 'Automático' },
      { metric: 'Configuração ideal', manual: 'Complexa', optimizer: 'Automática' },
      { metric: 'Compatibilidade', manual: 'Manual', optimizer: 'Automática' },
      { metric: 'Conhecimento técnico', manual: 'Avançado', optimizer: 'Não necessário' }
    ]
  },
  'rede-seguranca': {
    title: 'Configuração Manual vs Voltris Optimizer',
    description: 'Comparação entre configurar rede e segurança manualmente e usar o Voltris Optimizer',
    rows: [
      { metric: 'Tempo', manual: '1-2 horas', optimizer: '30 segundos' },
      { metric: 'Segurança configurada', manual: 'Parcial', optimizer: 'Completa' },
      { metric: 'Risco de erro', manual: 'Médio', optimizer: 'Zero' },
      { metric: 'Conhecimento técnico', manual: 'Avançado', optimizer: 'Não necessário' }
    ]
  },
  'default': {
    title: 'Configuração Manual vs Voltris Optimizer',
    description: 'Comparação entre fazer configurações manualmente e usar o Voltris Optimizer',
    rows: [
      { metric: 'Tempo', manual: '1-2 horas', optimizer: '30 segundos' },
      { metric: 'Risco de erro', manual: 'Médio', optimizer: 'Zero' },
      { metric: 'Resultado', manual: 'Variável', optimizer: 'Consistente' },
      { metric: 'Conhecimento técnico', manual: 'Necessário', optimizer: 'Não necessário' },
      { metric: 'Suporte', manual: 'Autoajuda', optimizer: 'Suporte incluso' }
    ]
  }
};

export function getComparisonData(category: string): ComparisonData {
  return COMPARISON_DATA_BY_CATEGORY[category] || COMPARISON_DATA_BY_CATEGORY['default'];
}
