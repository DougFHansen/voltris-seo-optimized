import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Diagnóstico de Hardware: Como testar as peças do PC (2026)";
const description = "Seu PC está travando ou não liga? Aprenda a fazer um diagnóstico de hardware para testar Memória, SSD, Placa de Vídeo e Processador em 2026.";
const keywords = [
  'como fazer diagnostico de hardware pc 2026',
  'testar saude memoria ram e ssd tutorial',
  'ferramentas diagnostico pc travando guia completo',
  'como saber qual peça do pc esta com defeito 2026',
  'stress test cpu e gpu tutorial completo 2026'
];

export const metadata: Metadata = createGuideMetadata('diagnostico-hardware', title, description, keywords);

export default function HardwareDiagnosticGuide() {
  const summaryTable = [
    { label: "Teste de RAM", value: "MemTest86+ / Windows Memory Diagnostic" },
    { label: "Teste de Disco", value: "CrystalDiskInfo" },
    { label: "Teste de Stress", value: "OCCT / FurMark (GPU) / Cinebench (CPU)" },
    { label: "Dificuldade", value: "Médio" }
  ];

  const contentSections = [
    {
      title: "Onde o problema começa?",
      content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Identificar qual peça está causando erros no seu computador em 2026 pode ser frustrante. Mas não precisa ser na base da "tentativa e erro". Com as ferramentas de diagnóstico corretas, você consegue isolar cada componente e estressá-lo individualmente para descobrir se o culpado é um pente de memória com defeito, uma fonte que não aguenta a carga ou um SSD que está no fim da vida útil.
        </p>
      `
    },
    {
      title: "1. Stress Test: O teste de fogo",
      content: `
        <p class="mb-4 text-gray-300">Em 2026, a melhor ferramenta para isso é o <strong>OCCT</strong>:</p>
        <p class="text-sm text-gray-300">
            Diferente de outros apps, o OCCT testa tudo. <br/><br/>
            - <strong>Teste de CPU:</strong> Verifica se o processador está estável sob carga máxima. <br/>
            - <strong>Teste de Power (Fonte):</strong> Estressa a CPU e a GPU ao mesmo tempo para ver se a sua fonte de alimentação desliga o PC por falta de energia. <br/>
            - <strong>Teste de VRAM:</strong> Procura erros específicos na memória de vídeo da sua placa.
        </p>
      `
    },
    {
      title: "2. Detectando Erros de Memória RAM",
      content: `
        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
            <h4 class="text-white font-bold mb-2">Tela Azul Alternada?</h4>
            <p class="text-sm text-gray-300">
                Se você tem telas azuis com códigos diferentes toda hora, o problema quase sempre é a RAM. <br/><br/>
                Use o <strong>TestMem5 (com o perfil Extreme de anta777)</strong> no Windows. Se ele mostrar um único 'Error' em vermelho, sua memória RAM está corrompida fisicamente ou o seu overclock/XMP está instável. A solução em 2026 é baixar a frequência da memória ou substituir o módulo.
            </p>
        </div>
      `
    },
    {
      title: "3. Saúde do Armazenamento (SSD/NVMe)",
      content: `
        <p class="mb-4 text-gray-300">
            <strong>Check de Integridade:</strong> 
            <br/><br/>Abra o <strong>CrystalDiskInfo</strong>. Se o status estiver em 'Alerta' (Amarelo) ou 'Crítico' (Vermelho), seu SSD está prestes a morrer. Pare de usar o PC agora e faça backup imediato de tudo! Em 2026, SSDs NVMe não avisam antes de queimar, eles simplesmente param de ser reconhecidos pela BIOS.
        </p>
      `
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/como-resolver-tela-azul",
      title: "Fix Tela Azul",
      description: "Resolva erros após o diagnóstico."
    },
    {
      href: "/guias/monitorar-temperatura-pc",
      title: "Monitorar Calor",
      description: "Veja se o erro é por superaquecimento."
    },
    {
      href: "/guias/verificar-saude-hd-ssd-crystaldiskinfo",
      title: "Saúde do Disco",
      description: "Guia profundo sobre SSDs e HDs."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="45 min"
      difficultyLevel="Médio"
      contentSections={contentSections}
      summaryTable={summaryTable}
      relatedGuides={relatedGuides}
    />
  );
}