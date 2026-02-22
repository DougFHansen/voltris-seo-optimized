import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'backup-dados',
  title: "Estratégia de Backup 3-2-1: O Guia Definitivo de Proteção de Dados (2026)",
  description: "Não espere perder tudo para aprender. Domine a Regra 3-2-1, aprenda a fazer Imagem de Sistema com Veeam/Hasleo e proteja-se contra Ransomware e falhas de hardware.",
  category: 'seguranca',
  difficulty: 'Intermediário',
  time: '50 min'
};

const title = "Estratégia de Backup 3-2-1: O Guia Definitivo de Proteção de Dados (2026)";
const description = "Seu computador contém sua vida: fotos, trabalho, projetos. Um raio ou um clique errado pode apagar tudo para sempre. Aprenda a estratégia profissional de backup que bancos usam, adaptada para você.";

const keywords = [
  'como fazer backup completo pc windows 11 2026',
  'regra backup 3-2-1 explicacao simples',
  'melhor software backup gratuito 2026',
  'hasleo backup suite vs macrium reflect free',
  'veeam agent for windows tutorial',
  'imagem de sistema vs backup de arquivos diferenca',
  'protecao ransomware backup offline'
];

export const metadata: Metadata = createGuideMetadata('backup-dados', title, description, keywords);

