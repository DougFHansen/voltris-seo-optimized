import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Como Escolher a Placa de Vídeo Ideal em 2026";
const description = "RTX, RX ou Arc? Aprenda como escolher a melhor placa de vídeo para o seu orçamento, monitor e objetivos no PC Gamer em 2026.";
const keywords = [
    'como escolher placa de video 2026 guia',
    'melhor placa de video custo beneficio 2026 tutorial',
    'rtx vs rx vs intel arc qual escolher 2026',
    'placa de video para 1080p vs 1440p guia completo',
    'vram necessária para jogos em 2026 tutorial'
];

export const metadata: Metadata = createGuideMetadata('como-escolher-placa-de-video', title, description, keywords);

export default function GPUBuyingGuide() {
    const summaryTable = [
        { label: "Uso: 1080p", value: "RTX 4060 / RX 7600 / Arc A750" },
        { label: "Uso: 1440p (2K)", value: "RTX 4070 Super / RX 7800 XT" },
        { label: "VRAM Mínima (2026)", value: "8GB (Entrada) / 12GB (Ideal)" },
        { label: "Dificuldade", value: "Médio" }
    ];

    const contentSections = [
        {
            title: "O coração do PC Gamer em 2026",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Em 2026, a placa de vídeo (GPU) é o componente mais caro e importante do seu setup. Não adianta ter o melhor processador do mundo se a sua GPU não consegue processar os efeitos de luz modernos (Ray Tracing) ou as texturas pesadas dos jogos de última geração. Escolher bem em 2026 significa olhar além do "poder bruto" e focar também nas tecnologias de IA e eficiência energética.
        </p>
      `
        },
        {
            title: "1. VRAM: A armadilha da memória",
            content: `
        <p class="mb-4 text-gray-300">Em 2026, a quantidade de memória de vídeo (VRAM) é vital:</p>
        <p class="text-sm text-gray-300">
            Jogos lançados em 2026 estão consumindo cada vez mais memória devido ao aumento da qualidade das texturas. <br/><br/>
            - <strong>8GB:</strong> É o "mínimo para sobreviver" em 1080p. Em alguns jogos, você precisará reduzir a qualidade das texturas. <br/>
            - <strong>12GB ou 16GB:</strong> É o ponto ideal para longevidade. Se você quer ficar 4 anos sem trocar de placa, procure modelos com pelo menos 12GB.
        </p>
      `
        },
        {
            title: "2. NVIDIA vs AMD vs Intel em 2026",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Qual Marca Escolher?</h4>
            <p class="text-sm text-gray-300">
                - <strong>NVIDIA:</strong> Melhor tecnologia de IA (DLSS 3.5), Ray Tracing superior e ideal para quem faz Stream ou edição de vídeo. <br/>
                - <strong>AMD:</strong> Melhor custo por cada frame. Geralmente são mais baratas e oferecem mais VRAM bruta na mesma faixa de preço da concorrência. <br/>
                - <strong>Intel Arc:</strong> A terceira via. Oferecem excelente performance em 2026 pelo preço, mas ainda podem ter problemas em jogos muito antigos (DiretX 9).
            </p>
        </div>
      `
        },
        {
            title: "3. Casamento com o Monitor",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>Não desperdice dinheiro:</strong> 
            <br/><br/>Se o seu monitor é 1080p 60Hz, comprar uma RTX 4080 é jogar dinheiro fora, pois você nunca verá o poder total da placa. <br/><br/>
            - Para <strong>1080p</strong>, foque em placas de entrada e média-baixa. <br/>
            - Para <strong>1440p (QHD)</strong>, você precisará de placas com barramento de memória maior (192 bits ou mais). <br/>
            - Para <strong>4K</strong>, o investimento é alto e exige placas topo de linha com pelo menos 16GB de VRAM.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/rtx-4060-vale-a-pena-2026",
            title: "Review RTX 4060",
            description: "A placa mais popular de 2026 sob análise."
        },
        {
            href: "/guias/atualizacao-drivers-video",
            title: "Instalar Placa",
            description: "Como preparar o Windows para a placa nova."
        },
        {
            href: "/guias/aceleracao-hardware-gpu-agendamento",
            title: "Performance Max",
            description: "Extraia cada FPS da sua nova GPU."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="25 min"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
