import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Guia de Upgrade de Memória RAM: Como Escolher e Instalar";
const description = "Seu PC está lento? Mais RAM pode ser a solução. Aprenda sobre DDR3 vs DDR4 vs DDR5, frequência (MHz), latência (CL) e Dual Channel.";
const keywords = ["upgrade ram notebook","ddr4 vs ddr5","dual channel","memoria ram pc gamer","como instalar ram"];

export const metadata: Metadata = createGuideMetadata('upgrade-memoria-ram', title, description, keywords);

export default function GuidePage() {
  const contentSections = [

    {
      title: "Antes de Comprar (Compatibilidade)",
      content: `
        <div class="bg-red-900/20 p-4 border border-red-500/30 rounded mb-4">
            <h4 class="text-red-400 font-bold mb-2">⚠ Não compre errado!</h4>
            <p class="text-gray-300 text-sm">Memória de Notebook (SODIMM) não entra em Desktop (DIMM). DDR4 não encaixa em slot DDR3 ou DDR5. O encaixe é fisicamente diferente.</p>
          </div>
          <p class="text-gray-300 mb-2">Use o <strong>CPU-Z</strong> (software gratuito) para verificar o que você já tem:</p>
          <ul class="list-disc list-inside text-gray-400 text-sm">
            <li>Aba <strong>Memory:</strong> Mostra o tipo (DDR4) e a frequência atual.</li>
            <li>Aba <strong>SPD:</strong> Mostra quantos slots você tem e o que está em cada um.</li>
          </ul>
      `,
      subsections: []
    },

    {
      title: "O Segredo do Dual Channel",
      content: `
        <p class="mb-4 text-gray-300">Dois pentes de 8GB (Total 16GB) são MUITO mais rápidos que um único pente de 16GB. Isso se chama Dual Channel e dobra a largura de banda da memória.</p>
          <div class="bg-[#1E1E22] p-4 rounded border-l-4 border-green-500">
            <h4 class="text-white font-bold">Instalação Correta</h4>
            <p class="text-gray-400 text-sm">Em placas-mãe com 4 slots, você geralmente deve instalar nos slots <strong>2 e 4</strong> (pulando o 1 e 3) para ativar o Dual Channel. Consulte o manual da sua placa!</p>
          </div>
      `,
      subsections: []
    },

    {
      title: "Mitos de Frequência (XMP/DOCP)",
      content: `
        <p class="text-gray-300">Você comprou uma RAM de 3200MHz mas o PC mostra 2133MHz? Isso é normal. Você precisa entrar na BIOS e ativar o perfil <strong>XMP (Intel)</strong> ou <strong>DOCP/EXPO (AMD)</strong> para que ela rode na velocidade anunciada.</p>
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
