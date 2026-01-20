import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = 'Configuração Profissional de Rede Corporativa';
const description = 'Implemente uma rede corporativa segura e eficiente com segmentação de VLAN, controle de acesso, QoS e monitoramento profissional. Soluções para pequenas e médias empresas.';
const keywords = [
  'rede corporativa',
  'configuração VLAN',
  'segmentação rede',
  'controle acesso rede',
  'QoS rede',
  'roteador empresarial',
  'switch managed',
  'firewall rede',
  'monitoramento rede',
  'segurança rede corporativa',
  'infraestrutura TI',
  'administração rede'
];

export const metadata: Metadata = createGuideMetadata(title, description, keywords);

export default function RedeCorporativaGuide() {
  const contentSections = [
    {
      title: "Fundamentos de Redes Corporativas",
      content: `
        <p class="mb-4">Redes corporativas exigem planejamento cuidadoso para garantir segurança, performance e escalabilidade. Diferente de redes domésticas, ambientes empresariais precisam lidar com múltiplos departamentos, níveis de acesso e requisitos de compliance.</p>
        <p class="mb-4">Componentes essenciais:</p>
        <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4 mb-4">
          <li>Roteadores empresariais com recursos avançados</li>
          <li>Switches managed para segmentação</li>
          <li>Firewalls dedicados para segurança</li>
          <li>Servidores de autenticação (Active Directory)</li>
          <li>Sistemas de monitoramento e logging</li>
        </ul>
        <p>O planejamento inicial determina a arquitetura toda da infraestrutura de TI da empresa.</p>
      `,
      subsections: []
    },
    {
      title: "Planejamento e Design da Rede",
      content: "",
      subsections: [
        {
          subtitle: "Levantamento de Requisitos",
          content: `
            <p>Antes de qualquer implementação:</p>
            <ol class="space-y-2 text-gray-300 list-decimal list-inside ml-4 mb-4">
              <li>Mapeie todos os departamentos e suas necessidades</li>
              <li>Identifique dispositivos que precisam de acesso à rede</li>
              <li>Determine níveis de acesso e permissões</li>
              <li>Planeje crescimento futuro (3-5 anos)</li>
              <li>Defina requisitos de segurança e compliance</li>
            </ol>
          `
        },
        {
          subtitle: "Segmentação com VLANs",
          content: `
            <p>Organize a rede em segmentos lógicos:</p>
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4 mb-4">
              <li><strong>VLAN Administrativa:</strong> Acesso restrito a TI</li>
              <li><strong>VLAN Financeira:</strong> Dados sensíveis e controles rigorosos</li>
              <li><strong>VLAN Operacional:</strong> Departamentos de produção/operacional</li>
              <li><strong>VLAN Visitantes:</strong> Acesso limitado à internet apenas</li>
              <li><strong>VLAN IoT:</strong> Dispositivos inteligentes e sensores</li>
            </ul>
          `
        },
        {
          subtitle: "Esquema de Endereçamento IP",
          content: `
            <p>Exemplo de estrutura organizada:</p>
            <div class="bg-[#171313] p-4 rounded-lg border border-[#31A8FF]/30 mt-4">
              <p class="text-white font-semibold mb-2">🏢 Estrutura de IPs:</p>
              <pre class="text-gray-300 text-sm">
10.0.0.0/8 - Rede Principal
├── 10.10.0.0/24 - VLAN Administrativa
├── 10.20.0.0/24 - VLAN Financeira  
├── 10.30.0.0/24 - VLAN Operacional
├── 10.40.0.0/24 - VLAN Visitantes
└── 10.50.0.0/24 - VLAN IoT
              </pre>
            </div>
          `
        }
      ]
    },
    {
      title: "Implementação Prática",
      content: "",
      subsections: [
        {
          subtitle: "Configuração do Roteador Principal",
          content: `
            <p>Passos essenciais:</p>
            <ol class="space-y-2 text-gray-300 list-decimal list-inside ml-4 mb-4">
              <li>Configure interfaces para cada VLAN</li>
              <li>Implemente DHCP para cada segmento</li>
              <li>Configure regras de NAT e firewall</li>
              <li>Ative logging para auditoria</li>
              <li>Configure SNMP para monitoramento</li>
            </ol>
          `
        },
        {
          subtitle: "Switches Managed e Port Security",
          content: `
            <p>Segurança em nível de porta:</p>
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4 mb-4">
              <li>Port Security com MAC address binding</li>
              <li>Storm control para prevenir broadcasts excessivos</li>
              <li>BPDU guard para proteger STP</li>
              <li>Port isolation para VLANs</li>
              <li>Auto-negotiation desativado em portas críticas</li>
            </ul>
          `
        }
      ]
    },
    {
      title: "Segurança e Controle de Acesso",
      content: "",
      subsections: [
        {
          subtitle: "Firewall e Regras de Acesso",
          content: `
            <p>Implementação de políticas de segurança:</p>
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4 mb-4">
              <li>Regras de entrada/saída por VLAN</li>
              <li>Inspeção profunda de pacotes (DPI)</li>
              <li>Prevenção de intrusão (IPS)</li>
              <li>Filtragem de conteúdo web</li>
              <li>VPN site-to-site para filiais</li>
            </ul>
          `
        },
        {
          subtitle: "Autenticação Centralizada",
          content: `
            <p>Integração com Active Directory:</p>
            <ol class="space-y-2 text-gray-300 list-decimal list-inside ml-4 mb-4">
              <li>Instale e configure Domain Controller</li>
              <li>Crie grupos de usuários por departamento</li>
              <li>Implemente políticas de grupo (GPO)</li>
              <li>Configure logon único (SSO)</li>
              <li>Ative auditoria de eventos</li>
            </ol>
          `
        }
      ]
    },
    {
      title: "Monitoramento e Manutenção",
      content: `
        <p>Ferramentas essenciais para administração contínua:</p>
        <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4 mb-4">
          <li><strong>PRTG Network Monitor:</strong> Dashboard completo de performance</li>
          <li><strong>Wireshark:</strong> Análise de pacotes em tempo real</li>
          <li><strong>Nagios:</strong> Alertas proativos de falhas</li>
          <li><strong>SolarWinds:</strong> Suite empresarial completa</li>
          <li><strong>Zabbix:</strong> Solução open-source robusta</li>
        </ul>
      `,
      subsections: []
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/rede-domestica",
      title: "Configuração de Rede Doméstica",
      description: "Configure roteadores e extensores Wi-Fi para ambiente residencial."
    },
    {
      href: "/guias/troubleshooting-internet",
      title: "Diagnóstico de Problemas de Internet",
      description: "Resolva problemas de conectividade e velocidade de internet."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="45 minutos"
      difficultyLevel="Avançado"
      contentSections={contentSections}
      relatedGuides={relatedGuides}
      author="Equipe Técnica Voltris"
      lastUpdated="Janeiro 2025"
    />
  );
}