import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'genshin-impact-stuttering-fix-pc',
  title: "Genshin Impact travando ou com Stuttering? Como resolver no PC",
  description: "Seu Genshin Impact sofre com quedas de FPS ao trocar de personagem ou explorar o mapa? Aprenda a otimizar o cache de shaders e as configurações gráfic...",
  category: 'games-fix',
  difficulty: 'Iniciante',
  time: '15 min'
};

const title = "Genshin Impact travando ou com Stuttering? Como resolver no PC";
const description = "Seu Genshin Impact sofre com quedas de FPS ao trocar de personagem ou explorar o mapa? Aprenda a otimizar o cache de shaders e as configurações gráficas.";
const keywords = [
    'genshin impact stuttering fix pc 2026',
    'como aumentar fps genshin impact pc fraco',
    'genshin impact lag ao trocar personagem fix',
    'otimizar genshin impact windows 11 2026',
    'melhor configuração grafica genshin impact fps'
];

export const metadata: Metadata = createGuideMetadata('genshin-impact-stuttering-fix-pc', title, description, keywords);

export default function GenshinFixGuide() {
    const summaryTable = [
        { label: "Check #1", value: "Shader Cache (Ilimitado na GPU)" },
        { label: "Check #2", value: "V-Sync (Desativado no Jogo)" },
        { label: "Check #3", value: "Densidade de Multidão (Baixo)" },
        { label: "Dificuldade", value: "Fácil" }
    ];

    const contentSections = [
        {
            title: "Por que o Genshin Impact dá 'stuttering'?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Mesmo em PCs potentes, o Genshin Impact pode sofrer com pequenas travadas ao carregar texturas de novos ambientes ou efeitos de partículas de novos ataques (Burst). Isso acontece porque o jogo usa o motor Unity, que às vezes tem dificuldades em gerenciar o streaming de assets em tempo real a partir de HDs ou SSDs lentos.
        </p>
      `
        },
        {
            title: "1. Otimização do Cache de Shaders (NVIDIA/AMD)",
            content: `
        <p class="mb-4 text-gray-300">A solução mais eficaz é dar mais espaço para o driver armazenar os cálculos gráficos:</p>
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <p class="text-sm text-gray-300">
                Vá no seu <strong>Painel de Controle da NVIDIA</strong> > Gerenciar Configurações em 3D > Procure por 'Tamanho do cache do sombreador' e coloque em <strong>10GB ou Ilimitado</strong>. Isso reduz drasticamente os engasgos que acontecem na primeira vez que você usa uma habilidade em cada sessão de jogo.
            </p>
        </div>
      `
        },
        {
            title: "2. Configurações que Comem FPS",
            content: `
        <ul class="list-disc list-inside text-gray-300 space-y-3">
            <li><strong>Resolução de Renderização:</strong> Mantenha em 1.0 ou 0.8 (se o PC for muito fraco). Acima de 1.0 o peso aumenta exponencialmente.</li>
            <li><strong>Sombra:</strong> Baixo. Sombras no Genshin são processadas pela CPU e GPU simultaneamente.</li>
            <li><strong>Efeitos Visuais:</strong> Médio. No Alto, o FPS cai sempre que muitos personagens usam Ultimates juntos.</li>
            <li><strong>Bloom:</strong> Desativar (Isso ajuda na clareza visual e ganho de alguns frames).</li>
        </ul >
      `
        },
        {
            title: "3. Prioridade de Processamento",
            content: `
        <p class="mb-4 text-gray-300">
            Abra o Genshin Impact, minimize o jogo e abra o Gerenciador de Tarefas. 
            <br/>Vá na aba 'Detalhes', procure por <strong>GenshinImpact.exe</strong>, clique com o botão direito > Definir Prioridade > <strong>Acima do Normal</strong>. Isso garante que o Windows dê atenção especial ao jogo sobre processos de fundo inúteis.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/atualizacao-drivers-video",
            title: "Drivers de Vídeo",
            description: "Essencial para a performance do motor Unity."
        },
        {
            href: "/guias/aceleracao-hardware-gpu-agendamento",
            title: "Agendamento de GPU",
            description: "Ative para ganhar estabilidade no Windows 11."
        },
        {
            href: "/guias/stardew-valley-mods-lag-fix",
            title: "Fix Lag Mods",
            description: "Dicas de performance para jogos Unity."
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
