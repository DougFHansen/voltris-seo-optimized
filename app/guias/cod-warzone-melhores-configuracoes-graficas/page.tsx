import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "COD Warzone: Melhores Configurações de FPS e Visibilidade (2026)";
const description = "Quer ganhar vantagem no Warzone? Aprenda as configurações gráficas para 2026 que aumentam o FPS e permitem ver inimigos nas sombras sem travar.";
const keywords = [
    'melhores configurações warzone 2026 fps boost',
    'como aumentar fps warzone pc fraco 2026 guia',
    'configurar visibilidade warzone nvidia e amd tutorial',
    'warzone settings for visibility and performance 2026',
    'melhor driver para warzone 2026 pc gamer'
];

export const metadata: Metadata = createGuideMetadata('cod-warzone-melhores-configuracoes-graficas', title, description, keywords);

export default function WarzoneOptimizationGuide() {
    const summaryTable = [
        { label: "Upscaling", value: "DLSS 3.5 (NVIDIA) / FSR 3.1 (AMD) / XeSS (Intel)" },
        { label: "Configuração Chave", value: "Texture Resolution (Normal/High)" },
        { label: "Vantagem", value: "Menos Input Lag com NVIDIA Reflex" },
        { label: "Dificuldade", value: "Médio" }
    ];

    const contentSections = [
        {
            title: "O desafio de rodar Warzone em 2026",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Em 2026, o **Call of Duty: Warzone** continua sendo um dos jogos mais pesados para o processador (CPU) devido ao grande mapa e à enorme quantidade de jogadores simultâneos. O segredo para vencer não é ter os gráficos mais bonitos, mas sim ter a maior taxa de quadros (FPS) possível com o menor atraso de resposta (Input Lag), além de conseguir enxergar inimigos escondidos em cantos escuros.
        </p>
      `
        },
        {
            title: "1. Tecnologias de Upscaling (O Salvador do FPS)",
            content: `
        <p class="mb-4 text-gray-300">Em 2026, rodar em "Resolução Nativa" é coisa do passado:</p>
        <ul class="list-disc list-inside text-gray-300 space-y-3">
            <li><strong>NVIDIA DLSS:</strong> Se você tem uma RTX, use o modo 'Qualidade'. Ele reconstrói a imagem via IA, entregando mais FPS que o normal com imagem melhor que a nativa.</li>
            <li><strong>AMD FSR 3.1:</strong> Excelente para GPUs AMD e placas NVIDIA antigas (GTX). Ative o 'Frame Generation' se o seu monitor for 144Hz+.</li>
            <li><strong>Intel XeSS:</strong> A melhor alternativa se as outras duas apresentarem "fantasmas" (ghosting) na imagem.</li>
        </ul >
      `
        },
        {
            title: "2. Preset Competitivo 2026 (Visibilidade Máxima)",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Configurações Recomendadas:</h4>
            <p class="text-sm text-gray-300">
                - <strong>Texture Resolution:</strong> Normal (Evite o 'Low' para não borrar inimigos de longe). <br/>
                - <strong>Shadow Quality:</strong> Low (Limpa o cenário e facilita ver campers). <br/>
                - <strong>Anti-Aliasing:</strong> SMAA T2X (Configuração essencial para não ter serrilhado). <br/>
                - <strong>NVIDIA Reflex Low Latency:</strong> On + Boost (Reduz o tempo entre o clique do mouse e o tiro no jogo). <br/>
                - <strong>World Motion Blur:</strong> Sempre DESATIVADO.
            </p>
        </div>
      `
        },
        {
            title: "3. Otimização de áudio para passos",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>Ouvindo o Inimigo:</strong> 
            <br/><br/>No menu de áudio do Warzone em 2026, selecione o mix de áudio **'PC'** ou **'Headphones'**. Ative a opção de **'Equalização de Loudness'** no Windows (está em propriedades de som) para aumentar o volume de sons baixos (passos) e diminuir sons altos (explosões), protegendo seus ouvidos e te dando uma vantagem tática absurda.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/nvidia-refelx-on-vs-boost-diferenca",
            title: "NVIDIA Reflex",
            description: "Entenda como ele reduz seu tempo de reação."
        },
        {
            href: "/guias/reduzir-ping-jogos-online",
            title: "Reduzir Ping",
            description: "Melhore sua conexão nos servidores da Activision."
        },
        {
            href: "/guias/som-espacial-windows-configurar",
            title: "Som Espacial",
            description: "Ouça passos em 360 graus com precisão."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="20 min"
            difficultyLevel="Médio"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
