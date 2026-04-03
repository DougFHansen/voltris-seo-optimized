import React from 'react';
import { GuideTemplateClient } from '@/components/GuideTemplateClient';

export default function PerformanceOBS() {
    const title = 'Como Melhorar a Performance do OBS Studio no Windows 11 (2026)';
    const description = 'Guia definitivo para encoders de vídeo. Aprenda a configurar o Windows para evitar perda de quadros (frame drops) no OBS, ativar o Hardware Accelerated GPU Scheduling e otimizar processos de fundo para uma live fluida.';
    const keywords = ['otimizar obs studio windows 11', 'reduzir lag obs live', 'aumentar fps stream windows', 'voltris optimizer obs studio', 'hardware accelerated gpu scheduling obs', 'configurar pc para stream'];

    const summaryTable = [
        { label: "Maior Inimigo", value: "Perda de Quadros por Renderização" },
        { label: "Técnica Chave", value: "GPU Scheduling & Prioridade Admin" },
        { label: "Solução Chave", value: "Deep Cleanup & Background Kill" },
        { label: "Benefício", value: "Stream Fluída (60 FPS constantes)" }
    ];

    const contentSections = [
        {
            title: "O que causa o Lag no OBS Studio?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Muitos streamers culpam a internet por quedas de quadros, mas o culpado real costuma ser o **Estresse de Renderização da GPU.** No Windows 11, se o sistema não souber que o OBS é a sua tarefa prioritária, ele redirecionará toda a potência para o jogo.
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed">
            Resultado: O jogo roda bem, mas a live para o espectador está travada em 10 FPS. Garantir que o codificador de vídeo (como o **NVENC**) tenha acesso exclusivo e rápido à GPU é o segredo para uma live profissional.
        </p>
        
        <div class="bg-indigo-500/10 border border-indigo-500/30 p-6 rounded-2xl my-6 shadow-[0_0_20px_rgba(49,168,255,0.05)]">
            <h4 class="text-indigo-400 font-black mb-2 flex items-center gap-2">HAGS: Ativar ou Desativar?</h4>
            <p class="text-gray-300 text-sm">
                O <code>Hardware Accelerated GPU Scheduling</code> é recomendado para as versões mais recentes do Windows e do OBS. Ele permite que a placa de vídeo gerencie sua própria memória, liberando a CPU para lidar com o chat, alertas e plugins pesados da live.
            </p>
        </div>
      `
        },
        {
            title: "A Importância do Modo Administrador",
            content: `
        <p class="mb-4 text-gray-300">
            Sempre execute o OBS Studio como Administrador. Isso instrui o agendador do Windows a dar ao processo <code>obs64.exe</code> permissões especiais para reservar recursos de hardware que normalmente seriam bloqueados por processos de fundo ou telemetria do Windows.
            <br/><br/>
            Para automatizar isso: 
            Propriedades do Atalho > Compatibilidade > Executar este programa como Administrador.
        </p>
      `
        },
        {
            title: "Otimizando Stream com o Voltris Optimizer",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
            O **Voltris Optimizer** é usado por diversos criadores de conteúdo para "limpar o palco" antes de cada live, removendo serviços que podem acordar durante a transmissão e causar oscilações no bitrate.
        </p>
        <ul class="space-y-4 text-slate-300">
            <li class="flex items-start gap-3"><div class="w-2 h-2 rounded-full bg-[#31A8FF] mt-1.5 shrink-0"></div> **Deep Cleanup:** Remove cache de logs e temporários que o OBS gera em excesso.</li>
            <li class="flex items-start gap-3"><div class="w-2 h-2 rounded-full bg-[#31A8FF] mt-1.5 shrink-0"></div> **Network Optimization:** Desativa o <code>Nagle's Algorithm</code> para reduzir a latência de upload da sua live.</li>
            <li class="flex items-start gap-3"><div class="w-2 h-2 rounded-full bg-[#31A8FF] mt-1.5 shrink-0"></div> **Gaming Profile:** Desativa notificações de sistema e updates automáticos que podem interromper seu momento ao vivo.</li>
        </ul>
      `
        }
    ];

    const faqItems = [
        {
            question: "Encoder de Software (x264) ou Hardware (NVENC)?",
            answer: "Se você tem uma placa NVIDIA ou AMD moderna, sempre use o encoder de hardware. Isso libera sua CPU para focar em manter o Windows estável. O Voltris otimiza ambos para garantir máxima eficiência de threads."
        },
        {
            question: "O Voltris melhora a qualidade da imagem da live?",
            answer: "Indiretamente. Ao reduzir a carga do sistema, o encoder tem mais folga para processar dados de cor e movimento, o que diminui os artefatos de compressão (blocagem) em cenas rápidas."
        }
    ];

    const relatedGuides = [
        { href: "/otimizar-windows-11-para-valorant", title: "Alta Performance", description: "Otimize os jogos que você transmite." },
        { href: "/como-diminuir-input-lag-teclado-mouse", title: "Precisão Máxima", description: "Melhore sua jogabilidade ao vivo." }
    ];

    return (
        <GuideTemplateClient
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="15 min"
            difficultyLevel="Intermediário"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
            faqItems={faqItems}
            showVoltrisOptimizerCTA={true}
            keyPoints={[
                "Configurar OBS em Modo Administrativo",
                "Ativar o Modo de Jogo para priorizar o encoder",
                "Gerenciamento de Multi-Monitor e Latência de GPU",
                "Limpeza de serviços desnecessários durante a live",
                "Otimização de rede para estabilizar o bitrate de upload"
            ]}
        />
    );
}
