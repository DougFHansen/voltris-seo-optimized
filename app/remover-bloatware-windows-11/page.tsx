import React from 'react';
import { GuideTemplateClient } from '@/components/GuideTemplateClient';
import { title, description, keywords } from './metadata';

export default function RemoverBloatwareWindows() {
    const summaryTable = [
        { label: "O que é Bloatware", value: "Apps Pré-instalados Inúteis" },
        { label: "Impacto no PC", value: "Uso de RAM e Disco" },
        { label: "Solução Manual", value: "PowerShell (Complexa)" },
        { label: "Solução Automática", value: "Voltris Optimizer (Segura)" }
    ];

    const contentSections = [
        {
            title: "O que é Bloatware e por que removeê-lo?",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed text-lg">
          Ao instalar o Windows 11, o sistema "presenteia" você com dezenas de apps que você nunca pediu: OneDrive, Clipchamp, Xbox Game Bar, Widgets, e até jogos como Candy Crush. Esse é o famoso **Bloatware.**
        </p>
        <p class="mb-6 text-gray-300 leading-relaxed">
            Eles não apenas ocupam espaço em disco, mas rodam processos em segundo plano, monitoram seu uso (telemetria) e tornam a inicialização do PC mais lenta. Fazer um "Debloat" é essencial para quem busca um sistema limpo e focado em performance.
        </p>
        
        <div class="bg-red-500/10 border border-red-500/30 p-6 rounded-2xl my-6">
            <h4 class="text-red-400 font-black mb-2 flex items-center gap-2">Cuidado com Scripts Aleatórios!</h4>
            <p class="text-gray-300 text-sm">
                Existem scripts no GitHub que prometem fazer debloat, mas muitos quebram dependências essenciais (como a Microsoft Store ou o Windows Update). Use apenas métodos verificados.
            </p>
        </div>
      `
        },
        {
            title: "Método Manual: PowerShell (Remoção Profunda)",
            content: `
        <p class="mb-4 text-gray-300">
            Você pode remover apps via PowerShell com privilégios de Administrador. Para remover um app específico:
            <br/><code>Get-AppxPackage *nome-do-app* | Remove-AppxPackage</code>.
            <br/><br/>
            No entanto, remover componentes como a **Cortana** ou o **Teams** manualmente é um processo que envolve chaves de registro complexas e permissões de sistema (`TrustedInstaller`).
        </p>
      `
        },
        {
            title: "Como a Voltris Resolve: Debloat Seguro e Seletivo",
            content: `
        <p class="mb-6 text-gray-300 leading-relaxed">
            No **Voltris Optimizer**, implementamos um sistema de remoção inteligente. Ele não apenas desinstala o app, mas limpa os resíduos no Registro e nos Serviços do Windows.
        </p>
        <ul class="space-y-4 text-slate-300">
            <li class="flex items-start gap-3"><div class="w-2 h-2 rounded-full bg-[#31A8FF] mt-1.5 shrink-0"></div> **App Cleaner:** Selecione exatamente o que quer remover (OneDrive, Maps, Notícias).</li>
            <li class="flex items-start gap-3"><div class="w-2 h-2 rounded-full bg-[#31A8FF] mt-1.5 shrink-0"></div> **Service Optimization:** Desativa os serviços "zumbis" que os apps deixam para trás.</li>
            <li class="flex items-start gap-3"><div class="w-2 h-2 rounded-full bg-[#31A8FF] mt-1.5 shrink-0"></div> **Restauração:** Um Clique para criar um ponto de restauração antes de qualquer alteração profunda.</li>
        </ul>
      `
        }
    ];

    const faqItems = [
        {
            question: "Posso remover o Microsoft Edge?",
            answer: "No Windows 11, a Microsoft tornou o Edge um componente integral do sistema. Removê-lo manualmente pode quebrar funções de webview em outros apps. A Voltris recomenda desativar os processos de fundo do Edge em vez de deletar o executável."
        },
        {
            question: "O Windows Update reinstala os bloatwares?",
            answer: "Sim, atualizações grandes de versão (Feature Updates) costumam trazer de volta alguns apps patrocinados. Por isso, a ferramenta de Debloat da Voltris foi feita para ser rodada ocasionalmente após cada grande atualização do Windows."
        }
    ];

    const relatedGuides = [
        { href: "/guias/debloating-windows-11", title: "Guia Original", description: "O guia clássico de remoção manual." },
        { href: "/melhores-programas-otimizar-windows", title: "Top Otimizadores", description: "Compare as ferramentas de mercado." }
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
                "Identificar o que é e o que não é lixo no sistema",
                "Riscos de scripts de otimização automatizados",
                "Como usar o PowerShell de Administrador com segurança",
                "O diferencial da Voltris: Remoção seletiva sem quebras",
                "Manutenção pós-atualização do Windows"
            ]}
        />
    );
}
