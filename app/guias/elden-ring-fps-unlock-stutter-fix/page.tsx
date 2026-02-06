import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'elden-ring-fps-unlock-stutter-fix',
    title: "Elden Ring (2026): 60 FPS Unlock, Fix de Stutter e Widescreen",
    description: "Elden Ring trava em 60 FPS e não suporta Ultrawide nativo. Aprenda a desbloquear o framerate, corrigir os engasgos do DX12 e jogar em 21:9.",
    category: 'jogos',
    difficulty: 'Avançado',
    time: '30 min'
};

const title = "Elden Ring Turbo (2026): Adeus 60 FPS Lock";
const description = "A FromSoftware faz jogos incríveis, mas ports de PC questionáveis. O limite de 60 FPS e as barras pretas em monitores ultrawide são frustrantes. Vamos corrigir isso.";

const keywords = [
    'elden ring fps unlocker 2026 mod',
    'elden ring stutter fix dx12 cache',
    'como jogar elden ring ultrawide flawless widescreen',
    'easy anti cheat disable elden ring offline',
    'melhores configurações graficas elden ring pc fraco',
    'elden ring tela branca crash fix',
    'eac toggle elden ring nexus',
    'shadow quality elden ring performance',
    'voltris optimizer souls game',
    'rtx hdr elden ring'
];

export const metadata: Metadata = createGuideMetadata('elden-ring-fps-unlock-stutter-fix', title, description, keywords);

