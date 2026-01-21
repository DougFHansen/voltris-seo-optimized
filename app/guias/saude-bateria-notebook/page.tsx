import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Como Maximizar a Vida Útil da Bateria do seu Notebook";
const description = "Mitos e verdades sobre baterias de Li-ion. Aprenda como carregar, armazenar e verificar a saúde da bateria para que ela dure anos.";
const keywords = ["bateria viciada","ciclos de bateria","calibrar bateria notebook","battery report windows","economia energia"];

export const metadata: Metadata = createGuideMetadata(title, description, keywords);

export default function GuidePage() {
  const contentSections = [

    {
      title: "Mitos Comuns sobre Baterias",
      content: `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="bg-[#171313] p-4 rounded border border-red-500/20">
              <h4 class="text-red-400 font-bold mb-1">Mito: "Viciar a Bateria"</h4>
              <p class="text-gray-400 text-sm">Baterias modernas de Lítio não têm 'efeito memória'. Você não precisa descarregar tudo antes de carregar.</p>
            </div>
            <div class="bg-[#171313] p-4 rounded border border-green-500/20">
              <h4 class="text-green-400 font-bold mb-1">Verdade: Calor Mata</h4>
              <p class="text-gray-400 text-sm">O maior inimigo da bateria é o calor excessivo. Nunca use o notebook em cima de cobertores ou almofadas que bloqueiem a ventilação.</p>
            </div>
          </div>
      `,
      subsections: []
    },

    {
      title: "A Regra 20-80% (Para Longevidade Extrema)",
      content: `
        <p class="mb-4 text-gray-300">Quimicamente, baterias ficam mais estressadas nos extremos (0% e 100%). Para maximizar a vida útil (anos de uso):</p>
          <ul class="list-disc list-inside space-y-2 text-gray-300">
            <li>Tente manter a carga entre 20% e 80% no dia a dia.</li>
            <li>Muitos notebooks modernos (Dell, Lenovo, Asus) têm uma configuração de <strong>"Limite de Carga"</strong> ou <strong>"Modo de Conservação"</strong> que impede o carregamento acima de 60% ou 80% quando conectado na tomada. Ative isso se você usa o notebook sempre na mesa!</li>
          </ul>
      `,
      subsections: []
    },

    {
      title: "Gerando um Relatório de Saúde (Windows)",
      content: `
        <div class="bg-[#1E1E22] p-5 rounded-lg">
            <p class="mb-3 text-gray-300">O Windows tem uma ferramenta secreta para diagnóstico:</p>
            <ol class="list-decimal list-inside space-y-2 font-mono text-sm text-gray-400">
              <li>Abra o Prompt de Comando (CMD) como Administrador.</li>
              <li>Digite: <span class="text-[#31A8FF]">powercfg /batteryreport</span></li>
              <li>Pressione Enter.</li>
              <li>Abra o arquivo HTML gerado (o caminho será mostrado).</li>
            </ol>
            <p class="mt-3 text-gray-300 text-sm">Compare a <strong>Design Capacity</strong> (Capacidade Original) com a <strong>Full Charge Capacity</strong> (Capacidade Atual). Se a atual for menos de 50% da original, considere trocar a bateria.</p>
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
