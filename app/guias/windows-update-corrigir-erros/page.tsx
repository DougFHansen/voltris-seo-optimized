import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'windows-update-corrigir-erros',
    title: "Como Corrigir Erros do Windows Update: Script Reset Completo (2026)",
    description: "O Windows Update travou em 0% ou deu erro 0x80070002? Aprenda a reiniciar os serviços wuauserv, bits e cryptsvc e limpar o cache de download corrupto.",
    category: 'windows-erros',
    difficulty: 'Intermediário',
    time: '15 min'
};

const title = "Windows Update Travado ou com Erro? Guia de Reparo Definitivo (2026)";
const description = "Se o seu PC não atualiza, você está vulnerável. Descubra como forçar a atualização, limpar a pasta SoftwareDistribution e usar o DISM para consertar o update.";

const keywords = [
    'windows update erro 0x80070002 resolver',
    'atualização windows 11 travada baixando 0%',
    'como reiniciar serviço windows update cmd',
    'apagar pasta softwaredistribution acesso negado',
    'ferramenta de solução de problemas windows update',
    'dism restorehealth windows update fix',
    'wuauclt detectnow comando para que serve',
    'erro 0x800f081f windows 11'
];

export const metadata: Metadata = createGuideMetadata('windows-update-corrigir-erros', title, description, keywords);

