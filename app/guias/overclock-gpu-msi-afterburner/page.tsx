import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'overclock-gpu-msi-afterburner',
    title: "Overclock de GPU Seguro: Guia Definitivo MSI Afterburner (2026)",
    description: "Ganhe 15% de performance grátis. Aprenda a fazer overclock na sua placa de vídeo (Nvidia/AMD) usando MSI Afterburner, testar estabilidade com Kombustor e fazer Undervolt.",
    category: 'hardware',
    difficulty: 'Avançado',
    time: '60 min'
};

const title = "Overclock de GPU com MSI Afterburner: O Guia Seguro e Eficiente (2026)";
const description = "Seu hardware pode mais. Desbloqueie o potencial oculto da sua placa de vídeo aumentando o Core Clock e Memory Clock sem queimar nada.";

const keywords = [
    'como fazer overclock placa de video msi afterburner',
    'overclock seguro gpu nvidia amd 2026',
    'voltagem curva msi afterburner undervolt',
    'aumentar fps overclock vale a pena',
    'testar estabilidade overclock kombustor furmark',
    'power limit temp limit seguro',
    'memoria gddr6 overclock',
    'msi afterburner download oficial'
];

export const metadata: Metadata = createGuideMetadata('overclock-gpu-msi-afterburner', title, description, keywords);

