import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Como Bloquear a Internet de um Programa no Windows (2026)";
const description = "Quer impedir que um app se conecte à internet? Aprenda a usar o Firewall do Windows para bloquear o acesso de saída de programas e jogos em 2026.";
const keywords = [
    'como bloquear internet de um programa windows 11 2026',
    'bloquear acesso a rede de aplicativo firewall tutorial',
    'configurar regra de saida firewall windows 11 guia',
    'impedir que programa atualize sozinho no windows 11',
    'limitar internet de apps específicos tutorial 2026'
];

export const metadata: Metadata = createGuideMetadata('bloquear-internet-firewall-windows', title, description, keywords);

export default function FirewallBlockGuide() {
    const summaryTable = [
        { label: "Ferramenta", value: "Firewall do Windows com Segurança Avançada" },
        { label: "Tipo de Regra", value: "Regra de Saída (Outbound)" },
        { label: "Uso Comum", value: "Evitar updates automáticos / Privacidade" },
        { label: "Dificuldade", value: "Médio" }
    ];

    const contentSections = [
        {
            title: "Por que bloquear um programa?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Existem vários motivos para tirar a internet de um programa específico no Windows 11 em 2026: impedir que um player de vídeo verifique atualizações chatas, evitar que um jogo de um único jogador (Single Player) use banda desnecessária ou simplesmente por questões de privacidade, garantindo que o software não envie telemetria para servidores externos.
        </p>
      `
        },
        {
            title: "1. Acessando as Configurações Avançadas",
            content: `
        <p class="mb-4 text-gray-300">O Firewall básico do Windows não tem o botão de "bloqueio rápido". Você precisa ir no painel avançado:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Pesquise por **'Firewall do Windows com Segurança Avançada'** no menu Iniciar.</li>
            <li>No painel esquerdo, clique em <strong>Regras de Saída</strong>.</li>
            <li>À direita, clique em <strong>Nova Regra...</strong></li>
            <li>Selecione 'Programa' e clique em Avançar.</li>
            <li>Procure o caminho do executável (.exe) que você deseja bloquear.</li>
        </ol>
      `
        },
        {
            title: "2. Criando a Barreira Digital",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Bloqueio Total:</h4>
            <p class="text-sm text-gray-300">
                Após selecionar o programa, selecione a opção <strong>'Bloquear a conexão'</strong>. <br/><br/>
                Na tela seguinte, você pode escolher se o bloqueio vale para redes Domésticas, Públicas ou Corporativas. Recomendamos marcar **todas** para garantir que o software nunca consiga sinal, independente de onde você estiver com o seu notebook em 2026.
            </p>
        </div>
      `
        },
        {
            title: "3. Como saber se funcionou?",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>Teste Prático:</strong> 
            <br/><br/>Tente abrir o programa e realizar qualquer ação que exija internet (como o botão de 'Verificar atualizações'). O programa deve mostrar um erro de "Servidor não encontrado" ou ficar carregando infinitamente. Se um dia você quiser liberar o acesso novamente, basta voltar ao mesmo painel das Regras de Saída e clicar com o botão direito na regra que você criou, selecionando **'Desabilitar'** ou **'Excluir'**.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/firewall-configuracao",
            title: "Configurar Firewall",
            description: "Entenda o básico das defesas do Windows."
        },
        {
            href: "/guias/privacidade-windows-telemetria",
            title: "Bloquear Telemetria",
            description: "Impeça o Windows de enviar seus dados."
        },
        {
            href: "/guias/remocao-virus-malware",
            title: "Saúde do Sistema",
            description: "Veja se apps estranhos estão usando sua rede."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="10 min"
            difficultyLevel="Médio"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
