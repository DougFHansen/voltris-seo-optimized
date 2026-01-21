
const fs = require('fs');
const path = require('path');

const guidesDir = path.join(__dirname, 'app', 'guias');

const guidesToEnhance = {
    'atalhos-produtividade-windows': {
        title: "Atalhos de Teclado Essenciais para Produtividade no Windows",
        description: "Domine o Windows com atalhos de teclado que economizam horas de trabalho. Guia completo para usuários básicos e avançados, incluindo gerenciamento de janelas e desktops virtuais.",
        keywords: ["atalhos windows", "produtividade", "win key", "alt tab", "atalhos navegador"],
        contentSections: [
            {
                title: "Atalhos de Gerenciamento de Janelas",
                content: `
          <p class="mb-4 text-gray-300">O gerenciamento eficiente de janelas é a base da produtividade. Pare de arrastar janelas com o mouse e comece a usar o teclado.</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-[#1E1E22] p-4 rounded-lg border-l-4 border-[#31A8FF]">
              <h4 class="text-white font-bold mb-2">Snap Layouts</h4>
              <ul class="space-y-2 text-sm text-gray-400">
                <li><strong class="text-[#31A8FF]">Win + ← / →</strong>: Fixar janela na metade esquerda ou direita.</li>
                <li><strong class="text-[#31A8FF]">Win + ↑ / ↓</strong>: Maximizar ou minimizar janela.</li>
                <li><strong class="text-[#31A8FF]">Win + Z</strong>: Abrir menu de layouts de encaixe (Windows 11).</li>
              </ul>
            </div>
            <div class="bg-[#1E1E22] p-4 rounded-lg border-l-4 border-[#8B31FF]">
              <h4 class="text-white font-bold mb-2">Desktops Virtuais</h4>
              <ul class="space-y-2 text-sm text-gray-400">
                <li><strong class="text-[#8B31FF]">Win + Tab</strong>: Visão de Tarefas (Timeline).</li>
                <li><strong class="text-[#8B31FF]">Win + Ctrl + D</strong>: Criar novo desktop virtual.</li>
                <li><strong class="text-[#8B31FF]">Win + Ctrl + ← / →</strong>: Alternar entre desktops.</li>
              </ul>
            </div>
          </div>
        `
            },
            {
                title: "Navegação e Sistema",
                content: `
          <div class="prose prose-invert max-w-none">
            <p>Atalhos que controlam o sistema operacional e a exploração de arquivos.</p>
            <table class="w-full text-left text-sm text-gray-400 border-collapse">
              <thead class="bg-[#171313] text-gray-200">
                <tr><th class="p-2 border border-gray-700">Atalho</th><th class="p-2 border border-gray-700">Função</th></tr>
              </thead>
              <tbody>
                <tr><td class="p-2 border border-gray-700 font-mono text-[#31A8FF]">Win + E</td><td class="p-2 border border-gray-700">Abrir Explorador de Arquivos</td></tr>
                <tr><td class="p-2 border border-gray-700 font-mono text-[#31A8FF]">Win + X</td><td class="p-2 border border-gray-700">Menu Link Rápido (Menu Iniciar 'secreto')</td></tr>
                <tr><td class="p-2 border border-gray-700 font-mono text-[#31A8FF]">Win + L</td><td class="p-2 border border-gray-700">Bloquear o computador instantaneamente</td></tr>
                <tr><td class="p-2 border border-gray-700 font-mono text-[#31A8FF]">Win + V</td><td class="p-2 border border-gray-700">Histórico da Área de Transferência (Clipboard)</td></tr>
                <tr><td class="p-2 border border-gray-700 font-mono text-[#31A8FF]">Win + Shift + S</td><td class="p-2 border border-gray-700">Captura de Tela (Snipping Tool)</td></tr>
              </tbody>
            </table>
          </div>
        `
            },
            {
                title: "Dica Pro: Histórico da Área de Transferência",
                content: `
          <div class="bg-gradient-to-r from-[#171313] to-[#1E1E22] p-6 rounded-xl border border-yellow-500/30">
            <h3 class="text-yellow-400 font-bold mb-3 flex items-center gap-2">🚀 Recurso Subestimado</h3>
            <p class="text-gray-300 mb-4">Muitos usuários ignoram o <strong>Win + V</strong>. Ao ativá-lo, você pode copiar vários itens (textos, imagens) sequencialmente e depois colar qualquer um deles escolhendo na lista. Isso elimina a necessidade de alternar janelas repetidamente para copiar e colar.</p>
            <p class="text-sm text-gray-500">Nota: Requer ativação na primeira vez que você pressiona o atalho.</p>
          </div>
        `
            }
        ]
    },
    'guia-montagem-pc': {
        title: "Guia Passo a Passo de Montagem de PC Gamer/Workstation",
        description: "Monte seu próprio computador com confiança. Tutorial detalhado cobrindo desde a instalação da CPU até o gerenciamento de cabos e primeiro boot.",
        keywords: ["montar pc", "instalar cpu", "pasta termica", "conectar painel frontal pc", "organização de cabos"],
        contentSections: [
            {
                title: "1. Preparação e Precauções",
                content: `
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
            <div class="bg-[#171313] p-4 rounded-lg border border-red-500/30">
              <h4 class="text-red-400 font-bold mb-2">⚡ Eletricidade Estática</h4>
              <p class="text-gray-400 text-sm">Componentes são sensíveis. Trabalhe em uma superfície não condutiva (madeira, borracha). Evite carpetes. Toque em uma parte metálica do gabinete ou use uma pulseira antiestática antes de manusear as peças.</p>
            </div>
            <div class="bg-[#171313] p-4 rounded-lg border border-blue-500/30">
              <h4 class="text-blue-400 font-bold mb-2">🛠️ Ferramentas Necessárias</h4>
              <ul class="text-gray-400 text-sm list-disc list-inside">
                <li>Chave Philips #2 (Ponta magnética ajuda muito)</li>
                <li>Abraçadeiras plásticas (Zip ties)</li>
                <li>Tesoura ou alicate de corte</li>
                <li>Lanterna (ou flash do celular)</li>
              </ul>
            </div>
          </div>
        `
            },
            {
                title: "2. Instalação do Processador (CPU) e Memória (RAM)",
                content: `
          <div class="space-y-4">
            <p class="text-gray-300">Recomendamos instalar CPU, RAM e SSD M.2 na placa-mãe <strong>antes</strong> de colocá-la dentro do gabinete.</p>
            <div class="bg-[#1E1E22] p-5 rounded-lg border-l-4 border-yellow-500">
              <h4 class="text-white font-bold mb-2">Instalando a CPU</h4>
              <p class="text-gray-400 text-sm mb-2">Levante a alavanca de retenção. Alinhe o triângulo dourado na CPU com o triângulo no socket.</p>
              <p class="text-yellow-500 text-sm font-semibold">⚠ NÃO FORCE. A CPU deve encaixar suavemente (Drop-in). Se precisar forçar, está errado.</p>
            </div>
            <div class="bg-[#1E1E22] p-5 rounded-lg border-l-4 border-green-500">
              <h4 class="text-white font-bold mb-2">Instalando a RAM</h4>
              <p class="text-gray-400 text-sm">Abra as travas dos slots. Consulte o manual da placa-mãe para a ordem correta (geralmente slots 2 e 4 para Dual Channel). Pressione até ouvir um 'clique'.</p>
            </div>
          </div>
        `
            },
            {
                title: "3. O Pesadelo: Painel Frontal (F_PANEL)",
                content: `
          <p class="text-gray-300 mb-4">Os cabos minúsculos que conectam o botão Power, Reset e LEDs são a parte mais chata. Consulte o manual, mas o padrão geralmente é:</p>
          <ul class="grid grid-cols-2 gap-2 text-sm text-gray-400 bg-black p-4 rounded border border-gray-800 font-mono">
            <li><span class="text-red-500">Power SW</span>: Pinos 3-4 (Topo)</li>
            <li><span class="text-blue-500">Reset SW</span>: Pinos 3-4 (Baixo)</li>
            <li><span class="text-green-500">Power LED</span>: Pinos 1-2 (Topo)</li>
            <li><span class="text-orange-500">HDD LED</span>: Pinos 1-2 (Baixo)</li>
          </ul>
          <p class="text-xs text-gray-500 mt-2">*Triângulo no conector indica o POSITIVO (+).</p>
        `
            },
            {
                title: "Troubleshooting Comum",
                content: `
          <div class="space-y-3">
            <div class="bg-[#171313] p-3 rounded border border-gray-700">
              <strong class="text-white block">PC liga mas não dá vídeo</strong>
              <p class="text-gray-400 text-sm">Verifique se o cabo HDMI está na placa de vídeo (GPU) e não na placa-mãe. Verifique se as memórias RAM estão totalmente encaixadas.</p>
            </div>
            <div class="bg-[#171313] p-3 rounded border border-gray-700">
              <strong class="text-white block">Nada acontece ao apertar Power</strong>
              <p class="text-gray-400 text-sm">Verifique se a chave da fonte (atrás do PC) está na posição 'I'. Verifique os cabos do painel frontal.</p>
            </div>
          </div>
        `
            }
        ]
    },
    'identificacao-phishing': {
        title: "Como Identificar e Se Proteger de Phishing e Golpes Online",
        description: "Aprenda a detectar emails falsos, sites fraudulentos e mensagens enganosas. Proteja seus dados bancários e senhas contra engenharia social.",
        keywords: ["phishing", "golpe internet", "email falso", "segurança bancária", "verificar link"],
        contentSections: [
            {
                title: "Anatomia de um Golpe de Phishing",
                content: `
          <p class="mb-4 text-gray-300">Phishing é a tentativa de criminosos de se passarem por instituições confiáveis (Bancos, Receita Federal, Correios) para roubar seus dados.</p>
          <div class="bg-[#1E1E22] p-6 rounded-xl border border-red-500/40 my-4">
            <h3 class="text-red-400 font-bold text-lg mb-4">Sinais de Alerta Vermelho 🚩</h3>
            <ul class="space-y-3 text-gray-300">
              <li class="flex items-start gap-3">
                <span class="text-red-500 font-bold">1.</span>
                <div>
                  <strong>Senso de Urgência:</strong> "Sua conta será bloqueada em 24h", "Boleto vencendo hoje", "Acesso suspeito detectado".
                  <p class="text-sm text-gray-500 mt-1">Eles querem que você aja sem pensar.</p>
                </div>
              </li>
              <li class="flex items-start gap-3">
                <span class="text-red-500 font-bold">2.</span>
                <div>
                  <strong>Remetente Estranho:</strong> O nome diz "Suporte Banco", mas o email é <code>suporte@gmail.com</code> ou <code>comunicado@banco-seguranca-web.com</code> (domínios falsos).
                </div>
              </li>
              <li class="flex items-start gap-3">
                <span class="text-red-500 font-bold">3.</span>
                <div>
                  <strong>Links Mascarados:</strong> O texto diz "Clique aqui para acessar o site do banco", mas ao passar o mouse, o link real é <code>bit.ly/xyz</code> ou um site estranho.
                </div>
              </li>
            </ul>
          </div>
        `
            },
            {
                title: "Técnicas de Verificação",
                content: `
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-[#171313] p-4 rounded-lg">
              <h4 class="text-blue-400 font-bold mb-2">Teste do Mouseover</h4>
              <p class="text-gray-400 text-sm">Nunca clique direto. Passe o cursor do mouse sobre o link ou botão e olhe no canto inferior esquerdo do navegador. Onde ele realmente leva?</p>
            </div>
            <div class="bg-[#171313] p-4 rounded-lg">
              <h4 class="text-blue-400 font-bold mb-2">HTTPS não é garantia</h4>
              <p class="text-gray-400 text-sm">Cadeado verde significa que a conexão é criptografada, não que o site é legítimo. Hoje, sites de phishing também usam HTTPS. Confie no domínio (ex: itau.com.br), não apenas no cadeado.</p>
            </div>
          </div>
        `
            },
            {
                title: "O que fazer se você clicou?",
                content: `
          <div class="bg-gray-800 p-4 rounded-lg border-l-4 border-yellow-500">
            <ol class="list-decimal list-inside space-y-2 text-gray-300">
              <li><strong>Desconecte-se da internet</strong> imediatamente se baixou algum arquivo.</li>
              <li><strong>Altere suas senhas</strong> de outro dispositivo (celular via 4G, por exemplo).</li>
              <li>Avise seu banco se inseriu dados financeiros.</li>
              <li>Execute um escaneamento completo de antivírus/malware.</li>
            </ol>
          </div>
        `
            }
        ]
    },
    'teclados-mecanicos-guia': {
        title: "Guia Completo de Teclados Mecânicos: Switches, Tamanhos e Mods",
        description: "Entenda tudo sobre teclados mecânicos. Diferenças entre switches Blue, Red e Brown, formatos TKL vs Full Size e como escolher o ideal para digitar ou jogar.",
        keywords: ["teclado mecanico", "switch cherry mx", "outemu", "tkl", "hot-swappable", "lubrificar switch"],
        contentSections: [
            {
                title: "Por que investir em um Teclado Mecânico?",
                content: `
          <p class="mb-4 text-gray-300">Diferente dos teclados de membrana (comuns) que usam uma folha de borracha, teclados mecânicos possuem um interruptor (switch) físico individual para cada tecla. Isso oferece precisão, durabilidade e conforto inigualáveis.</p>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
            <div class="bg-[#1E1E22] p-4 rounded text-center border-t-4 border-blue-500">
              <h4 class="text-white font-bold mb-1">Durabilidade</h4>
              <p class="text-xs text-gray-400">50 a 100 milhões de cliques por tecla, contra 5 milhões dos comuns.</p>
            </div>
            <div class="bg-[#1E1E22] p-4 rounded text-center border-t-4 border-purple-500">
              <h4 class="text-white font-bold mb-1">Anti-Ghosting</h4>
              <p class="text-xs text-gray-400">Pressione várias teclas simultaneamente sem que nenhuma seja ignorada (N-Key Rollover).</p>
            </div>
            <div class="bg-[#1E1E22] p-4 rounded text-center border-t-4 border-green-500">
              <h4 class="text-white font-bold mb-1">Customização</h4>
              <p class="text-xs text-gray-400">Troque as capas (keycaps) e até os switches para mudar o visual e a sensação.</p>
            </div>
          </div>
        `
            },
            {
                title: "Entendendo os Switches (O Coração do Teclado)",
                content: `
          <p class="mb-4 text-gray-300">A cor do switch dita como ele se comporta. As três categorias principais são:</p>
          <div class="space-y-4">
            <div class="flex items-start gap-4 bg-[#171313] p-4 rounded-lg border border-blue-900/50">
              <div class="w-4 h-4 rounded-full bg-blue-500 mt-1 shadow-[0_0_10px_rgba(59,130,246,0.8)] flex-shrink-0"></div>
              <div>
                <h4 class="text-blue-400 font-bold">Switch Blue (Clicky)</h4>
                <p class="text-gray-400 text-sm">Possui um clique audível e uma resposta tátil (um 'degrau').<br><strong>Ideal para:</strong> Digitação pesada e datilógrafos.<br><strong>Ruim para:</strong> Escritórios silenciosos e jogos rápidos (devido ao ponto de reset).</p>
              </div>
            </div>
            <div class="flex items-start gap-4 bg-[#171313] p-4 rounded-lg border border-red-900/50">
              <div class="w-4 h-4 rounded-full bg-red-500 mt-1 shadow-[0_0_10px_rgba(239,68,68,0.8)] flex-shrink-0"></div>
              <div>
                <h4 class="text-red-400 font-bold">Switch Red (Linear)</h4>
                <p class="text-gray-400 text-sm">Movimento suave direto até o fim, sem clique nem barreira.<br><strong>Ideal para:</strong> Jogos competitivos (FPS) pela rapidez.<br><strong>Ruim para:</strong> Digitação (fácil de esbarrar em teclas erradas).</p>
              </div>
            </div>
            <div class="flex items-start gap-4 bg-[#171313] p-4 rounded-lg border border-yellow-900/50">
              <div class="w-4 h-4 rounded-full bg-[#8B4513] mt-1 shadow-[0_0_10px_rgba(139,69,19,0.8)] flex-shrink-0"></div>
              <div>
                <h4 class="text-[#D2691E] font-bold">Switch Brown (Tátil)</h4>
                <p class="text-gray-400 text-sm">O meio termo. Tem a resposta tátil (degrau) do Blue, mas é silencioso como o Red.<br><strong>Ideal para:</strong> Uso misto (Jogar e Trabalhar). O favorito para iniciantes.</p>
              </div>
            </div>
          </div>
        `
            },
            {
                title: "Tamanhos e Layouts",
                content: `
          <ul class="space-y-3 prose prose-invert">
            <li><strong>Full Size (100%):</strong> Padrão completo com numérico. Bom para planilhas. Ocupa muito espaço.</li>
            <li><strong>TKL (Tenkeyless - 80%):</strong> Sem o teclado numérico. Mais ergonômico, deixa mais espaço para o mouse. Padrão gamer.</li>
            <li><strong>60% / 65%:</strong> Ultracompactos. Removem as setas (no 60%) e teclas F1-F12. Para quem precisa de portabilidade máxima.</li>
          </ul>
        `
            }
        ]
    },
    'limpeza-navegadores': {
        title: "Guia de Limpeza e Otimização de Navegadores",
        description: "Seu Chrome ou Edge está lento? Aprenda a limpar cache, remover extensões maliciosas e resetar configurações para restaurar a velocidade original.",
        keywords: ["limpar cache chrome", "navegador lento", "remover extensoes", "resetar edge", "browser cleanup"],
        contentSections: [
            {
                title: "Por que limpar o navegador?",
                content: `
          <p class="mb-4 text-gray-300">Navegadores acumulam gigabytes de dados temporários, cookies e cache ao longo do tempo. Isso não só usa espaço em disco, como pode deixar a navegação lenta e causar erros em sites bancários ou de login.</p>
        `
            },
            {
                title: "Limpeza Profunda no Google Chrome",
                content: `
          <div class="bg-[#1E1E22] p-5 rounded-lg border border-[#31A8FF]/30">
            <h4 class="text-white font-bold mb-3">Passo a Passo</h4>
            <ol class="list-decimal list-inside space-y-2 text-gray-300 text-sm">
              <li>Pressione <strong>Ctrl + Shift + Delete</strong>.</li>
              <li>Na janela que abrir, mude o período para <strong>"Todo o período"</strong>.</li>
              <li>Marque: "Imagens e arquivos armazenados em cache" e "Cookies e outros dados do site".</li>
              <li>Desmarque "Histórico de navegação" se quiser mantê-lo.</li>
              <li>Clique em <strong>Remover dados</strong>.</li>
            </ol>
            <div class="mt-4 p-3 bg-red-900/20 border border-red-500/20 rounded">
              <span class="text-red-400 font-bold text-xs">Atenção:</span> <span class="text-gray-400 text-xs">Isso desconectará você da maioria dos sites. Tenha suas senhas salvas.</span>
            </div>
          </div>
        `
            },
            {
                title: "Removendo Extensões e Malwares (Adware)",
                content: `
          <p class="mb-4 text-gray-300">Muitas vezes a lentidão é causada por extensões que você não instalou ou esqueceu.</p>
          <ul class="space-y-3 text-gray-300">
            <li><strong>Verificar:</strong> Digite <code>chrome://extensions</code> na barra de endereço.</li>
            <li><strong>Identificar:</strong> Procure por qualquer coisa como "Coupon Finder", "Search Helper", "PDF Converter" que você não reconheça.</li>
            <li><strong>Ação:</strong> Clique em REMOVER. Desativar não é suficiente.</li>
          </ul>
          <p class="mt-4 text-gray-300">Se a página inicial ou o mecanismo de busca mudaram sozinhos (ex: Yahoo Search aparecendo do nada), você precisa resetar o navegador: Configurações -> Redefinir configurações -> Restaurar configurações.</p>
        `
            }
        ]
    },
    'saude-bateria-notebook': {
        title: "Como Maximizar a Vida Útil da Bateria do seu Notebook",
        description: "Mitos e verdades sobre baterias de Li-ion. Aprenda como carregar, armazenar e verificar a saúde da bateria para que ela dure anos.",
        keywords: ["bateria viciada", "ciclos de bateria", "calibrar bateria notebook", "battery report windows", "economia energia"],
        contentSections: [
            {
                title: "Mitos Comuns sobre Baterias",
                content: `
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="bg-[#171313] p-4 rounded border border-red-500/20">
              <h4 class="text-red-400 font-bold mb-1">Mito: "Viciar a Bateria"</h4>
              <p class="text-gray-400 text-sm">Baterias modernas de Lítio não têm 'efeito memória'. Você não precisa descarregar tudo antes de carregar.</p>
            </div>
            <div class="bg-[#171313] p-4 rounded border border-green-500/20">
              <h4 class="text-green-400 font-bold mb-1">Verdade: Calor Mata</h4>
              <p class="text-gray-400 text-sm">O maior inimigo da bateria é o calor excessivo. Nunca use o notebook em cima de cobertores ou almofadas que bloqueiem a ventilação.</p>
            </div>
          </div>
        `
            },
            {
                title: "A Regra 20-80% (Para Longevidade Extrema)",
                content: `
          <p class="mb-4 text-gray-300">Quimicamente, baterias ficam mais estressadas nos extremos (0% e 100%). Para maximizar a vida útil (anos de uso):</p>
          <ul class="list-disc list-inside space-y-2 text-gray-300">
            <li>Tente manter a carga entre 20% e 80% no dia a dia.</li>
            <li>Muitos notebooks modernos (Dell, Lenovo, Asus) têm uma configuração de <strong>"Limite de Carga"</strong> ou <strong>"Modo de Conservação"</strong> que impede o carregamento acima de 60% ou 80% quando conectado na tomada. Ative isso se você usa o notebook sempre na mesa!</li>
          </ul>
        `
            },
            {
                title: "Gerando um Relatório de Saúde (Windows)",
                content: `
          <div class="bg-[#1E1E22] p-5 rounded-lg">
            <p class="mb-3 text-gray-300">O Windows tem uma ferramenta secreta para diagnóstico:</p>
            <ol class="list-decimal list-inside space-y-2 font-mono text-sm text-gray-400">
              <li>Abra o Prompt de Comando (CMD) como Administrador.</li>
              <li>Digite: <span class="text-[#31A8FF]">powercfg /batteryreport</span></li>
              <li>Pressione Enter.</li>
              <li>Abra o arquivo HTML gerado (o caminho será mostrado).</li>
            </ol>
            <p class="mt-3 text-gray-300 text-sm">Compare a <strong>Design Capacity</strong> (Capacidade Original) com a <strong>Full Charge Capacity</strong> (Capacidade Atual). Se a atual for menos de 50% da original, considere trocar a bateria.</p>
          </div>
        `
            }
        ]
    }
};

async function enhanceGuides() {
    for (const [folderName, data] of Object.entries(guidesToEnhance)) {
        const sectionData = data.contentSections; // array of objects

        // Convert sectionData to string representation for the template
        const contentSectionsString = JSON.stringify(sectionData, null, 2);

        // We can't just JSON.stringify the whole thing because we want valid TS code with import statements
        // We will construct the file content manually

        // Helper to format subsections which might not be in the simplified object above
        // Assuming the simplified object above is enough, but wait, the content strings contain HTML.
        // JSON.stringify will escape the HTML quotes which is fine for a JS string.

        // Wait, the template uses `content:` which is a string. `contentSections` is an array of objects.
        // Let's build the `contentSections` array string manually to look pretty in code.

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
      href: "/guias/seguranca-digital",
      title: "Segurança Digital",
      description: "Proteja seus dados."
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
      estimatedTime="15-20 min"
      difficultyLevel="Iniciante"
      contentSections={contentSections}
      relatedGuides={relatedGuides}
    />
  );
}
`;

        const filePath = path.join(guidesDir, folderName, 'page.tsx');
        try {
            // Ensure directory exists (it should)
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
