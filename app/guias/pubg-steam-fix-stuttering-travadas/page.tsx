import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "PUBG na Steam: Como resolver Travadas e Stuttering (2026)";
const description = "Seu PUBG trava na hora da troca de tiro? Aprenda as melhores configurações gráficas e de sistema para rodar PUBG liso na Steam em 2026.";
const keywords = [
    'pubg steam fix stuttering 2026 tutorial',
    'como aumentar fps pubg pc fraco 2026',
    'pubg travando na mira como resolver guia',
    'melhores configurações graficas pubg 2026 competetivo',
    'pubg dx11 vs dx11 enhanced vs dx12 qual melhor'
];

export const metadata: Metadata = createGuideMetadata('pubg-steam-fix-stuttering-travadas', title, description, keywords);

export default function PUBGStutterFixGuide() {
    const summaryTable = [
        { label: "Versão DirectX", value: "DirectX 11 Enhanced (Recomendado)" },
        { label: "Configuração Chave", value: "Render Scale (100% ou menos)" },
        { label: "Check de Hardware", value: "SSD é obrigatório para cidades" },
        { label: "Dificuldade", value: "Médio" }
    ];

    const contentSections = [
        {
            title: "O problema crônico do PUBG",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Mesmo em 2026, **PUBG: Battlegrounds** continua sendo um jogo extremamente pesado para o processador (CPU) devido ao seu mapa aberto e física complexa. O famoso "stuttering" (aquelas travadinhas de milissegundos) ocorre principalmente quando o jogo tenta carregar novas texturas de prédios ou quando muitos jogadores se encontram no mesmo local (Hot Drops). Otimizar o PUBG exige equilibrar a carga entre o processador e a placa de vídeo.
        </p>
      `
        },
        {
            title: "1. A Escolha do DirectX (O Segredo do FPS)",
            content: `
        <p class="mb-4 text-gray-300">Dentro das configurações gráficas do PUBG, você encontrará 3 opções:</p>
        <ul className="list-disc list-inside text-gray-300 space-y-3">
            <li><strong>DirectX 11:</strong> Estável, mas não usa todo o poder das placas modernas.</li>
            <li><strong>DirectX 11 Enhanced:</strong> A melhor escolha em 2026. Oferece o melhor equilíbrio de FPS e estabilidade de frametime.</li>
            <li><strong>DirectX 12:</strong> Promete mais frames, mas costuma causar 'stutter' (travadas) terríveis em muitas GPUs durante a compilação de shaders.</li>
        </ul >
      `
        },
        {
            title: "2. Configurações para Ganhar Vantagem",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Preset Competitivo 2026:</h4>
            <p class="text-sm text-gray-300">
                - <strong>Anti-Aliasing:</strong> Ultra (Ajuda a ver inimigos de longe sem serrilhado). <br/>
                - <strong>View Distance:</strong> Ultra (Essencial para renderizar carros e jogadores distantes). <br/>
                - <strong>Textures:</strong> Medium/High (Depende da sua VRAM). <br/>
                - <strong>Post-Processing/Shadows/Foliage:</strong> Very Low (Retira sombras inúteis e mato que esconde o inimigo). <br/>
                - <strong>V-Sync/Motion Blur:</strong> Sempre DESATIVADO para evitar input lag.
            </p>
        </div>
      `
        },
        {
            title: "3. Solução de Travadas via Windows",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>Desativando o Fullscreen Optimizations:</strong> 
            <br/><br/>Vá na pasta do jogo, clique com o botão direito no executável <code>TslGame.exe</code> > Propriedades > Compatibilidade. Marque a caixa <strong>'Desativar otimizações de tela inteira'</strong> e clique em 'Alterar configurações de DPI alto' e marque a última caixa. Isso força o Windows a dar prioridade total ao processo do PUBG, reduzindo drasticamente as travadas de mira.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/limitar-fps-rivatuner-nvidia",
            title: "Estabilizar Frametime",
            description: "Use o RivaTuner para uma gameplay fluida."
        },
        {
            href: "/guias/reduzir-ping-jogos-online",
            title: "Reduzir Ping",
            description: "Melhore a conexão nos servidores do PUBG."
        },
        {
            href: "/guias/como-usar-ddu-driver-uninstaller",
            title: "Limpeza de Drivers",
            description: "Se o FPS caiu após um update de driver."
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
