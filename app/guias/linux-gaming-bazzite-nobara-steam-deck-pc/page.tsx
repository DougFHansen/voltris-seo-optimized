import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'linux-gaming-bazzite-nobara-steam-deck-pc',
    title: "Linux Gaming (2026): Bazzite e Nobara (Transforme PC em Console)",
    description: "Cansado do Windows? O Linux gamer evoluiu. Aprenda a instalar Bazzite (SteamOS Clone) ou Nobara para ter uma experiência de console no seu PC.",
    category: 'linux',
    difficulty: 'Avançado',
    time: '50 min'
};

const title = "Adeus Windows? Guia de Bazzite e Nobara";
const description = "O Proton da Valve permite rodar 99% dos jogos de Windows no Linux com mais FPS e menos bloatware. Transforme seu PC velho num Steam Deck gigante.";

const keywords = [
    'bazzite vs nobara qual melhor gaming',
    'como instalar bazzite dual boot windows',
    'jogos com anticheat funcionam no linux',
    'wayland vs x11 gaming nvidia',
    'bazzite deck edition handheld pc',
    'heroic games launcher epic gog linux',
    'voltris optimizer linux',
    'protondb compatibility check'
];

export const metadata: Metadata = createGuideMetadata('linux-gaming-bazzite-nobara-steam-deck-pc', title, description, keywords);

