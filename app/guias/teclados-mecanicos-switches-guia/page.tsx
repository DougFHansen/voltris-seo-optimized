import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Switches de Teclado Mecânico: Guia de Cores e Tipos (2026)";
const description = "Blue, Red, Brown ou Silver? Aprenda a diferença entre todos os switches de teclado mecânico e escolha o ideal para o seu estilo em 2026.";
const keywords = [
    'guia de switches teclado mecanico 2026 cores',
    'diferença switch azul vermelho marrom tutorial 2026',
    'melhor switch para digitar silencioso guia 2026',
    'switch red vs switch blue qual mais barulhento tutorial',
    'o que é switch optico teclado mecanico guia'
];

export const metadata: Metadata = createGuideMetadata('teclados-mecanicos-switches-guia', title, description, keywords);

export default function SwitchGuide() {
    const summaryTable = [
        { label: "Switch Blue", value: "Clicky (Barulhento) / Feedback Tátil" },
        { label: "Switch Red", value: "Linear (Silencioso) / Rápido para Games" },
        { label: "Switch Brown", value: "Tátil (Silencioso) / Versátil (Trabalho + Jogo)" },
        { label: "Switch Silver", value: "Linear Ultra Rápido / Baixa Ativação" }
    ];

    const contentSections = [
        {
            title: "O coração do seu Teclado",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O **Switch** é a mola e o mecanismo que fica embaixo de cada tecla. É ele quem define se a sua digitação será barulhenta, macia, rápida ou pesada. Em 2026, com o avanço da customização, as cores tradicionais (Azul, Vermelho e Marrom) ganharam variações silenciosas e versões ópticas extremamente duráveis. Escolher o switch certo é a parte mais importante para o seu conforto a longo prazo.
        </p>
      `
        },
        {
            title: "1. As Cores Clássicas (A hierarquia)",
            content: `
        <p class="mb-4 text-gray-300">Entenda qual o seu perfil de uso:</p>
        <ul class="list-disc list-inside text-gray-300 space-y-3">
            <li><strong>Blue (Azul):</strong> Faz um "click" audível. Ótimo para quem gosta da sensação de máquina de escrever, mas pode irritar quem mora com você ou colegas de trabalho.</li>
            <li><strong>Red (Vermelho):</strong> É linear, ou seja, desce reto sem resistência. É o favorito dos gamers competitivos pela leveza e velocidade.</li>
            <li><strong>Brown (Marrom):</strong> O equilíbrio. Tem o "degrauzinho" tátil do azul, mas sem o barulho alto. Perfeito para quem faz home office e também joga.</li>
        </ul >
      `
        },
        {
            title: "2. Switches Ópticos vs Mecânicos",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Velocidade da Luz:</h4>
            <p class="text-sm text-gray-300">
                Switches ópticos de 2026 usam um feixe de luz para registrar o clique em vez de contato metálico. <br/><br/>
                - <strong>Durabilidade:</strong> Como não há atrito entre metais, eles não sofrem com o 'Double Click' e duram o dobro de um switch comum. <br/>
                - <strong>Performance:</strong> O tempo de resposta é quase instantâneo (abaixo de 0.2ms). Marcas como Razer e SteelSeries dominam esta tecnologia em seus modelos de elite.
            </p>
        </div>
      `
        },
        {
            title: "3. O fenómeno 'Thock' em 2026",
            content: `
        <p class="mb-4 text-gray-300">
            Você já deve ter visto vídeos de teclados com som "acolchoado" e gostoso de ouvir. 
            <br/><br/><strong>Dica:</strong> Para conseguir esse som (conhecido como Thock), procure por switches **Pre-lubed** (lubrificados de fábrica). Marcas como Gateron e Akko oferecem switches lubrificados que eliminam o som de "mola rangendo", tornando a digitação muito mais premium e satisfatória sem que você precise abrir o teclado.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/teclados-mecanicos-guia",
            title: "Escolher Teclado",
            description: "Formatos e tecnologias de montagem."
        },
        {
            href: "/guias/teclado-mecanico-vs-membrana-qual-o-melhor",
            title: "Mecânico vs Membrana",
            description: "Diferenças fundamentais entre tecnologias."
        },
        {
            href: "/guias/perifericos-gamer-vale-a-pena-marcas",
            title: "Marcas de Teclado",
            description: "Onde encontrar os melhores switches."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="20 min"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
