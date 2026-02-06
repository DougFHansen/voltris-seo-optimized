import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'roblox-fps-unlocker-guia',
    title: "Roblox FPS Unlocker 2026: Guia Bloxstrap e FastFlags",
    description: "Não jogue a 60 FPS. Aprenda a usar o Bloxstrap para desbloquear FPS, editar FastFlags para gráficos de batata e otimizar o ping.",
    category: 'jogos',
    difficulty: 'Fácil',
    time: '25 min'
};

const title = "Roblox High Performance (2026): Bloxstrap & FastFlags";
const description = "O cliente padrão do Roblox é limitado. O Bloxstrap é a ferramenta essencial que permite usar FastFlags JSON para desativar texturas, sombras e o limite de FPS.";

const keywords = [
    'roblox fps unlocker download 2026',
    'bloxstrap download configurar',
    'roblox fastflags json fps boost',
    'como tirar sombra do roblox fastflag',
    'fflagdebuggraphicspreferopengl',
    'roblox clientappsettings.json tutorial',
    'como diminuir ping roblox',
    'roblox rodando lento pc bom',
    'voltris optimizer roblox',
    'futura iluminação roblox desativar'
];

export const metadata: Metadata = createGuideMetadata('roblox-fps-unlocker-guia', title, description, keywords);

