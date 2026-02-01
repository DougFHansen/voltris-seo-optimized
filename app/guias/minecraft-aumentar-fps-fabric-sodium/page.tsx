import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Minecraft: Aumente o FPS em 300% com Fabric e Sodium - Voltris";
const description = "Adeus Optifine. Aprenda a instalar o combo Fabric + Sodium + Lithium para fazer o Minecraft rodar liso até em PC da Xuxa.";
const keywords = ['minecraft aumentar fps', 'fabric vs optifine', 'instalar sodium minecraft', 'minecraft pc fraco', 'iris shaders'];

export const metadata: Metadata = createGuideMetadata('minecraft-aumentar-fps-fabric-sodium', title, description, keywords);

export default function MinecraftFPSGuide() {
    const summaryTable = [
        { label: "Modloader", value: "Fabric" },
        { label: "Ganho", value: "3x a 5x FPS" }
    ];

    const contentSections = [
        {
            title: "Por que não usar Optifine?",
            content: `
        <p class="mb-4">O Optifine é tecnologia antiga (código fechado). O <strong>Sodium</strong> é moderno, open-source e usa renderização multi-thread que aproveita todos os núcleos do seu processador.</p>
      `,
            subsections: []
        },
        {
            title: "Instalação",
            content: `
        <ol class="space-y-4 text-gray-300 list-decimal list-inside ml-4">
            <li>Baixe o <strong>Fabric Installer</strong> e execute (selecione a versão do seu Minecraft).</li>
            <li>Baixe os mods: <strong>Fabric API</strong>, <strong>Sodium</strong> e <strong>Lithium</strong> (no Modrinth ou CurseForge).</li>
            <li>Coloque os arquivos .jar na pasta <code>%appdata%\\.minecraft\\mods</code>.</li>
            <li>Abra o Launcher e selecione o perfil Fabric.</li>
        </ol>
      `
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="15 minutos"
            difficultyLevel="Intermediário"
            contentSections={contentSections}
            summaryTable={summaryTable}
        />
    );
}
