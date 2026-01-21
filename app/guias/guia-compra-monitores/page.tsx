import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Guia Definitivo para Comprar Monitores: Hz, IPS, TN e Resolução";
const description = "Não compre o monitor errado! Entenda as diferenças entre painéis IPS, VA e TN, o que é taxa de atualização (Hz) e tempo de resposta.";
const keywords = ["monitor 144hz","painel ips vs va","tempo de resposta 1ms","monitor gamer custo beneficio","hdr vale a pena"];

export const metadata: Metadata = createGuideMetadata(title, description, keywords);

export default function GuidePage() {
  const contentSections = [

    {
      title: "A Trindade dos Painéis: IPS vs VA vs TN",
      content: `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
            <div class="bg-[#171313] p-4 rounded border-t-4 border-green-500">
              <h4 class="text-white font-bold mb-2">IPS (In-Plane Switching)</h4>
              <p class="text-gray-400 text-xs">Cores incríveis e melhores ângulos de visão. O 'queridinho' atual. Antes era lento, hoje já existem IPS rápidos (Fast IPS).</p>
            </div>
            <div class="bg-[#171313] p-4 rounded border-t-4 border-yellow-500">
              <h4 class="text-white font-bold mb-2">VA (Vertical Alignment)</h4>
              <p class="text-gray-400 text-xs">Melhor contraste (pretos profundos). Comum em telas curvas. Pode ter 'Ghosting' (rastro) em movimentos rápidos escuros.</p>
            </div>
            <div class="bg-[#171313] p-4 rounded border-t-4 border-red-500">
              <h4 class="text-white font-bold mb-2">TN (Twisted Nematic)</h4>
              <p class="text-gray-400 text-xs">O mais rápido e barato. Cores lavadas e ângulos de visão ruins. Só compre se for eSports hardcore com orçamento baixo.</p>
            </div>
          </div>
      `,
      subsections: []
    },

    {
      title: "Resolução vs Tamanho Ideal (PPI)",
      content: `
        <p class="mb-4 text-gray-300">A nitidez depende da densidade de pixels (PPI). Regra prática:</p>
          <ul class="space-y-2 text-gray-300">
            <li><strong>24 polegadas:</strong> 1080p (Full HD) é perfeito.</li>
            <li><strong>27 polegadas:</strong> 1440p (Quad HD) é o ideal. 1080p aqui começa a ficar pixelado.</li>
            <li><strong>32 polegadas ou mais:</strong> 4K (Ultra HD) é recomendado.</li>
          </ul>
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
      href: "/guias/rede-domestica",
      title: "Redes Domésticas",
      description: "Melhore sua conexão WiFi."
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
      estimatedTime="10-15 min"
      difficultyLevel="Iniciante"
      contentSections={contentSections}
      relatedGuides={relatedGuides}
    />
  );
}
