import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Teste de Velocidade de Internet: Como ler os resultados (2026)";
const description = "Sua internet está entregando o que você paga? Aprenda a fazer o teste de velocidade corretamente e entenda o que é Ping, Jitter e Megas em 2026.";
const keywords = [
  'teste de velocidade internet 2026 guia',
  'como saber velocidade real da internet tutorial',
  'o que é jitter e ping no teste de velocidade 2026',
  'melhor site para testar velocidade internet guia',
  'internet lenta o que fazer teste de velocidade 2026'
];

export const metadata: Metadata = createGuideMetadata('teste-velocidade-internet', title, description, keywords);

export default function SpeedTestGuide() {
  const summaryTable = [
    { label: "Sites Recomendados", value: "Speedtest.net / Fast.com / Simet" },
    { label: "Unidade de Medida", value: "Mbps (Megabits por segundo)" },
    { label: "Fator Game", value: "Ping e Jitter são mais importantes que Megas" },
    { label: "Dificuldade", value: "Iniciante" }
  ];

  const contentSections = [
    {
      title: "Entendendo os números da sua Fibra",
      content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Em 2026, é comum termos conexões de 500 Mega ou 1 Giga em casa. No entanto, muitos usuários se frustram ao ver que o download está rápido, mas o vídeo da reunião trava ou o jogo dá lag. Isso acontece porque a velocidade (largura de banda) é apenas **uma parte** da qualidade da sua conexão. Aprender a interpretar o Ping e o Jitter no teste de velocidade é essencial para diagnosticar problemas reais.
        </p>
      `
    },
    {
      title: "1. Download vs Upload vs Ping",
      content: `
        <p class="mb-4 text-gray-300">Entenda cada métrica do seu teste:</p>
        <ul class="list-disc list-inside text-gray-300 space-y-3">
            <li><strong>Download:</strong> A velocidade com que você recebe dados (Netflix, baixar jogos).</li>
            <li><strong>Upload:</strong> A velocidade com que você envia dados (Postar vídeos, enviar sua webcam em chamadas). Em 2026, conexões de fibra devem ser simétricas (Download igual ao Upload).</li>
            <li><strong>Ping (Latência):</strong> O tempo de resposta. Para jogos, qualquer valor acima de 50ms começa a ser prejudicial.</li>
        </ul >
      `
    },
    {
      title: "2. O vilão invisível: Jitter",
      content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Instabilidade da Rede:</h4>
            <p class="text-sm text-gray-300">
                O <strong>Jitter</strong> mede a variação do seu ping. Se o seu ping é 20ms agora e 80ms no próximo segundo, você tem um Jitter alto. <br/><br/>
                Mesmo que sua internet seja de 1 Giga, um Jitter alto fará sua voz falhar no Discord e seu personagem "teletransportar" nos jogos. Em 2026, um Jitter aceitável deve estar abaixo de 5ms. Se estiver acima disso, o problema pode ser o seu Wi-Fi ou um cabo de rede danificado.
            </p>
        </div>
      `
    },
    {
      title: "3. Como fazer o teste corretamente",
      content: `
        <p class="mb-4 text-gray-300">
            <strong>Não cometa este erro:</strong> Nunca teste sua velocidade pelo Wi-Fi se quiser saber se a operadora está entregando o contratado. 
            <br/><br/><strong>Dica de 2026:</strong> Conecte seu computador via cabo e desligue outros dispositivos que usem muita banda (como TVs 4K ou celulares baixando updates). Use o site <strong>Speedtest.net</strong> e verifique se o servidor de teste é o mais próximo da sua cidade. Se o resultado for 20% menor que o contratado, você tem motivos legais para reclamar com o suporte técnico.
        </p>
      `
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/reduzir-ping-jogos-online",
      title: "Reduzir Ping",
      description: "Dicas para estabilizar sua latência."
    },
    {
      href: "/guias/melhor-dns-jogos-2026",
      title: "Melhores DNS",
      description: "Melhore a resposta da sua navegação."
    },
    {
      href: "/guias/problemas-conexao-wifi-causa-solucao",
      title: "Soluções Wi-Fi",
      description: "Melhore o sinal sem fio da sua casa."
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
      relatedGuides={relatedGuides}
    />
  );
}
