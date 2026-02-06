import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'overwatch-2-melhores-configuracoes-fps',
    title: "Overwatch 2 (2026): Guia de FPS Competitivo e Visibilidade",
    description: "Elimine o Input Lag no OW2. Dynamic Render Scale, High Precision Mouse Input e configurações de simulação para Tracer/Genji mains.",
    category: 'jogos',
    difficulty: 'Intermediário',
    time: '40 min'
};

const title = "Overwatch 2 Competitive Specs (2026): Input Lag & Render Scale";
const description = "Overwatch 2 é extremamente rápido e caótico. Qualquer queda de frame atrapalha o rastreamento (tracking). Aprenda a configurar o jogo para estabilidade máxima em team fights.";

const keywords = [
    'overwatch 2 fps boost 2026 settings',
    'dynamic render scale overwatch 2 on or off',
    'high precision mouse input ow2',
    'nvidia reflex overwatch 2 boost',
    'sombras overwatch 2 low',
    'buffer triplo overwatch 2 desligar',
    'reduzir buffering overwatch 2',
    'simulação de rede ow2',
    'melhor mira overwatch 2 cores',
    'voltris optimizer overwatch'
];

export const metadata: Metadata = createGuideMetadata('overwatch-2-melhores-configuracoes-fps', title, description, keywords);

