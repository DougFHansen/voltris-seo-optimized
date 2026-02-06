import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'configuracao-roteador-wifi',
  title: "Configuração de Roteador para Jogos: Otimizando Wi-Fi e Portas (2026)",
  description: "Lag no Wi-Fi? Aprenda a escolher o melhor canal (1, 6, 11), separar as redes 2.4GHz/5GHz e configurar QoS para priorizar seu PC ou Console na rede doméstica.",
  category: 'rede-seguranca',
  difficulty: 'Intermediário',
  time: '30 min'
};

const title = "Wi-Fi Gamer: Guia Avançado de Configuração de Roteador e QoS";
const description = "Seu ping oscila quando alguém liga a Netflix? Descubra como configurar o QoS, abrir portas (Port Forwarding) e posicionar as antenas para estabilidade total.";

const keywords = [
  'melhor canal wifi 2.4ghz para jogos',
  'configurar qos roteador tp-link d-link',
  'separar rede 2.4 e 5ghz melhora ping',
  'como abrir portas roteador para jogos',
  'dmz ou upnp qual usar',
  'mtu ideal para jogos ps5 xbox pc',
  'roteador gamer vale a pena',
  'wifi analyzer android tutorial'
];

export const metadata: Metadata = createGuideMetadata('configuracao-roteador-wifi', title, description, keywords);

