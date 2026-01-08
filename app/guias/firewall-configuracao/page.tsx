import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Configuração Profissional de Firewall";
const description = "Aprenda a configurar firewall do Windows para proteger seu computador contra ameaças cibernéticas e acessos não autorizados.";
const keywords = ['firewall', 'configuração firewall', 'proteção windows', 'segurança firewall', 'configuração profissional firewall'];

export const metadata: Metadata = createGuideMetadata(title, description, keywords);

export default function FirewallConfiguracaoGuide() {
  const contentSections = [
    {
      title: "Introdução e Conceitos Fundamentais",
      content: `
        <p class="mb-4">Um firewall é um sistema de segurança de rede que monitora e controla o tráfego de entrada e saída com base em regras de segurança predeterminadas, atuando como barreira entre sua rede e ameaças externas.</p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div class="bg-[#171313] p-4 rounded-lg border border-[#31A8FF]/30">
            <h3 class="text-white font-semibold mb-2">Benefícios Principais</h3>
            <ul class="text-gray-300 text-sm space-y-1">
              <li>✓ Bloqueio de ataques cibernéticos automatizados</li>
              <li>✓ Controle granular de acesso a aplicativos</li>
              <li>✓ Monitoramento em tempo real de conexões</li>
              <li>✓ Proteção contra malware e ransomware</li>
            </ul>
          </div>
          <div class="bg-[#171313] p-4 rounded-lg border border-[#FF4B6B]/30">
            <h3 class="text-white font-semibold mb-2">Requisitos Mínimos</h3>
            <ul class="text-gray-300 text-sm space-y-1">
              <li>🛡️ Windows Firewall ou software de terceiros</li>
              <li>💻 Windows 10/11 Pro (para configurações avançadas)</li>
              <li>⏱️ Tempo estimado: 40-60 minutos</li>
              <li>📊 Conhecimento básico de protocolos TCP/IP</li>
            </ul>
          </div>
        </div>
        
        <div class="bg-red-900/20 border border-red-500/30 rounded-lg p-4 my-6">
          <h3 class="text-red-400 font-semibold mb-2">⚠️ Aviso Importante</h3>
          <p class="text-gray-300 text-sm">Configure regras específicas para cada aplicativo - nunca desative completamente o firewall.</p>
        </div>
      `,
      subsections: [
        {
          subtitle: "Quando Aplicar Esta Técnica",
          content: `
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
              <li>Quando for necessário controlar o tráfego de rede</li>
              <li>Para proteger o sistema de acessos não autorizados</li>
              <li>Durante a implementação de políticas de segurança</li>
              <li>Ao configurar servidores ou estações em rede corporativa</li>
            </ul>
          `
        }
      ]
    },
    {
      title: "Configuração Passo a Passo",
      content: `
        <p class="mb-4">Siga estas etapas para configurar regras de firewall no Windows.</p>
      `,
      subsections: [
        {
          subtitle: "Configuração Inicial",
          content: `
            <ol class="space-y-2 text-gray-300 list-decimal list-inside ml-4">
              <li>Acesse o Firewall do Windows (Painel de Controle > Sistema e Segurança)</li>
              <li>Selecione "Firewall do Windows Defender" ou "Configurações Avançadas"</li>
              <li>Analise as regras existentes e identifique necessidades específicas</li>
              <li>Planeje as regras de entrada e saída necessárias para sua configuração</li>
              <li>Documente as alterações planejadas antes de implementar</li>
            </ol>
          `
        },
        {
          subtitle: "Criação de Regras",
          content: `
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
              <li>Crie regras de entrada para permitir serviços necessários</li>
              <li>Crie regras de saída para controlar tráfego originado localmente</li>
              <li>Defina perfis adequados (domínio, privado, público)</li>
              <li>Teste as regras criadas para garantir que funcionam corretamente</li>
              <li>Monitore logs para verificar o funcionamento das regras</li>
            </ul>
          `
        }
      ]
    },
    {
      title: "Ferramentas e Recursos Recomendados",
      content: `
        <p class="mb-4">Ferramentas especializadas para configuração e monitoramento de firewall.</p>
      `,
      subsections: [
        {
          subtitle: "Software Especializado",
          content: `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-[#171313] p-3 rounded border border-[#31A8FF]/20">
                <h4 class="text-white font-semibold mb-2">Ferramentas Gratuitas</h4>
                <ul class="text-gray-300 text-xs space-y-1">
                  <li>Firewall do Windows Defender - solução nativa do SO</li>
                  <li>Netstat - para visualizar conexões ativas</li>
                  <li>PortQry - para testar portas e serviços</li>
                </ul>
              </div>
              <div class="bg-[#171313] p-3 rounded border border-[#FF4B6B]/20">
                <h4 class="text-white font-semibold mb-2">Soluções Pagas</h4>
                <ul class="text-gray-300 text-xs space-y-1">
                  <li>ZoneAlarm - firewall pessoal com recursos avançados</li>
                  <li>Comodo Firewall - com proteção contra malware</li>
                  <li>Soluções corporativas como Cisco ASA ou Fortinet</li>
                </ul>
              </div>
            </div>
          `
        },
        {
          subtitle: "Práticas de Segurança",
          content: `
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
              <li>Implemente a política de menor privilégio (bloquear por padrão)</li>
              <li>Revise regularmente as regras de firewall para manter a segurança</li>
              <li>Documente todas as exceções e justificativas para auditoria</li>
              <li>Teste regras em ambiente de desenvolvimento antes de aplicar em produção</li>
            </ul>
          `
        }
      ]
    },
    {
      title: "Troubleshooting e Solução de Problemas",
      content: `
        <p class="mb-4">Soluções para problemas comuns com configuração de firewall.</p>
      `,
      subsections: [
        {
          subtitle: "Erros Frequentes e Soluções",
          content: `
            <div class="bg-[#171313] p-4 rounded-lg border border-[#8B31FF]/30">
              <h4 class="text-white font-semibold mb-2">Problema: Aplicativo não consegue se conectar à internet após regra de firewall</h4>
              <p class="text-gray-300 text-sm mb-2">Solução: Criar exceção específica para o aplicativo</p>
              <ul class="text-gray-300 text-xs space-y-1 ml-4">
                <li>Abra as configurações do Firewall do Windows Defender</li>
                <li>Vá para "Permitir um aplicativo ou recurso através do Firewall"</li>
                <li>Clique em "Permitir outro aplicativo" e adicione o executável</li>
              </ul>
            </div>
            <div class="bg-[#171313] p-4 rounded-lg border border-[#8B31FF]/30 mt-4">
              <h4 class="text-white font-semibold mb-2">Problema: Regra de firewall criada não está funcionando como esperado</h4>
              <p class="text-gray-300 text-sm mb-2">Solução: Verifique a ordem e especificidade das regras</p>
              <ul class="text-gray-300 text-xs space-y-1 ml-4">
                <li>Regras mais específicas têm precedência sobre regras genéricas</li>
                <li>Verifique se há regras conflitantes com prioridade mais alta</li>
                <li>Confirme que os perfis de rede estão corretamente configurados</li>
              </ul>
            </div>
          `
        },
        {
          subtitle: "Prevenção de Problemas Futuros",
          content: `
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
              <li>Planeje regras de firewall como parte da estratégia de segurança geral</li>
              <li>Documente todas as exceções com justificativas e datas de revisão</li>
              <li>Realize testes regulares para garantir que regras estejam funcionando</li>
              <li>Monitore logs de firewall para identificar tentativas de acesso não autorizado</li>
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
