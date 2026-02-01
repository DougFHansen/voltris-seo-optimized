import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Guia de Compra: Como Escolher Placa de Vídeo (GPU) em 2026";
const description = "RTX 5000, RX 8000 ou Intel Arc? Aprenda a analisar VRAM, largura de banda e compatibilidade com sua fonte e processador antes de comprar.";
const keywords = ['escolher placa de video', 'guia gpu 2026', 'gargalo processador', 'fonte para rtx', 'vram suficiente jogos'];

export const metadata: Metadata = createGuideMetadata('como-escolher-placa-de-video', title, description, keywords);

export default function GPUGuide() {
    const summaryTable = [
        { label: "Prioridade", value: "Orçamento" },
        { label: "Complexidade", value: "Alta" },
    ];

    const contentSections = [
        {
            title: "1. A Regra da VRAM (Memória de Vídeo)",
            content: `
        <p class="mb-4">Em 2026, jogos modernos estão exigindo cada vez mais memória de vídeo. Ignorar isso é o erro #1.</p>
        <ul class="text-gray-300 list-disc list-inside space-y-2 ml-4">
            <li><strong>8GB:</strong> O mínimo absoluto para 1080p. Já sofre em jogos Triple-A no Ultra.</li>
            <li><strong>12GB:</strong> O ideal para durar alguns anos jogando em 1080p/1440p.</li>
            <li><strong>16GB+:</strong> Obrigatório para 4K, edição de vídeo ou Inteligência Artificial.</li>
        </ul>
      `,
            subsections: []
        },
        {
            title: "2. Gargalo (Bottleneck): Não compre GPU demais para CPU de menos",
            content: `
        <p class="mb-4">Se você colocar uma RTX 4070 num Core i3 antigo, você jogou dinheiro fora. O processador não consegue enviar dados rápido o suficiente para a placa.</p>
        <p class="text-gray-300 text-sm">Regra prática: Sua placa de vídeo deve custar aproximadamente <strong>2x o preço do seu processador</strong> para estar equilibrado.</p>
      `
        },
        {
            title: "3. A Fonte de Alimentação (PSU)",
            content: `
        <div class="bg-red-900/20 border-l-4 border-red-500 p-4 mb-4">
            <p class="text-red-400 font-bold">Risco de Queima</p>
            <p class="text-gray-300 text-sm">Nunca use adaptadores molex para ligar placa de vídeo. Se sua fonte não tem os cabos PCI-E necessários, troque a fonte.</p>
        </div>
        <p class="text-gray-300">Verifique a recomendação do fabricante. Se a caixa pede 650W, compre 750W para ter folga e silêncio.</p>
      `
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="20 minutos"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
        />
    );
}
