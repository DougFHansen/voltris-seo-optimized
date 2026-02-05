import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'red-dead-redemption-2-melhores-configuracoes-rdr2',
  title: "RDR2: Melhores Configurações de Gráficos e FPS (2026)",
  description: "Quer rodar Red Dead Redemption 2 com visual incrível e FPS alto? Veja este guia das configurações otimizadas para PC em 2026.",
  category: 'rede-seguranca',
  difficulty: 'Iniciante',
  time: '15 min'
};

const title = "RDR2: Melhores Configurações de Gráficos e FPS (2026)";
const description = "Quer rodar Red Dead Redemption 2 com visual incrível e FPS alto? Veja este guia das configurações otimizadas para PC em 2026.";
const keywords = [
    'melhores configurações rdr2 pc 2026 guia',
    'red dead redemption 2 pc config fps boost',
    'rdr2 vulkan vs dx12 qual melhor 2026',
    'como aumentar fps no rdr2 pc fraco tutorial',
    'rdr2 otimização de gráficos pc guia completo'
];

export const metadata: Metadata = createGuideMetadata('red-dead-redemption-2-melhores-configuracoes-rdr2', title, description, keywords);

export default function RDR2OptimizationGuide() {
    const summaryTable = [
        { label: "API Recomendada", value: "Vulkan (Mais FPS) / DX12 (Mais estabilidade)" },
        { label: "Configuração Chave", value: "Texturas (Sempre Ultra)" },
        { label: "Check de Hardware", value: "Exige 8GB de VRAM para Ultra" },
        { label: "Dificuldade", value: "Fácil" }
    ];

    const contentSections = [
        {
            title: "A obra-prima que ainda pesa no PC",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Mesmo anos após o lançamento, **Red Dead Redemption 2** continua sendo um dos jogos mais bonitos e exigentes em 2026. O segredo para rodar o jogo bem não é colocar tudo no "Médio", mas sim entender quais opções gráficas consomem 50% da sua performance e quais não mudam nada no visual. Este guia foca no equilíbrio perfeito entre fidelidade e fluidez.
        </p>
      `
        },
        {
            title: "1. Vulkan vs DirectX 12 em 2026",
            content: `
        <p class="mb-4 text-gray-300">A escolha da API define a base da sua performance:</p>
        <p class="text-sm text-gray-300">
            - <strong>Vulkan:</strong> Costuma entregar 5 a 10 FPS a mais e tem frametimes mais lisos na maioria das GPUs NVIDIA e AMD modernas. É a recomendação para 2026. <br/><br/>
            - <strong>DirectX 12:</strong> Use apenas se você estiver sofrendo com crashes aleatórios no Vulkan ou se estiver usando placas Intel Arc, que costumam preferir o DX12.
        </p>
      `
        },
        {
            title: "2. Configurações que \"Matam\" o FPS",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Otimização Cirúrgica:</h4>
            <p class="text-sm text-gray-300">
                Para ganhar até 40% mais performance sem perder visual, mude estes itens: <br/><br/>
                - <strong>Water Reflection/Refraction Quality:</strong> Low ou Medium. O reflexo na água do RDR2 é pesado demais para o pouco que aparece. <br/>
                - <strong>Volumetric Lighting:</strong> Medium. Esse ajuste controla a luz entre as nuvens e neblina; no Ultra, ele destrói qualquer GPU. <br/>
                - <strong>Shadow Quality:</strong> High (Não use Ultra). <br/>
                - <strong>Tree Quality:</strong> Medium. RDR2 tem milhares de árvores; o processamento individual delas no talo causa quedas de FPS.
            </p>
        </div>
      `
        },
        {
            title: "3. O Único item que deve estar no ULTRA",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>Texture Quality:</strong> 
            <br/><br/>No RDR2, a diferença visual entre 'High' e 'Ultra' nas texturas é gritante. Colocar as texturas em High faz o jogo parecer borrado, com visual de console antigo. Em 2026, **sempre deixe as texturas no Ultra**, mesmo que precise reduzir todo o resto. Se a sua placa de vídeo tiver pelo menos 4GB ou 6GB de VRAM, ela aguentará o Ultra se as outras opções estiverem otimizadas.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/atualizacao-drivers-video",
            title: "Drivers de Vídeo",
            description: "Essencial para evitar bugs de textura no RDR2."
        },
        {
            href: "/guias/limitar-fps-rivatuner-nvidia",
            title: "RivaTuner (RTSS)",
            description: "Estabilize o frametime do cavalgar."
        },
        {
            href: "/guias/hdr-windows-vale-a-pena-jogos",
            title: "HDR no Windows 11",
            description: "Faça o pôr do sol de RDR2 brilhar de verdade."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="15 min"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
