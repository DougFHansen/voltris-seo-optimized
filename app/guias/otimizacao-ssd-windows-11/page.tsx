import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'otimizacao-ssd-windows-11',
    title: "Otimização Extrema de SSD e NVMe no Windows 11 (2026)",
    description: "Seu SSD está lento? Aprenda a configurar o TRIM, Cache de Escrita e Overprovisioning para atingir a velocidade máxima de leitura/escrita.",
    category: 'otimizacao',
    difficulty: 'Intermediário',
    time: '25 min'
};

const title = "Otimização Extrema de SSD e NVMe no Windows 11 (2026)";
const description = "Seu SSD está lento? Aprenda a configurar o TRIM, Cache de Escrita e Overprovisioning para atingir a velocidade máxima de leitura/escrita.";
const keywords = [
    'ativar trim ssd windows 11 powershell',
    'como aumentar vida util ssd nvme',
    'overprovisioning samsung magician crucial executive',
    'cache escrita windows ssd perigoso ou bom',
    'desativar sysmain ssd'
];

export const metadata: Metadata = createGuideMetadata('otimizacao-ssd-windows-11', title, description, keywords);

export default function SSDGuide() {
    const summaryTable = [
        { label: "Comando Vital", value: "TRIM" },
        { label: "Configuração Chave", value: "Cache de Escrita (Ligado)" },
        { label: "Recurso Avançado", value: "Overprovisioning (10%)" },
        { label: "Mito", value: "Desfragmentar SSD (Nunca faça!)" }
    ];

    const contentSections = [
        {
            title: "Introdução: SSD não é HD",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          SSDs (Solid State Drives) funcionam como pendrives gigantes. Eles não têm partes móveis. Se você tratar um SSD como um HD antigo (desfragmentando toda semana), você vai <strong>matá-lo</strong> em meses. Este guia ensina a manter a saúde (TBW) e performance em 100%.
        </p>
      `
        },
        {
            title: "Passo 1: Verificando o TRIM (O Lixeiro Automático)",
            content: `
        <p class="mb-4 text-gray-300">
            O comando TRIM diz ao controlador do SSD quais blocos de dados não são mais usados e podem ser apagados internamente. Sem TRIM, o SSD fica muito lento ao longo do tempo.
        </p>
        <div class="bg-[#1e1e1e] border border-gray-700 p-6 rounded-xl font-mono text-xs overflow-x-auto">
            <p class="text-gray-500 mb-2"># Verificar Status (CMD Admin)</p>
            <p class="text-green-400">fsutil behavior query DisableDeleteNotify</p>
            
            <ul class="mt-4 space-y-2 text-gray-400">
                <li>Se retornar <strong>0</strong> = TRIM está <strong>ATIVADO</strong> (Bom).</li>
                <li>Se retornar <strong>1</strong> = TRIM está <strong>DESATIVADO</strong> (Ruim).</li>
            </ul>

            <p class="text-gray-500 mt-4 mb-2"># Ativar se estiver desligado</p>
            <p class="text-blue-300">fsutil behavior set DisableDeleteNotify 0</p>
        </div>
      `
        },
        {
            title: "Passo 2: Política de Cache de Escrita (Risky vs Fast)",
            content: `
        <p class="mb-4 text-gray-300">
            O Windows tem uma função que usa a RAM como "buffer" temporário antes de gravar no disco. Isso acelera muito a escrita de arquivos pequenos.
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-2 bg-gray-900 p-6 rounded-xl border border-gray-700">
            <li>Abra o <strong>Gerenciador de Dispositivos</strong> (Win+X > M).</li>
            <li>Expanda "Unidades de Disco" e clique 2x no seu SSD/NVMe.</li>
            <li>Vá na aba <strong>Políticas</strong>.</li>
            <li>Marque <strong>"Habilitar cache de gravação no dispositivo"</strong> (Geralmente já vem marcado).</li>
            <li><strong>Avançado:</strong> Existe uma opção chamada "Desativar a limpeza de buffer de cache...". Marcar isso aumenta MUITO a velocidade, mas se a energia cair durante uma cópia, você perde o arquivo. Só use se tiver No-Break (UPS) ou Notebook com bateria.</li>
        </ol>
      `
        },
        {
            title: "Passo 3: Overprovisioning (O Segredo da Longevidade)",
            content: `
        <p class="mb-4 text-gray-300">
            Deixar seu SSD 100% cheio faz ele ficar lento, pois ele precisa de espaço livre para reorganizar dados (Garbage Collection).
        </p>
        <p class="text-gray-300">
            <strong>Recomendação:</strong> Deixe sempre <strong>10% a 15%</strong> do espaço total do disco "Não alocado" (Unallocated) no Gerenciamento de Disco. Ou use o software da fabricante (Samsung Magician, Crucial Storage Executive) para configurar o Overprovisioning automaticamente.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/debloat-windows-11-otimizacao-powershell",
            title: "Debloat Windows",
            description: "Menos processos escrevendo logs no disco."
        },
        {
            href: "/guias/como-escolher-memoria-ram",
            title: "RAM Disk",
            description: "Como usar RAM para evitar escrita no SSD."
        },
        {
            href: "/guias/formatacao-limpa-windows-11",
            title: "Formatar Limpo",
            description: "Começar do zero com partições alinhadas."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="25 min"
            difficultyLevel="Intermediário"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
            showVoltrisOptimizerCTA={true}
        />
    );
}
