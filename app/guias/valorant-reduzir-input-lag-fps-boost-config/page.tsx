import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'valorant-reduzir-input-lag-fps-boost-config',
    title: "Valorant: CHEGUE AO RADIANTE! (0ms Input Lag 2026)",
    description: "Quer subir de elo RAPIDAMENTE? Configurações PRO para 240 FPS + input lag ZERO. Atire primeiro e ganhe mais duelos com otimização extrema!",
    category: 'otimizacao',
    difficulty: 'Intermediário',
    time: '15 min'
};

const title = "Valorant: CHEGUE AO RADIANTE! (0ms Input Lag 2026)";
const description = "Quer subir de elo RAPIDAMENTE? Configurações PRO para 240 FPS + input lag ZERO. Atire primeiro e ganhe mais duelos com otimização extrema!";

const keywords = [
    'valorant fps boost pack low end pc',
    'input lag valorant nvidia reflex on boost',
    'raw input buffer valorant on or off',
    'multithreaded rendering valorant',
    'resolução esticada valorant 4:3 aim',
    'packet loss fix valorant rede',
    'voltris optimizer fps',
    'van 9003 error fix secure boot'
];

export const metadata: Metadata = createGuideMetadata('valorant-reduzir-input-lag-fps-boost-config', title, description, keywords);

