import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Guia Completo de Automação de Tarefas com Scripts";
const description = "Automatize tarefas repetitivas do Windows com PowerShell, Batch e ferramentas de agendamento. Economize horas de trabalho manual.";
const keywords = ["automação","scripts","powershell","batch","agendador tarefas","produtividade"];

export const metadata: Metadata = createGuideMetadata('automacao-tarefas', title, description, keywords);

export default function AutomacaotarefasGuide() {
  const contentSections = [
    {
      title: "Introdução e Conceitos Fundamentais",
      content: `
        <p class="mb-4">A automação de tarefas permite executar repetidamente processos complexos no Windows com mínimo esforço humano, economizando horas de trabalho manual através de scripts e agendadores.</p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div class="bg-[#171313] p-4 rounded-lg border border-[#31A8FF]/30">
            <h3 class="text-white font-semibold mb-2">Benefícios Principais</h3>
            <ul class="text-gray-300 text-sm space-y-1">
              <li>✓ Economia de 5-10 horas semanais</li>
              <li>✓ Eliminação de erros humanos</li>
              <li>✓ Execução 24/7 sem intervenção</li>
              <li>✓ Padronização de processos empresariais</li>
            </ul>
          </div>
          <div class="bg-[#171313] p-4 rounded-lg border border-[#FF4B6B]/30">
            <h3 class="text-white font-semibold mb-2">Requisitos Mínimos</h3>
            <ul class="text-gray-300 text-sm space-y-1">
              <li>🔧 Conhecimento intermediário de Windows</li>
              <li>💻 Windows 10/11 Pro ou Enterprise</li>
              <li>⏱️ Tempo estimado: 60-90 minutos</li>
              <li>📝 Editor de texto (VS Code recomendado)</li>
            </ul>
          </div>
        </div>
        
        <div class="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4 my-6">
          <h3 class="text-purple-400 font-semibold mb-2">💡 Dica Profissional</h3>
          <p class="text-gray-300 text-sm">Comece com tarefas simples como backup automático antes de avançar para automações complexas de rede.</p>
        </div>
      `,
      subsections: [
        {
          subtitle: "Quando Aplicar Esta Técnica",
          content: `
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
              <li>Quando precisar automatizar tarefas repetitivas de backup</li>
              <li>Para agendar atualizações de sistema</li>
              <li>Durante a configuração de ambientes de trabalho</li>
              <li>Ao implementar políticas de segurança</li>
            </ul>
          `
        }
      ]
    },
    {
      title: "Configuração Passo a Passo",
      content: `
        <p class="mb-4">Siga estas etapas para configurar a automação de tarefas no Windows.</p>
      `,
      subsections: [
        {
          subtitle: "Configuração do Agendador de Tarefas",
          content: `
            <ol class="space-y-2 text-gray-300 list-decimal list-inside ml-4">
              <li>Acesse o Agendador de Tarefas (taskschd.msc)</li>
              <li>Clique em "Ações" > "Criar Tarefa Básica"</li>
              <li>Defina o nome e descrição da tarefa</li>
              <li>Escolha a frequência de execução (diária, semanal, etc.)</li>
              <li>Selecione o programa ou script a ser executado</li>
            </ol>
          `
        },
        {
          subtitle: "Teste e Validação",
          content: `
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
              <li>Execute a tarefa manualmente para testar</li>
              <li>Verifique logs de execução</li>
              <li>Confirme que a tarefa executa corretamente</li>
              <li>Ajuste permissões se necessário</li>
              <li>Monitore execuções futuras</li>
            </ul>
          `
        }
      ]
    },
    {
      title: "Ferramentas e Recursos Recomendados",
      content: `
        <p class="mb-4">Ferramentas essenciais para automação de tarefas no Windows.</p>
      `,
      subsections: [
        {
          subtitle: "Software Especializado",
          content: `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-[#171313] p-3 rounded border border-[#31A8FF]/20">
                <h4 class="text-white font-semibold mb-2">Ferramentas Gratuitas</h4>
                <ul class="text-gray-300 text-xs space-y-1">
                  <li>Agendador de Tarefas (Task Scheduler) - nativo do Windows</li>
                  <li>PowerShell - para scripts avançados de automação</li>
                  <li>Chocolatey - para automação de instalação de pacotes</li>
                </ul>
              </div>
              <div class="bg-[#171313] p-3 rounded border border-[#FF4B6B]/20">
                <h4 class="text-white font-semibold mb-2">Soluções Pagas</h4>
                <ul class="text-gray-300 text-xs space-y-1">
                  <li>Hassio/Automation - para automação corporativa</li>
                  <li>Solucionadores de terceiros para tarefas específicas</li>
                  <li>Ferramentas de monitoramento para automações críticas</li>
                </ul>
              </div>
            </div>
          `
        },
        {
          subtitle: "Práticas de Segurança",
          content: `
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
              <li>Execute tarefas agendadas com privilégios mínimos necessários</li>
              <li>Revise regularmente as tarefas para garantir que ainda são necessárias</li>
              <li>Monitore logs de execução para detectar anomalias</li>
              <li>Evite automações que manipulem dados sensíveis sem criptografia</li>
            </ul>
          `
        }
      ]
    },
    {
      title: "Troubleshooting e Solução de Problemas",
      content: `
        <p class="mb-4">Soluções para problemas comuns com tarefas agendadas no Windows.</p>
      `,
      subsections: [
        {
          subtitle: "Erros Frequentes e Soluções",
          content: `
            <div class="bg-[#171313] p-4 rounded-lg border border-[#8B31FF]/30">
              <h4 class="text-white font-semibold mb-2">Problema: Tarefa não executa na hora marcada</h4>
              <p class="text-gray-300 text-sm mb-2">Solução: Verifique as configurações de segurança e permissões da tarefa</p>
              <ul class="text-gray-300 text-xs space-y-1 ml-4">
                <li>Garanta que a opção "Executar com privilégios mais altos" esteja selecionada se necessário</li>
                <li>Verifique se a conta de usuário tem permissão para executar o programa</li>
                <li>Confirme que o caminho do programa esteja correto</li>
              </ul>
            </div>
            <div class="bg-[#171313] p-4 rounded-lg border border-[#8B31FF]/30 mt-4">
              <h4 class="text-white font-semibold mb-2">Problema: Script falha quando o usuário não está logado</h4>
              <p class="text-gray-300 text-sm mb-2">Solução: Configure a tarefa para executar independentemente do login do usuário</p>
              <ul class="text-gray-300 text-xs space-y-1 ml-4">
                <li>Marque a opção "Executar independentemente do login do usuário"</li>
                <li>Configure as credenciais necessárias na criação da tarefa</li>
                <li>Verifique se o script não depende de recursos da sessão interativa</li>
              </ul>
            </div>
          `
        },
        {
          subtitle: "Prevenção de Problemas Futuros",
          content: `
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
              <li>Teste tarefas em ambiente de desenvolvimento antes de implantar</li>
              <li>Monitore logs regularmente para detectar falhas precocemente</li>
              <li>Planeje atualizações e alterações de forma a não impactar automações</li>
              <li>Documente todas as tarefas agendadas com propósito e contato responsável</li>
            </ul>
          `
        }
      ]
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/seguranca-digital",
      title: "Segurança Digital Completa",
      description: "Proteção abrangente contra ameaças cibernéticas"
    },
    {
      href: "/guias/otimizacao-performance",
      title: "Otimização de Performance",
      description: "Maximize o desempenho do seu sistema"
    },
    {
      href: "/guias/manutencao-preventiva",
      title: "Manutenção Preventiva",
      description: "Estratégias completas de cuidados com o sistema"
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="70 minutos"
      difficultyLevel="Intermediário"
      contentSections={contentSections}
      relatedGuides={relatedGuides}
    />
  );
}