export default function OverclockGuide() {
    const summaryTable = [
        { label: "Software", value: "MSI Afterburner (Gratuito)" },
        { label: "Risco", value: "Baixo (Se não mexer na Voltagem)" },
        { label: "Ganho Médio", value: "+10% a +15% FPS" },
        { label: "Hardware", value: "Qualquer GPU (GTX/RTX/RX)" },
        { label: "Técnica", value: "Scan Manual de Frequência" },
        { label: "Undervolt", value: "Recomendado para Notebooks" }
    ];

    const contentSections = [
        {
            title: "O que é Overclock e a 'Loteria do Silício'",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          As fabricantes (Asus, Gigabyte, MSI) configuram suas placas de vídeo com clocks conservadores para garantir que 100% dos chips funcionem bem em qualquer condição. Isso significa que **toda** placa de vídeo tem uma margem de segurança não utilizada. O Overclock é o processo de usar essa margem para ganhar FPS de graça.
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed">
          O limite do overclock depende da "Silicon Lottery" (Loteria do Silício). Duas placas RTX 4060 idênticas podem ter limites diferentes. Uma pode aceitar +200MHz, a outra só +100MHz. Este guia ensinará como encontrar o limite **da sua** placa.
        </p>

        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20 my-8">
            <h4 class="text-[#31A8FF] font-bold mb-3 flex items-center gap-2">
                <span class="text-xl">🌡️</span> Monitoramento de Segurança Inteligente
            </h4>
            <p class="text-gray-300 mb-4">
                Fazer overclock sem monitorar a temperatura é perigoso. O <strong>Voltris Optimizer</strong> inclui um overlay discreto que avisa se a temperatura da Junção (Hotspot) passar de 95°C, prevenindo degradação do chip a longo prazo.
            </p>
            <a href="/voltrisoptimizer" class="group relative inline-flex px-8 py-3 bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-white font-bold text-base rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-[1.03] hover:shadow-[0_0_60px_rgba(139,49,255,0.4)] items-center justify-center gap-2">
                Baixar Monitor Voltris
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
            </a>
        </div>
      `
        },
        {
            title: "Core Clock vs Memory Clock: Qual importa mais?",
            content: `
        <p class="mb-4 text-gray-300">
            Aumentar os dois é bom, mas eles servem propósitos diferentes.
        </p>
        
        <!-- SVG Technical Diagram: OC Impact -->
        <div class="my-8 bg-[#0F111A] p-6 rounded-xl border border-white/5 flex flex-col items-center">
            <h4 class="text-white font-bold mb-6 text-center">Anatomia da GPU: Onde Ganhar FPS</h4>
            <svg viewBox="0 0 800 250" class="w-full h-auto text-gray-300" xmlns="http://www.w3.org/2000/svg">
                <!-- Core Cluster -->
                <g transform="translate(100, 50)">
                    <rect x="0" y="0" width="150" height="150" rx="8" fill="#1e293b" stroke="#31A8FF" stroke-width="2"/>
                    <text x="75" y="30" text-anchor="middle" fill="#fff" font-weight="bold" font-size="14">Core GPU</text>
                    <text x="75" y="80" text-anchor="middle" fill="#31A8FF" font-size="24" font-weight="bold">+150 MHz</text>
                    <text x="75" y="110" text-anchor="middle" fill="#94a3b8" font-size="10">Cálculos Geométricos</text>
                    <text x="75" y="130" text-anchor="middle" fill="#10b981" font-weight="bold" font-size="12">Ganho Linear de FPS</text>
                </g>

                <!-- Memory Modules -->
                <g transform="translate(550, 50)">
                    <rect x="0" y="0" width="150" height="150" rx="8" fill="#1e293b" stroke="#fbbf24" stroke-width="2"/>
                    <text x="75" y="30" text-anchor="middle" fill="#fff" font-weight="bold" font-size="14">VRAM (GDDR6)</text>
                    <text x="75" y="80" text-anchor="middle" fill="#fbbf24" font-size="24" font-weight="bold">+1000 MHz</text>
                    <text x="75" y="110" text-anchor="middle" fill="#94a3b8" font-size="10">Texturas e Buffer</text>
                    <text x="75" y="130" text-anchor="middle" fill="#10b981" font-weight="bold" font-size="12">Estabilidade em 4K</text>
                </g>

                <!-- Data Path -->
                <path d="M 260 125 L 540 125" stroke="#475569" stroke-width="4" stroke-dasharray="8 4"/>
                <text x="400" y="110" text-anchor="middle" fill="#fff" font-size="12">Bus Width (128/256 bit)</text>
            </svg>
            <p class="text-xs text-gray-500 mt-4 italic text-center">Figura 1: O Core Clock dá FPS direto. O Memory Clock ajuda em resoluções altas e texturas pesadas.</p>
        </div>
      `
        },
        {
            title: "Passo 1: Preparação e Segurança",
            content: `
        <p class="mb-4 text-gray-300">
           Antes de mover qualquer slider, precisamos das ferramentas certas.
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4 bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
            <li>Baixe o <strong>MSI Afterburner</strong> (Site oficial: Guru3D ou MSI). Cuidado com sites fake cheios de vírus.</li>
            <li>Baixe um software de benchmark, como <strong>Unigine Heaven</strong> ou <strong>Furmark</strong>.</li>
            <li>Abra o Afterburner.</li>
            <li>Vá nas configurações (Engrenagem) > Aba Geral.</li>
            <li>Marque: <strong>"Desbloquear controle de voltagem"</strong> e <strong>"Desbloquear monitoramento de voltagem"</strong>.</li>
            <li>Reinicie o Afterburner.</li>
        </ol>
      `
        },
        {
            title: "Passo 2: Power Limit e Temp Limit (Seguro)",
            content: `
        <p class="mb-4 text-gray-300">
            A primeira coisa a fazer é liberar a energia.
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
            <li>No painel principal, encontre os sliders <strong>Power Limit (%)</strong> e <strong>Temp Limit (°C)</strong>.</li>
            <li>Arraste ambos para o <strong>MÁXIMO</strong> (direita).</li>
            <li><em>"Isso vai queimar minha placa?"</em> <strong>NÃO.</strong> A placa tem proteções internas de BIOS. Aumentar o Power Limit apenas diz à placa: "Você pode usar mais energia se precisar para manter o clock alto". Se a temperatura subir demais, ela ainda vai reduzir a velocidade (Throttling) automaticamente. É 100% seguro em placas modernas.</li>
        </ul>
      `
        },
        {
            title: "Passo 3: Aumentando o Core Clock (FPS)",
            content: `
        <p class="mb-4 text-gray-300">
            Aqui começa a tentativa e erro.
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-2 ml-4">
            <li>Rode o Unigine Heaven em modo Janela (Windowed) para ver o benchmark rodando.</li>
            <li>No Afterburner, aumente o <strong>Core Clock (MHz)</strong> em +50. Clique no botão "Check" (Aplicar).</li>
            <li>Observe o benchmark por 1 minuto. Travou? Apareceram artefatos (riscos coloridos)?</li>
            <li>Se não travou, aumente mais +25 (Total +75). Aplique.</li>
            <li>Repita até o driver de vídeo reiniciar ou o jogo fechar.</li>
            <li>Quando travar (ex: em +180), volte 20 MHz (ex: para +160). <strong>Esse é seu clock estável.</strong></li>
        </ol>
      `
        },
        {
            title: "Passo 4: Aumentando o Memory Clock (VRAM)",
            content: `
        <p class="mb-4 text-gray-300">
            A memória GDDR6 aguenta muito overclock.
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
            <li>Comece com <strong>+200 MHz</strong>. Aplique.</li>
            <li>Suba de 100 em 100. Muitas placas aguentam +800 ou até +1000 MHz.</li>
            <li><strong>Sinal de falha na memória:</strong> Pontos brancos/roxos piscando na tela ou texturas esticadas. Se vir isso, reduza imediatamente.</li>
            <li><strong>Atenção:</strong> Memórias possuem ECC (Correção de Erro). Às vezes você coloca +1500 MHz e o PC não trava, mas a performance <em>cai</em> porque a memória está gastando tempo corrigindo erros. Sempre compare a pontuação do benchmark!</li>
        </ul>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Undervolting: O Overclock Inteligente",
            content: `
            <div class="bg-gray-800/50 p-6 rounded-xl border border-gray-700 mb-8">
                <h4 class="text-green-400 font-bold mb-4 text-xl">Menos Calor = Mais Performance</h4>
                <p class="text-gray-300 mb-4">
                    As placas modernas batem no limite de temperatura rápido. O Undervolt consiste em manter o mesmo clock alto, mas usando menos voltagem. Isso faz a placa esfriar 5°C a 10°C, permitindo que ela mantenha o Boost Clock por mais tempo sem baixar a frequência.
                </p>
            </div>

            <p class="text-gray-300 mb-4 text-sm">
                No Afterburner, aperte <code>Ctrl + F</code> para abrir a Curva de Voltagem. O objetivo é transformar a curva em uma linha reta na frequência desejada com a menor voltagem possível (ex: 1950MHz @ 0.900V em vez de 1950MHz @ 1.050V).
            </p>
            `
        }
    ];

    const additionalContentSections = [
        {
            title: "Resultados Esperados (Exemplo RTX 3060)",
            content: `
            <div class="overflow-x-auto">
                <table class="w-full text-sm text-gray-300 border-collapse">
                    <thead>
                        <tr class="bg-white/5 border-b border-white/10">
                            <th class="px-4 py-3 text-left text-white font-bold">Estado</th>
                            <th class="px-4 py-3 text-left text-white font-bold">Core / Mem</th>
                            <th class="px-4 py-3 text-left text-white font-bold">Temperatura</th>
                            <th class="px-4 py-3 text-left text-white font-bold">FPS (Cyberpunk)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="border-b border-white/5 hover:bg-white/5">
                            <td class="px-4 py-3">Stock (Fábrica)</td>
                            <td class="px-4 py-3">1837 / 7500</td>
                            <td class="px-4 py-3">72°C</td>
                            <td class="px-4 py-3">58 FPS</td>
                        </tr>
                        <tr class="border-b border-white/5 hover:bg-white/5">
                            <td class="px-4 py-3">Overclock (+150/+1000)</td>
                            <td class="px-4 py-3">1987 / 8500</td>
                            <td class="px-4 py-3">76°C</td>
                            <td class="px-4 py-3 text-green-400 font-bold">66 FPS (+13%)</td>
                        </tr>
                         <tr class="hover:bg-white/5">
                            <td class="px-4 py-3">Undervolt (0.9V)</td>
                            <td class="px-4 py-3">1950 / 8500</td>
                            <td class="px-4 py-3 text-blue-400 font-bold">64°C (-8°C)</td>
                            <td class="px-4 py-3">65 FPS</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            `
        }
    ];

    const faqItems = [
        {
            question: "Overclock anula a garantia?",
            answer: "Tecnicamente, sim. Na prática, é quase impossível para a fabricante provar que você usou software de overclock, a menos que você modifique a BIOS da placa (flash). Overclock via software (Afterburner) é considerado seguro pela maioria dos entusiastas."
        },
        {
            question: "Posso fazer overclock em Notebook?",
            answer: "Pode, mas <strong>o ganho é limitado pelo calor</strong>. Em notebooks, recomendamos UnderVolt. Se você aumentar o clock, o notebook vai bater 90°C mais rápido e reduzir a velocidade (Thermal Throttling), resultando em pior performance."
        },
        {
            question: "O PC reiniciou durante o teste, queimei algo?",
            answer: "Não. Isso é apenas o driver de vídeo protegendo o hardware. Se o PC travar, apenas reinicie. O Afterburner (se configurado corretamente) não vai aplicar o overclock instável na inicialização se você não marcou o botão 'Startup' (Ícone do Windows)."
        }
    ];

    const externalReferences = [
        { name: "Guru3D - MSI Afterburner Download", url: "https://www.guru3d.com/files-details/msi-afterburner-beta-download.html" },
        { name: "Unigine Heaven Benchmark", url: "https://benchmark.unigine.com/heaven" }
    ];

    const relatedGuides = [
        {
            href: "/guias/monitorar-temperatura-pc",
            title: "Monitorar Temperatura",
            description: "Como usar o RivaTuner para ver stats na tela."
        },
        {
            href: "/guias/upgrade-pc-antigo-vale-a-pena",
            title: "Gargalo de CPU",
            description: "Adianta fazer OC na GPU se seu processador é fraco?"
        },
        {
            href: "/guias/undervolt-cpu-notebook",
            title: "Undervolt de CPU",
            description: "O par perfeito para o Overclock de GPU."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="60 min"
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
