import { Metadata } from 'next';
import { GuideTemplate, createGuideMetadata } from '@/components/GuideTemplate';

const title = "Tela Azul MEMORY_MANAGEMENT Windows 10/11: Diagnóstico e Correção (2026)";
const description = "Seu PC reinicia sozinho com erro de memória? Aprenda a usar o mdsched do Windows, testar pentes de RAM com MemTest86 e identificar drivers corrompidos.";
const keywords = ['tela azul memory management', 'bsod memory_management fix', 'teste memoria ram windows', 'mdsched tutorial', 'memtest86 como usar', 'xmp causando tela azul'];

export const metadata: Metadata = createGuideMetadata('tela-azul-memory-management-fix', title, description, keywords);

export default function MemoryBSODGuide() {
    const summaryTable = [
        { label: "Causa Principal", value: "RAM Defeituosa" },
        { label: "Causa Secundária", value: "Driver de Vídeo" },
        { label: "Ferramenta", value: "MemTest86" },
        { label: "Risco", value: "Dados" }
    ];

    const contentSections = [
        {
            title: "O que é MEMORY_MANAGEMENT?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
          Este erro (Stop Code 0x0000001A) indica que o Windows tentou ler ou gravar dados na Memória RAM e encontrou corrupção física ou endereçamento inválido. Em 70% dos casos, um dos seus pentes de memória está "morrendo". Nos outros 30%, é um driver bagunçando a memória.
        </p>
      `,
            subsections: []
        },
        {
            title: "Passo 1: Diagnóstico Rápido (Sem baixar nada)",
            content: `
        <p class="mb-4 text-gray-300">
            Vamos usar a ferramenta nativa do Windows para testar a RAM.
        </p>
        <ol class="list-decimal list-inside text-gray-300 space-y-2 ml-4 mb-6">
            <li>Pressione <strong>Win + R</strong>.</li>
            <li>Digite: <code class="text-green-400">mdsched.exe</code> e dê Enter.</li>
            <li>Selecione "Reiniciar agora e verificar se há problemas".</li>
        </ol>
        <p class="text-gray-300 bg-blue-900/20 p-4 rounded border-l-4 border-blue-500">
            Seu PC vai reiniciar e entrar numa tela azul (estilo DOS) fazendo testes passivos. Vai demorar uns 15 minutos. Se aparecer "Problemas de hardware foram detectados", você tem um pente de RAM estragado.
        </p>
      `,
            subsections: []
        },
        {
            title: "Passo 2: Incompatibilidade XMP/DOCP",
            content: `
        <p class="mb-4 text-gray-300">
            Às vezes a RAM está boa, mas o overclock automático (XMP) está instável.
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-2">
            <li>Entre na <strong>BIOS</strong> (Del ou F2 ao ligar).</li>
            <li>Procure por <strong>XMP</strong> (Intel) ou <strong>DOCP/EXPO</strong> (AMD).</li>
            <li>Desative (Coloque em "Auto" ou "Disabled").</li>
            <li>Salve e teste o PC por um dia. Se parar de dar tela azul, sua placa-mãe não aguenta a velocidade máxima da memória. Tente atualizar a BIOS.</li>
        </ul>
      `
        },
        {
            title: "Passo 3: A Solução de Software (Drivers)",
            content: `
            <p class="text-gray-300 mb-4">
                Se a RAM passou no teste, pode ser um driver vazando memória.
            </p>
            <ol class="list-decimal list-inside text-gray-300 ml-4">
                <li>Abra o CMD como Administrador.</li>
                <li>Digite: <code class="text-yellow-400">sfc /scannow</code> (Repara arquivos do sistema).</li>
                <li>Atualize seu driver de vídeo (GPU) fazendo uma "Instalação Limpa" (Opção do instalador da NVIDIA/AMD).</li>
            </ol>
        `
        }
    ];

    return (
        <GuideTemplate
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="30 min"
            difficultyLevel="Avançado"
            contentSections={contentSections}
            summaryTable={summaryTable}
        />
    );
}
