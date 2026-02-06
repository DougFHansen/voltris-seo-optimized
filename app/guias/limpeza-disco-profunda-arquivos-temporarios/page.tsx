import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'limpeza-disco-profunda-arquivos-temporarios',
    title: "Limpeza de Disco Profunda: Libere 20GB+ no Windows (2026)",
    description: "Seu 'Disco C:' está cheio? O Windows esconde gigabytes de lixo em pastas como WinSxS, SoftwareDistribution e Temp. Saiba como limpar profundamente sem formatar.",
    category: 'windows-geral',
    difficulty: 'Iniciante',
    time: '20 min'
};

const title = "Como Liberar Espaço no Windows 11: Limpeza Profunda e Segura (2026)";
const description = "Pare de apagar suas fotos. O vilão do espaço é o próprio Windows. Aprenda a usar o Storage Sense, cleanmgr e CMD para recuperar gigabytes perdidos.";

const keywords = [
    'como liberar espaço disco c windows 11',
    'limpeza de disco avançada cmd',
    'pasta winsxs muito grande como reduzir',
    'apagar arquivos temporarios %temp%',
    'softwaredistribution pode apagar',
    'storage sense configurar',
    'hiberfil.sys desativar economizar espaço',
    'wiztree vs windirstat qual melhor'
];

export const metadata: Metadata = createGuideMetadata('limpeza-disco-profunda-arquivos-temporarios', title, description, keywords);

