import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Agendamento de GPU acelerado por hardware: Como ativar e ganhar FPS";
const description = "Entenda o que é o Hardware-Accelerated GPU Scheduling (HAGS) no Windows 11 e como ele reduz a latência e aumenta o FPS em placas NVIDIA e AMD.";
const keywords = [
    'agendamento de gpu acelerado por hardware como ativar',
    'hags windows 11 vale a pena',
    'reduzir latência jogos windows 11 gpu',
    'ganhar fps nvidia acceleration 2026',
    'hardware accelerated gpu scheduling performance'
];

export const metadata: Metadata = createGuideMetadata('aceleracao-hardware-gpu-agendamento', title, description, keywords);

export default function GPUAccelerationGuide() {
    const summaryTable = [
        { label: "O que faz", value: "Dá controle da memória à GPU" },
        { label: "Ganhos em FPS", value: "2% a 10%" },
        { label: "Latência", value: "Redução de Input Lag" },
        { label: "Requisito", value: "Windows 10 (2004) ou Windows 11" }
    ];

    const contentSections = [
        {
            title: "O que é o Agendamento de GPU?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Tradicionalmente, o Windows é quem gerencia o que a sua placa de vídeo deve processar. Com o **Agendamento de GPU Acelerado por Hardware (HAGS)**, o Windows passa essa responsabilidade diretamente para o processador da placa de vídeo. 
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed">
          Isso remove a "burocracia" do sistema operacional, diminuindo a carga sobre o seu processador (CPU) e permitindo que a imagem chegue mais rápido ao monitor.
        </p>
      `
        },
        {
            title: "Como Ativar Passo a Passo",
            content: `
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Abra as <strong>Configurações</strong> do Windows.</li>
            <li>Vá em Sistema > Tela > <strong>Gráficos</strong>.</li>
            <li>Clique em "Alterar configurações de gráficos padrão".</li>
            <li>Ative a chave <strong>Agendamento de GPU acelerado por hardware</strong>.</li>
            <li>Reinicie o seu computador para aplicar a mudança.</li>
        </ol>
      `
        },
        {
            title: "Quem deve ativar?",
            content: `
        <p class="mb-4 text-gray-300">
            Este recurso é quase obrigatório para usuários de placas NVIDIA <strong>série RTX 30 e 40</strong>, especialmente se você pretende usar o <strong>Frame Generation (DLSS 3)</strong>, que exige que o HAGS esteja ligado.
        </p>
        <div class="bg-yellow-900/10 p-5 rounded-xl border border-yellow-500/30">
            <h4 class="text-yellow-400 font-bold mb-2">Cuidado:</h4>
            <p class="text-sm text-gray-300">
                Em algumas placas de vídeo muito antigas (série GTX 10 ou RX 500), este recurso pode causar instabilidade em vez de ganhos. Se o seu jogo começar a crashar após ativar, volte e desative.
            </p>
        </div>
      `
        },
        {
            title: "Performance e Frame Generation",
            content: `
        <p class="mb-4 text-gray-300">
            Se você joga títulos pesados como Cyberpunk 2077 ou Alan Wake 2, o HAGS ajuda a estabilizar os "Frametimes", que é o tempo de entrega de cada quadro. Isso resulta em uma experiência muito mais fluida, mesmo que o FPS médio não suba drasticamente.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/otimizacao-performance",
            title: "Performance Geral",
            description: "Combine com o modo de alto desempenho."
        },
        {
            href: "/guias/atualizacao-drivers-video",
            title: "Drivers de Vídeo",
            description: "O HAGS exige drivers WDDM 2.7 ou superior."
        },
        {
            href: "/guias/re-size-bar-ativar-pc-gamer",
            title: "Resizable BAR",
            description: "Outro recurso vital de comunicação CPU-GPU."
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
