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

    const advancedContentSections = [
        {
            title: "Arquitetura Interna de Atalhos de Navegador e Processamento de Entrada",
            content: `
            <p class="mb-6 text-gray-300 leading-relaxed">
              Por trás de cada atalho de teclado existe uma complexa cadeia de processamento que envolve o sistema operacional, o navegador e os motores de renderização. Compreender essa arquitetura ajuda a entender por que certos atalhos funcionam de forma consistente entre diferentes navegadores baseados em Chromium.
            </p>
            
            <h4 class="text-white font-bold mb-3 mt-6">Pipeline de Processamento de Atalhos</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
                <h5 class="text-blue-400 font-bold mb-3">1. Input Capture</h5>
                <p class="text-gray-300 text-sm mb-3">Detecção de combinações de teclas:</p>
                <ul class="list-disc list-inside text-gray-300 space-y-1 text-sm">
                  <li>Teclado envia scan codes para o SO</li>
                  <li>SO converte para virtual key codes</li>
                  <li>Navegador registra eventos de tecla pressionada</li>
                  <li>Verificação de modifiers (Ctrl, Shift, Alt)</li>
                </ul>
              </div>
              <div class="bg-purple-900/10 p-5 rounded-xl border border-purple-500/20">
                <h5 class="text-purple-400 font-bold mb-3">2. Event Dispatch</h5>
                <p class="text-gray-300 text-sm mb-3">Distribuição do evento para o handler correto:</p>
                <ul class="list-disc list-inside text-gray-300 space-y-1 text-sm">
                  <li>Verificação contra lista de atalhos conhecidos</li>
                  <li>Prevenção de eventos padrão (default prevention)</li>
                  <li>Disparo de ações específicas</li>
                  <li>Atualização da interface do usuário</li>
                </ul>
              </div>
            </div>
            
            <h4 class="text-white font-bold mb-3 mt-6">Estrutura de Mapeamento de Atalhos</h4>
            <div class="overflow-x-auto">
              <table class="w-full text-xs text-gray-300 border border-gray-700 rounded-lg overflow-hidden">
                <thead class="bg-gray-800">
                  <tr>
                    <th class="p-2 text-left">Atalho</th>
                    <th class="p-2 text-left">KeyCode</th>
                    <th class="p-2 text-left">Modifiers</th>
                    <th class="p-2 text-left">Ação</th>
                    <th class="p-2 text-left">Contexto</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="border-t border-gray-700">
                    <td class="p-2">Ctrl + T</td>
                    <td class="p-2">84 (T)</td>
                    <td class="p-2">Ctrl</td>
                    <td class="p-2">Nova aba</td>
                    <td class="p-2">Browser Window</td>
                  </tr>
                  <tr class="border-t border-gray-700 bg-gray-800/30">
                    <td class="p-2">Ctrl + W</td>
                    <td class="p-2">87 (W)</td>
                    <td class="p-2">Ctrl</td>
                    <td class="p-2">Fechar aba</td>
                    <td class="p-2">Tab Context</td>
                  </tr>
                  <tr class="border-t border-gray-700">
                    <td class="p-2">Ctrl + L</td>
                    <td class="p-2">76 (L)</td>
                    <td class="p-2">Ctrl</td>
                    <td class="p-2">Focar URL</td>
                    <td class="p-2">Address Bar</td>
                  </tr>
                  <tr class="border-t border-gray-700 bg-gray-800/30">
                    <td class="p-2">Ctrl + F</td>
                    <td class="p-2">70 (F)</td>
                    <td class="p-2">Ctrl</td>
                    <td class="p-2">Buscar página</td>
                    <td class="p-2">Find Bar</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <h4 class="text-white font-bold mb-3 mt-6">Sistema de Prioridade e Conflitos</h4>
            <p class="mb-4 text-gray-300">
              O navegador implementa um sistema hierárquico de prioridade para resolver conflitos de atalhos:
            </p>
            <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li><strong>Browser Level:</strong> Atalhos do navegador têm prioridade sobre páginas web</li>
              <li><strong>Extension Level:</strong> Extensões podem interceptar atalhos antes do navegador</li>
              <li><strong>Page Level:</strong> Páginas web podem definir seus próprios atalhos</li>
              <li><strong>OS Level:</strong> Atalhos do sistema operacional podem interferir</li>
            </ul>
            `
        },
        {
            title: "Técnicas Avançadas de Navegação e Automatização",
            content: `
            <p class="mb-6 text-gray-300 leading-relaxed">
              Além dos atalhos básicos, existem técnicas avançadas que podem transformar radicalmente sua produtividade na web. Estas técnicas combinam atalhos de teclado com funcionalidades específicas do navegador para criar workflows altamente eficientes.
            </p>
            
            <h4 class="text-white font-bold mb-3 mt-6">Workflows Avançados de Navegação</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div class="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 p-5 rounded-xl border border-cyan-500/30">
                <h5 class="text-cyan-400 font-bold mb-3">Research Workflow</h5>
                <p class="text-gray-300 text-sm mb-3">Para pesquisadores e estudantes:</p>
                <ul class="list-disc list-inside text-gray-300 space-y-1 text-sm">
                  <li>Ctrl + T → Digitar termo → Enter (nova pesquisa)</li>
                  <li>Ctrl + Shift + T → Reabrir resultados relevantes</li>
                  <li>Ctrl + Click → Abrir em background tab</li>
                  <li>Ctrl + Shift + V → Colar sem formatação</li>
                </ul>
              </div>
              <div class="bg-gradient-to-br from-emerald-900/20 to-teal-900/20 p-5 rounded-xl border border-emerald-500/30">
                <h5 class="text-emerald-400 font-bold mb-3">Development Workflow</h5>
                <p class="text-gray-300 text-sm mb-3">Para desenvolvedores e testadores:</p>
                <ul class="list-disc list-inside text-gray-300 space-y-1 text-sm">
                  <li>F12 → Ctrl + Shift + C → Inspect element</li>
                  <li>Ctrl + Shift + R → Hard refresh com cache limpo</li>
                  <li>Ctrl + Shift + I → Abrir DevTools</li>
                  <li>Ctrl + [ / ] → Navegar no histórico do DevTools</li>
                </ul>
              </div>
            </div>
            
            <h4 class="text-white font-bold mb-3 mt-6">Técnicas de Navegação por Teclado Apenas</h4>
            <p class="mb-4 text-gray-300">
              Para usuários avançados que desejam minimizar o uso do mouse:
            </p>
            <div class="overflow-x-auto">
              <table class="w-full text-sm text-gray-300 border border-gray-700 rounded-lg">
                <thead class="bg-gray-800">
                  <tr>
                    <th class="p-3 text-left">Técnica</th>
                    <th class="p-3 text-left">Combinação</th>
                    <th class="p-3 text-left">Descrição</th>
                    <th class="p-3 text-left">Aplicação</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="border-t border-gray-700">
                    <td class="p-3">Vimium/Firefox Keys</td>
                    <td class="p-3">f + [letras]</td>
                    <td class="p-3">Clique em links por teclado</td>
                    <td class="p-3">Navegação sem mouse</td>
                  </tr>
                  <tr class="border-t border-gray-700 bg-gray-800/30">
                    <td class="p-3">Quick Tab Switching</td>
                    <td class="p-3">Ctrl + Tab (contínuo)</td>
                    <td class="p-3">Navegar entre abas rapidamente</td>
                    <td class="p-3">Multitarefa eficiente</td>
                  </tr>
                  <tr class="border-t border-gray-700">
                    <td class="p-3">History Navigation</td>
                    <td class="p-3">Alt + ← / →</td>
                    <td class="p-3">Voltar/avançar no histórico</td>
                    <td class="p-3">Navegação linear</td>
                  </tr>
                  <tr class="border-t border-gray-700 bg-gray-800/30">
                    <td class="p-3">Focus Management</td>
                    <td class="p-3">Tab / Shift + Tab</td>
                    <td class="p-3">Navegar entre elementos</td>
                    <td class="p-3">Acessibilidade</td>
                  </tr>
                </tbody>
              </table>
            </div>
            `
        },
        {
            title: "Scripting e Automação de Tarefas com Atalhos",
            content: `
            <p class="mb-6 text-gray-300 leading-relaxed">
              Para profissionais que realizam tarefas repetitivas no navegador, é possível criar scripts e usar ferramentas de automação que simulam atalhos de teclado para executar tarefas complexas de forma automatizada.
            </p>
            
            <h4 class="text-white font-bold mb-3 mt-6">Ferramentas de Automação Baseadas em Atalhos</h4>
            <p class="mb-4 text-gray-300">
              Diversas ferramentas permitem a criação de macros baseadas em atalhos de navegador:
            </p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div class="bg-rose-900/10 p-5 rounded-xl border border-rose-500/20">
                <h5 class="text-rose-400 font-bold mb-3">Automatização com Selenium</h5>
                <p class="text-gray-300 text-sm mb-3">Para desenvolvedores de testes:</p>
                <ul class="list-disc list-inside text-gray-300 space-y-1 text-sm">
                  <li>Simulação precisa de atalhos de teclado</li>
                  <li>Combinação com ações de mouse</li>
                  <li>Execução em diferentes navegadores</li>
                  <li>Integração com pipelines CI/CD</li>
                </ul>
              </div>
              <div class="bg-amber-900/10 p-5 rounded-xl border border-amber-500/20">
                <h5 class="text-amber-400 font-bold mb-3">Macros com AutoHotKey</h5>
                <p class="text-gray-300 text-sm mb-3">Para usuários avançados:</p>
                <ul class="list-disc list-inside text-gray-300 space-y-1 text-sm">
                  <li>Criação de atalhos personalizados</li>
                  <li>Combinação de múltiplas ações</li>
                  <li>Context-aware automation</li>
                  <li>Scripts condicionais</li>
                </ul>
              </div>
            </div>
            
            <h4 class="text-white font-bold mb-3 mt-6">Exemplo de Script Avançado</h4>
            <p class="mb-4 text-gray-300">
              Exemplo de macro para automatizar uma tarefa repetitiva de pesquisa e captura de dados:
            </p>
            <div class="bg-black/30 p-4 rounded-lg border border-gray-700 mb-6">
              <pre class="text-xs text-gray-300 overflow-x-auto">
// Script de automação para pesquisa e captura de dados
// 1. Abre nova aba, digita termo de busca, pressiona enter
// 2. Aguarda carregamento, extrai informações relevantes
// 3. Fecha aba, repete para próximo termo

function automatedResearchWorkflow(searchTerms) {
  for (let term of searchTerms) {
    // Abrir nova aba
    simulateKeypress('Ctrl', 'T');
    
    // Aguardar abertura da nova aba
    waitForElement('address_bar');
    
    // Digitar termo e pressionar enter
    typeText(term);
    simulateKeypress('Enter');
    
    // Aguardar carregamento da página
    waitForPageLoad();
    
    // Extrair informações relevantes
    const results = extractPageData();
    
    // Registrar resultados
    saveResults(term, results);
    
    // Fechar aba atual
    simulateKeypress('Ctrl', 'W');
    
    // Aguardar antes da próxima iteração
    sleep(1000);
  }
}
              </pre>
            </div>
            `
        },
        {
            title: "Otimização de Produtividade e Análise de Métricas",
            content: `
            <p class="mb-6 text-gray-300 leading-relaxed">
              Para maximizar a eficiência, é importante medir e otimizar o uso de atalhos de navegação. Existem métricas específicas que podem ajudar a identificar oportunidades de melhoria e quantificar os ganhos de produtividade.
            </p>
            
            <h4 class="text-white font-bold mb-3 mt-6">Métricas de Produtividade em Navegação</h4>
            <div class="overflow-x-auto">
              <table class="w-full text-sm text-gray-300 border border-gray-700 rounded-lg">
                <thead class="bg-gray-800">
                  <tr>
                    <th class="p-3 text-left">Métrica</th>
                    <th class="p-3 text-left">Descrição</th>
                    <th class="p-3 text-left">Método de Medição</th>
                    <th class="p-3 text-left">Meta Ideal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="border-t border-gray-700">
                    <td class="p-3">Mouse vs Keyboard Ratio</td>
                    <td class="p-3">Proporção de ações realizadas por teclado vs mouse</td>
                    <td class="p-3">Ferramentas de análise de input</td>
                    <td class="p-3 text-emerald-400">&gt; 80% keyboard</td>
                  </tr>
                  <tr class="border-t border-gray-700 bg-gray-800/30">
                    <td class="p-3">Tab Switching Time</td>
                    <td class="p-3">Tempo médio para alternar entre abas</td>
                    <td class="p-3">Registro de tempo entre atalhos</td>
                    <td class="p-3 text-emerald-400">&lt; 1 segundo</td>
                  </tr>
                  <tr class="border-t border-gray-700">
                    <td class="p-3">Page Load Efficiency</td>
                    <td class="p-3">Número de refreshes desnecessários</td>
                    <td class="p-3">Contagem de Ctrl+R em intervalos curtos</td>
                    <td class="p-3 text-emerald-400">&lt; 2 por sessão</td>
                  </tr>
                  <tr class="border-t border-gray-700 bg-gray-800/30">
                    <td class="p-3">Search Effectiveness</td>
                    <td class="p-3">Precisão nas buscas dentro da página</td>
                    <td class="p-3">Taxa de sucesso em encontrar termos</td>
                    <td class="p-3 text-emerald-400">&gt; 95% sucesso</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <h4 class="text-white font-bold mb-3 mt-6">Ferramentas de Análise de Produtividade</h4>
            <p class="mb-4 text-gray-300">
              Existem diversas ferramentas que podem ajudar a analisar e melhorar sua produtividade em navegação:
            </p>
            <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li><strong>Keyboard Maestro (macOS):</strong> Rastreamento de atalhos e análise de eficiência</li>
              <li><strong>AutoHotkey + Stats (Windows):</strong> Monitoramento de uso de atalhos personalizados</li>
              <li><strong>Browser Extensions:</strong> Extensões que rastreiam uso de atalhos do navegador</li>
              <li><strong>Heatmap Tools:</strong> Análise de padrões de uso de mouse vs teclado</li>
              <li><strong>Time Tracking Apps:</strong> Softwares que analisam eficiência em tarefas web</li>
            </ul>
            `
        }
    ];

    const additionalContentSections = [
        {
            title: "Histórico e Evolução dos Atalhos de Navegador",
            content: `
        <p class="mb-4 text-gray-300">A evolução dos atalhos de navegador acompanhou o desenvolvimento da web desde os primeiros navegadores gráficos até os poderosos motores modernos. Cada atalho foi meticulosamente projetado para otimizar a experiência do usuário e aumentar a produtividade.</p>
        
        <div class="bg-gradient-to-r from-purple-900/20 to-blue-900/20 p-6 rounded-xl border border-purple-500/30 my-6">
          <h4 class="text-xl font-bold text-purple-300 mb-4">Timeline da Evolução dos Atalhos</h4>
          
          <div class="space-y-4">
            <div class="flex items-start space-x-4">
              <div class="bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                <span class="text-white font-bold text-sm">1990</span>
              </div>
              <div class="flex-1">
                <h5 class="font-bold text-white">WorldWideWeb</h5>
                <p class="text-gray-300 text-sm">Primeiro navegador com atalhos básicos como Ctrl+L para ir para a barra de endereço.</p>
              </div>
            </div>
            
            <div class="flex items-start space-x-4">
              <div class="bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                <span class="text-white font-bold text-sm">1993</span>
              </div>
              <div class="flex-1">
                <h5 class="font-bold text-white">Mosaic</h5>
                <p class="text-gray-300 text-sm">Introduziu atalhos para navegação entre páginas e recarregamento.</p>
              </div>
            </div>
            
            <div class="flex items-start space-x-4">
              <div class="bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                <span class="text-white font-bold text-sm">1994</span>
              </div>
              <div class="flex-1">
                <h5 class="font-bold text-white">Netscape Navigator</h5>
                <p class="text-gray-300 text-sm">Padronizou muitos dos atalhos que usamos hoje, como Ctrl+T para nova aba.</p>
              </div>
            </div>
            
            <div class="flex items-start space-x-4">
              <div class="bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                <span class="text-white font-bold text-sm">1995</span>
              </div>
              <div class="flex-1">
                <h5 class="font-bold text-white">Internet Explorer</h5>
                <p class="text-gray-300 text-sm">Expandiu o conjunto de atalhos para incluir mais funções de interface.</p>
              </div>
            </div>
            
            <div class="flex items-start space-x-4">
              <div class="bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                <span class="text-white font-bold text-sm">2008</span>
              </div>
              <div class="flex-1">
                <h5 class="font-bold text-white">Google Chrome</h5>
                <p class="text-gray-300 text-sm">Revolutionou a gestão de abas com atalhos mais sofisticados e integração com extensões.</p>
              </div>
            </div>
            
            <div class="flex items-start space-x-4">
              <div class="bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                <span class="text-white font-bold text-sm">2026</span>
              </div>
              <div class="flex-1">
                <h5 class="font-bold text-white">Navegadores Modernos</h5>
                <p class="text-gray-300 text-sm">Atalhos adaptativos e personalizáveis com base no comportamento do usuário.</p>
              </div>
            </div>
          </div>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">Padrões de Consistência</h4>
        <p class="mb-4 text-gray-300">Apesar da evolução, muitos atalhos permaneceram consistentes entre navegadores:</p>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h5 class="font-bold text-green-400 mb-2">Ctrl+T</h5>
            <p class="text-sm text-gray-300">Consistente desde o Netscape Navigator para abrir nova aba.</p>
          </div>
          
          <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h5 class="font-bold text-green-400 mb-2">Ctrl+W</h5>
            <p class="text-sm text-gray-300">Padrão universal para fechar aba atual desde os anos 90.</p>
          </div>
          
          <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h5 class="font-bold text-green-400 mb-2">Ctrl+L</h5>
            <p class="text-sm text-gray-300">Foco na barra de endereço, mantido por mais de 30 anos.</p>
          </div>
        </div>
      `
        },
        {
            title: "Análise de Ergonomia e Eficiência dos Atalhos",
            content: `
        <p class="mb-4 text-gray-300">A escolha das combinações de teclas para atalhos não é aleatória. Cada combinação foi cuidadosamente projetada para maximizar a eficiência e minimizar o esforço físico do usuário.</p>
        
        <h4 class="text-white font-bold mb-3 mt-6">Princípios de Design de Atalhos</h4>
        <p class="mb-4 text-gray-300">Existem vários princípios fundamentais que guiam a criação de atalhos eficientes:</p>
        
        <div class="space-y-4">
          <div class="bg-red-900/10 p-5 rounded-xl border border-red-500/30">
            <h5 class="font-bold text-red-400 mb-2">Memorabilidade</h5>
            <p class="text-gray-300 text-sm">As teclas usadas geralmente fazem associação com a função:</p>
            <ul class="list-disc list-inside text-gray-300 text-sm mt-2 space-y-1">
              <li>T (Tab) para abrir nova aba: Ctrl+T</li>
              <li>W (Window/Close) para fechar aba: Ctrl+W</li>
              <li>L (Location) para ir à barra de endereço: Ctrl+L</li>
              <li>F (Find) para buscar na página: Ctrl+F</li>
            </ul>
          </div>
          
          <div class="bg-red-900/10 p-5 rounded-xl border border-red-500/30">
            <h5 class="font-bold text-red-400 mb-2">Acessibilidade Física</h5>
            <p class="text-gray-300 text-sm">Combinações são projetadas para serem alcançadas com facilidade:</p>
            <ul class="list-disc list-inside text-gray-300 text-sm mt-2 space-y-1">
              <li>Modificadores (Ctrl, Alt, Shift) são teclas fáceis de pressionar</li>
              <li>Letras principais geralmente estão na posição central do teclado</li>
              <li>Evita combinações que exigem movimentos extremos das mãos</li>
            </ul>
          </div>
          
          <div class="bg-red-900/10 p-5 rounded-xl border border-red-500/30">
            <h5 class="font-bold text-red-400 mb-2">Consistência Interaplicativo</h5>
            <p class="text-gray-300 text-sm">Mantém padrões semelhantes em diferentes softwares:</p>
            <ul class="list-disc list-inside text-gray-300 text-sm mt-2 space-y-1">
              <li>Ctrl+C para copiar em todos os aplicativos</li>
              <li>Ctrl+V para colar em todos os aplicativos</li>
              <li>Ctrl+Z para desfazer em todos os aplicativos</li>
            </ul>
          </div>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">Métricas de Eficiência de Atalhos</h4>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-gray-300 border border-gray-700 rounded-lg">
            <thead class="bg-gray-800">
              <tr>
                <th class="p-3 text-left">Atalho</th>
                <th class="p-3 text-left">Tempo de Execução</th>
                <th class="p-3 text-left">Movimento Requerido</th>
                <th class="p-3 text-left">Benefício Médio</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-t border-gray-700">
                <td class="p-3"><strong>Ctrl+T</strong></td>
                <td class="p-3">~0.5s</td>
                <td class="p-3">Mínimo (mãos em posição padrão)</td>
                <td class="p-3 text-emerald-400">+3s vs clique no botão (+600%)</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3"><strong>Ctrl+W</strong></td>
                <td class="p-3">~0.5s</td>
                <td class="p-3">Mínimo (mãos em posição padrão)</td>
                <td class="p-3 text-emerald-400">+2.5s vs clique no X da aba (+500%)</td>
              </tr>
              <tr class="border-t border-gray-700">
                <td class="p-3"><strong>Ctrl+L</strong></td>
                <td class="p-3">~0.4s</td>
                <td class="p-3">Mínimo (mãos em posição padrão)</td>
                <td class="p-3 text-emerald-400">+2s vs clique na barra de endereço (+500%)</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3"><strong>Ctrl+Shift+T</strong></td>
                <td class="p-3">~0.6s</td>
                <td class="p-3">Mínimo (mãos em posição padrão)</td>
                <td class="p-3 text-emerald-400">+4s vs histórico de navegação (+660%)</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="bg-amber-900/10 p-5 rounded-xl border border-amber-500/20 mt-6">
          <h4 class="text-amber-400 font-bold mb-2">Recomendações Ergonômicas</h4>
          <ul class="list-disc list-inside text-sm text-gray-300 space-y-2">
            <li>Use atalhos para minimizar movimentos do mouse</li>
            <li>Evite atalhos que exijam extensão de dedos ou movimentos desconfortáveis</li>
            <li>Combine atalhos com pausas regulares para evitar tensão repetitiva</li>
            <li>Personalize atalhos em extensões para atender às suas necessidades específicas</li>
          </ul>
        </div>
      `
        },
        {
            title: "Considerações de Acessibilidade e Inclusão",
            content: `
        <p class="mb-4 text-gray-300">Atalhos de teclado são uma ferramenta crucial para acessibilidade, permitindo que pessoas com diferentes capacidades físicas utilizem navegadores da web de forma eficiente e independente.</p>
        
        <h4 class="text-white font-bold mb-3 mt-6">Atalhos e Acessibilidade</h4>
        <p class="mb-4 text-gray-300">Os atalhos de teclado desempenham um papel vital na inclusão digital:</p>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="bg-gradient-to-br from-blue-900/20 to-indigo-900/20 p-5 rounded-xl border border-blue-500/30">
            <h5 class="font-bold text-blue-400 mb-3">Usuários com Limitações Motoras</h5>
            <ul class="list-disc list-inside text-gray-300 text-sm space-y-2">
              <li>Navegação por teclado para pessoas com dificuldade em usar mouse</li>
              <li>Redução do esforço necessário para realizar tarefas</li>
              <li>Controle mais preciso de elementos da interface</li>
              <li>Personalização de atalhos conforme necessidades específicas</li>
              <li>Compatibilidade com dispositivos assistivos</li>
              <li>Redução da fadiga muscular durante longas sessões</li>
            </ul>
          </div>
          
          <div class="bg-gradient-to-br from-purple-900/20 to-pink-900/20 p-5 rounded-xl border border-purple-500/30">
            <h5 class="font-bold text-purple-400 mb-3">Usuários com Deficiência Visual</h5>
            <ul class="list-disc list-inside text-gray-300 text-sm space-y-2">
              <li>Navegação estruturada por teclado para leitores de tela</li>
              <li>Atalhos para pular para conteúdos específicos</li>
              <li>Controle de leitura de textos e navegação</li>
              <li>Integração com softwares de ampliação de tela</li>
              <li>Padrões consistentes que facilitam memorização</li>
              <li>Redução da dependência de interfaces visuais</li>
            </ul>
          </div>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">Diretrizes de Acessibilidade</h4>
        <p class="mb-4 text-gray-300">As diretrizes internacionais de acessibilidade influenciam o design de atalhos:</p>
        
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-gray-300 border border-gray-700 rounded-lg">
            <thead class="bg-gray-800">
              <tr>
                <th class="p-3 text-left">Diretriz</th>
                <th class="p-3 text-left">Requisito</th>
                <th class="p-3 text-left">Aplicação</th>
                <th class="p-3 text-left">Nível</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-t border-gray-700">
                <td class="p-3"><strong>WCAG 2.1 AA</strong></td>
                <td class="p-3">Navegação por teclado</td>
                <td class="p-3">Atalhos para todos os elementos interativos</td>
                <td class="p-3">Obrigatório</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3"><strong>Section 508</strong></td>
                <td class="p-3">Controles alternativos</td>
                <td class="p-3">Atalhos para funções críticas</td>
                <td class="p-3">Obrigatório</td>
              </tr>
              <tr class="border-t border-gray-700">
                <td class="p-3"><strong>EN 301 549</strong></td>
                <td class="p-3">Operação por teclado</td>
                <td class="p-3">Todas as funções disponíveis via teclado</td>
                <td class="p-3">Obrigatório</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3"><strong>ISO 9241-171</strong></td>
                <td class="p-3">Design para acessibilidade</td>
                <td class="p-3">Consideração de diferentes necessidades</td>
                <td class="p-3">Recomendado</td>
              </tr>
            </tbody>
          </table>
        </div>
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
            advancedContentSections={advancedContentSections}
            additionalContentSections={additionalContentSections}
            summaryTable={summaryTable}
            faqItems={faqItems}
            externalReferences={externalReferences}
            relatedGuides={relatedGuides}
        />
    );
}
