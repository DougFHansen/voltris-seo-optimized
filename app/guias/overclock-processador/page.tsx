import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'overclock-processador',
  title: "Overclock de Processador (CPU): Vale a pena em 2026?",
  description: "Aprenda como aumentar a frequência do seu processador Intel ou AMD com segurança. Guia sobre multiplicadores, voltagem e resfriamento em 2026.",
  category: 'hardware',
  difficulty: 'Avançado',
  time: '60 min'
};

const title = "Overclock de Processador (CPU): Vale a pena em 2026?";
const description = "Aprenda como aumentar a frequência do seu processador Intel ou AMD com segurança. Guia sobre multiplicadores, voltagem e resfriamento em 2026.";
const keywords = [
  'como fazer overclock no processador bios 2026',
  'overclock ryzen master tutorial 2026',
  'overclock intel xtu guia passo a passo',
  'vale a pena fazer overclock na cpu para jogos',
  'riscos do overclock de processador 2026'
];

export const metadata: Metadata = createGuideMetadata('overclock-processador', title, description, keywords);

export default function CPUOverclockGuide() {
  const summaryTable = [
    { label: "AMD", value: "Ryzen Master / PBO (Precision Boost Overdrive)" },
    { label: "Intel", value: "Extreme Tuning Utility (XTU) / Manual na BIOS" },
    { label: "Exigência", value: "Placa-mãe de chipset Z (Intel) ou B/X (AMD)" },
    { label: "Dificuldade", value: "Avançado" }
  ];

  const contentSections = [
    {
      title: "O fim do Overclock agressivo?",
      content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Em 2026, tanto a Intel quanto a AMD já entregam seus processadores "no limite" de fábrica. O overclock manual de 5GHz para 5.5GHz raramente resulta em um ganho de FPS que justifique o aumento drástico no calor e no consumo de energia. Hoje em dia, a técnica mais eficiente é o <strong>Undervolt + Overclock</strong> (aumentar a eficiência para que o processador consiga manter frequências altas por mais tempo).
        </p>
      `
    },
    {
      title: "1. AMD: O Poder do PBO",
      content: `
        <p class="mb-4 text-gray-300">Para usuários de Ryzen em 2026:</p>
        <p class="text-sm text-gray-300">
            O <strong>PBO (Precision Boost Overdrive)</strong> é a forma oficial de overclock da AMD. Ele analisa a capacidade térmica dos seus fans e da placa-mãe para decidir até onde subir o clock. <br/><br/>
            <strong>Dica:</strong> No BIOS, ative o PBO e use o <strong>Curve Optimizer</strong> com um valor 'Negative' (-15 ou -20). Isso reduz a voltagem, fazendo a CPU esquentar menos e permitindo que ela atinja clocks maiores automaticamente.
        </p>
      `
    },
    {
      title: "2. Intel: Multiplicadores e Chipset",
      content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Apenas Séries K:</h4>
            <p class="text-sm text-gray-300">
                Se o seu processador Intel não tiver o "K" no final (ex: i5-13400), o multiplicador é travado e você não poderá fazer overclock. <br/><br/>
                Para os processadores desbloqueados, o ajuste é feito na BIOS alterando o <strong>CPU Core Ratio</strong>. Comece subindo +1 em todos os núcleos e use o programa <strong>Cinebench</strong> para testar se o Windows não vai dar tela azul sob estresse.
            </p>
        </div>
      `
    },
    {
      title: "3. O Inimigo nº 1: A Voltagem",
      content: `
        <p class="mb-4 text-gray-300">
            <strong>Nunca use o "Auto-OC" da placa-mãe:</strong> 
            <br/><br/>Muitas placas-mãe prometem overclock com um clique (OC Genie, AI Overclock), mas elas costumam jogar uma voltagem (VCORE) perigosamente alta para garantir estabilidade. O uso prolongado acima de 1.4V pode degradar o silício do seu processador, diminuindo sua vida útil. Em 2026, o overclock manual e paciente é a única forma segura de extrair performance extra.
        </p>
      `
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/water-cooler-vs-air-cooler-qual-escolher",
      title: "Resfriamento",
      description: "Você vai precisar de um cooler potente."
    },
    {
      href: "/guias/monitorar-temperatura-pc",
      title: "Monitorar Calor",
      description: "Não deixe a CPU passar de 90°C."
    },
    {
      href: "/guias/undervolt-cpu-notebook",
      title: "Guia de Undervolt",
      description: "Aprenda a reduzir a voltagem com precisão."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="60 min"
      difficultyLevel="Avançado"
      contentSections={contentSections}
      summaryTable={summaryTable}
      relatedGuides={relatedGuides}
    />
  );
}