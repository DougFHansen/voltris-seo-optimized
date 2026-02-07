import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'bluestacks-otimizacao-free-fire-pubg',
    title: "Free Fire e PUBG Mobile: A Configuração Perfeita no BlueStacks (2026)",
    description: "Quer subir capa fácil? Aprenda a configurar a Sensibilidade Y, Smart Controls e 90 FPS cravados para dominar o lobby no emulador.",
    category: 'jogos',
    difficulty: 'Intermediário',
    time: '25 min'
};

const title = "Free Fire e PUBG: Otimização Competitiva (2026)";
const description = "Jogar no emulador dá vantagem, mas só se estiver configurado certo. Se a mira treme ou o jogo trava na 'bolha', você vai perder. Este é o guia de pro player.";

const keywords = [
    'sensibilidade y free fire emulador bluestacks 5',
    'pubg mobile 90 fps emulador config',
    'smart controls falhando bluestacks',
    'melhor dpi mouse para free fire emulador',
    'como esticar a tela free fire emulador (stretch res)',
    'hud personalizado emulador layout'
];

export const metadata: Metadata = createGuideMetadata('bluestacks-otimizacao-free-fire-pubg', title, description, keywords);

export default function GameConfigGuide() {
    const summaryTable = [
        { label: "Jogo", value: "Free Fire / PUBG Mobile" },
        { label: "FPS Alvo", value: "90 (Suave)" },
        { label: "Gráficos", value: "Suave (Smooth) / Alto FPS" },
        { label: "Sensibilidade Y", value: "Maior que X (Capa fácil)" },
        { label: "DPI Mouse", value: "800 ou 1000 (Padrão Pro)" },
        { label: "Modo", value: "Shooting Mode (F1)" }
    ];

    const contentSections = [
        {
            title: "Configuração Interna do Jogo (O Segredo)",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Não adianta ter um PC da NASA e colocar o gráfico no Ultra. Jogadores profissionais usam tudo no <strong>Mínimo (Suave)</strong> para ver os inimigos melhor (sem sombras e mato) e ter o FPS máximo.
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div class="bg-orange-900/10 p-4 rounded-lg border border-orange-500/20">
                <h4 class="text-orange-400 font-bold mb-2">Free Fire Max</h4>
                <ul class="list-disc ml-4 text-sm text-gray-300">
                    <li><strong>Gráficos:</strong> Suave.</li>
                    <li><strong>Alto FPS:</strong> ALTO (Isso libera 60/90fps).</li>
                    <li><strong>Sombra:</strong> Desligado.</li>
                    <li><strong>Minimapa:</strong> Rotacionando.</li>
                </ul>
            </div>
            <div class="bg-yellow-900/10 p-4 rounded-lg border border-yellow-500/20">
                <h4 class="text-yellow-400 font-bold mb-2">PUBG Mobile</h4>
                <ul class="list-disc ml-4 text-sm text-gray-300">
                    <li><strong>Gráficos:</strong> Suave (Smooth).</li>
                    <li><strong>Taxa de Quadros:</strong> 90 fps (Se disponível) ou Extremo.</li>
                    <li><strong>Estilo:</strong> Colorido (Ajuda a ver inimigos na grama).</li>
                    <li><strong>Anti-aliasing:</strong> Desligado.</li>
                </ul>
            </div>
        </div>
      `
        },
        {
            title: "Mecânica de Mira: Sensibilidade X e Y",
            content: `
        <p class="mb-4 text-gray-300">
          No BlueStacks, abra o Editor de Controles (Teclado lateral) > Clique com botão direito no ícone de "Mira" (F1).
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-3 bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
            <li><strong>Sensibilidade X (Horizontal):</strong> Deixe entre 1.0 e 1.5. Você quer girar rápido, mas com controle.</li>
            <li><strong>Sensibilidade Y (Vertical):</strong> Aqui está o segredo do "Capa". Deixe entre <strong>1.8 e 2.5</strong>.
                <br/><span class="text-xs text-green-400 ml-6">Por que? O movimento de subir a mira para a cabeça exige menos movimento físico do mouse, fazendo a mira "grudar" na cabeça mais fácil.</span></li>
            <li><strong>Ajustes (Tweaks):</strong> Use <code>16450</code> ou <code>21058</code> (valores hexadecimais de ajuste de mouse do BlueStacks que reduzem a aceleração e bugs de giro 360).</li>
        </ul>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Tela Esticada (Stretch Resolution)",
            content: `
        <h4 class="text-white font-bold mb-3">Hitbox Maior = Mais Kills</h4>
        <p class="mb-4 text-gray-300">
            Muitos pros usam resoluções quadradas (ex: 1280x1024) esticadas para preencher o monitor 16:9.
            <br/>Isso faz os personagens parecerem "mais gordos", facilitando acertar tiros.
            <br/><strong>Como fazer:</strong>
            <br/>1. No Painel da NVIDIA/AMD, crie uma resolução personalizada (Ex: 1440x1080).
            <br/>2. No BlueStacks > Visualização > Resolução Personalizada > 1440x1080.
            <br/>3. O jogo vai ficar estranho no menu, mas no jogo é vantagem pura.
        </p>
      `
        },
        {
            title: "Smart Controls (Controles Inteligentes)",
            content: `
        <p class="mb-4 text-gray-400">
            O BlueStacks usa IA para saber se você está no mapa, no loot ou atirando.
            <br/>Às vezes buga após um update do jogo.
            <br/><strong>Solução:</strong> Se a tecla de gelo ou loot parar de funcionar, abra o editor de controles > "Atualizar Controles" (ícone de nuvem). A equipe do BS atualiza os perfis em horas após um update do Garena.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Dicas de DPI do Mouse",
            content: `
        <h4 class="text-white font-bold mb-3">800 vs 1600 DPI</h4>
        <p class="mb-4 text-gray-300">
            Emuladores sofrem com "Pixel Skipping" se o DPI for muito baixo com sensibilidade alta no jogo.
            <br/>Recomendação: Use <strong>1000 DPI</strong> no mouse e ajuste a sensibilidade dentro do emulador para ficar confortável. Evite DPIs extremos (400 ou 4000).
        </p>
      `
        }
    ];

    const faqItems = [
        {
            question: "O jogo fechou sozinho (Crash).",
            answer: "Geralmente é falta de RAM alocada. Aloque 4GB no emulador. Se continuar, mude o renderizador gráfico de OpenGL para DirectX ou vice-versa."
        },
        {
            question: "Banimento por 'Uso de Software de Terceiros'?",
            answer: "Nunca use macros de 'No Recoil' ou scripts que alteram arquivos do jogo. O BlueStacks em si é permitido, mas scripts de trapaça dão ban. Use apenas as funções nativas de mapeamento de teclas."
        },
        {
            question: "Qual tecla usar para Suspensão (Liberar Mouse)?",
            answer: "A maioria usa a tecla <strong>X</strong>, <strong>F1</strong> ou <strong>Ctrl</strong>. Escolha uma que não atrapalhe sua movimentação (WASD). Suspenda o mouse a cada 5 segundos para resetar o sensor e evitar o bug do analógico travar."
        }
    ];

    const externalReferences = [
        { name: "BlueStacks X e Y Config", url: "https://support.bluestacks.com/hc/en-us/articles/360058920952-How-to-adjust-mouse-sensitivity-on-BlueStacks-5" },
        { name: "Mouse DPI Analyzer", url: "https://www.mouse-sensitivity.com/dpianalyzer/" }
    ];

    const relatedGuides = [
        {
            href: "/guias/bluestacks-ldplayer-otimizacao-free-fire-120fps",
            title: "Otimizar BlueStacks",
            description: "Comece por aqui se estiver travando."
        },
        {
            href: "/guias/reduzir-input-lag-teclado-mouse",
            title: "Input Lag",
            description: "Reduza o atraso do clique."
        },
        {
            href: "/guias/network-throttling-index-ping-jogos",
            title: "Ping Baixo",
            description: "Como melhorar a conexão."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="25 min"
            difficultyLevel="Intermediário"
            author="Voltris Pro Gamers"
            lastUpdated="2026-02-06"
            contentSections={contentSections}
            advancedContentSections={advancedContentSections}
            additionalContentSections={additionalContentSections}
            summaryTable={summaryTable}
            faqItems={faqItems}
            externalReferences={externalReferences}
            relatedGuides={relatedGuides}
        />
    );
}
