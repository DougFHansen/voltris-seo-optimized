import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "GTA IV: Como Rodar no Windows 10/11 (Fix 2026) - Voltris";
const description = "O GTA 4 não abre ou pede Games for Windows Live? Aprenda a instalar o XLiveLess e DXVK para rodar o jogo liso e sem crash no Windows 11.";
const keywords = ['gta 4 não abre windows 11', 'gta iv xliveless', 'games for windows live fix', 'gta iv dxvk performance', 'gta 4 crash fix'];

export const metadata: Metadata = createGuideMetadata('gta-iv-fix-windows-10-11', title, description, keywords);

export default function GTAIVGuide() {
    const contentSections = [
        {
            title: "O Problema: Games for Windows Live (GFWL)",
            content: `
        <p class="mb-4">O serviço GFWL morreu em 2014, mas o jogo ainda tenta conectar nele. Se não conectar, o jogo não abre.</p>
      `,
            subsections: []
        },
        {
            title: "A Solução: XLiveLess",
            content: `
        <ol class="space-y-4 text-gray-300 list-decimal list-inside ml-4">
            <li>Baixe o arquivo <strong>xliveless.dll</strong> (procure no Google por 'GTA IV XLiveLess').</li>
            <li>Copie o arquivo para a pasta principal do jogo (onde está o GTAIV.exe).</li>
            <li>Isso remove a dependência do GFWL e move seus saves para a pasta Documentos.</li>
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
        />
    );
}
