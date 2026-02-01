import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Lineage 2: Fix Critical Error e Otimização para PvP Massivo";
const description = "Crash no meio da Siege? Aprenda a aumentar o cache L2.ini e corrigir o Critical Error do Lineage 2 Interlude, High Five e Essence.";
const keywords = ['lineage 2 critical error', 'l2 travando', 'l2 aumentar cache', 'lineage 2 pvp lag', 'l2option.ini'];

export const metadata: Metadata = createGuideMetadata('lineage-2-otimizar-pvp-fps', title, description, keywords);

export default function L2Guide() {
    const summaryTable = [
        { label: "Arquivo", value: "l2.ini / Option.ini" },
        { label: "Risco", value: "Baixo" }
    ];

    const contentSections = [
        {
            title: "O Problema: Engine Antiga (Unreal 2)",
            content: `
        <p class="mb-4">O Lineage 2 roda numa engine de 2003 que só usa 1 núcleo do processador. Não adianta ter um i9. O segredo é configurar o cache.</p>
      `,
            subsections: []
        },
        {
            title: "Editando o Option.ini",
            content: `
        <ol class="space-y-4 text-gray-300 list-decimal list-inside ml-4">
            <li>Vá na pasta system do seu Lineage.</li>
            <li>Abra o arquivo <strong>Option.ini</strong> (ou use um L2 File Editor para abrir o l2.ini se for servidor protegido).</li>
            <li>Procure por <code>GamePlayViewportX</code> e <code>Y</code>. Reduza a resolução se estiver travando.</li>
            <li>Use o comando <strong>Alt + P</strong> dentro do jogo. Ele ativa o "Minimum Mode", que carrega modelo único para todos os personagens, essencial para Sieges com 500+ players.</li>
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
            difficultyLevel="Avançado"
            contentSections={contentSections}
            summaryTable={summaryTable}
        />
    );
}
