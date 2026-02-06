import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'minecraft-shaders-iris-sodium-otimizacao-fps',
    title: "Minecraft (2026): Shaders Leves + Sodium (100+ FPS)",
    description: "Optifine morreu. Aprenda a instalar Fabric, Sodium, Iris e Lithium para rodar Minecraft com Shaders realistas e FPS alto.",
    category: 'jogos',
    difficulty: 'Iniciante',
    time: '20 min'
};

const title = "Minecraft Next-Gen: Sodium + Iris Guide";
const description = "O Optifine era bom em 2015. Hoje, o combo Sodium (Performance) + Iris (Shaders) entrega 3x mais FPS e carrega o mundo instantaneamente. Veja como migrar.";

const keywords = [
    'minecraft fabric loader install guide',
    'sodium vs optifine benchmark 2026',
    'iris shaders complementary reimagined settings',
    'distant horizons mod lod render distance',
    'best minecraft performance mods list',
    'bsl shaders config low end pc',
    'voltris optimizer minecraft',
    'tlauncher fabric support'
];

export const metadata: Metadata = createGuideMetadata('minecraft-shaders-iris-sodium-otimizacao-fps', title, description, keywords);

export default function MinecraftGuide() {
    const summaryTable = [
        { label: "Modloader", value: "Fabric (Leve)" },
        { label: "Engine", value: "Sodium (FPS Boost)" },
        { label: "Shaders", value: "Iris (Suporte Optifine)" },
        { label: "Shader Pack", value: "Complementary Reimagined" },
        { label: "Java", value: "Java 21 (MC 1.20+)" },
        { label: "Launcher", value: "Prism / Modrinth" },
        { label: "FPS", value: "144+ (Com Shaders)" }
    ];

    const contentSections = [
        {
            title: "Introdução: Optifine vs Sodium",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O Optifine é código fechado e quebra muitos mods.
          <br/>O <strong>Sodium</strong> reescreveu o motor de renderização do jogo. Resultado: PC que rodava a 40fps agora roda a 150fps.
          <br/>O <strong>Iris</strong> adiciona suporte a Shaders em cima do Sodium.
        </p>
      `
        },
        {
            title: "Capítulo 1: Instalação (Fácil)",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Iris Installer</h4>
                <p class="text-gray-400 text-xs text-justify">
                    1. Baixe o <strong>Iris Installer</strong> no site oficial (irisshaders.net).
                    2. Execute o .jar.
                    3. Escolha "Iris + Sodium".
                    4. Escolha a versão do jogo (ex: 1.21).
                    5. Clique em Install.
                    6. Abra seu Launcher (Original ou TLauncher) e selecione o perfil "Iris". Pronto.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Escolhendo o Shader",
            content: `
        <p class="mb-4 text-gray-300">
            Baixe shaders no Modrinth ou CurseForge.
            <br/>- <strong>Complementary Reimagined:</strong> O melhor e mais bonito. Tem perfil "Potato" para PC fraco e "Ultra" para RTX. Nuvens volumétricas lindas.
            <br/>- <strong>BSL Shaders:</strong> Visual suave, menos contraste.
            <br/>- <strong>MakeUp - Ultra Fast:</strong> Para quem tem GPU integrada (Intel HD).
            <br/>Coloque o .zip na pasta <code>.minecraft/shaderpacks</code>.
            <br/>Ative no menu Video Settings (Interface do Iris).
        </p>
      `
        },
        {
            title: "Capítulo 3: Distant Horizons (Visão Infinita)",
            content: `
        <p class="mb-4 text-gray-300">
            Este mod (famoso LOD) permite ver 100 ou 500 chunks de distância sem travar o PC.
            <br/>Ele renderiza o terreno distante com qualidade baixa.
            <br/>Compatível com Iris (versões beta) e Complementary.
            <br/>Transforma o Minecraft num jogo de mundo aberto AAA.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: Mods de Otimização Extras",
            content: `
        <p class="mb-4 text-gray-300">
            A "Santíssima Trindade" do Fabric:
            <br/>1. <strong>Sodium:</strong> Renderização gráfica.
            <br/>2. <strong>Lithium:</strong> Otimização da lógica do servidor (física, IA de mobs). Essencial para Single Player não travar.
            <br/>3. <strong>Indium:</strong> Compatibilidade para mods que usam renderização avançada.
            <br/>Outros: <strong>FerriteCore</strong> (Reduz uso de RAM), <strong>ModernFix</strong> (Carrega mais rápido).
        </p>
      `
        },
        {
            title: "Capítulo 5: Zoom (Substituto do C no Optifine)",
            content: `
        <p class="mb-4 text-gray-300">
            O Sodium não tem zoom nativo.
            <br/>Instale o mod <strong>Zoomify</strong> ou <strong>Ok Zoomer</strong>.
            <br/>Eles oferecem zoom suave com scroll do mouse, muito melhor que o zoom seco do Optifine.
        </p>
      `
        },
        {
            title: "Capítulo 6: Dynamic Lights (Tocha na Mão)",
            content: `
        <p class="mb-4 text-gray-300">
            Para a tocha iluminar enquanto você segura ela:
            <br/>Instale o mod <strong>LambDynamicLights</strong>.
        </p>
      `
        },
        {
            title: "Capítulo 7: Configuração de RAM",
            content: `
        <p class="mb-4 text-gray-300">
            Não aloque toda sua RAM!
            <br/>Para Vanilla + Shaders: 4GB é ideal.
            <br/>Para Modpacks pesados (300 mods): 6GB a 8GB.
            <br/>Colocar mais que 8GB piora a performance pelo "Java Garbage Collection" (lag spikes a cada 10s limpando memória).
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: TLauncher e Piratas",
            content: `
            <p class="mb-4 text-gray-300">
                Funciona igual. Selecione a versão "Fabric" na lista, instale os mods na pasta <code>mods</code> manualmente.
                <br/>Mas cuidado com Launchers duvidosos. O Prism Launcher (versão cracked) é mais seguro e gerencia mods melhor.
            </p>
            `
        },
        {
            title: "Capítulo 9: Atualização de Drivers",
            content: `
            <p class="mb-4 text-gray-300">
                O Minecraft OpenGL é sensível a drivers.
                <br/>Em GPUs AMD no Windows, o driver antigo era horrível. Os drivers 2023+ melhoraram 100% o OpenGL. Atualize!
            </p>
            `
        },
        {
            title: "Capítulo 10: VSync vs Unlimited",
            content: `
            <p class="mb-4 text-gray-300">
                No Sodium, deixe VSync: OFF e Max Framerate: Unlimited para gerar chunks rápido. Se tiver tearing, use VSync.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Posso usar mods Forge?",
            answer: "Não. Iris/Sodium são para Fabric. Existe um port para Forge (Embeddium/Oculus), mas é menos estável. Fabric é o futuro para performance."
        },
        {
            question: "Água realista?",
            answer: "No menu de Shaders > Shader Options > Water. Ative 'Water Parallax' ou 'Real Time Water Reflections'."
        }
    ];

    const externalReferences = [
        { name: "Iris Shaders", url: "https://irisshaders.net/" },
        { name: "Modrinth (Mods)", url: "https://modrinth.com/" }
    ];

    const relatedGuides = [
        {
            href: "/guias/roblox-fps-unlocker-bloat-fix",
            title: "Roblox",
            description: "Outro Sandbox."
        },
        {
            href: "/guias/memoria-virtual-pagefile-ssd-otimizacao",
            title: "RAM",
            description: "Evitar crash."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="20 min"
            difficultyLevel="Iniciante"
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
