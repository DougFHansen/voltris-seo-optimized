import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Modo de Jogo do Windows 11: Ativar ou Desativar? (2026)";
const description = "Você ganha ou perde FPS com o Modo de Jogo ativado? Descubra como essa função do Windows 11 prioriza seu processador e placa de vídeo em 2026.";
const keywords = [
    'modo de jogo windows 11 vale a pena 2026',
    'como ativar modo de jogo windows para ganhar fps',
    'modo de jogo windows 11 vs performance real tutorial',
    'otimizar pc para jogos windows 11 modo de jogo',
    'prioridade de processo modo de jogo windows guia'
];

export const metadata: Metadata = createGuideMetadata('modo-de-jogo-windows-atikvar-ou-nao', title, description, keywords);

export default function GameModeGuide() {
    const summaryTable = [
        { label: "O que faz", value: "Prioriza CPU e GPU para o processo do jogo" },
        { label: "Vantagem", value: "Impede o Windows Update de instalar drivers no meio da partida" },
        { label: "Recomendação 2026", value: "Ativar (ON)" },
        { label: "Dificuldade", value: "Fácil" }
    ];

    const contentSections = [
        {
            title: "A Evolução de um Recurso Polêmico",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          No passado, o **Modo de Jogo** do Windows era famoso por causar mais problemas do que soluções. Mas em 2026, com o amadurecimento do Windows 11, essa ferramenta se tornou essencial. Ela não vai fazer um milagre e te dar 50 FPS extras, mas ela garante a **estabilidade**. O Modo de Jogo age como um "leão de chácara", impedindo que outros programas interrompam sua diversão.
        </p>
      `
        },
        {
            title: "1. O que acontece por trás das cortinas?",
            content: `
        <p class="mb-4 text-gray-300">Ao ativar o Modo de Jogo, o Windows realiza quatro ações principais:</p>
        <ul class="list-disc list-inside text-gray-300 space-y-3">
            <li><strong>Bloqueio de Updates:</strong> O Windows Update é impedido de baixar e instalar pacotes que usam disco e rede.</li>
            <li><strong>Notificações Silenciadas:</strong> O sistema não mostra avisos que tiram o foco da tela cheia.</li>
            <li><strong>Prioridade de CPU:</strong> O escalonador de tarefas reserva ciclos de processamento especificamente para o jogo.</li>
            <li><strong>Estabilidade de Frametime:</strong> Reduz a oscilação causada por tarefas agendadas do sistema.</li>
        </ul >
      `
        },
        {
            title: "2. Como ativar corretamente",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Passo a Passo:</h4>
            <p class="text-sm text-gray-300">
                1. Aperte <strong>Win + I</strong> para abrir as Configurações. <br/>
                2. Vá na aba <strong>Jogos</strong> no menu lateral. <br/>
                3. Clique em <strong>Modo de Jogo</strong>. <br/>
                4. Certifique-se de que a chave está em <strong>Ativado</strong>. <br/>
                <strong>Dica:</strong> No mesmo menu, clique em 'Gráficos' e verifique se o 'Agendamento de GPU' também está ligado.
            </p>
        </div>
      `
        },
        {
            title: "3. Quando deixar Desativado?",
            content: `
        <p class="mb-4 text-gray-300">
            A única situação em 2026 onde o Modo de Jogo pode atrapalhar é se você for um Streamer. 
            <br/><br/>Como o Windows prioriza 100% dos recursos para o jogo, softwares como o **OBS Studio** podem ficar com "falta de fôlego" para encodar o vídeo, causando frames pulados na sua live. Se você sente que sua stream trava mas o jogo roda bem, tente desativar o Modo de Jogo para equilibrar a distribuição de força entre o jogo e o software de gravação.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/aceleracao-hardware-gpu-agendamento",
            title: "Agendamento de GPU",
            description: "O parceiro ideal do Modo de Jogo."
        },
        {
            href: "/guias/otimizacao-performance",
            title: "Performance Geral",
            description: "Ajuste o plano de energia do Windows."
        },
        {
            href: "/guias/pos-instalacao-windows-11",
            title: "Pós-Instalação",
            description: "O que mais configurar no seu Windows novo."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="5 min"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
