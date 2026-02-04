import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Atalhos do Windows: O Manual Completo de Produtividade 2026";
const description = "Domine o Windows 11 com os 60+ atalhos de teclado mais úteis para produtividade. Aprenda a gerenciar janelas, áreas de trabalho virtuais, ferramentas ocultas e atalhos secretos que vão triplicar sua velocidade no sistema em 2026.";
const keywords = [
  'melhores atalhos windows 11 produtividade 2026',
  'como usar atalhos de janelas windows snap layout',
  'atalhos teclado windows para abrir gerenciador de tarefas',
  'alternar entre area de trabalho virtual atalho',
  'comando de atalho para tirar print da tela windows',
  'atalhos windows ferramentas desenvolvedor',
  'atalhos secretos windows 11 explorador',
  'win tab alternar janelas atalho windows'
];

export const metadata: Metadata = createGuideMetadata('atalhos-produtividade-windows', title, description, keywords);

export default function WindowsShortcutsGuide() {
  const summaryTable = [
    { label: "Mudar de Janela", value: "Alt + Tab (padrão) ou Win + Tab (avançado)" },
    { label: "Abrir Explorer", value: "Win + E" },
    { label: "Bloquear PC", value: "Win + L" },
    { label: "Captura de Tela", value: "Win + Shift + S (Snip & Sketch)" },
    { label: "Área de Trabalho Virtual", value: "Ctrl + Win + D" },
    { label: "Alternar Áreas", value: "Ctrl + Win + Setas" },
    { label: "Gerenciador Tarefas", value: "Ctrl + Shift + Esc" },
    { label: "Mostrar Desktop", value: "Win + D" }
  ];

  const contentSections = [
    {
      title: "Por Que Usar Atalhos do Windows? A Diferença Entre Usuário Comum e Power User",
      content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Usar atalhos de teclado no Windows é como ter um superpoder para navegar pelo sistema. Cada vez que você tira a mão do teclado para usar o mouse, você perde <strong>2-3 segundos</strong> de produtividade. Em um dia de trabalho (8 horas), isso soma <strong>dezenas de minutos perdidos</strong> apenas com movimentos desnecessários. Em 2026, dominar os atalhos do Windows é essencial para desenvolvedores, designers, traders, gamers e qualquer pessoa que queira <strong>triplicar sua velocidade de navegação</strong>.
        </p>
        
        <h4 class="text-white font-bold mb-3 mt-6">📊 Estatísticas de Produtividade</h4>
        <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
          <li>Usuários que dominam atalhos de teclado são <strong>40-60% mais rápidos</strong> em tarefas diárias do Windows.</li>
          <li>Pesquisadores da Microsoft provaram que alternar entre teclado e mouse <strong>reduz foco em 15%</strong>.</li>
          <li>Profissionais de TI, desenvolvedores e designers usam <strong>90% teclado / 10% mouse</strong>.</li>
        </ul>
      `
    },
    {
      title: "Atalhos Básicos: O Começo da Sua Jornada de Produtividade",
      content: `
        <p class="mb-4 text-gray-300">
          Estes são os atalhos fundamentais que VOCÊ DEVE dominar antes de qualquer outro. Funcionam em QUALQUER versão do Windows (7, 8, 10, 11).
        </p>
        
        <h4 class="text-white font-bold mb-3 mt-6">🔄 Atalhos de Navegação Básicos</h4>
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
              <td class="p-3"><code>Win</code></td>
              <td class="p-3">Abre/inicia menu Iniciar</td>
              <td class="p-3">Pressione e solte para abrir menu</td>
            </tr>
            <tr class="border-t border-gray-700 bg-gray-800/30">
              <td class="p-3"><code>Win + D</code></td>
              <td class="p-3">Mostrar desktop (minimiza tudo)</td>
              <td class="p-3">Volta rapidamente para área de trabalho</td>
            </tr>
            <tr class="border-t border-gray-700">
              <td class="p-3"><code>Win + L</code></td>
              <td class="p-3">Bloquear computador</td>
              <td class="p-3">Saia rapidamente do PC com segurança</td>
            </tr>
            <tr class="border-t border-gray-700 bg-gray-800/30">
              <td class="p-3"><code>Win + E</code></td>
              <td class="p-3">Abrir Explorador de Arquivos</td>
              <td class="p-3">Acesso rápido ao sistema de arquivos</td>
            </tr>
            <tr class="border-t border-gray-700">
              <td class="p-3"><code>Win + R</code></td>
              <td class="p-3">Executar (Run dialog)</td>
              <td class="p-3">Digite comandos como 'cmd', 'mspaint', 'notepad'</td>
            </tr>
            <tr class="border-t border-gray-700 bg-gray-800/30">
              <td class="p-3"><code>Win + I</code></td>
              <td class="p-3">Abrir Configurações</td>
              <td class="p-3">Substituto do Painel de Controle</td>
            </tr>
          </tbody>
        </table>
        
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20 mt-6">
          <h4 class="text-blue-400 font-bold mb-2">💡 Dica PRO: Win + R é o Portal de Comandos!</h4>
          <p class="text-sm text-gray-300">
            Use <code>Win + R</code> para abrir rapidamente qualquer programa ou ferramenta. Exemplos: <code>cmd</code> (Prompt de Comando), <code>mspaint</code> (Paint), <code>notepad</code> (Bloco de Notas), <code>calc</code> (Calculadora), <code>msconfig</code> (Configuração do Sistema).
          </p>
        </div>
      `
    },
    {
      title: "Organização de Janelas: Snap Layouts e Gerenciamento Inteligente",
      content: `
        <p class="mb-4 text-gray-300">
          Pare de redimensionar janelas manualmente! O Windows 11 introduziu os Snap Layouts, que permitem organizar janelas automaticamente com atalhos de teclado.
        </p>
        
        <h4 class="text-white font-bold mb-3 mt-6">📏 Atalhos de Organização de Janelas (Windows 11)</h4>
        <table class="w-full text-sm text-gray-300 border border-gray-700 rounded-lg overflow-hidden">
          <thead class="bg-gray-800">
            <tr>
              <th class="p-3 text-left">Atalho</th>
              <th class="p-3 text-left">Ação</th>
              <th class="p-3 text-left">Layout Resultante</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-t border-gray-700">
              <td class="p-3"><code>Win + Setas Esquerda/Direita</code></td>
              <td class="p-3">"Gruda" janela em metade da tela</td>
              <td class="p-3">Janela ocupa 50% da tela (esquerda ou direita)</td>
            </tr>
            <tr class="border-t border-gray-700 bg-gray-800/30">
              <td class="p-3"><code>Win + Setas Cima/Baixo</code></td>
              <td class="p-3">Maximizar/minimizar ou redimensionar verticalmente</td>
              <td class="p-3">Win+Cima = maximizar, Win+Baixo = restaurar ou minimizar</td>
            </tr>
            <tr class="border-t border-gray-700">
              <td class="p-3"><code>Win + Z</code></td>
              <td class="p-3">Abrir menu Snap Layouts</td>
              <td class="p-3">Escolha entre layouts 2, 3 ou 4 janelas</td>
            </tr>
            <tr class="border-t border-gray-700 bg-gray-800/30">
              <td class="p-3"><code>Win + Setas + Cima</code></td>
              <td class="p-3">Maximizar janela em modo Snap</td>
              <td class="p-3">Janela ocupa 100% da tela (modo fullscreen)</td>
            </tr>
            <tr class="border-t border-gray-700">
              <td class="p-3"><code>Win + Setas + Baixo</code></td>
              <td class="p-3">Minimizar janela</td>
              <td class="p-3">Fecha janela para a barra de tarefas</td>
            </tr>
          </tbody>
        </table>
        
        <div class="bg-emerald-900/10 p-5 rounded-xl border border-emerald-500/20 mt-6">
          <h4 class="text-emerald-400 font-bold mb-2">✅ Exemplo Prático: Trabalhando com 2 Aplicações</h4>
          <p class="text-sm text-gray-300">
            Imagine que você quer ter o Excel ocupando metade esquerda da tela e o navegador ocupando metade direita:
          </p>
          <ul class="list-disc list-inside text-xs text-gray-300 ml-6 mt-2 space-y-1">
            <li>Abra o Excel → Pressione <code>Win + Setas Esquerda</code> → Excel ocupa metade esquerda</li>
            <li>Abra o navegador → Pressione <code>Win + Setas Direita</code> → Navegador ocupa metade direita</li>
            <li>Sem tocar no mouse! Tudo com teclado!</li>
          </ul>
        </div>
      `
    },
    {
      title: "Alternância de Janelas: Mudando entre Aplicações Rapidamente",
      content: `
        <h4 class="text-white font-bold mb-3">🔄 Alternar entre Janelas Abertas</h4>
        <ul class="list-disc list-inside text-gray-300 space-y-3 ml-4">
          <li><code>Alt + Tab</code> - Mostra miniaturas das janelas abertas (modo clássico)</li>
          <li><code>Win + Tab</code> - Abre o Task View com prévias em tamanho real das janelas</li>
          <li><code>Win + T</code> - Percorre os ícones da barra de tarefas (Windows 11)</li>
          <li><code>Win + 1 a 9</code> - Abre/aproxima o aplicativo naquela posição da barra de tarefas</li>
        </ul>
        
        <h4 class="text-white font-bold mb-3 mt-6">🎯 Atalhos Avançados de Alternância</h4>
        <table class="w-full text-sm text-gray-300 border border-gray-700 rounded-lg overflow-hidden">
          <thead class="bg-gray-800">
            <tr>
              <th class="p-3 text-left">Atalho</th>
              <th class="p-3 text-left">Ação</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-t border-gray-700">
              <td class="p-3"><code>Alt + `</code> (acentuação grave)</td>
              <td class="p-3">Alternar entre janelas do mesmo aplicativo (ex: abas do Chrome)</td>
            </tr>
            <tr class="border-t border-gray-700 bg-gray-800/30">
              <td class="p-3"><code>Ctrl + Alt + Tab</code></td>
              <td class="p-3">Manter o Task Switcher aberto enquanto navega</td>
            </tr>
            <tr class="border-t border-gray-700">
              <td class="p-3"><code>Win + Shift + Setas Esquerda/Direita</code></td>
              <td class="p-3">Mover janela para monitor adjacente</td>
            </tr>
          </tbody>
        </table>
      `
    },
    {
      title: "Áreas de Trabalho Virtuais: Multiplicando Seu Espaço de Trabalho",
      content: `
        <div class="bg-amber-900/10 p-5 rounded-xl border border-amber-500/20 mb-6">
          <h4 class="text-amber-400 font-bold mb-2">✨ Recurso Poderoso do Windows 11</h4>
          <p class="text-sm text-gray-300">
            Áreas de trabalho virtuais permitem que você crie múltiplos "desktops" para organizar diferentes tarefas. Exemplo: Área de trabalho 1 para trabalho, Área de trabalho 2 para comunicação (Slack, Teams, Discord), Área de trabalho 3 para entretenimento.
          </p>
        </div>
        
        <h4 class="text-white font-bold mb-3">📱 Gerenciar Áreas de Trabalho Virtuais</h4>
        <table class="w-full text-sm text-gray-300 border border-gray-700 rounded-lg overflow-hidden">
          <thead class="bg-gray-800">
            <tr>
              <th class="p-3 text-left">Atalho</th>
              <th class="p-3 text-left">Ação</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-t border-gray-700">
              <td class="p-3"><code>Ctrl + Win + D</code></td>
              <td class="p-3">Criar nova área de trabalho</td>
            </tr>
            <tr class="border-t border-gray-700 bg-gray-800/30">
              <td class="p-3"><code>Ctrl + Win + F4</code></td>
              <td class="p-3">Fechar área de trabalho atual</td>
            </tr>
            <tr class="border-t border-gray-700">
              <td class="p-3"><code>Ctrl + Win + Setas Esquerda/Direita</code></td>
              <td class="p-3">Alternar entre áreas de trabalho</td>
            </tr>
            <tr class="border-t border-gray-700 bg-gray-800/30">
              <td class="p-3"><code>Win + Tab</code></td>
              <td class="p-3">Ver todas as áreas de trabalho abertas</td>
            </tr>
          </tbody>
        </table>
        
        <h4 class="text-white font-bold mb-3 mt-6">🎯 Dicas para Usar Áreas de Trabalho Efetivamente</h4>
        <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
          <li>Crie uma área para cada projeto ou tipo de tarefa</li>
          <li>Mova janelas entre áreas com <code>Win + Tab</code> → Clique na janela → "Mover para outra área de trabalho"</li>
          <li>Use nomes personalizados para áreas (clique com direito na área → Renomear)</li>
          <li>Configure atalhos rápidos para cada área específica (Win + Ctrl + 1, 2, 3...)</li>
        </ul>
      `
    },
    {
      title: "Ferramentas do Sistema: Acesso Rápido a Utilitários Importantes",
      content: `
        <h4 class="text-white font-bold mb-3">🛠️ Atalhos para Ferramentas do Sistema</h4>
        <table class="w-full text-sm text-gray-300 border border-gray-700 rounded-lg overflow-hidden">
          <thead class="bg-gray-800">
            <tr>
              <th class="p-3 text-left">Atalho</th>
              <th class="p-3 text-left">Ferramenta</th>
              <th class="p-3 text-left">Uso Prático</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-t border-gray-700">
              <td class="p-3"><code>Ctrl + Shift + Esc</code></td>
              <td class="p-3">Gerenciador de Tarefas</td>
              <td class="p-3">Acesso direto sem passar por Ctrl+Alt+Del</td>
            </tr>
            <tr class="border-t border-gray-700 bg-gray-800/30">
              <td class="p-3"><code>Win + X</code></td>
              <td class="p-3">Menu de Acesso Rápido</td>
              <td class="p-3">Terminal, Gerenciador de Dispositivos, Powershell</td>
            </tr>
            <tr class="border-t border-gray-700">
              <td class="p-3"><code>Win + Pause</code></td>
              <td class="p-3">Propriedades do Sistema</td>
              <td class="p-3">Ver informações do PC, configurações avançadas</td>
            </tr>
            <tr class="border-t border-gray-700 bg-gray-800/30">
              <td class="p-3"><code>Win + R</code> → <code>msconfig</code></td>
              <td class="p-3">Configuração do Sistema</td>
              <td class="p-3">Configurar inicialização, serviços do sistema</td>
            </tr>
            <tr class="border-t border-gray-700">
              <td class="p-3"><code>Win + R</code> → <code>dxdiag</code></td>
              <td class="p-3">Diagnóstico do DirectX</td>
              <td class="p-3">Ver informações de hardware (GPU, CPU, RAM)</td>
            </tr>
            <tr class="border-t border-gray-700 bg-gray-800/30">
              <td class="p-3"><code>Win + R</code> → <code>perfmon</code></td>
              <td class="p-3">Monitor de Desempenho</td>
              <td class="p-3">Ver uso de CPU, RAM, disco em tempo real</td>
            </tr>
          </tbody>
        </table>
      `
    },
    {
      title: "Captura de Tela e Anotações: Documentando Tudo Rapidamente",
      content: `
        <h4 class="text-white font-bold mb-3">📸 Atalhos de Captura de Tela</h4>
        <table class="w-full text-sm text-gray-300 border border-gray-700 rounded-lg overflow-hidden">
          <thead class="bg-gray-800">
            <tr>
              <th class="p-3 text-left">Atalho</th>
              <th class="p-3 text-left">Ação</th>
              <th class="p-3 text-left">Resultado</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-t border-gray-700">
              <td class="p-3"><code>Win + Shift + S</code></td>
              <td class="p-3">Snip & Sketch (captura personalizada)</td>
              <td class="p-3">Selecione área, janela ou tela inteira</td>
            </tr>
            <tr class="border-t border-gray-700 bg-gray-800/30">
              <td class="p-3"><code>Win + Print Screen</code></td>
              <td class="p-3">Capturar tela inteira</td>
              <td class="p-3">Salvar imagem na pasta 'Screenshots'</td>
            </tr>
            <tr class="border-t border-gray-700">
              <td class="p-3"><code>Alt + Print Screen</code></td>
              <td class="p-3">Capturar janela ativa</td>
              <td class="p-3">Salvar na área de transferência</td>
            </tr>
            <tr class="border-t border-gray-700 bg-gray-800/30">
              <td class="p-3"><code>Win + G</code></td>
              <td class="p-3">Xbox Game Bar</td>
              <td class="p-3">Capturar vídeos e screenshots de jogos</td>
            </tr>
          </tbody>
        </table>
        
        <h4 class="text-white font-bold mb-3 mt-6">✏️ Atalhos de Anotações Rápidas</h4>
        <ul class="list-disc list-inside text-gray-300 space-y-3 ml-4">
          <li><code>Win + Shift + N</code> - Abrir aplicativo Sticky Notes (se instalado)</li>
          <li><code>Win + V</code> - Abrir histórico da área de transferência</li>
          <li><code>Win + . (ponto)</code> - Abrir seletor de emojis e símbolos</li>
          <li><code>Win + ; (ponto e vírgula)</code> - Abrir seletor de emoji (mesmo que Win + .)</li>
        </ul>
      `
    },
    {
      title: "Atalhos Avançados: Para Profissionais e Desenvolvedores",
      content: `
        <h4 class="text-white font-bold mb-3">🔐 Atalhos de Segurança e Administração</h4>
        <table class="w-full text-sm text-gray-300 border border-gray-700 rounded-lg overflow-hidden">
          <thead class="bg-gray-800">
            <tr>
              <th class="p-3 text-left">Atalho</th>
              <th class="p-3 text-left">Ação</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-t border-gray-700">
              <td class="p-3"><code>Win + U</code></td>
              <td class="p-3">Central de Facilidade de Acesso</td>
            </tr>
            <tr class="border-t border-gray-700 bg-gray-800/30">
              <td class="p-3"><code>Win + Ctrl + Shift + B</code></td>
              <td class="p-3">Reiniciar drivers de vídeo rapidamente</td>
            </tr>
            <tr class="border-t border-gray-700">
              <td class="p-3"><code>Win + H</code></td>
              <td class="p-3">Compartilhar conteúdo atual (Windows 11)</td>
            </tr>
            <tr class="border-t border-gray-700 bg-gray-800/30">
              <td class="p-3"><code>Win + K</code></td>
              <td class="p-3">Conectar a dispositivos (Bluetooth, Projetar)</td>
            </tr>
          </tbody>
        </table>
        
        <h4 class="text-white font-bold mb-3 mt-6">💻 Ferramentas para Desenvolvedores</h4>
        <ul class="list-disc list-inside text-gray-300 space-y-3 ml-4">
          <li><code>Win + R</code> → <code>cmd</code> - Prompt de Comando</li>
          <li><code>Win + R</code> → <code>powershell</code> - PowerShell</li>
          <li><code>Win + R</code> → <code>devmgmt.msc</code> - Gerenciador de Dispositivos</li>
          <li><code>Win + R</code> → <code>services.msc</code> - Serviços do Windows</li>
          <li><code>Win + R</code> → <code>regedit</code> - Editor do Registro</li>
          <li><code>Win + X</code> → Terminal (Admin) - Acesso rápido ao terminal com privilégios</li>
        </ul>
      `
    },
    {
      title: "Atalhos para Personalização e Acessibilidade",
      content: `
        <h4 class="text-white font-bold mb-3">🎨 Personalização de Interface</h4>
        <table class="w-full text-sm text-gray-300 border border-gray-700 rounded-lg overflow-hidden">
          <thead class="bg-gray-800">
            <tr>
              <th class="p-3 text-left">Atalho</th>
              <th class="p-3 text-left">Ação</th>
              <th class="p-3 text-left">Benefício</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-t border-gray-700">
              <td class="p-3"><code>Win + I</code></td>
              <td class="p-3">Abrir Configurações do Windows</td>
              <td class="p-3">Acesso rápido a todas as configurações do sistema</td>
            </tr>
            <tr class="border-t border-gray-700 bg-gray-800/30">
              <td class="p-3"><code>Win + P</code></td>
              <td class="p-3">Opções de apresentação</td>
              <td class="p-3">Conectar a projetores ou monitores externos</td>
            </tr>
            <tr class="border-t border-gray-700">
              <td class="p-3"><code>Win + X</code></td>
              <td class="p-3">Menu de contexto do Windows</td>
              <td class="p-3">Acesso rápido a ferramentas administrativas</td>
            </tr>
            <tr class="border-t border-gray-700 bg-gray-800/30">
              <td class="p-3"><code>Win + Ctrl + D</code></td>
              <td class="p-3">Criar nova área de trabalho</td>
              <td class="p-3">Organizar tarefas em espaços virtuais</td>
            </tr>
          </tbody>
        </table>
        
        <h4 class="text-white font-bold mb-3 mt-6">♿ Atalhos de Acessibilidade</h4>
        <ul class="list-disc list-inside text-gray-300 space-y-3 ml-4">
          <li><code>Win + U</code> - Abrir Central de Facilidade de Acesso para configurações de acessibilidade</li>
          <li><code>Win + Ctrl + C</code> - Abrir Detector de Cores para verificar contraste (desenvolvedores web)</li>
          <li><code>Win + Plus (+)</code> - Ativar Lente de Ampliação para zoom da tela</li>
          <li><code>Win + Ctrl + Shift + M</code> - Ativar/desativar alto contraste</li>
          <li><code>Win + Ctrl + Shift + B</code> - Reiniciar drivers de vídeo (ajuda com problemas visuais)</li>
        </ul>
      `
    },
    {
      title: "Atalhos para Segurança e Proteção",
      content: `
        <h4 class="text-white font-bold mb-3">🛡️ Segurança do Sistema</h4>
        <table class="w-full text-sm text-gray-300 border border-gray-700 rounded-lg overflow-hidden">
          <thead class="bg-gray-800">
            <tr>
              <th class="p-3 text-left">Atalho</th>
              <th class="p-3 text-left">Ação</th>
              <th class="p-3 text-left">Finalidade</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-t border-gray-700">
              <td class="p-3"><code>Win + L</code></td>
              <td class="p-3">Bloquear o computador</td>
              <td class="p-3">Segurança imediata ao sair da estação</td>
            </tr>
            <tr class="border-t border-gray-700 bg-gray-800/30">
              <td class="p-3"><code>Ctrl + Alt + Del</code></td>
              <td class="p-3">Acesso ao Gerenciador de Tarefas</td>
              <td class="p-3">Encerrar processos ou abrir segurança</td>
            </tr>
            <tr class="border-t border-gray-700">
              <td class="p-3"><code>Win + X</code> → <code>Terminal (Admin)</code></td>
              <td class="p-3">Abrir terminal com privilégios</td>
              <td class="p-3">Executar comandos administrativos</td>
            </tr>
            <tr class="border-t border-gray-700 bg-gray-800/30">
              <td class="p-3"><code>Win + R</code> → <code>secpol.msc</code></td>
              <td class="p-3">Políticas de Segurança Local</td>
              <td class="p-3">Configurar políticas de segurança (Pro/Edu)</td>
            </tr>
          </tbody>
        </table>
        
        <h4 class="text-white font-bold mb-3 mt-6">🔒 Atalhos de Segurança Avançados</h4>
        <ul class="list-disc list-inside text-gray-300 space-y-3 ml-4">
          <li><code>Win + R</code> → <code>gpedit.msc</code> - Editor de Política de Grupo (Professional/Education)</li>
          <li><code>Win + R</code> → <code>msra</code> - Assistente Remoto do Windows</li>
          <li><code>Win + R</code> → <code>eventvwr</code> - Visualizador de Eventos do Windows</li>
          <li><code>Win + R</code> → <code>compmgmt.msc</code> - Gerenciamento do Computador</li>
          <li><code>Win + R</code> → <code>perfmon</code> - Monitor de Desempenho</li>
        </ul>
      `
    },
    {
      title: "Automatização e Scripts: Maximizando Produtividade",
      content: `
        <h4 class="text-white font-bold mb-3">🤖 Automação com Atalhos Personalizados</h4>
        <p class="mb-4 text-gray-300">
          Além dos atalhos padrão do Windows, você pode criar atalhos personalizados para executar scripts e automatizar tarefas repetitivas:
        </p>
        
        <div class="bg-amber-900/10 p-5 rounded-xl border border-amber-500/20 mb-6">
          <h5 class="text-amber-400 font-bold mb-2">💡 Dica Pro: Atalhos Personalizados</h5>
          <p class="text-sm text-gray-300">
            Você pode criar atalhos personalizados com o PowerToys do Microsoft ou criando arquivos .bat/.vbs com atalhos de teclado específicos.
          </p>
        </div>
        
        <h4 class="text-white font-bold mb-3">📁 Atalhos para Tarefas Repetitivas</h4>
        <table class="w-full text-sm text-gray-300 border border-gray-700 rounded-lg overflow-hidden">
          <thead class="bg-gray-800">
            <tr>
              <th class="p-3 text-left">Comando</th>
              <th class="p-3 text-left">Descrição</th>
              <th class="p-3 text-left">Aplicação</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-t border-gray-700">
              <td class="p-3"><code>Win + R</code> → <code>notepad</code></td>
              <td class="p-3">Abrir Bloco de Notas rapidamente</td>
              <td class="p-3">Tomada de notas rápidas</td>
            </tr>
            <tr class="border-t border-gray-700 bg-gray-800/30">
              <td class="p-3"><code>Win + R</code> → <code>calc</code></td>
              <td class="p-3">Abrir Calculadora</td>
              <td class="p-3">Operações matemáticas rápidas</td>
            </tr>
            <tr class="border-t border-gray-700">
              <td class="p-3"><code>Win + R</code> → <code>mspaint</code></td>
              <td class="p-3">Abrir Paint</td>
              <td class="p-3">Edição de imagens rápida</td>
            </tr>
            <tr class="border-t border-gray-700 bg-gray-800/30">
              <td class="p-3"><code>Win + R</code> → <code>wordpad</code></td>
              <td class="p-3">Abrir WordPad</td>
              <td class="p-3">Editor de texto com formatação</td>
            </tr>
          </tbody>
        </table>
        
        <h4 class="text-white font-bold mb-3 mt-6">📝 Criação de Scripts para Automatização</h4>
        <p class="mb-4 text-gray-300">
          Você pode criar scripts para tarefas específicas e associar a atalhos de teclado:
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-3 ml-4">
          <li>Criar arquivos .bat para executar sequências de comandos</li>
          <li>Associar atalhos de teclado a programas específicos</li>
          <li>Usar o PowerToys para criar atalhos personalizados complexos</li>
          <li>Automatizar tarefas com o Agendador de Tarefas do Windows</li>
        </ul>
      `
    }
  ];

  const faqItems = [
    {
      question: "Quais atalhos do Windows funcionam em todas as versões?",
      answer: "Os atalhos básicos como Win+E (Explorador), Win+L (Bloquear), Alt+Tab (Alternar janelas), Win+R (Executar) funcionam desde o Windows 7 até o Windows 11. Atalhos específicos do Windows 11 como Win+Z (Snap Layouts) ou Ctrl+Win+Setas (Áreas de trabalho virtuais) não funcionam em versões anteriores."
    },
    {
      question: "Como aprender atalhos rapidamente?",
      answer: "Comece com os 5 mais usados: Win+E (Explorador), Win+D (Mostrar desktop), Win+L (Bloquear), Win+R (Executar), Alt+Tab (Alternar janelas). Pratique diariamente por 1-2 semanas até virarem hábito. Depois, adicione mais 2-3 atalhos por semana."
    },
    {
      question: "Tem atalhos para controlar volume e brilho?",
      answer: "Sim! Use Teclas de Função (F1-F12) combinadas com Fn em laptops: F2/F3 para brilho, F4/F5 para volume. No Windows 10/11, você também pode usar Win+A para abrir Centro de Notificações e controlar rapidamente volume e brilho."
    },
    {
      question: "Win+Tab vs Alt+Tab - Qual a diferença?",
      answer: "Alt+Tab mostra miniaturas das janelas abertas em modo tradicional. Win+Tab abre o Task View com prévias em tamanho real das janelas e áreas de trabalho virtuais. Win+Tab é mais visual e funcional no Windows 11."
    },
    {
      question: "Como mover janelas entre monitores?",
      answer: "Use Win+Shift+Setas Esquerda/Direita para mover janelas ativas entre monitores conectados. Funciona com qualquer quantidade de monitores e preserva o estado da janela (minimizada/maximizada)."
    },
    {
      question: "O que é Snap Assist e como usar?",
      answer: "Snap Assist é o recurso que sugere janelas para preencher metade da tela quando você arrasta uma janela para a borda. No Windows 11, ao usar Win+Setas, o Snap Assist mostra layouts prontos para organizar múltiplas janelas automaticamente."
    },
    {
      question: "Tem atalhos para área de transferência?",
      answer: "Sim! Use Win+V para abrir o histórico da área de transferência, que mostra os últimos 25 itens copiados. Você pode colar qualquer item do histórico clicando nele ou usando setas e Enter. Requer histórico ativado nas Configurações."
    },
    {
      question: "Como alternar entre janelas do mesmo aplicativo?",
      answer: "Use Alt+\` (acentuação grave) para alternar entre janelas do mesmo aplicativo. Por exemplo, se você tem 3 janelas do Chrome abertas, Alt+\` alterna entre elas. Muito útil para navegadores com várias janelas."
    },
    {
      question: "Como tirar prints profissionais?",
      answer: "Win+Shift+S para Snip & Sketch (recorte personalizado), Win+PrintScreen para captura completa (salva em Imagens/Screenshots), Alt+PrintScreen para capturar janela ativa (cópia para área de transferência). Use Win+G para Xbox Game Bar em jogos."
    },
    {
      question: "Como criar áreas de trabalho virtuais rapidamente?",
      answer: "Use Ctrl+Win+D para criar nova área de trabalho. Ctrl+Win+Setas para alternar entre áreas. Win+Tab para ver todas as áreas abertas. Útil para separar trabalho, comunicação e entretenimento em espaços distintos."
    },
    {
      question: "Tem atalhos para desenvolvedores?",
      answer: "Sim! Win+X para menu de acesso rápido (Terminal, Gerenciador de Dispositivos), Win+R → cmd/powershell/msconfig/dxdiag/perfmon para ferramentas do sistema, Win+Shift+V para alternar temas de alta contraste. Win+Alt+R para gravar tela no Xbox Game Bar."
    },
    {
      question: "Como reiniciar drivers de vídeo rapidamente?",
      answer: "Use Win+Ctrl+Shift+B para reiniciar os drivers de vídeo rapidamente. Útil quando a tela congela ou aparece artefatos gráficos. O sistema pisca rapidamente e os drivers são reiniciados sem reiniciar o computador."
    },
    {
      question: "Quais são os atalhos para acessibilidade no Windows?",
      answer: "O Windows tem diversos atalhos de acessibilidade: Win+U para Central de Facilidade de Acesso, Win+Plus(+) para Lente de Ampliação, Win+Ctrl+Shift+M para alternar alto contraste, Win+Ctrl+C para Detector de Cores. Esses atalhos ajudam pessoas com deficiências visuais ou motoras."
    },
    {
      question: "Como usar o Menu Iniciar avançado com atalhos?",
      answer: "Além do Win básico, você pode usar: Win+A para Centro de Ações, Win+C para Chat do Teams, Win+V para histórico da área de transferência, Win+Shift+M para restaurar janelas minimizadas. O Win+X oferece um menu avançado com opções administrativas."
    },
    {
      question: "Tem atalhos para gerenciar tarefas do sistema?",
      answer: "Sim! Use Ctrl+Shift+Esc para abrir Gerenciador de Tarefas diretamente, Win+Tab para Task View, Win+H para compartilhar conteúdo, Win+K para conectar dispositivos. Para desligar/reiniciar, use Alt+F4 no ambiente de trabalho ou Win+X+A para desligar."
    },
    {
      question: "Como automatizar tarefas com atalhos e scripts?",
      answer: "Você pode criar atalhos personalizados com PowerToys, usar o Agendador de Tarefas do Windows, ou criar arquivos .bat com sequências de comandos. Associe esses scripts a atalhos de teclado para automatizar tarefas repetitivas como backup, limpeza de sistema ou inicialização de aplicativos."
    }
  ];
  
  const externalReferences = [
    { name: "Atalhos Windows Oficiais", url: "https://support.microsoft.com/pt-br/windows/keyboard-shortcuts-in-windows-dcc61a57-8ff0-cffe-9746-c5bba2a4028b" },
    { name: "Windows 11 Productivity Tips", url: "https://www.microsoft.com/en-us/windows/get-help/productivity-tips" },
    { name: "PowerToys - Atalhos Personalizados", url: "https://github.com/microsoft/PowerToys" },
    { name: "Windows Automation Tools", url: "https://docs.microsoft.com/en-us/windows/powertoys/" },
    { name: "Accessibility Features Guide", url: "https://support.microsoft.com/pt-br/accessibility" },
    { name: "Windows Security Shortcuts", url: "https://docs.microsoft.com/pt-br/windows/security/" }
  ];

  const relatedGuides = [
    {
      href: "/guias/atalhos-navegador-produtividade",
      title: "Atalhos Navegador",
      description: "Combine com os atalhos do Windows."
    },
    {
      href: "/guias/grava%C3%A7%C3%A3o-tela-windows-nativa-dicas",
      title: "Gravar Tela",
      description: "Atalhos para capturar vídeos."
    },
    {
      href: "/guias/otimizacao-performance",
      title: "Otimizar Sistema",
      description: "Melhore a resposta do sistema aos comandos."
    },
    {
      href: "/guias/automacao-tarefas",
      title: "Automação de Tarefas",
      description: "Maximize sua produtividade com scripts."
    },
    {
      href: "/guias/seguranca-digital",
      title: "Segurança Digital",
      description: "Proteja-se usando atalhos de segurança."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="60 min"
      difficultyLevel="Intermediário"
      author="Equipe Técnica Voltris"
      lastUpdated="2026-01-20"
      contentSections={contentSections}
      summaryTable={summaryTable}
      faqItems={faqItems}
      externalReferences={externalReferences}
      relatedGuides={relatedGuides}
    />
  );
}
