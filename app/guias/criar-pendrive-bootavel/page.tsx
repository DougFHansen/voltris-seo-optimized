import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'criar-pendrive-bootavel',
  title: "Como Criar um Pendrive Bootável do Windows 11 (2026)",
  description: "Precisa formatar o PC? Aprenda a criar um pendrive bootável oficial do Windows 11 usando a ferramenta da Microsoft ou o Rufus em 2026.",
  category: 'windows-geral',
  difficulty: 'Intermediário',
  time: '30 min'
};

const title = "Como Criar um Pendrive Bootável do Windows 11 (2026)";
const description = "Precisa formatar o PC? Aprenda a criar um pendrive bootável oficial do Windows 11 usando a ferramenta da Microsoft ou o Rufus em 2026.";
const keywords = [
  'como criar pendrive bootavel windows 11 2026',
  'criar midia de instalação windows 11 oficial guia',
  'como usar rufus para criar pendrive bootavel tutorial',
  'pendrive bootavel windows 11 mbr vs gpt explicacao',
  'formatar pc com pendrive bootavel passo a passo 2026'
];

export const metadata: Metadata = createGuideMetadata('criar-pendrive-bootavel', title, description, keywords);

export default function BootableUSBGuide() {
  const summaryTable = [
    { label: "Capacidade Mínima", value: "8GB ou mais" },
    { label: "Formato Necessário", value: "GPT (Para UEFI) / MBR (Para Legacy/Antigos)" },
    { label: "Ferramenta Oficial", value: "Media Creation Tool (Microsoft)" },
    { label: "Dificuldade", value: "Intermediário" }
  ];

  const contentSections = [
    {
      title: "O primeiro passo para a formatação",
      content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Em 2026, você não precisa mais de DVDs para instalar o Windows. Um pendrive bootável é a forma mais rápida e segura de fazer uma instalação limpa do Windows 11. Nele, você coloca todos os arquivos de instalação de forma que o computador consiga ler as instruções de "boot" assim que é ligado, antes mesmo de entrar no HD ou SSD de hoje.
        </p>
      `
    },
    {
      title: "1. Método Oficial: Media Creation Tool",
      content: `
        <p class="mb-4 text-gray-300">Este é o método mais seguro e fácil da Microsoft:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Acesse o site oficial: <strong>microsoft.com/software-download/windows11</strong>.</li>
            <li>Baixe a ferramenta 'Criar mídia de instalação do Windows 11'.</li>
            <li>Conecte seu pendrive (Atenção: todos os arquivos dele serão apagados!).</li>
            <li>Selecione 'Unidade flash USB' e siga as instruções. A ferramenta baixará a ISO mais recente e preparará o pendrive sozinha.</li>
        </ol>
      `
    },
    {
      title: "2. Método Avançado: RUFUS (Pule o TPM 2.0)",
      content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Para PCs Antigos ou Customizados:</h4>
            <p class="text-sm text-gray-300">
                Se o seu PC não tem suporte oficial ao TPM 2.0 ou conta com hardware mais antigo, o **Rufus** é a melhor escolha. <br/><br/>
                Ao criar o pendrive com ele, você pode marcar opções para **remover o requisito de 4GB de RAM, TPM e Secure Boot**. Isso permite que você instale o Windows 11 em quase qualquer computador de 2026, além de permitir criar uma conta local sem precisar de internet ou e-mail da Microsoft.
            </p>
        </div>
      `
    },
    {
      title: "3. Diferença entre MBR e GPT",
      content: `
        <p class="mb-4 text-gray-300">
            <strong>Não erre na hora do boot:</strong> 
            <br/><br/>- <strong>GPT (UEFI):</strong> O padrão para todos os PCs modernos. Se o seu PC foi comprado após 2015, use GPT. <br/>
            - <strong>MBR (BIOS):</strong> Use apenas se estiver instalando em um computador muito antigo que não tem o menu de BIOS azul/moderno. <br/><br/>
            Escolher a opção errada no Rufus fará com que o pendrive não seja reconhecido pelo computador na hora de ligar.
        </p>
      `
    }
  ];

  // Additional advanced content sections
  const advancedContentSections = [
    {
      title: "4. Fundamentos Técnicos de Boot e Particionamento",
      content: `
        <h4 class="text-white font-bold mb-3">🔬 Arquitetura de Boot e Sistemas de Particionamento</h4>
        <p class="mb-4 text-gray-300">
          O processo de boot envolve múltiplas etapas técnicas e diferentes sistemas de particionamento:
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h5 class="text-blue-400 font-bold mb-3">Sistemas de Particionamento</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>• MBR (Master Boot Record)</li>
              <li>• GPT (GUID Partition Table)</li>
              <li>• EFI System Partition (ESP)</li>
              <li>• Microsoft Reserved Partition (MSR)</li>
              <li>• Boot Configuration Data (BCD)</li>
            </ul>
          </div>
          <div class="bg-purple-900/10 p-5 rounded-xl border border-purple-500/20">
            <h5 class="text-purple-400 font-bold mb-3">Processo de Boot</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>• Power-On Self-Test (POST)</li>
              <li>• Firmware Initialization</li>
              <li>• Boot Manager Execution</li>
              <li>• Loader Chain Process</li>
              <li>• OS Kernel Loading</li>
            </ul>
          </div>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">⚙️ Comparação Técnica MBR vs GPT</h4>
        <p class="mb-4 text-gray-300">
          As diferenças técnicas entre os sistemas de particionamento são fundamentais para entender a compatibilidade:
        </p>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-gray-300 border border-gray-700 rounded-lg">
            <thead class="bg-gray-800">
              <tr>
                <th class="p-3 text-left">Característica</th>
                <th class="p-3 text-left">MBR (Legacy)</th>
                <th class="p-3 text-left">GPT (UEFI)</th>
                <th class="p-3 text-left">Importância</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-t border-gray-700">
                <td class="p-3">Limite de Partições</td>
                <td class="p-3">4 partições primárias</td>
                <td class="p-3">128 partições (padrão)</td>
                <td class="p-3">Crítica</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3">Limite de Disco</td>
                <td class="p-3">2TB (máximo)</td>
                <td class="p-3">9.4 ZB (teórico)</td>
                <td class="p-3">Crítica</td>
              </tr>
              <tr class="border-t border-gray-700">
                <td class="p-3">Checksum</td>
                <td class="p-3">Não (sem proteção)</td>
                <td class="p-3">Sim (autocorreção)</td>
                <td class="p-3">Essencial</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3">Segurança</td>
                <td class="p-3">Básica</td>
                <td class="p-3">Secure Boot</td>
                <td class="p-3">Alta</td>
              </tr>
              <tr class="border-t border-gray-700">
                <td class="p-3">Compatibilidade</td>
                <td class="p-3">PCs antigos (pré-2012)</td>
                <td class="p-3">PCs modernos (pós-2012)</td>
                <td class="p-3">Essencial</td>
              </tr>
            </tbody>
          </table>
        </div>
      `
    },
    {
      title: "5. Processos Técnicos de Criação de Pendrive Bootável",
      content: `
        <h4 class="text-white font-bold mb-3">🔧 Arquitetura de Imagens Bootáveis</h4>
        <p class="mb-4 text-gray-300">
          A criação de pendrives bootáveis envolve a manipulação de estruturas complexas de sistema de arquivos e setores de boot:
        </p>
        <div class="space-y-6">
          <div class="border-l-4 border-green-500 pl-4 py-2 bg-green-900/10">
            <h5 class="text-green-400 font-bold mb-2">Estrutura de uma Imagem ISO</h5>
            <p class="text-gray-300 text-sm">
              Componentes técnicos presentes em imagens ISO do Windows:
            </p>
            <ul class="text-sm text-gray-300 space-y-1 mt-2">
              <li>• Boot Sector (MBR ou GPT)</li>
              <li>• El Torito Boot Catalog</li>
              <li>• Boot Manager (bootmgr.efi)</li>
              <li>• Boot Configuration Data (BCD)</li>
              <li>• Windows PE (Preinstallation Environment)</li>
            </ul>
          </div>
          <div class="border-l-4 border-blue-500 pl-4 py-2 bg-blue-900/10">
            <h5 class="text-blue-400 font-bold mb-2">Processo de Escrita de Imagem</h5>
            <p class="text-gray-300 text-sm">
              Etapas técnicas envolvidas na gravação de imagens em dispositivos:
            </p>
            <ul class="text-sm text-gray-300 space-y-1 mt-2">
              <li>• Verificação de espaço disponível</li>
              <li>• Formatação com FAT32 (UEFI) ou NTFS (Legacy)</li>
              <li>• Cópia de arquivos de boot</li>
              <li>• Atualização do setor de boot</li>
              <li>• Configuração de flags de partição</li>
            </ul>
          </div>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">🔬 Ferramentas de Baixo Nível</h4>
        <p class="mb-4 text-gray-300">
          Ferramentas que operam diretamente com setores e estruturas de disco:
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-gray-800 p-4 rounded-lg">
            <h5 class="text-cyan-400 font-bold mb-2">Ferramentas de Baixo Nível</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>• dd (Linux/Unix)</li>
              <li>• diskpart (Windows)</li>
              <li>• Win32DiskImager</li>
              <li>• Etcher (cross-platform)</li>
            </ul>
          </div>
          <div class="bg-gray-800 p-4 rounded-lg">
            <h5 class="text-purple-400 font-bold mb-2">Parâmetros Técnicos</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>• Tamanho de bloco (sector size)</li>
              <li>• Alinhamento de partição</li>
              <li>• Tipo de partição (07, 0C, EF)</li>
              <li>• Flags de inicialização</li>
            </ul>
          </div>
        </div>
      `
    },
    {
      title: "6. Técnicas Avançadas de Criação e Personalização",
      content: `
        <h4 class="text-white font-bold mb-3">🛠️ Personalização Avançada de Pendrives Bootáveis</h4>
        <p class="mb-4 text-gray-300">
          Técnicas avançadas para criar pendrives com funcionalidades personalizadas:
        </p>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 my-6">
          <div class="bg-indigo-900/10 p-5 rounded-xl border border-indigo-500/20">
            <h5 class="text-indigo-400 font-bold mb-3">Multiboot USB</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>• GRUB4DOS</li>
              <li>• YUMI (Yet Another Multiboot USB)</li>
              <li>• Ventoy (plug-and-play)</li>
              <li>• EasyBCD</li>
              <li>• Custom ISO creation</li>
            </ul>
          </div>
          <div class="bg-cyan-900/10 p-5 rounded-xl border border-cyan-500/20">
            <h5 class="text-cyan-400 font-bold mb-3">Preinstalação de Drivers</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>• Driver injection</li>
              <li>• Windows PE customization</li>
              <li>• WinPE add-ons</li>
              <li>• Third-party driver packs</li>
              <li>• OEM driver integration</li>
            </ul>
          </div>
          <div class="bg-green-900/10 p-5 rounded-xl border border-green-500/20">
            <h5 class="text-green-400 font-bold mb-3">Scripts de Instalação</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>• Unattended installation</li>
              <li>• Answer files (autounattend.xml)</li>
              <li>• PowerShell scripts</li>
              <li>• Batch automation</li>
              <li>• Custom deployment tools</li>
            </ul>
          </div>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">📊 Tabela de Compatibilidade e Recomendações</h4>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-gray-300 border border-gray-700 rounded-lg">
            <thead class="bg-gray-800">
              <tr>
                <th class="p-3 text-left">Cenário</th>
                <th class="p-3 text-left">Ferramenta Recomendada</th>
                <th class="p-3 text-left">Configuração Ideal</th>
                <th class="p-3 text-left">Dificuldade</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-t border-gray-700">
                <td class="p-3">Instalação padrão Windows</td>
                <td class="p-3">Media Creation Tool</td>
                <td class="p-3">UEFI + GPT</td>
                <td class="p-3">Fácil</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3">Hardware antigo</td>
                <td class="p-3">Rufus</td>
                <td class="p-3">Legacy + MBR</td>
                <td class="p-3">Média</td>
              </tr>
              <tr class="border-t border-gray-700">
                <td class="p-3">Instalação sem TPM</td>
                <td class="p-3">Rufus + Registry mods</td>
                <td class="p-3">UEFI + GPT (sem TPM)</td>
                <td class="p-3">Média</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3">Multiboot USB</td>
                <td class="p-3">Ventoy ou YUMI</td>
                <td class="p-3">FAT32 + MBR</td>
                <td class="p-3">Difícil</td>
              </tr>
              <tr class="border-t border-gray-700">
                <td class="p-3">Instalação automatizada</td>
                <td class="p-3">WinPE + Scripts</td>
                <td class="p-3">Personalizado</td>
                <td class="p-3">Expert</td>
              </tr>
            </tbody>
          </table>
        </div>
      `
    }
  ];

  const additionalContentSections = [
    {
      title: "7. Análise Profunda de Ferramentas de Criação",
      content: `
        <h4 class="text-white font-bold mb-3">🔍 Comparação Técnica de Ferramentas</h4>
        <p class="mb-4 text-gray-300">
          Análise detalhada das principais ferramentas para criação de pendrives bootáveis:
        </p>
        <div class="space-y-6">
          <div class="border-l-4 border-purple-500 pl-4 py-2 bg-purple-900/10">
            <h5 class="text-purple-400 font-bold mb-2">Media Creation Tool</h5>
            <p class="text-gray-300 text-sm">
              Ferramenta oficial da Microsoft para criação de mídia de instalação:
            </p>
            <ul class="text-sm text-gray-300 space-y-1 mt-2">
              <li>• Oferece ISO oficial e atualizada</li>
              <li>• Integração direta com Windows Update</li>
              <li>• Verificação de integridade automática</li>
              <li>• Suporte limitado a personalizações</li>
              <li>• Requisitos de hardware obrigatórios</li>
            </ul>
          </div>
          <div class="border-l-4 border-cyan-500 pl-4 py-2 bg-cyan-900/10">
            <h5 class="text-cyan-400 font-bold mb-2">Rufus</h5>
            <p class="text-gray-300 text-sm">
              Ferramenta de código aberto com recursos avançados:
            </p>
            <ul class="text-sm text-gray-300 space-y-1 mt-2">
              <li>• Suporte a diversos formatos de imagem</li>
              <li>• Opções de particionamento avançadas</li>
              <li>• Modo de compatibilidade para hardware antigo</li>
              <li>• Otimização para diferentes cenários de uso</li>
              <li>• Bypass de requisitos do Windows 11</li>
            </ul>
          </div>
          <div class="border-l-4 border-yellow-500 pl-4 py-2 bg-yellow-900/10">
            <h5 class="text-yellow-400 font-bold mb-2">Alternativas Profissionais</h5>
            <p class="text-gray-300 text-sm">
              Outras ferramentas utilizadas por profissionais:
            </p>
            <ul class="text-sm text-gray-300 space-y-1 mt-2">
              <li>• WinToUSB (cópias bootáveis de HD)</li>
              <li>• YUMI (multiboot USB)</li>
              <li>• Ventoy (plug-and-play ISO boot)</li>
              <li>• UNetbootin (Linux distributions)</li>
              <li>• BalenaEtcher (universal flasher)</li>
            </ul>
          </div>
        </div>
      `
    },
    {
      title: "8. Considerações Técnicas de Hardware e Performance",
      content: `
        <h4 class="text-white font-bold mb-3">⚡ Impacto de Hardware na Performance de Instalação</h4>
        <p class="mb-4 text-gray-300">
          O desempenho do pendrive e do hardware afeta significativamente o processo de instalação:
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h5 class="text-blue-400 font-bold mb-3">Especificações de Pendrives</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>• Classe de velocidade (Classe 10, UHS-I, UHS-II)</li>
              <li>• Velocidade de leitura/gravação</li>
              <li>• Interface USB (2.0, 3.0, 3.1, 3.2)</li>
              <li>• Capacidade real vs anunciada</li>
              <li>• Controller e NAND Flash quality</li>
            </ul>
          </div>
          <div class="bg-green-900/10 p-5 rounded-xl border border-green-500/20">
            <h5 class="text-green-400 font-bold mb-3">Fatores de Performance</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>• Tamanho do cluster do sistema de arquivos</li>
              <li>• Alinhamento de partição (4K, 1MB)</li>
              <li>• Tamanho de bloco da gravação</li>
              <li>• Buffer de gravação</li>
              <li>• Verificação de gravação</li>
            </ul>
          </div>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">🔧 Otimização de Performance</h4>
        <p class="mb-4 text-gray-300">
          Dicas técnicas para maximizar a velocidade e confiabilidade:
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-3 ml-4">
          <li><strong>Escolha de pendrive:</strong> Use pendrives de classe A1 ou A2 para melhor performance de leitura</li>
          <li><strong>Sistema de arquivos:</strong> FAT32 para compatibilidade UEFI, NTFS para tamanhos maiores</li>
          <li><strong>Porta USB:</strong> Use portas USB 3.0 ou superiores para gravação mais rápida</li>
          <li><strong>Desfragmentação:</strong> Desfragmente o pendrive antes da gravação para melhor desempenho</li>
          <li><strong>Gravação direta:</strong> Evite cópias intermediárias, grave diretamente da ISO</li>
        </ul>
      `
    },
    {
      title: "9. Solução de Problemas Avançados",
      content: `
        <h4 class="text-white font-bold mb-3">🔍 Diagnóstico e Solução de Problemas Complexos</h4>
        <p class="mb-4 text-gray-300">
          Técnicas avançadas para resolver problemas comuns e incomuns:
        </p>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
          <div class="bg-indigo-900/10 p-5 rounded-xl border border-indigo-500/20">
            <h5 class="text-indigo-400 font-bold mb-3">Problemas de Boot</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>• Verificação de flags de partição</li>
              <li>• Correção de setor de boot</li>
              <li>• Atualização de firmware UEFI</li>
              <li>• Configuração de modo de boot</li>
              <li>• Verificação de hardware</li>
            </ul>
          </div>
          <div class="bg-cyan-900/10 p-5 rounded-xl border border-cyan-500/20">
            <h5 class="text-cyan-400 font-bold mb-3">Erros de Gravação</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>• Proteção contra gravação</li>
              <li>• Espaço insuficiente</li>
              <li>• Setores defeituosos</li>
              <li>• Problemas de permissão</li>
              <li>• Corrupção de dados</li>
            </ul>
          </div>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">📋 Checklist de Solução de Problemas</h4>
        <p class="mb-4 text-gray-300">
          Procedimentos sistemáticos para resolver problemas:
        </p>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-gray-300 border border-gray-700 rounded-lg">
            <thead class="bg-gray-800">
              <tr>
                <th class="p-3 text-left">Problema</th>
                <th class="p-3 text-left">Causa Provável</th>
                <th class="p-3 text-left">Solução</th>
                <th class="p-3 text-left">Dificuldade</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-t border-gray-700">
                <td class="p-3">Pendrive não aparece no boot</td>
                <td class="p-3">Configuração UEFI/LEGACY errada</td>
                <td class="p-3">Verificar modo de boot no BIOS</td>
                <td class="p-3">Fácil</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3">Erro de checksum</td>
                <td class="p-3">ISO corrompida ou pendrive defeituoso</td>
                <td class="p-3">Verificar integridade da ISO e usar outro pendrive</td>
                <td class="p-3">Média</td>
              </tr>
              <tr class="border-t border-gray-700">
                <td class="p-3">Boot interrompido</td>
                <td class="p-3">Partição não marcada como ativa</td>
                <td class="p-3">Marcar partição como ativa com diskpart</td>
                <td class="p-3">Média</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3">Erro de hardware</td>
                <td class="p-3">Setores defeituosos no pendrive</td>
                <td class="p-3">Formatar com verificação de bad blocks</td>
                <td class="p-3">Difícil</td>
              </tr>
              <tr class="border-t border-gray-700">
                <td class="p-3">Requisitos não atendidos</td>
                <td class="p-3">TPM 2.0 ou Secure Boot desativados</td>
                <td class="p-3">Modificar BCD ou usar Rufus com bypass</td>
                <td class="p-3">Média</td>
              </tr>
            </tbody>
          </table>
        </div>
      `
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/formatacao-windows",
      title: "Guia de Formatação",
      description: "O que fazer após criar o pendrive."
    },
    {
      href: "/guias/atualizar-bios-seguro",
      title: "Configurar Boot",
      description: "Como fazer o PC ler o pendrive primeiro."
    },
    {
      href: "/guias/pos-instalacao-windows-11",
      title: "Checklist Pós-Instalação",
      description: "Próximos passos após o Windows abrir."
    }
  ];

  const allContentSections = [...contentSections, ...additionalContentSections];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="30 min"
      difficultyLevel="Intermediário"
      contentSections={allContentSections}
      advancedContentSections={advancedContentSections}
      summaryTable={summaryTable}
      relatedGuides={relatedGuides}
    />
  );
}
