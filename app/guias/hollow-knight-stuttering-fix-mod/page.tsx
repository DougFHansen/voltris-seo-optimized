import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Hollow Knight: Como remover o Stuttering e Micro-travadas";
const description = "Sofrendo com pequenas travadas no Hollow Knight mesmo em um PC potente? Aprenda a configurar o V-Sync e usar mods para uma jogabilidade fluida em 2026.";
const keywords = [
    'hollow knight stuttering fix pc 2026',
    'como remover micro travadas hollow knight tutorial',
    'hollow knight mod fmod fix performance',
    'melhorar fps hollow knight notebook fraco',
    'configuração de monitor para hollow knight sem lag'
];

export const metadata: Metadata = createGuideMetadata('hollow-knight-stuttering-fix-mod', title, description, keywords);

export default function HollowKnightFixGuide() {
    const summaryTable = [
        { label: "Causa Provável", value: "Engine Unity / Gerenciamento de FPS" },
        { label: "Solução #1", value: "Desativar V-Sync no Jogo / Ativar no Driver" },
        { label: "Solução Mod", value: "Hollow Knight Fix (Mod de terceiros)" },
        { label: "Dificuldade", value: "Fácil" }
    ];

    const contentSections = [
        {
            title: "O Stuttering no Reino de Hallownest",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Embora seja um jogo visualmente deslumbrante e leve em termos de hardware, o **Hollow Knight** sofre com um problema técnico comum da engine Unity: o gerenciamento inconsistente de frames. Em 2026, com monitores de alta taxa de atualização (144Hz+), essas pequenas travadinhas (micro-stuttering) podem atrapalhar a precisão necessária para enfrentar chefes difíceis no Panteão.
        </p>
      `
        },
        {
            title: "1. O Problema do V-Sync Interno",
            content: `
        <p class="mb-4 text-gray-300">O V-Sync nativo do Hollow Knight é conhecido por causar lag de entrada e travadas:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Abra as configurações do jogo e <strong>DESATIVE</strong> o V-Sync.</li>
            <li>Abra o Painel de Controle da NVIDIA ou o Software AMD.</li>
            <li>Vá em 'Configurações do Programa' e adicione o Hollow Knight.</li>
            <li>Force o <strong>V-Sync para 'Ligado' (On)</strong> através do driver da placa de vídeo.</li>
            <li>Isso estabiliza o tempo de quadro (frame time) de forma muito mais eficiente que o próprio jogo.</li>
        </ol>
      `
        },
        {
            title: "2. Modificando o Engine (Hollow Knight Fix)",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Correção de Comunidade:</h4>
            <p class="text-sm text-gray-300">
                Existe um mod popular chamado <strong>'Hollow Knight Fix'</strong> disponível no Nexus Mods. Ele reescreve como o jogo lida com a entrada de dados e a sincronização do motor Unity. Em 2026, ele é considerado essencial para quem joga em computadores modernos com Windows 11 para evitar o 'tearing' e as oscilações de performance.
            </p>
        </div>
      `
        },
        {
            title: "3. Dica de Fullscreen",
            content: `
        <p class="mb-4 text-gray-300">
            Sempre jogue em modo <strong>'Tela Cheia Exclusiva'</strong>. 
            <br/><br/>O modo 'Janela sem Bordas' no Hollow Knight costuma entrar em conflito com o gerenciador de janelas do Windows, o que causa quedas bruscas de frames quando uma notificação aparece ou quando o sistema decide fazer uma tarefa em segundo plano.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/reduzir-ping-jogos-online",
            title: "Stuttering Geral",
            description: "Causas de travadas em jogos modernos."
        },
        {
            href: "/guias/calibrar-cores-monitor",
            title: "Calibrar Monitor",
            description: "Deixe a estética do jogo ainda mais bonita."
        },
        {
            href: "/guias/otimizacao-performance",
            title: "Performance Windows",
            description: "Ajuste o sistema para jogos Unity."
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
