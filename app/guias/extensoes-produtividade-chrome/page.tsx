import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "As Melhores Extensões Chrome para Produtividade Máxima";
const description = "Transforme seu navegador em uma máquina de produtividade. Análise detalhada do uBlock Origin, Bitwarden, OneTab, Grammarly e outros essenciais.";
const keywords = ["melhores extensões chrome","ublock origin","bitwarden","produtividade navegador","bloquear anuncios"];

export const metadata: Metadata = createGuideMetadata(title, description, keywords);

export default function GuidePage() {
  const contentSections = [

    {
      title: "Por que usar Extensões?",
      content: `
        <p class="mb-4 text-gray-300">O Google Chrome "puro" é rápido, mas limitado. Extensões são pequenos programas que adicionam superpoderes ao navegador. Selecionamos apenas as que são <strong>leves</strong>, <strong>seguras</strong> e <strong>gratuitas</strong>.</p>
      `,
      subsections: []
    },

    {
      title: "Top 1: Segurança e Limpeza",
      content: `
        <div class="space-y-4">
            <div class="bg-[#1E1E22] p-4 rounded border-l-4 border-red-500">
              <h4 class="text-white font-bold mb-1">uBlock Origin</h4>
              <p class="text-gray-400 text-sm">Não confunda com o "AdBlock Plus". O uBlock Origin é o rei indiscutível. Ele bloqueia anúncios, rastreadores e scripts maliciosos usando pouquíssima memória (CPU/RAM). Essencial para qualquer PC.</p>
            </div>
            <div class="bg-[#1E1E22] p-4 rounded border-l-4 border-blue-500">
              <h4 class="text-white font-bold mb-1">Bitwarden</h4>
              <p class="text-gray-400 text-sm">Pare de usar a mesma senha para tudo. O Bitwarden cria e salva senhas ultra-seguras para cada site. É open-source e gratuito para uso ilimitado.</p>
            </div>
          </div>
      `,
      subsections: []
    },

    {
      title: "Top 2: Foco e Organização",
      content: `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-[#171313] p-4 rounded">
              <h4 class="text-[#31A8FF] font-bold">OneTab</h4>
              <p class="text-gray-400 text-sm mt-2">Você tem 50 abas abertas e o PC está travando? Clique no ícone do OneTab e ele converte tudo em uma lista simples em uma única aba. Economiza até 95% de memória RAM.</p>
            </div>
            <div class="bg-[#171313] p-4 rounded">
              <h4 class="text-[#31A8FF] font-bold">Todoist ou TickTick</h4>
              <p class="text-gray-400 text-sm mt-2">Tenha sua lista de tarefas sempre à mão na barra de ferramentas. Adicione sites como tarefas com um clique ("Ler depois").</p>
            </div>
          </div>
      `,
      subsections: []
    },

    {
      title: "Cuidado: O que evitar",
      content: `
        <p class="text-gray-300">Evite extensões de "VPN Grátis" (elas vendem seus dados) e "Downloaders de Vídeo" desconhecidos (muitos contêm adware). Mantenha o mínimo possível instalado para não deixar o navegador pesado.</p>
      `,
      subsections: []
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/rede-domestica",
      title: "Redes Domésticas",
      description: "Melhore sua conexão WiFi."
    },
    {
      href: "/guias/otimizacao-performance",
      title: "Otimização de Performance",
      description: "Deixe seu PC mais rápido."
    },
    {
      href: "/guias/seguranca-digital",
      title: "Segurança Digital",
      description: "Proteção contra ameaças."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="15 min"
      difficultyLevel="Iniciante"
      contentSections={contentSections}
      relatedGuides={relatedGuides}
    />
  );
}
