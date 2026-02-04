import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Roblox Tela Branca: Como resolver o erro de inicialização (2026)";
const description = "Seu Roblox abre mas fica travado em uma tela branca ou cinza? Aprenda a resolver problemas de renderização e compatibilidade no Roblox em 2026.";
const keywords = [
    'roblox tela branca como resolver 2026 tutorial',
    'roblox carregar infinito tela branca fix windows 11',
    'como consertar roblox travado no inicio tutorial 2026',
    'roblox erro de renderização tela branca guia',
    'limpar dados roblox tela branca passo a passo 2026'
];

export const metadata: Metadata = createGuideMetadata('roblox-tela-branca-travada-fix', title, description, keywords);

export default function RobloxWhiteScreenGuide() {
    const summaryTable = [
        { label: "Sintoma", value: "Janela abre mas não mostra a imagem do jogo" },
        { label: "Causa #1", value: "Driver de Vídeo desatualizado ou bugado" },
        { label: "Causa #2", value: "Conflito com Shaders (Bloxshade, etc)" },
        { label: "Dificuldade", value: "Iniciante" }
    ];

    const contentSections = [
        {
            title: "O que causa a Tela Branca no Roblox?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          A **Tela Branca** no Roblox acontece quando o executável do jogo consegue iniciar, mas o motor gráfico não consegue desenhar as texturas e a interface. Em 2026, isso geralmente está ligado a arquivos de cache corrompidos ou ao Windows tentando rodar o Roblox usando a placa de vídeo integrada em vez da placa potente. Vamos resolver isso com três passos simples.
        </p>
      `
        },
        {
            title: "1. Forçando a Placa de Vídeo Correta",
            content: `
        <p class="mb-4 text-gray-300">Se você joga em Notebook Gamer, este é o principal suspeito:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Abra as Configurações do Windows > Sistema > <strong>Gráficos</strong>.</li>
            <li>Procure por 'Roblox' na lista (ou clique em procurar e aponte para o <code>RobloxPlayerBeta.exe</code>).</li>
            <li>Clique em Opções e selecione <strong>'Alto Desempenho'</strong> (Sua placa de vídeo dedicada).</li>
            <li>Salve e tente abrir o jogo novamente.</li>
        </ol>
      `
        },
        {
            title: "2. Resetando as Configurações de Internet do Windows",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Truque do Painel de Controle:</h4>
            <p class="text-sm text-gray-300">
                1. Pesquise por 'Opções da Internet' no menu Iniciar. <br/>
                2. Vá na aba <strong>Avançadas</strong>. <br/>
                3. Clique no botão <strong>'Restaurar configurações avançadas'</strong>. <br/>
                4. Logo abaixo, clique em 'Redefinir' (Reset). <br/>
                O Roblox usa as bibliotecas do sistema para carregar o Launcher; se houver algum erro de SSL ou conexão antiga, ele ficará travado em branco.
            </p>
        </div>
      `
        },
        {
            title: "3. Problemas com Modificações Visuais",
            content: `
        <p class="mb-4 text-gray-300">
            Você usa o **ReShade** ou o **Bloxshade** em 2026? 
            <br/><br/><strong>Aviso:</strong> Versões desatualizadas desses injetores de imagem são os maiores causadores de tela branca após cada atualização de quarta-feira do Roblox. Se o jogo não abrir, remova a pasta de shaders do diretório do Roblox ou atualize o injetor para a versão mais recente compatível com o sistema de anti-cheat <strong>Hyperion</strong>.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/roblox-fix-erro-conexao",
            title: "Erros de Conexão",
            description: "Resolva erros HTTP e de login."
        },
        {
            href: "/guias/atualizacao-drivers-video",
            title: "Atualizar Drivers",
            description: "Garanta que sua GPU suporte o motor do Roblox."
        },
        {
            href: "/guias/como-limpar-cache-dns-ip-flushdns",
            title: "Limpar Cache DNS",
            description: "Resolva problemas ocultos de rede."
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