export default function OverwatchGuide() {
    const summaryTable = [
        { label: "Render Scale", value: "Custom (75% ou 100%)" },
        { label: "Dynamic Render", value: "Off" },
        { label: "Frame Rate", value: "Custom (Cap 300)" },
        { label: "Buffering", value: "Reduzir Buffering ON" },
        { label: "Reflex", value: "On + Boost" },
        { label: "Model Detail", value: "Low" },
        { label: "High Precision Input", value: "On" }
    ];

    const contentSections = [
        {
            title: "Introdução: A Engine Otimizada",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          A engine do Overwatch 2 é uma das melhores do mercado. Ela escala muito bem. Mas configurações padrão como "Dynamic Render Scale" podem arruinar sua memória muscular mudando a resolução no meio da luta.
        </p>
      `
        },
        {
            title: "Capítulo 1: Configurações de Vídeo (Video Settings)",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-orange-500 font-bold mb-1">Render Scale</h4>
                <p class="text-white font-mono text-sm mb-2">Recomendado: <span class="text-emerald-400">Custom (100%)</span></p>
                <p class="text-gray-400 text-xs">
                    Nunca use "Automatic". O jogo vai mudar a qualidade da imagem sozinho. Fixe em 100%. Se precisar de FPS, baixe para 75% fixo.
                </p>
            </div>
             <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-orange-500 font-bold mb-1">Dynamic Render Scale</h4>
                <p class="text-white font-mono text-sm mb-2">Recomendado: <span class="text-red-400">Off</span></p>
                <p class="text-gray-400 text-xs">
                   Isso causa instabilidade no input lag. Mantenha desligado.
                </p>
            </div>
             <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-orange-500 font-bold mb-1">Nvidia Reflex</h4>
                <p class="text-white font-mono text-sm mb-2">Recomendado: <span class="text-emerald-400">On + Boost</span></p>
                <p class="text-gray-400 text-xs">
                    Essencial para reduzir a latência do sistema. O Boost mantém a GPU acordada.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Gráficos Avançados (Visibilidade)",
            content: `
        <table class="w-full text-sm text-left text-gray-400">
            <tbody>
                <tr class="border-b border-gray-700">
                    <td class="py-2 font-bold">Texture Quality</td>
                    <td class="py-2 text-yellow-400">Medium/High</td>
                    <td class="py-2">Texturas não afetam muito FPS se tiver VRAM (+4GB). High ajuda a identificar skins.</td>
                </tr>
                <tr class="border-b border-gray-700">
                    <td class="py-2 font-bold">Texture Filtering</td>
                    <td class="py-2">8x - 16x</td>
                    <td class="py-2">Barato e deixa o chão nítido.</td>
                </tr>
                <tr class="border-b border-gray-700">
                    <td class="py-2 font-bold">Local Fog Detail</td>
                    <td class="py-2 text-red-400">Low</td>
                    <td class="py-2">Neblina atrapalha a visão. Low remove ela.</td>
                </tr>
                <tr class="border-b border-gray-700">
                    <td class="py-2 font-bold">Dynamic Reflections</td>
                    <td class="py-2 text-red-400">Off</td>
                    <td class="py-2">Reflexos comem FPS. Off.</td>
                </tr>
                 <tr class="border-b border-gray-700">
                    <td class="py-2 font-bold">Shadow Detail</td>
                    <td class="py-2 text-red-400">Off/Low</td>
                    <td class="py-2">Sombras dinâmicas pesam. Pro players usam Off para FPS máximo.</td>
                </tr>
                 <tr class="border-b border-gray-700">
                    <td class="py-2 font-bold">Model Detail</td>
                    <td class="py-2 text-yellow-400">Low</td>
                    <td class="py-2">No Low, alguns arbustos somem, dando vantagem de visão.</td>
                </tr>
            </tbody>
        </table>
      `
        },
        {
            title: "Capítulo 3: Gameplay Input (Mouse)",
            content: `
        <p class="mb-4 text-gray-300">
            Em Opções > Gameplay:
            <br/><strong>High Precision Mouse Input:</strong> <span class="text-emerald-400 font-bold">ON</span>.
            <br/>Isso permite que o jogo processe o movimento do mouse entre os frames renderizados (Sub-frame input). Seu tiro sai na exata posição que o mouse estava, mesmo se o frame visual ainda não atualizou. Obrigatório para Widowmaker/Cassidy.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: Reduce Buffering (O Truque)",
            content: `
        <p class="mb-4 text-gray-300">
            Esta opção força o jogo a não pré-renderizar frames extras.
            <br/><strong>Ligue (ON)</strong>.
            <br/><em>Bug conhecido:</em> Se você der Alt+Tab, o FPS pode cair. Se isso acontecer, desligue e ligue o "Reduce Buffering" novamente para limpar o buffer.
        </p>
      `
        },
        {
            title: "Capítulo 5: Som Dolby Atmos",
            content: `
        <p class="mb-4 text-gray-300">
            O OW2 tem suporte nativo a Dolby Atmos for Headphones.
            <br/>Se você tem fone estéreo, ative isso nas opções de Som do jogo.
            <br/>Ele é muito superior ao "Spatial Sound" do Windows Sonic. Ele permite ouvir Pharah voando acima ou Sombra andando atrás com precisão cirúrgica.
        </p>
      `
        },
        {
            title: "Capítulo 6: Cap de FPS e Simulação",
            content: `
        <p class="mb-4 text-gray-300">
            Pressione Ctrl+Shift+N no jogo para ver o NetGraph.
            <br/>Veja a linha "SIM" (Simulation Time). Quanto menor, melhor (ex: 3ms).
            <br/>Para diminuir o SIM, aumente o FPS.
            <br/>Limite o FPS em "Custom" para um valor que você consiga manter estável (ex: 180, 240, 300). FPS oscilando (300 -> 150) causa variação no Input Lag, o que é pior que FPS baixo constante.
        </p>
      `
        },
        {
            title: "Capítulo 7: Efeitos e Poluição Visual",
            content: `
        <p class="mb-4 text-gray-300">
            - <strong>Effects Detail:</strong> Low.
            - <strong>Lighting Quality:</strong> Low.
            <br/>Isso reduz drasticamente o brilho das habilidades (Ult da Moira, Dragões do Hanzo), permitindo que você enxergue o que está acontecendo no meio do caos.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: Menu e Lobby",
            content: `
            <p class="mb-4 text-gray-300">
                O Overwatch renderiza o menu principal (heróis 3D) em qualidade máxima. Isso aquece a GPU.
                <br/>Habilite o limite de FPS no menu para 30 ou 60 para economizar energia entre as partidas.
            </p>
            `
        },
        {
            title: "Capítulo 9: Skins que dão vantagem?",
            content: `
            <p class="mb-4 text-gray-300">
                Algumas skins mudam o som da arma ou o modelo da mira.
                <br/>Ex: A skin "Okami" do Hanzo reduz o som dos dragões (já foi nerfado, mas ainda é sutil).
                <br/>Skins com armas menores (que ocupam menos tela) são preferíveis.
            </p>
            `
        },
        {
            title: "Capítulo 10: Voltris Optimizer no OW2",
            content: `
            <p class="mb-4 text-gray-300">
                O <strong>Voltris Optimizer</strong> ajusta a prioridade do processo <code>Overwatch.exe</code> para evitar que o Windows Update roube CPU durante a Prorrogação (Overtime).
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Tragar o FPS no Display-Based ou Custom?",
            answer: "Sempre Custom. Display-Based + 10 FPS é ok, mas Custom (300 ou 400) é melhor se seu PC aguentar, para reduzir o Input Lag ao mínimo absoluto."
        },
        {
            question: "FSR 1.0 ou 2.2 no Overwatch?",
            answer: "O OW2 tem FSR. Use FSR 1.0 (apenas upscaling simples) se precisar de nitidez. FSR 2.2 pode causar ghosting em movimentos rápidos. Geralmente, Render Scale 100% nativo é melhor para visibilidade."
        },
        {
            question: "Render Scale acima de 100%?",
            answer: "Não. A menos que você queira tirar screenshots 4K. Para jogar, só aumenta o input lag."
        }
    ];

    const externalReferences = [
        { name: "KarQ (Overwatch Tips)", url: "https://www.youtube.com/user/KarQGames" },
        { name: "Overwatch League Settings", url: "https://liquipedia.net/overwatch/" }
    ];

    const relatedGuides = [
        {
            href: "/guias/monitor-hz-configuracao-correta",
            title: "Monitor",
            description: "240Hz+ é recomendado para OW2."
        },
        {
            href: "/guias/reduzir-ping-regedit-cmd-jogos",
            title: "Rede",
            description: "Evite rubberbanding com Tracer."
        },
        {
            href: "/guias/nvidia-painel-controle-melhores-configuracoes",
            title: "Painel Nvidia",
            description: "Modo Latência Ultra."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="40 min"
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
