import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Stardew Valley com Lag? Como otimizar Mods e o SMAPI (2026)";
const description = "Seu Stardew Valley demora para abrir ou trava com muitos mods? Aprenda a otimizar o SMAPI e as configurações de vídeo para uma fazenda sem lag.";
const keywords = [
    'stardew valley lag fix mods 2026',
    'como acelerar carregamento smapi stardew valley',
    'stardew valley travando no pc com muitos mods fix',
    'otimizar desempenho stardew valley 1.6 modded',
    'smapi consumindo muita memoria como resolver'
];

export const metadata: Metadata = createGuideMetadata('stardew-valley-mods-lag-fix', title, description, keywords);

export default function StardewLagGuide() {
    const summaryTable = [
        { label: "Check #1", value: "Ajustar Mod: SpriteMaster (Reduz lag de desenho)" },
        { label: "Check #2", value: "Desativar 'Zoom Level' automático" },
        { label: "Destaque", value: "Atualizar para a versão 64 bits do Java" },
        { label: "Dificuldade", value: "Fácil" }
    ];

    const contentSections = [
        {
            title: "Por que o Stardew Valley trava?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O Stardew Valley é um jogo leve, mas o motor **SMAPI** (necessário para rodar mods) pode ficar extremamente pesado se você tiver mais de 50 mods instalados. O jogo tenta carregar todas as texturas modificadas para a memória de uma vez só. Em 2026, com a versão 1.6 e além, o gerenciamento de memória se tornou o principal culpado pelas travadas ao salvar o dia.
        </p>
      `
        },
        {
            title: "1. SpriteMaster: O Mod que salva seu FPS",
            content: `
        <p class="mb-4 text-gray-300">Se você joga com mods, o **SpriteMaster** é obrigatório por dois motivos:</p>
        <ul class="list-disc list-inside text-gray-300 space-y-3">
            <li><strong>Resampling:</strong> Ele melhora o visual dos pixels sem pesar.</li>
            <li><strong>Otimização de Memória:</strong> Ele reescreve a forma como o jogo carrega imagens, reduzindo o tempo de carregamento inicial em até 70%.</li>
            <li><strong>Dica:</strong> Se você não gosta do efeito de "suavização" nos gráficos, você pode desativar o visual e manter apenas as otimizações de código nas configurações do mod.</li>
        </ul >
      `
        },
        {
            title: "2. Corrigindo o Lag no Modo Janela",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Dica de Vídeo:</h4>
            <p class="text-sm text-gray-300">
                O Stardew Valley tem um bug conhecido no Windows 10/11 onde o FPS cai pela metade se você usar o modo 'Janela sem Bordas'. Mude para o modo <strong>'Tela Cheia' (Fullscreen)</strong> real nas opções de vídeo do jogo para garantir que sua placa de vídeo foque 100% no pixel art.
            </p>
        </div>
      `
        },
        {
            title: "3. Otimização do Consoles do SMAPI",
            content: `
        <p class="mb-4 text-gray-300">
            Sempre que você abre o jogo, o console do SMAPI (janela preta) mostra muitos textos. Se houver muitos erros em vermelho, o jogo travará tentando carregar mods quebrados. 
            <br/>Vá ao site <strong>smapi.io/log</strong>, cole seu registro e veja quais mods precisam de atualização. Manter o SMAPI limpo de erros é a forma mais eficaz de evitar que o jogo feche sozinho no meio de um festival.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/genshin-impact-stuttering-fix-pc",
            title: "Genshin Stuttering",
            description: "Dicas de performance para jogos Unity."
        },
        {
            href: "/guias/otimizacao-performance",
            title: "Otimizar PC",
            description: "Prepare o Windows para rodar jogos modded."
        },
        {
            href: "/guias/atualizacao-drivers-video",
            title: "Drivers de Vídeo",
            description: "Ajuste sua GPU para melhores cores no pixel art."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="20 min"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
