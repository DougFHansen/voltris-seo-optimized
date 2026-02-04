import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "CS2: Melhores Comandos de Console para FPS (Guia 2026)";
const description = "Quer rodar Counter-Strike 2 mais liso? Aprenda os comandos de console e de inicialização para ganhar FPS e reduzir o lag no CS2 em 2026.";
const keywords = [
    'melhores comandos console cs2 2026 fps boost',
    'como aumentar fps cs2 pc fraco tutorial 2026',
    'comandos de inicialização cs2 steam guia completo',
    'cs2 settings for low input lag tutorial 2026',
    'comando para ver fps no cs2 console guia'
];

export const metadata: Metadata = createGuideMetadata('cs2-melhores-comandos-console-fps', title, description, keywords);

export default function CS2OptimizationGuide() {
    const summaryTable = [
        { label: "Comando FPS", value: "cl_showfps 1 / cq_netgraph 1" },
        { label: "Prioridade", value: "-high (Opções de Inicialização)" },
        { label: "Latência", value: "NVIDIA Reflex (Ativado + Boost)" },
        { label: "Dificuldade", value: "Fácil" }
    ];

    const contentSections = [
        {
            title: "Otimizando a Source 2 em 2026",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O **Counter-Strike 2 (CS2)** é significativamente mais pesado que o antigo CS:GO. Com o novo sistema de fumaça volumétrica e iluminação realista, cada comando de console que economiza recursos do hardware vale ouro em 2026. Se você joga seriamente ou apenas quer parar de ter quedas de frames no meio do <i>tiroteio</i>, este guia contém os ajustes essenciais.
        </p>
      `
        },
        {
            title: "1. Opções de Inicialização (Steam)",
            content: `
        <p class="mb-4 text-gray-300">Acesse as propriedades do jogo na Steam e coloque estes comandos:</p>
        <div class="bg-gray-800 p-4 rounded-lg font-mono text-sm text-blue-400">
            -high -threads X -nojoy +cl_updaterate 128
        </div>
        <ul class="list-disc list-inside text-gray-300 mt-4 space-y-2">
            <li><strong>-high:</strong> Dá prioridade alta de processamento ao jogo.</li>
            <li><strong>-threads:</strong> Substitua o 'X' pelo número de núcleos do seu processador.</li>
            <li><strong>-nojoy:</strong> Desativa suporte a joystick, economizando um pouco de memória RAM.</li>
        </ul>
      `
        },
        {
            title: "2. Comandos de Console Indispensáveis",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Dentro do Jogo (Aperte '):</h4>
            <p class="text-sm text-gray-300">
                - <code>fps_max 0</code>: Libera o limite de quadros. <br/>
                - <code>engine_low_latency_sleep_after_client_tick true</code>: Ajuda a reduzir o input lag em setups modernos. <br/>
                - <code>vprof_off</code>: Desliga o sistema de estatísticas de performance que roda em background. <br/>
                - <code>cl_autohelp 0</code>: Remove dicas textuais que aparecem na tela durante a partida.
            </p>
        </div>
      `
        },
        {
            title: "3. Ajustes de Vídeo Críticos 2026",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>FidelityFX Super Resolution (FSR):</strong> 
            <br/><br/>Se você tem um PC médio ou fraco em 2026, use o FSR no modo **'Ultra Quality'**. Ele entrega uma imagem muito próxima da nativa, mas com um ganho de 10% a 15% de FPS. Se você joga com resolução esticada (4:3), o FSR ajudará a manter as bordas dos inimigos menos borradas. <br/><br/>
            <strong>Dica de Latência:</strong> Desative o V-Sync e o Buffering Triplo para garantir que o seu movimento de mouse seja o mais instantâneo possível.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/reduzir-ping-jogos-online",
            title: "Reduzir Ping",
            description: "Melhore sua conexão nos servidores da Valve."
        },
        {
            href: "/guias/nvidia-refelx-on-vs-boost-diferenca",
            title: "NVIDIA Reflex",
            description: "Vital para o sub-tick do CS2."
        },
        {
            href: "/guias/limpar-memoria-ram-windows",
            title: "Limpar RAM",
            description: "Garanta que nenhum app atrapalhe sua partida."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="10 min"
            difficultyLevel="Fácil"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
