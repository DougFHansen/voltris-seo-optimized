import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Como Testar Fonte de PC com Multímetro (Guia 2026)";
const description = "Seu PC não liga ou desliga do nada? Aprenda como testar as voltagens da sua fonte de alimentação usando um multímetro de forma segura em 2026.";
const keywords = [
    'como testar fonte de pc com multimetro 2026 tutorial',
    'teste de fonte pc com clips papel passo a passo',
    'voltagens ideais fonte de pc guia 2026',
    'como saber se a fonte do pc queimou tutorial',
    'testar linha 12v fonte de alimentação pc guia 2026'
];

export const metadata: Metadata = createGuideMetadata('testar-fonte-pc-multimetro', title, description, keywords);

export default function PowerSupplyTestGuide() {
    const summaryTable = [
        { label: "Linha Crítica", value: "12V (Amarelo) - Alimenta GPU/CPU" },
        { label: "Linha de Dados", value: "5V (Vermelho) - Periféricos/SSD" },
        { label: "Teste de Partida", value: "Fio Verde + Fio Preto (Pino 16 + 17)" },
        { label: "Dificuldade", value: "Alta (Requer cuidado elétrico)" }
    ];

    const contentSections = [
        {
            title: "Diagnóstico Elétrico: O PC está 'vivo'?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Em 2026, com placas de vídeo exigindo cada vez mais energia, a fonte de alimentação (PSU) tornou-se o componente que mais falha silenciosamente. O PC pode ligar os LEDs, mas não dar vídeo por falta de voltagem estável na linha de 12V. Usar um multímetro é a única forma de garantir que sua fonte não está "morrendo" e colocando em risco seus outros componentes caros.
        </p>
      `
        },
        {
            title: "1. O Teste do Clipe de Papel (Power On)",
            content: `
        <p class="mb-4 text-gray-300">Primeiro, precisamos fazer a fonte ligar sem estar conectada à placa-mãe:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Desligue a fonte da tomada e remova todos os cabos do PC.</li>
            <li>No conector grande de 24 pinos, localize o único <strong>Fio Verde</strong> (PS_ON).</li>
            <li>Use um clipe de papel para conectar o pino do fio verde com qualquer <strong>Fio Preto</strong> (GND) vizinho.</li>
            <li>Ligue a fonte na tomada. Se a ventoinha da fonte girar, ela está recebendo energia.</li>
        </ol>
      `
        },
        {
            title: "2. Medindo as Voltagens com o Multímetro",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Valores de Referência em 2026:</h4>
            <p class="text-sm text-gray-300">
                Coloque o multímetro na escala de <strong>20V DC</strong>. Com a fonte ligada (pelo teste do clipe): <br/><br/>
                - <strong>Fio Amarelo:</strong> Deve marcar entre 11.4V e 12.6V. Se estiver abaixo de 11.4V, sua fonte não aguentará uma placa de vídeo pesada. <br/>
                - <strong>Fio Vermelho:</strong> Deve marcar próximo de 5.0V. <br/>
                - <strong>Fio Laranja:</strong> Deve marcar próximo de 3.3V. <br/>
                - <strong>Fio Roxo:</strong> (5V Standby) Deve ter 5V mesmo com a fonte em repouso.
            </p>
        </div>
      `
        },
        {
            title: "3. Sintomas de Fonte Defeituosa",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>Quando trocar a fonte?</strong> 
            <br/><br/>Se as voltagens oscilarem muito (ex: o 12V ficar pulando para 11V e voltando), os capacitores da sua fonte estão esgotados. Em 2026, uma fonte instável causa o famoso <strong>reboot espontâneo</strong>: o seu PC desliga do nada enquanto você joga algo pesado, pois a voltagem cai abaixo do limite de segurança e a placa-mãe corta a energia para se proteger.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/pc-liga-sem-video-diagnostico",
            title: "PC não dá Vídeo",
            description: "A fonte pode ser a culpada."
        },
        {
            href: "/guias/como-escolher-placa-de-video",
            title: "Escolher Placa",
            description: "Calcule a potência necessária da fonte."
        },
        {
            href: "/guias/manutencao-preventiva-computador",
            title: "Manutenção PC",
            description: "Evite que a poeira queime sua fonte."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="30 min"
            difficultyLevel="Avançado"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
