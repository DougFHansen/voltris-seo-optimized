import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Como Testar a Velocidade da sua Internet Corretamente";
const description = "Speedtest, Fast.com ou nPerf? Saiba como medir sua banda larga real, entender Ping, Jitter e perda de pacotes.";
const keywords = ["teste velocidade","speedtest","ping alto","jitter","internet lenta"];

export const metadata: Metadata = createGuideMetadata(title, description, keywords);

export default function GuidePage() {
  const contentSections = [

    {
      title: "O Erro Comum: Testar no Wi-Fi",
      content: `
        <p class="mb-4 text-gray-300">Você contratou 500 Mega mas só chega 100 no celular? A culpa provavelmente é do Wi-Fi, não da operadora.</p>
          <div class="bg-red-900/20 p-4 border border-red-500/30 rounded">
            <p class="text-gray-300 font-bold">Para valer legalmente e tecnicamente, o teste deve ser feito via CABO DE REDE (Ethernet) Cat5e ou superior, conectado diretamente ao roteador da operadora.</p>
          </div>
      `,
      subsections: []
    },

    {
      title: "Entendendo os Números",
      content: `
        <ul class="space-y-3 text-gray-300">
            <li><strong>Download:</strong> Velocidade para baixar arquivos e carregar vídeos. É o número que a operadora vende.</li>
            <li><strong>Upload:</strong> Importante para chamadas de vídeo, backup na nuvem e streaming (Lives). Geralmente é 50% do download na fibra.</li>
            <li><strong>Ping (Latência):</strong> O tempo de resposta. Crucial para jogos online. Abaixo de 20ms é ótimo. Acima de 100ms causa 'lag'.</li>
            <li><strong>Jitter:</strong> A variação do Ping. Se o ping pula de 20 para 100 e volta, o Jitter é alto (o que é péssimo para VoIP e Jogos).</li>
          </ul>
      `,
      subsections: []
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/otimizacao-performance",
      title: "Otimização de Performance",
      description: "Dicas para deixar seu PC mais rápido."
    },
    {
      href: "/guias/rede-domestica",
      title: "Redes Domésticas",
      description: "Melhore sua conexão WiFi."
    },
    {
      href: "/guias/manutencao-preventiva",
      title: "Manutenção Preventiva",
      description: "Cuidados essenciais com o hardware."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="10-15 min"
      difficultyLevel="Iniciante"
      contentSections={contentSections}
      relatedGuides={relatedGuides}
    />
  );
}
