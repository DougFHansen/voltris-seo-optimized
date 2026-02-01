import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Red Dead Redemption 2 (RDR2): Guia de Gráficos Otimizados para 60 FPS (2026)";
const description = "RDR2 é pesado até hoje. Descubra quais configurações (Água, Volumétricos e MSAA) destroem seu FPS e como deixar o jogo lindo sem travar.";
const keywords = ['rdr2 melhores configuracoes graficas', 'red dead redemption 2 otimizar pc', 'rdr2 aumentar fps', 'qualidade da agua rdr2', 'taav vs msaa rdr2', 'rdr2 pc fraco config'];

export const metadata: Metadata = createGuideMetadata('red-dead-redemption-2-melhores-configuracoes-rdr2', title, description, keywords);

export default function RDR2Guide() {
    const summaryTable = [
        { label: "Matador de FPS", value: "Física da Água" },
        { label: "Iluminação", value: "Médio (Otimizado)" },
        { label: "Anti-Aliasing", value: "TAA (Apenas)" },
        { label: "API", value: "Vulkan (Melhor)" }
    ];

    const contentSections = [
        {
            title: "Vulkan vs DirectX 12",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
          O RDR2 roda nativamente na API <strong>Vulkan</strong>. Na maioria das placas (especialmente AMD), o Vulkan entrega 5 a 10 FPS a mais que o DX12. Só troque para DX12 se o Vulkan estiver fechando o jogo sozinho (Crash).
        </p>
      `,
            subsections: []
        },
        {
            title: "Configurações Hub (Xbox One X Settings)",
            content: `
        <p class="mb-4 text-gray-300">
            A comunidade descobriu que as configurações do console (que é lindo) são uma mistura de Médio e Alto. Copie isso para ter pc gamer:
        </p>
        <div class="space-y-2 text-sm text-gray-300 bg-gray-900 p-4 rounded border border-gray-700">
            <p><strong class="text-white">Qualidade de Iluminação:</strong> Médio (No Ultra, consome 30% da GPU à noite).</p>
            <p><strong class="text-white">Qualidade dos Reflexos:</strong> Baixo (Reflexos em espelhos são raros, não gaste recurso nisso).</p>
            <p><strong class="text-white">Qualidade da Água (Física):</strong> <span class="text-red-400 font-bold">2/4 (Metade)</span>. Se você deixar no máximo, a física da água calcula cada onda e mata o FPS.</p>
            <p><strong class="text-white">Qualidade das Sombras:</strong> Alto.</p>
            <p><strong class="text-white">Qualidade Volumétrica (Neblina):</strong> Médio. O efeito de raios de luz atravessando a neblina é lindo, mas pesado.</p>
        </div>
      `,
            subsections: []
        },
        {
            title: "O Maldito MSAA",
            content: `
        <p class="text-gray-300 mb-4">
            Nunca, jamais, em hipótese alguma ative o <strong>MSAA (Multisample Anti-Aliasing)</strong> no RDR2. Ele renderiza o jogo múltiplas vezes.
        </p>
        <p class="text-gray-300">
            Use apenas o <strong>TAA (Temporal Anti-Aliasing)</strong> em "Médio". Se achar a imagem borrada, aumente a "Nitidez do TAA" (Sharpening) nas opções ou use o filtro da NVIDIA (Alt+F3).
        </p>
      `
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="15 min"
            difficultyLevel="Intermediário"
            contentSections={contentSections}
            summaryTable={summaryTable}
        />
    );
}
