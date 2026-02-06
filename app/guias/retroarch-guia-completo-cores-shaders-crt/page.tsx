import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'retroarch-guia-completo-cores-shaders-crt',
    title: "RetroArch (2026): O Guia Definitivo de Cores e Shaders CRT",
    description: "Configure o RetroArch do zero. Aprenda a baixar os melhores Cores (núcleos), configurar Shaders CRT (Scanlines) para visual retrô e usar Run-Ahead para latência zero.",
    category: 'emulacao',
    difficulty: 'Intermediário',
    time: '35 min'
};

const title = "RetroArch: Todos os Consoles em Um Só Lugar";
const description = "O RetroArch não é um emulador, é uma interface (Frontend) que carrega emuladores (Cores). É a forma mais organizada e poderosa de jogar SNES, Mega Drive, GBA e Arcades.";

const keywords = [
    'melhores cores retroarch snes genesis gba',
    'configurar shaders crt royale kurozumi',
    'run-ahead latency reduction retroarch',
    'retroarch achievements login',
    'mapear controle 8bitdo retroarch',
    'playlist thumbnails boxart download',
    'voltris optimizer retro',
    'mesen vs snes9x core'
];

export const metadata: Metadata = createGuideMetadata('retroarch-guia-completo-cores-shaders-crt', title, description, keywords);

