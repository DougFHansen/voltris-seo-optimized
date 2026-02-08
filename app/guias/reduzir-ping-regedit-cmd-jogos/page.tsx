import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'reduzir-ping-regedit-cmd-jogos',
    title: "Reduzir Ping e Lag em Jogos Online: O Guia de Engenharia de Rede (2026)",
    description: "Aprenda a eliminar Bufferbloat, configurar o Regedit para TCP No-Delay e escolher o DNS perfeito para Valorant, CS2 e LoL.",
    category: 'otimizacao',
    difficulty: 'Avançado',
    time: '35 min'
};

const title = "Reduzir Ping e Lag em Jogos Online: O Guia de Engenharia de Rede (2026)";
const description = "Aprenda a eliminar Bufferbloat, configurar o Regedit para TCP No-Delay e escolher o DNS perfeito para Valorant, CS2 e LoL.";
const keywords = [
    'reduzir ping jogos online regedit 2026',
    'bufferbloat test waveform como resolver',
    'melhor dns para jogos brasil 2026',
    'desativar nagle algorithm windows 11',
    'configurar placa de rede para desempenho'
];

export const metadata: Metadata = createGuideMetadata('reduzir-ping-regedit-cmd-jogos', title, description, keywords);

export default function NetworkGuide() {
    const summaryTable = [
        { label: "Principal Inimigo", value: "Bufferbloat (Fila)" },
        { label: "Hardware Ideal", value: "Cabo Ethernet CAT6" },
        { label: "Configuração Chave", value: "SQM (Roteador)" },
        { label: "Tweak Windows", value: "TCP No-Delay" },
        { label: "Tempo Necessário", value: "35 min" }
    ];

    const contentSections = [
        {
            title: "O Mito da Velocidade vs Latência",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Ter 500 Mega de internet não garante ping baixo. Velocidade é a largura da estrada; Latência (Ping) é a velocidade do carro. Se a estrada estiver engarrafada (Bufferbloat), sua Ferrari vai andar a 10km/h. Este guia foca em <strong>Latência</strong>.
        </p>
      `
        },
        {
            title: "Passo 1: Diagnosticando o Bufferbloat",
            content: `
        <p class="mb-4 text-gray-300">
            Bufferbloat acontece quando seu roteador tenta enviar dados demais e cria uma fila. Isso causa aqueles "teleportes" no jogo quando alguém começa a assistir Netflix na sala.
        </p>
        <div class="bg-gray-900 p-6 rounded-xl border border-gray-700">
            <h4 class="text-white font-bold mb-2">O Teste Definitivo</h4>
            <p class="text-gray-400 text-sm">
                Vá ao site <strong>waveform.com/tools/bufferbloat</strong> e rode o teste. Se você tirar nota "C", "D" ou "F", você tem um problema sério de latência sob carga. A meta é nota "A+".
            </p>
        </div>
      `
        },
        {
            title: "Passo 2: Otimização de Registro (TCP No-Delay)",
            content: `
        <p class="mb-4 text-gray-300">
            O Windows, por padrão, "segura" pequenos pacotes de dados para enviá-los juntos (Nagle's Algorithm). Isso é ótimo para downloads, mas terrível para jogos onde cada milissegundo conta. Vamos desligar isso.
        </p>

        <div class="bg-[#1e1e1e] border border-gray-700 p-6 rounded-xl font-mono text-xs overflow-x-auto">
            <p class="text-gray-500 mb-2">Editor de Registro (Regedit)</p>
            <ol class="list-decimal list-inside text-gray-300 space-y-2">
                <li>Abra o Regedit e navegue até: <br/><span class="text-blue-300">HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters\\Interfaces</span></li>
                <li>Você verá várias pastas com letras aleatórias. Procure a que tem o seu IP (ex: 192.168.x.x) listado à direita.</li>
                <li>Nessa pasta, clique com botão direito > Novo > DWORD (32-bit).</li>
                <li>Nomeie como <strong>TcpAckFrequency</strong> e mude o valor para <strong>1</strong>.</li>
                <li>Crie outro DWORD chamado <strong>TCPNoDelay</strong> e mude o valor para <strong>1</strong>.</li>
                <li>Reinicie o PC.</li>
            </ol>
        </div>
      `
        },
        {
            title: "Passo 3: DNS Benchmarking (Pare de chutar)",
            content: `
        <p class="mb-4 text-gray-300">
            Não use o DNS do Google (8.8.8.8) só porque "todo mundo usa". Dependendo da sua rota, o Cloudflare (1.1.1.1) ou até o OpenDNS podem ser mais rápidos.
        </p>
        <p class="text-gray-300">
            Baixe a ferramenta <strong>DNS Benchmark da GRC</strong>. Ela testa 50 servidores DNS reais a partir da sua casa e diz qual responde mais rápido. Configure o vencedor no seu adaptador de rede IPv4.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/configuracao-roteador-wifi",
            title: "Configurar Roteador",
            description: "Aprenda a ativar QoS e UPnP."
        },
        {
            href: "/guias/wifi-desconectando-sozinho-windows",
            title: "Wi-Fi Caindo",
            description: "Soluções para instabilidade sem fio."
        },
        {
            href: "/guias/debloat-windows-11-otimizacao-powershell",
            title: "Debloat Windows",
            description: "Menos processos = Menos uso de rede."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="35 min"
            difficultyLevel="Avançado"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
            showVoltrisOptimizerCTA={true}
        />
    );
}
