import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'como-analisar-tela-azul-bsod-dmp-guia',
  title: "Tela Azul (BSOD): Como Ler Arquivos .DMP e Descobrir o Erro",
  description: "Aprenda a diagnosticar a 'Tela Azul da Morte' usando BlueScreenView e WhoCrashed. Entenda erros como 'nvlddmkm.sys', 'ntoskrnl.exe' e 'MEMORY_MANAGEMENT'.",
  category: 'windows-erros',
  difficulty: 'Avançado',
  time: '25 min'
};

const title = "Guia de Perícia Digital: Diagnosticando BSOD";
const description = "A Tela Azul não é o fim do mundo, é uma mensagem. Ela cria um arquivo 'minidump' que diz exatamente qual driver ou hardware causou o problema.";

const keywords = [
    'bluescreenview download portable',
    'whocrashed free edition download',
    'como abrir arquivo dmp windows 11',
    'analisar memory.dmp windbg',
    'nvlddmkm.sys tela azul nvidia fix',
    'ntoskrnl.exe bsod ram test',
    'voltris optimizer diagnostics',
    'system_service_exception win32kfull.sys'
];

export const metadata: Metadata = createGuideMetadata('como-analisar-tela-azul-bsod-dmp-guia', title, description, keywords);

export default function BSODGuide() {
    const summaryTable = [
        { label: "Ferramenta 1", value: "BlueScreenView (Rápido)" },
        { label: "Ferramenta 2", value: "WhoCrashed (Explicativo)" },
        { label: "Ferramenta 3", value: "WinDbg (Profissional)" },
        { label: "Arquivo", value: "C:\\Windows\\Minidump" },
        { label: "Causa Comum", value: "Drivers de Vídeo / RAM" },
        { label: "Erro Genérico", value: "NtOsKrnl.exe" }
    ];

    const contentSections = [
        {
            title: "Introdução: O que é o Minidump?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Quando o Windows "crasha", ele despeja o conteúdo da memória RAM no disco para análise.
          <br/>Esses arquivos ficam em <code>C:\\Windows\\Minidump\\</code>.
          <br/>Você não consegue abri-los com o Bloco de Notas. Precisa de ferramentas específicas.
        </p>
      `
        },
        {
            title: "Capítulo 1: BlueScreenView (NirSoft)",
            content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-[#31A8FF] font-bold mb-1">Análise Rápida</h4>
                <p class="text-gray-400 text-xs text-justify">
                    1. Baixe o <strong>BlueScreenView</strong> (site da NirSoft). É portátil.
                    2. Abra o programa. Ele lista todos os crashes recentes.
                    3. Clique no crash mais recente (pela data).
                    4. Olhe a coluna <strong>"Caused By Driver"</strong> (Causado pelo Driver).
                    <br/>- Se for <code>nvlddmkm.sys</code> -> Placa de vídeo Nvidia.
                    <br/>- Se for <code>atikmdag.sys</code> -> Placa de vídeo AMD.
                    <br/>- Se for <code>rtwlanu.sys</code> -> Driver Wi-Fi Realtek.
                </p>
            </div>
        </div>
      `
        },
        {
            title: "Capítulo 2: WhoCrashed (Para Iniciantes)",
            content: `
        <p class="mb-4 text-gray-300">
            O BlueScreenView é técnico. O <strong>WhoCrashed</strong> (Resplendence) traduz para português/inglês simples.
            <br/>1. Instale e clique em "Analyze".
            <br/>2. Ele vai gerar um relatório: "This was probably caused by the following module: ntoskrnl.exe... Bugcheck code: 0x3B".
            <br/>3. Ele sugere soluções genéricas (Atualizar drivers, checar temperatura).
        </p>
      `
        },
        {
            title: "Capítulo 3: O Vilão 'ntoskrnl.exe'",
            content: `
        <p class="mb-4 text-gray-300">
            Muitas vezes, o culpado aparece como <code>ntoskrnl.exe</code> (Kernel do Windows).
            <br/>Isso NÃO significa que o Windows está ruim. Significa que "alguma coisa" fez o Kernel falhar, mas o logger não pegou o nome.
            <br/>Geralmente ntoskrnl está ligado a:
            <br/>- Overclock instável de CPU/RAM.
            <br/>- Memória RAM defeituosa.
            <br/>- Fonte de alimentação oscilando (Vcore baixo).
        </p>
      `
        }
    ];

    const advancedContentSections = [
        {
            title: "Capítulo 4: WinDbg (Análise Profissional)",
            content: `
        <p class="mb-4 text-gray-300">
            Se os anteriores falharam, baixe o <strong>WinDbg Preview</strong> na Microsoft Store.
            <br/>1. File > Open Dump File.
            <br/>2. Digite <code>!analyze -v</code> no console.
            <br/>Ele mostra a STACK TEXT (pilha de execução). Você vê exatamente o que estava rodando antes de morrer.
            <br/>Ex: Você vê "Discord.exe" chamando "AudioDevProps.dll" e depois CRASH. Logo, o driver de áudio conflitou com o Discord.
        </p>
      `
        },
        {
            title: "Capítulo 5: Códigos Comuns (Bug Check Codes)",
            content: `
        <p class="mb-4 text-gray-300">
            - <strong>0x0000001A (MEMORY_MANAGEMENT):</strong> RAM com problemas. Rode o MemTest86 ou tire um pente de memória.
            - <strong>0x00000116 (VIDEO_TDR_ERROR):</strong> A GPU parou de responder. Geralmente overclock alto demais ou driver corrompido. Use DDU.
            - <strong>0x000000EF (CRITICAL_PROCESS_DIED):</strong> O Windows perdeu acesso ao disco (SSD desconectou/morreu).
        </p>
      `
        },
        {
            title: "Capítulo 6: Configuradando o Windows para Criar Dumps",
            content: `
        <p class="mb-4 text-gray-300">
            Às vezes a pasta Minidump está vazia.
            <br/>Vá em Configurações Avançadas do Sistema > Inicialização e Recuperação.
            <br/>Em "Gravação de informações de depuração", selecione <strong>"Despejo de memória pequeno (256 KB)"</strong>.
            <br/>Se estiver em "Nenhum", o Windows não salva o arquivo e você nunca saberá a causa.
        </p>
      `
        }
    ];

    const additionalContentSections = [
        {
            title: "Capítulo 7: Driver Verifier (Perigoso)",
            content: `
            <p class="mb-4 text-gray-300">
                Uma ferramenta do Windows que estressa todos os drivers para forçar a tela azul e revelar o culpado.
                <br/><strong>Cuidado:</strong> Pode deixar o PC em loop de boot. Só faça se souber entrar em Modo de Segurança para desativar.
                <br/>Comando: <code>verifier</code>.
            </p>
            `
        },
        {
             title: "Capítulo 8: WHEA_UNCORRECTABLE_ERROR",
            content: `
            <p class="mb-4 text-gray-300">
                Esse é erro de HARDWARE físico. Não é software.
                <br/>Significa que a CPU detectou erro interno de voltagem ou cache. Remova qualquer Overclock/Undervolt imediatamente.
            </p>
            `
        },
        {
             title: "Capítulo 9: SSD NVMe",
            content: `
            <p class="mb-4 text-gray-300">
                SSDs baratos da China (Kingspec, Goldenfir) costumam causar tela azul aleatória quando esquentam ou falham na leitura. Se o código for 0x7A (KERNEL_DATA_INPAGE_ERROR), troque o cabo SATA ou o SSD.
            </p>
            `
        }
    ];

    const faqItems = [
        {
            question: "Formatar resolve?",
            answer: "Se for erro de driver (software), SIM. Se for erro de hardware (RAM queimada, Fonte fraca), NÃO. O erro vai continuar acontecendo no Windows limpo."
        },
        {
            question: "Tela azul jogando?",
            answer: "Geralmente superaquecimento ou fonte não aguentando a carga da GPU. Monitore as temperaturas."
        }
    ];

    const externalReferences = [
        { name: "BlueScreenView Download", url: "https://www.nirsoft.net/utils/blue_screen_view.html" },
        { name: "Microsoft Bug Check Code Reference", url: "https://learn.microsoft.com/en-us/windows-hardware/drivers/debugger/bug-check-code-reference2" }
    ];

    const relatedGuides = [
        {
            href: "/guias/ddu-limpeza-drivers-video-guia",
            title: "Drivers GPU",
            description: "Corrigir nvlddmkm.sys."
        },
        {
            href: "/guias/como-resolver-tela-azul",
            title: "Reparo Geral",
            description: "SFC/Scannow."
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
            advancedContentSections={advancedContentSections}
            additionalContentSections={additionalContentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
            faqItems={faqItems}
            externalReferences={externalReferences}
        />
    );
}
