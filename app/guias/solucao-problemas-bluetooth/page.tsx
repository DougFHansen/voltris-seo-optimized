import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Bluetooth não conecta ou desapareceu? Soluções Definitivas";
const description = "Fone Bluetooth falhando ou ícone sumiu? Aprenda a reinstalar drivers, reiniciar serviços e resolver interferências de sinal.";
const keywords = ["bluetooth sumiu windows","fone bluetooth picotando","driver bluetooth intel","emparelhamento falhou"];

export const metadata: Metadata = createGuideMetadata(title, description, keywords);

export default function GuidePage() {
  const contentSections = [

    {
      title: "Ícone do Bluetooth Sumiu?",
      content: `
        <p class="mb-4 text-gray-300">Isso geralmente é um 'Soft Lock' do driver ou eletricidade estática.</p>
          <div class="bg-[#1E1E22] p-4 rounded border-l-4 border-yellow-500">
            <h4 class="text-white font-bold mb-2">A Solução 'Mágica' (Power Flush)</h4>
            <p class="text-gray-400 text-sm">Para notebooks: Desligue, tire da tomada. Segure o botão Power por 30 segundos. Ligue novamente.</p>
            <p class="text-gray-400 text-sm mt-2">Para Desktops: Desligue a fonte no botão traseiro, espere 30s, ligue de volta.</p>
          </div>
      `,
      subsections: []
    },

    {
      title: "Interferência de 2.4GHz",
      content: `
        <p class="text-gray-300">Bluetooth usa a mesma frequência (2.4GHz) que o Wi-Fi antigo e micro-ondas. Se seu áudio picota:</p>
          <ul class="list-disc list-inside text-gray-400 text-sm">
            <li>Afaste o receptor Bluetooth do roteador Wi-Fi.</li>
            <li>Conecte o PC no Wi-Fi 5GHz em vez do 2.4GHz.</li>
            <li>Se usar dongle USB, use uma extensão USB para afastá-lo da porta do PC (USB 3.0 gera interferência em 2.4GHz bem na porta).</li>
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
