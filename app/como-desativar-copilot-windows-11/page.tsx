import React from 'react';
import { GuideTemplateClient } from '@/components/GuideTemplateClient';

export default function DesativarCopilot() {
    const title = 'Como Desativar e Remover o Copilot do Windows 11 (2026)';
    const description = 'O Copilot está consumindo sua RAM? Aprenda a desativar completamente a I.A. da Microsoft, remover o ícone da barra de tarefas e bloquear processos de telemetria da I.A.';
    const keywords = ['como desativar copilot windows 11', 'remover copilot barra de tarefas', 'desativar ia microsoft windows', 'voltris optimizer privacy shield', 'bloquear microsoft copilot telemetria', 'como tirar o copilot do windows'];

    const summaryTable = [
        { label: "Status do Copilot", value: "Ativado por Padrão" },
        { label: "Maior Consumo", value: "RAM e Telemetria de Dados" },
        { label: "Técnica Chave", value: "Gpedit.msc & Registry Tweak" },
        { label: "Resultado Esperado", value: "Barra de Tarefas Limpa e Mais RAM" }
    ];

    const contentSections = [
        {
            title: "Por que remover o Copilot do Windows 11?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          O Copilot é a nova Inteligência Artificial da Microsoft, mas para muitos usuários, ele é apenas mais um 'bloatware' que ocupa espaço visual na barra de tarefas e consome recursos de sistema continuamente no fundo.
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed">
            Além do consumo de RAM (aproximadamente 300MB a 500MB em standby), o Copilot envia dados de uso do seu Windows para os servidores de I.A. da Microsoft. Se você busca **Privacidade Total** e Performance máxima, desativá-lo é uma prioridade.
        </p>
        
        <div class="bg-indigo-500/10 border border-indigo-500/30 p-6 rounded-2xl my-6">
            <h4 class="text-indigo-400 font-black mb-2 flex items-center gap-2">Removendo o Ícone via Barra de Tarefas</h4>
            <p class="text-gray-300 text-sm">
                O passo básico é clicar com o botões direito na Barra de Tarefas > Configurações da Barra de Tarefas e desmarcar o Copilot. Isso apenas **ESCONDE** o ícone, mas o serviço continua rodando no Gerenciador de Tarefas. Para remover a raiz, precisamos de Tweaks de Registro.
            </p>
        </div>
      `
        },
        {
            title: "Desativação via Editor de Registro (HKEY)",
            content: `
        <p class="mb-4 text-gray-300">
            Você pode desativar o Copilot em toda a conta de usuário criando uma chave específica no Registro:
            <br/><br/>
            Caminho: <code>HKEY_CURRENT_USER\\Software\\Policies\\Microsoft\\Windows\\WindowsCopilot</code>.
            <br/><br/>
            Defina o valor de <b>TurnOffWindowsCopilot</b> para <b>1</b>. Isso forçará o Windows 11 a descarregar todos os módulos de I.A. da memória no próximo boot.
        </p>
      `
        },
        {
            title: "A Vantagem do Voltris Privacy Shield",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
            O **Voltris Optimizer** lida com o Copilot de forma cirúrgica, permitindo que você ative ou desative com um clique sem precisar mexer em ferramentas perigosas como o <code>Regedit</code>.
        </p>
        <ul class="space-y-4 text-slate-300">
            <li class="flex items-start gap-3"><div class="w-2 h-2 rounded-full bg-[#10b981] mt-1.5 shrink-0"></div> **Full De-AI:** Remove todos os rastreadores de inteligência artificial de uma vez.</li>
            <li class="flex items-start gap-3"><div class="w-2 h-2 rounded-full bg-[#10b981] mt-1.5 shrink-0"></div> **RAM Recovery:** Libera imediatamente o espaço ocupado pelos processos <code>msedge_ai.exe</code>.</li>
            <li class="flex items-start gap-3"><div class="w-2 h-2 rounded-full bg-[#10b981] mt-1.5 shrink-0"></div> **Telemetry Block:** Bloqueia o tráfego de dados do Copilot para os servidores da Microsoft.</li>
        </ul>
      `
        }
    ];

    const faqItems = [
        {
            question: "Ao desativar o Copilot, perco outras funções da busca?",
            answer: "Não. A busca clássica do Windows e a indexação de arquivos locais continuam funcionando perfeitamente. A única coisa removida é o assistente de I.A. online."
        },
        {
            question: "É reversível?",
            answer: "Sim. No Voltris Optimizer você pode restaurar o Copilot a qualquer momento se decidir que precisa da assistência de I.A. no futuro."
        }
    ];

    const relatedGuides = [
        { href: "/guia-definitivo-privacidade-windows-2026", title: "Privacidade Total", description: "Combine a remoção da I.A. com a proteção de dados total." },
        { href: "/remover-bloatware-windows-11", title: "Debloat", description: "Remova outros apps desnecessários do Windows." }
    ];

    return (
        <GuideTemplateClient
            title={title}
            description={description}
            keywords={keywords}
            estimatedTime="8 min"
            difficultyLevel="Médio"
            contentSections={contentSections}
            summaryTable={summaryTable}
            relatedGuides={relatedGuides}
            faqItems={faqItems}
            showVoltrisOptimizerCTA={true}
            keyPoints={[
                "Diferenciar esconder ícone de desativar serviço",
                "Gestão de processos de I.A. no Windows 11",
                "Limpeza de registros de telemetria do Copilot",
                "Otimização de RAM em sistemas com I.A. ativa",
                "Bloqueio de serviços de sugestão automática da Microsoft"
            ]}
        />
    );
}
