import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'nvidia-painel-controle-melhores-configuracoes',
    title: "Painel de Controle Nvidia 2026: A Enciclopédia Definitiva (10 Capítulos)",
    description: "O guia mais completo da internet. Latência, DLDSR, Profile Inspector, MPO Fix, Debloating de Driver, Escala 4:3, HDMI 2.1 e muito mais.",
    category: 'otimizacao',
    difficulty: 'Especialista',
    time: '60 min'
};

const title = "Painel de Controle Nvidia (2026): A Bíblia da Performance (10 Capítulos)";
const description = "Se o seu objetivo é extrair até a última gota de performance da sua GPU Green Team, você chegou ao lugar certo. Este não é um guia rápido; é um curso completo de engenharia de driver.";

const keywords = [
    'painel de controle nvidia melhores configurações 2026 10 capitulos',
    'desativar mpo nvidia windows 11 fix flicker',
    'nvcleanstall tutorial remover telemetria nvidia',
    'escala de tela gpu vs monitor input lag 4:3 cs2',
    'hdmi 2.1 vs displayport 1.4 g-sync nvidia',
    'correcao de cores nvidia 10 bit vs 8 bit',
    'como forcar pci express 4.0 nvidia',
    'rtx video super resolution desligar performance',
    'ansel desativar lag',
    'hags windows 11 nvidia on ou off'
];

export const metadata: Metadata = createGuideMetadata('nvidia-painel-controle-melhores-configuracoes', title, description, keywords);

