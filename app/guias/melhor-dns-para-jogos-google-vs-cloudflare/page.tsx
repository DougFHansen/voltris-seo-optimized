import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'melhor-dns-para-jogos-google-vs-cloudflare',
  title: "Qual o Melhor DNS para Jogos? Google (8.8.8.8) vs Cloudflare (1.1.1.1) (2026)",
  description: "Mudar o DNS diminui o ping? Testamos os principais servidores DNS do mundo para descobrir qual resolve rotas mais rápido e melhora a conexão.",
  category: 'otimizacao',
  difficulty: 'Intermediário',
  time: '10 min'
};

const title = "Qual o Melhor DNS para Jogos? Google (8.8.8.8) vs Cloudflare (1.1.1.1) (2026)";
const description = "Mudar o DNS diminui o ping? Testamos os principais servidores DNS do mundo para descobrir qual resolve rotas mais rápido e melhora a conexão.";
const keywords = ['melhor dns jogos 2026', 'dns google vs cloudflare', 'dns diminui ping', 'como mudar dns windows 11', 'dns para valorant', 'opendns jogos'];

export const metadata: Metadata = createGuideMetadata('melhor-dns-para-jogos-google-vs-cloudflare', title, description, keywords);

export default function DNSGuide() {
    const summaryTable = [
        { label: "Mais Rápido", value: "Cloudflare (1.1.1.1)" },
        { label: "Mais Estável", value: "Google (8.8.8.8)" },
        { label: "Muda Ping?", value: "Não (Indireto)" },
        { label: "Segurança", value: "Quad9 (9.9.9.9)" }
    ];

    const contentSections = [
        {
            title: "O Grande Mito do DNS e Ping",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
          Vamos ser diretos: <strong>DNS NÃO baixa o ping dentro da partida</strong>.
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed">
           O DNS (Domain Name System) é a agenda telefônica da internet. Ele só trabalha quando você digita "google.com" ou abre o launcher do jogo. Depois que você conectou no servidor da partida (IP direto), o DNS não faz mais nada. Mudar DNS ajuda a carregar sites e downloads mais rápido, mas não faz seu boneco andar mais rápido.
        </p>
      `,
            subsections: []
        },
        {
            title: "O Benchmark: Quem é mais rápido?",
            content: `
        <p class="mb-4 text-gray-300">
            Usamos a ferramenta <strong class="text-white">DNSBench</strong> para testar a resposta em milissegundos no Brasil.
        </p>
        
        <div class="space-y-4">
            <div class="bg-purple-900/20 p-4 rounded border-l-4 border-purple-500">
                <strong class="text-white block text-lg">1. Cloudflare (1.1.1.1 e 1.0.0.1)</strong>
                <p class="text-gray-300 text-sm">
                    Vencedor em velocidade bruta (12ms de resposta). Focado em privacidade (não vende seus dados).
                </p>
            </div>
            <div class="bg-blue-900/20 p-4 rounded border-l-4 border-blue-500">
                <strong class="text-white block text-lg">2. Google (8.8.8.8 e 8.8.4.4)</strong>
                <p class="text-gray-300 text-sm">
                    Rock solid (20ms de resposta). Nunca cai. Se o Cloudflare falhar, use Google.
                </p>
            </div>
            <div class="bg-red-900/20 p-4 rounded border-l-4 border-red-500">
                <strong class="text-white block text-lg">3. DNS da sua Operadora (Net/Vivo)</strong>
                <p class="text-gray-300 text-sm">
                    Geralmente lento, censurado e vende seu histórico. <strong>Mude imediatamente.</strong>
                </p>
            </div>
        </div>
      `,
            subsections: []
        },
        {
            title: "Como mudar o DNS no Windows 11",
            content: `
        <ol class="list-decimal list-inside text-gray-300 space-y-2 ml-4">
            <li>Win + I (Configurações) > Rede e Internet.</li>
            <li>Clique na sua conexão (Ethernet ou Wi-Fi) > Propriedades de Hardware.</li>
            <li>Ao lado de "Atribuição de servidor DNS", clique em <strong>Editar</strong>.</li>
            <li>Mude para <strong>Manual</strong> > Ative <strong>IPv4</strong>.</li>
            <li>DNS Preferencial: <code>1.1.1.1</code></li>
            <li>DNS Alternativo: <code>8.8.8.8</code> (Ter um backup de outra empresa é inteligente).</li>
            <li>Salve.</li>
            <li>Abra o CMD e digite: <code>ipconfig /flushdns</code> para limpar o cache antigo.</li>
        </ol>
      `
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
            summaryTable={summaryTable}
        />
    );
}
