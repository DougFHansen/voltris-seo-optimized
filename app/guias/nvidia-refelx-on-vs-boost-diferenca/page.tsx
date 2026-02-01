import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "NVIDIA Reflex: On vs Boost - Qual a Diferença Real e Qual Usar? (2026)";
const description = "Entenda a técnica por trás do NVIDIA Reflex. O 'Boost' esquenta a placa? Melhora o FPS? Veja quando usar cada opção para reduzir o Input Lag.";
const keywords = ['nvidia reflex on vs boost', 'o que é nvidia reflex', 'reduzir input lag placa de video', 'gpu boost clock fixo', 'melhorar tempo de resposta monitor', 'reflex low latency mode'];

export const metadata: Metadata = createGuideMetadata('nvidia-refelx-on-vs-boost-diferenca', title, description, keywords);

export default function ReflexGuide() {
    const summaryTable = [
        { label: "Desktop Gamer", value: "On + Boost" },
        { label: "Notebook", value: "On (Apenas)" },
        { label: "Efeito", value: "Reduz Fila CPU" },
        { label: "FPS", value: "Não Altera" }
    ];

    const contentSections = [
        {
            title: "Como funciona a Fila de Renderização?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
          Imagine que sua CPU é um cozinheiro cortando legumes e sua GPU é a panela fritando. Se o cozinheiro cortar rápido demais (300 cenouras), a panela não dá conta e forma uma fila de cenouras esperando. Essa fila é o <strong>Input Lag</strong>. O NVIDIA Reflex elimina essa fila, fazendo a CPU esperar a GPU terminar antes de mandar o próximo frame.
        </p>
      `,
            subsections: []
        },
        {
            title: "Diferença: On vs On+Boost",
            content: `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div class="bg-blue-900/20 p-6 rounded-xl border border-blue-500">
                <h4 class="text-white font-bold mb-2">Modo ON (Ligado)</h4>
                <p class="text-gray-300 text-sm">
                    Apenas gerencia a fila. A placa de vídeo continua operando normalmente, baixando o clock (MHz) quando a cena é leve para economizar energia.
                    <br/><br/><strong>Recomendado para:</strong> Notebooks Gamers (para não superaquecer) e PCs com fonte limitada.
                </p>
            </div>
            <div class="bg-red-900/20 p-6 rounded-xl border border-red-500">
                <h4 class="text-white font-bold mb-2">Modo ON + BOOST</h4>
                <p class="text-gray-300 text-sm">
                    Além de gerenciar a fila, ele <strong>força a GPU a rodar no Clock Máximo o tempo todo</strong>. Mesmo se você estiver olhando para uma parede cinza, a placa estará "acelerada" aguardando ação.
                    <br/><br/>Isso elimina o micro-lag que acontece quando você sai de uma área calma para uma explosão.
                    <br/><strong>Recomendado para:</strong> Desktops Competitivos.
                </p>
            </div>
        </div>
      `,
            subsections: []
        },
        {
            title: "Mito: NVIDIA Reflex aumenta o FPS?",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>NÃO.</strong> Na verdade, em alguns casos raros, ligar o Reflex pode diminuir seu FPS em 1% ou 2%.
        </p>
        <p class="text-gray-300">
            Mas lembre-se: FPS não é Latência. É melhor ter 190 FPS com resposta instantânea do mouse do que 200 FPS com sensação de "mouse pesado" (floaty). Sempre deixe ligado em jogos de tiro.
        </p>
      `
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="5 min"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
        />
    );
}
