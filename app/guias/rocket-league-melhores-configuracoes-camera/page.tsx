import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'rocket-league-melhores-configuracoes-camera',
    title: "Rocket League (2026): Câmera Pro, FPS Unlock e Controller Settings",
    description: "Pare de usar a Camera Shake. Configurações de Câmera usadas pelos pros (Zen, Vatira), como desbloquear FPS acima de 240 e otimizar o Input Lag.",
    category: 'jogos',
    difficulty: 'Intermediário',
    time: '30 min'
};

const title = "Rocket League Pro Config (2026): Física, Câmera e FPS";
const description = "Rocket League é 100% física e input. Qualquer atraso milimétrico faz você errar o Ariel. Aprenda a configurar o jogo para resposta instantânea.";

const keywords = [
    'rocket league camera settings pro 2026',
    'como aumentar fps rocket league pc fraco',
    'desbloquear fps rocket league tasystemsettings',
    'input lag rocket league controller',
    'camera shake desligar rocket league',
    'melhor deadzone rocket league',
    'steam controller configuration rocket league square deadzone',
    'bakkesmod performance plugins',
    'render quality high quality vs high performance',
    'voltris optimizer rocket league'
];

export const metadata: Metadata = createGuideMetadata('rocket-league-melhores-configuracoes-camera', title, description, keywords);

