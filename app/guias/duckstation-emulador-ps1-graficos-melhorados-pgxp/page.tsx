import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'duckstation-emulador-ps1-graficos-melhorados-pgxp',
    title: "DuckStation (2026): O Melhor Emulador de PS1 (4K + PGXP)",
    description: "Esqueça o ePSXe. O DuckStation corrige o 'tremido' dos gráficos de PS1 (PGXP), roda em 4K e carrega instantâneo. Guia completo de configuração.",
    category: 'emulacao',
    difficulty: 'Iniciante',
    time: '15 min'
};

const title = "DuckStation: A Revolução do PS1";
const description = "O DuckStation modernizou a emulação de PS1. Interface limpa, correção de geometria (geometria instável nunca mais) e performance absurda até em celular.";

const keywords = [
    'duckstation vs epsxe qual o melhor',
    'pgxp geometry correction settings duckstation',
    'resident evil 3 duckstation hd texture',
    'como configurar controle duckstation',
    'duckstation save state hotkeys',
    'jogar driver 2 sem lag ps1',
    'voltris optimizer retro',
    'chd vs bin cue compression'
];

export const metadata: Metadata = createGuideMetadata('duckstation-emulador-ps1-graficos-melhorados-pgxp', title, description, keywords);

export default function DuckStationGuide() {
    const summaryTable = [
        { label: "Renderer", value: "Vulkan / D3D11" },
        { label: "Internal Res", value: "4x (1080p) a 9x (4K)" },
        { label: "PGXP Geometry", value: "ON (Correção Tremido)" },
        { label: "Texture filtering", value: "xBRZ (Opcional)" },
        { label: "Widescreen Hack", value: "ON (Cuidado com Culling)" },
        { label: "Formato", value: ".CHD (Compressão)" },
        { label: "Rewind", value: "ON" }
    ];

    const contentSections = [
        {
            title: "Introdução: Adeus ePSXe",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O ePSXe usa plugins antigos de 2010. O DuckStation é um emulador moderno, "All-in-One", que não precisa baixar plugins de vídeo/áudio separados. E tem o recurso matador: PGXP.
        </p>
      `
        },
        {
            title: "Capítulo 1: PGXP (Correção de Geometria)",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Acabando com o "Wobbly"</h4>
                <p class="text-gray-400 text-xs text-justify">
                    O PS1 não tinha Z-Buffer preciso, então as texturas tremiam e o chão "dançava".
                    <br/>Vá em <strong>Console Settings > Advanced > PGXP</strong>.
                    <br/>Ative "PGXP Geometry Correction".
                    <br/>Pronto. As paredes e chão ficam sólidos e retos como num jogo de N64/PC. O visual fica super limpo em alta resolução.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Upscaling (4K)",
            content: `
        <p class="mb-4 text-gray-300">
            Graphics Settings > Enhancement settings.
            <br/>Internal Resolution Scale: 4x (1080p) ou 9x (4K).
            <br/>Mesmo em PCs fracos, 1080p roda liso.
            <br/>Evite filtros pesados (MSAA) em resoluções altas, não precisa.
        </p>
      `
        },
        {
            title: "Capítulo 3: Compressão .CHD",
            content: `
        <p class="mb-4 text-gray-300">
            Jogos de PS1 em .BIN/.CUE ocupam 700MB.
            <br/>O DuckStation suporta o formato <strong>.CHD (Compressed Hunks of Data)</strong>.
            <br/>Converte o jogo para ~300MB sem perder nada de qualidade.
            <br/>Use a ferramenta <code>chdman</code> para converter sua biblioteca inteira.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: Widescreen Hack",
            content: `
        <p class="mb-4 text-gray-300">
            Fazer jogos 4:3 rodarem em 16:9.
            <br/>O DuckStation faz isso renderizando mais cenário nas laterais.
            <br/>Aviso: Em muitos jogos (Crash Bandicoot), os inimigos nas bordas "brotam" do nada (Pop-in) porque o jogo foi programado para não desenhar o que estava fora do 4:3. Se incomodar, desative.
        </p>
      `
        },
        {
            title: "Capítulo 5: Overclock da CPU Emulada",
            content: `
        <p class="mb-4 text-gray-300">
            Jogos como Driver 2 rodavam a 20fps no PS1 original.
            <br/>Vá em Console Settings > CPU Emulation.
            <br/>Aumente o "Emulated CPU Clock Speed" para 500% ou 600%.
            <br/>O jogo vai rodar mais fluido (30fps cravados ou até 60fps em alguns casos) sem acelerar a velocidade do jogo (turbo).
        </p>
      `
        },
        {
            title: "Capítulo 6: Texture Filtering (xBR)",
            content: `
        <p class="mb-4 text-gray-300">
            Se você gosta do visual "Pixel Art", deixe Texture Filtering em "Nearest".
            <br/>Se prefere suave, use "Bilinear".
            <br/>Se quer o visual de "HD Remaster", ative o <strong>xBRZ Upscaling</strong> nas texturas. Ele arredonda os pixels. Alguns amam, outros odeiam. Teste.
        </p>
      `
        },
        {
            title: "Capítulo 7: BIOS",
            content: `
        <p class="mb-4 text-gray-300">
            Requer BIOS (<code>scph1001.bin</code> ou similar).
            <br/>O DuckStation verifica o MD5 da BIOS para garantir que não está corrompida.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: Rebubinagem (Rewind)",
            content: `
            <p class="mb-4 text-gray-300">
                Ative o Rewind nas configurações.
                <br/>Mapeie uma tecla.
                <br/>Errou o pulo no Tomb Raider? Segure a tecla e volte no tempo 5 segundos. Cheat moderno!
            </p>
            `
        },
        {
            title: "Capítulo 9: Interface Big Picture",
            content: `
            <p class="mb-4 text-gray-300">
                O DuckStation tem uma interface "Big Picture" linda para usar na TV com controle.
                <br/>Settings > Big Picture Mode.
            </p>
            `
        },
        {
            title: "Capítulo 10: Android",
            content: `
            <p class="mb-4 text-gray-300">
                A versão de Android é tão boa quanto a de PC.
                <br/>Suporta controles Bluetooth e Touch na tela personalizável. Sincronize seus saves com o PC via Google Drive (usando apps de sync de pasta).
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Melhor que RetroArch (SwanStation)?",
            answer: "SwanStation É o DuckStation portado para o RetroArch. A performance é idêntica. A versão Standalone (DuckStation puro) tem atualizações mais rápidas e interface dedicada."
        },
        {
            question: "Jogos multi-disco (MGS1)?",
            answer: "Crie um arquivo .m3u (playlist) listando os discos .chd do jogo. Abra o .m3u no emulador. O emulador troca de disco automaticamente quando o jogo pede."
        }
    ];

    const externalReferences = [
        { name: "DuckStation GitHub", url: "https://github.com/stenzek/duckstation" },
        { name: "PGXP Explained", url: "https://www.youtube.com/watch?v=1F_70D_zO6o" }
    ];

    const relatedGuides = [
        {
            href: "/guias/retroarch-guia-completo-cores-shaders-crt",
            title: "RetroArch",
            description: "Alternativa All-in-one."
        },
        {
            href: "/guias/pcsx2-otimizacao-4k-widescreen-texturas-guia",
            title: "PCSX2",
            description: "Para PS2."
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
            advancedContentSections={advancedContentSections}
            additionalContentSections={additionalContentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
            faqItems={faqItems}
            externalReferences={externalReferences}
        />
    );
}
