import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'hogwarts-legacy-stutter-fix-ram',
    title: "Hogwarts Legacy (2026): Correção de Stutter e Uso de RAM",
    description: "Hogwarts Legacy engasga em Hogsmeade e come 16GB de RAM. Aprenda a editar o Engine.ini para melhorar o streaming de texturas e estabilizar o FPS.",
    category: 'jogos',
    difficulty: 'Avançado',
    time: '25 min'
};

const title = "Hogwarts Legacy Optimization (2026): Magia Sem Lag";
const description = "A Unreal Engine 4 neste jogo sofre com 'Asset Streaming'. Isso causa travadas bruscas ao abrir portas. Com ajustes de arquivo de configuração, podemos mitigar isso.";

const keywords = [
    'hogwarts legacy stutter fix engine.ini 2026',
    'hogwarts legacy travando muito pc bom',
    'ascendio mod hogwarts legacy',
    'uso alto de ram hogwarts legacy leak',
    'melhores configurações graficas hogwarts',
    'dlsws update hogwarts legacy',
    'ray tracing vale a pena hogwarts',
    'como aumentar fps hogwarts video config',
    'pool size streaming settings',
    'voltris optimizer unreal engine'
];

export const metadata: Metadata = createGuideMetadata('hogwarts-legacy-stutter-fix-ram', title, description, keywords);

