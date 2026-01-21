import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Guia Definitivo: Como Testar e Diagnosticar sua Internet";
const description = "Sua internet cai ou trava? Aprenda a diferenciar problemas do Wi-Fi vs Operadora. Metodologia correta de teste de velocidade, ping e jitter.";
const keywords = ["teste velocidade","speedtest","ping alto jogos","perda de pacote","internet instavel"];

export const metadata: Metadata = createGuideMetadata(title, description, keywords);

export default function GuidePage() {
  const contentSections = [

    {
      title: "1. A Regra de Ouro do Teste",
      content: `
        <div class="bg-[#171313] p-5 rounded-lg border border-red-500/40 mb-6">
            <h3 class="text-red-400 font-bold text-lg mb-2">⛔ Pare de testar no Wi-Fi!</h3>
            <p class="text-gray-300 text-sm leading-relaxed">
              Testes feitos no celular ou via Wi-Fi <strong>não têm validade técnica</strong> para reclamar com a operadora. O Wi-Fi sofre interferência de paredes, espelhos e vizinhos.
              <br><br>
              <strong>O Método Correto:</strong> Conecte um notebook ou PC diretamente ao roteador usando um cabo de rede (RJ-45) padrão CAT5e ou superior. Feche todos os programas (Steam, Torrent, Netflix) e apenas então faça o teste.
            </p>
          </div>
      `,
      subsections: []
    },

    {
      title: "2. Onde Testar? (Sites Confiáveis)",
      content: `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-[#1E1E22] p-4 rounded text-center">
              <h4 class="text-white font-bold mb-1">Speedtest.net</h4>
              <p class="text-xs text-gray-400">O padrão da indústria. Ótimo porque permite escolher o servidor de teste.</p>
            </div>
            <div class="bg-[#1E1E22] p-4 rounded text-center">
              <h4 class="text-white font-bold mb-1">nPerf</h4>
              <p class="text-xs text-gray-400">Mais completo. Testa navegação e streaming (Youtube) além da velocidade bruta.</p>
            </div>
            <div class="bg-[#1E1E22] p-4 rounded text-center">
              <h4 class="text-white font-bold mb-1">Fast.com</h4>
              <p class="text-xs text-gray-400">Da Netflix. Mede a conexão com os servidores da Netflix. Bom para saber se o streaming vai travar.</p>
            </div>
          </div>
      `,
      subsections: []
    },

    {
      title: "3. Interpretando os Resultados (Glossário)",
      content: `
        <div class="space-y-4">
            <div class="flex items-start gap-3">
              <div class="bg-blue-900/30 p-2 rounded text-blue-400 font-mono">Download</div>
              <div>
                <strong class="text-gray-200">Velocidade de Baixar</strong>
                <p class="text-gray-400 text-sm">Importante para carregar páginas, ver vídeos e baixar jogos. É o número que a operadora vende (ex: 500 Mega).</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="bg-purple-900/30 p-2 rounded text-purple-400 font-mono">Upload</div>
              <div>
                <strong class="text-gray-200">Velocidade de Enviar</strong>
                <p class="text-gray-400 text-sm">Crítico para trabalhar em casa (Teams/Zoom), fazer lives ou backup na nuvem (Google Drive). Geralmente é 50% do download.</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="bg-green-900/30 p-2 rounded text-green-400 font-mono">Ping</div>
              <div>
                <strong class="text-gray-200">Latência (Tempo de Resposta)</strong>
                <p class="text-gray-400 text-sm">O tempo que o dado leva para ir e voltar. Essencial para JOGOS ONLINE.
                <br> <span class="text-green-500">0-30ms:</span> Perfeito. <span class="text-yellow-500">30-80ms:</span> Aceitável. <span class="text-red-500">100ms+:</span> Lag perceptível.</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="bg-red-900/30 p-2 rounded text-red-400 font-mono">Jitter</div>
              <div>
                <strong class="text-gray-200">Estabilidade</strong>
                <p class="text-gray-400 text-sm">É a variação do Ping. Se o ping oscila muito, você tem lags intermitentes (teletransporte em jogos). O ideal é jitter próximo de zero.</p>
              </div>
            </div>
          </div>
      `,
      subsections: []
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/rede-domestica",
      title: "Redes Domésticas",
      description: "Melhore sua conexão WiFi."
    },
    {
      href: "/guias/otimizacao-performance",
      title: "Otimização de Performance",
      description: "Deixe seu PC mais rápido."
    },
    {
      href: "/guias/seguranca-digital",
      title: "Segurança Digital",
      description: "Proteção contra ameaças."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="15 min"
      difficultyLevel="Iniciante"
      contentSections={contentSections}
      relatedGuides={relatedGuides}
    />
  );
}
