import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'the-witcher-3-next-gen-otimizacao-ray-tracing',
    title: "The Witcher 3 Next-Gen (2026): DX11 vs DX12, Ray Tracing e Mods",
    description: "A atualização Next-Gen pesou o jogo. Aprenda a rodar com Ray Tracing ligado ou jogar a versão clássica DX11 para performance máxima.",
    category: 'jogos',
    difficulty: 'Intermediário',
    time: '25 min'
};

const title = "The Witcher 3 Next-Gen (2026): Geralt em 4K 60FPS";
const description = "O update 4.0 trouxe gráficos lindos mas má otimização. O segredo está em escolher entre a beleza do RT ou a fluidez do DX11 clássico.";

const keywords = [
    'the witcher 3 next gen travando dx12 fix',
    'ray tracing the witcher 3 performance settings',
    'hairworks on vs off fps impact',
    'hd reworked project next gen compatible',
    'mods essenciais the witcher 3 2026',
    'dlss 3 frame generation witcher 3',
    'como voltar para versao classica 1.32 witcher 3',
    'foliage visibility range ultra plus',
    'voltris optimizer cd projekt red',
    'reflex low latency witcher 3'
];

export const metadata: Metadata = createGuideMetadata('the-witcher-3-next-gen-otimizacao-ray-tracing', title, description, keywords);

