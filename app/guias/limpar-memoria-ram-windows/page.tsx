import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Como Limpar a Memória RAM no Windows Sem Programas - Voltris";
const description = "Seu PC está 'engasgando'? Aprenda a identificar processos vampiros, usar o ISLC e limpar o cache da memória RAM para jogos rodarem liso.";
const keywords = ['limpar memoria ram', 'pc travando', 'memoria ram cheia', 'islc intelligent standby list cleaner', 'gerenciador de tarefas'];

export const metadata: Metadata = createGuideMetadata('limpar-memoria-ram-windows', title, description, keywords);

export default function RAMGuide() {
    const summaryTable = [
        { label: "Dificuldade", value: "Iniciante" },
        { label: "Ferramenta", value: "ISLC (Opcional)" }
    ];

    const contentSections = [
        {
            title: "Mito: 'Memória vazia é memória boa'",
            content: `
        <p class="mb-4">O Windows 10/11 usa RAM vazia para fazer cache de programas que você usa muito, para que eles abram rápido. Isso é bom. O problema é quando o cache não é liberado quando você vai jogar.</p>
      `
        },
        {
            title: "1. Identificando Ladrões de Memória",
            content: `
        <p class="mb-4">Abra o Gerenciador de Tarefas (Ctrl + Shift + Esc) e clique na coluna <strong>Memória</strong> para ordenar.</p>
        <p class="text-gray-300">Navegadores (Chrome/Edge) são os maiores vilões. Feche as abas que não usa. Verifique também se tem antivírus de terceiros (Avast, McAfee) consumindo muito; o Windows Defender é mais leve.</p>
      `
        },
        {
            title: "2. Intelligent Standby List Cleaner (ISLC)",
            content: `
        <p class="mb-4">Para gamers, esse é o segredo. O Windows às vezes esquece de limpar a memória 'Standby' (Standby List) quando você entra num jogo pesado, causando travadinhas (stuttering).</p>
        <ol class="text-gray-300 list-decimal list-inside ml-4">
            <li>Baixe o <strong>ISLC</strong> (Wagnardsoft).</li>
            <li>Configure "The list size is at least": 1024 MB.</li>
            <li>Configure "Free memory is lower than": Metade da sua RAM total (ex: 8000 se tiver 16GB).</li>
            <li>Clique em Start. Minimize e vá jogar.</li>
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
