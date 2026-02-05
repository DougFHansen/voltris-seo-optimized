import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'league-of-legends-tela-preta-carregamento',
  title: "LoL: Como resolver a Tela Preta no Carregamento em 2026",
  description: "Seu League of Legends fica com a tela preta após a seleção de campeão? Aprenda a corrigir este erro de conexão e firewall para não perder mais PDL.",
  category: 'games-fix',
  difficulty: 'Iniciante',
  time: '10 min'
};

const title = "LoL: Como resolver a Tela Preta no Carregamento em 2026";
const description = "Seu League of Legends fica com a tela preta após a seleção de campeão? Aprenda a corrigir este erro de conexão e firewall para não perder mais PDL.";
const keywords = [
    'league of legends tela preta carregamento 2026 fix',
    'lol nao entra na partida tela preta como resolver',
    'erro de firewall league of legends tutorial 2026',
    'reconfigurar dns lol tela preta carregando',
    'lol erro conexao servidor de partida travado'
];

export const metadata: Metadata = createGuideMetadata('league-of-legends-tela-preta-carregamento', title, description, keywords);

export default function LoLBlackScreenGuide() {
    const summaryTable = [
        { label: "Sintoma", value: "Tela preta após a Seleção de Campeões" },
        { label: "Causa #1", value: "Conflito de Resolução (Alt + Enter)" },
        { label: "Causa #2", value: "Bloqueio de Firewall ou DNS" },
        { label: "Dificuldade", value: "Fácil" }
    ];

    const contentSections = [
        {
            title: "O terror de quem quer subir de elo",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Em 2026, com o novo anti-cheat e as atualizações frequentes do Windows 11, o erro da **Tela Preta** no LoL continua sendo uma das maiores causas de abandonos involuntários. O problema acontece no exato momento em que o cliente do LoL tenta "entregar" o controle para o executável do jogo. Se houver qualquer falha na comunicação de rede ou na resolução da tela, o jogo simplesmente não abre.
        </p>
      `
        },
        {
            title: "1. O Truque do Alt + Enter (Resolvendo a Resolução)",
            content: `
        <p class="mb-4 text-gray-300">Muitas vezes o jogo tenta abrir em uma resolução que seu monitor não suporta no modo Fullscreen:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Quando a tela ficar preta, aperte <strong>Alt + Enter</strong> simultaneamente.</li>
            <li>Isso forçará o jogo a sair do modo Tela Cheia e entrar em <strong>Modo Janela</strong>.</li>
            <li>Se o jogo carregar no modo janela, vá nas configurações dentro da partida e ajuste a resolução para o padrão do seu monitor antes de voltar para Tela Cheia.</li>
        </ol>
      `
        },
        {
            title: "2. Reset de Configurações via Arquivo",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Se nada funcionar:</h4>
            <p class="text-sm text-gray-300">
                1. Vá na pasta de instalação do LoL (geralmente <code>C:/Riot Games/League of Legends/Config</code>). <br/>
                2. Delete o arquivo <strong>game.cfg</strong>. <br/>
                3. Ao tentar entrar em uma partida (use o modo Treino!), o jogo criará um arquivo novo com as configurações de vídeo zeradas, o que costuma eliminar conflitos de drivers de vídeo de 2026.
            </p>
        </div>
      `
        },
        {
            title: "3. Problemas de DNS e Conexão",
            content: `
        <p class="mb-4 text-gray-300">
            Se a tela preta vem acompanhada de uma mensagem de "Erro ao conectar ao servidor", o culpado é o seu DNS. 
            <br/><br/><strong>Dica:</strong> Mude o seu DNS para o do Google (8.8.8.8 e 8.8.4.4) ou Cloudflare (1.1.1.1). Os DNS de operadoras de internet no Brasil costumam ter rotas instáveis para os servidores da Riot em 2026, causando falhas na autenticação da partida.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/league-of-legends-fps-drop-fix",
            title: "Quedas de FPS",
            description: "Melhore o desempenho após entrar no jogo."
        },
        {
            href: "/guias/como-limpar-cache-dns-ip-flushdns",
            title: "Limpar DNS",
            description: "Comandos para resetar sua rede."
        },
        {
            href: "/guias/melhor-dns-jogos-2026",
            title: "Melhores DNS",
            description: "Escolha o servidor mais estável para o LoL."
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
