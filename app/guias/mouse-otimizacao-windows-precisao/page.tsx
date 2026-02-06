import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'mouse-otimizacao-windows-precisao',
    title: "Mouse Optimization (2026): Aceleração, Polling Rate e MarkC",
    description: "Seu mouse parece 'flutuar' ou errar o alvo? Pode ser a Aceleração do Windows. Guia completo para remover aceleração e ajustar DPI/Hz para eSports.",
    category: 'hardware',
    difficulty: 'Intermediário',
    time: '20 min'
};

const title = "Precisão de Mouse 1:1 (2026): Zero Aceleração";
const description = "Para ter memória muscular consistente, o movimento do cursor deve ser idêntico ao da mão, independente da velocidade (1:1). O Windows estraga isso por padrão.";

const keywords = [
    'aprimorar precisão do ponteiro desativar ou ativar',
    'markc mouse fix windows 11 download',
    '1000hz vs 4000hz polling rate cpu usage',
    'mouse acceleration fix guide',
    'dpi ideal valorant cs2',
    'raw input mouse settings',
    'voltris optimizer input lag',
    'logitech g hub settings competitive'
];

export const metadata: Metadata = createGuideMetadata('mouse-otimizacao-windows-precisao', title, description, keywords);

export default function MouseGuide() {
    const summaryTable = [
        { label: "Aprimorar Precisão", value: "DESATIVAR (Off)" },
        { label: "Velocidade Ponteiro", value: "6/11 (Meio)" },
        { label: "Polling Rate", value: "1000Hz (Estável)" },
        { label: "DPI", value: "400/800/1600" },
        { label: "Raw Input", value: "ON (Jogos)" },
        { label: "MarkC Fix", value: "Aplicar (Regedit)" }
    ];

    const contentSections = [
        {
            title: "Introdução: O Inimigo (EPP)",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          "Aprimorar precisão do ponteiro" (Enhance Pointer Precision) é um nome mentiroso. O que ele faz é ACELERAÇÃO. Se você move o mouse rápido, o cursor anda mais. Se move devagar, anda menos. Isso impede que seu cérebro decore a distância exata para dar um flick shot.
        </p>
      `
        },
        {
            title: "Capítulo 1: Configuração do Windows",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Painel de Controle > Mouse</h4>
                <p class="text-gray-400 text-xs text-justify">
                    1. Aba "Opções do Ponteiro".
                    <br/>2. <strong>DESMARQUE</strong> "Aprimorar precisão do ponteiro".
                    <br/>3. Mantenha a velocidade no risquinho <strong>6 de 11</strong> (Exatamente no meio).
                    <br/>Se você mudar para 7/11 ou 5/11, o Windows começa a pular pixels ou interpolar, perdendo a precisão 1:1. Ajuste a velocidade pelo DPI do mouse, não pelo Windows.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: MarkC Mouse Fix (Registry)",
            content: `
        <p class="mb-4 text-gray-300">
            Alguns jogos antigos (e até alguns novos em modo janela) ainda sofrem aceleração mesmo com a opção desmarcada.
            <br/>O <strong>MarkC Mouse Fix</strong> é um arquivo de registro (.reg) que remove a curva de aceleração do Windows permanentemente, forçando uma linha reta (1:1).
            <br/>Aplique de acordo com a escala do seu display (100%, 150%, etc).
        </p>
      `
        },
        {
            title: "Capítulo 3: Polling Rate (Hz): 1000 vs 4000 vs 8000",
            content: `
        <p class="mb-4 text-gray-300">
            - <strong>1000Hz (1ms):</strong> O padrão dourado. Estável, consome pouca CPU.
            - <strong>4000Hz/8000Hz:</strong> Mais suave? Sim. Mas consome MUITA CPU. Se você tem um i5 antigo, usar 8000Hz vai fazer seu jogo travar (stutter) quando você mexer o mouse rápido.
            <br/>Recomendação: Use 1000Hz para garantir consistência, a menos que tenha um PC da NASA (i9 14900K).
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: DPI (Dots Per Inch)",
            content: `
        <p class="mb-4 text-gray-300">
            Mito: "DPI alto é mais preciso".
            <br/>Verdade: DPI alto tem menos latência de sensor, mas pega mais vibração da mão (jitter).
            <br/>- <strong>400/800 DPI:</strong> Padrão dos Pros de CS:GO/Valorant. Movimentos estáveis.
            <br/>- <strong>1600 DPI:</strong> O "Sweet Spot" moderno. Menor latência que 800, mas ainda controlável. Use sensibilidade baixa no jogo para compensar.
            <br/>- <strong>3200+ DPI:</strong> Desnecessário e pode introduzir ruído.
        </p>
      `
        },
        {
            title: "Capítulo 5: Raw Input (Entrada Bruta)",
            content: `
        <p class="mb-4 text-gray-300">
            Sempre ative <strong>Raw Input</strong> nas opções do jogo.
            <br/>Isso faz o jogo ler os dados direto do driver do mouse, ignorando as configurações do Windows (velocidade 6/11, aceleração, etc). É a forma mais segura de ter precisão.
        </p>
      `
        },
        {
            title: "Capítulo 6: Limpeza do Sensor",
            content: `
        <p class="mb-4 text-gray-300">
            Um fio de cabelo ou poeira no sensor faz a mira "girar" pro céu ou travar.
            <br/>Sopre o sensor regularmente. Use cotonete sem álcool se precisar.
            <br/>Lave seu Mousepad. Um pad sujo (com gordura da pele) muda o atrito (glide) e afeta a memória muscular.
        </p>
      `
        },
        {
            title: "Capítulo 7: Mouse Feet (Skates)",
            content: `
        <p class="mb-4 text-gray-300">
            Os pés de teflon (PTFE) gastam. Se seu mouse arranha, troque os skates (Tiger Arc, Corepad). Um deslize suave ajuda no micro-ajuste de mira.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: USB Power Saving",
            content: `
            <p class="mb-4 text-gray-300">
                O Windows desliga portas USB para economizar energia.
                <br/>Gerenciador de Dispositivos > Controladores USB > HUB Raiz USB > Gerenciamento de Energia.
                <br/>Desmarque "O computador pode desligar o dispositivo para economizar energia". Isso evita que o mouse "durma" ou desconecte por milissegundos.
            </p>
            `
        },
        {
            title: "Capítulo 9: Angle Snapping",
            content: `
            <p class="mb-4 text-gray-300">
                No software do mouse (Logitech/Razer), verifique se <strong>Angle Snapping</strong> está OFF.
                <br/>Essa função tenta fazer você desenhar linhas retas. Em jogos, isso impede que você faça micro-ajustes diagonais na cabeça do inimigo.
            </p>
            `
        },
        {
            title: "Capítulo 10: eDPI (DPI Efetivo)",
            content: `
            <p class="mb-4 text-gray-300">
                Para comparar sensibilidade com amigos:
                <br/>eDPI = DPI do Mouse * Sensibilidade no Jogo.
                <br/>Ex: 800 DPI * 1.5 Sens = 1200 eDPI.
                <br/>Use sites como "eDPI Calculator" para converter sensibilidade entre jogos diferentes (ex: de CS2 para Valorant) e manter a pegada.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Mouse sem fio (Wireless) tem lag?",
            answer: "Em 2026, não. Mouses de topo (Logitech Superlight, Razer Viper) têm latência igual ou menor que mouses com fio. A tecnologia de rádio 2.4Ghz evoluiu muito."
        },
        {
            question: "Qual o melhor mousepad: Speed ou Control?",
            answer: "Control (mais áspero) é melhor para jogos táticos (Valorant/CS) onde você precisa parar a mira no pixel. Speed (liso) é melhor para tracking (Overwatch/Apex) onde o alvo corre muito."
        }
    ];

    const externalReferences = [
        { name: "MarkC Mouse Fix", url: "https://donewmouseaccel.blogspot.com/2010/03/markc-windows-7-mouse-acceleration-fix.html" },
        { name: "Mouse Sensitivity Converter", url: "https://www.mouse-sensitivity.com/" }
    ];

    const relatedGuides = [
        {
            href: "/guias/mouse-acceleration-raw-accel-guia",
            title: "Raw Accel",
            description: "Aceleração boa (Custom)."
        },
        {
            href: "/guias/valorant-reduzir-input-lag",
            title: "Valorant",
            description: "Onde a mira importa."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="20 min"
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
