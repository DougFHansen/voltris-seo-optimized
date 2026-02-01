import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Como Limitar FPS Corretamente: RivaTuner (RTSS) vs Painel NVIDIA vs Jogo (2026)";
const description = "Limitar o FPS reduz o calor, economiza energia e deixa o Frametime liso. Descubra qual método tem o menor Input Lag: In-Game ou RivaTuner?";
const keywords = ['limitar fps rivatuner', 'rtss tutorial', 'painel nvidia limitar fps', 'input lag cap fps', 'frametime liso', 'travar fps jogos'];

export const metadata: Metadata = createGuideMetadata('limitar-fps-rivatuner-nvidia', title, description, keywords);

export default function FPSLimitGuide() {
    const summaryTable = [
        { label: "Melhor Método", value: "In-Game (Se tiver)" },
        { label: "2º Melhor", value: "RivaTuner (RTSS)" },
        { label: "Pior Método", value: "V-Sync" },
        { label: "Painel NVIDIA", value: "Apenas G-Sync" }
    ];

    const contentSections = [
        {
            title: "Introdução: Por que limitar o FPS?",
            content: `
        <p class="mb-4 text-gray-300 leading-relaxed">
            Muitos acham que "quanto mais FPS melhor", mas isso tem um custo. Se seu PC roda a 200 FPS mas seu monitor é 60Hz, você está desperdiçando energia e esquentando a GPU à toa. Além disso, oscilações (jogar a 150, cair pra 80, voltar pra 150) causam sensação de travamento.
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed font-bold">
            Frametime constante é melhor que FPS alto inconstante.
        </p>
      `,
            subsections: []
        },
        {
            title: "Ranking de Input Lag (Do Menor para o Maior)",
            content: `
        <ul class="space-y-4 list-none text-gray-300">
            <li class="bg-gray-800 p-4 rounded border-l-4 border-green-500">
                <strong class="text-white block text-lg">1. Limitador In-Game (Dentro do Jogo)</strong>
                Sempre use o limitador do próprio jogo se ele existir (Valorant, Overwatch, Fortnite). A engine do jogo sabe exatamente quando pausar o render, gerando quase zero de input lag adicional.
            </li>
            <li class="bg-gray-800 p-4 rounded border-l-4 border-blue-500">
                <strong class="text-white block text-lg">2. RivaTuner Statistics Server (RTSS)</strong>
                É o padrão ouro. O RTSS limita o FPS na CPU, criando uma linha de frametime perfeitamente reta ("Flat Line"). O input lag é mínimo (cerca de 1 frame de delay), mas a fluidez visual é imbatível. Perfeito para jogos Single Player (Elden Ring, Cyberpunk).
            </li>
            <li class="bg-gray-800 p-4 rounded border-l-4 border-yellow-500">
                <strong class="text-white block text-lg">3. Painel de Controle NVIDIA/AMD</strong>
                Funciona bem, mas em testes técnicos mostrou ter 1 ou 2ms a mais de latência que o RTSS. Use se não quiser instalar programas extras.
            </li>
            <li class="bg-gray-800 p-4 rounded border-l-4 border-red-500">
                <strong class="text-white block text-lg">4. V-Sync (Sincronização Vertical)</strong>
                NUNCA USE EM JOGOS COMPETITIVOS. O V-Sync segura o frame até o monitor estar pronto, criando um input lag massivo de 30ms a 50ms. Só use em jogos de história onde a tela está "rasgando" (Tearing) muito.
            </li>
        </ul>
      `,
            subsections: []
        },
        {
            title: "Tutorial: Configurando o RivaTuner (RTSS)",
            content: `
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4">
            <li>Baixe e instale o <strong>MSI Afterburner</strong> (O RTSS vem junto).</li>
            <li>Abra o RTSS (Ícone de tela azul na bandeja).</li>
            <li>Clique no botão <strong>Add</strong> para adicionar o executável do jogo específico, ou use <strong>Global</strong> para todos.</li>
            <li>Procure por <strong>Framerate Limit</strong>.</li>
            <li>Digite o valor desejado (Ex: 60, 144).
                <br/><span class="text-green-400 text-sm">Dica G-Sync: Se seu monitor é 144Hz e tem G-Sync/FreeSync, limite em <strong>141 FPS</strong>. Isso garante que o G-Sync fique sempre ativo e nunca bata no teto do V-Sync.</span>
            </li>
        </ol>
      `
        },
        {
            title: "Scanline Sync (A Mágica do RTSS)",
            content: `
            <p class="text-gray-300 mb-4">
                O RTSS tem uma função experimental chamada <strong>Scanline Sync</strong>. Ela tenta esconder a linha de rasgo (Tearing) fora da tela sem usar V-Sync.
            </p>
            <p class="text-gray-300">
                Para usar, seu uso de GPU deve estar abaixo de 70%. Defina o valor (ex: -30) e veja se o rasgo some. É difícil configurar, mas é o santo graal da fluidez sem lag.
            </p>
        `
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="10 min"
            difficultyLevel="Intermediário"
            contentSections={contentSections}
            summaryTable={summaryTable}
        />
    );
}
