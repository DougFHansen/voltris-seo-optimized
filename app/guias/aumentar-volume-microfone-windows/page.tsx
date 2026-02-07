import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'aumentar-volume-microfone-windows',
  title: "Microfone Baixo? O Guia Definitivo de Áudio no Windows (2026)",
  description: "Seu microfone está baixo ou com chiado? Aprenda a configurar ganho, usar Equalizer APO, NVIDIA Broadcast e transformar seu áudio amador em qualidade de estúdio.",
  category: 'software',
  difficulty: 'Intermediário',
  time: '40 min'
};

const title = "Microfone Baixo? O Guia Definitivo de Áudio no Windows (2026)";
const description = "Seu microfone está baixo ou com chiado? Aprenda a configurar ganho, usar Equalizer APO, NVIDIA Broadcast e transformar seu áudio amador em qualidade de estúdio com ferramentas gratuitas.";

const keywords = [
  'aumentar volume microfone windows 11 tutorial 2026',
  'microfone muito baixo discord como resolver guia',
  'equalizer apo peace microfone configuração',
  'nvidia broadcast ruido fundo remover',
  'voicemeeter banana tutorial basico 2026',
  'ganho de microfone boost windows 11',
  'driver realtek audio control painel',
  'qualidade de estúdio microfone usb barato'
];

export const metadata: Metadata = createGuideMetadata('aumentar-volume-microfone-windows', title, description, keywords);

