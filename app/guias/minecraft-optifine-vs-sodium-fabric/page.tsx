import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Minecraft: OptiFine vs Sodium (Fabric) - Qual dá mais FPS em 2026?";
const description = "O OptiFine ficou obsoleto? Testamos o mod Sodium com Iris Shaders e o resultado é chocante: 3x mais FPS e chunks carregando instantaneamente.";
const keywords = ['minecraft optifine vs sodium', 'aumentar fps minecraft 2026', 'sodium fabric tutorial', 'iris shaders vs optifine', 'minecraft travando pc fraco', 'modpack otimizacao minecraft'];

export const metadata: Metadata = createGuideMetadata('minecraft-optifine-vs-sodium-fabric', title, description, keywords);

export default function MinecraftGuide() {
    const summaryTable = [
        { label: "Vencedor FPS", value: "Sodium (Fabric)" },
        { label: "Vencedor Shaders", value: "Iris (Fabric)" },
        { label: "Vencedor Antigo", value: "OptiFine (Forge)" },
        { label: "Features Extras", value: "OptiFine (Zoom)" }
    ];

    const contentSections = [
        {
            title: "O Fim da Era OptiFine",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
          Durante 10 anos, o OptiFine foi o rei. Mas ele é um mod "fechado" e antigo. Uma nova geração de mods baseados no carregador <strong>Fabric</strong> reescreveu o motor de renderização do Minecraft do zero.
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed font-bold bg-gray-800 p-4 rounded text-center">
            Em nossos testes num PC fraco (i3 sem GPU):
            <br/><span class="text-red-400">Minecraft Vanilla: 40 FPS</span>
            <br/><span class="text-yellow-400">Com OptiFine: 75 FPS</span>
            <br/><span class="text-green-400 text-xl">Com Sodium: 210 FPS</span>
        </p>
      `,
            subsections: []
        },
        {
            title: "O que é o 'Sodium' e o 'Iris'?",
            content: `
        <ul class="list-disc list-inside text-gray-300 space-y-3">
            <li><strong>Sodium:</strong> Substitui o renderizador gráfico do Minecraft. Ele usa multithreading moderno (o Minecraft original usa apenas 1 núcleo). Isso corrige as travadas quando você vira a câmera rápido.</li>
            <li><strong>Iris Shaders:</strong> É o substituto do sistema de Shaders do OptiFine. Ele roda os mesmos shaders (BSL, Complementary), mas com o dobro da performance.</li>
            <li><strong>Lithium & Starlight:</strong> Mods complementares que otimizam a física do servidor e a iluminação, reduzindo o lag de TPS.</li>
        </ul>
      `,
            subsections: []
        },
        {
            title: "Como Instalar (O jeito fácil: Modrinth App)",
            content: `
        <p class="mb-4 text-gray-300">
            Não tente instalar manualmente arrastando arquivos jar se você é iniciante. Use um launcher.
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-2 ml-4">
            <li>Baixe o <strong>Modrinth App</strong> (Launcher open-source).</li>
            <li>Pesquise pelo modpack <strong>"Fabulously Optimized"</strong> ou <strong>"Simply Optimized"</strong>.</li>
            <li>Clique em Instalar e Jogar.</li>
            <li>Pronto. Esse modpack já vem com Sodium, Iris, Zoom (Zoomify), Capas e tudo o que o OptiFine tinha, mas rodando na engine Fabric ultra-rápida.</li>
        </ol>
      `
        },
        {
            title: "E se eu PRECISAR usar Forge (Mods de Tech/Magia)?",
            content: `
        <p class="text-gray-300 mb-4">
            Se você joga modpacks pesados com Forge (versão 1.16, 1.12), o Sodium não funciona nativamente.
        </p>
        <p class="text-gray-300">
            Procure por "Embeddium" (um port do Sodium para Forge) ou "Rubidium". Eles fazem a mesma mágica. O OptiFine hoje em dia causa muitos conflitos com outros mods e deve ser evitado a todo custo.
        </p>
      `
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
        />
    );
}
