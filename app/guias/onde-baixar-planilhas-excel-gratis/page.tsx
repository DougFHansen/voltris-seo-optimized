import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Onde baixar Planilhas Excel Grátis: Controle Financeiro e Gestão";
const description = "Procurando modelos prontos de Excel para se organizar? Listamos os melhores sites para baixar planilhas gratuitas de gastos, estoques e cronogramas em 2026.";
const keywords = [
    'planilhas excel gratis download 2026',
    'modelos de planilhas financeiras gratis',
    'planilha controle de estoque excel gratis',
    'onde baixar modelos excel oficiais microsoft',
    'planilha cronograma estudos excel'
];

export const metadata: Metadata = createGuideMetadata('onde-baixar-planilhas-excel-gratis', title, description, keywords);

export default function ExcelSheetsGuide() {
    const summaryTable = [
        { label: "Melhor Fonte", value: "Microsoft Create (Oficial)" },
        { label: "Formatos", value: ".xlsx / .xltx" },
        { label: "Categorias", value: "Finanças, Projetos, Pessoal" },
        { label: "Cuidado", value: "Evite Macros (.xlsm) desconhecidas" }
    ];

    const contentSections = [
        {
            title: "Por que usar modelos prontos?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Montar uma planilha do zero exige tempo e conhecimento avançado de fórmulas. Modelos profissionais já vêm com gráficos automatizados e formatação condicional, permitindo que você apenas insira os dados e tenha o resultado na hora.
        </p>
      `
        },
        {
            title: "As 3 Melhores Fontes em 2026",
            content: `
        <div class="space-y-6">
            <div class="bg-gray-800 p-6 rounded-xl border-l-4 border-green-500">
                <h4 class="text-white font-bold text-xl">1. Microsoft Create (create.microsoft.com)</h4>
                <p class="text-gray-300 mt-2">É a fonte oficial. Lá você encontra modelos de calendário, planejadores de orçamento e rastreadores de saúde feitos pelos próprios designers da Microsoft. <strong>Vantagem:</strong> São 100% seguros e limpos.</p>
            </div>
            <div class="bg-gray-800 p-6 rounded-xl border-l-4 border-blue-500">
                <h4 class="text-white font-bold text-xl">2. Vertex42</h4>
                <p class="text-gray-300 mt-2">O padrão ouro para planilhas complexas. Ideal para engenharia, gestão de projetos (Gráfico de Gantt) e amortização de dívidas. O site parece antigo, mas o conteúdo é o melhor do mundo.</p>
            </div>
             <div class="bg-gray-800 p-6 rounded-xl border-l-4 border-orange-500">
                <h4 class="text-white font-bold text-xl">3. Google Sheets Gallery</h4>
                <p class="text-gray-300 mt-2">Se você não tem o Excel instalado e usa o Google Planilhas, o menu "Galeria de Modelos" dentro do próprio app já resolve 90% das necessidades básicas de casa.</p>
            </div>
        </div>
      `
        },
        {
            title: "Aviso de Segurança: O Perigo das Macros",
            content: `
        <div class="bg-red-900/10 p-5 rounded-xl border border-red-500/30">
            <p class="text-red-400 font-bold mb-2">Cuidado com arquivos .xlsm</p>
            <p class="text-sm text-gray-300">
                Arquivos do Excel podem conter "Macros" (pequenos programas). Hackers usam isso para roubar dados do seu PC. Nunca habilite a edição e o conteúdo de uma planilha baixada de sites suspeitos se ela pedir permissão para rodar macros.
            </p>
        </div>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/atalhos-produtividade-windows",
            title: "Atalhos Windows",
            description: "Navegue mais rápido entre janelas de trabalho."
        },
        {
            href: "/guias/backup-dados",
            title: "Backup de Arquivos",
            description: "Não perca suas planilhas importantes."
        },
        {
            href: "/guias/extensoes-produtividade-chrome",
            title: "Extensões Úteis",
            description: "Ferramentas que ajudam na organização digital."
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
