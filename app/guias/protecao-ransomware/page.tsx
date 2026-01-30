import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Guia Completo de Proteção contra Ransomware";
const description = "Aprenda a proteger seu sistema contra ransomware com estratégias preventivas, detecção precoce e recuperação de dados. Técnicas profissionais para usuários e empresas.";
const keywords = [
  "proteção ransomware",
  "defesa contra malware",
  "recuperação de arquivos criptografados",
  "segurança contra criptomineração",
  "backup anti-ransomware"
];

export const metadata: Metadata = createGuideMetadata('protecao-ransomware', title, description, keywords);

export default function ProtecaoRansomwareGuide() {
  const contentSections = [
    {
      title: "Entendendo o Ransomware e Seus Tipos",
      content: `
        <p class="mb-4">Ransomware é um tipo de malware que criptografa seus arquivos e exige pagamento para liberá-los. 
        Existem diversas variantes com métodos de ataque e exigências diferentes.</p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div class="bg-[#171313] p-4 rounded-lg border border-[#FF4B6B]/30">
            <h3 class="text-white font-semibold mb-2">Tipos Comuns</h3>
            <ul class="text-gray-300 text-sm space-y-1">
              <li>🔒 Crypto Ransomware: Criptografa arquivos</li>
              <li>📁 Locker Ransomware: Bloqueia acesso ao sistema</li>
              <li>🌐 RaaS (Ransomware as a Service): Plataforma comercial</li>
              <li>📧 Email-based: Propagação por phishing</li>
            </ul>
          </div>
          <div class="bg-[#171313] p-4 rounded-lg border border-[#31A8FF]/30">
            <h3 class="text-white font-semibold mb-2">Métodos de Infecção</h3>
            <ul class="text-gray-300 text-sm space-y-1">
              <li>📧 Anexos de email maliciosos</li>
              <li>🔗 Links maliciosos em websites</li>
              <li>使用網路 infectada</li>
              <li>💾 Dispositivos USB infectados</li>
            </ul>
          </div>
        </div>
      `,
      subsections: [
        {
          subtitle: "Variantes Mais Perigosas Atuais",
          content: `
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
              <li><strong class="text-white">LockBit 3.0</strong>: Ataca empresas com double extortion</li>
              <li><strong class="text-white">BlackCat</strong>: Ransomware Rust-based altamente configurável</li>
              <li><strong class="text-white">Royal</strong>: Operação human-operated com acesso remoto</li>
              <li><strong class="text-white">Hive</strong>: Exige pagamentos em criptomoedas</li>
            </ul>
          `
        }
      ]
    },
    {
      title: "Estratégias Preventivas Profissionais",
      content: `
        <p class="mb-4">Prevenção é sempre melhor que cura. Implemente múltiplas camadas de proteção para minimizar riscos.</p>
      `,
      subsections: [
        {
          subtitle: "Configurações de Segurança do Sistema",
          content: `
            <ol class="space-y-2 text-gray-300 list-decimal list-inside ml-4">
              <li>Ative Controle de Conta de Usuário (UAC) no nível máximo</li>
              <li>Desative macros em documentos do Office por padrão</li>
              <li>Configure regras restritivas no firewall</li>
              <li>Habilite proteção contra exploits no Windows Security</li>
              <li>Desative execução de scripts PowerShell não assinados</li>
            </ol>
          `
        },
        {
          subtitle: "Proteção de Navegadores e Downloads",
          content: `
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
              <li>Use bloqueadores de anúncios e trackers</li>
              <li>Instale extensões de segurança (uBlock Origin, HTTPS Everywhere)</li>
              <li>Evite downloads de fontes não confiáveis</li>
              <li>Verifique hashes SHA256 de downloads importantes</li>
              <li>Mantenha navegadores sempre atualizados</li>
            </ul>
          `
        }
      ]
    },
    {
      title: "Soluções de Segurança Especializadas",
      content: `
        <p class="mb-4">Ferramentas dedicadas oferecem proteção específica contra ransomware e variantes conhecidas.</p>
      `,
      subsections: [
        {
          subtitle: "Antivirus com Proteção Anti-Ransomware",
          content: `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-[#171313] p-3 rounded border border-[#31A8FF]/20">
                <h4 class="text-white font-semibold mb-2">Soluções Gratuitas</h4>
                <ul class="text-gray-300 text-xs space-y-1">
                  <li>Malwarebytes Anti-Ransomware</li>
                  <li>Bitdefender Rescue CD</li>
                  <li>Kaspersky Rescue Disk</li>
                </ul>
              </div>
              <div class="bg-[#171313] p-3 rounded border border-[#FF4B6B]/20">
                <h4 class="text-white font-semibold mb-2">Soluções Pagas</h4>
                <ul class="text-gray-300 text-xs space-y-1">
                  <li>ESET Internet Security</li>
                  <li>Bitdefender Total Security</li>
                  <li>Kaspersky Total Security</li>
                </ul>
              </div>
            </div>
          `
        },
        {
          subtitle: "Monitoramento em Tempo Real",
          content: `
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
              <li>Configure alertas para modificação massiva de arquivos</li>
              <li>Monitore processos suspeitos com Process Monitor</li>
              <li>Use Sysinternals Suite para análise de comportamento</li>
              <li>Implemente honeypot folders para detecção precoce</li>
            </ul>
          `
        }
      ]
    },
    {
      title: "Plano de Resposta a Incidentes",
      content: `
        <p class="mb-4">Quando um ataque ocorre, ter um plano definido pode salvar seus dados e minimizar perdas.</p>
      `,
      subsections: [
        {
          subtitle: "Primeiros Passos Imediatos",
          content: `
            <ol class="space-y-2 text-gray-300 list-decimal list-inside ml-4">
              <li>Desconecte imediatamente da internet (Ethernet/WiFi)</li>
              <li>Desligue o computador para evitar criptografia adicional</li>
              <li>Identifique o tipo de ransomware usando ID Ransomware</li>
              <li>Documente todas as mensagens e extensões de arquivo</li>
              <li>Não pague o resgate imediatamente</li>
            </ol>
          `
        },
        {
          subtitle: "Recuperação de Dados",
          content: `
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
              <li>Restaure a partir de backups recentes e verificados</li>
              <li>Use decryptors gratuitos do No More Ransom Project</li>
              <li>Consulte especialistas em recuperação forense</li>
              <li>Analise Shadow Copy para versões anteriores</li>
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
      estimatedTime="60 minutos"
      difficultyLevel="Avançado"
      contentSections={contentSections}
      relatedGuides={relatedGuides}
    />
  );
}