export default function WindowsUpdateGuide() {
    const summaryTable = [
        { label: "Ferramenta", value: "CMD (Admin)" },
        { label: "Pasta Alvo", value: "C:\\Windows\\SoftwareDistribution" },
        { label: "Serviço Principal", value: "wuauserv" },
        { label: "Complexidade", value: "Média (Linha de Comando)" },
        { label: "Risco", value: "Baixo" },
        { label: "Tempo", value: "15 min" }
    ];

    const contentSections = [
        {
            title: "Por que o Windows Update trava?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O Windows Update é um sistema complexo que depende de vários serviços (BITS, Cryptographic, Installer) trabalhando em harmonia. Se a internet cair durante um download ou se o PC desligar no meio da instalação, os arquivos na pasta de cache (SoftwareDistribution) ficam corrompidos. O sistema tenta ler esse arquivo quebrado, falha e entra em loop infinito.
        </p>

        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20 my-8">
            <h4 class="text-[#31A8FF] font-bold mb-3 flex items-center gap-2">
                <span class="text-xl">🔧</span> Reparador Automático Voltris
            </h4>
            <p class="text-gray-300 mb-4">
                Executar comandos de parada de serviço manualmente é chato. O <strong>Voltris Optimizer</strong> possui um botão "Fix Windows Update" que para os serviços, limpa o cache, redefine as DLLs de registro e reinicia tudo para você em 5 segundos.
            </p>
            <a href="/voltrisoptimizer" class="group relative inline-flex px-8 py-3 bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-white font-bold text-base rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-[1.03] hover:shadow-[0_0_60px_rgba(139,49,255,0.4)] items-center justify-center gap-2">
                Corrigir Updates com Voltris
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
            </a>
        </div>
      `
        },
        {
            title: "Método 1: Solução de Problemas Nativa",
            content: `
        <p class="mb-4 text-gray-300">
            Antes de ir para códigos complexos, tente o básico que funciona em 30% dos casos.
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4">
            <li>Vá em <strong>Configurações > Sistema > Solução de Problemas</strong>.</li>
            <li>Clique em <strong>Outras soluções de problemas</strong>.</li>
            <li>Ao lado de <strong>Windows Update</strong>, clique em <strong>Executar</strong>.</li>
            <li>O Windows tentará reiniciar os serviços automaticamente.</li>
        </ol>
      `
        },
        {
            title: "Método 2: O Reset Manual (CMD) - Eficácia 99%",
            content: `
        <p class="mb-4 text-gray-300">
            Se o método acima não funcionou, vamos fazer "cirurgia" no sistema. Precisamos parar os serviços para liberar a pasta de download.
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4 bg-[#0A0A0F] p-4 rounded-xl border border-white/5 font-mono text-xs">
            <li>Abra o <strong>CMD como Administrador</strong>.</li>
            <li>Digite os comandos abaixo, UM POR UM, esperando cada um terminar:</li>
            <div class="mt-4 space-y-2 text-[#31A8FF]">
                <p>net stop wuauserv</p>
                <p>net stop cryptSvc</p>
                <p>net stop bits</p>
                <p>net stop msiserver</p>
            </div>
            <p class="py-2 text-gray-500">Agora vamos renomear as pastas corrompidas (o Windows criará novas automaticamente):</p>
            <div class="space-y-2 text-[#31A8FF]">
                <p>ren C:\\Windows\\SoftwareDistribution SoftwareDistribution.old</p>
                <p>ren C:\\Windows\\System32\\catroot2 Catroot2.old</p>
            </div>
            <p class="py-2 text-gray-500">Agora reiniciamos os serviços:</p>
            <div class="space-y-2 text-[#31A8FF]">
                <p>net start wuauserv</p>
                <p>net start cryptSvc</p>
                <p>net start bits</p>
                <p>net start msiserver</p>
            </div>
            <li>Feche o CMD e tente atualizar novamente. Pode demorar um pouco pois ele vai baixar tudo do zero.</li>
        </ol>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Erro 0x800f081f ou Arquivos de Sistema Ausentes",
            content: `
            <div class="bg-gray-800/50 p-6 rounded-xl border border-gray-700 mb-8">
                <h4 class="text-red-400 font-bold mb-4 text-xl">Imagem do Windows Danificada</h4>
                <p class="text-gray-300 mb-4">
                    Se o Windows Update falha porque faltam arquivos base no próprio Windows, precisamos usar o DISM para baixar cópias originais da Microsoft.
                </p>
                <p class="text-gray-300 text-sm font-mono bg-black p-2 rounded">
                    dism /online /cleanup-image /restorehealth
                </p>
                <p class="text-gray-300 text-sm mt-2">
                    Esse comando demora uns 15-20 minutos e parece que travou em 62.3%, mas é normal. Espere terminar.
                </p>
            </div>
            `
        }
    ];

    const additionalContentSections = [
        {
            title: "Baixar Atualização Manualmente (Catálogo)",
            content: `
            <p class="mb-4 text-gray-300">
                Se apenas UMA atualização específica (ex: KB5034441) está dando erro e as outras funcionam, você pode instalá-la manualmente.
            </p>
            <ol class="list-decimal list-inside text-gray-300 space-y-2 ml-4">
                <li>Anote o código (Ex: KB123456).</li>
                <li>Vá no site <strong>Catálogo do Microsoft Update</strong> (Microsoft Update Catalog).</li>
                <li>Pesquise pelo código.</li>
                <li>Baixe o arquivo .msu correspondente à sua versão (x64 Windows 11).</li>
                <li>Execute o arquivo para instalar offline.</li>
            </ol>
            `
        }
    ];

    const faqItems = [
        {
            question: "Posso ficar sem atualizar o Windows?",
            answer: "Não recomendado. Além de recursos novos, as atualizações corrigem falhas de segurança graves (vírus e hackers). Se uma atualização específica estiver quebrando seu PC, você pode pausar por 7 dias, mas não desative para sempre."
        },
        {
            question: "O erro 0x80070002 persiste, o que fazer?",
            answer: "Isso geralmente é hora/data errada ou partição de boot corrompida. Verifique se o relógio do Windows está certo. Se estiver, pode ser necessário usar o comando 'chkdsk /f' para reparar o disco."
        },
        {
            question: "Windows Update deixa o PC lento?",
            answer: "Durante o download e instalação, sim (usa muito disco e CPU). Por isso configure o 'Horário Ativo' nas configurações para que ele não instale enquanto você está trabalhando ou jogando."
        }
    ];

    const externalReferences = [
        { name: "Microsoft Update Catalog", url: "https://www.catalog.update.microsoft.com/" },
        { name: "Script Reset Windows Update (Microsoft)", url: "https://learn.microsoft.com/en-us/troubleshoot/windows-client/deployment/additional-resources-for-windows-update" }
    ];

    const relatedGuides = [
        {
            href: "/guias/como-resolver-tela-azul",
            title: "Reparar Sistema",
            description: "Comandos SFC e DISM explicados."
        },
        {
            href: "/guias/limpeza-disco-profunda-arquivos-temporarios",
            title: "Limpar Disco",
            description: "Como apagar a pasta Windows.old."
        },
        {
            href: "/guias/otimizacao-ssd-windows-11",
            title: "Otimizar SSD",
            description: "Melhore a velocidade de instalação dos updates."
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
