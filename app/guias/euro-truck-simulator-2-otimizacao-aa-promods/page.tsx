import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'euro-truck-simulator-2-otimizacao-aa-promods',
    title: "Euro Truck Simulator 2 (2026): Otimização, Anti-Aliasing e ProMods",
    description: "ETS2 é leve, mas o serrilhado (aliasing) é horrível. Aprenda a usar o Snowymoon TAA ou NPI para imagem lisa e otimizar para ProMods e TruckersMP.",
    category: 'jogos',
    difficulty: 'Intermediário',
    time: '30 min'
};

const title = "ETS2 / ATS (2026): Gráficos Lisos e Comboios";
const description = "A engine prism3d é antiga. O Anti-Aliasing nativo (SMAA) não funciona bem e embaça. Vamos corrigir isso com injeção de TAA moderno.";

const keywords = [
    'ets2 snowy moon taa install tutorial',
    'truckersmp lag fix kirkenes',
    'promods ets2 performance optimization',
    'euro truck simulator 2 nvidia profile inspector aa',
    'melhores configurações graficas ets2 1.50',
    'mirror distance ets2 fps drop',
    'escala de renderizacao 400%',
    'voltris optimizer scs software',
    'ats american truck simulator fps'
];

export const metadata: Metadata = createGuideMetadata('euro-truck-simulator-2-otimizacao-aa-promods', title, description, keywords);

