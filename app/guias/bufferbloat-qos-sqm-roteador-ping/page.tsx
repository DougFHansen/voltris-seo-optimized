import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'bufferbloat-qos-sqm-roteador-ping',
    title: "Bufferbloat e QoS (2026): A Verdadeira Causa do Lag",
    description: "Seu ping sobe quando alguém vê Netflix? Isso é Bufferbloat. Aprenda a configurar QoS (SMQ) no roteador para manter o ping baixo mesmo baixando torrent.",
    category: 'rede',
    difficulty: 'Muito Avançado',
    time: '35 min'
};

const title = "Bufferbloat Fix (2026): Ping Estável em Casa Cheia";
const description = "Ter 500 Mega de internet não garante ping baixo se o roteador for ruim. O segredo é limitar a velocidade para garantir a latência. Faça o teste A+.";

const keywords = [
    'bufferbloat test waveform result f',
    'como configurar qos roteador tp-link archer',
    'sqm qos openwrt gamer settings',
    'limitar banda download upload para melhorar ping',
    'ping alto quando alguem usa wifi',
    'roteador com sqm barato 2026',
    'cake vs fq_codel qos',
    'voltris optimizer network',
    'reduzir latencia carregada (loaded latency)'
];

export const metadata: Metadata = createGuideMetadata('bufferbloat-qos-sqm-roteador-ping', title, description, keywords);

