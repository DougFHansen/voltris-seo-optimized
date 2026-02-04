import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "api-ms-win-crt-runtime-l1-1-0.dll Faltando: Guia Definitivo 2026";
const description = "Seu programa/jogo não abre e mostra erro 'api-ms-win-crt-runtime-l1-1-0.dll ausente'? Aprenda as 5 soluções definitivas para corrigir DLL faltando, instalar Visual C++ Redistributable corretamente e evitar sites maliciosos de DLL em 2026.";
const keywords = [
    'api-ms-win-crt-runtime-l1-1-0.dll faltando como resolver',
    'erro de sistema o programa nao pode ser iniciado dll',
    'instalar visual c++ redistributable 2015 a 2022',
    'corrigir erro de dll jogos windows 11 2026',
    'atualização universal c runtime windows tutorial',
    'kb2999226 windows 7 8.1 instalar dll fix',
    'api-ms-win-crt-heap-l1-1-0.dll erro solução',
    'baixar dll seguro microsoft oficial 2026'
];

export const metadata: Metadata = createGuideMetadata('api-ms-win-crt-runtime-missing', title, description, keywords);

export default function CRTRuntimeErrorGuide() {
    const summaryTable = [
        { label: "Erro Completo", value: "'O programa não pôde ser iniciado porque api-ms-win-crt-runtime-l1-1-0.dll está ausente'" },
        { label: "Causa Principal", value: "Falta do Universal C Runtime (parte do Visual C++ 2015-2022)" },
        { label: "Solução Rápida", value: "Instalar Visual C++ Redistributable (x86 E x64)" },
        { label: "Windows 7/8.1", value: "Instalar atualização KB2999226 primeiro" },
        { label: "Windows 10/11", value: "Windows Update + Visual C++" },
        { label: "Taxa de Sucesso", value: "98% dos casos resolvidos com Visual C++" },
        { label: "Perigo", value: "NUNCA baixar DLL de sites não oficiais (malware)" },
        { label: "Dificuldade", value: "Fácil" }
    ];

    const contentSections = [
        {
            title: "O Que É api-ms-win-crt-runtime-l1-1-0.dll e Por Que Falta?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O erro <strong>"O programa não pôde ser iniciado porque api-ms-win-crt-runtime-l1-1-0.dll está ausente do computador"</strong> é um dos mais comuns ao tentar abrir jogos ou programas no Windows 11. Esse arquivo .dll faz parte do <strong>Universal C Runtime (UCRT)</strong>, um componente essencial do <strong>Microsoft Visual C++ Redistributable</strong> que MUITOS programas precisam para funcionar.
        </p>
        
        <h4 class="text-white font-bold mb-3 mt-6">📚 Entendendo a Sigla Maluca</h4>
        <div class="bg-gray-800/30 p-4 rounded-lg border border-gray-700 mb-4">
          <ul class="list-disc text-gray-300 text-sm space-y-2 ml-6">
            <li><strong>api-ms-win-crt-runtime</strong> = API do Microsoft Windows C Runtime</li>
            <li><strong>l1-1-0</strong> = Versão da biblioteca (Level 1, Revision 1, Build 0)</li>
            <li><strong>.dll</strong> = Dynamic Link Library (biblioteca dinâmica compartilhada por vários programas)</li>
          </ul>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">🎮 Programas/Jogos Mais Afetados</h4>
        <ul class="list-disc list-inside text-gray-300 space-y-1 ml-4">
          <li>Adobe Photoshop, Premiere, After Effects</li>
          <li>Skype, Discord (versões antigas)</li>
          <li>Jogos da Steam (The Witcher 3, Dark Souls 3, etc)</li>
          <li>Jogos da Epic Games (Fortnite, GTA V pelo Epic Launcher)</li>
          <li>AutoCAD, SolidWorks, Blender</li>
          <li>Emuladores (RPCS3, Yuzu, Cemu)</li>
        </ul>
        
        <p class="text-gray-300 mt-6">
          <strong>Por que isso acontece?</strong> Quando você instala o Windows "do zero" ou usa uma versão "limpa" (sem bloatware), o Visual C++ Redistributable NÃO vem pré-instalado. Programas assumem que ele JÁ ESTÁ no sistema, então quando você tenta abrir, ele procura pela DLL... e não encontra.
        </p>
      `
        },
        {
            title: "Solução #1: Instalar Visual C++ Redistributable (Método Correto)",
            content: `
        <div class="bg-emerald-900/10 p-5 rounded-xl border border-emerald-500/20 mb-6">
          <h4 class="text-emerald-400 font-bold mb-2">✅ Esta Solução Resolve 98% dos Casos!</h4>
          <p class="text-sm text-gray-300">
            O erro de api-ms-win-crt-runtime é causado pela FALTA do Visual C++ 2015-2022 Redistributable. A solução é simples: instalar o pacote OFICIAL da Microsoft.
          </p>
        </div>
        
        <h4 class="text-white font-bold mb-3">📥 Passo a Passo Completo</h4>
        <ol class="list-decimal list-inside text-gray-300 space-y-4 ml-4">
          <li><strong>Baixe o Visual C++ Redistributable OFICIAL:</strong>
            <ul class="list-disc ml-8 mt-2 space-y-1 text-sm">
              <li><strong>Opção 1 (Recomendada):</strong> Baixe o <strong>"Visual C++ Redistributable Runtimes All-in-One"</strong> do TechPowerUp (instala TODAS as versões de uma vez)</li>
              <li><strong>Opção 2 (Oficial Microsoft):</strong> Vá em <code>microsoft.com</code> → Pesquise "Visual C++ 2015-2022 Redistributable" → Baixe</li>
            </ul>
          </li>
          
          <li><strong>Baixe AMBAS as versões (x86 E x64):</strong>
            <div class="bg-amber-900/10 p-4 rounded-lg border border-amber-500/20 mt-3">
              <p class="text-amber-400 text-xs font-bold">⚠️ ATENÇÃO CRÍTICA!</p>
              <p class="text-gray-300 text-sm mt-2">
                Mesmo que seu Windows seja 64-bit, você PRECISA instalar <strong>x86 (32-bit)</strong> E <strong>x64 (64-bit)</strong>. Muitos programas rodam em 32-bit e tentam carregar a DLL da versão x86. Se você instalar apenas x64, o erro continuará!
              </p>
            </div>
          </li>
          
          <li><strong>Instale na ordem correta:</strong>
            <ul class="list-disc ml-8 mt-2 space-y-1 text-sm">
              <li>Execute <code>vc_redist.x86.exe</code> (versão 32-bit) primeiro</li>
              <li>Clique em "Instalar" → Aguarde 2-3 minutos</li>
              <li>Execute <code>vc_redist.x64.exe</code> (versão 64-bit)</li>
              <li>Clique em "Instalar" novamente</li>
            </ul>
          </li>
          
          <li><strong>Reinicie o PC</strong> (obrigatório para registrar as DLLs no sistema).</li>
          
          <li><strong>Teste o programa/jogo</strong> - deve abrir normalmente agora!</li>
        </ol>
        
        <h4 class="text-white font-bold mb-3 mt-6">🔍 Como Verificar se Está Instalado</h4>
        <ol class="list-decimal list-inside text-gray-300 space-y-2 ml-4">
          <li>Aperte <strong>Win + R</strong>, digite <code>appwiz.cpl</code> e pressione Enter.</li>
          <li>No Painel de Controle, procure por <strong>"Microsoft Visual C++ 2015-2022 Redistributable"</strong>.</li>
          <li>Você deve ver DUAS entradas:
            <ul class="list-disc ml-8 mt-2 text-sm">
              <li>Microsoft Visual C++ 2015-2022 Redistributable (x86) - 14.XX.XXXXX</li>
              <li>Microsoft Visual C++ 2015-2022 Redistributable (x64) - 14.XX.XXXXX</li>
            </ul>
          </li>
          <li>Se ambas estiverem presentes, o problema está resolvido!</li>
        </ol>
      `
        },
        {
            title: "Solução #2: Windows Update (Para Windows 7, 8, 8.1)",
            content: `
        <p class="mb-4 text-gray-300">
          Se você ainda usa <strong>Windows 7 ou 8.1 em 2026</strong> (o que NÃO é recomendado por questões de segurança!), o erro de api-ms-win-crt pode persistir mesmo após instalar o Visual C++. Isso acontece porque o Universal C Runtime precisa de uma atualização ESPECÍFICA do Windows chamada <strong>KB2999226</strong>.
        </p>
        
        <h4 class="text-white font-bold mb-3 mt-6">🛠️ Como Instalar a Atualização KB2999226</h4>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4">
          <li>Vá no <strong>Windows Update</strong> (Painel de Controle → Windows Update).</li>
          <li>Clique em "Verificar atualizações".</li>
          <li>Procure pela atualização <strong>KB2999226</strong> na lista de "Atualizações Opcionais" ou "Importantes".</li>
          <li>Marque para instalar e clique em "Instalar atualizações".</li>
          <li>Reinicie o PC após a instalação.</li>
          <li>DEPOIS de instalar o KB2999226, instale o Visual C++ (Solução #1).</li>
        </ol>
        
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20 mt-6">
          <h4 class="text-blue-400 font-bold mb-2">💡 Para Windows 10 e 11</h4>
          <p class="text-sm text-gray-300">
            No Windows 10 e 11, a atualização KB2999226 já vem PRÉ-INSTALADA. Por isso, na maioria dos casos, basta instalar o Visual C++ (Solução #1) e o erro desaparece. Se o erro persistir no Win10/11, rode o Windows Update até não haver mais atualizações disponíveis.
          </p>
        </div>
      `
        },
        {
            title: "Solução #3: Reinstalar o Programa/Jogo com Administrador",
            content: `
        <p class="mb-4 text-gray-300">
          Às vezes, o programa foi instalado INCORRETAMENTE (sem permissões adequadas) e não consegue acessar as DLLs mesmo que elas estejam presentes no sistema.
        </p>
        
        <h4 class="text-white font-bold mb-3">🔄 Como Reinstalar Corretamente</h4>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4">
          <li>Desinstale completamente o programa/jogo (Painel de Controle → Programas e Recursos).</li>
          <li>Delete também a pasta residual (geralmente em <code>C:\Program Files</code> ou <code>C:\Program Files (x86)</code>).</li>
          <li>Baixe o instalador novamente (se possível, a versão mais recente).</li>
          <li>Clique DIREITO no instalador → <strong>"Executar como administrador"</strong>.</li>
          <li>Siga as instruções de instalação normalmente.</li>
          <li>Teste o programa - deve funcionar agora!</li>
        </ol>
      `
        },
        {
            title: "Solução #4: Verificar Integridade dos Arquivos do Sistema (SFC)",
            content: `
        <p class="mb-4 text-gray-300">
          Se você JÁ instalou o Visual C++ (ambas as versões) e o erro CONTINUA, pode haver corrupção nos arquivos do Windows. O comando <strong>SFC (System File Checker)</strong> escaneia e repara DLLs corrompidas automaticamente.
        </p>
        
        <h4 class="text-white font-bold mb-3">🛠️ Como Executar o SFC</h4>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4">
          <li>Abra o <strong>Prompt de Comando como Administrador</strong>:
            <ul class="list-disc ml-8 mt-2 text-sm">
              <li>Aperte <strong>Win + X</strong></li>
              <li>Clique em <strong>"Terminal (Admin)"</strong> ou <strong>"Prompt de Comando (Admin)"</strong></li>
            </ul>
          </li>
          <li>Digite o seguinte comando e pressione Enter:
            <div class="bg-black/30 p-3 rounded mt-2 font-mono text-xs">
              <code>sfc /scannow</code>
            </div>
          </li>
          <li>Aguarde 10-20 minutos (o comando vai escanear TODO o sistema).</li>
          <li>Se encontrar problemas, ele dirá: <em>"Proteção de Recursos do Windows encontrou arquivos corrompidos e os reparou com êxito"</em>.</li>
          <li>Reinicie o PC e teste o programa novamente.</li>
        </ol>
      `
        },
        {
            title: "PERIGO: Por Que VOCÊ NÃO DEVE Baixar DLLs de Sites Aleatórios",
            content: `
        <div class="bg-rose-900/10 p-5 rounded-xl border border-rose-500/20 mb-6">
          <h4 class="text-rose-400 font-bold mb-2 flex items-center gap-2">
            <span>🚫</span> NUNCA Baixe DLLs de Sites como "dll-files.com", "dll-download.com", etc!
          </h4>
          <p class="text-sm text-gray-300">
            Muitas pessoas, ao verem o erro de DLL faltando, procuram no Google "api-ms-win-crt-runtime-l1-1-0.dll download" e caem em sites que oferecem o arquivo .dll para download direto. <strong>Isso é EXTREMAMENTE PERIGOSO!</strong>
          </p>
        </div>
        
        <h4 class="text-white font-bold mb-3">💣 Perigos de Baixar DLLs de Sites Não Oficiais</h4>
        <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
          <li><strong>Malware/Vírus:</strong> Sites de DLL freqüentemente injetam trojans, keyloggers ou ransomware nos arquivos. Você instala a DLL e, junto, um vírus.</li>
          <li><strong>DLL Desatualizada:</strong> O arquivo pode estar desatualizado ou corrompido, causando MAIS problemas ao invés de resolver.</li>
          <li><strong>Versão Errada:</strong> Você pode baixar a versão 32-bit quando precisa 64-bit (ou vice-versa), perpetuando o erro.</li>
          <li><strong>Instabilidade do Sistema:</strong> Colocar DLLs manualmente pode causar conflitos com outras versões instaladas, gerando BSOD (tela azul).</li>
        </ul>
        
        <h4 class="text-white font-bold mb-3 mt-6">✅ Método CORRETO (Sempre Use Instaladores Oficiais)</h4>
        <table class="w-full text-sm text-gray-300 border border-gray-700 rounded-lg overflow-hidden mt-4">
          <thead class="bg-gray-800">
            <tr>
              <th class="p-3 text-left">Componente</th>
              <th class="p-3 text-left">Fonte Oficial</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-t border-gray-700">
              <td class="p-3">Visual C++ Redistributable</td>
              <td class="p-3">microsoft.com/download ou TechPowerUp (All-in-One)</td>
            </tr>
            <tr class="border-t border-gray-700 bg-gray-800/30">
              <td class="p-3">DirectX</td>
              <td class="p-3">microsoft.com/download/directx</td>
            </tr>
            <tr class="border-t border-gray-700">
              <td class="p-3">.NET Framework</td>
              <td class="p-3">dotnet.microsoft.com</td>
            </tr>
          </tbody>
        </table>
      `
        },
        {
            title: "Análise Técnica: Como o Windows Gerencia DLLs",
            content: `
        <h4 class="text-white font-bold mb-3">🔬 Caminho de Pesquisa de DLLs no Windows</h4>
        <p class="mb-4 text-gray-300">
          Para entender completamente o erro de DLL faltando, é importante conhecer o processo de busca de DLLs pelo Windows:
        </p>
        
        <div class="bg-gray-800/30 p-4 rounded-lg border border-gray-700 mb-6">
          <ol class="list-decimal text-gray-300 space-y-3 ml-6">
            <li><strong>Aplicativo Solicita:</strong> O programa solicita ao Windows para carregar a DLL api-ms-win-crt-runtime-l1-1-0.dll</li>
            <li><strong>Pesquisa na Pasta do App:</strong> Windows verifica se a DLL está na mesma pasta do executável</li>
            <li><strong>Pesquisa em System32/SysWOW64:</strong> Windows verifica as pastas do sistema onde DLLs são registradas</li>
            <li><strong>Consulta no Registry:</strong> Windows verifica se há caminhos alternativos registrados para a DLL</li>
            <li><strong>Verifica Dependencies:</strong> Windows confirma se todas as dependências da DLL também estão presentes</li>
            <li><strong>Carrega ou Retorna Erro:</strong> Se encontrar a DLL com todas as dependências, carrega; caso contrário, retorna o erro</li>
          </ol>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">🔧 DLL Side-by-Side (WinSxS)</h4>
        <p class="mb-4 text-gray-300">
          O Windows utiliza um sistema chamado Side-by-Side (SxS) para gerenciar múltiplas versões de DLLs:
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-2 mb-4">
          <li><strong>Localização:</strong> DLLs do Universal C Runtime estão localizadas em <code>C:\Windows\System32\winsxs\</code></li>
          <li><strong>Versionamento:</strong> Cada versão do Visual C++ tem seu próprio manifesto e versão única</li>
          <li><strong>Isolamento:</strong> Aplicações usam versões específicas de DLLs sem conflitar com outras</li>
          <li><strong>Manifestos:</strong> Arquivos XML em <code>C:\Windows\WinSxS\Manifests\</code> definem as dependências</li>
        </ul>
        
        <div class="bg-amber-900/10 p-4 rounded-lg border border-amber-500/30">
          <h5 class="text-amber-400 font-bold mb-2">💡 Curiosidade Técnica</h5>
          <p class="text-sm text-gray-300">
            As api-ms-win-crt-* são "stub DLLs" - arquivos pequenos que redirecionam para as DLLs reais do UCRT (Universal C Runtime). Isso permite que a Microsoft atualize os runtimes sem quebrar aplicações existentes.
          </p>
        </div>
      `
        },
        {
            title: "Soluções Alternativas Avançadas",
            content: `
        <h4 class="text-white font-bold mb-3">⚙️ Desinstalação Completa e Reinício do Visual C++</h4>
        <p class="mb-4 text-gray-300">
          Se as soluções normais não funcionarem, pode ser necessário uma limpeza completa:
        </p>
        
        <div class="bg-red-900/10 p-4 rounded-lg border border-red-500/30 mb-6">
          <h5 class="text-red-400 font-bold mb-2">⚠️ AVISO IMPORTANTE</h5>
          <p class="text-sm text-gray-300">
            Esta operação afetará todos os programas que dependem do Visual C++. Certifique-se de ter acesso à internet para reinstalar rapidamente.
          </p>
        </div>
        
        <h5 class="text-white font-bold mb-3">Método 1: Desinstalação Manual Completa</h5>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4 mb-6">
          <li>Acesse <strong>Painel de Controle > Programas > Programas e Recursos</strong></li>
          <li>Filtre por "Microsoft Visual C++"</li>
          <li>Desinstale TODAS as versões (2005, 2008, 2010, 2012, 2013, 2015-2022) tanto x86 quanto x64</li>
          <li>Reinicie o computador</li>
          <li>Execute o comando: <code>dism /online /cleanup-image /restorehealth</code> no Prompt de Comando como Administrador</li>
          <li>Reinstale o Visual C++ All-in-One</li>
        </ol>
        
        <h5 class="text-white font-bold mb-3">Método 2: Script de Limpeza Automática</h5>
        <p class="mb-3 text-gray-300">
          Para usuários avançados, você pode usar um script PowerShell para automatizar a remoção:
        </p>
        <div class="bg-black/30 p-4 rounded font-mono text-xs text-gray-300 mb-4">
          <pre>
# Script de limpeza do Visual C++
Get-WmiObject -Class Win32_Product | Where-Object {$_.Name -like "*Visual C++*"} | ForEach-Object { $_.Uninstall() }
# Reiniciar o computador
Restart-Computer
          </pre>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">🔧 Solução com DISM e SFC Combinados</h4>
        <p class="mb-4 text-gray-300">
          Para corrigir problemas mais profundos no sistema, combine DISM e SFC:
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4">
          <li>Abra Prompt de Comando como Administrador</li>
          <li>Execute: <code>dism /online /cleanup-image /scanhealth</code></li>
          <li>Execute: <code>dism /online /cleanup-image /restorehealth</code></li>
          <li>Execute: <code>sfc /scannow</code></li>
          <li>Reinicie o computador</li>
          <li>Reinstale o Visual C++ Redistributable</li>
        </ol>
      `
        },
        {
            title: "Prevenção e Manutenção Preventiva",
            content: `
        <h4 class="text-white font-bold mb-3">🛡️ Estratégias de Prevenção</h4>
        <p class="mb-4 text-gray-300">
          Para evitar problemas com DLLs no futuro, siga estas práticas recomendadas:
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div class="bg-emerald-900/10 p-4 rounded-lg border border-emerald-500/30">
            <h5 class="text-emerald-400 font-bold mb-2">✅ Boas Práticas</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>Manter Windows Update sempre ativo</li>
              <li>Instalar pacotes Visual C++ durante a pós-instalação</li>
              <li>Evitar programas de limpeza agressivos</li>
              <li>Realizar backups regulares do sistema</li>
            </ul>
          </div>
          
          <div class="bg-rose-900/10 p-4 rounded-lg border border-rose-500/30">
            <h5 class="text-rose-400 font-bold mb-2">❌ Práticas a Evitar</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>Modificar arquivos do sistema manualmente</li>
              <li>Usar ferramentas de limpeza de DLL não confiáveis</li>
              <li>Desinstalar componentes do sistema</li>
              <li>Ignorar atualizações críticas</li>
            </ul>
          </div>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">🔄 Check-list de Pós-Instalação do Windows</h4>
        <p class="mb-4 text-gray-300">
          Sempre que reinstalar o Windows, siga esta ordem para evitar problemas de DLL:
        </p>
        
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-gray-300 border border-gray-700 rounded-lg">
            <thead class="bg-gray-800">
              <tr>
                <th class="p-3 text-left">Etapa</th>
                <th class="p-3 text-left">Componente</th>
                <th class="p-3 text-left">Importância</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-t border-gray-700">
                <td class="p-3">1</td>
                <td class="p-3">Atualizações do Windows</td>
                <td class="p-3 text-emerald-400">Essencial</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3">2</td>
                <td class="p-3">Visual C++ Redistributable 2015-2022</td>
                <td class="p-3 text-emerald-400">Essencial</td>
              </tr>
              <tr class="border-t border-gray-700">
                <td class="p-3">3</td>
                <td class="p-3">DirectX End-User Runtime</td>
                <td class="p-3 text-amber-400">Importante</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3">4</td>
                <td class="p-3">.NET Framework 4.8</td>
                <td class="p-3 text-amber-400">Importante</td>
              </tr>
              <tr class="border-t border-gray-700">
                <td class="p-3">5</td>
                <td class="p-3">Visual C++ versões antigas (opcional)</td>
                <td class="p-3 text-gray-300">Baixa</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="bg-blue-900/10 p-4 rounded-lg border border-blue-500/30 mt-6">
          <h5 class="text-blue-400 font-bold mb-2">💡 Dica Pro</h5>
          <p class="text-sm text-gray-300">
            Considere usar ferramentas como Ninite ou Chocolatey para instalar todos os pacotes essenciais de uma vez após a reinstalação do Windows.
          </p>
        </div>
      `
        }
    ];

    const faqItems = [
        {
            question: "Instalei o Visual C++ mas o erro continua. O que fazer?",
            answer: "Verifique se você instalou AMBAS as versões (x86 E x64). Muitas pessoas instalam apenas x64 e o erro persiste porque o programa é 32-bit. Desinstale todas as versões do Visual C++, reinicie o PC, e reinstale usando o All-in-One Installer (instala TUDO de uma vez)."
        },
        {
            question: "O erro é diferente: 'api-ms-win-crt-heap-l1-1-0.dll faltando'. É o mesmo problema?",
            answer: "SIM! Todos os erros de DLL começando com 'api-ms-win-crt-' (runtime, heap, stdio, string, etc) são causados pela FALTA do Universal C Runtime. A solução é a mesma: instalar Visual C++ Redistributable 2015-2022 (x86 e x64)."
        },
        {
            question: "Posso copiar a DLL de outro PC e colar no meu?",
            answer: "TECNICAMENTE sim, mas É ARRISCADO e NÃO RECOMENDADO. A DLL pode ter dependências de outras DLLs que também faltam no seu sistema. Além disso, a DLL do outro PC pode ser de uma versão diferente. Sempre prefira instalar o Visual C++ completo (que traz TODAS as DLLs necessárias e suas dependências)."
        },
        {
            question: "Meu antivírus bloqueou o instalador do Visual C++. É seguro?",
            answer: "Se você baixou do site OFICIAL da Microsoft ou TechPowerUp, é 100% SEGURO. Alguns antivírus bloqueiam instaladores porque eles modificam arquivos do sistema (comportamento 'suspeito'). Adicione uma exceção temporária no antivírus para instalar. NUNCA desabilite o antivírus permanentemente!"
        },
        {
            question: "Preciso ter TODAS as versões do Visual C++ instaladas (2005, 2008, 2010...)?",
            answer: "Depende dos programas que você usa. Visual C++ 2015-2022 (a versão que contém api-ms-win-crt) é ESSENCIAL. Versões antigas (2005, 2008, 2010, 2012, 2013) são necessárias apenas se você rodar jogos/programas MUITO antigos. O instalador All-in-One já instala TODAS as versões automaticamente (recomendado)."
        },
        {
            question: "O erro apareceu após atualizar o Windows. Por quê?",
            answer: "Raramente, uma atualização do Windows pode CORROMPER ou SUBSTITUIR DLLs do Visual C++. Solução: Desinstale o Visual C++ 2015-2022 (ambas as versões), reinicie o PC, e reinstale do zero. Isso força o Windows a registrar as DLLs corretamente novamente."
        },
        {
            question: "Tenho Windows 7 e não consigo instalar a atualização KB2999226. O que fazer?",
            answer: "O Windows 7 PAROU de receber suporte oficial da Microsoft em 2020. Atualizações como KB2999226 podem não estar mais disponíveis via Windows Update. Solução: Baixe o KB2999226 manualmente do Microsoft Update Catalog (catalog.update.microsoft.com), instale, e depois instale o Visual C++. ATENÇÃO: Considere URGENTEMENTE atualizar para Windows 10 ou 11 por questões de segurança!"
        },
        {
            question: "O erro aparece apenas em UM programa específico. Preciso instalar Visual C++ mesmo assim?",
            answer: "SIM! Se o erro aparece em um programa, significa que o Visual C++ NÃO ESTÁ instalado corretamente no seu sistema. Mesmo que outros programas funcionem (porque não dependem dessa DLL específica), você PRECISA instalar o Visual C++ para resolver. Depois, TODOS os programas que precisarem dessa DLL funcionarão."
        },
        {
            question: "Instalei e reiniciei, mas o erro mudou para 'vcruntime140.dll faltando'. O que fazer?",
            answer: "Isso significa que você instalou APENAS a versão x64 ou x86 (faltou a outra). vcruntime140.dll faz parte do MESMO pacote Visual C++ 2015-2022. Volte e instale a versão que está faltando (se instalou x64, instale x86 agora, ou vice-versa). Use o All-in-One Installer para garantir que TUDO seja instalado."
        },
        {
            question: "Posso desinstalar versões antigas do Visual C++ para liberar espaço?",
            answer: "NÃO RECOMENDADO! Cada versão do Visual C++ ocupa apenas 20-50 MB. Desinstalar versões antigas pode fazer jogos/programas legados pararem de funcionar. O 'ganho' de espaço é insignificante (total ~200-300 MB para TODAS as versões). Só desinstale se você TEM CERTEZA que nenhum programa precisa daquela versão específica."
        },
        {
            question: "O erro aparece ao abrir um jogo pirata. A solução é a mesma?",
            answer: "SIM, a solução técnica é a mesma (instalar Visual C++). Porém, jogos piratas freqüentemente têm DLLs MODIFICADAS ou CRACKEADAS que podem conflitar com as DLLs originais do sistema. Além disso, jogos piratas podem conter MALWARE. Recomendação: Compre jogos oficialmente (Steam, Epic, GOG) - preços estão acessíveis em 2026 com promoções constantes."
        },
        {
            question: "Depois de instalar, o Windows diz que o Visual C++ já está instalado e pula a instalação. Como forçar reinstalação?",
            answer: "Vá em Painel de Controle → Programas e Recursos → Encontre 'Microsoft Visual C++ 2015-2022 Redistributable' → Clique DIREITO → 'Alterar' → 'Reparar'. Isso força o Windows a verificar e reinstalar DLLs faltando ou corrompidas sem precisar desinstalar."
        },
        {
            question: "O que é o sistema WinSxS e como ele afeta as DLLs?",
            answer: "WinSxS (Windows Side-by-Side) é o sistema do Windows que gerencia múltiplas versões de DLLs e componentes. Ele permite que diferentes programas usem versões específicas de DLLs sem conflitar entre si. As DLLs do Universal C Runtime são armazenadas em C:\Windows\WinSxS\ com manifestos XML que definem dependências e versões. Este sistema ajuda a evitar o 'DLL Hell' mas também significa que não se deve modificar manualmente esses arquivos."
        },
        {
            question: "Como posso verificar se as DLLs do Visual C++ estão corretamente registradas?",
            answer: "Você pode usar o comando 'sfc /scannow' para verificar integridade das DLLs do sistema. Também pode verificar no Regedit em HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\VisualStudio\\14.0\\VC\\Runtimes\\ para ver se as entradas estão corretas. Outra opção é usar ferramentas como o Dependency Walker para analisar as dependências de um executável específico."
        },
        {
            question: "Por que o erro de DLL pode aparecer mesmo após reinstalar o Visual C++?",
            answer: "Isso pode acontecer por várias razões: 1) O cache do Windows pode ainda apontar para DLLs antigas; 2) Outros componentes do sistema podem estar corrompidos; 3) O programa específico pode ter suas próprias cópias corrompidas de DLLs; 4) Pode haver conflitos com DLLs de outras versões. Soluções incluem reiniciar o serviço de carregamento de DLLs ou usar 'sfc /scannow' após a reinstalação."
        },
        {
            question: "Como posso automatizar a instalação do Visual C++ em múltiplos computadores?",
            answer: "Para ambientes corporativos, você pode usar o instalador silencioso com comutadores: vc_redist.x64.exe /quiet /norestart. Também pode usar ferramentas de gerenciamento como o SCCM, Group Policy, ou scripts PowerShell para implantar em larga escala. O All-in-One installer também pode ser automatizado com os mesmos parâmetros."
        }
    ];

    const externalReferences = [
        { name: "Microsoft Visual C++ Downloads", url: "https://learn.microsoft.com/cpp/windows/latest-supported-vc-redist" },
        { name: "KB2999226 - Update for Universal C Runtime", url: "https://support.microsoft.com/help/2999226" },
        { name: "TechPowerUp - Visual C++ All-in-One", url: "https://www.techpowerup.com/download/visual-c-redistributable-runtime-package-all-in-one/" },
        { name: "Microsoft Docs - Universal CRT", url: "https://docs.microsoft.com/en-us/cpp/windows/universal-crt-deployment" },
        { name: "Windows SxS Architecture", url: "https://docs.microsoft.com/en-us/windows/win32/sbscs/about-side-by-side-assemblies-" },
        { name: "Dependency Walker Tool", url: "http://www.dependencywalker.com/" }
    ];

    const relatedGuides = [
        {
            href: "/guias/corrigir-dll-faltando-vcredist-directx",
            title: "Guia de Runtimes",
            description: "Checklist completo de componentes base."
        },
        {
            href: "/guias/pos-instalacao-windows-11",
            title: "Pós-Instalação",
            description: "O que instalar para não ter erros de DLL."
        },
        {
            href: "/guias/erro-0xc00007b-aplicativo-nao-inicializou",
            title: "Erro 0xc00007b",
            description: "Outro erro comum ligado a C++."
        },
        {
            href: "/guias/vcruntime140-dll-nao-encontrado",
            title: "Runtime C++",
            description: "Outro erro comum de runtime faltando."
        },
        {
            href: "/guias/windows-update-corrigir-erros",
            title: "Atualizações do Windows",
            description: "Corrija problemas com Windows Update."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="30 min"
            difficultyLevel="Intermediário"
            author="Equipe Técnica Voltris"
            lastUpdated="2026-01-20"
            contentSections={contentSections}
            summaryTable={summaryTable}
            faqItems={faqItems}
            externalReferences={externalReferences}
            relatedGuides={relatedGuides}
        />
    );
}
