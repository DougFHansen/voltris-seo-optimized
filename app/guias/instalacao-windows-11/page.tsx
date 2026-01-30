import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Guia Definitivo de Instalação Limpa do Windows 11 (2025)";
const description = "Tutorial técnico passo a passo para instalar o Windows 11 do zero, ignorando bloatware, configurando partições corretamente e garantindo drivers atualizados.";
const keywords = ["instalação limpa windows 11","formatar pc 2025","tpm 2.0 bypass","drivers windows 11","otimização pós formatação"];

export const metadata: Metadata = createGuideMetadata('instalacao-windows-11', title, description, keywords);

export default function GuidePage() {
  const contentSections = [
    {
      title: "Introdução e Visão Geral",
      content: `
        <p class="mb-4 text-lg text-gray-300 leading-relaxed">Uma instalação limpa (Clean Install) é a maneira mais eficaz de revitalizar seu computador. Diferente da atualização, este processo remove arquivos antigos, registros corrompidos e malwares ocultos, resultando em um sistema até 40% mais rápido.</p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
          <div class="bg-[#171313] p-6 rounded-xl border border-[#31A8FF]/30 hover:border-[#31A8FF]/50 transition-colors">
            <h3 class="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <span class="text-[#31A8FF]">✓</span> Benefícios
            </h3>
            <ul class="text-gray-300 space-y-2">
              <li class="flex items-start gap-2"><span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#31A8FF] flex-shrink-0"></span>Eliminação total de vírus e bloatwares de fábrica</li><li class="flex items-start gap-2"><span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#31A8FF] flex-shrink-0"></span>Melhoria drástica n tempo de boot e resposta</li><li class="flex items-start gap-2"><span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#31A8FF] flex-shrink-0"></span>Correção de erros de DLL e tela azul (BSOD)</li><li class="flex items-start gap-2"><span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#31A8FF] flex-shrink-0"></span>Controle total sobre o particionamento do disco</li>
            </ul>
          </div>
          <div class="bg-[#171313] p-6 rounded-xl border border-[#FF4B6B]/30 hover:border-[#FF4B6B]/50 transition-colors">
            <h3 class="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <span class="text-[#FF4B6B]">⚠</span> Requisitos
            </h3>
            <ul class="text-gray-300 space-y-2">
              <li class="flex items-start gap-2"><span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#FF4B6B] flex-shrink-0"></span>Pen Drive de 8GB ou superior (será formatado)</li><li class="flex items-start gap-2"><span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#FF4B6B] flex-shrink-0"></span>Backup de todos os dados (tudo será apagado)</li><li class="flex items-start gap-2"><span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#FF4B6B] flex-shrink-0"></span>Acesso à internet para baixar drivers</li><li class="flex items-start gap-2"><span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#FF4B6B] flex-shrink-0"></span>Requisitos mínimos: TPM 2.0 e Secure Boot (ou script de bypass)</li>
            </ul>
          </div>
        </div>
      `,
    },
    
    {
      title: "Passo 1: Preparação da Mídia de Instalação",
      content: `<p class="mb-4 text-gray-300 leading-relaxed">Não use DVDs antigos. A Microsoft atualiza o Windows 11 frequentemente. Baixar a versão mais recente garante menos atualizações pós-instalação.</p>`,
      subsections: [
        
        {
          subtitle: "Usando o Media Creation Tool (Oficial)",
          content: `
            <div class="prose prose-invert max-w-none">
              
              <p class="text-gray-300 mb-2">Este é o método mais seguro e garantido pela Microsoft.</p>
              <ol class="space-y-3 text-gray-300 list-decimal list-inside bg-[#1E1E22] p-4 rounded-lg">
                <li>Acesse o site oficial da Microsoft e baixe o "Media Creation Tool".</li>
                <li>Conecte o Pen Drive e execute o programa como Administrador.</li>
                <li>Aceite os termos e selecione "Criar mídia de instalação".</li>
                <li>Selecione "Unidade Flash USB" e aguarde o download e gravação (pode levar 20-40min).</li>
              </ol>
            </div>
          `
        },
        
        {
          subtitle: "Usando Rufus (Para PCs Antigos/Sem TPM)",
          content: `
            <div class="prose prose-invert max-w-none">
              
              <p class="text-gray-300 mb-2">O Rufus é essencial se você precisa instalar o Windows 11 em hardware "não suportado" (Sem TPM 2.0).</p>
              <ul class="space-y-2 text-gray-300 list-disc list-inside">
                <li>Baixe o Rufus e a ISO do Windows 11.</li>
                <li>No Rufus, selecione o Pen Drive e a ISO.</li>
                <li>Ao clicar em INICIAR, marque as caixas: <strong>"Remove requirement for 4GB+ RAM and Secure Boot"</strong> e <strong>"Remove requirement for an online Microsoft account"</strong>.</li>
                <li>Isso criará um instalador desbloqueado.</li>
              </ul>
            </div>
          `
        }
      ]
    },
    
    {
      title: "Passo 2: Configuração de BIOS e Boot",
      content: `<p class="mb-4 text-gray-300 leading-relaxed">Para iniciar pelo Pen Drive, você precisa alterar a ordem de inicialização na placa-mãe.</p>`,
      subsections: [
        
        {
          subtitle: "Acessando a UEFI/BIOS",
          content: `
            <div class="prose prose-invert max-w-none">
              
              <p>Reinicie o PC e pressione a tecla de BOOT repetidamente. As teclas comuns são:</p>
              <div class="grid grid-cols-2 gap-2 text-sm font-mono bg-black p-3 rounded border border-gray-700 mt-2">
                <div>Dell: F12</div>
                <div>HP: F9 ou Esc</div>
                <div>Asus: F8</div>
                <div>Acer: F12</div>
                <div>Lenovo: F12 ou Botão Novo</div>
                <div>Gigabyte/MSI: F12 ou F11</div>
              </div>
            </div>
          `
        },
        
        {
          subtitle: "Configurações Críticas",
          content: `
            <div class="prose prose-invert max-w-none">
              
              <ul class="list-none space-y-2">
                <li class="flex items-center gap-2"><span class="text-yellow-500">⚠</span> <strong>Secure Boot:</strong> Deve estar ATIVADO (para instalação padrão).</li>
                <li class="flex items-center gap-2"><span class="text-yellow-500">⚠</span> <strong>SATA Mode:</strong> Defina como AHCI (não use RAID/RST se possível, pois exige drivers extras).</li>
                <li class="flex items-center gap-2"><span class="text-yellow-500">⚠</span> <strong>CSM/Legacy:</strong> Desative. Use modo UEFI puro para Windows 11.</li>
              </ul>
            </div>
          `
        }
      ]
    },
    
    {
      title: "Passo 3: Particionamento Inteligente",
      content: `<p class="mb-4 text-gray-300 leading-relaxed">Esta é a fase crítica onde os dados são apagados. Atenção total aqui.</p>`,
      subsections: [
        
        {
          subtitle: "Limpando o Disco",
          content: `
            <div class="prose prose-invert max-w-none">
              
              <p>Na tela "Onde você quer instalar o Windows?":</p>
              <ol class="list-decimal list-inside space-y-2 text-gray-300">
                <li>Identifique seu drive principal (geralmente Unidade 0).</li>
                <li>Selecione cada partição deste drive e clique em <strong>EXCLUIR</strong>.</li>
                <li>Repita até sobrar apenas um item: "Espaço Não Alocado da Unidade 0".</li>
                <li>Avançado: Se você tem um segundo HD/SSD de dados (Unidade 1), <strong>NÃO</strong> toque nele para não perder seus arquivos de backup.</li>
              </ol>
            </div>
          `
        }
      ]
    }
    ,
    {
      title: "Solução de Problemas Comuns (Troubleshooting)",
      content: `
        <div class="space-y-6">
          
          <div class="bg-[#1E1E22] p-5 rounded-lg border-l-4 border-[#8B31FF]">
            <h4 class="text-white font-bold text-lg mb-2">O instalador não encontra meu SSD/HD (Drive não aparece)</h4>
            <div class="text-gray-300 text-sm pl-4 border-l border-gray-700">
              <p class="mb-2"><strong class="text-[#8B31FF]">Solução:</strong> Falta o driver da controladora de armazenamento (Intel VMD/RST).</p>
              <ul class="list-disc list-inside text-gray-400 mt-2">
                <li>Baixe o driver 'Intel Rapid Storage Technology (IRST)' do site do fabricante do seu notebook.</li><li>Extraia os arquivos no Pen Drive de instalação.</li><li>Na tela de discos, clique em 'Carregar Driver' e selecione a pasta.</li><li>O disco aparecerá magicamente.</li>
              </ul>
            </div>
          </div>
          
          <div class="bg-[#1E1E22] p-5 rounded-lg border-l-4 border-[#8B31FF]">
            <h4 class="text-white font-bold text-lg mb-2">Erro 'Este PC não pode rodar o Windows 11'</h4>
            <div class="text-gray-300 text-sm pl-4 border-l border-gray-700">
              <p class="mb-2"><strong class="text-[#8B31FF]">Solução:</strong> Verificação de TPM/Secure Boot falhou.</p>
              <ul class="list-disc list-inside text-gray-400 mt-2">
                <li>Se seu PC é novo, ative o TPM 2.0 na BIOS (chamado de PTT na Intel ou fTPM na AMD).</li><li>Se seu PC é antigo, você deve recriar o Pen Drive usando o Rufus com as opções de 'Bypass' marcadas.</li>
              </ul>
            </div>
          </div>
          
        </div>
      `
    },
    {
      title: "Conclusão Profissional",
      content: `
        <div class="bg-gradient-to-r from-[#1E1E22] to-[#171313] p-6 rounded-xl border border-gray-800">
          <p class="mb-4 text-gray-300 leading-relaxed">
            Dominar <strong>Guia Definitivo de Instalação Limpa do Windows 11 (2025)</strong> é fundamental para garantir um ambiente digital seguro, rápido e eficiente. 
            Seguindo este guia, você aplicou configurações de nível profissional que otimizam seu fluxo de trabalho e protegem seu hardware.
          </p>
          <p class="text-gray-400 italic border-l-2 border-[#31A8FF] pl-4">
            Lembre-se: A tecnologia evolui rapidamente. Recomendamos revisar estas configurações a cada 6 meses ou sempre que houver grandes atualizações de sistema.
          </p>
        </div>
      `
    }
  ];

  const relatedGuides = [
    {
      href: "/guias/manutencao-preventiva",
      title: "Manutenção Preventiva",
      description: "Guia completo de manutenção."
    },
    {
      href: "/guias/otimizacao-performance",
      title: "Otimização Avançada",
      description: "Técnicas de otimização de sistema."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="45 min"
      difficultyLevel="Intermediário"
      contentSections={contentSections}
      relatedGuides={relatedGuides}
    />
  );
}
