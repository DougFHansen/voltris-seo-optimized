import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Limpeza Completa do Computador";
const description = "Técnicas profissionais para limpar arquivos temporários, cache, programas desnecessários e otimizar o espaço em disco do seu computador.";
const keywords = ['limpeza computador', 'limpeza windows', 'otimizacao disco', 'arquivos temporarios', 'desfragmentacao'];

export const metadata: Metadata = createGuideMetadata(title, description, keywords);

export default function LimpezaComputadorGuide() {
  const contentSections = [
    {
      title: "Introdução à Limpeza do Computador",
      content: `
        <p class="mb-4">A limpeza do computador é uma prática essencial para manter o desempenho ideal do sistema. Com o uso contínuo, seu computador acumula arquivos temporários, cache de navegadores, registros inválidos, programas desnecessários e outros detritos digitais que gradualmente reduzem a velocidade e ocupam espaço valioso em disco.</p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div class="bg-[#171313] p-4 rounded-lg border border-[#31A8FF]/30">
            <h3 class="text-white font-semibold mb-2">Benefícios da Limpeza Regular</h3>
            <ul class="text-gray-300 text-sm space-y-1">
              <li>✓ Aumento de 25-40% na velocidade de boot</li>
              <li>✓ Liberação de 5-15GB de espaço em disco</li>
              <li>✓ Melhoria na resposta de programas</li>
              <li>✓ Redução de erros do sistema</li>
            </ul>
          </div>
          <div class="bg-[#171313] p-4 rounded-lg border border-[#FF4B6B]/30">
            <h3 class="text-white font-semibold mb-2">Requisitos Necessários</h3>
            <ul class="text-gray-300 text-sm space-y-1">
              <li>🧹 CCleaner (gratuito) ou ferramentas nativas</li>
              <li>💻 Permissões de administrador do Windows</li>
              <li>⏱️ Tempo estimado: 30-45 minutos</li>
              <li>💾 Backup recente dos dados importantes</li>
            </ul>
          </div>
        </div>
        
        <div class="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 my-6">
          <h3 class="text-blue-400 font-semibold mb-2">🎯 Quando Realizar Limpeza</h3>
          <p class="text-gray-300 text-sm">Ideal realizar a cada 30-60 dias, especialmente quando notar lentidão, pouco espaço em disco ou após instalar/desinstalar muitos programas.</p>
        </div>
      `,
      subsections: []
    },
    {
      title: "Limpeza Passo a Passo com CCleaner",
      content: `
        <p class="mb-4">Siga este tutorial completo para limpar seu computador de forma segura e eficiente usando CCleaner, a ferramenta mais popular para limpeza de sistemas Windows.</p>
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
            </ol>
          `
        },
        {
          subtitle: "Passo 2: Instalação e Primeira Execução",
          content: `
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
              <li>Execute o instalador baixado e siga as telas de instalação</li>
              <li>Na primeira execução, clique em "Options" e desmarque opções de publicidade</li>
              <li>Na aba "Advanced", habilite "Clean Windows Event Logs" para limpeza completa</li>
              <li>Na aba "Settings", marque "Close CCleaner after cleaning" para conveniência</li>
            </ul>
          `
        },
        {
          subtitle: "Passo 3: Análise dos Arquivos Temporários",
          content: `
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
              <li>Clique na aba "Cleaner" e selecione "Windows" e "Applications"</li>
              <li>Marque todas as opções disponíveis (Temp files, Recycle Bin, Recent Docs, etc.)</li>
              <li>Clique em "Run Cleaner" para analisar os arquivos encontrados</li>
              <li>Após análise, clique novamente em "Run Cleaner" para remover os arquivos</li>
              <li>Confirme quando solicitado e aguarde conclusão da limpeza</li>
            </ul>
          `
        },
        {
          subtitle: "Passo 4: Limpeza de Navegadores",
          content: `
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
              <li>Na mesma aba "Cleaner", selecione cada navegador instalado (Chrome, Firefox, Edge)</li>
              <li>Marque opções de cache, cookies, histórico e dados de formulários</li>
              <li>Execute a limpeza separadamente para cada navegador</li>
              <li><strong>Importante:</strong> Faça backup de senhas importantes antes de limpar cookies</li>
            </ul>
          `
        },
        {
          subtitle: "Passo 5: Otimização do Registro (Opcional)",
          content: `
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
              <li>Clique na aba "Registry" na parte superior</li>
              <li>Clique em "Scan for Issues" para encontrar entradas inválidas</li>
              <li>Revise cuidadosamente os itens encontrados (normalmente são seguros)</li>
              <li>Clique em "Fix Selected Issues" e confirme o backup do registro</li>
              <li>Reinicie o computador após conclusão</li>
            </ul>
          `
        }
      ]
    },
    {
      title: "Outras Ferramentas de Limpeza Alternativas",
      content: `
        <p class="mb-4">Além do CCleaner, existem outras excelentes opções gratuitas para limpeza de computadores Windows.</p>
      `,
      subsections: [
        {
          subtitle: "Alternativas Gratuitas",
          content: `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-[#171313] p-3 rounded border border-[#31A8FF]/20">
                <h4 class="text-white font-semibold mb-2">Disk Cleanup (Nativo Windows)</h4>
                <ul class="text-gray-300 text-xs space-y-1">
                  <li>Executar: Win + R → cleanmgr</li>
                  <li>Limpa arquivos temporários do sistema</li>
                  <li>Libera espaço em unidades específicas</li>
                  <li>Totalmente gratuito e integrado</li>
                </ul>
              </div>
              <div class="bg-[#171313] p-3 rounded border border-[#FF4B6B]/20">
                <h4 class="text-white font-semibold mb-2">BleachBit</h4>
                <ul class="text-gray-300 text-xs space-y-1">
                  <li>Software open-source gratuito</li>
                  <li>Funciona em Windows e Linux</li>
                  <li>Interface intuitiva similar ao CCleaner</li>
                  <li>Shred files para segurança máxima</li>
                </ul>
              </div>
            </div>
          `
        },
        {
          subtitle: "Ferramentas Avançadas Pagas",
          content: `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-[#171313] p-3 rounded border border-[#8B31FF]/20">
                <h4 class="text-white font-semibold mb-2">Glary Utilities</h4>
                <ul class="text-gray-300 text-xs space-y-1">
                  <li>Suíte completa de otimização</li>
                  <li>Inclui limpeza, reparo de registro e desfragmentação</li>
                  <li>Versão gratuita bastante completa</li>
                  <li>Monitoramento em tempo real</li>
                </ul>
              </div>
              <div class="bg-[#171313] p-3 rounded border border-[#31A8FF]/20">
                <h4 class="text-white font-semibold mb-2">Wise Care 365</h4>
                <ul class="text-gray-300 text-xs space-y-1">
                  <li>Otimização all-in-one</li>
                  <li>Privacidade e segurança avançadas</li>
                  <li>Interface moderna e intuitiva</li>
                  <li>Inclui defrag e monitor de sistema</li>
                </ul>
              </div>
            </div>
          `
        }
      ]
    },
    {
      title: "Problemas Comuns e Soluções",
      content: `
        <p class="mb-4">Soluções para problemas frequentes que podem ocorrer durante ou após a limpeza do computador.</p>
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
                  <li>Execute CCleaner como administrador (botão direito → Executar como administrador)</li>
                  <li>Desative programas que possam estar usando os arquivos</li>
                  <li>Use a ferramenta Unlocker para liberar arquivos travados</li>
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
                </ul>
                <p class="text-gray-300 text-sm">Solução: Normalize após algumas horas de uso. Os programas irão reconstruir caches automaticamente.</p>
              </div>
              
              <div class="bg-[#171313] p-4 rounded-lg border border-blue-500/30">
                <h4 class="text-blue-400 font-semibold mb-2">🔒 Sites Pedindo Login Novamente</h4>
                <p class="text-gray-300 text-sm mb-2">Causa:</p>
                <ul class="text-gray-300 text-xs space-y-1 ml-4 mb-2">
                  <li>Cookies e dados de sessão foram limpos</li>
                  <li>Autofill de formulários foi removido</li>
                </ul>
                <p class="text-gray-300 text-sm">Solução: Faça login novamente nos sites importantes. Considere desmarcar "Cookies" em limpezas futuras se quiser manter logins salvos.</p>
              </div>
            </div>
          `
        },
        {
          subtitle: "Dicas de Prevenção",
          content: `
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
              <li>Configure limpeza automática mensal no próprio CCleaner</li>
              <li>Mantenha pelo menos 15% de espaço livre no disco principal</li>
              <li>Faça backup de senhas importantes antes de limpar browsers</li>
              <li>Evite limpar "Recent Documents" se usa documentos recentemente</li>
              <li>Monitore o espaço em disco após cada limpeza significativa</li>
            </ul>
          `
        }
      ]
    }
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
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="45 minutos"
      difficultyLevel="Intermediário"
      contentSections={contentSections}
      relatedGuides={relatedGuides}
    />
  );
}

