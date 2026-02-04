import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Proteção contra Ransomware: Como blindar seu PC em 2026";
const description = "Seus arquivos foram sequestrados? Aprenda como se proteger de Ransomwares, ativar a proteção nativa do Windows 11 e fazer backups seguros em 2026.";
const keywords = [
  'proteção contra ransomware windows 11 2026',
  'como recuperar arquivos criptografados virus guia',
  'ativar acesso a pastas controlado windows 11 tutorial',
  'melhor antivirus contra ransomware 2026 guia',
  'backup anti-ransomware regra 3-2-1 tutorial 2026'
];

export const metadata: Metadata = createGuideMetadata('protecao-ransomware', title, description, keywords);

export default function RansomwareProtectionGuide() {
  const summaryTable = [
    { label: "O que é", value: "Vírus que sequestra (criptografa) seus arquivos" },
    { label: "Solução Nativa", value: "Acesso a Pastas Controlado (Windows Defender)" },
    { label: "Única Salvação", value: "Backup Offline (Desconectado da rede)" },
    { label: "Dificuldade", value: "Médio" }
  ];

  const contentSections = [
    {
      title: "O crime digital mais lucrativo de 2026",
      content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O **Ransomware** é o pesadelo de qualquer usuário ou empresa. Em 2026, esses vírus evoluíram para agir de forma silenciosa, criptografando seus documentos e fotos em segundo plano antes de exigir um resgate em Criptomoedas. Pagar o resgate **nunca** é garantido: muitas vezes os criminosos pegam o dinheiro e desaparecem. A única proteção real é a prevenção proativa.
        </p>
      `
    },
    {
      title: "1. Ativando a Proteção Nativa do Windows 11",
      content: `
        <p class="mb-4 text-gray-300">O Windows tem um escudo potente que vem desligado por padrão:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Vá em Segurança do Windows > Proteção contra vírus e ameaças.</li>
            <li>Role até 'Proteção contra Ransomware' e clique em <strong>Gerenciar proteção</strong>.</li>
            <li>Ative o <strong>'Acesso a pastas controlado'</strong>.</li>
            <li><strong>Como funciona:</strong> Se um programa desconhecido (o vírus) tentar alterar arquivos na sua pasta Documentos ou Imagens, o Windows bloqueará na hora e te avisará. Você precisará dar permissão manual para cada programa novo.</li>
        </ol>
      `
    },
    {
      title: "2. A Regra do Backup Offline",
      content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Por que a nuvem não basta?</h4>
            <p class="text-sm text-gray-300">
                Muitos Ransomwares de 2026 conseguem infectar também o seu <strong>Google Drive ou OneDrive</strong> se eles estiverem sincronizados no PC. <br/><br/>
                A solução é o <strong>Backup Frio (Cold Backup)</strong>: Tenha um HD externo que você conecta apenas para copiar os arquivos e desconecta logo em seguida. Um vírus não pode criptografar o que não está plugado no computador.
            </p>
        </div>
      `
    },
    {
      title: "3. O que fazer se eu for infectado?",
      content: `
        <p class="mb-4 text-gray-300">
            <strong>Mantenha a calma:</strong> 
            <br/><br/>1. Desconecte o PC da internet imediatamente para impedir que o vírus se espalhe para outros computadores da casa. <br/>
            2. Não tente renomear os arquivos. <br/>
            3. Procure por ferramentas de descriptografia gratuitas em sites confiáveis como o <strong>'No More Ransom'</strong> (projeto da Europol). Lá existem chaves para centenas de tipos de vírus conhecidos. Se o seu vírus for novo, infelizmente, a única opção segura é formatar o PC e restaurar o backup offline.
        </p>
      `
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/remocao-virus-malware",
      title: "Remover Malware",
      description: "Dicas para limpar o sistema após a infecção."
    },
    {
      href: "/guias/backup-automatico-nuvem",
      title: "Guia de Backup",
      description: "Como configurar cópias de segurança automáticas."
    },
    {
      href: "/guias/identificacao-phishing",
      title: "Identificar Phishing",
      description: "Aprenda como esses vírus entram no seu PC."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="25 min"
      difficultyLevel="Médio"
      contentSections={contentSections}
      summaryTable={summaryTable}
      relatedGuides={relatedGuides}
    />
  );
}