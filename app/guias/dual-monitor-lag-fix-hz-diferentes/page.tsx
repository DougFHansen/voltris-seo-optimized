import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'dual-monitor-lag-fix-hz-diferentes',
    title: "Dual Monitor (2026): Corrigindo Lag de 144Hz + 60Hz",
    description: "Seu jogo em 144Hz trava quando você vê vídeo na segunda tela de 60Hz? Entenda o bug do DWM do Windows e aprenda 3 soluções definitivas.",
    category: 'windows',
    difficulty: 'Intermediário',
    time: '15 min'
};

const title = "Dual Monitor Fix (2026): 144Hz + 60Hz sem Stutter";
const description = "Misturar monitores de frequências diferentes sempre foi o calcanhar de aquiles do Windows. Vários updates prometeram arrumar, mas o stutter continua lá. Aqui está como corrigir.";

const keywords = [
    'dual monitor 144hz 60hz lag fix',
    'segundo monitor travando o principal',
    'dwm.exe high cpu usage dual monitor',
    'gpu hardware scheduling on or off dual monitor',
    'desativar preview chrome segundo monitor',
    'obs preview causando lag no jogo',
    'nvidia multi display power saver',
    'modo jogo windows 11 prioridade',
    'voltris optimizer multi monitor',
    'travar fps segundo monitor 60'
];

export const metadata: Metadata = createGuideMetadata('dual-monitor-lag-fix-hz-diferentes', title, description, keywords);

