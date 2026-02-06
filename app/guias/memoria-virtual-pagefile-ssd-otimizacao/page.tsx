import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'memoria-virtual-pagefile-ssd-otimizacao',
    title: "Memória Virtual (Pagefile): Otimização para Jogos Pesados",
    description: "Seu jogo fecha sozinho sem erro? Pode ser falta de Pagefile. Aprenda a configurar o Arquivo de Paginação corretamente no SSD para estabilidade.",
    category: 'windows',
    difficulty: 'Intermediário',
    time: '15 min'
};

const title = "Memória Virtual (Pagefile): O Guia Definitivo";
const description = "Muitos 'otimizadores' dizem para desativar o Pagefile. ISSO É UM ERRO. Jogos modernos como Cyberpunk e Tarkov precisam dele para não crashar.";

const keywords = [
    'tamanho ideal arquivo de paginacao 16gb ram',
    'como aumentar memoria virtual windows 11 jogos',
    'pagefile no ssd ou hd',
    'erro out of memory fix',
    'jogo fechando sozinho desktop sem erro',
    'gerenciado pelo sistema vs tamanho personalizado',
    'memoria virtual commit charge',
    'voltris optimizer ram',
    'star citizen pagefile size'
];

export const metadata: Metadata = createGuideMetadata('memoria-virtual-pagefile-ssd-otimizacao', title, description, keywords);

