import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Como Criar um Pen Drive Bootável do Windows (Todos os Métodos)";
const description = "Guia definitivo para criar mídia de instalação do Windows 10 e 11. Aprenda a usar o Media Creation Tool e o Rufus para PCs antigos ou novos.";
const keywords = ["pendrive bootavel","rufus windows 11","media creation tool","formatar pc usb","iso windows"];

export const metadata: Metadata = createGuideMetadata('criar-pendrive-bootavel', title, description, keywords);

export default function GuidePage() {
  const contentSections = [

    {
      title: "Método 1: Media Creation Tool (Oficial e Recomendado)",
      content: `
        <p class="mb-4 text-gray-300">Esta é a ferramenta oficial da Microsoft. É a maneira mais segura e garante que você tenha a versão mais estável e livre de vírus do Windows.</p>
          <div class="bg-[#1E1E22] p-5 rounded-lg border-l-4 border-[#31A8FF]">
            <h4 class="text-white font-bold mb-2">Passo a Passo</h4>
            <ol class="list-decimal list-inside space-y-2 text-gray-300 text-sm">
              <li>Acesse o site oficial da Microsoft ("Baixar Windows 10" ou "11").</li>
              <li>Baixe a ferramenta "Media Creation Tool" e execute como Administrador.</li>
              <li>Aceite os termos e escolha <strong>"Criar mídia de instalação"</strong>.</li>
              <li>Insira um Pen Drive de 8GB (cuidado: ele será formatado!).</li>
              <li>Selecione o Pen Drive na lista e aguarde o download (pode demorar 30min+).</li>
            </ol>
          </div>
      `,
      subsections: []
    },

    {
      title: "Método 2: Rufus (O Canivete Suíço)",
      content: `
        <p class="mb-4 text-gray-300">O Rufus é ideal se você precisa de opções avançadas, como instalar Windows 11 em PC antigo (sem TPM) ou usar uma ISO específica.</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-[#171313] p-4 rounded border border-gray-700">
              <h4 class="text-white font-bold mb-2">Configuração MBR vs GPT</h4>
              <p class="text-gray-400 text-sm">
                <strong>GPT (UEFI):</strong> Para computadores modernos (pós-2012). Selecione "Esquema de partição: GPT" e "Sistema de destino: UEFI".<br><br>
                <strong>MBR (Legacy):</strong> Para PCs muito antigos. Selecione "Esquema de partição: MBR".
              </p>
            </div>
            <div class="bg-[#171313] p-4 rounded border border-gray-700">
              <h4 class="text-white font-bold mb-2">Truques do Windows 11</h4>
              <p class="text-gray-400 text-sm">Ao clicar em INICIAR no Rufus com uma ISO do Windows 11, ele perguntará se você quer <strong>remover a exigência de TPM 2.0 e Secure Boot</strong>. Marque essa opção para reviver PCs antigos!</p>
            </div>
          </div>
      `,
      subsections: []
    },

    {
      title: "Testando o Pen Drive",
      content: `
        <p class="text-gray-300">Após criar, o Pen Drive não deve aparecer vazio. Ele deve ter arquivos como 'setup.exe', 'boot', 'sources'. Para usar/testar, você precisa reiniciar o PC e acessar o Boot Menu (geralmente F8, F11 ou F12).</p>
      `,
      subsections: []
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/manutencao-preventiva",
      title: "Manutenção Preventiva",
      description: "Proteja seu hardware."
    },
    {
      href: "/guias/seguranca-digital",
      title: "Segurança Digital",
      description: "Proteja seus dados."
    },
    {
      href: "/guias/otimizacao-performance",
      title: "Performance",
      description: "Deixe seu PC mais rápido."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="20 min"
      difficultyLevel="Intermediário"
      contentSections={contentSections}
      relatedGuides={relatedGuides}
    />
  );
}
