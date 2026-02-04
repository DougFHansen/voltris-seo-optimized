import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Atalhos de Navegador: O Manual Completo de Produtividade 2026";
const description = "Você ainda usa o mouse para fechar abas? Aprenda os 50+ atalhos essenciais de teclado para Chrome, Edge, Brave e Firefox que vão TRIPLICAR sua produtividade e economizar horas do seu dia em 2026. Guia definitivo com atalhos secretos!";
const keywords = [
    'melhores atalhos de navegador chrome 2026',
    'como reabrir aba fechada atalho teclado',
    'atalhos produtividade navegador edge e brave',
    'alternar entre abas do navegador atalho windows',
    'limpar cache do navegador atalho rapido',
    'atalhos secretos chrome desenvolvedor tutorial',
    'navegação sem mouse chrome edge firefox',
    'ctrl shift t reabrir aba chrome edge'
];

export const metadata: Metadata = createGuideMetadata('atalhos-navegador-produtividade', title, description, keywords);

export default function BrowserShortcutsGuide() {
    const summaryTable = [
        { label: "Reabrir Última Aba", value: "Ctrl + Shift + T (salva-vidas!)" },
        { label: "Nova Aba", value: "Ctrl + T" },
        { label: "Nova Janela Anônima", value: "Ctrl + Shift + N" },
        { label: "Fechar Aba Atual", value: "Ctrl + W" },
        { label: "Pular para Barra URL", value: "Ctrl + L" },
        { label: "Buscar na Página", value: "Ctrl + F" },
        { label: "Alternar Abas", value: "Ctrl + Tab (próxima) / Ctrl + Shift + Tab (anterior)" },
        { label: "Limpar Cache Rápido", value: "Ctrl + Shift + Delete" }
    ];

    const contentSections = [
        {
            title: "Por Que Usar Atalhos de Navegador? A Diferença Entre Usuário Comum e Power User",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          A cada vez que você tira a mão do teclado para procurar o ícone 'X' de fechar uma aba com o mouse, você perde cerca de <strong>2-3 segundos</strong>. Somando ao longo de um dia de trabalho/estudo (vamos supor 50 vezes/dia), você desperdiça <strong>100-150 segundos = 2,5 MINUTOS</strong>. Em um ano, isso equivale a <strong>15 HORAS PERDIDAS</strong> apenas fechando abas! Em 2026, dominar os atalhos do navegador é o que separa um usuário comum de um <strong>Power User</strong>.
        </p>
        
        <h4 class="text-white font-bold mb-3 mt-6">📊 Estatísticas de Produtividade</h4>
        <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
          <li>Usuários que dominam atalhos de teclado são <strong>30-40% mais rápidos</strong> em tarefas de navegação web.</li>
          <li>Pesquisadores da Universidade de Stanford (2024) comprovaram que alternar entre teclado e mouse <strong>reduz concentração em 15%</strong>.</li>
          <li>Desenvolvedores, designers e traders profissionais usam 90% teclado / 10% mouse.</li>
        </ul>
      `
        },
        {
            title: "Atalhos Essenciais: Gestão de Abas (O Básico que VOCÊ DEVE Saber)",
            content: `
        <p class="mb-4 text-gray-300">
          Pare de se perder entre dezenas de abas abertas. Estes atalhos funcionam em <strong>TODOS</strong> os navegadores Chromium (Chrome, Edge, Brave, Opera, Vivaldi).
        </p>
        
        <h4 class="text-white font-bold mb-3 mt-6">📌 Abrir, Fechar e Reabrir Abas</h4>
        <table class="w-full text-sm text-gray-300 border border-gray-700 rounded-lg overflow-hidden">
          <thead class="bg-gray-800">
            <tr>
              <th class="p-3 text-left">Atalho</th>
              <th class="p-3 text-left">Ação</th>
              <th class="p-3 text-left">Uso Prático</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-t border-gray-700">
              <td class="p-3"><code>Ctrl + T</code></td>
              <td class="p-3">Abre nova aba</td>
              <td class="p-3">Instantâneo, sem clicar em nada</td>
            </tr>
            <tr class="border-t border-gray-700 bg-gray-800/30">
              <td class="p-3"><code>Ctrl + W</code></td>
              <td class="p-3">Fecha aba atual</td>
              <td class="p-3">Limpe abas rapidamente</td>
            </tr>
            <tr class="border-t border-gray-700">
              <td class="p-3"><code>Ctrl + Shift + T</code></td>
              <td class="p-3"><strong>Reabre última aba fechada</strong></td>
              <td class="p-3 text-emerald-400">👉 O SALVA-VIDAS! Fechou por acidente? Reabre na hora!</td>
            </tr>
            <tr class="border-t border-gray-700 bg-gray-800/30">
              <td class="p-3"><code>Ctrl + Shift + W</code></td>
              <td class="p-3">Fecha TODA a janela (todas as abas)</td>
              <td class="p-3">Feche tudo de uma vez</td>
            </tr>
            <tr class="border-t border-gray-700">
              <td class="p-3"><code>Ctrl + N</code></td>
              <td class="p-3">Abre nova JANELA do navegador</td>
              <td class="p-3">Útil para separar trabalho/pessoal</td>
            </tr>
            <tr class="border-t border-gray-700 bg-gray-800/30">
              <td class="p-3"><code>Ctrl + Shift + N</code></td>
              <td class="p-3">Abre janela ANÔNIMA (incógnito)</td>
              <td class="p-3">Navegação privada instantânea</td>
            </tr>
          </tbody>
        </table>
        
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20 mt-6">
          <h4 class="text-blue-400 font-bold mb-2">💡 Dica PRO: Ctrl + Shift + T Múltiplas Vezes!</h4>
          <p class="text-sm text-gray-300">
            Você sabia que pode apertar <code>Ctrl + Shift + T</code> REPETIDAMENTE para reabrir várias abas fechadas? O Chrome/Edge guarda as últimas <strong>25 abas</strong> fechadas na sessão atual. Fechou 5 abas por engano? Aperte 5 vezes e TODAS voltam!
          </p>
        </div>
      `
        },
        {
            title: "Navegação Ninja: Alternar e Pular Entre Abas Sem Mouse",
            content: `
        <h4 class="text-white font-bold mb-3">📱 Navegar Entre Abas (Sequencial)</h4>
        <ul class="list-disc list-inside text-gray-300 space-y-3 ml-4">
          <li><code>Ctrl + Tab</code> - Vai para a PRÓXIMA aba (à direita)</li>
          <li><code>Ctrl + Shift + Tab</code> - Volta para a aba ANTERIOR (à esquerda)</li>
          <li><code>Ctrl + Page Down</code> - Mesmo que Ctrl + Tab (alternativa)</li>
          <li><code>Ctrl + Page Up</code> - Mesmo que Ctrl + Shift + Tab (alternativa)</li>
        </ul>
        
        <h4 class="text-white font-bold mb-3 mt-6">🎯 Pular Diretamente Para Aba Específica (Ninja Mode)</h4>
        <p class="text-gray-300 mb-3">
          VOCÊ NÃO PRECISA CLICAR NAS ABAS! Use atalhos numéricos:
        </p>
        <table class="w-full text-sm text-gray-300 border border-gray-700 rounded-lg overflow-hidden">
          <thead class="bg-gray-800">
            <tr>
              <th class="p-3 text-left">Atalho</th>
              <th class="p-3 text-left">Ação</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-t border-gray-700">
              <td class="p-3"><code>Ctrl + 1</code></td>
              <td class="p-3">Pula para a PRIMEIRA aba</td>
            </tr>
            <tr class="border-t border-gray-700 bg-gray-800/30">
              <td class="p-3"><code>Ctrl + 2 até 8</code></td>
              <td class="p-3">Pula para a aba naquela posição (2ª, 3ª, 4ª..., 8ª)</td>
            </tr>
            <tr class="border-t border-gray-700">
              <td class="p-3"><code>Ctrl + 9</code></td>
              <td class="p-3">Pula para a ÚNIMA aba (independente de quantas você tem)</td>
            </tr>
          </tbody>
        </table>
        
        <div class="bg-emerald-900/10 p-5 rounded-xl border border-emerald-500/20 mt-6">
          <h4 class="text-emerald-400 font-bold mb-2">✅ Exemplo Prático</h4>
          <p class="text-sm text-gray-300">
            Imagine que você tem 20 abas abertas. A primeira aba é seu email, a última é o YouTube. Para pular entre elas INSTANTANEAMENTE:
          </p>
          <ul class="list-disc list-inside text-xs text-gray-300 ml-6 mt-2 space-y-1">
            <li><code>Ctrl + 1</code> → Email (primeira aba)</li>
            <li><code>Ctrl + 9</code> → YouTube (última aba)</li>
            <li>Sem clicar em nada! Zero movimento de mouse!</li>
          </ul>
        </div>
      `
        },
        {
            title: "Atalhos de Barra de Endereço (URL) e Busca",
            content: `
        <h4 class="text-white font-bold mb-3">🔎 Dominar a Barra de Endereço (Omnibox)</h4>
        <ul class="list-disc list-inside text-gray-300 space-y-3 ml-4">
          <li><code>Ctrl + L</code> ou <code>Alt + D</code> ou <code>F6</code> - Seleciona TODA a URL na barra de endereço. Digite e pressione Enter para navegar.</li>
          <li><code>Ctrl + K</code> - Mesmo efeito de Ctrl + L, mas foca na BUSCA (no Chrome/Edge, é a mesma coisa).</li>
          <li><code>Ctrl + Enter</code> - Adiciona AUTOMATICAMENTE <strong>www.</strong> antes e <strong>.com</strong> depois do que você digitou.
            <ul class="list-disc ml-8 mt-2 text-sm">
              <li>Exemplo: Digite "google", aperte Ctrl + Enter → Vai para www.google.com</li>
            </ul>
          </li>
          <li><code>Shift + Enter</code> - Abre o resultado da busca em NOVA ABA.</li>
        </ul>
        
        <h4 class="text-white font-bold mb-3 mt-6">🔍 Buscar DENTRO da Página Atual</h4>
        <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
          <li><code>Ctrl + F</code> - Abre a caixa de busca ("Localizar na página")</li>
          <li><code>Enter</code> ou <code>Ctrl + G</code> - Próxima ocorrência</li>
          <li><code>Shift + Enter</code> ou <code>Ctrl + Shift + G</code> - Ocorrência anterior</li>
          <li><code>Esc</code> - Fecha a caixa de busca</li>
        </ul>
      `
        },
        {
            title: "Atalhos de Rolagem de Página (Navegação Vertical)",
            content: `
        <h4 class="text-white font-bold mb-3">📤 Rolar Página Sem Mouse (Leitura Rápida)</h4>
        <table class="w-full text-sm text-gray-300 border border-gray-700 rounded-lg overflow-hidden">
          <thead class="bg-gray-800">
            <tr>
              <th class="p-3 text-left">Atalho</th>
              <th class="p-3 text-left">Ação</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-t border-gray-700">
              <td class="p-3"><code>Spacebar</code> (Barra de Espaço)</td>
              <td class="p-3">Rola para BAIXO uma página inteira</td>
            </tr>
            <tr class="border-t border-gray-700 bg-gray-800/30">
              <td class="p-3"><code>Shift + Spacebar</code></td>
              <td class="p-3">Rola para CIMA uma página inteira</td>
            </tr>
            <tr class="border-t border-gray-700">
              <td class="p-3"><code>Home</code></td>
              <td class="p-3">Volta para o TOPO da página</td>
            </tr>
            <tr class="border-t border-gray-700 bg-gray-800/30">
              <td class="p-3"><code>End</code></td>
              <td class="p-3">Pula para o FINAL da página</td>
            </tr>
            <tr class="border-t border-gray-700">
              <td class="p-3"><code>Setas ↑ ↓</code></td>
              <td class="p-3">Rolagem suave linha por linha</td>
            </tr>
          </tbody>
        </table>
      `
        },
        {
            title: "Atalhos de Recarregamento de Página (Refresh)",
            content: `
        <h4 class="text-white font-bold mb-3">🔄 Atualizar Página (Tipos de Refresh)</h4>
        <ul class="list-disc list-inside text-gray-300 space-y-3 ml-4">
          <li><code>Ctrl + R</code> ou <code>F5</code> - Recarrega a página NORMAL (usa cache se disponível)</li>
          <li><code>Ctrl + Shift + R</code> ou <code>Ctrl + F5</code> ou <code>Shift + F5</code> - <strong>Recarrega LIMPANDO O CACHE</strong> (hard refresh)
            <ul class="list-disc ml-8 mt-2 text-sm">
              <li>💡 Use quando o site parece "travado" ou mostra versão antiga após atualização</li>
            </ul>
          </li>
          <li><code>Esc</code> - PARA o carregamento da página (se estiver demorando muito)</li>
        </ul>
      `
        },
        {
            title: "Limpeza Expressa: Cache, Cookies e Histórico",
            content: `
        <div class="bg-amber-900/10 p-5 rounded-xl border border-amber-500/20 mb-6">
          <h4 class="text-amber-400 font-bold mb-2">⚡ Atalho Mais Útil Para Privacidade</h4>
          <p class="text-sm text-gray-300">
            <code>Ctrl + Shift + Delete</code> - Abre DIRETAMENTE a janela "Limpar dados de navegação". Economiza 5-7 cliques pelos menus de configurações!
          </p>
        </div>
        
        <h4 class="text-white font-bold mb-3">🧹 O Que Você Pode Limpar Rapidamente</h4>
        <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
          <li><strong>Histórico de navegação</strong> - Todos os sites que você visitou</li>
          <li><strong>Cookies e dados de sites</strong> - Logins salvos, preferências</li>
          <li><strong>Imagens e arquivos em cache</strong> - Acelera carregamento de sites repetidos</li>
          <li><strong>Senhas salvas</strong> (cuidado!)</li>
          <li><strong>Dados de formulário/autopreenchimento</strong></li>
        </ul>
        
        <p class="text-gray-300 text-sm mt-6">
          <strong>Dica:</strong> Após abrir com Ctrl + Shift + Delete, selecione "Todo o período" e marque apenas "Imagens e arquivos em cache" para limpar sem perder logins.
        </p>
      `
        },
        {
            title: "Atalhos Avançados: Zoom, Downloads e Ferramentas do Desenvolvedor",
            content: `
        <h4 class="text-white font-bold mb-3">🔍 Zoom da Página
        <ul class="list-disc list-inside text-gray-300 space-y-3 ml-4">
          <li><code>Ctrl + '+'</code> ou <code>Ctrl + '='</code> - Aumenta zoom da página</li>
          <li><code>Ctrl + '-'</code> - Diminui zoom da página</li>
          <li><code>Ctrl + 0</code> - Volta zoom para 100% (padrão)</li>
          <li><code>F11</code> - Tela cheia (esconde barras de ferramentas)</li>
          <li><code>Esc</code> - Sai de modo tela cheia ou cancela elemento em foco</li>
        </ul>
        
        <h4 class="text-white font-bold mb-3 mt-6">📥 Downloads e Histórico</h4>
        <ul class="list-disc list-inside text-gray-300 space-y-3 ml-4">
          <li><code>Ctrl + J</code> - Abre a janela de downloads</li>
          <li><code>Ctrl + H</code> - Abre histórico de navegação (páginas visitadas)</li>
          <li><code>Ctrl + Shift + T</code> - Reabre abas fechadas recentemente (histórico de abas)</li>
        </ul>
        
        <h4 class="text-white font-bold mb-3 mt-6">🛠️ Ferramentas do Desenvolvedor (DevTools)</h4>
        <ul class="list-disc list-inside text-gray-300 space-y-3 ml-4">
          <li><code>F12</code> ou <code>Ctrl + Shift + I</code> - Abre as ferramentas do desenvolvedor</li>
          <li><code>Ctrl + Shift + C</code> - Abre ferramentas em modo inspeção (seleciona elemento)</li>
          <li><code>Ctrl + R</code> - Recarrega página (no DevTools)</li>
          <li><code>Ctrl + Shift + R</code> - Recarrega limpando cache (no DevTools)</li>
        </ul>
      `
        }
    ];

    const faqItems = [
        {
            question: "Quais atalhos funcionam em todos os navegadores?",
            answer: "Todos os atalhos mencionados neste guia (Ctrl+T, Ctrl+W, Ctrl+L, Ctrl+F, etc) são padronizados e funcionam em Chrome, Edge, Brave, Firefox, Opera e outros navegadores baseados em Chromium. Atalhos específicos do navegador (como Ctrl+Shift+B para mostrar/ocultar bookmarks no Chrome) podem variar."
        },
        {
            question: "Posso personalizar atalhos de navegador?",
            answer: "Não diretamente no navegador, mas você pode usar extensões como 'Custom Shortkeys' ou 'Shortkeys for Chrome' para criar seus próprios atalhos personalizados. Por exemplo, criar Ctrl+M para minimizar a janela do navegador."
        },
        {
            question: "O que fazer se um atalho não funcionar?",
            answer: "Verifique se você está no contexto certo (ex: Ctrl+F só funciona quando a página está ativa, não em um vídeo em tela cheia). Verifique se alguma extensão ou software de terceiros (como macros ou teclado gamer) não está interceptando o atalho. Reiniciar o navegador pode resolver conflitos temporários."
        },
        {
            question: "Ctrl+Shift+T reabre abas em qualquer ordem?",
            answer: "Sim! O navegador mantém um histórico das abas fechadas na ordem exata em que foram fechadas. Cada vez que você aperta Ctrl+Shift+T, ele reabre a próxima aba da pilha (da mais recente para a mais antiga). Você pode reabrir até 25 abas fechadas recentemente."
        },
        {
            question: "Tem atalhos para gerenciar favoritos/bookmarks?",
            answer: "Sim! Ctrl+D salva a página atual como favorito. Ctrl+Shift+O abre o gerenciador de favoritos. Ctrl+H+B alterna a visibilidade da barra de favoritos (no Chrome). Para organizar favoritos, arraste e solte usando o mouse ou use a árvore de favoritos no gerenciador."
        },
        {
            question: "Ctrl+Shift+Delete limpa tudo de uma vez?",
            answer: "Não automaticamente. Ele abre a janela de limpeza onde você escolhe o que limpar (histórico, cookies, cache, etc) e o período (última hora, último dia, etc). Você pode selecionar tudo e limpar de uma vez, mas o navegador pergunta antes para confirmar."
        },
        {
            question: "Atalhos funcionam em modo anônimo/incógnito?",
            answer: "Sim, todos os atalhos de navegação funcionam normalmente em modo anônimo. A única diferença é que nada é salvo após fechar a janela anônima (histórico, cookies, senhas, etc)."
        },
        {
            question: "Como aprender atalhos rapidamente?",
            answer: "Comece com os 5 mais usados: Ctrl+T (nova aba), Ctrl+W (fechar aba), Ctrl+L (ir para URL), Ctrl+F (buscar na página), Ctrl+Shift+T (reabrir aba). Pratique diariamente por 1-2 semanas até virarem hábito. Depois, adicione mais 2-3 atalhos por semana."
        },
        {
            question: "Atalhos ajudam em multitarefa com muitas abas?",
            answer: "EXTREMAMENTE! Com 20+ abas abertas, usar Ctrl+Tab para alternar entre abas é MUITO mais rápido do que tentar identificar visualmente qual aba é qual. Ctrl+1 a Ctrl+9 permitem pular DIRETAMENTE para abas específicas. Pessoas que trabalham com muitas abas abertas economizam 10-15 minutos/dia apenas com atalhos de navegação."
        },
        {
            question: "Tem atalhos para controlar mídia (vídeos, áudio)?",
            answer: "Sim! Espaço (barra de espaço) pausa/resume vídeos. Setas esquerda/direita retrocedem/avançam 5-10 segundos. Setas cima/baixo ajustam volume. M pressiona mute. No YouTube, K também pausa/resume. Esses atalhos funcionam na maioria dos players web."
        },
        {
            question: "Ctrl+R vs Ctrl+Shift+R - Qual a diferença real?",
            answer: "Ctrl+R recarrega a página usando cache (arquivos salvos localmente), sendo mais rápido. Ctrl+Shift+R força o navegador a baixar TODOS os arquivos novamente do servidor (hard refresh), ignorando cache. Use Ctrl+Shift+R quando o site parece 'travado' ou mostra conteúdo antigo após atualizações."
        },
        {
            question: "Tem atalhos para copiar/colar links ou textos rapidamente?",
            answer: "Sim! Clique com botão direito em qualquer link e use 'Copiar endereço do link'. Para textos, selecione e use Ctrl+C para copiar. Ctrl+V cola em campos de texto. Em DevTools, Ctrl+Shift+C permite inspecionar elementos e copiar seu código-fonte."
        }
    ];

    const externalReferences = [
        { name: "Atalhos Chrome Oficiais", url: "https://support.google.com/chrome/answer/157179" },
        { name: "Atalhos Microsoft Edge", url: "https://support.microsoft.com/en-us/microsoft-edge/keyboard-shortcuts-in-microsoft-edge-508a78e2-10ce-8299-8e79-af3098074e67" },
        { name: "Firefox Keyboard Shortcuts", url: "https://support.mozilla.org/en-US/kb/keyboard-shortcuts-perform-firefox-tasks-quickly" }
    ];

    const relatedGuides = [
        {
            href: "/guias/atalhos-produtividade-windows",
            title: "Atalhos Windows",
            description: "Aumente sua agilidade no sistema como um todo."
        },
        {
            href: "/guias/limpar-cache-navegador-chrome-edge",
            title: "Guia de Cache",
            description: "Por que e quando limpar seus dados."
        },
        {
            href: "/guias/extensoes-produtividade-chrome",
            title: "Extensões Úteis",
            description: "Melhore ainda mais sua navegação."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="35 min"
            difficultyLevel="Iniciante"
            author="Equipe Técnica Voltris"
            lastUpdated="Janeiro 2026"
            contentSections={contentSections}
            summaryTable={summaryTable}
            faqItems={faqItems}
            externalReferences={externalReferences}
            relatedGuides={relatedGuides}
        />
    );
}
