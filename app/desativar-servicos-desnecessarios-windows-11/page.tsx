import React from 'react';
import { GuideTemplateClient } from '@/components/GuideTemplateClient';

export default function DesativarServicos() {
    const title = 'Quais Serviços Desativar no Windows 11 para Melhorar a Performance (2026)';
    const description = 'Guia completo e seguro sobre serviços do Windows. Aprenda quais processos desativar para liberar RAM e CPU sem comprometer a estabilidade do sistema.';
    const keywords = ['desativar serviços desnecessários windows 11', 'serviços seguros para desativar', 'otimizar windows 11 pelos serviços', 'voltris optimizer service manager', 'melhorar velocidade pc serviços', 'guia de serviços windows 11'];

    const summaryTable = [
        { label: "Número de Serviços", value: "+200 serviços no Windows 11" },
        { label: "Maior Benefício", value: "Menos consumo de RAM e CPU" },
        { label: "Técnica Chave", value: "Services.msc & Voltris SVC Manager" },
        { label: "Risco Principal", value: "Perda de conectividade se feito errado" }
    ];

    const contentSections = [
        {
            title: "O que são Serviços e por que o Windows 11 tem tantos?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Serviços são pequenos programas que rodam "atrás das cortinas" desde o momento em que você liga o computador. O grande problema é que o Windows 11 ativa dezenas de serviços focados em tablets, sensores que você não tem e impressoras que você nunca usará.
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed">
            Cada serviço ativo consome uma fatia da sua memória RAM e, periodicamente, solicita processamento da sua CPU para verificar <code>status</code>. Em computadores voltados para jogos ou edição, o acúmulo desses micro-processos gera o <b>Latency Spike</b> (picos de latência).
        </p>
        
        <div class="bg-blue-500/10 border border-blue-500/30 p-6 rounded-2xl my-6">
            <h4 class="text-[#31A8FF] font-black mb-2 flex items-center gap-2">Regra de Ouro: Manual vs Desativado</h4>
            <p class="text-gray-300 text-sm">
                Sempre que possível, coloque um serviço em <code>Manual</code> em vez de Desativado. No modo Manual, o serviço só acorda se um programa realmente solicitar ele. Isso preserva a estabilidade do sistema.
            </p>
        </div>
      `
        },
        {
            title: "Três Serviços de 'Alto Impacto' para Otimizar Agora",
            content: `
        <p class="mb-4 text-gray-300">
            Alguns serviços são famosos por drenar recursos sem que o usuário perceba:
            <br/><br/>
            1. <b>SysMain (Antigo Superfetch):</b> Preenche sua RAM antecipadamente com apps 'prováveis'. Em SSDs modernos, ele causa mais lentidão por excesso de escrita do que ganho real de velocidade.
            <br/><br/>
            2. <b>Distributed Link Tracking Client:</b> Mantém links entre arquivos na rede. Se você não usa compartilhamento de arquivos em rede local complexa, pode ser desativado.
            <br/><br/>
            3. <b>Windows Search Indexer:</b> Se você não costuma pesquisar o conteúdo <i>dentro</i> de todos os seus arquivos a cada minuto, o indexador pode ser configurado para indexar apenas áreas essenciais.
        </p>
      `
        },
        {
            title: "Gerenciamento Inteligente com Voltris Optimizer",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
            O **Voltris Optimizer** elimina o risco de 'quebrar' o sistema. Nosso gerenciador de serviços possui perfis testados em larga escala para diferentes perfis de uso.
        </p>
        <ul class="space-y-4 text-slate-300">
            <li class="flex items-start gap-3"><div class="w-2 h-2 rounded-full bg-[#31A8FF] mt-1.5 shrink-0"></div> **Safe Tweak:** Desativa apenas o que é 100% inútil para o usuário comum.</li>
            <li class="flex items-start gap-3"><div class="w-2 h-2 rounded-full bg-[#31A8FF] mt-1.5 shrink-0"></div> **Gaming Mode:** Corta serviços de impressão e telemetria profunda para o máximo desempenho gamer.</li>
            <li class="flex items-start gap-3"><div class="w-2 h-2 rounded-full bg-[#31A8FF] mt-1.5 shrink-0"></div> **Rollback:** Um clique para voltar no tempo e restaurar as configurações originais da Microsoft.</li>
        </ul>
      `
        }
    ];

    const faqItems = [
        {
            question: "Posso desativar o Windows Defender (Segurança)?",
            answer: "A Voltris desaconselha desativar totalmente a segurança, a menos que você tenha uma alternativa profissional. O que o Voltris Optimizer faz é otimizar o escaneamento do Defender para que ele não inicie no meio do seu jogo."
        },
        {
            question: "A internet vai parar de carregar se eu mexer nos serviços?",
            answer: "Somente se você mexer nos protocolos de rede essenciais (TCP/IP). Nossos perfis de otimização preservam todos os serviços de DNS e DHCP necessários para a navegação fluida."
        }
    ];

    const relatedGuides = [
        { href: "/melhorar-performance-obs-studio-windows", title: "Otimização de Live", description: "Combine com a melhoria da sua transmissão." },
        { href: "/desativar-telemetria-windows", title: "Privacidade Total", description: "O foco definitivo em remover rastreadores." }
    ];

    return (
        <GuideTemplateClient
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="15 min"
            difficultyLevel="Médio"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
            faqItems={faqItems}
            showVoltrisOptimizerCTA={true}
            keyPoints={[
                "Diferenciar serviços essenciais de itens de telemetria",
                "Otimização de serviços de impressão e rede",
                "Gestão do SysMain para SSDs e HDDs",
                "Configuração do modo 'Manual' para máxima estabilidade",
                "Remoção de serviços de telemetria indesejados"
            ]}
        />
    );
}
