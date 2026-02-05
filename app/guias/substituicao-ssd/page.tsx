import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'substituicao-ssd',
  title: "Como Instalar um SSD e Clonar o Windows (Guia 2026)",
  description: "Vai trocar seu HD por um SSD ou fazer upgrade de NVMe? Aprenda como instalar fisicamente e clonar seu Windows sem perder nenhum arquivo em 2026.",
  category: 'hardware',
  difficulty: 'Intermediário',
  time: '40 min'
};

const title = "Como Instalar um SSD e Clonar o Windows (Guia 2026)";
const description = "Vai trocar seu HD por um SSD ou fazer upgrade de NVMe? Aprenda como instalar fisicamente e clonar seu Windows sem perder nenhum arquivo em 2026.";
const keywords = [
  'como instalar ssd no pc e notebook 2026',
  'clonar windows de hd para ssd tutorial gratis',
  'como instalar ssd nvme m.2 passo a passo guia',
  'migrar sistema para ssd novo sem formatar 2026',
  'instalar ssd sata no notebook antigo tutorial'
];

export const metadata: Metadata = createGuideMetadata('substituicao-ssd', title, description, keywords);

export default function SSDInstallationGuide() {
  const summaryTable = [
    { label: "Formatos", value: "SATA 2.5\" ou NVMe M.2" },
    { label: "Software de Clonagem", value: "Macrium Reflect / Clonezilla" },
    { label: "Vantagem", value: "Não precisa reinstalar tudo" },
    { label: "Dificuldade", value: "Médio" }
  ];

  const contentSections = [
    {
      title: "O maior upgrade que você pode fazer",
      content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Em 2026, substituir um HD antigo por um SSD é como transformar um carro de boi em um jato. A diferença de velocidade no Windows 11 é brutante. Se você já tem um SSD e está apenas fazendo upgrade para um maior (ex: de 240GB para 1TB), a boa notícia é que você **não precisa formatar**. Você pode clonar exatamente o que tem hoje para o drive novo em poucos minutos.
        </p>
      `
    },
    {
      title: "1. Instalação Física: SATA vs M.2",
      content: `
        <p class="mb-4 text-gray-300">Como encaixar a peça no lugar certo:</p>
        <ul class="list-disc list-inside text-gray-300 space-y-3">
            <li><strong>SSD SATA (2.5"):</strong> Usa dois cabos (um de energia da fonte e um de dados ligado na placa-mãe). Ideal para notebooks antigos ou HDs secundários.</li>
            <li><strong>NVMe M.2 (O "pente"):</strong> Vai encaixado direto em um slot na placa-mãe e preso por um pequeno parafuso. Em 2026, certifique-se de que o slot suporta a velocidade da sua placa (Gen3, Gen4 ou Gen5).</li>
            <li><strong>Aviso:</strong> Sempre desligue o PC da tomada e, em notebooks, desconecte a bateria antes de tocar em qualquer componente interno.</li>
        </ul >
      `
    },
    {
      title: "2. Como Clonar o Windows (Sem Formatar)",
      content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Processo com Macrium Reflect:</h4>
            <p class="text-sm text-gray-300">
                1. Conecte o SSD novo no PC (use um adaptador USB-SATA se for notebook). <br/>
                2. Abra o software de clonagem e selecione o disco antigo como **Origem** e o novo como **Destino**. <br/>
                3. Clique em 'Copy Partitions'. Se o SSD novo for maior, estenda a partição 'C:' para ocupar o espaço todo. <br/>
                4. Após terminar, desligue o PC, remova o disco velho e coloque o novo. O Windows ligará idêntico, mas muito mais rápido.
            </p>
        </div>
      `
    },
    {
      title: "3. O Primeiro Boot e Ajustes",
      content: `
        <p class="mb-4 text-gray-300">
            <strong>Iniciando o novo drive:</strong> 
            <br/><br/>Se após a instalação o PC continuar ligando pelo disco antigo, entre na BIOS e mude a **Prioridade de Boot** para o novo SSD. Ao entrar no Windows, verifique se o comando TRIM está ativo. Caso o SSD novo não apareça no 'Este Computador', você precisará ir em 'Gerenciamento de Disco', clicar com o botão direito no espaço preto e escolher 'Novo Volume Simples' para dar uma letra (D:, E:, etc) a ele.
        </p>
      `
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/otimizacao-ssd-windows-11",
      title: "Otimizar SSD",
      description: "Ajustes de performance após a instalação."
    },
    {
      href: "/guias/verificar-saude-hd-ssd-crystaldiskinfo",
      title: "Verificar Saúde",
      description: "Teste se o seu SSD novo veio perfeito."
    },
    {
      href: "/guias/formataçao-windows",
      title: "Formatação Limpa",
      description: "Prefere começar do zero? Siga este guia."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="40 min"
      difficultyLevel="Médio"
      contentSections={contentSections}
      summaryTable={summaryTable}
      relatedGuides={relatedGuides}
    />
  );
}
