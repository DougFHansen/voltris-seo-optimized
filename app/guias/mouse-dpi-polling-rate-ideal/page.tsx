import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'mouse-dpi-polling-rate-ideal',
    title: "Mouse Guide 2026: A Ciência da Mira Perfeita (DPI, Polling Rate e Sensores)",
    description: "Entenda tecnicamente o que é eDPI, Pixel Skipping, Jitter de sensor e Polling Rate de 8000Hz. Guia completo para eliminar aceleração e configurar seu mouse para eSports.",
    category: 'perifericos',
    difficulty: 'Intermediário',
    time: '25 min'
};

const title = "Engenharia de Mouses: DPI, Hz e a Busca pela Mira Perfeita (2026)";
const description = "Você sabia que 400 DPI tem tecnicamente mais input lag que 1600 DPI? Neste guia, vamos desmistificar lendas antigas do CS 1.6 e aplicar a ciência moderna de sensores para ajustar sua mira.";

const keywords = [
    'melhor dpi mouse fps competitivo',
    '800 dpi vs 1600 dpi latency test',
    'polling rate 4000hz 8000hz vale a pena',
    'mouse acceleration curve windows 11 disable',
    'raw input buffer valorant on or off',
    'como limpar sensor mouse optico',
    'glass skate vs ptfe feet',
    'lift off distance lod ideal',
    'edpi calculator valorant cs2'
];

export const metadata: Metadata = createGuideMetadata('mouse-dpi-polling-rate-ideal', title, description, keywords);

