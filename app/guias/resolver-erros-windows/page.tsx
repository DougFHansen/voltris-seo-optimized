import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = 'Como Resolver Erros Comuns do Windows';
const description = 'Guia completo para diagnosticar e resolver os erros mais frequentes no Windows. Aprenda a lidar com tela azul (BSOD), travamentos, mensagens de erro, problemas de inicialização e outros erros comuns do sistema operacional.';
const keywords = [
  'resolver erros Windows',
  'tela azul BSOD',
  'problemas Windows',
  'erros Windows',
  'corrigir erros sistema',
  'Windows não inicia',
  'computador travando',
  'mensagens de erro',
  'diagnosticar problemas',
  'soluções Windows',
  'troubleshooting Windows',
  'erros sistema',
  'problemas computador',
  'solucionar erros',
  'Windows reparação'
];

export const metadata: Metadata = createGuideMetadata('resolver-erros-windows', title, description, keywords);

export default function ResolverErrosWindowsGuide() {
  const contentSections = [
    {
      title: "Entendendo Erros do Windows",
      content: `
        <p class="mb-4">Erros do Windows podem aparecer por diversas razões: problemas de hardware, drivers desatualizados ou corrompidos, software conflitante, arquivos de sistema corrompidos, malware, ou falhas de memória. Compreender a causa raiz é o primeiro passo para resolver qualquer erro.</p>
        <p class="mb-4">Este guia cobre os erros mais comuns que usuários enfrentam e apresenta soluções passo a passo para cada um. Muitos erros têm múltiplas causas possíveis, então apresentamos diferentes abordagens para tentar antes de considerar soluções mais drásticas como formatação.</p>
        <p>Uma abordagem sistemática para resolver erros é: identificar o erro específico, pesquisar o código ou mensagem de erro, tentar soluções simples primeiro, e então progredir para soluções mais complexas se necessário. Documente o que você tentou, pois isso ajuda a identificar padrões.</p>
      `,
      subsections: []
    },
    {
      title: "Erro 1: Tela Azul (BSOD - Blue Screen of Death)",
      content: "",
      subsections: [
        {
          subtitle: "O Que É BSOD?",
          content: `
            <p class="mb-4">A tela azul (BSOD) aparece quando o Windows encontra um erro crítico do sistema que não pode ser recuperado. O computador reinicia automaticamente ou fica travado na tela azul com uma mensagem de erro.</p>
          `
        },
        {
          subtitle: "Soluções Passo a Passo",
          content: `
            <h4 class="text-xl font-bold text-white mb-2 mt-4">Solução 1: Anotar o Código de Erro</h4>
            <p class="mb-4">Na tela azul, anote o código de erro (ex: STOP: 0x0000007E, IRQL_NOT_LESS_OR_EQUAL, etc.). Este código ajuda a identificar a causa:</p>
            <ol class="space-y-2 text-gray-300 list-decimal list-inside ml-4 mb-4">
              <li>Quando a tela azul aparecer, anote o código de erro exato</li>
              <li>Pesquise o código específico na internet</li>
              <li>Códigos comuns incluem problemas de drivers, memória RAM ou hardware</li>
            </ol>
            <h4 class="text-xl font-bold text-white mb-2 mt-4">Solução 2: Verificar Hardware</h4>
            <ol class="space-y-2 text-gray-300 list-decimal list-inside ml-4 mb-4">
              <li>Desligue o computador completamente</li>
              <li>Verifique se todos os cabos estão bem conectados</li>
              <li>Teste a memória RAM com ferramentas de diagnóstico</li>
              <li>Verifique temperatura do processador (superaquecimento pode causar BSOD)</li>
              <li>Teste o disco rígido para erros</li>
            </ol>
            <h4 class="text-xl font-bold text-white mb-2 mt-4">Solução 3: Atualizar Drivers</h4>
            <ol class="space-y-2 text-gray-300 list-decimal list-inside ml-4 mb-4">
              <li>Inicie o Windows em Modo Seguro</li>
              <li>Atualize drivers críticos (vídeo, rede, áudio)</li>
              <li>Desinstale drivers problemáticos recentes</li>
              <li>Use o Gerenciador de Dispositivos para verificar conflitos</li>
            </ol>
          `
        }
      ]
    },
    {
      title: "Erro 2: Windows Não Inicia",
      content: "",
      subsections: [
        {
          subtitle: "Sintomas Comuns",
          content: `
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4 mb-4">
              <li>Tela preta na inicialização</li>
              <li>Loop de reinicialização constante</li>
              <li>Mensagem de erro durante o boot</li>
              <li>Windows inicia mas trava na tela de carregamento</li>
            </ul>
          `
        },
        {
          subtitle: "Soluções",
          content: `
            <h4 class="text-xl font-bold text-white mb-2 mt-4">Usar Reparação Automática</h4>
            <ol class="space-y-2 text-gray-300 list-decimal list-inside ml-4 mb-4">
              <li>Reinicie o computador 3 vezes durante a inicialização para entrar na Reparação Automática</li>
              <li>Ou use mídia de instalação do Windows e escolha "Reparar o computador"</li>
              <li>Selecione "Reparação Automática"</li>
              <li>Aguarde o Windows tentar reparar automaticamente</li>
            </ol>
            <h4 class="text-xl font-bold text-white mb-2 mt-4">Restauração do Sistema</h4>
            <ol class="space-y-2 text-gray-300 list-decimal list-inside ml-4 mb-4">
              <li>Na tela de reparação, escolha "Opções Avançadas"</li>
              <li>Vá em &quot;Solução de Problemas&quot; &gt; &quot;Opções Avançadas&quot;</li>
              <li>Selecione "Restauração do Sistema"</li>
              <li>Escolha um ponto de restauração anterior ao problema</li>
              <li>Confirme e aguarde a restauração</li>
            </ol>
            <h4 class="text-xl font-bold text-white mb-2 mt-4">Usar Prompt de Comando para Reparar</h4>
            <ol class="space-y-2 text-gray-300 list-decimal list-inside ml-4 mb-4">
              <li>Na tela de reparação, escolha Prompt de Comando</li>
              <li>Execute: <code class="bg-[#2a2a2e] px-2 py-1 rounded">sfc /scannow</code> (verifica integridade de arquivos)</li>
              <li>Execute: <code class="bg-[#2a2a2e] px-2 py-1 rounded">chkdsk C: /f /r</code> (verifica e repara disco)</li>
              <li>Execute: <code class="bg-[#2a2a2e] px-2 py-1 rounded">bootrec /fixmbr</code> e <code class="bg-[#2a2a2e] px-2 py-1 rounded">bootrec /fixboot</code></li>
              <li>Reinicie o computador</li>
            </ol>
          `
        }
      ]
    },
    {
      title: "Erro 3: Computador Travando ou Congelando",
      content: "",
      subsections: [
        {
          subtitle: "Possíveis Causas",
          content: `
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4 mb-4">
              <li>Superaquecimento</li>
              <li>Memória RAM insuficiente ou com defeito</li>
              <li>Disco rígido com problemas</li>
              <li>Drivers corrompidos</li>
              <li>Programas conflitantes</li>
              <li>Vírus ou malware</li>
            </ul>
          `
        },
        {
          subtitle: "Diagnóstico e Soluções",
          content: `
            <h4 class="text-xl font-bold text-white mb-2 mt-4">Verificar Temperaturas</h4>
            <ol class="space-y-2 text-gray-300 list-decimal list-inside ml-4 mb-4">
              <li>Use ferramentas como HWMonitor para verificar temperaturas</li>
              <li>CPU acima de 80°C ou GPU acima de 85°C indica superaquecimento</li>
              <li>Limpe poeira dos ventiladores e dissipadores</li>
              <li>Verifique se ventiladores estão funcionando</li>
              <li>Considere trocar pasta térmica do processador</li>
            </ol>
            <h4 class="text-xl font-bold text-white mb-2 mt-4">Testar Memória RAM</h4>
            <ol class="space-y-2 text-gray-300 list-decimal list-inside ml-4 mb-4">
              <li>Use a ferramenta Diagnóstico de Memória do Windows</li>
              <li>Ou use MemTest86 para teste completo</li>
              <li>Se encontrar erros, substitua a memória RAM</li>
            </ol>
            <h4 class="text-xl font-bold text-white mb-2 mt-4">Verificar Disco Rígido</h4>
            <ol class="space-y-2 text-gray-300 list-decimal list-inside ml-4 mb-4">
              <li>Execute verificação de erros no disco</li>
              <li>Monitore SMART do disco para sinais de falha iminente</li>
              <li>Considere backup imediato se o disco estiver falhando</li>
            </ol>
          `
        }
      ]
    },
    {
      title: "Erro 4: Mensagens de Erro Comuns",
      content: "",
      subsections: [
        {
          subtitle: '"Arquivo não encontrado" ou "Não é possível localizar o arquivo"',
          content: `
            <p class="mb-2">Geralmente indica que um programa ou arquivo de sistema foi deletado ou corrompido:</p>
            <ol class="space-y-2 text-gray-300 list-decimal list-inside ml-4">
              <li>Execute <code class="bg-[#2a2a2e] px-2 py-1 rounded">sfc /scannow</code> no Prompt de Comando como Administrador</li>
              <li>Reinstale o programa que está dando erro</li>
              <li>Verifique se antivírus não deletou arquivo legítimo</li>
            </ol>
          `
        },
        {
          subtitle: '"Acesso negado" ou "Permissão negada"',
          content: `
            <p class="mb-2">Problema de permissões ou acesso:</p>
            <ol class="space-y-2 text-gray-300 list-decimal list-inside ml-4">
              <li>Clique com botão direito &gt; Executar como Administrador</li>
              <li>Verifique propriedades do arquivo &gt; Segurança &gt; Permissões</li>
              <li>Certifique-se de que sua conta tem permissões necessárias</li>
            </ol>
          `
        },
        {
          subtitle: '"Não é possível executar esta aplicação"',
          content: `
            <p class="mb-2">Pode ser problema de compatibilidade ou arquivo corrompido:</p>
            <ol class="space-y-2 text-gray-300 list-decimal list-inside ml-4">
              <li>Execute em modo de compatibilidade</li>
              <li>Verifique se o programa é compatível com sua versão do Windows</li>
              <li>Reinstale o programa</li>
              <li>Verifique se não há malware</li>
            </ol>
          `
        }
      ]
    },
    {
      title: "Ferramentas de Diagnóstico Avançadas",
      content: "",
      subsections: [
        {
          subtitle: "Verificador de Arquivos do Sistema (SFC)",
          content: `
            <p class="mb-4">Verifica e repara arquivos de sistema corrompidos:</p>
            <ol class="space-y-2 text-gray-300 list-decimal list-inside ml-4 mb-4">
              <li>Abra Prompt de Comando como Administrador</li>
              <li>Execute: <code class="bg-[#2a2a2e] px-2 py-1 rounded">sfc /scannow</code></li>
              <li>Aguarde a verificação (pode levar 30 minutos ou mais)</li>
              <li>O Windows tentará reparar arquivos corrompidos automaticamente</li>
            </ol>
          `
        },
        {
          subtitle: "DISM (Deployment Image Servicing and Management)",
          content: `
            <p class="mb-4">Repara a imagem do Windows quando SFC não funciona:</p>
            <ol class="space-y-2 text-gray-300 list-decimal list-inside ml-4 mb-4">
              <li>Prompt de Comando como Administrador</li>
              <li>Execute: <code class="bg-[#2a2a2e] px-2 py-1 rounded">DISM /Online /Cleanup-Image /RestoreHealth</code></li>
              <li>Aguarde o processo (pode levar muito tempo e requer internet)</li>
              <li>Depois execute SFC novamente</li>
            </ol>
          `
        },
        {
          subtitle: "Visualizador de Eventos",
          content: `
            <p class="mb-4">Registra todos os erros e eventos do sistema:</p>
            <ol class="space-y-2 text-gray-300 list-decimal list-inside ml-4 mb-4">
              <li>Pressione <kbd class="bg-[#2a2a2e] px-2 py-1 rounded">Windows + R</kbd>, digite <code class="bg-[#2a2a2e] px-2 py-1 rounded">eventvwr.msc</code></li>
              <li>Vá em Logs do Windows &gt; Sistema</li>
              <li>Procure por erros (ícone vermelho)</li>
              <li>Clique em erros para ver detalhes</li>
              <li>Use os detalhes para pesquisar soluções específicas</li>
            </ol>
          `
        }
      ]
    },
    {
      title: "Quando Buscar Ajuda Profissional",
      content: `<p class="mb-4">Alguns problemas são muito complexos ou requerem conhecimento técnico avançado:</p>`,
      subsections: [
        {
          subtitle: "",
          content: `
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4 mb-4">
              <li>Erros que persistem após tentar todas as soluções básicas</li>
              <li>Problemas de hardware que requerem substituição de componentes</li>
              <li>Perda de dados que precisa de recuperação profissional</li>
              <li>Erros que indicam falha iminente de hardware</li>
              <li>Situações onde você não se sente confiante para tentar soluções sozinho</li>
            </ul>
          `
        },
        {
          subtitle: "Precisa de Ajuda para Resolver Erros?",
          content: `
            <div class="bg-[#171313] p-6 rounded-lg border border-[#31A8FF]/30 mt-6">
              <p class="text-white font-semibold mb-3 text-lg">Precisa de Ajuda para Resolver Erros?</p>
              <p class="text-gray-300 leading-relaxed mb-4">
                Nossa equipe de especialistas pode diagnosticar e resolver erros do Windows remotamente, de forma segura e eficiente.
              </p>
              <div class="flex flex-col sm:flex-row gap-4">
                <a 
                  href="/todos-os-servicos"
                  class="px-6 py-3 bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300 text-center inline-block"
                >
                  Ver Serviços de Correção
                </a>
                <a 
                  href="https://wa.me/5511996716235?text=Olá!%20Estou%20com%20erros%20no%20Windows%20e%20preciso%20de%20ajuda."
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
      href: "/guias/formatacao-windows",
      title: "Formatação do Windows",
      description: "Quando erros não podem ser corrigidos, formatação pode ser a solução."
    },
    {
      href: "/guias/otimizacao-performance",
      title: "Otimização de Performance",
      description: "Melhore o desempenho e evite muitos erros com otimização."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="20 minutos"
      difficultyLevel="Intermediário"
      contentSections={contentSections}
      relatedGuides={relatedGuides}
    />
  );
}

