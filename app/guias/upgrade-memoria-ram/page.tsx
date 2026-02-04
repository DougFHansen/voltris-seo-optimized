import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Upgrade de Memória RAM: Guia de Compatibilidade (2026)";
const description = "Quer colocar mais RAM no seu PC ou Notebook? Aprenda como escolher a frequência correta, DDR4 vs DDR5 e como ativar o Dual Channel em 2026.";
const keywords = [
  'como escolher memoria ram para pc 2026 guia',
  'upgrade memoria ram notebook ddr4 ddr5 tutorial',
  'o que é dual channel memoria ram tutorial 2026',
  'compatibilidade memoria ram frequencia guia 2026',
  'como instalar memoria ram no pc passo a passo'
];

export const metadata: Metadata = createGuideMetadata('upgrade-memoria-ram', title, description, keywords);

export default function RAMUpgradeGuide() {
  const summaryTable = [
    { label: "Padrão Atual", value: "DDR5 (PCs novos) / DDR4 (PCs antigos/custo-benefício)" },
    { label: "Dual Channel", value: "Sempre use 2 pentes iguais (ex: 2x16GB)" },
    { label: "Frequência", value: "Verifique o limite da sua Placa-Mãe" },
    { label: "Dificuldade", value: "Média (Requer abrir o gabinete)" }
  ];

  const contentSections = [
    {
      title: "Quanta RAM eu preciso em 2026?",
      content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Em 2026, os **16GB de RAM** que antes eram o ideal, tornaram-se o mínimo absoluto para quem joga ou trabalha. Com o Windows 11 e navegadores consumindo cada vez mais, o novo padrão recomendado para uma experiência sem travamentos é **32GB**. No entanto, não basta apenas comprar qualquer memória; a velocidade e a latência (CL) definem se o seu upgrade será um sucesso ou um desperdício de dinheiro.
        </p>
      `
    },
    {
      title: "1. DDR4 vs DDR5: Não são compatíveis!",
      content: `
        <p class="mb-4 text-gray-300">O erro mais comum em 2026 é comprar o padrão errado:</p>
        <p class="text-sm text-gray-300">
            Pentes DDR5 não encaixam em slots DDR4 e vice-versa. <br/><br/>
            - <strong>DDR4:</strong> Presente em PCs até 2022/2023. Frequências comuns: 3200MHz. <br/>
            - <strong>DDR5:</strong> O padrão dos PCs modernos em 2026. Frequências começando em 4800MHz e chegando a 8000MHz+. <br/>
            - <strong>Dica:</strong> Baixe o software <strong>CPU-Z</strong>, vá na aba 'Memory' e veja qual o 'Type' da sua memória atual antes de comprar a nova.
        </p>
      `
    },
    {
      title: "2. A Regra do Dual Channel",
      content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Dobre a Banda de Memória:</h4>
            <p class="text-sm text-gray-300">
                Nunca use apenas um pente de 16GB se você tem dois slots. Colocar dois pentes de 8GB (Total 16GB) ativa o <strong>Dual Channel</strong>, o que dobra a velocidade de comunicação entre a CPU e a RAM. Em 2026, jogar em Single Channel (um pente só) pode causar quedas de até 30% no seu FPS mínimo, gerando travadas constantes em jogos competitivos.
            </p>
        </div>
      `
    },
    {
      title: "3. Misturando Marcas e Velocidades",
      content: `
        <p class="mb-4 text-gray-300">
            <strong>Posso misturar?</strong> 
            <br/><br/>Sim, porém o PC sempre rodará na velocidade da memória **mais lenta**. Se você tem um pente de 3600MHz e coloca outro de 2400MHz, ambos funcionarão a 2400MHz. O ideal em 2026 é comprar kits fechados (2x8GB ou 2x16GB) da mesma marca e lote para garantir 100% de estabilidade e ativar o perfil XMP/EXPO sem erros de tela azul.
        </p>
      `
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/limpar-memoria-ram-windows",
      title: "Limpar RAM",
      description: "Otimize o uso antes de comprar mais."
    },
    {
      href: "/guias/tela-azul-memory-management-fix",
      title: "Erro de Memória",
      description: "Diagnostique pentes defeituosos."
    },
    {
      href: "/guias/como-escolher-processador-2026",
      title: "Escolher CPU",
      description: "Veja quais processadores suportam DDR5."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="20 min"
      difficultyLevel="Médio"
      contentSections={contentSections}
      summaryTable={summaryTable}
      relatedGuides={relatedGuides}
    />
  );
}
