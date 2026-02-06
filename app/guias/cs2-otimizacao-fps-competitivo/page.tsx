import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'cs2-otimizacao-fps-competitivo',
    title: "Counter-Strike 2 (CS2) 2026: O Guia Definitivo de Otimização e FPS",
    description: "A bíblia da otimização para CS2. Comandos de console, autoexec, launch options que realmente funcionam, configuração de som para passos e Nvidia Reflex.",
    category: 'jogos',
    difficulty: 'Avançado',
    time: '60 min'
};

const title = "CS2 Optimization Bible (2026): FPS, Visibilidade e Latência";
const description = "O Source 2 mudou tudo. Launch options do CS:GO não funcionam mais. Aprenda a configurar o jogo do zero para ter vantagem competitiva real.";

const keywords = [
    'cs2 fps boost 2026 autoexec',
    'melhores launch options cs2 steam',
    'comando cl_interp cs2 rate',
    'nvidia reflex on ou boost cs2',
    'configurar som cs2 ouvir passos longe',
    'aumentar visibilidade cs2 contraste',
    'resolucao esticada 4:3 cs2 nvidia',
    'desativar otimizacao de tela inteira cs2',
    'bind jumpthrow cs2 manual',
    'como ver fps cs2 comando'
];

export const metadata: Metadata = createGuideMetadata('cs2-otimizacao-fps-competitivo', title, description, keywords);

