import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';
import FAQSchema, { dnsFAQs } from '@/components/FAQSchema';

export const guideMetadata = {
    id: 'melhor-dns-jogos-2026',
    title: "DNS para Jogos: REDUZA PING AGORA! (Teste 2026)",
    description: "Cansado de desconectar do LoL/Valorant? Descubra qual DNS (Cloudflare vs Google) realmente reduz lag e evita quedas. Configuração em 2 minutos para jogos online!",
    category: 'rede-seguranca',
    difficulty: 'Iniciante',
    time: '15 min'
};

const title = "DNS para Jogos: REDUZA PING AGORA! (Teste 2026)";
const description = "Cansado de desconectar do LoL/Valorant? Descubra qual DNS (Cloudflare vs Google) realmente reduz lag e evita quedas. Configuração em 2 minutos para jogos online!";

const keywords = [
    'melhor dns para jogos 2026 brasil',
    'dns cloudflare 1.1.1.1 vs google 8.8.8.8',
    'reduzir ping mudando dns verdade ou mito',
    'como configurar dns windows 11 ipv4',
    'dns seguro contra ddos jogos',
    'opendns gaming settings',
    'quad9 dns vale a pena',
    'dns benchmark teste velocidade'
];

export const metadata: Metadata = createGuideMetadata('melhor-dns-jogos-2026', title, description, keywords);

