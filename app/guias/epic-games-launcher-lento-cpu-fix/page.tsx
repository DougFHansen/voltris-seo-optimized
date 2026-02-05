import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'epic-games-launcher-lento-cpu-fix',
  title: "Epic Games Launcher Lento ou Pesando na CPU? Como Fix (2026)",
  description: "O launcher da Epic Games está travando seu PC ou consumindo muita CPU em repouso? Aprenda como otimizar o Epic Launcher no Windows 11 em 2026.",
  category: 'games-fix',
  difficulty: 'Iniciante',
  time: '10 min'
};

const title = "Epic Games Launcher Lento ou Pesando na CPU? Como Fix (2026)";
const description = "O launcher da Epic Games está travando seu PC ou consumindo muita CPU em repouso? Aprenda como otimizar o Epic Launcher no Windows 11 em 2026.";
const keywords = [
    'epic games launcher lento como resolver 2026',
    'diminuir uso de cpu epic games launcher guia',
    'epic games launcher travando windows 11 tutorial',
    'otimizar inicialização epic games launcher 2026',
    'launcher da epic consumindo muita ram como fix guia'
];

export const metadata: Metadata = createGuideMetadata('epic-games-launcher-lento-cpu-fix', title, description, keywords);

export default function EpicGamesFixGuide() {
    const summaryTable = [
        { label: "Problema #1", value: "Alto uso de CPU em segundo plano (Webview)" },
        { label: "Problema #2", value: "Download lento mesmo com fibra" },
        { label: "Solução Chave", value: "Limites de taxa de download e Modo Econômico" },
        { label: "Dificuldade", value: "Fácil" }
    ];

    const contentSections = [
        {
            title: "O \"peso\" da Epic Games em 2026",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Embora a **Epic Games Store** ofereça jogos incríveis de graça toda semana, o seu programa inicializador (Launcher) é conhecido por ser pesado. Construído com tecnologias web, ele pode consumir mais processador que o próprio jogo se estiver mal configurado. Em 2026, com computadores multitarefa, manter o launcher "quieto" enquanto você não está jogando é essencial para a saúde do sistema.
        </p>
      `
        },
        {
            title: "1. Reduzindo o Uso de CPU em Repouso",
            content: `
        <p class="mb-4 text-gray-300">O launcher costuma "observar" o hardware o tempo todo. Desative isso:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Abra o Epic Games Launcher e clique no ícone do seu perfil no topo direito.</li>
            <li>Vá em <strong>Configurações</strong>.</li>
            <li>Desmarque a opção <strong>'Habilitar Navegação por Voz'</strong> e <strong>'Minimizar para a Bandeja do Sistema'</strong> (se preferir que ele feche de verdade).</li>
            <li>Marque a opção <strong>'Modo de Pouca Energia'</strong> (se disponível). Isso reduz as animações da loja, aliviando o uso da sua GPU e CPU 2026.</li>
        </ol>
      `
        },
        {
            title: "2. Corrigindo Downloads Lentos",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Truque de Largura de Banda:</h4>
            <p class="text-sm text-gray-300">
                Muitas vezes, downloads na Epic travam em 0B/s ou ficam muito lentos. <br/><br/>
                No menu de Configurações, procure por <strong>'Limitar downloads'</strong>. Coloque um valor muito alto, como 1000000 (um milhão de KB/s). Por algum motivo técnico do código da Epic, colocar um limite manual forçado muitas vezes "destrava" a velocidade máxima da sua conexão em 2026.
            </p>
        </div>
      `
        },
        {
            title: "3. O Inicializador Limpo (Startup)",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>Não deixe ele ligar com o PC:</strong> 
            <br/><br/>A maior causa de lentidão ao ligar o computador é o Epic Launcher tentando verificar atualizações logo no primeiro segundo do Windows 11. <br/><br/>
            Vá nas configurações do launcher e desmarque **'Executar na inicialização do computador'**. Só abra a loja quando você REALMENTE for jogar. Isso economizará cerca de 300MB de RAM e vários ciclos de CPU desde o momento do boot.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/limpar-cache-dns-ip-flushdns",
            title: "Aumentar Velocidade",
            description: "Melhore sua rede para downloads na Epic."
        },
        {
            href: "/guias/limpar-memoria-ram-windows",
            title: "Liberar RAM",
            description: "Dicas para o Windows rodar mais leve."
        },
        {
            href: "/guias/atalhos-produtividade-windows",
            title: "Atalhos Úteis",
            description: "Navegue mais rápido pelo Windows 11."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="10 min"
            difficultyLevel="Fácil"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
