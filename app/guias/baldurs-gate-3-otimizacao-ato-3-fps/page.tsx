import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'baldurs-gate-3-otimizacao-ato-3-fps',
    title: "Baldur's Gate 3: Otimização Definitiva do Ato 3 (2026)",
    description: "Chegou na Cidade Baixa e o FPS caiu pela metade? Aprenda a otimizar a CPU, configurar DLSS/FSR corretamente e usar Mods essenciais para estabilizar o jogo.",
    category: 'jogos',
    difficulty: 'Intermediário',
    time: '30 min'
};

const title = "Baldur's Gate 3: Otimização Definitiva do Ato 3 (2026)";
const description = "O Ato 3 de Baldur's Gate 3 é famoso por destruir processadores. Com centenas de NPCs simulados ao mesmo tempo, sua GPU sobra e sua CPU chora. Aprenda os segredos para rodar liso.";

const keywords = [
    'baldurs gate 3 ato 3 travando muito fix 2026',
    'bg3 cidade baixa fps drop solucao',
    'melhores configuracoes graficas bg3 pc fraco',
    'dlss vs fsr 2.2 baldurs gate 3 qualidade',
    'vulkan vs dx11 qual usar nvidia amd',
    'hdd mode lento ssd travando',
    'native camera tweaks mod tutorial'
];

export const metadata: Metadata = createGuideMetadata('baldurs-gate-3-otimizacao-ato-3-fps', title, description, keywords);

