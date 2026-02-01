import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Regedit e CMD para Reduzir Ping: TcpAckFrequency e TCPNoDelay (Guia 2026)";
const description = "Aprenda a editar o Registro do Windows para desativar o algoritmo de Nagle, forçando o envio instantâneo de pacotes de jogos.";
const keywords = ['reduzir ping regedit', 'tcpackfrequency valor', 'tcpnodelay regedit', 'desativar algoritmo nagle', 'cmd diminuir ping', 'otimizar rede windows 11'];

export const metadata: Metadata = createGuideMetadata('reduzir-ping-regedit-cmd-jogos', title, description, keywords);

export default function RegeditGuide() {
    const summaryTable = [
        { label: "Risco", value: "Médio" },
        { label: "Efeito", value: "Reduz Jitter" },
        { label: "Chave 1", value: "TcpAckFrequency" },
        { label: "Chave 2", value: "TCPNoDelay" }
    ];

    const contentSections = [
        {
            title: "O Que é o Algoritmo de Nagle?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
          O Windows foi feito para transferir arquivos grandes. Por padrão, ele espera acumular um montinho de dados pequenos antes de enviá-los de uma vez (para economizar banda). Isso é o <strong>Algoritmo de Nagle</strong>.
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed">
          Para jogos, isso é terrível. Cada clique do mouse é um dado pequeno. Se o Windows "esperar juntar", você tem lag. Vamos desligar isso.
        </p>
      `,
            subsections: []
        },
        {
            title: "Passo 1: Descobrir seu IP",
            content: `
        <ol class="list-decimal list-inside text-gray-300 space-y-2 ml-4 mb-4">
            <li>Abra o CMD.</li>
            <li>Digite <code>ipconfig</code>.</li>
            <li>Anote o "Endereço IPv4" (Ex: 192.168.0.15) e o "ID da Interface" não aparece aqui, vamos achar no Regedit.</li>
        </ol>
      `,
            subsections: []
        },
        {
            title: "Passo 2: O Editor de Registro",
            content: `
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4">
            <li>Win + R, digite <code>regedit</code>.</li>
            <li>Navegue até: <br/><code class="text-green-400 text-xs">HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters\\Interfaces</code></li>
            <li>Você verá várias pastas com nomes estranhos (Ex: <strong>{7A5...}</strong>).</li>
            <li>Clique uma por uma até encontrar aquela que tem o seu <strong>DhcpIPAddress</strong> igual ao IP que você anotou no passo 1. Essa é a sua placa de rede ativa.</li>
        </ol>
      `
        },
        {
            title: "Passo 3: Criando as Chaves Mágicas",
            content: `
        <p class="mb-4 text-gray-300">
            Dentro dessa pasta da sua interface:
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-4 ml-4">
            <li>Clique com botão direito no vazio > Novo > <strong>Valor DWORD (32 bits)</strong>.
                <br/>Nomeie: <strong class="text-yellow-400">TcpAckFrequency</strong>.
                <br/>Valor: <strong>1</strong> (Hexadecimal).
            </li>
            <li>Crie outro DWORD.
                <br/>Nomeie: <strong class="text-yellow-400">TCPNoDelay</strong>.
                <br/>Valor: <strong>1</strong>.
            </li>
            <li>Reinicie o PC.</li>
        </ol>
        <p class="text-white mt-4 font-bold bg-green-900/20 p-4 rounded">
            Resultado: O Windows agora envia CADA pacote individualmente assim que ele é criado (ACK 1). Isso reduz a latência de envio em 5ms a 10ms.
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
