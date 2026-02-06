import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'como-limpar-cache-dns-ip-flushdns',
  title: "Comandos de Rede CMD: FlushDNS, Release, Renew e Winsock (2026)",
  description: "Internet lenta ou sites não carregam? Aprenda os 5 comandos sagrados do CMD (ipconfig, netsh winsock reset) para redefinir sua conexão e corrigir erros de DNS.",
  category: 'rede-seguranca',
  difficulty: 'Iniciante',
  time: '10 min'
};

const title = "Guia CMD de Rede: Como Resetar IP e Limpar Cache DNS Completamente";
const description = "Resolva problemas de 'Não foi possível encontrar o endereço DNS', ping alto e desconexões em jogos com comandos simples no Prompt de Comando.";

const keywords = [
  'ipconfig flushdns para que serve',
  'como renovar ip cmd release renew',
  'netsh winsock reset catálogo',
  'limpar cache dns windows 11',
  'internet conectada mas não navega cmd',
  'resetar pilha tcp ip netsh int ip reset',
  'resolver erro dns probe finished nxdomain',
  'script bat para limpar internet'
];

export const metadata: Metadata = createGuideMetadata('como-limpar-cache-dns-ip-flushdns', title, description, keywords);

export default function FlushDNSGuide() {
  const summaryTable = [
    { label: "Ferramenta", value: "CMD (Administrador)" },
    { label: "Comando 1", value: "ipconfig /flushdns" },
    { label: "Comando 2", value: "netsh winsock reset" },
    { label: "Resultado", value: "Resolução de Nomes Nova" },
    { label: "Risco", value: "Zero" },
    { label: "Reinício", value: "Necessário após Winsock" }
  ];

  const contentSections = [
    {
      title: "O que é Cache DNS e por que limpar?",
      content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O Windows guarda uma lista de sites que você visitou (ex: www.google.com -> 142.250.78.100) para carregar mais rápido na próxima vez. Se o IP do site mudar ou se o arquivo cache corromper, você verá erros como "DNS_PROBE_FINISHED_NXDOMAIN" ou jogos que não conectam. O "FlushDNS" joga essa lista no lixo e força o Windows a perguntar o caminho novo.
        </p>

        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20 my-8">
            <h4 class="text-[#31A8FF] font-bold mb-3 flex items-center gap-2">
                <span class="text-xl">⚡</span> Network Reset Voltris
            </h4>
            <p class="text-gray-300 mb-4">
                Executar 5 comandos no CMD toda vez que a internet cai é trabalhoso. O <strong>Voltris Optimizer</strong> tem um botão "Network Reset" que executa toda a sequência de limpeza (IP, DNS, Winsock, Proxy) e reinicia o adaptador de rede automaticamente.
            </p>
            <a href="/voltrisoptimizer" class="group relative inline-flex px-8 py-3 bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-white font-bold text-base rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-[1.03] hover:shadow-[0_0_60px_rgba(139,49,255,0.4)] items-center justify-center gap-2">
                Resetar Rede Agora
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
            </a>
        </div>
      `
    },
    {
      title: "Passo 1: A Sequência Sagrada (IP e DNS)",
      content: `
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4 bg-[#0A0A0F] p-4 rounded-xl border border-white/5 font-mono text-sm">
            <li>Abra o CMD como <strong>Administrador</strong>.</li>
            <li>Libere seu IP atual (desconecta a internet momentaneamente):<br/>
                <code class="text-[#31A8FF]">ipconfig /release</code>
            </li>
            <li>Limpe o cache DNS:<br/>
                <code class="text-[#31A8FF]">ipconfig /flushdns</code>
            </li>
            <li>Peça um novo IP ao roteador:<br/>
                <code class="text-[#31A8FF]">ipconfig /renew</code>
            </li>
        </ol>
      `
    },
    {
      title: "Passo 2: Resetando o Winsock (Erros Graves)",
      content: `
        <p class="mb-4 text-gray-300">
            Se o passo 1 não resolveu, pode haver corrupção no Socket do Windows (API que softwares usam para acessar a rede). Isso é comum após remover vírus ou desinstalar VPNs.
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4 font-mono text-sm">
            <li>No mesmo CMD, digite:<br/>
                <code class="text-[#31A8FF]">netsh winsock reset</code>
            </li>
            <li>Resete a pilha TCP/IP:<br/>
                <code class="text-[#31A8FF]">netsh int ip reset</code>
            </li>
            <li><strong>REINICIE O COMPUTADOR.</strong> (Obrigatório).</li>
        </ul>
      `
    }
  ];

  const advancedContentSections = [
    {
      title: "Script .BAT Automático",
      content: `
            <div class="bg-gray-800/50 p-6 rounded-xl border border-gray-700 mb-8">
                <h4 class="text-green-400 font-bold mb-4 text-xl">Crie seu próprio reparador</h4>
                <p class="text-gray-300 mb-4">
                    Abra o Bloco de Notas, cole os comandos abaixo e salve como <code>RepararNet.bat</code>. Execute sempre que a net cair.
                </p>
                <div class="bg-black p-4 rounded text-xs font-mono text-gray-300">
                    @echo off<br/>
                    ipconfig /release<br/>
                    ipconfig /flushdns<br/>
                    ipconfig /renew<br/>
                    netsh winsock reset<br/>
                    echo Limpeza Concluida!<br/>
                    pause
                </div>
            </div>
            `
    }
  ];

  const additionalContentSections = [
    {
      title: "Erro: 'A operação solicitada requer elevação'",
      content: `
            <p class="mb-4 text-gray-300">
                Se aparecer essa mensagem, você esqueceu de abrir o CMD como <strong>Administrador</strong>. Clique com botão direito no ícone do Prompt de Comando e escolha "Executar como administrador".
            </p>
            `
    }
  ];

  const faqItems = [
    {
      question: "FlushDNS melhora o ping?",
      answer: "Não diretamente. Ele resolve problemas de conexão (não conseguir logar, site não abrir). O ping depende da rota física, mas um cache DNS limpo evita 'engasgos' iniciais ao resolver o IP do servidor."
    },
    {
      question: "Com que frequência devo fazer isso?",
      answer: "Só quando tiver problemas. Não há benefício em fazer todo dia, pois o Windows terá que reconstruir o cache (o que gasta alguns milissegundos a mais na primeira vez que você entra num site)."
    },
    {
      question: "O comando netsh int ip reset falhou?",
      answer: "Às vezes dá 'Acesso Negado' em uma das linhas. É um bug conhecido do Windows relacionado ao Registro. Geralmente pode ser ignorado se o 'netsh winsock reset' funcionou."
    }
  ];

  const externalReferences = [
    { name: "Microsoft - Reset TCP/IP", url: "https://support.microsoft.com/en-us/topic/how-to-reset-tcp-ip-by-using-the-netshell-utility-d954430c-9b11-43f0-6081-0fc9235a8b4a" }
  ];

  const relatedGuides = [
    {
      href: "/guias/melhor-dns-jogos-2026",
      title: "Melhor DNS",
      description: "Depois de limpar, configure o 1.1.1.1."
    },
    {
      href: "/guias/reduzir-ping-regedit-cmd-jogos",
      title: "Otimizar Ping",
      description: "Ajustes avançados de TCPNoDelay."
    },
    {
      href: "/guias/problemas-conexao-wifi-causa-solucao",
      title: "Wi-Fi Caindo",
      description: "Diagnóstico de hardware e sinal."
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
      advancedContentSections={advancedContentSections}
      additionalContentSections={additionalContentSections}
      summaryTable={summaryTable}
      relatedGuides={relatedGuides}
      faqItems={faqItems}
      externalReferences={externalReferences}
    />
  );
}
