import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Guia de Compra: Como escolher o melhor Monitor Gamer em 2026";
const description = "IPS, VA, OLED ou TN? Painel curvo ou plano? Aprenda o que observar (Hertz, Tempo de Resposta e HDR) para não errar na compra do seu monitor.";
const keywords = [
  'guia de compra monitor gamer 2026',
  'monitor ips vs va vs tn qual o melhor para jogos',
  'monitor 144hz vs 240hz vale a pena 2026',
  'o que é tempo de resposta gtg e mprt monitor',
  'monitor oled gamer vale o investimento 2026'
];

export const metadata: Metadata = createGuideMetadata('guia-compra-monitores', title, description, keywords);

export default function MonitorBuyingGuide() {
  const summaryTable = [
    { label: "Painel IPS", value: "Melhores cores / Ângulos de visão" },
    { label: "Painel VA", value: "Melhor contraste / Pretos profundos" },
    { label: "Painel OLED", value: "Perfeição visual / Tempo de resposta instantâneo" },
    { label: "Hertz (Hz)", value: "Fluidez da imagem (144Hz é o novo padrão)" }
  ];

  const contentSections = [
    {
      title: "A Janela para o seu Mundo Digital",
      content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Em 2026, o monitor é a peça que mais impacta a sua experiência. Não adianta ter uma RTX 5090 se você está jogando em uma tela que borra as cores ou tem um contraste cinza. Com a popularização dos painéis **Mini-LED** e **OLED**, a escolha do painel certo para o tipo de jogo que você gosta (competitivo vs imersivo) é o passo mais importante.
        </p>
      `
    },
    {
      title: "1. A Guerra dos Painéis: Qual escolher?",
      content: `
        <ul class="list-disc list-inside text-gray-300 space-y-3">
            <li><strong>IPS:</strong> Ideal para quem joga de tudo e também trabalha com edição ou design. As cores são vibrantes e não mudam se você olhar de lado.</li>
            <li><strong>VA:</strong> Favorito para simuladores de corrida e filmes. Possui o melhor "nível de preto", mas pode sofrer com <i>Ghosting</i> (rastro preto) em movimentos muito rápidos.</li>
            <li><strong>OLED:</strong> O topo de linha. Tempo de resposta de 0.03ms. Em 2026, os problemas de <i>Burn-in</i> (manchas) foram muito reduzidos, tornando-o o sonho de qualquer gamer.</li>
        </ul>
      `
    },
    {
      title: "2. Hertz (Hz) vs Resolução",
      content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Equilíbrio Ideal:</h4>
            <p class="text-sm text-gray-300">
                - <strong>1080p (FHD):</strong> Ainda é o padrão para Pro-Players que buscam 360Hz ou mais. <br/>
                - <strong>1440p (QHD):</strong> O "sweet spot" de 2026. Oferece muito mais nitidez que o 1080p e exige menos da placa de vídeo que o 4K. Combine com 165Hz ou 240Hz. <br/>
                - <strong>4K (UHD):</strong> Reservado para telas de 27" ou maiores, focado em imersão total e consoles de última geração.
            </p>
        </div>
      `
    },
    {
      title: "3. O que é Adaptive Sync (G-Sync e FreeSync)?",
      content: `
        <p class="mb-4 text-gray-300">
            Sempre compre um monitor que tenha um destes dois. Eles sincronizam a taxa de atualização do monitor com o FPS da sua placa de vídeo. Isso elimina o <strong>Tearing</strong> (aqueles cortes horizontais na imagem) e deixa o jogo parecendo fluido mesmo quando o seu FPS oscila um pouco.
        </p>
      `
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/calibrar-cores-monitor",
      title: "Calibrar Monitor",
      description: "Ajuste as cores após a compra."
    },
    {
      href: "/guias/hdr-windows-vale-a-pena-jogos",
      title: "HDR no Windows",
      description: "Saiba se seu monitor novo tem um bom HDR."
    },
    {
      href: "/guias/hdmi-2.1-vs-displayport-1.4-diferencas",
      title: "HDMI vs DisplayPort",
      description: "Qual cabo usar no seu monitor novo."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="25 min"
      difficultyLevel="Intermediário"
      contentSections={contentSections}
      summaryTable={summaryTable}
      relatedGuides={relatedGuides}
    />
  );
}
