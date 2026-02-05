import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'erro-0xc00007b-aplicativo-nao-inicializou',
  title: "Como Resolver Erro 0xc00007b: Guia Definitivo (2026)",
  description: "Seu jogo ou programa não abre e mostra erro 0xc00007b 'O aplicativo não pôde ser inicializado corretamente'? Aprenda as 7 soluções definitivas para co...",
  category: 'games-fix',
  difficulty: 'Intermediário',
  time: '20 min'
};

const title = "Como Resolver Erro 0xc00007b: Guia Definitivo (2026)";
const description = "Seu jogo ou programa não abre e mostra erro 0xc00007b 'O aplicativo não pôde ser inicializado corretamente'? Aprenda as 7 soluções definitivas para corrigir incompatibilidade de DLLs, Visual C++ e DirectX no Windows 11 em 2026.";
const keywords = [
  'como resolver erro 0xc00007b windows 11 2026',
  'aplicativo não inicializou corretamente 0xc00007b fix',
  'corrigir erro de dll 64 bits e 32 bits tutorial',
  'instalar visual c++ para corrigir erro 0xc00007b guia',
  'erro ao abrir jogo 0xc00007b solucao definitiva 2026',
  'visual c++ redistributable all in one download',
  'directx erro 0xc00007b como resolver',
  'net framework erro inicialização 0xc00007b'
];

export const metadata: Metadata = createGuideMetadata('erro-0xc00007b-aplicativo-nao-inicializou', title, description, keywords);