export default function MouseGuide() {
    const aiSummary = "Para mouse competitivo, use DPI 1600 (tem menos latência que 400). Windows sensibilidade 6/11 (neutro). Polling Rate 1000Hz (padrão) ou 4000Hz/8000Hz se suportar. Desative aceleração no Windows e no jogo. Angle Snapping OFF. LOD (Lift-Off Distance) baixo. Limpe sensor regularmente.";

    const summaryTable = [
        { label: "DPI Ideal", value: "1600 (Baixa Latência)" },
        { label: "Polling Rate", value: "1000Hz (Seguro) / 4000Hz (High-End)" },
        { label: "Windows Sens", value: "6/11 (Neutro)" },
        { label: "Aceleração", value: "Desativada (Sempre)" },
        { label: "LOD (Lift-Off)", value: "Baixo (Low)" },
        { label: "Raw Input", value: "Ligado no Jogo" },
        { label: "Angle Snapping", value: "Desligado" }
    ];

    const contentSections = [
        {
            title: "O Mito dos 400 DPI vs a Realidade de 1600 DPI: Latência de Input",
            content: `
        <p class="mb-6 text-gray-700 leading-relaxed text-lg">
          Por anos, jogadores copiaram os profissionais que usavam 400 DPI. A verdade é que muitos profissionais usam 400 DPI por <strong>hábito</strong>, não porque é melhor. Testes com LDAT (Latency Display Analysis Tool) provaram que DPIs mais altos têm menor latência de entrada.
        </p>
        <p class="mb-6 text-gray-700 leading-relaxed">
          Explicando: Em 400 DPI, o sensor divide seu movimento em 400 "passos" por polegada. Em 1600 DPI, são 1600 passos. Se você começa a mover o mouse devagar, o sensor de 1600 DPI detecta o movimento inicial <strong>antes</strong> do de 400 DPI, enviando o sinal ao PC milissegundos mais rápido.
        </p>

      `
        },
        {
            title: "Passo 1: Como desativar aceleração do mouse no Windows 11",
            summary: "Windows tem configuração padrão para escritório que acelera cursor, destruindo memória muscular em jogos. Velocidade do Ponteiro deve estar exatamente no 6º pino (Meio) - multiplicador 1.0. Aprimorar precisão do ponteiro deve estar DESMARCADO (é a aceleração). Sempre use 6/11.",
            content: `
        <p class="mb-4 text-gray-700">
            A configuração padrão do Windows é feita para escritório, não para jogos. Ela tenta "ajudar" você acelerando o cursor. Em jogos, isso destrói sua memória muscular.
        </p>
        <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5 font-mono text-sm space-y-2">
            <p class="text-gray-900 font-bold">Configuração Obrigatória:</p>
            <ol class="list-decimal list-inside text-gray-700">
                <li>Painel de Controle > Mouse > Opções do Ponteiro.</li>
                <li><strong>Velocidade do Ponteiro:</strong> Exatamente no 6º pino (Meio).<br/>
                    <span class="text-xs text-gray-500 ml-4">Isso é o multiplicador 1.0. Se colocar no 7, o Windows começa a pular pixels e interpolar. No 5, ele joga dados fora. Sempre use 6/11.</span>
                </li>
                <li><strong>Aprimorar precisão do ponteiro:</strong> <span class="text-red-400 font-bold">DESMARCADO</span>.<br/>
                    <span class="text-xs text-gray-500 ml-4">Isso é a aceleração. Se ligado, a distância que a mira anda depende da velocidade da sua mão, não da distância física no mousepad. Impossível ter consistência assim.</span>
                </li>
            </ol>
        </div>
      `
        },
        {
            title: "Passo 2: Como configurar Polling Rate do mouse para menor latência",
            summary: "Polling rate é quantas vezes por segundo mouse diz ao PC onde está. 125Hz = 8ms (lixo escritório). 1000Hz = 1ms (padrão ouro). 4000Hz = 0.25ms (bom, requer CPU forte). 8000Hz = 0.125ms (exagero, geralmente trava jogos). Comece com 1000Hz. 4000Hz/8000Hz consome muitos recursos de interrupção da CPU.",
            content: `
        <p class="mb-4 text-gray-700">
            Polling rate é quantas vezes por segundo o mouse diz ao PC: "Estou aqui".
        </p>
        <div class="overflow-x-auto">
            <table class="w-full text-sm text-center text-gray-700 border border-white/10 rounded-lg">
                <thead class="bg-white/5">
                    <tr>
                        <th class="p-3">Hz</th>
                        <th class="p-3">Intervalo (Delay)</th>
                        <th class="p-3">Uso de CPU</th>
                        <th class="p-3">Veredito</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="border-t border-white/5">
                        <td class="p-3">125Hz</td>
                        <td class="p-3">8ms</td>
                        <td class="p-3">Baixo</td>
                        <td class="p-3 text-red-500">Lixo (Escritório)</td>
                    </tr>
                    <tr class="border-t border-white/5 bg-white/5">
                        <td class="p-3 text-[#31A8FF] font-bold">1000Hz</td>
                        <td class="p-3">1ms</td>
                        <td class="p-3">Normal</td>
                        <td class="p-3 text-emerald-400">Padrão Ouro</td>
                    </tr>
                    <tr class="border-t border-white/5">
                        <td class="p-3">4000Hz</td>
                        <td class="p-3">0.25ms</td>
                        <td class="p-3">Alto</td>
                        <td class="p-3 text-yellow-400">Bom (Requer CPU forte)</td>
                    </tr>
                    <tr class="border-t border-white/5">
                        <td class="p-3">8000Hz</td>
                        <td class="p-3">0.125ms</td>
                        <td class="p-3">Extremo</td>
                        <td class="p-3 text-gray-700">Exagero (Geralmente trava jogos)</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <p class="mt-4 text-gray-700 text-sm">
            <strong>Atenção:</strong> Usar 4000Hz ou 8000Hz consome MUITOS recursos de interrupção da CPU. Se você não tem um i7/Ryzen 7 de última geração, usar 4000Hz pode DIMINUIR seu FPS. Comece com 1000Hz.
        </p>
      `
        },
        {
            title: "Passo 3: Pixel Skipping e eDPI",
            summary: "Se DPI muito baixo e sensibilidade muito alta, jogo multiplica cada ponto lido pelo mouse, causando Pixel Skipping. Cenário ruim: 400 DPI com sensibilidade 3.0 (perde capacidade de mirar em pixels intermediários). Cenário bom: 1600 DPI com sensibilidade 0.75 (mesmo eDPI 1200, mas granularidade 4x maior, movimento suave).",
            content: `
        <p class="mb-4 text-gray-700">
            Imagine que seu monitor é uma grade de pixels. Se o DPI do mouse for muito baixo e a sensibilidade no jogo muito alta, o software do jogo precisa "multiplicar" cada ponto lido pelo mouse.
        </p>
        <p class="mb-4 text-gray-700 bg-red-900/20 p-3 rounded border border-red-500/20">
            <strong>Cenário Ruim:</strong> 400 DPI com Sensibilidade 3.0 no CS2.<br/>
            Para cada 1 ponto que o mouse move, a mira anda 3 pixels na tela. Você perdeu a capacidade de mirar nos 2 pixels intermediários. Isso é Pixel Skipping.
        </p>
        <p class="text-gray-700 bg-emerald-900/20 p-3 rounded border border-emerald-500/20">
            <strong>Cenário Bom:</strong> 1600 DPI com Sensibilidade 0.75 no CS2.<br/>
            A velocidade da mira (eDPI) é a mesma (1200 total), mas a granularidade é 4x maior. O movimento é suave e você pode mirar em qualquer pixel.
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Configurações de Sensor: LOD, Ripple e Angle Snapping",
            summary: "LOD (Lift-Off Distance): altura onde mouse para de rastrear ao levantar. Recomendação o mais BAIXO possível (se alto, mira treme ao reposicionar). Angle Snapping: sensor corrige linha reta artificialmente - DESLIGADO (impede micro-ajustes diagonais). Ripple Control/Smoothing: suaviza movimentos em DPIs altos adicionando latência - Desligado (quer input bruto).",
            content: `
            <div class="bg-gray-800/50 p-6 rounded-xl border border-gray-700 mb-8">
                <h class="text-gray-900 font-bold mb-4 text-xl">Opções avançadas do software do Mouse</h4>
                <p class="text-gray-700 mb-6">
                    Mouses da Logitech (G Hub), Razer (Synapse) e Zowie possuem configurações internas de sensor. Entenda o que cada uma faz:
                </p>

                <div class="space-y-4">
                    <div>
                        <h5 class="text-[#31A8FF] font-bold">LOD (Lift-Off Distance)</h5>
                        <p class="text-gray-700 text-sm">
                            Define a que altura o mouse para de rastrear quando você levanta ele do pad.
                            <br/><strong>Recomendação:</strong> O mais <strong>BAIXO</strong> possível. Se deixar alto, a mira treme quando você reposiciona o mouse (remada). Sensível a sujeira no pad.
                        </p>
                    </div>
                     <div>
                        <h5 class="text-[#31A8FF] font-bold">Angle Snapping (Previsão de Movimento)</h5>
                        <p class="text-gray-700 text-sm">
                            O sensor tenta "corrigir" sua linha reta humana imperfeita, transformando-a numa linha reta artificial.
                            <br/><strong>Recomendação:</strong> <span class="text-red-400 font-bold">DESLIGADO</span>. Isso impede micro-ajustes diagonais necessários para corrigir recuo. Nunca use isso em FPS.
                        </p>
                    </div>
                     <div>
                        <h5 class="text-[#31A8FF] font-bold">Ripple Control / Smoothing</h5>
                        <p class="text-gray-700 text-sm">
                            Suaviza movimentos tremidos em DPIs altos (>2000). Adiciona latência.
                            <br/><strong>Recomendação:</strong> Desligado. Queremos o input bruto (Raw), mesmo que seja levemente tremido.
                        </p>
                    </div>
                </div>
            </div>
            `
        },
        {
            title: "Raw Input Buffer: A Tecnologia Nova",
            content: `
            <p class="mb-4 text-gray-700">
                Jogos novos como Valorant adicionaram uma opção chamada <strong>"Raw Input Buffer"</strong>.
            </p>
            <p class="text-gray-700">
                Isso é essencial se você usa mouses de 4000Hz ou 8000Hz. Sem essa opção ligada, a engine do jogo pode se sobrecarregar processando 8000 updates por segundo na thread principal, causando queda de FPS. O Buffer processa o input em outra thread.
                <br/><strong>Se você usa 1000Hz:</strong> Faz pouca diferença, mas pode deixar ligado.
            </p>
            `
        }
    ];

    const additionalContentSections = [
        {
            title: "Superfície: Mousepad Glass vs Pano",
            content: `
            <p class="mb-4 text-gray-700">
                A superfície afeta como o sensor lê.
                <br/><strong>Pano (Cloth):</strong> Padrão. Seguro. Oferece atrito para parar a mira (Stopping Power). Ótimo para TacFPS (Val/CS).
                <br/><strong>Vidro (Glass/SkyPAD):</strong> Atrito zero. O mouse voa. Ótimo para Tracking (Apex/Overwatch), mas difícil de controlar para cliques precisos.
            </p>
            <p class="text-gray-700 text-sm italic">
                Cuidado: Mousepads de vidro comem os pés (skates) do mouse rapidamente e qualquer grão de poeira faz barulho de arranhão.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Mouse Wireless é mais lento?",
            answer: "Não mais. Tecnologias como Logitech Lightspeed e Razer HyperSpeed têm latência igual ou menor que fio (devido à otimização da porta USB). Porém, evite Bluetooth a todo custo; Bluetooth tem delay variável horrível. Use sempre o dongle USB 2.4GHz incluso."
        },
        {
            question: "Trocar os pés (skates) do mouse melhora a mira?",
            answer: "Melhora o conforto. Pés de PTFE 100% virgem (brancos) deslizam mais suave que os pretos de teflon padrão. Isso torna o micro-ajuste mais fácil, pois vence o atrito estático inicial."
        },
        {
            question: "O que é Jitter?",
            answer: "É quando o cursor treme sozinho ou faz movimentos erráticos. Geralmente causado por poeira na lente do sensor ou DPI alto demais (10.000+) em superfícies irregulares."
        }
    ];

    const externalReferences = [
        { name: "Mouse Sensitivity Converter (Aiming.pro)", url: "https://aiming.pro/mouse-sensitivity-calculator" },
        { name: "Rtings Mouse Reviews (Latência)", url: "https://www.rtings.com/mouse" },
        { name: "Sensor Specs (Pixart)", url: "https://www.pixart.com/" }
    ];

    const relatedGuides = [
        {
            href: "/guias/monitor-hz-configuracao-correta",
            title: "Guia de Monitor",
            description: "High Refresh Rate é par obrigatório de um bom mouse."
        },
        {
            href: "/guias/nvidia-painel-controle-melhores-configuracoes",
            title: "Low Latency Mode",
            description: "Garanta que o PC processe o clique do mouse rápido."
        },
        {
            href: "/guias/valorant-reduzir-input-lag",
            title: "Valorant Input Lag",
            description: "Guia específico para otimizar a mira no Valorant."
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
            pathname="/guias/mouse-dpi-polling-rate-ideal"
            aiSummary={aiSummary}
        />
    );
}
