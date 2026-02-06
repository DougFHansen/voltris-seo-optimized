import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'genshin-impact-fps-unlocker-pc',
    title: "Genshin Impact (2026): 120 FPS Unlock, Filtros e Otimização",
    description: "O Genshin trava em 60 FPS por padrão. Aprenda a desbloquear para 120 FPS (Modo seguro), reduzir o stuttering da Unity Engine e melhorar as cores.",
    category: 'jogos',
    difficulty: 'Intermediário',
    time: '40 min'
};

const title = "Genshin Impact Ultra (2026): 120 FPS e Gráficos Vivos";
const description = "O jogo é lindo, mas o limite de 60 FPS no PC é frustrante (enquanto iPhone tem 120). Veja como quebrar esse limite e otimizar o carregamento de texturas.";

const keywords = [
    'genshin impact fps unlocker download 2026',
    'como jogar genshin impact a 120 fps pc',
    'genshin impact travando stuttering fix',
    'render resolution 0.8 genshin',
    'nvidia filters genshin impact cores',
    'desativar volumetric fog genshin',
    'melhores configurações graficas genshin impact',
    'honkai star rail 120 fps unlock',
    'voltris optimizer genshin priority',
    'sombra genshin impact desempenho'
];

export const metadata: Metadata = createGuideMetadata('genshin-impact-fps-unlocker-pc', title, description, keywords);

