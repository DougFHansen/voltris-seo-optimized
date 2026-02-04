import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Automação de Tarefas no Windows 11 (2026)";
const description = "Pare de fazer trabalho repetitivo! Aprenda a usar o Power Automate, Agendador de Tarefas e Scripts para automatizar seu PC em 2026.";
const keywords = [
  'como automatizar tarefas no windows 11 2026',
  'power automate desktop tutorial para iniciantes',
  'agendador de tarefas windows como usar guia',
  'automatizar backup e limpeza de arquivos tutorial',
  'melhores ferramentas de automação windows 11 2026'
];

export const metadata: Metadata = createGuideMetadata('automacao-tarefas', title, description, keywords);

export default function AutomationGuide() {
  const summaryTable = [
    { label: "Ferramenta Nativa", value: "Agendador de Tarefas" },
    { label: "Ferramenta Visual", value: "Power Automate Desktop" },
    { label: "Uso Comum", value: "Backups, Limpeza de Cache, Abrir Apps" },
    { label: "Dificuldade", value: "Médio" }
  ];

  const contentSections = [
    {
      title: "O que é automação e por que você precisa?",
      content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Em 2026, seu tempo é o recurso mais valioso. Se todos os dias você abre os mesmos 5 sites, faz backup manual de uma pasta ou limpa os arquivos temporários, você está perdendo produtividade. Automatizar significa ensinar o Windows a fazer essas tarefas chatas por você, de forma invisível ou com um único clique.
        </p>
      `
    },
    {
      title: "1. Power Automate Desktop (Sem Código)",
      content: `
        <p class="mb-4 text-gray-300">A ferramenta mais moderna da Microsoft em 2026:</p>
        <p class="text-sm text-gray-300">
            O <strong>Power Automate</strong> já vem instalado no Windows 11. Com ele, você pode "gravar" ações do mouse e teclado. Por exemplo: você pode criar um fluxo que todo dia às 18h baixa os anexos do seu e-mail e os salva em uma pasta do OneDrive organizada por data. Tudo isso sem precisar escrever uma única linha de código, apenas arrastando blocos lógicos.
        </p>
      `
    },
    {
      title: "2. Agendador de Tarefas (Task Scheduler)",
      content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Automacão em Nível de Sistema:</h4>
            <p class="text-sm text-gray-300">
                Se você tem um script de limpeza (arquivo .bat ou .ps1), o Agendador de Tarefas é o local ideal. <br/><br/>
                - <strong>Triggers:</strong> Você pode disparar uma ação ao ligar o PC, ao fazer login ou em um horário fixo. <br/>
                - <strong>Condições:</strong> Você pode configurar para a tarefa rodar apenas se o notebook estiver ligado na tomada, economizando bateria.
            </p>
        </div>
      `
    },
    {
      title: "3. Automação via Prompt de Comando",
      content: `
        <p class="mb-4 text-gray-300">
            <strong>Produtividade com Terminais:</strong> 
            <br/><br/>Para usuários avançados, o uso de scripts simples de PowerShell pode economizar horas. Em 2026, você pode usar a IA para gerar esses scripts. Exemplo: "Crie um script que mova todos os arquivos .jpg da pasta Downloads para a pasta Fotos uma vez por semana". Salve isso como um arquivo e coloque no Agendador de Tarefas. Seu PC ficará organizado para sempre de forma automática.
        </p>
      `
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/atalhos-produtividade-windows",
      title: "Atalhos Windows",
      description: "Agilidade imediata antes da automação."
    },
    {
      href: "/guias/limpeza-disco-profunda-arquivos-temporarios",
      title: "Limpeza Pro",
      description: "O que automatizar para manter o PC rápido."
    },
    {
      href: "/guias/gestao-servicos",
      title: "Gestão de Serviços",
      description: "Entenda o que roda em background."
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