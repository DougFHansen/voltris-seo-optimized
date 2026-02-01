import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Epic Games Launcher Lento e Travando PC? Como Otimizar e Reduzir Uso de CPU (2026)";
const description = "O Launcher da Epic consome 20% da sua CPU só de ficar aberto? Veja como desativar o Web Helper e as notificações para deixá-lo leve como a Steam.";
const keywords = ['epic games launcher lento', 'epic games consome muita cpu', 'otimizar epic games launcher', 'epic web helper cpu', 'desativar notificacoes epic games', 'epic games travando pc'];

export const metadata: Metadata = createGuideMetadata('epic-games-launcher-lento-cpu-fix', title, description, keywords);

export default function EpicLagGuide() {
    const summaryTable = [
        { label: "Problema", value: "Uso alto de CPU" },
        { label: "Culpado", value: "Epic Web Helper" },
        { label: "Solução 1", value: "Editar Target" },
        { label: "Solução 2", value: "Minimizar" }
    ];

    const contentSections = [
        {
            title: "Por que a Epic é tão pesada?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
          Diferente da Steam que é nativa, o Launcher da Epic é basicamente um monte de páginas web rodando dentro de um navegador Unreal Engine. Isso cria vários processos chamados "EpicWebHelper.exe" que comem RAM e CPU.
        </p>
      `,
            subsections: []
        },
        {
            title: "Passo 1: Desativar a Loja Pesada (Target Fix)",
            content: `
        <p class="mb-4 text-gray-300">
            Podemos forçar o launcher a abrir de um jeito mais simples? Não, mas podemos melhorar.
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4 mb-6">
            <li>Vá nas Configurações do Launcher (Letra inicial do seu nome > Configurações).</li>
            <li>Desmarque <strong>"Minimizar para a bandeja do sistema"</strong>. (Queremos que ele feche de verdade quando clicamos no X).</li>
            <li>Desmarque <strong>"Exibir Notificações de Jogos Grátis"</strong> (Isso roda um processo de fundo).</li>
        </ol>
      `,
            subsections: []
        },
        {
            title: "Passo 2: O Truque do Launcher Options",
            content: `
        <p class="mb-4 text-gray-300">
            Vamos editar o atalho para limitar a renderização.
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4">
            <li>Clique com botão direito no atalho da Epic Games na Área de Trabalho > Propriedades.</li>
            <li>No campo <strong>Destino (Target)</strong>, vá até o final da linha, dê um Espaço e cole:</li>
        </ol>
        <div class="bg-black border border-gray-700 p-4 rounded-lg mt-2 mb-4 font-mono text-yellow-400 text-sm break-all">
            -OpenGL -LimitUserTracker
        </div>
        <p class="text-gray-300">
            Dê OK. Isso força o launcher a usar uma renderização mais simples e desliga parte do rastreamento de usuário.
        </p>
      `,
            subsections: []
        },
        {
            title: "Solução Definitiva: Heroic Games Launcher",
            content: `
        <p class="text-gray-300 mb-4">
            Se você está cansado da Epic, use o <strong>Heroic Games Launcher</strong>. É um app open-source, ultra leve, que loga na sua conta da Epic e baixa seus jogos. Ele não consome nada de RAM. É seguro e muito usado no Steam Deck.
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
