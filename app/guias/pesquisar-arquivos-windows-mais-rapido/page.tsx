import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Como Pesquisar Arquivos no Windows Mais Rápido (2026)";
const description = "A busca do Windows 11 é lenta? Aprenda como usar o Everything e otimizar a indexação para achar qualquer arquivo instantaneamente em 2026.";
const keywords = [
    'pesquisar arquivos windows rapido tutorial 2026',
    'alternativa busca windows 11 everything guia',
    'como otimizar indexação de arquivos windows 11',
    'achar arquivos por extensão cmd windows tutorial',
    'busca do windows nao funciona como resolver 2026'
];

export const metadata: Metadata = createGuideMetadata('pesquisar-arquivos-windows-mais-rapido', title, description, keywords);

export default function FileSearchGuide() {
    const summaryTable = [
        { label: "Ferramenta Recomendada", value: "Everything (voidtools)" },
        { label: "Velocidade Tudo", value: "Instantânea (Milissegundos)" },
        { label: "Busca Nativa", value: "Lenta (Consome CPU e SSD)" },
        { label: "Dificuldade", value: "Fácil" }
    ];

    const contentSections = [
        {
            title: "Por que a busca do Windows é tão ruim?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          No Windows 11, a barra de busca não serve apenas para encontrar seus arquivos; ela tenta buscar na internet (Bing), carregar anúncios e notícias, tudo ao mesmo tempo. Em 2026, isso torna a simples tarefa de achar um PDF um processo lento e irritante. Felizmente, existem formas de contornar esse sistema pesado e ter buscas profissionais.
        </p>
      `
        },
        {
            title: "1. Everything: O padrão ouro da busca",
            content: `
        <p class="mb-4 text-gray-300">Se você lida com muitos arquivos, o <strong>Everything</strong> é obrigatório:</p>
        <p class="text-sm text-gray-300">
            Diferente do Windows, o Everything lê a tabela mestre de arquivos (MFT) do seu SSD em segundos. Isso permite que você digite apenas 'relatório' e veja todos os arquivos com esse nome aparecerem **instantaneamente**. <br/><br/>
            <strong>Dica Pro:</strong> Você pode usar filtros poderosos como <code>*.jpg</code> para ver apenas imagens, ou <code>size:>500mb</code> para encontrar arquivos gigantes que estão roubando espaço.
        </p>
      `
        },
        {
            title: "2. Otimizando a Busca Nativa",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Desligando o Lixo:</h4>
            <p class="text-sm text-gray-300">
                1. Vá em Configurações > Privacidade e Segurança > Permissões de Busca. <br/>
                2. Desative 'Pesquisa na Nuvem da Microsoft' e 'Histórico de Pesquisa'. <br/>
                3. Vá em 'Pesquisando o Windows' e mude de 'Clássico' para 'Avançado' se quiser buscar em todas as pastas, ou mantenha 'Clássico' se quiser que o seu SSD não fique sendo lido o tempo todo por indexadores de segundo plano.
            </p>
        </div>
      `
        },
        {
            title: "3. PowerToys Run: A Busca Estilo Mac",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>Experiência Premium:</strong> 
            <br/><br/>Se você gosta de produtividade rápida, instale o <strong>Microsoft PowerToys</strong>. Com ele, você aperta <code>Alt + Space</code> e uma barra de busca elegante aparece no centro da tela. Ela é muito mais rápida que o Menu Iniciar e permite fazer cálculos, converter moedas e abrir programas sem precisar tirar a mão do teclado.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/atalhos-produtividade-windows",
            title: "Atalhos Windows",
            description: "Navegue pelo sistema em alta velocidade."
        },
        {
            href: "/guias/limpeza-disco-profunda-arquivos-temporarios",
            title: "Limpeza de Disco",
            description: "Remova arquivos que atrapalham a busca."
        },
        {
            href: "/guias/otimizacao-ssd-windows-11",
            title: "Otimizar SSD",
            description: "Garanta que a indexação não degrade seu hardware."
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