export default function BG3Guide() {
    const summaryTable = [
        { label: "O Vilão", value: "CPU (Gargalo de IA/NPCs)" },
        { label: "API Recomendada", value: "DX11 (NVIDIA) / Vulkan (AMD)" },
        { label: "DLSS", value: "Quality (Para GPU) / Native AA (Visual)" },
        { label: "HDD Mode", value: "DESLIGADO (Se tiver SSD)" },
        { label: "Dynamic Crowds", value: "DESLIGADO (Ganho massivo)" },
        { label: "Mods Essenciais", value: "Native Camera + WASD" }
    ];

    const contentSections = [
        {
            title: "Por que o Ato 3 é tão pesado?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Diferente dos atos 1 (floresta) e 2 (escuridão), a Cidade Baixa no Ato 3 tem <strong>centenas de NPCs</strong>, cada um com sua própria rotina de inteligência artificial, pathfinding e inventário. Isso cria um gargalo brutal na <strong>CPU (Processador)</strong>. Mexer na resolução ou qualidade de textura (que usam GPU) ajuda POUCO aqui. O foco deve ser aliviar o processador.
        </p>
      `
        },
        {
            title: "Configurações Críticas (Video Settings)",
            content: `
        <p class="mb-4 text-gray-300">
          Acesse Opções > Vídeo. Estas são as únicas que realmente importam para a CPU:
        </p>
        
        <div class="space-y-4">
            <div class="bg-red-900/10 p-5 rounded-xl border border-red-500/20">
                <h4 class="text-red-400 font-bold mb-2">Dynamic Crowds (Multidão Dinâmica)</h4>
                <p class="text-sm text-gray-300">
                    <strong>Recomendação: DESLIGADO.</strong>
                    <br/>Isso faz com que NPCs "inúteis" de fundo tenham comportamento complexo. Desligar transforma eles em "cenário", economizando muito tempo de CPU.
                </p>
            </div>
            
            <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
                <h4 class="text-blue-400 font-bold mb-2">Slow HDD Mode (Modo HDD Lento)</h4>
                <p class="text-sm text-gray-300">
                    <strong>Recomendação: DESLIGADO (Se você tem SSD).</strong>
                    <br/>Se ligado, o jogo comprime agressivamente as texturas na RAM e a CPU precisa descomprimir na hora de usar. Isso causa stuttering em CPUs fracas. Só ligue se você realmente estiver rodando num HD mecânico antigo (o que não é recomendado para BG3).
                </p>
            </div>

            <div class="bg-green-900/10 p-5 rounded-xl border border-green-500/20">
                <h4 class="text-green-400 font-bold mb-2">Fog Quality (Qualidade de Névoa)</h4>
                <p class="text-sm text-gray-300">
                    <strong>Recomendação: BAIXO.</strong>
                    <br/>A névoa volumétrica é renderizada em "fatias" (raymarching). No Ultra, ela abusa da GPU e CPU para cálculos de iluminação. No Baixo, ela ainda é bonita e ganha 10-15 FPS.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "DLSS vs FSR: Qual usar?",
            content: `
        <ul class="list-disc list-inside text-gray-300 space-y-3 bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
            <li><strong>NVIDIA RTX (20/30/40):</strong> Use <strong>DLSS Quality</strong>. Ele renderiza em 1440p/1080p e faz upscale para 4K melhor que a imagem nativa (o TAA nativo do jogo é meio borrado).</li>
            <li><strong>AMD / GTX Antigas:</strong> Use <strong>FSR 2.2 Quality</strong>. Não use o FSR 1.0 (fica horrível).</li>
            <li><strong>DLAA (Deep Learning Anti-Aliasing):</strong> Para quem tem GPU sobrando (RTX 4080/4090). É a imagem nativa com o antialiasing de IA da Nvidia. Imagem perfeita, mas pesado.</li>
        </ul>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "API: Vulkan ou DirectX 11?",
            content: `
        <p class="mb-4 text-gray-300">
          No launcher da Larian, você escolhe.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-gray-800/50 p-4 rounded-lg border border-green-500/30">
                <h5 class="font-bold text-white mb-2">DirectX 11 (Padrão)</h5>
                <p class="text-sm text-gray-300">
                    Mais estável, menos crashes, melhor para NVIDIA. Porém, tem um overhead de CPU um pouco maior que o Vulkan.
                </p>
            </div>
            <div class="bg-gray-800/50 p-4 rounded-lg border border-red-500/30">
                <h5 class="font-bold text-white mb-2">Vulkan</h5>
                <p class="text-sm text-gray-300">
                    Recomendado para AMD Radeon e Linux (Steam Deck). Tem melhor gerenciamento de multi-threading da CPU (bom para o Ato 3), mas pode ter bugs visuais ou crashes aleatórios ("Device Lost").
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Mods de Qualidade de Vida (QoL)",
            content: `
        <h4 class="text-white font-bold mb-3">Jogue como um RPG de Ação</h4>
        <p class="mb-4 text-gray-300">
            A câmera isométrica é clássica, mas ver o mundo de perto é incrível.
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
            <li><strong>Native Camera Tweaks:</strong> Libera o zoom e inclinação. Permite ver o céu e o horizonte (o jogo renderiza tudo, você só não vê).</li>
            <li><strong>WASD Character Movement:</strong> Permite andar com WASD como em Skyrim ou Witcher, em vez de clicar com o mouse. Imersão total.</li>
        </ul>
        <p class="text-xs text-gray-500 mt-2">Instale via BG3 Mod Manager. Requer Script Extender.</p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Comando de Inicialização (Steam)",
            content: `
        <h4 class="text-white font-bold mb-3">Pular o Launcher</h4>
        <p class="mb-4 text-gray-300">
            O launcher da Larian fica aberto em segundo plano comendo RAM.
            <br/>Vá na Steam > Botão Direito no Jogo > Propriedades > Opções de Inicialização:
            <br/><code class="bg-black p-1 rounded">--skip-launcher</code>
        </p>
      `
        }
    ];

    const faqItems = [
        {
            question: "O jogo fecha sozinho (Crash) no Ato 3, o que fazer?",
            answer: "Geralmente é falta de VRAM ou RAM. Feche o navegador (Chrome) enquanto joga. Se tiver 16GB de RAM, aumente o arquivo de paginação do Windows para 20GB. Verifique a integridade dos arquivos na Steam."
        },
        {
            question: "O SSD faz diferença?",
            answer: "Sim, ABSOLUTA. BG3 carrega texturas o tempo todo. Num HD mecânico, você verá texturas borradas (pop-in) por segundos e o jogo vai travar ao andar. Instale num SSD NVMe ou SATA obrigatoriamente."
        },
        {
            question: "Vale a pena travar o FPS?",
            answer: "Sim. Em jogos de turno, 60 FPS é perfeito. Travar em 60 (ou até 45 no Steam Deck) deixa a frametime linha reta, o que passa a sensação de fluidez mesmo que o número seja baixo."
        }
    ];

    const externalReferences = [
        { name: "Nexus Mods BG3", url: "https://www.nexusmods.com/baldursgate3" },
        { name: "BG3 Mod Manager", url: "https://github.com/LaughingLeader/BG3ModManager" },
        { name: "Script Extender", url: "https://github.com/Norbyte/bg3se" }
    ];

    const relatedGuides = [
        {
            href: "/guias/nvidia-painel-controle-melhores-configuracoes",
            title: "Painel NVIDIA",
            description: "Configure o driver para performance máxima."
        },
        {
            href: "/guias/otimizacao-ssd-windows-11",
            title: "Otimizar SSD",
            description: "Garanta que seu SSD está na velocidade máxima."
        },
        {
            href: "/guias/steam-launch-options-comandos-fps-boost",
            title: "Launch Options",
            description: "Códigos secretos da Steam."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="30 min"
            difficultyLevel="Intermediário"
            author="Equipe Gamer Voltris"
            lastUpdated="2026-02-06"
            contentSections={contentSections}
            advancedContentSections={advancedContentSections}
            additionalContentSections={additionalContentSections}
            summaryTable={summaryTable}
            faqItems={faqItems}
            externalReferences={externalReferences}
            relatedGuides={relatedGuides}
        />
    );
}
