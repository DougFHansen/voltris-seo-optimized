import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'otimizacoes-para-notebook-gamer',
    title: "Otimização de Notebook Gamer: Performance Máxima e Bateria (2026)",
    description: "Notebook esquentando e perdendo FPS? Aprenda a configurar o Painel de Controle de Energia, evitar o Thermal Throttling e usar a GPU Dedicada (MUX Switch) corretamente.",
    category: 'otimizacao',
    difficulty: 'Intermediário',
    time: '40 min'
};

const title = "Notebook Gamer Lento? Guia Completo de Otimização Térmica e Energia (2026)";
const description = "Notebooks sofrem com calor. Descubra como fazer Undervolt, usar bases refrigeradas e configurar o Windows para parar de limitar seu processador.";

const keywords = [
    'otimizar notebook gamer windows 11',
    'notebook gamer esquentando muito o que fazer',
    'thermal throttling notebook fix',
    'como ativar mux switch nitro 5 dell g15',
    'undervolt throttlestop tutorial 2026',
    'plano de energia alto desempenho sumiu',
    'notebook gamer fps baixo na bateria',
    'limitar fps notebook rivatuner'
];

export const metadata: Metadata = createGuideMetadata('otimizacoes-para-notebook-gamer', title, description, keywords);

export default function LaptopGuide() {
    const summaryTable = [
        { label: "Maior Inimigo", value: "Calor (Thermal Throttling)" },
        { label: "Energia", value: "Sempre na Tomada para Jogar" },
        { label: "Ferramenta", value: "ThrottleStop / Ryzen Controller" },
        { label: "GPU", value: "Force a Dedicada (Nvidia)" },
        { label: "Base", value: "Cooler Base é Recomendado" },
        { label: "Bateria", value: "Modo Conservação (60-80%)" }
    ];

    const contentSections = [
        {
            title: "A Regra de Ouro: Energia e Calor",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Diferente de um Desktop, um notebook gamer é limitado por dois fatores: quanto calor ele consegue dissipar e quanta energia a fonte entrega. Se você tentar jogar na bateria, o desempenho cairá 70% automaticamente para proteger a célula de lítio. <strong>Sempre jogue conectado à tomada.</strong>
        </p>

        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20 my-8">
            <h4 class="text-[#31A8FF] font-bold mb-3 flex items-center gap-2">
                <span class="text-xl">🔋</span> Plano de Energia Gamer Voltris
            </h4>
            <p class="text-gray-300 mb-4">
                O "Alto Desempenho" do Windows nem sempre é o ideal para notebooks, pois faz a CPU rodar no clock máximo mesmo parada, gerando calor inútil. O <strong>Voltris Optimizer</strong> instala um Power Plan personalizado que libera o Turbo Boost instantaneamente apenas nos jogos, mantendo o notebook frio no desktop.
            </p>
            <a href="/voltrisoptimizer" class="group relative inline-flex px-8 py-3 bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-white font-bold text-base rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-[1.03] hover:shadow-[0_0_60px_rgba(139,49,255,0.4)] items-center justify-center gap-2">
                Baixar Power Plan
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
            </a>
        </div>
      `
        },
        {
            title: "Passo 1: Forçando a GPU Dedicada (MUX Switch)",
            content: `
        <p class="mb-4 text-gray-300">
            Muitos notebooks usam a GPU integrada (Intel/AMD) para exibir a imagem na tela, mesmo processando o jogo na GPU dedicada (Nvidia), o que cria um gargalo (Optimus).
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4 bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
            <li>Se seu notebook tem <strong>MUX Switch</strong> (Acer Nitro 5 modernos, Dell G15, Legion), abra o software da fabricante (Armoury Crate, NitroSense).</li>
            <li>Procure por "Modo GPU", "Discrete Graphics" ou "MUX Switch".</li>
            <li>Ative a opção "Somente GPU Dedicada" (Pode pedir reinício).</li>
            <li><strong>Ganho:</strong> +15% a +30% FPS em jogos competitivos (Valorant, CS2).</li>
            <li>Se não tiver MUX Switch, conecte um monitor externo na porta HDMI/DisplayPort. Geralmente a porta externa é ligada direto na placa dedicada.</li>
        </ol>
      `
        },
        {
            title: "Passo 2: Evitando Thermal Throttling (Troque a Pasta)",
            content: `
        <p class="mb-4 text-gray-300">
            Se o processador bate 95°C ou 100°C, ele reduz a velocidade (de 4.0GHz para 2.5GHz) para não queimar. Isso causa travadas bruscas no jogo.
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
            <li><strong>Levante a traseira:</strong> Coloque um livro (não cobrindo as saídas de ar) ou use um suporte para elevar a parte de trás do notebook em 5cm. Isso melhora o fluxo de ar drasticamente.</li>
            <li><strong>Limpeza:</strong> Se o notebook tem mais de 1 ano, abra e limpe a poeira dos fans. A poeira bloqueia o dissipador.</li>
            <li><strong>Pasta Térmica:</strong> A pasta de fábrica geralmente é ruim. Troque por uma decente (Honeywell PTM7950 ou MasterGel Maker). Notebooks exigem pastas viscosas (pump-out effect).</li>
        </ul>
      `
        },
        {
            title: "Passo 3: Configuração do Windows Gráfico",
            content: `
        <p class="mb-4 text-gray-300">
            Garanta que o jogo use a placa certa.
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-2 ml-4">
            <li>Configurações > Sistema > Tela > Elementos Gráficos.</li>
            <li>Em "Apps da área de trabalho", clique em Procurar.</li>
            <li>Selecione o executável do jogo (ex: valorant-win64-shipping.exe).</li>
            <li>Clique no jogo na lista > Opções > <strong>Alto Desempenho (GPU Nvidia/AMD)</strong>.</li>
        </ol>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Undervolt: Menos Voltagem, Mesmo Desempenho",
            content: `
            <div class="bg-gray-800/50 p-6 rounded-xl border border-gray-700 mb-8">
                <h4 class="text-green-400 font-bold mb-4 text-xl">ThrottleStop (Intel) / Ryzen Controller (AMD)</h4>
                <p class="text-gray-300 mb-4">
                    Undervolt é reduzir a voltagem que a CPU recebe. Isso reduz a temperatura em 10°C sem perder performance. Infelizmente, fabricantes como Dell e HP bloquearam isso na BIOS das gerações 12ª/13ª Intel.
                </p>
                <p class="text-gray-300 text-sm">
                    Se sua CPU for 10ª ou 11ª geração, ou AMD Ryzen 5000: Baixe o ThrottleStop. Reduza o "CPU Core" e "CPU Cache" offset em -50mV. Teste. Se estável, tente -80mV.
                </p>
            </div>
            `
        }
    ];

    const additionalContentSections = [
        {
            title: "Bateria Inchada? Modo Conservação",
            content: `
            <div class="space-y-4">
                <div class="bg-gray-800 p-4 rounded-lg">
                    <h5 class="text-orange-400 font-bold mb-2">Limite de Carga</h5>
                    <p class="text-gray-300 text-sm">
                        Deixar o notebook 100% carregado na tomada o tempo todo degrada a bateria e pode fazê-la estufar. Ative o "Modo Conservação" no software da fabricante (MyAsus, Lenovo Vantage, Dell Power Manager) para limitar a carga em 60% ou 80%. Isso triplica a vida útil da bateria.
                    </p>
                </div>
            </div>
            `
        }
    ];

    const faqItems = [
        {
            question: "Jogar com monitor externo aumenta FPS?",
            answer: "Na maioria dos notebooks sim, pois contorna o Gargalo do Optimus (a imagem sai direto da placa dedicada para o monitor, sem passar pela integrada). O ganho é de 10-15%."
        },
        {
            question: "Posso fechar a tampa enquanto jogo no monitor externo?",
            answer: "Cuidado. Muitos notebooks (como Macbook e alguns Dell) usam o teclado para admitir ar ou dissipar calor passivamente. Fechar a tampa pode abafar o sistema. Monitore as temperaturas. Se subir, deixe aberto."
        },
        {
            question: "Cooler Booster (Fan no máximo) estraga o fan?",
            answer: "Fans são peças mecânicas baratas e fáceis de trocar. É muito melhor gastar o fan (R$ 50) do que cozinhar sua GPU (R$ 3000). Use os fans no máximo durante a jogatina pesada sem dó."
        }
    ];

    const externalReferences = [
        { name: "ThrottleStop Download", url: "https://www.techpowerup.com/download/techpowerup-throttlestop/" },
        { name: "Ryzen Controller", url: "https://ryzencontroller.com/" }
    ];

    const relatedGuides = [
        {
            href: "/guias/undervolt-cpu-notebook",
            title: "Tutorial Undervolt",
            description: "Passo a passo detalhado do ThrottleStop."
        },
        {
            href: "/guias/monitorar-temperatura-pc",
            title: "Monitorar Temperatura",
            description: "Como usar MSI Afterburner para ver os graus no jogo."
        },
        {
            href: "/guias/saude-bateria-notebook",
            title: "Verificar Bateria",
            description: "Use o comando battery-report do Windows."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="40 min"
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
