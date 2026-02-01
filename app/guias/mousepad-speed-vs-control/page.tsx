import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Mousepad Speed vs Control: Qual Escolher para Cada Jogo? - Voltris";
const description = "A textura do tecido muda sua mira. Entenda a diferença entre Speed (deslize rápido), Control (precisão) e Híbrido par CS2 e Valorant.";
const keywords = ['mousepad speed control', 'diferença mousepad', 'qual mousepad cs2', 'tapete mouse gamer', 'mousepad zowie logitech'];

export const metadata: Metadata = createGuideMetadata('mousepad-speed-vs-control', title, description, keywords);

export default function MousepadGuide() {
    const summaryTable = [
        { label: "CS2 / Valorant", value: "Control" },
        { label: "Warzone / Apex", value: "Speed" }
    ];

    const contentSections = [
        {
            title: "Control: O Rei do TacFPS",
            content: `
        <p class="mb-4">Jogos como Valorant exigem que você pare a mira exatamante na cabeça (micro-ajuste). O mousepad Control tem uma trama áspera que cria atrito, ajudando a "frear" o mouse.</p>
      `,
            subsections: []
        },
        {
            title: "Speed: Para Tracking",
            content: `
        <p class="text-gray-300">Em jogos como Overwatch ou Apex Legends, onde o inimigo não para de pular, você precisa seguir o alvo sem atrito. O Speed é liso e permite movimentos rápidos sem cansar o braço.</p>
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
