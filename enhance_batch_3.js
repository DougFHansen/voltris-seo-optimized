
const fs = require('fs');
const path = require('path');

const guidesDir = path.join(__dirname, 'app', 'guias');

const guidesToEnhance = {
    'atualizacao-drivers-video': {
        title: "Guia Completo de Atualização de Drivers de Vídeo (NVIDIA/AMD/Intel)",
        description: "Aprenda a instalar, atualizar e fazer o downgrade correto dos drivers da sua placa de vídeo. Evite telas pretas e bugs em jogos com o DDU.",
        keywords: ["atualizar driver video", "nvidia geforce experience", "amd adrenalin", "ddu display driver uninstaller", "fps baixo"],
        contentSections: [
            {
                title: "Por que atualizar (e quando não atualizar)",
                content: `
          <p class="mb-4 text-gray-300">Drivers de vídeo (GPU) são o software mais complexo do seu PC. Atualizar pode dar 10-20% mais performance em jogos novos.</p>
          <div class="bg-blue-900/20 p-4 border-l-4 border-blue-500 my-4">
            <h4 class="text-blue-400 font-bold mb-2">Regra de Ouro</h4>
            <p class="text-gray-300 text-sm">Se tudo está funcionando bem e você não vai jogar um lançamento AAA de hoje, não precisa atualizar imediatamente. Espere uma semana para ver se a nova versão não tem bugs.</p>
          </div>
        `
            },
            {
                title: "O Método 'Limpo' (DDU) - Para Corrigir Problemas",
                content: `
          <p class="mb-4 text-gray-300">Se você trocou de placa (ex: saiu da AMD para NVIDIA) ou está tendo falhas, você PRECISA usar o DDU.</p>
          <ol class="list-decimal list-inside space-y-3 text-gray-300">
            <li>Baixe o <strong>Display Driver Uninstaller (DDU)</strong> do site Guru3D.</li>
            <li>Baixe o instalador do driver novo (NVIDIA/AMD) e deixe salvo na área de trabalho.</li>
            <li><strong>Desconecte a internet</strong> (para o Windows Update não instalar um driver genérico sozinho).</li>
            <li>Reinicie o PC em <strong>Modo de Segurança</strong>.</li>
            <li>Abra o DDU, selecione "GPU" e clique em <strong>"Limpar e Reiniciar"</strong>.</li>
            <li>Ao ligar de volta (ainda sem internet), instale o driver novo que você baixou.</li>
          </ol>
        `
            },
            {
                title: "Configurações Pós-Instalação",
                content: `
          <p class="text-gray-300 mb-2">Depois de instalar, verifique:</p>
          <ul class="list-disc list-inside text-gray-400">
            <li><strong>Taxa de Atualização (Hz):</strong> O Windows pode ter resetado seu monitor para 60Hz. Vá em Configurações de Exibição -> Avançado e mude para 144Hz/165Hz.</li>
            <li><strong>G-Sync/FreeSync:</strong> Reative no painel de controle da placa.</li>
          </ul>
        `
            }
        ]
    },
    'guia-compra-monitores': {
        title: "Guia Definitivo para Comprar Monitores: Hz, IPS, TN e Resolução",
        description: "Não compre o monitor errado! Entenda as diferenças entre painéis IPS, VA e TN, o que é taxa de atualização (Hz) e tempo de resposta.",
        keywords: ["monitor 144hz", "painel ips vs va", "tempo de resposta 1ms", "monitor gamer custo beneficio", "hdr vale a pena"],
        contentSections: [
            {
                title: "A Trindade dos Painéis: IPS vs VA vs TN",
                content: `
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
            <div class="bg-[#171313] p-4 rounded border-t-4 border-green-500">
              <h4 class="text-white font-bold mb-2">IPS (In-Plane Switching)</h4>
              <p class="text-gray-400 text-xs">Cores incríveis e melhores ângulos de visão. O 'queridinho' atual. Antes era lento, hoje já existem IPS rápidos (Fast IPS).</p>
            </div>
            <div class="bg-[#171313] p-4 rounded border-t-4 border-yellow-500">
              <h4 class="text-white font-bold mb-2">VA (Vertical Alignment)</h4>
              <p class="text-gray-400 text-xs">Melhor contraste (pretos profundos). Comum em telas curvas. Pode ter 'Ghosting' (rastro) em movimentos rápidos escuros.</p>
            </div>
            <div class="bg-[#171313] p-4 rounded border-t-4 border-red-500">
              <h4 class="text-white font-bold mb-2">TN (Twisted Nematic)</h4>
              <p class="text-gray-400 text-xs">O mais rápido e barato. Cores lavadas e ângulos de visão ruins. Só compre se for eSports hardcore com orçamento baixo.</p>
            </div>
          </div>
        `
            },
            {
                title: "Resolução vs Tamanho Ideal (PPI)",
                content: `
          <p class="mb-4 text-gray-300">A nitidez depende da densidade de pixels (PPI). Regra prática:</p>
          <ul class="space-y-2 text-gray-300">
            <li><strong>24 polegadas:</strong> 1080p (Full HD) é perfeito.</li>
            <li><strong>27 polegadas:</strong> 1440p (Quad HD) é o ideal. 1080p aqui começa a ficar pixelado.</li>
            <li><strong>32 polegadas ou mais:</strong> 4K (Ultra HD) é recomendado.</li>
          </ul>
        `
            }
        ]
    },
    'privacidade-windows-telemetria': {
        title: "Como Bloquear a Telemetria e Espionagem do Windows",
        description: "O Windows coleta muitos dados por padrão. Aprenda a configurar a privacidade, desativar a telemetria e usar ferramentas como O&O ShutUp10.",
        keywords: ["privacidade windows", "telemetria", "bloquear rastreamento", "o&o shutup10", "cortana desativar"],
        contentSections: [
            {
                title: "O que o Windows sabe sobre você?",
                content: `
          <p class="mb-4 text-gray-300">Por padrão, o Windows envia dados de diagnóstico, histórico de pesquisa e até amostras de escrita para a Microsoft. Embora visem 'melhorar o serviço', muitos usuários preferem privacidade total.</p>
        `
            },
            {
                title: "Passos Manuais (Configurações)",
                content: `
          <ol class="list-decimal list-inside space-y-2 text-gray-300 text-sm">
            <li>Vá em <strong>Configurações > Privacidade e segurança</strong>.</li>
            <li>Em <strong>Geral</strong>, desative todas as 4 opções (ID de publicidade, etc).</li>
            <li>Em <strong>Diagnóstico e comentários</strong>, desative "Enviar dados de diagnóstico opcionais".</li>
            <li>Em <strong>Histórico de atividades</strong>, desative "Armazenar meu histórico de atividades neste dispositivo".</li>
          </ol>
        `
            },
            {
                title: "Ferramentas Automáticas (Avançado)",
                content: `
          <div class="bg-red-900/20 p-4 border border-red-500/30 rounded-lg">
            <h4 class="text-white font-bold mb-2">O&O ShutUp10++</h4>
            <p class="text-gray-400 text-sm mb-2">Esta é a ferramenta padrão-ouro gratuita para privacidade. Ela lista centenas de configurações ocultas.</p>
            <ul class="list-disc list-inside text-gray-300 text-xs">
              <li>Baixe e execute (não precisa instalar).</li>
              <li>Use a opção <strong>"Apply only recommended settings"</strong> (Apenas recomendados).</li>
              <li>⚠ Cuidado com as opções vermelhas/avançadas, elas podem quebrar o Windows Update ou a Loja.</li>
            </ul>
          </div>
        `
            }
        ]
    },
    'programas-essenciais-windows': {
        title: "Kit de Sobrevivência: Programas Essenciais para Instalar no Windows",
        description: "Lista curada dos melhores softwares gratuitos e open-source para produtividade, segurança e mídia. Diga adeus ao WinRAR e conheça o 7-Zip.",
        keywords: ["programas essenciais pc", "ninite", "vlc alternativa", "7zip vs winrar", "melhores softwares gratis"],
        contentSections: [
            {
                title: "O Método Ninite",
                content: `
          <p class="mb-4 text-gray-300">Pare de baixar instaladores um por um e clicar em "Próximo" 50 vezes. Acesse <strong>ninite.com</strong>, marque os apps que quer e baixe um único instalador que faz tudo em silêncio e sem toolbars.</p>
        `
            },
            {
                title: "Lista de Ouro (Open Source & Grátis)",
                content: `
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-[#171313] p-4 rounded">
              <h4 class="text-[#31A8FF] font-bold">Utilitários</h4>
              <ul class="text-gray-400 text-sm list-none space-y-2 mt-2">
                <li>📦 <strong>7-Zip:</strong> Melhor que WinRAR. Abre tudo, gratuito e sem janelas chatas.</li>
                <li>🔍 <strong>Everything:</strong> Busca arquivos no PC instantaneamente (muito melhor que a busca do Windows).</li>
                <li>📸 <strong>ShareX:</strong> A ferramenta suprema de printscreen e gravação de tela.</li>
              </ul>
            </div>
            <div class="bg-[#171313] p-4 rounded">
              <h4 class="text-[#31A8FF] font-bold">Mídia e Internet</h4>
              <ul class="text-gray-400 text-sm list-none space-y-2 mt-2">
                <li>🎥 <strong>VLC Media Player:</strong> Roda qualquer vídeo, com qualquer legenda, sem precisar de codecs.</li>
                <li>🦊 <strong>Brave ou Firefox:</strong> Alternativas focadas em privacidade ao Chrome.</li>
                <li>🎵 <strong>Spotify/Discord:</strong> Essenciais para comunicação e música.</li>
              </ul>
            </div>
          </div>
        `
            },
            {
                title: "O que NÃO instalar",
                content: `
          <div class="bg-red-900/20 p-4 rounded border border-red-500/20">
            <ul class="list-disc list-inside text-gray-300">
              <li><strong>uTorrent:</strong> Virou adware. Use <strong>qBittorrent</strong> (leve, open source, limpo).</li>
              <li><strong>Antivírus Gratuitos Pesados (Avast/McAfee):</strong> O Windows Defender já é excelente. Se quiser uma varredura extra, use Malwarebytes Free.</li>
              <li><strong>Driver Boosters:</strong> Geralmente instalam drivers errados. Baixe do site do fabricante.</li>
            </ul>
          </div>
        `
            }
        ]
    },
    'seguranca-wifi-avancada': {
        title: "Segurança Wi-Fi: Como Proteger sua Rede Doméstica de Invasores",
        description: "Seu Wi-Fi está seguro? Aprenda a configurar WPA3, desativar WPS, esconder o SSID e criar uma rede de convidados para isolar dispositivos IoT.",
        keywords: ["segurança wifi", "wpa2 vs wpa3", "configurar roteador seguro", "desativar wps", "rede convidados"],
        contentSections: [
            {
                title: "Configurações Críticas no Roteador",
                content: `
          <p class="mb-4 text-gray-300">Acesse seu roteador (geralmente 192.168.0.1 ou 192.168.1.1) e verifique:</p>
          <div class="space-y-4">
            <div class="border-l-4 border-red-500 pl-4">
              <h4 class="text-white font-bold">Desative o WPS (Wi-Fi Protected Setup)</h4>
              <p class="text-gray-400 text-sm">O WPS é uma falha de segurança enorme. Permite que invasores descubram sua senha em minutos via força bruta no PIN.</p>
            </div>
            <div class="border-l-4 border-green-500 pl-4">
              <h4 class="text-white font-bold">Use WPA3 ou WPA2-AES</h4>
              <p class="text-gray-400 text-sm">Nunca use WEP ou WPA-TKIP (são obsoletos e inseguros). Se seu roteador suporta WPA3, ative-o.</p>
            </div>
          </div>
        `
            },
            {
                title: "Rede de Convidados e IoT",
                content: `
          <p class="mb-4 text-gray-300">Dispositivos inteligentes (lâmpadas, alexa, geladeiras) têm segurança fraca. Se um hacker invadir sua lâmpada, ele pode acessar seu PC?</p>
          <p class="text-gray-300">Sim, se estiverem na mesma rede. <strong>A Solução:</strong></p>
          <ul class="list-disc list-inside text-gray-400">
            <li>Crie uma <strong>Rede de Convidados (Guest Network)</strong> no roteador.</li>
            <li>Conecte todas as visitas e dispositivos IoT nessa rede.</li>
            <li>A maioria dos roteadores isola a rede de convidados da rede principal ("AP Isolation").</li>
          </ul>
        `
            }
        ]
    },
    'solucao-problemas-audio': {
        title: "Windows Sem Som? Guia Completo de Reparo de Áudio",
        description: "Diagnóstico passo a passo para resolver problemas de som no Windows 10/11. Drivers Realtek, configurações de saída e serviços de áudio.",
        keywords: ["windows sem som", "driver realtek", "solução problemas audio", "microfone não funciona", "audio services"],
        contentSections: [
            {
                title: "O Básico Primeiro",
                content: `
          <ul class="list-decimal list-inside space-y-2 text-gray-300">
            <li><strong>Dispositivo de Saída Correto:</strong> Clique no ícone de som na barra de tarefas. Você está enviando áudio para a caixa de som ou para o monitor HDMI (que talvez não tenha som)?</li>
            <li><strong>Volume Físico:</strong> Verifique se a caixa de som está ligada e com volume alto.</li>
            <li><strong>Cabo P2:</strong> Verifique se está conectado na porta VERDE (saída) e não na azul ou rosa.</li>
          </ul>
        `
            },
            {
                title: "Reiniciando os Serviços de Áudio",
                content: `
          <p class="mb-4 text-gray-300">Às vezes o driver trava. Reiniciar o serviço resolve:</p>
          <div class="bg-[#1E1E22] p-4 rounded border border-gray-700 font-mono text-sm text-gray-300">
            1. Pressione Win + R, digite "services.msc" e Enter.<br>
            2. Procure por "Áudio do Windows".<br>
            3. Clique com botão direito -> Reiniciar.
          </div>
        `
            },
            {
                title: "Melhorias de Áudio (Desativar)",
                content: `
          <p class="text-gray-300">Configurações de som > Mais configurações > Propriedades do dispositivo > Aba <strong>Aperfeiçoamentos</strong>. Marque "Desativar todos os efeitos sonoros". Drivers antigos às vezes bugam com esses efeitos.</p>
        `
            }
        ]
    },
    'solucao-problemas-bluetooth': {
        title: "Bluetooth não conecta ou desapareceu? Soluções Definitivas",
        description: "Fone Bluetooth falhando ou ícone sumiu? Aprenda a reinstalar drivers, reiniciar serviços e resolver interferências de sinal.",
        keywords: ["bluetooth sumiu windows", "fone bluetooth picotando", "driver bluetooth intel", "emparelhamento falhou"],
        contentSections: [
            {
                title: "Ícone do Bluetooth Sumiu?",
                content: `
          <p class="mb-4 text-gray-300">Isso geralmente é um 'Soft Lock' do driver ou eletricidade estática.</p>
          <div class="bg-[#1E1E22] p-4 rounded border-l-4 border-yellow-500">
            <h4 class="text-white font-bold mb-2">A Solução 'Mágica' (Power Flush)</h4>
            <p class="text-gray-400 text-sm">Para notebooks: Desligue, tire da tomada. Segure o botão Power por 30 segundos. Ligue novamente.</p>
            <p class="text-gray-400 text-sm mt-2">Para Desktops: Desligue a fonte no botão traseiro, espere 30s, ligue de volta.</p>
          </div>
        `
            },
            {
                title: "Interferência de 2.4GHz",
                content: `
          <p class="text-gray-300">Bluetooth usa a mesma frequência (2.4GHz) que o Wi-Fi antigo e micro-ondas. Se seu áudio picota:</p>
          <ul class="list-disc list-inside text-gray-400 text-sm">
            <li>Afaste o receptor Bluetooth do roteador Wi-Fi.</li>
            <li>Conecte o PC no Wi-Fi 5GHz em vez do 2.4GHz.</li>
            <li>Se usar dongle USB, use uma extensão USB para afastá-lo da porta do PC (USB 3.0 gera interferência em 2.4GHz bem na porta).</li>
          </ul>
        `
            }
        ]
    },
    'teste-velocidade-internet': {
        title: "Como Testar a Velocidade da sua Internet Corretamente",
        description: "Speedtest, Fast.com ou nPerf? Saiba como medir sua banda larga real, entender Ping, Jitter e perda de pacotes.",
        keywords: ["teste velocidade", "speedtest", "ping alto", "jitter", "internet lenta"],
        contentSections: [
            {
                title: "O Erro Comum: Testar no Wi-Fi",
                content: `
          <p class="mb-4 text-gray-300">Você contratou 500 Mega mas só chega 100 no celular? A culpa provavelmente é do Wi-Fi, não da operadora.</p>
          <div class="bg-red-900/20 p-4 border border-red-500/30 rounded">
            <p class="text-gray-300 font-bold">Para valer legalmente e tecnicamente, o teste deve ser feito via CABO DE REDE (Ethernet) Cat5e ou superior, conectado diretamente ao roteador da operadora.</p>
          </div>
        `
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
