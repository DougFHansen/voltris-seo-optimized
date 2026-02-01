import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Teste de Velocidade de Internet: Entendendo Ping, Jitter e Bufferbloat (2026)";
const description = "Sua internet é rápida mas trava em jogos? Aprenda a interpretar um Speedtest além do download, entender o que é Bufferbloat e como resolver o Jitter alto.";
const keywords = ['teste velocidade internet', 'o que é jitter', 'ping vs jitter', 'testar bufferbloat', 'internet lagando jogos', 'upload importa para jogos'];

export const metadata: Metadata = createGuideMetadata('teste-velocidade-internet', title, description, keywords);

export default function InternetGuide() {
  const summaryTable = [
    { label: "Mais Importante", value: "Ping & Jitter" },
    { label: "Menos Importante", value: "Download" },
    { label: "Vilão Oculto", value: "Bufferbloat" },
    { label: "Teste Ideal", value: "Cabeado (RJ45)" }
  ];

  const contentSections = [
    {
      title: "Introdução: A Mentira da Velocidade",
      content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
          As operadoras vendem "500 Mega" ou "1 Giga". Para assistir Netflix em 4K, você precisa de apenas 25 Mega. Então por que seu jogo laga com 500 Mega? Porque velocidade (Largura de Banda) não é Latência.
        </p>
      `,
      subsections: []
    },
    {
      title: "1. O Vocabulário da Conexão",
      content: `
        <ul class="space-y-4 list-none text-gray-300">
            <li class="bg-gray-800 p-4 rounded border-l-4 border-blue-500">
                <strong class="text-white block text-lg">Ping (Latência)</strong>
                Tempo que um pacote de dados leva para ir do seu PC até o servidor e voltar.
                <br/><span class="text-green-400 text-sm">Ideal: &lt; 20ms (Fibra local), &lt; 50ms (Interestadual).</span>
            </li>
            <li class="bg-gray-800 p-4 rounded border-l-4 border-yellow-500">
                <strong class="text-white block text-lg">Jitter (Variação)</strong>
                É a instabilidade do Ping. Se seu ping é 20ms, depois 50ms, depois 20ms, você tem Jitter de 30ms. Isso causa os "teleportes" dos inimigos.
                <br/><span class="text-green-400 text-sm">Ideal: &lt; 5ms.</span>
            </li>
            <li class="bg-gray-800 p-4 rounded border-l-4 border-red-500">
                <strong class="text-white block text-lg">Packet Loss (Perda de Pacote)</strong>
                Dados que saíram e nunca chegaram. Causa tiros não registrados e desconexões.
                <br/><span class="text-green-400 text-sm">Ideal: 0%. (1% já é injogável).</span>
            </li>
        </ul>
      `,
      subsections: []
    },
    {
      title: "2. O Vilão Secreto: Bufferbloat",
      content: `
        <p class="mb-4 text-gray-300">
            Já notou que o ping sobe para 500ms quando alguém envia um vídeo no WhatsApp ou faz upload de backup? Isso é <strong>Bufferbloat</strong>.
        </p>
        <p class="mb-4 text-gray-300">
            Acontece quando o roteador segura pacotes na fila porque sua conexão de upload está saturada.
        </p>
        <h4 class="text-white font-bold mb-2">Como Testar:</h4>
        <ol class="list-decimal list-inside text-gray-300 ml-4 mb-4">
            <li>Acesse o site <a href="https://www.waveform.com/tools/bufferbloat" target="_blank" class="text-blue-400 underline">Waveform Bufferbloat Test</a>.</li>
            <li>Rode o teste.</li>
            <li>Se você tirar nota <strong>C, D ou F</strong>, você tem problema de Bufferbloat.</li>
        </ol>
        <h4 class="text-white font-bold mb-2">Como Resolver (QoS):</h4>
        <p class="text-gray-300">
            Acesse seu roteador e procure por <strong>QoS (Quality of Service)</strong> ou "Controle de Banda". Limite a velocidade de Upload para 90% do total contratado. Isso deixa sempre uma folga na fila, eliminando o lag quando alguém usa a rede.
        </p>
      `
    },
    {
      title: "3. Wi-Fi vs Cabo (A Diferença Real)",
      content: `
            <p class="mb-4 text-gray-300">
                Wi-Fi é rádio. Rádio sofre interferência de micro-ondas, paredes, espelhos e vizinhos.
            </p>
            <div class="grid grid-cols-2 gap-4">
                <div class="bg-red-900/20 p-4 rounded text-center">
                    <strong class="text-red-400 block mb-2">Wi-Fi 5GHz</strong>
                    <p class="text-gray-400 text-sm">Ping: 5-10ms (Acima do cabo)</p>
                    <p class="text-gray-400 text-sm">Jitter: Alto</p>
                    <p class="text-gray-400 text-sm">Estabilidade: Média</p>
                </div>
                 <div class="bg-green-900/20 p-4 rounded text-center">
                    <strong class="text-green-400 block mb-2">Cabo Ethernet (CAT6)</strong>
                    <p class="text-gray-400 text-sm">Ping: 0ms (Local)</p>
                    <p class="text-gray-400 text-sm">Jitter: Quase Zero</p>
                    <p class="text-gray-400 text-sm">Estabilidade: Perfeita</p>
                </div>
            </div>
            <p class="mt-4 text-gray-300 text-center italic">Para jogos competitivos, use cabo. Não existe "Wi-Fi Gamer" mágico.</p>
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
