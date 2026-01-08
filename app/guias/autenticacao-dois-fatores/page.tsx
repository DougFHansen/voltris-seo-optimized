import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Guia Completo de Autenticação de Dois Fatores (2FA)";
const description = "Implemente autenticação de dois fatores em todas as suas contas para segurança máxima. Configuração passo a passo para Google, Microsoft, Facebook e serviços financeiros.";
const keywords = ['2fa', 'autenticação dois fatores', 'segurança de contas', 'totp', 'u2f', 'google authenticator'];

export const metadata: Metadata = createGuideMetadata(title, description, keywords);

export default function AutenticacaoDoisFatoresGuide() {
  const contentSections = [
    {
      title: "Fundamentos da Autenticação de Dois Fatores",
      content: `
        <p class="mb-4">A autenticação de dois fatores (2FA) adiciona uma camada extra de segurança às suas contas online, 
        exigindo não apenas uma senha, mas também um segundo fator de autenticação.</p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div class="bg-[#171313] p-4 rounded-lg border border-[#31A8FF]/30">
            <h3 class="text-white font-semibold mb-2">Tipos de 2FA</h3>
            <ul class="text-gray-300 text-sm space-y-1">
              <li>📱 SMS (menos seguro)</li>
              <li>🔑 TOTP (apps autenticadores)</li>
              <li>_usb U2F (tokens físicos)</li>
              <li>📧 Email (moderadamente seguro)</li>
            </ul>
          </div>
          <div class="bg-[#171313] p-4 rounded-lg border border-[#FF4B6B]/30">
            <h3 class="text-white font-semibold mb-2">Benefícios</h3>
            <ul class="text-gray-300 text-sm space-y-1">
              <li>🛡️ Proteção contra roubo de senhas</li>
              <li>🔐 Segurança mesmo com vazamentos</li>
              <li>📈 Redução de fraudes financeiras</li>
              <li>💼 Requisito corporativo crescente</li>
            </ul>
          </div>
        </div>
      `,
      subsections: [
        {
          subtitle: "Apps Autenticadores Recomendados",
          content: `
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
              <li><strong class="text-white">Google Authenticator</strong>: Simples e confiável</li>
              <li><strong class="text-white">Authy</strong>: Backup na nuvem e multi-dispositivo</li>
              <li><strong class="text-white">Microsoft Authenticator</strong>: Integração Office 365</li>
              <li><strong class="text-white">LastPass Authenticator</strong>: Para usuários LastPass</li>
            </ul>
          `
        }
      ]
    },
    {
      title: "Configuração Passo a Passo por Serviço",
      content: `
        <p class="mb-4">Instruções detalhadas para habilitar 2FA nos serviços mais populares.</p>
      `,
      subsections: [
        {
          subtitle: "Google Account (Gmail, YouTube, etc.)",
          content: `
            <ol class="space-y-2 text-gray-300 list-decimal list-inside ml-4">
              <li>Acesse myaccount.google.com/security</li>
              <li>Clique em 'Autenticação de 2 etapas'</li>
              <li>Insira sua senha quando solicitado</li>
              <li>Escolha método (app autenticador recomendado)</li>
              <li>Escaneie QR code com app escolhido</li>
              <li>Digite código gerado para confirmação</li>
              <li>Guarde códigos de backup em local seguro</li>
            </ol>
          `
        },
        {
          subtitle: "Microsoft Account (Outlook, Office 365)",
          content: `
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
              <li>Vá em account.microsoft.com/security</li>
              <li>Selecione 'Mais opções de segurança'</li>
              <li>Escolha 'Ativar autenticação de dois fatores'</li>
              <li>Siga processo similar ao Google</li>
              <li>Configure método de backup alternativo</li>
            </ul>
          `
        }
      ]
    },
    {
      title: "Práticas de Segurança Avançadas",
      content: `
        <p class="mb-4">Maximize a eficácia da sua implementação 2FA com estas práticas profissionais.</p>
      `,
      subsections: [
        {
          subtitle: "Gestão de Códigos de Backup",
          content: `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-[#171313] p-3 rounded border border-[#31A8FF]/20">
                <h4 class="text-white font-semibold mb-2">✓ FAÇA</h4>
                <ul class="text-gray-300 text-xs space-y-1">
                  <li>Imprima e guarde em cofre físico</li>
                  <li>Armazene em gerenciador de senhas</li>
                  <li>Compartilhe com herdeiro digital confiável</li>
                </ul>
              </div>
              <div class="bg-[#171313] p-3 rounded border border-[#FF4B6B]/20">
                <h4 class="text-white font-semibold mb-2">✗ NÃO FAÇA</h4>
                <ul class="text-gray-300 text-xs space-y-1">
                  <li>Não armazene no mesmo dispositivo</li>
                  <li>Não envie por email não criptografado</li>
                  <li>Não deixe em notas visíveis</li>
                </ul>
              </div>
            </div>
          `
        },
        {
          subtitle: "Hierarquia de Segurança por Serviço",
          content: `
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
              <li><strong class="text-white">Financeiro/Bancário</strong>: U2F obrigatório</li>
              <li><strong class="text-white">Email Principal</strong>: TOTP + backup</li>
              <li><strong class="text-white">Redes Sociais</strong>: TOTP básico</li>
              <li><strong class="text-white">Contas Secundárias</strong>: SMS mínimo</li>
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
      href: "/guias/criptografia-dados",
      title: "Criptografia de Dados",
      description: "Proteção avançada de informações sensíveis"
    },
    {
      href: "/guias/firewall-configuracao",
      title: "Configuração de Firewall",
      description: "Proteção de rede avançada para Windows"
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