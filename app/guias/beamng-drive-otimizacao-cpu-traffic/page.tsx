import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'beamng-drive-otimizacao-cpu-traffic',
    title: "BeamNG.drive (2026): Otimização de Física, Tráfego AI e Vulkan",
    description: "BeamNG é um simulador de física soft-body. Aprenda a configurar quantos carros AI sua CPU aguenta, usar o modo Vulkan para dobrar FPS e Mods essenciais.",
    category: 'jogos',
    difficulty: 'Avançado',
    time: '25 min'
};

const title = "BeamNG.drive (2026): Esmagando Latas a 60 FPS";
const description = "Cada carro no BeamNG simula centenas de nós físicos (nodes & beams). Seu FPS depende diretamente de quantos carros estão na tela e da força do seu processador.";

const keywords = [
    'beamng drive vulkan mode crash fix',
    'beamng traffic ai fps drop',
    'como colocar mais carros no beamng sem travar',
    'beamng mp multiplayer lag',
    'ck graphics settings beamng',
    'simplified collision physics',
    'melhor cpu para beamng drive 2026',
    'voltris optimizer physics',
    'clear cache beamng deep clean'
];

export const metadata: Metadata = createGuideMetadata('beamng-drive-otimizacao-cpu-traffic', title, description, keywords);

