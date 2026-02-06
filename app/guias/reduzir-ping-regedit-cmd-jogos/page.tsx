import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'reduzir-ping-regedit-cmd-jogos',
    title: "Reduzir Ping 2026: Comandos CMD, Regedit e Otimização TCP/IP",
    description: "Ping alto? Aprenda a desativar o Nagle's Algorithm (TCPAckFrequency), configurar o DNS e otimizar o adaptador de rede para jogos competitivos.",
    category: 'rede-seguranca',
    difficulty: 'Avançado',
    time: '30 min'
};

const title = "Engenharia de Rede: Como reduzir a latência (Ping) via Regedit";
const description = "O Windows vem configurado para baixar arquivos rápido, não para enviar pacotes de jogo rápido. Vamos mudar o foco do TCP/IP para priorizar latência.";

const keywords = [
    'reduzir ping regedit windows 11',
    'tcpnodelay regedit script',
    'tcpackfrequency 1 gaming',
    'networkthrottlingindex ffffffff',
    'desativar nagles algorithm windows 11',
    'como melhorar jitter internet',
    'dns cloudflare vs google ping',
    'otimizar ethernet settings adapter'
];

export const metadata: Metadata = createGuideMetadata('reduzir-ping-regedit-cmd-jogos', title, description, keywords);

