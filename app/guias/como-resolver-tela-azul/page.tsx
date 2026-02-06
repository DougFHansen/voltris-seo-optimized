import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

export const guideMetadata = {
  id: 'como-resolver-tela-azul',
  title: "Tela Azul (BSOD): Guia Completo de Diagnóstico e Correção (2026)",
  description: "Seu PC reinicia sozinho? Aprenda a analisar arquivos Minidump, usar o BlueScreenView e identificar se o erro é Driver, RAM ou superaquecimento.",
  category: 'windows-erros',
  difficulty: 'Avançado',
  time: '40 min'
};

const title = "Guia Definitivo BSOD: Como Ler Códigos de Erro e Salvar seu PC";
const description = "Uma Tela Azul da Morte não é aleatória. Ela deixa pistas. Vamos usar ferramentas forenses para descobrir exatamente qual driver ou peça está causando o crash.";

const keywords = [
  'como consertar tela azul windows 11',
  'bluescreenview tutorial download',
  'analisar arquivo dmp minidump',
  'erro critical_process_died fix',
  'memory_management blue screen ram check',
  'irql_not_less_or_equal driver fix',
  'page_fault_in_nonpaged_area solução',
  'whea_uncorrectable_error cpu overclock'
];

export const metadata: Metadata = createGuideMetadata('como-resolver-tela-azul', title, description, keywords);

