import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Air Cooler vs Water Cooler: Qual Refrigera Melhor? - Voltris";
const description = "Você precisa de um Water Cooler caro ou um Air Cooler resolve? Comparativo de temperatura, ruído e durabilidade para processadores Ryzen e Intel.";
const keywords = ['water cooler vs air cooler', 'refrigeração liquida vale a pena', 'durabilidade water cooler', 'melhor cooler ryzen 7', 'air cooler custo beneficio'];

export const metadata: Metadata = createGuideMetadata('water-cooler-vs-air-cooler-qual-escolher', title, description, keywords);

export default function CoolerGuide() {
    const summaryTable = [
        { label: "Durabilidade", value: "Air Cooler (Eterna)" },
        { label: "Estética", value: "Water Cooler" }
    ];

    const contentSections = [
        {
            title: "O Ponto de Falha",
            content: `
        <div class="bg-red-900/20 border-l-4 border-red-500 p-4 mb-4">
            <p class="text-red-400 font-bold">A Bomba</p>
            <p class="text-gray-300 text-sm">Todo Water Cooler tem uma bomba d'água mecânica que <strong>vai quebrar</strong> um dia (geralmente em 3-5 anos). Quando quebra, o PC superaquece na hora.</p>
        </div>
        <p class="text-gray-300">O Air Cooler é só um bloco de metal e uma ventoinha. Se a ventoinha quebrar, custa R$ 30 pra trocar. O bloco de metal dura 100 anos.</p>
      `,
            subsections: []
        },
        {
            title: "Quando usar Water Cooler?",
            content: `
        <ul class="text-gray-300 list-disc list-inside ml-4">
            <li>Se você tem um i9 ou Ryzen 9 que esquenta demais (TDP > 200W).</li>
            <li>Se você quer estética (o gabinete fica limpo).</li>
            <li>Se for um WC de 360mm (menos que isso, Air Coolers de topo são melhores).</li>
        </ul>
      `
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="10 minutos"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
        />
    );
}
