import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'como-escolher-fonte-pc-gamer',
    title: "Guia de Fontes (PSU) 2026: Tier List, 80 Plus e Potência Real",
    description: "Não exploda seu PC. Aprenda a ler a PSU Tier List, entender por que 80 Plus White não garante qualidade e calcular a potência necessária para RTX 4000/5000.",
    category: 'hardware',
    difficulty: 'Intermediário',
    time: '20 min'
};

const title = "Fonte de Alimentação (PSU): O Coração do PC Gamer (Guia 2026)";
const description = "Economizar na fonte é o erro mais caro que você pode cometer. Entenda sobre capacitores japoneses, trilhos 12V e a infame 'PSU Tier List'.";

const keywords = [
    'calculadora fonte pc gamer 2026',
    '80 plus bronze vs gold vale a pena',
    'psu tier list cultists network 2026',
    'fonte bomba marcas evitar',
    'qual fonte para rtx 4060 4070',
    'modular vs semi modular vs não modular'
];

export const metadata: Metadata = createGuideMetadata('como-escolher-fonte-pc-gamer', title, description, keywords);

export default function PSUGuide() {
    const summaryTable = [
        { label: "Selo Mínimo", value: "80 Plus Bronze" },
        { label: "Confiança", value: "PSU Tier List (Tier C+)" },
        { label: "PFC", value: "Ativo (Obrigatório)" },
        { label: "Marcas Boas", value: "Corsair, XPG, MSI" },
        { label: "Estabilizador", value: "JAMAIS USE" },
        { label: "Filtro de Linha", value: "Clamper (Recomendado)" },
        { label: "Potência Margem", value: "+100W/150W" }
    ];

    const contentSections = [
        {
            title: "A Mentira do 'Potência Real'",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          No Brasil, existe o mito da "Potência Real". Fontes genéricas dizem ter 500W, mas entregam 200W com ruído elétrico que mata seu SSD aos poucos.
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed">
          <strong>Regra de Ouro:</strong> Nunca confie apenas na etiqueta de Watts. Olhe a etiqueta lateral: a potência TEM que estar quase toda na linha de <strong>+12V</strong>. Se a fonte diz 500W mas tem 300W na linha de 12V e 200W na linha de 5V/3.3V, é uma fonte de projeto antigo e perigosa.
        </p>

        <div class="bg-red-900/10 p-5 rounded-xl border border-red-500/20 my-8">
            <h4 class="text-rose-400 font-bold mb-3 flex items-center gap-2">
                <span class="text-xl">💣</span> Pare de usar Estabilizador!
            </h4>
            <p class="text-gray-300 mb-4">
                Estabilizadores foram feitos para TVs de tubo dos anos 80. Fontes modernas têm PFC Ativo que corrige a voltagem em microssegundos (Full Range 90V-240V). O estabilizador é lento (tlec-tlec), e quando ele "corrige", a fonte já corrigiu, criando um surto duplo que queima a fonte.
            </p>
            <p class="text-white font-bold">Use um Filtro de Linha (iClamper) ou direto na tomada.</p>
        </div>
      `
        },
        {
            title: "O que é a PSU Tier List?",
            content: `
        <p class="mb-4 text-gray-300">
            É uma comunidade global de engenheiros que abre fontes e testa componentes. Eles classificam em Tiers:
        </p>
        <ul class="list-none text-gray-300 space-y-3 ml-4">
            <li class="p-2 border-l-4 border-emerald-500 bg-emerald-900/10"><strong>Tier A (High-End):</strong> Para RTX 4080/4090 e Overclock pesado. (Ex: Corsair RMx, XPG Core Reactor).</li>
            <li class="p-2 border-l-4 border-yellow-500 bg-yellow-900/10"><strong>Tier B (Mid-Range):</strong> Ótimo para a maioria dos gamers. (Ex: MSI MAG A650BN, Cooler Master MWE Bronze V2).</li>
            <li class="p-2 border-l-4 border-orange-500 bg-orange-900/10"><strong>Tier C (Low-End):</strong> Aceitável para PCs de entrada (iGPU, RX 6600).</li>
            <li class="p-2 border-l-4 border-red-500 bg-red-900/10"><strong>Tier E (Avoid):</strong> Evite. Risco de falha.</li>
            <li class="p-2 border-l-4 border-red-700 bg-red-950/30"><strong>Tier F (Replace Immediately):</strong> Troque imediatamente. Risco de fogo. Fontes genéricas "Gamer" baratas.</li>
        </ul>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "80 Plus: Bronze, Gold ou Platinum?",
            content: `
            <div class="bg-gray-800/50 p-6 rounded-xl border border-gray-700 mb-8">
                <h4 class="text-white font-bold mb-4 text-xl">80 Plus mede eficiência, não qualidade</h4>
                <p class="text-gray-300 mb-4">
                    Ter selo 80 Plus significa apenas que a fonte desperdiça menos energia em forma de calor.
                </p>
                <p class="text-gray-300 text-sm">
                    Uma fonte pode ser 80 Plus Gold e ter capacitores ruins que explodem em 1 ano. Uma fonte pode ser 80 Plus White e durar 10 anos.
                    <br/><br/>
                    <strong>Geralmente:</strong>
                    <br/>- 80 Plus White/Bronze: Projetos de entrada.
                    <br/>- 80 Plus Gold: Projetos modernos (DC-DC LLC), geralmente melhores.
                </p>
            </div>
            `
        },
        {
            title: "Calculando Watts: Quanto eu preciso?",
            content: `
            <p class="mb-4 text-gray-300">
                Some o TDP do processador + TDP da GPU + 100W (resto do sistema).
                <br/>Exemplo: i5 12400F (65W) + RTX 4060 (115W) + 100W = 280W.
                <br/>Uma fonte de <strong>450W ou 500W</strong> sobra com folga.
                <br/>Comprar uma fonte de 850W para esse setup é jogar dinheiro fora (a eficiência da fonte é pior em baixa carga). Tente manter o consumo entre 40% e 60% da capacidade da fonte para eficiência máxima.
            </p>
            `
        }
    ];

    const additionalContentSections = [
        {
            title: "Modular vs Semi vs Non-Modular",
            content: `
            <p class="mb-4 text-gray-300">
                <strong>Non-Modular:</strong> Todos os cabos presos. Fica uma macarronada no gabinete. Barato.
                <br/><strong>Semi-Modular:</strong> Cabo principal (Placa-mãe) preso, cabos de GPU/SATA soltos. Melhor custo-benefício.
                <br/><strong>Full Modular:</strong> Tudo solto. Estética perfeita. Caro.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Fonte bivolt automática ou com chave?",
            answer: "FUJA de fontes com chave seletora de voltagem (110v/220v). Isso é sinal de projeto arcaico sem PFC Ativo. Fontes boas são Bivolt Automático (Full Range)."
        },
        {
            question: "Posso usar adaptador Molex para GPU?",
            answer: "NUNCA. Se a fonte não tem o cabo PCIe (6+2 pinos) necessário, é porque ela não foi projetada para aguentar a carga. Usar adaptadores Molex-to-PCIe derrete o fio e causa incêndio."
        }
    ];

    const externalReferences = [
        { name: "PSU Tier List (Cultists Network)", url: "https://cultists.network/140/psu-tier-list/" },
        { name: "OuterVision Power Supply Calculator", url: "https://outervision.com/power-supply-calculator" }
    ];

    const relatedGuides = [
        {
            href: "/guias/como-resolver-tela-azul",
            title: "Tela Azul",
            description: "Fontes ruins causam instabilidade e resets."
        },
        {
            href: "/guias/water-cooler-vs-air-cooler",
            title: "Resfriamento",
            description: "Componentes frios consomem menos energia."
        },
        {
            href: "/guias/nvidia-painel-controle-melhores-configuracoes",
            title: "Otimização GPU",
            description: "Reduzir consumo via Undervolt."
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
