import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'automacao-tarefas',
  title: "Automação no Windows 11: Power Automate & Scripts (2026)",
  description: "Cansado de tarefas repetitivas? Aprenda a usar o Power Automate Desktop, Agendador de Tarefas, Batch e PowerShell para criar um PC que trabalha sozinho.",
  category: 'produtividade',
  difficulty: 'Intermediário',
  time: '45 min'
};

const title = "Automação no Windows 11: Power Automate & Scripts (2026)";
const description = "Cansado de tarefas repetitivas? Aprenda a usar o Power Automate Desktop, Agendador de Tarefas, Batch e PowerShell para criar um PC que trabalha sozinho. Guia com exemplos práticos de scripts.";

const keywords = [
  'power automate desktop tutorial portugues 2026',
  'automatizar limpeza de arquivos temporarios windows',
  'agendador de tarefas desligar pc sozinho',
  'script powershell backup automatico',
  'mover arquivos automaticamente pasta downloads',
  'abrir programas ao iniciar windows delay',
  'batch file tutorial basico'
];

export const metadata: Metadata = createGuideMetadata('automacao-tarefas', title, description, keywords);

export default function AutomationGuide() {
  const summaryTable = [
    { label: "Ferramenta Visual", value: "Power Automate Desktop (Grátis)" },
    { label: "Nativa", value: "Agendador de Tarefas (Task Scheduler)" },
    { label: "Scripts", value: "PowerShell (.ps1) / Batch (.bat)" },
    { label: "Complexidade", value: "Baixa (PAD) a Alta (PowerShell)" },
    { label: "Uso Principal", value: "Organizar, Limpar, Backup" },
    { label: "Risco", value: "Cuidado com 'Deletar' em loops" }
  ];

  const contentSections = [
    {
      title: "O Poder da Preguiça Produtiva",
      content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Bill Gates disse: <em>"Sempre scolherei uma pessoa preguiçosa para fazer um trabalho difícil, pois ela encontrará uma maneira fácil de fazê-lo."</em>. A automação no Windows 11 evoluiu. Antigamente, você precisava ser um programador. Hoje, com o <strong>Power Automate</strong>, você cria robôs visuais que clicam, digitam e organizam arquivos por você.
        </p>
        
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20 mb-6">
          <h4 class="text-white font-bold mb-2">🚀 O Que Dá Para Fazer?</h4>
          <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
            <li>Mover todos os arquivos .pdf da pasta Downloads para Documentos/Faturas.</li>
            <li>Renomear 500 fotos de uma vez com data e local.</li>
            <li>Abrir seu setup de trabalho (Chrome, Slack, Spotify) com um clique e posicionar as janelas.</li>
            <li>Esvaziar a Lixeira automaticamente toda sexta-feira.</li>
          </ul>
        </div>
      `
    },
    {
      title: "Ferramenta 1: Power Automate Desktop (O Futuro)",
      content: `
        <p class="mb-4 text-gray-300">
          O <strong>Power Automate</strong> vem pré-instalado no Windows 11. Ele é "Low Code" - você arrasta bloquinhos lógicos.
        </p>
        
        <h4 class="text-white font-bold mb-3 mt-4">Exemplo Prático: Organizador de Downloads</h4>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4 bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
            <li>Abra o Power Automate e clique em "Novo Fluxo". Dê o nome "Organizar Downloads".</li>
            <li>Na esquerda, busque a ação <strong>"Obter arquivos na pasta"</strong>. Arraste para o centro.
                <br/><span class="text-xs text-gray-500 ml-6">Pasta: C:\\Users\\SeuUsuario\\Downloads | Filtro: *.pdf</span></li>
            <li>Busque a ação <strong>"Para cada" (For Each)</strong>. O fluxo vai criar um loop para cada arquivo encontrado.</li>
            <li>Dentro do loop, arraste a ação <strong>"Mover arquivo"</strong>.
                <br/><span class="text-xs text-gray-500 ml-6">Arquivo: %CurrentItem% | Destino: C:\\Users\\SeuUsuario\\Documents\\PDFs</span></li>
            <li>Salve e clique em Executar (Play). Veja a mágica acontecer.</li>
        </ol>
        <p class="mt-3 text-sm text-yellow-400">
            Dica: Você pode criar um atalho na área de trabalho para rodar esse fluxo sem abrir o app.
        </p>
      `
    },
    {
      title: "Ferramenta 2: Agendador de Tarefas (O Clássico)",
      content: `
        <p class="mb-4 text-gray-300">
          Para coisas que devem rodar SOZINHAS (sem você clicar), usamos o <code>taskschd.msc</code>.
        </p>
        <div class="space-y-4">
            <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <h5 class="font-bold text-white mb-2">Desligamento Automático</h5>
                <p class="text-sm text-gray-300">
                    Útil para quem deixa o PC baixando jogos e dorme.
                    <br/>1. Criar Tarefa Básica > Nome: "Dormir PC".
                    <br/>2. Disparador: Diariamente às 02:00.
                    <br/>3. Ação: Iniciar Programa. 
                    <br/>4. Programa: <code>shutdown</code> | Argumentos: <code>/s /f /t 60</code> (Desliga em 60s forçado).
                </p>
            </div>
            <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <h5 class="font-bold text-white mb-2">Reiniciar Driver de Vídeo no Boot</h5>
                <p class="text-sm text-gray-300">
                    Se seu driver buga ao iniciar, crie uma tarefa para rodar um script de restart.
                </p>
            </div>
        </div>
      `
    }
  ];

  const advancedContentSections = [
    {
      title: "Ferramenta 3: Scripts PowerShell (.ps1)",
      content: `
        <h4 class="text-white font-bold mb-3">Poder Ilimitado (com moderação)</h4>
        <p class="mb-4 text-gray-300">
            O PowerShell acessa o coração do Windows. Crie um arquivo de texto, cole o código e salve como <code>limpeza.ps1</code>.
        </p>
        
        <div class="bg-[#1E1E1E] p-4 rounded-lg font-mono text-xs text-green-400 border border-green-900 overflow-x-auto">
            <p># Script de Limpeza de Cache Rápida</p>
            <p>Write-Host "Limpando Temp..."</p>
            <p>Remove-Item -Path "C:\\Windows\\Temp\\*" -Recurse -Force -ErrorAction SilentlyContinue</p>
            <p>Remove-Item -Path "$env:LOCALAPPDATA\\Temp\\*" -Recurse -Force -ErrorAction SilentlyContinue</p>
            <p>Write-Host "Limpando Cache DNS..."</p>
            <p>Clear-DnsClientCache</p>
            <p>Write-Host "Concluído!"</p>
            <p>Start-Sleep -Seconds 3</p>
        </div>
        
        <p class="mt-4 text-gray-300 text-sm">
            Para rodar: Clique com botão direito > "Executar com o PowerShell".
            <br/><strong>Nota:</strong> Você pode precisar abrir o PowerShell como Admin e digitar <code>Set-ExecutionPolicy RemoteSigned</code> uma vez para liberar scripts.
        </p>
      `
    },
    {
      title: "Autohotkey (AHK): A Arma Secreta dos Gamers",
      content: `
        <p class="mb-4 text-gray-300">
            O <a href="https://www.autohotkey.com/" class="text-blue-400 hover:underline">AutoHotkey</a> é uma linguagem de script focada em macros de teclado.
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
            <li>Criar atalhos globais (Ex: F1 abre o Spotify).</li>
            <li>Expandir texto (Ex: Digitar "meumail" vira "nome.sobrenome@empresa.com").</li>
            <li>Reapear teclas (Fazer o CapsLock funcionar como Backspace).</li>
        </ul>
        <div class="bg-[#1E1E1E] p-4 rounded-lg font-mono text-xs text-yellow-400 border border-yellow-900 mt-2">
            <p>; Exemplo AHK: Controle de Volume com Mouse no canto da tela</p>
            <p>#IfMouseIsOverTaskbar</p>
            <p>WheelUp::Volume_Up</p>
            <p>WheelDown::Volume_Down</p>
        </div>
      `
    }
  ];

  const additionalContentSections = [
    {
      title: "Galeria de Ideias",
      content: `
        <h4 class="text-white font-bold mb-3">Copie estas ideias:</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-gray-800/50 p-4 rounded-lg">
                <h5 class="text-pink-400 font-bold mb-2">Modo Foco</h5>
                <p class="text-sm text-gray-300">
                    Crie um fluxo que: Fecha Steam/Discord, Ativa "Não Perturbe" no Windows e abre o Word/VS Code.
                </p>
            </div>
            <div class="bg-gray-800/50 p-4 rounded-lg">
                <h5 class="text-cyan-400 font-bold mb-2">Backup de Saves</h5>
                <p class="text-sm text-gray-300">
                    Script que copia a pasta de Saves do jogo (AppData) e manda para o Google Drive a cada 1 hora.
                </p>
            </div>
        </div>
      `
    }
  ];

  const faqItems = [
    {
      question: "O Power Automate deixa o PC lento?",
      answer: "Não. Ele só consome recursos quando o fluxo está rodando. Em repouso, é insignificante."
    },
    {
      question: "É seguro baixar scripts da internet?",
      answer: "NUNCA execute um arquivo .bat ou .ps1 que você não entende. Eles podem deletar seu Windows. Sempre abra com o Bloco de Notas primeiro para ler o código."
    },
    {
      question: "Qual a diferença entre Power Automate 'Desktop' e 'Cloud'?",
      answer: "O Desktop (PAD) roda na sua máquina e controla seus apps locais. O Cloud (Flow) é para empresas, roda na nuvem da Microsoft e integra Office 365, SharePoint, etc."
    }
  ];

  const externalReferences = [
    { name: "Power Automate Desktop (Loja Microsoft)", url: "https://apps.microsoft.com/store/detail/power-automate/9VF4JDR1L8B0" },
    { name: "AutoHotkey Download", url: "https://www.autohotkey.com/" },
    { name: "Galeria de Scripts PowerShell", url: "https://www.powershellgallery.com/" },
    { name: "Task Scheduler Documentation", url: "https://learn.microsoft.com/en-us/windows/win32/taskschd/task-scheduler-start-page" }
  ];

  const relatedGuides = [
    {
      href: "/guias/backup-dados",
      title: "Estratégia de Backup",
      description: "Automatize seus backups com segurança."
    },
    {
      href: "/guias/debloat-windows-11-otimizacao-powershell",
      title: "Debloat Windows",
      description: "Scripts para limpar o Windows."
    },
    {
      href: "/guias/atalhos-produtividade-windows",
      title: "Atalhos de Teclado",
      description: "Complemente sua automação com atalhos."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="45 min"
      difficultyLevel="Intermediário"
      author="Equipe de Produtividade Voltris"
      lastUpdated="2026-02-06"
      contentSections={contentSections}
      advancedContentSections={advancedContentSections}
      additionalContentSections={additionalContentSections}
      summaryTable={summaryTable}
      faqItems={faqItems}
      externalReferences={externalReferences}
      relatedGuides={relatedGuides}
    />
  );
}