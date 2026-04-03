import React from 'react';
import { GuideTemplateClient } from '@/components/GuideTemplateClient';

export default function LoLPerformance() {
    const title = 'Como Otimizar o Windows 11 para League of Legends (2026) | FPS Máximo';
    const description = 'Sua partida de LoL está com lag? Aprenda a otimizar o Windows 11 para conseguir FPS estável no League of Legends, reduzir o ping e eliminar o travamento no client.';
    const keywords = ['otimizar windows 11 league of legends', 'aumentar fps lol 2026 windows', 'como tirar lag league of legends pc', 'voltris optimizer lol performance', 'configurações ótimas league of legends windows', 'client league of legends lento fix'];

    const summaryTable = [
        { label: "Maior Gargalo", value: "CPU Única Core e Picos de RAM" },
        { label: "Maior Benefício", value: "FPS Estável em Team Fights" },
        { label: "Técnica Chave", value: "CPU Affinity & RAM Squeezer" },
        { label: "Resultado Esperado", value: "Client Rápido e Partida Fluida" }
    ];

    const contentSections = [
        {
            title: "Por que o LoL trava em PCs bons?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O League of Legends é um jogo muito mais dependente da <b>CPU single-core</b> do que da placa de vídeo. Isso significa que, mesmo com uma RTX 4090, se o Windows estiver ocupando o núcleo principal do processador com telemetria ou Windows Update, o LoL sofrerá com quedas.
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed">
            O <b>Client da Riot</b> (Riot Client) é conhecido por consumir RAM excessiva em segundo plano mesmo quando você está na partida. Monitorar e gerenciar esse processo é essencial para manter a partida fluida durante os team fights.
        </p>
        <div class="bg-blue-500/10 border border-blue-500/30 p-6 rounded-2xl my-6">
            <h4 class="text-[#31A8FF] font-black mb-2">Configuração Critica: Timer Resolution</h4>
            <p class="text-gray-300 text-sm">
                O Windows 11 usa um timer de 15.6ms para agendar processos. Reduzir o Timer Resolution para 0.5ms garante que o agendador entregue ciclos de CPU para o LoL com muito mais frequência, reduzindo os picos de frametime que causam o engasgo visual.
            </p>
        </div>
      `
        },
        {
            title: "Otimizando a RAM para o Client e a Partida",
            content: `
        <p class="mb-4 text-gray-300">
            Antes de entrar em uma partida, é fundamental liberar a memória RAM do sistema. O Riot Client pode reservar até 1GB de RAM mesmo após você entrar no jogo.
            <br/><br/>
            Com o Voltris Optimizer, você executa um <b>RAM Squeezer profissional</b> em segundos, devolvendo essa memória para a engine do jogo e garantindo FPS estável nos momentos de maior ação.
        </p>
      `
        },
        {
            title: "Dominando com o Voltris Optimizer: LoL DNA",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
            O <b>Voltris Optimizer</b> possui tweaks específicos para o ecossistema da Riot Games.
        </p>
        <ul class="space-y-4 text-slate-300">
            <li class="flex items-start gap-3"><div class="w-2 h-2 rounded-full bg-[#10b981] mt-1.5 shrink-0"></div> <b>Timer Override:</b> Força o agendador do Windows para ciclos mais curtos, beneficiando jogos single-core.</li>
            <li class="flex items-start gap-3"><div class="w-2 h-2 rounded-full bg-[#10b981] mt-1.5 shrink-0"></div> <b>Network Boost:</b> Prioriza os pacotes de dados do servidor LoL sobre qualquer outra aplicação de rede.</li>
            <li class="flex items-start gap-3"><div class="w-2 h-2 rounded-full bg-[#10b981] mt-1.5 shrink-0"></div> <b>Deep Cleanup:</b> Remove logs massivos que o Riot Client gera no <code>AppData</code>.</li>
        </ul>
      `
        }
    ];

    const faqItems = [
        { question: "Usar o Voltris no LoL pode dar ban?", answer: "Não. O Voltris atua apenas no sistema operacional, sendo completamente invisível para o Vanguard (anti-cheat da Riot)." },
        { question: "O FPS máximo do LoL é 144hz?", answer: "O jogo suporta FPS ilimitado. Com o Voltris, muitos usuários relatam ultrapassar os 300 FPS em monitores de alta taxa de atualização." }
    ];

    const relatedGuides = [
        { href: "/otimizar-windows-11-para-valorant", title: "Valorant FPS", description: "Outros jogos da Riot otimizados." },
        { href: "/reduzir-latencia-rede-jogos-online", title: "Ping Baixo", description: "Reduza o ping para os servidores da Riot." }
    ];

    return (
        <GuideTemplateClient
            title={title} description={description} keywords={keywords}
            estimatedTime="12 min" difficultyLevel="Intermediário"
            contentSections={contentSections} summaryTable={summaryTable}
            relatedGuides={relatedGuides} faqItems={faqItems}
            showVoltrisOptimizerCTA={true}
            keyPoints={[
                "Otimização de Timer Resolution para jogos single-core",
                "Gestão de RAM do Riot Client em segundo plano",
                "Prioridade de rede para servidores competitivos",
                "Limpeza de logs e caches do ecossistema Riot Games",
                "Desativação de telemetria durante partidas ranqueadas"
            ]}
        />
    );
}