export default function GenshinGuide() {
    const summaryTable = [
        { label: "FPS Unlock", value: "Via Tool (120/144)" },
        { label: "Render Res", value: "1.0 ou 0.8" },
        { label: "Shadows", value: "Medium" },
        { label: "Volumetric", value: "Off/Low" },
        { label: "Reflections", value: "Off" },
        { label: "Motion Blur", value: "Off" },
        { label: "Bloom", value: "On (Estilo)" }
    ];

    const contentSections = [
        {
            title: "Introdução: O Polêmico 60 FPS",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          A Hoyoverse liberou 120 FPS para dispositivos Apple, mas no PC, anos se passaram e o limite continua 60 FPS. Felizmente, a comunidade criou um Unlocker que edita a memória do jogo para permitir fluidez total.
        </p>
         <div class="bg-[#0A0A0F] border border-yellow-500/30 p-5 rounded-xl my-6">
            <h4 class="text-yellow-400 font-bold mb-2">Nota sobre Banimentos</h4>
            <p class="text-gray-300 text-sm">
                O uso de FPS Unlocker (ex: 3dmigoto ou o launcher github) é tolerado há anos. Não há relatos de banimento massivo APENAS por desbloquear FPS. Mas use por sua conta e risco. Não use mod de skins ou cheats junto.
            </p>
        </div>
      `
        },
        {
            title: "Capítulo 1: Configurações Gráficas (Vanilla)",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Render Resolution</h4>
                <p class="text-white font-mono text-sm mb-2">Recomendado: <span class="text-emerald-400">1.0 (Nativo)</span></p>
                <p class="text-gray-400 text-xs">Se seu PC for fraco, use 0.8. É melhor que baixar a resolução do monitor. 0.6 fica muito borrado.</p>
            </div>
             <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Volumetric Fog (Neblina)</h4>
                <p class="text-white font-mono text-sm mb-2">Recomendado: <span class="text-red-400">Off/Low</span></p>
                <p class="text-gray-400 text-xs">
                   A neblina em lugares como Inazuma ou Dragonspine pesa muito. Desligar deixa o jogo mais nítido e leve.
                </p>
            </div>
             <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">SFX Quality (Efeitos)</h4>
                <p class="text-white font-mono text-sm mb-2">Recomendado: <span class="text-yellow-400">Low/Medium</span></p>
                <p class="text-gray-400 text-xs">
                    Em combate (Abismo), muitas ults ao mesmo tempo (Kazuha + Neuvillette) causam lag. Low resolve isso.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: FPS Unlocker (Tutorial)",
            content: `
        <ol class="list-decimal list-inside text-gray-300 text-sm space-y-2">
            <li>Procure no GitHub por <strong>"Genshin Impact FPS Unlocker"</strong> (o repositório com mais estrelas, geralmente do '34736384').</li>
            <li>Baixe o executável.</li>
            <li>Abra o Unlocker (como Admin).</li>
            <li>Aponte para o <code>GenshinImpact.exe</code> (na pasta do jogo).</li>
            <li>Define o FPS Target para <strong>120</strong> ou <strong>144</strong>.</li>
            <li>Clique em "Start Game". O jogo abrirá com o limite quebrado.</li>
        </ol>
        <p class="mt-2 text-xs text-gray-400">
            Você precisa abrir o jogo pelo Unlocker toda vez (ou configurar ele para injetar auto).
        </p>
      `
        },
        {
            title: "Capítulo 3: Filtros Nvidia (Freestyle)",
            content: `
        <p class="mb-4 text-gray-300">
            O Genshin tem um filtro cinza/lavado por padrão.
            <br/>Se você tem Nvidia, aperte <strong>Alt+F3</strong>.
            <br/>Adicione os filtros:
            <br/>1. <strong>Detalhes (Details):</strong> Claridade +20%, Sharpen +10%.
            <br/>2. <strong>Cor (Color):</strong> Vibrance +20%, Tint 0%.
            <br/>O jogo fica muito mais vivo e vibrante, parecido com anime moderno. Custa cerca de 5 FPS.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: Sombras e Reflexos",
            content: `
        <p class="mb-4 text-gray-300">
            - <strong>Shadow Quality:</strong> Medium. (High é pesadíssimo, Low perde a sombra do personagem).
            - <strong>Visual Effects:</strong> Medium.
            - <strong>Reflections:</strong> Off. (Os reflexos na água não valem o custo de performance).
        </p>
      `
        },
        {
            title: "Capítulo 5: Anti-Aliasing (SMAA vs TAA)",
            content: `
        <p class="mb-4 text-gray-300">
            - <strong>SMAA:</strong> Mais leve, mas deixa algumas bordas serrilhadas em movimento.
            - <strong>TAA:</strong> Remove todo serrilhado, mas borra um pouco a imagem.
            <br/>Recomendação: Use <strong>SMAA</strong> para nitidez ou <strong>TAA</strong> se você odeia serrilhados.
        </p>
      `
        },
        {
            title: "Capítulo 6: Crowd Density (NPCs)",
            content: `
        <p class="mb-4 text-gray-300">
            Em cidades como Fontaine e Sumeru, há muitos NPCs.
            <br/>Defina Crowd Density para <strong>Low</strong>.
            <br/>Isso remove NPCs irrelevantes de fundo, aliviando a CPU na cidade, sem afetar quests.
        </p>
      `
        },
        {
            title: "Capítulo 7: Co-Op Effect",
            content: `
        <p class="mb-4 text-gray-300">
            "Co-Op Teammate Effects": Se estiver jogando multiplayer, coloque em <strong>"Partially Off"</strong>.
            <br/>Isso faz os efeitos das skills dos seus amigos ficarem transparentes. Ajuda a ver o inimigo no meio da bagunça visual.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: Honkai: Star Rail e ZZZ",
            content: `
            <p class="mb-4 text-gray-300">
                As mesmas ferramentas de Unlocker geralmente funcionam para Honkai: Star Rail e Zenless Zone Zero, pois usam a mesma Unity Engine e estrutura de proteção. O processo é idêntico.
            </p>
            `
        },
        {
            title: "Capítulo 9: SSD e Loading",
            content: `
            <p class="mb-4 text-gray-300">
                O teletransporte demora?
                <br/>Genshin PRECISA de SSD. Em HDD, o teleporte leva 30 segundos. Em NVMe, leva 2 segundos. Não sofra, instale no SSD.
            </p>
            `
        },
        {
            title: "Capítulo 10: Integridade dos Arquivos",
            content: `
            <p class="mb-4 text-gray-300">
                Se o jogo fechar sozinho (Crash) frequentemente:
                <br/>No Launcher, clique nos "três riscos" ao lado do botão Jogar > Reparar Agora.
                <br/>Genshin costuma corromper arquivos durante updates grandes.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Posso ser banido por usar Filtros Nvidia?",
            answer: "Não. Os filtros Nvidia (Freestyle) são suportados oficialmente pela Hoyoverse e pelo driver. É 100% seguro."
        },
        {
            question: "Genshin esquenta muito a GPU?",
            answer: "Sim, se você desbloquear o FPS. Limite a 120 FPS. Se deixar Ilimitado no menu do Unlocker, ele vai tentar fazer 300 FPS e sua GPU vai virar um forno à toa."
        },
        {
            question: "Global Illumination no PS5 vs PC?",
            answer: "O PS5 tem uma iluminação exclusiva volumétrica nas nuvens que o PC (ainda) não tem oficialmente no Ultra. Não adianta procurar no menu, não existe no PC por enquanto."
        }
    ];

    const externalReferences = [
        { name: "Genshin FPS Unlocker GitHub", url: "https://github.com/34736384/genshin-fps-unlock" },
        { name: "KeqingMains (Theorycrafting & Guides)", url: "https://keqingmains.com/" },
        { name: "Genshin Impact Map (Interativo)", url: "https://genshin-impact-map.appsample.com/" }
    ];

    const relatedGuides = [
        {
            href: "/guias/otimizacao-ssd-windows-11",
            title: "SSD",
            description: "Teleportes rápidos."
        },
        {
            href: "/guias/nvidia-painel-controle-melhores-configuracoes",
            title: "Nvidia",
            description: "Filtros e DSR."
        },
        {
            href: "/guias/monitor-hz-configuracao-correta",
            title: "Monitor",
            description: "Aproveite os 120 FPS."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="40 min"
            difficultyLevel="Intermediário"
            contentSections={contentSections}
            advancedContentSections={advancedContentSections}
            additionalContentSections={additionalContentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
            faqItems={faqItems}
            externalReferences={externalReferences}
        />
    );
}
