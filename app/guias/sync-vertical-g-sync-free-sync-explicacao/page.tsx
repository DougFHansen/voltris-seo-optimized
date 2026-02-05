import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'sync-vertical-g-sync-free-sync-explicacao',
  title: "G-Sync vs FreeSync vs V-Sync: Qual usar em 2026?",
  description: "Entenda as diferenças entre V-Sync, G-Sync e FreeSync. Saiba como acabar com o Screen Tearing (tela rasgando) e reduzir o input lag em 2026.",
  category: 'windows-geral',
  difficulty: 'Intermediário',
  time: '15 min'
};

const title = "G-Sync vs FreeSync vs V-Sync: Qual usar em 2026?";
const description = "Entenda as diferenças entre V-Sync, G-Sync e FreeSync. Saiba como acabar com o Screen Tearing (tela rasgando) e reduzir o input lag em 2026.";
const keywords = [
    'g-sync vs freesync qual melhor 2026 guia',
    'v-sync aumenta o input lag tutorial 2026',
    'como ativar g-sync no monitor freesync tutorial',
    'screen tearing como resolver windows 11 guia 2026',
    'nvidia g-sync compatible vs native diferencas'
];

export const metadata: Metadata = createGuideMetadata('sync-vertical-g-sync-free-sync-explicacao', title, description, keywords);

export default function SyncTechnologyGuide() {
    const summaryTable = [
        { label: "V-Sync", value: "Antigo / Causa alto Input Lag" },
        { label: "G-Sync (NVIDIA)", value: "Excelente / Exige GPU NVIDIA" },
        { label: "FreeSync (AMD)", value: "Padrão aberto / Funciona em quase tudo" },
        { label: "Escolha Gamer", value: "G-Sync/FreeSync + Cap de FPS" }
    ];

    const contentSections = [
        {
            title: "O que é o Screen Tearing?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Imagine que sua placa de vídeo está enviando 100 quadros por segundo, mas seu monitor só consegue mostrar 60. O resultado é o **Screen Tearing**: uma linha horizontal que divide a imagem, como se ela estivesse "rasgada". Para resolver isso, inventaram as tecnologias de sincronização, que garantem que o monitor e a GPU falem a mesma língua em 2026.
        </p>
      `
        },
        {
            title: "1. V-Sync: A solução do passado",
            content: `
        <p class="mb-4 text-gray-300">O V-Sync força a GPU a esperar o monitor:</p>
        <p class="text-sm text-gray-300">
            Embora resolva o rasgo da imagem, o <strong>V-Sync clássico</strong> introduz um atraso de resposta (Input Lag) terrível. Em jogos competitivos como Valorant ou CS2, isso pode fazer você perder o tempo de reação. Em 2026, recomendamos deixar o V-Sync sempre **desativado** dentro dos jogos se você tiver acesso a tecnologias mais modernas.
        </p>
      `
        },
        {
            title: "2. G-Sync e FreeSync: VRR (Variable Refresh Rate)",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">A Revolução Fluida:</h4>
            <p class="text-sm text-gray-300">
                Diferente do V-Sync, o **G-Sync (NVIDIA)** e o **FreeSync (AMD)** fazem o monitor esperar a GPU. Se o seu jogo cair para 47 FPS, o monitor muda sua frequência para 47Hz instantaneamente. Isso elimina o tearing e as travadinhas (stuttering) sem aumentar o input lag de forma perceptível. Em 2026, a maioria dos monitores é 'G-Sync Compatible', o que significa que funcionam com GPUs NVIDIA mesmo sendo oficialmente FreeSync.
            </p>
        </div>
      `
        },
        {
            title: "3. Configuração Perfeita 2026",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>Como configurar para latência mínima:</strong> 
            <br/><br/>Se você tem um monitor de 144Hz com G-Sync/FreeSync, a recomendação dos especialistas é: <br/>
            1. Ative o G-Sync/FreeSync no Painel de Controle da GPU. <br/>
            2. Ative o V-Sync **apenas** no Painel de Controle da NVIDIA/AMD (e desative dentro do jogo). <br/>
            3. Limite o seu FPS em **3 quadros abaixo** da frequência do monitor (ex: 141 FPS para 144Hz). Isso garante que você nunca saia do alcance da sincronização variável, mantendo a imagem perfeita e o input lag no menor nível possível.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/monitor-ips-vs-va-vs-tn-jogos",
            title: "Escolher Monitor",
            description: "Diferenças de painel e tempo de resposta."
        },
        {
            href: "/guias/valorant-reduzir-input-lag",
            title: "Reduzir Input Lag",
            description: "Otimizações extremas para pro-players."
        },
        {
            href: "/guias/limitar-fps-rivatuner-nvidia",
            title: "Limitar FPS",
            description: "Use o RTSS para estabilizar sua fluidez."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="15 min"
            difficultyLevel="Intermediário"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
