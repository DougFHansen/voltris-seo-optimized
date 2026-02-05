import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'minecraft-lag-fix-optifine-fabric',
  title: "Minecraft Lag Fix: OptiFine vs Fabric (Sodium) em 2026",
  description: "Seu Minecraft está travando? Aprenda a instalar o OptiFine ou o Fabric com Sodium para ganhar muito FPS e rodar Shaders mesmo em PC fraco.",
  category: 'games-fix',
  difficulty: 'Iniciante',
  time: '15 min'
};

const title = "Minecraft Lag Fix: OptiFine vs Fabric (Sodium) em 2026";
const description = "Seu Minecraft está travando? Aprenda a instalar o OptiFine ou o Fabric com Sodium para ganhar muito FPS e rodar Shaders mesmo em PC fraco.";
const keywords = [
    'como tirar lag minecraft java edition 2026',
    'instalar sodium fabric minecraft tutorial 2026',
    'optifine vs fabric qual o melhor para fps',
    'minecraft pc fraco 60 fps tutorial 2026',
    'configurar shaders minecraft sem lag'
];

export const metadata: Metadata = createGuideMetadata('minecraft-lag-fix-optifine-fabric', title, description, keywords);

export default function MinecraftLagGuide() {
    const summaryTable = [
        { label: "Melhor Performance", value: "Fabric + Sodium" },
        { label: "Mais Prático", value: "OptiFine" },
        { label: "Alocação de RAM", value: "2GB a 4GB (Não use tudo!)" },
        { label: "Dificuldade", value: "Fácil" }
    ];

    const contentSections = [
        {
            title: "O problema do código do Minecraft",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Minecraft Java Edition roda em uma linguagem chamada Java, que não foi feita especificamente para jogos de alto desempenho. Por padrão, o jogo é ineficiente ao carregar pedaços do mundo (chunks). Em 2026, com mundos cada vez mais altos e profundos, você precisa de mods de otimização para manter um FPS jogável.
        </p>
      `
        },
        {
            title: "1. OptiFine: O clássico imortal",
            content: `
        <p class="mb-4 text-gray-300">O OptiFine é um mod "tudo-em-um" que adiciona suporte a Shaders e otimizações básicas.</p>
        <ul class="list-disc list-inside text-gray-300 space-y-3">
            <li><strong>Vantagem:</strong> Muito fácil de instalar. Basta baixar o .jar e clicar em 'Install'.</li>
            <li><strong>Destaque:</strong> O recurso de 'Zoom' (tecla C) e o suporte nativo a texturas conectadas (vidro sem emendas).</li>
            <li><strong>Dica:</strong> Nas configurações de vídeo, vá em 'Performance' e ligue o <strong>'Fast Render'</strong> e <strong>'Smart Animations'</strong>.</li>
        </ul>
      `
        },
        {
            title: "2. Fabric + Sodium: O Novo Padrão de Performance",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Por que o Sodium é melhor?</h4>
            <p class="text-sm text-gray-300">
                Enquanto o OptiFine tenta consertar o jogo, o <strong>Sodium</strong> reescreve a forma como o Minecraft renderiza os blocos. Os ganhos de FPS com Sodium chegam a ser o dobro em relação ao OptiFine. <br/><br/>
                Para ter a experiência completa, instale o Fabric Loader e os mods: <strong>Sodium</strong> (Performance), <strong>Lithium</strong> (IA e física) e <strong>Iris</strong> (se quiser rodar Shaders).
            </p>
        </div>
      `
        },
        {
            title: "3. Alocação de Memória RAM",
            content: `
        <p class="mb-4 text-gray-300">
            Muitos pensam que "mais RAM = mais FPS", mas dar RAM demais (ex: 12GB) faz o Minecraft travar a cada 5 segundos por causa de um processo chamado 'Garbage Collection'. 
            <br/>Vá no seu Launcher > Instalações > Editar > Mais Opções. Em 'Argumentos da JVM', mude o <code>-Xmx2G</code> para <code>-Xmx4G</code>. Isso é o ponto ideal para rodar o jogo com mods e shaders.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/atualizacao-drivers-video",
            title: "Drivers de Vídeo",
            description: "O Minecraft usa OpenGL, drivers atualizados são vitais."
        },
        {
            href: "/guias/reduzir-ping-jogos-online",
            title: "Reduzir Ping",
            description: "Melhore a conexão em servidores multiplayer."
        },
        {
            href: "/guias/automacao-tarefas",
            title: "Backups Mundos",
            description: "Não perca seu survival por erro de disco."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="15 min"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
