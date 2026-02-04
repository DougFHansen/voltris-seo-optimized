import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Como Criar um Pendrive Bootável do Windows 11 (2026)";
const description = "Precisa formatar o PC? Aprenda a criar um pendrive bootável oficial do Windows 11 usando a ferramenta da Microsoft ou o Rufus em 2026.";
const keywords = [
  'como criar pendrive bootavel windows 11 2026',
  'criar midia de instalação windows 11 oficial guia',
  'como usar rufus para criar pendrive bootavel tutorial',
  'pendrive bootavel windows 11 mbr vs gpt explicacao',
  'formatar pc com pendrive bootavel passo a passo 2026'
];

export const metadata: Metadata = createGuideMetadata('criar-pendrive-bootavel', title, description, keywords);

export default function BootableUSBGuide() {
  const summaryTable = [
    { label: "Capacidade Mínima", value: "8GB ou mais" },
    { label: "Formato Necessário", value: "GPT (Para UEFI) / MBR (Para Legacy/Antigos)" },
    { label: "Ferramenta Oficial", value: "Media Creation Tool (Microsoft)" },
    { label: "Dificuldade", value: "Intermediário" }
  ];

  const contentSections = [
    {
      title: "O primeiro passo para a formatação",
      content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Em 2026, você não precisa mais de DVDs para instalar o Windows. Um pendrive bootável é a forma mais rápida e segura de fazer uma instalação limpa do Windows 11. Nele, você coloca todos os arquivos de instalação de forma que o computador consiga ler as instruções de "boot" assim que é ligado, antes mesmo de entrar no HD ou SSD de hoje.
        </p>
      `
    },
    {
      title: "1. Método Oficial: Media Creation Tool",
      content: `
        <p class="mb-4 text-gray-300">Este é o método mais seguro e fácil da Microsoft:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Acesse o site oficial: <strong>microsoft.com/software-download/windows11</strong>.</li>
            <li>Baixe a ferramenta 'Criar mídia de instalação do Windows 11'.</li>
            <li>Conecte seu pendrive (Atenção: todos os arquivos dele serão apagados!).</li>
            <li>Selecione 'Unidade flash USB' e siga as instruções. A ferramenta baixará a ISO mais recente e preparará o pendrive sozinha.</li>
        </ol>
      `
    },
    {
      title: "2. Método Avançado: RUFUS (Pule o TPM 2.0)",
      content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Para PCs Antigos ou Customizados:</h4>
            <p class="text-sm text-gray-300">
                Se o seu PC não tem suporte oficial ao TPM 2.0 ou conta com hardware mais antigo, o **Rufus** é a melhor escolha. <br/><br/>
                Ao criar o pendrive com ele, você pode marcar opções para **remover o requisito de 4GB de RAM, TPM e Secure Boot**. Isso permite que você instale o Windows 11 em quase qualquer computador de 2026, além de permitir criar uma conta local sem precisar de internet ou e-mail da Microsoft.
            </p>
        </div>
      `
    },
    {
      title: "3. Diferença entre MBR e GPT",
      content: `
        <p class="mb-4 text-gray-300">
            <strong>Não erre na hora do boot:</strong> 
            <br/><br/>- <strong>GPT (UEFI):</strong> O padrão para todos os PCs modernos. Se o seu PC foi comprado após 2015, use GPT. <br/>
            - <strong>MBR (BIOS):</strong> Use apenas se estiver instalando em um computador muito antigo que não tem o menu de BIOS azul/moderno. <br/><br/>
            Escolher a opção errada no Rufus fará com que o pendrive não seja reconhecido pelo computador na hora de ligar.
        </p>
      `
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/formatacao-windows",
      title: "Guia de Formatação",
      description: "O que fazer após criar o pendrive."
    },
    {
      href: "/guias/atualizar-bios-seguro",
      title: "Configurar Boot",
      description: "Como fazer o PC ler o pendrive primeiro."
    },
    {
      href: "/guias/pos-instalacao-windows-11",
      title: "Checklist Pós-Instalação",
      description: "Próximos passos após o Windows abrir."
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
      summaryTable={summaryTable}
      relatedGuides={relatedGuides}
    />
  );
}
