import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "League of Legends Tela Preta no Carregamento: Firewall e DNS fix (2026)";
const description = "A seleção de campeões termina, o logo do LoL aparece e... tela preta. O jogo não conecta? Veja como liberar o LoL no Firewall e mudar o DNS.";
const keywords = ['league of legends tela preta carregamento', 'lol nao conecta partida', 'erro de firewall league of legends', 'reparar lol hextech', 'lol travado reconectar', 'tela preta apos selecao de campeao'];

export const metadata: Metadata = createGuideMetadata('league-of-legends-tela-preta-carregamento', title, description, keywords);

export default function LoLBlackScreenGuide() {
    const summaryTable = [
        { label: "Sintoma", value: "Tela Preta/Reconnect" },
        { label: "Culpado", value: "Firewall / Rede" },
        { label: "Solução", value: "Exceção Firewall" },
        { label: "Ferramenta", value: "Hextech Tool" }
    ];

    const contentSections = [
        {
            title: "Por que a Tela Preta acontece?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
          O LoL é dividido em dois programas: o Cliente (onde você compra skins e fala no chat) e o Jogo (a partida). Quando a partida começa, o Cliente tenta abrir o Jogo. Se o Windows Firewall ou seu Antivírus acharem que o "Jogo" é um vírus tentando acessar a internet, eles bloqueiam a conexão. Resultado: Tela preta com botão "Reconectar".
        </p>
      `,
            subsections: []
        },
        {
            title: "Solução 1: Permitir no Firewall (Manual)",
            content: `
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4 mb-6">
            <li>Aperte Win, digite <strong>"Permitir um aplicativo pelo Firewall do Windows"</strong>.</li>
            <li>Clique em "Alterar configurações" (botão topo direita).</li>
            <li>Clique em "Permitir outro aplicativo..." > Procurar.</li>
            <li>Vá na pasta do LoL (Geralmente <code>C:\Riot Games\League of Legends\Game</code>).</li>
            <li>Selecione o arquivo <strong>League of Legends.exe</strong>.</li>
            <li>Adicione e marque as caixinhas "Privada" e "Pública".</li>
        </ol>
      `,
            subsections: []
        },
        {
            title: "Solução 2: O Bug da Resolução",
            content: `
        <p class="mb-4 text-gray-300">
            As vezes o jogo está tentando abrir numa resolução que seu monitor não suporta (Ex: 4K num monitor HD).
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-2">
            <li>Vá em <code>C:\Riot Games\League of Legends\Config</code>.</li>
            <li>Apague o arquivo <strong>game.cfg</strong> e <strong>PersistedSettings.json</strong>.</li>
            <li>Entre numa partida personalizada. O jogo vai resetar para o padrão.</li>
        </ul>
      `
        },
        {
            title: "Solução 3: DNS Cloudflare",
            content: `
        <p class="text-gray-300">
            Se for problema de rota, mude seu DNS para <strong>1.1.1.1</strong> (Veja nosso guia de DNS). Isso resolve 90% dos erros de "Falha ao Conectar".
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
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
        />
    );
}