export default function BufferbloatGuide() {
    const summaryTable = [
        { label: "Teste", value: "Waveform Bufferbloat" },
        { label: "Solução", value: "QoS (Quality of Service)" },
        { label: "Algoritmo", value: "SQM (CAKE / FQ_CoDel)" },
        { label: "Download Limit", value: "90% da contratação" },
        { label: "Upload Limit", value: "85% da contratação" },
        { label: "Roteador", value: "CPU Dual Core Mínimo" }
    ];

    const contentSections = [
        {
            title: "Introdução: O Engarrafamento de Dados",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Imagine uma rodovia (sua internet). Quando ela enche de carros (Netflix 4K), tudo para. O Bufferbloat é o roteador tentando colocar carros demais na fila de espera, causando atraso (lag) para o seu comando do jogo (que é uma moto rápida tentando passar).
        </p>
      `
        },
        {
            title: "Capítulo 1: O Teste Waveform",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Diagnóstico</h4>
                <p class="text-gray-400 text-xs text-justify">
                    1. Acesse <strong>waveform.com/tools/bufferbloat</strong>.
                    <br/>2. Pare todos os downloads.
                    <br/>3. Rode o teste.
                    <br/>Se der nota <strong>C, D ou F</strong>, você tem Bufferbloat grave. Seu ping sobe de 20ms para 200ms quando a internet está em uso.
                    <br/>Se der <strong>A ou A+</strong>, parabéns, seu roteador é ótimo.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: QoS Tradicional (Roteadores Comuns)",
            content: `
        <p class="mb-4 text-gray-300">
            A maioria dos roteadores (TP-Link, D-Link) tem um "QoS" simples.
            <br/>1. Entre na página do roteador (192.168.0.1).
            <br/>2. Ative QoS.
            <br/>3. Defina a velocidade da sua internet REAL (faça speedtest antes).
            <br/>4. Adicione seu PC como "Alta Prioridade" pelo MAC Address.
            <br/>Isso ajuda, mas não resolve totalmente se o algoritmo for ruim.
        </p>
      `
        },
        {
            title: "Capítulo 3: SQM (Smart Queue Management) - A Cura",
            content: `
        <p class="mb-4 text-gray-300">
            SQM é a tecnologia real que resolve Bufferbloat.
            <br/>Disponível em roteadores com <strong>OpenWRT</strong>, <strong>Ubiquiti</strong>, ou modelos gamers caros (Asus Merlin).
            <br/>Ele usa algoritmos matemáticos (CAKE ou FQ_CoDel) para garantir que pacotes pequenos (jogos/VoIP) pulem a fila na frente dos pacotes grandes (Netflix).
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: Configurando o Limite de Banda",
            content: `
        <p class="mb-4 text-gray-300">
            Para o SQM funcionar, o roteador precisa controlar a fila, não o modem da operadora.
            <br/>Configure o limite de Download para <strong>90-95%</strong> da sua velocidade máxima.
            <br/>Configure o Upload para <strong>85-90%</strong>.
            <br/>Você "perde" um pouquinho de velocidade máxima para ganhar estabilidade ABSOLUTA de ping. Vale a pena para quem joga.
        </p>
      `
        },
        {
            title: "Capítulo 5: OpenWRT (Para Corajosos)",
            content: `
        <p class="mb-4 text-gray-300">
            Se seu roteador suporta:
            <br/>Instalar OpenWRT transforma um roteador de R$200 num equipamento empresarial de R$1000.
            <br/>Instale o pacote <code>luci-app-sqm</code> e ative o "Piece of Cake".
            <br/>Ping estável forever.
        </p>
      `
        },
        {
            title: "Capítulo 6: Cabo Ethernet (CAT6)",
            content: `
        <p class="mb-4 text-gray-300">
            Nenhum QoS faz milagre no Wi-Fi com interferência de vizinho.
            <br/>Use cabo de rede CAT5e ou CAT6.
            <br/>O Wi-Fi 6 (AX) tem tecnologias anti-fila (OFDMA) que ajudam, mas o cabo ainda é rei.
        </p>
      `
        },
        {
            title: "Capítulo 7: ISP Throttling (Operadora)",
            content: `
        <p class="mb-4 text-gray-300">
            Às vezes o problema é na rua.
            <br/>Se o Bufferbloat persistir mesmo limitando a banda a 50%, a infraestrutura da sua operadora (Node) está saturada. Ligue e reclame ou troque de fibra.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: Jogando enquanto faz Live",
            content: `
            <p class="mb-4 text-gray-300">
                Streamers precisam de QoS no Upload.
                <br/>Se o upload saturar enviando a live para a Twitch, o jogo perde pacotes (Packet Loss). Limite o bitrate do OBS para 80% do seu upload real.
            </p>
            `
        },
        {
            title: "Capítulo 9: Roteadores Recomendados 2026",
            content: `
            <p class="mb-4 text-gray-300">
                Procure CPUs Quad-Core (1.5GHz+). Roteadores fracos não aguentam fazer SQM em conexões Gigabit (1000 Mega).
                <br/>Ex: Asus RT-AX86U, GL.iNet Flint 2.
            </p>
            `
        },
        {
            title: "Capítulo 10: ExitLag ajuda?",
            content: `
            <p class="mb-4 text-gray-300">
                ExitLag otimiza a ROTA, mas não resolve Bufferbloat na sua casa.
                <br/>Se seu irmão ligar o torrent, o ExitLag não vai impedir o lag. Só o QoS no roteador impede.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Perco velocidade de download com QoS?",
            answer: "Sim, intencionalmente. Você sacrifica cerca de 5-10% da velocidade máxima para ter latência perfeita. Em 500 Mega, baixar a 450 Mega não faz diferença, mas jogar com 20ms cravado faz."
        },
        {
            question: "Meu roteador da operadora tem QoS?",
            answer: "Geralmente não, ou é bloqueado/inútil. Coloque o modem da operadora em modo Bridge e compre um roteador próprio decente."
        },
        {
            question: "SQM funciona em IPv6?",
            answer: "Sim, CAKE e FQ_CoDel funcionam agnóstico de protocolo."
        }
    ];

    const externalReferences = [
        { name: "Waveform Bufferbloat Test", url: "https://www.waveform.com/tools/bufferbloat" },
        { name: "OpenWRT SQM HowTo", url: "https://openwrt.org/docs/guide-user/network/traffic-shaping/sqm" }
    ];

    const relatedGuides = [
        {
            href: "/guias/reduzir-ping-exitlag-noping-dns",
            title: "Ping Geral",
            description: "Dicas de software."
        },
        {
            href: "/guias/dns-mais-rapido-para-jogos",
            title: "DNS",
            description: "Complemento."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="35 min"
            difficultyLevel="Muito Avançado"
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
