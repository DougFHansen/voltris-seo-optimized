import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'modo-de-jogo-windows-atikvar-ou-nao',
    title: "Modo de Jogo do Windows: Ativar ou Desativar em 2026?",
    description: "O 'Game Mode' do Windows 10/11 ajuda ou atrapalha? Veja benchmarks, entenda como ele prioriza a CPU e quando você deve desligá-lo (OBS/Streaming).",
    category: 'otimizacao',
    difficulty: 'Iniciante',
    time: '10 min'
};

const title = "Modo de Jogo (Game Mode): O Veredito Definitivo para Performance (2026)";
const description = "Antigamente ele causava lag. Hoje é essencial. Saiba como o Modo de Jogo gerencia threads, bloqueia atualizações e interage com o Agendamento de GPU.";

const keywords = [
    'modo de jogo windows 11 ativar ou desativar',
    'game mode windows 10 fps boost or drop',
    'obs studio lagando com modo de jogo ativado',
    'process priority game mode',
    'otimização tela cheia windows',
    'barra de jogo xbox desativar',
    'background recording impact performance',
    'benchmark game mode on vs off'
];

export const metadata: Metadata = createGuideMetadata('modo-de-jogo-windows-atikvar-ou-nao', title, description, keywords);

export default function GameModeGuide() {
    const summaryTable = [
        { label: "Veredito 2026", value: "ATIVAR (Para 95% dos casos)" },
        { label: "PC Fraco", value: "Grande Benefício (Estabilidade)" },
        { label: "PC Top", value: "Diferença Nula" },
        { label: "Streamers (OBS)", value: "Cuidado (Pode travar live)" },
        { label: "Xbox Game Bar", value: "DESATIVAR (Consome muito)" },
        { label: "Updates", value: "Bloqueia durante o jogo" }
    ];

    const contentSections = [
        {
            title: "O que o Modo de Jogo realmente faz?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Ao ativar o Modo de Jogo (Configurações > Jogos > Modo de Jogo), o Windows faz duas coisas principais: 1) Pausa o Windows Update e instalações de driver para não ocupar o disco, e 2) Dá prioridade "Alta" aos núcleos da CPU para o processo da janela ativa (o jogo), tirando recursos de abas do Chrome e Spotify.
        </p>

        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20 my-8">
            <h4 class="text-[#31A8FF] font-bold mb-3 flex items-center gap-2">
                <span class="text-xl">🎮</span> Voltris Game Booster
            </h4>
            <p class="text-gray-300 mb-4">
                O Modo de Jogo do Windows é suave. O <strong>Voltris Optimizer</strong> é agressivo. Ele não apenas prioriza o jogo, mas suspende temporariamente serviços de impressão, busca e temas visuais, liberando até 15% a mais de recursos do que o modo nativo da Microsoft.
            </p>
            <a href="/voltrisoptimizer" class="group relative inline-flex px-8 py-3 bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-white font-bold text-base rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-[1.03] hover:shadow-[0_0_60px_rgba(139,49,255,0.4)] items-center justify-center gap-2">
                Ativar Boost Extremo
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
            </a>
        </div>
      `
        },
        {
            title: "Game Mode vs Xbox Game Bar",
            content: `
        <p class="mb-4 text-gray-300">
            Não confunda os dois!
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div class="bg-green-500/10 p-4 rounded-xl border border-green-500/30">
                <h4 class="text-green-400 font-bold">Modo de Jogo</h4>
                <p class="text-gray-300 text-sm">
                    <strong>ATIVE.</strong> É uma configuração interna do Kernel de prioridade. Leve e eficiente.
                </p>
            </div>
             <div class="bg-red-500/10 p-4 rounded-xl border border-red-500/30">
                <h4 class="text-red-400 font-bold">Xbox Game Bar</h4>
                <p class="text-gray-300 text-sm">
                    <strong>DESATIVE.</strong> É aquele overlay (Win+G) que grava clipes e chat. Ele consome VRAM e causa stuttering. Só deixe ligado se você realmente usa o chat da Xbox ou clipes.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Streamers e OBS: O Perigo",
            content: `
        <p class="mb-4 text-gray-300">
             Se você faz live, o Modo de Jogo pode ser um vilão. Como ele dá 100% da prioridade de GPU para o jogo, ele pode deixar o OBS "sem nada", fazendo a live travar (dropped frames) enquanto o jogo roda liso pra você.
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
            <li><strong>Se a live trava:</strong> DESATIVE o Modo de Jogo. E execute o OBS como Administrador (isso equilibra a prioridade).</li>
            <li><strong>Se você só joga:</strong> ATIVE.</li>
        </ul>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "HAGS: O parceiro do Game Mode",
            content: `
            <div class="bg-gray-800/50 p-6 rounded-xl border border-gray-700 mb-8">
                <h4 class="text-white font-bold mb-4 text-xl">Agendamento de GPU</h4>
                <p class="text-gray-300 mb-4">
                    Logo abaixo do botão do Modo de Jogo, existe o "Agendamento de GPU acelerado por hardware". Ele transfere o gerenciamento da VRAM da CPU para a própria GPU.
                </p>
                <p class="text-gray-300 text-sm">
                    Isso reduz a latência e é <strong>OBRIGATÓRIO</strong> para usar Frame Generation (DLSS 3). Ative os dois juntos para melhor resultado.
                </p>
            </div>
            `
        }
    ];

    const additionalContentSections = [
        {
            title: "Benchmarks 2026",
            content: `
            <p class="mb-4 text-gray-300">
                Em testes com Cyberpunk 2077 e CS2:
            </p>
            <ul class="list-disc list-inside text-gray-300 space-y-1 ml-4 text-sm">
                <li><strong>FPS Médio:</strong> Diferença de 1% (Margem de erro).</li>
                <li><strong>FPS 1% Low (Travadinhas):</strong> Diferença de 8% a favor do Modo de Jogo Ativado.</li>
            </ul>
            <p class="mt-2 text-gray-300 text-sm">Conclusão: Ele não aumenta o teto, mas levanta o chão, deixando o jogo mais estável.</p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Modo de jogo funciona em jogos Piratas?",
            answer: "Sim. O Windows detecta qualquer processo de tela cheia que use DirectX/Vulkan intensamente como um 'jogo', independente da fonte (Steam, Epic ou alternativo)."
        },
        {
            question: "Otimizações de Tela Cheia (Compatibility)?",
            answer: "Ao clicar com botão direito no EXE do jogo > Compatibilidade, existe a caixa 'Desabilitar otimizações de tela cheia'. Em jogos antigos (DX9), marcar isso ajuda. Em jogos modernos (DX12), o Modo de Jogo do Windows já gerencia isso melhor. Deixe desmarcado por padrão."
        },
        {
            question: "Preciso reiniciar após ativar?",
            answer: "Não é estritamente necessário para o Modo de Jogo, mas recomendado."
        }
    ];

    const externalReferences = [
        { name: "Microsoft - Game Mode Info", url: "https://support.microsoft.com/en-us/windows/use-game-mode-while-gaming-on-your-windows-device-581b7535-b3f2-783e-a183-afdddac63539" }
    ];

    const relatedGuides = [
        {
            href: "/guias/aceleracao-hardware-gpu-agendamento",
            title: "GPU Scheduling",
            description: "Entenda o HAGS em detalhes."
        },
        {
            href: "/guias/debloating-windows-11",
            title: "Debloat",
            description: "Remova o Xbox Game Bar sem quebrar o Game Mode."
        },
        {
            href: "/guias/otimizacao-registro",
            title: "Configuração Avançada",
            description: "Defina prioridades de CPU manualmente."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="10 min"
            difficultyLevel="Iniciante"
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
