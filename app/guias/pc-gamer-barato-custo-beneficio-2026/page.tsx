import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "PC Gamer Barato em 2026: Guia de Peças Custo-Benefício";
const description = "Quer montar um PC para rodar tudo sem gastar uma fortuna? Veja nossa lista de peças recomendadas (CPU, GPU, RAM) para o melhor custo-benefício em 2026.";
const keywords = [
    'melhor pc gamer barato 2026 custo benefício',
    'montar pc gamer 3000 reais 2026',
    'ryzen 5 ou intel core i5 para pc barato 2026',
    'melhor placa de vídeo barata para 1080p 2026',
    'setup gamer barato e bom para rodar gta v e valorant'
];

export const metadata: Metadata = createGuideMetadata('pc-gamer-barato-custo-beneficio-2026', title, description, keywords);

export default function BudgetPCGuide() {
    const summaryTable = [
        { label: "Processador", value: "Ryzen 5 5600 / Core i5-12400F" },
        { label: "Placa de Vídeo", value: "RX 6600 / RTX 3050 (ou usadas)" },
        { label: "Memória RAM", value: "16GB (2x8GB) DDR4" },
        { label: "Armazenamento", value: "SSD NVMe 512GB" }
    ];

    const contentSections = [
        {
            title: "O Mercado de Hardware em 2026",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Em 2026, montar um PC barato exige inteligência. Com o lançamento das novas gerações (DDR5 e RTX 50), o mercado de <strong>peças usadas e da geração anterior (DDR4)</strong> se tornou o paraíso do custo-benefício. É possível montar uma máquina que roda todos os jogos em 1080p gastando o preço de um console básico.
        </p>
      `
        },
        {
            title: "1. O Processador (CPU): O coração do sistema",
            content: `
        <p class="mb-4 text-gray-300">Não compre processadores com menos de 6 núcleos em 2026.</p>
        <ul class="list-disc list-inside text-gray-300 space-y-3">
            <li><strong>Rei do Custo-Benefício:</strong> AMD Ryzen 5 5600. Barato, frio e com performance incrível em jogos.</li>
            <li><strong>Alternativa Intel:</strong> Core i5-12400F. Uma opção sólida que costuma aparecer em promoções agressivas.</li>
            <li><strong>Dica:</strong> Fuja dos i3 e Ryzen 3 de gerações antigas; eles já sofrem para manter o Windows 11 fluido e o Discord aberto simultaneamente.</li>
        </ul>
      `
        },
        {
            title: "2. Placa de Vídeo (GPU): Onde investir mais",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">A Regra dos 8GB de VRAM:</h4>
            <p class="text-sm text-gray-300">
                Nunca compre uma placa de vídeo com menos de 8GB de memória em 2026. <br/><br/>
                - <strong>Melhor escolha:</strong> AMD RX 6600. É a placa mais barata que roda quase tudo no Alto em 1080p. <br/>
                - <strong>Opção de entrada:</strong> RTX 3050 (8GB). Te dá acesso ao DLSS, que ajuda muito em jogos pesados.
            </p>
        </div>
      `
        },
        {
            title: "3. O \"Pulo do Gato\": Peças Usadas",
            content: `
        <p class="mb-4 text-gray-300">
            Se o orçamento estiver muito apertado, considere comprar a <strong>Placa de Vídeo e o Processador usados</strong> (com procedência). Gabinete, Fonte e SSD devem ser sempre comprados <strong>NOVOS</strong>, pois são as peças que mais sofrem desgaste físico ou que podem queimar o resto do seu sistema se falharem.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/como-escolher-placa-de-video",
            title: "Escolher GPU",
            description: "Dicas profundas sobre placas de vídeo."
        },
        {
            href: "/guias/como-escolher-processador-2026",
            title: "Escolher CPU",
            description: "Diferenças entre núcleos e threads."
        },
        {
            href: "/guias/montagem-pc-gamer-erros-comuns",
            title: "Guia de Montagem",
            description: "Aprenda a montar sozinho e economize."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="30 min"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
