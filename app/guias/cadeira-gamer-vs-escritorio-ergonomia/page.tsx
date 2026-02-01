import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Cadeira Gamer vs Cadeira de Escritório: O Que Ninguém Te Conta";
const description = "Cadeira Gamer de couro sintético ou Cadeira Ergonômica de tela (Mesh)? Entenda qual protege sua coluna e dura mais no calor do Brasil.";
const keywords = ['cadeira gamer vs ergonomica', 'cadeira hermam miller vale a pena', 'couro descascando cadeira', 'cadeira mesh escritorio', 'melhor cadeira coluna'];

export const metadata: Metadata = createGuideMetadata('cadeira-gamer-vs-escritorio-ergonomia', title, description, keywords);

export default function ChairGuide() {
    const summaryTable = [
        { label: "Conforto Térmico", value: "Escritório (Mesh)" },
        { label: "Durabilidade", value: "Escritório" },
        { label: "Estilo", value: "Gamer" }
    ];

    const contentSections = [
        {
            title: "O Problema do Couro Sintético (PU)",
            content: `
        <p class="mb-4">No calor do Brasil, cadeiras gamer baratas de PU viram uma sauna. Você sua, o suor é ácido, e em 1 ano o couro começa a descascar inteira.</p>
      `,
            subsections: []
        },
        {
            title: "Por que escolher Ergonômica (Mesh)?",
            content: `
        <p class="text-gray-300">Cadeiras de escritório certificadas (NR17) focam na postura, não no visual de carro de corrida. O encosto em tela (Mesh) deixa as costas respirarem. Além disso, costumam ter garantia de 5 a 10 anos (marcas como Cavaletti ou Flexform), enquanto gamers dão 1 ano.</p>
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