export default function NvidiaGuide() {
    const summaryTable = [
        { label: "Capítulos", value: "10 (Completo)" },
        { label: "Nível Técnico", value: "Extremo" },
        { label: "Riscos", value: "Baixo (Software)" },
        { label: "Tools", value: "NCP, Profile Inspector, NVCleanstall" },
        { label: "Foco", value: "FPS, Latência e Estabilidade" },
        { label: "Latência", value: "Reduzida (Reflex/ULLM)" },
        { label: "Visual", value: "DLDSR (4K Downscale)" }
    ];

    const contentSections = [
        {
            title: "Introdução e Meta",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Neste manifesto de 10 capítulos, vamos dissecar o driver GeForce. O objetivo é simples: eliminar gargalos de software que impedem seu hardware de brilhar. Vamos além do básico "Ligar/Desligar". Vamos entender o fluxo de renderização, a fila de quadros da CPU e como o Windows interfere na sua GPU.
        </p>
      `
        },
        {
            title: "Capítulo 1: Configurações 3D Globais (O Core)",
            content: `
        <p class="mb-4 text-gray-300">
            A base de tudo. Configure isso errado e nada mais importa.
        </p>
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-5 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-2">Modo de Latência Baixa</h4>
                <p class="text-sm text-gray-400">
                    <strong>Recomendação: LIGADO.</strong>
                    <br/>Define "Maximum Pre-Rendered Frames" para 1. Isso impede que a CPU prepare quadros muito à frente da GPU. O modo "Ultra" é arriscado pois tenta sincronizar "Just-in-Time", o que pode causar travadas se a GPU engasgar.
                </p>
            </div>
            <div class="bg-[#0A0A0F] p-5 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-2">Gerenciamento de Energia</h4>
                <p class="text-sm text-gray-400">
                    <strong>Recomendação: PREFERÊNCIA POR DESEMPENHO MÁXIMO.</strong>
                    <br/>Mantém os clocks de memória e núcleo da GPU no máximo (P0 State) durante o jogo, evitando a latência de "subida de clock" quando a ação esquenta.
                </p>
            </div>
            <div class="bg-[#0A0A0F] p-5 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-2">Cache de Shader</h4>
                <p class="text-sm text-gray-400">
                    <strong>Recomendação: ILIMITADO.</strong>
                    <br/>O maior causador de stutters em jogos modernos (Warzone, Fortnite) é falta de cache de shader. Deixe ilimitado para que o Windows nunca apague shaders compilados, garantindo que o jogo rode liso mesmo após meses.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Cores e Faixa Dinâmica (O Fim do Cinza)",
            content: `
        <p class="mb-4 text-gray-300">
            Muitos monitores vêm configurados como "TVs" pelo driver, limitando o espectro de cores.
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
            <li>Vá em <strong>Mudar resolução</strong> > Role para baixo.</li>
            <li>Marque "Utilizar configurações de cor da NVIDIA".</li>
            <li>Profundidade de cor: <strong>10 bpc</strong> (se disponível) ou 8 bpc.</li>
            <li>Intervalo de saída: <strong class="text-emerald-400">Completo (0-255)</strong>. Nunca use Limitado (16-235) em monitor.</li>
        </ul>
        <p class="mt-4 text-gray-300 text-sm">
            Em "Ajustar configurações de cor da área de trabalho", aumente o <strong>Digital Vibrance</strong> para 65-75% para jogos competitivos. Isso ajuda a distinguir inimigos em áreas escuras.
        </p>
      `
        },
        {
            title: "Capítulo 3: DSR e DLDSR (Supersampling IA)",
            content: `
        <p class="mb-4 text-gray-300">
            DLDSR (Deep Learning Dynamic Super Resolution) é a arma secreta das placas RTX.
        </p>
        <div class="bg-purple-900/10 p-5 rounded-xl border border-purple-500/20">
            <h4 class="text-purple-400 font-bold mb-2">Como configurar:</h4>
            <ol class="list-decimal list-inside text-gray-300 text-sm">
                <li>Ative <strong>DLDSR 1.78x</strong> ou <strong>2.25x</strong> nos fatores DSR globalmente.</li>
                <li>Defina a "Suavidade DSR" em <strong>33%</strong> (Ponto doce).</li>
                <li>No jogo, selecione a nova resolução (ex: 2560x1440 em monitor 1080p).</li>
            </ol>
            <p class="mt-2 text-gray-400 text-xs">
                Resultado: Uma imagem absurdamente nítida, com serrilhados eliminados por IA, e custo de performance muito menor que o DSR antigo. Essencial para jogos de história e até competitivos se sua GPU sobrar.
            </p>
        </div>
      `
        },
        {
            title: "Capítulo 4: G-Sync e V-Sync (A Trindade)",
            content: `
        <p class="mb-4 text-gray-300">
            A configuração definitiva para remover tearing SEM input lag perceptível.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div class="bg-gray-800 p-4">1. G-Sync ON (Painel)</div>
            <div class="bg-gray-800 p-4">2. V-Sync ON (Painel)</div>
            <div class="bg-gray-800 p-4">3. V-Sync OFF (Jogo)</div>
        </div>
        <p class="text-center mt-2 text-gray-400 text-sm">+ FPS Cap em (Hz - 3). Ex: 141 FPS para 144Hz.</p>
        <p class="mt-4 text-gray-300 text-sm">
            Isso mantém o G-Sync sempre ativo. O V-Sync no painel age apenas como um limitador de quadro para quando o framerate excede o Hz, mas como limitamos o FPS abaixo do Hz, o V-Sync nunca engatilha sua latência, servindo apenas para corrigir frame-pacing.
        </p>
      `
        },
        {
            title: "Capítulo 5: Escala e Aspect Ratio (4:3 CS2)",
            content: `
        <p class="mb-4 text-gray-300">
            Para jogadores de CS2 e Valorant que usam resoluções esticadas (Stretched).
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
            <li>Vá em <strong>Ajustar o tamanho e a posição da área de trabalho</strong>.</li>
            <li>Modo de escala: <strong>Tela Inteira</strong> (Para esticar 4:3 sem bordas pretas).</li>
            <li>Executar escala em: <strong>GPU</strong> (Geralmente tem input lag menor e melhor qualidade de downscaling que o Monitor/Vídeo).</li>
            <li>Marque "Substituir o modo de escala definido por jogos e programas".</li>
        </ul>
      `
        },
        {
            title: "Capítulo 6: PhysX e Surround",
            content: `
        <p class="mb-4 text-gray-300">
             Na aba "Configurar Surround, PhysX", mude o processador PhysX de "Seleção Automática" para sua <strong>Placa de Vídeo (RTX/GTX)</strong>.
             <br/>Isso força o driver a manter as chamadas de física na GPU, evitando interrupções desnecessárias na CPU (Context Switching), o que pode ajudar microscopicamente no frametime.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 7: Nvidia Profile Inspector (Hacks)",
            content: `
            <div class="bg-gray-800/50 p-6 rounded-xl border border-gray-700 mb-8">
                <h4 class="text-orange-400 font-bold mb-4 text-xl">Desbloqueando o Driver</h4>
                <p class="text-gray-300 mb-4">
                    Baixe o Nvidia Profile Inspector no GitHub. Ele edita o registro do driver.
                </p>
                <ol class="list-decimal list-inside text-gray-300 space-y-2">
                    <li><strong>Forçar Resizable BAR:</strong> Em "Common", ative rBAR Feature, Options e Size Limit para jogos DX12 que a Nvidia não validou. Ganho de até 10% FPS.</li>
                    <li><strong>Desativar Ansel:</strong> Em "Ansel Usage Restrictions", coloque "Disallowed". Isso remove o overlay de foto da Nvidia que roda em segundo plano consumindo memória.</li>
                    <li><strong>Memory P2 State Off:</strong> Em "CUDA - Force P2 State", coloque "Off". Isso impede que a VRAM baixe a frequência ao usar cargas de CUDA/Compute, mantendo o clock de memória no máximo.</li>
                </ol>
            </div>
            `
        },
        {
            title: "Capítulo 8: NVCleanstall (Debloating)",
            content: `
            <p class="mb-4 text-gray-300">
                O instalador padrão da Nvidia instala: Telemetria, Shield Streaming, GeForce Experience, Audio HD, USBC Driver... Coisas que você provavelmente não usa.
                <br/>O <strong>NVCleanstall</strong> é uma ferramenta que baixa o driver e deixa você escolher o que instalar.
                <br/><strong>Recomendação Radical:</strong> Instale APENAS: "Display Driver", "PhysX" e "HD Audio" (se usar som pelo HDMI). Remova "Telemetry", "Shield Wireless", "Optimizations", etc. O driver fica 300MB mais leve e roda menos processos em background.
            </p>
            `
        },
        {
            title: "Capítulo 9: MPO Fix (Multi-Plane Overlay)",
            content: `
            <p class="mb-4 text-gray-300">
                O maior vilão do Windows 10/11 com Nvidia. O MPO causa telas piscando (flickering), telas pretas em Alt+Tab e stutters em navegadores baseados em Chromium.
                <br/>A Nvidia recomenda desativar o MPO se você tiver esses problemas.
                <br/><strong>Como fazer:</strong> Use o arquivo de registro oficial "mpo_disable.reg" fornecido no fórum da Nvidia ou crie a chave <code>OverlayTestMode</code> no registro do DWM e defina como 5. O Voltris Optimizer faz isso automaticamente no modo "Correção de Bugs".
            </p>
            `
        },
        {
            title: "Capítulo 10: MSI Mode Utility & TDR",
            content: `
            <p class="mb-4 text-gray-300">
                Duas configurações de nível de kernel para finalizar:
            </p>
            <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li><strong>MSI Mode (Message Signaled Interrupts):</strong> Use o utilitário "MSI Mode Utility v3". Verifique se sua GPU tem a caixa "MSI" marcada e prioridade "High". Isso muda a comunicação da GPU com a CPU de baseada em linhas (lenta) para baseada em mensagens (rápida), reduzindo latência DPC.</li>
                <li><strong>TDR Delay:</strong> No Regedit, aumente o <code>TdrDelay</code> para 10 segundos. Isso impede que o driver crashe e reinicie ("O driver de vídeo parou de responder") quando a GPU fica em 100% de carga por muito tempo em cenas complexas.</li>
            </ul>
            `
        }
    ];

    const additionalContentSections = [
        {
            title: "Apêndice: Cabos (HDMI 2.1 vs DP 1.4)",
            content: `
            <p class="mb-4 text-gray-300">
                Nenhuma configuração salva um cabo ruim.
                <br/>- <strong>DisplayPort 1.4:</strong> O padrão Ouro. Suporta G-Sync nativo e altas taxas de atualização.
                <br/>- <strong>HDMI 2.0:</strong> Limitado. Muitas vezes limita o monitor a 120Hz ou 60Hz em 4K, e o G-Sync pode não funcionar.
                <br/>- <strong>HDMI 2.1:</strong> Excelente (4K 120Hz), mas só disponível em placas RTX 3000+ e monitores muito novos.
                <br/>Sempre use o cabo DisplayPort que veio com o monitor. Cabos HDMI genéricos são a causa #1 de "Tela piscando" e "Opção 144Hz não aparece".
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Isso anula a garantia?",
            answer: "Não. Todas as configurações aqui são de software e nível de driver. Não estamos fazendo overclock de voltagem nem modificando a BIOS da placa."
        },
        {
            question: "Devo usar 'Gama' ou 'Nitidez' no Painel?",
            answer: "Evite mudar Gama e Brilho no painel Nvidia, pois isso comprime a faixa dinâmica de cores via software. Ajuste brilho e contraste NO MONITOR (botões físicos) sempre que possível."
        },
        {
            question: "RTX Video Super Resolution vale a pena?",
            answer: "Para ver vídeos, sim (escala 1080p para 4K via IA). Mas DESLIGUE ao jogar jogos pesados. A GPU usa os mesmos núcleos para processar o jogo e o vídeo do YouTube na segunda tela, causando perda de performance."
        }
    ];

    const externalReferences = [
        { name: "BlurBusters G-Sync 101", url: "https://blurbusters.com/gsync/gsync101-input-lag-tests-and-settings/" },
        { name: "Nvidia Profile Inspector (GitHub)", url: "https://github.com/Orbmu2k/nvidiaProfileInspector" },
        { name: "MPO Disable Fix", url: "https://nvidia.custhelp.com/app/answers/detail/a_id/5157" }
    ];

    const relatedGuides = [
        {
            href: "/guias/otimizacao-ssd-windows-11",
            title: "Guia SSD",
            description: "O parceiro ideal para uma GPU rápida."
        },
        {
            href: "/guias/como-usar-ddu-driver-uninstaller",
            title: "DDU Limpo",
            description: "Passo 0 antes de configurar o painel."
        },
        {
            href: "/guias/monitor-hz-configuracao-correta",
            title: "Monitor Hz",
            description: "Não adianta configurar a GPU se o monitor está em 60Hz."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="60 min"
            difficultyLevel="Especialista"
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
