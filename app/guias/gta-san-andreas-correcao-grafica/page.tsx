import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "GTA San Andreas: Guia de Correção Gráfica e SilentPatch - Voltris";
const description = "Corrija o mouse que não funciona, resolução errada e crashes no GTA San Andreas clássico. Tutorial de instalação do SilentPatch e Widescreen Fix.";
const keywords = ['gta w mouse fix', 'gta san andreas silentpatch', 'gta sa widescreen fix', 'gta sa crash windows 11', 'gta sa frame limiter'];

export const metadata: Metadata = createGuideMetadata('gta-san-andreas-correcao-grafica', title, description, keywords);

export default function GTASAGuide() {
    const contentSections = [
        {
            title: "Essencial: SilentPatch",
            content: `
        <p class="mb-4">O SilentPatch é um mod milagroso que corrige centenas de bugs deixados pela Rockstar, incluindo o bug do mouse travar e framerate quebrado.</p>
        <ol class="space-y-4 text-gray-300 list-decimal list-inside ml-4">
            <li>Instale o <strong>CLEO Library</strong> primeiro.</li>
            <li>Baixe o <strong>SilentPatchSA</strong>.</li>
            <li>Cole os arquivos na pasta do jogo.</li>
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
            estimatedTime="20 minutos"
            difficultyLevel="Intermediário"
            contentSections={contentSections}
        />
    );
}
