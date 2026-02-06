import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'assetto-corsa-content-manager-csp-sol',
    title: "Assetto Corsa (2026): Content Manager, CSP e Sol/Pure",
    description: "Assetto Corsa é eterno, mas exige mods. Guia completo de instalação do Content Manager, Custom Shaders Patch (CSP) e clima dinâmico Sol/Pure.",
    category: 'jogos',
    difficulty: 'Avançado',
    time: '50 min'
};

const title = "Assetto Corsa (2026): O Guia Definitivo de Mods";
const description = "Transforme o jogo de 2014 em algo superior a lançamentos de 2026. A combinação CM + CSP + Pure é obrigatória para qualquer SimRacer.";

const keywords = [
    'assetto corsa content manager download full',
    'custom shaders patch install guide 2026',
    'sol vs pure weather assetto corsa',
    'assetto corsa vr settings quest 3',
    'configurar volante g29 assetto corsa content manager',
    'no hesi server requirements mod',
    'ppfilter realistico assetto corsa',
    'extra fx csp performance loss',
    'voltris optimizer sim racing',
    'shutoko revival project install'
];

export const metadata: Metadata = createGuideMetadata('assetto-corsa-content-manager-csp-sol', title, description, keywords);

export default function ACGuide() {
    const summaryTable = [
        { label: "Launcher", value: "Content Manager (CM)" },
        { label: "Engine", value: "CSP (Custom Shaders)" },
        { label: "Weather", value: "Pure / Sol" },
        { label: "Graphics", value: "Extra FX (Pesado)" },
        { label: "Online", value: "No Hesi / Shutoko" },
        { label: "Filter", value: "C13AEGIS / Natural" },
        { label: "VR", value: "Foveated Rendering" }
    ];

    const contentSections = [
        {
            title: "Introdução: O Jogo Base é só a Carcaça",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Ninguém joga Assetto Corsa "puro" hoje em dia. A comunidade criou uma engine gráfica nova por cima do jogo chamada CSP. Sem ela, você não tem chuva, noite, luzes ou física avançada.
        </p>
      `
        },
        {
            title: "Capítulo 1: Content Manager (O Novo Menu)",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Instalação</h4>
                <p class="text-gray-400 text-xs text-justify">
                    1. Baixe o <strong>Content Manager (Lite ou Full)</strong>.
                    <br/>2. Arraste-o para qualquer pasta (não precisa estar na pasta do jogo).
                    <br/>3. Aponte onde está o <code>AssettoCorsa.exe</code> (pasta Steam).
                    <br/>Agora você SÓ abre o jogo por aqui. Esqueça a Steam.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: Custom Shaders Patch (CSP)",
            content: `
        <p class="mb-4 text-gray-300">
            No Content Manager > Settings > Custom Shaders Patch.
            <br/>Clique em <strong>"Install CSP"</strong>.
            <br/>Recomendação: Escolha a versão <strong>Preview</strong> (Paga/Patreon do Ilja) se quiser chuva (RainFX). A versão pública grátis não tem chuva.
            <br/>Se for jogar o servidor "No Hesi", a versão pública 0.2.x funciona bem.
        </p>
      `
        },
        {
            title: "Capítulo 3: Sol e Pure (Clima)",
            content: `
        <p class="mb-4 text-gray-300">
            - <strong>Sol:</strong> Antigo, grátis, focado em ciclo dia/noite.
            - <strong>Pure:</strong> Novo, pago (Patreon Peter Boese), focado em nuvens 3D volumétricas e gráficos "fotorealistas".
            <br/>Instalação: Arraste o arquivo .zip para o Content Manager e clique em Install. Depois vá em Settings > Weather FX e selecione o script.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: Extra FX (Beleza vs Performance)",
            content: `
        <p class="mb-4 text-gray-300">
            A aba <strong>Extra FX</strong> no CSP habilita Ambient Occlusion local, reflexos reais eMotion Blur de qualidade.
            <br/>Custo: Come cerca de 30-40% do FPS.
            <br/>Se tiver GPU fraca, desative o Extra FX e use apenas as melhorias padrão do CSP.
        </p>
      `
        },
        {
            title: "Capítulo 5: PPFilters (Filtros de Pós-Processamento)",
            content: `
        <p class="mb-4 text-gray-300">
            O jogo fica amarelo/feio sem filtro.
            <br/>Baixe filtros como <strong>"C13AEGIS"</strong>, <strong>"Natural Mod"</strong> ou <strong>"Exquisite"</strong>.
            <br/>Selecione no menu "Video > Post-Processing" do CM e depois in-game no app "Pure Config".
            <br/>Isso muda o color grading para parecer gran Turismo ou GoPro.
        </p>
      `
        },
        {
            title: "Capítulo 6: Configuração de Volante (FFB)",
            content: `
        <p class="mb-4 text-gray-300">
            No CM > Settings > Assetto Corsa > Controls.
            <br/>Ative <strong>"Fianl Force Feedback Tweaks"</strong> (FFB Tweaks) no CSP.
            <br/>Isso habilita o Gyro effect, que ajuda a sentir quando o carro está saindo de traseira (drifting).
            <br/>Use LUT Generator se tiver logitech G29 para corrigir a zona morta.
        </p>
      `
        },
        {
            title: "Capítulo 7: VR Settings",
            content: `
        <p class="mb-4 text-gray-300">
            Para VR:
            <br/>- Force o modo de renderização para <strong>OpenVR</strong> ou <strong>Oculus Rift</strong>.
            <br/>- Em CSP > Graphics Adjustments: Ative <strong>AMD FidelityFX Super Resolution</strong> (funciona em VR para upscaling).
            <br/>- Desative sombras e reflexos de alta qualidade. VR exige 90 FPS cravados.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 8: Shutoko Revival Project (SRP)",
            content: `
            <p class="mb-4 text-gray-300">
                Para jogar no mapa da rodovia japonesa com tráfego:
                <br/>Você precisa baixar o mapa (Discord deles) e o Car Pack.
                <br/>Requer CSP versão 1.79 ou superior. É pesado por ser um mapa gigante.
            </p>
            `
        },
        {
            title: "Capítulo 9: Otimização de CPU (Tráfego)",
            content: `
            <p class="mb-4 text-gray-300">
                Em servidores com tráfego (AI Traffic), a CPU é o limite.
                <br/>Em CSP > New AI Behavior: Certifique-se que "Flood optimization" está ativo.
            </p>
            `
        },
        {
            title: "Capítulo 10: Apps In-Game (HUD)",
            content: `
            <p class="mb-4 text-gray-300">
                Use a barra lateral direita in-game para ativar apps.
                <br/>Recomendados:
                <br/>- <strong>Sidekick:</strong> Mostra marchas e tempo de volta compacto.
                <br/>- <strong>Helicorsa:</strong> Radar (Obrigatório para corridas online limpas).
                <br/>- <strong>Tyres:</strong> Temperatura dos pneus.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "O jogo diz 'CPU Occupancy > 99%'",
            answer: "Sua CPU não está aguentando a física ou o script de IA. Reduza o número de oponentes ou feche programas de fundo."
        },
        {
            question: "Preciso da versão Ultimate Edition?",
            answer: "SIM. 99% dos mods exigem as DLCs (arquivos de som e física dos carros japoneses/porsche). Sem a Ultimate, os mods crasham."
        },
        {
            question: "Como jogar online?",
            answer: "No Content Manager > Drive > Online. Use os filtros para buscar 'Trackday' ou 'Drift'. O browser do jogo original é quebrado."
        }
    ];

    const externalReferences = [
        { name: "Content Manager Download", url: "https://acstuff.ru/app/" },
        { name: "RaceDepartment (Mods)", url: "https://www.racedepartment.com/downloads/categories/assetto-corsa.1/" }
    ];

    const relatedGuides = [
        {
            href: "/guias/monitor-ultrawide-jogos-competitivos",
            title: "Ultrawide",
            description: "Imersão total no cockpit."
        },
        {
            href: "/guias/controle-ps4-ps5-overclock-ds4windows",
            title: "Controle",
            description: "Scripts para mouse steering."
        },
        {
            href: "/guias/cheat-engine-speedhack-jogos-offline",
            title: "Cheat Engine",
            description: "Não use online!"
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
