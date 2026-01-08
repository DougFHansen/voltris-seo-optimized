import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Como Fazer Backup dos Seus Dados";
const description = "Aprenda métodos eficazes para fazer backup completo dos seus arquivos importantes, incluindo backup em nuvem, HD externo e métodos automatizados. Proteja seus dados contra perda por falhas de hardware, vírus, acidentes ou formatação.";
const keywords = ['backup dados', 'backup de dados', 'cópia de segurança', 'hd externo', 'backup nuvem', 'armazenamento em nuvem'];

export const metadata: Metadata = createGuideMetadata(title, description, keywords);

export default function BackupDadosGuide() {
  const contentSections = [
    {
      title: "Por Que Fazer Backup É Crítico?",
      content: `
        <p class="mb-4">A perda de dados pode acontecer por diversas razões: falha de hardware do disco rígido, infecção por vírus ou ransomware, apagamento acidental, formatação, roubo de computador, ou desastres naturais como incêndio ou inundação. Quando você perde dados importantes como fotos de família, documentos de trabalho, projetos ou anos de arquivos pessoais, pode ser devastador e, em muitos casos, irreversível.</p>
        
        <p class="mb-4">A regra de ouro da tecnologia é: "Se você tem apenas uma cópia de um arquivo importante, você não tem nenhuma cópia". Discos rígidos falham, computadores são roubados, e acidentes acontecem. Fazer backup regular é a única forma garantida de proteger seus dados valiosos.</p>
        
        <p>Este guia apresenta várias estratégias de backup, desde métodos simples e rápidos até soluções mais robustas e automatizadas. A melhor estratégia geralmente combina múltiplos métodos para ter redundância - se um método falhar, você ainda terá seus dados seguros em outro lugar.</p>
      `,
      subsections: []
    },
    {
      title: "O Que Deve Ser Incluído no Backup?",
      content: "",
      subsections: [
        {
          subtitle: "Dados Essenciais",
          content: `
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
              <li><strong class="text-white">Documentos:</strong> Arquivos Word, Excel, PDFs, apresentações, projetos</li>
              <li><strong class="text-white">Fotos e Vídeos:</strong> Bibliotecas de imagens, vídeos pessoais, memórias importantes</li>
              <li><strong class="text-white">Músicas:</strong> Coleções de áudio pessoais e downloads</li>
              <li><strong class="text-white">E-mails:</strong> Se usar cliente de e-mail local (Outlook, Thunderbird)</li>
              <li><strong class="text-white">Favoritos do navegador:</strong> Bookmarks e senhas salvas (com cuidado e criptografia)</li>
              <li><strong class="text-white">Configurações:</strong> Preferências de programas importantes</li>
              <li><strong class="text-white">Licenças e chaves:</strong> Chaves de ativação de software pago</li>
              <li><strong class="text-white">Projetos pessoais:</strong> Código, designs, trabalhos acadêmicos</li>
            </ul>
          `
        },
        {
          subtitle: "O Que NÃO Precisa Ser Backupeado",
          content: `
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
              <li>Sistema operacional (pode ser reinstalado)</li>
              <li>Programas instalados (podem ser baixados novamente)</li>
              <li>Arquivos temporários</li>
              <li>Cache de navegadores</li>
              <li>Arquivos de sistema do Windows</li>
            </ul>
          `
        }
      ]
    },
    {
      title: "Método 1: Backup em HD Externo ou Pen Drive",
      content: `
        <p class="mb-4">Este é o método mais simples e direto. Ideal para backups periódicos manuais:</p>
      `,
      subsections: [
        {
          subtitle: "Vantagens",
          content: `
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
              <li>Controle total sobre seus dados</li>
              <li>Não depende de internet</li>
              <li>Acesso rápido aos arquivos</li>
              <li>Funciona mesmo sem conexão</li>
              <li>Relativamente barato</li>
            </ul>
          `
        },
        {
          subtitle: "Como Fazer",
          content: `
            <ol class="space-y-3 text-gray-300 list-decimal list-inside ml-4">
              <li>Conecte o HD externo ou pen drive ao computador</li>
              <li>Verifique se há espaço suficiente (precisa ter mais espaço que os arquivos a serem copiados)</li>
              <li>Abra o Explorador de Arquivos</li>
              <li>Navegue até as pastas que deseja fazer backup:
                <ul class="mt-2 space-y-1 ml-6">
                  <li><code class="bg-[#2a2a2e] px-2 py-1 rounded">C:\\Users\\[SeuUsuário]\\Documents</code></li>
                  <li><code class="bg-[#2a2a2e] px-2 py-1 rounded">C:\\Users\\[SeuUsuário]\\Pictures</code></li>
                  <li><code class="bg-[#2a2a2e] px-2 py-1 rounded">C:\\Users\\[SeuUsuário]\\Videos</code></li>
                  <li><code class="bg-[#2a2a2e] px-2 py-1 rounded">C:\\Users\\[SeuUsuário]\\Desktop</code></li>
                  <li><code class="bg-[#2a2a2e] px-2 py-1 rounded">C:\\Users\\[SeuUsuário]\\Downloads</code></li>
                </ul>
              </li>
              <li>Copie as pastas inteiras para o HD externo</li>
              <li>Verifique se a cópia foi bem-sucedida abrindo alguns arquivos do backup</li>
              <li>Guarde o HD externo em local seguro, preferencialmente fora de casa (escritório, cofre, casa de familiares)</li>
            </ol>
          `
        },
        {
          subtitle: "Usando Ferramenta de Backup do Windows",
          content: `
            <p class="text-gray-300 leading-relaxed mb-4">
              O Windows inclui ferramentas de backup que podem automatizar o processo:
            </p>
            <ol class="space-y-3 text-gray-300 list-decimal list-inside ml-4">
              <li>Vá em Configurações > Atualização e Segurança > Backup</li>
              <li>Clique em "Adicionar uma unidade" e selecione seu HD externo</li>
              <li>Configure para fazer backup automático regularmente</li>
              <li>O Windows fará backup automático das pastas principais</li>
            </ol>
          `
        }
      ]
    },
    {
      title: "Método 2: Backup em Nuvem",
      content: `
        <p class="mb-4">Backup em nuvem armazena seus arquivos em servidores online, acessíveis de qualquer lugar e protegidos contra falhas locais:</p>
      `,
      subsections: [
        {
          subtitle: "Serviços de Backup em Nuvem",
          content: `
            <ul class="space-y-3 text-gray-300 list-disc list-inside ml-4">
              <li><strong class="text-white">Google Drive:</strong> 15GB gratuitos, integrado com Gmail e Google Fotos</li>
              <li><strong class="text-white">OneDrive (Microsoft):</strong> 5GB gratuitos, integrado com Windows e Office</li>
              <li><strong class="text-white">Dropbox:</strong> 2GB gratuitos, sincronização eficiente</li>
              <li><strong class="text-white">iCloud:</strong> Ideal para usuários Apple</li>
              <li><strong class="text-white">Mega:</strong> 20GB gratuitos, foco em privacidade</li>
            </ul>
          `
        },
        {
          subtitle: "Como Configurar Backup Automático em Nuvem",
          content: `
            <ol class="space-y-3 text-gray-300 list-decimal list-inside ml-4">
              <li>Escolha um serviço de nuvem e crie uma conta</li>
              <li>Instale o aplicativo do serviço no seu computador</li>
              <li>Configure quais pastas sincronizar</li>
              <li>Os arquivos serão sincronizados automaticamente quando você os modificar</li>
              <li>Configure para fazer backup de pastas específicas automaticamente</li>
            </ol>
          `
        }
      ]
    },
    {
      title: "Método 3: Backup Completo do Sistema (Imagem)",
      content: `
        <p class="mb-4">Backup de imagem cria uma cópia completa de todo o sistema, incluindo sistema operacional, programas e dados. É útil para restaurar o computador exatamente como estava:</p>
      `,
      subsections: [
        {
          subtitle: "Ferramenta de Backup do Windows",
          content: `
            <ol class="space-y-3 text-gray-300 list-decimal list-inside ml-4">
              <li>Pressione <kbd class="bg-[#2a2a2e] px-2 py-1 rounded">Windows + R</kbd></li>
              <li>Digite <code class="bg-[#2a2a2e] px-2 py-1 rounded">control</code> e pressione Enter</li>
              <li>Vá em Sistema e Segurança > Backup e Restauração (Windows 7)</li>
              <li>Clique em "Criar uma imagem do sistema"</li>
              <li>Escolha onde salvar (HD externo recomendado)</li>
              <li>Selecione as unidades a incluir</li>
              <li>Confirme e inicie o backup (pode levar horas)</li>
            </ol>
          `
        },
        {
          subtitle: "Ferramentas Terceirizadas",
          content: `
            <p class="text-gray-300 leading-relaxed mb-4">
              Ferramentas como Acronis True Image, Macrium Reflect ou EaseUS Todo Backup oferecem mais funcionalidades e opções de backup:
            </p>
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
              <li>Backup incremental (apenas mudanças desde último backup)</li>
              <li>Agendamento mais flexível</li>
              <li>Compressão para economizar espaço</li>
              <li>Opções de restauração mais avançadas</li>
            </ul>
          `
        }
      ]
    },
    {
      title: "Estratégia de Backup Recomendada (Regra 3-2-1)",
      content: `
        <p class="mb-4">A regra 3-2-1 é uma estratégia profissional de backup amplamente recomendada:</p>
      `,
      subsections: [
        {
          subtitle: "Regra 3-2-1",
          content: `
            <ul class="space-y-3 text-gray-300 list-disc list-inside ml-4">
              <li><strong class="text-white">3 cópias:</strong> Mantenha pelo menos 3 cópias dos seus dados importantes</li>
              <li><strong class="text-white">2 tipos diferentes de mídia:</strong> Use diferentes tipos de armazenamento (HD externo + nuvem, por exemplo)</li>
              <li><strong class="text-white">1 cópia fora de casa:</strong> Mantenha pelo menos uma cópia em local físico diferente (escritório, cofre, casa de familiares)</li>
            </ul>
            
            <h3 class="text-2xl font-bold text-white mb-3 mt-6">Exemplo Prático de Estratégia 3-2-1</h3>
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
              <li><strong class="text-white">Cópia 1:</strong> Dados originais no seu computador</li>
              <li><strong class="text-white">Cópia 2:</strong> Backup no HD externo (mantido em casa)</li>
              <li><strong class="text-white">Cópia 3:</strong> Backup na nuvem (servidores online)</li>
              <li><strong class="text-white">Cópia 4 (extra):</strong> Backup em segundo HD externo mantido em outro local</li>
            </ul>
          `
        }
      ]
    },
    {
      title: "Segurança no Backup de Dados",
      content: "",
      subsections: [
        {
          subtitle: "Criptografia de Backups",
          content: `
            <p class="text-gray-300 leading-relaxed mb-4">
              Para dados sensíveis, é fundamental criptografar seus backups:
            </p>
            
            <div class="mb-4">
              <h4 class="text-xl font-bold text-white mb-2">Opções de Criptografia</h4>
              <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
                <li><strong class="text-white">BitLocker (Windows Pro/Enterprise)</strong>: Criptografia nativa do Windows para unidades inteiras</li>
                <li><strong class="text-white">VeraCrypt</strong>: Software gratuito de código aberto para criptografia de volumes</li>
                <li><strong class="text-white">7-Zip com senha</strong>: Compactação criptografada para backups individuais</li>
                <li><strong class="text-white">Serviços de nuvem com criptografia</strong>: Google Drive, OneDrive, Dropbox oferecem criptografia</li>
              </ul>
            </div>
            
            <div class="bg-[#171313] p-4 rounded-lg border border-[#FF4B6B]/30">
              <p class="text-white font-semibold mb-2">⚠️ Aviso de Segurança:</p>
              <p class="text-gray-300 leading-relaxed">
                Se você perder a senha de um backup criptografado, os dados são irrecuperavelmente perdidos. Sempre mantenha cópias de segurança das senhas em locais seguros e separados dos backups.
              </p>
            </div>
          `
        }
      ]
    },
    {
      title: "Tipos Avançados de Backup",
      content: "",
      subsections: [
        {
          subtitle: "Backup Incremental vs Diferencial",
          content: `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
              <div class="bg-[#171313] p-4 rounded-lg border border-[#FF4B6B]/30">
                <h4 class="text-white font-semibold mb-2">Backup Incremental</h4>
                <ul class="space-y-1 text-gray-300 text-sm">
                  <li>✓ Mais econômico em espaço</li>
                  <li>✓ Mais rápido para backups subsequentes</li>
                  <li>✗ Restauração mais complexa</li>
                </ul>
              </div>
              <div class="bg-[#171313] p-4 rounded-lg border border-[#31A8FF]/30">
                <h4 class="text-white font-semibold mb-2">Backup Diferencial</h4>
                <ul class="space-y-1 text-gray-300 text-sm">
                  <li>✓ Restauração mais simples</li>
                  <li>✓ Menos vulnerável a corrupção</li>
                  <li>✗ Cresce em tamanho com o tempo</li>
                </ul>
              </div>
            </div>
          `
        },
        {
          subtitle: "Backup em Tempo Real",
          content: `
            <p class="text-gray-300 leading-relaxed mb-4">
              Soluções que fazem backup contínuo de cada alteração:
            </p>
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
              <li>Serviços cloud sync (OneDrive, Google Drive, Dropbox)</li>
              <li>Software especializado (Acronis, Veeam)</li>
              <li>Snapshot automático do sistema</li>
            </ul>
          `
        }
      ]
    },
    {
      title: "Estratégias Empresariais de Backup",
      content: "",
      subsections: [
        {
          subtitle: "Compliance e Regulamentações",
          content: `
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
              <li><strong class="text-white">LGPD/GDPR</strong>: Proteção de dados pessoais</li>
              <li><strong class="text-white">SOX</strong>: Requisitos financeiros</li>
              <li><strong class="text-white">HIPAA</strong>: Dados de saúde</li>
            </ul>
          `
        },
        {
          subtitle: "Ferramentas Corporativas",
          content: `
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
              <li>Veeam Backup & Replication</li>
              <li>Acronis Cyber Protect</li>
              <li>Commvault Complete Backup</li>
              <li>Veritas NetBackup</li>
            </ul>
          `
        }
      ]
    },
    {
      title: "Frequência de Backup",
      content: `
        <p class="mb-4">A frequência ideal depende de como você usa seu computador:</p>
      `,
      subsections: [
        {
          subtitle: "Frequência Recomendada",
          content: `
            <ul class="space-y-3 text-gray-300 list-disc list-inside ml-4">
              <li><strong class="text-white">Usuários casuais:</strong> Backup semanal ou mensal pode ser suficiente</li>
              <li><strong class="text-white">Trabalho importante:</strong> Backup diário ou em tempo real (sincronização contínua)</li>
              <li><strong class="text-white">Dados críticos:</strong> Múltiplos backups por dia ou backup em tempo real</li>
              <li><strong class="text-white">Fotos e documentos pessoais:</strong> Backup mensal ou quando houver novos arquivos importantes</li>
            </ul>
            
            <h3 class="text-2xl font-bold text-white mb-3 mt-6">Automatizar Backups</h3>
            <p class="text-gray-300 leading-relaxed mb-4">
              A melhor forma de garantir que backups sejam feitos regularmente é automatizar:
            </p>
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
              <li>Configure backup em nuvem para sincronização automática</li>
              <li>Use agendamento do Windows para backup automático em HD externo</li>
              <li>Configure lembretes no calendário para backup manual periódico</li>
              <li>Use ferramentas de backup que enviam notificações quando backup falha</li>
            </ul>
          `
        }
      ]
    },
    {
      title: "Verificar e Testar Backups",
      content: `
        <p class="mb-4">Fazer backup não é suficiente - você precisa verificar periodicamente que os backups estão funcionando:</p>
      `,
      subsections: [
        {
          subtitle: "Como Verificar Backups",
          content: `
            <ol class="space-y-3 text-gray-300 list-decimal list-inside ml-4">
              <li><strong class="text-white">Teste restauração:</strong> Periodicamente, tente restaurar alguns arquivos do backup para garantir que funciona</li>
              <li><strong class="text-white">Verifique integridade:</strong> Use ferramentas de verificação de integridade de arquivos</li>
              <li><strong class="text-white">Monitore espaço:</strong> Certifique-se de que há espaço suficiente no destino do backup</li>
              <li><strong class="text-white">Verifique logs:</strong> Revise logs de backup para garantir que não há erros</li>
              <li><strong class="text-white">Teste acesso:</strong> Periodicamente, verifique se consegue acessar backups em nuvem</li>
            </ol>
            
            <div class="bg-[#171313] p-4 rounded-lg border border-[#FF4B6B]/30 mt-4">
              <p class="text-white font-semibold mb-2">⚠️ Importante:</p>
              <p class="text-gray-300 leading-relaxed">
                Um backup que nunca foi testado pode não funcionar quando você mais precisar. Testar restauração é tão importante quanto fazer o backup. Muitas pessoas descobrem que seus backups não funcionam apenas quando tentam usar em uma situação de emergência.
              </p>
            </div>
          `
        }
      ]
    },
    {
      title: "Conclusão",
      content: `
        <p class="mb-4">Fazer backup regular dos seus dados é uma das práticas mais importantes em segurança digital. Perda de dados pode ser devastadora, mas é completamente evitável com uma estratégia de backup adequada.</p>
        <p class="mb-4">Implemente uma estratégia de backup que funcione para você - pode ser simples (HD externo periódico) ou mais robusta (múltiplos métodos com automação). O importante é começar e manter o hábito de fazer backup regularmente. Lembre-se: é melhor ter um backup simples que você faz regularmente do que um sistema complexo que você nunca usa.</p>
      `,
      subsections: []
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/seguranca-digital",
      title: "Guia de Segurança Digital",
      description: "Proteja seus dados contra vírus e malware."
    },
    {
      href: "/guias/formatacao-windows",
      title: "Formatação do Windows",
      description: "Aprenda a fazer backup antes de formatar."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="10 minutos"
      difficultyLevel="Básico"
      contentSections={contentSections}
      relatedGuides={relatedGuides}
    />
  );
}