import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
    id: 'diagnostico-hardware',
    title: "Diagnóstico de Hardware: Como Descobrir Qual Peça do PC Está com Defeito (2026)",
    description: "Guia completo com ferramentas gratuitas para testar RAM, SSD, CPU, GPU e fonte de alimentação. Descubra qual componente está causando travamentos, telas azuis e instabilidade.",
    category: 'hardware',
    difficulty: 'Intermediário',
    time: '45 min'
};

const title = "Diagnóstico de Hardware: Como Descobrir Qual Peça do PC Está com Defeito (2026)";
const description = "PC travando, dando tela azul ou não liga? Com as ferramentas certas, você pode diagnosticar RAM, SSD, CPU, GPU e fonte em 30 minutos — sem precisar de técnico. Guia completo com ferramentas gratuitas.";
const keywords = [
    'como fazer diagnostico de hardware pc 2026',
    'testar saude memoria ram e ssd tutorial',
    'ferramentas diagnostico pc travando guia completo',
    'como saber qual peça do pc esta com defeito 2026',
    'stress test cpu e gpu tutorial completo 2026',
    'OCCT furmark cinebench teste estabilidade',
    'testmem5 ram erro diagnostico',
    'crystaldiskinfo saude ssd nvme'
];

export const metadata: Metadata = createGuideMetadata('diagnostico-hardware', title, description, keywords);

