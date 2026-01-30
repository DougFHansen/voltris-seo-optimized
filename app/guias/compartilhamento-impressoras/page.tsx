import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Guia Completo de Compartilhamento de Impressoras";
const description = "Configure impressoras em rede, compartilhe dispositivos entre múltiplos computadores e gerencie filas de impressão corporativa.";
const keywords = ["compartilhar impressora","impressora rede","fila impressão","airprint","google cloud print"];

export const metadata: Metadata = createGuideMetadata('compartilhamento-impressoras', title, description, keywords);

export default function CompartilhamentoimpressorasGuide() {
  const contentSections = [
    {
      title: "Introdução e Conceitos Fundamentais",
      content: `
        <p class="mb-4">O compartilhamento de impressoras permite que múltiplos computadores em uma rede utilizem uma única impressora, eliminando a necessidade de comprar equipamentos separados para cada usuário e centralizando a gestão de impressão.</p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div class="bg-[#171313] p-4 rounded-lg border border-[#31A8FF]/30">
            <h3 class="text-white font-semibold mb-2">Benefícios Principais</h3>
            <ul class="text-gray-300 text-sm space-y-1">
              <li>✓ Redução de 60-80% nos custos de impressão</li>
              <li>✓ Gestão centralizada de filas de impressão</li>
              <li>✓ Menor consumo de energia elétrica</li>
              <li>✓ Facilidade de manutenção e suprimentos</li>
            </ul>
          </div>
          <div class="bg-[#171313] p-4 rounded-lg border border-[#FF4B6B]/30">
            <h3 class="text-white font-semibold mb-2">Requisitos Mínimos</h3>
            <ul class="text-gray-300 text-sm space-y-1">
              <li>🖨️ Impressora com conexão USB/Ethernet</li>
              <li>🌐 Rede local (WiFi ou cabeada) funcionando</li>
              <li>⏱️ Tempo estimado: 30-45 minutos</li>
              <li>👤 Permissões de administrador na rede</li>
            </ul>
          </div>
        </div>
        
        <div class="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4 my-6">
          <h3 class="text-orange-400 font-semibold mb-2">⚠️ Importante</h3>
          <p class="text-gray-300 text-sm">Certifique-se de que todos os computadores estão na mesma rede antes de iniciar o compartilhamento.</p>
        </div>
      `,
      subsections: [
        {
          subtitle: "Quando Aplicar Esta Técnica",
          content: `
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
              <li>Quando múltiplos usuários precisam acessar a mesma impressora</li>
              <li>Para centralizar a administração de impressão em rede</li>
              <li>Durante a configuração de ambientes de escritório</li>
              <li>Ao implementar políticas de economia de recursos</li>
            </ul>
          `
        }
      ]
    },
    {
      title: "Configuração Passo a Passo",
      content: `
        <p class="mb-4">Siga estas etapas para configurar o compartilhamento de impressoras no Windows.</p>
      `,
      subsections: [
        {
          subtitle: "Configuração da Impressora no Servidor",
          content: `
            <ol class="space-y-2 text-gray-300 list-decimal list-inside ml-4">
              <li>Instale a impressora no computador que será o servidor de impressão</li>
              <li>Verifique se ela imprime corretamente localmente</li>
              <li>Abra o Painel de Controle > Dispositivos e Impressoras</li>
              <li>Clique com botão direito na impressora e selecione "Impressora Propriedades"</li>
              <li>Vá para a aba "Compartilhamento" e marque "Compartilhar esta impressora"</li>
            </ol>
          `
        },
        {
          subtitle: "Configuração nos Clientes",
          content: `
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
              <li>Acesse "Adicionar impressora" nos clientes</li>
              <li>Selecione "Conectar a uma impressora remota"</li>
              <li>Insira o caminho UNC (\\NOME_DO_SERVIDOR\NOME_DA_IMPRESSORA)</li>
              <li>Instale os drivers necessários se solicitado</li>
              <li>Teste a impressão a partir do cliente</li>
            </ul>
          `
        }
      ]
    },
    {
      title: "Ferramentas e Recursos Recomendados",
      content: `
        <p class="mb-4">Ferramentas essenciais para gerenciamento de impressoras compartilhadas.</p>
      `,
      subsections: [
        {
          subtitle: "Software Especializado",
          content: `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-[#171313] p-3 rounded border border-[#31A8FF]/20">
                <h4 class="text-white font-semibold mb-2">Ferramentas Gratuitas</h4>
                <ul class="text-gray-300 text-xs space-y-1">
                  <li>Gerenciador de Dispositivos do Windows</li>
                  <li>Serviços de Impressão integrados ao SO</li>
                  <li>Ferramentas de diagnóstico de rede (ping, net view)</li>
                </ul>
              </div>
              <div class="bg-[#171313] p-3 rounded border border-[#FF4B6B]/20">
                <h4 class="text-white font-semibold mb-2">Soluções Pagas</h4>
                <ul class="text-gray-300 text-xs space-y-1">
                  <li>Soluções de gerenciamento de impressão empresarial (PaperCut)</li>
                  <li>Sistemas de autenticação para liberar impressão</li>
                  <li>Ferramentas de auditoria e relatórios de uso</li>
                </ul>
              </div>
            </div>
          `
        },
        {
          subtitle: "Práticas de Segurança",
          content: `
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
              <li>Limite o acesso às impressoras compartilhadas a usuários autorizados</li>
              <li>Configure autenticação para impressão de documentos sensíveis</li>
              <li>Monitore logs de impressão para detectar uso indevido</li>
              <li>Atualize regularmente os drivers das impressoras para segurança</li>
            </ul>
          `
        }
      ]
    },
    {
      title: "Troubleshooting e Solução de Problemas",
      content: `
        <p class="mb-4">Soluções para problemas comuns com impressoras compartilhadas.</p>
      `,
      subsections: [
        {
          subtitle: "Erros Frequentes e Soluções",
          content: `
            <div class="bg-[#171313] p-4 rounded-lg border border-[#8B31FF]/30">
              <h4 class="text-white font-semibold mb-2">Problema: Cliente não consegue encontrar impressora compartilhada</h4>
              <p class="text-gray-300 text-sm mb-2">Solução: Verifique configurações de rede e firewall</p>
              <ul class="text-gray-300 text-xs space-y-1 ml-4">
                <li>Verifique se o compartilhamento de arquivos e impressoras está ativado</li>
                <li>Confirme que os firewalls permitem tráfego de impressão</li>
                <li>Teste conectividade entre cliente e servidor (ping)</li>
              </ul>
            </div>
            <div class="bg-[#171313] p-4 rounded-lg border border-[#8B31FF]/30 mt-4">
              <h4 class="text-white font-semibold mb-2">Problema: Erros de driver na estação cliente</h4>
              <p class="text-gray-300 text-sm mb-2">Solução: Instale os drivers corretos no servidor e cliente</p>
              <ul class="text-gray-300 text-xs space-y-1 ml-4">
                <li>Instale os drivers compatíveis com o SO do cliente no servidor</li>
                <li>Adicione manualmente os drivers no servidor de impressão</li>
                <li>Verifique compatibilidade de arquitetura (32/64 bits)</li>
              </ul>
            </div>
          `
        },
        {
          subtitle: "Prevenção de Problemas Futuros",
          content: `
            <ul class="space-y-2 text-gray-300 list-disc list-inside ml-4">
              <li>Mantenha drivers de impressora atualizados em todos os sistemas</li>
              <li>Implemente políticas de uso para evitar sobrecarga do servidor</li>
              <li>Planeje a substituição de impressoras antigas regularmente</li>
              <li>Documente configurações de acesso e permissões para cada impressora</li>
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
      estimatedTime="40 minutos"
      difficultyLevel="Iniciante"
      contentSections={contentSections}
      relatedGuides={relatedGuides}
    />
  );
}