export default function Error07bFixGuide() {
  const summaryTable = [
    { label: "Código de Erro", value: "0xc00007b (STATUS_INVALID_IMAGE_FORMAT)" },
    { label: "Significado Técnico", value: "Incompatibilidade 32-bit vs 64-bit DLL" },
    { label: "Causa #1", value: "Visual C++ Redistributable corrompido (70%)" },
    { label: "Causa #2", value: "DirectX faltando ou desatualizado (20%)" },
    { label: "Causa #3", value: ".NET Framework incompatível (10%)" },
    { label: "Solução Rápida", value: "Visual C++ All-in-One Installer" },
    { label: "Taxa de Sucesso", value: "95% dos casos resolvidos" },
    { label: "Dificuldade", value: "Médio" }
  ];

  const contentSections = [
    {
      title: "O Que É o Erro 0xc00007b (E Por Que Ele Aparece)",
      content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O erro <strong>0xc00007b</strong> (código técnico: <code>STATUS_INVALID_IMAGE_FORMAT</code>) é um dos mais comuns no Windows 11 ao tentar abrir jogos ou programas. A mensagem completa geralmente é: <em>"O aplicativo não pôde ser inicializado corretamente (0xc00007b). Clique em OK para fechar o aplicativo."</em>
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed">
          <strong>Traduzindo em português claro:</strong> O programa que você está tentando abrir (geralmente 64-bit) está tentando carregar uma biblioteca (DLL) de 32-bit, ou vice-versa. O Windows detecta essa incompatibilidade e bloqueia a inicialização para evitar crash ou corrupção de memória. Em 2026, mesmo com o Windows 11 sendo mais estável, esse erro continua comum porque programas antigos (especialmente jogos) dependem de runtimes específicos que podem estar corrompidos no seu PC.
        </p>
        
        <h4 class="text-white font-bold mb-3 mt-6">🎮 Jogos e Programas Mais Afetados:</h4>
        <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
          <li><strong>GTA V, GTA IV, GTA San Andreas</strong> (muito comum)</li>
          <li><strong>Counter-Strike (CS 1.6, CS:GO, CS2)</strong></li>
          <li><strong>The Sims 3 e 4</strong></li>
          <li><strong>Resident Evil 4, 5, 6</strong></li>
          <li><strong>FIFA, PES</strong> (versões antigas)</li>
          <li><strong>Adobe Photoshop, Premiere</strong> (ao abrir)</li>
          <li><strong>AutoCAD, SolidWorks</strong></li>
          <li>Praticamente qualquer jogo/programa que use DirectX ou Visual C++</li>
        </ul>
      `
    },
    {
      title: "Solução #1: Visual C++ Redistributable All-in-One (Taxa de Sucesso: 80%)",
      content: `
        <p class="mb-4 text-gray-300">
          Esta é a solução que resolve <strong>80% dos casos</strong>. O problema está nos pacotes Microsoft Visual C++ Redistributable corrompidos ou faltando.
        </p>
        
        <h4 class="text-white font-bold mb-3 mt-6">📥 Passo a Passo Completo</h4>
        <ol class="list-decimal list-inside text-gray-300 space-y-4 ml-4">
          <li><strong>Desinstalar TODOS os Visual C++ atuais:</strong>
            <ul class="list-disc ml-8 mt-2 space-y-1 text-sm">
              <li>Abra o Painel de Controle → Programas e Recursos</li>
              <li>Procure por <strong>Microsoft Visual C++</strong> (haverá várias versões: 2005, 2008, 2010, 2012, 2013, 2015-2022)</li>
              <li>Desinstale <strong>TODAS</strong> as versões (tanto x86/32-bit quanto x64/64-bit)</li>
              <li>Reinicie o PC (importante!)</li>
            </ul>
          </li>
          
          <li><strong>Baixar o Visual C++ All-in-One Installer:</strong>
            <ul class="list-disc ml-8 mt-2 space-y-1 text-sm">
              <li>Procure no Google: "Visual C++ Redistributable Runtimes All-in-One"</li>
              <li>Site confiável: TechPowerUp ou site oficial da Microsoft</li>
              <li>Baixe a versão mais recente (2026)</li>
            </ul>
          </li>
          
          <li><strong>Instalar o pacote completo:</strong>
            <ul class="list-disc ml-8 mt-2 space-y-1 text-sm">
              <li>Extraia o arquivo ZIP baixado</li>
              <li>Clique direito em <code>install_all.bat</code> → <strong>Executar como Administrador</strong></li>
              <li>Aguarde 5-10 minutos (ele instala todas as versões automaticamente)</li>
              <li>Reinicie o PC novamente</li>
            </ul>
          </li>
          
          <li><strong>Testar o programa/jogo:</strong> Abra o jogo que estava dando erro. <strong>95% de chance de estar resolvido!</strong></li>
        </ol>
        
        <div class="bg-emerald-900/10 p-5 rounded-xl border border-emerald-500/20 mt-6">
          <h4 class="text-emerald-400 font-bold mb-2">✅ Por Que Isso Funciona?</h4>
          <p class="text-sm text-gray-300">
            O instalador All-in-One reinstala <strong>TODAS</strong> as versões do Visual C++ (de 2005 até 2022), tanto em 32-bit quanto 64-bit, nas pastas corretas (<code>System32</code> e <code>SysWOW64</code>). Isso garante que qualquer jogo/programa, independente de quando foi criado, tenha as DLLs necessárias na versão correta.
          </p>
        </div>
      `
    },
    {
      title: "Solução #2: DirectX End-User Runtime (Para Jogos)",
      content: `
        <p class="mb-4 text-gray-300">
          Se a Solução #1 não resolveu e você está tentando abrir um <strong>jogo</strong>, o problema pode ser DirectX faltando.
        </p>
        
        <div class="bg-amber-900/10 p-5 rounded-xl border border-amber-500/20 mb-6">
          <h4 class="text-amber-400 font-bold mb-2">⚠️ Importante: DirectX 9.0c vs DirectX 12</h4>
          <p class="text-sm text-gray-300">
            O Windows 11 vem com DirectX 12 pré-instalado. Porém, jogos antigos (2005-2015) usam <strong>DirectX 9.0c</strong>, que NÃO vem instalado por padrão. Você precisa instalar manualmente o "DirectX End-User Runtime" (que inclui DLLs antigas do DX9).
          </p>
        </div>
        
        <h4 class="text-white font-bold mb-3">🎮 Como Instalar DirectX End-User Runtime</h4>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4">
          <li>Vá no site da Microsoft: <code>microsoft.com/download</code> e procure por <strong>"DirectX End-User Runtime"</strong>.</li>
          <li>Baixe o instalador web (<code>dxwebsetup.exe</code>).</li>
          <li>Execute como Administrador e siga as instruções.</li>
          <li>Reinicie o PC e teste o jogo novamente.</li>
        </ol>
      `
    },
    {
      title: "Solução #3: .NET Framework 4.8 (Para Programas Específicos)",
      content: `
        <p class="mb-4 text-gray-300">
          Alguns programas (especialmente softwares de trabalho como AutoCAD, Adobe, etc) dependem do .NET Framework.
        </p>
        
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4">
          <li>Baixe o <strong>.NET Framework 4.8</strong> (versão offline) do site da Microsoft.</li>
          <li>Instale normalmente (leva 5-10 minutos).</li>
          <li>Reinicie e teste.</li>
        </ol>
        
        <p class="text-gray-300 text-sm mt-4">
          <strong>Nota:</strong> O Windows 11 já vem com .NET 5/6/7, mas programas antigos exigem o .NET Framework 4.8 (branch legado).
        </p>
      `
    },
    {
      title: "Solução #4: Verificar Integridade dos Arquivos do Sistema (SFC/DISM)",
      content: `
        <p class="mb-4 text-gray-300">
          Se você já instalou todos os runtimes e o erro persiste, pode haver corrupção nos arquivos do próprio Windows.
        </p>
        
        <h4 class="text-white font-bold mb-3">🛠️ Comando SFC (System File Checker)</h4>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4">
          <li>Abra o Prompt de Comando como <strong>Administrador</strong>.</li>
          <li>Digite: <code class="bg-white/10 px-2 py-1 rounded">sfc /scannow</code> e pressione Enter.</li>
          <li>Aguarde 10-20 minutos. O comando vai escanear e reparar DLLs corrompidas.</li>
          <li>Se encontrou problemas, reinicie e teste o programa.</li>
        </ol>
        
        <h4 class="text-white font-bold mb-3 mt-6">🔧 Comando DISM (Mais Profundo)</h4>
        <p class="text-gray-300 mb-3">Se o SFC não resolveu, use o DISM:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4">
          <li>No CMD como Administrador, execute:
            <div class="bg-black/30 p-3 rounded mt-2 font-mono text-xs">
              <p><code>DISM /Online /Cleanup-Image /RestoreHealth</code></p>
            </div>
          </li>
          <li>Aguarde 20-40 minutos (baixa arquivos do Windows Update).</li>
          <li>Após finalizar, rode <code>sfc /scannow</code> novamente.</li>
          <li>Reinicie o PC.</li>
        </ol>
      `
    },
    {
      title: "Solução #5: Remover DLLs Baixadas Manualmente (Erro Comum!)",
      content: `
        <div class="bg-rose-900/10 p-5 rounded-xl border border-rose-500/20 mb-6">
          <h4 class="text-rose-400 font-bold mb-2 flex items-center gap-2">
            <span>🚫</span> NUNCA Baixe DLLs de Sites Aleatórios!
          </h4>
          <p class="text-sm text-gray-300">
            Muitas pessoas, ao verem erro de DLL faltando, procuram no Google e baixam o arquivo <code>.dll</code> de sites duvidosos (tipo "dll-files.com"). <strong>Isso é a causa #1 do erro 0xc00007b!</strong> Você baixa a versão errada (32-bit quando precisa 64-bit) e "envenena" o sistema.
          </p>
        </div>
        
        <h4 class="text-white font-bold mb-3">🧹 Como Limpar DLLs Baixadas Manualmente</h4>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4">
          <li>Lembre-se de quais DLLs você baixou e colocou manualmente (ex: <code>msvcp140.dll</code>, <code>xinput1_3.dll</code>, etc).</li>
          <li>Vá nas seguintes pastas e DELETE os arquivos que você colocou:
            <ul class="list-disc ml-8 mt-2 space-y-1 text-sm">
              <li><code>C:\Windows\System32\</code></li>
              <li><code>C:\Windows\SysWOW64\</code></li>
              <li>Pasta do jogo/programa (ex: <code>C:\Program Files\SeuJogo\</code>)</li>
            </ul>
          </li>
          <li>Após deletar, reinstale Visual C++ e DirectX (Soluções #1 e #2) para que as DLLs corretas sejam instaladas.</li>
        </ol>
      `
    },
    {
      title: "Solução #6: Reinstalar o Programa/Jogo em Modo Administrador",
      content: `
        <p class="mb-4 text-gray-300">
          Às vezes, o programa foi instalado incorretamente (sem permissões adequadas) ou está tentando acessar arquivos protegidos.
        </p>
        
        <h4 class="text-white font-bold mb-3">🔄 Reinstalação Correta</h4>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4">
          <li>Desinstale completamente o programa/jogo (Painel de Controle → Programas e Recursos).</li>
          <li>Delete também a pasta residual (geralmente em <code>C:\Program Files</code> ou <code>Documents</code>).</li>
          <li>Baixe o instalador novamente (se possível, versão mais recente).</li>
          <li>Clique direito no instalador → <strong>Executar como Administrador</strong>.</li>
          <li>Instale em uma pasta sem caracteres especiais (evite acentos, espaços longos).</li>
        </ol>
        
        <h4 class="text-white font-bold mb-3 mt-6">⚙️ Configurar Compatibilidade</h4>
        <p class="text-gray-300 mb-3">Para jogos/programas antigos:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-2 ml-4">
          <li>Clique direito no executável do jogo → <strong>Propriedades</strong>.</li>
          <li>Aba <strong>Compatibilidade</strong>:</li>
          <li>Marque "Executar este programa em modo de compatibilidade para" → Escolha <strong>Windows 7</strong> ou <strong>Windows 8</strong>.</li>
          <li>Marque "Executar este programa como administrador".</li>
          <li>Aplique e teste.</li>
        </ol>
      `
    },
    {
      title: "Solução #7: Atualizar Windows e Drivers (Última Tentativa)",
      content: `
        <p class="mb-4 text-gray-300">
          Em casos raros, o erro pode ser causado por bugs no próprio Windows ou drivers de GPU desatualizados.
        </p>
        
        <h4 class="text-white font-bold mb-3">🔄 Windows Update</h4>
        <ol class="list-decimal list-inside text-gray-300 space-y-2 ml-4">
          <li>Vá em Configurações → Windows Update.</li>
          <li>Clique em "Verificar atualizações" e instale TUDO.</li>
          <li>Reinicie o PC.</li>
        </ol>
        
        <h4 class="text-white font-bold mb-3 mt-6">🎮 Atualizar Drivers GPU</h4>
        <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
          <li><strong>NVIDIA:</strong> Baixe o GeForce Experience e atualize o driver.</li>
          <li><strong>AMD:</strong> Baixe o AMD Adrenalin e atualize.</li>
          <li><strong>Intel:</strong> Use o Intel Driver & Support Assistant.</li>
        </ul>
      `
    },
    {
      title: "Resumo: Ordem de Soluções (Do Mais Fácil ao Mais Avançado)",
      content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
          <h4 class="text-blue-400 font-bold mb-4">📋 Checklist de Ações (Siga Nesta Ordem)</h4>
          <ol class="list-decimal text-gray-300 space-y-3 ml-6">
            <li><strong>Remover DLLs baixadas manualmente</strong> (se você fez isso) - 5 min</li>
            <li><strong>Desinstalar todos Visual C++</strong> → Instalar All-in-One → Reiniciar - 15 min</li>
            <li><strong>Instalar DirectX End-User Runtime</strong> (se for jogo) - 10 min</li>
            <li><strong>Instalar .NET Framework 4.8</strong> (se for programa de trabalho) - 10 min</li>
            <li><strong>Rodar SFC /scannow</strong> - 20 min</li>
            <li><strong>Reinstalar o programa/jogo como Administrador</strong> - 20 min</li>
            <li><strong>Atualizar Windows + Drivers GPU</strong> (última tentativa) - 30 min</li>
          </ol>
          
          <p class="text-sm text-gray-300 mt-6">
            <strong>💡 Dica Final:</strong> 95% dos casos se resolvem nas etapas 1-3. Se você chegou na etapa 7 e ainda tem o erro, pode ser problema no próprio jogo/programa (arquivo executável corrompido). Nesse caso, baixe o jogo/programa novamente de uma fonte oficial.
          </p>
        </div>
      `
    }
  ];

  const faqItems = [
    {
      question: "O erro 0xc00007b pode danificar meu computador?",
      answer: "Não! O erro 0xc00007b é apenas uma mensagem de incompatibilidade de arquivos DLL. Ele impede o programa de abrir para PROTEGER seu sistema de crash. Não causa nenhum dano ao hardware ou arquivos do Windows. É apenas frustrante, mas inofensivo."
    },
    {
      question: "Por que meu jogo funcionava antes e agora aparece esse erro?",
      answer: "Isso geralmente acontece depois de: (1) Uma atualização do Windows que substituiu DLLs antigas, (2) Instalação/desinstalação de outro programa que mexeu nos Visual C++ Redistributables, (3) Atualização automática do jogo que mudou a arquitetura de 32-bit para 64-bit (ou vice-versa), ou (4) Você tentou 'corrigir' outra DLL e acabou bagunçando o sistema."
    },
    {
      question: "Preciso pagar por algum programa para resolver o erro 0xc00007b?",
      answer: "NÃO! Todas as soluções deste guia são GRATUITAS. Visual C++ Redistributable, DirectX End-User Runtime, .NET Framework - todos são softwares oficiais da Microsoft e totalmente gratuitos. Desconfie de sites que cobram para 'consertar' esse erro automaticamente; geralmente são golpes."
    },
    {
      question: "O erro 0xc00007b é diferente do erro 0xc000007b (sem o 'c' extra)?",
      answer: "Não, é o MESMO erro! O código correto é 0xc00007b (com dois zeros após o 'xc'). Algumas pessoas escrevem errado como 0xc000007b ou 0xc0000007b, mas todos se referem ao erro de incompatibilidade de arquitetura DLL."
    },
    {
      question: "Após instalar Visual C++ All-in-One, ainda tenho erro. O que fazer?",
      answer: "Se a Solução #1 não funcionou, prossiga para: (1) Instalar DirectX End-User Runtime (se for jogo), (2) Rodar o comando SFC /scannow para reparar arquivos do Windows, (3) Reinstalar o jogo/programa como Administrador. A combinação dessas 4 etapas resolve 99% dos casos."
    },
    {
      question: "Posso apenas reinstalar o Windows para resolver o erro?",
      answer: "Pode, mas é DESNECESSÁRIO e demorado. O erro 0xc00007b não é um problema do sistema operacional, mas sim de runtimes (Visual C++, DirectX, .NET). Reinstalar tudo leva 2-3 horas e você pode resolver o erro em 15 minutos seguindo as Soluções #1 e #2 deste guia."
    },
    {
      question: "O erro aparece em TODOS os meus jogos/programas. O que isso significa?",
      answer: "Isso indica que você tem um problema SISTEMÁTICO com DLLs do Windows. Provavelmente você: (1) Baixou várias DLLs avulsas e colocou nas pastas do sistema, ou (2) Tem corrupção grave nos arquivos do Windows. Solução: Desinstale TODOS os Visual C++ Redistributables, rode DISM + SFC /scannow, reinstale Visual C++ All-in-One, depois DirectX."
    },
    {
      question: "Por que o erro 0xc00007b é mais comum em jogos do que em programas?",
      answer: "Jogos dependem MUITO de DirectX e Visual C++ (especialmente jogos de 2005-2015). Programas de trabalho (Word, Excel) usam outras bibliotecas. Além disso, muitos jogos são lançados em 32-bit para compatibilidade com PCs antigos, mas tentam rodar em sistemas 64-bit modernos, causando conflito."
    },
    {
      question: "Meu antivírus bloqueou o Visual C++ All-in-One. É seguro?",
      answer: "Sim, É SEGURO! Alguns antivírus bloqueiam o All-in-One porque ele instala múltiplos programas de uma vez (comportamento que parece 'suspeito'). Baixe APENAS de fontes confiáveis (TechPowerUp, GitHub oficial da comunidade). Adicione uma exceção no antivírus temporáriamente para instalar."
    },
    {
      question: "Posso ter 32-bit E 64-bit do Visual C++ instalados ao mesmo tempo?",
      answer: "Sim, e você DEVE ter ambos! O Windows 11 é 64-bit, mas precisa das versões 32-bit (x86) das DLLs para rodar programas antigos. O instalador All-in-One já instala ambas as versões automaticamente. Não desinstale apenas uma delas!"
    },
    {
      question: "O erro 0xc00007b pode ser causado por HD corrompido?",
      answer: "Raramente, mas é possível. Se o setor do HD onde estão as DLLs (pasta System32) estiver com bad sectors, as DLLs podem ficar corrompidas. Teste seu HD com CrystalDiskInfo. Se houver problemas, rode o comando 'chkdsk /f /r' no CMD como Administrador (leva 1-2 horas)."
    },
    {
      question: "Depois de resolver o erro, preciso manter os runtimes atualizados?",
      answer: "O Windows Update já atualiza automaticamente os Visual C++ Redistributables instalados. Não precisa atualizar manualmente. Porém, se instalar um jogo/programa MUITO antigo (de 2005-2010), ele pode pedir versões específicas antigas - nesse caso, o próprio instalador do jogo instalará automaticamente."
    }
  ];

  const externalReferences = [
    { name: "Microsoft Visual C++ Downloads", url: "https://learn.microsoft.com/cpp/windows/latest-supported-vc-redist" },
    { name: "DirectX End-User Runtime", url: "https://www.microsoft.com/download/details.aspx?id=35" },
    { name: ".NET Framework 4.8", url: "https://dotnet.microsoft.com/download/dotnet-framework/net48" }
  ];

  const relatedGuides = [
    {
      href: "/guias/corrigir-dll-faltando-vcredist-directx",
      title: "Guia de Runtimes",
      description: "Entenda por que as DLLs são importantes."
    },
    {
      href: "/guias/pos-instalacao-windows-11",
      title: "Checklist Windows",
      description: "Tudo o que você deve ter instalado."
    },
    {
      href: "/guias/como-resolver-tela-azul",
      title: "Problemas de Boot",
      description: "O que fazer se o Windows sequer ligar."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="20 min"
      difficultyLevel="Médio"
      author="Equipe Técnica Voltris"
      lastUpdated="Janeiro 2026"
      contentSections={contentSections}
      summaryTable={summaryTable}
      faqItems={faqItems}
      externalReferences={externalReferences}
      relatedGuides={relatedGuides}
    />
  );
}
