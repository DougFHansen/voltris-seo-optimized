import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Teclado Desconfigurado: Ç virou ;? Como Mudar ABNT2 para ANSI";
const description = "Seu teclado está trocando as teclas? Aprenda a diferença entre ABNT2 (Brasil) e ANSI (Internacional) e como adicionar o layout correto no Windows.";
const keywords = ['teclado desconfigurado', 'abnt2 vs ansi', 'teclado americano acentuacao', 'mudar idioma teclado windows', 'ç não funciona'];

export const metadata: Metadata = createGuideMetadata('teclado-desconfigurado-abnt2-ansi', title, description, keywords);

export default function KeyboardLayoutGuide() {
    const summaryTable = [
        { label: "Tem 'Ç'?", value: "ABNT2" },
        { label: "Não tem 'Ç'", value: "US Internacional" }
    ];

    const contentSections = [
        {
            title: "Identificando seu Teclado",
            content: `
        <ul class="text-gray-300 list-disc list-inside ml-4 space-y-2">
            <li><strong>ABNT2:</strong> Tem a tecla <strong>Ç</strong> e o Enter é grande (formato de bota). É o padrão brasileiro.</li>
            <li><strong>ANSI (US):</strong> Não tem Ç. O Enter é retangular pequeno. É o padrão de teclados gamers importados e notebooks gringos.</li>
        </ul>
      `,
            subsections: []
        },
        {
            title: "Configurando no Windows",
            content: `
        <ol class="space-y-4 text-gray-300 list-decimal list-inside ml-4">
            <li>Vá em Configurações > Hora e Idioma > <strong>Idioma e Região</strong>.</li>
            <li>Clique nos ... ao lado de "Português (Brasil)" e vá em <strong>Opções de idioma</strong>.</li>
            <li>Role até "Teclados Instalados".</li>
            <li>Se seu teclado tem Ç: Adicione <strong>Português (Brasil ABNT2)</strong>.</li>
            <li>Se seu teclado NÃO tem Ç: Adicione <strong>Estados Unidos (Internacional)</strong>.</li>
            <li>Remova o layout errado para evitar trocas acidentais (Win + Espaço).</li>
        </ol>
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
