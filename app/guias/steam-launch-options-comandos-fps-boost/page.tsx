import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'steam-launch-options-comandos-fps-boost',
    title: "Steam Launch Options (2026): Comandos de FPS (Mitos e Verdades)",
    description: "Ainda usa '-high -threads 8'? Pare agora. Descubra quais comandos de inicialização realmente funcionam no CS2, Dota 2, Apex e quais estragam seu jogo.",
    category: 'software',
    difficulty: 'Intermediário',
    time: '15 min'
};

const title = "Comandos da Steam (2026): Limpando o Lixo";
const description = "90% dos guias na internet mandam você colar uma lista enorme de comandos de 2015. A maioria desses comandos foi desativada ou piora o jogo hoje.";

const keywords = [
    'melhores opcoes de inicializacao cs2 fps',
    'dota 2 launch options 2026',
    'apex legends autoexec commands',
    'comando -high funciona mesmo',
    'comando -threads nucleos processador',
    '-novid -console -freq 240',
    'dx11 vs vulkan steam command',
    'voltris optimizer steam',
    'pubg stutter fix launch options'
];

export const metadata: Metadata = createGuideMetadata('steam-launch-options-comandos-fps-boost', title, description, keywords);

export default function SteamGuide() {
    const summaryTable = [
        { label: "Útil", value: "-novid (Pula intro)" },
        { label: "Útil", value: "-freq 240 (Força Hz)" },
        { label: "Útil", value: "-allow_third_party_software" },
        { label: "Perigoso", value: "-threads (Trava PC)" },
        { label: "Perigoso", value: "-high (Gera instabilidade)" },
        { label: "Inútil", value: "-d3d9ex (Já é padrão)" },
        { label: "API", value: "-vulkan (Teste)" }
    ];

    const contentSections = [
        {
            title: "Introdução: O Efeito Placebo",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Jogadores copiam e colam <code>-high -useforcedmparms -noforcemaccel -heapsize</code> sem saber o que fazem. A Valve já disse: LIMPE SUAS LAUNCH OPTIONS. O jogo sabe detectar seu hardware melhor que um comando de 2012.
        </p>
      `
        },
        {
            title: "Capítulo 1: Comandos Úteis (Safe)",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Use estes:</h4>
                <p class="text-gray-400 text-xs text-justify">
                    - <strong>-novid</strong>: Remove o vídeo de abertura (Intro da Valve). Entra no menu mais rápido.
                    <br/>- <strong>-console</strong>: Ativa o console de desenvolvedor (') por padrão.
                    <br/>- <strong>-freq 144</strong> (ou 240/360): Garante que o jogo inicie na frequência máxima do seu monitor, caso o Windows esteja bugado.
                    <br/>- <strong>-fullscreen</strong>: Força tela cheia exclusiva.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Comandos Harmful (Perigosos)",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>NÃO USE estes:</strong>
            <br/>- <code>-threads X</code>: O jogo gerencia núcleos automaticamente. Se você errar o número, vai ter stuttering.
            <br/>- <code>-high</code>: Força prioridade Alta no Windows. Pode fazer o mouse parar de responder ou o Discord travar se a CPU bater 100%.
            <br/>- <code>+mat_queue_mode 2</code>: Antigo. CS2 já usa multithread nativo.
            <br/>- <code>-d3d9ex</code>: Já vem ativado por padrão há 5 anos.
        </p>
      `
        },
        {
            title: "Capítulo 3: APIs Gráficas (DX11 vs Vulkan)",
            content: `
        <p class="mb-4 text-gray-300">
            Em jogos como Dota 2, Rainbow Six e Apex:
            <br/>- <code>-vulkan</code>: Tenta rodar em Vulkan. Bom para GPUs AMD ou para Linux. Em Nvidia, geralmente DX11 é melhor.
            <br/>- <code>-dx11</code>: Padrão.
            <br/>- <code>-dx12</code>: Instável em alguns jogos (Fortnite), mas dá mais FPS se sua GPU for nova. Teste.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: CS2 Específico",
            content: `
        <p class="mb-4 text-gray-300">
            Para Counter-Strike 2:
            <br/>Recomenda-se usar <strong>NENHUMA</strong> launch option além de <code>-novid</code>.
            <br/>A engine Source 2 odeia comandos antigos da Source 1. Apague tudo e sinta o jogo mais liso.
        </p>
      `
        },
        {
            title: "Capítulo 5: PUBG e Stuttering",
            content: `
        <p class="mb-4 text-gray-300">
            Para PUBG:
            <br/><code>-USEALLAVAILABLECORES</code>: Era útil em 2018. Hoje é inútil.
            <br/><code>-sm4</code>: Forçava Shader Model 4 (DX10) para ganhar FPS sacrificando iluminação. Muitos jogos bloquearam isso por ser "cheat" de visibilidade.
        </p>
      `
        },
        {
            title: "Capítulo 6: AutoExec.cfg",
            content: `
        <p class="mb-4 text-gray-300">
            Em vez de launch options, coloque seus comandos de jogo (mira, binds, sensibilidade) dentro de um arquivo <code>autoexec.cfg</code> na pasta do jogo.
            <br/>Adicione <code>+exec autoexec.cfg</code> nas opções de inicialização para carregar sempre.
        </p>
      `
        },
        {
            title: "Capítulo 7: Cache de Shaders",
            content: `
        <p class="mb-4 text-gray-300">
            A Steam baixa shaders pré-compilados (Pre-caching).
            <br/>Mantenha isso ativado nas configurações da Steam (Downloads).
            <br/>Desativar isso faz o jogo travar na primeira vez que você vê um efeito novo (ex: granada explodindo).
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: Limite de VRAM",
            content: `
            <p class="mb-4 text-gray-300">
                Nunca use comandos como <code>-heapsize</code> para setar memória RAM. O Windows faz isso melhor que você. Se você setar errado, o jogo crasha por falta de memória ("Out of Memory").
            </p>
            `
        },
        {
            title: "Capítulo 9: Modo Texto",
            content: `
            <p class="mb-4 text-gray-300">
                Se seu PC é muito ruim:
                <br/>Launch option <code>-no-browser</code> na Steam (atalho do executável da steam, não do jogo) fazia a Steam usar 50MB de RAM. A Valve removeu isso na nova UI. Não funciona mais.
            </p>
            `
        },
        {
            title: "Capítulo 10: Restaurar Padrão",
            content: `
            <p class="mb-4 text-gray-300">
                Está com bugs? Delete TUDO da caixa de opções de inicialização. Deixe em branco. Verifique a integridade dos arquivos.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Onde ficam as opções?",
            answer: "Biblioteca Steam > Botão Direito no Jogo > Propriedades > Geral > Opções de Inicialização."
        },
        {
            question: "-tickrate 128 funciona?",
            answer: "No CS:GO funcionava. No CS2 (Sub-tick), o servidor controla isso. É inútil."
        }
    ];

    const externalReferences = [
        { name: "Valve Developer Wiki (Command Line)", url: "https://developer.valvesoftware.com/wiki/Command_Line_Options" }
    ];

    const relatedGuides = [
        {
            href: "/guias/counter-strike-2-fps-boost-config",
            title: "CS2 config",
            description: "Guia completo."
        },
        {
            href: "/guias/apex-legends-config-autoexec-fps",
            title: "Apex config",
            description: "Autoexec guide."
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
