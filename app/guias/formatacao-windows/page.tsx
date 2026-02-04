import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Como Formatar o Windows 11: Guia Completo Passo a Passo (2026)";
const description = "Seu PC está lento, travando ou com vírus? Aprenda como formatar o Windows 11 do zero com instalação limpa via pendrive, particionamento correto e configuração pós-instalação para máxima performance em 2026.";
const keywords = [
  'como formatar windows 11 passo a passo 2026',
  'formatação limpa windows 11 tutorial completo',
  'instalar windows 11 pelo pendrive bootavel guia',
  'formatar pc e apagar tudo windows 11 em 2026',
  'tutorial de instalacao windows 11 uefi gpt 2026',
  'criar pendrive bootavel windows 11 rufus',
  'particionar disco para windows 11 tutorial',
  'ativacao windows 11 apos formatacao'
];

export const metadata: Metadata = createGuideMetadata('formatacao-windows', title, description, keywords);

export default function FormatWindowsGuide() {
  const summaryTable = [
    { label: "Backup Obrigatório", value: "Arquivos pessoais + Chave de Ativação" },
    { label: "Hardware Necessário", value: "Pendrive 8GB+ (será apagado)" },
    { label: "Software", value: "Rufus 4.0+ ou Media Creation Tool" },
    { label: "Requisitos PC", value: "TPM 2.0 + Secure Boot (Windows 11)" },
    { label: "Tempo Total", value: "30-60 min (instalação + drivers)" },
    { label: "Download Windows", value: "~6GB (ISO oficial da Microsoft)" },
    { label: "Dificuldade", value: "Intermediário" }
  ];

  const contentSections = [
    {
      title: "Quando Formatar o Windows 11? (Saiba Se É Necessário)",
      content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Formatar o Windows é a solução definitiva quando nenhuma otimização funciona mais. Porém, <strong>não é sempre necessário</strong>. Antes de formatar (processo que leva 1-2 horas contando backup e reinstalação de programas), tente soluções menos drásticas.
        </p>
        
        <h4 class="text-white font-bold mb-3 mt-6">✅ Quando Formatar É a Melhor Opção:</h4>
        <ul class="list-disc list-inside text-gray-300 space-y-3 ml-4">
          <li><strong>Vírus persistente:</strong> Malware que antivírus não consegue remover (especialmente rootkits).</li>
          <li><strong>Windows corrompido:</strong> Tela azul constante, arquivos de sistema faltando mesmo após <code>sfc /scannow</code> e <code>DISM</code>.</li>
          <li><strong>Lentidão extrema:</strong> PC demora 5+ minutos pra ligar e trava constantemente mesmo sem programas abertos.</li>
          <li><strong>Migração de HD para SSD:</strong> Instalação limpa é melhor que clonar (evita arrastar problemas do HD antigo).</li>
          <li><strong>PC usado/segunda mão:</strong> Nunca confie no Windows de outra pessoa—pode ter spyware ou configurações problemáticas.</li>
          <li><strong>Sensação de \"PC novo\":</strong> Depois de anos, uma instalação limpa realmente dá uma nova vida ao sistema.</li>
        </ul>
        
        <h4 class="text-white font-bold mb-3 mt-6">❌ Quando NÃO Precisa Formatar (Tente Antes):</h4>
        <ul class="list-disc list-inside text-gray-300 space-y-3 ml-4">
          <li><strong>PC lento após atualização:</strong> Desinstale a atualização problemática antes (Configurações → Windows Update → Histórico).</li>
          <li><strong>Disco 100%:</strong> Desative SysMain e Superfetch (serviços que travam HDs antigos).</li>
          <li><strong>Programas abrindo devagar:</strong> Faça limpeza de disco, desinstale bloatware, otimize inicialização.</li>
          <li><strong>Erro específico de programa:</strong> Reinstale apenas o programa problemático, não o Windows inteiro.</li>
        </ul>
      `
    },
    {
      title: "Pré-Formatação: Checklist Completo (NÃO Pule!)",
      content: `
        <div class="bg-rose-900/10 p-5 rounded-xl border border-rose-500/20 mb-6">
          <h4 class="text-rose-400 font-bold mb-2 flex items-center gap-2">
            <span>⚠️</span> AVISO CRÍTICO
          </h4>
          <p class="text-sm text-gray-300">
            Formatar <strong>APAGA TUDO</strong> do disco. Não há volta. Pessoas perdem fotos de família, anos de trabalho e saves de jogos por pular essa etapa. <strong>Reserve 30 minutos para fazer backup corretamente.</strong>
          </p>
        </div>
        
        <h4 class="text-white font-bold mb-3">📂 Backup de Arquivos Essenciais</h4>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4">
          <li><strong>Pasta do Usuário Completa:</strong> Copie <code>C:\\Users\\SeuNome</code> para HD Externo ou nuvem. Isso inclui:
            <ul class="list-disc ml-8 mt-2 space-y-1 text-sm">
              <li>Documentos, Fotos, Vídeos, Música, Downloads</li>
              <li>Área de Trabalho (Desktop) — muita gente salva tudo ali</li>
              <li>Favoritos do navegador (exporte manualmente do Chrome/Edge)</li>
              <li>Saves de jogos (geralmente em Documents ou AppData)</li>
            </ul>
          </li>
          <li><strong>Arquivos Ocultos Importantes:</strong>
            <ul class="list-disc ml-8 mt-2 space-y-1 text-sm">
              <li><code>AppData\\Roaming</code> — configurações de programas</li>
              <li>Senhas do navegador (exporte via configurações)</li>
              <li>Licenças de software (anote serial keys)</li>
            </ul>
          </li>
          <li><strong>Lista de Programas Instalados:</strong> Tire print da lista de programas (Configurações → Apps) para não esquecer de reinstalar nada.</li>
        </ol>
        
        <h4 class="text-white font-bold mb-3 mt-6">🔑 Chave de Ativação do Windows</h4>
        <p class="text-gray-300 mb-3">
          Se seu Windows veio pré-instalado (OEM), a chave está gravada na BIOS e ativará automaticamente após a formatação. Se você comprou separado:
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-2 ml-4">
          <li>Vá em Configurações → Sistema → Ativação.</li>
          <li>Veja se está vinculado à sua conta Microsoft. Se sim, anote o e-mail.</li>
          <li>Se não estiver vinculado, use o programa gratuito <strong>ProduKey</strong> para extrair a chave (anote em papel).</li>
        </ol>
        
        <h4 class="text-white font-bold mb-3 mt-6">💾 Baixar Drivers Essenciais</h4>
        <p class="text-gray-300 mb-3">
          Em 2026, o Windows 11 reconhece 95% do hardware automaticamente. Porém, baixe por segurança:
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
          <li><strong>Driver de Rede (Ethernet/Wi-Fi):</strong> Se o Windows não reconhecer sua placa de rede, você ficará sem internet. Baixe do site do fabricante da placa-mãe e salve no pendrive de instalação.</li>
          <li><strong>Chipset Drivers:</strong> Site da Intel (intel.com/chipset) ou AMD (amd.com/chipset).</li>
          <li><strong>GPU Drivers:</strong> NVIDIA (geforce.com) ou AMD (amd.com/drivers). Não use drivers genéricos do Windows Update.</li>
        </ul>
      `
    },
    {
      title: "Criando o Pendrive Bootável do Windows 11",
      content: `
        <p class="mb-4 text-gray-300">
          Você precisa de um pendrive <strong>vazio</strong> de pelo menos 8GB (recomendo 16GB). Todo o conteúdo será apagado.
        </p>
        
        <h4 class="text-white font-bold mb-3 mt-6">📥 Método 1: Media Creation Tool (Oficial da Microsoft)</h4>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4">
          <li>Vá no site da Microsoft: <code>microsoft.com/software-download/windows11</code></li>
          <li>Baixe o <strong>Media Creation Tool</strong> (pequeno, ~20MB).</li>
          <li>Execute o programa, aceite os termos e escolha <strong>\"Criar mídia de instalação\"</strong>.</li>
          <li>Selecione idioma (Português Brasil), edição (Windows 11 Pro ou Home) e arquitetura (64-bit).</li>
          <li>Escolha <strong>\"Unidade flash USB\"</strong> e selecione seu pendrive.</li>
          <li>Aguarde 20-40 minutos (depende da velocidade da internet e do pendrive).</li>
        </ol>
        <p class="text-gray-300 text-sm mt-2 ml-4">
          <strong>Vantagem:</strong> Simples, sem complicação. <strong>Desvantagem:</strong> Lento e requer internet durante o processo.
        </p>
        
        <h4 class="text-white font-bold mb-3 mt-6">🔥 Método 2: Rufus (Mais Rápido e Flexível)</h4>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4">
          <li>Baixe a ISO do Windows 11 direto do site da Microsoft (mesmo link acima, mas escolha <strong>\"Baixar ISO\"</strong>).</li>
          <li>Baixe o <strong>Rufus 4.0+</strong> (rufus.ie) — programa gratuito e portátil (sem instalação).</li>
          <li>Abra o Rufus, selecione seu pendrive em <strong>\"Dispositivo\"</strong>.</li>
          <li>Clique em <strong>\"SELECIONAR\"</strong> e escolha a ISO do Windows 11 que você baixou.</li>
          <li>Em <strong>\"Opções de imagem\"</strong>, escolha <strong>\"Instalação padrão do Windows\"</strong>.</li>
          <li>Em <strong>\"Esquema de partição\"</strong>, escolha <strong>GPT</strong> (UEFI) se seu PC for moderno (2012+).</li>
          <li>Clique em <strong>\"INICIAR\"</strong> e aguarde 5-10 minutos.</li>
        </ol>
        <p class="text-gray-300 text-sm mt-2 ml-4">
          <strong>Vantagem:</strong> Muito mais rápido, permite remover requisitos do TPM 2.0 (para PCs antigos). <strong>Desvantagem:</strong> Requer download manual da ISO.
        </p>
        
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20 mt-6">
          <h4 class="text-[#31A8FF] font-bold mb-2">💡 Dica: Bypass de Requisitos do Windows 11</h4>
          <p class="text-sm text-gray-300">
            PCs antigos sem TPM 2.0 ou Secure Boot não podem instalar Windows 11 oficialmente. O Rufus tem opções para <strong>remover esses requisitos</strong> durante a criação do pendrive. Marque as caixas: \"Remove requirement for 4GB+ RAM\", \"TPM 2.0\" e \"Secure Boot\". Funciona perfeitamente, mas é por sua conta e risco.
          </p>
        </div>
      `
    },
    {
      title: "Passo a Passo: Instalando o Windows 11 do Zero",
      content: `
        <h4 class="text-white font-bold mb-3">🔄 Etapa 1: Entrando na BIOS/Boot Menu</h4>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4">
          <li>Com o PC desligado, conecte o pendrive bootável em uma porta USB.</li>
          <li>Ligue o PC e <strong>imediatamente</strong> comece a apertar a tecla de Boot Menu:
            <ul class="list-disc ml-8 mt-2 space-y-1 text-sm">
              <li><strong>Dell:</strong> F12</li>
              <li><strong>HP:</strong> F9 ou ESC</li>
              <li><strong>Lenovo:</strong> F12 ou F8</li>
              <li><strong>Asus:</strong> F8 ou ESC</li>
              <li><strong>Acer:</strong> F12</li>
              <li><strong>Gigabyte/MSI:</strong> F12</li>
            </ul>
          </li>
          <li>Escolha o pendrive na lista (geralmente começa com \"UEFI:\" ou \"USB:\").</li>
          <li>Se não aparecer opção de boot, entre na BIOS (geralmente DEL ou F2) e desative <strong>Fast Boot</strong> e <strong>Secure Boot</strong> temporariamente.</li>
        </ol>
        
        <h4 class="text-white font-bold mb-3 mt-6">💻 Etapa 2: Tela de Instalação do Windows</h4>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4">
          <li>Após alguns segundos, você verá o logo do Windows e a mensagem \"Preparando...\".</li>
          <li>Escolha o <strong>idioma</strong> (Português Brasil), <strong>formato de hora</strong> e <strong>teclado ABNT2</strong>.</li>
          <li>Clique em <strong>\"Instalar agora\"</strong>.</li>
          <li><strong>Chave do produto:</strong> Se o Windows veio pré-instalado, clique em <strong>\"Não tenho uma chave\"</strong> (ativará automaticamente depois). Se você tem chave, digite agora.</li>
          <li>Escolha a edição: <strong>Windows 11 Home</strong> (maioria) ou <strong>Pro</strong> (se sua chave for Pro).</li>
          <li>Aceite os termos de licença.</li>
        </ol>
        
        <h4 class="text-white font-bold mb-3 mt-6">💾 Etapa 3: Tipo de Instalação (CRÍTICO!)</h4>
        <p class="text-gray-300 mb-4">
          Esta é a tela mais importante. Você verá duas opções:
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-3 ml-4">
          <li><strong>\"Atualização\":</strong> Mantém arquivos e programas. <strong>NÃO escolha isso</strong> se quer formatar de verdade.</li>
          <li><strong>\"Personalizada: Instalar somente o Windows (avançado)\"</strong> — <strong>Esta é a correta!</strong></li>
        </ul>
      `
    },
    {
      title: "Particionamento: Limpando e Organizando o Disco",
      content: `
        <p class="mb-4 text-gray-300">
          Após escolher \"Personalizada\", você verá uma lista de partições existentes no seu disco. <strong>Aqui é onde você apaga tudo.</strong>
        </p>
        
        <div class="bg-amber-900/10 p-5 rounded-xl border border-amber-500/20 mb-6">
          <h4 class="text-amber-400 font-bold mb-2">⚠️ ATENÇÃO: MÚltiplos Discos</h4>
          <p class="text-sm text-gray-300">
            Se você tem <strong>2 discos</strong> (ex: SSD + HD), tome MUITO cuidado para não formatar o disco errado! Identifique pelo tamanho (ex: Disco 0 - 500GB = SSD, Disco 1 - 1TB = HD). Formate apenas o disco onde quer instalar o Windows (geralmente o SSD).
          </p>
        </div>
        
        <h4 class="text-white font-bold mb-3">🧹 Limpando as Partições (Formatação Completa)</h4>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4">
          <li>Selecione a primeira partição do disco (ex: \"Partição 1: Sistema\").</li>
          <li>Clique em <strong>\"Excluir\"</strong>.</li>
          <li>Repita para <strong>todas as partições</strong> do disco até restar apenas <strong>\"Espaço não alocado\"</strong>.</li>
          <li>Selecione o \"Espaço não alocado\" e clique em <strong>\"Avançar\"</strong>.</li>
          <li>O Windows criará automaticamente as partições necessárias (EFI, MSR, primária).</li>
        </ol>
        
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20 mt-6">
          <h4 class="text-[#31A8FF] font-bold mb-2">📊 Partições que o Windows 11 Cria (UEFI/GPT)</h4>
          <ul class="list-disc list-inside text-gray-300 text-sm space-y-2">
            <li><strong>Partição EFI do Sistema (100MB):</strong> Bootloader do Windows.</li>
            <li><strong>MSR (Reservada) (16MB):</strong> Partição técnica da Microsoft.</li>
            <li><strong>Primária (C:):</strong> Onde o Windows e seus programas vão morar.</li>
            <li><strong>Recuperação (500MB-1GB):</strong> Para opção de restauração do Windows.</li>
          </ul>
          <p class="text-gray-300 text-sm mt-3">
            <strong>Não mexa nessas partições manualmente.</strong> O Windows gerencia tudo sozinho.
          </p>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">⏱️ Aguardando a Instalação</h4>
        <p class="text-gray-300 mb-4">
          O processo de instalação começa automaticamente. Você verá:
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
          <li>Copiando arquivos do Windows... (5-10 min)</li>
          <li>Preparando arquivos para instalação... (2-5 min)</li>
          <li>Instalando recursos... (10-20 min)</li>
          <li>Instalando atualizações... (5-15 min)</li>
        </ul>
        <p class="text-gray-300 mt-4">
          <strong>Tempo total:</strong> 20-40 minutos dependendo do SSD/HD. O PC reiniciará algumas vezes—<strong>NÃO remova o pendrive ainda</strong> (ele vai bootar pelo HD automaticamente após a cópia inicial).
        </p>
      `
    },
    {
      title: "Configuração Inicial: OOBE (Out-of-Box Experience)",
      content: `
        <p class="mb-4 text-gray-300">
          Após a instalação, o Windows reiniciará e mostrará a tela de configuração inicial (OOBE). <strong>Agora você pode remover o pendrive.</strong>
        </p>
        
        <h4 class="text-white font-bold mb-3">🌐 Conectando à Internet</h4>
        <p class="text-gray-300 mb-4">
          O Windows 11 <strong>força</strong> conexão com internet durante a configuração (para criar/logar em conta Microsoft). Se você quer usar conta local sem internet:
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-2 ml-4">
          <li>Na tela de Wi-Fi, pressione <kbd class="bg-white/10 px-2 py-1 rounded text-xs">Shift + F10</kbd> para abrir o Prompt de Comando.</li>
          <li>Digite: <code class="bg-white/10 px-2 py-1 rounded">oobe\\bypassnro</code> e pressione Enter.</li>
          <li>O PC reiniciará e agora aparecerá a opção <strong>\"Não tenho internet\"</strong>.</li>
          <li>Escolha <strong>\"Continuar com configuração limitada\"</strong> para criar conta local.</li>
        </ol>
        
        <h4 class="text-white font-bold mb-3 mt-6">👤 Conta Microsoft vs Conta Local</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-[#0A0A0F] border border-white/10 rounded-xl p-5">
            <h5 class="text-[#31A8FF] font-bold mb-3">☁️ Conta Microsoft</h5>
            <p class="text-gray-300 text-sm mb-3"><strong>Vantagens:</strong></p>
            <ul class="list-disc list-inside text-gray-300 text-xs space-y-1">
              <li>Sincroniza configurações entre PCs</li>
              <li>OneDrive grátis (5GB)</li>
              <li>Ativação vinculada à conta (fácil reativar)</li>
              <li>Recuperação de senha online</li>
            </ul>
            <p class="text-gray-300 text-sm mt-3"><strong>Desvantagens:</strong></p>
            <ul class="list-disc list-inside text-gray-300 text-xs space-y-1">
              <li>Requer internet para login inicial</li>
              <li>Coleta mais telemetria</li>
            </ul>
          </div>
          
          <div class="bg-[#0A0A0F] border border-white/10 rounded-xl p-5">
            <h5 class="text-[#31A8FF] font-bold mb-3">💻 Conta Local</h5>
            <p class="text-gray-300 text-sm mb-3"><strong>Vantagens:</strong></p>
            <ul class="list-disc list-inside text-gray-300 text-xs space-y-1">
              <li>Privacidade (sem telemetria da conta)</li>
              <li>Funciona offline sempre</li>
              <li>Login mais rápido (sem verificação online)</li>
            </ul>
            <p class="text-gray-300 text-sm mt-3"><strong>Desvantagens:</strong></p>
            <ul class="list-disc list-inside text-gray-300 text-xs space-y-1">
              <li>Sem sincronização automática</li>
              <li>Sem OneDrive integrado</li>
              <li>Se esquecer senha, precisa resetar</li>
            </ul>
          </div>
        </div>
      `
    },
    {
      title: "Pós-Instalação: Primeiros Passos Essenciais",
      content: `
        <p class="mb-4 text-gray-300">
          Parabéns! O Windows 11 está instalado. Mas <strong>ainda não terminamos</strong>. Siga este checklist para um sistema perfeito:
        </p>
        
        <h4 class="text-white font-bold mb-3">✅ Checklist Pós-Formatação (Ordem Cronológica)</h4>
        <ol class="list-decimal list-inside text-gray-300 space-y-4 ml-4">
          <li><strong>Verificar Ativação:</strong> Configurações → Sistema → Ativação. Se não ativou automaticamente, digite sua chave agora.</li>
          
          <li><strong>Windows Update:</strong> Configurações → Windows Update → Verificar atualizações. Instale TUDO (vai demorar 20-40 min). Reinicie quantas vezes necessário.</li>
          
          <li><strong>Drivers Essenciais:</strong>
            <ul class="list-disc ml-8 mt-2 space-y-1 text-sm">
              <li><strong>GPU:</strong> NVIDIA (GeForce Experience) ou AMD (Adrenalin). NUNCA use driver genérico do Windows Update para jogos.</li>
              <li><strong>Chipset:</strong> Site da Intel ou AMD (melhora desempenho geral).</li>
              <li><strong>Placa-mãe:</strong> Site do fabricante (Asus, Gigabyte, MSI) para BIOS, áudio e rede.</li>
            </ul>
          </li>
          
          <li><strong>Instalar Runtimes:</strong>
            <ul class="list-disc ml-8 mt-2 space-y-1 text-sm">
              <li>Visual C++ Redistributable All-in-One (resolve 90% dos erros de DLL)</li>
              <li>DirectX End-User Runtime</li>
              <li>.NET Framework 4.8 (se necessário para programas antigos)</li>
            </ul>
          </li>
          
          <li><strong>Navegador:</strong> Chrome, Edge (já vem) ou Firefox. Importe seus favoritos salvos.</li>
          
          <li><strong>Segurança:</strong>
            <ul class="list-disc ml-8 mt-2 space-y-1 text-sm">
              <li>Windows Defender é suficiente para 99% dos usuários (já vem ativo).</li>
              <li>Opcionalmente: Malwarebytes Free para scanear uma vez por mês.</li>
            </ul>
          </li>
          
          <li><strong>Programas Essenciais:</strong> Reinstale conforme a lista que você fez antes de formatar.</li>
          
          <li><strong>Restaurar Arquivos:</strong> Copie seus documentos, fotos e configurações do backup.</li>
          
          <li><strong>Otimizações Finais:</strong>
            <ul class="list-disc ml-8 mt-2 space-y-1 text-sm">
              <li>Desinstalar bloatware (Candy Crush, etc via Configurações → Apps)</li>
              <li>Desativar programas de inicialização desnecessários (Gerenciador de Tarefas → Inicializar)</li>
              <li>Criar Ponto de Restauração (agora que está perfeito)</li>
            </ul>
          </li>
        </ol>
      `
    },
    {
      title: "Problemas Comuns Durante a Instalação (Troubleshooting)",
      content: `
        <h4 class="text-white font-bold mb-3">🚫 Erro: \"Este PC não atende aos requisitos mínimos\"</h4>
        <p class="text-gray-300 mb-3">
          Windows 11 exige TPM 2.0 e Secure Boot. Soluções:
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
          <li><strong>Ativar TPM na BIOS:</strong> Entre na BIOS (DEL/F2) e procure por \"TPM\", \"PTT\" (Intel) ou \"fTPM\" (AMD). Ative.</li>
          <li><strong>Ativar Secure Boot:</strong> Na BIOS, em \"Boot\" ou \"Security\", ative Secure Boot (pode precisar limpar chaves primeiro).</li>
          <li><strong>Bypass (PCs antigos):</strong> Use Rufus com opção \"Remove TPM requirement\" marcada.</li>
        </ul>
        
        <h4 class="text-white font-bold mb-3 mt-6">🚫 Erro: \"Não foi possível criar uma nova partição\"</h4>
        <p class="text-gray-300 mb-3">
          Isso acontece se o disco ainda tiver estrutura MBR (legado) e você está tentando instalar em modo UEFI.
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-2 ml-4">
          <li>Pressione <kbd class="bg-white/10 px-2 py-1 rounded text-xs">Shift + F10</kbd> para abrir o CMD.</li>
          <li>Digite:
            <div class="bg-black/30 p-3 rounded mt-2 font-mono text-xs">
              <p><code>diskpart</code></p>
              <p><code>list disk</code></p>
              <p><code>select disk 0</code> (ou o número do seu disco)</p>
              <p><code>clean</code> (APAGA TUDO!)</p>
              <p><code>convert gpt</code></p>
              <p><code>exit</code></p>
            </div>
          </li>
          <li>Clique em \"Atualizar\" na tela de partições e continue normalmente.</li>
        </ol>
        
        <h4 class="text-white font-bold mb-3 mt-6">🚫 Pendrive Não Aparece no Boot Menu</h4>
        <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
          <li>Verifique se o pendrive está em uma porta USB 2.0 (traseira do PC). Portas USB 3.0 frontal às vezes falham.</li>
          <li>Desative \"Fast Boot\" e \"Secure Boot\" temporariamente na BIOS.</li>
          <li>Troque a ordem de boot: Pendrive em 1º lugar, HD em 2º.</li>
        </ul>
        
        <h4 class="text-white font-bold mb-3 mt-6">🚫 Windows Não Ativa Após Formatação</h4>
        <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
          <li><strong>PC OEM (pré-instalado):</strong> Conecte à internet e aguarde 10-30 minutos. Ativará automaticamente via BIOS.</li>
          <li><strong>Licença vinculada à conta Microsoft:</strong> Logue com a mesma conta e vá em Configurações → Ativação → Solucionar problemas.</li>
          <li><strong>Trocou hardware (placa-mãe):</strong> A chave pode ter desvinculado. Use a opção \"Alterei o hardware recentemente\" nas configurações de ativação.</li>
        </ul>
      `
    },
    {
      title: "Quando Chamar um Técnico Profissional",
      content: `
        <p class="mb-4 text-gray-300">
          Formatar é relativamente simples, mas há situações onde é melhor ter ajuda profissional:
        </p>
        
        <div class="bg-[#0A0A0F] border border-[#FF4B6B]/20 rounded-xl p-6">
          <h4 class="text-[#FF4B6B] font-bold mb-4">🚨 Quando Procurar Ajuda:</h4>
          <ul class="list-disc list-inside text-gray-300 space-y-3 ml-4">
            <li><strong>PC não liga ou não entra na BIOS:</strong> Problema de hardware (placa-mãe, fonte, memória). Não é questão de formatação.</li>
            <li><strong>Disco não é reconhecido durante a instalação:</strong> Pode ser falha do SSD/HD ou driver SATA/NVMe faltando. Técnico pode diagnosticar.</li>
            <li><strong>Notebooks com BIOS bloqueada:</strong> Alguns modelos corporativos têm senha de administrador na BIOS. Técnico tem ferramentas para resetar.</li>
            <li><strong>Você não se sente confortável mexendo na BIOS ou particionamento:</strong> Melhor pagar R$50-100 para um profissional do que arriscar perder dados ou brickar o PC.</li>
            <li><strong>Empresa/trabalho:</strong> PCs corporativos podem ter políticas de domínio e software específico. Deixe o TI da empresa cuidar.</li>
          </ul>
        </div>
        
        <p class="mt-6 text-gray-300">
          A <strong>VOLTRIS oferece serviço de formatação completa</strong> (presencial ou remoto), incluindo backup, instalação limpa, drivers, programas essenciais e otimizações. Preço justo e garantia de satisfação.
        </p>
      `
    }
  ];

  const faqItems = [
    {
      question: "Formatar apaga tudo mesmo ou dá pra recuperar?",
      answer: "Formatação rápida (que o Windows faz) tecnicamente não apaga os dados físicos—só marca o espaço como disponível. Softwares de recuperação (Recuva, EaseUS) podem recuperar até 70-80% dos arquivos se você agir rápido. Porém, assim que você reinstalar o Windows e começar a usar, novos dados sobrescrevem os antigos e recuperação se torna impossível. <strong>Moral:</strong> Faça backup ANTES, não confie em recuperação depois."
    },
    {
      question: "Preciso formatar para trocar de HD para SSD?",
      answer: "<strong>Não obrigatoriamente</strong>, mas é altamente recomendado. Você pode <strong>clonar</strong> o HD para o SSD (com Macrium Reflect ou Clonezilla), mas isso traz problemas do HD antigo junto. Instalação limpa no SSD dá muito melhor performance e aproveita 100% da velocidade do SSD (alinhamento correto de partições, TRIM ativado automaticamente)."
    },
    {
      question: "Quanto tempo demora para formatar o Windows 11?",
      answer: "<strong>SSD NVMe:</strong> 20-30 minutos (instalação + configuração inicial). <strong>SSD SATA:</strong> 30-40 minutos. <strong>HD tradicional:</strong> 45-90 minutos. Isso é só a instalação do Windows puro. Adicione +30-60 minutos para Windows Update, drivers e programas essenciais. Tempo total realista: 1h30 a 2h30 para ter o PC totalmente funcional."
    },
    {
      question: "Posso formatar sem pendrive usando apenas o próprio Windows?",
      answer: "Sim, existe a opção <strong>'Restaurar o PC'</strong> em Configurações → Sistema → Recuperação. Você pode escolher 'Remover tudo'. <strong>Porém</strong>, isso não é formatação verdadeira—o Windows apenas reinstala por cima, mantendo estrutura de partições. Para limpeza total (recomendado após vírus ou corrupção grave), use pendrive bootável e delete todas as partições manualmente."
    },
    {
      question: "Perco a licença do Windows se formatar?",
      answer: "<strong>Não.</strong> Se o Windows veio pré-instalado (OEM), a chave está gravada na BIOS/UEFI e ativará automaticamente após reinstalar. Se você comprou licença separada e vinculou à conta Microsoft, basta logar com a mesma conta. Se comprou chave avulsa e não vinculou, anote a chave ANTES de formatar (use ProduKey). <strong>Único cenário que perde:</strong> Trocar placa-mãe (licença OEM morre com o hardware)."
    },
    {
      question: "Windows 10 ou 11? Qual instalar em 2026?",
      answer: "<strong>Windows 11</strong> sem dúvidas. Windows 10 perde suporte oficial em <strong>Outubro de 2025</strong>—após isso, sem atualizações de segurança (risco enorme). Windows 11 é mais otimizado para SSDs NVMe, tem melhor suporte a DirectStorage (jogos carregam mais rápido), e é obrigatório para usar recursos novos como Copilot AI. Se seu PC não atende requisitos (TPM 2.0), use Rufus para fazer bypass ou considere Linux."
    },
    {
      question: "Formatar resolve problema de vírus?",
      answer: "<strong>Sim, 99,9% dos casos.</strong> Formatar apaga todos os arquivos do disco, incluindo vírus, malware, rootkits, etc. <strong>Exceto:</strong> Vírus de BIOS/UEFI (extremamente raros, ataques direcionados tipo governo). Se você suspeita de infecção na BIOS (PC infectado mesmo após formatar várias vezes), atualize a BIOS para versão mais recente (isso sobrescreve o firmware e mata qualquer rootkit de BIOS)."
    },
    {
      question: "Preciso de internet para instalar o Windows 11?",
      answer: "<strong>Para a instalação base: NÃO.</strong> O pendrive tem o Windows completo. <strong>Para configuração inicial: Oficialmente SIM</strong> (Microsoft força criação de conta online). Porém, há bypass: pressione Shift+F10 e digite <code>oobe\\bypassnro</code> para pular. <strong>Após instalar:</strong> Você vai precisar de internet para Windows Update, drivers de GPU e programas. Recomendo ter internet disponível."
    },
    {
      question: "Dual boot: posso ter Windows e Linux no mesmo PC?",
      answer: "Sim! Durante o particionamento, <strong>não delete todas as partições</strong>. Crie uma nova partição para o Windows (ex: 100GB) e deixe espaço não alocado para instalar Linux depois. O bootloader do Linux (GRUB) detecta o Windows automaticamente e cria menu de escolha. <strong>Ordem correta:</strong> Instale Windows primeiro, Linux depois (fazer o contrário complica)."
    },
    {
      question: "Formatei mas o PC continua lento. Por quê?",
      answer: "Se o PC está lento mesmo após formatação limpa, o problema é <strong>hardware</strong>, não software: 1) <strong>HD tradicional:</strong> Troque por SSD (diferença de dia pra noite). 2) <strong>RAM insuficiente:</strong> Windows 11 precisa 8GB mínimo (4GB trava muito). 3) <strong>Processador fraco:</strong> CPUs antigas (2010-2012) simplesmente não dão conta do Windows 11. 4) <strong>Superaquecimento:</strong> CPU/GPU throttling por falta de pasta térmica ou cooler entupido de poeira."
    },
    {
      question: "Como formatar notebook que não tem leitor de DVD?",
      answer: "Use <strong>pendrive bootável</strong> (método explicado neste guia). DVDs são obsoletos desde 2015—pendrives são mais rápidos e reutilizáveis. Todo notebook desde 2010 tem suporte a boot via USB. Se por algum motivo o pendrive não funcionar, você pode: 1) Remover o SSD/HD do notebook, conectar em outro PC via adaptador, formatar lá e reinstalar. 2) Usar leitor de DVD externo USB (se você tiver um)."
    },
    {
      question: "Formatar SSD desgasta mais rápido?",
      answer: "<strong>NÃO significativamente.</strong> SSDs modernos (2020+) têm durabilidade de 600-1000 TBW (terabytes escritos). Formatar escreve ~20-30GB uma vez. Você precisaria formatar <strong>20.000 vezes</strong> para atingir o limite. Na prática, SSDs morrem por idade (10-15 anos) antes de esgotar ciclos de escrita. Formate sem medo quando necessário—não vai diminuir vida útil perceptivelmente."
    }
  ];

  const externalReferences = [
    { name: "Microsoft - Download Oficial do Windows 11", url: "https://www.microsoft.com/pt-br/software-download/windows11" },
    { name: "Rufus - Ferramenta de Criação de Pendrive Bootável", url: "https://rufus.ie/pt_BR/" },
    { name: "Microsoft - Requisitos do Sistema Windows 11", url: "https://www.microsoft.com/pt-br/windows/windows-11-specifications" }
  ];

  const relatedGuides = [
    {
      href: "/guias/criar-pendrive-bootavel",
      title: "Criar Pendrive Bootável Windows 11",
      description: "Tutorial completo de como usar Rufus e Media Creation Tool para criar pendrive de instalação."
    },
    {
      href: "/guias/pos-instalacao-windows-11",
      title: "Guia Pós-Instalação Windows 11",
      description: "O que configurar imediatamente após formatar: drivers, programas essenciais e otimizações."
    },
    {
      href: "/guias/backup-dados",
      title: "Guia Completo de Backup de Dados",
      description: "Aprenda a regra 3-2-1 e nunca perca arquivos importantes por esquecer de fazer backup antes de formatar."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="60 min"
      difficultyLevel="Intermediário"
      author="Equipe Técnica Voltris"
      lastUpdated="Janeiro 2026"
      contentSections={contentSections}
      summaryTable={summaryTable}
      relatedGuides={relatedGuides}
      faqItems={faqItems}
      externalReferences={externalReferences}
    />
  );
}
