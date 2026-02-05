import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'solucao-problemas-audio',
  title: "Como Resolver Problemas de Áudio no Windows (2026)",
  description: "Seu PC está sem som ou com som chiando? Aprenda como diagnosticar e resolver erros de áudio no Windows 11 com este guia passo a passo em 2026.",
  category: 'windows-geral',
  difficulty: 'Iniciante',
  time: '15 min'
};

const title = "Como Resolver Problemas de Áudio no Windows (2026)";
const description = "Seu PC está sem som ou com som chiando? Aprenda como diagnosticar e resolver erros de áudio no Windows 11 com este guia passo a passo em 2026.";
const keywords = [
  'windows 11 sem som como resolver 2026',
  'corrigir audio chiando ou estalando windows tutorial',
  'habilitar saida de audio hdmi windows 11 guia',
  'driver de som nao instalado como resolver 2026',
  'erro de som no windows 11 gerenciador de dispositivos'
];

export const metadata: Metadata = createGuideMetadata('solucao-problemas-audio', title, description, keywords);

export default function AudioTroubleshootingGuide() {
  const summaryTable = [
    { label: "Sintoma Comum", value: "Ícone de som com 'X' vermelho" },
    { label: "Causa Provável", value: "Driver genérico ou Serviço parado" },
    { label: "Solução Chave", value: "Windows Audio Service Reset" },
    { label: "Dificuldade", value: "Fácil" }
  ];

  const contentSections = [
    {
      title: "O caos do áudio no Windows 11",
      content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Em 2026, com a multiplicidade de dispositivos (Headsets USB, Bluetooth, Monitores com som, Caixas de som P2), o Windows 11 frequentemente se perde ao decidir por onde o som deve sair. Além disso, atualizações de sistema podem corromper os drivers da **Realtek** ou da sua GPU (HDMI Audio), resultando no temido silêncio total ou em áudio distorcido.
        </p>
      `
    },
    {
      title: "1. O Básico: Selecionando o Dispositivo",
      content: `
        <p class="mb-4 text-gray-300">Antes de técnicos avançados, cheque o obvio:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Clique no ícone de volume (ou <code>Win + A</code>).</li>
            <li>Clique no ícone de saída de som (ao lado da barra de volume).</li>
            <li>Certifique-se de que o dispositivo correto está selecionado (ex: Realtek Audio em vez de NVIDIA Output).</li>
            <li>Verifique se o botão 'Mudo' não está ativado por acidente no fone ou no teclado.</li>
        </ol>
      `
    },
    {
      title: "2. Resetando os Serviços de Áudio",
      content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Comando de Ressuscitação:</h4>
            <p class="text-sm text-gray-300">
                Se o som sumiu e não volta mesmo reiniciando, o serviço 'Audiosrv' pode ter travado. <br/><br/>
                1. Aperte <code>Win + R</code>, digite <code>services.msc</code>. <br/>
                2. Procure por <strong>Áudio do Windows</strong>. <br/>
                3. Clique com o botão direito e escolha <strong>'Reiniciar'</strong>. Faça o mesmo para o serviço 'Construtor de Pontos de Extremidade de Áudio'.
            </p>
        </div>
      `
    },
    {
      title: "3. Corrigindo o Áudio Chiando (Sample Rate)",
      content: `
        <p class="mb-4 text-gray-300">
            <strong>Som "estourado" ou com estalos:</strong> 
            <br/><br/>Isso geralmente acontece quando a frequência de amostragem do Windows é maior do que o seu fone suporta. <br/><br/>
            Vá em Painel de Controle > Som > Propriedades do seu dispositivo > Avançado. Mude para <strong>24 bits, 48000 Hz</strong>. Em 2026, essa é a frequência padrão que garante compatibilidade total com jogos e vídeos de alta fidelidade sem causar bugs de processamento na CPU.
        </p>
      `
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/corrigir-audio-chiado-windows",
      title: "Áudio Estático",
      description: "Dicas profundas para eliminar ruídos elétricos."
    },
    {
      href: "/guias/som-espacial-windows-configurar",
      title: "Som Espacial",
      description: "Aprenda a ativar efeitos de som 360°."
    },
    {
      href: "/guias/aumentar-volume-microfone-windows",
      title: "Volume Microfone",
      description: "Resolva problemas de gravação e voz baixa."
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
      summaryTable={summaryTable}
      relatedGuides={relatedGuides}
    />
  );
}
