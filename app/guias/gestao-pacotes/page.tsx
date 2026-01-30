import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Guia Completo de Gestão de Pacotes e Dependências";
const description = "Gerencie bibliotecas, frameworks e dependências de software com npm, pip, chocolatey e outras ferramentas modernas.";
const keywords = ["gestão pacotes","dependências","npm","pip","chocolatey","package manager"];

export const metadata: Metadata = createGuideMetadata('gestao-pacotes', title, description, keywords);

export default function GestaopacotesGuide() {
  const contentSections = [
    {
      title: "Introdução e Conceitos Fundamentais",
      content: `
        <p class="mb-4">A gestão de pacotes é o processo sistemático de instalar, atualizar, configurar e remover software em sistemas Windows, garantindo compatibilidade, segurança e desempenho otimizado dos aplicativos.</p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div class="bg-[#171313] p-4 rounded-lg border border-[#31A8FF]/30">
            <h3 class="text-white font-semibold mb-2">Benefícios Principais</h3>
            <ul class="text-gray-300 text-sm space-y-1">
              <li>✓ Evita conflitos entre versões de software</li>
              <li>✓ Automatiza atualizações de segurança</li>
              <li>✓ Simplifica processos de implantação empresarial</li>
              <li>✓ Reduz tempo de manutenção em 70%</li>
            </ul>
          </div>
          <div class="bg-[#171313] p-4 rounded-lg border border-[#FF4B6B]/30">
            <h3 class="text-white font-semibold mb-2">Requisitos Mínimos</h3>
            <ul class="text-gray-300 text-sm space-y-1">
              <li>📦 Chocolatey, Scoop ou winget instalado</li>
              <li>💻 Windows 10/11 com PowerShell 5.1+</li>
              <li>⏱️ Tempo estimado: 45-75 minutos</li>
              <li>🔑 Permissões de administrador no sistema</li>
            </ul>
          </div>
        </div>
        
        <div class="bg-green-900/20 border border-green-500/30 rounded-lg p-4 my-6">
          <h3 class="text-green-400 font-semibold mb-2">✅ Dica Essencial</h3>
          <p class="text-gray-300 text-sm">Use ambientes virtuais para testar pacotes antes de instalar em produção.</p>
        </div>
      `,
      subsections: [
        {
          subtitle: "Quando Aplicar Esta Técnica",
          content: `
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
              <li>Quando for necessário instalar múltiplos softwares de forma automatizada</li>
              <li>Para padronizar a instalação de pacotes em vários computadores</li>
              <li>Durante a configuração de ambientes de desenvolvimento</li>
              <li>Ao implementar políticas de software em ambientes corporativos</li>
            </ul>
          `
        }
      ]
    },
    {
      title: "Configuração Passo a Passo",
      content: `
        <p class="mb-4">Siga estas etapas para gerenciar pacotes de software no Windows.</p>
      `,
      subsections: [
        {
          subtitle: "Configuração do Gerenciador de Pacotes",
          content: `
            <ol class="space-y-2 text-gray-300 list-decimal list-inside ml-4">
              <li>Instale um gerenciador de pacotes como Chocolatey, Scoop ou winget</li>
              <li>Configure repositórios adicionais se necessário</li>
              <li>Crie uma lista de pacotes essenciais para sua necessidade</li>
              <li>Teste a instalação de alguns pacotes para verificar funcionamento</li>
              <li>Documente os pacotes instalados e suas versões</li>
            </ol>
          `
        },
        {
          subtitle: "Instalação e Atualização de Pacotes",
          content: `
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
              <li>Use comandos para instalar múltiplos pacotes de uma vez</li>
              <li>Configure atualizações automáticas periódicas</li>
              <li>Verifique dependências e compatibilidades entre pacotes</li>
              <li>Monitore logs de instalação para detectar erros</li>
              <li>Mantenha um registro das versões instaladas</li>
            </ul>
          `
        }
      ]
    },
    {
      title: "Ferramentas e Recursos Recomendados",
      content: `
        <p class="mb-4">Ferramentas especializadas para gerenciamento de pacotes no Windows.</p>
      `,
      subsections: [
        {
          subtitle: "Software Especializado",
          content: `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-[#171313] p-3 rounded border border-[#31A8FF]/20">
                <h4 class="text-white font-semibold mb-2">Ferramentas Gratuitas</h4>
                <ul class="text-gray-300 text-xs space-y-1">
                  <li>Chocolatey - gerenciador de pacotes popular para Windows</li>
                  <li>Scoop - alternativa leve e moderna ao Chocolatey</li>
                  <li>winget - gerenciador nativo do Windows Package Manager</li>
                </ul>
              </div>
              <div class="bg-[#171313] p-3 rounded border border-[#FF4B6B]/20">
                <h4 class="text-white font-semibold mb-2">Soluções Pagas</h4>
                <ul class="text-gray-300 text-xs space-y-1">
                  <li>System Center Configuration Manager (SCCM)</li>
                  <li>PDQ Deploy - para implantação em larga escala</li>
                  <li>ManageEngine Desktop Central - solução corporativa completa</li>
                </ul>
              </div>
            </div>
          `
        },
        {
          subtitle: "Práticas de Segurança",
          content: `
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
              <li>Verifique assinaturas digitais dos pacotes antes da instalação</li>
              <li>Use repositórios oficiais e confiáveis apenas</li>
              <li>Mantenha logs detalhados de todas as instalações</li>
              <li>Teste pacotes em ambiente isolado antes de implantação em massa</li>
            </ul>
          `
        }
      ]
    },
    {
      title: "Troubleshooting e Solução de Problemas",
      content: `
        <p class="mb-4">Soluções para problemas comuns no gerenciamento de pacotes.</p>
      `,
      subsections: [
        {
          subtitle: "Erros Frequentes e Soluções",
          content: `
            <div class="bg-[#171313] p-4 rounded-lg border border-[#8B31FF]/30">
              <h4 class="text-white font-semibold mb-2">Problema: Pacote não encontrado no repositório</h4>
              <p class="text-gray-300 text-sm mb-2">Solução: Verifique nome correto e disponibilidade do pacote</p>
              <ul class="text-gray-300 text-xs space-y-1 ml-4">
                <li>Procure pelo pacote usando o comando de busca do gerenciador</li>
                <li>Verifique se o repositório está corretamente configurado</li>
                <li>Confirme se o pacote existe para a arquitetura do seu sistema</li>
              </ul>
            </div>
            <div class="bg-[#171313] p-4 rounded-lg border border-[#8B31FF]/30 mt-4">
              <h4 class="text-white font-semibold mb-2">Problema: Dependências conflitantes entre pacotes</h4>
              <p class="text-gray-300 text-sm mb-2">Solução: Resolva conflitos de dependências manualmente</p>
              <ul class="text-gray-300 text-xs space-y-1 ml-4">
                <li>Identifique quais pacotes estão causando o conflito</li>
                <li>Instale pacotes em ordem específica para evitar dependências</li>
                <li>Considere usar ambientes isolados para pacotes problemáticos</li>
              </ul>
            </div>
          `
        },
        {
          subtitle: "Prevenção de Problemas Futuros",
          content: `
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
              <li>Mantenha uma lista atualizada de pacotes aprovados e testados</li>
              <li>Implemente controle de versão para pacotes críticos</li>
              <li>Planeje atualizações durante janelas de manutenção programadas</li>
              <li>Documente procedimentos de rollback para reversão de atualizações problemáticas</li>
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
      estimatedTime="50 minutos"
      difficultyLevel="Iniciante"
      contentSections={contentSections}
      relatedGuides={relatedGuides}
    />
  );
}