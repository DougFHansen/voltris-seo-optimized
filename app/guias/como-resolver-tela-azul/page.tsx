import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'como-resolver-tela-azul',
  title: "Tela Azul no Windows 11: Como Resolver (Guia Completo 2026)",
  description: "Seu PC travou na tela azul (BSOD)? Aprenda como identificar os códigos de erro, usar o BlueScreenView, corrigir drivers e resolver travamentos permane...",
  category: 'windows-erros',
  difficulty: 'Intermediário',
  time: '30 min'
};

const title = "Tela Azul no Windows 11: Como Resolver (Guia Completo 2026)";
const description = "Seu PC travou na tela azul (BSOD)? Aprenda como identificar os códigos de erro, usar o BlueScreenView, corrigir drivers e resolver travamentos permanentemente no Windows 11 em 2026.";
const keywords = [
    'como resolver tela azul windows 11 2026',
    'guia completo bsod windows 11 tutorial',
    'identificar codigo de erro tela azul ferramenta 2026',
    'tela azul memory management como resolver guia',
    'pc reiniciando sozinho tela azul tutorial 2026',
    'bluescreenview como usar tutorial 2026',
    'driver causando tela azul descobrir',
    'memoria ram defeito como testar windows 11'
];

export const metadata: Metadata = createGuideMetadata('como-resolver-tela-azul', title, description, keywords);

