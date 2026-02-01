import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Melhor DNS para Jogos em 2026: Google vs Cloudflare vs OpenDNS";
const description = "Teste prático de latência: Qual o DNS mais rápido para jogar Valorant, CS2 e LoL no Brasil? Aprenda a escolher e configurar o DNS ideal.";
const keywords = ['melhor dns jogos', 'dns cloudflare vs google', 'dns mais rapido brasil', 'reduzir ping dns', 'configurar dns windows 11'];

export const metadata: Metadata = createGuideMetadata('melhor-dns-jogos-2026', title, description, keywords);

export default function DNSGuide() {
    const summaryTable = [
        { label: "Dificuldade", value: "Iniciante" },
        { label: "Tempo", value: "5 min" },
        { label: "Ganho", value: "Estabilidade" }
    ];

    const contentSections = [
        {
            title: "O DNS diminui o ping?",
            content: `
        <p class="mb-4">Diretamente, <strong>não muito</strong>. O ping é a distância física até o servidor. O que o DNS faz é <strong>encontrar</strong> o servidor mais rápido. Um DNS ruim demora para conectar e pode causar falhas de login ou desconexões. Um DNS bom garante que você entre na partida instantaneamente.</p>
      `,
            subsections: []
        },
        {
            title: "Top 3 Melhores DNS para o Brasil (2026)",
            content: `
        <p class="mb-4">Baseado em testes de latência (benchmark):</p>
        <div class="space-y-4">
            <div class="bg-[#171313] p-4 rounded border border-[#31A8FF]/30">
                <h3 class="text-[#31A8FF] font-bold">1. Cloudflare (O Mais Rápido)</h3>
                <p class="text-gray-300 text-sm">Focado 100% em velocidade e privacidade. Geralmente é o vencedor em testes no Brasil.</p>
                <code class="block bg-black p-2 mt-2 text-white">IPv4: 1.1.1.1 e 1.0.0.1</code>
            </div>
            <div class="bg-[#171313] p-4 rounded border border-white/10">
                <h3 class="text-white font-bold">2. Google Public DNS (O Mais Estável)</h3>
                <p class="text-gray-300 text-sm">Pode ter 2ms a mais de latência que o Cloudflare, mas nunca cai.</p>
                <code class="block bg-black p-2 mt-2 text-white">IPv4: 8.8.8.8 e 8.8.4.4</code>
            </div>
               <div class="bg-[#171313] p-4 rounded border border-white/10">
                <h3 class="text-white font-bold">3. Quad9 (Segurança)</h3>
                <p class="text-gray-300 text-sm">Bloqueia sites maliciosos automaticamente. Bom para PCs compartilhados.</p>
                <code class="block bg-black p-2 mt-2 text-white">IPv4: 9.9.9.9 e 149.112.112.112</code>
            </div>
        </div>
      `
        },
        {
            title: "Como Configurar no Windows 11",
            content: `
        <ol class="space-y-3 text-gray-300 list-decimal list-inside ml-4">
            <li>Abra <strong>Configurações > Rede e Internet</strong>.</li>
            <li>Clique em Ethernet (ou Wi-Fi).</li>
            <li>Ao lado de "Atribuição de servidor DNS", clique em <strong>Editar</strong>.</li>
            <li>Mude de Automático para <strong>Manual</strong>.</li>
            <li>Ative o IPv4 e digite os números acima em "DNS Preferencial" e "DNS Alternativo".</li>
            <li>Clique em Salvar.</li>
        </ol>
      `
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="10 minutos"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
        />
    );
}
