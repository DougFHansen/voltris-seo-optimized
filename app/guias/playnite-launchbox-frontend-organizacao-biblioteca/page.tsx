import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'playnite-launchbox-frontend-organizacao-biblioteca',
    title: "Playnite & LaunchBox (2026): Organize Seus Jogos e Emuladores",
    description: "Junte Steam, Epic, Xbox e Emuladores numa interface única e linda. Guia de configuração do Playnite, temas, scraping de metadados e scripts de automação.",
    category: 'software',
    difficulty: 'Iniciante',
    time: '30 min'
};

const title = "Seu PC com Cara de Console: Playnite Guide";
const description = "Cansado de abrir 10 launchers diferentes? O Playnite é Open Source, leve e junta TODOS os seus jogos num lugar só. Com suporte total a controle.";

const keywords = [
    'playnite vs launchbox qual melhor 2026',
    'como configurar emuladores no playnite',
    'playnite full screen theme ps5',
    'launchbox big box download free',
    'importar jogos steam epic gog xbox playnite',
    'metadata scraper igdb screenscraper',
    'voltris optimizer launcher',
    'playnite scripts extensions'
];

export const metadata: Metadata = createGuideMetadata('playnite-launchbox-frontend-organizacao-biblioteca', title, description, keywords);

export default function FrontendGuide() {
    const summaryTable = [
        { label: "Software", value: "Playnite (Grátis)" },
        { label: "Alternativa", value: "LaunchBox (Pago/Free)" },
        { label: "Modo", value: "Fullscreen (Controle)" },
        { label: "Scraper", value: "IGDB (Twitch)" },
        { label: "Temas", value: "PS5ish / Xbox Series" },
        { label: "Plugins", value: "HowLongToBeat / SuccessStory" },
        { label: "Emuladores", value: "Auto-Import" }
    ];

    const contentSections = [
        {
            title: "Introdução: Playnite vs LaunchBox",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          - <strong>Playnite:</strong> Totalmente Grátis e Open Source. Interface Desktop muito funcional e Fullscreen customizável. Leve.
          - <strong>LaunchBox:</strong> Bonito, mas a versão "Big Box" (para TV) custa $30. Focado em visual de fliperama (vídeos de fundo).
          <br/>Recomendamos o Playnite para 90% dos usuários.
        </p>
      `
        },
        {
            title: "Capítulo 1: Importando Bibliotecas",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Integrações</h4>
                <p class="text-gray-400 text-xs text-justify">
                    No primeiro setup, conecte suas contas:
                    <br/>- Steam (Precisa estar Público ou API Key).
                    <br/>- Epic Games, GOG, EA App, Ubisoft Connect.
                    <br/>- Amazon Prime Gaming.
                    <br/>O Playnite puxa todos os jogos instalados E não instalados.
                    <br/>Quando você clica em "Jogar", ele abre o launcher original e roda o jogo. Sem atrito.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Configurando Emuladores",
            content: `
        <p class="mb-4 text-gray-300">
            Menu > Library > Configure Emulators.
            <br/>Clique em "Import". O Playnite escaneia seu PC buscando RetroArch, Yuzu, PCSX2, etc.
            <br/>Depois em "Scan Automatic" para buscar as ROMs nas pastas.
            <br/>Ele identifica os jogos, baixa capas e cria entradas na biblioteca junto com seus jogos de PC.
        </p>
      `
        },
        {
            title: "Capítulo 3: Fullscreen Mode (Estilo Console)",
            content: `
        <p class="mb-4 text-gray-300">
            Pressione F11.
            <br/>O Playnite entra em modo tela cheia navegável por controle (Xbox/PS).
            <br/>Vá em Settings > Layout. Instale temas como <strong>"PS5ish"</strong> ou <strong>"Xbox Series X"</strong>.
            <br/>Seu PC vira um console na TV da sala.
            <br/>Configure para o Playnite iniciar com o Windows em modo Fullscreen se for um PC dedicado a jogos.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: Extensões Essenciais",
            content: `
        <p class="mb-4 text-gray-300">
            O poder do Playnite está nos Add-ons.
            <br/>- <strong>HowLongToBeat:</strong> Mostra o tempo para zerar o jogo na tela de detalhes.
            <br/>- <strong>SuccessStory:</strong> Puxa suas conquistas (Steam/RetroAchievements) e mostra no Playnite.
            <br/>- <strong>IsThereAnyDeal:</strong> Avisa promoções da Wishlist.
            <br/>- <strong>Duplicate Hider:</strong> Se você tem o mesmo jogo na Steam e Epic, ele esconde um deles para não poluir.
        </p>
      `
        },
        {
            title: "Capítulo 5: Metadados (Scraping)",
            content: `
        <p class="mb-4 text-gray-300">
            O Playnite usa o IGDB por padrão.
            <br/>Ctrl+A (Selecionar tudo) > Download Metadata.
            <br/>Ele baixa Capa, Background, Ícone, Descrição, Desenvolvedor e Gênero.
            <br/>Para jogos retrô, instale o plugin "ScreenScraper" (requer conta grátis no site deles) para baixar vídeos de gameplay para o fundo.
        </p>
      `
        },
        {
            title: "Capítulo 6: Scripts de Automação",
            content: `
        <p class="mb-4 text-gray-300">
            Settings > Scripts.
            <br/>Você pode configurar ações para "Antes de iniciar o jogo" e "Depois de fechar".
            <br/>Ex: <strong>"Mudar resolução do monitor para 4K antes de abrir, voltar para 1080p depois"</strong>.
            <br/>Ex: <strong>"Fechar o Wallpaper Engine para economizar RAM enquanto joga"</strong>.
        </p>
      `
        },
        {
            title: "Capítulo 7: Categorias e Filtros",
            content: `
        <p class="mb-4 text-gray-300">
            Crie filtros inteligentes.
            <br/>Ex: "Jogos Instalados" + "Gênero: RPG" + "Tempo < 20h".
            <br/>Salve como um filtro rápido na barra lateral. Ajuda a combater o backlog.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: LaunchBox (Big Box)",
            content: `
            <p class="mb-4 text-gray-300">
                Se você pagar pelo LaunchBox Premium ($75 lifetime), ganha o Big Box.
                <br/>Ele tem transições 3D animadas, vídeos de roda de fliperama e "Attract Mode" (fica rodando demos quando ocioso). É visualmente superior, mas funcionalmente igual.
            </p>
            `
        },
        {
            title: "Capítulo 9: Backup",
            content: `
            <p class="mb-4 text-gray-300">
                O Playnite é portátil.
                <br/>Se você copiar a pasta do Playnite para um Pendrive, leva sua biblioteca inteira (banco de dados) configurada.
                <br/>Faça backup da pasta periodicamente.
            </p>
            `
        },
        {
            title: "Capítulo 10: Splash Screens",
            content: `
            <p class="mb-4 text-gray-300">
                Extension: Extra Metadata Loader.
                <br/>Adiciona vídeos de Logo de Console ou Loading Screens antes de abrir o jogo, dando uma transição suave.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Playnite deixa o jogo lento?",
            answer: "Não. Ele consome 50MB de RAM e pode ser configurado para fechar a interface gráfica quando o jogo abre."
        },
        {
            question: "Detecta jogos Piratas?",
            answer: "Sim. Basta arrastar o atalho .exe do jogo para a janela do Playnite. Ele cria a entrada e baixa os dados do IGDB."
        }
    ];

    const externalReferences = [
        { name: "Playnite Download", url: "https://playnite.link/" },
        { name: "Playnite Forums (Themes)", url: "https://playnite.link/forum/" }
    ];

    const relatedGuides = [
        {
            href: "/guias/retroarch-guia-completo-cores-shaders-crt",
            title: "RetroArch",
            description: "Integração perfeita."
        },
        {
            href: "/guias/lossless-scaling-frame-generation-fsr-guia",
            title: "Tools",
            description: "Add-on útil."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="30 min"
            difficultyLevel="Iniciante"
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
