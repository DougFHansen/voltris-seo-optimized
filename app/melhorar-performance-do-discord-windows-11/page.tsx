import React from 'react';
import { GuideTemplateClient } from '@/components/GuideTemplateClient';

export default function DiscordPerformance() {
    const title = 'Como Melhorar a Performance do Discord no Windows 11 (2026)';
    const description = 'Seu Discord está lento ou travando durante as streams? Aprenda as melhores configurações para o Discord no Windows 11, como reduzir o consumo de CPU e ganhar mais FPS nos seus jogos.';
    const keywords = ['como acelerar discord windows 11', 'discord com lag na stream fix', 'aumentar fps com discord aberto', 'voltris discord optimizer', 'melhorar performance discord pc fraco', 'configurar discord modo desempenho'];

    const summaryTable = [
        { label: "Maior Gargalo", value: "Aceleração de Hardware Inadequada" },
        { label: "Maior Benefício", value: "Ganhos de 10-15 FPS com Discord Aberto" },
        { label: "Técnica Chave", value: "Hardware Acceleration & Overlay Tweak" },
        { label: "Resultado Esperado", value: "Navegação e Streams Ultra Fluidas" }
    ];

    const contentSections = [
        {
            title: "Por que o Discord está travando o seu Windows 11?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O **Discord** é construído em uma plataforma chamada Electron, o que o torna basicamente um navegador camuflado. Isso consome grandes lotes de memória RAM e processamento de GPU de forma constante, competindo com o seu jogo favorito.
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed">
            Se você sente engasgos (*stuttering*) ao transmitir sua tela ou se a sua voz está robotizada, o problema pode estar na forma como o Windows gerencia a prioridade do app social. Calibrar o uso de **Aceleração Gráfica** é o primeiro passo.
        </p>
        
        <div class="bg-indigo-500/10 border border-indigo-500/30 p-6 rounded-2xl my-6">
            <h4 class="text-indigo-400 font-black mb-2 flex items-center gap-2">HGS On vs Off: O Conflito Invisível</h4>
            <p class="text-gray-300 text-sm">
                O Agendamento de GPU do Windows 11 pode se confundir quando o Discord usa aceleração de hardware. Se a sua stream de tela está com lag para quem assiste, desligar a <b>Aceleração de Hardware</b> no Discord forçará a CPU a lidar com a interface, deixando a GPU livre 100% para o jogo.
            </p>
        </div>
      `
        },
        {
            title: "Removendo o Overlay (O Maior Assassino de FPS)",
            content: `
        <p class="mb-4 text-gray-300">
            O **Game Overlay** do Discord é uma camada visual injetada no topo do seu jogo. Em jogos competitivos como Valorant ou CS:GO, isso pode introduzir **Input Lag** no mouse e reduzir o desempenho da taxa de quadros.
            <br/><br/>
            Sempre sugerimos desativar o overlay sistêmico em <b>Configurações do Usuário > Sobreposição de Jogo</b> para garantir a pureza da engine e melhor performance no Windows.
        </p>
      `
        },
        {
            title: "Otimização Profissional com o Voltris Optimizer: Discord DNA",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
            O **Voltris Optimizer** lida com o gerenciamento de recursos do seu Discord através da ferramenta de <code>Community App Guard</code>.
        </p>
        <ul class="space-y-4 text-slate-300">
            <li class="flex items-start gap-3"><div class="w-2 h-2 rounded-full bg-[#10b981] mt-1.5 shrink-0"></div> **Real-Time RAM Squeezer:** Limpa o lixo de cache que as previews de links e vídeos do Discord vão deixando na RAM.</li>
            <li class="flex items-start gap-3"><div class="w-2 h-2 rounded-full bg-[#10b981] mt-1.5 shrink-0"></div> **App High Priority:** Garante que o barramento de áudio do seu microfone tenha prioridade sobre o Windows Update.</li>
            <li class="flex items-start gap-3"><div class="w-2 h-2 rounded-full bg-[#10b981] mt-1.5 shrink-0"></div> **Deep Cleanup:** Remove Gigabytes de arquivos temporários e logs antigos das pastas <code>AppData/Roaming/Discord</code>.</li>
        </ul>
      `
        }
    ];

    const faqItems = [
        {
            question: "Limpando o cache do Discord, eu apago minhas mensagens?",
            answer: "Não. Suas conversas estão na nuvem da Discord. Limpar o cache remove apenas as imagens e vídeos que você já viu e que estão pesando no carregamento local do software."
        },
        {
            question: "O Voltris resolve o lag ao transmitir para meus amigos?",
            answer: "Certamente. Ao otimizar a rede e o agendamento de GPU do Windows, a sua transmissão terá um bitrate mais estável e com zero perda de quadros."
        }
    ];

    const relatedGuides = [
        { href: "/melhorar-performance-obs-studio-windows", title: "OBS Performance", description: "Melhore também o desempenho da sua gravação." },
        { href: "/desativar-aplicativos-segundo-plano-windows-11", title: "Apps de Fundo", description: "Otimize também outros processos que rodando junto com o Discord." }
    ];

    return (
        <GuideTemplateClient
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="10 min"
            difficultyLevel="Iniciante"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
            faqItems={faqItems}
            showVoltrisOptimizerCTA={true}
            keyPoints={[
                "Configuração profissional de aceleração de hardware de GPU",
                "Gestão profissional de impacto de overlay de jogo",
                "Limpeza absoluta de caches e logs do banco de dados Discord",
                "Otimização de rede e prioridade de áudio absoluta no Windows 11",
                "Bloqueio de solicitações de telemetria desnecessárias do app"
            ]}
        />
    );
}
