import React from 'react';
import { GuideTemplateClient } from '@/components/GuideTemplateClient';

export default function LatenciaRede() {
    const title = 'Como Reduzir a Latência de Rede (Ping) em Jogos Online no Windows 11 (2026)';
    const description = 'Guia profissional para estabilizar seu sinal de rede. Aprenda a desativar o Algoritmo de Nagle, otimizar o TCP Ack Frequency e ajustar seu adaptador de rede para resposta instantânea em jogos como Valorant e CS2.';
    const keywords = ['reduzir latência rede jogos online', 'como diminuir ping windows 11', 'otimizar rede gamer', 'voltris network optimizer', 'desativar nagles algorithm windows', 'tcp ack frequency tweak'];

    const summaryTable = [
        { label: "O Inimigo das Redes", value: "Algoritmo de Nagle (Agrupamento)" },
        { label: "Ajuste Chave", value: "TCP NoDelay via MSMQ" },
        { label: "Maior Benefício", value: "Estabilidade de Ping (Zero Jitter)" },
        { label: "Frequência de Dados", value: "Interrupt Moderation desativada" }
    ];

    const contentSections = [
        {
            title: "Como o Windows 11 Lida com sua Placa de Rede?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O Windows 11 é otimizado para o usuário comum, que faz downloads grandes. Para economizar tráfego, o sistema usa o **Algoritmo de Nagle**, que espera 'encher' um pacote de dados antes de enviá-lo. 
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed">
            Em jogos como Valorant ou CS2, essa pequena espera é o que gera o <b>Lag Spike</b>. Precisamos forçar o Windows a enviar cada pequeno pacote de informação (clique, movimento, tiro) instantaneamente, sem esperar por nada.
        </p>
        
        <div class="bg-blue-500/10 border border-blue-500/30 p-6 rounded-2xl my-6">
            <h4 class="text-[#31A8FF] font-black mb-2 flex items-center gap-2">Configuração Critica: Interrupt Moderation</h4>
            <p class="text-gray-300 text-sm">
                No Gerenciador de Dispositivos, as placas de rede possuem uma configuração de <code>Iterrupt Moderation Rate</code>. Recomendamos desativar isso em cenários competitivos, permitindo que o sistema processe cada pacote no milissegundo em que ele chega.
            </p>
        </div>
      `
        },
        {
            title: "Registro Chave: TCP Ack Frequency",
            content: `
        <p class="mb-4 text-gray-300">
            Ao definir o <code>TcpAckFrequency</code> para 1, o Windows envia um pacote de confirmação imediato para cada pacote recebido, em vez de esperar e agrupar múltiplos pacotes.
            <br/><br/>
            Caminho do Registro: <code>HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters\\Interfaces</code>.
            <br/><br/>
            Isso reduz drásticamente o <b>RTT</b> (Round Trip Time) e estabiliza a experiência competitiva.
        </p>
      `
        },
        {
            title: "A Vantagem do Voltris Network Optimization",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
            O **Voltris Optimizer** automatiza toda a "sopa de letrinhas" técnica das placas de rede, configurando não apenas o Registro, mas as propriedades internas do driver.
        </p>
        <ul class="space-y-4 text-slate-300">
            <li class="flex items-start gap-3"><div class="w-2 h-2 rounded-full bg-[#31A8FF] mt-1.5 shrink-0"></div> **Packet Optimization:** Prioriza pacotes de jogos sobre tráfego de fundo (downloads de segundo plano).</li>
            <li class="flex items-start gap-3"><div class="w-2 h-2 rounded-full bg-[#31A8FF] mt-1.5 shrink-0"></div> **Net Tweak:** Desativa o limite de largura de banda que o Windows impõe para atualizações enquanto você joga.</li>
            <li class="flex items-start gap-3"><div class="w-2 h-2 rounded-full bg-[#31A8FF] mt-1.5 shrink-0"></div> **DNS Gamer:** Oferece os servidores de DNS com a menor rota física para os servidores centrais de FPS.</li>
        </ul>
      `
        }
    ];

    const faqItems = [
        {
            question: "WiFi ou Cabo Ethernet para jogar?",
            answer: "Sempre Cabo Ethernet. O sinal via ar sofre de interferência de ondas de rádio (jitter) que nenhum software de otimização consegue eliminar 100%. O Voltris ajuda a estabilizar o WiFi, mas a conexão cabeada é infininitamente superior."
        },
        {
            question: "O Voltris melhora a velocidade do meu download?",
            answer: "Indiretamente sim, ao remover gargalos artificiais do Windows. No entanto, o foco principal de nossa ferramenta na rede é a **estabilidade e baixa latência**, garantindo ping fixo."
        }
    ];

    const relatedGuides = [
        { href: "/otimizar-windows-11-para-valorant", title: "Otimização Gamer", description: "Combine baixa latência com FPS máximo." },
        { href: "/como-diminuir-input-lag-teclado-mouse", title: "Atraso Zero", description: "Otimize também o input dos seus periféricos." }
    ];

    return (
        <GuideTemplateClient
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="12 min"
            difficultyLevel="Avançado"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
            faqItems={faqItems}
            showVoltrisOptimizerCTA={true}
            keyPoints={[
                "Desativação profissional do Algoritmo de Nagle",
                "Gestão do TCP Ack Frequency no Registro",
                "Otimização de Buffers de Recebimento e Envio",
                "Priorização de tráfego de rede para jogos online",
                "Uso de DNS gamer com rota dedicada"
            ]}
        />
    );
}
