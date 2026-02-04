import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Ajustes de Registro (Regedit) para Reduzir o Ping (2026)";
const description = "Quer o menor atraso possível? Aprenda a modificar o Registro do Windows e usar comandos CMD para otimizar o TCP/IP e ganhar vantagem nos jogos em 2026.";
const keywords = [
    'reduzir ping regedit windows 11 tutorial 2026',
    'otimizar tcp noakcl regedit games guia',
    'comandos cmd para melhorar internet jogos 2026',
    'desativar algoritimo de nagle windows 11 tutorial',
    'ajuste de rede avançado regedit valorant cs2'
];

export const metadata: Metadata = createGuideMetadata('reduzir-ping-regedit-cmd-jogos', title, description, keywords);

export default function AdvancedPingFixGuide() {
    const summaryTable = [
        { label: "Ajuste Principal", value: "TCPNoDelay (Algoritmo de Nagle)" },
        { label: "Comando Vital", value: "netsh int tcp set global autotuninglevel" },
        { label: "Ferramenta Pro", value: "TCP Optimizer" },
        { label: "Dificuldade", value: "Alta" }
    ];

    const contentSections = [
        {
            title: "Otimização no Nível do Protocolo",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O Windows 11 não vem configurado para jogadores por padrão. Ele usa o **Algoritmo de Nagle**, que segura pequenos pacotes de dados para enviá-los em um "lote" maior, economizando largura de banda. Em 2026, isso é péssimo para jogos, pois causa um pequeno atraso (delay) em cada ação que você faz. Ao mexer no registro, forçamos o Windows a enviar cada pacote no exato momento em que ele é gerado.
        </p>
      `
        },
        {
            title: "1. Desativando o Algoritmo de Nagle (Regedit)",
            content: `
        <p class="mb-4 text-gray-300">Este é o ajuste mais famoso para MMORPGs e jogos competitivos:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Aperte <strong>Win + R</strong> e digite <code>regedit</code>.</li>
            <li>Vá em: <code>HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters\\Interfaces</code>.</li>
            <li>Encontre a pasta que contém o seu endereço de IP (geralmente a com mais arquivos).</li>
            <li>Crie dois valores DWORD (32 bits) chamados: <strong>TcpAckFrequency</strong> e <strong>TCPNoDelay</strong>.</li>
            <li>Mude o valor de ambos para <strong>1</strong>. Reinicie o PC.</li>
        </ol>
      `
        },
        {
            title: "2. Comandos CMD: Otimizando o TCP/IP",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Poder do Prompt:</h4>
            <p class="text-sm text-gray-300">
                Abra o CMD como Administrador e digite: <br/><br/>
                - <code>netsh int tcp set global autotuninglevel=disabled</code> (Evita que o Windows tente gerenciar janelas de recebimento dinâmico). <br/>
                - <code>netsh int tcp set global chimney=enabled</code> (Descarrega o processamento do TCP para a placa de rede). <br/>
                - <code>netsh int tcp set global ecncapability=disabled</code> (Reduz latência em roteadores de 2026 que não suportam ECN).
            </p>
        </div>
      `
        },
        {
            title: "3. Aviso de Segurança",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>Cuidado:</strong> Mexer no registro pode causar instabilidades se feito incorretamente. 
            <br/><br/>Antes de aplicar esses ajustes, crie sempre um **Ponto de Restauração**. Embora esses comandos melhorem o ping, em algumas conexões de fibra óptica de baixa qualidade, eles podem causar instabilidade no download. Se sentir que sua velocidade de download caiu muito, volte as configurações para o padrão (Autotuninglevel=normal).
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/criar-ponto-restauracao-windows",
            title: "Criar Restauração",
            description: "Segurança antes de mexer no Regedit."
        },
        {
            href: "/guias/reduzir-ping-jogos-online",
            title: "Guia de Ping",
            description: "Dicas de hardware e cabos."
        },
        {
            href: "/guias/melhor-dns-jogos-2026",
            title: "Melhores DNS",
            description: "Acompanhe os ajustes de registro com o DNS certo."
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