export default function RouterGuide() {
  const summaryTable = [
    { label: "Frequência", value: "5GHz (Obrigatório para jogos)" },
    { label: "Canal 2.4GHz", value: "Use apenas 1, 6 ou 11" },
    { label: "Largura de Banda", value: "20MHz (2.4G) / 80MHz (5G)" },
    { label: "QoS", value: "Ativar e Priorizar PC" },
    { label: "Cabo", value: "Ethernet sempre vence Wi-Fi" },
    { label: "UPnP", value: "Ativar (Mais fácil que Port Forwarding)" }
  ];

  const contentSections = [
    {
      title: "A Regra de Ouro: 5GHz vs 2.4GHz",
      content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O Wi-Fi 2.4GHz é lento e sofre interferência do microondas, babá eletrônica e dos vizinhos. Jamais jogue no 2.4GHz se puder evitar. O <strong>5GHz</strong> tem menor alcance (atravessa menos paredes), mas oferece latência quase igual à do cabo e velocidade total da sua fibra.
        </p>

        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20 my-8">
            <h4 class="text-[#31A8FF] font-bold mb-3 flex items-center gap-2">
                <span class="text-xl">📡</span> Otimizador de Wi-Fi Voltris
            </h4>
            <p class="text-gray-300 mb-4">
                O Windows, por padrão, escaneia redes Wi-Fi a cada 60 segundos, causando um pico de lag (Lag Spike) no meio da partida. O <strong>Voltris Optimizer</strong> tem um recurso "WLAN Optimizer" que desativa o Auto-Config do Wi-Fi enquanto você joga, garantindo uma linha reta de ping sem oscilações.
            </p>
            <a href="/voltrisoptimizer" class="group relative inline-flex px-8 py-3 bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-white font-bold text-base rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-[1.03] hover:shadow-[0_0_60px_rgba(139,49,255,0.4)] items-center justify-center gap-2">
                Estabilizar Wi-Fi
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
            </a>
        </div>
      `
    },
    {
      title: "Passo 1: Escolhendo o Melhor Canal",
      content: `
        <p class="mb-4 text-gray-300">
            Se seu vizinho está usando o Canal 6 e você também, os sinais colidem e seu ping sobe.
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4 bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
            <li>Baixe o app <strong>Wi-Fi Analyzer</strong> (Open Source) no celular Android.</li>
            <li>Veja o gráfico. Identifique qual canal está VAZIO.</li>
            <li><strong>Para 2.4GHz:</strong> Use APENAS canais 1, 6 ou 11. (Nunca use canais intermediários como 3 ou 8, pois eles geram sobreposição dupla).</li>
            <li><strong>Para 5GHz:</strong> Geralmente canais altos (acima de 149) têm menos interferência.</li>
            <li>Entre na página do roteador (geralmente 192.168.0.1 ou 1.1), faça login e mude o "Control Channel" de Auto para o canal escolhido.</li>
        </ol>
      `
    },
    {
      title: "Passo 2: Configurando QoS (Quality of Service)",
      content: `
        <p class="mb-4 text-gray-300">
            QoS diz ao roteador: "Se a banda encher, atrase o YouTube, mas NÃO atrase o Jogo".
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
            <li>Procure a aba QoS ou "Controle de Banda".</li>
            <li>Ative o QoS.</li>
            <li>Defina sua velocidade de Upload e Download real (faça um Speedtest antes). Se você colocar errado, a internet fica lenta.</li>
            <li>Adicione seu PC (pelo IP ou MAC Address) na lista de "Prioridade Máxima" ou "High Priority".</li>
        </ul>
      `
    }
  ];

  const advancedContentSections = [
    {
      title: "Abertura de Portas (Port Forwarding) vs UPnP",
      content: `
            <div class="bg-gray-800/50 p-6 rounded-xl border border-gray-700 mb-8">
                <h4 class="text-white font-bold mb-4 text-xl">NAT Estrito nunca mais</h4>
                <p class="text-gray-300 mb-4">
                    Para ser o "Host" da partida ou ter NAT Aberto no CoD/Xbox:
                </p>
                <p class="text-gray-300 text-sm">
                    <strong>UPnP (Universal Plug and Play):</strong> DEIXE ATIVADO. É a forma automática do jogo pedir pro roteador abrir a porta 3074. É seguro para uso doméstico.
                </p>
                <p class="text-gray-300 text-sm mt-3">
                    <strong>DMZ (Zona Desmilitarizada):</strong> Abre TODAS as portas para um IP. Use apenas em Consoles (PS5/Xbox). NUNCA use DMZ no seu PC, pois isso remove o Firewall do roteador e expõe seu Windows a ataques diretos da internet.
                </p>
            </div>
            `
    }
  ];

  const additionalContentSections = [
    {
      title: "MTU (Maximum Transmission Unit)",
      content: `
            <p class="mb-4 text-gray-300">
                O padrão é 1500. Alguns guias dizem para mudar para 1450 ou 1472.
            </p>
            <p class="text-gray-300 text-sm">
                <strong>Verdade:</strong> Em 99% das conexões via Fibra (PPPoE), o MTU ideal é 1480 ou 1492. Deixe em 1500 (Padrão) a menos que saiba exatamente o que está fazendo. MTU errado causa fragmentação de pacotes e perda de dados (Packet Loss).
            </p>
            `
    }
  ];

  const faqItems = [
    {
      question: "Roteador 'Gamer' de R$ 2.000 vale a pena?",
      answer: "Só se você tiver 20 dispositivos em casa conectados ao mesmo tempo. A latência (Ping) de um roteador de R$ 300 e um de R$ 2.000 é a mesma se só tiver você jogando. A diferença está no processador que aguenta mais conexões simultâneas."
    },
    {
      question: "Repetidor de Wi-Fi é bom para jogar?",
      answer: "NÃO. Repetidores aumentam o ping drasticamente (dobram a latência) porque precisam receber o sinal, processar e retransmitir (Half Duplex). Se o sinal é ruim, passe um cabo ou use rede Mesh (que é melhor que repetidor, mas ainda perde para o cabo)."
    },
    {
      question: "Largura de 40MHz no 2.4GHz?",
      answer: "Evite. 40MHz dobra a velocidade mas dobra a chance de interferência. Em áreas urbanas lotadas, use 20MHz no 2.4GHz para mais estabilidade. No 5GHz, use 80MHz ou 160MHz sem medo."
    }
  ];

  const externalReferences = [
    { name: "PortForward.com (Guia de Portas)", url: "https://portforward.com/" },
    { name: "Wi-Fi Analyzer (Open Source)", url: "https://vremsoftwaredevelopment.github.io/WiFiAnalyzer/" }
  ];

  const relatedGuides = [
    {
      href: "/guias/melhor-dns-jogos-2026",
      title: "DNS Otimizado",
      description: "Complete sua configuração de rede."
    },
    {
      href: "/guias/reduzir-ping-regedit-cmd-jogos",
      title: "Regedit de Rede",
      description: "Ajuste o Windows para receber os pacotes do roteador."
    },
    {
      href: "/guias/como-limpar-cache-dns-ip-flushdns",
      title: "Resetar Rede",
      description: "Se a configuração der errado, resete tudo."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="30 min"
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
