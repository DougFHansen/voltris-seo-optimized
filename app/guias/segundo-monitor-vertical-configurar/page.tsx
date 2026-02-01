import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Segundo Monitor: Como Configurar na Vertical para Produtividade";
const description = "Vai usar um monitor em pé? Veja como virar a tela no Windows, alinhar o mouse e qual o melhor lado (esquerda ou direita) para programadores e streamers.";
const keywords = ['monitor vertical windows', 'virar tela windows', 'segundo monitor configuracao', 'monitor em pe programacao', 'setup dois monitores'];

export const metadata: Metadata = createGuideMetadata('segundo-monitor-vertical-configurar', title, description, keywords);

export default function DualMonitorGuide() {
    const contentSections = [
        {
            title: "Como Virar a Tela (Rotação)",
            content: `
        <ol class="space-y-4 text-gray-300 list-decimal list-inside ml-4">
            <li>Clique com botão direito na Área de Trabalho > <strong>Configurações de Exibição</strong>.</li>
            <li>Selecione o monitor 2 (clique em Identificar se tiver dúvida).</li>
            <li>Role até "Orientação da tela".</li>
            <li>Mude de Paisagem para <strong>Retrato</strong> (ou Retrato virado, dependendo do lado dos cabos).</li>
            <li>Clique em Manter Alterações.</li>
        </ol>
      `,
            subsections: []
        },
        {
            title: "O Pulo do Gato: Alinhamento",
            content: `
        <p class="text-gray-300">Ainda nessa tela, arraste o retângulo do Monitor 2 para ficar na altura exata do Monitor 1. Se eles ficarem desalinhados, o mouse vai "bater na parede" quando você tentar passar de uma tela pra outra.</p>
      `
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
