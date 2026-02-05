import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'saude-bateria-notebook',
  title: "Como verificar e aumentar a Saúde da Bateria do Notebook (2026)",
  description: "Sua bateria dura pouco? Aprenda como gerar o relatório oficial de bateria do Windows 11 e dicas para fazer ela durar muito mais em 2026.",
  category: 'windows-geral',
  difficulty: 'Iniciante',
  time: '15 min'
};

const title = "Como verificar e aumentar a Saúde da Bateria do Notebook (2026)";
const description = "Sua bateria dura pouco? Aprenda como gerar o relatório oficial de bateria do Windows 11 e dicas para fazer ela durar muito mais em 2026.";
const keywords = [
  'verificar saude bateria notebook windows 11 2026',
  'como gerar battery report windows 11 tutorial',
  'bateria de notebook viciada como resolver guia 2026',
  'aumentar vida util bateria notebook gamer tutorial',
  'limitar carga da bateria notebook para 80 por cento'
];

export const metadata: Metadata = createGuideMetadata('saude-bateria-notebook', title, description, keywords);

export default function BatteryHealthGuide() {
  const summaryTable = [
    { label: "Comando Chave", value: "powercfg /batteryreport" },
    { label: "Carga Ideal", value: "Entre 20% e 80%" },
    { label: "Vilão", value: "Calor Excessivo" },
    { label: "Dificuldade", value: "Fácil" }
  ];

  const contentSections = [
    {
      title: "O desgaste natural das baterias",
      content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Em 2026, as baterias de íon-lítio ainda são a tecnologia padrão e, infelizmente, elas têm uma vida útil limitada a ciclos de carga. Toda vez que você carrega de 0 a 100%, você "gasta" um ciclo. Se o seu notebook descarrega muito rápido, pode ser que a sua bateria já tenha perdido a capacidade original (Design Capacity). O primeiro passo é descobrir o estado real dela.
        </p>
      `
    },
    {
      title: "1. Gerando o Battery Report Oficial",
      content: `
        <p class="mb-4 text-gray-300">O Windows tem uma ferramenta oculta de diagnóstico muito precisa:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Pesquise por <strong>CMD</strong> no Menu Iniciar e execute como administrador.</li>
            <li>Digite o comando: <code>powercfg /batteryreport</code> e dê Enter.</li>
            <li>O Windows salvará um arquivo HTML em uma pasta do sistema. Vá até o local indicado e abra o arquivo no navegador.</li>
            <li>Compare os valores: **Design Capacity** (Capacidade de fábrica) vs **Full Charge Capacity** (Capacidade atual). Se a atual for menor que 70% da original, a bateria está degradada.</li>
        </ol>
      `
    },
    {
      title: "2. O Segredo dos 80% (Battery Limiter)",
      content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Preservando a Vida Útil:</h4>
            <p class="text-sm text-gray-300">
                O estado que mais estressa as células da bateria é estar em 100% ou em 0%. Em 2026, quase todos os fabricantes (Asus, Dell, Acer, Lenovo) oferecem um software que permite **limitar a carga em 80%**. <br/><br/>
                Se você usa o notebook muito tempo ligado na tomada, ative essa opção! Isso impede que a bateria fique "fritando" na voltagem máxima constantemente, dobrando a vida útil dela ao longo dos anos.
            </p>
        </div>
      `
    },
    {
      title: "3. Dicas Rápidas para o Dia a Dia",
      content: `
        <p class="mb-4 text-gray-300">
            <strong>Fuja do Calor:</strong> 
            <br/><br/>O calor é o maior inimigo da química da bateria. Se você joga e sente o notebook fervendo, o calor interno está degradando as células. Use uma base cooler. <br/><br/>
            <strong>Brilho da Tela:</strong> Reduzir o brilho de 100% para 70% pode dar até 40 minutos extras de autonomia. Ative também o 'Economia de Bateria' automaticamente quando ela atingir 30%.
        </p>
      `
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/calibrar-bateria-notebook",
      title: "Calibrar Bateria",
      description: "Aprenda a recalibrar se a porcentagem estiver errada."
    },
    {
      href: "/guias/otimizacoes-para-notebook-gamer",
      title: "Otimizar Notebook",
      description: "Melhore a performance enquanto economiza carga."
    },
    {
      href: "/guias/monitorar-temperatura-pc",
      title: "Monitorar Calor",
      description: "Mantenha o sistema frio para preservar peças."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="15 min"
      difficultyLevel="Iniciante"
      contentSections={contentSections}
      summaryTable={summaryTable}
      relatedGuides={relatedGuides}
    />
  );
}
