import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Como Instalar o Windows 11: Guia Completo e Requisitos de TPM 2.0";
const description = "Quer migrar para o Windows 11? Aprenda a verificar a compatibilidade, ativar o TPM 2.0 na BIOS e como fazer uma instalação limpa para máxima performance.";
const keywords = [
  'instalação windows 11 passo a passo',
  'como ativar tpm 2.0 na bios',
  'requisitos minimos windows 11 2026',
  'instalar windows 11 pc antigo sem tpm',
  'windows 11 media creation tool'
];

export const metadata: Metadata = createGuideMetadata('instalacao-windows-11', title, description, keywords);

export default function Windows11InstallGuide() {
  const summaryTable = [
    { label: "Requisito Principal", value: "TPM 2.0 / Secure Boot" },
    { label: "Espaço em Disco", value: "64GB Mínimo" },
    { label: "Método", value: "Pendrive USB" },
    { label: "Dificuldade", value: "Média" }
  ];

  const contentSections = [
    {
      title: "O Windows 11 é para você?",
      content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O Windows 11 trouxe melhorias massivas no gerenciamento de cores (Auto HDR), suporte a DirectStorage e uma interface muito mais moderna. Porém, ele é mais exigente que o Windows 10. 
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed">
          Nesta guia, vamos garantir que você instale a versão oficial para receber atualizações de segurança e performance.
        </p>
      `
    },
    {
      title: "Verificando a Compatibilidade (TPM 2.0)",
      content: `
        <p class="mb-4 text-gray-300">Este é o maior obstáculo. O Windows 11 exige este chip de segurança.</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Aperte <code>Win + R</code> e digite <strong>tpm.msc</strong>.</li>
            <li>Se aparecer "A especificação do TPM 2.0 está pronta", você pode instalar.</li>
            <li>Se não aparecer, você precisa ir na <strong>BIOS</strong> da sua placa-mãe e ativar o <strong>Intel PTT</strong> ou <strong>AMD fTPM</strong>.</li>
        </ol>
      `
    },
    {
      title: "Criando a Mídia de Instalação",
      content: `
        <p class="mb-4 text-gray-300">
            Não use ISOs de sites piratas ou "Windows Lite" modificados. Baixe a ferramenta oficial:
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-2">
            <li>Acesse o site "Baixar o Windows 11" da Microsoft.</li>
            <li>Baixe a <strong>Mídia de Instalação do Windows 11</strong>.</li>
            <li>Use um pendrive de 8GB vazio. A ferramenta fará todo o trabalho de preparar o pendrive bootável.</li>
        </ul>
      `
    },
    {
      title: "Durante a Instalação (Dica de Ouro)",
      content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Instalar sem Conta Microsoft?</h4>
            <p class="text-sm text-gray-300">
                Se o Windows 11 obrigar você a conectar no Wi-Fi e criar uma conta, aperte <strong>Shift + F10</strong> para abrir o terminal e digite:<br/>
                <code class="text-yellow-400">OOBE\\BYPASSNRO</code><br/>
                O PC vai reiniciar e você terá a opção de criar um "Usuário Local" sem e-mail.
            </p>
        </div>
      `
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/formatacao-windows",
      title: "Guia Formatação",
      description: "O processo completo de apagar o disco e instalar."
    },
    {
      href: "/guias/criar-pendrive-bootavel",
      title: "Criar Pendrive",
      description: "Detalhes sobre o Rufus e bypass de TPM."
    },
    {
      href: "/guias/debloating-windows-11",
      title: "Debloating",
      description: "O que fazer logo após instalar o Windows 11."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="45 min"
      difficultyLevel="Intermediário"
      contentSections={contentSections}
      summaryTable={summaryTable}
      relatedGuides={relatedGuides}
    />
  );
}
