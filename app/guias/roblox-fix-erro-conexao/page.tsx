import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Roblox: Como resolver Erro de Conexão (ID 277 / 279)";
const description = "Sua partida de Roblox caiu? Aprenda a resolver os erros de conexão 277, 279 e outros problemas de ping no Roblox em 2026.";
const keywords = [
    'roblox erro de conexão 277 como resolver 2026',
    'roblox erro 279 tutorial guia definitivo 2026',
    'como diminuir o ping no roblox tutorial 2026',
    'roblox desconectando sozinho windows 11 fix',
    'melhor dns para jogar roblox sem lag 2026'
];

export const metadata: Metadata = createGuideMetadata('roblox-fix-erro-conexao', title, description, keywords);

export default function RobloxConnectionFixGuide() {
    const summaryTable = [
        { label: "Erro 277", value: "Queda inesperada (Servidor ou Internet)" },
        { label: "Erro 279", value: "Falha ao entrar no mapa (Firewall/DNS)" },
        { label: "Solução #1", value: "Limpeza de Logs e Cache" },
        { label: "Dificuldade", value: "Fácil" }
    ];

    const contentSections = [
        {
            title: "Por que o Roblox desconecta?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Em 2026, com experiências de Roblox cada vez mais complexas e pesadas, a estabilidade da sua internet se tornou vital. O erro **ID 277** geralmente indica que o seu computador parou de enviar dados para o servidor, enquanto o **ID 279** costuma ser um bloqueio de rede impedindo você de carregar o mapa inicialmente. Quase sempre, o problema pode ser resolvido com ajustes simples no seu Windows 11.
        </p>
      `
        },
        {
            title: "1. Limpando o \"Lixo\" do Roblox",
            content: `
        <p class="mb-4 text-gray-300">Arquivos corrompidos de sessões antigas causam erros de conexão:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Aperte <code>Windows + R</code>, digite <code>%localappdata%</code> e dê Enter.</li>
            <li>Procure a pasta <strong>Roblox</strong> e abra.</li>
            <li>Apague as pastas <strong>logs</strong> e <strong>Downloads</strong>.</li>
            <li>Dentro de <code>%temp%</code> (aplique o mesmo comando Windows+R), apague a pasta 'Roblox' se ela existir.</li>
            <li>Isso força o jogo a criar uma nova conexão limpa com os servidores.</li>
        </ol>
      `
        },
        {
            title: "2. O Bloqueio do Firewall",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Liberação de Segurança:</h4>
            <p class="text-sm text-gray-300">
                O erro ID 279 frequentemente ocorre porque o Firewall do Windows ou o antivírus bloqueia o acesso do Roblox a portas específicas. <br/><br/>
                Vá em Painel de Controle > Sistema e Segurança > Windows Defender Firewall > 'Permitir um aplicativo pelo Firewall'. Certifique-se de que o <strong>Roblox</strong> esteja marcado tanto em 'Privado' quanto em 'Público'.
            </p>
        </div>
      `
        },
        {
            title: "3. DNS e IP em 2026",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>Renovando o sinal:</strong> 
            <br/><br/>Se o erro persistir, abra o CMD (Prompt de Comando) como administrador e digite estes três comandos, um por um: <br/>
            <code>ipconfig /flushdns</code> <br/>
            <code>netsh winsock reset</code> <br/>
            <code>netsh int ip reset</code> <br/><br/>
            Isso limpará qualquer rota de internet "travada" que esteja impedindo o Roblox de encontrar o servidor mais próximo. Reinicie o computador após os comandos para que as mudanças tenham efeito.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/roblox-fps-unlocker-tutorial",
            title: "Desbloquear FPS",
            description: "Jogue Roblox acima de 60 FPS."
        },
        {
            href: "/guias/reduzir-ping-jogos-online",
            title: "Reduzir Ping",
            description: "Melhore a conexão geral em jogos."
        },
        {
            href: "/guias/wifi-desconectando-sozinho-windows",
            title: "Wi-Fi Caindo",
            description: "Resolva problemas se o Wi-Fi desconecta."
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
