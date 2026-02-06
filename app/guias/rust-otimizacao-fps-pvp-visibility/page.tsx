import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'rust-otimizacao-fps-pvp-visibility',
    title: "Rust (2026): Comandos de Console, FPS e Visibilidade PvP",
    description: "Rust é impiedoso. Se você travar no PvP, perdeu o loot. Guia de gc.buffer (limpar RAM), comandos de console para ver melhor e configuração de áudio.",
    category: 'jogos',
    difficulty: 'Avançado',
    time: '25 min'
};

const title = "Rust Optimization (2026): Zero Stutter PvP";
const description = "O problema do Rust não é FPS baixo, é a travada (freeze) na hora do tiro. Vamos configurar o Garbage Collection e gráficos para eliminar isso.";

const keywords = [
    'rust fps boost commands console',
    'gc.buffer rust command ram fix',
    'melhores configurações graficas rust pvp',
    'ver no escuro rust nvidia filter',
    'rust stuttering gunfight fix',
    'dlss rust vale a pena',
    'max tree meshes rust performance',
    'fps limit rust menu',
    'voltris optimizer facepunch',
    'rust load demorado ssd'
];

export const metadata: Metadata = createGuideMetadata('rust-otimizacao-fps-pvp-visibility', title, description, keywords);

export default function RustGuide() {
    const summaryTable = [
        { label: "Console", value: "F1 (Comandos)" },
        { label: "GC Buffer", value: "2048 ou 4096" },
        { label: "Graphics", value: "3 ou 4" },
        { label: "Shadows", value: "1 (Mínimo)" },
        { label: "Draw Distance", value: "1500 (Players)" },
        { label: "DLSS", value: "Quality" },
        { label: "Water", value: "0 (Reflexos)" }
    ];

    const contentSections = [
        {
            title: "Introdução: O Perigo do Garbage Collection",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O Rust (Unity) acumula "lixo" na memória RAM. Quando o limite enche, o jogo trava por 1 segundo para limpar. Isso geralmente acontece no meio do tiroteio. A solução é aumentar o buffer.
        </p>
      `
        },
        {
            title: "Capítulo 1: Comandos de Console (Obrigatórios)",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Aperte F1 e digite:</h4>
                <p class="text-gray-400 text-xs text-justify">
                    <code>gc.buffer 2048</code> (Se tiver 16GB RAM) ou <code>4096</code> (Se 32GB).
                    <br/>Isso aumenta o intervalo entre as limpezas de memória. Em vez de travar a cada 5 minutos, trava a cada 1 hora (provavelmente quando você estiver na base).
                    <br/><code>global.censor 1</code> (Oculta nudez, menos polígonos).
                    <br/><code>perf 1</code> (Mostra FPS).
                </p>
            </div>
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Salvar na Inicialização</h4>
                <p class="text-gray-400 text-xs">
                    Para não digitar sempre: <code>writecfg</code> após digitar os comandos. O jogo salva no seu arquivo de config.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Settings Gráficos PvP",
            content: `
        <p class="mb-4 text-gray-300">
            - <strong>Graphics Quality:</strong> 3 ou 4. (0 é horrível e não te deixa ver inimigos longe através de frestas).
            - <strong>Water Quality:</strong> 0. Ninguém precisa ver água bonita, só inimigos nadando.
            - <strong>Shadow Quality:</strong> 1. Só o necessário em interiores.
            - <strong>Draw Distance:</strong> 1500. Jogadores param de renderizar depois dessa distância de qualquer jeito. 2500 é desperdício.
        </p>
      `
        },
        {
            title: "Capítulo 3: Mesh Quality (Árvores e Bases)",
            content: `
        <p class="mb-4 text-gray-300">
            - <strong>Tree Meshes:</strong> 50-100. (Máximo deixa a floresta densa e difícil de ver gente escondida. Mínimo deixa as árvores feias "sprites 2D").
            - <strong>Particle Quality:</strong> Low. Reduz lag em explosões de C4 durante Raid.
            - <strong>Object Quality:</strong> 100. Importante para ver skins de portas e armadilhas.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: DLSS e Visibilidade",
            content: `
        <p class="mb-4 text-gray-300">
            - <strong>DLSS:</strong> Em Rust, DLSS às vezes causa borrão em movimento rápido. Muitos pros preferem DLSS OFF + TSS AA ou SMAA. Teste "DLSS Quality".
            - <strong>Nvidia Reflex:</strong> On + Boost. Sempre.
        </p>
      `
        },
        {
            title: "Capítulo 5: Som e Audio Settings",
            content: `
        <p class="mb-4 text-gray-300">
            - <strong>Speaker Mode:</strong> Stereo. (7.1 virtual estraga a noção de direção).
            - Aumente o volume dos passos (se usar Equalizador) e diminua sons de ambiente (vento). Rust tem muito barulho de vento irritante.
        </p>
      `
        },
        {
            title: "Capítulo 6: Opções Experimentais (Experimental)",
            content: `
        <p class="mb-4 text-gray-300">
            - <strong>Optimized Loading:</strong> Partial.
            - <strong>Occlusion Culling:</strong> ON. (Não renderiza o que está atrás de paredes). <strong>Crucial</strong> para FPS dentro de bases gigantes. Se você desligar isso, seu PC renderiza todo o loot dentro dos baús dos vizinhos.
        </p>
      `
        },
        {
            title: "Capítulo 7: Launch Options Steam",
            content: `
        <p class="mb-4 text-gray-300">
            Botão direito no Rust > Propriedades > Launch Options:
            <br/><code>-high -maxMem=16384 -malloc=system -force-feature-level-11-0</code>
            <br/>(Ajuste maxMem para sua RAM em MB). Força DX11 e alocação de memória Windows.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: Ver no Escuro (Nvidia Filter)",
            content: `
            <p class="mb-4 text-gray-300">
                A noite no Rust é "True Black" (pixel 0,0,0) para impedir gamma hacking.
                <br/>Filtros Nvidia não funcionam mais para ver no breu total. Use a noite para craftar na base ou use Óculos de Visão Noturna in-game. Não tente burlar, você só vai deixar seu monitor cinza sem ver nada.
            </p>
            `
        },
        {
            title: "Capítulo 9: SSD NVMe (Loading Asset Warmup)",
            content: `
            <p class="mb-4 text-gray-300">
                O "Asset Warmup" no loading demora 5 minutos em HD e 30 segundos em SSD.
                <br/>Se seu jogo cai no meio da raid, voltar rápido é vida ou morte. Instale no SSD mais rápido que tiver.
            </p>
            `
        },
        {
            title: "Capítulo 10: Skins (Download)",
            content: `
            <p class="mb-4 text-gray-300">
                <code>graphics.itemskins 0</code> no console se sua internet for lenta.
                <br/>Isso impede o download de skins da Steam Workshop durante o jogo, economizando banda e reduzindo stutters quando alguém aparece com skin nova.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Quanto de RAM precisa pra rodar bem?",
            answer: "10GB é o mínimo absoluto. 16GB é o padrão. 32GB é o recomendado para não ter stutter nenhum."
        },
        {
            question: "Servidor Oficial vs Modded?",
            answer: "Modded (3x, 5x) tem mais construções e plugins, pesando mais a CPU. Oficial é mais limpo, mas o grind é maior. Para testar FPS, entre num servidor 'UKN Aim Train'."
        },
        {
            question: "Unity Crash aleatório?",
            answer: "Geralmente é Overclock de memória RAM instável (XMP). Rust é muito sensível a erros de RAM. Tente baixar a frequência da RAM um pouco."
        }
    ];

    const externalReferences = [
        { name: "RustLabs (Item Stats)", url: "https://rustlabs.com/" },
        { name: "BattleMetrics (Servers)", url: "https://www.battlemetrics.com/servers/rust" }
    ];

    const relatedGuides = [
        {
            href: "/guias/otimizacao-ssd-windows-11",
            title: "SSD",
            description: "Asset Warmup speed."
        },
        {
            href: "/guias/bios-otimizacao-xmp-tpm",
            title: "BIOS",
            description: "RAM Estável."
        },
        {
            href: "/guias/windows-defender-otimizacao-jogos",
            title: "Defender",
            description: "Exclusão da pasta Steam."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="25 min"
            difficultyLevel="Avançado"
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
