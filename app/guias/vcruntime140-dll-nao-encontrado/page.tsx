import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "VCRUNTIME140.dll não encontrado: Como resolver (2026)";
const description = "Seu jogo ou programa não abre e diz que falta o VCRUNTIME140.dll ou MSVCP140.dll? Aprenda como instalar os redistribuíveis oficiais em 2026.";
const keywords = [
    'vcruntime140.dll nao encontrado como resolver 2026',
    'faltando msvcp140.dll windows 11 tutorial guia',
    'baixar microsoft visual c++ redistributable 2026 tutorial',
    'como instalar dll faltando no windows 11 guia 2026',
    'erro de sistema dll nao encontrada tutorial passo a passo'
];

export const metadata: Metadata = createGuideMetadata('vcruntime140-dll-nao-encontrado', title, description, keywords);

export default function VCRuntimeFixGuide() {
    const summaryTable = [
        { label: "Causa", value: "Falta do Microsoft Visual C++ Redistributable" },
        { label: "Solução Correta", value: "Instalador Oficial da Microsoft" },
        { label: "Risco", value: "Nunca baixe arquivos .dll soltos de sites desconhecidos" },
        { label: "Dificuldade", value: "Fácil" }
    ];

    const contentSections = [
        {
            title: "Por que as DLLs desaparecem?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O erro **VCRUNTIME140.dll** ou **MSVCP140.dll** acontece quando um programa tenta usar bibliotecas de código da Microsoft que não estão instaladas no seu computador. Em 2026, muitos jogos e softwares de edição exigem essas bibliotecas para converter comandos complexos em ações na tela. Se o instalador do programa falhou ao configurar esses componentes, o Windows simplesmente não saberá como rodar o aplicativo.
        </p>
      `
        },
        {
            title: "1. O Perigo dos Sites de DLL",
            content: `
        <p class="mb-4 text-gray-300"><strong>CUIDADO:</strong> Muitos usuários cometem o erro de pesquisar a DLL no Google e baixar um arquivo solto para colar na pasta <code>System32</code>.</p>
        <p class="text-sm text-gray-300">
            Fazer isso em 2026 é extremamente perigoso por duas razões: <br/>
            1. <strong>Vírus:</strong> Esses arquivos .dll costumam carregar cavalos de troia (Trojan). <br/>
            2. <strong>Incompatibilidade:</strong> Uma DLL solta pode ter uma versão diferente da que o programa precisa, causando erros ainda mais graves de "Ponto de entrada não encontrado".
        </p>
      `
        },
        {
            title: "2. A Solução Definitiva (Visual C++ AIO)",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Instale tudo de uma vez:</h4>
            <p class="text-sm text-gray-300">
                A forma mais inteligente de resolver isso em 2026 é baixar o <strong>Visual C++ Redistributable All-in-One</strong>. <br/><br/>
                Ele é um instalador único que coloca todas as versões (2005 até 2026) nos formatos x86 e x64 do seu Windows. Isso garante que não apenas o jogo de hoje funcione, mas que nenhum programa futuro apresente erro de DLL. Basta rodar o arquivo <code>install_all.bat</code> como Administrador e aguardar a conclusão.
            </p>
        </div>
      `
        },
        {
            title: "3. Corrigindo com o comando SFC",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>E se eu já tenho instalado?</strong> 
            <br/><br/>Se você já instalou os redistribuíveis e o erro continua, sua DLL pode estar corrompida. Use o comando <code>sfc /scannow</code> no Prompt de Comando (Admin). O Windows 11 fará uma varredura nas pastas de sistema e restaurará automaticamente qualquer DLL vitais que tenham sido modificadas ou deletadas por engano.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/corrigir-dll-faltando-vcredist-directx",
            title: "Guia DLL Geral",
            description: "Resolva erros de DirectX e .NET."
        },
        {
            href: "/guias/pos-instalacao-windows-11",
            title: "Pós-Instalação",
            description: "Pack de programas essenciais para o Windows."
        },
        {
            href: "/guias/remocao-virus-malware",
            title: "Limpeza de Vírus",
            description: "Dicas se você baixou DLLs de sites suspeitos."
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
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
