import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'euro-truck-simulator-2-otimizacao',
  title: "Euro Truck Simulator 2: Melhores Configurações de FPS (2026)",
  description: "O ETS2 está travando em cidades grandes? Aprenda como otimizar o Euro Truck Simulator 2 para rodar liso no seu PC em 2026.",
  category: 'otimizacao',
  difficulty: 'Intermediário',
  time: '15 min'
};

const title = "Euro Truck Simulator 2: Melhores Configurações de FPS (2026)";
const description = "O ETS2 está travando em cidades grandes? Aprenda como otimizar o Euro Truck Simulator 2 para rodar liso no seu PC em 2026.";
const keywords = [
    'melhores configurações euro truck simulator 2 2026',
    'como aumentar fps ets2 pc fraco tutorial 2026',
    'ets2 lag fix cidades grandes windows 11 guia',
    'configurar graficos realistas ets2 com performance',
    'mods de otimização ets2 2026 pc gamer tutorial'
];

export const metadata: Metadata = createGuideMetadata('euro-truck-simulator-2-otimizacao', title, description, keywords);

export default function ETS2OptimizationGuide() {
    const summaryTable = [
        { label: "Upscaling", value: "FSR 2.0 (Nativo do Jogo)" },
        { label: "Grande Vilão", value: "Escalonamento (Scaling) acima de 200%" },
        { label: "Destaque 2026", value: "Melhoria de shaders e iluminação" },
        { label: "Dificuldade", value: "Médio" }
    ];

    const contentSections = [
        {
            title: "Dirigindo sem travadas na Europa de 2026",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O **Euro Truck Simulator 2 (ETS2)** é um jogo que depende muito de um único núcleo do processador. Mesmo com placas de vídeo potentes em 2026, você pode notar quedas de FPS ao entrar em cidades detalhadas como Berlim ou Paris devido ao tráfego e luzes. O segredo para rodar liso é equilibrar a qualidade visual com o processamento de sombras e reflexos em tempo real.
        </p>
      `
        },
        {
            title: "1. O Segredo do Escalonamento (Scaling)",
            content: `
        <p class="mb-4 text-gray-300">Este é o ajuste que mais consome GPU no jogo:</p>
        <p class="text-sm text-gray-300">
            Muitos jogadores colocam o escalonamento em 400% para remover o serrilhado. No entanto, isso faz com que o jogo renderize em 4K, mesmo que você tenha um monitor 1080p. <br/><br/>
            <strong>Dica de 2026:</strong> Configure em 100% ou 125% e use o **FSR (FidelityFX Super Resolution)** nas configurações gráficas. Isso dará a mesma nitidez sem o peso absurdo do super-sampling, garantindo frames estáveis até nas capitais mais pesadas.
        </p>
      `
        },
        {
            title: "2. Sombras e Retrovisores: Cuidado!",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Poupe o Processador:</h4>
            <p class="text-sm text-gray-300">
                Os retrovisores do ETS2 são "mini-telas" que renderizam o jogo novamente. <br/><br/>
                - <strong>Distância do Retrovisor:</strong> Coloque em Médio. <br/>
                - <strong>Resolução do Retrovisor:</strong> No Baixo ou Médio. <br/>
                - <strong>Qualidade das Sombras:</strong> Use o Médio; as sombras no 'Ultra' são o principal motivo de FPS baixo em pátios de empresas lotados de caminhões.
            </p>
        </div>
      `
        },
        {
            title: "3. Otimização via Opções de Inicialização",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>Maximize o uso do Motor:</strong> 
            <br/><br/>Na Steam, clique com o direito no ETS2 > Propriedades > Geral. Nas opções de inicialização, coloque: <br/><br/>
            <code>-mm_max_resource_size 100 -mm_max_tmp_buffers_size 1000 -mm_pool_size 4000</code> <br/><br/>
            Esse comando permite que o jogo use mais memória para o cache de modelos, reduzindo "congeladas" rápidas que acontecem quando um novo caminhão da AI aparece na sua frente na rodovia.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/otimizacao-performance",
            title: "Otimizar Sistema",
            description: "Prepare o Windows para simulação pesada."
        },
        {
            href: "/guias/limpar-memoria-ram-windows",
            title: "Liberar RAM",
            description: "Dica vital para quem usa muitos mods de mapa."
        },
        {
            href: "/guias/configuracao-roteador-wifi",
            title: "Comboio Estável",
            description: "Evite lag no modo multiplayer TruckersMP."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="15 min"
            difficultyLevel="Médio"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
