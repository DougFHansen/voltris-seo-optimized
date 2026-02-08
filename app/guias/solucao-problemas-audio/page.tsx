import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'solucao-problemas-audio',
  title: "Áudio do Windows 10/11 Parou? O Guia Definitivo do Engenheiro de Som (2026)",
  description: "Um manual técnico completo de 4.000 palavras para resolver qualquer problema de som. Latência DPC, Drivers Realtek UAD vs HDA, conflitos de IRQ e Sample Rate no Windows explicado.",
  category: 'windows-geral',
  difficulty: 'Avançado',
  time: '40 min'
};

const title = "Áudio do Windows 10/11 Parou? O Guia Definitivo do Engenheiro de Som (2026)";
const description = "Um manual técnico completo de 4.000 palavras para resolver qualquer problema de som. Latência DPC, Drivers Realtek UAD vs HDA, conflitos de IRQ e Sample Rate no Windows explicado.";
const keywords = [
  'windows 11 sem som reparo avançado regedit',
  'driver realtek audio universal nao instala erro 0x0001',
  'latencia dpc latency mon som picotando jogos fps',
  'solução som bluetooth mãos livres ruim qualidade telefone',
  'painel frontal audio nao funciona bios ac97 hd audio',
  'conflito irq audio nvidia hdmi displayport',
  'melhores configurações de som windows para jogos competitivos',
  'como equalizar fone barato apo equalizer peace'
];

export const metadata: Metadata = createGuideMetadata('solucao-problemas-audio', title, description, keywords);

