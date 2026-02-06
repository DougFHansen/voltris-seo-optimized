import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'fortnite-modo-performance-pc-fraco',
    title: "Fortnite 2026: O Guia do Modo Performance (Alpha) Definitivo",
    description: "Dobre seu FPS. Segredos das 'Malhas Altas' vs 'Malhas Baixas', edição do GameUserSettings.ini e como corrigir texturas borradas no Capítulo 7.",
    category: 'jogos',
    difficulty: 'Intermediário',
    time: '50 min'
};

const title = "Fortnite Performance Mode (2026): A Bíblia do FPS";
const description = "O Modo Performance do Fortnite mudou o meta. Aprenda a configurar as 'Meshes' para ver através das construções, editar o arquivo de config para 0 de input lag e remover a grama completamente.";

const keywords = [
    'fortnite modo performance malhas altas ou baixas',
    'gameusersettings.ini fortnite fps boost 2026',
    'como ver atraves da parede fortnite performance',
    'texturas nao carregam fortnite modo desempenho',
    'fortnite travando dx11 ou dx12 ou performance',
    'nvidia reflex fortnite on boost',
    'view distance fortnite pc fraco',
    'reduzir input lag fortnite creative',
    'resolucao esticada fortnite 2026',
    'voltris optimizer fortnite priority'
];

export const metadata: Metadata = createGuideMetadata('fortnite-modo-performance-pc-fraco', title, description, keywords);

