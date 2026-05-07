import React from 'react';
import { GuideTemplateClient } from '@/components/GuideTemplateClient';

export default function GuiaPrivacidade() {
    const title = 'Guia Definitivo de Privacidade do Windows 11 (2026) | Como se Proteger';
    const description = 'Pare de ser rastreado pela Microsoft. Aprenda a desativar a telemetria, o histórico de atividades e as IDs de anúncio para ter um sistema 100% privado e mais rápido.';
    const keywords = ['guia definitivo privacidade windows 11', 'como desativar telemetria windows 2026', 'bloquear rastreamento microsoft windows', 'voltris privacy shield', 'privacidade total no pc', 'desativar histórico de atividades windows'];

    const summaryTable = [
        { label: "Nível de Privacidade", value: "Crítico por Padrão" },
        { label: "O que é Rastreado", value: "Uso de Teclado, Cliques e Localização" },
        { label: "Técnica Chave", value: "Host Blocking & Telemetry Disable" },
        { label: "Impacto no PC", value: "Privacidade e Menos Carga de Rede" }
    ];

    const contentSections = [
        {
            title: "O Windows 11 está 'espiando' você?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Muitos não percebem, mas o Windows 11 envia gigabytes de dados para os servidores da Microsoft todos os meses. Isso inclui o que você digita (para 'aprendizado de escrita'), o tempo que você gasta em cada app e até a sua localização aproximada.
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed">
            Esse monitoramento constante não apenas fere sua privacidade, mas consome processamento e largura de banda, o que pode causar picos de lag em jogos e lentidão ao alternar entre janelas.
        </p>
        
        <div class="bg-red-500/10 border border-red-500/30 p-6 rounded-2xl my-6">
            <h4 class="text-red-400 font-black mb-2 flex items-center gap-2">ID do Anunciante: O Outdoor Digital</h4>
            <p class="text-gray-300 text-sm">
                O Windows cria uma ID única para o seu dispositivo, permitindo que anunciantes rastreiem seu comportamento entre diferentes apps do sistema. Desativar isso é o primeiro passo para ter um sistema limpo.
            </p>
        </div>
      `
        },
        {
            title: "Desativando a Telemetria Profunda (OOBE e Registro)",
            content: `
        <p class="mb-4 text-gray-300">
            A forma mais eficaz de bloquear a espionagem da Microsoft é através do arquivo <code>hosts</code> ou desativando os serviços <code>DiagTrack</code> (Experiências de Usuário Conectado e Telemetria).
            <br/><br/>
            Ao bloquear esses domínios, seu computador para de 'relatar' seu comportamento para os servidores em Redmond, tornando a sua navegação privada de forma nativa.
        </p>
      `
        },
        {
            title: "O Escudo do Voltris Optimizer: Privacy Shield",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
            O **Voltris Optimizer** agrupa mais de 300 configurações de privacidade em um único lugar, permitindo que você blinde seu PC com segurança.
        </p>
        <ul class="space-y-4 text-slate-300">
            <li class="flex items-start gap-3"><div class="w-2 h-2 rounded-full bg-[#31A8FF] mt-1.5 shrink-0"></div> **App Permissions:** Desativa câmeras e microfones para apps que não precisam de acesso.</li>
            <li class="flex items-start gap-3"><div class="w-2 h-2 rounded-full bg-[#31A8FF] mt-1.5 shrink-0"></div> **Activity Eraser:** Limpa o histórico de atividades que é sincronizado com a nuvem da Microsoft.</li>
            <li class="flex items-start gap-3"><div class="w-2 h-2 rounded-full bg-[#31A8FF] mt-1.5 shrink-0"></div> **Hosts Blocker:** Impede o envio de telemetria bloqueando o domínio <code>vortex.data.microsoft.com</code>.</li>
        </ul>
      `
        }
    ];

    const faqItems = [
        {
            question: "Ao desativar a telemetria, as atualizações param de funcionar?",
            answer: "Não. O Voltris separa os serviços de Telemetria dos serviços do Windows Update. Você continuará recebendo correções de segurança críticas, mas sem o rastreamento excessivo."
        },
        {
            question: "O Windows fica instável sem a telemetria?",
            answer: "Não. Na verdade, ele fica mais estável. A telemetria é um processo adicional; removê-la significa menos variáveis rodando em segundo plano que podem causar conflitos ou travamentos."
        }
    ];

    const relatedGuides = [
        { href: "/desativar-servicos-desnecessarios-windows-11", title: "Serviços", description: "Otimize os processos que rodam junto com a telemetria." },
        { href: "/remover-bloatware-windows-11", title: "Debloat", description: "Remova os apps que espionam seu comportamento." }
    ];

    return (
        <GuideTemplateClient
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="20 min"
            difficultyLevel="Avançado"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
            faqItems={faqItems}
            showVoltrisOptimizerCTA={true}
            keyPoints={[
                "Configuração profissional de ID de Anunciantes",
                "Desativação de telemetria profunda DiagTrack",
                "Bloqueio de domínios de rastreamento via Hosts",
                "Gestão de histórico de atividades e sincronização na nuvem",
                "Otimização de permissões de aplicativos de background"
            ]}
        />
    );
}
