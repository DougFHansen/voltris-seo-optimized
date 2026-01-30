import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Guia Completo de Gestão de Serviços do Sistema";
const description = "Configure, otimize e monitore serviços do Windows para melhor performance e segurança. Desativação inteligente de serviços desnecessários.";
const keywords = ["gestão serviços","services.msc","otimização windows","desempenho","segurança sistema"];

export const metadata: Metadata = createGuideMetadata('gestao-servicos', title, description, keywords);

export default function GestaoservicosGuide() {
  const contentSections = [
    {
      title: "Introdução e Conceitos Fundamentais",
      content: `
        <p class="mb-4">A gestão de serviços do Windows envolve monitorar, configurar e otimizar os processos em segundo plano que mantêm o sistema operacional e aplicativos funcionando corretamente, desde atualizações automáticas até impressão de documentos.</p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div class="bg-[#171313] p-4 rounded-lg border border-[#31A8FF]/30">
            <h3 class="text-white font-semibold mb-2">Benefícios Principais</h3>
            <ul class="text-gray-300 text-sm space-y-1">
              <li>✓ Diagnóstico rápido de problemas do sistema</li>
              <li>✓ Otimização do uso de memória RAM</li>
              <li>✓ Controle granular de inicialização do sistema</li>
              <li>✓ Prevenção de falhas de segurança</li>
            </ul>
          </div>
          <div class="bg-[#171313] p-4 rounded-lg border border-[#FF4B6B]/30">
            <h3 class="text-white font-semibold mb-2">Requisitos Mínimos</h3>
            <ul class="text-gray-300 text-sm space-y-1">
              <li>🔧 Services.msc ou PowerShell</li>
              <li>💻 Windows 10/11 Pro ou Enterprise</li>
              <li>⏱️ Tempo estimado: 50-80 minutos</li>
              <li>👤 Permissões de administrador necessárias</li>
            </ul>
          </div>
        </div>
        
        <div class="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 my-6">
          <h3 class="text-blue-400 font-semibold mb-2">ℹ️ Importante</h3>
          <p class="text-gray-300 text-sm">Nunca desative serviços críticos do sistema como Windows Update ou Event Log.</p>
        </div>
      `,
      subsections: [
        {
          subtitle: "Quando Aplicar Esta Técnica",
          content: `
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
              <li>Quando for necessário controlar serviços do sistema automaticamente</li>
              <li>Para otimizar o desempenho do sistema desativando serviços desnecessários</li>
              <li>Durante a configuração de servidores ou estações de trabalho especializadas</li>
              <li>Ao implementar políticas de segurança que requerem controle de serviços</li>
            </ul>
          `
        }
      ]
    },
    {
      title: "Configuração Passo a Passo",
      content: `
        <p class="mb-4">Siga estas etapas para gerenciar serviços do Windows.</p>
      `,
      subsections: [
        {
          subtitle: "Análise de Serviços Existentes",
          content: `
            <ol class="space-y-2 text-gray-300 list-decimal list-inside ml-4">
              <li>Abra o Gerenciador de Serviços (services.msc)</li>
              <li>Identifique serviços em execução e seus estados atuais</li>
              <li>Pesquise a função de cada serviço desconhecido</li>
              <li>Crie uma lista de serviços essenciais para seu uso</li>
              <li>Documente serviços que podem ser desativados com segurança</li>
            </ol>
          `
        },
        {
          subtitle: "Configuração e Controle de Serviços",
          content: `
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
              <li>Modifique tipos de inicialização (Automático, Manual, Desativado)</li>
              <li>Configure dependências entre serviços quando necessário</li>
              <li>Use PowerShell para automação de tarefas de gerenciamento</li>
              <li>Monitore logs de eventos para verificar funcionamento adequado</li>
              <li>Teste alterações em ambiente controlado antes de aplicar em produção</li>
            </ul>
          `
        }
      ]
    },
    {
      title: "Ferramentas e Recursos Recomendados",
      content: `
        <p class="mb-4">Ferramentas especializadas para gerenciamento de serviços no Windows.</p>
      `,
      subsections: [
        {
          subtitle: "Software Especializado",
          content: `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-[#171313] p-3 rounded border border-[#31A8FF]/20">
                <h4 class="text-white font-semibold mb-2">Ferramentas Gratuitas</h4>
                <ul class="text-gray-300 text-xs space-y-1">
                  <li>Gerenciador de Serviços (services.msc) - ferramenta nativa do Windows</li>
                  <li>PowerShell - para automação e scripts avançados</li>
                  <li>Process Explorer - para análise detalhada de processos e serviços</li>
                </ul>
              </div>
              <div class="bg-[#171313] p-3 rounded border border-[#FF4B6B]/20">
                <h4 class="text-white font-semibold mb-2">Soluções Pagas</h4>
                <ul class="text-gray-300 text-xs space-y-1">
                  <li>Advanced Service Manager - para gerenciamento corporativo</li>
                  <li>Service Commander - para monitoramento e controle remoto</li>
                  <li>ManageEngine Applications Manager - solução de monitoramento completa</li>
                </ul>
              </div>
            </div>
          `
        },
        {
          subtitle: "Práticas de Segurança",
          content: `
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
              <li>Pesquise completamente cada serviço antes de desativá-lo</li>
              <li>Crie pontos de restauração do sistema antes de fazer alterações</li>
              <li>Monitore logs de eventos para detectar problemas após alterações</li>
              <li>Documente todas as alterações feitas nos serviços do sistema</li>
            </ul>
          `
        }
      ]
    },
    {
      title: "Troubleshooting e Solução de Problemas",
      content: `
        <p class="mb-4">Soluções para problemas comuns no gerenciamento de serviços.</p>
      `,
      subsections: [
        {
          subtitle: "Erros Frequentes e Soluções",
          content: `
            <div class="bg-[#171313] p-4 rounded-lg border border-[#8B31FF]/30">
              <h4 class="text-white font-semibold mb-2">Problema: Serviço não inicia automaticamente após desligamento/reinicialização</h4>
              <p class="text-gray-300 text-sm mb-2">Solução: Verifique tipo de inicialização e dependências</p>
              <ul class="text-gray-300 text-xs space-y-1 ml-4">
                <li>Confirme que o tipo de inicialização está definido como "Automático"</li>
                <li>Verifique se os serviços dos quais ele depende estão funcionando</li>
                <li>Analise logs de eventos para mensagens de erro específicas</li>
              </ul>
            </div>
            <div class="bg-[#171313] p-4 rounded-lg border border-[#8B31FF]/30 mt-4">
              <h4 class="text-white font-semibold mb-2">Problema: Serviço consome muitos recursos do sistema</h4>
              <p class="text-gray-300 text-sm mb-2">Solução: Configure limites de recursos e agendamento</p>
              <ul class="text-gray-300 text-xs space-y-1 ml-4">
                <li>Use o Gerenciador de Tarefas para identificar consumo de recursos</li>
                <li>Configure prioridades de CPU e limites de memória se suportado</li>
                <li>Considere agendar execução apenas em horários específicos</li>
              </ul>
            </div>
          `
        },
        {
          subtitle: "Prevenção de Problemas Futuros",
          content: `
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
              <li>Realize auditorias periódicas dos serviços em execução</li>
              <li>Mantenha documentação atualizada das configurações de serviços críticos</li>
              <li>Implemente monitoramento proativo de serviços essenciais</li>
              <li>Planeje testes regulares de reinicialização para validar configurações</li>
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
      estimatedTime="65 minutos"
      difficultyLevel="Intermediário"
      contentSections={contentSections}
      relatedGuides={relatedGuides}
    />
  );
}