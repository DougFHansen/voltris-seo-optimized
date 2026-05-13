/**
 * Simulador de Vendas - Notificações de Venda Simulada no Telegram
 * Envia mensagens aleatórias de venda simulada a cada 5 minutos
 */

export interface SimulatedSale {
  plan: 'Standard' | 'Pro' | 'Enterprise';
  period: 'month' | 'year';
  price: string;
  customerName: string;
  city: string;
  state: string;
}

const PRICES = {
  month: {
    Standard: '9,90',
    Pro: '69,90',
    Enterprise: '299,90',
  },
  year: {
    Standard: '79,90',
    Pro: '149,90',
    Enterprise: '1.099,90',
  },
};

const CUSTOMER_NAMES = [
  'Carlos Silva', 'Maria Oliveira', 'João Pedro', 'Ana Costa', 'Fernanda Lima',
  'Ricardo Souza', 'Juliana Martins', 'Lucas Pereira', 'Beatriz Santos', 'Gabriel Almeida',
  'Camila Ferreira', 'Matheus Rodrigues', 'Isabella Gomes', 'Thiago Barbosa', 'Larissa Rocha',
  'Pedro Henrique', 'Mariana Dias', 'Felipe Araújo', 'Vitória Carvalho', 'Bruno Nogueira',
  'Amanda Pires', 'Rafael Cunha', 'Letícia Monteiro', 'Guilherme Cardoso', 'Sophia Teixeira',
  'Leonardo Moreira', 'Valentina Correia', 'Enzo Fernandes', 'Helena Machado', 'Daniel Brito',
];

const CITIES = [
  'São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Curitiba', 'Porto Alegre',
  'Salvador', 'Fortaleza', 'Brasília', 'Manaus', 'Recife',
  'Goiânia', 'Belém', 'São Luís', 'Maceió', 'Teresina',
  'Natal', 'Campo Grande', 'João Pessoa', 'Aracaju', 'Cuiabá',
];

const STATES = [
  'SP', 'RJ', 'MG', 'PR', 'RS', 'BA', 'CE', 'DF', 'AM', 'PE',
  'GO', 'PA', 'MA', 'AL', 'PI', 'RN', 'MS', 'PB', 'SE', 'MT',
];

const SALE_TEMPLATES = [
  // Templates para plano Standard
  {
    plan: 'Standard' as const,
    templates: [
      `💰 <b>NOVA VENDA REALIZADA!</b>\n\n🎫 <b>Plano:</b> Standard\n💳 <b>Valor:</b> R$ {{price}}/{{period}}\n👤 <b>Cliente:</b> {{customer}}\n📍 <b>Local:</b> {{city}}/{{state}}\n⏰ <b>Horário:</b> {{time}}\n\n✅ Licença ativada automaticamente. Mais um cliente otimizando seu PC!`,
      `🎉 <b>VENDA CONFIRMADA!</b>\n\n📦 Plano Standard - {{periodText}}\n💵 R$ {{price}}\n👤 {{customer}} ({{city}}/{{state}})\n🕐 {{time}}\n\n🚀 Ativação imediata concluída.`,
      `💎 <b>Ping! Nova venda no ar!</b>\n\n🥉 Plano Standard\n💰 R$ {{price}} ({{periodText}})\n📍 {{city}}, {{state}}\n👤 {{customer}}\n⏰ {{time}}\n\n✨ Cliente pronto para otimizar!`,
    ],
  },
  // Templates para plano Pro
  {
    plan: 'Pro' as const,
    templates: [
      `🚀 <b>NOVA VENDA - PLANO PRO!</b>\n\n🎫 <b>Plano:</b> Pro (Mais Vendido)\n💳 <b>Valor:</b> R$ {{price}}/{{period}}\n👤 <b>Cliente:</b> {{customer}}\n📍 <b>Local:</b> {{city}}/{{state}}\n⏰ <b>Horário:</b> {{time}}\n\n🔥 Plano preferido dos gamers! Ativação automática.`,
      `💳 <b>VENDA PRO CONFIRMADA!</b>\n\n⭐ Plano Pro - {{periodText}}\n💵 R$ {{price}}\n👤 {{customer}}\n📍 {{city}}/{{state}}\n🕐 {{time}}\n\n🎯 Mais um entusiasta maximizando performance!`,
      `⚡ <b>Ping! Venda Pro!</b>\n\n🥈 Plano Pro\n💰 R$ {{price}} ({{periodText}})\n📍 {{city}}, {{state}}\n👤 {{customer}}\n⏰ {{time}}\n\n🏆 Escolha dos gamers exigentes!`,
    ],
  },
  // Templates para plano Enterprise
  {
    plan: 'Enterprise' as const,
    templates: [
      `👑 <b>NOVA VENDA ENTERPRISE!</b>\n\n🎫 <b>Plano:</b> Enterprise\n💳 <b>Valor:</b> R$ {{price}}/{{period}}\n👤 <b>Cliente:</b> {{customer}}\n📍 <b>Local:</b> {{city}}/{{state}}\n⏰ <b>Horário:</b> {{time}}\n\n🏢 Empresa escalando com Voltris! Suporte VIP ativado.`,
      `💎 <b>VENDA ENTERPRISE!</b>\n\n👑 Plano Enterprise - {{periodText}}\n💵 R$ {{price}}\n👤 {{customer}}\n📍 {{city}}/{{state}}\n🕐 {{time}}\n\n🚀 Dispositivos ilimitados + API ativada!`,
      `🔥 <b>GRANDE VENDA!</b>\n\n👑 Enterprise\n💰 R$ {{price}} ({{periodText}})\n📍 {{city}}, {{state}}\n👤 {{customer}}\n⏰ {{time}}\n\n🏢 Mais uma empresa dominando performance!`,
    ],
  },
];

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateTime(): string {
  const now = new Date();
  return now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export function generateSimulatedSale(): { sale: SimulatedSale; message: string } {
  const period = Math.random() > 0.4 ? 'month' : 'year'; // 60% mensal, 40% anual
  const planWeights = [
    { plan: 'Standard' as const, weight: 0.35 },
    { plan: 'Pro' as const, weight: 0.50 },
    { plan: 'Enterprise' as const, weight: 0.15 },
  ];
  
  const random = Math.random();
  let cumulativeWeight = 0;
  let selectedPlan: 'Standard' | 'Pro' | 'Enterprise' = 'Standard';
  
  for (const item of planWeights) {
    cumulativeWeight += item.weight;
    if (random <= cumulativeWeight) {
      selectedPlan = item.plan;
      break;
    }
  }

  const sale: SimulatedSale = {
    plan: selectedPlan,
    period,
    price: PRICES[period][selectedPlan],
    customerName: getRandomItem(CUSTOMER_NAMES),
    city: getRandomItem(CITIES),
    state: getRandomItem(STATES),
  };

  const planGroup = SALE_TEMPLATES.find(g => g.plan === selectedPlan)!;
  const template = getRandomItem(planGroup.templates);

  const periodText = period === 'month' ? 'Mensal' : 'Anual';
  const periodLabel = period === 'month' ? 'mês' : 'ano';

  const message = template
    .replace(/\{\{price\}\}/g, sale.price)
    .replace(/\{\{period\}\}/g, periodLabel)
    .replace(/\{\{periodText\}\}/g, periodText)
    .replace(/\{\{customer\}\}/g, sale.customerName)
    .replace(/\{\{city\}\}/g, sale.city)
    .replace(/\{\{state\}\}/g, sale.state)
    .replace(/\{\{time\}\}/g, generateTime());

  return { sale, message };
}
