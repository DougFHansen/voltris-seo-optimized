import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'xenia-emulador-xbox-360-red-dead-redemption-60fps',
    title: "Xenia Canary (2026): Xbox 360 no PC (RDR1 + Gears)",
    description: "Jogue Red Dead Redemption 1 e Gears of War em 60FPS no PC. Guia do Xenia Canary, instalação de patches e correção de gráficos (FSR).",
    category: 'emulacao',
    difficulty: 'Intermediário',
    time: '25 min'
};

const title = "Xbox 360 Emulation: Xenia Canary Guide";
const description = "O Xenia Canary é a versão experimental (e melhor) do emulador de Xbox 360. Ele roda RDR1 melhor que o original e revive clássicos como Forza Horizon 1.";

const keywords = [
    'xenia canary vs master rdr1 60fps',
    'gears of war 2 3 xenia pc black screen',
    'fable 2 xenia ground texture fix',
    'como instalar patches xenia canary config.toml',
    'forza horizon 1 save corrupt fix xenia',
    'midnight club los angeles xenia fps unlock',
    'voltris optimizer xbox 360',
    'mount cache clear'
];

export const metadata: Metadata = createGuideMetadata('xenia-emulador-xbox-360-red-dead-redemption-60fps', title, description, keywords);

export default function XeniaGuide() {
    const summaryTable = [
        { label: "Versão", value: "Canary (GitHub)" },
        { label: "Renderer", value: "Vulkan / D3D12" },
        { label: "License Mask", value: "1 (Full Game)" },
        { label: "V-Sync", value: "Off (Para >30fps)" },
        { label: "Patches", value: "patches.toml" },
        { label: "Mount Cache", value: "Ativar (Faster Load)" },
        { label: "Resolution", value: "2x (1440p) / 3x (4K)" }
    ];

    const contentSections = [
        {
            title: "Introdução: Master vs Canary",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Sempre use o <strong>Xenia Canary</strong>. A versão "Master" é muito antiga e lenta. O Canary recebe updates diários com correções específicas para jogos como RDR e Fable II.
        </p>
      `
        },
        {
            title: "Capítulo 1: Configuração (config.toml)",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Editando o Arquivo</h4>
                <p class="text-gray-400 text-xs text-justify">
                    O Xenia não tem menu de configurações (GUI). Você precisa editar o arquivo <code>xenia-canary.config.toml</code> com o Bloco de Notas.
                    <br/>- <code>d3d12_allow_variable_refresh_rate_and_tearing = true</code> (Para G-Sync/FreeSync).
                    <br/>- <code>license_mask = 1</code> (Desbloqueia jogos Trial/Demo para versão Completa).
                    <br/>- <code>draw_resolution_scale_x/y = 2</code> (Para rodar em 1440p). Se seu PC for fraco, mantenha em 1.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Red Dead Redemption 1 (O Ex-Clusivo)",
            content: `
        <p class="mb-4 text-gray-300">
            O RDR1 roda incrivelmente bem no Xenia (muito melhor que no RPCS3).
            <br/>Em 4K, o jogo parece um remaster oficial.
            <br/>Exige GPU boa (RTX 3060 ou superior) para 4K 30fps estáveis.
            <br/>Gears of War 2 e 3 também rodam do início ao fim sem crashes (apenas glitchs de sombra eventuais).
        </p>
      `
        },
        {
            title: "Capítulo 3: Patches de 60FPS",
            content: `
        <p class="mb-4 text-gray-300">
            Maioria dos jogos de 360 é travada em 30fps.
            <br/>1. Baixe o <code>patches.zip</code> no GitHub do Xenia Canary.
            <br/>2. Extraia na pasta do Xenia.
            <br/>3. Abra o arquivo .patch do jogo (ex: 5454082B - Read Dead.patch) com bloco de notas.
            <br/>4. Mude <code>is_enabled = false</code> para <code>true</code> na linha "Unlock FPS" ou "60 FPS".
            <br/>5. Salve e abra o jogo.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: FSR (FidelityFX)",
            content: `
        <p class="mb-4 text-gray-300">
            O Xenia Canary tem suporte nativo a FSR 1.0 (no arquivo config).
            <br/>Útil se você quer rodar em 4K mas sua GPU não aguenta nativo.
            <br/><code>d3d12_resolution_scale = 2</code>
            <br/><code>postprocess_upscaling = "fsr"</code>
        </p>
      `
        },
        {
            title: "Capítulo 5: Problemas de Áudio (Lag)",
            content: `
        <p class="mb-4 text-gray-300">
            Se o áudio estiver atrasado:
            <br/>Mude <code>apu_max_queued_frames</code> de 64 para 16 no config.toml.
            <br/>Isso reduz a latência do som, mas pode causar "pipocos" (crackling) se a CPU for fraca (i3/Ryzen 3).
        </p>
      `
        },
        {
            title: "Capítulo 6: Clear Cache (Texturas Pretas)",
            content: `
        <p class="mb-4 text-gray-300">
            Às vezes o jogo carrega com o chão preto (Fable II).
            <br/>Delete a pasta <code>cache</code> dentro da pasta do Xenia.
            <br/>Pressione F5 durante o jogo para limpar o cache de runtime. Ajuda a desbugar gráficos na hora.
        </p>
      `
        },
        {
            title: "Capítulo 7: DLCs e Title Updates",
            content: `
        <p class="mb-4 text-gray-300">
            Xenia carrega DLCs e TUs automaticamente se estiverem na estrutura de pastas correta (Content/0000000...).
            <br/>Mas o jeito mais fácil é: File > Install Content. Selecione o arquivo do DLC. O Xenia copia para o lugar certo.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: Teclado e Mouse",
            content: `
            <p class="mb-4 text-gray-300">
                Funciona, mas é ruim. O Xenia emula o analógico com o mouse de forma estranha.
                <br/>Use um controle de Xbox (ou DualSense com DS4Windows). É a experiência nativa.
            </p>
            `
        },
        {
            title: "Capítulo 9: Saves",
            content: `
            <p class="mb-4 text-gray-300">
                Os saves são compatíveis com o Xbox 360 real!
                <br/>Você pode pegar seu save antigo do console (via Horizon/USB) e jogar no PC.
            </p>
            `
        },
        {
            title: "Capítulo 10: Linux (Steam Deck)",
            content: `
            <p class="mb-4 text-gray-300">
                O Xenia roda no Linux via Proton (SteamOS), mas é instável e tem bugs gráficos (Vulkan no Linux vs D3D12 no Windows).
                <br/>Para 360, Windows ainda é muito superior.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Melhor que RPCS3 para RDR?",
            answer: "Sim. Roda 2x mais leve e com menos bugs gráficos. A versão de PS3 do RDR era inferior, e a emulação de PS3 é mais pesada."
        },
        {
            question: "Tela preta no GoldenEye?",
            answer: "Alguns jogos XBLA (Arcade) exigem `license_mask = 1` ou `-1` para funcionar. Tente mudar no config."
        }
    ];

    const externalReferences = [
        { name: "Xenia Canary GitHub", url: "https://github.com/xenia-canary/xenia-canary" },
        { name: "Game Compatibility List", url: "https://github.com/xenia-canary/game-compatibility/issues" }
    ];

    const relatedGuides = [
        {
            href: "/guias/rpcs3-otimizacao-configuracao-60fps-patches-guia",
            title: "RPCS3",
            description: "Alternativa PS3."
        },
        {
            href: "/guias/lossless-scaling-frame-generation-fsr-guia",
            title: "Frame Gen",
            description: "Para 60fps."
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
