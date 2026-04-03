import React from 'react';
import { GuideTemplateClient } from '@/components/GuideTemplateClient';

export default function MouseAcceleration() {
    const title = 'Como Corrigir o Mouse Acelerando Sozinho no Windows 11 (2026)';
    const description = 'Seu cursor está se movendo de forma estranha ou acelerando sem controle? Aprenda a desativar a aceleração do mouse no Windows 11 para ter ponteiro 1:1 e maior precisão nos jogos.';
    const keywords = ['como desativar aceleração do mouse windows 11', 'mouse acelerando sozinho solução', 'ponteiro mouse impreciso windows 11', 'voltris latency optimizer mouse', 'enhance pointer precision off windows', 'configurar sensibilidade mouse gamer'];

    const summaryTable = [
        { label: "O Problema", value: "Ponteiro Move em Velocidade Variável" },
        { label: "Maior Benefício", value: "Resposta 1:1 e Mira Consistente" },
        { label: "Técnica Chave", value: "Enhance Pointer Precision OFF & Raw Input" },
        { label: "Resultado Esperado", value: "Precisão Máxima em Every Click" }
    ];

    const contentSections = [
        {
            title: "O que é a Aceleração do Mouse e por que prejudica?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Por padrão, o Windows 11 ativa o recurso <b>Aprimorar Precisão do Ponteiro</b> (Enhance Pointer Precision). Esse recurso ajusta a velocidade do cursor baseado na <i>rapidez</i> com que você move o mouse — quanto mais rápido você move, mais distância o cursor percorre.
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed">
            Para o uso cotidiano isso parece conveniente, mas para jogadores competitivos, isso destrói a consistência da mira. Cada movimento do mouse precisa ser 1:1, puro e previsível.
        </p>
        <div class="bg-red-500/10 border border-red-500/30 p-6 rounded-2xl my-6">
            <h4 class="text-red-400 font-black mb-2">Desativando via Configurações</h4>
            <p class="text-gray-300 text-sm">
                Caminho: <b>Painel de Controle {`>`} Mouse {`>`} Opções do Ponteiro {`>`} desmarcar "Aprimorar a precisão do ponteiro"</b>. Este é o passo número 1 de qualquer setup competitivo sério.
            </p>
        </div>
      `
        },
        {
            title: "Raw Input: O Padrão Dos Pros",
            content: `
        <p class="mb-4 text-gray-300">
            Nos jogos modernos como Valorant e CS2, existe uma opção de <b>Raw Input</b> que bypassa completamente as configurações do Windows e lê o sensor do mouse diretamente. Ativar isso dentro do jogo garante que nem mesmo o Windows possa interferir no movimento da sua mira.
            <br/><br/>
            Com o Voltris, garantimos que o driver de mouse tenha prioridade de interrupção máxima para que nem Raw Input encontre latência de sistema.
        </p>
      `
        },
        {
            title: "Calibração Profissional com o Voltris",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
            O <b>Voltris Optimizer</b> oferece controle total sobre a cadeia de input de periféricos.
        </p>
        <ul class="space-y-4 text-slate-300">
            <li class="flex items-start gap-3"><div class="w-2 h-2 rounded-full bg-[#10b981] mt-1.5 shrink-0"></div> <b>Pointer Precision OFF:</b> Desativa via Registro para tornar permanente.</li>
            <li class="flex items-start gap-3"><div class="w-2 h-2 rounded-full bg-[#10b981] mt-1.5 shrink-0"></div> <b>USB Polling Priority:</b> Garante que o mouse seja lido no máximo de 1000Hz sem interrupções.</li>
            <li class="flex items-start gap-3"><div class="w-2 h-2 rounded-full bg-[#10b981] mt-1.5 shrink-0"></div> <b>SPI Speed Fix:</b> Corrige valores de velocidade de ponteiro do Registro para a escala correta de 6/11.</li>
        </ul>
      `
        }
    ];

    const faqItems = [
        { question: "O DPI do mouse afeta a aceleração?", answer: "Não diretamente. O DPI é a sensibilidade do sensor físico e não está relacionado à aceleração do software do Windows. O ideal é usar DPI alto no mouse e sensibilidade baixa no jogo, sem aceleração." },
        { question: "O Voltris funciona com mouses wireless?", answer: "Sim. Otimizamos o receptor USB sem fio para polling de baixa latência, garantindo a mesma precisão de um mouse com fio." }
    ];

    const relatedGuides = [
        { href: "/como-diminuir-input-lag-teclado-mouse", title: "Input Lag Zero", description: "Combine com baixíssima latência de teclado e mouse." },
        { href: "/melhores-configuracoes-de-som-para-jogos-windows", title: "Áudio de Elite", description: "Complete seu setup competitivo com som preciso." }
    ];

    return (
        <GuideTemplateClient
            title={title} description={description} keywords={keywords}
            estimatedTime="8 min" difficultyLevel="Iniciante"
            contentSections={contentSections} summaryTable={summaryTable}
            relatedGuides={relatedGuides} faqItems={faqItems}
            showVoltrisOptimizerCTA={true}
            keyPoints={[
                "Desativar Enhance Pointer Precision permanentemente",
                "Configurar Raw Input nos jogos competitivos",
                "Corrigir escala de velocidade do ponteiro (6/11)",
                "Otimizar polling rate do receptor USB",
                "Eliminar interferência do Windows no sensor do mouse"
            ]}
        />
    );
}
