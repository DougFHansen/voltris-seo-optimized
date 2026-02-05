import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'water-cooler-vs-air-cooler-qual-escolher',
  title: "Water Cooler vs Air Cooler: Qual escolher em 2026?",
  description: "Seu processador está esquentando muito? Comparamos a eficiência, barulho e durabilidade dos Water Coolers e Air Coolers em 2026.",
  category: 'windows-geral',
  difficulty: 'Intermediário',
  time: '20 min'
};

const title = "Water Cooler vs Air Cooler: Qual escolher em 2026?";
const description = "Seu processador está esquentando muito? Comparamos a eficiência, barulho e durabilidade dos Water Coolers e Air Coolers em 2026.";
const keywords = [
    'water cooler vs air cooler qual melhor 2026',
    'melhor air cooler custo beneficio 2026 guia',
    'water cooler faz barulho tutorial de instalação 2026',
    'air cooler segura processador i9 ou ryzen 9 guia 2026',
    'manutenção water cooler como fazer tutorial 2026'
];

export const metadata: Metadata = createGuideMetadata('water-cooler-vs-air-cooler-qual-escolher', title, description, keywords);

export default function CoolingComparisonGuide() {
    const summaryTable = [
        { label: "Air Cooler", value: "Barato, Durável (quase eterno), Seguro" },
        { label: "Water Cooler", value: "Mais Caro, Estético, Melhor para Redução de Ruído" },
        { label: "Risco", value: "Vazamento em Water Coolers baratos" },
        { label: "Dificuldade", value: "Médio" }
    ];

    const contentSections = [
        {
            title: "O dilema da refrigeração",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Com os processadores de 2026 chegando a frequências altíssimas e consumindo mais de 250W em carga máxima, manter a temperatura sob controle não é mais uma opção, é uma necessidade. Se a sua CPU passar dos 90°C, ela perderá performance. Mas será que você realmente precisa de um sistema complexo com água ou um bom bloco de metal com ventoinhas (Air Cooler) é o suficiente?
        </p>
      `
        },
        {
            title: "1. Air Cooler: A força bruta do metal",
            content: `
        <p class="mb-4 text-gray-300">Em 2026, Air Coolers topo de linha desafiam a física:</p>
        <ul class="list-disc list-inside text-gray-300 space-y-3">
            <li><strong>Confiabilidade:</strong> A única coisa que pode quebrar é a ventoinha, que custa 50 reais para trocar. O dissipador dura 20 anos.</li>
            <li><strong>Performance:</strong> Modelos como o Noctua ou DeepCool Assassin IV batem de frente com muitos Water Coolers de 240mm.</li>
            <li><strong>Ideal para:</strong> Jogadores que querem um PC "monte e esqueça", sem se preocupar com vazamentos ou bolhas na bomba.</li>
        </ul >
      `
        },
        {
            title: "2. Water Cooler: Estética e Silêncio",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">O Poder do Líquido:</h4>
            <p class="text-sm text-gray-300">
                Water Coolers modernos de 2026 são excelentes para tirar o calor de dentro do processador e jogá-lo diretamente para fora do gabinete. <br/><br/>
                - <strong>Silêncio:</strong> Como o calor é dissipado em uma área maior (radiadores de 360mm ou 420mm), as ventoinhas podem girar mais devagar, fazendo menos barulho. <br/>
                - <strong>Espaço:</strong> Deixam a placa-mãe "limpa", facilitando o manuseio das memórias RAM. <br/>
                - <strong>Vida Útil:</strong> A bomba de água tem uma vida útil de 4 a 6 anos. Após isso, o fluido evapora ou a bomba para, exigindo a troca de todo o sistema.
            </p>
        </div>
      `
        },
        {
            title: "3. O veredito por Processador",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>Qual comprar em 2026?</strong>
            <br/><br/>
            - <strong>Core i3 / i5 ou Ryzen 5:</strong> Use um Air Cooler simples (ex: DeepCool AK400). Pagar mais que isso é desperdício. <br/>
            - <strong>Ryzen 7 ou Core i7:</strong> Um Air Cooler robusto (Dual Tower) ou um Water Cooler de 240mm. <br/>
            - <strong>Core i9 ou Ryzen 9:</strong> Obrigatório o uso de Water Cooler de 360mm ou superior se for fazer uso profissional (edição/render). No Air Cooler, eles chegarão a 100°C rapidamente.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/montagem-pc-gamer-erros-comuns",
            title: "Montagem de PC",
            description: "Como instalar seu cooler corretamente."
        },
        {
            href: "/guias/monitorar-temperatura-pc",
            title: "Monitorar Calor",
            description: "Acompanhe as temps após o upgrade."
        },
        {
            href: "/guias/importancia-pasta-termica-pc",
            title: "Pasta Térmica",
            description: "O segredo para a transferência de calor."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="20 min"
            difficultyLevel="Médio"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
