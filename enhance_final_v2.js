
const fs = require('fs');
const path = require('path');

const guidesDir = path.join(__dirname, 'app', 'guias');

const guidesToEnhance = {
    'criar-pendrive-bootavel': {
        title: "Como Criar um Pen Drive Bootável do Windows (Todos os Métodos)",
        description: "Guia definitivo para criar mídia de instalação do Windows 10 e 11. Aprenda a usar o Media Creation Tool e o Rufus para PCs antigos ou novos.",
        keywords: ["pendrive bootavel", "rufus windows 11", "media creation tool", "formatar pc usb", "iso windows"],
        contentSections: [
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
        `
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
        `
            },
            {
                title: "Testando o Pen Drive",
                content: `
          <p class="text-gray-300">Após criar, o Pen Drive não deve aparecer vazio. Ele deve ter arquivos como 'setup.exe', 'boot', 'sources'. Para usar/testar, você precisa reiniciar o PC e acessar o Boot Menu (geralmente F8, F11 ou F12).</p>
        `
            }
        ]
    },
    'upgrade-memoria-ram': {
        title: "Guia de Upgrade de Memória RAM: Como Escolher e Instalar",
        description: "Seu PC está lento? Mais RAM pode ser a solução. Aprenda sobre DDR3 vs DDR4 vs DDR5, frequência (MHz), latência (CL) e Dual Channel.",
        keywords: ["upgrade ram notebook", "ddr4 vs ddr5", "dual channel", "memoria ram pc gamer", "como instalar ram"],
        contentSections: [
            {
                title: "Antes de Comprar (Compatibilidade)",
                content: `
          <div class="bg-red-900/20 p-4 border border-red-500/30 rounded mb-4">
            <h4 class="text-red-400 font-bold mb-2">⚠ Não compre errado!</h4>
            <p class="text-gray-300 text-sm">Memória de Notebook (SODIMM) não entra em Desktop (DIMM). DDR4 não encaixa em slot DDR3 ou DDR5. O encaixe é fisicamente diferente.</p>
          </div>
          <p class="text-gray-300 mb-2">Use o <strong>CPU-Z</strong> (software gratuito) para verificar o que você já tem:</p>
          <ul class="list-disc list-inside text-gray-400 text-sm">
            <li>Aba <strong>Memory:</strong> Mostra o tipo (DDR4) e a frequência atual.</li>
            <li>Aba <strong>SPD:</strong> Mostra quantos slots você tem e o que está em cada um.</li>
          </ul>
        `
            },
            {
                title: "O Segredo do Dual Channel",
                content: `
          <p class="mb-4 text-gray-300">Dois pentes de 8GB (Total 16GB) são MUITO mais rápidos que um único pente de 16GB. Isso se chama Dual Channel e dobra a largura de banda da memória.</p>
          <div class="bg-[#1E1E22] p-4 rounded border-l-4 border-green-500">
            <h4 class="text-white font-bold">Instalação Correta</h4>
            <p class="text-gray-400 text-sm">Em placas-mãe com 4 slots, você geralmente deve instalar nos slots <strong>2 e 4</strong> (pulando o 1 e 3) para ativar o Dual Channel. Consulte o manual da sua placa!</p>
          </div>
        `
            },
            {
                title: "Mitos de Frequência (XMP/DOCP)",
                content: `
          <p class="text-gray-300">Você comprou uma RAM de 3200MHz mas o PC mostra 2133MHz? Isso é normal. Você precisa entrar na BIOS e ativar o perfil <strong>XMP (Intel)</strong> ou <strong>DOCP/EXPO (AMD)</strong> para que ela rode na velocidade anunciada.</p>
        `
            }
        ]
    },
    'substituicao-ssd': {
        title: "Upgrade para SSD: O Melhor Investimento para Seu PC",
        description: "Trocar o HD por um SSD deixa o PC até 10x mais rápido. Guia de instalação de SSD SATA e NVMe M.2 e como clonar seu sistema.",
        keywords: ["ssd vs hd", "instalar ssd notebook", "clonar hd para ssd", "nvme m.2", "sata 3"],
        contentSections: [
            {
                title: "SATA vs NVMe M.2",
                content: `
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
            <div class="bg-[#171313] p-4 rounded border-t-4 border-blue-500">
              <h4 class="text-white font-bold mb-1">SSD SATA (2.5\")</h4>
              <p class="text-gray-400 text-xs">Formato igual a um HD de notebook. Velocidade ~550MB/s. Compatível com qualquer PC ou notebook antigo.</p>
            </div>
            <div class="bg-[#171313] p-4 rounded border-t-4 border-purple-500">
              <h4 class="text-white font-bold mb-1">NVMe M.2</h4>
              <p class="text-gray-400 text-xs">Parece um chiclete. Ligado direto na placa-mãe. Velocidades de 3500MB/s a 7000MB/s. Requer slot M.2 no PC.</p>
            </div>
          </div>
        `
            },
            {
                title: "Clonar vs Instalação Limpa",
                content: `
          <p class="mb-4 text-gray-300">Você comprou o SSD. E o Windows?</p>
          <ul class="space-y-3 text-gray-300">
            <li><strong>Clonar (Macrium Reflect):</strong> Copia seu Windows atual, programas e arquivos exatamente como estão para o SSD novo. Bom para quem não quer configurar tudo de novo.</li>
            <li><strong>Instalação Limpa (Recomendado):</strong> Começar do zero garante performance máxima e livra o sistema de lixo acumulado.</li>
          </ul>
        `
            },
            {
                title: "Dica de Instalação",
                content: `
          <p class="text-gray-300">Se for instalar um SSD M.2, cuidado com o parafuso minúsculo! Ele geralmente já vem na placa-mãe ou na caixa da placa-mãe, não com o SSD. Não aperte demais.</p>
        `
            }
        ]
    },
    'backup-dados': {
        title: "Estratégias de Backup de Dados: A Regra 3-2-1",
        description: "Não espere perder tudo para se preocupar. Aprenda a estratégia profissional de backup 3-2-1 e proteja fotos, documentos e arquivos importantes.",
        keywords: ["backup dados", "nuvem vs hd externo", "segurança dados", "onedrive google drive", "ransomware"],
        contentSections: [
            {
                title: "A Regra de Ouro: 3-2-1",
                content: `
          <p class="mb-4 text-gray-300">Profissionais de TI seguem este mantra para garantir que dados nunca sejam perdidos, mesmo em catástrofes:</p>
          <div class="space-y-3">
            <div class="flex items-center gap-3 bg-[#1E1E22] p-3 rounded">
              <span class="text-3xl font-bold text-[#31A8FF]">3</span>
              <p class="text-gray-300 text-sm">Tenha <strong>TRÊS</strong> cópias dos seus dados (1 original + 2 backups).</p>
            </div>
            <div class="flex items-center gap-3 bg-[#1E1E22] p-3 rounded">
              <span class="text-3xl font-bold text-[#31A8FF]">2</span>
              <p class="text-gray-300 text-sm">Armazene em <strong>DUAS</strong> mídias diferentes (ex: HD Externo e Nuvem).</p>
            </div>
            <div class="flex items-center gap-3 bg-[#1E1E22] p-3 rounded">
              <span class="text-3xl font-bold text-[#31A8FF]">1</span>
              <p class="text-gray-300 text-sm">Mantenha <strong>UMA</strong> cópia fora do local (Offsite/Nuvem) para proteger contra incêndio/roubo.</p>
            </div>
          </div>
        `
            },
            {
                title: "Ferramentas Automáticas",
                content: `
          <p class="mb-4 text-gray-300">Backup manual você esquece de fazer. Use automação:</p>
          <ul class="list-disc list-inside text-gray-300 text-sm space-y-2">
            <li><strong>OneDrive/Google Drive:</strong> Configure para sincronizar automaticamente as pastas "Documentos" e "Imagens".</li>
            <li><strong>Veeam Agent Free:</strong> Ferramenta profissional gratuita para fazer imagem completa do PC para um HD Externo.</li>
            <li><strong>Histórico de Arquivos (Windows):</strong> Recurso nativo que faz backup horário para um drive externo.</li>
          </ul>
        `
            },
            {
                title: "O Perigo do Ransomware",
                content: `
          <div class="bg-red-900/20 border border-red-500/30 p-4 rounded text-sm text-gray-300">
            Vírus de sequestro de dados (Ransomware) podem criptografar seu HD externo se ele estiver conectado na hora da infecção. Por isso, o backup em nuvem (com versionamento) é sua única salvação real contra hackers.
          </div>
        `
            }
        ]
    }
};

async function enhanceGuides() {
    for (const [folderName, data] of Object.entries(guidesToEnhance)) {
        const sectionData = data.contentSections;

        // Convert sectionData to string representation for the template
        const sectionsCode = sectionData.map(section => {
            return `
    {
      title: "${section.title}",
      content: \`
        ${section.content.trim()}
      \`,
      subsections: []
    }`;
        }).join(',\n');

        const fileContent = `import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "${data.title}";
const description = "${data.description}";
const keywords = ${JSON.stringify(data.keywords)};

export const metadata: Metadata = createGuideMetadata(title, description, keywords);

export default function GuidePage() {
  const contentSections = [
${sectionsCode}
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
`;

        const filePath = path.join(guidesDir, folderName, 'page.tsx');
        try {
            if (fs.existsSync(path.join(guidesDir, folderName))) {
                fs.writeFileSync(filePath, fileContent, 'utf8');
                console.log(`Enhanced (V2): ${folderName}`);
            } else {
                console.log(`Skipped (Not Found): ${folderName}`);
            }
        } catch (e) {
            console.error(`Error writing ${folderName}:`, e);
        }
    }
}

enhanceGuides();
