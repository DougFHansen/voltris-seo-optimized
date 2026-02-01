import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "CS2: O Guia Definitivo de FPS, Launch Options e Visibilidade (2026)";
const description = "Descubra as Launch Options que realmente funcionam no Source 2, os comandos de console para conexões estáveis e como configurar o vídeo para ver inimigos no escuro.";
const keywords = ['cs2 comandos fps', 'launch options cs2 2026', 'cl_interp cs2', 'aumentar fps cs2 console', 'cs2 lag fix', 'comandos visibilidade cs2', 'subtick cs2 explicado', 'telemetria cs2'];

export const metadata: Metadata = createGuideMetadata('cs2-melhores-comandos-console-fps', title, description, keywords);

export default function CS2Guide() {
    const contentSections = [
        {
            title: "Introdução: A Nova Era do Source 2",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
          O Counter-Strike 2 trouxe uma nova engine gráfica (Source 2) e um novo sistema de servidores (Sub-Tick). Isso significa que 90% dos tutoriais antigos de CS:GO não funcionam mais e podem até <strong>piorar</strong> seu desempenho.
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed">
          Neste guia, filtramos apenas o que foi testado e comprovado em 2026. Vamos limpar suas launch options antigas, configurar o jogo para visibilidade máxima e estabilizar seu Frametime para que o jogo pareça manteiga.
        </p>
      `,
            subsections: []
        },
        {
            title: "1. A Verdade sobre as Opções de Inicialização (Launch Options)",
            content: `
        <p class="mb-6 text-gray-300">
            A primeira regra do CS2 é: <strong>Menos é Mais</strong>. O Source 2 é muito bom em se autoconfigurar. Usar comandos antigos como <code>-d3d9ex</code> ou <code>-threads</code> pode causar crashes. Use apenas o estritamente necessário.
        </p>
        
        <div class="bg-[#121218] border border-gray-700 p-6 rounded-xl mb-6">
            <h4 class="text-white font-bold mb-4">A Lauch Option Recomendada (Safe):</h4>
            <code class="block text-green-400 font-mono text-lg select-all mb-4">-high -freq 144 -novid -nojoy</code>
            
            <h4 class="text-white font-bold mt-6 mb-2">Explicação Técnica:</h4>
            <ul class="list-disc list-inside text-gray-400 space-y-2">
                <li><strong>-high:</strong> Tenta forçar o Windows a não interromper o CS2 com tarefas de fundo. (Se seu PC travar ao dar Alt-Tab, remova este comando).</li>
                <li><strong>-freq X:</strong> Garante que o jogo inicie na frequência máxima do monitor (Mude 144 para seu valor: 60, 75, 165, 240).</li>
                <li><strong>-novid:</strong> Remove a abertura chata da Valve, salvando 5 segundos.</li>
                <li><strong>-nojoy:</strong> Desativa o sistema de joystick, liberando uma pequena quantidade de RAM e ciclos de CPU.</li>
            </ul>
        </div>
        
        <div class="bg-red-900/20 border-l-4 border-red-500 p-4 mb-6">
            <strong class="text-red-400 block mb-1">CUIDADO: MITOS</strong>
            <p class="text-gray-300 text-sm">NÃO use <code>+cl_forcepreload 1</code> (causa stutters no CS2), NÃO use <code>-threads</code> (deixe o jogo gerenciar os núcleos), e NÃO use <code>-high</code> se você faz live no mesmo PC (pode travar o OBS).</p>
        </div>
      `,
            subsections: []
        },
        {
            title: "2. Comandos de Console Indispensáveis",
            content: `
        <p class="mb-4 text-gray-300">Ative o console nas opções do jogo e digite estes comandos para ajustar o comportamento da engine.</p>
        
        <h3 class="text-xl text-[#31A8FF] font-bold mt-6 mb-4">2.1 FPS e Monitoramento</h3>
        <ul class="list-none space-y-4 mb-6">
             <li class="bg-gray-800/50 p-4 rounded">
                <code class="text-green-400 font-bold block">fps_max 0</code>
                <span class="text-gray-400 text-sm">Remove qualquer limite artificial de FPS. Essencial para latência mínima. Se seu PC esquentar demais, limite em 300 ou 400.</span>
            </li>
            <li class="bg-gray-800/50 p-4 rounded">
                <code class="text-green-400 font-bold block">cl_showfps 1</code>
                <span class="text-gray-400 text-sm">Mostra o FPS no canto da tela (mais leve que o NetGraph antigo).</span>
            </li>
        </ul>

        <h3 class="text-xl text-[#31A8FF] font-bold mt-6 mb-4">2.2 Rede e Interpolação (Hitreg)</h3>
        <p class="text-gray-300 mb-4">Se você sente que acerta e não mata, ajuste a interpolação.</p>
        <div class="bg-gray-800/50 p-4 rounded border-l-2 border-green-500 mb-4">
            <code class="block text-green-400 font-bold">cl_updaterate 128</code>
            <code class="block text-green-400 font-bold">cl_interp_ratio 1</code>
            <code class="block text-green-400 font-bold">cl_interp 0.015625</code>
            <p class="text-gray-400 text-sm mt-3">Esses comandos garantem que o modelo do boneco que você vê na tela está o mais próximo possível da posição real dele no servidor. Essencial para ping baixo (até 40ms). Se você tem ping alto (80ms+), use <code>cl_interp_ratio 2</code>.</p>
        </div>

        <h3 class="text-xl text-[#31A8FF] font-bold mt-6 mb-4">2.3 Visibilidade (Gamma)</h3>
        <p class="text-gray-300 mb-2">CS2 é um jogo brilhante, mas cantos escuros ainda existem.</p>
        <code class="bg-[#121218] px-3 py-1 rounded text-green-400">r_fullscreen_gamma 2.2</code>
        <p class="text-gray-300 text-sm mt-2">Este é o valor padrão. Baixe para <strong>2.0</strong> ou <strong>1.8</strong> para deixar o jogo mais "lavado" e claro, facilitando ver inimigos na sombra.</p>
      `
        },
        {
            title: "3. Configurações de Vídeo Competitivas",
            content: `
            <p class="text-gray-300 mb-4">Não coloque tudo no Low! Algumas coisas no Low atrapalham sua visão.</p>
            <table class="w-full text-left border-collapse mb-6">
                <thead>
                    <tr class="border-b border-gray-700 text-[#31A8FF]">
                        <th class="p-2">Opção</th>
                        <th class="p-2">Recomendação</th>
                        <th class="p-2">Por quê?</th>
                    </tr>
                </thead>
                <tbody class="text-gray-300 text-sm">
                    <tr class="border-b border-gray-800 bg-gray-900/40">
                        <td class="p-3 font-bold">Sombras Globais</td>
                        <td class="p-3 text-green-400">ALTO (High)</td>
                        <td class="p-3">Essencial para ver a sombra do inimigo antes dele aparecer na esquina. Não use Low!</td>
                    </tr>
                    <tr class="border-b border-gray-800">
                        <td class="p-3 font-bold">Detalhe dos Modelos</td>
                        <td class="p-3 text-yellow-400">Médio/Low</td>
                        <td class="p-3">Não afeta visibilidade, ganho de FPS.</td>
                    </tr>
                    <tr class="border-b border-gray-800 bg-gray-900/40">
                        <td class="p-3 font-bold">Oclusão de Ambiente</td>
                        <td class="p-3 text-green-400">Médio</td>
                        <td class="p-3">Ajuda a dar profundidade e contraste aos bonecos contra a parede.</td>
                    </tr>
                    <tr class="border-b border-gray-800">
                        <td class="p-3 font-bold">NVIDIA Reflex</td>
                        <td class="p-3 text-blue-400 font-bold">On + Boost</td>
                        <td class="p-3">Reduz input lag (obrigatório).</td>
                    </tr>
                    <tr class="border-b border-gray-800 bg-gray-900/40">
                        <td class="p-3 font-bold">HDR</td>
                        <td class="p-3">Desempenho</td>
                        <td class="p-3">Melhor clareza.</td>
                    </tr>
                </tbody>
            </table>
        `
        },
        {
            title: "4. Dica de Áudio Pro: Loudness Equalization",
            content: `
            <p class="mb-4 text-gray-300">O som da AWP é ensurdecedor, mas os passos são baixos? Você pode corrigir isso no Windows.</p>
            <ol class="list-decimal list-inside text-gray-300 space-y-2 ml-4">
                <li>Vá nas configurações de Som do Windows > Painel de Controle de Som.</li>
                <li>Propriedades do seu Fone > Aba <strong>Aperfeiçoamentos</strong> (Enhancements).</li>
                <li>Marque <strong>Loudness Equalization</strong> (Equalização de Intensidade).</li>
                <li>Isso funciona como um compressor: diminui os sons explosivos (tiros) e aumenta os sons baixos (passos). Você vai ouvir tudo.</li>
            </ol>
        `
        },
        {
            title: "Perguntas Frequentes (FAQ)",
            content: `
            <div class="space-y-6 mt-8">
                <div>
                    <h4 class="text-white font-bold text-lg mb-2">Devo usar resolução 4:3 Esticada (Stretched)?</h4>
                    <p class="text-gray-300">É preferência pessoal. A vantagem é que os bonecos ficam "mais gordos", facilitando o tiro. A desvantagem é que, tecnicamente, eles se movem mais rápido na horizontal. A maioria dos pros usa 1280x960 Stretched.</p>
                </div>
                <hr class="border-gray-800" />
                <div>
                    <h4 class="text-white font-bold text-lg mb-2">CS2 roda melhor no Windows 10 ou 11?</h4>
                    <p class="text-gray-300">Atualmente, ambos são iguais. Se você tem processador Intel de 12ª geração ou superior (com E-Cores), o Windows 11 é obrigatório para o agendamento correto de tarefas.</p>
                </div>
            </div>
        `
        }
    ];

    const summaryTable = [
        { label: "Launch Option", value: "-nojoy -high" },
        { label: "Sombra", value: "Alta (High)" },
        { label: "Reflex", value: "On + Boost" },
        { label: "Interp", value: "0.015625" },
        { label: "Gamma", value: "2.0" }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="20 min"
            difficultyLevel="Intermediário"
            contentSections={contentSections}
            summaryTable={summaryTable}
        />
    );
}