export default function MicrophoneBoostGuide() {
  const summaryTable = [
    { label: "Volume Ideal", value: "90-100% no Windows" },
    { label: "Microphone Boost", value: "+10dB a +20dB (Máx)" },
    { label: "Software Pro", value: "Equalizer APO + Peace" },
    { label: "Ruído AI", value: "NVIDIA Broadcast / SteelSeries Sonar" },
    { label: "Roteamento", value: "Voicemeeter Banana" },
    { label: "Formato", value: "48000Hz (DVD Quality)" }
  ];

  const contentSections = [
    {
      title: "Diagnóstico Inicial: Por Que Ninguém Te Ouve?",
      content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O problema de "microfone baixo" no Windows geralmente não é defeito do hardware, mas sim uma "característica" de segurança auditiva ou drivers genéricos. O Windows, por padrão, define níveis conservadores para evitar microfonia. Para streamers, quem trabalha em Home Office ou gamers competitivos, o áudio padrão é inaceitável.
        </p>
        
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20 mb-6">
          <h4 class="text-blue-400 font-bold mb-2">🔊 A Regra de Ouro do Ganho</h4>
          <p class="text-sm text-gray-300">
            <strong>Volume ≠ Ganho (Gain).</strong> Volume é a saída. Ganho é a sensibilidade de entrada. Aumentar o volume digitalmente apenas amplifica o sinal JÁ capturado (incluindo o chiado). O segredo é ajustar o <strong>Ganho Analógico</strong> (no hardware ou driver) antes de aplicar amplificação digital.
          </p>
        </div>
      `
    },
    {
      title: "Passo 1: Configuração Nativa do Windows (O Básico Obrigatório)",
      content: `
        <p class="mb-4 text-gray-300">Antes de instalar softwares, vamos garantir que o Windows não está sabotando seu áudio:</p>
        
        <h4 class="text-white font-bold mb-3 mt-4">Painel de Som Clássico (Onde a mágica acontece)</h4>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4 bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
            <li>Pressione <code>Win + R</code>, digite <code>mmsys.cpl</code> e dê Enter. (Isso abre o painel antigo, muito melhor que o novo).</li>
            <li>Vá na aba <strong>Gravação</strong>.</li>
            <li>Clique com botão direito no seu microfone principal > <strong>Propriedades</strong>.</li>
            <li>Na aba <strong>Níveis</strong>:
                <ul class="list-disc ml-8 mt-2 text-sm text-gray-400">
                    <li>Microphone: Coloque em <strong>90-100%</strong>.</li>
                    <li>Microphone Boost (se houver): Teste <strong>+10.0 dB</strong>. Se ainda estiver baixo, tente +20.0 dB. <strong>NUNCA use +30.0 dB</strong> a menos que seja emergência, pois o ruído (hiss) será insuportável.</li>
                </ul>
            </li>
            <li>Na aba <strong>Avançado</strong>:
                <ul class="list-disc ml-8 mt-2 text-sm text-gray-400">
                    <li>Desmarque "Permitir que aplicativos assumam controle exclusivo" se você tiver problemas com Discord mutando seu mic.</li>
                    <li>Formato Padrão: Escolha <strong>2 canais, 16 bits, 48000 Hz (Qualidade de DVD)</strong>. 44100Hz é aceitável, mas 48kHz é o padrão de vídeo/streaming moderno.</li>
                </ul>
            </li>
        </ol>
      `
    },
    {
      title: "Passo 2: Equalizer APO + Peace (Nível Profissional Grátis)",
      content: `
        <p class="mb-4 text-gray-300">
          Se o boost do Windows não foi suficiente ou trouxe muito ruído, você precisa de processamento de sinal. O <strong>Equalizer APO</strong> é a ferramenta mais poderosa para Windows, permitindo aplicar pré-amplificação real e filtros VST.
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h5 class="font-bold text-green-400 mb-2">Como Instalar</h5>
            <ol class="list-decimal list-inside text-sm text-gray-300 space-y-2">
                <li>Baixe o <strong>Equalizer APO</strong> e instale.</li>
                <li>No "Configurator", marque APENAS o seu microfone na aba "Capture Devices". Reinicie o PC.</li>
                <li>Baixe o <strong>Peace Equalizer</strong> (interface gráfica para o APO).</li>
            </ol>
          </div>
          <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h5 class="font-bold text-green-400 mb-2">O Truque do Pre-Amp</h5>
            <p class="text-sm text-gray-300">
                No topo do Peace, existe uma barra de <strong>Pre Amplifying</strong>. Mova ela para a direita para ganhar até <strong>+30dB</strong> de volume com uma clareza muito superior ao boost nativo do driver Realtek.
            </p>
          </div>
        </div>
      `
    },
    {
      title: "Passo 3: Eliminando Ruído com IA (NVIDIA Broadcast / SteelSeries Sonar)",
      content: `
        <p class="mb-4 text-gray-300">
          Aumentar o volume aumenta o ruído do ventilador, teclado e vizinhos. Em 2026, usamos IA para limpar isso.
        </p>
        
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-gray-300 border border-gray-700 rounded-lg">
            <thead class="bg-gray-800">
              <tr>
                <th class="p-3 text-left">Ferramenta</th>
                <th class="p-3 text-left">Requisito</th>
                <th class="p-3 text-left">Veredito</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-t border-gray-700">
                <td class="p-3 text-green-400 font-bold">NVIDIA Broadcast</td>
                <td class="p-3">GPU RTX (2060 ou superior)</td>
                <td class="p-3">O MELHOR. Remove barulho de obra sem distorcer a voz. Use o efeito "Noise Removal".</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3 text-orange-400 font-bold">SteelSeries Sonar</td>
                <td class="p-3">Qualquer PC (Grátis)</td>
                <td class="p-3">Excelente. Inclui compressor, noise gate e equalizador paramétrico fácil de usar.</td>
              </tr>
              <tr class="border-t border-gray-700">
                <td class="p-3 text-blue-400 font-bold">Krisp</td>
                <td class="p-3">Qualquer PC (Freemium)</td>
                <td class="p-3">Bom para chamadas (Zoom/Teams), limitado na versão grátis.</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3 text-purple-400 font-bold">AMD Noise Suppression</td>
                <td class="p-3">GPU Radeon RX 6000+</td>
                <td class="p-3">Eficaz, integra direto no driver Adrenalin. Leve impacto na performance.</td>
              </tr>
            </tbody>
          </table>
        </div>
      `
    }
  ];

  const advancedContentSections = [
    {
      title: "Engenharia de Áudio: Sample Rates, Bit Depth e Cabos",
      content: `
        <h4 class="text-white font-bold mb-3">Hz e Bits: O que importa?</h4>
        <p class="mb-4 text-gray-300">
          Muitos guias dizem para colocar no máximo. <strong>Isso é errado.</strong>
        </p>
        
        <div class="space-y-4">
            <div class="bg-purple-900/10 p-5 rounded-xl border border-purple-500/20">
                <h5 class="text-purple-400 font-bold mb-2">44.1kHz vs 48kHz</h5>
                <p class="text-sm text-gray-300">
                    O áudio de CD (44.1kHz) era padrão para música. Para <strong>vídeo e streaming</strong> (OBS, Youtube, Twitch), o padrão absoluto é <strong>48kHz</strong>. Se seu mic estiver em 44.1 e o OBS em 48, haverá <em>resampling</em> em tempo real, causando uso de CPU e perda de qualidade (aliasing). <strong>Configure TUDO para 48000Hz (48kHz).</strong>
                </p>
            </div>
            
            <div class="bg-amber-900/10 p-5 rounded-xl border border-amber-500/20">
                <h5 class="text-amber-400 font-bold mb-2">16-bit vs 24-bit</h5>
                <p class="text-sm text-gray-300">
                    <strong>16-bit</strong> oferece 96dB de alcance dinâmico. <strong>24-bit</strong> oferece 144dB. Para voz humana, 16-bit é suficiente, mas <strong>24-bit</strong> permite um "noise floor" (piso de ruído) menor digitalmente, permitindo amplificar mais o sinal sem trazer ruído digital de quantização. Sempre prefira 24-bit se disponível.
                </p>
            </div>
        </div>

        <h4 class="text-white font-bold mb-3 mt-6">USB 2.0 vs 3.0: Energia é Tudo</h4>
        <p class="mb-4 text-gray-300">
          Microfones USB (HyperX Quadcast, Blue Yeti) precisam de energia. Portas USB de painel frontal (gabinete) costumam ter voltagem instável, causando:
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
            <li>Volume baixo intermitente (o mic "perde força")</li>
            <li>Desconexões aleatórias</li>
            <li>Zumbido elétrico (Ground Loop)</li>
        </ul>
        <p class="text-emerald-400 font-bold mt-2">Solução: Ligue seu microfone USB sempre nas portas TRASEIRAS da placa-mãe, de preferência numa porta USB 3.0 (azul) ou 3.1 (vermelha) para garantir amperagem estável.</p>
      `
    },
    {
      title: "Solução Definitiva: Voicemeeter Banana",
      content: `
        <p class="mb-4 text-gray-300">
          Se nada funcionou, você precisa de uma mesa de som virtual. O <strong>Voicemeeter Banana</strong> é o padrão da indústria para streamers.
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
            <li>Ele cria um dispositivo virtual "Voicemeeter Output".</li>
            <li>Você joga seu mic real nele.</li>
            <li>Você aplica Compressor (nivela gritos e sussurros) e Gate (corta barulho de teclado).</li>
            <li>Você usa o "Voicemeeter Output" no Discord/Jogos.</li>
        </ul>
        <p class="text-gray-300 mt-2 text-sm italic">
          O Voicemeeter adiciona cerca de 10-15ms de latência, o que é imperceptível para voz, mas oferece controle total de volume independente do Windows.
        </p>
      `
    }
  ];

  const additionalContentSections = [
    {
      title: "Dicas de Posicionamento Físico",
      content: `
        <h4 class="text-white font-bold mb-3">A Física vence o Software</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-gray-800/50 p-4 rounded-lg">
                <h5 class="text-white font-bold mb-2">Proximidade (Efeito de Proximidade)</h5>
                <p class="text-sm text-gray-300">
                    Microfones cardióides ganham graves e volume exponencialmente quanto mais perto vocÊ está. Fique a <strong>3-5 dedos de distância</strong> do microfone. Se ficar longe (30cm+), você soará como se estivesse num banheiro, e o ganho necessário trará muito ruído.
                </p>
            </div>
            <div class="bg-gray-800/50 p-4 rounded-lg">
                <h5 class="text-white font-bold mb-2">Braço Articulado</h5>
                <p class="text-sm text-gray-300">
                    O mic no suporte de mesa pega vibração do teclado. Um braço articulado (R$ 80-150) isola a vibração e permite colocar o mic perto da boca sem atrapalhar a visão, permitindo usar menos ganho digital (menos ruído).
                </p>
            </div>
        </div>
      `
    }
  ];

  const faqItems = [
    {
      question: "Meu microfone captura o som do meu jogo/PC (Retorno). Como arrumar?",
      answer: "Isso geralmente é 'Crosstalk' elétrico no painel frontal ou Stereomix ativado. 1. Desative 'Mixagem Estéreo' no painel de som. 2. Use porta traseira. 3. Se usa headset com 2 p2 (mic/fone), o adaptador Y pode estar vazando sinal. Teste sem o adaptador ou troque o cabo."
    },
    {
      question: "O volume abaixa sozinho quando entro numa chamada.",
      answer: "Vá em Painel de Controle > Som > Aba Comunicações. Marque a opção 'Não fazer nada'. O Windows, por padrão, reduz o volume de outros sons em 80% quando detecta uma chamada, e às vezes buga o próprio mic."
    },
    {
      question: "O que é AGC (Automatic Gain Control)?",
      answer: "É um recurso em alguns drivers e apps (Discord/Teams) que aumenta/diminui o volume automaticamente. Para qualidade constante, DESATIVE o AGC e configure o ganho manualmente. O AGC costuma aumentar o ruído de fundo quando você fica em silêncio."
    },
    {
      question: "Qual a diferença entre microfone Condensador e Dinâmico?",
      answer: "Condensador (ex: HyperX Quadcast, Blue Yeti) é muito sensível, pega detalhes e muito ruído de fundo (bata de teclado, cachorro). Dinâmico (ex: Shure MV7, Fifine K658) é menos sensível, foca apenas na voz próxima e rejeita ruído de fundo. Para quartos barulhentos, Dinâmico é melhor."
    },
    {
      question: "Devo usar o 'Realtek Audio Console'?",
      answer: "Sim, se sua placa-mãe tiver. Ele substitui o painel antigo em drivers DCH modernos. Procure opções como 'Supressão de Ruído' e 'Cancelamento de Eco Acústico' (AEC) nele, que são processados direto no chip de áudio, poupando CPU."
    }
  ];

  const externalReferences = [
    { name: "Equalizer APO Download (SourceForge)", url: "https://sourceforge.net/projects/equalizerapo/" },
    { name: "Peace Equalizer Interface", url: "https://sourceforge.net/projects/peace-equalizer-apo-extension/" },
    { name: "VB-Audio Voicemeeter Banana", url: "https://vb-audio.com/Voicemeeter/banana.htm" },
    { name: "NVIDIA Broadcast Setup", url: "https://www.nvidia.com/pt-br/geforce/broadcasting/broadcast-app/" },
    { name: "SteelSeries Sonar", url: "https://pt.steelseries.com/gg/sonar" }
  ];

  const relatedGuides = [
    {
      href: "/guias/discord-nitro-qualidade-voz-krisp",
      title: "Configurar Discord",
      description: "Otimize seu mic especificamente para o Discord."
    },
    {
      href: "/guias/obs-studio-melhores-configuracoes-stream",
      title: "OBS Studio Áudio",
      description: "Filtros de compressão e ruído para lives."
    },
    {
      href: "/guias/solucao-problemas-driver-audio",
      title: "Drivers de Áudio",
      description: "Resolva problemas com Realtek e drivers."
    },
    {
      href: "/guias/headset-7.1-real-vs-virtual-vale-a-pena",
      title: "Headsets Gamer",
      description: "Escolha o melhor hardware para seu setup."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="40 min"
      difficultyLevel="Intermediário"
      author="Equipe Técnica Voltris"
      lastUpdated="2026-02-06"
      contentSections={contentSections}
      advancedContentSections={advancedContentSections}
      additionalContentSections={additionalContentSections}
      summaryTable={summaryTable}
      faqItems={faqItems}
      externalReferences={externalReferences}
      relatedGuides={relatedGuides}
    />
  );
}
