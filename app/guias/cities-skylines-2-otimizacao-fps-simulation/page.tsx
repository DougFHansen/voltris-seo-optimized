import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'cities-skylines-2-otimizacao-fps-simulation',
    title: "Cities: Skylines II (2026): Configurações para 30 FPS Estáveis",
    description: "CS2 é notoriamente pesado. Aprenda a desativar volumetria, reduzir a simulação de dentes dos cidadãos e usar o DLSS para tornar cidades gigantes jogáveis.",
    category: 'jogos',
    difficulty: 'Avançado',
    time: '30 min'
};

const title = "Cities: Skylines II (2026): Otimizando o Caos";
const description = "No lançamento, o jogo renderizava os dentes de cada cidadão. Em 2026, melhorou, mas ainda exige ajustes cirúrgicos para não travar em 10 FPS.";

const keywords = [
    'cities skylines 2 fps boost guide 2026',
    'cs2 simulation speed slow fix',
    'volumetric quality settings cities skylines 2',
    'level of detail distance cs2',
    'dlss cities skylines 2 mod',
    'traffic simulation heavy cpu usage',
    'depth of field disable cs2',
    'voltris optimizer colossal order',
    'cidades grandes travando cs2 fix'
];

export const metadata: Metadata = createGuideMetadata('cities-skylines-2-otimizacao-fps-simulation', title, description, keywords);

export default function CS2Guide() {
    const summaryTable = [
        { label: "Volumetrics", value: "Disabled (Ganho Alto)" },
        { label: "DOF", value: "Disabled (Tilt Shift)" },
        { label: "Shadows", value: "Medium" },
        { label: "LOD", value: "Low / Medium" },
        { label: "VSync", value: "Off" },
        { label: "Resolution", value: "DLSS Quality" },
        { label: "FPS Alvo", value: "30 (Aceitável)" }
    ];

    const contentSections = [
        {
            title: "Introdução: 30 FPS é o Novo 60",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Em City Builders, você não precisa de 144 FPS. O foco é a velocidade da simulação. Se o jogo roda a 30 FPS mas o tempo passa rápido (3x Speed), está ótimo. Se roda a 60 FPS mas o tempo está em câmera lenta, sua CPU gargalou.
        </p>
      `
        },
        {
            title: "Capítulo 1: Volumetrics Quality (O Vilão)",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Desligue Imediatamente</h4>
                <p class="text-gray-400 text-xs text-justify">
                    A qualidade volumétrica (nuvens, fumaça) é absurdamente pesada neste jogo.
                    <br/>Vá em Graphics > Advanced:
                    <br/>- <strong>Volumetrics Quality Settings:</strong> Disabled ou Very Low.
                    <br/>Visualmente muda pouco (o céu fica menos "fofo"), mas o ganho de FPS é de quase 40%.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Depth of Field (Tilt Shift)",
            content: `
        <p class="mb-4 text-gray-300">
            O efeito de "miniatura" (fundo borrado) consome GPU.
            <br/>- <strong>Depth of Field Mode:</strong> Disabled.
            <br/>Além de ganhar performance, você vê sua cidade com clareza total, o que é melhor para planejar estradas.
        </p>
      `
        },
        {
            title: "Capítulo 3: Level of Detail (LOD)",
            content: `
        <p class="mb-4 text-gray-300">
            O jogo renderiza janelas e móveis dentro dos prédios.
            <br/>- <strong>Level of Detail Distance:</strong> Low.
            <br/>Isso faz os modelos de alta qualidade (com dentes e móveis) só aparecerem quando você dá zoom muito perto. De longe, usa modelos simplificados.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: DLSS e TAA",
            content: `
        <p class="mb-4 text-gray-300">
            Use <strong>DLSS Quality</strong> se tiver Nvidia.
            <br/>Se não, use TAA.
            <br/>A escala de resolução dinâmica deve ser evitada pois causa borrão quando você move a câmera. Prefira DLSS fixo.
        </p>
      `
        },
        {
            title: "Capítulo 5: Simulação de Tráfego",
            content: `
        <p class="mb-4 text-gray-300">
            O tráfego é calculado pela CPU.
            <br/>Em cidades com 100k habitantes, o tráfego pode fazer a simulação ficar lenta ("Simulation Speed" cai).
            <br/>Não há configuração gráfica para isso. A solução é melhorar o design das suas estradas (Road Hierarchy) para ter menos carros parados calculando rotas alternativas.
        </p>
      `
        },
        {
            title: "Capítulo 6: Shadows e Global Illumination",
            content: `
        <p class="mb-4 text-gray-300">
            - <strong>Global Illumination:</strong> Low.
            - <strong>Reflections:</strong> Low.
            <br/>A água é bonita, mas pesada. Reflexos de prédios na água consomem VRAM.
        </p>
      `
        },
        {
            title: "Capítulo 7: Mods de Performance",
            content: `
        <p class="mb-4 text-gray-300">
            Use o gerenciador de mods oficial (Paradox Mods).
            <br/>Procure por mods que removem "props" desnecessários (latas de lixo, bancos de praça) em massa. Menos objetos = Menos polígonos.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: 100k Habitantes (Olimpo)",
            content: `
            <p class="mb-4 text-gray-300">
                Ao passar de 100.000 habitantes, o jogo vai ficar lento. É inevitável até em CPUs Threadripper. Aceite a velocidade 1x e curta a paisagem.
            </p>
            `
        },
        {
            title: "Capítulo 9: Autosave Interval",
            content: `
            <p class="mb-4 text-gray-300">
                O salvamento automático causa uma travada de 2 segundos.
                <br/>Aumente o intervalo para cada 15 ou 30 minutos em vez de 5, para não interromper seu fluxo.
            </p>
            `
        },
        {
            title: "Capítulo 10: V-Sync Off",
            content: `
            <p class="mb-4 text-gray-300">
                Se você tem 30-40 FPS, V-Sync causa input lag no mouse. Deixe desligado ou use G-Sync/FreeSync para suavizar a câmera.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "GPU em 100% no menu?",
            answer: "O menu principal renderiza uma cidade 3D em tempo real. É normal. Não se assuste."
        },
        {
            question: "Crash to Desktop?",
            answer: "Falta de memória virtual. CS2 usa muita RAM. Se estourar seus 16GB/32GB, ele fecha. Aumente o Pagefile do Windows."
        },
        {
            question: "Qual CPU comprar?",
            answer: "Mais núcleos é melhor. Ryzen 9 7950X ou i9 14900K são reis aqui. O Cache 3D (X3D) ajuda muito na simulação."
        }
    ];

    const externalReferences = [
        { name: "Paradox Mods CS2", url: "https://mods.paradoxplaza.com/games/cities_skylines_2" },
        { name: "CO Word of the Week (Dev Diary)", url: "https://www.paradoxinteractive.com/games/cities-skylines-ii/news" }
    ];

    const relatedGuides = [
        {
            href: "/guias/bios-otimizacao-xmp-tpm",
            title: "BIOS",
            description: "XMP crucial para simulação."
        },
        {
            href: "/guias/otimizacao-ssd-windows-11",
            title: "SSD",
            description: "Pagefile (Memória Virtual)."
        },
        {
            href: "/guias/notebook-gamer-bateria-otimizacao",
            title: "Notebook",
            description: "Vai esquentar bastante."
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