export default function LinuxGuide() {
    const summaryTable = [
        { label: "Distro (Handheld)", value: "Bazzite (Fedora Atomic)" },
        { label: "Distro (Desktop)", value: "Nobara (Fedora Mod)" },
        { label: "Interface", value: "KDE Plasma / GNOME" },
        { label: "Compatibilidade", value: "Proton (Steam Play)" },
        { label: "Drivers", value: "Mesa (AMD) / Proprietary (Nvidia)" },
        { label: "Loja", value: "Steam / Heroic / Lutris" },
        { label: "Anticheat", value: "Alguns não rodam (Valorant/CoD)" }
    ];

    const contentSections = [
        {
            title: "Introdução: O Ano do Linux Desktop?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Sim, chegou. Graças ao Steam Deck, o Linux agora roda Cyberpunk e Elden Ring melhor que o Windows em alguns hardwares. Distros como <strong>Bazzite</strong> vêm prontas: instalou, logou na Steam, jogou. Sem terminal.
        </p>
      `
        },
        {
            title: "Capítulo 1: Escolhendo a Distro",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Otimizadas para Jogos</h4>
                <p class="text-gray-400 text-xs text-justify">
                    - <strong>Bazzite:</strong> A experiência IDÊNTICA ao Steam Deck. Liga direto no Big Picture (Game Mode). Imutável (não quebra com updates). Perfeita para ligar o PC na TV da sala.
                    - <strong>Nobara:</strong> Feita pelo GloriousEggroll (criador do Proton-GE). Super otimizada, kernels modificados, patches de OBS e drivers Nvidia pré-instalados. Melhor para uso Desktop (trabalho + jogos).
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Instalação (Bazzite)",
            content: `
        <p class="mb-4 text-gray-300">
            1. Baixe a ISO no site da Universal Blue. Escolha sua GPU (Nvidia/AMD) e a interface (KDE é a do Steam Deck).
            2. Grave no pendrive com <strong>Ventoy</strong> ou <strong>BalenaEtcher</strong> (Rufus as vezes dá erro).
            3. Boot.
            4. O instalador é gráfico. Selecione o SSD e deixe automático.
            5. Primeiro boot: Ele baixa drivers e codecs sozinho.
        </p>
      `
        },
        {
            title: "Capítulo 3: Compatibilidade (Proton)",
            content: `
        <p class="mb-4 text-gray-300">
            Na Steam > Settings > Compatibility.
            <br/>Ative <strong>"Enable Steam Play for all other titles"</strong>.
            <br/>Quase tudo roda.
            <br/>Quem NÃO roda?
            <br/>- Valorant (Kernel Anticheat VGK).
            <br/>- Call of Duty Warzone (Ricochet).
            <br/>- Fortnite (EAC/BattlEye Linux desativado pela Epic).
            <br/>- League of Legends (Vanguard).
            <br/>Se você joga esses 4, fique no Windows (ou Dual Boot).
            <br/>CS2, Dota e Apex Legends rodam NATIVO ou via Proton perfeitamente.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: Jogos da Epic/GOG (Heroic)",
            content: `
        <p class="mb-4 text-gray-300">
            Não existe Epic Launcher para Linux oficial.
            <br/>Use o <strong>Heroic Games Launcher</strong> (Flatpak).
            <br/>Ele loga na sua conta Epic/GOG/Amazon, baixa os jogos e roda usando o Proton da Steam ou Wine-GE.
            <br/>Interface linda e leve.
        </p>
      `
        },
        {
            title: "Capítulo 5: Drivers (Nvidia vs AMD)",
            content: `
        <p class="mb-4 text-gray-300">
            - <strong>AMD:</strong> É on-board. Os drivers MESA já vêm no Kernel Linux. É a melhor experiência (plug and play).
            - <strong>Nvidia:</strong> Historicamente problemático, mas no driver 555+ (Beta) o Wayland e HDR funcionam bem.
            <br/>No Bazzite/Nobara, selecione a ISO "Nvidia" para já vir tudo pronto. Não tente instalar driver <code>.run</code> manual do site da Nvidia, você vai quebrar o sistema.
        </p>
      `
        },
        {
            title: "Capítulo 6: Gamescope (HDR e Upscaling)",
            content: `
        <p class="mb-4 text-gray-300">
            O <strong>Gamescope</strong> é o compositor de janelas da Valve.
            <br/>Ele permite forçar FSR em qualquer jogo (Super Resolution), limitar FPS com frame pacing perfeito e usar HDR mesmo se o jogo não suportar (Auto-HDR via driver).
            <br/>No Bazzite (Game Mode), isso já vem ativo no menu "...".
        </p>
      `
        },
        {
            title: "Capítulo 7: Emulação (EmuDeck)",
            content: `
        <p class="mb-4 text-gray-300">
            Baixe o script do <strong>EmuDeck</strong>.
            <br/>Ele instala RetroArch, Yuzu, Cemu, PCSX2, configuros tudo e adiciona as capas na sua Steam Library.
            <br/>A melhor forma de emular no Linux.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: Sistema de Arquivos (EXT4 vs BTRFS)",
            content: `
            <p class="mb-4 text-gray-300">
                O Linux usa EXT4 ou BTRFS, não NTFS.
                <br/>O Bazzite usa BTRFS com dedup e compressão transparente. Seus jogos ocupam menos espaço no SSD que no Windows!
            </p>
            `
        },
        {
            title: "Capítulo 9: Flatpaks (Apps)",
            content: `
            <p class="mb-4 text-gray-300">
                Quer Discord, Spotify, Chrome?
                <br/>Abra a loja "Discover" (KDE) ou "Software" (GNOME).
                <br/>Tudo é instalado via Flatpak (Sandboxed). Seguro e limpo, sem sujar o sistema base.
            </p>
            `
        },
        {
            title: "Capítulo 10: Terminal? (Konsole)",
            content: `
            <p class="mb-4 text-gray-300">
                Você raramente precisa usar o terminal.
                <br/>Bazzite tem o comando <code>ujust</code> que é um menu de atalhos para instalar coisas comuns (ujust setup-nvidia, ujust install-obs).
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Perco FPS no Linux?",
            answer: "Geralmente não. Em jogos Vulkan (Doom, RDR2), ganha FPS. Em jogos DX11 antigos, o DXVK faz milagres. O overhead é mínimo."
        },
        {
            question: "Posso acessar meus jogos no HD NTFS do Windows?",
            answer: "Pode (Mount), mas a Steam do Linux não gosta de rodar jogos via Proton em partição NTFS (bug de permissões). O ideal é formatar um SSD em EXT4/BTRFS para jogos Linux."
        }
    ];

    const externalReferences = [
        { name: "ProtonDB (Check Games)", url: "https://www.protondb.com/" },
        { name: "Bazzite Gaming OS", url: "https://bazzite.gg/" }
    ];

    const relatedGuides = [
        {
            href: "/guias/steam-deck-otimizacao-cryoutilities-protonge-guia",
            title: "Steam Deck",
            description: "Base do Bazzite."
        },
        {
            href: "/guias/formatacao-limpa-windows-11-rufus-gpt",
            title: "Windows",
            description: "Se desistir do Linux."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="50 min"
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