export default function FortniteGuide() {
    const summaryTable = [
        { label: "Rendering", value: "Performance (Alpha)" },
        { label: "Meshes", value: "Low (FPS) / High (Visão)" },
        { label: "View Dist", value: "Medium" },
        { label: "Textures", value: "Low" },
        { label: "Reflex", value: "On + Boost" },
        { label: "Nvidia DLSS", value: "Desativado" },
        { label: "3D Res", value: "100% ou 85%" }
    ];

    const contentSections = [
        {
            title: "Introdução: O Modo Performance",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Esqueça DX11 ou DX12. Se você quer competir, o <strong>Performance Mode</strong> é obrigatório. Ele remove efeitos de iluminação pesados e grama, deixando o jogo com visual "Mobile", mas rodando a 240 FPS+ estáveis.
        </p>
         <div class="bg-[#0A0A0F] border border-blue-500/30 p-5 rounded-xl my-6">
            <h4 class="text-blue-400 font-bold mb-2">Malhas (Meshes): A Grande Decisão</h4>
            <p class="text-gray-300 text-sm">
                <strong>Low Meshes (Malhas Baixas):</strong> Construções parecem feitas de papelão ou "celular". FPS Máximo. Menor input lag.
                <br/><strong>High Meshes (Malhas Altas):</strong> Construções têm animação de quebra e você consegue <strong>VER ATRAVÉS</strong> da madeira recém-construída. Dá uma vantagem tática absurda (wallhack legalizado), mas consome um pouco mais de GPU.
                <br/><em>Recomendação:</em> Se seu PC aguenta, use <strong>High Meshes</strong>. Se for muito fraco, Low.
            </p>
        </div>
      `
        },
        {
            title: "Capítulo 1: Configuração In-Game",
            content: `
        <div class="space-y-4">
             <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Rendering Mode</h4>
                <p class="text-white font-mono text-sm mb-2">Seleção: <span class="text-emerald-400">Performance - Lower Graphical Fidelity</span></p>
                <p class="text-gray-400 text-xs">Reinicie o jogo após mudar. Isso desabilita a maioria das opções de sombras e efeitos.</p>
            </div>
             <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">View Distance</h4>
                <p class="text-white font-mono text-sm mb-2">Seleção: <span class="text-emerald-400">Medium ou Far</span></p>
                <p class="text-gray-400 text-xs">Near faz loot (armas no chão) aparecerem só quando você pisa nelas. Medium é o equilíbrio ideal para ver llamas e loot de longe.</p>
            </div>
             <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Textures</h4>
                <p class="text-white font-mono text-sm mb-2">Seleção: <span class="text-emerald-400">Low</span></p>
                <p class="text-gray-400 text-xs text-red-300">
                    Atenção: Às vezes colocar texturas no Medium/High ajuda a estabilizar o jogo e carregar as skins mais rápido (jogando carga na GPU em vez da CPU). Teste.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: GameUserSettings.ini (Segredos)",
            content: `
        <p class="mb-4 text-gray-300">
            Aperte <kbd class="bg-gray-700 px-1 rounded">Win+R</kbd>, digite <code>%localappdata%\\FortniteGame\\Saved\\Config\\WindowsClient</code>.
            <br/>Edite o <code>GameUserSettings.ini</code>. Procure e altere:
        </p>
        <div class="bg-black/50 p-4 rounded font-mono text-xs text-gray-300 overflow-x-auto">
            bShowGrass=False (Garante que a grama suma)<br/>
            DisplayGamma=2.200000 (Padrão e claro)<br/>
            bDisableMouseAcceleration=True (Obrigatório)<br/>
            sg.ShadingQuality=0<br/>
            sg.FoliageQuality=0<br/>
            sg.EffectsQuality=0
        </div>
        <p class="mt-2 text-xs text-gray-400">
            Salve e marque o arquivo como <strong>Somente Leitura</strong>.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 3: DirectX 12 Shaders (Fix de Stutter)",
            content: `
        <p class="mb-4 text-gray-300">
            Se você usa Modo Performance e o jogo trava muito na primeira partida:
            <br/>1. Mude para DX12 no menu.
            <br/>2. Jogue 2 partidas de Team Rumble (Tumulto).
            <br/>3. Isso força o jogo a compilar os shaders e salvar no cache.
            <br/>4. Volte para o Modo Performance.
            <br/>O cache do DX12 às vezes é compartilhado/usado como base, reduzindo os travamentos iniciais do modo performance.
        </p>
      `
        },
        {
            title: "Capítulo 4: Opções de Inicialização Epic Games",
            content: `
        <p class="mb-4 text-gray-300">
            No Launcher da Epic > Configurações > Fortnite > Argumentos adicionais:
        </p>
        <code class="block bg-black/50 p-3 rounded text-green-400 font-mono text-sm mb-3">
            -featureleveles31 -useallavailablecores
        </code>
        <ul class="list-disc list-inside text-gray-400 text-xs space-y-2">
            <li><strong>-featureleveles31:</strong> Força o uso de shaders mais simples (estilo mobile), ajudando o modo performance.</li>
            <li><strong>-NOTEXTURESTREAMING:</strong> Use APENAS se tiver muita VRAM (8GB+). Faz o jogo carregar todas as texturas de uma vez no loading (demora mais pra entrar, mas trava menos no jogo).</li>
        </ul>
      `
        },
        {
            title: "Capítulo 5: Nvidia Reflex & Latência",
            content: `
        <p class="mb-4 text-gray-300">
            No Fortnite, o Reflex é rei. Deixe em <strong>On + Boost</strong>.
            <br/>O jogo é totalmente CPU Bound em lutas de box (endgame). O Reflex impede que a GPU crie fila, garantindo que cada clique de edição (edit) seja registrado instantaneamente.
        </p>
      `
        },
        {
            title: "Capítulo 6: Resolução Esticada (Stretched)",
            content: `
        <p class="mb-4 text-gray-300">
            Mudar para 1750x1080 ou 1680x1050.
            <br/>Vantagem: Bonecos mais largos, menos pixels para renderizar (FPS boost).
            <br/>Desvantagem: Perda de FOV horizontal.
            <br/>No Fortnite Competitivo, a maioria dos pros voltou a usar <strong>1920x1080 (Native)</strong> pois a visão periférica é mais importante para ver terceiros (third-party) chegando. Use Stretched apenas se seu PC for muito fraco.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 7: Pre-Download de Assets",
            content: `
            <p class="mb-4 text-gray-300">
                No Launcher da Epic, clique nos "..." do Fortnite > Opções.
                <br/>Marque: <strong>"Texturas de Alta Resolução"</strong> (NÃO, desmarque isso para economizar 20GB).
                <br/>Marque: <strong>"Pré-Baixar Ativos de Streaming"</strong>. ISSO É CRUCIAL. Se você desmarcar, o jogo baixa skins de inimigos DURANTE a partida ao vivo, causando lag de internet e FPS. Baixe tudo antes.
            </p>
            `
        },
        {
            title: "Capítulo 8: Som Visual (Visual Audio)",
            content: `
            <p class="mb-4 text-gray-300">
                Ative <strong>"Visualizar Efeitos Sonoros"</strong> nas opções de Áudio.
                <br/>Isso mostra na tela onde estão passos, baús e tiros.
                <br/><em>Segredo:</em> O indicador visual aparece ANTES do som ser audível e mostra o dobro da distância. É um "hack" oficializado. Todo pro usa.
            </p>
            `
        },
        {
            title: "Capítulo 9: Replay Mode (Desativar)",
            content: `
            <p class="mb-4 text-gray-300">
                Vá na última aba de configurações (Engrenagem) e role até "Replays".
                <br/>Grave Replays: <strong>Desligado</strong>.
                <br/>Gravar replays consome CPU e disco constantemente. Em scrims e campeonatos, desligue para estabilidade máxima.
            </p>
            `
        },
        {
            title: "Capítulo 10: Voltris Optimizer no Fortnite",
            content: `
            <p class="mb-4 text-gray-300">
                O <strong>Voltris Optimizer</strong> limpa a memória standby automaticamente a cada 5 minutos (configurável), o que previne o famoso "Memory Leak" do Fortnite que faz o jogo começar a travar após 2 horas de jogatina.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Modo Performance deixa texturas borradas (Boneco de massinha)?",
            answer: "Isso acontece se o seu HD for lento ou se a VRAM estiver cheia. Tente travar as texturas em Medium. Se não resolver, mude para DX11, jogue uma partida, e volte para Performance."
        },
        {
            question: "FPS Cap: 240, 160, 60?",
            answer: "Sempre limite o FPS. Se deixar ilimitado, o uso de CPU vai a 100% e causa travadas quando você mexer o mouse rápido. Use um valor estável (ex: 160) mesmo se seu monitor for 144Hz."
        },
        {
            question: "Tela Cheia vs Janela em Tela Cheia?",
            answer: "Sempre <strong>Tela Cheia Exclusiva</strong>. Janela em tela cheia adiciona input lag do DWM do Windows. O Fortnite precisa de prioridade total."
        }
    ];

    const externalReferences = [
        { name: "Jerian (Fortnite Optimization)", url: "https://www.youtube.com/c/itsJerian" },
        { name: "Fortnite Status Twitter", url: "https://twitter.com/FortniteStatus" },
        { name: "Epic Games Server Status", url: "https://status.epicgames.com/" }
    ];

    const relatedGuides = [
        {
            href: "/guias/nvidia-painel-controle-melhores-configuracoes",
            title: "Nvidia",
            description: "Digital Vibrance para ver na tempestade."
        },
        {
            href: "/guias/mouse-dpi-polling-rate-ideal",
            title: "Mouse",
            description: "Edite construções mais rápido."
        },
        {
            href: "/guias/internet-lenta-jogos-lag",
            title: "Rede",
            description: "0 Ping no Creative."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="50 min"
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
