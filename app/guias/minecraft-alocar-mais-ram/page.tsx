import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Como Alocar Mais Memória RAM no Minecraft (TLauncher e Original)";
const description = "Erro 'Out of Memory'? Veja como alocar 3GB, 4GB ou 8GB de RAM para o Minecraft rodar modpacks pesados sem travar.";
const keywords = ['alocar ram minecraft', 'minecraft out of memory', 'jvm arguments minecraft', 'tlauncher ram', 'minecraft travando mods'];

export const metadata: Metadata = createGuideMetadata('minecraft-alocar-mais-ram', title, description, keywords);

export default function MinecraftRAMGuide() {
    const summaryTable = [
        { label: "Ideal Vanilla", value: "2GB a 4GB" },
        { label: "Ideal Mods", value: "6GB a 8GB" }
    ];

    const contentSections = [
        {
            title: "No Launcher Original",
            content: `
        <ol class="space-y-4 text-gray-300 list-decimal list-inside ml-4">
            <li>Vá na aba <strong>Instalações</strong>.</li>
            <li>Clique nos três pontos (...) da versão que você joga > Editar.</li>
            <li>Clique em <strong>Mais Opções</strong>.</li>
            <li>Procure a linha "Argumentos da JVM".</li>
            <li>No começo, mude <code>-Xmx2G</code> para <code>-Xmx4G</code> (ou quanto você quiser).</li>
            <li>O "G" significa Gigabytes. Não coloque mais que 70% da memória total do seu PC.</li>
        </ol>
      `,
            subsections: []
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="5 minutos"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
        />
    );
}
