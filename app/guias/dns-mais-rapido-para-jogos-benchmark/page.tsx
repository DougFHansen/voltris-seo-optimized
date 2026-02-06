import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'dns-mais-rapido-para-jogos-benchmark',
    title: "DNS para Jogos (2026): Benchmark e Escolha do Mais Rápido",
    description: "Cloudflare (1.1.1.1) ou Google (8.8.8.8)? Aprenda a usar o DNS Benchmark para encontrar o servidor mais rápido na sua região e reduzir o tempo de resolução.",
    category: 'rede',
    difficulty: 'Iniciante',
    time: '15 min'
};

const title = "Melhor DNS Gamer (2026): Teste Real";
const description = "Mudar o DNS não aumenta FPS, mas faz sites carregarem mais rápido e pode resolver problemas de conexão com servidores de jogos. Descubra o ideal para você.";

const keywords = [
    'melhor dns para jogos brasil 2026',
    'google dns vs cloudflare vs opendns benchmark',
    'dns jumper download tutorial',
    'como mudar dns ipv4 e ipv6 windows 11',
    'dns diminui ping em jogos mito ou verdade',
    'best gaming dns server south america',
    'quad9 security dns',
    'voltris optimizer dns',
    'flush dns command prompt'
];

export const metadata: Metadata = createGuideMetadata('dns-mais-rapido-para-jogos-benchmark', title, description, keywords);