export default function BSODFixGuide() {
    const summaryTable = [
        { label: "Causa #1", value: "Drivers corrompidos ou incompatíveis (60%)" },
        { label: "Causa #2", value: "Memória RAM com defeito físico (20%)" },
        { label: "Causa #3", value: "Overclock instável ou superaquecimento (15%)" },
        { label: "Ferramenta Principal", value: "BlueScreenView (gratuita)" },
        { label: "Ferramenta Alternativa", value: "WhoCrashed / WinDbg" },
        { label: "Tempo de Diagnóstico", value: "15-30 minutos" },
        { label: "Dificuldade", value: "Intermediário" }
    ];

    const contentSections = [
        {
            title: "O que é a Tela Azul da Morte (BSOD)?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          A <strong>Tela Azul da Morte (BSOD - Blue Screen of Death)</strong> é um mecanismo de proteção do Windows, não um erro fatal sem solução. Quando o sistema operacional detecta uma condição crítica que pode danificar permanentemente o hardware ou corromper dados (como um driver tentando acessar uma área de memória proibida, ou um componente superaquecendo), ele força um desligamento emergencial para evitar danos maiores.
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed">
          Em 2026, com o Windows 11 24H2 sendo a versão mais estável já lançada pela Microsoft, as telas azuis são significativamente mais raras do que eram no Windows 7 ou 8. Segundo estatísticas da telemetria do Windows, <strong>60% dos BSODs modernos são causados por drivers de terceiros desatualizados</strong> (especialmente placas de vídeo NVIDIA/AMD), 20% por memória RAM com defeito físico, 15% por overclock instável ou superaquecimento, e apenas 5% por bugs reais do Windows.
        </p>
        <p class="mb-4 text-gray-300 leading-relaxed">
          A boa notícia é que cada tela azul gera um <strong>arquivo de dump (minidump)</strong> contendo informações detalhadas sobre o que causou o crash. Com as ferramentas certas, podemos ler esses dumps e identificar o culpado com precisão cirúrgica.
        </p>
      `
        },
        {
            title: "Códigos de Erro BSOD Mais Comuns (2026)",
            content: `
        <p class="mb-4 text-gray-300">Antes de partir para o diagnóstico técnico, veja os códigos de erro mais frequentes e suas causas prováveis:</p>
        
        <div class="overflow-x-auto mb-6">
            <table class="w-full text-sm text-gray-300 border-collapse">
                <thead>
                    <tr class="bg-white/5 border-b border-white/10">
                        <th class="px-4 py-3 text-left text-white font-bold">Código de Erro</th>
                        <th class="px-4 py-3 text-left text-white font-bold">Causa Provável</th>
                        <th class="px-4 py-3 text-left text-white font-bold">Solução Rápida</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="border-b border-white/5 hover:bg-white/5">
                        <td class="px-4 py-3"><code class="text-[#31A8FF]">MEMORY_MANAGEMENT</code></td>
                        <td class="px-4 py-3">Pente de RAM com defeito ou incompatível</td>
                        <td class="px-4 py-3">Testar com Memtest86</td>
                    </tr>
                    <tr class="border-b border-white/5 hover:bg-white/5">
                        <td class="px-4 py-3"><code class="text-[#31A8FF]">SYSTEM_SERVICE_EXCEPTION</code></td>
                        <td class="px-4 py-3">Driver de vídeo corrompido (NVIDIA/AMD)</td>
                        <td class="px-4 py-3">Reinstalar driver com DDU</td>
                    </tr>
                    <tr class="border-b border-white/5 hover:bg-white/5">
                        <td class="px-4 py-3"><code class="text-[#31A8FF]">IRQL_NOT_LESS_OR_EQUAL</code></td>
                        <td class="px-4 py-3">Driver de rede ou antivírus incompatível</td>
                        <td class="px-4 py-3">Atualizar/remover driver problemático</td>
                    </tr>
                    <tr class="border-b border-white/5 hover:bg-white/5">
                        <td class="px-4 py-3"><code class="text-[#31A8FF]">KERNEL_SECURITY_CHECK_FAILURE</code></td>
                        <td class="px-4 py-3">Corrupção de sistema ou RAM</td>
                        <td class="px-4 py-3">sfc /scannow + teste de RAM</td>
                    </tr>
                    <tr class="border-b border-white/5 hover:bg-white/5">
                        <td class="px-4 py-3"><code class="text-[#31A8FF]">PAGE_FAULT_IN_NONPAGED_AREA</code></td>
                        <td class="px-4 py-3">Falha no SSD/HD ou RAM</td>
                        <td class="px-4 py-3">chkdsk /f /r + CrystalDiskInfo</td>
                    </tr>
                    <tr class="border-b border-white/5 hover:bg-white/5">
                        <td class="px-4 py-3"><code class="text-[#31A8FF]">DPC_WATCHDOG_VIOLATION</code></td>
                        <td class="px-4 py-3">Driver SATA/NVMe desatualizado</td>
                        <td class="px-4 py-3">Atualizar chipset drivers</td>
                    </tr>
                    <tr class="hover:bg-white/5">
                        <td class="px-4 py-3"><code class="text-[#31A8FF]">VIDEO_TDR_FAILURE</code></td>
                        <td class="px-4 py-3">GPU travando (overclock ou driver)</td>
                        <td class="px-4 py-3">Remover OC e reinstalar driver</td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <div class="bg-amber-900/10 p-5 rounded-xl border border-amber-500/20 mt-6">
            <h4 class="text-amber-400 font-bold mb-2 flex items-center gap-2">
                <span>⚠️</span> ATENÇÃO: Telas Azuis Aleatórias
            </h4>
            <p class="text-sm text-gray-300">
                Se você recebe telas azuis com <strong>códigos diferentes a cada vez</strong> (sem um padrão), isso geralmente indica um problema de hardware físico, não de software. As causas mais comuns são: memória RAM falhando, fonte de alimentação fraca, ou superaquecimento de CPU/GPU. Nesses casos, ferramentas de software não vão resolver—você precisará de diagnóstico de hardware.
            </p>
        </div>
      `
        },
        {
            title: "Passo 1: Identificando o Culpado com BlueScreenView",
            content: `
        <p class="mb-4 text-gray-300">
            O Windows armazena os relatórios de tela azul em arquivos chamados <strong>minidumps</strong> (localizados em <code>C:\Windows\Minidump</code>). Esses arquivos binários não podem ser lidos diretamente, mas podemos usar ferramentas gratuitas para decodificá-los.
        </p>
        
        <h4 class="text-white font-bold mb-3 mt-6">📥 Baixando e Usando o BlueScreenView</h4>
        <ol class="list-decimal list-inside text-gray-300 space-y-4 ml-4">
            <li class="leading-relaxed">
                <strong>Baixe o BlueScreenView</strong> do site oficial NirSoft (gratuito, sem instalação necessária). Descompacte o arquivo ZIP em qualquer pasta.
            </li>
            <li class="leading-relaxed">
                <strong>Execute o programa</strong>. Ele automaticamente vai escanear a pasta <code>C:\Windows\Minidump</code> e listar todos os crashes recentes.
            </li>
            <li class="leading-relaxed">
                Na lista superior, você verá a data/hora de cada crash e o <strong>código de erro</strong> (Bug Check String). Clique em um crash para ver os detalhes.
            </li>
            <li class="leading-relaxed">
                Na lista inferior, procure a coluna <strong>"Caused By Driver"</strong>. Este é o arquivo que provavelmente causou o crash. Exemplos:
                <ul class="list-disc ml-8 mt-2 space-y-1">
                    <li><code class="text-[#FF4B6B]">nvlddmkm.sys</code> → Driver NVIDIA (placa de vídeo)</li>
                    <li><code class="text-[#FF4B6B]">amdkmdag.sys</code> → Driver AMD (placa de vídeo)</li>
                    <li><code class="text-[#FF4B6B]">ntoskrnl.exe</code> → Kernel do Windows (geralmente indica RAM ou CPU)</li>
                    <li><code class="text-[#FF4B6B]">tcpip.sys</code> → Driver de rede</li>
                    <li><code class="text-[#FF4B6B]">atikmdag.sys</code> → Driver AMD antigo</li>
                </ul>
            </li>
            <li class="leading-relaxed">
                <strong>Anote o nome do driver problemático</strong>. Vamos usá-lo nas próximas etapas para aplicar a correção específica.
            </li>
        </ol>
        
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20 mt-6">
            <h4 class="text-[#31A8FF] font-bold mb-2">💡 Dica Profissional</h4>
            <p class="text-sm text-gray-300">
                Se o mesmo driver aparece em <strong>3 ou mais crashes</strong>, você tem 95% de certeza de que ele é o culpado. Se os crashes mostram drivers diferentes a cada vez, pule para a seção de diagnóstico de hardware (RAM/superaquecimento).
            </p>
        </div>
      `
        },
        {
            title: "Passo 2: Comandos de Correção Automática (SFC e DISM)",
            content: `
        <p class="mb-4 text-gray-300">
            Antes de partir para soluções avançadas, vamos tentar reparar automaticamente os arquivos corrompidos do sistema. O Windows 11 possui duas ferramentas poderosas de autocorreção:
        </p>
        
        <div class="bg-[#0A0A0F] border border-white/10 rounded-xl p-6 mb-6">
            <h4 class="text-white font-bold mb-4 flex items-center gap-2">
                <span class="text-2xl">🛠️</span> Reparação com SFC (System File Checker)
            </h4>
            <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4">
                <li>Abra o <strong>Prompt de Comando como Administrador</strong> (busque "cmd" no menu Iniciar, clique com botão direito e escolha "Executar como administrador").</li>
                <li>Digite o comando: <code class="bg-white/10 px-2 py-1 rounded text-[#31A8FF]">sfc /scannow</code> e pressione Enter.</li>
                <li>Aguarde (leva 10-20 minutos). O SFC vai escanhar todos os arquivos do Windows e substituir os corrompidos por cópias íntegras do cache do sistema.</li>
                <li>Ao finalizar, você verá uma mensagem dizendo se encontrou e corrigiu problemas.</li>
            </ol>
        </div>
        
        <div class="bg-[#0A0A0F] border border-white/10 rounded-xl p-6 mb-6">
            <h4 class="text-white font-bold mb-4 flex items-center gap-2">
                <span class="text-2xl">🔧</span> Reparação com DISM (Deployment Image Servicing)
            </h4>
            <p class="text-gray-300 mb-3">Se o SFC não resolveu, use o DISM (mais poderoso, repara a imagem do Windows completa):</p>
            <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4">
                <li>No CMD como administrador, execute em sequência:
                    <div class="bg-black/30 p-3 rounded mt-2 font-mono text-xs">
                        <p class="mb-1"><code class="text-[#31A8FF]">DISM /Online /Cleanup-Image /CheckHealth</code></p>
                        <p class="mb-1"><code class="text-[#31A8FF]">DISM /Online /Cleanup-Image /ScanHealth</code></p>
                        <p><code class="text-[#31A8FF]">DISM /Online /Cleanup-Image /RestoreHealth</code></p>
                    </div>
                </li>
                <li>O último comando pode levar até 30 minutos. Ele baixa arquivos do Windows Update para reparar a imagem do sistema.</li>
                <li>Após finalizar, rode o <code>sfc /scannow</code> novamente para garantir.</li>
            </ol>
        </div>
        
        <div class="bg-[#0A0A0F] border border-white/10 rounded-xl p-6">
            <h4 class="text-white font-bold mb-4 flex items-center gap-2">
                <span class="text-2xl">💾</span> Verificação de Disco (CHKDSK)
            </h4>
            <p class="text-gray-300 mb-3">Se as telas azuis mencionam <code>PAGE_FAULT</code> ou <code>NTFS</code>, pode ser corrupção no disco:</p>
            <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4">
                <li>No CMD como administrador, digite: <code class="bg-white/10 px-2 py-1 rounded text-[#31A8FF]">chkdsk C: /f /r</code></li>
                <li>O sistema pedirá para reiniciar. Digite <strong>S</strong> (Sim) e pressione Enter.</li>
                <li>Ao reiniciar, o PC ficará 30-60 minutos fazendo uma varredura completa do disco. <strong>Não desligue durante esse processo.</strong></li>
                <li>Após o boot, verifique se o problema foi corrigido.</li>
            </ol>
        </div>
      `
        },
        {
            title: "Passo 3: Corrigindo Drivers Problemáticos",
            content: `
        <p class="mb-4 text-gray-300">
            Se o BlueScreenView identificou um driver específico (.sys), aqui está como resolver:
        </p>
        
        <h4 class="text-white font-bold mb-3 mt-6">🎮 Drivers de Placa de Vídeo (nvlddmkm.sys / amdkmdag.sys)</h4>
        <p class="text-gray-300 mb-3">Esta é a causa #1 de telas azuis em PCs gamers. Solução definitiva:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4">
            <li><strong>Baixe o DDU (Display Driver Uninstaller)</strong> - ferramenta gratuita que remove completamente drivers de vídeo corrompidos.</li>
            <li>Reinicie o PC em <strong>Modo de Segurança</strong> (Shift + Reiniciar → Solução de Problemas → Opções Avançadas → Modo de Segurança).</li>
            <li>Execute o DDU, selecione o fabricante da sua placa (NVIDIA/AMD) e clique em "Limpar e Reiniciar".</li>
            <li>Após reiniciar normalmente, baixe o driver <strong>mais recente</strong> direto do site oficial (geforce.com para NVIDIA ou amd.com para AMD).</li>
            <li>Instale o driver LIMPO (não precisa de softwares extras como GeForce Experience se você não quiser).</li>
        </ol>
        
        <div class="bg-rose-900/10 p-4 rounded-xl border border-rose-500/20 mt-4 mb-6">
            <p class="text-sm text-gray-300">
                <strong>⚠️ NUNCA</strong> use programas como Driver Booster, Driver Easy ou similares para atualizar drivers de vídeo. Eles frequentemente instalam versões genéricas que causam mais problemas. Sempre baixe direto do fabricante.
            </p>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">🌐 Drivers de Rede (tcpip.sys / netio.sys / ndis.sys)</h4>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4">
            <li>Abra o <strong>Gerenciador de Dispositivos</strong> (clique direito no menu Iniciar → Gerenciador de Dispositivos).</li>
            <li>Expanda "Adaptadores de rede", clique direito no seu adaptador Wi-Fi/Ethernet → Propriedades.</li>
            <li>Vá na aba "Driver" e clique em "Reverter Driver" (se disponível) ou "Desinstalar Dispositivo".</li>
            <li>Reinicie o PC. O Windows vai reinstalar automaticamente um driver genérico estável.</li>
            <li>Se o problema persistir, baixe o driver mais recente do site do fabricante da sua placa-mãe (Asus, Gigabyte, MSI, etc.).</li>
        </ol>
        
        <h4 class="text-white font-bold mb-3 mt-6">💿 Drivers de Armazenamento (StorAHCI.sys / iaStorA.sys)</h4>
        <p class="text-gray-300 mb-3">Drivers SATA/NVMe desatualizados causam telas azuis com <code>DPC_WATCHDOG_VIOLATION</code>:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4">
            <li>Baixe os <strong>Chipset Drivers</strong> mais recentes do site da Intel (intel.com/chipset) ou AMD (amd.com/chipset).</li>
            <li>Instale o pacote completo (inclui drivers de USB, SATA, NVMe e outros componentes da placa-mãe).</li>
            <li>Reinicie o PC após a instalação.</li>
        </ol>
      `
        },
        {
            title: "Passo 4: Testando a Memória RAM",
            content: `
        <p class="mb-4 text-gray-300">
            Se você testou tudo acima e ainda tem telas azuis aleatórias (ou se o BlueScreenView aponta <code>ntoskrnl.exe</code> ou erros de <code>MEMORY_MANAGEMENT</code>), o problema provavelmente é hardware—especificamente, memória RAM com defeito.
        </p>
        
        <h4 class="text-white font-bold mb-3 mt-6">🧪 Método 1: Diagnóstico de Memória do Windows (Rápido)</h4>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4">
            <li>Pressione <kbd class="bg-white/10 px-2 py-1 rounded text-xs">Win + R</kbd>, digite <code>mdsched.exe</code> e pressione Enter.</li>
            <li>Escolha "Reiniciar agora e verificar problemas".</li>
            <li>O PC reiniciará para uma tela azul de diagnóstico (não é BSOD, é o teste). Aguarde 15-20 minutos.</li>
            <li>Se encontrar erros, você tem um pente de RAM defeituoso que precisa ser trocado.</li>
        </ol>
        
        <div class="bg-amber-900/10 p-4 rounded-xl border border-amber-500/20 mt-4 mb-6">
            <p class="text-sm text-gray-300">
                <strong>Limitação:</strong> O teste do Windows é básico. Ele pode não detectar erros intermitentes que só aparecem sob carga.
            </p>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">🔬 Método 2: Memtest86+ (Profissional)</h4>
        <p class="text-gray-300 mb-3">Para um diagnóstico 100% confiável, use o Memtest86+:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4">
            <li>Baixe o Memtest86+ (gratuito) e crie um pendrive bootável com ele.</li>
            <li>Reinicie o PC, entre na BIOS (geralmente apertando DEL ou F2 ao ligar) e configure o pendrive como primeiro dispositivo de boot.</li>
            <li>O Memtest vai rodar automaticamente. <strong>Deixe pelo menos 1 passagem completa</strong> (pode levar 2-8 horas dependendo da quantidade de RAM).</li>
            <li>Se aparecer <strong>qualquer erro vermelho</strong>, você tem RAM defeituosa. Identifique qual pente está com problema testando um de cada vez.</li>
            <li>Troque o módulo defeituoso. Memória RAM não tem reparo—se falhou, precisa ser substituída.</li>
        </ol>
        
        <h4 class="text-white font-bold mb-3 mt-6">🎯 Método 3: Teste de Eliminação (Prático)</h4>
        <p class="text-gray-300 mb-3">Se você tem 2 ou mais pentes de RAM:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4">
            <li>Desligue o PC, abra o gabinete e <strong>remova todos os pentes exceto um</strong>.</li>
            <li>Ligue o PC e use normalmente por alguns dias. Se as telas azuis pararem, o pente que você deixou está OK.</li>
            <li>Troque pelo outro pente e teste novamente. Se as telas azuis voltarem, você identificou o culpado.</li>
            <li>Este método é lento mas funciona quando você não tem tempo para o Memtest.</li>
        </ol>
      `
        },
        {
            title: "Passo 5: Superaquecimento e Monitoramento",
            content: `
        <p class="mb-4 text-gray-300">
            Telas azuis causadas por superaquecimento geralmente acontecem após 15-30 minutos de uso intenso (jogos, renderização). O Windows desliga o PC para evitar danos permanentes ao processador ou placa de vídeo.
        </p>
        
        <h4 class="text-white font-bold mb-3 mt-6">🌡️ Monitorando Temperaturas em Tempo Real</h4>
        <p class="text-gray-300 mb-3">Baixe o <strong>HWiNFO64</strong> (gratuito) para monitorar temperaturas:</p>
        <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
            <li><strong>CPU:</strong> Não deve passar de 80°C em carga máxima (jogos/renderização). Se atingir 90°C+, está superaquecendo.</li>
            <li><strong>GPU:</strong> Limite seguro é 85°C. Acima de 90°C já indica problema de refrigeração.</li>
            <li><strong>SSD NVMe:</strong> Alguns SSDs aquecem muito (especialmente Gen4). Acima de 70°C pode causar throttling e instabilidade.</li>
        </ul>
        
        <h4 class="text-white font-bold mb-3 mt-6">❄️ Soluções para Superaquecimento</h4>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4">
            <li><strong>Limpeza física:</strong> Acúmulo de poeira nos coolers reduz drasticamente a eficiência. Use ar comprimido para limpar.</li>
            <li><strong>Pasta térmica:</strong> Se seu PC tem mais de 2 anos, a pasta térmica da CPU pode estar seca. Trocar resolve 80% dos casos de superaquecimento de processador.</li>
            <li><strong>Cooler insuficiente:</strong> Se você fez upgrade de processador mas manteve o cooler antigo, ele pode não dar conta. Considere um cooler melhor.</li>
            <li><strong>Airflow do gabinete:</strong> Verifique se os ventiladores estão funcionando. O ideal é ter entrada de ar na frente/lateral e saída atrás/topo.</li>
            <li><strong>Overclock:</strong> Se você fez overclock na CPU/GPU/RAM, volte para as configurações padrão (stock) e teste se as telas azuis param.</li>
        </ol>
      `
        },
        {
            title: "Passo 6: Overclock e Configurações de BIOS",
            content: `
        <p class="mb-4 text-gray-300">
            Muitas telas azuis em PCs gamers são causadas por overclock instável—mesmo que você não tenha feito overclock manualmente, algumas placas-mãe vêm com perfis "Turbo" ou "OC" ativados por padrão.
        </p>
        
        <h4 class="text-white font-bold mb-3 mt-6">⚙️ Voltando para Configurações Padrão (Stock)</h4>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4">
            <li>Reinicie o PC e entre na BIOS/UEFI (geralmente apertando <kbd class="bg-white/10 px-2 py-1 rounded text-xs">DEL</kbd> ou <kbd class="bg-white/10 px-2 py-1 rounded text-xs">F2</kbd> ao ligar).</li>
            <li>Procure pela opção <strong>"Load Optimized Defaults"</strong> ou <strong>"Reset to Default Settings"</strong>.</li>
            <li>Salve e saia (geralmente <kbd class="bg-white/10 px-2 py-1 rounded text-xs">F10</kbd>).</li>
            <li>Teste se as telas azuis param. Se pararam, significa que alguma configuração de overclock estava instável.</li>
        </ol>
        
        <h4 class="text-white font-bold mb-3 mt-6">🎮 XMP/DOCP e Memória RAM</h4>
        <p class="text-gray-300 mb-3">O perfil XMP (Intel) ou DOCP (AMD) faz a RAM rodar na velocidade anunciada (ex: 3200MHz). Porém, em alguns casos isso causa instabilidade:</p>
        <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
            <li>Se você tem <code>MEMORY_MANAGEMENT</code> ou telas azuis aleatórias, teste <strong>desativar o XMP</strong> na BIOS.</li>
            <li>A RAM vai rodar mais lenta (geralmente 2133MHz ou 2400MHz), mas de forma estável.</li>
            <li>Se as telas azuis pararem, significa que sua RAM não aguenta o perfil XMP. Você pode tentar aumentar um pouco a voltagem da RAM (VRAM) na BIOS ou aceitar a velocidade menor.</li>
        </ul>
      `
        },
        {
            title: "Passo 7: Atualizações do Windows e BIOS",
            content: `
        <p class="mb-4 text-gray-300">
            Bugs no próprio Windows ou na BIOS (embora raros) podem causar telas azuis. Manter tudo atualizado é essencial.
        </p>
        
        <h4 class="text-white font-bold mb-3 mt-6">🔄 Atualizando o Windows 11</h4>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4">
            <li>Vá em Configurações → Windows Update.</li>
            <li>Clique em "Verificar atualizações" e instale tudo que estiver disponível.</li>
            <li>Reinicie o PC após as atualizações.</li>
            <li><strong>Importante:</strong> Certifique-se de estar pelo menos no Windows 11 versão 22H2 ou superior. Versões antigas tinham bugs críticos de kernel já corrigidos.</li>
        </ol>
        
        <h4 class="text-white font-bold mb-3 mt-6">⚡ Atualizando a BIOS (Somente se Necessário)</h4>
        <p class="text-gray-300 mb-3">Atualização de BIOS é uma operação delicada—só faça se tiver um problema específico que a nova BIOS corrige:</p>
        <div class="bg-rose-900/10 p-4 rounded-xl border border-rose-500/20 mb-4">
            <p class="text-sm text-gray-300">
                <strong>⚠️ RISCO:</strong> Se a atualização da BIOS falhar (queda de energia, arquivo errado), você pode "brickar" a placa-mãe. Só atualize se tiver certeza do que está fazendo.
            </p>
        </div>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4">
            <li>Descubra o modelo exato da sua placa-mãe (use o HWiNFO ou olhe fisicamente no componente).</li>
            <li>Vá no site do fabricante (Asus, Gigabyte, MSI, etc.) e baixe a BIOS mais recente.</li>
            <li>Leia o changelog (lista de mudanças). Se mencionar correções para "BSOD" ou "stability", vale a pena atualizar.</li>
            <li>Siga o tutorial específico do fabricante. Alguns usam utilitários dentro do Windows, outros exigem pendrive bootável.</li>
            <li><strong>Durante a atualização, NÃO desligue o PC de forma alguma.</strong></li>
        </ol>
      `
        },
        {
            title: "Passo 8: Software de Terceiros Problemáticos",
            content: `
        <p class="mb-4 text-gray-300">
            Alguns programas instalam drivers de kernel que conflitam com o Windows, causando telas azuis:
        </p>
        
        <h4 class="text-white font-bold mb-3 mt-6">🛡️ Antivírus e Firewalls</h4>
        <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
            <li><strong>Avast, AVG, Kaspersky, Norton:</strong> Conhecidos por causar <code>IRQL_NOT_LESS_OR_EQUAL</code> em algumas configurações.</li>
            <li><strong>Solução:</strong> Teste desinstalar completamente o antivírus (usar o Windows Defender é suficiente para 99% dos usuários) e veja se as telas azuis param.</li>
        </ul>
        
        <h4 class="text-white font-bold mb-3 mt-6">🎮 Software de RGB/Controle de Ventoinhas</h4>
        <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
            <li><strong>iCUE (Corsair), Aura Sync (Asus), Mystic Light (MSI):</strong> Drivers mal otimizados podem causar crashes.</li>
            <li><strong>Solução:</strong> Atualize para a versão mais recente ou desinstale temporariamente para testar.</li>
        </ul>
        
        <h4 class="text-white font-bold mb-3 mt-6">⚡ Software de Overclock/Monitoramento</h4>
        <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
            <li><strong>MSI Afterburner, RivaTuner, EVGA Precision:</strong> Se rodando perfis agressivos de OC, podem instabilizar o sistema.</li>
            <li><strong>Solução:</strong> Feche o programa ou remova os perfis de overclock automático.</li>
        </ul>
        
        <h4 class="text-white font-bold mb-3 mt-6">🖥️ Software de Virtualização</h4>
        <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
            <li><strong>VirtualBox, VMware:</strong> O Hyper-V (virtualização do Windows) pode conflitar com outros hipervisores.</li>
            <li><strong>Solução:</strong> Desative o Hyper-V no Painel de Controle → Programas e Recursos → Ativar ou desativar recursos do Windows.</li>
        </ul>
      `
        },
        {
            title: "Quando Chamar um Técnico Profissional",
            content: `
        <p class="mb-4 text-gray-300">
            Se você seguiu todas as etapas acima e ainda está tendo telas azuis, pode ser um problema que exige diagnóstico avançado ou troca de hardware:
        </p>
        
        <div class="bg-[#0A0A0F] border border-[#FF4B6B]/20 rounded-xl p-6">
            <h4 class="text-[#FF4B6B] font-bold mb-4">🚨 Sinais de que Você Precisa de Ajuda Profissional:</h4>
            <ul class="list-disc list-inside text-gray-300 space-y-3 ml-4">
                <li>Telas azuis acontecem <strong>mesmo após formatar completamente o Windows</strong> (indica problema de hardware).</li>
                <li>O BlueScreenView mostra <strong>drivers diferentes a cada crash</strong> (memória RAM ou placa-mãe falhando).</li>
                <li>O PC trava ou desliga antes mesmo de aparecer a tela azul (superaquecimento crítico ou fonte de alimentação fraca).</li>
                <li>Você não se sente confortável em abrir o gabinete ou mexer na BIOS.</li>
                <li>Precisa do computador funcionando urgentemente e não tem tempo para testar componente por componente.</li>
            </ul>
        </div>
        
        <p class="mt-6 text-gray-300">
            Nestes casos, um técnico especializado pode fazer diagnóstico com equipamentos profissionais (testador de fonte, testador de RAM, multímetro para placa-mãe) e identificar o problema em minutos. A <strong>VOLTRIS oferece diagnóstico remoto e presencial</strong> para resolver telas azuis persistentes.
        </p>
      `
        },
        {
            title: "Prevenção: Como Evitar Telas Azuis no Futuro",
            content: `
        <p class="mb-4 text-gray-300">
            Depois de resolver o problema, siga estas práticas para minimizar as chances de novas telas azuis:
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-[#0A0A0F] border border-white/5 rounded-xl p-5">
                <h4 class="text-white font-bold mb-3 flex items-center gap-2">
                    <span class="text-xl">✅</span> Boas Práticas
                </h4>
                <ul class="list-disc list-inside text-gray-300 space-y-2 text-sm">
                    <li>Mantenha o Windows sempre atualizado</li>
                    <li>Atualize drivers de vídeo a cada 2-3 meses</li>
                    <li>Limpe a poeira do PC a cada 6 meses</li>
                    <li>Use um nobreak para proteger contra quedas de energia</li>
                    <li>Não instale programas de "limpeza" ou "otimização" duvidosos</li>
                    <li>Monitore temperaturas periodicamente</li>
                </ul>
            </div>
            
            <div class="bg-[#0A0A0F] border border-white/5 rounded-xl p-5">
                <h4 class="text-white font-bold mb-3 flex items-center gap-2">
                    <span class="text-xl">❌</span> O Que Evitar
                </h4>
                <ul class="list-disc list-inside text-gray-300 space-y-2 text-sm">
                    <li>Não force desligamentos (segurar o botão liga/desliga)</li>
                    <li>Não use "Driver Updaters" automáticos</li>
                    <li>Não faça overclock sem conhecimento técnico</li>
                    <li>Não abra muitos programas pesados simultaneamente em PCs fracos</li>
                    <li>Não instale múltiplos antivírus ao mesmo tempo</li>
                    <li>Não ignore avisos de temperatura alta</li>
                </ul>
            </div>
        </div>
        
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20 mt-6">
            <h4 class="text-[#31A8FF] font-bold mb-2">💾 Backup é Essencial</h4>
            <p class="text-sm text-gray-300">
                Mesmo seguindo todas as precauções, hardware pode falhar sem aviso. <strong>Mantenha backups regulares</strong> dos seus arquivos importantes (fotos, documentos, projetos). Use a regra 3-2-1: 3 cópias, 2 mídias diferentes, 1 cópia externa (nuvem).
            </p>
        </div>
      `
        },
        {
            title: "Ferramentas Profissionais para Diagnóstico de BSOD",
            content: `
                <div class="bg-gradient-to-r from-purple-900/20 to-blue-900/20 p-6 rounded-xl border border-purple-500/30 my-6">
                    <h4 class="text-xl font-bold text-purple-300 mb-4">Software Avançado para Análise de Crashes</h4>
                    
                    <h5 class="text-lg font-semibold text-white mt-6 mb-3">WinDbg Preview (Microsoft)</h5>
                    <p class="text-gray-300 mb-4">
                        A ferramenta oficial da Microsoft para análise de dumps de memória. É mais complexa que o BlueScreenView, mas oferece insights detalhados sobre o que causou o crash:
                    </p>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                            <h6 class="font-bold text-green-400 mb-2">Instalação</h6>
                            <ul class="text-sm text-gray-300 space-y-1">
                                <li>• Baixe do Microsoft Store (WinDbg Preview)</li>
                                <li>• Abra o arquivo de dump em C:\\Windows\\Minidump</li>
                                <li>• Configure o símbolo path: SRV*C:\\Symbols*https://msdl.microsoft.com/download/symbols</li>
                                <li>• Execute o comando "!analyze -v" para análise detalhada</li>
                            </ul>
                        </div>
                        
                        <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                            <h6 class="font-bold text-green-400 mb-2">Análise Avançada</h6>
                            <ul class="text-sm text-gray-300 space-y-1">
                                <li>• Comando "!pool [address]" para investigar pool corruption</li>
                                <li>• Comando "!process 0 0" para ver todos os processos ativos</li>
                                <li>• Comando "!thread 0 0" para ver todos os threads</li>
                                <li>• Comando "!vm" para análise de memória virtual</li>
                            </ul>
                        </div>
                    </div>
                    
                    <h5 class="text-lg font-semibold text-white mt-6 mb-3">WhoCrashed Professional Edition</h5>
                    <p class="text-gray-300 mb-4">
                        Ferramenta comercial (com versão gratuita limitada) que automatiza parte da análise de dumps:
                    </p>
                    
                    <div class="bg-yellow-900/20 p-4 rounded-lg border border-yellow-500/30 mb-4">
                        <ul class="text-gray-300 space-y-2">
                            <li>• Interface gráfica intuitiva para análise de crashes</li>
                            <li>• Detecção automática de drivers problemáticos</li>
                            <li>• Comparação com banco de dados de problemas conhecidos</li>
                            <li>• Relatórios detalhados com histórico de crashes</li>
                        </ul>
                    </div>
                </div>
            `
        },
        {
            title: "Diagnóstico de Hardware Avançado",
            content: `
                <div class="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 p-6 rounded-xl border border-indigo-500/30 my-6">
                    <h4 class="text-xl font-bold text-indigo-300 mb-4">Testes Profissionais para Componentes de Hardware</h4>
                    
                    <h5 class="text-lg font-semibold text-white mt-6 mb-3">Teste de Fonte de Alimentação</h5>
                    <p class="text-gray-300 mb-4">
                        A fonte de alimentação é frequentemente negligenciada como causa de telas azuis, mas pode ser a culpada:
                    </p>
                    
                    <div class="overflow-x-auto mb-6">
                        <table class="w-full border-collapse border border-gray-700 text-sm">
                            <thead>
                                <tr class="bg-gray-800">
                                    <th class="border border-gray-700 px-4 py-2 text-left">Componente</th>
                                    <th class="border border-gray-700 px-4 py-2 text-left">Problema Comum</th>
                                    <th class="border border-gray-700 px-4 py-2 text-left">Sintoma</th>
                                    <th class="border border-gray-700 px-4 py-2 text-left">Solução</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="bg-gray-800/50">
                                    <td class="border border-gray-700 px-4 py-2">+12V (PCIe)</td>
                                    <td class="border border-gray-700 px-4 py-2">Queda de tensão</td>
                                    <td class="border border-gray-700 px-4 py-2">VIDEO_TDR_FAILURE</td>
                                    <td class="border border-gray-700 px-4 py-2">Substituir fonte com potência adequada</td>
                                </tr>
                                <tr>
                                    <td class="border border-gray-700 px-4 py-2">+5V (SATA)</td>
                                    <td class="border border-gray-700 px-4 py-2">Flutuação</td>
                                    <td class="border border-gray-700 px-4 py-2">PAGE_FAULT_IN_NONPAGED_AREA</td>
                                    <td class="border border-gray-700 px-4 py-2">Testar com multímetro ou substituir</td>
                                </tr>
                                <tr class="bg-gray-800/50">
                                    <td class="border border-gray-700 px-4 py-2">+3.3V (Chipset)</td>
                                    <td class="border border-gray-700 px-4 py-2">Instabilidade</td>
                                    <td class="border border-gray-700 px-4 py-2">SYSTEM_THREAD_EXCEPTION_NOT_HANDLED</td>
                                    <td class="border border-gray-700 px-4 py-2">Substituir fonte ou testar com multímetro</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                    <h5 class="text-lg font-semibold text-white mt-6 mb-3">Teste de Placa-Mãe e CPU</h5>
                    <p class="text-gray-300 mb-4">
                        Problemas na placa-mãe ou CPU podem causar telas azuis específicas:
                    </p>
                    
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div class="bg-gray-800/30 p-4 rounded-lg border border-gray-700">
                            <h6 class="font-bold text-blue-400 mb-2">CPU Tests:</h6>
                            <ul class="text-sm text-gray-300 space-y-1">
                                <li>• Use Prime95 para stress test da CPU</li>
                                <li>• Teste de 30 minutos no modo Blend</li>
                                <li>• Monitore temperatura com HWiNFO64</li>
                                <li>• Se ocorrer crash, pode indicar problema de CPU ou térmica</li>
                            </ul>
                        </div>
                        
                        <div class="bg-gray-800/30 p-4 rounded-lg border border-gray-700">
                            <h6 class="font-bold text-blue-400 mb-2">Motherboard Tests:</h6>
                            <ul class="text-sm text-gray-300 space-y-1">
                                <li>• Verifique capacitores inchados</li>
                                <li>• Teste slots de RAM individualmente</li>
                                <li>• Verifique conectores SATA/M.2</li>
                                <li>• Atualize BIOS para última versão estável</li>
                            </ul>
                        </div>
                    </div>
                </div>
            `
        },
        {
            title: "Análise de Eventos do Sistema",
            content: `
                <div class="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 p-6 rounded-xl border border-cyan-500/30 my-6">
                    <h4 class="text-xl font-bold text-cyan-300 mb-4">Log de Eventos para Identificação de Padrões</h4>
                    
                    <h5 class="text-lg font-semibold text-white mt-6 mb-3">Usando o Visualizador de Eventos</h5>
                    <p class="text-gray-300 mb-4">
                        O Windows registra eventos antes e após telas azuis que podem revelar padrões:
                    </p>
                    
                    <div class="space-y-4 mb-6">
                        <div class="flex items-start space-x-3">
                            <div class="bg-green-500 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">
                                <span class="text-xs font-bold text-white">1</span>
                            </div>
                            <div>
                                <h6 class="font-bold text-green-400">Abrindo o Visualizador de Eventos</h6>
                                <p class="text-sm text-gray-300">Pressione Win+R, digite "eventvwr.msc" e pressione Enter</p>
                            </div>
                        </div>
                        
                        <div class="flex items-start space-x-3">
                            <div class="bg-green-500 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">
                                <span class="text-xs font-bold text-white">2</span>
                            </div>
                            <div>
                                <h6 class="font-bold text-green-400">Navegando para Logs Críticos</h6>
                                <p class="text-sm text-gray-300">Vá para "Windows Logs" → "System" e filtre por "Critical" e "Error"</p>
                            </div>
                        </div>
                        
                        <div class="flex items-start space-x-3">
                            <div class="bg-green-500 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">
                                <span class="text-xs font-bold text-white">3</span>
                            </div>
                            <div>
                                <h6 class="font-bold text-green-400">Identificando Padrões</h6>
                                <p class="text-sm text-gray-300">Procure eventos 1001 (Kernel-Power) e 41 (Kernel-Power) que ocorrem antes do BSOD</p>
                            </div>
                        </div>
                    </div>
                    
                    <h5 class="text-lg font-semibold text-white mt-6 mb-3">Event IDs Relevantes</h5>
                    <p class="text-gray-300 mb-4">
                        Eventos específicos que precedem telas azuis:
                    </p>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="bg-red-900/20 p-4 rounded-lg border border-red-500/30">
                            <h6 class="font-bold text-red-400 mb-2">Event ID 1001</h6>
                            <ul class="text-sm text-gray-300 space-y-1">
                                <li>• Indica que o Windows detectou um problema de integridade</li>
                                <li>• Normalmente precede telas azuis de hardware</li>
                                <li>• Pode indicar corrupção de memória ou falha de driver</li>
                            </ul>
                        </div>
                        
                        <div class="bg-blue-900/20 p-4 rounded-lg border border-blue-500/30">
                            <h6 class="font-bold text-blue-400 mb-2">Event ID 41</h6>
                            <ul class="text-sm text-gray-300 space-y-1">
                                <li>• Sistema desligou inesperadamente</li>
                                <li>• Confirma que houve um crash real (não apenas reinício)</li>
                                <li>• Útil para distinguir BSOD de outros tipos de falhas</li>
                            </ul>
                        </div>
                    </div>
                </div>
            `
        },
        {
            title: "Prevenção Proativa e Monitoramento Contínuo",
            content: `
                <div class="bg-gradient-to-r from-orange-900/20 to-red-900/20 p-6 rounded-xl border border-orange-500/30 my-6">
                    <h4 class="text-xl font-bold text-orange-300 mb-4">Sistema de Monitoramento para Prevenir BSODs</h4>
                    
                    <h5 class="text-lg font-semibold text-white mt-6 mb-3">Monitoramento de Hardware</h5>
                    <p class="text-gray-300 mb-4">
                        Ferramentas para monitoramento contínuo e alerta precoce de problemas:
                    </p>
                    
                    <div class="bg-gray-800/50 p-5 rounded-lg border border-gray-700 mb-6">
                        <h6 class="font-bold text-yellow-400 mb-3">Soluções de Monitoramento:</h6>
                        <ul class="text-gray-300 space-y-2">
                            <li>• <strong>HWiNFO64:</strong> Monitoramento em tempo real de temperaturas, voltagens e fans</li>
                            <li>• <strong>Core Temp:</strong> Monitoramento específico de CPU com alertas personalizados</li>
                            <li>• <strong>GPU-Z:</strong> Monitoramento de GPU com log de dados</li>
                            <li>• <strong>CrystalDiskInfo:</strong> Monitoramento de saúde de SSD/HDD</li>
                        </ul>
                    </div>
                    
                    <h5 class="text-lg font-semibold text-white mt-6 mb-3">Configurações de Alerta</h5>
                    <p class="text-gray-300 mb-4">
                        Configurações recomendadas para alertas de hardware:
                    </p>
                    
                    <div class="overflow-x-auto">
                        <table class="w-full border-collapse border border-gray-700 text-sm">
                            <thead>
                                <tr class="bg-gray-800">
                                    <th class="border border-gray-700 px-4 py-2 text-left">Componente</th>
                                    <th class="border border-gray-700 px-4 py-2 text-left">Limite de Alerta</th>
                                    <th class="border border-gray-700 px-4 py-2 text-left">Ação Recomendada</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="bg-gray-800/50">
                                    <td class="border border-gray-700 px-4 py-2">CPU Temperature</td>
                                    <td class="border border-gray-700 px-4 py-2">Acima de 80°C</td>
                                    <td class="border border-gray-700 px-4 py-2">Verificar pasta térmica e airflow</td>
                                </tr>
                                <tr>
                                    <td class="border border-gray-700 px-4 py-2">GPU Temperature</td>
                                    <td class="border border-gray-700 px-4 py-2">Acima de 85°C</td>
                                    <td class="border border-gray-700 px-4 py-2">Limpar cooler e verificar thermal paste</td>
                                </tr>
                                <tr class="bg-gray-800/50">
                                    <td class="border border-gray-700 px-4 py-2">SSD NVMe Temperature</td>
                                    <td class="border border-gray-700 px-4 py-2">Acima de 70°C</td>
                                    <td class="border border-gray-700 px-4 py-2">Verificar heatsink e airflow do gabinete</td>
                                </tr>
                                <tr>
                                    <td class="border border-gray-700 px-4 py-2">VRM Temperature</td>
                                    <td class="border border-gray-700 px-4 py-2">Acima de 100°C</td>
                                    <td class="border border-gray-700 px-4 py-2">Reduzir overclock ou melhorar refrigeração</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            `
        }
    ];

    const advancedContentSections = [
    {
      title: "Análise Profunda de Dumps de Memória e Depuração Avançada", 
      content: `
        <h4 class="text-white font-bold mb-3">🔬 Análise Técnica de Arquivos de Dump</h4>
        <p class="mb-4 text-gray-300">
          Para profissionais de suporte técnico e engenheiros de sistema, a análise detalhada de arquivos de dump permite identificar causas raiz de problemas complexos de estabilidade do sistema:
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div class="bg-blue-900/10 p-4 rounded-lg border border-blue-500/20">
            <h5 class="text-blue-400 font-bold mb-2">Ferramentas de Análise</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>• WinDbg (Windows Debugger)</li>
              <li>• BlueScreenView (NirSoft)</li>
              <li>• WhoCrashed (Beta Solutions)</li>
              <li>• Crash Dump Analyzer (Sysinternals)</li>
              <li>• dumpwin (Linux alternative)</li>
              <li>• Volatility (Memory Forensics)</li>
            </ul>
          </div>
          
          <div class="bg-purple-900/10 p-4 rounded-lg border border-purple-500/20">
            <h5 class="text-purple-400 font-bold mb-2">Comandos Essenciais</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>• !analyze -v (análise detalhada)</li>
              <li>• lm (listar módulos carregados)</li>
              <li>• !pool [address] (análise de pool)</li>
              <li>• !process 0 0 (todos os processos)</li>
              <li>• !thread 0 0 (todos os threads)</li>
              <li>• kb (stack trace)</li>
            </ul>
          </div>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">📊 Processo de Análise de Dump</h4>
        <p class="mb-4 text-gray-300">
          O processo sistemático para análise de dumps de memória:
        </p>
        
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-gray-300 border border-gray-700 rounded-lg">
            <thead class="bg-gray-800">
              <tr>
                <th class="p-3 text-left">Etapa</th>
                <th class="p-3 text-left">Descrição</th>
                <th class="p-3 text-left">Ferramenta</th>
                <th class="p-3 text-left">Resultado Esperado</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-t border-gray-700">
                <td class="p-3">1</td>
                <td class="p-3">Coleta de Dumps</td>
                <td class="p-3">Windows Crash Dumps</td>
                <td class="p-3">Arquivos .dmp em C:\Windows\Minidump</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3">2</td>
                <td class="p-3">Configuração de Símbolos</td>
                <td class="p-3">WinDbg</td>
                <td class="p-3">Path: SRV*C:\Symbols*https://msdl.microsoft.com/download/symbols</td>
              </tr>
              <tr class="border-t border-gray-700">
                <td class="p-3">3</td>
                <td class="p-3">Análise Inicial</td>
                <td class="p-3">!analyze -v</td>
                <td class="p-3">Identificação do driver culpado</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3">4</td>
                <td class="p-3">Análise de Stack</td>
                <td class="p-3">kb, !thread</td>
                <td class="p-3">Sequência de chamadas que levaram ao crash</td>
              </tr>
              <tr class="border-t border-gray-700">
                <td class="p-3">5</td>
                <td class="p-3">Validação de Driver</td>
                <td class="p-3">Driver Verifier</td>
                <td class="p-3">Teste de estabilidade do driver problemático</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="bg-amber-900/10 p-5 rounded-xl border border-amber-500/20 mt-6">
          <h4 class="text-amber-400 font-bold mb-2">🔍 Fato Técnico Importante</h4>
          <p class="text-sm text-gray-300">
            A análise de dumps de memória requer compreensão profunda da arquitetura do kernel do Windows. Os dumps contêm cópias da memória do kernel no momento do crash, permitindo aos engenheiros rever o estado exato do sistema e identificar condições de corrida, falhas de acesso à memória ou problemas de sincronização que levaram à tela azul.
          </p>
        </div>
      `
    },
    {
      title: "Técnicas Avançadas de Diagnóstico de Hardware e Monitoramento Proativo",
      content: `
        <h4 class="text-white font-bold mb-3">🔧 Diagnóstico de Hardware com Ferramentas Profissionais</h4>
        <p class="mb-4 text-gray-300">
          Diagnóstico preciso de hardware requer ferramentas especializadas e metodologias sistemáticas para isolar componentes problemáticos:
        </p>
        
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-gray-300 border border-gray-700 rounded-lg">
            <thead class="bg-gray-800">
              <tr>
                <th class="p-3 text-left">Componente</th>
                <th class="p-3 text-left">Ferramenta Profissional</th>
                <th class="p-3 text-left">Teste Específico</th>
                <th class="p-3 text-left">Indicador de Falha</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-t border-gray-700">
                <td class="p-3">RAM</td>
                <td class="p-3">Memtest86+ / RDTSC</td>
                <td class="p-3">Teste de memória com 13 algoritmos</td>
                <td class="p-3">Erros ECC, falhas de paridade, problemas de timing</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3">CPU</td>
                <td class="p-3">Prime95 / Linpack / AIDA64</td>
                <td class="p-3">Stress test vetorial</td>
                <td class="p-3">Superaquecimento, instabilidade de cache, falhas de execução</td>
              </tr>
              <tr class="border-t border-gray-700">
                <td class="p-3">GPU</td>
                <td class="p-3">FurMark / Unigine Heaven / OCCT</td>
                <td class="p-3">Stress test de shader e memória</td>
                <td class="p-3">Falhas de renderização, artefatos, throttling térmico</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3">Fonte</td>
                <td class="p-3">Multímetro / Osciloscópio / Power Supply Tester</td>
                <td class="p-3">Teste de ripple e tensão sob carga</td>
                <td class="p-3">Queda de tensão, ripple excessivo, falha sob carga</td>
              </tr>
              <tr class="border-t border-gray-700">
                <td class="p-3">SSD/HDD</td>
                <td class="p-3">CrystalDiskInfo / HD Tune / Victoria</td>
                <td class="p-3">Leitura de SMART e scan de superfície</td>
                <td class="p-3">Bad sectors, falhas de leitura, degradação de NAND</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">🌡️ Monitoramento Proativo de Hardware</h4>
        <p class="mb-4 text-gray-300">
          Monitoramento contínuo permite identificar problemas antes que causem falhas catastróficas:
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="bg-green-900/10 p-4 rounded-lg border border-green-500/20">
            <h5 class="text-green-400 font-bold mb-2">Temperatura</h5>
            <ul class="text-sm text-gray-300 space-y-1">
              <li>CPU: < 80°C em carga</li>
              <li>GPU: < 85°C em carga</li>
              <li>SSD: < 70°C em uso</li>
              <li>VRM: < 90°C em carga</li>
            </ul>
          </div>
          
          <div class="bg-cyan-900/10 p-4 rounded-lg border border-cyan-500/20">
            <h5 class="text-cyan-400 font-bold mb-2">Voltagem</h5>
            <li class="text-sm text-gray-300 space-y-1">
              <li>+12V: ±5% da nominal</li>
              <li>+5V: ±5% da nominal</li>
              <li>+3.3V: ±5% da nominal</li>
              <li>DDR4: 1.2V ±0.06V</li>
            </li>
          </div>
          
          <div class="bg-indigo-900/10 p-4 rounded-lg border border-indigo-500/20">
            <h5 class="text-indigo-400 font-bold mb-2">Desempenho</h5>
            <ul class="text-sm text-gray-300 space-y-1">
              <li>Utilização: < 90%</li>
              <li>Latência de RAM: < 80ns</li>
              <li>Velocidade do disco: >80% da nominal</li>
              <li>Fan RPM: >50% da nominal</li>
            </ul>
          </div>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">🛡️ Prevenção de Falhas de Hardware</h4>
        <p class="mb-4 text-gray-300">
          Estratégias proativas para evitar problemas de hardware:
        </p>
        
        <ul class="list-disc list-inside text-gray-300 space-y-2 mb-6">
          <li>Limpeza preventiva a cada 6 meses para remover poeira e manter fluxo de ar ideal</li>
          <li>Substituição preventiva de componentes após 3-5 anos de uso intenso</li>
          <li>Monitoramento contínuo com alertas configurados para limites críticos</li>
          <li>Backup regular de dados críticos antes que falhas ocorram</li>
          <li>Atualização de firmware de SSDs, placas-mãe e GPUs para corrigir bugs</li>
          <li>Testes de carga periódicos para validar estabilidade do sistema</li>
        </ul>
      `
    },
    {
      title: "Arquitetura de Estabilidade do Sistema e Recursos de Recuperação do Windows",
      content: `
        <h4 class="text-white font-bold mb-3">🏗️ Arquitetura de Estabilidade do Kernel do Windows</h4>
        <p class="mb-4 text-gray-300">
          O kernel do Windows implementa múltiplas camadas de proteção para detectar e responder a condições de erro crítico:
        </p>
        
        <h4 class="text-white font-bold mb-3">Componentes de Proteção do Sistema</h4>
        <p class="mb-4 text-gray-300">
          Arquitetura de proteção implementada no kernel do Windows:
        </p>
        
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-gray-300 border border-gray-700 rounded-lg">
            <thead class="bg-gray-800">
              <tr>
                <th class="p-3 text-left">Componente</th>
                <th class="p-3 text-left">Função</th>
                <th class="p-3 text-left">Mecanismo de Proteção</th>
                <th class="p-3 text-left">Versão de Implementação</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-t border-gray-700">
                <td class="p-3">Kernel Executive</td>
                <td class="p-3">Gerenciamento de recursos do sistema</td>
                <td class="p-3">Memory Protection, Pool Tracking</td>
                <td class="p-3">Windows NT 3.1+</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3">Hardware Abstraction Layer (HAL)</td>
                <td class="p-3">Interface com hardware</td>
                <td class="p-3">Hardware Error Handling</td>
                <td class="p-3">Windows NT 3.1+</td>
              </tr>
              <tr class="border-t border-gray-700">
                <td class="p-3">Driver Verifier</td>
                <td class="p-3">Detecção de erros em drivers</td>
                <td class="p-3">Fault Injection, Deadlock Detection</td>
                <td class="p-3">Windows 2000+</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3">Kernel Patch Protection (PatchGuard)</td>
                <td class="p-3">Proteção contra modificações ilegais</td>
                <td class="p-3">Signature Verification, Randomization</td>
                <td class="p-3">Windows XP SP2+</td>
              </tr>
              <tr class="border-t border-gray-700">
                <td class="p-3">Code Integrity (CI)</td>
                <td class="p-3">Verificação de assinaturas de código</td>
                <td class="p-3">Driver Signing Enforcement</td>
                <td class="p-3">Windows Vista+</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3">Hypervisor-Enforced Code Integrity (HVCI)</td>
                <td class="p-3">Execução segura de drivers</td>
                <td class="p-3">Microvisor-based Validation</td>
                <td class="p-3">Windows 10 TH2+</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">🔄 Recursos de Recuperação do Windows</h4>
        <p class="mb-4 text-gray-300">
          O Windows oferece múltiplos mecanismos de recuperação após falhas:
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div class="bg-red-900/10 p-4 rounded-lg border border-red-500/20">
            <h5 class="text-red-400 font-bold mb-2">Recuperação Automática</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>Automatic Repair (WinRE)</li>
              <li>Startup Repair</li>
              <li>System File Checker (SFC)</li>
              <li>Deployment Image Servicing (DISM)</li>
              <li>Memory Diagnostic</li>
              <li>Boot Configuration Data (BCD) Repair</li>
            </ul>
          </div>
          
          <div class="bg-yellow-900/10 p-4 rounded-lg border border-yellow-500/20">
            <h5 class="text-yellow-400 font-bold mb-2">Recuperação Manual</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>Safe Mode Boot Options</li>
              <li>Command Prompt Recovery</li>
              <li>System Restore Points</li>
              <li>Windows Recovery Environment (WinRE)</li>
              <li>Installation Media Recovery</li>
              <li>Driver Rollback Features</li>
            </ul>
          </div>
        </div>
        
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20 mt-6">
          <h4 class="text-blue-400 font-bold mb-2">🔬 Tendências Futuras em Estabilidade de Sistemas</h4>
          <p class="text-sm text-gray-300">
            A próxima geração de sistemas operacionais está implementando técnicas avançadas de detecção de falhas, incluindo inteligência artificial para prever falhas antes que ocorram, virtualização leve para isolamento de drivers instáveis, e mecanismos de auto-recuperação que podem restaurar componentes críticos em tempo de execução sem interromper o sistema.
          </p>
        </div>
      `
    }
  ];

    const additionalContentSections = [
    {
      title: "Driver Verifier: Ferramenta Profissional para Detecção de Problemas",
      content: `
        <h4 class="text-white font-bold mb-3">🛡️ Utilização do Driver Verifier para Diagnóstico Profundo</h4>
        <p class="mb-4 text-gray-300">
          O Driver Verifier é uma ferramenta poderosa do Windows que força drivers a seguir regras rígidas de programação, ajudando a identificar problemas que normalmente não apareceriam:
        </p>
        
        <h4 class="text-white font-bold mb-3">Configuração do Driver Verifier</h4>
        <p class="mb-4 text-gray-300">
          Passos para configurar o Driver Verifier para testes específicos:
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div class="bg-blue-900/10 p-4 rounded-lg border border-blue-500/20">
            <h5 class="text-blue-400 font-bold mb-2">Opções Básicas</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>• Standard Verification (padrão)</li>
              <li>• Pool Tracking (rastrear alocação de memória)</li>
              <li>• IRP Logging (rastrear requisições de E/S)</li>
              <li>• Descriptor Checking (verificar descritores)</li>
              <li>• I/O Verification (verificar operações de E/S)</li>
              <li>• Deadlock Detection (detectar deadlocks)</li>
            </ul>
          </div>
          
          <div class="bg-purple-900/10 p-4 rounded-lg border border-purple-500/20">
            <h5 class="text-purple-400 font-bold mb-2">Opções Avançadas</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>• Force IRQL Checking (verificar níveis de interrupção)</li>
              <li>• MINIPORT Verification (para drivers de rede)</li>
              <li>• DMA Verification (verificar acesso direto à memória)</li>
              <li>• Security Check (verificar permissões de acesso)</li>
              <li>• Signature Level Verification (verificar assinaturas)</li>
              <li>• Randomized Delay Testing (testar sob condições variáveis)</li>
            </ul>
          </div>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">🔧 Procedimento de Teste com Driver Verifier</h4>
        <p class="mb-4 text-gray-300">
          Como usar o Driver Verifier para identificar drivers problemáticos:
        </p>
        
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-gray-300 border border-gray-700 rounded-lg">
            <thead class="bg-gray-800">
              <tr>
                <th class="p-3 text-left">Etapa</th>
                <th class="p-3 text-left">Comando/Ação</th>
                <th class="p-3 text-left">Objetivo</th>
                <th class="p-3 text-left">Resultado Esperado</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-t border-gray-700">
                <td class="p-3">1</td>
                <td class="p-3">verifier /standard /driver [nome_do_driver.sys]</td>
                <td class="p-3">Configurar verificação padrão</td>
                <td class="p-3">Driver monitorado com verificações básicas</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3">2</td>
                <td class="p-3">Reiniciar o sistema</td>
                <td class="p-3">Aplicar configurações do verifier</td>
                <td class="p-3">Sistema inicia com driver sob verificação</td>
              </tr>
              <tr class="border-t border-gray-700">
                <td class="p-3">3</td>
                <td class="p-3">Usar o sistema normalmente</td>
                <td class="p-3">Submeter o driver a operações normais</td>
                <td class="p-3">Capturar possíveis violações de segurança</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3">4</td>
                <td class="p-3">Ocorre BSOD ou evento de erro</td>
                <td class="p-3">Verifier detecta problema no driver</td>
                <td class="p-3">Identificação precisa do driver problemático</td>
              </tr>
              <tr class="border-t border-gray-700">
                <td class="p-3">5</td>
                <td class="p-3">verifier /reset</td>
                <td class="p-3">Desativar verificação</td>
                <td class="p-3">Sistema retorna ao normal</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="bg-amber-900/10 p-5 rounded-xl border border-amber-500/20 mt-6">
          <h4 class="text-amber-400 font-bold mb-2">⚠️ Aviso Importante</h4>
          <p class="text-sm text-gray-300">
            O Driver Verifier pode tornar o sistema instável propositalmente para detectar problemas. Use apenas em sistemas de teste ou quando outros métodos de diagnóstico falharam. Nunca use em sistemas de produção críticos sem backup adequado.
          </p>
        </div>
      `
    },
    {
      title: "Análise Forense de Incidentes de Sistema e Recuperação de Dados",
      content: `
        <h4 class="text-white font-bold mb-3">🔍 Análise Forense após Falhas Críticas do Sistema</h4>
        <p class="mb-4 text-gray-300">
          Após falhas críticas como telas azuis repetidas, é importante realizar uma análise forense para entender a causa raiz e prevenir recorrência:
        </p>
        
        <h4 class="text-white font-bold mb-3">Processo de Análise Forense</h4>
        <p class="mb-4 text-gray-300">
          Etapas sistemáticas para investigação de falhas críticas:
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="bg-green-900/10 p-4 rounded-lg border border-green-500/20">
            <h5 class="text-green-400 font-bold mb-2">Coleta de Evidências</h5>
            <ul class="text-sm text-gray-300 space-y-1">
              <li>Arquivos de dump do kernel</li>
              <li>Logs do sistema e eventos</li>
              <li>Configurações do BIOS/UEFI</li>
              <li>Informações de hardware</li>
            </ul>
          </div>
          
          <div class="bg-cyan-900/10 p-4 rounded-lg border border-cyan-500/20">
            <h5 class="text-cyan-400 font-bold mb-2">Análise Técnica</h5>
            <li class="text-sm text-gray-300 space-y-1">
              <li>Análise de dumps com WinDbg</li>
              <li>Verificação de integridade de arquivos</li>
              <li>Testes de hardware</li>
              <li>Revisão de drivers instalados</li>
            </li>
          </div>
          
          <div class="bg-indigo-900/10 p-4 rounded-lg border border-indigo-500/20">
            <h5 class="text-indigo-400 font-bold mb-2">Relatório e Ações</h5>
            <ul class="text-sm text-gray-300 space-y-1">
              <li>Identificação da causa raiz</li>
              <li>Recomendações de correção</li>
              <li>Plano de prevenção</li>
              <li>Implementação de soluções</li>
            </ul>
          </div>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">💾 Recuperação de Dados após Falhas</h4>
        <p class="mb-4 text-gray-300">
          Procedimentos para recuperação de dados após falhas críticas:
        </p>
        
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-gray-300 border border-gray-700 rounded-lg">
            <thead class="bg-gray-800">
              <tr>
                <th class="p-3 text-left">Método</th>
                <th class="p-3 text-left">Ferramenta</th>
                <th class="p-3 text-left">Tipo de Falha</th>
                <th class="p-3 text-left">Taxa de Sucesso</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-t border-gray-700">
                <td class="p-3">Recuperação de Volume</td>
                <td class="p-3">TestDisk</td>
                <td class="p-3">Tabela de partição corrompida</td>
                <td class="p-3">85-95%</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3">Recuperação de Arquivos</td>
                <td class="p-3">PhotoRec</td>
                <td class="p-3">Arquivos excluídos ou corrompidos</td>
                <td class="p-3">70-85%</td>
              </tr>
              <tr class="border-t border-gray-700">
                <td class="p-3">Imagem de Disco</td>
                <td class="p-3">dd, ddrescue</td>
                <td class="p-3">Falha física de disco</td>
                <td class="p-3">60-80%</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3">Recuperação de RAM</td>
                <td class="p-3">WinHex, FTK Imager</td>
                <td class="p-3">Dados voláteis após falha</td>
                <td class="p-3">20-40% (tempo crítico)</td>
              </tr>
              <tr class="border-t border-gray-700">
                <td class="p-3">Recuperação de Registro</td>
                <td class="p-3">Registry Recon</td>
                <td class="p-3">Corrupção do registro do sistema</td>
                <td class="p-3">75-90%</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <p class="text-sm text-gray-300 italic mb-6">
          *Taxas de sucesso variam com a extensão da corrupção e tempo decorrido desde a falha.
        </p>
      `
    },
    {
      title: "Considerações Legais, Éticas e de Segurança em Diagnóstico de Sistemas",
      content: `
        <h4 class="text-white font-bold mb-3">⚖️ Aspectos Legais e Éticos em Diagnóstico de Sistemas</h4>
        <p class="mb-4 text-gray-300">
          O diagnóstico e reparo de sistemas computacionais envolve considerações legais e éticas importantes, especialmente quando se trata de sistemas corporativos ou de clientes:
        </p>
        
        <h4 class="text-white font-bold mb-3">Responsabilidades Legais do Técnico</h4>
        <p class="mb-4 text-gray-300">
          Principais obrigações legais ao diagnosticar e reparar sistemas:
        </p>
        
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-gray-300 border border-gray-700 rounded-lg">
            <thead class="bg-gray-800">
              <tr>
                <th class="p-3 text-left">Área</th>
                <th class="p-3 text-left">Responsabilidade</th>
                <th class="p-3 text-left">Consequência de Não Cumprimento</th>
                <th class="p-3 text-left">Norma Aplicável</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-t border-gray-700">
                <td class="p-3">Privacidade de Dados</td>
                <td class="p-3">Não acessar dados pessoais desnecessários ao diagnóstico</td>
                <td class="p-3">Multas e ações judiciais</td>
                <td class="p-3">LGPD, GDPR</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3">Segurança da Informação</td>
                <td class="p-3">Proteger dados durante o diagnóstico</td>
                <td class="p-3">Violação de segurança</td>
                <td class="p-3">ISO 27001, NIST</td>
              </tr>
              <tr class="border-t border-gray-700">
                <td class="p-3">Consentimento</td>
                <td class="p-3">Obter permissão para procedimentos de diagnóstico</td>
                <td class="p-3">Ações legais por invasão de privacidade</td>
                <td class="p-3">Legislação de proteção ao consumidor</td>
              </tr>
              <tr class="border-t border-gray-700 bg-gray-800/30">
                <td class="p-3">Confidencialidade</td>
                <td class="p-3">Manter segredo sobre informações empresariais</td>
                <td class="p-3">Quebra de contrato e processos</td>
                <td class="p-3">Contratos de confidencialidade</td>
              </tr>
              <tr class="border-t border-gray-700">
                <td class="p-3">Documentação</td>
                <td class="p-3">Registrar todas as ações realizadas</td>
                <td class="p-3">Falta de responsabilidade e auditoria</td>
                <td class="p-3">Normas de governança de TI</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <h4 class="text-white font-bold mb-3 mt-6">🔒 Práticas de Segurança Durante Diagnóstico</h4>
        <p class="mb-4 text-gray-300">
          Medidas de segurança para proteger sistemas durante diagnóstico:
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div class="bg-red-900/10 p-4 rounded-lg border border-red-500/20">
            <h5 class="text-red-400 font-bold mb-2">Proteção de Dados</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>Isolamento de rede durante diagnóstico</li>
              <li>Uso de ambientes sandbox para testes</li>
              <li>Restrição de acesso a dados sensíveis</li>
              <li>Criptografia de dados em trânsito</li>
              <li>Registro de todas as ações realizadas</li>
              <li>Descarte seguro de informações temporárias</li>
            </ul>
          </div>
          
          <div class="bg-green-900/10 p-4 rounded-lg border border-green-500/20">
            <h5 class="text-green-400 font-bold mb-2">Ética Profissional</h5>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>Transparência sobre limitações do diagnóstico</li>
              <li>Revelação honesta de problemas encontrados</li>
              <li>Respeito à propriedade intelectual do cliente</li>
              <li>Recomendações baseadas em necessidades reais</li>
              <li>Manutenção de competência técnica atualizada</li>
              <li>Evitar conflitos de interesse</li>
            </ul>
          </div>
        </div>
        
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20 mt-6">
          <h4 class="text-blue-400 font-bold mb-2">💡 Melhores Práticas para Técnicos</h4>
          <p class="text-sm text-gray-300">
            Ao diagnosticar e reparar sistemas, sempre documente suas ações, obtenha consentimento prévio para procedimentos invasivos, evite acessar dados desnecessários ao diagnóstico, e mantenha-se atualizado sobre as normas legais e éticas aplicáveis à sua jurisdição. A transparência e o respeito à privacidade do cliente são fundamentais para manter uma relação profissional de confiança.
          </p>
        </div>
      `
    }
  ];

    const faqItems = [
        {
            question: "O que fazer se a tela azul aparecer antes de conseguir fazer qualquer coisa no Windows?",
            answer: "Se o Windows não consegue nem iniciar sem dar tela azul, você precisa entrar no <strong>Modo de Segurança</strong>. Reinicie o PC várias vezes seguidas (forçando desligamento) até aparecer a tela de 'Preparando Reparo Automático'. Escolha 'Opções Avançadas' → 'Solução de Problemas' → 'Opções Avançadas' → 'Configurações de Inicialização' → 'Reiniciar' e pressione F4 para Modo de Segurança. Dentro do Modo de Segurança, você pode desinstalar drivers problemáticos ou usar o Ponto de Restauração."
        },
        {
            question: "Posso simplesmente ignorar a tela azul se ela aparece raramente?",
            answer: "Não é recomendado. Mesmo que seja rara, a tela azul indica que <strong>algo está errado</strong>. Se for um problema de hardware (como RAM começando a falhar), ignorar vai resultar em falhas piores no futuro—podendo até perder dados. O ideal é investigar com o BlueScreenView e corrigir a causa raiz."
        },
        {
            question: "A tela azul pode danificar meu PC permanentemente?",
            answer: "Não, a tela azul em si é um mecanismo de proteção—ela <strong>previne danos</strong> ao forçar o desligamento antes que o problema piore. O verdadeiro perigo é a causa da tela azul (ex: superaquecimento extremo ou picos de energia). Se você corrigir o problema rapidamente, não haverá danos permanentes."
        },
        {
            question: "Preciso formatar o Windows para corrigir telas azuis?",
            answer: "Na maioria dos casos, <strong>não</strong>. 90% das telas azuis são resolvidas atualizando/reinstalando drivers, reparando arquivos do sistema (SFC/DISM) ou corrigindo hardware (RAM, superaquecimento). Formatação só é necessária se houver corrupção profunda do Windows que os comandos de reparo não conseguem consertar—o que é raro."
        },
        {
            question: "Por que meu PC só dá tela azul quando jogo?",
            answer: "Jogos exigem 100% da GPU e CPU, expondo problemas que não aparecem em uso normal. As causas mais comuns são: <strong>driver de vídeo desatualizado/corrompido</strong> (70% dos casos), GPU superaquecendo por falta de limpeza, fonte de alimentação fraca que não aguenta o pico de consumo, ou overclock instável. Comece reinstalando o driver de vídeo com o DDU."
        },
        {
            question: "O código de erro da tela azul muda toda vez. O que significa?",
            answer: "Quando os códigos são <strong>aleatórios</strong> (sem repetir um específico), geralmente indica problema de hardware instável: memória RAM com defeito físico (mais comum), superaquecimento crítico, ou fonte de alimentação falhando. Teste a RAM com Memtest86+ e monitore as temperaturas com HWiNFO."
        },
        {
            question: "Comprei RAM nova e agora tenho telas azuis. Por quê?",
            answer: "Pode ser incompatibilidade ou configuração errada. Verifique: 1) A RAM é compatível com sua placa-mãe? (DDR4 vs DDR5, velocidade suportada). 2) Está nos slots corretos? (Consulte o manual da placa—geralmente slots A2 e B2 para dual-channel). 3) O perfil XMP pode estar muito agressivo—teste desativar o XMP na BIOS. 4) Em último caso, a RAM pode ter vindo com defeito de fábrica (acontece em ~2% dos casos)—teste com Memtest86+."
        },
        {
            question: "BlueScreenView mostra 'ntoskrnl.exe' como culpado. E agora?",
            answer: "<code>ntoskrnl.exe</code> é o núcleo (kernel) do Windows. Quando ele aparece como culpado, geralmente <strong>não é o problema real</strong>—ele apenas estava executando quando outra coisa falhou. Na maioria dos casos, é memória RAM com defeito. Rode o Diagnóstico de Memória do Windows e, se possível, o Memtest86+. Se a RAM estiver OK, pode ser problema de placa-mãe ou processador (mais raro)."
        },
        {
            question: "Atualizei o Windows e comecei a ter telas azuis. Posso reverter?",
            answer: "Sim. Vá em Configurações → Windows Update → Histórico de atualizações → Desinstalar atualizações. Remova a atualização mais recente e reinicie. Se as telas azuis pararem, significa que a atualização tinha um bug. Aguarde a Microsoft lançar uma correção (geralmente em 1-2 semanas) antes de instalar novamente. Alternativamente, você pode reverter para a versão anterior do Windows em Configurações → Sistema → Recuperação → 'Voltar' (disponível por 10 dias após a atualização)."
        },
        {
            question: "Tela azul com erro WHEA_UNCORRECTABLE_ERROR. O que é?",
            answer: "Este é um erro de <strong>hardware crítico</strong> detectado pelo sistema. Causas comuns: 1) Overclock de CPU/GPU instável (solução: voltar para configurações padrão na BIOS). 2) Processador com defeito físico (raro, mas acontece). 3) Problemas na placa-mãe (VRM superaquecendo, capacitores inchados). 4) Fonte de alimentação entregando voltagem irregular. Se resetar a BIOS não resolver, você precisará de diagnóstico profissional de hardware."
        },
        {
            question: "Vale a pena usar programas como FixWin ou similares para corrigir telas azuis?",
            answer: "<strong>Não</strong>. Programas automáticos de 'fix' raramente resolvem telas azuis e podem piorar a situação ao alterar configurações críticas do sistema. O método correto é: 1) Identificar o driver específico com BlueScreenView. 2) Aplicar a correção direcionada (atualizar/reinstalar o driver problemático). 3) Testar hardware se necessário. Não existe 'conserto mágico'—cada tela azul tem uma causa específica que precisa ser investigada."
        },
        {
            question: "Meu PC dá tela azul e reinicia tão rápido que não consigo ler o erro. Como ver?",
            answer: "O Windows está configurado para reiniciar automaticamente. Para desativar: 1) Clique direito em 'Este Computador' → Propriedades → Configurações avançadas do sistema → aba 'Avançado' → Inicialização e Recuperação → 'Configurações'. 2) Desmarque a opção <strong>'Reiniciar automaticamente'</strong>. 3) Agora, quando der tela azul, ela ficará parada na tela para você anotar o código de erro. Mas lembre-se: você não precisa anotar—o BlueScreenView lê os dumps salvos automaticamente."
        }
    ];

    const externalReferences = [
        { name: "Microsoft Docs - Analisando Telas Azuis", url: "https://learn.microsoft.com/en-us/windows-hardware/drivers/debugger/" },
        { name: "NirSoft BlueScreenView (Download Oficial)", url: "https://www.nirsoft.net/utils/blue_screen_view.html" },
        { name: "Memtest86+ (Teste de RAM Profissional)", url: "https://www.memtest.org/" }
    ];

    const relatedGuides = [
        {
            href: "/guias/como-usar-ddu-driver-uninstaller",
            title: "Como Usar o DDU (Display Driver Uninstaller)",
            description: "Guia completo para remover drivers de vídeo corrompidos com segurança."
        },
        {
            href: "/guias/monitorar-temperatura-pc",
            title: "Monitorar Temperatura do PC",
            description: "Descubra se seu computador está superaquecendo e causando crashes."
        },
        {
            href: "/guias/criar-ponto-restauracao-windows",
            title: "Criar Ponto de Restauração no Windows",
            description: "Volte o sistema para um estado estável antes dos problemas começarem."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="45 min"
            difficultyLevel="Avançado"
            contentSections={contentSections}
            advancedContentSections={advancedContentSections}
            additionalContentSections={additionalContentSections}
            summaryTable={summaryTable}
            faqItems={faqItems}
            externalReferences={externalReferences}
            relatedGuides={relatedGuides}
        />
    );
}