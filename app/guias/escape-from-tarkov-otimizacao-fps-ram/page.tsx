import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'escape-from-tarkov-otimizacao-fps-ram',
    title: "Escape from Tarkov (2026): Otimização, RAM Cleaner e PostFX",
    description: "Tarkov é injogável com 16GB de RAM sem ajustes. Guia completo de Auto RAM Cleaner, PostFX para visibilidade em locais escuros e Nvidia Reflex.",
    category: 'jogos',
    difficulty: 'Muito Avançado',
    time: '40 min'
};

const title = "Escape from Tarkov: FPS Guide (2026) - Streets of Tarkov";
const description = "O mapa Streets of Tarkov exige 32GB de RAM para rodar liso. Se você tem 16GB, precisa deste guia. Aprenda também a ver inimigos no escuro com PostFX.";

const keywords = [
    'escape from tarkov fps boost streets of tarkov 2026',
    'auto ram cleaner tarkov funciona',
    'tarkov postfx settings visibility night',
    'nvidia reflex on or boost tarkov',
    'process lasso tarkov physical cores',
    'mip streaming tarkov settings',
    'binaural audio fps drop fix',
    'tarkov memory leak fix 16gb ram',
    'best fov tarkov pvp',
    'voltris optimizer unity engine'
];

export const metadata: Metadata = createGuideMetadata('escape-from-tarkov-otimizacao-fps-ram', title, description, keywords);