export default function RocketLeagueGuide() {
    const summaryTable = [
        { label: "Camera Shake", value: "OFF (Crime Ligar)" },
        { label: "FOV", value: "110 (Max)" },
        { label: "FPS", value: "Uncapped (Config)" },
        { label: "Anti-Aliasing", value: "Off" },
        { label: "Render Detail", value: "Performance" },
        { label: "Transparent Goal", value: "On" },
        { label: "Controller", value: "Square Deadzone" }
    ];

    const contentSections = [
        {
            title: "Introdução: O crime da Camera Shake",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Se você joga com "Camera Shake" (Tremor da Câmera) ligado, você está em desvantagem. Essa é a primeira coisa que qualquer jogador deve desligar. O jogo fica limpo e sua precisão aérea melhora 100%.
        </p>
      `
        },
        {
            title: "Capítulo 1: Configurações de Câmera (O Padrão Ouro)",
            content: `
        <p class="mb-4 text-gray-300">
            Copie estas configurações. É a base usada por 99% dos Pros (RLCS):
        </p>
        <div class="bg-[#0A0A0F] p-5 rounded-xl border border-white/5 space-y-2">
            <p class="text-white text-sm"><strong class="text-[#31A8FF]">Camera Shake:</strong> <span class="text-red-400">Uncheck (Desligado)</span></p>
            <p class="text-white text-sm"><strong class="text-[#31A8FF]">Field of View (FOV):</strong> 110 (Máximo. Visão é tudo).</p>
            <p class="text-white text-sm"><strong class="text-[#31A8FF]">Distance:</strong> 260.00 a 280.00</p>
            <p class="text-white text-sm"><strong class="text-[#31A8FF]">Height:</strong> 90.00 a 110.00</p>
            <p class="text-white text-sm"><strong class="text-[#31A8FF]">Angle:</strong> -3.00 a -5.00</p>
            <p class="text-white text-sm"><strong class="text-[#31A8FF]">Stiffness:</strong> 0.40 a 0.50 (Quanto maior, mais presa a câmera fica no carro).</p>
            <p class="text-white text-sm"><strong class="text-[#31A8FF]">Swivel Speed:</strong> 4.00 a 6.00</p>
             <p class="text-white text-sm"><strong class="text-[#31A8FF]">Transition Speed:</strong> 1.00 a 1.20</p>
        </div>
      `
        },
        {
            title: "Capítulo 2: Configurações de Vídeo (Performance)",
            content: `
        <table class="w-full text-sm text-left text-gray-400">
            <tbody>
                <tr class="border-b border-gray-700">
                    <td class="py-2 font-bold">Anti-Alias</td>
                    <td class="py-2 text-red-400">Off</td>
                    <td class="py-2">O AA do Rocket League (MLAA) borra a bola de longe. Desligue.</td>
                </tr>
                <tr class="border-b border-gray-700">
                    <td class="py-2 font-bold">Render Quality</td>
                    <td class="py-2 text-emerald-400">High Quality</td>
                    <td class="py-2">Mantenha no máximo. Se baixar, o jogo fica pixelado e difícil de ler profundidade.</td>
                </tr>
                <tr class="border-b border-gray-700">
                    <td class="py-2 font-bold">Render Detail</td>
                    <td class="py-2 text-yellow-400">Performance</td>
                    <td class="py-2">Remove grama 3D e detalhes inúteis das arenas.</td>
                </tr>
                 <tr class="border-b border-gray-700">
                    <td class="py-2 font-bold">Transparent Goalposts</td>
                    <td class="py-2 text-emerald-400">On</td>
                    <td class="py-2">Obrigatório. Permite ver através da trave quando você está defendendo dentro do gol.</td>
                </tr>
                 <tr class="border-b border-gray-700">
                    <td class="py-2 font-bold">World Detail / Particles</td>
                    <td class="py-2 text-yellow-400">Performance</td>
                    <td class="py-2">Menos brilho no boost, mais FPS.</td>
                </tr>
            </tbody>
        </table>
      `
        },
        {
            title: "Capítulo 3: TASystemSettings.ini (FPS Unlock)",
            content: `
        <p class="mb-4 text-gray-300">
            O menu limita a 240 FPS (ou 360 FPS em updates recentes). Para ir além (útil para input lag):
            <br/>Vá em <code>Documentos\\My Games\\Rocket League\\TAGame\\Config\\TASystemSettings.ini</code>.
            <br/>Edite: <code>AllowPerFrameSleep=False</code>.
            <br/>Isso faz a engine correr o mais rápido possível (Uncapped). Cuidado com superaquecimento.
            <br/>Mude também <code>OneFrameThreadLag=False</code> para reduzir latência de input.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: BakkesMod (Essencial)",
            content: `
        <p class="mb-4 text-gray-300">
            No PC, o uso do <strong>BakkesMod</strong> é permitido e encorajado.
            <br/>Ele não dá vantagem injusta, mas permite:
            <br/>- Modo Anonimizador (Remove carros feios dos oponentes).
            <br/>- Treino avançado (Passes, rebotes).
            <br/>- Ver MMR exato.
            <br/>Baixe apenas do site oficial (bakkesplugins.com).
        </p>
      `
        },
        {
            title: "Capítulo 5: Deadzone e Sensibilidade",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>Steering Sensitivity:</strong> 1.00 a 1.40 (Mais que isso perde precisão).
            <br/><strong>Aerialensitivity:</strong> 1.00 a 1.40.
            <br/><strong>Controller Deadzone:</strong> 0.05 a 0.10. O menor valor possível antes do seu carro começar a virar sozinho (drift). Stick drift atrapalha flips.
            <br/><strong>Dodge Deadzone:</strong> 0.50 a 0.80. Controla o quão longe você tem que empurrar o analógico para o pulo virar um flip. Se você backflipa sem querer, aumente isso.
        </p>
      `
        },
        {
            title: "Capítulo 6: Square Deadzone (Steam Config)",
            content: `
        <p class="mb-4 text-gray-300">
            Joysticks são redondos. O jogo espera inputs quadrados (cantos chegam a 100% de input).
            <br/>Na Steam Controller Settings, você pode forçar o input a ser "Square". Isso faz seu carro girar um pouco mais rápido nos aéreos diagonais (Air Roll). É avançado, mas muitos freestylers usam.
        </p>
      `
        },
        {
            title: "Capítulo 7: Voice Chat (Desligar)",
            content: `
        <p class="mb-4 text-gray-300">
            O Voice Chat do Rocket League raramente é usado para tática. Geralmente é distração.
            <br/>Recomendação: Desligue o Voice Chat nas opções de Gameplay e use apenas Quick Chat (Defending!, I got it!) para comunicação rápida.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: Input Buffer (Opções de Gameplay)",
            content: `
            <p class="mb-4 text-gray-300">
                Lá no final da aba Gameplay:
                <br/><strong>Input Buffer:</strong>
                <br/>- <strong>Default (Legacy):</strong> Bom para ping baixo.
                <br/>- <strong>STS (Sim Time Scaling):</strong> Tenta corrigir packet loss acelerando/desacelerando o jogo levemente.
                <br/>- <strong>CSTS (Continuous):</strong> Mais agressivo.
                <br/>Teste STS se você sente "lag fantasma" (Heavy Car Bug).
            </p>
            `
        },
        {
            title: "Capítulo 9: Cross-Platform Play",
            content: `
            <p class="mb-4 text-gray-300">
                Se você joga no PC para subir de rank, desligue o Cross-Platform?
                <br/><strong>Não.</strong> Jogadores de console (PsyNet) geralmente têm mais input lag (TVs). É mais fácil ganhar deles. Mantenha ligado para filas mais rápidas e oponentes "nerfados" pelo hardware.
            </p>
            `
        },
        {
            title: "Capítulo 10: Nameplates (Placas de Nome)",
            content: `
            <p class="mb-4 text-gray-300">
                Aumente o <strong>Nameplate Scale</strong> para 130% ou 140%.
                <br/>Isso permite que você veja onde o oponente está atrás da bola de muito longe, ajudando a prever 50/50s.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Heavy Car Bug existe?",
            answer: "É um efeito placebo causado por input lag variável ou fadiga mental. O carro sempre vira na mesma velocidade. Reiniciar o PC ou mudar o Input Buffer para STS geralmente 'resolve' a sensação."
        },
        {
            question: "Teclado e Mouse é ruim?",
            answer: "Não. Jogadores como 'Drufinho' provaram que KBM pode ser Top 1. Porém, o Controle (Joystick) dá controle analógico de velocidade e direção (360 graus), o que é mecanicamente superior no papel. 95% dos pros usam Controle."
        },
        {
            question: "Qual controle usar? PS4, PS5 ou Xbox?",
            answer: "DualShock 4 (PS4) é o favorito dos pros por ter menor input lag nativo e ser fácil de fazer 'Claw Grip'. O Xbox Series também é excelente no PC."
        }
    ];

    const externalReferences = [
        { name: "Liquipedia Rocket League (Pro Settings)", url: "https://liquipedia.net/rocketleague/List_of_player_camera_settings" },
        { name: "BakkesMod Download", url: "https://bakkesmod.com/" },
        { name: "Rocket Science (Canal de Física)", url: "https://www.youtube.com/channel/UCfK7hOirILjhNkQhFn2in4Q" }
    ];

    const relatedGuides = [
        {
            href: "/guias/monitor-hz-configuracao-correta",
            title: "Monitor 144Hz",
            description: "Essencial para ler a bola."
        },
        {
            href: "/guias/como-escolher-controle-pc",
            title: "Controle",
            description: "Evite input lag USB."
        },
        {
            href: "/guias/reduzir-ping-regedit-cmd-jogos",
            title: "Lag",
            description: "Corrija packet loss."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="30 min"
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
