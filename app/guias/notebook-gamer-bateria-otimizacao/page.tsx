import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'notebook-gamer-bateria-otimizacao',
    title: "Notebook Gamer (2026): Como Fazer a Bateria Durar 5 Horas em Aulas",
    description: "Seu laptop gamer morre em 1 hora? Aprenda a desativar a placa de vídeo dedicada (dGPU), limitar o clock da CPU e otimizar o Windows para durar a aula toda.",
    category: 'hardware',
    difficulty: 'Intermediário',
    time: '30 min'
};

const title = "Notebook Gamer Bateria: De 1h para 5h (2026)";
const description = "Notebooks gamers são feitos para performance, não eficiência. Mas com os ajustes certos, você pode transformá-los em Ultrabooks silenciosos para estudos e trabalho.";

const keywords = [
    'notebook gamer bateria acabando rapido',
    'como desativar placa de video dedicada notebook',
    'throttlestop undervolt bateria setup',
    'limitar processador 50% bateria',
    'acer nitro 5 bateria durar mais',
    'dell g15 otimizacao bateria',
    'lenovo legion battery saver mode',
    '60hz na bateria automaticamente',
    'hibernar vs suspender notebook',
    'voltris optimizer laptop'
];

export const metadata: Metadata = createGuideMetadata('notebook-gamer-bateria-otimizacao', title, description, keywords);

