import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'solucao-problemas-bluetooth',
  title: "Problemas de Bluetooth no Windows 11: Guia de Correção (2026)",
  description: "Seu controle ou fone bluetooth não conecta ou fica desconectando? Aprenda como resolver erros de bluetooth no Windows 11 em 2026.",
  category: 'windows-geral',
  difficulty: 'Intermediário',
  time: '15 min'
};

const title = "Problemas de Bluetooth no Windows 11: Guia de Correção (2026)";
const description = "Seu controle ou fone bluetooth não conecta ou fica desconectando? Aprenda como resolver erros de bluetooth no Windows 11 em 2026.";
const keywords = [
  'bluetooth windows 11 nao funciona como resolver 2026',
  'fone bluetooth desconectando sozinho pc tutorial',
  'atualizar driver bluetooth windows 11 guia 2026',
  'controle xbox nao conecta bluetooth pc fix',
  'ativar bluetooth windows 11 tutorial passo a passo'
];

export const metadata: Metadata = createGuideMetadata('solucao-problemas-bluetooth', title, description, keywords);

export default function BluetoothTroubleshootingGuide() {
  const summaryTable = [
    { label: "Sintoma", value: "Atraso no áudio (Lag) ou Quedas" },
    { label: "Causa Comum", value: "Economia de energia ou Antena mal posicionada" },
    { label: "Software", value: "Serviço de Suporte Bluetooth" },
    { label: "Dificuldade", value: "Médio" }
  ];

  const contentSections = [
    {
      title: "O Bluetooth no PC em 2026",
      content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Embora a tecnologia Bluetooth tenha evoluído para a versão 5.4+ em 2026, a integração com o Windows 11 ainda apresenta desafios. Problemas de interferência com o Wi-Fi, drivers genéricos e configurações de economia de energia agressivas são os maiores culpados por controles de Xbox que desconectam no meio da partida ou fones que apresentam áudio "picotado".
        </p>
      `
    },
    {
      title: "1. Desativando a Economia de Energia",
      content: `
        <p class="mb-4 text-gray-300">Este é o principal motivo pelo qual fones desconectam após alguns minutos de silêncio:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Clique com o botão direito no Iniciar e vá em <strong>Gerenciador de Dispositivos</strong>.</li>
            <li>Expanda 'Bluetooth' e localize o seu adaptador (ex: Intel(R) Wireless Bluetooth).</li>
            <li>Vá em Propriedades > **Gerenciamento de Energia**.</li>
            <li>Desmarque a caixa <strong>"O computador pode desligar o dispositivo para economizar energia"</strong>.</li>
            <li>Isso garante que o sinal permaneça forte e estável o tempo todo.</li>
        </ol>
      `
    },
    {
      title: "2. O truque da Antena Wi-Fi",
      content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Dica de Hardware:</h4>
            <p class="text-sm text-gray-300">
                Se você usa um PC de mesa com antenas Wi-Fi na parte de trás da placa-mãe, certifique-se de que as antenas estejam **conectadas**, mesmo que você use internet via cabo. O chip de Bluetooth usa essas mesmas antenas para transmitir o sinal. Sem elas, o alcance do Bluetooth cai para menos de 1 metro, causando lag severo em controles e áudio.
            </p>
        </div>
      `
    },
    {
      title: "3. Redefinindo os Serviços Bluetooth",
      content: `
        <p class="mb-4 text-gray-300">
            <strong>O ícone sumiu?</strong> 
            <br/><br/>Se o botão de Bluetooth sumiu da barra de tarefas, aperte <code>Win + R</code>, digite <code>services.msc</code> e procure por **Serviço de Suporte Bluetooth**. Garanta que o 'Tipo de inicialização' esteja em <strong>Automático</strong> e que o serviço esteja em execução. Muitas vezes, otimizadores de sistema agressivos desativam esse serviço para "ganhar performance", quebrando a conectividade.
        </p>
      `
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/zonas-mortas-analogico-controle-fix",
      title: "Fix Controle",
      description: "Resolva drift no analógico via bluetooth."
    },
    {
      href: "/guias/hard-reset-fones-bluetooth-fix",
      title: "Resetar Fones",
      description: "Como forçar o emparelhamento de fones presos."
    },
    {
      href: "/guias/atualizacao-drivers-video",
      title: "Atualizar Drivers",
      description: "Dicas sobre drivers de chipset e I/O."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="15 min"
      difficultyLevel="Médio"
      contentSections={contentSections}
      summaryTable={summaryTable}
      relatedGuides={relatedGuides}
    />
  );
}
