import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Atalhos de Navegador: O Manual da Produtividade (Chrome/Edge)";
const description = "Você ainda usa o mouse para fechar abas? Aprenda os atalhos de teclado essenciais para Chrome, Edge e Brave que vão salvar horas do seu dia em 2026.";
const keywords = [
    'melhores atalhos de navegador chrome 2026',
    'como reabrir aba fechada atalho teclado',
    'atalhos produtividade navegador edge e brave',
    'alternar entre abas do navegador atalho windows',
    'limpar cache do navegador atalho rapido'
];

export const metadata: Metadata = createGuideMetadata('atalhos-navegador-produtividade', title, description, keywords);

export default function BrowserShortcutsGuide() {
    const summaryTable = [
        { label: "Reabrir Aba", value: "Ctrl + Shift + T" },
        { label: "Nova Aba Anônima", value: "Ctrl + Shift + N" },
        { label: "Fechar Aba atual", value: "Ctrl + W" },
        { label: "Pular para barra de busca", value: "Ctrl + L" }
    ];

    const contentSections = [
        {
            title: "Por que usar atalhos?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Cada vez que você tira a mão do teclado para procurar o ícone 'X' de fechar uma aba com o mouse, você perde cerca de 2 segundos. Somando isso ao longo de um dia de trabalho ou estudo, você desperdiça minutos preciosos. Em 2026, dominar os atalhos do navegador é o que diferencia um usuário comum de um "Power User".
        </p>
      `
        },
        {
            title: "1. Gestão de Abas: O básico que você deve saber",
            content: `
        <p class="mb-4 text-gray-300">Pare de se perder entre dezenas de abas abertas:</p>
        <ul class="list-disc list-inside text-gray-300 space-y-3">
            <li><strong>Ctrl + T:</strong> Abre uma nova aba instantaneamente.</li>
            <li><strong>Ctrl + Shift + T:</strong> O "salva-vidas". Reabre a última aba que você fechou acidentalmente.</li>
            <li><strong>Ctrl + 1 até 8:</strong> Pula direto para a aba naquela posição. <strong>Ctrl + 9</strong> pula para a última aba.</li>
            <li><strong>Ctrl + Tab:</strong> Alterna entre as abas para a direita. <strong>Ctrl + Shift + Tab</strong> faz o mesmo para a esquerda.</li>
        </ul >
      `
        },
        {
            title: "2. Navegação Ninja",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Pulo de Página:</h4>
            <p class="text-sm text-gray-300">
                - <strong>Ctrl + L:</strong> Seleciona a URL/Barra de busca. Digite e dê Enter sem clicar em nada. <br/>
                - <strong>Ctrl + F:</strong> Abre a caixa de busca na página atual. <br/>
                - <strong>Spacebar:</strong> Rola para baixo uma página inteira. <strong>Shift + Spacebar</strong> rola para cima. <br/>
                - <strong>Ctrl + R:</strong> Recarrega a página. <strong>Ctrl + Shift + R</strong> recarrega limpando o cache (útil quando o site trava).
            </p>
        </div>
      `
        },
        {
            title: "3. Limpeza Expressa",
            content: `
        <p class="mb-4 text-gray-300">
            Precisa limpar o histórico ou o cache rapidamente? 
            <br/>Aperte <strong>Ctrl + Shift + Delete</strong>. Isso abrirá direto a janela de limpeza de dados de navegação, economizando 5 cliques pelos menus de configurações do Chrome ou Edge.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/atalhos-produtividade-windows",
            title: "Atalhos Windows",
            description: "Aumente sua agilidade no sistema como um todo."
        },
        {
            href: "/guias/limpar-cache-navegador-chrome-edge",
            title: "Guia de Cache",
            description: "Por que e quando limpar seus dados."
        },
        {
            href: "/guias/extensoes-produtividade-chrome",
            title: "Extensões Úteis",
            description: "Melhore ainda mais sua navegação."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="10 min"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
