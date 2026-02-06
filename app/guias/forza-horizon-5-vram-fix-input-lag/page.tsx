import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'forza-horizon-5-vram-fix-input-lag',
    title: "Forza Horizon 5 (2026): VRAM Fix, Texturas Sumindo e Volante",
    description: "Texturas do chão somem depois de 1 hora jogando? Aprenda a corrigir o vazamento de VRAM, configurar Force Feedback no volante e otimizar Ray Tracing.",
    category: 'jogos',
    difficulty: 'Intermediário',
    time: '25 min'
};

const title = "Forza Horizon 5 Tuning (2026): Gráficos e Volante";
const description = "FH5 é o rei dos arcades, mas sofre com 'Texture Streaming' em placas de 8GB VRAM. Vamos ajustar as configurações para evitar o bug do mapa invisível.";

const keywords = [
    'forza horizon 5 texturas sumindo fix pc',
    'fh5 vram usage warning disable',
    'volante g29 force feedback fraco forza',
    'ray tracing forza horizon 5 gameplay',
    'environmental texture quality extreme bug',
    'input lag volante forza horizon 5',
    'tessellation quality performance fh5',
    'dlss vs dlaa forza 5',
    'voltris optimizer playground games',
    'fix crash no logo inicial forza'
];

export const metadata: Metadata = createGuideMetadata('forza-horizon-5-vram-fix-input-lag', title, description, keywords);

