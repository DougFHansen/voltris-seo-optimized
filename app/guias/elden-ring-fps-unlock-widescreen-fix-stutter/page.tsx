import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'elden-ring-fps-unlock-widescreen-fix-stutter',
    title: "Elden Ring (2026): FPS Unlock, Ultrawide e Stutter Fix",
    description: "Jogue Elden Ring acima de 60 FPS e em monitores Ultrawide. Guia do Flawless Widescreen, correções de Stuttering (DXVK) e Ray Tracing otimizado.",
    category: 'games-fix',
    difficulty: 'Avançado',
    time: '20 min'
};

const title = "Elden Ring Unlocked: Otimização Total";
const description = "A FromSoftware trava seus jogos em 60 FPS e 16:9. Isso é inaceitável no PC. Aprenda a quebrar essas barreiras e jogar a 120 FPS+ com suporte a 21:9, mas cuidado com o Anti-Cheat.";

const keywords = [
    'elden ring fps unlocker 2026 flawless widescreen',
    'como jogar elden ring ultrawide online',
    'elden ring stutter fix micro travadas',
    'fmf2 afmf elden ring frame gen',
    'ray tracing elden ring settings performance',
    'desativar easy anti cheat elden ring offline',
    'voltris optimizer souls',
    'importar save elden ring seamless coop'
];

export const metadata: Metadata = createGuideMetadata('elden-ring-fps-unlock-widescreen-fix-stutter', title, description, keywords);