export default function DNSGuide() {
    const summaryTable = [
        { label: "Vencedor Geral", value: "Cloudflare (1.1.1.1)" },
        { label: "Melhor Estabilidade", value: "Google (8.8.8.8)" },
        { label: "Mito", value: "DNS não baixa Ping (na partida)" },
        { label: "Realidade", value: "DNS resolve Login/Lobby" },
        { label: "Configuração", value: "IPv4 nas Propriedades de Rede" },
        { label: "Alternativa", value: "Quad9 (Segurança)" }
    ];

    const contentSections = [
        {
            title: "DNS Baixa Ping? A Verdade Definitiva",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Existe um mito enorme de que trocar o DNS vai baixar seu ping de 50ms para 20ms dentro do jogo. <strong>Isso é falso.</strong> O DNS (Domain Name System) é a lista telefônica da internet; ele converte "riotgames.com" em um número IP.
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed">
          Uma vez que o jogo conecta na partida pelo IP do servidor, o DNS não é mais usado. PORÉM, um DNS ruim (geralmente o padrão da sua operadora/ISP) causa demora para abrir o jogo, erros de "Falha ao conectar ao chat", falhas no login e quedas no Lobby. Por isso, usar um DNS premium é essencial.
        </p>

        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20 my-8">
            <h4 class="text-[#31A8FF] font-bold mb-3 flex items-center gap-2">
                <span class="text-xl">🌐</span> Auto-DNS no Voltris Optimizer
            </h4>
            <p class="text-gray-300 mb-4">
                Não sabe qual DNS é mais rápido na sua cidade? O <strong>Voltris Optimizer</strong> faz um teste de ping em tempo real para os principais servidores (Cloudflare, Google, Level3) e aplica automaticamente o mais rápido para o seu adaptador de rede com um clique.
            </p>
            <a href="/voltrisoptimizer" class="group relative inline-flex px-8 py-3 bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-white font-bold text-base rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-[1.03] hover:shadow-[0_0_60px_rgba(139,49,255,0.4)] items-center justify-center gap-2">
                Otimizar DNS Agora
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
            </a>
        </div>
      `
        },
        {
            title: "Os Grandes Players: Comparativo 2026",
            content: `
        <p class="mb-4 text-gray-300">
            Qual você deve escolher?
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="bg-[#0A0A0F] p-6 rounded-xl border border-orange-500/20">
                <h4 class="text-orange-400 font-bold mb-2 flex items-center gap-2">Cloudflare (1.1.1.1)</h4>
                <p class="text-gray-400 text-sm mb-4">
                    Focado em privacidade e velocidade pura. Geralmente é o mais rápido do mundo (14ms de resposta média global).
                </p>
                <ul class="text-xs text-gray-500 font-mono space-y-1">
                    <li>Primário: 1.1.1.1</li>
                    <li>Secundário: 1.0.0.1</li>
                </ul>
            </div>

            <div class="bg-[#0A0A0F] p-6 rounded-xl border border-blue-500/20">
                <h4 class="text-blue-400 font-bold mb-2 flex items-center gap-2">Google (8.8.8.8)</h4>
                <p class="text-gray-400 text-sm mb-4">
                    O mais confiável. Nunca cai. Se o Cloudflare falhar, o Google é a melhor opção de backup. Levemente mais lento, mas extremamente robusto.
                </p>
                <ul class="text-xs text-gray-500 font-mono space-y-1">
                    <li>Primário: 8.8.8.8</li>
                    <li>Secundário: 8.8.4.4</li>
                </ul>
            </div>
        </div>
      `
        },
        {
            title: "Como Configurar DNS no Windows 11 (Passo a Passo)",
            content: `
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4">
            <li>Pressione <strong>Win + R</strong> para abrir o Executar.</li>
            <li>Digite <code>ncpa.cpl</code> e dê Enter. (Isso abre as Conexões de Rede direto).</li>
            <li>Clique com botão direito no seu adaptador (Ethernet ou Wi-Fi) > <strong>Propriedades</strong>.</li>
            <li>Na lista, procure por <strong>Protocolo IP Versão 4 (TCP/IPv4)</strong>. Dê duplo clique.</li>
            <li>Na parte inferior, marque <strong>"Usar os seguintes endereços de servidor DNS"</strong>.</li>
            <li>Digite os números (ex: 1.1.1.1 e 1.0.0.1).</li>
            <li>Clique em OK, e OK novamente.</li>
            <li>Abra o CMD (Prompt) e digite <code>ipconfig /flushdns</code> para limpar o cache antigo.</li>
        </ol>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "DNS Over HTTPS (DoH): O Futuro",
            content: `
            <div class="bg-gray-800/50 p-6 rounded-xl border border-gray-700 mb-8">
                <h4 class="text-purple-400 font-bold mb-4 text-xl">🔒 Criptografia de Navegação</h4>
                <p class="text-gray-300 mb-4">
                    O DNS normal envia seus pedidos em texto puro (seu provedor sabe quais sites você acessa). O DoH criptografa isso.
                </p>
                <p class="text-gray-300 text-sm">
                    No Windows 11, você pode ativar isso nativamente: Configurações > Rede e Internet > Ethernet > Atribuição de servidor DNS > Editar > Selecione "Criptografado (DNS sobre HTTPS)" no modelo. Melhora a privacidade, mas adiciona alguns milissegundos de latência. Para jogos competitivos, prefira o modo padrão (não criptografado) pela velocidade.
                </p>
            </div>
            `
        }
    ];

    const additionalContentSections = [
        {
            title: "DNS Benchmark Tool",
            content: `
            <p class="mb-4 text-gray-300">
                Não confie cegamente. Baixe o software gratuito <strong>DNS Jumper</strong> ou <strong>DNS Benchmark (Gibson Research)</strong>. Eles testam 50 servidores DNS a partir DA SUA casa e te mostram qual é o mais rápido para a sua rota específica. Às vezes, o OpenDNS (208.67.222.222) ganha do Google na sua região.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Mudar DNS dá banimento?",
            answer: "Jamais. DNS é uma configuração básica de rede. Nenhum jogo bane por isso."
        },
        {
            question: "Posso usar DNS diferente no PC e no Roteador?",
            answer: "Sim, e é recomendado. Configure o DNS direto no Windows do seu PC para garantir. Se você configurar no Roteador, todos os celulares da casa usarão, o que é bom, mas configurar no Windows tem prioridade sobre o roteador."
        },
        {
            question: "IPv6 precisa de DNS novo?",
            answer: "Sim. Se você usa IPv6, o Cloudflare é: 2606:4700:4700::1111."
        }
    ];

    const externalReferences = [
        { name: "Cloudflare 1.1.1.1", url: "https://1.1.1.1/" },
        { name: "Google Public DNS", url: "https://developers.google.com/speed/public-dns" }
    ];

    const relatedGuides = [
        {
            href: "/guias/como-limpar-cache-dns-ip-flushdns",
            title: "Comandos CMD de Rede",
            description: "Aprenda a usar ipconfig, release, renew e flushdns."
        },
        {
            href: "/guias/reduzir-ping-regedit-cmd-jogos",
            title: "Reduzir Ping",
            description: "Otimizações de registro que realmente funcionam."
        },
        {
            href: "/guias/configuracao-roteador-wifi",
            title: "Configurar Roteador",
            description: "DMZ, UPnP e Port Forwarding explicados."
        }
    ];

    return (
        <>
            <FAQSchema faqs={dnsFAQs} />
            <GuideTemplate
                title={title}
                description={description}
                keywords={keywords}
                estimatedTime="15 min"
                difficultyLevel="Iniciante"
                contentSections={contentSections}
                advancedContentSections={advancedContentSections}
                additionalContentSections={additionalContentSections}
                summaryTable={summaryTable}
                relatedGuides={relatedGuides}
                faqItems={faqItems}
                externalReferences={externalReferences}
            />
        </>
    );
}
