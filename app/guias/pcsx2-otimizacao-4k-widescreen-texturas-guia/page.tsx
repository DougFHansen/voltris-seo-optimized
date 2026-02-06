import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'pcsx2-otimizacao-4k-widescreen-texturas-guia',
    title: "PCSX2 (2026): Configuração de PS2 em 4K e Texturas HD",
    description: "Revisite os clássicos do PlayStation 2 (God of War, Shadow of the Colossus, Black) em 4K, 60FPS e com Widescreen Patch. Guia do PCSX2 Nightly (Qt).",
    category: 'emulacao',
    difficulty: 'Intermediário',
    time: '25 min'
};

const title = "PS2 Remastered: PCSX2 Nightly Guide";
const description = "O PCSX2 evoluiu muito. A versão Nightly (Qt) tem interface moderna, atualizações automáticas e performance incrível. Esqueça a versão 1.6.0 antiga.";

const keywords = [
    'pcsx2 melhor configuração pc fraco 2026',
    'god of war 2 pcsx2 60fps slow motion fix',
    'shadow of the colossus texture pack hd',
    'black ps2 4k settings',
    'como colocar bios pcsx2 e jogos',
    'widescreen patch ps2 games 16:9',
    'voltris optimizer retro',
    'pcsx2 nightly vs stable'
];

export const metadata: Metadata = createGuideMetadata('pcsx2-otimizacao-4k-widescreen-texturas-guia', title, description, keywords);