export default function EldenRingGuide() {
    const summaryTable = [
        { label: "Ferramenta", value: "Flawless Widescreen / Tech" },
        { label: "Modo Online", value: "DESATIVADO (Offline Only)" },
        { label: "Ultrawide", value: "Sim (Suporte a HUD e Vignette)" },
        { label: "FPS Unlock", value: "Sim (Até 360 FPS)" },
        { label: "Mod Coop", value: "Seamless Coop (Permite Online)" },
        { label: "Ray Tracing", value: "Configurável" },
        { label: "Stutter Fix", value: "Shader Cache / High Priority" }
    ];

    const contentSections = [
        {
            title: "Aviso Crítico: Easy Anti-Cheat",
            content: `
        <div class="bg-red-900/20 border border-red-500/50 p-6 rounded-xl mb-6">
            <h3 class="text-red-400 font-bold mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
                ATENÇÃO: MODO OFFLINE
            </h3>
            <p class="text-gray-300">
                Para desbloquear FPS ou usar Ultrawide, você PRECISA desativar o Easy Anti-Cheat (EAC).
                <br/>Isso força o jogo para o modo Offline. Você não verá mensagens nem invadirá ninguém nos servidores oficiais.
                <br/>Para jogar online MODIFICADO, use o mod <strong>Seamless Coop</strong> (que usa servidores peer-to-peer separados).
            </p>
        </div>
      `
        },
        {
            title: "Capítulo 1: Desativando o EAC",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Passo a Passo</h4>
                <p class="text-gray-400 text-xs text-justify">
                    1. Vá na pasta do jogo na Steam.
                    2. Crie um arquivo de texto chamado <code>steam_appid.txt</code> e escreva apenas <code>1245620</code> dentro.
                    3. Execute o <code>eldenring.exe</code> diretamente (não pelo <code>start_protected_game.exe</code>).
                    O jogo abrirá sem EAC e dirá "Inappropriate activity detected - Offline Mode". Isso é bom.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Flawless Widescreen (FPS + 21:9)",
            content: `
        <p class="mb-4 text-gray-300">
            A ferramenta mais fácil.
            <br/>1. Baixe o <strong>Flawless Widescreen</strong>.
            <br/>2. Instale o plugin "Elden Ring".
            <br/>3. Marque "Fix Enabled", "Aspect Ratio Fix" (para ultrawide) e "Frame Time Adjustment" (para desbloquear FPS).
            <br/>4. Mude o "Framerate Limit" para o Hz do seu monitor.
            <br/>Abra o jogo. A mágica acontece na hora.
            <br/>Correções extras: Marque "Disable Vignette" para remover as bordas escuras.
        </p>
      `
        },
        {
            title: "Capítulo 3: Tech FPS Unlocker (Alternativa)",
            content: `
        <p class="mb-4 text-gray-300">
            Se não quiser usar o Flawless Widescreen, use o mod "Elden Ring FPS Unlocker" no GitHub (uberhalit).
            <br/>Ele permite mudar o FOV e travar FPS especificamente sem rodar em background.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: Seamless Coop (Jogue Online com Mods)",
            content: `
        <p class="mb-4 text-gray-300">
            O mod <strong>Seamless Coop</strong> reescreve o netcode do jogo.
            <br/>- Co-op permanente (sem desconectar após boss).
            <br/>- Permite usar cavalo no multiplayer.
            <br/>- Como ele não usa os servidores da FromSoftware, você PODE usar mods de FPS Unlock e Ultrawide junto com ele!
            <br/>Basta configurar o Seamless Coop e seus amigos entrarem na sessão.
        </p>
      `
        },
        {
            title: "Capítulo 5: Stutter Fix (Shader Cache)",
            content: `
        <p class="mb-4 text-gray-300">
            O jogo compila shaders enquanto você joga, causando travadinhas.
            <br/>No Painel Nvidia > Configurações 3D > Tamanho do Cache de Shader: Mude para <strong>Ilimitado</strong> ou <strong>10GB</strong>.
            <br/>No Windows: Ative o "Modo de Jogo" e configure Elden Ring para "Alto Desempenho".
        </p>
      `
        },
        {
            title: "Capítulo 6: Ray Tracing",
            content: `
        <p class="mb-4 text-gray-300">
            O RT do Elden Ring é apenas para Sombras e Oclusão de Ambiente (não Reflexos).
            <br/>O impacto visual é baixo, mas o custo é ALTO.
            <br/>Recomendamos deixar DESLIGADO a menos que você tenha uma RTX 4080+.
            <br/>Em 4K, o RT chega a custar 30fps.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 7: HDR (High Dynamic Range)",
            content: `
            <p class="mb-4 text-gray-300">
                A implementação de HDR da FromSoftware é excelente.
                <br/>Se tiver monitor OLED/HDR, ative no Windows (Win+Alt+B) e no jogo. As cavernas ficam escuras de verdade e os feitiços brilham intensamente.
            </p>
            `
        },
        {
            title: "Capítulo 8: Mods de Textura e Reshade",
            content: `
            <p class="mb-4 text-gray-300">
                Pode usar ReShade no modo Offline/Seamless sem problemas.
                <br/>Recomendamos presets que reduzam o tom "verde/amarelo" do jogo para algo mais natural.
            </p>
            `
        },
        {
            title: "Capítulo 9: Backup de Save",
            content: `
            <p class="mb-4 text-gray-300">
                Faça backup do save em <code>%appdata%/EldenRing</code> regularmente.
                <br/>Se um cheater invadir (mesmo no Seamless é raro) ou o save corromper com mods, você restaura.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Posso ser banido?",
            answer: "Se você entrar nos servidores oficiais (EAC Ativado) com arquivos modificados ou save editado, SIM. Sempre remova os mods antes de voltar pro Online Oficial."
        },
        {
            question: "Física quebra a 120fps?",
            answer: "Não mais. No lançamento sim, mas patches corrigiram a física de tecido e pulo em FPS alto. É seguro jogar."
        }
    ];

    const externalReferences = [
        { name: "Flawless Widescreen", url: "https://www.flawlesswidescreen.org/" },
        { name: "Seamless Coop Mod (Nexus)", url: "https://www.nexusmods.com/eldenring/mods/510" }
    ];

    const relatedGuides = [
        {
            href: "/guias/lossless-scaling-frame-generation-fsr-guia",
            title: "Frame Gen",
            description: "Dobrar FPS."
        },
        {
            href: "/guias/reshade-guia-instalacao-ray-tracing-rtgi-filtros",
            title: "ReShade",
            description: "Melhorar visual."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="20 min"
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
