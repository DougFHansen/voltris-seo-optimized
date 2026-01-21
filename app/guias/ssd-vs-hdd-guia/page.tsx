import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "SSD vs HDD: Guia Definitivo de Armazenamento";
const description = "Entenda as tecnologias, saiba quando usar cada um e aprenda a migrar seu sistema para voar baixo com NVMe.";
const keywords = ["ssd vs hd","nvme vale a pena","clonar hd para ssd","tipos de ssd","instalar ssd notebook"];

export const metadata: Metadata = createGuideMetadata(title, description, keywords);

export default function GuidePage() {
  const contentSections = [
    {
      title: "Introdução e Visão Geral",
      content: `
        <p class="mb-4 text-lg text-gray-300 leading-relaxed">O upgrade de HDD para SSD é a mudança mais impactante que você pode fazer em um PC antigo. Mas qual comprar? SATA, M.2, NVMe?</p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
          <div class="bg-[#171313] p-6 rounded-xl border border-[#31A8FF]/30 hover:border-[#31A8FF]/50 transition-colors">
            <h3 class="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <span class="text-[#31A8FF]">✓</span> Benefícios
            </h3>
            <ul class="text-gray-300 space-y-2">
              <li class="flex items-start gap-2"><span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#31A8FF] flex-shrink-0"></span>Windows inicia em 10 segundos</li><li class="flex items-start gap-2"><span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#31A8FF] flex-shrink-0"></span>Jogos carregam instantaneamente</li><li class="flex items-start gap-2"><span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#31A8FF] flex-shrink-0"></span>Sistema silencioso e resistente a choques</li><li class="flex items-start gap-2"><span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#31A8FF] flex-shrink-0"></span>PC antigo parece novo</li>
            </ul>
          </div>
          <div class="bg-[#171313] p-6 rounded-xl border border-[#FF4B6B]/30 hover:border-[#FF4B6B]/50 transition-colors">
            <h3 class="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <span class="text-[#FF4B6B]">⚠</span> Requisitos
            </h3>
            <ul class="text-gray-300 space-y-2">
              <li class="flex items-start gap-2"><span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#FF4B6B] flex-shrink-0"></span>Saber o modelo da sua placa mãe</li><li class="flex items-start gap-2"><span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#FF4B6B] flex-shrink-0"></span>Chave Philips para instalação</li>
            </ul>
          </div>
        </div>
      `,
    },
    
    {
      title: "Entendendo as Tecnologias",
      content: `<p class="mb-4 text-gray-300 leading-relaxed">Não compre errado. Nem todo SSD encaixa no seu PC.</p>`,
      subsections: [
        
        {
          subtitle: "SATA vs NVMe",
          content: `
            <div class="prose prose-invert max-w-none">
              
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-[#1E1E22] p-3 rounded">
                  <strong class="text-[#31A8FF] block mb-2">SSD SATA (2.5")</strong>
                  <p class="text-sm">Velocidade: ~550 MB/s. Formato igual HD de notebook. Compatível com 99% dos PCs/Laptops antigos.</p>
                </div>
                <div class="bg-[#1E1E22] p-3 rounded">
                  <strong class="text-[#8B31FF] block mb-2">SSD NVMe (M.2)</strong>
                  <p class="text-sm">Velocidade: 3500 a 7000 MB/s. Parece um chiclete. Exige slot M.2 na placa-mãe. Essencial para PCs modernos.</p>
                </div>
              </div>
            </div>
          `
        }
      ]
    },
    
    {
      title: "Guia de Compra",
      content: `<p class="mb-4 text-gray-300 leading-relaxed"></p>`,
      subsections: [
        
      ]
    }
    ,
    {
      title: "Solução de Problemas Comuns (Troubleshooting)",
      content: `
        <div class="space-y-6">
          
          <div class="bg-[#1E1E22] p-5 rounded-lg border-l-4 border-[#8B31FF]">
            <h4 class="text-white font-bold text-lg mb-2">Instalei o SSD M.2 mas ele não aparece no Windows</h4>
            <div class="text-gray-300 text-sm pl-4 border-l border-gray-700">
              <p class="mb-2"><strong class="text-[#8B31FF]">Solução:</strong> Ele precisa ser inicializado.</p>
              <ul class="list-disc list-inside text-gray-400 mt-2">
                <li>Pressione Win+X e abra 'Gerenciamento de Disco'.</li><li>Um popup aparecerá pedindo para inicializar. Escolha GPT (para UEFI) ou MBR (para BIOS antigos).</li><li>Clique com botão direito no espaço preto > Novo Volume Simples > Avançar até o fim.</li>
              </ul>
            </div>
          </div>
          
        </div>
      `
    },
    {
      title: "Conclusão Profissional",
      content: `
        <div class="bg-gradient-to-r from-[#1E1E22] to-[#171313] p-6 rounded-xl border border-gray-800">
          <p class="mb-4 text-gray-300 leading-relaxed">
            Dominar <strong>SSD vs HDD: Guia Definitivo de Armazenamento</strong> é fundamental para garantir um ambiente digital seguro, rápido e eficiente. 
            Seguindo este guia, você aplicou configurações de nível profissional que otimizam seu fluxo de trabalho e protegem seu hardware.
          </p>
          <p class="text-gray-400 italic border-l-2 border-[#31A8FF] pl-4">
            Lembre-se: A tecnologia evolui rapidamente. Recomendamos revisar estas configurações a cada 6 meses ou sempre que houver grandes atualizações de sistema.
          </p>
        </div>
      `
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/manutencao-preventiva",
      title: "Manutenção Preventiva",
      description: "Guia completo de manutenção."
    },
    {
      href: "/guias/otimizacao-performance",
      title: "Otimização Avançada",
      description: "Técnicas de otimização de sistema."
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
