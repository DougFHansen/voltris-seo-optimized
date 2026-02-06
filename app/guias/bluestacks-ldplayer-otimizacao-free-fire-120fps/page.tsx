import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'bluestacks-ldplayer-otimizacao-free-fire-120fps',
    title: "Android no PC (2026): Bluestacks vs LDPlayer Otimizados",
    description: "Rode Free Fire, CoD Mobile e Ragnarok em 120FPS no emulador. Guia de Virtualização (VT-x), Root e Debloat para remover anúncios.",
    category: 'emulacao',
    difficulty: 'Intermediário',
    time: '20 min'
};

const title = "Emulador Android: Max FPS e Zero Lag";
const description = "Emuladores Android pesam mais que jogos de PC se mal configurados. Aprenda a alocar RAM correta e ativar a Virtualização na BIOS para voar.";

const keywords = [
    'melhor emulador android para pc fraco 2026',
    'bluestacks 5 vs ldplayer 9 desempenho',
    'ativar virtualização vt-x bios',
    'free fire 90 fps emulador bug',
    'cod mobile emulador detectado bypass',
    'como fazer root bluestacks 5 bs tweaker',
    'voltris optimizer mobile',
    'tft mobile pc'
];

export const metadata: Metadata = createGuideMetadata('bluestacks-ldplayer-otimizacao-free-fire-120fps', title, description, keywords);