export default function PingGuide() {
    const summaryTable = [
        { label: "Nagle's Algo", value: "Desativado (TCPNoDelay)" },
        { label: "Network Throttling", value: "FFFFFFFF (Ilimitado)" },
        { label: "Adapter Energy", value: "Desempenho Máximo" },
        { label: "IP Connection", value: "Cabo Ethernet (CAT6)" },
        { label: "DNS", value: "1.1.1.1 ou 8.8.8.8" },
        { label: "Jitter", value: "Prioridade Real-Time" },
        { label: "Dificuldade", value: "Avançado (Regedit)" }
    ];

    const contentSections = [
        {
            title: "O que é o Nagle's Algorithm?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Imagine um ônibus que só sai da estação quando está cheio. Isso é eficiente para transportar muita gente (download), mas ruim se você tiver pressa (jogos). O Nagle's Algorithm faz o Windows esperar juntar vários pacotes pequenos de dados antes de enviá-los de uma vez.
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed">
          Em jogos online, queremos enviar CADA clique do mouse IMEDIATAMENTE, mesmo que o pacote seja minúsculo. Desativar esse algoritmo reduz o ping em 10-20ms em alguns jogos (MMORPGs sentem mais, FPS também).
        </p>

        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20 my-8">
            <h4 class="text-[#31A8FF] font-bold mb-3 flex items-center gap-2">
                <span class="text-xl">🌐</span> Network Booster via Voltris
            </h4>
            <p class="text-gray-300 mb-4">
                Editar chaves hexadecimais no Regedit é perigoso. Se você errar uma letra, pode perder a internet. O <strong>Voltris Optimizer</strong> aplica o script "TCP Optimizer" que configura automaticamente o Nagle's Algorithm e o MTU ideal para sua conexão com um clique seguro.
            </p>
            <a href="/voltrisoptimizer" class="text-[#31A8FF] hover:underline font-bold">Otimizar Minha Internet &rarr;</a>
        </div>
      `
        },
        {
            title: "Passo 1: TCPAckFrequency e TCPNoDelay (Regedit)",
            content: `
        <div class="bg-[#0A0A0F] p-6 rounded-xl border border-white/5 space-y-4">
            <h4 class="text-white font-bold mb-2">Procedimento Manual:</h4>
            <ol class="list-decimal list-inside text-gray-300 text-sm space-y-3 font-mono">
                <li><kbd class="bg-white/10 px-2 rounded">Win + R</kbd>, digite <code>regedit</code>.</li>
                <li>Navegue até: <code>HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters\\Interfaces</code>.</li>
                <li>Você verá várias pastas com nomes estranhos (GUIDs). Clique em cada uma até encontrar a que tem o seu IP (ex: 192.168.1.X) na direita. Essa é sua placa de rede ativa.</li>
                <li>Clique com botão direito no espaço branco > Novo > <strong>Valor DWORD (32 bits)</strong>.</li>
                <li>Nomeie como: <code class="text-emerald-400">TcpAckFrequency</code>. Dê Enter. Abra e coloque valor <strong>1</strong>.</li>
                <li>Crie outro DWORD. Nomeie como: <code class="text-emerald-400">TCPNoDelay</code>. Dê Enter. Abra e coloque valor <strong>1</strong>.</li>
                <li>Reinicie o PC.</li>
            </ol>
        </div>
      `
        },
        {
            title: "Passo 2: Network Throttling Index",
            content: `
        <p class="mb-4 text-gray-300">
            O Windows limita o tráfego de rede de processos não-multimídia para economizar bateria. PC Gamer não quer economia.
        </p>
        <ol class="list-decimal list-inside text-gray-300 text-sm space-y-2">
            <li>No Regedit, vá em: <code>HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile</code>.</li>
            <li>Encontre <code>NetworkThrottlingIndex</code>.</li>
            <li>O padrão é <code>10</code> (decimal). Mude para <code>FFFFFFFF</code> (Hexadecimal). Isso desativa o limitador completamente.</li>
        </ol>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Configurações do Adaptador (Ethernet)",
            content: `
            <div class="bg-gray-800/50 p-6 rounded-xl border border-gray-700 mb-8">
                <h4 class="text-emerald-400 font-bold mb-4 text-xl">Gerenciador de Dispositivos</h4>
                <p class="text-gray-300 mb-4">
                    As placas de rede (Realtek, Intel) vêm cheias de funções "Green" (Verdes) que desligam a placa no meio do jogo.
                </p>
                <ul class="list-disc list-inside text-gray-300 text-sm space-y-2">
                    <li>Vá em Gerenciador de Dispositivos > Adaptadores de Rede > Sua Placa > Avançado.</li>
                    <li><strong>Energy Efficient Ethernet (EEE):</strong> <span class="text-red-400">Desativar</span>.</li>
                    <li><strong>Green Ethernet:</strong> <span class="text-red-400">Desativar</span>.</li>
                    <li><strong>Power Saving Mode:</strong> <span class="text-red-400">Desativar</span>.</li>
                    <li><strong>WOL & Shutdown Link Speed:</strong> Não mudar.</li>
                    <li><strong>Gerenciamento de Energia (Aba):</strong> Desmarque "O computador pode desligar o dispositivo para economizar energia". CRÍTICO.</li>
                </ul>
            </div>
            `
        },
        {
            title: "DNS: Realmente muda o Ping?",
            content: `
            <p class="mb-4 text-gray-300">
                DNS (Sistema de Nomes de Domínio) é a lista telefônica da internet. Ele traduz "google.com" para IPs.
                <br/>Em jogos, o DNS é usado apenas no <strong>Login</strong> e no <strong>Matchmaking</strong>. Depois que você conecta no servidor da partida, a conexão é direta por IP (UDP), e o DNS não faz mais nada.
                <br/><strong>Conclusão:</strong> DNS melhora a navegação na web e o tempo para achar partida, mas <strong>NÃO BAIXA O PING DENTRO DO JOGO</strong> (exceto em casos raros de roteamento ruim da operadora). Use Cloudflare (1.1.1.1) pela estabilidade, não por milagre.
            </p>
            `
        }
    ];

    const additionalContentSections = [
        {
            title: "Ethernet vs Wi-Fi 6",
            content: `
            <p class="mb-4 text-gray-300">
                Papo reto: Se você joga competitivo, <strong>use cabo</strong>.
                <br/>Mesmo um Wi-Fi 6E de R$ 2.000,00 sofre interferência do micro-ondas do vizinho, parede e Bluetooth. O ping no Wi-Fi oscila (Jitter). No cabo, é uma linha reta constante. Jitter baixo é mais importante que ping baixo.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "ExitLag / NoPing funcionam?",
            answer: "Depende da sua rota. Se sua operadora faz um caminho estúpido (Ex: São Paulo -> Miami -> Rio de Janeiro), o ExitLag força o caminho direto (SP -> RJ). Nesse caso, funciona MUITO. Se sua rota já é boa, o programa não faz milagre e pode até adicionar delay de processamento."
        },
        {
            question: "Posso fazer isso no Wi-Fi?",
            answer: "Sim, os registros funcionam para adaptador Wi-Fi também. Mas o gargalo físico do ar (interferência) continuará sendo o maior problema."
        }
    ];

    const externalReferences = [
        { name: "SpeedTest by Ookla", url: "https://www.speedtest.net/" },
        { name: "Cloudflare DNS 1.1.1.1", url: "https://1.1.1.1/" }
    ];

    const relatedGuides = [
        {
            href: "/guias/teste-velocidade-internet",
            title: "Bufferbloat Test",
            description: "Teste se seu roteador engasga com downloads."
        },
        {
            href: "/guias/como-limpar-cache-dns-ip-flushdns",
            title: "Flush DNS",
            description: "Como limpar erros de conexão básicos."
        },
        {
            href: "/guias/configuracao-roteador-wifi",
            title: "Configurar Roteador",
            description: "Canal e QoS para Wi-Fi."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="30 min"
            difficultyLevel="Avançado"
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
