import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Terraria tModLoader Travando (Out of Memory)? Use a Versão 64-bit (2026)";
const description = "Instalou o Calamity Mod e o Terraria fecha sozinho dizendo 'Out of Memory'? O Terraria padrão só usa 4GB de RAM. Veja como migrar para o 64-bit.";
const keywords = ['terraria out of memory fix', 'tmodloader 64 bit download', 'calamity mod travando terraria', 'aumentar ram terraria', 'tmodloader crash fix', 'terraria travando muito mod'];

export const metadata: Metadata = createGuideMetadata('terraria-tmodloader-64bit-fix', title, description, keywords);

export default function TerrariaGuide() {
    const summaryTable = [
        { label: "Limite 32-bit", value: "4 GB RAM" },
        { label: "Limite 64-bit", value: "Infinito" },
        { label: "Calamity Mod", value: "Exige 64-bit" },
        { label: "Onde Baixar", value: "Steam (DLC)" }
    ];

    const contentSections = [
        {
            title: "O Limite de 4GB (Erro System.OutOfMemoryException)",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
          O Terraria original foi feito em 32-bits. Isso significa que ele matematicamente não consegue enxergar mais que 4GB da sua memória RAM, mesmo que você tenha um PC com 64GB. Mods grandes como <strong>Calamity + Thorium</strong> ultrapassam esse limite e causam crash.
        </p>
      `,
            subsections: []
        },
        {
            title: "Como Migrar para o tModLoader 1.4 (64-bit)",
            content: `
        <p class="mb-4 text-gray-300">
            Felizmente, a equipe do tModLoader tornou a versão 64-bit o padrão na Steam.
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4 mb-6">
            <li>Abra sua biblioteca Steam.</li>
            <li>Procure por <strong>tModLoader</strong> (Ele é separado do Terraria base).</li>
            <li>Clique direito > Propriedades > Betas.</li>
            <li>Certifique-se de que está selecionado <strong>"None"</strong> (A versão estável atual JÁ É 64-bit).</li>
            <li>Se você estiver usando a versão "1.3-legacy", ela é 32-bit. <strong>Mude para 1.4</strong> para ter acesso a memória ilimitada.</li>
        </ol>
      `,
            subsections: []
        },
        {
            title: "Configuração de Gráficos para Mods",
            content: `
        <ul class="list-disc list-inside text-gray-300 space-y-2">
            <li><strong>Lighting:</strong> Mude de "Color" ou "White" para <strong>Trippy</strong> ou <strong>Retro</strong>. A iluminação Color é pesada.</li>
            <li><strong>Backgrounds:</strong> Desligue. Mods adicionam fundos animados complexos.</li>
            <li><strong>Frame Skip:</strong> On. Se ficar Off, o jogo fica em câmera lenta quando o FPS cai.</li>
        </ul>
      `
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="10 min"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
        />
    );
}
