import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Como Reduzir o Ping em Jogos Online (Guia 2026) - Voltris";
const description = "Tutorial completo para diminuir a latência (ping) em jogos online competitivos. Configurações de DNS, Ethernet, Registry e Roteador.";
const keywords = ['reduzir ping jogos', 'diminuir lag jogos online', 'otimizar internet jogos', 'melhor dns jogos', 'no ping', 'lag spike', 'packet loss'];

export const metadata: Metadata = createGuideMetadata('reduzir-ping-jogos-online', title, description, keywords);

export default function ReduzirPingGuide() {
    const summaryTable = [
        { label: "Dificuldade", value: "Intermediário" },
        { label: "Tempo Médio", value: "40 min" },
        { label: "Impacto", value: "Alto" }
    ];

    const faqItems = [
        {
            question: "Wi-Fi 5GHz é bom para jogar?",
            answer: "É melhor que o 2.4GHz, mas <strong>nunca será melhor que o cabo</strong>. O Wi-Fi sofre interferência natural. Para jogos competitivos (Valorant, CS2, LoL), o cabo Ethernet (CAT5e ou superior) é obrigatório para estabilidade."
        },
        {
            question: "ExitLag e NoPing realmente funcionam?",
            answer: "Depende da sua rota. Esses programas são 'túneis' (VPNs otimizadas). Se o problema for a rota física que sua operadora faz até o servidor do jogo, eles podem ajudar muito. Se o problema for sua internet local ruim, eles não farão milagre."
        },
        {
            question: "Qual o ping ideal?",
            answer: "Para jogos FPS competitivos, abaixo de <strong>20ms</strong> é ideal. Até 50ms é aceitável. Acima de 80ms, você já começa a sentir desvantagem real."
        }
    ];

    const contentSections = [
        {
            title: "Entendendo o Ping e Latência",
            content: `
        <p class="mb-4">Ping é o tempo (em milissegundos) que um pacote de dados leva para sair do seu PC, chegar ao servidor do jogo e voltar. Não confunda com velocidade de download. Você pode ter 1GB de internet e ter ping alto.</p>
        
        <div class="bg-[#1c1c1e] border-l-4 border-[#FF4B6B] p-4 my-6 rounded-r-lg">
          <p class="text-[#FF4B6B] font-bold text-sm mb-1 uppercase tracking-wider">Mito Comum</p>
          <p class="text-gray-300 italic">"Vou aumentar minha internet de 300MB para 600MB para melhorar o ping." -> <strong>Mentira.</strong> A largura de banda raramente afeta o ping, a menos que sua rede esteja congestionada por outros usuários.</p>
        </div>
      `,
            subsections: []
        },
        {
            title: "1. A Regra de Ouro: Cabo Ethernet",
            content: `
        <p class="mb-4">Antes de mexer em qualquer configuração, elimine o Wi-Fi. O Wi-Fi funciona por ondas de rádio, sujeitas a interferência de paredes, micro-ondas e vizinhos. O cabo Ethernet é blindado e direto.</p>
        <p class="text-gray-300 mb-2">Compre um cabo <strong>CAT6</strong> (custa barato no Mercado Livre ou Amazon). Só essa mudança pode reduzir spikes de lag de 100ms para 0ms.</p>
      `
        },
        {
            title: "2. Otimizando o Adaptador de Rede no Windows",
            content: `
        <p class="mb-4">O Windows vem configurado para economizar energia, o que é péssimo para jogos. Vamos ajustar:</p>
      `,
            subsections: [
                {
                    subtitle: "Desligar Economia de Energia",
                    content: `
            <ol class="space-y-3 text-gray-300 list-decimal list-inside ml-4 mb-6">
              <li>Clique com botão direito no Iniciar > <strong>Gerenciador de Dispositivos</strong>.</li>
              <li>Abra "Adaptadores de Rede", ache sua placa (Realtek, Intel, Killer).</li>
              <li>Clique com botão direito > Propriedades > Aba <strong>Gerenciamento de Energia</strong>.</li>
              <li><strong>Desmarque</strong> a opção "O computador pode desligar o dispositivo para economizar energia".</li>
            </ol>
          `
                },
                {
                    subtitle: "Desativar Interrupção de Moderação (Interrupt Moderation)",
                    content: `
            <p class="text-gray-300 mb-2">Na mesma janela, vá na aba <strong>Avançado</strong>. Procure na lista por "Interrupt Moderation" (ou Moderação de Interrupção) e coloque em <strong>Disabled</strong>.</p>
            <p class="text-xs text-gray-500">Isso faz a CPU processar os pacotes de rede imediatamente, reduzindo a latência, embora aumente levemente o uso da CPU (irrelevante em PCs modernos).</p>
          `
                }
            ]
        },
        {
            title: "3. Trocando o DNS (Google vs Cloudflare)",
            content: `
        <p class="mb-4">O DNS é a lista telefônica da internet. Um DNS rápido resolve conexões mais depressa. Recomendamos o Cloudflare (1.1.1.1) para jogos.</p>
        <ul class="space-y-2 text-gray-300 list-none ml-4 bg-[#121218] p-4 rounded text-sm font-mono">
          <li><strong>Cloudflare DNS (Focado em velocidade):</strong><br/>Primário: 1.1.1.1<br/>Secundário: 1.0.0.1</li>
          <br/>
          <li><strong>Google DNS (Estabilidade):</strong><br/>Primário: 8.8.8.8<br/>Secundário: 8.8.4.4</li>
        </ul>
        <p class="mt-4 mb-2 text-gray-300">Para alterar: Configurações > Rede e Internet > Ethernet > Editar atribuição de servidor DNS.</p>
      `
        },
        {
            title: "4. TCP Optimizer (Ferramenta Avançada)",
            content: `
        <p class="mb-4">O Windows usa configurações TCP padrão de décadas atrás. Existe uma ferramenta gratuita e segura chamada <strong>TCP Optimizer</strong> (da SpeedGuide.net) que ajusta esses valores.</p>
        <ol class="space-y-3 text-gray-300 list-decimal list-inside ml-4">
          <li>Baixe o TCP Optimizer 4 (execute como Administrador).</li>
          <li>Deslize a barra de velocidade para a velocidade da sua internet.</li>
          <li>Selecione a opção "Optimal" lá embaixo.</li>
          <li>Clique em "Apply Changes" e reinicie o PC.</li>
        </ol>
        <p class="text-sm text-gray-400 mt-2">Isso ajusta o MTU, RWIN e desativa o algoritmo de Nagle, essencial para jogos.</p>
      `
        },
        {
            title: "5. Comandos de Prompt (FlushDNS)",
            content: `
        <p class="mb-4">As vezes o cache de rede fica corrompido. Abra o CMD como Admin e rode:</p>
        <code class="block bg-[#121218] p-3 rounded text-[#31FF8B] font-mono text-sm mb-2">
          ipconfig /flushdns<br/>
          ipconfig /release<br/>
          ipconfig /renew<br/>
          netsh winsock reset
        </code>
        <p class="text-gray-300">Reinicie o computador após os comandos.</p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/configuracao-roteador-wifi",
            title: "Configurar Roteador para Máxima Performance",
            description: "Ajuste canais e configurações do seu aparelho Wi-Fi."
        },
        {
            href: "/guias/otimizacao-performance",
            title: "Otimizar PC para Jogos",
            description: "Garanta que seu FPS esteja alto para acompanhar o ping baixo."
        },
        {
            href: "/guias/teste-velocidade-internet",
            title: "Como Testar Sua Internet Corretamente",
            description: "Entenda o que é Jitter e Packet Loss."
        }
    ];

    const externalReferences = [
        { name: "SpeedGuide.net (TCP Optimizer)", url: "https://www.speedguide.net/downloads.php" },
        { name: "Cloudflare 1.1.1.1", url: "https://1.1.1.1/" },
        { name: "Intel Network Adapter Settings", url: "https://www.intel.com/content/www/us/en/support/articles/000005593/network-and-i-o/ethernet-products.html" },
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="40 minutos"
            difficultyLevel="Intermediário"
            contentSections={contentSections}
            relatedGuides={relatedGuides}
            summaryTable={summaryTable}
            faqItems={faqItems}
            externalReferences={externalReferences}
        />
    );
}
