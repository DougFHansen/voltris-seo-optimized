import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'hdmi-2.1-vs-displayport-1.4-diferencas',
  title: "HDMI 2.1 vs DisplayPort 2.1: Qual usar no seu Monitor em 2026?",
  description: "Confuso sobre qual cabo usar? Aprenda as diferenças reais entre HDMI e DisplayPort para atingir 144Hz, 240Hz ou 4K no seu PC gamer em 2026.",
  category: 'windows-geral',
  difficulty: 'Intermediário',
  time: '10 min'
};

const title = "HDMI 2.1 vs DisplayPort 2.1: Qual usar no seu Monitor em 2026?";
const description = "Confuso sobre qual cabo usar? Aprenda as diferenças reais entre HDMI e DisplayPort para atingir 144Hz, 240Hz ou 4K no seu PC gamer em 2026.";
const keywords = [
    'hdmi 2.1 vs displayport 1.4 diferença 2026',
    'qual cabo usar para 144hz hdmi ou displayport',
    'hdmi 2.1 suporte 4k 120hz tutorial',
    'displayport 2.1 vale a pena para gamers 2026',
    'melhor cabo para g-sync e freesync guia'
];

export const metadata: Metadata = createGuideMetadata('hdmi-2.1-vs-displayport-1.4-diferencas', title, description, keywords);

export default function CableComparisonGuide() {
    const summaryTable = [
        { label: "HDMI 2.1", value: "Melhor para Consoles (PS5/Xbox) e TVs 4K" },
        { label: "DisplayPort 1.4/2.1", value: "Melhor para PCs / Suporte total G-Sync" },
        { label: "Banda HDMI 2.1", value: "48 Gbps" },
        { label: "Banda DP 2.1", value: "Até 80 Gbps" }
    ];

    const contentSections = [
        {
            title: "O Cabo: O Gargalo que ninguém vê",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Você comprou um monitor de 240Hz, mas ele só aparece como 60Hz nas configurações do Windows? O culpado quase sempre é o cabo. Em 2026, com o avanço das resoluções 4K e das taxas de atualização altíssimas, o "fio" que liga sua placa de vídeo ao monitor precisa ter banda suficiente para carregar todos esses dados. Usar um cabo HDMI antigo em um monitor moderno é como tentar passar um oceano por um canudo.
        </p>
      `
        },
        {
            title: "1. HDMI 2.1: A unificação com a Sala",
            content: `
        <p class="mb-4 text-gray-300">O HDMI 2.1 se tornou o padrão ouro para quem joga em resoluções altas:</p>
        <ul class="list-disc list-inside text-gray-300 space-y-3">
            <li><strong>Resolução:</strong> Suporta até 4K a 120Hz ou 8K a 60Hz.</li>
            <li><strong>Recursos:</strong> Possui o <strong>eARC</strong> (para som de alta fidelidade) e o <strong>ALLM</strong> (Modo de Baixa Latência Automático).</li>
            <li><strong>Ideal para:</strong> Conectar seu PC ou Console em uma TV OLED ou monitor de 2026 que suporte a versão 2.1.</li>
        </ul>
      `
        },
        {
            title: "2. DisplayPort: O Rei do Desktop",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Por que ainda é o favorito?</h4>
            <p class="text-sm text-gray-300">
                O DisplayPort foi feito pensando em computadores. Em 2026, a versão <strong>DP 2.1</strong> permite rodar múltiplos monitores de alta resolução em série (Daisy Chain) usando um único cabo. Além disso, se você usa uma placa NVIDIA e quer garantir que o <strong>G-Sync</strong> funcione perfeitamente sem falhas de imagem, o DisplayPort continua sendo a conexão mais estável.
            </p>
        </div>
      `
        },
        {
            title: "3. Cuidado com o Marketing: 'Cabo 8K'",
            content: `
        <p class="mb-4 text-gray-300">
            Muitas empresas vendem cabos baratos com selos de "8K" que, na verdade, são apenas HDMI 2.0 com uma embalagem bonita. 
            <br/>Sempre procure pela certificação <strong>'Ultra High Speed HDMI'</strong> para o HDMI 2.1 ou <strong>'DP80'</strong> para o DisplayPort 2.1. Um cabo de má qualidade pode causar "chuviscos" na imagem, perda de sinal intermitente ou impedir que você ative o HDR.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/guia-compra-monitores",
            title: "Guia de Monitores",
            description: "Escolha o monitor compatível com seus cabos."
        },
        {
            href: "/guias/calibrar-cores-monitor",
            title: "Calibrar Cores",
            description: "Melhore a imagem após conectar."
        },
        {
            href: "/guias/hdr-windows-vale-a-pena-jogos",
            title: "HDR Windows",
            description: "Ative o HDR via cabo certificado."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="10 min"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
