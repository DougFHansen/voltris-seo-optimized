import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Abrir Portas do Roteador (Port Forwarding) vs UPnP: O que é NAT Aberto? (2026)";
const description = "Seu jogo diz 'NAT Estrito' ou você não consegue hospedar partidas? Entenda por que abrir portas manualmente ficou obsoleto e como ativar o UPnP.";
const keywords = ['abrir portas roteador para jogos', 'nat estrito xbox pc', 'como ativar upnp roteador', 'port forwarding vale a pena', 'nat moderado warzone', 'hospedar servidor minecraft porta'];

export const metadata: Metadata = createGuideMetadata('abrir-portas-roteador-nat-aberto', title, description, keywords);

export default function PortGuide() {
    const summaryTable = [
        { label: "Método Antigo", value: "Port Forwarding" },
        { label: "Método Novo", value: "UPnP (Automático)" },
        { label: "NAT Aberto", value: "Conecta com Tudo" },
        { label: "NAT Estrito", value: "Só com Aberto" }
    ];

    const contentSections = [
        {
            title: "O Pesadelo do NAT Estrito",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
          Se seu NAT é estrito, você é antissocial digitalmente. Você só consegue jogar com quem tem NAT Aberto. Se você e seu amigo tiverem NAT Estrito, vocês NUNCA vão conseguir entrar na mesma sala.
        </p>
      `,
            subsections: []
        },
        {
            title: "UPnP: A Mágica Automática",
            content: `
        <p class="mb-4 text-gray-300">
            Antigamente, você tinha que entrar no roteador e digitar números de porta (Ex: 27015 para CS) manualmente. Hoje, existe o <strong>Universal Plug and Play (UPnP)</strong>.
        </p>
        <p class="mb-4 text-gray-300">
            O jogo "pede" para o roteador abrir a porta, e o roteador abre sozinho.
        </p>
        <div class="bg-gray-800 p-6 rounded-xl border border-green-500 mb-6">
            <h4 class="text-white font-bold mb-2">Como Ativar UPnP</h4>
            <ol class="list-decimal list-inside text-gray-300 text-sm ml-4">
                <li>Acesse seu roteador (geralmente <code>192.168.0.1</code> ou <code>192.168.1.1</code>).</li>
                <li>Login/Senha padrão geralmente é "admin" / "admin" (ou veja embaixo do aparelho).</li>
                <li>Procure por abas: <strong>Forwarding</strong>, <strong>NAT</strong> ou <strong>Advanced</strong>.</li>
                <li>Encontre <strong>UPnP</strong> e marque <strong>Enable</strong>.</li>
                <li>Reinicie o roteador.</li>
            </ol>
        </div>
      `,
            subsections: []
        },
        {
            title: "CGNAT: O Vilão que o UPnP não vence",
            content: `
        <p class="text-gray-300 mb-4">
            Se você ativou o UPnP e o NAT continua Estrito, seu provedor de internet (ISP) está usando <strong>CGNAT</strong> (Carrier Grade NAT).
        </p>
        <p class="text-gray-300">
            Isso significa que você divide o mesmo IP público com 50 vizinhos. Não adianta abrir porta na sua casa, porque a porta está fechada na central da operadora.
            <br/><br/>
            <strong>Solução:</strong> Ligue para o provedor e peça para "Sair do CGNAT" ou contratar um "IP Fixo" (geralmente cobram R$ 20 a mais). Ou use VPNs como ExitLag que furam o NAT.
        </p>
      `
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="15 min"
            difficultyLevel="Avançado"
            contentSections={contentSections}
            summaryTable={summaryTable}
        />
    );
}
