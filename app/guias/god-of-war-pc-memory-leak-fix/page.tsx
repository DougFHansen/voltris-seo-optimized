import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "God of War PC: Erro de Memória Cheia e Memory Leak Fix";
const description = "Seu God of War no PC trava após algumas horas de jogo? Aprenda a corrigir o erro de 'Memória Insuficiente' e o vazamento de memória (Memory Leak).";
const keywords = [
    'god of war pc memory leak fix 2026',
    'erro memoria insuficiente god of war pc como resolver',
    'god of war pc crashando do nada fix 2026',
    'aumentar memoria virtual para god of war pc',
    'otimizar god of war no pc 2026'
];

export const metadata: Metadata = createGuideMetadata('god-of-war-pc-memory-leak-fix', title, description, keywords);

export default function GoWMemoryFixGuide() {
    const summaryTable = [
        { label: "Causa Principal", value: "Memory Leak (Vazamento de Memória)" },
        { label: "Solução Chave", value: "Ajustar Memória Virtual (Paging File)" },
        { label: "Check de VRAM", value: "Texturas no Original/Baixo" },
        { label: "Dificuldade", value: "Média" }
    ];

    const contentSections = [
        {
            title: "O que é o Memory Leak no God of War?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Muitos jogadores relatam que o God of War começa a rodar bem, mas após 1 ou 2 horas, o FPS cai drasticamente ou o jogo dá crash com a mensagem de "Out of Memory". Isso acontece porque o jogo "esquece" de liberar a memória RAM que não está mais usando, acumulando lixo digital até o Windows não aguentar mais.
        </p>
      `
        },
        {
            title: "1. Ajustando a Memória Virtual (Paging File)",
            content: `
        <p class="mb-4 text-gray-300">Se você tem 8GB ou 16GB de RAM, o Windows precisa de um "fôlego" extra no SSD para evitar o crash:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Aperte <code>Win + R</code> e digite <strong>sysdm.cpl</strong>.</li>
            <li>Vá em Avançado > Desempenho (Configurações) > Avançado > Alterar.</li>
            <li>Desmarque 'Gerenciar automaticamente'.</li>
            <li>Selecione o seu SSD e escolha <strong>Tamanho personalizado</strong>.</li>
            <li>Coloque <strong>16384 MB</strong> (16GB) no Inicial e no Máximo.</li>
            <li>Clique em Definir e reinicie o PC. Isso dá uma margem de segurança enorme para o jogo acumular lixo sem crashar.</li>
        </ol>
      `
        },
        {
            title: "2. O Mod de Fix de Memória",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Nexus Mods:</h4>
            <p class="text-sm text-gray-300">
                Existe um mod popular chamado <strong>"God of War Memory Leak Fix"</strong> no Nexus Mods. Ele substitui alguns arquivos de biblioteca que melhoram a forma como o jogo despeja os assets do mapa. É altamente recomendado se você joga em notebooks ou PCs com pouca VRAM.
            </p>
        </div>
      `
        },
        {
            title: "3. Configurações de VRAM",
            content: `
        <p class="mb-4 text-gray-300">
            No God of War, as texturas no 'Ultra' exigem muita memória da placa de vídeo. 
            <br/>Se sua placa tem menos de 8GB de VRAM, mantenha as texturas em <strong>Original</strong> ou <strong>Baixo</strong>. Em 2026, com o HDR ativo, a VRAM enche ainda mais rápido, o que acelera o processo de vazamento de memória.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/atualizacao-drivers-video",
            title: "Drivers de Vídeo",
            description: "A NVIDIA lançou drivers específicos para GoW."
        },
        {
            href: "/guias/aceleracao-hardware-gpu-agendamento",
            title: "Agendamento de GPU",
            description: "Pode ajudar na estabilidade inicial."
        },
        {
            href: "/guias/otimizacao-performance",
            title: "Performance Windows",
            description: "Prepare o sistema para jogos AAA pesados."
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
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
