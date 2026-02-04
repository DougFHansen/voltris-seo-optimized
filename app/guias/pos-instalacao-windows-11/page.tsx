import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Setup Pós-Instalação: O que instalar no Windows 11 em 2026";
const description = "Acabou de formatar o PC? Veja a lista definitiva com os drivers e programas essenciais que não podem faltar no seu Windows 11 em 2026.";
const keywords = [
    'pos instalaçao windows 11 o que instalar 2026',
    'programas essenciais pc recem formatado 2026',
    'ordem correta de instalar drivers windows 11 tutorial',
    'configurações iniciais windows 11 para performance 2026',
    'checklist pos formatação pc gamer guia'
];

export const metadata: Metadata = createGuideMetadata('pos-instalacao-windows-11', title, description, keywords);

export default function PostInstallationGuide() {
    const summaryTable = [
        { label: "Prioridade #1", value: "Drivers de Chipset e GPU" },
        { label: "Navegação", value: "Brave ou Edge (Fuja de Bloatware)" },
        { label: "Segurança", value: "Windows Defender atualizado" },
        { label: "Dificuldade", value: "Iniciante" }
    ];

    const contentSections = [
        {
            title: "O perigo do computador "pelado"",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Muitos usuários acham que, ao terminar a instalação do Windows 11, o trabalho acabou. Na verdade, os primeiros 30 minutos após o primeiro boot são cruciais. É nesse momento que você define se o seu sistema será estável e rápido ou se ele começará a acumular erros de DLL e instabilidades de driver. Siga esta ordem cronológica para um setup perfeito em 2026.
        </p>
      `
        },
        {
            title: "1. A Ordem Correta dos Drivers",
            content: `
        <p class="mb-4 text-gray-300">Não confie apenas no Windows Update. Instale manualmente nesta ordem:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li><strong>Chipset da Placa-mãe:</strong> Define como o processador fala com o resto do PC.</li>
            <li><strong>Rede (LAN/Wi-Fi):</strong> Garante que o download dos outros drivers não caia.</li>
            <li><strong>Drivers de Áudio:</strong> Para ativar recursos como áudio espacial.</li>
            <li><strong>Placa de Vídeo (GPU):</strong> O driver oficial da NVIDIA ou AMD mais recente.</li>
        </ol>
      `
        },
        {
            title: "2. O Checklist de Programas Essenciais",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Kit de Sobrevivência 2026:</h4>
            <p class="text-sm text-gray-300">
                - <strong>Compressor:</strong> NanaZip (Melhor que o WinRAR para Windows 11). <br/>
                - <strong>Player:</strong> VLC ou PotPlayer (Suporte universal a codecs). <br/>
                - <strong>Runtimes:</strong> Visual C++ All-in-One (Evita erro de DLL faltando). <br/>
                - <strong>Browser:</strong> Brave (Para privacidade) ou Edge (Melhor integração e baixo consumo).
            </p>
        </div>
      `
        },
        {
            title: "3. Ajustes de Privacidade Imediatos",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>O Windows 11 é fofoqueiro:</strong> 
            <br/><br/>Antes de qualquer coisa, vá em Configurações > Privacidade e Segurança. Desative todas as opções de <strong>Diagnóstico e Comentários</strong> e <strong>ID de Anúncio</strong>. Desative também os 'Aplicativos em segundo plano' que você não usa. Isso garante que o seu PC recém-formatado não comece a enviar dados desnecessários para a Microsoft, liberando banda de internet e processamento.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/atualizacao-drivers-video",
            title: "Drivers de Vídeo",
            description: "Como fazer uma instalação limpa."
        },
        {
            href: "/guias/corrigir-dll-faltando-vcredist-directx",
            title: "Fixar DLLs",
            description: "Instale os runtimes necessários para jogos."
        },
        {
            href: "/guias/otimizacao-performance",
            title: "Otimizar Sistema",
            description: "Ajustes de performance após o setup."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="45 min"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
