import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'teste-velocidade-internet',
  title: "Teste de Velocidade Internet: Jitter, Ping e Bufferbloat (2026)",
  description: "Seu Speedtest dá 500 Mega mas o jogo trava? Você está sofrendo de Bufferbloat. Aprenda a testar a qualidade real da sua conexão e diagnosticar perda de pacotes.",
  category: 'rede-seguranca',
  difficulty: 'Iniciante',
  time: '10 min'
};

const title = "Além do Speedtest: Como Medir a Estabilidade da Internet para Jogos";
const description = "Ter 1 Gigabit não adianta se o Jitter for alto. Entenda os números que realmente importam para o Gamer: Ping carregado (Loaded Latency) e Packet Lost.";

const keywords = [
  'teste de velocidade internet ping real',
  'o que é jitter na internet',
  'bufferbloat test waveform',
  'speedtest falso',
  'internet oscilando muito o que fazer',
  'packet loss test',
  'qual velocidade de upload para streamar',
  'ping alto com internet boa'
];

export const metadata: Metadata = createGuideMetadata('teste-velocidade-internet', title, description, keywords);

export default function SpeedtestGuide() {
  const summaryTable = [
    { label: "Site Padrão", value: "Speedtest.net" },
    { label: "Site Avançado", value: "Waveform Bufferbloat" },
    { label: "Jitter Ideal", value: "Abaixo de 5ms" },
    { label: "Packet Loss", value: "0% (Zero Tolerância)" },
    { label: "Latência Sob Carga", value: "Crucial para casas cheias" },
    { label: "Download", value: "Pouco importa para jogar" }
  ];

  const contentSections = [
    {
      title: "Pare de olhar apenas o Download",
      content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Jogos online consomem pouquíssima banda (menos de 1 Mega de download). O que importa é a velocidade com que os dados viajam (Latência/Ping) e a consistência dessa viagem (Jitter).
        </p>

        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20 my-8">
            <h4 class="text-[#31A8FF] font-bold mb-3 flex items-center gap-2">
                <span class="text-xl">📈</span> Monitor de Rota Voltris
            </h4>
            <p class="text-gray-300 mb-4">
                O Ping testado no navegador nem sempre reflete o jogo. O <strong>Voltris Optimizer</strong> traça a rota (Traceroute) do seu PC até os servidores de São Paulo (AWS, Riot, Valve) e mostra onde está o gargalo: na sua casa, no provedor ou no servidor do jogo.
            </p>
            <a href="/voltrisoptimizer" class="group relative inline-flex px-8 py-3 bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-white font-bold text-base rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-[1.03] hover:shadow-[0_0_60px_rgba(139,49,255,0.4)] items-center justify-center gap-2">
                Testar Rota de Jogo
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
            </a>
        </div>
      `
    },
    {
      title: "O Teste Real: Waveform",
      content: `
        <p class="mb-4 text-gray-300">
            Esqueça o Fast.com ou MinhaConexão. Acesse <strong>waveform.com/tools/bufferbloat</strong>.
        </p>
        <p class="text-gray-300 mb-2 font-bold">O que ele mede?</p>
        <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
            <li><strong>Unloaded Ping:</strong> Seu ping quando ninguém está usando a Internet.</li>
            <li><strong>Download Active Ping:</strong> Seu ping enquanto alguém baixa um arquivo pesado. Se esse número subir de 20ms para 200ms, você sofre de <strong>Bufferbloat</strong>.</li>
            <li><strong>Nota (Grau):</strong> Se tirar C, D ou F, seu roteador é ruim em gerenciar tráfego.</li>
        </ul>
      `
    },
    {
      title: "O que é Jitter?",
      content: `
        <p class="mb-4 text-gray-300">
            Jitter é a variação do ping.
            <br/>Cenário A: Ping estável em 50ms. (Ótimo).
            <br/>Cenário B: Ping varia entre 20ms, 80ms, 30ms, 100ms. (Péssimo).
        </p>
        <p class="text-gray-300">
            Jitter alto causa "teleportes" e bonecos patinando no jogo. Geralmente é causado por Wi-Fi instável ou rota ruim da operadora.
        </p>
      `
    }
  ];

  const advancedContentSections = [
    {
      title: "Como resolver Bufferbloat (SQM)",
      content: `
            <div class="bg-gray-800/50 p-6 rounded-xl border border-gray-700 mb-8">
                <h4 class="text-white font-bold mb-4 text-xl">Smart Queue Management</h4>
                <p class="text-gray-300 mb-4">
                    Se você tirou nota baixa no Waveform:
                </p>
                <ol class="list-decimal list-inside text-gray-300 space-y-2 ml-4">
                    <li>Ative o QoS no seu roteador.</li>
                    <li>Limite a velocidade máxima em 95% do total contratado. (Ex: Se tem 100 Mega, limite em 95 Mega).</li>
                    <li>Isso impede que o buffer do roteador encha, mantendo a fila livre para os pacotes do jogo passarem na frente do download.</li>
                </ol>
            </div>
            `
    }
  ];

  const additionalContentSections = [
    {
      title: "Packet Loss (Perda de Pacote)",
      content: `
            <p class="mb-4 text-gray-300">
                Abra o CMD (Prompt de Comando) e digite: <code>ping google.com -n 50</code>.
            </p>
            <p class="text-gray-300 text-sm">
                Ele fará 50 testes. No final, veja "Perdidos". Deve ser 0 (0% de perda). Se tiver 1% ou mais, chame o técnico da operadora. Há defeito físico na fiação, fibra dobrada ou roteador morrendo. Não há software que resolva perda de pacote física.
            </p>
            `
    }
  ];

  const faqItems = [
    {
      question: "Speedtest via Wi-Fi vale?",
      answer: "Para medir a velocidade da fibra, não. O Wi-Fi é o gargalo. Para medir a qualidade do seu Wi-Fi, sim. Se no cabo bate 500 Mega e no Wi-Fi bate 50, seu roteador é fraco."
    },
    {
      question: "5G Móvel serve para jogar?",
      answer: "O 5G melhorou muito, com pings de 20ms. É melhor que muito Wi-Fi ruim, mas ainda sofre com Jitter dependendo do clima e horário. Use como backup."
    }
  ];

  const externalReferences = [
    { name: "Waveform Bufferbloat Test", url: "https://www.waveform.com/tools/bufferbloat" },
    { name: "Speedtest by Ookla", url: "https://www.speedtest.net/" }
  ];

  const relatedGuides = [
    {
      href: "/guias/configuracao-roteador-wifi",
      title: "Configurar QoS",
      description: "Resolva o bufferbloat configurando o roteador."
    },
    {
      href: "/guias/perda-de-pacote-packet-loss-fix",
      title: "Packet Loss",
      description: "Diagnóstico profundo de perda de pacotes."
    },
    {
      href: "/guias/como-limpar-cache-dns-ip-flushdns",
      title: "Resetar Conexão",
      description: "Se os testes falharem, tente resetar."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="10 min"
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
