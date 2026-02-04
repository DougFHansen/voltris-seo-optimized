import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Como Resolver Erro DPC_WATCHDOG_VIOLATION (2026)";
const description = "Seu Windows 11 travou com o erro de tela azul DPC Watchdog? Aprenda a identificar as causas e como consertar em 2026.";
const keywords = [
    'como resolver dpc_watchdog_violation windows 11 2026',
    'erro tela azul dpc watchdog causas e solucao',
    'atualizar driver sata ahci controlador tutorial 2026',
    'pc travando dpc watchdog violation como consertar',
    'fix dpc watchdog blue screen windows 11 tutorial'
];

export const metadata: Metadata = createGuideMetadata('dpc-watchdog-violation-como-resolver', title, description, keywords);

export default function DPCWatchdogGuide() {
    const summaryTable = [
        { label: "Causa Principal", value: "Drivers de disco incompatíveis (SSD/SATA)" },
        { label: "Sugestão #1", value: "Trocar driver controlador AHCI" },
        { label: "Sugestão #2", value: "Atualizar Firmware do SSD" },
        { label: "Dificuldade", value: "Avançado" }
    ];

    const contentSections = [
        {
            title: "O que é o erro de 'Violação do Cão de Guarda'?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Em 2026, o erro **DPC_WATCHDOG_VIOLATION** ocorre quando um driver trava e o sistema não recebe resposta dele por muito tempo. O "Cão de Guarda" (Watchdog) é um cronômetro que fica vigiando os drivers: se algum parar de responder, ele gera a tela azul para salvar seus dados. Na maioria das vezes, o culpado é o driver que gerencia o seu SSD ou o controlador SATA na placa-mãe.
        </p>
      `
        },
        {
            title: "1. Trocando o driver de controlador iastor.sys",
            content: `
        <p class="mb-4 text-gray-300">Este é o passo que resolve 90% dos casos:</p>
        <ol class="list-decimal list-inside text-gray-300 space-y-3">
            <li>Aperte <code>Win + X</code> e escolha 'Gerenciador de Dispositivos'.</li>
            <li>Procure por 'Controladores IDE ATA/ATAPI'.</li>
            <li>Se você vir algo como 'Intel(R) Serial ATA Storage Controller', clique com o botão direito e vá em **Atualizar Driver**.</li>
            <li>Escolha 'Procurar drivers no meu computador' > 'Permitir que eu escolha em uma lista'.</li>
            <li>Selecione <strong>'Controlador SATA AHCI Padrão'</strong> e clique em Avançar.</li>
            <li>Reinicie o Windows.</li>
        </ol>
      `
        },
        {
            title: "2. Firmware do SSD e Erros de Disco",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Check de Integridade:</h4>
            <p class="text-sm text-gray-300">
                Se o erro persistir em 2026, a falha pode estar no próprio SSD. <br/><br/>
                - Baixe o software oficial da marca do seu SSD (Samsung Magician, Kingston SSD Manager, etc). <br/>
                - Verifique se existe uma atualização de <strong>Firmware</strong> disponível. Isso corrige bugs internos do disco que causam o travamento do driver. <br/>
                - Rode também o comando <code>chkdsk /f /r</code> no prompt de comando para garantir que não existam setores corrompidos.
            </p>
        </div>
      `
        },
        {
            title: "3. Dispositivos USB e Periféricos",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>Causa secundária:</strong> 
            <br/><br/>Embora raro, drivers de adaptadores Wi-Fi USB ou softwares de controle de RGB (como o iCUE ou Armoury Crate) também podem causar DPC Watchdog se entrarem em conflito. Se você começou a ter esse erro logo após plugar algo novo, remova o dispositivo e veja se a tela azul para. Em 2026, manter o Windows 11 atualizado ajuda a Microsoft a corrigir esses conflitos automaticamente através de novos patches.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/como-resolver-tela-azul",
            title: "Guia Tela Azul",
            description: "Passos gerais para qualquer erro BSOD."
        },
        {
            href: "/guias/otimizacao-ssd-windows-11",
            title: "Otimizar SSD",
            description: "Mantenha o seu disco rápido e estável."
        },
        {
            href: "/guias/corrigir-dll-faltando-vcredist-directx",
            title: "Fix DLLs",
            description: "Resolva problemas de bibliotecas corrompidas."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="25 min"
            difficultyLevel="Avançado"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
