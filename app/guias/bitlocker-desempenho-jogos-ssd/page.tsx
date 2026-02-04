import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "BitLocker consome FPS? Impacto em SSDs e Jogos (2026)";
const description = "Descubra se a criptografia BitLocker diminui o desempenho do seu SSD e causa quedas de FPS nos seus jogos no Windows 11 em 2026.";
const keywords = [
    'bitlocker diminui fps em jogos 2026',
    'desativar bitlocker windows 11 aumenta performance',
    'impacto bitlocker no ssd nvme benchmark 2026',
    'como desativar criptografia do dispositivo windows 11 tutorial',
    'bitlocker vs performance gaming windows 11 guia'
];

export const metadata: Metadata = createGuideMetadata('bitlocker-desempenho-jogos-ssd', title, description, keywords);

export default function BitLockerPerformanceGuide() {
    const summaryTable = [
        { label: "O que é", value: "Criptografia de disco da Microsoft" },
        { label: "Perda de Escrita", value: "Até 30% em SSDs sem hardware AES" },
        { label: "Impacto no FPS", value: "Mínimo em GPUs/CPUs fortes, mas afeta Frametimes" },
        { label: "Veredito 2026", value: "Desative em PCs de Jogos, ative em Notebooks (Segurança)" }
    ];

    const contentSections = [
        {
            title: "O BitLocker e a Segurança vs Performance",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Por padrão, o Windows 11 Pro ativa o **BitLocker** em muitos computadores novos e notebooks. Ele criptografa todos os seus dados para que, se alguém roubar o seu SSD, não consiga ler nada sem a chave. No entanto, criptografar e descriptografar arquivos a cada segundo exige poder de processamento. Em 2026, com SSDs NVMe atingindo velocidades de 10GB/s, o processador muitas vezes se torna o gargalo para gerenciar essa criptografia.
        </p>
      `
        },
        {
            title: "1. Por que gamers devem considerar desativar?",
            content: `
        <p class="mb-4 text-gray-300">Em jogos competitivos ou pesados:</p>
        <p class="text-sm text-gray-300">
            Jogos modernos carregam texturas constantemente do SSD (DirectStorage). Se o BitLocker estiver ativo, a CPU precisa trabalhar dobrado para "traduzir" esses dados. Em CPUs de entrada (Core i3 ou Ryzen 3), isso pode causar **Stuttering** (travadinhas) e aumentar a latência do sistema. Se o seu PC é apenas para lazer e fica em casa em um local seguro, o BitLocker apenas consome recursos desnecessariamente.
        </p>
      `
        },
        {
            title: "2. Como verificar se está ativo no seu PC",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Check de Status:</h4>
            <p class="text-sm text-gray-300">
                1. Abra o Menu Iniciar e digite <strong>cmd</strong> (execute como administrador). <br/>
                2. Digite o comando: <code>manage-bde -status</code> <br/>
                3. Procure por 'Percentage Encrypted'. Se disser 100%, o BitLocker está agindo no seu disco. <br/>
                4. Se disser 'Fully Decrypted', seu desempenho já está no máximo.
            </p>
        </div>
      `
        },
        {
            title: "3. Como desativar com segurança",
            content: `
        <p class="mb-4 text-gray-300">
            <strong>O processo leva tempo:</strong> 
            <br/><br/>Vá em Configurações > Privacidade e Segurança > **Criptografia do Dispositivo** (ou procure por BitLocker no Painel de Controle). Clique em 'Desativar'. <br/><br/>
            <strong>Dica de 2026:</strong> O Windows levará de 30 minutos a algumas horas para descriptografar tudo, dependendo do tamanho do seu SSD. Não desligue o PC durante o processo! Após terminar, você notará que o tempo de carregamento de jogos pesados pode diminuir ligeiramente e o uso de CPU em background será menor.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/otimizacao-ssd-windows-11",
            title: "Otimizar SSD",
            description: "Outros ajustes após desativar o BitLocker."
        },
        {
            href: "/guias/aceleracao-hardware-gpu-agendamento",
            title: "Agendamento GPU",
            description: "Melhore o processamento do DirectStorage."
        },
        {
            href: "/guias/otimizacao-performance",
            title: "Performance Windows",
            description: "Guia completo de ajustes para jogos."
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="40 min"
            difficultyLevel="Médio"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
        />
    );
}
