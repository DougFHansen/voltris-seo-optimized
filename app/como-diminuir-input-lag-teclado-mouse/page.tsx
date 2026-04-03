import React from 'react';
import { GuideTemplateClient } from '@/components/GuideTemplateClient';

export default function InputLagPerifericos() {
    const title = 'Como Diminuir o Input Lag do Mouse e Teclado no Windows 11 (2026)';
    const description = 'Guia completo para reduzir a latência de periféricos. Aprenda a ajustar o Polling Rate, desativar a aceleração do mouse via registro e otimizar a taxa de atualização do teclado para resposta instantânea.';
    const keywords = ['diminuir input lag mouse', 'remover aceleração mouse windows 11', 'otimizar latência teclado', 'voltris optimizer input lag', 'polling rate 1000hz windows', 'mouse acceleration registry'];

    const summaryTable = [
        { label: "O que é Input Lag", value: "Atraso entre o clique e a ação" },
        { label: "Maior Culpado", value: "Interrupt Moderation da Lan/USB" },
        { label: "Ajuste Chave", value: "Timer Resolution (0.5ms)" },
        { label: "Consequência", value: "Mira mais fluida e direta 1:1" }
    ];

    const contentSections = [
        {
            title: "O Problema da Aceleração do Mouse (Enhance Pointer Precision)",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O Windows 11 vem com um recurso de "Precisão do Ponteiro" ativado por padrão. Ironicamente, ele faz o oposto para jogadores: ele varia a velocidade do cursor baseada na velocidade do movimento da sua mão. 
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed">
            Isso quebra a **Memória Muscular.** Para ter precisão no <code>headshot</code>, 1cm no seu mousepad deve SEMPRE resultar na mesma distância na tela. Desativar isso via Painel de Controle é o básico, mas existem chaves de registro ocultas que mantêm resíduos de aceleração.
        </p>
        
        <div class="bg-amber-500/10 border border-amber-500/30 p-6 rounded-2xl my-6">
            <h4 class="text-amber-400 font-black mb-2 flex items-center gap-2">Interrupt Moderation: O "Serial Killer" do Clique</h4>
            <p class="text-gray-300 text-sm">
                As controladoras USB do Windows tentam economizar energia agrupando interrupções. Isso gera um intervalo de espera minúsculo, mas que os Pro Players sentem como um "floaty mouse". Desativar a economia de energia em todos os hubs USB no Gerenciador de Dispositivos é vital.
            </p>
        </div>
      `
        },
        {
            title: "Otimizando a Taxa de Resposta (Polling Rate)",
            content: `
        <p class="mb-4 text-gray-300">
            Maus modernos operam a <code>1000Hz</code>, <code>4000Hz</code> ou até <code>8000Hz</code>. Se o seu Windows não estiver otimizado para lidar com essa enxurrada de dados, você sentirá quedas de FPS ao mover o mouse rapidamente.
            <br/><br/>
            Para os teclados, o ajuste de <b>Repeat Delay</b> no Registro deve ser reduzido para o valor mínimo (0), permitindo que comandos sucessivos sejam lidos sem o atraso nativo do sistema operacional.
        </p>
      `
        },
        {
            title: "A Solução Automática da Voltris: Zero Latency",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
            O **Voltris Optimizer** atua diretamente na camada de comunicação entre o hardware e o software (Kernel). Com um clique, ele aplica o famoso <code>Mouse Registry Fix</code>.
        </p>
        <ul class="space-y-4 text-slate-300">
            <li class="flex items-start gap-3"><div class="w-2 h-2 rounded-full bg-[#31A8FF] mt-1.5 shrink-0"></div> **Timer Precision:** Sincroniza o timer do sistema para 0.500ms constantes (Superior ao Timer Resolution comum).</li>
            <li class="flex items-start gap-3"><div class="w-2 h-2 rounded-full bg-[#31A8FF] mt-1.5 shrink-0"></div> **USB Latency Fix:** Desativa seletivamente a economia de energia dos periféricos de jogo.</li>
            <li class="flex items-start gap-3"><div class="w-2 h-2 rounded-full bg-[#31A8FF] mt-1.5 shrink-0"></div> **Interrupt Affinity:** Garante que o processamento do mouse não seja interrompido por tarefas de áudio ou rede.</li>
        </ul>
      `
        }
    ];

    const faqItems = [
        {
            question: "Polling Rate de 8000Hz causa queda de FPS?",
            answer: "Sim, em CPUs menos potentes, o processamento de 8 mil interrupções por segundo pode drenar recursos. O Voltris Optimizer ajuda a mitigar isso ao otimizar a prioridade do agendador de tarefas do Windows."
        },
        {
            question: "Timer Resolution em 0.5ms diminui a vida do PC?",
            answer: "Não. Isso apenas faz com que o Windows verifique tarefas mais frequentemente. A única 'desvantagem' real é um aumento ínfimo no consumo de energia em notebooks no modo bateria."
        }
    ];

    const relatedGuides = [
        { href: "/otimizar-windows-11-para-valorant", title: "Otimização Gamer", description: "Combine baixa latência com FPS máximo." },
        { href: "/desativar-telemetria-windows", title: "Limpeza Total", description: "Remova o lag causado pelo rastreamento do sistema." }
    ];

    return (
        <GuideTemplateClient
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="10 min"
            difficultyLevel="Avançado"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
            faqItems={faqItems}
            showVoltrisOptimizerCTA={true}
            keyPoints={[
                "Remoção completa da aceleração do mouse via Registro",
                "Ajuste da taxa de repetição do teclado",
                "Otimização das controladoras USB (Interrupts)",
                "Configuração do System Timer para 0.5ms",
                "Desativação de economia de energia de periféricos"
            ]}
        />
    );
}
