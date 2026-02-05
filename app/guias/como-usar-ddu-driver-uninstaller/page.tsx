import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'como-usar-ddu-driver-uninstaller',
  title: "Como usar o DDU (Display Driver Uninstaller) com Segurança",
  description: "Problemas com drivers de vídeo? Aprenda como usar o DDU para fazer uma limpeza profunda e remover drivers da NVIDIA e AMD em 2026.",
  category: 'windows-geral',
  difficulty: 'Avançado',
  time: '20 min'
};

const title = "Como usar o DDU (Display Driver Uninstaller) com Segurança";
const description = "Problemas com drivers de vídeo? Aprenda como usar o DDU para fazer uma limpeza profunda e remover drivers da NVIDIA e AMD em 2026.";
const keywords = [
    'como usar ddu display driver uninstaller 2026',
    'remover driver nvidia e amd completamente guia',
    'ddu tutorial passo a passo windows 11 2026',
    'corrigir erro de driver de vídeo com ddu tutorial',
    'instalação limpa de drivers de video guia profissional'
];

export const metadata: Metadata = createGuideMetadata('como-usar-ddu-driver-uninstaller', title, description, keywords);

export default function DDUGuide() {
    const summaryTable = [
        { label: "O que faz", value: "Apaga rastros de drivers no registro e pastas" },
        { label: "Quando usar", value: "Mudança de GPU ou Crashes constantes" },
        { label: "Duração", value: "15 min" },
        { label: "Dificuldade", value: "Avançado" }
    ];

    const contentSections = [
        {
            title: "O que é o DDU e por que ele é especial?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O **DDU (Display Driver Uninstaller)** é a ferramenta "nuclear" para correção de drivers de vídeo. Diferente da desinstalação comum do Windows, o DDU remove chaves de registro, sobras de arquivos e drivers de monitor que o Windows geralmente deixa para trás. Em 2026, ele é essencial para resolver problemas de performance em jogos ou para preparar o PC para uma placa de vídeo nova sem precisar formatar.
        </p>
      `
        },
        {
            title: "1. Preparação Crítica: Modo de Segurança",
            content: `
        <p class="mb-4 text-gray-300">Nunca use o DDU com o Windows em execução normal!</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Baixe o DDU apenas do site oficial (Guru3D ou Wagnardsoft).</li>
            <li>Entre no <strong>Modo de Segurança</strong> do Windows 11.</li>
            <li>Desconecte o seu cabo de rede ou desligue o Wi-Fi. (Isso impede que o Windows tente instalar um driver velho assim que você limpar).</li>
            <li>Execute o DDU como administrador.</li>
        </ol>
      `
        },
        {
            title: "2. Executando a Limpeza",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Configuração Recomendada:</h4>
            <p class="text-sm text-gray-300">
                - À direita, selecione o tipo de dispositivo: <strong>GPU</strong>. <br/>
                - Escolha a marca da sua placa antiga (NVIDIA, AMD ou Intel). <br/>
                - Clique no botão <strong>'Limpar e Reiniciar'</strong>. <br/><br/>
                O DDU fará todo o trabalho, criará um ponto de restauração e reiniciará o PC no modo normal com o driver básico de vídeo do Windows.
            </p>
        </div>
      `
        },
        {
            title: "3. Instalando o Driver Novo",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>Check final em 2026:</strong> 
            <br/><br/>Com o PC de volta ao modo normal (ainda sem internet), instale o driver que você baixou previamente. Só reconecte a internet após a instalação terminar com sucesso. Esse método garante que não existam restos de drivers antigos conflitando com os shaders e configurações do novo software, garantindo o máximo de FPS e estabilidade nos seus jogos.
        </p>
      `
        }
    ];

    // Additional advanced content sections
    const advancedContentSections = [
        {
            title: "4. Fundamentos Técnicos do DDU",
            content: `
        <h4 class="text-white font-bold mb-3">🔬 Arquitetura de Drivers de Vídeo e Componentes</h4>
        <p class="mb-4 text-gray-300">
            O DDU (Display Driver Uninstaller) opera em níveis profundos do sistema operacional, atuando em componentes que normalmente não são acessíveis por métodos convencionais de desinstalação:
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
                <h5 class="text-blue-400 font-bold mb-3">Componentes do Driver de Vídeo</h5>
                <ul class="text-sm text-gray-300 space-y-2">
                    <li>• Driver principal (nvidia.sys, atikmpag.sys)</li>
                    <li>• Controlador de GPU (nvlddmkm.sys, atikmdag.sys)</li>
                    <li>• Bibliotecas DirectX (d3d11.dll, dxgi.dll)</li>
                    <li>• Serviços do sistema (NVIDIA Container, AMD External Events)</li>
                    <li>• Perfis de energia e controle de GPU</li>
                </ul>
            </div>
            <div class="bg-purple-900/10 p-5 rounded-xl border border-purple-500/20">
                <h5 class="text-purple-400 font-bold mb-3">Locais de Armazenamento</h5>
                <ul class="text-sm text-gray-300 space-y-2">
                    <li>• Pasta do driver (%SystemRoot%\\System32\\DriverStore)</li>
                    <li>• Chaves de registro (HKLM\\SYSTEM\\CurrentControlSet\\Control\\Class)</li>
                    <li>• Cache de drivers (%ProgramData%)</li>
                    <li>• Perfis de GPU (HKCU\\Software\\NVIDIA Corporation)</li>
                    <li>• Configurações de controle de driver</li>
                </ul>
            </div>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">⚙️ Processo de Desinstalação Profunda</h4>
        <p class="mb-4 text-gray-300">
            O DDU executa um processo de desinstalação que abrange múltiplos níveis do sistema:
        </p>
        <div class="overflow-x-auto">
            <table class="w-full text-sm text-gray-300 border border-gray-700 rounded-lg">
                <thead class="bg-gray-800">
                    <tr>
                        <th class="p-3 text-left">Etapa</th>
                        <th class="p-3 text-left">Descrição</th>
                        <th class="p-3 text-left">Componentes Afetados</th>
                        <th class="p-3 text-left">Importância</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="border-t border-gray-700">
                        <td class="p-3">1. Identificação</td>
                        <td class="p-3">Detecta drivers instalados</td>
                        <td class="p-3">GPU, Monitor, Audio</td>
                        <td class="p-3">Crítica</td>
                    </tr>
                    <tr class="border-t border-gray-700 bg-gray-800/30">
                        <td class="p-3">2. Parada de Serviços</td>
                        <td class="p-3">Encerra serviços ativos</td>
                        <td class="p-3">NVIDIA Container, AMD Services</td>
                        <td class="p-3">Essencial</td>
                    </tr>
                    <tr class="border-t border-gray-700">
                        <td class="p-3">3. Remoção de Arquivos</td>
                        <td class="p-3">Deleta componentes do driver</td>
                        <td class="p-3">DriverStore, System32</td>
                        <td class="p-3">Crítica</td>
                    </tr>
                    <tr class="border-t border-gray-700 bg-gray-800/30">
                        <td class="p-3">4. Limpeza de Registro</td>
                        <td class="p-3">Remove entradas do registry</td>
                        <td class="p-3">HKLM, HKCU, Device Classes</td>
                        <td class="p-3">Crítica</td>
                    </tr>
                    <tr class="border-t border-gray-700">
                        <td class="p-3">5. Reinício Seguro</td>
                        <td class="p-3">Reinicia com driver genérico</td>
                        <td class="p-3">VGA Compatible Driver</td>
                        <td class="p-3">Essencial</td>
                    </tr>
                </tbody>
            </table>
        </div>
      `
        },
        {
            title: "5. Modo de Segurança e Considerações Técnicas",
            content: `
        <h4 class="text-white font-bold mb-3">🛡️ Modo de Segurança e Ambientes de Recuperação</h4>
        <p class="mb-4 text-gray-300">
            O uso do DDU no modo de segurança é fundamental para evitar conflitos com drivers em execução:
        </p>
        <div class="space-y-6">
            <div class="border-l-4 border-green-500 pl-4 py-2 bg-green-900/10">
                <h5 class="text-green-400 font-bold mb-2">Modo de Segurança com Rede</h5>
                <p class="text-gray-300 text-sm">
                    Ativa apenas os serviços e drivers essenciais do Windows, desabilitando drivers de terceiros. Isso permite que o DDU remova componentes conflitantes sem interferência de outros softwares.
                </p>
                <ul class="text-sm text-gray-300 space-y-1 mt-2">
                    <li>• Drivers de GPU são desativados</li>
                    <li>• Serviços de driver não iniciam</li>
                    <li>• Sistema opera com driver VGA básico</li>
                    <li>• Permite acesso total ao sistema de arquivos</li>
                </ul>
            </div>
            <div class="border-l-4 border-blue-500 pl-4 py-2 bg-blue-900/10">
                <h5 class="text-blue-400 font-bold mb-2">WinRE (Windows Recovery Environment)</h5>
                <p class="text-gray-300 text-sm">
                    Em situações críticas, o DDU pode ser executado a partir do ambiente de recuperação do Windows, onde o sistema operacional está completamente desmontado.
                </p>
                <ul class="text-sm text-gray-300 space-y-1 mt-2">
                    <li>• Máximo isolamento do sistema</li>
                    <li>• Acesso direto ao disco rígido</li>
                    <li>• Sem drivers de vídeo carregados</li>
                    <li>• Ambiente ideal para limpeza profunda</li>
                </ul>
            </div>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">🔧 Considerações Técnicas Importantes</h4>
        <p class="mb-4 text-gray-300">
            Vários fatores técnicos influenciam a eficácia e segurança do processo de desinstalação:
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-gray-800 p-4 rounded-lg">
                <h5 class="text-cyan-400 font-bold mb-2">Configurações do Sistema</h5>
                <ul class="text-sm text-gray-300 space-y-2">
                    <li>• Política de grupo e restrições</li>
                    <li>• Controle de acesso baseado em firmware</li>
                    <li>• Proteção contra remoção de drivers críticos</li>
                    <li>• Integração com serviços do Windows Update</li>
                </ul>
            </div>
            <div class="bg-gray-800 p-4 rounded-lg">
                <h5 class="text-purple-400 font-bold mb-2">Hardware Considerations</h5>
                <ul class="text-sm text-gray-300 space-y-2">
                    <li>• Integração com UEFI/BIOS</li>
                    <li>• Configurações de segurança de inicialização</li>
                    <li>• Virtualização e recursos de proteção</li>
                    <li>• Modos de inicialização alternativos</li>
                </ul>
            </div>
        </div>
      `
        },
        {
            title: "6. Diagnóstico e Prevenção de Problemas",
            content: `
        <h4 class="text-white font-bold mb-3">🔍 Diagnóstico de Problemas de Driver</h4>
        <p class="mb-4 text-gray-300">
            Antes de executar o DDU, é importante diagnosticar corretamente o problema de driver:
        </p>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 my-6">
            <div class="bg-indigo-900/10 p-5 rounded-xl border border-indigo-500/20">
                <h5 class="text-indigo-400 font-bold mb-3">Sintomas Comuns</h5>
                <ul class="text-sm text-gray-300 space-y-2">
                    <li>• Tela azul (WDDM_ERROR)</li>
                    <li>• FPS inconsistente</li>
                    <li>• Artefatos gráficos</li>
                    <li>• Drivers não instalando</li>
                    <li>• Conflitos de hardware</li>
                </ul>
            </div>
            <div class="bg-cyan-900/10 p-5 rounded-xl border border-cyan-500/20">
                <h5 class="text-cyan-400 font-bold mb-3">Diagnóstico Prévio</h5>
                <ul class="text-sm text-gray-300 space-y-2">
                    <li>• Verificação de eventos no Event Viewer</li>
                    <li>• Teste de estabilidade com ferramentas</li>
                    <li>• Análise de versões de driver</li>
                    <li>• Checagem de conflitos de hardware</li>
                    <li>• Verificação de integridade do sistema</li>
                </ul>
            </div>
            <div class="bg-green-900/10 p-5 rounded-xl border border-green-500/20">
                <h5 class="text-green-400 font-bold mb-3">Soluções Alternativas</h5>
                <ul class="text-sm text-gray-300 space-y-2">
                    <li>• Rollback de driver</li>
                    <li>• Atualização incremental</li>
                    <li>• Modo de compatibilidade</li>
                    <li>• Atualização de firmware</li>
                    <li>• Restauração do sistema</li>
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
                        <td class="p-3">Backup de Drivers</td>
                        <td class="p-3">Salvar drivers antes de atualizações</td>
                        <td class="p-3">Recuperação fácil</td>
                        <td class="p-3">Antes de upgrades</td>
                    </tr>
                    <tr class="border-t border-gray-700 bg-gray-800/30">
                        <td class="p-3">Verificação de Compatibilidade</td>
                        <td class="p-3">Checar hardware/software</td>
                        <td class="p-3">Evitar conflitos</td>
                        <td class="p-3">Sempre</td>
                    </tr>
                    <tr class="border-t border-gray-700">
                        <td class="p-3">Atualização Gradual</td>
                        <td class="p-3">Passar por versões intermediárias</td>
                        <td class="p-3">Menos riscos</td>
                        <td class="p-3">Ao mudar GPU</td>
                    </tr>
                    <tr class="border-t border-gray-700 bg-gray-800/30">
                        <td class="p-3">Testes de Estabilidade</td>
                        <td class="p-3">Verificar performance após mudança</td>
                        <td class="p-3">Identificar problemas cedo</td>
                        <td class="p-3">Pós-instalação</td>
                    </tr>
                    <tr class="border-t border-gray-700">
                        <td class="p-3">Monitoramento Contínuo</td>
                        <td class="p-3">Observar desempenho e logs</td>
                        <td class="p-3">Detecção precoce de falhas</td>
                        <td class="p-3">Regular</td>
                    </tr>
                </tbody>
            </table>
        </div>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "7. Técnicas Avançadas de Limpeza",
            content: `
        <h4 class="text-white font-bold mb-3">🧹 Métodos Alternativos de Limpeza Profunda</h4>
        <p class="mb-4 text-gray-300">
            Embora o DDU seja a solução mais eficaz, existem métodos complementares e alternativos para limpeza de drivers:
        </p>
        <div class="space-y-6">
            <div class="border-l-4 border-purple-500 pl-4 py-2 bg-purple-900/10">
                <h5 class="text-purple-400 font-bold mb-2">Limpeza Manual de Registry</h5>
                <p class="text-gray-300 text-sm">
                    Utilizando o regedit para remover manualmente as chaves de driver é uma abordagem mais arriscada, mas permite maior controle sobre o que é removido. Requer conhecimento específico sobre as localizações das chaves e seus impactos.
                </p>
                <ul class="text-sm text-gray-300 space-y-1 mt-2">
                    <li>• Chaves em HKLM\\SYSTEM\\CurrentControlSet\\Control\\Class</li>
                    <li>• Perfis em HKCU\\Software\\NVIDIA Corporation</li>
                    <li>• Configurações em HKLM\\SOFTWARE\\Microsoft\\DirectX</li>
                    <li>• Serviços em HKLM\\SYSTEM\\CurrentControlSet\\Services</li>
                </ul>
            </div>
            <div class="border-l-4 border-cyan-500 pl-4 py-2 bg-cyan-900/10">
                <h5 class="text-cyan-400 font-bold mb-2">DISM e SFC</h5>
                <p class="text-gray-300 text-sm">
                    As ferramentas nativas do Windows podem complementar a limpeza do DDU, reparando componentes do sistema afetados por drivers problemáticos.
                </p>
                <ul class="text-sm text-gray-300 space-y-1 mt-2">
                    <li>• DISM /Online /Cleanup-Image /RestoreHealth</li>
                    <li>• sfc /scannow para verificar integridade do sistema</li>
                    <li>• Componentes reparáveis do sistema operacional</li>
                    <li>• Recuperação de arquivos críticos do sistema</li>
                </ul>
            </div>
            <div class="border-l-4 border-yellow-500 pl-4 py-2 bg-yellow-900/10">
                <h5 class="text-yellow-400 font-bold mb-2">Driver Store Management</h5>
                <p class="text-gray-300 text-sm">
                    O gerenciamento direto da Driver Store permite remover pacotes de driver específicos sem afetar o sistema inteiro.
                </p>
                <ul class="text-sm text-gray-300 space-y-1 mt-2">
                    <li>• DISM /Image:C:\\mount /Remove-Driver</li>
                    <li>• Visualização de pacotes com pnputil</li>
                    <li>• Remoção de drivers antigos acumulados</li>
                    <li>• Prevenção de reinstalação automática</li>
                </ul>
            </div>
        </div>
      `
        },
        {
            title: "8. Procedimentos de Pós-Limpeza",
            content: `
        <h4 class="text-white font-bold mb-3">🔧 Passos Críticos Após a Limpeza com DDU</h4>
        <p class="mb-4 text-gray-300">
            Após a execução do DDU, os procedimentos de pós-limpeza são essenciais para garantir uma instalação bem-sucedida:
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
                <h5 class="text-blue-400 font-bold mb-3">Verificação de Sistema</h5>
                <ul class="text-sm text-gray-300 space-y-2">
                    <li>• Confirmação de driver VGA genérico</li>
                    <li>• Teste de conectividade básica</li>
                    <li>• Verificação de serviços críticos</li>
                    <li>• Validar ponto de restauração</li>
                    <li>• Análise de eventos do sistema</li>
                </ul>
            </div>
            <div class="bg-green-900/10 p-5 rounded-xl border border-green-500/20">
                <h5 class="text-green-400 font-bold mb-3">Preparação para Instalação</h5>
                <ul class="text-sm text-gray-300 space-y-2">
                    <li>• Download do driver correto</li>
                    <li>• Desativação temporária do Windows Update</li>
                    <li>• Configuração de política de grupo</li>
                    <li>• Preparação de ambiente limpo</li>
                    <li>• Backup de configurações importantes</li>
                </ul>
            </div>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">🧪 Testes de Estabilidade Pós-Instalação</h4>
        <p class="mb-4 text-gray-300">
            Após a instalação do novo driver, é importante validar a estabilidade do sistema:
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-3 ml-4">
            <li><strong>Teste de carga:</strong> Executar benchmarks gráficos para verificar estabilidade sob carga</li>
            <li><strong>Monitoramento térmico:</strong> Observar temperaturas da GPU durante uso intenso</li>
            <li><strong>Verificação de FPS:</strong> Comparar desempenho com expectativas normais</li>
            <li><strong>Teste de recursos:</strong> Validar funcionamento de tecnologias como ray tracing, DLSS, etc.</li>
            <li><strong>Validação de drivers auxiliares:</strong> Certificar-se de que audio HDMI e USB-C funcionam corretamente</li>
        </ul>
      `
        },
        {
            title: "9. Soluções para Casos Especiais",
            content: `
        <h4 class="text-white font-bold mb-3">🔧 Situações Atípicas e Soluções Avançadas</h4>
        <p class="mb-4 text-gray-300">
            Algumas situações requerem abordagens específicas ao usar o DDU:
        </p>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
            <div class="bg-indigo-900/10 p-5 rounded-xl border border-indigo-500/20">
                <h5 class="text-indigo-400 font-bold mb-3">Switching Between Brands</h5>
                <ul class="text-sm text-gray-300 space-y-2">
                    <li>• Mudança de NVIDIA para AMD ou vice-versa</li>
                    <li>• Necessidade de limpeza completa de ambos</li>
                    <li>• Considerações sobre software exclusivo</li>
                    <li>• Configurações de BIOS/UEFI específicas</li>
                    <li>• Diferenças na arquitetura de driver</li>
                </ul>
            </div>
            <div class="bg-cyan-900/10 p-5 rounded-xl border border-cyan-500/20">
                <h5 class="text-cyan-400 font-bold mb-3">Multi-GPU Systems</h5>
                <ul class="text-sm text-gray-300 space-y-2">
                    <li>• SLI/CrossFire configurations</li>
                    <li>• Remoção coordenada de múltiplos drivers</li>
                    <li>• Considerações sobre pontes e conexões</li>
                    <li>• Gerenciamento de performance balance</li>
                    <li>• Eliminação de conflitos entre GPUs</li>
                </ul>
            </div>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">🛡️ Considerações de Segurança e Recuperação</h4>
        <p class="mb-4 text-gray-300">
            Em casos extremos, medidas adicionais de segurança devem ser tomadas:
        </p>
        <div class="overflow-x-auto">
            <table class="w-full text-sm text-gray-300 border border-gray-700 rounded-lg">
                <thead class="bg-gray-800">
                    <tr>
                        <th class="p-3 text-left">Situação</th>
                        <th class="p-3 text-left">Ação Recomendada</th>
                        <th class="p-3 text-left">Risco</th>
                        <th class="p-3 text-left">Complexidade</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="border-t border-gray-700">
                        <td class="p-3">Sistema inutilizável</td>
                        <td class="p-3">Utilizar WinRE ou live CD</td>
                        <td class="p-3">Alto</td>
                        <td class="p-3">Alta</td>
                    </tr>
                    <tr class="border-t border-gray-700 bg-gray-800/30">
                        <td class="p-3">Falha de hardware</td>
                        <td class="p-3">Verificar integridade da GPU</td>
                        <td class="p-3">Médio</td>
                        <td class="p-3">Média</td>
                    </tr>
                    <tr class="border-t border-gray-700">
                        <td class="p-3">Corrupção de sistema</td>
                        <td class="p-3">Restauração de imagem de disco</td>
                        <td class="p-3">Alto</td>
                        <td class="p-3">Média</td>
                    </tr>
                    <tr class="border-t border-gray-700 bg-gray-800/30">
                        <td class="p-3">Conflitos persistentes</td>
                        <td class="p-3">Formatação e reinstalação limpa</td>
                        <td class="p-3">Médio</td>
                        <td class="p-3">Baixa</td>
                    </tr>
                    <tr class="border-t border-gray-700">
                        <td class="p-3">Drivers raizizados</td>
                        <td class="p-3">Remoção manual e verificação de malware</td>
                        <td class="p-3">Alto</td>
                        <td class="p-3">Alta</td>
                    </tr>
                </tbody>
            </table>
        </div>
      `
        }
    ];

    const relatedGuides = [

        {
            href: "/guias/atualizacao-drivers-video",
            title: "Baixar Drivers",
            description: "Links oficiais das fabricantes."
        },
        {
            href: "/guias/como-resolver-tela-azul",
            title: "Fix Tela Azul",
            description: "O que fazer se o erro persistir."
        },
        {
            href: "/guias/aceleracao-hardware-gpu-agendamento",
            title: "Otimizar Placa",
            description: "Ajuste fino pós-instalação."
        }
    ];

    const allContentSections = [...contentSections, ...additionalContentSections];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="20 min"
            difficultyLevel="Avançado"
            contentSections={allContentSections}
            advancedContentSections={advancedContentSections}
            additionalContentSections={additionalContentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
