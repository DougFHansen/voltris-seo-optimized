import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'baldurs-gate-3-otimizacao-ato-3-fps',
    title: "Baldur's Gate 3 (2026): Otimização do Ato 3, DLSS e Mods de Câmera",
    description: "O Ato 3 em Baldur's Gate trava? Aprenda a otimizar a CPU na cidade baixa, usar DLSS para ganhar 30 FPS e ativar a Câmera Livre para screenshots.",
    category: 'jogos',
    difficulty: 'Intermediário',
    time: '30 min'
};

const title = "Baldur's Gate 3 (2026): Performance no Ato 3";
const description = "BG3 é uma obra-prima, mas a Cidade Baixa (Ato 3) é um pesadelo para CPUs. Vamos aliviar a carga e manter a imersão.";

const keywords = [
    'baldurs gate 3 ato 3 travando muito fix',
    'bg3 melhores configurações graficas pc fraco',
    'camera nativa bg3 mod wasd movement',
    'dlss vs dlaa baldurs gate 3 qualidade',
    'vulkan vs dx11 bg3 crash',
    'crowd density bg3 performance',
    'hdd mode bg3 texture loading',
    'shadow quality medium vs low',
    'voltris optimizer larian studios',
    'fsr 2.2 bg3 update'
];

export const metadata: Metadata = createGuideMetadata('baldurs-gate-3-otimizacao-ato-3-fps', title, description, keywords);

