import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = 'Como Otimizar a Performance do Seu PC';
const description = 'Descubra técnicas profissionais para acelerar seu computador, liberar espaço em disco, otimizar a inicialização e melhorar significativamente o desempenho geral do sistema sem precisar formatar.';
const keywords = [
  'otimizar PC',
  'acelerar computador',
  'melhorar desempenho Windows',
  'otimização sistema',
  'como otimizar Windows',
  'acelerar inicialização Windows',
  'liberar espaço disco',
  'otimizar memória RAM',
  'limpar arquivos temporários',
  'otimizar registro Windows',
  'melhorar velocidade PC',
  'desfragmentar disco',
  'otimização performance',
  'técnicas otimização PC',
  'guia otimização computador'
];

export const metadata: Metadata = createGuideMetadata(title, description, keywords);

export default function OtimizacaoPerformanceGuide() {
  const contentSections = [
    {
      title: "Por Que Otimizar Seu Computador?",
      content: `
        <p class="mb-4">Com o tempo, o uso normal do computador resulta em acúmulo de arquivos temporários, fragmentação de disco, programas desnecessários na inicialização, e configurações que não estão otimizadas. Esses fatores combinados fazem com que seu computador fique progressivamente mais lento.</p>
        <p class="mb-4">A otimização regular do sistema pode restaurar significativamente a velocidade original do seu computador sem a necessidade de formatar. Este processo é menos invasivo, preserva todos os seus dados e programas, e pode ser feito periodicamente para manter o desempenho sempre no máximo.</p>
        <p>Este guia apresenta técnicas testadas e comprovadas que são utilizadas por profissionais de suporte técnico para melhorar o desempenho de computadores. Seguindo estas dicas, você pode esperar melhorias de 30% a 50% na velocidade geral do sistema.</p>
      `,
      subsections: []
    },
    {
      title: "Passo 1: Limpeza Profunda de Arquivos Temporários",
      content: "",
      subsections: [
        {
          subtitle: "Usando a Ferramenta de Limpeza de Disco do Windows",
          content: `
            <p>O Windows inclui uma ferramenta poderosa para limpar arquivos temporários:</p>
            <ol class="space-y-2 text-gray-300 list-decimal list-inside ml-4 mb-4">
              <li>Pressione <kbd class="bg-[#2a2a2e] px-2 py-1 rounded">Windows + R</kbd> para abrir o Executar</li>
              <li>Digite <code class="bg-[#2a2a2e] px-2 py-1 rounded">cleanmgr</code> e pressione Enter</li>
              <li>Selecione a unidade C: (ou a unidade principal onde o Windows está instalado)</li>
              <li>Aguarde o Windows calcular o espaço que pode ser liberado</li>
              <li>Na janela de limpeza, marque todas as opções disponíveis</li>
              <li>Clique em "Limpar arquivos do sistema" (pode pedir permissão de administrador)</li>
              <li>Aguarde o processo de limpeza (pode levar de 10 a 30 minutos)</li>
            </ol>
          `
        },
        {
          subtitle: "Limpeza Manual de Pastas Temporárias",
          content: `
            <p>Para uma limpeza mais profunda, você pode limpar manualmente as pastas de arquivos temporários:</p>
            <ol class="space-y-2 text-gray-300 list-decimal list-inside ml-4 mb-4">
              <li>Pressione <kbd class="bg-[#2a2a2e] px-2 py-1 rounded">Windows + R</kbd></li>
              <li>Digite <code class="bg-[#2a2a2e] px-2 py-1 rounded">%temp%</code> e pressione Enter</li>
              <li>Selecione todos os arquivos (Ctrl + A) e exclua (Delete)</li>
              <li>Repita o processo para <code class="bg-[#2a2a2e] px-2 py-1 rounded">C:\Windows\Temp</code></li>
              <li>Repita para <code class="bg-[#2a2a2e] px-2 py-1 rounded">C:\Users\[SeuUsuário]\AppData\Local\Temp</code></li>
            </ol>
            <div class="bg-[#171313] p-4 rounded-lg border border-[#FF4B6B]/30 mt-4">
              <p class="text-white font-semibold mb-2">⚠️ Atenção:</p>
              <p class="text-gray-300 leading-relaxed">
                Alguns arquivos podem estar em uso e não poderão ser excluídos. Isso é normal - apenas ignore e continue. Não force a exclusão de arquivos que não podem ser removidos.
              </p>
            </div>
          `
        }
      ]
    },
    {
      title: "Passo 2: Otimização de Programas na Inicialização",
      content: "<p class='mb-4'>Programas que iniciam automaticamente com o Windows são uma das principais causas de lentidão na inicialização e consumo excessivo de recursos. Muitos programas se instalam automaticamente na inicialização sem você perceber.</p>",
      subsections: [
        {
          subtitle: "Gerenciar Programas de Inicialização",
          content: `
            <ol class="space-y-2 text-gray-300 list-decimal list-inside ml-4 mb-4">
              <li>Pressione <kbd class="bg-[#2a2a2e] px-2 py-1 rounded">Ctrl + Shift + Esc</kbd> para abrir o Gerenciador de Tarefas</li>
              <li>Clique na aba "Inicialização"</li>
              <li>Você verá uma lista de todos os programas que iniciam com o Windows</li>
              <li>Clique em "Impacto na inicialização" para ordenar (coloque primeiro os que têm maior impacto)</li>
              <li>Para cada programa desnecessário, clique com botão direito e selecione "Desabilitar"</li>
            </ol>
          `
        },
        {
          subtitle: "Programas Que Geralmente Podem Ser Desabilitados",
          content: `
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4 mb-4">
              <li>Clientes de mensageiros (Skype, Discord) - a menos que você precise deles sempre abertos</li>
              <li>Software de atualização de drivers (pode verificar atualizações manualmente)</li>
              <li>Ferramentas de sincronização em nuvem (se não precisar sempre sincronizado)</li>
              <li>Programas de assistente virtual</li>
              <li>Utilitários de hardware que você não usa regularmente</li>
            </ul>
          `
        },
        {
          subtitle: "Programas Que Devem Permanecer Ativados",
          content: `
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4 mb-4">
              <li>Antivírus (essencial para segurança)</li>
              <li>Drivers importantes de hardware</li>
              <li>Software de segurança e firewall</li>
            </ul>
            <div class="bg-[#171313] p-4 rounded-lg border border-[#31A8FF]/30 mt-4">
              <p class="text-white font-semibold mb-2">💡 Dica Profissional:</p>
              <p class="text-gray-300 leading-relaxed">
                Se você não tem certeza sobre um programa, faça uma busca rápida na internet sobre o nome do programa. Se for importante para o funcionamento do sistema, mantenha ativado. Quando em dúvida, é melhor ser conservador e manter ativado.
              </p>
            </div>
          `
        }
      ]
    },
    {
      title: "Passo 3: Otimização de Memória RAM",
      content: `<p class="mb-4">A memória RAM é um componente crítico para o desempenho. Quando ela está quase cheia, o Windows usa o disco rígido como memória virtual (swap), o que é extremamente mais lento.</p>`,
      subsections: [
        {
          subtitle: "Verificar Uso de Memória",
          content: `
            <ol class="space-y-2 text-gray-300 list-decimal list-inside ml-4 mb-4">
              <li>Abra o Gerenciador de Tarefas (Ctrl + Shift + Esc)</li>
              <li>Vá na aba "Desempenho"</li>
              <li>Clique em "Memória" para ver o uso detalhado</li>
              <li>Verifique a porcentagem de uso - se estiver constantemente acima de 80%, há problema</li>
            </ol>
          `
        },
        {
          subtitle: "Fechar Programas Não Utilizados",
          content: `
            <p class="mb-4">Programas que você não está usando mas estão abertos consomem memória RAM. Fechar programas desnecessários libera memória imediatamente:</p>
            <ol class="space-y-2 text-gray-300 list-decimal list-inside ml-4 mb-4">
              <li>Na aba "Processos" do Gerenciador de Tarefas, ordene por "Memória"</li>
              <li>Identifique programas que estão consumindo muita memória</li>
              <li>Feche programas que você não está usando</li>
              <li>Navegadores com muitas abas abertas consomem muita memória - feche abas desnecessárias</li>
            </ol>
          `
        },
        {
          subtitle: "Desativar Serviços Desnecessários",
          content: `
            <p class="mb-4">Alguns serviços do Windows executam em segundo plano e consomem memória mesmo quando não são necessários:</p>
            <ol class="space-y-2 text-gray-300 list-decimal list-inside ml-4 mb-4">
              <li>Pressione <kbd class="bg-[#2a2a2e] px-2 py-1 rounded">Windows + R</kbd></li>
              <li>Digite <code class="bg-[#2a2a2e] px-2 py-1 rounded">services.msc</code> e pressione Enter</li>
              <li>Você verá uma lista de todos os serviços do sistema</li>
              <li>Pesquise sobre serviços antes de desabilitar - alguns são essenciais</li>
              <li>Serviços geralmente seguros para desabilitar incluem: Windows Search (se não usar busca), Telemetria, alguns serviços de impressão (se não tiver impressora)</li>
              <li>Clique com botão direito no serviço &gt; Propriedades &gt; Tipo de inicialização: Desabilitado</li>
            </ol>
          `
        }
      ]
    },
    {
      title: "Passo 4: Otimização do Disco Rígido",
      content: "",
      subsections: [
        {
          subtitle: "Desfragmentação de Disco (HDD)",
          content: `
            <p class="mb-4">Se você tem um disco rígido tradicional (HDD), não SSD, a desfragmentação pode melhorar significativamente o desempenho:</p>
            <ol class="space-y-2 text-gray-300 list-decimal list-inside ml-4 mb-4">
              <li>Pressione <kbd class="bg-[#2a2a2e] px-2 py-1 rounded">Windows + R</kbd></li>
              <li>Digite <code class="bg-[#2a2a2e] px-2 py-1 rounded">dfrgui</code> e pressione Enter</li>
              <li>Selecione a unidade que deseja otimizar</li>
              <li>Clique em "Otimizar"</li>
              <li>O processo pode levar várias horas dependendo do tamanho e fragmentação do disco</li>
            </ol>
            <div class="bg-[#171313] p-4 rounded-lg border border-[#FF4B6B]/30 mb-4 mt-4">
              <p class="text-white font-semibold mb-2">⚠️ IMPORTANTE:</p>
              <p class="text-gray-300 leading-relaxed">
                <strong>NÃO desfragmente SSDs (Solid State Drives)</strong>. SSDs não precisam de desfragmentação e o processo pode reduzir sua vida útil. Para SSDs, o Windows usa otimização automática diferente (TRIM).
              </p>
            </div>
          `
        },
        {
          subtitle: "Verificação de Erros no Disco",
          content: `
            <p class="mb-4">Erros no disco podem causar lentidão e instabilidade. Verificar e corrigir erros periodicamente é importante:</p>
            <ol class="space-y-2 text-gray-300 list-decimal list-inside ml-4 mb-4">
              <li>Abra o Explorador de Arquivos</li>
              <li>Clique com botão direito na unidade C: (ou unidade principal)</li>
              <li>Vá em Propriedades &gt; Aba Ferramentas</li>
              <li>Clique em "Verificar" em Verificação de erros</li>
              <li>O Windows pode pedir para agendar a verificação na próxima reinicialização</li>
              <li>Aceite e reinicie o computador para executar a verificação</li>
            </ol>
          `
        }
      ]
    },
    {
      title: "Passo 5: Otimização do Registro do Windows",
      content: `<p class="mb-4">O registro do Windows é uma base de dados que armazena configurações do sistema e programas. Com o tempo, ele pode acumular entradas inválidas, duplicadas ou órfãs de programas desinstalados, o que pode causar lentidão.</p>`,
      subsections: [
        {
          subtitle: "AVISO CRÍTICO",
          content: `
            <div class="bg-[#171313] p-4 rounded-lg border border-[#FF4B6B]/30 mb-4">
              <p class="text-white font-semibold mb-2">⚠️ AVISO CRÍTICO:</p>
              <p class="text-gray-300 leading-relaxed">
                A manipulação incorreta do registro do Windows pode causar problemas graves no sistema. Sempre faça backup do registro antes de fazer qualquer alteração. Se não se sentir confiante, é melhor usar ferramentas confiáveis de limpeza de registro ou deixar este passo para um profissional.
              </p>
            </div>
          `
        },
        {
          subtitle: "Fazer Backup do Registro",
          content: `
            <ol class="space-y-2 text-gray-300 list-decimal list-inside ml-4 mb-4">
              <li>Pressione <kbd class="bg-[#2a2a2e] px-2 py-1 rounded">Windows + R</kbd></li>
              <li>Digite <code class="bg-[#2a2a2e] px-2 py-1 rounded">regedit</code> e pressione Enter</li>
              <li>No Editor de Registro, clique em Arquivo &gt; Exportar</li>
              <li>Escolha um local seguro e salve com um nome descritivo (ex: "backup-registro-antes-otimizacao.reg")</li>
              <li>Aguarde o backup ser concluído</li>
            </ol>
          `
        },
        {
          subtitle: "Ferramentas de Limpeza de Registro",
          content: `
            <p class="mb-4">Para usuários menos experientes, recomenda-se usar ferramentas profissionais e confiáveis de limpeza de registro. Algumas opções populares e seguras incluem CCleaner, Wise Registry Cleaner, ou Auslogics Registry Cleaner. Sempre baixe de fontes oficiais e faça backup antes de usar.</p>
          `
        }
      ]
    },
    {
      title: "Passo 6: Otimização de Rede",
      content: `<p class="mb-4">Configurações de rede otimizadas podem melhorar significativamente a velocidade de navegação e downloads:</p>`,
      subsections: [
        {
          subtitle: "Ajustar Configurações TCP/IP",
          content: `
            <ol class="space-y-2 text-gray-300 list-decimal list-inside ml-4 mb-4">
              <li>Abra o Prompt de Comando como Administrador (clique com botão direito no menu Iniciar &gt; Prompt de Comando (Admin))</li>
              <li>Execute os seguintes comandos um por vez:
                <ul class="mt-2 space-y-1 ml-6">
                  <li><code class="bg-[#2a2a2e] px-2 py-1 rounded">netsh int tcp set global autotuninglevel=normal</code></li>
                  <li><code class="bg-[#2a2a2e] px-2 py-1 rounded">netsh int tcp set global chimney=enabled</code></li>
                  <li><code class="bg-[#2a2a2e] px-2 py-1 rounded">netsh int tcp set global rss=enabled</code></li>
                </ul>
              </li>
              <li>Reinicie o computador para aplicar as alterações</li>
            </ol>
          `
        },
        {
          subtitle: "Limpar Cache DNS",
          content: `
            <p class="mb-4">O cache DNS armazena informações sobre sites visitados. Limpar periodicamente pode resolver problemas de conectividade:</p>
            <ol class="space-y-2 text-gray-300 list-decimal list-inside ml-4 mb-4">
              <li>Abra o Prompt de Comando como Administrador</li>
              <li>Execute: <code class="bg-[#2a2a2e] px-2 py-1 rounded">ipconfig /flushdns</code></li>
              <li>Aguarde a confirmação de que o cache foi limpo</li>
            </ol>
          `
        }
      ]
    },
    {
      title: "Conclusão",
      content: `
        <p class="mb-4">Seguindo este guia de otimização, você deve notar melhorias significativas no desempenho do seu computador. A chave para manter o desempenho é realizar essas otimizações regularmente - recomenda-se fazer uma limpeza e otimização a cada 2-3 meses.</p>
        <p class="mb-4">Se após realizar todas essas otimizações o computador ainda estiver lento, pode ser necessário considerar formatação ou verificação de hardware (possível necessidade de mais RAM ou substituição do disco rígido por SSD).</p>
      `,
      subsections: [
        {
          subtitle: "Precisa de Ajuda Profissional?",
          content: `
            <div class="bg-[#171313] p-6 rounded-lg border border-[#31A8FF]/30 mt-6">
              <p class="text-white font-semibold mb-3 text-lg">Precisa de Ajuda Profissional?</p>
              <p class="text-gray-300 leading-relaxed mb-4">
                Se preferir que nossos especialistas otimizem seu computador profissionalmente, oferecemos serviços de otimização remota completos e seguros.
              </p>
              <div class="flex flex-col sm:flex-row gap-4">
                <a 
                  href="/otimizacao-pc"
                  class="px-6 py-3 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300 text-center inline-block"
                >
                  Ver Planos de Otimização
                </a>
                <a 
                  href="https://wa.me/5511996716235?text=Olá!%20Gostaria%20de%20falar%20sobre%20otimização%20de%20PC."
                  target="_blank"
                  rel="noopener noreferrer"
                  class="px-6 py-3 border-2 border-[#31A8FF] text-[#31A8FF] font-bold rounded-xl hover:bg-[#31A8FF] hover:text-white transition-all duration-300 text-center inline-block"
                >
                  Falar com Especialista
                </a>
              </div>
            </div>
          `
        }
      ]
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/limpeza-computador",
      title: "Limpeza Completa do Computador",
      description: "Técnicas avançadas para limpar seu computador profundamente."
    },
    {
      href: "/guias/manutencao-preventiva",
      title: "Manutenção Preventiva",
      description: "Mantenha seu computador otimizado com rotinas regulares."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="12 minutos"
      difficultyLevel="Intermediário"
      contentSections={contentSections}
      relatedGuides={relatedGuides}
    />
  );
}