export default function AndroidEmuGuide() {
    const summaryTable = [
        { label: "Emulador", value: "LDPlayer 9 (Leve) / BS 5" },
        { label: "CPU", value: "4 Cores (Recomendado)" },
        { label: "RAM", value: "4GB (Máximo)" },
        { label: "Virtualização", value: "ON (Obrigatório)" },
        { label: "Root", value: "Opcional (BS Tweaker)" },
        { label: "Hyper-V", value: "OFF (Conflito)" },
        { label: "FPS", value: "90/120 Hz" }
    ];

    const contentSections = [
        {
            title: "Introdução: Virtualização (VT-x / SVM)",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          99% dos problemas de lentidão ("Lagado") no emulador são porque a Virtualização está desligada na BIOS. Sem isso, o emulador roda usando apenas 1 núcleo em modo software.
        </p>
      `
        },
        {
            title: "Capítulo 1: Bluestacks 5 vs LDPlayer 9",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Qual escolher?</h4>
                <p class="text-gray-400 text-xs text-justify">
                    - <strong>Bluestacks 5 (Nougat 64-bit):</strong> O mais compatível e seguro. Ótimo para jogos pesados.
                    - <strong>LDPlayer 9:</strong> Muito mais leve. Consome menos RAM. Ideal para PCs fracos ou para abrir 4 janelas ao mesmo tempo (Multi-Instance). Cuidado com os anúncios na home.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Configuração Ideal",
            content: `
        <p class="mb-4 text-gray-300">
            No menu de Engrenagem (Settings):
            <br/>- <strong>CPU:</strong> 4 Núcleos (Se você tem um processador de 6 núcleos ou mais). Se tiver um Dual Core, coloque 2.
            <br/>- <strong>RAM:</strong> 4GB (4096MB). Não coloque 8GB, o Android não usa e você tira do Windows.
            <br/>- <strong>Resolusion:</strong> 1600x900 ou 1920x1080. (720p se tiver PC muito fraco).
            <br/>- <strong>DPI:</strong> 240 (Padrão) ou 320 (Melhor mira).
        </p>
      `
        },
        {
            title: "Capítulo 3: Desbloqueando 120 FPS",
            content: `
        <p class="mb-4 text-gray-300">
            Para Free Fire e outros:
            <br/>1. Ative "Enable High Frame Rate" nas configurações do emulador.
            <br/>2. Arraste a barra para 90 ou 120.
            <br/>3. Selecione o perfil de dispositivo "ASUS ROG Phone 2". Isso engana o jogo para liberar a opção de alto FPS no menu interno do jogo.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: O Problema do Hyper-V",
            content: `
        <p class="mb-4 text-gray-300">
            O Windows tem um recurso chamado Hyper-V (usado para WSL e Sandbox).
            <br/>O Hyper-V <strong>bloqueia</strong> a virtualização dos emuladores Android, causando tela azul ou lentidão extrema.
            <br/>Se o Bluestacks avisar "Hyper-V detected", rode o comando de reparo deles ou desative o Hyper-V no "Ativar ou desativar recursos do Windows". A menos que usem a versão "Hyper-V Compatible" (beta).
        </p>
      `
        },
        {
            title: "Capítulo 5: Mapeamento de Teclas (Keybinds)",
            content: `
        <p class="mb-4 text-gray-300">
            O "Smart Controls" do Bluestacks geralmente falha após updates do jogo.
            <br/>Aprenda a mapear manualmente:
            <br/>Abra o Editor de Controles.
            <br/>Arraste o "D-Pad" para o analógico.
            <br/>Arraste "Aim, Pan and Shoot" para o meio da tela (isso faz o mouse sumir e virar a câmera).
            <br/>Arraste "Tap spot" para os botões de tiro/pular.
        </p>
      `
        },
        {
            title: "Capítulo 6: Debloat (BS Tweaker)",
            content: `
        <p class="mb-4 text-gray-300">
            O "BS Tweaker" é uma ferramenta não-oficial poderosa (apenas para Bluestacks).
            <br/>Permite fazer Root, remover os anúncios da aba "Game Center" e mudar configurações ocultas. Use com cuidado.
            <br/>No LDPlayer, você pode pagar o Premium para remover ads ou usar DNS Adblock (ver guia de DNS) para bloquear domínios de propaganda.
        </p>
      `
        },
        {
            title: "Capítulo 7: Macro e Multi-Instance",
            content: `
        <p class="mb-4 text-gray-300">
            Para jogos de Gacha (Ragnarok, Summoners War):
            <br/>Use o Gerenciador de Multi-Instância para abrir 4 janelas.
            <br/>Use a ferramenta "Sync Operations" para clicar em uma janela e repetir o clique em todas as 4. Ótimo para Reroll.
            <br/>Defina as instâncias secundárias para 1 Core / 2GB RAM e 20 FPS ("Eco Mode") para não travar o PC.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: Sensibilidade Y",
            content: `
            <p class="mb-4 text-gray-300">
                Jogadores de Free Fire mudam a Sensibilidade Y (Vertical) para ser maior que a X (Horizontal). Ajuda a "subir capa".
                <br/>No editor de controles, clique com botão direito no ícone de "Aim" e ajuste Sensitivity Y para 1.5 ou 2.0.
            </p>
            `
        },
        {
            title: "Capítulo 9: Emulador no Notebook",
            content: `
            <p class="mb-4 text-gray-300">
                Certifique-se de que o emulador está usando a GPU Dedicada (Nvidia) e não a Intel HD.
                <br/>Painel Nvidia > Gerenciar configurações 3D > Configurações do Programa > Add HD-Player.exe > Processador NVIDIA de alto desempenho.
            </p>
            `
        },
        {
            title: "Capítulo 10: Google Play Services",
            content: `
            <p class="mb-4 text-gray-300">
                Se a Play Store travar, limpe os dados do app "Google Play Services" nas configurações do Android emulado. É um bug comum.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Dá ban usar emulador?",
            answer: "No Free Fire, não (mas você cai na fila só de emuladores). No CoD Mobile, SIM (se não usar o Gameloop oficial). No PUBG Mobile, só Gameloop é seguro."
        },
        {
            question: "Windows 11 roda Android nativo (WSA)?",
            answer: "Sim, o 'Windows Subsystem for Android', mas foi descontinuado pela Microsoft em 2025. Não tem aceleração 3D boa para jogos. Use LDPlayer/Bluestacks."
        }
    ];

    const externalReferences = [
        { name: "BS Tweaker", url: "https://bstweaker.tk/" },
        { name: "LDPlayer Optimize", url: "https://www.ldplayer.net/blog/how-to-allocate-ram-and-cpu-to-ldplayer.html" }
    ];

    const relatedGuides = [
        {
            href: "/guias/bios-otimizacao-xmp-tpm",
            title: "BIOS",
            description: "Ativar Virtualização."
        },
        {
            href: "/guias/dns-mais-rapido-para-jogos-benchmark",
            title: "DNS",
            description: "Bloquear ads."
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
