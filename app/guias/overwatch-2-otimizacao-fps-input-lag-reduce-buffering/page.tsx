import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'overwatch-2-otimizacao-fps-input-lag-reduce-buffering',
    title: "Overwatch 2 (2026): Otimização Competitiva (600 FPS)",
    description: "Guia definitivo para Overwatch 2. Configurações de Render Scale, Reduce Buffering, Nvidia Reflex e como reduzir o Input Lag ao mínimo absoluto.",
    category: 'otimizacao',
    difficulty: 'Intermediário',
    time: '15 min'
};

const title = "Overwatch 2 Pro Guide: FPS e Visibilidade";
const description = "Overwatch é um jogo caótico. Para subir de elo (Grandmaster), você precisa ver o que está acontecendo e reagir rápido. Aprenda os segredos gráficos que os profissionais da OWL usam.";

const keywords = [
    'overwatch 2 reduce buffering on or off',
    'melhores configurações graficas ow2 competitivo',
    'render scale 75 vs 100 visibility',
    'travar fps ajuda input lag overwatch',
    'nvidia reflex on + boost ow2',
    'som dolby atmos for headphones vale a pena',
    'voltris optimizer fps',
    'sim delay ow2 netgraph'
];

export const metadata: Metadata = createGuideMetadata('overwatch-2-otimizacao-fps-input-lag-reduce-buffering', title, description, keywords);

