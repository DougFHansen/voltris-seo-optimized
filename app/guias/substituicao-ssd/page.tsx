import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Upgrade para SSD: O Melhor Investimento para Seu PC";
const description = "Trocar o HD por um SSD deixa o PC até 10x mais rápido. Guia de instalação de SSD SATA e NVMe M.2 e como clonar seu sistema.";
const keywords = ["ssd vs hd","instalar ssd notebook","clonar hd para ssd","nvme m.2","sata 3"];

export const metadata: Metadata = createGuideMetadata(title, description, keywords);

export default function GuidePage() {
  const contentSections = [

    {
      title: "SATA vs NVMe M.2",
      content: `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
            <div class="bg-[#171313] p-4 rounded border-t-4 border-blue-500">
              <h4 class="text-white font-bold mb-1">SSD SATA (2.5")</h4>
              <p class="text-gray-400 text-xs">Formato igual a um HD de notebook. Velocidade ~550MB/s. Compatível com qualquer PC ou notebook antigo.</p>
            </div>
            <div class="bg-[#171313] p-4 rounded border-t-4 border-purple-500">
              <h4 class="text-white font-bold mb-1">NVMe M.2</h4>
              <p class="text-gray-400 text-xs">Parece um chiclete. Ligado direto na placa-mãe. Velocidades de 3500MB/s a 7000MB/s. Requer slot M.2 no PC.</p>
            </div>
          </div>
      `,
      subsections: []
    },

    {
      title: "Clonar vs Instalação Limpa",
      content: `
        <p class="mb-4 text-gray-300">Você comprou o SSD. E o Windows?</p>
          <ul class="space-y-3 text-gray-300">
            <li><strong>Clonar (Macrium Reflect):</strong> Copia seu Windows atual, programas e arquivos exatamente como estão para o SSD novo. Bom para quem não quer configurar tudo de novo.</li>
            <li><strong>Instalação Limpa (Recomendado):</strong> Começar do zero garante performance máxima e livra o sistema de lixo acumulado.</li>
          </ul>
      `,
      subsections: []
    },

    {
      title: "Dica de Instalação",
      content: `
        <p class="text-gray-300">Se for instalar um SSD M.2, cuidado com o parafuso minúsculo! Ele geralmente já vem na placa-mãe ou na caixa da placa-mãe, não com o SSD. Não aperte demais.</p>
      `,
      subsections: []
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/manutencao-preventiva",
      title: "Manutenção Preventiva",
      description: "Proteja seu hardware."
    },
    {
      href: "/guias/seguranca-digital",
      title: "Segurança Digital",
      description: "Proteja seus dados."
    },
    {
      href: "/guias/otimizacao-performance",
      title: "Performance",
      description: "Deixe seu PC mais rápido."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="20 min"
      difficultyLevel="Intermediário"
      contentSections={contentSections}
      relatedGuides={relatedGuides}
    />
  );
}
