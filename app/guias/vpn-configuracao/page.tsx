import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'vpn-configuracao',
  title: "Guia Completo de Configuração de VPN para Privacidade Online",
  description: "Aprenda a configurar VPN profissional para proteger sua privacidade online, acessar conteúdo bloqueado e trabalhar remotamente com segurança.",
  category: 'rede-seguranca',
  difficulty: 'Intermediário',
  time: '60 minutos'
};

const title = "Guia Completo de Configuração de VPN para Privacidade Online";
const description = "Aprenda a configurar VPN profissional para proteger sua privacidade online, acessar conteúdo bloqueado e trabalhar remotamente com segurança.";
const keywords = [
  "configuração de vpn",
  "privacidade online",
  "vpn gratuita",
  "acesso remoto seguro",
  "proteção de dados",
  "internet segura"
];

export const metadata: Metadata = createGuideMetadata('vpn-configuracao', title, description, keywords);

export default function VpnConfiguracaoGuide() {
  const contentSections = [
    {
      title: "O Que é VPN e Por Que Usar?",
      content: `
        <p class="mb-4">VPN (Virtual Private Network) cria uma conexão segura e criptografada entre seu dispositivo 
        e a internet, mascarando seu endereço IP real e protegendo seus dados de olhares curiosos.</p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div class="bg-[#171313] p-4 rounded-lg border border-[#FF4B6B]/30">
            <h3 class="text-white font-semibold mb-2">Benefícios Principais</h3>
            <ul class="text-gray-300 text-sm space-y-1">
              <li>✓ Privacidade online completa</li>
              <li>✓ Acesso a conteúdo geo-restrito</li>
              <li>✓ Proteção em redes Wi-Fi públicas</li>
              <li>✓ Trabalho remoto seguro</li>
            </ul>
          </div>
          <div class="bg-[#171313] p-4 rounded-lg border border-[#8B31FF]/30">
            <h3 class="text-white font-semibold mb-2">Casos de Uso</h3>
            <ul class="text-gray-300 text-sm space-y-1">
              <li>✈️ Viagens internacionais</li>
              <li>🏢 Trabalho remoto corporativo</li>
              <li>📺 Streaming de conteúdo internacional</li>
              <li>☕ Uso em cafés e aeroportos</li>
            </ul>
          </div>
        </div>
        
        <div class="bg-[#171313] p-4 rounded-lg border border-[#31A8FF]/30 mt-4">
          <p class="text-white font-semibold mb-2">💡 Importante:</p>
          <p class="text-gray-300 leading-relaxed">
            Nem todas as VPNs são criadas iguais. A escolha do provedor certo é crucial para 
            garantir verdadeira privacidade e desempenho adequado. Evite VPNs gratuitas suspeitas.
          </p>
        </div>
      `,
      subsections: []
    },
    {
      title: "Como Funciona uma VPN",
      content: "",
      subsections: [
        {
          subtitle: "Processo de Conexão",
          content: `
            <ol class="space-y-3 text-gray-300 list-decimal list-inside ml-4 mb-6">
              <li>Seu dispositivo se conecta ao servidor VPN escolhido</li>
              <li>Todos os dados são criptografados antes de sair do seu dispositivo</li>
              <li>O tráfego é roteado através do servidor VPN</li>
              <li>Seu IP real é substituído pelo IP do servidor VPN</li>
              <li>Os sites veem apenas o IP do servidor VPN</li>
              <li>Dados são descriptografados apenas no destino final</li>
            </ol>
          `
        },
        {
          subtitle: "Criptografia e Protocolos",
          content: `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="bg-[#171313] p-4 rounded-lg border border-[#31A8FF]/30">
                <h4 class="text-white font-semibold mb-2">Criptografia Utilizada</h4>
                <ul class="space-y-1 text-gray-300 text-sm">
                  <li><strong class="text-white">AES-256</strong>: Padrão militar</li>
                  <li><strong class="text-white">RSA-2048</strong>: Troca de chaves</li>
                  <li><strong class="text-white">SHA-256</strong>: Verificação de integridade</li>
                  <li><strong class="text-white">Perfect Forward Secrecy</strong>: Chaves únicas por sessão</li>
                </ul>
              </div>
              <div class="bg-[#171313] p-4 rounded-lg border border-[#FF4B6B]/30">
                <h4 class="text-white font-semibold mb-2">Protocolos VPN</h4>
                <ul class="space-y-1 text-gray-300 text-sm">
                  <li><strong class="text-white">OpenVPN</strong>: Mais seguro e confiável</li>
                  <li><strong class="text-white">IKEv2/IPsec</strong>: Rápido e estável</li>
                  <li><strong class="text-white">WireGuard</strong>: Moderno e eficiente</li>
                  <li><strong class="text-white">L2TP/IPsec</strong>: Compatível mas mais lento</li>
                </ul>
              </div>
            </div>
          `
        }
      ]
    },
    {
      title: "Escolhendo o Provedor VPN Ideal",
      content: "",
      subsections: [
        {
          subtitle: "Critérios de Avaliação",
          content: `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="bg-[#171313] p-4 rounded-lg border border-[#31A8FF]/30">
                <h4 class="text-white font-semibold mb-2">Fatores Essenciais</h4>
                <ul class="space-y-2 text-gray-300 text-sm">
                  <li>🔒 <strong>Política de não registro</strong></li>
                  <li>🌐 <strong>Número de servidores/países</strong></li>
                  <li>⚡ <strong>Velocidade e largura de banda</strong></li>
                  <li>📱 <strong>Compatibilidade multi-dispositivo</strong></li>
                  <li>💰 <strong>Preço e planos</strong></li>
                </ul>
              </div>
              <div class="bg-[#171313] p-4 rounded-lg border border-[#8B31FF]/30">
                <h4 class="text-white font-semibold mb-2">Recursos Adicionais</h4>
                <ul class="space-y-2 text-gray-300 text-sm">
                  <li>🛡️ <strong>Kill Switch automático</strong></li>
                  <li>🔄 <strong>Alternância rápida de servidores</strong></li>
                  <li>🎯 <strong>Servidores especializados</strong></li>
                  <li>👥 <strong>Suporte ao cliente 24/7</strong></li>
                  <li>🧪 <strong>Teste gratuito/garantia</strong></li>
                </ul>
              </div>
            </div>
          `
        },
        {
          subtitle: "Provedores Recomendados",
          content: `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="bg-[#171313] p-4 rounded-lg border border-[#FF4B6B]/20">
                <h4 class="text-white font-bold mb-2">ExpressVPN</h4>
                <ul class="text-gray-300 text-xs space-y-1">
                  <li>✓ Velocidade excelente</li>
                  <li>✓ 3000+ servidores</li>
                  <li>✓ Kill Switch</li>
                  <li>✓ 30 dias de garantia</li>
                  <li class="text-[#FF4B6B]">Preço: $$$</li>
                </ul>
              </div>
              <div class="bg-[#171313] p-4 rounded-lg border border-[#31A8FF]/20">
                <h4 class="text-white font-bold mb-2">NordVPN</h4>
                <ul class="text-gray-300 text-xs space-y-1">
                  <li>✓ Dupla criptografia</li>
                  <li>✓ 5500+ servidores</li>
                  <li>✓ CyberSec (bloqueio de ads)</li>
                  <li>✓ 30 dias de garantia</li>
                  <li class="text-[#31A8FF]">Preço: $$</li>
                </ul>
              </div>
              <div class="bg-[#171313] p-4 rounded-lg border border-[#8B31FF]/20">
                <h4 class="text-white font-bold mb-2">Surfshark</h4>
                <ul class="text-gray-300 text-xs space-y-1">
                  <li>✓ Conexões ilimitadas</li>
                  <li>✓ 3200+ servidores</li>
                  <li>✓ CleanWeb (anti-malware)</li>
                  <li>✓ 30 dias de garantia</li>
                  <li class="text-[#8B31FF]">Preço: $</li>
                </ul>
              </div>
            </div>
          `
        }
      ]
    },
    {
      title: "Configuração Básica de VPN",
      content: "",
      subsections: [
        {
          subtitle: "Passo 1: Download e Instalação",
          content: `
            <ol class="space-y-3 text-gray-300 list-decimal list-inside ml-4 mb-6">
              <li>Acesse o site oficial do provedor VPN escolhido</li>
              <li>Faça download do aplicativo para seu sistema operacional</li>
              <li>Execute o instalador e siga as instruções</li>
              <li>Crie uma conta com email válido</li>
              <li>Faça login no aplicativo</li>
            </ol>
          `
        },
        {
          subtitle: "Passo 2: Configuração Inicial",
          content: `
            <div class="mb-4">
              <h4 class="text-xl font-bold text-white mb-2">Configurações Recomendadas</h4>
              <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4 mb-4">
                <li><strong class="text-white">Protocolo:</strong> OpenVPN (mais seguro) ou WireGuard (mais rápido)</li>
                <li><strong class="text-white">Kill Switch:</strong> Sempre ativado para proteção máxima</li>
                <li><strong class="text-white">DNS Leak Protection:</strong> Ativado para evitar vazamento de DNS</li>
                <li><strong class="text-white">Auto-connect:</strong> Configure para conectar automaticamente</li>
              </ul>
            </div>
            
            <div class="bg-[#171313] p-4 rounded-lg border border-[#8B31FF]/30">
              <p class="text-white font-semibold mb-2">💡 Dica Profissional:</p>
              <p class="text-gray-300 leading-relaxed">
                Teste diferentes servidores em países próximos para encontrar a melhor combinação 
                de velocidade e estabilidade. Servidores mais próximos geralmente oferecem melhor performance.
              </p>
            </div>
          `
        }
      ]
    },
    {
      title: "Configuração Avançada e Personalizada",
      content: "",
      subsections: [
        {
          subtitle: "VPN Personalizada com OpenVPN",
          content: `
            <p class="text-gray-300 leading-relaxed mb-4">
              Para usuários avançados que querem controle total sobre sua VPN:
            </p>
            
            <ol class="space-y-3 text-gray-300 list-decimal list-inside ml-4 mb-6">
              <li>Baixe o cliente OpenVPN oficial (openvpn.net)</li>
              <li>Obtenha arquivos de configuração (.ovpn) do seu provedor</li>
              <li>Coloque os arquivos na pasta de configuração do OpenVPN</li>
              <li>Importe as configurações no cliente OpenVPN</li>
              <li>Configure autenticação por certificado ou credenciais</li>
              <li>Teste a conexão e ajuste configurações conforme necessário</li>
            </ol>
          `
        },
        {
          subtitle: "VPN para Empresas",
          content: `
            <div class="mb-4">
              <h4 class="text-xl font-bold text-white mb-2">Requisitos Corporativos</h4>
              <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4 mb-4">
                <li><strong class="text-white">Centralized Management:</strong> Painel administrativo para todos os usuários</li>
                <li><strong class="text-white">Business Servers:</strong> Servidores dedicados para empresas</li>
                <li><strong class="text-white">Team Accounts:</strong> Contas compartilhadas com controle de acesso</li>
                <li><strong class="text-white">Audit Logs:</strong> Registro completo de atividades</li>
                <li><strong class="text-white">Dedicated Support:</strong> Suporte prioritário 24/7</li>
              </ul>
            </div>
          `
        }
      ]
    },
    {
      title: "Casos de Uso Práticos",
      content: "",
      subsections: [
        {
          subtitle: "Trabalho Remoto Seguro",
          content: `
            <p class="text-gray-300 leading-relaxed mb-2">
              Proteja dados corporativos ao trabalhar de qualquer lugar:
            </p>
            <ul class="space-y-1 text-gray-300 list-disc list-inside ml-4 text-sm">
              <li>Conecte-se ao servidor VPN da empresa</li>
              <li>Acesse recursos corporativos com segurança</li>
              <li>Proteja comunicações em redes públicas</li>
              <li>Cumpra políticas de segurança corporativa</li>
            </ul>
          `
        },
        {
          subtitle: "Streaming Internacional",
          content: `
            <p class="text-gray-300 leading-relaxed mb-2">
              Acesse conteúdo restrito geograficamente:
            </p>
            <ul class="space-y-1 text-gray-300 list-disc list-inside ml-4 text-sm">
              <li>Conecte-se a servidores em diferentes países</li>
              <li>Acesse Netflix, Disney+, HBO Max de outras regiões</li>
              <li>Evite bloqueios de conteúdo por localização</li>
              <li>Mantenha velocidades adequadas para streaming HD</li>
            </ul>
          `
        },
        {
          subtitle: "Proteção em Redes Públicas",
          content: `
            <p class="text-gray-300 leading-relaxed mb-2">
              Segurança em Wi-Fi público de hotéis, cafés e aeroportos:
            </p>
            <ul class="space-y-1 text-gray-300 list-disc list-inside ml-4 text-sm">
              <li>Ative VPN automaticamente ao conectar em Wi-Fi público</li>
              <li>Proteja dados bancários e informações pessoais</li>
              <li>Evite ataques man-in-the-middle</li>
              <li>Mantenha anonimato online</li>
            </ul>
          `
        }
      ]
    },
    {
      title: "Problemas Comuns e Soluções",
      content: "",
      subsections: [
        {
          subtitle: "Conexão Lenta",
          content: `
            <p class="text-gray-300 leading-relaxed mb-2">
              Soluções para melhorar velocidade:
            </p>
            <ul class="space-y-1 text-gray-300 list-disc list-inside ml-4 text-sm">
              <li>Escolha servidor geograficamente próximo</li>
              <li>Mude para protocolo WireGuard</li>
              <li>Feche aplicativos que usam muita banda</li>
              <li>Reinicie o roteador e modem</li>
            </ul>
          `
        },
        {
          subtitle: "VPN Não Conecta",
          content: `
            <p class="text-gray-300 leading-relaxed mb-2">
              Diagnóstico e solução:
            </p>
            <ul class="space-y-1 text-gray-300 list-disc list-inside ml-4 text-sm">
              <li>Verifique firewall e antivírus</li>
              <li>Tente diferentes protocolos</li>
              <li>Use servidores alternativos</li>
              <li>Contate suporte técnico</li>
            </ul>
          `
        },
        {
          subtitle: "Vazamento de IP/DNS",
          content: `
            <p class="text-gray-300 leading-relaxed mb-2">
              Teste e correção:
            </p>
            <ul class="space-y-1 text-gray-300 list-disc list-inside ml-4 text-sm">
              <li>Use sites como ipleak.net para testar</li>
              <li>Ative DNS leak protection no aplicativo</li>
              <li>Configure DNS manualmente (1.1.1.1, 8.8.8.8)</li>
              <li>Ative kill switch obrigatório</li>
            </ul>
          `
        }
      ]
    },
    {
      title: "Conclusão",
      content: `<p class="text-gray-300 leading-relaxed mb-4">
                Uma VPN bem configurada é essencial na era digital para proteger sua privacidade, 
                acessar conteúdo restrito e trabalhar remotamente com segurança. A escolha do provedor 
                certo e configurações adequadas fazem toda a diferença na experiência e eficácia.
              </p>
              <p class="text-gray-300 leading-relaxed mb-4">
                Lembre-se de que VPN é uma ferramenta poderosa que, quando usada corretamente, 
                proporciona liberdade digital e segurança significativas. Mantenha-se atualizado 
                sobre melhores práticas e novas tecnologias de privacidade.
              </p>
              <div class="bg-[#171313] p-6 rounded-lg border border-[#31A8FF]/30 mt-6">
                <p class="text-white font-semibold mb-3 text-lg">Precisa de Configuração Profissional?</p>
                <p class="text-gray-300 leading-relaxed mb-4">
                  Nossa equipe pode configurar VPN corporativa ou pessoal com as melhores práticas 
                  de segurança e otimização de performance.
                </p>
                <div class="flex flex-col sm:flex-row gap-4">
                  <a 
                    href="/todos-os-servicos"
                    class="px-6 py-3 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300 text-center inline-block"
                  >
                    Ver Serviços de Rede
                  </a>
                  <a 
                    href="https://wa.me/5511996716235?text=Olá!%20Preciso%20de%20ajuda%20com%20configuração%20de%20VPN."
                    target="_blank"
                    rel="noopener noreferrer"
                    class="px-6 py-3 border-2 border-[#31A8FF] text-[#31A8FF] font-bold rounded-xl hover:bg-[#31A8FF] hover:text-white transition-all duration-300 text-center inline-block"
                  >
                    Falar com Especialista
                  </a>
                </div>
              </div>`,
      subsections: []
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/firewall-configuracao",
      title: "Configuração de Firewall",
      description: "Proteção de rede completa para seu sistema."
    },
    {
      href: "/guias/seguranca-digital",
      title: "Segurança Digital",
      description: "Proteção completa contra ameaças cibernéticas."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="60 minutos"
      difficultyLevel="Intermediário"
      contentSections={contentSections}
      relatedGuides={relatedGuides}
    />
  );
}