import React from 'react';
import Link from 'next/link';

interface RelatedItem {
  href: string;
  title: string;
  description: string;
  category?: string;
}

interface RelatedContentProps {
  items: RelatedItem[];
  title?: string;
  maxItems?: number;
}

export default function RelatedContent({ 
  items, 
  title = "Conteúdo Relacionado", 
  maxItems = 6 
}: RelatedContentProps) {
  const displayItems = items.slice(0, maxItems);

  return (
    <div className="bg-gray-800/50 rounded-xl p-6 mt-8 border border-gray-700">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <span className="text-2xl">?</span>
        {title}
      </h3>
      <div className="grid md:grid-cols-2 gap-4">
        {displayItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="block p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-all duration-300 hover:scale-[1.02] border border-gray-600 hover:border-blue-500/50"
          >
            <div className="flex items-start gap-3">
              <span className="text-blue-400 text-lg">?</span>
              <div className="flex-1">
                <h4 className="font-semibold text-white mb-1 line-clamp-2">
                  {item.title}
                </h4>
                <p className="text-gray-400 text-sm line-clamp-2">
                  {item.description}
                </p>
                {item.category && (
                  <span className="inline-block mt-2 px-2 py-1 bg-blue-900/30 text-blue-400 text-xs rounded">
                    {item.category}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// Clusters de conteúdo pré-definidos para SEO
export const hardwareCluster: RelatedItem[] = [
  {
    href: "/guias/ssd-vs-hdd-guia",
    title: "SSD vs HDD vs NVMe: Qual Vale a Pena em 2026?",
    description: "Ganhe ATÉ 10x VELOCIDADE no seu PC! Comparamos SSD SATA, NVMe M.2 e HD com benchmarks reais.",
    category: "Hardware"
  },
  {
    href: "/guias/como-escolher-placa-de-video",
    title: "Como Escolher Placa de Vídeo em 2026",
    description: "RTX 4060 vs 4070 vs 4080 vs 4090: Qual vale a pena para seu orçamento?",
    category: "Hardware"
  },
  {
    href: "/guias/como-escolher-fonte-pc-gamer",
    title: "Guia de Fontes (PSU) 2026: Tier List e Potência",
    description: "Não economize na fonte! Guia completo para escolher PSU confiável.",
    category: "Hardware"
  },
  {
    href: "/guias/atualizar-bios-seguro",
    title: "Como Atualizar a BIOS com Segurança em 2026",
    description: "Guia completo e definitivo para atualizar BIOS sem risco",
    category: "Hardware"
  }
];

export const jogosCluster: RelatedItem[] = [
  {
    href: "/guias/gta-6-pc-configuracoes-requisitos",
    title: "GTA 6 PC: RODE LISO! (Configurações Secretas 2026)",
    description: "Seu PC aguenta GTA 6? Requisitos oficiais, configurações para 60 FPS e otimização extrema.",
    category: "Jogos"
  },
  {
    href: "/guias/starfield-2-pc-configuracoes-otimizacao",
    title: "Starfield 2 PC: EXPLORE O UNIVERSO SEM LAG! (2026)",
    description: "Seu PC está pronto para explorar 100+ sistemas estelares? Configurações para 60 FPS estáveis.",
    category: "Jogos"
  },
  {
    href: "/guias/valorant-reduzir-input-lag-fps-boost-config",
    title: "Valorant: CHEGUE AO RADIANTE! (0ms Input Lag 2026)",
    description: "Quer subir de elo RAPIDAMENTE? Configurações PRO para 240 FPS + input lag ZERO.",
    category: "Jogos"
  },
  {
    href: "/guias/overwatch-2-otimizacao-fps-input-lag-reduce-buffering",
    title: "Overwatch 2: ALCANCE GRANDMASTER! (Config Pro 2026)",
    description: "Quer subir de elo RÁPIDO? Configurações EXATAS dos pros da OWL para 600 FPS + 0ms input lag.",
    category: "Jogos"
  },
  {
    href: "/guias/call-of-duty-warzone-mw3-guia-fps",
    title: "Call of Duty: Warzone & MW3 - O Guia Definitivo de FPS",
    description: "Configurações profissionais para Warzone e Modern Warfare 3",
    category: "Jogos"
  },
  {
    href: "/guias/cyberpunk-2077-otimizacao-definitiva-ray-tracing",
    title: "Cyberpunk 2077 (2026): Otimização Definitiva, Ray Tracing",
    description: "Configure Night City para performance máxima com ray tracing avançado",
    category: "Jogos"
  }
];

export const otimizacaoCluster: RelatedItem[] = [
  {
    href: "/guias/debloat-windows-11-otimizacao-powershell",
    title: "Windows 11 LENTO? Libere 2GB RAM AGORA! (PowerShell 2026)",
    description: "PC consumindo 4GB+ RAM sem motivo? Remova Candy Crush, Xbox e apps inúteis em 5 minutos.",
    category: "Otimização"
  },
  {
    href: "/guias/melhor-dns-jogos-2026",
    title: "DNS para Jogos: REDUZA PING AGORA! (Teste 2026)",
    description: "Cansado de desconectar do LoL/Valorant? Descubra qual DNS realmente reduz lag e evita quedas.",
    category: "Otimização"
  },
  {
    href: "/guias/otimizacao-ssd-windows-11",
    title: "Otimização Extrema de SSD e NVMe no Windows 11",
    description: "Configure TRIM, desative indexação e extraia o máximo do seu NVMe",
    category: "Otimização"
  },
  {
    href: "/guias/reduzir-ping-regedit-cmd-jogos",
    title: "Reduzir Ping nos Jogos Online: Guia Definitivo 2026",
    description: "Configurações de registro e rede que realmente funcionam para reduzir lag",
    category: "Otimização"
  }
];

export const servicosCluster: RelatedItem[] = [
  {
    href: "/voltrisoptimizer",
    title: "Voltris Optimizer: Otimizador de PC Brasileiro",
    description: "Software SaaS com controle remoto via web. Aumente FPS em até 40%!",
    category: "Serviços"
  },
  {
    href: "/otimizacao-pc",
    title: "Otimização de PC e Aumento de FPS - Gamer & Profissional",
    description: "Máxima performance para seu computador. Ganhe até 40% mais FPS em seus jogos favoritos.",
    category: "Serviços"
  },
  {
    href: "/formatar-windows",
    title: "Formatação de Windows - Sistema Limpo e Rápido",
    description: "Formatação profissional com backup de dados e otimização pós-instalação",
    category: "Serviços"
  },
  {
    href: "/suporte-tecnico-remoto",
    title: "Suporte Técnico Remoto - Atendimento Online",
    description: "Resolução de problemas complexos sem sair de casa. Atendimento 100% online.",
    category: "Serviços"
  }
];

// Função para obter cluster baseado na categoria
export function getClusterByCategory(category: string): RelatedItem[] {
  switch (category.toLowerCase()) {
    case 'hardware':
      return hardwareCluster;
    case 'jogos':
    case 'otimizacao':
      return jogosCluster;
    case 'otimizacao':
      return otimizacaoCluster;
    case 'servicos':
      return servicosCluster;
    default:
      return [...hardwareCluster.slice(0, 2), ...jogosCluster.slice(0, 2), ...otimizacaoCluster.slice(0, 2)];
  }
}