export default function RetroArchGuide() {
    const summaryTable = [
        { label: "Driver de Vídeo", value: "Vulkan / Glcore" },
        { label: "Menu Driver", value: "Ozone (Padrão) / XMB" },
        { label: "SNES Core", value: "Snes9x (Leve) / Mesen-S (Preciso)" },
        { label: "GBA Core", value: "mGBA" },
        { label: "PS1 Core", value: "SwanStation" },
        { label: "Latency", value: "Run-Ahead ON" },
        { label: "Shaders", value: "CRT-Geom / CRT-Royale" }
    ];

    const contentSections = [
        {
            title: "Introdução: O Conceito de 'Cores'",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Em vez de baixar um .exe para cada console, você baixa "Núcleos" (DLLs) dentro do RetroArch.
          <br/>Vantagem: Todos os consoles compartilham a mesma configuração de controle, vídeo e shaders.
        </p>
      `
        },
        {
            title: "Capítulo 1: Baixando os Melhores Cores",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Online Updater > Core Downloader</h4>
                <p class="text-gray-400 text-xs text-justify">
                    Não baixe qualquer um. Alguns são velhos. Use estes recomendados:
                    <br/>- <strong>Nintendo - SNES:</strong> Snes9x (Current).
                    <br/>- <strong>Sega - MS/GG/MD/CD:</strong> Genesis Plus GX.
                    <br/>- <strong>Nintendo - Game Boy Advance:</strong> mGBA.
                    <br/>- <strong>Arcade:</strong> FBNeo (FinalBurn Neo) para jogos gerais ou MAME (Current) para complexos.
                    <br/>- <strong>Sony - PlayStation:</strong> SwanStation (Melhor upscaling que Beetle).
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Configurando a Lista de Jogos (Playlists)",
            content: `
        <p class="mb-4 text-gray-300">
            1. Aba "Import Content" > Scan Directory.
            <br/>2. Selecione sua pasta de ROMs.
            <br/>3. O RetroArch vai escanear e criar playlists bonitas com ícones de consoles na barra lateral.
            <br/>4. Vá em Online Updater > Playlist Thumbnails Updater para baixar as capinhas (Boxart) automaticamente.
        </p>
      `
        },
        {
            title: "Capítulo 3: Shaders CRT (Scanlines)",
            content: `
        <p class="mb-4 text-gray-300">
            Pixel Art moderno fica feio em LCDs chapados. Eles foram feitos para o brilho e as linhas das TVs de Tubo.
            <br/>Com um jogo aberto: Quick Menu > Shaders > Load.
            <br/>Pasta <code>shaders_slang/crt</code>.
            <br/>- <strong>crt-geom:</strong> Simples, simula a curvatura da tela. Lindo e leve.
            <br/>- <strong>crt-royale:</strong> O mais avançado e pesado. Parece uma TV Trinitron real.
            <br/>- <strong>zfast-crt:</strong> Para celulares ou PCs muito fracos.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: Latência (Run-Ahead)",
            content: `
        <p class="mb-4 text-gray-300">
            O "Run-Ahead" remove o lag de input natural do emulador calculando frames no futuro e voltando atrás.
            <br/>Settings > Latency > Run-Ahead to Reduce Latency: ON.
            <br/>Number of Frames: 1 (Seguro) ou 2 (Agressivo).
            <br/>Isso faz o Mario pular NO INSTANTE que você aperta o botão, mais rápido até que no SNES original. Exige CPU.
        </p>
      `
        },
        {
            title: "Capítulo 5: Netplay (Jogando Online)",
            content: `
        <p class="mb-4 text-gray-300">
            O RetroArch tem netplay fácil.
            <br/>Host: Netplay > Host Session.
            <br/>Client: Netplay > Refresh Room List.
            <br/>Vocês precisam ter EXATAMENTE a mesma ROM (mesmo arquivo CRC). Recomendamos sets "No-Intro".
        </p>
      `
        },
        {
            title: "Capítulo 6: RetroAchievements",
            content: `
        <p class="mb-4 text-gray-300">
            Settings > Achievements.
            <br/>Logue sua conta.
            <br/>Ative "Hardcore Mode" para desativar Save States (obrigatório para ganhar pontos no ranking oficial).
            <br/>Quando você abrir o jogo, vai aparecer "Login Successful" e a lista de troféus.
        </p>
      `
        },
        {
            title: "Capítulo 7: BIOS",
            content: `
        <p class="mb-4 text-gray-300">
            Cores de CD (PS1, Sega CD, Saturn) precisam de BIOS na pasta <code>system</code> do RetroArch.
            <br/>Sem BIOS, o jogo fecha sozinho.
            <br/>O RetroArch não avisa qual falta. Verifique a documentação do Core em <code>docs.libretro.com</code>.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: Menu Driver (Interface)",
            content: `
            <p class="mb-4 text-gray-300">
                Se você não gosta da interface padrão (Ozone, cinza):
                <br/>Settings > Drivers > Menu.
                <br/>Mude para <strong>XMB</strong> (igual PS3) ou <strong>RGUI</strong> (visual pixelado retrô). Reinicie para aplicar.
            </p>
            `
        },
        {
            title: "Capítulo 9: AI Service (Tradução)",
            content: `
            <p class="mb-4 text-gray-300">
                O RetroArch pode traduzir jogos japoneses em tempo real usando Google Translate.
                <br/>Requer configuração de API Key, mas permite jogar RPGs nunca lançados no ocidente com legendas na tela (Overlay).
            </p>
            `
        },
        {
            title: "Capítulo 10: Hotkeys",
            content: `
            <p class="mb-4 text-gray-300">
                Configure Settings > Input > Hotkeys.
                <br/>"Menu Toggle Controller Combo": Segurar Start + Select por 2s para abrir o menu ingame. Essencial se estiver jogando no sofá.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Steam vs Standalone?",
            answer: "A versão da Steam é ótima, atualiza sozinha e tem Cloud Save. Mas tem menos Cores disponíveis para download direto (por licença). A versão do site oficial é completa."
        },
        {
            question: "Controle não funciona?",
            answer: "O RetroArch configura controles XInput (Xbox) automaticamente. Se usar controle genérico, vá em Settings > Input > Port 1 Controls e mapeie manualmente."
        }
    ];

    const externalReferences = [
        { name: "RetroArch Official", url: "https://www.retroarch.com/" },
        { name: "Libretro Docs", url: "https://docs.libretro.com/" }
    ];

    const relatedGuides = [
        {
            href: "/guias/pcsx2-otimizacao-4k-widescreen-texturas-guia",
            title: "PCSX2",
            description: "Melhor usar Standalone para PS2."
        },
        {
            href: "/guias/dolphin-emulador-wii-gamecube-ubershaders-guia",
            title: "Dolphin",
            description: "Melhor usar Standalone para Wii."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="35 min"
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
