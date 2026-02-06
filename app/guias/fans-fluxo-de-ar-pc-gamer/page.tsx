import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'fans-fluxo-de-ar-pc-gamer',
    title: "Fluxo de Ar (Airflow) PC Gamer: Pressão Positiva vs Negativa",
    description: "Seu PC é um forno? Aprenda a posicionar as ventoinhas (Fans) corretamente para criar um túnel de vento e evitar poeira.",
    category: 'hardware',
    difficulty: 'Iniciante',
    time: '15 min'
};

const title = "Engenharia de Airflow: Como resfriar seu PC corretamente";
const description = "Colocar ventoinha em todo lugar não ajuda. Você precisa direcionar o ar. Entenda a física da Pressão Positiva vs Negativa.";

const keywords = [
    'como instalar fans pc gamer posição correta',
    'frente joga ar ou tira',
    'pressão positiva vs negativa poeira',
    'melhor posição water cooler topo ou frente',
    'gabinete mesh vs vidro temperado temperatura',
    'fan cfm vs pressão estática diferença'
];

export const metadata: Metadata = createGuideMetadata('fans-fluxo-de-ar-pc-gamer', title, description, keywords);

export default function FansGuide() {
    const summaryTable = [
        { label: "Frente", value: "Entrada (Intake)" },
        { label: "Trás", value: "Saída (Exhaust)" },
        { label: "Topo", value: "Saída (Exhaust)" },
        { label: "Fundo", value: "Entrada (Opcional)" },
        { label: "Pressão Ideal", value: "Levemente Positiva" },
        { label: "Benefício", value: "Menos Poeira" },
        { label: "Gabinete", value: "Frente em Mesh" }
    ];

    const contentSections = [
        {
            title: "Regra Básica de Física (Ar Quente Sobe)",
            content: `
        <p class="mb-4 text-gray-300">
            A orientação das ventoinhas é vital. A parte "bonita" da ventoinha (sem grade/fios) geralmente é por onde o ar ENTRA. A parte "feia" (com a estrutura do motor e fios) é por onde o ar SAI.
        </p>
        <div class="bg-[#0A0A0F] p-5 rounded-xl border border-white/5">
            <h4 class="text-[#31A8FF] font-bold mb-3">O Setup Padrão (Eficaz):</h4>
            <ul class="list-disc ml-4 text-gray-300 space-y-2">
                <li><strong>Frente:</strong> 2 ou 3 fans jogando ar FRIO para DENTRO (Admissão).</li>
                <li><strong>Traseira:</strong> 1 fan jogando ar QUENTE para FORA (Exaustão).</li>
                <li><strong>Topo:</strong> 1 ou 2 fans jogando ar QUENTE para FORA (Exaustão). O ar quente sobe naturalmente. Ajude ele a sair.</li>
            </ul>
        </div>
      `
        },
        {
            title: "Pressão Positiva vs Negativa: A Guerra da Poeira",
            content: `
        <p class="mb-4 text-gray-300">
            Isso define quanto tempo você leva até precisar limpar o PC.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="bg-emerald-900/10 p-4 rounded-xl border border-emerald-500/20">
                <h4 class="text-emerald-400 font-bold mb-2">Pressão Positiva (Recomendado)</h4>
                <p class="text-sm text-gray-300">
                    Mais ar entrando do que saindo.
                    <br/>Ex: 3 fans na frente entrando, 1 atrás saindo.
                    <br/><strong>Efeito:</strong> O ar extra tenta escapar por todas as frestas do gabinete, impedindo que a poeira entre pelos buracos sem filtro. O ar só entra pelos filtros da frente. PC limpo por mais tempo.
                </p>
            </div>
            <div class="bg-red-900/10 p-4 rounded-xl border border-red-500/20">
                <h4 class="text-red-400 font-bold mb-2">Pressão Negativa</h4>
                <p class="text-sm text-gray-300">
                    Mais ar saindo do que entrando.
                    <br/>Ex: 1 entrando, 3 saindo.
                    <br/><strong>Efeito:</strong> Cria um vácuo. O ar é sugado por todas as frestas, furos PCIe e buracos sem filtro para compensar. Seu PC vira um aspirador de pó.
                </p>
            </div>
        </div>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "CFM (Fluxo) vs Pressão Estática",
            content: `
            <div class="bg-gray-800/50 p-6 rounded-xl border border-gray-700 mb-8">
                <h4 class="text-white font-bold mb-4 text-xl">Nem toda Fan é igual</h4>
                <ul class="list-disc list-inside text-gray-300 text-sm space-y-3">
                    <li><strong>Fans de Alto Fluxo (High Airflow / CFM):</strong> Para gabinete (exaustão). Movem muito ar se não tiver nada na frente.</li>
                    <li><strong>Fans de Pressão Estática (Static Pressure):</strong> Para Radiadores ou grades fechadas. Elas têm pás largas e "empurram" o ar com força através de obstruções (dissipadores).</li>
                </ul>
                <p class="text-gray-400 text-xs mt-3">
                    Se você colocar uma fan de fluxo fraco num radiador de water cooler, o ar não passa e a CPU ferve.
                </p>
            </div>
            `
        },
        {
            title: "Gabinete Aquário vs Mesh",
            content: `
            <p class="mb-4 text-gray-300">
                Gabinetes "Aquário" (vidro na frente e lado) são lindos, mas limitam a entrada de ar. Neles, as fans laterais e de baixo são CRUCIAIS para admissão.
                <br/>Gabinetes "Mesh" (frente furada em grade) são os reis da performance. O ar entra direto. Se sua prioridade é temperatura baixa, compre Mesh.
            </p>
            `
        }
    ];

    const additionalContentSections = [
        {
            title: "Hubs e Controladoras",
            content: `
            <p class="mb-4 text-gray-300">
                Se sua placa mãe não tem conectores suficientes (SYS_FAN), use um <strong>Fan Hub PWM</strong>.
                <br/>Conecte o Hub na placa mãe (CPU_FAN ou SYS_FAN) e ligue todas as fans no Hub. A placa mãe controlará a velocidade de todas juntas. Evite ligar fans direto na fonte (Molex), pois elas rodarão a 100% o tempo todo, parecendo um avião.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Posso colocar fan em cima da fonte (PSU Shroud)?",
            answer: "Geralmente não ajuda muito, a menos que seu gabinete tenha furos ali e a GPU esteja muito quente. Elas puxam ar de baixo do gabinete (verifique se tem filtro embaixo) e jogam direto na GPU. É válido para ajudar placas de vídeo quentes."
        },
        {
            question: "Tamanho importa? 120mm vs 140mm",
            answer: "Sim. 140mm move mais ar girando mais devagar (menos barulho). Se seu gabinete suporta 140mm na frente, dê preferência. É mais eficiente."
        }
    ];

    const externalReferences = [
        { name: "Gamers Nexus Airflow Guide", url: "https://www.youtube.com/watch?v=YDCMMf-_ASE" },
        { name: "Fan Setup Diagram", url: "https://landing.coolermaster.com/pages/airflow-guide/" }
    ];

    const relatedGuides = [
        {
            href: "/guias/water-cooler-vs-air-cooler",
            title: "Escolha seu Cooler",
            description: "Cooler precisa de ar fresco para funcionar."
        },
        {
            href: "/guias/monitorar-temperatura-pc",
            title: "Monitoramento",
            description: "Verifique se o airflow está funcionando."
        },
        {
            href: "/guias/limpeza-fisica-pc-gamer",
            title: "Limpeza",
            description: "Tire a poeira dos filtros regularmente."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="15 min"
            difficultyLevel="Iniciante"
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
