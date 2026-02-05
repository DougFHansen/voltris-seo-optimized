import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'programas-essenciais-windows',
  title: "Programas Essenciais para Windows 11: O Pack Básico 2026",
  description: "Acabou de formatar o PC? Confira a lista definitiva de softwares gratuitos e essenciais para produtividade, segurança e manutenção no Windows 11 em 20...",
  category: 'software',
  difficulty: 'Intermediário',
  time: '20 min'
};

const title = "Programas Essenciais para Windows 11: O Pack Básico 2026";
const description = "Acabou de formatar o PC? Confira a lista definitiva de softwares gratuitos e essenciais para produtividade, segurança e manutenção no Windows 11 em 2026.";
const keywords = [
  'melhores programas essenciais windows 11 2026',
  'lista de softwares indispensaveis pc novo tutorial',
  'programas gratuitos para produtividade windows guia 2026',
  'o que instalar primeiro no windows 11 checklist',
  'ferramentas de manutenção pc gamer essenciais 2026'
];

export const metadata: Metadata = createGuideMetadata('programas-essenciais-windows', title, description, keywords);

export default function EssentialProgramsGuide() {
  const summaryTable = [
    { label: "Navegação", value: "Brave ou Firefox (Privacidade)" },
    { label: "Compactação", value: "7-Zip ou NanaZip" },
    { label: "Mídia", value: "VLC ou PotPlayer" },
    { label: "Manutenção", value: "BleachBit (Alternativa ao CCleaner)" }
  ];

  const contentSections = [
    {
      title: "O que não pode faltar no seu PC?",
      content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Montar a sua "caixa de ferramentas" digital é o primeiro passo após ligar um PC novo. Em 2026, fugimos de programas pesados e cheios de anúncios. O foco agora é **velocidade, privacidade e leveza**. Aqui estão os softwares que todo usuário de Windows 11 deveria ter instalado para garantir que o computador funcione de forma inteligente e sem estresse.
        </p>
      `
    },
    {
      title: "1. Utilidade Geral e Sistema",
      content: `
        <p class="mb-4 text-gray-300">Ferramentas que preenchem as lacunas do Windows:</p>
        <ul class="list-disc list-inside text-gray-300 space-y-3">
            <li><strong>7-Zip / NanaZip:</strong> Abra qualquer arquivo compactado (.zip, .rar, .7z) sem propagandas e com velocidade máxima.</li>
            <li><strong>Everything (Voidtools):</strong> Uma barra de busca que encontra qualquer arquivo no seu PC instantaneamente.</li>
            <li><strong>Microsoft PowerToys:</strong> Um pacote de mini-ferramentas da própria Microsoft que adiciona funções de produtividade avançadas.</li>
        </ul >
      `
    },
    {
      title: "2. Multimídia e Visualização",
      content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Para ver e ouvir:</h4>
            <p class="text-sm text-gray-300">
                - <strong>VLC Media Player:</strong> O clássico que roda qualquer formato de vídeo sem precisar de codecs. <br/>
                - <strong>IrfanView / HoneyView:</strong> Visualizadores de fotos que abrem imagens pesadas 10x mais rápido que o app nativo do Windows. <br/>
                - <strong>Spotify / Tidal:</strong> Para música, dependendo da sua preferência de qualidade sonora.
            </p>
        </div>
      `
    },
    {
      title: "3. Segurança e Manutenção Proativa",
      content: `
        <p class="mb-4 text-gray-300">
            Mantenha o seu sistema saudável sem gastar energia:
            <br/><br/><strong>Dica de 2026:</strong> Esqueça o CCleaner. Use o <strong>BleachBit</strong> (código aberto) para limpar arquivos temporários. Para desinstalar programas de verdade (removendo até as sobras do registro), use o <strong>Revo Uninstaller</strong>. E para segurança, o **Bitwarden** é o melhor gerenciador de senhas gratuito para manter suas contas protegidas.
        </p>
      `
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/pos-instalacao-windows-11",
      title: "Pós-Instalação",
      description: "Checklist de configuração do sistema."
    },
    {
      href: "/guias/seguranca-senhas-gerenciadores",
      title: "Gestão de Senhas",
      description: "Por que usar o Bitwarden em 2026."
    },
    {
      href: "/guias/vlc-media-player-vs-potplayer",
      title: "VLC vs PotPlayer",
      description: "Comparativo de players de vídeo."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="20 min"
      difficultyLevel="Iniciante"
      contentSections={contentSections}
      summaryTable={summaryTable}
      relatedGuides={relatedGuides}
    />
  );
}
