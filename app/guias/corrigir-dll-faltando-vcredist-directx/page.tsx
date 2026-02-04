import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Como Corrigir DLL Faltando: VCRedist e DirectX (Guia 2026)";
const description = "Seu jogo não abre por falta de .dll? Aprenda a instalar corretamente o Visual C++ Redistributable e o DirectX para rodar qualquer jogo em 2026.";
const keywords = [
    'como corrigir erro dll faltando windows 11 2026',
    'instalar vcredist all in one tutorial completo',
    'erro msvcp140.dll e vcruntime140.dll como resolver guia',
    'baixar directx 12 e directx 11 completo 2026',
    'solucionar erro aplicativo nao inicializou 0xc00007b'
];

export const metadata: Metadata = createGuideMetadata('corrigir-dll-faltando-vcredist-directx', title, description, keywords);

export default function DLLFixGuide() {
    const summaryTable = [
        { label: "O que são", value: "Bibliotecas de código essenciais (Runtimes)" },
        { label: "Culpado #1", value: "Visual C++ Redistributable (VCRedist)" },
        { label: "Culpado #2", value: "DirectX End-User Runtimes" },
        { label: "Dificuldade", value: "Fácil" }
    ];

    const contentSections = [
        {
            title: "Por que esses erros ocorrem?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Muitos jogos em 2026 são desenvolvidos usando ferramentas que dependem de bibliotecas da Microsoft. Se você formatou o seu PC recentemente ou o Windows Update não instalou tudo o que devia, ao tentar abrir o jogo você verá erros como **"MSVCP140.dll não encontrada"**. Nunca baixe DLLs individuais de sites estranhos! A solução correta é instalar o pacote oficial da Microsoft que contém centenas dessas bibliotecas.
        </p>
      `
        },
        {
             title: "1. Visual C++: O \"All in One\" (A Solução Mágica)",
            content: `
        <p class="mb-4 text-gray-300">Em vez de baixar um por um, instale o pacote completo:</p>
        <p class="text-sm text-gray-300">
            A melhor forma de resolver 99% dos erros de DLL em 2026 é o instalador <strong>Visual C++ Redistributable Runtimes All-in-One</strong>. Ele instala todas as versões de 2005 até 2026 de uma só vez, tanto para 32 bits (x86) quanto para 64 bits (x64). <br/><br/>
            <strong>Dica:</strong> Mesmo que o seu Windows seja 64 bits, você **precisa** instalar as versões x86 também, pois muitos jogos usam essas bibliotecas antigas para rodar subsistemas de áudio ou DRM.
        </p>
      `
        },
        {
            title: "2. DirectX: O motor dos jogos",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">DirectX End-User Web Installer:</h4>
            <p class="text-sm text-gray-300">
                Embora o Windows 11 já venha com o DirectX 12, ele não possui os componentes do <strong>DirectX 9, 10 e 11</strong> que muitos jogos clássicos utilizam. <br/><br/>
                Vá ao site oficial da Microsoft e baixe o 'DirectX End-User Runtime Web Installer'. Ele fará uma verificação nas pastas do seu sistema e baixará apenas o que estiver faltando, corrigindo erros como d3dx9_43.dll.
            </p>
        </div>
      `
        },
        {
            title: "3. O Erro 0xc00007b",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>O Vilão da Compatibilidade:</strong> 
            <br/><br/>Se você recebe o erro **"O aplicativo não pôde ser inicializado corretamente (0xc00007b)"**, significa que existe uma mistura de DLLs de 32 bits em pastas de 64 bits. A solução definitiva é desinstalar todos os 'Visual C++' pelo Painel de Controle e rodar o instalador All-in-One mencionado no passo 1. Isso limpará o registro e colocará cada arquivo no seu devido lugar.
        </p>
      `
        }
    ];

    // Additional advanced content sections
    const advancedContentSections = [
        {
            title: "4. Fundamentos Técnicos de Bibliotecas Dinâmicas",
            content: `
        <h4 class="text-white font-bold mb-3">🔬 Arquitetura de Bibliotecas DLL e Runtimes</h4>
        <p class="mb-4 text-gray-300">
            As DLLs (Dynamic Link Libraries) são componentes fundamentais da arquitetura do Windows que permitem o compartilhamento de código entre múltiplos programas:
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
                <h5 class="text-blue-400 font-bold mb-3">Tipos de Bibliotecas</h5>
                <ul class="text-sm text-gray-300 space-y-2">
                    <li>• Bibliotecas C/C++ Runtime (CRT)</li>
                    <li>• Bibliotecas do .NET Framework</li>
                    <li>• Componentes DirectX e Direct3D</li>
                    <li>• Bibliotecas de Áudio e Vídeo</li>
                    <li>• Componentes COM e ActiveX</li>
                </ul>
            </div>
            <div class="bg-purple-900/10 p-5 rounded-xl border border-purple-500/20">
                <h5 class="text-purple-400 font-bold mb-3">Arquiteturas e Versões</h5>
                <ul class="text-sm text-gray-300 space-y-2">
                    <li>• x86 (32-bit) e x64 (64-bit)</li>
                    <li>• Versões do Visual Studio (2005-2022)</li>
                    <li>• Compilação estática vs dinâmica</li>
                    <li>• ABI (Application Binary Interface)</li>
                    <li>• Versionamento e Side-by-side</li>
                </ul>
            </div>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">⚙️ Processo de Resolução de Dependências</h4>
        <p class="mb-4 text-gray-300">
            O Windows utiliza um processo complexo para localizar e carregar DLLs:
        </p>
        <div class="overflow-x-auto">
            <table class="w-full text-sm text-gray-300 border border-gray-700 rounded-lg">
                <thead class="bg-gray-800">
                    <tr>
                        <th class="p-3 text-left">Etapa</th>
                        <th class="p-3 text-left">Descrição</th>
                        <th class="p-3 text-left">Método de Busca</th>
                        <th class="p-3 text-left">Importância</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="border-t border-gray-700">
                        <td class="p-3">1. Pasta do Executável</td>
                        <td class="p-3">Busca na pasta do programa</td>
                        <td class="p-3">Diretório local</td>
                        <td class="p-3">Crítica</td>
                    </tr>
                    <tr class="border-t border-gray-700 bg-gray-800/30">
                        <td class="p-3">2. Pasta do Windows</td>
                        <td class="p-3">Busca em System32/SysWOW64</td>
                        <td class="p-3">Sistema operacional</td>
                        <td class="p-3">Essencial</td>
                    </tr>
                    <tr class="border-t border-gray-700">
                        <td class="p-3">3. PATH Environment</td>
                        <td class="p-3">Busca em diretórios do PATH</td>
                        <td class="p-3">Variáveis de ambiente</td>
                        <td class="p-3">Importante</td>
                    </tr>
                    <tr class="border-t border-gray-700 bg-gray-800/30">
                        <td class="p-3">4. Manifesto</td>
                        <td class="p-3">Busca por dependências declaradas</td>
                        <td class="p-3">Side-by-side assemblies</td>
                        <td class="p-3">Crítica</td>
                    </tr>
                    <tr class="border-t border-gray-700">
                        <td class="p-3">5. Fusion Log</td>
                        <td class="p-3">Registra falhas de carregamento</td>
                        <td class="p-3">Event tracing</td>
                        <td class="p-3">Diagnóstico</td>
                    </tr>
                </tbody>
            </table>
        </div>
      `
        },
        {
            title: "5. Análise Profunda de Erros de DLL",
            content: `
        <h4 class="text-white font-bold mb-3">🔍 Diagnóstico Técnico de Problemas de DLL</h4>
        <p class="mb-4 text-gray-300">
            A identificação precisa da causa raiz de erros de DLL é essencial para soluções eficazes:
        </p>
        <div class="space-y-6">
            <div class="border-l-4 border-green-500 pl-4 py-2 bg-green-900/10">
                <h5 class="text-green-400 font-bold mb-2">Erros Comuns e Significados</h5>
                <p class="text-gray-300 text-sm">
                    Entendimento técnico dos códigos de erro mais frequentes:
                </p>
                <ul class="text-sm text-gray-300 space-y-1 mt-2">
                    <li>• HRESULT 0x8007007E (DLL_NOT_FOUND)</li>
                    <li>• Erro 0xC00007B (MISMATCH_ARCHITECTURE)</li>
                    <li>• STATUS_DLL_INIT_FAILED</li>
                    <li>• Entry Point Not Found</li>
                    <li>• Dependency Walker reports</li>
                </ul>
            </div>
            <div class="border-l-4 border-blue-500 pl-4 py-2 bg-blue-900/10">
                <h5 class="text-blue-400 font-bold mb-2">Ferramentas de Diagnóstico</h5>
                <p class="text-gray-300 text-sm">
                    Ferramentas avançadas para análise de dependências:
                </p>
                <ul class="text-sm text-gray-300 space-y-1 mt-2">
                    <li>• Dependency Walker</li>
                    <li>• Process Monitor (ProcMon)</li>
                    <li>• Process Explorer</li>
                    <li>• Fusion Log Viewer</li>
                    <li>• Visual Studio Debugger</li>
                </ul>
            </div>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">🔧 Técnicas Avançadas de Troubleshooting</h4>
        <p class="mb-4 text-gray-300">
            Métodos sistemáticos para resolver problemas complexos de DLL:
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-gray-800 p-4 rounded-lg">
                <h5 class="text-cyan-400 font-bold mb-2">Análise de Processo</h5>
                <ul class="text-sm text-gray-300 space-y-2">
                    <li>• Monitoramento em tempo real</li>
                    <li>• Análise de chamadas de sistema</li>
                    <li>• Verificação de handles abertos</li>
                    <li>• Inspeção de módulos carregados</li>
                </ul>
            </div>
            <div class="bg-gray-800 p-4 rounded-lg">
                <h5 class="text-purple-400 font-bold mb-2">Reparo do Sistema</h5>
                <ul class="text-sm text-gray-300 space-y-2">
                    <li>• SFC /scannow</li>
                    <li>• DISM /Online /Cleanup-Image</li>
                    <li>• Verificação de integridade do sistema</li>
                    <li>• Restauração de componentes críticos</li>
                </ul>
            </div>
        </div>
      `
        },
        {
            title: "6. Gestão de Runtimes e Pacotes",
            content: `
        <h4 class="text-white font-bold mb-3">📦 Gerenciamento Avançado de Pacotes Redistribuíveis</h4>
        <p class="mb-4 text-gray-300">
            O gerenciamento eficiente dos pacotes redistribuíveis é crucial para a estabilidade do sistema:
        </p>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 my-6">
            <div class="bg-indigo-900/10 p-5 rounded-xl border border-indigo-500/20">
                <h5 class="text-indigo-400 font-bold mb-3">Versões do Visual C++</h5>
                <ul class="text-sm text-gray-300 space-y-2">
                    <li>• VS 2005 (v8.0) - Suporte encerrado</li>
                    <li>• VS 2008 (v9.0) - Suporte encerrado</li>
                    <li>• VS 2010 (v10.0) - Suporte encerrado</li>
                    <li>• VS 2012-2022 (v11.0-v14.x)</li>
                    <li>• VC++ 2019/2022 (Universal C Runtime)</li>
                </ul>
            </div>
            <div class="bg-cyan-900/10 p-5 rounded-xl border border-cyan-500/20">
                <h5 class="text-cyan-400 font-bold mb-3">Componentes DirectX</h5>
                <ul class="text-sm text-gray-300 space-y-2">
                    <li>• DirectX 9.0c (última versão)</li>
                    <li>• DirectX 10 (integrado no Vista/7)</li>
                    <li>• DirectX 11 (Windows 7+)</li>
                    <li>• DirectX 12 (Windows 10+)</li>
                    <li>• DirectX 12 Ultimate (Windows 10 20H1+)</li>
                </ul>
            </div>
            <div class="bg-green-900/10 p-5 rounded-xl border border-green-500/20">
                <h5 class="text-green-400 font-bold mb-3">Outras Bibliotecas Comuns</h5>
                <ul class="text-sm text-gray-300 space-y-2">
                    <li>• .NET Framework (1.1-4.8.1)</li>
                    <li>• Visual Basic/C# Runtimes</li>
                    <li>• MSXML e MSMQ</li>
                    <li>• Windows SDK Components</li>
                    <li>• OpenXR e Vulkan Runtimes</li>
                </ul>
            </div>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">📊 Tabela de Compatibilidade e Requisitos</h4>
        <div class="overflow-x-auto">
            <table class="w-full text-sm text-gray-300 border border-gray-700 rounded-lg">
                <thead class="bg-gray-800">
                    <tr>
                        <th class="p-3 text-left">Componente</th>
                        <th class="p-3 text-left">Versão</th>
                        <th class="p-3 text-left">Arquitetura</th>
                        <th class="p-3 text-left">Requisito Mínimo</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="border-t border-gray-700">
                        <td class="p-3">MSVCP140.dll</td>
                        <td class="p-3">v14.29+ (VS 2019/2022)</td>
                        <td class="p-3">x86/x64</td>
                        <td class="p-3">Windows 7+</td>
                    </tr>
                    <tr class="border-t border-gray-700 bg-gray-800/30">
                        <td class="p-3">VCRUNTIME140.dll</td>
                        <td class="p-3">v14.29+ (VS 2019/2022)</td>
                        <td class="p-3">x86/x64</td>
                        <td class="p-3">Windows 7+</td>
                    </tr>
                    <tr class="border-t border-gray-700">
                        <td class="p-3">D3D11.DLL</td>
                        <td class="p-3">DX 11 (Win8+)</td>
                        <td class="p-3">x86/x64</td>
                        <td class="p-3">Windows 7+</td>
                    </tr>
                    <tr class="border-t border-gray-700 bg-gray-800/30">
                        <td class="p-3">DXGI.DLL</td>
                        <td class="p-3">DX 11 (Win8+)</td>
                        <td class="p-3">x86/x64</td>
                        <td class="p-3">Windows 7+</td>
                    </tr>
                    <tr class="border-t border-gray-700">
                        <td class="p-3">API-MS-WIN-CRT*</td>
                        <td class="p-3">UCRT (Win10+)</td>
                        <td class="p-3">x86/x64</td>
                        <td class="p-3">Windows 10+</td>
                    </tr>
                </tbody>
            </table>
        </div>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "7. Ferramentas Avançadas de Diagnóstico",
            content: `
        <h4 class="text-white font-bold mb-3">🔍 Utilitários Profissionais para Análise de DLL</h4>
        <p class="mb-4 text-gray-300">
            Ferramentas especializadas para diagnosticar problemas complexos de dependências:
        </p>
        <div class="space-y-6">
            <div class="border-l-4 border-purple-500 pl-4 py-2 bg-purple-900/10">
                <h5 class="text-purple-400 font-bold mb-2">Dependency Walker e Alternativas</h5>
                <p class="text-gray-300 text-sm">
                    Ferramentas para análise de dependências de módulos executáveis e DLLs:
                </p>
                <ul class="text-sm text-gray-300 space-y-1 mt-2">
                    <li>• Dependency Walker (clássico, mas descontinuado)</li>
                    <li>• Dependencies (sucessor moderno)</li>
                    <li>• PE Explorer</li>
                    <li>• Resource Hacker</li>
                    <li>• DLL Export Viewer</li>
                </ul>
            </div>
            <div class="border-l-4 border-cyan-500 pl-4 py-2 bg-cyan-900/10">
                <h5 class="text-cyan-400 font-bold mb-2">Monitoramento em Tempo Real</h5>
                <p class="text-gray-300 text-sm">
                    Ferramentas para observar o comportamento do sistema em tempo de execução:
                </p>
                <ul class="text-sm text-gray-300 space-y-1 mt-2">
                    <li>• Process Monitor (Sysinternals)</li>
                    <li>• API Monitor</li>
                    <li>• File Monitor</li>
                    <li>• Registry Monitor</li>
                    <li>• Handle Monitor</li>
                </ul>
            </div>
            <div class="border-l-4 border-yellow-500 pl-4 py-2 bg-yellow-900/10">
                <h5 class="text-yellow-400 font-bold mb-2">Análise de Manifestos e Assembly</h5>
                <p class="text-gray-300 text-sm">
                    Ferramentas para inspecionar manifestos e assemblies do lado do cliente:
                </p>
                <ul class="text-sm text-gray-300 space-y-1 mt-2">
                    <li>• FXCop</li>
                    <li>• GAC Util (gacutil.exe)</li>
                    <li>• Assembly Binding Log Viewer</li>
                    <li>• MT.exe (Manifest Tool)</li>
                    <li>• ILDASM (IL Disassembler)</li>
                </ul>
            </div>
        </div>
      `
        },
        {
            title: "8. Procedimentos de Reparo Avançado",
            content: `
        <h4 class="text-white font-bold mb-3">🔧 Técnicas de Reparo Profundo do Sistema</h4>
        <p class="mb-4 text-gray-300">
            Quando métodos convencionais falham, procedimentos avançados podem resolver problemas persistentes:
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
                <h5 class="text-blue-400 font-bold mb-3">Reparo do Sistema Operacional</h5>
                <ul class="text-sm text-gray-300 space-y-2">
                    <li>• SFC /scannow (System File Checker)</li>
                    <li>• DISM /Online /Cleanup-Image /RestoreHealth</li>
                    <li>• SFC /scannow após DISM</li>
                    <li>• Verificação de integridade do WinSxS</li>
                    <li>• Restauração de componentes do sistema</li>
                </ul>
            </div>
            <div class="bg-green-900/10 p-5 rounded-xl border border-green-500/20">
                <h5 class="text-green-400 font-bold mb-3">Limpeza e Reinstalação de Runtimes</h5>
                <ul class="text-sm text-gray-300 space-y-2">
                    <li>• Desinstalação completa de VCRedist</li>
                    <li>• Limpeza manual de registros</li>
                    <li>• Remoção de componentes Side-by-side</li>
                    <li>• Reinício do Windows Modules Installer</li>
                    <li>• Reinstalação em ordem cronológica</li>
                </ul>
            </div>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">🧪 Procedimentos de Teste e Validação</h4>
        <p class="mb-4 text-gray-300">
            Após a correção, é importante validar a integridade do sistema:
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-3 ml-4">
            <li><strong>Teste de aplicativos críticos:</strong> Execute os programas que estavam falhando para confirmar a resolução</li>
            <li><strong>Análise de eventos:</strong> Verifique o Event Viewer por erros relacionados a DLLs</li>
            <li><strong>Verificação de desempenho:</strong> Monitore o uso de CPU e memória após a correção</li>
            <li><strong>Validação de integridade:</strong> Execute novamente o SFC /scannow para confirmar a integridade do sistema</li>
            <li><strong>Teste de boot:</strong> Verifique se o sistema inicializa corretamente após as alterações</li>
        </ul>
      `
        },
        {
            title: "9. Prevenção e Melhores Práticas",
            content: `
        <h4 class="text-white font-bold mb-3">🛡️ Estratégias de Prevenção de Problemas de DLL</h4>
        <p class="mb-4 text-gray-300">
            Medidas preventivas para evitar problemas recorrentes com DLLs:
        </p>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
            <div class="bg-indigo-900/10 p-5 rounded-xl border border-indigo-500/20">
                <h5 class="text-indigo-400 font-bold mb-3">Manutenção Proativa</h5>
                <ul class="text-sm text-gray-300 space-y-2">
                    <li>• Atualizações regulares de Windows</li>
                    <li>• Manutenção de runtimes atualizados</li>
                    <li>• Backup de DLLs críticas</li>
                    <li>• Monitoramento de integridade</li>
                    <li>• Documentação de configurações</li>
                </ul>
            </div>
            <div class="bg-cyan-900/10 p-5 rounded-xl border border-cyan-500/20">
                <h5 class="text-cyan-400 font-bold mb-3">Boas Práticas de Instalação</h5>
                <ul class="text-sm text-gray-300 space-y-2">
                    <li>• Instalação de pacotes completos</li>
                    <li>• Sequência correta de instalação</li>
                    <li>• Verificação de compatibilidade</li>
                    <li>• Uso de fontes oficiais</li>
                    <li>• Testes pós-instalação</li>
                </ul>
            </div>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">📋 Checklist de Prevenção</h4>
        <div class="overflow-x-auto">
            <table class="w-full text-sm text-gray-300 border border-gray-700 rounded-lg">
                <thead class="bg-gray-800">
                    <tr>
                        <th class="p-3 text-left">Prática</th>
                        <th class="p-3 text-left">Descrição</th>
                        <th class="p-3 text-left">Frequência</th>
                        <th class="p-3 text-left">Prioridade</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="border-t border-gray-700">
                        <td class="p-3">Atualização de Windows</td>
                        <td class="p-3">Manter sistema operacional atualizado</td>
                        <td class="p-3">Mensal</td>
                        <td class="p-3">Alta</td>
                    </tr>
                    <tr class="border-t border-gray-700 bg-gray-800/30">
                        <td class="p-3">Verificação de Runtimes</td>
                        <td class="p-3">Confirmar integridade dos pacotes redistribuíveis</td>
                        <td class="p-3">Trimestral</td>
                        <td class="p-3">Média</td>
                    </tr>
                    <tr class="border-t border-gray-700">
                        <td class="p-3">Backup do Sistema</td>
                        <td class="p-3">Manter pontos de restauração atualizados</td>
                        <td class="p-3">Mensal</td>
                        <td class="p-3">Alta</td>
                    </tr>
                    <tr class="border-t border-gray-700 bg-gray-800/30">
                        <td class="p-3">Monitoramento de Aplicações</td>
                        <td class="p-3">Observar erros recorrentes de DLL</td>
                        <td class="p-3">Contínuo</td>
                        <td class="p-3">Média</td>
                    </tr>
                    <tr class="border-t border-gray-700">
                        <td class="p-3">Auditoria de Instalações</td>
                        <td class="p-3">Verificar correta instalação de aplicações</td>
                        <td class="p-3">Após instalações</td>
                        <td class="p-3">Baixa</td>
                    </tr>
                </tbody>
            </table>
        </div>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/erro-0xc00007b-aplicativo-nao-inicializou",
            title: "Erro 0xc00007b",
            description: "Guia profundo focado apenas neste erro."
        },
        {
            href: "/guias/atualizacao-drivers-video",
            title: "Drivers de Vídeo",
            description: "Combine com o DirectX para performance máxima."
        },
        {
            href: "/guias/pos-instalacao-windows-11",
            title: "Checklist Windows",
            description: "Tudo o que você deve instalar no Windows novo."
        }
    ];

    const allContentSections = [...contentSections, ...additionalContentSections];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="15 min"
            difficultyLevel="Iniciante"
            contentSections={allContentSections}
            advancedContentSections={advancedContentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