export default function RobloxGuide() {
    const summaryTable = [
        { label: "Ferramenta", value: "Bloxstrap (Obrigatório)" },
        { label: "FPS Limit", value: "9999 (Infinito)" },
        { label: "Rendering", value: "D3D11 ou Vulkan" },
        { label: "Lighting", value: "Voxel (Leve)" },
        { label: "Textures", value: "1 (Low Quality)" },
        { label: "Fullscreen", value: "Exclusive" },
        { label: "Material", value: "Plastic" }
    ];

    const contentSections = [
        {
            title: "Introdução: O limite de 60 FPS",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O Roblox trava o jogo em 60 FPS por padrão. Isso é horrível para obbies e jogos de tiro (Arsenal/Phantom Forces). Antigamente usávamos o "rbxfpsunlocker.exe", mas hoje o <strong>Bloxstrap</strong> faz isso e muito mais.
        </p>
         <div class="bg-[#0A0A0F] border border-blue-500/30 p-5 rounded-xl my-6">
            <h4 class="text-blue-400 font-bold mb-2">O que é Bloxstrap?</h4>
            <p class="text-gray-300 text-sm">
                É um launcher alternativo open-source seguro para Roblox. Ele permite injetar configurações (FastFlags) antes do jogo abrir. Ele substitui o launcher oficial e melhora a compatibilidade com o Discord.
            </p>
        </div>
      `
        },
        {
            title: "Capítulo 1: Instalando e Configurando o Bloxstrap",
            content: `
        <ol class="list-decimal list-inside text-gray-300 text-sm space-y-2">
            <li>Baixe o Bloxstrap do GitHub oficial (pizzaboxer/bloxstrap).</li>
            <li>Na instalação, vá em <strong>"FastFlags"</strong>.</li>
            <li>Em "Framerate Limit", coloque <strong>9999</strong> ou a taxa de Hz do seu monitor (ex: 165).</li>
            <li>Em "Rendering Mode", deixe em <strong>Automatic</strong> ou force <strong>Direct3D 11</strong> (Geralmente o mais estável).</li>
            <li>Instale. Agora abra seus jogos pelo site do Roblox normalmente, o Bloxstrap vai assumir.</li>
        </ol>
      `
        },
        {
            title: "Capítulo 2: FastFlags Mágicas (JSON)",
            content: `
        <p class="mb-4 text-gray-300">
            Você pode editar manualmente o arquivo <code>ClientAppSettings.json</code> ou usar o editor do Bloxstrap. Adicione estas flags para performance extrema:
        </p>
        <div class="bg-black/50 p-4 rounded text-xs font-mono text-green-400 overflow-x-auto">
            {<br/>
            &nbsp;&nbsp;"DFIntTaskSchedulerTargetFps": 9999,<br/>
            &nbsp;&nbsp;"FFlagDebugGraphicsDisableShadows": true,<br/>
            &nbsp;&nbsp;"FFlagDebugGraphicsPreferD3D11": true,<br/>
            &nbsp;&nbsp;"FFlagDebugGraphicsQualityLevel": 1,<br/>
            &nbsp;&nbsp;"FIntDebugForceMSAASamples": 0,<br/>
            &nbsp;&nbsp;"FFlagGlobalWindRendering": false<br/>
            }
        </div>
        <p class="mt-2 text-xs text-gray-400">
            <strong>Explicação:</strong> Isso remove sombras, vento, força qualidade 1 (abaixo do mínimo do menu) e desativa Anti-Aliasing.
        </p>
      `
        },
        {
            title: "Capítulo 3: Tecnologia de Iluminação",
            content: `
        <p class="mb-4 text-gray-300">
            Jogos novos usam "Future Lighting" (pesado).
            <br/>Você pode tentar forçar a iluminação antiga (Voxel ou ShadowMap) via FastFlag, mas alguns jogos podem ficar escuros demais.
            <br/>Flag: <code>"FFlagDebugForceFutureIsBrightPhase3": false</code>
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: Reduzindo Ping (Rotas)",
            content: `
        <p class="mb-4 text-gray-300">
            O Roblox não tem servidor no Brasil para a maioria dos jogos (apenas alguns hubs). Você joga com 150ms nos EUA.
            <br/>O Bloxstrap mostra a região do servidor (Ctrl+Shift+F5).
            <br/>Use cabo Ethernet. Wi-Fi oscila muito com o protocolo UDP do Roblox.
        </p>
      `
        },
        {
            title: "Capítulo 5: Texturas de Plástico (Potato Mode)",
            content: `
        <p class="mb-4 text-gray-300">
            Existe um pacote de texturas (não oficial) que deixa tudo liso (Plastic).
            <br/>No Bloxstrap, vá em "Mods" e ative "Old Death Sound" (opcional) e procure a opção de aplicar texturas customizadas.
            <br/>Coloque arquivos de textura 1x1 pixel transparente na pasta de texturas. O jogo vai carregar cor sólida em vez de texturas de madeira/concreto, economizando muita VRAM.
        </p>
      `
        },
        {
            title: "Capítulo 6: Rendering API (Vulkan vs D3D11)",
            content: `
        <p class="mb-4 text-gray-300">
            Se você tem PC muito antigo (Intel HD 2000/3000): Tente usar <strong>Vulkan</strong> ou <strong>OpenGL</strong> nas FastFlags.
            <br/>Às vezes o Vulkan gerencia melhor a pouca memória de vídeo que o DX11.
            <br/>Flag: <code>"FFlagDebugGraphicsPreferVulkan": true</code>
        </p>
      `
        },
        {
            title: "Capítulo 7: Prioridade no Windows",
            content: `
        <p class="mb-4 text-gray-300">
            Quando o Roblox está em segundo plano (Alt+Tab), ele reduz o FPS para 15 para economizar energia.
            <br/>Se você quer farmar AFK com FPS alto (para macros funcionarem):
            <br/>Flag: <code>"DFIntTaskSchedulerTargetFpsWhenBackground": 60</code>
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: Problemas com Anti-Virus",
            content: `
            <p class="mb-4 text-gray-300">
                O inject do Bloxstrap ou FPS Unlocker é benigno, mas alguns antivírus grátis (Avast) bloqueiam. Adicione a pasta do Bloxstrap nas exclusões.
            </p>
            `
        },
        {
            title: "Capítulo 9: Voltris Optimizer para Roblox",
            content: `
            <p class="mb-4 text-gray-300">
                O <strong>Voltris Optimizer</strong> detecta o processo <code>RobloxPlayerBeta.exe</code> e aplica automaticamente o plano de energia de alto desempenho e limpa a RAM standby, o que ajuda muito em jogos de mundo aberto como Jailbreak ou Mad City.
            </p>
            `
        },
        {
            title: "Capítulo 10: Tela Cheia Exclusiva",
            content: `
            <p class="mb-4 text-gray-300">
                O Roblox usa "Fullscreen Windowed" que tem input lag.
                <br/>Pressione <strong>Alt+Enter</strong> para tentar forçar fullscreen real (depende do driver) ou use a flag <code>"FFlagHandleAltEnterFullscreenManually": true</code>.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Bloxstrap dá ban?",
            answer: "Não. O Bloxstrap apenas organiza as configurações que o próprio Roblox permite (FastFlags). É usado por milhões de jogadores e youtubers. Não é um cheat (não dá aimbot nem wallhack)."
        },
        {
            question: "Meu FPS continua em 60 mesmo com unlocker?",
            answer: "Verifique se o V-Sync está forçado no Painel de Controle da Nvidia/AMD. O V-Sync limita o FPS aos Hz do monitor. Desligue o V-Sync globalmente ou para o Roblox."
        },
        {
            question: "Como reverter as mudanças?",
            answer: "No menu do Bloxstrap, basta clicar em 'Reset FastFlags' ou desinstalar o Bloxstrap. O launcher original do Roblox voltará ao normal."
        }
    ];

    const externalReferences = [
        { name: "Bloxstrap GitHub", url: "https://github.com/pizzaboxer/bloxstrap" },
        { name: "Roblox FastFlags List", url: "https://roblox.fandom.com/wiki/Fast_Flag" },
        { name: "Bloxstrap Discord", url: "https://discord.gg/bloxstrap" }
    ];

    const relatedGuides = [
        {
            href: "/guias/otimizacao-ssd-windows-11",
            title: "SSD",
            description: "Mapas carregam instantaneamente."
        },
        {
            href: "/guias/como-escolher-mouse-gamer",
            title: "Mouse",
            description: "DPI alto para jogos de tiro."
        },
        {
            href: "/guias/internet-lenta-jogos-lag",
            title: "Rede",
            description: "Resolva o ping alto no Roblox."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="25 min"
            difficultyLevel="Fácil"
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