export default function PagefileGuide() {
    const summaryTable = [
        { label: "Local", value: "SSD (Obrigatório)" },
        { label: "Tamanho (16GB RAM)", value: "16GB - 24GB" },
        { label: "Tamanho (32GB RAM)", value: "4GB - 8GB" },
        { label: "Modo", value: "Tamanho Fixo (Min=Max)" },
        { label: "HD Mecânico", value: "Desativar (Lento)" }
    ];

    const contentSections = [
        {
            title: "Introdução: O que é Pagefile?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Quando a memória RAM enche, o Windows joga os dados menos usados para o disco. Isso é o Pagefile. Se você desativar, assim que a RAM bater 100%, o programa fecha (Crash To Desktop).
        </p>
      `
        },
        {
            title: "Capítulo 1: Onde configurar",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Passo a Passo</h4>
                <p class="text-gray-400 text-xs text-justify">
                    1. Digite "Ajustar a aparência e o desempenho do Windows" no Iniciar.
                    <br/>2. Aba Avançado > Memória Virtual > Alterar.
                    <br/>3. Desmarque "Gerenciar automaticamente".
                    <br/>4. Selecione seu drive <strong>C: (SSD)</strong>.
                    <br/>5. Marque "Tamanho Personalizado".
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Tamanho Fixo vs Gerenciado",
            content: `
        <p class="mb-4 text-gray-300">
            Recomendamos <strong>Tamanho Fixo</strong> (Colocar o mesmo valor em Inicial e Máximo).
            <br/>Por quê? Se você deixa variável (ex: 1GB a 20GB), o Windows gasta CPU redimensionando o arquivo durante o jogo e fragmenta o disco. Fixando o tamanho, o arquivo é criado uma vez e fica estático e rápido.
        </p>
      `
        },
        {
            title: "Capítulo 3: Quanto colocar?",
            content: `
        <p class="mb-4 text-gray-300">
            Regra prática para Gamers (Valores em MB):
            <br/>- <strong>8GB RAM:</strong> Defina 16000 MB (Precisa de muita ajuda).
            <br/>- <strong>16GB RAM:</strong> Defina 16000 MB ou 12000 MB. (Essencial para Warzone/Tarkov).
            <br/>- <strong>32GB RAM:</strong> Defina 4096 MB ou deixe Gerenciado. (Raramente usa, só por segurança).
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: SSD vs HD",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>NUNCA use Pagefile no HD mecânico.</strong>
            <br/>O HD é lento. Se o jogo precisar ler algo do pagefile no HD, você vai ter uma travada bruta (stutter) de 1 segundo.
            <br/>Configure o Pagefile APENAS no seu SSD mais rápido (NVMe). Desative (Sem arquivo de paginação) nos HDs secundários.
        </p>
      `
        },
        {
            title: "Capítulo 5: Committed Memory (Carga)",
            content: `
        <p class="mb-4 text-gray-300">
            Alguns jogos (Star Citizen, DCS World) crasham se o "System Commit" não puder chegar a 40GB.
            <br/>System Commit = RAM Física + Pagefile.
            <br/>Se você tem 16GB RAM, precisa de 24GB de Pagefile para chegar nos 40GB totais exigidos por esses simuladores pesados.
        </p>
      `
        },
        {
            title: "Capítulo 6: O Mito do 'Desativar Pagefile'",
            content: `
        <p class="mb-4 text-gray-300">
            Antigamente, diziam para desativar o pagefile para "economizar vida útil do SSD".
            <br/>Hoje, os SSDs duram petabytes de escrita. Desativar o pagefile só causa instabilidade. O Windows é desenhado para usar pagefile, mesmo com 64GB de RAM. Mantenha ligado.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 7: ISLC (Intelligent Standby List Cleaner)",
            content: `
            <p class="mb-4 text-gray-300">
                Uma ferramenta que limpa o cache de standby do Windows automaticamente.
                <br/>Útil se você sente que o jogo começa liso e começa a gaguejar (stutter) depois de 1 hora.
                <br/>Configure para limpar quando a "Free Memory" for menor que 1024MB.
            </p>
            `
        },
        {
            title: "Capítulo 8: Erro de Paginação (Tela Azul)",
            content: `
            <p class="mb-4 text-gray-300">
                Tela azul "PAGE_FAULT_IN_NONPAGED_AREA"?
                <br/>Isso geralmente é RAM defeituosa ou instável (XMP agressivo), não configuração de tamanho de pagefile. Rode o MemTest86.
            </p>
            `
        },
        {
            title: "Capítulo 9: Espaço em Disco",
            content: `
            <p class="mb-4 text-gray-300">
                Lembre-se: Se você definir 16GB de pagefile, você perde 16GB de espaço no SSD instantaneamente. Garanta que tem espaço livre. SSD cheio fica lento.
            </p>
            `
        },
        {
            title: "Capítulo 10: Reiniciar",
            content: `
            <p class="mb-4 text-gray-300">
                Toda alteração de pagefile exige reinicialização do Windows para aplicar.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Tenho 64GB de RAM. Preciso de Pagefile?",
            answer: "Sim, deixe pelo menos 1GB ou Gerenciado pelo Sistema. Alguns programas antigos e logs de erro do Windows exigem pagefile existente para funcionarem corretamente."
        },
        {
            question: "Pagefile estraga o SSD?",
            answer: "Não significativamente. Um SSD moderno suporta centenas de TBW (Terabytes Written). O uso normal de jogos não arranha essa vida útil em 5 anos."
        }
    ];

    const externalReferences = [
        { name: "Microsoft Docs (Pagefile)", url: "https://learn.microsoft.com/en-us/troubleshoot/windows-client/performance/introduction-to-the-page-file" },
        { name: "ISLC Download", url: "https://www.wagnardsoft.com/content/intelligent-standby-list-cleaner-v1000-released" }
    ];

    const relatedGuides = [
        {
            href: "/guias/otimizacao-ssd-windows-11",
            title: "SSD",
            description: "Manutenção do drive."
        },
        {
            href: "/guias/escape-from-tarkov-otimizacao-fps-ram",
            title: "Tarkov",
            description: "Jogo que mais precisa disso."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="15 min"
            difficultyLevel="Intermediário"
            contentSections={contentSections}
            advancedContentSections={advancedContentSections}
            additionalContentSections={additionalContentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
            faqItems={faqItems}
            externalReferences={externalReferences}
        />
    );
}
