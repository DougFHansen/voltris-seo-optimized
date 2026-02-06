import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'steam-deck-otimizacao-cryoutilities-protonge-guia',
    title: "Steam Deck (2026): Otimização Extrema com CryoUtilities e ProtonGE",
    description: "Faça seu Steam Deck rodar jogos pesados (AAA) melhor. Guia de CryoUtilities 2.0, aumento de VRAM para 4GB na BIOS e instalação do ProtonGE.",
    category: 'emulacao',
    difficulty: 'Avançado',
    time: '45 min'
};

const title = "Steam Deck Turbo (2026): O Guia Definitivo";
const description = "O Steam Deck vem configurado de fábrica para 'compatibilidade'. Para 'performance', precisamos mexer onde a Valve não mexe: Swap File e VRAM.";

const keywords = [
    'melhorar performance steam deck cryoutilities 2.0',
    'aumentar vram bios steam deck 4gb',
    'como instalar protonge protonup-qt',
    'decky loader plugins powertools',
    'steam deck travando jogos pesados',
    'swap file resize steam deck',
    'voltris optimizer handheld',
    'fsr 3.0 steam deck settings'
];

export const metadata: Metadata = createGuideMetadata('steam-deck-otimizacao-cryoutilities-protonge-guia', title, description, keywords);

