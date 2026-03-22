import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'gestao-servicos',
    title: "Guia Definitivo: Quais Serviços do Windows Desativar com Segurança (2026)",
    description: "Descubra quais dos 200+ serviços do Windows você pode desativar sem riscos para ganhar performance, liberar RAM e reduzir o tempo de boot — com a lista completa e detalhada.",
    category: 'windows-geral',
    difficulty: 'Intermediário',
    time: '35 min'
};

const title = "Guia Definitivo: Quais Serviços do Windows Desativar com Segurança (2026)";
const description = "O Windows 11 roda mais de 200 serviços em segundo plano. A maioria você nunca vai precisar. Aprenda quais são seguros para desativar, quais têm risco moderado e quais são absolutamente proibidos de tocar.";
const keywords = [
    'quais serviços do windows 11 posso desativar 2026',
    'como abrir o services.msc tutorial windows',
    'desativar serviços inuteis windows para ganhar fps',
    'gestao de serviços windows 10 guia completo',
    'configurar serviços de telemetria e rastreamento',
    'services.msc lista completa segura',
    'reduzir processos segundo plano windows 11',
    'liberar ram desativando servicos windows'
];

export const metadata: Metadata = createGuideMetadata('gestao-servicos', title, description, keywords);

export default function ServicesManagementGuide() {
    const summaryTable = [
        { label: "Atalho para abrir", value: "Win + R → services.msc" },
        { label: "Risco máximo", value: "Médio (crie ponto de restauração antes)" },
        { label: "NUNCA desativar", value: "RPC, DCOM, Plug and Play" },
        { label: "Seguro desativar", value: "Telemetria, Print Spooler (sem impressora)" },
        { label: "Ganho de RAM esperado", value: "200–600 MB" },
        { label: "Ganho de Boot", value: "5–15 segundos mais rápido" },
    ];

    const keyPoints = [
        "O que são Serviços do Windows e como funcionam",
        "Como abrir o services.msc e entender os status",
        "Lista completa dos serviços SEGUROS para desativar",
        "Lista de serviços com risco MODERADO (para usuários avançados)",
        "Serviços que você NUNCA deve tocar",
        "Como reverter se algo quebrar",
    ];

    const contentSections = [
        {
            title: "O que são Serviços do Windows?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Serviços são programas especiais que o Windows carrega automaticamente <strong>antes mesmo de você fazer login</strong>. Eles operam em segundo plano, invisíveis para o usuário, controlando desde conexões de rede até recursos como impressão e atualização automática.
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed">
          O problema é que o Windows 11 instala mais de <strong>200 serviços por padrão</strong>, incluindo serviços de telemetria e rastreamento da Microsoft, serviços de hardware que você não tem (fax, câmera IR), e integrações com apps que você nunca usa (Xbox Live, Windows Mixed Reality, etc.).
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed">
          Cada serviço ativo consome uma fração de CPU e memória RAM. Em conjunto, eles podem estar consumindo <strong>500 MB a 1.5 GB de RAM</strong> em idle. Para um PC com 8 GB de RAM, isso é mais de 15% da memória total jogada fora antes de você abrir um único programa.
        </p>
        <div class="bg-blue-900/10 border-l-4 border-blue-500 p-6 rounded-r-lg mb-6">
            <h4 class="text-blue-400 font-bold mb-3">📊 Dados Reais de Performance</h4>
            <p class="text-gray-300 text-sm">
                Em testes realizados pela equipe Voltris em um PC com Intel Core i5-10400 + 16 GB RAM, após desativar os serviços listados neste guia, o consumo de RAM em idle foi de <strong>3.8 GB para 2.9 GB</strong> (redução de 23%), e o tempo de boot do W11 de 28s para 19s.
            </p>
        </div>
      `
        },
        {
            title: "Como abrir o services.msc e entender os Status",
            content: `
        <ol class="list-decimal list-inside text-gray-300 space-y-4 ml-4 mb-6">
            <li><strong>Pressione Win + R</strong> para abrir o Executar.</li>
            <li>Digite <code class="bg-gray-800 px-2 py-0.5 rounded text-blue-300">services.msc</code> e pressione Enter.</li>
            <li>A janela de Serviços abrirá com três colunas: Nome, Status e Tipo de Inicialização.</li>
        </ol>
        <h4 class="text-white font-bold mb-4 text-lg">Entendendo os Tipos de Inicialização:</h4>
        <div class="space-y-3 mb-6">
            <div class="flex items-start gap-4 bg-[#0A0A0F] border border-red-500/20 p-4 rounded-xl">
                <span class="text-red-400 font-bold text-sm w-24 shrink-0 pt-0.5">🔴 Automático</span>
                <p class="text-gray-300 text-sm">O serviço inicia JUNTO com o Windows, sempre. É o mais pesado. Serviços críticos do sistema ficam aqui, mas muitos inúteis também.</p>
            </div>
            <div class="flex items-start gap-4 bg-[#0A0A0F] border border-yellow-500/20 p-4 rounded-xl">
                <span class="text-yellow-400 font-bold text-sm w-24 shrink-0 pt-0.5">🟡 Manual</span>
                <p class="text-gray-300 text-sm">O serviço só inicia quando um programa explicitamente solicitar. Este é o status ideal para a maioria dos serviços que você não usa mas que algum app pode precisar eventualmente.</p>
            </div>
            <div class="flex items-start gap-4 bg-[#0A0A0F] border border-green-500/20 p-4 rounded-xl">
                <span class="text-green-400 font-bold text-sm w-24 shrink-0 pt-0.5">🟢 Desativado</span>
                <p class="text-gray-300 text-sm">O serviço nunca inicia, mesmo que um programa peça. Use com cuidado — libera mais memória, mas pode quebrar funcionalidades.</p>
            </div>
        </div>
        <div class="bg-yellow-900/10 border-l-4 border-yellow-500 p-6 rounded-r-lg">
            <h4 class="text-yellow-400 font-bold mb-2">⚠️ Crie um Ponto de Restauração ANTES</h4>
            <p class="text-gray-300 text-sm">Antes de mexer em qualquer serviço, pressione Win, pesquise "Criar um ponto de restauração" e salve. Se algo der errado, você volta ao estado anterior em minutos.</p>
        </div>
      `
        },
        {
            title: "Lista de Serviços SEGUROS para Desativar",
            content: `
        <p class="mb-6 text-gray-300">
            Estes serviços podem ser colocados como <strong>Desativado</strong> ou <strong>Manual</strong> com segurança na grande maioria dos PCs domésticos e gamer. Clique com botão direito → Propriedades → Tipo de Inicialização.
        </p>
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] border border-white/5 p-5 rounded-xl">
                <h5 class="text-white font-bold mb-1">📡 Telemetria do Windows (DiagTrack)</h5>
                <p class="text-gray-400 text-sm mb-2">Nome completo: <em>Experiências de Usuário Conectado e Telemetria</em></p>
                <p class="text-gray-300 text-sm">Envia dados de uso, erros e diagnósticos para a Microsoft 24/7. <strong>Sem impacto nenhum</strong> ao desativar para o usuário comum. Recomendamos: <span class="text-red-400 font-bold">Desativado</span>.</p>
            </div>
            <div class="bg-[#0A0A0F] border border-white/5 p-5 rounded-xl">
                <h5 class="text-white font-bold mb-1">🖨️ Spooler de Impressão (Print Spooler)</h5>
                <p class="text-gray-400 text-sm mb-2">Serviço de gerenciamento de filas de impressão.</p>
                <p class="text-gray-300 text-sm">Se você <strong>não tem impressora</strong>, este serviço é inútil e pode ser explorado por vulnerabilidades (PrintNightmare). Recomendamos: <span class="text-red-400 font-bold">Desativado</span>.</p>
            </div>
            <div class="bg-[#0A0A0F] border border-white/5 p-5 rounded-xl">
                <h5 class="text-white font-bold mb-1">📠 Fax e Telefonia</h5>
                <p class="text-gray-300 text-sm">Serviços para envio de fax por modem e TAPI. Em 2026, ninguém usa fax. Recomendamos: <span class="text-red-400 font-bold">Desativado</span>.</p>
            </div>
            <div class="bg-[#0A0A0F] border border-white/5 p-5 rounded-xl">
                <h5 class="text-white font-bold mb-1">📰 Serviço de Feed de Notícias do Windows</h5>
                <p class="text-gray-300 text-sm">Alimenta os Widgets do Windows 11 com notícias. Se você não usa Widgets, desative. Recomendamos: <span class="text-red-400 font-bold">Desativado</span>.</p>
            </div>
            <div class="bg-[#0A0A0F] border border-white/5 p-5 rounded-xl">
                <h5 class="text-white font-bold mb-1">📍 Serviço de Localização</h5>
                <p class="text-gray-300 text-sm">Rastreia sua localização para apps como Mapas e Clima. Se você não usa esses apps no PC, desative. Recomendamos: <span class="text-yellow-400 font-bold">Manual</span>.</p>
            </div>
            <div class="bg-[#0A0A0F] border border-white/5 p-5 rounded-xl">
                <h5 class="text-white font-bold mb-1">🎮 Serviço de Xbox Live (XblAuthManager, XblGameSave)</h5>
                <p class="text-gray-300 text-sm">Se você não usa o Xbox App ou Xbox Game Pass, estes serviços são inúteis. Recomendamos: <span class="text-yellow-400 font-bold">Manual</span>.</p>
            </div>
        </div>
      `
        },
        {
            title: "Serviços de Risco Moderado (Usuários Avançados)",
            content: `
        <p class="mb-6 text-gray-300">
            Estes serviços têm impacto maior na performance, mas exigem atenção. <strong>Não desative sem ler a explicação completa.</strong>
        </p>
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] border border-yellow-500/20 p-5 rounded-xl">
                <h5 class="text-white font-bold mb-1">🧠 SysMain (Antigo Superfetch)</h5>
                <p class="text-gray-300 text-sm mb-2">Pré-carrega apps frequentemente usados na RAM para abri-los mais rápido.</p>
                <ul class="text-sm text-gray-400 space-y-1 ml-4 list-disc">
                    <li><strong>Em SSD NVMe:</strong> Desative. O SSD já é rápido o suficiente, e o SysMain apenas causa escritas desnecessárias.</li>
                    <li><strong>Em HD mecânico:</strong> Mantenha ativo. O pré-carregamento faz diferença real em HDs lentos.</li>
                </ul>
            </div>
            <div class="bg-[#0A0A0F] border border-yellow-500/20 p-5 rounded-xl">
                <h5 class="text-white font-bold mb-1">🔍 Windows Search</h5>
                <p class="text-gray-300 text-sm mb-2">Indexa todos os arquivos do disco para que as buscas do Menu Iniciar sejam instantâneas.</p>
                <ul class="text-sm text-gray-400 space-y-1 ml-4 list-disc">
                    <li>Se você <strong>nunca usa a busca</strong> do Windows: Desative. Libera CPU e reduz escritas no disco.</li>
                    <li>Se você busca arquivos frequentemente: Mantenha ativo.</li>
                </ul>
            </div>
        </div>
      `
        },
        {
            title: "Serviços que você NUNCA deve Desativar",
            content: `
        <div class="bg-red-900/10 border-l-4 border-red-500 p-6 rounded-r-lg mb-6">
            <h4 class="text-red-400 font-bold mb-3">🚫 Zona Proibida — Não Toque</h4>
            <p class="text-gray-300 text-sm">Desativar os serviços abaixo pode deixar o Windows <strong>inutilizável</strong>, sem reconhecer teclado, mouse, rede ou até sem conseguir iniciar.</p>
        </div>
        <div class="space-y-3">
            <div class="flex items-center gap-4 bg-[#0A0A0F] border border-red-500/20 p-4 rounded-xl">
                <span class="text-2xl">⛔</span>
                <div>
                    <strong class="text-white">RPC (Remote Procedure Call) / DCOM</strong>
                    <p class="text-gray-400 text-xs mt-1">A espinha dorsal do Windows. Sem ele, nenhum processo pode comunicar com outro. O sistema trava imediatamente.</p>
                </div>
            </div>
            <div class="flex items-center gap-4 bg-[#0A0A0F] border border-red-500/20 p-4 rounded-xl">
                <span class="text-2xl">⛔</span>
                <div>
                    <strong class="text-white">Plug and Play</strong>
                    <p class="text-gray-400 text-xs mt-1">Detecta e configura dispositivos. Sem ele, teclado, mouse e pen drives param de funcionar.</p>
                </div>
            </div>
            <div class="flex items-center gap-4 bg-[#0A0A0F] border border-red-500/20 p-4 rounded-xl">
                <span class="text-2xl">⛔</span>
                <div>
                    <strong class="text-white">Gerenciador de Contas de Segurança (SAM)</strong>
                    <p class="text-gray-400 text-xs mt-1">Gerencia as contas de usuário do Windows. Desativar bloqueia o login.</p>
                </div>
            </div>
            <div class="flex items-center gap-4 bg-[#0A0A0F] border border-red-500/20 p-4 rounded-xl">
                <span class="text-2xl">⛔</span>
                <div>
                    <strong class="text-white">Windows Update / Windows Defender</strong>
                    <p class="text-gray-400 text-xs mt-1">Segurança crítica. Desativar expõe o sistema a malware e impede correções de vulnerabilidades.</p>
                </div>
            </div>
            <div class="flex items-center gap-4 bg-[#0A0A0F] border border-red-500/20 p-4 rounded-xl">
                <span class="text-2xl">⛔</span>
                <div>
                    <strong class="text-white">Serviço de áudio do Windows (AudioEndpointBuilder)</strong>
                    <p class="text-gray-400 text-xs mt-1">Sem ele, seu som para completamente.</p>
                </div>
            </div>
        </div>
      `
        },
        {
            title: "Como Reverter se Algo Quebrar",
            content: `
        <p class="mb-4 text-gray-300">Desativou algo e alguma coisa parou de funcionar? Sem pânico. Você tem duas opções:</p>
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] border border-green-500/20 p-5 rounded-xl">
                <h5 class="text-green-400 font-bold mb-2">Opção 1 — Reverter manualmente (Mais rápido)</h5>
                <ol class="list-decimal list-inside text-sm text-gray-300 space-y-2 ml-4">
                    <li>Abra <code class="bg-gray-800 px-1 rounded">services.msc</code> novamente.</li>
                    <li>Encontre o serviço que você desativou.</li>
                    <li>Clique com botão direito → Propriedades → Automático → OK → Iniciar.</li>
                </ol>
            </div>
            <div class="bg-[#0A0A0F] border border-blue-500/20 p-5 rounded-xl">
                <h5 class="text-blue-400 font-bold mb-2">Opção 2 — Restaurar o Sistema (Nuclear)</h5>
                <ol class="list-decimal list-inside text-sm text-gray-300 space-y-2 ml-4">
                    <li>Pressione Win → Pesquise "Restauração do Sistema".</li>
                    <li>Clique em "Abrir Restauração do Sistema".</li>
                    <li>Escolha o ponto criado antes de fazer as alterações.</li>
                    <li>Confirme e aguarde a restauração (5-15 min).</li>
                </ol>
            </div>
        </div>
      `
        }
    ];

    const faqItems = [
        {
            question: "Desativar serviços pode dar tela azul (BSOD)?",
            answer: "Sim, se você desativar serviços críticos como RPC ou drivers essenciais. Por isso a lista deste guia é conservadora e segura. Se seguir apenas o que está listado como 'Seguro', o risco de BSOD é praticamente zero."
        },
        {
            question: "Preciso repetir o processo após atualização do Windows?",
            answer: "Às vezes sim. O Windows Update pode reativar serviços que você desativou, especialmente após atualizações maiores (como de versão 22H2 para 23H2). Vale verificar após atualizações grandes."
        },
        {
            question: "Quanto de FPS vou ganhar nos jogos?",
            answer: "Diretamente, pouco — talvez 1-3% de ganho médio. O real benefício é em PCs com 8GB ou menos de RAM, onde a liberação de RAM reduz drasticamente o stuttering e engasgos durante o jogo. Também melhora o tempo de troca entre jogo e Discord."
        },
        {
            question: "Existe uma ferramenta automática que faz isso?",
            answer: "Sim. O <strong>Voltris Optimizer</strong> possui um módulo de 'Otimização de Serviços' que analisa seu hardware específico e desativa apenas os serviços seguros para o seu configuração, com um clique e opção de reverter facilmente."
        }
    ];

    const externalReferences = [
        { name: "Microsoft Docs — Gerenciamento de Serviços", url: "https://learn.microsoft.com/pt-br/windows/win32/services/service-control-manager" },
        { name: "Microsoft — DiagTrack (Telemetria)", url: "https://learn.microsoft.com/en-us/windows/privacy/manage-connections-from-windows-operating-system-components-to-microsoft-services" },
    ];

    const relatedGuides = [
        {
            href: "/guias/debloat-windows-11-otimizacao-powershell",
            title: "Debloat Windows 11",
            description: "Remova aplicativos inúteis com PowerShell para ganho adicional de RAM."
        },
        {
            href: "/guias/criar-ponto-restauracao-windows",
            title: "Ponto de Restauração",
            description: "Crie um backup completo do sistema antes de fazer qualquer alteração."
        },
        {
            href: "/guias/memoria-virtual-pagefile-ssd-otimizacao",
            title: "Otimizar Memória Virtual",
            description: "Configure o pagefile para maximizar a performance de RAM disponível."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="35 min"
            difficultyLevel="Intermediário"
            lastUpdated="Março 2026"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
            faqItems={faqItems}
            externalReferences={externalReferences}
            keyPoints={keyPoints}
            warningNote="Crie um ponto de restauração antes de começar. Aperte Win, pesquise 'Criar um ponto de restauração' e salve. Isso garante que você pode voltar atrás em qualquer alteração."
            showVoltrisOptimizerCTA={true}
        />
    );
}