export default function DiskCleanupGuide() {
    const summaryTable = [
        { label: "Ferramenta Básica", value: "Limpeza de Disco (Cleanmgr)" },
        { label: "Ferramenta Visual", value: "WizTree (Melhor que WinDirStat)" },
        { label: "Pasta Perigosa", value: "WinSxS (Use comando DISM)" },
        { label: "Ganho Médio", value: "10GB a 40GB" },
        { label: "Risco", value: "Baixo (Se seguir o guia)" },
        { label: "Frequência", value: "Mensal" }
    ];

    const contentSections = [
        {
            title: "Onde o espaço some?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Você desinstala jogos, apaga vídeos, mas o HD continua enchendo. O Windows acumula: cópias de atualizações antigas (Windows.old), arquivos de hibernação (hiberfil.sys), memória virtual (pagefile.sys) e cache de erro.
        </p>

        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20 my-8">
            <h4 class="text-[#31A8FF] font-bold mb-3 flex items-center gap-2">
                <span class="text-xl">🧹</span> Limpeza Smart
            </h4>
            <p class="text-gray-300 mb-4">
                Por que fazer isso manualmente todo mês? O <strong>Voltris Optimizer</strong> monitora suas pastas temporárias e caches de navegador (Chrome/Edge), limpando automaticamente o lixo inútil a cada inicialização, mantendo seu SSD sempre rápido e livre.
            </p>
            <a href="/voltrisoptimizer" class="group relative inline-flex px-8 py-3 bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-white font-bold text-base rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-[1.03] hover:shadow-[0_0_60px_rgba(139,49,255,0.4)] items-center justify-center gap-2">
                Limpeza Automática Voltris
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
            </a>
        </div>
      `
        },
        {
            title: "Passo 1: A opção escondida do 'Limpeza de Disco'",
            content: `
        <p class="mb-4 text-gray-300">
            A ferramenta nativa do Windows é ótima, mas muita gente usa errado.
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4 bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
            <li>Pressione Win, digite <strong>"Limpeza de Disco"</strong> e abra.</li>
            <li>Escolha a unidade C:.</li>
            <li>Quando abrir, NÃO clique em OK ainda. Clique no botão <strong>"Limpar arquivos do sistema"</strong> com ícone de escudo.</li>
            <li>Ele vai escanear de novo. Agora sim, aparecerão os gigabytes reais.</li>
            <li>Marque:
                <ul class="ml-6 mt-2 text-sm text-[#31A8FF] list-none space-y-1">
                    <li>[x] Limpeza do Windows Update (Pode ter 5GB+)</li>
                    <li>[x] Arquivos de Otimização de Entrega</li>
                    <li>[x] Instalações anteriores do Windows (Pode ter 20GB+)</li>
                    <li>[x] Lixeira</li>
                </ul>
            </li>
            <li>Clique em OK e Excluir Arquivos.</li>
        </ol>
      `
        },
        {
            title: "Passo 2: Desativar Hibernação (Economize 6GB+)",
            content: `
        <p class="mb-4 text-gray-300">
            Se você usa SSD, o computador liga em 10 segundos. A hibernação (que salva a RAM no HD para ligar rápido) é inútil e ocupa um espaço igual à sua memória RAM.
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
            <li>Abra o Prompt de Comando (CMD) como Administrador.</li>
            <li>Digite: <code>powercfg.exe /hibernate off</code></li>
            <li>Pronto. O arquivo <code>hiberfil.sys</code> (que é enorme e oculto) sumirá instantaneamente da raiz do C:.</li>
        </ul>
      `
        },
        {
            title: "Passo 3: Visualizar o que gasta espaço (WizTree)",
            content: `
        <p class="mb-4 text-gray-300">
            Às vezes o vilão é uma pasta de jogo que você esqueceu. O Explorador de Arquivos é ruim para mostrar isso.
        </p>
        <p class="mb-4 text-gray-300">
             Baixe o <strong>WizTree</strong> (é 50x mais rápido que o WinDirStat). Ele mostra um mapa colorido de quadrados. Os quadrados grandes são os arquivos grandes. Delete o que não precisa (Cuidado para não deletar arquivos do Windows folder).
        </p>
        <div class="mt-4 p-4 border border-yellow-500/20 bg-yellow-900/10 rounded-lg">
             <p class="text-yellow-200 text-sm"><strong>Dica:</strong> Procure por <code>installer</code> na pasta do LoL ou da Nvidia. Às vezes eles guardam instaladores antigos de 500MB cada.</p>
        </div>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Pasta SoftwareDistribution (Correção de Updates)",
            content: `
            <div class="bg-gray-800/50 p-6 rounded-xl border border-gray-700 mb-8">
                <h4 class="text-white font-bold mb-4 text-xl">Lixo de Download</h4>
                <p class="text-gray-300 mb-4">
                    Quando o Windows baixa uma atualização, ele guarda em <code>C:\\Windows\\SoftwareDistribution\\Download</code>. Depois de instalar, isso deveria ser apagado, mas nem sempre é.
                </p>
                <ol class="list-decimal list-inside text-gray-300 space-y-2 ml-4">
                    <li>Pare o serviço Windows Update (Win+R > services.msc > Windows Update > Parar).</li>
                    <li>Vá na pasta citada acima e apague TUDO dentro da pasta Download.</li>
                    <li>Inicie o serviço novamente.</li>
                    <li>Isso também conserta erros de atualização travada.</li>
                </ol>
            </div>
            `
        }
    ];

    const additionalContentSections = [
        {
            title: "Sense de Armazenamento (Automático)",
            content: `
            <p class="mb-4 text-gray-300">
                O Windows 10/11 tem um "faxineiro" nativo.
            </p>
            <p class="text-gray-300 text-sm">
                Vá em <strong>Configurações > Sistema > Armazenamento</strong>. Ative o "Sentido de Armazenamento" (Storage Sense). Configure para rodar "Toda semana" e apagar arquivos da Lixeira com mais de 14 dias.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Posso apagar a pasta WinSxS?",
            answer: "NUNCA apague essa pasta manualmente pelo Explorer. Ela contém arquivos essenciais de backup do sistema (DLLs). Se você apagar, o Windows morre. Para reduzir o tamanho dela com segurança, use o comando: <code>dism.exe /online /Cleanup-Image /StartComponentCleanup</code> no CMD Admin."
        },
        {
            question: "CCleaner é bom?",
            answer: "Não recomendamos mais o CCleaner em 2026. O Windows já faz tudo o que ele fazia de forma mais segura. Ferramentas de limpeza de registro agressivas podem causar telas azuis. Use as ferramentas nativas ou softwares focados em otimização segura como o Voltris Optimizer."
        },
        {
            question: "Apagar a pasta Prefetch deixa o PC lento?",
            answer: "No primeiro boot, sim. A pasta Prefetch ajuda o Windows a abrir programas mais rápido. Se você apagar, ele terá que 'reaprender' seus hábitos. Só apague se estiver enfrentando problemas com algum programa específico."
        }
    ];

    const externalReferences = [
        { name: "Microsoft - Disk Cleanup Guide", url: "https://support.microsoft.com/en-us/windows/disk-cleanup-in-windows-10-8a96ff42-5751-39ad-23d6-434b4d5b9a68" },
        { name: "WizTree Download", url: "https://diskanalyzer.com/" }
    ];

    const relatedGuides = [
        {
            href: "/guias/pasta-windows-winsxs-gigante-como-limpar",
            title: "Guia WinSxS",
            description: "Aprofundamento na limpeza da pasta mais complexa do Windows."
        },
        {
            href: "/guias/debloating-windows-11",
            title: "Debloat",
            description: "Remova apps que ocupam espaço inútil."
        },
        {
            href: "/guias/otimizacao-ssd-windows-11",
            title: "Otimizar SSD",
            description: "Mantenha a performance após a limpeza."
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
            advancedContentSections={advancedContentSections}
            additionalContentSections={additionalContentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
            faqItems={faqItems}
            externalReferences={externalReferences}
        />
    );
}
