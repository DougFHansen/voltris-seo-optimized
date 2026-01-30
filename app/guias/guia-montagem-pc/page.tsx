import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Guia Passo a Passo de Montagem de PC Gamer/Workstation";
const description = "Monte seu próprio computador com confiança. Tutorial detalhado cobrindo desde a instalação da CPU até o gerenciamento de cabos e primeiro boot.";
const keywords = ["montar pc","instalar cpu","pasta termica","conectar painel frontal pc","organização de cabos"];

export const metadata: Metadata = createGuideMetadata('guia-montagem-pc', title, description, keywords);

export default function GuidePage() {
  const contentSections = [

    {
      title: "1. Preparação e Precauções",
      content: `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
            <div class="bg-[#171313] p-4 rounded-lg border border-red-500/30">
              <h4 class="text-red-400 font-bold mb-2">⚡ Eletricidade Estática</h4>
              <p class="text-gray-400 text-sm">Componentes são sensíveis. Trabalhe em uma superfície não condutiva (madeira, borracha). Evite carpetes. Toque em uma parte metálica do gabinete ou use uma pulseira antiestática antes de manusear as peças.</p>
            </div>
            <div class="bg-[#171313] p-4 rounded-lg border border-blue-500/30">
              <h4 class="text-blue-400 font-bold mb-2">🛠️ Ferramentas Necessárias</h4>
              <ul class="text-gray-400 text-sm list-disc list-inside">
                <li>Chave Philips #2 (Ponta magnética ajuda muito)</li>
                <li>Abraçadeiras plásticas (Zip ties)</li>
                <li>Tesoura ou alicate de corte</li>
                <li>Lanterna (ou flash do celular)</li>
              </ul>
            </div>
          </div>
      `,
      subsections: []
    },

    {
      title: "2. Instalação do Processador (CPU) e Memória (RAM)",
      content: `
        <div class="space-y-4">
            <p class="text-gray-300">Recomendamos instalar CPU, RAM e SSD M.2 na placa-mãe <strong>antes</strong> de colocá-la dentro do gabinete.</p>
            <div class="bg-[#1E1E22] p-5 rounded-lg border-l-4 border-yellow-500">
              <h4 class="text-white font-bold mb-2">Instalando a CPU</h4>
              <p class="text-gray-400 text-sm mb-2">Levante a alavanca de retenção. Alinhe o triângulo dourado na CPU com o triângulo no socket.</p>
              <p class="text-yellow-500 text-sm font-semibold">⚠ NÃO FORCE. A CPU deve encaixar suavemente (Drop-in). Se precisar forçar, está errado.</p>
            </div>
            <div class="bg-[#1E1E22] p-5 rounded-lg border-l-4 border-green-500">
              <h4 class="text-white font-bold mb-2">Instalando a RAM</h4>
              <p class="text-gray-400 text-sm">Abra as travas dos slots. Consulte o manual da placa-mãe para a ordem correta (geralmente slots 2 e 4 para Dual Channel). Pressione até ouvir um 'clique'.</p>
            </div>
          </div>
      `,
      subsections: []
    },

    {
      title: "3. O Pesadelo: Painel Frontal (F_PANEL)",
      content: `
        <p class="text-gray-300 mb-4">Os cabos minúsculos que conectam o botão Power, Reset e LEDs são a parte mais chata. Consulte o manual, mas o padrão geralmente é:</p>
          <ul class="grid grid-cols-2 gap-2 text-sm text-gray-400 bg-black p-4 rounded border border-gray-800 font-mono">
            <li><span class="text-red-500">Power SW</span>: Pinos 3-4 (Topo)</li>
            <li><span class="text-blue-500">Reset SW</span>: Pinos 3-4 (Baixo)</li>
            <li><span class="text-green-500">Power LED</span>: Pinos 1-2 (Topo)</li>
            <li><span class="text-orange-500">HDD LED</span>: Pinos 1-2 (Baixo)</li>
          </ul>
          <p class="text-xs text-gray-500 mt-2">*Triângulo no conector indica o POSITIVO (+).</p>
      `,
      subsections: []
    },

    {
      title: "Troubleshooting Comum",
      content: `
        <div class="space-y-3">
            <div class="bg-[#171313] p-3 rounded border border-gray-700">
              <strong class="text-white block">PC liga mas não dá vídeo</strong>
              <p class="text-gray-400 text-sm">Verifique se o cabo HDMI está na placa de vídeo (GPU) e não na placa-mãe. Verifique se as memórias RAM estão totalmente encaixadas.</p>
            </div>
            <div class="bg-[#171313] p-3 rounded border border-gray-700">
              <strong class="text-white block">Nada acontece ao apertar Power</strong>
              <p class="text-gray-400 text-sm">Verifique se a chave da fonte (atrás do PC) está na posição 'I'. Verifique os cabos do painel frontal.</p>
            </div>
          </div>
      `,
      subsections: []
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/otimizacao-performance",
      title: "Otimização de Performance",
      description: "Dicas para deixar seu PC mais rápido."
    },
    {
      href: "/guias/seguranca-digital",
      title: "Segurança Digital",
      description: "Proteja seus dados."
    },
    {
      href: "/guias/manutencao-preventiva",
      title: "Manutenção Preventiva",
      description: "Cuidados essenciais com o hardware."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="15-20 min"
      difficultyLevel="Iniciante"
      contentSections={contentSections}
      relatedGuides={relatedGuides}
    />
  );
}