export default function DataBackupGuide() {
  const summaryTable = [
    { label: "A Regra de Ouro", value: "3-2-1 (3 Cópias, 2 Locais, 1 Offsite)" },
    { label: "Melhor Software Grátis", value: "Hasleo Backup Suite / Veeam Agent" },
    { label: "Tipo Recomendado", value: "Imagem de Sistema Completa" },
    { label: "Mídia Física", value: "HD Externo USB (Desconectado)" },
    { label: "Nuvem (Offsite)", value: "OneDrive / Backblaze" },
    { label: "Frequência", value: "Semanal (Incremental)" }
  ];

  const contentSections = [
    {
      title: "O Que é a Regra 3-2-1? (O Padrão da Indústria)",
      content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Não invente moda. A regra 3-2-1 é o padrão mundial de segurança de dados porque cobre todas as falhas possíveis (roubo, incêndio, vírus, falha mecânica).
        </p>
        
        <div class="space-y-4">
            <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
                <h3 class="text-blue-400 font-bold mb-2">3 Cópias dos Dados</h3>
                <p class="text-sm text-gray-300">
                    Você precisa ter o arquivo original + 2 cópias. Se tiver só uma cópia, não é backup, é esperança.
                </p>
            </div>
            
            <div class="bg-purple-900/10 p-5 rounded-xl border border-purple-500/20">
                <h3 class="text-purple-400 font-bold mb-2">2 Mídias Diferentes</h3>
                <p class="text-sm text-gray-300">
                    Não adianta ter 3 cópias no mesmo HD. Se o HD queimar, todas morrem.
                    <br/>Mídia 1: SSD Interno do PC (Original).
                    <br/>Mídia 2: HD Externo USB ou NAS (Cópia Local).
                </p>
            </div>

            <div class="bg-green-900/10 p-5 rounded-xl border border-green-500/20">
                <h3 class="text-green-400 font-bold mb-2">1 Cópia Off-site (Fora de Casa)</h3>
                <p class="text-sm text-gray-300">
                    Se sua casa pegar fogo ou entrarem ladrões e levarem PC e HD Externo, você perdeu tudo?
                    <br/>A cópia Off-site (geralmente Nuvem) te salva de desastres físicos locais.
                </p>
            </div>
        </div>
      `
    },
    {
      title: "Imagem de Sistema vs Backup de Arquivos",
      content: `
        <p class="mb-4 text-gray-300">
          <strong>Backup de Arquivos:</strong> Copia apenas "Meus Documentos", fotos e planilhas. Se o Windows quebrar, você reinstala o Windows do zero, reinstala todos os programas, configura tudo de novo e depois copia os arquivos. (Trabalhoso).
          <br/><br/>
          <strong>Imagem de Sistema (Block Level Backup):</strong> Copia o DISCO INTEIRO, bit a bit. Salva o Windows, os programas instalados, os drivers, o papel de parede, os atalhos... Se o HD queimar, você compra um novo, restaura a imagem e o PC volta EXATAMENTE como estava em 30 minutos. <strong>Esta é a escolha profissional.</strong>
        </p>
      `
    },
    {
      title: "Ferramentas Gratuitas Recomendadas (2026)",
      content: `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div class="bg-gray-800/50 p-4 rounded-lg border border-teal-500/30">
                <h3 class="font-bold text-white mb-2">Hasleo Backup Suite (Grátis)</h3>
                <p class="text-sm text-gray-300">
                    O sucessor espiritual do Macrium Reflect Free (que foi descontinuado). Interface limpa, suporta backup incremental, diferencial, clonagem de disco e criação de pendrive de boot de emergência (WinPE). Totalmente gratuito e sem anúncios.
                </p>
            </div>
            <div class="bg-gray-800/50 p-4 rounded-lg border border-green-500/30">
                <h3 class="font-bold text-white mb-2">Veeam Agent for Windows (Free)</h3>
                <p class="text-sm text-gray-300">
                    Padrão corporativo. Robusto, extremamente confiável, mas com interface mais complexa. Se você quer o software que protege servidores de bancos, use o Veeam.
                </p>
            </div>
        </div>
      `
    }
  ];

  const advancedContentSections = [
    {
      title: "O Protocolo 'Cold Storage' (Contra Ransomware)",
      content: `
        <h4 class="text-white font-bold mb-3">O Vírus não ataca o que não está conectado</h4>
        <p class="mb-4 text-gray-300">
            Ransomwares modernos infectam seu PC e procuram por qualquer driver conectado (pendrive, HD externo, rede) para criptografar também.
            <br/><strong>A Defesa:</strong> Faça o backup no HD Externo. Quando terminar, EJETAR e DESCONECTAR o cabo USB. Guarde o HD na gaveta. Se um vírus pegar seu PC amanhã, o HD na gaveta está salvo. Isso é "Cold Storage" (Armazenamento Frio).
        </p>
      `
    },
    {
      title: "Rotina de Teste de Restauração (Drill)",
      content: `
        <p class="mb-4 text-gray-300 text-lg font-bold text-red-400">
            Um backup que nunca foi testado NÃO EXISTE.
        </p>
        <p class="text-gray-300">
            Muitos arquivos de backup se corrompem com o tempo sem avisar.
            <br/><strong>A cada 3 a 6 meses:</strong>
            <br/>1. Tente abrir o arquivo de imagem do backup.
            <br/>2. Tente extrair um arquivo aleatório de dentro dele.
            <br/>3. Se possível, use uma Máquina Virtual para tentar restaurar a imagem completa e ver se o sistema boota.
        </p>
      `
    }
  ];

  const additionalContentSections = [
    {
      title: "Clonagem de Disco: Upgrade de SSD/HD",
      content: `
        <h4 class="text-white font-bold mb-3">Quando usar 'Clone' em vez de 'Backup'?</h4>
        <p class="mb-4 text-gray-300">
            Quando você comprou um SSD NVMe novo e maior e quer passar tudo do SSD antigo para ele.
            <br/>Use o recurso "System Clone" ou "Disk Clone" do Hasleo/Macrium.
            <br/>Ele copia tudo em tempo real. Depois, desligue o PC, tire o SSD velho, coloque o novo e pronto. O Windows nem percebe que mudou de casa.
        </p>
      `
    }
  ];

  const faqItems = [
    {
      question: "Qual tamanho de HD Externo comprar?",
      answer: "A regra é: Pelo menos 2x o tamanho do seu disco interno. Se você tem um SSD de 1TB, compre um HD Externo de 2TB ou 4TB. Isso permite guardar várias versões do histórico (ex: backup de hoje, de semana passada e do mês passado)."
    },
    {
      question: "O OneDrive serve como Backup de Imagem?",
      answer: "Não. O OneDrive/Google Drive salvam ARQUIVOS soltos. Eles não salvam o Windows, os programas instalados e as configurações do sistema. Se o Windows quebrar tela azul, a nuvem não arruma."
    },
    {
      question: "HD ou SSD para Backup Externo?",
      answer: "HD Mecânico (HDD) é mais barato e melhor para arquivamento a longo prazo (anos desligado), pois SSDs podem perder carga elétrica das células se ficarem muitos anos sem energia. Para backup diário, SSD é mais rápido, mas bem mais caro por TB."
    }
  ];

  const externalReferences = [
    { name: "Hasleo Backup Suite Free (Download)", url: "https://www.easyuefi.com/backup-software/backup-suite-free.html" },
    { name: "Veeam Agent for Windows Free", url: "https://www.veeam.com/agent-for-windows-community-edition.html" },
    { name: "Rescuezilla (Open Source Clone)", url: "https://rescuezilla.com/" }
  ];

  const relatedGuides = [
    {
      href: "/guias/backup-automatico-nuvem",
      title: "Backup na Nuvem",
      description: "Complemente seu backup local com a nuvem."
    },
    {
      href: "/guias/protecao-ransomware",
      title: "Segurança Ransomware",
      description: "Como evitar ser encriptado."
    },
    {
      href: "/guias/verificar-saude-hd-ssd-crystaldiskinfo",
      title: "Saúde do Disco",
      description: "Monitore se seu HD está morrendo."
    },
    {
      href: "/guias/recuperacao-dados-hd-corrompido",
      title: "Recuperação de Desastre",
      description: "Tente salvar dados sem backup."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="50 min"
      difficultyLevel="Intermediário"
      author="Equipe de Segurança Voltris"
      lastUpdated="2026-02-06"
      contentSections={contentSections}
      advancedContentSections={advancedContentSections}
      additionalContentSections={additionalContentSections}
      summaryTable={summaryTable}
      faqItems={faqItems}
      externalReferences={externalReferences}
      relatedGuides={relatedGuides}
    />
  );
}
