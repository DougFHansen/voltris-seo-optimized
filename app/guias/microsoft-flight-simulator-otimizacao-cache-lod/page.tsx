import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'microsoft-flight-simulator-otimizacao-cache-lod',
    title: "Microsoft Flight Simulator (2026): Rolling Cache, LOD e DLSS 3",
    description: "MSFS é o teste final de hardware. Aprenda a configurar o Rolling Cache no SSD para evitar stutters em Nova York e usar Frame Generation para dobrar o FPS.",
    category: 'jogos',
    difficulty: 'Avançado',
    time: '45 min'
};

const title = "MSFS 2020/2024 (2026): Otimização de Fotogrametria";
const description = "Voar sobre cidades densas exige mais do que GPU. Exige internet, SSD e RAM. Vamos configurar o cache de terreno e o nível de detalhe (LOD).";

const keywords = [
    'flight simulator 2020 stutter fix new york',
    'msfs rolling cache size recommendation 2026',
    'terrain lod factor performance impact',
    'dlss 3 frame generation flight sim',
    'dx11 vs dx12 msfs crash',
    'off screen terrain pre-caching ultra',
    'glass cockpit refresh rate low fps',
    'voltris optimizer bing maps',
    'traffic density ai settings'
];

export const metadata: Metadata = createGuideMetadata('microsoft-flight-simulator-otimizacao-cache-lod', title, description, keywords);

