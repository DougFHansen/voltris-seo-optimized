import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Como Compartilhar Impressoras na Rede Windows (2026)";
const description = "Quer imprimir de qualquer PC da casa? Aprenda como configurar o compartilhamento de impressoras no Windows 11 de forma simples e segura em 2026.";
const keywords = [
  'como compartilhar impressora na rede windows 11 2026',
  'erro ao compartilhar impressora 0x0000011b tutorial',
  'instalar impressora compartilhada em outro pc guia',
  'compartilhamento de arquivos e impressoras windows 11 tutorial',
  'configurar impressora wifi rede domestica guia 2026'
];

export const metadata: Metadata = createGuideMetadata('compartilhamento-impressoras', title, description, keywords);

export default function PrinterSharingGuide() {
  const summaryTable = [
    { label: "Método Principal", value: "Compartilhamento de Rede Windows (SMB)" },
    { label: "Dica de Segurança", value: "Desativar compartilhamento por senha (se confiável)" },
    { label: "Erro Comum", value: "Bloqueio por Firewall / Credenciais" },
    { label: "Dificuldade", value: "Médio" }
  ];

  const contentSections = [
    {
      title: "Por que compartilhar sua impressora?",
      content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Ter uma impressora para cada computador é caro e desnecessário. Em 2026, mesmo que sua impressora não tenha Wi-Fi nativo, você pode transformá-la em uma "impressora de rede" conectando-a via USB em um PC e liberando o acesso para todos os outros notebooks e desktops da casa ou escritório através do Windows 11.
        </p>
      `
    },
    {
      title: "1. Ativando a Descoberta de Rede",
      content: `
        <p class="mb-4 text-gray-300">Antes de tudo, os computadores precisam "se ver" na rede:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Vá em Painel de Controle > Rede e Internet > Central de Rede e Compartilhamento.</li>
            <li>Clique em 'Alterar as configurações de compartilhamento avançadas'.</li>
            <li>Ative a <strong>'Descoberta de rede'</strong> e o <strong>'Compartilhamento de arquivo e impressora'</strong>.</li>
            <li><strong>Dica:</strong> Em redes domésticas privadas, desative o 'Compartilhamento protegido por senha' para facilitar a conexão entre os PCs.</li>
        </ol>
      `
    },
    {
      title: "2. Preparando a Impressora Host",
      content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">No PC onde a impressora está plugada:</h4>
            <p class="text-sm text-gray-300">
                1. Vá em Configurações > Dispositivos > Impressoras e Scanners. <br/>
                2. Selecione sua impressora e clique em **Propriedades da Impressora**. <br/>
                3. Vá na aba **Compartilhamento** e marque 'Compartilhar esta impressora'. <br/>
                4. Dê um nome simples (ex: Impressora_Sala) para evitar erros de espaço no nome.
            </p>
        </div>
      `
    },
    {
      title: "3. Conectando nos outros computadores",
      content: `
        <p class="mb-4 text-gray-300">
            <strong>O passo final:</strong> 
            <br/><br/>No outro computador, abra o Explorer e digite o endereço IP do PC host (ex: <code>\\\\192.168.1.10</code>). Você verá o ícone da impressora compartilhada. Clique com o botão direito e selecione **'Conectar'**. O Windows baixará os drivers automaticamente do PC host e a impressora aparecerá pronta para o uso no Word, Excel ou qualquer outro programa em 2026.
        </p>
      `
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/instalar-impressora-wifi",
      title: "Impressora Wi-Fi",
      description: "Como configurar sem precisar de fios."
    },
    {
      href: "/guias/atalhos-produtividade-windows",
      title: "Produtividade",
      description: "Atalhos para imprimir mais rápido."
    },
    {
      href: "/guias/seguranca-digital",
      title: "Segurança de Rede",
      description: "Proteja seu compartilhamento contra invasores."
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