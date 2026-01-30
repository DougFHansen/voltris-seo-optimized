import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Corrigir Problemas de Som no Windows 10/11 - Saída de Áudio, Configurações e Driver";
const description = "Guia definitivo para corrigir problemas de som no Windows: saída de áudio, configurações de som, som do sistema e áudio do Windows. Localize e resolva em minutos. Passo a passo para Windows 10 e 11.";
const keywords = [
  "corrigir problemas de som",
  "corrigir saída de som",
  "localizar e corrigir problemas som",
  "saida de som",
  "som do sistema",
  "corrigir problemas de audio",
  "configurações som",
  "opções de áudio",
  "ajustando configurações saída áudio",
  "corrigir problema de som",
  "áudio",
  "reiniciar configurações de som",
  "audio do windows",
  "corrigir problemas de áudio",
  "corrigir problemas de som windows 10",
  "corrigir problemas reprodução som",
  "windows sem som",
  "driver realtek",
  "dispositivo de saída de áudio",
];

export const metadata: Metadata = createGuideMetadata('solucao-problemas-audio', title, description, keywords);

export default function SolucaoProblemasAudioGuide() {
  const summaryTable = [
    { label: "Dificuldade", value: "Iniciante a Intermediário" },
    { label: "Tempo", value: "15–25 min" },
    { label: "Sistema", value: "Windows 10 / Windows 11" },
  ];

  const faqItems = [
    {
      question: "Como corrigir problemas de som no Windows 10?",
      answer: "Verifique o dispositivo de saída (ícone de som na barra de tarefas), reinicie o serviço \"Áudio do Windows\" em services.msc, atualize o driver de áudio no Gerenciador de Dispositivos e desative aperfeiçoamentos de som nas propriedades do dispositivo. Este guia traz o passo a passo completo.",
    },
    {
      question: "Por que não há saída de som no meu PC?",
      answer: "As causas mais comuns são: dispositivo de saída errado (ex.: HDMI sem áudio), volume em mudo, cabo P2 na entrada errada (use a porta verde), driver de áudio desatualizado ou serviço de áudio travado. Siga as etapas deste guia para localizar e corrigir.",
    },
    {
      question: "Como reiniciar as configurações de som no Windows?",
      answer: "Abra services.msc (Win + R), localize \"Windows Audio\" e \"Windows Audio Endpoint Builder\", clique com o botão direito em cada um e escolha Reiniciar. Se o som ainda falhar, reinicie o PC ou reinstale o driver de áudio.",
    },
    {
      question: "O que fazer quando o áudio do Windows não funciona?",
      answer: "Confirme que o dispositivo de saída correto está selecionado, reinicie os serviços de áudio, desative efeitos sonoros nas propriedades do dispositivo e, se necessário, atualize ou reinstale o driver de áudio (Realtek, Intel, etc.) pelo Gerenciador de Dispositivos.",
    },
  ];

  const contentSections = [
    {
      title: "Introdução: Localizar e Corrigir Problemas de Som",
      content: `
        <p class="mb-4 text-gray-300 leading-relaxed">Problemas de som no Windows são muito comuns: <strong>saída de áudio</strong> que não funciona, <strong>som do sistema</strong> que some ou <strong>configurações de áudio</strong> que parecem erradas. Este guia ajuda você a <strong>localizar e corrigir</strong> a causa em poucos minutos, no Windows 10 e no Windows 11.</p>
        <p class="mb-4 text-gray-300">As causas mais frequentes são dispositivo de saída errado, volume em mudo, driver desatualizado ou serviço de áudio travado. Abaixo, seguimos do mais simples ao mais avançado.</p>
      `,
      subsections: [],
    },
    {
      title: "1. Verificar Dispositivo de Saída de Áudio (Saída de Som)",
      content: `
        <p class="mb-4 text-gray-300">O Windows pode estar enviando o <strong>som</strong> para o monitor HDMI (que às vezes não tem caixas), para fones Bluetooth desligados ou para um dispositivo que você não está usando.</p>
      `,
      subsections: [
        {
          subtitle: "Como escolher a saída de som correta",
          content: `
            <ul class="list-decimal list-inside space-y-2 text-gray-300">
              <li>Clique no <strong>ícone de som</strong> na barra de tarefas (canto direito).</li>
              <li>Clique na seta ou no nome do dispositivo atual (ex.: "Alto-falantes (Realtek)").</li>
              <li>Selecione o dispositivo que você está usando: <strong>Alto-falantes</strong>, <strong>Fones P2</strong>, <strong>HDMI</strong> ou <strong>Bluetooth</strong>.</li>
              <li>Verifique se o volume não está em mudo e se a barra está em nível audível.</li>
            </ul>
          `,
        },
      ],
    },
    {
      title: "2. Verificações Físicas (Cabos e Volume)",
      content: `
        <p class="mb-4 text-gray-300">Antes de mexer em driver ou configurações, confirme o básico:</p>
        <ul class="list-disc list-inside space-y-2 text-gray-300">
          <li><strong>Cabo P2 (fone/caixa):</strong> Conecte na porta <strong>verde</strong> (saída de som). Azul é entrada (microfone), rosa é microfone.</li>
          <li><strong>Volume físico:</strong> Caixas de som e monitores costumam ter botão de volume; verifique se não está no mudo ou no mínimo.</li>
          <li><strong>HDMI:</strong> Se usa TV ou monitor por HDMI, alguns modelos não reproduzem áudio; nesse caso, escolha "Alto-falantes" ou uma saída P2 no Windows.</li>
        </ul>
      `,
      subsections: [],
    },
    {
      title: "3. Reiniciar Configurações de Som e Serviço de Áudio do Windows",
      content: `
        <p class="mb-4 text-gray-300">Se o <strong>som do sistema</strong> parou do nada, reiniciar o serviço de áudio costuma resolver. Isso equivale a <strong>reiniciar as configurações de som</strong> sem alterar suas preferências.</p>
      `,
      subsections: [
        {
          subtitle: "Passo a passo: reiniciar serviços de áudio",
          content: `
            <div class="bg-[#1E1E22] p-4 rounded-lg border border-gray-700 font-mono text-sm text-gray-300 space-y-2">
              <p>1. Pressione <strong>Win + R</strong>, digite <strong>services.msc</strong> e Enter.</p>
              <p>2. Procure por <strong>"Windows Audio"</strong> (ou "Áudio do Windows").</p>
              <p>3. Clique com o botão direito → <strong>Reiniciar</strong>.</p>
              <p>4. Faça o mesmo para <strong>"Windows Audio Endpoint Builder"</strong>.</p>
              <p>5. Aguarde alguns segundos e teste o som novamente.</p>
            </div>
          `,
        },
      ],
    },
    {
      title: "4. Ajustando as Configurações de Saída de Áudio e Opções de Áudio",
      content: `
        <p class="mb-4 text-gray-300">As <strong>configurações de som</strong> e as <strong>opções de áudio</strong> podem estar com dispositivo errado ou com efeitos que causam falha. Ajuste assim:</p>
      `,
      subsections: [
        {
          subtitle: "Abrir Configurações de Som no Windows 10/11",
          content: `
            <p class="text-gray-300 mb-2">Clique com o botão direito no ícone de som na barra de tarefas → <strong>Configurações de som</strong> (ou "Configurações de reprodução"). Em Windows 11: Configurações → Sistema → Som.</p>
            <p class="text-gray-300">Em "Escolha onde reproduzir o som", selecione o dispositivo correto. Em "Volume", confirme que não está em 0 ou mudo.</p>
          `,
        },
        {
          subtitle: "Desativar aperfeiçoamentos (corrigir problemas de reprodução de som)",
          content: `
            <p class="text-gray-300 mb-2">Drivers antigos às vezes falham com efeitos de som. Para <strong>corrigir problemas de reprodução de som</strong>:</p>
            <ul class="list-disc list-inside text-gray-300 space-y-1">
              <li>Em Configurações de som, clique em <strong>Mais configurações de som</strong> (ou "Propriedades do dispositivo").</li>
              <li>Vá na aba <strong>Aperfeiçoamentos</strong>.</li>
              <li>Marque <strong>"Desativar todos os efeitos sonoros"</strong> e aplique.</li>
            </ul>
          `,
        },
      ],
    },
    {
      title: "5. Corrigir Problemas de Áudio com o Driver (Realtek, Intel, etc.)",
      content: `
        <p class="mb-4 text-gray-300">Se o <strong>áudio do Windows</strong> ainda não funcionar, o <strong>driver de áudio</strong> pode estar desatualizado, corrompido ou em conflito. Use o Gerenciador de Dispositivos:</p>
      `,
      subsections: [
        {
          subtitle: "Atualizar ou reinstalar driver de áudio",
          content: `
            <ul class="list-decimal list-inside space-y-2 text-gray-300">
              <li>Pressione <strong>Win + X</strong> → <strong>Gerenciador de Dispositivos</strong>.</li>
              <li>Expanda <strong>"Entradas e saídas de áudio"</strong> ou <strong>"Controladores de som, vídeo e jogos"</strong>.</li>
              <li>Clique com o botão direito no dispositivo de áudio (ex.: Realtek) → <strong>Atualizar driver</strong> → "Procurar drivers na Internet".</li>
              <li>Se não resolver: mesmo menu → <strong>Desinstalar dispositivo</strong> → reinicie o PC; o Windows reinstala o driver na inicialização.</li>
            </ul>
            <p class="text-gray-300 mt-4">Para placas de som dedicadas (ex.: Creative), baixe o driver mais recente no site do fabricante.</p>
          `,
        },
      ],
    },
    {
      title: "6. Solução de Problemas Automática do Windows",
      content: `
        <p class="mb-4 text-gray-300">O Windows 10 e o Windows 11 têm um assistente que tenta <strong>corrigir problemas de som</strong> automaticamente:</p>
        <ul class="list-disc list-inside text-gray-300 space-y-1">
          <li>Configurações → Sistema → Som → em "Avançado", procure por <strong>Solucionar problemas de som</strong> ou "Reparar" ao lado do dispositivo.</li>
          <li>Ou: Painel de Controle → Solução de Problemas → Reprodução de áudio.</li>
        </ul>
      `,
      subsections: [],
    },
  ];

  const relatedGuides = [
    {
      href: "/guias/instalacao-drivers",
      title: "Instalação e Atualização de Drivers",
      description: "Atualize o driver de áudio e outros dispositivos.",
    },
    {
      href: "/guias/resolver-erros-windows",
      title: "Resolver Erros Comuns do Windows",
      description: "Telas azuis e travamentos que podem afetar o áudio.",
    },
    {
      href: "/guias/solucao-problemas-bluetooth",
      title: "Solução de Problemas Bluetooth",
      description: "Se o som for por fone ou caixa Bluetooth.",
    },
  ];

  const externalReferences = [
    { name: "Microsoft: Corrigir problemas de som no Windows", url: "https://support.microsoft.com/pt-br/windows/corrigir-problemas-de-som-no-windows-73025246-b61c-40fb-671a-2535c7f736c5" },
    { name: "Microsoft: Configurações de áudio no Windows", url: "https://support.microsoft.com/pt-br/windows/configurar-configura%C3%A7%C3%B5es-de-som-no-windows-20dc0e83-70e4-8cc1-7e8e-7d0e1e4e7e4e" },
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="15–25 min"
      difficultyLevel="Iniciante"
      contentSections={contentSections}
      relatedGuides={relatedGuides}
      summaryTable={summaryTable}
      faqItems={faqItems}
      externalReferences={externalReferences}
    />
  );
}