export default function BSODGuide() {
  const summaryTable = [
    { label: "Ferramenta 1", value: "BlueScreenView" },
    { label: "Ferramenta 2", value: "MemTest86 (RAM)" },
    { label: "Causa Comum", value: "Drivers Antigos" },
    { label: "Causa Crítica", value: "Fonte / RAM Defeituosa" },
    { label: "Comando CMD", value: "sfc /scannow" },
    { label: "Segurança", value: "Fazer Backup Antes" },
    { label: "Dificuldade", value: "Avançado" }
  ];

  const contentSections = [
    {
      title: "O que o Windows está tentando te dizer?",
      content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          A Tela Azul (BSOD) é um mecanismo de proteção. O Windows encontrou um erro tão grave que, se continuasse rodando, poderia corromper seus dados permanentemente. Então ele para tudo.
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed">
           Todo crash gera um arquivo "Minidump" em <code>C:\\Windows\\Minidump</code>. Esse arquivo é a caixa-preta do avião.
        </p>

        <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20 my-8">
            <h4 class="text-[#31A8FF] font-bold mb-3 flex items-center gap-2">
                <span class="text-xl">🩺</span> Voltris System Doctor
            </h4>
            <p class="text-gray-300 mb-4">
                Analisar códigos hexadecimais é difícil. O <strong>Voltris Optimizer</strong> possui um leitor de logs integrado que traduz o código de erro "0x0000000A" para português claro (ex: "Falha no Driver da Nvidia").
            </p>
            <a href="/voltrisoptimizer" class="group relative inline-flex px-8 py-3 bg-gradient-to-r from-[#31A8FF] via-[#8B31FF] to-[#FF4B6B] text-white font-bold text-base rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-[1.03] hover:shadow-[0_0_60px_rgba(139,49,255,0.4)] items-center justify-center gap-2">
                Diagnosticar Meu PC
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
            </a>
        </div>
      `
    },
    {
      title: "Códigos de Erro Mais Comuns e Soluções",
      content: `
        <div class="space-y-4">
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-red-400 font-bold mb-1">MEMORY_MANAGEMENT</h4>
                <p class="text-gray-400 text-sm">
                    <strong>Causa Provável:</strong> Memória RAM defeituosa ou mal encaixada.
                    <br/><strong>Solução:</strong> Tire os pentes de memória, limpe os contatos com borracha branca escolar (sem forçar) e teste um pente de cada vez. Rode o "Diagnóstico de Memória do Windows".
                </p>
            </div>
            
            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-red-400 font-bold mb-1">IRQL_NOT_LESS_OR_EQUAL</h4>
                <p class="text-gray-400 text-sm">
                    <strong>Causa Provável:</strong> Driver tentando acessar memória que não deve. Geralmente driver de Rede, Áudio ou GPU.
                    <br/><strong>Solução:</strong> Atualize todos os drivers (Chipset, LAN, GPU). Se instalou algo novo recentemente, desinstale.
                </p>
            </div>

            <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-red-400 font-bold mb-1">WHEA_UNCORRECTABLE_ERROR</h4>
                <p class="text-gray-400 text-sm">
                    <strong>Causa Provável:</strong> Erro físico de hardware (CPU/GPU) ou Overclock instável.
                    <br/><strong>Solução:</strong> Se você fez Overclock na BIOS (XMP, PBO, Curve Optimizer), DESFAÇA. Resete a BIOS para "Load Optimized Defaults". Se persistir, sua CPU pode estar degradada ou superaquecendo.
                </p>
            </div>

             <div class="bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                <h4 class="text-red-400 font-bold mb-1">CRITICAL_PROCESS_DIED</h4>
                <p class="text-gray-400 text-sm">
                    <strong>Causa Provável:</strong> O Windows perdeu acesso ao disco onde está instalado.
                    <br/><strong>Solução:</strong> Verifique se o cabo do SSD está bem conectado. O SSD pode estar morrendo. Faça backup URGENTE.
                </p>
            </div>
        </div>
      `
    }
  ];

  const advancedContentSections = [
    {
      title: "Reparando o Windows via CMD (SFC e DISM)",
      content: `
            <div class="bg-gray-800/50 p-6 rounded-xl border border-gray-700 mb-8">
                <h4 class="text-emerald-400 font-bold mb-4 text-xl">Kit de Primeiros Socorros</h4>
                <p class="text-gray-300 mb-4">
                    Antes de formatar, tente reparar os arquivos de sistema corrompidos.
                </p>
                <ol class="list-decimal list-inside text-gray-300 text-sm space-y-3 font-mono">
                    <li>Abra o CMD como Administrador.</li>
                    <li>Rode: <code class="text-[#31A8FF]">sfc /scannow</code> (Isso verifica arquivos DLL do Windows).</li>
                    <li>Se ele disser que "encontrou arquivos corrompidos mas não pôde corrigir", rode o comando pesado:</li>
                    <li><code class="text-[#31A8FF]">DISM /Online /Cleanup-Image /RestoreHealth</code> (Isso baixa arquivos novos direto dos servidores da Microsoft).</li>
                    <li>Reinicie o PC.</li>
                </ol>
            </div>
            `
    },
    {
      title: "Usando o BlueScreenView",
      content: `
            <p class="mb-4 text-gray-300">
                O <strong>BlueScreenView</strong> é um programa leve e gratuito da NirSoft.
                <br/>1. Baixe e abra (não precisa instalar).
                <br/>2. Ele vai listar todos os crashes.
                <br/>3. Clique no topo da lista (o mais recente).
                <br/>4. Olhe a colunas "Caused By Driver". Se estiver escrito <code>nvlddmkm.sys</code>, é culpa da Nvidia. Se for <code>ntoskrnl.exe</code>, é genérico (pode ser RAM).
            </p>
            `
    }
  ];

  const additionalContentSections = [
    {
      title: "Tela Azul ao jogar?",
      content: `
            <p class="mb-4 text-gray-300">
                Se o crash só acontece em jogos pesados, provavelmente é <strong>Fonte de Alimentação (PSU)</strong> ou <strong>Superaquecimento</strong>.
                <br/>Monitore a temperatura. Se a GPU passar de 85°C ou CPU passar de 95°C, eles podem desligar o PC para não queimar.
                <br/>Se as temperaturas estão boas, sua fonte pode não estar aguentando os picos de energia (Transient Spikes) da placa de vídeo.
            </p>
            `
    }
  ];

  const faqItems = [
    {
      question: "Formatando resolve?",
      answer: "Se o problema for driver ou vírus, SIM. Se o problema for peça queimada (Hardware), NÃO. Formatar não conserta pente de memória estragado. Por isso diagnostique antes de formatar."
    },
    {
      question: "O PC reinicia sem tela azul, direto pro boot?",
      answer: "Isso geralmente é Fonte (PSU). A proteção OCP (Over Current Protection) da fonte dispara e corta a energia instantaneamente. Troque a fonte."
    }
  ];

  const externalReferences = [
    { name: "BlueScreenView Download (NirSoft)", url: "https://www.nirsoft.net/utils/blue_screen_view.html" },
    { name: "MemTest86 Free", url: "https://www.memtest86.com/" }
  ];

  const relatedGuides = [
    {
      href: "/guias/como-usar-ddu-driver-uninstaller",
      title: "DDU Guide",
      description: "Resolve BSOD causado por driver de vídeo."
    },
    {
      href: "/guias/verificar-saude-hd-ssd-crystaldiskinfo",
      title: "Saúde do SSD",
      description: "Verifique se seu disco está causando o crash."
    },
    {
      href: "/guias/monitorar-temperatura-pc",
      title: "Temperaturas",
      description: "Monitore o aquecimento antes do PC desligar."
    }
  ];

  return (
    <GuideTemplate
      title={title}
      description={description}
      keywords={keywords}
      estimatedTime="40 min"
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