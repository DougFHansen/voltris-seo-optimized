import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'reduzir-ping-exitlag-noping-dns',
    title: "Reduzir Ping e Packet Loss (2026): ExitLag, DNS e Configurações de Rede",
    description: "Ping alto? Aprenda como funcionam os 'GPN' (ExitLag, NoPing), como escolher o melhor DNS (Cloudflare/Google) e otimizar o adaptador de rede.",
    category: 'software',
    difficulty: 'Intermediário',
    time: '25 min'
};

const title = "Ping e Latência (2026): Guia Definitivo de Rotas";
const description = "Você não pode mudar a física (distância até o servidor), mas pode mudar a rota. Entenda como otimizar sua conexão para jogos competitivos.";

const keywords = [
    'exitlag vale a pena ou é virus',
    'noping vs exitlag ping test',
    'como reduzir ping valorant rota',
    'cloudfare warp jogos funciona',
    'melhor dns para jogos 2026 brasil',
    'desativar nagle algorithm regedit',
    'packet loss check cmd',
    'mtu optimal size ping',
    'adaptador de rede configuracoes avancadas',
    'voltris optimizer network'
];

export const metadata: Metadata = createGuideMetadata('reduzir-ping-exitlag-noping-dns', title, description, keywords);

export default function PingGuide() {
    const summaryTable = [
        { label: "DNS", value: "1.1.1.1 ou 8.8.8.8" },
        { label: "ExitLag", value: "Útil (Rotas ruins)" },
        { label: "Conexão", value: "Cabo Ethernet (Sempre)" },
        { label: "Wi-Fi", value: "Use 5.8GHz (se obrigado)" },
        { label: "Nagle Alg", value: "Disabled (Regedit)" },
        { label: "MTU", value: "1500 (Padrão)" },
        { label: "QoS", value: "Disabled (Router)" }
    ];

    const contentSections = [
        {
            title: "Introdução: Física vs Rota",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O Ping é o tempo que o sinal leva pra ir até o servidor e voltar. Se você mora no Nordeste e o servidor é em SP, existe um limite físico (mas geralmente o problema é a rota da operadora que dá voltas desnecessárias).
        </p>
      `
        },
        {
            title: "Capítulo 1: ExitLag/NoPing (GPN)",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Como funciona?</h4>
                <p class="text-gray-400 text-xs text-justify">
                    Eles são como um "Waze" para sua internet. Em vez do seu dado seguir a rota da Claro/Vivo (que pode estar congestionada), o ExitLag cria um túnel direto para o servidor do jogo usando rotas privadas.
                    <br/><strong>Vale a pena?</strong> SIM, se você tem Packet Loss ou mora longe do servidor (norte/nordeste). NÃO, se você mora do lado do servidor e já tem 5ms.
                </p>
            </div>
             <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">ExitLag vs Grátis (Cloudflare Warp)</h4>
                <p class="text-gray-400 text-xs">
                    O Cloudflare Warp (1.1.1.1 app) é uma "VPN" grátis que otimiza rotas. É muito bom para resolver problemas de rotas internacionais, mas não é específico para jogos como o ExitLag (UDP multipath).
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Configurações do Adaptador de Rede",
            content: `
        <p class="mb-4 text-gray-300">
            Gerenciador de Dispositivos > Adaptadores de Rede > Seu Adaptador Ethernet > Avançado.
            <br/>- <strong>Energy Efficient Ethernet (Green Ethernet):</strong> Desativar. (Isso desliga a placa pra economizar energia, causando lag spike).
            <br/>- <strong>Interrupt Moderation:</strong> Desativar. (Processa pacotes imediatamente em vez de agrupar. Usa mais CPU, mas baixa latência).
            <br/>- <strong>Flow Control:</strong> Desativar.
        </p>
      `
        },
        {
            title: "Capítulo 3: DNS (Domain Name System)",
            content: `
        <p class="mb-4 text-gray-300">
            O DNS não melhora o Ping dentro da partida, mas melhora a velocidade de encontrar partidas e logar.
            <br/>Melhores opções:
            <br/>- <strong>Cloudflare:</strong> 1.1.1.1 e 1.0.0.1 (Foco em privacidade e rapidez).
            <br/>- <strong>Google:</strong> 8.8.8.8 e 8.8.4.4 (Confiabilidade).
            <br/>Teste qual é mais rápido pra você usando o "DNS Jumper".
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: Algoritmo de Nagle (TCP NoDelay)",
            content: `
        <p class="mb-4 text-gray-300">
            O Windows agrupa pequenos pacotes de dados para eficiência (Nagle's Algorithm). Em jogos, queremos enviar cada clique IMEDIATAMENTE.
            <br/>Isso exige edição do Regedit (TcpAckFrequency).
            <br/><em>Nota:</em> O Voltris Optimizer faz isso automaticamente, evitando risco de errar no registro.
        </p>
      `
        },
        {
            title: "Capítulo 5: Wi-Fi vs Cabo (A Realidade)",
            content: `
        <p class="mb-4 text-gray-300">
            Wi-Fi é ondas de rádio. Ondas sofrem interferência de paredes, micro-ondas e vizinhos. Isso causa "Jitter" (Ping variando de 20 para 100).
            <br/>Para competir, use <strong>Cabo Ethernet Cat5e ou Cat6</strong>. É barato e resolve 90% dos problemas de "lag misterioso".
        </p>
      `
        },
        {
            title: "Capítulo 6: Teste de Bufferbloat",
            content: `
        <p class="mb-4 text-gray-300">
            Acesse o site <a href="https://www.waveform.com/tools/bufferbloat" target="_blank" class="text-blue-400">Waveform Bufferbloat Test</a>.
            <br/>Se sua nota for C ou D, significa que quando alguém na sua casa assiste Netflix, seu Ping sobe.
            <br/>Solução: Ativar <strong>QoS (Quality of Service)</strong> no seu roteador e limitar a velocidade de download máxima para 90% do total contratado, deixando 10% livre para o jogo trafegar sem fila.
        </p>
      `
        },
        {
            title: "Capítulo 7: TCP Optimizer",
            content: `
        <p class="mb-4 text-gray-300">
            Uma ferramenta antiga mas ouro.
            <br/>Baixe o TCP Optimizer 4 (SpeedGuide.net).
            <br/>Selecione sua velocidade de internet.
            <br/>Marque "Optimal". Clique em "Apply Changes".
            <br/>Ele ajusta MTU, RWIN e dezenas de parâmetros ocultos do Windows.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: Packet Loss (Perda de Pacote)",
            content: `
            <p class="mb-4 text-gray-300">
                Ping alto é ruim. Packet Loss é injogável (você teleporta).
                <br/>Se tiver Packet Loss no cabo: Ligue para a operadora. Geralmente é problema físico no cabeamento da rua ou modem com defeito.
                <br/>Se tiver no Wi-Fi: É interferência. Mude o canal do Wi-Fi ou vá para 5GHz.
            </p>
            `
        },
        {
            title: "Capítulo 9: Flush DNS e Reset IP",
            content: `
            <p class="mb-4 text-gray-300">
                Internet estranha?
                <br/>Abra CMD como Admin:
                <br/><code>ipconfig /flushdns</code>
                <br/><code>netsh int ip reset</code>
                <br/><code>netsh winsock reset</code>
                <br/>Reinicie o PC. Isso limpa o cache de rede corrompido.
            </p>
            `
        },
        {
            title: "Capítulo 10: Server Picker",
            content: `
            <p class="mb-4 text-gray-300">
                Em jogos como CS2, você pode limitar o ping máximo aceitável nas configurações.
                <br/>Defina como "50". Assim o jogo nunca te colocará em servidores chilenos ou argentinos se você for brasileiro, evitando a barreira de idioma e latência.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "ExitLag dá ban?",
            answer: "Não. É permitido em 99% dos jogos. Apenas tome cuidado se o jogo tiver bloqueio de região (ex: Lost Ark KR), pois usar VPN para burlar região pode dar ban, mas para reduzir ping é seguro."
        },
        {
            question: "Cabo Cat8 é melhor que Cat6?",
            answer: "Para uso doméstico (<10Gbps) e distâncias curtas, é igual. Não gaste dinheiro extra em Cat8 'Gamer'. Um bom Cat6 de cobre puro é perfeito."
        },
        {
            question: "Habilitar IPv6 ajuda?",
            answer: "O IPv6 é o futuro e evita NAT Duplo, mas alguns jogos antigos bugam com ele. Em 2026, a maioria suporta bem. Idealmente, deixe ativado."
        }
    ];

    const externalReferences = [
        { name: "TCP Optimizer Download", url: "https://www.speedguide.net/downloads.php" },
        { name: "Cloudflare Warp", url: "https://1.1.1.1/" }
    ];

    const relatedGuides = [
        {
            href: "/guias/steam-slow-download-fix",
            title: "Steam Download",
            description: "Otimize uso de banda."
        },
        {
            href: "/guias/windows-defender-otimizacao-jogos",
            title: "Defender",
            description: "Firewall pode bloquear jogos."
        },
        {
            href: "/guias/discord-otimizacao-overlay-lag",
            title: "Discord",
            description: "Priorize a voz na rede."
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
            advancedContentSections={advancedContentSections}
            additionalContentSections={additionalContentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
            faqItems={faqItems}
            externalReferences={externalReferences}
        />
    );
}
