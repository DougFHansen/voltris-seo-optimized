import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'g-sync-freesync-configuracao-correta',
    title: "G-Sync e FreeSync 2026: Análise Técnica de Input Lag e LFC",
    description: "O guia final sobre VRR. Entenda a diferença entre G-Sync Compatible, Native e por que você DEVE ativar o V-Sync no painel de controle (mas não no jogo).",
    category: 'perifericos',
    difficulty: 'Avançado',
    time: '30 min'
};

const title = "Engenharia de Sincronização: G-Sync, FreeSync e a Busca pelo Zero Tearing";
const description = "A tecnologia VRR (Variable Refresh Rate) revolucionou os jogos, mas 90% das pessoas a usam errado. Vamos sincronizar seu hardware para fluidez perfeita sem latência.";

const keywords = [
    'configuração correta g-sync v-sync fps cap 2026',
    'freesync flickering tela piscando fix',
    'g-sync vs vsync vs fast sync input lag',
    'monitor g-sync compatible lista oficial',
    'low framerate compensation lfc explicada',
    'travar fps rivatuner vs painel nvidia latência',
    'scanline sync rtss tutorial'
];

export const metadata: Metadata = createGuideMetadata('g-sync-freesync-configuracao-correta', title, description, keywords);

export default function SyncGuide() {
    const summaryTable = [
        { label: "V-Sync (NV Painel)", value: "LIGADO (Sempre)" },
        { label: "V-Sync (In-Game)", value: "DESLIGADO (Sempre)" },
        { label: "FPS Limit (Cap)", value: "-3 do Hz Máximo" },
        { label: "Modo Low Latency", value: "Ultra (Ajuda no Cap)" },
        { label: "Input Lag Added", value: "~1ms (Invisível)" },
        { label: "Visual", value: "Tearing Zero" },
        { label: "Dificuldade", value: "Avançado" }
    ];

    const contentSections = [
        {
            title: "A Regra de Ouro do G-Sync (Bíblia BlurBusters)",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Existe um mito de que "V-Sync adiciona lag, logo devo desligar". Isso é verdade para monitores fixos de 60Hz. Mas no mundo do VRR (G-Sync/FreeSync), a regra muda.
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed">
            O site BlurBusters provou com câmeras de alta velocidade que o G-Sync PRECISA do V-Sync ativado no Painel de Controle para cobrir o "Tearing de Frametime". Se você usar G-Sync sem V-Sync, você ainda terá rasgos na parte inferior da tela quando o frametime variar.
        </p>

        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20 my-8">
            <h4 class="text-[#31A8FF] font-bold mb-3 flex items-center gap-2">
                <span class="text-xl">⚖️</span> Auto-Sync via Voltris
            </h4>
            <p class="text-gray-300 mb-4">
                Configurar o trio (G-Sync + V-Sync + FPS Cap) manualmente dá trabalho. O <strong>Voltris Optimizer</strong> aplica um perfil global "E-Sports Sync" que configura o limitador de FPS baseado no seu monitor e as travas de V-Sync no driver automaticamente.
            </p>
            <a href="/voltrisoptimizer" class="group relative inline-flex px-8 py-3 bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-white font-bold text-base rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-[1.03] hover:shadow-[0_0_60px_rgba(139,49,255,0.4)] items-center justify-center gap-2">
                Otimizar Sync
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
            </a>
        </div>
      `
        },
        {
            title: "Passo 1: A Configuração Sagrada",
            content: `
        <div class="bg-[#0A0A0F] p-6 rounded-xl border border-white/5 space-y-4">
            <h4 class="text-white font-bold text-xl mb-4 border-b border-white/10 pb-2">Siga EXATAMENTE nesta ordem:</h4>
            
            <div class="flex items-start gap-4">
                <div class="bg-emerald-500/20 text-emerald-400 font-bold px-3 py-1 rounded">1</div>
                <div>
                    <h5 class="text-[#31A8FF] font-bold">Painel Nvidia > Configure G-Sync</h5>
                    <p class="text-gray-300 text-sm">Marque "Enable for Full screen mode". (Modo janela pode causar stutter no Windows DWM).</p>
                </div>
            </div>

            <div class="flex items-start gap-4">
                <div class="bg-emerald-500/20 text-emerald-400 font-bold px-3 py-1 rounded">2</div>
                <div>
                    <h5 class="text-[#31A8FF] font-bold">Painel Nvidia > Gerenciar Configurações 3D</h5>
                    <p class="text-gray-300 text-sm">Vertical Sync (Sincronização Vertical): <strong class="text-emerald-400">LIGADO</strong> (On).</p>
                </div>
            </div>

            <div class="flex items-start gap-4">
                <div class="bg-emerald-500/20 text-emerald-400 font-bold px-3 py-1 rounded">3</div>
                <div>
                    <h5 class="text-[#31A8FF] font-bold">DENTRO DO JOGO</h5>
                    <p class="text-gray-300 text-sm">V-Sync: <strong class="text-rose-400">DESLIGADO</strong> (Off).</p>
                    <p class="text-gray-300 text-sm">FPS Limit: <strong class="text-rose-400">DESLIGADO</strong> ou ilimitado.</p>
                </div>
            </div>

            <div class="flex items-start gap-4">
                <div class="bg-emerald-500/20 text-emerald-400 font-bold px-3 py-1 rounded">4</div>
                <div>
                    <h5 class="text-[#31A8FF] font-bold">Painel Nvidia > Max Frame Rate</h5>
                    <p class="text-gray-300 text-sm">Trave em <strong>Hz - 3</strong>.</p>
                    <ul class="text-gray-400 text-xs ml-4 list-disc mt-1">
                        <li>144Hz -> 141 FPS</li>
                        <li>165Hz -> 162 FPS</li>
                        <li>240Hz -> 237 FPS</li>
                    </ul>
                </div>
            </div>
        </div>
      `
        },
        {
            title: "Por que travar 3 FPS abaixo?",
            content: `
        <p class="mb-4 text-gray-300">
            O G-Sync só funciona <strong>dentro do range</strong> do monitor (Ex: 48Hz até 144Hz).
        </p>
        <p class="mb-4 text-gray-300">
            Se seu jogo atinge 145 FPS, o G-Sync <strong>desliga</strong> automaticamente. Nesse momento, entra o V-Sync que você ligou no driver, causando um input lag massivo repentino.
            <br/>Ao travar em 141 FPS, garantimos que o jogo NUNCA encoste no teto de 144Hz. Assim, o G-Sync fica 100% do tempo ativo, e o V-Sync do driver nunca é acionado de verdade (ele fica só de "segurança").
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "LFC (Low Framerate Compensation): O Salvador",
            content: `
            <div class="bg-gray-800/50 p-6 rounded-xl border border-gray-700 mb-8">
                <h4 class="text-orange-400 font-bold mb-4 text-xl">O que acontece se meu FPS cair muito?</h4>
                <p class="text-gray-300 mb-4">
                    Suponha que seu FPS caia para 40 FPS num monitor de 144Hz (cujo alcance mínimo é 48Hz). O G-Sync deveria desligar, certo?
                </p>
                <p class="text-gray-300 text-sm mb-4">
                    Errado. Aí entra o <strong>LFC</strong>. O monitor duplica os Hz para acompanhar.
                    <br/>GPU: 40 FPS.
                    <br/>Monitor: 80 Hz (Mostra cada frame 2 vezes).
                </p>
                <p class="text-gray-300 text-sm italic">
                    Isso mantém a fluidez visual mesmo com performance ruim.
                </p>
            </div>
            `
        },
        {
            title: "Problema de Brilho Piscando (Flickering)",
            content: `
            <p class="mb-4 text-gray-300">
                Alguns monitores VA (propensos a isso) piscam o brilho quando o LFC entra e sai em ação (na transição de 48Hz).
            </p>
            <p class="text-gray-300">
                <strong>Solução:</strong> Use o programa CRU (Custom Resolution Utility) e aumente o range mínimo do FreeSync para 70Hz ou 90Hz. Isso força o LFC a ficar "Sempre Ativo" em jogos pesados, evitando a oscilação de transição.
            </p>
            `
        }
    ];

    const additionalContentSections = [
        {
            title: "Veredito: Competitivo vs Single Player",
            content: `
            <p class="mb-4 text-gray-300">
                <strong>CS2 / Valorant:</strong> Se você tem 400 FPS constantes, DESLIGUE tudo (G-Sync Off, V-Sync Off). Deixe o Tearing acontecer. Em FPS altíssimo (300+), o tearing é micro e pouco visível, e a latência é a menor possível.
            </p>
            <p class="text-gray-300">
                <strong>Warzone / Apex / Jogos AAA:</strong> O FPS varia muito (100-180). Aqui o G-Sync brilha. A consistência visual ajuda você a rastrear (track) alvos melhor do que ter input lag 1ms menor mas com a imagem toda cortada.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Fast Sync (Nvidia) vale a pena?",
            answer: "Fast Sync é uma alternativa para quem tem MUITO FPS (ex: 300 FPS em tela 60Hz). Ele renderiza tudo e só mostra o último frame completo. Causa menos lag que V-Sync, mas causa Micro-Stutter (passo de frame inconsistente). Em 2026, é melhor limitar o FPS do que usar Fast Sync."
        },
        {
            question: "G-Sync Compatible (Não certificado) funciona?",
            answer: "99% das vezes, sim. A Nvidia tem uma lista 'fresca' de validação, mas o protocolo VESA Adaptive Sync é padrão. Você pode forçar a ativação no painel mesmo que diga 'Display not validated'. Só fique atento a piscadas na tela."
        },
        {
            question: "Cabo HDMI 2.1 substitui DisplayPort?",
            answer: "Sim, se GPU e Monitor forem ambos HDMI 2.1 (48Gbps). Mas é muito mais propenso a falhas de handshake e tela preta. DisplayPort continua sendo a escolha mais robusta para PC."
        }
    ];

    const externalReferences = [
        { name: "BlurBusters G-Sync 101 (Bíblia Técnica)", url: "https://blurbusters.com/gsync/gsync101-input-lag-tests-and-settings/" },
        { name: "Lista de Monitores G-Sync Compatible", url: "https://www.nvidia.com/en-us/geforce/products/g-sync-monitors/specs/" }
    ];

    const relatedGuides = [
        {
            href: "/guias/monitor-hz-configuracao-correta",
            title: "Guia de Hz",
            description: "G-Sync não funciona se seu Hz estiver errado no Windows."
        },
        {
            href: "/guias/nvidia-painel-controle-melhores-configuracoes",
            title: "Painel Nvidia",
            description: "Ajustes finos para acompanhar o G-Sync."
        },
        {
            href: "/guias/mouse-dpi-polling-rate-ideal",
            title: "Mouse Lag",
            description: "Não adianta tirar lag do video e ter lag no mouse."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="30 min"
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