export default function ETS2Guide() {
    const summaryTable = [
        { label: "Anti-Aliasing", value: "Snowymoon TAA (Mod)" },
        { label: "Scaling", value: "100% (Com TAA)" },
        { label: "Scaling", value: "400% (Sem TAA)" },
        { label: "Mirrors", value: "Medium (Pesado)" },
        { label: "Vegetation", value: "High" },
        { label: "Traffic", value: "1.0 (Padrão)" },
        { label: "TruckersMP", value: "Disable Player Tags" }
    ];

    const contentSections = [
        {
            title: "Introdução: O Dilema da Escala",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Nativamente, para tirar o serrilhado dos cabos de energia, você precisa colocar a "Escala de Renderização" em 400%. Isso renderiza o jogo em 4K ou 8K internamente, matando o FPS.
        </p>
      `
        },
        {
            title: "Capítulo 1: Snowymoon TAA (A Solução)",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Modernizando a Engine</h4>
                <p class="text-gray-400 text-xs text-justify">
                    O modder Snowymoon criou um plugin que injeta TAA (Temporal Anti-Aliasing) real no jogo.
                    <br/>1. Baixe o <code>dxgi.dll</code> do Snowymoon.
                    <br/>2. Coloque na pasta <code>bin\\win_x64</code> do jogo.
                    <br/>3. No jogo, defina Escala 100% e Desative o SMAA nativo.
                    <br/>Resultado: Imagem perfeitamente lisa (sem serrilhados piscando) e performance dobrada comparada aos 400% de escala.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Retrovisores (Espelhos)",
            content: `
        <p class="mb-4 text-gray-300">
            Os espelhos renderizam o mundo de novo.
            <br/>- <strong>Mirror Quality:</strong> Medium. (High processa reflexos HD inúteis).
            <br/>- <strong>Mirror Resolution:</strong> Medium.
            <br/>- <strong>Mirror Distance:</strong> Medium. Ver carros a 1km atrás não é necessário e pesa muito.
        </p>
      `
        },
        {
            title: "Capítulo 3: Configurações de Luz e Sombra",
            content: `
        <p class="mb-4 text-gray-300">
            - <strong>Vegetation Detail:</strong> High. (É o que você mais vê na estrada).
            - <strong>Grass Density:</strong> Low/Medium. Grama alta no acostamento pesa.
            - <strong>Shadow Quality:</strong> Medium. Sombras suaves do TAA compensam a baixa resolução.
            - <strong>Light Visibility Ranges:</strong> Medium.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: TruckersMP (Multiplayer)",
            content: `
        <p class="mb-4 text-gray-300">
            Em áreas lotadas (Kirkenes, Calais-Duisburg):
            <br/>- Nas configurações do TruckersMP (Tab > Settings):
            <br/>- Desative <strong>"Load Cabin Accessories"</strong> de outros jogadores.
            <br/>- Desative <strong>"Player Tags"</strong> (Nomes flutuantes).
            <br/>- Reduza "Draw Distance" dos outros caminhões.
            <br/>Isso é a única forma de pegar mais de 20 FPS com 100 caminhões na tela.
        </p>
      `
        },
        {
            title: "Capítulo 5: ProMods (O Mapa Gigante)",
            content: `
        <p class="mb-4 text-gray-300">
            O ProMods adiciona detalhes extremos nas cidades.
            <br/>Se você tem "stutter" trocando de país:
            <br/>Use o parâmetro de inicialização <code>-mm_pool_size 4000</code> ou mais (metade da sua RAM). Isso aloca mais memória para o cache de mapa.
            <br/>Instale o ProMods "Def File" com a opção "Draw Distance" no padrão, não High, se tiver PC médio.
        </p>
      `
        },
        {
            title: "Capítulo 6: Console Developer",
            content: `
        <p class="mb-4 text-gray-300">
            Ative o console (edite <code>config.cfg</code>, mude <code>g_developer</code> e <code>g_console</code> para 1).
            <br/>Comandos úteis:
            <br/><code>warp 0.8</code> (Deixa o tempo do jogo mais lento, física mais realista).
            <br/><code>g_traffic 0</code> (Remove trânsito se estiver muito pesado).
        </p>
      `
        },
        {
            title: "Capítulo 7: FFB do Volante",
            content: `
        <p class="mb-4 text-gray-300">
            A física de FFB mudou na 1.42+.
            <br/>Mantenha "Força Centrada em Alta Velocidade" baixo.
            <br/>Aumente "Ressonância do Motor" para sentir a vibração do diesel no volante.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: Rádio e Música",
            content: `
            <p class="mb-4 text-gray-300">
                Ouvir rádio online in-game usa CPU para streaming.
                <br/>Se a CPU estiver no gargalo (100%), o áudio pica. Use Spotify externo ou MP3 local.
            </p>
            `
        },
        {
            title: "Capítulo 9: Modo Comboio (Oficial)",
            content: `
            <p class="mb-4 text-gray-300">
                É muito mais otimizado que o TruckersMP, mas limitado a 8-10 amigos.
                <br/>O tráfego AI é sincronizado. Se o host tiver PC fraco, o tráfego laga pra todo mundo. Deixe quem tem o melhor CPU ser o host.
            </p>
            `
        },
        {
            title: "Capítulo 10: Head Tracking",
            content: `
            <p class="mb-4 text-gray-300">
                Se não tem VR, use webcam + "OpenTrack" (Neuralnet tracker).
                <br/>Poder olhar para os espelhos virando a cabeça aumenta a imersão e evita acidentes. Custa 2-3% de CPU.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "TAA Mod dá ban no TruckersMP?",
            answer: "Não. É permitido e muito usado."
        },
        {
            question: "Jogo demora 10 minutos pra carregar.",
            answer: "Na primeira vez após atualizar drivers ou instalar mapas, o jogo recria o cache de navegação (Nav Cache). Tenha paciência. Nas próximas vezes será rápido (se estiver no SSD)."
        },
        {
            question: "Funciona em VR?",
            answer: "Sim, adicione `-openvr` nas opções de inicialização (requer beta branch 'oculus' na Steam). É mal otimizado, precisa de PC forte."
        }
    ];

    const externalReferences = [
        { name: "SnowyMoon TAA Download", url: "https://github.com/snowymoon/EuroTruckSimulator2-TAA" },
        { name: "ProMods", url: "https://promods.net/" }
    ];

    const relatedGuides = [
        {
            href: "/guias/monitor-ultrawide-jogos-competitivos",
            title: "Ultrawide",
            description: "Melhor setup para truck."
        },
        {
            href: "/guias/otimizacao-ssd-windows-11",
            title: "SSD",
            description: "Map loading."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="30 min"
            difficultyLevel="Intermediário"
            contentSections={contentSections}
            advancedContentSections={advancedContentSections}
            additionalContentSections={additionalContentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
            faqItems={faqItems}
            externalReferences={externalReferences}
        />
    );
}