export default function SteamDeckGuide() {
    const summaryTable = [
        { label: "Ferramenta", value: "CryoUtilities 2.0" },
        { label: "VRAM (BIOS)", value: "4GB (UMA Frame Buffer)" },
        { label: "Swap File", value: "16GB (No SSD)" },
        { label: "Swappiness", value: "1 (Agressivo)" },
        { label: "Proton", value: "GE-Proton (Latest)" },
        { label: "Plugin", value: "Decky Loader" },
        { label: "Refresh Rate", value: "40Hz / 40FPS (Bateria)" }
    ];

    const contentSections = [
        {
            title: "Introdução: Otimizando o Hardware",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O Steam Deck tem 16GB de RAM compartilhada entre CPU e GPU. O padrão reserva apenas 1GB para vídeo. Em jogos modernos (The Last of Us, Hogwarts Legacy), isso causa stutters horríveis. Vamos corrigir isso.
        </p>
      `
        },
        {
            title: "Capítulo 1: Aumentando a VRAM (UMA Buffer)",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Na BIOS</h4>
                <p class="text-gray-400 text-xs text-justify">
                    1. Desligue o Steam Deck completamente.
                    <br/>2. Segure <strong>Volume +</strong> e aperte o botão <strong>Power</strong>. Solte o Power quando ouvir o som, mantenha o Volume +.
                    <br/>3. Vá em <strong>Setup Utility</strong> > <strong>Advanced</strong>.
                    <br/>4. Mude <strong>UMA Frame Buffer Size</strong> de 1G para <strong>4G</strong>.
                    <br/>Isso garante que jogos pesados tenham 4GB de vídeo dedicados sempre, evitando quedas bruscas.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: CryoUtilities 2.0 (O Salvador)",
            content: `
        <p class="mb-4 text-gray-300">
            Esta ferramenta (criada pelo CryoByte33) otimiza o gerenciamento de memória do Linux.
            <br/>1. Entre no Modo Desktop.
            <br/>2. Baixe o instalador do CryoUtilities no GitHub.
            <br/>3. Execute e clique em <strong>"Recommended Settings"</strong>.
            <br/>O que ele faz? Cria um Swap File gigante de 16GB no SSD e muda o Swappiness para 1. Isso impede que o jogo crashe por falta de memória RAM.
        </p>
      `
        },
        {
            title: "Capítulo 3: Proton GE (Glorious Eggroll)",
            content: `
        <p class="mb-4 text-gray-300">
            A versão oficial do Proton da Valve é boa, mas o <strong>Proton GE</strong> é melhor. Ele tem correções para vídeos que não rodam, FSR mais novo e patches específicos para jogos novos.
            <br/>1. No Modo Desktop, abra a loja "Discover".
            <br/>2. Instale o <strong>ProtonUp-Qt</strong>.
            <br/>3. Abra o app e clique em "Add Version". Baixe o GE-Proton mais recente.
            <br/>4. No Modo Gaming, vá nas propriedades do jogo > Compatibilidade > Forçar uso de > GE-Proton.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: Decky Loader & PowerTools",
            content: `
        <p class="mb-4 text-gray-300">
            Decky Loader é a loja de plugins da comunidade.
            <br/>Instale-o (via terminal no Desktop Mode com vídeo tutorial).
            <br/>Baixe o plugin <strong>PowerTools</strong>.
            <br/>Com ele, você pode desativar o SMT (Simultaneous Multi-Threading) da CPU.
            <br/>Em emuladores (Yuzu/Switch), desligar o SMT (deixar só 4 núcleos físicos) aumenta o FPS drasticamente.
        </p>
      `
        },
        {
            title: "Capítulo 5: FSR e 40Hz Mode",
            content: `
        <p class="mb-4 text-gray-300">
            A regra de ouro da bateria: 40FPS sentem como 60FPS, mas gastam como 30FPS.
            <br/>No menu "..." (Performance):
            <br/>- Mude a taxa de atualização para 40Hz.
            <br/>- Trave o FPS em 40.
            <br/>- Ative o FSR (FidelityFX Super Resolution) com Sharpness 2 se for rodar o jogo em resolução menor (ex: 540p) para upscaling.
        </p>
      `
        },
        {
            title: "Capítulo 6: Shader Cache (Armazenamento)",
            content: `
        <p class="mb-4 text-gray-300">
            O Steam Deck baixa shaders pre-compilados. Se você tem 64GB, isso lota o drive rápido.
            <br/>Use a ferramenta <strong>"ZShaderCacheMover"</strong> ou link simbólico para mover a pasta <code>shadercache</code> para o cartão MicroSD (se for um cartão A2 rápido).
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 7: Windows no Deck (Dual Boot)",
            content: `
            <p class="mb-4 text-gray-300">
                Vale a pena instalar Windows?
                <br/>Só se você joga <strong>Call of Duty, Fortnite, Destiny 2 ou FIFA/FC</strong> (jogos com Anti-Cheats incompatíveis com Linux).
                <br/>Para o resto, o SteamOS é mais otimizado e a experiência de "console" é melhor.
            </p>
            `
        },
        {
            title: "Capítulo 8: Streaming (Moonlight)",
            content: `
            <p class="mb-4 text-gray-300">
                Se você tem um PC Gamer parrudo em casa:
                <br/>Não rode Cyberpunk no Deck. Rode no PC e faça stream para o Deck usando <strong>Moonlight</strong> (Sunshine no PC).
                <br/>Bateria dura 6 horas, gráficos Ultra, zero calor na mão.
            </p>
            `
        },
        {
            title: "Capítulo 9: SSD Upgrade",
            content: `
            <p class="mb-4 text-gray-300">
                Trocar o SSD 2230 é fácil. Use marcas confiáveis (Sabrent, Corsair). SSDs genéricos do AliExpress esquentam e gastam mais bateria.
            </p>
            `
        },
        {
            title: "Capítulo 10: Skins e Proteção",
            content: `
            <p class="mb-4 text-gray-300">
                O Deck esquenta atrás. Não cubra a saída de ar com skins adesivas baratas. Use capas que respeitem o fluxo de ar.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "CryoUtilities estraga o Deck?",
            answer: "Não. É totalmente seguro e reversível (botão Stock Settings). Milhares de pessoas usam."
        },
        {
            question: "4GB VRAM faz diferença em indies?",
            answer: "Não. Em jogos leves (Hades, Stardew Valley), 1GB vs 4GB dá na mesma. A diferença é só em jogos AAA que usam muitas texturas."
        }
    ];

    const externalReferences = [
        { name: "CryoUtilities GitHub", url: "https://github.com/CryoByte33/steam-deck-utilities" },
        { name: "ProtonUp-Qt (Discover)", url: "https://davidotek.github.io/protonup-qt/" }
    ];

    const relatedGuides = [
        {
            href: "/guias/yuzu-ryujinx-otimizacao-zelda-mario-60fps-guia",
            title: "Emulação Switch",
            description: "Performance no Deck."
        },
        {
            href: "/guias/rog-ally-legion-go-otimizacao-windows-tdp-guia",
            title: "ROG Ally",
            description: "Comparativo."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="45 min"
            difficultyLevel="Avançado"
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
