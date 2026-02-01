import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Overclock de Placa de Vídeo Seguro com MSI Afterburner - Voltris";
const description = "Ganhe 10-15%  mais FPS em jogos de graça. Guia passo a passo para usar o MSI Afterburner sem queimar sua GPU. Safe overclocking 2026. ";
const keywords = ['overclock gpu', 'msi afterburner tutorial', 'aumentar fps jogos', 'overclock seguro', 'undervolt gpu'];

export const metadata: Metadata = createGuideMetadata('overclock-gpu-msi-afterburner', title, description, keywords);

export default function OverclockGuide() {
    const summaryTable = [
        { label: "Ganho FPS", value: "+10% a 15%" },
        { label: "Risco", value: "Baixo (Se seguir o guia)" },
        { label: "Software", value: "MSI Afterburner" }
    ];

    const contentSections = [
        {
            title: "O que é Overclock Seguro?",
            content: `
        <p class="mb-4">As placas de vídeo vêm de fábrica com uma margem de segurança enorme. Overclock seguro significa usar essa margem sem aumentar a voltagem (Core Voltage), o que elimina o risco de queimar o chip. O máximo que vai acontecer é o jogo fechar e você ter que diminuir um pouco.</p>
      `,
            subsections: []
        },
        {
            title: "Passo a Passo no Afterburner",
            content: `
        <ol class="space-y-4 text-gray-300 list-decimal list-inside ml-4">
            <li>Baixe o MSI Afterburner (site oficial msi.com/Landing/afterburner).</li>
            <li>Aumente o <strong>Power Limit</strong> para o máximo (isso apenas permite que a placa use mais energia se precisar, não força nada).</li>
            <li>Aumente o <strong>Core Clock</strong> em +50MHz. Clique em Aplicar (Check).</li>
            <li>Rode um jogo pesado por 10 minutos.</li>
            <li>Se não travou, aumente mais +25MHz e repita.</li>
            <li>Quando o jogo fechar ou aparecerem artefatos (riscos na tela), diminua -25MHz. Esse é seu limite estável.</li>
            <li>Repita o processo para o <strong>Memory Clock</strong> (geralmente aguenta +500MHz ou mais).</li>
        </ol>
      `
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="45 minutos"
            difficultyLevel="Avançado"
            contentSections={contentSections}
            summaryTable={summaryTable}
        />
    );
}
