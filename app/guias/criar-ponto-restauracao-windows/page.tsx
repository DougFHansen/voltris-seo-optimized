import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Ponto de Restauração: O Salva-Vidas do Windows (Como Criar)";
const description = "Vai instalar um driver ou programa novo? Crie um Ponto de Restauração antes. Se der tela azul, você pode voltar no tempo com um clique.";
const keywords = ['criar ponto de restauracao', 'ponto de restauração windows 11', 'restaurar sistema data anterior', 'backup antes de formatar', 'proteção sistema windows'];

export const metadata: Metadata = createGuideMetadata('criar-ponto-restauracao-windows', title, description, keywords);

export default function RestorePointGuide() {
    const summaryTable = [
        { label: "Espaço Usado", value: "1% a 5% do Disco" },
        { label: "Tempo pra Criar", value: "30 segundos" }
    ];

    const contentSections = [
        {
            title: "Ativando a Proteção",
            content: `
        <ol class="space-y-4 text-gray-300 list-decimal list-inside ml-4">
            <li>Pesquise por <strong>Criar ponto de restauração</strong>.</li>
            <li>Selecione o Disco C: e clique em <strong>Configurar</strong>.</li>
            <li>Marque <strong>Ativar a proteção do sistema</strong>.</li>
            <li>Ajuste o espaço para uns 5GB (é o suficiente). OK.</li>
            <li>Agora clique em <strong>Criar</strong>, dê um nome (ex: "Antes do Driver") e pronto.</li>
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
