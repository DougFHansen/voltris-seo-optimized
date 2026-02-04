import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Montagem de PC Gamer: Os 7 erros que podem queimar tudo";
const description = "Vai montar seu primeiro PC? Evite os erros fatais como esquecer o espelho da placa-mãe, ligar cabos errado ou usar a fonte de cabeça para baixo.";
const keywords = [
    'erros comuns montagem pc gamer 2026',
    'como montar pc gamer do zero tutorial seguro',
    'pc nao liga depois de montar o que fazer',
    'esquecer de tirar plastico do cooler processador',
    'onde ligar cabos do painel frontal placa mae'
];

export const metadata: Metadata = createGuideMetadata('montagem-pc-gamer-erros-comuns', title, description, keywords);

export default function PCMisteryGuide() {
    const summaryTable = [
        { label: "Erro #1", value: "Plástico protetor no dissipador" },
        { label: "Erro #2", value: "Memória RAM no slot errado (Single Channel)" },
        { label: "Erro #3", value: "Monitor ligado na Placa-mãe (em vez da GPU)" },
        { label: "Dificuldade", value: "Alta" }
    ];

    const contentSections = [
        {
            title: "O frio na barriga de montar um PC",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Montar um PC é como um quebra-cabeça caro. A maioria das peças só encaixa de um jeito, mas existem armadilhas silenciosas que podem fazer você perder horas tentando descobrir por que o computador não dá imagem ou por que ele desliga após 2 minutos.
        </p>
      `
        },
        {
            title: "1. O Plástico Invisível do Cooler",
            content: `
        <p class="mb-4 text-gray-300">Este é o erro campeão de 2026:</p>
        <div class="bg-red-900/10 p-5 rounded-xl border border-red-500/30">
            <p class="text-sm text-gray-300">
                Quase todo cooler (Air Cooler ou Water Cooler) vem com um adesivo transparente na base de metal. Se você esquecer de tirar e aplicar a pasta térmica por cima, o calor não será transferido. O PC vai ligar e desligar em segundos para não derreter o processador. <strong>Sempre verifique a base do metal!</strong>
            </p>
        </div>
      `
        },
        {
            title: "2. Dual Channel: Não desperdice sua RAM",
            content: `
        <p class="mb-4 text-gray-300">
            Se sua placa-mãe tem 4 slots e você tem 2 pentes de memória, eles <strong>NUNCA</strong> devem ser colocados um grudado no outro.
            <br/><br/>Para ativar o Dual Channel (dobro de velocidade de comunicação), você deve pular um slot (ex: Slots 2 e 4). Verifique o manual da sua placa-mãe, mas 90% das vezes é o segundo e o quarto slot contando a partir do processador.
        </p>
      `
        },
        {
            title: "3. Onde ligar o cabo HDMI/DisplayPort?",
            content: `
        <p class="mb-4 text-gray-300">
            Parece óbvio, mas acontece muito: Se você tem uma Placa de Vídeo dedicada, o cabo do monitor <strong>DEVE</strong> ser ligado nela (nas saídas horizontais mais abaixo). Se você ligar na saída vertical da placa-mãe, o PC vai tentar rodar o jogo pelo processador, resultando em 5 FPS ou tela preta.
        </p>
      `
        },
        {
            title: "4. Espaçadores do Gabinete",
            content: `
        <p class="mb-4 text-gray-300">
            Nunca parafuse a placa-mãe direto na chapa de metal do gabinete. Você precisa usar os "Standoffs" (espaçadores dourados). Sem eles, os contatos elétricos da placa-mãe encostam no metal do gabinete e causam um <strong>curto-circuito</strong> que pode matar todas as suas peças instantaneamente.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/diagnostico-hardware",
            title: "Diagnóstico Hardware",
            description: "Saiba identificar qual peça falhou."
        },
        {
            href: "/guias/gabinete-gamer-airflow-importancia",
            title: "Airflow Gabinete",
            description: "Posicione as ventoinhas do jeito certo."
        },
        {
            href: "/guias/importancia-pasta-termica-pc",
            title: "Pasta Térmica",
            description: "Como aplicar na montagem."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="1 hora"
            difficultyLevel="Avançado"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