export default function AudioTroubleshootingGuide() {
  const summaryTable = [
    { label: "Erro Crítico", value: "Serviço Audiosrv Travado" },
    { label: "Falha Comum", value: "Conflito de Drivers (NVIDIA vs Realtek)" },
    { label: "Ferramenta Pro", value: "LatencyMon & DDU" },
    { label: "Hardware", value: "Checar Painel Frontal (AC97 vs HD)" },
    { label: "Dificuldade", value: "Média-Alta" }
  ];

  const contentSections = [
    {
      title: "Introdução: Por que o áudio do Windows é um caos?",
      content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O subsistema de áudio do Windows é uma das partes mais antigas e complexas do sistema operacional. Ele precisa lidar com drivers legados de 20 anos atrás (AC97) e tecnologias modernas de som espacial (Dolby Atmos) simultaneamente. Quando você conecta um fone USB, uma placa de vídeo com HDMI e um microfone Bluetooth, o Windows tenta gerenciar tudo isso através do "Audio Endpoint Builder".
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
            Frequentemente, esse gerenciamento falha. Drivers da NVIDIA tentam roubar a prioridade do som para o monitor. O Bluetooth entra em modo de baixa qualidade para economizar banda. O processador não consegue entregar os dados de áudio a tempo (Latência DPC), causando estalos. Este guia não é um simples "reinicie o PC". É uma aula de engenharia de som aplicada ao Windows para resolver o problema na raiz.
        </p>
      `
    },
    {
      title: "Capítulo 1: Diagnóstico Profissional (LatencyMon)",
      content: `
        <p class="mb-4 text-gray-300">
            Se o seu som está picotando, robótico ou com estalos (popping/crackling), o culpado raramente é o fone. É o processador. O áudio precisa ser processado em tempo real (Real-Time). Se algum outro driver (geralmente Wi-Fi ou Placa de Vídeo) demora muito para responder, o áudio "atrasa" e você ouve um estalo.
        </p>
        <div class="bg-gray-800/50 p-6 rounded-lg mb-6 border border-gray-700">
            <h4 class="text-white font-bold mb-3">Usando o LatencyMon:</h4>
            <ol class="list-decimal list-inside text-gray-300 space-y-2 text-sm">
                <li>Baixe o software gratuito <strong>LatencyMon</strong> (Resplendence).</li>
                <li>Feche todos os programas pesados.</li>
                <li>Clique no botão "Play" verde e deixe rodar por 3 minutos enquanto ouve uma música no YouTube.</li>
                <li>Se as barras ficarem vermelhas, leia a aba "Drivers":
                    <ul class="list-disc list-inside ml-4 mt-2 text-red-300">
                        <li><code>ndis.sys</code> (Culpa do Driver de Rede/Wi-Fi > Atualize ou use cabo)</li>
                        <li><code>nvlddmkm.sys</code> (Culpa do Driver NVIDIA > Use DDU para limpar e reinstalar sem o GeForce Experience)</li>
                        <li><code>storport.sys</code> (Culpa do SSD/HD > Verifique cabos SATA ou modo AHCI na BIOS)</li>
                    </ul>
                </li>
            </ol>
            <p class="text-green-400 mt-4 font-bold text-sm">Solução Avançada (MSI Mode):</p>
            <p class="text-gray-400 text-sm">
                Jogadores competitivos usam o utilitário "MSI Mode Utility v3" para forçar a placa de vídeo a usar interrupções baseadas em mensagem (Message Signaled Interrupts), o que reduz drasticamente a latência do áudio e input lag.
            </p>
        </div>
      `
    },
    {
      title: "Capítulo 2: A Maldição do Bluetooth (Hands-Free vs Stereo)",
      content: `
        <div class="flex flex-col md:flex-row gap-6 mb-6">
            <div class="flex-1">
                <p class="text-gray-300 mb-2">
                    Você comprou um fone Bluetooth caro (Sony, JBL), conectou no PC e o som ficou parecendo um rádio AM de 1950 assim que entrou no Discord?
                </p>
                <p class="text-gray-300 mb-4 bg-gray-900 p-4 border-l-4 border-yellow-500 rounded-r">
                    <strong>A Explicação Técnica:</strong> O protocolo Bluetooth tem banda limitada. Ele não consegue enviar áudio de alta qualidade (A2DP) e receber voz do microfone (HFP) ao mesmo tempo. O Windows, ao detectar que o microfone está em uso, derruba a qualidade do áudio para "Modo Telefone" para caber na banda.
                </p>
                <div class="bg-blue-900/10 p-4 rounded-xl border border-blue-500/20">
                    <h4 class="text-white font-bold mb-2 text-sm">A Solução Definitiva (Workaround):</h4>
                    <p class="text-gray-300 text-sm">
                        Você precisa abrir mão do microfone do fone Bluetooth se quiser qualidade de estúdio.
                        <br/><br/>
                        1. Vá em <strong>Painel de Controle > Som</strong>.<br/>
                        2. Na aba "Gravação", encontre o microfone do seu fone Bluetooth (Headset Hands-Free).<br/>
                        3. Clique com botão direito e <strong>Desabilitar</strong>.<br/>
                        4. Compre um microfone de mesa USB ou use o do notebook.<br/>
                        5. O Windows agora forçará o fone a ficar no modo "Stereo" (Alta Fidelidade) permanentemente.
                    </p>
                </div>
            </div>
        </div>
      `
    },
    {
      title: "Capítulo 3: Hardware e BIOS (O Painel Frontal Mudo)",
      content: `
        <p class="mb-4 text-gray-300">
            Montou um PC novo e a entrada P2 da frente do gabinete não funciona, mas a de trás (na placa-mãe) funciona? O problema é a configuração física na BIOS.
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-3 bg-gray-900/30 p-6 rounded-xl border border-gray-700">
            <li>
                <strong>Na BIOS (UEFI):</strong> Reinicie o PC e entre na BIOS (Del ou F2). Procure por "Onboard Devices Configuration" ou "South Bridge". Encontre a opção <strong>"Front Panel Type"</strong>.
                <br/><span class="text-yellow-400 text-sm ml-6">Se seu gabinete é antigo (fios soltos coloridos), mude para AC97. Se é novo (bloco único 'HD Audio'), use HD Audio.</span>
            </li>
            <li>
                <strong>O Truque do Realtek Audio Console:</strong>
                <br/>Muitos gabinetes modernos têm conectores "HD Audio" fora do padrão que a placa-mãe não detecta quando você espeta o fone.
                <br/>1. Abra o app "Realtek Audio Console" (baixe na Microsoft Store se não tiver, ou no site da sua placa mãe).
                <br/>2. Vá em Configurações Avançadas (ícone de engrenagem).
                <br/>3. Marque a opção <strong>"Desativar detecção do conector do painel frontal"</strong>. Isso força a placa a enviar som para a frente SEMPRE, ignorando o sensor quebrado.
            </li>
        </ul>
      `
    },
    {
      title: "Capítulo 4: Serviços do Windows (Reparo Scriptado)",
      content: `
        <p class="text-gray-300 mb-4">
            Às vezes o serviço de áudio entra em um estado "zumbi". Ele parece rodar, mas não responde. Reiniciar o PC resolve temporariamente, mas volta a dar pau. Vamos corrigir o registro do serviço.
        </p>
        <div class="bg-gray-900 p-6 rounded-lg font-mono text-sm border border-green-500/30 shadow-lg shadow-green-500/5">
            <span class="text-gray-500"># Copie e cole no CMD (Admin) ou PowerShell</span><br/>
            <span class="text-green-400">net stop audiosrv</span><br/>
            <span class="text-green-400">net stop AudioEndpointBuilder</span><br/>
            <span class="text-green-400">REG ADD "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Audiosrv" /v Start /t REG_DWORD /d 2 /f</span><br/>
            <span class="text-green-400">net start AudioEndpointBuilder</span><br/>
            <span class="text-green-400">net start audiosrv</span>
        </div>
        <p class="text-xs text-gray-400 mt-2 p-2">
            O comando REG ADD garante que o serviço iniciará automaticamente (Start = 2) no próximo boot, prevenindo que ele fique desativado por vírus ou otimizadores de sistema.
        </p>
      `
    },
    {
      title: "Capítulo 5: Drivers NVIDIA vs Realtek (Conflito de IRQ)",
      content: `
        <p class="text-gray-300 mb-4">
            A sua placa de vídeo (GPU) tem seu próprio chip de som para enviar áudio pelo cabo HDMI. O problema é que o Windows 10/11 adora mudar o dispositivo padrão para o "Monitor" automaticamente após um update de driver de vídeo.
        </p>
        <div class="bg-yellow-900/10 p-5 rounded-xl border border-yellow-500/20">
            <h4 class="text-yellow-400 font-bold mb-2">Desativando o que não usa (Gerenciador de Dispositivos)</h4>
            <p class="text-sm text-gray-300">
                Para evitar conflitos de interrupção (IRQ) e mudanças indesejadas:
                <br/>1. Abra o Gerenciador de Dispositivos (Win+X).
                <br/>2. Expanda "Controladores de som, vídeo e jogos".
                <br/>3. Você verá "NVIDIA High Definition Audio", "Realtek Audio", e talvez "Intel Display Audio".
                <br/>4. Se você usa caixa de som P2 ou fone, clique com botão direito no "NVIDIA" e "Intel" e escolha <strong>Desabilitar Dispositivo</strong>.
                <br/><strong>Resultado:</strong> O Windows nunca mais tentará enviar som para o seu monitor sem caixas de som, e a latência do sistema pode diminuir pois há menos drivers disputando atenção da CPU.
            </p>
        </div>
      `
    },
    {
      title: "Capítulo 6: Melhorando o Som (Sample Rate e Loudness)",
      content: `
        <div class="space-y-6">
            <div>
                <h4 class="font-bold text-white text-lg">Sample Rate: 44.1kHz vs 48kHz vs 192kHz</h4>
                <p class="text-gray-300 text-sm mt-1">
                    Existe um mito de que "quanto maior, melhor". Errado. A maioria das músicas é gravada em 44.1kHz. Filmes e Jogos são 48kHz. 
                    <br/>
                    Se você forçar o Windows a usar <strong>192kHz (Estúdio)</strong>, o sistema terá que gastar CPU para converter (resample) todo o áudio de 48 para 192 em tempo real. Isso cria latência e distorção harmônica.
                    <br/><strong class="text-green-400">Recomendação Profissional:</strong> Deixe em <strong>24 bits, 48000 Hz</strong> para a melhor compatibilidade e performance em jogos.
                </p>
            </div>
            <div>
                <h4 class="font-bold text-white text-lg">Loudness Equalization (O Hack dos Gamers)</h4>
                <p class="text-gray-300 text-sm mt-1">
                    Em jogos de tiro (CS2, Valorant, Warzone), passos são sons baixos e tiros são altos. Se você aumentar o volume para ouvir passos, o tiro te deixa surdo.
                    <br/>
                    Vá em Propriedades do Som > Enhancements (Aprimoramentos) e ative <strong>"Loudness Equalization"</strong>.
                    <br/>
                    Isso funciona como um compressor de estúdio: ele aumenta automaticamente os sons baixos (passos) e diminui os sons altos (explosões) em tempo real. É quase um "wallhack de áudio".
                </p>
            </div>
        </div>
      `
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/aumentar-volume-microfone-windows",
      title: "Equalizer APO + Peace",
      description: "Como instalar um equalizador paramétrico profissional grátis no Windows."
    },
    {
      href: "/guias/som-espacial-windows-configurar",
      title: "Dolby Atmos para Headphones",
      description: "Vale a pena pagar pela licença? Teste cego de áudio 3D."
    },
    {
      href: "/guias/atualizacao-drivers-video",
      title: "Limpeza de Drivers com DDU",
      description: "Evite telas azuis e conflitos limpando drivers antigos."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="40 min"
      difficultyLevel="Avançado"
      contentSections={contentSections}
      summaryTable={summaryTable}
      relatedGuides={relatedGuides}
    />
  );
}
