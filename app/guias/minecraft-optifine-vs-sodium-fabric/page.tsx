import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Sodium vs OptiFine: Qual o melhor para o Minecraft em 2026?";
const description = "Ainda usa OptiFine? Descubra por que o Sodium se tornou o padrão para performance no Minecraft e compare os recursos de Shaders entre as duas plataformas.";
const keywords = [
    'sodium vs optifine comparativo 2026 minecraft',
    'qual da mais fps optifine ou sodium fabric',
    'melhor mod de performance para shaders minecraft',
    'iris shader vs optifine shaders tutorial 2026',
    'minecraft performance guia definitivo mods fraco'
];

export const metadata: Metadata = createGuideMetadata('minecraft-optifine-vs-sodium-fabric', title, description, keywords);

export default function SodiumVsOptiFineGuide() {
    const summaryTable = [
        { label: "OptiFine", value: "Fácil de instalar / Tudo-em-um / Código fechado" },
        { label: "Sodium", value: "Performance Extrema / Modular / Código Aberto" },
        { label: "Plataforma", value: "OptiFine (Forge/Nativo) | Sodium (Fabric/Quilt)" },
        { label: "Dificuldade", value: "Médio" }
    ];

    const contentSections = [
        {
            title: "O Fim de um Reinado?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O **OptiFine** dominou o Minecraft por mais de uma década. Ele era a solução única para tudo: performance, shaders, mantas e zoom. No entanto, em 2026, ele se tornou uma "caixa preta" de difícil atualização. O **Sodium** surgiu para resolver isso, focando exclusivamente em renderização moderna e eficiência de memória, deixando o jogo muito mais fluido em PCs modernos e antigos.
        </p>
      `
        },
        {
            title: "1. Performance: O fator decisivo",
            content: `
        <p class="mb-4 text-gray-300">Em testes reais de 2026, o Sodium vence na maioria dos cenários:</p>
        <ul class="list-disc list-inside text-gray-300 space-y-3">
            <li><strong>Sodium:</strong> Reduz drasticamente o tempo de processamento de cada chunk. O FPS tende a ser mais alto e, o mais importante, mais estável (menos quedas bruscas).</li>
            <li><strong>OptiFine:</strong> Oferece um modo "Fast Render" que pode causar bugs visuais com outros mods. O ganho de FPS é menor comparado ao Sodium em novas versões do jogo (1.18+).</li>
        </ul >
      `
        },
        {
            title: "2. Shaders e Funcionalidades",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">A Modularidade do Fabric:</h4>
            <p class="text-sm text-gray-300">
                Uma crítica comum ao Sodium era a falta de recursos como Shaders. Hoje, em 2026, isso foi resolvido pelo ecossistema Fabric: <br/><br/>
                - Para <strong>Shaders</strong>, você usa o mod <strong>Iris</strong>. <br/>
                - Para <strong>Zoom</strong>, você usa o <strong>Logical Zoom</strong> ou similares. <br/>
                - Para <strong>Texturas Conectadas</strong>, você usa o <strong>Continuity</strong>. <br/>
                O Sodium sozinho não faz tudo, mas o combo Sodium + Mods Auxiliares é muito mais potente que o OptiFine sozinho.
            </p>
        </div>
      `
        },
        {
            title: "3. Veredito Final",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>Use OptiFine se:</strong> Você quer algo extremamente simples de instalar e não joga com muitos outros mods, ou se está em uma versão muito antiga do jogo (pré-1.12).
            <br/><br/>
            <strong>Use Sodium se:</strong> Você joga versões modernas (1.20+) e busca o máximo de FPS possível. Em 2026, o ecossistema Fabric/Sodium é onde a inovação está acontecendo e onde você terá a melhor experiência de jogo fluido.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/minecraft-aumentar-fps-fabric-sodium",
            title: "Instalar Sodium",
            description: "Passo a passo da instalação."
        },
        {
            href: "/guias/minecraft-lag-fix-optifine-fabric",
            title: "Remover Lag",
            description: "Dicas extras para otimizar o Mine."
        },
        {
            href: "/guias/minecraft-alocar-mais-ram",
            title: "Alocar RAM",
            description: "Prepare seu hardware para os mods."
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