export default function EldenRingGuide() {
    const summaryTable = [
        { label: "FPS Lock", value: "Mod (Desbloqueie)" },
        { label: "Anti-Cheat", value: "Offline (Para Mods)" },
        { label: "Shadows", value: "Medium" },
        { label: "Grass Quality", value: "Medium" },
        { label: "Motion Blur", value: "Off (Sempre)" },
        { label: "Shader Cache", value: "Unlimited (Driver)" },
        { label: "Global Illumination", value: "High (Não Max)" }
    ];

    const contentSections = [
        {
            title: "Introdução: As Amarras da Engine",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Ocorrem micro-travadas (stutters) quando você entra em uma área nova? Isso é compilação de shader. Além disso, o jogo é travado em 60Hz. Para quem tem monitor 144Hz, parece lento.
        </p>
      `
        },
        {
            title: "Capítulo 1: Desativando Easy Anti-Cheat (EAC)",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Obrigatório para Mods</h4>
                <p class="text-gray-400 text-xs text-justify">
                    Para desbloquear FPS ou usar Ultrawide, você precisa modificar a memória do jogo. O EAC bloqueia isso.
                    <br/>1. Baixe o "ToggleAntiCheat" no NexusMods.
                    <br/>2. Ou crie um arquivo <code>steam_appid.txt</code> com o número <code>1245620</code> na pasta do jogo e execute pelo <code>eldenring.exe</code> direto (não pela Steam).
                    <br/><strong>Aviso:</strong> Você jogará em modo OFFLINE. Sem mensagens no chão, sem invasões, sem coop.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Elden Ring FPS Unlocker",
            content: `
        <p class="mb-4 text-gray-300">
            Baixe o <a href="https://github.com/uberhalit/EldenRingFpsUnlocker" target="_blank" class="text-blue-400">Elden Ring FPS Unlocker</a> no GitHub.
            <br/>- Abra o programa.
            <br/>- Aponte para o jogo.
            <br/>- Marque "Unlock FPS". Defina o limite (ex: 144).
            <br/>- Clique em "Patch" e "Start Game".
            <br/>A fluidez do combate em 120 FPS+ é transformadora. Rolamentos ficam mais responsivos.
        </p>
      `
        },
        {
            title: "Capítulo 3: Flawless Widescreen (21:9)",
            content: `
        <p class="mb-4 text-gray-300">
            O jogo renderiza as barras pretas propositalmente.
            <br/>Baixe o <strong>Flawless Widescreen</strong>. Instale o plugin de Elden Ring.
            <br/>Ative "Fix Enabled".
            <br/>Pronto. O jogo preenche a tela toda. O HUD pode precisar de ajuste manual nas opções do plugin.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: Configurações Gráficas Otimizadas",
            content: `
        <p class="mb-4 text-gray-300">
            - <strong>Grass Quality:</strong> Medium. (High coloca grama longe demais, pesado).
            - <strong>Shadow Quality:</strong> Medium.
            - <strong>SSAO:</strong> Medium.
            - <strong>Motion Blur:</strong> OFF. (Dificulta ver ataques rápidos).
            - <strong>Ray Tracing:</strong> OFF. (A implementação de RT no Elden Ring é visualmente fraca e custa muito FPS).
        </p>
      `
        },
        {
            title: "Capítulo 5: Stutter Fix (Shader Cache)",
            content: `
        <p class="mb-4 text-gray-300">
            No Painel de Controle Nvidia:
            <br/>- Tamanho do Cache de Sombredor (Shader Cache Size): <strong>Ilimitado (Unlimited)</strong> ou <strong>10GB</strong>.
            <br/>Isso permite que o jogo guarde todos os shaders compilados no disco, evitando que ele compile toda vez que você vê um dragão novo.
        </p>
      `
        },
        {
            title: "Capítulo 6: Prioridade de Processo",
            content: `
        <p class="mb-4 text-gray-300">
            Use o Voltris Optimizer ou Process Lasso para definir <code>eldenring.exe</code> como prioridade <strong>Alta</strong> e desativar "Hyper-Threading" para este jogo específico se tiver uma CPU Intel antiga (ajuda na estabilidade do frame time).
        </p>
      `
        },
        {
            title: "Capítulo 7: Controle (Input Lag)",
            content: `
        <p class="mb-4 text-gray-300">
            Jogos Souls exigem precisão.
            <br/>Use controle com cabo. O delay do Bluetooth pode fazer você errar o "Parry".
            <br/>No menu do jogo, desative a vibração se preferir (vibração gasta bateria do controle e pode distrair).
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: Seamless Coop Mod",
            content: `
            <p class="mb-4 text-gray-300">
                Se quiser jogar com amigos sem as limitações chatas (invocações sumindo após boss), use o mod <strong>Seamless Coop</strong>.
                <br/>Ele usa um sistema de rede próprio (Steam P2P) e não passa pelos servidores da FromSoft, então você não leva ban, mas joga apenas com quem tem o mod.
            </p>
            `
        },
        {
            title: "Capítulo 9: Backup de Save",
            content: `
            <p class="mb-4 text-gray-300">
                O jogo pode corromper saves ao usar mods.
                <br/>Vá em <code>%appdata%\\EldenRing</code>.
                <br/>Copie a pasta com números (seu ID Steam) para um local seguro regularmente.
            </p>
            `
        },
        {
            title: "Capítulo 10: HDR em Elden Ring",
            content: `
            <p class="mb-4 text-gray-300">
                O HDR nativo é decente, mas as cavernas ficam cinzas.
                <br/>Recomendamos ajustar o brilho In-Game para um valor menor do que o jogo sugere, para ter pretos reais em telas OLED.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Posso voltar para o Online depois?",
            answer: "Sim. Desative o Unlocker/Mods, delete os arquivos da pasta do jogo (dinput8.dll), verifique a integridade na Steam e abra o jogo. O EAC vai carregar e você estará online novamente."
        },
        {
            question: "Usar Unlocker dá ban?",
            answer: "Se você TENTAR entrar online com ele, o EAC detecta alteração de memória e te chuta ou bane. Por isso é crucial desativar o EAC antes (jogar offline)."
        },
        {
            question: "O jogo congela por segundos?",
            answer: "Geralmente é o dispositivo USB desconectando/conectando (controle com cabo ruim). O jogo escaneia dispositivos o tempo todo."
        }
    ];

    const externalReferences = [
        { name: "Elden Ring FPS Unlocker", url: "https://github.com/uberhalit/EldenRingFpsUnlocker" },
        { name: "Nexus Mods Elden Ring", url: "https://www.nexusmods.com/eldenring" }
    ];

    const relatedGuides = [
        {
            href: "/guias/nvidia-painel-controle-melhores-configuracoes",
            title: "Nvidia",
            description: "Cache settings."
        },
        {
            href: "/guias/monitor-ultrawide-jogos-competitivos",
            title: "Ultrawide",
            description: "Entenda o formato."
        },
        {
            href: "/guias/controle-ps4-ps5-overclock-ds4windows",
            title: "Controle",
            description: "Melhore o Parry."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="30 min"
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
