import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Como Abrir Portas do Roteador para ter NAT Aberto nos Jogos";
const description = "Sofrendo com NAT Restrito no Warzone, GTA ou jogos da Steam? Aprenda a configurar o Port Forwarding e o DMZ do seu roteador para uma conexão estável.";
const keywords = [
    'como abrir portas do roteador para jogos 2026',
    'nat aberto warzone e gta v como conseguir',
    'configurar port forwarding roteador passo a passo',
    'o que é dmz no roteador e como usar seguro',
    'como resolver nat restrito xbox pc playstation'
];

export const metadata: Metadata = createGuideMetadata('abrir-portas-roteador-nat-aberto', title, description, keywords);

export default function RouterPortGuide() {
    const summaryTable = [
        { label: "O que é NAT", value: "Network Address Translation (Tradução de Endereço)" },
        { label: "NAT Aberto", value: "Melhor para jogos (Livre comunicação)" },
        { label: "NAT Moderado", value: "Aceitável (Algumas restrições)" },
        { label: "NAT Restrito", value: "Ruim (Causa quedas e lag)" }
    ];

    const contentSections = [
        {
            title: "O Pavor dos Jogadores Online: NAT Tipo 3",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O NAT é como um porteiro. Se você tem NAT Restrito (Tipo 3), o porteiro do seu roteador bloqueia conexões externas que o jogo precisa para falar com os outros jogadores. Isso resulta em demora para achar partidas, impossibilidade de conversar por voz ou ser desconectado do nada. Para resolver isso em 2026, você precisa ensinar ao roteador quais portas ele deve deixar "liberadas".
        </p>
      `
        },
        {
            title: "1. IP Fixo (O Passo Obrigatório)",
            content: `
        <p class="mb-4 text-gray-300">Antes de abrir portas, seu PC ou Console precisa ter um IP que nunca mude:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Vá em Configurações de Rede do Windows > Propriedades da Ethernet.</li>
            <li>Em 'Atribuição de IP', mude para 'Manual'.</li>
            <li>Defina um IP alto (Ex: <code>192.168.1.150</code>) para evitar conflitos com celulares da casa.</li>
            <li>A máscara de sub-rede costuma ser <code>255.255.255.0</code> e o Gateway é o IP do seu roteador.</li>
        </ol>
      `
        },
        {
            title: "2. Encaminhamento de Portas (Port Forwarding)",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Configurando o Roteador:</h4>
            <p class="text-sm text-gray-300">
                Acesse o painel do seu roteador (geralmente <code>192.168.1.1</code>). Procure por <strong>'Port Forwarding'</strong> ou 'Encaminhamento'. <br/><br/>
                Para a <strong>Steam</strong>, você deve abrir:<br/>
                - UDP: 27000 a 27015, 27015 a 27030 <br/>
                - TCP: 27014 a 27050 <br/><br/>
                Coloque o IP do seu PC no campo 'Internal IP' e salve.
            </p>
        </div>
      `
        },
        {
            title: "3. DMZ: O Último Recurso",
            content: `
        <p class="mb-4 text-gray-300">
            Se abrir portas não funcionou, existe a <strong>DMZ (Zona Desmilitarizada)</strong>. Ela coloca seu dispositivo "fora" do firewall do roteador. 
            <br/><br/><strong>Atenção:</strong> É seguro para consoles (PS5/Xbox), mas <strong>perigoso para o Windows</strong>, pois deixa seu PC vulnerável a ataques diretos da internet. Use apenas se souber o que está fazendo e tiver um bom antivírus.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/configuracao-roteador-wifi",
            title: "Configurar Roteador",
            description: "Acesse o painel do seu aparelho."
        },
        {
            href: "/guias/reduzir-ping-jogos-online",
            title: "Reduzir Ping",
            description: "Melhore a qualidade da sua conexão bruta."
        },
        {
            href: "/guias/firewall-configuracao",
            title: "Firewall Windows",
            description: "Libere o jogo também no Windows."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="30 min"
            difficultyLevel="Avançado"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
