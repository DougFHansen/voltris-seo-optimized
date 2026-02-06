import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'teclado-mecanico-rapid-trigger-snap-tap',
    title: "Rapid Trigger & Snap Tap (2026): A Revolução dos Teclados Hall Effect",
    description: "Entenda o que é Rapid Trigger (Wooting), Snap Tap (Razer) e como configurar teclados magnéticos para strafing instantâneo no CS2 e Valorant.",
    category: 'perifericos',
    difficulty: 'Avançado',
    time: '30 min'
};

const title = "Teclados Hall Effect (2026): O Fim do Teclado Mecânico Comum";
const description = "O Rapid Trigger mudou o competitivo. Ele permite que a tecla reset assim que você solta 0.1mm, permitindo contra-strafing sobre-humano.";

const keywords = [
    'rapid trigger wooting settings cs2',
    'razer snap tap o que é banimento',
    'null bind vs snap tap diferenca',
    'melhores teclados hall effect 2026',
    'configurar actuation point 0.1mm',
    'wootility web profile code',
    'drunkdeer vs wooting vs razer huntsman v3',
    'teclado magnetico vale a pena',
    'strafe perfeito valorant tutorial',
    'voltris optimizer keyboard polling'
];

export const metadata: Metadata = createGuideMetadata('teclado-mecanico-rapid-trigger-snap-tap', title, description, keywords);

