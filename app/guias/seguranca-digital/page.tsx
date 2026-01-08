import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = 'Guia de Segurança Digital Essencial';
const description = 'Proteja seu computador contra vírus, malware e ataques cibernéticos. Este guia completo ensina sobre antivírus, firewall, senhas seguras, navegação segura e as melhores práticas de segurança digital para proteger seus dados e privacidade online.';
const keywords = [
  'segurança digital',
  'antivírus',
  'firewall',
  'senhas seguras',
  'navegação segura',
  'proteção contra malware',
  'proteção contra ransomware',
  'phishing',
  'segurança computador',
  'proteção dados',
  'segurança internet',
  'proteção cibernética',
  'proteção online',
  'segurança pessoal',
  'proteção privacidade'
];

export const metadata: Metadata = createGuideMetadata(title, description, keywords);

export default function SegurancaDigitalGuide() {
  const contentSections = [
    {
      title: "Por Que a Segurança Digital É Importante?",
      content: `
        <p class="mb-4">Com o aumento do uso da internet e a digitalização de informações pessoais e financeiras, a segurança digital se tornou uma preocupação crítica. Ataques cibernéticos, vírus, malware, phishing e roubo de identidade são ameaças reais e constantes que podem causar danos significativos.</p>
        <p class="mb-4">Um computador desprotegido pode ser infectado em minutos após conectar-se à internet. Vírus podem roubar suas senhas, dados bancários, informações pessoais e até mesmo sequestrar seus arquivos (ransomware). Além disso, hackers podem usar seu computador infectado para atacar outros sistemas sem seu conhecimento.</p>
        <p>Este guia apresenta uma estratégia de defesa em camadas - múltiplas camadas de proteção que trabalham juntas para criar uma barreira robusta contra ameaças digitais. Nenhuma medida isolada é suficiente, mas combinando várias práticas de segurança, você pode proteger significativamente seu computador e dados.</p>
      `,
      subsections: []
    },
    {
      title: "Passo 1: Instalar e Configurar um Antivírus Profissional",
      content: "",
      subsections: [
        {
          subtitle: "Escolhendo um Antivírus",
          content: `
            <p class="mb-4">O Windows inclui o Windows Defender, que é um antivírus básico e gratuito. Para proteção mais robusta, especialmente se você usa o computador para transações bancárias ou armazena informações sensíveis, considere investir em um antivírus premium.</p>
            <h4 class="text-xl font-bold text-white mb-2 mt-4">Antivírus Recomendados:</h4>
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4 mb-4">
              <li><strong class="text-white">Windows Defender:</strong> Gratuito, já incluído no Windows, oferece proteção básica adequada para usuários casuais</li>
              <li><strong class="text-white">Norton, Kaspersky, Bitdefender:</strong> Antivírus premium com proteção avançada contra malware e phishing</li>
              <li><strong class="text-white">Avast, AVG:</strong> Boas opções gratuitas com versões premium disponíveis</li>
            </ul>
          `
        },
        {
          subtitle: "Configuração do Antivírus",
          content: `
            <p class="mb-4">Após instalar um antivírus, configure-o adequadamente:</p>
            <ol class="space-y-2 text-gray-300 list-decimal list-inside ml-4 mb-4">
              <li>Execute uma verificação completa do sistema imediatamente após a instalação</li>
              <li>Configure verificações automáticas regulares (diárias ou no mínimo semanais)</li>
              <li>Ative a proteção em tempo real</li>
              <li>Configure para verificar downloads automaticamente</li>
              <li>Mantenha o antivírus sempre atualizado (geralmente automático)</li>
              <li>Ative proteção contra phishing e sites maliciosos</li>
            </ol>
            <div class="bg-[#171313] p-4 rounded-lg border border-[#FF4B6B]/30 mt-4">
              <p class="text-white font-semibold mb-2">⚠️ Importante:</p>
              <p class="text-gray-300 leading-relaxed">
                Nunca instale mais de um antivírus ao mesmo tempo. Múltiplos antivírus podem conflitar entre si, causar lentidão e até criar vulnerabilidades. Escolha um e mantenha apenas ele instalado.
              </p>
            </div>
          `
        }
      ]
    },
    {
      title: "Passo 2: Configurar Firewall Corretamente",
      content: `<p class="mb-4">O firewall é uma barreira que controla o tráfego de rede entrando e saindo do seu computador. O Windows inclui um firewall embutido que geralmente é suficiente para a maioria dos usuários.</p>`,
      subsections: [
        {
          subtitle: "Verificar se o Firewall Está Ativo",
          content: `
            <ol class="space-y-2 text-gray-300 list-decimal list-inside ml-4 mb-4">
              <li>Vá em Configurações &gt; Rede e Internet &gt; Firewall do Windows</li>
              <li>Verifique se o firewall está ativado para rede privada e pública</li>
              <li>Se não estiver ativo, ative-o imediatamente</li>
            </ol>
          `
        },
        {
          subtitle: "Configurar Exceções do Firewall",
          content: `
            <p class="mb-4">Às vezes, programas legítimos precisam de permissão no firewall. Ao permitir um programa, faça-o apenas se você confiar completamente na fonte:</p>
            <ol class="space-y-2 text-gray-300 list-decimal list-inside ml-4 mb-4">
              <li>Vá em Configurações &gt; Firewall do Windows Defender &gt; Permitir um aplicativo pelo firewall</li>
              <li>Revise a lista de programas permitidos</li>
              <li>Remova permissões de programas que você não reconhece ou não usa mais</li>
              <li>Se precisar permitir um novo programa, adicione apenas após verificar que é confiável</li>
            </ol>
          `
        }
      ]
    },
    {
      title: "Passo 3: Criar e Gerenciar Senhas Seguras",
      content: `<p class="mb-4">Senhas fracas são uma das principais vulnerabilidades de segurança. Muitos ataques acontecem porque pessoas usam senhas fáceis de adivinhar ou repetem a mesma senha em múltiplos sites.</p>`,
      subsections: [
        {
          subtitle: "Características de Uma Senha Forte",
          content: `
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4 mb-4">
              <li><strong class="text-white">Mínimo de 12 caracteres:</strong> Quanto mais longa, mais segura</li>
              <li><strong class="text-white">Combinação de tipos:</strong> Letras maiúsculas, minúsculas, números e símbolos especiais</li>
              <li><strong class="text-white">Não usar palavras do dicionário:</strong> Evite palavras comuns que podem ser facilmente adivinhadas</li>
              <li><strong class="text-white">Não usar informações pessoais:</strong> Nomes, datas de nascimento, números de telefone são fáceis de descobrir</li>
              <li><strong class="text-white">Única para cada conta:</strong> Nunca reutilize senhas entre diferentes sites ou serviços</li>
            </ul>
          `
        },
        {
          subtitle: "Gerenciadores de Senhas",
          content: `
            <p class="mb-4">Lembrar de senhas complexas e únicas para cada site é praticamente impossível sem ajuda. Gerenciadores de senhas resolvem esse problema:</p>
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4 mb-4">
              <li><strong class="text-white">LastPass, 1Password, Bitwarden:</strong> Gerenciadores populares e seguros</li>
              <li><strong class="text-white">Geram senhas fortes automaticamente:</strong> Criam senhas complexas e únicas para cada site</li>
              <li><strong class="text-white">Preenchem automaticamente:</strong> Preenchem login e senha automaticamente quando você acessa sites</li>
              <li><strong class="text-white">Criptografia forte:</strong> Suas senhas são armazenadas de forma criptografada e segura</li>
              <li><strong class="text-white">Acesso multiplataforma:</strong> Funcionam em computador, celular e tablet</li>
            </ul>
          `
        },
        {
          subtitle: "Autenticação de Dois Fatores (2FA)",
          content: `
            <p class="mb-4">Mesmo com senha forte, adicione uma camada extra de segurança usando autenticação de dois fatores:</p>
            <ol class="space-y-2 text-gray-300 list-decimal list-inside ml-4 mb-4">
              <li>Ative 2FA em todas as contas importantes (e-mail, banco, redes sociais)</li>
              <li>Use aplicativos autenticadores (Google Authenticator, Microsoft Authenticator) em vez de SMS quando possível</li>
              <li>SMS é melhor que nada, mas aplicativos são mais seguros</li>
            </ol>
          `
        }
      ]
    },
    {
      title: "Passo 4: Navegação Segura na Internet",
      content: "",
      subsections: [
        {
          subtitle: "Reconhecer Sites Seguros",
          content: `
            <p class="mb-4">Ao fazer compras ou inserir informações sensíveis online:</p>
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4 mb-4">
              <li>Verifique se o site começa com <code class="bg-[#2a2a2e] px-2 py-1 rounded">https://</code> (não apenas http://)</li>
              <li>Procure pelo ícone de cadeado na barra de endereços do navegador</li>
              <li>Verifique o certificado SSL clicando no cadeado</li>
              <li>Evite sites com avisos de segurança do navegador</li>
              <li>Desconfie de URLs estranhas ou com erros de digitação</li>
            </ul>
          `
        },
        {
          subtitle: "Proteção Contra Phishing",
          content: `
            <p class="mb-4">Phishing são tentativas de enganar você para revelar informações pessoais através de sites ou e-mails falsos:</p>
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4 mb-4">
              <li>Nunca clique em links suspeitos recebidos por e-mail, especialmente se pedirem informações pessoais</li>
              <li>Verifique sempre o remetente do e-mail antes de clicar em links</li>
              <li>Bancos e empresas legítimas nunca pedem senhas ou dados por e-mail</li>
              <li>Ao acessar sites importantes, digite o endereço manualmente ou use favoritos</li>
              <li>Use extensões de navegador que bloqueiam sites de phishing</li>
            </ul>
          `
        },
        {
          subtitle: "Atualizar Navegadores Regularmente",
          content: `
            <p class="mb-4">Navegadores desatualizados têm vulnerabilidades de segurança conhecidas. Sempre mantenha seu navegador atualizado:</p>
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4 mb-4">
              <li>Chrome, Firefox e Edge se atualizam automaticamente, mas verifique periodicamente</li>
              <li>Ative atualizações automáticas quando disponível</li>
              <li>Use sempre a versão mais recente do navegador</li>
            </ul>
          `
        }
      ]
    },
    {
      title: "Passo 5: Proteção Contra Malware e Ransomware",
      content: "",
      subsections: [
        {
          subtitle: "O Que É Malware?",
          content: `
            <p class="mb-4">Malware (software malicioso) inclui vírus, trojans, spyware, adware e ransomware. Todos podem causar danos significativos ao seu computador e dados.</p>
          `
        },
        {
          subtitle: "Proteção Contra Ransomware",
          content: `
            <p class="mb-4">Ransomware é uma ameaça particularmente grave que criptografa seus arquivos e exige pagamento para descriptografar:</p>
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4 mb-4">
              <li><strong class="text-white">Backup regular:</strong> A melhor defesa contra ransomware é ter backups atualizados</li>
              <li><strong class="text-white">Não pagar resgate:</strong> Pagar não garante recuperação e financia mais ataques</li>
              <li><strong class="text-white">Antivírus atualizado:</strong> Antivírus modernos têm proteção específica contra ransomware</li>
              <li><strong class="text-white">Cuidado com anexos:</strong> Nunca abra anexos de e-mails suspeitos</li>
              <li><strong class="text-white">Controle de acesso:</strong> Use contas de usuário limitadas para uso diário, não administrador</li>
            </ul>
          `
        },
        {
          subtitle: "Sintomas de Infecção por Malware",
          content: `
            <p class="mb-4">Fique atento a estes sinais que podem indicar infecção:</p>
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4 mb-4">
              <li>Computador mais lento do que o normal</li>
              <li>Pop-ups e anúncios aparecendo constantemente</li>
              <li>Página inicial do navegador mudou sem sua autorização</li>
              <li>Novos programas instalados que você não reconhece</li>
              <li>Uso excessivo de CPU ou memória</li>
              <li>Arquivos desaparecendo ou sendo alterados</li>
              <li>Mensagens de erro estranhas</li>
            </ul>
          `
        }
      ]
    },
    {
      title: "Passo 6: Atualizações de Segurança",
      content: `<p class="mb-4">Fabricantes de software frequentemente descobrem vulnerabilidades de segurança e lançam correções através de atualizações. Manter tudo atualizado é crucial:</p>`,
      subsections: [
        {
          subtitle: "Atualizações do Windows",
          content: `
            <ol class="space-y-2 text-gray-300 list-decimal list-inside ml-4 mb-4">
              <li>Configure o Windows Update para instalar atualizações automaticamente</li>
              <li>Verifique periodicamente se há atualizações pendentes</li>
              <li>Não adie atualizações de segurança por muito tempo</li>
              <li>Reinicie o computador quando solicitado após atualizações importantes</li>
            </ol>
          `
        },
        {
          subtitle: "Atualizar Programas",
          content: `
            <p class="mb-4">Programas desatualizados também podem ter vulnerabilidades:</p>
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4 mb-4">
              <li>Configure programas para atualizar automaticamente quando possível</li>
              <li>Regularmente verifique atualizações de programas críticos (navegadores, Office, etc.)</li>
              <li>Desinstale programas que você não usa mais</li>
              <li>Use ferramentas como Chocolatey ou Ninite para gerenciar atualizações em massa</li>
            </ul>
          `
        }
      ]
    },
    {
      title: "Conclusão",
      content: `
        <p class="mb-4">A segurança digital é um processo contínuo, não um evento único. Implementando as práticas descritas neste guia, você cria múltiplas camadas de proteção que trabalham juntas para manter seu computador e dados seguros.</p>
        <p class="mb-4">Lembre-se: nenhum sistema é 100% seguro, mas seguindo estas diretrizes, você reduz drasticamente o risco de ser vítima de ataques cibernéticos. A segurança requer vigilância constante e adaptação a novas ameaças que surgem regularmente.</p>
      `,
      subsections: [
        {
          subtitle: "Ajuda Profissional Disponível",
          content: `
            <div class="bg-[#171313] p-6 rounded-lg border border-[#31A8FF]/30 mt-6">
              <p class="text-white font-semibold mb-3 text-lg">Ajuda Profissional Disponível</p>
              <p class="text-gray-300 leading-relaxed mb-4">
                Se seu computador já está infectado ou você precisa de ajuda para implementar essas medidas de segurança, nossa equipe pode ajudar remotamente de forma segura e eficiente.
              </p>
              <div class="flex flex-col sm:flex-row gap-4">
                <a 
                  href="/todos-os-servicos"
                  class="px-6 py-3 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300 text-center inline-block"
                >
                  Ver Serviços de Segurança
                </a>
                <a 
                  href="https://wa.me/5511996716235?text=Olá!%20Preciso%20de%20ajuda%20com%20segurança%20digital."
                  target="_blank"
                  rel="noopener noreferrer"
                  class="px-6 py-3 border-2 border-[#31A8FF] text-[#31A8FF] font-bold rounded-xl hover:bg-[#31A8FF] hover:text-white transition-all duration-300 text-center inline-block"
                >
                  Falar com Especialista
                </a>
              </div>
            </div>
          `
        }
      ]
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/backup-dados",
      title: "Como Fazer Backup dos Seus Dados",
      description: "Proteja seus dados com backups eficazes e seguros."
    },
    {
      href: "/guias/resolver-erros-windows",
      title: "Como Resolver Erros Comuns do Windows",
      description: "Aprenda a diagnosticar e resolver problemas do sistema."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="18 minutos"
      difficultyLevel="Básico"
      contentSections={contentSections}
      relatedGuides={relatedGuides}
    />
  );
}