export default function DualMonitorGuide() {
    const summaryTable = [
        { label: "GPU Sched", value: "ON (Windows 11)" },
        { label: "IGPU", value: "Use para 2ª tela" },
        { label: "Chrome", value: "Hardware Accel OFF" },
        { label: "Jogo", value: "Fullscreen Exclusive" },
        { label: "Hz", value: "Múltiplos (120/60)" },
        { label: "Nvidia", value: "Perform Scaling: GPU" },
        { label: "Cabo", value: "DP (Principal) / HDMI (2º)" }
    ];

    const contentSections = [
        {
            title: "Introdução: O Bug do DWM",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O Desktop Window Manager (DWM.exe) tenta sincronizar todas as telas. Se você tem uma tela rápida (144Hz) e uma lenta (60Hz) com um vídeo rodando (YouTube/Twitch/OBS), o Windows às vezes "nivela por baixo", causando stutters no jogo principal.
        </p>
      `
        },
        {
            title: "Capítulo 1: Solução da iGPU (Gráfico Integrado)",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">A Bala de Prata</h4>
                <p class="text-gray-400 text-xs text-justify">
                    Se sua CPU tem vídeo integrado (Intel não-F ou Ryzen G/7000+), plugue o <strong>segundo monitor</strong> na placa-mãe, não na Placa de Vídeo.
                    <br/>Ative a iGPU na BIOS (iGPU Multi-Monitor).
                    <br/>Isso faz o Windows renderizar o YouTube/Discord usando o chip Intel, deixando sua RTX 100% livre e exclusiva para o jogo no monitor principal. Stutter Zero garantido.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Hardware Accelerated GPU Scheduling",
            content: `
        <p class="mb-4 text-gray-300">
            No Windows 10/11: Configurações > Sistema > Tela > Elementos Gráficos > Alterar configurações de gráficos padrão.
            <br/>Ative o <strong>Agendamento de GPU acelerado por hardware</strong>.
            <br/>Isso permite que a GPU gerencie sua própria memória, ajudando a lidar com múltiplas taxas de atualização. Reinicie o PC.
        </p>
      `
        },
        {
            title: "Capítulo 3: Navegadores e Aceleração",
            content: `
        <p class="mb-4 text-gray-300">
            Se você não pode usar a iGPU:
            <br/>No Chrome/Discord que fica na segunda tela, vá em Configurações e <strong>Desative a Aceleração de Hardware</strong>.
            <br/>Isso força o vídeo a ser decodificado pela CPU. Seu uso de CPU vai subir um pouco, mas libera a GPU para não engasgar o jogo. É uma troca justa hoje em dia, já que CPUs têm núcleos sobrando.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: Regra dos Múltiplos",
            content: `
        <p class="mb-4 text-gray-300">
            Matemática ajuda. O Windows lida melhor quando as taxas são múltiplas.
            <br/>120Hz é múltiplo de 60Hz (2x). Funciona liso.
            <br/>144Hz não é múltiplo de 60Hz. (2.4x). Ocorre "frame skipping".
            <br/>Se estiver com muito problema, tente baixar seu monitor principal para <strong>120Hz</strong>. Muitas vezes resolve o stutter instantaneamente.
        </p>
      `
        },
        {
            title: "Capítulo 5: Nvidia Multi-Display Power Saver",
            content: `
        <p class="mb-4 text-gray-300">
            Telas com resoluções/Hz diferentes impedem a placa de vídeo de entrar em modo de economia ("Idle Clocks") ou a fazem oscilar loucamente.
            <br/>Use o <strong>Nvidia Inspector</strong> (Multi Display Power Saver) para forçar clocks de memória altos quando 2 monitores estiverem conectados, evitando lag. (Avançado).
        </p>
      `
        },
        {
            title: "Capítulo 6: Fullscreen Exclusive",
            content: `
        <p class="mb-4 text-gray-300">
            Jogue em <strong>Tela Cheia Exclusiva</strong>.
            <br/>O modo "Janela sem bordas" (Borderless) força o jogo a passar pelo DWM do Windows (o compositor da área de trabalho).
            <br/>O modo Exclusivo pula o DWM, dando prioridade total ao jogo e ignorando o que acontece na segunda tela.
        </p>
      `
        },
        {
            title: "Capítulo 7: Game Mode (Modo de Jogo)",
            content: `
        <p class="mb-4 text-gray-300">
            Mantenha o Modo de Jogo do Windows <strong>LIGADO</strong>.
            <br/>Ele detecta o jogo na tela principal e reduz a prioridade de processos (como uma atualização na segunda tela) para evitar que roubem recursos.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: OBS Studio Preview",
            content: `
            <p class="mb-4 text-gray-300">
                Se você faz stream: A "Prévia" (Preview) do OBS consome muita GPU porque renderiza a cena em tempo real.
                <br/>Clique com botão direito na prévia > <strong>Desativar Prévia</strong> após começar a live.
                <br/>Isso libera cerca de 10-15% de uso de GPU.
            </p>
            `
        },
        {
            title: "Capítulo 9: Wallpaper Engine",
            content: `
            <p class="mb-4 text-gray-300">
                Wallpapers animados são lindos, mas comem FPS.
                <br/>Configure o Wallpaper Engine para "Pausar" ou "Parar (liberar memória)" quando outra aplicação estiver em tela cheia/maximizada.
                <br/>Não deixe ele rodando atrás do jogo.
            </p>
            `
        },
        {
            title: "Capítulo 10: Barra de Tarefas (Taskbar)",
            content: `
            <p class="mb-4 text-gray-300">
                No Windows 11, você pode desativar a barra de tarefas no segundo monitor se preferir.
                <br/>Menos elementos de UI para o Windows desenhar = Menos chance de conflito.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "G-Sync no segundo monitor?",
            answer: "Geralmente não funciona bem misturar G-Sync na principal e tela fixa na secundária em modo janela. Use G-Sync apenas em Tela Cheia Exclusiva na principal para evitar bugs."
        },
        {
            question: "Adaptadores USB para HDMI causam lag?",
            answer: "Sim! Aqueles adaptadores USB DisplayLink usam CPU para comprimir vídeo. Causam bastante lag no sistema. Evite para jogos, use apenas para planilhas."
        },
        {
            question: "Qual cabo usar na segunda tela?",
            answer: "HDMI é suficiente para 60Hz. Deixe o DisplayPort para o monitor Gamer principal."
        }
    ];

    const externalReferences = [
        { name: "Nvidia Profile Inspector", url: "https://github.com/Orbmu2k/nvidiaProfileInspector" },
        { name: "Blur Busters (Display Tech)", url: "https://blurbusters.com/" }
    ];

    const relatedGuides = [
        {
            href: "/guias/monitor-hz-configuracao-correta",
            title: "Configurar Monitor",
            description: "Para a tela principal."
        },
        {
            href: "/guias/google-chrome-consumo-ram-fix",
            title: "Chrome",
            description: "Desativar aceleração para a 2ª tela."
        },
        {
            href: "/guias/obs-studio-melhores-configuracoes-stream",
            title: "OBS",
            description: "Ajustes de Preview."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="15 min"
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
