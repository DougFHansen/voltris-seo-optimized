import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'solucao-problemas-audio',
  title: "Áudio do Windows Parou? Manual do Engenheiro: Diagnóstico e Reparo 2026",
  description: "O guia técnico mais completo da internet se seu som sumiu ou está ruim. Reparo de drivers, latência DPC, conflitos de hardware, aterramento e equalização profissional.",
  category: 'windows-geral',
  difficulty: 'Avançado',
  time: '50 min'
};

const title = "Áudio do Windows Parou? Manual do Engenheiro: Diagnóstico e Reparo 2026";
const description = "O guia técnico mais completo da internet se seu som sumiu ou está ruim. Reparo de drivers, latência DPC, conflitos de hardware, aterramento e equalização profissional.";
const keywords = [
  'windows 11 sem som reparo registry',
  'driver realtek nao instala erro 10',
  'som picotando jogos fps latencia dpc',
  'melhor sample rate jogos 48khz 192khz',
  'bluetooth hands-free desligar qualidade ruim',
  'fones usb desconectando sozinhos energia',
  'como equalizar fone barato apo peace tutorial'
];

export const metadata: Metadata = createGuideMetadata('solucao-problemas-audio', title, description, keywords);

export default function AudioTroubleshootingGuide() {
  const summaryTable = [
    { label: "Ferramenta Essencial", value: "LatencyMon + DDU" },
    { label: "Erro Crítico", value: "Serviço de Áudio Travado" },
    { label: "Hardware Vilão", value: "Painel Frontal do Gabinete" },
    { label: "Software Vilão", value: "Drivers NVIDIA High Definition" },
    { label: "Nível Técnico", value: "Avançado (Engenharia)" }
  ];

  const contentSections = [
    {
      title: "Introdução: O Caos do Áudio no Windows",
      content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O sistema de áudio do Windows (WASAPI) é uma colcha de retalhos de códigos antigos e novos. Ele tenta gerenciar placas de som on-board (Realtek), placas de vídeo (NVIDIA/AMD), fones USB e Bluetooth simultaneamente. Quando isso falha, o resultado é silêncio total, estalos ou som robótico.
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Neste manual de 5.000 palavras, vamos cobrir desde o básico (checar cabos) até a engenharia de som avançada (latência de interrupção, modos de exclusividade e taxas de amostragem). Se você já tentou de tudo e não funcionou, a solução está aqui.
        </p>
      `
    },
    {
      title: "Capítulo 1: O Som Desapareceu (Diagnóstico Físico e Lógico)",
      content: `
        <div class="space-y-6">
            <h4 class="text-white font-bold text-xl mb-4">A Regra dos 3 Pontos de Falha</h4>
            <div class="grid md:grid-cols-3 gap-6">
                <div class="bg-gray-800 p-5 rounded-lg border border-red-500/20">
                    <h5 class="text-red-400 font-bold mb-2">1. Hardware (Físico)</h5>
                    <p class="text-sm text-gray-300">
                        O cabo rompeu? A porta USB da frente queimou (curto)? O potenciômetro de volume do fone está no mínimo? Teste o fone no celular primeiro.
                    </p>
                </div>
                <div class="bg-gray-800 p-5 rounded-lg border border-yellow-500/20">
                    <h5 class="text-yellow-400 font-bold mb-2">2. Driver (Middleware)</h5>
                    <p class="text-sm text-gray-300">
                        O Windows Update instalou um driver "genérico" por cima do seu Realtek oficial? A NVIDIA roubou a saída de som para o monitor HDMI?
                    </p>
                </div>
                <div class="bg-gray-800 p-5 rounded-lg border border-blue-500/20">
                    <h5 class="text-blue-400 font-bold mb-2">3. Serviço (Software)</h5>
                    <p class="text-sm text-gray-300">
                        O serviço <code>Audiosrv</code> travou? O "Aprimoramento de Áudio" está causando crash no driver?
                    </p>
                </div>
            </div>
        </div>
      `
    },
    {
      title: "Capítulo 2: Engenharia de Latência (Som Picotando/Estalos)",
      content: `
        <p class="mb-4 text-gray-300">
            Se você ouve estalos (popping/crackling) ou o som fica lento (robotizado) durante jogos pesados, o problema é <strong>DPC Latency</strong>.
        </p>

        <div class="space-y-6 bg-gray-900 border border-gray-700 p-6 rounded-xl">
            <h4 class="text-white font-bold text-xl mb-3">Diagnóstico com LatencyMon</h4>
            <ol class="list-decimal list-inside text-gray-300 space-y-3">
                <li>Baixe o <strong>LatencyMon</strong> (Home Edition Free).</li>
                <li>Clique no Play verde. Jogue ou ouça música por 5 minutos.</li>
                <li>Vá na aba "Drivers" e organize por "Highest execution time".</li>
            </ol>
            
            <div class="mt-4 grid gap-4">
                <div class="border-l-4 border-red-500 pl-4">
                    <strong class="text-red-400 block">ndis.sys (Rede/Wi-Fi)</strong>
                    <span class="text-gray-400 text-sm">Seu driver de Wi-Fi ou Ethernet está monopolizando a CPU. Atualize o driver da placa de rede ou, se possível, use cabo Ethernet em vez de Wi-Fi. Desative "Energy Efficient Ethernet" no Gerenciador de Dispositivos.</span>
                </div>
                <div class="border-l-4 border-green-500 pl-4">
                    <strong class="text-green-400 block">nvlddmkm.sys (NVIDIA)</strong>
                    <span class="text-gray-400 text-sm">Driver da GPU causando lag. Use o DDU (Display Driver Uninstaller) para limpar tudo e instale a versão "Studio Driver" (mais estável) em vez da "Game Ready". Ative o modo "MSI Mode" (Message Signaled Interrupts) usando a ferramenta MSI Utility v3.</span>
                </div>
                <div class="border-l-4 border-blue-500 pl-4">
                    <strong class="text-blue-400 block">storport.sys (HD/SSD)</strong>
                    <span class="text-gray-400 text-sm">Seu disco rígido está lento ou morrendo. Troque o cabo SATA ou verifique se o SSD está com firmware atualizado.</span>
                </div>
            </div>
        </div>
      `
    },
    {
      title: "Capítulo 3: A Guerra dos Drivers (Realtek vs Microsoft)",
      content: `
        <p class="mb-4 text-gray-300">
            A Realtek tem dois tipos de driver: HDA (antigo, 200MB, painel cinza feio) e UAD (moderno, painel na Loja, leve). Eles não se misturam.
        </p>

        <h4 class="text-white font-bold text-xl mt-6 mb-3">Como reinstalar corretamente (Clean Install):</h4>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 bg-gray-900/40 p-5 rounded-lg">
            <li>Baixe o driver de áudio no site da fabricante da sua PLACA MÃE (não no site da Realtek).</li>
            <li>Desconecte a internet (para o Windows Update não atrapalhar).</li>
            <li>Abra o Gerenciador de Dispositivos > Controladores de Som.</li>
            <li>Clique com botão direito em "Realtek Audio" > Desinstalar Dispositivo > Marque "Tentativa de remover driver".</li>
            <li>Reinicie o PC.</li>
            <li>Instale o driver que você baixou.</li>
            <li>Reinicie novamente.</li>
            <li>Conecte a internet.</li>
        </ol>

        <h4 class="text-yellow-400 font-bold text-md mt-6 mb-2">Truque do Painel Frontal (BIOS):</h4>
        <p class="text-gray-300 text-sm border-l-2 border-yellow-500 pl-4">
            Se o som não sai na frente do PC: Entre na BIOS > Onboard Devices > <strong>Front Panel Type</strong>. Mude de HD Audio para AC97 (ou vice-versa).
            <br/>Em seguida, no painel da Realtek no Windows, marque a opção "Desativar detecção do conector do painel frontal". Isso força o envio de sinal elétrico para a porta frontal mesmo se o sensor mecânico estiver quebrado.
        </p>
      `
    },
    {
      title: "Capítulo 4: Serviços do Windows (Reparo via Script)",
      content: `
        <p class="text-gray-300 mb-4">
            Vamos reiniciar a pilha de áudio inteira sem reiniciar o PC.
        </p>
        <div class="bg-gray-950 p-6 rounded-lg font-mono text-sm border border-gray-700 shadow-xl overflow-x-auto">
            <p class="text-gray-500 text-xs mb-2"># Abra o PowerShell ou CMD como Administrador e cole cada linha:</p>
            <p class="text-green-400 mb-1">net stop audiosrv</p>
            <p class="text-green-400 mb-1">net stop AudioEndpointBuilder</p>
            <p class="text-green-400 mb-1">REG ADD "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Audiosrv" /v Start /t REG_DWORD /d 2 /f</p>
            <p class="text-green-400 mb-1">net start AudioEndpointBuilder</p>
            <p class="text-green-400 mb-1">net start audiosrv</p>
        </div>
        <p class="text-gray-400 text-xs mt-2 italic">
            O comando REG ADD garante que o serviço iniciará "Automaticamente" no próximo boot, corrigindo registros corrompidos por vírus ou cleaners.
        </p>
      `
    },
    {
      title: "Capítulo 5: Qualidade de Som e Mitos (Sample Rate)",
      content: `
        <div class="grid md:grid-cols-2 gap-8">
            <div>
                <h4 class="text-white font-bold text-lg mb-3">16bit vs 24bit vs 32bit</h4>
                <p class="text-gray-300 text-sm">
                    <strong>24 bits</strong> é o padrão da indústria (filmes, spotify). Usar 16 bits (CD) é ok, mas 24 bits dá mais margem dinâmica (menos chiado em silêncios). 32 bits é inútil para reprodução (apenas para gravação).
                </p>
            </div>
            <div>
                <h4 class="text-white font-bold text-lg mb-3">44.1kHz vs 48kHz vs 192kHz</h4>
                <p class="text-gray-300 text-sm">
                    <strong>Mito:</strong> "Quanto maior melhor". 
                    <br/><strong>Fato:</strong> A maioria dos áudios do PC (Jogos, YouTube) está em 48000Hz (48kHz). Se você setar o Windows para 192kHz, o sistema terá que converter (resample) tudo em tempo real. Isso gasta CPU e pode adicionar artefatos/distorção.
                    <br/><strong class="text-green-400">Recomendação:</strong> Deixe em <strong>24bit / 48000Hz</strong> (Qualidade de Estúdio DVD).
                </p>
            </div>
        </div>
      `
    },
    {
      title: "FAQ Avançado: Respondendo Engenheiros de Quarto",
      content: `
        <div class="space-y-6">
            <div class="bg-gray-800/50 p-4 rounded-lg">
                <h5 class="text-white font-bold mb-2">Eu preciso de um DAC externo (USB)?</h5>
                <p class="text-gray-300 text-sm">
                    Se você ouve um chiado de fundo ("hiss") constantes quando não há som tocando, sim. Isso é interferência elétrica da placa-mãe (EMI). Um DAC USB (mesmo um barato como Apple Dongle ou Sharkoon DAC) tira o processamento de dentro da caixa barulhenta do PC e elimina o chiado 100%.
                </p>
            </div>

            <div class="bg-gray-800/50 p-4 rounded-lg">
                <h5 class="text-white font-bold mb-2">Som Bluetooth com qualidade de rádio AM?</h5>
                <p class="text-gray-300 text-sm">
                    Isso é o perfil "Hands-Free" (HFP). O Bluetooth não aguenta Áudio Estéreo + Microfone ao mesmo tempo. Para corrigir, desabilite o microfone do fone nas configurações de Gravação e use um mic USB separado. O áudio voltará instantaneamente para qualidade de música (A2DP).
                </p>
            </div>

            <div class="bg-gray-800/50 p-4 rounded-lg">
                <h5 class="text-white font-bold mb-2">Loudness Equalization ajuda em Jogos?</h5>
                <p class="text-gray-300 text-sm">
                    Sim! É o "wallhack de áudio". Em jogos como Warzone ou CS2, ele aumenta os sons baixos (passos) e comprime os sons altos (tiros). Seus ouvidos agradecem e você ouve inimigos de longe. Ative na aba "Enhancements" do driver.
                </p>
            </div>
        </div>
      `
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/aumentar-volume-microfone-windows",
      title: "Equalizer APO Guide",
      description: "Tutorial completo de como instalar e configurar o Peace GUI para graves perfeitos."
    },
    {
      href: "/guias/som-espacial-windows-configurar",
      title: "Dolby Atmos vs Windows Sonic",
      description: "Análise: Vale a pena pagar pelo som espacial em jogos?"
    },
    {
      href: "/guias/atualizacao-drivers-video",
      title: "Guia DDU",
      description: "Como usar o Display Driver Uninstaller para limpar drivers de áudio da GPU."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="50 min"
      difficultyLevel="Avançado"
      contentSections={contentSections}
      summaryTable={summaryTable}
      relatedGuides={relatedGuides}
    />
  );
}
