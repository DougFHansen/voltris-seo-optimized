import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Kit de Sobrevivência: Programas Essenciais para Instalar no Windows";
const description = "Lista curada dos melhores softwares gratuitos e open-source para produtividade, segurança e mídia. Diga adeus ao WinRAR e conheça o 7-Zip.";
const keywords = ["programas essenciais pc","ninite","vlc alternativa","7zip vs winrar","melhores softwares gratis"];

export const metadata: Metadata = createGuideMetadata('programas-essenciais-windows', title, description, keywords);

export default function GuidePage() {
  const contentSections = [

    {
      title: "O Método Ninite",
      content: `
        <p class="mb-4 text-gray-300">Pare de baixar instaladores um por um e clicar em "Próximo" 50 vezes. Acesse <strong>ninite.com</strong>, marque os apps que quer e baixe um único instalador que faz tudo em silêncio e sem toolbars.</p>
      `,
      subsections: []
    },

    {
      title: "Lista de Ouro (Open Source & Grátis)",
      content: `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-[#171313] p-4 rounded">
              <h4 class="text-[#31A8FF] font-bold">Utilitários</h4>
              <ul class="text-gray-400 text-sm list-none space-y-2 mt-2">
                <li>📦 <strong>7-Zip:</strong> Melhor que WinRAR. Abre tudo, gratuito e sem janelas chatas.</li>
                <li>🔍 <strong>Everything:</strong> Busca arquivos no PC instantaneamente (muito melhor que a busca do Windows).</li>
                <li>📸 <strong>ShareX:</strong> A ferramenta suprema de printscreen e gravação de tela.</li>
              </ul>
            </div>
            <div class="bg-[#171313] p-4 rounded">
              <h4 class="text-[#31A8FF] font-bold">Mídia e Internet</h4>
              <ul class="text-gray-400 text-sm list-none space-y-2 mt-2">
                <li>🎥 <strong>VLC Media Player:</strong> Roda qualquer vídeo, com qualquer legenda, sem precisar de codecs.</li>
                <li>🦊 <strong>Brave ou Firefox:</strong> Alternativas focadas em privacidade ao Chrome.</li>
                <li>🎵 <strong>Spotify/Discord:</strong> Essenciais para comunicação e música.</li>
              </ul>
            </div>
          </div>
      `,
      subsections: []
    },

    {
      title: "O que NÃO instalar",
      content: `
        <div class="bg-red-900/20 p-4 rounded border border-red-500/20">
            <ul class="list-disc list-inside text-gray-300">
              <li><strong>uTorrent:</strong> Virou adware. Use <strong>qBittorrent</strong> (leve, open source, limpo).</li>
              <li><strong>Antivírus Gratuitos Pesados (Avast/McAfee):</strong> O Windows Defender já é excelente. Se quiser uma varredura extra, use Malwarebytes Free.</li>
              <li><strong>Driver Boosters:</strong> Geralmente instalam drivers errados. Baixe do site do fabricante.</li>
            </ul>
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
