import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Cable Management: Como organizar os cabos do PC (2026)";
const description = "O interior do seu PC parece um ninho de pássaro? Aprenda técnicas de Cable Management para melhorar o visual e o airflow do seu setup em 2026.";
const keywords = [
    'como organizar cabos do pc gamer tutorial 2026',
    'guia de cable management pc para iniciantes',
    'melhorar fluxo de ar pc organizando cabos guia',
    'acessorios para organização de cabos pc 2026',
    'esconder cabos do gabinete gamer passo a passo'
];

export const metadata: Metadata = createGuideMetadata('cable-management-organizacao-cabos-pc', title, description, keywords);

export default function CableManagementGuide() {
    const summaryTable = [
        { label: "Vantagem #1", value: "Melhor Fluxo de Ar (Airflow)" },
        { label: "Vantagem #2", value: "Facilidade na Limpeza" },
        { label: "Ferramentas", value: "Abraçadeiras de Nylon (Zip Ties) ou Velcro" },
        { label: "Dificuldade", value: "Médio" }
    ];

    const contentSections = [
        {
            title: "Por que organizar os cabos?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Em 2026, com gabinetes de vidro temperado e iluminação RGB em todo lugar, um **Cable Management** mal feito acaba com a estética do seu setup. Mas vai além da beleza: cabos espalhados bloqueiam o caminho do ar fresco que entra pelas ventoinhas frontais, fazendo com que sua GPU e CPU trabalhem em temperaturas mais altas. Organizar cabos é o passo final para um PC de alta performance.
        </p>
      `
        },
        {
            title: "1. A regra do "Caminho de Trás"",
            content: `
        <p class="mb-4 text-gray-300">O maior segredo é esconder a bagunça:</p>
        <p class="text-sm text-gray-300">
            Quase todos os gabinetes modernos possuem um espaço atrás da placa-mãe. <br/><br/>
            - Passe o **Cabo de 24 pinos** (energia principal) pelo recorte mais próximo da entrada. <br/>
            - O **Cabo da CPU (8 pinos)** deve passar pelo recorte no topo esquerdo. <br/>
            - Use as abraçadeiras para prender os excessos de cabo de forma plana contra o metal do gabinete, permitindo que a tampa lateral feche sem esforço.
        </p>
      `
        },
        {
            title: "2. Gerenciando os Cabos da Fonte (PSU)",
            content: `
       <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Fontes Modulares:</h4>
            <p class="text-sm text-gray-300">
                Se você vai montar um PC em 2026, invista em uma **Fonte Modular**. Ela permite que você conecte apenas os cabos que realmente vai usar. Sobrou cabo SATA ou Molex que não tem utilidade? Deixe-os na caixa da fonte em vez de amontoá-los no fundo do gabinete ("porão"), o que facilitará muito a circulação de ar vinda da fonte.
            </p>
        </div>
      `
        },
        {
            title: "3. Cabos Externos: A Mesa Limpa",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>Clean Setup:</strong> 
            <br/><br/>A organização não para dentro do PC. Use **canaletas** ou espirais organizadoras para agrupar os fios do monitor, teclado e mouse que descem da mesa. Um setup onde você não vê cabos pendurados transmite muito mais profissionalismo e tranquilidade para longas sessões de jogo ou trabalho em 2026.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/limpeza-fisica-pc-gamer",
            title: "Limpeza Física",
            description: "Aproveite a organização para tirar o pó."
        },
        {
            href: "/guias/gabinete-gamer-airflow-importancia",
            title: "Guia de Airflow",
            description: "Como a posição dos cabos afeta o calor."
        },
        {
            href: "/guias/montagem-pc-gamer-erros-comuns",
            title: "Montagem de PC",
            description: "Dicas para iniciantes não se perderem nos fios."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="1 hora"
            difficultyLevel="Médio"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
