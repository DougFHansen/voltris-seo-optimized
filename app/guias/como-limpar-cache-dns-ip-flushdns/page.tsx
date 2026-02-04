import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Como Limpar o Cache do DNS (FlushDNS) no Windows 11 (2026)";
const description = "Sites não carregam ou ping alto nos jogos? Aprenda como limpar o cache do DNS e resetar seu IP no Windows 11 usando comandos rápidos em 2026.";
const keywords = [
    'como limpar cache dns windows 11 flushdns 2026',
    'comando flushdns windows 11 tutorial rapido',
    'resolver problema de internet sites nao carregam guia',
    'resetar ip e dns windows 11 comando cmd tutorial',
    'limpar cache dns navegador chrome edge 2026'
];

export const metadata: Metadata = createGuideMetadata('como-limpar-cache-dns-ip-flushdns', title, description, keywords);

export default function FlushDNSGuide() {
    const summaryTable = [
        { label: "Comando Principal", value: "ipconfig /flushdns" },
        { label: "Quando fazer", value: "Sites não abrem / Lag em conexões novas" },
        { label: "Resultado", value: "Limpa a 'lista telefônica' de endereços da rede" },
        { label: "Dificuldade", value: "Fácil" }
    ];

    const contentSections = [
        {
            title: "O que é o Cache DNS e por que limpá-lo?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O DNS (Domain Name System) funciona como uma lista telefônica da internet. Toda vez que você digita "google.com", o Windows consulta esse banco de dados para encontrar o endereço IP real do servidor. Em 2026, com sites trocando de servidores constantemente, essa "lista" local no seu Windows pode ficar desatualizada ou corrompida, fazendo com que sites parem de carregar ou que você tenha lag ao entrar em partidas online.
        </p>
      `
        },
        {
            title: "1. Comandos de Limpeza no CMD",
            content: `
        <p class="mb-4 text-gray-300">Siga estes passos para "renovar" a sua internet em segundos:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Pesquise por <strong>CMD</strong> no menu Iniciar e execute como administrador.</li>
            <li>Digite o comando: <code>ipconfig /flushdns</code> e dê Enter. (Isso limpa o cache).</li>
            <li>Digite: <code>ipconfig /registerdns</code> e dê Enter. (Isso força a renovação).</li>
            <li>Digite: <code>ipconfig /release</code> seguido de <code>ipconfig /renew</code> para pegar um novo IP do roteador.</li>
        </ol>
      `
        },
        {
            title: "2. Resetando o Catálogo Winsock",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Solução Profunda para 2026:</h4>
            <p class="text-sm text-gray-300">
                Se os comandos acima não funcionarem, os protocolos de rede podem estar "travados". No mesmo CMD aberto como administrador, digite: <br/><br/>
                <code>netsh winsock reset</code> <br/><br/>
                Este comando reseta o catálogo de rede às configurações de fábrica. Atenção: você precisará **reiniciar o computador** logo após este comando para que ele surta efeito.
            </p>
        </div>
      `
        },
        {
            title: "3. Limpando também o DNS do Chrome/Edge",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>Dica Bônus:</strong> 
            <br/><br/>Navegadores modernos em 2026 possuem o seu próprio cache DNS interno independente do Windows. <br/><br/>
            - No Chrome/Edge, digite <code>chrome://net-internals/#dns</code> na barra de endereços. <br/>
            - Clique no botão <strong>'Clear host cache'</strong>. <br/>
            Isso resolve problemas onde um site específico não abre no navegador, mesmo que a internet esteja funcionando para o resto dos programas no PC.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/melhor-dns-jogos-2026",
            title: "Melhor DNS 2026",
            description: "Escolha um DNS rápido como Google ou Cloudflare."
        },
        {
            href: "/guias/reduzir-ping-jogos-online",
            title: "Reduzir Lag",
            description: "Melhore a estabilidade da sua rede."
        },
        {
            href: "/guias/configuracao-roteador-wifi",
            title: "Ajustar Roteador",
            description: "Dicas de hardware para internet rápida."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="5 min"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
