import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'mouse-acceleration-raw-accel-guia',
    title: "Raw Accel (2026): A Revolução da Aceleração de Mouse Customizada",
    description: "Aceleração de mouse não é mais vilã. Aprenda a usar o Raw Accel para ter precisão de pixel no micro-adjust e velocidade insana nos flicks. Usado por pros de Valorant/Apex.",
    category: 'perifericos',
    difficulty: 'Muito Avançado',
    time: '60 min'
};

const title = "Raw Accel Guide (2026): Aceleração Profissional";
const description = "Durante anos disseram 'Desligue a aceleração'. Eles estavam certos sobre a aceleração do Windows (imprevisível). Mas a aceleração linear controlada do Raw Accel é o segredo de muitos Top Fraggers.";

const keywords = [
    'raw accel download valorant settings 2026',
    'como configurar curva raw accel cs2',
    'aceleração de mouse boa vs ruim',
    'raw accel banimento vanguard',
    'motivity curve vs linear curve',
    'sens multiplier cap raw accel',
    'mouse acceleration fps pro players',
    'dpi ideal para raw accel',
    'reduzir input lag driver mouse',
    'voltris optimizer raw input'
];

export const metadata: Metadata = createGuideMetadata('mouse-acceleration-raw-accel-guia', title, description, keywords);

