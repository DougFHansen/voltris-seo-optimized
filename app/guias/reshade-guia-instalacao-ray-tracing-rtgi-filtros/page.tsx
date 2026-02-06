import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'reshade-guia-instalacao-ray-tracing-rtgi-filtros',
    title: "ReShade (2026): Ray Tracing em Qualquer Jogo (Guia RTGI)",
    description: "Transforme jogos antigos com gráficos modernos. Guia de instalação do ReShade, preset de Ray Tracing (RTGI), correção de cores e Sharpness.",
    category: 'software',
    difficulty: 'Intermediário',
    time: '20 min'
};

const title = "ReShade Masterclass: Remasterize Seus Jogos";
const description = "O ReShade é uma ferramenta de injeção de pós-processamento. Você pode adicionar Oclusão de Ambiente, Anti-Aliasing e até Ray Tracing em jogos de 2010 como GTA V ou Skyrim.";

const keywords = [
    'reshade ray tracing rtgi shader marty mcfly download',
    'como instalar reshade roblox sims 4',
    'melhores presets reshade cyberpunk 2077',
    'reshade fps drop fix performance',
    'cas sharpening vs luma sharpen',
    'voltris optimizer graphics',
    'depth buffer access fix'
];

export const metadata: Metadata = createGuideMetadata('reshade-guia-instalacao-ray-tracing-rtgi-filtros', title, description, keywords);

export default function ReShadeGuide() {
    const summaryTable = [
        { label: "Ferramenta", value: "ReShade 6.0+" },
        { label: "Add-on", value: "Full Add-on Support (Opc)" },
        { label: "Shader RT", value: "RTGI (Pascal Gilcher)" },
        { label: "Shader Nitidez", value: "AMD FidelityFX CAS" },
        { label: "Shader Cor", value: "LUT / Vibrance" },
        { label: "Custo FPS", value: "Baixo (Cor) / Alto (RT)" },
        { label: "Online", value: "Risco de Ban (Cuidado)" }
    ];

    const contentSections = [
        {
            title: "Introdução: O que é Post-Processing?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Imagine aplicar filtros do Instagram em tempo real no jogo. O ReShade faz isso, mas com acesso aos dados de profundidade (Depth Buffer) do jogo, permitindo efeitos 3D reais.
        </p>
      `
        },
        {
            title: "Capítulo 1: Instalação Correta",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Passo a Passo</h4>
                <p class="text-gray-400 text-xs text-justify">
                    1. Baixe no site oficial (versão com Add-on support se for jogar offline, versão padrão para online).
                    2. Selecione o executável do jogo.
                    3. Selecione a API (DX9, DX11, Vulkan). O instalador geralmente adivinha certo.
                    4. Pacotes de efeito: Marque "Standard Effects", "SweetFX" e "qUINT".
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Ray Tracing (RTGI)",
            content: `
        <p class="mb-4 text-gray-300">
            O shader <strong>RTGI</strong> (Ray Traced Global Illumination) de Pascal Gilcher "Marty McFly" simula a luz rebatendo nos objetos.
            <br/>Ele é pago (Patreon), mas existem versões beta antigas grátis.
            <br/>Para funcionar, você precisa configurar a aba "Add-ons" > "Depth3D" para alinhar o Depth Buffer. Se a tela ficar branca ou detectar errado, o RT não funciona.
        </p>
      `
        },
        {
            title: "Capítulo 3: Filtros Essenciais (Leves)",
            content: `
        <p class="mb-4 text-gray-300">
            - <strong>CAS (Contrast Adaptive Sharpening):</strong> Remove o borrão do TAA. Deixa a imagem cristalina. Custo: 1 fps.
            - <strong>Vibrance:</strong> Aumenta a saturação das cores inteligentes (não estoura peles).
            - <strong>Curves / Levels:</strong> Corrige o contraste ("preto lavado") de jogos antigos.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: SSR (Reflexos)",
            content: `
        <p class="mb-4 text-gray-300">
            O shader <strong>SSR (Screen Space Reflections)</strong> do pacote qUINT adiciona reflexos no chão molhado em jogos que não têm (ex: GTA San Andreas).
            <br/>Exige configuração fina para não refletir o céu no asfalto seco.
        </p>
      `
        },
        {
            title: "Capítulo 5: MXAO (Ambient Occlusion)",
            content: `
        <p class="mb-4 text-gray-300">
            Adiciona sombras nos cantos e junções de objetos.
            <br/>Dá peso e profundidade à cena. Essencial para jogos antigos (Sims 3, Fallout New Vegas).
            <br/>Custo: Médio (5-10 fps).
        </p>
      `
        },
        {
            title: "Capítulo 6: Depth of Field (Desfoque)",
            content: `
        <p class="mb-4 text-gray-300">
            Cinematic DOF.
            <br/>Foca no personagem e desfoca o fundo igual câmera de cinema.
            <br/>Ótimo para tirar screenshots (Virtual Photography), mas ruim para jogar (esconde inimigos). Defina uma Hotkey para ativar/desativar.
        </p>
      `
        },
        {
            title: "Capítulo 7: Performance Mode",
            content: `
        <p class="mb-4 text-gray-300">
            Depois de configurar tudo, marque a caixa <strong>"Performance Mode"</strong> na aba Home.
            <br/>Isso "cozinha" os shaders e impede que você edite variáveis, mas ganha muito FPS. Nunca jogue com o Performance Mode desligado.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: Jogos Online (Anti-Cheat)",
            content: `
            <p class="mb-4 text-gray-300">
                Jogos como CS2, Valorant e Siege BLOQUEIAM o ReShade (ou versões específicas).
                <br/>FFXIV e Sims 4 permitem.
                <br/>Para jogos competitivos, use o "Nvidia Game Filters" (Alt+F3) que é um ReShade oficial autorizado pelos drivers.
            </p>
            `
        },
        {
            title: "Capítulo 9: Presets Prontos",
            content: `
            <p class="mb-4 text-gray-300">
                Não precisa configurar do zero.
                <br/>Vá ao site "Nexus Mods" ou "SweetFX Database" e baixe um preset (.ini) para seu jogo.
                <br/>Coloque na pasta e selecione no menu do ReShade.
            </p>
            `
        },
        {
            title: "Capítulo 10: Desinstalação",
            content: `
            <p class="mb-4 text-gray-300">
                Para remover, apague o arquivo <code>dxgi.dll</code> (ou d3d11.dll) e a pasta <code>reshade-shaders</code> da pasta do jogo.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Funciona em emulador?",
            answer: "Sim! ReShade no Cemu (Breath of the Wild) ou PCSX2 (Black PS2) faz milagres. Instale na pasta do executável do emulador."
        },
        {
            question: "Perde muito FPS?",
            answer: "Depende. Filtros de cor (LUT, Sharpen) custam 1-2 fps. Iluminação (RTGI, MXAO) custa 20-40% da GPU."
        }
    ];

    const externalReferences = [
        { name: "ReShade Official", url: "https://reshade.me/" },
        { name: "Marty McFly Patreon (RTGI)", url: "https://www.patreon.com/mcflypg" }
    ];

    const relatedGuides = [
        {
            href: "/guias/lossless-scaling-frame-generation-fsr-guia",
            title: "Lossless Scaling",
            description: "Recuperar FPS."
        },
        {
            href: "/guias/sims-4-mods-cc-lags-fix",
            title: "Sims 4",
            description: "Uso comum."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="20 min"
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
