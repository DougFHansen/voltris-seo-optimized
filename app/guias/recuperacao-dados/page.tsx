import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = 'Recuperação de Dados e Forense Digital';
const description = 'Técnicas profissionais para recuperação de dados perdidos, análise forense digital e preservação de evidências eletrônicas. Soluções para HDD, SSD, pendrives e mídias danificadas.';
const keywords = [
  'recuperação dados',
  'forense digital',
  'dados perdidos',
  'recuperação SSD',
  'recuperação HDD',
  'análise forense',
  'evidências digitais',
  'softwares recuperação',
  'backup forense',
  'preservação dados',
  'formatação acidental',
  'deleção arquivos'
];

export const metadata: Metadata = createGuideMetadata('recuperacao-dados', title, description, keywords);

export default function RecuperacaoDadosGuide() {
  const contentSections = [
    {
      title: "Quando a Recuperação de Dados é Possível",
      content: `
        <p class="mb-4">A recuperação de dados depende fundamentalmente de NÃO SOBRESCREVER os dados originais. Quanto mais rápido você agir após a perda de dados, maiores são as chances de sucesso.</p>
        <p class="mb-4">Situações recuperáveis:</p>
        <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4 mb-4">
          <li>Formatação acidental de partições</li>
          <li>Deleção de arquivos importantes</li>
          <li>Corrupção do sistema de arquivos</li>
          <li>Falhas de firmware em drives</li>
          <li>Danos físicos leves em mídias</li>
        </ul>
        <p>Situações críticas requerem profissionais especializados devido ao risco de perda permanente.</p>
      `,
      subsections: []
    },
    {
      title: "Primeiros Passos Após Perda de Dados",
      content: "",
      subsections: [
        {
          subtitle: "Parar Imediatamente o Uso do Dispositivo",
          content: `
            <p>Ações imediatas cruciais:</p>
            <ol class="space-y-2 text-gray-300 list-decimal list-inside ml-4 mb-4">
              <li><strong>NÃO ligue o computador</strong> se for HD interno</li>
              <li><strong>NÃO continue usando</strong> pendrives ou discos externos</li>
              <li><strong>NÃO instale novos softwares</strong> no dispositivo afetado</li>
              <li><strong>NÃO tente reparos DIY</strong> em drives danificados</li>
              <li><strong>Documente</strong> exatamente o que aconteceu</li>
            </ol>
            <div class="bg-[#171313] p-4 rounded-lg border border-[#FF4B6B]/30 mt-4">
              <p class="text-white font-semibold mb-2">⚠️ Atenção Crítica:</p>
              <p class="text-gray-300 leading-relaxed">
                Qualquer escrita no dispositivo pode tornar os dados irrecuperáveis permanentemente.
              </p>
            </div>
          `
        },
        {
          subtitle: "Documentação e Preservação de Evidências",
          content: `
            <p>Para casos forenses ou jurídicos:</p>
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4 mb-4">
              <li>Fotografe o dispositivo antes de qualquer manipulação</li>
              <li>Registre datas, horários e circunstâncias da perda</li>
              <li>Mantenha cadeia de custódia documentada</li>
              <li>Evite tocar em áreas sensíveis do dispositivo</li>
              <li>Use luvas antiestáticas se manipular hardware</li>
            </ul>
          `
        }
      ]
    },
    {
      title: "Ferramentas de Recuperação Software",
      content: "",
      subsections: [
        {
          subtitle: "Recuperação para Usuários Avançados",
          content: `
            <p>Softwares gratuitos e pagos eficazes:</p>
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4 mb-4">
              <li><strong>Recuva (Gratuito):</strong> Interface simples, bom para iniciantes</li>
              <li><strong>PhotoRec/TestDisk:</strong> Open-source, muito eficaz</li>
              <li><strong>R-Studio:</strong> Profissional, recuperação avançada</li>
              <li><strong>GetDataBack:</strong> Especializado em NTFS/FAT</li>
              <li><strong>DMDE:</strong> Recuperação complexa de sistemas danificados</li>
            </ul>
          `
        },
        {
          subtitle: "Processo de Recuperação Básico",
          content: `
            <ol class="space-y-2 text-gray-300 list-decimal list-inside ml-4 mb-4">
              <li>Baixe o software em um computador diferente</li>
              <li>Conecte o drive afetado como secundário (não boot)</li>
              <li>Execute varredura profunda do sistema de arquivos</li>
              <li>Pré-visualize arquivos antes da recuperação</li>
              <li>Salve os dados recuperados em outro dispositivo</li>
            </ol>
          `
        }
      ]
    },
    {
      title: "Casos Específicos de Recuperação",
      content: "",
      subsections: [
        {
          subtitle: "SSD e NVMe (Desafios Específicos)",
          content: `
            <p>Recuperação em unidades de estado sólido:</p>
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4 mb-4">
              <li>TRIM pode tornar dados permanentemente irrecuperáveis</li>
              <li>Controladores proprietários complicam análise</li>
              <li>Recuperação mais complexa devido à natureza flash</li>
              <li>Softwares especializados como R-Studio SSD</li>
              <li>Menor taxa de sucesso comparado a HDDs</li>
            </ul>
          `
        },
        {
          subtitle: "Drives Danificados Fisicamente",
          content: `
            <p>Sinais de falha mecânica:</p>
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4 mb-4">
              <li>Ruídos anormais (cliques, chiados)</li>
              <li>Temperaturas excessivas</li>
              <li>Vibrações ou movimentos estranhos</li>
              <li>Falhas intermitentes de leitura</li>
            </ul>
            <div class="bg-[#171313] p-4 rounded-lg border border-[#FF4B6B]/30 mt-4">
              <p class="text-white font-semibold mb-2">🛠️ Solução Profissional:</p>
              <p class="text-gray-300 leading-relaxed">
                Laboratórios especializados em clean rooms com equipamentos de microsoldagem e substituição de cabeças de leitura.
              </p>
            </div>
          `
        }
      ]
    },
    {
      title: "Forense Digital e Análise Profissional",
      content: `
        <p>Para casos complexos envolvendo:</p>
        <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4 mb-4">
          <li>Investigações jurídicas e policiais</li>
          <li>Violações de segurança corporativa</li>
          <li>Recuperação de evidências deletadas</li>
          <li>Análise de malware e intrusões</li>
          <li>Preservação de dados para litígios</li>
        </ul>
        <p>Profissionais certificados utilizam metodologias ISO/IEC 27037 e mantêm cadeia de custódia rigorosa.</p>
      `,
      subsections: []
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/backup-dados",
      title: "Como Fazer Backup dos Seus Dados",
      description: "Métodos eficazes para proteger seus dados importantes preventivamente."
    },
    {
      href: "/guias/diagnostico-hardware",
      title: "Diagnóstico de Falhas de Hardware",
      description: "Identifique problemas físicos em componentes do seu sistema."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="35 minutos"
      difficultyLevel="Avançado"
      contentSections={contentSections}
      relatedGuides={relatedGuides}
      author="Equipe Técnica Voltris"
      lastUpdated="Janeiro 2025"
    />
  );
}