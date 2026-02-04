import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

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
        { label: "Dificuldade", value: "Médio" }
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
                <li>Aguarde (leva 10-20 minutos). O SFC vai escanear todos os arquivos do Windows e substituir os corrompidos por cópias íntegras do cache do sistema.</li>
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
            <li>Descubra o modelo exato da sua placa-mãe (use o HWiNFO ou olhe físicamente no componente).</li>
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
            estimatedTime="30 min"
            difficultyLevel="Médio"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
