import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Como Calibrar as Cores do Monitor em 2026 (Guia Completo)";
const description = "Sente que as cores do seu monitor estão 'lavadas' ou amareladas? Aprenda como calibrar o Windows 11 para ter cores reais e vibrantes em 2026.";
const keywords = [
    'como calibrar cores monitor windows 11 2026',
    'ajustar brilho e contraste monitor guia tutorial',
    'melhorar cores monitor gamer windows 11 guia',
    'perfil icc como instalar e configurar monitor 2026',
    'calibrar monitor para design e fotografia tutorial'
];

export const metadata: Metadata = createGuideMetadata('calibrar-cores-monitor', title, description, keywords);

export default function MonitorCalibrationGuide() {
    const summaryTable = [
        { label: "Ferramenta Nativa", value: "Calibração de Cores do Windows (dccw)" },
        { label: "Check Vital", value: "Ajuste de Gamma e Contraste" },
        { label: "Uso Profissional", value: "Perfis ICC específicos do modelo" },
        { label: "Dificuldade", value: "Fácil" }
    ];

    const contentSections = [
        {
            title: "Por que as cores parecem erradas?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Muitas vezes, ao tirar o monitor da caixa, o fabricante o configura com brilho exagerado para "chamar a atenção" em prateleiras de lojas. No uso diário em 2026, isso causa cansaço visual e distorce a realidade de fotos e vídeos. Calibrar o monitor garante que o vermelho que você vê na tela seja o mesmo vermelho que sairá na impressão ou que o criador do jogo planejou que você visse.
        </p>
      `
        },
        {
            title: "1. Calibração Nativa do Windows 11",
            content: `
        <p class="mb-4 text-gray-300">O Windows tem uma ferramenta excelente escondida nos menus:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Aperte <code>Win + R</code>, digite <strong>dccw</strong> e dê Enter.</li>
            <li>Siga as instruções na tela. O ponto mais importante é o **Gamma**: ajuste até que o círculo no centro dos pontos desapareça.</li>
            <li>Ajuste o Brilho e Contraste usando os botões físicos do seu monitor conforme solicitado pelas imagens de referência.</li>
            <li>Ao final, use o <strong>ClearType</strong> para garantir que os textos fiquem nítidos e fáceis de ler.</li>
        </ol>
      `
        },
        {
            title: "2. Perfis ICC: O \"DNA\" do seu Monitor",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Upgrade Profissional:</h4>
            <p class="text-sm text-gray-300">
                Muitos monitores (especialmente os da Dell, LG e Samsung) possuem **Perfis de Cores (ICC)** oficiais no site do fabricante. <br/><br/>
                Baixe e instale esse perfil em 'Gerenciamento de Cores' no Windows. Isso aplica tabelas de tradução de cores precisas feitas em laboratório para o seu painel específico, corrigindo distorções de fábrica que softwares comuns não conseguem enxergar.
            </p>
        </div>
      `
        },
        {
            title: "3. Luz Noturna e HDR em 2026",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>Dica de Conforto:</strong> 
            <br/><br/>Se você trabalha à noite, ative a **Luz Noturna** para reduzir o azul da tela, que prejudica o sono. Se o seu monitor for HDR, certifique-se de usar o aplicativo **Windows HDR Calibration** (disponível na Microsoft Store em 2026) para ajustar os pontos de branco e preto máximo, evitando que a imagem fique "lavada" em jogos e filmes.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/guia-compra-monitores",
            title: "Escolher Monitor",
            description: "Diferenças entre painéis IPS, VA e TN."
        },
        {
            href: "/guias/hdr-windows-vale-a-pena-jogos",
            title: "Guia de HDR",
            description: "Como aproveitar o alto brilho do monitor."
        },
        {
            href: "/guias/segundo-monitor-vertical-configurar",
            title: "Monitor Vertical",
            description: "Dicas de alinhamento e cores entre telas."
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
