import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'solucao-problemas-audio',
  title: "Áudio do Windows Parou? Guia Definitivo de Reparo (2026)",
  description: "Resolva qualquer problema de som no Windows 10/11. Drivers Realtek, Serviços de Áudio, som chiando e erros de dispositivo não detectado.",
  category: 'windows-geral',
  difficulty: 'Intermediário',
  time: '20 min'
};

const title = "Áudio do Windows Parou? Guia Definitivo de Reparo (2026)";
const description = "Resolva qualquer problema de som no Windows 10/11. Drivers Realtek, Serviços de Áudio, som chiando e erros de dispositivo não detectado.";
const keywords = [
  'windows 11 sem som resolve',
  'driver realtek audio nao funciona 2026',
  'serviço de audio do windows não está em execução',
  'audio chiando windows 11 sample rate',
  'gerenciador de dispositivos audio exclamação',
  'nenhum dispositivo de saida de audio instalado'
];

export const metadata: Metadata = createGuideMetadata('solucao-problemas-audio', title, description, keywords);

export default function AudioTroubleshootingGuide() {
  const summaryTable = [
    { label: "Erro Crítico", value: "Serviço de Áudio Parado" },
    { label: "Driver Comum", value: "Realtek High Definition Audio" },
    { label: "Ferramenta Chave", value: "Gerenciador de Dispositivos" },
    { label: "Solução Rápida", value: "Reiniciar Audiosrv" },
    { label: "Dificuldade", value: "Média" }
  ];

  const contentSections = [
    {
      title: "Diagnóstico Inicial: Por que o som sumiu?",
      content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Problemas de áudio no Windows podem variar de um simples botão "Mute" esquecido até corrupção de arquivos de sistema profundos. Em 2026, com a popularização de fones Bluetooth e USB, o Windows frequentemente se confunde ao alternar entre saídas de áudio.
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
            Este guia segue uma ordem lógica: do mais simples ao mais complexo. Siga passo a passo para não perder tempo formatando o PC desnecessariamente.
        </p>
      `
    },
    {
      title: "1. Verificações Físicas e Básicas (Não pule!)",
      content: `
        <div class="bg-gray-800/50 p-4 rounded-lg mb-4">
            <ul class="list-disc list-inside text-gray-300 space-y-2">
                <li><strong>Dispositivo de Saída:</strong> Clique no ícone de som na barra de tarefas. Verifique se a saída correta está selecionada (ex: seu Headset e não o Monitor HDMI).</li>
                <li><strong>Volume Físico:</strong> Verifique se há rodinhas de volume no fio do seu fone ou botões no teclado que mutaram o sistema.</li>
                <li><strong>Portas USB/P2:</strong> Troque a porta USB ou o conector P2 (verde) para testar se a entrada da placa mãe queimou.</li>
            </ul>
        </div>
      `
    },
    {
      title: "2. Reiniciando os Serviços de Áudio (A Solução Mágica)",
      content: `
        <p class="mb-4 text-gray-300">
            Muitas vezes o driver está ok, mas o serviço do Windows que gerencia o som travou.
        </p>
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Passo a Passo:</h4>
            <ol class="list-decimal list-inside text-gray-300 space-y-2 text-sm">
                <li>Pressione <strong>Win + R</strong>, digite <code>services.msc</code> e dê Enter.</li>
                <li>Na lista, procure por <strong>Áudio do Windows</strong> (ou Windows Audio).</li>
                <li>Clique com o botão direito e selecione <strong>Reiniciar</strong>.</li>
                <li>Faça o mesmo com o serviço <strong>Construtor de Pontos de Extremidade de Áudio do Windows</strong>.</li>
            </ol>
            <p class="text-xs text-gray-400 mt-2">Dica: Se o serviço estiver desativado, clique duas vezes nele e mude o "Tipo de Inicialização" para "Automático".</p>
        </div>
      `
    },
    {
      title: "3. Reinstalação Limpa de Drivers",
      content: `
        <p class="mb-4 text-gray-300">
            Drivers corrompidos, especialmente da Realtek após updates do Windows, são vilões comuns.
        </p>
        <div class="space-y-4">
            <div>
                <h4 class="font-bold text-white text-md">Método Correto:</h4>
                <p class="text-gray-300 text-sm">
                    1. Abra o <strong>Gerenciador de Dispositivos</strong> (Win+X). <br/>
                    2. Expanda "Controladores de som, vídeo e jogos". <br/>
                    3. Clique com botão direito no seu dispositivo de áudio (ex: Realtek Audio) e escolha <strong>Desinstalar dispositivo</strong>. <br/>
                    4. Reinicie o computador imediatamente. O Windows tentará instalar um driver genérico estável automaticamente.
                </p>
            </div>
            <div>
                <h4 class="font-bold text-white text-md">Se não funcionar:</h4>
                <p class="text-gray-300 text-sm">
                    Vá ao site da fabricante da sua placa-mãe (Asus, Gigabyte, Dell, etc.), busque pelo modelo exato e baixe o driver de áudio oficial mais recente. Evite usar programas como "Driver Booster" que podem instalar versões incompatíveis.
                </p>
            </div>
        </div>
      `
    },
    {
      title: "4. Áudio Chiando, Estalos ou Robotizado",
      content: `
        <p class="mb-4 text-gray-300">
            Se você tem som, mas a qualidade está horrível, o problema geralmente é a <strong>Taxa de Amostragem</strong> ou <strong>Aprimoramentos de Som</strong>.
        </p>
        
        <h4 class="text-white font-bold mb-2 mt-4">Corrigindo a Taxa de Amostragem:</h4>
        <ol class="list-decimal list-inside text-gray-300 space-y-2 mb-4 bg-gray-900/30 p-4 rounded-lg">
            <li>Painel de Controle > Hardware e Sons > Som.</li>
            <li>Clique duas vezes no seu dispositivo de reprodução padrão.</li>
            <li>Vá na aba <strong>Avançado</strong>.</li>
            <li>Mude o Formato Padrão para <strong>24 bits, 48000 Hz (Qualidade de Estúdio)</strong>.</li>
            <li>Valores muito altos (192kHz) podem causar chiado em fones comuns.</li>
        </ol>

        <h4 class="text-white font-bold mb-2 mt-4">Desativando Aprimoramentos:</h4>
        <p class="text-gray-300 text-sm">
            Na mesma janela, procure a aba "Aprimoramentos" (Enhancements) e marque a caixa <strong>"Desabilitar todos os efeitos sonoros"</strong>. Drivers bugados tentam aplicar efeitos 3D que destroem a qualidade do áudio.
        </p>
      `
    },
    {
      title: "5. FAQ e Casos Específicos",
      content: `
        <div class="space-y-6">
            <div>
                <h4 class="font-bold text-white text-lg">Erro "Nenhum dispositivo de saída de áudio instalado"</h4>
                <p class="text-gray-300 text-sm mt-1">
                    Isso geralmente indica falha no hardware ou driver de chipset não instalado. Tente instalar os drivers de Chipset da sua placa-mãe. Em casos raros, pode ser necessário adicionar hardware legado no Gerenciador de Dispositivos manuamente.
                </p>
            </div>
            <div>
                <h4 class="font-bold text-white text-lg">Meu microfone funciona, mas o som não sai</h4>
                <p class="text-gray-300 text-sm mt-1">
                    Verifique as configurações de privacidade. Vá em Configurações > Privacidade > Microfone e garanta que os apps têm permissão. Para o som de saída, verifique se o dispositivo não está definido como "Dispositivo de Comunicação Padrão" apenas, mas sim como "Dispositivo Padrão".
                </p>
            </div>
            <div>
                <h4 class="font-bold text-white text-lg">O som some quando entro em chamada no Discord</h4>
                <p class="text-gray-300 text-sm mt-1">
                    Isso é causado pelo "Controle Exclusivo". Vá nas propriedades do dispositivo > aba Avançado e desmarque <strong>"Permitir que aplicativos assumam o controle exclusivo deste dispositivo"</strong>.
                </p>
            </div>
        </div>
      `
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/aumentar-volume-microfone-windows",
      title: "Microfone Baixo?",
      description: "Como dar boost no volume do seu microfone."
    },
    {
      href: "/guias/som-espacial-windows-configurar",
      title: "Som Espacial e 7.1",
      description: "Ative o Windows Sonic ou Dolby Atmos para jogos."
    },
    {
      href: "/guias/atualizacao-drivers-video",
      title: "Atualizar Drivers Corretamente",
      description: "Saiba quando e como atualizar seus componentes."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="20 min"
      difficultyLevel="Intermediário"
      contentSections={contentSections}
      summaryTable={summaryTable}
      relatedGuides={relatedGuides}
    />
  );
}