export default function PCSX2Guide() {
    const summaryTable = [
        { label: "Versão", value: "Nightly (Latest)" },
        { label: "Renderer", value: "Vulkan / DX11" },
        { label: "Internal Res", value: "3x (1080p) a 6x (4K)" },
        { label: "Blending", value: "High (Visual)" },
        { label: "Texture filtering", value: "Bilinear (PS2) / Trilinear" },
        { label: "Widescreen", value: "Cheats ON" },
        { label: "MTVU", value: "ON (Multi-thread)" }
    ];

    const contentSections = [
        {
            title: "Introdução: Nightly ou Stable?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Sempre use a versão <strong>Nightly</strong> baixada do site oficial. A versão "Stable 1.6.0" tem 4 anos de idade e não suporta Vulkan nem texturas HD corretamente.
        </p>
      `
        },
        {
            title: "Capítulo 1: BIOS e Setup",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Arquivos Necessários</h4>
                <p class="text-gray-400 text-xs text-justify">
                    Você precisa da BIOS do PS2 (arquivo .bin).
                    <br/>Recomendado: <code>SCPH-90001 (USA)</code> ou similar.
                    <br/>Coloque na pasta 'bios' do PCSX2.
                    <br/>Aponte o PCSX2 para sua pasta de ISOs.
                    <br/>A nova interface mostra as capas dos jogos automaticamente.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Gráficos (Upscaling)",
            content: `
        <p class="mb-4 text-gray-300">
            Vá em Settings > Graphics.
            <br/>- <strong>Renderer:</strong> Vulkan (melhor performance) ou Direct3D 11 (mais estável em GPUs velhas).
            <br/>- <strong>Internal Resolution:</strong> O segredo da beleza.
            <br/>- 3x Native (~1080p) - Roda em qualquer GPU média.
            <br/>- 6x Native (~4K) - Imagem cristalina, exige GPU boa (RTX 3060).
            <br/>- <strong>Texture Filtering (Anisotropic):</strong> 16x. Deixa o chão e paredes nítidos de longe sem custar performance.
        </p>
      `
        },
        {
            title: "Capítulo 3: Widescreen Patches (16:9)",
            content: `
        <p class="mb-4 text-gray-300">
            Jogos de PS2 eram 4:3 (quadrados).
            <br/>Ative "Enable Widescreen Patches" no menu.
            <br/>O PCSX2 aplica hacks automaticamente para renderizar mais cenário nas laterais, preenchendo sua TV moderna sem esticar o personagem (gordo).
            <br/>Se o jogo não tiver patch, ele vai esticar. Configure "Aspect Ratio" para 16:9 se preferir tela cheia ou 4:3 se preferir bordas pretas (purista).
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: Packs de Textura HD",
            content: `
        <p class="mb-4 text-gray-300">
            A comunidade cria texturas novas remasterizadas por IA.
            <br/>1. Baixe o pack (ex: "God of War HD Texture Pack").
            <br/>2. Coloque na pasta <code>textures/serial_do_jogo/replacements</code>.
            <br/>3. Em Graphics > Texture Replacement, ative "Load Textures".
            <br/>O jogo muda da água pro vinho. Textos legíveis e UI nítida.
        </p>
      `
        },
        {
            title: "Capítulo 5: Correção de Stutter (EE Cycle Skipping)",
            content: `
        <p class="mb-4 text-gray-300">
            Se seu PC é fraco e o áudio fica lento em câmera lenta (robótico):
            <br/>O emulador está rodando abaixo de 60fps (100% speed).
            <br/>Vá em System > Speedhacks.
            <br/>Aumente o <strong>EE Cycle Skipping</strong> para 1 (Mild) ou 2 (Moderate).
            <br/>Isso faz o emulador pular cálculos da CPU do PS2. O FPS sobe, mas a animação pode parecer menos fluida. É um último recurso.
        </p>
      `
        },
        {
            title: "Capítulo 6: De-interlacing (Tremido)",
            content: `
        <p class="mb-4 text-gray-300">
            Jogos de PS2 entrelaçados (480i) tremem a imagem.
            <br/>O PCSX2 usa desentrelaçamento automático. Se a imagem vibrar muito, aperte F5 para alternar os modos (Bob, Weave, Blend). "Automatic" geralmente é o melhor.
        </p>
      `
        },
        {
            title: "Capítulo 7: 60 FPS Patches",
            content: `
        <p class="mb-4 text-gray-300">
            Alguns jogos rodavam a 30fps ou tinham queda (Shadow of the Colossus).
            <br/>Existem códigos PNACH (Cheats) que forçam 60fps.
            <br/>Requer CPU forte, pois você está dobrando a carga do emulador.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: Savestates",
            content: `
            <p class="mb-4 text-gray-300">
                F1 salva, F3 carrega.
                <br/>Útil para passar partes difíceis, mas NÃO use como save principal. Savestates quebram e corrompem com updates do emulador. Use o Memory Card (Save in-game) sempre que puder.
            </p>
            `
        },
        {
            title: "Capítulo 9: RetroAchievements",
            content: `
            <p class="mb-4 text-gray-300">
                O PCSX2 Nightly suporta Conquistas!
                <br/>Crie conta no RetroAchievements.org, logue no emulador e ganhe troféus jogando clássicos de 2002. Ative o "Hardcore Mode" (sem save state) para valer.
            </p>
            `
        },
        {
            title: "Capítulo 10: Per-Game Settings",
            content: `
            <p class="mb-4 text-gray-300">
                Cada jogo é um universo.
                <br/>Clique com botão direito no jogo na lista > Properties.
                <br/>Você pode configurar upscale 6x para Final Fantasy X (leve) e apenas 2x para Shadow of the Colossus (pesado) individualmente.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Mando via disco (DVD)?",
            answer: "O PCSX2 lê DVDs originais no drive do PC, mas é lento e barulhento. Use o ImgBurn para ripar seu DVD para .ISO e rode do SSD."
        },
        {
            question: "Linhas verticais na tela?",
            answer: "Em resoluções altas (upscaling), alguns jogos de luta (Tekken) mostram linhas pretas nos sprites. Ative o hack 'Align Sprite' ou 'Round Sprite' nas configurações avançadas."
        }
    ];

    const externalReferences = [
        { name: "PCSX2 Nightly Download", url: "https://pcsx2.net/downloads/" },
        { name: "PCSX2 Wiki (Game Configs)", url: "https://wiki.pcsx2.net/" }
    ];

    const relatedGuides = [
        {
            href: "/guias/controle-ps4-ps5-overclock-ds4windows",
            title: "DualSense",
            description: "Usar controle de PS5."
        },
        {
            href: "/guias/rpcs3-otimizacao-configuracao-60fps-patches-guia",
            title: "RPCS3",
            description: "Para jogos de PS3."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="25 min"
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
