import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Como Calibrar as Cores do Monitor no Windows (Sem Colorímetro)";
const description = 'Seu monitor está amarelado ou "lavado"? Aprenda a usar a ferramenta nativa de calibração do Windows para ajustar Gama, Brilho e Contraste corretamente.';
const keywords = ['calibrar monitor windows', 'cores monitor lavadas', 'ajustar gama windows', 'calibração de cores tela', 'monitor amarelado'];

export const metadata: Metadata = createGuideMetadata('calibrar-cores-monitor', title, description, keywords);

export default function ColorGuide() {
    const contentSections = [
        {
            title: "Por que calibrar?",
            content: `
        <p class="mb-4">Monitores vêm de fábrica com brilho no máximo e cores frias (azuladas) para chamar atenção na loja. Em casa, isso cansa a vista e distorce fotos.</p>
      `,
            subsections: []
        },
        {
            title: "Passo a Passo (Nativo)",
            content: `
        <ol class="space-y-4 text-gray-300 list-decimal list-inside ml-4">
            <li>Pressione Windows + R e digite <strong>dccw</strong>. Dê Enter.</li>
            <li>O assistente "Calibrar Cores do Visor" vai abrir.</li>
            <li><strong>Ajuste de Gama:</strong> Mova o slider até que o ponto no meio dos círculos desapareça (se funda com a sombra).</li>
            <li><strong>Brilho:</strong> Abra o menu do próprio monitor (nos botões físicos). Ajuste até ver a camisa preta na foto de exemplo, mas sem clarear o fundo preto.</li>
            <li><strong>Equilíbrio de Cores:</strong> Remova tons de cor. Se o branco parece "papel velho", diminua o Vermelho/Verde. Se parece "gelo", diminua o Azul.</li>
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
            difficultyLevel="Iniciante"
            contentSections={contentSections}
        />
    );
}