export default function ForzaGuide() {
    const summaryTable = [
        { label: "Environment Textures", value: "High (NÃO Extreme)" },
        { label: "Geometry", value: "High" },
        { label: "Shadows", value: "High" },
        { label: "Ray Tracing", value: "Car Only / Off" },
        { label: "MSAA", value: "2x" },
        { label: "Resolution Scaling", value: "DLSS Quality" },
        { label: "Volante", value: "FFB Invertido (Às vezes)" }
    ];

    const contentSections = [
        {
            title: "Introdução: O Bug das Texturas (Extreme)",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O preset "Extreme" de texturas ambientais exige mais de 10GB de VRAM. Se você tem uma RTX 3070/4060 (8GB), o jogo roda liso, mas depois de 30 minutos o chão fica transparente.
        </p>
      `
        },
        {
            title: "Capítulo 1: Environment Texture Quality (Crítico)",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Mantenha no HIGH ou ULTRA</h4>
                <p class="text-gray-400 text-xs text-justify">
                    NUNCA coloque em Extreme a menos que tenha 12GB+ de VRAM (RTX 3080 ti, 4070, RX 6700 XT).
                    <br/>A diferença visual é mínima rodando a 200km/h, mas o High carrega as texturas instantaneamente.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Ray Tracing (Audio e Visual)",
            content: `
        <p class="mb-4 text-gray-300">
            Forza agora tem Ray Tracing in-game (antes era só na garagem).
            <br/>- <strong>Car Reflections:</strong> Bonito, mas pesado. Use se tiver GPU sobrando.
            <br/>- <strong>Audio Ray Tracing:</strong> Use! A CPU calcula como o som do motor bate nas paredes dos túneis e cânions. Incrível e leve em CPUs modernas.
        </p>
      `
        },
        {
            title: "Capítulo 3: Input Lag no Volante (G29/G920)",
            content: `
        <p class="mb-4 text-gray-300">
            Sente o carro "flutuando"?
            <br/>Em Configurações Avançadas de Controle:
            <br/>- <strong>Vibração:</strong> OFF.
            <br/>- <strong>Escala de Amortecimento do Centro (Center Spring):</strong> 0 ou Baixo. Isso é força artificial que atrapalha o Force Feedback real da física.
            <br/>- <strong>Deadzone (Zona Morta):</strong> Interior 0, Exterior 100.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: DLSS, FSR e TAA",
            content: `
        <p class="mb-4 text-gray-300">
            - <strong>TAA (Nativo):</strong> Embaçado em movimento. Melhor evitar.
            - <strong>MSAA 2x:</strong> Clássico, nítido, mas serrilhado nas árvores.
            - <strong>DLSS Quality:</strong> A melhor opção moderna. Remove serrilhados de folhagem melhor que MSAA e ganha FPS.
            - <strong>DLAA:</strong> Use se tiver GPU sobrando. É o DLSS rodando na resolução nativa (sem upscaling) para qualidade máxima de imagem.
        </p>
      `
        },
        {
            title: "Capítulo 5: Tessellation e Deformação",
            content: `
        <p class="mb-4 text-gray-300">
            - <strong>Environment Geometry:</strong> High.
            - <strong>Deformable Terrain Quality:</strong> High/Ultra.
            <br/>Isso afeta os rastros na lama e areia. É o charme do jogo, tente manter alto.
        </p>
      `
        },
        {
            title: "Capítulo 6: SSAO (Sombreamento)",
            content: `
        <p class="mb-4 text-gray-300">
            Use <strong>High</strong>.
            <br/>O SSAO dá profundidade às rodas e para-choques. No Low, o carro parece que não está encostando no chão (flutuando).
        </p>
      `
        },
        {
            title: "Capítulo 7: Night Shadows (Sombras Noturnas)",
            content: `
        <p class="mb-4 text-gray-300">
            Geralmente "Night Shadows" pode ser desligado.
            <br/>Você raramente repara nas sombras projetadas pelos faróis de outros carros em corridas noturnas rápidas. Ganha bastante FPS à noite no High/Ultra.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: Modo Online (Convoy Lag)",
            content: `
            <p class="mb-4 text-gray-300">
                Se os carros dos amigos ficam "pulando" ou sumindo:
                <br/>É problema de Teredo IPsec no Windows.
                <br/>Vá em Configurações > Jogos > Rede Xbox e clique em "Corrigir". Ou use o Voltris Optimizer que reseta o serviço Teredo.
            </p>
            `
        },
        {
            title: "Capítulo 9: FPS Cap (Estabilidade)",
            content: `
            <p class="mb-4 text-gray-300">
                Para jogos de corrida, framepacing > frame rate.
                <br/>É melhor jogar travado em 72 FPS sólidos do que oscilar entre 90 e 110. A sensação de velocidade é mais constante.
            </p>
            `
        },
        {
            title: "Capítulo 10: HDD Loading",
            content: `
            <p class="mb-4 text-gray-300">
                Se você rodar a 300km/h com o jogo no HD, o jogo vai pausar e mostrar "Low streaming bandwidth".
                <br/>Instale no SSD.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "O jogo fecha na logo inicial?",
            answer: "Conflito com overlay (Afterburner, Discord) ou antivírus. Adicione exclusão e feche overlays."
        },
        {
            question: "Volante Logitech não vibra?",
            answer: "Requer o software Logitech G Hub aberto ANTES de abrir o jogo. Se abrir depois, o jogo não pega o driver corretamente."
        },
        {
            question: "Funciona em 8GB de RAM?",
            answer: "Sim, é muito bem otimizado, mas feche o navegador."
        }
    ];

    const externalReferences = [
        { name: "Forza Support (Known Issues)", url: "https://support.forzamotorsport.net/" },
        { name: "Logitech G Hub", url: "https://www.logitechg.com/en-us/innovation/g-hub.html" }
    ];

    const relatedGuides = [
        {
            href: "/guias/otimizacao-ssd-windows-11",
            title: "SSD",
            description: "Evita streaming banwidth error."
        },
        {
            href: "/guias/controle-ps4-ps5-overclock-ds4windows",
            title: "Controle (Gamepad)",
            description: "Para quem não tem volante."
        },
        {
            href: "/guias/hdr-windows-11-calibracao-jogos",
            title: "HDR",
            description: "Forza tem HDR nativo perfeito."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="25 min"
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
