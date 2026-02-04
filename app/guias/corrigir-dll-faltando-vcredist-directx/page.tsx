import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Como Corrigir DLL Faltando: VCRedist e DirectX (Guia 2026)";
const description = "Seu jogo não abre por falta de .dll? Aprenda a instalar corretamente o Visual C++ Redistributable e o DirectX para rodar qualquer jogo em 2026.";
const keywords = [
    'como corrigir erro dll faltando windows 11 2026',
    'instalar vcredist all in one tutorial completo',
    'erro msvcp140.dll e vcruntime140.dll como resolver guia',
    'baixar directx 12 e directx 11 completo 2026',
    'solucionar erro aplicativo nao inicializou 0xc00007b'
];

export const metadata: Metadata = createGuideMetadata('corrigir-dll-faltando-vcredist-directx', title, description, keywords);

export default function DLLFixGuide() {
    const summaryTable = [
        { label: "O que são", value: "Bibliotecas de código essenciais (Runtimes)" },
        { label: "Culpado #1", value: "Visual C++ Redistributable (VCRedist)" },
        { label: "Culpado #2", value: "DirectX End-User Runtimes" },
        { label: "Dificuldade", value: "Fácil" }
    ];

    const contentSections = [
        {
            title: "Por que esses erros ocorrem?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Muitos jogos em 2026 são desenvolvidos usando ferramentas que dependem de bibliotecas da Microsoft. Se você formatou o seu PC recentemente ou o Windows Update não instalou tudo o que devia, ao tentar abrir o jogo você verá erros como **"MSVCP140.dll não encontrada"**. Nunca baixe DLLs individuais de sites estranhos! A solução correta é instalar o pacote oficial da Microsoft que contém centenas dessas bibliotecas.
        </p>
      `
        },
        {
            title: "1. Visual C++: O "All in One" (A Solução Mágica)",
            content: `
        <p class="mb-4 text-gray-300">Em vez de baixar um por um, instale o pacote completo:</p>
        <p class="text-sm text-gray-300">
            A melhor forma de resolver 99% dos erros de DLL em 2026 é o instalador <strong>Visual C++ Redistributable Runtimes All-in-One</strong>. Ele instala todas as versões de 2005 até 2026 de uma só vez, tanto para 32 bits (x86) quanto para 64 bits (x64). <br/><br/>
            <strong>Dica:</strong> Mesmo que o seu Windows seja 64 bits, você **precisa** instalar as versões x86 também, pois muitos jogos usam essas bibliotecas antigas para rodar subsistemas de áudio ou DRM.
        </p>
      `
        },
        {
            title: "2. DirectX: O motor dos jogos",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">DirectX End-User Web Installer:</h4>
            <p class="text-sm text-gray-300">
                Embora o Windows 11 já venha com o DirectX 12, ele não possui os componentes do <strong>DirectX 9, 10 e 11</strong> que muitos jogos clássicos utilizam. <br/><br/>
                Vá ao site oficial da Microsoft e baixe o 'DirectX End-User Runtime Web Installer'. Ele fará uma verificação nas pastas do seu sistema e baixará apenas o que estiver faltando, corrigindo erros como d3dx9_43.dll.
            </p>
        </div>
      `
        },
        {
            title: "3. O Erro 0xc00007b",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>O Vilão da Compatibilidade:</strong> 
            <br/><br/>Se você recebe o erro **"O aplicativo não pôde ser inicializado corretamente (0xc00007b)"**, significa que existe uma mistura de DLLs de 32 bits em pastas de 64 bits. A solução definitiva é desinstalar todos os 'Visual C++' pelo Painel de Controle e rodar o instalador All-in-One mencionado no passo 1. Isso limpará o registro e colocará cada arquivo no seu devido lugar.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/erro-0xc00007b-aplicativo-nao-inicializou",
            title: "Erro 0xc00007b",
            description: "Guia profundo focado apenas neste erro."
        },
        {
            href: "/guias/atualizacao-drivers-video",
            title: "Drivers de Vídeo",
            description: "Combine com o DirectX para performance máxima."
        },
        {
            href: "/guias/pos-instalacao-windows-11",
            title: "Checklist Windows",
            description: "Tudo o que você deve instalar no Windows novo."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="15 min"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
