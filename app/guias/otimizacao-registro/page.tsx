import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Guia Completo de Otimização do Registro do Windows";
const description = "Limpe e otimize o registro do Windows para melhor performance. Técnicas seguras de manutenção preventiva do sistema.";
const keywords = ["otimização registro","windows registry","ccleaner","registro limpo","performance sistema"];

export const metadata: Metadata = createGuideMetadata(title, description, keywords);

export default function OtimizacaoregistroGuide() {
  const contentSections = [
    {
      title: "Introdução e Conceitos Fundamentais",
      content: `
        <p class="mb-4">A otimização do registro do Windows é uma técnica essencial para melhorar o desempenho do sistema, resolver problemas de estabilidade e eliminar entradas inválidas que acumulam com o uso prolongado do sistema operacional.</p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div class="bg-[#171313] p-4 rounded-lg border border-[#31A8FF]/30">
            <h3 class="text-white font-semibold mb-2">Benefícios Principais</h3>
            <ul class="text-gray-300 text-sm space-y-1">
              <li>✓ Melhoria de até 30% na velocidade de inicialização</li>
              <li>✓ Redução de erros de aplicativos e sistema</li>
              <li>✓ Liberação de espaço em disco</li>
              <li>✓ Maior estabilidade do sistema</li>
            </ul>
          </div>
          <div class="bg-[#171313] p-4 rounded-lg border border-[#FF4B6B]/30">
            <h3 class="text-white font-semibold mb-2">Requisitos Mínimos</h3>
            <ul class="text-gray-300 text-sm space-y-1">
              <li>🔧 Conhecimento intermediário de Windows</li>
              <li>💻 Windows 10/11 (administrador)</li>
              <li>⏱️ Tempo estimado: 45-60 minutos</li>
              <li>💾 Backup do sistema obrigatório</li>
            </ul>
          </div>
        </div>
        
        <div class="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 my-6">
          <h3 class="text-yellow-400 font-semibold mb-2">⚠️ Aviso Importante</h3>
          <p class="text-gray-300 text-sm">Sempre crie um ponto de restauração do sistema antes de modificar o registro. Erros no registro podem causar instabilidade do sistema.</p>
        </div>
      `,
      subsections: [
        {
          subtitle: "Quando Aplicar Esta Técnica",
          content: `
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
              <li>Computador com lentidão significativa na inicialização</li>
              <li>Erros frequentes de aplicativos "não encontrado"</li>
              <li>Problemas após desinstalação de programas</li>
              <li>Preparação para reinstalação do Windows</li>
              <li>Manutenção preventiva a cada 6 meses</li>
            </ul>
          `
        }
      ]
    },
    {
      title: "Configuração Passo a Passo",
      content: `
        <p class="mb-4">Siga este procedimento detalhado para otimizar o registro do Windows com segurança máxima.</p>
      `,
      subsections: [
        {
          subtitle: "Preparação Inicial",
          content: `
            <ol class="space-y-3 text-gray-300 list-decimal list-inside ml-4">
              <li>
                <strong>Criar Ponto de Restauração:</strong>
                <ul class="ml-6 mt-1 space-y-1 text-sm">
                  <li>Pressione Win + R, digite "rstrui.exe"</li>
                  <li>Selecione "Criar um ponto de restauração"</li>
                  <li>Dê nome descritivo como "Antes_Otimização_Registro"</li>
                </ul>
              </li>
              <li>
                <strong>Fechar Programas:</strong>
                <ul class="ml-6 mt-1 space-y-1 text-sm">
                  <li>Finalize todos os navegadores web</li>
                  <li>Feche aplicativos de produtividade</li>
                  <li>Encerre programas em execução na bandeja do sistema</li>
                </ul>
              </li>
              <li>
                <strong>Verificar Espaço em Disco:</strong>
                <ul class="ml-6 mt-1 space-y-1 text-sm">
                  <li>Garanta pelo menos 5GB livres na unidade C:</li>
                  <li>Use Disk Cleanup para liberar espaço temporário</li>
                </ul>
              </li>
            </ol>
          `
        },
        {
          subtitle: "Otimização com Regedit",
          content: `
            <div class="space-y-4">
              <div class="bg-[#171313] p-4 rounded-lg border border-[#31A8FF]/30">
                <h4 class="text-white font-semibold mb-2">1. Limpeza de Chaves Orfãs</h4>
                <ul class="text-gray-300 text-sm space-y-1 ml-4">
                  <li>Abra Regedit (Win + R → regedit)</li>
                  <li>Navegue para HKEY_LOCAL_MACHINE\SOFTWARE</li>
                  <li>Procure por pastas de programas desinstalados</li>
                  <li>Exclua chaves de programas não existentes</li>
                </ul>
              </div>
              
              <div class="bg-[#171313] p-4 rounded-lg border border-[#FF4B6B]/30">
                <h4 class="text-white font-semibold mb-2">2. Otimização de Valores</h4>
                <ul class="text-gray-300 text-sm space-y-1 ml-4">
                  <li>HKEY_CURRENT_USER\Control Panel\Desktop\MenuShowDelay = 400</li>
                  <li>HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management\LargeSystemCache = 1</li>
                  <li>HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\Advanced\DelayedApps = 0</li>
                </ul>
              </div>
            </div>
          `
        }
      ]
    },
    {
      title: "Ferramentas e Recursos Recomendados",
      content: `
        <p class="mb-4">Estas ferramentas especializadas oferecem análise profunda e limpeza segura do registro do Windows.</p>
      `,
      subsections: [
        {
          subtitle: "Software Especializado",
          content: `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-[#171313] p-4 rounded border border-[#31A8FF]/20">
                <h4 class="text-white font-semibold mb-3">Ferramentas Gratuitas</h4>
                <ul class="text-gray-300 text-sm space-y-2">
                  <li><strong>CCleaner Free:</strong> Análise e limpeza básica do registro</li>
                  <li><strong>Glary Utilities:</strong> Suite completa de otimização</li>
                  <li><strong>Wise Registry Cleaner:</strong> Foco específico em limpeza de registro</li>
                  <li><strong>Registry Finder:</strong> Pesquisa avançada no registro</li>
                </ul>
              </div>
              <div class="bg-[#171313] p-4 rounded border border-[#FF4B6B]/20">
                <h4 class="text-white font-semibold mb-3">Soluções Pagas</h4>
                <ul class="text-gray-300 text-sm space-y-2">
                  <li><strong>CCleaner Professional:</strong> Backup automático e agendamento</li>
                  <li><strong>Reg Organizer:</strong> Edição avançada e monitoramento</li>
                  <li><strong>Registry Mechanic:</strong> Reparação inteligente de entradas</li>
                </ul>
              </div>
            </div>
          `
        },
        {
          subtitle: "Práticas de Segurança Avançadas",
          content: `
            <div class="space-y-3">
              <div class="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                <h4 class="text-red-400 font-semibold mb-2">⚠️ Nunca Exclua Estas Chaves:</h4>
                <ul class="text-gray-300 text-sm ml-4">
                  <li>HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows</li>
                  <li>HKEY_CURRENT_USER\Software\Microsoft</li>
                  <li>Chaves relacionadas a drivers de hardware</li>
                </ul>
              </div>
              
              <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
                <li>Faça backup completo do registro antes de qualquer modificação</li>
                <li>Use modo de segurança para operações críticas</li>
                <li>Mantenha cópias de segurança em locais diferentes</li>
                <li>Teste o sistema após cada modificação importante</li>
              </ul>
            </div>
          `
        }
      ]
    },
    {
      title: "Troubleshooting e Solução de Problemas",
      content: `
        <p class="mb-4">Soluções específicas para erros comuns durante a otimização do registro do Windows.</p>
      `,
      subsections: [
        {
          subtitle: "Erros Frequentes e Soluções",
          content: `
            <div class="space-y-4">
              <div class="bg-[#171313] p-4 rounded-lg border border-red-500/30">
                <h4 class="text-red-400 font-semibold mb-2">Erro: "Acesso Negado ao Registro"</h4>
                <p class="text-gray-300 text-sm mb-3">Solução: Execute o Regedit como administrador</p>
                <ul class="text-gray-300 text-xs space-y-1 ml-4">
                  <li>Pressione Ctrl + Shift + Esc para abrir Gerenciador de Tarefas</li>
                  <li>Clique com botão direito em Regedit → Executar como administrador</li>
                  <li>Ou use comando: runas /user:Administrator regedit</li>
                </ul>
              </div>
              
              <div class="bg-[#171313] p-4 rounded-lg border border-yellow-500/30">
                <h4 class="text-yellow-400 font-semibold mb-2">Problema: Sistema Fica Lento Após Otimização</h4>
                <p class="text-gray-300 text-sm mb-3">Solução: Restaurar ponto de restauração</p>
                <ul class="text-gray-300 text-xs space-y-1 ml-4">
                  <li>Pressione Win + R, digite "rstrui"</li>
                  <li>Selecione o ponto de restauração criado antes da otimização</li>
                  <li>Siga o assistente para restauração completa</li>
                </ul>
              </div>
              
              <div class="bg-[#171313] p-4 rounded-lg border border-blue-500/30">
                <h4 class="text-blue-400 font-semibold mb-2">Erro: "Falha ao Iniciar Aplicativo"</h4>
                <p class="text-gray-300 text-sm mb-3">Solução: Recriar entradas do registro perdidas</p>
                <ul class="text-gray-300 text-xs space-y-1 ml-4">
                  <li>Reinstale o aplicativo problemático</li>
                  <li>Use sfc /scannow no Prompt de Comando</li>
                  <li>Execute DISM /Online /Cleanup-Image /RestoreHealth</li>
                </ul>
              </div>
            </div>
          `
        },
        {
          subtitle: "Prevenção de Problemas Futuros",
          content: `
            <div class="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
              <h4 class="text-green-400 font-semibold mb-3">📅 Plano de Manutenção Recomendado</h4>
              <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
                <li><strong>Mensal:</strong> Verificação rápida de chaves órfãs</li>
                <li><strong>Trimestral:</strong> Otimização completa com backup</li>
                <li><strong>Semestral:</strong> Análise profunda com ferramentas especializadas</li>
                <li><strong>Anual:</strong> Revisão completa e documentação do sistema</li>
              </ul>
            </div>
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
      estimatedTime="50 minutos"
      difficultyLevel="Intermediário"
      contentSections={contentSections}
      relatedGuides={relatedGuides}
    />
  );
}