export default function TarkovGuide() {
    const summaryTable = [
        { label: "RAM Cleaner", value: "ON (Menu)" },
        { label: "Textures", value: "Medium (16GB RAM)" },
        { label: "Shadows", value: "Low" },
        { label: "LOD Quality", value: "2.5 (Padrão)" },
        { label: "Visibility", value: "1000 or 1500" },
        { label: "HBAO/SSR", value: "Off (Sempre)" },
        { label: "Nvidia Reflex", value: "On + Boost" }
    ];

    const contentSections = [
        {
            title: "Introdução: Unity e Otimização Ruim",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Tarkov não usa muito sua GPU. Ele esmaga sua CPU e RAM. Em mapas como Lighthouse e Streets, vazamentos de memória são comuns, fazendo o jogo travar após 2 raids.
        </p>
      `
        },
        {
            title: "Capítulo 1: Configurações Gráficas (FPS)",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Texture Quality</h4>
                <p class="text-gray-400 text-xs text-justify">
                    - <strong>High:</strong> Apenas se tiver 32GB de RAM e 10GB+ VRAM.
                    <br/>- <strong>Medium:</strong> Recomendado para 16GB RAM.
                    <br/>- <strong>Low:</strong> Texturas feias, mas ajuda se a VRAM for 4GB.
                </p>
            </div>
             <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Object LOD Quality</h4>
                <p class="text-gray-400 text-xs">
                    Mantenha em 2.5.
                    <br/>Baixar para 2.0 faz objetos aparecerem e sumirem (pop-in), distraindo a visão. Subir para 4.0 mata o FPS.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Auto RAM Cleaner & Physical Cores",
            content: `
        <p class="mb-4 text-gray-300">
            Dentro das configurações do jogo "Game":
            <br/>- <strong>Auto RAM Cleaner:</strong> LIGUE. O jogo força o Garbage Collector do Unity a rodar mais vezes, liberando RAM presa. Essencial para raids longas.
            <br/>- <strong>Use only physical cores:</strong>
            <br/>Se usa Intel: <span class="text-emerald-400">LIGUE</span> (Desativa Hyper-Threading pro jogo, que o Unity odeia).
            <br/>Se usa Ryzen: <span class="text-red-400">DESLIGUE</span> (O SMT do Ryzen funciona bem com Tarkov).
        </p>
      `
        },
        {
            title: "Capítulo 3: PostFX (Visão Competitiva)",
            content: `
        <p class="mb-4 text-gray-300">
            Ative o PostFX para clarear sombras.
            <br/>- <strong>Brightness:</strong> 20-30.
            <br/>- <strong>Saturation:</strong> 30-50 (Cores vivas ajudam a distinguir PMC do mato).
            <br/>- <strong>Clarity:</strong> 60-80 (Destaque bordas).
            <br/>- <strong>Luma Sharpen:</strong> 50.
            <br/>- <strong>Color Grading:</strong> "Montreal" ou "Cognac" (suaves) ou Nenhum.
            <br/><em>Custo:</em> Perde cerca de 5 FPS, mas você vê inimigos que estariam invisíveis na sombra.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: Binaural Audio (Steam Audio)",
            content: `
        <p class="mb-4 text-gray-300">
            A opção "Binaural Audio" melhora a direção do som (saber se o passo é em cima ou embaixo).
            <br/>Mas... historicamente causa queda de FPS e consumo de CPU.
            <br/><strong>Em 2026:</strong> A BSG otimizou o Oculus Audio. Vale a pena LIGAR pela vantagem tática, a menos que sua CPU seja muito antiga (i5 7ª gen).
        </p>
      `
        },
        {
            title: "Capítulo 5: Nvidia Reflex + Boost",
            content: `
        <p class="mb-4 text-gray-300">
            Ative <strong>On + Boost</strong>.
            <br/>Tarkov é CPU Bound. O modo Boost mantém o clock da GPU no máximo mesmo quando ela está esperando a CPU, prevenindo frametimes erráticos.
        </p>
      `
        },
        {
            title: "Capítulo 6: MIP Streaming",
            content: `
        <p class="mb-4 text-gray-300">
            Settings > Graphics > MIP Streaming.
            <br/>Isso baixa texturas dinamicamente durante a raid.
            <br/>USE APENAS SE: Tiver HD/SSD Lento e pouca VRAM.
            <br/>SSe tiver SSD NVMe e VRAM sobrando, desligue, pois causa stuttering de rede.
        </p>
      `
        },
        {
            title: "Capítulo 7: Page File (Arquivo de Paginação)",
            content: `
        <p class="mb-4 text-gray-300">
            Tarkov crasaha se faltar memória virtual.
            <br/>No Windows, defina manualmente o arquivo de paginação para <strong>30GB</strong> (Inicial e Máximo) no SSD.
            <br/>Não deixe "Gerenciado pelo Sistema", o Windows é lento para expandir durante a raid.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: Process Lasso (Avançado)",
            content: `
            <p class="mb-4 text-gray-300">
                Para quem leva a sério.
                <br/>Use o Process Lasso para desativar o SMT/HyperThreadingapenas para o <code>EscapeFromTarkov.exe</code> e definir "I/O Priority" como High.
                <br/>Garante 5-10 FPS a mais no mapa Streets.
            </p>
            `
        },
        {
            title: "Capítulo 9: FOV (Campo de Visão)",
            content: `
            <p class="mb-4 text-gray-300">
                FOV alto (75) mostra mais os lados, mas faz alvos distantes ficarem minúsculos.
                <br/>FOV baixo (59-63) deixa alvos maiores ("Zoom" natural), mas perde visão periférica.
                <br/>Além disso, FOV alto renderiza mais objetos, baixando FPS. Use 63-65 se tiver PC fraco.
            </p>
            `
        },
        {
            title: "Capítulo 10: Server Selection",
            content: `
            <p class="mb-4 text-gray-300">
                No Launcher, selecione manualmente os servidores com ping < 80.
                <br/>Não use "Auto". O Auto pode te jogar num servidor com packet loss só porque estava vazio.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Streets of Tarkov injogável?",
            answer: "Ative o modo 'Low Texture Resolution for Streets' nas configurações gráficas. Esse mapa é mal otimizado por natureza."
        },
        {
            question: "DLSS em Tarkov?",
            answer: "Existe, mas em 1080p deixa miras holográficas borradas e com rastro (ghosting). Só vale a pena em 1440p+. Em 1080p, prefira FSR 2.2 Quality ou Nada."
        },
        {
            question: "Scav corre mais liso que PMC?",
            answer: "Sim, porque como Scav a raid já começou e o jogo já carregou a maioria dos assets, além de haver menos IA viva no mapa."
        }
    ];

    const externalReferences = [
        { name: "Tarkov Wiki (Ballistics)", url: "https://escapefromtarkov.fandom.com/wiki/Ballistics" },
        { name: "MapGenie (Mapas)", url: "https://mapgenie.io/tarkov" }
    ];

    const relatedGuides = [
        {
            href: "/guias/otimizacao-ssd-windows-11",
            title: "SSD",
            description: "Load pra raid rapidinho."
        },
        {
            href: "/guias/reduzir-ping-exitlag-noping-dns",
            title: "Ping",
            description: "Peeker's Advantage."
        },
        {
            href: "/guias/monitor-hz-configuracao-correta",
            title: "Monitor",
            description: "144Hz ajuda no spray."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="40 min"
            difficultyLevel="Muito Avançado"
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
