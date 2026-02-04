import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Project Zomboid: Como aumentar o FPS e alocar mais RAM (2026)";
const description = "Sofrendo com lag no Project Zomboid? Aprenda a alocar mais memória RAM e configurar os gráficos para rodar hordas gigantes sem travar em 2026.";
const keywords = [
    'project zomboid aumentar fps 2026 tutorial',
    'como alocar mais ram project zomboid guia 2026',
    'project zomboid lag fix hordas gigantes tutorial',
    'project zomboid melhores configurações graficas 2026',
    'project zomboid server lag fix tutorial guia'
];

export const metadata: Metadata = createGuideMetadata('project-zomboid-fps-boost', title, description, keywords);

export default function ProjectZomboidGuide() {
    const summaryTable = [
        { label: "Configuração Chave", value: "RAM Alocada (JSON Edit)" },
        { label: "Vilão do FPS", value: "Sangue no chão / Zoom Distante" },
        { label: "Duração do Guia", value: "15 min" },
        { label: "Dificuldade", value: "Médio" }
    ];

    const contentSections = [
        {
            title: "O desafio de sobreviver ao Lag",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Project Zomboid é um jogo incrível, mas a sua engine (baseada em Java) tem dificuldades extremas para gerenciar centenas de zumbis simultâneos no Windows 11 em 2026. Por padrão, o jogo vem configurado para usar pouca memória RAM, o que causa travadas (stuttering) constantes assim que você entra em cidades grandes como Louisville. Otimizar o jogo exige mexer "sob o capô" dos arquivos do sistema.
        </p>
      `
        },
        {
            title: "1. Alocando mais Memória RAM",
            content: `
        <p class="mb-4 text-gray-300">Este é o ajuste mais importante para evitar crashes:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Vá na pasta de instalação do jogo (Steam > Botão direito > Navegar pelos arquivos locais).</li>
            <li>Procure o arquivo <strong>ProjectZomboid64.json</strong>.</li>
            <li>Abra-o com o Bloco de Notas. Procure a linha que começa com <code>-Xmx</code>.</li>
            <li>Mude para <code>-Xmx8g</code> (se você tiver 16GB de RAM) ou <code>-Xmx4g</code> (se tiver 8GB).</li>
            <li>Salve o arquivo. Agora o jogo tem permissão para usar mais ram para carregar o mapa.</li>
        </ol>
      `
        },
        {
            title: "2. Gráficos: O Peso das Hordas",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Configurações Críticas em 2026:</h4>
            <p class="text-sm text-gray-300">
                - <strong>Blood Decals (Sangue):</strong> Coloque em 'None'. Cada mancha de sangue no chão é um objeto que o jogo precisa processar para sempre. Em hordas, isso mata o seu FPS. <br/>
                - <strong>Zoom Levels:</strong> Desative o zoom máximo. Quanto mais longe a câmera está, mais o jogo precisa renderizar, causando lag de processamento. <br/>
                - <strong>Lighting Quality:</strong> Mude para 'Low'. As sombras dinâmicas de árvores pesam muito no motor Java do Zomboid.
            </p>
        </div>
      `
        },
        {
            title: "3. Dica para Multiplayer (Servidores)",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>Desincronização:</strong> 
            <br/><br/>Se você vê zumbis "teleportando", o problema é o **Update Rate**. Nas configurações de rede do jogo, garanta que o 'Display FPS' esteja ativo. Se o seu FPS estiver alto mas os outros jogadores travam, tente desativar o 'Steam Overlay', que costuma ter conflito com a interface Java do Project Zomboid em 2026.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/limpar-memoria-ram-windows",
            title: "Limpar RAM",
            description: "Libere memória antes de abrir o Zomboid."
        },
        {
            href: "/guias/reduzir-ping-jogos-online",
            title: "Reduzir Ping",
            description: "Melhore sua conexão em servidores MP."
        },
        {
            href: "/guias/como-escolher-processador-2026",
            title: "Upgrade de CPU",
            description: "Por que o clock alto ajuda no Project Zomboid."
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