export default function KeyboardGuide() {
    const summaryTable = [
        { label: "Switch", value: "Magnético (Hall Effect)" },
        { label: "Actuation", value: "0.1mm a 4.0mm" },
        { label: "Rapid Trigger", value: "ON (0.15mm)" },
        { label: "Snap Tap", value: "SOCD (Null Bind)" },
        { label: "Tachyon Mode", value: "ON (Wooting)" },
        { label: "Polling Rate", value: "8000Hz (Se CPU forte)" },
        { label: "RGB", value: "Low Brightness (Power)" }
    ];

    const contentSections = [
        {
            title: "Introdução: O Strafe Perfeito",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Em jogos como CS2 e Valorant, você precisa parar totalmente de se mover para atirar com precisão. O tempo que você leva para soltar a tecla 'A' e apertar 'D' define se você ganha ou perde. Teclados <strong>Rapid Trigger</strong> zeram esse delay físico.
        </p>
      `
        },
        {
            title: "Capítulo 1: O que é Rapid Trigger?",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Como funciona</h4>
                <p class="text-gray-400 text-xs text-justify">
                    Num teclado comum, você aperta a tecla até o fundo (4mm) e precisa soltar até o meio (2mm) para ela resetar.
                    <br/>No Rapid Trigger, a tecla reseta assim que você solta <strong>0.1mm</strong> em qualquer altura.
                    <br/>Isso significa que você pode "spamar" ADADADAD na velocidade da luz.
                </p>
            </div>
             <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Configuração Ideal (Wooting/DrunkDeer/Razer)</h4>
                <p class="text-gray-400 text-xs">
                    - <strong>Actuation Point:</strong> 0.4mm a 1.0mm (Para não apertar sem querer).
                    - <strong>Rapid Trigger Sensitivity:</strong> 0.15mm (O mais sensível possível sem dar double-click falso).
                    - Aplique isso apenas nas teclas WASD. No G (Granada) ou R (Reload), use padrão para evitar erros.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Snap Tap / SOCD (A Polêmica)",
            content: `
        <p class="mb-4 text-gray-300">
            A Razer lançou o "Snap Tap". O que ele faz?
            <br/>Se você segura 'A' e aperta 'D' (sem soltar o 'A'), o teclado prioriza o 'D' instantaneamente.
            <br/>No teclado comum, segurar A+D faz você parar. Com Snap Tap, você muda de direção sem precisar de coordenação perfeita.
            <br/><strong>Aviso 2026:</strong> A Valve baniu scripts de "Null Binds" (CFG), mas permite Snap Tap via Hardware (firmware do teclado) em torneios? A regra muda sempre. Verifique as regras do campeonato. No Matchmaking (MM/Premier), é usado liberado.
        </p>
      `
        },
        {
            title: "Capítulo 3: Tachyon Mode (Latência)",
            content: `
        <p class="mb-4 text-gray-300">
            No software Wootility, ative o <strong>Tachyon Mode</strong>.
            <br/>Ele sacrifica os efeitos RGB complexos para processar o input do teclado em menos de 1ms.
            <br/>Luzinha bonita < Headshot.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: Configuração de Actuation por Tecla",
            content: `
        <p class="mb-4 text-gray-300">
            - <strong>WASD:</strong> Actuation 0.4mm + Rapid Trigger (Agilidade).
            - <strong>Spacebar (Pulo):</strong> Actuation 1.5mm (Evita pulos acidentais).
            - <strong>Shift/Ctrl:</strong> 1.0mm.
            - <strong>G/R/1/2/3:</strong> 2.0mm (Padrão mecânico).
            <br/>Customizar cada tecla é a vantagem real dos magnéticos.
        </p>
      `
        },
        {
            title: "Capítulo 5: Mod Tap (Wooting)",
            content: `
        <p class="mb-4 text-gray-300">
            O DKS (Dynamic Keystroke) ou Mod Tap permite ações diferentes se você "tocar" ou "segurar".
            <br/>Exemplo: Tocar CapsLock = Ping. Segurar CapsLock = Walk (Shift).
            <br/>Isso otimiza o uso dos dedos mindinhos, muito útil em Fortnite (mais binds ao alcance).
        </p>
      `
        },
        {
            title: "Capítulo 6: Polling Rate 8000Hz",
            content: `
        <p class="mb-4 text-gray-300">
            Teclados novos vêm com 8000Hz (Razer Huntsman V3 Pro).
            <br/>Vale a pena?
            <br/>Sim, mas consome CPU. Se você tem um i5 de 10ª geração ou inferior, use 1000Hz. Se tiver um Ryzen 7800X3D, use 8000Hz para latência mínima.
        </p>
      `
        },
        {
            title: "Capítulo 7: Lubrificação e Mods",
            content: `
        <p class="mb-4 text-gray-300">
            Teclados Hall Effect (Wooting 60HE) permitem trocar switches e springs.
            <br/>Usar switches lubrificados (Lube 205g0) deixa o movimento da tecla mais suave, facilitando o controle preciso de 0.1mm. Não é só pelo som (Thock), é pela sensação tátil.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: Otimização USB",
            content: `
            <p class="mb-4 text-gray-300">
                Conecte o teclado direto na placa-mãe (USB traseiro).
                <br/>Nunca use HUBs USB ou porta frontal do gabinete.
                <br/>Use portas USB 3.0 ou superior para garantir energia estável para o processador do teclado.
            </p>
            `
        },
        {
            title: "Capítulo 9: Alternativas Baratas",
            content: `
            <p class="mb-4 text-gray-300">
                Wooting é caro.
                <br/>Opções custo-benefício 2026:
                <br/>- <strong>DrunkDeer A75/G65:</strong> 90% da performance, metade do preço.
                <br/>- <strong>Polar 65:</strong> Excelente build quality.
                <br/>- <strong>Razer Huntsman Mini Analog:</strong> Bom software, mas switch mais pesado.
            </p>
            `
        },
        {
            title: "Capítulo 10: Limpeza",
            content: `
            <p class="mb-4 text-gray-300">
                Poeira e cabelos podem entrar no sensor magnético e causar "chatter" (tecla falhando ou ativando sozinha).
                <br/>Mantenha o teclado limpo. Hall Effect é mais sensível à sujeira que contato metálico.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Isso é considerado Cheat?",
            answer: "Rapid Trigger não. É evolução de hardware (como sair de monitor 60hz para 144hz). Snap Tap/SOCD é uma área cinza, mas atualmente permitido pela maioria."
        },
        {
            question: "Funciona em MOBA?",
            answer: "Ajuda menos. Em LoL você "spama" skills, Rapid Trigger ajuda a spamar Q do Karthus mais rápido, mas não revolucionário como em FPS."
        },
        {
            question: "Preciso de software rodando?",
            answer: "No Wooting e DrunkDeer, a configuração salva na memória interna do teclado. Você pode fechar o software ou até desinstalar. Na Razer, precisa do Synapse rodando."
        }
    ];

    const externalReferences = [
        { name: "Wootility Web (Configurador)", url: "https://wootility.io/" },
        { name: "Optimum Tech (Review de Latência)", url: "https://www.youtube.com/c/OptimumTech" }
    ];

    const relatedGuides = [
        {
            href: "/guias/como-escolher-mouse-gamer",
            title: "Mouse",
            description: "O par perfeito."
        },
        {
            href: "/guias/valorant-reduzir-input-lag",
            title: "Valorant",
            description: "Onde usar Rapid Trigger."
        },
        {
            href: "/guias/cs2-otimizacao-fps-competitivo",
            title: "CS2",
            description: "Counter-Strafing guia."
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
