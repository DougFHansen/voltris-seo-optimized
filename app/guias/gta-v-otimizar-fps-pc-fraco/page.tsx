import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "GTA V: Melhores Configurações para PC Fraco (Dicas de FPS)";
const description = "Seu GTA V trava muito ou roda em câmera lenta? Aprenda as configurações gráficas secretas para ganhar FPS e rodar o jogo fluido em qualquer PC em 2026.";
const keywords = [
    'gta v pc fraco configurações fps 2026',
    'como ganhar mais fps no gta 5 tutorial',
    'gta v shaders e sombras para pc fraco',
    'melhorar desempenho gta 5 notebook gamer 2026',
    'gta v gráficos mínimos vs ultra performance'
];

export const metadata: Metadata = createGuideMetadata('gta-v-otimizar-fps-pc-fraco', title, description, keywords);

export default function GTAVPerformanceGuide() {
    const summaryTable = [
        { label: "Mudar DirectX", value: "DirectX 10 (Mais leve)" },
        { label: "Sombras", value: "Nítidas (Sharp) - Desliga o efeito borrão" },
        { label: "FXAA", value: "Ligado (Baixo impacto)" },
        { label: "MSAA", value: "DESLIGADO (Extremamente pesado)" }
    ];

    const contentSections = [
        {
            title: "Otimizando o Clássico em 2026",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Embora o GTA V seja um jogo de 2013, o motor gráfico <strong>RAGE</strong> foi atualizado diversas vezes pela Rockstar. Em 2026, com os novos efeitos de iluminação e densidade de tráfego, rodar o jogo em um notebook antigo ou PC com vídeo integrado (Ryzen G / Intel UHD) exige sacrifícios inteligentes. Você não precisa deixar o jogo feio, apenas desligar o que você não vê enquanto dirige a 200 km/h.
        </p>
      `
        },
        {
            title: "1. O Vilão do FPS: MSAA",
            content: `
        <p class="mb-4 text-gray-300">Se existe uma opção que você deve ignorar completamente, é o MSAA:</p>
        <ul class="list-disc list-inside text-gray-300 space-y-3">
            <li><strong>MSAA:</strong> Deixe em <strong>Desligado</strong>. Ele tenta suavizar as bordas processando a imagem várias vezes, o que destrói o FPS em placas de vídeo de entrada.</li>
            <li><strong>FXAA:</strong> Deixe em <strong>Ligado</strong>. Ele faz quase o mesmo trabalho do MSAA, mas é processado como um filtro de imagem, custando quase 0 de performance.</li>
            <li><strong>Reflexões MSAA:</strong> Também em Desligado.</li>
        </ul >
      `
        },
        {
            title: "2. Sombras e Iluminação (Ajuste Estratégico)",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Ganho de 20% de FPS:</h4>
            <p class="text-sm text-gray-300">
                - <strong>Qualidade das Sombras:</strong> Mude para 'Normal'. As sombras no 'Alto' usam muito processamento de geometria. <br/>
                - <strong>Sombras Suaves:</strong> Escolha <strong>'Nítido' (Sharp)</strong>. Curiosamente, a opção mais simples é a que mais ajuda no FPS e evita aquele aspecto "borrado" nas sombras de prédios. <br/>
                - <strong>Oclusão de Ambiente:</strong> Desligue ou deixe no Normal.
            </p>
        </div>
      `
        },
        {
            title: "3. Grama e Pós-Processamento",
            content: `
        <p class="mb-4 text-gray-300">
            Se você sente que o jogo trava apenas quando você sai da cidade e vai para o interior (Blaine County), o culpado é a <strong>Qualidade da Grama</strong>. 
            <br/><br/>No GTA V, a grama no 'Ultra' é um dos efeitos mais pesados já criados. Mude para <strong>'Normal'</strong>. Você verá menos folhas no chão, mas seu FPS subirá de forma drástica em áreas rurais. Além disso, deixe o <strong>Pós-Processamento</strong> no 'Normal' para desativar efeitos de profundidade de campo que pesam na GPU.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/gta-v-err-gfx-d3d-init-crash",
            title: "Corrigir Crashes",
            description: "Resolva erros de DirectX no GTA V."
        },
        {
            href: "/guias/gta-v-fix-texturas-sumindo",
            title: "Mapa Sumindo",
            description: "Resolva problemas de carregamento de texturas."
        },
        {
            href: "/guias/reduzir-ping-jogos-online",
            title: "GTA Online Sem Lag",
            description: "Melhore a conexão no modo multiplayer."
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
