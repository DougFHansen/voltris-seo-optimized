import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "PUBG: O Guia Definitivo para Resolver Stuttering, Travadas e Aumentar FPS (2026)";
const description = "Seu PUBG congela na hora do tiro? Aprenda as melhores Launch Options, como escolher entre DX11 Enhanced e DX12, e otimizações de memória RAM para um jogo liso.";
const keywords = ['pubg stuttering fix', 'aumentar fps pubg 2026', 'pubg dx11 enhanced vs dx12', 'launch options pubg', 'islc pubg', 'limpar memoria ram pubg'];

export const metadata: Metadata = createGuideMetadata('pubg-steam-fix-stuttering-travadas', title, description, keywords);

export default function PUBGGuide() {
    const summaryTable = [
        { label: "DirectX", value: "DX11 Enhanced" },
        { label: "Render Scale", value: "100" },
        { label: "Launch Option", value: "-USEALLAVAILABLE..." },
        { label: "RAM Fix", value: "ISLC" }
    ];

    const contentSections = [
        {
            title: "Introdução: Por que o PUBG trava tanto?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
            PlayerUnknown's Battlegrounds é famoso por sua má otimização. Stutters (micro-travamentos) geralmente ocorrem por três motivos: Compilação de Shaders, Falta de RAM (Memory Leak) ou uso incorreto da API DirectX.
        </p>
      `,
            subsections: []
        },
        {
            title: "1. Escolhendo o DirectX Correto",
            content: `
        <p class="mb-4 text-gray-300">Nas configurações gráficas, você tem três opções. Escolher a errada = Metade do FPS.</p>
        
        <div class="space-y-4">
            <div class="bg-gray-800 p-4 rounded border-l-4 border-red-500">
                <strong class="text-white block">DirectX 11 (Padrão)</strong>
                <span class="text-gray-400 text-sm">Estável, mas antigo. Bom para placas muito velhas (GTX 750 Ti).</span>
            </div>
            <div class="bg-gray-800 p-4 rounded border-l-4 border-green-500">
                <strong class="text-white block">DirectX 11 Enhanced (Melhorado)</strong>
                <span class="text-gray-400 text-sm"><strong>RECOMENDADO PARA 99% DOS JOGADORES.</strong> É a versão mais otimizada, com melhor gerenciamento de CPU e frametime mais liso. Use sempre esta.</span>
            </div>
            <div class="bg-gray-800 p-4 rounded border-l-4 border-yellow-500">
                <strong class="text-white block">DirectX 12</strong>
                <span class="text-gray-400 text-sm">INSTÁVEL. Evite. Causa crashes e stuttering na maioria dos PCs, mesmo em high-end.</span>
            </div>
        </div>
      `,
            subsections: []
        },
        {
            title: "2. Launch Options Reais",
            content: `
        <p class="mb-4 text-gray-300">
            A maioria das launch options da internet são placebo. Aqui estão as únicos que funcionam no PUBG em 2026.
        </p>
        <code class="block bg-[#121218] p-4 text-green-400 font-mono mb-4 select-all">
            -USEALLAVAILABLECORES -refresh 144 -maxMem=13000 -malloc=system
        </code>
        <ul class="list-disc list-inside text-gray-300 space-y-2 text-sm">
            <li><strong>-USEALLAVAILABLECORES:</strong> Obriga a Unreal Engine a usar todos os núcleos da CPU.</li>
            <li><strong>-refresh X:</strong> Coloque seus Hz (60, 144, 240).</li>
            <li><strong>-maxMem=X:</strong> Limita quanta RAM o jogo pode pegar antes de limpar o lixo.
                <br/>- Se tem 16GB RAM: 13000
                <br/>- Se tem 8GB RAM: 7000
                <br/>Isso força o Garbage Collector a rodar mais vezes e evita o estouro de memória.
            </li>
            <li><strong>-malloc=system:</strong> Deixa o Windows gerenciar a alocação de memória (melhor que o jogo).</li>
        </ul>
      `
        },
        {
            title: "3. O Problema do Standby Memory (ISLC)",
            content: `
            <p class="mb-4 text-gray-300">
                O PUBG enche sua memória RAM de arquivos "Standby" (Em espera) e o Windows demora para liberar. Quando a RAM enche, o jogo trava.
            </p>
            <p class="text-gray-300 mb-4">
                Baixe o programa <strong>ISLC (Intelligent Standby List Cleaner)</strong>.
            </p>
            <ul class="list-disc list-inside text-gray-300 text-sm">
                <li>Configure "The list size is at least": <strong>1024 MB</strong>.</li>
                <li>Configure "Free memory is lower than": <strong>2048 MB</strong>.</li>
                <li>Clique em Start.</li>
            </ul>
            <p class="text-gray-300 mt-2">
                Deixe aberto enquanto joga. Ele vai limpar a memória automaticamente, acabando com as travadas de meio de partida.
            </p>
        `
        },
        {
            title: "4. Configurações Gráficas Específicas",
            content: `
            <ul class="list-disc list-inside text-gray-300 space-y-2">
                <li><strong>Escala de Renderização:</strong> Mantenha em <strong>100</strong>. Abaixo disso fica borrado, acima perde FPS.</li>
                <li><strong>Anti-Aliasing:</strong> Muito Baixo (Para ver mais nítido) ou Médio.</li>
                <li><strong>Pós-Processamento:</strong> Muito Baixo (Remove borrão de profundidade).</li>
                <li><strong>Sombras:</strong> Muito Baixo (Essencial para ver inimigos na grama).</li>
                <li><strong>Texturas:</strong> Médio (Para não ficar feio demais, consome pouca performance).</li>
                <li><strong>Distância de Visão:</strong> Médio ou Baixo. (Jogadores renderizam na mesma distância independente dessa config, isso só afeta prédios/árvores).</li> 
            </ul>
        `
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
        />
    );
}