export default function RawAccelGuide() {
    const summaryTable = [
        { label: "Driver", value: "Raw Accel (Kernel)" },
        { label: "Curve Type", value: "Linear / Natural" },
        { label: "Sens Base", value: "Baixa (Controle)" },
        { label: "Sens Max", value: "Alta (Flicks)" },
        { label: "Input Lag", value: "Zero (Driver Nível Kernel)" },
        { label: "Anti-Cheat", value: "Safe (Assinado)" },
        { label: "DPI Mouse", value: "1600 ou 3200" }
    ];

    const contentSections = [
        {
            title: "Introdução: O Paradigma Mudou",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          No Windows, a opção "Aprimorar Precisão do Ponteiro" é horrível porque a curva é ruim. O <strong>Raw Accel</strong> é um driver que intercepta o input do mouse antes do Windows e aplica uma curva matemática perfeita que você desenha.
        </p>
         <div class="bg-[#0A0A0F] border border-blue-500/30 p-5 rounded-xl my-6">
            <h4 class="text-blue-400 font-bold mb-2">A Teoria</h4>
            <p class="text-gray-300 text-sm">
                Imagine ter sensibilidade super baixa (ex: 40cm/360) para mirar na cabeça de longe (precisão) e, instantaneamente, quando você move a mão rápido, sua sensibilidade dobra para você virar 180 graus (flick) sem quebrar o braço. É o melhor dos dois mundos.
            </p>
        </div>
      `
        },
        {
            title: "Capítulo 1: Instalação Segura",
            content: `
        <ol class="list-decimal list-inside text-gray-300 text-sm space-y-2">
            <li>Baixe o Raw Accel do GitHub oficial (a1xd).</li>
            <li>Extraia a pasta. Execute <code>installer.exe</code>.</li>
            <li>Reinicie o PC.</li>
            <li>Abra <code>rawaccel.exe</code>.</li>
            <li><strong>Importante:</strong> Marque "Start with Windows" se gostar. Se fizer uma curva ruim e seu mouse parar de funcionar, use outro mouse ou reinicie em Modo de Segurança para desinstalar.</li>
        </ol>
      `
        },
        {
            title: "Capítulo 2: Tipos de Curva (Linear vs Natural)",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Linear (A mais comum)</h4>
                <p class="text-gray-400 text-xs text-justify">
                    A velocidade aumenta em linha reta conforme a velocidade da sua mão aumenta. Simples de aprender.
                </p>
            </div>
             <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Natural / Motivity</h4>
                <p class="text-gray-400 text-xs">
                    Curvas em formato de "S". Começa devagar, acelera no meio, e estabiliza no final. Sensação mais "orgânica".
                </p>
            </div>
             <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Jump (Degrau)</h4>
                <p class="text-gray-400 text-xs">
                    A sensibilidade é X. Se passar de certa velocidade, vira imediatamente Y. Evite, é difícil controlar.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 3: Configurando sua Primeira Curva",
            content: `
        <p class="mb-4 text-gray-300">
            1. <strong>Sens Multiplier:</strong> 1 (Ou ajuste para sua sens base). Ex: Se você usava 800 DPI 0.5 in-game, e agora vai usar 1600 DPI, coloque 0.5 aqui.
            <br/>2. <strong>Acceleration:</strong> Comece baixo. 0.05.
            <br/>3. <strong>Cap Type:</strong> Output.
            <br/>4. <strong>Cap Output:</strong> 1.5 ou 2. (Isso significa que sua sensibilidade NUNCA vai passar de 2x a base, evitando que você gire igual beyblade se espirrar).
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: DPI Alto (1600/3200)",
            content: `
        <p class="mb-4 text-gray-300">
            Para o Raw Accel funcionar bem, o mouse precisa enviar muitos dados (pontos).
            <br/>Use 1600 DPI ou mais.
            <br/>Ajuste o "Sens Multiplier" para baixar de volta pra sua sens original (Ex: 1600 DPI com mult 0.5 = sensação de 800 DPI).
            <br/>Isso dá uma "resolução" maior para a curva matemática trabalhar, resultando em movimento ultra suave.
        </p>
      `
        },
        {
            title: "Capítulo 5: Offset (Zona Morta)",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>Offset</strong> é um valor de velocidade onde a aceleração NÃO aplica.
            <br/>Ex: Offset 15.
            <br/>Se você mover o mouse devagar (micro-ajuste), a aceleração é 0. É 100% consistente.
            <br/>Se mover rápido (passar de 15), a aceleração liga.
            <br/>Ideal para Tac-Shooters (Valorant/CS).
        </p>
      `
        },
        {
            title: "Capítulo 6: Anisotropia (Y diferente de X)",
            content: `
        <p class="mb-4 text-gray-300">
            Você pode ter aceleração diferente na vertical.
            <br/>Ex: Em Apex Legends, você quer mover rápido pros lados, mas controlar recuo vertical devagar. Use uma curva X agressiva e Y baixa ou nula.
        </p>
      `
        },
        {
            title: "Capítulo 7: Anti-Cheat e Banimento",
            content: `
        <p class="mb-4 text-gray-300">
            O Raw Accel é assinado digitalmente e aprovado pelo Vanguard (Valorant) e VAC (Valve).
            <br/>Ele é um driver de mouse legítimo, não um cheat de injeção de memória. 100% Seguro.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: Treinando a Memória Muscular",
            content: `
            <p class="mb-4 text-gray-300">
                Vai demorar 1 ou 2 semanas para acostumar.
                <br/>Jogue KovaaK's ou AimLab.
                <br/>Cenários de "Tracking" ficam mais fáceis. Cenários de "Clicking" estático podem ficar estranhos no começo. Não desista no primeiro dia.
            </p>
            `
        },
        {
            title: "Capítulo 9: Gráfico Visual",
            content: `
            <p class="mb-4 text-gray-300">
                Observe o gráfico no programa. A linha amarela mostra seu movimento em tempo real.
                <br/>Faça movimentos normais de jogo e veja onde eles caem no gráfico. Ajuste a aceleração para começar apenas DEPOIS dos seus movimentos de micro-ajuste.
            </p>
            `
        },
        {
            title: "Capítulo 10: Desinstalação Limpa",
            content: `
            <p class="mb-4 text-gray-300">
                Se odiar:
                <br/>Rode o <code>installer.exe</code> e clique em Uninstall. Reinicie.
                <br/>Se não fizer isso, o driver continua ativo mesmo fechando o programa.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Isso é bom para MOBA (LoL/Dota)?",
            answer: "Sim! Permite mover a câmera (bater no canto da tela) rápido sem precisar de DPI absurdo, mantendo precisão para clicar nos minions."
        },
        {
            question: "Funciona com qualquer mouse?",
            answer: "Sim, Logitech, Razer, Genérico. O driver atua no nível do Windows, agnóstico à marca."
        },
        {
            question: "Tenho que deixar o programa aberto?",
            answer: "Não necessariamente. O driver carrega no boot. O programa serve para editar e visualizar. Mas conferir se está rodando antes de jogar é boa prática."
        }
    ];

    const externalReferences = [
        { name: "Raw Accel GitHub", url: "https://github.com/a1xd/rawaccel" },
        { name: "Voltaic Aim Group (Discord de Aim)", url: "https://discord.gg/voltaic" }
    ];

    const relatedGuides = [
        {
            href: "/guias/como-escolher-mouse-gamer",
            title: "Mouse Guide",
            description: "DPI e Polling Rate explicados."
        },
        {
            href: "/guias/monitor-hz-configuracao-correta",
            title: "Monitor",
            description: "Fluidez visual ajuda no tracking."
        },
        {
            href: "/guias/valorant-reduzir-input-lag",
            title: "Valorant",
            description: "Aplique a aceleração aqui."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="60 min"
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
