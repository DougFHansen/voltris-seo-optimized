import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Comandos CMD para Limpar Cache DNS e Resetar IP (Internet Caindo Fix) (2026)";
const description = "Sua internet cai toda hora ou sites não abrem? Use estes 5 comandos no CMD (ipconfig flushdns, netsh winsock reset) para restaurar sua conexão.";
const keywords = ['limpar cache dns cmd', 'flushdns comando', 'renew ip cmd', 'netsh winsock reset o que faz', 'internet desconectando sozinha', 'restaurar rede windows 11'];

export const metadata: Metadata = createGuideMetadata('como-limpar-cache-dns-ip-flushdns', title, description, keywords);

export default function DNSFlushGuide() {
    const summaryTable = [
        { label: "Ferramenta", value: "CMD (Admin)" },
        { label: "Risco", value: "Zero" },
        { label: "Resolve", value: "Quedas/Sites off" },
        { label: "Tempo", value: "2 Minutos" }
    ];

    const contentSections = [
        {
            title: "O que é Cache DNS?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
          O Windows guarda uma lista de sites que você visitou (Ex: www.google.com = 142.250.78.14). Se o Google mudar de IP e o seu Windows tentar usar o IP antigo salvo no cache, o site não abre. Limpar o cache força o Windows a buscar o endereço novo.
        </p>
      `,
            subsections: []
        },
        {
            title: "O Ritual Sagrado de Reparo de Rede",
            content: `
        <p class="mb-4 text-gray-300">
            Sempre que sua internet estiver estranha, execute estes comandos em ordem.
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-4 ml-4">
            <li>Abra o Menu Iniciar, digite <strong>cmd</strong>, clique com botão direito e escolha <strong>Executar como Administrador</strong>.</li>
            <li>Digite cada comando abaixo e aperte ENTER:</li>
        </ol>
        <div class="bg-black border border-gray-700 p-4 rounded-lg mt-4 font-mono text-green-400 text-sm">
            <p>ipconfig /flushdns</p>
            <p class="text-gray-500 mb-2">// Limpa o cache de nomes de sites.</p>
            
            <p>ipconfig /release</p>
            <p class="text-gray-500 mb-2">// Solta seu IP atual (a internet vai cair).</p>
            
            <p>ipconfig /renew</p>
            <p class="text-gray-500 mb-2">// Pede um novo IP para o roteador (a internet volta).</p>
            
            <p>netsh winsock reset</p>
            <p class="text-gray-500 mb-2">// Reseta a API de sockets do Windows (resolve bug de VPN).</p>
            
            <p>netsh int ip reset</p>
            <p class="text-gray-500">// Reseta o protocolo TCP/IP para o padrão de fábrica.</p>
        </div>
        <p class="text-yellow-400 mt-4 font-bold">
            Reinicie o computador após executar todos.
        </p>
      `,
            subsections: []
        },
        {
            title: "Erro: 'A operação solicitada requer elevação'",
            content: `
        <p class="text-gray-300">
            Se aparecer essa mensagem, é porque você esqueceu de abrir o CMD como <strong>Administrador</strong>. Clique com botão direito no ícone do Prompt de Comando e tente de novo.
        </p>
      `
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
        />
    );
}