export default function Witcher3Guide() {
    const summaryTable = [
        { label: "API", value: "DX12 (Se tiver RT)" },
        { label: "API", value: "DX11 (Performance)" },
        { label: "Ray Tracing", value: "GI (Global Illum)" },
        { label: "HairWorks", value: "Geralt Only (Low)" },
        { label: "Foliage", value: "High (Ultra+ Pesa)" },
        { label: "Shadows", value: "Low / Medium" },
        { label: "DLSS/FSR", value: "Quality" }
    ];

    const contentSections = [
        {
            title: "Introdução: O Peso da Nova Geração",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          A CD Projekt RED adicionou Ray Tracing Global Illumination (RTGI), que transforma a iluminação do jogo, mas custa 40 FPS. Se você não tem uma RTX 3080/4070, cuidado.
        </p>
      `
        },
        {
            title: "Capítulo 1: DX11 vs DX12",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Launcher Options</h4>
                <p class="text-gray-400 text-xs text-justify">
                    - <strong>DX12:</strong> Necessário para Ray Tracing, DLSS e FSR. Tem um pouco mais de stuttering compilando shaders.
                    <br/>- <strong>DX11:</strong> Versão "Clássica". Muito mais leve, mas sem DLSS/FSR (apenas TAA). Use se tiver GTX 1060 ou inferior.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Ray Tracing (Otimizado)",
            content: `
        <p class="mb-4 text-gray-300">
            Se for ligar RT, ligue APENAS o <strong>Ray Traced Global Illumination</strong> (Modo Performance).
            <br/>Desligue RT Shadows, RT Reflections e RT Ambient Occlusion. O GI já faz 90% da diferença visual nas florestas e interiores.
            <br/>Sempre use com DLSS Quality ou Balanced.
        </p>
      `
        },
        {
            title: "Capítulo 3: HairWorks (Cabelo do Geralt)",
            content: `
        <p class="mb-4 text-gray-300">
            A tecnologia HairWorks simula fios de cabelo individuais.
            <br/>- <strong>Geralt Only:</strong> O melhor compromisso. O cabelo do Geralt fica bonito, e você não gasta GPU renderizando pelos de lobos e ursos que você nem vê direito na luta.
            <br/>- <strong>AA HairWorks:</strong> 2x ou 4x. 8x é inútil.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: Configurações Ultra+ (Novidade)",
            content: `
        <p class="mb-4 text-gray-300">
            A versão Next-Gen adicionou presets "Ultra+".
            <br/>- <strong>Foliage Visibility Range:</strong> High é suficiente. Ultra+ renderiza árvores no horizonte infinito, matando a performance.
            - <strong>Grass Density:</strong> High. Ultra+ deixa a grama tão densa que esconde itens no chão.
        </p>
      `
        },
        {
            title: "Capítulo 5: Mods Essenciais (Já Inclusos?)",
            content: `
        <p class="mb-4 text-gray-300">
            O update Next-Gen já integrou o famoso mod <strong>"HD Reworked Project"</strong> (texturas 4K). Não instale esse mod manualmente, vai dar conflito.
            <br/>Mods recomendados para instalar:
            <br/>- <strong>"Fast Travel from Anywhere":</strong> Viaje sem precisar ir até a placa.
            <br/>- <strong>"Auto Apply Oils":</strong> O jogo aplica o óleo correto na espada automaticamente ao entrar em combate. Economiza tempo de menu.
        </p>
      `
        },
        {
            title: "Capítulo 6: Frame Generation (DLSS 3)",
            content: `
        <p class="mb-4 text-gray-300">
            Witcher 3 suporta DLSS 3 Frame Gen.
            <br/>Isso é mágico para jogar com RT ligado. Transforma 40 FPS em 70 FPS.
            <br/>O input lag aumenta um pouco, mas como é um jogo de espada (animações longas), não atrapalha tanto.
        </p>
      `
        },
        {
            title: "Capítulo 7: Stutter Fix DX12",
            content: `
        <p class="mb-4 text-gray-300">
            Vá na pasta do jogo <code>bin\\config\\base</code>.
            <br/>Abra <code>rendering.ini</code>.
            <br/>Mude <code>TextureStreamingHeads</code> de 1 para 0.
            <br/>Mude <code>TextureStreamingDistanceLimit</code> para um valor alto (ex: 40000).
            <br/>Isso reduz o pop-in de texturas e stutters.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: Câmera Próxima (Close)",
            content: `
            <p class="mb-4 text-gray-300">
                O modo Next-Gen traz uma câmera sobre o ombro (estilo God of War).
                <br/>Em Opções de Gameplay, você pode configurar separadamente:
                <br/>- Exploração: Câmera Longe (Padrão).
                <br/>- Combate: Câmera Longe (Para ver inimigos nas costas).
                <br/>- Montaria: Câmera Perto (Imersão).
            </p>
            `
        },
        {
            title: "Capítulo 9: Cross-Progression",
            content: `
            <p class="mb-4 text-gray-300">
                Entre na sua conta GOG no menu principal.
                <br/>Isso ativa o Cross-Save. Você pode jogar no PC, salvar, e continuar no Nintendo Switch ou PS5 (se tiver o jogo lá) exatamente de onde parou.
            </p>
            `
        },
        {
            title: "Capítulo 10: Limite de FPS em Menus",
            content: `
            <p class="mb-4 text-gray-300">
                O inventário do Witcher 3 não tem limite de FPS e pode bater 500 FPS, esquentando a GPU.
                <br/>Use o Painel Nvidia para limitar o FPS global do executável <code>witcher3.exe</code>.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Como reverter para a versão 1.32 (Antiga)?",
            answer: "Na Steam > Propriedades > Betas > Selecione 'classic - 1.32'. Isso baixa a versão antiga de 2015, que roda muito mais leve em PCs fracos e é compatível com mods antigos."
        },
        {
            question: "Crash na Cutscene?",
            answer: "Desligue o Nvidia HairWorks. Algumas cutscenes bugam quando o HairWorks tenta renderizar cabelo em zoom extremo."
        },
        {
            question: "Qual o melhor sinal (Sign) para upar?",
            answer: "Quen (Escudo). No modo Marcha da Morte, é o único que te salva de hit-kill."
        }
    ];

    const externalReferences = [
        { name: "The Witcher 3 Nexus Mods", url: "https://www.nexusmods.com/witcher3" },
        { name: "HD Reworked Project (Info)", url: "https://www.nexusmods.com/witcher3/mods/1021" }
    ];

    const relatedGuides = [
        {
            href: "/guias/nvidia-painel-controle-melhores-configuracoes",
            title: "Nvidia",
            description: "DSR para 4K."
        },
        {
            href: "/guias/hdr-windows-11-calibracao-jogos",
            title: "HDR",
            description: "Fica lindo em Toussaint."
        },
        {
            href: "/guias/controle-ps4-ps5-overclock-ds4windows",
            title: "Controle",
            description: "Gameplay fluida."
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
