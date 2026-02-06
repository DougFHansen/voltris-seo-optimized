import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'roblox-fps-unlocker-bloat-fix-bloxstrap',
    title: "Roblox (2026): FPS Unlocker e Otimização com Bloxstrap",
    description: "Quebre o limite de 60 FPS do Roblox. Guia do gerenciador Bloxstrap, mods de gráficos, remoção de input lag e configuração de FastFlags.",
    category: 'jogos',
    difficulty: 'Iniciante',
    time: '15 min'
};

const title = "Roblox Pro: Mais que 60 FPS";
const description = "O Roblox oficial é limitado e trava o FPS em 60. O Bloxstrap é um launcher open-source seguro que desbloqueia o FPS, aplica texturas antigas e mods automaticamente.";

const keywords = [
    'como tirar limite fps roblox bloxstrap download',
    'roblox fps unlocker github rbxfpsunlocker',
    'bloxstrap fastflags list performance',
    'roblox input lag fix competitive',
    'trocar sons antigos roblox oof sound',
    'voltris optimizer roblox',
    'graphics quality manual settings'
];

export const metadata: Metadata = createGuideMetadata('roblox-fps-unlocker-bloat-fix-bloxstrap', title, description, keywords);

export default function RobloxGuide() {
    const summaryTable = [
        { label: "Launcher", value: "Bloxstrap (GitHub)" },
        { label: "FPS Cap", value: "9999 (Unlimited)" },
        { label: "Render", value: "D3D11 / Vulkan" },
        { label: "Gráficos", value: "Manual (Barra 10)" },
        { label: "Input Lag", value: "Low Latency Mode" },
        { label: "Som", value: "Oof (Restaurado)" },
        { label: "FastFlags", value: "Custom JSON" }
    ];

    const contentSections = [
        {
            title: "Introdução: Por que Bloxstrap?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O rbxfpsunlocker.exe antigo funcionava, mas o <strong>Bloxstrap</strong> é melhor. Ele substitui o launcher oficial, atualiza o Roblox sozinho e aplica mods sem você ter que abrir nada extra. É o padrão ouro da comunidade.
        </p>
      `
        },
        {
            title: "Capítulo 1: Instalação",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Passo a Passo</h4>
                <p class="text-gray-400 text-xs text-justify">
                    1. Baixe o Bloxstrap no GitHub (pizzaboxer/bloxstrap).
                    2. Instale (ele detecta sua instalação atual).
                    3. No menu "Framerate Limit", coloque <strong>9999</strong> ou a taxa do seu monitor (165).
                    4. Clique em Install.
                    Agora, sempre que abrir o Roblox pelo site, ele abre pelo Bloxstrap.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: FastFlags (JSON)",
            content: `
        <p class="mb-4 text-gray-300">
            FastFlags são configurações ocultas de desenvolvedor.
            <br/>No Bloxstrap Menu > FastFlags > Editor.
            <br/>Você pode forçar:
            <br/>- Renderização Vulkan (melhor em alguns PCs).
            <br/>- Desativar sombras pós-processamento.
            <br/>- <strong>Exclusive Fullscreen:</strong> Reduz muito o input lag.
        </p>
      `
        },
        {
            title: "Capítulo 3: Gráficos Manuais",
            content: `
        <p class="mb-4 text-gray-300">
            Dentro do jogo:
            <br/>Settings > Graphics Mode: <strong>Manual</strong>.
            <br/>Nunca deixe em Automatic. O automático fica mudando a qualidade e causando lag spikes.
            <br/>Para competitivo (BedWars, Arsenal): Deixe no 1 ou 2 (remove grama e sombras).
            <br/>Para Showcase: Deixe no 10.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: Future Lighting",
            content: `
            <p class="mb-4 text-gray-300">
                Jogos novos usam a tecnologia "Future" de iluminação.
                <br/>Ela pesa MUITO.
                <br/>Se seu PC for fraco, você pode usar uma FastFlag para forçar a iluminação "ShadowMap" ou "Voxel" (antiga) em qualquer jogo, ganhando FPS.
                <br/>(Cuidado: Pode deixar lugares escuros demais).
            </p>
            `
        },
        {
            title: "Capítulo 5: Sons e Texturas Antigas",
            content: `
        <p class="mb-4 text-gray-300">
            Bloxstrap > Mods.
            <br/>- <strong>Use Old Death Sound:</strong> Traz de volta o "Oof!".
            <br/>- <strong>Old Avatar Editor Background:</strong> Remove o fundo 3D pesado do editor de avatar.
            <br/>- <strong>Old Mouse Cursor:</strong> Traz o cursor clássico.
        </p>
      `
        },
        {
            title: "Capítulo 6: ReShade no Roblox",
            content: `
        <p class="mb-4 text-gray-300">
            O Bloxstrap facilita a instalação do ReShade (Extravi's ReShade).
            <br/>Cuidado: Em jogos de tiro, shaders de zoom podem ser considerados cheat. Use apenas filtros de cor.
        </p>
      `
        },
        {
            title: "Capítulo 7: Ping e Conexão",
            content: `
        <p class="mb-4 text-gray-300">
            O Roblox não deixa escolher servidor.
            <br/>Use a extensão de navegador <strong>RoPro</strong> ou <strong>BTRoblox</strong>.
            <br/>Elas mostram a lista de servidores e o Ping de cada um. Entre num servidor da sua região (Ex: São Paulo ou Flórida) para ter ping baixo.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: Limpeza de Cache",
            content: `
            <p class="mb-4 text-gray-300">
                O Roblox acumula gigas de texturas temporárias.
                <br/>Pressione Win+R, digite <code>%temp%</code> e apague a pasta <code>Roblox</code> periodicamente se tiver problemas de texturas não carregando.
            </p>
            `
        },
        {
            title: "Capítulo 9: VR Mode",
            content: `
            <p class="mb-4 text-gray-300">
                Se o Roblox insiste em abrir o SteamVR quando você não quer:
                <br/>No Bloxstrap > FastFlags > Disable VR.
            </p>
            `
        },
        {
            title: "Capítulo 10: Multi-Instance",
            content: `
            <p class="mb-4 text-gray-300">
                O Bloxstrap permite abrir múltiplas contas ao mesmo tempo (Multi-Roblox).
                <br/>Útil para farmar AFK em jogos de simulador.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Bloxstrap é seguro?",
            answer: "Sim, é Open Source e usado por milhões. Não dá ban, pois não injeta DLLs maliciosas no jogo, apenas configura parâmetros de inicialização."
        },
        {
            question: "Tela branca (White Screen)?",
            answer: "Geralmente driver de vídeo desatualizado ou overlay do Discord/Afterburner bugando o Roblox. Desative os overlays."
        }
    ];

    const externalReferences = [
        { name: "Bloxstrap GitHub", url: "https://github.com/pizzaboxer/bloxstrap" },
        { name: "Roblox FPS Unlocker (Legacy)", url: "https://github.com/axstin/rbxfpsunlocker" }
    ];

    const relatedGuides = [
        {
            href: "/guias/minecraft-shaders-iris-sodium-otimizacao-fps",
            title: "Minecraft",
            description: "Otimização similar."
        },
        {
            href: "/guias/dns-mais-rapido-para-jogos-benchmark",
            title: "Ping",
            description: "Melhorar conexão."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="15 min"
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
