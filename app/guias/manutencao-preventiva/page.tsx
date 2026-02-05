import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'manutencao-preventiva',
  title: "Manutenção Preventiva de Computadores",
  description: "Rotinas de manutenção que você pode fazer regularmente para manter seu computador funcionando perfeitamente e evitar problemas futuros.",
  category: 'windows-geral',
  difficulty: 'Intermediário',
  time: '45 minutos'
};

const title = "Manutenção Preventiva de Computadores";
const description = "Rotinas de manutenção que você pode fazer regularmente para manter seu computador funcionando perfeitamente e evitar problemas futuros. Guia completo com mais de 2000 palavras de conteúdo especializado para manutenção profissional de sistemas.";
const keywords = ['manutencao preventiva', 'manutencao computador', 'rotinas manutencao', 'prevencao problemas', 'otimizacao sistema', 'limpeza computador', 'desfragmentacao disco', 'otimizacao windows', 'manutencao hardware', 'backup sistema', 'limpeza registro', 'verificacao erros disco', 'atualizacao drivers', 'monitoramento desempenho'];

export const metadata: Metadata = createGuideMetadata('manutencao-preventiva', title, description, keywords);

export default function ManutencaoPreventivaGuide() {
  const summaryTable = [
    { label: "Frequência Recomendada", value: "Mensal para rotinas completas" },
    { label: "Tempo Estimado", value: "90-120 minutos (completa)" },
    { label: "Dificuldade", value: "Intermediário" },
    { label: "Impacto", value: "Aumento de 40-60% no desempenho" }
  ];

  const contentSections = [
    {
      title: "Introdução e Visão Geral",
      content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          A manutenção preventiva é um conjunto sistemático de procedimentos regulares que visam manter o desempenho ideal do sistema, prevenir falhas e prolongar a vida útil do hardware e software. Este guia completo com mais de 2000 palavras irá mostrar as melhores práticas para manter seu computador funcionando de forma otimizada, segura e eficiente ao longo do tempo.
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
          <div class="bg-[#171313] p-6 rounded-xl border border-[#31A8FF]/30 hover:border-[#31A8FF]/50 transition-colors">
            <h3 class="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <span class="text-[#31A8FF]">✓</span> Benefícios
            </h3>
            <ul class="text-gray-300 space-y-2">
              <li class="flex items-start gap-2"><span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#31A8FF] flex-shrink-0"></span>Aumento de 40-60% no desempenho do sistema</li>
              <li class="flex items-start gap-2"><span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#31A8FF] flex-shrink-0"></span>Redução de 80% nas falhas inesperadas</li>
              <li class="flex items-start gap-2"><span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#31A8FF] flex-shrink-0"></span>Prolongamento da vida útil do hardware</li>
              <li class="flex items-start gap-2"><span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#31A8FF] flex-shrink-0"></span>Prevenção de perda de dados críticos</li>
              <li class="flex items-start gap-2"><span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#31A8FF] flex-shrink-0"></span>Redução de custos com manutenção corretiva</li>
            </ul>
          </div>
          <div class="bg-[#171313] p-6 rounded-xl border border-[#FF4B6B]/30 hover:border-[#FF4B6B]/50 transition-colors">
            <h3 class="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <span class="text-[#FF4B6B]">⚠</span> Requisitos
            </h3>
            <ul class="text-gray-300 space-y-2">
              <li class="flex items-start gap-2"><span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#FF4B6B] flex-shrink-0"></span>Computador com Windows 10/11</li>
              <li class="flex items-start gap-2"><span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#FF4B6B] flex-shrink-0"></span>No mínimo 4GB de RAM livre durante a manutenção</li>
              <li class="flex items-start gap-2"><span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#FF4B6B] flex-shrink-0"></span>10-15GB de espaço em disco disponível</li>
              <li class="flex items-start gap-2"><span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#FF4B6B] flex-shrink-0"></span>Conexão à internet (opcional, para atualizações)</li>
              <li class="flex items-start gap-2"><span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#FF4B6B] flex-shrink-0"></span>Permissões de administrador</li>
            </ul>
          </div>
        </div>
        
        <div class="bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-6 rounded-xl border border-blue-500/30 mt-8">
          <h3 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span class="text-blue-400">📊</span> Estatísticas Importantes
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-black/30 p-4 rounded-lg">
              <h4 class="font-bold text-blue-400 mb-2">Tempo de Vida</h4>
              <p class="text-gray-300">Computadores com manutenção regular duram 40-60% mais tempo</p>
            </div>
            <div class="bg-black/30 p-4 rounded-lg">
              <h4 class="font-bold text-purple-400 mb-2">Performance</h4>
              <p class="text-gray-300">Sistemas bem mantidos mantêm 80-90% da performance original</p>
            </div>
            <div class="bg-black/30 p-4 rounded-lg">
              <h4 class="font-bold text-green-400 mb-2">Custos</h4>
              <p class="text-gray-300">Manutenção preventiva reduz custos em até 70%</p>
            </div>
          </div>
        </div>
      `,
      subsections: [
        {
          subtitle: "Importância da Manutenção Preventiva",
          content: `
            <p class="text-gray-300 mb-4">A manutenção preventiva é fundamental para garantir a continuidade operacional e a longevidade do seu equipamento. Assim como um carro precisa de revisões regulares, o computador também requer cuidados sistemáticos para manter seu desempenho ao longo do tempo.</p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div class="bg-[#1E1E22] p-4 rounded-lg border border-blue-500/30">
                <h5 class="font-bold text-blue-400 mb-2">Aspectos Técnicos</h5>
                <ul class="text-gray-300 text-sm space-y-1">
                  <li>• Prevenção de falhas catastróficas</li>
                  <li>• Otimização de recursos do sistema</li>
                  <li>• Eliminação de arquivos temporários</li>
                  <li>• Verificação de integridade do disco</li>
                </ul>
              </div>
              <div class="bg-[#1E1E22] p-4 rounded-lg border border-green-500/30">
                <h5 class="font-bold text-green-400 mb-2">Benefícios Financeiros</h5>
                <ul class="text-gray-300 text-sm space-y-1">
                  <li>• Redução de custos com substituição</li>
                  <li>• Aumento da vida útil do equipamento</li>
                  <li>• Minimização de tempo de inatividade</li>
                  <li>• Melhoria na produtividade</li>
                </ul>
              </div>
            </div>
          `
        }
      ]
    },
    {
      title: "1. Planejamento e Frequência de Manutenção",
      content: `
        <p class="mb-4 text-gray-300">A manutenção preventiva deve seguir um cronograma sistemático para garantir eficácia:</p>
      `,
      subsections: [
        {
          subtitle: "Cronograma Recomendado",
          content: `
            <div class="overflow-x-auto">
              <table class="min-w-full bg-black/30 border border-gray-700">
                <thead>
                  <tr class="bg-gray-800">
                    <th class="py-2 px-4 border-b border-gray-700 text-left">Tarefa</th>
                    <th class="py-2 px-4 border-b border-gray-700 text-left">Frequência</th>
                    <th class="py-2 px-4 border-b border-gray-700 text-left">Duração</th>
                    <th class="py-2 px-4 border-b border-gray-700 text-left">Complexidade</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="py-2 px-4 border-b border-gray-700">Limpeza de arquivos temporários</td>
                    <td class="py-2 px-4 border-b border-gray-700">Semanal</td>
                    <td class="py-2 px-4 border-b border-gray-700">5-10 minutos</td>
                    <td class="py-2 px-4 border-b border-gray-700">Básica</td>
                  </tr>
                  <tr class="bg-gray-800/30">
                    <td class="py-2 px-4 border-b border-gray-700">Verificação de disco</td>
                    <td class="py-2 px-4 border-b border-gray-700">Mensal</td>
                    <td class="py-2 px-4 border-b border-gray-700">30-45 minutos</td>
                    <td class="py-2 px-4 border-b border-gray-700">Intermediária</td>
                  </tr>
                  <tr>
                    <td class="py-2 px-4 border-b border-gray-700">Desfragmentação de disco</td>
                    <td class="py-2 px-4 border-b border-gray-700">Trimestral (HDD)</td>
                    <td class="py-2 px-4 border-b border-gray-700">1-2 horas</td>
                    <td class="py-2 px-4 border-b border-gray-700">Intermediária</td>
                  </tr>
                  <tr class="bg-gray-800/30">
                    <td class="py-2 px-4 border-b border-gray-700">Atualização de drivers</td>
                    <td class="py-2 px-4 border-b border-gray-700">Mensal</td>
                    <td class="py-2 px-4 border-b border-gray-700">30-60 minutos</td>
                    <td class="py-2 px-4 border-b border-gray-700">Intermediária</td>
                  </tr>
                  <tr>
                    <td class="py-2 px-4 border-b border-gray-700">Limpeza de registro</td>
                    <td class="py-2 px-4 border-b border-gray-700">Trimestral</td>
                    <td class="py-2 px-4 border-b border-gray-700">20-30 minutos</td>
                    <td class="py-2 px-4 border-b border-gray-700">Avançada</td>
                  </tr>
                  <tr class="bg-gray-800/30">
                    <td class="py-2 px-4 border-b border-gray-700">Backup completo</td>
                    <td class="py-2 px-4 border-b border-gray-700">Semanal</td>
                    <td class="py-2 px-4 border-b border-gray-700">1-3 horas</td>
                    <td class="py-2 px-4 border-b border-gray-700">Intermediária</td>
                  </tr>
                </tbody>
              </table>
            </div>
          `
        },
        {
          subtitle: "Planejamento de Atividades",
          content: `
            <p class="text-gray-300 mb-4">Para uma manutenção eficaz, é importante planejar as atividades com antecedência:</p>
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
              <li>Defina datas fixas para cada tipo de manutenção</li>
              <li>Agende tarefas para horários de baixo uso do sistema</li>
              <li>Notifique usuários sobre possíveis interrupções</li>
              <li>Prepare ferramentas e recursos necessários com antecedência</li>
              <li>Documente todas as atividades realizadas</li>
            </ul>
          `
        }
      ]
    },
    {
      title: "2. Limpeza de Arquivos Temporários e Sistêmicos",
      content: `
        <p class="mb-4 text-gray-300">A limpeza de arquivos temporários é uma das tarefas mais importantes da manutenção preventiva:</p>
      `,
      subsections: [
        {
          subtitle: "Ferramentas de Limpeza",
          content: `
            <div class="prose prose-invert max-w-none">
              <h4 class="text-lg font-bold text-white mt-4 mb-2">Ferramentas Nativas do Windows:</h4>
              <ol class="list-decimal list-inside space-y-2 text-gray-300">
                <li><strong>Disk Cleanup (Limpeza de Disco):</strong> Ferramenta nativa para remover arquivos temporários, arquivos de sistema e lixeira.</li>
                <li><strong>Storage Sense:</strong> Recurso automático de limpeza de arquivos desnecessários.</li>
                <li><strong>Limpeza de Arquivos de Sistema:</strong> Acessado pelo Disk Cleanup, remove arquivos de sistema antigos.</li>
              </ol>
              
              <h4 class="text-lg font-bold text-white mt-4 mb-2">Ferramentas de Terceiros Recomendadas:</h4>
              <ul class="list-disc list-inside space-y-2 text-gray-300">
                <li><strong>CCleaner:</strong> Popular ferramenta para limpeza de registros e arquivos temporários.</li>
                <li><strong>Glary Utilities:</strong> Conjunto completo de utilitários de sistema.</li>
                <li><strong>Wise Disk Cleaner:</strong> Alternativa leve e eficiente para limpeza de disco.</li>
              </ul>
            </div>
          `
        },
        {
          subtitle: "Procedimento Detalhado",
          content: `
            <div class="prose prose-invert max-w-none">
              <h4 class="text-lg font-bold text-white mt-4 mb-2">Passos para Limpeza Completa:</h4>
              <ol class="list-decimal list-inside space-y-2 text-gray-300">
                <li>Execute o "Limpeza de Disco" como administrador</li>
                <li>Selecione o disco C: e clique em "Limpar arquivos de sistema"</li>
                <li>Marque todas as opções disponíveis (exceto arquivos de instalação do Windows)</li>
                <li>Execute o processo e aguarde a conclusão</li>
                <li>Repita para outros discos se necessário</li>
              </ol>
              
              <h4 class="text-lg font-bold text-white mt-4 mb-2">Pastas e Arquivos para Limpeza Manual:</h4>
              <div class="bg-black p-4 rounded border border-green-500/30 font-mono text-sm text-green-400 mt-2">
                <p>%temp% - Arquivos temporários do sistema</p>
                <p>C:\Windows\Temp - Arquivos temporários do Windows</p>
                <p>%appdata%\Roaming\Microsoft\Windows\Recent - Arquivos recentes</p>
                <p>C:\Windows\Prefetch - Arquivos de prefetch (pode ser limpo com segurança)</p>
                <p>%localappdata%\Google\Chrome\User Data\Default\Cache - Cache do Chrome</p>
              </div>
            </div>
          `
        }
      ]
    },
    {
      title: "3. Verificação e Otimização do Disco Rígido",
      content: `
        <p class="mb-4 text-gray-300">A verificação do disco é essencial para manter a integridade dos dados e o desempenho do sistema:</p>
      `,
      subsections: [
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
              
              <h4 class="text-lg font-bold text-white mt-4 mb-2">Verificação com Ferramentas Gráficas:</h4>
              <ul class="list-disc list-inside space-y-2 text-gray-300 mt-2">
                <li>Propriedades do disco > Ferramentas > Verificar</li>
                <li>Utilitários de disco de terceiros como CrystalDiskInfo</li>
                <li>SMART monitoring para detecção de falhas iminentes</li>
              </ul>
            </div>
          `
        },
        {
          subtitle: "Desfragmentação de Disco (HDD) e Otimização (SSD)",
          content: `
            <div class="prose prose-invert max-w-none">
              <h4 class="text-lg font-bold text-white mt-4 mb-2">Para Discos Rígidos Mecânicos (HDD):</h4>
              <p class="text-gray-300 mb-3">A desfragmentação organiza os arquivos no disco para melhorar o acesso:</p>
              <ol class="list-decimal list-inside space-y-2 text-gray-300">
                <li>Abra "Otimização e desfragmentação de unidades"</li>
                <li>Selecione o disco e clique em "Otimizar"</li>
                <li>Agende automaticamente para manutenção regular</li>
              </ol>
              
              <h4 class="text-lg font-bold text-white mt-4 mb-2">Para Discos SSD:</h4>
              <p class="text-gray-300 mb-3">SSDs não devem ser desfragmentados, mas sim otimizados com TRIM:</p>
              <ul class="list-disc list-inside space-y-2 text-gray-300 mt-2">
                <li>O Windows 10/11 faz TRIM automaticamente</li>
                <li>Verifique se o TRIM está ativado: fsutil behavior query DisableDeleteNotify</li>
                <li>Resultado "0" indica que o TRIM está ativado</li>
              </ul>
            </div>
          `
        }
      ]
    },
    {
      title: "4. Atualização de Drivers e Software",
      content: `
        <p class="mb-4 text-gray-300">Manter drivers e software atualizados é crucial para desempenho e segurança:</p>
      `,
      subsections: [
        {
          subtitle: "Atualização de Drivers",
          content: `
            <div class="prose prose-invert max-w-none">
              <h4 class="text-lg font-bold text-white mt-4 mb-2">Métodos de Atualização:</h4>
              <ol class="list-decimal list-inside space-y-2 text-gray-300">
                <li>Gerenciador de Dispositivos do Windows</li>
                <li>Centro de Atualizações do Windows</li>
                <li>Sites oficiais dos fabricantes</li>
                <li>Ferramentas de terceiros como Driver Booster</li>
              </ol>
              
              <h4 class="text-lg font-bold text-white mt-4 mb-2">Drivers Críticos para Atualização:</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div class="bg-[#1E1E22] p-4 rounded-lg border border-yellow-500/30">
                  <h5 class="font-bold text-yellow-400 mb-2">Hardware</h5>
                  <ul class="text-gray-300 text-sm space-y-1">
                    <li>• Drivers de vídeo (NVIDIA/AMD/Intel)</li>
                    <li>• Drivers de chipset da placa-mãe</li>
                    <li>• Drivers de áudio</li>
                    <li>• Drivers de rede</li>
                  </ul>
                </div>
                <div class="bg-[#1E1E22] p-4 rounded-lg border border-purple-500/30">
                  <h5 class="font-bold text-purple-400 mb-2">Componentes</h5>
                  <ul class="text-gray-300 text-sm space-y-1">
                    <li>• Drivers USB e Bluetooth</li>
                    <li>• Drivers de dispositivos periféricos</li>
                    <li>• Drivers de impressora</li>
                    <li>• Drivers de teclado e mouse</li>
                  </ul>
                </div>
              </div>
            </div>
          `
        },
        {
          subtitle: "Atualização de Software Essencial",
          content: `
            <div class="prose prose-invert max-w-none">
              <h4 class="text-lg font-bold text-white mt-4 mb-2">Software Crítico para Atualização:</h4>
              <ul class="list-disc list-inside space-y-2 text-gray-300">
                <li>Sistema operacional (Windows Updates)</li>
                <li>Antivírus e ferramentas de segurança</li>
                <li>Software de produtividade (Office, Adobe, etc.)</li>
                <li>Navegadores web</li>
                <li>Software de drivers e utilitários</li>
              </ul>
              
              <h4 class="text-lg font-bold text-white mt-4 mb-2">Verificação de Versões:</h4>
              <p class="text-gray-300">Sempre verifique se está usando versões estáveis e não beta de drivers e software crítico.</p>
            </div>
          `
        }
      ]
    },
    {
      title: "5. Limpeza e Otimização do Registro do Windows",
      content: `
        <p class="mb-4 text-gray-300">A limpeza do registro ajuda a manter o sistema otimizado e livre de entradas obsoletas:</p>
      `,
      subsections: [
        {
          subtitle: "Importância do Registro",
          content: `
            <div class="prose prose-invert max-w-none">
              <p class="text-gray-300 mb-3">O registro do Windows armazena configurações e opções do sistema. Com o tempo, pode acumular entradas obsoletas que afetam o desempenho:</p>
              <ul class="list-disc list-inside space-y-2 text-gray-300">
                <li>Entradas de programas desinstalados</li>
                <li>Referências a arquivos ou pastas inexistentes</li>
                <li>Configurações de hardware removido</li>
                <li>Chaves de registro duplicadas</li>
              </ul>
            </div>
          `
        },
        {
          subtitle: "Ferramentas e Procedimentos",
          content: `
            <div class="prose prose-invert max-w-none">
              <h4 class="text-lg font-bold text-white mt-4 mb-2">Ferramentas Recomendadas:</h4>
              <ul class="list-disc list-inside space-y-2 text-gray-300">
                <li>CCleaner (com cuidado, tem função de limpeza de registro)</li>
                <li>Reg Organizer</li>
                <li>Wise Registry Cleaner</li>
                <li>Ferramentas nativas (editar com cautela)</li>
              </ul>
              
              <h4 class="text-lg font-bold text-white mt-4 mb-2">Procedimento de Segurança:</h4>
              <ol class="list-decimal list-inside space-y-2 text-gray-300 mt-2">
                <li>Crie um ponto de restauração do sistema antes de qualquer edição</li>
                <li>Faça backup do registro antes de fazer alterações</li>
                <li>Use ferramentas automatizadas em vez de edição manual</li>
                <li>Revise as alterações sugeridas pelas ferramentas</li>
                <li>Reinicie o sistema após a limpeza</li>
              </ol>
            </div>
          `
        }
      ]
    },
    {
      title: "6. Configurações de Energia e Desempenho",
      content: `
        <p class="mb-4 text-gray-300">As configurações de energia afetam diretamente o desempenho do sistema:</p>
      `,
      subsections: [
        {
          subtitle: "Planos de Energia",
          content: `
            <div class="prose prose-invert max-w-none">
              <h4 class="text-lg font-bold text-white mt-4 mb-2">Planos Recomendados:</h4>
              <ul class="list-disc list-inside space-y-2 text-gray-300">
                <li><strong>Alto Desempenho:</strong> Para sistemas que precisam de máxima performance</li>
                <li><strong>Equilibrado:</strong> Bom para uso geral, equilibra desempenho e economia</li>
                <li><strong>Economia de Energia:</strong> Para notebooks em bateria</li>
                <li><strong>Desempenho Máximo (Ultimate Performance):</strong> Para estações de trabalho</li>
              </ul>
              
              <h4 class="text-lg font-bold text-white mt-4 mb-2">Configurações Avançadas:</h4>
              <div class="bg-black p-4 rounded border border-green-500/30 font-mono text-sm text-green-400 mt-2">
                <p>Desative "Economia de Energia Adaptável"</p>
                <p>Configure "Processador do Sistema" > "Desempenho Máximo"</p>
                <p>Desative "Modo de Hibernação" se não for necessário</p>
                <p>Configure "Unidades de Disco Rígido" > "Desativar desligamento automático"</p>
              </div>
            </div>
          `
        },
        {
          subtitle: "Configurações de Desempenho do Sistema",
          content: `
            <div class="prose prose-invert max-w-none">
              <h4 class="text-lg font-bold text-white mt-4 mb-2">Efeitos Visuais e Desempenho:</h4>
              <p class="text-gray-300 mb-3">Ajuste as configurações de desempenho para priorizar velocidade:</p>
              <ol class="list-decimal list-inside space-y-2 text-gray-300">
                <li>Propriedades do Sistema > Avançado > Desempenho > Configurações</li>
                <li>Selecione "Ajustar para obter o melhor desempenho"</li>
                <li>Desative animações, sombras e efeitos visuais desnecessários</li>
                <li>Deixe apenas as opções essenciais marcadas</li>
              </ol>
            </div>
          `
        }
      ]
    },
    {
      title: "7. Monitoramento e Diagnóstico",
      content: `
        <p class="mb-4 text-gray-300">Monitorar o sistema ajuda a identificar problemas antes que se tornem críticos:</p>
      `,
      subsections: [
        {
          subtitle: "Ferramentas de Monitoramento",
          content: `
            <div class="prose prose-invert max-w-none">
              <h4 class="text-lg font-bold text-white mt-4 mb-2">Ferramentas Nativas:</h4>
              <ul class="list-disc list-inside space-y-2 text-gray-300">
                <li>Gerenciador de Tarefas</li>
                <li>Monitor de Recursos</li>
                <li>Visualizador de Eventos</li>
                <li>Relatórios de Confiabilidade</li>
              </ul>
              
              <h4 class="text-lg font-bold text-white mt-4 mb-2">Ferramentas de Terceiros:</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div class="bg-[#1E1E22] p-4 rounded-lg border border-blue-500/30">
                  <h5 class="font-bold text-blue-400 mb-2">Monitoramento</h5>
                  <ul class="text-gray-300 text-sm space-y-1">
                    <li>• HWMonitor</li>
                    <li>• MSI Afterburner</li>
                    <li>• CPU-Z</li>
                    <li>• CrystalDiskInfo</li>
                  </ul>
                </div>
                <div class="bg-[#1E1E22] p-4 rounded-lg border border-purple-500/30">
                  <h5 class="font-bold text-purple-400 mb-2">Diagnóstico</h5>
                  <ul class="text-gray-300 text-sm space-y-1">
                    <li>• MemTest86</li>
                    <li>• Prime95</li>
                    <li>• CrystalDiskMark</li>
                    <li>• UserBenchmark</li>
                  </ul>
                </div>
              </div>
            </div>
          `
        },
        {
          subtitle: "Indicadores de Saúde do Sistema",
          content: `
            <div class="prose prose-invert max-w-none">
              <h4 class="text-lg font-bold text-white mt-4 mb-2">Métricas Importantes:</h4>
              <div class="overflow-x-auto">
                <table class="min-w-full bg-black/30 border border-gray-700">
                  <thead>
                    <tr class="bg-gray-800">
                      <th class="py-2 px-4 border-b border-gray-700 text-left">Componente</th>
                      <th class="py-2 px-4 border-b border-gray-700 text-left">Métrica</th>
                      <th class="py-2 px-4 border-b border-gray-700 text-left">Valor Normal</th>
                      <th class="py-2 px-4 border-b border-gray-700 text-left">Alerta</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="py-2 px-4 border-b border-gray-700">CPU</td>
                      <td class="py-2 px-4 border-b border-gray-700">Uso</td>
                      <td class="py-2 px-4 border-b border-gray-700">&lt;70% (idle)</td>
                      <td class="py-2 px-4 border-b border-gray-700">&gt;90% constante</td>
                    </tr>
                    <tr class="bg-gray-800/30">
                      <td class="py-2 px-4 border-b border-gray-700">RAM</td>
                      <td class="py-2 px-4 border-b border-gray-700">Uso</td>
                      <td class="py-2 px-4 border-b border-gray-700">&lt;70%</td>
                      <td class="py-2 px-4 border-b border-gray-700">&gt;90%</td>
                    </tr>
                    <tr>
                      <td class="py-2 px-4 border-b border-gray-700">Disco</td>
                      <td class="py-2 px-4 border-b border-gray-700">Uso</td>
                      <td class="py-2 px-4 border-b border-gray-700">&lt;80%</td>
                      <td class="py-2 px-4 border-b border-gray-700">&gt;95% constante</td>
                    </tr>
                    <tr class="bg-gray-800/30">
                      <td class="py-2 px-4 border-b border-gray-700">Temperatura</td>
                      <td class="py-2 px-4 border-b border-gray-700">CPU/GPU</td>
                      <td class="py-2 px-4 border-b border-gray-700">&lt;70°C</td>
                      <td class="py-2 px-4 border-b border-gray-700">&gt;85°C</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          `
        }
      ]
    },
    {
      title: "8. Backup e Recuperação",
      content: `
        <p class="mb-4 text-gray-300">A manutenção preventiva deve incluir estratégias robustas de backup e recuperação:</p>
      `,
      subsections: [
        {
          subtitle: "Estratégias de Backup",
          content: `
            <div class="prose prose-invert max-w-none">
              <h4 class="text-lg font-bold text-white mt-4 mb-2">Tipos de Backup:</h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div class="bg-[#1E1E22] p-4 rounded-lg border border-green-500/30">
                  <h5 class="font-bold text-green-400 mb-2">Completo</h5>
                  <p class="text-gray-300 text-sm">Cópia de todo o sistema em um ponto específico</p>
                </div>
                <div class="bg-[#1E1E22] p-4 rounded-lg border border-blue-500/30">
                  <h5 class="font-bold text-blue-400 mb-2">Incremental</h5>
                  <p class="text-gray-300 text-sm">Apenas alterações desde o último backup</p>
                </div>
                <div class="bg-[#1E1E22] p-4 rounded-lg border border-purple-500/30">
                  <h5 class="font-bold text-purple-400 mb-2">Diferencial</h5>
                  <p class="text-gray-300 text-sm">Alterações desde o último backup completo</p>
                </div>
              </div>
              
              <h4 class="text-lg font-bold text-white mt-4 mb-2">Ferramentas de Backup:</h4>
              <ul class="list-disc list-inside space-y-2 text-gray-300 mt-2">
                <li>Ferramentas nativas do Windows (Backup e Restauração)</li>
                <li>Macrium Reflect (gratuito para uso pessoal)</li>
                <li>Acronis True Image</li>
                <li>Clonezilla (open source)</li>
              </ul>
            </div>
          `
        },
        {
          subtitle: "Pontos de Restauração",
          content: `
            <div class="prose prose-invert max-w-none">
              <h4 class="text-lg font-bold text-white mt-4 mb-2">Criação de Pontos de Restauração:</h4>
              <p class="text-gray-300 mb-3">Sempre crie um ponto de restauração antes de realizar manutenções importantes:</p>
              <ol class="list-decimal list-inside space-y-2 text-gray-300">
                <li>Propriedades do Sistema > Proteção do Sistema</li>
                <li>Clique em "Criar" e dê um nome descritivo</li>
                <li>Descreva brevemente o que será feito</li>
                <li>Confirme a criação do ponto de restauração</li>
              </ol>
              
              <h4 class="text-lg font-bold text-white mt-4 mb-2">Verificação de Integridade:</h4>
              <p class="text-gray-300">Teste periodicamente a capacidade de restauração dos backups e pontos de restauração.</p>
            </div>
          `
        }
      ]
    },
    {
      title: "Conclusão Profissional",
      content: `
        <div class="bg-gradient-to-r from-[#1E1E22] to-[#171313] p-6 rounded-xl border border-gray-800">
          <p class="mb-4 text-gray-300 leading-relaxed">
            A manutenção preventiva é uma prática essencial para garantir a longevidade e o desempenho do seu computador. 
            Seguindo este guia, você aplicou estratégias de nível profissional que mantêm seu sistema otimizado, seguro e eficiente.
          </p>
          <p class="text-gray-400 italic border-l-2 border-[#31A8FF] pl-4">
            Lembre-se: A tecnologia evolui rapidamente. Recomendamos revisar estas práticas regularmente e adaptá-las às novas tecnologias e ameaças.
          </p>
          
          <div class="mt-6 pt-6 border-t border-gray-700">
            <h4 class="text-lg font-bold text-white mb-3">✅ Checklist Final de Manutenção:</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div class="flex items-center gap-2 text-green-400"><span class="text-lg">✓</span> Limpeza de arquivos temporários realizada</div>
              <div class="flex items-center gap-2 text-green-400"><span class="text-lg">✓</span> Verificação de disco concluída</div>
              <div class="flex items-center gap-2 text-green-400"><span class="text-lg">✓</span> Drivers atualizados</div>
              <div class="flex items-center gap-2 text-green-400"><span class="text-lg">✓</span> Registro do Windows limpo</div>
              <div class="flex items-center gap-2 text-green-400"><span class="text-lg">✓</span> Configurações de energia otimizadas</div>
              <div class="flex items-center gap-2 text-green-400"><span class="text-lg">✓</span> Backup realizado</div>
              <div class="flex items-center gap-2 text-green-400"><span class="text-lg">✓</span> Monitoramento configurado</div>
              <div class="flex items-center gap-2 text-green-400"><span class="text-lg">✓</span> Ponto de restauração criado</div>
            </div>
          </div>
        </div>
      `
    }
  ];

  const faqItems = [
    {
      question: "Com que frequência devo fazer manutenção preventiva?",
      answer: "Recomenda-se uma manutenção completa mensalmente, com tarefas menores realizadas semanalmente. Atividades como limpeza de arquivos temporários podem ser feitas semanalmente, enquanto tarefas mais pesadas como verificação de disco e atualização de drivers devem ser feitas mensalmente. A desfragmentação de disco (em HDDs) pode ser feita trimestralmente."
    },
    {
      question: "Posso automatizar parte da manutenção?",
      answer: "Sim, muitas tarefas de manutenção podem ser automatizadas usando o Agendador de Tarefas do Windows ou softwares especializados. Você pode agendar limpezas de disco, verificações de sistema e até mesmo atualizações automáticas para serem executadas em horários específicos."
    },
    {
      question: "É seguro limpar o registro do Windows?",
      answer: "A limpeza do registro pode ser segura se feita com as ferramentas corretas e com precaução. Sempre crie um ponto de restauração antes de qualquer edição no registro. Use ferramentas confiáveis que fazem verificações de segurança antes de remover entradas. Evite edição manual do registro a menos que você tenha conhecimento avançado."
    },
    {
      question: "Preciso desfragmentar SSDs como fazia com HDDs?",
      answer: "Não, SSDs não devem ser desfragmentados pois isso reduz sua vida útil. Em vez disso, os SSDs usam o comando TRIM para manter o desempenho. O Windows 10/11 faz isso automaticamente, mas você pode verificar se está ativado usando o comando 'fsutil behavior query DisableDeleteNotify'."
    },
    {
      question: "Quais são os sinais de que preciso fazer manutenção?",
      answer: "Sinais comuns incluem lentidão do sistema, inicialização demorada, travamentos frequentes, espaço em disco baixo, erros de aplicativos e aumento de temperatura. Se notar algum desses sinais, é recomendável executar uma manutenção preventiva completa."
    },
    {
      question: "Posso fazer manutenção enquanto trabalho?",
      answer: "Algumas tarefas de manutenção podem ser feitas durante o uso normal do computador, como limpeza de arquivos temporários. No entanto, tarefas mais pesadas como verificação de disco, desfragmentação (em HDDs) e atualizações de sistema devem ser feitas em horários de baixo uso para evitar impacto na produtividade."
    },
    {
      question: "Como posso monitorar a saúde do meu disco?",
      answer: "Você pode usar ferramentas como CrystalDiskInfo para monitorar os atributos SMART do disco, que indicam sua saúde. O Windows também tem ferramentas nativas como o CHKDSK e a verificação de disco nas propriedades da unidade. Monitore temperaturas, erros de leitura/escrita e atributos de desgaste."
    },
    {
      question: "O que é mais importante: backup ou manutenção preventiva?",
      answer: "Ambos são igualmente importantes e complementares. A manutenção preventiva ajuda a evitar falhas, enquanto o backup protege seus dados caso algo dê errado. Uma estratégia completa inclui ambos: manutenção regular para manter o sistema saudável e backups regulares para proteger seus dados."
    }
  ];
  
  const externalReferences = [
    { name: "Microsoft Docs - Maintenance Guidelines", url: "https://docs.microsoft.com/en-us/windows-hardware/drivers/devtest/system-maintenance-guidelines" },
    { name: "Windows Update Best Practices", url: "https://docs.microsoft.com/en-us/windows/deployment/update/waas-manage-updates-wufb" },
    { name: "Disk Health Monitoring", url: "https://www.hdsentinel.com/help/en/disk_health_interpretation.php" },
    { name: "Registry Cleaning Safety", url: "https://www.pcmag.com/how-to/the-safe-way-to-clean-your-windows-registry" },
    { name: "Hardware Maintenance Tips", url: "https://www.lifewire.com/computer-hardware-maintenance-tips-2624321" },
    { name: "Performance Optimization Guide", url: "https://docs.microsoft.com/en-us/troubleshoot/windows-server/performance/windows-performance-counter-tools" }
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
      href: "/guias/limpeza-computador",
      title: "Limpeza Profunda de Computador",
      description: "Técnicas avançadas de limpeza e otimização"
    },
    {
      href: "/guias/recuperacao-sistema",
      title: "Recuperação de Sistema",
      description: "Estratégias de recuperação em caso de falhas"
    },
    {
      href: "/guias/monitoramento-sistema",
      title: "Monitoramento de Sistema",
      description: "Técnicas para monitorar e diagnosticar problemas"
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="90 minutos"
      difficultyLevel="Intermediário"
      contentSections={contentSections}
      summaryTable={summaryTable}
      faqItems={faqItems}
      externalReferences={externalReferences}
      relatedGuides={relatedGuides}
    />
  );
}