export default function BG3Guide() {
    const summaryTable = [
        { label: "API", value: "DX11 (Estável) / Vulkan" },
        { label: "DLSS", value: "Quality" },
        { label: "Model Quality", value: "High (Personagens)" },
        { label: "Shadows", value: "Medium" },
        { label: "Crowd", value: "Low (Ato 3)" },
        { label: "God Rays", value: "Off" },
        { label: "HDD Mode", value: "Auto" }
    ];

    const contentSections = [
        {
            title: "Introdução: O Gargalo da CPU",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          No Ato 1 e 2, o jogo é leve. No Ato 3, a quantidade de NPCs na tela triplica. Isso não pesa na placa de vídeo, pesa no processador (IA, pathfinding). A única solução real é reduzir a complexidade da simulação.
        </p>
      `
        },
        {
            title: "Capítulo 1: Vulkan vs DirectX 11",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Qual escolher?</h4>
                <p class="text-gray-400 text-xs text-justify">
                    No launcher da Larian:
                    <br/>- <strong>DirectX 11:</strong> Mais estável, menos crashes, carregamento um pouco mais lento. Recomendado para Nvidia.
                    <br/>- <strong>Vulkan:</strong> Melhor performance de CPU (Ato 3), mas pode ter glitches visuais ou fechar do nada. Recomendado para AMD/Steam Deck.
                    <br/>Teste o Vulkan primeiro. Se travar, vá de DX11.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Configurações Gráficas (Otimizadas)",
            content: `
        <p class="mb-4 text-gray-300">
            - <strong>Model Quality:</strong> High. (Não baixe isso, os rostos ficam feios e você passa 50% do tempo em diálogos close-up).
            - <strong>Shadow Quality:</strong> Medium.
            - <strong>Cloud Quality:</strong> Low. Ninguém olha pro céu.
            - <strong>Fog Quality:</strong> Low. A neblina é pesada.
            - <strong>Instance Distance:</strong> Medium. Reduz a distância que objetos pequenos (pedras, grama) aparecem.
        </p>
      `
        },
        {
            title: "Capítulo 3: Bloqueio de FPS (Cap)",
            content: `
        <p class="mb-4 text-gray-300">
            BG3 é um jogo lento (turn-based). Rodar a 144 FPS faz sua GPU gritar e esquentar à toa.
            <br/>Limite o FPS a <strong>60</strong> ou <strong>72</strong>.
            <br/>Isso deixa a GPU fria e silenciosa, sem perder fluidez real no combate tático.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: DLSS e DLAA",
            content: `
        <p class="mb-4 text-gray-300">
            - <strong>DLSS Quality:</strong> Use se quiser mais FPS. A implementação é ótima.
            - <strong>DLAA (Deep Learning Anti-Aliasing):</strong> Use se tiver FPS sobrando (RTX 4080). É melhor que o TAA nativo, a imagem fica cristalina, mas custa performance.
            - <strong>FSR 2.2:</strong> Use se não tiver Nvidia. É decente, mas tem um pouco de "shimmering" em cabelos.
        </p>
      `
        },
        {
            title: "Capítulo 5: Otimização do Ato 3 (Crowd)",
            content: `
        <p class="mb-4 text-gray-300">
            Opção: "Dynamic Crowd" ou <strong>"Slow HDD Mode"</strong>.
            <br/>Ativar o HDD Mode pode ajudar a CPU a não travar tentando carregar mil texturas de NPCs ao mesmo tempo na cidade.
            <br/>Reduza a resolução das sombras e a Oclusão Ambiental especificamente nessa área.
        </p>
      `
        },
        {
            title: "Capítulo 6: Mod de Câmera (WASD)",
            content: `
        <p class="mb-4 text-gray-300">
            O jogo controla pelo mouse (Point & Click).
            <br/>O mod <strong>"WASD Character Movement"</strong> permite andar com WASD e girar a câmera com o mouse, parecendo um RPG de ação em terceira pessoa (como Dragon Age). Imersão total.
        </p>
      `
        },
        {
            title: "Capítulo 7: God Rays (Raios de Deus)",
            content: `
        <p class="mb-4 text-gray-300">
            Desative <strong>"God Rays"</strong> e <strong>"Bloom"</strong> se tiver sensibilidade à luz ou quiser imagem mais limpa. O Bloom do BG3 é muito forte e "estoura" o branco em cenas de sonho.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: Save Games (Lentidão)",
            content: `
            <p class="mb-4 text-gray-300">
                Se o jogo demora pra salvar ou carregar, é porque você tem 500 saves.
                <br/>A nuvem da Steam (Larian Cross-Save) demora pra sincronizar.
                <br/>Delete saves antigos (Quicksaves) regularmente. Mantenha só os últimos 10.
            </p>
            `
        },
        {
            title: "Capítulo 9: Launcher Bypass",
            content: `
            <p class="mb-4 text-gray-300">
                O Larian Launcher fica aberto comendo RAM.
                <br/>Na Steam, opções de inicialização: <code>--skip-launcher</code>.
                <br/>O jogo abre direto, economizando 200MB de RAM.
            </p>
            `
        },
        {
            title: "Capítulo 10: SSD Obrigatório",
            content: `
            <p class="mb-4 text-gray-300">
                Não tente jogar BG3 no HD. As texturas do chão não carregam e você cai no void.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Funciona no Steam Deck?",
            answer: "Sim, verificado. Use FSR Balanceado e travado a 30 FPS para bateria durar 2h. No Ato 3 cai para 20 FPS, é normal hardware portátil não aguentar a CPU."
        },
        {
            question: "Modo Honra (Honor Mode) crashou, perdi o save?",
            answer: "Se o jogo crashar (não Alt+F4), o save continua válido. Se morrer, vira Custom Mode. Faça backup manual da pasta de save se tiver medo de bugs."
        },
        {
            question: "Tela dividida (Co-op Local)?",
            answer: "Funciona, mas o jogo renderiza duas instâncias. O FPS cai pela metade. Requer GPU forte (3060Ti+)."
        }
    ];

    const externalReferences = [
        { name: "Nexus Mods BG3", url: "https://www.nexusmods.com/baldursgate3" },
        { name: "Larian Forums", url: "https://forums.larian.com/" }
    ];

    const relatedGuides = [
        {
            href: "/guias/otimizacao-ssd-windows-11",
            title: "SSD",
            description: "Loadings rápidos."
        },
        {
            href: "/guias/cheat-engine-speedhack-jogos-offline",
            title: "Cheat Engine",
            description: "Acelerar combates fáceis."
        },
        {
            href: "/guias/teclado-mecanico-rapid-trigger-snap-tap",
            title: "Teclado",
            description: "Melhor conforto."
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
