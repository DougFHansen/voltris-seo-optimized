import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'bitlocker-desempenho-jogos-ssd',
  title: "BitLocker Destrói FPS? O Impacto no SSD (2026)",
  description: "A criptografia do Windows 11 protege seus dados, mas custa performance. Veja benchmarks de SSD NVMe com BitLocker ligado vs desligado e decida se vale a pena.",
  category: 'otimizacao',
  difficulty: 'Intermediário',
  time: '20 min'
};

const title = "BitLocker Destrói FPS? A Verdade Sobre SSDs e Jogos (2026)";
const description = "O Windows 11 Pro vem com criptografia ativada por padrão em muitos PCs. Isso protege seus arquivos contra ladrões, mas adiciona latência em cada leitura do disco. Descubra o impacto real.";

const keywords = [
  'bitlocker diminui fps em jogos 2026 benchmark',
  'desativar bitlocker windows 11 aumenta performance ssd',
  'impacto bitlocker no ssd nvme gen4 gen5',
  'criptografia de dispositivo windows 11 desativar',
  'erro bitlocker pede chave ao ligar pc'
];

export const metadata: Metadata = createGuideMetadata('bitlocker-desempenho-jogos-ssd', title, description, keywords);

export default function BitLockerGuide() {
  const summaryTable = [
    { label: "Segurança", value: "Alta (Protege contra roubo físico)" },
    { label: "Performance", value: "Perda de 10-20% em SSD (Escrita aleatória 4K)" },
    { label: "Jogos", value: "Impacto Baixo no FPS Médio, Médio no Loading" },
    { label: "Recomendação (PC)", value: "DESLIGAR (Se for apenas gaming)" },
    { label: "Recomendação (Note)", value: "LIGAR (Risco de roubo alto)" },
    { label: "Hardware", value: "Requer TPM 2.0" }
  ];

  const contentSections = [
    {
      title: "Como a Criptografia Funciona (O Peso Invisível)",
      content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O BitLocker "embaralha" cada bit salvo no seu SSD. Quando o jogo pede uma textura, a CPU precisa pegar o dado embaralhado, usar uma chave matemática (AES-XTS) para desembaralhar e só então entregar para a placa de vídeo.
          <br/><strong>O Problema:</strong> Em SSDs ultrarrápidos (7.000 MB/s), a CPU não consegue descriptografar tão rápido quanto o SSD lê. Isso cria um gargalo artificial.
        </p>
        
        <div class="bg-red-900/10 p-5 rounded-xl border border-red-500/20 mb-6">
          <h4 class="text-red-400 font-bold mb-2">Benchmark Sintético (CrystalDiskMark)</h4>
          <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
            <li><strong>Sem BitLocker:</strong> Leitura 4K Q1T1: 95 MB/s | Latência: 40µs</li>
            <li><strong>Com BitLocker (Software):</strong> Leitura 4K Q1T1: 75 MB/s | Latência: 65µs</li>
          </ul>
          <p class="text-sm text-gray-300 mt-2">
            A latência aumenta cerca de <strong>40-60%</strong> em operações aleatórias pequenas. Jogos modernos fazem milhares dessas operações por segundo.
          </p>
        </div>
      `
    },
    {
      title: "Devo Desativar? (O Veredito)",
      content: `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div class="bg-gray-800/50 p-4 rounded-lg border border-red-500/30">
                <h5 class="font-bold text-white mb-2">PC Gamer de Mesa (Desktop)</h5>
                <p class="text-sm text-gray-300">
                    <strong>Desative.</strong> A chance de alguém invadir sua casa especificamente para roubar o SSD e ler seus dados é baixa. O ganho de responsividade do sistema (snappiness) vale a pena.
                </p>
            </div>
            <div class="bg-gray-800/50 p-4 rounded-lg border border-green-500/30">
                <h5 class="font-bold text-white mb-2">Notebook de Trabalho/Faculdade</h5>
                <p class="text-sm text-gray-300">
                    <strong>Mantenha Ativado.</strong> Notebooks são perdidos ou roubados com frequência. Sem BitLocker, qualquer um tira o SSD, pluga em outro PC e lê suas fotos, senhas e documentos. A perda de performance é o preço da segurança.
                </p>
            </div>
        </div>
      `
    }
  ];

  const advancedContentSections = [
    {
      title: "Como Desativar Corretamente",
      content: `
        <p class="mb-4 text-gray-300">
            Existem duas versões: "Criptografia de Dispositivo" (Windows Home) e "BitLocker" (Pro).
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
            <li>Abra o Menu Iniciar e digite <strong>"Gerenciar BitLocker"</strong>.</li>
            <li>Se não aparecer, digite "Configurações de criptografia do dispositivo".</li>
            <li>Clique em <strong>Desativar BitLocker</strong>.</li>
            <li>O Windows vai começar a descriptografar. Isso pode levar de 10 minutos a 5 horas dependendo do tamanho do disco.
                <br/><strong class="text-yellow-400">Nota:</strong> Você pode continuar usando o PC enquanto ele faz isso, mas ficará um pouco lento.
            </li>
        </ol>
      `
    },
    {
      title: "Hardware Encryption (OPAL) - O Melhor dos Mundos?",
      content: `
        <h4 class="text-white font-bold mb-3">SSD Samsung/Crucial c/ AES Próprio</h4>
        <p class="mb-4 text-gray-300">
            Alguns SSDs caros (Samsung 990 Pro) possuem um chip dedicado para criptografia.
            <br/>Antigamente, o BitLocker podia usar esse chip ("Hardware Encryption") para ter custo zero de CPU.
            <br/>Porém, a Microsoft <strong>removeu</strong> o suporte padrão a isso por falhas de segurança nos firmwares dos SSDs. Hoje, o BitLocker força Software Encryption por padrão, ignorando o chip do SSD. É possível reativar via Group Policy, mas é complexo e inseguro.
        </p>
      `
    }
  ];

  const additionalContentSections = [
    {
      title: "Verificando o Status via CMD",
      content: `
        <h4 class="text-white font-bold mb-3">Linha de Comando</h4>
        <p class="mb-4 text-gray-300">
            Abra o CMD como Administrador e digite:
            <br/><code class="bg-black p-1 rounded">manage-bde -status</code>
            <br/>
            <br/>Procure por:
            <br/><strong>Percentage Encrypted:</strong> 0.0% (Desligado) ou 100.0% (Ligado).
            <br/><strong>Encryption Method:</strong> XTS-AES 128 (Padrão Software).
        </p>
      `
    }
  ];

  const faqItems = [
    {
      question: "Perdi minha chave de recuperação BitLocker!",
      answer: "Se você logou com Conta Microsoft, a chave está salva online em account.microsoft.com/devices/recoverykey. Se era conta local e você não salvou o arquivo .txt ou imprimiu, seus dados estão perdidos para sempre. Não há backdoor."
    },
    {
      question: "O BitLocker protege contra vírus?",
      answer: "Não. O BitLocker protege contra acesso físico offline. Se o PC estiver ligado e desbloqueado (você logado), o vírus roda com seus privilégios e acessa os arquivos normalmente."
    },
    {
      question: "Atualizar a BIOS pede a chave do BitLocker?",
      answer: "Sim! Sempre suspenda o BitLocker antes de atualizar a BIOS. Se esquecer, o TPM reseta e o Windows pede a chave de recuperação gigante no próximo boot."
    }
  ];

  const externalReferences = [
    { name: "Encontrar chave BitLocker (Microsoft)", url: "https://account.microsoft.com/devices/recoverykey" },
    { name: "Tom's Hardware SSD Benchmark with BitLocker", url: "https://www.tomshardware.com/news/windows-11-pro-bitlocker-performance-hit" }
  ];

  const relatedGuides = [
    {
      href: "/guias/otimizacao-ssd-windows-11",
      title: "Otimizar SSD",
      description: "Outras dicas para SSD rápido."
    },
    {
      href: "/guias/atualizar-bios-seguro",
      title: "Atualizar BIOS",
      description: "Cuidado com o BitLocker aqui."
    },
    {
      href: "/guias/debloat-windows-11-otimizacao-powershell",
      title: "Windows Debloat",
      description: "Remova serviços inúteis."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="20 min"
      difficultyLevel="Intermediário"
      author="Voltris Lab"
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
