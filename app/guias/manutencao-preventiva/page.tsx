import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Manutenção Preventiva de Computadores";
const description = "Rotinas de manutenção que você pode fazer regularmente para manter seu computador funcionando perfeitamente e evitar problemas futuros.";
const keywords = ['manutencao preventiva', 'manutencao computador', 'rotinas manutencao', 'prevencao problemas', 'otimizacao sistema'];

export const metadata: Metadata = createGuideMetadata(title, description, keywords);

export default function ManutencaoPreventivaGuide() {
  const contentSections = [
    {
      title: "Introdução e Conceitos Fundamentais",
      content: `
        <p class="mb-4">A manutenção preventiva é um conjunto sistemático de procedimentos regulares que visam manter o desempenho ideal do sistema, prevenir falhas e prolongar a vida útil do hardware e software.</p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div class="bg-[#171313] p-4 rounded-lg border border-[#31A8FF]/30">
            <h3 class="text-white font-semibold mb-2">Benefícios Principais</h3>
            <ul class="text-gray-300 text-sm space-y-1">
              <li>✓ Aumento de 40% no desempenho do sistema</li>
              <li>✓ Redução de 80% nas falhas inesperadas</li>
              <li>✓ Prolongamento da vida útil do hardware</li>
              <li>✓ Prevenção de perda de dados críticos</li>
            </ul>
          </div>
          <div class="bg-[#171313] p-4 rounded-lg border border-[#FF4B6B]/30">
            <h3 class="text-white font-semibold mb-2">Requisitos Mínimos</h3>
            <ul class="text-gray-300 text-sm space-y-1">
              <li>🧹 Ferramentas de limpeza (CCleaner, Disk Cleanup)</li>
              <li>💻 Windows 10/11 com 2GB+ RAM livre</li>
              <li>⏱️ Tempo estimado: 60-90 minutos (primeira vez)</li>
              <li>💾 Espaço em disco para backups (5-10GB)</li>
            </ul>
          </div>
        </div>
        
        <div class="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 my-6">
          <h3 class="text-yellow-400 font-semibold mb-2">💡 Dica Profissional</h3>
          <p class="text-gray-300 text-sm">Agende tarefas de manutenção para horários de baixo uso do sistema.</p>
        </div>
      `,
      subsections: [
        {
          subtitle: "Quando Aplicar Esta Técnica",
          content: `
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
              <li>Quando enfrentar problemas de performance</li>
              <li>Para prevenção de falhas futuras</li>
              <li>Durante manutenção preventiva</li>
              <li>Ao configurar novos sistemas</li>
            </ul>
          `
        }
      ]
    },
    {
      title: "Configuração Passo a Passo",
      content: `
        <p class="mb-4">Siga estas etapas metodológicas para implementação completa e segura.</p>
      `,
      subsections: [
        {
          subtitle: "Preparação Inicial",
          content: `
            <ol class="space-y-2 text-gray-300 list-decimal list-inside ml-4">
              <li>Faça backup completo do sistema</li>
              <li>Verifique requisitos mínimos de hardware/software</li>
              <li>Baixe ferramentas necessárias de fontes confiáveis</li>
              <li>Crie ponto de restauração do sistema</li>
              <li>Feche todos os programas em execução</li>
            </ol>
          `
        },
        {
          subtitle: "Execução Principal",
          content: `
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
              <li>Siga instruções específicas do guia</li>
              <li>Monitore sistema durante processo</li>
              <li>Documente cada etapa realizada</li>
              <li>Teste funcionalidade após conclusão</li>
              <li>Verifique logs de eventuais erros</li>
            </ul>
          `
        }
      ]
    },
    {
      title: "Ferramentas e Recursos Recomendados",
      content: `
        <p class="mb-4">Utilize estas ferramentas profissionais para melhores resultados.</p>
      `,
      subsections: [
        {
          subtitle: "Software Especializado",
          content: `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-[#171313] p-3 rounded border border-[#31A8FF]/20">
                <h4 class="text-white font-semibold mb-2">Ferramentas Gratuitas</h4>
                <ul class="text-gray-300 text-xs space-y-1">
                  <li>Ferramentas nativas do Windows</li>
                  <li>Software open source recomendado</li>
                  <li>Utilitários de diagnóstico básicos</li>
                </ul>
              </div>
              <div class="bg-[#171313] p-3 rounded border border-[#FF4B6B]/20">
                <h4 class="text-white font-semibold mb-2">Soluções Pagas</h4>
                <ul class="text-gray-300 text-xs space-y-1">
                  <li>Ferramentas profissionais especializadas</li>
                  <li>Licenças corporativas quando necessário</li>
                  <li>Suporte técnico especializado</li>
                </ul>
              </div>
            </div>
          `
        },
        {
          subtitle: "Práticas de Segurança",
          content: `
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
              <li>Sempre verifique integridade de downloads</li>
              <li>Use apenas fontes oficiais e confiáveis</li>
              <li>Mantenha antivírus atualizado durante processo</li>
              <li>Faça testes em ambiente controlado primeiro</li>
            </ul>
          `
        }
      ]
    },
    {
      title: "Troubleshooting e Solução de Problemas",
      content: `
        <p class="mb-4">Soluções para problemas comuns que podem surgir durante a implementação.</p>
      `,
      subsections: [
        {
          subtitle: "Erros Frequentes e Soluções",
          content: `
            <div class="bg-[#171313] p-4 rounded-lg border border-[#8B31FF]/30">
              <h4 class="text-white font-semibold mb-2">Problema: [Descrição do problema comum]</h4>
              <p class="text-gray-300 text-sm mb-2">Solução: Etapas detalhadas para resolução</p>
              <ul class="text-gray-300 text-xs space-y-1 ml-4">
                <li>Etapa 1 de resolução</li>
                <li>Etapa 2 de resolução</li>
                <li>Etapa 3 de resolução</li>
              </ul>
            </div>
          `
        },
        {
          subtitle: "Prevenção de Problemas Futuros",
          content: `
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
              <li>Implemente monitoramento contínuo</li>
              <li>Realize manutenção preventiva regular</li>
              <li>Mantenha sistema sempre atualizado</li>
              <li>Documente configurações e mudanças</li>
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
      estimatedTime="45 minutos"
      difficultyLevel="Intermediário"
      contentSections={contentSections}
      relatedGuides={relatedGuides}
    />
  );
}