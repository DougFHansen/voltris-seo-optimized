import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'nvidia-refelx-on-vs-boost-diferenca',
  title: "NVIDIA Reflex: Qual a diferença entre ON e ON + BOOST? (2026)",
  description: "Quer reduzir o atraso dos seus comandos? Aprenda como configurar o NVIDIA Reflex corretamente e saiba quando usar o modo Boost em 2026.",
  category: 'windows-geral',
  difficulty: 'Intermediário',
  time: '10 min'
};

const title = "NVIDIA Reflex: Qual a diferença entre ON e ON + BOOST? (2026)";
const description = "Quer reduzir o atraso dos seus comandos? Aprenda como configurar o NVIDIA Reflex corretamente e saiba quando usar o modo Boost em 2026.";
const keywords = [
    'nvidia reflex on vs boost diferença 2026',
    'como reduzir input lag nos jogos tutorial',
    'nvidia reflex vale a pena para valorant e fortnite',
    'o que faz o modo boost no nvidia reflex guia',
    'latência do sistema pc gamer como diminuir 2026'
];

export const metadata: Metadata = createGuideMetadata('nvidia-refelx-on-vs-boost-diferenca', title, description, keywords);

export default function NvidiaReflexGuide() {
    const summaryTable = [
        { label: "Reflex OFF", value: "Padrão / Maior fila de renderização" },
        { label: "Reflex ON", value: "Sincronia CPU-GPU / Menor latência" },
        { label: "Reflex ON + BOOST", value: "Força clock máximo da GPU / Máxima reação" },
        { label: "Hardware Necessário", value: "Placa NVIDIA GTX 900 ou superior" }
    ];

    const contentSections = [
        {
            title: "O que é o NVIDIA Reflex?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Em jogos competitivos de 2026, ganhar ou perder depende de milissegundos. O **NVIDIA Reflex** é uma tecnologia que remove o "congestionamento" entre o seu processador e a sua placa de vídeo. Sem o Reflex, a CPU envia os quadros para uma fila e a GPU os processa quando pode. Com o Reflex, a CPU só envia o quadro no exato momento em que a GPU está pronta, eliminando o atraso (input lag) entre o seu clique e o tiro na tela.
        </p>
      `
        },
        {
            title: "1. O modo ON: O Equilíbrio Ideal",
            content: `
        <p class="mb-4 text-gray-300">Ao ativar apenas o 'ON', você tem os seguintes benefícios:</p>
        <ul class="list-disc list-inside text-gray-300 space-y-3">
            <li><strong>Latência Reduzida:</strong> Seus comandos parecem mais diretos e responsivos.</li>
            <li><strong>Temperatura Estável:</strong> A placa de vídeo não trabalha mais do que o necessário, mantendo o PC mais silencioso.</li>
            <li><strong>Consistência:</strong> Reduz as variações bruscas de atraso, o que ajuda na sua memória muscular de mira.</li>
        </ul >
      `
        },
        {
            title: "2. O modo ON + BOOST: Reação Extrema",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Para cenários competitivos:</h4>
            <p class="text-sm text-gray-300">
                O modo <strong>ON + BOOST</strong> faz algo agressivo: ele impede que a placa de vídeo reduza o clock (velocidade) mesmo quando o jogo é leve (CPU Bound). <br/><br/>
                Imagine que você está parado olhando para uma parede; a GPU normalmente baixaria a velocidade para economizar energia. Com o Boost, ela continua no máximo. Isso garante que, se um inimigo aparecer de repente, a resposta da GPU seja **instantânea**, sem o pequeno atraso de ela precisar "acordar" para processar o movimento.
            </p>
        </div>
      `
        },
        {
            title: "3. Qual escolher em 2026?",
            content: `
        <p class="mb-4 text-gray-300">
            - <strong>Use ON + BOOST</strong> se você joga profissionalmente jogos como Valorant, CS2 ou Warzone e não se importa com o barulho dos fans ou consumo de energia.
            <br/><br/>
            - <strong>Use apenas ON</strong> para jogos de aventura ou se você joga em um <strong>Notebook Gamer</strong>. O modo Boost em notebooks pode causar superaquecimento desnecessário, o que acaba gerando quedas de FPS por calor (Thermal Throttling), anulando qualquer benefício de latência.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/limitar-fps-rivatuner-nvidia",
            title: "Limitar FPS",
            description: "Combine com Reflex para latência mínima."
        },
        {
            href: "/guias/aceleracao-hardware-gpu-agendamento",
            title: "Agendamento de GPU",
            description: "Outra forma de reduzir latência no Windows 11."
        },
        {
            href: "/guias/mousepad-speed-vs-control",
            title: "Melhorar Mira",
            description: "Sua reação física junto com a digital."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="10 min"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
