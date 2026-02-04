import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Como Formatar o Windows 11: Guia Passo a Passo (2026)";
const description = "Seu PC está lento ou com vírus? Aprenda como formatar o Windows 11 do zero e fazer uma instalação limpa para máxima performance em 2026.";
const keywords = [
  'como formatar windows 11 passo a passo 2026',
  'formatação limpa windows 11 tutorial completo',
  'instalar windows 11 pelo pendrive bootavel guia',
  'formatar pc e apagar tudo windows 11 em 2026',
  'tutorial de instalacao windows 11 uefi gpt 2026'
];

export const metadata: Metadata = createGuideMetadata('formatacao-windows', title, description, keywords);

export default function FormatWindowsGuide() {
  const summaryTable = [
    { label: "Check Antes", value: "Backup de Arquivos e Chave de Ativação" },
    { label: "Ferramenta", value: "Pendrive de 8GB+ com Boot do Windows 11" },
    { label: "Duração", value: "30 a 60 minutos" },
    { label: "Dificuldade", value: "Intermediário" }
  ];

  const contentSections = [
    {
      title: "O "Reset" Total do seu Computador em 2026",
      content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Formatar o Windows é a solução definitiva quando nenhuma otimização funciona mais. Seja por acumulo de erros no registro, vírus teimosos ou apenas o desejo de ter aquele sentimento de "PC novo", uma instalação limpa é o melhor presente que você pode dar ao seu hardware em 2026. Neste guia, vamos focar no método de **Instalação Limpa via USB**, que é superior ao 'Restaurar o PC' das configurações.
        </p>
      `
    },
    {
      title: "1. O Backup dos Bravos",
      content: `
        <p class="mb-4 text-gray-300">Formatar apaga TUDO. Não esqueça do básico:</p>
        <ul class="list-disc list-inside text-gray-300 space-y-3">
            <li><strong>Arquivos Pessoais:</strong> Fotos, Documentos e a pasta de Downloads para um HD Externo ou Nuvem.</li>
            <li><strong>Drivers de Rede:</strong> Em 2026, o Windows 11 reconhece quase tudo, mas baixe o driver de Wi-Fi ou Ethernet por precaução.</li>
            <li><strong>Chave de Ativação:</strong> Vinculada à sua conta Microsoft? Garanta que você sabe o e-mail e a senha!</li>
        </ul >
      `
    },
    {
      title: "2. Iniciando pela Unidade USB",
      content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Entrando na Instalação:</h4>
            <p class="text-sm text-gray-300">
                1. Espete o seu pendrive bootável. <br/>
                2. Ligue o PC apertando a tecla de **Boot Menu** (geralmente F8, F11, F12 ou F2) e escolha o seu pendrive (opção UEFI). <br/>
                3. Na tela de instalação, clique em 'Instalar Agora'. <br/>
                4. Quando perguntado o tipo de instalação, escolha sempre: **'Personalizada: instalar apenas o Windows (avançado)'**.
            </p>
        </div>
      `
    },
    {
      title: "3. Partições: Onde o Windows vai morar",
      content: `
        <p class="mb-4 text-gray-300">
            <strong>Limpando o Terreno:</strong> 
            <br/><br/>Você verá uma lista de unidades. Selecione cada partição do seu disco principal e clique em **Excluir** até que sobre apenas um item chamado 'Espaço não alocado'. Selecione esse espaço e clique em 'Avançar'. <br/><br/>
            O Windows fará o resto: criará as partições de sistema necessárias, formatará em NTFS e copiará os arquivos. Em 2026, com um SSD NVMe, este processo leva menos de 10 minutos. O PC reiniciará várias vezes; não remova o pendrive até ver a tela de escolhas de região da Cortana.
        </p>
      `
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/criar-pendrive-bootavel",
      title: "Criar Pendrive",
      description: "O primeiro passo: preparar o USB."
    },
    {
      href: "/guias/pos-instalacao-windows-11",
      title: "Guia Pós-Instalação",
      description: "O que configurar assim que o Windows abrir."
    },
    {
      href: "/guias/backup-dados",
      title: "Guia de Backup",
      description: "Aprenda a regra 3-2-1 antes de formatar."
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
