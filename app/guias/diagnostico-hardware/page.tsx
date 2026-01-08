import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Guia Completo de Diagnóstico de Falhas de Hardware";
const description = "Identifique problemas de componentes físicos com ferramentas especializadas. Testes de memória, disco, placa-mãe e fonte.";
const keywords = ["diagnóstico hardware","teste componentes","memtest","crystal disk info","hwinfo"];

export const metadata: Metadata = createGuideMetadata(title, description, keywords);

export default function DiagnosticohardwareGuide() {
  const contentSections = [
    {
      title: "Introdução e Conceitos Fundamentais",
      content: `
        <p class="mb-4">Este guia apresenta uma abordagem completa e profissional para dominar guia completo de diagnóstico de falhas de hardware. 
        Com práticas recomendadas e técnicas avançadas, você estará equipado para lidar com desafios complexos nesta área.</p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div class="bg-[#171313] p-4 rounded-lg border border-[#31A8FF]/30">
            <h3 class="text-white font-semibold mb-2">Benefícios Principais</h3>
            <ul class="text-gray-300 text-sm space-y-1">
              <li>✓ Melhoria significativa de performance</li>
              <li>✓ Redução de problemas técnicos</li>
              <li>✓ Maior segurança do sistema</li>
              <li>✓ Otimização de recursos</li>
            </ul>
          </div>
          <div class="bg-[#171313] p-4 rounded-lg border border-[#FF4B6B]/30">
            <h3 class="text-white font-semibold mb-2">Requisitos Mínimos</h3>
            <ul class="text-gray-300 text-sm space-y-1">
              <li>🔧 Conhecimento básico de informática</li>
              <li>💻 Sistema Windows 10/11 atualizado</li>
              <li>⏱️ Tempo estimado: 85 minutos</li>
              <li>📚 Nível: Avançado</li>
            </ul>
          </div>
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
      estimatedTime="85 minutos"
      difficultyLevel="Avançado"
      contentSections={contentSections}
      relatedGuides={relatedGuides}
    />
  );
}