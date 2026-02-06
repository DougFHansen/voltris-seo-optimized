import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'xbox-game-bar-desativar-fps-drop',
    title: "Xbox Game Bar (2026): Desativar ou Otimizar?",
    description: "A Game Bar causa input lag e quedas de FPS em muitos PCs. Aprenda a desativar o DVR em segundo plano mantendo apenas o chat de voz.",
    category: 'windows',
    difficulty: 'Iniciante',
    time: '10 min'
};

const title = "Xbox Game Bar: Vilão ou Herói? (Guia 2026)";
const description = "O overlay da Microsoft (Win+G) grava seus jogos sem pedir. Isso consome VRAM e disco. Veja como configurar para zero impacto.";

const keywords = [
    'como desativar xbox game bar windows 11 powershell',
    'game dvr causando travamento jogos',
    'desinstalar xbox app pc fraco',
    'atalho win g nao funciona',
    'modo de jogo windows on ou off',
    'background recording fps drop',
    'voltris optimizer game mode',
    'erro 0x80070005 xbox game pass'
];

export const metadata: Metadata = createGuideMetadata('xbox-game-bar-desativar-fps-drop', title, description, keywords);

export default function XboxGuide() {
    const summaryTable = [
        { label: "Game Bar", value: "Desativar (Geral)" },
        { label: "Game Mode", value: "LIGADO (Sempre)" },
        { label: "Background DVR", value: "DESLIGADO (Urgente)" },
        { label: "Audio", value: "Chat Mix (Útil)" },
        { label: "Atalho", value: "Win + G" },
        { label: "Notificações", value: "Silenciar Tudo" }
    ];

    const contentSections = [
        {
            title: "Introdução: O DVR Oculto",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Por padrão, o Windows grava os últimos 30 segundos do seu jogo (Background Recording). Em PCs fracos, isso causa um "stutter" a cada minuto quando o buffer do HD enche.
        </p>
      `
        },
        {
            title: "Capítulo 1: Configurações do Windows",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Passo a Passo (Settings)</h4>
                <p class="text-gray-400 text-xs text-justify">
                    1. Configurações > Jogos > Capturas.
                    <br/>2. <strong>DESLIGUE</strong> "Gravar o que aconteceu" (Gravação em segundo plano).
                    <br/>- Se você precisa clipar, use o OBS (mais leve) ou ShadowPlay. O DVR do Windows é mal otimizado.
                    <br/>3. Desligue "Capturar áudio ao gravar um jogo" (se não usar o DVR).
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Modo de Jogo (Game Mode)",
            content: `
        <p class="mb-4 text-gray-300">
            Mito: "Desligue o Game Mode".
            <br/>Em 2026 (Windows 11 24H2), o <strong>Modo de Jogo deve ficar LIGADO</strong>.
            <br/>Ele impede que o Windows Update instale drivers ou reinicie o PC enquanto você joga, e prioriza a CPU para o jogo.
        </p>
      `
        },
        {
            title: "Capítulo 3: Desativando a Barra (Win+G)",
            content: `
        <p class="mb-4 text-gray-300">
            Se você nunca usa o atalho Win+G:
            <br/>Vá em Configurações > Jogos > Xbox Game Bar.
            <br/>Desmarque "Abrir Xbox Game Bar usando este botão no controle".
            <br/>Isso libera um pouco de RAM (o processo <code>GamingServices.exe</code> ainda roda, mas consome menos).
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: Removendo via PowerShell (Debloat)",
            content: `
        <p class="mb-4 text-gray-300">
            Se você quer EXTERMINAR a Game Bar do sistema:
            <br/>Abra o PowerShell como Admin e digite:
            <br/><code>Get-AppxPackage Microsoft.XboxGamingOverlay | Remove-AppxPackage</code>
            <br/>Cuidado: Isso quebra o convite de amigos em alguns jogos da Microsoft Store (Forza, Sea of Thieves).
        </p>
      `
        },
        {
            title: "Capítulo 5: Xbox Networking (Teredo)",
            content: `
        <p class="mb-4 text-gray-300">
            Se você joga Forza Horizon online e cai toda hora:
            <br/>Vá em Configurações > Jogos > Rede Xbox.
            <br/>Verifique se o "Tipo de NAT" está Aberto. Se estiver "Bloqueado", clique em "Corrigir".
            <br/>Isso reinicia o adaptador Teredo tunneling.
        </p>
      `
        },
        {
            title: "Capítulo 6: Presence Writer (Lag em FPS)",
            content: `
        <p class="mb-4 text-gray-300">
            Existe um arquivo chamado <code>GameBarPresenceWriter.exe</code> que avisa seus amigos "Jogando Valorant...".
            <br/>Em alguns PCs, isso causa micro-congelamentos. Se desativar a Game Bar não resolver, renomeie esse arquivo na pasta System32 (arriscado, faça backup).
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 7: Game Pass no PC",
            content: `
            <p class="mb-4 text-gray-300">
                Se você assina Game Pass, NÃO desinstale o app Xbox.
                <br/>Mas desative as notificações de "Conquista Desbloqueada", pois elas cobrem o minimapa do jogo.
            </p>
            `
        },
        {
            title: "Capítulo 8: Widget de Performance",
            content: `
            <p class="mb-4 text-gray-300">
                A Game Bar tem um widget de FPS/CPU. É útil, mas consome mais recursos que o RivaTuner (MSI Afterburner). Prefira o RivaTuner.
            </p>
            `
        },
        {
            title: "Capítulo 9: Agendador de GPU",
            content: `
            <p class="mb-4 text-gray-300">
                Lembre-se de ativar "Agendamento de GPU acelerado por hardware" nas configurações gráficas do Windows. Reduz latência.
            </p>
            `
        },
        {
            title: "Capítulo 10: Reinstalando",
            content: `
            <p class="mb-4 text-gray-300">
                Se arrepender, baixe de volta na Microsoft Store grátis.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Game Bar dá tela azul?",
            answer: "Raramente. Geralmente conflita com overlays de terceiros (Discord + Steam + Nvidia + Game Bar = Crash). Use apenas 1 overlay."
        },
        {
            question: "Como clipar sem Game Bar?",
            answer: "Use Nvidia ShadowPlay (GeForce Experience) ou OBS Replay Buffer. São 10x melhores."
        }
    ];

    const externalReferences = [
        { name: "Desativar Game DVR (Microsoft)", url: "https://support.microsoft.com/en-us/windows/enable-xbox-game-bar-26e6d734-228b-c918-09d2-570a24016146" }
    ];

    const relatedGuides = [
        {
            href: "/guias/otimizacao-ssd-windows-11",
            title: "Windows",
            description: "Debloat completo."
        },
        {
            href: "/guias/obs-studio-gravacao-replay-buffer-av1",
            title: "OBS",
            description: "Alternativa de clipe."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="10 min"
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
