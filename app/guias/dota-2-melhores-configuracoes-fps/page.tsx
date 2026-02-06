import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'dota-2-melhores-configuracoes-fps',
    title: "Dota 2 (2026): Guia de FPS, Vulkan vs DX11 e Console",
    description: "Otimize o Dota 2 para Teamfights pesadas. Comandos de console para rede, escolha da API gráfica correta, FidelityFX Super Resolution e muito mais.",
    category: 'jogos',
    difficulty: 'Avançado',
    time: '45 min'
};

const title = "Dota 2 Optimization (2026): Vulkan, Rede e Estabilidade";
const description = "Dota 2 é complexo. Ilusões, partículas e ulti do Enigma podem derrubar seu FPS. Aprenda a configurar o jogo para priorizar clareza visual e resposta rápida.";

const keywords = [
    'dota 2 fps boost 2026 console commands',
    'dota 2 vulkan vs dx11 performance',
    'compute shaders dota 2 on or off',
    'fidelityfx super resolution dota 2 vale a pena',
    'como aumentar fps dota 2 pc fraco',
    'rate 200000 console dota 2',
    'desativar background menu dota 2 novid',
    'dota 2 travando teamfight',
    'voltris optimizer dota 2 high priority'
];

export const metadata: Metadata = createGuideMetadata('dota-2-melhores-configuracoes-fps', title, description, keywords);

