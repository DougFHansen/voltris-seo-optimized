import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Recuperação de Dados: Como recuperar arquivos deletados (2026)";
const description = "Apagou algo importante sem querer? Aprenda as técnicas profissionais de recuperação de dados em HDs, SSDs e pendrives com o guia atualizado para 2026.";
const keywords = [
  'como recuperar arquivos deletados do pc 2026 tutorial',
  'melhor programa recuperar fotos apagadas hd guia',
  'recuperar dados de pendrive corrompido tutorial 2026',
  'recuperação de arquivos ssd windows 11 passo a passo',
  'software de recuperação de dados gratuito pro 2026'
];

export const metadata: Metadata = createGuideMetadata('recuperacao-dados', title, description, keywords);

export default function GeneralDataRecoveryGuide() {
  const summaryTable = [
    { label: "Software Grátis #1", value: "Recuva (Iniciante)" },
    { label: "Software Grátis #2", value: "PhotoRec (Profissional/Sem interface)" },
    { label: "Software Pago", value: "EaseUS Data Recovery / R-Studio" },
    { label: "Dificuldade", value: "Média" }
  ];

  const contentSections = [
    {
      title: "O dado nunca some de verdade (no início)",
      content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Quando você deleta um arquivo no Windows 11 em 2026, o sistema não apaga os dados físicos do disco. Ele apenas "esquece" onde o arquivo está e marca aquele espaço como "livre para ser usado". A recuperação é possível enquanto nenhum novo arquivo for escrito por cima daquele espaço. Por isso, a regra de ouro é: **PARE de usar o PC ou pendrive** no exato momento em que perceber a perda de dados.
        </p>
      `
    },
    {
      title: "1. Recuperação em HDDs e Pendrives",
      content: `
        <p class="mb-4 text-gray-300">Como os discos mecânicos e pendrives não limpam os dados sozinhos, a taxa de sucesso é alta:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Instale o <strong>Recuva</strong> em um disco diferente do que você quer recuperar.</li>
            <li>Selecione o modo 'Verificação Profunda' (Deep Scan).</li>
            <li>Aguarde a lista de arquivos aparecer. Verde significa recuperável, vermelho significa que o arquivo já foi parcialmente sobrescrito.</li>
            <li>Salve os arquivos recuperados sempre em um <strong>dispositivo externo</strong> (HD Externo ou Nuvem).</li>
        </ol>
      `
    },
    {
      title: "2. O desafio do SSD: O comando TRIM",
      content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Atenção com SSDs:</h4>
            <p class="text-sm text-gray-300">
                SSDs modernos de 2026 usam uma função chamada <strong>TRIM</strong>. Poucos minutos após você deletar um arquivo, o SSD faz a "limpeza física" das células de memória para manter a velocidade. Isso torna a recuperação em SSDs muito mais difícil do que em HDs. Se você apagou algo no SSD, desligue o PC imediatamente e procure por softwares especializados como o <strong>R-Studio</strong>.
            </p>
        </div>
      `
    },
    {
      title: "3. Forense Digital em 2026",
      content: `
        <p class="mb-4 text-gray-300">
            Para casos onde o sistema de arquivos está destruído (partição RAW):
            <br/><br/><strong>Dica:</strong> Use o <strong>TestDisk</strong>. Ele é uma ferramenta de linha de comando poderosa que consegue reconstruir tabelas de partição inteiras. Ele não recupera apenas um arquivo, ele recupera o disco todo que "sumiu" do Meu Computador. Requer paciência e leitura cuidadosa dos comandos, mas é a salvação de muitos técnicos em 2026.
        </p>
      `
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/recuperacao-dados-hd-corrompido",
      title: "HD Corrompido",
      description: "Foco em danos físicos e erros de leitura."
    },
    {
      href: "/guias/backup-dados",
      title: "Prevenção",
      description: "Como nunca mais perder um arquivo."
    },
    {
      href: "/guias/verificar-saude-hd-ssd-crystaldiskinfo",
      title: "Saúde do Disco",
      description: "Saiba quando seu HD vai falhar."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="40 min"
      difficultyLevel="Intermediário"
      contentSections={contentSections}
      summaryTable={summaryTable}
      relatedGuides={relatedGuides}
    />
  );
}