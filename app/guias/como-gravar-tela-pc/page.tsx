import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'como-gravar-tela-pc',
  title: "Como Gravar a Tela do PC (2026) - Tutorial Completo",
  description: "Aprenda como gravar tela do seu PC com qualidade profissional. Tutoriais passo a passo para Windows 10/11, OBS, ShadowPlay e softwares de gravação.",
  category: 'windows-geral',
  difficulty: 'Iniciante',
  time: '10 min'
};

const title = "Como Gravar a Tela do PC (2026) - Tutorial Completo";
const description = "Aprenda como gravar tela do seu PC com qualidade profissional. Tutoriais passo a passo para Windows 10/11, OBS, ShadowPlay e softwares de gravação.";
const keywords = [
    'como gravar tela do pc 2026 tutorial completo',
    'gravar tela windows 10 passo a passo',
    'gravar tela windows 11 tutorial',
    'melhor software para gravar tela pc',
    'configurar obs para gravar tela',
    'shadowplay gravar tela tutorial',
    'gravar gameplay pc qualidade profissional',
    'gravar tela sem lag tutorial',
    'configurações de gravação pc',
    'gravar tela 4k 60fps',
    'como gravar tela do computador',
    'gravar tela para youtube tutorial',
    'melhor bitrate para gravar tela',
    'gravar tela sem cortar frames',
    'configurar áudio para gravar tela',
    'gravar tela pc gamer',
    'programas para gravar tela pc grátis',
    'gravar tela com baixo pc',
    'como gravar jogos no pc 2026',
    'gravar tela para streaming',
    'gravar tela profissional'
];

export const metadata: Metadata = createGuideMetadata('como-gravar-tela-pc', title, description, keywords);

