import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'pc-liga-sem-video-diagnostico',
  title: "PC Liga mas não dá Vídeo: Guia de Diagnóstico 2026",
  description: "Seu computador liga, as ventoinhas giram, mas a tela continua preta? Aprenda a diagnosticar e resolver problemas de hardware sem gastar dinheiro em 20...",
  category: 'windows-geral',
  difficulty: 'Intermediário',
  time: '30 min'
};

const title = "PC Liga mas não dá Vídeo: Guia de Diagnóstico 2026";
const description = "Seu computador liga, as ventoinhas giram, mas a tela continua preta? Aprenda a diagnosticar e resolver problemas de hardware sem gastar dinheiro em 2026.";
const keywords = [
    'pc liga mas nao da video como resolver 2026',
    'computador tela preta ventoinhas girando tutorial',
    'como limpar memoria ram pc nao liga guia',
    'diagnosticar placa de video com defeito tutorial 2026',
    'reset bios placa mae pc nao da video guia'
];

export const metadata: Metadata = createGuideMetadata('pc-liga-sem-video-diagnostico', title, description, keywords);

export default function NoVideoDiagnosticGuide() {
    const summaryTable = [
        { label: "Culpado Comum #1", value: "Memória RAM Suja ou Mal Encaixada" },
        { label: "Culpado Comum #2", value: "Capa do processador / BIOS desatualizada" },
        { label: "Ajuste Simples", value: "Resetar CMOS (Bateria da placa-mãe)" },
        { label: "Dificuldade", value: "Média" }
    ];

    const contentSections = [
        {
            title: "O desespero da Tela Preta",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Este é um dos problemas mais frustrantes do mundo do hardware. O PC parece vivo: os LEDs acendem, os fans giram, mas o monitor insiste em ficar em standby. Em 2026, com placas-mãe mais inteligentes, a maioria dos erros pode ser diagnosticada através de pequenos sinais que a própria placa te dá. Vamos seguir um roteiro lógico para não perder tempo.
        </p>
      `
        },
        {
            title: "1. O Teste da Memória RAM (90% dos casos)",
            content: `
        <p class="mb-4 text-gray-300">A poeira nos contatos da RAM é a maior vilã:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Desligue o PC da tomada completamente.</li>
            <li>Remova os pentes de memória RAM.</li>
            <li>Se tiver uma <strong>borracha escolar branca</strong> (macia), passe suavemente nos contatos dourados.</li>
            <li>Passe um pincel seco no slot da placa-mãe.</li>
            <li>Tente ligar com apenas <strong>UM pente de memória</strong> de cada vez em slots diferentes. Se o PC ligar, você encontrou o pente ou o slot com defeito.</li>
        </ol>
      `
        },
        {
            title: "2. Reset de BIOS (Clear CMOS)",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Zerando as Configurações:</h4>
            <p class="text-sm text-gray-300">
                Muitas vezes, uma configuração errada de memória ou processador na BIOS impede o boot. <br/><br/>
                Procure pela bateria redonda (moeda) na sua placa-mãe. Remova-a com cuidado e espere 1 minuto (com o PC fora da tomada). Coloque-a de volta. Isso fará a placa-mãe carregar os padrões de fábrica. Se o problema era um overclock mal sucedido, o PC voltará a dar vídeo instantaneamente.
            </p>
        </div>
      `
        },
        {
            title: "3. LEDs de Diagnóstico e Beeps",
            content: `
        <p class="mb-4 text-gray-300">
            Olhe atentamente para o canto superior direito da sua placa-mãe. 
            <br/><br/><strong>Dica de 2026:</strong> Quase todas as placas modernas possuem 4 pequenos LEDs escritos: <strong>CPU, DRAM, VGA, BOOT</strong>. Se o LED 'VGA' ficar aceso (geralmente vermelho ou branco), o problema está na sua placa de vídeo ou no cabo HDMI/DisplayPort. Se o LED 'CPU' acender, o processador ou a BIOS precisam de atenção. Consulte o manual da sua placa para entender o código exato.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/pc-gamer-barato-custo-beneficio-2026",
            title: "Montar PC",
            description: "Dicas para evitar erros na montagem."
        },
        {
            href: "/guias/testar-fonte-pc-multimetro",
            title: "Testar Fonte",
            description: "Saiba se a fonte tem energia para o vídeo."
        },
        {
            href: "/guias/atualizar-bios-seguro",
            title: "Atualizar BIOS",
            description: "Necessário para CPUs novas em placas antigas."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="30 min"
            difficultyLevel="Intermediário"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
