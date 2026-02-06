import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'water-cooler-vs-air-cooler',
    title: "Air Cooler vs Water Cooler 2026: Qual escolher para seu CPU?",
    description: "Water Cooler de 240mm ou um Air Cooler parrudo? Entenda sobre eficiência térmica, risco de vazamento, ruído de bomba e manutenção.",
    category: 'hardware',
    difficulty: 'Intermediário',
    time: '15 min'
};

const title = "Air Cooler vs Water Cooler (AIO): O Guia Definitivo de Temperatura";
const description = "Muitos compram Water Cooler por estética e se arrependem com bomba barulhenta. Descubra quando o Air Cooler é, na verdade, superior.";

const keywords = [
    'water cooler vs air cooler durabilidade',
    'air cooler noctua deepcool ag400 ak400 review',
    'water cooler vaza riscos',
    'rise mode water cooler bomba barulho',
    'ryzen 5700x3d esquenta muito qual cooler',
    'pasta térmica qual a melhor'
];

export const metadata: Metadata = createGuideMetadata('water-cooler-vs-air-cooler', title, description, keywords);

export default function CoolerGuide() {
    const summaryTable = [
        { label: "Custo x Benefício", value: "Air Cooler" },
        { label: "Estética", value: "Water Cooler" },
        { label: "Durabilidade", value: "Air Cooler (Eterno)" },
        { label: "Performance Extrema", value: "Water Cooler 360mm" },
        { label: "Ruído", value: "Air Cooler (Mais baixo)" },
        { label: "Manutenção", value: "Air Cooler (Fácil)" },
        { label: "Risco", value: "WC (Vazamento/Bomba)" }
    ];

    const contentSections = [
        {
            title: "O Mito: Water Cooler é sempre melhor?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Não. Um bom Air Cooler (torre de ar) de R$ 200,00 muitas vezes ganha de Water Coolers de entrada de 120mm ou 240mm baratos.
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed">
           Water Coolers baratos têm bombas fracas e barulhentas. Além disso, a água evapora (permeação) ao longo de 3-5 anos, perdendo eficiência. O Air Cooler é apenas metal e ventoinha: nunca estraga. Se a ventoinha parar, você troca por R$ 30,00 e o dissipador continua lá para sempre.
        </p>

        <div class="bg-[#0A0A0F] p-5 rounded-xl border border-white/5">
            <h4 class="text-[#31A8FF] font-bold mb-3">Quando usar o quê?</h4>
            <ul class="list-disc leading-relaxed ml-4 text-gray-300">
                <li><strong>Ryzen 5 / i5 (65W):</strong> Use Air Cooler (Ex: DeepCool AK400/AG400). É barato, silencioso e sobra desempenho. Gastar com WC aqui é estética.</li>
                <li><strong>Ryzen 7 / i7 (105W+):</strong> Air Cooler Dual Tower (AK620) ou Water Cooler 240mm/360mm de marca boa.</li>
                <li><strong>i9 / Ryzen 9 (High End):</strong> Aqui o Water Cooler 360mm ou 420mm é obrigatório, pois Air Coolers não conseguem dissipar 250W+ de calor rapidamente.</li>
            </ul>
        </div>
      `
        },
        {
            title: "Instalação e Posição do Radiador",
            content: `
        <p class="mb-4 text-gray-300">
            Se você escolheu Water Cooler, a posição importa MUITO para a vida útil da bomba.
        </p>
        <div class="bg-gray-800/50 p-4 rounded-lg font-mono text-sm border border-gray-700">
            <p class="text-emerald-400 font-bold">Posições Corretas:</p>
            <ul class="list-disc ml-6 text-gray-300">
                <li><strong>Topo (Exaustão):</strong> A melhor. O ar quente sobe, e as bolhas de ar ficam presas no radiador, longe da bomba.</li>
                <li><strong>Frente (Admissão):</strong> Mangueiras para BAIXO (Ideal), ou para CIMA (desde que o topo do radiador esteja acima da bomba).</li>
            </ul>
            <p class="text-rose-400 font-bold mt-4">Posição PROIBIDA:</p>
            <ul class="list-disc ml-6 text-gray-300">
                <li><strong>Embaixo (Chão):</strong> A bomba fica no ponto mais alto do loop. O ar sobe para a bomba, ela roda a seco, faz barulho de aquário e queima em 6 meses.</li>
            </ul>
        </div>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Pasta Térmica: A Grande Diferença",
            content: `
            <div class="bg-gray-800/50 p-6 rounded-xl border border-gray-700 mb-8">
                <h4 class="text-white font-bold mb-4 text-xl">Não use pasta de dente!</h4>
                <p class="text-gray-300 mb-4">
                    A pasta térmica que vem pré-aplicada em Coolers de marca (Corsair, DeepCool) é ótima. Não precisa trocar.
                </p>
                <p class="text-gray-300 text-sm">
                    Agora, se você comprou um cooler "White Label" chinês ou está fazendo manutenção após 2 anos, compre uma pasta de prata ou cerâmica decente (Ex: SnowDog, Artic MX-4).
                    <br/>A diferença entre uma pasta ruim e uma boa pode ser de 5°C a 10°C.
                    <br/><strong>Método de aplicação:</strong> Um ponto no meio (Ervilha) ou um X. Não espalhe com o dedo (gordura da pele estraga a condutividade). Deixe a pressão do cooler espalhar.
                </p>
            </div>
            `
        },
        {
            title: "Curva de Fan (Fan Curve)",
            content: `
            <p class="mb-4 text-gray-300">
                Seu PC parece um turbina? Ajuste a curva na BIOS.
                <br/>Não faz sentido a ventoinha ir a 100% quando a CPU está a 50°C (abrindo navegador).
                <br/>Configure para ficar silencioso (30-40%) até 65°C, e só acelerar de verdade quando passar de 75°C (jogando). Isso salva seus ouvidos.
            </p>
            `
        }
    ];

    const additionalContentSections = [
        {
            title: "Manutenção",
            content: `
            <p class="mb-4 text-gray-300">
                <strong>Air Cooler:</strong> Limpar a poeira com pincel a cada 6 meses.
                <br/><strong>Water Cooler:</strong> Limpar a poeira do radiador (vire o ar comprimido ou secador frio). Verifique barulhos na bomba. Se a bomba fizer barulho de "areia", está morrendo.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Air Cooler entorta a placa mãe?",
            answer: "Modelos gigantes (Dual Tower de 1kg) podem forçar sim. Verifique se sua placa mãe tem reforço ou use um suporte (GPU Holder) adaptado se sentir que está envergando."
        },
        {
            question: "Water Cooler Custom vale a pena?",
            answer: "Apenas para entusiastas ricos. O custo é 10x maior, o risco de vazamento é alto se você montar errado, e a manutenção é chata (drenar fluido anualmente). Para 99.9% das pessoas, AIO (All-In-One) selado ou Air Cooler é o caminho."
        }
    ];

    const externalReferences = [
        { name: "Gamers Nexus Cooler Reviews", url: "https://www.youtube.com/user/GamersNexus" },
        { name: "Noctua Cooling Guide", url: "https://noctua.at/" }
    ];

    const relatedGuides = [
        {
            href: "/guias/monitorar-temperatura-pc",
            title: "Monitorar Temperatura",
            description: "Saiba se seu cooler está funcionando."
        },
        {
            href: "/guias/fans-fluxo-de-ar-pc-gamer",
            title: "Fluxo de Ar",
            description: "Não adianta cooler bom em gabinete estufa."
        },
        {
            href: "/guias/como-escolher-fonte-pc-gamer",
            title: "Fonte",
            description: "Fans e bombas consomem energia."
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