export default function DNSGuide() {
    const summaryTable = [
        { label: "Cloudflare", value: "1.1.1.1 (Rápido)" },
        { label: "Google", value: "8.8.8.8 (Estável)" },
        { label: "Quad9", value: "9.9.9.9 (Seguro)" },
        { label: "OpenDNS", value: "208.67.222.222" },
        { label: "Ferramenta", value: "DNS Jumper" },
        { label: "Cache", value: "Flush DNS (CMD)" }
    ];

    const contentSections = [
        {
            title: "Introdução: O que o DNS faz?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          DNS é a agenda telefônica da internet. Ele traduz "valorant.com" para o IP "104.16.1.1". Um DNS lento demora para achar o servidor. Um DNS rápido conecta instantaneamente.
        </p>
      `
        },
        {
            title: "Capítulo 1: DNS Jumper (O Teste)",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Achando o Vencedor</h4>
                <p class="text-gray-400 text-xs text-justify">
                    1. Baixe o <strong>DNS Jumper</strong> (Portable, sem instalação).
                    <br/>2. Clique em <strong>"Fastest DNS"</strong>.
                    <br/>3. Clique em <strong>"Start DNS Test"</strong>.
                    <br/>Ele vai testar 50 servidores e te dizer qual tem a menor latência (ms) para a SUA casa.
                    <br/>Geralmente no Brasil, Cloudflare ou Google ganham. Mas às vezes um DNS local do provedor é mais rápido.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Como Mudar no Windows",
            content: `
        <p class="mb-4 text-gray-300">
            Painel de Controle > Rede e Internet > Central de Rede > Alterar as configurações do adaptador.
            <br/>Botão direito na sua Ethernet > Propriedades.
            <br/>Clique em <strong>Protocolo IP Versão 4 (TCP/IPv4)</strong> > Propriedades.
            <br/>Marque "Usar os seguintes endereços de servidor DNS" e digite o vencedor do teste.
        </p>
      `
        },
        {
            title: "Capítulo 3: DNS IPv6 (Importante)",
            content: `
        <p class="mb-4 text-gray-300">
            Muitos esquecem do IPv6. Se seu provedor usa IPv6, o jogo pode priorizar ele.
            <br/>Configure também o Protocolo IP Versão 6 (TCP/IPv6).
            <br/>- Cloudflare IPv6: <code>2606:4700:4700::1111</code>
            <br/>- Google IPv6: <code>2001:4860:4860::8888</code>
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: Flush DNS (Limpar Cache)",
            content: `
        <p class="mb-4 text-gray-300">
            Depois de trocar, limpe o cache antigo para garantir que o novo funcione.
            <br/>Abra o CMD (Prompt de Comando) como Administrador.
            <br/>Digite: <code>ipconfig /flushdns</code>
            <br/>Aperte Enter. "Liberação do Cache do DNS Resolver bem-sucedida".
        </p>
      `
        },
        {
            title: "Capítulo 5: DNS resolve Ping Alto?",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>Mito:</strong> DNS baixa ping DENTRO da partida.
            <br/><strong>Verdade:</strong> DNS só atua no momento da CONEXÃO (Login, Matchmaking). Depois que o jogo conecta no IP do servidor, o DNS não faz mais nada.
            <br/>Porém, um DNS ruim pode falhar em te conectar ao servidor mais próximo, jogando você num servidor longe (ping alto). Indiretamente, ajuda.
        </p>
      `
        },
        {
            title: "Capítulo 6: DNS Over HTTPS (DoH)",
            content: `
        <p class="mb-4 text-gray-300">
            Navegadores modernos (Chrome/Edge) usam DNS seguro criptografado.
            <br/>Isso é ótimo para privacidade, mas adiciona alguns milissegundos de latência.
            <br/>Para jogos, o DNS tradicional UDP (porta 53) ainda é o mais rápido (raw speed).
        </p>
      `
        },
        {
            title: "Capítulo 7: DNS Filter (Bloqueio de Ads)",
            content: `
        <p class="mb-4 text-gray-300">
            Servidores como o <strong>AdGuard DNS</strong> bloqueiam anúncios na rede toda.
            <br/>Isso economiza banda, mas pode impedir que alguns jogos free-to-play abram suas lojas ou vídeos de recompensa. Use com cautela.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: Roteador",
            content: `
            <p class="mb-4 text-gray-300">
                O ideal é configurar o DNS direto no <strong>Roteador</strong>.
                <br/>Assim, seu PC, PS5, Celular e TV Smart usam o DNS rápido automaticamente sem precisar configurar um por um.
            </p>
            `
        },
        {
            title: "Capítulo 9: ISP DNS (Provedor)",
            content: `
            <p class="mb-4 text-gray-300">
                O DNS da sua operadora (Vivo/Claro) geralmente é rápido (pois está na rede interna deles), mas cai muito e censura sites. Além de venderem seu histórico de navegação. Evite.
            </p>
            `
        },
        {
            title: "Capítulo 10: ExitLag e DNS",
            content: `
            <p class="mb-4 text-gray-300">
                Programas como ExitLag ignoram seu DNS do Windows e usam o sistema de resolução próprio deles para encontrar as rotas de jogo.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Qual o melhor DNS para 2026?",
            answer: "Varia por região. Em SP/RJ, Cloudflare (1.1.1.1) costuma ganhar. No Nordeste, Google (8.8.8.8) às vezes é melhor. Use o Benchmark."
        },
        {
            question: "Trocar DNS aumenta velocidade de download?",
            answer: "Não. A velocidade de download depende da sua banda contratada e da rota do arquivo. DNS só acelera o 'início' do download (encontrar o servidor)."
        },
        {
            question: "Erro 'DNS_PROBE_FINISHED_NXDOMAIN'?",
            answer: "Seu DNS atual caiu. Troque para o secundário (ex: 1.0.0.1) ou volte para Automático temporariamente."
        }
    ];

    const externalReferences = [
        { name: "DNS Jumper Download", url: "https://www.sordum.org/7952/dns-jumper-v2-2/" },
        { name: "Cloudflare 1.1.1.1", url: "https://1.1.1.1/" }
    ];

    const relatedGuides = [
        {
            href: "/guias/bufferbloat-qos-sqm-roteador-ping",
            title: "Bufferbloat",
            description: "Passo seguinte."
        },
        {
            href: "/guias/reduzir-ping-exitlag-noping-dns",
            title: "Ping Reduction",
            description: "Guia geral."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="15 min"
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