export default function MSFSGuide() {
    const summaryTable = [
        { label: "Rolling Cache", value: "32GB (SSD)" },
        { label: "Terrain LOD", value: "100 (Chão) / 200 (Alto)" },
        { label: "Object LOD", value: "100" },
        { label: "Traffic", value: "Real-Time Online" },
        { label: "DX Version", value: "DX12 (Frame Gen)" },
        { label: "Glass Cockpit", value: "Low Refresh Rate" },
        { label: "Clouds", value: "High (Ultra pesa)" }
    ];

    const contentSections = [
        {
            title: "Introdução: O Simulador de Mundo",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O MSFS baixa o mundo inteiro da nuvem (Azure) enquanto você voa. Se sua internet oscilar, o jogo trava. O segredo é fazer cache local.
        </p>
      `
        },
        {
            title: "Capítulo 1: Rolling Cache (O Fix de Stutter)",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">General Options > Data</h4>
                <p class="text-gray-400 text-xs text-justify">
                    - <strong>Rolling Cache:</strong> ON.
                    <br/>- <strong>Limit:</strong> Defina para <span class="text-emerald-400">32GB ou 64GB</span>. (O padrão de 8GB é muito pouco para voos longos).
                    <br/>- <strong>Path:</strong> Aponte para seu SSD NVMe mais rápido. Nunca coloque no HD.
                    <br/>Isso guarda a fotogrametria de cidades que você visitou, evitando baixar de novo e eliminando as travadas de carregamento.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Terrain LOD Factor",
            content: `
        <p class="mb-4 text-gray-300">
            - <strong>Terrain Level of Detail (LOD):</strong> O devorador de FPS.
            - Valor 100: Bom equilíbrio.
            - Valor 200: Ultra. Prédios distantes ficam nítidos, mas o FPS cai pela metade em Londres/NY.
            - Valor 400: Apenas para screenshots ou RTX 5090.
            <br/>Recomendação: Mantenha em 100-150.
        </p>
      `
        },
        {
            title: "Capítulo 3: DX11 vs DX12 (Frame Gen)",
            content: `
        <p class="mb-4 text-gray-300">
            - <strong>DX11:</strong> Estável, compatível com addons antigos. Sem Frame Generation.
            - <strong>DX12 (Beta/Preview):</strong> Melhor uso de CPU Multi-core. Necessário para ativar <strong>DLSS 3 Frame Generation</strong>.
            - Se você tem RTX 4000, use DX12 + Frame Gen. O FPS vai de 40 para 80, e como é um simulador civil, o input lag não importa.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: Glass Cockpit Refresh Rate",
            content: `
        <p class="mb-4 text-gray-300">
            Aviões modernos (A320, 787, G1000) têm telas digitais no painel.
            <br/>Em "Traffic", procure <strong>"Glass Cockpit Refresh Rate"</strong>.
            <br/>Mude de High para <strong>Medium</strong> ou <strong>Low</strong>.
            <br/>Isso faz os números do altímetro atualizarem a 30fps/20fps em vez de 60fps, economizando MUITA CPU sem afetar a pilotagem.
        </p>
      `
        },
        {
            title: "Capítulo 5: Tráfego AI e Multiplayer",
            content: `
        <p class="mb-4 text-gray-300">
            - <strong>Traffic Type:</strong> Real-Time Online. (Usa dados reais de voos, leve).
            - <strong>AI Offline Traffic:</strong> Pesado. O PC simula rotas. Desative.
            - <strong>Ground Aircraft Density:</strong> 50 ou menos. Muitos aviões parados no gate matam o FPS ao pousar no Heathrow.
        </p>
      `
        },
        {
            title: "Capítulo 6: Off-Screen Terrain Pre-Caching",
            content: `
        <p class="mb-4 text-gray-300">
            Defina como <strong>Ultra</strong>.
            <br/>Isso faz o jogo carregar o terreno atrás de você e nas laterais. Quando você vira a câmera rápido (olhar pela janela), não tem stutter e o terreno já está lá. Consome muita RAM (32GB recomendados).
        </p>
      `
        },
        {
            title: "Capítulo 7: Nuvens Volumétricas",
            content: `
        <p class="mb-4 text-gray-300">
            - <strong>Volumetric Clouds:</strong> High.
            <br/>O Ultra deixa as nuvens um pouco mais fofas, mas custa 15-20% de performance em dias nublados. No High já são as melhores nuvens de qualquer jogo.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: Community Folder (Addons)",
            content: `
            <p class="mb-4 text-gray-300">
                O MSFS demora 10 minutos pra abrir?
                <br/>Você tem muitos addons na pasta Community sem usar.
                <br/>Use o <strong>MSFS Addons Linker</strong> (externo) para ativar apenas os cenários que você vai voar hoje.
            </p>
            `
        },
        {
            title: "Capítulo 9: Bing Maps Data",
            content: `
            <p class="mb-4 text-gray-300">
                Se as cidades parecerem "genéricas" e feias:
                <br/>Verifique em Data se <strong>"Bing Data World Graphics"</strong> está ON. Às vezes o jogo desliga sozinho se a internet cair.
            </p>
            `
        },
        {
            title: "Capítulo 10: VR Optimization",
            content: `
            <p class="mb-4 text-gray-300">
                Para VR (Quest 3/Reverb G2): Use DLSS Performance e OpenXR Toolkit para fazer Foveated Rendering (renderizar só o centro da visão em alta qualidade).
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Fotogrametria ON ou OFF?",
            answer: "ON se tiver internet boa (100MB+). OFF se tiver internet lenta, pois o cenário fica carregando 'pop-in' e derretido. O cenário genérico offline é mais leve."
        },
        {
            question: "Funciona com 16GB de RAM?",
            answer: "Sofrivelmente. O jogo usa 20GB+ facilmente em grandes cidades. Feche o Chrome e tudo mais."
        },
        {
            question: "Joystick desconecta?",
            answer: "Desative a economia de energia das portas USB no Gerenciador de Dispositivos do Windows."
        }
    ];

    const externalReferences = [
        { name: "MSFS Addons Linker", url: "https://flightsim.to/file/1572/msfs-addons-linker" },
        { name: "FlightSim.to (Mods)", url: "https://flightsim.to/" }
    ];

    const relatedGuides = [
        {
            href: "/guias/otimizacao-ssd-windows-11",
            title: "SSD",
            description: "Cache Size."
        },
        {
            href: "/guias/reduzir-ping-exitlag-noping-dns",
            title: "Internet",
            description: "Download de mapas."
        },
        {
            href: "/guias/nvidia-painel-controle-melhores-configuracoes",
            title: "Nvidia",
            description: "Frame Gen config."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="45 min"
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
