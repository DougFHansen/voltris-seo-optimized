import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "PC Liga Mas Não Dá Vídeo? Guia de Diagnóstico (Bips e RAM) - Voltris";
const description = "O cooler gira mas a tela fica preta? Aprenda a limpar a memória RAM com borracha, resetar a BIOS (Clear CMOS) e identificar bips de erro.";
const keywords = ['pc liga nao da video', 'tela preta pc cooler gira', 'limpar memoria borracha', 'resetar bios clear cmos', 'pc nao bipa'];

export const metadata: Metadata = createGuideMetadata('pc-liga-sem-video-diagnostico', title, description, keywords);

export default function NoVideoGuide() {
    const summaryTable = [
        { label: "Causa #1", value: "Memória RAM Suja" },
        { label: "Causa #2", value: "BIOS Travada" }
    ];

    const contentSections = [
        {
            title: "Passo 1: A Borracha Mágica (Memória)",
            content: `
        <p class="mb-4">A causa mais comum (90%) é oxidação nos contatos dourados da memória RAM.</p>
        <ol class="space-y-3 text-gray-300 list-decimal list-inside ml-4">
            <li>Abra o PC (desligado da tomada).</li>
            <li>Retire os pentes de memória.</li>
            <li>Passe uma <strong>borracha escolar branca</strong> (macia) nos contatos dourados, dos dois lados, até brilharem.</li>
            <li>Limpe os farelos com um pincel (não sopre com saliva).</li>
            <li>Encaixe firmemente até ouvir o "CLEC".</li>
        </ol>
      `,
            subsections: []
        },
        {
            title: "Passo 2: Clear CMOS (Resetar BIOS)",
            content: `
        <p class="mb-4">Se a BIOS estiver com configuração errada, o PC não sobe vídeo.</p>
        <ol class="space-y-3 text-gray-300 list-decimal list-inside ml-4">
            <li>Localize a bateria redonda prateada (CR2032) na placa-mãe.</li>
            <li>Retire a bateria com cuidado.</li>
            <li>Espere 1 minuto.</li>
            <li>Coloque a bateria de volta. Isso reseta a BIOS para o padrão de fábrica.</li>
        </ol>
      `
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="30 minutos"
            difficultyLevel="Intermediário"
            contentSections={contentSections}
            summaryTable={summaryTable}
        />
    );
}
