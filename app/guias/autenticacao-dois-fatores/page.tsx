import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Guia Completo de Autenticação de Dois Fatores (2FA)";
const description = "Implemente autenticação de dois fatores em todas as suas contas para segurança máxima. Configuração passo a passo para Google, Microsoft, Facebook e serviços financeiros.";
const keywords = ["2fa","autenticação dois fatores","segurança de contas","totp","u2f","google authenticator"];

export const metadata: Metadata = createGuideMetadata(title, description, keywords);

export default function AutenticacaodoisfatoresGuide() {
  const contentSections = [
    {
      title: "Introdução e Conceitos Fundamentais",
      content: `
        <p class="mb-4">A autenticação de dois fatores (2FA) é uma camada essencial de segurança que requer duas formas diferentes de verificação da sua identidade antes de conceder acesso às suas contas online.</p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div class="bg-[#171313] p-4 rounded-lg border border-[#31A8FF]/30">
            <h3 class="text-white font-semibold mb-2">Benefícios Principais</h3>
            <ul class="text-gray-300 text-sm space-y-1">
              <li>✓ Proteção contra roubo de senhas</li>
              <li>✓ Segurança mesmo em caso de vazamento</li>
              <li>✓ Alerta imediato de tentativas suspeitas</li>
              <li>✓ Conformidade com regulamentações</li>
            </ul>
          </div>
          <div class="bg-[#171313] p-4 rounded-lg border border-[#FF4B6B]/30">
            <h3 class="text-white font-semibold mb-2">Requisitos Mínimos</h3>
            <ul class="text-gray-300 text-sm space-y-1">
              <li>📱 Smartphone com câmera</li>
              <li>🌐 Contas em serviços compatíveis</li>
              <li>⏱️ Tempo estimado: 30-45 minutos</li>
              <li>📚 Nível: Básico a Intermediário</li>
            </ul>
          </div>
        </div>
        
        <div class="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 my-6">
          <h3 class="text-blue-400 font-semibold mb-2">ℹ️ Importante</h3>
          <p class="text-gray-300 text-sm">Sempre configure métodos de backup antes de ativar o 2FA para evitar perder acesso às suas contas.</p>
        </div>
      `,
      subsections: [
        {
          subtitle: "Quando Aplicar o 2FA",
          content: `
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
              <li>Email pessoal e profissional principal</li>
              <li>Contas bancárias e financeiras</li>
              <li>Redes sociais com informações pessoais</li>
              <li>Serviços de nuvem (Google Drive, Dropbox)</li>
              <li>Lojas online com dados de pagamento</li>
            </ul>
          `
        }
      ]
    },
    {
      title: "Configuração Passo a Passo",
      content: `
        <p class="mb-4">Siga este procedimento detalhado para configurar 2FA em suas contas mais importantes com segurança máxima.</p>
      `,
      subsections: [
        {
          subtitle: "Preparação Inicial",
          content: `
            <ol class="space-y-3 text-gray-300 list-decimal list-inside ml-4">
              <li>
                <strong>Escolha um Gerenciador de Senhas:</strong>
                <ul class="ml-6 mt-1 space-y-1 text-sm">
                  <li>LastPass, Bitwarden ou 1Password</li>
                  <li>Armazene todas as senhas principais nele</li>
                  <li>Ative autenticação biométrica no gerenciador</li>
                </ul>
              </li>
              <li>
                <strong>Prepare Métodos de Backup:</strong>
                <ul class="ml-6 mt-1 space-y-1 text-sm">
                  <li>Salve códigos de recuperação em local seguro</li>
                  <li>Configure número de telefone alternativo</li>
                  <li>Tenha acesso a email secundário</li>
                </ul>
              </li>
              <li>
                <strong>Verifique Dispositivos:</strong>
                <ul class="ml-6 mt-1 space-y-1 text-sm">
                  <li>Garanta que smartphone tenha bateria suficiente</li>
                  <li>Confirme conexão com internet estável</li>
                  <li>Atualize apps de autenticação (Google Authenticator, Authy)</li>
                </ul>
              </li>
            </ol>
          `
        },
        {
          subtitle: "Configuração por Tipo de 2FA",
          content: `
            <div class="space-y-4">
              <div class="bg-[#171313] p-4 rounded-lg border border-[#31A8FF]/30">
                <h4 class="text-white font-semibold mb-2">1. App Authenticator (Mais Seguro)</h4>
                <ul class="text-gray-300 text-sm space-y-1 ml-4">
                  <li>Baixe Google Authenticator, Authy ou Microsoft Authenticator</li>
                  <li>Vá para Configurações de Segurança da conta</li>
                  <li>Escaneie o QR Code com o app</li>
                  <li>Salve os códigos de backup fornecidos</li>
                </ul>
              </div>
              
              <div class="bg-[#171313] p-4 rounded-lg border border-[#FF4B6B]/30">
                <h4 class="text-white font-semibold mb-2">2. SMS (Menos Seguro)</h4>
                <ul class="text-gray-300 text-sm space-y-1 ml-4">
                  <li>Forneça número de telefone verificado</li>
                  <li>Atenção: Vulnerável a roubo de chip SIM</li>
                  <li>Use apenas quando app authenticator não for possível</li>
                </ul>
              </div>
              
              <div class="bg-[#171313] p-4 rounded-lg border border-[#8B31FF]/30">
                <h4 class="text-white font-semibold mb-2">3. Chave de Segurança Física</h4>
                <ul class="text-gray-300 text-sm space-y-1 ml-4">
                  <li>YubiKey, Titan Security Key ou similar</li>
                  <li>Mais seguro, mas requer compra de dispositivo</li>
                  <li>Ideal para contas de alto valor (email principal, bancos)</li>
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
        <p class="mb-4">Estas ferramentas especializadas oferecem implementação segura e gerenciamento eficiente do 2FA.</p>
      `,
      subsections: [
        {
          subtitle: "Apps Authenticator",
          content: `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-[#171313] p-4 rounded border border-[#31A8FF]/20">
                <h4 class="text-white font-semibold mb-3">Gratuitos (Recomendados)</h4>
                <ul class="text-gray-300 text-sm space-y-2">
                  <li><strong>Google Authenticator:</strong> Simples e confiável</li>
                  <li><strong>Microsoft Authenticator:</strong> Excelente para contas Microsoft</li>
                  <li><strong>Authy:</strong> Backup na nuvem e multi-dispositivo</li>
                  <li><strong>FreeOTP:</strong> Open source e leve</li>
                </ul>
              </div>
              <div class="bg-[#171313] p-4 rounded border border-[#FF4B6B]/20">
                <h4 class="text-white font-semibold mb-3">Pagos (Funcionalidades Avançadas)</h4>
                <ul class="text-gray-300 text-sm space-y-2">
                  <li><strong>1Password:</strong> Gerenciador + 2FA integrado</li>
                  <li><strong>LastPass Authenticator:</strong> Sincronização premium</li>
                  <li><strong>Yubico Authenticator:</strong> Para chaves de segurança YubiKey</li>
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
                <h4 class="text-red-400 font-semibold mb-2">⚠️ Nunca Faça Isso:</h4>
                <ul class="text-gray-300 text-sm ml-4">
                  <li>Não use SMS como único método de 2FA</li>
                  <li>Não salve códigos de backup em fotos do celular</li>
                  <li>Não ignore avisos de atividade suspeita</li>
                  <li>Não use 2FA em redes Wi-Fi públicas sem VPN</li>
                </ul>
              </div>
              
              <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
                <li>Ative 2FA em ordem de criticidade: email → bancos → redes sociais</li>
                <li>Use gerenciador de senhas para armazenar códigos de backup</li>
                <li>Configure notificações push para alertas de login</li>
                <li>Revise periodicamente dispositivos autorizados nas contas</li>
              </ul>
            </div>
          `
        }
      ]
    },
    {
      title: "Troubleshooting e Solução de Problemas",
      content: `
        <p class="mb-4">Soluções específicas para problemas comuns com autenticação de dois fatores.</p>
      `,
      subsections: [
        {
          subtitle: "Erros Frequentes e Soluções",
          content: `
            <div class="space-y-4">
              <div class="bg-[#171313] p-4 rounded-lg border border-red-500/30">
                <h4 class="text-red-400 font-semibold mb-2">Erro: "Código 2FA Inválido"</h4>
                <p class="text-gray-300 text-sm mb-3">Solução: Sincronize hora do dispositivo</p>
                <ul class="text-gray-300 text-xs space-y-1 ml-4">
                  <li>No Android: Configurações → Data e hora → Hora automática</li>
                  <li>No iPhone: Configurações → Geral → Data e hora → Hora automática</li>
                  <li>Alternativa: Reinicie o app authenticator</li>
                </ul>
              </div>
              
              <div class="bg-[#171313] p-4 rounded-lg border border-yellow-500/30">
                <h4 class="text-yellow-400 font-semibold mb-2">Problema: Perdi o Smartphone com 2FA</h4>
                <p class="text-gray-300 text-sm mb-3">Solução: Use métodos de backup configurados</p>
                <ul class="text-gray-300 text-xs space-y-1 ml-4">
                  <li>Acesse a conta pelo site oficial</li>
                  <li>Use códigos de recuperação salvos</li>
                  <li>Entre em contato com suporte técnico</li>
                  <li>Altere senha imediatamente após recuperar acesso</li>
                </ul>
              </div>
              
              <div class="bg-[#171313] p-4 rounded-lg border border-blue-500/30">
                <h4 class="text-blue-400 font-semibold mb-2">Erro: "Conta Bloqueada por Segurança"</h4>
                <p class="text-gray-300 text-sm mb-3">Solução: Verificação de identidade</p>
                <ul class="text-gray-300 text-xs space-y-1 ml-4">
                  <li>Verifique email de segurança enviado pela conta</li>
                  <li>Siga processo de verificação por documento</li>
                  <li>Agende ligação com suporte se necessário</li>
                </ul>
              </div>
            </div>
          `
        },
        {
          subtitle: "Prevenção de Problemas Futuros",
          content: `
            <div class="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
              <h4 class="text-green-400 font-semibold mb-3">📅 Plano de Manutenção 2FA</h4>
              <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
                <li><strong>Mensal:</strong> Revise dispositivos autorizados nas contas</li>
                <li><strong>Trimestral:</strong> Atualize apps authenticator</li>
                <li><strong>Semestral:</strong> Renove códigos de backup</li>
                <li><strong>Anual:</strong> Avalie necessidade de chaves físicas de segurança</li>
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
      estimatedTime="45 minutos"
      difficultyLevel="Intermediário"
      contentSections={contentSections}
      relatedGuides={relatedGuides}
    />
  );
}