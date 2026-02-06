import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'minecraft-aumentar-fps-fabric-sodium',
    title: "Minecraft 2026: Aumente o FPS em 300% com Fabric e Sodium",
    description: "Diga adeus ao Optifine. Aprenda a instalar o combo moderno de performance: Fabric + Sodium + Lithium + Iris Shaders. O guia definitivo para PC Fraco.",
    category: 'jogos',
    difficulty: 'Fácil',
    time: '30 min'
};

const title = "Minecraft Optimization (2026): A Era Pós-Optifine (Sodium & Iris)";
const description = "O Optifine está obsoleto. As novas engines de renderização (Sodium) usam a GPU de forma moderna, entregando 500+ FPS onde o Optifine entregava 60.";

const keywords = [
    'minecraft aumentar fps pc fraco 2026',
    'sodium vs optifine qual melhor',
    'como instalar fabric loader minecraft',
    'iris shaders vs optifine shaders',
    'mod lithium performance server',
    'alocar mais ram minecraft tlauncher',
    'minecraft travando ao gerar mundo',
    'melhores configuracoes sodium video',
    'nvidium mod rtx 3060 minecraft',
    'ferritecore ram usage fix'
];

export const metadata: Metadata = createGuideMetadata('minecraft-aumentar-fps-fabric-sodium', title, description, keywords);