export default function HardwareDiagnosticGuide() {
    const summaryTable = [
        { label: "Teste de RAM", value: "TestMem5 (Windows) / MemTest86+ (boot)" },
        { label: "Teste de SSD/HD", value: "CrystalDiskInfo (saúde S.M.A.R.T.)" },
        { label: "Teste de CPU", value: "Cinebench R23 / OCCT" },
        { label: "Teste de GPU", value: "FurMark / OCCT GPU" },
        { label: "Teste de Fonte", value: "OCCT Power Supply Test" },
        { label: "Tempo do diagnóstico", value: "30 min a 2 horas (depende do componente)" },
    ];

    const keyPoints = [
        "Como identificar qual peça específica está causando o problema",
        "Ferramentas gratuitas e confiáveis para cada componente",
        "Como interpretar os resultados dos testes de estresse",
        "Sinais de alerta no CrystalDiskInfo para SSDs moribundos",
        "Como testar a fonte de alimentação sem multímetro",
        "Quando a tela azul é culpa da RAM vs. do driver",
    ];

    const contentSections = [
        {
            title: "Como Abordar o Diagnóstico — Metodologia",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Diagnóstico de hardware eficiente segue uma regra básica: <strong>isole um componente por vez</strong>. Tentar testar tudo ao mesmo tempo só gera confusão. A metodologia correta é:
        </p>
        <div class="space-y-3 mb-6">
            <div class="flex items-start gap-4 bg-[#0A0A0F] border border-white/5 p-4 rounded-xl">
                <span class="text-2xl font-bold text-[#31A8FF] w-8 shrink-0">1.</span>
                <div>
                    <strong class="text-white">Observe os Sintomas</strong>
                    <p class="text-gray-400 text-sm mt-1">Tela azul aleatória = provável RAM ou driver. PC desliga sob carga = provável superaquecimento ou fonte fraca. PC não liga = fonte, placa mãe ou RAM.</p>
                </div>
            </div>
            <div class="flex items-start gap-4 bg-[#0A0A0F] border border-white/5 p-4 rounded-xl">
                <span class="text-2xl font-bold text-[#31A8FF] w-8 shrink-0">2.</span>
                <div>
                    <strong class="text-white">Comece pelo mais fácil</strong>
                    <p class="text-gray-400 text-sm mt-1">Sempre teste software antes de hardware. Um driver corrompido causa os mesmos sintomas que RAM ruim. Limpe drivers → teste RAM → teste SSD → teste CPU/GPU → teste fonte.</p>
                </div>
            </div>
            <div class="flex items-start gap-4 bg-[#0A0A0F] border border-white/5 p-4 rounded-xl">
                <span class="text-2xl font-bold text-[#31A8FF] w-8 shrink-0">3.</span>
                <div>
                    <strong class="text-white">Documente tudo</strong>
                    <p class="text-gray-400 text-sm mt-1">Tire print dos resultados dos testes. Se você for a uma assistência técnica depois, isso economiza horas de trabalho deles (e dinheiro seu).</p>
                </div>
            </div>
        </div>
        <div class="bg-yellow-900/10 border-l-4 border-yellow-500 p-5 rounded-r-lg">
            <h4 class="text-yellow-400 font-bold mb-2">⚠️ Antes de Tudo: Verifique as Temperaturas</h4>
            <p class="text-gray-300 text-sm">Baixe o <strong>HWiNFO64</strong> e monitore as temperaturas enquanto reproduz o problema. Um PC que desliga a 95°C+ na CPU ou GPU não precisa de diagnóstico complexo — precisa de troca de pasta térmica ou melhor refrigeração. Confira nosso guia de <a href="/guias/monitorar-temperatura-pc" class="text-[#31A8FF] hover:underline">monitoramento de temperatura</a>.</p>
        </div>
      `
        },
        {
            title: "Teste de RAM — O Suspeito Número 1",
            content: `
        <p class="mb-4 text-gray-300 leading-relaxed">
          A RAM é responsável por mais de <strong>40% dos casos de tela azul aleatória</strong> em computadores aparentemente saudáveis. O problema é que erros de RAM são difíceis de reproduzir — eles aparecem em momentos aleatórios.
        </p>
        <h4 class="text-white font-bold mb-4 mt-6">🛠️ Ferramenta #1: TestMem5 (Windows, 30 minutos)</h4>
        <p class="mb-3 text-gray-300 text-sm">O melhor teste de RAM que roda dentro do próprio Windows.</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4 mb-6">
            <li>Baixe o <strong>TestMem5</strong> (busque no Google "TestMem5 anta777 download").</li>
            <li>Baixe também o perfil <strong>extreme4.cfg</strong> do autor anta777.</li>
            <li>Coloque o arquivo .cfg na mesma pasta do tm5.exe.</li>
            <li>Execute o tm5.exe como Administrador.</li>
            <li>Deixe rodando por pelo menos <strong>2 ciclos completos</strong> (1-2 horas).</li>
            <li>Qualquer erro em vermelho = RAM com problema.</li>
        </ol>
        <h4 class="text-white font-bold mb-4">🛠️ Ferramenta #2: MemTest86+ (Antes do Boot)</h4>
        <p class="mb-3 text-gray-300 text-sm">Mais completo, pois roda fora do Windows e testa a RAM pura.</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-2 ml-4 mb-6">
            <li>Baixe o MemTest86+ em memtest.org.</li>
            <li>Use o Rufus para criar um pen drive bootável.</li>
            <li>Reinicie o PC e boot pelo pen drive.</li>
            <li>Deixe rodar pelo menos 8 passes (2-4 horas).</li>
            <li>Zero erros = RAM saudável.</li>
        </ol>
        <div class="bg-green-900/10 border-l-4 border-green-500 p-5 rounded-r-lg">
            <h4 class="text-green-400 font-bold mb-2">💡 Dica: Perfil XMP/EXPO</h4>
            <p class="text-gray-300 text-sm">Se você tem XMP/EXPO ativado na BIOS e a RAM falha nos testes, tente <strong>desativar o XMP</strong> e testar na frequência base (2133/3200 MHz). RAM instável no XMP não significa RAM com defeito — pode ser que o IMC do processador não suporte aquela frequência específica.</p>
        </div>
      `
        },
        {
            title: "Teste de SSD e HD — CrystalDiskInfo",
            content: `
        <p class="mb-4 text-gray-300 leading-relaxed">
          Discos com problema causam corrupção de arquivos, crashes do Windows, lentidão extrema e em casos críticos, o PC pode nem conseguir inicializar. A tecnologia S.M.A.R.T. (Self-Monitoring, Analysis and Reporting Technology) permite detectar falhas iminentes antes que o disco morra.
        </p>
        <h4 class="text-white font-bold mb-3">Como usar o CrystalDiskInfo:</h4>
        <ol class="list-decimal list-inside text-gray-300 space-y-3 ml-4 mb-6">
            <li>Baixe e instale o <strong>CrystalDiskInfo</strong> (crystalmark.info — versão gratuita).</li>
            <li>Abra o programa. Ele listará todos os discos do sistema.</li>
            <li>Verifique o <strong>Status de Saúde</strong> no topo de cada disco:</li>
        </ol>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            <div class="bg-[#0A0A0F] border border-green-500/30 p-4 rounded-xl">
                <span class="text-green-400 font-bold block mb-2">🟢 Bom (Good)</span>
                <p class="text-gray-400 text-xs">O disco está saudável. Continue usando normalmente mas mantenha backups regulares.</p>
            </div>
            <div class="bg-[#0A0A0F] border border-yellow-500/30 p-4 rounded-xl">
                <span class="text-yellow-400 font-bold block mb-2">🟡 Alerta (Caution)</span>
                <p class="text-gray-400 text-xs">Faça backup AGORA. O disco está se deteriorando. Compre um substituto e migre os dados.</p>
            </div>
            <div class="bg-[#0A0A0F] border border-red-500/30 p-4 rounded-xl">
                <span class="text-red-400 font-bold block mb-2">🔴 Crítico (Bad)</span>
                <p class="text-gray-400 text-xs">PARE de usar o computador. O disco pode morrer a qualquer momento. Backup de emergência imediato.</p>
            </div>
        </div>
        <h4 class="text-white font-bold mb-3">Atributos S.M.A.R.T. Críticos para monitorar:</h4>
        <div class="bg-[#0A0A0F] border border-white/5 rounded-xl overflow-hidden">
            <table class="w-full text-sm">
                <thead class="bg-white/5">
                    <tr>
                        <th class="text-left p-3 text-slate-400 font-normal">Atributo</th>
                        <th class="text-left p-3 text-slate-400 font-normal">O que significa</th>
                        <th class="text-left p-3 text-slate-400 font-normal">Alarme</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="border-t border-white/5">
                        <td class="p-3 text-white font-mono">05</td>
                        <td class="p-3 text-gray-300">Reallocated Sectors (setores ruins substituídos)</td>
                        <td class="p-3 text-red-400">Qualquer valor > 0</td>
                    </tr>
                    <tr class="border-t border-white/5">
                        <td class="p-3 text-white font-mono">C5</td>
                        <td class="p-3 text-gray-300">Current Pending Sectors (setores esperando realocação)</td>
                        <td class="p-3 text-red-400">Qualquer valor > 0</td>
                    </tr>
                    <tr class="border-t border-white/5">
                        <td class="p-3 text-white font-mono">C6</td>
                        <td class="p-3 text-gray-300">Uncorrectable Sectors (setores irrecuperáveis)</td>
                        <td class="p-3 text-red-400">Qualquer valor > 0</td>
                    </tr>
                    <tr class="border-t border-white/5">
                        <td class="p-3 text-white font-mono">E9</td>
                        <td class="p-3 text-gray-300">NAND Endurance (vida útil do SSD)</td>
                        <td class="p-3 text-yellow-400">Abaixo de 10%</td>
                    </tr>
                </tbody>
            </table>
        </div>
      `
        },
        {
            title: "Teste de CPU e GPU — Stress Test com OCCT",
            content: `
        <p class="mb-4 text-gray-300 leading-relaxed">
          Um processador ou placa de vídeo com instabilidade pode não mostrar erro em uso normal, mas vai travar ou desligar durante jogos ou renderização. O <strong>OCCT</strong> é a ferramenta mais respeitada da comunidade para esses testes.
        </p>
        <h4 class="text-white font-bold mb-3">Baixando e configurando o OCCT:</h4>
        <ol class="list-decimal list-inside text-gray-300 space-y-2 ml-4 mb-5">
            <li>Baixe o OCCT em <strong>ocbase.com</strong> (versão gratuita é suficiente).</li>
            <li>Instale e abra o programa.</li>
            <li>Antes de iniciar qualquer teste, verifique se o monitor de temperatura está visível (ícone de gráfico na barra lateral).</li>
        </ol>
        <div class="space-y-4 mb-6">
            <div class="bg-[#0A0A0F] border border-[#31A8FF]/20 p-5 rounded-xl">
                <h5 class="text-[#31A8FF] font-bold mb-2">🖥️ Teste de CPU (Linpack)</h5>
                <p class="text-gray-300 text-sm mb-2">Selecione "CPU: Linpack" no OCCT. Duração: 15-30 minutos.</p>
                <p class="text-gray-400 text-xs"><strong>Sinal de problema:</strong> Temperatura acima de 95°C, PC desliga ou reinicia durante o teste, ou o OCCT reporta erro de cálculo.</p>
            </div>
            <div class="bg-[#0A0A0F] border border-[#8B31FF]/20 p-5 rounded-xl">
                <h5 class="text-[#8B31FF] font-bold mb-2">🎮 Teste de GPU (3D)</h5>
                <p class="text-gray-300 text-sm mb-2">Selecione "GPU: 3D" ou use o FurMark separadamente. Duração: 15-20 minutos.</p>
                <p class="text-gray-400 text-xs"><strong>Sinal de problema:</strong> Artefatos visuais (pixels coloridos aleatórios), driver crashando ("Display driver stopped responding"), ou PC desligando.</p>
            </div>
            <div class="bg-[#0A0A0F] border border-[#FF4B6B]/20 p-5 rounded-xl">
                <h5 class="text-[#FF4B6B] font-bold mb-2">⚡ Teste de Fonte (Power Supply Test)</h5>
                <p class="text-gray-300 text-sm mb-2">Selecione "Power Supply" no OCCT. Esse estressará CPU e GPU simultaneamente. Duração: 15-30 min.</p>
                <p class="text-gray-400 text-xs"><strong>Sinal de problema:</strong> PC desliga (a fonte não aguenta a carga pico), reinicia, ou o OCCT detecta queda de voltagem nos rail 12V/5V.</p>
            </div>
        </div>
        <div class="bg-yellow-900/10 border-l-4 border-yellow-500 p-5 rounded-r-lg">
            <p class="text-gray-300 text-sm"><strong class="text-yellow-400">Dica Importante:</strong> Se o PC desligar sob o teste de Power Supply mas aguentar CPU e GPU separadamente, o problema é quase certamente a fonte de alimentação sendo insuficiente para a configuração. Verifique se a fonte tem wattagem adequada com o <a href="https://www.bequiet.com/en/psucalculator" target="_blank" rel="noopener noreferrer" class="text-[#31A8FF] hover:underline">calculador da be quiet!</a>.</p>
        </div>
      `
        },
        {
            title: "Interpretando Telas Azuis (BSOD) — Lendo o Código",
            content: `
        <p class="mb-4 text-gray-300 leading-relaxed">
          Toda tela azul tem um código de erro. Saber qual é o código economiza horas de diagnóstico desnecessário. Anote ou fotografe o código antes que o PC reinicie.
        </p>
        <div class="space-y-3 mb-6">
            <div class="bg-[#0A0A0F] border border-white/5 p-4 rounded-xl">
                <code class="text-red-400 font-mono block mb-2">MEMORY_MANAGEMENT (0x0000001A)</code>
                <p class="text-gray-400 text-sm">Quase sempre RAM com problema. Teste com TestMem5 e MemTest86+.</p>
            </div>
            <div class="bg-[#0A0A0F] border border-white/5 p-4 rounded-xl">
                <code class="text-red-400 font-mono block mb-2">PAGE_FAULT_IN_NONPAGED_AREA (0x00000050)</code>
                <p class="text-gray-400 text-sm">RAM ruim ou driver corrompido. Teste a RAM e reinstale drivers de vídeo com DDU.</p>
            </div>
            <div class="bg-[#0A0A0F] border border-white/5 p-4 rounded-xl">
                <code class="text-red-400 font-mono block mb-2">DPC_WATCHDOG_VIOLATION (0x00000133)</code>
                <p class="text-gray-400 text-sm">Driver ou firmware desatualizado. Atualize drivers e firmware do SSD.</p>
            </div>
            <div class="bg-[#0A0A0F] border border-white/5 p-4 rounded-xl">
                <code class="text-red-400 font-mono block mb-2">DRIVER_IRQL_NOT_LESS_OR_EQUAL</code>
                <p class="text-gray-400 text-sm">Driver problemático. Use o DDU para remover e reinstalar o driver de vídeo ou outro driver recentemente instalado.</p>
            </div>
        </div>
        <p class="text-gray-300 text-sm">Para um diagnóstico aprofundado de BSODs, acesse nosso <a href="/guias/como-analisar-tela-azul-bsod-dmp-guia" class="text-[#31A8FF] hover:underline">Guia de Análise de Dump de BSOD</a> onde ensinamos a abrir arquivos .dmp e identificar exatamente qual arquivo de driver causou a tela azul.</p>
      `
        }
    ];

    const faqItems = [
        {
            question: "Posso fazer o diagnóstico de hardware sem abrir o gabinete?",
            answer: "Para a maioria dos testes (RAM, SSD, CPU, GPU), sim. As ferramentas funcionam diretamente no Windows ou via pen drive bootável. Abrir o gabinete só é necessário para limpar poeira, verificar conexões físicas ou remover e reinstalar as peças manualmente."
        },
        {
            question: "O OCCT pode danificar meu hardware?",
            answer: "Não, de nenhuma forma. O OCCT apenas executa operações que qualquer jogo pesado executaria, mas de forma controlada e monitorada. Se seu hardware não aguenta o OCCT, ele não aguentaria jogos exigentes de qualquer forma. O teste apenas expõe problemas existentes."
        },
        {
            question: "RAM ruim pode ser consertada?",
            answer: "Em geral, não. Se a RAM falha nos testes, o defeito é físico (células NAND danificadas). A solução é substituir o módulo. Se você tiver dois pentes, teste um de cada vez para identificar qual está com defeito. Pentes com defeito ainda podem funcionar na frequência base (sem XMP)."
        },
        {
            question: "Quanto tempo devo deixar o MemTest86 rodar?",
            answer: "O mínimo recomendado é 8 passes completos. Dependendo da quantidade de RAM, isso pode levar de 2 a 6 horas. Erros de RAM intermitentes podem não aparecer nos primeiros passes, por isso mais passes = mais confiabilidade no resultado."
        }
    ];

    const externalReferences = [
        { name: "MemTest86+ (Oficial)", url: "https://www.memtest.org/" },
        { name: "CrystalDiskInfo (Download)", url: "https://crystalmark.info/en/software/crystaldiskinfo/" },
        { name: "OCCT — Stress Test Tool", url: "https://www.ocbase.com/" },
        { name: "HWiNFO64 — Monitor de Hardware", url: "https://www.hwinfo.com/" },
    ];

    const relatedGuides = [
        {
            href: "/guias/como-analisar-tela-azul-bsod-dmp-guia",
            title: "Analisar Dumps de BSOD",
            description: "Leia arquivos .dmp para descobrir exatamente qual driver causou a tela azul."
        },
        {
            href: "/guias/monitorar-temperatura-pc",
            title: "Monitorar Temperatura do PC",
            description: "Como usar HWiNFO e MSI Afterburner para acompanhar calor em tempo real."
        },
        {
            href: "/guias/verificar-saude-hd-ssd-crystaldiskinfo",
            title: "Saúde de SSD e HD",
            description: "Guia completo de interpretação do CrystalDiskInfo e S.M.A.R.T."
        },
        {
            href: "/guias/como-trocar-pasta-termica-cpu-gpu-guia",
            title: "Trocar Pasta Térmica",
            description: "Se o problema é temperatura alta, a pasta térmica pode ser a solução."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="45 min"
            difficultyLevel="Intermediário"
            lastUpdated="Março 2026"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
            faqItems={faqItems}
            externalReferences={externalReferences}
            keyPoints={keyPoints}
            warningNote="Se o CrystalDiskInfo mostrar status 'Crítico' no seu disco, PARE de usar o computador e faça backup imediatamente. SSDs NVMe podem parar de funcionar sem aviso prévio."
        />
    );
}