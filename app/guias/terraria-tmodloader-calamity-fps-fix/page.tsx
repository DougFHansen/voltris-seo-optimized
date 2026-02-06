import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'terraria-tmodloader-calamity-fps-fix',
    title: "Terraria & TModLoader (2026): Lag Fix para Modpacks (Calamity)",
    description: "Terraria fica em câmera lenta (slow motion) quando tem muitos projéteis? Aprenda a corrigir o Frame Skip, alocar mais RAM para 64-bit TModLoader e otimizar efeitos.",
    category: 'jogos',
    difficulty: 'Intermediário',
    time: '20 min'
};

const title = "Terraria 1.4.4 / TModLoader (2026): Otimização Mods";
const description = "O jogo vanilla é leve, mas jogando Calamity + Thorium + Overhaul, o motor do jogo pede socorro. Resolva o 'Frame Skip' e jogue fluido.";

const keywords = [
    'terraria slow motion fix frame skip',
    'tmodloader 64 bit ram usage increase',
    'calamity mod lag boss fight',
    'terraria stuttering high fps fix',
    'lighting mode color retro white terraria',
    'backgrounds off performance',
    'host multiplayer lag terraria',
    'voltris optimizer re-logic',
    'fix tela travando terraria'
];

export const metadata: Metadata = createGuideMetadata('terraria-tmodloader-calamity-fps-fix', title, description, keywords);

export default function TerrariaGuide() {
    const summaryTable = [
        { label: "Frame Skip", value: "ON (Fix Slowmo)" },
        { label: "Lighting", value: "Retro / White" },
        { label: "Background", value: "OFF" },
        { label: "Quality", value: "Low / Auto" },
        { label: "TModLoader", value: "64-bit (Steam)" },
        { label: "Bosses", value: "Reducer Mod" },
        { label: "Parallax", value: "0%" }
    ];

    const contentSections = [
        {
            title: "Introdução: O Efeito Câmera Lenta",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Terraria liga o tempo do jogo ao Frame Rate. Se seu PC não consegue fazer 60 quadros, o jogo desacelera o tempo para compensar (fica tudo lento).
        </p>
      `
        },
        {
            title: "Capítulo 1: Frame Skip (A Solução)",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Settings > Video</h4>
                <p class="text-gray-400 text-xs text-justify">
                    - <strong>Frame Skip:</strong> ON ou Subtle.
                    <br/>Isso força o jogo a pular quadros visuais para manter a "velocidade do jogo" real.
                    <br/>Se deixar OFF e o FPS cair, você vai parecer que está nadando no mel.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Iluminação (Lighting Mode)",
            content: `
        <p class="mb-4 text-gray-300">
            A iluminação "Color" ou "Trippy" é bonita, mas calcula luz pixel a pixel.
            <br/>Em eventos como "Pumpkin Moon" com milhares de partículas:
            <br/>Mude para <strong>Retro</strong> ou <strong>White</strong>.
            <br/>O jogo fica com visual mais simples (blocos iluminados uniformemente), mas o ganho de FPS é gigante.
        </p>
      `
        },
        {
            title: "Capítulo 3: TModLoader 64-bit",
            content: `
        <p class="mb-4 text-gray-300">
            O Terraria original era 32-bit (limitado a 4GB RAM).
            <br/>O TModLoader na Steam hoje já é 64-bit nativo (versão 1.4+).
            <br/>Isso permite usar modpacks gigantes sem dar "Out of Memory". Apenas certifique-se de estar rodando a versão "1.4.4 stable" na Steam.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: Config.json e Mods de Performance",
            content: `
        <p class="mb-4 text-gray-300">
            Baixe o mod <strong>"Lag Remover"</strong> ou <strong>"High FPS Support"</strong> no navegador de mods.
            <br/>Eles reduzem partículas de poeira e efeitos de projéteis que você nem vê no calor da batalha.
            <br/>Edite <code>config.json</code> para desativar "Heat Distortion" (efeito de calor no deserto) que buga em algumas GPUs.
        </p>
      `
        },
        {
            title: "Capítulo 5: Backgrounds e Parallax",
            content: `
        <p class="mb-4 text-gray-300">
            - <strong>Background:</strong> OFF. Remove o cenário de fundo animado.
            - <strong>Parallax:</strong> 0%. Remove o efeito de profundidade do fundo.
            <br/>Isso alivia a GPU para focar apenas nos sprites da frente.
        </p>
      `
        },
        {
            title: "Capítulo 6: Calamity Mod Config",
            content: `
        <p class="mb-4 text-gray-300">
            Se joga Calamity:
            <br/>Vá em Settings > Mod Configuration > Calamity Mod.
            <br/>Ative <strong>"Reduce particle effects"</strong> e desative <strong>"Afterimages"</strong>.
            <br/>Bosses como "Supreme Calamitas" enchem a tela de "bullet hell". Sem essas opções, o FPS vai a 10.
        </p>
      `
        },
        {
            title: "Capítulo 7: Stuttering em Monitor 144Hz",
            content: `
        <p class="mb-4 text-gray-300">
            Terraria pode bugar acima de 60Hz (animações aceleradas).
            <br/>Recomendação: Limite o FPS a 60 no Painel Nvidia ou ative V-Sync no jogo para ter a experiência mais estável e livre de glitches.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: Multiplayer Host",
            content: `
            <p class="mb-4 text-gray-300">
                Se você é o host, não minimize o jogo (Alt-Tab).
                <br/>O jogo pode reduzir prioridade e lagar os amigos. Use "Host & Play" com senha.
            </p>
            `
        },
        {
            title: "Capítulo 9: Waves / Events",
            content: `
            <p class="mb-4 text-gray-300">
                Em eventos de onda (Old One's Army), o número de inimigos é enorme.
                <br/>Use armas que não criam muitos projéteis persistentes (evite armas que enchem a tela de partículas se estiver lagando).
            </p>
            `
        },
        {
            title: "Capítulo 10: Mapas (Minimap)",
            content: `
            <p class="mb-4 text-gray-300">
                Dados do mapa explorado ficam na RAM.
                <br/>Em mundos "Large" totalmente explorados, o save fica pesado. É normal demorar mais para salvar.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Terraria roda em 4K?",
            answer: "Sim, mas a UI fica minúscula. Aumente a escala da UI nas opções para 150% ou 200%. O jogo fica lindo com zoom out máximo."
        },
        {
            question: "Meus mods sumiram!",
            answer: "O TModLoader atualiza frequentemente. Às vezes desabilita mods incompatíveis. Cheque o menu 'Manage Mods' e reative, ou espere o autor do mod atualizar."
        },
        {
            question: "Tela ondulando?",
            answer: "Desligue 'Waves Quality' e 'Heat Distortion'. Efeitos de shader de água."
        }
    ];

    const externalReferences = [
        { name: "TModLoader Steam", url: "https://store.steampowered.com/app/1281930/tModLoader/" },
        { name: "Calamity Mod Wiki", url: "https://calamitymod.wiki.gg/" }
    ];

    const relatedGuides = [
        {
            href: "/guias/minecraft-aumentar-fps-fabric-sodium",
            title: "Minecraft",
            description: "Outro sandbox otimizável."
        },
        {
            href: "/guias/cheat-engine-speedhack-jogos-offline",
            title: "Cheat Engine",
            description: "Pular a noite."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="20 min"
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
