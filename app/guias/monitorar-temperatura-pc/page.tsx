import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'monitorar-temperatura-pc',
    title: "Como Monitorar Temperatura do PC em Jogos (MSI Afterburner) (2026)",
    description: "Aprenda a exibir FPS, temperatura da CPU/GPU, uso de RAM e VRAM na tela enquanto joga usando o MSI Afterburner e RivaTuner Statistics Server.",
    category: 'hardware',
    difficulty: 'Intermediário',
    time: '20 min'
};

const title = "Setup de Monitoramento: FPS e Temperatura na Tela (OSD Completo)";
const description = "Quer saber se seu PC está gargalando? Configure o Overlay do RivaTuner para mostrar estatísticas em tempo real no CS2, Valorant, GTA V e mais.";

const keywords = [
    'como mostrar fps na tela msi afterburner',
    'monitorar temperatura cpu ingame',
    'rivatuner statistics server tutorial',
    'overlay fps temperatura gpu',
    'configurar msi afterburner 2026',
    'frametime graph para que serve',
    'hwmonitor vs hwinfo64',
    'pc desligando sozinho temperatura'
];

export const metadata: Metadata = createGuideMetadata('monitorar-temperatura-pc', title, description, keywords);

export default function TempGuide() {
    const summaryTable = [
        { label: "Software", value: "MSI Afterburner + RTSS" },
        { label: "CPU Temp Ideal", value: "Abaixo de 80°C" },
        { label: "GPU Temp Ideal", value: "Abaixo de 75°C" },
        { label: "Impacto FPS", value: "Mínimo (1-2 FPS)" },
        { label: "Recurso Vital", value: "Frametime Graph" },
        { label: "Compatibilidade", value: "DX11, DX12, Vulkan" }
    ];

    const contentSections = [
        {
            title: "Por que monitorar?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Saber apenas o FPS não conta a história toda. Se seu FPS é alto mas o jogo "engasga", você precisa ver o <strong>Frametime</strong>. Se o PC desliga, precisa ver a <strong>Temperatura</strong>. Se o jogo trava e fecha, precisa ver o uso de <strong>RAM/VRAM</strong>.
        </p>

        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20 my-8">
            <h4 class="text-[#31A8FF] font-bold mb-3 flex items-center gap-2">
                <span class="text-xl">📊</span> Overlay Nativo Voltris
            </h4>
            <p class="text-gray-300 mb-4">
                O MSI Afterburner é excelente, mas tem uma interface de 2005 e muitas opções confusas. O <strong>Voltris Optimizer</strong> inclui um Overlay Moderno pré-configurado que mostra apenas o essencial (FPS, Latência, Temp), com design clean que não polui sua imersão.
            </p>
            <a href="/voltrisoptimizer" class="group relative inline-flex px-8 py-3 bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-white font-bold text-base rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-[1.03] hover:shadow-[0_0_60px_rgba(139,49,255,0.4)] items-center justify-center gap-2">
                Ativar Overlay Voltris
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
            </a>
        </div>
      `
        },
        {
            title: "Passo 1: Instalação e Configuração",
            content: `
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4 bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
            <li>Baixe o MSI Afterburner (Site oficial da Guru3D ou MSI).</li>
            <li>Durante a instalação, certifique-se de marcar <strong>RivaTuner Statistics Server (RTSS)</strong>. O Afterburner lê os dados, o RivaTuner desenha na tela. Um não vive sem o outro.</li>
            <li>Abra o Afterburner. Clique na Engrenagem (Configurações).</li>
            <li>Vá na aba <strong>Monitoramento</strong>.</li>
        </ol>
      `
        },
        {
            title: "Passo 2: Escolhendo o que mostrar",
            content: `
        <p class="mb-4 text-gray-300">
            Na lista de gráficos, você deve clicar no item (ex: Temperatura da GPU) e depois marcar a caixa lá embaixo <strong>"Exibir nas informações em tela (OSD)"</strong>. O item ficará com "Em OSD" escrito ao lado.
        </p>
        <p class="text-gray-300 font-bold mb-2">Checklist Essencial:</p>
        <ul class="list-disc list-inside text-gray-300 space-y-1 ml-4 text-sm">
            <li>[x] Temperatura da GPU</li>
            <li>[x] Uso da GPU (%) - Se estiver em 99%, o gargalo é a GPU.</li>
            <li>[x] Uso de VRAM (Memória de vídeo)</li>
            <li>[x] Temperatura da CPU</li>
            <li>[x] Uso da CPU (%)</li>
            <li>[x] Uso de RAM</li>
            <li>[x] Taxa de quadros (FPS)</li>
            <li>[x] Tempo de quadros (Frametime) - IMPORTANTE: Mude de "Texto" para "Gráfico".</li>
        </ul>
      `
        },
        {
            title: "Passo 3: Entendendo o Frametime (A Linha Lisa)",
            content: `
        <p class="mb-4 text-gray-300">
            O FPS mostra a média do segundo. O Frametime mostra o tempo de cada quadro.
        </p>
        <p class="text-gray-300 mb-4">
            Uma linha de Frametime reta e lisa significa jogo fluido.
            <br/>Picos (spikes) na linha significam travadas (stuttering), mesmo que o contador de FPS diga "60".
        </p>
        <p class="text-gray-300">
            Se você tem muitos picos no gráfico, o problema pode ser RAM (falta de dual channel), HD lento carregando textura, ou superaquecimento (Thermal Throttling).
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "HWInfo64: Para Diagnóstico Profundo",
            content: `
            <div class="bg-gray-800/50 p-6 rounded-xl border border-gray-700 mb-8">
                <h4 class="text-white font-bold mb-4 text-xl">Sensores Avançados</h4>
                <p class="text-gray-300 mb-4">
                    O Afterburner mostra o básico. O <strong>HWInfo64</strong> mostra voltagens individuais de cada núcleo, temperatura do VRM da placa mãe, velocidade do fan em RPM e erros de memória da GPU.
                </p>
                <p class="text-gray-300 text-sm">
                    Você pode conectar o HWInfo64 ao RivaTuner para mostrar esses dados avançados na tela do jogo, mas exige configuração manual complexa.
                </p>
            </div>
            `
        }
    ];

    const additionalContentSections = [
        {
            title: "Não aparece no CS2?",
            content: `
            <p class="mb-4 text-gray-300">
                O Counter-Strike 2 e alguns jogos anti-cheat bloqueiam overlays de terceiros.
            </p>
            <p class="text-gray-300 text-sm">
                Para o CS2, adicione <code>-allow_third_party_software</code> nas opções de inicialização da Steam (CUIDADO: Isso reduz seu Trust Factor). A melhor opção é usar o comando nativo do console <code>cl_showfps 1</code> ou a telemetria do próprio jogo.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Isso diminui meu FPS?",
            answer: "Muito pouco. Em PCs muito fracos (Dual Core), o processo de monitoramento pode roubar 1-2 FPS. Em PCs modernos, é imperceptível."
        },
        {
            question: "Qual tecla liga/desliga?",
            answer: "Você configura na aba 'Informações em Tela (OSD)'. Sugerimos F10 ou F11."
        },
        {
            question: "GPU a 85°C é perigoso?",
            answer: "Para Laptop, não. Para Desktop, é alto. Se bater 85°C, a placa vai começar a reduzir o clock (Thermal Throttling). O ideal é manter abaixo de 75°C ajustando a curva de ventoinha (Fan Curve) no próprio Afterburner."
        }
    ];

    const externalReferences = [
        { name: "MSI Afterburner Download", url: "https://www.msi.com/Landing/afterburner/graphics-cards" },
        { name: "Guru3D RTSS Download", url: "https://www.guru3d.com/files-details/rtss-rivatuner-statistics-server-download.html" }
    ];

    const relatedGuides = [
        {
            href: "/guias/overclock-gpu-msi-afterburner",
            title: "Overclock GPU",
            description: "Já que instalou o Afterburner, ganhe FPS."
        },
        {
            href: "/guias/otimizacoes-para-notebook-gamer",
            title: "Notebooks",
            description: "Controle térmico em laptops."
        },
        {
            href: "/guias/verificar-saude-hd-ssd-crystaldiskinfo",
            title: "Saúde Hardware",
            description: "Monitore seus discos também."
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