export default function BatteryGuide() {
    const summaryTable = [
        { label: "Refresh Rate", value: "60Hz (Na Bateria)" },
        { label: "GPU Mode", value: "Eco / iGPU Only" },
        { label: "CPU Turbo", value: "Disabled" },
        { label: "Brilho", value: "40-50%" },
        { label: "Apps", value: "Background Off" },
        { label: "Bluetooth", value: "Off" },
        { label: "Plano Energia", value: "Eficiência" }
    ];

    const contentSections = [
        {
            title: "Introdução: O Vilão dGPU",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O maior consumidor de energia do seu notebook é a placa de vídeo dedicada (RTX 3050/4060). Mesmo parada, ela gasta bateria. O segredo é forçar o uso da placa integrada (Intel/AMD) quando fora da tomada.
        </p>
      `
        },
        {
            title: "Capítulo 1: Refresh Rate (60Hz)",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Mude para 60Hz</h4>
                <p class="text-gray-400 text-xs text-justify">
                    Telas de 144Hz/165Hz gastam 3x mais energia para atualizar os pixels.
                    <br/>Vá em Configurações > Tela > Exibição Avançada.
                    <br/>Mude para <strong>60Hz</strong> quando estiver na faculdade ou trabalho. Alguns notebooks (Asus/Razer) fazem isso automaticamente ao desconectar o cabo.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: MUX Switch e Optimus",
            content: `
        <p class="mb-4 text-gray-300">
            Abra o software do seu notebook (Armoury Crate, Dell Command, Lenovo Vantage).
            <br/>Procure por <strong>GPU Mode</strong>.
            <br/>- <strong>Ultimate/Discrete:</strong> Usa só a RTX. Gasta muita bateria.
            <br/>- <strong>Eco/Optimized/Hybrid:</strong> Desliga a RTX e usa a Intel HD. <span class="text-emerald-400">USE ESTE MODO</span> na bateria.
            <br/>Se você fechar o app que estava usando a GPU (ex: Epic Games Launcher), a RTX desliga totalmente (0W de consumo).
        </p>
      `
        },
        {
            title: "Capítulo 3: Plano de Energia e Processador",
            content: `
        <p class="mb-4 text-gray-300">
            Painel de Controle > Opções de Energia > Criar um plano de energia.
            <br/>Nomeie "Economia Máxima".
            <br/>Vá em "Alterar configurações do plano" > Avançadas.
            <br/>- <strong>Gerenciamento de energia do processador > Estado máximo:</strong> Defina para <strong>99%</strong> ou <strong>80%</strong>.
            <br/>Isso DESATIVA o Turbo Boost. Sua CPU de 4.5GHz vai rodar a 2.5GHz. Para Word/Excel é o suficiente e a CPU fica gelada (35°C), nem ligando as ventoinhas.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: ThrottleStop (Avançado)",
            content: `
        <p class="mb-4 text-gray-300">
            Baixe o <a href="https://www.techpowerup.com/download/techpowerup-throttlestop/" class="text-blue-400 hover:underline">ThrottleStop</a> (Cuidado, software avançado).
            <br/>Crie um perfil "Battery".
            <br/>Marque <strong>"Disable Turbo"</strong>.
            <br/>Aumente o <strong>Speed Shift EPP</strong> para 128 ou 200 (Quanto maior, mais o PC prioriza economia).
        </p>
      `
        },
        {
            title: "Capítulo 5: Undervolt (Se bloqueado)",
            content: `
        <p class="mb-4 text-gray-300">
            A maioria dos notebooks modernos (Intel 12th+) bloqueia undervolt.
            <br/>Mas você pode limitar o <strong>TDP (PL1/PL2)</strong>.
            <br/>No ThrottleStop, botão TPL. Baixe o "Long Power PL1" para 15W. Seu i7 vai se comportar como um i3 de ultrabook (econômico).
        </p>
      `
        },
        {
            title: "Capítulo 6: Hibernar vs Suspender",
            content: `
        <p class="mb-4 text-gray-300">
            O "Modern Standby" do Windows é bugado. O notebook acorda na mochila, esquenta e drena bateria.
            <br/>Recomendação: Use <strong>HIBERNAR</strong> em vez de Suspender ao fechar a tampa por longos períodos. O boot do SSD é rápido (10s) e hibernar gasta 0% de bateria.
        </p>
      `
        },
        {
            title: "Capítulo 7: Navegadores Eficientes",
            content: `
        <p class="mb-4 text-gray-300">
            Use o <strong>Edge</strong> com modo "Eficiência" ligado.
            <br/>Evite o Chrome cheio de extensões.
            <br/>Evite ver vídeos no YouTube em 4K na bateria (o decodificador de vídeo gasta muito). Veja em 720p ou 1080p.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: Iluminação RGB",
            content: `
            <p class="mb-4 text-gray-300">
                Desligue o teclado RGB e a luz da tampa/logo.
                <br/>LEDs consomem cerca de 1 a 3 Watts. Em uma bateria de 50Wh, isso são 20 minutos a menos de vida útil. Use as teclas Fn+Fim(ou ícone luz) para desligar.
            </p>
            `
        },
        {
            title: "Capítulo 9: Calibração de Bateria",
            content: `
            <p class="mb-4 text-gray-300">
                A cada 3 meses, deixe a bateria descarregar até 0% (desligar) e carregue até 100% sem interrupção.
                <br/>Isso recalibra o medidor do Windows para mostrar a porcentagem real e usar cada célula da bateria.
            </p>
            `
        },
        {
            title: "Capítulo 10: Bloqueador de Carga (80%)",
            content: `
            <p class="mb-4 text-gray-300">
                Se você usa o notebook 90% do tempo na tomada, ative o "Limitador de Carga" no software da fabricante (Asus Battery Health / Dell Power Manager).
                <br/>Limite a carga a 60% ou 80%. Manter a bateria em 100% o tempo todo degrada o lítio pelo calor e voltagem alta.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Jogar na bateria estraga?",
            answer: "Não estraga o hardware, mas a bateria vai durar apenas 45 minutos e a performance será reduzida pela metade (FPS baixo) porque a bateria não entrega Watts suficientes."
        },
        {
            question: "Devo tirar a bateria para jogar na tomada?",
            answer: "Não! Notebooks modernos usam a bateria como 'buffer' em picos de energia. Além disso, se faltar luz, você perde o trabalho. Deixe a bateria conectada."
        },
        {
            question: "Cooler Boost gasta bateria?",
            answer: "Sim, ventoinhas em 100% RPM (6000RPM) consomem bastante energia. No modo bateria/eco, as ventoinhas devem ficar paradas ou em baixa rotação."
        }
    ];

    const externalReferences = [
        { name: "ThrottleStop Download", url: "https://www.techpowerup.com/download/techpowerup-throttlestop/" },
        { name: "BatteryBar (Monitoramento)", url: "https://batterybarpro.com/" }
    ];

    const relatedGuides = [
        {
            href: "/guias/google-chrome-consumo-ram-fix",
            title: "Chrome",
            description: "Menos RAM = Menos energia."
        },
        {
            href: "/guias/instalacao-windows-11",
            title: "Windows Limpo",
            description: "Menos processos em background."
        },
        {
            href: "/guias/otimizacao-ssd-windows-11",
            title: "SSD",
            description: "Hibernação rápida."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="30 min"
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