export default function ComoGravarTelaPCGuide() {
    const summaryTable = [
        { label: "Nível de Dificuldade", value: "Iniciante" },
        { label: "Tempo Estimado", value: "10 minutos" },
        { label: "Software Recomendado", value: "OBS Studio" },
        { label: "Qualidade Ideal", value: "1080p 60fps" }
    ];

    const contentSections = [
        {
            title: "Por Que Gravar Tela?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Gravar a tela do PC se tornou essencial em 2026. Com o crescimento da <strong>streaming</strong>, <strong>conteúdo de jogos</strong> e <strong>criação de tutoriais</strong>, saber gravar tela com qualidade profissional é uma habilidade valiosa. Seja para <strong>criar um canal no YouTube</strong>, <strong>transmitir ao vivo</strong> ou simplesmente <strong>guardar seus melhores momentos</strong> nos jogos.
        </p>
        `
        },
        {
            title: "O Que Você Precisa",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Para começar a gravar tela com qualidade, você precisará de:
        </p>
        <div class="bg-gray-800 rounded-lg p-6 mb-6">
          <h3 class="text-xl font-bold mb-4 text-white">Hardware Mínimo Recomendado:</h3>
          <ul class="space-y-2 text-gray-300">
            <li class="flex items-center gap-2">
              <span class="text-green-400">✓</span>
              <span>Processador: Intel i5 ou Ryzen 5 (2017+)</span>
            </li>
            <li class="flex items-center gap-2">
              <span class="text-green-400">✓</span>
              <span>Placa de Vídeo: GTX 1660 ou RX 6600 XT</span>
            </li>
            <li class="flex items-center gap-2">
              <span class="text-green-400">✓</span>
              <span>Memória RAM: 8GB DDR4</span>
            </li>
            <li class="flex items-center gap-2">
              <span class="text-green-400">✓</span>
              <span>Armazenamento: SSD com 50GB livres</span>
            </li>
          </ul>
        </div>
        <div class="bg-blue-900/20 rounded-lg p-6 mb-6">
          <h3 class="text-xl font-bold mb-4 text-blue-400">Softwares Essenciais:</h3>
          <ul class="space-y-2 text-gray-300">
            <li class="flex items-center gap-2">
              <span class="text-blue-400">🎬</span>
              <span>OBS Studio (gratuito)</span>
            </li>
            <li class="flex items-center gap-2">
              <span class="text-blue-400">🎮</span>
              <span>ShadowPlay (para baixo desempenho)</span>
            </li>
            <li class="flex items-center gap-2">
              <span class="text-blue-400">🎙️</span>
              <span>NVIDIA ShadowPlay (para GeForce)</span>
            </li>
            <li class="flex items-center gap-2">
              <span class="text-blue-400">🎤️</span>
              <span>Audacity (edição de áudio)</span>
            </li>
          </ul>
        </div>
        `
        },
        {
            title: "Configurando o OBS Studio",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O <strong>OBS Studio</strong> é o software mais popular para gravação de tela, e por bons motivos. É gratuito, poderoso e compatível com a maioria dos jogos.
        </p>
        <div class="bg-gray-800 rounded-lg p-6 mb-6">
          <h3 class="text-xl font-bold mb-4 text-white">Configurações Iniciais:</h3>
          <div class="grid md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <h4 class="text-lg font-semibold text-blue-400">📹 Vídeo</h4>
              <ul class="space-y-2 text-gray-300">
                <li><strong>Resolução:</strong> 1920x1080 (Full HD) ou 1280x720 (para baixo desempenho)</li>
                <li><strong>FPS:</strong> 60 (padrão) ou 30 (para economia de recursos)</li>
                <li><strong>Bitrate:</strong> 2500-4000 Kbps</li>
                <li><strong>Encoder:</strong> x264 (mais compatível)</li>
              </ul>
            </div>
            <div class="space-y-4">
              <h4 class="text-lg font-semibold text-green-400">🎤️ Áudio</h4>
              <ul class="space-y-2 text-gray-300">
                <li><strong>Taxa de Amostragem:</strong> 48kHz</li>
                <li><strong>Bitrate:</strong> 128-192 Kbps</li>
                <li><strong>Formato:</strong> AAC</li>
                <li><strong>Filtro de Ruído:</strong> Supressor de Ruído</li>
              </ul>
            </div>
          </div>
        </div>
        `
        },
        {
            title: "Configurando o ShadowPlay",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O <strong>ShadowPlay</strong> é ideal para quem tem placa NVIDIA e quer o máximo desempenho nos jogos com impacto mínimo na gravação.
        </p>
        <div class="bg-gray-800 rounded-lg p-6 mb-6">
          <h3 class="text-xl font-bold mb-4 text-green-400">Configurações Recomendadas:</h3>
          <ul class="space-y-2 text-gray-300">
            <li><strong>Qualidade:</strong> Alta (prioriza desempenho)</li>
            <li><strong>Bitrate:</strong> Automático (ajuste dinâmico)</li>
            <li><strong>Resolução:</strong> Nativa do jogo</li>
            <li><strong>FPS:</strong> Ilimitado (ou 60 para estabilidade)</li>
            <li><strong>Latência:</strong> Ultra Baixa</li>
          </ul>
        </div>
        `
        },
        {
            title: "Gravando em 4K 60FPS",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Gravar em <strong>4K 60FPS</strong> é o padrão ouro para streamers profissionais. Requer hardware potente e configurações otimizadas.
        </p>
        <div class="bg-gray-800 rounded-lg p-6 mb-6">
          <h3 class="text-xl font-bold mb-4 text-purple-400">🚀 Configurações 4K:</h3>
          <div class="grid md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <h4 class="text-lg font-semibold text-purple-400">💻 Hardware Essencial:</h4>
              <ul class="space-y-2 text-gray-300">
                <li><strong>Processador:</strong> Ryzen 7 5800X3D ou Core i7-13700K</li>
                <li><strong>Placa de Vídeo:</strong> RTX 3080 Ti ou superior</li>
                <li><strong>Memória RAM:</strong> 16GB DDR4 3200MHz ou superior</li>
                <li><strong>Armazenamento:</strong> SSD NVMe 1TB</li>
                <li><strong>Internet:</strong> 100Mbps upload estável</li>
              </ul>
            </div>
            <div class="space-y-4">
              <h4 class="text-lg font-semibold text-purple-400">⚙️ Configurações OBS:</h4>
              <ul class="space-y-2 text-gray-300">
                <li><strong>Resolução:</strong> 3840x2160</li>
                <li><strong>FPS:</strong> 60</li>
                <li><strong>Bitrate Vídeo:</strong> 8000-12000 Kbps</li>
                <li><strong>Encoder:</strong> NVENC HEVC (mais eficiente)</li>
                <li><strong>Preset:</strong> Qualidade vs Desempenho equilibrado</li>
              </ul>
            </div>
          </div>
        </div>
        `
        },
        {
            title: "Problemas Comuns e Soluções",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Mesmo com bom hardware, você pode enfrentar problemas. Veja as soluções mais comuns:
        </p>
        <div class="space-y-4">
          <div class="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-yellow-400">⚠️ Tela Cortando (Frame Drops):</h4>
            <div class="text-gray-300">
              <p class="mb-2"><strong>Causa:</strong> Hardware insuficiente ou configurações muito altas</p>
              <p><strong>Solução:</strong> Reduza resolução para 720p, abaixe o bitrate ou feche programas em segundo plano</p>
            </div>
          </div>
          <div class="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-red-400">🔴 Áudio Fora de Sinc (Delay):</h4>
            <div class="text-gray-300">
              <p class="mb-2"><strong>Causa:</strong> Buffer de áudio muito alto ou driver desatualizado</p>
              <p><strong>Solução:</strong> Reduza buffer para 64ms, atualize drivers de áudio e use ASIO</p>
            </div>
          </div>
          <div class="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-blue-400">🔵 Lag na Gravação:</h4>
            <div class="text-gray-300">
              <p class="mb-2"><strong>Causa:</strong> Gravação em HDD lento ou muitos programas abertos</p>
              <p><strong>Solução:</strong> Use SSD exclusivo para gravação, feche todos os programas desnecessários</p>
            </div>
          </div>
        </div>
        `
        },
        {
            title: "Dicas Profissionais",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Dicas de especialistas para levar suas gravações ao próximo nível:
        </p>
        <div class="grid md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <h4 class="text-lg font-semibold text-green-400">🎯 Qualidade vs Desempenho:</h4>
            <ul class="space-y-2 text-gray-300">
              <li>Use <strong>cenas</strong> para mudar rapidamente entre jogo e gravação</li>
              <li>Configure <strong>hotkeys</strong> para ativar/desativar gravação rapidamente</li>
              <li>Teste diferentes <strong>presets</strong> para encontrar o equilíbrio perfeito</li>
              <li>Monitore <strong>uso de CPU/GPU</strong> durante gravação</li>
            </ul>
          </div>
          <div class="space-y-4">
            <h4 class="text-lg font-semibold text-blue-400">🎨 Produção:</h4>
            <ul class="space-y-2 text-gray-300">
              <li>Use <strong>iluminação adequada</strong> para evitar sombras no rosto</li>
              <li>Posicione a <strong>câmera corretamente</strong> (ângulo de 45°)</li>
              <li>Fale <strong>próximo ao microfone</strong> para melhor qualidade de áudio</li>
              <li>Use <strong>fundo verde</strong> ou chroma key para melhor qualidade visual</li>
            </ul>
          </div>
        </div>
        `
        }
    ];

    const faqItems = [
        {
            question: "Qual o melhor software para gravar tela?",
            answer: "OBS Studio é o melhor para iniciantes por ser gratuito e completo. ShadowPlay é ideal para quem tem NVIDIA. Para profissionais, vMix ou Wirecast oferecem mais recursos."
        },
        {
            question: "Consigo gravar com PC básico?",
            answer: "Sim, mas em qualidade reduzida. Use 720p 30fps, bitrate baixo (1500-2500 Kbps) e feche todos os programas. Para melhor resultado, um PC com GTX 1650 é o mínimo."
        },
        {
            question: "Por que minha gravação fica cortando?",
            answer: "Geralmente é hardware insuficiente. Verifique se CPU ou GPU estão em 100% durante gravação. Reduza a resolução ou bitrate até encontrar o equilíbrio."
        },
        {
            question: "Como melhorar a qualidade da gravação?",
            answer: "Aumente o bitrate gradualmente, use encoder eficiente (NVENC/HEVC), garanta boa iluminação e use microfone de qualidade. Pratique e ajuste conforme necessário."
        }
    ];

    const externalReferences = [
        { name: "OBS Project", url: "https://obsproject.com/" },
        { name: "ShadowPlay", url: "https://www.geforce.com/geforce/technologies/shadowplay/" },
        { name: "Guia de Bitrates", url: "https://streamable.com/streaming-bitrate-calculator/" }
    ];

    const relatedGuides = [
        {
            href: "/guias/otimizacao-windows-11-para-games",
            title: "Otimização Windows 11",
            description: "Configure seu Windows para máximo desempenho"
        },
        {
            href: "/guias/melhor-placa-de-video-pc",
            title: "Melhor Placa de Vídeo",
            description: "Escolha a GPU ideal para suas necessidades"
        },
        {
            href: "/guias/aumentar-fps-pc-gamer",
            title: "Aumentar FPS",
            description: "Técnicas avançadas para extrair mais performance"
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
            summaryTable={summaryTable}
            faqItems={faqItems}
            externalReferences={externalReferences}
            relatedGuides={relatedGuides}
        />
    );
}
