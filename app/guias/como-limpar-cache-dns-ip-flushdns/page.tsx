import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'como-limpar-cache-dns-ip-flushdns',
  title: "Como Limpar o Cache do DNS (FlushDNS) no Windows 11 (2026)",
  description: "Sites não carregam ou ping alto nos jogos? Aprenda como limpar o cache do DNS e resetar seu IP no Windows 11 usando comandos rápidos em 2026.",
  category: 'rede-seguranca',
  difficulty: 'Iniciante',
  time: '5 min'
};

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

    const advancedContentSections = [
    {
      title: "Fundamentos de DNS e Arquitetura de Resolução de Nomes",
      content: `
        <h4 class="text-white font-bold mb-3">🌐 Arquitetura do Sistema de Nomes de Domínio (DNS)</h4>
        <p class="mb-4 text-gray-300">
          O Domain Name System (DNS) é um sistema hierárquico e distribuído que traduz nomes de domínio legíveis por humanos (como www.exemplo.com) em endereços IP numéricos (como 192.168.1.1). Em 2026, a arquitetura DNS envolve múltiplos níveis e tipos de servidores que trabalham em conjunto para resolver nomes de domínio:
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div class="bg-blue-900/10 p-4 rounded-lg border border-blue-500/20">
            <h5 class="text-blue-400 font-bold mb-2">Hierarquia do DNS</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>• Root Servers (. - nível raiz)</li>
              <li>• Top-Level Domain (TLD) Servers (.com, .org, .net)</li>
              <li>• Authoritative Name Servers (domínio específico)</li>
              <li>• Recursive Resolvers (servidores DNS locais)</li>
              <li>• Stub Resolvers (resolução local no cliente)</li>
              <li>• Caching Resolvers (servidores com cache)</li>
            </ul>
          </div>
          <div class="bg-purple-900/10 p-4 rounded-lg border border-purple-500/20">
            <h5 class="text-purple-400 font-bold mb-2">Tipos de Registros DNS</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>• A Record (IPv4 Address)</li>
              <li>• AAAA Record (IPv6 Address)</li>
              <li>• CNAME (Canonical Name)</li>
              <li>• MX Record (Mail Exchange)</li>
              <li>• NS Record (Name Server)</li>
              <li>• TXT Record (Text Records)</li>
            </ul>
          </div>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">📊 Processo de Resolução DNS</h4>
        <p class="mb-4 text-gray-300">
          O processo de resolução DNS envolve múltiplas etapas e interações entre diferentes servidores:
        </p>
        
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-gray-300 border border-gray-700 rounded-lg">
            <thead class="bg-gray-800">
              <tr>
                <th class="p-3 text-left">Etapa</th>
                <th class="p-3 text-left">Descrição</th>
                <th class="p-3 text-left">Tempo Médio</th>
                <th class="p-3 text-left">Caching</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-t border-gray-700">
                <td class="p-3">1</td>
                <td class="p-3">Consulta do Stub Resolver</td>
                <td class="p-3">0.1-0.5ms</td>
                <td class="p-3">Cliente Local</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3">2</td>
                <td class="p-3">Consulta ao Recursive Resolver</td>
                <td class="p-3">5-50ms</td>
                <td class="p-3">ISP/Local</td>
              </tr>
              <tr class="border-t border-gray-700">
                <td class="p-3">3</td>
                <td class="p-3">Consulta Root Server</td>
                <td class="p-3">20-100ms</td>
                <td class="p-3">Global</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3">4</td>
                <td class="p-3">Consulta TLD Server</td>
                <td class="p-3">20-100ms</td>
                <td class="p-3">Global</td>
              </tr>
              <tr class="border-t border-gray-700">
                <td class="p-3">5</td>
                <td class="p-3">Consulta Authoritative Server</td>
                <td class="p-3">10-80ms</td>
                <td class="p-3">Domain Owner</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="bg-amber-900/10 p-5 rounded-xl border border-amber-500/20 mt-6">
          <h4 class="text-amber-400 font-bold mb-2">🔍 Fato Técnico Importante</h4>
          <p class="text-sm text-gray-300">
            Cada registro DNS tem um TTL (Time To Live) que determina por quanto tempo pode ser mantido em cache. Em 2026, com a proliferação de microservices e infraestrutura dinâmica, os TTLs tendem a ser mais curtos para permitir respostas mais rápidas a mudanças de infraestrutura.
          </p>
        </div>
      `
    },
    {
      title: "Cache DNS no Windows e Ferramentas Avançadas",
      content: `
        <h4 class="text-white font-bold mb-3">🔧 Arquitetura do Cache DNS no Windows 11</h4>
        <p class="mb-4 text-gray-300">
          O Windows 11 implementa um sistema de cache DNS sofisticado que opera em múltiplos níveis, desde o cache do sistema operacional até caches de aplicativos individuais:
        </p>
        
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-gray-300 border border-gray-700 rounded-lg">
            <thead class="bg-gray-800">
              <tr>
                <th class="p-3 text-left">Nível</th>
                <th class="p-3 text-left">Localização</th>
                <th class="p-3 text-left">Tipo</th>
                <th class="p-3 text-left">Tempo de Vida</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-t border-gray-700">
                <td class="p-3">DNS Client Service</td>
                <td class="p-3">Dnscache service</td>
                <td class="p-3">Hostnames, NetBIOS</td>
                <td class="p-3">TTL do registro</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3">WinSock Catalog</td>
                <td class="p-3">Winsock namespace</td>
                <td class="p-3">Resolvers em rede</td>
                <td class="p-3">Aplicação específica</td>
              </tr>
              <tr class="border-t border-gray-700">
                <td class="p-3">Application Cache</td>
                <td class="p-3">Navegadores, apps</td>
                <td class="p-3">Cache interno</td>
                <td class="p-3">Aplicação definida</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3">LLMNR/mDNS Cache</td>
                <td class="p-3">Rede local</td>
                <td class="p-3">Resolução local</td>
                <td class="p-3">30-60 minutos</td>
              </tr>
              <tr class="border-t border-gray-700">
                <td class="p-3">Link-Local Cache</td>
                <td class="p-3">IPs locais</td>
                <td class="p-3">Endereços locais</td>
                <td class="p-3">15-30 minutos</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">⚙️ Comandos e Ferramentas Avançadas</h4>
        <p class="mb-4 text-gray-300">
          Comandos e ferramentas avançadas para diagnóstico e gerenciamento de DNS no Windows 11:
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="bg-green-900/10 p-4 rounded-lg border border-green-500/20">
            <h5 class="text-green-400 font-bold mb-2">Comandos de Diagnóstico</h5>
            <ul class="text-sm text-gray-300 space-y-1">
              <li>ipconfig /displaydns</li>
              <li>nslookup dominio.com</li>
              <li>dnscmd /info</li>
              <li>netsh dns show state</li>
            </ul>
          </div>
          
          <div class="bg-cyan-900/10 p-4 rounded-lg border border-cyan-500/20">
            <h5 class="text-cyan-400 font-bold mb-2">Comandos de Limpeza</h5>
            <li>ipconfig /flushdns</li>
            <li>ipconfig /registerdns</li>
            <li>netsh winsock reset</li>
            <li>netsh int ip reset</li>
            </ul>
          </div>
          
          <div class="bg-indigo-900/10 p-4 rounded-lg border border-indigo-500/20">
            <h5 class="text-indigo-400 font-bold mb-2">Ferramentas de Análise</h5>
            <ul class="text-sm text-gray-300 space-y-1">
              <li>PowerShell DNS Commands</li>
              <li>Resource Monitor DNS</li>
              <li>Event Viewer DNS Logs</li>
              <li>Performance Monitor DNS</li>
            </ul>
          </div>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">🔧 Scripts PowerShell Avançados</h4>
        <p class="mb-4 text-gray-300">
          Exemplos de comandos PowerShell para gerenciamento avançado de DNS:
        </p>
        
        <ul class="list-disc list-inside text-gray-300 space-y-2 mb-6">
          <li><strong>Visualizar cache DNS:</strong> Get-DnsClientCache | Sort-Object Entry</li>
          <li><strong>Limpar cache específico:</strong> Clear-DnsClientCache -Entry &quot;dominio.com&quot;</li>
          <li><strong>Ver servidores DNS:</strong> Get-DnsClientServerAddress | Select-Object InterfaceAlias, ServerAddresses</li>
          <li><strong>Testar resolução:</strong> Resolve-DnsName -Name &quot;google.com&quot; -Type A -Server &quot;8.8.8.8&quot;</li>
          <li><strong>Configurar DNS temporário:</strong> Set-DnsClientServerAddress -InterfaceAlias &quot;Ethernet&quot; -ServerAddresses &quot;8.8.8.8&quot;, &quot;8.8.4.4&quot;</li>
          <li><strong>Ver TTL de registros:</strong> Resolve-DnsName -Name &quot;dominio.com&quot; | Select-Object Name, Type, TimeToLive</li>
        </ul>
      `
    },
    {
      title: "Tecnologias Emergentes em Resolução de Nomes e Segurança de Rede",
      content: `
        <h4 class="text-white font-bold mb-3">🚀 Tecnologias de Resolução de Nomes de Próxima Geração</h4>
        <p class="mb-4 text-gray-300">
          A próxima geração de tecnologias de resolução de nomes está explorando métodos avançados de segurança, eficiência e velocidade:
        </p>
        
        <h4 class="text-white font-bold mb-3">DNS Seguro e Criptografado</h4>
        <p class="mb-4 text-gray-300">
          Novas tecnologias de DNS que estão sendo implementadas para melhorar a segurança e privacidade:
        </p>
        
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-gray-300 border border-gray-700 rounded-lg">
            <thead class="bg-gray-800">
              <tr>
                <th class="p-3 text-left">Tecnologia</th>
                <th class="p-3 text-left">Descrição</th>
                <th class="p-3 text-left">Disponibilidade</th>
                <th class="p-3 text-left">Benefício de Segurança</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-t border-gray-700">
                <td class="p-3">DNS-over-HTTPS (DoH)</td>
                <td class="p-3">DNS sobre conexão HTTPS criptografada</td>
                <td class="p-3">Atual</td>
                <td class="p-3">Protege contra interceptação</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3">DNS-over-TLS (DoT)</td>
                <td class="p-3">DNS sobre conexão TLS criptografada</td>
                <td class="p-3">Atual</td>
                <td class="p-3">Protege contra vigilância</td>
              </tr>
              <tr class="border-t border-gray-700">
                <td class="p-3">DNSSEC</td>
                <td class="p-3">DNS Security Extensions</td>
                <td class="p-3">Atual</td>
                <td class="p-3">Protege contra spoofing</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3">Oblivious DNS (ODoH)</td>
                <td class="p-3">DNS com privacidade total</td>
                <td class="p-3">2026-2027</td>
                <td class="p-3">Protege contra rastreamento</td>
              </tr>
              <tr class="border-t border-gray-700">
                <td class="p-3">DNS-over-QUIC</td>
                <td class="p-3">DNS sobre protocolo QUIC</td>
                <td class="p-3">2026-2028</td>
                <td class="p-3">Melhora velocidade e segurança</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">🤖 Inteligência Artificial em Resolução de Nomes</h4>
        <p class="mb-4 text-gray-300">
          A IA está começando a desempenhar um papel crucial na otimização de resolução de nomes:
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div class="bg-purple-900/10 p-4 rounded-lg border border-purple-500/20">
            <h5 class="text-purple-400 font-bold mb-2">Previsão de Acesso</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>Previsão de domínios acessados</li>
              <li>Pré-carregamento de DNS</li>
              <li>Resolução preditiva</li>
              <li>Otimização de TTL dinâmico</li>
              <li>Balanceamento de carga inteligente</li>
              <li>Detecção de padrões de navegação</li>
            </ul>
          </div>
          
          <div class="bg-amber-900/10 p-4 rounded-lg border border-amber-500/20">
            <h5 class="text-amber-400 font-bold mb-2">Segurança Proativa</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>Detecção de DNS tunneling</li>
              <li>Identificação de domínios maliciosos</li>
              <li>Bloqueio de requisições suspeitas</li>
              <li>Análise de padrões de resolução</li>
              <li>Proteção contra DDoS DNS</li>
              <li>Classificação automática de ameaças</li>
            </ul>
          </div>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">🔬 Pesquisas em Andamento</h4>
        <p class="mb-4 text-gray-300">
          Universidades e empresas de tecnologia estão investindo pesadamente em pesquisa de resolução de nomes de próxima geração:
        </p>
        
        <div class="space-y-4">
          <div class="flex items-start space-x-3">
            <div class="bg-blue-500 rounded-full p-2 mt-1 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h5 class="text-blue-400 font-bold">Blockchain-based DNS</h5>
              <p class="text-sm text-gray-300">Empresas como Cloudflare e projetos como Handshake estão desenvolvendo sistemas de DNS baseados em blockchain que oferecem descentralização e resistência a censura. Esses sistemas eliminam a dependência de autoridades de certificação centralizadas e permitem resolução de nomes mais segura e resistente a ataques. Implementações piloto estão em andamento com previsão de adoção mais ampla para 2026-2027.</p>
            </div>
          </div>
          
          <div class="flex items-start space-x-3">
            <div class="bg-green-500 rounded-full p-2 mt-1 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h5 class="text-green-400 font-bold">Post-Quantum DNS Security</h5>
              <p class="text-sm text-gray-300">Com o avanço da computação quântica, universidades como MIT e institutos de pesquisa estão desenvolvendo protocolos de DNS resistentes a ataques quânticos. Essas tecnologias implementam criptografia pós-quântica para proteger a integridade do sistema DNS contra futuros computadores quânticos capazes de quebrar criptografia RSA e ECC. Implementações experimentais estão previstas para 2026-2028.</p>
            </div>
          </div>
          
          <div class="flex items-start space-x-3">
            <div class="bg-purple-500 rounded-full p-2 mt-1 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h5 class="text-purple-400 font-bold">AI-Powered DNS Optimization</h5>
              <p class="text-sm text-gray-300">Empresas como Google e Cisco estão desenvolvendo sistemas de DNS alimentados por IA que podem prever e otimizar rotas de resolução com base em padrões históricos e condições de rede em tempo real. Esses sistemas aprendem com bilhões de requisições para prever quais servidores DNS responderão mais rapidamente e com maior confiabilidade. Implementações avançadas estão sendo testadas para 2026-2027.</p>
            </div>
          </div>
        </div>
        
        <div class="bg-red-900/10 p-5 rounded-xl border border-red-500/20 mt-6">
          <h4 class="text-red-400 font-bold mb-2">⚠️ Considerações Futuras</h4>
          <p class="text-sm text-gray-300">
            Com o avanço das tecnologias de rede e a crescente preocupação com privacidade e segurança, o DNS tradicional evoluirá para sistemas mais seguros, rápidos e inteligentes. A combinação de criptografia avançada, inteligência artificial e descentralização resultará em uma infraestrutura de resolução de nomes mais resiliente e eficiente. Isso transformará não apenas como os dados são resolvidos e roteados, mas também a própria segurança da internet.
          </p>
        </div>
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

    const additionalContentSections: { title: string; content: string }[] = [];

    const allContentSections = [...contentSections, ...additionalContentSections, ...advancedContentSections];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="5 min"
            difficultyLevel="Iniciante"
            contentSections={allContentSections}
            advancedContentSections={advancedContentSections}
            additionalContentSections={additionalContentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
