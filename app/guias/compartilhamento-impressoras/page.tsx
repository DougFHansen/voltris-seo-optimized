import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Como Compartilhar Impressoras na Rede Windows (2026)";
const description = "Quer imprimir de qualquer PC da casa? Aprenda como configurar o compartilhamento de impressoras no Windows 11 de forma simples e segura em 2026.";
const keywords = [
  'como compartilhar impressora na rede windows 11 2026',
  'erro ao compartilhar impressora 0x0000011b tutorial',
  'instalar impressora compartilhada em outro pc guia',
  'compartilhamento de arquivos e impressoras windows 11 tutorial',
  'configurar impressora wifi rede domestica guia 2026'
];

export const metadata: Metadata = createGuideMetadata('compartilhamento-impressoras', title, description, keywords);

export default function PrinterSharingGuide() {
  const summaryTable = [
    { label: "Método Principal", value: "Compartilhamento de Rede Windows (SMB)" },
    { label: "Dica de Segurança", value: "Desativar compartilhamento por senha (se confiável)" },
    { label: "Erro Comum", value: "Bloqueio por Firewall / Credenciais" },
    { label: "Dificuldade", value: "Médio" }
  ];

  const contentSections = [
    {
      title: "Por que compartilhar sua impressora?",
      content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Ter uma impressora para cada computador é caro e desnecessário. Em 2026, mesmo que sua impressora não tenha Wi-Fi nativo, você pode transformá-la em uma "impressora de rede" conectando-a via USB em um PC e liberando o acesso para todos os outros notebooks e desktops da casa ou escritório através do Windows 11.
        </p>
      `
    },
    {
      title: "1. Ativando a Descoberta de Rede",
      content: `
        <p class="mb-4 text-gray-300">Antes de tudo, os computadores precisam "se ver" na rede:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Vá em Painel de Controle > Rede e Internet > Central de Rede e Compartilhamento.</li>
            <li>Clique em 'Alterar as configurações de compartilhamento avançadas'.</li>
            <li>Ative a <strong>'Descoberta de rede'</strong> e o <strong>'Compartilhamento de arquivo e impressora'</strong>.</li>
            <li><strong>Dica:</strong> Em redes domésticas privadas, desative o 'Compartilhamento protegido por senha' para facilitar a conexão entre os PCs.</li>
        </ol>
      `
    },
    {
      title: "2. Preparando a Impressora Host",
      content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">No PC onde a impressora está plugada:</h4>
            <p class="text-sm text-gray-300">
                1. Vá em Configurações > Dispositivos > Impressoras e Scanners. <br/>
                2. Selecione sua impressora e clique em **Propriedades da Impressora**. <br/>
                3. Vá na aba **Compartilhamento** e marque 'Compartilhar esta impressora'. <br/>
                4. Dê um nome simples (ex: Impressora_Sala) para evitar erros de espaço no nome.
            </p>
        </div>
      `
    },
    {
      title: "3. Conectando nos outros computadores",
      content: `
        <p class="mb-4 text-gray-300">
            <strong>O passo final:</strong> 
            <br/><br/>No outro computador, abra o Explorer e digite o endereço IP do PC host (ex: <code>\\\\192.168.1.10</code>). Você verá o ícone da impressora compartilhada. Clique com o botão direito e selecione **'Conectar'**. O Windows baixará os drivers automaticamente do PC host e a impressora aparecerá pronta para o uso no Word, Excel ou qualquer outro programa em 2026.
        </p>
      `
    }
  ];

  // Additional advanced content sections
  const advancedContentSections = [
    {
      title: "4. Fundamentos Técnicos do Compartilhamento de Impressoras",
      content: `
        <h4 class="text-white font-bold mb-3">🔬 Arquitetura de Compartilhamento de Impressoras</h4>
        <p class="mb-4 text-gray-300">
          O compartilhamento de impressoras no Windows opera por meio de uma arquitetura cliente-servidor baseada em protocolos de rede:
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h5 class="text-blue-400 font-bold mb-3">Componentes Técnicos</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>• Serviço de Impressão (Spooler)</li>
              <li>• Protocolo SMB (Server Message Block)</li>
              <li>• Gerenciamento de Filas de Impressão</li>
              <li>• Drivers de Impressora Remota</li>
              <li>• Autenticação e Controle de Acesso</li>
            </ul>
          </div>
          <div class="bg-purple-900/10 p-5 rounded-xl border border-purple-500/20">
            <h5 class="text-purple-400 font-bold mb-3">Protocolos e Portas</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>• Porta 9100 (Raw Printing)</li>
              <li>• Porta 515 (LPD - Line Printer Daemon)</li>
              <li>• Porta 631 (IPP - Internet Printing Protocol)</li>
              <li>• Portas 139 e 445 (SMB)</li>
              <li>• Porta 1900 (UPnP)</li>
            </ul>
          </div>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">⚙️ Processo de Comunicação</h4>
        <p class="mb-4 text-gray-300">
          O processo de impressão remota envolve múltiplas etapas técnicas:
        </p>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-gray-300 border border-gray-700 rounded-lg">
            <thead class="bg-gray-800">
              <tr>
                <th class="p-3 text-left">Etapa</th>
                <th class="p-3 text-left">Descrição</th>
                <th class="p-3 text-left">Componente</th>
                <th class="p-3 text-left">Importância</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-t border-gray-700">
                <td class="p-3">1. Descoberta</td>
                <td class="p-3">Localização da impressora na rede</td>
                <td class="p-3">NetBIOS/SMB</td>
                <td class="p-3">Essencial</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3">2. Autenticação</td>
                <td class="p-3">Verificação de credenciais</td>
                <td class="p-3">Active Directory/SMB</td>
                <td class="p-3">Crítica</td>
              </tr>
              <tr class="border-t border-gray-700">
                <td class="p-3">3. Transferência</td>
                <td class="p-3">Envio do job de impressão</td>
                <td class="p-3">SPOOLER/DRIVER</td>
                <td class="p-3">Essencial</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3">4. Processamento</td>
                <td class="p-3">Renderização do documento</td>
                <td class="p-3">Driver de impressora</td>
                <td class="p-3">Crítica</td>
              </tr>
              <tr class="border-t border-gray-700">
                <td class="p-3">5. Impressão</td>
                <td class="p-3">Execução física da impressão</td>
                <td class="p-3">Impressora física</td>
                <td class="p-3">Final</td>
              </tr>
            </tbody>
          </table>
        </div>
      `
    },
    {
      title: "5. Configurações Avançadas de Rede",
      content: `
        <h4 class="text-white font-bold mb-3">🛡️ Configurações de Firewall e Segurança</h4>
        <p class="mb-4 text-gray-300">
          A configuração adequada do firewall é essencial para o funcionamento seguro do compartilhamento:
        </p>
        <div class="space-y-6">
          <div class="border-l-4 border-green-500 pl-4 py-2 bg-green-900/10">
            <h5 class="text-green-400 font-bold mb-2">Regras de Firewall Específicas</h5>
            <p class="text-gray-300 text-sm">
              Para permitir o compartilhamento de impressoras, é necessário configurar regras específicas no firewall do Windows:
            </p>
            <ul class="text-sm text-gray-300 space-y-1 mt-2">
              <li>• Permitir porta 9100 para impressão raw</li>
              <li>• Habilitar serviço de impressão no firewall</li>
              <li>• Permitir NetBIOS (portas 137-139)</li>
              <li>• Abrir porta 445 para SMB</li>
            </ul>
          </div>
          <div class="border-l-4 border-blue-500 pl-4 py-2 bg-blue-900/10">
            <h5 class="text-blue-400 font-bold mb-2">Políticas de Grupo</h5>
            <p class="text-gray-300 text-sm">
              Em ambientes corporativos, as políticas de grupo permitem controlar o acesso a impressoras compartilhadas:
            </p>
            <ul class="text-sm text-gray-300 space-y-1 mt-2">
              <li>• Configurações de segurança de rede</li>
              <li>• Controle de acesso baseado em usuário</li>
              <li>• Restrições de impressão</li>
              <li>• Auditoria de impressão</li>
            </ul>
          </div>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">🔧 Configurações de Rede Avançadas</h4>
        <p class="mb-4 text-gray-300">
          Vários parâmetros de rede influenciam no desempenho do compartilhamento:
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-gray-800 p-4 rounded-lg">
            <h5 class="text-cyan-400 font-bold mb-2">Configurações TCP/IP</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>• Buffer de recepção</li>
              <li>• Timeout de conexão</li>
              <li>• Tamanho de pacote</li>
              <li>• Prioridade de rede</li>
            </ul>
          </div>
          <div class="bg-gray-800 p-4 rounded-lg">
            <h5 class="text-purple-400 font-bold mb-2">Opções de Impressão</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>• Filas de prioridade</li>
              <li>• Processamento em segundo plano</li>
              <li>• Cache de documentos</li>
              <li>• Recuperação de erros</li>
            </ul>
          </div>
        </div>
      `
    },
    {
      title: "6. Solução de Problemas Avançados",
      content: `
        <h4 class="text-white font-bold mb-3">🔍 Diagnóstico de Problemas Complexos</h4>
        <p class="mb-4 text-gray-300">
          Problemas avançados de compartilhamento de impressoras requerem diagnóstico profundo:
        </p>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 my-6">
          <div class="bg-indigo-900/10 p-5 rounded-xl border border-indigo-500/20">
            <h5 class="text-indigo-400 font-bold mb-3">Erros Comuns</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>• Erro 0x0000011b (falha de autenticação)</li>
              <li>• Falha na instalação de driver</li>
              <li>• Conexão lenta ou intermitente</li>
              <li>• Impressão de documentos corrompidos</li>
              <li>• Falha na fila de impressão</li>
            </ul>
          </div>
          <div class="bg-cyan-900/10 p-5 rounded-xl border border-cyan-500/20">
            <h5 class="text-cyan-400 font-bold mb-3">Ferramentas de Diagnóstico</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>• PrintUI /s para gerenciamento remoto</li>
              <li>• Comando net view para mapeamento</li>
              <li>• PowerShell para impressoras</li>
              <li>• Event Viewer para logs</li>
              <li>• Network Monitor</li>
            </ul>
          </div>
          <div class="bg-green-900/10 p-5 rounded-xl border border-green-500/20">
            <h5 class="text-green-400 font-bold mb-3">Soluções Avançadas</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>• Modificação do registry</li>
              <li>• Atualização de firmware</li>
              <li>• Configuração de gateway</li>
              <li>• Alteração de protocolo</li>
              <li>• Reset de spooler</li>
            </ul>
          </div>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">📊 Prevenção de Problemas Futuros</h4>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-gray-300 border border-gray-700 rounded-lg">
            <thead class="bg-gray-800">
              <tr>
                <th class="p-3 text-left">Prática</th>
                <th class="p-3 text-left">Descrição</th>
                <th class="p-3 text-left">Benefício</th>
                <th class="p-3 text-left">Frequência</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-t border-gray-700">
                <td class="p-3">Atualização de Drivers</td>
                <td class="p-3">Manter drivers atualizados</td>
                <td class="p-3">Evitar incompatibilidades</td>
                <td class="p-3">Mensal</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3">Monitoramento de Rede</td>
                <td class="p-3">Verificar latência e disponibilidade</td>
                <td class="p-3">Identificar gargalos</td>
                <td class="p-3">Contínuo</td>
              </tr>
              <tr class="border-t border-gray-700">
                <td class="p-3">Backup de Configurações</td>
                <td class="p-3">Salvar configurações de impressora</td>
                <td class="p-3">Recuperação rápida</td>
                <td class="p-3">Antes de mudanças</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3">Testes de Conectividade</td>
                <td class="p-3">Verificar conexões periodicamente</td>
                <td class="p-3">Detectar problemas cedo</td>
                <td class="p-3">Semanal</td>
              </tr>
              <tr class="border-t border-gray-700">
                <td class="p-3">Auditoria de Segurança</td>
                <td class="p-3">Revisar permissões e acesso</td>
                <td class="p-3">Prevenir acessos indevidos</td>
                <td class="p-3">Trimestral</td>
              </tr>
            </tbody>
          </table>
        </div>
      `
    }
  ];

  const additionalContentSections = [
    {
      title: "7. Protocolos Alternativos de Impressão",
      content: `
        <h4 class="text-white font-bold mb-3">🌐 Outros Métodos de Compartilhamento</h4>
        <p class="mb-4 text-gray-300">
          Além do método tradicional do Windows, existem outras abordagens para compartilhar impressoras:
        </p>
        <div class="space-y-6">
          <div class="border-l-4 border-purple-500 pl-4 py-2 bg-purple-900/10">
            <h5 class="text-purple-400 font-bold mb-2">Internet Printing Protocol (IPP)</h5>
            <p class="text-gray-300 text-sm">
              Um protocolo baseado em HTTP que permite impressão pela internet ou intranet. Mais seguro e flexível que o SMB tradicional, especialmente para ambientes corporativos com firewalls restritivos.
            </p>
            <ul class="text-sm text-gray-300 space-y-1 mt-2">
              <li>• Funciona sobre HTTPS para segurança</li>
              <li>• Suporte nativo em Linux e macOS</li>
              <li>• Menos suscetível a bloqueios de firewall</li>
              <li>• Integração com sistemas web</li>
            </ul>
          </div>
          <div class="border-l-4 border-cyan-500 pl-4 py-2 bg-cyan-900/10">
            <h5 class="text-cyan-400 font-bold mb-2">Line Printer Daemon (LPD)</h5>
            <p class="text-gray-300 text-sm">
              Protocolo tradicional UNIX para impressão remota, ainda amplamente suportado. Bom para ambientes heterogêneos com múltiplos sistemas operacionais.
            </p>
            <ul class="text-sm text-gray-300 space-y-1 mt-2">
              <li>• Compatibilidade com sistemas legados</li>
              <li>• Simples de configurar</li>
              <li>• Baixa sobrecarga de rede</li>
              <li>• Funciona bem em redes pequenas</li>
            </ul>
          </div>
          <div class="border-l-4 border-yellow-500 pl-4 py-2 bg-yellow-900/10">
            <h5 class="text-yellow-400 font-bold mb-2">Cloud Printing (Google)</h5>
            <p class="text-gray-300 text-sm">
              Apesar do encerramento do Google Cloud Print, alternativas como o Google Workspace Printing ainda permitem impressão baseada em nuvem para organizações.
            </p>
            <ul class="text-sm text-gray-300 space-y-1 mt-2">
              <li>• Impressão de qualquer lugar</li>
              <li>• Autenticação centralizada</li>
              <li>• Gerenciamento baseado em web</li>
              <li>• Auditoria de impressão</li>
            </ul>
          </div>
        </div>
      `
    },
    {
      title: "8. Segurança Avançada em Impressão de Rede",
      content: `
        <h4 class="text-white font-bold mb-3">🔐 Considerações de Segurança</h4>
        <p class="mb-4 text-gray-300">
          Compartilhar impressoras introduz riscos de segurança que devem ser mitigados:
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h5 class="text-blue-400 font-bold mb-3">Controles de Acesso</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>• Permissões granulares de impressão</li>
              <li>• Autenticação obrigatória</li>
              <li>• Controle baseado em grupos AD</li>
              <li>• Limitação de quotas de impressão</li>
              <li>• Auditoria de documentos impressos</li>
            </ul>
          </div>
          <div class="bg-green-900/10 p-5 rounded-xl border border-green-500/20">
            <h5 class="text-green-400 font-bold mb-3">Criptografia e Proteção</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>• SSL/TLS para transmissão de dados</li>
              <li>• Isolamento de VLAN</li>
              <li>• Filtragem de conteúdo impresso</li>
              <li>• Proteção contra vazamento de dados</li>
              <li>• Assinatura digital de jobs</li>
            </ul>
          </div>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">🛡️ Melhores Práticas de Segurança</h4>
        <p class="mb-4 text-gray-300">
          Implementar segurança adequada no compartilhamento de impressoras:
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-3 ml-4">
          <li><strong>Segregação de rede:</strong> Colocar impressoras em uma VLAN separada para limitar o acesso</li>
          <li><strong>Autenticação por cartão:</strong> Utilizar sistemas de autenticação por cartão para liberar impressão</li>
          <li><strong>Registro de atividades:</strong> Manter logs detalhados de todos os trabalhos impressos</li>
          <li><strong>Políticas de impressão:</strong> Configurar restrições baseadas em usuário ou departamento</li>
          <li><strong>Atualizações regulares:</strong> Manter firmware da impressora atualizado para evitar vulnerabilidades</li>
        </ul>
      `
    },
    {
      title: "9. Tendências e Futuro da Impressão em Rede",
      content: `
        <h4 class="text-white font-bold mb-3">🚀 Tecnologias Emergentes</h4>
        <p class="mb-4 text-gray-300">
          A impressão em rede está evoluindo com novas tecnologias e paradigmas:
        </p>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
          <div class="bg-indigo-900/10 p-5 rounded-xl border border-indigo-500/20">
            <h5 class="text-indigo-400 font-bold mb-3">Impressão Baseada em IA</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>• Otimização automática de qualidade</li>
              <li>• Previsão de necessidade de toner</li>
              <li>• Balanceamento de carga inteligente</li>
              <li>• Diagnóstico preditivo de falhas</li>
              <li>• Classificação automática de documentos</li>
            </ul>
          </div>
          <div class="bg-cyan-900/10 p-5 rounded-xl border border-cyan-500/20">
            <h5 class="text-cyan-400 font-bold mb-3">IoT e Impressão</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>• Integração com sistemas smart office</li>
              <li>• Controle por assistentes de voz</li>
              <li>• Sensores para monitoramento em tempo real</li>
              <li>• Automação de workflows</li>
              <li>• Conectividade universal</li>
            </ul>
          </div>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">📊 Previsões para 2026-2027</h4>
        <p class="mb-4 text-gray-300">
          O futuro da impressão em rede promete inovações significativas:
        </p>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-gray-300 border border-gray-700 rounded-lg">
            <thead class="bg-gray-800">
              <tr>
                <th class="p-3 text-left">Tecnologia</th>
                <th class="p-3 text-left">Descrição</th>
                <th class="p-3 text-left">Implantação</th>
                <th class="p-3 text-left">Impacto</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-t border-gray-700">
                <td class="p-3">Blockchain para Impressão</td>
                <td class="p-3">Autenticação e rastreamento de documentos</td>
                <td class="p-3">2026-2027</td>
                <td class="p-3">Alto</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3">5G em Impressoras</td>
                <td class="p-3">Conectividade móvel de alta velocidade</td>
                <td class="p-3">2026</td>
                <td class="p-3">Médio</td>
              </tr>
              <tr class="border-t border-gray-700">
                <td class="p-3">Edge Computing</td>
                <td class="p-3">Processamento local de jobs de impressão</td>
                <td class="p-3">2027</td>
                <td class="p-3">Médio</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3">Zero Trust Print</td>
                <td class="p-3">Modelo de segurança baseado em confiança zero</td>
                <td class="p-3">2026-2028</td>
                <td class="p-3">Alto</td>
              </tr>
              <tr class="border-t border-gray-700">
                <td class="p-3">Impressão Verde</td>
                <td class="p-3">Otimização de recursos e sustentabilidade</td>
                <td class="p-3">2026</td>
                <td class="p-3">Médio</td>
              </tr>
            </tbody>
          </table>
        </div>
      `
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/instalar-impressora-wifi",
      title: "Impressora Wi-Fi",
      description: "Como configurar sem precisar de fios."
    },
    {
      href: "/guias/atalhos-produtividade-windows",
      title: "Produtividade",
      description: "Atalhos para imprimir mais rápido."
    },
    {
      href: "/guias/seguranca-digital",
      title: "Segurança de Rede",
      description: "Proteja seu compartilhamento contra invasores."
    }
  ];

  const allContentSections = [...contentSections, ...additionalContentSections];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="15 min"
      difficultyLevel="Médio"
      contentSections={allContentSections}
      advancedContentSections={advancedContentSections}
      summaryTable={summaryTable}
      relatedGuides={relatedGuides}
    />
  );
}