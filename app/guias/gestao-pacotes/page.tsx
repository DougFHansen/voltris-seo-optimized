import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Gestão de Pacotes no Windows: Como usar o Winget (Passo a Passo)";
const description = "Cansado de entrar em 10 sites para baixar programas? Aprenda a usar o Winget, o gerenciador de pacotes oficial da Microsoft, para instalar e atualizar tudo via terminal.";
const keywords = [
  'como usar winget windows 11 tutorial 2026',
  'instalar programas pelo terminal windows winget',
  'atualizar todos os apps de uma vez winget upgrade',
  'gerenciador de pacotes windows como funciona',
  'winget vs chocolatey 2026 comparação'
];

export const metadata: Metadata = createGuideMetadata('gestao-pacotes', title, description, keywords);

export default function PackageManagementGuide() {
  const summaryTable = [
    { label: "Ferramenta", value: "Winget (Nativo do Windows)" },
    { label: "Comando de instalação", value: "winget install [nome]" },
    { label: "Atualizar Tudo", value: "winget upgrade --all" },
    { label: "Dificuldade", value: "Fácil" }
  ];

  const contentSections = [
    {
      title: "O que é um Gerenciador de Pacotes?",
      content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Em vez de abrir o Chrome, pesquisar "NVIDIA drivers", entrar no site, baixar o .exe e clicar 10 vezes em "Avançar", você pode simplesmente digitar um comando. O **Winget** é a loja da Microsoft em forma de linha de comando. Ele é seguro, rápido e automatiza a instalação de mais de 4.000 programas populares.
        </p>
      `
    },
    {
      title: "1. Comandos Básicos do Winget",
      content: `
        <p class="mb-4 text-gray-300">Abra o PowerShell ou o CMD e teste estes comandos:</p>
        <ul class="list-disc list-inside text-gray-300 space-y-3">
            <li><code>winget search [nome]</code>: Procura se o programa está disponível (ex: <code>winget search discord</code>).</li>
            <li><code>winget install [nome]</code>: Baixa e instala o programa silenciosamente.</li>
            <li><code>winget list</code>: Mostra todos os programas instalados no seu PC.</li>
            <li><code>winget uninstall [nome]</code>: Remove o programa de forma limpa.</li>
        </ul>
      `
    },
    {
      title: "2. O Comando Mágico: Atualizar Tudo",
      content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">A rotina perfeita:</h4>
            <p class="text-sm text-gray-300">
                Uma vez por semana, abra o terminal e digite: <br/>
                <code>winget upgrade --all</code> <br/><br/>
                O Windows vai verificar todos os seus programas (Chrome, Spotify, Steam, Drivers) e atualizar todos eles automaticamente para a versão mais segura, sem que você precise abrir um por um.
            </p>
        </div>
      `
    },
    {
      title: "3. Winget.run: Interface Web",
      content: `
        <p class="mb-4 text-gray-300">
            Se você não gosta de decorar nomes, acesse o site <strong>winget.run</strong>. Lá você pode selecionar todos os programas que deseja (como se estivesse montando um carrinho de compras) e o site vai gerar um único comando para você colar no seu terminal. É a forma mais rápida de configurar um PC recém-formatado.
        </p>
      `
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/pos-instalacao-windows-11",
      title: "Pós-Instalação",
      description: "Use o winget para montar seu setup novo."
    },
    {
      href: "/guias/remover-bloatware-windows-powershell",
      title: "Remover Bloatware",
      description: "Winget também ajuda a limpar o sistema."
    },
    {
      href: "/guias/automacao-tarefas",
      title: "Automações",
      description: "Agende atualizações de apps via winget."
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