import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'importancia-pasta-termica-pc',
  title: "Pasta Térmica: Tudo o que você precisa saber (Guia 2026)",
  description: "Seu PC está se desligando sozinho? Saiba quando trocar a pasta térmica, qual a melhor marca e como aplicar corretamente para reduzir a temperatura.",
  category: 'windows-geral',
  difficulty: 'Intermediário',
  time: '30 min'
};

const title = "Pasta Térmica: Tudo o que você precisa saber (Guia 2026)";
const description = "Seu PC está se desligando sozinho? Saiba quando trocar a pasta térmica, qual a melhor marca e como aplicar corretamente para reduzir a temperatura.";
const keywords = [
    'quando trocar pasta térmica pc gamer 2026',
    'melhor pasta térmica condutividade 2026',
    'como aplicar pasta térmica processador tutorial',
    'pc desligando sozinho temperatura alta fix',
    'pasta termica prata vs branca diferença'
];

export const metadata: Metadata = createGuideMetadata('importancia-pasta-termica-pc', title, description, keywords);

export default function ThermalPasteGuide() {
    const summaryTable = [
        { label: "Frequência de Troca", value: "1 a 2 anos (Uso Gamer)" },
        { label: "Melhores Marcas", value: "Arctic, Noctua, Thermal Grizzly" },
        { label: "Modo de Aplicação", value: "Gota central ou 'X'" },
        { label: "Dificuldade", value: "Média" }
    ];

    const contentSections = [
        {
            title: "O que é Pasta Térmica e por que ela seca?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Embora o topo do seu processador e a base do seu cooler pareçam lisos, eles possuem micro-furos invisíveis ao olho humano. A **Pasta Térmica** serve para preencher esses buracos, garantindo que o calor passe do chip para o metal do cooler. Com o tempo, os óleos da pasta evaporam, ela fica "seca" e quebradiça, perdendo a capacidade de conduzir calor.
        </p>
      `
        },
        {
            title: "1. Prata vs Branca: Qual a diferença?",
            content: `
        <p class="mb-4 text-gray-300">Ao comprar, você encontrará dois tipos básicos:</p>
        <ul class="list-disc list-inside text-gray-300 space-y-3">
            <li><strong>Pasta Branca (Silicone):</strong> Barata e simples. Indicada para PCs de escritório ou processadores muito básicos. Seca mais rápido.</li>
            <li><strong>Pasta Cinza/Prata (Cerâmica ou Prata):</strong> Contém partículas metálicas ou de cerâmica que transferem o calor muito melhor. Essencial para PCs Gamer e notebooks que esquentam muito.</li>
        </ul >
      `
        },
        {
            title: "2. Como aplicar sem fazer sujeira",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">A Regra da Gota:</h4>
            <p class="text-sm text-gray-300">
                O erro mais comum é colocar pasta demais. Coloque apenas uma gota do tamanho de um <strong>grão de ervilha</strong> no centro do processador. A pressão do cooler vai espalhar a pasta perfeitamente. Se transbordar para os lados, pode causar sujeira e dificuldade na limpeza futura (embora a maioria não conduza eletricidade, algumas pastas de prata podem ser perigosas em excesso).
            </p>
        </div>
      `
        },
        {
            title: "3. Quando trocar?",
            content: `
        <p class="mb-4 text-gray-300">
            Não troque por rotina se o PC estiver frio. Monitore as temperaturas com o software <strong>HWMonitor</strong>. Se o seu processador (CPU) estiver passando de 90ºC jogando ou 60ºC parado, e você já limpou a poeira das ventoinhas, então chegou a hora de trocar a pasta térmica.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/limpeza-fisica-pc-gamer",
            title: "Limpeza Física",
            description: "Como limpar o resto do PC."
        },
        {
            href: "/guias/gabinete-gamer-airflow-importancia",
            title: "Airflow Gabinete",
            description: "Ajude sua pasta térmica com ar fresco."
        },
        {
            href: "/guias/diagnostico-hardware",
            title: "Diagnóstico",
            description: "Saiba se o problema é calor ou peça ruim."
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
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