export default function CS2Guide() {
    const summaryTable = [
        { label: "Launch Options", value: "-nojoy -softparticlesdefaultoff" },
        { label: "Reflex", value: "Enabled + Boost" },
        { label: "Sombras", value: "High (Visibilidade)" },
        { label: "Model/Texture", value: "Low (Performance)" },
        { label: "FSR", value: "Desativado (Blur)" },
        { label: "Áudio", value: "Loudness Eq. ON" },
        { label: "Resolução", value: "1280x960 (4:3)" }
    ];

    const contentSections = [
        {
            title: "Introdução: Source 2 vs Hardware",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O CS2 é muito mais pesado na GPU que o CS:GO. Launch options antigos como <code>-high</code>, <code>-threads</code> ou <code>-d3d9ex</code> <strong>NÃO FUNCIONAM</strong> ou causam instabilidade no Source 2. Pare de usar configs de 2018.
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed">
            Neste guia, vamos focar no que a Valve confirmou tecnicamente que afeta o subtick e a latência de renderização.
        </p>
      `
        },
        {
            title: "Capítulo 1: Opções de Inicialização (Limpeza)",
            content: `
        <div class="bg-[#0A0A0F] p-5 rounded-xl border border-white/5">
            <h4 class="text-[#31A8FF] font-bold mb-2">Comandos Recomendados (Safe)</h4>
            <code class="block bg-black/50 p-3 rounded text-green-400 font-mono text-sm mb-3">
                -nojoy -softparticlesdefaultoff -console
            </code>
            <ul class="list-disc list-inside text-gray-400 text-sm space-y-2">
                <li><strong>-nojoy:</strong> Desativa o suporte a Joystick, liberando uma pequena quantidade de RAM e ciclos de CPU.</li>
                <li><strong>-softparticlesdefaultoff:</strong> Desativa a renderização suave de partículas distantes (fumaça), ganhando FPS sem perda visual.</li>
                <li><strong>-console:</strong> Abre o console ao iniciar.</li>
            </ul>
            <div class="mt-4 bg-red-900/20 border-l-4 border-red-500 p-3">
                <p class="text-red-200 text-xs font-bold">NÃO USE:</p>
                <p class="text-gray-400 text-xs">-high (Causa instabilidade no Windows 11), -threads (O gerenciador do Source 2 é melhor que o manual), -freq (O jogo já pega o Hz do desktop).</p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Configurações de Vídeo (Competitivo)",
            content: `
        <p class="mb-4 text-gray-300">
            O segredo aqui não é colocar tudo no Low. Algumas opções precisam estar no High para você ver o inimigo.
        </p>
        <table class="w-full text-sm text-left text-gray-400 mb-6">
             <thead class="text-xs text-uppercase bg-gray-800 text-white">
                <tr><th class="px-4 py-2">Opção</th><th class="px-4 py-2">Valor Ideal</th><th class="px-4 py-2">Motivo</th></tr>
            </thead>
            <tbody>
                <tr class="border-b border-gray-700">
                    <td class="px-4 py-2 font-bold">Boost Player Contrast</td>
                    <td class="px-4 py-2 text-emerald-400">Enabled</td>
                    <td class="px-4 py-2">Essencial para ver inimigos em cantos escuros.</td>
                </tr>
                <tr class="border-b border-gray-700">
                    <td class="px-4 py-2 font-bold">Model/Texture/Shader</td>
                    <td class="px-4 py-2 text-yellow-400">Low</td>
                    <td class="px-4 py-2">Menos poluição visual, mais FPS.</td>
                </tr>
                <tr class="border-b border-gray-700">
                    <td class="px-4 py-2 font-bold">Global Shadow Quality</td>
                    <td class="px-4 py-2 text-emerald-400">High</td>
                    <td class="px-4 py-2"><strong>CRÍTICO.</strong> No Low, você não vê a sombra do inimigo antes dele aparecer na esquina.</td>
                </tr>
                <tr class="border-b border-gray-700">
                    <td class="px-4 py-2 font-bold">Multisampling (MSAA)</td>
                    <td class="px-4 py-2">CMAA2 ou 4x</td>
                    <td class="px-4 py-2">Sem AA, as linhas tremem e atrapalham a visão de longe.</td>
                </tr>
                <tr class="border-b border-gray-700">
                    <td class="px-4 py-2 font-bold">Ambient Occlusion</td>
                    <td class="px-4 py-2 text-red-400">Disabled</td>
                    <td class="px-4 py-2">Come 15% do FPS para criar sombras bonitas. Inútil no competitivo.</td>
                </tr>
                <tr class="border-b border-gray-700">
                    <td class="px-4 py-2 font-bold">Nvidia Reflex</td>
                    <td class="px-4 py-2 text-emerald-400">Enabled + Boost</td>
                    <td class="px-4 py-2">Reduz latência mantendo GPU clock alto.</td>
                </tr>
            </tbody>
        </table>
      `
        },
        {
            title: "Capítulo 3: Autoexec.cfg (Otimização de Rede)",
            content: `
        <p class="mb-4 text-gray-300">
            Crie um arquivo <code>autoexec.cfg</code> na pasta <code>game\\csgo\\cfg</code>.
        </p>
        <div class="bg-black/50 p-4 rounded-xl border border-gray-700 font-mono text-xs text-gray-300 overflow-x-auto">
            // Rede (Maximizada para 2026)<br/>
            rate "786432" // (Máximo permitido, essencial para 128tick/subtick)<br/>
            cl_updaterate "128"<br/>
            cl_interp_ratio "1"<br/>
            cl_interp "0.015625"<br/><br/>
            
            // FPS e HUD<br/>
            fps_max "400" // (Ou 0 para ilimitado, mas 400 é estável)<br/>
            cl_showfps "0"<br/>
            cq_netgraph "1" // (Novo netgraph do CS2, mostra perdas de pacote)<br/><br/>
            
            // Radar (Para ver o mapa todo)<br/>
            cl_radar_scale "0.3"<br/>
            cl_radar_always_centered "0"<br/><br/>
            
            // Jumpthrow (Agora nativo, mas bom garantir)<br/>
            alias "+jumpaction" "+jump;"<br/>
            alias "+throwaction" "-attack; -attack2"<br/>
            alias "-jumpaction" "-jump"<br/>
            bind "c" "+jumpaction;+throwaction;"
        </div>
        <p class="mt-4 text-gray-400 text-sm">
            Adicione <code>+exec autoexec.cfg</code> nas opções de inicialização para garantir que carregue.
        </p>
      `
        },
        {
            title: "Capítulo 4: Áudio (Ouvir Passos Longe)",
            content: `
        <p class="mb-4 text-gray-300">
            O som do CS2 é diferente. Para ouvir passos distantes (Low Frequencies) e reduzir o barulho da AK-47 (High Frequencies):
        </p>
        <ol class="list-decimal list-inside text-gray-300 text-sm space-y-2">
            <li>No Windows: Painel de Controle de Som > Dispositivo > Propriedades > Aperfeiçoamentos.</li>
            <li>Ative <strong>"Loudness Equalization" (Equalização de volume)</strong>.</li>
            <li>No Jogo: Perfil de Áudio > <strong>"Crisp" (Nítido)</strong>.</li>
            <li>Isolamento L/R: <strong>50-70%</strong> (100% separa demais e confunde o centro).</li>
        </ol>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 5: Resolução 4:3 Esticada (Stretched)",
            content: `
        <p class="mb-4 text-gray-300">
            A escolha dos pros.
            <br/><strong>Vantagem:</strong> Modelos dos inimigos ficam mais "gordos", mais fáceis de acertar. Menos pixels para renderizar = Mais FPS.
            <br/><strong>Desvantagem:</strong> Campo de visão (FOV) menor, inimigos se movem mais rápido na tela.
        </p>
        <div class="bg-gray-800 p-4 rounded text-sm text-gray-300">
            <strong>Como Configurar:</strong>
            <br/>1. Painel Nvidia > Ajustar tamanho da área de trabalho.
            <br/>2. Escala: <strong>Tela Inteira</strong>.
            <br/>3. Jogo: Vídeo > Resolução > <strong>1280x960</strong> (A melhor qualidade/performance) ou 1024x768 (PC Batata).
        </div>
      `
        },
        {
            title: "Capítulo 6: Otimização de Tela Inteira (Bug do Windows)",
            content: `
        <p class="mb-4 text-gray-300">
            O Windows tenta otimizar jogos aplicando um overlay híbrido. No CS2, isso pode causar input lag.
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
            <li>Vá em <code>steamapps\\common\\Counter-Strike Global Offensive\\game\\bin\\win64\\cs2.exe</code></li>
            <li>Clique direito > Propriedades > Compatibilidade.</li>
            <li>Marque <strong>"Desabilitar otimizações de tela inteira"</strong>.</li>
            <li>Se tiver problemas de Alt+Tab lento, desmarque. Mas para FPS puro, marque.</li>
        </ul>
      `
        },
        {
            title: "Capítulo 7: Limpeza de Cache (DirectX)",
            content: `
        <p class="mb-4 text-gray-300">
            Se seu CS2 está com micro-travadas (stutter) toda vez que vê um inimigo:
            <br/>O cache de shaders do DirectX pode estar corrompido.
            <br/>1. Use a Limpeza de Disco do Windows.
            <br/>2. Marque "Cache de sombreador DirectX".
            <br/>3. Execute.
            <br/>Na próxima vez que abrir o jogo, ele vai demorar um pouco mais para carregar o mapa, recriando o cache limpo.
        </p>
      `
        },
        {
            title: "Capítulo 8: Telemetria e Packet Loss",
            content: `
        <p class="mb-4 text-gray-300">
            Nas configurações do jogo > Jogo > Telemetria.
            <br/>Defina "Mostrar em caso de condições ruins" para <strong>Sempre</strong> ou configure para mostrar FPS e Ping.
            <br/>Isso substitui o antigo <code>net_graph 1</code>. Fique de olho no canto superior direito. Se aparecerem quadrados vermelhos, é perda de pacote da sua internet, não culpa do PC.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 9: Workshop Maps Essenciais",
            content: `
            <p class="mb-4 text-gray-300">
                Otimize seu treino. Inscreva-se na oficina Steam:
                <br/>- <strong>CS2_AIM</strong>: Para aquecer a mira.
                <br/>- <strong>Recoil Master</strong>: Para decorar o spray da AK/M4.
                <br/>- <strong>Benchmark Map</strong>: Para testar se suas configurações realmente aumentaram o FPS médio.
            </p>
            `
        },
        {
            title: "Capítulo 10: Voltris Optimizer no CS2",
            content: `
            <p class="mb-4 text-gray-300">
                O <strong>Voltris Optimizer</strong> detecta o CS2 e aplica automaticamente:
                <br/>- Prioridade de CPU "High" (com segurança).
                <br/>- Desativação de Core Parking (para usar todos os núcleos).
                <br/>- Plano de Energia "Bitsum Highest Performance" durante a execução do jogo.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Clear Decals (Limpar sangue) ainda funciona?",
            answer: "Não. O comando `r_cleardecals` foi removido no CS2. O sangue agora desaparece com o tempo ou é lavável pela água. Não existe mais bind para limpar sangue instantaneamente."
        },
        {
            question: "60Hz vs 144Hz vs 240Hz no CS2?",
            answer: "No CS2, a fluidez é ainda mais perceptível. 60Hz é injogável competitivamente. 144Hz é o mínimo obrigatório. 240Hz+ dá vantagem no 'Subtick', pois o servidor registra seu tiro com mais precisão temporal."
        },
        {
            question: "V-Sync no CS2?",
            answer: "NUNCA. JAMAIS. O V-Sync adiciona cerca de 15ms a 30ms de input lag. No CS, 1ms define a vida ou a morte. Sempre deixe V-Sync OFF."
        }
    ];

    const externalReferences = [
        { name: "ProSettings.net (Configs dos Pro Players)", url: "https://prosettings.net/lists/cs2/" },
        { name: "Valve Developer Community (Comandos Console)", url: "https://developer.valvesoftware.com/wiki/Counter-Strike_2" },
        { name: "Steam Workshop CS2", url: "https://steamcommunity.com/app/730/workshop/" }
    ];

    const relatedGuides = [
        {
            href: "/guias/nvidia-painel-controle-melhores-configuracoes",
            title: "Painel Nvidia",
            description: "Configure o 4:3 Stretched aqui."
        },
        {
            href: "/guias/mouse-dpi-polling-rate-ideal",
            title: "Guia Mouse",
            description: "DPI ideal (400 vs 800) para CS2."
        },
        {
            href: "/guias/reduzir-ping-regedit-cmd-jogos",
            title: "Reduzir Ping",
            description: "Otimização de rotas e rede."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="60 min"
            difficultyLevel="Avançado"
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