export default function ValorantGuide() {
    const summaryTable = [
        { label: "Multithreaded", value: "ON" },
        { label: "Reflex", value: "On + Boost" },
        { label: "Raw Input Buffer", value: "ON (Mouses 8Khz)" },
        { label: "Hrtf", value: "ON (Audio 3D)" },
        { label: "Resolução", value: "Nativa (4:3 estica só HUD)" },
        { label: "Limit FPS", value: "OFF (In-game)" },
        { label: "Material", value: "Low (Clareza)" }
    ];

    const contentSections = [
        {
            title: "Introdução: CPU Bound",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Valorant usa quase nada de GPU. Ele devora CPU (processador).
          <br/>Fechar o Chrome, Discord (Overlay) e apps de fundo é essencial. Otimizar o Windows dá mais resultado no Valorant do que em qualquer outro jogo.
        </p>
      `
        },
        {
            title: "Capítulo 1: Configurações Gráficas (Video)",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Qualidade</h4>
                <p class="text-gray-400 text-xs text-justify">
                    - <strong>Multithreaded Rendering:</strong> ON. (Sem isso seu FPS cai pela metade).
                    - <strong>Material Quality:</strong> Low.
                    - <strong>Texture Quality:</strong> Low/Medium.
                    - <strong>Detail Quality:</strong> Low. (Remove matinhos e decalques que distraem).
                    - <strong>UI Quality:</strong> Low.
                    - <strong>Vignette:</strong> OFF.
                    - <strong>VSync:</strong> OFF.
                    - <strong>Anti-Aliasing:</strong> MSAA 2x ou 4x. (None deixa serrilhado demais, FXAA embaça). 2x é o ideal.
                    - <strong>Anisotropic Filtering:</strong> 2x ou 4x.
                    - <strong>Improve Clarity:</strong> ON (Aumenta o contraste dos agentes).
                    - <strong>Experimental Sharpening:</strong> OFF.
                    - <strong>Bloom/Distortion/Shadows:</strong> OFF.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Nvidia Reflex e FPS",
            content: `
        <p class="mb-4 text-gray-300">
            - <strong>Nvidia Reflex Low Latency:</strong> On + Boost.
            <br/>Isso força sua GPU a esperar a CPU, mantendo a fila de renderização vazia. Input lag mínimo.
            - <strong>Limit FPS Always:</strong> OFF.
            <br/>Quanto mais FPS, menor o frametime, mesmo que seu monitor não exiba. Deixe destravado (ou trave em 300+ se seu PC aquecer).
        </p>
      `
        },
        {
            title: "Capítulo 3: Raw Input Buffer",
            content: `
        <p class="mb-4 text-gray-300">
            Em Controls > Mouse.
            <br/>Ative <strong>Raw Input Buffer</strong> se você tem um mouse com Polling Rate alto (1000Hz, 4000Hz, 8000Hz).
            <br/>Isso faz o jogo processar os dados do mouse numa thread separada. Se seu mouse for padrão (125Hz-500Hz), não faz diferença, mas pode deixar ligado.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: Resolução Esticada (4:3)?",
            content: `
            <p class="mb-4 text-gray-300">
                Diferente do CS2, no Valorant <strong>4:3 NÃO estica os bonecos</strong> (Hitbox não muda).
                <br/>Apenas a interface (HUD) e a mira esticam. O FOV continua 103 horizontal travado.
                <br/>Alguns usam por costume do CS ou para ganhar FPS (menos pixels), mas não dá vantagem de mira.
            </p>
            `
        },
        {
            title: "Capítulo 5: Otimização de Rede (Packet Loss)",
            content: `
        <p class="mb-4 text-gray-300">
            General > Network Buffering: <strong>Minimum</strong>.
            <br/>Se você tiver perda de pacotes (bonecos teleportando), mude para Moderate, mas isso aumenta o lag de peeker advantage. Tente sempre Minimum e conserte sua internet (cabo Ethernet).
        </p>
      `
        },
        {
            title: "Capítulo 6: Erro VAN 9003 (Sistemas Modernos)",
            content: `
        <p class="mb-4 text-gray-300">
            O Windows 11 exige TPM 2.0 e Secure Boot ativados na BIOS para o Vanguard rodar.
            <br/>Entre na BIOS do seu PC, procure "Secure Boot" e mude de "Other OS" para "Windows UEFI". Ative o TPM (fTPM ou PTT).
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 7: Prioridade de Processo",
            content: `
            <p class="mb-4 text-gray-300">
                Use o Gerenciador de Tarefas > Detalhes > <code>VALORANT-Win64-Shipping.exe</code> > Definir Prioridade > Alta.
                <br/>Não use "Tempo Real" (trava o mouse). "Alta" ajuda a evitar drops quando o Windows resolve fazer update em background.
            </p>
            `
        },
        {
            title: "Capítulo 8: Áudio HRTF",
            content: `
            <p class="mb-4 text-gray-300">
                Audio > Speaker Configuration: Stereo.
                <br/>Ative <strong>HRTF</strong>.
                <br/>Isso simula som 3D. No começo é estranho, mas é a única forma de saber se o passo vem de cima ou de baixo na Haven/Split.
            </p>
            `
        },
        {
            title: "Capítulo 9: Mira (Crosshair)",
            content: `
            <p class="mb-4 text-gray-300">
                Copie de um Pro. (Ex: TenZ ou Aspas).
                <br/>Geralmente: Cyan, 1-4-2-2 (Inner Lines), sem Outline, sem Center Dot. Mira pequena atrapalha menos a visão.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Alt-Tab trava o PC?",
            answer: "Isso é comum no Windows 11 com 'Agendamento de GPU acelerado por hardware' e modo de tela cheia. Tente usar 'Windowed Fullscreen' se incomodar muito, mas Fullscreen dá menos input lag."
        },
        {
            question: "Vanguard fecha sozinho?",
            answer: "Verifique se o serviço 'vgc' está em Automático no services.msc. Desinstale softwares de RGB (iCue, Armoury Crate) que dão conflito com anti-cheat."
        }
    ];

    const externalReferences = [
        { name: "Valorant Pro Crosshairs", url: "https://www.vcrdb.net/" },
        { name: "Riot Support - VAN Errors", url: "https://support-valorant.riotgames.com/hc/en-us" }
    ];

    const relatedGuides = [
        {
            href: "/guias/cs2-melhores-comandos-console-fps",
            title: "CS2",
            description: "FPS similar."
        },
        {
            href: "/guias/mouse-otimizacao-windows-precisao",
            title: "Mouse",
            description: "Ajuste fino."
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
