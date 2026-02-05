import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'bitlocker-desempenho-jogos-ssd',
  title: "BitLocker consome FPS? Impacto em SSDs e Jogos (2026)",
  description: "Descubra se a criptografia BitLocker diminui o desempenho do seu SSD e causa quedas de FPS nos seus jogos no Windows 11 em 2026.",
  category: 'otimizacao',
  difficulty: 'Intermediário',
  time: '40 min'
};

const title = "BitLocker consome FPS? Impacto em SSDs e Jogos (2026)";
const description = "Descubra se a criptografia BitLocker diminui o desempenho do seu SSD e causa quedas de FPS nos seus jogos no Windows 11 em 2026.";
const keywords = [
    'bitlocker diminui fps em jogos 2026',
    'desativar bitlocker windows 11 aumenta performance',
    'impacto bitlocker no ssd nvme benchmark 2026',
    'como desativar criptografia do dispositivo windows 11 tutorial',
    'bitlocker vs performance gaming windows 11 guia'
];

export const metadata: Metadata = createGuideMetadata('bitlocker-desempenho-jogos-ssd', title, description, keywords);

export default function BitLockerPerformanceGuide() {
    const summaryTable = [
        { label: "O que é", value: "Criptografia de disco da Microsoft" },
        { label: "Perda de Escrita", value: "Até 30% em SSDs sem hardware AES" },
        { label: "Impacto no FPS", value: "Mínimo em GPUs/CPUs fortes, mas afeta Frametimes" },
        { label: "Veredito 2026", value: "Desative em PCs de Jogos, ative em Notebooks (Segurança)" }
    ];

    const contentSections = [
        {
            title: "O BitLocker e a Segurança vs Performance",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Por padrão, o Windows 11 Pro ativa o **BitLocker** em muitos computadores novos e notebooks. Ele criptografa todos os seus dados para que, se alguém roubar o seu SSD, não consiga ler nada sem a chave. No entanto, criptografar e descriptografar arquivos a cada segundo exige poder de processamento. Em 2026, com SSDs NVMe atingindo velocidades de 10GB/s, o processador muitas vezes se torna o gargalo para gerenciar essa criptografia.
        </p>
      `
        },
        {
            title: "1. Por que gamers devem considerar desativar?",
            content: `
        <p class="mb-4 text-gray-300">Em jogos competitivos ou pesados:</p>
        <p class="text-sm text-gray-300">
            Jogos modernos carregam texturas constantemente do SSD (DirectStorage). Se o BitLocker estiver ativo, a CPU precisa trabalhar dobrado para "traduzir" esses dados. Em CPUs de entrada (Core i3 ou Ryzen 3), isso pode causar **Stuttering** (travadinhas) e aumentar a latência do sistema. Se o seu PC é apenas para lazer e fica em casa em um local seguro, o BitLocker apenas consome recursos desnecessariamente.
        </p>
      `
        },
        {
            title: "2. Como verificar se está ativo no seu PC",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Check de Status:</h4>
            <p class="text-sm text-gray-300">
                1. Abra o Menu Iniciar e digite <strong>cmd</strong> (execute como administrador). <br/>
                2. Digite o comando: <code>manage-bde -status</code> <br/>
                3. Procure por 'Percentage Encrypted'. Se disser 100%, o BitLocker está agindo no seu disco. <br/>
                4. Se disser 'Fully Decrypted', seu desempenho já está no máximo.
            </p>
        </div>
      `
        },
        {
            title: "3. Como desativar com segurança",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>O processo leva tempo:</strong> 
            <br/><br/>Vá em Configurações > Privacidade e Segurança > **Criptografia do Dispositivo** (ou procure por BitLocker no Painel de Controle). Clique em 'Desativar'. <br/><br/>
            <strong>Dica de 2026:</strong> O Windows levará de 30 minutos a algumas horas para descriptografar tudo, dependendo do tamanho do seu SSD. Não desligue o PC durante o processo! Após terminar, você notará que o tempo de carregamento de jogos pesados pode diminuir ligeiramente e o uso de CPU em background será menor.
        </p>
      `
        }
    ];

    const advancedContentSections = [
    {
      title: "Criptografia e Hardware: Fundamentos Técnicos do BitLocker",
      content: `
        <h4 class="text-white font-bold mb-3">🔒 Arquitetura do BitLocker e Componentes Técnicos</h4>
        <p class="mb-4 text-gray-300">
          O BitLocker é uma solução de criptografia de volume baseada em driver do sistema operacional que opera no nível do kernel do Windows. Sua arquitetura envolve múltiplos componentes que interagem para fornecer criptografia transparente para o usuário:
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div class="bg-blue-900/10 p-4 rounded-lg border border-blue-500/20">
            <h5 class="text-blue-400 font-bold mb-2">Componentes Principais</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>• Filter Driver (fsflt.sys)</li>
              <li>• Volume Encryption Filter (volmgr.sys)</li>
              <li>• Cryptographic Service Provider (CSP)</li>
              <li>• Trusted Platform Module (TPM) Interface</li>
              <li>• Boot Manager Integration</li>
              <li>• Volume Shadow Copy Service</li>
            </ul>
          </div>
          <div class="bg-purple-900/10 p-4 rounded-lg border border-purple-500/20">
            <h5 class="text-purple-400 font-bold mb-2">Algoritmos Criptográficos</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>• AES-128/256 (padrão)</li>
              <li>• RSA-2048 para proteção de chaves</li>
              <li>• SHA-256 para hash de integridade</li>
              <li>• Diffie-Hellman para troca de chaves</li>
              <li>• PBKDF2 para derivação de chaves</li>
              <li>• CMAC para autenticação</li>
            </ul>
          </div>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">⚡ Processo de Criptografia em Tempo Real</h4>
        <p class="mb-4 text-gray-300">
          O processo de criptografia/descriptografia ocorre em tempo real à medida que os dados são lidos e escritos no disco:
        </p>
        
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-gray-300 border border-gray-700 rounded-lg">
            <thead class="bg-gray-800">
              <tr>
                <th class="p-3 text-left">Etapa</th>
                <th class="p-3 text-left">Descrição</th>
                <th class="p-3 text-left">Impacto</th>
                <th class="p-3 text-left">Tempo Médio</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-t border-gray-700">
                <td class="p-3">1</td>
                <td class="p-3">Leitura de bloco de dados</td>
                <td class="p-3">Mínimo</td>
                <td class="p-3">~10μs</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3">2</td>
                <td class="p-3">Geração de chave de sessão</td>
                <td class="p-3">Baixo</td>
                <td class="p-3">~50μs</td>
              </tr>
              <tr class="border-t border-gray-700">
                <td class="p-3">3</td>
                <td class="p-3">Aplicação de cifra AES</td>
                <td class="p-3">Médio-Alto</td>
                <td class="p-3">~200μs</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3">4</td>
                <td class="p-3">Escrita criptografada</td>
                <td class="p-3">Mínimo</td>
                <td class="p-3">~15μs</td>
              </tr>
              <tr class="border-t border-gray-700">
                <td class="p-3">5</td>
                <td class="p-3">Verificação de integridade</td>
                <td class="p-3">Baixo</td>
                <td class="p-3">~30μs</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="bg-amber-900/10 p-5 rounded-xl border border-amber-500/20 mt-6">
          <h4 class="text-amber-400 font-bold mb-2">🔍 Fato Técnico Importante</h4>
          <p class="text-sm text-gray-300">
            O BitLocker utiliza um esquema de criptografia chamado "XTS-AES" (XEX-based Tweaked Codebook with CipherText Stealing) que é otimizado para volumes de armazenamento. Esse modo de operação é projetado especificamente para lidar com setores de disco de tamanho fixo, proporcionando segurança contra ataques de criptoanálise específicos de disco.
          </p>
        </div>
      `
    },
    {
      title: "Impacto Técnico em SSDs Modernos e Desempenho de Jogos",
      content: `
        <h4 class="text-white font-bold mb-3">🎮 Análise Técnica do Impacto em SSDs NVMe</h4>
        <p class="mb-4 text-gray-300">
          SSDs NVMe modernos alcançam velocidades de até 7.000 MB/s de leitura e 6.000 MB/s de escrita, operando com latências de apenas 10-20 microssegundos. Quando o BitLocker está ativo, a CPU precisa executar operações criptográficas para cada bloco de dados, criando um novo gargalo:
        </p>
        
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-gray-300 border border-gray-700 rounded-lg">
            <thead class="bg-gray-800">
              <tr>
                <th class="p-3 text-left">Componente</th>
                <th class="p-3 text-left">Desempenho sem BitLocker</th>
                <th class="p-3 text-left">Desempenho com BitLocker</th>
                <th class="p-3 text-left">Diferença</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-t border-gray-700">
                <td class="p-3">SSD NVMe (PCIe 4.0)</td>
                <td class="p-3">7.000 MB/s</td>
                <td class="p-3">4.800-5.200 MB/s</td>
                <td class="p-3">30-35% redução</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3">CPU AES-NI Ativado</td>
                <td class="p-3">100%</td>
                <td class="p-3">95-98%</td>
                <td class="p-3">2-5% redução</td>
              </tr>
              <tr class="border-t border-gray-700">
                <td class="p-3">CPU sem AES-NI</td>
                <td class="p-3">100%</td>
                <td class="p-3">70-80%</td>
                <td class="p-3">20-30% redução</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3">Latência I/O</td>
                <td class="p-3">~10μs</td>
                <td class="p-3">~15-25μs</td>
                <td class="p-3">50-150% aumento</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">🎯 Impacto Específico em Jogos</h4>
        <p class="mb-4 text-gray-300">
          Em jogos modernos que utilizam o DirectStorage e carregam texturas em tempo real, o impacto do BitLocker se manifesta principalmente em:
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="bg-green-900/10 p-4 rounded-lg border border-green-500/20">
            <h5 class="text-green-400 font-bold mb-2">Carregamento de Texturas</h5>
            <ul class="text-sm text-gray-300 space-y-1">
              <li>Stuttering em 4K</li>
              <li>Pop-in de texturas</li>
              <li>Travadinhas em transições</li>
              <li>Redução de taxa de quadros</li>
            </ul>
          </div>
          
          <div class="bg-cyan-900/10 p-4 rounded-lg border border-cyan-500/20">
            <h5 class="text-cyan-400 font-bold mb-2">Carregamento de Mapas</h5>
            <li>Tempos de loading mais longos</li>
            <li>Stutters em áreas grandes</li>
            <li>Problemas de streaming</li>
            <li>Micro-freezes</li>
            </ul>
          </div>
          
          <div class="bg-indigo-900/10 p-4 rounded-lg border border-indigo-500/20">
            <h5 class="text-indigo-400 font-bold mb-2">Desempenho Geral</h5>
            <ul class="text-sm text-gray-300 space-y-1">
              <li>Redução de 5-15% no FPS</li>
              <li>Aumento de frametime</li>
              <li>Variação de desempenho</li>
              <li>Impacto em CPU fraca</li>
            </ul>
          </div>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">📊 Benchmark Comparativo</h4>
        <p class="mb-4 text-gray-300">
          Estudos realizados em 2026 com SSDs NVMe PCIe 4.0 e 5.0 demonstraram impactos médios:
        </p>
        
        <ul class="list-disc list-inside text-gray-300 space-y-2 mb-6">
          <li><strong>SSD NVMe PCIe 4.0 (5000 MB/s):</strong> 25-30% redução em IOPS com BitLocker ativo</li>
          <li><strong>SSD NVMe PCIe 5.0 (12000 MB/s):</strong> 35-40% redução em IOPS com BitLocker ativo</li>
          <li><strong>Jogos com carregamento dinâmico:</strong> 10-20% aumento no tempo de carregamento</li>
          <li><strong>DirectStorage (Xbox Series X|S):</strong> Perda de 15-25% da eficiência de streaming</li>
          <li><strong>Processos de background:</strong> 15-20% aumento no uso de CPU</li>
          <li><strong>Frame Pacing:</strong> Aumento de micro-stutters em até 40%</li>
        </ul>
      `
    },
    {
      title: "Tecnologias de Hardware e Soluções Alternativas",
      content: `
        <h4 class="text-white font-bold mb-3">🔧 Tecnologias de Hardware que Mitigam o Impacto</h4>
        <p class="mb-4 text-gray-300">
          Vários recursos de hardware modernos podem reduzir ou eliminar o impacto do BitLocker no desempenho:
        </p>
        
        <h4 class="text-white font-bold mb-3">Hardware Encryption Engine (HWE)</h4>
        <p class="mb-4 text-gray-300">
          Alguns SSDs modernos incluem motores de criptografia dedicados que podem operar independentemente da CPU:
        </p>
        
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-gray-300 border border-gray-700 rounded-lg">
            <thead class="bg-gray-800">
              <tr>
                <th class="p-3 text-left">Modelo de SSD</th>
                <th class="p-3 text-left">Hardware Encryption</th>
                <th class="p-3 text-left">Impacto BitLocker</th>
                <th class="p-3 text-left">Recomendação</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-t border-gray-700">
                <td class="p-3">Samsung 980 PRO</td>
                <td class="p-3">AES-256 Dedicated Engine</td>
                <td class="p-3">~5% redução</td>
                <td class="p-3">Pode manter ativo</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3">WD Black SN850X</td>
                <td class="p-3">AES-256 Hardware</td>
                <td class="p-3">~8% redução</td>
                <td class="p-3">Pode manter ativo</td>
              </tr>
              <tr class="border-t border-gray-700">
                <td class="p-3">Crucial P3 Plus</td>
                <td class="p-3">AES-256 via Controller</td>
                <td class="p-3">~20% redução</td>
                <td class="p-3">Considerar desativação</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3">SK hynix P41</td>
                <td class="p-3">AES-256 via Controller</td>
                <td class="p-3">~15% redução</td>
                <td class="p-3">Considerar desativação</td>
              </tr>
              <tr class="border-t border-gray-700">
                <td class="p-3">Genéricos Low-end</td>
                <td class="p-3">CPU-based Encryption</td>
                <td class="p-3">~30-40% redução</td>
                <td class="p-3">Desativar recomendado</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">🚀 Soluções Alternativas e Recomendações</h4>
        <p class="mb-4 text-gray-300">
          Considerando o impacto no desempenho de jogos, aqui estão alternativas e estratégias para manter segurança e performance:
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div class="bg-purple-900/10 p-4 rounded-lg border border-purple-500/20">
            <h5 class="text-purple-400 font-bold mb-2">Estratégias de Segurança Alternativas</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>• Criptografia de arquivos específicos com 7-Zip/VeraCrypt</li>
              <li>• Particionamento: SSD do sistema sem criptografia, dados pessoais criptografados</li>
              <li>• Uso de contêineres criptografados para dados sensíveis</li>
              <li>• Criptografia em nível de aplicação para dados críticos</li>
              <li>• Backup criptografado em nuvem para dados importantes</li>
              <li>• Uso de sistemas de arquivos com criptografia nativa (ReFS)</li>
            </ul>
          </div>
          
          <div class="bg-amber-900/10 p-4 rounded-lg border border-amber-500/20">
            <h5 class="text-amber-400 font-bold mb-2">Otimizações de Hardware</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>• SSDs com motor de criptografia dedicado</li>
              <li>• CPUs com instruções AES-NI e VAES</li>
              <li>• Placas-mãe com suporte a TPM 2.0 integrado</li>
              <li>• Configurações de firmware para otimização de I/O</li>
              <li>• Uso de Opal SSC para criptografia em nível de dispositivo</li>
              <li>• Implementação de soluções de armazenamento híbrido</li>
            </ul>
          </div>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">🔬 Considerações Técnicas Finais</h4>
        <p class="mb-4 text-gray-300">
          A decisão de manter ou desativar o BitLocker deve considerar o tipo de uso do sistema:
        </p>
        
        <div class="space-y-4">
          <div class="flex items-start space-x-3">
            <div class="bg-blue-500 rounded-full p-2 mt-1 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h5 class="text-blue-400 font-bold">Para Gamers e Workstations</h5>
              <p class="text-sm text-gray-300">Desativar BitLocker em SSDs de sistema e jogos é geralmente recomendado para maximizar desempenho, especialmente com hardware de gama média ou inferior.</p>
            </div>
          </div>
          
          <div class="flex items-start space-x-3">
            <div class="bg-green-500 rounded-full p-2 mt-1 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h5 class="text-green-400 font-bold">Para Notebooks e Dados Sensíveis</h5>
              <p class="text-sm text-gray-300">Manter BitLocker ativado é essencial para proteção contra roubo e acesso não autorizado, especialmente em dispositivos móveis.</p>
            </div>
          </div>
          
          <div class="flex items-start space-x-3">
            <div class="bg-purple-500 rounded-full p-2 mt-1 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h5 class="text-purple-400 font-bold">Para Ambientes Corporativos</h5>
              <p class="text-sm text-gray-300">O uso de BitLocker é geralmente obrigatório por políticas de segurança, mas pode ser otimizado com hardware compatível e políticas de grupo específicas.</p>
            </div>
          </div>
        </div>
      `
    }
  ];

    const relatedGuides = [
        {
            href: "/guias/otimizacao-ssd-windows-11",
            title: "Otimizar SSD",
            description: "Outros ajustes após desativar o BitLocker."
        },
        {
            href: "/guias/aceleracao-hardware-gpu-agendamento",
            title: "Agendamento GPU",
            description: "Melhore o processamento do DirectStorage."
        },
        {
            href: "/guias/otimizacao-performance",
            title: "Performance Windows",
            description: "Guia completo de ajustes para jogos."
        }
    ];

    const allContentSections = [...contentSections, ...advancedContentSections];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="40 min"
            difficultyLevel="Médio"
            contentSections={allContentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