export default function HogwartsGuide() {
    const summaryTable = [
        { label: "Texture Quality", value: "High (Se 8GB+ VRAM)" },
        { label: "Fog Quality", value: "Medium" },
        { label: "Sky Quality", value: "Low" },
        { label: "Foliage", value: "Medium" },
        { label: "Upscale", value: "DLSS/FSR Quality" },
        { label: "Ray Tracing", value: "OFF (Quebrado)" },
        { label: "Fix", value: "Engine.ini Tweak" }
    ];

    const contentSections = [
        {
            title: "Introdução: O Problema de VRAM e RAM",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Hogwarts Legacy é faminto. Ele facilmente ocupa 20GB de RAM e 10GB de VRAM em 1080p Ultra. Se seu PC não tem isso, ele usa o SSD como memória, causando travadas (stutters) horríveis.
        </p>
      `
        },
        {
            title: "Capítulo 1: Engine.ini Tweaks (O Fix Real)",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Como Editar</h4>
                <p class="text-gray-400 text-xs text-justify">
                    Vá em <code>%localappdata%\\Hogwarts Legacy\\Saved\\Config\\WindowsNoEditor</code>.
                    <br/>Abra <code>Engine.ini</code> com o Bloco de Notas.
                    <br/>Adicione ao final:
                    <br/><code>[SystemSettings]</code>
                    <br/><code>r.CreateShadersOnLoad=1</code>
                    <br/><code>r.Streaming.PoolSize=2048</code> (Se tiver 8GB VRAM) ou <code>3072</code> (Se 10GB+ VRAM).
                    <br/>Isso força o jogo a gerenciar melhor o cache de texturas.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Configurações Gráficas Críticas",
            content: `
        <p class="mb-4 text-gray-300">
            - <strong>Fog Quality (Neblina):</strong> Medium ou Low. A neblina volumétrica em Hogwarts pesa muito.
            - <strong>Sky Quality:</strong> Low. Vira um "skybox" estático, economizando CPU.
            - <strong>Foliage Quality:</strong> Medium. O jogo tem muita grama. High mata a performance na Floresta Proibida.
        </p>
      `
        },
        {
            title: "Capítulo 3: Ray Tracing (Desligue)",
            content: `
        <p class="mb-4 text-gray-300">
            A implementação de Ray Tracing em Hogwarts Legacy é bugada.
            <br/>Ela causa vazamento de memória (Memory Leak) e texturas de baixa resolução.
            <br/>Mesmo com uma RTX 4070, recomenda-se deixar <strong>OFF</strong>. A iluminação nativa "baked" já é linda.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: Ascendio Mod",
            content: `
        <p class="mb-4 text-gray-300">
            Se os tweaks manuais não funcionarem, instale o mod <strong>Ascendio</strong> do NexusMods.
            <br/>Ele é um pacote automatizado de correções da Engine Unreal que melhora o streaming de assets.
            <br/>Fácil de instalar, basta rodar o executável dele.
        </p>
      `
        },
        {
            title: "Capítulo 5: Atualização de DLSS (DLL Swap)",
            content: `
        <p class="mb-4 text-gray-300">
            O jogo vem com uma versão velha do DLSS.
            <br/>Baixe o <code>nvngx_dlss.dll</code> (versão 3.7.0 ou mais nova) do TechPowerUp.
            <br/>Substitua na pasta do jogo <code>Engine\\Plugins\\Runtime\\Nvidia\\DLSS\\Binaries\\ThirdParty\\Win64</code>.
            <br/>Isso reduz "ghosting" (fantasmas) ao voar de vassoura.
        </p>
      `
        },
        {
            title: "Capítulo 6: V-Sync e Frame Generation",
            content: `
        <p class="mb-4 text-gray-300">
            Se tiver RTX 4000: Ative "Frame Generation". O jogo escala muito bem com isso, transformando 50 FPS em 90 FPS.
            <br/>Se não tiver: Desligue V-Sync no jogo e ligue no Painel Nvidia para estabilidade.
        </p>
      `
        },
        {
            title: "Capítulo 7: Exploit Protection (CFG)",
            content: `
        <p class="mb-4 text-gray-300">
            Pesquise "Exploit Protection" no Windows.
            <br/>Aba "Configurações de Programas" > Adicionar programa > aponte para o <code>HogwartsLegacy.exe</code>.
            <br/>Role até "Control Flow Guard (CFG)".
            <br/>Marque "Substituir configurações do sistema" e coloque em <strong>DESATIVADO</strong>.
            <br/>Isso é um fix conhecido para jogos DX12 que gaguejam.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: Pop-in de Texturas",
            content: `
            <p class="mb-4 text-gray-300">
                Se as texturas demoram a carregar (ficam borradas):
                <br/>Aumente o arquivo de paginação do Windows (Memória Virtual) para 32GB no seu SSD mais rápido. O jogo *precisa* disso se você tem 16GB de RAM.
            </p>
            `
        },
        {
            title: "Capítulo 9: Câmera Acelerada",
            content: `
            <p class="mb-4 text-gray-300">
                A câmera padrão é lenta e tem aceleração.
                <br/>Nas opções de Jogo: Aumente a "Sensibilidade da Câmera" e a "Aceleração da Câmera" para o máximo (ou desligue a aceleração no Engine.ini se for avançado) para ter resposta 1:1 no mouse.
            </p>
            `
        },
        {
            title: "Capítulo 10: Process Priority",
            content: `
            <p class="mb-4 text-gray-300">
                Não adianta colocar em "High Priority". A Denuvo (proteção do jogo) impede algumas ferramentas de interagir profundamente, mas o CleanMem ou ISLC (Intelligent Standby List Cleaner) ajuda a limpar a RAM em background.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Funciona em 8GB de RAM?",
            answer: "Muito mal. Você terá stutters constantes. O mínimo jogável para experiência lisa é 16GB (idealmente 32GB)."
        },
        {
            question: "Tela preta na inicialização?",
            answer: "Aguarde. O jogo está compilando shaders na primeira vez. Pode levar 5-10 minutos em CPUs antigas. Não feche."
        },
        {
            question: "Mods dão ban?",
            answer: "Não. É um jogo Singleplayer. Pode usar mods de roupas, varinhas e performance à vontade."
        }
    ];

    const externalReferences = [
        { name: "Ascendio Mod (Nexus)", url: "https://www.nexusmods.com/hogwartslegacy/mods/69" },
        { name: "DLSS DLL Download", url: "https://www.techpowerup.com/download/nvidia-dlss-dll/" }
    ];

    const relatedGuides = [
        {
            href: "/guias/otimizacao-ssd-windows-11",
            title: "SSD",
            description: "Crucial para Hogsmeade."
        },
        {
            href: "/guias/nvidia-painel-controle-melhores-configuracoes",
            title: "Nvidia",
            description: "Cache Size Unlimited."
        },
        {
            href: "/guias/cheat-engine-speedhack-jogos-offline",
            title: "Cheat Engine",
            description: "Para dinheiro infinito."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="25 min"
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
