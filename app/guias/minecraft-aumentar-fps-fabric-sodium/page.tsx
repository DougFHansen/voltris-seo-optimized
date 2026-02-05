import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'minecraft-aumentar-fps-fabric-sodium',
  title: "Minecraft: Como aumentar o FPS com Fabric e Sodium (2026)",
  description: "O OptiFine não é mais o rei. Aprenda a instalar o Sodium e o Iris Shader para ter o Minecraft mais fluido e bonito do mundo em 2026.",
  category: 'otimizacao',
  difficulty: 'Intermediário',
  time: '20 min'
};

const title = "Minecraft: Como aumentar o FPS com Fabric e Sodium (2026)";
const description = "O OptiFine não é mais o rei. Aprenda a instalar o Sodium e o Iris Shader para ter o Minecraft mais fluido e bonito do mundo em 2026.";
const keywords = [
    'como instalar sodium minecraft fabric tutorial 2026',
    'minecraft fabric vs optifine qual da mais fps',
    'melhores mods de performance minecraft 1.21 2026',
    'iris shader tutorial como instalar com sodium',
    'minecraft liso no pc fraco com fabric e sodium'
];

export const metadata: Metadata = createGuideMetadata('minecraft-aumentar-fps-fabric-sodium', title, description, keywords);

export default function MinecraftFabricSodiumGuide() {
    const summaryTable = [
        { label: "Plataforma", value: "Fabric Loader" },
        { label: "Mod de Performance", value: "Sodium (O mais potente)" },
        { label: "Mod de Shaders", value: "Iris (Compatível com Sodium)" },
        { label: "Ganho de FPS", value: "Pode dobrar ou triplicar o desempenho" }
    ];

    const contentSections = [
        {
            title: "Por que trocar o OptiFine pelo Sodium em 2026?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Durante uma década, o OptiFine foi o mod obrigatório. No entanto, o motor gráfico do Minecraft mudou, e o OptiFine utiliza técnicas de renderização antigas que não aproveitam as placas de vídeo modernas. O **Sodium** reescreve o pipeline de renderização do Minecraft do zero, usando tecnologias modernas da engine OpenGL de 2026, resultando em um ganho de frames que o OptiFine simplesmente não consegue mais alcançar.
        </p>
      `
        },
        {
            title: "1. Instalando o Fabric e o Sodium",
            content: `
        <p class="mb-4 text-gray-300">Siga a ordem correta para não dar erro:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Baixe e instale o <strong>Fabric Loader</strong> oficial (escolha a versão mais recente, como 1.21+).</li>
            <li>Baixe o mod <strong>Sodium</strong> (arquivo .jar) no Modrinth ou CurseForge.</li>
            <li>Baixe também o <strong>Lithium</strong> (melhora a lógica do jogo/CPU).</li>
            <li>Coloque os arquivos .jar na pasta <code>%appdata% / .minecraft / mods</code>.</li>
            <li>Inicie o jogo selecionando o perfil 'Fabric Loader'.</li>
        </ol>
      `
        },
        {
            title: "2. Iris: Shaders sem perder Performance",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">A Evolução dos Shaders:</h4>
            <p class="text-sm text-gray-300">
                Antigamente, usar shaders significava jogar a 30 FPS. Com o mod <strong>Iris</strong> instalado junto com o Sodium, você consegue rodar shaders pesados (como BSL ou Complementary) com uma perda de performance muito menor. O Iris permite que o Sodium gerencie a renderização dos blocos enquanto ele cuida da iluminação, criando o equilíbrio perfeito entre beleza e fluidez.
            </p>
        </div>
      `
        },
        {
            title: "3. Configurações de Vídeo Adicionais",
            content: `
        <p class="mb-4 text-gray-300">
            Dentro do jogo, o menu de vídeo será diferente. No Sodium, procure por:
            <br/>- <strong>Chunk Updates:</strong> Aumente se você tiver uma CPU com muitos núcleos, isso fará o mapa carregar instantaneamente enquanto você voa.
            <br/>- <strong>Use Cloud Resolution:</strong> Diminua se o FPS cair quando você olha para o céu.
            <br/>- <strong>Fog (Névoa):</strong> Desativar a névoa via Sodium dá um alívio extra para a sua placa de vídeo.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/minecraft-optifine-vs-sodium-fabric",
            title: "Sodium vs OptiFine",
            description: "Comparativo técnico de performance."
        },
        {
            href: "/guias/minecraft-alocar-mais-ram",
            title: "Alocar mais RAM",
            description: "Essencial para rodar Sodium + Shaders."
        },
        {
            href: "/guias/minecraft-lag-fix-optifine-fabric",
            title: "Remover Lag",
            description: "Outras dicas para o seu servidor."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="20 min"
            difficultyLevel="Médio"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