export default function OW2Guide() {
    const summaryTable = [
        { label: "Render Scale", value: "75% (1080p) / Dynamic Off" },
        { label: "Texture", value: "Medium (Melhor clareza)" },
        { label: "Buffering", value: "Reduce Buffering ON" },
        { label: "Reflex", value: "On + Boost" },
        { label: "FPS Cap", value: "Display Based / Custom" },
        { label: "Áudio", value: "Dolby Atmos ou Night Mode" },
        { label: "FOV", value: "103 (Máximo)" }
    ];

    const contentSections = [
        {
            title: "Introdução: O Mito dos Detalhes",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Em Overwatch, gráficos bonitos atrapalham. Efeitos de explosão, neblina e sombras poluem a tela.
          <br/>O objetivo aqui é deixar o jogo "limpo" (outline vermelho dos inimigos bem visível) e com o menor atraso de mouse possível.
        </p>
      `
        },
        {
            title: "Capítulo 1: Configurações de Vídeo (Video Settings)",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Video Basic</h4>
                <p class="text-gray-400 text-xs text-justify">
                    - <strong>Field of View (FOV):</strong> 103. Sempre.
                    - <strong>V-Sync:</strong> OFF. (Crime competitivo).
                    - <strong>Triple Buffering:</strong> OFF.
                    - <strong>Reduce Buffering:</strong> ON. (Importante: Se o jogo travar/alt-tab, essa opção buga. Desligue e ligue de novo para "limpar" o buffer).
                    - <strong>Nvidia Reflex:</strong> Enabled + Boost. (Reduz latência da GPU em 30%).
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Advanced Graphics (Visual Limpo)",
            content: `
        <p class="mb-4 text-gray-300">
            - <strong>Texture Quality:</strong> Medium (High gasta VRAM à toa, Low deixa borrado. Medium é o equilíbrio).
            - <strong>Texture Filtering:</strong> High/Ultra 16x (Custo zero, melhora texturas inclinadas).
            - <strong>Local Fog Detail:</strong> LOW. (Remove a neblina que esconde inimigos longe).
            - <strong>Dynamic Reflections:</strong> OFF. (Reflexos comem 30% do FPS).
            - <strong>Shadow Detail:</strong> OFF ou Medium. (Sem sombras ganha mais FPS, mas Medium ajuda a ver sombras de inimigos voando como Pharah).
            - <strong>Effects Detail:</strong> LOW. (Reduz o brilho das ultimates para você não ficar cego).
            - <strong>Model Detail:</strong> LOW. (Remove arbustos do mapa que atrapalham a visão).
        </p>
      `
        },
        {
            title: "Capítulo 3: Render Scale e FSR",
            content: `
        <p class="mb-4 text-gray-300">
            Nunca use "Automatic". Defina como <strong>Custom</strong>.
            <br/>- <strong>100%:</strong> Imagem nativa. Ideal se sua GPU aguenta 200+ FPS.
            <br/>- <strong>75%:</strong> Profissionais usam muito. Deixa o outline vermelho do inimigo "mais grosso" (placebo visual) e ganha muito FPS.
            <br/>- <strong>FSR 1.0/2.2:</strong> Evite. Adiciona input lag e ruído visual. Overwatch deve ser nítido.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: Limitando FPS (SIM Delay)",
            content: `
        <p class="mb-4 text-gray-300">
            Pressione Ctrl+Shift+N no jogo. Veja o valor "SIM" (Simulation Delay).
            <br/>Se seu FPS flutua (300 -> 150 -> 400), o SIM varia e sua mira fica inconsistente (muscle memory falha).
            <br/>Trave o FPS num valor que seu PC ATINJA SEMPRE (ex: 200).
            <br/>Uma linha reta de FPS é melhor que picos altos instáveis.
        </p>
      `
        },
        {
            title: "Capítulo 5: Áudio (Dolby vs Windows)",
            content: `
        <p class="mb-4 text-gray-300">
            O OW2 tem processamento binaural nativo.
            <br/>Opção 1: Ligue "Dolby Atmos for Headphones" no jogo e DESLIGUE qualquer surround do Windows/Headset.
            <br/>Opção 2: Desligue no jogo e use seu software de preferência.
            <br/>Recomendamos a Opção 1. O som é posicional verticalmente (você ouve o Genji pulando em cima da sua cabeça).
        </p>
      `
        },
        {
            title: "Capítulo 6: Gameplay Settings",
            content: `
        <p class="mb-4 text-gray-300">
            - <strong>Outline Opacity:</strong> 100%.
            - <strong>Enemy UI Color:</strong> Padrão (Vermelho) ou Amarelo (Deuteranopia) - O amarelo destaca muito mais em mapas escuros.
            - <strong>Waypoints Opacity:</strong> Reduza para 50% para o ícone do objetivo não tampar inimigos.
        </p>
      `
        },
        {
            title: "Capítulo 7: Mouse (High Precision)",
            content: `
        <p class="mb-4 text-gray-300">
            OW2 usa "Raw Input" nativo.
            <br/>Evite DPIs extremos (16000). Use 800 ou 1600 e ajuste a Sensitivity no jogo.
            <br/>eDPI comum de pro players: 3200 a 4800 (ex: 800 DPI x 5 Sens).
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: Network (High Precision Mouse Input)",
            content: `
            <p class="mb-4 text-gray-300">
                Uma opção escondida em Gameplay.
                <br/>Ative "Enable High Precision Mouse Input".
                <br/>Isso faz o jogo ler o mouse entre os frames de renderização (sub-frame), essencial para Hitscan (Widow/Cassidy).
            </p>
            `
        },
        {
            title: "Capítulo 9: Crash de Render Device Lost",
            content: `
            <p class="mb-4 text-gray-300">
                Se seu jogo fecha com erro "Render Device Lost":
                <br/>É geralmente Overclock instável de GPU ou memória RAM. O Overwatch é extremamente sensível a instabilidade de RAM. Remova o XMP se continuar crashando.
            </p>
            `
        },
        {
            title: "Capítulo 10: Battle.net App",
            content: `
            <p class="mb-4 text-gray-300">
                Configure o launcher da Battle.net para "Fechar completamente ao iniciar o jogo".
                <br/>Ele consome CPU em segundo plano à toa (Electron app).
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Tela embaçada?",
            answer: "Verifique se o Render Scale não está em 'Automatic' (que às vezes cai para 50%). Coloque 'Custom' e '100%'."
        },
        {
            question: "Qual melhor mira?",
            answer: "Ponto (Dot) verde ou ciano, tamanho 4 a 6. Ocupa menos espaço na tela e o verde contrasta com tudo (exceto grama, que quase não tem no OW)."
        }
    ];

    const externalReferences = [
        { name: "Overwatch Settings Pro List", url: "https://prosettings.net/lists/overwatch-2/" },
        { name: "Blizzard Support - Render Device Lost", url: "https://us.battle.net/support/en/article/32553" }
    ];

    const relatedGuides = [
        {
            href: "/guias/monitor-hz-configuracao-correta",
            title: "Monitores",
            description: "240Hz/360Hz."
        },
        {
            href: "/guias/mouse-otimizacao-windows-precisao",
            title: "Mouse",
            description: "Reduzir delay."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="15 min"
            difficultyLevel="Intermediário"
            contentSections={contentSections}
            advancedContentSections={advancedContentSections}
            additionalContentSections={additionalContentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
            faqItems={faqItems}
            externalReferences={externalReferences}
        />
    );
}
