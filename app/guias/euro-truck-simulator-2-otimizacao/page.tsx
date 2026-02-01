import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Euro Truck Simulator 2: Otimização de FPS e Config de Volante";
const description = "ETS2 travando na cidade? Veja como configurar o arquivo config.cfg, aumentar o buffer de memória e ajustar a Zona Morta do volante.";
const keywords = ['ets2 aumentar fps', 'euro truck 2 travando', 'configurar volante ets2', 'ets2 warp 0.8', 'otimizar ets2 mp'];

export const metadata: Metadata = createGuideMetadata('euro-truck-simulator-2-otimizacao', title, description, keywords);

export default function ETS2Guide() {
    const summaryTable = [
        { label: "Comando", value: "r_buffer_page_size" },
        { label: "Foco", value: "Cidades (Lag)" }
    ];

    const contentSections = [
        {
            title: "Launch Options para Mais Memória",
            content: `
        <p class="mb-4">O ETS2 carrega o mapa enquanto você dirige. Se o buffer for pequeno, ele trava para carregar.</p>
        <p class="text-gray-300 mb-2">Na Steam > Propriedades > Inicialização:</p>
        <code class="bg-[#121218] p-2 text-white block">-nointro -unlimitedlog -mm_max_resource_size 40 -mm_max_tmp_buffers_size 500 -mm_pool_size 8000</code>
        <p class="text-gray-400 text-xs mt-1">Isso aloca mais RAM para o mapa.</p>
      `,
            subsections: []
        },
        {
            title: "Configurando o Espelho",
            content: `
        <p class="text-gray-300">Dentro do jogo, reduza a <strong>Resolução do Espelho</strong> e a <strong>Distância do Espelho</strong> para "Médio". Os retrovisores renderizam o jogo duas vezes, são o maior peso gráfico.</p>
      `
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="15 minutos"
            difficultyLevel="Intermediário"
            contentSections={contentSections}
            summaryTable={summaryTable}
        />
    );
}