export default function BeamNGGuide() {
    const summaryTable = [
        { label: "API", value: "Vulkan (Experimental)" },
        { label: "Max Cars", value: "1 por Núcleo CPU" },
        { label: "Reflections", value: "Low (Update Rate)" },
        { label: "Shadows", value: "Partial" },
        { label: "Mesh Quality", value: "Normal" },
        { label: "Grass", value: "0.5 (Density)" },
        { label: "Multiplayer", value: "BeamMP" }
    ];

    const contentSections = [
        {
            title: "Introdução: 1 Carro = 1 Núcleo",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Regra de Ouro: Para cada veículo bot (AI) que você spawna, o jogo dedica 1 núcleo do processador.
          <br/>Se você tem um Ryzen 5 5600 (6 núcleos), o ideal é spawnar no máximo 5 carros de tráfego + o seu. Spawnar 10 vai fazer o jogo ficar em câmera lenta (slow motion physics).
        </p>
      `
        },
        {
            title: "Capítulo 1: Vulkan Mode (Performance Boost)",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Dobre seu FPS (com risco)</h4>
                <p class="text-gray-400 text-xs text-justify">
                    Ao iniciar o jogo, escolha <strong>Launch (Vulkan)</strong>.
                    <br/>Vulkan reduz drasticamente o gargalo de CPU na renderização, permitindo mais carros na tela com FPS alto.
                    <br/><em>Problema:</em> Em 2026 ainda pode ter bugs de textura ou travar em placas de vídeo antigas (GTX 1000). Teste. Se funcionar, é a melhor otimização possível.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Configuração de Tráfego (AI)",
            content: `
        <p class="mb-4 text-gray-300">
            No menu de Tráfego:
            <br/>- <strong>Max Vehicles:</strong> Ajuste conforme seus núcelos (recomendo 5 a 7 para CPUs médias).
            <br/>- <strong>Simplified Physics:</strong> ATIVE. Isso faz os carros distantes usarem uma física simplificada, economizando CPU. Quando você bate neles, eles "acordam" a física full.
            <br/>- <strong>Police:</strong> Desative se não for usar. A lógica de perseguição policial consome ciclos extras de IA.
        </p>
      `
        },
        {
            title: "Capítulo 3: Gráficos (Lighting)",
            content: `
        <p class="mb-4 text-gray-300">
            - <strong>Dynamic Reflections:</strong> Desligue ou deixe no mínimo. Renderizar o reflexo no capô do carro exige desenhar o mundo duas vezes.
            - <strong>Ambient Occlusion:</strong> SSAO é leve.
            - <strong>Shadows:</strong> Partial. Full shadows em mapas como West Coast USA pesam muito.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: BeamMP (Multiplayer)",
            content: `
        <p class="mb-4 text-gray-300">
            BeamNG não tem MP oficial. Use o mod <strong>BeamMP</strong>.
            <br/>- O lag de posição (netcode) depende do Ping.
            <br/>- O FPS depende da CPU. Em servidores com 10 players, sua CPU precisa calcular a física de 10 carros. Se alguém tiver PC da batata e lagar a física, pode lagar o servidor todo (time dilation).
        </p>
      `
        },
        {
            title: "Capítulo 5: UI (Interface)",
            content: `
        <p class="mb-4 text-gray-300">
            A interface do BeamNG é feita em HTML (como um site).
            <br/>Apps de UI (velocímetros, mapas, graphs) consomem RAM e CPU.
            <br/>Feche apps desnecessários na tela. Limite o FPS da UI nas opções para 30fps.
        </p>
      `
        },
        {
            title: "Capítulo 6: Clear Cache (Deep Clean)",
            content: `
        <p class="mb-4 text-gray-300">
            A cada update maior, TEXTURAS FICAM LARANJAS ("NO TEXTURE").
            <br/>No launcher > Support Tools > <strong>Clear Cache</strong>.
            <br/>Isso apaga arquivos temporários velhos e resolve 99% dos bugs visuais.
        </p>
      `
        },
        {
            title: "Capítulo 7: Mods (Repositório)",
            content: `
        <p class="mb-4 text-gray-300">
            Mods de carros russos de sites terceiros geralmente são mal otimizados (modelos 3D roubados de Forza com milhões de polígonos).
            <br/>Prefira mods do <strong>Repositório Oficial</strong> in-game. São verificados e otimizados para a física "Jbeam" correta.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: World Editor (F11)",
            content: `
            <p class="mb-4 text-gray-300">
                Apertou F11 sem querer e sumiu tudo? É o editor. Aperte F11 de novo.
                <br/>Você pode usar o editor para deletar prédios ou árvores de um mapa se quiser ganhar performance bruta para gravar um vídeo específico.
            </p>
            `
        },
        {
            title: "Capítulo 9: Slow Motion",
            content: `
            <p class="mb-4 text-gray-300">
                Se o FPS cair muito, use <strong>Alt + Seta Esquerda</strong> para entrar em Slow Motion (2x, 4x, 8x).
                <br/>Isso dá tempo para a CPU calcular a física. O jogo roda liso em câmera lenta, ótimo para ver batidas detalhadas.
            </p>
            `
        },
        {
            title: "Capítulo 10: RAM Requisitada",
            content: `
            <p class="mb-4 text-gray-300">
                Mapas grandes como "Italy" ou "Johnson Valley" usam 16GB+.
                <br/>Se tiver 8GB, jogue em mapas menores como "Gridmap" ou "Small Island".
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Physics Paused?",
            answer: "Aperte 'J'. O jogo pausa a física para economizar recursos enquanto você mexe na câmera ou no menu."
        },
        {
            question: "Instability Detected?",
            answer: "Significa que a simulação física 'explodiu' matematicamente (o carro esticou ao infinito). O jogo reseta o carro automaticamente para evitar crash. Acontece com mods ruins."
        },
        {
            question: "Volante FFB?",
            answer: "BeamNG tem um dos melhores FFB do mercado. Requer configuração 'Direct' mode no driver do volante."
        }
    ];

    const externalReferences = [
        { name: "BeamMP Download", url: "https://beammp.com/" },
        { name: "BeamNG Documentation", url: "https://documentation.beamng.com/" }
    ];

    const relatedGuides = [
        {
            href: "/guias/forza-horizon-5-vram-fix-input-lag",
            title: "Forza",
            description: "Outro estilo de corrida."
        },
        {
            href: "/guias/assetto-corsa-content-manager-csp-sol",
            title: "Assetto",
            description: "Simulação de pista."
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
