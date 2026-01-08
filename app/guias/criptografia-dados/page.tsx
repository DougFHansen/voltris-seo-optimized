import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Guia Completo de Criptografia de Dados Pessoais";
const description = "Aprenda a criptografar seus dados pessoais para proteção máxima contra vazamentos e acessos não autorizados. Técnicas profissionais para Windows, macOS e Linux.";
const keywords = [
  "criptografia de dados",
  "proteção de arquivos",
  "encryptar documentos",
  "segurança de dados pessoais",
  "veracrypt tutorial",
  "bitlocker configuração"
];

export const metadata: Metadata = createGuideMetadata(title, description, keywords);

export default function CriptografiaDadosGuide() {
  const contentSections = [
    {
      title: "Fundamentos da Criptografia de Dados",
      content: `
        <p class="mb-4">A criptografia é o processo de codificar informações de forma que apenas pessoas autorizadas possam acessá-las. 
        No contexto de dados pessoais, isso significa transformar seus arquivos em formato ilegível sem a chave de decodificação correta.</p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div class="bg-[#171313] p-4 rounded-lg border border-[#31A8FF]/30">
            <h3 class="text-white font-semibold mb-2">Tipos de Criptografia</h3>
            <ul class="text-gray-300 text-sm space-y-1">
              <li>✓ Criptografia Simétrica (mesma chave)</li>
              <li>✓ Criptografia Assimétrica (chaves pública/privada)</li>
              <li>✓ Criptografia Híbrida (combinação)</li>
            </ul>
          </div>
          <div class="bg-[#171313] p-4 rounded-lg border border-[#FF4B6B]/30">
            <h3 class="text-white font-semibold mb-2">Níveis de Proteção</h3>
            <ul class="text-gray-300 text-sm space-y-1">
              <li>🔒 Nível Básico: Senhas simples</li>
              <li>🔐 Nível Intermediário: Criptografia de arquivos</li>
              <li>🛡️ Nível Avançado: Criptografia de disco completo</li>
            </ul>
          </div>
        </div>
        
        <div class="bg-[#171313] p-4 rounded-lg border border-[#8B31FF]/30 mt-4">
          <p class="text-white font-semibold mb-2">💡 Importante:</p>
          <p class="text-gray-300">Nunca armazene a chave de criptografia junto com os dados criptografados. 
          Use gerenciadores de senhas seguros e considere backup offline das chaves críticas.</p>
        </div>
      `,
      subsections: [
        {
          subtitle: "Algoritmos de Criptografia Recomendados",
          content: `
            <p class="mb-3">Os algoritmos mais seguros e amplamente utilizados atualmente:</p>
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
              <li><strong class="text-white">AES-256</strong>: Padrão militar, usado pelo governo dos EUA</li>
              <li><strong class="text-white">Twofish</strong>: Sucessor do Blowfish, muito seguro</li>
              <li><strong class="text-white">ChaCha20</strong>: Moderno e eficiente em processadores móveis</li>
              <li><strong class="text-white">RSA-4096</strong>: Para criptografia assimétrica e assinaturas digitais</li>
            </ul>
          `
        },
        {
          subtitle: "Quando Aplicar Criptografia",
          content: `
            <p class="mb-3">Cenários que exigem criptografia obrigatória:</p>
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
              <li>Documentos financeiros e fiscais</li>
              <li>Dados médicos e de saúde</li>
              <li>Informações de clientes e fornecedores</li>
              <li>Projetos empresariais confidenciais</li>
              <li>Fotos e vídeos pessoais sensíveis</li>
            </ul>
          `
        }
      ]
    },
    {
      title: "Criptografia de Arquivos Individuais",
      content: `
        <p class="mb-4">Ideal para proteger documentos específicos sem impactar o desempenho do sistema. 
        Perfeito para arquivos sensíveis que você acessa ocasionalmente.</p>
      `,
      subsections: [
        {
          subtitle: "7-Zip com Criptografia AES-256",
          content: `
            <p class="mb-3">Método gratuito e eficaz para compactação e criptografia:</p>
            <ol class="space-y-2 text-gray-300 list-decimal list-inside ml-4">
              <li>Baixe e instale 7-Zip (7-zip.org)</li>
              <li>Selecione os arquivos a serem criptografados</li>
              <li>Clique com botão direito &gt; 7-Zip &gt; Adicionar para arquivo</li>
              <li>Escolha formato .7z (melhor compressão e segurança)</li>
              <li>Na seção 'Criptografia', selecione AES-256</li>
              <li>Digite e confirme uma senha forte</li>
              <li>Clique OK para criar o arquivo criptografado</li>
            </ol>
          `
        },
        {
          subtitle: "VeraCrypt para Containers Criptografados",
          content: `
            <p class="mb-3">Cria volumes virtuais criptografados que funcionam como unidades separadas:</p>
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
              <li>Faça download do VeraCrypt (veracrypt.fr)</li>
              <li>Crie um container de tamanho adequado (ex: 10GB)</li>
              <li>Escolha algoritmo AES-Twofish-Serpent (cascade)</li>
              <li>Defina senha mestra forte (mínimo 20 caracteres)</li>
              <li>Monte o volume como uma nova unidade no Windows Explorer</li>
              <li>Use normalmente como qualquer outra pasta</li>
            </ul>
          `
        }
      ]
    },
    {
      title: "Criptografia de Disco Completo",
      content: `
        <p class="mb-4">Protege todo o conteúdo do disco rígido, incluindo sistema operacional. 
        Ideal para laptops, dispositivos móveis e computadores de uso pessoal.</p>
      `,
      subsections: [
        {
          subtitle: "BitLocker (Windows Pro/Enterprise)",
          content: `
            <p class="mb-3">Solução nativa da Microsoft com integração profunda:</p>
            <ol class="space-y-2 text-gray-300 list-decimal list-inside ml-4">
              <li>Verifique se seu Windows suporta BitLocker (Pro ou Enterprise)</li>
              <li>Vá em Painel de Controle &gt; Sistema e Segurança &gt; BitLocker</li>
              <li>Selecione a unidade a ser criptografada</li>
              <li>Escolha método de desbloqueio (senha, smart card, TPM)</li>
              <li>Configure backup da chave de recuperação</li>
              <li>Inicie a criptografia (pode levar horas dependendo do tamanho)</li>
            </ol>
          `
        },
        {
          subtitle: "FileVault (macOS)",
          content: `
            <p class="mb-3">Criptografia nativa do macOS com desempenho otimizado:</p>
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
              <li>Acesse Preferências do Sistema &gt; Segurança e Privacidade</li>
              <li>Clique na aba FileVault</li>
              <li>Clique em Ativar FileVault</li>
              <li>Escolha método de desbloqueio (conta iCloud ou chave de recuperação)</li>
              <li>Siga as instruções para reiniciar e completar a criptografia</li>
            </ul>
          `
        }
      ]
    },
    {
      title: "Gerenciamento de Chaves e Senhas",
      content: `
        <p class="mb-4">A segurança da criptografia depende tanto do algoritmo quanto do gerenciamento adequado das chaves de acesso.</p>
      `,
      subsections: [
        {
          subtitle: "Boas Práticas para Senhas",
          content: `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-[#171313] p-3 rounded border border-[#31A8FF]/20">
                <h4 class="text-white font-semibold mb-2">✓ FAÇA</h4>
                <ul class="text-gray-300 text-xs space-y-1">
                  <li>Use mínimo 16 caracteres</li>
                  <li>Combine maiúsculas, minúsculas, números e símbolos</li>
                  <li>Use frases memoráveis (passphrases)</li>
                  <li>Armazene em gerenciador de senhas</li>
                </ul>
              </div>
              <div class="bg-[#171313] p-3 rounded border border-[#FF4B6B]/20">
                <h4 class="text-white font-semibold mb-2">✗ NÃO FAÇA</h4>
                <ul class="text-gray-300 text-xs space-y-1">
                  <li>Não reutilize senhas</li>
                  <li>Não use informações pessoais óbvias</li>
                  <li>Não compartilhe senhas por email/instant messaging</li>
                  <li>Não anote senhas em papel visível</li>
                </ul>
              </div>
            </div>
          `
        },
        {
          subtitle: "Backup de Chaves de Recuperação",
          content: `
            <p class="mb-3">Sempre faça backup seguro das chaves de recuperação:</p>
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
              <li>Imprima chave de recuperação e guarde em cofre físico</li>
              <li>Armazene cópia em conta de armazenamento seguro (LastPass, 1Password)</li>
              <li>Compartilhe com pessoa de confiança (herdeiro digital)</li>
              <li>Use serviço de depósito digital notarial se disponível</li>
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
      href: "/guias/firewall-configuracao",
      title: "Configuração de Firewall",
      description: "Proteção de rede avançada para Windows"
    },
    {
      href: "/guias/backup-dados",
      title: "Backup de Dados",
      description: "Estratégias completas de proteção de informações"
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="75 minutos"
      difficultyLevel="Intermediário"
      contentSections={contentSections}
      relatedGuides={relatedGuides}
    />
  );
}