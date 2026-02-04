import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Xbox App não baixa jogos? Como resolver (Guia 2026)";
const description = "Seu download no Xbox Game Pass travou em 0% ou dá erro? Aprenda como resetar os Serviços de Jogos e baixar tudo normalmente em 2026.";
const keywords = [
    'xbox app nao baixa jogos game pass 2026 tutorial',
    'erro de download xbox app windows 11 guia 2026',
    'como resetar gaming services xbox tutorial guia',
    'xbox game pass travado em preparando tutorial 2026',
    'corrigir erro microsoft store xbox app tutorial guia 2026'
];

export const metadata: Metadata = createGuideMetadata('xbox-app-nao-baixa-jogos-gamepass', title, description, keywords);

export default function XboxAppFixGuide() {
    const summaryTable = [
        { label: "Erro Comum", value: "Download em 0% / Preparando..." },
        { label: "Culpado", value: "Gaming Services (Serviços de Jogos)" },
        { label: "Solução #1", value: "Resetar Apps de Sistema" },
        { label: "Dificuldade", value: "Médio" }
    ];

    const contentSections = [
        {
            title: "O pesadelo do Game Pass",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O **Xbox Game Pass** em 2026 é um serviço excelente, mas o aplicativo para Windows ainda sofre com problemas de integração profunda com a Microsoft Store. Muitas vezes, um jogo não baixa ou o botão de 'Instalar' simplesmente não reage. Isso acontece devido a falhas nos **Gaming Services**, um componente invisível que gerencia as licenças e a instalação dos jogos da Microsoft no seu PC.
        </p>
      `
        },
        {
            title: "1. Resetando o Xbox App e a Microsoft Store",
            content: `
        <p class="mb-4 text-gray-300">O primeiro passo é redefinir as configurações locais:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Vá em Configurações > Aplicativos > Aplicativos Instalados.</li>
            <li>Procure por 'Xbox' e clique nos três pontos > Opções Avançadas > <strong>Restaurar</strong>.</li>
            <li>Faça o mesmo com o aplicativo 'Microsoft Store'.</li>
            <li>Abra o CMD como Administrador e digite <code>wsreset.exe</code>. Uma janela preta abrirá e fechará sozinha; isso limpa o cache da loja.</li>
        </ol>
      `
        },
        {
            title: "2. Reinstalando os Gaming Services via PowerShell",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Solução Definitiva:</h4>
            <p class="text-sm text-gray-300">
                Se os resets simples não funcionaram, precisamos forçar a reinstalação do motor de downloads. <br/><br/>
                No PowerShell (Admin), cole este comando para desinstalar: <br/>
                <code>get-appxpackage Microsoft.GamingServices | remove-AppxPackage -allusers</code> <br/><br/>
                Após isso, cole este para abrir a página de instalação oficial: <br/>
                <code>start ms-windows-store://pdp/?productid=9MWPM2CQNLHN</code> <br/>
                Instale os Serviços de Jogos novamente e reinicie o PC. Isso resolve 99% dos casos de 'Download travado em 0%'.
            </p>
        </div>
      `
        },
        {
            title: "3. Check de Região e Horário",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>Dica de 2026:</strong> A Microsoft Store é chata com a localização. 
            <br/><br/>Verifique se o seu Windows está com a **Hora Automática** ligada e se a **Região** está configurada como 'Brasil'. Se houver divergência entre o horário do seu PC e o horário real do servidor, a autenticação da sua assinatura Game Pass falhará, impedindo qualquer download de iniciar por "erro de segurança".
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/xbox-game-pass-pc-vale-a-pena",
            title: "Vale a Pena?",
            description: "Review do serviço em 2026."
        },
        {
            href: "/guias/pos-instalacao-windows-11",
            title: "Setup Windows",
            description: "Ajustes de sistema para gamers."
        },
        {
            href: "/guias/windows-update-corrigir-erros",
            title: "Erros de Update",
            description: "Como destravar downloads no Windows."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="20 min"
            difficultyLevel="Médio"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
