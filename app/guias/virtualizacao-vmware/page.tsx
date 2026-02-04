import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Virtualização no PC: Como ativar e usar VMWare (2026)";
const description = "Quer rodar outros sistemas dentro do seu Windows? Aprenda como ativar a virtualização na BIOS e configurar o VMWare Workstation em 2026.";
const keywords = [
  'como ativar virtualização na bios 2026 tutorial',
  'vmware workstation player tutorial como usar 2026',
  'habilitar vt-x intel e amd-v na bios guia',
  'criar maquina virtual windows 11 tutorial 2026',
  'virtualização desativada como resolver tutorial guia 2026'
];

export const metadata: Metadata = createGuideMetadata('virtualizacao-vmware', title, description, keywords);

export default function VirtualizationGuide() {
  const summaryTable = [
    { label: "Tecnologia Intel", value: "VT-x / Intel Virtualization Technology" },
    { label: "Tecnologia AMD", value: "AMD-V / SVM Mode" },
    { label: "Software Grátis", value: "VMWare Workstation Player" },
    { label: "Dificuldade", value: "Médio" }
  ];

  const contentSections = [
    {
      title: "O que é a Virtualização?",
      content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          A **Virtualização** permite que um único computador físico funcione como se fossem vários. Em 2026, isso é usado para testar novos aplicativos sem sujar o sistema principal, rodar Linux dentro do Windows ou até para emuladores de Android. No entanto, para que softwares como o VMWare tenham performance de verdade, você primeiro precisa "dar permissão" para o processador usar esse recurso diretamente na BIOS.
        </p>
      `
    },
    {
      title: "1. Ativando na BIOS (VT-x e AMD-V)",
      content: `
        <p class="mb-4 text-gray-300">Sem este passo, nenhuma máquina virtual funcionará corretamente:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Reinicie o PC e entre na BIOS (DEL ou F2).</li>
            <li><strong>Se for Intel:</strong> Procure por 'Intel Virtualization Technology' ou 'VT-x' e mude para <strong>Enabled</strong>.</li>
            <li><strong>Se for AMD:</strong> Procure por 'SVM Mode' ou 'Secure Virtual Machine' e mude para <strong>Enabled</strong>.</li>
            <li>Geralmente essas opções ficam dentro do menu 'Advanced' ou 'CPU Configuration'.</li>
        </ol>
      `
    },
    {
      title: "2. Configurando o VMWare em 2026",
      content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Criando sua primeira VM:</h4>
            <p class="text-sm text-gray-300">
                1. Baixe o <strong>VMWare Workstation Player</strong> (versão gratuita para uso pessoal). <br/>
                2. Clique em 'Create a New Virtual Machine'. <br/>
                3. Selecione a ISO do sistema que você quer instalar (ex: Windows 11 ou Ubuntu). <br/>
                4. <strong>Regra de Ouro:</strong> Nunca dedique mais de 50% da sua RAM e dos núcleos do seu processador para a máquina virtual. Se você tem 16GB de RAM, dê no máximo 8GB para a VM para evitar que o seu Windows principal trave.
            </p>
        </div>
      `
    },
    {
      title: "3. Virtualização vs Hyper-V",
      content: `
        <p class="mb-4 text-gray-300">
            <strong>Conflito Comum:</strong> Em 2026, o Windows 11 tem o seu próprio sistema de virtualização chamado **Hyper-V**. 
            <br/><br/>Se você tentar rodar o VMWare e ele der erro de performance ou travar, verifique se o 'Hyper-V' e o 'Windows Sandbox' estão ativados nos 'Recursos do Windows'. Muitas vezes é necessário <strong>desativar o Hyper-V</strong> para que o VMWare tenha acesso total e direto ao hardware, garantindo muito mais fluidez.
        </p>
      `
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/windows-sandbox-testar-virus",
      title: "Windows Sandbox",
      description: "A alternativa nativa da Microsoft."
    },
    {
      href: "/guias/hyper-v-desempenho-jogos",
      title: "Hyper-V e Jogos",
      description: "Como a virtualização afeta o FPS."
    },
    {
      href: "/guias/jogos-android-no-pc-melhores-emuladores",
      title: "Emuladores Android",
      description: "Use a virtualização para jogar mobile no PC."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="25 min"
      difficultyLevel="Médio"
      contentSections={contentSections}
      summaryTable={summaryTable}
      relatedGuides={relatedGuides}
    />
  );
}