import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Como configurar um Segundo Monitor na Vertical (2026)";
const description = "Quer mais produtividade ou facilitar a leitura do chat na stream? Aprenda como colocar seu segundo monitor na vertical no Windows 11 em 2026.";
const keywords = [
    'segundo monitor na vertical como configurar 2026',
    'monitor vertical produtividade guia 2026',
    'como girar tela do windows 11 tutorial rapido',
    'setup segundo monitor para programadores e streamers',
    'posicionamento segundo monitor vertical windows 11'
];

export const metadata: Metadata = createGuideMetadata('segundo-monitor-vertical-configurar', title, description, keywords);

export default function VerticalMonitorGuide() {
    const summaryTable = [
        { label: "Uso Ideal", value: "Chat da Stream, Código, Discord, Notícias" },
        { label: "Vantagem", value: "Menos scroll / Otimização de espaço na mesa" },
        { label: "Software", value: "Configurações de Exibição do Windows" },
        { label: "Dificuldade", value: "Fácil" }
    ];

    const contentSections = [
        {
            title: "Por que usar monitor na vertical?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Em 2026, com telas ficando cada vez mais largas (Ultrawide), ter um monitor secundário na horizontal pode ocupar espaço demais na sua mesa e causar cansaço no pescoço. Usar o segundo monitor na **vertical (modo retrato)** é o segredo de programadores, streamers e profissionais que precisam ler longos fluxos de texto sem precisar usar o scroll do mouse o tempo todo.
        </p>
      `
        },
        {
            title: "1. Passo a Passo: Girando a Tela",
            content: `
        <p class="mb-4 text-gray-300">Após girar o monitor fisicamente no suporte, siga estes passos no software:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Clique com o botão direito na área de trabalho e vá em <strong>Configurações de Exibição</strong>.</li>
            <li>Identifique qual é o seu monitor secundário (geralmente o número 2).</li>
            <li>Role até a seção 'Escala e layout'.</li>
            <li>Em <strong>Orientação da tela</strong>, mude de 'Paisagem' para <strong>'Retrato'</strong>.</li>
            <li>Confirme a alteração. O Windows inverterá a imagem para combinar com a posição física.</li>
        </ol>
      `
        },
        {
            title: "2. Alinhamento Perfeito do Mouse",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Evite o "Degrau":</h4>
            <p class="text-sm text-gray-300">
                Se o seu monitor vertical for menor ou estiver posicionado mais alto que o principal, o mouse pode "travar" ao tentar passar de uma tela para outra. <br/><br/>
                Na tela de Configurações de Exibição, você pode **clicar e arrastar** os retângulos numerados para cima ou para baixo. Alinhe-os de forma que o mouse passe suavemente pelo centro ou pelo topo de ambas as telas.
            </p>
        </div>
      `
        },
        {
            title: "3. Dicas de Ergonomia em 2026",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>O ângulo importa:</strong> 
            <br/><br/>Ao usar um monitor vertical, evite deixá-lo totalmente de lado. Incline-o levemente em direção aos seus olhos (em um ângulo de ~30 graus). Isso reduz a distorção de cores (especialmente em monitores com painel TN ou VA) e evita que você precise girar o tronco inteiro para ler o que está no chat ou no código.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/guia-compra-monitores",
            title: "Comprar Monitores",
            description: "Saiba escolher mofinitores com bons suportes."
        },
        {
            href: "/guias/monitor-ips-vs-va-vs-tn-jogos",
            title: "Painéis IPS vs VA",
            description: "Por que IPS é melhor para monitores verticais."
        },
        {
            href: "/guias/atalhos-produtividade-windows",
            title: "Produtividade Windows",
            description: "Atalhos para mover janelas entre monitores."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="5 min"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
