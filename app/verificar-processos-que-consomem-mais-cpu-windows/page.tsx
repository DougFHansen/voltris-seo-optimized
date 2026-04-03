import React from 'react';
import { GuideTemplateClient } from '@/components/GuideTemplateClient';

export default function CpuDiagnostic() {
    const title = 'Como Verificar Processos que Consomem Mais CPU no Windows 11 (2026)';
    const description = 'Seu PC está lento sem motivo? Aprenda a identificar e eliminar processos que estão consumindo CPU sem necessidade no Windows 11, usando o Gerenciador de Tarefas e ferramentas avançadas.';
    const keywords = ['verificar processos cpu alto windows 11', 'como ver o que consome cpu windows', 'processo consumindo 100 cpu windows 11', 'voltris diagnostic deep scan', 'identificar processo pesado windows', 'tarefa usando muita cpu solução'];

    const summaryTable = [
        { label: "Sintoma", value: "PC Lento Sem Motivo Aparente" },
        { label: "Maior Benefício", value: "Identificar e Eliminar o Culpado" },
        { label: "Técnica Chave", value: "Task Manager & Process Monitor" },
        { label: "Resultado Esperado", value: "CPU Livre para o que Importa" }
    ];

    const contentSections = [
        {
            title: "Por que a CPU pode atingir 100% mesmo sem abrir nada?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Muitos processos do Windows 11 trabalham intensamente em segundo plano: o <b>Service Host (SvcHost)</b>, o <b>Windows Defender</b> realizando scans, o <b>Windows Update</b> baixando patches, e até mineradores de criptomoedas que podem ter entrado sorrateiramente por malware.
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed">
            Identificar o culpado é o primeiro passo. Para isso, o Gerenciador de Tarefas nativo é o ponto de partida, mas ferramentas avançadas como o <b>Process Monitor (Sysinternals)</b> revelam com muito mais precisão o que está consumindo o seu processador.
        </p>
        <div class="bg-blue-500/10 border border-blue-500/30 p-6 rounded-2xl my-6">
            <h4 class="text-[#31A8FF] font-black mb-2">Segredo: Coluna de Impacto de Inicialização</h4>
            <p class="text-gray-300 text-sm">
                No Gerenciador de Tarefas, aba <b>Inicializar Aplicativos</b>, a coluna "Impacto na inicialização" diz exatamente quais apps estão fazendo seu Windows demorar para ligar. Elimine tudo que for "Alto" e deixe apenas o essencial.
            </p>
        </div>
      `
        },
        {
            title: "Os Piores Ofensores de CPU no Windows 11",
            content: `
        <p class="mb-4 text-gray-300">
            Processos que mais consomem CPU desnecessariamente:
            <br/><br/>
            1. <b>MsMpEng.exe</b> — Antivírus fazendo scan. Pode ser agendado para horários específicos.
            <br/>
            2. <b>TiWorker.exe</b> — Instalação de updates em background. Bloqueável com o Voltris.
            <br/>
            3. <b>SearchIndexer.exe</b> — Indexação de arquivos. Configurável para horários ociosos.
            <br/>
            4. <b>Runtime Broker</b> — Gerenciamento de permissões de apps UWP. Controlável por políticas.
        </p>
      `
        },
        {
            title: "Scan Profundo com o Voltris Deep Diagnostic",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
            O <b>Voltris Optimizer</b> realiza um scan completo e identifica automaticamente os processos suspeitos.
        </p>
        <ul class="space-y-4 text-slate-300">
            <li class="flex items-start gap-3"><div class="w-2 h-2 rounded-full bg-[#10b981] mt-1.5 shrink-0"></div> <b>Process Rank:</b> Lista os 10 maiores consumidores de CPU em tempo real.</li>
            <li class="flex items-start gap-3"><div class="w-2 h-2 rounded-full bg-[#10b981] mt-1.5 shrink-0"></div> <b>Safe Kill:</b> Encerra processos inúteis com segurança sem arriscar instabilidade.</li>
            <li class="flex items-start gap-3"><div class="w-2 h-2 rounded-full bg-[#10b981] mt-1.5 shrink-0"></div> <b>Scheduler Control:</b> Move scans pesados para horários em que seu PC está ocioso.</li>
        </ul>
      `
        }
    ];

    const faqItems = [
        { question: "Posso encerrar qualquer processo pelo Task Manager?", answer: "Não. Encerrar processos do sistema como csrss.exe ou winlogon.exe causa tela azul. O Voltris identifica quais são seguros de encerrar." },
        { question: "CPU em 100% pode ser vírus?", answer: "Sim. Se um processo desconhecido estiver consumindo CPU permanentemente, use o Voltris para escaneá-lo antes de agir." }
    ];

    const relatedGuides = [
        { href: "/desativar-servicos-desnecessarios-windows-11", title: "Serviços Inúteis", description: "Elimine serviços que consomem CPU desnecessariamente." },
        { href: "/melhorar-velocidade-inicializacao-windows-11", title: "Inicialização Rápida", description: "Reduza os processos que iniciam com o Windows." }
    ];

    return (
        <GuideTemplateClient
            title={title} description={description} keywords={keywords}
            estimatedTime="12 min" difficultyLevel="Intermediário"
            contentSections={contentSections} summaryTable={summaryTable}
            relatedGuides={relatedGuides} faqItems={faqItems}
            showVoltrisOptimizerCTA={true}
            keyPoints={[
                "Identificar processos ocultos via Task Manager avançado",
                "Agendar scans do Defender para horários ociosos",
                "Bloquear instalação de updates em background",
                "Controlar indexação de arquivos no horário de uso",
                "Detectar processos suspeitos (malware/mineradores)"
            ]}
        />
    );
}
