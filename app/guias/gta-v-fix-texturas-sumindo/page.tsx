import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "GTA V: Como Corrigir Texturas Sumindo (Chão Invisível) - Voltris";
const description = "O mapa do GTA V não carrega enquanto você dirige rápido? Veja como resolver o bug de texturas sumindo e High Priority no Gerenciador de Tarefas.";
const keywords = ['gta v texturas sumindo', 'gta 5 mapa não carrega', 'gta v bug chão invisivel', 'gta v cpu priority', 'fix texture loss gta v'];

export const metadata: Metadata = createGuideMetadata('gta-v-fix-texturas-sumindo', title, description, keywords);

export default function GTATextureGuide() {
    const contentSections = [
        {
            title: "O Culpado: Prioridade da CPU",
            content: `
        <p class="mb-4">Esse bug acontece quando o processador está tão ocupado calculando a física do jogo que esquece de mandar os dados do mapa para a placa de vídeo. A solução é dar ALTA PRIORIDADE ao jogo.</p>
        <ol class="space-y-4 text-gray-300 list-decimal list-inside ml-4">
            <li>Abra o GTA V.</li>
            <li>Dê Alt + Tab e abra o Gerenciador de Tarefas.</li>
            <li>Vá na aba <strong>Detalhes</strong>.</li>
            <li>Ache <code>GTA5.exe</code>. Clique com botão direito > Definir Prioridade > <strong>Alta</strong>.</li>
            <li>Nota: VOCÊ PRECISA FAZER ISSO TODA VEZ QUE ABRIR O JOGO.</li>
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
        />
    );
}