export default function DotaGuide() {
    const summaryTable = [
        { label: "API", value: "DX11 (Nvidia) / Vulkan (AMD)" },
        { label: "Game Screen", value: "100% (No Upscale)" },
        { label: "Shadows", value: "Medium" },
        { label: "Effects", value: "Low" },
        { label: "Compute Shaders", value: "On (Se tiver GPU boa)" },
        { label: "V-Sync", value: "Off" },
        { label: "Network", value: "High-End Network" }
    ];

    const contentSections = [
        {
            title: "Introdução: Source 2 e APIs",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O Dota 2 foi o primeiro jogo a usar a engine Source 2. Ela é moderna e suporta várias APIs (DX11, Vulkan, OpenGL). A escolha correta da API pode dobrar seu FPS dependendo do seu hardware.
        </p>
      `
        },
        {
            title: "Capítulo 1: Escolhendo a API Gráfica (DLC)",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Como Instalar APIs</h4>
                <p class="text-white font-mono text-sm mb-2">Steam > Dota 2 > Propriedades > DLC</p>
                <p class="text-gray-400 text-xs">Marque "Vulkan Support". Desmarque OpenGL (Obsoleto).</p>
            </div>
             <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Launch Options (-vulkan vs -dx11)</h4>
                <ul class="list-disc list-inside text-gray-300 text-xs mt-2">
                    <li><strong>-dx11:</strong> O padrão e mais estável para GPUs Nvidia (GTX/RTX).</li>
                    <li><strong>-vulkan:</strong> Recomendado para GPUs AMD (RX Series) ou Linux. Às vezes ajuda em CPUs fracas (reduz overhead). Teste!</li>
                </ul>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Configurações de Vídeo (General)",
            content: `
        <p class="mb-4 text-gray-300">
            Use "Use Advanced Settings". Não use o slider básico.
        </p>
        <table class="w-full text-sm text-left text-gray-400">
            <tbody>
                <tr class="border-b border-gray-700">
                    <td class="py-2 font-bold">Game Screen Render Quality</td>
                    <td class="py-2 text-emerald-400">100%</td>
                    <td class="py-2">Abaixo de 100% o jogo fica borrado. Mantenha 100% e baixe o resto.</td>
                </tr>
                <tr class="border-b border-gray-700">
                    <td class="py-2 font-bold">Shadow Quality</td>
                    <td class="py-2 text-yellow-400">Medium/High</td>
                    <td class="py-2">Sombras ajudam a ver unidades voadoras. Não desligue totalmente.</td>
                </tr>
                 <tr class="border-b border-gray-700">
                    <td class="py-2 font-bold">Effect Quality</td>
                    <td class="py-2 text-yellow-400">Low</td>
                    <td class="py-2">Reduz o caos visual em teamfights. Essencial.</td>
                </tr>
            </tbody>
        </table>
      `
        },
        {
            title: "Capítulo 3: Checkboxes (Liga/Desliga)",
            content: `
        <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
            <li><strong>Additive Light Pass:</strong> On (Essencial para iluminar o mapa).</li>
            <li><strong>World Lighting:</strong> On.</li>
            <li><strong>Ambient Occlusion:</strong> <span class="text-red-400">Off</span> (Pesado e desnecessário).</li>
            <li><strong>Normal Maps:</strong> On (Relevo nas texturas).</li>
            <li><strong>Ground Parallax:</strong> Off (Efeito 3D no chão, inútil).</li>
            <li><strong>Anti-Aliasing:</strong> On (Dota 2 sem AA é muito serrilhado).</li>
            <li><strong>Compute Shaders:</strong> <span class="text-emerald-400">On</span> (Se tiver GPU moderna, isso melhora a performance de partículas usando a GPU em vez da CPU).</li>
        </ul>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: FidelityFX Super Resolution (FSR)",
            content: `
        <p class="mb-4 text-gray-300">
            Se seu PC for uma batata real.
            <br/>Ative o FSR no menu e reduza o "Game Screen Render Quality" para 99% ou menos.
            <br/>O FSR vai entrar em ação e fazer o upscaling. A imagem fica nítida (com um leve efeito de sharpening excessivo), mas o ganho de FPS é brutal em GPUs integradas.
        </p>
      `
        },
        {
            title: "Capítulo 5: Console e Launch Options",
            content: `
        <p class="mb-4 text-gray-300">
            Adicione nas opções de inicialização:
            <br/><code>-novid -high -map dota -console</code>
            <br/>-novid: Remove intro do careca da Valve.
            <br/>-map dota: Carrega o mapa enquanto abre o jogo (loading inicial maior, loading de partida menor).
            <br/>No Console (dentro do jogo):
            <br/><code>fps_max 0</code> (ou seu Hz).
            <br/><code>engine_no_focus_sleep 0</code> (Mantém FPS alto mesmo com Alt+Tab, bom para dois monitores).
        </p>
      `
        },
        {
            title: "Capítulo 6: Rede (Network Quality)",
            content: `
        <p class="mb-4 text-gray-300">
            Em Opções > Avançado > Rede.
            <br/>Defina "Network Quality" como <strong>High-End Network</strong>.
            <br/>Isso aumenta a taxa de pacotes, reduzindo o input lag dos seus cliques.
            <br/>Se tiver internet ruim (móvel), use Low-End para evitar perda de pacote.
            <br/>Comando Console: <code>cl_interp_ratio 1</code> (Tenta forçar interpolação mínima).
        </p>
      `
        },
        {
            title: "Capítulo 7: Desativar Fundo do Menu",
            content: `
        <p class="mb-4 text-gray-300">
            O menu principal tem animações pesadas (Herói novo, Arcana).
            <br/>Use o comando (Launch Option): <code>+map_enable_background_maps 0</code>.
            <br/>Isso deixa o fundo preto/estático. O FPS no menu dispara e a GPU esfria.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: Otimização de Som",
            content: `
            <p class="mb-4 text-gray-300">
                Ative <strong>"Streamlined Push To Talk"</strong>.
                <br/>Isso evita que o jogo congele por meio segundo toda vez que você aperta o botão de falar (problema antigo da engine).
            </p>
            `
        },
        {
            title: "Capítulo 9: Minimapa e Visibilidade",
            content: `
            <p class="mb-4 text-gray-300">
                Use ícones simples no minimapa (Setas/X) em vez de Ícones de Heróis se quiser leitura rápida.
                <br/>Aumente o tamanho do minimapa para "Extra Large" nas opções de interface. Informação é poder.
            </p>
            `
        },
        {
            title: "Capítulo 10: Prewarm (Pré-carregamento)",
            content: `
            <p class="mb-4 text-gray-300">
                O Dota 2 tem uma opção (Launch option <code>-prewarm</code>) que já vem ativada por padrão hoje em dia.
                <br/>Ela carrega assets essenciais antes do menu aparecer. Não desative isso. Se seu jogo demora pra abrir, é o prewarm trabalhando para você não travar na partida.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Micro-travadas quando compro itens?",
            answer: "Isso é problema de I/O do disco. Instale o Dota 2 no SSD. Em HDs antigos, o som de 'moedas' ao comprar pode travar o jogo."
        },
        {
            question: "Dashboard (Menu) muito lento?",
            answer: "Desative as animações do menu (Capítulo 7) ou delete os vídeos de intro da pasta do jogo (videos/panorama)."
        },
        {
            question: "Packet Loss alto?",
            answer: "Mude a região do servidor (SDR). Use o comando `sdr SDRClient_ForceRelayCluster gru` para forçar a rota de São Paulo (GRU)."
        }
    ];

    const externalReferences = [
        { name: "Dota 2 Dev Forums (Performance)", url: "https://dev.dota2.com/" },
        { name: "Liquipedia Dota 2 Settings", url: "https://liquipedia.net/dota2/Game_Settings" }
    ];

    const relatedGuides = [
        {
            href: "/guias/nvidia-painel-controle-melhores-configuracoes",
            title: "Nvidia",
            description: "Modo de energia para Dota."
        },
        {
            href: "/guias/otimizacao-ssd-windows-11",
            title: "SSD",
            description: "Crucial para Dota."
        },
        {
            href: "/guias/reduzir-ping-regedit-cmd-jogos",
            title: "Ping",
            description: "Dota é sensível a rotas."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="45 min"
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
