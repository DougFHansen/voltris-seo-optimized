
const fs = require('fs');
const path = require('path');

const guidesDir = path.join(__dirname, 'app', 'guias');

const guidesToEnhance = {
    'extensoes-produtividade-chrome': {
        title: "As Melhores Extensões Chrome para Produtividade Máxima",
        description: "Transforme seu navegador em uma máquina de produtividade. Análise detalhada do uBlock Origin, Bitwarden, OneTab, Grammarly e outros essenciais.",
        keywords: ["melhores extensões chrome", "ublock origin", "bitwarden", "produtividade navegador", "bloquear anuncios"],
        contentSections: [
            {
                title: "Por que usar Extensões?",
                content: `
          <p class="mb-4 text-gray-300">O Google Chrome "puro" é rápido, mas limitado. Extensões são pequenos programas que adicionam superpoderes ao navegador. Selecionamos apenas as que são <strong>leves</strong>, <strong>seguras</strong> e <strong>gratuitas</strong>.</p>
        `
            },
            {
                title: "Top 1: Segurança e Limpeza",
                content: `
          <div class="space-y-4">
            <div class="bg-[#1E1E22] p-4 rounded border-l-4 border-red-500">
              <h4 class="text-white font-bold mb-1">uBlock Origin</h4>
              <p class="text-gray-400 text-sm">Não confunda com o "AdBlock Plus". O uBlock Origin é o rei indiscutível. Ele bloqueia anúncios, rastreadores e scripts maliciosos usando pouquíssima memória (CPU/RAM). Essencial para qualquer PC.</p>
            </div>
            <div class="bg-[#1E1E22] p-4 rounded border-l-4 border-blue-500">
              <h4 class="text-white font-bold mb-1">Bitwarden</h4>
              <p class="text-gray-400 text-sm">Pare de usar a mesma senha para tudo. O Bitwarden cria e salva senhas ultra-seguras para cada site. É open-source e gratuito para uso ilimitado.</p>
            </div>
          </div>
        `
            },
            {
                title: "Top 2: Foco e Organização",
                content: `
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-[#171313] p-4 rounded">
              <h4 class="text-[#31A8FF] font-bold">OneTab</h4>
              <p class="text-gray-400 text-sm mt-2">Você tem 50 abas abertas e o PC está travando? Clique no ícone do OneTab e ele converte tudo em uma lista simples em uma única aba. Economiza até 95% de memória RAM.</p>
            </div>
            <div class="bg-[#171313] p-4 rounded">
              <h4 class="text-[#31A8FF] font-bold">Todoist ou TickTick</h4>
              <p class="text-gray-400 text-sm mt-2">Tenha sua lista de tarefas sempre à mão na barra de ferramentas. Adicione sites como tarefas com um clique ("Ler depois").</p>
            </div>
          </div>
        `
            },
            {
                title: "Cuidado: O que evitar",
                content: `
          <p class="text-gray-300">Evite extensões de "VPN Grátis" (elas vendem seus dados) e "Downloaders de Vídeo" desconhecidos (muitos contêm adware). Mantenha o mínimo possível instalado para não deixar o navegador pesado.</p>
        `
            }
        ]
    },
    'teste-velocidade-internet': {
        title: "Guia Definitivo: Como Testar e Diagnosticar sua Internet",
        description: "Sua internet cai ou trava? Aprenda a diferenciar problemas do Wi-Fi vs Operadora. Metodologia correta de teste de velocidade, ping e jitter.",
        keywords: ["teste velocidade", "speedtest", "ping alto jogos", "perda de pacote", "internet instavel"],
        contentSections: [
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
        `
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
        `
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
        `
            }
        ]
    }
};

async function enhanceGuides() {
    for (const [folderName, data] of Object.entries(guidesToEnhance)) {
        const sectionData = data.contentSections;

        const sectionsCode = sectionData.map(section => {
            return `
    {
      title: "${section.title}",
      content: \`
        ${section.content.trim()}
      \`,
      subsections: []
    }`;
        }).join(',\n');

        const fileContent = `import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "${data.title}";
const description = "${data.description}";
const keywords = ${JSON.stringify(data.keywords)};

export const metadata: Metadata = createGuideMetadata(title, description, keywords);

export default function GuidePage() {
  const contentSections = [
${sectionsCode}
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
`;

        const filePath = path.join(guidesDir, folderName, 'page.tsx');
        try {
            if (fs.existsSync(path.join(guidesDir, folderName))) {
                fs.writeFileSync(filePath, fileContent, 'utf8');
                console.log(`Enhanced: ${folderName}`);
            } else {
                console.log(`Skipped (Not Found): ${folderName}`);
            }
        } catch (e) {
            console.error(`Error writing ${folderName}:`, e);
        }
    }
}

enhanceGuides();
