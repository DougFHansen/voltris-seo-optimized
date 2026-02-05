import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'limpeza-computador',
  title: "Limpeza Completa do Computador",
  description: "Técnicas profissionais para limpar arquivos temporários, cache, programas desnecessários e otimizar o espaço em disco do seu computador.",
  category: 'software',
  difficulty: 'Intermediário',
  time: '45 minutos'
};

const title = "Limpeza Completa do Computador";
const description = "Técnicas profissionais para limpar arquivos temporários, cache, programas desnecessários e otimizar o espaço em disco do seu computador. Guia completo com mais de 2000 palavras de conteúdo especializado para manutenção profissional de sistemas.";
const keywords = ['limpeza computador', 'limpeza windows', 'otimizacao disco', 'arquivos temporarios', 'desfragmentacao', 'ccleaner', 'limpeza registro', 'otimizacao sistema', 'liberacao espaco', 'desinstalacao programas', 'limpeza navegadores'];

export const metadata: Metadata = createGuideMetadata('limpeza-computador', title, description, keywords);

export default function LimpezaComputadorGuide() {
  const summaryTable = [
    { label: "Frequência Recomendada", value: "Mensal para limpeza completa" },
    { label: "Tempo Estimado", value: "60-90 minutos (completa)" },
    { label: "Dificuldade", value: "Intermediário" },
    { label: "Espaço Liberado", value: "5-20GB tipicamente" }
  ];

  const contentSections = [
    {
      title: "Introdução e Visão Geral",
      content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          A limpeza do computador é uma prática essencial para manter o desempenho ideal do sistema. Com o uso contínuo, seu computador acumula arquivos temporários, cache de navegadores, registros inválidos, programas desnecessários e outros detritos digitais que gradualmente reduzem a velocidade e ocupam espaço valioso em disco. Este guia completo com mais de 2000 palavras irá mostrar as melhores técnicas profissionais para limpar e otimizar seu sistema de forma segura e eficiente.
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
          <div class="bg-[#171313] p-6 rounded-xl border border-[#31A8FF]/30 hover:border-[#31A8FF]/50 transition-colors">
            <h3 class="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <span class="text-[#31A8FF]">✓</span> Benefícios
            </h3>
            <ul class="text-gray-300 space-y-2">
              <li class="flex items-start gap-2"><span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#31A8FF] flex-shrink-0"></span>Aumento de 25-40% na velocidade de boot</li>
              <li class="flex items-start gap-2"><span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#31A8FF] flex-shrink-0"></span>Liberação de 5-20GB de espaço em disco</li>
              <li class="flex items-start gap-2"><span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#31A8FF] flex-shrink-0"></span>Melhoria na resposta de programas</li>
              <li class="flex items-start gap-2"><span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#31A8FF] flex-shrink-0"></span>Redução de erros do sistema</li>
              <li class="flex items-start gap-2"><span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#31A8FF] flex-shrink-0"></span>Prevenção de falhas futuras</li>
            </ul>
          </div>
          <div class="bg-[#171313] p-6 rounded-xl border border-[#FF4B6B]/30 hover:border-[#FF4B6B]/50 transition-colors">
            <h3 class="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <span class="text-[#FF4B6B]">⚠</span> Requisitos
            </h3>
            <ul class="text-gray-300 space-y-2">
              <li class="flex items-start gap-2"><span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#FF4B6B] flex-shrink-0"></span>Permissões de administrador do Windows</li>
              <li class="flex items-start gap-2"><span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#FF4B6B] flex-shrink-0"></span>Backup recente dos dados importantes</li>
              <li class="flex items-start gap-2"><span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#FF4B6B] flex-shrink-0"></span>Conexão à internet (opcional)</li>
              <li class="flex items-start gap-2"><span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#FF4B6B] flex-shrink-0"></span>Pelo menos 1GB de RAM livre</li>
              <li class="flex items-start gap-2"><span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#FF4B6B] flex-shrink-0"></span>Espaço em disco para backup temporário</li>
            </ul>
          </div>
        </div>
        
        <div class="bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-6 rounded-xl border border-blue-500/30 mt-8">
          <h3 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span class="text-blue-400">📊</span> Estatísticas Importantes
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-black/30 p-4 rounded-lg">
              <h4 class="font-bold text-blue-400 mb-2">Acúmulo de Arquivos</h4>
              <p class="text-gray-300">Computadores não mantidos acumulam 10-30GB de arquivos temporários em 6 meses</p>
            </div>
            <div class="bg-black/30 p-4 rounded-lg">
              <h4 class="font-bold text-purple-400 mb-2">Performance</h4>
              <p class="text-gray-300">Sistemas bem mantidos mantêm 85-95% da performance original</p>
            </div>
            <div class="bg-black/30 p-4 rounded-lg">
              <h4 class="font-bold text-green-400 mb-2">Custos</h4>
              <p class="text-gray-300">Manutenção preventiva reduz custos com substituição em até 60%</p>
            </div>
          </div>
        </div>
      `,
      subsections: [
        {
          subtitle: "Importância da Limpeza Regular",
          content: `
            <p class="text-gray-300 mb-4">A limpeza regular do computador é fundamental para manter a saúde do sistema operacional e prolongar a vida útil do hardware. Com o tempo, arquivos temporários, cache de navegadores, registros inválidos e programas desnecessários se acumulam, ocupando espaço em disco e afetando o desempenho do sistema.</p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div class="bg-[#1E1E22] p-4 rounded-lg border border-blue-500/30">
                <h5 class="font-bold text-blue-400 mb-2">Aspectos Técnicos</h5>
                <ul class="text-gray-300 text-sm space-y-1">
                  <li>• Prevenção de falhas de sistema</li>
                  <li>• Otimização de recursos do sistema</li>
                  <li>• Eliminação de arquivos obsoletos</li>
                  <li>• Melhoria na velocidade de inicialização</li>
                </ul>
              </div>
              <div class="bg-[#1E1E22] p-4 rounded-lg border border-green-500/30">
                <h5 class="font-bold text-green-400 mb-2">Benefícios Práticos</h5>
                <ul class="text-gray-300 text-sm space-y-1">
                  <li>• Aumento de espaço disponível</li>
                  <li>• Redução de tempo de resposta</li>
                  <li>• Menos erros de aplicativos</li>
                  <li>• Melhoria na estabilidade geral</li>
                </ul>
              </div>
            </div>
          `
        }
      ]
    },
    {
      title: "1. Identificação de Arquivos Necessários e Desnecessários",
      content: `
        <p class="mb-4 text-gray-300">Antes de iniciar a limpeza, é importante entender quais arquivos podem ser removidos com segurança e quais devem ser mantidos:</p>
      `,
      subsections: [
        {
          subtitle: "Tipos de Arquivos Temporários",
          content: `
            <div class="prose prose-invert max-w-none">
              <h4 class="text-lg font-bold text-white mt-4 mb-2">Arquivos Seguros para Remoção:</h4>
              <ul class="list-disc list-inside space-y-2 text-gray-300">
                <li>Arquivos temporários do sistema (%temp%, C:\Windows\Temp)</li>
                <li>Cache de navegadores web</li>
                <li>Arquivos de download incompletos</li>
                <li>Arquivos de log antigos</li>
                <li>Arquivos de pré-busca (prefetch)</li>
                <li>Lixeira do Windows</li>
                <li>Arquivos de atualizações do Windows antigos</li>
              </ul>
              
              <h4 class="text-lg font-bold text-white mt-4 mb-2">Arquivos que Requerem Cuidado:</h4>
              <ul class="list-disc list-inside space-y-2 text-gray-300 mt-2">
                <li>Registros do sistema (requer backup antes de edição)</li>
                <li>Arquivos de programas em uso</li>
                <li>Arquivos de drivers recentes</li>
                <li>Arquivos de configuração personalizados</li>
              </ul>
            </div>
          `
        },
        {
          subtitle: "Locais Comuns de Acúmulo de Arquivos",
          content: `
            <div class="prose prose-invert max-w-none">
              <h4 class="text-lg font-bold text-white mt-4 mb-2">Pastas de Arquivos Temporários:</h4>
              <div class="bg-black p-4 rounded border border-yellow-500/30 font-mono text-sm text-yellow-400 mt-2">
                <p>%TEMP% - Pasta temporária do usuário</p>
                <p>C:\Windows\Temp - Pasta temporária do sistema</p>
                <p>%APPDATA%\Local\Temp - Pasta temporária local</p>
                <p>C:\Windows\Prefetch - Arquivos de pré-busca do sistema</p>
                <p>%LOCALAPPDATA%\Google\Chrome\User Data\Default\Cache - Cache do Chrome</p>
                <p>%LOCALAPPDATA%\Mozilla\Firefox\Profiles\cache - Cache do Firefox</p>
              </div>
            </div>
          `
        }
      ]
    },
    {
      title: "2. Limpeza Profunda com CCleaner",
      content: `
        <p class="mb-4 text-gray-300">CCleaner é uma das ferramentas mais populares para limpeza de sistemas Windows, oferecendo uma interface amigável e recursos avançados:</p>
      `,
      subsections: [
        {
          subtitle: "Passo 1: Preparação e Backup",
          content: `
            <ol class="space-y-2 text-gray-300 list-decimal list-inside ml-4">
              <li><strong>Backup de Dados:</strong> Copie documentos importantes para unidade externa ou nuvem</li>
              <li><strong>Ponto de Restauração:</strong> Crie restore point em Painel de Controle > Sistema > Proteção do Sistema</li>
              <li><strong>Fechar Programas:</strong> Encerre todos os aplicativos exceto o navegador para download</li>
              <li><strong>Download CCleaner:</strong> Baixe gratuitamente em <a href="https://www.ccleaner.com" class="text-[#31A8FF] hover:underline" target="_blank">ccleaner.com</a></li>
              <li><strong>Verificação de Integridade:</strong> Verifique a assinatura digital do instalador</li>
            </ol>
          `
        },
        {
          subtitle: "Passo 2: Instalação e Configuração Inicial",
          content: `
            <div class="prose prose-invert max-w-none">
              <h4 class="text-lg font-bold text-white mt-4 mb-2">Procedimento de Instalação:</h4>
              <ul class="list-disc list-inside space-y-2 text-gray-300">
                <li>Execute o instalador baixado como administrador</li>
                <li>Siga as telas de instalação padrão</li>
                <li>Desmarque opções de instalação de softwares adicionais</li>
                <li>Na primeira execução, clique em "Options" e desmarque opções de publicidade</li>
              </ul>
              
              <h4 class="text-lg font-bold text-white mt-4 mb-2">Configurações Recomendadas:</h4>
              <div class="bg-black p-4 rounded border border-green-500/30 font-mono text-sm text-green-400 mt-2">
                <p>Na aba "Advanced":</p>
                <p>- Habilite "Clean Windows Event Logs" para limpeza completa</p>
                <p>- Habilite "Clean Recycle Bin" para esvaziar lixeira</p>
                <p>- Habilite "Clean Browser History" para limpeza de navegação</p>
                <p>Na aba "Settings":</p>
                <p>- Marque "Close CCleaner after cleaning" para conveniência</p>
                <p>- Habilite "Update checking" para manter a ferramenta atualizada</p>
              </div>
            </div>
          `
        },
        {
          subtitle: "Passo 3: Análise e Limpeza de Arquivos Temporários",
          content: `
            <div class="prose prose-invert max-w-none">
              <h4 class="text-lg font-bold text-white mt-4 mb-2">Procedimento de Limpeza:</h4>
              <ul class="list-disc list-inside space-y-2 text-gray-300">
                <li>Clique na aba "Cleaner" e selecione "Windows" e "Applications"</li>
                <li>Marque todas as opções disponíveis (Temp files, Recycle Bin, Recent Docs, etc.)</li>
                <li>Desmarque opções que contenham dados importantes (ex: cookies de sites importantes)</li>
                <li>Clique em "Run Cleaner" para analisar os arquivos encontrados</li>
                <li>Após análise, clique novamente em "Run Cleaner" para remover os arquivos</li>
                <li>Confirme quando solicitado e aguarde conclusão da limpeza</li>
              </ul>
            </div>
          `
        },
        {
          subtitle: "Passo 4: Limpeza de Navegadores e Aplicativos",
          content: `
            <div class="prose prose-invert max-w-none">
              <h4 class="text-lg font-bold text-white mt-4 mb-2">Limpeza de Navegadores:</h4>
              <ul class="list-disc list-inside space-y-2 text-gray-300">
                <li>Na mesma aba "Cleaner", selecione cada navegador instalado (Chrome, Firefox, Edge, Opera)</li>
                <li>Marque opções de cache, cookies, histórico e dados de formulários</li>
                <li>Execute a limpeza separadamente para cada navegador</li>
                <li><strong>Importante:</strong> Faça backup de senhas importantes antes de limpar cookies</li>
              </ul>
              
              <h4 class="text-lg font-bold text-white mt-4 mb-2">Limpeza de Aplicativos:</h4>
              <p class="text-gray-300">A aba "Applications" permite limpar cache de diversos programas como Adobe Reader, Windows Media Player, entre outros.</p>
            </div>
          `
        },
        {
          subtitle: "Passo 5: Otimização do Registro (Opcional)",
          content: `
            <div class="prose prose-invert max-w-none">
              <h4 class="text-lg font-bold text-white mt-4 mb-2">Procedimento de Otimização:</h4>
              <ul class="list-disc list-inside space-y-2 text-gray-300">
                <li>Clique na aba "Registry" na parte superior</li>
                <li>Clique em "Scan for Issues" para encontrar entradas inválidas</li>
                <li>Revise cuidadosamente os itens encontrados (normalmente são seguros)</li>
                <li>Clique em "Fix Selected Issues" e confirme o backup do registro</li>
                <li>Reinicie o computador após conclusão</li>
                <li><strong>Atenção:</strong> Sempre faça backup do registro antes de fazer alterações</li>
              </ul>
            </div>
          `
        }
      ]
    },
    {
      title: "3. Ferramentas Alternativas e Nativas do Windows",
      content: `
        <p class="mb-4 text-gray-300">Além do CCleaner, existem outras excelentes opções gratuitas e ferramentas nativas do Windows para limpeza de computadores:</p>
      `,
      subsections: [
        {
          subtitle: "Ferramentas Nativas do Windows",
          content: `
            <div class="prose prose-invert max-w-none">
              <h4 class="text-lg font-bold text-white mt-4 mb-2">Disk Cleanup (Limpeza de Disco):</h4>
              <ul class="list-disc list-inside space-y-2 text-gray-300">
                <li>Executar: Win + R → cleanmgr</li>
                <li>Limpa arquivos temporários do sistema</li>
                <li>Libera espaço em unidades específicas</li>
                <li>Totalmente gratuito e integrado ao Windows</li>
                <li>Permite limpar arquivos de sistema com permissões de administrador</li>
              </ul>
              
              <h4 class="text-lg font-bold text-white mt-4 mb-2">Storage Sense:</h4>
              <p class="text-gray-300">Recurso do Windows 10/11 que limpa automaticamente arquivos temporários e desnecessários.</p>
              
              <h4 class="text-lg font-bold text-white mt-4 mb-2">Windows Settings:</h4>
              <p class="text-gray-300">Configurações > Sistema > Armazenamento > Limpar agora para limpeza rápida de arquivos temporários.</p>
            </div>
          `
        },
        {
          subtitle: "Alternativas Gratuitas",
          content: `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div class="bg-[#171313] p-4 rounded border border-[#31A8FF]/20">
                <h4 class="text-white font-semibold mb-2">BleachBit</h4>
                <ul class="text-gray-300 text-sm space-y-1">
                  <li>Software open-source gratuito</li>
                  <li>Funciona em Windows e Linux</li>
                  <li>Interface intuitiva similar ao CCleaner</li>
                  <li>Shred files para segurança máxima</li>
                  <li>Limpeza de mais de 150 aplicativos diferentes</li>
                </ul>
              </div>
              <div class="bg-[#171313] p-4 rounded border border-[#FF4B6B]/20">
                <h4 class="text-white font-semibold mb-2">Disk Cleanup (cleanmgr)</h4>
                <ul class="text-gray-300 text-sm space-y-1">
                  <li>Ferramenta nativa do Windows</li>
                  <li>Sem necessidade de instalação</li>
                  <li>Integração total com o sistema</li>
                  <li>Limpeza de arquivos de sistema</li>
                  <li>Remoção de atualizações antigas do Windows</li>
                </ul>
              </div>
              <div class="bg-[#171313] p-4 rounded border border-[#8B31FF]/20">
                <h4 class="text-white font-semibold mb-2">Wise Disk Cleaner</h4>
                <ul class="text-gray-300 text-sm space-y-1">
                  <li>Interface amigável e eficiente</li>
                  <li>Busca arquivos temporários em profundidade</li>
                  <li>Opções de limpeza agendada</li>
                  <li>Funcionalidade de proteção de arquivos</li>
                  <li>Leve e rápido</li>
                </ul>
              </div>
              <div class="bg-[#171313] p-4 rounded border border-[#31A8FF]/20">
                <h4 class="text-white font-semibold mb-2">Glarysoft Quick Shutdown</h4>
                <ul class="text-gray-300 text-sm space-y-1">
                  <li>Parte da suíte Glary Utilities</li>
                  <li>Limpeza e otimização combinadas</li>
                  <li>Monitoramento de sistema</li>
                  <li>Versão gratuita com funcionalidades básicas</li>
                  <li>Proteção de privacidade</li>
                </ul>
              </div>
            </div>
          `
        }
      ]
    },
    {
      title: "4. Desinstalação de Programas e Software Não Utilizado",
      content: `
        <p class="mb-4 text-gray-300">A desinstalação de programas desnecessários é uma parte crucial da limpeza profunda do computador:</p>
      `,
      subsections: [
        {
          subtitle: "Métodos de Desinstalação",
          content: `
            <div class="prose prose-invert max-w-none">
              <h4 class="text-lg font-bold text-white mt-4 mb-2">Via Configurações do Windows:</h4>
              <ol class="list-decimal list-inside space-y-2 text-gray-300">
                <li>Pressione Win + I para abrir Configurações</li>
                <li>Selecione Aplicativos > Aplicativos e recursos</li>
                <li>Clique em um programa e selecione Desinstalar</li>
                <li>Siga as instruções do assistente de desinstalação</li>
              </ol>
              
              <h4 class="text-lg font-bold text-white mt-4 mb-2">Via Painel de Controle:</h4>
              <ol class="list-decimal list-inside space-y-2 text-gray-300 mt-2">
                <li>Abra o Painel de Controle</li>
                <li>Selecione Programas > Programas e Recursos</li>
                <li>Selecione o programa e clique em Desinstalar</li>
                <li>Siga as instruções do assistente</li>
              </ol>
            </div>
          `
        },
        {
          subtitle: "Ferramentas de Desinstalação Profunda",
          content: `
            <div class="prose prose-invert max-w-none">
              <h4 class="text-lg font-bold text-white mt-4 mb-2">Revo Uninstaller:</h4>
              <p class="text-gray-300">Ferramenta que remove não apenas o programa, mas também todos os arquivos, pastas e entradas de registro relacionados.</p>
              
              <h4 class="text-lg font-bold text-white mt-4 mb-2">IObit Uninstaller:</h4>
              <p class="text-gray-300">Oferece varredura profunda após a desinstalação padrão para remover resíduos.</p>
              
              <h4 class="text-lg font-bold text-white mt-4 mb-2">Geek Uninstaller:</h4>
              <p class="text-gray-300">Ferramenta leve e gratuita que força a desinstalação de programas teimosos.</p>
            </div>
          `
        },
        {
          subtitle: "Programas Comuns para Remover",
          content: `
            <div class="prose prose-invert max-w-none">
              <h4 class="text-lg font-bold text-white mt-4 mb-2">Software Bloatware Comum:</h4>
              <ul class="list-disc list-inside space-y-2 text-gray-300">
                <li>Aplicativos de fabricantes de hardware (HP, Dell, Lenovo, etc.)</li>
                <li>Trialware de antivírus e software de otimização</li>
                <li>Aplicativos de redes sociais e jogos pré-instalados</li>
                <li>Softwares de backup e recuperação desnecessários</li>
                <li>Aplicativos de utilidades duplicadas</li>
              </ul>
            </div>
          `
        }
      ]
    },
    {
      title: "5. Otimização do Disco Rígido e SSD",
      content: `
        <p class="mb-4 text-gray-300">A otimização do disco é essencial para manter o desempenho do sistema, especialmente em discos mecânicos:</p>
      `,
      subsections: [
        {
          subtitle: "Desfragmentação de Discos Mecânicos (HDD)",
          content: `
            <div class="prose prose-invert max-w-none">
              <h4 class="text-lg font-bold text-white mt-4 mb-2">Importância da Desfragmentação:</h4>
              <p class="text-gray-300 mb-3">A desfragmentação organiza os arquivos no disco para melhorar o acesso e a velocidade de leitura:</p>
              <ol class="list-decimal list-inside space-y-2 text-gray-300">
                <li>Abra "Otimização e desfragmentação de unidades" (Win + R → dfrgui)</li>
                <li>Selecione o disco e clique em "Otimizar"</li>
                <li>Agende automaticamente para manutenção regular</li>
                <li>Recomendado mensalmente para discos mecânicos</li>
              </ol>
            </div>
          `
        },
        {
          subtitle: "Otimização de SSDs",
          content: `
            <div class="prose prose-invert max-w-none">
              <h4 class="text-lg font-bold text-white mt-4 mb-2">Diferenças para SSDs:</h4>
              <p class="text-gray-300 mb-3">SSDs não devem ser desfragmentados pois isso reduz sua vida útil. Em vez disso, devem ser otimizados com TRIM:</p>
              <ul class="list-disc list-inside space-y-2 text-gray-300 mt-2">
                <li>O Windows 10/11 faz TRIM automaticamente</li>
                <li>Verifique se o TRIM está ativado: fsutil behavior query DisableDeleteNotify</li>
                <li>Resultado "0" indica que o TRIM está ativado</li>
                <li>Evite enchimento do SSD acima de 80% de capacidade</li>
              </ul>
            </div>
          `
        },
        {
          subtitle: "Verificação de Erros no Disco",
          content: `
            <div class="prose prose-invert max-w-none">
              <h4 class="text-lg font-bold text-white mt-4 mb-2">Utilizando o CHKDSK:</h4>
              <p class="text-gray-300 mb-3">O comando CHKDSK verifica e corrige erros no sistema de arquivos:</p>
              <div class="bg-black p-4 rounded border border-blue-500/30 font-mono text-sm text-blue-400 mt-2">
                <p>chkdsk C: /f /r /x</p>
                <p># /f - Corrige erros no disco</p>
                <p># /r - Localiza setores ruins e recupera informações legíveis</p>
                <p># /x - Desmonta o volume se necessário antes do processo</p>
              </div>
            </div>
          `
        }
      ]
    },
    {
      title: "6. Limpeza Avançada do Sistema",
      content: `
        <p class="mb-4 text-gray-300">Técnicas avançadas para uma limpeza mais profunda do sistema operacional:</p>
      `,
      subsections: [
        {
          subtitle: "Limpeza de Arquivos de Sistema",
          content: `
            <div class="prose prose-invert max-w-none">
              <h4 class="text-lg font-bold text-white mt-4 mb-2">Windows Update Cleanup:</h4>
              <p class="text-gray-300 mb-3">Remove arquivos de atualizações antigas do Windows:</p>
              <ol class="list-decimal list-inside space-y-2 text-gray-300">
                <li>Execute Disk Cleanup como administrador</li>
                <li>Clique em "Limpar arquivos de sistema"</li>
                <li>Marque "Arquivos de atualizações do Windows"</li>
                <li>Execute a limpeza</li>
              </ol>
              
              <h4 class="text-lg font-bold text-white mt-4 mb-2">Componentes de Sistema Obsoletos:</h4>
              <p class="text-gray-300">Use o comando DISM para remover componentes desnecessários:</p>
              <div class="bg-black p-4 rounded border border-green-500/30 font-mono text-sm text-green-400 mt-2">
                <p>dism /online /cleanup-image /spsuperseded</p>
                <p>dism /online /cleanup-image /startcomponentcleanup</p>
              </div>
            </div>
          `
        },
        {
          subtitle: "Limpeza de Cache do Sistema",
          content: `
            <div class="prose prose-invert max-w-none">
              <h4 class="text-lg font-bold text-white mt-4 mb-2">Pastas de Cache Comuns:</h4>
              <ul class="list-disc list-inside space-y-2 text-gray-300">
                <li>%LOCALAPPDATA%\Microsoft\Windows\INetCache - Cache da Internet</li>
                <li>C:\Windows\SoftwareDistribution\Download - Cache de atualizações</li>
                <li>%USERPROFILE%\AppData\LocalLow\Temp - Arquivos temporários especiais</li>
                <li>C:\Windows\Logs - Arquivos de log do sistema</li>
              </ul>
            </div>
          `
        },
        {
          subtitle: "Verificação e Reparo do Sistema",
          content: `
            <div class="prose prose-invert max-w-none">
              <h4 class="text-lg font-bold text-white mt-4 mb-2">System File Checker (SFC):</h4>
              <p class="text-gray-300 mb-3">Verifica e repara arquivos do sistema corrompidos:</p>
              <div class="bg-black p-4 rounded border border-purple-500/30 font-mono text-sm text-purple-400 mt-2">
                <p>sfc /scannow</p>
              </div>
              
              <h4 class="text-lg font-bold text-white mt-4 mb-2">Deployment Image Servicing and Management (DISM):</h4>
              <p class="text-gray-300">Repara a imagem do sistema operacional:</p>
              <div class="bg-black p-4 rounded border border-yellow-500/30 font-mono text-sm text-yellow-400 mt-2">
                <p>dism /online /cleanup-image /restorehealth</p>
              </div>
            </div>
          `
        }
      ]
    },
    {
      title: "7. Problemas Comuns e Soluções",
      content: `
        <p class="mb-4 text-gray-300">Soluções para problemas frequentes que podem ocorrer durante ou após a limpeza do computador:</p>
      `,
      subsections: [
        {
          subtitle: "Problemas Durante a Limpeza",
          content: `
            <div class="space-y-4">
              <div class="bg-[#171313] p-4 rounded-lg border border-red-500/30">
                <h4 class="text-red-400 font-semibold mb-2">❌ Erro: "Access Denied" ao deletar arquivos</h4>
                <p class="text-gray-300 text-sm mb-2">Solução:</p>
                <ul class="text-gray-300 text-xs space-y-1 ml-4">
                  <li>Reinicie o computador em modo de segurança</li>
                  <li>Execute a ferramenta de limpeza como administrador (botão direito → Executar como administrador)</li>
                  <li>Desative programas que possam estar usando os arquivos</li>
                  <li>Use a ferramenta Unlocker para liberar arquivos travados</li>
                  <li>Tente o comando Takeown via Prompt de Comando como administrador</li>
                </ul>
              </div>
              
              <div class="bg-[#171313] p-4 rounded-lg border border-yellow-500/30">
                <h4 class="text-yellow-400 font-semibold mb-2">⚠️ Aviso: "System Restore Point Failed"</h4>
                <p class="text-gray-300 text-sm mb-2">Solução:</p>
                <ul class="text-gray-300 text-xs space-y-1 ml-4">
                  <li>Verifique espaço disponível em disco (mínimo 5GB livres)</li>
                  <li>Execute Disk Cleanup antes de criar restore point</li>
                  <li>Reinicie o serviço Volume Shadow Copy via services.msc</li>
                  <li>Tente criar restore point manualmente em System Properties</li>
                  <li>Verifique se o serviço está habilitado e em execução</li>
                </ul>
              </div>
            </div>
          `
        },
        {
          subtitle: "Problemas Após a Limpeza",
          content: `
            <div class="space-y-4">
              <div class="bg-[#171313] p-4 rounded-lg border border-purple-500/30">
                <h4 class="text-purple-400 font-semibold mb-2">🖥️ Programas Abrindo Lentos</h4>
                <p class="text-gray-300 text-sm mb-2">Causa Provável:</p>
                <ul class="text-gray-300 text-xs space-y-1 ml-4 mb-2">
                  <li>Cache de programas foi limpo</li>
                  <li>Navegador precisa reconstruir cache</li>
                  <li>Arquivos temporários foram removidos</li>
                  <li>Sistema operacional reconstruindo índices</li>
                </ul>
                <p class="text-gray-300 text-sm">Solução: Normalize após algumas horas de uso. Os programas irão reconstruir caches automaticamente.</p>
              </div>
              
              <div class="bg-[#171313] p-4 rounded-lg border border-blue-500/30">
                <h4 class="text-blue-400 font-semibold mb-2">🔒 Sites Pedindo Login Novamente</h4>
                <p class="text-gray-300 text-sm mb-2">Causa:</p>
                <ul class="text-gray-300 text-xs space-y-1 ml-4 mb-2">
                  <li>Cookies e dados de sessão foram limpos</li>
                  <li>Autofill de formulários foi removido</li>
                  <li>Cache de autenticação foi apagado</li>
                </ul>
                <p class="text-gray-300 text-sm">Solução: Faça login novamente nos sites importantes. Considere desmarcar "Cookies" em limpezas futuras se quiser manter logins salvos.</p>
              </div>
              
              <div class="bg-[#171313] p-4 rounded-lg border border-green-500/30">
                <h4 class="text-green-400 font-semibold mb-2">⚙️ Sistema Instável Após Limpeza do Registro</h4>
                <p class="text-gray-300 text-sm mb-2">Causa:</p>
                <ul class="text-gray-300 text-xs space-y-1 ml-4 mb-2">
                  <li>Entradas de registro importantes foram removidas</li>
                  <li>Programas não funcionam corretamente</li>
                  <li>Erros de inicialização ocorrem</li>
                </ul>
                <p class="text-gray-300 text-sm">Solução: Restaure o sistema a partir de um ponto de restauração criado antes da limpeza.</p>
              </div>
            </div>
          `
        },
        {
          subtitle: "Dicas de Prevenção",
          content: `
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
              <li>Configure limpeza automática mensal no próprio CCleaner ou usando ferramentas nativas</li>
              <li>Mantenha pelo menos 15-20% de espaço livre no disco principal</li>
              <li>Faça backup de senhas importantes antes de limpar navegadores</li>
              <li>Evite limpar "Recent Documents" se usa documentos recentemente</li>
              <li>Monitore o espaço em disco após cada limpeza significativa</li>
              <li>Crie pontos de restauração antes de grandes limpezas</li>
              <li>Use modos de segurança para limpezas profundas quando necessário</li>
            </ul>
          `
        }
      ]
    },
    {
      title: "Conclusão Profissional",
      content: `
        <div class="bg-gradient-to-r from-[#1E1E22] to-[#171313] p-6 rounded-xl border border-gray-800">
          <p class="mb-4 text-gray-300 leading-relaxed">
            A limpeza completa do computador é uma prática essencial para manter o desempenho ideal do sistema. 
            Seguindo este guia, você aplicou técnicas de nível profissional que limpam e otimizam seu sistema de forma segura e eficiente.
          </p>
          <p class="text-gray-400 italic border-l-2 border-[#31A8FF] pl-4">
            Lembre-se: A manutenção regular é mais eficaz do que limpezas esporádicas e intensas. Recomendamos manter uma rotina de limpeza mensal para garantir o melhor desempenho do seu sistema.
          </p>
          
          <div class="mt-6 pt-6 border-t border-gray-700">
            <h4 class="text-lg font-bold text-white mb-3">✅ Checklist Final de Limpeza:</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div class="flex items-center gap-2 text-green-400"><span class="text-lg">✓</span> Backup de dados importantes realizado</div>
              <div class="flex items-center gap-2 text-green-400"><span class="text-lg">✓</span> Ponto de restauração do sistema criado</div>
              <div class="flex items-center gap-2 text-green-400"><span class="text-lg">✓</span> Arquivos temporários removidos</div>
              <div class="flex items-center gap-2 text-green-400"><span class="text-lg">✓</span> Cache de navegadores limpo</div>
              <div class="flex items-center gap-2 text-green-400"><span class="text-lg">✓</span> Programas desnecessários desinstalados</div>
              <div class="flex items-center gap-2 text-green-400"><span class="text-lg">✓</span> Disco desfragmentado (se HDD)</div>
              <div class="flex items-center gap-2 text-green-400"><span class="text-lg">✓</span> Verificação de erros no disco realizada</div>
              <div class="flex items-center gap-2 text-green-400"><span class="text-lg">✓</span> Espaço liberado confirmado</div>
            </div>
          </div>
        </div>
      `
    }
  ];

  const faqItems = [
    {
      question: "Com que frequência devo fazer uma limpeza completa do computador?",
      answer: "Recomenda-se uma limpeza completa mensal para computadores de uso regular. Computadores com uso intensivo podem se beneficiar de limpezas semanais mais leves. Atividades como jogos, edição de vídeo ou uso de software profissional aceleram o acúmulo de arquivos temporários, exigindo limpezas mais frequentes."
    },
    {
      question: "É seguro limpar o registro do Windows?",
      answer: "A limpeza do registro pode ser segura se feita com ferramentas confiáveis e com cuidado. Sempre crie um ponto de restauração antes de qualquer edição no registro. Use ferramentas como CCleaner ou Glary Utilities que fazem verificações de segurança antes de remover entradas. Evite edição manual do registro a menos que você tenha conhecimento avançado."
    },
    {
      question: "Posso danificar meu computador ao limpar arquivos?",
      answer: "Em geral, não. As ferramentas recomendadas são seguras e evitam remover arquivos essenciais. No entanto, é importante ter um backup dos dados importantes e um ponto de restauração do sistema antes de fazer limpezas profundas. Evite remover arquivos manualmente sem saber sua função."
    },
    {
      question: "Preciso limpar o SSD da mesma forma que um HDD?",
      answer: "Não, os SSDs não devem ser desfragmentados pois isso reduz sua vida útil. Em vez disso, os SSDs usam o comando TRIM para manter o desempenho, que é feito automaticamente pelo Windows 10/11. Você pode limpar arquivos temporários e cache normalmente, mas evite enchimento do SSD acima de 80% de capacidade para manter espaço para operações internas."
    },
    {
      question: "Como sei se meu disco precisa de limpeza?",
      answer: "Sinais comuns incluem lentidão do sistema, inicialização demorada, mensagens de espaço em disco baixo, travamentos frequentes e aumento do tempo de resposta dos programas. Se notar algum desses sinais, é recomendável executar uma varredura de limpeza para identificar arquivos desnecessários."
    },
    {
      question: "Quanto espaço posso esperar liberar com uma limpeza completa?",
      answer: "A quantidade de espaço liberado varia conforme o uso do computador, mas tipicamente você pode esperar liberar entre 5GB e 20GB em uma limpeza completa. Computadores usados por mais de 6 meses sem manutenção podem liberar ainda mais espaço, chegando a 30GB ou mais em sistemas com uso intensivo."
    },
    {
      question: "Devo limpar o cache dos navegadores com frequência?",
      answer: "Sim, limpar o cache dos navegadores regularmente (semanalmente) melhora o desempenho e protege sua privacidade. No entanto, isso fará com que você precise fazer login novamente nos sites e reconstruir o cache de navegação. Considere manter senhas salvas em um gerenciador seguro para facilitar o processo."
    },
    {
      question: "É melhor usar ferramentas nativas do Windows ou softwares de terceiros?",
      answer: "Ambas as opções têm vantagens. As ferramentas nativas do Windows são seguras e não requerem instalação, mas podem ter menos recursos. Softwares de terceiros como CCleaner oferecem mais opções e interface mais amigável, mas exigem instalação. Para limpezas completas, recomenda-se uma combinação de ambas abordagens."
    }
  ];
  
  const externalReferences = [
    { name: "Microsoft Docs - Disk Cleanup", url: "https://docs.microsoft.com/en-us/windows-server/storage/fs-req/windows-file-system-requirements" },
    { name: "Windows Storage Sense Best Practices", url: "https://docs.microsoft.com/en-us/windows-hardware/manufacture/desktop/storage-sense" },
    { name: "CCleaner Official Site", url: "https://www.ccleaner.com/docs/ccleaner" },
    { name: "System File Checker (SFC) Guide", url: "https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/sfc" },
    { name: "DISM Command-Line Options", url: "https://docs.microsoft.com/en-us/windows-hardware/manufacture/desktop/dism" },
    { name: "Safe Registry Cleaning Practices", url: "https://www.howtogeek.com/457348/how-to-safely-clean-the-windows-registry/" }
  ];

  const relatedGuides = [
    {
      href: "/guias/seguranca-digital",
      title: "Segurança Digital Completa",
      description: "Proteção abrangente contra ameaças cibernéticas"
    },
    {
      href: "/guias/otimizacao-performance",
      title: "Otimização de Performance",
      description: "Maximize o desempenho do seu sistema"
    },
    {
      href: "/guias/manutencao-preventiva",
      title: "Manutenção Preventiva",
      description: "Estratégias completas de cuidados com o sistema"
    },
    {
      href: "/guias/limpeza-computador",
      title: "Limpeza Profunda de Computador",
      description: "Técnicas avançadas de limpeza e otimização"
    },
    {
      href: "/guias/recuperacao-sistema",
      title: "Recuperação de Sistema",
      description: "Estratégias de recuperação em caso de falhas"
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="75 minutos"
      difficultyLevel="Intermediário"
      contentSections={contentSections}
      summaryTable={summaryTable}
      faqItems={faqItems}
      externalReferences={externalReferences}
      relatedGuides={relatedGuides}
    />
  );
}