export default function MinecraftGuide() {
    const summaryTable = [
        { label: "Loader", value: "Fabric (Mais leve)" },
        { label: "Render", value: "Sodium (Obrigatório)" },
        { label: "Shaders", value: "Iris (Opcional)" },
        { label: "Logic", value: "Lithium (Server-Side)" },
        { label: "RAM", value: "FerriteCore" },
        { label: "Luz", value: "Phosphor/Starlight" },
        { label: "Alloc RAM", value: "4GB (Vanilla) / 8GB (Modded)" }
    ];

    const contentSections = [
        {
            title: "Introdução: Por que não usar Optifine?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O Optifine foi rei por 10 anos, mas seu código é fechado e invasivo. O <strong>Sodium</strong> é open-source e reescreve o pipeline de renderização do Minecraft usando OpenGL moderno. O resultado? Enquanto o Optifine melhora 50% o FPS, o Sodium melhora 300-400% e elimina os picos de lag (lag spikes) quando o Garbage Collector do Java roda.
        </p>
      `
        },
        {
            title: "Capítulo 1: A Trindade da Performance (Instalação)",
            content: `
        <div class="space-y-4">
             <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Passo 1: Fabric Loader</h4>
                <p class="text-gray-400 text-sm">Baixe e instale o Fabric Loader para a versão do seu jogo (ex: 1.21). Ele é a base leve para os mods.</p>
            </div>
             <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Passo 2: Mods Essenciais (.jar)</h4>
                <p class="text-gray-400 text-sm">Coloque na pasta <code>%appdata%\\.minecraft\\mods</code>:</p>
                <ul class="list-disc list-inside text-gray-300 text-xs mt-2">
                    <li><strong>Sodium:</strong> O motor gráfico.</li>
                    <li><strong>Lithium:</strong> Otimiza a física e IA do jogo (Server-side).</li>
                    <li><strong>Indium:</strong> Compatibilidade de renderização.</li>
                    <li><strong>FerriteCore:</strong> Reduz o uso de RAM pela metade.</li>
                </ul>
            </div>
             <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Passo 3: Shaders? Use Iris.</h4>
                <p class="text-gray-400 text-sm">O Iris Shaders usa o Sodium para rodar shaders (BSL, Complementary) com o dobro do FPS do Optifine.</p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Configurando o Sodium (Vídeo)",
            content: `
        <p class="mb-4 text-gray-300">
            Aperte Shift+P no menu (se tiver Reese's Sodium Options) ou vá em Vídeo.
        </p>
        <table class="w-full text-sm text-left text-gray-400">
            <tbody>
                <tr class="border-b border-gray-700">
                    <td class="py-2 font-bold">Render Distance</td>
                    <td class="py-2">8-12 Chunks</td>
                    <td class="py-2">Acima de 16 pesa muito na CPU, não na GPU.</td>
                </tr>
                <tr class="border-b border-gray-700">
                    <td class="py-2 font-bold">Simulation Distance</td>
                    <td class="py-2">5 Chunks</td>
                    <td class="py-2">Controla a distância que a redstone/mobs funcionam. Deixe baixo para FPS.</td>
                </tr>
                <tr class="border-b border-gray-700">
                    <td class="py-2 font-bold">VSync</td>
                    <td class="py-2 text-red-400">Off</td>
                    <td class="py-2">Limite o FPS manualmente se precisar (ex: 144), não use VSync.</td>
                </tr>
                 <tr class="border-b border-gray-700">
                    <td class="py-2 font-bold">Mipmap Levels</td>
                    <td class="py-2">4x</td>
                    <td class="py-2">Deixa texturas distantes suaves. Custo baixo.</td>
                </tr>
                 <tr class="border-b border-gray-700">
                    <td class="py-2 font-bold">Chunk Builder</td>
                    <td class="py-2 text-emerald-400">Multithreaded</td>
                    <td class="py-2">Usa todos os núcleos para carregar o mundo.</td>
                </tr>
            </tbody>
        </table>
      `
        },
        {
            title: "Capítulo 3: Alocação de RAM (Java Arguments)",
            content: `
        <p class="mb-4 text-gray-300">
            O mito: "Quanto mais RAM, melhor". <strong>Errado.</strong>
            <br/>Se você der 16GB pro Minecraft Vanilla, o Java vai ficar preguiçoso e acumular lixo. Quando ele resolver limpar (GC Dump), seu jogo vai travar por 2 segundos.
            <br/><strong>Valores Ideais (Launch Options):</strong>
            <br/>- Vanilla/Sodium: <strong>2GB a 4GB</strong>.
            <br/>- Modpacks Leves (50 mods): <strong>4GB a 6GB</strong>.
            <br/>- Modpacks Pesados (All The Mods): <strong>8GB a 10GB</strong>.
            <br/>Nunca passe de 50% da RAM total do seu PC (para sobrar pro Windows).
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: Nvidium (RTX Only)",
            content: `
        <div class="bg-gray-800/50 p-6 rounded-xl border border-gray-700 mb-8">
            <h4 class="text-green-400 font-bold mb-4 text-xl">Renderização de Mesh Shaders</h4>
            <p class="text-gray-300 mb-4">
                Se você tem uma GPU RTX Série 3000 ou 4000 (ex: 3060, 4060).
                <br/>Instale o mod <strong>Nvidium</strong> junto com o Sodium.
                <br/>Ele usa uma tecnologia chamada Mesh Shading que permite renderizar distâncias absurdas (32, 64, até 128 Chunks) sem perder FPS. É magia negra tecnológica.
                <br/><em>Nota:</em> Incompatível com Shaders. Você escolhe: Render Distance insana (Nvidium) ou Luz bonita (Iris).
            </p>
        </div>
      `
        },
        {
            title: "Capítulo 5: Entity Culling (Entidades Escondidas)",
            content: `
        <p class="mb-4 text-gray-300">
            O Minecraft padrão renderiza porcos e zumbis mesmo que eles estejam atrás de uma parede.
            <br/>O mod <strong>Entity Culling</strong> para de desenhar o que você não vê.
            <br/>Isso é crucial se você tem uma fazenda de mobs ou muitos baús/item frames na base. Salva 30-50 FPS em bases lotadas.
        </p>
      `
        },
        {
            title: "Capítulo 6: Java Runtime (JDK 17/21)",
            content: `
        <p class="mb-4 text-gray-300">
            Certifique-se de usar um Java moderno.
            <br/>- Minecraft 1.18+: Requer Java 17.
            <br/>- Minecraft 1.20.5+: Requer Java 21.
            <br/>Use o <strong>GraalVM</strong> ou <strong>Adoptium Temurin</strong> em vez do Java padrão da Oracle para uma leve melhora na performance do Garbage Collector (G1GC).
        </p>
      `
        },
        {
            title: "Capítulo 7: Distant Horizons (LODs)",
            content: `
        <p class="mb-4 text-gray-300">
            Quer ver o mundo inteiro até o horizonte sem lag?
            <br/>O mod <strong>Distant Horizons</strong> cria versões simplificadas (LOD) dos chunks distantes. Você pode ver montanhas a 128 chunks de distância com o peso de 16 chunks.
            <br/>Funciona com Iris Shaders (versões recentes). É o futuro do Minecraft visual.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: Servidores e Ping",
            content: `
            <p class="mb-4 text-gray-300">
                Se o FPS está alto mas os blocos voltam quando você quebra (Rubberbanding).
                <br/>Isso é lag de TPS (Ticks Per Second) do servidor ou Ping.
                <br/>Instale o mod <strong>Mod Menu</strong> para ver o Ping na lista de servidores (Tab).
                <br/>Não há como consertar TPS baixo (culpa do dono do server), mas usar DNS otimizado (Cloudflare) pode melhorar a estabilidade da rota.
            </p>
            `
        },
        {
            title: "Capítulo 9: Fullscreen Exclusivo",
            content: `
            <p class="mb-4 text-gray-300">
                O Minecraft roda em "Borderless Window" por padrão.
                <br/>Vá em Vídeo e mude para <strong>Fullscreen</strong> e defina a resolução correta e Hz (ex: 1920x1080@144).
                <br/>Isso reduz o input lag drasticamente.
            </p>
            `
        },
        {
            title: "Capítulo 10: TLauncher e Pirataria (Riscos)",
            content: `
            <p class="mb-4 text-gray-300">
                Muitos launchers alternativos contêm spyware.
                <br/>Recomendamos usar o <strong>Prism Launcher</strong> ou <strong>Modrinth App</strong>. Eles são open-source, gerenciam mods automaticamente e suportam contas originais e offline (com configuração). São muito mais leves e seguros que o TLauncher.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Posso usar Mods de performance no Forge?",
            answer: "Sim, mas os equivalentes (Embeddium, Rubidium) são geralmente ports do Sodium. O ecossistema Fabric atualiza mais rápido e é mais leve. Se puder escolher, vá de Fabric para performance pura."
        },
        {
            question: "Shaders deixam o PC lento?",
            answer: "Sim, Shaders são pesados. O 'Complementary Reimagined' no perfil 'Potato' ou 'Low' é um bom meio termo. Se tiver GPU integrada (Intel HD), evite shaders e fique só com o Sodium."
        },
        {
            question: "VBOs on ou off?",
            answer: "Sempre ON (ou deixe o Sodium gerenciar). O Vertex Buffer Objects permite que a GPU armazene a geometria dos chunks, liberando muita CPU."
        }
    ];

    const externalReferences = [
        { name: "Modrinth (Baixe mods seguros)", url: "https://modrinth.com/" },
        { name: "Sodium (Mod Oficial)", url: "https://modrinth.com/mod/sodium" },
        { name: "Iris Shaders", url: "https://irisshaders.net/" }
    ];

    const relatedGuides = [
        {
            href: "/guias/como-escolher-fonte-pc-gamer",
            title: "Hardware",
            description: "Upgrades para o PC."
        },
        {
            href: "/guias/otimizacao-ssd-windows-11",
            title: "SSD Load",
            description: "Carregar chunks mais rápido."
        },
        {
            href: "/guias/monitor-hz-configuracao-correta",
            title: "Monitor",
            description: "Aproveite os 500 FPS com Hz alto."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="30 min"
            difficultyLevel="Fácil"
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
