import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'verificar-saude-hd-ssd-crystaldiskinfo',
  title: "Como verificar a Saúde do HD e SSD: CrystalDiskInfo (2026)",
  description: "Seu PC está travando ou arquivos sumindo? Aprenda a usar o CrystalDiskInfo para prever falhas no seu HD ou SSD em 2026.",
  category: 'hardware',
  difficulty: 'Iniciante',
  time: '15 min'
};

const title = "Como verificar a Saúde do HD e SSD: CrystalDiskInfo (2026)";
const description = "Seu PC está travando ou arquivos sumindo? Aprenda a usar o CrystalDiskInfo para prever falhas no seu HD ou SSD em 2026.";
const keywords = [
    'como usar crystaldiskinfo 2026 tutorial guia',
    'verificar saude do ssd windows 11 tutorial 2026',
    'sinais que o hd esta morrendo tutorial guia',
    'temperatura ideal ssd nvme 2026 tutorial',
    'como ler dados smart hd e ssd guia 2026'
];

export const metadata: Metadata = createGuideMetadata('verificar-saude-hd-ssd-crystaldiskinfo', title, description, keywords);

export default function DiskHealthGuide() {
    const aiSummary = "Para verificar saúde do HD/SSD, use CrystalDiskInfo. Status Azul/Verde = Saudável. Status Amarelo = Faça backup IMEDIATAMENTE. Monitorar 'Reallocated Sectors Count' e 'Total Host Writes' (TBW). SSD ideal <70C. Se status Vermelho, disco está falhando - substitua urgentemente.";

    const summaryTable = [
        { label: "Status 'Saudável'", value: "Tudo certo com o seu disco" },
        { label: "Status 'Alerta'", value: "Faça backup IMEDIATAMENTE" },
        { label: "Parâmetro Crítico", value: "Reallocated Sectors Count" },
        { label: "Dificuldade", value: "Fácil" }
    ];

    const contentSections = [
        {
            title: "Introdução: Por que HDs e SSDs morrem em silêncio e como prever falhas",
            content: `
        <p class="mb-6 text-gray-700 leading-relaxed text-lg">
          Diferente de uma ventoinha que faz barulho ao quebrar, um SSD ou HD morre em silêncio. Em 2026, com o aumento das velocidades dos NVMe Gen 5, o calor tornou-se o maior vilão da vida útil. O **CrystalDiskInfo** é a ferramenta padrão da indústria para ler os dados S.M.A.R.T. (Self-Monitoring, Analysis and Reporting Technology) do seu hardware, permitindo que você saiba exatamente quanta "vida" seu disco ainda tem antes de perder suas fotos e documentos.
        </p>
      `
        },
        {
            title: "1. Baixando e Entendendo as Cores",
            summary: "No CrystalDiskInfo, status Azul/Verde = Saudável (nenhum erro crítico). Status Amarelo (Alerta) = setores danificados ou desgastados, disco pode falhar a qualquer momento - faça backup IMEDIATAMENTE. Status Vermelho (Crítico) = disco já falhando, Windows pode travar com telas azuis constantes.",
            content: `
        <p class="mb-4 text-gray-700">Ao abrir o CrystalDiskInfo, olhe para a cor do status:</p>
        <ul class="list-disc list-inside text-gray-700 space-y-3">
            <li><strong>Azul/Verde:</strong> Saúde boa. Nenhum erro crítico detectado.</li>
            <li><strong>Amarelo (Alerta):</strong> Existem setores danificados ou desgastados. O disco pode falhar a qualquer momento. Se vir esta cor, mova seus arquivos importantes para a nuvem ou outro HD agora mesmo.</li>
            <li><strong>Vermelho (Crítico):</strong> O disco já está falhando. O Windows pode travar com telas azuis constantes.</li>
        </ul >
      `
        },
        {
            title: "2. Verificando o Desgaste (SSD TBW)",
            summary: "Monitore 'Total Host Writes' no CrystalDiskInfo para verificar quantos Terabytes já foram gravados no SSD. Cada SSD tem limite de gravação (TBW). Se SSD tem 100TB de limite e já gravou 90TB, começará a apresentar lentidões ou mudar para modo 'Apenas Leitura'. Monitore se trabalha com edição de vídeo ou torrents constantes.",
            content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h class="text-gray-900 font-bold mb-2">Quilometragem do seu SSD:</h4>
            <p class="text-sm text-gray-700">
                Nos SSDs, procure por <strong>'Total Host Writes'</strong>. <br/><br/>
                Isso mostra quantos Terabytes de dados já foram gravados no drive desde que ele saiu da fábrica. Cada SSD tem um limite de gravação (TBW). Se o seu SSD tem 100TB de limite e você já gravou 90TB, ele começará a apresentar lentidões ou mudar para o modo 'Apenas Leitura' para se proteger. Em 2026, monitore isso se você trabalha com edição de vídeo ou torrents constantes.
            </p>
        </div>
      `
        },
        {
            title: "3. A importância da Temperatura",
            summary: "SSDs NVMe de 2026 operam em temperaturas altas, mas não devem passar de 70C por muito tempo. Se CrystalDiskInfo mostrar status vermelho por temperatura, SSD entrará em 'Thermal Throttling' e ficará mais lento que HD antigo. Considere comprar dissipador de calor (heatsink) se temperaturas constantemente acima de 65C.",
            content: `
        <p class="mb-4 text-gray-700">
            <strong>O perigo do calor:</strong> 
            <br/><br/>SSDs NVMe de 2026 operam em temperaturas altas, mas não devem passar dos 70C por muito tempo. Se o CrystalDiskInfo mostrar o status em vermelho por causa da temperatura, seu SSD entrará em 'Thermal Throttling' e ficará mais lento que um HD antigo. Considere comprar um dissipador de calor (heatsink) se as temperaturas estiverem constantemente acima de 65C.
        </p>
      `
        }
    ];

    const relatedGuides = [
        {
            href: "/guias/ssd-vs-hd-qual-melhor",
            title: "SSD vs HD",
            description: "Diferenças de tecnologia e durabilidade."
        },
        {
            href: "/guias/otimizacao-ssd-windows-11",
            title: "Otimizar SSD",
            description: "Dicas para aumentar a vida útil."
        },
        {
            href: "/guias/recuperacao-dados",
            title: "Recuperar Dados",
            description: "O que fazer se o disco já falhou."
        }
    ];

    const faqItems = [
        {
            question: "Como verificar a saúde do meu HD/SSD?",
            answer: "Use o CrystalDiskInfo para ler os dados S.M.A.R.T. do seu hardware."
        },
        {
            question: "O que significa o status Azul/Verde no CrystalDiskInfo?",
            answer: "Saúde boa. Nenhum erro crítico detectado."
        },
        {
            question: "O que significa o status Amarelo no CrystalDiskInfo?",
            answer: "Existem setores danificados ou desgastados. O disco pode falhar a qualquer momento."
        }
    ];

    const externalReferences = [
        { name: "CrystalDiskInfo", url: "https://www.crystaldiskinfo.com/" }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="15 min"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
            faqItems={faqItems}
            externalReferences={externalReferences}
            pathname="/guias/verificar-saude-hd-ssd-crystaldiskinfo"
            aiSummary={aiSummary}
        />
    );
}
